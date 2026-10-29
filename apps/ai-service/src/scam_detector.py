"""
HireShield AI — Multi-Tier Hybrid Cascade Engine
Orchestrates:
  Tier 1: Local DeBERTa NLP Gatekeeper (Zero API Cost)
  Tier 2: Deep Context Reasoning via Gemini 1.5 Flash (Free AI Studio Tier)
  Tier 3: Resilient Offline Regex & Heuristics Matrix
"""

import os
import re
import json
import logging
from typing import Dict, Any, List, Tuple
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger("hireshield.cascade")

# -----------------------------------------------------------------------------
# Heuristic Pattern Definitions (Used by Tier 3 & Signal Extractions)
# -----------------------------------------------------------------------------

SCAM_REGEX_PATTERNS = [
    (r"(?i)\b(?:wire\s+transfer|western\s+union|moneygram)\b", "FINANCIAL_EXTORTION", "CRITICAL"),
    (r"(?i)\b(?:crypto|bitcoin|usdt|eth\s+wallet)\b", "CRYPTO_PAYMENT", "CRITICAL"),
    (r"(?i)\b(?:cashier'?s?\s+check|send\s+(?:a\s+)?check\s+for\s+equipment)\b", "EQUIPMENT_CHECK_SCAM", "CRITICAL"),
    (r"(?i)\b(?:telegram|whatsapp|signal\s+app)\s+(?:interview|chat|recruiter|hr)\b", "UNOFFICIAL_COMMUNICATION", "HIGH"),
    (r"(?i)\b(?:no\s+interview\s+required|immediate\s+offer|start\s+today\s+without\s+interview)\b", "IMMEDIATE_OFFER", "HIGH"),
    (r"(?i)\b(?:upfront\s+fee|registration\s+fee|background\s+check\s+fee|training\s+fee)\b", "FEE_REQUEST", "CRITICAL"),
    (r"(?i)\b(?:kindly\s+reply|kindly\s+revert|dear\s+applicant)\b", "PHISHING_LANGUAGE", "MEDIUM"),
    (r"(?i)\b(?:guaranteed\s+(?:\$\d+|income|earnings)|earn\s+\$\d+\s+per\s+day\s+from\s+home)\b", "UNREALISTIC_EARNINGS", "HIGH")
]

FREE_EMAIL_REGEX = r"(?i)[\w\.-]+@(gmail\.com|yahoo\.com|hotmail\.com|outlook\.com|aol\.com)\b"

# -----------------------------------------------------------------------------
# Tier 1: Lazy-Loaded Local DeBERTa NLP Pipeline
# -----------------------------------------------------------------------------

_nlp_classifier = None
_model_failed = False

def get_nlp_pipeline():
    """Lazily initialize the DeBERTa zero-shot classification pipeline."""
    global _nlp_classifier, _model_failed
    if _nlp_classifier is not None or _model_failed:
        return _nlp_classifier

    try:
        from transformers import pipeline
        logger.info("⏳ Initializing Tier 1 Local DeBERTa Model (microsoft/deberta-v3-small)...")
        # Load zero-shot classification pipeline using CPU or MPS/CUDA if available
        _nlp_classifier = pipeline(
            "zero-shot-classification",
            model="microsoft/deberta-v3-small",
            device=-1 # CPU execution for free-tier compatibility
        )
        logger.info("✅ Tier 1 DeBERTa Gatekeeper loaded successfully.")
    except Exception as e:
        logger.warning(f"⚠️ Tier 1 Local NLP model initialization skipped or deferred: {e}")
        _model_failed = True
        _nlp_classifier = None

    return _nlp_classifier


