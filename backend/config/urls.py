from django.urls import path
from apps.api import health, register_account, login_account, accounts, matches, listings, listing_detail, favorite_listing, connect_listing, safety, agreements

urlpatterns = [
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
]
