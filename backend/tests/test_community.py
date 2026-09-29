import os
import json
import django
from django.test import Client

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

def test_expense_crud_and_balances():
    client = Client()
    # 1. Fetch expenses
    get_res = client.get("/api/expenses/?group_id=flat-ncu-23")
    assert get_res.status_code == 200
    assert "expenses" in get_res.json()
    assert len(get_res.json()["expenses"]) >= 1

    # 2. Add new expense
    post_res = client.post(
        "/api/expenses/",
        data=json.dumps({
            "group_id": "flat-ncu-23",
            "title": "Water Dispenser Can",
            "amount": 160.0,
            "paid_by": "Priya Sharma",
            "category": "Water",
            "split_with": "Aarav Mehta,Tanya Kapoor",
            "upi_id": "priya.sharma@okaxis"
        }),
        content_type="application/json"
    )
    assert post_res.status_code == 201
    assert post_res.json()["title"] == "Water Dispenser Can"

    # 3. Check balances and settlements
    bal_res = client.get("/api/expenses/balances/?group_id=flat-ncu-23")
    assert bal_res.status_code == 200
    data = bal_res.json()
    assert "balances" in data
    assert "settlements" in data
    assert len(data["settlements"]) >= 1
    assert "upi_link" in data["settlements"][0]

def test_roommate_pacts():
    client = Client()
    # 1. Post new pact
    res = client.post(
        "/api/pacts/",
        data=json.dumps({
            "title": "NCU Semester 5 Flat Pact",
            "flatmates": "Priya Sharma & Aarav Mehta",
            "rules": {
                "quiet_hours": "10:30 PM - 6:30 AM",
                "cleaning_cycle": "Alternate Days",
                "guest_policy": "No overnight guests without prior heads up",
                "deposit_policy": "Direct refund to source account"
            }
        }),
        content_type="application/json"
    )
    assert res.status_code == 201
    data = res.json()
    assert data["sha256_hash"].startswith("0x")
    assert "ROOMMATE COMPATIBILITY" in data["agreement_text"]

    # 2. Get pacts list
    list_res = client.get("/api/pacts/")
    assert list_res.status_code == 200
    assert len(list_res.json()["pacts"]) >= 1

def test_student_email_verification():
    client = Client()
    # 1. Reject non-university domain
    bad_res = client.post(
        "/api/auth/student-otp/",
        data=json.dumps({"email": "scammer@randomgmail.com"}),
        content_type="application/json"
    )
    assert bad_res.status_code == 400

    # 2. Accept @ncuindia.edu domain
    good_res = client.post(
        "/api/auth/student-otp/",
        data=json.dumps({"email": "priya.sharma@ncuindia.edu"}),
        content_type="application/json"
    )
    assert good_res.status_code == 200
    otp = good_res.json()["demo_otp"]

    # 3. Verify OTP
    verify_res = client.post(
        "/api/auth/student-verify/",
        data=json.dumps({"email": "priya.sharma@ncuindia.edu", "otp": otp}),
        content_type="application/json"
    )
    assert verify_res.status_code == 200
    assert verify_res.json()["verified"] is True
    assert verify_res.json()["badge"] == "Verified NCU Student"

def test_flat_visit_sos_alerts():
    client = Client()
    # 1. Start a visit
    start_res = client.post(
        "/api/safety/visit-alerts/",
        data=json.dumps({
            "action": "start",
            "user_email": "demo@roomsync.test",
            "destination": "DLF Phase 3, U-Block",
            "duration_mins": 30,
            "emergency_phone": "+91 98765 00000"
        }),
        content_type="application/json"
    )
    assert start_res.status_code == 201
    assert start_res.json()["status"] == "active"

    # 2. Check active visit
    get_res = client.get("/api/safety/visit-alerts/?user=demo@roomsync.test")
    assert get_res.status_code == 200
    assert get_res.json()["active_visit"] is not None

    # 3. Mark safe
    checkin_res = client.post(
        "/api/safety/visit-alerts/",
        data=json.dumps({"action": "checkin", "user_email": "demo@roomsync.test"}),
        content_type="application/json"
    )
    assert checkin_res.status_code == 200
    assert checkin_res.json()["status"] == "safe"

def test_landlord_reviews():
    client = Client()
    # 1. List reviews
    list_res = client.get("/api/reviews/?locality=Sector%2023")
    assert list_res.status_code == 200
    assert list_res.json()["count"] >= 1

    # 2. Create review
    post_res = client.post(
        "/api/reviews/",
        data=json.dumps({
            "locality": "Sector 23",
            "landlord_name": "Mr. Kapoor",
            "deposit_returned": True,
            "maintenance_rating": 5,
            "water_power_rating": 4,
            "overall_rating": 5,
            "comment": "Returned 100% of my deposit within 24 hours of vacating. Highly recommended!",
            "author_email": "student@ncuindia.edu"
        }),
        content_type="application/json"
    )
    assert post_res.status_code == 201
    assert post_res.json()["landlord_name"] == "Mr. Kapoor"

def test_expense_custom_user_mapping():
    client = Client()
    # Fetch expenses with a different logged-in user
    res = client.get("/api/expenses/?group_id=flat-ncu-23&current_user=Rohan%20Gupta")
    assert res.status_code == 200
    expenses = res.json()["expenses"]
    # Check that Rohan Gupta replaces Priya Sharma in expenses
    assert any(e["paid_by"] == "Rohan Gupta" for e in expenses)
    assert not any(e["paid_by"] == "Priya Sharma" for e in expenses)

    # Fetch balances with Rohan Gupta
    bal_res = client.get("/api/expenses/balances/?group_id=flat-ncu-23&current_user=Rohan%20Gupta")
    assert bal_res.status_code == 200
    balances = bal_res.json()["balances"]
    assert "Rohan Gupta" in balances
    assert "Priya Sharma" not in balances
