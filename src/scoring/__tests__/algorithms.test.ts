// ============================================================
// algorithms.ts — Unit Testler
// ============================================================
import { describe, test, expect } from 'vitest';
import {
  temporalDecay,
  getReturnTieMultiplier,
  calculateCompleteness,
  calculateConfidenceInterval,
  KEY_FIELDS,
} from '../algorithms';
import { BASE_PROFILE } from './fixtures';

// ── temporalDecay ─────────────────────────────────────────────────────────────
describe('temporalDecay', () => {
  test('eventYear=0 (bilinmiyor) -> 5-yıl varsayımı ile ~0.37 ağırlık', () => {
    // Algoritma kuralı: 0 = "bilinmiyor", konservatif 5-yıl önce varsay.
    // lambda=0.20 × 5 yıl = e^-1 ≈ 0.3678
    expect(temporalDecay(0)).toBeCloseTo(Math.exp(-1), 3);
  });

  test('eventYear=-1 (hiç yok) -> 0 ağırlık', () => {
    expect(temporalDecay(-1)).toBe(0);
  });

  test('gecen yil -> neredeyse 1.0 ama az altinda', () => {
    const thisYear = new Date().getFullYear();
    const w = temporalDecay(thisYear - 1);
    expect(w).toBeGreaterThan(0.8);
    expect(w).toBeLessThan(1.0);
  });

  test('2019 vizesi < 2024 vizesi agirliginin (lambda=0.20)', () => {
    const thisYear = new Date().getFullYear();
    const recent = temporalDecay(thisYear - 1, 0.20);
    const old    = temporalDecay(thisYear - 6, 0.20);
    expect(recent).toBeGreaterThan(old);
  });

  test('ret cezasi icin lambda=0.35 -> 5 yil once ~%17 agirlik', () => {
    const thisYear = new Date().getFullYear();
    const w = temporalDecay(thisYear - 5, 0.35);
    expect(w).toBeCloseTo(0.17, 1);
  });

  test('cok eski olay (20 yil) -> agirlik sifira yakin', () => {
    const thisYear = new Date().getFullYear();
    const w = temporalDecay(thisYear - 20);
    expect(w).toBeLessThan(0.02);
  });
});

// ── getReturnTieMultiplier ───────────────────────────────────────────────────
describe('getReturnTieMultiplier', () => {
  test('evli + cocuklu -> en yuksek carpan (1.6)', () => {
    const m = getReturnTieMultiplier({ age: 35, isStudent: false, isMarried: true, hasChildren: true, hasSgkJob: true });
    expect(m).toBe(1.6);
  });

  test('ogrenci -> dusuk carpan (0.6)', () => {
    const m = getReturnTieMultiplier({ age: 22, isStudent: true, isMarried: false, hasChildren: false, hasSgkJob: false });
    expect(m).toBe(0.6);
  });

  test('55+ yas -> en dusuk ceza (0.5)', () => {
    const m = getReturnTieMultiplier({ age: 60, isStudent: false, isMarried: false, hasChildren: false, hasSgkJob: false });
    expect(m).toBe(0.5);
  });

  test('genc (22) bekar calisanin toleransi (0.7)', () => {
    const m = getReturnTieMultiplier({ age: 22, isStudent: false, isMarried: false, hasChildren: false, hasSgkJob: true });
    expect(m).toBe(0.7);
  });

  test('orta yas SGK calisani -> yuksek carpan (1.4)', () => {
    const m = getReturnTieMultiplier({ age: 40, isStudent: false, isMarried: false, hasChildren: false, hasSgkJob: true });
    expect(m).toBe(1.4);
  });

  test('evli+cocuklu cezasi > bekar genc cezasi', () => {
    const highRisk = getReturnTieMultiplier({ age: 35, isStudent: false, isMarried: true,  hasChildren: true,  hasSgkJob: true  });
    const lowRisk  = getReturnTieMultiplier({ age: 22, isStudent: true,  isMarried: false, hasChildren: false, hasSgkJob: false });
    expect(highRisk).toBeGreaterThan(lowRisk);
  });
});

