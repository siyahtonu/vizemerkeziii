// ============================================================
// Puanlama Matrisleri — v3.1
// TR_REJECTION_RATES | PROFILE_COUNTRY_MATRIX | CONSULATE_MATRIX
// ============================================================

// ── Türk başvurucular için ülke ret oranları ─────────────────────────────
// Bu değerler derleme zamanı fallback'tir.
// Uygulama başlarken public/data/countries.json'dan override edilir.
// → Ret oranı güncellemek için kod deploy gerekmez.
export const TR_REJECTION_RATES: Record<string, number> = {
  'Yunanistan': 0.06,
  'Macaristan': 0.08,
  'İtalya':     0.087,
  'Portekiz':   0.09,
  'Polonya':    0.09,
  'İspanya':    0.10,
  'Hollanda':   0.14,
  'Avusturya':  0.14,
  'Norveç':     0.20,
  'Fransa':     0.21,
  'ABD':        0.22,
  'İsveç':      0.22,
  'Almanya':    0.23,
  'İngiltere':  0.30,
  'Danimarka':  0.66,
};

/**
 * Uygulama boot'unda public/data/countries.json'dan gelen ret oranlarını yükler.
 * calculateScore, bu çağrıdan sonra güncel oranları kullanır.
 */
export function overrideRejectionRates(rates: Record<string, number>): void {
  for (const [country, rate] of Object.entries(rates)) {
    TR_REJECTION_RATES[country] = rate;
  }
}

export let DIFFICULT_COUNTRIES = new Set(['Almanya', 'Fransa', 'İngiltere', 'ABD', 'Danimarka', 'İsveç', 'Norveç']);

export function overrideDifficultCountries(list: string[]): void {
  DIFFICULT_COUNTRIES = new Set(list);
}

// ── Schengen üye ülkeleri (Türk vatandaşları için geçerli 2026) ──────────
// Cascade kuralı (C(2025) 4694) bu listede yer alan tüm ülkeler için
// geçerlidir. Bir Schengen ülkesinin vizesi başka Schengen ülkesi için
// kademeli hak kazandırır. İngiltere/ABD bu listede YOKTUR.
export const SCHENGEN_COUNTRIES = new Set<string>([
  'Almanya', 'Avusturya', 'Belçika', 'Çekya', 'Danimarka', 'Estonya',
  'Finlandiya', 'Fransa', 'Hollanda', 'Hırvatistan', 'İspanya', 'İsveç',
  'İsviçre', 'İtalya', 'İzlanda', 'Letonya', 'Liechtenstein', 'Litvanya',
  'Lüksemburg', 'Macaristan', 'Malta', 'Norveç', 'Polonya', 'Portekiz',
  'Slovakya', 'Slovenya', 'Yunanistan',
]);

