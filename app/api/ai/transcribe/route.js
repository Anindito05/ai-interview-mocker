import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio");

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 },
      );
    }

    const arrayBuffer = await audioFile.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString("base64");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: "Transcribe this audio clearly. If no speech is detected, return an empty string.",
            },
            {
              inlineData: {
                mimeType: "audio/webm",
                data: base64Audio,
              },
            },
          ],
        },
      ],
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    console.log("Transcribed text:", text);

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Transcription error:", error);
    return NextResponse.json(
      { error: "Transcription failed" },
      { status: 500 },
    );
  }
}
