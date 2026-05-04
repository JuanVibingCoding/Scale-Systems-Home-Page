import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const key = process.env.VITE_GEMINI_API_KEY;

if (!key || key === 'MY_GEMINI_API_KEY') {
  console.log('STATUS: MISSING_KEY');
  console.log('Value found: ' + key);
} else {
  console.log('STATUS: KEY_FOUND');
  console.log('Key starts with: ' + key.substring(0, 4) + '...');
}
