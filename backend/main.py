"""
FastAPI Data Science & Multi-Agent Backend Server
"""

import os
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.models.risk_engine import clinical_risk_engine
from backend.models.biomarker_forecaster import biomarker_forecaster
from backend.rag.clinical_kb import clinical_rag_retriever
from backend.agents.multi_agent_system import multi_agent_pipeline

app = FastAPI(
    title="MedReport AI - Data Science & Multi-Agent Intelligence Service",
    version="2.0.0",
    description="Multi-agent clinical orchestration, supervised risk modeling, SHAP explainability, and longitudinal biomarker forecasting."
)

# Enable CORS for Next.js frontend
# Set FRONTEND_URL in production (e.g. https://medreport-ai-gamma.vercel.app).
# Falls back to "*" for local development convenience.
_frontend_url = os.environ.get("FRONTEND_URL", "")
_allowed_origins = [_frontend_url] if _frontend_url else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class RiskPredictionRequest(BaseModel):
    metrics: Dict[str, float]
    patientAge: Optional[float] = 48.0


class ForecastRequest(BaseModel):
    biomarker: str
    history: List[Dict[str, Any]]


@app.get("/api/health")
async def health_check():
    return {
        "status": "HEALTHY",
        "service": "MedReport AI Data Science Backend",
        "capabilities": [
            "AI x AI Multi-Agent Pipeline (LangGraph/Agentic Loop)",
            "Supervised ML Risk Stratification (Gradient Boosting / Random Forest)",
            "Explainable AI (SHAP Marginal Attributions)",
            "Clinical RAG Engine (ADA/AHA/KDIGO/WHO Guidelines)",
            "Longitudinal Biomarker Forecasting"
        ]
    }


@app.post("/api/analyze-agentic")
async def analyze_agentic_report(
    reportText: str = Form(""),
    language: str = Form("english"),
    reportType: str = Form("General"),
    patientAge: float = Form(48.0),
    image: Optional[UploadFile] = File(None)
):
    """
    Main Multi-Agent AI x AI Pipeline Endpoint.
    Orchestrates Agent 1 (Extraction) -> ML/RAG -> Agent 2 (Synthesis) -> Agent 3 (AI Safety Critic).
    """
    image_bytes = None
    image_mime = None
    
    if image:
        image_bytes = await image.read()
        image_mime = image.content_type

    if not reportText.strip() and not image_bytes:
        raise HTTPException(status_code=400, detail="Either reportText or image file is required.")

    result = await multi_agent_pipeline.execute_pipeline(
        report_text=reportText,
        language=language,
        report_type=reportType,
        patient_age=patientAge,
        image_bytes=image_bytes,
        image_mime=image_mime
    )

    return result


@app.post("/api/predict-risk")
async def predict_clinical_risk(payload: RiskPredictionRequest):
    """Predicts cardiovascular and metabolic risk with exact SHAP feature attributions."""
    return clinical_risk_engine.predict_comprehensive_risk(
        metrics=payload.metrics,
        patient_age=payload.patientAge or 48.0
    )


@app.post("/api/forecast-biomarkers")
async def forecast_biomarkers(payload: ForecastRequest):
    """Longitudinal time-series trajectory estimation & 3m/6m forecasting."""
    return biomarker_forecaster.forecast_trajectory(
        history=payload.history,
        biomarker_name=payload.biomarker
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
