// ── Araştırma Vaka Havuzu — anonim, kürasyonlu ─────────────────────────────
// Kaynak: Türk forum / sözlük / şikayet platformu + haber sitesi örüntüleri
// (2018-2025). Ham metin saklanmaz; yalnızca yapılandırılmış çıkarım.
// "Benzer profiller" widget'ı bu havuzu kullanır.
//
// Yeni vaka eklerken: gerçek anlatıya sadık kal, kimlik ifşa edecek detay koyma.

export type CaseProfession =
  | 'beyaz_yaka_özel' | 'devlet_memuru' | 'mavi_yaka' | 'freelancer'
  | 'işveren' | 'öğrenci' | 'işsiz' | 'emekli' | 'ev_hanımı';

export type CaseAge = '18-24' | '25-34' | '35-44' | '45-54' | '55+';
export type CaseMarital = 'bekar' | 'evli' | 'evli_çocuklu' | 'boşanmış';
export type CaseTravel = 'hiç_yok' | 'sadece_kolay_ülke' | 'schengen_var' | 'abd_uk_var' | 'zengin_geçmiş';

export interface ResearchCase {
  id: string;
  year: number;
  country: string;
  outcome: 'red' | 'kabul';
  article?: string;
  reasonKey?: string;              // rejectionReasons.ts ile eşleşir
  profile: {
    profession: CaseProfession;
    ageBucket: CaseAge;
    maritalStatus: CaseMarital;
    travelHistory: CaseTravel;
    incomeRangeTRY?: [number, number];
  };
  summary: string;                 // 1-2 cümle anonim özet
  learning?: string;               // çıkarılan ders (opsiyonel)
}

