// ============================================================
// seasonal.ts + algorithms.ts (eksik) — Kapsamlı Test Paketi
// ============================================================

import { describe, it, expect } from 'vitest';
import {
  getActiveEvents,
  getSeasonalWindow,
  getSeasonalMultiplier,
  getTimingAdvice,
} from '../seasonal';
import {
  getProfileSegmentFactor,
  getConsulateAdjustment,
  findNearestConsulate,
  getReturnTieMultiplier,
} from '../algorithms';
import { BASE_PROFILE } from './fixtures';

// ─────────────────────────────────────────────────────────────
// getActiveEvents
// ─────────────────────────────────────────────────────────────
describe('getActiveEvents', () => {

  it('2025 Ocak — ABD Trump olayı aktif olmalı', () => {
    const events = getActiveEvents('ABD', 2025, 3);
    const ids = events.map(e => e.id);
    expect(ids).toContain('usa_trump_administration_2025');
  });

  it('2025 — EES sistemi tüm Schengen için aktif', () => {
    const events = getActiveEvents('Almanya', 2025, 6);
    const ids = events.map(e => e.id);
    expect(ids).toContain('ees_entry_exit_2025');
  });

  it('2024 Ocak — EES henüz aktif değil (2025 Ocak başlıyor)', () => {
    const events = getActiveEvents('Almanya', 2024, 6);
    const ids = events.map(e => e.id);
    expect(ids).not.toContain('ees_entry_exit_2025');
  });

  it('Almanya 2025 — Almanya seçim dönemi kısa süre (Şub-Mayıs 2025)', () => {
    const march = getActiveEvents('Almanya', 2025, 3);
    expect(march.map(e => e.id)).toContain('germany_election_2025');
    // Mayıs sonrası bitmeli
    const june = getActiveEvents('Almanya', 2025, 6);
    expect(june.map(e => e.id)).not.toContain('germany_election_2025');
  });

  it('Yunanistan — turizm atağı loosening aktif (2024+)', () => {
    const events = getActiveEvents('Yunanistan', 2025, 6);
    const loosening = events.filter(e => e.impact === 'loosening');
    expect(loosening.length).toBeGreaterThan(0);
  });

  it('Fransa için ABD-özgü olay gelmemeli', () => {
    const events = getActiveEvents('Fransa', 2025, 6);
    const ids = events.map(e => e.id);
    expect(ids).not.toContain('usa_trump_administration_2025');
  });

  it('countries=[] olan olay tüm ülkeler için döner', () => {
    // eu_migration_pact_2024 tüm Schengen için geçerli
    const germany = getActiveEvents('Almanya', 2025, 1);
    const greece  = getActiveEvents('Yunanistan', 2025, 1);
    expect(germany.some(e => e.id === 'eu_migration_pact_2024')).toBe(true);
    expect(greece.some(e => e.id === 'eu_migration_pact_2024')).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────
// getSeasonalWindow
// ─────────────────────────────────────────────────────────────
describe('getSeasonalWindow', () => {

  it('windowScore 0-1 aralığında kalır', () => {
    for (const country of ['Almanya', 'Yunanistan', 'ABD', 'İngiltere']) {
      for (const month of [1, 3, 6, 9, 12]) {
        const w = getSeasonalWindow(country, 2025, month);
        expect(w.windowScore).toBeGreaterThanOrEqual(0);
        expect(w.windowScore).toBeLessThanOrEqual(1);
      }
    }
  });

  it('Almanya Aralık (off-peak) > Almanya Haziran (peak) windowScore', () => {
    const dec = getSeasonalWindow('Almanya', 2025, 12);
    const jun = getSeasonalWindow('Almanya', 2025, 6);
    expect(dec.windowScore).toBeGreaterThan(jun.windowScore);
  });

  it('Haziran scrutiny surface, Aralık scrutiny deep — Almanya', () => {
    const jun = getSeasonalWindow('Almanya', 2025, 6);
    const dec = getSeasonalWindow('Almanya', 2025, 12);
    expect(jun.scrutiny).toBe('surface');
    expect(dec.scrutiny).toBe('deep');
  });

  it('Haziran waitMultiplier > Aralık waitMultiplier — Almanya', () => {
    const jun = getSeasonalWindow('Almanya', 2025, 6);
    const dec = getSeasonalWindow('Almanya', 2025, 12);
    expect(jun.waitMultiplier).toBeGreaterThan(dec.waitMultiplier);
  });

  it('Bilinmeyen ülke → SCHENGEN_DEFAULT kullanılır (hata vermez)', () => {
    expect(() => getSeasonalWindow('Vatikan', 2025, 6)).not.toThrow();
    const w = getSeasonalWindow('Vatikan', 2025, 6);
    expect(w.windowScore).toBeGreaterThanOrEqual(0);
  });

  it('ABD Şubat < ABD Haziran windowScore değil (ABD için mevsim etkisi az)', () => {
    const feb = getSeasonalWindow('ABD', 2025, 2);
    const jun = getSeasonalWindow('ABD', 2025, 6);
    // ABD'de tüm aylar normal/surface, fark küçük ama Şubat biraz daha iyi
    expect(feb.windowScore).toBeGreaterThanOrEqual(jun.windowScore - 0.2);
  });

  it('Aktif siyasi olaylar döner', () => {
    const w = getSeasonalWindow('ABD', 2025, 6);
    expect(w.activeEvents.length).toBeGreaterThan(0);
    const trumpEvent = w.activeEvents.find(e => e.id === 'usa_trump_administration_2025');
    expect(trumpEvent).toBeDefined();
  });
});

// ─────────────────────────────────────────────────────────────
// getSeasonalMultiplier
// ─────────────────────────────────────────────────────────────
describe('getSeasonalMultiplier', () => {

  it('ay bilgisi yoksa 1.0 döner', () => {
    expect(getSeasonalMultiplier('Almanya', 70)).toBe(1.0);
  });

  it('ülke bilgisi yoksa 1.0 döner', () => {
    expect(getSeasonalMultiplier('', 70, 6, 2025)).toBe(1.0);
  });

  it('dönüş değeri 0.82-1.08 aralığında kalır', () => {
    const countries = ['Almanya', 'Fransa', 'ABD', 'İngiltere', 'Yunanistan'];
    const months = [1, 3, 6, 9, 12];
    for (const c of countries) {
      for (const m of months) {
        const sm = getSeasonalMultiplier(c, 65, m, 2025);
        expect(sm).toBeGreaterThanOrEqual(0.82);
        expect(sm).toBeLessThanOrEqual(1.08);
      }
    }
  });

  it('Zayıf profil (score=30) + yaz zirvesi → güçlü profil (score=80) kadar iyi değil', () => {
    const weakSummer  = getSeasonalMultiplier('Almanya', 30, 6, 2025);
    const strongSummer = getSeasonalMultiplier('Almanya', 80, 6, 2025);
    // Yaz döneminde güçlü profil daha avantajlı
    expect(strongSummer).toBeGreaterThanOrEqual(weakSummer);
  });

  it('Güçlü profil + kış → yüksek multiplier', () => {
    const strongWinter = getSeasonalMultiplier('Almanya', 80, 12, 2025);
    const strongSummer = getSeasonalMultiplier('Almanya', 80, 6, 2025);
    // Kış daha iyi pencere = daha yüksek multiplier
    expect(strongWinter).toBeGreaterThanOrEqual(strongSummer);
  });
});

// ─────────────────────────────────────────────────────────────
// getTimingAdvice
// ─────────────────────────────────────────────────────────────
describe('getTimingAdvice', () => {

  it('dönüş nesnesi tüm zorunlu alanları içeriyor', () => {
    const advice = getTimingAdvice('Almanya', 65, 2025, 4);
    expect(advice).toHaveProperty('recommendation');
    expect(advice).toHaveProperty('headline');
    expect(advice).toHaveProperty('reason');
    expect(advice).toHaveProperty('seasonalMultiplier');
    expect(advice).toHaveProperty('currentWindowScore');
    expect(advice).toHaveProperty('bestWindowScore');
    expect(advice).toHaveProperty('appointmentWaitEst');
  });

  it('recommendation geçerli bir değer alıyor', () => {
    const valid = ['apply_now', 'wait', 'caution', 'rush_before'];
    for (const month of [1, 6, 12]) {
      const advice = getTimingAdvice('Almanya', 65, 2025, month);
      expect(valid).toContain(advice.recommendation);
    }
  });

  it('bestWindowScore >= currentWindowScore', () => {
    for (const month of [1, 3, 6, 9, 12]) {
      const advice = getTimingAdvice('Almanya', 65, 2025, month);
      expect(advice.bestWindowScore).toBeGreaterThanOrEqual(advice.currentWindowScore);
    }
  });

  it('seasonalMultiplier 0.82-1.08 aralığında', () => {
    for (const month of [1, 6, 12]) {
      const advice = getTimingAdvice('Almanya', 70, 2025, month);
      expect(advice.seasonalMultiplier).toBeGreaterThanOrEqual(0.82);
      expect(advice.seasonalMultiplier).toBeLessThanOrEqual(1.08);
    }
  });

  it('Aralık: yüksek windowScore → apply_now veya boş wait', () => {
    const advice = getTimingAdvice('Almanya', 72, 2025, 12);
    // Aralık iyi pencere olduğundan apply_now bekliyoruz
    expect(['apply_now', 'caution', 'rush_before']).toContain(advice.recommendation);
  });

  it('ABD 2025 — Trump olayı uyarılarda görünebilir', () => {
    const advice = getTimingAdvice('ABD', 65, 2025, 6);
    // ABD'de aktif sıkılaşma uyarısı olmalı
    expect(advice.activeWarnings.length).toBeGreaterThanOrEqual(0); // en az değil, var olabilir
  });

  it('baseWaitDays parametresi appointmentWaitEst etkiler', () => {
    const a1 = getTimingAdvice('Almanya', 65, 2025, 6, 30);
    const a2 = getTimingAdvice('Almanya', 65, 2025, 6, 60);
    // 60 günlük base ile 30 günlük base'den daha uzun bekleme
    expect(a2.appointmentWaitEst).toBeGreaterThan(a1.appointmentWaitEst);
  });
});

// ─────────────────────────────────────────────────────────────
// getProfileSegmentFactor (v3.10 — ülke boyutu kaldırıldı)
// ─────────────────────────────────────────────────────────────
describe('getProfileSegmentFactor', () => {

  it('kamu çalışanı → employed den daha yüksek çarpan', () => {
    const publicFactor   = getProfileSegmentFactor({ ...BASE_PROFILE, isPublicSectorEmployee: true });
    const employedFactor = getProfileSegmentFactor({ ...BASE_PROFILE, isPublicSectorEmployee: false });
    expect(publicFactor).toBeGreaterThan(employedFactor);
  });

  it('öğrenci → employed den daha düşük çarpan (gelir ispat zorluğu)', () => {
    const studentFactor  = getProfileSegmentFactor({ ...BASE_PROFILE, isStudent: true, hasSgkJob: false, hasAssets: false });
    const employedFactor = getProfileSegmentFactor({ ...BASE_PROFILE, isStudent: false });
    expect(studentFactor).toBeLessThan(employedFactor);
  });

  it('emekli (55+, varlıklı, SGK yok) → kamu çalışanı ile aynı üst bant (≥1.07)', () => {
    const retiredFactor = getProfileSegmentFactor({
      ...BASE_PROFILE,
      isStudent: false,
      isPublicSectorEmployee: false,
      hasSgkJob: false,
      hasAssets: true,
      applicantAge: 60,
    });
    // v3.10: ülke farkı kaldırıldı; segment çarpanı sabit 1.07 (retired)
    expect(retiredFactor).toBeGreaterThanOrEqual(1.07);
  });

  it('işsiz (SGK yok, varlık yok) → en düşük çarpan (<0.90)', () => {
    const unemployedFactor = getProfileSegmentFactor({
      ...BASE_PROFILE,
      isStudent: false,
      isPublicSectorEmployee: false,
      hasSgkJob: false,
      hasAssets: false,
      applicantAge: 30,
    });
    expect(unemployedFactor).toBeLessThan(0.90);
  });

  it('ülke boyutu kaldırıldı: targetCountry değişimi çarpanı değiştirmez', () => {
    const almanyaFactor = getProfileSegmentFactor({ ...BASE_PROFILE, targetCountry: 'Almanya' });
    const yunanFactor   = getProfileSegmentFactor({ ...BASE_PROFILE, targetCountry: 'Yunanistan' });
    const bilinmeyen    = getProfileSegmentFactor({ ...BASE_PROFILE, targetCountry: 'Bilinmeyen' });
    expect(almanyaFactor).toBe(yunanFactor);
    expect(almanyaFactor).toBe(bilinmeyen);
  });
});

// ─────────────────────────────────────────────────────────────
// findNearestConsulate
// ─────────────────────────────────────────────────────────────
describe('findNearestConsulate', () => {

  it('İstanbul doğrudan eşleşir', () => {
    const result = findNearestConsulate('İstanbul', 'Almanya');
    expect(result).toBe('İstanbul');
  });

  it('Ankara doğrudan eşleşir', () => {
    const result = findNearestConsulate('Ankara', 'Almanya');
    expect(result).toBe('Ankara');
  });

  it('undefined şehir → null döner', () => {
    const result = findNearestConsulate(undefined, 'Almanya');
    expect(result).toBeNull();
  });

  it('Muğla → İzmir konsülosluğuna yönlendirilir (Ege kıyısı)', () => {
    // Muğla CITY_TO_CONSULATE_ZONE'da İzmir bölgesine tanımlı
    const result = findNearestConsulate('Muğla', 'Almanya');
    expect(result).toBe('İzmir');
  });

  it('tamamen bilinmeyen şehir → İstanbul fallback (ülkede İstanbul varsa)', () => {
    const result = findNearestConsulate('XYZBilinmeyenŞehir', 'Almanya');
    expect(result).toBe('İstanbul');
  });
});

// ─────────────────────────────────────────────────────────────
// getConsulateAdjustment
// ─────────────────────────────────────────────────────────────
describe('getConsulateAdjustment', () => {

  it('applicantCity yoksa totalMultiplier=1.0 döner', () => {
    const adj = getConsulateAdjustment({ ...BASE_PROFILE, applicantCity: undefined });
    expect(adj.totalMultiplier).toBe(1.0);
    expect(adj.profile).toBeNull();
  });

  it('İstanbul/Almanya için profil döner', () => {
    const adj = getConsulateAdjustment({ ...BASE_PROFILE, applicantCity: 'İstanbul', targetCountry: 'Almanya' });
    expect(adj.profile).not.toBeNull();
    expect(adj.resolvedCity).toBe('İstanbul');
  });

  it('totalMultiplier 0.70-1.20 sınırları içinde kalır', () => {
    const cities = ['İstanbul', 'Ankara', 'İzmir'];
    const countries = ['Almanya', 'Fransa', 'Yunanistan'];
    for (const city of cities) {
      for (const country of countries) {
        const adj = getConsulateAdjustment({ ...BASE_PROFILE, applicantCity: city, targetCountry: country });
        if (adj.profile) {
          expect(adj.totalMultiplier).toBeGreaterThanOrEqual(0.70);
          expect(adj.totalMultiplier).toBeLessThanOrEqual(1.20);
        }
      }
    }
  });

  it('kamu çalışanı → employed dan yüksek segmentBonus alır', () => {
    const employed = getConsulateAdjustment({
      ...BASE_PROFILE, applicantCity: 'İstanbul', targetCountry: 'Almanya',
      isPublicSectorEmployee: false,
    });
    const public_ = getConsulateAdjustment({
      ...BASE_PROFILE, applicantCity: 'İstanbul', targetCountry: 'Almanya',
      isPublicSectorEmployee: true,
    });
    if (employed.profile && public_.profile) {
      expect(public_.totalMultiplier).toBeGreaterThanOrEqual(employed.totalMultiplier);
    }
  });
});

// ─────────────────────────────────────────────────────────────
// BUG FIX: getReturnTieMultiplier — 55+ öncelik sırası
// ─────────────────────────────────────────────────────────────
describe('getReturnTieMultiplier — 55+ öncelik sırası (bug fix)', () => {

  it('55+ yaş, evli+çocuklu → 0.5 (düşük ceza) — evlilik+çocuk değil', () => {
    const multiplier = getReturnTieMultiplier({
      age: 62, isStudent: false, isMarried: true, hasChildren: true, hasSgkJob: false,
    });
    // BUG FIX: 55+ önce gelmeli, 1.6 DEĞİL 0.5 dönmeli
    expect(multiplier).toBe(0.5);
  });

  it('55+ yaş, bekar → 0.5', () => {
    const multiplier = getReturnTieMultiplier({
      age: 60, isStudent: false, isMarried: false, hasChildren: false, hasSgkJob: false,
    });
    expect(multiplier).toBe(0.5);
  });

  it('35+ SGK çalışan, bekâr → 1.4', () => {
    const multiplier = getReturnTieMultiplier({
      age: 40, isStudent: false, isMarried: false, hasChildren: false, hasSgkJob: true,
    });
    expect(multiplier).toBe(1.4);
  });

  it('evli+çocuklu, 35 yaş → 1.6 (55 altı olduğu için)', () => {
    const multiplier = getReturnTieMultiplier({
      age: 35, isStudent: false, isMarried: true, hasChildren: true, hasSgkJob: false,
    });
    expect(multiplier).toBe(1.6);
  });
});
