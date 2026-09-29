import os
import uuid
from pathlib import Path
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import connection

MEDIA_DIR = Path(getattr(settings, 'BASE_DIR', '.')) / 'media' / 'listings'
MEDIA_DIR.mkdir(parents=True, exist_ok=True)

def init_db():
    with connection.cursor() as cursor:
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS roomsync_uploads (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                listing_id INTEGER,
                filename TEXT,
                original_name TEXT,
                size INTEGER,
                mime_type TEXT,
                uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')

@csrf_exempt
def handle_uploads(request):
    try:
        init_db()
    except Exception as e:
        return JsonResponse({'error': f'DB init failed: {str(e)}'}, status=500)

    if request.method == 'POST':
        file = request.FILES.get('file')
        listing_id = request.POST.get('listing_id')
        
        if not file or not listing_id:
            return JsonResponse({'error': 'File and listing_id required'}, status=400)
            
        if not file.content_type.startswith('image/'):
            return JsonResponse({'error': 'Only image files are allowed'}, status=400)
            
        if file.size > 10 * 1024 * 1024:
            return JsonResponse({'error': 'File exceeds 10MB limit'}, status=400)
            
        # Check max 3 images per listing
        with connection.cursor() as cursor:
            cursor.execute('SELECT COUNT(*) FROM roomsync_uploads WHERE listing_id = %s', [listing_id])
            count = cursor.fetchone()[0]
            if count >= 3:
                return JsonResponse({'error': 'Maximum 3 images allowed per listing'}, status=400)
                
        ext = os.path.splitext(file.name)[1]
        filename = f"{uuid.uuid4()}{ext}"
        filepath = MEDIA_DIR / filename
        
        with open(filepath, 'wb+') as destination:
            for chunk in file.chunks():
                destination.write(chunk)
                
        with connection.cursor() as cursor:
            cursor.execute('''
                INSERT INTO roomsync_uploads (listing_id, filename, original_name, size, mime_type)
                VALUES (%s, %s, %s, %s, %s)
            ''', [listing_id, filename, file.name, file.size, file.content_type])
            
            cursor.execute('SELECT last_insert_rowid()')
            upload_id = cursor.fetchone()[0]
            
        return JsonResponse({
            'id': upload_id,
            'filename': filename,
            'url': f'/media/listings/{filename}',
            'listing_id': listing_id,
            'size': file.size,
            'uploaded_at': 'now'
        }, status=201)

    elif request.method == 'GET':
        listing_id = request.GET.get('listing_id')
        if not listing_id:
            return JsonResponse({'error': 'listing_id required'}, status=400)
            
        with connection.cursor() as cursor:
            cursor.execute('SELECT id, filename, original_name, size, mime_type, uploaded_at FROM roomsync_uploads WHERE listing_id = %s', [listing_id])
            rows = cursor.fetchall()
            
        images = []
        for row in rows:
            images.append({
                'id': row[0],
                'filename': row[1],
                'url': f'/media/listings/{row[1]}',
                'original_name': row[2],
                'size': row[3],
                'mime_type': row[4],
                'uploaded_at': row[5]
            })
            
        return JsonResponse({'images': images}, status=200)

@csrf_exempt
def delete_upload(request, filename):
    if request.method == 'DELETE':
        try:
            filepath = MEDIA_DIR / filename
            if filepath.exists():
                os.remove(filepath)
                
            with connection.cursor() as cursor:
                cursor.execute('DELETE FROM roomsync_uploads WHERE filename = %s', [filename])
                
            return JsonResponse({'message': 'Deleted successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
            
    return JsonResponse({'error': 'Method not allowed'}, status=405)
