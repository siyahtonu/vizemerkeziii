// ============================================================
// Mevsimsellik & Politik Olay Motoru — v1.0
// ============================================================
// "Şu an mı başvursam, yoksa beklesem mi?" sorusunun cevabı.
//
// Model:
//   1. MONTHLY_SIGNALS   → ülke × ay: hacim, inceleme derinliği, wait süresi
//   2. POLITICAL_EVENTS  → tarih bazlı konsolosluk sertleşme/gevşeme sinyalleri
//   3. getSeasonalWindow → belirli ay + ülke için anlık risk skoru (0-1)
//   4. getTimingAdvice   → "şimdi başvur / X ay bekle / acele et" önerisi
//
// Kaynak:
//   • VFS Global TR randevu istatistikleri 2020-2025
//   • EU Schengen Visa Statistics sezonsal rapor 2023-2024
//   • Ekşi Sözlük/Şikayetvar randevu thread'leri
//   • UK Home Office, US DOS aylık NIV istatistikleri
//   • Avrupa seçim takvimleri + göç politikası haberleri
// ============================================================

// ── Tipler ───────────────────────────────────────────────────────────────────

export type ScrutinyLevel = 'surface' | 'normal' | 'deep';
export type TimingRec    = 'apply_now' | 'wait' | 'caution' | 'rush_before';

export interface MonthlySignal {
  /** 0.4 (çok düşük) → 1.5 (yaz zirvesi) — normalize: 1.0 = yıl ortalaması */
  volumeIndex: number;
  /** İnceleme derinliği: yoğun dönemde surface, düşük sezonda deep */
  scrutiny: ScrutinyLevel;
  /** Bu ayda randevu bekleme günü (konsolan CONSULATE_MATRIX.appointmentWaitDays × bu çarpan) */
  waitMultiplier: number;
  /** Risk düzeltici: güçlü profil için yoğun sezon hafif avantajlı (+), zayıf profil dezavantajlı (-) */
  riskNote: string;
}

export interface PoliticalEvent {
  id:          string;
  name:        string;
  countries:   string[];    // Etkilenen ülkeler — [] = tüm Schengen
  /** ISO tarih aralığı, undefined = hâlâ sürmekte */
  dateRange:   { start: string; end?: string };
  impact:      'tightening' | 'neutral' | 'loosening';
  /** Tavsiye skoru üzerine eklenecek değer (pozitif = kötüleşme) */
  riskDelta:   number;
  severity:    'low' | 'medium' | 'high';
  description: string;
  source:      string;
}

export interface SeasonalWindow {
  month:           number;        // 1-12
  year:            number;
  volumeIndex:     number;        // Başvuru hacmi
  scrutiny:        ScrutinyLevel; // İnceleme derinliği
  waitMultiplier:  number;        // Randevu bekleme çarpanı
  /** Aktif politik olaylar bu ay için */
  activeEvents:    PoliticalEvent[];
  /** 0.0-1.0: 0 = en kötü ay, 1 = en iyi ay */
  windowScore:     number;
  /** Güçlü profil için ek avantaj/dezavantaj */
  strongProfileBonus: number;
  /** Zayıf profil için ek avantaj/dezavantaj */
  weakProfilePenalty: number;
}

export interface TimingAdvice {
  recommendation:      TimingRec;
  /** Kaç ay beklenmeli (wait ise) */
  waitMonths?:         number;
  /** Beklenmesi önerilen hedef ay (1-12) */
  targetMonth?:        number;
  targetMonthName?:    string;
  headline:            string;       // Kısa başlık (UI büyük text)
  reason:              string;       // Ana gerekçe
  urgencyNote?:        string;       // "Şu an ideal pencere" veya "Fırsat kapanıyor"
  currentWindowScore:  number;       // Şu anki pencere skoru 0-1
  bestWindowScore:     number;       // Önümüzdeki 6 ayda en iyi pencere skoru
  bestWindowMonth:     number;
  appointmentWaitEst:  number;       // Bu ay için tahmini randevu bekleme (gün)
  activeWarnings:      string[];     // Politik olay uyarıları
  seasonalMultiplier:  number;       // calculateScore'a uygulanacak çarpan (0.90-1.08)
}

// ── Ay İsimleri ───────────────────────────────────────────────────────────────
export const MONTH_NAMES: Record<number, string> = {
  1:'Ocak', 2:'Şubat', 3:'Mart', 4:'Nisan', 5:'Mayıs', 6:'Haziran',
  7:'Temmuz', 8:'Ağustos', 9:'Eylül', 10:'Ekim', 11:'Kasım', 12:'Aralık',
};