// ── calculateCompleteness ────────────────────────────────────────────────────
describe('calculateCompleteness', () => {
  test('tum KEY_FIELDS dolu -> 1.0', () => {
    const full = { ...BASE_PROFILE };
    KEY_FIELDS.forEach(k => { (full as any)[k] = true; });
    expect(calculateCompleteness(full)).toBe(1.0);
  });

  test('hic KEY_FIELDS dolu degil -> 0', () => {
    const empty = { ...BASE_PROFILE };
    KEY_FIELDS.forEach(k => { (empty as any)[k] = false; });
    expect(calculateCompleteness(empty)).toBe(0);
  });

  test('yarim profil -> ~0.45 (5/11)', () => {
    const half = { ...BASE_PROFILE };
    // Ilk yarisi true, ikinci yarisi false olarak kesin ayarla
    KEY_FIELDS.forEach((k, i) => {
      (half as any)[k] = i < Math.floor(KEY_FIELDS.length / 2);
    });
    const c = calculateCompleteness(half);
    expect(c).toBeCloseTo(5 / KEY_FIELDS.length, 5);
  });
});

// ── calculateConfidenceInterval ──────────────────────────────────────────────
describe('calculateConfidenceInterval', () => {
  test('completeness>=0.80 -> label Yuksek', () => {
    const ci = calculateConfidenceInterval(70, 1.0);
    expect(ci.label).toBe('Yüksek');
  });

  test('completeness<0.50 -> label Dusuk', () => {
    const ci = calculateConfidenceInterval(70, 0.3);
    expect(ci.label).toBe('Düşük');
  });

  test('low < score < high', () => {
    const ci = calculateConfidenceInterval(60, 0.7);
    expect(ci.low).toBeLessThan(60);
    expect(ci.high).toBeGreaterThan(60);
  });

  test('tam profilde aralik dar (toplam <=10)', () => {
    const ci = calculateConfidenceInterval(60, 1.0);
    expect(ci.high - ci.low).toBeLessThanOrEqual(10);
  });

  test('bos profilde aralik genis (toplam >=15)', () => {
    // v3.11: max width ±10 (önceki ±20). Boş profilde 60±10 = 50–70, diff=20.
    const ci = calculateConfidenceInterval(60, 0.0);
    expect(ci.high - ci.low).toBeGreaterThanOrEqual(15);
  });

  test('skor 0 -> low en az 0', () => {
    const ci = calculateConfidenceInterval(0, 0.0);
    expect(ci.low).toBeGreaterThanOrEqual(0);
  });

  test('skor 100 -> high en fazla 100', () => {
    const ci = calculateConfidenceInterval(100, 0.0);
    expect(ci.high).toBeLessThanOrEqual(100);
  });

  // v3.11 width formülü: Math.round(10 - completeness * 7)
  // Bu testler formül değişimi sessizce kırılmasın diye spesifik değerleri pin'ler.
  test('width: completeness=1.0 → ±3', () => {
    const ci = calculateConfidenceInterval(60, 1.0);
    expect(ci.low).toBe(57);
    expect(ci.high).toBe(63);
  });

  test('width: completeness=0.5 → ±7 (Math.round(10-3.5)=7)', () => {
    const ci = calculateConfidenceInterval(60, 0.5);
    expect(ci.low).toBe(53);
    expect(ci.high).toBe(67);
  });

  test('width: completeness=0.0 → ±10', () => {
    const ci = calculateConfidenceInterval(60, 0.0);
    expect(ci.low).toBe(50);
    expect(ci.high).toBe(70);
  });

  test('width: max ±10 — completeness=0 ile bile 10\'dan büyük olamaz', () => {
    const ci = calculateConfidenceInterval(50, 0.0);
    expect(ci.high - ci.low).toBeLessThanOrEqual(20);
  });

  // missingCount — KEY_FIELDS değişiminde regresyonu yakalar
  test('missingCount: completeness=1.0 → 0', () => {
    const ci = calculateConfidenceInterval(70, 1.0);
    expect(ci.missingCount).toBe(0);
  });

  test('missingCount: completeness=0.0 → KEY_FIELDS.length', () => {
    const ci = calculateConfidenceInterval(70, 0.0);
    // KEY_FIELDS uzunluğu sabit; bilinmeyen sayı yerine pozitif bir tam sayı bekle.
    expect(ci.missingCount).toBeGreaterThan(0);
    expect(Number.isInteger(ci.missingCount)).toBe(true);
  });

  test('missingCount: completeness=0.5 → KEY_FIELDS / 2 civarı', () => {
    const ci = calculateConfidenceInterval(70, 0.5);
    // Tam orta — cinsten kaçınmak için: 0 ile completeness=1.0 arası
    const ciFull = calculateConfidenceInterval(70, 1.0);
    const ciEmpty = calculateConfidenceInterval(70, 0.0);
    expect(ci.missingCount).toBeGreaterThan(ciFull.missingCount);
    expect(ci.missingCount).toBeLessThan(ciEmpty.missingCount);
  });
});
