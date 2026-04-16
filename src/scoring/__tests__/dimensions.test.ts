// ============================================================
// dimensions.ts — Unit Testler
// getDimensionScores ve her alt fonksiyon
// ============================================================
import { describe, test, expect } from 'vitest';
import {
  getDimensionScores,
  getFinancialScore,
  getProfessionalScore,
  getTiesScore,
  getTravelScore,
  getApplicationScore,
  getTrustScore,
} from '../dimensions';
import { BASE_PROFILE } from './fixtures';
import type { ProfileData } from '../../types';

const p = (patch: Partial<ProfileData>): ProfileData => ({ ...BASE_PROFILE, ...patch });

// ── getDimensionScores ────────────────────────────────────────────────────────
describe('getDimensionScores', () => {
  test('6 boyut dondurur', () => {
    const d = getDimensionScores(BASE_PROFILE);
    expect(Object.keys(d)).toHaveLength(6);
    expect(d).toHaveProperty('financial');
    expect(d).toHaveProperty('professional');
    expect(d).toHaveProperty('ties');
    expect(d).toHaveProperty('travel');
    expect(d).toHaveProperty('application');
    expect(d).toHaveProperty('trust');
  });

  test('her boyut 0-100 arasinda', () => {
    const d = getDimensionScores(BASE_PROFILE);
    Object.values(d).forEach(v => {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(100);
    });
  });

  test('guclu profil tum boyutlarda yuksek skor', () => {
    const thisYear = new Date().getFullYear();
    const strong = p({
      bankRegularity: true, bankSufficientBalance: true, highSavingsAmount: true,
      salaryDetected: true, hasAssets: true, hasRegularSpending: true,
      recurringExpensesDetected: true, dailyBudgetSufficient: true,
      incomeSourceClear: true, unusualLargeTransactions: false,
      hasSuspiciousLargeDeposit: false,
      hasSgkJob: true, isPublicSectorEmployee: true,
      sgkEmployerLetterWithReturn: true, yearsInCurrentJob: 5,
      hasHighValueVisa: true, lastVisaYear: thisYear - 1,
      noOverstayHistory: true, hasPreviousRefusal: false,
      purposeClear: true, useOurTemplate: true, paidReservations: true,
      hasReturnTicket: true, datesMatchReservations: true, noFakeBooking: true,
      hasValidPassport: true, passportConditionGood: true, passportValidityLong: true,
      documentConsistency: true, cleanCriminalRecord: true,
      hasHealthInsurance: true,
      tieCategories: { employment: true, property: true, family: true, community: true, education: false },
      isMarried: true, hasChildren: true,
    });
    const d = getDimensionScores(strong);
    // En az 4/6 boyut 60+ olmali
    const highCount = Object.values(d).filter(v => v >= 60).length;
    expect(highCount).toBeGreaterThanOrEqual(4);
  });
});

// ── getFinancialScore ────────────────────────────────────────────────────────
describe('getFinancialScore', () => {
  test('tum pozitifler -> yuksek skor (>70)', () => {
    const s = getFinancialScore(p({
      bankSufficientBalance: true, highSavingsAmount: true, bankRegularity: true,
      incomeSourceClear: true, salaryDetected: true, hasAssets: true,
      hasRegularSpending: true, recurringExpensesDetected: true,
      dailyBudgetSufficient: true, unusualLargeTransactions: false,
      monthlyInflow: 20000, monthlyOutflow: 10000,
    }));
    expect(s).toBeGreaterThan(70);
  });

  test('son dakika mevduat -> 0', () => {
    expect(getFinancialScore(p({ hasSuspiciousLargeDeposit: true }))).toBe(0);
  });

  test('olu hesap (hasRegularSpending=false) ciddi duser', () => {
    const with_spending    = getFinancialScore(p({ hasRegularSpending: true  }));
    const without_spending = getFinancialScore(p({ hasRegularSpending: false }));
    expect(with_spending).toBeGreaterThan(without_spending);
  });

  test('gider > gelir -> ceza', () => {
    const healthy  = getFinancialScore(p({ monthlyInflow: 20000, monthlyOutflow: 10000 }));
    const inverted = getFinancialScore(p({ monthlyInflow: 5000,  monthlyOutflow: 10000 }));
    expect(healthy).toBeGreaterThan(inverted);
  });
});

// ── getProfessionalScore ─────────────────────────────────────────────────────
describe('getProfessionalScore', () => {
  test('SGK + kamu + kidem -> yuksek skor', () => {
    const s = getProfessionalScore(p({
      hasSgkJob: true, isPublicSectorEmployee: true,
      sgkEmployerLetterWithReturn: true, yearsInCurrentJob: 5,
      sgkAddressMatchesDs160: true, hasBarcodeSgk: true,
    }));
    expect(s).toBeGreaterThan(80);
  });

  test('SGK yok -> dusuyor', () => {
    const with_sgk    = getProfessionalScore(p({ hasSgkJob: true  }));
    const without_sgk = getProfessionalScore(p({ hasSgkJob: false }));
    expect(with_sgk).toBeGreaterThan(without_sgk);
  });

  test('kidem arttikca skor artar', () => {
    const s1 = getProfessionalScore(p({ yearsInCurrentJob: 1 }));
    const s3 = getProfessionalScore(p({ yearsInCurrentJob: 3 }));
    expect(s3).toBeGreaterThanOrEqual(s1);
  });
});

