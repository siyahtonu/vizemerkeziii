// ============================================================
// Çekirdek Puanlama Fonksiyonları
// App.tsx'ten modüler yapıya taşındı — ALGORİTMA v3.0
// ============================================================

import type { ProfileData } from '../types';
import { TR_REJECTION_RATES } from './matrices';
import { temporalDecay, getReturnTieMultiplier, getProfileCountryFactor, getConsulateAdjustment, resolveSegment } from './algorithms';
import { getSeasonalMultiplier } from './seasonal';

// ============================================================
// calculateRawScore: ülke kalibrasyonu öncesi ham skor (0-100)
// ============================================================
export const calculateRawScore = (data: ProfileData, simValue: number = 0): number => {
  let score = 10; // Temel başlangıç puanı

  // ─────────────────────────────────────────────────────────
  // BÖLÜM 1: FİNANSAL GÜÇ (Maks 28 puan)
  // ─────────────────────────────────────────────────────────

  if (data.bankSufficientBalance || simValue > 150000) score += 7;
  else if (simValue > 75000) score += 3;

  if (data.highSavingsAmount || simValue > 350000) score += 5;
  if (data.bankRegularity) score += 5;
  if (data.incomeSourceClear) score += 4;
  if (data.salaryDetected) score += 3;
  if (data.hasAssets) score += 3;
  if (data.hasRegularSpending && data.recurringExpensesDetected) score += 3;
  if (data.dailyBudgetSufficient) score += 4;

  // Finansal cezalar
  if (!data.hasRegularSpending) score -= 8;        // "Ölü hesap" — emanet şüphesi
  if (data.unusualLargeTransactions) score -= 5;   // Açıklanamayan hareketler
  if (data.monthlyInflow < data.monthlyOutflow && data.monthlyInflow > 0) score -= 6;

  // ─────────────────────────────────────────────────────────
  // BÖLÜM 2: İNGİLTERE ÖZEL KURALLAR
  // ─────────────────────────────────────────────────────────
  if (data.targetCountry === 'İngiltere') {
    if (data.has28DayHolding) score += 8;
    else score -= 12;

    if (data.has6MonthStatements) score += 6;
    else if (data.statementMonths >= 3) score += 2;
    else score -= 8;
  }

  // ─────────────────────────────────────────────────────────
  // BÖLÜM 3: MESLEKİ BAĞLILIK (Maks 22 puan)
  // v3.4: Segment-aware — emekli/öğrenci/sponsor için SGK yokluğu beklenen
  // ─────────────────────────────────────────────────────────
  const segment = resolveSegment(data);
  const expectsEmployment = segment === 'employed' || segment === 'public_sector' || segment === 'self_employed';

  if (data.hasSgkJob) score += 12;
  else if (expectsEmployment) score -= 5; // çalışan profil için SGK yok = #3 ret sebebi
  // emekli/öğrenci/sponsor/işsiz: SGK yokluğu beklenir, ceza yok

  if (data.isPublicSectorEmployee) score += 6;
  if (data.sgkEmployerLetterWithReturn) score += 5;

  // Kıdem değerlendirmesi: sadece SGK işi olan profiller için anlamlı
  if (data.hasSgkJob) {
    if (data.yearsInCurrentJob >= 3) score += 5;
    else if (data.yearsInCurrentJob === 2) score += 4;
    else if (data.yearsInCurrentJob === 1) score += 2;
    else score -= 4; // SGK var ama kıdem 0 = yeni iş riski
  }

  if (data.sgkAddressMatchesDs160) score += 2;
  if (data.hasBarcodeSgk) score += 2;

  // ─────────────────────────────────────────────────────────
  // BÖLÜM 4: ÇOK KATMANLI BAĞLAR (Maks 20 puan)
  // #2 Context-Aware Multiplier: yaş+profil bağ puanını kalibre eder
  // ─────────────────────────────────────────────────────────
  const activeTieCount = [
    data.tieCategories?.employment,
    data.tieCategories?.property,
    data.tieCategories?.family,
    data.tieCategories?.community,
    data.tieCategories?.education,
  ].filter(Boolean).length;

  if (data.tieCategories?.employment) score += 5;
  if (data.tieCategories?.property) score += 5;
  if (data.tieCategories?.family) score += 4;
  if (data.tieCategories?.community) score += 3;
  if (data.tieCategories?.education) score += 3;

  if (activeTieCount >= 4) score += 6;
  else if (activeTieCount === 3) score += 3;

  if (data.isMarried) score += 3;
  if (data.hasChildren) score += 3;
  if (data.isStudent) score += 2;
  if (data.strongFamilyTies) score += 1;
  if (data.hasSocialMediaFootprint) score += 2;

  // Context-aware çarpan: bağ kategorisi 0-1 ise ceza uygula (ancak profile göre ölçeklendir)
  if (activeTieCount === 0) {
    const tieMultiplier = getReturnTieMultiplier({
      age: data.applicantAge,
      isStudent: data.isStudent,
      isMarried: data.isMarried,
      hasChildren: data.hasChildren,
      hasSgkJob: data.hasSgkJob,
    });
    score -= Math.round(8 * tieMultiplier); // Temel -8, profile göre ±
  }

  // ─────────────────────────────────────────────────────────
  // BÖLÜM 5: SEYAHAT GEÇMİŞİ (Maks 20 puan)
  // #1 Temporal Decay: eski vize/ret olayları zamanla daha az ağırlık taşır
  // ─────────────────────────────────────────────────────────
  const visaDecay = temporalDecay(data.lastVisaYear, 0.20);
  if (data.hasHighValueVisa) score += Math.round(20 * visaDecay);
  else if (data.hasOtherVisa) score += Math.round(12 * visaDecay);
  else if (data.travelHistoryNonVisa) score += 6;

  if (!data.noOverstayHistory) score -= 45; // Süre aşımı → neredeyse kesin ret

  const refusalDecay = temporalDecay(data.lastRejectionYear, 0.35);
  if (data.hasPreviousRefusal && !data.previousRefusalDisclosed) score -= Math.round(20 * refusalDecay);
  if (data.hasPreviousRefusal && data.previousRefusalDisclosed) score -= Math.round(5 * refusalDecay);

  // ─────────────────────────────────────────────────────────
  // BÖLÜM 6: BAŞVURU KALİTESİ & NİYET KANITI (Maks 24 puan)
  // ─────────────────────────────────────────────────────────
  if (data.useOurTemplate) score += 5;
  if (data.hasInvitation) score += 3;
  if (data.paidReservations) score += 3;
  if (data.addressMatchSgk) score += 2;
  if (data.datesMatchReservations) score += 2;
  if (data.purposeClear) score += 6; // v2.5: +2 → +6 (Code 2 Türklerde #2 ret sebebi)
  if (data.hasReturnTicket) score += 3;
  if (!data.noFakeBooking) score -= 15; // Sahte rezervasyon = yasak listesi

  if (data.targetCountry === 'ABD') {
    if (data.interviewPrepared) score += 4;
    if (data.interviewConfidence === 'high') score += 3;
    else if (data.interviewConfidence === 'medium') score += 1;
    else score -= 2;
  }

  // ─────────────────────────────────────────────────────────
  // BÖLÜM 7: GÜVEN & BELGE KALİTESİ (Maks 12 puan)
  // ─────────────────────────────────────────────────────────
  if (data.hasValidPassport && data.passportConditionGood) score += 3;
  if (data.passportValidityLong) score += 3;
  if (data.documentConsistency) score += 3;
  if (data.cleanCriminalRecord) score += 3;

  // v2.5: Sigorta ağırlığı güncellendi (+4→+7, -10→-5)
  // Türk vakalarında %15 ret sebebi — min €30.000 teminat şartı
  if (data.hasHealthInsurance || data.hasTravelInsurance) score += 7;
  else if (data.targetCountry !== 'ABD' && data.targetCountry !== 'İngiltere') score -= 5;

  // ─────────────────────────────────────────────────────────
  // BÖLÜM 8: VETO — Kritik eşik aşıldığında skoru zorla kırp
  // v2.5: Son dakika mevduat Türklerde #1 ret sebebi (%43)
  // ─────────────────────────────────────────────────────────
  let vetoCap = 100;

  if (data.hasSuspiciousLargeDeposit) {
    // Eski: -10 ceza. v2.5: skor 30'un üzerine çıkamaz
    vetoCap = Math.min(vetoCap, 30);
  }
  if (!data.noOverstayHistory) {
    vetoCap = Math.min(vetoCap, 10);
  }

  score = Math.min(score, vetoCap);
  return Math.max(0, Math.min(score, 100));
};

