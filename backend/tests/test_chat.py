import json
from django.test import Client

def test_chat_flow():
    client = Client()
    # 1. Create a conversation
    conv_res = client.post(
        "/api/chat/conversations/",
        data=json.dumps({
            "participant_1": "userA@test.com",
            "participant_2": "userB@test.com",
            "listing_id": 101
        }),
        content_type="application/json"
    )
    assert conv_res.status_code in (200, 201)
    conv_data = conv_res.json()
    conv_id = conv_data["id"]
    assert conv_id > 0

    # 2. Send a message
    msg_res = client.post(
        "/api/chat/messages/",
        data=json.dumps({
            "conversation_id": conv_id,
            "sender": "userA@test.com",
            "text": "Hello, is the room still available?"
        }),
        content_type="application/json"
    )
    assert msg_res.status_code == 201
    msg_data = msg_res.json()
    assert msg_data["text"] == "Hello, is the room still available?"

    # 3. Retrieve messages
    get_res = client.get(f"/api/chat/messages/?conversation_id={conv_id}&user=userB@test.com")
    assert get_res.status_code == 200
    messages = get_res.json().get("messages", [])
    assert len(messages) >= 1
    assert any(m["text"] == "Hello, is the room still available?" for m in messages)

    # 4. Check unread count
    unread_res = client.get("/api/chat/unread/?user=userA@test.com")
    assert unread_res.status_code == 200
    assert "unread_count" in unread_res.json()
