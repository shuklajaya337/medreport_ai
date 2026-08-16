"use client";

import { useState } from "react";
import { MouseGlow } from "@/components/ui/mouse-glow";
import { GlowOrb } from "@/components/ui/glow-orb";

export default function ReportPage() {
  const [reportText, setReportText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState("english");
  const [reportType, setReportType] = useState("General");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const placeholderText = "Type or paste your report values here...";

  const sampleReports = {
    General: "Hemoglobin: 10.2 g/dL, WBC: 8000/µL",
    CBC: "Hemoglobin: 10.2 g/dL, WBC: 8000/µL, Platelets: 250000/µL, RBC: 4.5 million/µL",
    Thyroid: "TSH: 3.5 mIU/L, T3: 120 ng/dL, T4: 8.5 µg/dL",
    "Lipid Profile": "Total Cholesterol: 190 mg/dL, HDL: 45 mg/dL, LDL: 120 mg/dL, Triglycerides: 150 mg/dL",
    "Blood Sugar": "Fasting Glucose: 95 mg/dL, HbA1c: 5.5%, Postprandial Glucose: 130 mg/dL",
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUseSample = () => {
    setReportText(sampleReports[reportType]);
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
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MouseGlow />
      <GlowOrb />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-white/70 dark:bg-black/70 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
        <span className="font-bold text-lg text-black dark:text-white">
          MedReport<span className="text-blue-600">AI</span>
        </span>
      </nav>

      <section
        className="min-h-screen flex flex-col items-center justify-center px-4 py-24 bg-white dark:bg-black"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Paste Your Report
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-8 text-center max-w-xl">
          Paste your lab report values below (e.g., Hemoglobin: 10.2, WBC: 8000)
        </p>

        {/* Report Type Selector */}
        <div className="mb-4 w-full max-w-2xl">
          <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
            Report Type
          </label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="General">General / Other</option>
            <option value="CBC">CBC (Complete Blood Count)</option>
            <option value="Thyroid">Thyroid (TSH, T3, T4)</option>
            <option value="Lipid Profile">Lipid Profile</option>
            <option value="Blood Sugar">Blood Sugar</option>
          </select>
        </div>

        {/* Language Selector */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setLanguage("english")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              language === "english"
                ? "bg-blue-600 text-white"
                : "bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white"
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage("hindi")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              language === "hindi"
                ? "bg-blue-600 text-white"
                : "bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white"
            }`}
          >
            हिंदी
          </button>
        </div>

        <textarea
          value={reportText}
          onChange={(e) => setReportText(e.target.value)}
          className="w-full max-w-2xl h-48 p-4 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={placeholderText}
        />
        <button
          onClick={handleUseSample}
          className="mt-2 text-sm text-blue-500 hover:text-blue-600 underline self-start"
        >
          Try a sample {reportType} report
        </button>

        {/* OR Divider */}
        <div className="flex items-center gap-3 w-full max-w-2xl my-4">
          <div className="flex-1 h-px bg-neutral-300 dark:bg-neutral-700"></div>
          <span className="text-sm text-neutral-500">OR</span>
          <div className="flex-1 h-px bg-neutral-300 dark:bg-neutral-700"></div>
        </div>

        {/* Image Upload */}
        <div className="w-full max-w-2xl">
          <label
            htmlFor="report-image"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg cursor-pointer bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Report preview"
                className="h-28 object-contain rounded"
              />
            ) : (
              <span className="text-sm text-neutral-500">
                📷 Click to upload report photo
              </span>
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

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="mt-6 bg-blue-600 text-white rounded-full px-8 py-3 font-medium hover:bg-blue-700 transition-colors disabled:opacity-70 flex items-center gap-2"
        >
          {loading && (
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
          )}
          {loading ? "Analyzing..." : "Analyze Report"}
        </button>

        {error && <p className="mt-4 text-red-500 font-medium">{error}</p>}

        {/* Results */}
        {result && (
          <div className="w-full max-w-2xl mt-10 flex flex-col gap-4">
            <div className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 shadow-sm hover:shadow-md transition-shadow duration-300">
              <p className="font-medium leading-relaxed">{result.summary}</p>
            </div>

            {result.results?.map((item, index) => {
              const statusColor =
                item.status === "NORMAL"
                  ? "bg-green-50 dark:bg-green-950 border-green-300 dark:border-green-700"
                  : item.status === "BORDERLINE"
                  ? "bg-yellow-50 dark:bg-yellow-950 border-yellow-300 dark:border-yellow-700"
                  : "bg-red-50 dark:bg-red-950 border-red-300 dark:border-red-700";

              return (
                <div
                  key={index}
                  className={`p-6 rounded-2xl border ${statusColor} shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-lg">{item.testName}</h3>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/60 dark:bg-black/30">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-sm mb-2 text-neutral-700 dark:text-neutral-300">
                    Value: <span className="font-medium">{item.value}</span> (Normal: {item.normalRange})
                  </p>
                  <p className="text-sm leading-relaxed">{item.explanation}</p>
                </div>
              );
            })}
          </div>
        )}

        {result?.doctorQuestions && result.doctorQuestions.length > 0 && (
          <div className="p-6 rounded-2xl bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 shadow-sm hover:shadow-md transition-shadow duration-300">
            <h3 className="font-bold text-lg mb-3">🩺 Ask Your Doctor</h3>
            <ul className="list-disc list-inside space-y-2">
              {result.doctorQuestions.map((question, index) => (
                <li key={index} className="text-sm">
                  {question}
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="mt-8 text-xs text-neutral-500 max-w-xl text-center">
          ⚠️ Ye AI tool sirf educational purpose ke liye hai. Koi bhi medical decision lene se pehle doctor se consult karein.
        </p>
      </section>
    </>
  );
}