// ============================================================
// Tutarlılık Testleri: rejectionRiskV2 ↔ core.ts / dimensions.ts
// Amaç: aynı profil için iki algoritmanın çelişmediğini doğrulamak.
// ============================================================
import { describe, test, expect } from 'vitest';
import { calculateRejectionRisk } from '../rejectionRiskV2';
import { BASE_PROFILE } from '../../scoring/__tests__/fixtures';
import type { ProfileData } from '../../types';

const p = (patch: Partial<ProfileData>): ProfileData => ({ ...BASE_PROFILE, ...patch });

describe('rejectionRiskV2 — core.ts ile işaret tutarlılığı', () => {
  test('hasSocialMediaFootprint pozitif sinyal olmalı (core.ts +2 ile aynı yön)', () => {
    // 2025 konsolosluk kuralı: beyan edilen sosyal medya handle'ı gerçek kimlik sinyali.
    const without = calculateRejectionRisk(p({ hasSocialMediaFootprint: false }));
    const withIt  = calculateRejectionRisk(p({ hasSocialMediaFootprint: true  }));

    const beforeTravel = without.factors.find(f => f.key === 'travelHistory')!;
    const afterTravel  = withIt.factors.find(f => f.key === 'travelHistory')!;
    expect(afterTravel.score).toBeGreaterThanOrEqual(beforeTravel.score);
  });
});

describe('rejectionRiskV2 — segment-aware tutarlılık', () => {
  test('Emekli profili (55+, hasAssets=true, SGK yok) için "SGK yok" issue ÇIKMAMALI', () => {
    const retired = p({
      hasSgkJob: false,
      isPublicSectorEmployee: false,
      isStudent: false,
      hasAssets: true,
      applicantAge: 62,
      tieCategories: { employment: false, property: true, family: true, community: false, education: false },
    });
    const res = calculateRejectionRisk(retired);
    const returnTies = res.factors.find(f => f.key === 'returnTies')!;
    expect(returnTies.issues.some(i => i.includes('SGK kaydı'))).toBe(false);
  });

  test('Öğrenci profili için "SGK yok" ve "taşınmaz yok" issue ÇIKMAMALI', () => {
    const student = p({
      hasSgkJob: false,
      isStudent: true,
      hasAssets: false,
      applicantAge: 22,
      tieCategories: { employment: false, property: false, family: true, community: false, education: true },
    });
    const res = calculateRejectionRisk(student);
    const returnTies = res.factors.find(f => f.key === 'returnTies')!;
    expect(returnTies.issues.some(i => i.includes('SGK kaydı'))).toBe(false);
    expect(returnTies.issues.some(i => i.includes('taşınmaz yok'))).toBe(false);
  });

  test('Sponsor profili için "İşveren mektubu" issue ÇIKMAMALI', () => {
    const sponsoree = p({
      hasSponsor: true,
      hasSgkJob: false,
      isPublicSectorEmployee: false,
      sgkEmployerLetterWithReturn: false,
    });
    const res = calculateRejectionRisk(sponsoree);
    const docs = res.factors.find(f => f.key === 'documents')!;
    expect(docs.issues.some(i => i.includes('İşveren mektubu'))).toBe(false);
    expect(docs.issues.some(i => i.includes('Barkodlu SGK'))).toBe(false);
  });
});

describe('rejectionRiskV2 — insurance UK/ABD muafiyeti (core.ts:165 ile tutarlı)', () => {
  test('Schengen için sigorta yoksa puan sıfır', () => {
    const schengen = calculateRejectionRisk(p({
      targetCountry: 'Almanya',
      hasHealthInsurance: false,
      hasTravelInsurance: false,
    }));
    const ins = schengen.factors.find(f => f.key === 'insurance')!;
    expect(ins.score).toBe(0);
  });

  test('ABD için sigorta yoksa tam 0 değil (zorunlu değil)', () => {
    const abd = calculateRejectionRisk(p({
      targetCountry: 'ABD',
      hasHealthInsurance: false,
      hasTravelInsurance: false,
    }));
    const ins = abd.factors.find(f => f.key === 'insurance')!;
    expect(ins.score).toBeGreaterThan(0);
  });

  test('İngiltere için sigorta yoksa tam 0 değil', () => {
    const uk = calculateRejectionRisk(p({
      targetCountry: 'İngiltere',
      hasHealthInsurance: false,
      hasTravelInsurance: false,
    }));
    const ins = uk.factors.find(f => f.key === 'insurance')!;
    expect(ins.score).toBeGreaterThan(0);
  });
});

describe('rejectionRiskV2 — finansal proxy (salaryDetected / hasSgkJob → hasSteadyIncome)', () => {
  test('SGK işi olan biri için "Sabit gelir kanıtlanamıyor" issue çıkmamalı', () => {
    const emp = p({
      hasSgkJob: true,
      hasSteadyIncome: false, // kullanıcı doldurmadı
      salaryDetected: false,
    });
    const res = calculateRejectionRisk(emp);
    const fin = res.factors.find(f => f.key === 'financial')!;
    expect(fin.issues.some(i => i.includes('Sabit gelir'))).toBe(false);
  });
});

describe('rejectionRiskV2 — monotonluk (doc checklist fixlerinin etkisi)', () => {
  test('hasHealthInsurance: false → true sigorta skorunu yükseltir', () => {
    const without = calculateRejectionRisk(p({ hasHealthInsurance: false, hasTravelInsurance: false, targetCountry: 'Almanya' }));
    const withIt  = calculateRejectionRisk(p({ hasHealthInsurance: true,  hasTravelInsurance: false, targetCountry: 'Almanya' }));
    const sBefore = without.factors.find(f => f.key === 'insurance')!.score;
    const sAfter  = withIt.factors.find(f => f.key === 'insurance')!.score;
    expect(sAfter).toBeGreaterThan(sBefore);
  });

  test('documentConsistency: false → true evrak skorunu yükseltir', () => {
    const before = calculateRejectionRisk(p({ documentConsistency: false }));
    const after  = calculateRejectionRisk(p({ documentConsistency: true  }));
    const sB = before.factors.find(f => f.key === 'documents')!.score;
    const sA = after.factors.find(f => f.key === 'documents')!.score;
    expect(sA).toBeGreaterThan(sB);
  });

  test('noFakeBooking: false → true sahte rezervasyon vetosunu kaldırır', () => {
    const fake = calculateRejectionRisk(p({ noFakeBooking: false }));
    const real = calculateRejectionRisk(p({ noFakeBooking: true  }));
    expect(fake.vetoes.length).toBeGreaterThan(real.vetoes.length);
  });
});
