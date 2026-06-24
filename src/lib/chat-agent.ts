import type { ChatMessage } from './chat-config';

const ENDPOINT = '/api/chat';

let conversationHistory: ChatMessage[] = [];

export async function initAgent(): Promise<boolean> {
  return true;
}

export async function sendMessage(userMessage: string): Promise<string> {
  const payload = { message: userMessage, history: conversationHistory };

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      const msg = data?.error ?? 'Ups, algo falló. Intenta de nuevo en un momento. 🙏';
      return msg;
    }

    const data = (await res.json()) as { reply: string; history: ChatMessage[] };

    conversationHistory = data.history ?? [
      ...conversationHistory,
      { role: 'user', parts: [{ text: userMessage }] },
      { role: 'model', parts: [{ text: data.reply }] },
    ];

    return data.reply;
  } catch {
    return 'Ups, tuve un problema al procesar tu mensaje. Por favor intenta de nuevo en un momento. 🙏';
  }
}

export function resetConversation(): void {
  conversationHistory = [];
}
