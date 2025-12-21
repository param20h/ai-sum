export interface HistoryItem {
  type: "text" | "youtube" | "webpage";
  content: string;
  summary: string;
  language: string;
  timestamp: string;
  videoId?: string;
}

const HISTORY_KEY = "ai-summarizer-history";
const MAX_HISTORY_ITEMS = 50;

export function saveToHistory(item: HistoryItem): void {
  if (typeof window === "undefined") return;
  
  try {
    const history = getHistory();
    history.unshift(item);
    
    // Keep only the last MAX_HISTORY_ITEMS
    const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS);
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error("Failed to save to history:", error);
  }
}

export function getHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  
  try {
    const history = localStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error("Failed to get history:", error);
    return [];
  }
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error("Failed to clear history:", error);
  }
}

export function deleteHistoryItem(timestamp: string): void {
  if (typeof window === "undefined") return;
  
  try {
    const history = getHistory();
    const filtered = history.filter(item => item.timestamp !== timestamp);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Failed to delete history item:", error);
  }
}
