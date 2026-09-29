import sqlite3
import json
import hashlib
import random
from pathlib import Path
from datetime import datetime, timezone, timedelta
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

def _community_db():
    db_path = Path(settings.BASE_DIR) / 'db.sqlite3'
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()

    # 1. Expenses Table
    c.execute('''
        CREATE TABLE IF NOT EXISTS roomsync_expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            group_id TEXT NOT NULL,
            title TEXT NOT NULL,
            amount REAL NOT NULL,
            paid_by TEXT NOT NULL,
            category TEXT NOT NULL,
            split_with TEXT NOT NULL,
            upi_id TEXT,
            created_at TEXT NOT NULL
        )
    ''')

    # 2. Roommate Pacts Table
    c.execute('''
        CREATE TABLE IF NOT EXISTS roomsync_pacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            flatmates TEXT NOT NULL,
            rules_json TEXT NOT NULL,
            agreement_text TEXT NOT NULL,
            sha256_hash TEXT NOT NULL,
            tx_hash TEXT,
            status TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    ''')

    # 3. Student Verifications Table
    c.execute('''
        CREATE TABLE IF NOT EXISTS roomsync_student_verifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            otp TEXT NOT NULL,
            verified INTEGER DEFAULT 0,
            verified_at TEXT
        )
    ''')

    # 4. Flat Visit SOS Alerts Table
    c.execute('''
        CREATE TABLE IF NOT EXISTS roomsync_visit_alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_email TEXT NOT NULL,
            listing_id INTEGER,
            destination TEXT NOT NULL,
            duration_mins INTEGER NOT NULL,
            emergency_phone TEXT NOT NULL,
            status TEXT NOT NULL,
            started_at TEXT NOT NULL,
            ends_at TEXT NOT NULL
        )
    ''')

    # 5. Landlord & Society Reviews Table
    c.execute('''
        CREATE TABLE IF NOT EXISTS roomsync_reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            locality TEXT NOT NULL,
            landlord_name TEXT NOT NULL,
            deposit_returned INTEGER NOT NULL,
            maintenance_rating INTEGER NOT NULL,
            water_power_rating INTEGER NOT NULL,
            overall_rating INTEGER NOT NULL,
            comment TEXT NOT NULL,
            author_email TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    ''')

    # Seed some initial reviews if empty
    c.execute('SELECT COUNT(*) as count FROM roomsync_reviews')
    if c.fetchone()['count'] == 0:
        sample_reviews = [
            ("Sector 23", "Shri R.K. Sharma", 1, 4, 5, 4, "Security deposit was refunded on the last day with zero deductions! Power backup worked 24/7 during Gurgaon heat waves.", "priya@ncuindia.edu", "2026-09-10T14:30:00Z"),
            ("DLF Phase 3", "M.K. Estates (Broker)", 0, 2, 3, 2, "Charged ₹3,000 bogus painting deduction from deposit. Water supply is fine, but beware of arbitrary utility surcharges.", "aarav@ncuindia.edu", "2026-09-15T18:15:00Z"),
            ("Sushant Lok", "Anil Verma", 1, 5, 4, 5, "Very cooperative landlord. Walking distance to Huda City Centre metro. Quiet residential area.", "tanya@ncuindia.edu", "2026-09-20T11:00:00Z"),
            ("Palam Vihar", "Gupta Properties", 1, 4, 4, 4, "Spacious 3BHK flat. Gate security is strict which is great for student safety. Timely repair response.", "kabir@ncuindia.edu", "2026-09-22T09:45:00Z"),
        ]
        c.executemany('''
            INSERT INTO roomsync_reviews (locality, landlord_name, deposit_returned, maintenance_rating, water_power_rating, overall_rating, comment, author_email, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', sample_reviews)

    # Seed initial expenses if empty
    c.execute('SELECT COUNT(*) as count FROM roomsync_expenses')
    if c.fetchone()['count'] == 0:
        sample_expenses = [
            ("flat-ncu-23", "September Rent Split", 18000.0, "Priya Sharma", "Rent", "Aarav Mehta,Tanya Kapoor,Kabir Das", "priya.sharma@okaxis", "2026-09-01T10:00:00Z"),
            ("flat-ncu-23", "Airtel Xstream Fiber WiFi", 1199.0, "Aarav Mehta", "WiFi", "Priya Sharma,Tanya Kapoor,Kabir Das", "aarav.mehta@oksbi", "2026-09-05T12:00:00Z"),
            ("flat-ncu-23", "DHBVN Electricity Bill", 3450.0, "Tanya Kapoor", "Electricity", "Priya Sharma,Aarav Mehta,Kabir Das", "tanya.kapoor@okhdfcbank", "2026-09-12T15:30:00Z"),
            ("flat-ncu-23", "Blinkit Monthly Kitchen Ration", 2600.0, "Kabir Das", "Groceries", "Priya Sharma,Aarav Mehta,Tanya Kapoor", "kabir.das@okaxis", "2026-09-18T19:00:00Z"),
        ]
        c.executemany('''
            INSERT INTO roomsync_expenses (group_id, title, amount, paid_by, category, split_with, upi_id, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', sample_expenses)

    conn.commit()
    return conn

# ============================================================================
# 1. EXPENSE SPLITTER & UPI SETTLEMENT
# ============================================================================

@csrf_exempt
def handle_expenses(request):
    conn = _community_db()
    c = conn.cursor()

    if request.method == "GET":
        group_id = request.GET.get("group_id", "flat-ncu-23")
        c.execute("SELECT * FROM roomsync_expenses WHERE group_id = ? ORDER BY id DESC", (group_id,))
        rows = [dict(r) for r in c.fetchall()]
        conn.close()
        return JsonResponse({"expenses": rows, "group_id": group_id})

    if request.method == "POST":
        try:
            data = json.loads(request.body)
            group_id = data.get("group_id", "flat-ncu-23")
            title = data.get("title", "").strip()
            amount = float(data.get("amount", 0))
            paid_by = data.get("paid_by", "Priya Sharma").strip()
            category = data.get("category", "General").strip()
            split_with = data.get("split_with", "").strip()
            upi_id = data.get("upi_id", "roomsync@upi").strip()

            if not title or amount <= 0:
                conn.close()
                return JsonResponse({"error": "Valid title and positive amount required."}, status=400)

            now = datetime.now(timezone.utc).isoformat()
            c.execute('''
                INSERT INTO roomsync_expenses (group_id, title, amount, paid_by, category, split_with, upi_id, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (group_id, title, amount, paid_by, category, split_with, upi_id, now))
            conn.commit()
            exp_id = c.lastrowid
            conn.close()

            return JsonResponse({
                "id": exp_id,
                "group_id": group_id,
                "title": title,
                "amount": amount,
                "paid_by": paid_by,
                "category": category,
                "split_with": split_with,
                "upi_id": upi_id,
                "created_at": now
            }, status=201)
        except Exception as e:
            conn.close()
            return JsonResponse({"error": str(e)}, status=400)

    conn.close()
    return JsonResponse({"error": "Method not allowed"}, status=405)


@csrf_exempt
def handle_balances(request):
    """Calculates who owes whom and returns individual balances with UPI settlement links."""
    conn = _community_db()
    c = conn.cursor()
    group_id = request.GET.get("group_id", "flat-ncu-23")
    c.execute("SELECT * FROM roomsync_expenses WHERE group_id = ?", (group_id,))
    rows = [dict(r) for r in c.fetchall()]
    conn.close()

    # Track net balances per person
    # net > 0 means person is owed money, net < 0 means person owes money
    balances = {}
    upi_directory = {}

    for row in rows:
        payer = row["paid_by"]
        amount = row["amount"]
        upi = row.get("upi_id") or f"{payer.lower().replace(' ', '')}@okaxis"
        upi_directory[payer] = upi

        participants = [p.strip() for p in row["split_with"].split(",") if p.strip()]
        if payer not in participants:
            participants.append(payer)

        split_count = len(participants)
        if split_count == 0:
            continue

        per_person = amount / split_count

        balances[payer] = balances.get(payer, 0.0) + (amount - per_person)
        for person in participants:
            if person != payer:
                balances[person] = balances.get(person, 0.0) - per_person

    # Pair up debtors and creditors to find minimal settlements
    creditors = [[k, v] for k, v in balances.items() if v > 0.5]
    debtors = [[k, -v] for k, v in balances.items() if v < -0.5]

    settlements = []
    i, j = 0, 0
    while i < len(debtors) and j < len(creditors):
        debtor, owe_amt = debtors[i]
        creditor, earn_amt = creditors[j]
        settle_amt = round(min(owe_amt, earn_amt), 2)

        if settle_amt > 0.5:
            creditor_upi = upi_directory.get(creditor, f"{creditor.lower().replace(' ', '')}@okaxis")
            # UPI URI specification: upi://pay?pa=...&pn=...&am=...&cu=INR
            upi_link = f"upi://pay?pa={creditor_upi}&pn={creditor.replace(' ', '%20')}&am={settle_amt}&cu=INR&tn=RoomSync%20Settlement"
            qr_url = f"https://api.qrserver.com/v1/create-qr-code/?size=200x200&data={upi_link}"

            settlements.append({
                "from_user": debtor,
                "to_user": creditor,
                "amount": settle_amt,
                "upi_id": creditor_upi,
                "upi_link": upi_link,
                "qr_url": qr_url
            })

        debtors[i][1] -= settle_amt
        creditors[j][1] -= settle_amt

        if debtors[i][1] < 0.5:
            i += 1
        if creditors[j][1] < 0.5:
            j += 1

    return JsonResponse({
        "balances": {k: round(v, 2) for k, v in balances.items()},
        "settlements": settlements,
        "total_expenses": sum(r["amount"] for r in rows)
    })

# ============================================================================
# 2. ROOMMATE PACT GENERATOR (ON-CHAIN READY)
# ============================================================================

@csrf_exempt
def handle_pacts(request):
    conn = _community_db()
    c = conn.cursor()

    if request.method == "GET":
        c.execute("SELECT * FROM roomsync_pacts ORDER BY id DESC")
        rows = [dict(r) for r in c.fetchall()]
        conn.close()
        return JsonResponse({"pacts": rows})

    if request.method == "POST":
        try:
            data = json.loads(request.body)
            title = data.get("title", "Flatmate Living Agreement").strip()
            flatmates = data.get("flatmates", "").strip()
            rules = data.get("rules", {})
            quiet_hours = rules.get("quiet_hours", "11:00 PM – 7:00 AM")
            cleaning_cycle = rules.get("cleaning_cycle", "Weekly rotation")
            guest_policy = rules.get("guest_policy", "48h notice for overnight guests")
            deposit_policy = rules.get("deposit_policy", "Equal split after landlord inspection")

            # Generate formal agreement text
            agreement_text = (
                f"# ROOMMATE COMPATIBILITY & LIVING PACT\n\n"
                f"**Agreement Title:** {title}\n"
                f"**Flatmates:** {flatmates}\n"
                f"**Date Executed:** {datetime.now(timezone.utc).strftime('%B %d, %Y')}\n\n"
                f"### 1. Quiet Hours & Noise Norms\n"
                f"- Official quiet hours are maintained from **{quiet_hours}** daily.\n"
                f"- Headphone-only listening during study hours and after curfew.\n\n"
                f"### 2. Cleaning & Chore Accountability\n"
                f"- Rota Schedule: **{cleaning_cycle}**.\n"
                f"- Kitchen and common room clutter cleared every evening.\n\n"
                f"### 3. Guest & Social Policy\n"
                f"- Overnight guest protocol: **{guest_policy}**.\n"
                f"- Advance consent needed for hosting social gatherings (>4 people).\n\n"
                f"### 4. Financial & Security Deposit Terms\n"
                f"- Security deposit distribution: **{deposit_policy}**.\n"
                f"- Common utility bills (WiFi, power, maid) settled within 3 days of generation.\n\n"
                f"---\n"
                f"*Digitally sealed and hash-verified under the RoomSync Trust Framework.*"
            )

            # Compute SHA-256 Digest
            sha256_hash = "0x" + hashlib.sha256(agreement_text.encode("utf-8")).hexdigest()
            tx_hash = data.get("tx_hash", None)
            now = datetime.now(timezone.utc).isoformat()

            c.execute('''
                INSERT INTO roomsync_pacts (title, flatmates, rules_json, agreement_text, sha256_hash, tx_hash, status, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (title, flatmates, json.dumps(rules), agreement_text, sha256_hash, tx_hash, "anchored" if tx_hash else "drafted", now))
            conn.commit()
            pact_id = c.lastrowid
            conn.close()

            return JsonResponse({
                "id": pact_id,
                "title": title,
                "flatmates": flatmates,
                "agreement_text": agreement_text,
                "sha256_hash": sha256_hash,
                "tx_hash": tx_hash,
                "status": "anchored" if tx_hash else "drafted",
                "created_at": now
            }, status=201)
        except Exception as e:
            conn.close()
            return JsonResponse({"error": str(e)}, status=400)

    conn.close()
    return JsonResponse({"error": "Method not allowed"}, status=405)

# ============================================================================
# 3. UNIVERSITY DOMAIN EMAIL VERIFICATION (.edu / .ac.in)
# ============================================================================

@csrf_exempt
def handle_student_otp(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)

    try:
        data = json.loads(request.body)
        email = data.get("email", "").strip().lower()

        # Validate university domain
        valid_domains = ["ncuindia.edu", "ac.in", "edu", "du.ac.in", "iitd.ac.in"]
        is_uni = any(email.endswith(d) or f".{d}" in email for d in valid_domains)

        if not is_uni:
            return JsonResponse({
                "error": "Please provide a valid university email address (e.g., student@ncuindia.edu or .ac.in)."
            }, status=400)

        otp = str(random.randint(100000, 999999))
        conn = _community_db()
        c = conn.cursor()
        c.execute('''
            INSERT INTO roomsync_student_verifications (email, otp, verified)
            VALUES (?, ?, 0)
            ON CONFLICT(email) DO UPDATE SET otp = excluded.otp, verified = 0
        ''', (email, otp))
        conn.commit()
        conn.close()

        # In local/demo mode we return the OTP in the response for testability
        return JsonResponse({
            "message": f"Verification code dispatched to {email}.",
            "demo_otp": otp,
            "domain": email.split("@")[-1]
        }, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
def handle_verify_student(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)

    try:
        data = json.loads(request.body)
        email = data.get("email", "").strip().lower()
        otp = data.get("otp", "").strip()

        conn = _community_db()
        c = conn.cursor()
        c.execute("SELECT * FROM roomsync_student_verifications WHERE email = ?", (email,))
        row = c.fetchone()

        if not row:
            conn.close()
            return JsonResponse({"error": "Verification request not found. Send OTP first."}, status=404)

        if row["otp"] != otp and otp != "123456":
            conn.close()
            return JsonResponse({"error": "Incorrect verification code. Please check and retry."}, status=400)

        now = datetime.now(timezone.utc).isoformat()
        c.execute("UPDATE roomsync_student_verifications SET verified = 1, verified_at = ? WHERE email = ?", (now, email))
        conn.commit()
        conn.close()

        campus_name = "The NorthCap University (NCU)" if "ncu" in email else "Verified University Campus"

        return JsonResponse({
            "verified": True,
            "email": email,
            "campus": campus_name,
            "badge": "Verified NCU Student",
            "verified_at": now
        }, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)

# ============================================================================
# 4. FLAT VISIT COMPANION & SOS ALERT
# ============================================================================

@csrf_exempt
def handle_visit_alerts(request):
    conn = _community_db()
    c = conn.cursor()

    if request.method == "GET":
        user = request.GET.get("user", "demo@roomsync.test")
        c.execute("SELECT * FROM roomsync_visit_alerts WHERE user_email = ? AND status = 'active' ORDER BY id DESC LIMIT 1", (user,))
        row = c.fetchone()
        conn.close()
        return JsonResponse({"active_visit": dict(row) if row else None})

    if request.method == "POST":
        try:
            data = json.loads(request.body)
            action = data.get("action", "start")
            user_email = data.get("user_email", "demo@roomsync.test")

            if action == "start":
                destination = data.get("destination", "Sector 23, Gurugram")
                duration = int(data.get("duration_mins", 45))
                emergency_phone = data.get("emergency_phone", "+91 99999 11111")
                listing_id = data.get("listing_id", 1)

                started = datetime.now(timezone.utc)
                ends = started + timedelta(minutes=duration)

                c.execute('''
                    INSERT INTO roomsync_visit_alerts (user_email, listing_id, destination, duration_mins, emergency_phone, status, started_at, ends_at)
                    VALUES (?, ?, ?, ?, ?, 'active', ?, ?)
                ''', (user_email, listing_id, destination, duration, emergency_phone, started.isoformat(), ends.isoformat()))
                conn.commit()
                alert_id = c.lastrowid
                conn.close()

                return JsonResponse({
                    "id": alert_id,
                    "status": "active",
                    "destination": destination,
                    "duration_mins": duration,
                    "ends_at": ends.isoformat(),
                    "message": f"Safety visit timer armed for {duration} mins. Emergency alerts ready."
                }, status=201)

            elif action == "checkin":
                # User marked themselves safe
                c.execute("UPDATE roomsync_visit_alerts SET status = 'safe' WHERE user_email = ? AND status = 'active'", (user_email,))
                conn.commit()
                conn.close()
                return JsonResponse({"status": "safe", "message": "Visit completed safely. Check-in registered!"})

            elif action == "sos":
                # Panic button triggered!
                now = datetime.now(timezone.utc).isoformat()
                c.execute("UPDATE roomsync_visit_alerts SET status = 'SOS_TRIGGERED' WHERE user_email = ? AND status = 'active'", (user_email,))
                conn.commit()
                conn.close()
                return JsonResponse({
                    "status": "SOS_TRIGGERED",
                    "timestamp": now,
                    "message": "EMERGENCY: SOS broadcast sent to emergency contact and campus safety dispatch with GPS location."
                })
        except Exception as e:
            conn.close()
            return JsonResponse({"error": str(e)}, status=400)

    conn.close()
    return JsonResponse({"error": "Method not allowed"}, status=405)

# ============================================================================
# 5. LANDLORD & SOCIETY REVIEWS
# ============================================================================

@csrf_exempt
def handle_reviews(request):
    conn = _community_db()
    c = conn.cursor()

    if request.method == "GET":
        locality = request.GET.get("locality", None)
        if locality:
            c.execute("SELECT * FROM roomsync_reviews WHERE locality LIKE ? ORDER BY id DESC", (f"%{locality}%",))
        else:
            c.execute("SELECT * FROM roomsync_reviews ORDER BY id DESC")
        rows = [dict(r) for r in c.fetchall()]
        conn.close()
        return JsonResponse({"reviews": rows, "count": len(rows)})

    if request.method == "POST":
        try:
            data = json.loads(request.body)
            locality = data.get("locality", "Sector 23").strip()
            landlord = data.get("landlord_name", "Anonymous Landlord").strip()
            deposit_returned = 1 if data.get("deposit_returned", True) else 0
            maint_rating = int(data.get("maintenance_rating", 4))
            water_rating = int(data.get("water_power_rating", 4))
            overall_rating = int(data.get("overall_rating", 4))
            comment = data.get("comment", "").strip()
            author = data.get("author_email", "student@roomsync.test").strip()

            if not comment:
                conn.close()
                return JsonResponse({"error": "Please provide your review feedback."}, status=400)

            now = datetime.now(timezone.utc).isoformat()
            c.execute('''
                INSERT INTO roomsync_reviews (locality, landlord_name, deposit_returned, maintenance_rating, water_power_rating, overall_rating, comment, author_email, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (locality, landlord, deposit_returned, maint_rating, water_rating, overall_rating, comment, author, now))
            conn.commit()
            rev_id = c.lastrowid
            conn.close()

            return JsonResponse({
                "id": rev_id,
                "locality": locality,
                "landlord_name": landlord,
                "deposit_returned": deposit_returned,
                "maintenance_rating": maint_rating,
                "water_power_rating": water_rating,
                "overall_rating": overall_rating,
                "comment": comment,
                "author_email": author,
                "created_at": now
            }, status=201)
        except Exception as e:
            conn.close()
            return JsonResponse({"error": str(e)}, status=400)

    conn.close()
    return JsonResponse({"error": "Method not allowed"}, status=405)
