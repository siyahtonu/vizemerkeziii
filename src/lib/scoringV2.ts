/**
 * VizeAkıl Skorlama Algoritması v2.0
 * ════════════════════════════════════════════════════════════
 * Katmanlı: multifactor → red-flag veto → ülke kalibrasyonu → güven aralığı
 *
 * Geçmiş verilere dayalı istatistiksel tahmindir.
 * Konsolosluk kararını garanti etmez.
 */

// ── Tip Tanımlamaları ─────────────────────────────────────────────────────

export interface ProfileV2 {
  // Finansal
  bankBalance: number;          // TL cinsinden
  monthlyIncome: number;        // TL/ay
  balanceHeldMonths: number;    // Bakiye kaç aydır hesapta?
  lastMinuteDeposit: boolean;   // Son 28 günde >20K TL giriş var mı?
  // Mesleki
  hasSgk: boolean;
  yearsInJob: number;
  isPublicEmployee: boolean;
  // Seyahat geçmişi
  schengenCount: number;        // Önceki Schengen vize sayısı
  overstayHistory: boolean;     // Süre aşımı var mı?
  previousRejections: number;   // Kaç kez reddedildi?
  // Aile / Bağ
  isMarried: boolean;
  hasChildren: boolean;
  hasProperty: boolean;
  // Amaç
  hasRealHotelBooking: boolean;
  hasDetailedItinerary: boolean;
  purposeClarity: 0 | 1 | 2 | 3; // 0=muğlak, 3=çok net
}

export interface CountryWeights {
  code: string;
  name: string;
  baseApprovalRate: number;    // AB istatistikleri (0–1 arası)
  strictnessFactor: number;    // 1.0=ortalama, >1=sıkı, <1=gevşek
  criticalFactors: (keyof ProfileV2)[];
}

export interface ScoringResult {
  score: number;                   // 0–100 kalibre edilmiş skor
  range: [number, number];         // Güven aralığı
  category: 'yüksek' | 'orta-yüksek' | 'orta' | 'düşük' | 'kritik';
  redFlags: string[];              // Veto açıklamaları
  improvements: string[];          // Skoru artırabilecek adımlar
  disclaimer: string;
}

// ── Ülke Kalibrasyonu ────────────────────────────────────────────────────

export const COUNTRY_WEIGHTS: Record<string, CountryWeights> = {
  GR: { code: 'GR', name: 'Yunanistan', baseApprovalRate: 0.92, strictnessFactor: 0.80,
        criticalFactors: ['hasRealHotelBooking', 'purposeClarity'] },
  IT: { code: 'IT', name: 'İtalya',     baseApprovalRate: 0.91, strictnessFactor: 0.82,
        criticalFactors: ['hasRealHotelBooking', 'hasDetailedItinerary'] },
  ES: { code: 'ES', name: 'İspanya',    baseApprovalRate: 0.89, strictnessFactor: 0.88,
        criticalFactors: ['bankBalance', 'hasSgk'] },
  PT: { code: 'PT', name: 'Portekiz',   baseApprovalRate: 0.90, strictnessFactor: 0.85,
        criticalFactors: ['hasRealHotelBooking', 'purposeClarity'] },
  NL: { code: 'NL', name: 'Hollanda',   baseApprovalRate: 0.84, strictnessFactor: 1.05,
        criticalFactors: ['balanceHeldMonths', 'hasSgk'] },
  FR: { code: 'FR', name: 'Fransa',     baseApprovalRate: 0.82, strictnessFactor: 1.08,
        criticalFactors: ['lastMinuteDeposit', 'yearsInJob'] },
  DE: { code: 'DE', name: 'Almanya',    baseApprovalRate: 0.79, strictnessFactor: 1.18,
        criticalFactors: ['lastMinuteDeposit', 'hasRealHotelBooking', 'hasSgk'] },
  AT: { code: 'AT', name: 'Avusturya',  baseApprovalRate: 0.85, strictnessFactor: 1.05,
        criticalFactors: ['bankBalance', 'purposeClarity'] },
  BE: { code: 'BE', name: 'Belçika',    baseApprovalRate: 0.83, strictnessFactor: 1.07,
        criticalFactors: ['yearsInJob', 'hasRealHotelBooking'] },
  SE: { code: 'SE', name: 'İsveç',      baseApprovalRate: 0.76, strictnessFactor: 1.22,
        criticalFactors: ['schengenCount', 'yearsInJob', 'bankBalance'] },
  NO: { code: 'NO', name: 'Norveç',     baseApprovalRate: 0.78, strictnessFactor: 1.18,
        criticalFactors: ['schengenCount', 'monthlyIncome'] },
  DK: { code: 'DK', name: 'Danimarka',  baseApprovalRate: 0.34, strictnessFactor: 1.48,
        criticalFactors: ['schengenCount', 'yearsInJob', 'bankBalance', 'lastMinuteDeposit'] },
  FI: { code: 'FI', name: 'Finlandiya', baseApprovalRate: 0.82, strictnessFactor: 1.05,
        criticalFactors: ['bankBalance', 'hasSgk'] },
  PL: { code: 'PL', name: 'Polonya',    baseApprovalRate: 0.88, strictnessFactor: 0.92,
        criticalFactors: ['hasRealHotelBooking', 'purposeClarity'] },
  CZ: { code: 'CZ', name: 'Çekya',      baseApprovalRate: 0.87, strictnessFactor: 0.93,
        criticalFactors: ['bankBalance', 'hasDetailedItinerary'] },
  CH: { code: 'CH', name: 'İsviçre',    baseApprovalRate: 0.81, strictnessFactor: 1.12,
        criticalFactors: ['bankBalance', 'monthlyIncome', 'lastMinuteDeposit'] },
  GB: { code: 'GB', name: 'İngiltere',  baseApprovalRate: 0.72, strictnessFactor: 1.28,
        criticalFactors: ['balanceHeldMonths', 'yearsInJob', 'schengenCount'] },
  US: { code: 'US', name: 'ABD',        baseApprovalRate: 0.79, strictnessFactor: 1.25,
        criticalFactors: ['previousRejections', 'yearsInJob', 'hasProperty', 'isMarried'] },
};

