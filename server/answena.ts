/**
 * VizeAkıl — Answena API Proxy'si
 * ═══════════════════════════════════════════════════════════════
 * Answena (answena.com) AI-SEO skorlama servisi. API anahtarı
 * sunucuda tutulur; client'a asla sızmaz. Tüm endpoint'ler
 * x-admin-secret ile korunur — rate limiter ayrıca brute force'u
 * engeller.
 *
 *   POST /api/answena/scan      → Free Scan (public endpoint, yine de admin-gated
 *                                 tutuyoruz ki rastgele trafik kendi IP kotamızı
 *                                 tüketmesin). Body: { url?: string }
 *   POST /api/answena/recos     → Get Recommendations (live scan + fixes)
 *   POST /api/answena/report    → Push Your Data
 *   POST /api/answena/feedback  → Send Feedback (site_type düzeltme vb.)
 *
 * Env: ANSWENA_API_KEY, ANSWENA_SITE_ID, ADMIN_SECRET (zorunlu).
 */

import express, { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';

const router: Router = express.Router();

const ANSWENA_BASE = 'https://answena.com';
const DEFAULT_TARGET_URL = 'https://vizeakil.com';

// ── Rate limiter — brute force + kota koruması ────────────────────────
// Answena'nın kendi kotası var; bizim IP'miz üzerinden fazla istek
// gönderirsek onların rate limit'ine takılırız.
const answenaLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Çok fazla istek. 5 dakika bekleyin.' },
});

// ── Admin guard ───────────────────────────────────────────────────────
// rates.ts ve outcomes.ts ile aynı pattern — x-admin-secret header'ı
// ADMIN_SECRET env'i ile eşleşmeli. ADMIN_SECRET yoksa endpoint devre dışı.
function requireAdmin(req: Request, res: Response): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    res.status(503).json({ error: 'Admin devre dışı (ADMIN_SECRET tanımlı değil)' });
    return false;
  }
  if (req.headers['x-admin-secret'] !== secret) {
    res.status(401).json({ error: 'Yetkisiz' });
    return false;
  }
  return true;
}

function requireAnswenaKey(res: Response): string | null {
  const key = process.env.ANSWENA_API_KEY;
  if (!key) {
    res.status(503).json({ error: 'ANSWENA_API_KEY tanımlı değil' });
    return null;
  }
  return key;
}

// ── Upstream proxy yardımcısı ─────────────────────────────────────────
// Answena'ya JSON POST atar; 500 durumunda upstream status+mesajı koruyarak döner.
// Answena'nın cevabını bize olduğu gibi geçiriyoruz — response shape'i onların
// kontrolünde, bizim wrap etmemize gerek yok.
async function proxyJson(
  endpoint: string,
  body: unknown,
  authKey: string | null,
  res: Response,
): Promise<void> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (authKey) headers['X-AISEO-Key'] = authKey;

  try {
    const upstream = await fetch(`${ANSWENA_BASE}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    const text = await upstream.text();
    // Answena JSON döner; parse edilemezse raw text'i error olarak geri ver
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      res.status(upstream.status).json({ error: 'Upstream non-JSON', raw: text.slice(0, 500) });
      return;
    }
    res.status(upstream.status).json(parsed);
  } catch (err: unknown) {
    console.error(`[answena] ${endpoint} upstream hatası:`, err);
    res.status(502).json({ error: 'Answena servisine ulaşılamadı' });
  }
}

// ── POST /api/answena/scan — public endpoint, admin-gated proxy ──────
// Free scan auth istemez ama IP kotasını korumak için yine de admin.
// Body: { url?: string } — boşsa vizeakil.com taranır.
router.post('/scan', answenaLimiter, async (req, res) => {
  if (!requireAdmin(req, res)) return;
  const url = typeof req.body?.url === 'string' && req.body.url.trim().length > 0
    ? req.body.url.trim()
    : DEFAULT_TARGET_URL;
  await proxyJson('/api/v1/free-scan', { url }, null, res);
});

// ── POST /api/answena/recos — live scan + personalised fixes ─────────
// Gövdesi boş `{}` gönderiyoruz; Answena kayıtlı site_id'imize göre yanıtlar.
router.post('/recos', answenaLimiter, async (req, res) => {
  if (!requireAdmin(req, res)) return;
  const key = requireAnswenaKey(res);
  if (!key) return;
  await proxyJson('/api/v1/connect', {}, key, res);
});

// ── POST /api/answena/report — push our own metrics ──────────────────
// Body: { agent, report, memory } — Answena docs'taki şema.
// Şimdilik gönderecek özel bir dashboard verimiz yok; endpoint ileride
// Lighthouse/CI raporları bağlanırsa hazır olsun diye duruyor.
router.post('/report', answenaLimiter, async (req, res) => {
  if (!requireAdmin(req, res)) return;
  const key = requireAnswenaKey(res);
  if (!key) return;
  const payload = req.body;
  if (!payload || typeof payload !== 'object') {
    return res.status(400).json({ error: 'Geçersiz body' });
  }
  await proxyJson('/api/v1/sync/report', payload, key, res);
});

// ── POST /api/answena/feedback — site_type/proje düzeltme ────────────
// Örnek body: { "site_type_correction": "visa_tools", "project_description": "..." }
router.post('/feedback', answenaLimiter, async (req, res) => {
  if (!requireAdmin(req, res)) return;
  const key = requireAnswenaKey(res);
  if (!key) return;
  const payload = req.body;
  if (!payload || typeof payload !== 'object') {
    return res.status(400).json({ error: 'Geçersiz body' });
  }
  await proxyJson('/api/v1/feedback', payload, key, res);
});

export default router;
