from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import hashlib
import hmac
import secrets
import sqlite3
from datetime import datetime, timezone
from copy import deepcopy
from pathlib import Path

from django.conf import settings

from ml.matching.engine import rank_matches
from ml.verification.trust import listing_trust
from ml.safety.risk import safety_report
from ml.nlp.analyser import analyse_agreement

DEMO_PROFILE = {"name": "Demo student", "city": "Gurugram", "budget_min": 10000, "budget_max": 18000, "sleep_hour": 23, "cleanliness": 4, "noise_tolerance": 2, "study_style": "late", "food": "veg", "smoking": "never", "guests_frequency": 2}
DEMO_CANDIDATES = [
    {"id": 1, "name": "Aarav Mehta", "city": "Gurugram", "budget_min": 11000, "budget_max": 17000, "sleep_hour": 23, "cleanliness": 4, "noise_tolerance": 2, "study_style": "late", "food": "veg", "smoking": "never", "guests_frequency": 2},
    {"id": 2, "name": "Ishita Rao", "city": "Gurugram", "budget_min": 8000, "budget_max": 12000, "sleep_hour": 1, "cleanliness": 3, "noise_tolerance": 4, "study_style": "late", "food": "egg", "smoking": "occasionally", "guests_frequency": 4},
    {"id": 3, "name": "Kabir Singh", "city": "Noida", "budget_min": 12000, "budget_max": 18000, "sleep_hour": 22, "cleanliness": 5, "noise_tolerance": 1, "study_style": "early", "food": "veg", "smoking": "never", "guests_frequency": 1},
]

LOCALITIES = ["Sector 23", "Sector 40", "Sushant Lok", "DLF Phase 3", "Palam Vihar", "South City 1", "Sector 57", "Golf Course Road", "Nirvana Country", "MG Road"]
ROOM_AMENITIES = [["WiFi", "Fridge", "Kitchen"], ["AC", "Parking", "Power Backup"], ["WiFi", "Washing Machine", "Cook"], ["TV", "Kitchen", "Gated society"]]
SYNTHETIC_LISTINGS = [{
    "id": index + 1,
    "title": f"Sunlit room near {locality}",
    "owner": ["Aarav Mehta", "Ishita Rao", "Kabir Singh", "Meera Kapoor"][index % 4],
    "city": "Gurugram",
    "locality": locality,
    "address": f"Demo Lane, {locality}, Gurugram",
    "rent": 8500 + (index % 8) * 1500,
    "bhk": 2 + (index % 3),
    "occupancy": "shared" if index % 2 else "single",
    "looking_for": ["Any", "Female", "Male"][index % 3],
    "furnishing": "fully furnished" if index % 2 else "semi furnished",
    "description": "Synthetic demo listing. Visit before paying and verify the owner.",
    "amenities": ROOM_AMENITIES[index % len(ROOM_AMENITIES)],
    "highlights": ["Market nearby", "Close to metro station", "Gated society"] if index % 2 else ["Attached balcony", "Public transport nearby", "Park nearby"],
    "photo_count": 1 + index % 3,
    "owner_verified": index % 4 != 3,
    "status": "active",
    "synthetic": True,
} for index, locality in enumerate(LOCALITIES * 2)]
FAVORITES = set()
CONNECT_REQUESTS = []


def _account_db():
    connection = sqlite3.connect(Path(settings.BASE_DIR) / "db.sqlite3")
    connection.row_factory = sqlite3.Row
    connection.execute("CREATE TABLE IF NOT EXISTS roomsync_accounts (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, phone TEXT NOT NULL, password_hash TEXT NOT NULL, city TEXT NOT NULL, sleep TEXT NOT NULL, cleanliness TEXT NOT NULL, budget TEXT NOT NULL, created_at TEXT NOT NULL)")
    connection.commit()
    return connection


def _hash_password(password, salt=None):
    salt = salt or secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 120000).hex()
    return f"{salt}${digest}"


def _password_matches(password, stored):
    salt, expected = stored.split("$", 1)
    actual = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 120000).hex()
    return hmac.compare_digest(actual, expected)


def _public_account(row):
    return {"id": row["id"], "name": row["name"], "email": row["email"], "phone": row["phone"], "city": row["city"], "sleep": row["sleep"], "cleanliness": row["cleanliness"], "budget": row["budget"]}


