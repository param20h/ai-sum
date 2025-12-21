# AI Summarizer Pro

<div align="center">

![AI Summarizer Pro](https://img.shields.io/badge/AI-Summarizer%20Pro-blue?style=for-the-badge&logo=robot)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

**Transform lengthy content into concise, AI-powered summaries in seconds**

[Live Demo](https://ai-sum-two.vercel.app/) · [Report Bug](https://github.com/param20h/ai-sum/issues) · [Request Feature](https://github.com/param20h/ai-sum/issues)

</div>

---

## 🌟 Features

### 📝 **Text Summarization**
- Summarize articles, essays, documents, and any text content
- Support for 12+ languages with automatic translation
- Smart AI analysis for key points extraction
- Real-time processing with beautiful loading animations

### 🎥 **YouTube Video Summarization**
- Automatic transcript fetching from YouTube videos
- Comprehensive summaries with main topics and key takeaways
- Video thumbnail preview
- Support for videos with available captions

### 🌐 **Webpage Summarization**
- Extract and summarize content from any website
- Intelligent content extraction (removes ads, navigation, etc.)
- Direct links to original sources
- Works with blogs, news articles, documentation, and more

### ⚡ **Advanced Features**
- 🎨 **Beautiful UI** with glassmorphism design and smooth animations
- 🌓 **Dark Mode** with system preference detection
- 📜 **History Tracking** - Save and review past summaries
- 📥 **Export Options** - Download summaries as text files
- 🔒 **Secure API** - API keys protected on server-side
- 💬 **Feedback System** - Rate summaries and help improve the service
- 📱 **Fully Responsive** - Works perfectly on all devices

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/param20h/ai-sum.git
cd ai-sum
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Copy the example env file
cp .env.example .env.local

# Edit .env.local and add your Gemini API key
GEMINI_API_KEY=your_actual_api_key_here
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework with App Router |
| **TypeScript** | Type-safe code |
| **Tailwind CSS** | Utility-first styling |
| **Framer Motion** | Smooth animations |
| **Google Gemini AI** | AI-powered summarization |
| **Axios** | HTTP requests |
| **Cheerio** | Web scraping |
| **YouTube Transcript** | Video transcript extraction |
| **Lucide React** | Beautiful icons |

---

## 📁 Project Structure

```
ai-sum/
├── app/
│   ├── api/
│   │   └── summarize/
│   │       ├── text/route.ts       # Text summarization API
│   │       ├── youtube/route.ts    # YouTube summarization API
│   │       └── webpage/route.ts    # Webpage summarization API
│   ├── globals.css                 # Global styles
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Home page
├── components/
│   ├── Navigation.tsx              # Navigation bar
│   ├── TextSummarizer.tsx          # Text summarization UI
│   ├── YoutubeSummarizer.tsx       # YouTube summarization UI
│   ├── WebpageSummarizer.tsx       # Webpage summarization UI
│   ├── HistoryPanel.tsx            # History sidebar
│   ├── Footer.tsx                  # Footer component
│   └── ThemeProvider.tsx           # Theme management
├── lib/
│   └── history.ts                  # History management utilities
├── backup_old/                     # Original HTML/CSS/JS files
├── .env.local                      # Environment variables (create this)
├── .env.example                    # Environment variables template
├── next.config.ts                  # Next.js configuration
├── tailwind.config.ts              # Tailwind configuration
├── tsconfig.json                   # TypeScript configuration
└── package.json                    # Dependencies
```

---

## 🔐 Security Features

- ✅ API keys stored securely on the server
- ✅ Never exposed to client-side code
- ✅ Environment variables for sensitive data
- ✅ Server-side API routes for all AI operations
- ✅ Input validation and error handling
- ✅ CORS protection

---

## 🌍 Deployment

### Deploy to Vercel (Recommended)

1. **Push your code to GitHub**

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Add Environment Variables**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add `GEMINI_API_KEY` with your API key

4. **Deploy**
   - Vercel will automatically build and deploy your app
   - You'll get a live URL instantly

### Deploy to Netlify

1. **Build the project**
```bash
npm run build
```

2. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

3. **Deploy**
```bash
netlify deploy --prod
```

4. **Add Environment Variables**
   - Go to Netlify dashboard → Site settings → Environment variables
   - Add `GEMINI_API_KEY`

---

## 📖 Usage Guide

### Text Summarization
1. Navigate to the "Text" tab
2. Paste or type your content
3. Select output language (optional)
4. Click "Summarize" or press Ctrl+Enter
5. Copy or download the summary

### YouTube Video Summarization
1. Navigate to the "YouTube" tab
2. Paste a YouTube video URL
3. Select output language (optional)
4. Click "Summarize Video"
5. View summary with video thumbnail

### Webpage Summarization
1. Navigate to the "Webpage" tab
2. Paste any website URL
3. Select output language (optional)
4. Click "Summarize Webpage"
5. Read the extracted summary

### View History
- Click the History icon in the navigation bar
- View all past summaries
- Download individual summaries
- Clear history when needed

---

## 🎨 Customization

### Change Theme Colors
Edit `tailwind.config.ts`:
```typescript
extend: {
  colors: {
    // Add your custom colors
  }
}
```

### Modify AI Prompts
Edit API routes in `app/api/summarize/*/route.ts`:
```typescript
const prompt = `Your custom prompt here...`;
```

### Add More Languages
Edit language arrays in components:
```typescript
const languages = [
  { code: "your_code", name: "Your Language" },
  // ...
];
```

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) for powerful AI capabilities
- [Next.js](https://nextjs.org/) for the amazing framework
- [Vercel](https://vercel.com/) for hosting
- [Lucide](https://lucide.dev/) for beautiful icons
- [Framer Motion](https://www.framer.com/motion/) for smooth animations

---

## 📧 Contact

Have questions or suggestions? Feel free to:
- Open an issue on GitHub
- Submit a pull request
- Star the repository if you find it useful!

---

<div align="center">

**Made with ❤️ using Next.js & Google Gemini AI**

⭐ Star this repo if you find it helpful!

</div>
