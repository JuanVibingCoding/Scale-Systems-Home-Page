import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

async function list() {
  const apiKey = process.env.VITE_GEMINI_API_KEY;
  const client = new GoogleGenAI({ apiKey });
  
  try {
    console.log('Listing models...');
    const result = await client.models.list();
    console.log('Models:', JSON.stringify(result, null, 2));
  } catch (e: any) {
    console.error('Error:', e.message);
  }
}

list();
