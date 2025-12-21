import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    const { url, language } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
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
    let pageContent;
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 10000,
      });

      const $ = cheerio.load(response.data);

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

      if (!pageContent || pageContent.length < 100) {
        return NextResponse.json(
          { error: "Could not extract meaningful content from the webpage" },
          { status: 400 }
        );
      }

    } catch (error: any) {
      return NextResponse.json(
        { error: "Could not fetch webpage content. The website may be blocking requests." },
        { status: 404 }
      );
    }

    // Return content as summary
    return NextResponse.json({ 
      summary: pageContent,
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
