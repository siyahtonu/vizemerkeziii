/**
 * VizeAkıl — VFS Global Randevu Takip Servisi (Gerçek Kontrol)
 * ══════════════════════════════════════════════════════════════
 * VFS Global ve TLScontact sayfalarını her 5 dakikada bir kontrol eder.
 * Slot açıldığında kayıtlı kullanıcılara e-posta bildirimi gönderir.
 *
 * Kalıcılık: subscribers.json (process restart sonrası kaybolmaz)
 * Zamanlayıcı: node-cron (her 5 dakika)
 * Bildirim: nodemailer (SMTP — Gmail App Password veya SMTP relay)
 */

import express, { Router } from 'express';
import rateLimit from 'express-rate-limit';
import cron from 'node-cron';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SUBSCRIBERS_FILE = path.join(__dirname, 'subscribers.json');

const router: Router = express.Router();

// ── Takip edilen konsolosluk/merkez yapılandırmaları ─────────────────────
export interface WatchTarget {
  id: string;
  country: string;
  consulate: string;
  city: string;
  vfsUrl: string;           // Kullanıcıya gösterilen yönlendirme linki
  checkUrl?: string;        // Gerçek kontrol URL'i (varsa)
  visaType: string;
  avgWaitDays: number;
  currentStatus: 'müsait' | 'dolu' | 'bilinmiyor';
  lastChecked: string;
  lastAvailable?: string;   // Son kez müsait görüldüğü zaman
}

export const WATCH_TARGETS: WatchTarget[] = [
  {
    id: 'de-ist',
    country: 'Almanya',
    consulate: 'Almanya Başkonsolosluğu',
    city: 'İstanbul',
    vfsUrl: 'https://visa.vfsglobal.com/tur/tr/deu',
    checkUrl: 'https://visa.vfsglobal.com/tur/tr/deu/login',
    visaType: 'Schengen (C)',
    avgWaitDays: 45,
    currentStatus: 'bilinmiyor',
    lastChecked: '-',
  },
  {
    id: 'de-ank',
    country: 'Almanya',
    consulate: 'Almanya Büyükelçiliği',
    city: 'Ankara',
    vfsUrl: 'https://visa.vfsglobal.com/tur/tr/deu',
    checkUrl: 'https://visa.vfsglobal.com/tur/tr/deu/login',
    visaType: 'Schengen (C)',
    avgWaitDays: 30,
    currentStatus: 'bilinmiyor',
    lastChecked: '-',
  },
  {
    id: 'fr-ist',
    country: 'Fransa',
    consulate: 'Fransa Başkonsolosluğu / TLScontact',
    city: 'İstanbul',
    vfsUrl: 'https://fr.tlscontact.com/visa/TR/TRist2Paris',
    checkUrl: 'https://fr.tlscontact.com/visa/TR/TRist2Paris',
    visaType: 'Schengen (C)',
    avgWaitDays: 21,
    currentStatus: 'bilinmiyor',
    lastChecked: '-',
  },
  {
    id: 'nl-ist',
    country: 'Hollanda',
    consulate: 'Hollanda VFS',
    city: 'İstanbul',
    vfsUrl: 'https://visa.vfsglobal.com/tur/tr/nld',
    checkUrl: 'https://visa.vfsglobal.com/tur/tr/nld/login',
    visaType: 'Schengen (C)',
    avgWaitDays: 14,
    currentStatus: 'bilinmiyor',
    lastChecked: '-',
  },
  {
    id: 'gb-ist',
    country: 'İngiltere',
    consulate: 'UK Visas VFS',
    city: 'İstanbul',
    vfsUrl: 'https://visa.vfsglobal.com/tur/tr/gbr',
    checkUrl: 'https://visa.vfsglobal.com/tur/tr/gbr/login',
    visaType: 'UK Standard Visitor',
    avgWaitDays: 18,
    currentStatus: 'bilinmiyor',
    lastChecked: '-',
  },
  {
    id: 'gb-ank',
    country: 'İngiltere',
    consulate: 'UK Visas VFS',
    city: 'Ankara',
    vfsUrl: 'https://visa.vfsglobal.com/tur/tr/gbr',
    checkUrl: 'https://visa.vfsglobal.com/tur/tr/gbr/login',
    visaType: 'UK Standard Visitor',
    avgWaitDays: 12,
    currentStatus: 'bilinmiyor',
    lastChecked: '-',
  },
  {
    id: 'us-ist',
    country: 'ABD',
    consulate: 'US Consul General Istanbul',
    city: 'İstanbul',
    vfsUrl: 'https://ais.usvisa-info.com/tr-tr/niv',
    checkUrl: 'https://ais.usvisa-info.com/tr-tr/niv',
    visaType: 'B1/B2 Turist',
    avgWaitDays: 188,
    currentStatus: 'bilinmiyor',
    lastChecked: '-',
  },
  {
    id: 'it-ist',
    country: 'İtalya',
    consulate: 'İtalya Başkonsolosluğu VFS',
    city: 'İstanbul',
    vfsUrl: 'https://visa.vfsglobal.com/tur/tr/ita',
    checkUrl: 'https://visa.vfsglobal.com/tur/tr/ita/login',
    visaType: 'Schengen (C)',
    avgWaitDays: 10,
    currentStatus: 'bilinmiyor',
    lastChecked: '-',
  },
];