// ============================================================
// calculateScore: Bayes blending ile kalibre edilmiş final skor
//
// Pipeline:
//   1. calculateRawScore     → ham profil puanı (0-100)
//   2. Bayes blending        → (raw/100)×0.65 + (1-trRejRate)×0.35
//   3. PROFILE_COUNTRY_MATRIX → ülke × segment çarpanı
//   4. CONSULATE_MATRIX (v3.1) → şehir × konsolosluk × segment kalibrasyonu
//      (applicantCity tanımlıysa; yoksa bu adım atlanır → geriye uyumlu)
//   5. SEASONAL_MULTIPLIER (v3.2) → ay × ülke × profil gücü kalibrasyonu
//      (applyMonth tanımlıysa; yoksa 1.0 → geriye uyumlu)
// ============================================================
export const calculateScore = (data: ProfileData, simValue: number = 0): number => {
  const raw = calculateRawScore(data, simValue);
  const trRejRate = TR_REJECTION_RATES[data.targetCountry] ?? 0.15;
  const blended = (raw / 100) * 0.65 + (1 - trRejRate) * 0.35;
  const countryFactor = getProfileCountryFactor(data);

  // Konsolosluk kalibrasyonu: sadece applicantCity varsa uygula
  let consulateFactor = 1.0;
  if (data.applicantCity) {
    const adj = getConsulateAdjustment(data);
    if (adj.profile !== null) {
      consulateFactor = 0.85 + 0.15 * adj.totalMultiplier;
    }
  }

  // Mevsimsellik kalibrasyonu (v3.2): applyMonth tanımlıysa uygula
  // Ağırlık: final skorda %8 belirleyici (hafif sinyal)
  // Formül: 0.92 (base) + 0.08 × seasonalMultiplier
  let seasonalFactor = 1.0;
  if (data.applyMonth) {
    const sm = getSeasonalMultiplier(
      data.targetCountry,
      Math.round(blended * countryFactor * consulateFactor * 100),
      data.applyMonth,
      data.applyYear,
    );
    seasonalFactor = 0.92 + 0.08 * sm;
  }

  return Math.max(0, Math.min(100, Math.round(blended * countryFactor * consulateFactor * seasonalFactor * 100)));
};