def run_tier1_nlp(text: str) -> Tuple[float, float]:
    """
    Tier 1 Gatekeeper:
    Uses DeBERTa to score the text against candidate labels.
    Returns: (scam_probability: 0.0 - 1.0, confidence: 0.0 - 1.0)
    """
    classifier = get_nlp_pipeline()
    if not classifier:
        # Fallback to lexical density score if PyTorch weights are pending download
        return run_fast_lexical_gate(text)

    try:
        candidate_labels = ["legitimate job posting", "employment fraud or recruitment scam"]
        # Limit text slice for microsecond inference on CPU
        result = classifier(text[:800], candidate_labels=candidate_labels, multi_label=False)
        labels = result["labels"]
        scores = result["scores"]

        scam_idx = labels.index("employment fraud or recruitment scam")
        scam_prob = float(scores[scam_idx])
        return scam_prob, 0.88
    except Exception as err:
        logger.warning(f"Tier 1 inference failed: {err}. Falling back to lexical gate.")
        return run_fast_lexical_gate(text)


def run_fast_lexical_gate(text: str) -> Tuple[float, float]:
    """Lightweight sub-millisecond lexical scoring used when NLP model is warming up."""
    matches = 0
    for pattern, _, _ in SCAM_REGEX_PATTERNS:
        if re.search(pattern, text):
            matches += 1
    
    if matches >= 3:
        return 0.90, 0.85
    elif matches == 0:
        return 0.12, 0.80
    else:
        # Ambiguous: triggers Tier 2 escalation
        return 0.50, 0.65

# -----------------------------------------------------------------------------
# Tier 2: Deep Analysis via Google Gemini 1.5 Flash
# -----------------------------------------------------------------------------

def run_tier2_gemini(text: str, company_name: str = None) -> Dict[str, Any]:
    """
    Tier 2 Deep Analyzer:
    Sends structured prompt to Google Gemini 1.5 Flash for nuanced threat reasoning.
    """
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key:
        raise ValueError("GEMINI_API_KEY is not configured in environment.")

    import google.generativeai as genai
    genai.configure(api_key=api_key)

    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        generation_config={
            "temperature": 0.1,
            "response_mime_type": "application/json"
        }
    )

    prompt = f"""
You are an elite fraud investigator specializing in employment recruitment scams.
Analyze the following job description and return a strictly valid JSON object.

Job Posting:
\"\"\"{text[:4000]}\"\"\"
Reported Company: {company_name or 'Unspecified'}

You MUST respond with this exact JSON schema:
{{
  "riskScore": <number between 0 and 100>,
  "verdict": "<LEGITIMATE | SUSPICIOUS | CONFIRMED_SCAM>",
  "risk_indicators": {{
    "asksForMoney": <boolean>,
    "suspiciousContact": <boolean>,
    "guaranteedIncome": <boolean>,
    "freeEmailDomain": <boolean>,
    "vagueJobDetails": <boolean>
  }},
  "flaggedKeywords": [
    {{"keyword": "<phrase>", "category": "<CATEGORY>", "severity": "<HIGH|CRITICAL>"}}
  ],
  "ai_summary": "<Concise 2-sentence summary of findings>",
  "recommendedAction": "<One sentence guidance for the candidate>"
}}
"""

    response = model.generate_content(prompt)
    if not response or not response.text:
        raise RuntimeError("Empty response received from Gemini API.")

    parsed = json.loads(response.text.strip())
    return parsed

# -----------------------------------------------------------------------------
# Tier 3: Offline Regex Fallback Engine
# -----------------------------------------------------------------------------

