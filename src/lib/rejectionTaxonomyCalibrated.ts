/**
 * VizeAkıl — Empirik Ret Taksonomisi v1.0
 * ═══════════════════════════════════════════════════════════════
 * Kaynak: 50 gerçek vaka (Ekşi Sözlük, Şikayetvar, vize danışmanlık
 *         blogları, forum deneyim paylaşımları) — 2026-04
 * Analiz: R ile taksonomik frekans + severity-weighted scoring
 *
 * Toplam vaka: 50 (Schengen: 30, UK: 10, USA: 10)
 *
 * NOT: frequency_pct değerleri Türk başvurucu vakalarından türetildi;
 *      konsolosluk resmi istatistiği değildir. Kullanıcıya "yüksek /
 *      orta / düşük risk" olarak çevrilmeli, ham yüzde gösterilmemeli.
 *
 * v1.0 uyarısı: 50 vaka istatistiksel anlamlılık için küçüktür.
 *               200+ vakaya ulaşıldığında v2.0 kalibrasyonu yapılacak.
 */

export type Severity = 1 | 2 | 3; // 1=kritik/ban riski, 2=major, 3=orta

export interface CalibratedRejection {
  id: string;
  label_tr: string;              // Kullanıcıya gösterilen Türkçe etiket
  frequency_pct: number;         // 50 vaka üzerinden yüzde
  score_penalty: number;         // Skor düşüşü (0–30 arası)
  avg_severity: Severity;
  rank: number;
  applicable_to: ('schengen' | 'uk' | 'usa' | 'all')[];
  is_veto: boolean;              // true → kalıcı ban / skor cap riski
  mitigation: string;
}

