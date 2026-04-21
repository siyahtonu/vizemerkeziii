/**
 * VizeAkıl — Express API Server
 * API anahtarları yalnızca sunucu tarafında tutulur, client'a asla gönderilmez.
 */
import './env.js';  // MUST be first — loads .env.local before any module reads process.env
import express from 'express';
import rateLimit from 'express-rate-limit';
import paymentRouter from './payment.js';
import appointmentRouter from './appointmentWatcher.js';
import outcomesRouter from './outcomes.js';
import contactRouter from './contact.js';
import ratesRouter from './rates.js';
import answenaRouter from './answena.js';

const app = express();
app.use(express.json());

// ── CORS — farklı origin'den gelen frontend için ──────────────────────
// Frontend api.vizeakil.com'dan ayrı origin'de (vizeakil.com) çalışır.
const ALLOWED_ORIGINS = [
  'https://vizeakil.com',
  'https://www.vizeakil.com',
  'http://localhost:3000',
  'http://localhost:3001',
];
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-secret, x-check-secret');
  if (req.method === 'OPTIONS') return res.status(204).end();
  next();
});

// ── Rate Limiting ─────────────────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,       // 1 dakika
  max: 10,                   // IP başına 10 istek
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Çok fazla istek gönderildi. Lütfen 1 dakika bekleyin.' },
});

// ── POST /api/ai ──────────────────────────────────────────
// Frontend buraya { prompt: string } gönderir, Claude'a forward eder,
// API key sunucuda kalır. Model: Claude Sonnet 4.6.
app.post('/api/ai', apiLimiter, async (req, res) => {
  const { prompt } = req.body as { prompt?: string };

  if (!prompt || typeof prompt !== 'string' || prompt.length > 4000) {
    return res.status(400).json({ error: 'Geçersiz istek.' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'AI servisi şu an kullanılamıyor.' });
  }

  try {
    // Dinamik import — @anthropic-ai/sdk zaten package.json'da mevcut
    const { default: Anthropic } = await import('@anthropic-ai/sdk');
    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    });
    // İçerik blokları arasında text olanları birleştir
    const text = message.content
      .filter((b) => b.type === 'text')
      .map((b) => (b as { text: string }).text)
      .join('\n');
    return res.json({ result: text });
  } catch (err: unknown) {
    console.error('[/api/ai] Hata:', err);
    return res.status(500).json({ error: 'AI servisi yanıt vermedi.' });
  }
});

// ── Ödeme rotaları ────────────────────────────────────────
app.use('/api/payment', paymentRouter);

// ── Randevu takip rotaları ────────────────────────────────
app.use('/api/appointments', appointmentRouter);

// ── Başvuru sonuç takip rotaları ──────────────────────────
app.use('/api/outcomes', outcomesRouter);

// ── İletişim formu ────────────────────────────────────────
app.use('/api/contact', contactRouter);

// ── Ret oranı canlı güncelleme ────────────────────────────
// GET public; POST admin (x-admin-secret) — public/data/countries.json'ı
// kod deploy'u olmadan güncellemek için. Frontend boot'ta zaten bu
// JSON'u fetch ediyor (useCountryRates hook'u).
app.use('/api/rates', ratesRouter);

// ── Answena (AI-SEO skorlama) proxy'si ────────────────────
// Tüm endpoint'ler admin-gated; ANSWENA_API_KEY sunucuda kalır.
app.use('/api/answena', answenaRouter);

// ── Sağlık kontrolü ───────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', ts: Date.now() });
});

// API-dışı istekler → frontend'e (vizeakil.com) yönlendir.
// Bu servis sadece api.vizeakil.com altında API sunar; frontend ayrı Static Site'da.
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Not found' });
  res.redirect(301, `https://vizeakil.com${req.path}`);
});

const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => {
  console.log(`[server] http://localhost:${PORT} — API hazır`);
});
