from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from apps.api import health, register_account, login_account, accounts, matches, listings, listing_detail, favorite_listing, connect_listing, safety, agreements, agreements_summary, agreements_compare
from apps.chat import handle_conversations, handle_messages, handle_unread
from apps.uploads import handle_uploads, delete_upload

urlpatterns = [
    # Core API
    path("api/health/", health),
    path("api/auth/register/", register_account),
    path("api/auth/login/", login_account),
    path("api/auth/accounts/", accounts),
    path("api/matches/", matches),
    path("api/listings/", listings),
    path("api/listings/<int:listing_id>/", listing_detail),
    path("api/listings/<int:listing_id>/favorite/", favorite_listing),
    path("api/listings/<int:listing_id>/connect/", connect_listing),
    path("api/favorites/", favorite_listing),
    path("api/safety/", safety),
    path("api/agreements/analyse/", agreements),
    path("api/agreements/summary/", agreements_summary),
    path("api/agreements/compare/", agreements_compare),
    # Chat & messaging
    path("api/chat/conversations/", handle_conversations),
    path("api/chat/messages/", handle_messages),
    path("api/chat/unread/", handle_unread),
    # Image uploads
    path("api/upload/", handle_uploads),
    path("api/upload/<str:filename>/", delete_upload),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
