// ============================================================
// docChecklist — fixture-based birim testler
// ============================================================
// Pure function: buildSections(profile) profilinin boolean'larına göre
// koşullu section'lar üretir. Bu test'ler farklı profil kombinasyonları
// için section listelerini ve kritik belge varlığını doğrular.

import { describe, expect, test } from 'vitest';
import { buildSections, type DocChecklistProfile } from '../docChecklist';

// ── Fixture'lar ─────────────────────────────────────────────────────────
const baseProfile: DocChecklistProfile = {
  targetCountry: 'Almanya',
  hasSteadyIncome: false,
  salaryDetected: false,
  hasAssets: false,
  hasSgkJob: false,
  isPublicSectorEmployee: false,
  isStudent: false,
  isMarried: false,
  hasChildren: false,
  hasPreviousRefusal: false,
};

const sgkEmployedSchengen: DocChecklistProfile = {
  ...baseProfile,
  targetCountry: 'Almanya',
  hasSgkJob: true,
  hasSteadyIncome: true,
  salaryDetected: true,
  isMarried: true,
};

const studentUk: DocChecklistProfile = {
  ...baseProfile,
  targetCountry: 'İngiltere',
  isStudent: true,
};

const retiredSchengen: DocChecklistProfile = {
  ...baseProfile,
  targetCountry: 'Yunanistan',
  hasSgkJob: false,
  hasAssets: true,
  applicantAge: 62,
};

const usaB2: DocChecklistProfile = {
  ...baseProfile,
  targetCountry: 'ABD',
  hasSgkJob: true,
  hasSteadyIncome: true,
};

const refusedSchengen: DocChecklistProfile = {
  ...baseProfile,
  targetCountry: 'Almanya',
  hasPreviousRefusal: true,
};

const sponsoredApplicant: DocChecklistProfile = {
  ...baseProfile,
  targetCountry: 'Almanya',
  hasSponsor: true,
};

// ── Tests ───────────────────────────────────────────────────────────────
describe('buildSections — profil bazlı belge listesi', () => {
  test('temel Schengen başvurucusu için Zorunlu + Finansal section\'ları gelir', () => {
    const sections = buildSections(baseProfile);
    const titles = sections.map((s) => s.title);
    expect(titles).toContain('Zorunlu Belgeler');
    expect(titles).toContain('Finansal Belgeler');
  });

  test('Schengen için "Konsolosluğa hitaben niyet mektubu" var', () => {
    const sections = buildSections(baseProfile);
    const allItems = sections.flatMap((s) => s.items.map((i) => i.text));
    expect(allItems.some((t) => t.includes('niyet mektubu'))).toBe(true);
  });

  test('ABD profilinde sağlık sigortası ZORUNLU listede DEĞİL', () => {
    const sections = buildSections(usaB2);
    const allItems = sections.flatMap((s) => s.items.map((i) => i.text));
    expect(allItems.some((t) => t.toLowerCase().includes('sağlık sigortası'))).toBe(false);
  });

  test('ABD profilinde DS-160 ve mülakat zorunlu listededir', () => {
    const sections = buildSections(usaB2);
    const allItems = sections.flatMap((s) => s.items.map((i) => i.text));
    expect(allItems.some((t) => t.includes('DS-160'))).toBe(true);
    expect(allItems.some((t) => t.toLowerCase().includes('mülakat'))).toBe(true);
  });

  test('UK profilinde 6 aylık banka dökümü gerekir (3 değil)', () => {
    const sections = buildSections(studentUk);
    const allItems = sections.flatMap((s) => s.items.map((i) => i.text));
    expect(allItems.some((t) => t.includes('6 aylık'))).toBe(true);
    expect(allItems.some((t) => t.includes('3 aylık'))).toBe(false);
  });

  test('UK profilinde 28 gün bakiyesi gerekir', () => {
    const sections = buildSections(studentUk);
    const allItems = sections.flatMap((s) => s.items.map((i) => i.text));
    expect(allItems.some((t) => t.includes('28 gün'))).toBe(true);
  });

  test('SGK\'lı çalışan profilinde "Mesleki Belgeler" gelir', () => {
    const sections = buildSections(sgkEmployedSchengen);
    const titles = sections.map((s) => s.title);
    expect(titles).toContain('Mesleki Belgeler');
  });

  test('Öğrenci profilinde "Öğrenci Belgeleri" gelir, Mesleki gelmez', () => {
    const sections = buildSections(studentUk);
    const titles = sections.map((s) => s.title);
    expect(titles).toContain('Öğrenci Belgeleri');
    expect(titles).not.toContain('Mesleki Belgeler');
  });

  test('Emekli profilinde (yaş>=55, hasAssets, !hasSgkJob) "Emeklilik Belgeleri" gelir', () => {
    const sections = buildSections(retiredSchengen);
    const titles = sections.map((s) => s.title);
    expect(titles).toContain('Emeklilik Belgeleri');
  });

  test('Sponsor profilinde "Sponsor Belgeleri" gelir', () => {
    const sections = buildSections(sponsoredApplicant);
    const titles = sections.map((s) => s.title);
    expect(titles).toContain('Sponsor Belgeleri');
  });

  test('Önceki ret beyan: "Önceki ret mektubu fotokopisi" item olmalı', () => {
    const sections = buildSections(refusedSchengen);
    const allItems = sections.flatMap((s) => s.items.map((i) => i.text));
    expect(allItems.some((t) => t.includes('Önceki ret mektubu'))).toBe(true);
  });

  test('Evli profilde "Evlilik cüzdanı fotokopisi" zorunlu', () => {
    const sections = buildSections({ ...baseProfile, isMarried: true });
    const allItems = sections.flatMap((s) => s.items.map((i) => i.text));
    expect(allItems.some((t) => t.includes('Evlilik cüzdanı'))).toBe(true);
  });

  test('Hasteady income veya salary detected ise maaş bordrosu eklenir', () => {
    const sections = buildSections({ ...baseProfile, hasSteadyIncome: true });
    const allItems = sections.flatMap((s) => s.items.map((i) => i.text));
    expect(allItems.some((t) => t.includes('maaş bordrosu'))).toBe(true);
  });

  test('hasAssets true ise tapu kalemi eklenir', () => {
    const sections = buildSections({ ...baseProfile, hasAssets: true });
    const allItems = sections.flatMap((s) => s.items.map((i) => i.text));
    expect(allItems.some((t) => t.includes('Tapu'))).toBe(true);
  });

  test('Tüm section\'larda en az 1 item vardır', () => {
    const sections = buildSections(sgkEmployedSchengen);
    for (const s of sections) {
      expect(s.items.length).toBeGreaterThan(0);
    }
  });

  test('Required + conditional status doğru atanır', () => {
    const sections = buildSections(sgkEmployedSchengen);
    const allItems = sections.flatMap((s) => s.items);
    expect(allItems.every((i) => i.status === 'required' || i.status === 'conditional')).toBe(true);
  });
});
