"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";
import TextSummarizer from "@/components/TextSummarizer";
import YoutubeSummarizer from "@/components/YoutubeSummarizer";
import WebpageSummarizer from "@/components/WebpageSummarizer";
import HistoryPanel from "@/components/HistoryPanel";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"text" | "youtube" | "webpage">("text");
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        showHistory={showHistory}
        setShowHistory={setShowHistory}
      />
      
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
        {activeTab === "text" && <TextSummarizer />}
        {activeTab === "youtube" && <YoutubeSummarizer />}
        {activeTab === "webpage" && <WebpageSummarizer />}
      </main>

      <Footer />

      <HistoryPanel isOpen={showHistory} onClose={() => setShowHistory(false)} />
      
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 2000,
          style: {
            background: 'rgb(var(--foreground))',
            color: 'rgb(var(--background))',
            borderRadius: '8px',
            padding: '12px 16px',
            fontSize: '14px',
          },
        }}
      />
    </div>
  );
}
