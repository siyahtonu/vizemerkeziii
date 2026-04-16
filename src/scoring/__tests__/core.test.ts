// ============================================================
// core.ts — Unit Testler
// calculateRawScore & calculateScore
// ============================================================
import { describe, test, expect } from 'vitest';
import { calculateRawScore, calculateScore } from '../core';
import { BASE_PROFILE } from './fixtures';
import type { ProfileData } from '../../types';

// Yardımcı: BASE_PROFILE üzerine patch uygula
const p = (patch: Partial<ProfileData>): ProfileData => ({ ...BASE_PROFILE, ...patch });

// ── Temel Sağlık ─────────────────────────────────────────────────────────────
describe('calculateRawScore — temel', () => {
  test('skor 0-100 aralığında kalır', () => {
    const s = calculateRawScore(BASE_PROFILE);
    expect(s).toBeGreaterThanOrEqual(0);
    expect(s).toBeLessThanOrEqual(100);
  });

  test('boş profil → düşük ama negatif değil', () => {
    const empty: ProfileData = {
      ...BASE_PROFILE,
      bankRegularity: false,
      bankSufficientBalance: false,
      hasRegularSpending: false,
      hasSgkJob: false,
      hasTravelInsurance: false,
      hasHealthInsurance: false,
      noOverstayHistory: true,
      noFakeBooking: true,
      hasValidPassport: false,
      documentConsistency: false,
      cleanCriminalRecord: false,
      purposeClear: false,
      tieCategories: { employment: false, property: false, family: false, community: false, education: false },
    };
    const s = calculateRawScore(empty);
    expect(s).toBeGreaterThanOrEqual(0);
    expect(s).toBeLessThan(40);
  });
});

// ── Monotonluk (Pozitif Alan Ekleme Skoru Düşürmemeli) ───────────────────────
describe('calculateRawScore — monotonluk', () => {
  const positiveFields: Array<keyof ProfileData> = [
    'bankRegularity', 'bankSufficientBalance', 'highSavingsAmount',
    'salaryDetected', 'hasAssets', 'hasSgkJob', 'isPublicSectorEmployee',
    'sgkEmployerLetterWithReturn', 'purposeClear', 'paidReservations',
    'hasReturnTicket', 'hasHealthInsurance', 'documentConsistency',
    'cleanCriminalRecord', 'hasValidPassport',
  ];

  positiveFields.forEach(field => {
    test(`${field}=true eklenmesi skoru düşürmemeli`, () => {
      const base  = p({ [field]: false });
      const boost = p({ [field]: true });
      expect(calculateRawScore(boost)).toBeGreaterThanOrEqual(calculateRawScore(base) - 1);
    });
  });
});

// ── Finansal Kurallar ─────────────────────────────────────────────────────────
describe('calculateRawScore — finansal', () => {
  test('yüksek banka bakiyesi (simValue>150000) → bakiye düşük profilden yüksek', () => {
    const low  = calculateRawScore(p({ bankSufficientBalance: false }), 0);
    const high = calculateRawScore(p({ bankSufficientBalance: false }), 200000);
    expect(high).toBeGreaterThan(low);
  });

  test('ölü hesap (hasRegularSpending=false) → ciddi ceza (-8)', () => {
    const with_spending    = calculateRawScore(p({ hasRegularSpending: true }));
    const without_spending = calculateRawScore(p({ hasRegularSpending: false }));
    expect(with_spending).toBeGreaterThan(without_spending + 6);
  });

  test('gider > gelir → ceza uygulanır', () => {
    const healthy  = calculateRawScore(p({ monthlyInflow: 15000, monthlyOutflow: 10000 }));
    const inverted = calculateRawScore(p({ monthlyInflow: 5000,  monthlyOutflow: 10000 }));
    expect(healthy).toBeGreaterThan(inverted);
  });
});

// ── VETO Kuralları ────────────────────────────────────────────────────────────
describe('calculateRawScore — veto', () => {
  test('son dakika mevduat → skor 30\'un üzerine çıkamaz', () => {
    const s = calculateRawScore(p({ hasSuspiciousLargeDeposit: true }));
    expect(s).toBeLessThanOrEqual(30);
  });

  test('süre aşımı → skor 10\'un üzerine çıkamaz', () => {
    const s = calculateRawScore(p({ noOverstayHistory: false }));
    expect(s).toBeLessThanOrEqual(10);
  });

  test('sahte rezervasyon → büyük ceza (-15)', () => {
    const real = calculateRawScore(p({ noFakeBooking: true }));
    const fake = calculateRawScore(p({ noFakeBooking: false }));
    expect(real).toBeGreaterThan(fake + 10);
  });

  test('hem mevduat hem süre aşımı → skor 10 veya altı', () => {
    const s = calculateRawScore(p({ hasSuspiciousLargeDeposit: true, noOverstayHistory: false }));
    expect(s).toBeLessThanOrEqual(10);
  });
});

