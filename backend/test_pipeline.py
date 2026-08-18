import sys
from pathlib import Path

# Add project root to sys.path
root_dir = Path(__file__).resolve().parent.parent
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

from backend.models.risk_engine import clinical_risk_engine
from backend.models.biomarker_forecaster import biomarker_forecaster
from backend.rag.clinical_kb import clinical_rag_retriever

print("--- Testing Clinical Risk Engine ---")
risk_out = clinical_risk_engine.predict_comprehensive_risk({
    'cholesterol': 230, 
    'hdl': 38, 
    'ldl': 155, 
    'triglycerides': 220, 
    'glucose': 118, 
    'hba1c': 6.2
})
print(f"CVD Risk: {risk_out['cardiovascularRisk']['probability']}% ({risk_out['cardiovascularRisk']['tier']})")
print(f"Diabetes Risk: {risk_out['diabetesMetabolicRisk']['probability']}% ({risk_out['diabetesMetabolicRisk']['tier']})")
print(f"Metabolic Health Score: {risk_out['metabolicHealthScore']['score']}/100")
print(f"Top Risk Driver: {risk_out['explainabilitySummary']['topRiskDrivers'][0]['feature']} (+{risk_out['explainabilitySummary']['topRiskDrivers'][0]['marginalEffectPercent']}%)")

print("\n--- Testing Biomarker Forecaster ---")
fc_out = biomarker_forecaster.forecast_trajectory([
    {'date': '2024-01-01', 'value': 5.8},
    {'date': '2024-06-01', 'value': 6.2}
], 'hba1c')
print(f"Forecast Trend: {fc_out['trendLabel']}")
print(f"3-Month Projection: {fc_out['forecast'][1]['value']} {fc_out['unit']}")
print(f"6-Month Projection: {fc_out['forecast'][2]['value']} {fc_out['unit']}")

print("\n--- Testing Clinical RAG Retriever ---")
kb_out = clinical_rag_retriever.retrieve_guidelines(['cholesterol', 'triglycerides'])
print(f"Retrieved Guidelines Count: {len(kb_out)}")
for kb in kb_out:
    print(f"- [{kb['id']}] {kb['title']} ({kb['evidenceGrade']})")

print("\n>>> ALL DATA SCIENCE & ML ENGINE SANITY TESTS PASSED! <<<")
