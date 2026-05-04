import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  const apiKey = process.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    console.error('No API Key');
    return;
  }

  const client = new GoogleGenAI({ apiKey });
  
  try {
    console.log('Testing generateContent with gemini-1.5-flash...');
    const result = await client.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [{ role: 'user', parts: [{ text: 'Hola' }] }]
    });
    console.log('Result:', JSON.stringify(result, null, 2));
  } catch (e: any) {
    console.error('Error in test:', e.message);
  }
}

test();
