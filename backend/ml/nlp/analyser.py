import hashlib
import re

RULES = [("security_deposit", re.compile(r"(security deposit|advance).{0,80}(three|4|four|months)", re.I), "high", "A deposit above two months' rent deserves clarification."), ("notice_period", re.compile(r"notice period.{0,40}(7|10) days", re.I), "high", "A very short notice period can make moving difficult."), ("landlord_entry", re.compile(r"landlord.{0,50}(any time|without notice)", re.I), "high", "Entry should require reasonable prior notice."), ("rent_escalation", re.compile(r"rent.{0,50}(15|20)%", re.I), "medium", "Ask for a capped, clearly scheduled escalation.")]


def analyse_agreement(text):
    clauses = []
    for clause_type, pattern, risk, explanation in RULES:
        match = pattern.search(text)
        if match:
            clauses.append({"type": clause_type, "risk_level": risk, "clause_text": match.group(0), "explanation": explanation, "suggestion": "Ask the landlord to replace this with a specific, mutual and time-bounded clause.", "mta_reference": "Model Tenancy Act 2021 (informational mapping)", "char_start": match.start(), "char_end": match.end()})
    digest = hashlib.sha256(text.encode("utf-8")).hexdigest()
    high = sum(clause["risk_level"] == "high" for clause in clauses)
    return {"sha256": digest, "status": "analysed", "overall_risk": "high" if high else ("medium" if clauses else "low"), "clauses": clauses, "disclaimer": "Informational only; not legal advice."}
