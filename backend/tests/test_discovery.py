import json
import os
import sys
from pathlib import Path

import django
from django.test import Client

sys.path.insert(0, str(Path(__file__).parents[1]))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()


def test_listing_inventory_and_filters():
    client = Client()
    response = client.get("/api/listings/?location=Sector%2023&minRent=10000")
    payload = response.json()
    assert response.status_code == 200
    assert payload["total"] > 0
    assert all(item["rent"] >= 10000 for item in payload["results"])
    assert all("trust" in item and "safety" in item for item in payload["results"])


def test_create_listing_validates_rent_and_image_count():
    client = Client()
    invalid_rent = client.post("/api/listings/", data=json.dumps({"rent": 0}), content_type="application/json")
    too_many_images = client.post("/api/listings/", data=json.dumps({"rent": 12000, "images": ["a", "b", "c", "d"]}), content_type="application/json")
    assert invalid_rent.status_code == 400
    assert too_many_images.status_code == 400


def test_favorite_and_connect_listing():
    client = Client()
    favorite = client.post("/api/listings/1/favorite/")
    connect = client.post("/api/listings/1/connect/")
    saved = client.get("/api/favorites/")
    assert favorite.status_code == 201
    assert connect.status_code == 201
    assert connect.json()["status"] == "pending"
    assert saved.json()["results"]
