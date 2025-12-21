"use client";

import { useEffect, useState } from "react";
import { X, Trash2, FileText, Youtube, Globe, Download } from "lucide-react";
import { getHistory, clearHistory, type HistoryItem } from "@/lib/history";
import toast from "react-hot-toast";

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HistoryPanel({ isOpen, onClose }: HistoryPanelProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    if (isOpen) {
      setHistory(getHistory());
    }
  }, [isOpen]);

  const handleClearHistory = () => {
    if (confirm("Clear all history?")) {
      clearHistory();
      setHistory([]);
      toast.success("Cleared");
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "text": return <FileText className="w-3 h-3" />;
      case "youtube": return <Youtube className="w-3 h-3" />;
      case "webpage": return <Globe className="w-3 h-3" />;
      default: return <FileText className="w-3 h-3" />;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/20 z-40"
      />

      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-[rgb(var(--background))] shadow-xl z-50 flex flex-col border-l border-[rgb(var(--border))]">
        <div className="p-4 border-b border-[rgb(var(--border))] flex items-center justify-between">
          <span className="text-sm font-medium">History</span>
          <div className="flex gap-1">
            {history.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="p-1.5 hover:bg-[rgb(var(--muted))] rounded-md text-[rgb(var(--muted-foreground))] hover:text-red-500"
                title="Clear all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-[rgb(var(--muted))] rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <p className="text-sm text-[rgb(var(--muted-foreground))] text-center py-12">
              No history yet
            </p>
          ) : (
            history.map((item, index) => (
              <div
                key={index}
                className="p-3 bg-[rgb(var(--muted))] rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs text-[rgb(var(--muted-foreground))]">
                    {getIcon(item.type)}
                    <span className="capitalize">{item.type}</span>
                  </div>
                  <button
                    onClick={() => {
                      const content = `${item.content}\n\n${item.summary}`;
                      const blob = new Blob([content], { type: "text/plain" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `summary-${item.timestamp}.txt`;
                      a.click();
                    }}
                    className="p-1 hover:bg-[rgb(var(--background))] rounded"
                    title="Download"
                  >
                    <Download className="w-3 h-3" />
                  </button>
                </div>

                <p className="text-xs text-[rgb(var(--muted-foreground))] mb-2 truncate">
                  {item.content}
                </p>

                <p className="text-xs line-clamp-2">
                  {item.summary}
                </p>

                <div className="flex items-center justify-between mt-2 text-[10px] text-[rgb(var(--muted-foreground))]">
                  <span>{item.language.toUpperCase()}</span>
                  <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
