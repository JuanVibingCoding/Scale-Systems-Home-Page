import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { CHAT_MODEL, SYSTEM_PROMPT, CHAT_CONFIG, type ChatMessage } from '../src/lib/chat-config';

const BodySchema = z.object({
  message: z.string().min(1).max(2000),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'model']),
        parts: z.array(z.object({ text: z.string() })),
      })
    )
    .max(50)
    .optional(),
});

const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 15;
const ipHits = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipHits.get(ip);
  if (!entry || now > entry.resetAt) {
    ipHits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  entry.count++;
  return entry.count <= RATE_MAX;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const ip =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    req.socket.remoteAddress ||
    'unknown';

  if (!rateLimit(ip)) {
    return res.status(429).json({ error: 'Too many requests. Intenta de nuevo en un minuto.' });
  }

  const parsed = BodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Solicitud inválida.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY no configurada en el servidor.');
    return res.status(500).json({ error: 'El servicio no está disponible en este momento.' });
  }

  const history: ChatMessage[] = parsed.data.history ?? [];
  const contents: ChatMessage[] = [
    ...history,
    { role: 'user', parts: [{ text: parsed.data.message }] },
  ];

  try {
    const client = new GoogleGenAI({ apiKey });
    const response = await client.models.generateContent({
      model: CHAT_MODEL,
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        ...CHAT_CONFIG,
      },
    });

    const reply =
      response.text ?? 'Lo siento, no pude procesar tu mensaje. Intenta de nuevo.';

    return res.status(200).json({ reply, history: contents });
  } catch (error) {
    console.error('Error llamando a Gemini:', error);
    return res
      .status(502)
      .json({ error: 'El asistente no está disponible. Intenta de nuevo en un momento.' });
  }
}
