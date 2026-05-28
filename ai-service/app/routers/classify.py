from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
import re

router = APIRouter()

# ── Keyword Engine ────────────────────────────────────────────────────────────
SCAM_KEYWORDS = {
    "critical": [
        "upfront fee", "training fee", "registration fee", "deposit required",
        "no experience needed", "earn from home", "work from home earn",
        "immediate joining", "limited slots", "urgent hiring only",
        "advance payment", "send money first"
    ],
    "high": [
        "$5,000 week", "$8,000 week", "₹1,00,000", "₹80,000 week",
        "send your details to", "whatsapp to apply", "no interview required",
        "directly selected", "guaranteed income", "unlimited earning"
    ],
    "medium": [
        "hurry", "act now", "don't miss", "gmail.com hiring",
        "yahoo.com recruiter", "100% work from home", "part time unlimited"
    ]
}

SALARY_PATTERNS = [
    r"₹[\d,]+\s*(per|/)\s*week",
    r"\$[\d,]+\s*(weekly|per week)",
    r"earn\s+₹[\d,]+\s*per week",
    r"salary.*5000.*week",
    r"₹\d+\s*lakh.*per.*week",
]

def scan_keywords(text: str):
    found = []
    tl = text.lower()
    for level, words in SCAM_KEYWORDS.items():
        for w in words:
            if w in tl:
                found.append({"keyword": w, "severity": level})
    return found

def check_salary_anomaly(text: str) -> bool:
    return any(re.search(p, text, re.IGNORECASE) for p in SALARY_PATTERNS)

def compute_score(flags, salary_anomaly: bool) -> float:
    weights = {"critical": 20, "high": 14, "medium": 8}
    score = sum(weights.get(f["severity"], 5) for f in flags)
    if salary_anomaly:
        score += 25
    return min(score, 97)

def get_explanation(verdict: str, flag_count: int) -> str:
    if verdict == "fraudulent":
        return (f"This content contains {flag_count} critical fraud indicators. "
                "Unrealistic salary promises, upfront payment requirements, and urgency tactics "
                "are hallmarks of advance-fee recruitment scams. "
                "Do NOT share personal information or make any payments.")
    if verdict == "suspicious":
        return (f"This content shows {flag_count} warning signs. "
                "Verify the company's legitimacy through official channels before proceeding.")
    return ("This content appears legitimate. "
            "Always verify company details independently before sharing sensitive personal information.")

# ── Route ─────────────────────────────────────────────────────────────────────
class ClassifyRequest(BaseModel):
    text: str
    scan_type: Optional[str] = "job"

@router.post("/classify")
def classify(body: ClassifyRequest):
    flags     = scan_keywords(body.text)
    salary_ok = check_salary_anomaly(body.text)
    score     = compute_score(flags, salary_ok)

    # Try HuggingFace model if available
    try:
        from transformers import pipeline
        pipe = pipeline("text-classification",
                        model="distilbert-base-uncased-finetuned-sst-2-english",
                        device=-1)
        hf = pipe(body.text[:512], truncation=True)[0]
        if hf["label"] == "NEGATIVE":
            score = (score * 0.6) + (hf["score"] * 100 * 0.4)
    except Exception:
        pass  # Use keyword score only

    verdict = "fraudulent" if score >= 65 else "suspicious" if score >= 35 else "genuine"

    return {
        "verdict":          verdict,
        "confidence_score": round(float(score), 2),
        "flags":            [f["keyword"] for f in flags],
        "salary_anomaly":   salary_ok,
        "explanation":      get_explanation(verdict, len(flags)),
        "model_version":    "hireshield-v1.0"
    }
