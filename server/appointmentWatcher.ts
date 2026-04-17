/**
 * VizeAkıl — Randevu Bildirim Servisi (Manuel Duyuru Modeli)
 * ══════════════════════════════════════════════════════════════
 * Kullanıcılar ülke/merkez seçip abone olur (email).
 * Admin bir merkezde slot açıldığını gördüğünde /announce endpoint'ine
 * POST atar → o merkezleri takip eden tüm abonelere bildirim gider.
 *
 * Otomatik scraping YOK — VFS/TLS Cloudflare koruması ve login zorunluluğu
 * nedeniyle güvenilir otomatik tespit mümkün değil. Yanlış alarm yerine
 * insan doğrulamalı duyuru tercih edilmiştir.
 */

import express, { Router } from 'express';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SUBSCRIBERS_FILE = path.join(__dirname, 'subscribers.json');

const router: Router = express.Router();

// ── Abone veri modeli ─────────────────────────────────────────────────────
interface Subscriber {
  email: string;
  targets: string[];                 // Takip edilen merkez id'leri
  createdAt: string;
  lastNotifiedAt?: string;
}

// ── Duyuruda gönderilecek merkez bilgisi ──────────────────────────────────
interface OpenTarget {
  id: string;
  country: string;
  city: string;
  visaType: string;
  vfsUrl: string;
}

// ── Kalıcı depolama ───────────────────────────────────────────────────────
function loadSubscribers(): Subscriber[] {
  try {
    if (fs.existsSync(SUBSCRIBERS_FILE)) {
      const data = fs.readFileSync(SUBSCRIBERS_FILE, 'utf-8');
      return JSON.parse(data) as Subscriber[];
    }
  } catch (e) {
    console.error('[appointments] subscribers.json okunamadı:', e);
  }
  return [];
}

function saveSubscribers(subs: Subscriber[]): void {
  try {
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subs, null, 2), 'utf-8');
  } catch (e) {
    console.error('[appointments] subscribers.json yazılamadı:', e);
  }
}

let subscribers: Subscriber[] = loadSubscribers();

// ── E-posta gönderici ─────────────────────────────────────────────────────
function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT ?? '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  });
}

async function sendNotification(email: string, openTargets: OpenTarget[]): Promise<boolean> {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn('[appointments] SMTP yapılandırması eksik — e-posta gönderilemedi.');
    return false;
  }

  const textBody = openTargets
    .map(t => `• ${t.country} / ${t.city} (${t.visaType}): ${t.vfsUrl}`)
    .join('\n');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1e40af; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 22px;">🎯 VizeAkıl — Randevu Slotu Açıldı!</h1>
      </div>
      <div style="background: #f8fafc; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0;">
        <p style="color: #334155; font-size: 16px;">Takip ettiğiniz konsolosluklarda randevu slotu açıldı:</p>
        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin: 16px 0;">
          ${openTargets.map(t => `
            <div style="padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
              <strong style="color: #1e40af;">${t.country} / ${t.city}</strong><br>
              <span style="color: #64748b; font-size: 14px;">${t.visaType}</span><br>
              <a href="${t.vfsUrl}" style="color: #2563eb; font-size: 14px;">Hemen Randevu Al →</a>
            </div>
          `).join('')}
        </div>
        <p style="color: #94a3b8; font-size: 13px;">
          ⚡ Slotlar hızlı dolabilir. Bu e-postayı aldığınızda hemen başvurun.<br>
          Bu bildirimi durdurmak için <a href="https://vizeakil.com/#randevu-takip">aboneliğinizi iptal edin</a>.
        </p>
        <p style="color: #cbd5e1; font-size: 12px; margin-top: 20px;">VizeAkıl — AI destekli vize analiz platformu</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"VizeAkıl Randevu Takip" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `🎯 Randevu Slotu Açıldı: ${openTargets.map(t => `${t.country} ${t.city}`).join(', ')}`,
      text: `VizeAkıl Randevu Bildirimi\n\nAşağıdaki konsolosluklarda slot açıldı:\n\n${textBody}\n\nHemen başvurun — slotlar hızlı dolar.`,
      html,
    });
    return true;
  } catch (e) {
    console.error(`[appointments] E-posta gönderilemedi (${email}):`, e);
    return false;
  }
}

// ── Rate limit ─────────────────────────────────────────────────────────────
const subLimiter = rateLimit({ windowMs: 60_000, max: 3 });

// ── GET /api/appointments ──────────────────────────────────────────────────
router.get('/', (_req, res) => {
  res.json({
    totalSubscribers: subscribers.length,
    note: 'Manuel duyuru modeli — admin slot açıldığında duyuru gönderir.',
  });
});

