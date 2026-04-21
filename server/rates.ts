/**
 * VizeAkıl — Ret Oranı Güncelleme API'si
 * ═══════════════════════════════════════════════════════════════
 * EU Schengen Visa Statistics / UK Home Office yıllık yayınları
 * yayımlandıkça operator tarafından güncellenen canlı pipeline.
 *
 *   GET  /api/rates              → public/data/countries.json (public)
 *   POST /api/rates              → güncelle (x-admin-secret zorunlu)
 *   GET  /api/rates/history      → son 30 güncellemenin özeti (admin)
 *
 * Konvansiyon: countries.json dosyası "source of truth". Frontend
 * boot'ta bu dosyayı fetch edip TR_REJECTION_RATES'i override eder
 * (src/hooks/useCountryRates.ts). Kod deploy'u gerekmez.
 */

import express, { Router } from 'express';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT   = path.resolve(__dirname, '..');
const COUNTRIES_JSON = path.join(PROJECT_ROOT, 'public', 'data', 'countries.json');
const HISTORY_FILE   = path.join(__dirname, 'rates-history.json');

const router: Router = express.Router();

// ── Limiter — admin endpoint brute-force koruması ─────────────────────
const writeLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Çok fazla istek. 5 dakika bekleyin.' },
});

// ── Tip tanımları ─────────────────────────────────────────────────────
interface CountryMeta {
  flag: string;
  region: string;
  processingDays: number;
  appointmentWaitDays: number;
}

interface CountriesJson {
  _meta?: {
    version: string;
    source: string;
    note?: string;
    lastUpdated: string;
  };
  rejectionRates: Record<string, number>;
  difficultCountries: string[];
  countryMeta?: Record<string, CountryMeta>;
}

interface HistoryEntry {
  at:           string;          // ISO tarih
  actor:        string;          // admin label (request body)
  note?:        string;
  changeCount:  number;           // kaç ülke oranı değişti
  prevVersion?: string;
  newVersion:   string;
  diff:         Array<{ country: string; from: number | null; to: number }>;
}

// ── Yardımcılar ───────────────────────────────────────────────────────

function readCountriesJson(): CountriesJson | null {
  try {
    const raw = fs.readFileSync(COUNTRIES_JSON, 'utf-8');
    return JSON.parse(raw) as CountriesJson;
  } catch (err) {
    console.error('[rates] countries.json okunamadı:', (err as Error).message);
    return null;
  }
}