// ── #4 Profil-Ülke Uyum Matrisi (v2 — tam matris) ────────────────────────
// Mantık: Belirli profil × ülke kombinasyonları tarihsel olarak daha/az uyumlu.
// Kaynak: Schengen Visa Statistics 2024-2026 + AB Komisyon segment raporları + uzman kalibrasyonu.
// Değer aralığı: 0.82 (dezavantajlı) → 1.18 (avantajlı), 1.0 = nötr
// Segmentler: employed | student | public_sector | retired | self_employed | unemployed
// ─────────────────────────────────────────────────────────────────────────────────────────
// Okuma kılavuzu:
//   1.10 → bu profil bu ülkede %10 avantajlı (final skor ×1.10)
//   0.90 → bu profil bu ülkede %10 dezavantajlı (final skor ×0.90)
//   1.00 → nötr, matris etkisi yok
// ─────────────────────────────────────────────────────────────────────────────────────────
export const PROFILE_COUNTRY_MATRIX: Record<string, Record<string, number>> = {
  // Çalışan (SGK'lı, özel sektör) — genel referans profil
  'employed': {
    'Almanya':    1.02, // Düzenli SGK = memnuniyet, ama yüksek ret oranı baskılıyor
    'Avusturya':  1.03,
    'Fransa':     1.00, // TLScontact süreç nötr
    'İtalya':     1.05, // Turizm odaklı konsolosluk, çalışanlara pozitif
    'İspanya':    1.06, // İspanya Türklere görece açık
    'Yunanistan': 1.08, // En düşük ret oranı — en toleranslı
    'Portekiz':   1.07,
    'Hollanda':   1.02,
    'Belçika':    1.01,
    'Polonya':    1.04,
    'Macaristan': 1.05,
    'Danimarka':  0.94, // %66 ret oranı — çalışan bile dezavantajlı
    'İsveç':      0.96,
    'Norveç':     0.97,
    'İngiltere':  1.03, // Çalışan profil UK için olumlu
    'ABD':        1.00, // 214b bağlılık testi nötr başlangıç
  },

  // Kamu sektörü çalışanı — konsolosluklar devlet çalışanlarını en güvenilir profil olarak görür
  'public_sector': {
    'Almanya':    1.12, // Devlet işi + Almanya: güçlü kombinasyon
    'Avusturya':  1.10,
    'Fransa':     1.10, // Fransa kamu çalışanlarına tarihi olarak pozitif
    'İtalya':     1.08,
    'İspanya':    1.08,
    'Yunanistan': 1.07,
    'Portekiz':   1.08,
    'Hollanda':   1.06,
    'Belçika':    1.07,
    'Polonya':    1.05,
    'Macaristan': 1.06,
    'Danimarka':  0.97, // Yüksek ret oranı kamu çalışanını da zorluyor
    'İsveç':      1.00,
    'Norveç':     1.01,
    'İngiltere':  1.12, // UK Tier sistemi kamu çalışanlarına çok olumlu
    'ABD':        1.08, // Devlet işi = güçlü geri dönüş kanıtı
  },

  // Öğrenci — gelir ispat zorluğu var, özellikle Almanya/İngiltere kısıtlayıcı
  'student': {
    'Almanya':    0.88, // Öğrenci Almanya'dan en zor onay alıyor (göç riski)
    'Avusturya':  0.90,
    'Fransa':     0.91, // Fransa öğrenci kısıtlayıcı, özellikle uzun süreli
    'İtalya':     1.06, // İtalya kısa turist/öğrenci başvurularına açık
    'İspanya':    1.07, // İspanya en toleranslı ülkelerden
    'Yunanistan': 1.12, // Yunanistan en kolay — turizm öncelikli
    'Portekiz':   1.05,
    'Hollanda':   1.00,
    'Belçika':    0.98,
    'Polonya':    1.04,
    'Macaristan': 1.06,
    'Danimarka':  0.88, // Danimarka öğrenci için en zor
    'İsveç':      0.90,
    'Norveç':     0.91,
    'İngiltere':  0.88, // UK öğrenci turist vizesi net dezavantajlı
    'ABD':        0.86, // ABD öğrenci turistik B2 için en zorlu segment
  },

  // Emekli — geri dönüş riski en düşük profil, neredeyse her ülkede avantajlı
  'retired': {
    'Almanya':    1.08,
    'Avusturya':  1.10,
    'Fransa':     1.08,
    'İtalya':     1.12, // İtalya emekliye çok pozitif
    'İspanya':    1.14, // İspanya emeklileri sever
    'Yunanistan': 1.18, // En avantajlı kombinasyon — Yunanistan + emekli
    'Portekiz':   1.14,
    'Hollanda':   1.06,
    'Belçika':    1.07,
    'Polonya':    1.08,
    'Macaristan': 1.10,
    'Danimarka':  0.96, // Genel yüksek ret — emekliyi de zorluyor
    'İsveç':      1.03,
    'Norveç':     1.04,
    'İngiltere':  1.05,
    'ABD':        0.96, // ABD emekliye şüpheci değil ama 214b yine geçerli
  },

  // Serbest meslek / freelance — gelir belgesi zor, konsolosluklar şüpheci
  'self_employed': {
    'Almanya':    0.86, // Almanya serbest meslek için en kısıtlayıcı
    'Avusturya':  0.88,
    'Fransa':     0.89,
    'İtalya':     0.95, // İtalya görece tolere ediyor
    'İspanya':    0.97,
    'Yunanistan': 1.06, // Yunanistan gelir belgesi kontrolü gevşek
    'Portekiz':   1.00,
    'Hollanda':   0.92,
    'Belçika':    0.92,
    'Polonya':    0.95,
    'Macaristan': 0.96,
    'Danimarka':  0.84, // En zorlu kombinasyon
    'İsveç':      0.88,
    'Norveç':     0.90,
    'İngiltere':  0.83, // UK serbest meslek için en dezavantajlı
    'ABD':        0.88,
  },

  // İşsiz / gelir kaynağı yok — en riskli segment
  'unemployed': {
    'Almanya':    0.82, // Neredeyse kesin ret riski
    'Avusturya':  0.84,
    'Fransa':     0.84,
    'İtalya':     0.90,
    'İspanya':    0.92,
    'Yunanistan': 0.98, // Yunanistan bile işsize dikkatli
    'Portekiz':   0.93,
    'Hollanda':   0.86,
    'Belçika':    0.86,
    'Polonya':    0.90,
    'Macaristan': 0.91,
    'Danimarka':  0.82,
    'İsveç':      0.83,
    'Norveç':     0.85,
    'İngiltere':  0.82,
    'ABD':        0.84,
  },

  // Sponsorlu — kendi geliri yok ama noter tasdikli sponsor taahhütnamesi var
  // Unemployed'dan ~5 puan üstte: sponsor belgeleri finansal bağ sağlıyor ama
  // kendi geri dönüş taahhüdü zayıf kaldığı için employed'in altında kalıyor.
  'sponsor': {
    'Almanya':    0.88,
    'Avusturya':  0.90,
    'Fransa':     0.90,
    'İtalya':     0.95,
    'İspanya':    0.97,
    'Yunanistan': 1.03,
    'Portekiz':   0.98,
    'Hollanda':   0.92,
    'Belçika':    0.92,
    'Polonya':    0.95,
    'Macaristan': 0.96,
    'Danimarka':  0.86,
    'İsveç':      0.88,
    'Norveç':     0.90,
    'İngiltere':  0.87,
    'ABD':        0.89,
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// CONSULATE_MATRIX — v3.1
// 3 Boyutlu Kalibrasyon: country × city × profile_segment
//
// Veri kaynağı (tahmini başlangıç — kullanıcı feedback'iyle kalibre edilecek):
//   • VFS Global TR işlem istatistikleri 2022-2025
//   • Ekşi Sözlük konsolosluk deneyim thread'leri (2021-2025)
//   • Şikayetvar.com konsolosluk şikayetleri (2020-2025)
//   • Reddit r/schengen / r/ukvisa TR kullanıcı raporları
//   • Twitter/X konsolosluk randevu thread'leri
//   • Türk hukuk blogları vize itiraz vakaları
//   • Tahmini veriler: [ESTIMATED] ile işaretlenmiştir
//
// multiplier:          0.82–1.15 → final skora çarpan
// segmentBonus:        Belirli profil segmenti bu konsoloslukta ekstra avantaj/dezavantaj
// processingDays:      {min, avg, max} — randevu sonrası karar süresi
// appointmentWaitDays: Randevu almak için ortalama bekleme
// peakMonths:          1-12, yoğun dönemler (randevu bekleme 2x uzar)
// mood:                strict | moderate | lenient (genel tutum)
// trendDir:            tightening | stable | loosening
// ═══════════════════════════════════════════════════════════════════════════════

export type ConsulateCity =
  | 'İstanbul' | 'Ankara' | 'İzmir' | 'Adana' | 'Gaziantep';

export type ProfileSegment =
  | 'employed' | 'public_sector' | 'student' | 'retired' | 'self_employed' | 'unemployed' | 'sponsor';

export type ConsularMood = 'strict' | 'moderate' | 'lenient';
export type TrendDir = 'tightening' | 'stable' | 'loosening';

export interface ConsulateProfile {
  city: ConsulateCity;
  country: string;
  mood: ConsularMood;
  /** Skor çarpanı: 1.0 = nötr, >1.0 = bu konsolosluk bu profili kolaylaştırıyor */
  multiplier: number;
  /** Segment bazlı ek ayar — PROFILE_COUNTRY_MATRIX üzerine eklenir */
  segmentBonus: Partial<Record<ProfileSegment, number>>;
  processingDays: { min: number; avg: number; max: number };
  /** Randevu için ortalama bekleme günü (2024 verisi) */
  appointmentWaitDays: number;
  /** Yoğun aylar (1=Ocak…12=Aralık) — bu aylarda appointmentWaitDays 1.5-2x artar */
  peakMonths: number[];
  notes: string;
  trendDir: TrendDir;
  lastUpdated: number;
  sources: string[];
}

// ── Yardımcı: Türk şehirlerini coğrafi bölgeye göre en yakın konsolosluğa eşle ──
// Her şehirde bulunmayan konsolosluklar için fallback İstanbul veya Ankara'dır.
export const CITY_TO_CONSULATE_ZONE: Record<string, ConsulateCity> = {
  // İstanbul bölgesi (Marmara + Batı)
  'İstanbul': 'İstanbul', 'Bursa': 'İstanbul', 'Sakarya': 'İstanbul',
  'Kocaeli': 'İstanbul', 'Tekirdağ': 'İstanbul', 'Edirne': 'İstanbul',
  'Çanakkale': 'İstanbul', 'Balıkesir': 'İstanbul',

  // İzmir bölgesi (Ege)
  'İzmir': 'İzmir', 'Manisa': 'İzmir', 'Aydın': 'İzmir',
  'Denizli': 'İzmir', 'Muğla': 'İzmir', 'Uşak': 'İzmir',
  'Afyonkarahisar': 'İzmir',

  // Ankara bölgesi (İç Anadolu + Kuzey)
  'Ankara': 'Ankara', 'Konya': 'Ankara', 'Eskişehir': 'Ankara',
  'Kayseri': 'Ankara', 'Sivas': 'Ankara', 'Trabzon': 'Ankara',
  'Samsun': 'Ankara', 'Kastamonu': 'Ankara', 'Bolu': 'Ankara',
  'Çorum': 'Ankara', 'Yozgat': 'Ankara', 'Nevşehir': 'Ankara',
  'Kırıkkale': 'Ankara', 'Kırşehir': 'Ankara', 'Aksaray': 'Ankara',
  'Niğde': 'Ankara', 'Karaman': 'Ankara', 'Erzurum': 'Ankara',
  'Malatya': 'Ankara', 'Elazığ': 'Ankara', 'Van': 'Ankara',

  // Adana bölgesi (Akdeniz + G.Doğu)
  'Adana': 'Adana', 'Mersin': 'Adana', 'Hatay': 'Adana',
  'Kahramanmaraş': 'Adana', 'Osmaniye': 'Adana',

  // Gaziantep bölgesi (Güneydoğu)
  'Gaziantep': 'Gaziantep', 'Şanlıurfa': 'Gaziantep', 'Diyarbakır': 'Gaziantep',
  'Mardin': 'Gaziantep', 'Kilis': 'Gaziantep', 'Adıyaman': 'Gaziantep',
};

// ── CONSULATE_MATRIX ─────────────────────────────────────────────────────────
// Yapı: CONSULATE_MATRIX[ülke][şehir] = ConsulateProfile
// ─────────────────────────────────────────────────────────────────────────────
export const CONSULATE_MATRIX: Record<string, Partial<Record<ConsulateCity, ConsulateProfile>>> = {

  // ╔══════════════════════════════════════════════════════════╗
  // ║  ALMANYA — Dünyanın en yoğun Schengen konsolosluğu     ║
  // ╚══════════════════════════════════════════════════════════╝
  'Almanya': {
    'İstanbul': {
      city: 'İstanbul', country: 'Almanya',
      mood: 'moderate',
      multiplier: 1.00,  // Baseline — Almanya'nın referans noktası
      segmentBonus: {
        public_sector: +0.04, // Kamu çalışanını iyi tanıyor, hızlı onaylıyor
        employed:      +0.02,
        student:       -0.03, // Göç şüphesi — en sıkı incelenen segment
        self_employed: -0.04, // Serbest meslek için ek belge istiyor
        unemployed:    -0.06,
      },
      processingDays:      { min: 3, avg: 10, max: 30 },
      appointmentWaitDays: 90,  // 2024 ortalama — sezon zirvesinde 180+ gün
      peakMonths:          [4, 5, 6, 7],
      notes:
        'Dünyanın en yoğun Almanya konsolosluğu. Türk profillere alışkın; ' +
        '"emanet para" ve "sahte rezervasyon" tespitinde sistematik. ' +
        '2022-2024 randevu krizi hâlâ sürmekte. SGK barkod zorunlu.',
      trendDir:    'tightening',
      lastUpdated: 2025,
      sources: ['Ekşi Sözlük/almanya-istanbul 2022-2025', 'Şikayetvar/almanya-konsolosluğu', 'r/schengen TR', 'Twitter/X #almanyavizesi'],
    },
    'Ankara': {
      city: 'Ankara', country: 'Almanya',
      mood: 'strict',
      multiplier: 0.96,  // Ankara daha tedirgin, diplomatik odak
      segmentBonus: {
        public_sector: +0.06, // Devlet memuru için Ankara avantajlı — yakınlık
        employed:      +0.00,
        student:       -0.05,
        self_employed: -0.05,
        unemployed:    -0.07,
      },
      processingDays:      { min: 5, avg: 15, max: 45 },
      appointmentWaitDays: 60,
      peakMonths:          [3, 4, 5, 6],
      notes:
        'Daha az hacimli ama daha titiz. Diplomatik vize ağırlığı. ' +
        'Özel sektör çalışanı İstanbul\'u tercih etmeli. ' +
        'Kamu sektörü başvuruları burada daha hızlı işleniyor.',
      trendDir:    'stable',
      lastUpdated: 2025,
      sources: ['Ekşi Sözlük/almanya-ankara 2022-2024', 'Şikayetvar 2023', '[ESTIMATED]'],
    },
    'İzmir': {
      city: 'İzmir', country: 'Almanya',
      mood: 'moderate',
      multiplier: 1.02,  // Ege turizm profili — biraz daha toleranslı
      segmentBonus: {
        public_sector: +0.04,
        employed:      +0.03,
        retired:       +0.05, // Emekli turistler burada çok başvuruyor, tanıdık profil
        student:       -0.02,
        self_employed: -0.03,
        unemployed:    -0.05,
      },
      processingDays:      { min: 5, avg: 12, max: 35 },
      appointmentWaitDays: 45,
      peakMonths:          [5, 6, 7, 8],
      notes:
        'Ege bölgesi turizm profili ağırlıklı. İstanbul\'a göre randevu ' +
        'bekleme daha kısa. Emekli ve aile profilleri için görece iyi nokta.',
      trendDir:    'stable',
      lastUpdated: 2024,
      sources: ['Ekşi Sözlük/almanya-izmir', 'Şikayetvar 2022-2024', '[ESTIMATED]'],
    },
  },

  // ╔══════════════════════════════════════════════════════════╗
  // ║  FRANSA — TLScontact üzerinden                         ║
  // ╚══════════════════════════════════════════════════════════╝
  'Fransa': {
    'İstanbul': {
      city: 'İstanbul', country: 'Fransa',
      mood: 'moderate',
      multiplier: 0.99,
      segmentBonus: {
        public_sector: +0.04,
        employed:      +0.01,
        student:       -0.02,
        self_employed: -0.03,
        unemployed:    -0.05,
      },
      processingDays:      { min: 5, avg: 15, max: 30 },
      appointmentWaitDays: 40,
      peakMonths:          [5, 6, 7],
      notes:
        'TLScontact üzerinden işleniyor. Niyet mektubu kalitesi kritik; ' +
        '"Paris\'i görmek istiyorum" yetmiyor, günlük aktivite planı şart. ' +
        'Dil bariyer etkisi — Fransızcayla ya da iyi bir tercümeyle başvur.',
      trendDir:    'stable',
      lastUpdated: 2024,
      sources: ['Ekşi Sözlük/fransa-vizesi', 'r/schengen TR', 'Şikayetvar 2023'],
    },
    'Ankara': {
      city: 'Ankara', country: 'Fransa',
      mood: 'strict',
      multiplier: 0.95,
      segmentBonus: {
        public_sector: +0.05,
        employed:      -0.01,
        student:       -0.04,
        self_employed: -0.05,
        unemployed:    -0.07,
      },
      processingDays:      { min: 7, avg: 20, max: 40 },
      appointmentWaitDays: 30,
      peakMonths:          [4, 5, 6],
      notes:
        'Büyükelçilik odaklı. Daha az turist başvurusu, daha resmi profil. ' +
        'Diplomatik/kültürel bağlantısı olmayan turistler İstanbul\'u tercih etmeli. [ESTIMATED]',
      trendDir:    'stable',
      lastUpdated: 2024,
      sources: ['[ESTIMATED]', 'Ekşi Sözlük/fransa-ankara'],
    },
  },

  // ╔══════════════════════════════════════════════════════════╗
  // ║  HOLLANDA — Yüksek finansal eşik, VFS Global           ║
  // ╚══════════════════════════════════════════════════════════╝
  'Hollanda': {
    'İstanbul': {
      city: 'İstanbul', country: 'Hollanda',
      mood: 'moderate',
      multiplier: 0.97,
      segmentBonus: {
        public_sector: +0.03,
        employed:      +0.01,
        student:       -0.04,
        self_employed: -0.05,
        unemployed:    -0.07,
      },
      processingDays:      { min: 5, avg: 12, max: 25 },
      appointmentWaitDays: 35,
      peakMonths:          [4, 5, 6, 7],
      notes:
        'Finansal eşiği Schengen ortalamasının üzerinde (€120+/gün). ' +
        'Hareketsiz hesaba karşı sistematik kontrol. 2023\'te dijital belge ' +
        'doğrulama sistemi uygulamaya alındı.',
      trendDir:    'tightening',
      lastUpdated: 2025,
      sources: ['r/schengen TR 2023-2024', 'Ekşi Sözlük/hollanda-vizesi', 'Şikayetvar 2022-2024'],
    },
    'Ankara': {
      city: 'Ankara', country: 'Hollanda',
      mood: 'strict',
      multiplier: 0.94,
      segmentBonus: {
        public_sector: +0.04,
        employed:      +0.00,
        student:       -0.05,
        unemployed:    -0.08,
      },
      processingDays:      { min: 7, avg: 18, max: 35 },
      appointmentWaitDays: 25,
      peakMonths:          [4, 5, 6],
      notes: 'Daha az hacimli, daha resmi. Turistler İstanbul\'u tercih etmeli. [ESTIMATED]',
      trendDir:    'stable',
      lastUpdated: 2024,
      sources: ['[ESTIMATED]'],
    },
  },

  // ╔══════════════════════════════════════════════════════════╗
  // ║  İTALYA — En toleranslı büyük Schengen ülkesi          ║
  // ╚══════════════════════════════════════════════════════════╝
  'İtalya': {
    'İstanbul': {
      city: 'İstanbul', country: 'İtalya',
      mood: 'lenient',
      multiplier: 1.05,
      segmentBonus: {
        public_sector: +0.04,
        employed:      +0.03,
        retired:       +0.06, // Emekli turist İtalya konsoloslukta çok iyi karşılanıyor
        student:       +0.02,
        self_employed: +0.01,
        unemployed:    -0.02,
      },
      processingDays:      { min: 3, avg: 8, max: 20 },
      appointmentWaitDays: 20,
      peakMonths:          [5, 6, 7, 8, 9],
      notes:
        'Turistik odak. Konaklama belgesi özellikle önemli (Questura onaylı davet). ' +
        'Ret oranı Türkler için en düşük büyük Schengen ülkesi (%8.7). ' +
        'Sigorta kontrolü biraz daha titiz.',
      trendDir:    'stable',
      lastUpdated: 2025,
      sources: ['EU Schengen istatistikleri', 'Ekşi Sözlük/italya-vizesi', 'r/schengen TR'],
    },
    'Ankara': {
      city: 'Ankara', country: 'İtalya',
      mood: 'moderate',
      multiplier: 1.01,
      segmentBonus: {
        public_sector: +0.04,
        employed:      +0.02,
        retired:       +0.04,
        student:       +0.01,
        unemployed:    -0.03,
      },
      processingDays:      { min: 5, avg: 10, max: 25 },
      appointmentWaitDays: 15,
      peakMonths:          [5, 6, 7],
      notes: 'İstanbul\'dan biraz daha resmi ama yine de toleranslı. Randevu kolay bulunuyor.',
      trendDir:    'stable',
      lastUpdated: 2024,
      sources: ['[ESTIMATED]', 'Ekşi Sözlük/italya-ankara'],
    },
    'İzmir': {
      city: 'İzmir', country: 'İtalya',
      mood: 'lenient',
      multiplier: 1.06,
      segmentBonus: {
        retired:  +0.06,
        employed: +0.03,
        student:  +0.02,
      },
      processingDays:      { min: 3, avg: 7, max: 18 },
      appointmentWaitDays: 10,
      peakMonths:          [6, 7, 8],
      notes: 'En düşük bekleme süreli İtalya konsolosluğu. Ege turizm profili mükemmel uyum. [ESTIMATED]',
      trendDir:    'stable',
      lastUpdated: 2024,
      sources: ['[ESTIMATED]'],
    },
  },

  // ╔══════════════════════════════════════════════════════════╗
  // ║  İSPANYA — İkinci en toleranslı büyük Schengen          ║
  // ╚══════════════════════════════════════════════════════════╝
  'İspanya': {
    'İstanbul': {
      city: 'İstanbul', country: 'İspanya',
      mood: 'lenient',
      multiplier: 1.04,
      segmentBonus: {
        public_sector: +0.04,
        employed:      +0.03,
        retired:       +0.05,
        student:       +0.02,
        self_employed: +0.01,
        unemployed:    -0.01,
      },
      processingDays:      { min: 5, avg: 10, max: 20 },
      appointmentWaitDays: 25,
      peakMonths:          [5, 6, 7, 8],
      notes:
        'Turistik odak güçlü. Ret oranı %10 civarında tolere edilebilir. ' +
        'Konaklama + sigorta belgesi yeterli çoğu zaman. ' +
        'Niyet mektubunda destinasyon özgünlüğü önemli.',
      trendDir:    'stable',
      lastUpdated: 2024,
      sources: ['Ekşi Sözlük/ispanya-vizesi', 'r/schengen TR', 'Şikayetvar 2022-2024'],
    },
    'Ankara': {
      city: 'Ankara', country: 'İspanya',
      mood: 'moderate',
      multiplier: 1.01,
      segmentBonus: { public_sector: +0.04, employed: +0.01, unemployed: -0.03 },
      processingDays:      { min: 5, avg: 12, max: 25 },
      appointmentWaitDays: 20,
      peakMonths:          [5, 6, 7],
      notes: 'İstanbul\'a kıyasla biraz daha resmi. [ESTIMATED]',
      trendDir: 'stable', lastUpdated: 2024,
      sources: ['[ESTIMATED]'],
    },
  },

  // ╔══════════════════════════════════════════════════════════╗
  // ║  YUNANİSTAN — En düşük ret oranlı Schengen ülkesi      ║
  // ╚══════════════════════════════════════════════════════════╝
  'Yunanistan': {
    'İstanbul': {
      city: 'İstanbul', country: 'Yunanistan',
      mood: 'lenient',
      multiplier: 1.07,
      segmentBonus: {
        public_sector: +0.04,
        employed:      +0.04,
        retired:       +0.06,
        student:       +0.04,
        self_employed: +0.03,
        unemployed:    +0.01,
      },
      processingDays:      { min: 2, avg: 5, max: 15 },
      appointmentWaitDays: 10,
      peakMonths:          [5, 6, 7, 8, 9],
      notes:
        'Türk başvuruculara en toleranslı Schengen konsolosluğu. ' +
        'Coğrafi yakınlık + turizm önceliği. Randevu bekleme minimum. ' +
        'İlk Schengen deneyimi için ideal başlangıç noktası.',
      trendDir:    'stable',
      lastUpdated: 2025,
      sources: ['EU Schengen istatistikleri', 'Ekşi Sözlük/yunanistan-vizesi', 'r/schengen TR'],
    },
    'Ankara': {
      city: 'Ankara', country: 'Yunanistan',
      mood: 'lenient',
      multiplier: 1.04,
      segmentBonus: { public_sector: +0.04, employed: +0.03, retired: +0.05, student: +0.03 },
      processingDays:      { min: 3, avg: 7, max: 15 },
      appointmentWaitDays: 8,
      peakMonths:          [5, 6, 7, 8],
      notes: 'İstanbul\'dan biraz daha az hacimli ama yine toleranslı. [ESTIMATED]',
      trendDir: 'stable', lastUpdated: 2024,
      sources: ['[ESTIMATED]'],
    },
    'İzmir': {
      city: 'İzmir', country: 'Yunanistan',
      mood: 'lenient',
      multiplier: 1.09,  // Ege adaları yakınlığı — maksimum tolerans
      segmentBonus: {
        employed: +0.04, retired: +0.07, student: +0.04,
        self_employed: +0.03, unemployed: +0.02,
      },
      processingDays:      { min: 2, avg: 4, max: 12 },
      appointmentWaitDays: 5,
      peakMonths:          [6, 7, 8],
      notes:
        'Türkiye\'de en hızlı vize alabileceğiniz nokta. Ege adaları ziyareti ağırlıklı. ' +
        'Günübirlik ada turları için bile kullanılıyor.',
      trendDir:    'stable',
      lastUpdated: 2025,
      sources: ['Ekşi Sözlük/izmir-yunanistan', 'r/schengen TR', 'Şikayetvar'],
    },
  },

  // ╔══════════════════════════════════════════════════════════╗
  // ║  AVUSTURYA                                              ║
  // ╚══════════════════════════════════════════════════════════╝
  'Avusturya': {
    'İstanbul': {
      city: 'İstanbul', country: 'Avusturya',
      mood: 'moderate',
      multiplier: 1.00,
      segmentBonus: {
        public_sector: +0.04, employed: +0.02,
        student: -0.02, self_employed: -0.03, unemployed: -0.05,
      },
      processingDays:      { min: 5, avg: 12, max: 30 },
      appointmentWaitDays: 30,
      peakMonths:          [5, 6, 7],
      notes:
        'Orta düzey sıkılık. Öceki Schengen deneyimi varsa kolaylaşıyor. ' +
        'SGK + banka dökümü + niyet mektubu standart paketi yeterli.',
      trendDir:    'stable',
      lastUpdated: 2024,
      sources: ['Ekşi Sözlük/avusturya-vizesi', 'r/schengen TR'],
    },
    'Ankara': {
      city: 'Ankara', country: 'Avusturya',
      mood: 'moderate',
      multiplier: 0.97,
      segmentBonus: { public_sector: +0.05, employed: +0.01, unemployed: -0.06 },
      processingDays:      { min: 7, avg: 15, max: 30 },
      appointmentWaitDays: 20,
      peakMonths:          [4, 5, 6],
      notes: 'Büyükelçilik daha resmi. Kamu çalışanı için biraz avantajlı. [ESTIMATED]',
      trendDir: 'stable', lastUpdated: 2024,
      sources: ['[ESTIMATED]'],
    },
  },

  // ╔══════════════════════════════════════════════════════════╗
  // ║  İSVEÇ — Kuzey Avrupa sıkılığı                        ║
  // ╚══════════════════════════════════════════════════════════╝
  'İsveç': {
    'İstanbul': {
      city: 'İstanbul', country: 'İsveç',
      mood: 'strict',
      multiplier: 0.96,
      segmentBonus: {
        public_sector: +0.05, employed: +0.02,
        student: -0.06, self_employed: -0.06, unemployed: -0.09,
      },
      processingDays:      { min: 10, avg: 20, max: 45 },
      appointmentWaitDays: 35,
      peakMonths:          [4, 5, 6, 7],
      notes:
        'Geri dönüş bağı kanıtlama çıtası yüksek. Kuzey Avrupa standartları. ' +
        '5+ yıl iş kıdemi veya mülk sahibi olmak büyük fark yaratıyor. ' +
        'Öğrenci ve serbest meslek profili için zorlu.',
      trendDir:    'tightening',
      lastUpdated: 2024,
      sources: ['Ekşi Sözlük/isveç-vizesi', 'r/schengen TR', 'Şikayetvar 2022-2024'],
    },
    'Ankara': {
      city: 'Ankara', country: 'İsveç',
      mood: 'strict',
      multiplier: 0.94,
      segmentBonus: { public_sector: +0.05, employed: +0.01, student: -0.07, unemployed: -0.10 },
      processingDays:      { min: 12, avg: 25, max: 50 },
      appointmentWaitDays: 25,
      peakMonths:          [3, 4, 5, 6],
      notes: 'İstanbul\'dan daha az hacim ama eşit sıkılık. [ESTIMATED]',
      trendDir: 'tightening', lastUpdated: 2024,
      sources: ['[ESTIMATED]'],
    },
  },

  // ╔══════════════════════════════════════════════════════════╗
  // ║  NORVEÇ — En az başvuru alınan Schengen ülkesi         ║
  // ╚══════════════════════════════════════════════════════════╝
  'Norveç': {
    'İstanbul': {
      city: 'İstanbul', country: 'Norveç',
      mood: 'strict',
      multiplier: 0.96,
      segmentBonus: {
        public_sector: +0.05, employed: +0.02,
        student: -0.06, self_employed: -0.05, unemployed: -0.09,
      },
      processingDays:      { min: 10, avg: 20, max: 40 },
      appointmentWaitDays: 30,
      peakMonths:          [4, 5, 6],
      notes:
        'Ret oranı Türkler için %20. Finansal + geri dönüş bağ kanıtı çok güçlü olmalı. ' +
        'VFS Global üzerinden; belgeler çok dikkatli inceleniyor. [ESTIMATED]',
      trendDir:    'stable',
      lastUpdated: 2024,
      sources: ['EU Schengen istatistikleri', 'r/schengen TR', '[ESTIMATED]'],
    },
  },

  // ╔══════════════════════════════════════════════════════════╗
  // ║  DANİMARKA — %66 ret oranı — en zorlu Schengen         ║
  // ╚══════════════════════════════════════════════════════════╝
  'Danimarka': {
    'İstanbul': {
      city: 'İstanbul', country: 'Danimarka',
      mood: 'strict',
      multiplier: 0.92,  // %66 ret oranı — en kısıtlayıcı Schengen ülkesi
      segmentBonus: {
        public_sector: +0.06,
        employed:      +0.03,
        student:       -0.08,
        self_employed: -0.08,
        unemployed:    -0.12,
      },
      processingDays:      { min: 15, avg: 30, max: 60 },
      appointmentWaitDays: 40,
      peakMonths:          [3, 4, 5, 6],
      notes:
        'Türk başvurucular için %66 ret oranıyla açık ara en zor Schengen ülkesi. ' +
        'Zorunlu olmadıkça başvurma. Önceki Schengen geçmişi yoksa başvurma. ' +
        'Kamu çalışanı + 5+ yıl kıdem + mülk sahibi = minimum şart.',
      trendDir:    'tightening',
      lastUpdated: 2025,
      sources: ['EU Schengen istatistikleri 2023-2024', 'Ekşi Sözlük/danimarka-vizesi', 'r/schengen TR'],
    },
    'Ankara': {
      city: 'Ankara', country: 'Danimarka',
      mood: 'strict',
      multiplier: 0.90,
      segmentBonus: { public_sector: +0.06, employed: +0.02, student: -0.09, unemployed: -0.13 },
      processingDays:      { min: 20, avg: 35, max: 70 },
      appointmentWaitDays: 30,
      peakMonths:          [3, 4, 5],
      notes: 'İstanbul\'dan bile daha sıkı olduğu raporlanıyor. [ESTIMATED]',
      trendDir: 'tightening', lastUpdated: 2024,
      sources: ['[ESTIMATED]'],
    },
  },

  // ╔══════════════════════════════════════════════════════════╗
  // ║  BELÇİKA                                               ║
  // ╚══════════════════════════════════════════════════════════╝
  'Belçika': {
    'İstanbul': {
      city: 'İstanbul', country: 'Belçika',
      mood: 'moderate',
      multiplier: 0.99,
      segmentBonus: {
        public_sector: +0.04, employed: +0.01,
        student: -0.02, unemployed: -0.05,
      },
      processingDays:      { min: 5, avg: 15, max: 30 },
      appointmentWaitDays: 30,
      peakMonths:          [4, 5, 6, 7],
      notes: 'Orta zorluk. Brüksel odaklı iş seyahati başvuruları daha kolay. Turist başvurularında normal Schengen çıtası.',
      trendDir:    'stable',
      lastUpdated: 2024,
      sources: ['Ekşi Sözlük/belçika-vizesi', 'r/schengen TR'],
    },
  },

  // ╔══════════════════════════════════════════════════════════╗
  // ║  POLONYA — Görece kolay, VFS üzerinden                 ║
  // ╚══════════════════════════════════════════════════════════╝
  'Polonya': {
    'İstanbul': {
      city: 'İstanbul', country: 'Polonya',
      mood: 'lenient',
      multiplier: 1.03,
      segmentBonus: {
        public_sector: +0.03, employed: +0.03,
        retired: +0.04, student: +0.01, unemployed: -0.02,
      },
      processingDays:      { min: 5, avg: 10, max: 20 },
      appointmentWaitDays: 15,
      peakMonths:          [5, 6, 7],
      notes: 'Ret oranı %9 ile düşük. Görece kolay Schengen ülkesi. İlk Schengen için iyi alternatif.',
      trendDir:    'stable',
      lastUpdated: 2024,
      sources: ['Ekşi Sözlük', 'r/schengen TR'],
    },
  },

  // ╔══════════════════════════════════════════════════════════╗
  // ║  İSVİÇRE — Yüksek finansal eşik, Schengen dışı       ║
  // ╚══════════════════════════════════════════════════════════╝
  'İsviçre': {
    'İstanbul': {
      city: 'İstanbul', country: 'İsviçre',
      mood: 'strict',
      multiplier: 0.96,
      segmentBonus: {
        public_sector: +0.05, employed: +0.02,
        retired: +0.04, student: -0.04, self_employed: -0.04, unemployed: -0.07,
      },
      processingDays:      { min: 10, avg: 20, max: 40 },
      appointmentWaitDays: 30,
      peakMonths:          [4, 5, 6, 7],
      notes:
        'Schengen üyesi ama ayrı vize prosedürü. €150/gün finansal eşik. ' +
        'Bankacılık/finans bağlantısı olan başvurular daha kolay.',
      trendDir:    'stable',
      lastUpdated: 2024,
      sources: ['Ekşi Sözlük/isviçre-vizesi', 'r/schengen TR'],
    },
    'Ankara': {
      city: 'Ankara', country: 'İsviçre',
      mood: 'strict',
      multiplier: 0.94,
      segmentBonus: { public_sector: +0.05, employed: +0.01, unemployed: -0.08 },
      processingDays:      { min: 12, avg: 22, max: 45 },
      appointmentWaitDays: 20,
      peakMonths:          [4, 5, 6],
      notes: 'Büyükelçilik — daha resmi. [ESTIMATED]',
      trendDir: 'stable', lastUpdated: 2024,
      sources: ['[ESTIMATED]'],
    },
  },

  // ╔══════════════════════════════════════════════════════════╗
  // ║  İNGİLTERE — UKVI, en pahalı, en sıkı                 ║
  // ╚══════════════════════════════════════════════════════════╝
  'İngiltere': {
    'İstanbul': {
      city: 'İstanbul', country: 'İngiltere',
      mood: 'strict',
      multiplier: 1.00,  // UK baseline
      segmentBonus: {
        public_sector: +0.07, // UK kamu çalışanına en olumlu ülke
        employed:      +0.03,
        retired:       +0.04,
        student:       -0.06,
        self_employed: -0.07,
        unemployed:    -0.09,
      },
      processingDays:      { min: 15, avg: 21, max: 60 },
      appointmentWaitDays: 20,
      peakMonths:          [4, 5, 6, 7, 8],
      notes:
        'UKVI üzerinden, tam online başvuru. Ret oranı %30. ' +
        '28 gün kuralı ve 6 aylık ekstre zorunlu. Cover letter kalitesi kritik. ' +
        '"Gerçek ziyaretçi testi" V4.2 çok titiz uygulanıyor. ' +
        'Vize ücreti artışı (2024: £115) başvurucu sayısını azalttı.',
      trendDir:    'tightening',
      lastUpdated: 2025,
      sources: ['UK Home Office istatistikleri', 'r/ukvisa TR 2022-2025', 'Ekşi Sözlük/ingiltere-vizesi', 'Şikayetvar 2022-2025'],
    },
    'Ankara': {
      city: 'Ankara', country: 'İngiltere',
      mood: 'strict',
      multiplier: 0.96,
      segmentBonus: {
        public_sector: +0.08, // Diplomatik yakınlık kamu sektörü için çok avantajlı
        employed: +0.02, student: -0.07, unemployed: -0.10,
      },
      processingDays:      { min: 15, avg: 25, max: 60 },
      appointmentWaitDays: 15,
      peakMonths:          [4, 5, 6, 7],
      notes:
        'İstanbul\'dan biraz daha az hacimli. Diplomatik ağırlık var. ' +
        'Kamu sektörü Ankara\'dan başvurabilir — biraz avantajlı.',
      trendDir:    'tightening',
      lastUpdated: 2025,
      sources: ['Ekşi Sözlük/ingiltere-ankara', 'r/ukvisa TR', '[ESTIMATED]'],
    },
  },

  // ╔══════════════════════════════════════════════════════════╗
  // ║  ABD — Mülakat zorunlu, en uzun bekleme                ║
  // ╚══════════════════════════════════════════════════════════╝
  'ABD': {
    'İstanbul': {
      city: 'İstanbul', country: 'ABD',
      mood: 'strict',
      multiplier: 1.00,  // ABD baseline
      segmentBonus: {
        public_sector: +0.05,
        employed:      +0.02,
        retired:       +0.02,
        student:       -0.06,  // Öğrenci = göç şüphesi yüksek
        self_employed: -0.05,
        unemployed:    -0.08,
      },
      processingDays:      { min: 1, avg: 2, max: 5 },  // Mülakat günü hemen karar
      appointmentWaitDays: 188, // 2024 ortalaması — İstanbul
      peakMonths:          [3, 4, 5, 6, 7],
      notes:
        'Randevu bekleme 2023-2024\'te 180-220 gün. Mülakat zorunlu. ' +
        '214(b) en büyük risk — geri dönüş bağı somut kanıtlanmalı. ' +
        'Admin processing 2023\'te %40 arttı. DS-160 sosyal medya sorgusu zorunlu.',
      trendDir:    'tightening',
      lastUpdated: 2025,
      sources: [
        'US Dept of State NIV istatistikleri 2023-2024',
        'r/usvisa TR 2022-2025',
        'Ekşi Sözlük/abd-mulakat',
        'Twitter/X #abdvizesi 2023-2024',
      ],
    },
    'Ankara': {
      city: 'Ankara', country: 'ABD',
      mood: 'strict',
      multiplier: 0.98,
      segmentBonus: {
        public_sector: +0.06, // Ankara Büyükelçiliği devlet çalışanlarına biraz daha pozitif
        employed:      +0.01,
        student:       -0.07,
        unemployed:    -0.09,
      },
      processingDays:      { min: 1, avg: 2, max: 5 },
      appointmentWaitDays: 175, // 2024 — İstanbul'dan biraz kısa
      peakMonths:          [3, 4, 5, 6],
      notes:
        'İstanbul\'a benzer süreç. Bekleme biraz daha kısa ama fark az. ' +
        '214(b) aynı şekilde uygulanıyor. Admin processing kuyruğu ortak.',
      trendDir:    'tightening',
      lastUpdated: 2025,
      sources: ['US Dept of State', 'r/usvisa TR', 'Ekşi Sözlük/abd-ankara'],
    },
  },

  // ╔══════════════════════════════════════════════════════════╗
  // ║  PORTEKİZ — Düşük ret, az bilinen alternatif           ║
  // ╚══════════════════════════════════════════════════════════╝
  'Portekiz': {
    'İstanbul': {
      city: 'İstanbul', country: 'Portekiz',
      mood: 'lenient',
      multiplier: 1.04,
      segmentBonus: {
        public_sector: +0.04, employed: +0.03,
        retired: +0.05, student: +0.02, unemployed: -0.01,
      },
      processingDays:      { min: 5, avg: 12, max: 25 },
      appointmentWaitDays: 20,
      peakMonths:          [5, 6, 7, 8],
      notes:
        'Ret oranı %9 ile düşük. Az bilinen iyi alternatif. ' +
        'Turizm yoğun — Portekiz üzerinden diğer Schengen ülkelerine de girilebilir.',
      trendDir:    'stable',
      lastUpdated: 2024,
      sources: ['Ekşi Sözlük/portekiz-vizesi', 'r/schengen TR', 'EU istatistikleri'],
    },
  },

  // ╔══════════════════════════════════════════════════════════╗
  // ║  MACARİSTAN — Düşük ret, alternatif giriş noktası     ║
  // ╚══════════════════════════════════════════════════════════╝
  'Macaristan': {
    'İstanbul': {
      city: 'İstanbul', country: 'Macaristan',
      mood: 'lenient',
      multiplier: 1.04,
      segmentBonus: {
        employed: +0.03, retired: +0.04, student: +0.02, unemployed: -0.01,
      },
      processingDays:      { min: 5, avg: 10, max: 20 },
      appointmentWaitDays: 15,
      peakMonths:          [5, 6, 7],
      notes: 'Ret oranı %8 ile çok düşük. Az başvuru var, hızlı işleniyor. İlk Schengen için iyi.',
      trendDir:    'stable',
      lastUpdated: 2024,
      sources: ['EU Schengen istatistikleri', 'r/schengen TR'],
    },
  },
};
