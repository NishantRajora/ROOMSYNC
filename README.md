# RoomSync

**Find Your People. Find Your Place.**

RoomSync is a student-first flatmate matching and safer renting demo for The NorthCap University, Gurugram. It combines explainable compatibility recommendations with listing trust signals, geo-safety context, agreement clause analysis, and tamper-evident document hashes.

## Quick start

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
python backend\manage.py runserver 8000
```

In a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

The API is at `http://localhost:8000/api/health/`; the frontend is at `http://localhost:5173`.

Docker is supported through `docker compose up --build`; the default demo path uses SQLite and does not require paid services or credentials.

## Honest boundaries

This repository labels synthetic students/listings, sample NCRB-style metrics, the mock DigiLocker verifier, offline NLP rules, and local hash anchoring as demo/stub behavior. The agreement analyzer is informational only and is not legal advice. No raw Aadhaar number is collected or stored, and protected attributes are excluded from matching features.

## Assumptions

- The pilot city is Gurugram / Delhi NCR and the default campus is NCU Gurugram.
- A zero-cost local demo is more useful than requiring cloud credentials. PostgreSQL/PostGIS, Redis, MinIO, transformer inference, and public testnets are optional deployment upgrades.
- The first vertical slice exposes the core contracts in a small, testable API before adding the full production data model.

## Limitations and future work

Real identity integrations, moderated user-generated content, real NCRB/OSM source ingestion, calibrated matching from consented real outcomes, production file storage, full account lifecycle, and mobile clients remain future work.
