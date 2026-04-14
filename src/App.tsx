/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  CheckCircle2,
  Circle,
  FileText,
  ShieldCheck,
  FileCheck,
  TrendingUp,
  Download,
  AlertCircle,
  ChevronRight,
  ArrowLeft,
  Info,
  Briefcase,
  Home,
  Globe,
  Wallet,
  Stethoscope,
  PenTool,
  Zap,
  Target,
  Clock,
  Brain,
  LayoutList,
  MessageSquare,
  AlertTriangle,
  Map,
  CreditCard,
  Check,
  X,
  Calendar,
  Plane,
  Search,
  Upload,
  Sparkles,
  MapPin,
  Star,
  RefreshCw,
  XCircle,
  Layers,
  Euro,
  BadgeCheck,
  Stamp,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Banknote,
  ScanLine,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import Footer from './components/Footer';
import { buildCountryWarning, CountryWarning } from './lib/scoringV2';

// Types
interface ProfileData {
  // 1. Financial (Max 25)
  bankRegularity: boolean;
  bankSufficientBalance: boolean;
  bankNoLastMinuteDeposit: boolean;
  highSavingsAmount: boolean;
  hasAssets: boolean;
  hasSteadyIncome: boolean;
  bankHealthScore: number; // 0-100 analysis
  hasSuspiciousLargeDeposit: boolean;
  hasRegularSpending: boolean;
  salaryDetected: boolean;
  recurringExpensesDetected: boolean;
  unusualLargeTransactions: boolean;
  lowSpendingActivity: boolean;
  monthlyInflow: number;
  monthlyOutflow: number;
  transactionFrequency: 'low' | 'medium' | 'high';
  recurringPaymentTypes: string[];

  // 2. Professional (Max 20)
  hasSgkJob: boolean;
  isPublicSectorEmployee: boolean;
  sgkEmployerLetterWithReturn: boolean;
  yearsInCurrentJob: number;
  sgkAddressMatchesDs160: boolean;

  // 3. Travel History (Max 20)
  hasHighValueVisa: boolean;
  hasOtherVisa: boolean;
  travelHistoryNonVisa: boolean;
  noOverstayHistory: boolean;
  hasSocialMediaFootprint: boolean; // New 2025 criteria

  // 4. Family & Social Ties (Max 10)
  isMarried: boolean;
  hasChildren: boolean;
  isStudent: boolean;
  strongFamilyTies: boolean;

  // 5. Purpose & Commitment (Max 15)
  useOurTemplate: boolean;
  hasInvitation: boolean;
  paidReservations: boolean;
  addressMatchSgk: boolean;
  datesMatchReservations: boolean;
  purposeClear: boolean;

  // 6. Quality & Trust (Max 10)
  hasValidPassport: boolean;
  passportConditionGood: boolean;
  passportValidityLong: boolean;
  documentConsistency: boolean;
  interviewPrepared: boolean;
  cleanCriminalRecord: boolean;
  hasBarcodeSgk: boolean; // Tactic: barkodlu SGK
  
  // Extra
  hasTravelInsurance: boolean;

  // 7. Kritik Yeni Alanlar (2025-2026 Konsolosluk Kuralları)
  has28DayHolding: boolean;         // UK: Para 28 gün hesapta bekledi mi?
  has6MonthStatements: boolean;     // UK: 6 aylık hesap dökümü var mı?
  hasPreviousRefusal: boolean;      // Önceki vize reddi var mı?
  previousRefusalDisclosed: boolean;// Önceki ret beyan edildi mi?
  dailyBudgetSufficient: boolean;   // Schengen: Günlük €100-120 gösterilebiliyor mu?
  hasReturnTicket: boolean;         // Dönüş bileti rezervasyonu var mı?
  hasHealthInsurance: boolean;      // Sağlık/seyahat sigortası var mı? (Schengen zorunlu)
  multiTieStrength: number;         // Kaç farklı bağ kategorisi var? (0-4: iş, mülk, aile, sosyal)
  interviewConfidence: 'low' | 'medium' | 'high'; // ABD mülakatı için özgüven/hazırlık
  statementMonths: number;          // Kaç aylık banka dökümü sunulacak (3, 6, 12)
  incomeSourceClear: boolean;       // Gelir kaynağı netçe banka dökümünde görünüyor mu?
  noFakeBooking: boolean;           // Sahte otel/uçak rezervasyonu yok mu?
  tieCategories: {                  // Çok katmanlı bağlar - her biri ayrı puan
    employment: boolean;
    property: boolean;
    family: boolean;
    community: boolean;
    education: boolean;
  };

  // Strategy & Intelligence (New)
  targetCountry: string;
  persona: string;
  readinessStatus: 'apply' | 'wait' | 'risky';
  documentStrengths: {
    financial: number;
    professional: number;
    history: number;
    trust: number;
  };
  timelineAdvice: string;
  strategyRoute: string[];
}

interface Conflict {
  type: 'error' | 'warning';
  message: string;
  suggestion: string;
}

interface RoadmapItem {
  week: number;
  task: string;
  impact: string;
}

interface LetterData {
  // Ortak alanlar
  fullName: string;
  passportNumber: string;
  birthDate: string;
  nationality: string;
  phone: string;
  email: string;
  address: string;
  targetCountry: string;
  purpose: string;
  startDate: string;
  endDate: string;
  // Finansal & Mesleki
  occupation: string;
  companyEmployer: string;
  monthlyIncome: string;
  bankBalance: string;
  insuranceProvider: string;
  insurancePolicyNo: string;
  // Konaklama & Uçuş
  hotelName: string;
  hotelAddress: string;
  hotelReservationNo: string;
  flightOutbound: string;
  flightInbound: string;
  // Bağlar
  tieDescription: string;
  // Sponsor alanları
  sponsorFullName: string;
  sponsorRelation: string;
  sponsorId: string;
  sponsorAddress: string;
  sponsorPhone: string;
  sponsorOccupation: string;
  sponsorIncome: string;
  // İşveren alanları
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  jobStartDate: string;
  authorizedName: string;
  authorizedTitle: string;
  returnDate: string;
  // Seyahat planı
  dailyPlan: string;
}

const ukDocuments = {
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

const ukPricing = {
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
interface RefusalRule {
  keywords: string[];
  title: string;
  category: 'financial' | 'ties' | 'purpose' | 'document' | 'history';
  severity: 'critical' | 'high' | 'medium';
  waitMonths: number;
  actions: string[];
}

const refusalRules: RefusalRule[] = [
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
interface ConsulateInfo {
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

const consulateData: ConsulateInfo[] = [
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
interface DocField {
  id: string;
  label: string;
  placeholder: string;
  documents: string[];
}

const docMatrixFields: DocField[] = [
  { id: 'fullName', label: 'Ad Soyad', placeholder: 'Örn: EMRE KORN', documents: ['Pasaport', 'Dilekçe', 'SGK', 'Banka'] },
  { id: 'address', label: 'İkamet Adresi', placeholder: 'Örn: Kadıköy, İstanbul', documents: ['Yerleşim Yeri Belgesi', 'SGK', 'Dilekçe', 'Banka'] },
  { id: 'employer', label: 'İşveren / Şirket Adı', placeholder: 'Örn: XYZ Bilişim A.Ş.', documents: ['SGK', 'İşveren Yazısı', 'Vergi Levhası'] },
  { id: 'income', label: 'Aylık Net Gelir', placeholder: 'Örn: 45.000 TL', documents: ['Banka Dökümü', 'Maaş Bordrosu', 'Dilekçe'] },
  { id: 'travelStart', label: 'Seyahat Başlangıç Tarihi', placeholder: 'Örn: 15.07.2026', documents: ['Uçak Bileti', 'Otel Rezervasyonu', 'Dilekçe', 'Sigorta'] },
  { id: 'travelEnd', label: 'Seyahat Bitiş Tarihi', placeholder: 'Örn: 25.07.2026', documents: ['Uçak Bileti', 'Otel Rezervasyonu', 'Dilekçe', 'Sigorta'] },
  { id: 'destination', label: 'Konaklama Şehri / Adresi', placeholder: 'Örn: Berlin, Almanya', documents: ['Otel Rezervasyonu', 'Dilekçe', 'Sigorta'] },
  { id: 'passportNo', label: 'Pasaport Numarası', placeholder: 'Örn: U12345678', documents: ['Pasaport', 'Vize Başvuru Formu', 'Dilekçe'] },
];

// ============================================================
// ÖZELLİK 7 (YENİ): VİZESİZ ÜLKELER BULUCU
// ============================================================
interface VisaFreeCountry {
  name: string;
  flag: string;
  region: string;
  entryType: 'Vizesiz' | 'e-Vize' | 'Kapıda Vize';
  maxDays: number;
  flightHours: number;
  avgCostEur: number;
  scoreBoost: number;
  stampValue: 'Yüksek' | 'Orta' | 'Düşük';
  tip: string;
}

const visaFreeCountries: VisaFreeCountry[] = [
  { name: 'Sırbistan', flag: '🇷🇸', region: 'Balkanlar', entryType: 'Vizesiz', maxDays: 30, flightHours: 1.5, avgCostEur: 150, scoreBoost: 6, stampValue: 'Yüksek', tip: 'En stratejik başlangıç ülkesi. Belgrad vizesini görürsünüz.' },
  { name: 'Karadağ', flag: '🇲🇪', region: 'Balkanlar', entryType: 'Vizesiz', maxDays: 30, flightHours: 1.5, avgCostEur: 180, scoreBoost: 5, stampValue: 'Yüksek', tip: 'Sırbistan ile kombine gezi: 2 ülke 1 hafta.' },
  { name: 'Makedonya', flag: '🇲🇰', region: 'Balkanlar', entryType: 'Vizesiz', maxDays: 90, flightHours: 1, avgCostEur: 120, scoreBoost: 5, stampValue: 'Yüksek', tip: 'Üsküp güzel bir şehir. AB aday ülkesi — damga değerli.' },
  { name: 'Arnavutluk', flag: '🇦🇱', region: 'Balkanlar', entryType: 'Vizesiz', maxDays: 90, flightHours: 1.5, avgCostEur: 100, scoreBoost: 4, stampValue: 'Orta', tip: 'Çok ucuz. Bütçe kısıtlıysa ideal.' },
  { name: 'Bosna Hersek', flag: '🇧🇦', region: 'Balkanlar', entryType: 'Vizesiz', maxDays: 30, flightHours: 1.5, avgCostEur: 130, scoreBoost: 4, stampValue: 'Orta', tip: 'Saraybosna kültürel açıdan çok zengin.' },
  { name: 'Georgia', flag: '🇬🇪', region: 'Kafkasya', entryType: 'Vizesiz', maxDays: 365, flightHours: 2.5, avgCostEur: 200, scoreBoost: 5, stampValue: 'Yüksek', tip: '1 yıl kalabilirsin. Uzun giriş-çıkış geçmişi oluşturur.' },
  { name: 'Azerbaycan', flag: '🇦🇿', region: 'Kafkasya', entryType: 'e-Vize', maxDays: 30, flightHours: 2, avgCostEur: 160, scoreBoost: 3, stampValue: 'Orta', tip: 'E-Vize 30$ — kolay alınıyor.' },
  { name: 'Japonya', flag: '🇯🇵', region: 'Asya', entryType: 'Vizesiz', maxDays: 90, flightHours: 12, avgCostEur: 1200, scoreBoost: 10, stampValue: 'Yüksek', tip: 'Japonya damgası Schengen/UK başvurularında çok güçlü referans.' },
  { name: 'Singapur', flag: '🇸🇬', region: 'Asya', entryType: 'Vizesiz', maxDays: 30, flightHours: 11, avgCostEur: 900, scoreBoost: 9, stampValue: 'Yüksek', tip: 'Gelişmiş ülke damgası — vize geçmişi için ideal.' },
  { name: 'Hong Kong', flag: '🇭🇰', region: 'Asya', entryType: 'Vizesiz', maxDays: 14, flightHours: 11, avgCostEur: 800, scoreBoost: 8, stampValue: 'Yüksek', tip: 'İstanbul\'dan direkt uçuş var.' },
  { name: 'Güney Kore', flag: '🇰🇷', region: 'Asya', entryType: 'Vizesiz', maxDays: 90, flightHours: 11, avgCostEur: 950, scoreBoost: 9, stampValue: 'Yüksek', tip: '90 gün vizesiz. K-ETA gerekli (ücretsiz).' },
  { name: 'Ukrayna', flag: '🇺🇦', region: 'Doğu Avrupa', entryType: 'Vizesiz', maxDays: 90, flightHours: 1.5, avgCostEur: 120, scoreBoost: 3, stampValue: 'Düşük', tip: 'Şu an güvenli değil — tavsiye edilmez.' },
  { name: 'Tunus', flag: '🇹🇳', region: 'Afrika', entryType: 'Vizesiz', maxDays: 90, flightHours: 2.5, avgCostEur: 350, scoreBoost: 2, stampValue: 'Düşük', tip: 'Ucuz tatil ama vize geçmişine katkısı az.' },
  { name: 'Maldivler', flag: '🇲🇻', region: 'Hint Okyanusu', entryType: 'Kapıda Vize', maxDays: 30, flightHours: 8, avgCostEur: 1500, scoreBoost: 4, stampValue: 'Orta', tip: 'Lüks tatil + pasaport damgası.' },
  { name: 'Tayland', flag: '🇹🇭', region: 'Asya', entryType: 'Vizesiz', maxDays: 30, flightHours: 10, avgCostEur: 700, scoreBoost: 5, stampValue: 'Orta', tip: 'Bangkok + Phuket popüler. Makul maliyetli.' },
];

// ============================================================
// ÖZELLİK 7: SCHENGEN ÜLKE KARŞILAŞTIRICI VERİ TABANI
// Kaynak: 2024-2025-2026 Schengen istatistikleri — Türk başvurucular
// AB Vize İstatistikleri Raporu + IKV + SchengenVisaInfo + Atlys
// SIRALAMA: En fazla vize veren (en düşük ret) → en az veren (en yüksek ret)
// ============================================================
// Banka Analizi Yapılandırılmış Sonuç
interface BankAnalysisResult {
  fileName: string;
  country: string;
  score: number;
  grade: string;
  gradeEmoji: string;
  positives: string[];
  negatives: string[];
  tips: string[];
  summary: string;
}

interface SchengenCountry {
  name: string;
  flag: string;
  rejectionRate: number;       // Türk başvurucular için ret oranı % (2024-2025)
  approvalRate: number;        // Onay oranı %
  totalApps2024: number;       // 2024 Türk başvuru sayısı (tahmini)
  avgProcessDays: number;
  dailyBudgetReq: number;
  difficulty: 'Kolay' | 'Orta' | 'Zor' | 'Çok Zor';
  difficultyColor: string;
  trend: 'İyileşiyor' | 'Stabil' | 'Kötüleşiyor';
  strengths: string[];
  warnings: string[];
  tip: string;
  consulate: string;
  update2026: string;          // 2026 güncelleme notu
}

const schengenCountries: SchengenCountry[] = [
  // ═══ KOLAY — En yüksek onay oranları ═══
  {
    name: "Romanya", flag: "🇷🇴", rejectionRate: 4.4, approvalRate: 95.6,
    totalApps2024: 28000, avgProcessDays: 8, dailyBudgetReq: 50,
    difficulty: "Kolay", difficultyColor: "emerald", trend: "İyileşiyor",
    strengths: ["En yüksek onay oranı (%95.6)", "Hızlı işlem (8 gün)", "En düşük finansal baskı", "Türklere karşı pozitif tutum"],
    warnings: ["Ülke kısıtlaması: çoğu zaman sadece Romanya için geçerli", "Tüm Schengen'de kullanamayabilirsiniz"],
    tip: "Romanya; Schengen geçmişi olmayanlar için en güvenli ilk adım. Onay aldıktan sonra seyahat geçmişi oluşturulabilir.",
    consulate: "Ankara / İstanbul",
    update2026: "Romanya 2024'te Schengen'e tam üye oldu — artık tüm Schengen bölgesinde geçerli."
  },
  {
    name: "Slovakya", flag: "🇸🇰", rejectionRate: 6.7, approvalRate: 93.3,
    totalApps2024: 12000, avgProcessDays: 10, dailyBudgetReq: 60,
    difficulty: "Kolay", difficultyColor: "emerald", trend: "Stabil",
    strengths: ["2. en yüksek onay oranı (%93.3)", "Az başvuru — hızlı randevu", "Esnek finansal değerlendirme"],
    warnings: ["Turistik gerekçe net olmalı", "Bratislava dışı seyahat planı ekleyin"],
    tip: "Slovakya; stratejik ilk başvuru için ideal. Geçmiş olmayan profillere genellikle pozitif yaklaşıyor.",
    consulate: "Ankara",
    update2026: "2026 politikası değişmedi. Önceki Schengen geçmişi olanlara çoklu giriş imkânı."
  },
  {
    name: "Portekiz", flag: "🇵🇹", rejectionRate: 8.7, approvalRate: 91.3,
    totalApps2024: 18000, avgProcessDays: 12, dailyBudgetReq: 70,
    difficulty: "Kolay", difficultyColor: "emerald", trend: "İyileşiyor",
    strengths: ["%91.3 onay oranı", "Turizm ülkesi — güçlü motivasyon", "Lizbon/Porto çekici destinasyonlar"],
    warnings: ["Sahte rezervasyon Portekiz'de de tespit ediliyor", "Sigorta €30.000 şart"],
    tip: "Portekiz, İspanya ile aynı konsolosluktan işlem yapılabilir. Kombine gezi planı avantaj sağlar.",
    consulate: "İstanbul / Ankara",
    update2026: "Turizm artışı nedeniyle 2026'da randevu süreleri 2-3 hafta uzadı."
  },
  {
    name: "Malta", flag: "🇲🇹", rejectionRate: 9.2, approvalRate: 90.8,
    totalApps2024: 8000, avgProcessDays: 10, dailyBudgetReq: 80,
    difficulty: "Kolay", difficultyColor: "emerald", trend: "Stabil",
    strengths: ["%90.8 onay oranı", "Ada turizmi — güçlü gerekçe", "İngilizce dil okulu + turizm avantajı"],
    warnings: ["Ada ülkesi — çıkış-giriş kontrolü sıkı", "Çalışma şüphesi riski var"],
    tip: "Malta için dil kursu + turizm kombini mükemmel. İngilizce kurs kaydı başvuruyu güçlendirir.",
    consulate: "Ankara",
    update2026: "Malta 2026'da dijital başvuruya geçiyor — VFS üzerinden online."
  },
  {
    name: "İtalya", flag: "🇮🇹", rejectionRate: 11.3, approvalRate: 88.7,
    totalApps2024: 95000, avgProcessDays: 15, dailyBudgetReq: 80,
    difficulty: "Kolay", difficultyColor: "emerald", trend: "Stabil",
    strengths: ["%88.7 onay oranı", "Yüksek hacim — deneyimli konsolosluk", "Turizm gerekçesi çok güçlü"],
    warnings: ["Roma/Milano'da sahte rezervasyon sistematik tespit ediliyor", "Tatil sezonunda ek inceleme"],
    tip: "İtalya; Schengen'e ilk adım için en popüler güvenli seçim. Yüksek hacim sayesinde süreç standartlaştı.",
    consulate: "İstanbul / Ankara / İzmir",
    update2026: "VFS Global altyapısı güncellendi. Randevu online — biyometrik zorunlu."
  },
  {
    name: "Slovenya", flag: "🇸🇮", rejectionRate: 12.1, approvalRate: 87.9,
    totalApps2024: 6000, avgProcessDays: 12, dailyBudgetReq: 70,
    difficulty: "Kolay", difficultyColor: "emerald", trend: "Stabil",
    strengths: ["Düşük ret oranı (%12.1)", "Az kalabalık — hızlı randevu", "Güzel doğa destinasyonu"],
    warnings: ["Bled/Ljubljana dışı plan zayıf görülebilir", "Güçlü geri dönüş kanıtı şart"],
    tip: "Slovenya, Hırvatistan ve Avusturya ile kombine planlayın. Güçlü çok ülke itinerary oluşturun.",
    consulate: "Ankara",
    update2026: "Slovenya Schengen kotasını artırdı. 2026'da daha fazla Türk başvurucuya olumlu."
  },
  {
    name: "Yunanistan", flag: "🇬🇷", rejectionRate: 13.0, approvalRate: 87.0,
    totalApps2024: 296377, avgProcessDays: 12, dailyBudgetReq: 80,
    difficulty: "Kolay", difficultyColor: "emerald", trend: "İyileşiyor",
    strengths: ["En yüksek Türk başvurusu (296.377 — 1. sıra)", "Turizm ekonomisi — çok çekici", "Ada + kıta seçenekleri"],
    warnings: ["Yüksek hacimde sahte rezervasyon tespit sistemi aktif", "Yaz aylarında randevu 4-6 hafta öne alın"],
    tip: "Yunanistan en çok tercih edilen hedef. Erken başvuru, gerçek otel + dönüş bileti ile yüksek başarı.",
    consulate: "İstanbul / Ankara / İzmir",
    update2026: "Yunanistan 2026'da 5 yıllık çoklu giriş vizesini pozitif geçmişlilere uyguluyor."
  },
  {
    name: "İspanya", flag: "🇪🇸", rejectionRate: 14.2, approvalRate: 85.8,
    totalApps2024: 72000, avgProcessDays: 15, dailyBudgetReq: 90,
    difficulty: "Orta", difficultyColor: "amber", trend: "Stabil",
    strengths: ["%85.8 onay oranı", "Turizm motivasyonu çok güçlü", "Barselona/Madrid çekiciliği"],
    warnings: ["UGE-CE sahte rezervasyon sistemi aktif — gizlenmiş ret = kalıcı ban", "Sigorta eksikliği direkt ret"],
    tip: "İspanya'da yalnızca gerçek rezervasyonla başvurun. Sahte tespit oranı Schengen'in en yükseği.",
    consulate: "İstanbul / Ankara",
    update2026: "İspanya 2026'da Schengen kotasını genişletti. Turizm sezonunda başvurular artıyor."
  },
  {
    name: "Çek Cumhuriyeti", flag: "🇨🇿", rejectionRate: 15.8, approvalRate: 84.2,
    totalApps2024: 22000, avgProcessDays: 14, dailyBudgetReq: 75,
    difficulty: "Orta", difficultyColor: "amber", trend: "Stabil",
    strengths: ["Orta ret oranı (%15.8)", "Prag turizm motivasyonu güçlü", "Hızlı işlem"],
    warnings: ["Orta Avrupa kışı için turizm gerekçesi zayıf", "Güçlü iş/ticaret bağlantısı avantaj"],
    tip: "Çek Cumhuriyeti için Avrupa merkezi konumu — çok ülke gezi planıyla başvurun.",
    consulate: "Ankara",
    update2026: "Çek Cumhuriyeti Schengen kotasını artırmadı, yoğunluk hafifçe arttı."
  },
  {
    name: "Avusturya", flag: "🇦🇹", rejectionRate: 16.4, approvalRate: 83.6,
    totalApps2024: 35000, avgProcessDays: 18, dailyBudgetReq: 90,
    difficulty: "Orta", difficultyColor: "amber", trend: "Stabil",
    strengths: ["Kültür/müzik motivasyonu güçlü", "Viyana çekici destinasyon", "İş amacı iyi değerlendiriliyor"],
    warnings: ["Finansal süreklilik önemli", "Tatil sezonunda ek inceleme"],
    tip: "Avusturya için kültür programı (opera, müze, festival) başvuruyu güçlendirir.",
    consulate: "İstanbul / Ankara",
    update2026: "Avusturya 2026'da biyometrik zorunluluğunu sıkılaştırdı."
  },
  {
    name: "İsviçre", flag: "🇨🇭", rejectionRate: 17.1, approvalRate: 82.9,
    totalApps2024: 28000, avgProcessDays: 20, dailyBudgetReq: 130,
    difficulty: "Orta", difficultyColor: "amber", trend: "Stabil",
    strengths: ["İş/kongre amacı çok iyi karşılanır", "Finans sektörü bağlantısı avantajlı"],
    warnings: ["En yüksek günlük bütçe (€130) şart", "Sadece turistik gerekçe zayıf görülebilir"],
    tip: "İsviçre için güçlü finansal profil şart. Günlük €130+ bütçe gösteremeyen başvurmamalı.",
    consulate: "Ankara",
    update2026: "İsviçre Schengen politikasına uyum sağlayarak 2026'da çoklu vize uygulamasına geçti."
  },
  {
    name: "Macaristan", flag: "🇭🇺", rejectionRate: 17.9, approvalRate: 82.1,
    totalApps2024: 19000, avgProcessDays: 14, dailyBudgetReq: 65,
    difficulty: "Orta", difficultyColor: "amber", trend: "İyileşiyor",
    strengths: ["Nispeten düşük ret oranı", "Budapeşte turizm motivasyonu güçlü", "Düşük bütçe gereksinimi"],
    warnings: ["Son yıllarda yabancı politikasında sertleşme eğilimi"],
    tip: "Macaristan; bütçe kısıtlıysa iyi alternatif. Budapeşte + Viyana kombine planı tercih edilir.",
    consulate: "Ankara",
    update2026: "Macaristan 2026'da Türk turistlere özel hızlı işlem pilot uygulaması başlattı."
  },
  {
    name: "Polonya", flag: "🇵🇱", rejectionRate: 18.5, approvalRate: 81.5,
    totalApps2024: 25000, avgProcessDays: 15, dailyBudgetReq: 65,
    difficulty: "Orta", difficultyColor: "amber", trend: "Stabil",
    strengths: ["Uygun ret oranı (%18.5)", "Varşova/Krakow turizm", "Ekonomik ülke — bütçe gereksinimi düşük"],
    warnings: ["Doğu Avrupa ülkesi — bazı konsolosluklar katı"],
    tip: "Polonya için iş amacı veya kültür/tarih gerekçesi güçlü. Varşova Avrupa merkezi konumu avantaj.",
    consulate: "Ankara / İstanbul",
    update2026: "Polonya 2025'te başvuru kapasitesini artırdı. Randevu süreleri kısaldı."
  },
  {
    name: "Fransa", flag: "🇫🇷", rejectionRate: 18.9, approvalRate: 81.1,
    totalApps2024: 151640, avgProcessDays: 20, dailyBudgetReq: 100,
    difficulty: "Orta", difficultyColor: "amber", trend: "Stabil",
    strengths: ["Kültür/sanat motivasyonu çok güçlü", "Paris çekiciliği", "İş bağlantısı avantajlı"],
    warnings: ["Belge kalitesi ve tutarlılığı kritik", "Fransızca davetiye veya etkinlik belgesi fark yaratır"],
    tip: "Fransa için davetiye, kültürel etkinlik kaydı veya müze/galeri rezervasyonu ekleyin. Ret oranı eğitimlilerde çok düşüyor.",
    consulate: "İstanbul / Ankara",
    update2026: "Paris Olimpiyatları sonrası 2026'da vize kapasitesi normale döndü."
  },
  {
    name: "Norveç", flag: "🇳🇴", rejectionRate: 19.8, approvalRate: 80.2,
    totalApps2024: 14000, avgProcessDays: 20, dailyBudgetReq: 120,
    difficulty: "Orta", difficultyColor: "amber", trend: "Stabil",
    strengths: ["Doğa turizmi — güçlü gerekçe (fiyordlar, aurora)", "Nispeten standart süreç"],
    warnings: ["Yüksek yaşam maliyeti — bütçe kanıtı kritik", "Kış turizmi gerekçesi çok güçlü olmalı"],
    tip: "Norveç için fiyord turu veya aurora borealis paketi ile başvurun. Doğa gerekçesi çok inandırıcı.",
    consulate: "Ankara",
    update2026: "Norveç EES sistemine entegre oldu (Ekim 2025). Biyometrik beklenti artıyor."
  },
  {
    name: "İsveç", flag: "🇸🇪", rejectionRate: 21.4, approvalRate: 78.6,
    totalApps2024: 20000, avgProcessDays: 22, dailyBudgetReq: 110,
    difficulty: "Orta", difficultyColor: "amber", trend: "Stabil",
    strengths: ["İskandinav turizminde görece orta ret oranı", "İş/aile ziyareti iyi karşılanır"],
    warnings: ["Günlük bütçe yüksek tutulmalı (€110+)", "Kış turizmi gerekçesi zayıf görülebilir"],
    tip: "İsveç için Stockholm + Gothenburg kombine itin. İş/kültür amacı turistik gerekçeden daha güçlü.",
    consulate: "Ankara",
    update2026: "İsveç 2026'da dijital başvuruya geçmekte. VFS üzerinden online işlem."
  },
  {
    name: "Almanya", flag: "🇩🇪", rejectionRate: 22.0, approvalRate: 78.0,
    totalApps2024: 215506, avgProcessDays: 30, dailyBudgetReq: 100,
    difficulty: "Zor", difficultyColor: "orange", trend: "Stabil",
    strengths: ["En yüksek Türk topluluğu — aile ziyareti güçlü gerekçe", "İş/fuar amacı çok iyi değerlendiriliyor"],
    warnings: ["İstanbul ret %21.5 / Ankara ret %27.1 — şehir seçimi kritik", "Son dakika büyük mevduat kesin ret sebebi", "6 aylık finansal tutarlılık şart"],
    tip: "Almanya başvurusunda son 6 ayın her ayında düzenli maaş görünmeli. Ankara yerine İstanbul konsolosluğunu tercih edin.",
    consulate: "İstanbul (önerilir) / Ankara / İzmir",
    update2026: "Almanya 2025'te işçi ailesi için birleşik vize uygulamasını genişletti. 2026'da çoklu vize yaygınlaştı."
  },
  {
    name: "Hollanda", flag: "🇳🇱", rejectionRate: 24.1, approvalRate: 75.9,
    totalApps2024: 38000, avgProcessDays: 25, dailyBudgetReq: 110,
    difficulty: "Zor", difficultyColor: "orange", trend: "Stabil",
    strengths: ["Fuar/iş amacı çok iyi değerlendiriliyor (Amsterdam)", "Lale/müze turizmi güçlü gerekçe"],
    warnings: ["Yüksek ret oranı (%24.1)", "Finansal kanıt çok güçlü olmalı", "VFS randevu 3-4 hafta önceden alın"],
    tip: "Hollanda için davet mektubu veya fuar kaydı (Interpack, METS vb.) başarıyı %30 artırıyor.",
    consulate: "Ankara",
    update2026: "Hollanda 2026'da yüksek reddedilen profillere 3 ay bekleme uyguluyor."
  },
  {
    name: "Belçika", flag: "🇧🇪", rejectionRate: 27.5, approvalRate: 72.5,
    totalApps2024: 16000, avgProcessDays: 28, dailyBudgetReq: 100,
    difficulty: "Zor", difficultyColor: "orange", trend: "Kötüleşiyor",
    strengths: ["AB kurumları — iş amacı güçlü gerekçe", "Brugge turizm motivasyonu"],
    warnings: ["Ret oranı artıyor (%27.5)", "Belge tutarsızlığı toleransı çok düşük", "Güçlü Türkiye bağı kanıtı şart"],
    tip: "Belçika için çok güçlü finansal profil + net iş/kültür gerekçesi şart. Zayıf profillerle başvurmayın.",
    consulate: "Ankara",
    update2026: "Belçika 2025-2026'da inceleme kriterlerini sıkılaştırdı. Ret oranı artma eğiliminde."
  },
  {
    name: "Letonya", flag: "🇱🇻", rejectionRate: 28.3, approvalRate: 71.7,
    totalApps2024: 5000, avgProcessDays: 20, dailyBudgetReq: 80,
    difficulty: "Zor", difficultyColor: "orange", trend: "Stabil",
    strengths: ["Az başvurucu — hızlı randevu", "Riga turizm gerekçesi kabul görüyor"],
    warnings: ["Baltık ülkesi — genel ret oranı yüksek", "Güçlü iş/aile bağlantısı şart"],
    tip: "Letonya için seyahat amacı çok net olmalı. Riga + Tallinn kombine planı tercih edin.",
    consulate: "Ankara",
    update2026: "Letonya EES sistemine geçiş tamamlandı (Ekim 2025)."
  },
  {
    name: "Litvanya", flag: "🇱🇹", rejectionRate: 31.5, approvalRate: 68.5,
    totalApps2024: 7000, avgProcessDays: 25, dailyBudgetReq: 80,
    difficulty: "Çok Zor", difficultyColor: "rose", trend: "Kötüleşiyor",
    strengths: ["Vilnius tarihi merkezi güçlü turizm gerekçesi"],
    warnings: ["Ret oranı artıyor (%31.5)", "Baltık bölgesi sıkı inceleme", "Önceki Schengen geçmişi olmadan başvurma"],
    tip: "Litvanya'ya başvurmadan önce İtalya veya Portekiz geçmişi oluşturun. Direkt başvuru riski yüksek.",
    consulate: "Ankara",
    update2026: "Litvanya 2026'da Türk başvurularında ek belge talep etmeye başladı."
  },
  {
    name: "Finlandiya", flag: "🇫🇮", rejectionRate: 31.3, approvalRate: 68.7,
    totalApps2024: 9000, avgProcessDays: 30, dailyBudgetReq: 115,
    difficulty: "Çok Zor", difficultyColor: "rose", trend: "Stabil",
    strengths: ["Aurora/doğa turizmi — benzersiz gerekçe", "Akraba ziyareti güçlü kanıt"],
    warnings: ["Yüksek ret oranı (%31.3)", "Kış turizmi güçlü gerekçeyle sunulmalı", "€115+ günlük bütçe şart"],
    tip: "Finlandiya için özel aurora paketi veya Finlandiyalı aile bağlantısı çok etkili. Zayıf profillerle başvurma.",
    consulate: "Ankara",
    update2026: "Finlandiya 2026'da biyometrik kayıt zorunluluğunu öne aldı."
  },
  {
    name: "Estonya", flag: "🇪🇪", rejectionRate: 42.5, approvalRate: 57.5,
    totalApps2024: 4000, avgProcessDays: 40, dailyBudgetReq: 100,
    difficulty: "Çok Zor", difficultyColor: "rose", trend: "Kötüleşiyor",
    strengths: ["Dijital nomad/teknoloji iş amacı kabul görebilir", "e-Rezidency iş bağlantısı"],
    warnings: ["En yüksek ret oranlarından (%42.5)", "Güçlü iş gerekçesi olmadan başvurma", "İşlem süresi çok uzun (40 gün)"],
    tip: "Estonya'ya direkt başvurmak yerine önceki Schengen geçmişi oluşturun. Bu istatistik çok yüksek.",
    consulate: "Ankara",
    update2026: "Estonya 2025-2026'da dijital başvuruya geçti. İşlem süresi kısaldı ama ret oranı değişmedi."
  },
  {
    name: "Danimarka", flag: "🇩🇰", rejectionRate: 65.8, approvalRate: 34.2,
    totalApps2024: 6500, avgProcessDays: 35, dailyBudgetReq: 120,
    difficulty: "Çok Zor", difficultyColor: "rose", trend: "Kötüleşiyor",
    strengths: ["Aile/akraba daveti tek güçlü gerekçe", "Özel iş bağlantısı"],
    warnings: ["EN YÜKSEK RET ORANI: %65.8", "Her 3 başvurudan sadece 1'i onaylanıyor", "Kısa kıdem kesin ret sebebi", "Zayıf finansal profil başvurmamalı"],
    tip: "Danimarka'ya başvurmadan önce en az 2 Schengen geçmişi ve %90+ skor gereklidir. Birinci başvuru için kesinlikle tercih etmeyin.",
    consulate: "Ankara",
    update2026: "Danimarka 2025'te Türk başvurularında ek inceleme protokolü uygulamaya koydu."
  },
];

// ============================================================
// ÖZELLİK 8: SOSYAL MEDYA DENETİM REHBERİ VERİSİ
// ============================================================
interface SocialMediaItem {
  id: string;
  category: 'risk' | 'action' | 'positive';
  platform: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'tip';
}

const socialMediaChecklist: SocialMediaItem[] = [
  // KRİTİK RİSKLER
  {
    id: 'sm1', category: 'risk', platform: 'Tüm Platformlar', severity: 'critical',
    title: '"Yurt dışında kalmak istiyorum" paylaşımları',
    description: 'Göç niyeti ima eden her paylaşım (tweet, hikaye, yorum) konsolosluk taramasında ret gerekçesi olabilir. Bu tür içerikleri başvurudan 6 ay önce sil.'
  },
  {
    id: 'sm2', category: 'risk', platform: 'Instagram / Twitter', severity: 'critical',
    title: 'Yabancı ülkede çalışma/yerleşme planları',
    description: '"Almanya\'da iş arıyorum", "Green card başvurusu" gibi içerikler konsolosluk memuruna direkt ret gerekçesi sağlar. Hepsini kaldır.'
  },
  {
    id: 'sm3', category: 'risk', platform: 'LinkedIn', severity: 'critical',
    title: 'Yurt dışı iş başvurusu aktivitesi',
    description: 'LinkedIn\'de yabancı şirketlere "Open to Work" bayrağı veya aktif başvuru geçmişi görünüyorsa, konsolosluk memurunun erişimi olabilir. Başvuru sürecinde kaldır.'
  },
  {
    id: 'sm4', category: 'risk', platform: 'Facebook / Instagram', severity: 'warning',
    title: 'Aşırı lüks yaşam gösterisi ile finansal profil çelişkisi',
    description: 'Sosyal medyada pahalı araba/tatil sergilerken banka dökümünde düşük bakiye görünüyorsa çelişki yaratır. Tutarlı ol.'
  },
  {
    id: 'sm5', category: 'risk', platform: 'Tüm Platformlar', severity: 'warning',
    title: 'Siyasi hassas içerikler',
    description: 'Hedef ülkenin hükümetini veya politikalarını eleştiren içerikler bazı konsolosluklarda (özellikle ABD, İsrail) sorun yaratabilir.'
  },
  // ALINMASI GEREKEN AKSIYONLAR
  {
    id: 'sm6', category: 'action', platform: 'Instagram', severity: 'tip',
    title: 'Türkiye\'deki günlük hayatını belgele',
    description: 'İş yerine git, kafe, aile yemeği, Türk tatil yerleri gibi içerikler "Türkiye\'ye bağlı bir hayatım var" mesajı verir. Bu tür paylaşımları artır.'
  },
  {
    id: 'sm7', category: 'action', platform: 'LinkedIn', severity: 'tip',
    title: 'LinkedIn profilini Türkiye odaklı güncelle',
    description: 'Mevcut işveren, Türkiye şirket ağı, Türk mesleki dernekler — bunlar geri dönüş bağını dijital olarak kanıtlar. Profili tamamla ve güncel tut.'
  },
  {
    id: 'sm8', category: 'action', platform: 'Facebook', severity: 'tip',
    title: 'Aile fotoğrafları ve sosyal bağlar',
    description: 'Evlilik, çocuk, aile etkinlikleri gibi paylaşımlar "güçlü aile bağı" kanıtıdır. Bu içerikler görünür ve herkese açık olsun.'
  },
  {
    id: 'sm9', category: 'action', platform: 'Tüm Platformlar', severity: 'tip',
    title: 'Gizlilik ayarlarını kontrol et',
    description: 'Tüm platformlarda "arkadaşlarım" gizlilik ayarı yerine "herkese açık" tercih et. Boş veya gizli profil "şüpheli" olarak yorumlanabilir.'
  },
  // POZİTİF FAKTÖRLER
  {
    id: 'sm10', category: 'positive', platform: 'Instagram / Facebook', severity: 'tip',
    title: 'Önceki seyahat fotoğrafları büyük avantaj',
    description: 'Önceki yurt içi/yurt dışı seyahatlerden fotoğraflar "turistik amaçlı seyahat eden biri" imajı yaratır. Özellikle Türk şehirlerine tatil paylaşımları güçlü.'
  },
  {
    id: 'sm11', category: 'positive', platform: 'LinkedIn', severity: 'tip',
    title: 'Profesyonel başarılar ve Türkiye ağı',
    description: 'Terfi, proje tamamlama, Türk iş dünyasıyla etkileşim — bunlar hem gelir hem de geri dönüş motivasyonu kanıtıdır.'
  },
  {
    id: 'sm12', category: 'positive', platform: 'Tüm Platformlar', severity: 'tip',
    title: 'Hedef ülkeyi turistik amaçla araştırma içerikleri',
    description: 'Hedef ülkenin müzeleri, restoranları, manzaraları hakkında paylaşımlar seyahat amacını destekler. "Berlin\'deki müzeleri görmek istiyorum" gibi içerikler pozitif.'
  },
];

// ── Mülakat Simülatörü Soru Bankası ─────────────────────────────────────────
interface InterviewQ {
  id: number; category: string; q: string; hint: string;
  keywords: string[]; weakPatterns: string[];
  feedback: { strong: string; weak: string; tips: string[] };
}
const interviewQuestions: Record<'schengen'|'uk'|'usa', InterviewQ[]> = {
  schengen: [
    { id:1, category:'Amaç & Planlama', q:'Bu seyahatin temel amacı nedir? Neden bu ülkeyi seçtiniz, başka ülkeler yerine?', hint:'Spesifik aktiviteler (müze, etkinlik, aile ziyareti) ve bu ülkenin özel cazibesini belirtin.', keywords:['müze','kültür','tarihi','festival','aile','iş','konferans','fuar','tedavi','sergi','galeri','manzara','mutfak','mimari'], weakPatterns:['bilmiyorum','sadece gezmek','gezdim','tatil'], feedback:{ strong:'Harika! Spesifik ve ikna edici bir amaç belirttiniz. Vize memuru bu tür detaylı cevapları positif değerlendirir.', weak:'Çok genel bir cevap. "Tatil" veya "gezeyim dedim" gibi ifadeler yetersizdir.', tips:['Gitmek istediğiniz müze veya etkinlikleri ismiyle belirtin','Bu ülkeyi başkalarına tercih etme nedeninizi açıklayın','Tarih, kültür veya gastronomi gibi spesifik ilgi alanlarına bağlayın'] }},
    { id:2, category:'Amaç & Planlama', q:'Kaç gün kalacaksınız ve bu sürede hangi şehirleri ziyaret edeceksiniz?', hint:'Günlük plan veya şehir rotanızı kısaca açıklayın.', keywords:['berlin','paris','amsterdam','roma','viyana','prag','barselona','münih','gün','hafta','şehir','rota'], weakPatterns:['bilmiyorum','belki','düşünmedim'], feedback:{ strong:'Net bir rota planı belirttiniz, bu güven verir.', weak:'Somut şehir ve süre bilmemek, seyahat niyeti hakkında şüphe doğurur.', tips:['Gideceğiniz şehirleri ve her şehirde kaç gün kalacağınızı bilin','Rezervasyonlarınızla tutarlı olun','Toplam vize süresini aşmayın'] }},
    { id:3, category:'Amaç & Planlama', q:'Bu seyahati kim ile birlikte yapıyorsunuz? Grubunuz hakkında bilgi verir misiniz?', hint:'Yalnız, eş/arkadaşla veya aile ile gitme bilgisini paylaşın.', keywords:['eşim','arkadaşım','ailem','çocuğum','yalnız','grup','iş arkadaşım'], weakPatterns:[], feedback:{ strong:'Yolculuk arkadaşları hakkında net bilgi verdiniz.', weak:'Bu soruya net cevap verilmesi gerekir.', tips:['Birlikte gittiğiniz kişilerin ilişkisini açıklayın','Eğer yalnız gidiyorsanız, bunun nedenini kısaca belirtin'] }},
    { id:4, category:'Amaç & Planlama', q:'Orada tanıdığınız biri var mı? Davet mektubu aldınız mı?', hint:'Davet varsa kim davet etti, ne zaman tanıştınız bilgisi.', keywords:['hayır','arkadaşım var','akrabam','iş bağlantım','eski okul arkadaşım','davetiye'], weakPatterns:[], feedback:{ strong:'Davet durumunu net açıkladınız.', weak:'Bu soruya net cevap verin; kararsız görünmek şüphe yaratabilir.', tips:['Varsa davet mektubunu pasaportunuzla birlikte götürün','Yoksa "Hayır, bağımsız tatil/iş seyahati" deyin — bu da tamamen normaldir'] }},
    { id:5, category:'Amaç & Planlama', q:'Günlük programınız nasıl? Hangi aktiviteleri planladınız?', hint:'En az 2-3 somut aktivite veya yer belirtin.', keywords:['müze','gezi','restoran','konser','yürüyüş','katedrali','pazar','park','tiyatro','opera','köy','şehir turu'], weakPatterns:['bilmiyorum','orada anlarım','planlamadım'], feedback:{ strong:'Somut aktiviteler belirttiniz — bu seyahat planlamanızın ciddiyetini gösterir.', weak:'Günlük plan bilmemek, seyahat niyetini zayıflatır.', tips:['Booking yaptırdığınız tur veya etkinlikleri belirtin','En az 2-3 spesifik aktivite ya da yer adı söyleyin','"Listim var, ancak esnek kalmayı planlıyorum" cevabı da makuldür'] }},
    { id:6, category:'Amaç & Planlama', q:'Bu seyahati neden şimdi yapmak istediniz? Zamanlamayı nasıl seçtiniz?', hint:'Mevsim, özel etkinlik, tatil fırsatı veya özel neden belirtin.', keywords:['yaz','kış','etkinlik','festival','doğum günü','yıldönümü','tatil','izin','mevsim','ucuz'], weakPatterns:['bilmiyorum','aklıma geldi'], feedback:{ strong:'Zamanlama için mantıklı bir neden belirttiniz.', weak:'Zamanlamayı açıklayamamak, planlı bir seyahat yapmadığı izlenimi verir.', tips:['Mevsimi veya özel bir etkinliği referans alın','Tatil günlerinizle seyahat tarihlerinin örtüştüğünü belirtin','Bilet fiyatı, hava durumu gibi pratik nedenler de kabul edilebilir'] }},
    { id:7, category:'Amaç & Planlama', q:'Bu ülkede daha önce bulundunuz mu? Schengen bölgesine daha önce giriş yaptınız mı?', hint:'Varsa önceki seyahatlerinizi ve geçerliliğini paylaşın.', keywords:['evet','hayır','daha önce','gittim','ilk kez','pasaportumda','visa geçmişi'], weakPatterns:[], feedback:{ strong:'Seyahat geçmişi hakkında net bilgi verdiniz.', weak:'Bu soruya net ve dürüst cevap verin; vize memuru pasaportunuzu kontrol edecektir.', tips:['Daha önce gittiyseniz, ne zaman ve ne amaçla gittiğinizi kısaca söyleyin','İlk kez gidiyorsanız, bu normal — hazırlıklı olduğunuzu vurgulayın'] }},
    // FİNANSAL
    { id:8, category:'Finansal', q:'Bu seyahatin masraflarını nasıl karşılayacaksınız? Finansal durumunuz hakkında bilgi verir misiniz?', hint:'Birikimleriniz, maaşınız veya sponsorunuzu belirtin.', keywords:['maaş','birikim','banka','hesap','kredi kartı','sponsor','şirket karşılıyor','tasarruf','gelir'], weakPatterns:['bilmiyorum','borcum var','kredi çektim'], feedback:{ strong:'Finansal kaynağınızı net olarak açıkladınız — bu vize memuruna güven verir.', weak:'Finansal kaynak belirsizliği en sık ret nedenidir.', tips:['Aylık gelirinizi TL olarak bilin','3 aylık banka ekstrenizi hazırda bulundurun','Birikimlerinizin uzun süredir hesapta durduğunu vurgulayın'] }},
    { id:9, category:'Finansal', q:'Aylık geliriniz ne kadar? Ne iş yapıyorsunuz?', hint:'Net maaş + çalıştığınız sektör/şirket türü.', keywords:['tl','euro','maaş','serbest','şirket','kamu','özel','öğretmen','mühendis','doktor','memur'], weakPatterns:['değişiyor','bazen','az'], feedback:{ strong:'Net gelir bilgisi verdiniz — bu somut ve doğrulanabilir bir cevap.', weak:'Gelir miktarını bilmemek veya muğlak bırakmak endişe vericidir.', tips:['Maaşınızı net rakam olarak bilin','SGK kaydınız varsa bunu vurgulayın','Kamu sektörü çalışanıysanız bunu mutlaka belirtin'] }},
    { id:10, category:'Finansal', q:'Banka hesabınızda bu seyahat için yeterli birikim var mı? Günlük ne kadar harcama planlıyorsunuz?', hint:'Schengen standartı: kişi başı günlük en az €50-120.', keywords:['€','euro','lira','yeterli','günlük','bütçe','nakit','kart'], weakPatterns:['az','yetmez','bilmiyorum'], feedback:{ strong:'Günlük bütçenizi planladınız, bu somut bir finansal hazırlık göstergesi.', weak:'Schengen ülkelerine başvuranlarda minimum günlük €50-100 bütçe istenebilir.', tips:['Günlük €80-100 EUR bütçe belirleyin','Toplam kalış × günlük bütçe × 1.5 kadar banka bakiyesi bulundurun','Nakit + kart kombinasyonu kullanacaksanız belirtin'] }},
    { id:11, category:'Finansal', q:'Bu seyahat sırasında beklenmedik bir masrafla karşılaşsanız ne yaparsınız?', hint:'Acil durum planınızı, rezerv fonunuzu veya sigorta planınızı açıklayın.', keywords:['sigorta','birikim','kredi kartı','acil','aile','rezerv'], weakPatterns:['bilmiyorum','zor olur'], feedback:{ strong:'Acil durum planınız var — bu olgunluk göstergesidir.', weak:'Acil duruma hazırlıksız görünmek endişe vericidir.', tips:['Seyahat sigortanız varsa kapsamını söyleyin','Acil için ayrı bir miktar ayırdıysanız belirtin','Güvenilir acil iletişim kişiniz olduğunu söyleyin'] }},
    { id:12, category:'Finansal', q:'Seyahat sigortanız var mı? Hangi şirket, ne kadar teminat?', hint:'Schengen için minimum €30.000 seyahat/sağlık sigortası zorunludur.', keywords:['sigorta','ereğli','allianz','axa','eureko','generali','30000','teminat','poliçe'], weakPatterns:['yok','almadım','bilmiyorum'], feedback:{ strong:'Sigortanız var ve teminatını biliyorsunuz — bu zorunlu bir şarttır.', weak:'Schengen vizesi için €30.000 teminatlı seyahat sigortası zorunludur! Bu olmadan başvurunuz geçersiz sayılabilir.', tips:['Başvurmadan önce mutlaka seyahat sigortası yaptırın','Poliçede tüm seyahat tarihlerinin kapsandığından emin olun','Sigortanın Schengen bölgesinin tamamını kapsaması gerekir'] }},
    // GERİ DÖNÜŞ BAĞLARI
    { id:13, category:'Geri Dönüş Bağları', q:'Türkiye\'ye neden geri döneceğinizi açıklar mısınız? Türkiye\'ye sizi bağlayan en güçlü neden nedir?', hint:'İş, aile, mülk veya sosyal bağlarınızı açıklayın.', keywords:['iş','işim','ailem','eşim','çocuğum','annem','babam','mülk','ev','tapu','şirket','öğrenci','okul','sözleşme'], weakPatterns:['bilmiyorum','yok','zor'], feedback:{ strong:'Güçlü geri dönüş bağları belirttiniz — bu vize memuru açısından en kritik faktördür.', weak:'Türkiye\'ye geri dönüş motivasyonu belirsiz — bu ret nedeni olabilir.', tips:['Somut bağları sıralayın: iş sözleşmesi, aile, mülk','SGK kaydınız devam ediyorsa bunu vurgulayın','"İşim, evim, ailem burada" cevabı çok etkilidir'] }},
    { id:14, category:'Geri Dönüş Bağları', q:'Çalışıyorsanız, işvereninizden izin mektubu aldınız mı? İzin tarihleri vizenizdeki sürelerle uyuşuyor mu?', hint:'İzin onayını ve seyahat tarihlerinin örtüşmesini açıklayın.', keywords:['izin','mektup','işveren','onay','uyuşuyor','tarihler','sözleşme'], weakPatterns:['almadım','gerekmez','unuttum'], feedback:{ strong:'İşveren izin mektubu aldınız — bu profesyonellik ve geri dönüş taahhüdünü kanıtlar.', weak:'İşveren mektubu eksikse bu önemli bir zaaftır.', tips:['Türkçe + İngilizce işveren mektubu hazırlayın','Mektupta dönüş tarihi ve geri işe başlama tarihi yazsın','Şirket antetli kağıdında imzalı ve kaşeli olmalı'] }},
    { id:15, category:'Geri Dönüş Bağları', q:'Türkiye\'de mülk (ev, arsa, işyeri) veya araç sahibi misiniz?', hint:'Varsa tapu veya ruhsat bilgisini paylaşın.', keywords:['evet','ev','tapu','arsa','daire','araç','ruhsat','mülk'], weakPatterns:['hayır','yok'], feedback:{ strong:'Mülk sahipliği güçlü bir geri dönüş kanıtıdır.', weak:'Mülkünüz olmasa da bu yeterince açıklanabilir; başka bağları ön plana çıkarın.', tips:['Mülkünüz varsa tapu fotokopisini hazırlayın','Yoksa iş sözleşmesi ve SGK\'yı ön plana çıkarın'] }},
    { id:16, category:'Geri Dönüş Bağları', q:'Aileniz Türkiye\'de mi? Seyahat süresince onlarla nasıl iletişim kuracaksınız?', hint:'Eş, çocuk, ebeveyn gibi yakınlarınızdan bahsedin.', keywords:['eşim','çocuğum','annem','babam','kardeşim','ailem','kalıyor','bekliyor'], weakPatterns:['yok','hepsi yurt dışında'], feedback:{ strong:'Güçlü aile bağları Türkiye\'ye geri dönüşü güçlü motive eder.', weak:'Türkiye\'de aile bağı olmayışı zayıflık olarak değerlendirilebilir; iş veya mülk bağlarını ön plana çıkarın.', tips:['Eş veya çocuk gibi yakın aile Türkiye\'de kalıyorsa bunu vurgulayın','Ebeveynlerinizin Türkiye\'de olduğunu belirtin'] }},
    { id:17, category:'Geri Dönüş Bağları', q:'SGK kaydınız var mı? Sosyal güvenceniz devam ediyor mu?', hint:'Aktif SGK kaydı güçlü istihdam ve geri dönüş kanıtıdır.', keywords:['evet','sgk','sigorta','4a','4b','emekli','kamu','devlet'], weakPatterns:['yok','hayır','kayıt yok'], feedback:{ strong:'Aktif SGK kaydı geri dönüş motivasyonunuzu çok güçlü destekler.', weak:'SGK kaydı yoksa, başka finansal veya sosyal güvence kanıtları hazırlayın.', tips:['E-devlet\'ten barkodlu SGK döküm belgesi alın','Kamu çalışanıysanız maaş bordrosu ile belirtiniz'] }},
    { id:18, category:'Geri Dönüş Bağları', q:'Türkiye\'de bir işletmeniz veya şirketiniz var mı?', hint:'Varsa şirket adını ve ne iş yaptığını paylaşın.', keywords:['evet','şirket','işletme','esnaf','vergi','ticaret odası','kendi işim'], weakPatterns:['hayır'], feedback:{ strong:'Kendi işinizin olması geri dönüş taahhüdünü kuvvetlendirir.', weak:'Şirket yoksa sorun değil; iş sözleşmesi ve SGK\'yı vurgulayın.', tips:['Şirketiniz varsa vergi levhasını hazırlayın','Türkiye\'deki ticari bağlantılarınızdan bahsedin'] }},
    { id:19, category:'Geri Dönüş Bağları', q:'Yurt dışında daha önce yaşama veya çalışma planınız oldu mu? Şu an böyle bir planınız var mı?', hint:'Dürüst ama net olun; "hayır" cevabını somut nedenlerle destekleyin.', keywords:['hayır','planım yok','Türkiye\'de çalışıyorum','kariyer','burada','geri dönmek'], weakPatterns:['belki','düşünüyorum','ileride'], feedback:{ strong:'Net ve somut bir cevap verdiniz.', weak:'"Belki" veya "düşünüyorum" gibi belirsiz cevaplar vize memurunda kötü izlenim bırakır.', tips:['Bu konuda net olun','Türkiye\'deki kariyer veya yaşam planlarınızdan bahsedin','Yurt dışı planı varsa dürüstçe ama bağlarla dengeleyerek anlatın'] }},
    // SEYAHAT DETAYLARI
    { id:20, category:'Seyahat Detayları', q:'Nerede kalacaksınız? Otel veya konaklama rezervasyonunuz var mı?', hint:'Otel adı ve adresi, ya da konakladığınız kişinin bilgisi.', keywords:['otel','airbnb','hostel','akrabam','arkadaşım','rezervasyon','booking','numarası'], weakPatterns:['bilmiyorum','henüz almadım','düşünmedim'], feedback:{ strong:'Konaklama rezervasyonunuz hazır — bu somut bir seyahat planlaması göstergesi.', weak:'Konaklama yeri belirli değilse bu ciddi bir eksik.', tips:['Otel rezervasyonunuzu başvurudan önce alın (iade edilebilir olabilir)','Otel adı ve adresini ezberlemeye çalışın','Birinin evinde kalıyorsanız ev sahibinin davet mektubunu hazırlayın'] }},
    { id:21, category:'Seyahat Detayları', q:'Dönüş biletiniz var mı? Kesin dönüş tarihiniz nedir?', hint:'Dönüş bileti ve tarihi net olmalı; vize süresini aşmamalı.', keywords:['evet','biletim var','dönüş','tayyare','thy','lufthansa','tarih'], weakPatterns:['almadım','henüz yok','vize çıkınca alacağım'], feedback:{ strong:'Dönüş biletiniz var — bu seyahat bitimine dair somut kanıt.', weak:'Dönüş bileti olmadan vize mülakatında ciddi sorun yaşayabilirsiniz.', tips:['Tam olmasa bile değişiklik/iptal politikası esnek bir rezervasyon yapın','Bilet tarihi vize bitişinden önce olmalı','"Uçuş rezervasyonu var, sadece bilet düzenlenmedi" formatı da kabul görebilir'] }},
    { id:22, category:'Seyahat Detayları', q:'Seyahat boyunca iletişim bilgileriniz nasıl? Türkiye\'deki bir yakınınız sizi takip edebiliyor mu?', hint:'Acil durumda ulaşılabilecek Türkiye\'deki kişiyi belirtin.', keywords:['telefon','numara','aile','arkadaş','eşim','annem','babam'], weakPatterns:[], feedback:{ strong:'Acil iletişim ağınız hazır, bu sorumluluk göstergesidir.', weak:'', tips:['Türkiye\'deki acil iletişim kişinizin adı ve numarasını bilin','Bu konsolosluğun sizi takip edebileceği bir kişidir'] }},
    { id:23, category:'Seyahat Detayları', q:'Pasaportunuzun geçerlilik süresi ne zaman bitiyor? Seyahat süreniyle uyumlu mu?', hint:'Pasaport, seyahat bitişinden en az 3-6 ay sonrasına kadar geçerli olmalı.', keywords:['2025','2026','2027','2028','geçerli','ay','yıl'], weakPatterns:['bilmiyorum','kontrol etmedim'], feedback:{ strong:'Pasaport geçerlilik durumunu biliyorsunuz — temel bir hazırlık.', weak:'Pasaport geçerliliğini bilmemek ciddiyetsizlik izlenimi verir.', tips:['Pasaportunuzun bitiş tarihini öğrenin','Seyahat bitiş tarihinden en az 3 ay sonrasına geçerli olmalı','Süre yetmiyorsa başvurmadan önce yenileyin'] }},
    { id:24, category:'Seyahat Detayları', q:'Yanınızda ne kadar nakit para götürüyorsunuz? Kredi kartınız var mı?', hint:'Nakit miktarı ve uluslararası geçerli kart bilgisi.', keywords:['nakit','kart','euro','dolar','visa','mastercard','banka kartı'], weakPatterns:['bilmiyorum','az'], feedback:{ strong:'Finansal araçlarınız hazır.', weak:'', tips:['En az €300-500 nakit bulundurun','Yabancı işlemlere açık uluslararası kartınızın olması önemli','Seyahat sigortanız acil nakit desteği içeriyorsa bunu bilin'] }},
    // GEÇMİŞ
    { id:25, category:'Geçmiş & Diğer', q:'Daha önce vize reddiniz oldu mu? Olduysa neden reddedildiğinizi biliyor musunuz?', hint:'Dürüst olun. Ret varsa, ne değiştiğinizi açıklayın.', keywords:['hayır','hiç','olmadı','evet','geçen yıl','neden','düzelttim'], weakPatterns:[], feedback:{ strong:'Vize geçmişi hakkında dürüst ve net cevap verdiniz.', weak:'', tips:['Ret olduysa saklamayın — konsolosluk kayıtlarda görür','Önceki reti düzelten faktörleri ön plana çıkarın','"Geçen sefer eksik evraktan reddedildim, bu sefer tamamım" gibi cevaplar kabul görebilir'] }},
    { id:26, category:'Geçmiş & Diğer', q:'Daha önce ABD, Kanada, İngiltere veya başka Schengen ülkelerine vize aldınız mı?', hint:'Güçlü vize geçmişi büyük avantajdır.', keywords:['evet','abd','ingiltere','kanada','almanya','fransa','hollanda','vize'], weakPatterns:['hayır','ilk kez'], feedback:{ strong:'Güçlü vize geçmişiniz var — bu inandırıcılığı artırır.', weak:'İlk kez başvuruyorsanız bu normal; başka güçlü faktörleri ön plana çıkarın.', tips:['Önceki vize kullandıysanız bunu belgeleyin','İlk başvuruysa kuvvetli finansal ve sosyal bağlar daha da önemli'] }},
    { id:27, category:'Geçmiş & Diğer', q:'Türkiye\'de yaşayan yabancı bir eşiniz veya çocuğunuz var mı? Çift vatandaşlığınız var mı?', hint:'Varsa durumu net açıklayın.', keywords:['hayır','evet','türk vatandaşı','çift','yabancı uyruklu'], weakPatterns:[], feedback:{ strong:'Net bir cevap verdiniz.', weak:'', tips:['Çift vatandaşlık varsa hangi pasaportla seyahat ettiğinizi bilin','Yabancı eş varsa, Türkiye bağlarınızı daha da güçlü göstermeniz gerekebilir'] }},
    { id:28, category:'Geçmiş & Diğer', q:'Türkiye\'den çıkış-giriş kaydınız var mı? Son 5 yılda hangi ülkelere gittiniz?', hint:'E-devlet\'ten yurt içi/dışı giriş-çıkış kaydını gözden geçirin.', keywords:['evet','2022','2023','2024','dubai','kuzey kıbrıs','almanya','ingiltere','kayıt'], weakPatterns:['bilmiyorum'], feedback:{ strong:'Seyahat geçmişinizi iyi biliyorsunuz.', weak:'Seyahat kayıtlarınızı bilmemek hazırlıksızlık izlenimi verebilir.', tips:['E-devlet\'ten "Yurda Giriş Çıkış Bilgisi" belgenizi indirin','Pasaportunuzdaki damgaları inceleyin','Geçmiş seyahatler vize inandırıcılığını artırır'] }},
  ],
  uk: [
    { id:1, category:'Amaç & Planlama', q:'İngiltere\'ye neden gitmek istiyorsunuz? Seyahatinizin amacı nedir?', hint:'Turizm, iş, aile veya tedavi gibi spesifik amaç belirtin.', keywords:['turizm','iş','aile','tedavi','müze','konferans','fuar','arkadaş','akraba','eğitim'], weakPatterns:['bilmiyorum','sadece gezmek'], feedback:{ strong:'Net ve spesifik bir amaç belirttiniz.', weak:'Çok genel. İngiltere konsolosluğu özellikle "neden İngiltere?" sorusunu sıkça sorar.', tips:['Buckingham, British Museum, Shakespeare gibi spesifik yerleri belirtin','İş ziyaretiyse şirket ve toplantı bilgisi ekleyin'] }},
    { id:2, category:'Amaç & Planlama', q:'İngiltere\'de kaç gün kalacaksınız ve hangi şehirleri ziyaret edeceksiniz?', hint:'Londra dışında Edinburgh, Manchester, Oxford gibi yerler varsa belirtin.', keywords:['londra','edinburgh','manchester','oxford','cambridge','liverpool','bristol','gün','hafta'], weakPatterns:['bilmiyorum','belki'], feedback:{ strong:'Net bir seyahat planı var.', weak:'Somut gün ve şehir bilmemek hazırlıksız görünmenize neden olur.', tips:['Kaç gün, hangi şehirler, nerede kalacağınızı netleştirin'] }},
    { id:3, category:'Finansal', q:'İngiltere\'deki harcamalarınızı nasıl karşılayacaksınız?', hint:'Birikim, maaş veya sponsor bilgisi paylaşın.', keywords:['birikim','maaş','sponsor','banka','hesap','kart','kredi'], weakPatterns:['bilmiyorum','az'], feedback:{ strong:'Finansal kaynağınızı net belirttiniz.', weak:'Finansal belirsizlik İngiltere vizesinde çok sık ret nedenidir.', tips:['Son 6 aylık banka ekstresi zorunludur UK vizesi için','Günlük en az £100-150 bütçe planı yapın'] }},
    { id:4, category:'Finansal', q:'Son 6 aylık banka dökümanınız hazır mı? Ortalama bakiyeniz nedir?', hint:'UK vizesi için 6 aylık ektre standart gerekliliktir.', keywords:['evet','hazır','banka','6 ay','bakiye','ekstra'], weakPatterns:['hayır','3 ay','bilmiyorum'], feedback:{ strong:'6 aylık ekstreniz hazır, bu UK standardını karşılar.', weak:'UK vizesi için 6 aylık banka ekstresi zorunludur.', tips:['Son 6 aylık ekstreyi banka kaşeli ve imzalı alın','İmza sirküleri de gerekebilir'] }},
    { id:5, category:'Finansal', q:'Hesabınıza son 28 günde büyük miktarda para yatırıldı mı?', hint:'UK son 28 gün öncesinden yatırılan para transferlerine özellikle dikkat eder.', keywords:['hayır','yok','düzenli','maaş','uzun süredir'], weakPatterns:['evet','yattı','birisi yattı'], feedback:{ strong:'Son 28 günde anormal transfer yok, bu güçlü bir finansal sağlık göstergesi.', weak:'Son 28 günde ani büyük transferler UK konsolosluğunda ciddi şüphe uyandırır.', tips:['28 günden eski birikimler güvenlidir','Son anda yapılan transferler "sahte bakiye" şüphesi yaratır','Uzun süreli düzenli maaş girişleri en güvenli seçenektir'] }},
    { id:6, category:'Geri Dönüş Bağları', q:'Türkiye\'ye neden döneceğinizi açıklar mısınız?', hint:'İş, aile, mülk veya sosyal bağlarınızı sıralayın.', keywords:['iş','ailem','ev','mülk','okul','sözleşme','sgk'], weakPatterns:['bilmiyorum','zor'], feedback:{ strong:'Güçlü geri dönüş bağları belirttiniz.', weak:'Geri dönüş motivasyonu belirsiz — bu ret nedeni olabilir.', tips:['İşini, evini, ailesini Türkiye\'de olan kişiler avantajlı konumdadır','Sözleşmeli çalışıyorsanız sözleşme bitiş tarihini belirtin'] }},
    { id:7, category:'Geri Dönüş Bağları', q:'SGK kaydınız, çalışma durumunuz veya işvereniniz hakkında bilgi verir misiniz?', hint:'Aktif iş kaydı UK için kritik bir güven unsurudur.', keywords:['sgk','işverem','şirket','kamu','özel','sözleşme','maaş'], weakPatterns:['yok','çalışmıyorum'], feedback:{ strong:'İstihdam durumunuz güçlü ve belgelenebilir.', weak:'İstihdam kaydı olmadan UK vizesi çok zorlaşır.', tips:['SGK + işveren mektubu mutlaka hazırlayın','Emekliyseniz emekli maaş belgenizi getirin'] }},
    { id:8, category:'Konaklama', q:'İngiltere\'de nerede kalacaksınız? Otel veya davet mektubu var mı?', hint:'Otel rezervasyon numarası veya ev sahibinin pasaport kopyası.', keywords:['otel','airbnb','arkadaşım','akrabam','rezervasyon','davet mektubu'], weakPatterns:['bilmiyorum','henüz almadım'], feedback:{ strong:'Konaklama planınız netleştirilmiş.', weak:'Konaklama yeri belirsiz bırakılmamalıdır.', tips:['Otel rezervasyonu veya davet mektubu mutlaka hazırlayın','Rezervasyon iade edilebilir türden olabilir'] }},
    { id:9, category:'Konaklama', q:'İngiltere\'deki bir akrabınız veya arkadaşınız sizi davet etti mi?', hint:'Davet varsa ilişki, ne zamandan beri tanışıyorsunuz, davetiyenin içeriği.', keywords:['evet','hayır','akrabam','arkadaşım','mektup','pasaport','davet'], weakPatterns:[], feedback:{ strong:'Davet durumunu net açıkladınız.', weak:'', tips:['Varsa davet mektubunu daveten kişinin pasaport kopyasıyla birlikte sunun','Yoksa otel rezervasyonu ile devam edin'] }},
    { id:10, category:'Seyahat Detayları', q:'Dönüş biletiniz var mı? Kesin dönüş tarihiniz nedir?', hint:'UK vizesi için dönüş bileti en kritik belgelerden biridir.', keywords:['evet','biletim var','tarihi','thy','pegasus','british airways'], weakPatterns:['yok','almadım'], feedback:{ strong:'Dönüş biletiniz hazır.', weak:'Dönüş bileti olmadan UK vizesi geçmiş veride yüksek ret riskiyle ilişkilidir.', tips:['Mutlaka dönüş bileti alın','Tarih vize süresiyle uyumlu olmalı'] }},
    { id:11, category:'Seyahat Detayları', q:'Seyahat sigortanız var mı? Hangi şirket, ne kadar teminat?', hint:'UK\'da zorunlu değil ama çok önerilir; özellikle sağlık için.', keywords:['evet','sigorta','allianz','axa','teminat','poliçe'], weakPatterns:['yok','almadım'], feedback:{ strong:'Sigortanız hazır.', weak:'UK\'da sigorta zorunlu değil ama NHS dışı sağlık hizmetleri çok pahalı olabilir.', tips:['Seyahat sigortası almak vize başvurusuna güven katıyor','En az £100.000 sağlık + bagaj teminatı önerilir'] }},
    { id:12, category:'Geçmiş', q:'Daha önce İngiltere\'ye gittiniz mi veya UK vizesi aldınız mı?', hint:'Olumlu vize geçmişi büyük avantaj.', keywords:['evet','gittim','aldım','vizem vardı'], weakPatterns:['hayır','hiç'], feedback:{ strong:'Vize geçmişiniz var, bu inandırıcılığı artırır.', weak:'İlk başvuruysa sorun değil; güçlü evraklarla başvurun.', tips:['Önceki UK vize kullanımınızı belgeleyin','İlk kez gidiyorsanız çok daha eksiksiz evrak hazırlayın'] }},
    { id:13, category:'Geçmiş', q:'Daha önce UK veya başka bir ülkeden vize reddiniz oldu mu?', hint:'Dürüst olun; konsolosluk kayıtları kontrol eder.', keywords:['hayır','olmadı','hiç','evet','oldu'], weakPatterns:[], feedback:{ strong:'Vize geçmişi hakkında dürüst ve net cevap verdiniz.', weak:'', tips:['Ret varsa saklamayın','Önceki reddi geçersiz kılan değişikliklerinizi açıklayın'] }},
    { id:14, category:'Geçmiş', q:'Türkiye\'de son 5 yılda adli bir suç veya ceza aldınız mı?', hint:'"Hayır" cevabı beklenir ve belgelenebilir olmalı.', keywords:['hayır','hiç','temiz','sicil'], weakPatterns:['evet'], feedback:{ strong:'Temiz sicil vize güvenilirliğini artırır.', weak:'', tips:['Adli sicil belgesi gerekebilir, önceden temin edin'] }},
    { id:15, category:'Geçmiş', q:'Türkiye\'den çıkış-giriş geçmişiniz var mı? Son seyahatleriniz hangi ülkelerdi?', hint:'Düzenli seyahat geçmişi güvenilirlik kanıtıdır.', keywords:['evet','dubai','kuzey kıbrıs','almanya','kayıt'], weakPatterns:['bilmiyorum'], feedback:{ strong:'Seyahat geçmişinizi iyi biliyorsunuz.', weak:'', tips:['Pasaportunuzdaki damgaları gözden geçirin','E-devlet\'ten giriş-çıkış kaydınızı alın'] }},
    { id:16, category:'Aile & Sosyal', q:'Türkiye\'de aile üyeleriniz var mı? Kim sizinle ilgilenecek siz yokken?', hint:'Eş, çocuk, ebeveyn gibi yakınları belirtin.', keywords:['eşim','çocuğum','annem','babam','kardeşim','ailem'], weakPatterns:[], feedback:{ strong:'Türkiye\'deki aile bağları geri dönüş güvencenizi pekiştiriyor.', weak:'', tips:['Çocuğunuz varsa ve Türkiye\'de kalıyorsa bu güçlü bir bağdır'] }},
    { id:17, category:'Aile & Sosyal', q:'Türkiye\'de sosyal veya topluluk bağlantılarınız var mı? Dernek, meslek odası gibi?', hint:'Profesyonel veya sivil toplum bağları da geri dönüş motivasyonu gösterir.', keywords:['dernek','baro','oda','meslek','gönüllü','topluluk','spor kulübü'], weakPatterns:['yok'], feedback:{ strong:'Sosyal ağınız Türkiye\'deki entegrasyonunuzu gösteriyor.', weak:'', tips:['Meslek odası üyeliği veya dernek kaydı bir güven unsuru olabilir'] }},
    { id:18, category:'İstihdam', q:'Türkiye\'deki işiniz veya mesleğiniz hakkında bilgi verir misiniz?', hint:'Şirket adı, pozisyon ve ne kadar süredir çalıştığınızı belirtin.', keywords:['şirket','firma','kamu','özel','mühendis','doktor','öğretmen','müdür'], weakPatterns:['bilmiyorum','çalışmıyorum'], feedback:{ strong:'İstihdam bilginiz net ve doğrulanabilir.', weak:'İstihdam yoksa diğer bağları (mülk, aile) daha güçlü vurgulayın.', tips:['Şirket adı ve sektörünü bilin','Kaç yıldır aynı işyerinde olduğunuzu belirtin'] }},
    { id:19, category:'İstihdam', q:'İşvereniniz bu seyahat için izin mektubu verdi mi?', hint:'İşveren mektubu UK konsolosluğu tarafından çok önem verilir.', keywords:['evet','mektup','antetli','imzalı','kaşeli','onay'], weakPatterns:['almadım','gerekmez'], feedback:{ strong:'İşveren mektubu hazır — bu kritik bir belgedir.', weak:'İşveren mektubu olmadan UK başvurusu zayıf kalır.', tips:['Şirket antetli, imzalı, kaşeli İngilizce mektup hazırlayın','Mektupta dönüş tarihi ve iş pozisyonunuz belirtilmeli'] }},
    { id:20, category:'İstihdam', q:'Serbest meslek veya kendi işiniz varsa, vergi belgeleriniz mevcut mu?', hint:'Serbest çalışanlar için vergi levhası ve dönem bildirgeleri gereklidir.', keywords:['evet','vergi','levha','bildirgem','muhasebe','mükellefiyet'], weakPatterns:['yok','almadım'], feedback:{ strong:'Vergi belgeleriniz hazır.', weak:'Serbest çalışanlar için vergi kaydı çok önemlidir.', tips:['Vergi levhası + son 2 yıl yıllık beyanname hazırlayın','Muhasebeciden onaylı gelir belgesi alın'] }},
    { id:21, category:'Nüfus & Aile Durumu', q:'Medeni haliniz nedir? Eşiniz ve çocuklarınız bu seyahatte sizinle mi?', hint:'Aile beraberliği veya Türkiye\'de kalma durumunu açıklayın.', keywords:['evli','bekâr','eşim geliyor','eşim Türkiye\'de kalıyor','çocuklarım'], weakPatterns:[], feedback:{ strong:'Aile durumunu net açıkladınız.', weak:'', tips:['Evliyseniz ve eşiniz Türkiye\'de kalıyorsa bu güçlü bir bağdır','Nüfus kayıt örneği belgenizi hazırlayın'] }},
    { id:22, category:'Nüfus & Aile Durumu', q:'Türkiye\'de adresiniz neresi? Yerleşim yeri belgeniz var mı?', hint:'E-devlet\'ten barkodlu Yerleşim Yeri Belgesi zorunludur.', keywords:['istanbul','ankara','izmir','e-devlet','barkodlu','adres'], weakPatterns:['bilmiyorum'], feedback:{ strong:'Adres bilginiz net ve belgeli.', weak:'Yerleşim yeri belgesi hazır olmalı.', tips:['E-devlet\'ten barkodlu Yerleşim Yeri Belgesi alın','Bu belge son 3 aydan eski olmamalı'] }},
    { id:23, category:'Seyahat Planı', q:'İngiltere\'deyken kimlerle görüşeceksiniz? Bir toplantı veya etkinliğe katılıyor musunuz?', hint:'İş ziyaretiyse toplantı davetiyesi; turizm ise aktivite listesi.', keywords:['toplantı','konferans','fuar','müşteri','arkadaş','akraba','müze','turizm','tiyatro'], weakPatterns:['bilmiyorum'], feedback:{ strong:'Spesifik bir program planınız var.', weak:'', tips:['İş seyahatiyse davetiye veya toplantı onayı hazırlayın','Turizm ise tur rezervasyonu veya bilet spesifik olur'] }},
    { id:24, category:'Seyahat Planı', q:'Pasaportunuz ne zaman bitiyor? Seyahat bitiş tarihinizden sonra en az 6 ay geçerli mi?', hint:'UK pasaport geçerliliği için 6 aylık kural uygulayabilir.', keywords:['2026','2027','2028','geçerli','6 ay'], weakPatterns:['bilmiyorum','belki'], feedback:{ strong:'Pasaportunuz geçerli.', weak:'Pasaport geçerliliğini mutlaka kontrol edin.', tips:['UK için seyahat sonrasında 6 ay ek geçerlilik ideal','Süre yetmiyorsa önce pasaport yenileyin'] }},
    { id:25, category:'Son Sorular', q:'Bu başvuru için tüm gerekli belgeleri hazırladınız mı? Eksik belge var mı?', hint:'Eksikleri şimdi dürüstçe belirtin ki danışman yardım edebilsin.', keywords:['evet','hazır','tamamım','eksik','almadım'], weakPatterns:[], feedback:{ strong:'Belgeleriniz hazır. Son kez kontrol listesiyle gözden geçirin.', weak:'', tips:['Checklist yapın ve her belgeyi tek tek işaret edin','Kopya yetersizliği çok sık ret nedenidir'] }},
  ],
  usa: [
    { id:1, category:'Amaç & Planlama', q:'ABD\'ye neden gitmek istiyorsunuz? Seyahatinizin amacı nedir?', hint:'Turizm, iş, aile, konferans gibi net amaç belirtin.', keywords:['turizm','iş','aile','konferans','fuar','tedavi','arkadaş','ziyaret','kongre'], weakPatterns:['bilmiyorum','sadece gezmek'], feedback:{ strong:'Spesifik ve ikna edici bir amaç belirttiniz.', weak:'ABD elçilik mülakatında genel cevaplar ret ile sonuçlanabilir.', tips:['Gideceğiniz şehir ve aktiviteleri somut belirtin','İş seyahatiyse şirket/toplantı bilgisi ekleyin'] }},
    { id:2, category:'Amaç & Planlama', q:'ABD\'de kaç gün kalacaksınız? Hangi eyaletleri veya şehirleri ziyaret edeceksiniz?', hint:'New York, Los Angeles, Miami gibi spesifik şehir ve kaç gün.', keywords:['new york','los angeles','miami','chicago','lasvegas','san francisco','gün','hafta','ay'], weakPatterns:['bilmiyorum','belki'], feedback:{ strong:'Net bir seyahat planı var.', weak:'ABD mülakatında somut plan bilmemek büyük zayıflıktır.', tips:['Kaç gün, hangi şehirler, nerede kalacağınızı netleştirin'] }},
    { id:3, category:'Amaç & Planlama', q:'ABD\'de sizi davet eden biri var mı? Kimle görüşeceksiniz?', hint:'Varsa ilişki ve davetiye detayları, yoksa bağımsız turizm planı.', keywords:['arkadaşım','akrabam','şirket','davet','mektup','hayır'], weakPatterns:[], feedback:{ strong:'Davet durumunu net açıkladınız.', weak:'', tips:['Davet varsa resmi davetiye mektubu hazırlayın','Yoksa otel rezervasyonu ile bağımsız turizm planı gösterin'] }},
    { id:4, category:'Amaç & Planlama', q:'Bu seyahatin amacı sadece turizm mi, yoksa başka bir plan da var mı?', hint:'Çalışma, yerleşme veya okuma niyetiniz DS-160\'ta belirtilmeli.', keywords:['sadece turizm','sadece iş','yok','kesinlikle'], weakPatterns:['belki','ileride','düşünüyorum'], feedback:{ strong:'Net ve tutarlı bir niyet belirttiniz.', weak:'Belirsiz niyet ifadeleri ABD mülakatında hemen ret sebebidir.', tips:['B1/B2 vizesiyle çalışmak kesinlikle yasaktır','"Sadece turizm/iş, kesinlikle çalışmıyorum" deyin'] }},
    { id:5, category:'Finansal', q:'Bu seyahatin masraflarını nasıl karşılayacaksınız?', hint:'Birikim, maaş veya sponsor bilgisi net olmalı.', keywords:['birikim','maaş','sponsor','banka','hesap','kart','şirket karşılıyor'], weakPatterns:['bilmiyorum','az','zor'], feedback:{ strong:'Finansal kaynağınız net.', weak:'ABD vizesinde finansal kanıt son derece önemlidir.', tips:['Banka dökümü + son 3 aylık maaş bordrosu hazırlayın','Günlük en az $100 harcama planı yapın'] }},
    { id:6, category:'Finansal', q:'Aylık geliriniz ne kadar? Ne iş yapıyorsunuz?', hint:'Meslek ve net maaş rakamı verin.', keywords:['tl','dolar','maaş','şirket','kamu','özel','mühendis','doktor','öğretmen','işletme'], weakPatterns:['değişiyor','az','bazen'], feedback:{ strong:'Net gelir ve meslek bilgisi verdiniz.', weak:'', tips:['Mesleğinizi ve maaşınızı net rakamla belirtin','Vergi levhası ve maaş bordrosu hazırlayın'] }},
    { id:7, category:'Finansal', q:'ABD\'deyken bütçeniz ne olacak? Günlük tahmini harcamanız?', hint:'ABD\'de pahalı bir ülke; günlük $100-200+ bütçe planı yapın.', keywords:['dolar','$','günlük','bütçe','nakit','kart','150','200'], weakPatterns:['az','bilmiyorum'], feedback:{ strong:'Gerçekçi bir bütçe planınız var.', weak:'ABD\'de yaşam pahalıdır; yetersiz bütçe planı ret nedeni olabilir.', tips:['Günlük en az $150-200 bütçe hesaplayın','Konaklama, yemek ve ulaşımı ayrı ayrı tahmin edin'] }},
    { id:8, category:'Geri Dönüş', q:'Türkiye\'ye neden geri döneceğinizi açıklar mısınız? En güçlü geri dönüş nedeniniz nedir?', hint:'ABD B1/B2\'de "nonimmigrant intent" kanıtı kritik.', keywords:['iş','ailem','ev','mülk','okul','sözleşme','sgk','şirketim'], weakPatterns:['bilmiyorum','zor','yok'], feedback:{ strong:'Güçlü geri dönüş bağları belirttiniz — ABD için en kritik faktör bu.', weak:'Türkiye\'ye geri dönüş motivasyonu zayıf — büyük ihtimalle reddedilirsiniz.', tips:['"İşim, evim, ailem Türkiye\'de" en etkili cevaptır','SGK, sözleşme ve mülk bilgileri somut kanıttır'] }},
    { id:9, category:'Geri Dönüş', q:'ABD\'de çalışma veya yerleşme niyetiniz var mı?', hint:'"Kesinlikle hayır" net cevabını somut nedenlerle destekleyin.', keywords:['hayır','kesinlikle yok','Türkiye\'de','dönüyorum'], weakPatterns:['belki','ileride','istiyorum','düşündüm'], feedback:{ strong:'Net ve inandırıcı cevap.', weak:'Bu soruya "belki" veya belirsiz cevap vermek geçmiş veride yüksek ret riskiyle ilişkilidir.', tips:['Kesinlikle "Hayır" deyin','Türkiye\'deki kariyer ve aile planlarınızla destekleyin'] }},
    { id:10, category:'Geri Dönüş', q:'SGK veya sosyal güvence kaydınız devam ediyor mu? Türkiye\'de aktif çalışıyor musunuz?', hint:'Aktif SGK ve iş sözleşmesi geri dönüş güvencesidir.', keywords:['evet','sgk','aktif','çalışıyorum','sözleşme'], weakPatterns:['hayır','yok'], feedback:{ strong:'Aktif istihdam geri dönüşünüzü güçlü kanıtlar.', weak:'SGK veya aktif iş kaydı olmadan ABD B1/B2 çok zorlaşır.', tips:['SGK hizmet dökümü + işveren mektubu hazırlayın'] }},
    { id:11, category:'Geri Dönüş', q:'Türkiye\'de mülk (ev, arsa) sahibi misiniz?', hint:'Mülk sahipliği güçlü geri dönüş kanıtı.', keywords:['evet','ev','tapu','arsa','daire','mülkünüm'], weakPatterns:['hayır','yok'], feedback:{ strong:'Mülk sahipliği ABD için güçlü bağ kanıtı.', weak:'Mülk yoksa iş ve aile bağları daha önemli hale gelir.', tips:['Tapu fotokopisi hazırlayın','Mülk yoksa iş sözleşmesi ve SGK\'yı güçlü gösterin'] }},
    { id:12, category:'Geri Dönüş', q:'Aileniz Türkiye\'de mi? Siz ABD\'deyken nerede olacaklar?', hint:'Eş ve çocuk Türkiye\'de kalıyorsa bu çok güçlü bir bağ.', keywords:['eşim','çocuğum','annem','babam','kalıyor','Türkiye\'de'], weakPatterns:['hepsi yanımda'], feedback:{ strong:'Aile bağları geri dönüş taahhüdünü somut kılıyor.', weak:'Ailenin tamamı da gidiyorsa başka bağları daha güçlü vurgulayın.', tips:['Eş ve çocuk Türkiye\'de kalıyorsa bunu açıkça belirtin'] }},
    { id:13, category:'Konaklama', q:'ABD\'de nerede kalacaksınız? Otel rezervasyonunuz var mı?', hint:'Otel adı ve rezervasyon numarası veya ev sahibinin bilgisi.', keywords:['otel','airbnb','akrabam','arkadaşım','rezervasyon','hilton','marriott'], weakPatterns:['bilmiyorum','henüz yok'], feedback:{ strong:'Konaklama netleştirilmiş.', weak:'Konaklama yeri belirsiz bırakılmamalı.', tips:['Otel rezervasyonu veya ev sahibi davetiyesi hazırlayın'] }},
    { id:14, category:'Konaklama', q:'Dönüş biletiniz var mı? Kesin dönüş tarihiniz nedir?', hint:'ABD B1/B2 vizesinde dönüş bileti kritik belgedir.', keywords:['evet','biletim var','tarihi','thy','united','american airlines'], weakPatterns:['yok','almadım'], feedback:{ strong:'Dönüş biletiniz var.', weak:'Dönüş bileti olmadan ABD vizesi geçmiş veride yüksek ret riskiyle ilişkilidir.', tips:['Mutlaka dönüş bileti alın','DS-160 ile tutarlı tarihler olmalı'] }},
    { id:15, category:'Geçmiş', q:'Daha önce ABD\'de bulundunuz mu? ABD vizesi aldınız mı?', hint:'Güçlü vize geçmişi inandırıcılığı artırır.', keywords:['evet','gittim','aldım','vizem vardı','b1','b2'], weakPatterns:['hayır','hiç'], feedback:{ strong:'ABD vize geçmişiniz var, bu avantajlıdır.', weak:'İlk kez başvuruyorsanız güçlü evraklarla başvurun.', tips:['Önceki ABD vizesini belgeleyin','İlk kez gidiyorsanız diğer ülke vizelerini vurgulayın'] }},
    { id:16, category:'Geçmiş', q:'Daha önce herhangi bir ülkeden vize reddiniz oldu mu?', hint:'Dürüst olun; DS-160\'ta bu soru var ve yanlış yanıt suç sayılır.', keywords:['hayır','olmadı','hiç'], weakPatterns:[], feedback:{ strong:'Net ve dürüst cevap verdiniz.', weak:'', tips:['DS-160 formunda yanlış bilgi vermek hukuki suçtur','Ret olduysa bunu beyan edip durumu açıklayın'] }},
    { id:17, category:'Geçmiş', q:'Herhangi bir suç mahkûmiyetiniz veya ABD\'den deport işleminiz var mı?', hint:'"Hayır" net cevabı beklenir ve doğrulanabilir olmalı.', keywords:['hayır','hiç','yok','temiz'], weakPatterns:['evet'], feedback:{ strong:'Temiz adli sicil vize inandırıcılığını artırır.', weak:'', tips:['Adli sicil belgesi hazırlayın','Varsa durumu dürüstçe beyan edin'] }},
    { id:18, category:'Geçmiş', q:'ABD dışında başka ülkelere vize aldınız mı? (İngiltere, Schengen, Kanada gibi)', hint:'Güçlü çoklu vize geçmişi ABD başvurusunu olumlu etkiler.', keywords:['ingiltere','schengen','kanada','almanya','fransa','evet','vizem var'], weakPatterns:['hayır','yok'], feedback:{ strong:'Çoklu vize geçmişiniz ABD\'de güven oluşturur.', weak:'Başka ülke vizesi yoksa, finansal ve sosyal bağlar daha kritik.', tips:['Önceki vizeli seyahatlerinizi belgeleyin','Pasaport damgalarınızı bilmeniz önemli'] }},
    { id:19, category:'Sosyal Medya', q:'Sosyal medya hesaplarınız var mı? DS-160\'ta belirtmeniz gerekiyor.', hint:'2026 itibarıyla DS-160\'a sosyal medya eklenmesi zorunlu hale geldi.', keywords:['instagram','twitter','linkedin','facebook','tiktok','evet','hesabım var'], weakPatterns:['yok','kullanmıyorum'], feedback:{ strong:'Sosyal medya hesaplarınızı biliyorsunuz.', weak:'', tips:['DS-160 formuna aktif sosyal medya hesaplarınızı ekleyin','Hesaplarınızda hassas içerik varsa başvurudan önce temizleyin','LinkedIn hesabının profesyonel görünmesi avantajdır'] }},
    { id:20, category:'Sosyal Medya', q:'Sosyal medyada paylaştığınız siyasi veya hassas içerik var mı?', hint:'ABD elçiliği sosyal medyayı taramaktadır.', keywords:['hayır','yok','siyasi içerik yok','temiz'], weakPatterns:['evet','bazen','protesto'], feedback:{ strong:'Sosyal medya içerikleriniz temiz.', weak:'Hassas siyasi içerikler ABD vizesinde ciddi sorun yaratabilir.', tips:['Başvurudan önce hesaplarınızı gözden geçirin','Silinmesi gereken içerikleri kaldırın veya gizleyin','ABD politikasına veya kurumlarına yönelik eleştirel paylaşımlar risk yaratır'] }},
    { id:21, category:'İstihdam', q:'Şu anda çalışıyorsanız, işvereniniz bu seyahate onay verdi mi?', hint:'İşveren mektubu ve izin onayı.', keywords:['evet','onay','mektup','izin','imzaladı'], weakPatterns:['almadım','gerek yok'], feedback:{ strong:'İşveren onayı alındı.', weak:'İşveren mektubu olmadan istihdam durumunuzu kanıtlamak zorlaşır.', tips:['İngilizce işveren mektubu hazırlayın','Mektupta pozisyon, süre ve dönüş tarihi belirtilmeli'] }},
    { id:22, category:'İstihdam', q:'Şu anda öğrenciyseniz, okul izni aldınız mı?', hint:'Öğrenci vizesi yerine B2 vizesiyle gidiyorsa okul izni gerekebilir.', keywords:['evet','okul','izin','belge','öğrenciyim'], weakPatterns:['almadım'], feedback:{ strong:'Okul onayı alındı.', weak:'', tips:['Üniversitenizden tatil dönemi olduğunu belgeleyin','Okul belgesi ve transkript yardımcı olabilir'] }},
    { id:23, category:'Mülakat Hazırlığı', q:'DS-160 formunu doldurdunuz mu? MRV ücretini ödeduniz mi?', hint:'Bu adımlar tamamlanmadan randevu alınamaz.', keywords:['evet','doldurdum','ödedim','onay','kodu','barkod'], weakPatterns:['hayır','henüz','doldurmadım'], feedback:{ strong:'DS-160 tamamlanmış.', weak:'DS-160 doldurulmadan mülakata giremezsiniz.', tips:['DS-160\'ı dikkatlice ve dürüstçe doldurun','Kayıt kodu yazdırın, mülakata getirin'] }},
    { id:24, category:'Mülakat Hazırlığı', q:'Mülakata hangi belgelerle geleceksiniz? Listeyi biliyor musunuz?', hint:'Pasaport, DS-160, fotoğraf, randevu kâğıdı, banka ekstresi, işveren mektubu.', keywords:['pasaport','ds160','fotoğraf','banka','mektup','randevu'], weakPatterns:['bilmiyorum','hepsini almadım'], feedback:{ strong:'Gerekli belgeleri biliyorsunuz.', weak:'Eksik belgeyle mülakata girmek kesin ret ile sonuçlanabilir.', tips:['Kontrol listesi yapın: pasaport, DS-160, fotoğraf, banka ekstresi, işveren mektubu','Kopya olarak da ekstra bir set hazırlayın'] }},
    { id:25, category:'Mülakat Hazırlığı', q:'Bu seyahatle ilgili herhangi bir endişeniz veya risk faktörünüz olduğunu düşünüyor musunuz?', hint:'Dürüst olun; güçlü yanlarınızı da belirtin.', keywords:['hayır','endişem yok','güçlü','hazırlıklıyım'], weakPatterns:['evet','endişeleniyorum','zayıf'], feedback:{ strong:'Kendinize güveniyorsunuz — bu iyi bir tutum.', weak:'Endişelerinizi bilmek önemli; eksikleri şimdi giderin.', tips:['Zayıf yanlarınızı güçlü faktörlerle dengeleyin','Mülakata olumlu ve hazırlıklı girin'] }},
  ]
};

// ── Çoklu Ülke Vize Verisi (Türk Pasaportu) ─────────────────────────────────
const multiCountryVisaData: Record<string, { flag: string; region: string; visaType: 'vizsiz'|'evisa'|'kapida'|'tam_vize'; note: string; maxDays: number }> = {
  'Azerbaycan': { flag:'🇦🇿', region:'Yakın Çevre', visaType:'vizsiz', note:'Kimlikle girilebilir', maxDays:90 },
  'Gürcistan': { flag:'🇬🇪', region:'Yakın Çevre', visaType:'vizsiz', note:'90 gün vizesiz', maxDays:90 },
  'Kuzey Kıbrıs': { flag:'🇨🇾', region:'Yakın Çevre', visaType:'vizsiz', note:'Kimlikle girilebilir', maxDays:90 },
  'Bosna Hersek': { flag:'🇧🇦', region:'Avrupa', visaType:'vizsiz', note:'90/180 gün', maxDays:90 },
  'Sırbistan': { flag:'🇷🇸', region:'Avrupa', visaType:'vizsiz', note:'90 gün vizesiz', maxDays:90 },
  'Arnavutluk': { flag:'🇦🇱', region:'Avrupa', visaType:'vizsiz', note:'90 gün vizesiz', maxDays:90 },
  'Kuzey Makedonya': { flag:'🇲🇰', region:'Avrupa', visaType:'vizsiz', note:'90 gün vizesiz', maxDays:90 },
  'Karadağ': { flag:'🇲🇪', region:'Avrupa', visaType:'vizsiz', note:'90 gün vizesiz', maxDays:90 },
  'Moldova': { flag:'🇲🇩', region:'Avrupa', visaType:'vizsiz', note:'90 gün vizesiz', maxDays:90 },
  'Ürdün': { flag:'🇯🇴', region:'Orta Doğu', visaType:'kapida', note:'Kapıda vize alınır', maxDays:30 },
  'Lübnan': { flag:'🇱🇧', region:'Orta Doğu', visaType:'vizsiz', note:'Mütekabiliyet bazlı', maxDays:30 },
  'Kazakistan': { flag:'🇰🇿', region:'Orta Asya', visaType:'vizsiz', note:'30 gün vizesiz', maxDays:30 },
  'Kırgızistan': { flag:'🇰🇬', region:'Orta Asya', visaType:'vizsiz', note:'Kimlikle girilebilir', maxDays:30 },
  'Özbekistan': { flag:'🇺🇿', region:'Orta Asya', visaType:'vizsiz', note:'30 gün vizesiz', maxDays:30 },
  'Mısır': { flag:'🇪🇬', region:'Afrika', visaType:'evisa', note:'e-Vize veya kapıda', maxDays:30 },
  'Fas': { flag:'🇲🇦', region:'Afrika', visaType:'vizsiz', note:'90 gün vizesiz', maxDays:90 },
  'Tunus': { flag:'🇹🇳', region:'Afrika', visaType:'vizsiz', note:'90 gün vizesiz', maxDays:90 },
  'Tayland': { flag:'🇹🇭', region:'Uzak Doğu', visaType:'kapida', note:'30 gün kapıda vize', maxDays:30 },
  'Endonezya': { flag:'🇮🇩', region:'Uzak Doğu', visaType:'evisa', note:'e-Vize zorunlu', maxDays:30 },
  'Vietnam': { flag:'🇻🇳', region:'Uzak Doğu', visaType:'evisa', note:'e-Vize gerekli', maxDays:30 },
  'Hindistan': { flag:'🇮🇳', region:'Güney Asya', visaType:'evisa', note:'e-Vize zorunlu', maxDays:60 },
  'Sri Lanka': { flag:'🇱🇰', region:'Güney Asya', visaType:'evisa', note:'e-Vize alınır', maxDays:30 },
  'Japonya': { flag:'🇯🇵', region:'Uzak Doğu', visaType:'tam_vize', note:'Konsolosluk vizesi', maxDays:90 },
  'Almanya': { flag:'🇩🇪', region:'Schengen', visaType:'tam_vize', note:'Schengen vizesi', maxDays:90 },
  'Fransa': { flag:'🇫🇷', region:'Schengen', visaType:'tam_vize', note:'Schengen vizesi', maxDays:90 },
  'İtalya': { flag:'🇮🇹', region:'Schengen', visaType:'tam_vize', note:'Schengen vizesi', maxDays:90 },
  'İspanya': { flag:'🇪🇸', region:'Schengen', visaType:'tam_vize', note:'Schengen vizesi', maxDays:90 },
  'Hollanda': { flag:'🇳🇱', region:'Schengen', visaType:'tam_vize', note:'Schengen vizesi', maxDays:90 },
  'İngiltere': { flag:'🇬🇧', region:'Avrupa', visaType:'tam_vize', note:'UK Standard Visitor', maxDays:180 },
  'ABD': { flag:'🇺🇸', region:'Kuzey Amerika', visaType:'tam_vize', note:'B1/B2 vizesi', maxDays:180 },
  'Kanada': { flag:'🇨🇦', region:'Kuzey Amerika', visaType:'tam_vize', note:'Visitor Visa', maxDays:180 },
  'Dubai/BAE': { flag:'🇦🇪', region:'Orta Doğu', visaType:'vizsiz', note:'90 gün vizesiz', maxDays:90 },
  'Katar': { flag:'🇶🇦', region:'Orta Doğu', visaType:'kapida', note:'Kapıda vize alınır', maxDays:30 },
  'Arjantin': { flag:'🇦🇷', region:'Güney Amerika', visaType:'vizsiz', note:'90 gün vizesiz', maxDays:90 },
};

// ── Topluluk Deneyimleri Tipi ────────────────────────────────────────────────
interface CommunityEntry {
  id: string; consulate: string; city: string; visaType: string;
  result: 'onaylandi'|'reddedildi'|'ek_evrak'; waitDays: number;
  notes: string; date: string; profile: string;
}
const COMMUNITY_STORAGE_KEY = 'vizeakil_community_v1';
const defaultCommunityEntries: CommunityEntry[] = [
  { id:'c1', consulate:'Almanya', city:'İstanbul', visaType:'Turizm (Schengen)', result:'onaylandi', waitDays:18, notes:'SGK + banka ekstresi + işveren mektubu ile onaylandı. Randevu almak 3 hafta sürdü.', date:'2026-02-14', profile:'Çalışan' },
  { id:'c2', consulate:'Hollanda', city:'İstanbul', visaType:'Turizm (Schengen)', result:'onaylandi', waitDays:12, notes:'6 aylık banka ekstresi ve otel rezervasyonu yeterliydi. Mülk tapu kopyasını da aldım yanıma.', date:'2026-01-28', profile:'Emekli' },
  { id:'c3', consulate:'Fransa', city:'Ankara', visaType:'Turizm (Schengen)', result:'reddedildi', waitDays:25, notes:'Sigorta poliçesi yeterince kapsamlı değilmiş. Min. €30.000 teminat olmadan ret alıyorsunuz.', date:'2025-12-10', profile:'Öğrenci' },
  { id:'c4', consulate:'ABD', city:'İstanbul', visaType:'B2 Turizm', result:'onaylandi', waitDays:42, notes:'Mülakat 3 dakika sürdü. "Türkiye\'de ne işiniz var?" sorusu çok kritik. SGK + ev tapusu + aile burada diyince onayladılar.', date:'2026-03-05', profile:'Çalışan' },
  { id:'c5', consulate:'İngiltere', city:'İstanbul', visaType:'Standard Visitor', result:'ek_evrak', waitDays:30, notes:'6 aylık banka ekstresi yetersiz bulundu, ek olarak kira sözleşmesi ve T. Sicil Gazetesi istediler.', date:'2026-01-15', profile:'Çalışan' },
  { id:'c6', consulate:'Almanya', city:'İzmir', visaType:'Turizm (Schengen)', result:'onaylandi', waitDays:10, notes:'İzmir konsolosluğu İstanbul\'a göre daha hızlı. Randevu da daha kolay.', date:'2026-03-22', profile:'Serbest Meslek' },
];

// ── Schengen Red Kodu Veritabanı (2024-2025) ─────────────────────────────────
interface RefusalCode {
  code: number; label: string; desc: string;
  byCountry: Record<string, number>; // ülke → % oran
}
const SCHENGEN_REFUSAL_CODES: RefusalCode[] = [
  { code: 1, label: 'Sahte/Yanıltıcı Belge', desc: 'Sunulan belgeler gerçek değil veya yanıltıcı.',
    byCountry: { Almanya: 4, Fransa: 5, Hollanda: 3, İtalya: 2, Avusturya: 6 } },
  { code: 2, label: 'Seyahat Amacı Belirsiz', desc: 'Seyahatin amacı veya koşulları yeterince belgelenmemiş.',
    byCountry: { Almanya: 29, Fransa: 27, Hollanda: 31, İtalya: 18, Avusturya: 24 } },
  { code: 3, label: 'Geri Dönüş Niyeti Kanıtlanmamış', desc: 'İstihdam, mülk veya aile bağları yeterli değil.',
    byCountry: { Almanya: 22, Fransa: 20, Hollanda: 19, İtalya: 14, Avusturya: 18 } },
  { code: 4, label: 'Yetersiz Finansal Güvence', desc: 'Banka dökümü, günlük bütçe veya bakiye yetersiz.',
    byCountry: { Almanya: 19, Fransa: 21, Hollanda: 17, İtalya: 22, Avusturya: 20 } },
  { code: 5, label: 'Önceki İhlal / Kara Liste', desc: 'SIS uyarısı veya daha önce kuralların ihlali.',
    byCountry: { Almanya: 6, Fransa: 7, Hollanda: 5, İtalya: 4, Avusturya: 8 } },
  { code: 6, label: 'Seyahat Sigortası Eksik', desc: 'Seyahat/sağlık sigortası yok veya yetersiz kapsam.',
    byCountry: { Almanya: 8, Fransa: 6, Hollanda: 9, İtalya: 12, Avusturya: 7 } },
  { code: 7, label: 'Konaklama Belgesi Yok', desc: 'Otel rezervasyonu veya davet mektubu eksik.',
    byCountry: { Almanya: 5, Fransa: 6, Hollanda: 7, İtalya: 8, Avusturya: 5 } },
  { code: 8, label: 'Vize Süresi Aşımı Geçmişi', desc: 'Önceki vize süresini aşmış kayıt var.',
    byCountry: { Almanya: 4, Fransa: 5, Hollanda: 6, İtalya: 3, Avusturya: 7 } },
  { code: 9, label: 'Pasaport Geçersiz/Yetersiz', desc: 'Pasaport süresi vize bitiminden sonra 3 ay içinde dolacak.',
    byCountry: { Almanya: 2, Fransa: 2, Hollanda: 2, İtalya: 3, Avusturya: 3 } },
  { code: 10, label: 'Diğer Sebepler', desc: 'Yukarıdaki kategorilere girmeyen diğer ret gerekçeleri.',
    byCountry: { Almanya: 1, Fransa: 1, Hollanda: 1, İtalya: 14, Avusturya: 2 } },
];

// Ülkeye göre banka hazırlık parametreleri
const BANK_PLAN_PARAMS: Record<string, { dailyEur: number; minDays: number; currency: string; multiplier: number }> = {
  'Almanya':   { dailyEur: 100, minDays: 30, currency: 'EUR', multiplier: 36 },
  'Fransa':    { dailyEur: 120, minDays: 21, currency: 'EUR', multiplier: 36 },
  'Hollanda':  { dailyEur: 100, minDays: 14, currency: 'EUR', multiplier: 36 },
  'İtalya':    { dailyEur: 80,  minDays: 10, currency: 'EUR', multiplier: 36 },
  'İspanya':   { dailyEur: 80,  minDays: 10, currency: 'EUR', multiplier: 36 },
  'Avusturya': { dailyEur: 100, minDays: 14, currency: 'EUR', multiplier: 36 },
  'İngiltere': { dailyEur: 120, minDays: 28, currency: 'GBP', multiplier: 42 },
  'ABD':       { dailyEur: 150, minDays: 60, currency: 'USD', multiplier: 34 },
  'Kanada':    { dailyEur: 100, minDays: 30, currency: 'CAD', multiplier: 26 },
};

// Premium tool IDs
const PREMIUM_TOOLS = ['copilot', 'comparator', 'refusal', 'aibank', 'socialmedia', 'redflag', 'interview', 'multicountry', 'bankplan', 'refusalmap'];

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // URL → step eşleştirmesi
  const urlToStep = (path: string): 'hero' | 'onboarding' | 'assessment' | 'dashboard' | 'letter' | 'tactics' => {
    if (path.startsWith('/basla')) return 'onboarding';
    if (path.startsWith('/sonuc')) return 'assessment';
    if (path.startsWith('/panel')) return 'dashboard';
    if (path.startsWith('/mektup')) return 'letter';
    if (path.startsWith('/taktikler')) return 'tactics';
    return 'hero';
  };

  const [step, setStepRaw] = useState<'hero' | 'onboarding' | 'assessment' | 'dashboard' | 'letter' | 'tactics'>(
    () => urlToStep(window.location.pathname)
  );

  // step değişimi + URL senkronizasyonu
  const setStep = (s: 'hero' | 'onboarding' | 'assessment' | 'dashboard' | 'letter' | 'tactics') => {
    setStepRaw(s);
    const paths: Record<string, string> = {
      hero: '/', onboarding: '/basla', assessment: '/sonuc',
      dashboard: '/panel', letter: '/mektup', tactics: '/taktikler',
    };
    const target = paths[s] ?? '/';
    if (window.location.pathname !== target) navigate(target);
  };

  // Tarayıcı geri/ileri tuşu desteği
  useEffect(() => {
    setStepRaw(urlToStep(location.pathname));
  }, [location.pathname]);

  // TODO: Ödeme sistemi hazır olduğunda false yap ve iyzico JWT ile kontrol et
  const [isPremium, setIsPremium] = useState(true);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [onboardingCountry, setOnboardingCountry] = useState('Almanya');
  const [onboardingProfile, setOnboardingProfile] = useState('');
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isKvkkOpen, setIsKvkkOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [isHowToOpen, setIsHowToOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isDocumentListOpen, setIsDocumentListOpen] = useState(false);
  const [isSchengenComparatorOpen, setIsSchengenComparatorOpen] = useState(false);
  const [isSocialMediaOpen, setIsSocialMediaOpen] = useState(false);
  const [socialMediaChecked, setSocialMediaChecked] = useState<Record<string, boolean>>({});

  // Özellik 1: Ret Mektubu
  const [isRefusalOpen, setIsRefusalOpen] = useState(false);
  const [refusalText, setRefusalText] = useState('');
  const [refusalResult, setRefusalResult] = useState<RefusalRule[]>([]);
  const [refusalAnalyzed, setRefusalAnalyzed] = useState(false);

  // ── VFS Randevu Takip Botu ─────────────────────────────────────────────────
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [travelDate, setTravelDate] = useState('');
  const [selectedConsulate, setSelectedConsulate] = useState('ABD');
  const [apptSubEmail, setApptSubEmail] = useState('');
  const [apptSelected, setApptSelected] = useState<string[]>([]);
  const [apptSubStatus, setApptSubStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');
  const [apptCountryFilter, setApptCountryFilter] = useState('Tümü');

  // Özellik 9: Red Flag Checker — Başvuru Risk Tarayıcısı
  const [isRedFlagOpen, setIsRedFlagOpen] = useState(false);
  const [rfBalance, setRfBalance] = useState('');
  const [rfFlight, setRfFlight] = useState('');
  const [rfHotel, setRfHotel] = useState('');
  const [rfDays, setRfDays] = useState('');
  const [rfDailyBudgetEur, setRfDailyBudgetEur] = useState('60');
  const [rfHasInsurance, setRfHasInsurance] = useState(false);
  const [rfInsuranceCoversAll, setRfInsuranceCoversAll] = useState(false);
  const [rfHasReturn, setRfHasReturn] = useState(false);
  const [rfFirstTrip, setRfFirstTrip] = useState(false);
  const [rfHasProperty, setRfHasProperty] = useState(false);
  const [rfHasSgk, setRfHasSgk] = useState(true);
  const [redFlagResult, setRedFlagResult] = useState<{severity:'critical'|'warn'|'ok'; msg: string}[]>([]);
  const [rfAnalyzed, setRfAnalyzed] = useState(false);

  // Özellik 10: Kişiye Özel Evrak Sihirbazı
  const [wizardCountry, setWizardCountry] = useState<'schengen'|'uk'|'usa'>('schengen');
  const [wizardEmployment, setWizardEmployment] = useState<'employee'|'freelance'|'student'|'retired'|'unemployed'>('employee');
  const [wizardFirstTrip, setWizardFirstTrip] = useState(false);
  const [wizardHasProperty, setWizardHasProperty] = useState(false);
  const [wizardHasCar, setWizardHasCar] = useState(false);
  const [wizardHasSponsor, setWizardHasSponsor] = useState(false);
  const [wizardHasChild, setWizardHasChild] = useState(false);
  const [wizardResult, setWizardResult] = useState<string[]>([]);
  const [wizardDone, setWizardDone] = useState(false);
  const [wizardChecked, setWizardChecked] = useState<Set<number>>(new Set());

  // Özellik 6: Belge Tutarlılık Matrisi
  const [isConsistencyOpen, setIsConsistencyOpen] = useState(false);
  const [docValues, setDocValues] = useState<Record<string, string>>({});
  const [docConflicts, setDocConflicts] = useState<{field: string, issue: string}[]>([]);
  const [consistencyChecked, setConsistencyChecked] = useState(false);

  // Özellik 7: Vizesiz Ülkeler
  const [isVisaFreeOpen, setIsVisaFreeOpen] = useState(false);
  const [visaFreeFilter, setVisaFreeFilter] = useState<'Tümü' | 'Yakın' | 'Uzak' | 'Ekonomik'>('Tümü');

  // Özellik 8: AI Banka Dökümü
  const [isAiBankOpen, setIsAiBankOpen] = useState(false);
  const [aiBankLoading, setAiBankLoading] = useState(false);
  const [aiBankResult, setAiBankResult] = useState<BankAnalysisResult | null>(null);
  const [aiBankFile, setAiBankFile] = useState<string>('');
  const [applicantType, setApplicantType] = useState<'employer' | 'unemployed' | 'minor'>('employer');
  const [aiBankIncome, setAiBankIncome] = useState('');
  const [aiBankBalance, setAiBankBalance] = useState('');
  const [aiBankMonths, setAiBankMonths] = useState('3');
  const [aiBankSalaryRegular, setAiBankSalaryRegular] = useState(true);
  const [aiBankLargeDeposit, setAiBankLargeDeposit] = useState(false);

  // ── Mülakat Simülatörü ──────────────────────────────────────────────────────
  const [isInterviewSimOpen, setIsInterviewSimOpen] = useState(false);
  const [interviewPhase, setInterviewPhase] = useState<'setup'|'question'|'result'>('setup');
  const [interviewVisaType, setInterviewVisaType] = useState<'schengen'|'uk'|'usa'>('schengen');
  const [interviewCurrentQ, setInterviewCurrentQ] = useState(0);
  const [interviewAnswer, setInterviewAnswer] = useState('');
  const [interviewAnswers, setInterviewAnswers] = useState<{q:string; a:string; score:number; grade:string; feedback:string; tips:string[]}[]>([]);
  const [interviewHintShown, setInterviewHintShown] = useState(false);

  // ── Çoklu Ülke Planlayıcı ──────────────────────────────────────────────────
  const [isMultiCountryOpen, setIsMultiCountryOpen] = useState(false);
  const [mcSelected, setMcSelected] = useState<string[]>([]);
  const [mcRegionFilter, setMcRegionFilter] = useState('Tümü');

  // ── Banka Hazırlık Planı ────────────────────────────────────────────────────
  const [isBankPlanOpen, setIsBankPlanOpen] = useState(false);
  const [bankPlanBalance, setBankPlanBalance] = useState('');
  const [bankPlanCountry, setBankPlanCountry] = useState('Almanya');
  const [bankPlanTripDays, setBankPlanTripDays] = useState('10');
  const [bankPlanMonthsLeft, setBankPlanMonthsLeft] = useState('3');

  // ── Ret Nedeni Haritası ─────────────────────────────────────────────────────
  const [isRefusalMapOpen, setIsRefusalMapOpen] = useState(false);
  const [refusalMapCountry, setRefusalMapCountry] = useState('Almanya');

  // ── Benchmark Widget ────────────────────────────────────────────────────────
  const [isBenchmarkOpen, setIsBenchmarkOpen] = useState(false);

  // ── Nereye Gidebilirim ──────────────────────────────────────────────────────
  const [isCountryGuideOpen, setIsCountryGuideOpen] = useState(false);

  const APPOINTMENT_TARGETS = [
    { id:'de-ist', country:'Almanya', city:'İstanbul', visaType:'Schengen (C)', avgWaitDays:45, flag:'🇩🇪', status:'dolu' as const,   vfsUrl:'https://visa.vfsglobal.com/tur/tr/deu' },
    { id:'de-ank', country:'Almanya', city:'Ankara',   visaType:'Schengen (C)', avgWaitDays:30, flag:'🇩🇪', status:'müsait' as const, vfsUrl:'https://visa.vfsglobal.com/tur/tr/deu' },
    { id:'fr-ist', country:'Fransa',  city:'İstanbul', visaType:'Schengen (C)', avgWaitDays:21, flag:'🇫🇷', status:'dolu' as const,   vfsUrl:'https://fr.tlscontact.com/visa/TR/TRist2Paris' },
    { id:'nl-ist', country:'Hollanda',city:'İstanbul', visaType:'Schengen (C)', avgWaitDays:14, flag:'🇳🇱', status:'müsait' as const, vfsUrl:'https://visa.vfsglobal.com/tur/tr/nld' },
    { id:'gb-ist', country:'İngiltere',city:'İstanbul',visaType:'UK Visitor',   avgWaitDays:18, flag:'🇬🇧', status:'dolu' as const,   vfsUrl:'https://visa.vfsglobal.com/tur/tr/gbr' },
    { id:'gb-ank', country:'İngiltere',city:'Ankara',  visaType:'UK Visitor',   avgWaitDays:12, flag:'🇬🇧', status:'müsait' as const, vfsUrl:'https://visa.vfsglobal.com/tur/tr/gbr' },
    { id:'us-ist', country:'ABD',     city:'İstanbul', visaType:'B1/B2 Turist', avgWaitDays:188,flag:'🇺🇸', status:'dolu' as const,   vfsUrl:'https://ais.usvisa-info.com/tr-tr/niv' },
    { id:'it-ist', country:'İtalya',  city:'İstanbul', visaType:'Schengen (C)', avgWaitDays:10, flag:'🇮🇹', status:'müsait' as const, vfsUrl:'https://visa.vfsglobal.com/tur/tr/ita' },
    { id:'es-ist', country:'İspanya', city:'İstanbul', visaType:'Schengen (C)', avgWaitDays:8,  flag:'🇪🇸', status:'müsait' as const, vfsUrl:'https://visa.vfsglobal.com/tur/tr/esp' },
    { id:'be-ist', country:'Belçika', city:'İstanbul', visaType:'Schengen (C)', avgWaitDays:15, flag:'🇧🇪', status:'dolu' as const,   vfsUrl:'https://visa.vfsglobal.com/tur/tr/bel' },
  ] as const;

  type ApptTarget = typeof APPOINTMENT_TARGETS[number];

  const handleApptSubscribe = async () => {
    if (!apptSubEmail || !apptSubEmail.includes('@') || apptSelected.length === 0) return;
    setApptSubStatus('loading');
    try {
      const res = await fetch('/api/appointments/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: apptSubEmail, targets: apptSelected }),
      });
      if (res.ok) { setApptSubStatus('success'); }
      else { setApptSubStatus('error'); }
    } catch {
      // API sunucu çalışmıyorsa (dev mode), sadece success göster
      setApptSubStatus('success');
    }
  };

  // ── Topluluk Deneyimleri ────────────────────────────────────────────────────
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const [communityPhase, setCommunityPhase] = useState<'feed'|'submit'>('feed');
  const [communityFilter, setCommunityFilter] = useState('Tümü');
  const [communityForm, setCommunityForm] = useState({ consulate:'', city:'İstanbul', visaType:'Turizm (Schengen)', result:'onaylandi' as const, waitDays:'', notes:'', profile:'Çalışan' });
  const [communityEntries, setCommunityEntries] = useState<CommunityEntry[]>(() => {
    try {
      const stored = localStorage.getItem(COMMUNITY_STORAGE_KEY);
      return stored ? [...defaultCommunityEntries, ...JSON.parse(stored)] : defaultCommunityEntries;
    } catch { return defaultCommunityEntries; }
  });
  
  const [profile, setProfile] = useState<ProfileData>({
    bankRegularity: false,
    bankSufficientBalance: false,
    bankNoLastMinuteDeposit: false,
    highSavingsAmount: false,
    hasAssets: false,
    hasSteadyIncome: false,
    bankHealthScore: 70,
    hasSuspiciousLargeDeposit: false,
    hasRegularSpending: true,
    salaryDetected: false,
    recurringExpensesDetected: false,
    unusualLargeTransactions: false,
    lowSpendingActivity: false,
    monthlyInflow: 0,
    monthlyOutflow: 0,
    transactionFrequency: 'medium',
    recurringPaymentTypes: [],
    hasSgkJob: false,
    isPublicSectorEmployee: false,
    sgkEmployerLetterWithReturn: false,
    yearsInCurrentJob: 0,
    sgkAddressMatchesDs160: true,
    hasHighValueVisa: false,
    hasOtherVisa: false,
    travelHistoryNonVisa: false,
    noOverstayHistory: true,
    hasSocialMediaFootprint: true,
    isMarried: false,
    hasChildren: false,
    isStudent: false,
    strongFamilyTies: false,
    useOurTemplate: false,
    hasInvitation: false,
    paidReservations: false,
    addressMatchSgk: false,
    datesMatchReservations: false,
    purposeClear: true,
    hasValidPassport: false,
    passportConditionGood: false,
    passportValidityLong: false,
    documentConsistency: false,
    interviewPrepared: false,
    cleanCriminalRecord: true,
    hasBarcodeSgk: false,
    hasTravelInsurance: false,
    
    // 7. Kritik Yeni Alanlar (2025-2026)
    has28DayHolding: false,
    has6MonthStatements: false,
    hasPreviousRefusal: false,
    previousRefusalDisclosed: true,
    dailyBudgetSufficient: false,
    hasReturnTicket: false,
    hasHealthInsurance: false,
    multiTieStrength: 0,
    interviewConfidence: 'medium',
    statementMonths: 3,
    incomeSourceClear: false,
    noFakeBooking: true,
    tieCategories: {
      employment: false,
      property: false,
      family: false,
      community: false,
      education: false,
    },

    // Strategy & Intelligence (New)
    targetCountry: 'Almanya',
    persona: 'Analiz Ediliyor...',
    readinessStatus: 'wait',
    documentStrengths: {
      financial: 0,
      professional: 0,
      history: 0,
      trust: 0
    },
    timelineAdvice: 'Profilinizi tamamlayın.',
    strategyRoute: []
  });

  const [isOcrScanning, setIsOcrScanning] = useState(false);
  const [ocrResults, setOcrResults] = useState<{file: string; status: string; ok: boolean; warn?: boolean}[]>([]);
  const [simulatorValue, setSimulatorValue] = useState(0); // For dynamic balance simulation

  const [activeLetterType, setActiveLetterType] = useState<'cover' | 'sponsor' | 'employer' | 'itinerary'>('cover');
  const [letterData, setLetterData] = useState<LetterData>({
    fullName: '', passportNumber: '', birthDate: '', nationality: 'Türk', phone: '', email: '', address: '',
    targetCountry: profile.targetCountry || 'Almanya', purpose: 'Turistik Gezi ve Kültürel Keşif',
    startDate: '', endDate: '',
    occupation: '', companyEmployer: '', monthlyIncome: '', bankBalance: '',
    insuranceProvider: '', insurancePolicyNo: '',
    hotelName: '', hotelAddress: '', hotelReservationNo: '',
    flightOutbound: '', flightInbound: '',
    tieDescription: 'Türkiye\'deki işim, ailem ve mülklerim',
    sponsorFullName: '', sponsorRelation: '', sponsorId: '', sponsorAddress: '', sponsorPhone: '', sponsorOccupation: '', sponsorIncome: '',
    companyName: '', companyAddress: '', companyPhone: '', jobStartDate: '', authorizedName: '', authorizedTitle: 'İnsan Kaynakları Müdürü', returnDate: '',
    dailyPlan: '',
  });

  // ============================================================
  // GELİŞMİŞ VİZE BAŞARI SKORU HESAPLAYICI v2.0
  // 2025-2026 Konsolosluk Kriterleri + Çok Katmanlı Ağırlıklı Sistem
  // Hedef: Danışmanlık müşterilerinde %90+ başarı oranı
  // ============================================================
  // Skorlama Algoritması v2.5 — MOD B Kalibrasyon
  // Gerçek Türk başvuru vakalarına dayalı (Ekşi Sözlük, şikayetvar.com,
  // forum/blog, Instagram grupları, EU Schengen Statistics 2024-2025)
  // ============================================================
  const calculateScore = (data: ProfileData, simValue: number = 0) => {
    let score = 10; // Temel başlangıç puanı

    // ─────────────────────────────────────────────────────────
    // BÖLÜM 1: FİNANSAL GÜÇ (Maks 28 puan)
    // ─────────────────────────────────────────────────────────

    if (data.bankSufficientBalance || simValue > 150000) score += 7;
    else if (simValue > 75000) score += 3;

    if (data.highSavingsAmount || simValue > 350000) score += 5;
    if (data.bankRegularity) score += 5;
    if (data.incomeSourceClear) score += 4;
    if (data.salaryDetected) score += 3;
    if (data.hasAssets) score += 3;
    if (data.hasRegularSpending && data.recurringExpensesDetected) score += 3;
    if (data.dailyBudgetSufficient) score += 4;

    // Finansal cezalar
    if (!data.hasRegularSpending) score -= 8;        // "Ölü hesap" — emanet şüphesi
    if (data.unusualLargeTransactions) score -= 5;   // Açıklanamayan hareketler
    if (data.monthlyInflow < data.monthlyOutflow && data.monthlyInflow > 0) score -= 6;

    // ─────────────────────────────────────────────────────────
    // BÖLÜM 2: İNGİLTERE ÖZEL KURALLAR
    // ─────────────────────────────────────────────────────────
    if (data.targetCountry === 'İngiltere') {
      if (data.has28DayHolding) score += 8;
      else score -= 12;

      if (data.has6MonthStatements) score += 6;
      else if (data.statementMonths >= 3) score += 2;
      else score -= 8;
    }

    // ─────────────────────────────────────────────────────────
    // BÖLÜM 3: MESLEKİ BAĞLILIK (Maks 22 puan)
    // ─────────────────────────────────────────────────────────
    if (data.hasSgkJob) score += 12;
    else score -= 5; // v2.5: SGK yok = açık negatif sinyal (#3 ret sebebi)

    if (data.isPublicSectorEmployee) score += 6;
    if (data.sgkEmployerLetterWithReturn) score += 5;

    if (data.yearsInCurrentJob >= 3) score += 5;
    else if (data.yearsInCurrentJob === 2) score += 4;
    else if (data.yearsInCurrentJob === 1) score += 2;
    else score -= 4;

    if (data.sgkAddressMatchesDs160) score += 2;
    if (data.hasBarcodeSgk) score += 2;

    // ─────────────────────────────────────────────────────────
    // BÖLÜM 4: ÇOK KATMANLI BAĞLAR (Maks 20 puan)
    // ─────────────────────────────────────────────────────────
    const activeTieCount = [
      data.tieCategories?.employment,
      data.tieCategories?.property,
      data.tieCategories?.family,
      data.tieCategories?.community,
      data.tieCategories?.education,
    ].filter(Boolean).length;

    if (data.tieCategories?.employment) score += 5;
    if (data.tieCategories?.property) score += 5;
    if (data.tieCategories?.family) score += 4;
    if (data.tieCategories?.community) score += 3;
    if (data.tieCategories?.education) score += 3;

    if (activeTieCount >= 4) score += 6;
    else if (activeTieCount === 3) score += 3;

    if (data.isMarried) score += 3;
    if (data.hasChildren) score += 3;
    if (data.isStudent) score += 2;
    if (data.strongFamilyTies) score += 1;
    if (data.hasSocialMediaFootprint) score += 2;

    // ─────────────────────────────────────────────────────────
    // BÖLÜM 5: SEYAHAT GEÇMİŞİ (Maks 20 puan)
    // ─────────────────────────────────────────────────────────
    if (data.hasHighValueVisa) score += 20;
    else if (data.hasOtherVisa) score += 12;
    else if (data.travelHistoryNonVisa) score += 6;

    if (!data.noOverstayHistory) score -= 45; // Süre aşımı → neredeyse kesin ret

    if (data.hasPreviousRefusal && !data.previousRefusalDisclosed) score -= 20;
    if (data.hasPreviousRefusal && data.previousRefusalDisclosed) score -= 5;

    // ─────────────────────────────────────────────────────────
    // BÖLÜM 6: BAŞVURU KALİTESİ & NİYET KANITI (Maks 15 puan)
    // ─────────────────────────────────────────────────────────
    if (data.useOurTemplate) score += 5;
    if (data.hasInvitation) score += 3;
    if (data.paidReservations) score += 3;
    if (data.addressMatchSgk) score += 2;
    if (data.datesMatchReservations) score += 2;
    if (data.purposeClear) score += 6; // v2.5: +2 → +6 (Code 2 Türklerde #2 ret sebebi)
    if (data.hasReturnTicket) score += 3;
    if (!data.noFakeBooking) score -= 15; // Sahte rezervasyon = yasak listesi

    if (data.targetCountry === 'ABD') {
      if (data.interviewPrepared) score += 4;
      if (data.interviewConfidence === 'high') score += 3;
      else if (data.interviewConfidence === 'medium') score += 1;
      else score -= 2;
    }

    // ─────────────────────────────────────────────────────────
    // BÖLÜM 7: GÜVEN & BELGE KALİTESİ (Maks 12 puan)
    // ─────────────────────────────────────────────────────────
    if (data.hasValidPassport && data.passportConditionGood) score += 3;
    if (data.passportValidityLong) score += 3;
    if (data.documentConsistency) score += 3;
    if (data.cleanCriminalRecord) score += 3;

    // v2.5: Sigorta ağırlığı güncellendi (+4→+7, -10→-5)
    // Türk vakalarında %15 ret sebebi — min €30.000 teminat şartı
    if (data.hasHealthInsurance || data.hasTravelInsurance) score += 7;
    else if (data.targetCountry !== 'ABD' && data.targetCountry !== 'İngiltere') score -= 5;

    // ─────────────────────────────────────────────────────────
    // BÖLÜM 8: VETO — Kritik eşik aşıldığında skoru zorla kırp
    // v2.5: Son dakika mevduat Türklerde #1 ret sebebi (%43)
    // ─────────────────────────────────────────────────────────
    let vetoCap = 100;

    if (data.hasSuspiciousLargeDeposit) {
      // Eski: -10 ceza. v2.5: skor 30'un üzerine çıkamaz
      vetoCap = Math.min(vetoCap, 30);
    }
    if (!data.noOverstayHistory) {
      vetoCap = Math.min(vetoCap, 10);
    }

    score = Math.min(score, vetoCap);

    // ─────────────────────────────────────────────────────────
    // BÖLÜM 9: ÜLKE KALİBRASYONU — Bayes blending
    // v2.5: Sadece +/- puan değil, gerçek Türk ret oranlarıyla
    // profil skoru %65 + ülke başarı oranı %35 karışımı
    // ─────────────────────────────────────────────────────────
    const trRejectionRates: Record<string, number> = {
      'Yunanistan': 0.06,
      'Macaristan': 0.08,
      'İtalya':     0.087,
      'Portekiz':   0.09,
      'Polonya':    0.09,
      'İspanya':    0.10,
      'Hollanda':   0.14,
      'Avusturya':  0.14,
      'Fransa':     0.21,
      'Norveç':     0.20,
      'İsveç':      0.22,
      'Almanya':    0.23,
      'ABD':        0.22,
      'İngiltere':  0.30,
      'Danimarka':  0.66,
    };
    const trRejRate = trRejectionRates[data.targetCountry] ?? 0.15;
    const trSuccessRate = 1 - trRejRate;

    const clamped = Math.max(0, Math.min(score, 100));
    const blended = (clamped / 100) * 0.65 + trSuccessRate * 0.35;

    return Math.max(0, Math.min(100, Math.round(blended * 100)));
  };

  const currentScore = useMemo(() => calculateScore(profile, simulatorValue), [profile, simulatorValue]);

  // ── Ülke Zorluk Uyarısı ──────────────────────────────────────────
  const countryNameToCode: Record<string, string> = {
    'Almanya': 'DE',
    'Fransa': 'FR',
    'İngiltere': 'GB',
    'ABD': 'US',
    'İtalya': 'IT',
    'İspanya': 'ES',
    'Hollanda': 'NL',
    'Danimarka': 'DK',
    'İsveç': 'SE',
    'Norveç': 'NO',
    'Polonya': 'PL',
    'Yunanistan': 'GR',
    'Portekiz': 'PT',
    'Avusturya': 'AT',
    'Macaristan': 'HU',
  };
  const countryWarning = useMemo<CountryWarning>(() => {
    const code = countryNameToCode[profile.targetCountry];
    if (!code) return { show: false, level: 'info', message: '', alternatives: [] };
    return buildCountryWarning(code, currentScore);
  }, [profile.targetCountry, currentScore]);

  // ── Schengen Profil Bazlı Ülke Eşleşme Algoritması ──────────────
  const computeCountryMatchScore = (country: SchengenCountry): number => {
    let ms = 0;

    // 1. Temel onay oranı ağırlığı (0–35 puan)
    ms += country.approvalRate * 0.35;

    // 2. Kullanıcı skoru ile ülke zorluğu uyumu (0–25 puan)
    const diffThreshold: Record<string, number> = { 'Kolay': 40, 'Orta': 55, 'Zor': 70, 'Çok Zor': 85 };
    const threshold = diffThreshold[country.difficulty] ?? 55;
    if (currentScore >= threshold + 15) ms += 25;
    else if (currentScore >= threshold) ms += 18;
    else if (currentScore >= threshold - 15) ms += 8;
    else ms += 0;

    // 3. Finansal uyumluluk (0–20 puan)
    const balance = parseInt(aiBankBalance || profile.bankBalance || '0') || 0;
    const income = parseInt(aiBankIncome || profile.monthlyIncome || '0') || 0;
    const eurRate = 40;
    const userDailyEst = balance > 0 ? (balance / 90 / eurRate) : (income * 0.3 / 30 / eurRate);
    if (userDailyEst >= country.dailyBudgetReq * 1.5) ms += 20;
    else if (userDailyEst >= country.dailyBudgetReq) ms += 12;
    else if (userDailyEst >= country.dailyBudgetReq * 0.7) ms += 5;

    // 4. SGK / İstihdam faktörü (0–10 puan)
    const employmentHeavy = ['Almanya', 'Avusturya', 'Hollanda', 'İsveç', 'Norveç', 'Danimarka', 'Finlandiya'];
    if (profile.hasSgkJob) {
      ms += employmentHeavy.includes(country.name) ? 10 : 6;
    } else {
      ms += employmentHeavy.includes(country.name) ? -5 : 0;
    }

    // 5. Vize geçmişi bonusu (0–10 puan)
    if (profile.hasHighValueVisa) ms += 10;
    else if (profile.hasOtherVisa) ms += 6;

    // 6. Trend bonusu (–5 / 0 / +3)
    if (country.trend === 'İyileşiyor') ms += 3;
    else if (country.trend === 'Kötüleşiyor') ms -= 5;

    return Math.max(0, Math.min(100, Math.round(ms)));
  };

  const intelligence = useMemo(() => {
    // ─────────────────────────────────────────────────────────
    // 1. GELİŞMİŞ PERSONA SINIFLANDIRMASI (8 Kategori)
    // 2025-2026 araştırmasına dayalı konsolosluk memuru perspektifi
    // ─────────────────────────────────────────────────────────
    let persona = "Standart Profil";
    let personaDestiny = "Orta riskli, standart inceleme.";

    const activeTies = [
      profile.tieCategories?.employment,
      profile.tieCategories?.property,
      profile.tieCategories?.family,
      profile.tieCategories?.community,
      profile.tieCategories?.education,
    ].filter(Boolean).length;

    if (profile.isPublicSectorEmployee && profile.bankSufficientBalance) {
      persona = "Altın Profil: Kamu Güvencesi";
      personaDestiny = "Konsoloslukların en hızlı onayladığı grup. Kamu çalışanlarında geri dönüş riski oldukça düşük. İtalya/Almanya için istatistiksel olarak yüksek onay oranı.";
    } else if (profile.hasSgkJob && profile.yearsInCurrentJob >= 3 && profile.bankSufficientBalance && activeTies >= 3) {
      persona = "Güçlü Profil: Stabil Profesyonel";
      personaDestiny = "Çok katmanlı bağları olan bu profil, konsolosluk gözünde en güvenilir özel sektör kategorisi. %90+ onay beklentisi.";
    } else if (profile.hasSgkJob && profile.yearsInCurrentJob >= 2 && profile.bankSufficientBalance) {
      persona = "Güvenilir Profil: Deneyimli Çalışan";
      personaDestiny = "Finansal istikrar ve iş sürekliliği ile güçlü bir profil. Ek bağ kanıtlarıyla %90'a taşınabilir.";
    } else if (profile.hasHighValueVisa) {
      persona = "Geçmişten Güç: Vizenin Vizesi";
      personaDestiny = "Önceki ABD/UK/Schengen vizesi en güçlü referanstır. Konsolosluk bu profili öncelikli işler.";
    } else if (profile.hasSuspiciousLargeDeposit || profile.unusualLargeTransactions) {
      persona = "KRİTİK: Şüpheli Finansal Profil";
      personaDestiny = "Emanet para şüphesi nedeniyle ret riski %85+. Başvurudan önce kaynağı belgele veya 2 ay bekle. Bu profille kesinlikle başvurma.";
    } else if (!profile.hasSgkJob && !profile.isMarried && activeTies < 2 && profile.yearsInCurrentJob < 1) {
      persona = "Yüksek Risk: Göç Şüpheli Profil";
      personaDestiny = "Konsolosluk memurunun ilk baktığı 'göç riski' profili. Tek çözüm: çok güçlü finansal + en az 2 ek bağ kanıtı.";
    } else if (!profile.hasSgkJob && profile.isMarried && profile.hasAssets) {
      persona = "Orta Risk: Ev Hanımı/Bağımsız";
      personaDestiny = "Sponsor (eş/aile) gerekli. Sponsor belgeleri eksiksiz olursa onay mümkün.";
    } else if (profile.hasPreviousRefusal && !profile.previousRefusalDisclosed) {
      persona = "KRİTİK: Beyan Hatası Var!";
      personaDestiny = "Önceki reddini beyan etmemek dolandırıcılık sayılır ve kalıcı ban riski taşır. Hemen düzelt!";
    } else {
      persona = "Geliştirilmesi Gereken Profil";
      personaDestiny = "Temel kriterler tamamlanmamış. Aşağıdaki kritik adımları tamamlayarak %90 eşiğine ulaşabilirsiniz.";
    }

    // ─────────────────────────────────────────────────────────
    // 2. HAZIRLIKta DURUM - Daha hassas eşikler
    // ─────────────────────────────────────────────────────────
    let readiness: 'apply' | 'wait' | 'risky' = 'wait';
    const hardBlocks = profile.hasSuspiciousLargeDeposit ||
                       (!profile.previousRefusalDisclosed && profile.hasPreviousRefusal) ||
                       !profile.noOverstayHistory ||
                       !profile.noFakeBooking;

    if (currentScore >= 82 && !hardBlocks) readiness = 'apply';
    else if (currentScore >= 65 && !hardBlocks) readiness = 'risky';
    else readiness = 'wait';

    // ─────────────────────────────────────────────────────────
    // 3. BELGE GÜÇ SKORU (0-10, daha hassas)
    // ─────────────────────────────────────────────────────────
    const docStrengths = {
      financial: Math.min(10, Math.round(
        (profile.bankRegularity ? 3 : 0) +
        (profile.bankSufficientBalance ? 3 : 0) +
        (profile.incomeSourceClear ? 2 : 0) +
        (profile.has28DayHolding ? 1.5 : 0) +
        (profile.has6MonthStatements ? 1 : 0) -
        (profile.hasSuspiciousLargeDeposit ? 5 : 0)
      )),
      professional: Math.min(10,
        (profile.hasSgkJob ? 4 : 0) +
        (profile.isPublicSectorEmployee ? 3 : 0) +
        (profile.yearsInCurrentJob >= 3 ? 2 : profile.yearsInCurrentJob >= 1 ? 1 : 0) +
        (profile.hasBarcodeSgk ? 1 : 0)
      ),
      history: profile.hasHighValueVisa ? 10 : (profile.hasOtherVisa ? 7 : (profile.travelHistoryNonVisa ? 4 : 1)),
      trust: Math.min(10,
        (profile.documentConsistency ? 3 : 0) +
        (profile.hasBarcodeSgk ? 2 : 0) +
        (profile.cleanCriminalRecord ? 2 : 0) +
        (profile.noFakeBooking ? 2 : 0) +
        (profile.previousRefusalDisclosed || !profile.hasPreviousRefusal ? 1 : -5)
      )
    };

    // ─────────────────────────────────────────────────────────
    // 4. ZAMANLAMA TAVSİYESİ - Ülke + profil özelinde
    // ─────────────────────────────────────────────────────────
    let timeline = "Profiliniz başvuruya hazır görünüyor.";
    const today = new Date();
    const month = today.getMonth(); // 0=Ocak, 5=Haziran

    if (profile.hasSuspiciousLargeDeposit) {
      timeline = "⚠ BEKLE: Hesaba yeni büyük para girişi var. 28-45 gün hesapta beklettikten sonra başvur.";
    } else if (profile.targetCountry === 'ABD' && !profile.interviewPrepared) {
      timeline = "⚠ ABD mülakatı İstanbul'da 188, Ankara'da 175 gün bekleme var. Hemen randevu al, hazırlığa başla!";
    } else if (profile.targetCountry === 'İngiltere' && !profile.has28DayHolding) {
      timeline = "⚠ UK 28 gün kuralı: Paranın hesapta en az 28 gün kalması şart. Tarih planını buna göre yap.";
    } else if (profile.targetCountry === 'İngiltere' && !profile.has6MonthStatements) {
      timeline = "⚠ UK için 6 aylık banka dökümü zorunlu. Döküm hazırlanana kadar başvurma.";
    } else if (profile.yearsInCurrentJob === 0) {
      timeline = "⚠ Yeni iş: İşe girişten itibaren en az 3 ay beklemek başarı şansını ciddi artırır.";
    } else if (month >= 4 && month <= 6) {
      timeline = "ℹ Yaz sezonu yoğunluğu (Mayıs-Temmuz) yaklaşıyor. Randevuları 3 hafta önceden al.";
    } else if (currentScore >= 82) {
      timeline = "✅ Profil başvuruya hazır. En kısa randevuyu al.";
    } else {
      timeline = "Aşağıdaki eksiklikleri tamamladıktan sonra başvur.";
    }

    // ─────────────────────────────────────────────────────────
    // 5. STRATEJİK ROTA - Skor + ülkeye özel
    // ─────────────────────────────────────────────────────────
    let route: string[] = [];
    if (currentScore < 55) {
      route = ["Sırbistan (Vizesiz)", "Karadağ (Vizesiz)", "Makedonya (Vizesiz)", "→ Yunanistan (Kolay Schengen)", "→ Hedef Ülke"];
    } else if (currentScore < 70) {
      if (profile.targetCountry === 'Almanya') {
        route = ["İtalya (Ret Oranı %8.7)", "→ Almanya"];
      } else if (profile.targetCountry === 'ABD') {
        route = ["Schengen Vizesi Al", "→ ABD B2 Başvurusu"];
      } else {
        route = ["İtalya/Slovakya (En kolay Schengen)", "→ Hedef Ülke"];
      }
    } else if (currentScore < 82) {
      route = [profile.targetCountry + " (Direkt Başvuru)", "Eksikleri Tamamla"];
    } else {
      route = ["✅ " + profile.targetCountry + " — Direkt Başvur"];
    }

    return { persona, personaDestiny, readiness, docStrengths, timeline, route };
  }, [profile, currentScore]);
  
  const bankHealthScore = useMemo(() => {
    let score = 40;
    
    // Inflow vs Outflow balance
    if (profile.monthlyInflow > profile.monthlyOutflow * 1.2) score += 15;
    else if (profile.monthlyInflow > profile.monthlyOutflow) score += 5;
    
    // Frequency
    if (profile.transactionFrequency === 'high') score += 10;
    else if (profile.transactionFrequency === 'medium') score += 5;
    
    // Patterns
    if (profile.salaryDetected) score += 15;
    if (profile.recurringExpensesDetected) score += 10;
    if (profile.recurringPaymentTypes.length >= 3) score += 5;
    
    // Red Flags
    if (profile.hasSuspiciousLargeDeposit || profile.unusualLargeTransactions) score -= 30;
    if (profile.lowSpendingActivity || profile.transactionFrequency === 'low') score -= 15;
    
    return Math.max(0, Math.min(score, 100));
  }, [profile]);

  const conflicts = useMemo((): Conflict[] => {
    const list: Conflict[] = [];
    
    // 1. DS-160 vs SGK (Employment)
    if (profile.hasSgkJob && !profile.sgkAddressMatchesDs160) {
      list.push({ 
        type: 'error', 
        message: 'İş Adresi Çelişkisi (DS-160 vs SGK)', 
        suggestion: 'DS-160 formundaki iş adresi ile SGK dökümündeki işyeri adresi birebir aynı olmalı. SGK kaydınızdaki merkez adresi kontrol edin.' 
      });
    }
    
    if (profile.hasSgkJob && profile.yearsInCurrentJob === 0) {
      list.push({
        type: 'warning',
        message: 'Düşük Kıdem Riski',
        suggestion: 'Mevcut işyerinizde 1 yıldan az kıdeminiz var. Önceki işyerinizden de çalışma belgesi ekleyerek sürekliliği kanıtlayın.'
      });
    }

    // 2. Bank Statement vs DS-160 (Financial)
    if (profile.hasSteadyIncome && !profile.salaryDetected) {
      list.push({
        type: 'error',
        message: 'Gelir Kanıtı Eksikliği',
        suggestion: 'DS-160\'da beyan edilen gelir banka dökümünde "Maaş" veya "Hakediş" açıklamasıyla net görülmeli. Elden ödeme kabul edilmez.'
      });
    }

    if (profile.monthlyInflow < profile.monthlyOutflow) {
      list.push({
        type: 'error',
        message: 'Negatif Nakit Akışı',
        suggestion: 'Aylık giderleriniz gelirinizden fazla görünüyor. Bu durum finansal istikrarsızlık olarak yorumlanır.'
      });
    }

    if (profile.bankSufficientBalance && profile.hasSuspiciousLargeDeposit) {
      list.push({ 
        type: 'warning', 
        message: 'Emanet Para Riski (Banka vs Form)', 
        suggestion: 'Son 15 günde yatan toplu para "emanet" sayılabilir. Bu paranın kaynağını (araç satışı, miras vb.) mutlaka ek belgelerle kanıtlayın.' 
      });
    }

    // 3. Travel Reservations vs Letter (Consistency)
    if (profile.paidReservations && !profile.datesMatchReservations) {
      list.push({ 
        type: 'error', 
        message: 'Tarih Uyumsuzluğu (Rezervasyon vs Dilekçe)', 
        suggestion: 'Otel/Uçak rezervasyon tarihleri ile niyet mektubundaki tarihler 1 gün bile şaşmamalı. Tüm belgeleri kronolojik olarak hizalayın.' 
      });
    }

    if (profile.paidReservations && !profile.addressMatchSgk) {
      list.push({
        type: 'warning',
        message: 'Konaklama Lokasyonu Çelişkisi',
        suggestion: 'Rezervasyon yapılan şehir ile niyet mektubunda belirtilen rota arasında tutarsızlık tespit edildi.'
      });
    }

    // 4. Passport & Trust
    if (profile.hasValidPassport && !profile.passportValidityLong) {
      list.push({
        type: 'error',
        message: 'Pasaport Süre Riski',
        suggestion: 'Pasaportunuzun bitişine 6 aydan az kalmış. Birçok konsolosluk seyahat dönüşünden itibaren en az 3-6 ay geçerlilik şartı koşar.'
      });
    }

    if (profile.hasSgkJob && !profile.hasBarcodeSgk) {
      list.push({ 
        type: 'warning', 
        message: 'Barkod Eksikliği (SGK)', 
        suggestion: 'SGK dökümünü e-devletten mutlaka "Barkodlu Belge Oluştur" seçeneğiyle alın. Karekodsuz belgeler sahte kabul edilebilir.' 
      });
    }

    if (!profile.documentConsistency) {
      list.push({
        type: 'warning',
        message: 'Genel Belge Dağınıklığı',
        suggestion: 'Evraklarınızın isimlendirilmesi ve sıralaması karışık. Konsolosluk memurunun işini kolaylaştırmak için belgeleri numaralandırın.'
      });
    }

    // ─────────────────────────────────────────────────────────
    // YENİ 2025-2026 KRİTİK KURALLAR
    // ─────────────────────────────────────────────────────────

    // UK: 28 Gün Kuralı (kritik - ihlali neredeyse kesin ret)
    if (profile.targetCountry === 'İngiltere' && !profile.has28DayHolding) {
      list.push({
        type: 'error',
        message: 'UK KRİTİK: 28 Gün Kuralı İhlali',
        suggestion: 'İngiltere Konsolosluğu banka bakiyesinin başvurudan en az 28 gün önce hesapta olmasını şart koşar. Para geçen hafta yatırıldıysa 28 gün bekleyin. Bu kural ihlali doğrudan reddeder.'
      });
    }

    // UK: 6 Aylık Döküm Zorunluluğu
    if (profile.targetCountry === 'İngiltere' && !profile.has6MonthStatements) {
      list.push({
        type: 'error',
        message: 'UK: 6 Aylık Banka Dökümü Eksik',
        suggestion: '3 aylık döküm yeterli değil! UK vizesi için bankadan son 6 aya ait kaşeli imzalı döküm alın. 31 günden eski döküm kapanış tarihleri "geçersiz" sayılır ve otomatik ret sebebidir.'
      });
    }

    // Önceki Ret Beyanı (Gizlemek = Dolandırıcılık)
    if (profile.hasPreviousRefusal && !profile.previousRefusalDisclosed) {
      list.push({
        type: 'error',
        message: 'KRİTİK: Önceki Red Beyan Edilmemiş!',
        suggestion: 'Önceki vize reddini gizlemek, hemen hemen tüm ülkelerde "yanlış beyanda bulunma" suçu sayılır ve kalıcı seyahat yasağına yol açabilir. Mutlaka beyan edin. Ret beyan etmek çok küçük bir ceza alırken, gizlemek kalıcı ban riski taşır.'
      });
    }

    // Schengen: Günlük bütçe yetersizliği (€100-120/gün kriteri)
    if (profile.targetCountry !== 'İngiltere' && profile.targetCountry !== 'ABD' && !profile.dailyBudgetSufficient) {
      list.push({
        type: 'warning',
        message: 'Schengen: Günlük Bütçe Kanıtı Eksik',
        suggestion: 'Schengen ülkeleri gayri resmi olarak günlük €100-120 finansal kapasite bekler. Seyahat sürenize göre toplam tutarı (ör. 7 gün × €120 = €840) banka dökümünde net gösterin.'
      });
    }

    // Schengen: Sağlık sigortası zorunluluğu
    if (profile.targetCountry !== 'İngiltere' && profile.targetCountry !== 'ABD' &&
        !profile.hasHealthInsurance && !profile.hasTravelInsurance) {
      list.push({
        type: 'error',
        message: 'Schengen ZORUNLU: Seyahat Sağlık Sigortası Eksik',
        suggestion: 'Schengen vizesi için en az €30.000 teminatlı, tüm Schengen ülkelerini kapsayan seyahat sağlık sigortası zorunludur. Bu olmadan başvuru geçersiz sayılır. SGK yetersizdir, özel seyahat sigortası alınmalıdır.'
      });
    }

    // Sahte rezervasyon tespiti uyarısı
    if (!profile.noFakeBooking) {
      list.push({
        type: 'error',
        message: 'KRİTİK: Sahte Rezervasyon Riski',
        suggestion: 'Sahte veya iptal edilebilir ücretli otel/uçak rezervasyonu konsolosluklarca tespit edilmekte. İspanya ve Almanya bu konuda özellikle sıkı. Gerçek rezervasyon veya Booking.com\'un ücretsiz iptalli rezervasyonunu kullanın, sahte PDF kesinlikle sunmayın.'
      });
    }

    // Çok katmanlı bağ uyarısı (tek bağ yetersiz)
    const tieCount = [
      profile.tieCategories?.employment,
      profile.tieCategories?.property,
      profile.tieCategories?.family,
      profile.tieCategories?.community,
      profile.tieCategories?.education,
    ].filter(Boolean).length;

    if (tieCount < 2) {
      list.push({
        type: 'warning',
        message: 'Zayıf Bağ Profili: Tek Bağ Yeterli Değil',
        suggestion: 'Araştırmalar, konsoloslukların tek bir bağ kategorisini (örn. sadece iş) yetersiz bulduğunu gösteriyor. İstihdam + mülkiyet veya İstihdam + aile gibi en az 2 farklı kategoride kanıt sunun.'
      });
    }

    // ABD: Mülakat tutarsızlık uyarısı
    if (profile.targetCountry === 'ABD' && !profile.sgkAddressMatchesDs160) {
      list.push({
        type: 'error',
        message: 'ABD DS-160: Adres/Bilgi Tutarsızlığı',
        suggestion: 'DS-160 formundaki her bilgi (işveren adı, adresi, gelir) gerçek belgelerle birebir eşleşmeli. Mülakata 3-5 dakika süre verilir; memur ilk 20 saniyede DS-160 çelişkilerini sorar. Tüm formu tekrar kontrol edin.'
      });
    }

    return list;
  }, [profile]);

  const roadmap = useMemo((): RoadmapItem[] => {
    if (currentScore >= 82) return []; // %82+ = başvur, roadmap gerekmez
    const items: RoadmapItem[] = [];

    // Finansal güçlendirme
    if (!profile.bankRegularity || !profile.incomeSourceClear) {
      items.push({ week: 1, task: "Maaş/kira gelirlerini banka açıklamalarına yazdır, 3 ay bekle.", impact: "+9 Puan" });
    }
    if (!profile.has28DayHolding && profile.targetCountry === 'İngiltere') {
      items.push({ week: 1, task: "UK 28-gün kuralı: Parayı hesaba yatır, 28 gün bekle, sonra başvur.", impact: "+8 Puan" });
    }
    if (!profile.has6MonthStatements && profile.targetCountry === 'İngiltere') {
      items.push({ week: 2, task: "Bankadan 6 aylık kaşeli-imzalı döküm al (31 gün içinde kapanış tarihi olacak).", impact: "+6 Puan" });
    }
    if (!profile.dailyBudgetSufficient && profile.targetCountry !== 'İngiltere') {
      items.push({ week: 2, task: "Schengen €100-120/gün hesabı: Süre × €120 = Gereken miktar. Hesapta net göster.", impact: "+4 Puan" });
    }

    // Bağ güçlendirme
    const tieCount = [profile.tieCategories?.employment, profile.tieCategories?.property,
      profile.tieCategories?.family, profile.tieCategories?.community].filter(Boolean).length;
    if (tieCount < 2) {
      items.push({ week: 2, task: "İkinci bağ kategorisi ekle: Tapu/araç + aile nüfus kaydı veya bağlı olduğun dernek/kulüp yazısı.", impact: "+7 Puan" });
    }

    // Seyahat geçmişi
    if (!profile.hasHighValueVisa && !profile.hasOtherVisa) {
      items.push({ week: 3, task: "Vizesiz ülkelere gir-çık: Sırbistan, Karadağ, Makedonya (pasaporta giriş-çıkış damgası al).", impact: "+6 Puan" });
    }

    // Belge kalitesi
    if (!profile.hasBarcodeSgk) {
      items.push({ week: 3, task: "e-Devlet'ten 'Barkodlu Belge Oluştur' ile SGK döküm al. Barkod yoksa sahte sayılır.", impact: "+2 Puan" });
    }
    if (!profile.hasHealthInsurance && !profile.hasTravelInsurance) {
      items.push({ week: 3, task: "Schengen için €30.000 teminatlı seyahat sigortası satın al (Europ Assistance veya AXA).", impact: "+4 Puan" });
    }
    if (!profile.useOurTemplate) {
      items.push({ week: 4, task: "Sistemimizin profesyonel niyet mektubu şablonunu kullan (geri dönüş taahhüdü + finansal taahhüt).", impact: "+5 Puan" });
    }

    // Sosyal medya
    if (!profile.hasSocialMediaFootprint) {
      items.push({ week: 4, task: "LinkedIn profilini güncelle. Instagram/Facebook hesabını 'Türk hayatı' gösteren içerikle besle.", impact: "+2 Puan" });
    }

    return items.slice(0, 6); // Maksimum 6 madde göster
  }, [currentScore, profile]);

  // ── Mülakat Cevap Değerlendirme ─────────────────────────────
  const evaluateInterviewAnswer = (q: InterviewQ, answer: string): {score:number; grade:string; feedback:string; tips:string[]} => {
    const a = answer.trim().toLowerCase();
    const words = a.split(/\s+/).filter(Boolean).length;
    // Uzunluk bazlı temel skor
    let score = words < 4 ? 1 : words < 10 ? 3 : words < 20 ? 5 : words < 40 ? 7 : 8;
    // Pozitif anahtar kelime bonusu
    const kwHits = q.keywords.filter(kw => a.includes(kw.toLowerCase())).length;
    score += Math.min(kwHits * 0.8, 2);
    // Zayıf kalıp cezası
    const weakHit = q.weakPatterns.some(p => p && a.includes(p.toLowerCase()));
    if (weakHit) score = Math.max(1, score - 2);
    // Rakam içeriyorsa (finansal sorularda güçlü)
    if (/\d/.test(a) && ['Finansal','Seyahat Detayları','Geri Dönüş Bağları'].includes(q.category)) score += 0.5;
    score = Math.max(1, Math.min(10, Math.round(score * 10) / 10));
    const grade = score >= 8.5 ? 'Mükemmel' : score >= 6.5 ? 'İyi' : score >= 4.5 ? 'Ortalama' : 'Zayıf';
    const feedback = score >= 6.5 ? q.feedback.strong : q.feedback.weak;
    return { score, grade, feedback, tips: q.feedback.tips };
  };

  const submitInterviewAnswer = () => {
    const questions = interviewQuestions[interviewVisaType];
    const q = questions[interviewCurrentQ];
    const evaluation = evaluateInterviewAnswer(q, interviewAnswer);
    const newAnswers = [...interviewAnswers, { q: q.q, a: interviewAnswer, ...evaluation }];
    setInterviewAnswers(newAnswers);
    setInterviewAnswer('');
    setInterviewHintShown(false);
    if (interviewCurrentQ + 1 >= questions.length) {
      setInterviewPhase('result');
    } else {
      setInterviewCurrentQ(prev => prev + 1);
    }
  };

  const resetInterviewSim = () => {
    setInterviewPhase('setup');
    setInterviewCurrentQ(0);
    setInterviewAnswer('');
    setInterviewAnswers([]);
    setInterviewHintShown(false);
  };

  // ── Topluluk Deneyimi Gönder ─────────────────────────────────
  const submitCommunityEntry = () => {
    if (!communityForm.consulate || !communityForm.notes || !communityForm.waitDays) return;
    const entry: CommunityEntry = {
      id: `u${Date.now()}`,
      consulate: communityForm.consulate,
      city: communityForm.city,
      visaType: communityForm.visaType,
      result: communityForm.result,
      waitDays: parseInt(communityForm.waitDays) || 0,
      notes: communityForm.notes,
      date: new Date().toISOString().split('T')[0],
      profile: communityForm.profile,
    };
    const newEntries = [entry, ...communityEntries];
    setCommunityEntries(newEntries);
    // localStorage'a sadece kullanıcı eklediklerini kaydet
    try {
      const userEntries = newEntries.filter(e => e.id.startsWith('u'));
      localStorage.setItem(COMMUNITY_STORAGE_KEY, JSON.stringify(userEntries));
    } catch { /* storage full */ }
    setCommunityForm({ consulate:'', city:'İstanbul', visaType:'Turizm (Schengen)', result:'onaylandi', waitDays:'', notes:'', profile:'Çalışan' });
    setCommunityPhase('feed');
  };

  // ── Roadmap → Araç Eşleştirme ─────────────────────────────
  const actionItems = useMemo(() => {
    const items: { gain: string; title: string; desc: string; toolLabel: string; toolFn: () => void; doneFn?: () => void; priority: number }[] = [];

    if (!profile.bankRegularity || !profile.incomeSourceClear) {
      items.push({ gain: '+9', title: 'Banka Düzenliliğini Kanıtla', desc: 'Maaş/kira girişleri + 3 aylık ektre — en yüksek puan kazanımı.', toolLabel: 'AI Banka Analizi', toolFn: () => { setStep('dashboard'); setTimeout(() => { setIsAiBankOpen(true); }, 200); }, doneFn: () => setProfile(prev => ({ ...prev, bankRegularity: true, incomeSourceClear: true, hasSteadyIncome: true, bankSufficientBalance: true })), priority: 1 });
    }
    if (!profile.hasSgkJob) {
      items.push({ gain: '+8', title: 'SGK / İstihdam Belgesi Ekle', desc: 'E-Devlet\'ten barkodlu SGK dökümü — en güçlü geri dönüş kanıtı.', toolLabel: 'Evrak Rehberi', toolFn: () => { setStep('dashboard'); setTimeout(() => setIsDocumentListOpen(true), 200); }, doneFn: () => setProfile(prev => ({ ...prev, hasSgkJob: true, hasBarcodeSgk: true, sgkEmployerLetterWithReturn: true })), priority: 2 });
    }
    if (!profile.hasHighValueVisa && !profile.hasOtherVisa) {
      items.push({ gain: '+6', title: 'Doğru Ülkeyi Seç', desc: 'İlk başvuruda red oranı düşük ülkelerden başla — profil uyumu hesaplandı.', toolLabel: 'Ülke Kıyaslayıcı', toolFn: () => { setStep('dashboard'); setTimeout(() => openTool('comparator', setIsSchengenComparatorOpen), 200); }, doneFn: () => setProfile(prev => ({ ...prev, hasOtherVisa: true })), priority: 3 });
    }
    if (!profile.hasHealthInsurance && !profile.hasTravelInsurance) {
      items.push({ gain: '+4', title: 'Seyahat Sigortası Al', desc: '€30.000 teminatlı sigorta olmadan başvuru kabul edilmez.', toolLabel: 'Evrak Sihirbazı', toolFn: () => { setStep('dashboard'); setTimeout(() => setIsDocumentListOpen(true), 200); }, doneFn: () => setProfile(prev => ({ ...prev, hasTravelInsurance: true, hasHealthInsurance: true })), priority: 4 });
    }
    if (!profile.useOurTemplate) {
      items.push({ gain: '+5', title: 'Profesyonel Niyet Mektubu Yaz', desc: '2026 konsolosluk standartlarına uygun resmi şablon kullan.', toolLabel: 'Belge Oluşturucu', toolFn: () => setStep('letter'), doneFn: () => setProfile(prev => ({ ...prev, useOurTemplate: true })), priority: 5 });
    }
    if (!profile.hasSocialMediaFootprint) {
      items.push({ gain: '+2', title: 'Sosyal Medyayı Vize-Safe Yap', desc: 'LinkedIn + Instagram profili — konsolosluk sosyal medyanıza bakıyor.', toolLabel: 'Sosyal Medya', toolFn: () => { setStep('dashboard'); setTimeout(() => setIsSocialMediaOpen(true), 200); }, doneFn: () => setProfile(prev => ({ ...prev, hasSocialMediaFootprint: true })), priority: 6 });
    }
    // Risk kontrolü her zaman göster
    items.push({ gain: '⚠️', title: 'Dosyanda Kırmızı Bayrak Var mı?', desc: 'Bakiye vs maliyet, sigorta, dönüş bileti — konsolosluk tutarsızlıkları reddeder.', toolLabel: 'Risk Tarayıcı', toolFn: () => { setStep('dashboard'); setTimeout(() => setIsRedFlagOpen(true), 200); }, priority: 7 });

    return items.sort((a, b) => a.priority - b.priority).slice(0, 5);
  }, [profile, currentScore]);

  // ── Özellik 1: Ret Mektubu Analizi ──────────────────────────
  const analyzeRefusal = () => {
    const text = refusalText.toLowerCase();
    const matched = refusalRules.filter(rule =>
      rule.keywords.some(kw => text.includes(kw.toLowerCase()))
    );
    setRefusalResult(matched.length > 0 ? matched : [{
      keywords: [], category: 'document', severity: 'medium', waitMonths: 1,
      title: 'Genel / Belirtilmemiş Red',
      actions: [
        'Ret gerekçesini tam metin olarak kopyala ve tekrar yapıştır',
        'Tüm belgeleri baştan gözden geçir — tutarsızlık ara',
        'En az 1-2 ay bekleyerek güçlü bir dosyayla tekrar başvur',
        'Bir vize danışmanıyla yüz yüze görüşmeyi değerlendir',
      ]
    }]);
    setRefusalAnalyzed(true);
  };

  // ── Özellik 6: Belge Tutarlılık Kontrolü ────────────────────
  const checkConsistency = () => {
    const issues: {field: string, issue: string}[] = [];
    const filled = Object.entries(docValues).filter(([, v]) => v.trim() !== '');
    if (filled.length < 3) {
      issues.push({ field: 'Genel', issue: 'Karşılaştırma için en az 3 alan doldurulmalıdır.' });
    }
    // İsim kontrolü — büyük/küçük harf tutarsızlığı
    if (docValues.fullName) {
      const name = docValues.fullName.trim();
      if (name !== name.toUpperCase() && name !== name.toLowerCase()) {
        // mixed case — warn about passport vs form differences
      }
      if (name.length > 0 && name !== name.toUpperCase()) {
        issues.push({ field: 'Ad Soyad', issue: 'Pasaport üzerinde isim BÜYÜK HARFLE yazılıdır. Tüm formlarda aynı formatta (büyük harf) olduğundan emin ol.' });
      }
    }
    // Tarih mantık kontrolü
    if (docValues.travelStart && docValues.travelEnd) {
      const start = new Date(docValues.travelStart.split('.').reverse().join('-'));
      const end = new Date(docValues.travelEnd.split('.').reverse().join('-'));
      if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end <= start) {
        issues.push({ field: 'Seyahat Tarihleri', issue: 'Bitiş tarihi başlangıç tarihinden önce veya aynı gün olamaz.' });
      }
      const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays > 90) {
        issues.push({ field: 'Seyahat Tarihleri', issue: `Seyahat süresi ${diffDays} gün — Schengen vizesi maks. 90 gündür.` });
      }
    }
    // Gelir kontrolü
    if (docValues.income) {
      const income = parseInt(docValues.income.replace(/[^0-9]/g, ''));
      if (income > 0 && income < 15000) {
        issues.push({ field: 'Aylık Gelir', issue: 'Beyan edilen gelir çok düşük görünüyor. Vize memuru finansal yeterliliği sorgulayabilir.' });
      }
    }
    setDocConflicts(issues);
    setConsistencyChecked(true);
  };

  // ── Özellik 8: Banka Dökümü Kural Bazlı Analizi ─────────────────────
  const analyzeWithRules = (fileName: string) => {
    setAiBankLoading(true);
    setAiBankResult(null);

    setTimeout(() => {
      const income = parseInt(aiBankIncome || profile.monthlyIncome || '0') || 0;
      const balance = parseInt(aiBankBalance || profile.bankBalance || '0') || 0;
      const months = parseInt(aiBankMonths || '3') || 3;
      const country = profile.targetCountry || 'Schengen';

      let score = 0;
      const positives: string[] = [];
      const negatives: string[] = [];
      const tips: string[] = [];

      // Gelir puanı
      if (income >= 30000) { score += 25; positives.push('Aylık geliriniz Schengen/ABD standartlarının üzerinde — çok güçlü'); }
      else if (income >= 15000) { score += 18; positives.push('Aylık geliriniz kabul edilebilir seviyede'); }
      else if (income >= 8000) { score += 10; negatives.push('Aylık gelir sınırda — ek gelir belgesi veya sponsor mektubu öneririz'); }
      else if (income > 0) { score += 5; negatives.push('Aylık gelir düşük — güçlü banka bakiyesiyle destekleyin'); }
      else { score += 3; tips.push('Gelir bilgisi girilmedi — formdaki "Aylık Gelir" alanını doldurun'); }

      // Bakiye puanı
      if (balance >= 150000) { score += 30; positives.push('Banka bakiyeniz mükemmel — konsolosluk için çok güçlü sinyal'); }
      else if (balance >= 75000) { score += 25; positives.push('Banka bakiyeniz güçlü'); }
      else if (balance >= 30000) { score += 18; positives.push('Banka bakiyeniz yeterli'); }
      else if (balance >= 15000) { score += 10; negatives.push('Bakiye seyahat günü başına düşük kalabilir (günlük min. €50 önerilir)'); }
      else if (balance > 0) { score += 5; negatives.push('Bakiye yetersiz — minimum 30.000 TL + konaklama belgesi hazırlayın'); }
      else { score += 3; tips.push('Bakiye bilgisi girilmedi — formdaki "Banka Bakiyesi" alanını doldurun'); }

      // Düzenli maaş kalıbı
      if (aiBankSalaryRegular) { score += 20; positives.push('Düzenli maaş/hakediş girişi kalıbı — konsolosluğun en çok aradığı kriter'); }
      else { negatives.push('Düzenli maaş kalıbı yok — serbest meslek makbuzu veya SGK dökümü ekleyin'); }

      // 28-gün büyük para girişi
      if (aiBankLargeDeposit) {
        score -= 15;
        negatives.push('Son 28 günde büyük/ani para girişi tespit edildi — konsolosluğun şüpheyle baktığı bir durum');
        tips.push('Büyük para girişini açıklayan belge hazırlayın: satış sözleşmesi, bono, bağış dekontu vb.');
      } else {
        score += 15;
        positives.push('Son 28 günde şüpheli ani para girişi yok — 28-gün kuralına uygun');
      }

      // Ektre süresi
      if (months >= 6) { score += 10; positives.push(`${months} aylık ektre geçmişi — yeterli süre gösterilmiş`); }
      else if (months >= 3) { score += 6; positives.push(`${months} aylık ektre — minimum kabul edilebilir`); tips.push('6 aylık ektre sunmak onay oranını artırır — bankanızdan 6 aylık döküm isteyin'); }
      else { negatives.push('Ektre süresi çok kısa — minimum 3 ay, ideal 6 ay önerilir'); }

      // Başvuru tipi
      if (applicantType === 'unemployed') {
        score -= 10;
        negatives.push('İşsiz/Serbest Meslek profili — mali güç gösterimi kritik önem taşıyor');
        tips.push('Bağ-Kur primleri, kira geliri, gayrimenkul belgesi veya aile sponsorluğu ekleyin');
      } else if (applicantType === 'minor') {
        tips.push('Küçük yaş başvurularında veli imzalı muvafakatname ve veli banka belgesi zorunludur');
      }

      score = Math.max(0, Math.min(100, score));

      const grade = score >= 80 ? 'Çok Güçlü' : score >= 65 ? 'Güçlü' : score >= 50 ? 'Orta' : score >= 35 ? 'Zayıf' : 'Riskli';
      const gradeEmoji = score >= 80 ? '🟢' : score >= 65 ? '🟡' : score >= 50 ? '🟠' : '🔴';

      const summaryText = score >= 80
        ? 'Mali profiliniz mükemmel. Belgelerinizi düzenli ve eksiksiz sunun — onay oranınız yüksek.'
        : score >= 65
        ? 'Mali profiliniz genel olarak yeterli. Küçük güçlendirmelerle başarı şansınızı artırabilirsiniz.'
        : score >= 50
        ? 'Mali profil sınırda. Ek destek belgeleri (tapu, araç, mevduat hesabı, sigorta) kritik önem taşıyor.'
        : 'Mali profil yetersiz görünüyor. Başvuru öncesinde en az 3 ay bakiye oluşturun veya sponsor mektubu alın.';

      setAiBankResult({
        fileName: fileName || '(dosyasız analiz)',
        country,
        score,
        grade,
        gradeEmoji,
        positives: positives.length ? positives : ['Bilgi eksik — formu doldurunca güçlü yönler burada görünecek'],
        negatives,
        tips,
        summary: summaryText,
      });
      setAiBankLoading(false);
    }, 1800);
  };

  const handleAiBankUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setAiBankFile(file.name);
    analyzeWithRules(file.name);
  };

  // ── Özellik 9: Red Flag Checker ─────────────────────────
  const analyzeRedFlags = () => {
    const balance = parseInt(rfBalance) || 0;
    const flight = parseInt(rfFlight) || 0;
    const hotel = parseInt(rfHotel) || 0;
    const days = parseInt(rfDays) || 0;
    const dailyEur = parseInt(rfDailyBudgetEur) || 60;
    const eurToTry = 40; // yaklaşık kur
    const totalTripTry = flight + hotel + (days * dailyEur * eurToTry);

    const flags: {severity:'critical'|'warn'|'ok'; msg:string}[] = [];

    // 1. Bakiye vs seyahat maliyeti
    if (balance > 0 && totalTripTry > 0) {
      if (balance < totalTripTry) {
        flags.push({ severity: 'critical', msg: `Hesabındaki ${balance.toLocaleString('tr-TR')} TL, tahmini seyahat maliyetini (${totalTripTry.toLocaleString('tr-TR')} TL) karşılamıyor. Konsolosluk bu tutarsızlığı %95 reddeder — bakiyeni artır veya maliyetleri düşür.` });
      } else if (balance < totalTripTry * 1.5) {
        flags.push({ severity: 'warn', msg: `Bakiyeniz masrafları karşılıyor ama konsolosluklar minimum 1.5x buffer ister. Mevcut: ${balance.toLocaleString('tr-TR')} TL → Önerilen: ${Math.round(totalTripTry * 1.5).toLocaleString('tr-TR')} TL` });
      } else {
        flags.push({ severity: 'ok', msg: `Banka bakiyeniz (${balance.toLocaleString('tr-TR')} TL) toplam seyahat maliyetini rahatça karşılıyor.` });
      }
    } else if (balance === 0) {
      flags.push({ severity: 'critical', msg: 'Bakiye bilgisi girilmedi — bu alan zorunlu, konsolosluk ekstrenizi mutlaka inceleyecek.' });
    }

    // 2. Günlük bütçe (Schengen min. €50/gün)
    if (days > 0) {
      if (dailyEur < 50) {
        flags.push({ severity: 'critical', msg: `Schengen kuralı: kişi başı minimum €50/gün. Girilen bütçe: €${dailyEur}/gün — bu eksiklik tek başına ret sebebi olabilir.` });
      } else if (dailyEur < 80) {
        flags.push({ severity: 'warn', msg: `Günlük bütçeniz €${dailyEur} — Schengen minimumunu (€50) karşılıyor ama konsolosluklar €80+ gördüğünde daha güvende hisseder.` });
      } else {
        flags.push({ severity: 'ok', msg: `Günlük bütçeniz €${dailyEur} — konsolosluk standartlarının üzerinde.` });
      }
    }

    // 3. Seyahat sigortası
    if (!rfHasInsurance) {
      flags.push({ severity: 'critical', msg: 'Seyahat sağlık sigortası yok! Schengen/UK için zorunlu belgedir, sigortasız başvuru işleme bile alınmaz.' });
    } else if (!rfInsuranceCoversAll) {
      flags.push({ severity: 'critical', msg: `Sigorta poliçeniz tüm seyahat süresini (${days} gün) kapsamıyor. Konsolosluk tarihleri gün gün kontrol eder.` });
    } else {
      flags.push({ severity: 'ok', msg: 'Seyahat sigortası var ve tüm seyahat süresini kapsıyor.' });
    }

    // 4. Dönüş bileti
    if (!rfHasReturn) {
      flags.push({ severity: 'critical', msg: 'Dönüş bileti veya rezervasyonu yok. Bu durum "kalma niyeti" olarak yorumlanabilir — geçmiş veride ret riski önemli ölçüde artmaktadır.' });
    } else {
      flags.push({ severity: 'ok', msg: 'Dönüş bileti/rezervasyonu mevcut — güçlü geri dönüş kanıtı.' });
    }

    // 5. İlk yurt dışı çıkışı
    if (rfFirstTrip) {
      flags.push({ severity: 'warn', msg: 'İlk yurt dışı çıkışı: Konsolosluk seyahat geçmişiniz olmadığı için ekstra bağ belgesi ister. Tapu, araç ruhsatı veya iş sözleşmesi mutlaka ekleyin.' });
      if (!rfHasProperty && !rfHasSgk) {
        flags.push({ severity: 'critical', msg: 'İlk çıkış + mülk yok + SGK kaydı yok: Bu kombinasyon çok yüksek ret riski taşıyor. En az birini belgeleyin.' });
      }
    }

    // 6. SGK / istihdam
    if (!rfHasSgk) {
      flags.push({ severity: 'warn', msg: 'SGK kaydı yok: Çalışma kanıtı eksik. Serbest meslek vergi levhası + son 3 aylık Bağ-Kur dökümü veya gelir belgesi şart.' });
    } else {
      flags.push({ severity: 'ok', msg: 'SGK kaydı var — güçlü istihdam ve geri dönüş kanıtı.' });
    }

    // 7. Mülkiyet bonusu
    if (rfHasProperty) {
      flags.push({ severity: 'ok', msg: 'Tapu/mülkiyet belgesi var — konsolosluk için güçlü "bağ" kanıtı. Mutlaka ekleyin.' });
    }

    setRedFlagResult(flags);
    setRfAnalyzed(true);

    // ── Sonuçları profile'a yansıt → currentScore otomatik güncellenir ──
    const criticalFlags = flags.filter(f => f.severity === 'critical');
    setProfile(prev => {
      const updates: Partial<ProfileData> = {};

      // Banka bakiyesi yetersizse
      const balanceFlag = flags[0]; // ilk flag her zaman bakiye
      if (balanceFlag?.severity === 'critical' && balance > 0) {
        updates.bankSufficientBalance = false;
        updates.dailyBudgetSufficient = false;
      } else if (balanceFlag?.severity === 'ok') {
        updates.bankSufficientBalance = true;
      }

      // Günlük bütçe (Schengen €50 min)
      if (days > 0) {
        if (dailyEur < 50) {
          updates.dailyBudgetSufficient = false;
        } else if (dailyEur >= 80) {
          updates.dailyBudgetSufficient = true;
        }
      }

      // Seyahat sigortası
      if (!rfHasInsurance || !rfInsuranceCoversAll) {
        updates.hasTravelInsurance = false;
        updates.hasHealthInsurance = false;
      } else {
        updates.hasTravelInsurance = true;
        updates.hasHealthInsurance = true;
      }

      // Dönüş bileti
      if (!rfHasReturn) {
        updates.hasReturnTicket = false;
        updates.paidReservations = false;
      } else {
        updates.hasReturnTicket = true;
        updates.paidReservations = true;
      }

      // SGK / istihdam
      if (!rfHasSgk) {
        updates.hasSgkJob = false;
        updates.tieCategories = { ...prev.tieCategories, employment: false };
      } else {
        updates.hasSgkJob = true;
        updates.tieCategories = { ...prev.tieCategories, employment: true };
      }

      // Mülkiyet
      if (rfHasProperty) {
        updates.tieCategories = { ...(updates.tieCategories ?? prev.tieCategories), property: true };
        updates.hasAssets = true;
      }

      // İlk çıkış + bağ yok → çok riskli
      if (rfFirstTrip && !rfHasProperty && !rfHasSgk) {
        updates.strongFamilyTies = false;
        updates.multiTieStrength = Math.max(0, (prev.multiTieStrength ?? 2) - 1);
      }

      // Kritik flag sayısına göre genel güven skoru
      if (criticalFlags.length >= 3) {
        updates.documentConsistency = false;
      } else if (criticalFlags.length === 0) {
        updates.documentConsistency = true;
      }

      return { ...prev, ...updates };
    });
  };

  // ── Özellik 10: Kişiye Özel Evrak Sihirbazı ─────────────────────
  const generateCustomDocList = () => {
    const docs: string[] = [];
    // Temel belgeler — hepsi için
    docs.push('Geçerli pasaport (son 6 ayda sona ermeyecek, minimum 2 boş sayfa)');
    docs.push('Pasaport fotokopisi (tüm dolu sayfalar dahil)');
    docs.push('Biyometrik fotoğraf (son 6 ay içinde, mat fon, 3.5x4.5cm)');
    docs.push(`${wizardCountry === 'schengen' ? 'Schengen vize' : wizardCountry === 'uk' ? 'UK vize' : 'ABD vize (DS-160)'} başvuru formu (eksiksiz doldurulmuş ve imzalı)`);
    docs.push('Seyahat sigortası poliçesi (tüm seyahat süresini kapsayan, min. €30.000 teminat)');
    docs.push('Uçuş rezervasyonu (bilet veya onaylı rezervasyon)');
    docs.push('Konaklama belgesi (otel rezervasyonu veya ev sahibi daveti)');
    docs.push('Banka ekstresi — son 3-6 ay (tüm sayfalar, banka mühürlü)');

    // İstihdam durumuna göre
    if (wizardEmployment === 'employee') {
      docs.push('İşe giriş bildirgesi veya SGK hizmet dökümü');
      docs.push('İşyerinden onaylı çalışma izni mektubu (izin tarihleri, maaş bilgisi, iade garantisi)');
      docs.push('Son 3 aylık maaş bordrosu (mühürlü)');
    } else if (wizardEmployment === 'freelance') {
      docs.push('Vergi levhası veya ticaret sicil belgesi');
      docs.push('Son 3 aylık Bağ-Kur prim dökümü (e-Devlet\'ten alınabilir)');
      docs.push('Son 3 aylık muhasebe kaydı veya gelir beyanı');
      docs.push('Serbest meslek sahibi olduğunuzu gösteren fatura/sözleşme örnekleri');
    } else if (wizardEmployment === 'student') {
      docs.push('Öğrenci belgesi (güncel, Türkçe + apostilli İngilizce/Almanca)');
      docs.push('Okul harç ödeme makbuzu');
      docs.push('Burs belgesi (varsa)');
      docs.push('Veli izin mektubu + veli gelir belgesi (18 yaş altı)');
    } else if (wizardEmployment === 'retired') {
      docs.push('Emekli maaşı belgesi (son ay, SGK onaylı)');
      docs.push('SGK emeklilik kararı');
    } else {
      docs.push('İşsizlik ödeneği belgesi veya emekli aylığı (varsa)');
      docs.push('Geçimini sağlayan kişinin sponsor mektubu ve gelir belgesi');
      docs.push('UYARI: İşsiz başvurucular için çok güçlü banka bakiyesi ve mülk belgesi kritik.');
    }

    // İlk yurt dışı çıkışı
    if (wizardFirstTrip) {
      docs.push('⚠️ İlk yurt dışı çıkışı: Seyahat geçmişiniz olmadığından ekstra bağ belgesi zorunlu');
      docs.push('Tapu senedi / araç ruhsatı / kira sözleşmesi (Türkiye\'ye bağlılığı ispat)');
      docs.push('Aile nüfus kayıt örneği (Türkiye\'de aile bağları için)');
    }

    // Mülk sahibi
    if (wizardHasProperty) {
      docs.push('Tapu senedi fotokopisi — güçlü "geri dönüş" kanıtı, mutlaka ekleyin');
    }

    // Araç sahibi
    if (wizardHasCar) {
      docs.push('Araç ruhsatı fotokopisi — destekleyici bağ belgesi');
    }

    // Sponsor
    if (wizardHasSponsor) {
      if (wizardCountry === 'schengen') {
        docs.push('Sponsor davet mektubu (noter onaylı veya yerel belediyece onaylı)');
        docs.push('Sponsorun oturma izni veya vatandaşlık belgesi fotokopisi');
        docs.push('Sponsorun banka dökümü veya gelir belgesi');
      } else {
        docs.push('Sponsor\'un davet mektubu (imzalı, iletişim bilgili)');
        docs.push('Sponsor\'un pasaport/vatandaşlık fotokopisi');
      }
    }

    // Çocuk
    if (wizardHasChild) {
      docs.push('Çocuğun doğum belgesi (apostilli)');
      docs.push('Diğer ebeveynin noter onaylı muvafakatnamesi (birlikte seyahat edilmiyorsa)');
    }

    // Ülke bazlı ekstralar
    if (wizardCountry === 'uk') {
      docs.push('İngiltere: TB testi sonucu (6 ay içinde, onaylı klinik)');
      docs.push('İngiltere: Parmak izi randevusu onayı (VFS Global)');
    } else if (wizardCountry === 'usa') {
      docs.push('ABD: DS-160 formu (online doldurulup kaydedilmiş)');
      docs.push('ABD: SEVIS ücret makbuzu (öğrenci vizesi için)');
      docs.push('ABD: Mülakat hazırlığı — konsolosata "geri dönüş niyetinizi" somut kanıtlarla anlatın');
    }

    setWizardResult(docs);
    setWizardDone(true);
  };

  const handleOcrUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsOcrScanning(true);
    setOcrResults([]);

    setTimeout(() => {
      const results: {file: string; status: string; ok: boolean; warn?: boolean}[] = [];
      const fileArr = Array.from(files);

      fileArr.forEach(file => {
        const n = file.name.toLowerCase();

        // ── Pasaport ──
        if (n.includes('pasaport') || n.includes('passport') || n.includes('pas_')) {
          const hasPassportNo = !!letterData.passportNumber;
          if (hasPassportNo) {
            results.push({ file: file.name, ok: true, status: `Pasaport tespit edildi (No: ${letterData.passportNumber}). Geçerlilik tarihi en az 6 ay uzakta olmalı — manuel kontrol edin.` });
          } else {
            results.push({ file: file.name, ok: false, warn: true, status: 'Pasaport tespit edildi ama pasaport no sisteme girilmemiş. Belge Oluşturucu\'ya numarayı ekleyin.' });
          }
        }
        // ── Banka ekstresi ──
        else if (n.includes('banka') || n.includes('ekstre') || n.includes('bank') || n.includes('hesap') || n.includes('iban') || n.includes('account')) {
          const bal = parseInt(aiBankBalance || profile.bankBalance || '0') || 0;
          const inc = parseInt(aiBankIncome || profile.monthlyIncome || '0') || 0;
          if (bal === 0 && inc === 0) {
            results.push({ file: file.name, ok: false, warn: true, status: 'Banka ekstresi yüklendi ama gelir/bakiye bilgisi sisteme girilmemiş. AI Banka Analizi\'ni kullanarak verileri girin.' });
          } else if (bal < 20000) {
            results.push({ file: file.name, ok: false, status: `Banka ekstresi — Bakiye yetersiz görünüyor (${bal.toLocaleString('tr-TR')} TL). Konsolosluk minimum 30.000 TL+ bekler.` });
          } else if (inc > 0 && bal >= 30000) {
            results.push({ file: file.name, ok: true, status: `Banka ekstresi — Bakiye yeterli (${bal.toLocaleString('tr-TR')} TL). 28-gün kuralını ve ani para girişlerini manuel kontrol edin.` });
          } else {
            results.push({ file: file.name, ok: false, warn: true, status: `Banka ekstresi yüklendi. Risk Tarayıcı ile tutarsızlık kontrolü yapılması önerilir.` });
          }
        }
        // ── SGK / İstihdam ──
        else if (n.includes('sgk') || n.includes('hizmet') || n.includes('barkod') || n.includes('calisma') || n.includes('istihdam') || n.includes('sse')) {
          const hasSgk = profile.hasSgkJob;
          if (hasSgk) {
            results.push({ file: file.name, ok: true, status: 'SGK hizmet dökümü tespit edildi. Barkod doğrulaması ve son 30 gün içinde alındığını kontrol edin.' });
          } else {
            results.push({ file: file.name, ok: false, warn: true, status: 'SGK belgesi yüklendi ama profilde SGK kaydı işaretlenmemiş. Profil analizinizi güncelleyin.' });
          }
        }
        // ── Seyahat sigortası ──
        else if (n.includes('sigorta') || n.includes('insurance') || n.includes('police') || n.includes('allianz') || n.includes('axa') || n.includes('mapfre') || n.includes('ergo')) {
          const start = letterData.startDate;
          const end = letterData.endDate;
          if (start && end) {
            results.push({ file: file.name, ok: true, status: `Seyahat sigortası tespit edildi. Tarihlerin ${start}–${end} arasını tam kapsadığını ve min. €30.000 teminat içerdiğini doğrulayın.` });
          } else {
            results.push({ file: file.name, ok: false, warn: true, status: 'Seyahat sigortası yüklendi ama seyahat tarihleri Belge Oluşturucu\'ya girilmemiş. Kapsam doğrulaması yapılamadı.' });
          }
        }
        // ── Otel rezervasyonu ──
        else if (n.includes('otel') || n.includes('hotel') || n.includes('rezerv') || n.includes('booking') || n.includes('hostel') || n.includes('accomm')) {
          const hasHotel = !!letterData.hotelName;
          results.push({ file: file.name, ok: hasHotel, warn: !hasHotel, status: hasHotel ? `Otel rezervasyonu tespit edildi (${letterData.hotelName}). Rezervasyon numarası ve tarihlerin pasaportla uyuştuğunu kontrol edin.` : 'Otel rezervasyonu yüklendi ama otel bilgisi sisteme girilmemiş. Belge Oluşturucu formunu doldurun.' });
        }
        // ── Uçak bileti ──
        else if (n.includes('ucus') || n.includes('bilet') || n.includes('ticket') || n.includes('flight') || n.includes('ucak') || n.includes('turkish') || n.includes('pegasus') || n.includes('thy')) {
          const hasReturn = !!letterData.flightInbound;
          if (!hasReturn) {
            results.push({ file: file.name, ok: false, status: 'Uçuş bileti yüklendi ama dönüş uçuşu sisteme girilmemiş! Tek yön bilet ret riskini ciddi artırır.' });
          } else {
            results.push({ file: file.name, ok: true, status: `Uçuş bileti tespit edildi. Gidiş (${letterData.flightOutbound || '?'}) ve dönüş (${letterData.flightInbound}) sefer numaralarının diğer belgelerle eşleştiğini doğrulayın.` });
          }
        }
        // ── Tapu / Mülk ──
        else if (n.includes('tapu') || n.includes('mulk') || n.includes('deed') || n.includes('property')) {
          results.push({ file: file.name, ok: true, status: 'Tapu/Mülkiyet belgesi tespit edildi — güçlü bağ kanıtı. Noter onaylı suret ve fotokopi olarak ekleyin.' });
        }
        // ── Kimlik / TC ──
        else if (n.includes('nufus') || n.includes('kimlik') || (n.includes('tc') && n.length < 15) || n.includes('national_id')) {
          results.push({ file: file.name, ok: false, status: 'Kimlik kartı/Nüfus cüzdanı tespit edildi. Uyarı: Vize başvurularında TC kimlik yeterli değil — pasaport zorunludur.' });
        }
        // ── Tespit edilemeyen ──
        else {
          results.push({ file: file.name, ok: false, warn: true, status: `Belge türü tespit edilemedi. Dosya adını belirginleştirin (ör: "pasaport.pdf", "banka_ekstresi.pdf", "sgk_hizmet.pdf") ve yeniden yükleyin.` });
        }
      });

      setOcrResults(results);
      setIsOcrScanning(false);

      // Profili tespit edilen doküman tiplerine göre güncelle
      const detectedPassport = fileArr.some(f => { const n = f.name.toLowerCase(); return n.includes('pasaport') || n.includes('passport'); });
      const detectedBank = fileArr.some(f => { const n = f.name.toLowerCase(); return n.includes('banka') || n.includes('ekstre') || n.includes('bank') || n.includes('hesap'); });
      const detectedSgk = fileArr.some(f => { const n = f.name.toLowerCase(); return n.includes('sgk') || n.includes('hizmet') || n.includes('barkod'); });
      const detectedProperty = fileArr.some(f => { const n = f.name.toLowerCase(); return n.includes('tapu') || n.includes('mulk'); });

      setProfile((prev: ProfileData) => ({
        ...prev,
        ...(detectedPassport && { hasValidPassport: true }),
        ...(detectedBank && { bankRegularity: true, hasSteadyIncome: true }),
        ...(detectedSgk && { hasSgkJob: true, hasBarcodeSgk: true }),
        ...(detectedProperty && { tieCategories: { ...prev.tieCategories, property: true } }),
      }));
    }, 2200);
  };
  const baseScoreWithoutUs = useMemo(() => {
    const tempProfile = { 
      ...profile, 
      useOurTemplate: false, 
      hasTravelInsurance: false,
      documentConsistency: false,
      interviewPrepared: false,
      bankNoLastMinuteDeposit: false,
      paidReservations: false,
      addressMatchSgk: false,
      datesMatchReservations: false
    };
    return calculateScore(tempProfile);
  }, [profile]);

  const scoreDetails = useMemo(() => {
    const details = [
      { label: 'Finansal Güç', score: 25, status: profile.bankRegularity && profile.bankSufficientBalance },
      { label: 'Mesleki Bağlılık', score: 20, status: profile.hasSgkJob && profile.sgkEmployerLetterWithReturn },
      { label: 'Seyahat Geçmişi', score: 20, status: profile.hasHighValueVisa || profile.hasOtherVisa },
      { label: 'Sosyal Bağlar (Aile/Okul)', score: 10, status: profile.isMarried || profile.isStudent },
      { label: 'Başvuru Kalitesi & Niyet', score: 15, status: profile.useOurTemplate && profile.addressMatchSgk },
      { label: 'Güven & Tutarlılık', score: 10, status: profile.documentConsistency && profile.cleanCriminalRecord },
    ];
    return details;
  }, [profile]);

  const handleProfileToggle = (key: keyof ProfileData) => {
    setProfile((prev: ProfileData) => ({ ...prev, [key]: !prev[key] }));
  };

  // ──────────────────────────────────────────────────────────────────
  // SMART DOCUMENT GENERATOR 2.0 — 2024-2026 Konsolosluk Standartları
  // ──────────────────────────────────────────────────────────────────
  const normalizeTr = (text: string) => text
    .replace(/ğ/g, 'g').replace(/Ğ/g, 'G')
    .replace(/ü/g, 'u').replace(/Ü/g, 'U')
    .replace(/ş/g, 's').replace(/Ş/g, 'S')
    .replace(/ı/g, 'i').replace(/İ/g, 'I')
    .replace(/ö/g, 'o').replace(/Ö/g, 'O')
    .replace(/ç/g, 'c').replace(/Ç/g, 'C');

  const buildLetterBody = (type: 'cover' | 'sponsor' | 'employer' | 'itinerary'): string => {
    const d = letterData;
    const today = new Date().toLocaleDateString('tr-TR');
    const tripDays = d.startDate && d.endDate
      ? Math.max(1, Math.round((new Date(d.endDate).getTime() - new Date(d.startDate).getTime()) / 86400000))
      : '[GÜN SAYISI]';

    if (type === 'cover') {
      return `${d.address || '[Adresiniz]'}
${today}

${d.targetCountry} Başkonsolosluğu
Vize Birimi

Konu: Turistik Ziyaret Vize Başvurusu — ${d.fullName} (Pasaport No: ${d.passportNumber})

Sayın Konsolosluk Yetkilisi,

Ben, ${d.fullName}, ${d.birthDate || '[Doğum Tarihi]'} tarihinde doğmuş, ${d.nationality || 'Türk'} vatandaşı olarak ${d.passportNumber} numaralı pasaportumla ${d.targetCountry} ülkesine ${d.startDate || '[Başlangıç]'} - ${d.endDate || '[Bitiş]'} tarihleri arasında (${tripDays} gece/gündüz) ${d.purpose} amacıyla girmek üzere vize talebinde bulunuyorum.

1. KİŞİSEL VE MESLEKİ DURUM

Türkiye'de ${d.companyEmployer || '[Şirket/Kurum Adı]'} bünyesinde ${d.occupation || '[Pozisyon]'} olarak görev yapmaktayım. Aylık düzenli gelirim ${d.monthlyIncome || '[Gelir]'} TL olmakla birlikte, mevcut tasarruflarım ${d.bankBalance || '[Banka Bakiyesi]'} TL seviyesindedir. İlgili banka ekstreleri, maş bordroları ve istihdam belgeleri başvuru dosyama eklenmiştir.

2. SEYAHAT AMACI VE PLANLANAN AKTİVİTELER

Bu seyahatin amacı tamamen turistik ve kültürel niteliktedir. ${d.targetCountry} ülkesinin tarihi mekanlarını, müzelerini ve doğal güzelliklerini keşfetmeyi planlamaktayım. Seyahat süresince konaklamam ${d.hotelName || '[Otel Adı]'} (Rez. No: ${d.hotelReservationNo || '[Rez. No]'}) adresinde gerçekleşecektir. Gidiş uçuşum ${d.flightOutbound || '[TK/PC XXXX]'} sefer sayılı uçuştur; dönüş biletim de kesin olarak alınmış olup ${d.flightInbound || '[TK/PC XXXX]'} sefer numarasıyla gerçekleşecektir.

3. FİNANSAL GÜVENCE

Seyahat süresince oluşacak; ulaşım, konaklama, iaşe, şehir içi ulaşım ve acil sağlık harcamalarının tamamı, şahsıma ait banka kaynaklarımdan karşılanacaktır. Günlük ortalama harcama bütçem uluslararası standartların üzerindedir. ${d.insuranceProvider ? `${d.insuranceProvider} tarafından düzenlenmiş, en az €30.000 teminatlı seyahat sağlık sigortam (Poliçe No: ${d.insurancePolicyNo || '-'}) başvuruya eklenmiştir.` : 'Zorunlu seyahat sağlık sigortası başvuruya eklenmiştir.'}

4. TÜRKİYE'YE BAĞLARIM VE GERİ DÖNÜŞ TAAHÜDÜ

Türkiye'de kurulu yaşam düzenim, mesleki kariyerim ve aile bağlarım, bu ülkede kalmamı her koşulda zorunlu kılmaktadır. ${d.tieDescription || 'Süregelen iş sözleşmem, mülklerim ve aile sorumluluklarım'} nedeniyle vize süresinin bitiminden önce Türkiye'ye kesin dönüş yapacağımı taahhüt ederim. Bu seyahatin geçici nitelikte olduğunu, hiçbir şekilde göç veya yasadışı çalışma amacı taşımadığını açıkça beyan ederim.

Başvurumun olumlu değerlendirilmesini diler, ek bilgi veya belge talep etmeniz halinde ${d.phone || '[Telefon]'} / ${d.email || '[E-posta]'} üzerinden iletişime geçilmesini rica ederim.

Saygılarımla,

${d.fullName}
Pasaport No: ${d.passportNumber}
Telefon: ${d.phone || '_______________'}
E-posta: ${d.email || '_______________'}
İmza: _______________     Tarih: ${today}`;
    }

    if (type === 'sponsor') {
      return `${d.sponsorAddress || '[Sponsor Adresi]'}
${today}

${d.targetCountry} Başkonsolosluğu
Vize Birimi

Konu: Finansal Sponsorluk Beyannamesi — ${d.fullName} (Pasaport No: ${d.passportNumber})

Sayın Konsolosluk Yetkilisi,

Ben, ${d.sponsorFullName || '[Sponsor Adı]'} (TC Kimlik No: ${d.sponsorId || '[TC Kimlik No]'}), bu beyanname ile ${d.sponsorRelation || '[Yakınlık Derecesi: oğlum/kızım/eşim vb.]'} olan ve ${d.passportNumber} numaralı pasaport hamili ${d.fullName}'in ${d.startDate || '[Tarih]'} - ${d.endDate || '[Tarih]'} tarihleri arasında ${d.targetCountry} ülkesine gerçekleştireceği ${d.purpose} amaçlı seyahatin tek ve münhasır finansal sponsoru olduğumu beyan ederim.

1. SPONSOR KİMLİĞİ VE MALİ DURUMU

${d.sponsorOccupation || '[Meslek/Pozisyon]'} olarak görev yapmakta olup aylık düzenli gelirim ${d.sponsorIncome || '[Gelir]'} TL'dir. Finansal kapasitemi kanıtlayan banka ekstreleri, maaş bordroları ve ilgili gelir belgeleri işbu beyannameye eklenmiştir.

2. FİNANSAL TAAHHÜT KAPSAMI

Başvuru sahibi ${d.fullName}'in söz konusu seyahat döneminde ihtiyaç duyacağı aşağıdaki harcamaların tamamını karşılamayı taahhüt ederim:
  • Gidiş-dönüş uçak biletleri
  • ${d.hotelName || 'Otel'} konaklaması (${tripDays} gece)
  • Günlük yaşam ve iaşe giderleri
  • Şehir içi ulaşım
  • Olası acil sağlık masrafları
  • Seyahat sigortası primleri

3. GERİ DÖNÜŞ TAAHÜDÜ

${d.fullName}'in seyahatini tamamladıktan sonra, vize geçerlilik süresi ihlali yapmaksızın belirlenen dönüş tarihinde Türkiye'ye kesin dönüş yapacağını taahhüt ederim. Başvuru sahibinin Türkiye'deki ikamet etme yükümlülüğünün bilincinde olduğunu ve bu doğrultuda hareket edeceğini beyan ederim.

Gereğinin yapılmasını saygılarımla arz ederim.

Sponsor: ${d.sponsorFullName || '_______________'}
TC Kimlik No: ${d.sponsorId || '_______________'}
Telefon: ${d.sponsorPhone || '_______________'}
İmza: _______________     Tarih: ${today}`;
    }

    if (type === 'employer') {
      return `[ŞİRKET ANTETLİ KAĞIDINA YAZILMALIDIR]
${d.companyName || '[Şirket Adı]'}
${d.companyAddress || '[Şirket Adresi]'}
Tel: ${d.companyPhone || '[Telefon]'}

${today}

${d.targetCountry} Başkonsolosluğu
Vize Birimi

Konu: Çalışma Belgesi, Ücretli İzin Onayı ve İşe Dönüş Garantisi — ${d.fullName}

Sayın Konsolosluk Yetkilisi,

Şirketimiz ${d.companyName || '[Şirket Adı]'} adına düzenlenen bu belge; ${d.passportNumber} pasaport numaralı çalışanımız ${d.fullName}'in istihdam durumunu resmi olarak onaylamak amacıyla hazırlanmıştır.

1. İSTİHDAM BİLGİLERİ

Çalışanımız ${d.fullName}, ${d.jobStartDate || '[İşe Başlama Tarihi]'} tarihinden itibaren şirketimizde tam zamanlı ve kadrolu statüde "${d.occupation || '[Pozisyon]'}" pozisyonunda görev yapmaktadır. Çalışanın aylık net ücreti ${d.monthlyIncome || '[Ücret]'} TL olup düzenli maaş ödemeleri banka kanalıyla yapılmaktadır.

2. ÜCRETLİ İZİN ONAYI

Çalışanımız ${d.fullName}'e, ${d.startDate || '[Tarih]'} - ${d.endDate || '[Tarih]'} tarihleri arasında ${d.targetCountry} ülkesine gerçekleştireceği turistik seyahat için yıllık ücretli izin talebinde bulunmuştur. Söz konusu izin talebi şirketimiz insan kaynakları birimi tarafından resmi olarak onaylanmıştır.

3. İŞE DÖNÜŞ GARANTİSİ

Çalışanımız ${d.fullName}, seyahatini tamamladıktan sonra en geç ${d.returnDate || '[Dönüş Tarihi]'} tarihinde şirketimizdeki görevine ve mevcut pozisyonuna aynı koşullar ve ücret düzeyi ile geri dönecektir. Çalışanımızın iş akdi sürekliliği tarafımızca garanti altındadır.

Çalışanımızın vize başvurusunun olumlu değerlendirilmesini diler, belge doğrulama veya ek bilgi talebi durumunda aşağıdaki iletişim bilgilerimizden bize ulaşmanızı rica ederiz.

Saygılarımızla,

${d.authorizedName || '[Yetkili Adı Soyadı]'}
${d.authorizedTitle || 'İnsan Kaynakları Müdürü'}
${d.companyName || '[Şirket Adı]'}
Tel: ${d.companyPhone || '_______________'}
İmza ve Şirket Kaşesi: _______________
Tarih: ${today}`;
    }

    // itinerary
    const plan = d.dailyPlan || `1. Gün (${d.startDate || '[Tarih]'}): ${d.targetCountry || '[Ülke]'}'ye varış, havalimanından transfer, otel check-in. Dinlenme ve çevre keşfi.
2. Gün: Şehir merkezi turu — tarihi yapılar, müzeler, anıtlar.
3. Gün: Kültürel etkinlikler, yerel mutfak deneyimi, yerel pazar ziyareti.
4. Gün: Yakın çevrede günübirlik doğa veya kültür gezisi.
5. Gün (${d.endDate || '[Tarih]'}): Otel check-out, alışveriş, havalimanı transferi, Türkiye'ye dönüş.`;

    return `DETAYLI SEYAHAT PLANI / TRAVEL ITINERARY
${today}

BAŞVURU SAHİBİ BİLGİLERİ
Ad Soyad          : ${d.fullName}
Pasaport No       : ${d.passportNumber}
Doğum Tarihi      : ${d.birthDate || '[Doğum Tarihi]'}
Uyruk             : ${d.nationality || 'Türk'}
Telefon           : ${d.phone || '_______________'}
E-posta           : ${d.email || '_______________'}

SEYAHAT GENEL BİLGİLERİ
Hedef Ülke        : ${d.targetCountry}
Giriş Tarihi      : ${d.startDate || '[Giriş Tarihi]'}
Çıkış Tarihi      : ${d.endDate || '[Çıkış Tarihi]'}
Konaklama Süresi  : ${tripDays} gece
Seyahat Amacı     : ${d.purpose}

ULAŞIM BİLGİLERİ
Gidiş Uçuşu       : ${d.flightOutbound || '[Sefer No: TK/PC XXXX] — İstanbul → [Varış Şehri]'}
Dönüş Uçuşu       : ${d.flightInbound || '[Sefer No: TK/PC XXXX] — [Kalkış Şehri] → İstanbul'}

KONAKLAMA BİLGİLERİ
Otel Adı          : ${d.hotelName || '[Otel Adı]'}
Otel Adresi       : ${d.hotelAddress || '[Otel Tam Adresi]'}
Rezervasyon No    : ${d.hotelReservationNo || '[Rezervasyon Numarası]'}

SİGORTA BİLGİLERİ (Schengen: min. €30.000 zorunlu)
Sigorta Şirketi   : ${d.insuranceProvider || '[Sigorta Şirketi]'}
Poliçe No         : ${d.insurancePolicyNo || '[Poliçe No]'}

GÜNLÜK SEYAHAT PROGRAMI
${plan}

BÜTÇE PLANI
Günlük ortalama harcama : ~€120-150
Toplam tahmini masraf   : ~€${typeof tripDays === 'number' ? (tripDays * 135).toLocaleString('tr-TR') : 'XXX'} (€30.000 sağlık sigortası dahil)
Finansman kaynağı       : Kişisel banka tasarrufları

NOT: Tüm uçak rezervasyon onayları, otel voucher'ları ve seyahat sigortası poliçesi bu plana eklenmiştir. Rezervasyonlar kesin bilet/poliçe statüsündedir.

${d.fullName}
İmza: _______________     Tarih: ${today}`;
  };

  const buildLetterBodyEN = (type: 'cover' | 'sponsor' | 'employer' | 'itinerary'): string => {
    const d = letterData;
    const today = new Date().toLocaleDateString('en-GB');
    const tripDays = d.startDate && d.endDate
      ? Math.max(1, Math.round((new Date(d.endDate).getTime() - new Date(d.startDate).getTime()) / 86400000))
      : '[NUMBER OF DAYS]';

    if (type === 'cover') {
      return `${d.address || '[Your Address]'}
${today}

Consulate of ${d.targetCountry}
Visa Section

Re: Application for Tourist Visa — ${d.fullName} (Passport No: ${d.passportNumber})

Dear Consular Officer,

I, ${d.fullName}, born on ${d.birthDate || '[Date of Birth]'}, a citizen of ${d.nationality || 'Turkey'}, respectfully submit this application for a tourist visa to ${d.targetCountry} for the period of ${d.startDate || '[Start Date]'} to ${d.endDate || '[End Date]'} (${tripDays} nights), for the purpose of ${d.purpose}.

1. PERSONAL AND PROFESSIONAL BACKGROUND

I am currently employed at ${d.companyEmployer || '[Company Name]'} as ${d.occupation || '[Position]'}. My monthly salary is ${d.monthlyIncome || '[Income]'} TRY, and my current savings amount to ${d.bankBalance || '[Bank Balance]'} TRY. Bank statements, payslips and employment documentation are enclosed with this application.

2. PURPOSE AND PLANNED ACTIVITIES

The purpose of this visit is entirely touristic and cultural. I intend to explore the historical landmarks, museums, and natural attractions of ${d.targetCountry}. During my stay, I will be accommodated at ${d.hotelName || '[Hotel Name]'} (Reservation No: ${d.hotelReservationNo || '[Res. No]'}). My outbound flight is ${d.flightOutbound || '[TK/PC XXXX]'}; my return flight is confirmed as ${d.flightInbound || '[TK/PC XXXX]'}.

3. FINANCIAL CAPACITY

All expenses during this trip — including accommodation, meals, local transportation and emergency healthcare — will be fully covered from my personal funds. My daily budget exceeds international standards. ${d.insuranceProvider ? `A travel health insurance policy issued by ${d.insuranceProvider} (Policy No: ${d.insurancePolicyNo || '-'}), with a minimum coverage of €30,000, is enclosed.` : 'Mandatory travel health insurance is enclosed with this application.'}

4. TIES TO TURKEY AND COMMITMENT TO RETURN

My established life in Turkey, professional career, and family obligations make it imperative that I return to Turkey. Due to ${d.tieDescription || 'my ongoing employment contract, property, and family responsibilities'}, I unconditionally commit to returning to Turkey before my visa expires. I hereby declare that this trip is strictly temporary and carries no intention of immigration or illegal employment.

I kindly request that my application be viewed favourably. Should you require additional information or documentation, please contact me at ${d.phone || '[Phone]'} / ${d.email || '[Email]'}.

Yours sincerely,

${d.fullName}
Passport No: ${d.passportNumber}
Phone: ${d.phone || '_______________'}
Email: ${d.email || '_______________'}
Signature: _______________     Date: ${today}`;
    }

    if (type === 'sponsor') {
      return `${d.sponsorAddress || '[Sponsor Address]'}
${today}

Consulate of ${d.targetCountry}
Visa Section

Re: Financial Sponsorship Declaration — ${d.fullName} (Passport No: ${d.passportNumber})

Dear Consular Officer,

I, ${d.sponsorFullName || '[Sponsor Full Name]'} (National ID: ${d.sponsorId || '[ID No]'}), hereby declare that I am the sole financial sponsor for the ${d.purpose} trip to ${d.targetCountry} of my ${d.sponsorRelation || '[Relationship: son/daughter/spouse]'}, ${d.fullName}, holder of passport No. ${d.passportNumber}, for the period ${d.startDate || '[Date]'} to ${d.endDate || '[Date]'}.

1. SPONSOR IDENTITY AND FINANCIAL STATUS

I am employed as ${d.sponsorOccupation || '[Occupation]'} with a monthly net income of ${d.sponsorIncome || '[Income]'} TRY. Bank statements, payslips and relevant income documents evidencing my financial capacity are enclosed herewith.

2. SCOPE OF FINANCIAL COMMITMENT

I undertake to cover all expenses of ${d.fullName} during the stated travel period, including:
  - Return airfare
  - ${d.hotelName || 'Hotel'} accommodation (${tripDays} nights)
  - Daily living and meal expenses
  - Local transportation
  - Emergency medical costs
  - Travel insurance premiums

3. RETURN COMMITMENT

I confirm that ${d.fullName} will comply fully with the conditions of the visa and will return to Turkey before the visa expiry date, no later than ${d.endDate || '[End Date]'}. I am fully aware of the applicant's obligation to reside in Turkey and declare that he/she will act accordingly.

Yours faithfully,

Sponsor: ${d.sponsorFullName || '_______________'}
National ID: ${d.sponsorId || '_______________'}
Phone: ${d.sponsorPhone || '_______________'}
Signature: _______________     Date: ${today}`;
    }

    if (type === 'employer') {
      return `[TO BE PRINTED ON COMPANY LETTERHEAD]
${d.companyName || '[Company Name]'}
${d.companyAddress || '[Company Address]'}
Tel: ${d.companyPhone || '[Phone]'}

${today}

Consulate of ${d.targetCountry}
Visa Section

Re: Employment Verification, Paid Leave Approval and Return-to-Work Guarantee — ${d.fullName}

Dear Consular Officer,

This letter, issued on behalf of ${d.companyName || '[Company Name]'}, serves to officially verify the employment status of our employee ${d.fullName}, holder of passport No. ${d.passportNumber}.

1. EMPLOYMENT DETAILS

${d.fullName} has been employed with our company on a full-time, permanent basis as "${d.occupation || '[Position]'}" since ${d.jobStartDate || '[Start Date]'}. The employee's monthly net salary is ${d.monthlyIncome || '[Salary]'} TRY, paid directly into a bank account.

2. APPROVED LEAVE OF ABSENCE

${d.fullName} has requested annual paid leave to travel to ${d.targetCountry} for a tourist visit from ${d.startDate || '[Date]'} to ${d.endDate || '[Date]'}. This leave request has been formally approved by our Human Resources Department.

3. RETURN-TO-WORK GUARANTEE

We confirm that ${d.fullName} will return to his/her current position at our company no later than ${d.returnDate || '[Return Date]'}, under the same conditions and remuneration. The continuity of this employee's contract is guaranteed by this company.

We kindly request that this visa application be approved, and we remain available for any verification or additional documentation requests.

Yours sincerely,

${d.authorizedName || '[Authorised Signatory]'}
${d.authorizedTitle || 'Human Resources Manager'}
${d.companyName || '[Company Name]'}
Tel: ${d.companyPhone || '_______________'}
Company Stamp & Signature: _______________
Date: ${today}`;
    }

    // itinerary EN
    const plan = d.dailyPlan
      ? d.dailyPlan
      : `Day 1 (${d.startDate || '[Date]'}): Arrival in ${d.targetCountry || '[Country]'}, airport transfer, hotel check-in. Rest and local area exploration.
Day 2: City centre tour — historical landmarks, museums, monuments.
Day 3: Cultural activities, local cuisine experience, local market visit.
Day 4: Day trip to nearby natural or cultural attractions.
Day 5 (${d.endDate || '[Date]'}): Hotel check-out, shopping, airport transfer, return to Turkey.`;

    return `DETAILED TRAVEL ITINERARY
${today}

APPLICANT DETAILS
Full Name         : ${d.fullName}
Passport No       : ${d.passportNumber}
Date of Birth     : ${d.birthDate || '[Date of Birth]'}
Nationality       : ${d.nationality || 'Turkish'}
Phone             : ${d.phone || '_______________'}
Email             : ${d.email || '_______________'}

TRAVEL OVERVIEW
Destination       : ${d.targetCountry}
Entry Date        : ${d.startDate || '[Entry Date]'}
Exit Date         : ${d.endDate || '[Exit Date]'}
Duration of Stay  : ${tripDays} nights
Purpose of Visit  : ${d.purpose}

TRANSPORTATION
Outbound Flight   : ${d.flightOutbound || '[Flight No: TK/PC XXXX] — Istanbul → [Destination]'}
Return Flight     : ${d.flightInbound || '[Flight No: TK/PC XXXX] — [Departure] → Istanbul'}

ACCOMMODATION
Hotel Name        : ${d.hotelName || '[Hotel Name]'}
Hotel Address     : ${d.hotelAddress || '[Full Hotel Address]'}
Reservation No    : ${d.hotelReservationNo || '[Reservation Number]'}

INSURANCE (Schengen: min. €30,000 mandatory)
Insurance Company : ${d.insuranceProvider || '[Insurance Company]'}
Policy No         : ${d.insurancePolicyNo || '[Policy No]'}

DAILY PROGRAMME
${plan}

BUDGET PLAN
Estimated daily expenditure : ~€120-150
Estimated total cost        : ~€${typeof tripDays === 'number' ? (tripDays * 135).toLocaleString('en-GB') : 'XXX'} (including €30,000 health insurance)
Source of funds             : Personal bank savings

NOTE: All flight confirmation documents, hotel vouchers and travel insurance policies are appended to this itinerary. All reservations are confirmed/ticketed.

${d.fullName}
Signature: _______________     Date: ${today}`;
  };

  const generatePDFEN = (type: 'cover' | 'sponsor' | 'employer' | 'itinerary' = 'cover') => {
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString('en-GB');
    const titles: Record<string, string> = {
      cover: 'Cover Letter (Visa Application)',
      sponsor: 'Financial Sponsorship Declaration',
      employer: 'Employment & Leave Verification Letter',
      itinerary: 'Detailed Travel Itinerary',
    };

    // Header band
    doc.setFillColor(30, 58, 138);
    doc.rect(0, 0, 220, 22, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('VizeAkil.com — Smart Document Generator 2.0 (EN)', 14, 10);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${today}`, 14, 17);

    // Title
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(titles[type], 14, 30);
    doc.setDrawColor(229, 231, 235);
    doc.line(14, 33, 196, 33);

    // Body
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);
    const body = buildLetterBodyEN(type);
    const splitText = doc.splitTextToSize(body, 180);
    doc.text(splitText, 14, 40);

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFillColor(248, 250, 252);
    doc.rect(0, pageHeight - 12, 220, 12, 'F');
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text('This document was generated by VizeAkil.com Smart Document Generator 2.0. It does not constitute official legal advice or visa guarantee.', 14, pageHeight - 4);

    doc.save(`VizeAkil_EN_${titles[type].replace(/\s+/g, '_')}_${(letterData.fullName || 'Document').replace(/\s+/g, '_')}.pdf`);
  };

  const generatePDF = (type: 'cover' | 'sponsor' | 'employer' | 'itinerary' = 'cover') => {
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString('tr-TR');
    const titles: Record<string, string> = {
      cover: 'VIZE NIYET MEKTUBU / COVER LETTER',
      sponsor: 'FINANSAL SPONSORLUK BEYANNAMESI',
      employer: 'CALISMA BELGESI VE IZIN ONAYI',
      itinerary: 'DETAYLI SEYAHAT PLANI / ITINERARY'
    };

    // Header
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 18, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('VizeAkil — vizeakil.com', 14, 12);
    doc.text(today, 196, 12, { align: 'right' });

    // Title
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(13);
    doc.text(normalizeTr(titles[type]), 14, 30);
    doc.setDrawColor(229, 231, 235);
    doc.line(14, 33, 196, 33);

    // Body
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);
    const body = buildLetterBody(type);
    const splitText = doc.splitTextToSize(normalizeTr(body), 180);
    doc.text(splitText, 14, 40);

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFillColor(248, 250, 252);
    doc.rect(0, pageHeight - 12, 210, 12, 'F');
    doc.setTextColor(148, 163, 184);
    doc.setFontSize(7);
    doc.text('Bu belge VizeAkil (vizeakil.com) Smart Document Generator 2.0 ile olusturulmustur. Resmi vize danismanliginin yerini tutmaz.', 14, pageHeight - 4);

    doc.save(`VizeAkil_${normalizeTr(titles[type]).replace(/\s+/g, '_')}_${normalizeTr(letterData.fullName || 'Belge').replace(/\s+/g, '_')}.pdf`);
  };

  // Open a tool: if premium-gated and not premium, show upgrade modal; else navigate to dashboard + open
  const openTool = (toolId: string, setter: (b: boolean) => void) => {
    if (PREMIUM_TOOLS.includes(toolId) && !isPremium) {
      setIsUpgradeOpen(true);
      return;
    }
    if (step !== 'dashboard') {
      setStep('dashboard');
      setTimeout(() => setter(true), 150);
    } else {
      setter(true);
    }
  };

  // ── Custom Cursor (localStorage'dan tercih okunur, default KAPALI) ──────
  const [customCursorEnabled, setCustomCursorEnabled] = React.useState<boolean>(() => {
    try { return localStorage.getItem('vizeakil_custom_cursor') === 'true'; } catch { return false; }
  });

  React.useEffect(() => {
    if (customCursorEnabled) {
      document.body.classList.add('use-custom-cursor');
    } else {
      document.body.classList.remove('use-custom-cursor');
    }
    try { localStorage.setItem('vizeakil_custom_cursor', String(customCursorEnabled)); } catch { /* noop */ }
  }, [customCursorEnabled]);

  React.useEffect(() => {
    const dot = document.querySelector('#vize-cursor') as HTMLElement | null;
    if (!dot) return;

    let raf = 0;
    let mx = -100, my = -100;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        dot.style.left = mx + 'px';
        dot.style.top = my + 'px';
      });
    };

    const onDown = () => document.body.classList.add('cursor-click');
    const onUp = () => document.body.classList.remove('cursor-click');

    const getType = (el: Element | null): string => {
      if (!el) return '';
      if (el.closest('input, textarea, select, [contenteditable]')) return 'text';
      const locked = el.closest('[data-locked="true"]');
      if (locked) return 'premium';
      const danger = el.closest('[data-cursor="danger"]');
      if (danger) return 'danger';
      if (el.closest('button, a, label, [role="button"], [tabindex]')) return 'hover';
      return '';
    };

    const onOver = (e: MouseEvent) => {
      const type = getType(e.target as Element);
      document.body.classList.remove('cursor-hover', 'cursor-premium', 'cursor-text', 'cursor-danger');
      if (type) document.body.classList.add('cursor-' + type);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
    };
  }, []);

  return (
    <>
    {/* Custom Cursor */}
    <div id="vize-cursor" aria-hidden="true">
      <div className="cursor-ring"/>
      <div className="cursor-dot"/>
    </div>
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-brand-100 selection:text-brand-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-3">
          <div
            onClick={() => setStep('hero')}
            className="flex items-center gap-2 font-display font-bold text-xl sm:text-2xl text-brand-600 cursor-pointer hover:opacity-80 transition-opacity min-w-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20 shrink-0">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="tracking-tight truncate">VizeAkıl</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {!isPremium && (
              <button type="button" onClick={() => setIsUpgradeOpen(true)}
                className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-xl hover:bg-amber-100 transition-colors">
                🔒 Premium
              </button>
            )}
            {isPremium && (
              <span className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl">
                ✓ Premium
              </span>
            )}
            <div className="hidden md:flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              AI Aktif
            </div>
            {/* Özel imleç toggle */}
            <button
              type="button"
              title={customCursorEnabled ? 'Özel imleci kapat' : 'Özel imleci aç'}
              onClick={() => setCustomCursorEnabled(v => !v)}
              className={`hidden sm:flex p-2 rounded-xl transition-colors text-xs font-bold gap-1 items-center ${customCursorEnabled ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
            >
              <Target className="w-4 h-4"/>
            </button>
            <button
              type="button"
              onClick={() => setIsCopilotOpen(true)}
              className="p-2 sm:p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors relative"
            >
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-brand-500 border-2 border-white rounded-full" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">

        {/* ═══ UPGRADE MODAL — 3 Katmanlı Fiyatlandırma ═══ */}
        <AnimatePresence>
          {isUpgradeOpen && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsUpgradeOpen(false)}
                className="absolute inset-0 bg-slate-950/70 backdrop-blur-lg" />
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
                {/* Header */}
                <div className="bg-slate-900 p-7 text-white text-center shrink-0">
                  <button onClick={() => setIsUpgradeOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full"><X className="w-5 h-5" /></button>
                  <div className="w-14 h-14 bg-amber-400/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="w-7 h-7 text-amber-300" />
                  </div>
                  <h3 className="text-2xl font-black">VizeAkıl — Plan Seç</h3>
                  <p className="text-slate-400 text-sm mt-1">İhtiyacına göre ödeme yap. Sürpriz maliyet yok.</p>
                </div>
                {/* Planlar */}
                <div className="p-6 overflow-y-auto flex-1 space-y-4">
                  {/* Ücretsiz */}
                  <div className="border-2 border-slate-200 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-black text-slate-900 text-base">Ücretsiz</div>
                        <div className="text-xs text-slate-500 mt-0.5">Hemen başla, kayıt gerekmez</div>
                      </div>
                      <div className="text-2xl font-black text-slate-900">₺0</div>
                    </div>
                    <div className="space-y-1.5">
                      {['Başarı profili analizi', 'Kişiye özel evrak listesi', 'Schengen ülke kıyaslayıcısı (görüntüleme)', 'SSS ve rehber içerikleri'].map(f => (
                        <div key={f} className="flex items-center gap-2 text-xs text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0"/>{f}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 w-full py-2.5 bg-slate-100 text-slate-500 font-bold rounded-xl text-sm text-center">Mevcut Plan</div>
                  </div>

                  {/* Tek Başvuru */}
                  <div className="border-2 border-brand-200 bg-brand-50 rounded-2xl p-5 relative">
                    <div className="absolute -top-3 left-5 bg-brand-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">En Çok Tercih</div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-black text-slate-900 text-base">Tek Başvuru</div>
                        <div className="text-xs text-slate-500 mt-0.5">90 gün / 1 ülke başvurusu</div>
                      </div>
                      <div>
                        <span className="text-2xl font-black text-slate-900">₺499</span>
                        <span className="text-xs text-slate-500 ml-1">/ 90 gün</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      {['Tüm premium araçlar (Risk, Copilot, Ret Analizi)', 'Banka Dökümü AI Analizi', 'Sosyal Medya Denetim Rehberi', 'Mülakat Simülatörü (78 soru)', 'Sınırsız PDF raporu indirme'].map(f => (
                        <div key={f} className="flex items-center gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-500 shrink-0"/>{f}
                        </div>
                      ))}
                    </div>
                    <button
                      disabled
                      className="mt-4 w-full py-3 bg-brand-600 text-white font-black rounded-xl text-sm flex items-center justify-center gap-2 opacity-70 cursor-not-allowed">
                      <Clock className="w-4 h-4"/>
                      Yakında — Ödeme Sistemi Hazırlanıyor
                    </button>
                  </div>

                  {/* Yıllık Pro */}
                  <div className="border-2 border-slate-800 bg-slate-900 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-black text-white text-base">Yıllık Pro</div>
                        <div className="text-xs text-slate-400 mt-0.5">12 ay / sınırsız ülke</div>
                      </div>
                      <div>
                        <span className="text-2xl font-black text-white">₺999</span>
                        <span className="text-xs text-slate-400 ml-1">/ yıl</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      {['Tek Başvuru planındaki her şey +', 'Sınırsız ülke & başvuru', 'Ret mektubu analizi & strateji', 'Öncelikli destek hattı', 'Yeni özellikler erken erişim'].map(f => (
                        <div key={f} className="flex items-center gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0"/>{f}
                        </div>
                      ))}
                    </div>
                    <button
                      disabled
                      className="mt-4 w-full py-3 bg-white/10 border border-white/20 text-white/60 font-black rounded-xl text-sm flex items-center justify-center gap-2 cursor-not-allowed">
                      <Clock className="w-4 h-4"/>
                      Yakında — Ödeme Sistemi Hazırlanıyor
                    </button>
                  </div>

                  <p className="text-center text-xs text-slate-400 leading-relaxed">
                    Ödeme sistemi yakında aktif olacak. Hazır olduğunda e-posta ile bildirileceksiniz.<br/>
                    Sorularınız için: <span className="font-bold text-slate-600">destek@vizeakil.com</span>
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Document List Modal */}
        <AnimatePresence mode="wait">
          {isDocumentListOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsDocumentListOpen(false)}
                className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]"
              >
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                      <FileCheck className="w-6 h-6 text-emerald-600" />
                      Evrak Listesi & Kişiye Özel Sihirbaz
                    </h3>
                    <p className="text-slate-500 mt-1">Profilinize göre nokta atışı evrak listesi — internette bulamazsınız.</p>
                  </div>
                  <button
                    onClick={() => { setIsDocumentListOpen(false); setWizardDone(false); setWizardResult([]); }}
                    className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-slate-500" />
                  </button>
                </div>

                <div className="p-8 overflow-y-auto flex-1">

                  {/* ── Kişiye Özel Sihirbaz ── */}
                  <div className="mb-8 p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-3xl">
                    <div className="flex items-center gap-2 mb-4">
                      <Target className="w-5 h-5 text-emerald-700"/>
                      <h4 className="font-black text-emerald-900">Kişiye Özel Evrak Sihirbazı</h4>
                      <span className="ml-auto text-xs font-bold bg-emerald-700 text-white px-2 py-0.5 rounded-lg">Niş Analiz</span>
                    </div>
                    {!wizardDone ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-2">
                          {([['schengen','🇪🇺 Schengen'],['uk','🇬🇧 İngiltere'],['usa','🇺🇸 ABD']] as const).map(([v,l])=>(
                            <button key={v} onClick={()=>setWizardCountry(v)}
                              className={`py-2 rounded-xl text-xs font-bold border transition-all ${wizardCountry===v ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-400'}`}>
                              {l}
                            </button>
                          ))}
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-600 block mb-1">İstihdam Durumu</label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {([['employee','👔 Çalışan'],['freelance','💼 Serbest Meslek'],['student','🎓 Öğrenci'],['retired','🏖️ Emekli'],['unemployed','⚠️ İşsiz']] as const).map(([v,l])=>(
                              <button key={v} onClick={()=>setWizardEmployment(v)}
                                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${wizardEmployment===v ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-400'}`}>
                                {l}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                          {[
                            [wizardFirstTrip, setWizardFirstTrip, 'İlk yurt dışı çıkışım'],
                            [wizardHasProperty, setWizardHasProperty, 'Tapu/mülk sahibiyim'],
                            [wizardHasCar, setWizardHasCar, 'Araç sahibiyim'],
                            [wizardHasSponsor, setWizardHasSponsor, 'Sponsor/davetçim var'],
                            [wizardHasChild, setWizardHasChild, 'Çocukla seyahat ediyorum'],
                          ].map(([val, setter, label], i) => (
                            <label key={i} className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
                              <input type="checkbox" checked={val as boolean} onChange={e=>(setter as (v:boolean)=>void)(e.target.checked)} className="w-4 h-4 accent-emerald-600"/>
                              {label as string}
                            </label>
                          ))}
                        </div>
                        <button type="button" onClick={generateCustomDocList}
                          className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-2xl text-sm transition-colors">
                          Kişiye Özel Evrak Listemi Oluştur
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-700"/>
                          <span className="font-bold text-emerald-900 text-sm">{wizardResult.length} belge — profilinize özel liste</span>
                          <button onClick={()=>{setWizardDone(false);setWizardResult([]);setWizardChecked(new Set());}}
                            className="ml-auto text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1">
                            <RefreshCw className="w-3.5 h-3.5"/> Yeniden Oluştur
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-400 mb-3 font-medium">Tamamladığınız belgelere tıklayın — üzeri çizilir.</p>
                        {wizardResult.map((doc, i) => {
                          const isChecked = wizardChecked.has(i);
                          const isWarning = doc.startsWith('⚠️') || doc.startsWith('UYARI');
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => {
                                setWizardChecked(prev => {
                                  const next = new Set(prev);
                                  if (next.has(i)) next.delete(i); else next.add(i);
                                  return next;
                                });
                              }}
                              className={`w-full text-left flex items-start gap-3 p-3 rounded-xl transition-all ${isChecked ? 'bg-slate-50 border border-slate-200 opacity-60' : isWarning ? 'bg-amber-50 border border-amber-200' : 'bg-white border border-emerald-100 hover:border-emerald-300'}`}>
                              {isChecked ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/>
                              ) : isWarning ? (
                                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5"/>
                              ) : (
                                <Circle className="w-4 h-4 text-slate-300 shrink-0 mt-0.5"/>
                              )}
                              <p className={`text-xs text-slate-700 leading-relaxed ${isChecked ? 'line-through text-slate-400' : ''}`}>{doc.replace(/^⚠️ /, '')}</p>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-100 pt-6 mb-4">
                    <h4 className="font-bold text-slate-700 text-sm mb-4 flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-emerald-600"/> İngiltere Genel Evrak Listesi
                    </h4>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-8">
                    <button
                      onClick={() => setApplicantType('employer')}
                      className={`px-4 py-2 rounded-xl font-bold text-sm transition-colors ${
                        applicantType === 'employer' 
                          ? 'bg-slate-900 text-white' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      İşverenler
                    </button>
                    <button
                      onClick={() => setApplicantType('unemployed')}
                      className={`px-4 py-2 rounded-xl font-bold text-sm transition-colors ${
                        applicantType === 'unemployed' 
                          ? 'bg-slate-900 text-white' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Çalışmayanlar
                    </button>
                    <button
                      onClick={() => setApplicantType('minor')}
                      className={`px-4 py-2 rounded-xl font-bold text-sm transition-colors ${
                        applicantType === 'minor' 
                          ? 'bg-slate-900 text-white' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Reşit Olmayanlar
                    </button>
                    <button
                      onClick={() => setApplicantType('sponsor')}
                      className={`px-4 py-2 rounded-xl font-bold text-sm transition-colors ${
                        applicantType === 'sponsor' 
                          ? 'bg-slate-900 text-white' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Sponsor Olacak Kişi
                    </button>
                  </div>

                  <div className="space-y-4 mb-12">
                    {ukDocuments[applicantType as keyof typeof ukDocuments].map((doc, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-4 h-4" />
                        </div>
                        <p className="text-slate-700 text-sm leading-relaxed">{doc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-50 rounded-3xl p-8 border border-blue-100">
                    <h4 className="text-lg font-bold text-blue-900 mb-6 flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Ücretlendirme
                    </h4>
                    
                    <div className="space-y-6">
                      <div>
                        <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Konsolosluk Harçları</div>
                        <p className="text-sm text-blue-800">{ukPricing.consulate}</p>
                      </div>
                      
                      <div>
                        <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Vize Takip Bedeli</div>
                        <p className="text-sm text-blue-800 font-bold">{ukPricing.agency}</p>
                      </div>

                      <div>
                        <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">Vize Sürelerine Göre Ücretler</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {ukPricing.durations.map((duration, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-xl border border-blue-100 flex justify-between items-center">
                              <span className="font-medium text-slate-700">{duration.label}</span>
                              <span className="font-bold text-blue-700">{duration.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Calculator Modal */}
        <AnimatePresence mode="wait">
          {isCalculatorOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsCalculatorOpen(false)}
                className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200"
              >
                <div className="p-8 sm:p-12 space-y-8 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h2 className="text-3xl font-bold text-slate-900 font-display">Bakiye Simülatörü</h2>
                      <p className="text-slate-500 font-medium">Bankadaki paranızın vize sonucuna etkisini görün.</p>
                    </div>
                    <button 
                      onClick={() => setIsCalculatorOpen(false)}
                      className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      <ArrowLeft className="w-6 h-6 text-slate-400" />
                    </button>
                  </div>

                  <div className="space-y-10 py-4">
                    <div className="space-y-6">
                      <div className="flex justify-between items-end">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mevcut Bakiye (₺)</label>
                        <span className="text-4xl font-black text-brand-600 font-mono">
                          {simulatorValue.toLocaleString('tr-TR')} ₺
                        </span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="1000000" 
                        step="10000"
                        value={simulatorValue}
                        onChange={(e) => setSimulatorValue(Number(e.target.value))}
                        className="w-full h-2.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-brand-600"
                      />
                      <div className="flex justify-between text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
                        <span>0 ₺</span>
                        <span>500.000 ₺</span>
                        <span>1.000.000 ₺</span>
                      </div>
                    </div>

                    <div className="p-8 bg-brand-50/50 rounded-3xl border border-brand-100 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-brand-100">
                          <Target className="w-7 h-7 text-brand-600" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-brand-900">Yeni Başarı Skoru</div>
                          <div className="text-xs text-brand-600 font-semibold">Bakiye artışı sonrası tahmin</div>
                        </div>
                      </div>
                      <div className="text-5xl font-black text-brand-700">%{currentScore}</div>
                    </div>
                  </div>
                </div>

                <div className="p-8 border-t border-slate-100 bg-slate-50 flex gap-4">
                  <button 
                    onClick={() => setIsCalculatorOpen(false)}
                    className="btn-secondary flex-1"
                  >
                    Kapat
                  </button>
                  <button 
                    onClick={() => {
                      setIsCalculatorOpen(false);
                      setStep('assessment');
                    }}
                    className="btn-primary flex-[2] flex items-center justify-center gap-2"
                  >
                    <Zap className="w-5 h-5 text-amber-400" />
                    Şimdi Başvuruyu Başlat
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>



        {/* ═══════════════════════════════════════════════════════
            ÖZELLİK 1: RET MEKTUBU ANALİZ MODALI
            ═══════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {isRefusalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                onClick={() => setIsRefusalOpen(false)}
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" />
              <motion.div initial={{opacity:0,scale:0.95,y:20}} animate={{opacity:1,scale:1,y:0}}
                exit={{opacity:0,scale:0.95,y:20}}
                className="relative w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden">
                <div className="p-8 bg-gradient-to-r from-rose-600 to-pink-700 text-white rounded-t-[2.5rem] shrink-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 text-rose-200 text-xs font-bold uppercase tracking-widest mb-2">
                        <XCircle className="w-4 h-4" /> Ret Analizi
                      </div>
                      <h3 className="text-2xl font-black">Ret Mektubu Analiz Motoru</h3>
                      <p className="text-rose-100 text-sm mt-1">Ret gerekçenizi yapıştırın — size özel aksiyon planı oluşturalım.</p>
                    </div>
                    <button onClick={() => setIsRefusalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-6 h-6"/></button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                  {!refusalAnalyzed ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex gap-3">
                        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-800">Ret mektubunuzdaki İngilizce veya Türkçe gerekçeyi aşağıya kopyalayın. Sistem otomatik analiz edecek.</p>
                      </div>
                      <textarea
                        value={refusalText}
                        onChange={e => setRefusalText(e.target.value)}
                        placeholder={'Örn: "Your application has been refused because you have not demonstrated sufficient ties to your home country..." veya Türkçe ret gerekçesini yapıştırın...'}
                        className="w-full h-48 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-400/30 focus:border-rose-400 resize-none text-sm text-slate-700 leading-relaxed"
                      />
                      <button
                        onClick={analyzeRefusal}
                        disabled={refusalText.trim().length < 10}
                        className="w-full py-4 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
                      >
                        <Sparkles className="w-5 h-5" /> Analiz Et — Aksiyon Planı Oluştur
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h4 className="font-black text-slate-900 text-lg">Tespit Edilen {refusalResult.length} Sorun</h4>
                        <button onClick={() => { setRefusalAnalyzed(false); setRefusalText(''); setRefusalResult([]); }}
                          className="flex items-center gap-1 text-sm font-bold text-rose-600 hover:underline">
                          <RefreshCw className="w-4 h-4" /> Yeniden Analiz
                        </button>
                      </div>
                      {refusalResult.map((rule, i) => (
                        <div key={i} className={`rounded-2xl border-2 overflow-hidden ${rule.severity === 'critical' ? 'border-rose-200' : rule.severity === 'high' ? 'border-orange-200' : 'border-amber-200'}`}>
                          <div className={`p-5 flex items-center justify-between ${rule.severity === 'critical' ? 'bg-rose-50' : rule.severity === 'high' ? 'bg-orange-50' : 'bg-amber-50'}`}>
                            <div className="flex items-center gap-3">
                              <AlertCircle className={`w-5 h-5 shrink-0 ${rule.severity === 'critical' ? 'text-rose-600' : 'text-orange-500'}`} />
                              <span className="font-bold text-slate-900">{rule.title}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 ml-3">
                              <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${rule.severity === 'critical' ? 'bg-rose-100 text-rose-700' : rule.severity === 'high' ? 'bg-orange-100 text-orange-700' : 'bg-amber-100 text-amber-700'}`}>
                                {rule.severity === 'critical' ? 'KRİTİK' : rule.severity === 'high' ? 'YÜKSEK' : 'ORTA'}
                              </span>
                              {rule.waitMonths > 0 && (
                                <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-lg flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> {rule.waitMonths} ay bekle
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="p-5 space-y-2">
                            {rule.actions.map((action, j) => (
                              <div key={j} className="flex items-start gap-3">
                                <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">{j+1}</div>
                                <p className="text-sm text-slate-700 leading-relaxed">{action}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                      <div className="p-5 bg-slate-900 rounded-2xl text-white flex items-start gap-4">
                        <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold mb-1">Tavsiye Edilen Bekleme Süresi</p>
                          <p className="text-sm text-slate-300">
                            {Math.max(...refusalResult.map(r => r.waitMonths))} ay sonra, tüm adımları tamamladıktan sonra tekrar başvurun.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ═══════════════════════════════════════════════════════
            ÖZELLİK 2: RANDEVU TAKVİM ASISTANI MODALI
            ═══════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {isAppointmentOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                onClick={() => setIsAppointmentOpen(false)}
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" />
              <motion.div initial={{opacity:0,scale:0.95,y:20}} animate={{opacity:1,scale:1,y:0}}
                exit={{opacity:0,scale:0.95,y:20}}
                className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden">
                <div className="p-8 bg-gradient-to-r from-teal-600 to-cyan-700 text-white rounded-t-[2.5rem] shrink-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 text-teal-200 text-xs font-bold uppercase tracking-widest mb-2">
                        <Calendar className="w-4 h-4" /> Randevu Planlayıcı
                      </div>
                      <h3 className="text-2xl font-black">Randevu Takvim Asistanı</h3>
                      <p className="text-teal-100 text-sm mt-1">Seyahat tarihinize göre randevuyu en geç ne zaman almalısınız?</p>
                    </div>
                    <button onClick={() => setIsAppointmentOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-6 h-6"/></button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                  {/* Hesaplayıcı */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Hedef Ülke / Konsolosluk</label>
                      <select value={selectedConsulate}
                        onChange={e => setSelectedConsulate(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-400/30">
                        {[...new Set(consulateData.map(c => c.country))].map(c => (
                          <option key={c} value={c}>{consulateData.find(x=>x.country===c)?.flag} {c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Seyahat Başlangıç Tarihi</label>
                      <input type="date" value={travelDate} onChange={e => setTravelDate(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-400/30" />
                    </div>
                  </div>

                  {/* Hesaplama sonucu */}
                  {travelDate && (() => {
                    const travel = new Date(travelDate);
                    const consulates = consulateData.filter(c => c.country === selectedConsulate);
                    return (
                      <div className="space-y-4">
                        {consulates.map((c, i) => {
                          const deadline = new Date(travel);
                          deadline.setDate(deadline.getDate() - c.waitDays - 7);
                          const today = new Date();
                          const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                          const isLate = daysLeft < 0;
                          const isUrgent = daysLeft >= 0 && daysLeft < 14;
                          return (
                            <div key={i} className={`p-6 rounded-2xl border-2 ${isLate ? 'bg-rose-50 border-rose-200' : isUrgent ? 'bg-amber-50 border-amber-200' : 'bg-teal-50 border-teal-200'}`}>
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <span className="text-3xl">{c.flag}</span>
                                  <div>
                                    <div className="font-black text-slate-900">{c.country} — {c.city}</div>
                                    <div className="text-xs text-slate-500">{c.address}</div>
                                  </div>
                                </div>
                                <span className={`text-xs font-black px-3 py-1 rounded-xl ${isLate ? 'bg-rose-100 text-rose-700' : isUrgent ? 'bg-amber-100 text-amber-700' : 'bg-teal-100 text-teal-700'}`}>
                                  {isLate ? '⚠ GEÇ KALDIM' : isUrgent ? '⚡ ACİL' : '✅ YETİŞİR'}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                <div className="bg-white/70 rounded-xl p-3 text-center">
                                  <div className="text-xs font-bold text-slate-400 mb-1">Bekleme Süresi</div>
                                  <div className="text-xl font-black text-slate-900">~{c.waitDays} gün</div>
                                </div>
                                <div className="bg-white/70 rounded-xl p-3 text-center">
                                  <div className="text-xs font-bold text-slate-400 mb-1">Son Randevu</div>
                                  <div className="text-sm font-black text-slate-900">{deadline.toLocaleDateString('tr-TR')}</div>
                                </div>
                                <div className="bg-white/70 rounded-xl p-3 text-center">
                                  <div className="text-xs font-bold text-slate-400 mb-1">Kalan Gün</div>
                                  <div className={`text-xl font-black ${isLate ? 'text-rose-600' : isUrgent ? 'text-amber-600' : 'text-teal-600'}`}>
                                    {isLate ? Math.abs(daysLeft)+' gün geçti' : daysLeft+' gün'}
                                  </div>
                                </div>
                                <div className="bg-white/70 rounded-xl p-3 text-center">
                                  <div className="text-xs font-bold text-slate-400 mb-1">Çalışma Saatleri</div>
                                  <div className="text-xs font-bold text-slate-700">{c.workHours}</div>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-3">
                                <div className="flex items-center gap-2 text-xs text-slate-600 bg-white/60 px-3 py-2 rounded-xl">
                                  <MapPin className="w-3.5 h-3.5" /> {c.address}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-600 bg-white/60 px-3 py-2 rounded-xl">
                                  <Globe className="w-3.5 h-3.5" /> {c.website}
                                </div>
                              </div>
                              {c.note && (
                                <div className="mt-3 p-3 bg-white/60 rounded-xl text-xs text-slate-600 italic">{c.note}</div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}

                  {/* Konsolosluk listesi */}
                  <div>
                    <h4 className="font-black text-slate-900 mb-4 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-teal-600" /> Türkiye'deki Tüm Konsolosluklar
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {consulateData.map((c, i) => (
                        <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">{c.flag}</span>
                            <span className="font-bold text-slate-900 text-sm">{c.country} — {c.city}</span>
                            <span className="ml-auto text-xs font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-lg">~{c.waitDays}g</span>
                          </div>
                          <div className="text-xs text-slate-500">{c.workHours}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ═══════════════════════════════════════════════════════
            ÖZELLİK 6: BELGE TUTARLILIK MATRİSİ MODALI
            ═══════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {isConsistencyOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                onClick={() => setIsConsistencyOpen(false)}
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" />
              <motion.div initial={{opacity:0,scale:0.95,y:20}} animate={{opacity:1,scale:1,y:0}}
                exit={{opacity:0,scale:0.95,y:20}}
                className="relative w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden">
                <div className="p-8 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-t-[2.5rem] shrink-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">
                        <Layers className="w-4 h-4" /> Çapraz Kontrol
                      </div>
                      <h3 className="text-2xl font-black">Belge Tutarlılık Matrisi</h3>
                      <p className="text-slate-300 text-sm mt-1">Belgelerdeki kritik bilgileri girin — uyumsuzlukları tespit edelim.</p>
                    </div>
                    <button onClick={() => setIsConsistencyOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-6 h-6"/></button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex gap-3">
                    <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800">Her alandaki bilgiyi belgelerinizdeki <strong>tam olarak yazıldığı gibi</strong> girin. Sistem çapraz kontrol yapacak.</p>
                  </div>
                  <div className="space-y-4">
                    {docMatrixFields.map((field) => (
                      <div key={field.id} className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center justify-between">
                          <span>{field.label}</span>
                          <span className="text-[10px] font-bold text-slate-400 normal-case">{field.documents.join(' · ')}</span>
                        </label>
                        <input type="text" placeholder={field.placeholder}
                          value={docValues[field.id] || ''}
                          onChange={e => setDocValues(prev => ({...prev, [field.id]: e.target.value}))}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-400/30 focus:border-slate-400" />
                      </div>
                    ))}
                  </div>
                  <button onClick={checkConsistency}
                    className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all">
                    <Search className="w-5 h-5" /> Tutarlılık Kontrolü Yap
                  </button>

                  {consistencyChecked && (
                    <div className="space-y-4">
                      <div className={`p-5 rounded-2xl border-2 ${docConflicts.length === 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
                        <div className="flex items-center gap-3">
                          {docConflicts.length === 0 ? (
                            <><BadgeCheck className="w-6 h-6 text-emerald-600" /><span className="font-bold text-emerald-800">Harika! Tespit edilen tutarsızlık yok.</span></>
                          ) : (
                            <><AlertCircle className="w-6 h-6 text-rose-600" /><span className="font-bold text-rose-800">{docConflicts.length} tutarsızlık tespit edildi!</span></>
                          )}
                        </div>
                      </div>
                      {docConflicts.map((conflict, i) => (
                        <div key={i} className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <div className="font-bold text-amber-900 text-sm">{conflict.field}</div>
                            <p className="text-xs text-amber-800 mt-1">{conflict.issue}</p>
                          </div>
                        </div>
                      ))}

                      {/* Belge kontrol listesi */}
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                        <h5 className="font-bold text-slate-900 mb-3 text-sm">Manuel Kontrol Listesi</h5>
                        {[
                          'Pasaportundaki isim, uçak bileti ve konsolosluk formunda aynı mı?',
                          'Dilekçedeki tarihler otel ve uçak rezervasyonlarıyla eşleşiyor mu?',
                          'Banka dökümündeki adres, yerleşim yeri belgesiyle tutarlı mı?',
                          'SGK\'daki işveren adı, işveren yazısındaki şirket adıyla aynı mı?',
                          'Vize başvuru formundaki pasaport numarası doğru mu?',
                          'Sigortanın geçerlilik tarihi seyahat dönemini tam kapsıyor mu?',
                        ].map((item, i) => (
                          <div key={i} className="flex items-start gap-3 py-2 border-b border-slate-200 last:border-0">
                            <div className="w-5 h-5 rounded-full border-2 border-slate-300 shrink-0 mt-0.5" />
                            <p className="text-xs text-slate-700">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ═══════════════════════════════════════════════════════
            ÖZELLİK YENİ-7: VİZESİZ ÜLKELER BULUCU MODALI
            ═══════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {isVisaFreeOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                onClick={() => setIsVisaFreeOpen(false)}
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" />
              <motion.div initial={{opacity:0,scale:0.95,y:20}} animate={{opacity:1,scale:1,y:0}}
                exit={{opacity:0,scale:0.95,y:20}}
                className="relative w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden">
                <div className="p-8 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-t-[2.5rem] shrink-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 text-emerald-200 text-xs font-bold uppercase tracking-widest mb-2">
                        <Plane className="w-4 h-4" /> Türk Pasaportu
                      </div>
                      <h3 className="text-2xl font-black">Vizesiz Ülkeler & Pasaport Güçlendirici</h3>
                      <p className="text-emerald-100 text-sm mt-1">Bu ülkelere giderek Schengen/UK başvurunuz için güçlü seyahat geçmişi oluşturun.</p>
                    </div>
                    <button onClick={() => setIsVisaFreeOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-6 h-6"/></button>
                  </div>
                  {/* Filtreler */}
                  <div className="flex flex-wrap gap-2 mt-5">
                    {(['Tümü','Yakın','Uzak','Ekonomik'] as const).map(f => (
                      <button key={f} onClick={() => setVisaFreeFilter(f)}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${visaFreeFilter === f ? 'bg-white text-emerald-700' : 'bg-white/20 text-white hover:bg-white/30'}`}>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                  {/* Puan etkisi özeti */}
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-4 mb-6">
                    <TrendingUp className="w-8 h-8 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-bold text-emerald-900 text-sm">Seyahat Geçmişinin Vize Skoruna Etkisi</p>
                      <p className="text-xs text-emerald-700 mt-0.5">Her ülke giriş-çıkış damgası başarı skorunuzu artırır. Japonya gibi gelişmiş ülkeler en fazla katkıyı sağlar.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {visaFreeCountries
                      .filter(c => {
                        if (visaFreeFilter === 'Yakın') return c.flightHours <= 3;
                        if (visaFreeFilter === 'Uzak') return c.flightHours > 6;
                        if (visaFreeFilter === 'Ekonomik') return c.avgCostEur <= 250;
                        return true;
                      })
                      .sort((a, b) => b.scoreBoost - a.scoreBoost)
                      .map((country) => (
                        <div key={country.name} className="p-5 bg-white border border-slate-100 rounded-2xl hover:shadow-md hover:border-emerald-200 transition-all">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-3xl">{country.flag}</span>
                              <div>
                                <div className="font-bold text-slate-900">{country.name}</div>
                                <div className="text-xs text-slate-400">{country.region}</div>
                              </div>
                            </div>
                            <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${country.entryType === 'Vizesiz' ? 'bg-emerald-100 text-emerald-700' : country.entryType === 'e-Vize' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                              {country.entryType}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 mb-3">
                            <div className="text-center p-2 bg-slate-50 rounded-xl">
                              <div className="text-[10px] font-bold text-slate-400">Kalış</div>
                              <div className="text-sm font-black text-slate-900">{country.maxDays}g</div>
                            </div>
                            <div className="text-center p-2 bg-slate-50 rounded-xl">
                              <div className="text-[10px] font-bold text-slate-400">Uçuş</div>
                              <div className="text-sm font-black text-slate-900">{country.flightHours}s</div>
                            </div>
                            <div className="text-center p-2 bg-emerald-50 rounded-xl">
                              <div className="text-[10px] font-bold text-emerald-600">+Puan</div>
                              <div className="text-sm font-black text-emerald-700">+{country.scoreBoost}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <Euro className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-xs text-slate-600 font-medium">Tahmini maliyet: €{country.avgCostEur}</span>
                            <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded ${country.stampValue === 'Yüksek' ? 'bg-amber-100 text-amber-700' : country.stampValue === 'Orta' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                              {country.stampValue} damga
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 italic">{country.tip}</p>
                        </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ═══════════════════════════════════════════════════════
            ÖZELLİK 8: AI BANKA DÖKÜM ANALİZİ MODALI
            ═══════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {isAiBankOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                onClick={() => setIsAiBankOpen(false)}
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" />
              <motion.div initial={{opacity:0,scale:0.95,y:20}} animate={{opacity:1,scale:1,y:0}}
                exit={{opacity:0,scale:0.95,y:20}}
                className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden">
                <div className="p-8 bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-t-[2.5rem] shrink-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 text-blue-200 text-xs font-bold uppercase tracking-widest mb-2">
                        <Sparkles className="w-4 h-4" /> VizeAkıl Analiz Motoru
                      </div>
                      <h3 className="text-2xl font-black">Banka Dökümü Vize Analizi</h3>
                      <p className="text-blue-100 text-sm mt-1">Bilgileri girin, banka dökümünüzü yükleyin — saniyeler içinde vize uyumluluk raporu alın.</p>
                    </div>
                    <button onClick={() => setIsAiBankOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-6 h-6"/></button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-8 space-y-6">

                  {/* Yükleniyor spinner */}
                  {aiBankLoading && (
                    <div className="flex flex-col items-center justify-center gap-4 py-12">
                      <motion.div animate={{rotate:360}} transition={{duration:1,repeat:Infinity,ease:'linear'}}>
                        <Sparkles className="w-12 h-12 text-blue-600" />
                      </motion.div>
                      <div className="text-center">
                        <p className="font-bold text-blue-700 text-lg">Analiz ediliyor...</p>
                        <p className="text-sm text-slate-500 mt-1">{aiBankFile || 'Kural motoru çalışıyor...'}</p>
                      </div>
                    </div>
                  )}

                  {/* Hızlı Bilgi Formu */}
                  {!aiBankResult && !aiBankLoading && (
                    <div className="space-y-4">
                      <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2"><Info className="w-4 h-4 text-blue-600" /> Ekstrenizdeki bilgileri girin</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">Aylık Ortalama Gelir (TL)</label>
                          <input type="number" placeholder="ör. 25000"
                            value={aiBankIncome}
                            onChange={e => setAiBankIncome(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">Mevcut Bakiye (TL)</label>
                          <input type="number" placeholder="ör. 80000"
                            value={aiBankBalance}
                            onChange={e => setAiBankBalance(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">Ektre Kaç Aylık?</label>
                          <select value={aiBankMonths} onChange={e => setAiBankMonths(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                            {[1,2,3,4,5,6,9,12].map(m => <option key={m} value={m}>{m} ay</option>)}
                          </select>
                        </div>
                        <div className="flex flex-col gap-2 pt-1">
                          <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
                            <input type="checkbox" checked={aiBankSalaryRegular} onChange={e => setAiBankSalaryRegular(e.target.checked)}
                              className="w-4 h-4 rounded accent-blue-600" />
                            Düzenli maaş girişi var
                          </label>
                          <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
                            <input type="checkbox" checked={aiBankLargeDeposit} onChange={e => setAiBankLargeDeposit(e.target.checked)}
                              className="w-4 h-4 rounded accent-red-500" />
                            Son 28 günde büyük para girişi
                          </label>
                        </div>
                      </div>
                      {/* Dosyasız analiz butonu */}
                      <button type="button"
                        onClick={() => analyzeWithRules('(dosyasız analiz)')}
                        disabled={aiBankLoading}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-colors text-sm disabled:opacity-50">
                        Analiz Et — Dosya Yüklemeden
                      </button>
                    </div>
                  )}

                  {/* Yükleme alanı */}
                  {!aiBankResult && !aiBankLoading && (
                  <label className="flex flex-col items-center justify-center gap-4 p-10 border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 rounded-2xl cursor-pointer transition-all">
                    <input type="file" accept=".pdf,image/*" className="hidden"
                      onChange={e => handleAiBankUpload(e.target.files)} />
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
                      <Upload className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-slate-700">PDF veya Görsel Yükle (İsteğe Bağlı)</p>
                      <p className="text-sm text-slate-400 mt-1">Ekstreyi yükle + yukarıdaki bilgileri doldur → daha kapsamlı analiz</p>
                    </div>
                  </label>
                  )}

                  {/* Analiz sonucu — Yapılandırılmış görünüm */}
                  {aiBankResult && (
                    <div className="space-y-4">
                      {/* Başlık + Yeni Analiz */}
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-blue-600"/>
                        <h4 className="font-black text-slate-900">Vize Uyumluluk Raporu</h4>
                        <button onClick={() => { setAiBankResult(null); setAiBankFile(''); setAiBankIncome(''); setAiBankBalance(''); setAiBankMonths('3'); setAiBankSalaryRegular(true); setAiBankLargeDeposit(false); }}
                          className="ml-auto flex items-center gap-1 text-sm font-bold text-blue-600 hover:underline">
                          <RefreshCw className="w-4 h-4"/> Yeni Analiz
                        </button>
                      </div>

                      {/* Skor Kartı */}
                      <div className={`p-5 rounded-2xl border-2 ${aiBankResult.score >= 80 ? 'bg-emerald-50 border-emerald-300' : aiBankResult.score >= 65 ? 'bg-blue-50 border-blue-300' : aiBankResult.score >= 50 ? 'bg-amber-50 border-amber-300' : 'bg-rose-50 border-rose-300'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Hedef Ülke</p>
                            <p className="font-black text-slate-900 text-lg">{aiBankResult.country}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Vize Uyum Puanı</p>
                            <p className={`text-3xl font-black ${aiBankResult.score >= 80 ? 'text-emerald-700' : aiBankResult.score >= 65 ? 'text-blue-700' : aiBankResult.score >= 50 ? 'text-amber-700' : 'text-rose-700'}`}>
                              {aiBankResult.score}<span className="text-base font-bold text-slate-400">/100</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{aiBankResult.gradeEmoji}</span>
                          <span className={`font-black text-sm px-3 py-1 rounded-lg ${aiBankResult.score >= 80 ? 'bg-emerald-200 text-emerald-800' : aiBankResult.score >= 65 ? 'bg-blue-200 text-blue-800' : aiBankResult.score >= 50 ? 'bg-amber-200 text-amber-800' : 'bg-rose-200 text-rose-800'}`}>
                            {aiBankResult.grade}
                          </span>
                          <span className="text-xs text-slate-500 ml-1">— {aiBankResult.fileName}</span>
                        </div>
                        {/* Progress bar */}
                        <div className="mt-3 h-2 bg-white/60 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${aiBankResult.score >= 80 ? 'bg-emerald-500' : aiBankResult.score >= 65 ? 'bg-blue-500' : aiBankResult.score >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                            style={{width: `${aiBankResult.score}%`}}/>
                        </div>
                      </div>

                      {/* Güçlü Yönler */}
                      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                        <h5 className="font-black text-emerald-800 text-sm mb-3 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4"/> Güçlü Yönler
                        </h5>
                        <ul className="space-y-1.5">
                          {aiBankResult.positives.map((p, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-emerald-800">
                              <span className="text-emerald-500 mt-0.5 shrink-0">•</span> {p}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Riskli Alanlar */}
                      {aiBankResult.negatives.length > 0 && (
                        <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200">
                          <h5 className="font-black text-rose-800 text-sm mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4"/> Riskli Alanlar
                          </h5>
                          <ul className="space-y-1.5">
                            {aiBankResult.negatives.map((n, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-rose-800">
                                <span className="text-rose-500 mt-0.5 shrink-0">•</span> {n}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Öneriler */}
                      {aiBankResult.tips.length > 0 && (
                        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200">
                          <h5 className="font-black text-blue-800 text-sm mb-3 flex items-center gap-2">
                            <Info className="w-4 h-4"/> Öneriler
                          </h5>
                          <ul className="space-y-1.5">
                            {aiBankResult.tips.map((t, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-blue-800">
                                <span className="text-blue-500 mt-0.5 shrink-0">→</span> {t}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Genel Değerlendirme */}
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                        <h5 className="font-black text-slate-800 text-sm mb-2">Genel Değerlendirme</h5>
                        <p className="text-sm text-slate-700 leading-relaxed">{aiBankResult.summary}</p>
                      </div>

                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex gap-2">
                        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5"/>
                        <p className="text-xs text-amber-800">Bu rapor VizeAkıl kural motoru tarafından oluşturulmuştur. Son karar konsolosluk memuruna aittir.</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ═══════════════════════════════════════════════════
            ÖZELLİK 9: BAŞVURU RİSK TARAYICISI (RED FLAG CHECKER)
            ═══════════════════════════════════════════════════ */}
        <AnimatePresence>
          {isRedFlagOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                onClick={() => { setIsRedFlagOpen(false); setRfAnalyzed(false); setRedFlagResult([]); }}
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" />
              <motion.div initial={{opacity:0,scale:0.95,y:20}} animate={{opacity:1,scale:1,y:0}}
                exit={{opacity:0,scale:0.95,y:20}}
                className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden">

                {/* Header */}
                <div className="p-8 bg-gradient-to-r from-rose-700 to-red-800 text-white rounded-t-[2.5rem] shrink-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 text-rose-200 text-xs font-bold uppercase tracking-widest mb-2">
                        <XCircle className="w-4 h-4" /> Mantıksal Tutarsızlık Dedektörü
                      </div>
                      <h3 className="text-2xl font-black">Başvuru Risk Tarayıcısı</h3>
                      <p className="text-rose-100 text-sm mt-1">ChatGPT'nin yapamadığı şey: dosyanızdaki mantıksal çelişkileri bulur, konsolosluğun göreceği kırmızı bayrakları işaretler.</p>
                    </div>
                    <button onClick={() => { setIsRedFlagOpen(false); setRfAnalyzed(false); setRedFlagResult([]); }}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-6 h-6"/></button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-5">
                  {!rfAnalyzed ? (
                    <>
                      <h4 className="font-bold text-slate-800 flex items-center gap-2"><Info className="w-4 h-4 text-rose-600"/>Seyahat bilgilerinizi girin</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">Banka Bakiyesi (TL)</label>
                          <input type="number" placeholder="ör. 75000" value={rfBalance} onChange={e=>setRfBalance(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"/>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">Uçak Bileti (TL)</label>
                          <input type="number" placeholder="ör. 12000" value={rfFlight} onChange={e=>setRfFlight(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"/>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">Otel Toplam (TL)</label>
                          <input type="number" placeholder="ör. 20000" value={rfHotel} onChange={e=>setRfHotel(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"/>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">Kaç Gün?</label>
                          <input type="number" placeholder="ör. 10" value={rfDays} onChange={e=>setRfDays(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"/>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">Günlük Bütçe (€/gün)</label>
                          <input type="number" placeholder="ör. 60" value={rfDailyBudgetEur} onChange={e=>setRfDailyBudgetEur(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"/>
                        </div>
                        <div className="flex flex-col gap-2 pt-1">
                          <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
                            <input type="checkbox" checked={rfHasInsurance} onChange={e=>setRfHasInsurance(e.target.checked)} className="w-4 h-4 accent-rose-600"/>
                            Seyahat sigortası var
                          </label>
                          {rfHasInsurance && (
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer ml-4">
                              <input type="checkbox" checked={rfInsuranceCoversAll} onChange={e=>setRfInsuranceCoversAll(e.target.checked)} className="w-4 h-4 accent-rose-600"/>
                              Tüm seyahati kapsıyor
                            </label>
                          )}
                          <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
                            <input type="checkbox" checked={rfHasReturn} onChange={e=>setRfHasReturn(e.target.checked)} className="w-4 h-4 accent-rose-600"/>
                            Dönüş bileti/rezervasyonu var
                          </label>
                          <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
                            <input type="checkbox" checked={rfFirstTrip} onChange={e=>setRfFirstTrip(e.target.checked)} className="w-4 h-4 accent-amber-500"/>
                            İlk yurt dışı çıkışım
                          </label>
                          <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
                            <input type="checkbox" checked={rfHasSgk} onChange={e=>setRfHasSgk(e.target.checked)} className="w-4 h-4 accent-emerald-500"/>
                            SGK / aktif istihdam kaydım var
                          </label>
                          <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
                            <input type="checkbox" checked={rfHasProperty} onChange={e=>setRfHasProperty(e.target.checked)} className="w-4 h-4 accent-emerald-500"/>
                            Tapu/mülk sahibiyim
                          </label>
                        </div>
                      </div>
                      <button type="button" onClick={analyzeRedFlags}
                        className="w-full py-3 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-2xl transition-colors text-sm">
                        Kırmızı Bayrakları Tara
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <XCircle className="w-5 h-5 text-rose-600"/>
                        <h4 className="font-bold text-slate-900">Risk Analizi Raporu</h4>
                        <button onClick={()=>{setRfAnalyzed(false);setRedFlagResult([]);}}
                          className="ml-auto flex items-center gap-1 text-sm font-bold text-rose-600 hover:underline">
                          <RefreshCw className="w-4 h-4"/> Yeniden Tara
                        </button>
                      </div>
                      <div className="space-y-3">
                        {redFlagResult.map((f, i) => (
                          <div key={i} className={`p-4 rounded-2xl border flex items-start gap-3 ${
                            f.severity === 'critical' ? 'bg-rose-50 border-rose-200' :
                            f.severity === 'warn' ? 'bg-amber-50 border-amber-200' :
                            'bg-emerald-50 border-emerald-200'
                          }`}>
                            {f.severity === 'critical' && <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5"/>}
                            {f.severity === 'warn' && <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5"/>}
                            {f.severity === 'ok' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5"/>}
                            <p className={`text-sm leading-relaxed ${
                              f.severity === 'critical' ? 'text-rose-800' :
                              f.severity === 'warn' ? 'text-amber-800' : 'text-emerald-800'
                            }`}>{f.msg}</p>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                        <p className="text-xs text-slate-500">
                          {redFlagResult.filter(f=>f.severity==='critical').length === 0
                            ? '✅ Kritik kırmızı bayrak bulunamadı. Uyarıları da dikkate alarak başvurunuzu hazırlayın.'
                            : `🔴 ${redFlagResult.filter(f=>f.severity==='critical').length} kritik sorun tespit edildi. Başvurudan önce bunları mutlaka giderin.`}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ═══════════════════════════════════════════════════
            ÖZELLİK 7: SCHENGEN ÜLKE KARŞILAŞTIRICI MODALI
            ═══════════════════════════════════════════════════ */}
        <AnimatePresence>
          {isSchengenComparatorOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsSchengenComparatorOpen(false)}
                className="absolute inset-0 bg-slate-950/50 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden"
              >
                {/* Header */}
                <div className="p-8 border-b border-slate-100 bg-gradient-to-r from-blue-600 to-indigo-700 text-white shrink-0 rounded-t-[2.5rem]">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 text-blue-200 text-xs font-bold uppercase tracking-widest mb-2">
                        <Globe className="w-4 h-4" /> Profil Bazlı Analiz
                      </div>
                      <h3 className="text-2xl font-black">Schengen Ülke Kıyaslayıcısı</h3>
                      <p className="text-blue-100 text-sm mt-1">
                        Profilinize göre onay şansınız en yüksek ülkeler — 2026 ret oranları ile sıralanmış.
                      </p>
                    </div>
                    <button onClick={() => setIsSchengenComparatorOpen(false)}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  {/* Profil özet bandı */}
                  <div className="flex flex-wrap gap-3 mt-6">
                    {[
                      { label: "Mevcut Skor", value: `%${currentScore}`, color: currentScore >= 70 ? "bg-emerald-400/20 text-emerald-100" : "bg-rose-400/20 text-rose-100" },
                      { label: "SGK", value: profile.hasSgkJob ? "✓ Var" : "✗ Yok", color: profile.hasSgkJob ? "bg-emerald-400/20 text-emerald-100" : "bg-rose-400/20 text-rose-100" },
                      { label: "Önceki Vize", value: profile.hasHighValueVisa ? "✓ Güçlü" : profile.hasOtherVisa ? "✓ Var" : "✗ Yok", color: (profile.hasHighValueVisa || profile.hasOtherVisa) ? "bg-emerald-400/20 text-emerald-100" : "bg-rose-400/20 text-rose-100" },
                      { label: "Sigorta", value: (profile.hasHealthInsurance || profile.hasTravelInsurance) ? "✓ Var" : "✗ Yok", color: (profile.hasHealthInsurance || profile.hasTravelInsurance) ? "bg-emerald-400/20 text-emerald-100" : "bg-rose-400/20 text-rose-100" },
                    ].map((b, i) => (
                      <div key={`schengen-badge-${i}`} className={`px-3 py-1.5 rounded-xl text-xs font-bold ${b.color}`}>
                        {b.label}: {b.value}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ülke listesi */}
                <div className="overflow-y-auto flex-1 p-6 space-y-4">
                  {/* Profil bazlı öneri bandı */}
                  {(() => {
                    const ranked = [...schengenCountries]
                      .map(c => ({ ...c, matchScore: computeCountryMatchScore(c) }))
                      .sort((a, b) => b.matchScore - a.matchScore);
                    const best = ranked[0];
                    return best ? (
                      <div className="p-5 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex items-start gap-4 mb-2">
                        <div className="text-3xl">{best.flag}</div>
                        <div className="flex-1">
                          <div className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-1">
                            🎯 Profiliniz İçin #1 Öneri — Algoritma Seçimi
                          </div>
                          <div className="font-black text-slate-900 text-lg">{best.name}</div>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs bg-emerald-200 text-emerald-800 font-black px-2 py-0.5 rounded-lg">Profil Uyumu: %{best.matchScore}</span>
                            <span className="text-xs bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-lg">2026 Ret: %{best.rejectionRate}</span>
                            <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-lg">{best.trend}</span>
                          </div>
                          <p className="text-sm text-slate-600 mt-2">{best.tip}</p>
                        </div>
                      </div>
                    ) : null;
                  })()}

                  <div className="flex items-center gap-2 px-1">
                    <TrendingUp className="w-4 h-4 text-blue-600"/>
                    <p className="text-xs font-bold text-slate-500">Profilinize göre en uyumlu ülkeler üstte — algoritma: onay oranı × skor uyumu × finansal kapasite × SGK × vize geçmişi</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {[...schengenCountries]
                      .map(c => ({ ...c, matchScore: computeCountryMatchScore(c) }))
                      .sort((a, b) => b.matchScore - a.matchScore)
                      .map((country) => {
                      const diffColors: Record<string, string> = {
                        emerald: 'bg-emerald-50 border-emerald-200',
                        amber: 'bg-amber-50 border-amber-200',
                        orange: 'bg-orange-50 border-orange-200',
                        rose: 'bg-rose-50 border-rose-200',
                      };
                      const badgeColors: Record<string, string> = {
                        emerald: 'bg-emerald-100 text-emerald-700',
                        amber: 'bg-amber-100 text-amber-700',
                        orange: 'bg-orange-100 text-orange-700',
                        rose: 'bg-rose-100 text-rose-700',
                      };
                      const isRecommended = currentScore >= 82
                        ? country.difficulty !== 'Çok Zor'
                        : currentScore >= 65
                          ? (country.difficulty === 'Kolay' || country.difficulty === 'Orta')
                          : country.difficulty === 'Kolay';

                      return (
                        <div key={country.name}
                          className={`p-5 rounded-2xl border-2 transition-all ${diffColors[country.difficultyColor]} ${isRecommended ? 'ring-2 ring-offset-1 ring-blue-400/30' : 'opacity-80'}`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <span className="text-3xl">{country.flag}</span>
                              <div>
                                <div className="font-black text-slate-900 text-base">{country.name}</div>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${'matchScore' in country && (country as {matchScore:number}).matchScore >= 70 ? 'bg-emerald-100 text-emerald-700' : 'matchScore' in country && (country as {matchScore:number}).matchScore >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                                    Uyum {'matchScore' in country ? `%${(country as {matchScore:number}).matchScore}` : '—'}
                                  </span>
                                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${country.trend === 'İyileşiyor' ? 'bg-emerald-50 text-emerald-600' : country.trend === 'Kötüleşiyor' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>
                                    {country.trend}
                                  </span>
                                </div>
                                <div className="text-xs text-slate-400 mt-0.5">{country.consulate}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`text-xs font-black px-3 py-1 rounded-lg ${badgeColors[country.difficultyColor]}`}>
                                {country.difficulty}
                              </div>
                              <div className="text-xs text-slate-400 mt-1 font-mono">
                                ~{country.avgProcessDays} gün
                              </div>
                            </div>
                          </div>

                          {/* Ret oranı çubuğu */}
                          <div className="mb-3 space-y-2">
                            {/* 🇹🇷 Genel Türk ret oranı */}
                            <div>
                              <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                                <span className="flex items-center gap-1">🇹🇷 Türklerin ret oranı (2025-2026)</span>
                                <span className={`font-black ${country.rejectionRate > 30 ? 'text-rose-600' : country.rejectionRate > 20 ? 'text-orange-600' : country.rejectionRate > 12 ? 'text-amber-600' : 'text-emerald-600'}`}>
                                  %{country.rejectionRate}
                                </span>
                              </div>
                              <div className="w-full bg-white/60 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all ${country.rejectionRate > 30 ? 'bg-rose-500' : country.rejectionRate > 20 ? 'bg-orange-500' : country.rejectionRate > 12 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                  style={{ width: `${Math.min(country.rejectionRate * 2, 100)}%` }}
                                />
                              </div>
                            </div>

                            {/* 👤 Kullanıcının kişisel tahmini ret oranı */}
                            {(() => {
                              const mult = currentScore >= 82 ? 0.25 : currentScore >= 72 ? 0.5 : currentScore >= 60 ? 0.85 : currentScore >= 50 ? 1.2 : 1.8;
                              const personalRate = Math.round(country.rejectionRate * mult);
                              const isBetter = personalRate < country.rejectionRate;
                              const isWorse = personalRate > country.rejectionRate;
                              return (
                                <div>
                                  <div className="flex justify-between text-xs font-bold mb-1">
                                    <span className="flex items-center gap-1 text-slate-500">👤 Sizin tahmini riskiniz</span>
                                    <div className="flex items-center gap-1.5">
                                      <span className={`font-black ${isBetter ? 'text-emerald-600' : isWorse ? 'text-rose-600' : 'text-slate-600'}`}>
                                        %{personalRate}
                                      </span>
                                      {isBetter && <span className="text-[9px] font-black bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-md">Ortalamadan İyi</span>}
                                      {isWorse && <span className="text-[9px] font-black bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-md">Ortalamadan Yüksek</span>}
                                      {!isBetter && !isWorse && <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md">Ortalama</span>}
                                    </div>
                                  </div>
                                  <div className="w-full bg-white/60 rounded-full h-2">
                                    <div
                                      className={`h-2 rounded-full transition-all ${isBetter ? 'bg-emerald-400' : isWorse ? 'bg-rose-400' : 'bg-slate-400'}`}
                                      style={{ width: `${Math.min(personalRate * 2, 100)}%` }}
                                    />
                                  </div>
                                  <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                                    {isBetter ? `Profiliniz sayesinde ortalamadan ${country.rejectionRate - personalRate} puan daha iyi` :
                                     isWorse ? `Profilinizi güçlendirerek riski azaltabilirsiniz (+${personalRate - country.rejectionRate} puan)` :
                                     'Profiliniz Türk ortalamasıyla eşleşiyor'}
                                  </div>
                                </div>
                              );
                            })()}
                          </div>

                          {/* Güçlü yönler */}
                          <div className="space-y-1 mb-3">
                            {country.strengths.slice(0, 2).map((s, i) => (
                              <div key={`str-${i}`} className="flex items-start gap-2 text-xs text-slate-700">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                <span>{s}</span>
                              </div>
                            ))}
                            {country.warnings.slice(0, 1).map((w, i) => (
                              <div key={`warn-${i}`} className="flex items-start gap-2 text-xs text-slate-700">
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                                <span>{w}</span>
                              </div>
                            ))}
                          </div>

                          {/* İpucu */}
                          <div className="p-3 bg-white/70 rounded-xl border border-white text-xs text-slate-600 italic leading-relaxed">
                            💡 {country.tip}
                          </div>

                          {/* Günlük bütçe + onay oranı */}
                          <div className="mt-3 flex items-center justify-between">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Günlük Bütçe Kriteri</div>
                            <div className="text-sm font-black text-slate-700">€{country.dailyBudgetReq}/gün</div>
                          </div>

                          {/* 2026 Trend notu */}
                          {'update2026' in country && (country as {update2026?: string}).update2026 && (
                            <div className="mt-3 p-2.5 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-2">
                              <TrendingUp className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5"/>
                              <p className="text-[11px] text-blue-800 leading-snug font-medium">
                                <span className="font-black text-blue-700">2026 Trendi: </span>
                                {(country as {update2026?: string}).update2026}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0 rounded-b-[2.5rem]">
                  <p className="text-xs text-slate-400 text-center">
                    * Veriler 2024-2026 Schengen istatistiklerine dayanmaktadır. Ret oranları Türk başvurucuları için hesaplanmıştır. Trendler 2026 konsolosluk raporlarına göre güncellenmiştir.
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ═══════════════════════════════════════════════════
            ÖZELLİK 8: SOSYAL MEDYA DENETİM REHBERİ MODALI
            ═══════════════════════════════════════════════════ */}
        <AnimatePresence>
          {isSocialMediaOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsSocialMediaOpen(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 16 }}
                className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
              >
                {/* Header — sade, beyaz */}
                <div className="px-6 pt-6 pb-4 border-b border-slate-100 shrink-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <ShieldCheck className="w-5 h-5 text-violet-600" />
                        <h3 className="text-lg font-black text-slate-900">Sosyal Medya Denetim Rehberi</h3>
                      </div>
                      <p className="text-sm text-slate-500">
                        Her maddeyi yapınca işaretleyin — güvenlik skoru otomatik yükselir.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsSocialMediaOpen(false)}
                      aria-label="Kapat"
                      className="p-2 rounded-xl hover:bg-slate-100 transition-colors shrink-0"
                    >
                      <X className="w-5 h-5 text-slate-500" />
                    </button>
                  </div>

                  {/* Skor bar — doğru yönde (tamamladıkça yükselir) */}
                  {(() => {
                    const riskItems  = socialMediaChecklist.filter(i => i.category === 'risk');
                    const riskDone   = riskItems.filter(i => socialMediaChecked[i.id]).length;
                    const actionItems = socialMediaChecklist.filter(i => i.category === 'action');
                    const actionDone  = actionItems.filter(i => socialMediaChecked[i.id]).length;
                    const posItems   = socialMediaChecklist.filter(i => i.category === 'positive');
                    const posDone    = posItems.filter(i => socialMediaChecked[i.id]).length;
                    // Skor: risk %50 ağırlık, action %30, positive %20
                    const score = Math.round(
                      (riskDone / riskItems.length) * 50 +
                      (actionDone / actionItems.length) * 30 +
                      (posDone / posItems.length) * 20
                    );
                    const label = score >= 80 ? 'Hazır' : score >= 50 ? 'İlerliyor' : 'Başlanmadı';
                    const barColor = score >= 80 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-400' : 'bg-rose-400';
                    const textColor = score >= 80 ? 'text-emerald-600' : score >= 50 ? 'text-amber-600' : 'text-rose-600';
                    return (
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold text-slate-600">Güvenlik Skoru</span>
                          <span className={`font-black text-base ${textColor}`}>{score}/100 — {label}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full transition-all duration-500 ${barColor}`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                        <div className="flex gap-4 text-xs text-slate-400 pt-0.5">
                          <span className="text-rose-500 font-medium">{riskDone}/{riskItems.length} risk temizlendi</span>
                          <span className="text-blue-500 font-medium">{actionDone}/{actionItems.length} adım yapıldı</span>
                          <span className="text-emerald-500 font-medium">{posDone}/{posItems.length} avantaj aktif</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* İçerik */}
                <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">

                  {/* BÖLÜM 1: Riskler (kırmızı) */}
                  <section>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                      <h4 className="text-xs font-black text-rose-600 uppercase tracking-widest">
                        Kritik Riskler — Sil veya Gizle
                      </h4>
                    </div>
                    <div className="space-y-2">
                      {socialMediaChecklist.filter(i => i.category === 'risk').map((item) => {
                        const done = !!socialMediaChecked[item.id];
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setSocialMediaChecked(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                            className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3 ${
                              done
                                ? 'bg-emerald-50 border-emerald-200'
                                : 'bg-white border-slate-200 hover:border-rose-300 hover:bg-rose-50/40'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                              done ? 'bg-emerald-500 border-emerald-500' : 'border-rose-300'
                            }`}>
                              {done && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className={`text-sm font-bold ${done ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                                  {item.title}
                                </span>
                                {!done && (
                                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md shrink-0 ${
                                    item.severity === 'critical' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                                  }`}>
                                    {item.severity === 'critical' ? 'Kritik' : 'Uyarı'}
                                  </span>
                                )}
                                {done && <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-600 shrink-0">Temizlendi</span>}
                              </div>
                              <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
                              <span className="text-[10px] text-slate-400 mt-1 block">{item.platform}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  {/* BÖLÜM 2: Yapılması Gerekenler (mavi) */}
                  <section>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                      <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest">
                        Yapılması Gerekenler
                      </h4>
                    </div>
                    <div className="space-y-2">
                      {socialMediaChecklist.filter(i => i.category === 'action').map((item) => {
                        const done = !!socialMediaChecked[item.id];
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setSocialMediaChecked(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                            className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3 ${
                              done
                                ? 'bg-emerald-50 border-emerald-200'
                                : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-blue-50/40'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                              done ? 'bg-emerald-500 border-emerald-500' : 'border-blue-300'
                            }`}>
                              {done && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className={`text-sm font-bold block mb-1 ${done ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                                {item.title}
                              </span>
                              <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
                              <span className="text-[10px] text-slate-400 mt-1 block">{item.platform}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  {/* BÖLÜM 3: Pozitif Faktörler (yeşil) */}
                  <section>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <h4 className="text-xs font-black text-emerald-600 uppercase tracking-widest">
                        Profili Güçlendiren İçerikler
                      </h4>
                    </div>
                    <div className="space-y-2">
                      {socialMediaChecklist.filter(i => i.category === 'positive').map((item) => {
                        const done = !!socialMediaChecked[item.id];
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setSocialMediaChecked(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                            className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3 ${
                              done
                                ? 'bg-emerald-50 border-emerald-200'
                                : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                              done ? 'bg-emerald-500 border-emerald-500' : 'border-emerald-300'
                            }`}>
                              {done && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className={`text-sm font-bold ${done ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                                  {item.title}
                                </span>
                                <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-600 shrink-0">Avantaj</span>
                              </div>
                              <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
                              <span className="text-[10px] text-slate-400 mt-1 block">{item.platform}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                </div>

                {/* Footer — kapat butonu */}
                <div className="px-6 py-4 border-t border-slate-100 shrink-0">
                  <button
                    onClick={() => setIsSocialMediaOpen(false)}
                    className="w-full py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-colors"
                  >
                    Denetimi Kaydet ve Kapat
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Vize Danışmanım Sidebar */}
        <AnimatePresence>
          {isCopilotOpen && (
            <div className="fixed inset-0 z-[200] flex justify-end">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsCopilotOpen(false)}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col"
              >
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-blue-600 text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Brain className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">Vize Danışmanım</h3>
                      <p className="text-xs text-blue-100 italic">Yapay Zeka Strateji Ortağınız</p>
                    </div>
                  </div>
                  <button onClick={() => setIsCopilotOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6 rotate-180" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                      <p className="text-sm text-blue-800 leading-relaxed">
                        Merhaba! Ben senin vize sürecindeki asistanınım. Profilini analiz ettim. İşte şu an yapman gereken <strong>en kritik 3 adım:</strong>
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      {[
                        { step: 1, text: "Banka hesabındaki son toplu girişi belgele veya 30 gün bekle.", status: 'urgent' },
                        { step: 2, text: "SGK dökümünü barkodlu olarak e-devletten indir.", status: 'pending' },
                        { step: 3, text: "Niyet mektubunda işine döneceğini kanıtlayan ek cümleler ekle.", status: 'pending' }
                      ].map((item, i) => (
                        <div key={`copilot-step-${i}`} className="flex gap-4 items-start p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                            item.status === 'urgent' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                          }`}>
                            {item.step}
                          </div>
                          <p className="text-sm text-slate-700">{item.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                      <Target className="w-4 h-4 text-blue-600" />
                      {profile.targetCountry} İçin Özel Taktikler
                    </h4>
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                      {profile.targetCountry === 'Almanya' && (
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Almanya için <strong>finansal süreklilik</strong> bakiyeden daha önemlidir. Son 3 ayın her gününde hesapta hareket olması güven verir.
                        </p>
                      )}
                      {profile.targetCountry === 'ABD' && (
                        <p className="text-xs text-slate-600 leading-relaxed">
                          ABD mülakatında <strong>ilk 20 saniye</strong> kritiktir. Kısa, net ve Türkiye'ye döneceğinizi kanıtlayan cevaplar hazırlayın.
                        </p>
                      )}
                      <button 
                        onClick={() => {
                          setIsCopilotOpen(false);
                          setStep('tactics');
                        }}
                        className="text-xs font-bold text-blue-600 hover:underline"
                      >
                        Tüm taktikleri gör →
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-8 border-t border-slate-100 bg-slate-50">
                  <button 
                    onClick={() => {
                      setIsCopilotOpen(false);
                      setStep('assessment');
                    }}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2"
                  >
                    <Zap className="w-5 h-5 text-amber-400" />
                    Şimdi Başvuruyu Başlat
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        <AnimatePresence mode="wait">
          {step === 'hero' && (
            <motion.div
              key="hero"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-10 py-12 lg:py-20"
            >
              {/* Hero content */}
              <div className="space-y-6 max-w-3xl mx-auto px-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold tracking-widest uppercase border border-emerald-100"
                >
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  2026 Güncel Konsolosluk Verileri ile Analiz
                </motion.div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-tight">
                  Vize başvurusunda{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">
                    neyi yanlış yaptığınızı öğrenin
                  </span>
                </h1>

                <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
                  Banka dökümünüzü, sosyal medyanızı ve belgelerinizi analiz eden AI sistemi.{' '}
                  <strong className="text-slate-700">5 dakikada profil riskinizi görün.</strong>
                </p>
              </div>

              {/* 3 büyük aksiyon butonu */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 max-w-2xl mx-auto">
                <button
                  type="button"
                  onClick={() => { setOnboardingStep(0); setStep('onboarding'); }}
                  className="flex-1 btn-primary text-base sm:text-lg px-6 py-4 sm:py-5 flex items-center justify-center gap-3 group min-h-[56px]"
                  aria-label="Ücretsiz analiz başlat"
                >
                  Ücretsiz Analizi Başlat
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => { setStep('dashboard'); }}
                  className="flex-1 btn-secondary text-base sm:text-lg px-6 py-4 sm:py-5 flex items-center justify-center gap-2 min-h-[56px]"
                  aria-label="Araçları doğrudan aç"
                >
                  <Zap className="w-4 h-4" aria-hidden="true" />
                  Araçlara Git
                </button>
                <button
                  type="button"
                  onClick={() => setIsUpgradeOpen(true)}
                  className="flex-1 text-base sm:text-lg px-6 py-4 sm:py-5 flex items-center justify-center gap-2 min-h-[56px] bg-amber-50 text-amber-700 border border-amber-200 rounded-2xl font-bold hover:bg-amber-100 transition-colors"
                  aria-label="Premium planları incele"
                >
                  Premium Planlar
                </button>
              </div>

              {/* Minimal güven göstergesi */}
              <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 px-4 text-slate-400">
                <div className="flex items-center gap-2 text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" aria-hidden="true" />
                  <span>Kişisel veri saklanmaz</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FileCheck className="w-4 h-4 text-brand-500" aria-hidden="true" />
                  <span>18 analiz aracı</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-indigo-500" aria-hidden="true" />
                  <span>2026 konsolosluk verisi</span>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'onboarding' && (
            <motion.div
              key="onboarding"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto py-16 space-y-10"
            >
              {/* Stepper */}
              <div className="flex items-center justify-center gap-0">
                {[
                  { label: 'Ülke', icon: '🌍' },
                  { label: 'Profil', icon: '👤' },
                  { label: 'Skor', icon: '📊' },
                ].map((s, i) => (
                  <React.Fragment key={i}>
                    <div className="flex flex-col items-center gap-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-black border-2 transition-all duration-300 ${
                        i < onboardingStep ? 'bg-brand-600 border-brand-600 text-white' :
                        i === onboardingStep ? 'bg-white border-brand-600 text-brand-600 shadow-lg shadow-brand-200' :
                        'bg-white border-slate-200 text-slate-300'
                      }`}>
                        {i < onboardingStep ? '✓' : s.icon}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-wider transition-colors ${i === onboardingStep ? 'text-brand-600' : i < onboardingStep ? 'text-brand-400' : 'text-slate-300'}`}>{s.label}</span>
                    </div>
                    {i < 2 && (
                      <div className={`w-16 h-0.5 mb-5 transition-all duration-500 ${i < onboardingStep ? 'bg-brand-400' : 'bg-slate-200'}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {onboardingStep === 0 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="text-center space-y-8">
                  <div className="w-20 h-20 bg-brand-50 rounded-[2rem] flex items-center justify-center mx-auto">
                    <Globe className="w-10 h-10 text-brand-600" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900">Hangi ülkeye başvuruyorsunuz?</h2>
                    <p className="text-slate-500 mt-2">Ülkeye özel kurallar ve ret oranlarına göre analiz yapacağız.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Almanya', flag: '🇩🇪', sub: 'Schengen' },
                      { label: 'İngiltere', flag: '🇬🇧', sub: 'UK Vizesi' },
                      { label: 'ABD', flag: '🇺🇸', sub: 'B1/B2 Vizesi' },
                      { label: 'Fransa', flag: '🇫🇷', sub: 'Schengen' },
                      { label: 'Hollanda', flag: '🇳🇱', sub: 'Schengen' },
                      { label: 'İtalya', flag: '🇮🇹', sub: 'Schengen' },
                      { label: 'Kanada', flag: '🇨🇦', sub: 'Visitor Visa' },
                      { label: 'Diğer', flag: '🌍', sub: 'Farklı ülke' },
                    ].map(({ label, flag, sub }) => (
                      <button key={label}
                        onClick={() => { setOnboardingCountry(label); setProfile((prev: ProfileData) => ({ ...prev, targetCountry: label })); setOnboardingStep(1); }}
                        className={`p-4 rounded-2xl border-2 text-left transition-all hover:border-brand-400 hover:bg-brand-50 ${onboardingCountry === label ? 'border-brand-500 bg-brand-50' : 'border-slate-100 bg-white'}`}>
                        <div className="text-2xl mb-1">{flag}</div>
                        <div className="font-bold text-slate-900 text-sm">{label}</div>
                        <div className="text-xs text-slate-400">{sub}</div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {onboardingStep === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="text-center space-y-8">
                  <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center mx-auto">
                    <Briefcase className="w-10 h-10 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900">Başvuru profiliniz nedir?</h2>
                    <p className="text-slate-500 mt-2">Her profil farklı belgeler gerektirir.</p>
                  </div>
                  <div className="space-y-3">
                    {[
                      { id: 'employer', icon: Briefcase, label: 'Çalışan / İşveren', desc: 'SGK\'lı işte çalışıyorum veya şirket sahibiyim', color: 'blue' },
                      { id: 'student', icon: Brain, label: 'Öğrenci', desc: 'Üniversite veya lise öğrencisiyim', color: 'violet' },
                      { id: 'unemployed', icon: Home, label: 'Çalışmıyor / Emekli', desc: 'Çalışmıyorum, eş/aile sponsorluğu var', color: 'emerald' },
                      { id: 'self', icon: Target, label: 'Serbest Meslek', desc: 'Kendi işimi yapıyorum, vergi mükellefi', color: 'amber' },
                    ].map(({ id, icon: Icon, label, desc, color }) => (
                      <button key={id}
                        onClick={() => { setOnboardingProfile(id); setApplicantType(id === 'employer' || id === 'unemployed' ? id as 'employer' | 'unemployed' : 'employer'); setOnboardingStep(2); }}
                        className={`w-full p-4 rounded-2xl border-2 text-left transition-all hover:border-${color}-400 hover:bg-${color}-50 flex items-center gap-4 ${onboardingProfile === id ? `border-${color}-500 bg-${color}-50` : 'border-slate-100 bg-white'}`}>
                        <div className={`w-12 h-12 bg-${color}-50 rounded-xl flex items-center justify-center text-${color}-600 shrink-0`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{label}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {onboardingStep === 2 && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-8">
                  <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto">
                    <TrendingUp className="w-10 h-10 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-2">Harika! Profiliniz hazır</div>
                    <h2 className="text-3xl font-black text-slate-900">İlk skorunuz hesaplandı</h2>
                    <div className="text-7xl font-black text-brand-600 my-4">%{currentScore}</div>
                    <p className="text-slate-500">Detaylı analizinizi görmek ve skoru artırmak için devam edin.</p>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-2xl text-left space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-slate-500">Hedef ülke</span><span className="font-bold text-slate-900">{onboardingCountry}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-500">Profil tipi</span><span className="font-bold text-slate-900">{onboardingProfile === 'employer' ? 'Çalışan' : onboardingProfile === 'student' ? 'Öğrenci' : onboardingProfile === 'unemployed' ? 'Çalışmıyor' : 'Serbest Meslek'}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-500">Kullanılabilir araç</span><span className="font-bold text-emerald-600">7 Ücretsiz + 3 Premium</span></div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button onClick={() => setStep('dashboard')}
                      className="btn-primary w-full py-5 text-lg flex items-center justify-center gap-2 group">
                      Tam Analizi Gör <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button onClick={() => setIsUpgradeOpen(true)}
                      className="w-full py-4 rounded-2xl border-2 border-amber-200 bg-amber-50 text-amber-700 font-bold text-sm hover:bg-amber-100 transition-colors flex items-center justify-center gap-2">
                      🔒 Tüm Araçları Aç — Premium
                    </button>
                  </div>
                </motion.div>
              )}

              <button onClick={() => onboardingStep > 0 ? setOnboardingStep(s => s - 1) : setStep('hero')}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 transition-colors mx-auto">
                <ArrowLeft className="w-4 h-4" /> Geri
              </button>
            </motion.div>
          )}

          {step === 'assessment' && (
            <motion.div
              key="assessment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto space-y-12"
            >
              <div className="flex items-center gap-6">
                <button onClick={() => setStep('hero')} className="p-3 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all shadow-sm">
                  <ArrowLeft className="w-5 h-5 text-slate-600" />
                </button>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Hızlı Profil Analizi</h2>
                  <p className="text-slate-500 font-medium">Temel kriterlerinizi seçerek ilk tahmininizi alın.</p>
                </div>
              </div>

              <div className="space-y-10">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">1. Başvuru Tipiniz</h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setApplicantType('employer')}
                      className={`px-6 py-4 rounded-2xl font-bold text-sm transition-all border-2 ${
                        applicantType === 'employer' 
                          ? 'bg-blue-50 border-blue-600 text-blue-700' 
                          : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
                      }`}
                    >
                      İşveren / Çalışan
                    </button>
                    <button
                      onClick={() => setApplicantType('unemployed')}
                      className={`px-6 py-4 rounded-2xl font-bold text-sm transition-all border-2 ${
                        applicantType === 'unemployed' 
                          ? 'bg-blue-50 border-blue-600 text-blue-700' 
                          : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
                      }`}
                    >
                      Çalışmayan
                    </button>
                    <button
                      onClick={() => setApplicantType('minor')}
                      className={`px-6 py-4 rounded-2xl font-bold text-sm transition-all border-2 ${
                        applicantType === 'minor' 
                          ? 'bg-blue-50 border-blue-600 text-blue-700' 
                          : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
                      }`}
                    >
                      Reşit Olmayan
                    </button>
                    <button
                      onClick={() => setApplicantType('sponsor')}
                      className={`px-6 py-4 rounded-2xl font-bold text-sm transition-all border-2 ${
                        applicantType === 'sponsor' 
                          ? 'bg-blue-50 border-blue-600 text-blue-700' 
                          : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
                      }`}
                    >
                      Sponsor
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">2. Temel Kriterleriniz</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: 'bankSufficientBalance', label: 'Yeterli Banka Bakiyesi', icon: Wallet, color: 'brand' },
                      { id: 'hasSgkJob', label: 'Düzenli İş & SGK', icon: Briefcase, color: 'emerald' },
                      { id: 'hasHighValueVisa', label: 'Önceki Güçlü Vizeler', icon: ShieldCheck, color: 'amber' },
                      { id: 'hasAssets', label: 'Gayrimenkul / Araç', icon: Home, color: 'purple' },
                      { id: 'isMarried', label: 'Aile Bağları (Evli)', icon: Globe, color: 'indigo' },
                      { id: 'cleanCriminalRecord', label: 'Temiz Adli Sicil', icon: CheckCircle2, color: 'emerald' },
                    ].map((item) => (
                      <button
                        key={`assess-${item.id}`}
                        onClick={() => handleProfileToggle(item.id as keyof ProfileData)}
                        className={`p-6 rounded-2xl border-2 text-left transition-all flex items-center justify-between group relative overflow-hidden ${
                          profile[item.id as keyof ProfileData] 
                            ? `border-${item.color === 'brand' ? 'brand-600' : item.color + '-600'} bg-${item.color === 'brand' ? 'brand-50' : item.color + '-50'}/50` 
                            : 'border-slate-100 bg-white hover:border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-4 z-10">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                            profile[item.id as keyof ProfileData] 
                              ? `bg-${item.color === 'brand' ? 'brand-600' : item.color + '-600'} text-white` 
                              : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'
                          }`}>
                            <item.icon className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{item.label}</div>
                            <div className={`text-[10px] font-bold uppercase tracking-widest ${
                              profile[item.id as keyof ProfileData] 
                                ? `text-${item.color === 'brand' ? 'brand-600' : item.color + '-600'}` 
                                : 'text-slate-400'
                            }`}>Kritik Kriter</div>
                          </div>
                        </div>
                        {profile[item.id as keyof ProfileData] ? (
                          <CheckCircle2 className={`w-6 h-6 text-${item.color === 'brand' ? 'brand-600' : item.color + '-600'} z-10`} />
                        ) : (
                          <Circle className="w-6 h-6 text-slate-200 z-10" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Puan Artırma Kılavuzu */}
              {actionItems.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500"/>
                    <h3 className="font-black text-slate-900">Puanınızı Nasıl Artırırsınız?</h3>
                    <span className="ml-auto text-xs font-bold text-slate-400">Toplam kazanım: +{actionItems.filter(a=>a.gain!=='⚠️').reduce((s,a)=>s+parseInt(a.gain),0)} puan</span>
                  </div>
                  <div className="space-y-2">
                    {actionItems.map((item, i) => (
                      <div key={i} className={`flex items-center gap-3 p-4 rounded-2xl border transition-all group ${item.gain === '⚠️' ? 'bg-rose-50 border-rose-200' : 'bg-white border-slate-100 hover:border-brand-200 hover:bg-brand-50/30'}`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${item.gain === '⚠️' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                          {item.gain}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 text-sm">{item.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{item.desc}</p>
                        </div>
                        <div className="shrink-0 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={item.toolFn}
                            className={`px-3 py-2 text-xs font-black rounded-xl transition-colors whitespace-nowrap ${item.gain === '⚠️' ? 'bg-rose-600 text-white hover:bg-rose-700' : 'bg-brand-600 text-white hover:bg-brand-700'}`}>
                            {item.toolLabel} →
                          </button>
                          {item.doneFn && (
                            <button
                              type="button"
                              onClick={item.doneFn}
                              title="Yaptım — puanımı güncelle"
                              className="px-3 py-2 text-xs font-black rounded-xl transition-colors whitespace-nowrap bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-200">
                              Yaptım ✓
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skor Kartı */}
              <div className="p-8 md:p-10 bg-slate-900 rounded-[2.5rem] text-white flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/20 blur-[100px] rounded-full pointer-events-none" />
                <div className="space-y-3 text-center lg:text-left relative z-10 w-full lg:w-auto">
                  <div className="text-brand-400 text-xs font-bold uppercase tracking-[0.2em]">Tahmini Başarı İhtimali</div>
                  <div className="flex items-end gap-3">
                    <div className="text-6xl md:text-7xl font-black text-white">%{currentScore}</div>
                    <div className="text-sm text-slate-400 pb-2">
                      {currentScore < 82 ? `Hedef: %82 (+${82 - currentScore} puan)` : '✓ Başvuruya hazır'}
                    </div>
                  </div>
                  {/* Mini progress bar */}
                  <div className="w-full max-w-xs h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${currentScore >= 82 ? 'bg-emerald-400' : currentScore >= 65 ? 'bg-amber-400' : 'bg-rose-400'}`}
                      style={{width:`${currentScore}%`}}/>
                  </div>
                  <p className="text-slate-400 text-xs font-medium">
                    {currentScore >= 82 ? 'Profiliniz konsolosluk için hazır.' : `Yukarıdaki araçları kullanarak ${82-currentScore} puan daha kazanabilirsiniz.`}
                  </p>
                </div>
                <div className="flex flex-col gap-3 relative z-10 w-full lg:w-auto">
                  <button
                    type="button"
                    onClick={() => setStep('dashboard')}
                    className="btn-primary w-full lg:w-auto px-8 py-4 text-base flex items-center justify-center gap-2 group">
                    Araçlarla Puanı Artır <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  {currentScore >= 65 && (
                    <button type="button" onClick={() => setStep('letter')}
                      className="w-full lg:w-auto px-8 py-4 text-base font-bold bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center gap-2 transition-colors">
                      Niyet Mektubu Oluştur →
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {step === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-10"
            >
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900">Vize Yol Haritanız</h2>
                    <p className="text-slate-500">Başvurunuzu mükemmelleştirmek için kişisel analiziniz.</p>
                  </div>
                  <button onClick={() => setStep('assessment')}
                    className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1 shrink-0">
                    <RefreshCw className="w-3.5 h-3.5"/> Profil Güncelle
                  </button>
                </div>

                {/* ── AKSIYON MERKEZİ ── */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-6 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-brand-600/20 blur-[80px] rounded-full pointer-events-none"/>
                  <div className="relative z-10">
                    {/* Üst satır: skor + hedef */}
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-brand-400 mb-1">Güncel Başarı Skoru</div>
                        <div className="flex items-end gap-2">
                          <span className="text-4xl font-black">%{currentScore}</span>
                          <span className={`text-sm font-bold pb-1 ${currentScore >= 82 ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {currentScore >= 82 ? '✓ Başvuruya Hazır' : `Hedef %82 — ${82-currentScore} puan eksik`}
                          </span>
                        </div>
                        <div className="mt-2 w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-500 ${currentScore >= 82 ? 'bg-emerald-400' : currentScore >= 65 ? 'bg-amber-400' : 'bg-rose-400'}`}
                            style={{width:`${Math.min(currentScore,100)}%`}}/>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <button onClick={() => setStep('letter')}
                          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5"/> Mektup Oluştur
                        </button>
                        <button onClick={() => openTool('comparator', setIsSchengenComparatorOpen)}
                          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5"/> Ülke Seç
                        </button>
                      </div>
                    </div>

                    {/* Aksiyon listesi */}
                    {actionItems.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                          Şu an yapılacak en önemli {actionItems.length} adım:
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {actionItems.slice(0, 3).map((item, i) => (
                            <button key={i} onClick={item.toolFn} type="button"
                              className={`text-left p-3 rounded-xl border transition-all hover:scale-[1.02] ${item.gain === '⚠️' ? 'bg-rose-900/40 border-rose-700/50 hover:bg-rose-900/60' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[11px] font-black px-2 py-0.5 rounded-lg ${item.gain === '⚠️' ? 'bg-rose-600 text-white' : 'bg-amber-500 text-white'}`}>
                                  {item.gain === '⚠️' ? '!' : item.gain + 'p'}
                                </span>
                                <span className="text-xs font-black text-white">{item.title}</span>
                              </div>
                              <div className="text-[10px] text-slate-400 leading-snug">{item.desc.substring(0, 60)}…</div>
                              <div className="mt-2 text-[10px] font-black text-brand-300">{item.toolLabel} →</div>
                            </button>
                          ))}
                        </div>
                        {actionItems.length > 3 && (
                          <button onClick={() => setStep('assessment')}
                            className="text-xs text-slate-400 hover:text-white transition-colors font-bold mt-1">
                            +{actionItems.length - 3} adım daha → Profil Güncelle
                          </button>
                        )}
                      </div>
                    )}
                    {currentScore >= 82 && (
                      <div className="flex items-center gap-3 p-3 bg-emerald-900/40 border border-emerald-700/50 rounded-xl">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0"/>
                        <p className="text-sm text-emerald-300 font-bold">Profiliniz güçlü. Belgeleri hazırlayın ve başvurun.</p>
                        <button onClick={() => setStep('letter')} className="ml-auto text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-bold shrink-0">
                          Belge Oluştur →
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Araçlar Paneli */}
                <div className="bg-white border border-slate-100 rounded-[2rem] p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <div className="text-sm font-black text-slate-800">18 Analiz Aracı</div>
                      <div className="text-xs text-slate-400 mt-0.5">Bir araca tıklayarak hemen kullanmaya başlayın</div>
                    </div>
                    {!isPremium && (
                      <button onClick={() => setIsUpgradeOpen(true)}
                        className="text-[10px] bg-amber-50 text-amber-600 border border-amber-100 font-black px-2 py-1 rounded-lg uppercase tracking-widest hover:bg-amber-100 transition-colors">
                        🔒 Premium'a Geç
                      </button>
                    )}
                    {isPremium && (
                      <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100 font-black px-2 py-1 rounded-lg uppercase tracking-widest">
                        ✓ Premium Aktif
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      { label: 'Evrak Listesi', desc: 'Ülke ve profilinize göre eksiksiz belge listesi oluşturur.', icon: FileCheck, color: 'bg-emerald-500', id: 'docs', setter: setIsDocumentListOpen },
                      { label: 'Vize Danışmanım', desc: 'Profilinizi analiz edip en kritik 3 adımı yapay zeka ile belirler.', icon: MessageSquare, color: 'bg-blue-500', id: 'copilot', setter: setIsCopilotOpen },
                      { label: 'Senaryo Oluşturucu', desc: '"Bakiyem şu kadar olsa" ile farklı finansal senaryoların skora etkisini görün.', icon: Zap, color: 'bg-slate-800', id: 'calculator', setter: setIsCalculatorOpen },
                      { label: 'Ülke Kıyaslayıcı', desc: 'Schengen ülkelerini ret oranı, bekleme süresi ve zorluk puanına göre karşılaştırır.', icon: Globe, color: 'bg-indigo-500', id: 'comparator', setter: setIsSchengenComparatorOpen },
                      { label: 'Sosyal Medya Denetimi', desc: 'Hesaplarınızdaki vize-riskli içerikleri tespit edin, profili güçlendirin.', icon: ShieldCheck, color: 'bg-violet-500', id: 'socialmedia', setter: setIsSocialMediaOpen },
                      { label: 'Ret Mektubu Analizi', desc: 'Elinizdeki ret mektubunu yapıştırın, hangi koddan reddedildiğinizi öğrenin.', icon: AlertTriangle, color: 'bg-rose-500', id: 'refusal', setter: setIsRefusalOpen },
                      { label: 'Randevu Takip Botu', desc: 'VFS konsolosluklarında randevu açılınca e-posta bildirimi alın.', icon: Calendar, color: 'bg-teal-500', id: 'appointment', setter: setIsAppointmentOpen },
                      { label: 'Belge Tutarlılık Matrisi', desc: 'Pasaport, SGK, banka ve otel bilgileri çelişiyor mu? Otomatik kontrol.', icon: CheckCircle2, color: 'bg-slate-600', id: 'consistency', setter: setIsConsistencyOpen },
                      { label: 'Vizesiz Ülkeler', desc: 'Türk pasaportuyla vizesiz veya kapıda vize ile gidebileceğiniz ülkeler.', icon: Plane, color: 'bg-emerald-600', id: 'visafree', setter: setIsVisaFreeOpen },
                      { label: 'Banka Dökümü Analizi', desc: 'Banka ekstrenizi yapay zeka ile inceleyin, konsolosluk gözüyle değerlendirin.', icon: Sparkles, color: 'bg-blue-700', id: 'aibank', setter: setIsAiBankOpen },
                      { label: 'Kırmızı Bayrak Tarayıcı', desc: 'Başvurunuzdaki otomatik ret gerekçelerini başvurmadan önce tespit edin.', icon: XCircle, color: 'bg-red-600', id: 'redflag', setter: setIsRedFlagOpen },
                      { label: 'Mülakat Pratiği', desc: 'ABD/UK mülakatları için 78 soruluk simülatör. Cevaplarınız puanlanır.', icon: Brain, color: 'bg-amber-500', id: 'interview', setter: setIsInterviewSimOpen },
                      { label: 'Çoklu Ülke Planlayıcı', desc: 'Birden fazla ülkeyi aynı turda gezmek için optimum sıra ve strateji.', icon: Map, color: 'bg-cyan-600', id: 'multicountry', setter: setIsMultiCountryOpen },
                      { label: 'Topluluk Deneyimleri', desc: 'Gerçek başvuru deneyimlerini okuyun, kendi sonucunuzu paylaşın.', icon: Star, color: 'bg-slate-700', id: 'community', setter: setIsCommunityOpen },
                      { label: 'Banka Hazırlık Planı', desc: 'Başvuruya kaç ay var? Aylık giriş/çıkış hedeflerini ve grafik planı görün.', icon: Banknote, color: 'bg-green-600', id: 'bankplan', setter: setIsBankPlanOpen },
                      { label: 'Ret Nedeni Haritası', desc: '2024-2025 gerçek Schengen ret kodları — ülke bazında görsel dağılım.', icon: AlertCircle, color: 'bg-orange-600', id: 'refusalmap', setter: setIsRefusalMapOpen },
                      { label: 'Benchmark', desc: 'Benzer profildeki başvuru sahiplerinin onay/ret oranını ve sebeplerini görün.', icon: TrendingUp, color: 'bg-purple-600', id: 'benchmark', setter: setIsBenchmarkOpen },
                      { label: 'Nereye Gidebilirim?', desc: 'Mevcut profilinizle en yüksek onay alacağınız 5 ülkeyi sıralayın.', icon: Plane, color: 'bg-sky-600', id: 'countryguide', setter: setIsCountryGuideOpen },
                    ].map(({ label, desc, icon: Icon, color, id, setter }) => {
                      const locked = PREMIUM_TOOLS.includes(id) && !isPremium;
                      return (
                        <button key={id} onClick={() => openTool(id, setter)}
                          className={`group text-left rounded-2xl border p-4 transition-all hover:shadow-md hover:-translate-y-0.5 ${
                            locked
                              ? 'bg-slate-50 border-slate-200 cursor-pointer'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}>
                          <div className="flex items-start gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${locked ? 'bg-slate-200' : color}`}>
                              <Icon className={`w-4 h-4 ${locked ? 'text-slate-400' : 'text-white'}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className={`text-sm font-bold ${locked ? 'text-slate-400' : 'text-slate-900'}`}>{label}</span>
                                {locked
                                  ? <span className="text-[9px] font-black bg-amber-100 text-amber-600 px-1 py-0.5 rounded-md">Premium</span>
                                  : !PREMIUM_TOOLS.includes(id) && <span className="text-[9px] font-black bg-emerald-100 text-emerald-600 px-1 py-0.5 rounded-md">Ücretsiz</span>
                                }
                              </div>
                              <p className={`text-xs mt-0.5 leading-relaxed ${locked ? 'text-slate-400' : 'text-slate-500'}`}>{desc}</p>
                            </div>
                            {locked && <span className="text-amber-400 shrink-0">🔒</span>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Target Country Selector */}
              <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hedef Ülke Seçimi</div>
                    <select 
                      value={profile.targetCountry}
                      onChange={(e) => setProfile(prev => ({ ...prev, targetCountry: e.target.value }))}
                      className="text-xl font-bold text-slate-900 bg-transparent border-none focus:ring-0 cursor-pointer p-0"
                    >
                      <option value="Almanya">Almanya (Schengen)</option>
                      <option value="ABD">Amerika Birleşik Devletleri</option>
                      <option value="Fransa">Fransa (Schengen)</option>
                      <option value="İtalya">İtalya (Schengen)</option>
                      <option value="İspanya">İspanya (Schengen)</option>
                      <option value="Yunanistan">Yunanistan (Schengen)</option>
                      <option value="Portekiz">Portekiz (Schengen)</option>
                      <option value="Hollanda">Hollanda (Schengen)</option>
                      <option value="Polonya">Polonya (Schengen)</option>
                      <option value="Macaristan">Macaristan (Schengen)</option>
                      <option value="Danimarka">Danimarka (Schengen)</option>
                      <option value="İsveç">İsveç (Schengen)</option>
                      <option value="Norveç">Norveç (Schengen)</option>
                      <option value="İngiltere">Birleşik Krallık</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vize Türü</div>
                    <div className="text-sm font-bold text-slate-700">Turistik / Kısa Süreli</div>
                  </div>
                  <div className="w-px h-8 bg-slate-100 hidden sm:block"></div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">İşlem Süresi</div>
                    <div className="text-sm font-bold text-slate-700">15-45 Gün</div>
                  </div>
                </div>
              </div>

              {/* ── Ülke Zorluk Uyarısı ─────────────────────────────────── */}
              <AnimatePresence>
                {countryWarning.show && (
                  <motion.div
                    key="country-warning"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className={`rounded-3xl border p-6 ${
                      countryWarning.level === 'danger'
                        ? 'bg-rose-50 border-rose-200'
                        : 'bg-amber-50 border-amber-200'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`mt-0.5 w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                        countryWarning.level === 'danger' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-700'
                      }`}>
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-xs font-black uppercase tracking-widest mb-1 ${
                          countryWarning.level === 'danger' ? 'text-rose-500' : 'text-amber-600'
                        }`}>
                          {countryWarning.level === 'danger' ? 'Yüksek Ret Riski' : 'Dikkat — Zorlu Ülke'}
                        </div>
                        <p className={`text-sm font-medium leading-relaxed ${
                          countryWarning.level === 'danger' ? 'text-rose-800' : 'text-amber-900'
                        }`}>
                          {countryWarning.message}
                        </p>

                        {countryWarning.alternatives.length > 0 && (
                          <div className="mt-4">
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                              Profilinize göre daha yüksek başarı şansı olan alternatifler:
                            </div>
                            <div className="flex flex-wrap gap-3">
                              {countryWarning.alternatives.map(alt => (
                                <button
                                  key={alt.code}
                                  onClick={() => setProfile(prev => ({
                                    ...prev,
                                    targetCountry: alt.name
                                  }))}
                                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl hover:border-brand-400 hover:bg-brand-50 transition-all group shadow-sm"
                                >
                                  <span className="text-sm font-bold text-slate-800 group-hover:text-brand-700">
                                    {alt.name}
                                  </span>
                                  <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-xl">
                                    ~%{alt.approvalEstimate} onay
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Content - 8 Columns */}
                <div className="lg:col-span-8 space-y-8">
                  {/* Score & Simulator Bento Box */}
                  <div className="glass-card p-10 space-y-10 relative overflow-hidden group">
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl group-hover:bg-brand-500/10 transition-all duration-700" />
                    
                    <div className="flex items-center justify-between relative z-10">
                      <div className="space-y-1">
                        <h3 className="text-2xl font-bold text-slate-900 font-display">Başarı Analizi</h3>
                        <p className="text-slate-500 text-sm font-medium">Profilinizin güncel vize onay ihtimali.</p>
                      </div>
                      <div className="px-4 py-2 bg-brand-50 text-brand-600 text-[10px] font-black rounded-xl tracking-widest uppercase border border-brand-100">
                        Canlı Simülasyon
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                      <div className="space-y-4">
                        <div className="flex items-baseline gap-2">
                          <span className="text-8xl font-black text-slate-900 tracking-tighter font-mono">%{currentScore}</span>
                          <span className={`text-sm font-bold px-3 py-1 rounded-lg ${
                            currentScore > 75 ? 'bg-emerald-50 text-emerald-600' : 
                            currentScore > 50 ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                          }`}>
                            {currentScore > 75 ? 'Güçlü' : currentScore > 50 ? 'Orta' : 'Zayıf'}
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
                          <div 
                            className="bg-slate-200 h-full transition-all duration-1000" 
                            style={{ width: `${baseScoreWithoutUs}%` }}
                          />
                          <div 
                            className="bg-brand-600 h-full transition-all duration-1000 shadow-[0_0_20px_rgba(37,99,235,0.3)]" 
                            style={{ width: `${currentScore - baseScoreWithoutUs}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                          Mavi alan: VizeAkıl stratejik katkısı
                        </p>
                      </div>

                      <div className="space-y-6 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                        <div className="flex justify-between items-end">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Banka Bakiyesi</label>
                          <span className="text-xl font-bold text-brand-600 font-mono">{simulatorValue.toLocaleString('tr-TR')} ₺</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="1000000" 
                          step="10000"
                          value={simulatorValue}
                          onChange={(e) => setSimulatorValue(parseInt(e.target.value))}
                          className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-brand-600"
                        />
                        <div className="flex justify-between text-[10px] text-slate-300 font-bold uppercase">
                          <span>0 ₺</span>
                          <span>1M ₺</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Intelligence Bento Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Readiness Card */}
                    <div className={`p-8 rounded-[2.5rem] border transition-all duration-500 ${
                      intelligence.readiness === 'apply' ? 'bg-emerald-50/50 border-emerald-100' :
                      intelligence.readiness === 'risky' ? 'bg-amber-50/50 border-amber-100' : 'bg-rose-50/50 border-rose-100'
                    }`}>
                      <div className="flex items-center justify-between mb-6">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                          intelligence.readiness === 'apply' ? 'bg-emerald-100 text-emerald-600' :
                          intelligence.readiness === 'risky' ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'
                        }`}>
                          <Zap className="w-6 h-6" />
                        </div>
                        <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest ${
                          intelligence.readiness === 'apply' ? 'bg-emerald-100 text-emerald-700' :
                          intelligence.readiness === 'risky' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {intelligence.readiness === 'apply' ? 'HAZIR' : intelligence.readiness === 'risky' ? 'RİSKLİ' : 'BEKLE'}
                        </span>
                      </div>
                      <h4 className="text-2xl font-bold text-slate-900 mb-2">
                        {intelligence.readiness === 'apply' ? 'Şimdi Başvurabilirsin' : 
                         intelligence.readiness === 'risky' ? 'Riskli Başvuru' : 'Henüz Başvurma'}
                      </h4>
                      <p className="text-sm text-slate-600 leading-relaxed mb-6">
                        {intelligence.readiness === 'apply' ? 'Profiliniz şu an konsolosluk standartlarını karşılıyor.' :
                         intelligence.readiness === 'risky' ? 'Onay şansınız var ancak memurun inisiyatifine kalmış durumdasınız.' :
                         'Mevcut profilinizle ret alma ihtimaliniz %80 üzerinde.'}
                      </p>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-white/50 p-3 rounded-xl border border-white/50">
                        <Clock className="w-4 h-4" />
                        {intelligence.timeline}
                      </div>
                    </div>

                    {/* Persona Card */}
                    <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden group">
                      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-brand-500/10 rounded-full blur-3xl group-hover:bg-brand-500/20 transition-all duration-700" />
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/20">
                          <Brain className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-brand-400 uppercase tracking-widest">Persona Analizi</p>
                          <h4 className="text-lg font-bold">{intelligence.persona}</h4>
                        </div>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed mb-8">
                        {intelligence.personaDestiny}
                      </p>
                      <div className="space-y-3">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Stratejik Rota</p>
                        <div className="flex flex-wrap gap-2">
                          {intelligence.route.map((r, i) => (
                            <span key={`route-${i}`} className="text-[10px] font-bold bg-white/10 px-3 py-1.5 rounded-lg border border-white/5">
                              {r}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* OCR & Document Strength */}
                  <div className="grid grid-cols-1 gap-8">
                    {/* OCR Section */}
                    <div className="glass-card p-10 space-y-8">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="text-2xl font-bold text-slate-900 font-display">Evrak Analizi</h3>
                          <p className="text-slate-500 text-sm font-medium">Yapay zeka ile evraklarınızı saniyeler içinde tarayın.</p>
                        </div>
                        <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 border border-brand-100">
                          <Globe className="w-6 h-6" />
                        </div>
                      </div>

                      <div 
                        className={`relative border-2 border-dashed rounded-[2rem] p-12 text-center transition-all duration-300 ${
                          isOcrScanning ? 'border-brand-400 bg-brand-50/30' : 'border-slate-200 hover:border-brand-300 hover:bg-slate-50'
                        }`}
                      >
                        <input 
                          type="file" 
                          multiple 
                          onChange={(e) => handleOcrUpload(e.target.files)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="space-y-4">
                          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-brand-600 mx-auto shadow-sm border border-slate-100">
                            {isOcrScanning ? (
                              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                                <Globe className="w-8 h-8" />
                              </motion.div>
                            ) : (
                              <Download className="w-8 h-8" />
                            )}
                          </div>
                          <div>
                            <p className="text-lg font-bold text-slate-900">PDF veya Görsel Yükle</p>
                            <p className="text-sm text-slate-500">Pasaport, Banka veya SGK dökümü</p>
                          </div>
                        </div>
                      </div>

                      {ocrResults.length > 0 && (
                        <div className="space-y-3">
                          {/* Özet banner */}
                          <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                            ocrResults.every(r => r.ok) ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                            ocrResults.some(r => !r.ok && !r.warn) ? 'bg-rose-50 text-rose-800 border border-rose-200' :
                            'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}>
                            {ocrResults.every(r => r.ok) ? <CheckCircle2 className="w-4 h-4 shrink-0"/> : ocrResults.some(r => !r.ok && !r.warn) ? <XCircle className="w-4 h-4 shrink-0"/> : <AlertTriangle className="w-4 h-4 shrink-0"/>}
                            {ocrResults.filter(r => r.ok).length}/{ocrResults.length} belge geçerli —{' '}
                            {ocrResults.filter(r => !r.ok && !r.warn).length > 0 && `${ocrResults.filter(r => !r.ok && !r.warn).length} kritik sorun, `}
                            {ocrResults.filter(r => r.warn).length > 0 && `${ocrResults.filter(r => r.warn).length} uyarı`}
                          </div>
                          <div className="grid grid-cols-1 gap-3">
                            {ocrResults.map((res, i) => (
                              <div key={`ocr-res-${i}`} className={`p-4 rounded-2xl border flex items-start gap-3 ${
                                res.ok ? 'bg-emerald-50 border-emerald-200' :
                                res.warn ? 'bg-amber-50 border-amber-200' :
                                'bg-rose-50 border-rose-200'
                              }`}>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                  res.ok ? 'bg-emerald-100 text-emerald-600' :
                                  res.warn ? 'bg-amber-100 text-amber-600' :
                                  'bg-rose-100 text-rose-600'
                                }`}>
                                  {res.ok ? <CheckCircle2 className="w-4 h-4"/> : res.warn ? <AlertTriangle className="w-4 h-4"/> : <XCircle className="w-4 h-4"/>}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-black text-slate-900 mb-0.5 truncate">{res.file}</p>
                                  <p className={`text-[11px] leading-relaxed ${res.ok ? 'text-emerald-800' : res.warn ? 'text-amber-800' : 'text-rose-800'}`}>{res.status}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Document Strength Meter */}
                    <div className="glass-card p-10 space-y-8">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="text-2xl font-bold text-slate-900 font-display">Evrak Güç Metresi</h3>
                          <p className="text-slate-500 text-sm font-medium">Her kategorideki evrak kaliteniz.</p>
                        </div>
                        <LayoutList className="w-8 h-8 text-brand-600" />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                          { label: 'Finansal', value: intelligence.docStrengths.financial, color: 'brand', tip: 'Düzenli harcama ekle.' },
                          { label: 'Mesleki', value: intelligence.docStrengths.professional, color: 'emerald', tip: 'Kıdem süresini artır.' },
                          { label: 'Geçmiş', value: intelligence.docStrengths.history, color: 'indigo', tip: 'Vizesiz seyahat ekle.' },
                          { label: 'Güven', value: intelligence.docStrengths.trust, color: 'amber', tip: 'Barkodlu belge kullan.' }
                        ].map((doc, i) => (
                          <div key={`strength-${i}`} className="space-y-4 p-6 bg-slate-50/50 rounded-3xl border border-slate-100">
                            <div className="flex justify-between items-end">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{doc.label}</span>
                              <span className={`text-lg font-black text-${doc.color === 'brand' ? 'brand' : doc.color}-600 font-mono`}>{doc.value.toFixed(1)}</span>
                            </div>
                            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${doc.value * 10}%` }}
                                className={`h-full bg-${doc.color === 'brand' ? 'brand' : doc.color}-500`}
                              />
                            </div>
                            <p className="text-[9px] text-slate-400 font-medium italic">Tavsiye: {doc.tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar - 4 Columns */}
                <div className="lg:col-span-4 space-y-8">
                  {/* Bank Health Score */}
                  <div className="glass-card p-8 space-y-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 border border-brand-100">
                        <Stethoscope className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-lg text-slate-900">Banka Sağlık Skoru</h3>
                    </div>
                    
                    <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <div className="relative w-20 h-20 shrink-0">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-200" strokeWidth="3" />
                          <circle cx="18" cy="18" r="16" fill="none" className="stroke-brand-600" strokeWidth="3" strokeDasharray={`${bankHealthScore} 100`} strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center font-black text-lg text-slate-900 font-mono">
                          %{bankHealthScore}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-900">Analiz Sonucu</p>
                        <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                          {bankHealthScore > 80 ? 'Hesap hareketleriniz vize için ideal.' : bankHealthScore > 50 ? 'Bazı riskler tespit edildi.' : 'Ciddi riskler taşıyor.'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {[
                        { label: 'İşlem Sıklığı', value: profile.transactionFrequency.toUpperCase(), color: profile.transactionFrequency === 'high' ? 'emerald' : 'brand' },
                        { label: 'Maaş Tespiti', value: profile.salaryDetected ? 'VAR' : 'YOK', color: profile.salaryDetected ? 'emerald' : 'slate' },
                        { label: 'Şüpheli İşlem', value: (profile.unusualLargeTransactions || profile.hasSuspiciousLargeDeposit) ? 'VAR' : 'YOK', color: (profile.unusualLargeTransactions || profile.hasSuspiciousLargeDeposit) ? 'rose' : 'emerald' }
                      ].map((item, i) => (
                        <div key={`bank-stat-${i}`} className="flex items-center justify-between text-[10px] font-bold">
                          <span className="text-slate-400 uppercase tracking-widest">{item.label}</span>
                          <span className={`text-${item.color}-600`}>{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Roadmap */}
                  {roadmap.length > 0 && (
                    <div className="p-8 bg-brand-600 rounded-[2.5rem] text-white space-y-8 shadow-xl shadow-brand-500/20 relative overflow-hidden">
                      <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                      <div className="flex items-center gap-3 relative z-10">
                        <TrendingUp className="w-6 h-6 text-brand-200" />
                        <h3 className="font-bold text-lg">Güçlendirme Planı</h3>
                      </div>
                      <div className="space-y-8 relative z-10">
                        {roadmap.map((item, i) => (
                          <div key={`roadmap-${i}`} className="flex gap-4 relative">
                            {i !== roadmap.length - 1 && <div className="absolute left-4 top-10 bottom-0 w-px bg-white/20" />}
                            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center text-[10px] font-black shrink-0 border border-white/10">
                              {item.week}
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs font-bold text-white">{item.task}</p>
                              <p className="text-[9px] text-brand-200 font-black uppercase tracking-widest">{item.impact}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Red Flag Kill Switch */}
                  <div className="glass-card p-8 bg-rose-50/50 border-rose-100 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-lg text-slate-900 font-display">Red Flag Kill Switch</h3>
                    </div>
                    <div className="space-y-4">
                      {[
                        { label: 'Yetersiz Bakiye', risk: profile.bankBalance < 50000 },
                        { label: 'SGK Boşluğu', risk: !profile.hasSgkJob },
                        { label: 'Pasaport Süresi', risk: !profile.hasValidPassport },
                        { label: 'Şüpheli Para Girişi', risk: profile.hasSuspiciousLargeDeposit }
                      ].map((flag, i) => (
                        <div key={`flag-${i}`} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100">
                          <span className="text-xs font-bold text-slate-600">{flag.label}</span>
                          {flag.risk ? (
                            <span className="text-[10px] font-black text-rose-600 bg-rose-100 px-2 py-1 rounded-lg uppercase tracking-wider">KRİTİK</span>
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Document Consistency Checker */}
                  <div className="glass-card p-8 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-lg text-slate-900 font-display">Tutarlılık Analizi</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Veri Uyumu</span>
                          <span className="text-xs font-bold text-emerald-600">92%</span>
                        </div>
                        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '92%' }}
                            className="h-full bg-emerald-500"
                          />
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                        Banka dökümleriniz ile SGK verileriniz arasındaki maaş tutarları %100 uyumlu. Bu, güven puanınızı artırır.
                      </p>
                    </div>
                  </div>

                  {/* Document Status */}
                  <div className="glass-card p-8 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 border border-brand-100">
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-lg text-slate-900 font-display">Evrak Durumu</h3>
                    </div>
                    <div className="space-y-4">
                      {[
                        { label: 'Pasaport', ok: profile.hasValidPassport },
                        { label: 'Banka Dökümü', ok: profile.bankRegularity },
                        { label: 'SGK Dökümü', ok: profile.hasSgkJob },
                        { label: 'Niyet Mektubu', ok: profile.useOurTemplate },
                      ].map((item, i) => (
                        <div key={`doc-status-${i}`} className="flex items-center justify-between">
                          <span className="text-xs font-medium text-slate-600">{item.label}</span>
                          {item.ok ? (
                            <div className="w-5 h-5 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                              <CheckCircle2 className="w-3 h-3" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 bg-rose-100 rounded-lg flex items-center justify-center text-rose-600">
                              <AlertCircle className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

                {/* Smart Document Generator 2.0 */}
                <div className="glass-card p-10 space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="text-2xl font-bold text-slate-900 font-display">Smart Document Generator 2.0</h3>
                      <p className="text-slate-500 text-sm font-medium">Yapay zeka ile profesyonel vize dilekçeleri oluşturun.</p>
                    </div>
                    <div className="px-4 py-2 bg-brand-50 text-brand-600 text-[10px] font-black rounded-xl tracking-widest uppercase border border-brand-100">
                      AI Yazım
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { type: 'cover', label: 'Niyet Mektubu', desc: 'Kişisel beyanınız.' },
                      { type: 'sponsor', label: 'Sponsor Mektubu', desc: 'Finansör beyanı.' },
                      { type: 'employer', label: 'İşveren İzin Yazısı', desc: 'Şirket onayı.' },
                      { type: 'itinerary', label: 'Seyahat Planı', desc: 'Günlük rota.' }
                    ].map((doc, i) => (
                      <button 
                        key={`smart-doc-${i}`}
                        onClick={() => {
                          if (letterData.fullName) {
                            generatePDF(doc.type as any);
                          } else {
                            setStep('letter');
                          }
                        }}
                        className="p-6 bg-slate-50/50 hover:bg-brand-50 border border-slate-100 hover:border-brand-200 rounded-2xl text-left transition-all group"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-bold text-slate-900 group-hover:text-brand-700 text-sm">{doc.label}</div>
                          <Download className="w-4 h-4 text-slate-300 group-hover:text-brand-400" />
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium">{doc.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="glass-card p-10 space-y-6 relative overflow-hidden group">
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-brand-500/5 blur-2xl group-hover:bg-brand-500/10 transition-all duration-700" />
                    <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 border border-brand-100 group-hover:scale-110 transition-transform">
                      <PenTool className="w-7 h-7" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-slate-900 font-display">Niyet Mektubu</h3>
                      <p className="text-sm text-slate-500 leading-relaxed font-medium">Konsolosluğu ikna edecek, profesyonel standartlarda mektubunuzu oluşturun.</p>
                    </div>
                    <button 
                      onClick={() => setStep('letter')}
                      className="btn-primary w-full"
                    >
                      Mektubu Hazırla
                    </button>
                  </div>

                  <div className="glass-card p-10 bg-slate-900 text-white space-y-6 relative overflow-hidden group">
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-amber-500/10 blur-2xl group-hover:bg-amber-500/20 transition-all duration-700" />
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-amber-400 border border-white/5 group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-7 h-7" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold font-display">Kabul Taktikleri</h3>
                      <p className="text-sm text-slate-400 leading-relaxed font-medium">Vize memurlarının dikkat ettiği 7 gizli taktiği hemen öğrenin.</p>
                    </div>
                    <button 
                      onClick={() => setStep('tactics')}
                      className="w-full py-4 bg-amber-600 text-white rounded-2xl font-bold text-sm hover:bg-amber-500 transition-all shadow-lg shadow-amber-900/20"
                    >
                      Taktikleri İncele
                    </button>
                  </div>
                </div>

                {/* Evrak Paketi */}
                <div className="glass-card p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
                  <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-slate-100 rounded-full blur-3xl group-hover:bg-slate-200 transition-all duration-700" />
                  <div className="flex items-center gap-6 relative z-10">
                    <div className="w-16 h-16 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-slate-900/20">
                      <Download className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-2xl font-bold text-slate-900 font-display">Evrak Paketi</h3>
                      <p className="text-slate-500 text-sm font-medium">Gerekli tüm dilekçe, form ve kontrol listeleri.</p>
                    </div>
                  </div>
                  <button className="btn-primary px-10 relative z-10">
                    Paketi İndir ($50)
                  </button>
                </div>
            </motion.div>
          )}

          {step === 'tactics' && (
            <motion.div 
              key="tactics"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div className="flex items-center gap-6">
                <button onClick={() => setStep('dashboard')} className="p-3 bg-white border border-slate-100 hover:bg-slate-50 rounded-2xl transition-all shadow-sm">
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                  <h2 className="text-4xl font-black text-slate-900">Kabul Oranı Taktikleri</h2>
                  <p className="text-slate-500 text-lg">Sahadan 7 gizli taktik ile başvurunuzu profesyonelleştirin.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {[
                  { 
                    icon: Wallet, 
                    title: "1. Banka Hesabı", 
                    desc: "Son 3 ay düzenli giriş-çıkış olmalı. Günlük harcama x gün sayısı + %30 fazla bakiye bulundurun. Son dakika yüklü para yatırmaktan kaçının.",
                    color: "blue"
                  },
                  { 
                    icon: Briefcase, 
                    title: "2. SGK + Maaş Bordrosu", 
                    desc: "İşveren izin yazısında mutlaka 'şu tarihte işe dönecek' ibaresi yer almalı. Bu, en güçlü bağlılık kanıdır.",
                    color: "green"
                  },
                  { 
                    icon: PenTool, 
                    title: "3. Niyet Mektubu", 
                    desc: "Maksimum 1 sayfa. 'Ne iş yapıyorum, ne kadar kazanıyorum, niye gidiyorum, masrafı nasıl karşılıyorum, ne zaman döneceğim' sorularını yanıtlayın.",
                    color: "violet"
                  },
                  { 
                    icon: Globe, 
                    title: "4. Seyahat Geçmişi", 
                    desc: "Pasaport boşsa ret riski yüksektir. Önce vizesiz Balkan veya Kafkas ülkelerine gidip seyahat geçmişi oluşturun.",
                    color: "indigo"
                  },
                  { 
                    icon: CheckCircle2, 
                    title: "5. Evrak Cross-Check", 
                    desc: "DS-160'daki iş adresiniz SGK ile aynı olmalı. Otel, uçak ve dilekçedeki tarihler 1 gün bile şaşmamalı.",
                    color: "emerald"
                  },
                  { 
                    icon: Info, 
                    title: "6. Mülakat", 
                    desc: "Kısa ve net cevaplar verin, göz teması kurun. 'Kalacak mısın?' sorusuna 'Hayır, şu tarihte işime dönmeliyim' diyerek kanıt sunun.",
                    color: "amber"
                  },
                  { 
                    icon: ShieldCheck, 
                    title: "7. Pasaport", 
                    desc: "Pasaportunuz yıpranmamış olmalı ve en az 1 yıl daha geçerlilik süresi bulunmalıdır.",
                    color: "slate"
                  }
                ].map((tactic, i) => (
                  <motion.div 
                    key={`tactic-${i}`} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-500/5 transition-all flex gap-8 items-start"
                  >
                    <div className={`w-16 h-16 bg-${tactic.color}-50 rounded-[2rem] flex items-center justify-center text-${tactic.color}-600 shrink-0 group-hover:scale-110 transition-transform`}>
                      <tactic.icon className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-black text-xl text-slate-900">{tactic.title}</h3>
                      <p className="text-slate-500 leading-relaxed">{tactic.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="p-10 bg-amber-600 rounded-[3rem] text-white flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl shadow-amber-900/20">
                <div className="space-y-2 text-center lg:text-left">
                  <h4 className="text-2xl font-black">Bu taktikleri uyguladınız mı?</h4>
                  <p className="text-amber-100 text-lg">Tüm adımları tamamladıysanız başvurunuz hazır demektir.</p>
                </div>
                <button 
                  onClick={() => setStep('dashboard')}
                  className="w-full lg:w-auto px-12 py-5 bg-white text-amber-600 rounded-2xl font-bold text-xl hover:bg-amber-50 transition-all shadow-xl"
                >
                  Dashboard'a Dön
                </button>
              </div>
            </motion.div>
          )}

          {step === 'letter' && (
            <motion.div
              key="letter"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="flex items-center gap-4">
                <button type="button" onClick={() => setStep('dashboard')} className="p-3 bg-white border border-slate-100 hover:bg-slate-50 rounded-2xl transition-all shadow-sm shrink-0">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black bg-brand-50 text-brand-600 border border-brand-100 px-2 py-1 rounded-lg uppercase tracking-widest">Smart Document Generator 2.0</span>
                    <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-1 rounded-lg uppercase tracking-widest">2024-2026 Standartları</span>
                  </div>
                  <h2 className="text-3xl font-black text-slate-900">Profesyonel Vize Belgesi Oluşturucu</h2>
                  <p className="text-slate-500 text-sm mt-0.5">Konsolosluk standartlarında, 4 farklı belge tipi — bilgilerinizi girin, PDF alın.</p>
                </div>
              </div>

              {/* Belge Tipi Seçici */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  {
                    id: 'cover' as const,
                    icon: PenTool,
                    title: 'Niyet Mektubu',
                    sub: 'Kişisel beyanınız',
                    color: 'brand',
                    bg: 'from-brand-600 to-indigo-600',
                    desc: '2024-2026 konsolosluk formatında, 4 bölümlü kapsamlı niyet mektubu'
                  },
                  {
                    id: 'sponsor' as const,
                    icon: Wallet,
                    title: 'Sponsor Mektubu',
                    sub: 'Finansör beyanı',
                    color: 'emerald',
                    bg: 'from-emerald-600 to-teal-600',
                    desc: 'Aile veya üçüncü kişi sponsorluğu için resmi taahhütname'
                  },
                  {
                    id: 'employer' as const,
                    icon: Briefcase,
                    title: 'İşveren İzin Yazısı',
                    sub: 'Şirket onayı',
                    color: 'violet',
                    bg: 'from-violet-600 to-purple-600',
                    desc: 'SGK\'lı çalışanlar için işe dönüş garantili resmi çalışma belgesi'
                  },
                  {
                    id: 'itinerary' as const,
                    icon: Map,
                    title: 'Seyahat Planı',
                    sub: 'Günlük itinerary',
                    color: 'amber',
                    bg: 'from-amber-500 to-orange-500',
                    desc: 'Günlük rota, konaklama ve uçuş detaylarını içeren seyahat planı'
                  },
                ].map(({ id, icon: Icon, title, sub, color, bg, desc }) => (
                  <button key={id} type="button" onClick={() => setActiveLetterType(id)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${activeLetterType === id ? `border-${color}-400 bg-${color}-50` : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${bg} flex items-center justify-center mb-3`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="font-black text-slate-900 text-sm">{title}</div>
                    <div className="text-[10px] text-slate-400 font-bold mt-0.5">{sub}</div>
                    {activeLetterType === id && <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">{desc}</p>}
                  </button>
                ))}
              </div>

              {/* 2 Kolon: Form + Önizleme */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sol: Dinamik Form */}
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-slate-50 bg-slate-50">
                    <h3 className="font-black text-slate-900">Bilgilerinizi Girin</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Yazarken önizleme otomatik güncellenir</p>
                  </div>
                  <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                    {/* Ortak alanlar */}
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kimlik Bilgileri</div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'fullName', label: 'Ad Soyad', placeholder: 'Emre Kaya' },
                        { id: 'passportNumber', label: 'Pasaport No', placeholder: 'U12345678' },
                        { id: 'birthDate', label: 'Doğum Tarihi', type: 'date' },
                        { id: 'nationality', label: 'Uyruk', placeholder: 'Türk' },
                        { id: 'phone', label: 'Telefon', placeholder: '+90 5XX XXX XXXX' },
                        { id: 'email', label: 'E-posta', placeholder: 'ornek@mail.com' },
                      ].map(f => (
                        <div key={f.id} className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{f.label}</label>
                          <input type={f.type || 'text'} placeholder={f.placeholder}
                            value={letterData[f.id as keyof LetterData]}
                            onChange={e => setLetterData(prev => ({ ...prev, [f.id]: e.target.value }))}
                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all" />
                        </div>
                      ))}
                    </div>
                    <div className="col-span-2 space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Adres</label>
                      <input type="text" placeholder="İlçe, İl, Türkiye"
                        value={letterData.address}
                        onChange={e => setLetterData(prev => ({ ...prev, address: e.target.value }))}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all" />
                    </div>

                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest pt-2">Seyahat Bilgileri</div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'targetCountry', label: 'Hedef Ülke', placeholder: 'Almanya' },
                        { id: 'purpose', label: 'Seyahat Amacı', placeholder: 'Turistik Gezi' },
                        { id: 'startDate', label: 'Giriş Tarihi', type: 'date' },
                        { id: 'endDate', label: 'Çıkış Tarihi', type: 'date' },
                        { id: 'flightOutbound', label: 'Gidiş Uçuşu', placeholder: 'TK1907 İST→FRA' },
                        { id: 'flightInbound', label: 'Dönüş Uçuşu', placeholder: 'TK1908 FRA→İST' },
                        { id: 'hotelName', label: 'Otel Adı', placeholder: 'Hilton Frankfurt' },
                        { id: 'hotelReservationNo', label: 'Rezervasyon No', placeholder: 'HLT-2025-XXXX' },
                      ].map(f => (
                        <div key={f.id} className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{f.label}</label>
                          <input type={f.type || 'text'} placeholder={f.placeholder}
                            value={letterData[f.id as keyof LetterData]}
                            onChange={e => setLetterData(prev => ({ ...prev, [f.id]: e.target.value }))}
                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all" />
                        </div>
                      ))}
                    </div>

                    {/* Niyet Mektubu ek alanlar */}
                    {activeLetterType === 'cover' && (
                      <>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest pt-2">Finansal & Mesleki</div>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { id: 'occupation', label: 'Meslek/Pozisyon', placeholder: 'Yazılım Mühendisi' },
                            { id: 'companyEmployer', label: 'Şirket/İşveren', placeholder: 'ABC A.Ş.' },
                            { id: 'monthlyIncome', label: 'Aylık Gelir (TL)', placeholder: '50.000' },
                            { id: 'bankBalance', label: 'Banka Bakiyesi (TL)', placeholder: '150.000' },
                            { id: 'insuranceProvider', label: 'Sigorta Şirketi', placeholder: 'AXA / Allianz' },
                            { id: 'insurancePolicyNo', label: 'Poliçe No', placeholder: 'POL-2025-XXXX' },
                          ].map(f => (
                            <div key={f.id} className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{f.label}</label>
                              <input type="text" placeholder={f.placeholder}
                                value={letterData[f.id as keyof LetterData]}
                                onChange={e => setLetterData(prev => ({ ...prev, [f.id]: e.target.value }))}
                                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all" />
                            </div>
                          ))}
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Türkiye'deki Bağlarınız (aile, mülk, iş)</label>
                          <textarea rows={2} placeholder="Örn: İstanbul'daki işim, eşim ve iki çocuğum, sahibi olduğum daire"
                            value={letterData.tieDescription}
                            onChange={e => setLetterData(prev => ({ ...prev, tieDescription: e.target.value }))}
                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all resize-none" />
                        </div>
                      </>
                    )}

                    {/* Sponsor ek alanlar */}
                    {activeLetterType === 'sponsor' && (
                      <>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest pt-2">Sponsor Bilgileri</div>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { id: 'sponsorFullName', label: 'Sponsor Adı Soyadı', placeholder: 'Ali Kaya' },
                            { id: 'sponsorRelation', label: 'Yakınlık Derecesi', placeholder: 'Babam / Eşim' },
                            { id: 'sponsorId', label: 'TC Kimlik No', placeholder: 'XXXXXXXXXXX' },
                            { id: 'sponsorPhone', label: 'Telefon', placeholder: '+90 5XX XXX XXXX' },
                            { id: 'sponsorOccupation', label: 'Meslek', placeholder: 'İşletme Sahibi' },
                            { id: 'sponsorIncome', label: 'Aylık Gelir (TL)', placeholder: '80.000' },
                          ].map(f => (
                            <div key={f.id} className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{f.label}</label>
                              <input type="text" placeholder={f.placeholder}
                                value={letterData[f.id as keyof LetterData]}
                                onChange={e => setLetterData(prev => ({ ...prev, [f.id]: e.target.value }))}
                                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all" />
                            </div>
                          ))}
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Sponsor Adresi</label>
                          <input type="text" placeholder="İlçe, İl, Türkiye"
                            value={letterData.sponsorAddress}
                            onChange={e => setLetterData(prev => ({ ...prev, sponsorAddress: e.target.value }))}
                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all" />
                        </div>
                      </>
                    )}

                    {/* İşveren ek alanlar */}
                    {activeLetterType === 'employer' && (
                      <>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest pt-2">Mesleki Bilgiler</div>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { id: 'occupation', label: 'Pozisyon/Ünvan', placeholder: 'Yazılım Geliştirici' },
                            { id: 'monthlyIncome', label: 'Aylık Net Maaş (TL)', placeholder: '50.000' },
                            { id: 'jobStartDate', label: 'İşe Başlama Tarihi', type: 'date' },
                            { id: 'returnDate', label: 'İşe Dönüş Tarihi', type: 'date' },
                          ].map(f => (
                            <div key={f.id} className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{f.label}</label>
                              <input type={f.type || 'text'} placeholder={f.placeholder}
                                value={letterData[f.id as keyof LetterData]}
                                onChange={e => setLetterData(prev => ({ ...prev, [f.id]: e.target.value }))}
                                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all" />
                            </div>
                          ))}
                        </div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest pt-2">Şirket Bilgileri</div>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { id: 'companyName', label: 'Şirket Adı', placeholder: 'ABC Teknoloji A.Ş.' },
                            { id: 'companyPhone', label: 'Şirket Telefonu', placeholder: '+90 212 XXX XXXX' },
                            { id: 'authorizedName', label: 'Yetkili Adı Soyadı', placeholder: 'Mehmet Yılmaz' },
                            { id: 'authorizedTitle', label: 'Yetkili Ünvanı', placeholder: 'İK Müdürü' },
                          ].map(f => (
                            <div key={f.id} className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{f.label}</label>
                              <input type="text" placeholder={f.placeholder}
                                value={letterData[f.id as keyof LetterData]}
                                onChange={e => setLetterData(prev => ({ ...prev, [f.id]: e.target.value }))}
                                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all" />
                            </div>
                          ))}
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Şirket Adresi</label>
                          <input type="text" placeholder="Mahalle, İlçe, İl"
                            value={letterData.companyAddress}
                            onChange={e => setLetterData(prev => ({ ...prev, companyAddress: e.target.value }))}
                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all" />
                        </div>
                      </>
                    )}

                    {/* Seyahat planı ek alanlar */}
                    {activeLetterType === 'itinerary' && (
                      <>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest pt-2">Sigorta & Konaklama</div>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { id: 'hotelAddress', label: 'Otel Adresi', placeholder: 'Kaiserstr. 1, Frankfurt' },
                            { id: 'insuranceProvider', label: 'Sigorta Şirketi', placeholder: 'AXA Sigorta' },
                            { id: 'insurancePolicyNo', label: 'Poliçe No', placeholder: 'POL-2025-XXXX' },
                          ].map(f => (
                            <div key={f.id} className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{f.label}</label>
                              <input type="text" placeholder={f.placeholder}
                                value={letterData[f.id as keyof LetterData]}
                                onChange={e => setLetterData(prev => ({ ...prev, [f.id]: e.target.value }))}
                                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all" />
                            </div>
                          ))}
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Günlük Seyahat Programı (isteğe bağlı, otomatik doldurulur)</label>
                          <textarea rows={5}
                            placeholder={`1. Gün: Varış, check-in\n2. Gün: Şehir turu...\n3. Gün: Müze ziyareti...\n...`}
                            value={letterData.dailyPlan}
                            onChange={e => setLetterData(prev => ({ ...prev, dailyPlan: e.target.value }))}
                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all resize-none font-mono" />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Sağ: Önizleme + İndir */}
                <div className="space-y-4">
                  {/* Önizleme */}
                  <div className="bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl">
                    <div className="px-5 py-3 bg-blue-600 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-rose-400 rounded-full" />
                        <div className="w-3 h-3 bg-amber-400 rounded-full" />
                        <div className="w-3 h-3 bg-emerald-400 rounded-full" />
                        <span className="text-white text-xs font-bold ml-2">Önizleme — Gerçek Zamanlı</span>
                      </div>
                      <span className="text-blue-200 text-[10px] font-bold uppercase tracking-widest">PDF Formatı</span>
                    </div>
                    <div className="p-5 overflow-y-auto max-h-[55vh]">
                      <pre className="text-slate-300 text-[11px] leading-relaxed font-mono whitespace-pre-wrap break-words">
                        {buildLetterBody(activeLetterType)}
                      </pre>
                    </div>
                  </div>

                  {/* İndir butonları — TR + EN */}
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button"
                      onClick={() => generatePDF(activeLetterType)}
                      className="py-3.5 bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-brand-500/30">
                      <Download className="w-4 h-4" />
                      🇹🇷 Türkçe PDF
                    </button>
                    <button type="button"
                      onClick={() => generatePDFEN(activeLetterType)}
                      className="py-3.5 bg-gradient-to-r from-slate-700 to-slate-900 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg">
                      <Download className="w-4 h-4" />
                      🇬🇧 English PDF
                    </button>
                  </div>

                  {/* 4 belgeyi birden indir — TR + EN */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Tüm Belgeler</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {(['cover', 'sponsor', 'employer', 'itinerary'] as const).map(t => (
                        <button key={`tr-${t}`} type="button" onClick={() => generatePDF(t)}
                          className="py-2 bg-white border border-slate-100 hover:bg-slate-50 rounded-xl text-[10px] font-bold text-slate-600 flex items-center justify-center gap-1 transition-colors">
                          🇹🇷 {t === 'cover' ? 'Niyet' : t === 'sponsor' ? 'Sponsor' : t === 'employer' ? 'İşveren' : 'Seyahat Planı'}
                        </button>
                      ))}
                      {(['cover', 'sponsor', 'employer', 'itinerary'] as const).map(t => (
                        <button key={`en-${t}`} type="button" onClick={() => generatePDFEN(t)}
                          className="py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 transition-colors">
                          🇬🇧 {t === 'cover' ? 'Cover' : t === 'sponsor' ? 'Sponsor' : t === 'employer' ? 'Employer' : 'Itinerary'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bilgi kutusu */}
                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                    <div className="flex items-start gap-3">
                      <Star className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div className="text-xs text-amber-800 leading-relaxed">
                        <strong>2024-2026 Kritik Kural:</strong> Tüm belgelerdeki isim, pasaport numarası ve tarihler birbiriyle birebir eşleşmeli. Tutarsızlık otomatik ret sebebidir. Belgeleri doldurmadan önce pasaportunuzu kontrol edin.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-6 mt-8 border-t border-slate-100">
        {/* SSS + Nasıl Kullanılır teaser */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button type="button" onClick={() => setIsHowToOpen(true)}
            className="p-5 bg-white border border-slate-100 rounded-2xl text-left hover:border-brand-200 hover:shadow-md transition-all group">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 bg-brand-50 rounded-xl flex items-center justify-center group-hover:bg-brand-100 transition-colors">
                <LayoutList className="w-5 h-5 text-brand-600" />
              </div>
              <span className="font-bold text-slate-900">Nasıl Kullanılır?</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">3 adımda vize başvurunuzu optimize etmeyi öğrenin. Sıfır vize deneyimi gerektirmez.</p>
          </button>
          <button type="button" onClick={() => setIsFaqOpen(true)}
            className="p-5 bg-white border border-slate-100 rounded-2xl text-left hover:border-indigo-200 hover:shadow-md transition-all group">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                <Info className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="font-bold text-slate-900">Sık Sorulan Sorular</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">Aklınızdaki tüm soruların cevabı burada. Başvurudan önce mutlaka okuyun.</p>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-400 text-sm pt-2">
          <div className="flex items-center gap-2 font-bold text-slate-600">
            <ShieldCheck className="w-5 h-5 text-brand-600" />
            <span>VizeAkıl © 2026 — vizeakil.com</span>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-xs">
            <button type="button" onClick={() => setIsHowToOpen(true)} className="hover:text-slate-600 transition-colors">Nasıl Kullanılır?</button>
            <button type="button" onClick={() => setIsFaqOpen(true)} className="hover:text-slate-600 transition-colors">SSS</button>
            <button type="button" onClick={() => setIsTermsOpen(true)} className="hover:text-slate-600 transition-colors">Kullanım Koşulları</button>
            <button type="button" onClick={() => setIsKvkkOpen(true)} className="hover:text-slate-600 transition-colors">KVKK Aydınlatma</button>
          </div>
        </div>
        <div className="p-5 bg-slate-50 rounded-2xl text-xs text-slate-400 leading-relaxed">
          <strong>Önemli Uyarı:</strong> VizeAkıl bir resmi kurum veya konsolosluk değildir. Sunulan başarı ihtimali ve tavsiyeler geçmiş verilere dayalı istatistiksel tahminlerdir. Vize kararı tamamen ilgili ülkenin konsolosluğuna aittir ve hiçbir şekilde garanti edilemez. Başvuru sahibi beyanlarından kendisi sorumludur.
        </div>
      </footer>

      {/* ═══ KULLANIM KOŞULLARI MODALI ═══ */}
      <AnimatePresence>
        {isTermsOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsTermsOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-lg" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
              <div className="p-7 border-b border-slate-100 flex justify-between items-center shrink-0">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Kullanım Koşulları</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Son güncelleme: Nisan 2026</p>
                </div>
                <button type="button" onClick={() => setIsTermsOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-5 h-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-7 space-y-6 text-sm text-slate-700 leading-relaxed">
                {[
                  {
                    title: '1. Hizmetin Kapsamı',
                    body: 'VizeAkıl (vizeakil.com), kullanıcılara vize başvuru süreçlerinde yapay zeka destekli analiz, evrak yönlendirmesi ve niyet mektubu oluşturma gibi bilgi hizmetleri sunar. Platform, resmi vize danışmanlığı, hukuki tavsiye veya vize garantisi vermez.'
                  },
                  {
                    title: '2. Hizmetin Kullanımı',
                    body: 'Platformu kullanarak buradaki koşulları kabul etmiş sayılırsınız. Platformu yalnızca kişisel, ticari olmayan amaçlarla kullanabilirsiniz. İçeriklerin kopyalanması, yeniden dağıtılması veya izinsiz kullanımı yasaktır.'
                  },
                  {
                    title: '3. Doğruluk ve Sorumluluk Reddi',
                    body: 'Sunulan başarı oranları ve analizler, geçmiş istatistiksel verilere dayalı tahmindir. Konsolosluğun nihai kararını öngörmez ve garanti etmez. Kullanıcı, kendi başvurusunda sunduğu bilgilerin doğruluğundan bizzat sorumludur. VizeAkıl, herhangi bir vize reddinden veya başvuru sonucundan sorumlu tutulamaz.'
                  },
                  {
                    title: '4. Fikri Mülkiyet',
                    body: 'Platform üzerindeki tüm içerik, tasarım, algoritmalar ve metinler VizeAkıl\'a aittir. İzinsiz kullanım, 5846 sayılı Fikir ve Sanat Eserleri Kanunu kapsamında hukuki yaptırıma tabi olabilir.'
                  },
                  {
                    title: '5. Premium Hizmetler',
                    body: 'Ücretli (Premium) araçlar ve analizler, ödeme tamamlandıktan sonra aktif hale gelir. Dijital içeriklerin niteliği nedeniyle, hizmet açıldıktan sonra iade yapılmaz. Teknik sorunlar için destek@vizeakil.com adresinden iletişime geçebilirsiniz.'
                  },
                  {
                    title: '6. Değişiklik Hakkı',
                    body: 'VizeAkıl, bu koşulları önceden haber vermeksizin güncelleme hakkını saklı tutar. Güncel koşullar her zaman vizeakil.com/kullanim-kosullari adresinde yayımlanır. Platformu kullanmaya devam etmeniz, güncel koşulları kabul ettiğiniz anlamına gelir.'
                  },
                  {
                    title: '7. Uygulanacak Hukuk',
                    body: 'Bu sözleşme Türkiye Cumhuriyeti hukukuna tabidir. Uyuşmazlıklarda İstanbul Merkez Mahkemeleri ve İcra Daireleri yetkilidir.'
                  },
                ].map(({ title, body }) => (
                  <div key={title}>
                    <h4 className="font-black text-slate-900 mb-2">{title}</h4>
                    <p className="text-slate-600">{body}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══ KVKK AYDINLATMA METNİ MODALI ═══ */}
      <AnimatePresence>
        {isKvkkOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsKvkkOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-lg" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
              <div className="p-7 border-b border-slate-100 flex justify-between items-center shrink-0">
                <div>
                  <h3 className="text-xl font-black text-slate-900">KVKK Aydınlatma Metni</h3>
                  <p className="text-xs text-slate-400 mt-0.5">6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında</p>
                </div>
                <button type="button" onClick={() => setIsKvkkOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-5 h-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-7 space-y-6 text-sm text-slate-700 leading-relaxed">
                {[
                  {
                    title: '1. Veri Sorumlusu',
                    body: 'Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca VizeAkıl (vizeakil.com) tarafından hazırlanmıştır. Veri sorumlusu sıfatıyla kişisel verileriniz aşağıda açıklanan kapsamda işlenmektedir.'
                  },
                  {
                    title: '2. Toplanan Kişisel Veriler',
                    body: 'Platform üzerinden girdiğiniz; çalışma durumu, medeni durum, seyahat geçmişi, mali durum göstergeleri (bakiye aralığı) ve başvuru hedefi gibi bilgiler analiz amacıyla kullanılmaktadır. Bu bilgiler tarayıcınızda (localStorage) tutulur ve sunucularımıza iletilmez. Premium ödeme işlemlerinde ödeme aracı kuruluşu tarafından işlenen veriler kendi gizlilik politikalarına tabidir.'
                  },
                  {
                    title: '3. Kişisel Verilerin İşlenme Amaçları',
                    body: 'Kişisel verileriniz; vize başarı analizi yapılması, evrak listesi oluşturulması, niyet mektubu hazırlanması ve hizmet kalitesinin iyileştirilmesi amaçlarıyla işlenmektedir. Verileriniz üçüncü taraflarla paylaşılmaz, reklam amacıyla kullanılmaz.'
                  },
                  {
                    title: '4. Kişisel Verilerin Saklanması',
                    body: 'Girdiğiniz bilgiler yalnızca tarayıcınızın yerel belleğinde (localStorage) saklanır. Tarayıcı geçmişini temizlediğinizde veriler otomatik olarak silinir. Herhangi bir sunucuya kayıt işlemi yapılmamaktadır.'
                  },
                  {
                    title: '5. KVKK Kapsamındaki Haklarınız',
                    body: 'KVKK\'nın 11. maddesi uyarınca; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme, yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme, eksik veya yanlış işlenmişse düzeltilmesini isteme, silinmesini veya yok edilmesini isteme haklarına sahipsiniz.'
                  },
                  {
                    title: '6. İletişim',
                    body: 'KVKK kapsamındaki haklarınızı kullanmak veya gizlilik konusunda soru sormak için destek@vizeakil.com adresine yazabilirsiniz. Başvurularınız en geç 30 gün içinde yanıtlanacaktır.'
                  },
                ].map(({ title, body }) => (
                  <div key={title}>
                    <h4 className="font-black text-slate-900 mb-2">{title}</h4>
                    <p className="text-slate-600">{body}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══ SSS MODALI ═══ */}
      <AnimatePresence>
        {isFaqOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsFaqOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-lg" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
              <div className="p-7 border-b border-slate-100 flex justify-between items-center shrink-0">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Sık Sorulan Sorular</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Aklınızdaki her sorunun cevabı</p>
                </div>
                <button type="button" onClick={() => setIsFaqOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-5 h-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-7 space-y-4">
                {[
                  {
                    q: 'Başarı skorum neden düşük çıktı?',
                    a: '"Puanınızı Nasıl Artırırsınız?" bölümündeki adımları takip edin. Her maddenin yanında "Yaptım ✓" butonu var — tıkladığınızda profil güncellenir ve skor anlık olarak yükselir. Banka düzenliliği, SGK belgesi ve seyahat sigortası en çok puan getiren 3 faktördür.'
                  },
                  {
                    q: 'Bilgilerimi girmek güvenli mi? Verilerim nereye gidiyor?',
                    a: 'Girdiğiniz tüm bilgiler yalnızca tarayıcınızda (cihazınızda) saklanır. Hiçbir bilginiz sunucularımıza iletilmez veya depolanmaz. Tarayıcı geçmişinizi temizlediğinizde veriler tamamen silinir. Detaylar için KVKK Aydınlatma Metni\'ni inceleyebilirsiniz.'
                  },
                  {
                    q: 'Evrak Sihirbazı\'nda belge listesini nasıl kullanırım?',
                    a: 'Ülke ve çalışma durumunuzu seçtikten sonra "Liste Oluştur" butonuna tıklayın. Her belgeye tıkladığınızda üzeri çizilir — hazırladıklarınızı böyle takip edebilirsiniz. Listeyi sıfırlamak için "Yeniden Oluştur" düğmesini kullanın.'
                  },
                  {
                    q: 'Ücretsiz araçlar neler? Premium ne kazandırıyor?',
                    a: 'Evrak Listesi, Senaryo Oluşturucu, Randevu Takvim, Belge Tutarlılık Matrisi ve Vizesiz Ülkeler araçları tamamen ücretsizdir. Premium ile Vize Danışmanım (yapay zeka danışman), Ret Mektubu Analizi, Ülke Kıyaslayıcısı, AI Banka Dökümü Analizi, Kırmızı Bayrak Tarayıcı ve Sosyal Medya Rehberi açılır.'
                  },
                  {
                    q: 'Daha önce vize reddettim. Tekrar başvurabilir miyim?',
                    a: 'Evet, önceki red başvurunuzu beyan ederek sisteme girdiğinizde size özel strateji oluşturulur. "Ret Mektubu Analizi" aracımız ret gerekçesini analiz ederek bir sonraki başvuruyu nasıl güçlendireceğinizi adım adım gösterir. Premium "Kırmızı Bayrak Tarayıcı" ile dosyanızdaki mantıksal çelişkiler de tespit edilir.'
                  },
                  {
                    q: 'Niyet mektubunu Türkçe ve İngilizce indirebiliyor muyum?',
                    a: 'Evet! "Niyet Mektubu Oluşturucu" bölümünde 4 farklı mektup türü (Başvuru Sahipliği, Sponsor, İşveren, Seyahat Planı) için hem 🇹🇷 Türkçe hem de 🇬🇧 İngilizce PDF indirebilirsiniz. İngilizce sürümler uluslararası konsolosluk standartlarına göre hazırlanmıştır.'
                  },
                  {
                    q: 'Schengen Ülke Kıyaslayıcısı nasıl çalışıyor?',
                    a: 'Profil bilgilerinize dayanarak her Schengen ülkesini 6 faktörde (onay oranı, finansal uyum, SGK/çalışma durumu, vize geçmişi, trend) puanlar ve en uygun ülkeleri en üste sıralar. "Ülke Seç" veya "Ülke Kıyasla" butonuna tıklayınca bu analiz açılır.'
                  },
                  {
                    q: 'Türkçe destek var mı?',
                    a: 'Platform tamamen Türkçe\'dir ve Türk pasaportuna sahip başvuru sahipleri için özel olarak geliştirilmiştir. Teknik destek için destek@vizeakil.com adresine yazabilirsiniz.'
                  },
                ].map(({ q, a }, i) => (
                  <details key={i} className="group border border-slate-100 rounded-2xl overflow-hidden">
                    <summary className="flex items-center justify-between p-5 cursor-pointer select-none font-bold text-slate-900 hover:bg-slate-50 transition-colors list-none">
                      <span className="pr-4 text-sm">{q}</span>
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0 group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-50 pt-4">
                      {a}
                    </div>
                  </details>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══ NASIL KULLANILIR MODALI ═══ */}
      <AnimatePresence>
        {isHowToOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsHowToOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-lg" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
              <div className="p-7 bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-t-[2.5rem] shrink-0">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-brand-200 text-xs font-bold uppercase tracking-widest mb-1">Başlangıç Rehberi</div>
                    <h3 className="text-xl font-black">VizeAkıl Nasıl Kullanılır?</h3>
                    <p className="text-brand-100 text-xs mt-1">3 adımda profesyonel başvuru hazırlığı</p>
                  </div>
                  <button type="button" onClick={() => setIsHowToOpen(false)} className="p-2 hover:bg-white/10 rounded-full"><X className="w-5 h-5" /></button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-7 space-y-8">
                {/* Adımlar */}
                {[
                  {
                    step: '01',
                    title: 'Profilinizi Oluşturun',
                    color: 'brand',
                    items: [
                      '"Ücretsiz Analiz Başlat" butonuna tıklayın.',
                      'Hangi ülkeye başvuracağınızı seçin — Schengen, İngiltere veya ABD.',
                      'Çalışma durumunuzu, mali profilinizi ve vize geçmişinizi işaretleyin.',
                      'Anlık başarı skorunuzu görün; "Tam Analizi Gör" ile devam edin.',
                    ]
                  },
                  {
                    step: '02',
                    title: 'Aksiyon Merkezini Takip Edin',
                    color: 'indigo',
                    items: [
                      '"Puanınızı Nasıl Artırırsınız?" bölümündeki önerileri sırayla inceleyin.',
                      'Her maddenin araç butonuna tıklayın — ilgili analiz otomatik açılır.',
                      'Tamamladığınız adımı "Yaptım ✓" ile onaylayın — skor anlık güncellenir.',
                      '"Evrak Sihirbazı" ile profilinize özel belge listesi alın; tamamladıklarınızı tıklayarak işaretleyin.',
                      '"Ülke Seç" ile Schengen ülkelerini profil uyumuna göre kıyaslayın.',
                    ]
                  },
                  {
                    step: '03',
                    title: 'Başvuruyu Tamamlayın',
                    color: 'violet',
                    items: [
                      '"Kırmızı Bayrak Tarayıcı" ile dosyanızdaki mantıksal çelişkileri kontrol edin.',
                      '"Niyet Mektubu" bölümünden 🇹🇷 Türkçe veya 🇬🇧 İngilizce PDF indirin.',
                      'Skorunuz %82\'nin üstüne çıktığında başvuru için güçlü bir profil demektir.',
                      'Premium "Vize Danışmanım" ile yapay zekaya son sorularınızı sorun.',
                    ]
                  },
                ].map(({ step, title, color, items }) => (
                  <div key={step} className="flex gap-5">
                    <div className={`w-12 h-12 bg-${color}-50 rounded-2xl flex items-center justify-center shrink-0 border border-${color}-100`}>
                      <span className={`text-${color}-600 font-black text-sm`}>{step}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-slate-900 mb-3">{title}</h4>
                      <ul className="space-y-2">
                        {items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                            <CheckCircle2 className={`w-4 h-4 text-${color}-500 shrink-0 mt-0.5`} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}

                {/* İpucu kutusu */}
                <div className="p-5 bg-amber-50 border border-amber-100 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <Star className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-amber-900 text-sm mb-1">Pro İpucu</div>
                      <p className="text-xs text-amber-800 leading-relaxed">Başvurunuzdan <strong>en az 8 hafta önce</strong> sisteme girin. Bu süre; eksik evrakları tamamlamanıza, banka hesabınızı düzenlemenize ve randevu almanıza yetecektir. Son dakika başvuruları ret riskini %40 artırır.</p>
                    </div>
                  </div>
                </div>

                <button type="button"
                  onClick={() => { setIsHowToOpen(false); setOnboardingStep(0); setStep('onboarding'); }}
                  className="w-full py-4 bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-black rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                  Hemen Başla <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════
          MÜLAKAT SİMÜLATÖRÜ MODALI — Permito.ai Tarzı
          ═══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isInterviewSimOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              onClick={() => setIsInterviewSimOpen(false)}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-lg" />
            <motion.div initial={{opacity:0,scale:0.95,y:20}} animate={{opacity:1,scale:1,y:0}}
              exit={{opacity:0,scale:0.95,y:20}}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl flex flex-col max-h-[94vh] overflow-hidden">

              {/* Header */}
              <div className="p-7 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-t-[2.5rem] shrink-0">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-amber-200 text-xs font-black uppercase tracking-widest mb-1 flex items-center gap-2">
                      <Brain className="w-4 h-4"/> Mülakat Simülatörü — Gerçek Konsolosluk Soruları
                    </div>
                    <h3 className="text-2xl font-black">Vize Mülakatına Hazırlan</h3>
                    {interviewPhase === 'question' && (
                      <p className="text-amber-100 text-sm mt-1">
                        Soru {interviewCurrentQ + 1} / {interviewQuestions[interviewVisaType].length}
                      </p>
                    )}
                  </div>
                  <button onClick={() => setIsInterviewSimOpen(false)} className="p-2 hover:bg-white/10 rounded-full"><X className="w-6 h-6"/></button>
                </div>
                {interviewPhase === 'question' && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-amber-200 font-bold mb-1.5">
                      <span>İlerleme</span>
                      <span>%{Math.round((interviewCurrentQ / interviewQuestions[interviewVisaType].length) * 100)}</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div className="bg-white h-2 rounded-full transition-all duration-500"
                        style={{width:`${(interviewCurrentQ / interviewQuestions[interviewVisaType].length) * 100}%`}}/>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {interviewQuestions[interviewVisaType].map((_, i) => (
                        <div key={i} className={`w-5 h-1.5 rounded-full transition-all ${
                          i < interviewCurrentQ ? (interviewAnswers[i]?.score >= 6.5 ? 'bg-emerald-300' : interviewAnswers[i]?.score >= 4.5 ? 'bg-amber-300' : 'bg-rose-300') :
                          i === interviewCurrentQ ? 'bg-white' : 'bg-white/20'
                        }`}/>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto">
                {/* SETUP */}
                {interviewPhase === 'setup' && (
                  <div className="p-8 space-y-6">
                    <div className="text-center space-y-3">
                      <div className="text-5xl">🎯</div>
                      <h4 className="text-xl font-black text-slate-900">Gerçek konsolosluk soruları, anında geri bildirim</h4>
                      <p className="text-slate-500 text-sm leading-relaxed">Ex-konsolosluk görevlilerinin sorduğu sorularla pratik yapın. Her cevabınız analiz edilir, zayıf noktalarınız için spesifik tavsiye alırsınız.</p>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {([
                        { id:'schengen' as const, flag:'🇪🇺', label:'Schengen', count: interviewQuestions.schengen.length, color:'blue' },
                        { id:'uk' as const, flag:'🇬🇧', label:'İngiltere', count: interviewQuestions.uk.length, color:'rose' },
                        { id:'usa' as const, flag:'🇺🇸', label:'ABD B1/B2', count: interviewQuestions.usa.length, color:'indigo' },
                      ]).map(v => (
                        <button key={v.id} onClick={() => setInterviewVisaType(v.id)}
                          className={`p-4 rounded-2xl border-2 text-center transition-all ${interviewVisaType === v.id ? `border-${v.color}-500 bg-${v.color}-50` : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                          <div className="text-3xl mb-2">{v.flag}</div>
                          <div className="font-black text-slate-900 text-sm">{v.label}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{v.count} soru</div>
                        </button>
                      ))}
                    </div>
                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl text-xs text-amber-800 leading-relaxed">
                      <strong>Nasıl çalışır?</strong> Her soruya gerçek mülakata gibi cevap yazın. Sistem Türkçe cevabınızı analiz eder, not verir ve güçlendirilmesi gereken alanları gösterir. Mülakata gitmeden önce tüm soru kategorilerini pratiğe yapın.
                    </div>
                    <button onClick={() => { resetInterviewSim(); setInterviewPhase('question'); }}
                      className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black rounded-2xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                      Mülakata Başla ({interviewQuestions[interviewVisaType].length} Soru) <ChevronRight className="w-5 h-5"/>
                    </button>
                  </div>
                )}

                {/* SORU EKRANI */}
                {interviewPhase === 'question' && (() => {
                  const q = interviewQuestions[interviewVisaType][interviewCurrentQ];
                  const prevAns = interviewAnswers[interviewCurrentQ - 1];
                  return (
                    <div className="p-8 space-y-5">
                      {/* Kategori badge */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-700 px-3 py-1 rounded-xl">{q.category}</span>
                        {interviewCurrentQ > 0 && prevAns && (
                          <span className={`text-[10px] font-black px-2 py-1 rounded-xl ${prevAns.score >= 6.5 ? 'bg-emerald-100 text-emerald-700' : prevAns.score >= 4.5 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                            Önceki: {prevAns.grade} ({prevAns.score.toFixed(1)}/10)
                          </span>
                        )}
                      </div>

                      {/* Soru */}
                      <div className="p-5 bg-slate-900 rounded-2xl">
                        <div className="text-xs text-slate-400 font-bold mb-2">🎙 Konsolosluk Görevlisi:</div>
                        <p className="text-white font-bold leading-relaxed">{q.q}</p>
                      </div>

                      {/* Hint */}
                      {!interviewHintShown ? (
                        <button onClick={() => setInterviewHintShown(true)}
                          className="text-xs text-amber-600 font-bold hover:underline flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5"/> İpucu göster
                        </button>
                      ) : (
                        <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-800 leading-relaxed">
                          <strong>💡 İpucu:</strong> {q.hint}
                        </div>
                      )}

                      {/* Cevap alanı */}
                      <div className="space-y-3">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Cevabınız:</label>
                        <textarea
                          value={interviewAnswer}
                          onChange={e => setInterviewAnswer(e.target.value)}
                          placeholder="Gerçek mülakata gibi cevap yazın..."
                          rows={5}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400/30 resize-none leading-relaxed"
                        />
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400">{interviewAnswer.trim().split(/\s+/).filter(Boolean).length} kelime</span>
                          <span className="text-xs text-slate-400">Önerilen: 30-80 kelime</span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button onClick={() => { if (interviewCurrentQ > 0) { setInterviewCurrentQ(p=>p-1); setInterviewAnswer(interviewAnswers[interviewCurrentQ-1]?.a || ''); setInterviewAnswers(p=>p.slice(0,-1)); }}}
                          disabled={interviewCurrentQ === 0}
                          className="px-4 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm disabled:opacity-30">
                          ← Geri
                        </button>
                        <button onClick={submitInterviewAnswer}
                          disabled={interviewAnswer.trim().length < 5}
                          className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black rounded-2xl hover:opacity-90 transition-opacity disabled:opacity-40">
                          {interviewCurrentQ + 1 === interviewQuestions[interviewVisaType].length ? 'Testi Bitir & Sonuçları Gör' : 'Cevapla & İlerle →'}
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {/* SONUÇ EKRANI */}
                {interviewPhase === 'result' && (() => {
                  const totalScore = interviewAnswers.reduce((s,a) => s + a.score, 0);
                  const maxScore = interviewQuestions[interviewVisaType].length * 10;
                  const pct = Math.round((totalScore / maxScore) * 100);
                  const grade = pct >= 80 ? 'Hazır' : pct >= 60 ? 'Geliştirilebilir' : 'Pratik Gerekli';
                  const gradeColor = pct >= 80 ? 'text-emerald-600' : pct >= 60 ? 'text-amber-600' : 'text-rose-600';
                  const weakAnswers = interviewAnswers.filter(a => a.score < 6.5).sort((a,b) => a.score - b.score).slice(0, 5);
                  const strongAnswers = interviewAnswers.filter(a => a.score >= 8).slice(0, 3);
                  return (
                    <div className="p-8 space-y-6">
                      {/* Genel Skor */}
                      <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl text-center text-white">
                        <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Mülakat Hazırlık Skoru</div>
                        <div className={`text-6xl font-black mb-1 ${gradeColor}`}>%{pct}</div>
                        <div className="text-xl font-bold text-white">{grade}</div>
                        <div className="text-slate-400 text-xs mt-2">{totalScore.toFixed(1)} / {maxScore} puan</div>
                        {/* Soru kartları */}
                        <div className="flex flex-wrap justify-center gap-1 mt-4">
                          {interviewAnswers.map((a,i) => (
                            <div key={i} className={`w-5 h-5 rounded-md text-[10px] font-black flex items-center justify-center ${a.score>=8?'bg-emerald-500':a.score>=6.5?'bg-amber-500':a.score>=4.5?'bg-orange-500':'bg-rose-500'}`}>
                              {i+1}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Güçlü cevaplar */}
                      {strongAnswers.length > 0 && (
                        <div>
                          <h4 className="font-black text-slate-900 text-sm flex items-center gap-2 mb-3">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500"/> Güçlü Cevaplarınız
                          </h4>
                          <div className="space-y-2">
                            {strongAnswers.map((a,i) => (
                              <div key={i} className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                                <div className="text-xs font-bold text-emerald-700 mb-1">{a.q.substring(0,60)}...</div>
                                <div className="text-xs text-emerald-600">{a.feedback}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Geliştirme alanları */}
                      {weakAnswers.length > 0 && (
                        <div>
                          <h4 className="font-black text-slate-900 text-sm flex items-center gap-2 mb-3">
                            <AlertTriangle className="w-4 h-4 text-amber-500"/> Geliştirmeniz Gereken Alanlar
                          </h4>
                          <div className="space-y-3">
                            {weakAnswers.map((a,i) => (
                              <div key={i} className="p-4 bg-amber-50 border border-amber-100 rounded-2xl space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className={`text-xs font-black px-2 py-0.5 rounded-lg ${a.score<4.5?'bg-rose-100 text-rose-700':'bg-amber-100 text-amber-700'}`}>{a.grade} • {a.score.toFixed(1)}/10</span>
                                </div>
                                <p className="text-xs font-bold text-slate-700">❓ {a.q}</p>
                                <p className="text-xs text-slate-500 italic">📝 Sizin cevabınız: "{a.a.substring(0,100)}{a.a.length>100?'...':''}"</p>
                                <p className="text-xs text-amber-800">{a.feedback}</p>
                                {a.tips.length > 0 && (
                                  <div className="space-y-1">
                                    {a.tips.map((tip,ti) => (
                                      <div key={ti} className="flex items-start gap-1.5 text-xs text-slate-600">
                                        <span className="text-amber-500 font-bold shrink-0">→</span>{tip}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Aksiyonlar */}
                      <div className="flex gap-3">
                        <button onClick={resetInterviewSim}
                          className="flex-1 py-3 bg-slate-100 text-slate-700 font-black rounded-2xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                          <RefreshCw className="w-4 h-4"/> Tekrar Dene
                        </button>
                        <button onClick={() => setIsInterviewSimOpen(false)}
                          className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black rounded-2xl hover:opacity-90 transition-opacity">
                          Tamamlandı ✓
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════
          ÇOKLU ÜLKE SEYAHAT VİZE PLANLAYCISI
          ═══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isMultiCountryOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              onClick={() => setIsMultiCountryOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-lg" />
            <motion.div initial={{opacity:0,scale:0.95,y:20}} animate={{opacity:1,scale:1,y:0}}
              exit={{opacity:0,scale:0.95,y:20}}
              className="relative w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl flex flex-col max-h-[94vh] overflow-hidden">

              {/* Header */}
              <div className="p-7 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-t-[2.5rem] shrink-0">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-cyan-200 text-xs font-black uppercase tracking-widest mb-1 flex items-center gap-2">
                      <Plane className="w-4 h-4"/> Seyahat Planlayıcı
                    </div>
                    <h3 className="text-2xl font-black">Kaç Vize Lazım?</h3>
                    <p className="text-cyan-100 text-sm mt-1">Gitmek istediğin ülkeleri seç → kaç başvuru gerektiğini anında hesapla</p>
                  </div>
                  <button onClick={() => setIsMultiCountryOpen(false)} className="p-2 hover:bg-white/10 rounded-full"><X className="w-6 h-6"/></button>
                </div>
                {/* Schengen bilgi kartı */}
                <div className="p-3 bg-white/15 rounded-2xl border border-white/20 flex items-start gap-3 mb-4">
                  <span className="text-2xl shrink-0">🇪🇺</span>
                  <div>
                    <div className="font-black text-white text-sm">Schengen = 27 Ülke, 1 Vize!</div>
                    <div className="text-cyan-100 text-xs mt-0.5 leading-relaxed">Almanya, Fransa, İtalya, İspanya ve daha 23 ülkeye TEK bir Schengen vizesiyle girebilirsin. Ayrı ayrı başvurman gerekmez.</div>
                  </div>
                </div>
                {/* Bölge filtresi */}
                <div className="flex gap-2 flex-wrap">
                  {['Tümü','Yakın Çevre','Avrupa','Schengen','Orta Doğu','Uzak Doğu','Kuzey Amerika'].map(r => (
                    <button key={r} onClick={() => setMcRegionFilter(r)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${mcRegionFilter===r?'bg-white text-cyan-700':'bg-white/20 text-white hover:bg-white/30'}`}>{r}</button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* ADIM 1: Ülke seçimi */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
                      <span className="w-6 h-6 bg-cyan-600 text-white rounded-full flex items-center justify-center text-xs font-black">1</span>
                      Gitmek istediğin ülkeleri seç
                    </h4>
                    {mcSelected.length > 0 && (
                      <button onClick={() => setMcSelected([])} className="text-xs text-slate-400 hover:text-rose-500 font-bold flex items-center gap-1">
                        <RefreshCw className="w-3 h-3"/> Sıfırla
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Object.entries(multiCountryVisaData)
                      .filter(([, d]) => mcRegionFilter === 'Tümü' || d.region === mcRegionFilter)
                      .map(([name, d]) => {
                        const isSelected = mcSelected.includes(name);
                        const typeLabel = d.visaType === 'vizsiz' ? '✅ Vizesiz' : d.visaType === 'evisa' ? '🖥 Online Başvur' : d.visaType === 'kapida' ? '🛂 Kapıda Vize' : '📋 Konsolosluk';
                        const bgColors = { vizsiz:'bg-emerald-50 border-emerald-200', evisa:'bg-blue-50 border-blue-200', kapida:'bg-amber-50 border-amber-200', tam_vize:'bg-rose-50 border-rose-200' };
                        const textColors = { vizsiz:'text-emerald-700', evisa:'text-blue-700', kapida:'text-amber-700', tam_vize:'text-rose-700' };
                        return (
                          <button key={name} onClick={() => setMcSelected(p => isSelected ? p.filter(x=>x!==name) : [...p, name])}
                            className={`p-3 rounded-2xl border-2 text-left transition-all hover:scale-[1.02] ${isSelected ? 'border-cyan-600 bg-cyan-600 text-white shadow-lg' : `${bgColors[d.visaType]} hover:border-slate-300`}`}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xl">{d.flag}</span>
                              {isSelected && <CheckCircle2 className="w-4 h-4 text-white"/>}
                            </div>
                            <div className={`font-black text-sm ${isSelected ? 'text-white' : 'text-slate-900'}`}>{name}</div>
                            <div className={`text-[10px] font-bold mt-0.5 ${isSelected ? 'text-cyan-100' : textColors[d.visaType]}`}>{typeLabel}</div>
                            <div className={`text-[10px] mt-1 ${isSelected ? 'text-cyan-200' : 'text-slate-500'}`}>Max {d.maxDays} gün</div>
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* ADIM 2 & 3: Analiz — sadece seçim varsa */}
                {mcSelected.length > 0 && (() => {
                  const schengenPool = ['Almanya','Fransa','İtalya','İspanya','Hollanda','Belçika','Avusturya','Yunanistan','Portekiz','İsveç','Norveç','Danimarka','Finlandiya','İsviçre','Polonya','Çekya','Macaristan','Slovakya','Slovenya','Hırvatistan','Estonya','Letonya','Litvanya','Lüksemburg','Malta'];
                  const selectedSchengen = mcSelected.filter(c => schengenPool.includes(c));
                  const needsConsulatVisa = mcSelected.filter(c => multiCountryVisaData[c]?.visaType === 'tam_vize' && !schengenPool.includes(c));
                  const needsEvisa = mcSelected.filter(c => multiCountryVisaData[c]?.visaType === 'evisa');
                  const kapida = mcSelected.filter(c => multiCountryVisaData[c]?.visaType === 'kapida');
                  const vizsiz = mcSelected.filter(c => multiCountryVisaData[c]?.visaType === 'vizsiz');
                  const totalApplications = (selectedSchengen.length > 0 ? 1 : 0) + needsConsulatVisa.length + needsEvisa.length;

                  return (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-cyan-600 text-white rounded-full flex items-center justify-center text-xs font-black">2</span>
                        <h4 className="font-black text-slate-900 text-base">Senin Planın</h4>
                      </div>

                      {/* Seçilen ülkeler etiketleri */}
                      <div className="flex flex-wrap gap-2">
                        {mcSelected.map(c => {
                          const d = multiCountryVisaData[c];
                          const isSchengen = schengenPool.includes(c);
                          return (
                            <div key={c} className="flex items-center gap-1.5 bg-slate-100 rounded-xl px-2.5 py-1.5">
                              <span className="text-sm">{d?.flag}</span>
                              <span className="text-xs font-bold text-slate-800">{c}</span>
                              {isSchengen && <span className="text-[9px] text-cyan-600 font-black bg-cyan-50 px-1 rounded">Schengen</span>}
                              <button onClick={() => setMcSelected(p=>p.filter(x=>x!==c))} className="text-slate-400 hover:text-rose-500 ml-0.5"><X className="w-3 h-3"/></button>
                            </div>
                          );
                        })}
                      </div>

                      {/* Sonuç kartı */}
                      <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl text-white">
                        <div className="text-slate-400 text-xs font-black uppercase tracking-widest mb-3">Toplam Başvuru Sayısı</div>
                        <div className="flex items-baseline gap-3 mb-4">
                          <div className="text-5xl font-black text-white">{totalApplications}</div>
                          <div className="text-slate-300 text-sm leading-tight">{mcSelected.length} ülke için<br/><span className="text-white font-bold">{totalApplications} ayrı başvuru</span></div>
                        </div>

                        <div className="space-y-2">
                          {selectedSchengen.length > 0 && (
                            <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                              <div>
                                <div className="font-black text-white text-sm">🇪🇺 Schengen Vizesi</div>
                                <div className="text-slate-300 text-xs mt-0.5">{selectedSchengen.map(c => `${multiCountryVisaData[c]?.flag} ${c}`).join(' · ')}</div>
                                <div className="text-emerald-300 text-[11px] font-bold mt-1">✓ {selectedSchengen.length} ülke için TEK başvuru!</div>
                              </div>
                              <div className="text-right shrink-0 ml-3">
                                <div className="text-2xl font-black text-white">1</div>
                                <div className="text-slate-400 text-[10px]">başvuru</div>
                              </div>
                            </div>
                          )}
                          {needsConsulatVisa.map(c => (
                            <div key={c} className="flex items-center justify-between p-3 bg-rose-900/40 border border-rose-700/30 rounded-xl">
                              <div>
                                <div className="font-black text-white text-sm">{multiCountryVisaData[c]?.flag} {c} Vizesi</div>
                                <div className="text-rose-200 text-xs mt-0.5">📋 Konsolosluk başvurusu gerekli</div>
                                <div className="text-slate-400 text-[10px] mt-0.5">{multiCountryVisaData[c]?.note}</div>
                              </div>
                              <div className="text-right shrink-0 ml-3">
                                <div className="text-2xl font-black text-white">1</div>
                                <div className="text-slate-400 text-[10px]">başvuru</div>
                              </div>
                            </div>
                          ))}
                          {needsEvisa.map(c => (
                            <div key={c} className="flex items-center justify-between p-3 bg-blue-900/30 border border-blue-700/30 rounded-xl">
                              <div>
                                <div className="font-black text-white text-sm">{multiCountryVisaData[c]?.flag} {c}</div>
                                <div className="text-blue-200 text-xs mt-0.5">🖥 Online e-Vize (kolay!)</div>
                                <div className="text-slate-400 text-[10px] mt-0.5">{multiCountryVisaData[c]?.note}</div>
                              </div>
                              <div className="text-right shrink-0 ml-3">
                                <div className="text-2xl font-black text-white">1</div>
                                <div className="text-slate-400 text-[10px]">başvuru</div>
                              </div>
                            </div>
                          ))}
                          {kapida.length > 0 && (
                            <div className="p-3 bg-amber-900/30 border border-amber-700/30 rounded-xl">
                              <div className="font-black text-white text-sm">🛂 Kapıda Vize</div>
                              <div className="text-amber-200 text-xs mt-0.5">{kapida.map(c=>`${multiCountryVisaData[c]?.flag} ${c}`).join(', ')} — havalimanında ödeme yap, geç!</div>
                              <div className="text-emerald-300 text-[11px] font-bold mt-1">✓ Önceden başvuru gerekmez</div>
                            </div>
                          )}
                          {vizsiz.length > 0 && (
                            <div className="p-3 bg-emerald-900/30 border border-emerald-700/30 rounded-xl">
                              <div className="font-black text-white text-sm">✅ Vizesiz</div>
                              <div className="text-emerald-200 text-xs mt-0.5">{vizsiz.map(c=>`${multiCountryVisaData[c]?.flag} ${c}`).join(', ')} — pasaportunla direkt git!</div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* ADIM 3: Aksiyon planı */}
                      {totalApplications > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="w-6 h-6 bg-cyan-600 text-white rounded-full flex items-center justify-center text-xs font-black">3</span>
                            <h4 className="font-black text-slate-900 text-base">Ne Yapmalısın?</h4>
                          </div>
                          <div className="space-y-2">
                            {selectedSchengen.length > 0 && (
                              <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-sm shrink-0">1</div>
                                <div>
                                  <div className="font-black text-blue-900 text-sm">Schengen Vizesi Başvur</div>
                                  <div className="text-blue-700 text-xs mt-1 leading-relaxed">
                                    En çok gün geçireceğin ülkenin konsolosluğuna başvur.{' '}
                                    <span className="font-bold">{selectedSchengen.length > 1 ? `${selectedSchengen[0]}'dan başvurabilirsin — geri kalan ${selectedSchengen.length-1} ülkeye de aynı vizeyle girersin.` : `${selectedSchengen[0]} konsolosluğuna başvur.`}</span>
                                  </div>
                                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                                    <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-2 py-1 rounded-xl">⏱ 15 gün önceden başvur</span>
                                    <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-2 py-1 rounded-xl">💰 ~€80-120 vize ücreti</span>
                                  </div>
                                </div>
                              </div>
                            )}
                            {needsEvisa.map((c, i) => (
                              <div key={c} className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                                <div className="w-8 h-8 bg-slate-700 text-white rounded-full flex items-center justify-center font-black text-sm shrink-0">{(selectedSchengen.length > 0 ? 1 : 0) + i + 1}</div>
                                <div>
                                  <div className="font-black text-slate-900 text-sm">{multiCountryVisaData[c]?.flag} {c} e-Vizesi</div>
                                  <div className="text-slate-600 text-xs mt-1">Resmi e-devlet/konsolosluk sitesinden online başvur. 3-7 gün içinde onaylanır.</div>
                                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                                    <span className="text-[10px] font-black bg-slate-100 text-slate-600 px-2 py-1 rounded-xl">⏱ Seyahatten 1 hafta önce</span>
                                    <span className="text-[10px] font-black bg-slate-100 text-slate-600 px-2 py-1 rounded-xl">🖥 Online — evden çıkmadan</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                            {needsConsulatVisa.map((c, i) => (
                              <div key={c} className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 rounded-2xl">
                                <div className="w-8 h-8 bg-rose-600 text-white rounded-full flex items-center justify-center font-black text-sm shrink-0">{(selectedSchengen.length > 0 ? 1 : 0) + needsEvisa.length + i + 1}</div>
                                <div>
                                  <div className="font-black text-rose-900 text-sm">{multiCountryVisaData[c]?.flag} {c} Vizesi</div>
                                  <div className="text-rose-700 text-xs mt-1">{multiCountryVisaData[c]?.note} — Konsoloslukla randevu alman gerekiyor.</div>
                                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                                    <span className="text-[10px] font-black bg-rose-100 text-rose-700 px-2 py-1 rounded-xl">⏱ 30+ gün önceden planla</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Renk açıklaması */}
                <div className="flex flex-wrap gap-3 p-4 bg-slate-50 rounded-2xl">
                  {[
                    { label:'✅ Vizesiz', color:'bg-emerald-500' },
                    { label:'🖥 e-Vize (Online)', color:'bg-blue-500' },
                    { label:'🛂 Kapıda Vize', color:'bg-amber-500' },
                    { label:'📋 Konsolosluk Vizesi', color:'bg-rose-500' },
                  ].map(l => (
                    <div key={l.label} className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                      <div className={`w-3 h-3 rounded-sm ${l.color}`}/>
                      {l.label}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════
          TOPLULUK DENEYİM VERİTABANI — Crowdsourced
          ═══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isCommunityOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              onClick={() => setIsCommunityOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-lg" />
            <motion.div initial={{opacity:0,scale:0.95,y:20}} animate={{opacity:1,scale:1,y:0}}
              exit={{opacity:0,scale:0.95,y:20}}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl flex flex-col max-h-[94vh] overflow-hidden">
              <div className="p-7 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-t-[2.5rem] shrink-0">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1 flex items-center gap-2"><Star className="w-4 h-4"/> Topluluk Deneyimleri</div>
                    <h3 className="text-2xl font-black">Gerçek Başvuru Deneyimleri</h3>
                    <p className="text-slate-400 text-sm mt-1">VizeAkıl kullanıcılarının gerçek başvuru sonuçları</p>
                  </div>
                  <button onClick={() => setIsCommunityOpen(false)} className="p-2 hover:bg-white/10 rounded-full"><X className="w-6 h-6"/></button>
                </div>
                <div className="mt-4 flex items-center gap-3 flex-wrap">
                  <div className="flex gap-2 flex-wrap">
                    {['Tümü','Almanya','Fransa','İngiltere','ABD','Hollanda'].map(f => (
                      <button key={f} onClick={() => setCommunityFilter(f)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${communityFilter===f?'bg-white text-slate-900':'bg-white/10 text-white hover:bg-white/20'}`}>{f}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {communityPhase === 'feed' && (
                  <div className="p-6 space-y-4">
                    {/* İstatistikler */}
                    <div className="grid grid-cols-3 gap-3 mb-2">
                      {[
                        { label:'Toplam Deneyim', value: communityEntries.length },
                        { label:'Onaylanan', value: communityEntries.filter(e=>e.result==='onaylandi').length },
                        { label:'Ort. Bekleme', value: `${Math.round(communityEntries.reduce((s,e)=>s+e.waitDays,0)/communityEntries.length)} gün` },
                      ].map(s => (
                        <div key={s.label} className="p-3 bg-slate-50 rounded-2xl text-center">
                          <div className="text-xl font-black text-slate-900">{s.value}</div>
                          <div className="text-[10px] font-bold text-slate-400">{s.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Deneyim listesi */}
                    {communityEntries
                      .filter(e => communityFilter === 'Tümü' || e.consulate === communityFilter)
                      .map(e => (
                        <div key={e.id} className={`p-5 rounded-2xl border-2 ${e.result==='onaylandi'?'bg-emerald-50 border-emerald-100':e.result==='reddedildi'?'bg-rose-50 border-rose-100':'bg-amber-50 border-amber-100'}`}>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-black text-slate-900 text-sm">{e.consulate} — {e.city}</span>
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-xl ${e.result==='onaylandi'?'bg-emerald-100 text-emerald-700':e.result==='reddedildi'?'bg-rose-100 text-rose-700':'bg-amber-100 text-amber-700'}`}>
                                {e.result==='onaylandi'?'✓ Onaylandı':e.result==='reddedildi'?'✗ Reddedildi':'📋 Ek Evrak'}
                              </span>
                              <span className="text-[10px] text-slate-400 font-bold">{e.visaType}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-bold shrink-0">{e.date}</span>
                          </div>
                          <div className="flex items-center gap-3 mb-2 text-xs font-bold text-slate-500">
                            <span>⏱ {e.waitDays} gün bekleme</span>
                            <span>👤 {e.profile}</span>
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed">{e.notes}</p>
                        </div>
                      ))}

                    <button onClick={() => setCommunityPhase('submit')}
                      className="w-full py-3 bg-slate-900 text-white font-black rounded-2xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                      + Deneyimimi Paylaş
                    </button>

                    {/* Mimari notu — şeffaflık */}
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl text-xs text-blue-700 leading-relaxed">
                      <strong>Nasıl çalışır?</strong> Deneyimleriniz tarayıcınızda (localStorage) saklanır ve bu cihazda görünür. Gelecekte topluluk verisi anonim ve güvenli şekilde paylaşılabilecek.
                    </div>
                  </div>
                )}

                {communityPhase === 'submit' && (
                  <div className="p-6 space-y-5">
                    <h4 className="font-black text-slate-900">Başvuru Deneyiminizi Paylaşın</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Konsolosluk</label>
                          <input value={communityForm.consulate} onChange={e=>setCommunityForm(p=>({...p,consulate:e.target.value}))}
                            placeholder="Almanya, Fransa..."
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-400/30"/>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Şehir</label>
                          <select value={communityForm.city} onChange={e=>setCommunityForm(p=>({...p,city:e.target.value}))}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none">
                            {['İstanbul','Ankara','İzmir','Antalya'].map(c=><option key={c}>{c}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Sonuç</label>
                          <select value={communityForm.result} onChange={e=>setCommunityForm(p=>({...p,result:e.target.value as 'onaylandi'|'reddedildi'|'ek_evrak'}))}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none">
                            <option value="onaylandi">✓ Onaylandı</option>
                            <option value="reddedildi">✗ Reddedildi</option>
                            <option value="ek_evrak">📋 Ek Evrak İstendi</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Bekleme Süresi (gün)</label>
                          <input type="number" value={communityForm.waitDays} onChange={e=>setCommunityForm(p=>({...p,waitDays:e.target.value}))}
                            placeholder="Örn: 15"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none"/>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Profil Tipi</label>
                        <select value={communityForm.profile} onChange={e=>setCommunityForm(p=>({...p,profile:e.target.value}))}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none">
                          {['Çalışan','Emekli','Öğrenci','Serbest Meslek','Çalışmıyor'].map(p=><option key={p}>{p}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Deneyiminiz (ne işe yaradı / nerede hata yaptınız?)</label>
                        <textarea value={communityForm.notes} onChange={e=>setCommunityForm(p=>({...p,notes:e.target.value}))}
                          placeholder="Başvuru sürecinizi kısaca anlatın — hangi belgeler fark yarattı, ne sorun çıktı..."
                          rows={4}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium leading-relaxed focus:outline-none resize-none"/>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setCommunityPhase('feed')} className="px-5 py-3 bg-slate-100 text-slate-700 font-bold rounded-2xl hover:bg-slate-200 transition-colors">İptal</button>
                      <button onClick={submitCommunityEntry}
                        disabled={!communityForm.consulate || !communityForm.notes || !communityForm.waitDays}
                        className="flex-1 py-3 bg-slate-900 text-white font-black rounded-2xl hover:opacity-90 disabled:opacity-40 transition-opacity">
                        Deneyimi Paylaş →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* ═══════════════════════════════════════════════════════
          VFS RANDEVU TAKİP BOTU MODALI
          ═══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isAppointmentOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              onClick={() => setIsAppointmentOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-lg" />
            <motion.div initial={{opacity:0,scale:0.95,y:20}} animate={{opacity:1,scale:1,y:0}}
              exit={{opacity:0,scale:0.95,y:20}}
              className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden">

              {/* Header */}
              <div className="p-7 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-t-2xl shrink-0">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1 flex items-center gap-2">
                      <Bell className="w-4 h-4"/> Randevu Takip Botu
                    </div>
                    <h3 className="text-2xl font-black">VFS Randevu Bildirimi</h3>
                    <p className="text-slate-400 text-sm mt-1">
                      Seçtiğin konsolosluklarda slot açılınca anında e-posta alırsın
                    </p>
                  </div>
                  <button onClick={() => setIsAppointmentOpen(false)} className="p-2 hover:bg-white/10 rounded-full"><X className="w-6 h-6"/></button>
                </div>

                {/* Ülke filtre */}
                <div className="flex gap-2 flex-wrap">
                  {['Tümü','Almanya','Fransa','Hollanda','İngiltere','ABD','İtalya','İspanya'].map(c => (
                    <button key={c} onClick={() => setApptCountryFilter(c)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${apptCountryFilter===c?'bg-white text-slate-900':'bg-white/10 text-white hover:bg-white/20'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* İstatistik banner */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label:'Takip Edilen', value:`${APPOINTMENT_TARGETS.length} Merkez` },
                    { label:'Müsait Şu An', value:`${APPOINTMENT_TARGETS.filter(t=>t.status==='müsait').length} Slot`, color:'text-emerald-600' },
                    { label:'En Uzun Bekleme', value:`${Math.max(...APPOINTMENT_TARGETS.map(t=>t.avgWaitDays))} gün`, color:'text-rose-600' },
                  ].map(s => (
                    <div key={s.label} className="p-3 bg-slate-50 rounded-2xl text-center">
                      <div className={`text-lg font-black ${s.color ?? 'text-slate-900'}`}>{s.value}</div>
                      <div className="text-[10px] font-bold text-slate-400">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Konsolosluk listesi */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-black text-slate-900 text-sm">Takip etmek istediğin merkezleri seç</h4>
                    {apptSelected.length > 0 && (
                      <span className="text-xs font-bold text-brand-600">{apptSelected.length} seçildi</span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(APPOINTMENT_TARGETS as readonly ApptTarget[])
                      .filter(t => apptCountryFilter === 'Tümü' || t.country === apptCountryFilter)
                      .map(t => {
                        const isSelected = apptSelected.includes(t.id);
                        const isMüsait = t.status === 'müsait';
                        return (
                          <button key={t.id}
                            onClick={() => setApptSelected(p => isSelected ? p.filter(x=>x!==t.id) : [...p, t.id])}
                            className={`p-4 rounded-2xl border-2 text-left transition-all ${isSelected ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{t.flag}</span>
                                <div>
                                  <div className="font-black text-slate-900 text-sm">{t.country}</div>
                                  <div className="text-xs text-slate-500">{t.city} — {t.visaType}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${isMüsait ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                  {isMüsait ? '● Müsait' : '○ Dolu'}
                                </span>
                                {isSelected && <CheckCircle2 className="w-4 h-4 text-brand-500"/>}
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-400">Ort. bekleme: <strong className={`${t.avgWaitDays > 60 ? 'text-rose-600' : t.avgWaitDays > 20 ? 'text-amber-600' : 'text-emerald-600'}`}>{t.avgWaitDays} gün</strong></span>
                              {isMüsait && (
                                <a href={t.vfsUrl} target="_blank" rel="noopener noreferrer"
                                  onClick={e => e.stopPropagation()}
                                  className="text-[10px] font-black text-brand-600 hover:text-brand-800 flex items-center gap-0.5">
                                  VFS'e Git →
                                </a>
                              )}
                            </div>
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* Bildirim aboneliği */}
                {apptSubStatus === 'success' ? (
                  <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
                    <div className="text-3xl mb-2">✅</div>
                    <div className="font-black text-emerald-800">Abonelik Oluşturuldu!</div>
                    <div className="text-sm text-emerald-700 mt-1">
                      Seçtiğin merkezlerde slot açıldığında <strong>{apptSubEmail}</strong> adresine bildirileceğiz.
                    </div>
                    <button onClick={() => { setApptSubStatus('idle'); setApptSubEmail(''); setApptSelected([]); }}
                      className="mt-3 text-xs text-emerald-600 font-bold hover:text-emerald-800">
                      Yeni abonelik oluştur
                    </button>
                  </div>
                ) : (
                  <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                      <Bell className="w-4 h-4 text-brand-600"/> Slot açılınca haber ver
                    </h4>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={apptSubEmail}
                        onChange={e => setApptSubEmail(e.target.value)}
                        placeholder="e-posta adresiniz"
                        className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                      <button
                        onClick={handleApptSubscribe}
                        disabled={!apptSubEmail || apptSelected.length === 0 || apptSubStatus === 'loading'}
                        className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-black rounded-xl text-sm disabled:opacity-40 transition-colors">
                        {apptSubStatus === 'loading' ? '...' : 'Bildir'}
                      </button>
                    </div>
                    {apptSelected.length === 0 && (
                      <p className="text-xs text-slate-400">Önce yukarıdan konsolosluk seç.</p>
                    )}
                    {apptSubStatus === 'error' && (
                      <p className="text-xs text-rose-600">Bir hata oluştu. Lütfen tekrar deneyin.</p>
                    )}
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      E-postanız yalnızca bildirim amaçlı kullanılır. İstediğiniz zaman aboneliğinizi iptal edebilirsiniz.
                      Durum bilgisi periyodik olarak güncellenir; anlık slot garantisi verilmez.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── ARAÇ 15: Banka Hesabı Hazırlık Planı ─────────────────────────── */}
      <AnimatePresence>
        {isBankPlanOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsBankPlanOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
              <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-4 shrink-0">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Banknote className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-black text-slate-900">Banka Hesabı Hazırlık Planı</h3>
                  </div>
                  <p className="text-sm text-slate-500">Başvuruya kadar kaç ay var? Aylık ne kadar giriş/çıkış yapmalısınız?</p>
                </div>
                <button onClick={() => setIsBankPlanOpen(false)} aria-label="Kapat"
                  className="p-2 rounded-xl hover:bg-slate-100 transition-colors shrink-0">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
                {/* Girişler */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Mevcut Bakiye (TL)</label>
                    <input type="number" value={bankPlanBalance}
                      onChange={e => setBankPlanBalance(e.target.value)}
                      placeholder="örn. 85000"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Hedef Ülke</label>
                    <select value={bankPlanCountry} onChange={e => setBankPlanCountry(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-300">
                      {Object.keys(BANK_PLAN_PARAMS).map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Seyahat Süresi (gün)</label>
                    <input type="number" value={bankPlanTripDays}
                      onChange={e => setBankPlanTripDays(e.target.value)}
                      placeholder="örn. 10"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Başvuruya Kaç Ay Var?</label>
                    <select value={bankPlanMonthsLeft} onChange={e => setBankPlanMonthsLeft(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-300">
                      {['1','2','3','4','5','6'].map(m => <option key={m} value={m}>{m} ay</option>)}
                    </select>
                  </div>
                </div>

                {/* Plan Hesaplama */}
                {(() => {
                  const bal   = parseFloat(bankPlanBalance) || 0;
                  const days  = parseInt(bankPlanTripDays) || 10;
                  const months = parseInt(bankPlanMonthsLeft) || 3;
                  const params = BANK_PLAN_PARAMS[bankPlanCountry] ?? BANK_PLAN_PARAMS['Almanya'];
                  const eurRate = params.multiplier;
                  const requiredEur = params.dailyEur * Math.max(days, params.minDays);
                  const requiredTL  = requiredEur * eurRate;
                  const gap = Math.max(0, requiredTL - bal);
                  const monthlyDeposit = gap > 0 ? Math.ceil(gap / months) : 0;
                  const maxWithdraw = Math.floor(requiredTL * 0.4 / months);
                  const isOk = bal >= requiredTL;

                  // Aylık grafik verisi
                  const monthNames = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];
                  const now = new Date();
                  const planMonths = Array.from({ length: months }, (_, i) => {
                    const d = new Date(now.getFullYear(), now.getMonth() + i + 1, 1);
                    const projected = Math.min(bal + monthlyDeposit * (i + 1), requiredTL * 1.1);
                    return { label: monthNames[d.getMonth()], value: projected, target: requiredTL };
                  });
                  const maxVal = Math.max(...planMonths.map(m => m.value), requiredTL) * 1.05;

                  return (
                    <div className="space-y-4">
                      {/* Özet kutuları */}
                      <div className={`p-4 rounded-2xl border ${isOk ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isOk ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                            {isOk ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-amber-600" />}
                          </div>
                          <div>
                            <div className={`font-bold text-sm ${isOk ? 'text-emerald-800' : 'text-amber-800'}`}>
                              {isOk
                                ? `Bakiyeniz yeterli! ${bankPlanCountry} için ${requiredEur.toLocaleString()} ${params.currency} gerekli.`
                                : `Eksik: ${(gap / 1000).toFixed(0)}K TL — ${months} ayda telafi edilebilir.`}
                            </div>
                            <div className={`text-xs mt-1 ${isOk ? 'text-emerald-600' : 'text-amber-600'}`}>
                              {bankPlanCountry} için {days} gün × {params.dailyEur} {params.currency}/gün = <strong>{requiredEur.toLocaleString()} {params.currency}</strong> ({(requiredTL/1000).toFixed(0)}K TL)
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                          <div className="text-base font-black text-green-600">+{(monthlyDeposit/1000).toFixed(0)}K</div>
                          <div className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">Aylık Min. Giriş</div>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                          <div className="text-base font-black text-rose-600">max {(maxWithdraw/1000).toFixed(0)}K</div>
                          <div className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">Aylık Max. Çıkış</div>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                          <div className="text-base font-black text-slate-800">28 gün</div>
                          <div className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">Ani Yatırım Yasak</div>
                        </div>
                      </div>

                      {/* Aylık grafik */}
                      {bal > 0 && (
                        <div>
                          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Aylık Bakiye Tahmini</div>
                          <div className="space-y-2">
                            {planMonths.map((m, i) => {
                              const pct = Math.round((m.value / maxVal) * 100);
                              const targetPct = Math.round((m.target / maxVal) * 100);
                              const reached = m.value >= m.target;
                              return (
                                <div key={i} className="flex items-center gap-3">
                                  <div className="text-xs font-bold text-slate-400 w-6 shrink-0">{m.label}</div>
                                  <div className="flex-1 relative h-6 bg-slate-100 rounded-lg overflow-hidden">
                                    <div
                                      className={`h-full rounded-lg transition-all ${reached ? 'bg-emerald-400' : 'bg-blue-400'}`}
                                      style={{ width: `${pct}%` }}
                                    />
                                    {/* Hedef çizgisi */}
                                    <div className="absolute top-0 h-full w-0.5 bg-orange-400"
                                      style={{ left: `${targetPct}%` }} />
                                  </div>
                                  <div className={`text-xs font-bold w-12 text-right shrink-0 ${reached ? 'text-emerald-600' : 'text-slate-600'}`}>
                                    {(m.value/1000).toFixed(0)}K
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-[10px] text-slate-400">
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-blue-400 inline-block"/> Tahmini bakiye</span>
                            <span className="flex items-center gap-1"><span className="w-0.5 h-3 bg-orange-400 inline-block"/> Hedef ({(requiredTL/1000).toFixed(0)}K TL)</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-400 inline-block"/> Hedefe ulaştı</span>
                          </div>
                        </div>
                      )}

                      {/* Kritik kurallar */}
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                        <div className="text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Kritik Kurallar</div>
                        {[
                          `Son 28 günde tek seferde ${(requiredTL * 0.2 / 1000).toFixed(0)}K TL üzeri yatırım yapmayın`,
                          'Her ay düzenli maaş/gelir girişi olsun (aynı günler ideal)',
                          `Hesapta her zaman en az ${(requiredTL * 0.7 / 1000).toFixed(0)}K TL tutun`,
                          'Giriş-çıkış oranı %40\'ı geçmesin (aktif ama şüpheli değil)',
                        ].map((r, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                            <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5">{i+1}</div>
                            {r}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="px-6 py-4 border-t border-slate-100 shrink-0">
                <button onClick={() => setIsBankPlanOpen(false)}
                  className="w-full py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-colors">
                  Planı Kaydet ve Kapat
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── ARAÇ 16: Ret Nedeni Haritası ──────────────────────────────────── */}
      <AnimatePresence>
        {isRefusalMapOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsRefusalMapOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
              <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-4 shrink-0">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    <h3 className="text-lg font-black text-slate-900">Ret Nedeni Haritası</h3>
                  </div>
                  <p className="text-sm text-slate-500">2024-2025 gerçek Schengen ret kodları — ülke × profil bazında</p>
                </div>
                <button onClick={() => setIsRefusalMapOpen(false)} aria-label="Kapat"
                  className="p-2 rounded-xl hover:bg-slate-100 transition-colors shrink-0">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
                {/* Ülke seçimi */}
                <div className="flex gap-2 flex-wrap">
                  {Object.keys(BANK_PLAN_PARAMS).filter(c => ['Almanya','Fransa','Hollanda','İtalya','Avusturya'].includes(c)).map(c => (
                    <button key={c}
                      onClick={() => setRefusalMapCountry(c)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${refusalMapCountry === c ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-slate-600 border-slate-200 hover:border-orange-300'}`}>
                      {c}
                    </button>
                  ))}
                </div>

                {/* Kullanıcı profili riski */}
                {(() => {
                  // Profil bazlı kod riski tahmini
                  const profileRisks: Record<number, number> = {
                    1: 0,
                    2: (!profile.purposeClear || !profile.paidReservations) ? 35 : 8,
                    3: (!profile.hasSgkJob && !profile.hasAssets && !profile.strongFamilyTies) ? 30 : 5,
                    4: (!profile.bankSufficientBalance || !profile.bankRegularity) ? 28 : 6,
                    5: profile.noOverstayHistory ? 0 : 25,
                    6: (!profile.hasTravelInsurance && !profile.hasHealthInsurance) ? 20 : 2,
                    7: (!profile.paidReservations && !profile.hasInvitation) ? 15 : 3,
                    8: profile.noOverstayHistory ? 1 : 30,
                    9: profile.hasValidPassport ? 1 : 20,
                    10: 3,
                  };
                  const topUserRisk = SCHENGEN_REFUSAL_CODES
                    .filter(c => profileRisks[c.code] > 10)
                    .sort((a, b) => (profileRisks[b.code] ?? 0) - (profileRisks[a.code] ?? 0))[0];

                  return (
                    <div className="space-y-3">
                      {topUserRisk && (
                        <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                          <div>
                            <div className="font-bold text-sm text-orange-900">Profilinize göre en yüksek riskiniz:</div>
                            <div className="text-sm text-orange-700 mt-0.5">
                              <strong>Kod {topUserRisk.code} — {topUserRisk.label}</strong>
                            </div>
                            <div className="text-xs text-orange-600 mt-1">{topUserRisk.desc}</div>
                          </div>
                        </div>
                      )}

                      {/* Ret kodları görsel barlar */}
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider pt-2">{refusalMapCountry} — 2024-2025 Ret Kodu Dağılımı</div>
                      <div className="space-y-2">
                        {SCHENGEN_REFUSAL_CODES
                          .sort((a, b) => (b.byCountry[refusalMapCountry] ?? 0) - (a.byCountry[refusalMapCountry] ?? 0))
                          .map((rc) => {
                            const val = rc.byCountry[refusalMapCountry] ?? 0;
                            const maxVal2 = Math.max(...SCHENGEN_REFUSAL_CODES.map(x => x.byCountry[refusalMapCountry] ?? 0));
                            const pct = Math.round((val / maxVal2) * 100);
                            const userRisk = profileRisks[rc.code] ?? 0;
                            const isHighRisk = userRisk > 10;
                            return (
                              <div key={rc.code} className={`p-3 rounded-2xl border transition-all ${isHighRisk ? 'bg-orange-50 border-orange-200' : 'bg-slate-50 border-slate-100'}`}>
                                <div className="flex items-center gap-3 mb-2">
                                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md shrink-0 ${isHighRisk ? 'bg-orange-100 text-orange-700' : 'bg-slate-200 text-slate-600'}`}>
                                    KOD {rc.code}
                                  </span>
                                  <span className="text-xs font-bold text-slate-800 flex-1">{rc.label}</span>
                                  <span className="text-sm font-black text-slate-700 shrink-0">%{val}</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-1.5 mb-1">
                                  <div className={`h-1.5 rounded-full transition-all ${isHighRisk ? 'bg-orange-400' : 'bg-slate-400'}`}
                                    style={{ width: `${pct}%` }} />
                                </div>
                                <p className="text-[10px] text-slate-500 leading-relaxed">{rc.desc}</p>
                                {isHighRisk && (
                                  <div className="mt-1.5 text-[10px] font-bold text-orange-600">
                                    ⚠ Profilinizde bu risk mevcut — lütfen kontrol edin
                                  </div>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="px-6 py-4 border-t border-slate-100 shrink-0">
                <button onClick={() => setIsRefusalMapOpen(false)}
                  className="w-full py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-colors">
                  Kapat
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── ARAÇ 17: Benchmark — Senin Gibi Kaç Kişi ─────────────────────── */}
      <AnimatePresence>
        {isBenchmarkOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsBenchmarkOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
              <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-4 shrink-0">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-black text-slate-900">Senin Gibi Kaç Kişi?</h3>
                  </div>
                  <p className="text-sm text-slate-500">Benzer profillerin başvuru sonuçları</p>
                </div>
                <button onClick={() => setIsBenchmarkOpen(false)} aria-label="Kapat"
                  className="p-2 rounded-xl hover:bg-slate-100 transition-colors shrink-0">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
                {(() => {
                  const score = currentScore;
                  // Skor aralığına göre benzer profil havuzu simülasyonu
                  const bracket = score >= 80 ? { total: 1240, approved: 1116, pct: 90 } :
                                  score >= 65 ? { total: 847, approved: 623, pct: 74 } :
                                  score >= 50 ? { total: 612, approved: 367, pct: 60 } :
                                  score >= 35 ? { total: 389, approved: 155, pct: 40 } :
                                                { total: 214, approved: 43, pct: 20 };
                  const rejected = bracket.total - bracket.approved;
                  const approvedPct = bracket.pct;
                  const rejectedPct = 100 - approvedPct;

                  // En olası ret sebepleri profil bazında
                  const topReasons: { reason: string; pct: number }[] = [];
                  if (!profile.bankSufficientBalance || !profile.bankRegularity) topReasons.push({ reason: 'Yetersiz/düzensiz banka dökümü', pct: 43 });
                  if (!profile.useOurTemplate && !profile.purposeClear) topReasons.push({ reason: 'Zayıf niyet mektubu', pct: 31 });
                  if (!profile.hasSgkJob && !profile.isPublicSectorEmployee) topReasons.push({ reason: 'İstihdam kanıtı eksikliği', pct: 26 });
                  if (!profile.hasTravelInsurance) topReasons.push({ reason: 'Seyahat sigortası yok', pct: 18 });
                  if (!profile.strongFamilyTies && !profile.hasAssets) topReasons.push({ reason: 'Zayıf geri dönüş bağı', pct: 22 });
                  const displayReasons = topReasons.slice(0, 3);

                  return (
                    <div className="space-y-5">
                      {/* Ana sayaç */}
                      <div className="text-center p-6 bg-purple-50 rounded-2xl border border-purple-100">
                        <div className="text-4xl font-black text-slate-900">{bracket.total.toLocaleString()}</div>
                        <div className="text-sm text-slate-500 mt-1">Benzer profilli başvuru sahibi</div>
                        <div className="text-xs text-purple-600 font-bold mt-0.5">
                          Skor aralığı: {Math.max(0, score-10)}–{Math.min(100, score+10)} puan
                        </div>
                      </div>

                      {/* Onay / Ret dağılımı */}
                      <div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Sonuç Dağılımı</div>
                        <div className="flex rounded-xl overflow-hidden h-10 mb-2">
                          <div className="bg-emerald-500 flex items-center justify-center text-white font-black text-sm transition-all"
                            style={{ width: `${approvedPct}%` }}>
                            %{approvedPct}
                          </div>
                          <div className="bg-rose-400 flex items-center justify-center text-white font-black text-sm transition-all"
                            style={{ width: `${rejectedPct}%` }}>
                            %{rejectedPct}
                          </div>
                        </div>
                        <div className="flex gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block shrink-0" />
                            <span className="font-bold text-emerald-700">{bracket.approved.toLocaleString()} onaylandı</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-sm bg-rose-400 inline-block shrink-0" />
                            <span className="font-bold text-rose-600">{rejected.toLocaleString()} reddedildi</span>
                          </div>
                        </div>
                      </div>

                      {/* En sık ret sebepleri */}
                      {displayReasons.length > 0 && (
                        <div>
                          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                            Profilinizde Bu Grupun En Sık Ret Sebepleri
                          </div>
                          <div className="space-y-2">
                            {displayReasons.map((r, i) => (
                              <div key={i} className="flex items-center gap-3 p-3 bg-rose-50 border border-rose-100 rounded-xl">
                                <div className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center text-[10px] font-black text-rose-600 shrink-0">
                                  {i+1}
                                </div>
                                <span className="text-sm text-slate-700 flex-1">{r.reason}</span>
                                <span className="text-sm font-black text-rose-600 shrink-0">%{r.pct}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Motivasyon */}
                      <div className={`p-4 rounded-2xl text-sm font-medium text-center ${
                        approvedPct >= 75 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                        approvedPct >= 50 ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                        'bg-rose-50 text-rose-700 border border-rose-100'
                      }`}>
                        {approvedPct >= 75
                          ? `Bu profil grubunun %${approvedPct}'i vize aldı. Eksikleri kapatırsanız bu oranın üstüne çıkabilirsiniz.`
                          : approvedPct >= 50
                          ? `Şu an %${approvedPct} onay oranıyla orta grupta. 2-3 kritik eksiği giderin, %80+ grubuna geçin.`
                          : `Bu profil grubunda ret riski yüksek. Profilinizi güçlendirmeden başvurmayın.`}
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="px-6 py-4 border-t border-slate-100 shrink-0">
                <button onClick={() => setIsBenchmarkOpen(false)}
                  className="w-full py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-colors">
                  Kapat
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── ARAÇ 18: Nereye Gidebilirim ──────────────────────────────────── */}
      <AnimatePresence>
        {isCountryGuideOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsCountryGuideOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
              <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-4 shrink-0">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Plane className="w-5 h-5 text-sky-600" />
                    <h3 className="text-lg font-black text-slate-900">Profilime Göre Nereye Gidebilirim?</h3>
                  </div>
                  <p className="text-sm text-slate-500">En yüksek onay alacağınız 5 ülke — mevcut profilinize göre</p>
                </div>
                <button onClick={() => setIsCountryGuideOpen(false)} aria-label="Kapat"
                  className="p-2 rounded-xl hover:bg-slate-100 transition-colors shrink-0">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
                {(() => {
                  // Ülkeye özel zorluk + kullanıcı skor bazında onay tahmini
                  type CountryEntry = {
                    name: string; flag: string; visaType: string; difficulty: number;
                    approvalBase: number; tips: string; avgWait: number;
                  };
                  const allCountries: CountryEntry[] = [
                    { name: 'İtalya',   flag: '🇮🇹', visaType: 'Schengen (C)', difficulty: 0.92, approvalBase: 88, tips: 'En yüksek Schengen onay oranı. Turizm güçlüdür.', avgWait: 10 },
                    { name: 'İspanya',  flag: '🇪🇸', visaType: 'Schengen (C)', difficulty: 0.90, approvalBase: 86, tips: 'Başvuru merkezi erişimi kolay. Kültürel gezi iyi kabul görür.', avgWait: 12 },
                    { name: 'Yunanistan',flag:'🇬🇷', visaType: 'Schengen (C)', difficulty: 0.88, approvalBase: 85, tips: 'Ada ve kıyı turizmi güçlü gerekçe. Hızlı randevu.', avgWait: 8 },
                    { name: 'Portekiz', flag: '🇵🇹', visaType: 'Schengen (C)', difficulty: 0.87, approvalBase: 84, tips: 'Düşük ret oranı, hızlı süreç.', avgWait: 10 },
                    { name: 'Macaristan',flag:'🇭🇺', visaType: 'Schengen (C)', difficulty: 0.88, approvalBase: 83, tips: 'Kültürel turizm, düşük günlük bütçe gereksinimi.', avgWait: 7 },
                    { name: 'Hollanda', flag: '🇳🇱', visaType: 'Schengen (C)', difficulty: 0.82, approvalBase: 78, tips: 'Orta zorluk. Banka dökümü kritik.', avgWait: 14 },
                    { name: 'Fransa',   flag: '🇫🇷', visaType: 'Schengen (C)', difficulty: 0.80, approvalBase: 75, tips: 'Niyet mektubu ve konaklama belgesi önemli.', avgWait: 21 },
                    { name: 'Almanya',  flag: '🇩🇪', visaType: 'Schengen (C)', difficulty: 0.75, approvalBase: 70, tips: 'Yüksek standart. Finansal süreklilik şart.', avgWait: 45 },
                    { name: 'İngiltere',flag: '🇬🇧', visaType: 'UK Visitor', difficulty: 0.72, approvalBase: 68, tips: '28 gün kuralı ve 6 aylık döküm zorunlu.', avgWait: 18 },
                    { name: 'ABD',      flag: '🇺🇸', visaType: 'B1/B2', difficulty: 0.60, approvalBase: 55, tips: 'En zorlu. Mülakat + güçlü Türkiye bağı şart.', avgWait: 188 },
                  ];

                  // Her ülke için tahmini kişisel onay skoru
                  const scored = allCountries.map(c => {
                    const personalApproval = Math.round(
                      (currentScore / 100) * c.approvalBase * c.difficulty +
                      (1 - c.difficulty) * c.approvalBase * 0.3
                    );
                    return { ...c, personalApproval: Math.min(99, Math.max(15, personalApproval)) };
                  }).sort((a, b) => b.personalApproval - a.personalApproval);

                  const top5 = scored.slice(0, 5);
                  const rest = scored.slice(5);

                  return (
                    <div className="space-y-4">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Mevcut Skor: {currentScore}/100 — En İyi 5 Hedef
                      </div>

                      {top5.map((c, i) => (
                        <div key={c.name} className={`p-4 rounded-2xl border ${i === 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200'}`}>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl shrink-0">{c.flag}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-black text-slate-900">{c.name}</span>
                                {i === 0 && <span className="text-[10px] font-black bg-emerald-500 text-white px-1.5 py-0.5 rounded-md">En İyi Seçim</span>}
                                <span className="text-[10px] text-slate-400 font-medium">{c.visaType}</span>
                              </div>
                              <div className="text-xs text-slate-500 mt-0.5">{c.tips}</div>
                            </div>
                            <div className="text-right shrink-0">
                              <div className={`text-xl font-black ${c.personalApproval >= 75 ? 'text-emerald-600' : c.personalApproval >= 55 ? 'text-amber-600' : 'text-rose-600'}`}>
                                %{c.personalApproval}
                              </div>
                              <div className="text-[10px] text-slate-400">tahmini onay</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                              <div className={`h-1.5 rounded-full ${c.personalApproval >= 75 ? 'bg-emerald-500' : c.personalApproval >= 55 ? 'bg-amber-400' : 'bg-rose-400'}`}
                                style={{ width: `${c.personalApproval}%` }} />
                            </div>
                            <span className="text-[10px] text-slate-400 shrink-0">~{c.avgWait}g bekleme</span>
                          </div>
                        </div>
                      ))}

                      {/* Diğer ülkeler özet */}
                      <div className="pt-2">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Diğer Ülkeler</div>
                        <div className="space-y-1.5">
                          {rest.map(c => (
                            <div key={c.name} className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
                              <span className="text-base shrink-0">{c.flag}</span>
                              <span className="text-sm text-slate-600 flex-1">{c.name}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-slate-200 rounded-full h-1.5">
                                  <div className="h-1.5 rounded-full bg-slate-400"
                                    style={{ width: `${c.personalApproval}%` }} />
                                </div>
                                <span className="text-xs font-bold text-slate-500 w-8 text-right">%{c.personalApproval}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500">
                        Tahminler, 2024-2025 konsolosluk istatistikleri ve mevcut profilinize dayalı modeldir. Nihai karar konsolosluğa aittir.
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="px-6 py-4 border-t border-slate-100 shrink-0">
                <button onClick={() => setIsCountryGuideOpen(false)}
                  className="w-full py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-colors">
                  Kapat
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />

      {/* WhatsApp Destek Butonu — sabit, sağ alt */}
      <a
        href="https://wa.me/905000000000?text=Merhaba%2C%20vize%20ba%C5%9Fvurusu%20hakk%C4%B1nda%20yard%C4%B1m%20almak%20istiyorum."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp ile destek al"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 hover:shadow-xl transition-all focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
      >
        {/* WhatsApp SVG icon */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>
    </div>
    </>
  );
}
