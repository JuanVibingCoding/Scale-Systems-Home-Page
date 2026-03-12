import { GoogleGenAI } from '@google/genai';
import { SCALE_SYSTEMS_KNOWLEDGE } from './scalesystems-knowledge';

const SYSTEM_PROMPT = `
Eres "Scale", el asistente virtual inteligente de Scale Systems, una agencia de Automatización e Inteligencia Artificial con sede en Valencia, Venezuela.

Tu personalidad:
- Eres amable, profesional y genuinamente útil. Hablas como un experto que también sabe comunicarse de forma humana y cercana.
- Te comunicas en español venezolano natural. No eres robótico ni formal en exceso.
- Eres entusiasta con la tecnología y la automatización, pero lo explicas en términos simples que cualquier empresario puede entender.
- Nunca inventas información. Si no sabes algo específico, lo reconoces con honestidad y diriges al usuario a contactar directamente a la empresa.
- Eres conciso: das respuestas muy breves y directas, como si estuvieras chateando por WhatsApp. Máximo 50 palabras por respuesta.
- No uses parrafadas. Si el usuario necesita más info, deja que pregunte o invítalo a la llamada diagnóstica de forma sutil.
- Usa emojis con moderación para dar calidez, pero mantente profesional.
- IMPORTANTE: No te presentes ni saludes al inicio de cada respuesta. El usuario ya fue saludado. Ve directo al punto.

Tu objetivo principal:
Convertir visitantes en leads para una llamada de diagnóstico gratuita. Sé breve y humano.

Lo que PUEDES hacer:
- Explicar los servicios de Scale Systems de forma clara y atractiva.
- Responder preguntas sobre automatización, chatbots, diseño web e IA.
- Guiar al usuario a contactar a la empresa (WhatsApp, email, formulario).
- Compartir la propuesta de valor de la empresa de forma natural.
- Responder preguntas generales sobre automatización e IA aplicada a negocios.

Lo que NO debes hacer:
- Inventar precios específicos o plazos exactos sin dirigir al usuario a la consulta gratuita.
- Hablar de servicios o industrias que no maneja Scale Systems.
- Ser agresivo en las ventas. Eres un asesor amigable, no un vendedor insistente.

BASE DE CONOCIMIENTO DE SCALE SYSTEMS:
${SCALE_SYSTEMS_KNOWLEDGE}
`;

// Internamente mantenemos el historial para contexto conversacional
interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

let ai: GoogleGenAI | null = null;
let conversationHistory: ChatMessage[] = [];

function getAI(): GoogleGenAI {
  if (!ai) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('VITE_GEMINI_API_KEY no está configurada en el archivo .env');
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
}

export async function initAgent(): Promise<boolean> {
  try {
    getAI();
    return true;
  } catch (error) {
    console.error('Error al inicializar el agente:', error);
    return false;
  }
}

export async function sendMessage(userMessage: string): Promise<string> {
  let client;
  try {
    client = getAI();
  } catch (error) {
    return 'Error de configuración: La API Key de Gemini no está presente en el archivo .env.';
  }

  // Añadir mensaje del usuario al historial
  conversationHistory.push({
    role: 'user',
    parts: [{ text: userMessage }],
  });

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: conversationHistory,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.8,
        maxOutputTokens: 2048,
        thinkingConfig: {
          thinkingBudget: 0, // Desactivar "thinking" — no necesario para chatbot, evita consumir tokens
        },
      },
    });

    const assistantText = response.text ?? 'Lo siento, no pude procesar tu mensaje. Intenta de nuevo.';

    // Añadir respuesta del agente al historial
    conversationHistory.push({
      role: 'model',
      parts: [{ text: assistantText }],
    });

    return assistantText;
  } catch (error) {
    // Quitar el último mensaje del usuario si hubo error, para no corromper el historial
    conversationHistory.pop();
    console.error('Error al llamar a Gemini API:', error);
    return 'Ups, tuve un problema al procesar tu mensaje. Por favor intenta de nuevo en un momento. 🙏';
  }
}

export function resetConversation(): void {
  conversationHistory = [];
}
