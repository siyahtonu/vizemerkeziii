/**
 * VizeAkıl — Frontend Error Logger Endpoint
 * ═══════════════════════════════════════════════════════
 * Frontend ErrorBoundary'lerden gelen hataları sunucu loguna yazar.
 * Sentry/Glitchtip yerine sıfır-bağımlılık çözüm — küçük SaaS için yeterli.
 *
 * Sınırlamalar:
 *   - Aggregation/grouping yok (her hata ayrı log satırı)
 *   - Stack symbolication yok (browser ham stack)
 *   - Alerting yok (Render log streaming üzerinden manuel takip)
 *
 * Ölçek büyürse Sentry/Datadog'a geçilebilir; ErrorBoundary
 * `window.__vizeMerkezi_onError` hook'u zaten hazır.
 */

import express, { Router } from 'express';
import rateLimit from 'express-rate-limit';

const router: Router = express.Router();

// IP başına 5 dk'da 30 hata raporu yeterli — saldırgan log spamlamasın.
const errorLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

interface ErrorReport {
  message?: string;
  stack?: string;
  componentStack?: string;
  url?: string;
  userAgent?: string;
  errorId?: string;
  context?: string;
}

router.post('/', errorLimiter, (req, res) => {
  const body = (req.body ?? {}) as ErrorReport;

  // Validasyon — gönderilen payload'ı sınırla, log spam önle.
  const message = typeof body.message === 'string' ? body.message.slice(0, 500) : 'unknown';
  const stack = typeof body.stack === 'string' ? body.stack.slice(0, 4000) : '';
  const componentStack = typeof body.componentStack === 'string' ? body.componentStack.slice(0, 2000) : '';
  const url = typeof body.url === 'string' ? body.url.slice(0, 500) : '';
  const userAgent = typeof body.userAgent === 'string' ? body.userAgent.slice(0, 300) : '';
  const errorId = typeof body.errorId === 'string' ? body.errorId.slice(0, 50) : '';
  const context = typeof body.context === 'string' ? body.context.slice(0, 100) : '';

  // Render'ın log stream'inde aranabilir bir tag ile yaz.
  console.error('[client-error]', JSON.stringify({
    ts: new Date().toISOString(),
    errorId,
    context,
    message,
    url,
    userAgent: userAgent.slice(0, 80), // log readability
    stack: stack.split('\n').slice(0, 8).join(' | '), // ilk 8 satır
    componentStack: componentStack.split('\n').slice(0, 6).join(' | '),
  }));

  return res.json({ ok: true });
});

export default router;
