import re


def listing_trust(listing):
    flags = []
    score = 100
    description = listing.get("description", "").lower()
    scam_terms = ["token advance", "pay to hold", "out of station", "whatsapp only"]
    scam_hits = [term for term in scam_terms if term in description]
    if scam_hits:
        score -= 25
        flags.append({"name": "Scam language", "status": "warn", "explanation": f"Found risky phrase(s): {', '.join(scam_hits)}."})
    else:
        flags.append({"name": "Scam language", "status": "pass", "explanation": "No seeded scam phrases detected."})
    if listing.get("rent", 0) < 5000:
        score -= 20
        flags.append({"name": "Price anomaly", "status": "warn", "explanation": "Rent is unusually low for this pilot area."})
    else:
        flags.append({"name": "Price anomaly", "status": "pass", "explanation": "Rent is within the local demo range."})
    if listing.get("owner_verified"):
        flags.append({"name": "Owner verification", "status": "pass", "explanation": "Demo owner verification is present."})
    else:
        score -= 15
        flags.append({"name": "Owner verification", "status": "warn", "explanation": "Owner verification is incomplete."})
    if listing.get("photo_count", 0) < 3:
        score -= 10
    return {"score": max(0, score), "signals": flags}