// ── Aylık Hacim & İnceleme Sinyalleri ────────────────────────────────────────
// Yapı: MONTHLY_SIGNALS[ülke][ay (1-12)] = MonthlySignal
// Not: Ülke tanımsızsa SCHENGEN_DEFAULT kullanılır.
// Kaynak: VFS hacim verileri + Ekşi/Şikayetvar thread analizi + EU istatistikleri
// ─────────────────────────────────────────────────────────────────────────────

const mkSig = (
  volumeIndex: number,
  scrutiny: ScrutinyLevel,
  waitMultiplier: number,
  riskNote: string,
): MonthlySignal => ({ volumeIndex, scrutiny, waitMultiplier, riskNote });

/** Schengen varsayılanı — ülkeye özgü veri yoksa kullanılır */
const SCHENGEN_DEFAULT: Record<number, MonthlySignal> = {
   1: mkSig(0.50, 'deep',    0.55, 'Kış: düşük hacim, derin inceleme. Güçlü profil için ideal.'),
   2: mkSig(0.55, 'deep',    0.60, 'Kış: düşük hacim, derin inceleme. Güçlü profil için ideal.'),
   3: mkSig(0.80, 'normal',  0.80, 'Yükseliş: yaz randevuları alınmaya başladı. İyi pencere.'),
   4: mkSig(1.05, 'normal',  1.00, 'İlkbahar: orta yoğunluk. Dengeli risk/fırsat.'),
   5: mkSig(1.25, 'surface', 1.25, 'Yaz öncesi zirve. Randevu bekleme uzuyor.'),
   6: mkSig(1.45, 'surface', 1.50, 'ZİRVE: çok yüksek hacim. Güçlü profil hızlı geçer, zayıf hızlı reddedilir.'),
   7: mkSig(1.40, 'surface', 1.45, 'ZİRVE: çok yüksek hacim. Aynı dinamik.'),
   8: mkSig(1.20, 'surface', 1.30, 'Yüksek: personel izinde, hacim hâlâ büyük.'),
   9: mkSig(1.00, 'normal',  1.05, 'Normalleşiyor. Sonbahar kapısı açılıyor.'),
  10: mkSig(0.75, 'normal',  0.80, 'Sonbahar: iyi denge. Güçlü profil için tercih edilir.'),
  11: mkSig(0.60, 'deep',    0.65, 'Düşük sezon: detaylı inceleme. Zayıf profil dikkatli olmalı.'),
  12: mkSig(0.45, 'deep',    0.55, 'En düşük hacim. Güçlü profil için yıl içinde en iyi pencere.'),
};

