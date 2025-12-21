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

export default function YoutubeSummarizer() {
  const [url, setUrl] = useState("");
  const [language, setLanguage] = useState("en");
  const [summary, setSummary] = useState("");
  const [videoId, setVideoId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (!url.trim()) {
      toast.error("Enter a YouTube URL");
      return;
    }

    setLoading(true);
    setSummary("");
    setVideoId("");

    try {
      const response = await axios.post("/api/summarize/youtube", { url, language });
      setSummary(response.data.summary);
      setVideoId(response.data.videoId);
      saveToHistory({
        type: "youtube",
        content: url,
        summary: response.data.summary,
        language,
        timestamp: new Date().toISOString(),
        videoId: response.data.videoId,
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
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `youtube-transcript-${Date.now()}.txt`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-medium text-[rgb(var(--muted-foreground))] uppercase tracking-wider mb-2">
          YouTube URL
        </label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
          className="w-full p-4 bg-[rgb(var(--muted))] rounded-lg placeholder:text-[rgb(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--foreground))]"
          onKeyDown={(e) => { if (e.key === "Enter") handleSummarize(); }}
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
          disabled={loading || !url.trim()}
          className="ml-auto px-4 py-2 bg-[rgb(var(--foreground))] text-[rgb(var(--background))] rounded-lg text-sm font-medium disabled:opacity-40 hover:opacity-80 flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Getting transcript...</span>
            </>
          ) : (
            <>
              <span>Get Transcript</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {summary && (
        <div className="pt-6 border-t border-[rgb(var(--border))]">
          {videoId && (
            <div className="mb-4 rounded-lg overflow-hidden bg-[rgb(var(--muted))]">
              <img
                src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                alt="Thumbnail"
                className="w-full h-48 object-cover"
                onError={(e) => { e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`; }}
              />
            </div>
          )}
          
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-medium text-[rgb(var(--muted-foreground))] uppercase tracking-wider">
              Transcript
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
          <div className="p-4 bg-[rgb(var(--muted))] rounded-lg max-h-96 overflow-y-auto">
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{summary}</p>
          </div>
        </div>
      )}
    </div>
  );
}
