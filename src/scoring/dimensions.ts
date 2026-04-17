// ============================================================
// Boyut Skorları — 6 eksenli radar chart için
// Her boyut bağımsız 0-100 değer döndürür
// ============================================================
import type { ProfileData } from '../types';
import { temporalDecay, resolveSegment } from './algorithms';

export interface DimensionScores {
  financial:    number; // Finansal güç
  professional: number; // Mesleki bağlılık
  ties:         number; // Çok katmanlı bağlar
  travel:       number; // Seyahat geçmişi
  application:  number; // Başvuru kalitesi & niyet
  trust:        number; // Güven & belge kalitesi
}

// ─── Finansal (max 34 ham puan) ──────────────────────────────────────────────
const FIN_MAX = 34;
export function getFinancialScore(data: ProfileData): number {
  let pts = 0;
  if (data.bankSufficientBalance) pts += 7;
  if (data.highSavingsAmount)     pts += 5;
  if (data.bankRegularity)        pts += 5;
  if (data.incomeSourceClear)     pts += 4;
  if (data.salaryDetected)        pts += 3;
  if (data.hasAssets)             pts += 3;
  if (data.hasRegularSpending && data.recurringExpensesDetected) pts += 3;
  if (data.dailyBudgetSufficient) pts += 4;

  if (!data.hasRegularSpending) pts -= 8;
  if (data.unusualLargeTransactions) pts -= 5;
  if (data.monthlyInflow < data.monthlyOutflow && data.monthlyInflow > 0) pts -= 6;
  if (data.hasSuspiciousLargeDeposit) pts = Math.min(pts, 0);

  return Math.max(0, Math.min(100, Math.round((pts / FIN_MAX) * 100)));
}

// ─── Mesleki (max 32 ham puan) ───────────────────────────────────────────────
// Segment-aware: öğrenci/sponsor/55+ emekli profilleri SGK/yearsInCurrentJob
// cezasını almaz (core.ts ile tutarlı).
const PRO_MAX = 32;
export function getProfessionalScore(data: ProfileData): number {
  let pts = 0;
  // core.ts:54 ile birebir aynı: segment bazlı expectsEmployment
  const segment = resolveSegment(data);
  const expectsEmployment = segment === 'employed' || segment === 'public_sector' || segment === 'self_employed';

  if (data.hasSgkJob) {
    pts += 12;
    if (data.yearsInCurrentJob >= 3)       pts += 5;
    else if (data.yearsInCurrentJob === 2) pts += 4;
    else if (data.yearsInCurrentJob === 1) pts += 2;
    else                                    pts -= 4;
  } else if (expectsEmployment) {
    pts -= 5;
  }
  if (data.isPublicSectorEmployee)       pts += 6;
  if (data.sgkEmployerLetterWithReturn)  pts += 5;
  if (data.sgkAddressMatchesDs160)       pts += 2;
  if (data.hasBarcodeSgk)                pts += 2;

  return Math.max(0, Math.min(100, Math.round(((pts + 9) / (PRO_MAX + 9)) * 100)));
}

// ─── Bağlar (max 37 ham puan) ────────────────────────────────────────────────
const TIES_MAX = 37;
export function getTiesScore(data: ProfileData): number {
  let pts = 0;
  const cats = data.tieCategories;
  if (cats?.employment) pts += 5;
  if (cats?.property)   pts += 5;
  if (cats?.family)     pts += 4;
  if (cats?.community)  pts += 3;
  if (cats?.education)  pts += 3;
  const active = [cats?.employment, cats?.property, cats?.family, cats?.community, cats?.education]
    .filter(Boolean).length;
  if (active >= 4) pts += 6;
  else if (active === 3) pts += 3;
  if (data.isMarried)             pts += 3;
  if (data.hasChildren)           pts += 3;
  if (data.isStudent)             pts += 2;
  if (data.strongFamilyTies)      pts += 1;
  if (data.hasSocialMediaFootprint) pts += 2;

  return Math.max(0, Math.min(100, Math.round((pts / TIES_MAX) * 100)));
}

// ─── Seyahat (max 20 ham puan) ───────────────────────────────────────────────
const TRAVEL_MAX = 20;
export function getTravelScore(data: ProfileData): number {
  if (!data.noOverstayHistory) return 0; // veto

  let pts = 0;
  const vDecay = temporalDecay(data.lastVisaYear, 0.20);
  if (data.hasHighValueVisa)       pts += Math.round(20 * vDecay);
  else if (data.hasOtherVisa)      pts += Math.round(12 * vDecay);
  else if (data.travelHistoryNonVisa) pts += 6;

  const rDecay = temporalDecay(data.lastRejectionYear, 0.35);
  if (data.hasPreviousRefusal && !data.previousRefusalDisclosed) pts -= Math.round(10 * rDecay);
  if (data.hasPreviousRefusal &&  data.previousRefusalDisclosed) pts -= Math.round(3  * rDecay);

  return Math.max(0, Math.min(100, Math.round((pts / TRAVEL_MAX) * 100)));
}

// ─── Başvuru Kalitesi (max 24 ham puan) ──────────────────────────────────────
const APP_MAX = 24;
export function getApplicationScore(data: ProfileData): number {
  let pts = 0;
  if (data.useOurTemplate)          pts += 5;
  if (data.purposeClear)            pts += 6;
  if (data.paidReservations)        pts += 3;
  if (data.hasReturnTicket)         pts += 3;
  if (data.hasInvitation)           pts += 3;
  if (data.datesMatchReservations)  pts += 2;
  if (data.addressMatchSgk)         pts += 2; // core.ts Bölüm 6 ile tutarlılık
  if (!data.noFakeBooking)          pts -= 15; // sahte rezervasyon veto

  return Math.max(0, Math.min(100, Math.round((pts / APP_MAX) * 100)));
}

// ─── Güven & Belge (max 19 ham puan) ─────────────────────────────────────────
const TRUST_MAX = 19;
export function getTrustScore(data: ProfileData): number {
  let pts = 0;
  if (data.hasValidPassport && data.passportConditionGood) pts += 3;
  if (data.passportValidityLong)   pts += 3;
  if (data.documentConsistency)    pts += 3;
  if (data.cleanCriminalRecord)    pts += 3;
  if (data.hasHealthInsurance || data.hasTravelInsurance) pts += 7;

  return Math.max(0, Math.min(100, Math.round((pts / TRUST_MAX) * 100)));
}

// ─── Ana fonksiyon ───────────────────────────────────────────────────────────
export function getDimensionScores(data: ProfileData): DimensionScores {
  return {
    financial:    getFinancialScore(data),
    professional: getProfessionalScore(data),
    ties:         getTiesScore(data),
    travel:       getTravelScore(data),
    application:  getApplicationScore(data),
    trust:        getTrustScore(data),
  };
}

export const DIMENSION_LABELS: Record<keyof DimensionScores, string> = {
  financial:    'Finansal',
  professional: 'Mesleki',
  ties:         'Bağlar',
  travel:       'Seyahat',
  application:  'Başvuru',
  trust:        'Güven',
};

export const DIMENSION_TIPS: Record<keyof DimensionScores, string> = {
  financial:    'Banka düzenliliği, yeterli bakiye ve gelir kaynağı',
  professional: 'SGK, işveren mektubu, kıdem',
  ties:         'Mülk, aile, iş, sosyal ve eğitim bağları',
  travel:       'Önceki vizeler ve seyahat geçmişi',
  application:  'Niyet mektubu, rezervasyon ve tarih tutarlılığı',
  trust:        'Pasaport, sigorta ve belge kalitesi',
};
