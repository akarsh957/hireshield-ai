"""
HireShield AI — FastAPI AI Microservice Entrypoint
Hybrid Job Fraud Classification Engine.
"""

import time
import os
import logging
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

try:
    from .schemas import JobScanRequest, ScanResponse
    from .scam_detector import analyze_job_cascade, get_nlp_pipeline
except (ImportError, ValueError):
    from schemas import JobScanRequest, ScanResponse
    from scam_detector import analyze_job_cascade, get_nlp_pipeline

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("hireshield.api")

load_dotenv(override=True)

app = FastAPI(
    title="HireShield AI Microservice",
    description="Multi-tier Hybrid Job Fraud Detection Engine (DeBERTa v3 + Gemini 1.5 Flash + Regex)",
    version="2.0.0"
)

# -----------------------------------------------------------------------------
# CORS Configuration
# -----------------------------------------------------------------------------
ALLOWED_ORIGINS = [
    "http://localhost:4000", # Express backend
    "http://localhost:3000", # Next.js frontend
    "http://127.0.0.1:4000",
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# -----------------------------------------------------------------------------
# Endpoints
# -----------------------------------------------------------------------------

@app.get("/health", status_code=status.HTTP_200_OK)
async def health_check():
    """Health and readiness probe for uptime monitoring."""
    gemini_key = os.getenv("GEMINI_API_KEY", "").strip()
    return {
        "status": "healthy",
        "service": "hireshield-ai-service",
        "architecture": "3-Tier Hybrid Cascade",
        "tiers": {
            "tier1_deberta_nlp": "ready",
            "tier2_gemini_flash": "configured" if bool(gemini_key) else "missing_api_key",
            "tier3_regex_fallback": "active"
        },
        "timestamp": int(time.time())
    }

@app.post("/analyze/job", response_model=ScanResponse, status_code=status.HTTP_200_OK)
async def analyze_job(payload: JobScanRequest):
    """
    Primary Job Fraud Detection Endpoint:
    Orchestrates the Tier 1 -> Tier 2 -> Tier 3 Hybrid Cascade.
    """
    start_time = time.time()
    try:
        # Run Cascade Inference
        result = analyze_job_cascade(
            text=payload.text,
            company_name=payload.companyName
        )
        duration_ms = int((time.time() - start_time) * 1000)

        return ScanResponse(
            verdict=result["verdict"],
            riskScore=result["riskScore"],
            confidenceScore=result.get("confidenceScore", 90.0),
            flaggedKeywords=result.get("flaggedKeywords", []),
            riskIndicators=result.get("riskIndicators", {}),
            aiSummary=result.get("aiSummary", ""),
            recommendedAction=result.get("recommendedAction", ""),
            tierUsed=result.get("tierUsed", "UNKNOWN"),
            processingTimeMs=duration_ms
        )
    except Exception as exc:
        logger.error(f"Unhandled error during job scan cascade: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference cascade failed: {str(exc)}"
        )

# Optional root redirect or ping
@app.get("/", status_code=status.HTTP_200_OK)
async def root():
    return {
        "service": "HireShield AI Engine",
        "docs": "/docs",
        "health": "/health"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("src.main:app", host="127.0.0.1", port=port, reload=True)
