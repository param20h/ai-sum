// --- Tab Switching Logic ---
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = {
  text: document.getElementById('textTab'),
  youtube: document.getElementById('youtubeTab'),
  webpage: document.getElementById('webpageTab')
};
tabBtns.forEach(btn => {
  btn.onclick = function () {
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    Object.entries(tabContents).forEach(([id, el]) => {
      el.style.display = btn.dataset.tab === id ? 'block' : 'none';
    });
  };
});

// --- Toast/Feedback (Clipboard) ---
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1500);
}

// --- Confetti/Check-mark animation ---
function celebrate({confettiEl, checkMarkEl}) {
  if(confettiEl) {
    confettiEl.innerHTML = '🎉';
    confettiEl.style.display = 'block';
    setTimeout(()=>{ confettiEl.style.display = 'none'; }, 1300);
  }
  if(checkMarkEl) {
    checkMarkEl.style.display = 'inline-block';
    setTimeout(()=>{ checkMarkEl.style.display = 'none'; }, 1000);
  }
}

// --- AI APIs ---
const GEMINI_API_KEY = 'AIzaSyB0zTkA84M5z39n0rLjq2upvXAkZj2DzVM';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

async function summarizeGemini(text, lang) {
  let prompt;
  if (lang && lang !== 'en') {
    prompt = `Summarize the following text in a clear and concise way, and then translate the summary into ${getLangStr(lang)}:\n\n${text}`;
  } else {
    prompt = `Summarize the following text in a clear and concise way:\n\n${text}`;
  }
  const payload = {
    contents: [
      {
        parts: [
          { text: prompt }
        ]
      }
    ]
  };
  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error('API Error: ' + response.statusText);
  const data = await response.json();
  return (data.candidates?.[0]?.content?.parts?.[0]?.text || 'No summary returned.').trim();
}

async function translateGemini(text, lang) {
  // Only used for translating existing string (just call Gemini for demonstration)
  if(!text || lang === 'en') return text;
  const prompt = `Translate the following text to ${getLangStr(lang)} only (keep summary style):\n${text}`;
  const payload = { contents: [ { parts: [ { text: prompt } ] } ] };
  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error('API Error: ' + response.statusText);
  const data = await response.json();
  return (data.candidates?.[0]?.content?.parts?.[0]?.text || text).trim();
}

function getLangStr(lang) {
  return {
    'en': 'English', 'es': 'Spanish', 'fr': 'French', 'de': 'German', 'hi': 'Hindi', 'zh': 'Chinese'
  }[lang] || 'English';
}

// --- Helper: Reset reactions ---
function resetReactions(feedbackRoot) {
  if (feedbackRoot) {
    feedbackRoot.querySelectorAll('.feedback-btn').forEach(b => b.classList.remove('active'));
  }
}

function handleFeedback(feedbackRoot) {
  if (feedbackRoot) {
    feedbackRoot.querySelectorAll('.feedback-btn').forEach(b => {
      b.onclick = function() {
        resetReactions(feedbackRoot);
        b.classList.add('active');
        showToast({up:'Glad it helped!', down:'We’ll improve!', love:'❤️ Thank you!'}[b.dataset.type] || 'Thanks for your feedback!')
      }
    })
  }
}

// --- Text Summarizer ---
const input = document.getElementById('inputText');
const btn = document.getElementById('summarizeBtn');
const summaryDiv = document.getElementById('summary');
const loading = document.getElementById('loading');
const copyBtn = document.getElementById('copySummary');
const confetti = document.getElementById('confetti');
const checkMark = document.getElementById('checkMark');
const langSelect = document.getElementById('langSelect');
const feedbackText = document.getElementById('feedbackText');

globalThis.handleTextFeedback = () => handleFeedback(feedbackText);

btn.onclick = async function() {
  const text = input.value.trim();
  const lang = langSelect.value;
  if (!text) return;
  summaryDiv.textContent = '';
  loading.style.display = 'flex';
  btn.disabled = true;
  copyBtn.style.display = 'none';
  try {
    const output = await summarizeGemini(text, lang);
    summaryDiv.textContent = output;
    celebrate({confettiEl: confetti, checkMarkEl: checkMark});
    copyBtn.style.display = 'block';
    resetReactions(feedbackText);
    setTimeout(globalThis.handleTextFeedback, 250);
  } catch (err) {
    summaryDiv.textContent = 'Error: ' + (err.message || 'Request failed');
  } finally {
    loading.style.display = 'none';
    btn.disabled = false;
  }
};
input.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && (e.metaKey||e.ctrlKey)) btn.click();
});
copyBtn.onclick = function() {
  if (!summaryDiv.textContent) return;
  navigator.clipboard.writeText(summaryDiv.textContent);
  showToast('Copied summary!');
};
copyBtn.style.display = 'none';
handleFeedback(feedbackText);

