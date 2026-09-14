export async function chatWithGroq(
  messages: { role: string; content: string }[],
  systemPrompt: string
) {
  // Hackathon specific: Storing key in localStorage for instant demo. 
  const API_KEY = localStorage.getItem('GROQ_API_KEY') || 'paste_your_key_here';
  
  const payload = {
    model: "llama3-8b-8192",
    messages: [
      { role: "system", content: systemPrompt },
      ...messages
    ],
    temperature: 0.3, // Low temp for more analytical responses
    max_tokens: 1024,
  };

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Groq API Error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