// ── Abone veri modeli ─────────────────────────────────────────────────────
interface Subscriber {
  email: string;
  targets: string[];   // WatchTarget id listesi
  createdAt: string;
  notifiedAt?: string;
  notifiedTargets?: string[];  // Bildirim gönderilen hedefler (tekrar göndermemek için)
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

async function sendNotification(
  email: string,
  availableTargets: WatchTarget[],
): Promise<boolean> {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn('[appointments] SMTP yapılandırması eksik — e-posta gönderilemedi.');
    return false;
  }

  const targetList = availableTargets
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
          ${availableTargets.map(t => `
            <div style="padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
              <strong style="color: #1e40af;">${t.country} / ${t.city}</strong><br>
              <span style="color: #64748b; font-size: 14px;">${t.consulate} — ${t.visaType}</span><br>
              <a href="${t.vfsUrl}" style="color: #2563eb; font-size: 14px;">Hemen Randevu Al →</a>
            </div>
          `).join('')}
        </div>
        <p style="color: #94a3b8; font-size: 13px;">
          ⚡ Slotlar hızlı dolabilir. Bu e-postayı aldığınızda hemen başvurun.<br>
          Bu bildirimi durdurmak için <a href="https://vizeakil.com/randevu-takip">aboneliğinizi iptal edin</a>.
        </p>
        <p style="color: #cbd5e1; font-size: 12px; margin-top: 20px;">VizeAkıl — AI destekli vize analiz platformu</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"VizeAkıl Randevu Takip" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `🎯 Randevu Slotu Açıldı: ${availableTargets.map(t => t.country).join(', ')}`,
      text: `VizeAkıl Randevu Bildirimi\n\nAşağıdaki konsolosluklarda randevu slotu açıldı:\n\n${targetList}\n\nHemen başvurun — slotlar hızlı dolar.`,
      html,
    });
    return true;
  } catch (e) {
    console.error(`[appointments] E-posta gönderilemedi (${email}):`, e);
    return false;
  }
}

