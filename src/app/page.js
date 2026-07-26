"use client";

import { useState } from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";

export default function Home() {
  const [reportText, setReportText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState("english");
  const [reportType, setReportType] = useState("General");

  const reportTypes = {
  General: "Paste your report here... (e.g., Hemoglobin: 10.2, WBC: 8000)",
  CBC: "Hemoglobin: 10.2 g/dL, WBC: 8000/µL, Platelets: 250000/µL, RBC: 4.5 million/µL",
  Thyroid: "TSH: 3.5 mIU/L, T3: 120 ng/dL, T4: 8.5 µg/dL",
  "Lipid Profile": "Total Cholesterol: 190 mg/dL, HDL: 45 mg/dL, LDL: 120 mg/dL, Triglycerides: 150 mg/dL",
  "Blood Sugar": "Fasting Glucose: 95 mg/dL, HbA1c: 5.5%, Postprandial Glucose: 130 mg/dL",
};

  const handleAnalyze = async () => {
    if (!reportText.trim()) {
      setError("Please paste your report first");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportText, language, reportType }),
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
      {/* Landing Section */}
      <AuroraBackground>
        <div className="relative flex flex-col gap-6 items-center justify-center px-4 min-h-screen text-center">
          <h1 className="text-4xl md:text-6xl font-bold dark:text-white text-black">
            AI Medical Report Explainer
          </h1>
          <p className="font-light text-base md:text-xl dark:text-neutral-200 text-neutral-700 max-w-xl">
            Apni lab report paste karo, AI usse simple language mein samjhayega — bina confusion ke.
          </p>
          <a href="#report-section">
            <button className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-6 py-3 font-medium hover:scale-105 transition-transform">
              Get Started
            </button>
          </a>
        </div>
      </AuroraBackground>

      {/* Report Input Section */}
      <section
        id="report-section"
        className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-white dark:bg-black"
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
          placeholder={reportTypes[reportType]}
        />

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="mt-6 bg-blue-600 text-white rounded-full px-8 py-3 font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze Report"}
        </button>

        {error && <p className="mt-4 text-red-500 font-medium">{error}</p>}

        {/* Results */}
        {result && (
          <div className="w-full max-w-2xl mt-10 flex flex-col gap-4">
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
              <p className="font-medium">{result.summary}</p>
            </div>

            {result.results?.map((item, index) => {
              const statusColor =
                item.status === "NORMAL"
                  ? "bg-green-50 dark:bg-green-950 border-green-300 dark:border-green-700"
                  : item.status === "BORDERLINE"
                  ? "bg-yellow-50 dark:bg-yellow-950 border-yellow-300 dark:border-yellow-700"
                  : "bg-red-50 dark:bg-red-950 border-red-300 dark:border-red-700";

              return (
                <div key={index} className={`p-4 rounded-lg border ${statusColor}`}>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold">{item.testName}</h3>
                    <span className="text-sm font-medium">{item.status}</span>
                  </div>
                  <p className="text-sm mb-1">
                    Value: {item.value} (Normal: {item.normalRange})
                  </p>
                  <p className="text-sm">{item.explanation}</p>
                </div>
              );
            })}
          </div>
        )}

        {result?.doctorQuestions && result.doctorQuestions.length > 0 && (
              <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800">
                <h3 className="font-bold mb-2">🩺 Ask Your Doctor</h3>
                <ul className="list-disc list-inside space-y-1">
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