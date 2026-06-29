import {NextRequest, NextResponse} from 'next/server';
import {GoogleGenAI} from '@google/genai';
import {SCALE_SYSTEMS_KNOWLEDGE} from '@/lib/scalesystems-knowledge';

const genAI = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

const SYSTEM_PROMPT = `Eres "Scale", el asistente virtual de Scale Systems, una agencia de automatización e inteligencia artificial ubicada en Valencia, Venezuela.

Tu personalidad:
- Eres amable, profesional y genuinamente útil.
- Hablas en español venezolano natural.
- Eres conciso: máximo 50 palabras por respuesta.
- Usa emojis con moderación.
- No te presentes ni saludes al inicio de cada respuesta. Ve directo al punto.

Tu objetivo principal:
Convertir visitantes en leads para una llamada de diagnóstico gratuita.

INFORMACIÓN DE LA EMPRESA:
${SCALE_SYSTEMS_KNOWLEDGE}`;

interface HistoryMessage {
  role: string;
  text: string;
}

export async function POST(request: NextRequest) {
  try {
    const {message, history = []} = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        {error: 'Message is required'},
        {status: 400}
      );
    }

    const contents = history.map((msg: HistoryMessage) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{text: msg.text}],
    }));

    contents.push({role: 'user', parts: [{text: message}]});

    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.8,
        maxOutputTokens: 2048,
        thinkingConfig: {thinkingBudget: 0},
      },
    });

    const reply = response.text ?? 'No pude generar una respuesta.';

    return NextResponse.json({reply});
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      {error: 'Internal server error'},
      {status: 500}
    );
  }
}
