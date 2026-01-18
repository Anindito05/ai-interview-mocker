import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";

export async function POST(req) {
  try {
    const body = await req.json();
    const { mockId, question, correctAns, userAnswer, userEmail } = body;

    // Validation
    if (!mockId || !question || !userEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = `
      You are an interview evaluator.
      Question: ${question}
      Reference Answer: ${correctAns}
      User Answer: ${userAnswer || "No answer provided"}
      
      Respond ONLY in valid JSON.
      {
        "rating": number (1-10),
        "feedback": "string (3-5 lines)"
      }
    `;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    let rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    rawText = rawText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    let feedbackJSON;
    try {
      feedbackJSON = JSON.parse(rawText);
    } catch {
      feedbackJSON = { rating: 0, feedback: "Evaluation failed." };
    }

    // MATCHING YOUR SCHEMA EXACTLY:
    await db.insert(UserAnswer).values({
      mockIdRef: mockId,
      question: question,
      correctAns: correctAns,
      userAns: userAnswer || "No answer provided", // mapped to userAns
      feedback: feedbackJSON.feedback,
      rating: String(feedbackJSON.rating),
      userEmail: userEmail,
      createdAt: new Date().toLocaleDateString(), // saved as varchar per your schema
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
