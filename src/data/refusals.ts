// ============================================================
// Ret Kodu & Taksonomi Veritabanı
// App.tsx'ten modüler yapıya taşındı
// ============================================================

import type { ProfileData } from '../types';

// ── Ret Kodu Veritabanı — 2021-2026 ortalaması, Türk başvurucular ──────────
// Kaynak: EU Schengen Visa Statistics 2021-2025, UK Home Office, US DOS,
// Ekşi Sözlük/şikayetvar.com ret vakaları, forum analizleri
export interface RefusalCode {
  code: number; label: string; desc: string;
  byCountry: Record<string, number>; // ülke → % (ret içindeki dağılım)
}

// ── Schengen: 14 ülke, 5 yıllık ortalama ──────────────────────────────────
export const SCHENGEN_REFUSAL_CODES: RefusalCode[] = [
  { code: 1, label: 'Sahte / Yanıltıcı Belge', desc: 'Sunulan belgeler gerçek değil, eksik veya yanıltıcı. Pasaport, davetiye, banka ekstresinde sahtecilik.',
    byCountry: { Almanya:4, Fransa:5, Hollanda:3, İtalya:2, İspanya:3, Avusturya:6, Belçika:4, Danimarka:3, İsveç:3, Norveç:3, Yunanistan:2, Portekiz:2, Polonya:2, İsviçre:4 } },
  { code: 2, label: 'Seyahat Amacı Belirsiz', desc: 'Seyahatin amacı, koşulları veya güvenilirliği yeterince belgelenmemiş. Türk başvurucular için 5 yılın #1 ret sebebi.',
    byCountry: { Almanya:27, Fransa:26, Hollanda:30, İtalya:18, İspanya:24, Avusturya:23, Belçika:25, Danimarka:34, İsveç:27, Norveç:25, Yunanistan:20, Portekiz:22, Polonya:20, İsviçre:28 } },
  { code: 3, label: 'Geri Dönüş Niyeti Kanıtlanmamış', desc: 'İstihdam, mülk veya aile bağları yetersiz. Bekar + yeni iş + ilk Schengen kombinasyonu özellikle riskli.',
    byCountry: { Almanya:22, Fransa:19, Hollanda:18, İtalya:13, İspanya:20, Avusturya:17, Belçika:20, Danimarka:28, İsveç:25, Norveç:27, Yunanistan:12, Portekiz:13, Polonya:14, İsviçre:22 } },
  { code: 4, label: 'Yetersiz Finansal Güvence', desc: 'Banka dökümü, günlük bütçe (€100/gün) veya toplam bakiye yetersiz. Son dakika mevduat da bu kategoride değerlendiriliyor.',
    byCountry: { Almanya:20, Fransa:22, Hollanda:18, İtalya:23, İspanya:23, Avusturya:21, Belçika:19, Danimarka:18, İsveç:19, Norveç:20, Yunanistan:18, Portekiz:19, Polonya:20, İsviçre:21 } },
  { code: 5, label: 'Önceki İhlal / SIS Kaydı', desc: 'Schengen Bilgi Sistemi (SIS) uyarısı, önceki sınır dışı etme veya vize kurallarının ihlali.',
    byCountry: { Almanya:6, Fransa:7, Hollanda:5, İtalya:4, İspanya:5, Avusturya:8, Belçika:6, Danimarka:5, İsveç:6, Norveç:5, Yunanistan:3, Portekiz:3, Polonya:3, İsviçre:6 } },
  { code: 6, label: 'Seyahat Sigortası Eksik/Yetersiz', desc: 'Min. €30.000 teminatlı seyahat sigortası yok veya kapsam yetersiz. Schengen Vize Kodu\'nda zorunlu.',
    byCountry: { Almanya:9, Fransa:7, Hollanda:10, İtalya:15, İspanya:12, Avusturya:9, Belçika:9, Danimarka:5, İsveç:8, Norveç:8, Yunanistan:12, Portekiz:12, Polonya:10, İsviçre:8 } },
  { code: 7, label: 'Konaklama Belgesi Eksik', desc: 'Onaylı otel rezervasyonu, kiralık konut belgesi veya davet mektubu sunulmamış.',
    byCountry: { Almanya:5, Fransa:6, Hollanda:7, İtalya:10, İspanya:8, Avusturya:5, Belçika:9, Danimarka:4, İsveç:5, Norveç:6, Yunanistan:22, Portekiz:20, Polonya:22, İsviçre:5 } },
  { code: 8, label: 'Vize / Süre Aşımı Geçmişi', desc: 'Önceki Schengen vizesinde izin verilen kalış süresini aşmış kayıt. Otomatik üst ret riski.',
    byCountry: { Almanya:4, Fransa:5, Hollanda:6, İtalya:3, İspanya:3, Avusturya:7, Belçika:5, Danimarka:2, İsveç:5, Norveç:4, Yunanistan:2, Portekiz:2, Polonya:2, İsviçre:4 } },
  { code: 9, label: 'Pasaport Geçersiz / Yetersiz', desc: 'Pasaport süresi vize bitiş tarihinden sonra 3 ay içinde doluyor veya pasaport hasarlı.',
    byCountry: { Almanya:2, Fransa:2, Hollanda:2, İtalya:3, İspanya:2, Avusturya:3, Belçika:2, Danimarka:1, İsveç:2, Norveç:2, Yunanistan:3, Portekiz:3, Polonya:3, İsviçre:2 } },
  { code: 10, label: 'Diğer / İdari Sebepler', desc: 'Yukarıdaki kategorilere girmeyen ret gerekçeleri: tutarsız beyan, yetersiz seyahat planı vb.',
    byCountry: { Almanya:1, Fransa:1, Hollanda:1, İtalya:9, İspanya:0, Avusturya:1, Belçika:1, Danimarka:0, İsveç:0, Norveç:0, Yunanistan:6, Portekiz:4, Polonya:4, İsviçre:0 } },
];