def _ensure_demo_account():
    connection = _account_db()
    existing = connection.execute("SELECT id FROM roomsync_accounts WHERE email = ?", ("demo@roomsync.test",)).fetchone()
    if not existing:
        connection.execute("INSERT INTO roomsync_accounts (name, email, phone, password_hash, city, sleep, cleanliness, budget, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", ("Priya Sharma", "demo@roomsync.test", "+91 98765 43210", _hash_password("Demo@1234"), "Gurugram", "Night owl", "Balanced", "INR 10k - INR 18k", datetime.now(timezone.utc).isoformat()))
        connection.commit()
    connection.close()


_ensure_demo_account()


def health(request):
    return JsonResponse({"status": "ok", "service": "roomsync-api", "demo": True})


@csrf_exempt
def register_account(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)
    try:
        payload = json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    required = ["name", "email", "phone", "password"]
    if any(not payload.get(field) for field in required):
        return JsonResponse({"error": "Name, email, phone, and password are required"}, status=400)
    if len(payload["password"]) < 8:
        return JsonResponse({"error": "Password must be at least 8 characters"}, status=400)
    connection = _account_db()
    try:
        cursor = connection.execute("INSERT INTO roomsync_accounts (name, email, phone, password_hash, city, sleep, cleanliness, budget, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", (payload["name"], payload["email"].lower(), payload["phone"], _hash_password(payload["password"]), payload.get("city", "Gurugram"), payload.get("sleep", "Night owl"), payload.get("cleanliness", "Balanced"), payload.get("budget", "INR 10k - INR 18k"), datetime.now(timezone.utc).isoformat()))
        connection.commit()
        account = connection.execute("SELECT * FROM roomsync_accounts WHERE id = ?", (cursor.lastrowid,)).fetchone()
    except sqlite3.IntegrityError:
        connection.close()
        return JsonResponse({"error": "An account with this email already exists"}, status=409)
    connection.close()
    return JsonResponse({"user": _public_account(account), "token": f"demo-session-{account['id']}"}, status=201)


@csrf_exempt
def login_account(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)
    try:
        payload = json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    connection = _account_db()
    account = connection.execute("SELECT * FROM roomsync_accounts WHERE email = ?", (str(payload.get("email", "")).lower(),)).fetchone()
    connection.close()
    if not account or not _password_matches(str(payload.get("password", "")), account["password_hash"]):
        return JsonResponse({"error": "Invalid email or password"}, status=401)
    return JsonResponse({"user": _public_account(account), "token": f"demo-session-{account['id']}"})


def accounts(request):
    if request.method != "GET":
        return JsonResponse({"error": "GET required"}, status=405)
    connection = _account_db()
    rows = connection.execute("SELECT * FROM roomsync_accounts ORDER BY created_at DESC").fetchall()
    connection.close()
    return JsonResponse({"results": [_public_account(row) for row in rows], "total": len(rows)})


def matches(request):
    return JsonResponse({"results": rank_matches(DEMO_PROFILE, DEMO_CANDIDATES)})


def _listing_response(listing):
    result = deepcopy(listing)
    result["trust"] = listing_trust(result)
    result["safety"] = safety_report(28.4595, 77.0266)
    result["is_favorite"] = result["id"] in FAVORITES
    return result