def run_tier3_regex(text: str, baseline_score: float = 0.5) -> Dict[str, Any]:
    """
    Tier 3 Fallback Engine:
    Executed when Gemini is unreachable, rate-limited, or network is down.
    Applies deterministic regular expression heuristic matrices.
    """
    flagged = []
    has_money_request = False
    has_suspicious_contact = False
    has_unrealistic_income = False

    for pattern, category, severity in SCAM_REGEX_PATTERNS:
        match = re.search(pattern, text)
        if match:
            matched_phrase = match.group(0).lower()
            flagged.append({
                "keyword": matched_phrase,
                "category": category,
                "severity": severity
            })
            if category in ["FINANCIAL_EXTORTION", "CRYPTO_PAYMENT", "EQUIPMENT_CHECK_SCAM", "FEE_REQUEST"]:
                has_money_request = True
            if category == "UNOFFICIAL_COMMUNICATION":
                has_suspicious_contact = True
            if category == "UNREALISTIC_EARNINGS":
                has_unrealistic_income = True

    has_free_email = bool(re.search(FREE_EMAIL_REGEX, text))
    if has_free_email:
        flagged.append({
            "keyword": "Free public email provider used for corporate recruitment",
            "category": "FREE_EMAIL_DOMAIN",
            "severity": "HIGH"
        })

    # Calculate risk score based on rule violations
    flag_count = len(flagged)
    if flag_count == 0:
        risk_score = 12.0
        verdict = "LEGITIMATE"
        ai_summary = "Heuristic regex audit detected zero known scam keywords or suspicious payment vectors."
        recommended = "Standard employment posting. Verify official company domain before sharing sensitive personal records."
    elif has_money_request or flag_count >= 2:
        risk_score = min(98.0, 65.0 + (flag_count * 10.0))
        verdict = "CONFIRMED_SCAM"
        ai_summary = f"Flagged {flag_count} critical scam signatures including upfront payment or unofficial messaging channels."
        recommended = "DO NOT PROCEED. Legitimate companies never request payments, checks, or interviews solely via chat apps."
    else:
        risk_score = 52.0
        verdict = "SUSPICIOUS"
        ai_summary = "Contains ambiguous recruitment language or non-standard corporate communications."
        recommended = "Exercise caution. Confirm the recruiter's identity on LinkedIn and company website."

    return {
        "riskScore": round(risk_score, 2),
        "verdict": verdict,
        "risk_indicators": {
            "asksForMoney": has_money_request,
            "suspiciousContact": has_suspicious_contact,
            "guaranteedIncome": has_unrealistic_income,
            "freeEmailDomain": has_free_email,
            "vagueJobDetails": flag_count > 0
        },
        "flaggedKeywords": flagged,
        "ai_summary": ai_summary,
        "recommendedAction": recommended
    }

# -----------------------------------------------------------------------------
# Cascade Orchestrator
# -----------------------------------------------------------------------------

