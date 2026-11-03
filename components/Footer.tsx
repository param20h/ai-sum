import { Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[rgb(var(--border))] py-4">
      <div className="max-w-3xl mx-auto px-6 flex items-center justify-between text-xs text-[rgb(var(--muted-foreground))]">
        <p>Built with Gemini AI</p>
        <a
          href="https://github.com/param20h/ai-sum"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-[rgb(var(--foreground))] transition-colors"
          aria-label="GitHub Repository"
        >
          <Github className="w-4 h-4" />
          <span>GitHub</span>
        </a>
      </div>
    </footer>
  );
}
