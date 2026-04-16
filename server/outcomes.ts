/**
 * VizeAkıl — Başvuru Sonuç Takip Sistemi (Feedback Loop)
 * ═══════════════════════════════════════════════════════
 * Kullanıcıların başvuru tarihini kaydeder, 4-8 hafta sonra
 * otomatik follow-up e-postası gönderir, gelen sonuçları depolar.
 *
 * Bu veriyle algoritma gerçek vakalarla kalibre edilebilir.
 *
 * Kalıcılık : server/applications.json
 * Zamanlayıcı: node-cron (her gün 09:00 TR saatiyle)
 * Bildirim   : nodemailer (mevcut SMTP ayarları)
 */

import express, { Router } from 'express';
import rateLimit from 'express-rate-limit';
import cron from 'node-cron';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APPLICATIONS_FILE = path.join(__dirname, 'applications.json');

const router: Router = express.Router();

// ── Ret Kodları (Schengen + UK + ABD) ────────────────────────────────────────
export const REJECTION_CODES = [
  // Schengen
  { code: 'C1',    label: 'C1 — Seyahat amacı inandırıcı değil' },
  { code: 'C2',    label: 'C2 — Seyahat ve geçim giderleri ispatlanamadı' },
  { code: 'C3',    label: 'C3 — Schengen veya ulusal yabancılar listesinde kayıt' },
  { code: 'C4',    label: 'C4 — Geri dönüş niyeti kanıtlanamadı' },
  { code: 'C5',    label: 'C5 — Daha önce kural ihlali (süre aşımı)' },
  { code: 'C6',    label: 'C6 — Pasaport geçersiz veya yetersiz süreli' },
  { code: 'C7',    label: 'C7 — Seyahat sigortası eksik veya yetersiz' },
  { code: 'C8',    label: 'C8 — Konaklama belgesi eksik/yetersiz' },
  { code: 'C9',    label: 'C9 — Davet mektubu eksik/geçersiz' },
  { code: 'C10',   label: 'C10 — İkamet belgesi yetersiz' },
  { code: 'C11',   label: 'C11 — Önceki vize veya ikamet ihlali' },
  { code: 'C12',   label: 'C12 — Güvenlik riski' },
  { code: 'C13',   label: 'C13 — Başvuru eksik/hatalı' },
  { code: 'C14',   label: 'C14 — Diğer' },
  // UK
  { code: 'UK-V4.2', label: 'UK V4.2 — Geri dönüş niyeti kanıtlanamadı' },
  { code: 'UK-V4.3', label: 'UK V4.3 — Finansal koşullar yetersiz (28-gün kural)' },
  { code: 'UK-ECO',  label: 'UK ECO — Entry Clearance Officer kararı' },
  // ABD
  { code: '214b',    label: 'ABD 214(b) — Geri dönmeyebilir şüphesi (geri dönüş bağı eksik)' },
  { code: '221g',    label: 'ABD 221(g) — Ek belge talebi (ret değil, beklemede)' },
  { code: 'INA212',  label: 'ABD INA 212 — Ehliyet engeli' },
  // Genel
  { code: 'DIGER',   label: 'Ret kodu belirtilmedi / bilmiyorum' },
];

// ── Veri Modeli ───────────────────────────────────────────────────────────────
interface ApplicationRecord {
  id: string;                    // UUID (takip + e-posta linki için)
  email: string;
  country: string;
  visaType: string;              // Schengen (C), UK Visitor, B1/B2, vs.
  applicationDate: string;       // ISO — başvuru tarihi
  profileScore: number;          // VizeAkıl'ın verdiği skor
  profileSegment: string;        // employed / student / retired / vs.

  // Follow-up durumu
  followupSentAt?: string;       // Follow-up e-postası gönderim zamanı
  followupReminderSentAt?: string; // 2. hatırlatma (8. hafta)

  // Kullanıcı bildirdiği sonuç
  outcome?: 'onay' | 'ret' | 'bekliyor';
  rejectionCode?: string;        // C1-C14, 214b, vs.
  rejectionNotes?: string;       // Serbest metin (opsiyonel)
  reportedAt?: string;

  createdAt: string;
}

