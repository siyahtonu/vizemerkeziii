// ============================================================
// Belge Veritabanı
// App.tsx'ten modüler yapıya taşındı
// ============================================================

import type { ProfileData } from '../types';

// ── İngiltere Vize Belge Listesi ─────────────────────────────────────────────
export const ukDocuments = {
  employer: [
    "Vize Başvuru Formu (Tarafımızdan doldurulur)",
    "İngiltere Konsolosluğuna hitaben dilekçe (Seyahat amacı, kiminle gidileceği, adres, tarihler ve masrafları kimin karşılayacağı belirtilmeli)",
    "Talep edilen vizenin bitiş tarihinden en az 2 yıl sonrasına kadar geçerli pasaport ve varsa eski pasaportların tüm sayfalarının renkli taranmış kopyaları",
    "Uçak rezervasyonu ve eğer davetiye yoksa otel rezervasyonu",
    "Varsa İngiltere'den davet eden kişi tarafından hazırlanmış davetiye ve pasaport fotokopisi",
    "Başvuru sahibine ait son 3 aylık hesap dökümü (Banka kaşeli, imzalı ve imza sirkülü)",
    "Adınıza varsa tapu ve araç ruhsatı fotokopisi",
    "Tam tekmil vukuatlı nüfus kayıt örneği (E-Devlet'ten barkodlu, tüm aile bireyleri dahil. Kadınlar için evlilik öncesi ve sonrası 2 adet)",
    "Nüfus cüzdanı fotokopisi",
    "Eğer evliyse, E-devlet'ten FORMÜL B belgesi",
    "SGK hizmet dökümü (E-Devlet'ten barkodlu)",
    "İş yerine ait yeni tarihli vergi levhası fotokopisi",
    "İş yerine ait Ticaret Odası kayıt sureti (6 aydan eski olmamalı)",
    "İş yerine ait ticaret sicil gazetesi kayıt sureti fotokopisi",
    "İş yerine ait imza sirküleri fotokopisi",
    "Firmanın antetli kağıdına kaşe ve imzalı İngiltere'ye seyahat amacını belirten niyet mektubu",
    "Firmaya ait son 3 aylık hesap hareketleri (Banka kaşeli, imzalı ve imza sirkülü)",
    "E-devlet'ten barkodlu YERLEŞİM YERİ BELGESİ",
    "E-devlet'ten barkodlu TARİHÇELİ YERLEŞİM YERİ BELGESİ",
    "E-devlet'ten YURDA GİRİŞ ÇIKIŞ BELGESİ (01.01.2009'dan bugüne)",
    "Emeklilik durumu varsa: E-devlet'ten barkodlu 4A/4B/4C Emeklilik Bilgisi Belgesi ve son 3 aylık emekli maaş dökümü (Kaşeli, imzalı, imza sirkülü)"
  ],
  unemployed: [
    "Vize Başvuru Formu (Tarafımızdan doldurulur)",
    "İngiltere Konsolosluğuna hitaben dilekçe",
    "Talep edilen vizenin bitiş tarihinden en az 2 yıl sonrasına kadar geçerli pasaport ve varsa eski pasaportların tüm sayfalarının renkli taranmış kopyaları",
    "Uçak rezervasyonu ve eğer davetiye yoksa otel rezervasyonu",
    "Varsa İngiltere'den davet eden kişi tarafından verilen davetiye ve kimlik/pasaport fotokopisi",
    "Başvuru sahibine ait son 3 aylık hesap dökümü (Banka kaşeli, imzalı)",
    "Tam tekmil vukuatlı nüfus kayıt örneği (E-devlet'ten barkodlu, adres belirtilmeli)",
    "E-devlet'ten FORMÜL B (Evlilik kayıt belgesi)",
    "Adınıza varsa tapu ve araç ruhsatı fotokopisi",
    "E-devlet'ten Yerleşim Yeri Belgesi (Barkodlu)",
    "E-devlet'ten Tarihçeli Yerleşim Yeri Belgesi (Barkodlu)",
    "Nüfus cüzdanı fotokopisi",
    "Masraflar eşiniz tarafından karşılanacaksa, eşinize ait tüm iş belgeleri ve son 3 aylık banka hesap dökümleri",
    "Sponsor olacak kişiden sponsor olacağına dair dilekçe (Kaşeli, imzalı)"
  ],
  minor: [
    "Vize Başvuru Formu (Tarafımızdan doldurulur)",
    "İngiltere Konsolosluğuna hitaben dilekçe",
    "Talep edilen vizenin bitiş tarihinden en az 2 yıl sonrasına kadar geçerli pasaport ve varsa eski pasaportların tüm sayfalarının renkli taranmış kopyaları",
    "Uçak rezervasyonu ve eğer davetiye yoksa otel rezervasyonu",
    "İngiltere'den davet eden kişi tarafından verilen davetiye ve pasaport/kimlik fotokopisi",
    "Tam tekmil vukuatlı nüfus kayıt örneği (Nüfus müdürlüğünden alınmalı, anne bilgileri dahil)",
    "Devam ettiği okuldan güncel Öğrenci belgesi ve Transcript",
    "E-devlet'ten FORMUL-A (Doğum Belgesi)",
    "Yerleşim Yeri Belgesi (E-Devlet'ten barkodlu)",
    "Tarihçeli Yerleşim Yeri Belgesi (E-Devlet'ten barkodlu)",
    "Nüfus cüzdanı fotokopisi",
    "Sponsor olacak kişinin tüm iş belgeleri ve banka belgeleri",
    "18 Yaş altı için anne ve babanın imzasının bulunduğu noter tasdikli MUVAFAKATNAME"
  ],
  sponsor: [
    "Sponsor olacak kişiye ait son 3 aylık TL/DÖVİZ/ALTIN ve varsa BORSA hesap dökümleri (Banka kaşeli, imzalı ve imza sirkülü)",
    "Adınıza varsa tapu ve araç ruhsatı fotokopisi",
    "Tam tekmil vukuatlı nüfus kayıt örneği (E-Devlet'ten barkodlu, adres belirtilmeli)",
    "Yerleşim Yeri Belgesi (E-Devlet'ten barkodlu)",
    "Nüfus cüzdanı fotokopisi",
    "SGK hizmet dökümü (E-Devlet'ten barkodlu)",
    "Firmanıza ait yeni tarihli vergi levhası fotokopisi",
    "Firmanıza ait Ticaret Odası kayıt sureti (6 aydan eski olmamalı)",
    "Firmanıza ticaret sicil gazetesi kayıt sureti fotokopisi",
    "Firmanıza ait imza sirküleri fotokopisi",
    "Firmaya ait son 3 aylık hesap hareketleri (Banka kaşeli, imzalı ve imza sirkülü)",
    "Sponsor olacağını açıklayan SPONSORLUK DİLEKÇESİ (Firma kaşesi ve imza olmalıdır)"
  ]
};