// ── İngiltere: Özel ret kategorileri (2021-2026, TR başvurucular) ───────────
// Kaynak: UK Home Office Immigration Statistics, UKVI reports
export interface UkRefusalCode { code: string; label: string; desc: string; pct: number; profileRisk: (p: ProfileData) => boolean; }
export const UK_REFUSAL_CODES: UkRefusalCode[] = [
  { code: 'V 4.2', label: 'Gerçek Ziyaretçi Testi Başarısız', desc: 'Memur "Bu kişi gerçekten turist mu?" sorusuna evet diyemiyor. UK\'nın 5 yılın tartışmasız #1 sebebi.', pct: 48,
    profileRisk: (p) => !p.purposeClear || !p.paidReservations || !p.hasReturnTicket },
  { code: 'FM 1.7A', label: 'Para Kaynağı Belirsiz / 28 Gün Kuralı', desc: 'Son 28 günde büyük para girişi veya 6 aylık banka dökümü eksik. UK\'ta bu kural katı uygulanıyor.', pct: 22,
    profileRisk: (p) => p.hasSuspiciousLargeDeposit || !p.has6MonthStatements || !p.has28DayHolding },
  { code: 'V 4.3', label: 'Türkiye Bağları Yetersiz', desc: 'İstihdam, mülk veya aile bağları Türkiye\'ye dönüşü kanıtlamıyor.', pct: 16,
    profileRisk: (p) => !p.hasSgkJob && !p.hasAssets && !p.isMarried },
  { code: '9.7.1', label: 'Aldatma / Beyan Tutarsızlığı', desc: 'Önceki ret gizlenmiş veya belgeler arasında çelişki var. 10 yıl UK yasağı riski.', pct: 8,
    profileRisk: (p) => p.hasPreviousRefusal && !p.previousRefusalDisclosed },
  { code: 'V 4.7', label: '28 Gün Kalış Aşımı Riski', desc: 'Başvurucu Türkiye\'ye dönmeyip UK\'ta kalabilir izlenimi veriyor.', pct: 4,
    profileRisk: (p) => !p.isMarried && !p.hasHighValueVisa && p.yearsInCurrentJob < 1 },
  { code: 'ADM', label: 'İdari / Diğer', desc: 'Eksik belge, yanlış form veya teknik ret. Genellikle yeniden başvuruyla çözülür.', pct: 2,
    profileRisk: () => false },
];