// ── HTTP kontrol yardımcısı ───────────────────────────────────────────────
function fetchUrl(url: string, timeoutMs = 8000): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const timer = setTimeout(() => reject(new Error('timeout')), timeoutMs);

    const req = lib.get(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
            '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'tr-TR,tr;q=0.9,en;q=0.8',
        },
      },
      (res) => {
        clearTimeout(timer);
        let body = '';
        res.setEncoding('utf8');
        res.on('data', (chunk: string) => { body += chunk; });
        res.on('end', () => resolve({ status: res.statusCode ?? 0, body }));
      },
    );

    req.on('error', (e) => { clearTimeout(timer); reject(e); });
    req.setTimeout(timeoutMs, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

// ── Slot müsaitlik tespiti ────────────────────────────────────────────────
// VFS sayfaları "No appointment slots" veya Türkçe eşdeğeri gösterir.
// Sayfa erişilebilir + bu mesajı içermiyorsa → potansiyel slot var.
const UNAVAILABLE_PATTERNS: RegExp[] = [
  /no appointment slots/i,
  /no slots available/i,
  /randevu slotu (bulunamadı|yok|mevcut değil)/i,
  /there are no slots/i,
  /appointment not available/i,
  /currently no slots/i,
  /no available appointment/i,
  /temporarily unavailable/i,
  /we are currently unable/i,
];

const MAINTENANCE_PATTERNS: RegExp[] = [
  /maintenance/i,
  /bakım/i,
  /503/i,
  /service unavailable/i,
];

async function checkAvailability(target: WatchTarget): Promise<'müsait' | 'dolu' | 'bilinmiyor'> {
  if (!target.checkUrl) return 'bilinmiyor';

  try {
    const { status, body } = await fetchUrl(target.checkUrl);

    // Sunucu hatası veya bakım
    if (status >= 500 || MAINTENANCE_PATTERNS.some(p => p.test(body))) {
      return 'bilinmiyor';
    }

    // Erişim engeli (bot koruması) — 403/429 → bilinmiyor say, alarm verme
    if (status === 403 || status === 429 || status === 0) {
      return 'bilinmiyor';
    }

    // Sayfa yüklendi ama "slot yok" mesajı var → dolu
    if (UNAVAILABLE_PATTERNS.some(p => p.test(body))) {
      return 'dolu';
    }

    // Sayfa yüklendi ve "slot yok" mesajı yok → muhtemel slot mevcut
    if (status === 200) {
      return 'müsait';
    }

    return 'bilinmiyor';
  } catch {
    return 'bilinmiyor';
  }
}

// ── Ana kontrol döngüsü ───────────────────────────────────────────────────
async function runCheck(): Promise<void> {
  const now = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });
  console.log(`[appointments] Kontrol başlıyor — ${now}`);

  // Tüm hedefleri paralel kontrol et
  await Promise.all(
    WATCH_TARGETS.map(async (target) => {
      const prevStatus = target.currentStatus;
      target.currentStatus = await checkAvailability(target);
      target.lastChecked = now;

      if (target.currentStatus === 'müsait') {
        target.lastAvailable = now;
      }

      const statusChanged = prevStatus !== target.currentStatus;
      if (statusChanged) {
        console.log(
          `[appointments] ${target.id}: ${prevStatus} → ${target.currentStatus}`,
        );
      }
    }),
  );

  // Müsait olan hedefler
  const availableIds = new Set(
    WATCH_TARGETS.filter(t => t.currentStatus === 'müsait').map(t => t.id),
  );

  if (availableIds.size === 0) {
    console.log('[appointments] Açık slot bulunamadı.');
    return;
  }

  console.log(`[appointments] Açık slot: ${[...availableIds].join(', ')}`);

  // Abonelere bildirim gönder
  for (const sub of subscribers) {
    const toNotify = sub.targets
      .filter(id => availableIds.has(id))
      .filter(id => !(sub.notifiedTargets ?? []).includes(id));

    if (toNotify.length === 0) continue;

    const targets = toNotify.map(id => WATCH_TARGETS.find(t => t.id === id)!).filter(Boolean);

    console.log(`[appointments] Bildirım gönderiliyor → ${sub.email} (${toNotify.join(', ')})`);
    const sent = await sendNotification(sub.email, targets);

    if (sent) {
      sub.notifiedAt = now;
      sub.notifiedTargets = [...new Set([...(sub.notifiedTargets ?? []), ...toNotify])];
    }
  }

  saveSubscribers(subscribers);
}

// Dolu olan hedefler için bildirim sıfırla (tekrar açılınca yeniden bildir)
function resetNotifiedForClosedSlots(): void {
  let changed = false;
  for (const sub of subscribers) {
    if (!sub.notifiedTargets?.length) continue;
    const stillOpen = (sub.notifiedTargets ?? []).filter(id => {
      const t = WATCH_TARGETS.find(x => x.id === id);
      return t?.currentStatus === 'müsait';
    });
    if (stillOpen.length !== (sub.notifiedTargets ?? []).length) {
      sub.notifiedTargets = stillOpen;
      changed = true;
    }
  }
  if (changed) saveSubscribers(subscribers);
}

