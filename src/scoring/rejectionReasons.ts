// ── Ret Sebebi Dağılımı & Tahmini ──────────────────────────────────────────
// Ülke × profil kombinasyonuna göre en olası ret sebebi. Kaynak:
//   - Türk forum / sözlük / şikayet platformu örüntüleri (2018-2025)
//   - Schengen Visa Info, Al Jazeera, Daily Sabah, Euronews haberleri
//   - DonanımHaber Yunanistan 8. Madde thread (2018) — subjektif ret örüntüsü
//
// Dağılımlar yüzde değildir; "göreli ağırlıklar"dır — toplamı 1.0'a yakın olacak
// şekilde normalize edilmiştir. predictRejectionReasons() profil sinyalleriyle
// bu ağırlıkları modüle edip top-N sebebi döndürür.

export type RejectionReasonKey =
  | 'finansal_yetersizlik'
  | 'bağ_zayıflığı'           // dönüş niyeti şüphesi
  | 'seyahat_amacı_belirsiz'
  | 'belge_eksik_yanlış'
  | 'seyahat_geçmişi_yok'
  | 'sigorta_sorunu'
  | 'önceki_vize_ihlali'
  | 'konsolosluk_subjektif';  // profil iyi ama red (madde 10 tipik)

export interface RejectionReason {
  key: RejectionReasonKey;
  label: string;
  description: string;
  preventiveAction: string;
}

export const REJECTION_REASONS: Record<RejectionReasonKey, RejectionReason> = {
  finansal_yetersizlik: {
    key: 'finansal_yetersizlik',
    label: 'Finansal yetersizlik',
    description: 'Banka bakiyesi günlük 50-60 EUR eşiğini karşılamıyor veya 3 ay geçmişi tutarsız.',
    preventiveAction: 'Son 3-6 ay düzenli maaş/gelir hareketli hesap dökümü + günlük 60 EUR × gün sayısı bakiye.',
  },
  bağ_zayıflığı: {
    key: 'bağ_zayıflığı',
    label: 'Türkiye\'ye bağ yetersiz',
    description: 'Dönüş niyeti zayıf görülüyor — iş, aile, mülk bağları belgelenmemiş veya yetersiz.',
    preventiveAction: 'İşveren yazısı + SGK hizmet dökümü + tapu/araç ruhsatı + evlilik/çocuk belgeleri.',
  },
  seyahat_amacı_belirsiz: {
    key: 'seyahat_amacı_belirsiz',
    label: 'Seyahat amacı güvenilir değil',
    description: 'Rezervasyonlar generic, itinerary tutarsız veya amaç (turist/iş) belgelerle desteklenmemiş.',
    preventiveAction: 'Gün gün detaylı plan + rezervasyon onayları + amaca özel belge (toplantı davet, konferans kaydı).',
  },
  belge_eksik_yanlış: {
    key: 'belge_eksik_yanlış',
    label: 'Belge eksikliği/hatası',
    description: 'Form hataları, eksik imza, güncel olmayan döküman — en önlenebilir red sebebi.',
    preventiveAction: 'Konsolosluk checklist\'inin son güncel versiyonu + son 30 gün tarihli belgeler.',
  },
  seyahat_geçmişi_yok: {
    key: 'seyahat_geçmişi_yok',
    label: 'Seyahat geçmişi yok',
    description: 'İlk Schengen başvurusu + yurtdışı vize geçmişi boş — ret riskini ciddi artırır.',
    preventiveAction: 'Önce Balkanlar/Gürcistan/vizesiz ülkelerle giriş-çıkış damgası oluştur.',
  },
  sigorta_sorunu: {
    key: 'sigorta_sorunu',
    label: 'Seyahat sigortası yetersiz',
    description: 'Minimum 30.000 EUR teminat yok veya tarihler başvuru ile uyumsuz.',
    preventiveAction: '30.000 EUR+ teminatlı, tüm Schengen\'i kapsayan, seyahat tarihlerini tam karşılayan poliçe.',
  },
  önceki_vize_ihlali: {
    key: 'önceki_vize_ihlali',
    label: 'Önceki ihlal geçmişi',
    description: 'Overstay, sahte beyan veya önceki red geçmişi — en ağır veto faktörü.',
    preventiveAction: 'İhlal durumu netleştirilmeden başvuru erteleme; hukuki danışmanlık al.',
  },
  konsolosluk_subjektif: {
    key: 'konsolosluk_subjektif',
    label: 'Konsolosluk takdiri (Madde 10)',
    description: 'Profil iyi olsa da konsolosluk memuru "inandırıcı bulmadı" kararı verebilir — özellikle Yunanistan, Fransa.',
    preventiveAction: 'Alternatif ülke (İtalya, İspanya) veya farklı konsolosluk şehri; güçlü niyet mektubu.',
  },
};

