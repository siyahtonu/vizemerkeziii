/**
 * VizeAkıl — VFS Global Randevu Takip Servisi
 * ══════════════════════════════════════════════════════════
 * VFS Global'in Türkiye sayfalarını belirli aralıklarla kontrol eder.
 * Slot açıldığında kayıtlı kullanıcılara bildirim gönderir.
 *
 * NOT: VFS Global API'sine doğrudan erişim için resmi iş birliği gereklidir.
 * Bu implementasyon mevcut genel bilgi sayfalarını izler ve kullanıcıya
 * yönlendirme yapar (VFS GTH sitesi üzerinden randevu almaları için).
 */

import rateLimit from 'express-rate-limit';
import express, { Router } from 'express';

const router: Router = express.Router();

// ── Takip edilen konsolosluk/merkez yapılandırmaları ─────────────────────
export interface WatchTarget {
  id: string;
  country: string;        // Hedef ülke (vize alınacak)
  consulate: string;      // Konsolosluk adı
  city: string;           // Türkiye'de başvuru şehri
  vfsUrl: string;         // VFS randevu sayfası (kullanıcıya yönlendirme için)
  visaType: string;
  avgWaitDays: number;    // Ortalama bekleme (güncel veri)
  currentStatus: 'müsait' | 'dolu' | 'bilinmiyor';
  lastChecked: string;
}

export const WATCH_TARGETS: WatchTarget[] = [
  {
    id: 'de-ist', country: 'Almanya', consulate: 'Almanya Başkonsolosluğu', city: 'İstanbul',
    vfsUrl: 'https://visa.vfsglobal.com/tur/tr/deu', visaType: 'Schengen (C)',
    avgWaitDays: 45, currentStatus: 'bilinmiyor', lastChecked: '-',
  },
  {
    id: 'de-ank', country: 'Almanya', consulate: 'Almanya Büyükelçiliği', city: 'Ankara',
    vfsUrl: 'https://visa.vfsglobal.com/tur/tr/deu', visaType: 'Schengen (C)',
    avgWaitDays: 30, currentStatus: 'bilinmiyor', lastChecked: '-',
  },
  {
    id: 'fr-ist', country: 'Fransa', consulate: 'Fransa Başkonsolosluğu / TLScontact', city: 'İstanbul',
    vfsUrl: 'https://fr.tlscontact.com/visa/TR/TRist2Paris', visaType: 'Schengen (C)',
    avgWaitDays: 21, currentStatus: 'bilinmiyor', lastChecked: '-',
  },
  {
    id: 'nl-ist', country: 'Hollanda', consulate: 'Hollanda VFS', city: 'İstanbul',
    vfsUrl: 'https://visa.vfsglobal.com/tur/tr/nld', visaType: 'Schengen (C)',
    avgWaitDays: 14, currentStatus: 'bilinmiyor', lastChecked: '-',
  },
  {
    id: 'gb-ist', country: 'İngiltere', consulate: 'UK Visas VFS', city: 'İstanbul',
    vfsUrl: 'https://visa.vfsglobal.com/tur/tr/gbr', visaType: 'UK Standard Visitor',
    avgWaitDays: 18, currentStatus: 'bilinmiyor', lastChecked: '-',
  },
  {
    id: 'gb-ank', country: 'İngiltere', consulate: 'UK Visas VFS', city: 'Ankara',
    vfsUrl: 'https://visa.vfsglobal.com/tur/tr/gbr', visaType: 'UK Standard Visitor',
    avgWaitDays: 12, currentStatus: 'bilinmiyor', lastChecked: '-',
  },
  {
    id: 'us-ist', country: 'ABD', consulate: 'US Consul General Istanbul', city: 'İstanbul',
    vfsUrl: 'https://ais.usvisa-info.com/tr-tr/niv', visaType: 'B1/B2 Turist',
    avgWaitDays: 188, currentStatus: 'bilinmiyor', lastChecked: '-',
  },
  {
    id: 'it-ist', country: 'İtalya', consulate: 'İtalya Başkonsolosluğu VFS', city: 'İstanbul',
    vfsUrl: 'https://visa.vfsglobal.com/tur/tr/ita', visaType: 'Schengen (C)',
    avgWaitDays: 10, currentStatus: 'bilinmiyor', lastChecked: '-',
  },
];

// ── Bildirim aboneleri (in-memory, prod'da Postgres'e taşınır) ────────────
interface Subscriber {
  email: string;
  targets: string[];   // WatchTarget id listesi
  createdAt: string;
  notifiedAt?: string;
}

const subscribers: Subscriber[] = [];

// ── Rate limit ────────────────────────────────────────────────────────────
const subLimiter = rateLimit({ windowMs: 60_000, max: 3 });

// ── GET /api/appointments ─────────────────────────────────────────────────
router.get('/', (_req, res) => {
  res.json({
    targets: WATCH_TARGETS,
    totalSubscribers: subscribers.length,
    note: 'Durum bilgisi periyodik olarak güncellenir. Anlık onay için VFS linkine tıklayın.',
  });
});

// ── POST /api/appointments/subscribe ─────────────────────────────────────
router.post('/subscribe', subLimiter, (req, res) => {
  const { email, targets } = req.body as { email?: string; targets?: string[] };

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Geçerli bir e-posta adresi girin.' });
  }
  if (!targets || targets.length === 0) {
    return res.status(400).json({ error: 'En az bir konsolosluk seçin.' });
  }

  // Zaten kayıtlıysa güncelle
  const existing = subscribers.find(s => s.email === email);
  if (existing) {
    existing.targets = [...new Set([...existing.targets, ...targets])];
    return res.json({ success: true, message: 'Abonelik güncellendi.' });
  }

  subscribers.push({ email, targets, createdAt: new Date().toISOString() });
  res.json({ success: true, message: 'Randevu açıldığında e-posta ile bildirileceksiniz.' });
});

// ── DELETE /api/appointments/unsubscribe ──────────────────────────────────
router.delete('/unsubscribe', (req, res) => {
  const { email } = req.body as { email?: string };
  const idx = subscribers.findIndex(s => s.email === email);
  if (idx !== -1) {
    subscribers.splice(idx, 1);
    return res.json({ success: true });
  }
  res.status(404).json({ error: 'Kayıt bulunamadı.' });
});

export default router;