// --- YouTube Video Summarizer (Mock logic, translation supported) ---
const ytInput = document.getElementById('youtubeUrl');
const ytBtn = document.getElementById('ytSummarizeBtn');
const ytSummaryDiv = document.getElementById('ytSummary');
const ytLoading = document.getElementById('ytLoading');
const ytCopyBtn = document.getElementById('copyYtSummary');
const ytConfetti = document.getElementById('ytConfetti');
const ytCheckMark = document.getElementById('ytCheckMark');
const ytLangSelect = document.getElementById('ytLangSelect');
const feedbackYt = document.getElementById('feedbackYt');

globalThis.handleYtFeedback = () => handleFeedback(feedbackYt);
ytBtn.onclick = async function() {
  const url = ytInput.value.trim();
  const lang = ytLangSelect.value;
  ytSummaryDiv.textContent = '';
  ytLoading.style.display = 'flex';
  ytBtn.disabled = true;
  ytCopyBtn.style.display = 'none';
  try {
    await new Promise(res => setTimeout(res, 1100 + Math.random()*700));
    if (!url || (!url.startsWith('https://www.youtube.com/') && !url.startsWith('https://youtu.be/') && !url.includes('youtube.com')) ) {
      ytSummaryDiv.textContent = 'Please provide a valid YouTube video URL.';
    } else {
      let msg = "Key highlights: main idea, interesting facts, and the final conclusion! (AI YouTube summary feature coming soon!)";
      if (lang !== 'en') {
        msg = await translateGemini(msg, lang);
      }
      ytSummaryDiv.textContent = msg;
      celebrate({confettiEl: ytConfetti, checkMarkEl: ytCheckMark});
      ytCopyBtn.style.display = 'block';
      resetReactions(feedbackYt);
      setTimeout(globalThis.handleYtFeedback, 250);
    }
  } finally {
    ytLoading.style.display = 'none';
    ytBtn.disabled = false;
  }
};
ytInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') ytBtn.click();
});
ytCopyBtn.onclick = function() {
  if (!ytSummaryDiv.textContent) return;
  navigator.clipboard.writeText(ytSummaryDiv.textContent);
  showToast('Copied summary!');
};
ytCopyBtn.style.display = 'none';
handleFeedback(feedbackYt);

// --- Webpage Summarizer (Simple Mock) ---
const webInput = document.getElementById('webUrl');
const webBtn = document.getElementById('webSummarizeBtn');
const webSummaryDiv = document.getElementById('webSummary');
const webLoading = document.getElementById('webLoading');
const webCopyBtn = document.getElementById('copyWebSummary');
const webConfetti = document.getElementById('webConfetti');
const webCheckMark = document.getElementById('webCheckMark');
const webLangSelect = document.getElementById('webLangSelect');
const feedbackWeb = document.getElementById('feedbackWeb');

globalThis.handleWebFeedback = () => handleFeedback(feedbackWeb);
webBtn.onclick = async function() {
  const url = webInput.value.trim();
  const lang = webLangSelect.value;
  webSummaryDiv.textContent = '';
  webLoading.style.display = 'flex';
  webBtn.disabled = true;
  webCopyBtn.style.display = 'none';
  try {
    await new Promise(res => setTimeout(res, 1200 + Math.random()*700));
    let summary = '';
    if (!url || !/^https?:\/\//.test(url)) {
      summary = 'Please provide a valid web URL.';
    } else {
      summary = `This webpage discusses main ideas, provides supporting details, and concludes with actionable insights. (AI webpage summary feature coming soon!)`;
      if (lang !== 'en') {
        summary = await translateGemini(summary, lang);
      }
    }
    webSummaryDiv.textContent = summary;
    if (/valid web URL\./.test(summary)) return;
    celebrate({confettiEl: webConfetti, checkMarkEl: webCheckMark});
    webCopyBtn.style.display = 'block';
    resetReactions(feedbackWeb);
    setTimeout(globalThis.handleWebFeedback, 250);
  } finally {
    webLoading.style.display = 'none';
    webBtn.disabled = false;
  }
};
webInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') webBtn.click();
});
webCopyBtn.onclick = function() {
  if (!webSummaryDiv.textContent) return;
  navigator.clipboard.writeText(webSummaryDiv.textContent);
  showToast('Copied summary!');
};
webCopyBtn.style.display = 'none';
handleFeedback(feedbackWeb);

// Initially hide all loading, confetti, checkmark buttons
[loading, ytLoading, webLoading].forEach(el => (el.style.display = 'none'));
[confetti, checkMark, ytConfetti, ytCheckMark, webConfetti, webCheckMark].forEach(el => (el.style.display = 'none'));
