// TODO: Replace 'YOUR_DEEPSEEK_API_KEY' with your DeepSeek API key
const DEEPSEEK_API_KEY = '11a0f899f58fbc8b0620ef9851ca2a905febd63f35587640608839a6da3c3d0c';
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

const input = document.getElementById('inputText');
const btn = document.getElementById('summarizeBtn');
const summaryDiv = document.getElementById('summary');
const loading = document.getElementById('loading');

btn.onclick = async function() {
  const text = input.value.trim();
  if (!text) return;
  summaryDiv.textContent = '';
  loading.style.display = 'block';
  btn.disabled = true;
  try {
    const sysPrompt = "Summarize the following text in a clear and concise way:";
    const payload = {
      model: "deepseek-chat",
      messages: [
        { role: "system", content: sysPrompt },
        { role: "user", content: text }
      ],
      temperature: 0.3,
      max_tokens: 512
    };
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('API Error: ' + response.statusText);
    const data = await response.json();
    const output = data.choices?.[0]?.message?.content ||
                   'No summary returned.';
    summaryDiv.textContent = output.trim();
  } catch (err) {
    summaryDiv.textContent = 'Error: ' + (err.message || 'Request failed');
  } finally {
    loading.style.display = 'none';
    btn.disabled = false;
  }
};