export const CALIBRATED_TAXONOMY: CalibratedRejection[] = [
  {
    id: 'return_doubt',
    label_tr: 'Geri dönüş şüphesi',
    frequency_pct: 22.0,
    score_penalty: 26.7,
    avg_severity: 3,
    rank: 1,
    applicable_to: ['all'],
    is_veto: false,
    mitigation:
      "Türkiye'deki iş, mülk ve aile bağlarını somutlaştırın. " +
      'SGK dökümü, tapu, kira kontratı ekleyin. Kısa süreli (5-7 gün) ilk seyahat önerilir.',
  },
  {
    id: 'purpose_unconvincing',
    label_tr: 'Seyahat amacı inandırıcı değil',
    frequency_pct: 18.0,
    score_penalty: 30.0,
    avg_severity: 2,
    rank: 2,
    applicable_to: ['all'],
    is_veto: false,
    mitigation:
      'Günlük seyahat planı yazın, spesifik müze/etkinlik adı verin. ' +
      '"Neden şimdi, neden bu ülke?" sorularına 3 cümleyle net cevap hazırlayın.',
  },
  {
    id: '214b_weak_ties',
    label_tr: "ABD 214(b) — Türkiye bağları yetersiz",
    frequency_pct: 14.0,
    score_penalty: 26.7,
    avg_severity: 2,
    rank: 3,
    applicable_to: ['usa'],
    is_veto: false,
    mitigation:
      "Tapu, araç, SGK yılı, aile fotoğrafları — somut bağlar. " +
      'Sık iş değişikliği varsa kariyer planı hazırlayın. Mülakat hazırlığına özel çalışın.',
  },
  {
    id: 'documents_inconsistent',
    label_tr: 'Belge-form çelişkisi',
    frequency_pct: 12.0,
    score_penalty: 23.3,
    avg_severity: 2,
    rank: 4,
    applicable_to: ['all'],
    is_veto: false,
    mitigation:
      'Form ile tüm belgeler arasındaki tüm sayıları, tarihleri ve adresleri ' +
      'çapraz kontrol edin. Adres farklılığı otomatik ret sebebi sayılabilir.',
  },
  {
    id: 'financial_insufficient',
    label_tr: 'Banka bakiyesi yetersiz',
    frequency_pct: 10.0,
    score_penalty: 16.7,
    avg_severity: 2,
    rank: 5,
    applicable_to: ['all'],
    is_veto: false,
    mitigation:
      'Günlük €80-100 × gün sayısı × 1.5 formülüyle tamponlu bakiye hedefleyin. ' +
      '3 ay önceden düzenli giriş-çıkışla hesabı aktif tutun.',
  },
  {
    id: 'weak_ties',
    label_tr: "Türkiye bağları genel olarak zayıf",
    frequency_pct: 10.0,
    score_penalty: 17.4,
    avg_severity: 2,
    rank: 6,
    applicable_to: ['all'],
    is_veto: false,
    mitigation:
      'Medeni durum, çocuk, mülk, kıdemli iş — hangisi varsa vurgulayın. ' +
      "Hiçbiri yoksa başvuruyu güçlü bir profil oluşana kadar erteleyin.",
  },
  {
    id: 'last_minute_deposit',
    label_tr: 'Son dakika banka yatırımı (28 gün kuralı)',
    frequency_pct: 8.0,
    score_penalty: 22.0,
    avg_severity: 2,
    rank: 7,
    applicable_to: ['all'],
    is_veto: false,
    mitigation:
      'Başvurudan minimum 28 gün önce bakiye üzerinde herhangi bir hareket yapmayın. ' +
      '3-6 ay önceden planlamaya başlayın — "emanet para" konsoloslukça anında fark edilir.',
  },
  {
    id: 'deception',
    label_tr: 'Aldatma / yanlış beyan — 10 yıl ban riski',
    frequency_pct: 4.0,
    score_penalty: 10.0,
    avg_severity: 1,
    rank: 8,
    applicable_to: ['uk', 'usa'],
    is_veto: true,
    mitigation:
      'Tüm önceki redleri eksiksiz ve dürüstçe beyan edin. ' +
      'Belgeler ile form arasında tek bir tutarsızlık bile "Deception" sayılabilir ve 10 yıl yasağa yol açar.',
  },
  {
    id: 'documents_unreliable',
    label_tr: 'Belgeler güvenilir bulunmadı',
    frequency_pct: 4.0,
    score_penalty: 6.7,
    avg_severity: 2,
    rank: 9,
    applicable_to: ['schengen'],
    is_veto: false,
    mitigation:
      'İşveren yazısı antetli, kaşeli ve imzalı olmalı. ' +
      'Tercüme gerekiyorsa noter onaylı olması zorunludur.',
  },
  {
    id: 'family_split',
    label_tr: 'Aile içi tutarsızlık riski',
    frequency_pct: 4.0,
    score_penalty: 6.7,
    avg_severity: 2,
    rank: 10,
    applicable_to: ['all'],
    is_veto: false,
    mitigation:
      'Aile başvurusu yapıyorsanız tüm üyelerin dosyalarını tek pakette ve ' +
      'tutarlı şekilde hazırlayın. Her üyenin belgelerini çapraz kontrol edin.',
  },
  {
    id: 'genuine_visitor_failed',
    label_tr: 'UK "Gerçek Ziyaretçi" testi başarısız',
    frequency_pct: 4.0,
    score_penalty: 6.7,
    avg_severity: 2,
    rank: 11,
    applicable_to: ['uk'],
    is_veto: false,
    mitigation:
      "Cover letter'da ne kadar, nerede ve ne yapacağınızı ayrıntılı anlatın. " +
      "Türkiye'ye dönüş bağlarını sayılarla belgeleyin.",
  },
  {
    id: 'hotel_booking_fake',
    label_tr: 'Sahte otel rezervasyonu tespiti',
    frequency_pct: 4.0,
    score_penalty: 15.0,
    avg_severity: 2,
    rank: 12,
    applicable_to: ['schengen'],
    is_veto: false,
    mitigation:
      "Booking.com'un ücretsiz iptalli gerçek rezervasyonunu kullanın. " +
      'Sahte PDF konsolosluklar tarafından sistematik biçimde tespit edilmektedir.',
  },
  {
    id: 'insurance_inadequate',
    label_tr: 'Seyahat sigortası yetersiz / eksik',
    frequency_pct: 4.0,
    score_penalty: 8.0,
    avg_severity: 3,
    rank: 13,
    applicable_to: ['schengen'],
    is_veto: false,
    mitigation:
      '€30.000 minimum teminat + tüm Schengen bölgesi kapsamı + seyahat tarihlerinin tamamını içeren ' +
      'poliçe alın. Eksik poliçe otomatik red sebebidir.',
  },
  {
    id: 'source_of_funds_unclear',
    label_tr: 'Para kaynağı belirsiz (UK 28 gün kuralı)',
    frequency_pct: 4.0,
    score_penalty: 10.0,
    avg_severity: 1,
    rank: 14,
    applicable_to: ['uk'],
    is_veto: true,
    mitigation:
      'Son 6 aylık banka ekstresini hazırlayın. ' +
      'Büyük girişler için kaynak belgesi (maaş, satış, miras, ikramiye) mutlaka eklenmelidir.',
  },
  {
    id: 'unemployed',
    label_tr: 'İşsizlik / SGK kaydı eksik',
    frequency_pct: 4.0,
    score_penalty: 14.0,
    avg_severity: 2,
    rank: 15,
    applicable_to: ['schengen', 'usa'],
    is_veto: false,
    mitigation:
      'Sponsor belgesiyle başvuru yapılabilir; sponsor-başvurucu ilişkisi ' +
      'resmi belgeyle kanıtlanmalı (nüfus, evlilik cüzdanı).',
  },
  {
    id: 'unmarried_young',
    label_tr: 'Genç + bekar profili (ABD riski)',
    frequency_pct: 4.0,
    score_penalty: 8.3,
    avg_severity: 2,
    rank: 16,
    applicable_to: ['usa'],
    is_veto: false,
    mitigation:
      'Kariyer planı + aile tapu/mülkü + kısa süreli seyahat (5-7 gün) hazırlayın. ' +
      'İlk uluslararası başvuruda önce Schengen deneyimi kazanmanız tavsiye edilir.',
  },
  {
    id: 'married_mixed',
    label_tr: 'Eş yurt dışında + başvurucu çalışmıyor',
    frequency_pct: 4.0,
    score_penalty: 10.0,
    avg_severity: 2,
    rank: 17,
    applicable_to: ['schengen'],
    is_veto: false,
    mitigation:
      'Eş yurt dışındaysa sponsor evrakı güçlü olmalı. ' +
      "Türkiye'de kalacak aile üyesi veya mülk varsa mutlaka vurgulayın.",
  },
];

// ── Yardımcı fonksiyonlar ─────────────────────────────────────────────────

/** Rank'a göre sıralanmış ilk 10 kalıp */
export function getTop10(): CalibratedRejection[] {
  return CALIBRATED_TAXONOMY.slice(0, 10);
}

/** Ülke grubuna göre filtrele */
export function getByCountry(
  country: 'schengen' | 'uk' | 'usa',
): CalibratedRejection[] {
  return CALIBRATED_TAXONOMY.filter(
    (r) => r.applicable_to.includes('all') || r.applicable_to.includes(country),
  );
}

/** Sadece veto (kalıcı ban riski) kalıpları */
export function getVetos(): CalibratedRejection[] {
  return CALIBRATED_TAXONOMY.filter((r) => r.is_veto);
}

/** Risk seviyesi etiketi (ham yüzde kullanıcıya gösterilmez) */
export function riskLabel(
  frequency_pct: number,
): 'Yüksek Risk' | 'Orta Risk' | 'Düşük Risk' {
  if (frequency_pct >= 15) return 'Yüksek Risk';
  if (frequency_pct >= 8)  return 'Orta Risk';
  return 'Düşük Risk';
}