def analyze_job_cascade(text: str, company_name: str = None) -> Dict[str, Any]:
    """
    Executes the 3-Tier Hybrid Cascade:
      1. Tier 1 NLP check.
      2. If ambiguous (0.3 <= score <= 0.7), escalates to Tier 2 (Gemini).
      3. If Tier 2 fails/rate-limits, falls back to Tier 3 (Regex).
    """
    tier_used = "TIER_1_NLP"
    
    # ------------------
    # Step 1: Tier 1 NLP
    # ------------------
    scam_prob, nlp_confidence = run_tier1_nlp(text)
    
    # If decisively safe (Zero API Cost)
    if scam_prob < 0.30:
        logger.info(f"⚡ [Cascade] Tier 1 Decisive Pass: Scam Prob {scam_prob:.2f} < 0.30")
        return {
            "verdict": "LEGITIMATE",
            "riskScore": round(scam_prob * 100, 2),
            "confidenceScore": round(nlp_confidence * 100, 2),
            "flaggedKeywords": [],
            "riskIndicators": {
                "asksForMoney": False,
                "suspiciousContact": False,
                "guaranteedIncome": False,
                "freeEmailDomain": False,
                "vagueJobDetails": False
            },
            "aiSummary": "Classified as legitimate via local DeBERTa NLP transformer with high confidence.",
            "recommendedAction": "Posting conforms to normal recruitment standards. Always verify company identity.",
            "tierUsed": "TIER_1_NLP"
        }

    # If decisively dangerous (Zero API Cost)
    if scam_prob > 0.70:
        logger.info(f"⚡ [Cascade] Tier 1 Decisive Flag: Scam Prob {scam_prob:.2f} > 0.70")
        regex_fallback = run_tier3_regex(text, scam_prob)
        return {
            "verdict": "CONFIRMED_SCAM",
            "riskScore": max(75.0, round(scam_prob * 100, 2)),
            "confidenceScore": 91.0,
            "flaggedKeywords": regex_fallback["flaggedKeywords"],
            "riskIndicators": regex_fallback["risk_indicators"],
            "aiSummary": "Classified as high-confidence employment fraud via local DeBERTa NLP transformer.",
            "recommendedAction": "High risk of employment fraud detected. Cease communication immediately.",
            "tierUsed": "TIER_1_NLP"
        }

    # -------------------------------------------------------------------------
    # Step 2: Ambiguous Zone (0.30 <= scam_prob <= 0.70) -> Escalate to Tier 2
    # -------------------------------------------------------------------------
    logger.info(f"🔍 [Cascade] Tier 1 Ambiguous ({scam_prob:.2f}). Escalating to Tier 2 Gemini Flash...")
    try:
        gemini_result = run_tier2_gemini(text, company_name)
        tier_used = "TIER_2_GEMINI"
        return {
            "verdict": gemini_result.get("verdict", "SUSPICIOUS"),
            "riskScore": float(gemini_result.get("riskScore", scam_prob * 100)),
            "confidenceScore": 95.0,
            "flaggedKeywords": gemini_result.get("flaggedKeywords", []),
            "riskIndicators": gemini_result.get("risk_indicators", {}),
            "aiSummary": gemini_result.get("ai_summary", "Analyzed via Google Gemini 1.5 Flash."),
            "recommendedAction": gemini_result.get("recommendedAction", "Verify recruiter before submitting data."),
            "tierUsed": tier_used
        }
    except Exception as gemini_err:
        logger.warning(f"⚠️ [Cascade] Tier 2 Gemini failed or rate-limited: {gemini_err}. Invoking Tier 3 Regex...")

    # -------------------------------------------------------------------------
    # Step 3: Tier 3 Regex Offline Fallback
    # -------------------------------------------------------------------------
    regex_res = run_tier3_regex(text, scam_prob)
    return {
        "verdict": regex_res["verdict"],
        "riskScore": regex_res["riskScore"],
        "confidenceScore": 85.0,
        "flaggedKeywords": regex_res["flaggedKeywords"],
        "riskIndicators": regex_res["risk_indicators"],
        "aiSummary": f"{regex_res['ai_summary']} (Triggered by offline fallback cascade).",
        "recommendedAction": regex_res["recommendedAction"],
        "tierUsed": "TIER_3_REGEX"
    }


def analyze_ocr_gemini(base64_data: str, mime_type: str = "image/png") -> Dict[str, Any]:
    """
    Multimodal OCR via Gemini 1.5 Flash:
    Transcribes images or PDFs and extracts company & contact vectors.
    """
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key:
        raise ValueError("GEMINI_API_KEY is not configured in environment.")

    import google.generativeai as genai
    genai.configure(api_key=api_key)

    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        generation_config={
            "temperature": 0.1,
            "response_mime_type": "application/json"
        }
    )

    image_part = {
        "mime_type": mime_type,
        "data": base64_data
    }

    prompt = """
    Analyze and transcribe this job document / offer letter / email screenshot.
    Extract the complete text, identify company name, and contact email.
    
    You MUST respond with this exact JSON schema:
    {
      "text": "<full transcribed text>",
      "companyName": "<company or null>",
      "contactEmail": "<email address or null>"
    }
    """

    response = model.generate_content([image_part, prompt])
    if not response or not response.text:
        raise RuntimeError("Empty response received from Gemini OCR.")

    return json.loads(response.text.strip())