export const MONTHLY_SIGNALS: Record<string, Record<number, MonthlySignal>> = {

  'Almanya': {
     1: mkSig(0.45, 'deep',    0.50, 'Kış: kıdemli memurlar daha titiz. Güçlü dosya için en iyi ay.'),
     2: mkSig(0.50, 'deep',    0.55, 'Seçim sonrası (Şub 2025 CDU hükümeti) politika belirsizliği azaldı.'),
     3: mkSig(0.85, 'normal',  0.85, 'Yaz randevuları açılıyor. Başvurun yoksa üç ayda kapanır.'),
     4: mkSig(1.10, 'normal',  1.10, 'Orta yoğunluk. Randevu almak güçleşiyor.'),
     5: mkSig(1.30, 'surface', 1.35, 'Yaz öncesi zirve başlangıcı. VFS kuyruk.'),
     6: mkSig(1.50, 'surface', 1.65, 'KRİTİK ZİRVE: 2023-2024 ortalaması 180 gün bekleme.'),
     7: mkSig(1.45, 'surface', 1.55, 'Zirve devam: hızlı karar ama yüzeysel inceleme.'),
     8: mkSig(1.15, 'surface', 1.25, 'Personel izni + hâlâ yüksek hacim = riskli kombinasyon.'),
     9: mkSig(0.90, 'normal',  0.95, 'Yaz bitti, işler normalize oluyor.'),
    10: mkSig(0.70, 'normal',  0.75, 'Sonbahar: yılın ikinci iyi penceresi.'),
    11: mkSig(0.55, 'deep',    0.60, 'Düşük sezon: ideal. Randevu kolay, inceleme kaliteli.'),
    12: mkSig(0.40, 'deep',    0.50, 'Yıl sonu: en az başvuru. Kamu çalışanı + güçlü dosya için altın pencere.'),
  },

  'Fransa': {
     1: mkSig(0.50, 'deep',    0.55, 'Düşük hacim, detaylı inceleme.'),
     2: mkSig(0.55, 'deep',    0.60, 'Kış sonu, iyi pencere.'),
     3: mkSig(0.80, 'normal',  0.85, 'Yükseliş başlıyor.'),
     4: mkSig(1.10, 'normal',  1.05, 'İlkbahar: orta yoğunluk.'),
     5: mkSig(1.30, 'surface', 1.30, 'Büyük tatil öncesi birikim.'),
     6: mkSig(1.50, 'surface', 1.55, 'Zirve. TLScontact kuyruk.'),
     7: mkSig(1.45, 'surface', 1.45, 'Fransız tatili + turizm zirvesi.'),
     8: mkSig(1.00, 'surface', 1.10, 'Büyük bölümü tatilde → dikkat.'),
     9: mkSig(0.95, 'normal',  0.95, 'Okul başlangıcı + normalleşme.'),
    10: mkSig(0.75, 'normal',  0.80, 'İyi sonbahar penceresi.'),
    11: mkSig(0.60, 'deep',    0.65, 'Düşük hacim, kaliteli inceleme.'),
    12: mkSig(0.45, 'deep',    0.55, 'Yılbaşı döneminde minimum hacim.'),
  },

  'Hollanda': {
     1: mkSig(0.50, 'deep',    0.55, 'Kış: mükemmel pencere.'),
     2: mkSig(0.55, 'deep',    0.60, 'Kış: güçlü dosya için ideal.'),
     3: mkSig(0.85, 'normal',  0.90, 'Tulip sezonu öncesi artış.'),
     4: mkSig(1.15, 'normal',  1.15, 'Lale festivali + bahar turizmi.'),
     5: mkSig(1.35, 'surface', 1.40, 'Zirveye yaklaşılıyor.'),
     6: mkSig(1.50, 'surface', 1.55, 'Zirve. Finansal kontrolü artırıldı.'),
     7: mkSig(1.40, 'surface', 1.45, 'Yoğun, yüzeysel işlem.'),
     8: mkSig(1.20, 'surface', 1.30, 'Personel izni + hacim.'),
     9: mkSig(0.95, 'normal',  0.95, 'İyi geçiş ayı.'),
    10: mkSig(0.75, 'normal',  0.80, 'Sonbahar: tercih edilir.'),
    11: mkSig(0.60, 'deep',    0.65, 'Düşük hacim.'),
    12: mkSig(0.45, 'deep',    0.55, 'Yıl sonu: minimum.'),
  },

  'İtalya': {
     1: mkSig(0.50, 'normal',  0.60, 'Kış: düşük hacim ama normal inceleme (İtalya her ay toleranslı).'),
     2: mkSig(0.55, 'normal',  0.65, 'Orta kış, iyi.'),
     3: mkSig(0.85, 'normal',  0.85, 'Bahar başlangıcı.'),
     4: mkSig(1.15, 'normal',  1.10, 'Paskalya turizmi.'),
     5: mkSig(1.40, 'normal',  1.30, 'Yoğun ama toleranslı kalıyor.'),
     6: mkSig(1.55, 'surface', 1.50, 'Turizm zirvesi. Hızlı onay dominant.'),
     7: mkSig(1.50, 'surface', 1.45, 'Zirve devam.'),
     8: mkSig(1.30, 'surface', 1.35, 'Ferragosto tatili → dikkat et.'),
     9: mkSig(1.05, 'normal',  1.05, 'Normalleşme başlıyor.'),
    10: mkSig(0.80, 'normal',  0.80, 'Sonbahar: iyi pencere.'),
    11: mkSig(0.60, 'normal',  0.65, 'Düşük hacim.'),
    12: mkSig(0.45, 'normal',  0.55, 'Yıl sonu: az başvuru.'),
  },

  'İspanya': {
     1: mkSig(0.50, 'normal',  0.60, 'Kış: makul pencere.'),
     2: mkSig(0.55, 'normal',  0.65, 'Kış sonu.'),
     3: mkSig(0.90, 'normal',  0.90, 'Yükseliş.'),
     4: mkSig(1.20, 'normal',  1.15, 'Semana Santa turizmi.'),
     5: mkSig(1.40, 'surface', 1.35, 'Yaz başlangıcı.'),
     6: mkSig(1.55, 'surface', 1.50, 'Zirve.'),
     7: mkSig(1.50, 'surface', 1.45, 'Yaz tatili zirvesi.'),
     8: mkSig(1.35, 'surface', 1.40, 'İspanya ağırlıklı olarak tatilde.'),
     9: mkSig(1.05, 'normal',  1.05, 'Normalleşme.'),
    10: mkSig(0.80, 'normal',  0.80, 'İyi sonbahar.'),
    11: mkSig(0.60, 'normal',  0.65, 'Düşük hacim.'),
    12: mkSig(0.45, 'normal',  0.55, 'Minimum.'),
  },

  'Yunanistan': {
     1: mkSig(0.40, 'normal',  0.50, 'En düşük hacim. Hızlı işlem.'),
     2: mkSig(0.45, 'normal',  0.55, 'Kış sonu.'),
     3: mkSig(0.80, 'normal',  0.75, 'Yunanistan tüm yıl düşük kuyruğu korur.'),
     4: mkSig(1.10, 'normal',  1.00, 'Paskalya turizmi başlıyor.'),
     5: mkSig(1.50, 'surface', 1.30, 'Ada turizmi zirvesi.'),
     6: mkSig(1.60, 'surface', 1.40, 'Yazın en yüksek noktası.'),
     7: mkSig(1.55, 'surface', 1.35, 'Yoğun ama Yunanistan hızlı işler.'),
     8: mkSig(1.40, 'surface', 1.25, 'Yüksek ama yönetilebilir.'),
     9: mkSig(1.10, 'normal',  1.00, 'Eylül: yaz bitti, turizm hâlâ aktif.'),
    10: mkSig(0.80, 'normal',  0.75, 'İyi sonbahar.'),
    11: mkSig(0.55, 'normal',  0.60, 'Düşük.'),
    12: mkSig(0.40, 'normal',  0.50, 'Yıl sonu minimum.'),
  },

  'İngiltere': {
     1: mkSig(0.55, 'deep',    0.55, 'Kış: UKVI titiz. Güçlü dosya için ideal.'),
     2: mkSig(0.60, 'deep',    0.60, 'Kış sonu, aynı dinamik.'),
     3: mkSig(0.85, 'normal',  0.85, 'İlkbahar başlangıcı.'),
     4: mkSig(1.10, 'normal',  1.05, 'Bank holiday + Paskalya.'),
     5: mkSig(1.30, 'surface', 1.25, 'Yaz öncesi birikim.'),
     6: mkSig(1.45, 'surface', 1.40, 'Yaz zirvesi.'),
     7: mkSig(1.40, 'surface', 1.35, 'Devam.'),
     8: mkSig(1.20, 'surface', 1.25, 'Personel izni, hacim hâlâ yüksek.'),
     9: mkSig(0.95, 'normal',  0.95, 'Normalize.'),
    10: mkSig(0.75, 'normal',  0.80, 'Sonbahar iyi pencere.'),
    11: mkSig(0.60, 'deep',    0.65, 'Düşük. UKVI titiz.'),
    12: mkSig(0.50, 'deep',    0.60, 'Yıl sonu: UKVI dikkatli ama kapasiteli.'),
  },

  'ABD': {
     // ABD için yıl içi dinamik: bekleme 180+ gün → mevsim etkisi ikincil
     1: mkSig(0.85, 'normal',  0.88, 'Kış: kısmen düşük bekleme (170 gün civarı).'),
     2: mkSig(0.80, 'normal',  0.82, 'Şubat: yılın en kısa bekleme ayı (~160 gün).'),
     3: mkSig(0.95, 'normal',  1.00, 'Yükseliş başlıyor.'),
     4: mkSig(1.10, 'normal',  1.10, 'Yaz seyahati için başvurular birikti.'),
     5: mkSig(1.20, 'surface', 1.20, 'Zirveye yaklaşıyor.'),
     6: mkSig(1.30, 'surface', 1.30, 'Yaz zirvesi. 220+ gün bekleme olası.'),
     7: mkSig(1.25, 'surface', 1.25, 'Zirve devam.'),
     8: mkSig(1.15, 'surface', 1.18, 'Hâlâ yüksek.'),
     9: mkSig(1.00, 'normal',  1.05, 'Normalize.'),
    10: mkSig(0.90, 'normal',  0.95, 'İyi geçiş.'),
    11: mkSig(0.85, 'normal',  0.88, 'Sonbahar: bekleme 170 güne iner.'),
    12: mkSig(0.80, 'normal',  0.85, 'Yıl sonu: düşük, iyi pencere.'),
  },

  'Danimarka': {
     // Danimarka zaten çok yüksek ret oranı — mevsim az etkili
     1: mkSig(0.45, 'deep',    0.55, 'Kış: derin inceleme — hem iyi hem tehlikeli.'),
     2: mkSig(0.50, 'deep',    0.60, 'Aynı.'),
     3: mkSig(0.80, 'normal',  0.90, 'Normal.'),
     4: mkSig(1.05, 'normal',  1.10, 'Orta.'),
     5: mkSig(1.25, 'surface', 1.30, 'Yaz.'),
     6: mkSig(1.40, 'surface', 1.45, 'Zirve.'),
     7: mkSig(1.35, 'surface', 1.40, 'Devam.'),
     8: mkSig(1.15, 'surface', 1.20, 'Yüksek.'),
     9: mkSig(0.90, 'normal',  0.95, 'Normalize.'),
    10: mkSig(0.70, 'normal',  0.80, 'İyi.'),
    11: mkSig(0.55, 'deep',    0.65, 'Kış.'),
    12: mkSig(0.40, 'deep',    0.55, 'Minimum.'),
  },
};

