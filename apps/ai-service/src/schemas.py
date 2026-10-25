"""
HireShield AI — Pydantic Schemas
Strict validation models for Job Fraud Detection Microservice.
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class JobScanRequest(BaseModel):
    text: str = Field(
        ...,
        min_length=15,
        max_length=15000,
        description="The raw text of the job description, recruitment post, or offer letter."
    )
    companyName: Optional[str] = Field(
        default=None,
        description="Optional name of the hiring organization reported in the listing."
    )
    contactEmail: Optional[str] = Field(
        default=None,
        description="Optional contact email address provided in the job post."
    )

class FlaggedKeywordItem(BaseModel):
    keyword: str
    category: str
    severity: str

class RiskIndicators(BaseModel):
    asksForMoney: bool = Field(default=False, description="Requests wire transfer, crypto, or upfront purchase")
    suspiciousContact: bool = Field(default=False, description="Conducts interviews over Telegram/WhatsApp")
    guaranteedIncome: bool = Field(default=False, description="Promises unrealistic guaranteed returns for minimal work")
    freeEmailDomain: bool = Field(default=False, description="Uses @gmail.com or @yahoo.com for corporate recruitment")
    vagueJobDetails: bool = Field(default=False, description="Lacks specific responsibilities or verifiable credentials")

class ScanResponse(BaseModel):
    verdict: str = Field(
        ...,
        description="Overall threat verdict: LEGITIMATE | SUSPICIOUS | CONFIRMED_SCAM"
    )
    riskScore: float = Field(
        ...,
        ge=0.0,
        le=100.0,
        description="Aggregated fraud probability score on a 0.00 to 100.00 scale."
    )
    confidenceScore: float = Field(
        default=90.0,
        ge=0.0,
        le=100.0,
        description="Model confidence level in the generated verdict."
    )
    flaggedKeywords: List[Dict[str, Any]] = Field(
        default_factory=list,
        description="Extracted high-risk key phrases and threat categories."
    )
    riskIndicators: Dict[str, Any] = Field(
        default_factory=dict,
        description="Boolean indicators for specific fraud categories."
    )
    aiSummary: str = Field(
        ...,
        description="Concise human-readable risk summary and justification."
    )
    recommendedAction: str = Field(
        ...,
        description="Actionable safety guidance for job seekers."
    )
    tierUsed: str = Field(
        ...,
        description="Detection tier that resolved the request: TIER_1_NLP | TIER_2_GEMINI | TIER_3_REGEX"
    )
    processingTimeMs: int = Field(
        ...,
        description="Total end-to-end processing latency in milliseconds."
    )
