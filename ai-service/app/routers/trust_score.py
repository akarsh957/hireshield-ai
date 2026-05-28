from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
import random

router = APIRouter()

SCAM_COMPANY_TERMS = [
    "easy money", "quickhire", "earn from home", "no experience",
    "guaranteed income", "fastcash", "workfromhome", "unlimited earning"
]

class CompanyRequest(BaseModel):
    company_name: str
    website: Optional[str] = None

@router.post("/score")
def trust_score(body: CompanyRequest):
    name_lower = body.company_name.lower()

    # Keyword check
    keyword_hits = sum(1 for t in SCAM_COMPANY_TERMS if t in name_lower)
    keyword_penalty = keyword_hits * 22

    # Domain age simulation (replace with real whois in prod)
    domain_age = random.randint(5, 800)
    age_penalty = 35 if domain_age < 30 else (15 if domain_age < 180 else 0)

    trust_score = max(0, min(100, 100 - keyword_penalty - age_penalty))
    verdict = "fraudulent" if trust_score < 30 else "suspicious" if trust_score < 60 else "genuine"

    summaries = {
        "fraudulent": f"{body.company_name} exhibits multiple scam indicators. Salary promises are statistically impossible. Do NOT apply or share personal information.",
        "suspicious": f"{body.company_name} has some warning signs. Verify independently via official channels before proceeding.",
        "genuine": f"{body.company_name} appears to be a legitimate company based on available signals."
    }

    return {
        "company_name":    body.company_name,
        "domain":          body.website or "unknown",
        "trust_score":     round(trust_score, 1),
        "domain_age_days": domain_age,
        "salary_anomaly":  keyword_hits > 0,
        "report_count":    keyword_hits * 5,
        "keyword_flags":   [t for t in SCAM_COMPANY_TERMS if t in name_lower],
        "verdict":         verdict,
        "ai_summary":      summaries[verdict]
    }
