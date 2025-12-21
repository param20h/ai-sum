import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Summarizer Pro - Summarize Text, Videos & Webpages",
  description: "Transform lengthy content into concise summaries using Google Gemini AI. Summarize text, YouTube videos, and webpages instantly with multiple language support.",
  keywords: ["AI", "Summarizer", "Gemini", "Text Summary", "YouTube", "Webpage", "Content Analysis"],
  authors: [{ name: "AI Summarizer Team" }],
  openGraph: {
    title: "AI Summarizer Pro",
    description: "Transform lengthy content into concise summaries using AI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
