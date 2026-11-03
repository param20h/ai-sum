import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import axios from "axios";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const { url, language } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    // Validate URL
    if (!isValidUrl(url)) {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // Fetch webpage content
    let html = "";
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      html = await response.text();
    } catch (fetchErr: any) {
      try {
        const axiosRes = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          },
          timeout: 10000,
        });
        html = axiosRes.data;
      } catch (axiosErr: any) {
        return NextResponse.json(
          { error: "Could not fetch webpage content. The website may be blocking requests or is unreachable." },
          { status: 404 }
        );
      }
    }

    const $ = cheerio.load(html);
    let pageContent = "";

      // Remove script and style tags
      $('script, style, nav, footer, iframe, noscript').remove();

      // Extract main content
      const title = $('title').text() || $('h1').first().text();
      const metaDescription = $('meta[name="description"]').attr('content') || '';
      
      // Try to get main content from common containers
      let mainContent = '';
      const contentSelectors = ['article', 'main', '[role="main"]', '.content', '.post', '.entry-content'];
      
      for (const selector of contentSelectors) {
        const content = $(selector).text();
        if (content && content.length > mainContent.length) {
          mainContent = content;
        }
      }

      // Fallback to body if no main content found
      if (!mainContent) {
        mainContent = $('body').text();
      }

      // Clean and limit content
      pageContent = `Title: ${title}\n\n${metaDescription}\n\n${mainContent}`
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 15000); // Limit to prevent token overflow

      if (!pageContent || pageContent.length < 50) {
        return NextResponse.json(
          { error: "Could not extract meaningful content from the webpage" },
          { status: 400 }
        );
      }

    let summary = "";

    // If Gemini API Key is available, summarize with Gemini (strictly max 20 lines)
    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        let prompt = "";
        if (language && language !== "en") {
          prompt = `Summarize the following webpage content clearly and concisely in a maximum of 20 lines (strictly do not exceed 20 lines). Then translate the summary into ${getLanguageName(language)}. Provide only the translated summary:\n\n${pageContent}`;
        } else {
          prompt = `Summarize the following webpage content clearly, concisely, and in a maximum of 20 lines (strictly do not exceed 20 lines) using bullet points for key takeaways:\n\n${pageContent}`;
        }
        const aiRes = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });
        if (aiRes.text) {
          summary = aiRes.text.trim();
        }
      } catch (geminiError) {
        console.warn("Gemini summarization failed, falling back to extractive summary:", geminiError);
      }
    }

    // Fallback if Gemini is not configured or failed: generate concise summary <= 20 lines
    if (!summary) {
      summary = generateWebpageExtractiveSummary(pageContent, 20);
    }

    // Hard guarantee: clamp to maximum 20 lines
    summary = enforceMaxLines(summary, 20);

    return NextResponse.json({ 
      summary,
      url,
      success: true 
    });

  } catch (error: any) {
    console.error("Webpage summarization error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to summarize webpage" },
      { status: 500 }
    );
  }
}

function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

function enforceMaxLines(text: string, maxLines = 20): string {
  const lines = text.split("\n");
  if (lines.length <= maxLines) {
    return text.trim();
  }
  return lines.slice(0, maxLines).join("\n").trim();
}

function generateWebpageExtractiveSummary(pageContent: string, maxLines = 20): string {
  const sentences = pageContent
    .split(/(?<=[.?!])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);

  if (sentences.length === 0) {
    return enforceMaxLines(pageContent, maxLines);
  }

  // Cap to at most 10 bullet points to stay comfortably under 20 lines with spacing
  const takeCount = Math.min(sentences.length, 10);
  const selected = sentences.slice(0, takeCount);

  const lines = [
    "Key Webpage Highlights:",
    ...selected.map((s) => `• ${s}`),
  ];

  return enforceMaxLines(lines.join("\n\n"), maxLines);
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
