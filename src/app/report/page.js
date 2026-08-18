"use client";

import { useState } from "react";
import { MouseGlow } from "@/components/ui/mouse-glow";
import { GlowOrb } from "@/components/ui/glow-orb";
import Link from "next/link";

export default function ReportPage() {
  const [activeTab, setActiveTab] = useState("agentic"); // "agentic" | "forecast"
  const [reportText, setReportText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState("english");
  const [reportType, setReportType] = useState("General");
  const [patientAge, setPatientAge] = useState(48);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Time-Series Forecasting State
  const [forecastBiomarker, setForecastBiomarker] = useState("hba1c");
  const [forecastHistory, setForecastHistory] = useState([
    { date: "2024-01-15", value: 5.6 },
    { date: "2024-06-20", value: 6.0 },
    { date: "2024-11-10", value: 6.3 }
  ]);
  const [forecastResult, setForecastResult] = useState(null);
  const [forecastLoading, setForecastLoading] = useState(false);

  const sampleReports = {
    General: "Hemoglobin: 10.2 g/dL, WBC: 8000/µL, Fasting Glucose: 110 mg/dL, Total Cholesterol: 215 mg/dL",
    CBC: "Hemoglobin: 10.2 g/dL, WBC: 8000/µL, Platelets: 250000/µL, RBC: 4.5 million/µL",
    Thyroid: "TSH: 5.8 mIU/L, T3: 110 ng/dL, T4: 7.2 µg/dL",
    "Lipid Profile": "Total Cholesterol: 235 mg/dL, HDL: 38 mg/dL, LDL: 152 mg/dL, Triglycerides: 210 mg/dL",
    "Blood Sugar": "Fasting Glucose: 124 mg/dL, HbA1c: 6.4%, Postprandial Glucose: 165 mg/dL",
    "Comprehensive Metabolic": "Total Cholesterol: 220 mg/dL, HDL: 42 mg/dL, LDL: 140 mg/dL, Triglycerides: 190 mg/dL, Fasting Glucose: 115 mg/dL, HbA1c: 6.1%, Creatinine: 1.1 mg/dL, ALT: 45 U/L"
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUseSample = () => {
    setReportText(sampleReports[reportType] || sampleReports["General"]);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleAnalyze = async () => {
    if (!reportText.trim() && !imageFile) {
      setError("Please paste your report or upload a photo");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("reportText", reportText);
      formData.append("language", language);
      formData.append("reportType", reportType);
      formData.append("patientAge", String(patientAge));
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze report");
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRunForecast = async () => {
    setForecastLoading(true);
    try {
      const response = await fetch("/api/forecast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          biomarker: forecastBiomarker,
          history: forecastHistory
        })
      });
      const data = await response.json();
      setForecastResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setForecastLoading(false);
    }
  };

  const addHistoryRow = () => {
    setForecastHistory([
      ...forecastHistory,
      { date: new Date().toISOString().split("T")[0], value: 6.5 }
    ]);
  };

  const updateHistoryRow = (index, field, value) => {
    const updated = [...forecastHistory];
    updated[index][field] = value;
    setForecastHistory(updated);
  };

  const removeHistoryRow = (index) => {
    if (forecastHistory.length <= 2) return;
    setForecastHistory(forecastHistory.filter((_, i) => i !== index));
  };

  return (
    <>
      <MouseGlow />
      <GlowOrb />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-black dark:text-white">
          <span className="text-xl">🩺</span>
          <span>MedReport<span className="text-blue-500">AI</span></span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 font-mono">
            AI×AI Clinical Suite
          </span>
        </Link>
        <Link
          href="/"
          className="text-xs md:text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          ← Back to Home
        </Link>
      </nav>

      <main className="min-h-screen pt-28 pb-20 px-4 md:px-8 max-w-6xl mx-auto">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <button
            onClick={() => setActiveTab("agentic")}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === "agentic"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800"
            }`}
          >
            <span>🤖 × 🤖</span>
            <span>AI × AI Multi-Agent Report Analysis</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("forecast");
              if (!forecastResult) handleRunForecast();
            }}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === "forecast"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800"
            }`}
          >
            <span>📈</span>
            <span>Longitudinal Biomarker Forecaster (Time-Series)</span>
          </button>
        </div>

        {/* TAB 1: AI × AI MULTI-AGENT REPORT ANALYSIS */}
        {activeTab === "agentic" && (
          <div className="flex flex-col items-center">
            
            <div className="text-center max-w-2xl mb-8">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mb-2">
                Multi-Agent Clinical Intelligence
              </h1>
              <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400">
                Automated OCR/Extraction, Predictive Supervised ML Risk Modeling, RAG Clinical Practice Guidelines, and Autonomous AI Safety Critic.
              </p>
            </div>

            {/* Input Form Card */}
            <div className="w-full max-w-3xl p-6 md:p-8 rounded-3xl bg-neutral-50/70 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 backdrop-blur-md shadow-xl">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                    Report Category
                  </label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="General">General Panel</option>
                    <option value="CBC">CBC (Complete Blood Count)</option>
                    <option value="Thyroid">Thyroid (TSH, T3, T4)</option>
                    <option value="Lipid Profile">Lipid Profile (Cholesterol)</option>
                    <option value="Blood Sugar">Blood Sugar (Glucose/HbA1c)</option>
                    <option value="Comprehensive Metabolic">Comprehensive Metabolic (All)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                    Explanation Language
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setLanguage("english")}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                        language === "english"
                          ? "bg-blue-600 text-white"
                          : "bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                      }`}
                    >
                      English
                    </button>
                    <button
                      type="button"
                      onClick={() => setLanguage("hindi")}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                        language === "hindi"
                          ? "bg-blue-600 text-white"
                          : "bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                      }`}
                    >
                      हिंदी
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                    Patient Age (ML Risk Calibration)
                  </label>
                  <input
                    type="number"
                    min="18"
                    max="100"
                    value={patientAge}
                    onChange={(e) => setPatientAge(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Text Input Area */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Lab Report Values
                  </label>
                  <button
                    type="button"
                    onClick={handleUseSample}
                    className="text-xs text-blue-500 hover:text-blue-600 font-medium underline"
                  >
                    Load sample {reportType} values
                  </button>
                </div>
                <textarea
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  className="w-full h-36 p-4 rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                  placeholder="e.g. Hemoglobin: 10.2 g/dL, Total Cholesterol: 220 mg/dL, Fasting Glucose: 110 mg/dL, HbA1c: 6.2%..."
                />
              </div>

              {/* Image Upload Area */}
              <div className="mb-6">
                <label
                  htmlFor="report-image"
                  className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-2xl cursor-pointer bg-white/50 dark:bg-neutral-950/50 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                >
                  {imagePreview ? (
                    <div className="flex items-center gap-3">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-16 w-16 object-cover rounded-lg border border-neutral-300 dark:border-neutral-700"
                      />
                      <span className="text-xs text-neutral-600 dark:text-neutral-300 font-medium">
                        Photo attached. Click to change.
                      </span>
                    </div>
                  ) : (
                    <div className="text-center">
                      <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                        📸 Drag & drop or click to upload a photo of your lab report
                      </span>
                    </div>
                  )}
                </label>
                <input
                  id="report-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full py-4 rounded-2xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition-all disabled:opacity-60 flex items-center justify-center gap-3 text-sm md:text-base"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Running AI × AI Multi-Agent Pipeline...</span>
                  </>
                ) : (
                  <>
                    <span>⚡</span>
                    <span>Execute AI × AI Multi-Agent Pipeline</span>
                  </>
                )}
              </button>

              {error && (
                <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-medium text-center">
                  {error}
                </div>
              )}
            </div>

            {/* RESULTS SECTION */}
            {result && (
              <div className="w-full max-w-4xl mt-12 flex flex-col gap-8">
                
                {/* 1. MULTI-AGENT EXECUTION TRACE LOGS */}
                {result.pipelineTraces && (
                  <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 text-neutral-100 shadow-xl">
                    <div className="flex items-center justify-between mb-4 border-b border-neutral-800 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-400">🤖 × 🤖</span>
                        <h2 className="font-bold text-sm uppercase tracking-wider text-neutral-200">
                          Multi-Agent Execution Pipeline Trace
                        </h2>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 font-mono">
                        Pipeline: Done (5 Steps)
                      </span>
                    </div>

                    <div className="space-y-3">
                      {result.pipelineTraces.map((trace, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/80 text-xs"
                        >
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[10px]">
                            {idx + 1}
                          </span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-neutral-200">{trace.agent}</span>
                              <span className="text-[10px] text-green-400 font-mono">COMPLETED</span>
                            </div>
                            <p className="text-neutral-400 mt-0.5">{trace.role}</p>
                            {trace.outputSummary && (
                              <p className="text-neutral-300 mt-1 font-mono text-[11px] bg-neutral-900/80 p-1.5 rounded">
                                ➔ {trace.outputSummary}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. AI SAFETY CRITIC AUDIT BADGE */}
                {result.aiSafetyAudit && (
                  <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 to-neutral-900 border border-emerald-500/30 shadow-lg">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 text-lg">🛡️</span>
                        <h3 className="font-bold text-sm text-emerald-400 uppercase tracking-wider">
                          Autonomous AI Safety Critic Audit (AI Reviewing AI)
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold font-mono">
                          Safety Score: {result.aiSafetyAudit.safetyScore}%
                        </span>
                        <span className="text-xs px-3 py-1 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700 font-mono">
                          Hallucination Index: {result.aiSafetyAudit.hallucinationRisk}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      {result.aiSafetyAudit.auditRemarks}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 pt-3 border-t border-emerald-900/40">
                      {result.aiSafetyAudit.checksPassed?.map((chk, i) => (
                        <div key={i} className="flex items-center gap-2 text-[11px] text-emerald-300/90">
                          <span>✓</span>
                          <span>{chk}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. PREDICTIVE SUPERVISED ML RISK STRATIFICATION */}
                {result.mlRiskProfile && (
                  <div className="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-md">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="font-bold text-base text-neutral-900 dark:text-white">
                          Predictive Machine Learning Risk Stratification
                        </h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          Calibrated Gradient Boosting & Random Forest models trained on clinical cohorts
                        </p>
                      </div>
                      <span className="text-xs font-mono px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 font-semibold">
                        Supervised ML Engine
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {/* CVD Gauge */}
                      <div className="p-4 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
                        <span className="text-xs text-neutral-500 uppercase font-semibold">10-Yr Cardiovascular Risk</span>
                        <div className="text-2xl font-bold mt-1 text-neutral-900 dark:text-white">
                          {result.mlRiskProfile.cardiovascularRisk.probability}%
                        </div>
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-2 ${
                          result.mlRiskProfile.cardiovascularRisk.tier.includes("High")
                            ? "bg-red-500/20 text-red-500 border border-red-500/30"
                            : result.mlRiskProfile.cardiovascularRisk.tier.includes("Moderate")
                            ? "bg-amber-500/20 text-amber-500 border border-amber-500/30"
                            : "bg-green-500/20 text-green-500 border border-green-500/30"
                        }`}>
                          {result.mlRiskProfile.cardiovascularRisk.tier}
                        </span>
                      </div>

                      {/* Diabetes Gauge */}
                      <div className="p-4 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
                        <span className="text-xs text-neutral-500 uppercase font-semibold">Diabetes / Metabolic Risk</span>
                        <div className="text-2xl font-bold mt-1 text-neutral-900 dark:text-white">
                          {result.mlRiskProfile.diabetesMetabolicRisk.probability}%
                        </div>
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-2 ${
                          result.mlRiskProfile.diabetesMetabolicRisk.tier.includes("High")
                            ? "bg-red-500/20 text-red-500 border border-red-500/30"
                            : result.mlRiskProfile.diabetesMetabolicRisk.tier.includes("Pre-Diabetic")
                            ? "bg-amber-500/20 text-amber-500 border border-amber-500/30"
                            : "bg-green-500/20 text-green-500 border border-green-500/30"
                        }`}>
                          {result.mlRiskProfile.diabetesMetabolicRisk.tier}
                        </span>
                      </div>

                      {/* Overall Score */}
                      <div className="p-4 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
                        <span className="text-xs text-neutral-500 uppercase font-semibold">Metabolic Health Index</span>
                        <div className="text-2xl font-bold mt-1 text-blue-500">
                          {result.mlRiskProfile.metabolicHealthScore.score} / 100
                        </div>
                        <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-2 bg-blue-500/10 text-blue-500 border border-blue-500/20">
                          {result.mlRiskProfile.metabolicHealthScore.rating}
                        </span>
                      </div>
                    </div>

                    {/* SHAP EXPLAINABLE AI BREAKDOWN */}
                    <div className="p-5 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-xs uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
                          🎯 Explainable AI (SHAP) Biomarker Attributions
                        </h4>
                        <span className="text-[10px] text-neutral-400 font-mono">Marginal Risk Impact</span>
                      </div>

                      <div className="space-y-2">
                        {result.mlRiskProfile.cardiovascularRisk.featureAttributions?.slice(0, 5).map((feat, i) => (
                          <div key={i} className="flex items-center gap-3 text-xs">
                            <span className="w-36 font-medium text-neutral-700 dark:text-neutral-300 truncate">
                              {feat.feature} ({feat.userValue})
                            </span>
                            <div className="flex-1 h-3 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden flex">
                              {feat.direction === "RISK_ELEVATING" ? (
                                <div
                                  className="bg-red-500 h-full rounded-full"
                                  style={{ width: `${Math.min(100, feat.impactMagnitude * 4)}%` }}
                                ></div>
                              ) : (
                                <div
                                  className="bg-emerald-500 h-full rounded-full ml-auto"
                                  style={{ width: `${Math.min(100, feat.impactMagnitude * 4)}%` }}
                                ></div>
                              )}
                            </div>
                            <span className={`w-20 text-right font-mono font-bold text-[11px] ${
                              feat.direction === "RISK_ELEVATING" ? "text-red-500" : "text-emerald-500"
                            }`}>
                              {feat.marginalEffectPercent > 0 ? `+${feat.marginalEffectPercent}%` : `${feat.marginalEffectPercent}%`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {/* 4. EXECUTIVE SUMMARY */}
                {result.reportAnalysis?.summary && (
                  <div className="p-6 rounded-3xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 shadow-md">
                    <h3 className="font-bold text-sm uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                      Clinical Executive Summary
                    </h3>
                    <p className="text-sm md:text-base leading-relaxed text-neutral-800 dark:text-neutral-200">
                      {result.reportAnalysis.summary}
                    </p>
                  </div>
                )}

                {/* 5. ITEMIZED BIOMARKER BREAKDOWN */}
                {result.reportAnalysis?.results && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg text-neutral-900 dark:text-white">
                      Itemized Biomarker Breakdown
                    </h3>

                    {result.reportAnalysis.results.map((item, index) => {
                      const statusColor =
                        item.status === "NORMAL"
                          ? "bg-green-50/70 dark:bg-green-950/30 border-green-300 dark:border-green-800/80"
                          : item.status === "BORDERLINE"
                          ? "bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800/80"
                          : "bg-red-50/70 dark:bg-red-950/30 border-red-300 dark:border-red-800/80";

                      return (
                        <div
                          key={index}
                          className={`p-6 rounded-3xl border ${statusColor} shadow-sm transition-all`}
                        >
                          <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                            <h4 className="font-bold text-base text-neutral-900 dark:text-white">
                              {item.testName}
                            </h4>
                            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/80 dark:bg-black/40 border border-neutral-200 dark:border-neutral-800 font-mono">
                              {item.status}
                            </span>
                          </div>
                          <p className="text-xs mb-2 text-neutral-600 dark:text-neutral-400 font-mono">
                            Patient Value: <strong className="text-neutral-900 dark:text-white">{item.value}</strong> | Reference Range: {item.normalRange}
                          </p>
                          <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                            {item.explanation}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 6. CLINICAL RAG PRACTICE GUIDELINE CITATIONS */}
                {result.clinicalEvidence && result.clinicalEvidence.length > 0 && (
                  <div className="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-md">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-blue-500">📚</span>
                      <h3 className="font-bold text-sm uppercase tracking-wider text-neutral-900 dark:text-white">
                        Grounded Clinical Practice Evidence (RAG Corpus)
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {result.clinicalEvidence.map((doc, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs"
                        >
                          <span className="inline-block font-mono text-[10px] font-bold text-blue-500 px-2 py-0.5 rounded bg-blue-500/10 mb-2">
                            {doc.id}
                          </span>
                          <h4 className="font-bold text-neutral-900 dark:text-white mb-1">
                            {doc.title}
                          </h4>
                          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-2">
                            {doc.summary}
                          </p>
                          <div className="text-[10px] text-neutral-500 font-mono">
                            Source: {doc.source} ({doc.evidenceGrade})
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 7. DOCTOR INQUIRY PROMPTS */}
                {result.reportAnalysis?.doctorQuestions && result.reportAnalysis.doctorQuestions.length > 0 && (
                  <div className="p-6 rounded-3xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/80 shadow-md">
                    <h3 className="font-bold text-base text-purple-900 dark:text-purple-300 mb-3 flex items-center gap-2">
                      <span>🩺</span>
                      <span>Targeted Discussion Questions for Your Doctor</span>
                    </h3>
                    <ul className="space-y-2">
                      {result.reportAnalysis.doctorQuestions.map((q, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs md:text-sm text-neutral-800 dark:text-neutral-200">
                          <span className="text-purple-500 font-bold">•</span>
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>
            )}

          </div>
        )}

        {/* TAB 2: LONGITUDINAL BIOMARKER FORECASTER (TIME-SERIES) */}
        {activeTab === "forecast" && (
          <div className="flex flex-col items-center max-w-4xl mx-auto">
            
            <div className="text-center max-w-2xl mb-8">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mb-2">
                Longitudinal Biomarker Forecasting
              </h2>
              <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400">
                Track historical biomarker trends across timepoints and compute linear/autoregressive velocity projections for the next 3 and 6 months.
              </p>
            </div>

            {/* Time Series Setup Box */}
            <div className="w-full p-6 md:p-8 rounded-3xl bg-neutral-50/70 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 backdrop-blur-md shadow-xl mb-8">
              
              <div className="mb-6">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                  Target Biomarker
                </label>
                <select
                  value={forecastBiomarker}
                  onChange={(e) => setForecastBiomarker(e.target.value)}
                  className="w-full sm:w-72 p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="hba1c">HbA1c Glycated Hemoglobin (%)</option>
                  <option value="glucose">Fasting Blood Glucose (mg/dL)</option>
                  <option value="total cholesterol">Total Cholesterol (mg/dL)</option>
                  <option value="ldl">LDL Cholesterol (mg/dL)</option>
                  <option value="triglycerides">Triglycerides (mg/dL)</option>
                  <option value="hemoglobin">Hemoglobin (g/dL)</option>
                  <option value="creatinine">Creatinine (mg/dL)</option>
                </select>
              </div>

              {/* Historical Rows Table */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Historical Timepoints (Minimum 2 required)
                  </label>
                  <button
                    type="button"
                    onClick={addHistoryRow}
                    className="text-xs font-bold text-blue-500 hover:text-blue-600"
                  >
                    + Add Timepoint
                  </button>
                </div>

                <div className="space-y-3">
                  {forecastHistory.map((row, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="text-xs font-mono text-neutral-400 w-6">#{idx + 1}</span>
                      <input
                        type="date"
                        value={row.date}
                        onChange={(e) => updateHistoryRow(idx, "date", e.target.value)}
                        className="p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-xs text-neutral-900 dark:text-white font-mono"
                      />
                      <input
                        type="number"
                        step="0.1"
                        value={row.value}
                        onChange={(e) => updateHistoryRow(idx, "value", e.target.value)}
                        className="w-32 p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-xs text-neutral-900 dark:text-white font-mono"
                        placeholder="Value"
                      />
                      {forecastHistory.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeHistoryRow(idx)}
                          className="text-xs text-red-500 hover:text-red-600 px-2"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleRunForecast}
                disabled={forecastLoading}
                className="w-full py-3.5 rounded-2xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition-all text-sm flex items-center justify-center gap-2"
              >
                {forecastLoading ? "Computing Time-Series Model..." : "📈 Compute Biomarker Trajectory & Projection"}
              </button>
            </div>

            {/* Trajectory Output Cards */}
            {forecastResult && (
              <div className="w-full p-6 md:p-8 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl">
                
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
                  <div>
                    <h3 className="font-bold text-lg text-neutral-900 dark:text-white">
                      Trajectory Velocity Analysis
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {forecastResult.insights}
                    </p>
                  </div>
                  <span className={`text-xs px-3 py-1.5 rounded-full font-bold font-mono ${
                    forecastResult.trendStatus?.includes("WORSENING")
                      ? "bg-red-500/20 text-red-500 border border-red-500/30"
                      : forecastResult.trendStatus?.includes("IMPROVING")
                      ? "bg-green-500/20 text-green-500 border border-green-500/30"
                      : "bg-blue-500/20 text-blue-500 border border-blue-500/30"
                  }`}>
                    {forecastResult.trendLabel}
                  </span>
                </div>

                {/* Projection Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {forecastResult.forecast?.map((fc, i) => (
                    <div
                      key={i}
                      className={`p-5 rounded-2xl border text-center ${
                        i === 0
                          ? "bg-white dark:bg-neutral-950 border-neutral-300 dark:border-neutral-700"
                          : i === 1
                          ? "bg-blue-50/50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-800"
                          : "bg-purple-50/50 dark:bg-purple-950/30 border-purple-300 dark:border-purple-800"
                      }`}
                    >
                      <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                        {fc.period}
                      </span>
                      <div className="text-3xl font-bold mt-2 text-neutral-900 dark:text-white font-mono">
                        {fc.value}
                      </div>
                      <span className="text-[10px] text-neutral-400 font-mono mt-1 block">
                        {forecastBiomarker.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>

              </div>
            )}

          </div>
        )}

        {/* Global Medical Disclaimer */}
        <p className="mt-16 text-xs text-neutral-500 max-w-xl mx-auto text-center leading-relaxed">
          {language === "hindi" ? (
            <>⚠️ <strong>Medical Disclaimer:</strong> Ye AI tool sirf educational purpose ke liye hai. Koi bhi medical decision lene se pehle doctor se consult karein.</>
          ) : (
            <>⚠️ <strong>Medical & Educational Disclaimer:</strong> MedReport AI provides research and educational insights based on predictive machine learning and clinical literature. It does not provide medical diagnoses. Always consult a licensed healthcare professional.</>
          )}
        </p>

      </main>
    </>
  );
}