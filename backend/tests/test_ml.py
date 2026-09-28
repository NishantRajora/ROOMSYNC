import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parents[1]))
from ml.matching.engine import rank_matches
from ml.verification.trust import listing_trust
from ml.nlp.analyser import analyse_agreement


def test_matching_excludes_different_city():
    profile = {"city": "Gurugram", "budget_min": 10000, "budget_max": 16000}
    assert rank_matches(profile, [{"city": "Noida", "budget_min": 10000, "budget_max": 16000}]) == []


def test_trust_flags_scam_language():
    report = listing_trust({"description": "Out of station owner, pay token advance", "rent": 14000, "owner_verified": False, "photo_count": 4})
    assert report["score"] < 100
    assert any(signal["status"] == "warn" for signal in report["signals"])


def test_agreement_highlights_risky_clause():
    report = analyse_agreement("The landlord may enter any time without notice. Security deposit is four months rent.")
    assert report["overall_risk"] == "high"
    assert len(report["clauses"]) == 2
