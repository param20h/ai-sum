import { NextRequest, NextResponse } from "next/server";
// @ts-ignore
import { YoutubeTranscript } from "youtube-transcript";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const { url, language } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "YouTube URL is required" },
        { status: 400 }
      );
    }

    // Extract video ID from URL
    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json(
        { error: "Invalid YouTube URL" },
        { status: 400 }
      );
    }

    // Fetch transcript
    let transcript;
    try {
      const transcriptData = await YoutubeTranscript.fetchTranscript(videoId);
      transcript = transcriptData.map((item: any) => item.text).join(" ");
    } catch (error: any) {
      return NextResponse.json(
        { error: "Could not fetch video transcript. The video may not have captions available." },
        { status: 404 }
      );
    }

    let summary = transcript;

    // If Gemini API Key is available, summarize with Gemini
    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        let prompt = "";
        if (language && language !== "en") {
          prompt = `Summarize the following YouTube video transcript clearly and concisely, then translate into ${getLanguageName(language)}:\n\n${transcript}`;
        } else {
          prompt = `Summarize the following YouTube video transcript clearly, concisely, and with key highlights:\n\n${transcript}`;
        }
        const aiRes = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });
        if (aiRes.text) {
          summary = aiRes.text.trim();
        }
      } catch (geminiError) {
        console.warn("Gemini summarization failed, returning full transcript:", geminiError);
      }
    }

    return NextResponse.json({ 
      summary,
      videoId,
      success: true 
    });

  } catch (error: any) {
    console.error("YouTube summarization error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to summarize video" },
      { status: 500 }
    );
  }
}

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
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
