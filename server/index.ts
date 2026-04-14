/**
 * VizeAkıl — Express API Server
 * API anahtarları yalnızca sunucu tarafında tutulur, client'a asla gönderilmez.
 */
import express from 'express';
import rateLimit from 'express-rate-limit';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import paymentRouter from './payment.js';
import appointmentRouter from './appointmentWatcher.js';

dotenv.config({ path: '.env.local' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

// ── Ödeme rotaları ────────────────────────────────────────
app.use('/api/payment', paymentRouter);

// ── Randevu takip rotaları ────────────────────────────────
app.use('/api/appointments', appointmentRouter);

// ── Sağlık kontrolü ───────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', ts: Date.now() });
});

// ── Statik dosyalar (üretim) ──────────────────────────────
// Express hem API hem frontend'i serve ediyorsa (VPS/Render/Railway):
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// SPA fallback — tüm API-dışı istekler index.html'e yönlenir
// Bu sayede /panel, /basla, /sonuc gibi client-side route'lar
// sayfayı yenilemede de çalışır.
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Not found' });
  res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => {
  console.log(`[server] http://localhost:${PORT} — API hazır`);
});
