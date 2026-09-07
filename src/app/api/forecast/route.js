import { NextResponse } from "next/server";
import { computeLongitudinalForecast } from "@/lib/clinical-models";

export async function POST(request) {
  try {
    const body = await request.json();
    const { biomarker = "HbA1c", history = [] } = body;

    // Try calling Python service
    try {
      const pythonBackendUrl = process.env.PYTHON_BACKEND_URL || "http://127.0.0.1:8000";
      const pyRes = await fetch(`${pythonBackendUrl}/api/forecast-biomarkers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ biomarker, history }),
        signal: AbortSignal.timeout(8000)
      });
      if (pyRes.ok) {
        const pyData = await pyRes.json();
        return NextResponse.json(pyData);
      }
    } catch (e) {
      // fallback to JS model
    }

    const forecast = computeLongitudinalForecast(history, biomarker);
    return NextResponse.json(forecast);
  } catch (error) {
    return NextResponse.json({ error: "Failed to compute forecast" }, { status: 500 });
  }
}