// ── Cron zamanlayıcı (her 5 dakika) ──────────────────────────────────────
let cronStarted = false;

function startCron(): void {
  if (cronStarted) return;
  cronStarted = true;

  // Her 5 dakikada bir kontrol
  cron.schedule('*/5 * * * *', async () => {
    resetNotifiedForClosedSlots();
    await runCheck();
  });

  console.log('[appointments] Randevu takip servisi başlatıldı (her 5 dakika).');

  // İlk kontrol — 10 saniye sonra (sunucu hazır olsun)
  setTimeout(() => { runCheck().catch(console.error); }, 10_000);
}

startCron();

// ── Rate limit ─────────────────────────────────────────────────────────────
const subLimiter = rateLimit({ windowMs: 60_000, max: 3 });

// ── GET /api/appointments ──────────────────────────────────────────────────
router.get('/', (_req, res) => {
  res.json({
    targets: WATCH_TARGETS,
    totalSubscribers: subscribers.length,
    lastCheck: WATCH_TARGETS[0]?.lastChecked ?? '-',
    note: 'Her 5 dakikada bir kontrol yapılır. Anlık onay için VFS linkine tıklayın.',
  });
});

// ── GET /api/appointments/status ──────────────────────────────────────────
router.get('/status', (_req, res) => {
  res.json(
    WATCH_TARGETS.map(t => ({
      id: t.id,
      country: t.country,
      city: t.city,
      consulate: t.consulate,
      visaType: t.visaType,
      currentStatus: t.currentStatus,
      lastChecked: t.lastChecked,
      lastAvailable: t.lastAvailable,
      avgWaitDays: t.avgWaitDays,
      vfsUrl: t.vfsUrl,
    })),
  );
});

// ── POST /api/appointments/subscribe ──────────────────────────────────────
router.post('/subscribe', subLimiter, (req, res) => {
  const { email, targets } = req.body as { email?: string; targets?: string[] };

  if (!email || typeof email !== 'string' || !email.includes('@') || email.length > 254) {
    return res.status(400).json({ error: 'Geçerli bir e-posta adresi girin.' });
  }
  if (!targets || !Array.isArray(targets) || targets.length === 0) {
    return res.status(400).json({ error: 'En az bir konsolosluk seçin.' });
  }

  // Sadece geçerli hedef id'lerini kabul et
  const validIds = new Set(WATCH_TARGETS.map(t => t.id));
  const validTargets = targets.filter(id => validIds.has(id));
  if (validTargets.length === 0) {
    return res.status(400).json({ error: 'Geçerli konsolosluk seçimi yapılmadı.' });
  }

  const existing = subscribers.find(s => s.email === email);
  if (existing) {
    existing.targets = [...new Set([...existing.targets, ...validTargets])];
    // Yeni eklenen hedefler için bildirimi sıfırla
    existing.notifiedTargets = (existing.notifiedTargets ?? []).filter(
      id => !validTargets.includes(id),
    );
    saveSubscribers(subscribers);
    return res.json({ success: true, message: 'Abonelik güncellendi.' });
  }

  subscribers.push({
    email,
    targets: validTargets,
    createdAt: new Date().toISOString(),
  });
  saveSubscribers(subscribers);

  res.json({
    success: true,
    message: 'Randevu açıldığında e-posta ile bildirileceksiniz.',
    watchingTargets: validTargets,
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

// ── POST /api/appointments/check-now (manuel tetikleme — geliştirici) ─────
router.post('/check-now', (req, res) => {
  const secret = req.headers['x-check-secret'];
  if (!secret || secret !== process.env.CHECK_SECRET) {
    return res.status(403).json({ error: 'Yetkisiz.' });
  }
  runCheck()
    .then(() => res.json({ success: true, message: 'Kontrol tamamlandı.' }))
    .catch(e => res.status(500).json({ error: String(e) }));
});

export default router;