// ── KATMAN A: Çok Faktörlü Taban Skoru (0–100) ───────────────────────────

function calculateBaseScore(p: ProfileV2): number {
  let score = 0;

  // ─ Finansal (30 puan) ─
  const tripCostTL = 45_000; // ortalama Schengen gidiş maliyeti
  const bufferRatio = p.bankBalance / tripCostTL;
  if (bufferRatio >= 2.0) score += 15;
  else if (bufferRatio >= 1.5) score += 12;
  else if (bufferRatio >= 1.0) score += 7;
  else if (bufferRatio >= 0.7) score += 3;

  if (p.balanceHeldMonths >= 6) score += 10;
  else if (p.balanceHeldMonths >= 3) score += 6;
  else if (p.balanceHeldMonths >= 1) score += 2;

  if (p.monthlyIncome >= 50_000) score += 5;
  else if (p.monthlyIncome >= 30_000) score += 3;
  else if (p.monthlyIncome >= 15_000) score += 1;

  // ─ Mesleki (25 puan) ─
  if (p.isPublicEmployee) score += 15;
  else if (p.hasSgk && p.yearsInJob >= 3) score += 12;
  else if (p.hasSgk && p.yearsInJob >= 1) score += 8;
  else if (p.hasSgk) score += 4;

  if (p.yearsInJob >= 5) score += 10;
  else if (p.yearsInJob >= 3) score += 6;
  else if (p.yearsInJob >= 1) score += 3;

  // ─ Seyahat geçmişi (20 puan) ─
  score += Math.min(p.schengenCount * 4, 15);
  if (p.previousRejections === 0) score += 5;
  else if (p.previousRejections === 1) score += 1;

  // ─ Aile / Bağ (10 puan) ─
  if (p.isMarried) score += 4;
  if (p.hasChildren) score += 3;
  if (p.hasProperty) score += 3;

  // ─ Amaç / Hazırlık (15 puan) ─
  if (p.hasRealHotelBooking) score += 5;
  if (p.hasDetailedItinerary) score += 4;
  score += Math.round(p.purposeClarity * 2);  // 0–6

  return Math.min(Math.max(score, 0), 100);
}

// ── KATMAN B: Red Flag Vetosu ─────────────────────────────────────────────
// Bu faktörler diğer puanlara bakılmaksızın skor tavanını düşürür.

interface VetoResult { cap: number; reasons: string[]; }

function applyVetoes(p: ProfileV2): VetoResult {
  const reasons: string[] = [];
  let cap = 100;

  if (p.overstayHistory) {
    cap = Math.min(cap, 12);
    reasons.push('Süre aşımı (overstay) geçmişi — uzun süreli ret riski yüksek');
  }
  if (p.lastMinuteDeposit) {
    cap = Math.min(cap, 42);
    reasons.push('28-gün kuralı ihlali: son dakika büyük mevduat şüpheli görünüyor');
  }
  if (p.previousRejections >= 3) {
    cap = Math.min(cap, 28);
    reasons.push('3+ ret geçmişi — strateji köklü değiştirilmeden başvuru yüksek risk');
  } else if (p.previousRejections === 2) {
    cap = Math.min(cap, 38);
    reasons.push('Çift ret geçmişi — kapsamlı gerekçe sunulmalı');
  }
  if (!p.hasSgk && p.bankBalance < 20_000) {
    cap = Math.min(cap, 32);
    reasons.push('SGK + düşük bakiye kombinasyonu — kritik finansal güven sorunu');
  }
  if (p.previousRejections >= 1 && p.schengenCount === 0) {
    cap = Math.min(cap, 46);
    reasons.push('İlk Schengen denemesi + önceki ret — konsolosluk şüpheli yaklaşır');
  }
  if (p.bankBalance < 15_000 && !p.isPublicEmployee) {
    cap = Math.min(cap, 40);
    reasons.push('Bakiye Schengen minimum standardının (€400) altında');
  }

  return { cap, reasons };
}

