// ============================================================
// core.ts — Unit Testler
// calculateRawScore & calculateScore
// ============================================================
import { describe, test, expect } from 'vitest';
import { calculateRawScore, calculateScore, computeVetoCap, getCascadeStatus, isSchengenTarget } from '../core';
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

  test('v3.8: 5 yıl önceki ret hâlâ belirgin ceza taşır (REFUSAL lambda=0.10)', () => {
    // Eski lambda=0.35 ile 5 yıl önceki undisclosed ret cezası ~-3'e düşüyordu.
    // Yeni lambda=0.10 ile decay ≈ 0.606 → penalty = round(20 * 0.606) = 12.
    // Temiz profil ile arasında en az 8 puan fark olmalı (ret hâlâ ağırlıklı).
    const clean = calculateRawScore(p({ hasPreviousRefusal: false, lastRejectionYear: -1 }));
    const fiveYearOldRefusal = calculateRawScore(p({
      hasPreviousRefusal: true, previousRefusalDisclosed: false,
      lastRejectionYear: thisYear - 5,
    }));
    expect(clean - fiveYearOldRefusal).toBeGreaterThanOrEqual(8);
  });

  test('v3.8: vize onay decay < ret decay (retler daha yavaş erir)', () => {
    // Onay 8 yıl önce → neredeyse unutulmuş.
    // Ret 8 yıl önce → hâlâ hissedilir cezası var.
    const oldVisaOnly = calculateRawScore(p({
      hasHighValueVisa: true, lastVisaYear: thisYear - 8,
      hasPreviousRefusal: false,
    }));
    const oldRefusalOnly = calculateRawScore(p({
      hasHighValueVisa: false, lastVisaYear: -1,
      hasPreviousRefusal: true, previousRefusalDisclosed: false,
      lastRejectionYear: thisYear - 8,
    }));
    // 8 yaşındaki onay +4 puan civarı (20 * e^-1.6 ≈ 4).
    // 8 yaşındaki ret -9 puan civarı (20 * e^-0.8 ≈ 9) — hâlâ ciddi ceza.
    expect(oldRefusalOnly).toBeLessThan(oldVisaOnly - 10);
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

// ── calculateScore (Lineer Kalibrasyon) ─────────────────────────────────────
describe('calculateScore — lineer kalibrasyon', () => {
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

  test('lineer kalibrasyon: raw=0 bile pozitif skor üretebilir (ülke etkisi)', () => {
    // Çok kötü bir profil bile %35 ülke başarı katkısından fayda sağlar
    const worst = calculateScore(p({
      hasSuspiciousLargeDeposit: true,
      noOverstayHistory: true,
      targetCountry: 'Yunanistan',
    }));
    expect(worst).toBeGreaterThanOrEqual(0);
  });
});

// ── Veto cap pipeline'ın SONUNDA uygulanır (Katman 2-5 aşamaz) ─────────────
describe('computeVetoCap & final pipeline tavanı', () => {
  test('computeVetoCap: temiz profil → 100', () => {
    expect(computeVetoCap(BASE_PROFILE)).toBe(100);
  });

  test('computeVetoCap: son dakika mevduat → 30', () => {
    expect(computeVetoCap(p({ hasSuspiciousLargeDeposit: true }))).toBe(30);
  });

  test('computeVetoCap: overstay → 10 (en sert tavan kazanır)', () => {
    expect(computeVetoCap(p({ hasSuspiciousLargeDeposit: true, noOverstayHistory: false }))).toBe(10);
  });

  test('final skor son dakika mevduat tavanını aşamaz (Yunanistan gibi düşük ret oranlı ülke bile)', () => {
    // Yunanistan ret oranı ~%10 → (1-0.10)*0.35 = 0.315 baz katkı.
    // Eski pipeline: raw=30 kapansa bile blend sonrası ~49'a çıkabiliyordu.
    // Yeni pipeline: final min(calibrated, vetoCap) → ≤ 30.
    const s = calculateScore(p({
      hasSuspiciousLargeDeposit: true,
      targetCountry: 'Yunanistan',
    }));
    expect(s).toBeLessThanOrEqual(30);
  });

  test('final skor overstay tavanını aşamaz', () => {
    const s = calculateScore(p({
      noOverstayHistory: false,
      targetCountry: 'Yunanistan',
    }));
    expect(s).toBeLessThanOrEqual(10);
  });
});

// ── Cascade Kuralı (v3.9 — C(2025) 4694) ─────────────────────────────────
describe('Cascade kuralı (getCascadeStatus)', () => {
  test('isSchengenTarget: Schengen ülkeleri ayırt edilir', () => {
    expect(isSchengenTarget('Almanya')).toBe(true);
    expect(isSchengenTarget('Yunanistan')).toBe(true);
    expect(isSchengenTarget('İngiltere')).toBe(false);
    expect(isSchengenTarget('ABD')).toBe(false);
  });

  test('non-Schengen hedef → eligible=false, bonus=0', () => {
    const st = getCascadeStatus(p({
      targetCountry: 'ABD', schengenVisasLast3Years: 3,
    }));
    expect(st.eligible).toBe(false);
    expect(st.bonus).toBe(0);
    expect(st.disqualifier).toBe('non_schengen');
  });

  test('schengenVisasLast3Years = 0 veya tanımsız → bonus=0', () => {
    expect(getCascadeStatus(p({ targetCountry: 'Almanya' })).bonus).toBe(0);
    expect(getCascadeStatus(p({ targetCountry: 'Almanya', schengenVisasLast3Years: 0 })).bonus).toBe(0);
  });

  test('2 yasal Schengen + temiz → tier 3, bonus=7', () => {
    const st = getCascadeStatus(p({
      targetCountry: 'İtalya',
      schengenVisasLast3Years: 2,
      noOverstayHistory: true,
      hasPreviousRefusal: false,
    }));
    expect(st.eligible).toBe(true);
    expect(st.tier).toBe(3);
    expect(st.bonus).toBe(7);
  });

  test('3+ yasal Schengen → tier 4, bonus=10', () => {
    const st = getCascadeStatus(p({
      targetCountry: 'Almanya',
      schengenVisasLast3Years: 4,
      noOverstayHistory: true,
      hasPreviousRefusal: false,
    }));
    expect(st.tier).toBe(4);
    expect(st.bonus).toBe(10);
  });

  test('overstay cascade haklarını iptal eder (eligible=false, bonus=0)', () => {
    const st = getCascadeStatus(p({
      targetCountry: 'İtalya',
      schengenVisasLast3Years: 3,
      noOverstayHistory: false,
    }));
    expect(st.eligible).toBe(false);
    expect(st.bonus).toBe(0);
    expect(st.disqualifier).toBe('overstay');
  });

  test('gizlenmiş ret → eligible=false', () => {
    const st = getCascadeStatus(p({
      targetCountry: 'İtalya',
      schengenVisasLast3Years: 2,
      hasPreviousRefusal: true,
      previousRefusalDisclosed: false,
    }));
    expect(st.eligible).toBe(false);
    expect(st.disqualifier).toBe('refusal');
  });

  test('beyan edilmiş ret bonusu yarıya indirir (2 Schengen: 7 → 4)', () => {
    const st = getCascadeStatus(p({
      targetCountry: 'İtalya',
      schengenVisasLast3Years: 2,
      hasPreviousRefusal: true,
      previousRefusalDisclosed: true,
    }));
    expect(st.eligible).toBe(true);
    expect(st.bonus).toBe(4); // Math.round(7/2)
  });

  test('calculateRawScore: 2 Schengen kullanımı skoru belirgin artırır (+≥6)', () => {
    const clean  = calculateRawScore(p({
      targetCountry: 'Almanya', schengenVisasLast3Years: 0,
    }));
    const cascade = calculateRawScore(p({
      targetCountry: 'Almanya', schengenVisasLast3Years: 2,
    }));
    expect(cascade - clean).toBeGreaterThanOrEqual(6);
  });

  test('calculateScore: non-Schengen hedefte cascade bonusu uygulanmaz', () => {
    const withField = calculateScore(p({
      targetCountry: 'ABD', schengenVisasLast3Years: 3,
    }));
    const without   = calculateScore(p({
      targetCountry: 'ABD', schengenVisasLast3Years: 0,
    }));
    expect(withField).toBe(without);
  });
});
