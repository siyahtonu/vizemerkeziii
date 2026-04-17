// ============================================================
// Puanlama Algoritmaları (Yardımcı Fonksiyonlar)
// App.tsx'ten modüler yapıya taşındı — ALGORİTMA v3.0
// ============================================================

import type { ProfileData } from '../types';
import { PROFILE_COUNTRY_MATRIX, CONSULATE_MATRIX, CITY_TO_CONSULATE_ZONE } from './matrices';
import type { ConsulateProfile, ProfileSegment, ConsulateCity } from './matrices';

// ── #1 Temporal Decay (Zamansal Ağırlık) ─────────────────────────────────
// Mantık: Konsoloslar eski vizelere yeni vizeler kadar değer vermez.
// Formül: weight = e^(-lambda * yearsAgo)
// lambda=0.20 → 5 yıl: %37 ağırlık | 10 yıl: %14 ağırlık
// lambda=0.35 → 3 yıl: %35 ağırlık | 5 yıl: %17 ağırlık (ret cezası için)
export const temporalDecay = (eventYear: number, lambda = 0.20): number => {
  if (!eventYear || eventYear === 0) return 1.0; // tarih bilinmiyor → decay yok
  if (eventYear < 0) return 0.0; // -1 = "hiç yok" → sıfır ağırlık (vize/ret yok)
  const yearsAgo = Math.max(0, new Date().getFullYear() - eventYear);
  return Math.exp(-lambda * yearsAgo);
};

// ── #2 Context-Aware Red Flag Çarpanı ────────────────────────────────────
// Mantık: "Geri dönüş bağı yok" cezası yaş ve profile göre farklı ağırlık taşır.
// 22 yaşındaki öğrenci ile 45 yaşındaki aile babası aynı ceza almamalı.
export interface ContextProfile { age: number; isStudent: boolean; isMarried: boolean; hasChildren: boolean; hasSgkJob: boolean; }
export const getReturnTieMultiplier = (ctx: ContextProfile): number => {
  // 55+ yaş en güçlü anti-göç sinyal — diğer koşullardan önce gelmelidir
  if (ctx.age >= 55)                     return 0.5;  // 55+: geri dönmeme riski çok düşük
  if (ctx.isMarried && ctx.hasChildren) return 1.6;  // Aile babası/annesi: şüphe çok yüksek
  if (ctx.hasSgkJob && ctx.age >= 35)   return 1.4;  // Orta yaş çalışan: yerleşik profil
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

// ── #5b Konsolosluk Kalibrasyonu (v3.1) ──────────────────────────────────
// Mantık: Aynı ülke için farklı şehirdeki konsolosluğun davranışı farklıdır.
// city × country × profile_segment 3 boyutlu matris.
// Çıktı: { multiplier, segmentDelta, consulateProfile }

export interface ConsulateAdjustment {
  /** Konsolosluk bazlı toplam çarpan (multiplier × segmentBonus) */
  totalMultiplier: number;
  /** Sadece base multiplier (segment bonusu olmadan) */
  baseMultiplier: number;
  /** Segment bonusu (eklenmiş değer) */
  segmentDelta: number;
  /** Eşleşen konsolosluk profili (null = veri yok) */
  profile: ConsulateProfile | null;
  /** Hangi şehir konsolosluğuna eşlendi */
  resolvedCity: ConsulateCity | null;
}

/** Profil segment'ini belirler (algorithms.ts'deki mantıkla tutarlı) */
const resolveSegment = (data: ProfileData): ProfileSegment => {
  if (data.isStudent) return 'student';
  if (data.isPublicSectorEmployee) return 'public_sector';
  if (!data.hasSgkJob && data.hasAssets && data.applicantAge >= 55) return 'retired';
  if (!data.hasSgkJob && data.hasAssets) return 'self_employed';
  if (!data.hasSgkJob && !data.hasAssets) return 'unemployed';
  return 'employed';
};

/**
 * Kullanıcının şehrini konsolosluk bölgesine eşler.
 * Bilinmeyen şehirler → İstanbul (varsayılan)
 */
export const findNearestConsulate = (
  city: string | undefined,
  country: string,
): ConsulateCity | null => {
  if (!city) return null;
  const normalized = city.trim();

  // Doğrudan eşleşme
  const direct = CITY_TO_CONSULATE_ZONE[normalized];
  if (direct) {
    // Bu konsolosluk bu ülkede mevcut mu kontrol et
    const countryEntry = CONSULATE_MATRIX[country];
    if (countryEntry?.[direct]) return direct;
    // Fallback: İstanbul (en büyük)
    if (countryEntry?.['İstanbul']) return 'İstanbul';
  }

  // Konsolosluk şehri ise direkt kullan
  const consulateCities: ConsulateCity[] = ['İstanbul', 'Ankara', 'İzmir', 'Adana', 'Gaziantep'];
  const asConsulate = consulateCities.find(c => c === normalized);
  if (asConsulate) {
    const countryEntry = CONSULATE_MATRIX[country];
    if (countryEntry?.[asConsulate]) return asConsulate;
    if (countryEntry?.['İstanbul']) return 'İstanbul';
  }

  // Bilinmiyor → İstanbul default
  const countryEntry = CONSULATE_MATRIX[country];
  if (countryEntry?.['İstanbul']) return 'İstanbul';
  return null;
};

/**
 * 3 boyutlu konsolosluk kalibrasyonu:
 * country × city (veya en yakın) × profile_segment → çarpan
 */
export const getConsulateAdjustment = (data: ProfileData): ConsulateAdjustment => {
  const nullResult: ConsulateAdjustment = {
    totalMultiplier: 1.0, baseMultiplier: 1.0, segmentDelta: 0, profile: null, resolvedCity: null,
  };

  const country = data.targetCountry;
  if (!country) return nullResult;

  const resolvedCity = findNearestConsulate(data.applicantCity, country);
  if (!resolvedCity) return nullResult;

  const consulateProfile = CONSULATE_MATRIX[country]?.[resolvedCity];
  if (!consulateProfile) return nullResult;

  const segment = resolveSegment(data);
  const segmentDelta = consulateProfile.segmentBonus[segment] ?? 0;
  const totalMultiplier = consulateProfile.multiplier + segmentDelta;

  return {
    totalMultiplier: Math.max(0.70, Math.min(1.20, totalMultiplier)),
    baseMultiplier: consulateProfile.multiplier,
    segmentDelta,
    profile: consulateProfile,
    resolvedCity,
  };
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
