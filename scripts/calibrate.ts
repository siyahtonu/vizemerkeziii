/**
 * ══════════════════════════════════════════════════════════════════
 * VizeAkıl — Offline Kalibrasyon Raporu
 * ══════════════════════════════════════════════════════════════════
 *
 * Kullanım:
 *   npx tsx scripts/calibrate.ts
 *   npx tsx scripts/calibrate.ts --input server/applications.json
 *   npx tsx scripts/calibrate.ts --out calibration-report.md
 *
 * Ne yapar:
 *   - server/applications.json'daki gerçek sonuçları (onay/ret) okur.
 *   - Tahmini skor ile gerçek kabul oranını karşılaştırır.
 *   - Üç kategori için öneri üretir:
 *       1. Ülke başına TR_REJECTION_RATES güncellemesi
 *       2. Skor kovası kalibrasyonu (örn. 75–85 bucket'ı gerçekten %75–85 kabul alıyor mu?)
 *       3. Segment × ülke kabul oranları
 *
 *   - Minimum örneklem eşiği (MIN_N) altında kalan kategorilerde
 *     öneri üretmez — istatistiksel güvenilirliği olmayan güncellemeleri engeller.
 *
 * DİKKAT: Bu script üretim kodunu DEĞİŞTİRMEZ. Yalnızca rapor yazar.
 * Değişiklik kararları insan tarafından verilir.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ── Config ─────────────────────────────────────────────────────────────────
const MIN_N_COUNTRY = 15;   // Ülke önerisi için minimum sonuçlanmış vaka
const MIN_N_BUCKET  = 10;   // Skor kovası önerisi için minimum
const MIN_N_SEGMENT = 8;    // Segment × ülke önerisi için minimum
const SIGNIFICANT_DELTA = 0.05; // %5'ten küçük farklar "gürültü" — önerilmez

// ── Model (outcomes.ts ile eşleşmeli) ──────────────────────────────────────
interface ApplicationRecord {
  id: string;
  country: string;
  profileScore: number;
  profileSegment: string;
  outcome?: 'onay' | 'ret' | 'bekliyor';
  rejectionCode?: string;
}

// ── Üretimdeki mevcut TR ret oranları (elle senkronize) ────────────────────
const CURRENT_TR_RATES: Record<string, number> = {
  'Yunanistan': 0.06, 'Macaristan': 0.08, 'İtalya': 0.087, 'Portekiz': 0.09,
  'Polonya':    0.09, 'İspanya':    0.10, 'Hollanda':  0.14, 'Avusturya': 0.14,
  'Norveç':     0.20, 'Fransa':     0.21, 'ABD':       0.22, 'İsveç':     0.22,
  'Almanya':    0.23, 'İngiltere':  0.30, 'Danimarka': 0.66,
};

// ── CLI argümanları ────────────────────────────────────────────────────────
const args = process.argv.slice(2);
function arg(name: string, fallback: string): string {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
}

const INPUT_PATH = path.resolve(ROOT, arg('input', 'server/applications.json'));
const OUT_PATH   = path.resolve(ROOT, arg('out',   'calibration-report.md'));

// ── Okuma ──────────────────────────────────────────────────────────────────
function loadApplications(): ApplicationRecord[] {
  if (!fs.existsSync(INPUT_PATH)) {
    console.error(`[calibrate] Dosya bulunamadı: ${INPUT_PATH}`);
    console.error('  → Henüz hiç başvuru sonucu kaydedilmemiş olabilir. Önce kullanıcılardan veri toplayın.');
    process.exit(1);
  }
  try {
    const raw = fs.readFileSync(INPUT_PATH, 'utf-8');
    return JSON.parse(raw) as ApplicationRecord[];
  } catch (e) {
    console.error(`[calibrate] JSON okunamadı: ${e}`);
    process.exit(1);
  }
}

// ── Analiz ─────────────────────────────────────────────────────────────────
interface CountryAnalysis {
  country: string;
  n: number;               // Sonuçlanmış vaka sayısı
  actualRejRate: number;   // Gerçek ret oranı
  currentRejRate: number;  // TR_REJECTION_RATES'teki mevcut değer
  delta: number;           // actual - current
  recommendation: string;
}

function analyzeCountries(apps: ApplicationRecord[]): CountryAnalysis[] {
  const byCountry: Record<string, { total: number; rejected: number }> = {};
  for (const app of apps) {
    if (app.outcome !== 'onay' && app.outcome !== 'ret') continue;
    const c = app.country;
    byCountry[c] ??= { total: 0, rejected: 0 };
    byCountry[c].total++;
    if (app.outcome === 'ret') byCountry[c].rejected++;
  }

  const out: CountryAnalysis[] = [];
  for (const [country, { total, rejected }] of Object.entries(byCountry)) {
    if (total < MIN_N_COUNTRY) {
      out.push({
        country, n: total,
        actualRejRate: total > 0 ? rejected / total : 0,
        currentRejRate: CURRENT_TR_RATES[country] ?? 0.15,
        delta: 0,
        recommendation: `Örneklem yetersiz (n=${total} < ${MIN_N_COUNTRY}) — öneri üretilmedi.`,
      });
      continue;
    }
    const actual = rejected / total;
    const current = CURRENT_TR_RATES[country] ?? 0.15;
    const delta = actual - current;
    let rec: string;
    if (Math.abs(delta) < SIGNIFICANT_DELTA) {
      rec = 'Mevcut değer gerçekle tutarlı — güncelleme gerekmez.';
    } else {
      const direction = delta > 0 ? 'YÜKSELT' : 'DÜŞÜR';
      const suggested = Math.max(0, Math.min(1, +(current + delta * 0.7).toFixed(3)));
      rec = `${direction} — önerilen yeni değer: ${suggested} (mevcut: ${current}, fark: ${(delta * 100).toFixed(1)}%). Güvenlik için delta'nın %70'i kadar güncellenmesi önerilir.`;
    }
    out.push({ country, n: total, actualRejRate: actual, currentRejRate: current, delta, recommendation: rec });
  }
  return out.sort((a, b) => b.n - a.n);
}

interface BucketAnalysis {
  label: string;
  range: [number, number];
  n: number;
  expectedApprovalMin: number; // bucket alt sınırı (örn. 0.75)
  expectedApprovalMax: number; // bucket üst sınırı (örn. 0.85)
  actualApproval: number;
  recommendation: string;
}

function analyzeScoreBuckets(apps: ApplicationRecord[]): BucketAnalysis[] {
  const buckets: BucketAnalysis[] = [
    { label: '0–40',   range: [0, 40],   n: 0, expectedApprovalMin: 0.00, expectedApprovalMax: 0.40, actualApproval: 0, recommendation: '' },
    { label: '40–60',  range: [40, 60],  n: 0, expectedApprovalMin: 0.40, expectedApprovalMax: 0.60, actualApproval: 0, recommendation: '' },
    { label: '60–75',  range: [60, 75],  n: 0, expectedApprovalMin: 0.60, expectedApprovalMax: 0.75, actualApproval: 0, recommendation: '' },
    { label: '75–85',  range: [75, 85],  n: 0, expectedApprovalMin: 0.75, expectedApprovalMax: 0.85, actualApproval: 0, recommendation: '' },
    { label: '85–100', range: [85, 101], n: 0, expectedApprovalMin: 0.85, expectedApprovalMax: 1.00, actualApproval: 0, recommendation: '' },
  ];
  const approved = [0, 0, 0, 0, 0];

  for (const app of apps) {
    if (app.outcome !== 'onay' && app.outcome !== 'ret') continue;
    const s = app.profileScore;
    const bi = buckets.findIndex(b => s >= b.range[0] && s < b.range[1]);
    if (bi < 0) continue;
    buckets[bi].n++;
    if (app.outcome === 'onay') approved[bi]++;
  }

  for (let i = 0; i < buckets.length; i++) {
    const b = buckets[i];
    b.actualApproval = b.n > 0 ? approved[i] / b.n : 0;
    if (b.n < MIN_N_BUCKET) {
      b.recommendation = `Örneklem yetersiz (n=${b.n} < ${MIN_N_BUCKET}).`;
      continue;
    }
    // Tahminin "orta noktası" ile gerçek onay oranını karşılaştır
    const mid = (b.expectedApprovalMin + b.expectedApprovalMax) / 2;
    const diff = b.actualApproval - mid;
    if (Math.abs(diff) < SIGNIFICANT_DELTA) {
      b.recommendation = 'Kova kalibre — skor aralığı beklenen kabul oranıyla tutarlı.';
    } else if (diff > 0) {
      b.recommendation = `Skor bu kova için GEREĞİNDEN DÜŞÜK — gerçek kabul %${(b.actualApproval * 100).toFixed(1)} (beklenen orta: %${(mid * 100).toFixed(0)}). Skor formülü pozitif yönde kalibre edilebilir.`;
    } else {
      b.recommendation = `Skor bu kova için GEREĞİNDEN YÜKSEK — gerçek kabul %${(b.actualApproval * 100).toFixed(1)} (beklenen orta: %${(mid * 100).toFixed(0)}). Veto koşulları veya negatif ağırlıklar sıkılaştırılabilir.`;
    }
  }
  return buckets;
}

interface SegmentAnalysis {
  key: string;                // "employed × Almanya"
  segment: string;
  country: string;
  n: number;
  approvalRate: number;
  note: string;
}

function analyzeSegmentByCountry(apps: ApplicationRecord[]): SegmentAnalysis[] {
  const groups: Record<string, { total: number; approved: number }> = {};
  for (const app of apps) {
    if (app.outcome !== 'onay' && app.outcome !== 'ret') continue;
    const key = `${app.profileSegment} × ${app.country}`;
    groups[key] ??= { total: 0, approved: 0 };
    groups[key].total++;
    if (app.outcome === 'onay') groups[key].approved++;
  }

  const out: SegmentAnalysis[] = [];
  for (const [key, { total, approved }] of Object.entries(groups)) {
    const [segment, country] = key.split(' × ');
    const approvalRate = total > 0 ? approved / total : 0;
    let note: string;
    if (total < MIN_N_SEGMENT) {
      note = `Örneklem yetersiz (n=${total}).`;
    } else if (approvalRate < 0.40) {
      note = `DÜŞÜK kabul — SEGMENT_FACTORS bu segmenti düşürmeli; ülke sinyali TR_REJECTION_RATES'te.`;
    } else if (approvalRate > 0.90) {
      note = `YÜKSEK kabul — bu kombinasyon "yumuşak" kategorisi; avantaj sinyali olarak kullanılabilir.`;
    } else {
      note = `Orta seviye — kalibrasyon uygun görünüyor.`;
    }
    out.push({ key, segment, country, n: total, approvalRate, note });
  }
  return out.sort((a, b) => b.n - a.n);
}

// ── Rapor yazımı ───────────────────────────────────────────────────────────
function formatReport(
  total: number, withOutcome: number,
  countries: CountryAnalysis[], buckets: BucketAnalysis[], segments: SegmentAnalysis[],
): string {
  const now = new Date().toISOString().slice(0, 10);
  const lines: string[] = [];

  lines.push(`# VizeAkıl — Kalibrasyon Raporu (${now})`);
  lines.push('');
  lines.push('Bu rapor, **üretim kodunu değiştirmez**. Gerçek başvuru sonuçlarına göre skor motoru parametrelerinin nereye çekilmesi gerektiğini önerir. Öneriler, eşik örneklem boyutlarının üzerindeki kategoriler için üretilir.');
  lines.push('');
  lines.push(`## Özet`);
  lines.push(`- Toplam kayıt: **${total}**`);
  lines.push(`- Sonuçlanmış başvuru: **${withOutcome}**`);
  lines.push(`- Yanıt oranı: **%${total > 0 ? ((withOutcome / total) * 100).toFixed(1) : '0'}**`);
  lines.push('');

  // 1. Ülke
  lines.push(`## 1. Ülke Bazında Ret Oranı Kalibrasyonu`);
  lines.push('');
  lines.push(`Minimum örneklem: **${MIN_N_COUNTRY}** vaka. Anlamlı fark eşiği: **%${SIGNIFICANT_DELTA * 100}**.`);
  lines.push('');
  lines.push('| Ülke | n | Gerçek ret | Mevcut | Fark | Öneri |');
  lines.push('|---|---:|---:|---:|---:|---|');
  for (const c of countries) {
    lines.push(`| ${c.country} | ${c.n} | %${(c.actualRejRate * 100).toFixed(1)} | %${(c.currentRejRate * 100).toFixed(1)} | ${c.delta >= 0 ? '+' : ''}${(c.delta * 100).toFixed(1)}% | ${c.recommendation} |`);
  }
  lines.push('');

  // 2. Skor kovası
  lines.push(`## 2. Skor Kovası Kalibrasyonu`);
  lines.push('');
  lines.push(`Minimum örneklem: **${MIN_N_BUCKET}** vaka. Beklenen kabul oranı, kova sınırlarının orta noktasıdır (örn. 75–85 kovası için %80).`);
  lines.push('');
  lines.push('| Kova | n | Gerçek kabul | Beklenen (orta) | Durum |');
  lines.push('|---|---:|---:|---:|---|');
  for (const b of buckets) {
    const mid = (b.expectedApprovalMin + b.expectedApprovalMax) / 2;
    lines.push(`| ${b.label} | ${b.n} | %${(b.actualApproval * 100).toFixed(1)} | %${(mid * 100).toFixed(0)} | ${b.recommendation} |`);
  }
  lines.push('');

  // 3. Segment × ülke
  lines.push(`## 3. Segment × Ülke Kombinasyonları`);
  lines.push('');
  lines.push(`Minimum örneklem: **${MIN_N_SEGMENT}** vaka. SEGMENT_FACTORS için düzenleme sinyalleri (v3.10 — ülke boyutu kaldırıldı).`);
  lines.push('');
  lines.push('| Kombinasyon | n | Kabul oranı | Not |');
  lines.push('|---|---:|---:|---|');
  for (const s of segments) {
    lines.push(`| ${s.key} | ${s.n} | %${(s.approvalRate * 100).toFixed(1)} | ${s.note} |`);
  }
  lines.push('');

  lines.push(`## Nasıl Uygularsınız?`);
  lines.push('');
  lines.push('1. **Ülke oranları** → `src/scoring/matrices.ts` içindeki `TR_REJECTION_RATES` tablosunu manuel olarak güncelleyin. Önerilen değerler delta’nın %70’i kadar sıçrama yapar; tek adımda tam delta uygulamak overfitting riskidir.');
  lines.push('2. **Skor kovası sapması** → Sistemik (birkaç kova birlikte kayıyorsa), Bayes karışım ağırlıklarını (`(raw/100)*0.65 + (1-trRejRate)*0.35`) yeniden değerlendirin. Tek kova sapıyorsa ilgili skor bölümündeki ağırlıkları kontrol edin.');
  lines.push('3. **Segment çarpanı** → Anormal kabul/ret oranları için `SEGMENT_FACTORS` (matrices.ts) içindeki değeri adım adım değiştirin. Ülke boyutu v3.10\'da kaldırıldı — ülke sapmaları için TR_REJECTION_RATES güncellenir.');
  lines.push('');
  lines.push('**Her güncelleme sonrası:** `npm test` çalıştırın. Test fixture’ları değiştiyse commit mesajında kalibrasyon tarihi ve örneklem boyutu belirtilmelidir.');

  return lines.join('\n');
}

// ── Ana ────────────────────────────────────────────────────────────────────
function main() {
  console.log(`[calibrate] Kaynak: ${INPUT_PATH}`);
  const apps = loadApplications();
  const total = apps.length;
  const withOutcome = apps.filter(a => a.outcome === 'onay' || a.outcome === 'ret').length;

  if (withOutcome === 0) {
    console.error('[calibrate] Hiç sonuçlanmış başvuru yok. Kalibrasyon yapılamaz.');
    process.exit(1);
  }

  const countries = analyzeCountries(apps);
  const buckets   = analyzeScoreBuckets(apps);
  const segments  = analyzeSegmentByCountry(apps);

  const report = formatReport(total, withOutcome, countries, buckets, segments);
  fs.writeFileSync(OUT_PATH, report, 'utf-8');
  console.log(`[calibrate] Rapor yazıldı: ${OUT_PATH}`);
  console.log(`[calibrate] Özet: ${withOutcome}/${total} sonuçlanmış, ${countries.filter(c => c.n >= MIN_N_COUNTRY).length} ülke için öneri üretildi.`);
}

main();
