interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

export async function sendMessage(
  userMessage: string,
  history: ChatMessage[] = []
): Promise<string> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      message: userMessage,
      history: history.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        text: msg.text,
      })),
    }),
  });

  if (!response.ok) {
    throw new Error('Chat API request failed');
  }

  const data = await response.json();
  return data.reply;
}
