# API slice

- `GET /api/health/` returns service status.
- `POST /api/auth/register/` creates a persistent SQLite-backed account with a salted PBKDF2 password hash and profile basics.
- `POST /api/auth/login/` validates the account password and returns the saved user profile for the demo session.
- `GET /api/matches/` returns ranked compatible users with reasons, conflicts, and contributions.
- `GET /api/listings/` returns a demo listing with a trust report.
- `GET /api/safety/?lat=&lng=` returns explainable safety components and campus proximity.
- `POST /api/agreements/analyse/` accepts `{ "text": "..." }` and returns clause flags plus SHA-256.
- `GET /api/listings/?location=&minRent=&maxRent=&occupancy=&gender=&amenity=&verified=&minTrust=&sort=` returns filtered synthetic room listings with trust and safety context.
- `POST /api/listings/` validates rent, image count, image type/size metadata, privacy visibility, highlights, and amenities before creating a demo listing.
- `GET/PATCH/DELETE /api/listings/{id}/` provides listing detail and demo CRUD.
- `POST/DELETE /api/listings/{id}/favorite/` and `GET /api/favorites/` manage saved listings.
- `POST /api/listings/{id}/connect/` creates a pending connect request with a safety reminder.

Discovery records are currently held in an in-memory synthetic store because this checkout has no Django Listing model, authentication middleware, or MinIO adapter. Production work must move these records and binary files to PostgreSQL and MinIO with authenticated ownership permissions.