export const ukPricing = {
  consulate: "185 USD (6 aylık) + 76,50 GBP (parmak izi) + 2600 TL (evrak tarama). *Parmak izi ücreti Ankara ve İstanbul'da alınmamaktadır.",
  agency: "200 USD",
  durations: [
    { label: "6 Aylık Vize", price: "185 USD" },
    { label: "2 Yıllık Vize", price: "695 USD" },
    { label: "5 Yıllık Vize", price: "1200 USD" },
    { label: "10 Yıllık Vize", price: "1510 USD" }
  ]
};

// ============================================================
// ÖZELLİK 1: RET MEKTUBU ANALİZ VERİ TABANI
// ============================================================
export interface RefusalRule {
  keywords: string[];
  title: string;
  category: 'financial' | 'ties' | 'purpose' | 'document' | 'history';
  severity: 'critical' | 'high' | 'medium';
  waitMonths: number;
  actions: string[];
}

export const refusalRules: RefusalRule[] = [
  {
    keywords: ['funds not genuine','financial means','cannot be satisfied','bank statement','sufficient funds','finansal','banka','yetersiz'],
    title: 'Finansal Kanıt Yetersiz / Güvenilir Değil',
    category: 'financial', severity: 'critical', waitMonths: 2,
    actions: [
      '6 aylık kaşeli-imzalı banka dökümü hazırla (UK için 28 gün kuralı)',
      'Maaş yatışlarının banka açıklamasında "Maaş/Hakediş" yazdığından emin ol',
      'Hesapta beklenmedik büyük para girişi varsa 45 gün bekle ve kaynağını belgele',
      'Ek hesaplar, yatırım hesabı, gayrimenkul değer belgesi ekle',
      'Schengen için günlük €120 × seyahat günü = gereken toplam miktarı net göster',
    ]
  },
  {
    keywords: ['ties to home','sufficient ties','return','family','employment','immigration intent','bağ','dönüş','çalışma','istihdam'],
    title: 'Memlekete Yeterli Bağ Kanıtlanamadı',
    category: 'ties', severity: 'critical', waitMonths: 1,
    actions: [
      'İşveren yazısını güçlendir: kesin geri dönüş tarihi ve imzalı garanti ekle',
      'SGK hizmet dökümünü barkodlu olarak ekle',
      'Tapu, araç ruhsatı, kira sözleşmesi gibi mülkiyet belgelerini ekle',
      'Evlenme cüzdanı, çocukların nüfus belgesi — aile bağlarını çoğalt',
      'LinkedIn/sosyal medya profilini Türkiye ağıyla güçlendir',
      'Türkiye\'deki topluluk/dernek üyelik belgelerini ekle',
    ]
  },
  {
    keywords: ['purpose of visit','intention','genuine visitor','tourist','trip not credible','amaç','niyet','turizm','ziyaret'],
    title: 'Seyahat Amacı İnandırıcı Bulunmadı',
    category: 'purpose', severity: 'high', waitMonths: 1,
    actions: [
      'Niyet mektubunu tamamen yeniden yaz — spesifik aktiviteler, müzeler, şehirler belirt',
      'Gerçek otel ve uçak rezervasyonları ekle (iptal edilebilir)',
      'Seyahat planını (itinerary) günlük bazda hazırla',
      'Geçmiş turizm geçmişini gösteren belgeler ekle (eski pasaport, fotoğraflar)',
      'Davetiye varsa noter onaylı kopyasını ekle',
    ]
  },
  {
    keywords: ['document','false','forged','inconsistent','incomplete','fabricated','sahte','eksik','tutarsız','belge'],
    title: 'Belge Sorunu (Tutarsız / Eksik / Şüpheli)',
    category: 'document', severity: 'critical', waitMonths: 3,
    actions: [
      'Tüm belgelerdeki isim, adres ve tarih bilgilerini çapraz kontrol et',
      'Barkodlu belgelerle yenile: SGK, Nüfus Kayıt, Yerleşim Yeri',
      'Asla sahte veya değiştirilmiş belge sunma — kalıcı ban riski var',
      'Eksik belgelerin tam listesini ret yazısından çıkar ve hepsini tamamla',
      'Belgeleri kronolojik sıraya koy ve numaralandır',
    ]
  },
  {
    keywords: ['overstay','previous refusal','immigration history','visa violation','red flag','geçmiş','ret','ihlal','aşım'],
    title: 'Olumsuz Seyahat/Vize Geçmişi',
    category: 'history', severity: 'critical', waitMonths: 6,
    actions: [
      'Önceki tüm ret kararlarını yeni başvuruda açıkça beyan et (gizlemek yasak)',
      'Süre aşımı varsa resmi belgelerle açıklama yap',
      'Vize geçmişini temizlemek için önce vizesiz ülkelere seyahat et (Sırbistan, Karadağ)',
      'Profesyonel danışmanlık desteği al — bu tür dosyalar özel yaklaşım gerektirir',
      'En az 6-12 ay bekle ve profilini güçlendir',
    ]
  },
  {
    keywords: ['travel insurance','insurance','sigorta'],
    title: 'Seyahat Sağlık Sigortası Eksik',
    category: 'document', severity: 'medium', waitMonths: 0,
    actions: [
      'Schengen için min €30.000 teminatlı, tüm Schengen ülkelerini kapsayan sigorta al',
      'AXA, Allianz veya Europ Assistance\'dan online satın alabilirsin',
      'Poliçenin başlangıç/bitiş tarihleri seyahat tarihlerini kapsamalı',
    ]
  },
];

