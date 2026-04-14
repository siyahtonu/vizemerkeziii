/**
 * VizeAkıl — Express API Server
 * API anahtarları yalnızca sunucu tarafında tutulur, client'a asla gönderilmez.
 */
import express from 'express';
import rateLimit from 'express-rate-limit';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const app = express();
app.use(express.json());

// ── Rate Limiting ─────────────────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,       // 1 dakika
  max: 10,                   // IP başına 10 istek
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Çok fazla istek gönderildi. Lütfen 1 dakika bekleyin.' },
});

// ── POST /api/gemini ──────────────────────────────────────
// Frontend buraya { prompt: string } gönderir, API key sunucuda kalır.
app.post('/api/gemini', apiLimiter, async (req, res) => {
  const { prompt } = req.body as { prompt?: string };

  if (!prompt || typeof prompt !== 'string' || prompt.length > 4000) {
    return res.status(400).json({ error: 'Geçersiz istek.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'AI servisi şu an kullanılamıyor.' });
  }

  try {
    // Dinamik import — @google/genai zaten package.json'da mevcut
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });
    const text = response.text ?? '';
    return res.json({ result: text });
  } catch (err: unknown) {
    console.error('[/api/gemini] Hata:', err);
    return res.status(500).json({ error: 'AI servisi yanıt vermedi.' });
  }
});

// ── Sağlık kontrolü ───────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', ts: Date.now() });
});

const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => {
  console.log(`[server] http://localhost:${PORT} — API hazır`);
});