@csrf_exempt
def listings(request):
    if request.method == "POST":
        try:
            payload = json.loads(request.body or "{}")
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
        rent = payload.get("rent")
        if not isinstance(rent, (int, float)) or rent <= 0:
            return JsonResponse({"error": "Rent must be a positive number"}, status=400)
        images = payload.get("images", [])
        if len(images) > 3:
            return JsonResponse({"error": "A maximum of 3 images is allowed"}, status=400)
        for image in images:
            if not isinstance(image, dict) or not image.get("type", "").startswith("image/") or image.get("size", 0) > 10 * 1024 * 1024:
                return JsonResponse({"error": "Each image must be an image file smaller than 10 MB"}, status=400)
        listing = {"id": max(item["id"] for item in SYNTHETIC_LISTINGS) + 1, "title": payload.get("title", "New room near campus"), "owner": payload.get("owner", "Demo student"), "city": payload.get("city", "Gurugram"), "locality": payload.get("locality", "Sector 23"), "address": payload.get("address", ""), "rent": rent, "bhk": payload.get("bhk", 2), "occupancy": payload.get("occupancy", "single"), "looking_for": payload.get("looking_for", "Any"), "furnishing": payload.get("furnishing", "semi furnished"), "description": payload.get("description", "Synthetic demo listing."), "amenities": payload.get("amenities", []), "highlights": payload.get("highlights", []), "photo_count": len(images), "owner_verified": False, "status": "active", "synthetic": True, "contact_visible": bool(payload.get("contact_visible", False))}
        SYNTHETIC_LISTINGS.append(listing)
        return JsonResponse(_listing_response(listing), status=201)

    results = SYNTHETIC_LISTINGS[:]
    query = request.GET
    location = query.get("location", "").lower()
    if location:
        results = [item for item in results if location in f"{item['city']} {item['locality']}".lower()]
    if query.get("minRent"):
        results = [item for item in results if item["rent"] >= int(query["minRent"])]
    if query.get("maxRent"):
        results = [item for item in results if item["rent"] <= int(query["maxRent"])]
    if query.get("occupancy"):
        results = [item for item in results if item["occupancy"] == query["occupancy"]]
    if query.get("gender"):
        results = [item for item in results if item["looking_for"] in (query["gender"], "Any")]
    if query.get("amenity"):
        results = [item for item in results if query["amenity"] in item["amenities"]]
    if query.get("verified") == "true":
        results = [item for item in results if item["owner_verified"]]
    if query.get("minTrust"):
        results = [item for item in results if listing_trust(item)["score"] >= int(query["minTrust"])]
    sort = query.get("sort")
    if sort == "rent_asc":
        results.sort(key=lambda item: item["rent"])
    elif sort == "rent_desc":
        results.sort(key=lambda item: item["rent"], reverse=True)
    return JsonResponse({"results": [_listing_response(item) for item in results], "total": len(results), "synthetic": True})


def listing_detail(request, listing_id):
    listing = next((item for item in SYNTHETIC_LISTINGS if item["id"] == listing_id), None)
    if not listing:
        return JsonResponse({"error": "Listing not found"}, status=404)
    if request.method == "GET":
        return JsonResponse(_listing_response(listing))
    if request.method in ("PATCH", "PUT", "DELETE"):
        if request.method == "DELETE":
            SYNTHETIC_LISTINGS.remove(listing)
            return JsonResponse({"deleted": True})
        try:
            listing.update(json.loads(request.body or "{}"))
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
        return JsonResponse(_listing_response(listing))
    return JsonResponse({"error": "Method not allowed"}, status=405)


@csrf_exempt
def favorite_listing(request, listing_id=None):
    if request.method == "POST":
        if listing_id is None:
            return JsonResponse({"error": "listing_id is required"}, status=400)
        FAVORITES.add(listing_id)
        return JsonResponse({"favorite": True, "listing_id": listing_id}, status=201)
    if request.method == "DELETE":
        if listing_id is None:
            return JsonResponse({"error": "listing_id is required"}, status=400)
        FAVORITES.discard(listing_id)
        return JsonResponse({"favorite": False, "listing_id": listing_id})
    if request.method == "GET":
        return JsonResponse({"results": [_listing_response(item) for item in SYNTHETIC_LISTINGS if item["id"] in FAVORITES]})
    return JsonResponse({"error": "Method not allowed"}, status=405)


@csrf_exempt
def connect_listing(request, listing_id):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)
    request_record = {"id": len(CONNECT_REQUESTS) + 1, "listing_id": listing_id, "status": "pending", "message": "Meet in a public place first and verify the listing before paying."}
    CONNECT_REQUESTS.append(request_record)
    return JsonResponse(request_record, status=201)


def safety(request):
    lat = float(request.GET.get("lat", 28.4595))
    lng = float(request.GET.get("lng", 77.0266))
    return JsonResponse(safety_report(lat, lng))

@csrf_exempt
def agreements(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST a JSON body with text"}, status=405)
    try:
        payload = json.loads(request.body or "{}")
        return JsonResponse(analyse_agreement(payload.get("text", "")))
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
