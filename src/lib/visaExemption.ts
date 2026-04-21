// ============================================================
// Vize Muafiyeti Kontrolü (v3.10)
// ============================================================
// Self-silencing: kullanıcı zaten vizeye ihtiyaç duymuyorsa,
// ona risk skoru göstermek hem yanlış hem etik dışı. Bu modül
// profile bakıp "vize gerekmez" durumlarını tespit eder.
//
// Kapsam (2026 Nisan):
//   • TR Yeşil Pasaport (Hizmet Pasaportu): Schengen için 90 gün
//     içinde vizesiz giriş hakkı (EU-TR anlaşması)
//   • EU çifte vatandaşlığı: AB vatandaşı hiçbir Schengen ülkesine
//     vize istemez; serbest dolaşım hakkı
//   • UK/ABD çifte vatandaşlığı: o ülke için vize gerekmez
//
// Bu kontrol skorun dışında — Dashboard'da prominente banner
// gösterilir. Kullanıcı yine de devam edebilir (örn. farklı ülke
// seçer veya bilgiyi doğrulamak ister).
// ============================================================

import { SCHENGEN_COUNTRIES } from '../scoring/matrices';
import type { ProfileData } from '../types';

export interface VisaExemption {
  exempt: boolean;
  /** Hangi mekanizma muafiyeti sağlıyor */
  reason?: 'green_passport' | 'eu_citizen' | 'target_citizen';
  /** Kullanıcıya gösterilecek açıklama (Türkçe) */
  message?: string;
  /** Muafiyet şartlı mı? (örn. 90 gün sınırı) */
  conditional?: boolean;
  /** İnce ayar: aracın bu profil için uygun olmadığı net mi? */
  toolUnsuitable?: boolean;
}

export const checkVisaExemption = (data: ProfileData): VisaExemption => {
  const country = data.targetCountry;

  // 1. Hedef ülke vatandaşlığı — en net muafiyet
  if (data.hasDualEuCitizenship && country === data.dualCitizenshipCountry) {
    return {
      exempt: true,
      reason: 'target_citizen',
      message: `${country} vatandaşı olarak bu ülkeye vize başvurusu yapmıyorsunuz — pasaportunuzla girebilirsiniz.`,
      toolUnsuitable: true,
    };
  }

  // 2. EU çifte vatandaşlığı → Schengen muafiyeti
  if (data.hasDualEuCitizenship && SCHENGEN_COUNTRIES.has(country)) {
    return {
      exempt: true,
      reason: 'eu_citizen',
      message: `AB vatandaşı olarak ${country} dahil tüm Schengen ülkelerine vizesiz giriş hakkınız var.`,
      toolUnsuitable: true,
    };
  }

  // 3. Yeşil pasaport → Schengen 90 gün (sınırlı muafiyet)
  if (data.hasGreenPassport && SCHENGEN_COUNTRIES.has(country)) {
    return {
      exempt: true,
      reason: 'green_passport',
      message: `Yeşil pasaport ile ${country}'a 180 gün içinde 90 güne kadar vizesiz giriş hakkınız var. Uzun süreli/çalışma amaçlı ziyaretler için vize gerekir.`,
      conditional: true,
      toolUnsuitable: false, // UK/ABD veya uzun süreli ziyaret için araç hâlâ yararlı
    };
  }

  return { exempt: false };
};
