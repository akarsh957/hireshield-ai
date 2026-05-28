from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import classify, trust_score, ocr as ocr_router

app = FastAPI(
    title="HireShield AI — ML Microservice",
    description="NLP fraud detection, OCR, and company trust scoring",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:4000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(classify.router,    prefix="/ml",    tags=["Classification"])
app.include_router(trust_score.router, prefix="/trust", tags=["Trust Score"])
app.include_router(ocr_router.router,  prefix="/ocr",   tags=["OCR"])

@app.get("/health")
def health():
    return {"status": "online", "service": "HireShield AI Service", "model": "distilbert-v3.1"}