// ============================================================
// calculateScoreDetailed: Kalibrasyon katmanlarını ayrı döner
// UI'da "Neden bu skor?" breakdownı için kullanılır
// ============================================================
export interface ScoreBreakdown {
  rawScore:        number;   // Ham profil puanı
  blendedScore:    number;   // Bayes blending sonrası (0-1)
  countryFactor:   number;   // Profil-ülke matrisi çarpanı
  consulateFactor: number;   // Konsolosluk kalibrasyonu çarpanı
  seasonalFactor:  number;   // Mevsimsellik kalibrasyonu çarpanı
  finalScore:      number;   // Tüm katmanlar sonrası (0-100)
  consulateCity:   string | null;
  consulateMood:   string | null;
  consulateWaitDays: number | null;
}

export const calculateScoreDetailed = (data: ProfileData, simValue = 0): ScoreBreakdown => {
  const rawScore     = calculateRawScore(data, simValue);
  const trRejRate    = TR_REJECTION_RATES[data.targetCountry] ?? 0.15;
  const blendedScore = (rawScore / 100) * 0.65 + (1 - trRejRate) * 0.35;
  const countryFactor = getProfileCountryFactor(data);

  let consulateFactor = 1.0;
  let consulateCity: string | null = null;
  let consulateMood: string | null = null;
  let consulateWaitDays: number | null = null;

  if (data.applicantCity) {
    const adj = getConsulateAdjustment(data);
    if (adj.profile) {
      consulateFactor  = 0.85 + 0.15 * adj.totalMultiplier;
      consulateCity    = adj.resolvedCity;
      consulateMood    = adj.profile.mood;
      consulateWaitDays = adj.profile.appointmentWaitDays;
    }
  }

  let seasonalFactor = 1.0;
  if (data.applyMonth) {
    const sm = getSeasonalMultiplier(
      data.targetCountry,
      Math.round(blendedScore * countryFactor * consulateFactor * 100),
      data.applyMonth,
      data.applyYear,
    );
    seasonalFactor = 0.92 + 0.08 * sm;
  }

  return {
    rawScore,
    blendedScore,
    countryFactor,
    consulateFactor,
    seasonalFactor,
    finalScore: Math.max(0, Math.min(100, Math.round(blendedScore * countryFactor * consulateFactor * seasonalFactor * 100))),
    consulateCity,
    consulateMood,
    consulateWaitDays,
  };
};
