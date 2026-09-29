import sqlite3
import json
from pathlib import Path
from datetime import datetime, timezone
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

def _chat_db():
    db_path = Path(settings.BASE_DIR) / 'db.sqlite3'
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    
    # Create tables if not exist
    c.execute('''
        CREATE TABLE IF NOT EXISTS roomsync_conversations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            participant_1 TEXT NOT NULL,
            participant_2 TEXT NOT NULL,
            listing_id INTEGER NOT NULL,
            created_at TEXT NOT NULL,
            UNIQUE(participant_1, participant_2, listing_id)
        )
    ''')
    
    c.execute('''
        CREATE TABLE IF NOT EXISTS roomsync_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            conversation_id INTEGER NOT NULL,
            sender TEXT NOT NULL,
            text TEXT NOT NULL,
            created_at TEXT NOT NULL,
            read INTEGER DEFAULT 0,
            FOREIGN KEY (conversation_id) REFERENCES roomsync_conversations (id)
        )
    ''')
    
    conn.commit()
    return conn

@csrf_exempt
def handle_conversations(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            p1 = data.get('participant_1')
            p2 = data.get('participant_2')
            listing_id = data.get('listing_id')
            
            if not all([p1, p2, listing_id]):
                return JsonResponse({'error': 'Missing required fields'}, status=400)
            
            # Normalize participants to maintain uniqueness (p1 < p2)
            if p1 > p2:
                p1, p2 = p2, p1
                
            conn = _chat_db()
            c = conn.cursor()
            
            c.execute('SELECT id, participant_1, participant_2, listing_id, created_at FROM roomsync_conversations WHERE participant_1 = ? AND participant_2 = ? AND listing_id = ?', (p1, p2, listing_id))
            row = c.fetchone()
            
            if row:
                conn.close()
                return JsonResponse(dict(row), status=200)
                
            now = datetime.now(timezone.utc).isoformat()
            c.execute('INSERT INTO roomsync_conversations (participant_1, participant_2, listing_id, created_at) VALUES (?, ?, ?, ?)', (p1, p2, listing_id, now))
            conv_id = c.lastrowid
            conn.commit()
            
            c.execute('SELECT id, participant_1, participant_2, listing_id, created_at FROM roomsync_conversations WHERE id = ?', (conv_id,))
            new_row = c.fetchone()
            conn.close()
            
            return JsonResponse(dict(new_row), status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
            
    elif request.method == 'GET':
        user = request.GET.get('user')
        if not user:
            return JsonResponse({'error': 'Missing user parameter'}, status=400)
            
        try:
            conn = _chat_db()
            c = conn.cursor()
            
            c.execute('''
                SELECT c.id, c.participant_1, c.participant_2, c.listing_id, c.created_at,
                       (SELECT text FROM roomsync_messages m WHERE m.conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message,
                       (SELECT created_at FROM roomsync_messages m WHERE m.conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message_time,
                       (SELECT COUNT(*) FROM roomsync_messages m WHERE m.conversation_id = c.id AND m.sender != ? AND m.read = 0) as unread_count
                FROM roomsync_conversations c
                WHERE c.participant_1 = ? OR c.participant_2 = ?
                ORDER BY last_message_time DESC, c.created_at DESC
            ''', (user, user, user))
            
            rows = c.fetchall()
            conversations = [dict(row) for row in rows]
            conn.close()
            
            return JsonResponse({'conversations': conversations}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
            
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def handle_messages(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            conversation_id = data.get('conversation_id')
            sender = data.get('sender')
            text = data.get('text', '').strip()
            
            if not all([conversation_id, sender, text]):
                return JsonResponse({'error': 'Missing required fields'}, status=400)
                
            if len(text) > 2000:
                return JsonResponse({'error': 'Message too long (max 2000 chars)'}, status=400)
                
            now = datetime.now(timezone.utc).isoformat()
            
            conn = _chat_db()
            c = conn.cursor()
            
            c.execute('INSERT INTO roomsync_messages (conversation_id, sender, text, created_at, read) VALUES (?, ?, ?, ?, 0)', (conversation_id, sender, text, now))
            msg_id = c.lastrowid
            conn.commit()
            
            c.execute('SELECT id, conversation_id, sender, text, created_at, read FROM roomsync_messages WHERE id = ?', (msg_id,))
            row = c.fetchone()
            conn.close()
            
            return JsonResponse(dict(row), status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
            
    elif request.method == 'GET':
        conversation_id = request.GET.get('conversation_id')
        user = request.GET.get('user')  # To mark as read
        
        if not conversation_id:
            return JsonResponse({'error': 'Missing conversation_id parameter'}, status=400)
            
        try:
            conn = _chat_db()
            c = conn.cursor()
            
            # Mark messages as read for this user
            if user:
                c.execute('UPDATE roomsync_messages SET read = 1 WHERE conversation_id = ? AND sender != ? AND read = 0', (conversation_id, user))
                conn.commit()
            
            c.execute('SELECT id, conversation_id, sender, text, created_at, read FROM roomsync_messages WHERE conversation_id = ? ORDER BY created_at ASC', (conversation_id,))
            rows = c.fetchall()
            messages = [dict(row) for row in rows]
            conn.close()
            
            return JsonResponse({'messages': messages}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
            
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def handle_unread(request):
    if request.method == 'GET':
        user = request.GET.get('user')
        if not user:
            return JsonResponse({'error': 'Missing user parameter'}, status=400)
            
        try:
            conn = _chat_db()
            c = conn.cursor()
            
            c.execute('''
                SELECT COUNT(*) as unread_total
                FROM roomsync_messages m
                JOIN roomsync_conversations c ON m.conversation_id = c.id
                WHERE (c.participant_1 = ? OR c.participant_2 = ?)
                AND m.sender != ? AND m.read = 0
            ''', (user, user, user))
            
            row = c.fetchone()
            conn.close()
            
            return JsonResponse({'unread_total': row['unread_total'], 'unread_count': row['unread_total']}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
            
    return JsonResponse({'error': 'Method not allowed'}, status=405)