// Ülke bazlı göreli ret sebebi dağılımı (toplam ~1.0).
// Veri: Türk kullanıcı forumları + Schengen yıllık istatistikleri.
export const REJECTION_REASON_DISTRIBUTION: Record<string, Partial<Record<RejectionReasonKey, number>>> = {
  'Almanya': {
    bağ_zayıflığı: 0.28, finansal_yetersizlik: 0.22, belge_eksik_yanlış: 0.20,
    seyahat_amacı_belirsiz: 0.14, konsolosluk_subjektif: 0.10, seyahat_geçmişi_yok: 0.06,
  },
  'Fransa': {
    konsolosluk_subjektif: 0.26, bağ_zayıflığı: 0.24, seyahat_amacı_belirsiz: 0.18,
    finansal_yetersizlik: 0.16, belge_eksik_yanlış: 0.10, seyahat_geçmişi_yok: 0.06,
  },
  'İtalya': {
    finansal_yetersizlik: 0.26, bağ_zayıflığı: 0.22, belge_eksik_yanlış: 0.18,
    seyahat_amacı_belirsiz: 0.16, seyahat_geçmişi_yok: 0.10, konsolosluk_subjektif: 0.08,
  },
  'Hollanda': {
    bağ_zayıflığı: 0.30, finansal_yetersizlik: 0.24, seyahat_amacı_belirsiz: 0.18,
    belge_eksik_yanlış: 0.14, konsolosluk_subjektif: 0.08, seyahat_geçmişi_yok: 0.06,
  },
  'İspanya': {
    belge_eksik_yanlış: 0.24, finansal_yetersizlik: 0.22, bağ_zayıflığı: 0.20,
    seyahat_amacı_belirsiz: 0.16, seyahat_geçmişi_yok: 0.10, konsolosluk_subjektif: 0.08,
  },
  'Yunanistan': {
    konsolosluk_subjektif: 0.34, seyahat_amacı_belirsiz: 0.24, bağ_zayıflığı: 0.18,
    belge_eksik_yanlış: 0.12, finansal_yetersizlik: 0.08, seyahat_geçmişi_yok: 0.04,
  },
  'İngiltere': {
    bağ_zayıflığı: 0.32, finansal_yetersizlik: 0.24, seyahat_amacı_belirsiz: 0.18,
    belge_eksik_yanlış: 0.14, seyahat_geçmişi_yok: 0.08, konsolosluk_subjektif: 0.04,
  },
  'ABD': {
    bağ_zayıflığı: 0.38, seyahat_amacı_belirsiz: 0.22, konsolosluk_subjektif: 0.16,
    finansal_yetersizlik: 0.12, seyahat_geçmişi_yok: 0.08, belge_eksik_yanlış: 0.04,
  },
};

// Varsayılan dağılım (tanımsız ülkeler için)
const DEFAULT_DISTRIBUTION: Partial<Record<RejectionReasonKey, number>> = {
  bağ_zayıflığı: 0.26, finansal_yetersizlik: 0.22, belge_eksik_yanlış: 0.18,
  seyahat_amacı_belirsiz: 0.16, konsolosluk_subjektif: 0.10, seyahat_geçmişi_yok: 0.08,
};

