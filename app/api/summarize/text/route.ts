import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const { text, language } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text is required and must be a string" },
        { status: 400 }
      );
    }

    // If API key is present, use Google Gemini AI
    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
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
      } catch (geminiError: any) {
        console.warn("Gemini API error, falling back to extractive summary:", geminiError);
        // Fallback gracefully if API error occurs
        const fallback = generateExtractiveSummary(text);
        return NextResponse.json({
          summary: fallback,
          success: true,
        });
      }
    }

    // Normal working fallback when API key is not yet configured in environment
    const summary = generateExtractiveSummary(text);
    return NextResponse.json({ 
      summary,
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

function generateExtractiveSummary(text: string): string {
  const sentences = text
    .split(/(?<=[.?!])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);

  if (sentences.length === 0) {
    return text.trim();
  }

  if (sentences.length <= 3) {
    return sentences.map((s) => `• ${s}`).join("\n\n");
  }

  const selected = [
    sentences[0],
    sentences[Math.floor(sentences.length / 2)],
    sentences[sentences.length - 1],
  ];

  return [
    "Key Takeaways:",
    ...selected.map((s) => `• ${s}`),
  ].join("\n\n");
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