// ── Temporal Decay (Seyahat Geçmişi) ────────────────────────────────────────
describe('calculateRawScore — temporal decay', () => {
  const thisYear = new Date().getFullYear();

  test('yeni vize (geçen yıl) > eski vize (6 yıl önce)', () => {
    const recent = calculateRawScore(p({ hasHighValueVisa: true, lastVisaYear: thisYear - 1 }));
    const old    = calculateRawScore(p({ hasHighValueVisa: true, lastVisaYear: thisYear - 6 }));
    expect(recent).toBeGreaterThan(old);
  });

  test('gizlenen ret cezası > beyan edilen ret cezası', () => {
    const disclosed  = calculateRawScore(p({ hasPreviousRefusal: true, previousRefusalDisclosed: true,  lastRejectionYear: thisYear - 2 }));
    const undisclosed = calculateRawScore(p({ hasPreviousRefusal: true, previousRefusalDisclosed: false, lastRejectionYear: thisYear - 2 }));
    expect(disclosed).toBeGreaterThan(undisclosed);
  });

  test('5 yıl önceki ret < 1 yıl önceki ret cezası (decay)', () => {
    const old    = calculateRawScore(p({ hasPreviousRefusal: true, previousRefusalDisclosed: false, lastRejectionYear: thisYear - 5 }));
    const recent = calculateRawScore(p({ hasPreviousRefusal: true, previousRefusalDisclosed: false, lastRejectionYear: thisYear - 1 }));
    expect(old).toBeGreaterThan(recent); // eski ret daha az ceza
  });
});

// ── Context Multiplier (Bağ Cezası) ──────────────────────────────────────────
describe('calculateRawScore — context multiplier', () => {
  const noTies = {
    tieCategories: { employment: false, property: false, family: false, community: false, education: false },
    isMarried: false, hasChildren: false,
  };

  test('22 yaş öğrenci bağsız → 45 yaş aile babası bağsız\'dan yüksek skor', () => {
    const youngStudent = calculateRawScore(p({
      ...noTies,
      isStudent: true,  applicantAge: 22,
      isMarried: false, hasChildren: false,
    }));
    const familyFather = calculateRawScore(p({
      ...noTies,
      isStudent: false, applicantAge: 45,
      isMarried: true,  hasChildren: true,
    }));
    expect(youngStudent).toBeGreaterThan(familyFather);
  });

  test('4 bağ kategorisi → 1 bağ kategorisinden yüksek', () => {
    const fourTies = calculateRawScore(p({
      tieCategories: { employment: true, property: true, family: true, community: true, education: false },
    }));
    const oneTie = calculateRawScore(p({
      tieCategories: { employment: true, property: false, family: false, community: false, education: false },
    }));
    expect(fourTies).toBeGreaterThan(oneTie);
  });
});

// ── İngiltere Özel Kurallar ───────────────────────────────────────────────────
describe('calculateRawScore — İngiltere', () => {
  const ukBase = p({ targetCountry: 'İngiltere' });

  test('28 gün bekleme var → yok\'tan yüksek', () => {
    const with28    = calculateRawScore(p({ targetCountry: 'İngiltere', has28DayHolding: true }));
    const without28 = calculateRawScore(p({ targetCountry: 'İngiltere', has28DayHolding: false }));
    expect(with28).toBeGreaterThan(without28);
  });

  test('6 aylık ekstre → 3 aylıktan yüksek', () => {
    const sixMonth   = calculateRawScore(p({ targetCountry: 'İngiltere', has6MonthStatements: true,  statementMonths: 6 }));
    const threeMonth = calculateRawScore(p({ targetCountry: 'İngiltere', has6MonthStatements: false, statementMonths: 3 }));
    expect(sixMonth).toBeGreaterThan(threeMonth);
  });
});

// ── calculateScore (Bayes Blending) ─────────────────────────────────────────
describe('calculateScore — Bayes blending', () => {
  test('0-100 aralığında kalır', () => {
    const s = calculateScore(BASE_PROFILE);
    expect(s).toBeGreaterThanOrEqual(0);
    expect(s).toBeLessThanOrEqual(100);
  });

  test('Yunanistan skoru > Danimarka skoru (aynı profil, düşük vs yüksek ret oranı)', () => {
    const greece  = calculateScore(p({ targetCountry: 'Yunanistan' }));
    const denmark = calculateScore(p({ targetCountry: 'Danimarka' }));
    expect(greece).toBeGreaterThan(denmark);
  });

  test('kamu çalışanı Almanya skoru > serbest meslek Almanya skoru', () => {
    const publicSector = calculateScore(p({ targetCountry: 'Almanya', isPublicSectorEmployee: true,  hasSgkJob: true }));
    const selfEmployed = calculateScore(p({ targetCountry: 'Almanya', isPublicSectorEmployee: false, hasSgkJob: false, hasAssets: true }));
    expect(publicSector).toBeGreaterThan(selfEmployed);
  });

  test('Bayes blending: raw=0 bile pozitif skor üretebilir (ülke etkisi)', () => {
    // Çok kötü bir profil bile %35 ülke başarı katkısından fayda sağlar
    const worst = calculateScore(p({
      hasSuspiciousLargeDeposit: true,
      noOverstayHistory: true,
      targetCountry: 'Yunanistan',
    }));
    expect(worst).toBeGreaterThanOrEqual(0);
  });
});