// ── Kalıcı Depolama ───────────────────────────────────────────────────────────
function loadApplications(): ApplicationRecord[] {
  try {
    if (fs.existsSync(APPLICATIONS_FILE)) {
      const data = fs.readFileSync(APPLICATIONS_FILE, 'utf-8');
      return JSON.parse(data) as ApplicationRecord[];
    }
  } catch (e) {
    console.error('[outcomes] applications.json okunamadı:', e);
  }
  return [];
}

function saveApplications(apps: ApplicationRecord[]): void {
  try {
    fs.writeFileSync(APPLICATIONS_FILE, JSON.stringify(apps, null, 2), 'utf-8');
  } catch (e) {
    console.error('[outcomes] applications.json yazılamadı:', e);
  }
}

let applications: ApplicationRecord[] = loadApplications();

// ── E-posta ───────────────────────────────────────────────────────────────────
function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT ?? '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  return nodemailer.createTransport({
    host, port,
    secure: port === 465,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  });
}

async function sendFollowupEmail(app: ApplicationRecord): Promise<boolean> {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn('[outcomes] SMTP yapılandırması eksik.');
    return false;
  }

  const reportUrl = `https://vizeakil.com/sonuc-bildir?id=${app.id}`;
  const appDate = new Date(app.applicationDate).toLocaleDateString('tr-TR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1e3a5f; color: white; padding: 24px; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 20px;">📋 VizeAkıl — Vize Başvurunuz Sonuçlandı mı?</h1>
      </div>
      <div style="background: #f8fafc; padding: 24px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0;">
        <p style="color: #334155; font-size: 15px;">
          Merhaba,<br><br>
          <strong>${appDate}</strong> tarihinde <strong>${app.country}</strong> vizesi için başvuru yaptığınızı kaydetmiştiniz.
          Başvurunuz genellikle bu süreçte sonuçlanmış olur.
        </p>

        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0; text-align: center;">
          <p style="color: #475569; margin: 0 0 16px 0; font-size: 14px;">Başvurunuz sonuçlandı mı?</p>
          <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
            <a href="${reportUrl}&outcome=onay"
              style="background: #059669; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">
              ✅ Evet, Onaylandı!
            </a>
            <a href="${reportUrl}&outcome=ret"
              style="background: #dc2626; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">
              ❌ Reddedildi
            </a>
            <a href="${reportUrl}&outcome=bekliyor"
              style="background: #d97706; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">
              ⏳ Hâlâ Bekliyor
            </a>
          </div>
        </div>

        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 14px; margin: 16px 0;">
          <p style="color: #1d4ed8; font-size: 13px; margin: 0;">
            <strong>Neden soruyoruz?</strong><br>
            Gerçek başvuru sonuçlarını toplayarak algoritmamızı daha doğru hale getiriyoruz.
            Yanıtınız tamamen anonim işlenir; adınız veya pasaport bilginiz saklanmaz.
          </p>
        </div>

        <p style="color: #94a3b8; font-size: 12px; margin-top: 20px;">
          VizeAkıl — AI destekli vize analiz platformu<br>
          Bu e-postayı durdurmak için <a href="https://vizeakil.com" style="color: #94a3b8;">vizeakil.com</a>'u ziyaret edin.
        </p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"VizeAkıl" <${process.env.SMTP_USER}>`,
      to: app.email,
      subject: `📋 ${app.country} vize başvurunuz sonuçlandı mı?`,
      text: `VizeAkıl — ${app.country} başvurunuz sonuçlandı mı?\n\nOnaylandı: ${reportUrl}&outcome=onay\nReddedildi: ${reportUrl}&outcome=ret\nBekliyor: ${reportUrl}&outcome=bekliyor`,
      html,
    });
    return true;
  } catch (e) {
    console.error(`[outcomes] Follow-up e-posta gönderilemedi (${app.email}):`, e);
    return false;
  }
}

// ── Günlük follow-up tarayıcısı ───────────────────────────────────────────────
// 4 hafta (28 gün) geçmiş + follow-up gönderilmemiş + sonuç bildirilmemiş → gönder
// 8 hafta (56 gün) geçmiş + 2. hatırlatma gönderilmemiş + sonuç hâlâ yok → gönder
async function runFollowupCheck(): Promise<void> {
  const now = new Date();
  const changed: string[] = [];

  for (const app of applications) {
    if (app.outcome) continue; // Sonuç zaten var — follow-up gerekmiyor

    const appDate = new Date(app.applicationDate);
    const daysSince = Math.floor((now.getTime() - appDate.getTime()) / (1000 * 60 * 60 * 24));

    // İlk follow-up: 28-35 gün arası + henüz gönderilmemiş
    if (daysSince >= 28 && daysSince <= 56 && !app.followupSentAt) {
      console.log(`[outcomes] Follow-up gönderiliyor → ${app.email} (${app.country}, ${daysSince} gün)`);
      const sent = await sendFollowupEmail(app);
      if (sent) {
        app.followupSentAt = now.toISOString();
        changed.push(app.id);
      }
    }

    // İkinci hatırlatma: 56+ gün + 1. gönderilmiş + 2. gönderilmemiş
    if (daysSince > 56 && app.followupSentAt && !app.followupReminderSentAt) {
      console.log(`[outcomes] 2. hatırlatma gönderiliyor → ${app.email} (${app.country}, ${daysSince} gün)`);
      const sent = await sendFollowupEmail(app);
      if (sent) {
        app.followupReminderSentAt = now.toISOString();
        changed.push(app.id);
      }
    }
  }

  if (changed.length > 0) {
    saveApplications(applications);
    console.log(`[outcomes] ${changed.length} follow-up işlendi.`);
  } else {
    console.log('[outcomes] Bekleyen follow-up yok.');
  }
}

// ── Cron: Her gün 09:00 (İstanbul) ───────────────────────────────────────────
cron.schedule('0 9 * * *', () => {
  console.log('[outcomes] Günlük follow-up taraması başlıyor...');
  runFollowupCheck().catch(console.error);
}, { timezone: 'Europe/Istanbul' });

console.log('[outcomes] Feedback loop servisi başlatıldı (her gün 09:00).');

// ── Rate limit ─────────────────────────────────────────────────────────────────
const submitLimiter = rateLimit({ windowMs: 60_000, max: 5 });

// ── POST /api/outcomes/register ───────────────────────────────────────────────
// Kullanıcı başvuru tarihini kaydeder → follow-up kuyruğuna girer
router.post('/register', submitLimiter, (req, res) => {
  const { email, country, visaType, applicationDate, profileScore, profileSegment } =
    req.body as {
      email?: string;
      country?: string;
      visaType?: string;
      applicationDate?: string;
      profileScore?: number;
      profileSegment?: string;
    };

  if (!email || !email.includes('@') || email.length > 254) {
    return res.status(400).json({ error: 'Geçerli bir e-posta girin.' });
  }
  if (!country || !applicationDate) {
    return res.status(400).json({ error: 'Ülke ve başvuru tarihi gerekli.' });
  }
  const appDate = new Date(applicationDate);
  if (isNaN(appDate.getTime()) || appDate > new Date()) {
    return res.status(400).json({ error: 'Geçersiz başvuru tarihi.' });
  }

  const id = crypto.randomUUID();
  const record: ApplicationRecord = {
    id,
    email: email.toLowerCase().trim(),
    country,
    visaType: visaType ?? 'Schengen (C)',
    applicationDate: appDate.toISOString(),
    profileScore: typeof profileScore === 'number' ? profileScore : 0,
    profileSegment: profileSegment ?? 'employed',
    createdAt: new Date().toISOString(),
  };

  applications.push(record);
  saveApplications(applications);

  console.log(`[outcomes] Yeni kayıt: ${email} — ${country} — ${applicationDate}`);

  return res.json({
    success: true,
    id,
    message: `${country} başvurunuz kaydedildi. Yaklaşık 4-5 hafta sonra sonucu soruyoruz.`,
  });
});

// ── POST /api/outcomes/submit ─────────────────────────────────────────────────
// Kullanıcı sonucu bildirir (e-posta linki veya uygulama içinden)
router.post('/submit', submitLimiter, (req, res) => {
  const { id, outcome, rejectionCode, rejectionNotes } =
    req.body as {
      id?: string;
      outcome?: 'onay' | 'ret' | 'bekliyor';
      rejectionCode?: string;
      rejectionNotes?: string;
    };

  if (!id || !outcome || !['onay', 'ret', 'bekliyor'].includes(outcome)) {
    return res.status(400).json({ error: 'Geçersiz istek.' });
  }

  const record = applications.find(a => a.id === id);
  if (!record) {
    return res.status(404).json({ error: 'Kayıt bulunamadı.' });
  }

  record.outcome = outcome;
  record.rejectionCode = rejectionCode ?? undefined;
  record.rejectionNotes = rejectionNotes ?? undefined;
  record.reportedAt = new Date().toISOString();

  saveApplications(applications);

  console.log(`[outcomes] Sonuç kaydedildi: ${record.id} → ${outcome}${rejectionCode ? ` (${rejectionCode})` : ''}`);

  return res.json({
    success: true,
    message: outcome === 'onay'
      ? 'Tebrikler! Sonucunuzu paylaştığınız için teşekkürler.'
      : outcome === 'ret'
        ? 'Üzgünüz. Verileriniz algoritmamızı daha iyi hale getirmemize yardım edecek.'
        : 'Bilgi güncellendi. Sonuç belli olunca tekrar bildir etmeyi unutmayın.',
  });
});

// ── GET /api/outcomes/stats ───────────────────────────────────────────────────
// İstatistikler (ileride admin paneli için)
router.get('/stats', (req, res) => {
  const secret = req.headers['x-admin-secret'];
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ error: 'Yetkisiz.' });
  }

  const total = applications.length;
  const withOutcome = applications.filter(a => a.outcome).length;
  const approved = applications.filter(a => a.outcome === 'onay').length;
  const rejected = applications.filter(a => a.outcome === 'ret').length;
  const pending  = applications.filter(a => a.outcome === 'bekliyor').length;

  // Ülke bazında dağılım
  const byCountry: Record<string, { total: number; approved: number; rejected: number }> = {};
  for (const app of applications) {
    if (!app.outcome) continue;
    if (!byCountry[app.country]) byCountry[app.country] = { total: 0, approved: 0, rejected: 0 };
    byCountry[app.country].total++;
    if (app.outcome === 'onay') byCountry[app.country].approved++;
    if (app.outcome === 'ret')  byCountry[app.country].rejected++;
  }

  // Skor segmentleri: VizeAkıl skoru yüksek olanların gerçek onay oranı
  const byScoreBucket: Record<string, { total: number; approved: number }> = {
    '0-40': { total: 0, approved: 0 },
    '40-60': { total: 0, approved: 0 },
    '60-75': { total: 0, approved: 0 },
    '75-85': { total: 0, approved: 0 },
    '85-100': { total: 0, approved: 0 },
  };
  for (const app of applications) {
    if (!app.outcome || app.outcome === 'bekliyor') continue;
    const s = app.profileScore;
    const bucket = s < 40 ? '0-40' : s < 60 ? '40-60' : s < 75 ? '60-75' : s < 85 ? '75-85' : '85-100';
    byScoreBucket[bucket].total++;
    if (app.outcome === 'onay') byScoreBucket[bucket].approved++;
  }

  // Ret kodu dağılımı
  const rejectionCodes: Record<string, number> = {};
  for (const app of applications.filter(a => a.outcome === 'ret' && a.rejectionCode)) {
    const code = app.rejectionCode!;
    rejectionCodes[code] = (rejectionCodes[code] ?? 0) + 1;
  }

  return res.json({
    total,
    withOutcome,
    responseRate: total > 0 ? Math.round((withOutcome / total) * 100) : 0,
    outcomes: { approved, rejected, pending },
    approvalRate: withOutcome > 0 ? Math.round((approved / (approved + rejected)) * 100) : null,
    byCountry,
    byScoreBucket,
    rejectionCodes,
    note: 'Skor-onay korelasyonu: scoreBucket.approved/total oranı ile TR_REJECTION_RATES karşılaştırın.',
  });
});

// ── GET /api/outcomes/codes ───────────────────────────────────────────────────
// Frontend'e ret kodları listesi
router.get('/codes', (_req, res) => {
  res.json({ codes: REJECTION_CODES });
});

export default router;
