import re

try:
    from .analyser import RULES, analyse_agreement
except ImportError:
    RULES = []
    def analyse_agreement(text):
        return []

# Normalized rule list
NORMALIZED_RULES = []

for item in RULES:
    if isinstance(item, (tuple, list)) and len(item) >= 4:
        clause_type, pattern, risk, explanation = item[:4]
        NORMALIZED_RULES.append({
            "pattern": pattern.pattern if hasattr(pattern, "pattern") else str(pattern),
            "clause": clause_type.replace("_", " ").title(),
            "risk_level": risk,
            "recommendation": explanation
        })
    elif isinstance(item, dict):
        NORMALIZED_RULES.append(item)

NORMALIZED_RULES.extend([
    {
        "pattern": r"(?i)\b(tenant|lessee)\s+shall\s+be\s+responsible\s+for\s+(minor\s+)?(repairs|maintenance)\b",
        "clause": "Maintenance responsibility lies with tenant",
        "risk_level": "medium",
        "recommendation": "Clarify the monetary limit for minor repairs."
    },
    {
        "pattern": r"(?i)\bno\s+subletting\b|\bshall\s+not\s+sublet\b|\bsubletting\s+is\s+strictly\s+prohibited\b",
        "clause": "Subletting prohibited",
        "risk_level": "low",
        "recommendation": "Standard clause, ensure you do not plan to sublet."
    },
    {
        "pattern": r"(?i)\bno\s+pets\s+allowed\b|\bpets\s+are\s+strictly\s+prohibited\b",
        "clause": "Pet policy: No pets",
        "risk_level": "low",
        "recommendation": "Note that pets are not allowed on the premises."
    },
    {
        "pattern": r"(?i)\b(utility|electricity|water)\s+bills?\s+(shall\s+be\s+)?paid\s+by\s+(tenant|lessee)\b",
        "clause": "Utilities paid by tenant",
        "risk_level": "low",
        "recommendation": "Ensure utility meter readings are documented at move-in."
    },
    {
        "pattern": r"(?i)\block-in\s+period\s+of\s+(\d+|one|two|three|six)\s+months\b",
        "clause": "Lock-in period specified",
        "risk_level": "high",
        "recommendation": "You will be liable for rent if you vacate during the lock-in period."
    },
    {
        "pattern": r"(?i)\blate\s+payment\s+(fee|penalty)\b",
        "clause": "Late fee applicable on rent delay",
        "risk_level": "medium",
        "recommendation": "Check the exact amount or percentage of the late fee."
    },
    {
        "pattern": r"(?i)\bparking\s+space\s+(provided|allocated)\b",
        "clause": "Parking space allocated",
        "risk_level": "low",
        "recommendation": "Verify if parking is included in rent or charged separately."
    },
    {
        "pattern": r"(?i)\bno\s+overnight\s+guests\b|\bguests?\s+not\s+allowed\s+after\b",
        "clause": "Guest policy restrictions",
        "risk_level": "medium",
        "recommendation": "Ensure these restrictions align with your lifestyle."
    },
    {
        "pattern": r"(?i)\bliable\s+for\s+any\s+damage\s+to\s+(furniture|furnishings|inventory)\b",
        "clause": "Liability for furnishing damage",
        "risk_level": "medium",
        "recommendation": "Take photos of all furniture and inventory on move-in day."
    },
    {
        "pattern": r"(?i)\btermination\s+with\s+(one|two|three|\d+)\s+months?\s+notice\b",
        "clause": "Notice period for termination",
        "risk_level": "low",
        "recommendation": "Standard notice period clause."
    }
])

def analyse_agreement_enhanced(text):
    found_clauses = []
    for rule in NORMALIZED_RULES:
        if re.search(rule["pattern"], text):
            found_clauses.append({
                "clause": rule["clause"],
                "risk_level": rule["risk_level"],
                "recommendation": rule["recommendation"]
            })
    return found_clauses

def summarize_agreement(text):
    clauses = analyse_agreement_enhanced(text)
    
    high = sum(1 for c in clauses if c['risk_level'] == 'high')
    medium = sum(1 for c in clauses if c['risk_level'] == 'medium')
    low = sum(1 for c in clauses if c['risk_level'] == 'low')
    
    if high > 2:
        rating = "Risky"
    elif high > 0 or medium > 2:
        rating = "Caution"
    else:
        rating = "Safe"
        
    return {
        "total_clauses": len(clauses),
        "risk_breakdown": {"high": high, "medium": medium, "low": low},
        "recommendations": [c['recommendation'] for c in clauses if c['risk_level'] in ['high', 'medium']],
        "overall_safety": rating,
        "details": clauses
    }

def compare_agreements(text1, text2):
    c1 = analyse_agreement_enhanced(text1)
    c2 = analyse_agreement_enhanced(text2)
    
    c1_names = {c['clause']: c for c in c1}
    c2_names = {c['clause']: c for c in c2}
    
    common = set(c1_names.keys()).intersection(c2_names.keys())
    unique_to_1 = set(c1_names.keys()) - set(c2_names.keys())
    unique_to_2 = set(c2_names.keys()) - set(c1_names.keys())
    
    s1 = summarize_agreement(text1)
    s2 = summarize_agreement(text2)
    
    safer = 1
    if s2['overall_safety'] == 'Safe' and s1['overall_safety'] != 'Safe':
        safer = 2
    elif s2['risk_breakdown']['high'] < s1['risk_breakdown']['high']:
        safer = 2
        
    return {
        "common_clauses": list(common),
        "unique_to_1": list(unique_to_1),
        "unique_to_2": list(unique_to_2),
        "safer_overall": f"Agreement {safer}",
        "agreement_1_summary": s1,
        "agreement_2_summary": s2
    }

def generate_recommendations(clauses):
    recommendations = []
    for c in clauses:
        if c['risk_level'] in ['high', 'medium']:
            recommendations.append(f"Risk: {c['clause']} -> Action: {c['recommendation']}")
    return recommendations