export const RESEARCH_CASES: ResearchCase[] = [
  {
    id: 'gr-2018-01',
    year: 2018, country: 'Yunanistan', outcome: 'red', article: '8',
    reasonKey: 'konsolosluk_subjektif',
    profile: {
      profession: 'beyaz_yaka_özel', ageBucket: '25-34', maritalStatus: 'bekar',
      travelHistory: 'schengen_var', incomeRangeTRY: [12000, 16000],
    },
    summary: 'Havacılık sektörü çalışanı, önceki 3 Schengen vizesi (Çekya, Yunanistan, Hollanda) vardı. 12 günlük gezi için 1050 EUR bakiyeyle reddedildi.',
    learning: 'Yunanistan 8. Madde profil kalitesinden bağımsız verilebiliyor — alternatif konsolosluk tercih edilebilir.',
  },
  {
    id: 'gr-2018-02',
    year: 2018, country: 'Yunanistan', outcome: 'red', article: '8',
    reasonKey: 'konsolosluk_subjektif',
    profile: {
      profession: 'devlet_memuru', ageBucket: '35-44', maritalStatus: 'evli',
      travelHistory: 'schengen_var',
    },
    summary: 'Devlet memuru, sağlam iş bağı rağmen Madde 2+8 reddi aldı.',
    learning: 'Devlet memurluğu tek başına koruma sağlamıyor; seyahat amacı belgesi güçlü olmalı.',
  },
  {
    id: 'gr-2018-03',
    year: 2018, country: 'Yunanistan', outcome: 'red', article: '8',
    reasonKey: 'seyahat_amacı_belirsiz',
    profile: {
      profession: 'beyaz_yaka_özel', ageBucket: '35-44', maritalStatus: 'evli_çocuklu',
      travelHistory: 'abd_uk_var',
    },
    summary: 'ABD ve UK geçmişi + 40+ ülke seyahati olan başvurucu, Schengen geçmişi olmadığı için reddedildi.',
    learning: 'ABD/UK vizesi Schengen red ihtimalini düşürmüyor — Schengen geçmişi ayrı değerlendiriliyor.',
  },
  {
    id: 'it-2019-01',
    year: 2019, country: 'İtalya', outcome: 'kabul',
    profile: {
      profession: 'işsiz', ageBucket: '25-34', maritalStatus: 'bekar',
      travelHistory: 'hiç_yok',
    },
    summary: 'İşsiz başvurucu, anne sponsor + tapu + banka dökümü + araç ruhsatı kombosuyla kabul aldı.',
    learning: 'İşsizlik veto değil — çoklu bağ/finans kanıtı kombinasyonu çalışıyor.',
  },
  {
    id: 'de-2024-01',
    year: 2024, country: 'Almanya', outcome: 'red',
    reasonKey: 'bağ_zayıflığı',
    profile: {
      profession: 'freelancer', ageBucket: '25-34', maritalStatus: 'bekar',
      travelHistory: 'sadece_kolay_ülke',
    },
    summary: 'Freelancer, düzensiz gelir + zayıf Türkiye bağı nedeniyle reddedildi. iData randevusu 8 ay sürdü.',
    learning: 'Freelancer için gelir süreklilik kanıtı + tapu/araç bağ sinyali kritik.',
  },
  {
    id: 'de-2023-01',
    year: 2023, country: 'Almanya', outcome: 'kabul',
    profile: {
      profession: 'beyaz_yaka_özel', ageBucket: '25-34', maritalStatus: 'evli',
      travelHistory: 'schengen_var', incomeRangeTRY: [40000, 55000],
    },
    summary: 'Özel sektör çalışanı, eşi öğretmen, önceki Hollanda vizesi — 2. başvuruda Almanya vizesi aldı.',
  },
  {
    id: 'fr-2023-01',
    year: 2023, country: 'Fransa', outcome: 'red',
    reasonKey: 'konsolosluk_subjektif',
    profile: {
      profession: 'öğrenci', ageBucket: '18-24', maritalStatus: 'bekar',
      travelHistory: 'hiç_yok',
    },
    summary: 'Üniversite öğrencisi, ailesi sponsor, kabul mektubu + konaklama tam — yine de "amaç güvenilir değil" gerekçesiyle reddedildi.',
    learning: 'Genç/bekar/seyahat geçmişsiz öğrenciler Fransa konsolosluğunda yüksek risk. İtalya öğrenci vizesine kaymak düşünülmeli.',
  },
  {
    id: 'fr-2024-01',
    year: 2024, country: 'Fransa', outcome: 'kabul',
    profile: {
      profession: 'emekli', ageBucket: '55+', maritalStatus: 'evli_çocuklu',
      travelHistory: 'zengin_geçmiş',
    },
    summary: 'Emekli çift, 20+ yıllık seyahat geçmişi, tapu + emekli maaşı dökümü ile kabul aldı.',
  },
  {
    id: 'it-2025-01',
    year: 2025, country: 'İtalya', outcome: 'kabul',
    profile: {
      profession: 'öğrenci', ageBucket: '18-24', maritalStatus: 'bekar',
      travelHistory: 'hiç_yok',
    },
    summary: 'Türk öğrenci, daha önce Fransa\'dan red almıştı; İtalya\'ya itirazı kazandı ve öğrenci vizesi aldı (2025 emsal karar).',
    learning: 'İtalya\'ya öğrenci vizesi reddi itirazı 2025\'te kazanan davalar var — hukuki yol çalışıyor.',
  },
  {
    id: 'es-2024-01',
    year: 2024, country: 'İspanya', outcome: 'red',
    reasonKey: 'belge_eksik_yanlış',
    profile: {
      profession: 'beyaz_yaka_özel', ageBucket: '25-34', maritalStatus: 'bekar',
      travelHistory: 'schengen_var', incomeRangeTRY: [35000, 45000],
    },
    summary: 'Önceki Schengen geçmişi olan başvurucu, uçuş rezervasyonu gerçek bilet sayılmadığı için reddedildi.',
    learning: 'İspanya "rezervasyon" yerine iade edilebilir gerçek bilet istiyor — detayda ret riski.',
  },
  {
    id: 'nl-2022-01',
    year: 2022, country: 'Hollanda', outcome: 'red',
    reasonKey: 'bağ_zayıflığı',
    profile: {
      profession: 'freelancer', ageBucket: '25-34', maritalStatus: 'bekar',
      travelHistory: 'sadece_kolay_ülke',
    },
    summary: 'Freelancer yazılımcı, yurtdışı Airbnb gelir beyanı olmayan bekar başvurucu, dönüş niyeti şüphesiyle reddedildi.',
  },
  {
    id: 'uk-2023-01',
    year: 2023, country: 'İngiltere', outcome: 'red',
    reasonKey: 'bağ_zayıflığı',
    profile: {
      profession: 'beyaz_yaka_özel', ageBucket: '25-34', maritalStatus: 'bekar',
      travelHistory: 'schengen_var', incomeRangeTRY: [25000, 35000],
    },
    summary: 'Gelir düzenli ve Schengen geçmişi var, ancak UK "finansal durum ziyaret amacını desteklemiyor" gerekçesiyle reddetti.',
    learning: 'UK Schengen\'den daha sıkı — gelir/tasarruf eşiği yaklaşık 2x Schengen.',
  },
  {
    id: 'us-2024-01',
    year: 2024, country: 'ABD', outcome: 'red',
    reasonKey: 'bağ_zayıflığı',
    profile: {
      profession: 'öğrenci', ageBucket: '18-24', maritalStatus: 'bekar',
      travelHistory: 'hiç_yok',
    },
    summary: 'F-1 öğrenci vizesi başvurusu, "kuvvetli Türkiye bağı yok" gerekçesiyle 214(b) reddi aldı.',
    learning: 'ABD 214(b) için aile + mülk + dönüş niyeti üçlüsü çok güçlü sunulmalı.',
  },
  {
    id: 'gr-2024-01',
    year: 2024, country: 'Yunanistan', outcome: 'kabul',
    profile: {
      profession: 'ev_hanımı', ageBucket: '35-44', maritalStatus: 'evli_çocuklu',
      travelHistory: 'hiç_yok',
    },
    summary: 'Ev hanımı, eşi sponsor, çocuklarla aile tatili — ilk Schengen vizesini Yunanistan\'dan aldı.',
    learning: 'Aile + çocuklu profilde Yunanistan giriş ülkesi olarak çalışıyor.',
  },
  {
    id: 'it-2024-02',
    year: 2024, country: 'İtalya', outcome: 'kabul',
    profile: {
      profession: 'işveren', ageBucket: '45-54', maritalStatus: 'evli_çocuklu',
      travelHistory: 'zengin_geçmiş', incomeRangeTRY: [150000, 300000],
    },
    summary: 'Şirket sahibi, vergi levhası + SMMM raporu + önceki çoklu Schengen ile hızlı kabul.',
  },
];

// ── Benzerlik skoru ────────────────────────────────────────────────────────
// Basit ağırlıklı eşleşme: ülke > meslek > seyahat geçmişi > medeni hal > yaş
export function scoreSimilarity(
  a: ResearchCase['profile'] & { country: string },
  b: ResearchCase,
): number {
  let s = 0;
  if (b.country === a.country) s += 40;
  if (b.profile.profession === a.profession) s += 25;
  if (b.profile.travelHistory === a.travelHistory) s += 15;
  if (b.profile.maritalStatus === a.maritalStatus) s += 10;
  if (b.profile.ageBucket === a.ageBucket) s += 10;
  return s;
}

export function findSimilarCases(
  query: { country: string } & ResearchCase['profile'],
  limit = 5,
): Array<{ case: ResearchCase; similarity: number }> {
  return RESEARCH_CASES
    .map(c => ({ case: c, similarity: scoreSimilarity(query, c) }))
    .filter(x => x.similarity >= 40)           // en az ülke eşleşmesi
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}