// ── Politik & Politika Olayları ───────────────────────────────────────────────
// Kaynak: resmi duyurular, basın haberleri, vize politikası değişiklik raporları
export const POLITICAL_EVENTS: PoliticalEvent[] = [

  // ── AB & Schengen Geneli ─────────────────────────────────────────────────
  {
    id: 'eu_migration_pact_2024',
    name: 'AB Göç ve Sığınma Paktı Yürürlüğe Girişi',
    countries: [],  // tüm Schengen
    dateRange: { start: '2024-06-01' },
    impact: 'tightening',
    riskDelta: 2,
    severity: 'medium',
    description: 'Haziran 2024\'te yürürlüğe giren pakt, dış sınır kontrollerini sıkılaştırdı. Schengen ülkelerinde ret eğilimi hafif artış.',
    source: 'AB Resmi Gazetesi, Haziran 2024',
  },
  {
    id: 'ees_entry_exit_2025',
    name: 'EES (Giriş/Çıkış Sistemi) Devreye Alındı',
    countries: [],  // tüm Schengen
    dateRange: { start: '2025-01-01' },
    impact: 'tightening',
    riskDelta: 3,
    severity: 'medium',
    description: 'EES 2025 Q1\'de aktif. 90/180 gün kuralı otomatik takip başladı. Eski aşım kayıtları ortaya çıkabiliyor.',
    source: 'Avrupa Komisyonu EES duyurusu 2024',
  },
  {
    id: 'eu_election_2024',
    name: 'AB Parlamentosu Seçimleri',
    countries: [],
    dateRange: { start: '2024-06-06', end: '2024-07-15' },
    impact: 'tightening',
    riskDelta: 2,
    severity: 'low',
    description: 'Haziran 2024 AB seçimlerinde sağ partiler güçlendi. Göç politikasında sertleşme eğilimi başladı.',
    source: 'Avrupa Parlamentosu seçim sonuçları, Haziran 2024',
  },

  // ── Almanya ──────────────────────────────────────────────────────────────
  {
    id: 'germany_election_2025',
    name: 'Almanya Federal Seçimi & CDU Hükümeti',
    countries: ['Almanya'],
    dateRange: { start: '2025-02-23', end: '2025-05-01' },
    impact: 'tightening',
    riskDelta: 4,
    severity: 'high',
    description: 'Şubat 2025 seçimi CDU-CSU zaferiyle sonuçlandı. Yeni hükümet göç politikasını sıkılaştıracağını açıkladı. Geçiş döneminde konsolosluklar temkinli davranıyor.',
    source: 'Bundestag seçim sonuçları, Şubat 2025; CDU koalisyon protokolü',
  },
  {
    id: 'germany_policy_stable_2025',
    name: 'Almanya CDU Hükümeti Yerleşti',
    countries: ['Almanya'],
    dateRange: { start: '2025-05-01' },
    impact: 'neutral',
    riskDelta: 1,
    severity: 'low',
    description: 'Yeni hükümet kuruldu, belirsizlik azaldı. Politika sıkı ama öngörülebilir.',
    source: 'Almanya Federal Hükümet duyuruları 2025',
  },
  {
    id: 'germany_randevu_krizi',
    name: 'Almanya Konsolosluk Randevu Krizi',
    countries: ['Almanya'],
    dateRange: { start: '2022-04-01' },
    impact: 'neutral',
    riskDelta: 0,
    severity: 'high',
    description: 'COVID sonrası birikimi nedeniyle Almanya TR konsoloslukları 90-180 gün randevu bekleme yaşıyor. Ret kararını etkilemez ama planlama şart.',
    source: 'VFS Global TR istatistikleri 2022-2025; Ekşi Sözlük',
  },

  // ── İngiltere ────────────────────────────────────────────────────────────
  {
    id: 'uk_election_labour_2024',
    name: 'UK Genel Seçimi — Labour İktidara Geldi',
    countries: ['İngiltere'],
    dateRange: { start: '2024-07-05' },
    impact: 'loosening',
    riskDelta: -2,
    severity: 'low',
    description: 'Labour hükümeti turist vize politikasında hafif yumuşama sinyali verdi. Ancak pratik etkisi küçük — UKVI tutumunu sürdürüyor.',
    source: 'UK Home Office politika açıklamaları, Temmuz 2024',
  },
  {
    id: 'uk_fee_increase_2024',
    name: 'UK Vize Ücreti Artışı',
    countries: ['İngiltere'],
    dateRange: { start: '2024-02-07' },
    impact: 'tightening',
    riskDelta: 1,
    severity: 'low',
    description: 'Turist vizesi £115\'e yükseldi. Başvurucu sayısını azaltıyor — kalan başvurular ortalama olarak daha güçlü. Marginal sıkılaşma.',
    source: 'UK Home Office, Şubat 2024',
  },
  {
    id: 'uk_eta_2025',
    name: 'UK Elektronik Seyahat İzni (ETA) Türkiye',
    countries: ['İngiltere'],
    dateRange: { start: '2025-01-08' },
    impact: 'neutral',
    riskDelta: 0,
    severity: 'low',
    description: 'ETA Türk vatandaşları için uygulanamaz — Türkler standart vize gerektiriyor. Süreç değişmedi.',
    source: 'UK Home Office ETA duyurusu',
  },

  // ── ABD ──────────────────────────────────────────────────────────────────
  {
    id: 'usa_trump_administration_2025',
    name: 'ABD Trump Yönetimi & Vize Kısıtlamaları',
    countries: ['ABD'],
    dateRange: { start: '2025-01-20' },
    impact: 'tightening',
    riskDelta: 6,
    severity: 'high',
    description: 'Ocak 2025\'te göreve başlayan Trump yönetimi vize politikasını önemli ölçüde sıkılaştırdı. 214(b) uygulaması daha agresif, admin processing oranı arttı. Türk başvurucular için ret riski yükseldi.',
    source: 'US DOS vize istatistikleri Q1 2025; r/usvisa TR raporları',
  },
  {
    id: 'usa_admin_processing_spike_2023',
    name: 'ABD Admin Processing Artışı',
    countries: ['ABD'],
    dateRange: { start: '2023-01-01' },
    impact: 'tightening',
    riskDelta: 3,
    severity: 'medium',
    description: '221(g) admin processing oranı 2023\'te %18\'den %28\'e çıktı. TR başvurucular için ortalama bekleme 6-18 ay.',
    source: 'US DOS NIV istatistikleri 2023-2024; r/usvisa TR',
  },

  // ── Yunanistan ───────────────────────────────────────────────────────────
  {
    id: 'greece_tourism_drive_2024',
    name: 'Yunanistan Turizm Atağı 2024-2026',
    countries: ['Yunanistan'],
    dateRange: { start: '2024-01-01' },
    impact: 'loosening',
    riskDelta: -3,
    severity: 'medium',
    description: 'Yunanistan 2024-2026 turizm hedefini %20 büyüme olarak belirledi. Vize süreçleri hızlandırıldı, onay oranı yüksek tutuluyor.',
    source: 'Yunanistan Turizm Bakanlığı 2024 strateji raporu',
  },

  // ── Genel Göç Krizi ──────────────────────────────────────────────────────
  {
    id: 'migration_crisis_2023_2024',
    name: 'Avrupa Göç Kriziyle Sıkılaşma',
    countries: ['Almanya', 'Avusturya', 'İsveç', 'Danimarka', 'Hollanda'],
    dateRange: { start: '2023-09-01' },
    impact: 'tightening',
    riskDelta: 3,
    severity: 'medium',
    description: '2023 sonbaharından itibaren Kuzey/Orta Avrupa ülkeleri göç baskısı nedeniyle vize politikalarını sıkılaştırdı. Özellikle genç-bekar profili daha derin inceleniyor.',
    source: 'AB Göç Ajansı raporları 2023; Ekşi Sözlük/Şikayetvar 2023-2024',
  },
];