// ── getTiesScore ─────────────────────────────────────────────────────────────
describe('getTiesScore', () => {
  test('4 kategori -> 1 kategoriden yuksek', () => {
    const four = getTiesScore(p({
      tieCategories: { employment: true, property: true, family: true, community: true, education: false },
    }));
    const one = getTiesScore(p({
      tieCategories: { employment: true, property: false, family: false, community: false, education: false },
    }));
    expect(four).toBeGreaterThan(one);
  });

  test('evli + cocuklu -> skor artar', () => {
    const base_score = getTiesScore(p({ isMarried: false, hasChildren: false }));
    const family     = getTiesScore(p({ isMarried: true,  hasChildren: true  }));
    expect(family).toBeGreaterThan(base_score);
  });

  test('tum baglar dolu -> 100e yakin', () => {
    const full = getTiesScore(p({
      tieCategories: { employment: true, property: true, family: true, community: true, education: true },
      isMarried: true, hasChildren: true, isStudent: false, strongFamilyTies: true, hasSocialMediaFootprint: true,
    }));
    expect(full).toBeGreaterThan(80);
  });
});

// ── getTravelScore ────────────────────────────────────────────────────────────
describe('getTravelScore', () => {
  const thisYear = new Date().getFullYear();

  test('suresi asimi -> 0 (veto)', () => {
    expect(getTravelScore(p({ noOverstayHistory: false }))).toBe(0);
  });

  test('yeni guclui vize yuksek skor', () => {
    const s = getTravelScore(p({
      hasHighValueVisa: true, lastVisaYear: thisYear - 1,
      noOverstayHistory: true, hasPreviousRefusal: false,
    }));
    expect(s).toBeGreaterThan(60);
  });

  test('eski vize < yeni vize (temporal decay)', () => {
    const recent = getTravelScore(p({ hasHighValueVisa: true, lastVisaYear: thisYear - 1 }));
    const old    = getTravelScore(p({ hasHighValueVisa: true, lastVisaYear: thisYear - 8 }));
    expect(recent).toBeGreaterThan(old);
  });

  test('gizlenen ret < beyan edilen ret (daha az ceza)', () => {
    const disclosed   = getTravelScore(p({ hasPreviousRefusal: true, previousRefusalDisclosed: true,  lastRejectionYear: thisYear - 2 }));
    const undisclosed = getTravelScore(p({ hasPreviousRefusal: true, previousRefusalDisclosed: false, lastRejectionYear: thisYear - 2 }));
    expect(disclosed).toBeGreaterThanOrEqual(undisclosed);
  });
});

// ── getApplicationScore ───────────────────────────────────────────────────────
describe('getApplicationScore', () => {
  test('tam basvuru paketi -> yuksek skor', () => {
    const s = getApplicationScore(p({
      useOurTemplate: true, purposeClear: true, paidReservations: true,
      hasReturnTicket: true, hasInvitation: true, datesMatchReservations: true,
      noFakeBooking: true,
    }));
    expect(s).toBeGreaterThan(80);
  });

  test('sahte rezervasyon -> 0 veya cok dusuk', () => {
    const s = getApplicationScore(p({ noFakeBooking: false }));
    expect(s).toBe(0);
  });

  test('niyet mektubu eksik -> skor duser', () => {
    const with_letter    = getApplicationScore(p({ purposeClear: true,  useOurTemplate: true  }));
    const without_letter = getApplicationScore(p({ purposeClear: false, useOurTemplate: false }));
    expect(with_letter).toBeGreaterThan(without_letter);
  });
});

// ── getTrustScore ─────────────────────────────────────────────────────────────
describe('getTrustScore', () => {
  test('tam guven profili -> yuksek skor (>80)', () => {
    const s = getTrustScore(p({
      hasValidPassport: true, passportConditionGood: true, passportValidityLong: true,
      documentConsistency: true, cleanCriminalRecord: true, hasHealthInsurance: true,
    }));
    expect(s).toBeGreaterThan(80);
  });

  test('sigorta en buyuk katki (7 puan)', () => {
    const with_ins    = getTrustScore(p({ hasHealthInsurance: true  }));
    const without_ins = getTrustScore(p({ hasHealthInsurance: false, hasTravelInsurance: false }));
    expect(with_ins).toBeGreaterThan(without_ins + 20); // 7/19 ~ +37pp
  });
});