// ── KATMAN C: Ülke Kalibrasyonu ───────────────────────────────────────────

function calibrateForCountry(base: number, countryCode: string, p: ProfileV2): number {
  const country = COUNTRY_WEIGHTS[countryCode];
  if (!country) return base;

  let calibrated = base / country.strictnessFactor;

  // Ülkenin kritik faktörlerinde zayıflık/güç bonusları
  for (const factor of country.criticalFactors) {
    const val = p[factor];
    if (val === false || val === 0) calibrated -= 7;
    if (val === true || (typeof val === 'number' && val >= 1)) calibrated += 3;
  }

  // Ülkenin baz onay oranıyla Bayes ponderasyonu
  const raw = calibrated / 100;
  const blended = raw * 0.70 + country.baseApprovalRate * 0.30;
  return Math.max(0, Math.min(100, blended * 100));
}

// ── KATMAN D: Güven Aralığı ───────────────────────────────────────────────

function confidenceInterval(score: number, p: ProfileV2): [number, number] {
  const filledFields = [
    p.bankBalance > 0,
    p.monthlyIncome > 0,
    p.balanceHeldMonths > 0,
    p.yearsInJob > 0,
    p.schengenCount >= 0,
    p.purposeClarity >= 0,
    p.hasRealHotelBooking !== undefined,
    p.hasDetailedItinerary !== undefined,
  ].filter(Boolean).length;

  const uncertainty = Math.max(0, (8 - filledFields) * 4); // her eksik alan ±4 puan
  return [
    Math.max(0, Math.round(score - uncertainty)),
    Math.min(100, Math.round(score + uncertainty)),
  ];
}

// ── ANA FONKSİYON ────────────────────────────────────────────────────────

export function predictVisaOutcome(profile: ProfileV2, countryCode = 'DE'): ScoringResult {
  const baseScore = calculateBaseScore(profile);
  const veto = applyVetoes(profile);
  const afterVeto = Math.min(baseScore, veto.cap);
  const calibrated = calibrateForCountry(afterVeto, countryCode, profile);
  const [low, high] = confidenceInterval(calibrated, profile);

  let category: ScoringResult['category'];
  if (calibrated >= 80) category = 'yüksek';
  else if (calibrated >= 65) category = 'orta-yüksek';
  else if (calibrated >= 45) category = 'orta';
  else if (calibrated >= 25) category = 'düşük';
  else category = 'kritik';

  // İyileştirme önerileri
  const improvements: string[] = [];
  if (profile.balanceHeldMonths < 3) improvements.push('Bakiyenizi en az 3 ay bekletin');
  if (!profile.hasSgk) improvements.push('SGK kaydı / çalışma belgesi edinin');
  if (profile.schengenCount === 0) improvements.push('Önce kolay Schengen ülkesi (Yunanistan/İtalya) deneyin');
  if (!profile.hasRealHotelBooking) improvements.push('Gerçek otel rezervasyonu ekleyin (sahte değil)');
  if (profile.lastMinuteDeposit) improvements.push('28-gün geçene dek bekleyin veya bankayı açıklayın');
  if (profile.previousRejections > 0) improvements.push('Reddin gerekçesini adresleyen belgeleri ekleyin');

  return {
    score: Math.round(calibrated),
    range: [low, high],
    category,
    redFlags: veto.reasons,
    improvements,
    disclaimer:
      'Bu skor geçmiş istatistiklere dayalı bir tahmindir. ' +
      'Konsolosluk kararı birçok faktöre bağlıdır ve garanti edilemez. ' +
      'Kaynak: Schengen Visa Statistics, EU Commission 2024–2026.',
  };
}

// ── Ülke listesi yardımcısı ───────────────────────────────────────────────
export const countryOptions = Object.values(COUNTRY_WEIGHTS).map(c => ({
  code: c.code,
  name: c.name,
  difficulty:
    c.strictnessFactor >= 1.3 ? 'Çok Zor' :
    c.strictnessFactor >= 1.1 ? 'Zor' :
    c.strictnessFactor >= 0.9 ? 'Orta' : 'Kolay',
}));
