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
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';

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

export default function App() {
  const [step, setStep] = useState<'hero' | 'assessment' | 'dashboard' | 'letter' | 'tactics'>('hero');
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isDocumentListOpen, setIsDocumentListOpen] = useState(false);
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
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
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h2 className="text-4xl font-black text-slate-900">Vize Yol Haritanız</h2>
                  <p className="text-slate-500 text-lg">Başvurunuzu mükemmelleştirmek için kişisel analiziniz.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => setIsDocumentListOpen(true)}
                    className="px-6 py-4 bg-emerald-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-200"
                  >
                    <FileCheck className="w-5 h-5" />
                    Evrak Listesi
                  </button>
                  <button 
                    onClick={() => setIsCopilotOpen(true)}
                    className="px-6 py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-500 transition-all shadow-lg shadow-blue-200"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Visa Copilot
                  </button>
                  <button 
                    onClick={() => setIsCalculatorOpen(true)}
                    className="px-6 py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                  >
                    <Zap className="w-5 h-5 text-amber-400" />
                    Senaryo Oluşturucu
                  </button>
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