function atomicWriteJson(filePath: string, data: unknown): void {
  const tmp = `${filePath}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tmp, filePath);
}

function readHistory(): HistoryEntry[] {
  try {
    if (!fs.existsSync(HISTORY_FILE)) return [];
    return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf-8')) as HistoryEntry[];
  } catch {
    return [];
  }
}

function appendHistory(entry: HistoryEntry): void {
  const list = readHistory();
  list.unshift(entry);
  atomicWriteJson(HISTORY_FILE, list.slice(0, 30)); // son 30 kayıt
}

/** Ret oranı payload validasyonu — bozuk veriden koru. */
function validateRates(rates: unknown): { ok: true; rates: Record<string, number> } | { ok: false; error: string } {
  if (!rates || typeof rates !== 'object' || Array.isArray(rates)) {
    return { ok: false, error: 'rejectionRates bir obje olmalı' };
  }
  const clean: Record<string, number> = {};
  for (const [country, v] of Object.entries(rates as Record<string, unknown>)) {
    if (typeof country !== 'string' || country.length < 2 || country.length > 40) {
      return { ok: false, error: `Geçersiz ülke adı: ${country}` };
    }
    if (typeof v !== 'number' || !Number.isFinite(v) || v < 0 || v > 1) {
      return { ok: false, error: `${country} için oran 0-1 arası olmalı (gönderilen: ${v})` };
    }
    clean[country] = Number(v.toFixed(4));
  }
  if (Object.keys(clean).length === 0) {
    return { ok: false, error: 'En az bir ülke gerekli' };
  }
  return { ok: true, rates: clean };
}

// ── GET /api/rates — public (client boot'ta zaten fetch ediyor) ──────
router.get('/', (_req, res) => {
  const data = readCountriesJson();
  if (!data) {
    return res.status(500).json({ error: 'Veri okunamadı' });
  }
  res.setHeader('Cache-Control', 'no-store');
  res.json(data);
});

// ── GET /api/rates/history — admin ──────────────────────────────────
router.get('/history', (req, res) => {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return res.status(503).json({ error: 'Admin devre dışı' });
  if (req.headers['x-admin-secret'] !== secret) {
    return res.status(401).json({ error: 'Yetkisiz' });
  }
  res.json({ history: readHistory() });
});

// ── POST /api/rates — güncelle ──────────────────────────────────────
// Body: {
//   rejectionRates?: Record<string, number>;   // ülke → 0-1 oran
//   difficultCountries?: string[];              // ülke listesi
//   source?: string;                            // meta: kaynak belge
//   note?: string;                              // changelog notu
//   actor?: string;                             // kim güncelledi
// }
router.post('/', writeLimiter, (req, res) => {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return res.status(503).json({ error: 'Admin devre dışı' });
  if (req.headers['x-admin-secret'] !== secret) {
    return res.status(401).json({ error: 'Yetkisiz' });
  }

  const body = req.body as {
    rejectionRates?:     Record<string, number>;
    difficultCountries?: string[];
    source?:             string;
    note?:               string;
    actor?:              string;
  };

  const current = readCountriesJson();
  if (!current) return res.status(500).json({ error: 'Mevcut dosya okunamadı' });

  const next: CountriesJson = {
    ...current,
    rejectionRates:     { ...current.rejectionRates },
    difficultCountries: [...current.difficultCountries],
  };

  const diff: HistoryEntry['diff'] = [];

  // Ret oranları
  if (body.rejectionRates) {
    const v = validateRates(body.rejectionRates);
    if (v.ok === false) return res.status(400).json({ error: v.error });
    for (const [country, rate] of Object.entries(v.rates)) {
      const prev = current.rejectionRates[country] ?? null;
      if (prev !== rate) diff.push({ country, from: prev, to: rate });
      next.rejectionRates[country] = rate;
    }
  }

  // Zor ülkeler listesi
  if (body.difficultCountries) {
    if (!Array.isArray(body.difficultCountries)
        || !body.difficultCountries.every(x => typeof x === 'string')) {
      return res.status(400).json({ error: 'difficultCountries string[] olmalı' });
    }
    next.difficultCountries = body.difficultCountries;
  }

  // Hiçbir gerçek değişiklik yoksa yazma
  const touchedList = body.difficultCountries !== undefined;
  if (diff.length === 0 && !touchedList) {
    return res.status(400).json({ error: 'Hiçbir değişiklik algılanmadı' });
  }

  // Meta bilgisini güncelle
  const nowIso = new Date().toISOString();
  const prevVersion = current._meta?.version;
  const newVersion = nowIso.slice(0, 10); // YYYY-MM-DD — versiyon etiketi
  next._meta = {
    ...current._meta,
    version:     newVersion,
    source:      body.source ?? current._meta?.source ?? '',
    note:        body.note   ?? current._meta?.note,
    lastUpdated: nowIso,
  };

  try {
    atomicWriteJson(COUNTRIES_JSON, next);
    appendHistory({
      at:          nowIso,
      actor:       (body.actor ?? 'unknown').slice(0, 40),
      note:        body.note?.slice(0, 200),
      changeCount: diff.length,
      prevVersion,
      newVersion,
      diff,
    });
    return res.json({
      ok:          true,
      version:     newVersion,
      changeCount: diff.length,
      diff,
    });
  } catch (err) {
    console.error('[rates] write failed:', err);
    return res.status(500).json({ error: 'Yazma hatası' });
  }
});

export default router;
