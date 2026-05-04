import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  const apiKey = process.env.VITE_GEMINI_API_KEY;
  const client = new GoogleGenAI({ apiKey });
  
  try {
    console.log('Testing generateContent with gemini-2.5-flash...');
    const result = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: 'Hola' }] }]
    });
    console.log('Result Success');
  } catch (e: any) {
    console.error('Error:', e.message);
  }
}

test();