// ============================================================
// ÖZELLİK 2: RANDEVU TAKVİM VERİ TABANI
// ============================================================
export interface ConsulateInfo {
  country: string;
  flag: string;
  city: string;
  waitDays: number;
  address: string;
  phone: string;
  website: string;
  workHours: string;
  visaType: string;
  note: string;
}

export const consulateData: ConsulateInfo[] = [
  { country: 'ABD', flag: '🇺🇸', city: 'İstanbul', waitDays: 188, address: 'Üsküdar, İstanbul', phone: '+90 212 335 9000', website: 'tr.usembassy.gov', workHours: 'Pts-Cum 08:00-17:00', visaType: 'B1/B2 (Turistik)', note: 'Mülakat zorunlu. DS-160 formu doldurulmalı.' },
  { country: 'ABD', flag: '🇺🇸', city: 'Ankara', waitDays: 175, address: 'Kavaklıdere, Ankara', phone: '+90 312 455 5555', website: 'tr.usembassy.gov', workHours: 'Pts-Cum 08:00-17:00', visaType: 'B1/B2 (Turistik)', note: 'İstanbul\'dan daha kısa bekleme süresi.' },
  { country: 'İngiltere', flag: '🇬🇧', city: 'İstanbul', waitDays: 21, address: 'Meşrutiyet Cad. Beyoğlu', phone: 'VFS Global: 0850 800 8090', website: 'gov.uk/apply-to-come-to-the-uk', workHours: 'Pts-Cum 09:00-16:00', visaType: 'Standard Visitor', note: '28-gün kuralı kritik. Online başvuru + VFS randevu.' },
  { country: 'Almanya', flag: '🇩🇪', city: 'İstanbul', waitDays: 25, address: 'İnönü Caddesi, Gümüşsuyu', phone: '+90 212 334 6100', website: 'istanbul.diplo.de', workHours: 'Pts-Per 08:30-12:00', visaType: 'Schengen C', note: 'Finansal süreklilik kritik. Biyometrik randevu şart.' },
  { country: 'Almanya', flag: '🇩🇪', city: 'Ankara', waitDays: 30, address: 'Atatürk Bulvarı, Çankaya', phone: '+90 312 459 5100', website: 'ankara.diplo.de', workHours: 'Pts-Per 08:30-12:00', visaType: 'Schengen C', note: 'Ankara ret oranı %27.1 — İstanbul tercih edilebilir.' },
  { country: 'Fransa', flag: '🇫🇷', city: 'İstanbul', waitDays: 18, address: 'İstiklal Cad. Beyoğlu', phone: 'VFS Global', website: 'france-visas.gouv.fr', workHours: 'Pts-Cum 09:00-12:30', visaType: 'Schengen C', note: 'VFS aracılığıyla başvuru.' },
  { country: 'İtalya', flag: '🇮🇹', city: 'İstanbul', waitDays: 15, address: 'Tomtom Mah. Beyoğlu', phone: '+90 212 243 1024', website: 'istanbul.esteri.it', workHours: 'Pts-Per 09:00-12:00', visaType: 'Schengen C', note: 'En düşük Schengen ret oranı (%8.7). Hızlı işlem.' },
  { country: 'Hollanda', flag: '🇳🇱', city: 'Ankara', waitDays: 25, address: 'Hollanda Caddesi, Çankaya', phone: 'VFS Global', website: 'netherlandsandyou.nl', workHours: 'Pts-Cum 09:00-12:00', visaType: 'Schengen C', note: 'VFS aracılığıyla başvuru.' },
  { country: 'İspanya', flag: '🇪🇸', city: 'İstanbul', waitDays: 20, address: 'Teşvikiye, Şişli', phone: 'VFS Global', website: 'exteriores.gob.es', workHours: 'Pts-Cum 09:00-13:00', visaType: 'Schengen C', note: 'Sahte rezervasyon otomatik tespiti var.' },
];