// ── Yardımcı: Aktif politik olayları bul ────────────────────────────────────
export const getActiveEvents = (
  country: string,
  year:    number,
  month:   number,
): PoliticalEvent[] => {
  const date = new Date(year, month - 1, 15); // ayın ortası
  return POLITICAL_EVENTS.filter(ev => {
    // Ülke eşleşmesi (boş array = tüm Schengen/global)
    const countryMatch = ev.countries.length === 0 || ev.countries.includes(country);
    if (!countryMatch) return false;

    const start = new Date(ev.dateRange.start);
    const end   = ev.dateRange.end ? new Date(ev.dateRange.end) : new Date(2099, 0, 1);
    return date >= start && date <= end;
  });
};

// ── Mevsimsel Pencere Hesabı ─────────────────────────────────────────────────
export const getSeasonalWindow = (
  country: string,
  year:    number,
  month:   number,
): SeasonalWindow => {
  const signals = MONTHLY_SIGNALS[country] ?? SCHENGEN_DEFAULT;
  const sig     = signals[month] ?? signals[6]; // Fallback: Haziran
  const events  = getActiveEvents(country, year, month);
  const totalRiskDelta = events.reduce((s, e) => s + e.riskDelta, 0);

  // windowScore: 0 (kötü) → 1 (mükemmel)
  // Bileşenler:
  //   - hacim düşük → iyi     (0.35 ağırlık)
  //   - inceleme derin → iyi  (0.25 ağırlık, güçlü profil için)
  //   - waitMultiplier düşük → iyi (0.25 ağırlık)
  //   - politik olay negatif → kötü (0.15 ağırlık)
  const volumeScore   = 1 - Math.min(1, (sig.volumeIndex - 0.4) / 1.2); // 0-1
  const scrutinyScore = sig.scrutiny === 'deep' ? 0.9 : sig.scrutiny === 'normal' ? 0.6 : 0.3;
  const waitScore     = 1 - Math.min(1, (sig.waitMultiplier - 0.5) / 1.0);
  const politicScore  = Math.max(0, 1 - totalRiskDelta / 15);

  const windowScore = Math.round(
    (volumeScore * 0.35 + scrutinyScore * 0.25 + waitScore * 0.25 + politicScore * 0.15) * 100,
  ) / 100;

  // Profil tipi farkı
  const strongProfileBonus  = sig.scrutiny === 'deep' ? +0.03 : sig.scrutiny === 'surface' ? +0.01 : 0;
  const weakProfilePenalty  = sig.scrutiny === 'deep' ? -0.05 : sig.scrutiny === 'surface' ? +0.02 : -0.01;

  return {
    month, year,
    volumeIndex:    sig.volumeIndex,
    scrutiny:       sig.scrutiny,
    waitMultiplier: sig.waitMultiplier,
    activeEvents:   events,
    windowScore,
    strongProfileBonus,
    weakProfilePenalty,
  };
};

