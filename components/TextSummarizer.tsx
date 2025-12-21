"use client";

import { useState } from "react";
import { ArrowRight, Copy, Download, Loader2 } from "lucide-react";
import axios from "axios";
import { saveToHistory } from "@/lib/history";
import toast from "react-hot-toast";

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "hi", name: "Hindi" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "pt", name: "Portuguese" },
];

export default function TextSummarizer() {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("en");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (!text.trim()) {
      toast.error("Enter some text first");
      return;
    }

    setLoading(true);
    setSummary("");

    try {
      const response = await axios.post("/api/summarize/text", { text, language });
      setSummary(response.data.summary);
      saveToHistory({
        type: "text",
        content: text.substring(0, 100) + "...",
        summary: response.data.summary,
        language,
        timestamp: new Date().toISOString(),
      });
      toast.success("Done");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary);
    toast.success("Copied");
  };

  const download = () => {
    const blob = new Blob([summary], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `summary-${Date.now()}.txt`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-medium text-[rgb(var(--muted-foreground))] uppercase tracking-wider mb-2">
          Your text
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your text here..."
          className="w-full h-48 p-4 bg-[rgb(var(--muted))] rounded-lg resize-none placeholder:text-[rgb(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--foreground))]"
        />
      </div>

      <div className="flex items-center gap-3">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="px-3 py-2 bg-[rgb(var(--muted))] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--foreground))] cursor-pointer"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>{lang.name}</option>
          ))}
        </select>

        <button
          onClick={handleSummarize}
          disabled={loading || !text.trim()}
          className="ml-auto px-4 py-2 bg-[rgb(var(--foreground))] text-[rgb(var(--background))] rounded-lg text-sm font-medium disabled:opacity-40 hover:opacity-80 flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>Summarize</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {summary && (
        <div className="pt-6 border-t border-[rgb(var(--border))]">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-medium text-[rgb(var(--muted-foreground))] uppercase tracking-wider">
              Summary
            </label>
            <div className="flex gap-1">
              <button
                onClick={copyToClipboard}
                className="p-1.5 hover:bg-[rgb(var(--muted))] rounded-md transition-colors"
                title="Copy"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={download}
                className="p-1.5 hover:bg-[rgb(var(--muted))] rounded-md transition-colors"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="p-4 bg-[rgb(var(--muted))] rounded-lg">
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{summary}</p>
          </div>
        </div>
      )}
    </div>
  );
}