// ============================================================
// ÖZELLİK 6: BELGE TUTARLILIK MATRİSİ
// ============================================================
export interface DocField {
  id: string;
  label: string;
  placeholder: string;
  documents: string[];
}

export const docMatrixFields: DocField[] = [
  { id: 'fullName', label: 'Ad Soyad', placeholder: 'Örn: EMRE KORN', documents: ['Pasaport', 'Dilekçe', 'SGK', 'Banka'] },
  { id: 'address', label: 'İkamet Adresi', placeholder: 'Örn: Kadıköy, İstanbul', documents: ['Yerleşim Yeri Belgesi', 'SGK', 'Dilekçe', 'Banka'] },
  { id: 'employer', label: 'İşveren / Şirket Adı', placeholder: 'Örn: XYZ Bilişim A.Ş.', documents: ['SGK', 'İşveren Yazısı', 'Vergi Levhası'] },
  { id: 'income', label: 'Aylık Net Gelir', placeholder: 'Örn: 45.000 TL', documents: ['Banka Dökümü', 'Maaş Bordrosu', 'Dilekçe'] },
  { id: 'travelStart', label: 'Seyahat Başlangıç Tarihi', placeholder: 'Örn: 15.07.2026', documents: ['Uçak Bileti', 'Otel Rezervasyonu', 'Dilekçe', 'Sigorta'] },
  { id: 'travelEnd', label: 'Seyahat Bitiş Tarihi', placeholder: 'Örn: 25.07.2026', documents: ['Uçak Bileti', 'Otel Rezervasyonu', 'Dilekçe', 'Sigorta'] },
  { id: 'destination', label: 'Konaklama Şehri / Adresi', placeholder: 'Örn: Berlin, Almanya', documents: ['Otel Rezervasyonu', 'Dilekçe', 'Sigorta'] },
  { id: 'passportNo', label: 'Pasaport Numarası', placeholder: 'Örn: U12345678', documents: ['Pasaport', 'Vize Başvuru Formu', 'Dilekçe'] },
];