// ── ABD: B1/B2 ret kategorileri (2021-2026, TR başvurucular) ──────────────
// Kaynak: US Dept of State NIV Statistics, mülakat raporları
export interface UsaRefusalCode { code: string; label: string; desc: string; pct: number; profileRisk: (p: ProfileData) => boolean; }
export const USA_REFUSAL_CODES: UsaRefusalCode[] = [
  { code: '214(b)', label: 'Göçmen Niyet Şüphesi', desc: 'Başvurucu ABD\'de kalacakmış gibi değerlendiriliyor. B2 başvurularında Türkler için 5 yılın %62\'sini oluşturan tek sebep.', pct: 62,
    profileRisk: (p) => (!p.isMarried && !p.hasChildren && !p.hasAssets) || p.yearsInCurrentJob < 2 },
  { code: '221(g)', label: 'İdari İşlem (Admin Processing)', desc: 'Güvenlik kontrolleri veya ek belge talebi. Zaman alıcı ama ret değil — sonuçlanabilir.', pct: 18,
    profileRisk: () => false },
  { code: 'DOCS', label: 'Yetersiz Belgeleme', desc: 'DS-160 formunda eksiklik, finansal kanıt yetersizliği veya seyahat planı belirsizliği.', pct: 10,
    profileRisk: (p) => !p.hasSgkJob || !p.purposeClear || !p.bankSufficientBalance },
  { code: '212(a)', label: 'Uygunsuzluk Temelli Red', desc: 'Suç geçmişi, sağlık koşulu veya önceki sınır dışı etme. Nadir ama kalıcı.', pct: 5,
    profileRisk: (p) => !p.noOverstayHistory || !p.cleanCriminalRecord },
  { code: 'ITV', label: 'Mülakat Tutarsızlığı', desc: 'DS-160 ile mülakat cevapları çelişiyor. "Tanıdığınız var mı?" sorusunda en çok karşılaşılan tuzak.', pct: 5,
    profileRisk: (p) => !p.interviewPrepared },
];

// ── Ret Taksonomisi: Forum verisinden çıkarılmış gerçek ret kalıpları ────
export interface RejectionPattern {
  id: string;
  name: string;
  country: 'schengen' | 'uk' | 'usa' | 'all';
  legalCode?: string;
  frequency: number;        // 0-100, 50 gerçek vaka üzerinden yüzde (R analizi)
  scorePenalty?: number;    // Ağırlıklı skor cezası (severity × frequency)
  isVeto?: boolean;         // true → kalıcı ban / skor cap riski
  trigger: (p: ProfileData) => boolean;
  explanation: string;
  mitigation: string;
}

