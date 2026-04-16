// ============================================================
// Puanlama Algoritmaları (Yardımcı Fonksiyonlar)
// App.tsx'ten modüler yapıya taşındı — ALGORİTMA v3.0
// ============================================================

import type { ProfileData } from '../types';
import { PROFILE_COUNTRY_MATRIX } from './matrices';

// ── #1 Temporal Decay (Zamansal Ağırlık) ─────────────────────────────────
// Mantık: Konsoloslar eski vizelere yeni vizeler kadar değer vermez.
// Formül: weight = e^(-lambda * yearsAgo)
// lambda=0.20 → 5 yıl: %37 ağırlık | 10 yıl: %14 ağırlık
// lambda=0.35 → 3 yıl: %35 ağırlık | 5 yıl: %17 ağırlık (ret cezası için)
export const temporalDecay = (eventYear: number, lambda = 0.20): number => {
  if (!eventYear || eventYear === 0) return 1.0; // tarih bilinmiyor → decay yok
  const yearsAgo = Math.max(0, new Date().getFullYear() - eventYear);
  return Math.exp(-lambda * yearsAgo);
};

// ── #2 Context-Aware Red Flag Çarpanı ────────────────────────────────────
// Mantık: "Geri dönüş bağı yok" cezası yaş ve profile göre farklı ağırlık taşır.
// 22 yaşındaki öğrenci ile 45 yaşındaki aile babası aynı ceza almamalı.
export interface ContextProfile { age: number; isStudent: boolean; isMarried: boolean; hasChildren: boolean; hasSgkJob: boolean; }
export const getReturnTieMultiplier = (ctx: ContextProfile): number => {
  if (ctx.isMarried && ctx.hasChildren) return 1.6;  // Aile babası/annesi: şüphe çok yüksek
  if (ctx.hasSgkJob && ctx.age >= 35)   return 1.4;  // Orta yaş çalışan: yerleşik profil
  if (ctx.age >= 55)                     return 0.5;  // 55+: geri dönmeme riski çok düşük
  if (ctx.isStudent)                     return 0.6;  // Öğrenci: normal kabul edilir
  if (ctx.age > 0 && ctx.age < 25)      return 0.7;  // Genç: beklenen, tolerans var
  return 1.0;
};

// ── #4 Profil-Ülke Faktörü ───────────────────────────────────────────────
export const getProfileCountryFactor = (data: ProfileData): number => {
  const country = data.targetCountry;
  let segment = 'employed';
  if (data.isStudent)                          segment = 'student';
  else if (data.isPublicSectorEmployee)        segment = 'public_sector';
  else if (!data.hasSgkJob && !data.hasAssets) segment = 'unemployed';
  else if (!data.hasSgkJob && data.hasAssets)  segment = 'self_employed';
  // retired: SGK yok, 55+ yaş ve varlık var
  if (!data.hasSgkJob && data.hasAssets && data.applicantAge >= 55) segment = 'retired';
  return PROFILE_COUNTRY_MATRIX[segment]?.[country] ?? 1.0;
};

// ── #5 Eksik Veri Tespiti ─────────────────────────────────────────────────
// Mantık: Kullanıcı az alan doldurduysa skor belirsizliği yüksek.
// Önemli alanlardan kaçı "aktif" (true/sıfırdan büyük) → completeness oranı.
export const KEY_FIELDS = [
  'bankRegularity', 'bankSufficientBalance', 'hasSgkJob',
  'purposeClear', 'paidReservations', 'hasHealthInsurance',
  'hasValidPassport', 'noOverstayHistory', 'datesMatchReservations',
  'documentConsistency', 'sgkEmployerLetterWithReturn',
] as const;

export const calculateCompleteness = (data: ProfileData): number => {
  const filled = KEY_FIELDS.filter((k) => {
    const val = data[k as keyof ProfileData];
    return val === true || (typeof val === 'number' && val > 0);
  }).length;
  return filled / KEY_FIELDS.length; // 0–1
};

// ── #6 Güven Aralığı (Confidence Interval) ────────────────────────────────
// Mantık: Completeness düşükse aralık geniş. Yüksekse dar.
// Çıktı: { label, width, low, high }
export const calculateConfidenceInterval = (
  score: number,
  completeness: number,
): { label: 'Yüksek' | 'Orta' | 'Düşük'; color: string; low: number; high: number; missingCount: number } => {
  const missingCount = KEY_FIELDS.length - Math.round(completeness * KEY_FIELDS.length);
  // Width: completeness=1 → ±5, completeness=0.5 → ±12, completeness=0 → ±20
  const width = Math.round(20 - completeness * 15);
  const low  = Math.max(0,   score - width);
  const high = Math.min(100, score + width);
  if (completeness >= 0.80) return { label: 'Yüksek', color: 'text-emerald-600', low, high, missingCount };
  if (completeness >= 0.50) return { label: 'Orta',   color: 'text-amber-600',   low, high, missingCount };
  return { label: 'Düşük', color: 'text-rose-600', low, high, missingCount };
};

// ── #3 Monotonluk Doğrulama (Dev-only guard) ─────────────────────────────
// Mantık: Pozitif bir alan eklendiğinde skor hiçbir zaman düşmemeli.
// Bu fonksiyon calculateRawScore'un deterministik yapısını test eder.
// Kullanım: sadece development konsolunda uyarı üretir, production'ı etkilemez.
export const _assertMonotonicity = (
  calcFn: (d: ProfileData) => number,
  base: ProfileData,
  positiveKey: keyof ProfileData,
): void => {
  if (process.env.NODE_ENV !== 'development') return;
  const baseScore  = calcFn(base);
  const boosted    = { ...base, [positiveKey]: true };
  const boostedScore = calcFn(boosted);
  if (boostedScore < baseScore - 1) {
    console.warn(
      `[Monotonicity] "${String(positiveKey)}" true yapılınca skor düştü: ` +
      `${baseScore} → ${boostedScore}. Kalibrasyon gerekebilir.`,
    );
  }
};