// ── Profil Sinyalleri ──────────────────────────────────────────────────────
// Dashboard'dan gelen minimal profil bilgisi. App.tsx'teki ProfileData'dan
// türetilir (predictor caller tarafından).
export interface PredictorSignals {
  country: string;
  monthlyIncomeTRY?: number;        // aylık net
  employmentType?: 'employed' | 'student' | 'public_sector' | 'retired' | 'self_employed' | 'unemployed';
  hasPriorSchengen?: boolean;
  hasPriorUsUk?: boolean;
  hasAnyTravel?: boolean;            // en az bir yurtdışı damgası
  hasPropertyOrCar?: boolean;
  maritalStatus?: 'bekar' | 'evli' | 'evli_çocuklu' | 'boşanmış';
  ageYears?: number;
  hasPriorVisaViolation?: boolean;
  tripDays?: number;
}

// ── Tahmin Fonksiyonu ──────────────────────────────────────────────────────
// Baz dağılımı alır, profil sinyallerine göre modüle eder, top-N sebebi döner.
export function predictRejectionReasons(
  signals: PredictorSignals,
  topN = 3,
): Array<{ reason: RejectionReason; weight: number; severity: 'yüksek' | 'orta' | 'düşük' }> {
  const base = REJECTION_REASON_DISTRIBUTION[signals.country] ?? DEFAULT_DISTRIBUTION;
  const weights: Partial<Record<RejectionReasonKey, number>> = { ...base };

  // Finansal sinyal — düşük gelir veya 0 ise finansal riski büyük ölçüde artır
  const income = signals.monthlyIncomeTRY ?? 0;
  if (income > 0 && income < 25000) weights.finansal_yetersizlik = (weights.finansal_yetersizlik ?? 0) * 1.8;
  else if (income >= 60000) weights.finansal_yetersizlik = (weights.finansal_yetersizlik ?? 0) * 0.5;

  // İşsiz / serbest meslek — bağ + finansal riski artar
  if (signals.employmentType === 'unemployed') {
    weights.bağ_zayıflığı = (weights.bağ_zayıflığı ?? 0) * 1.6;
    weights.finansal_yetersizlik = (weights.finansal_yetersizlik ?? 0) * 1.4;
  }
  if (signals.employmentType === 'self_employed') {
    weights.finansal_yetersizlik = (weights.finansal_yetersizlik ?? 0) * 1.3;
    weights.belge_eksik_yanlış = (weights.belge_eksik_yanlış ?? 0) * 1.3;
  }
  if (signals.employmentType === 'public_sector') {
    weights.bağ_zayıflığı = (weights.bağ_zayıflığı ?? 0) * 0.5;
  }

  // Seyahat geçmişi
  if (signals.hasAnyTravel === false && !signals.hasPriorSchengen && !signals.hasPriorUsUk) {
    weights.seyahat_geçmişi_yok = (weights.seyahat_geçmişi_yok ?? 0.05) * 3.0;
    weights.bağ_zayıflığı = (weights.bağ_zayıflığı ?? 0) * 1.2;
  }
  if (signals.hasPriorSchengen || signals.hasPriorUsUk) {
    weights.seyahat_geçmişi_yok = (weights.seyahat_geçmişi_yok ?? 0) * 0.2;
    weights.bağ_zayıflığı = (weights.bağ_zayıflığı ?? 0) * 0.8;
  }

  // Mülkiyet / medeni hal → bağ sinyali
  if (signals.hasPropertyOrCar) weights.bağ_zayıflığı = (weights.bağ_zayıflığı ?? 0) * 0.75;
  if (signals.maritalStatus === 'evli_çocuklu') weights.bağ_zayıflığı = (weights.bağ_zayıflığı ?? 0) * 0.7;
  if (signals.maritalStatus === 'bekar' && (signals.ageYears ?? 30) < 30) {
    weights.bağ_zayıflığı = (weights.bağ_zayıflığı ?? 0) * 1.3;
  }

  // İhlal geçmişi — veto seviye
  if (signals.hasPriorVisaViolation) {
    weights.önceki_vize_ihlali = 0.9; // dominant yap
  }

  // Normalize et
  const total = Object.values(weights).reduce((a, b) => a + (b ?? 0), 0) || 1;
  const normalized = Object.entries(weights)
    .map(([k, v]) => ({ key: k as RejectionReasonKey, weight: (v ?? 0) / total }))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, topN);

  return normalized.map(({ key, weight }) => ({
    reason: REJECTION_REASONS[key],
    weight,
    severity: weight >= 0.30 ? 'yüksek' : weight >= 0.18 ? 'orta' : 'düşük',
  }));
}
