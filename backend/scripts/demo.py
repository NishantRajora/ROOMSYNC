import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parents[1]))
from ml.matching.engine import rank_matches
from ml.nlp.analyser import analyse_agreement
from ml.safety.risk import safety_report
from ml.verification.trust import listing_trust

profile = {"city": "Gurugram", "budget_min": 10000, "budget_max": 18000, "sleep_hour": 23, "cleanliness": 4, "noise_tolerance": 2, "study_style": "late", "food": "veg", "smoking": "never", "guests_frequency": 2}
candidate = {"id": 1, "name": "Aarav Mehta", "city": "Gurugram", "budget_min": 11000, "budget_max": 17000, "sleep_hour": 23, "cleanliness": 4, "noise_tolerance": 2, "study_style": "late", "food": "veg", "smoking": "never", "guests_frequency": 2}
listing = {"description": "Verified owner, furnished room, visit before paying.", "rent": 14500, "owner_verified": True, "photo_count": 4}
agreement = "The landlord may enter any time without notice. Security deposit is four months rent."
print(json.dumps({"matches": rank_matches(profile, [candidate]), "trust": listing_trust(listing), "safety": safety_report(28.4595, 77.0266), "agreement": analyse_agreement(agreement)}, indent=2))
