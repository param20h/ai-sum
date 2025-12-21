import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function POST(request: NextRequest) {
  try {
    const { text, language } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text is required and must be a string" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    let prompt = "";
    if (language && language !== "en") {
      prompt = `Summarize the following text in a clear and concise way, then translate the summary into ${getLanguageName(language)}. Provide only the translated summary:\n\n${text}`;
    } else {
      prompt = `Summarize the following text in a clear, concise, and well-structured way. Use bullet points where appropriate:\n\n${text}`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const summaryText = response.text || "";

    return NextResponse.json({ 
      summary: summaryText.trim(),
      success: true 
    });

  } catch (error: any) {
    console.error("Text summarization error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate summary" },
      { status: 500 }
    );
  }
}

function getLanguageName(code: string): string {
  const languages: Record<string, string> = {
    en: "English",
    es: "Spanish",
    fr: "French",
    de: "German",
    hi: "Hindi",
    zh: "Chinese",
    ja: "Japanese",
    ko: "Korean",
    ar: "Arabic",
    pt: "Portuguese",
    ru: "Russian",
    it: "Italian",
  };
  return languages[code] || "English";
}