// ── POST /api/appointments/subscribe ──────────────────────────────────────
router.post('/subscribe', subLimiter, (req, res) => {
  const { email, targets } = req.body as { email?: string; targets?: string[] };

  if (!email || typeof email !== 'string' || !email.includes('@') || email.length > 254) {
    return res.status(400).json({ error: 'Geçerli bir e-posta adresi girin.' });
  }
  if (!Array.isArray(targets) || targets.length === 0 || targets.length > 30) {
    return res.status(400).json({ error: 'En az 1, en fazla 30 merkez seçin.' });
  }
  const cleanTargets = targets
    .filter(id => typeof id === 'string' && id.length > 0 && id.length <= 20)
    .map(id => id.toLowerCase().trim());
  if (cleanTargets.length === 0) {
    return res.status(400).json({ error: 'Geçerli merkez seçimi yapılmadı.' });
  }

  const existing = subscribers.find(s => s.email === email);
  if (existing) {
    existing.targets = [...new Set([...existing.targets, ...cleanTargets])];
    saveSubscribers(subscribers);
    return res.json({ success: true, message: 'Abonelik güncellendi.' });
  }

  subscribers.push({
    email,
    targets: cleanTargets,
    createdAt: new Date().toISOString(),
  });
  saveSubscribers(subscribers);

  res.json({
    success: true,
    message: 'Randevu açıldığında e-posta ile bildirileceksiniz.',
    watchingTargets: cleanTargets,
  });
});

// ── DELETE /api/appointments/unsubscribe ──────────────────────────────────
router.delete('/unsubscribe', (req, res) => {
  const { email } = req.body as { email?: string };
  if (!email) return res.status(400).json({ error: 'E-posta gerekli.' });

  const idx = subscribers.findIndex(s => s.email === email);
  if (idx !== -1) {
    subscribers.splice(idx, 1);
    saveSubscribers(subscribers);
    return res.json({ success: true, message: 'Abonelik iptal edildi.' });
  }
  res.status(404).json({ error: 'Kayıt bulunamadı.' });
});

// ── GET /api/appointments/subscribers (admin) ─────────────────────────────
// Abone listesini ve her merkeze kaç kişinin abone olduğunu döner.
router.get('/subscribers', (req, res) => {
  const secret = req.headers['x-admin-secret'];
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ error: 'Yetkisiz.' });
  }

  const perTargetCount: Record<string, number> = {};
  for (const sub of subscribers) {
    for (const id of sub.targets) {
      perTargetCount[id] = (perTargetCount[id] ?? 0) + 1;
    }
  }

  res.json({
    total: subscribers.length,
    perTarget: perTargetCount,
    subscribers: subscribers.map(s => ({
      email: s.email,
      targetCount: s.targets.length,
      createdAt: s.createdAt,
      lastNotifiedAt: s.lastNotifiedAt,
    })),
  });
});

// ── POST /api/appointments/announce (admin) ───────────────────────────────
// Admin burada "şu merkezlerde slot açıldı" duyurusu yapar. Bu merkezleri
// takip eden tüm abonelere mail gider.
//
// Body: { openTargets: [{ id, country, city, visaType, vfsUrl }, ...] }
router.post('/announce', async (req, res) => {
  const secret = req.headers['x-admin-secret'];
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ error: 'Yetkisiz.' });
  }

  const { openTargets } = req.body as { openTargets?: OpenTarget[] };
  if (!Array.isArray(openTargets) || openTargets.length === 0) {
    return res.status(400).json({ error: 'openTargets dizisi gerekli.' });
  }

  // Her merkez için zorunlu alanları kontrol et
  for (const t of openTargets) {
    if (!t.id || !t.country || !t.city || !t.visaType || !t.vfsUrl) {
      return res.status(400).json({ error: 'openTargets içinde id/country/city/visaType/vfsUrl eksik.' });
    }
  }

  const openIds = new Set(openTargets.map(t => t.id));
  const now = new Date().toISOString();

  const results: { email: string; targets: string[]; sent: boolean }[] = [];
  let sentCount = 0;
  let failCount = 0;
  let skippedCount = 0;

  for (const sub of subscribers) {
    const matchingIds = sub.targets.filter(id => openIds.has(id));
    if (matchingIds.length === 0) {
      skippedCount++;
      continue;
    }
    const targetsForEmail = openTargets.filter(t => matchingIds.includes(t.id));
    const sent = await sendNotification(sub.email, targetsForEmail);
    if (sent) {
      sub.lastNotifiedAt = now;
      sentCount++;
    } else {
      failCount++;
    }
    results.push({ email: sub.email, targets: matchingIds, sent });
  }

  saveSubscribers(subscribers);

  res.json({
    success: true,
    announcedTargets: openTargets.map(t => t.id),
    sentCount,
    failCount,
    skippedCount,
    totalSubscribers: subscribers.length,
    results,
  });
});

export default router;
