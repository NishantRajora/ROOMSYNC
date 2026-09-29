import json
import uuid

from django.test import Client


def test_register_and_login_persist_account():
    client = Client()
    email = f"student-{uuid.uuid4().hex}@example.test"
    payload = {"name": "Test Student", "email": email, "phone": "+91 90000 00000", "password": "StrongPass123", "city": "Gurugram", "sleep": "Night owl", "cleanliness": "Calm & tidy", "budget": "INR 10k - INR 18k"}
    registered = client.post("/api/auth/register/", data=json.dumps(payload), content_type="application/json")
    logged_in = client.post("/api/auth/login/", data=json.dumps({"email": email, "password": payload["password"]}), content_type="application/json")
    assert registered.status_code == 201
    assert logged_in.status_code == 200
    assert logged_in.json()["user"]["name"] == "Test Student"
    assert logged_in.json()["user"]["phone"] == payload["phone"]


def test_duplicate_account_is_rejected():
    client = Client()
    email = f"duplicate-{uuid.uuid4().hex}@example.test"
    payload = {"name": "Duplicate Test", "email": email, "phone": "+91 91111 11111", "password": "StrongPass123"}
    client.post("/api/auth/register/", data=json.dumps(payload), content_type="application/json")
    duplicate = client.post("/api/auth/register/", data=json.dumps(payload), content_type="application/json")
    assert duplicate.status_code == 409


def test_admin_account_list_excludes_password_hash():
    client = Client()
    response = client.get("/api/auth/accounts/")
    assert response.status_code == 200
    assert response.json()["results"]
    assert "password_hash" not in response.json()["results"][0]


def test_admin_database_returns_full_schema_and_tables():
    client = Client()
    response = client.get("/api/admin/database/")
    assert response.status_code == 200
    data = response.json()
    assert "summary" in data
    assert "tables" in data
    assert "listings" in data
    # Check all requested schemas exist
    required_tables = [
        "roomsync_accounts",
        "roomsync_expenses",
        "roomsync_pacts",
        "roomsync_conversations",
        "roomsync_messages",
        "roomsync_reviews",
        "roomsync_visit_alerts",
        "roomsync_student_verifications",
    ]
    for table in required_tables:
        assert table in data["tables"]
        assert "schema" in data["tables"][table]
        assert "description" in data["tables"][table]
        assert "rows" in data["tables"][table]
    assert len(data["listings"]) == 20

