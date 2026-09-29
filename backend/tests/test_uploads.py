import io
from django.test import Client
from django.core.files.uploadedfile import SimpleUploadedFile

def test_upload_validation_and_listing():
    client = Client()
    # 1. Reject non-image file
    fake_txt = SimpleUploadedFile("notes.txt", b"plain text content", content_type="text/plain")
    res_bad = client.post("/api/upload/", {"file": fake_txt, "listing_id": 999})
    assert res_bad.status_code == 400

    # 2. Accept valid image
    fake_img = SimpleUploadedFile("room.jpg", b"fake jpeg image data", content_type="image/jpeg")
    res_good = client.post("/api/upload/", {"file": fake_img, "listing_id": 999})
    assert res_good.status_code == 201
    upload_data = res_good.json()
    assert "filename" in upload_data
    filename = upload_data["filename"]

    # 3. List images for listing
    res_list = client.get("/api/upload/?listing_id=999")
    assert res_list.status_code == 200
    images = res_list.json().get("images", [])
    assert any(img["filename"] == filename for img in images)

    # 4. Delete the image
    res_del = client.delete(f"/api/upload/{filename}/")
    assert res_del.status_code == 200
