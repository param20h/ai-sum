"use client";

import { Moon, Sun, Clock, X } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface NavigationProps {
  activeTab: "text" | "youtube" | "webpage";
  setActiveTab: (tab: "text" | "youtube" | "webpage") => void;
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
}

export default function Navigation({ activeTab, setActiveTab, showHistory, setShowHistory }: NavigationProps) {
  const { theme, toggleTheme } = useTheme();

  const tabs = [
    { id: "text" as const, label: "Text" },
    { id: "youtube" as const, label: "YouTube" },
    { id: "webpage" as const, label: "Webpage" },
  ];

  return (
    <nav className="border-b border-[rgb(var(--border))]">
      <div className="max-w-3xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold tracking-tight">
            summarize
          </h1>

          <div className="flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? "bg-[rgb(var(--foreground))] text-[rgb(var(--background))]"
                    : "text-[rgb(var(--muted-foreground))] hover:text-[rgb(var(--foreground))]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`p-2 rounded-md transition-colors ${
                showHistory 
                  ? "bg-[rgb(var(--foreground))] text-[rgb(var(--background))]" 
                  : "hover:bg-[rgb(var(--muted))]"
              }`}
              aria-label="History"
            >
              {showHistory ? <X className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-[rgb(var(--muted))] transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
