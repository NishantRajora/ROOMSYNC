import json
from django.test import Client
from ml.nlp.enhanced_analyser import summarize_agreement, compare_agreements

def test_enhanced_nlp_summary():
    text = "Security deposit is four months rent. Lock-in period of 6 months. Late payment penalty of 10% applies."
    summary = summarize_agreement(text)
    assert summary["total_clauses"] >= 1
    assert summary["overall_safety"] in ("Caution", "Risky")
    assert len(summary["recommendations"]) >= 1

def test_enhanced_nlp_compare():
    text1 = "Security deposit is four months rent. Lock-in period of 6 months."
    text2 = "Security deposit is one month rent. Subletting is strictly prohibited."
    diff = compare_agreements(text1, text2)
    assert "safer_overall" in diff
    assert "agreement_1_summary" in diff
    assert "agreement_2_summary" in diff

def test_nlp_endpoints():
    client = Client()
    res1 = client.post(
        "/api/agreements/summary/",
        data=json.dumps({"text": "No pets allowed. Utilities paid by tenant."}),
        content_type="application/json"
    )
    assert res1.status_code == 200
    assert "overall_safety" in res1.json()

    res2 = client.post(
        "/api/agreements/compare/",
        data=json.dumps({"text1": "No pets allowed.", "text2": "Lock-in period of 3 months."}),
        content_type="application/json"
    )
    assert res2.status_code == 200
    assert "safer_overall" in res2.json()