// ── Empirik Ret Taksonomisi v1.0 ─────────────────────────────────────────
// Kaynak: 50 gerçek vaka R analizi (2026-04) — Schengen:30, UK:10, USA:10
// frequency = frequency_pct, scorePenalty = severity × frequency ağırlıklı
// v1.0 uyarısı: 200+ vakaya ulaşıldığında kalibre edilecek.
export const REJECTION_TAXONOMY: RejectionPattern[] = [
  // ── RANK 1 — Geri dönüş şüphesi (%22, tüm ülkeler) ──────────────────
  {
    id: 'return_doubt',
    name: 'Geri dönüş şüphesi',
    country: 'all',
    legalCode: 'Madde 13 / INA 214(b)',
    frequency: 22,
    scorePenalty: 26.7,
    trigger: (p) =>
      !p.isMarried && !p.hasChildren && !p.hasAssets && p.yearsInCurrentJob < 3,
    explanation:
      '50 vakada %22 ile en yaygın ret kalıbı. Bekar + genç + kısa iş süresi ' +
      'kombinasyonu konsololuk gözünde "geri dönmeyebilir" izlenimi yaratır.',
    mitigation:
      "Türkiye'deki iş, mülk ve aile bağlarını somutlaştırın. " +
      'SGK dökümü, tapu, kira kontratı ekleyin. 5-7 günlük kısa ilk seyahat önerilir.',
  },
  // ── RANK 2 — Seyahat amacı inandırıcı değil (%18, tüm ülkeler) ───────
  {
    id: 'purpose_unconvincing',
    name: 'Seyahat amacı inandırıcı değil',
    country: 'all',
    legalCode: 'Madde 2 / Madde 10',
    frequency: 18,
    scorePenalty: 30.0,
    trigger: (p) => !p.purposeClear || !p.paidReservations,
    explanation:
      '"Avrupa\'yı görmek istiyorum" gibi genel ifadeler %18 vakada ret sebebi. ' +
      'Güçlü finans bile net seyahat gerekçesi olmadan tek başına yetmiyor.',
    mitigation:
      'Günlük seyahat planı yazın, spesifik müze/etkinlik adı verin. ' +
      '"Neden şimdi, neden bu ülke?" sorularına 3 cümleyle net cevap hazırlayın.',
  },
  // ── RANK 3 — ABD 214(b) zayıf bağlar (%14, sadece ABD) ───────────────
  {
    id: '214b_weak_ties',
    name: "ABD 214(b) — Türkiye bağları yetersiz",
    country: 'usa',
    legalCode: 'INA 214(b)',
    frequency: 65, // ABD vakalarında %70 dominant — tüm 50 vakada %14
    scorePenalty: 26.7,
    trigger: (p) =>
      (!p.isMarried && !p.hasChildren && !p.hasAssets) ||
      p.yearsInCurrentJob < 2,
    explanation:
      "ABD vakalarının %70'inde dominant ret sebebi. Türkiye'ye bağlayan somut " +
      'unsurlar yoksa "potansiyel göçmen" sayılıyor.',
    mitigation:
      "Tapu, araç, SGK, aile fotoğrafları — bağları somutlaştırın. " +
      "Kariyer planınızı mülakatta anlatın. Mülakat hazırlığına özel çalışın.",
  },
  // ── RANK 4 — Belge-form çelişkisi (%12, tüm ülkeler) ─────────────────
  {
    id: 'documents_inconsistent',
    name: 'Belge-form çelişkisi',
    country: 'all',
    legalCode: 'Madde 14',
    frequency: 12,
    scorePenalty: 23.3,
    trigger: (p) => !p.documentConsistency || !p.sgkAddressMatchesDs160,
    explanation:
      'Pasaporttaki adres ≠ SGK adresi, otel tarihleri ≠ uçuş tarihleri. ' +
      '%12 vakada otomatik red sebebi olabildiği görüldü.',
    mitigation:
      'Form ile tüm belgeler arasındaki sayıları, tarihleri ve adresleri ' +
      'çapraz kontrol edin. Adres tutarsızlığı otomatik ret riski taşıır.',
  },
  // ── RANK 5 — Finansal yetersizlik (%10, tüm ülkeler) ─────────────────
  {
    id: 'financial_insufficient',
    name: 'Banka bakiyesi yetersiz / düzensiz',
    country: 'all',
    legalCode: 'Madde 3 / Madde 4',
    frequency: 10,
    scorePenalty: 16.7,
    trigger: (p) =>
      !p.bankSufficientBalance ||
      !p.bankRegularity ||
      p.hasSuspiciousLargeDeposit,
    explanation:
      'Son 28 gün içinde büyük para girişi, statik hesap veya yetersiz bakiye — ' +
      'hepsi aynı maddeden ret. %10 vakada bu kalıp görüldü.',
    mitigation:
      '3-6 ay düzenli maaş girişi, organik harcama deseni, ' +
      'başvurudan en az 30 gün önce bakiyeye dokunmama.',
  },
  // ── RANK 6 — Türkiye bağları genel zayıflık (%10, tüm ülkeler) ───────
  {
    id: 'weak_ties',
    name: "Türkiye bağları genel olarak zayıf",
    country: 'all',
    frequency: 10,
    scorePenalty: 17.4,
    trigger: (p) =>
      !p.isMarried && !p.hasAssets && !p.strongFamilyTies && !p.hasChildren,
    explanation:
      'Bekâr, çocuksuz, kiracı, SGK\'sız kombinasyonu %10 vakada bağımsız ret ' +
      'sebebi. Geri dönüş şüphesinin genel biçimi.',
    mitigation:
      'Medeni durum, çocuk, mülk, kıdemli iş — hangisi varsa vurgulayın. ' +
      "Hiçbiri yoksa güçlü profil oluşana kadar başvuruyu erteleyin.",
  },
  // ── RANK 7 — Son dakika banka yatırımı (%8, tüm ülkeler) ─────────────
  {
    id: 'last_minute_deposit',
    name: 'Son dakika banka yatırımı (28 gün kuralı)',
    country: 'all',
    legalCode: 'Madde 3',
    frequency: 8,
    scorePenalty: 22.0,
    trigger: (p) => p.hasSuspiciousLargeDeposit || !p.bankNoLastMinuteDeposit,
    explanation:
      'Başvurudan 1-2 hafta önce aile/arkadaştan borç alıp yatırmak — "emanet ' +
      'para" terimi bizzat ret yazılarında geçiyor. Türklerin en yaygın hatası.',
    mitigation:
      'Başvurudan minimum 28 gün önce bakiye üzerinde hareket yapmayın. ' +
      '3-6 ay önceden planlamaya başlayın.',
  },
  // ── RANK 8 — Aldatma / yanlış beyan (%4, UK + ABD, VETO) ─────────────
  {
    id: 'deception',
    name: 'Aldatma / yanlış beyan — 10 yıl ban riski',
    country: 'uk',
    legalCode: 'Paragraph 9.7.1',
    frequency: 4,
    scorePenalty: 10.0,
    isVeto: true,
    trigger: (p) => p.hasPreviousRefusal && !p.previousRefusalDisclosed,
    explanation:
      'Önceki ret formda bildirilmezse "Deception" sayılır → 10 yıl UK yasağı. ' +
      '%4 vakada görüldü ama tetiklendiğinde en ağır yaptırım.',
    mitigation:
      'Tüm önceki retleri eksiksiz ve dürüstçe beyan edin. ' +
      'Belgeler ile form arasında tek bir tutarsızlık bile kalıcı yasağa yol açabilir.',
  },
  // ── RANK 9 — Belgeler güvenilir değil (%4, Schengen) ─────────────────
  {
    id: 'documents_unreliable',
    name: 'Belgeler güvenilir bulunmadı',
    country: 'schengen',
    frequency: 4,
    scorePenalty: 6.7,
    trigger: (p) => !p.documentConsistency,
    explanation:
      'İşveren yazısı antetli/kaşeli/imzalı değil veya tercüme noter onaylı ' +
      'değil. Schengen vakalarında %4 oranında görüldü.',
    mitigation:
      'İşveren yazısı antetli, kaşeli ve imzalı olmalı. ' +
      'Tercüme gerekiyorsa noter onaylı olması zorunludur.',
  },
  // ── RANK 10 — Aile içi tutarsızlık (%4, tüm ülkeler) ─────────────────
  {
    id: 'family_split',
    name: 'Aile içi dosya tutarsızlığı',
    country: 'all',
    frequency: 4,
    scorePenalty: 6.7,
    trigger: (p) => p.isMarried && !p.strongFamilyTies && !p.hasChildren,
    explanation:
      'Aile üyeleri ayrı dosya hazırlayınca içerik çelişkileri çıkabiliyor. ' +
      '%4 vakada bu kalıp görüldü.',
    mitigation:
      'Aile başvurusu yapıyorsanız tüm üyelerin dosyalarını tek pakette ve ' +
      'tutarlı şekilde hazırlayın.',
  },
  // ── RANK 11 — UK Gerçek Ziyaretçi testi (%4, UK) ─────────────────────
  {
    id: 'genuine_visitor_failed',
    name: 'UK "Gerçek Ziyaretçi" testi başarısız',
    country: 'uk',
    legalCode: 'Appendix V 4.2',
    frequency: 48, // UK vakalarında ağırlıklı — tüm 50 vakada %4
    scorePenalty: 6.7,
    trigger: (p) =>
      !p.purposeClear || !p.paidReservations || !p.hasReturnTicket,
    explanation:
      "UK'nın en sık ret sebebi. Memur \"gerçekten turist mi yoksa kalmak mı " +
      'istiyor?" sorusuna kesin evet demezse ret.',
    mitigation:
      "Cover letter'da ne kadar, nerede, ne yapacağınızı ayrıntılı anlatın. " +
      "Türkiye'ye dönüş bağlarını sayılarla belgeleyin.",
  },
  // ── RANK 12 — Sahte otel rezervasyonu (%4, Schengen) ─────────────────
  {
    id: 'hotel_booking_fake',
    name: 'Sahte otel rezervasyonu tespiti',
    country: 'schengen',
    frequency: 4,
    scorePenalty: 15.0,
    trigger: (p) => !p.noFakeBooking,
    explanation:
      'İptal edilebilir ücretli PDF konsoloslukça biliniyor. ' +
      'Almanya ve UK özellikle sistematik biçimde kontrol ediyor.',
    mitigation:
      "Booking.com'un ücretsiz iptalli gerçek rezervasyonunu kullanın. " +
      'Sahte PDF kesinlikle kullanmayın.',
  },
  // ── RANK 13 — Seyahat sigortası yetersiz (%4, Schengen) ──────────────
  {
    id: 'insurance_inadequate',
    name: 'Seyahat sigortası yetersiz / eksik',
    country: 'schengen',
    frequency: 4,
    scorePenalty: 8.0,
    trigger: (p) => !p.hasTravelInsurance || !p.hasHealthInsurance,
    explanation:
      'Min €30.000 teminat + tüm Schengen kapsamı + seyahat tarihleri ' +
      'şartı karşılanmadığında otomatik ret sebebi sayılıyor.',
    mitigation:
      '€30.000 minimum teminatlı, tüm Schengen bölgesini kapsayan ve ' +
      'seyahat tarihlerinin tamamını içeren poliçe alın.',
  },
  // ── RANK 14 — UK para kaynağı belirsiz (%4, UK, VETO) ────────────────
  {
    id: 'source_of_funds_unclear',
    name: 'Para kaynağı belirsiz (UK 28 gün kuralı)',
    country: 'uk',
    legalCode: 'Appendix FM 1.7A',
    frequency: 22, // UK vakalarında ağırlıklı — tüm 50 vakada %4
    scorePenalty: 10.0,
    isVeto: true,
    trigger: (p) =>
      p.hasSuspiciousLargeDeposit || !p.has6MonthStatements,
    explanation:
      'UK 28 gün kuralını katı uyguluyor. Son 6 ay hesap hareketi ve ' +
      'paranın kaynağı doğrulanmazsa ret.',
    mitigation:
      'Son 6 aylık banka ekstresini hazırlayın. ' +
      'Büyük girişler için kaynak belgesi (satış, miras, ikramiye) ekleyin.',
  },
  // ── RANK 15 — İşsizlik / SGK yok (%4, Schengen + ABD) ───────────────
  {
    id: 'unemployed',
    name: 'İşsizlik / SGK kaydı eksik',
    country: 'schengen',
    legalCode: 'Madde 14',
    frequency: 4,
    scorePenalty: 14.0,
    trigger: (p) =>
      !p.hasSgkJob && !p.isPublicSectorEmployee && !p.isStudent,
    explanation:
      'Kayıt dışı çalışma veya SGK yokluğu. ' +
      '"İşimi kanıtlayamıyorum" şikayeti forumlarda çok sık karşılaşılıyor.',
    mitigation:
      'SGK kaydı veya noter onaylı çalışma belgesi edinin. ' +
      'Serbest meslek varsa vergi levhası şart. Sponsor belgesiyle de başvurulabilir.',
  },
  // ── RANK 16 — Genç + bekar (ABD) (%4, ABD) ───────────────────────────
  {
    id: 'unmarried_young',
    name: 'Genç + bekar profili (ABD riski)',
    country: 'usa',
    frequency: 20, // ABD vakalarında ağırlıklı — tüm 50 vakada %4
    scorePenalty: 8.3,
    trigger: (p) => !p.isMarried && p.yearsInCurrentJob < 2,
    explanation:
      'ABD vakalarında %20 oranında görülen risk kalıbı. ' +
      'Kariyer istikrarsızlığı + bekarlık kombinasyonu 214(b) riskini artırır.',
    mitigation:
      'Kariyer planı + aile tapu/mülkü + kısa süreli seyahat (5-7 gün) hazırlayın. ' +
      'İlk uluslararası başvuruda önce Schengen deneyimi kazanmanız tavsiye edilir.',
  },
  // ── RANK 17 — Eş yurt dışında + çalışmıyor (%4, Schengen) ────────────
  {
    id: 'married_mixed',
    name: 'Eş yurt dışında + başvurucu çalışmıyor',
    country: 'schengen',
    frequency: 4,
    scorePenalty: 10.0,
    trigger: (p) =>
      p.isMarried && !p.hasSgkJob && !p.isPublicSectorEmployee && !p.isStudent,
    explanation:
      'Eş yurt dışındayken başvurucunun çalışmaması ' +
      '"aile birleşimi hedefi" izlenimi yaratabilir.',
    mitigation:
      'Eş yurt dışındaysa sponsor evrakı güçlü olmalı. ' +
      "Türkiye'de kalacak aile üyesi veya mülk varsa mutlaka vurgulayın.",
  },
];
