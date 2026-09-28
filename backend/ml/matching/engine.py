from math import cos, pi


def _time_similarity(first, second):
    distance = abs(first - second) % 24
    distance = min(distance, 24 - distance)
    return 1 - distance / 12


def _hard_filter(profile, candidate):
    if profile.get("city") != candidate.get("city"):
        return False, "Different cities"
    overlap = min(profile.get("budget_max", 0), candidate.get("budget_max", 0)) - max(profile.get("budget_min", 0), candidate.get("budget_min", 0))
    if overlap < 1000:
        return False, "Budget ranges overlap by less than INR 1,000"
    if profile.get("smoking") == "never" and candidate.get("smoking") == "regular":
        return False, "Smoking is a dealbreaker"
    return True, ""


def rank_matches(profile, candidates):
    results = []
    for candidate in candidates:
        passed, filter_reason = _hard_filter(profile, candidate)
        if not passed:
            continue
        routine = _time_similarity(profile.get("sleep_hour", 23), candidate.get("sleep_hour", 23))
        cleanliness = 1 - abs(profile.get("cleanliness", 3) - candidate.get("cleanliness", 3)) / 4
        social = cos(abs(profile.get("noise_tolerance", 3) - candidate.get("noise_tolerance", 3)) * pi / 8) ** 2
        study = 1 if profile.get("study_style") == candidate.get("study_style") else 0.35
        food = 1 if profile.get("food") == candidate.get("food") else 0.55
        score = round(100 * (0.25 * routine + 0.20 * cleanliness + 0.15 * social + 0.10 * study + 0.10 * food + 0.20), 1)
        reasons = []
        conflicts = []
        if routine > 0.8: reasons.append("You both keep a similar sleep routine")
        if cleanliness > 0.75: reasons.append("Your cleanliness expectations are close")
        if study == 1: reasons.append("You have a similar study rhythm")
        if food < 1: conflicts.append("Food preferences may need a house agreement")
        if social < 0.7: conflicts.append("Different noise tolerance")
        results.append({"user": candidate, "score": score, "reasons": reasons[:3], "conflicts": conflicts[:2], "contributions": {"routine": round(routine, 2), "cleanliness": round(cleanliness, 2), "social": round(social, 2), "study": study, "food": food}})
    return sorted(results, key=lambda item: item["score"], reverse=True)
