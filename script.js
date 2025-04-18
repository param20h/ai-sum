// TODO: Replace 'YOUR_GEMINI_API_KEY' with your Gemini (Google AI) API key
const GEMINI_API_KEY = 'AIzaSyB0zTkA84M5z39n0rLjq2upvXAkZj2DzVM';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;


const input = document.getElementById('inputText');
const btn = document.getElementById('summarizeBtn');
const summaryDiv = document.getElementById('summary');
const loading = document.getElementById('loading');

btn.onclick = async function() {
  const text = input.value.trim();
  if (!text) return;
  summaryDiv.textContent = '';
  loading.style.display = 'flex';
  btn.disabled = true;
  try {
    const prompt = `Summarize the following text in a clear and concise way:\n\n${text}`;
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
    const output = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No summary returned.';
    summaryDiv.textContent = output.trim();
  } catch (err) {
    summaryDiv.textContent = 'Error: ' + (err.message || 'Request failed');
  } finally {
    loading.style.display = 'none';
    btn.disabled = false;
  }
};
