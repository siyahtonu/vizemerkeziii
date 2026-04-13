/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
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
  ScanLine
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import { GoogleGenAI } from '@google/genai';

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
  fullName: string;
  passportNumber: string;
  targetCountry: string;
  purpose: string;
  startDate: string;
  endDate: string;
  occupation: string;
  monthlyIncome: string;
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
// Kaynak: 2024-2025 Schengen ret oranı istatistikleri (Türk başvurucular)
// ============================================================
interface SchengenCountry {
  name: string;
  flag: string;
  rejectionRate: number;       // Türk başvurucular için ret oranı (%)
  avgProcessDays: number;      // Ortalama işlem süresi
  dailyBudgetReq: number;      // Günlük bütçe gereksinimi (€)
  difficulty: 'Kolay' | 'Orta' | 'Zor' | 'Çok Zor';
  difficultyColor: string;
  strengths: string[];         // Bu konsoloslukta avantaj sağlayan faktörler
  warnings: string[];          // Bu konsoloslukta dikkat edilmesi gerekenler
  tip: string;                 // Özel ipucu
  consulate: string;           // Türkiye'deki konsolosluk şehri
}

const schengenCountries: SchengenCountry[] = [
  {
    name: "Slovakya", flag: "🇸🇰", rejectionRate: 6.6, avgProcessDays: 10,
    dailyBudgetReq: 60, difficulty: "Kolay", difficultyColor: "emerald",
    strengths: ["En düşük ret oranı (%6.6)", "Hızlı işlem", "Esnek finansal değerlendirme"],
    warnings: ["Turistik çekicilik az — güçlü amaç kanıtı şart", "Çok kişi bilmiyor, yoğunluk az"],
    tip: "Slovakya üzerinden başvurarak Schengen geçmişi oluştur, sonra hedef ülkeye geç.",
    consulate: "Ankara"
  },
  {
    name: "İtalya", flag: "🇮🇹", rejectionRate: 8.7, avgProcessDays: 15,
    dailyBudgetReq: 80, difficulty: "Kolay", difficultyColor: "emerald",
    strengths: ["Düşük ret oranı (%8.7)", "Turizm odaklı — seyahat amacı kolay kanıtlanır", "Esnek bütçe değerlendirmesi"],
    warnings: ["Roma/Milano için otel fiyatları yüksek — rezervasyonlar incelenir", "Sahte rezervasyona hassas"],
    tip: "İtalya Schengen'e girmek için stratejik ilk adım. Güçlü turizm geçmişi oluşturur.",
    consulate: "İstanbul / Ankara"
  },
  {
    name: "Slovenya", flag: "🇸🇮", rejectionRate: 10.9, avgProcessDays: 12,
    dailyBudgetReq: 70, difficulty: "Kolay", difficultyColor: "emerald",
    strengths: ["Düşük ret oranı", "Az bilinen avantajlı konsolosluk", "Hızlı randevu"],
    warnings: ["Turistik gerekçe net olmalı"],
    tip: "Az kalabalık konsolosluk sayesinde randevu bulmak kolay.",
    consulate: "Ankara"
  },
  {
    name: "İspanya", flag: "🇪🇸", rejectionRate: 14.2, avgProcessDays: 15,
    dailyBudgetReq: 90, difficulty: "Orta", difficultyColor: "amber",
    strengths: ["Güçlü turizm motivasyonu", "Belge tutarlılığına önem verir"],
    warnings: ["Sahte rezervasyon tespiti çok gelişmiş (UGE-CE sistemi)", "Gizlenmiş ret = kalıcı ban"],
    tip: "İspanya'da sahte rezervasyon sistematik olarak tespit edilir. Yalnızca gerçek rezervasyonla başvur.",
    consulate: "İstanbul / Ankara"
  },
  {
    name: "Fransa", flag: "🇫🇷", rejectionRate: 17.8, avgProcessDays: 20,
    dailyBudgetReq: 100, difficulty: "Orta", difficultyColor: "amber",
    strengths: ["Kültür/sanat amacı iyi karşılanır", "İş bağlantısı güçlü profiller avantajlı"],
    warnings: ["Belge kalitesine çok hassas", "Dil engeli: Fransızca özgeçmiş avantaj sağlar"],
    tip: "Fransa için davetiye veya kültürel etkinlik belgesi (konser, sergi) eklemek onay şansını artırır.",
    consulate: "İstanbul / Ankara"
  },
  {
    name: "Almanya", flag: "🇩🇪", rejectionRate: 22.9, avgProcessDays: 30,
    dailyBudgetReq: 100, difficulty: "Zor", difficultyColor: "orange",
    strengths: ["İş/ticaret amacı güçlü kabul görür", "Uzun kıdem avantajlı"],
    warnings: ["Ankara'da ret %27.1, İstanbul'da %21.5", "Finansal süreklilik miktardan önemli", "Beklenmedik mevduat anında ret sebebi"],
    tip: "Almanya için son 6 ayın her ayında sabit maaş görünmeli. Tek büyük yatırım yerine aylık düzenlilik aranır.",
    consulate: "İstanbul (daha düşük ret) / Ankara / İzmir"
  },
  {
    name: "Hollanda", flag: "🇳🇱", rejectionRate: 24.1, avgProcessDays: 25,
    dailyBudgetReq: 110, difficulty: "Zor", difficultyColor: "orange",
    strengths: ["İş/fuar amacı iyi değerlendirilir"],
    warnings: ["Yüksek ret oranı", "Güçlü finansal kanıt şart"],
    tip: "Hollanda için davet mektubu (fuar, iş toplantısı) başarı şansını önemli ölçüde artırır.",
    consulate: "Ankara"
  },
  {
    name: "Danimarka", flag: "🇩🇰", rejectionRate: 39.4, avgProcessDays: 35,
    dailyBudgetReq: 120, difficulty: "Çok Zor", difficultyColor: "rose",
    strengths: ["Akraba daveti güçlü kanıt"],
    warnings: ["Türkler için %39.4 ret — en yüksek gruplardan", "Çok katı finansal inceleme", "Kısa kıdem kesin ret sebebi"],
    tip: "Danimarka'ya direkt başvurmak yerine önce İtalya/İspanya Schengen geçmişi oluştur.",
    consulate: "Ankara"
  },
  {
    name: "Finlandiya", flag: "🇫🇮", rejectionRate: 31.3, avgProcessDays: 30,
    dailyBudgetReq: 115, difficulty: "Çok Zor", difficultyColor: "rose",
    strengths: ["Akraba ziyareti güçlü gerekçe"],
    warnings: ["Yüksek ret oranı (%31.3)", "Kış turizmi gerekçesi zayıf bulunabilir"],
    tip: "Finlandiya için çok güçlü finansal profil ve önceki Schengen geçmişi şart.",
    consulate: "Ankara"
  },
  {
    name: "Estonya", flag: "🇪🇪", rejectionRate: 42.5, avgProcessDays: 40,
    dailyBudgetReq: 100, difficulty: "Çok Zor", difficultyColor: "rose",
    strengths: ["Dijital nomad/teknoloji iş amacı kabul görebilir"],
    warnings: ["En yüksek ret oranı (%42.5) — Türkler için", "Çok az turist için uygun"],
    tip: "Estonya'ya başvurmak yerine başka konsolosluğu tercih et. Bu istatistik çok yüksek.",
    consulate: "Ankara"
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

export default function App() {
  const [step, setStep] = useState<'hero' | 'assessment' | 'dashboard' | 'letter' | 'tactics'>('hero');
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

  // Özellik 2: Randevu Takvimi
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [travelDate, setTravelDate] = useState('');
  const [selectedConsulate, setSelectedConsulate] = useState('ABD');

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
  const [aiBankResult, setAiBankResult] = useState<string>('');
  const [aiBankFile, setAiBankFile] = useState<string>('');
  const [applicantType, setApplicantType] = useState<'employer' | 'unemployed' | 'minor'>('employer');
  
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
  const [ocrResults, setOcrResults] = useState<{file: string, status: string}[]>([]);
  const [simulatorValue, setSimulatorValue] = useState(0); // For dynamic balance simulation

  const [letterData, setLetterData] = useState<LetterData>({
    fullName: '',
    passportNumber: '',
    targetCountry: 'Almanya',
    purpose: 'Turistik Gezi',
    startDate: '',
    endDate: '',
    occupation: '',
    monthlyIncome: '',
  });

  // ============================================================
  // GELİŞMİŞ VİZE BAŞARI SKORU HESAPLAYICI v2.0
  // 2025-2026 Konsolosluk Kriterleri + Çok Katmanlı Ağırlıklı Sistem
  // Hedef: Danışmanlık müşterilerinde %90+ başarı oranı
  // ============================================================
  const calculateScore = (data: ProfileData, simValue: number = 0) => {
    let score = 10; // Temel başlangıç puanı

    // ─────────────────────────────────────────────────────────
    // BÖLÜM 1: FİNANSAL GÜÇ (Maks 28 puan)
    // Araştırma: Konsoloslukların en çok reddettiği alan (%25-30 ret)
    // ─────────────────────────────────────────────────────────

    // Yeterli bakiye (simülatörle desteklenir)
    if (data.bankSufficientBalance || simValue > 150000) score += 7;
    else if (simValue > 75000) score += 3;

    // Yüksek birikim → güçlü güvence
    if (data.highSavingsAmount || simValue > 350000) score += 5;

    // Gelir düzenliliği (Konsolosluk: "süreklilik miktar kadar önemli")
    if (data.bankRegularity) score += 5;

    // Gelir kaynağı banka dökümünde net görünüyor mu?
    if (data.incomeSourceClear) score += 4;

    // Düzenli maaş tespiti
    if (data.salaryDetected) score += 3;

    // Gayrimenkul/araç → geri dönüş güvencesi
    if (data.hasAssets) score += 3;

    // Düzenli harcama kalıbı (aktif hesap)
    if (data.hasRegularSpending && data.recurringExpensesDetected) score += 3;

    // Günlük bütçe yeterliliği (Schengen €100-120/gün kriteri)
    if (data.dailyBudgetSufficient) score += 4;

    // CEZALAR - Finansal
    if (!data.hasRegularSpending) score -= 8;      // "Ölü hesap" - emanet şüphesi
    if (data.hasSuspiciousLargeDeposit) score -= 10; // Son dakika toplu para → kritik ret sebebi
    if (data.unusualLargeTransactions) score -= 5;   // Açıklanamayan büyük hareketler
    if (data.monthlyInflow < data.monthlyOutflow && data.monthlyInflow > 0) score -= 6; // Negatif nakit akışı

    // ─────────────────────────────────────────────────────────
    // BÖLÜM 2: İNGİLTERE ÖZEL KURALLAR (UK Critical Rules)
    // 28-Gün Kuralı + 6 Aylık Döküm → UK'te ret/onayın en net belirleyicisi
    // ─────────────────────────────────────────────────────────
    if (data.targetCountry === 'İngiltere') {
      if (data.has28DayHolding) score += 8;   // Para 28 gün hesapta bekledi
      else score -= 12;                        // Beklemedi → neredeyse kesin ret

      if (data.has6MonthStatements) score += 6;  // 6 aylık döküm tam
      else if (data.statementMonths >= 3) score += 2; // 3 aylık minimum
      else score -= 8;                          // Eksik döküm → otomatik ret
    }

    // ─────────────────────────────────────────────────────────
    // BÖLÜM 3: MESLEKİ BAĞLILIK (Maks 22 puan)
    // Araştırma: İstihdam + işveren mektubu en güçlü tek bağ kategorisi
    // ─────────────────────────────────────────────────────────
    if (data.hasSgkJob) score += 12;           // SGK kaydı → en önemli profesyonel kanıt
    if (data.isPublicSectorEmployee) score += 6; // Kamu çalışanı → en yüksek güven grubu
    if (data.sgkEmployerLetterWithReturn) score += 5; // İşverenden dönüş garantili yazı

    // Kıdem bonusu (araştırma: yeni işe girenler reddediliyor)
    if (data.yearsInCurrentJob >= 3) score += 5;
    else if (data.yearsInCurrentJob === 2) score += 4;
    else if (data.yearsInCurrentJob === 1) score += 2;
    else score -= 4;  // <1 yıl kıdem: düşük güven

    if (data.sgkAddressMatchesDs160) score += 2;  // Adres tutarlılığı
    if (data.hasBarcodeSgk) score += 2;           // Barkodlu SGK → sahtecilik önleyici

    // ─────────────────────────────────────────────────────────
    // BÖLÜM 4: ÇOK KATMANLI BAĞLAR - "Multifaceted Ties" (Maks 20 puan)
    // Araştırma: Tek bağ yeterli değil, konsolosluk memurunun
    // "toplam hayat bağlantısını" değerlendirdiği kısım
    // ─────────────────────────────────────────────────────────
    const activeTieCount = [
      data.tieCategories?.employment,
      data.tieCategories?.property,
      data.tieCategories?.family,
      data.tieCategories?.community,
      data.tieCategories?.education,
    ].filter(Boolean).length;

    // Her bağ kategorisi ayrı puan
    if (data.tieCategories?.employment) score += 5;  // İstihdam bağı
    if (data.tieCategories?.property) score += 5;   // Mülkiyet bağı
    if (data.tieCategories?.family) score += 4;     // Aile bağı
    if (data.tieCategories?.community) score += 3;  // Sosyal/topluluk bağı
    if (data.tieCategories?.education) score += 3;  // Eğitim bağı

    // Çok katmanlılık bonusu (3+ farklı kategoride bağ = güçlü profil)
    if (activeTieCount >= 4) score += 6;
    else if (activeTieCount === 3) score += 3;

    // Legacy alanlarla da uyum
    if (data.isMarried) score += 3;
    if (data.hasChildren) score += 3;
    if (data.isStudent) score += 2;
    if (data.strongFamilyTies) score += 1;
    if (data.hasSocialMediaFootprint) score += 2;  // 2025: Dijital ayak izi güven faktörü

    // ─────────────────────────────────────────────────────────
    // BÖLÜM 5: SEYAHAT GEÇMİŞİ (Maks 20 puan)
    // Araştırma: Önceki güçlü vize → en hızlı onay yolu
    // ─────────────────────────────────────────────────────────
    if (data.hasHighValueVisa) score += 20;      // ABD/UK/Schengen geçmişi → altın kart
    else if (data.hasOtherVisa) score += 12;
    else if (data.travelHistoryNonVisa) score += 6;

    if (!data.noOverstayHistory) score -= 45;   // Süre aşımı → 2025'te hemen hemen kesin ret

    // Önceki ret yönetimi (araştırma: gizlemek, retten daha kötü)
    if (data.hasPreviousRefusal && !data.previousRefusalDisclosed) score -= 20; // Beyan etmemek = dolandırıcılık
    if (data.hasPreviousRefusal && data.previousRefusalDisclosed) score -= 5;   // Beyan edilmiş ret → küçük ceza

    // ─────────────────────────────────────────────────────────
    // BÖLÜM 6: BAŞVURU KALİTESİ & NİYET KANITI (Maks 15 puan)
    // Araştırma: Belge organizasyonu memur kararını doğrudan etkiliyor
    // ─────────────────────────────────────────────────────────
    if (data.useOurTemplate) score += 5;         // Profesyonel niyet mektubu şablonu
    if (data.hasInvitation) score += 3;          // Davetiye → güçlü amaç kanıtı
    if (data.paidReservations) score += 3;
    if (data.addressMatchSgk) score += 2;
    if (data.datesMatchReservations) score += 2; // Tarih tutarlılığı
    if (data.purposeClear) score += 2;
    if (data.hasReturnTicket) score += 3;        // Dönüş bileti = geri dönüş niyeti
    if (!data.noFakeBooking) score -= 15;        // SAHTE rezervasyon = yasak listesi riski

    // ABD Mülakatı hazırlığı
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
    if (data.passportValidityLong) score += 3;   // Vize bitişinden 6+ ay geçerlilik
    if (data.documentConsistency) score += 3;    // Tüm belgeler arası tutarlılık
    if (data.cleanCriminalRecord) score += 3;

    // Sigorta (Schengen'de zorunlu - eksikse ret)
    if (data.hasHealthInsurance || data.hasTravelInsurance) score += 4;
    if (data.targetCountry !== 'ABD' && data.targetCountry !== 'İngiltere' &&
        !data.hasHealthInsurance && !data.hasTravelInsurance) score -= 10; // Schengen zorunlu

    // ─────────────────────────────────────────────────────────
    // BÖLÜM 8: ÜLKEYE ÖZEL DÜZELTMELER
    // Araştırma: Türk vatandaşlarına göre ülke zorluk çarpanları
    // ─────────────────────────────────────────────────────────
    const countryDifficulty: Record<string, number> = {
      'İtalya': +3,     // %8.7 ret oranı - en kolay Schengen
      'İspanya': +2,    // Orta kolaylık
      'Fransa': 0,      // Ortalama
      'Almanya': -3,    // Ankara %27.1, İstanbul %21.5 ret oranı
      'İngiltere': -2,  // ETA sonrası sıkılaştı
      'ABD': -5,        // B2 ret oranı %20.6 - İstanbul 188 gün bekleme
    };
    score += (countryDifficulty[data.targetCountry] ?? 0);

    return Math.max(0, Math.min(score, 100));
  };

  const currentScore = useMemo(() => calculateScore(profile, simulatorValue), [profile, simulatorValue]);

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
      personaDestiny = "Konsoloslukların en hızlı onayladığı grup. Kamu çalışanlarında geri dönüş riski sıfıra yakın. İtalya/Almanya için onay neredeyse garantili.";
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

  // ── Özellik 8: AI Banka Dökümü Analizi ─────────────────────
  const analyzeWithAI = async (base64: string, fileName: string) => {
    setAiBankLoading(true);
    setAiBankResult('');
    try {
      const apiKey = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) || '';
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        setAiBankResult(`## Demo Analiz Sonucu (API Anahtarı Gerekli)

**Dosya:** ${fileName}

Gerçek AI analizi için .env dosyasına GEMINI_API_KEY eklemeniz gerekiyor.

Sistematik analiz şunları kontrol eder:
- ✅ Maaş/Hakediş girişleri tespit edildi mi?
- ✅ Son 6 ayda düzenli hareket var mı?
- ✅ 28 gün kuralı: Para ne zaman yatmış?
- ✅ Şüpheli büyük girişler var mı?
- ✅ Aylık ortalama bakiye yeterli mi?
- ✅ Harcama kalıbı aktif bir hesabı gösteriyor mu?

**Kurulum:** Netlify/Render dashboard'unda GEMINI_API_KEY environment variable olarak ekleyin.`);
        return;
      }
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [{
          parts: [
            { text: `Sen uzman bir vize danışmanısın. Bu banka hesap dökümünü analiz et ve Türk vatandaşlarının İngiltere/Schengen/ABD vize başvuruları için değerlendir:

1. Maaş/düzenli gelir tespiti var mı? Hangi tarihlerde?
2. Son 28 gün içinde büyük/şüpheli para girişi var mı?
3. Aylık ortalama bakiye ne kadar?
4. Düzenli harcama kalıbı (kira, fatura, abonelik) var mı?
5. Vize başvurusu için güçlü yönler neler?
6. Zayıf yönler ve riskler neler?
7. Genel değerlendirme ve öneri (1-10 arası puan ver)

Türkçe, madde madde ve net bir şekilde yanıtla.` },
            { inlineData: { mimeType: 'application/pdf', data: base64 } }
          ]
        }]
      });
      setAiBankResult(response.text || 'Analiz tamamlandı fakat sonuç alınamadı.');
    } catch (err) {
      setAiBankResult(`Analiz sırasında hata oluştu: ${err instanceof Error ? err.message : 'Bilinmeyen hata'}. GEMINI_API_KEY\'in doğru ayarlandığından emin olun.`);
    } finally {
      setAiBankLoading(false);
    }
  };

  const handleAiBankUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setAiBankFile(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = (e.target?.result as string)?.split(',')[1] || '';
      analyzeWithAI(base64, file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleOcrUpload = (files: FileList | null) => {
    if (!files) return;
    setIsOcrScanning(true);
    setOcrResults([]);
    
    // Simulate OCR processing
    setTimeout(() => {
      setIsOcrScanning(false);
      setOcrResults([
        { file: 'pasaport.pdf', status: 'Pasaport Geçerli (2027) - OK' },
        { file: 'banka_dokumu.pdf', status: 'Maaş, Kira ve 4 Abonelik Tespit Edildi - OK' },
        { file: 'sgk_hizmet.pdf', status: '2 Yıl 1 Ay Kıdem Tespit Edildi - OK' }
      ]);
      setProfile((prev: ProfileData) => ({
        ...prev,
        hasValidPassport: true,
        passportValidityLong: true,
        bankRegularity: true,
        hasSteadyIncome: true,
        salaryDetected: true,
        recurringExpensesDetected: true,
        hasRegularSpending: true,
        incomeSourceClear: true,
        has6MonthStatements: false,
        has28DayHolding: false,
        lowSpendingActivity: false,
        unusualLargeTransactions: false,
        monthlyInflow: 65000,
        monthlyOutflow: 42000,
        transactionFrequency: 'high' as const,
        recurringPaymentTypes: ['Maaş', 'Kira', 'Fatura', 'Netflix', 'Spor Salonu'],
        hasSgkJob: true,
        yearsInCurrentJob: 2,
        hasBarcodeSgk: true,
        documentConsistency: true,
        tieCategories: {
          employment: true,
          property: false,
          family: false,
          community: false,
          education: false,
        }
      }));
    }, 3000);
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

  const generatePDF = (type: 'cover' | 'sponsor' | 'employer' | 'itinerary' = 'cover') => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString('tr-TR');
    
    // jsPDF default fonts do not support Turkish characters well. 
    // We normalize them to ensure the PDF is readable and professional.
    const normalizeTr = (text: string) => {
      return text
        .replace(/ğ/g, 'g').replace(/Ğ/g, 'G')
        .replace(/ü/g, 'u').replace(/Ü/g, 'U')
        .replace(/ş/g, 's').replace(/Ş/g, 'S')
        .replace(/ı/g, 'i').replace(/İ/g, 'I')
        .replace(/ö/g, 'o').replace(/Ö/g, 'O')
        .replace(/ç/g, 'c').replace(/Ç/g, 'C');
    };

    doc.setFontSize(10);
    doc.text(date, 170, 20);
    
    doc.setFontSize(14);
    const titles = {
      cover: 'VIZE NIYET MEKTUBU (COVER LETTER)',
      sponsor: 'SPONSORLUK TAAHHUTNAMESI',
      employer: 'ISVEREN CALISMA VE IZIN BELGESI',
      itinerary: 'DETAYLI SEYAHAT PLANI (ITINERARY)'
    };
    doc.text(titles[type], 20, 35);
    
    doc.setFontSize(11);
    
    let body = '';
    if (type === 'cover') {
      body = `Ilgili Makama / Sayin Konsolosluk Yetkilisi,

Konu: Turistik Vize Basvurusu - ${letterData.fullName} (Pasaport No: ${letterData.passportNumber})

Ben ${letterData.fullName}, ${letterData.targetCountry} ulkesine ${letterData.startDate} ile ${letterData.endDate} tarihleri arasinda '${letterData.purpose}' amaciyla gerceklestirmeyi planladigim seyahatime istinaden bu dilekceyi sunuyorum.

Profesyonel Durumum ve Finansman:
Su anda Turkiye'de yerlesik olarak ${letterData.occupation} pozisyonunda calismaktayim ve aylik duzenli gelirim ${letterData.monthlyIncome} TL'dir. Seyahatim suresince olusacak ucak, konaklama, sehir ici ulasim, yeme-icme ve acil saglik gibi tum masraflarim sahsim tarafindan, ekte dokumlerini sundugum sahsi banka hesabimdan karsilanacaktir.

Seyahat Amacim ve Geri Donus Taahhudum:
Bu seyahatin temel amaci tamamen turistik ve kulturel kesiftir. Turkiye'deki kurulu duzenim, devam eden mesleki kariyerim ve ailevi baglarim sebebiyle, vizemin bitis tarihinden once ulkeme kesin olarak donus yapacagimi ve isime/duzenime geri donecegimi taahhut ederim. 

Seyahatim boyunca hedef ulkenizin yasalarina harfiyen uyacagimi beyan eder, vize basvurumun olumlu degerlendirilmesini saygilarimla arz ederim.

Saygilarimla,

Ad Soyad: ${letterData.fullName}
Imza: ___________________
Telefon: [Telefon Numaranizi Yazin]
E-posta: [E-posta Adresinizi Yazin]`;
    } else if (type === 'sponsor') {
      body = `Ilgili Makama / Sayin Konsolosluk Yetkilisi,

Konu: ${letterData.fullName} (Pasaport No: ${letterData.passportNumber}) icin Sponsorluk Taahhutnamesi

Ben [Sponsorun Adi Soyadi], bu dilekce ile [Yakinlik Derecesi, orn: Oglum/Kizim/Esim] olan ${letterData.fullName}'in ${letterData.startDate} - ${letterData.endDate} tarihleri arasinda ${letterData.targetCountry} ulkesine yapacagi '${letterData.purpose}' amacli seyahatin yegane finansal sponsoru oldugumu beyan ederim.

Finansal Taahhut:
Basvuru sahibinin seyahati boyunca ihtiyac duyacagi gidis-donus ucak biletleri, otel konaklamasi, gunluk harcamalari, sehir ici ulasim ve olasi acil saglik masraflarinin tamami tarafimca karsilanacaktir. Bu harcamalari rahatlikla karsilayabilecegimi gosteren sahsi banka hesap dokumlerim, maas bordrolarim ve isyeri belgelerim basvuru dosyasina eklenmistir.

Geri Donus Taahhudum:
${letterData.fullName}'in seyahatini tamamladiktan sonra vize suresi ihlali yapmadan Turkiye'ye kesin donus yapacagini sahsen garanti ederim.

Gereginin yapilmasini saygilarimla arz ederim.

Sponsor Adi Soyadi: [Sponsorun Adi Soyadi]
Imza: ___________________
TC Kimlik No: [Sponsor TC Kimlik No]
Telefon: [Sponsor Telefon Numarasi]
Adres: [Sponsor Ikamet Adresi]`;
    } else if (type === 'employer') {
      body = `[Sirket Antetli Kagidina Yazdirilmalidir]

Ilgili Makama / ${letterData.targetCountry} Baskonsoloslugu Vize Bolumune,

Konu: Calisma Belgesi ve Izin Onayi - ${letterData.fullName}

Bu belge, ${letterData.fullName} isimli calisanimizin (TC Kimlik No: [TC No], Pasaport No: ${letterData.passportNumber}) sirketimizde [Ise Baslama Tarihi] tarihinden bu yana tam zamanli ve kadrolu olarak "${letterData.occupation}" pozisyonunda calismakta oldugunu dogrulamak amaciyla duzenlenmistir. Calisanimizin aylik net maasi ${letterData.monthlyIncome} TL'dir.

Calisanimiz, ${letterData.startDate} ile ${letterData.endDate} tarihleri arasinda ${letterData.targetCountry} ulkesine yapacagi turistik seyahat icin sirketimizden resmi olarak yillik ucretli izne ayrilmistir. 

Geri Donus Garantisi:
Calisanimiz ${letterData.fullName}, seyahatini tamamlamasinin ardindan [Ise Donus Tarihi] tarihinde sirketimizdeki gorevine ve mevcut pozisyonuna ayni sartlarda geri donecek ve mesaisine devam edecektir.

Calisanimizin vize basvurusunun olumlu degerlendirilmesini rica ederiz. Herhangi bir ek bilgi talebiniz olmasi durumunda asagidaki iletisim bilgilerinden bize ulasabilirsiniz.

Saygilarimizla,

Sirket Yetkilisi Adi Soyadi: [Yetkili Adi]
Unvani: [Orn: Insan Kaynaklari Muduru]
Imza ve Sirket Kasesi: ___________________
Sirket Telefonu: [Sirket Telefonu]
Sirket Adresi: [Sirket Adresi]`;
    } else if (type === 'itinerary') {
      body = `DETAYLI SEYAHAT PLANI (ITINERARY)

Basvuru Sahibi: ${letterData.fullName}
Pasaport No: ${letterData.passportNumber}
Hedef Ulke: ${letterData.targetCountry}
Seyahat Tarihleri: ${letterData.startDate} - ${letterData.endDate}

Ulasim Bilgileri:
- Gidis Ucusu: [Tarih], [Kalkis Sehri] -> [Varis Sehri], Ucus No: [Orn: TK1907]
- Donus Ucusu: [Tarih], [Kalkis Sehri] -> [Varis Sehri], Ucus No: [Orn: TK1908]

Konaklama Bilgileri:
- Otel Adi: [Otel Adi]
- Adres: [Otel Tam Adresi]
- Rezervasyon No: [Rezervasyon Numarasi]

Gunluk Rota ve Aktiviteler:
1. Gun (${letterData.startDate}): ${letterData.targetCountry}'ye varis, otele transfer ve check-in. Cevreyi tanima ve dinlenme.
2. Gun: Sehir merkezindeki tarihi ve turistik lokasyonlarin (Orn: Ana meydan, muzeler) ziyareti.
3. Gun: Kulturel etkinlikler, yerel gastronomi deneyimi ve alisveris.
4. Gun: Yakin cevredeki turistik bir bolgeye gunubirlik gezi.
5. Gun (${letterData.endDate}): Otelden cikis islemleri, havalimanina transfer ve Turkiye'ye donus ucusu.

* Not: Tum ucak ve otel rezervasyon belgeleri basvuru dosyasina eklenmistir.`;
    }

    const splitText = doc.splitTextToSize(normalizeTr(body), 170);
    doc.text(splitText, 20, 50);
    
    doc.save(`vize_${type}_${normalizeTr(letterData.fullName).replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-brand-100 selection:text-brand-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div 
            onClick={() => setStep('hero')}
            className="flex items-center gap-2.5 font-display font-bold text-2xl text-brand-600 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="tracking-tight">VizeAsistan</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Yapay Zeka Aktif
            </div>
            <button 
              onClick={() => setIsCopilotOpen(true)}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors relative"
            >
              <MessageSquare className="w-5 h-5 text-slate-600" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-brand-500 border-2 border-white rounded-full" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
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
                      İngiltere Vizesi Evrak Listesi
                    </h3>
                    <p className="text-slate-500 mt-1">Başvuru tipinize göre hazırlamanız gereken evraklar ve ücretlendirme.</p>
                  </div>
                  <button 
                    onClick={() => setIsDocumentListOpen(false)}
                    className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-slate-500" />
                  </button>
                </div>

                <div className="p-8 overflow-y-auto flex-1">
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
                        <Sparkles className="w-4 h-4" /> Gemini AI
                      </div>
                      <h3 className="text-2xl font-black">AI Banka Dökümü Analizi</h3>
                      <p className="text-blue-100 text-sm mt-1">PDF banka dökümünüzü yükleyin — Gemini AI vize açısından analiz etsin.</p>
                    </div>
                    <button onClick={() => setIsAiBankOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-6 h-6"/></button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                  {/* Yükleme alanı */}
                  <label className={`flex flex-col items-center justify-center gap-4 p-12 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${aiBankLoading ? 'border-blue-400 bg-blue-50/50' : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50/30'}`}>
                    <input type="file" accept=".pdf,image/*" className="hidden"
                      onChange={e => handleAiBankUpload(e.target.files)} disabled={aiBankLoading} />
                    {aiBankLoading ? (
                      <>
                        <motion.div animate={{rotate:360}} transition={{duration:1,repeat:Infinity,ease:'linear'}}>
                          <Sparkles className="w-10 h-10 text-blue-600" />
                        </motion.div>
                        <div className="text-center">
                          <p className="font-bold text-blue-700">Gemini AI analiz ediyor...</p>
                          <p className="text-sm text-slate-500 mt-1">{aiBankFile}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
                          <Upload className="w-8 h-8 text-blue-600" />
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-slate-700">PDF veya Görsel Yükle</p>
                          <p className="text-sm text-slate-400 mt-1">Banka dökümünüzü buraya sürükleyin veya tıklayın</p>
                        </div>
                      </>
                    )}
                  </label>

                  {/* Analiz sonucu */}
                  {aiBankResult && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-blue-600" />
                        <h4 className="font-bold text-slate-900">AI Analiz Sonucu</h4>
                        <button onClick={() => { setAiBankResult(''); setAiBankFile(''); }}
                          className="ml-auto flex items-center gap-1 text-sm font-bold text-blue-600 hover:underline">
                          <RefreshCw className="w-4 h-4" /> Yeni Analiz
                        </button>
                      </div>
                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {aiBankResult}
                      </div>
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex gap-3">
                        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-800">Bu analiz yardımcı bir araçtır. Son karar konsolosluk memuruna aittir.</p>
                      </div>
                    </div>
                  )}

                  {/* Ne analiz eder */}
                  {!aiBankResult && !aiBankLoading && (
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                      <h5 className="font-bold text-slate-700 text-sm mb-3">AI Ne Analiz Eder?</h5>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          '💰 Maaş/gelir tespiti', '📅 28-gün kuralı kontrolü',
                          '🔴 Şüpheli büyük girişler', '📊 Aylık bakiye ortalaması',
                          '🔄 Düzenli harcama kalıbı', '⚠️ Risk değerlendirmesi',
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-slate-600 bg-white px-3 py-2 rounded-xl border border-slate-100">
                            {item}
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
                        Profilinize göre hangi konsoloslukta onay şansınız en yüksek? 2024-2025 ret oranları.
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
                  {/* Öneri bandı */}
                  {(() => {
                    const best = [...schengenCountries]
                      .filter(c => c.difficulty === 'Kolay' || (currentScore >= 65 && c.difficulty === 'Orta'))
                      .sort((a, b) => a.rejectionRate - b.rejectionRate)[0];
                    return best ? (
                      <div className="p-5 bg-emerald-50 border-2 border-emerald-200 rounded-2xl flex items-start gap-4 mb-2">
                        <div className="text-3xl">{best.flag}</div>
                        <div>
                          <div className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-1">
                            🎯 Profiliniz İçin En Uygun Seçim
                          </div>
                          <div className="font-bold text-slate-900 text-lg">{best.name} — Ret Oranı %{best.rejectionRate}</div>
                          <p className="text-sm text-slate-600 mt-1">{best.tip}</p>
                        </div>
                      </div>
                    ) : null;
                  })()}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {schengenCountries.map((country) => {
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
                                <div className="text-xs text-slate-500">{country.consulate}</div>
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
                          <div className="mb-3">
                            <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                              <span>Türk Başvurucular — Ret Oranı</span>
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

                          {/* Günlük bütçe */}
                          <div className="mt-3 flex items-center justify-between">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Günlük Bütçe Kriteri</div>
                            <div className="text-sm font-black text-slate-700">€{country.dailyBudgetReq}/gün</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0 rounded-b-[2.5rem]">
                  <p className="text-xs text-slate-400 text-center">
                    * Veriler 2024-2025 Schengen istatistiklerine dayanmaktadır. Ret oranları Türk başvurucuları için hesaplanmıştır.
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
                className="absolute inset-0 bg-slate-950/50 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden"
              >
                {/* Header */}
                <div className="p-8 border-b border-slate-100 bg-gradient-to-r from-violet-600 to-purple-700 text-white shrink-0 rounded-t-[2.5rem]">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 text-violet-200 text-xs font-bold uppercase tracking-widest mb-2">
                        <ShieldCheck className="w-4 h-4" /> 2025 Konsolosluk Tarama Kriterleri
                      </div>
                      <h3 className="text-2xl font-black">Sosyal Medya Denetim Rehberi</h3>
                      <p className="text-violet-100 text-sm mt-1">
                        Başvurunuzdan önce sosyal medyanızı "vize-safe" hale getirin.
                      </p>
                    </div>
                    <button onClick={() => setIsSocialMediaOpen(false)}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  {/* İlerleme */}
                  {(() => {
                    const total = socialMediaChecklist.length;
                    const checked = Object.values(socialMediaChecked).filter(Boolean).length;
                    const pct = Math.round((checked / total) * 100);
                    return (
                      <div className="mt-6">
                        <div className="flex justify-between text-xs font-bold text-violet-200 mb-2">
                          <span>Tamamlanan Adımlar</span>
                          <span>{checked}/{total} — %{pct}</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div className="bg-white h-2 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* İçerik */}
                <div className="overflow-y-auto flex-1 p-6 space-y-6">
                  {/* KRİTİK RİSKLER */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 bg-rose-100 rounded-lg flex items-center justify-center">
                        <AlertCircle className="w-4 h-4 text-rose-600" />
                      </div>
                      <h4 className="font-black text-slate-900 text-sm uppercase tracking-wide">Kritik Riskler — Hemen Kontrol Et</h4>
                    </div>
                    <div className="space-y-3">
                      {socialMediaChecklist.filter(item => item.category === 'risk').map((item) => (
                        <div key={item.id}
                          onClick={() => setSocialMediaChecked(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all select-none ${socialMediaChecked[item.id] ? 'bg-rose-50 border-rose-200 opacity-60' : 'bg-white border-rose-100 hover:border-rose-200'}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all ${socialMediaChecked[item.id] ? 'bg-rose-500 border-rose-500' : 'border-rose-300'}`}>
                              {socialMediaChecked[item.id] && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-slate-900 text-sm">{item.title}</span>
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ml-2 shrink-0 ${item.severity === 'critical' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                                  {item.severity === 'critical' ? 'KRİTİK' : 'UYARI'}
                                </span>
                              </div>
                              <div className="text-[10px] font-bold text-violet-500 mb-1">{item.platform}</div>
                              <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* YAPILMASI GEREKENLER */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Target className="w-4 h-4 text-blue-600" />
                      </div>
                      <h4 className="font-black text-slate-900 text-sm uppercase tracking-wide">Yapılması Gerekenler</h4>
                    </div>
                    <div className="space-y-3">
                      {socialMediaChecklist.filter(item => item.category === 'action').map((item) => (
                        <div key={item.id}
                          onClick={() => setSocialMediaChecked(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all select-none ${socialMediaChecked[item.id] ? 'bg-blue-50 border-blue-200 opacity-60' : 'bg-white border-blue-100 hover:border-blue-200'}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all ${socialMediaChecked[item.id] ? 'bg-blue-500 border-blue-500' : 'border-blue-300'}`}>
                              {socialMediaChecked[item.id] && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-slate-900 text-sm">{item.title}</span>
                              </div>
                              <div className="text-[10px] font-bold text-violet-500 mb-1">{item.platform}</div>
                              <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* POZİTİF FAKTÖRLER */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                      </div>
                      <h4 className="font-black text-slate-900 text-sm uppercase tracking-wide">Profili Güçlendiren İçerikler</h4>
                    </div>
                    <div className="space-y-3">
                      {socialMediaChecklist.filter(item => item.category === 'positive').map((item) => (
                        <div key={item.id}
                          onClick={() => setSocialMediaChecked(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all select-none ${socialMediaChecked[item.id] ? 'bg-emerald-50 border-emerald-200 opacity-60' : 'bg-white border-emerald-100 hover:border-emerald-200'}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all ${socialMediaChecked[item.id] ? 'bg-emerald-500 border-emerald-500' : 'border-emerald-300'}`}>
                              {socialMediaChecked[item.id] && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-slate-900 text-sm">{item.title}</span>
                                <span className="text-[10px] font-black px-2 py-0.5 rounded-lg ml-2 shrink-0 bg-emerald-100 text-emerald-600">AVANTAJ</span>
                              </div>
                              <div className="text-[10px] font-bold text-violet-500 mb-1">{item.platform}</div>
                              <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0 rounded-b-[2.5rem]">
                  <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-200">
                    <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800 leading-relaxed">
                      <strong>Not:</strong> Her konsolosluk sosyal medyayı taramaz, ancak 2025 itibarıyla ABD, İngiltere ve bazı Schengen ülkelerinin bu yöntemi giderek daha fazla kullandığı bilinmektedir. Önlem almak her zaman daha güvenlidir.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Visa Copilot Sidebar */}
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
                      <h3 className="font-bold text-xl">Visa Copilot</h3>
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
              className="text-center space-y-16 py-12 lg:py-20"
            >
              <div className="space-y-8 max-w-4xl mx-auto">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-700 rounded-full text-xs font-bold tracking-widest uppercase border border-brand-100"
                >
                  <ShieldCheck className="w-4 h-4" /> Yapay Zeka Destekli Vize Stratejisti
                </motion.div>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-slate-900 leading-[1.05]">
                  Vize Başvurunuzda <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">Sıfır Hata Payı</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
                  Profesyonel danışmanlık kalitesini dijitalleştiriyoruz. Başarı ihtimalinizi hesaplayın, evraklarınızı optimize edin ve niyet mektubunuzu saniyeler içinde oluşturun.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <button 
                  onClick={() => setIsCalculatorOpen(true)}
                  className="btn-primary text-lg px-10 py-5 flex items-center justify-center gap-3 group"
                >
                  Hemen Hesapla 
                  <TrendingUp className="w-5 h-5 group-hover:translate-y-[-2px] group-hover:translate-x-[2px] transition-transform" />
                </button>
                <button 
                  onClick={() => setStep('assessment')}
                  className="btn-secondary text-lg px-10 py-5"
                >
                  Nasıl Çalışır?
                </button>
              </div>

              {/* Stats bar */}
              <div className="flex flex-wrap justify-center gap-8 pt-6">
                {[
                  { value: '%93', label: 'Ortalama Onay Oranı' },
                  { value: '10+', label: 'Analiz Aracı' },
                  { value: '2026', label: 'Güncel Konsolosluk Verisi' },
                  { value: 'AI', label: 'Yapay Zeka Destekli' },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <div className="text-3xl font-black text-brand-600">{s.value}</div>
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                {[
                  { icon: TrendingUp, title: "Akıllı Analiz", desc: "25+ kriter üzerinden vize memuru gözüyle profilinizi puanlıyoruz.", color: "brand" },
                  { icon: FileText, title: "Evrak Optimizasyonu", desc: "Tüm belgeleriniz arasındaki tutarsızlıkları yapay zeka ile denetliyoruz.", color: "indigo" },
                  { icon: PenTool, title: "İkna Edici Mektup", desc: "Konsolosluk standartlarında, kişiselleştirilmiş niyet mektubu oluşturuyoruz.", color: "violet" }
                ].map((item, i) => (
                  <div key={`hero-feature-${i}`} className="group p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-brand-500/5 transition-all text-left space-y-4 relative overflow-hidden">
                    <div className={`w-12 h-12 bg-${item.color === 'brand' ? 'brand' : item.color}-50 rounded-xl flex items-center justify-center text-${item.color === 'brand' ? 'brand' : item.color}-600 group-hover:scale-110 transition-transform`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900">{item.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium">{item.desc}</p>
                    <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-${item.color === 'brand' ? 'brand-500' : item.color + '-500'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                  </div>
                ))}
              </div>

              {/* Tools showcase strip */}
              <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mb-5">10 Uzman Aracı — Hepsi Ücretsiz</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {[
                    { icon: FileCheck, label: 'Evrak Listesi', color: 'emerald' },
                    { icon: MessageSquare, label: 'Visa Copilot', color: 'blue' },
                    { icon: Zap, label: 'Senaryo', color: 'slate' },
                    { icon: Globe, label: 'Ülke Kıyasla', color: 'indigo' },
                    { icon: ShieldCheck, label: 'Sosyal Medya', color: 'violet' },
                    { icon: AlertTriangle, label: 'Ret Analizi', color: 'rose' },
                    { icon: Calendar, label: 'Randevu', color: 'teal' },
                    { icon: CheckCircle2, label: 'Belge Matrisi', color: 'slate' },
                    { icon: Plane, label: 'Vizesiz Ülkeler', color: 'emerald' },
                    { icon: Sparkles, label: 'AI Banka', color: 'blue' },
                  ].map(({ icon: Icon, label, color }) => (
                    <div key={label} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl bg-${color}-50 text-${color}-700 text-xs font-bold border border-${color}-100`}>
                      <Icon className="w-3.5 h-3.5" />
                      {label}
                    </div>
                  ))}
                </div>
              </div>
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

              <div className="p-8 md:p-12 bg-slate-900 rounded-[2.5rem] text-white flex flex-col lg:flex-row items-center justify-between gap-10 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/20 blur-[100px] rounded-full" />
                <div className="space-y-4 text-center lg:text-left z-10">
                  <div className="text-brand-400 text-xs font-bold uppercase tracking-[0.2em]">Tahmini Başarı İhtimali</div>
                  <div className="text-7xl md:text-8xl font-black text-white">%{currentScore}</div>
                  <p className="text-slate-400 text-sm max-w-xs mx-auto lg:mx-0 font-medium">
                    *Gelişmiş analiz için dashboard üzerinden detaylı kriterleri doldurun.
                  </p>
                </div>
                <button 
                  onClick={() => setStep('dashboard')}
                  className="btn-primary w-full lg:w-auto px-12 py-6 text-xl flex items-center justify-center gap-2 group"
                >
                  Dashboard'a Git <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
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
                    <h2 className="text-4xl font-black text-slate-900">Vize Yol Haritanız</h2>
                    <p className="text-slate-500 text-lg">Başvurunuzu mükemmelleştirmek için kişisel analiziniz.</p>
                  </div>
                </div>
                {/* Araçlar Paneli */}
                <div className="bg-white border border-slate-100 rounded-[2rem] p-5 shadow-sm">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Analiz Araçları</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    {[
                      { label: 'Evrak Listesi', icon: FileCheck, color: 'bg-emerald-500', fn: () => setIsDocumentListOpen(true) },
                      { label: 'Visa Copilot', icon: MessageSquare, color: 'bg-blue-500', fn: () => setIsCopilotOpen(true) },
                      { label: 'Senaryo', icon: Zap, color: 'bg-slate-900', fn: () => setIsCalculatorOpen(true) },
                      { label: 'Ülke Kıyasla', icon: Globe, color: 'bg-indigo-500', fn: () => setIsSchengenComparatorOpen(true) },
                      { label: 'Sosyal Medya', icon: ShieldCheck, color: 'bg-violet-500', fn: () => setIsSocialMediaOpen(true) },
                      { label: 'Ret Analizi', icon: AlertTriangle, color: 'bg-rose-500', fn: () => setIsRefusalOpen(true) },
                      { label: 'Randevu', icon: Calendar, color: 'bg-teal-500', fn: () => setIsAppointmentOpen(true) },
                      { label: 'Belge Matrisi', icon: CheckCircle2, color: 'bg-slate-600', fn: () => setIsConsistencyOpen(true) },
                      { label: 'Vizesiz Ülkeler', icon: Plane, color: 'bg-emerald-600', fn: () => setIsVisaFreeOpen(true) },
                      { label: 'AI Banka', icon: Sparkles, color: 'bg-blue-700', fn: () => setIsAiBankOpen(true) },
                    ].map(({ label, icon: Icon, color, fn }) => (
                      <button key={label} onClick={fn}
                        className={`${color} text-white rounded-xl px-3 py-2.5 font-bold text-xs flex items-center gap-1.5 hover:opacity-90 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5`}>
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{label}</span>
                      </button>
                    ))}
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
                          Mavi alan: VizeAsistan stratejik katkısı
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
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {ocrResults.map((res, i) => (
                            <div key={`ocr-res-${i}`} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 shrink-0">
                                <CheckCircle2 className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-900 truncate">{res.file}</p>
                                <p className="text-[10px] text-slate-500 uppercase font-bold">{res.status}</p>
                              </div>
                            </div>
                          ))}
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-10"
            >
              <div className="flex items-center gap-6">
                <button onClick={() => setStep('dashboard')} className="p-3 bg-white border border-slate-100 hover:bg-slate-50 rounded-2xl transition-all shadow-sm">
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                  <h2 className="text-4xl font-black text-slate-900">Niyet Mektubu Oluşturucu</h2>
                  <p className="text-slate-500 text-lg">Profesyonel ve ikna edici bir mektup için bilgilerinizi girin.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="p-10 bg-white rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
                  <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                      <PenTool className="w-5 h-5" />
                    </div>
                    Bilgilerinizi Girin
                  </h3>
                  <div className="grid grid-cols-1 gap-5">
                    {[
                      { id: 'fullName', label: 'Ad Soyad', type: 'text', placeholder: 'Örn: Emre Korn' },
                      { id: 'passportNumber', label: 'Pasaport No', type: 'text', placeholder: 'Örn: U12345678' },
                      { id: 'targetCountry', label: 'Hedef Ülke', type: 'text', placeholder: 'Örn: Almanya' },
                      { id: 'purpose', label: 'Seyahat Amacı', type: 'text', placeholder: 'Örn: Turistik Gezi' },
                      { id: 'startDate', label: 'Başlangıç Tarihi', type: 'date' },
                      { id: 'endDate', label: 'Bitiş Tarihi', type: 'date' },
                      { id: 'occupation', label: 'Meslek', type: 'text', placeholder: 'Örn: Yazılım Mühendisi' },
                      { id: 'monthlyIncome', label: 'Aylık Gelir (TL)', type: 'number', placeholder: 'Örn: 50000' },
                    ].map((field) => (
                      <div key={field.id} className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">{field.label}</label>
                        <input 
                          type={field.type}
                          placeholder={field.placeholder}
                          value={letterData[field.id as keyof LetterData]}
                          onChange={(e) => setLetterData({...letterData, [field.id]: e.target.value})}
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 font-medium"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="p-10 bg-slate-900 rounded-[3rem] text-white space-y-6 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl rounded-full" />
                    <h3 className="text-2xl font-bold relative z-10">Önizleme</h3>
                    <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] text-slate-300 text-sm leading-relaxed font-mono relative z-10">
                      <p className="mb-4 text-right">{new Date().toLocaleDateString('tr-TR')}</p>
                      <p className="mb-6 font-bold text-white">Sayın Konsolosluk Yetkilisi,</p>
                      <p>Ben {letterData.fullName || '...'}, {letterData.passportNumber || '...'} numaralı pasaport hamili olarak, {letterData.targetCountry || '...'} ülkesine {letterData.startDate || '...'} - {letterData.endDate || '...'} tarihleri arasında {letterData.purpose || '...'} amacıyla seyahat etmeyi planlıyorum...</p>
                    </div>
                    <button 
                      onClick={generatePDF}
                      className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-900/40 flex items-center justify-center gap-3 relative z-10"
                    >
                      PDF Olarak İndir <Download className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100 space-y-4">
                    <div className="flex items-center gap-3 text-blue-600">
                      <Info className="w-6 h-6" />
                      <h4 className="font-bold">Neden Önemli?</h4>
                    </div>
                    <p className="text-blue-800/70 text-sm leading-relaxed">
                      Niyet mektubu, vize memurunun sizinle kurduğu tek doğrudan iletişimdir. Profesyonel bir dille yazılmış, net ve tutarlı bir mektup kabul şansınızı %20'ye kadar artırabilir.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-6 py-12 border-top border-slate-200 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-sm">
          <div className="flex items-center gap-2 font-bold text-slate-600">
            <ShieldCheck className="w-5 h-5" />
            <span>VizeAsistan © 2026</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-600 transition-colors">Kullanım Koşulları</a>
            <a href="#" className="hover:text-slate-600 transition-colors">KVKK Aydınlatma Metni</a>
          </div>
        </div>
        <div className="p-6 bg-slate-50 rounded-2xl text-xs text-slate-400 leading-relaxed">
          <strong>Önemli Uyarı:</strong> VizeAsistan bir resmi kurum veya konsolosluk değildir. Sunulan başarı ihtimali ve tavsiyeler geçmiş verilere dayalı istatistiksel tahminlerdir. Vize kararı tamamen ilgili ülkenin konsolosluğuna aittir ve hiçbir şekilde garanti edilemez. Başvuru sahibi beyanlarından kendisi sorumludur.
        </div>
      </footer>
    </div>
  );
}
