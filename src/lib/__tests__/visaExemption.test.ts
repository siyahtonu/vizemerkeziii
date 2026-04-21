import { describe, test, expect } from 'vitest';
import { checkVisaExemption } from '../visaExemption';
import { BASE_PROFILE } from '../../scoring/__tests__/fixtures';
import type { ProfileData } from '../../types';

const p = (patch: Partial<ProfileData>): ProfileData => ({ ...BASE_PROFILE, ...patch });

describe('checkVisaExemption — self-silencing', () => {
  test('normal profil muafiyet almaz', () => {
    const r = checkVisaExemption(p({ targetCountry: 'Almanya' }));
    expect(r.exempt).toBe(false);
  });

  test('Yeşil pasaport + Schengen hedefi → 90 gün muafiyeti', () => {
    const r = checkVisaExemption(p({
      targetCountry: 'Almanya',
      hasGreenPassport: true,
    }));
    expect(r.exempt).toBe(true);
    expect(r.reason).toBe('green_passport');
    expect(r.conditional).toBe(true);
  });

  test('Yeşil pasaport + UK hedefi → muafiyet yok (aralarında anlaşma yok)', () => {
    const r = checkVisaExemption(p({
      targetCountry: 'İngiltere',
      hasGreenPassport: true,
    }));
    expect(r.exempt).toBe(false);
  });

  test('Yeşil pasaport + ABD hedefi → muafiyet yok', () => {
    const r = checkVisaExemption(p({
      targetCountry: 'ABD',
      hasGreenPassport: true,
    }));
    expect(r.exempt).toBe(false);
  });

  test('EU çifte vatandaşlığı + Schengen hedefi → tam muafiyet (araç uygun değil)', () => {
    const r = checkVisaExemption(p({
      targetCountry: 'Fransa',
      hasDualEuCitizenship: true,
      dualCitizenshipCountry: 'Almanya',
    }));
    expect(r.exempt).toBe(true);
    expect(r.reason).toBe('eu_citizen');
    expect(r.toolUnsuitable).toBe(true);
  });

  test('Hedef ülke vatandaşlığı → target_citizen muafiyeti (her ülke için)', () => {
    const r = checkVisaExemption(p({
      targetCountry: 'İngiltere',
      hasDualEuCitizenship: true, // checkbox adı EU ama hedef != EU kontrolü çalışmalı
      dualCitizenshipCountry: 'İngiltere',
    }));
    expect(r.exempt).toBe(true);
    expect(r.reason).toBe('target_citizen');
  });

  test('EU vatandaşlığı ama UK hedefinde Schengen muafiyeti yok', () => {
    const r = checkVisaExemption(p({
      targetCountry: 'İngiltere',
      hasDualEuCitizenship: true,
      dualCitizenshipCountry: 'Almanya',
    }));
    expect(r.exempt).toBe(false);
  });
});
