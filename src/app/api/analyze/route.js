import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { reportText, language, reportType } = await request.json();

    if (!reportText || reportText.trim() === "") {
      return NextResponse.json(
        { error: "Report text is required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

    const prompt = `Respond in ${language === "hindi" ? "Hindi (Devanagari script)" : "English"} language.
    This is a ${reportType} type medical report.

    Tum ek medical report explainer ho. User ne ye lab report values di hain:



${reportText}

Har value ke liye:
1. Value normal range mein hai ya nahi batao
2. Simple, non-medical language mein explain karo
3. Status batao: NORMAL, BORDERLINE, ya ATTENTION_NEEDED

End mein ek 2-line overall summary do.

Fir, is report ke basis par 2-3 relevant sawaal suggest karo jo user apne doctor se pooch sakta hai.

IMPORTANT: Sirf valid JSON format mein respond karo, koi extra text nahi. Format:
{
  "results": [
    {
      "testName": "test ka naam",
      "value": "di gayi value",
      "normalRange": "normal range",
      "status": "NORMAL / BORDERLINE / ATTENTION_NEEDED",
      "explanation": "simple explanation"
    }
  ],
  "summary": "overall summary yaha",
  "doctorQuestions": ["sawaal 1", "sawaal 2", "sawaal 3"]
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const cleanedText = responseText.replace(/```json|```/g, "").trim();
    const parsedResult = JSON.parse(cleanedText);

    return NextResponse.json(parsedResult);
  } catch (error) {
    console.error("Error analyzing report:", error);
    return NextResponse.json(
      { error: "Failed to analyze report. Please try again." },
      { status: 500 }
    );
  }
}