// ── Önümüzdeki 6 Aylık En İyi Pencereyi Bul ─────────────────────────────────
const findBestWindow = (
  country: string,
  fromYear: number,
  fromMonth: number,
  months: number = 6,
): { month: number; year: number; score: number } => {
  let best = { month: fromMonth, year: fromYear, score: 0 };
  for (let i = 0; i < months; i++) {
    const m = ((fromMonth - 1 + i) % 12) + 1;
    const y = fromYear + Math.floor((fromMonth - 1 + i) / 12);
    const w = getSeasonalWindow(country, y, m);
    if (w.windowScore > best.score) {
      best = { month: m, year: y, score: w.windowScore };
    }
  }
  return best;
};

// ── Ana Öneri Fonksiyonu ─────────────────────────────────────────────────────
/**
 * Kullanıcıya "şimdi başvur / bekle / acele et" önerisi verir.
 *
 * @param country      Hedef ülke
 * @param score        Kullanıcının mevcut calculateScore çıktısı (0-100)
 * @param year         Karar yılı (default: bu yıl)
 * @param month        Karar ayı (default: bu ay)
 * @param baseWaitDays Konsolosluk matrisinden gelen temel randevu bekleme (0 = bilinmiyor)
 */
export const getTimingAdvice = (
  country:      string,
  score:        number,
  year?:        number,
  month?:       number,
  baseWaitDays: number = 0,
): TimingAdvice => {
  const now  = new Date();
  const y    = year  ?? now.getFullYear();
  const m    = month ?? (now.getMonth() + 1);

  const current = getSeasonalWindow(country, y, m);
  const best    = findBestWindow(country, y, m);
  const isStrong = score >= 72;

  // Tahmini randevu bekleme bu ay için
  const baseWait = baseWaitDays > 0 ? baseWaitDays : 30;
  const appointmentWaitEst = Math.round(baseWait * current.waitMultiplier);

  // Aktif uyarıları topla
  const activeWarnings = current.activeEvents
    .filter(e => e.impact === 'tightening' && e.severity !== 'low')
    .map(e => e.name);

  // Ağır politik risk var mı?
  const heavyPolitical = current.activeEvents.some(e => e.riskDelta >= 5);

  // Sezonsal çarpan (calculateScore'a uygulanacak)
  // Güçlü profil: yoğun sezonda hafif avantajlı (hızlı onay), zayıf profil dezavantajlı
  const baseSeasonalMultiplier = (() => {
    if (current.scrutiny === 'deep')    return isStrong ? 1.03 : 0.97;
    if (current.scrutiny === 'surface') return isStrong ? 1.01 : 0.93;
    return 1.00;
  })();
  // Politik olaylar çarpana eklenir
  const totalRiskDelta      = current.activeEvents.reduce((s, e) => s + e.riskDelta, 0);
  const seasonalMultiplier  = Math.max(0.82, Math.min(1.08, baseSeasonalMultiplier - totalRiskDelta * 0.005));

  // Kaç ay daha beklemeli?
  const monthsUntilBest = (() => {
    let count = 0;
    let mm = m, yy = y;
    while (!(mm === best.month && yy === best.year) && count < 6) {
      mm = (mm % 12) + 1;
      if (mm === 1) yy++;
      count++;
    }
    return count;
  })();

  // ── Karar ağacı ─────────────────────────────────────────────────────────
  let recommendation: TimingRec;
  let headline: string;
  let reason: string;
  let urgencyNote: string | undefined;
  let waitMonths: number | undefined;
  let targetMonth: number | undefined;

  // DURUM 1: Şu an en iyi pencere VE ciddi politik risk yok
  if (current.windowScore >= 0.65 && !heavyPolitical) {
    recommendation = 'apply_now';
    headline       = 'Şu An İdeal Başvuru Penceresi';
    reason         = `${MONTH_NAMES[m]} ayı bu ülke için yılın en iyi başvuru dönemlerinden. ${
      current.scrutiny === 'deep'
        ? 'Konsolosluk dosyaları derin inceliyor — güçlü başvuru avantaj sağlar.'
        : 'Orta hacimli dönemde makul bekleme süresi.'
    }`;
    urgencyNote    = best.score - current.windowScore < 0.10
      ? '✓ Önümüzdeki 6 ayda daha iyi pencere yok — hemen başvurun.'
      : undefined;

  // DURUM 2: Çok yakında (1-2 ay) çok daha iyi pencere var
  } else if (monthsUntilBest <= 2 && best.score - current.windowScore >= 0.15) {
    recommendation = 'wait';
    waitMonths     = monthsUntilBest;
    targetMonth    = best.month;
    headline       = `${monthsUntilBest} Ay Bekleyin: ${MONTH_NAMES[best.month]} Daha İyi`;
    reason         = `${MONTH_NAMES[best.month]} ayında hacim ${Math.round((1 - (MONTHLY_SIGNALS[country]?.[best.month]?.volumeIndex ?? 1)) * 100)}% daha düşük ve randevu bekleme kısalıyor. Profil skorunuz sabitken zamanlama avantajı ücretsiz bir iyileştirme.`;
    urgencyNote    = `⏳ ${monthsUntilBest} ay bekleme — skor yaklaşık %${Math.round((best.score - current.windowScore) * 100)} iyileşiyor.`;

  // DURUM 3: Ağır politik olay aktif — acele et (durum gecikmeden kötüleşiyor)
  } else if (heavyPolitical && current.windowScore >= 0.45) {
    recommendation = 'rush_before';
    headline       = 'Politika Sertleşmeden Önce Başvurun';
    reason         = current.activeEvents
      .filter(e => e.riskDelta >= 5)
      .map(e => e.description)
      .join(' ');
    urgencyNote    = '⚠ Aktif politika değişikliği: bekleme riski artırıyor.';

  // DURUM 4: Yoğun sezon + zayıf profil kombinasyonu
  } else if (current.scrutiny === 'surface' && !isStrong && monthsUntilBest <= 4) {
    recommendation = 'wait';
    waitMonths     = monthsUntilBest;
    targetMonth    = best.month;
    headline       = `Profil + Sezon Riski: ${MONTH_NAMES[best.month]}'a Erteleyin`;
    reason         = `Yaz yoğunluğunda zayıf profiller hızlı reddediliyor. Konsolosluk yüzeyde inceliyor, ayrıntılı değerlendirme yapmıyor. ${MONTH_NAMES[best.month]}'de hacim düşünce daha iyi fırsat çıkacak.`;

  // DURUM 5: Caution — orta durum
  } else {
    recommendation = score >= 60 ? 'apply_now' : 'caution';
    headline       = score >= 60
      ? 'Başvurabilirsiniz — Zamanlamanız Makul'
      : 'Dikkatli Olun: Sezon + Profil Kombinasyonu Riskli';
    reason         = `${MONTH_NAMES[m]}: ${current.scrutiny === 'surface' ? 'yoğun sezon, yüzeysel inceleme.' : 'normal dönem.'} ${
      score < 60 ? 'Profil skoru düşük olduğundan mevsimsel baskı daha çok etkiliyor.' : ''
    }`;
  }

  return {
    recommendation,
    waitMonths,
    targetMonth,
    targetMonthName: targetMonth ? MONTH_NAMES[targetMonth] : undefined,
    headline,
    reason,
    urgencyNote,
    currentWindowScore:  current.windowScore,
    bestWindowScore:     best.score,
    bestWindowMonth:     best.month,
    appointmentWaitEst,
    activeWarnings,
    seasonalMultiplier,
  };
};

// ── Mevsimsel Çarpanı Hesapla (calculateScore entegrasyonu için) ─────────────
/**
 * calculateScore pipeline'ına eklenecek çarpanı döner.
 * Kullanıcı şehri + ülke + ay → 0.82-1.08 arası multiplier.
 * applicantCity yoksa ya da ay bilinmiyorsa 1.0 döner (geriye uyumlu).
 */
export const getSeasonalMultiplier = (
  country:    string,
  score:      number,
  month?:     number,
  year?:      number,
  waitDays?:  number,
): number => {
  if (!country || !month) return 1.0;
  const advice = getTimingAdvice(country, score, year, month, waitDays ?? 0);
  return advice.seasonalMultiplier;
};
