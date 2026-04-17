/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';
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
  Bell,
  ClipboardList
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import Footer from './components/Footer';
import { SEO } from './components/SEO';
import { apiUrl } from './lib/api';
import { HelpModal } from './components/modals/HelpModal';
import { CountryGuideModal } from './components/modals/CountryGuideModal';
import { DocChecklistModal } from './components/modals/DocChecklistModal';
import type { CountryWarning } from './lib/scoringV2';
import { RejectionRiskWidget } from './components/RejectionRiskWidget';

// ── Modüler İmportlar ────────────────────────────────────────────────────────
import type { ProfileData, Conflict, RoadmapItem, LetterData } from './types';
import { ukDocuments, ukPricing, refusalRules, consulateData, docMatrixFields } from './data/documents';
import type { RefusalRule, ConsulateInfo, DocField } from './data/documents';
import { visaFreeCountries, schengenCountries, multiCountryVisaData } from './data/countries';
import type { VisaFreeCountry, BankAnalysisResult, SchengenCountry } from './data/countries';
import {
  socialMediaChecklist, interviewQuestions, BANK_PLAN_PARAMS,
  PREMIUM_TOOLS, defaultCommunityEntries,
  COMMUNITY_STORAGE_KEY, PROFILE_STORAGE_KEY
} from './data/tools';
import type { SocialMediaItem, InterviewQ, CommunityEntry } from './data/tools';
import { SCHENGEN_REFUSAL_CODES, UK_REFUSAL_CODES, USA_REFUSAL_CODES, REJECTION_TAXONOMY } from './data/refusals';
import type { RefusalCode, UkRefusalCode, UsaRefusalCode, RejectionPattern } from './data/refusals';
import { TR_REJECTION_RATES, DIFFICULT_COUNTRIES } from './scoring/matrices';
import {
  KEY_FIELDS, calculateCompleteness, calculateConfidenceInterval,
  _assertMonotonicity
} from './scoring/algorithms';
import { calculateRawScore, calculateScore } from './scoring/core';
import { useCountryRates } from './hooks/useCountryRates';
import { WidgetBoundary } from './components/ErrorBoundary';
import { WhatIfSimulator } from './components/WhatIfSimulator';
import { ProfileRadarChart } from './components/ProfileRadarChart';
import { CountryRanking } from './components/CountryRanking';
import { EvidenceChecklist } from './components/EvidenceChecklist';
import { AssessmentStep } from './steps/AssessmentStep';
import { TacticsStep } from './steps/TacticsStep';
import { LetterStep } from './steps/LetterStep';
import { DashboardStep, type DashboardStepProps } from './steps/DashboardStep';
import { StepProgress } from './components/StepProgress';
import { AnalysisReportModal } from './components/AnalysisReportModal';
import { SocialProofBar } from './components/SocialProofBar';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // public/data/countries.json → TR_REJECTION_RATES override (deploy'suz güncelleme)
  useCountryRates();

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

  // TEST MODU: Tüm premium araçlar açık — ödeme entegrasyonu tamamlanınca false yapılacak
  const [isPremium, setIsPremium] = useState(true);

  // #18 Devam Et banneri — mount'ta bir kez kontrol et
  const hasSavedProfile = useMemo(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(PROFILE_STORAGE_KEY) || 'null');
      if (!saved) return false;
      return !!(saved.bankSufficientBalance || saved.hasSgkJob || saved.hasHighValueVisa ||
        saved.hasAssets || saved.isMarried || saved.cleanCriminalRecord ||
        (saved.applicantAge && saved.applicantAge !== 28 && saved.applicantAge > 0));
    } catch { return false; }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // mount-only
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [isAnalysisReportOpen, setIsAnalysisReportOpen] = useState(false);
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
  const [apptShowAvailableOnly, setApptShowAvailableOnly] = useState(false);

  // ── Feedback Loop — Başvuru Sonuç Takibi ──────────────────────────────────
  const [feedbackStep, setFeedbackStep] = useState<'register' | 'submit' | 'done'>('register');
  const [fbEmail, setFbEmail] = useState('');
  const [fbDate, setFbDate] = useState('');
  const [fbStatus, setFbStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [fbRegisteredId, setFbRegisteredId] = useState('');
  const [fbOutcome, setFbOutcome] = useState<'onay' | 'ret' | 'bekliyor' | ''>('');
  const [fbRejCode, setFbRejCode] = useState('');
  const [fbRejNotes, setFbRejNotes] = useState('');

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
  const [applicantType, setApplicantType] = useState<'employer' | 'unemployed' | 'minor' | 'sponsor'>('employer');
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

  // ── Belge Kontrol Listesi ───────────────────────────────────────────────────
  const [isDocChecklistOpen, setIsDocChecklistOpen] = useState(false);

  // ── Dashboard UI State ───────────────────────────────────────────────────────
  const [dashToolTab, setDashToolTab] = useState<'hazirlik' | 'analiz' | 'ulke'>('hazirlik');
  const [showRiskDetail, setShowRiskDetail] = useState(false);

  // ── Yardım Sayfası ──────────────────────────────────────────────────────────
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // ── Randevu Merkezi Tipi ──────────────────────────────────────────────────
  interface AppointmentTarget {
    id: string;
    country: string;
    city: string;
    visaType: string;
    avgWaitDays: number;
    flag: string;
    status: 'müsait' | 'dolu';
    vfsUrl: string;
    centerType: 'VFS' | 'TLS' | 'Konsolosluk';
    lastChecked: string;             // ISO date — son manuel güncelleme
    trend: 'artıyor' | 'azalıyor' | 'stabil';  // Bekleme süresi trendi
    notes?: string;                  // Özel uyarı (opsiyonel)
  }
  type ApptTarget = AppointmentTarget;

  // ── Randevu Takip Veritabanı v2 (Nisan 2026) ─────────────────────────────
  // 27 merkez / 14 ülke / 3 şehir
  // Son güncelleme: 2026-04-16
  // Notlar:
  //  - Tüm süreler tahminidir, mevsim/yoğunluğa göre değişir
  //  - VFS = VFS Global, TLS = TLScontact, Konsolosluk = doğrudan elçilik
  //  - lastChecked → manuel kontrol tarihi; ileride API ile gerçek zamanlı olacak
  const APPOINTMENT_TARGETS: AppointmentTarget[] = [
    // ── Almanya ──────────────────────────────────────────────────────────────
    { id:'de-ist', country:'Almanya',    city:'İstanbul', visaType:'Schengen (C)', avgWaitDays:45,  flag:'🇩🇪', status:'dolu',    vfsUrl:'https://visa.vfsglobal.com/tur/tr/deu', centerType:'VFS',          lastChecked:'2026-04-16', trend:'artıyor',  notes:'Yaz sezonu öncesi yoğunluk — erken başvurun' },
    { id:'de-ank', country:'Almanya',    city:'Ankara',   visaType:'Schengen (C)', avgWaitDays:28,  flag:'🇩🇪', status:'müsait',  vfsUrl:'https://visa.vfsglobal.com/tur/tr/deu', centerType:'VFS',          lastChecked:'2026-04-16', trend:'stabil' },
    { id:'de-izm', country:'Almanya',    city:'İzmir',    visaType:'Schengen (C)', avgWaitDays:22,  flag:'🇩🇪', status:'müsait',  vfsUrl:'https://visa.vfsglobal.com/tur/tr/deu', centerType:'VFS',          lastChecked:'2026-04-16', trend:'azalıyor', notes:'İzmir merkezi görece sakin' },
    // ── Fransa ───────────────────────────────────────────────────────────────
    { id:'fr-ist', country:'Fransa',     city:'İstanbul', visaType:'Schengen (C)', avgWaitDays:21,  flag:'🇫🇷', status:'dolu',    vfsUrl:'https://fr.tlscontact.com/visa/TR/TRist2Paris', centerType:'TLS', lastChecked:'2026-04-16', trend:'stabil' },
    { id:'fr-ank', country:'Fransa',     city:'Ankara',   visaType:'Schengen (C)', avgWaitDays:14,  flag:'🇫🇷', status:'müsait',  vfsUrl:'https://fr.tlscontact.com/visa/TR/TRank2Paris', centerType:'TLS', lastChecked:'2026-04-16', trend:'azalıyor' },
    // ── İtalya ───────────────────────────────────────────────────────────────
    { id:'it-ist', country:'İtalya',     city:'İstanbul', visaType:'Schengen (C)', avgWaitDays:10,  flag:'🇮🇹', status:'müsait',  vfsUrl:'https://visa.vfsglobal.com/tur/tr/ita', centerType:'VFS',          lastChecked:'2026-04-16', trend:'stabil' },
    { id:'it-ank', country:'İtalya',     city:'Ankara',   visaType:'Schengen (C)', avgWaitDays:7,   flag:'🇮🇹', status:'müsait',  vfsUrl:'https://visa.vfsglobal.com/tur/tr/ita', centerType:'VFS',          lastChecked:'2026-04-16', trend:'azalıyor' },
    // ── İspanya ──────────────────────────────────────────────────────────────
    { id:'es-ist', country:'İspanya',    city:'İstanbul', visaType:'Schengen (C)', avgWaitDays:8,   flag:'🇪🇸', status:'müsait',  vfsUrl:'https://visa.vfsglobal.com/tur/tr/esp', centerType:'VFS',          lastChecked:'2026-04-16', trend:'stabil' },
    { id:'es-ank', country:'İspanya',    city:'Ankara',   visaType:'Schengen (C)', avgWaitDays:5,   flag:'🇪🇸', status:'müsait',  vfsUrl:'https://visa.vfsglobal.com/tur/tr/esp', centerType:'VFS',          lastChecked:'2026-04-16', trend:'azalıyor' },
    // ── Yunanistan ───────────────────────────────────────────────────────────
    { id:'gr-ist', country:'Yunanistan', city:'İstanbul', visaType:'Schengen (C)', avgWaitDays:5,   flag:'🇬🇷', status:'müsait',  vfsUrl:'https://visa.vfsglobal.com/tur/tr/grc', centerType:'VFS',          lastChecked:'2026-04-16', trend:'stabil' },
    { id:'gr-ank', country:'Yunanistan', city:'Ankara',   visaType:'Schengen (C)', avgWaitDays:4,   flag:'🇬🇷', status:'müsait',  vfsUrl:'https://visa.vfsglobal.com/tur/tr/grc', centerType:'VFS',          lastChecked:'2026-04-16', trend:'stabil' },
    // ── Portekiz ─────────────────────────────────────────────────────────────
    { id:'pt-ist', country:'Portekiz',   city:'İstanbul', visaType:'Schengen (C)', avgWaitDays:12,  flag:'🇵🇹', status:'müsait',  vfsUrl:'https://visa.vfsglobal.com/tur/tr/prt', centerType:'VFS',          lastChecked:'2026-04-16', trend:'azalıyor' },
    // ── Hollanda ─────────────────────────────────────────────────────────────
    { id:'nl-ist', country:'Hollanda',   city:'İstanbul', visaType:'Schengen (C)', avgWaitDays:14,  flag:'🇳🇱', status:'müsait',  vfsUrl:'https://visa.vfsglobal.com/tur/tr/nld', centerType:'VFS',          lastChecked:'2026-04-16', trend:'stabil' },
    // ── Belçika ──────────────────────────────────────────────────────────────
    { id:'be-ist', country:'Belçika',    city:'İstanbul', visaType:'Schengen (C)', avgWaitDays:15,  flag:'🇧🇪', status:'dolu',    vfsUrl:'https://visa.vfsglobal.com/tur/tr/bel', centerType:'VFS',          lastChecked:'2026-04-16', trend:'stabil' },
    // ── Avusturya ────────────────────────────────────────────────────────────
    { id:'at-ist', country:'Avusturya',  city:'İstanbul', visaType:'Schengen (C)', avgWaitDays:20,  flag:'🇦🇹', status:'dolu',    vfsUrl:'https://visa.vfsglobal.com/tur/tr/aut', centerType:'VFS',          lastChecked:'2026-04-16', trend:'artıyor' },
    { id:'at-ank', country:'Avusturya',  city:'Ankara',   visaType:'Schengen (C)', avgWaitDays:12,  flag:'🇦🇹', status:'müsait',  vfsUrl:'https://visa.vfsglobal.com/tur/tr/aut', centerType:'VFS',          lastChecked:'2026-04-16', trend:'stabil' },
    // ── Polonya ──────────────────────────────────────────────────────────────
    { id:'pl-ist', country:'Polonya',    city:'İstanbul', visaType:'Schengen (C)', avgWaitDays:9,   flag:'🇵🇱', status:'müsait',  vfsUrl:'https://visa.vfsglobal.com/tur/tr/pol', centerType:'VFS',          lastChecked:'2026-04-16', trend:'stabil' },
    // ── Macaristan ───────────────────────────────────────────────────────────
    { id:'hu-ist', country:'Macaristan', city:'İstanbul', visaType:'Schengen (C)', avgWaitDays:7,   flag:'🇭🇺', status:'müsait',  vfsUrl:'https://visa.vfsglobal.com/tur/tr/hun', centerType:'VFS',          lastChecked:'2026-04-16', trend:'stabil' },
    // ── Danimarka ────────────────────────────────────────────────────────────
    { id:'dk-ist', country:'Danimarka',  city:'İstanbul', visaType:'Schengen (C)', avgWaitDays:42,  flag:'🇩🇰', status:'dolu',    vfsUrl:'https://visa.vfsglobal.com/tur/tr/dnk', centerType:'VFS',          lastChecked:'2026-04-16', trend:'artıyor',  notes:'%66 ret oranı — başvuru öncesi detaylı hazırlık şart' },
    // ── İsveç ────────────────────────────────────────────────────────────────
    { id:'se-ist', country:'İsveç',      city:'İstanbul', visaType:'Schengen (C)', avgWaitDays:35,  flag:'🇸🇪', status:'dolu',    vfsUrl:'https://visa.vfsglobal.com/tur/tr/swe', centerType:'VFS',          lastChecked:'2026-04-16', trend:'artıyor' },
    // ── Norveç ───────────────────────────────────────────────────────────────
    { id:'no-ist', country:'Norveç',     city:'İstanbul', visaType:'Schengen (C)', avgWaitDays:28,  flag:'🇳🇴', status:'dolu',    vfsUrl:'https://visa.vfsglobal.com/tur/tr/nor', centerType:'VFS',          lastChecked:'2026-04-16', trend:'artıyor' },
    // ── İsviçre ──────────────────────────────────────────────────────────────
    { id:'ch-ist', country:'İsviçre',    city:'İstanbul', visaType:'Schengen (C)', avgWaitDays:18,  flag:'🇨🇭', status:'dolu',    vfsUrl:'https://fr.tlscontact.com/visa/TR/TRist2Bern', centerType:'TLS', lastChecked:'2026-04-16', trend:'stabil' },
    // ── İngiltere ────────────────────────────────────────────────────────────
    { id:'gb-ist', country:'İngiltere',  city:'İstanbul', visaType:'UK Visitor',   avgWaitDays:18,  flag:'🇬🇧', status:'dolu',    vfsUrl:'https://visa.vfsglobal.com/tur/tr/gbr', centerType:'VFS',          lastChecked:'2026-04-16', trend:'stabil' },
    { id:'gb-ank', country:'İngiltere',  city:'Ankara',   visaType:'UK Visitor',   avgWaitDays:12,  flag:'🇬🇧', status:'müsait',  vfsUrl:'https://visa.vfsglobal.com/tur/tr/gbr', centerType:'VFS',          lastChecked:'2026-04-16', trend:'azalıyor' },
    // ── ABD ──────────────────────────────────────────────────────────────────
    { id:'us-ist', country:'ABD',        city:'İstanbul', visaType:'B1/B2 Turist', avgWaitDays:188, flag:'🇺🇸', status:'dolu',    vfsUrl:'https://ais.usvisa-info.com/tr-tr/niv', centerType:'Konsolosluk',  lastChecked:'2026-04-16', trend:'artıyor',  notes:'Sezon yoğunluğu — en az 6 ay öncesinden başvurun' },
    { id:'us-ank', country:'ABD',        city:'Ankara',   visaType:'B1/B2 Turist', avgWaitDays:150, flag:'🇺🇸', status:'dolu',    vfsUrl:'https://ais.usvisa-info.com/tr-tr/niv', centerType:'Konsolosluk',  lastChecked:'2026-04-16', trend:'stabil',   notes:'Ankara bazen daha erken randevu bulunabiliyor' },
    // ── Kanada ───────────────────────────────────────────────────────────────
    { id:'ca-ist', country:'Kanada',     city:'İstanbul', visaType:'Visitor (B)',  avgWaitDays:90,  flag:'🇨🇦', status:'dolu',    vfsUrl:'https://visa.vfsglobal.com/tur/tr/can', centerType:'VFS',          lastChecked:'2026-04-16', trend:'artıyor',  notes:'Biyometrik kayıt zorunlu — ek ücret ve süre hesaplayın' },
  ];

  const handleApptSubscribe = async () => {
    if (!apptSubEmail || !apptSubEmail.includes('@') || apptSelected.length === 0) return;
    setApptSubStatus('loading');
    try {
      const res = await fetch(apiUrl('/api/appointments/subscribe'), {
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
  const [communityForm, setCommunityForm] = useState<{consulate:string;city:string;visaType:string;result:'onaylandi'|'reddedildi'|'ek_evrak';waitDays:string;notes:string;profile:string}>({ consulate:'', city:'İstanbul', visaType:'Turizm (Schengen)', result:'onaylandi', waitDays:'', notes:'', profile:'Çalışan' });
  const [communityEntries, setCommunityEntries] = useState<CommunityEntry[]>(() => {
    try {
      const stored = localStorage.getItem(COMMUNITY_STORAGE_KEY);
      return stored ? [...defaultCommunityEntries, ...JSON.parse(stored)] : defaultCommunityEntries;
    } catch { return defaultCommunityEntries; }
  });
  
  const DEFAULT_PROFILE: ProfileData = {
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
    yearsInCurrentJob: 3,
    sgkAddressMatchesDs160: true,
    hasHighValueVisa: false,
    hasOtherVisa: false,
    travelHistoryNonVisa: false,
    noOverstayHistory: true,
    hasSocialMediaFootprint: false,
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
    cleanCriminalRecord: false,
    hasBarcodeSgk: false,
    hasTravelInsurance: false,
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
    targetCountry: 'Almanya',
    persona: 'Analiz Ediliyor...',
    readinessStatus: 'wait',
    documentStrengths: { financial: 0, professional: 0, history: 0, trust: 0 },
    timelineAdvice: 'Profilinizi tamamlayın.',
    strategyRoute: [],
    bankBalance: '',
    monthlyIncome: '',
    lastVisaYear: 0,
    lastRejectionYear: 0,
    applicantAge: 28,
  };

  const [profile, setProfile] = useState<ProfileData>(() => {
    try {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Eski sürüm uyumluluğu: eksik alanları DEFAULT ile tamamla
        return { ...DEFAULT_PROFILE, ...parsed };
      }
    } catch { /* bozuk veri — varsayılan kullan */ }
    return DEFAULT_PROFILE;
  });

  // ── Profil otomatik kaydet ────────────────────────────────────────────────
  useEffect(() => {
    try { localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile)); } catch { /* noop */ }
  }, [profile]);

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

  const currentScore = useMemo(() => calculateScore(profile, simulatorValue), [profile, simulatorValue]);

  // rawScore ayrı memo: countryWarning ve currentScore her ikisi de
  // calculateRawScore çağırırdı — tek seferlik hesaplamayla paylaşılır
  const rawScore = useMemo(() => calculateRawScore(profile, simulatorValue), [profile, simulatorValue]);

  // ── #6 Güven Aralığı — completeness'a göre skor aralığı ─────────────────
  const currentConfidence = useMemo(() => {
    const completeness = calculateCompleteness(profile);
    return calculateConfidenceInterval(currentScore, completeness);
  }, [profile, currentScore]);

  // ── Dinamik ülke uyarısı: tüm ülkeleri rawScore üzerinden puanla ─────────
  const countryWarning = useMemo<CountryWarning>(() => {
    if (!DIFFICULT_COUNTRIES.has(profile.targetCountry)) {
      return { show: false, level: 'info', message: '', alternatives: [] };
    }

    // Ham profil skoru — rawScore memo'dan gelir, yeniden hesaplanmaz
    const raw = rawScore;

    // Tüm non-difficult ülkeleri dinamik olarak puanla
    const alternatives = Object.entries(TR_REJECTION_RATES)
      .filter(([name]) => !DIFFICULT_COUNTRIES.has(name))
      .map(([name, rejRate]) => {
        const blended = Math.round(((raw / 100) * 0.65 + (1 - rejRate) * 0.35) * 100);
        return { code: name, name, approvalEstimate: Math.min(99, blended) };
      })
      .sort((a, b) => b.approvalEstimate - a.approvalEstimate)
      .slice(0, 3);

    const messages: Record<string, string> = {
      'Almanya':   'Almanya, Türk başvurucular için ~%23 ret oranıyla en zorlu Schengen ülkelerinden biridir (2024). İstanbul %21.5, Ankara %27.1. En sık ret: seyahat amacı belirsizliği ve son dakika mevduat.',
      'Fransa':    'Fransa, TLScontact süreci ve sıkı amaç belgesi gereklilikleriyle Türkler için ~%21 ret oranına sahip.',
      'İngiltere': 'İngiltere, 28-gün bakiye kuralı ve 6-aylık döküm zorunluluğuyla Türkler için ~%30 ret oranında. Schengen\'den tamamen farklı kurallar geçerli.',
      'ABD':       'ABD, 188 günlük randevu bekleme süresi ve mülakat zorunluluğuyla süreç çok uzun. Güçlü Türkiye bağı kanıtı şart.',
      'İsveç':     'İsveç, seyahat geçmişi olmayan Türkler için %22 ret oranıyla riskli.',
      'Norveç':    'Norveç, Türkler için %20 ret oranıyla zor bir Schengen ülkesidir.',
      'Danimarka': 'Danimarka, Türk başvurucular için ~%66 ret oranıyla Schengen\'in en zor ülkesidir.',
    };

    const isDanger = profile.targetCountry === 'Danimarka' || profile.targetCountry === 'ABD';
    return {
      show: true,
      level: isDanger ? 'danger' : 'warning',
      message: messages[profile.targetCountry] ?? `${profile.targetCountry}, Türk başvurucular için yüksek ret oranıyla zorlu bir ülkedir.`,
      alternatives,
    };
  // rawScore zaten profile+simulatorValue'dan türetiyor; targetCountry ise
  // DIFFICULT_COUNTRIES ve mesaj seçimi için gerekli
  }, [rawScore, profile.targetCountry]);

  // ── Ret Taksonomisi: Profile uyan kalıpları tespit et ────────────────────
  const rejectionMatches = useMemo(() => {
    const countryKind = profile.targetCountry === 'İngiltere' ? 'uk'
                      : profile.targetCountry === 'ABD'       ? 'usa'
                      : 'schengen';
    return REJECTION_TAXONOMY.filter(p => {
      if (p.country !== 'all' && p.country !== countryKind) return false;
      return p.trigger(profile);
    });
  }, [profile]);

  // ── Schengen Profil Bazlı Ülke Eşleşme Algoritması ──────────────
  // useCallback: sadece ilgili profil alanları veya currentScore değişince yeniden oluşturulur
  const computeCountryMatchScore = useCallback((country: SchengenCountry): number => {
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
  }, [currentScore, profile.bankRegularity, profile.bankSufficientBalance,
      profile.hasSgkJob, profile.hasHighValueVisa, profile.hasOtherVisa,
      aiBankBalance, aiBankIncome, profile.bankBalance, profile.monthlyIncome]);

  // Tüm ülkeler bir kez sıralanır — JSX'te iki yerde tekrar hesaplanmaz
  const rankedCountries = useMemo(() =>
    [...schengenCountries]
      .map(c => ({ ...c, matchScore: computeCountryMatchScore(c) }))
      .sort((a, b) => b.matchScore - a.matchScore),
  [schengenCountries, computeCountryMatchScore]);


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
      persona = "Güçlü Vize Geçmişi: Altın Referans";
      personaDestiny = "Önceki ABD/İngiltere/Schengen vizeniz en güçlü referansınız. Konsolosluk, vize geçmişi temiz profilleri öncelikli inceler ve onay oranı belirgin biçimde yüksektir.";
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
    let readiness: 'apply' | 'moderate' | 'risky' | 'wait' = 'wait';
    const hardBlocks = profile.hasSuspiciousLargeDeposit ||
                       (!profile.previousRefusalDisclosed && profile.hasPreviousRefusal) ||
                       !profile.noOverstayHistory ||
                       !profile.noFakeBooking;

    if (currentScore >= 82 && !hardBlocks) readiness = 'apply';
    else if (currentScore >= 72 && !hardBlocks) readiness = 'moderate';
    else if (currentScore >= 60 && !hardBlocks) readiness = 'risky';
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
    const filled = Object.entries(docValues).filter(([, v]) => String(v).trim() !== '');
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

  // ── Profil Sıfırlama ─────────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    try { localStorage.removeItem(PROFILE_STORAGE_KEY); } catch { /* noop */ }
    setProfile(DEFAULT_PROFILE);
    setStep('onboarding');
  }, []); // DEFAULT_PROFILE is a module-level constant value, safe as empty dep

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

  // ── Belge Kontrol Listesi PDF ─────────────────────────────────────────────
  const generateDocumentChecklistPDF = () => {
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString('tr-TR');
    const country = profile.targetCountry || 'Schengen';
    const isUK = country === 'İngiltere';
    const isUSA = country === 'ABD';

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
    doc.setFont('helvetica', 'bold');
    doc.text(normalizeTr(`${country} Vize Basvurusu — Kisisel Belge Kontrol Listesi`), 14, 30);
    doc.setDrawColor(229, 231, 235);
    doc.line(14, 33, 196, 33);

    let y = 42;

    const addSection = (title: string) => {
      if (y > 260) { doc.addPage(); y = 20; }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(37, 99, 235);
      doc.text(normalizeTr(title), 14, y);
      y += 5;
      doc.setDrawColor(219, 234, 254);
      doc.line(14, y, 196, y);
      y += 6;
    };

    const addItem = (text: string, note?: string) => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      doc.setDrawColor(100, 116, 139);
      doc.rect(14, y - 3.5, 4, 4);
      const lines = doc.splitTextToSize(normalizeTr(text), 165);
      doc.text(lines, 21, y);
      y += lines.length * 5;
      if (note) {
        doc.setTextColor(148, 163, 184);
        doc.setFontSize(7.5);
        const noteLines = doc.splitTextToSize(normalizeTr('  Not: ' + note), 165);
        doc.text(noteLines, 21, y);
        y += noteLines.length * 4 + 1;
        doc.setTextColor(51, 65, 85);
        doc.setFontSize(9);
      }
      y += 1.5;
    };

    // 1. Zorunlu Belgeler
    addSection('1. Zorunlu Belgeler (Tum Basvurucular)');
    addItem('Gecerli pasaport (son 10 yilda alinmis, en az 2 bos sayfa)');
    addItem('Onceki pasaportlar — vizeli/damgali sayfalar ile birlikte');
    addItem('Vize basvuru formu (eksiksiz doldurulmus ve imzalanmis)');
    addItem('Biyometrik fotograf (6 aydan yeni, 35x45mm, beyaz arka fon)');
    addItem('Nufus cuzdani fotokopisi (on ve arka yuz)');
    addItem('Tam tekmil vukuatli nufus kayit ornegi (e-Devletten barkodlu)');
    addItem('Yerlesim yeri belgesi (e-Devletten barkodlu)');
    addItem('Tarihceli yerlesim yeri belgesi (e-Devletten barkodlu)');
    addItem('e-Devletten yurda giris-cikis belgesi (01.01.2009\'dan buguye)');
    addItem('Ucak rezervasyonu — gidis ve donus (iptal edilebilir olmasi tercih edilir)');
    addItem('Otel / konaklama rezervasyonu veya ev sahibi davet mektubu');
    addItem('Detayli seyahat plani (itinerary) — gunluk aktiviteler ve ziyaret yerleri');
    if (!isUSA) {
      addItem('Seyahat saglik sigortasi (min 30.000 EUR teminath, Schengen Bolgesi kapsami)', 'Schengen icin zorunlu — AXA, Allianz veya Europ Assistance onerilen firmalar');
    }
    y += 3;

    // 2. Finansal Belgeler
    addSection('2. Finansal Belgeler');
    if (isUK) {
      addItem('Son 6 aylik banka hesap dokumu (banka kaseli ve imzali)', '28 gun kurali: paranin en az 28 gun hesapta kalmis olmasi gerekir');
    } else {
      addItem('Son 3 aylik banka hesap dokumu (banka kaseli ve imzali)', 'Schengen icin gunluk min. 100-120 EUR gosterilebilmeli; 10 gunluk trip ~ 55-60K TL');
    }
    if (profile.hasSteadyIncome || profile.salaryDetected) {
      addItem('Son 3 aylik maas bordrosu');
    }
    if (profile.hasAssets) {
      addItem('Tapu fotokopisi ve/veya arac ruhsati fotokopisi');
    }
    y += 3;

    // 3. Mesleki / Ogrenci Belgeler
    if (profile.hasSgkJob || profile.isPublicSectorEmployee) {
      addSection('3. Mesleki Belgeler');
      addItem('SGK hizmet dokumu (e-Devletten barkodlu)');
      if (profile.isPublicSectorEmployee) {
        addItem('Kamu kurumu gorev belgesi (imzali ve kaseli)');
        addItem('Kamu kurumu izin onay belgesi (geri donus tarihi yazili)');
      } else {
        addItem('Isveren izin ve gorev yazisi (kesin geri donus tarihi ve kaseli-imzali)', 'Sadece "izin verilmistir" yetmez; geri donus taahhudunu icermeli');
        addItem('Isyerine ait vergi levhasi fotokopisi (guncel)');
        addItem('Ticaret Odasi kayit sureti (6 aydan eski olmamali)');
      }
      y += 3;
    } else if (profile.isStudent) {
      addSection('3. Ogrenci Belgeleri');
      addItem('Ogrenci belgesi (guncel tarihli, tercihen Ingilizce veya Almanca)');
      addItem('Not dokumu / Transkript');
      addItem('Burs belgesi veya veliye ait finansal sponsorluk belgesi');
      y += 3;
    }

    // 4. Aile ve Bag Belgeleri
    if (profile.isMarried || profile.hasChildren || profile.strongFamilyTies) {
      addSection('4. Aile ve Memleket Bag Belgeleri');
      if (profile.isMarried) {
        addItem('Evlilik cuzdani fotokopisi');
        addItem('Formul B — evlilik kayit belgesi (e-Devletten)');
      }
      if (profile.hasChildren) {
        addItem('Cocuklarin nufus cuzdani fotokopisi');
        addItem('Formul A — dogum belgesi (e-Devletten)');
      }
      y += 3;
    }

    // 5. Ulkeye Ozel
    if (isUSA) {
      addSection('5. ABD Ozel Belgeler (B1/B2 Turistik Vize)');
      addItem('DS-160 formu (online doldurulmus, barkod sayfasi basilmis)');
      addItem('Mulakat randevu onay e-postasi veya ekran goruntüsü');
      addItem('Mulakata hazirlik: "Turkiye\'deki guclu baglar" belgesi paketi');
      addItem('SGK + tapu + is belgesi + aile belgesi — hepsini birlikte sunun');
    } else if (isUK) {
      addSection('5. Ingiltere Ozel Belgeler (Standard Visitor)');
      addItem('Online UK vize basvuru teyidi (IHS ucreti odeme makbuzu)');
      addItem('28 gun boyunca sabit kalan banka bakiye kaniti (ekstreden acikca gorulmeli)');
      addItem('Varsa Schengen vize gecmisi — eski pasaport sayfasi fotokopisi', 'Schengen gecmisi olmadan UK basvurusu risklidir');
    } else {
      addSection('5. Schengen Ozel Belgeler');
      if (profile.hasPreviousRefusal) {
        addItem('Onceki ret mektubu fotokopisi — MUTLAKA beyan edilmeli', 'Gizlemek kara listeye alinmaniza yol acabilir');
      }
      if (profile.hasHighValueVisa || profile.hasOtherVisa) {
        addItem('Onceki vize ve yurt disi seyahat kaniti (pul/vize sayfasi fotokopisi)');
      }
      addItem('Konsolosluga hitaben niyet mektubu (amac, tarihler, masraf karsilama)');
    }
    y += 3;

    // Uyari kutusu
    if (y > 245) { doc.addPage(); y = 20; }
    doc.setFillColor(254, 243, 199);
    doc.setDrawColor(251, 191, 36);
    doc.roundedRect(14, y, 182, 22, 2, 2, 'FD');
    doc.setTextColor(146, 64, 14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(normalizeTr('ONEMLI: Bu liste profilinize gore otomatik olusturulmustur.'), 18, y + 8);
    doc.setFont('helvetica', 'normal');
    doc.text(normalizeTr('Konsolosluk ek belge isteyebilir. Nihai kontrol icin resmi konsolosluk sitesini ziyaret edin.'), 18, y + 15);

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFillColor(248, 250, 252);
    doc.rect(0, pageHeight - 12, 210, 12, 'F');
    doc.setTextColor(148, 163, 184);
    doc.setFontSize(7);
    doc.text('Bu liste VizeAkil (vizeakil.com) tarafindan profilinize gore olusturulmustur. Resmi vize danismanliginin yerini tutmaz.', 14, pageHeight - 4);

    doc.save(`VizeAkil_Belge_Kontrol_Listesi_${normalizeTr(country)}_${today.replace(/\//g, '-')}.pdf`);
  };

  // ── Kişiye Özel Sihirbaz Evrak Listesi PDF ────────────────────────────────
  const generateWizardDocListPDF = () => {
    if (wizardResult.length === 0) return;
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString('tr-TR');
    const countryLabel = wizardCountry === 'schengen' ? 'Schengen' : wizardCountry === 'uk' ? 'Ingiltere' : 'ABD';
    const employmentLabel = wizardEmployment === 'employee' ? 'Calisan'
                          : wizardEmployment === 'freelance' ? 'Serbest Meslek'
                          : wizardEmployment === 'student' ? 'Ogrenci'
                          : wizardEmployment === 'retired' ? 'Emekli'
                          : 'Issiz';

    // Header
    doc.setFillColor(5, 150, 105);
    doc.rect(0, 0, 210, 18, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('VizeAkil — Kisiye Ozel Evrak Listesi', 14, 12);
    doc.text(today, 196, 12, { align: 'right' });

    // Title
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(normalizeTr(`${countryLabel} Vizesi — ${employmentLabel} Profili`), 14, 30);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(normalizeTr(`${wizardResult.length} belge — profilinize ozel hazirlandi`), 14, 36);
    doc.setDrawColor(229, 231, 235);
    doc.line(14, 40, 196, 40);

    let y = 48;
    wizardResult.forEach((item) => {
      if (y > 270) { doc.addPage(); y = 20; }
      const isWarning = item.startsWith('⚠️') || item.startsWith('UYARI');
      const cleanText = item.replace(/^⚠️ /, '');
      if (isWarning) {
        doc.setFillColor(254, 243, 199);
        doc.setDrawColor(245, 158, 11);
        const lines = doc.splitTextToSize(normalizeTr(cleanText), 180);
        const h = lines.length * 5 + 4;
        doc.roundedRect(14, y - 4, 182, h, 1.5, 1.5, 'FD');
        doc.setTextColor(146, 64, 14);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.text(lines, 18, y);
        y += h + 2;
        doc.setFont('helvetica', 'normal');
      } else {
        doc.setDrawColor(100, 116, 139);
        doc.rect(14, y - 3.5, 4, 4);
        doc.setTextColor(51, 65, 85);
        doc.setFontSize(9);
        const lines = doc.splitTextToSize(normalizeTr(cleanText), 170);
        doc.text(lines, 21, y);
        y += lines.length * 5 + 2;
      }
    });

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFillColor(248, 250, 252);
    doc.rect(0, pageHeight - 12, 210, 12, 'F');
    doc.setTextColor(148, 163, 184);
    doc.setFontSize(7);
    doc.text('Bu liste VizeAkil (vizeakil.com) tarafindan profilinize gore olusturulmustur. Resmi vize danismanliginin yerini tutmaz.', 14, pageHeight - 4);

    doc.save(`VizeAkil_Kisiye_Ozel_Evrak_Listesi_${normalizeTr(countryLabel)}_${today.replace(/\//g, '-')}.pdf`);
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
    return () => {
      document.body.classList.remove('use-custom-cursor');
    };
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

  // Route bazlı SEO meta
  const seoMeta = useMemo(() => {
    const country = profile.targetCountry || 'Schengen';
    switch (step) {
      case 'hero':
        return {
          title: 'VizeAkıl — AI Destekli Vize Başvuru Analizi',
          description: 'Schengen, UK ve ABD vize başvurularında yapay zeka ile risk analizi. Banka dökümü, ret mektubu, randevu takibi ve 18+ araç. 2 dakikada ücretsiz profil skoru.',
          canonical: '/',
        };
      case 'onboarding':
        return {
          title: 'Vize Profilinizi Oluşturun | VizeAkıl',
          description: 'Ülke ve başvuru tipinizi seçin, kişiselleştirilmiş vize analizi için profilinizi başlatın.',
          canonical: '/basla',
          noIndex: true,
        };
      case 'assessment':
        return {
          title: 'Profil Analizi | VizeAkıl',
          description: `${country} vize başvurusu için profil risk analiziniz hazırlanıyor.`,
          canonical: '/sonuc',
          noIndex: true,
        };
      case 'dashboard':
        return {
          title: `${country} Vize Skor Paneliniz | VizeAkıl`,
          description: `${country} başvurusunda kişisel onay tahmininiz, risk faktörleriniz ve aksiyon önerileriniz.`,
          canonical: '/panel',
          noIndex: true,
        };
      case 'letter':
        return {
          title: 'Niyet Mektubu Oluşturucu | VizeAkıl',
          description: 'Profesyonel vize niyet mektubu oluşturun — Türkçe ve İngilizce PDF formatında indirin.',
          canonical: '/mektup',
          noIndex: true,
        };
      case 'tactics':
        return {
          title: 'Vize Taktikleri & Yol Haritası | VizeAkıl',
          description: `${country} vize başvurusunda başarı şansınızı artıracak kişisel taktik önerileri.`,
          canonical: '/taktikler',
          noIndex: true,
        };
      default:
        return {
          title: 'VizeAkıl — AI Destekli Vize Analizi',
          description: 'Vize başvurunuzu yapay zeka ile analiz edin.',
          canonical: '/',
        };
    }
  }, [step, profile.targetCountry]);

  return (
    <>
    <SEO
      title={seoMeta.title}
      description={seoMeta.description}
      canonical={seoMeta.canonical}
      noIndex={(seoMeta as { noIndex?: boolean }).noIndex}
    />
    {/* Custom Cursor */}
    <div id="vize-cursor" aria-hidden="true">
      <div className="cursor-ring"/>
      <div className="cursor-dot"/>
    </div>
    <div className="min-h-screen bg-[#fafbfe] text-slate-800 font-sans selection:bg-brand-100 selection:text-brand-900">
      {/* Navigation — hero modunda gizle */}
      {step !== 'hero' && (
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-slate-100/80 px-4 sm:px-6 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-3">
          <div
            onClick={() => setStep('hero')}
            className="flex items-center gap-2.5 font-display font-bold text-xl text-slate-900 cursor-pointer hover:text-brand-600 transition-colors min-w-0"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center shadow-md shadow-brand-500/15 shrink-0">
              <ShieldCheck className="w-5 h-5 text-white" />
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
              onClick={() => setIsHelpOpen(true)}
              title="Yardım & Araç Rehberi"
              className="p-2 sm:p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <Info className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
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
      )}

      {/* Funnel adım göstergesi */}
      <StepProgress currentStep={step} onNavigate={setStep} />

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
                <div className="bg-gradient-to-br from-brand-500 to-brand-600 p-7 text-white text-center shrink-0">
                  <button onClick={() => setIsUpgradeOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                  <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="w-7 h-7 text-amber-200" />
                  </div>
                  <h3 className="text-2xl font-bold">VizeAkıl — Plan Seç</h3>
                  <p className="text-white/70 text-sm mt-1">İhtiyacına göre ödeme yap. Sürpriz maliyet yok.</p>
                </div>
                {/* Planlar */}
                <div className="p-6 overflow-y-auto flex-1 space-y-4">
                  {/* Ücretsiz */}
                  <div className="border-2 border-slate-200 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-bold text-slate-900 text-base">Ücretsiz</div>
                        <div className="text-xs text-slate-500 mt-0.5">Hemen başla, kayıt gerekmez</div>
                      </div>
                      <div className="text-2xl font-bold text-slate-900">₺0</div>
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
                    <div className="absolute -top-3 left-5 bg-brand-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">En Çok Tercih</div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-bold text-slate-900 text-base">Tek Başvuru</div>
                        <div className="text-xs text-slate-500 mt-0.5">90 gün / 1 ülke başvurusu</div>
                      </div>
                      <div>
                        <span className="text-2xl font-bold text-slate-900">₺499</span>
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
                      className="mt-4 w-full py-3 bg-brand-600 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 opacity-70 cursor-not-allowed">
                      <Clock className="w-4 h-4"/>
                      Yakında — Ödeme Sistemi Hazırlanıyor
                    </button>
                  </div>

                  {/* Yıllık Pro */}
                  <div className="border-2 border-brand-200 bg-gradient-to-br from-brand-50 to-indigo-50 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-bold text-slate-900 text-base">Yıllık Pro</div>
                        <div className="text-xs text-slate-500 mt-0.5">12 ay / sınırsız ülke</div>
                      </div>
                      <div>
                        <span className="text-2xl font-bold text-slate-900">₺999</span>
                        <span className="text-xs text-slate-500 ml-1">/ yıl</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      {['Tek Başvuru planındaki her şey +', 'Sınırsız ülke & başvuru', 'Ret mektubu analizi & strateji', 'Öncelikli destek hattı', 'Yeni özellikler erken erişim'].map(f => (
                        <div key={f} className="flex items-center gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-500 shrink-0"/>{f}
                        </div>
                      ))}
                    </div>
                    <button
                      disabled
                      className="mt-4 w-full py-3 bg-white/10 border border-white/20 text-white/60 font-bold rounded-xl text-sm flex items-center justify-center gap-2 cursor-not-allowed">
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
                    <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
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
                      <h4 className="font-bold text-emerald-900">Kişiye Özel Evrak Sihirbazı</h4>
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

                        {/* Alt eylem çubuğu: ilerleme + PDF + Tamam */}
                        <div className="mt-4 pt-4 border-t border-emerald-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                          <div className="flex-1 text-xs font-bold text-emerald-800">
                            {wizardChecked.size}/{wizardResult.length} belge hazır
                            {wizardChecked.size === wizardResult.length && wizardResult.length > 0 && (
                              <span className="ml-2 text-emerald-600">✓ Tamamlandı</span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={generateWizardDocListPDF}
                            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white border border-emerald-300 text-emerald-700 rounded-xl font-bold text-xs hover:bg-emerald-50 transition-colors"
                          >
                            <Download className="w-3.5 h-3.5"/> PDF İndir
                          </button>
                          <button
                            type="button"
                            onClick={() => { setIsDocumentListOpen(false); setWizardDone(false); setWizardResult([]); setWizardChecked(new Set()); }}
                            className="flex items-center justify-center gap-1.5 px-5 py-2.5 bg-emerald-700 text-white rounded-xl font-bold text-xs hover:bg-emerald-800 transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5"/> Tamam
                          </button>
                        </div>
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
                          ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/15'
                          : 'bg-slate-50 text-slate-600 hover:bg-brand-50 hover:text-brand-600 border border-slate-100'
                      }`}
                    >
                      İşverenler
                    </button>
                    <button
                      onClick={() => setApplicantType('unemployed')}
                      className={`px-4 py-2 rounded-xl font-bold text-sm transition-colors ${
                        applicantType === 'unemployed' 
                          ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/15'
                          : 'bg-slate-50 text-slate-600 hover:bg-brand-50 hover:text-brand-600 border border-slate-100'
                      }`}
                    >
                      Çalışmayanlar
                    </button>
                    <button
                      onClick={() => setApplicantType('minor')}
                      className={`px-4 py-2 rounded-xl font-bold text-sm transition-colors ${
                        applicantType === 'minor' 
                          ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/15'
                          : 'bg-slate-50 text-slate-600 hover:bg-brand-50 hover:text-brand-600 border border-slate-100'
                      }`}
                    >
                      Reşit Olmayanlar
                    </button>
                    <button
                      onClick={() => setApplicantType('sponsor')}
                      className={`px-4 py-2 rounded-xl font-bold text-sm transition-colors ${
                        applicantType === 'sponsor' 
                          ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/15'
                          : 'bg-slate-50 text-slate-600 hover:bg-brand-50 hover:text-brand-600 border border-slate-100'
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
                        <span className="text-4xl font-bold text-brand-600 font-mono">
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
                      <div className="text-5xl font-bold text-brand-700">%{currentScore}</div>
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
                      <h3 className="text-2xl font-bold">Ret Mektubu Analiz Motoru</h3>
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
                        <h4 className="font-bold text-slate-900 text-lg">Tespit Edilen {refusalResult.length} Sorun</h4>
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
                              <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${rule.severity === 'critical' ? 'bg-rose-100 text-rose-700' : rule.severity === 'high' ? 'bg-orange-100 text-orange-700' : 'bg-amber-100 text-amber-700'}`}>
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
                                <div className="w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{j+1}</div>
                                <p className="text-sm text-slate-700 leading-relaxed">{action}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                      <div className="p-5 bg-gradient-to-br from-brand-50 to-indigo-50 border border-brand-100 rounded-2xl flex items-start gap-4">
                        <Clock className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-slate-800 mb-1">Tavsiye Edilen Bekleme Süresi</p>
                          <p className="text-sm text-slate-600">
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
                      <h3 className="text-2xl font-bold">Randevu Takvim Asistanı</h3>
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
                                    <div className="font-bold text-slate-900">{c.country} — {c.city}</div>
                                    <div className="text-xs text-slate-500">{c.address}</div>
                                  </div>
                                </div>
                                <span className={`text-xs font-bold px-3 py-1 rounded-xl ${isLate ? 'bg-rose-100 text-rose-700' : isUrgent ? 'bg-amber-100 text-amber-700' : 'bg-teal-100 text-teal-700'}`}>
                                  {isLate ? '⚠ GEÇ KALDIM' : isUrgent ? '⚡ ACİL' : '✅ YETİŞİR'}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                <div className="bg-white/70 rounded-xl p-3 text-center">
                                  <div className="text-xs font-bold text-slate-400 mb-1">Tahmini Bekleme</div>
                                  <div className="text-xl font-bold text-slate-900">~{c.waitDays} gün</div>
                                </div>
                                <div className="bg-white/70 rounded-xl p-3 text-center">
                                  <div className="text-xs font-bold text-slate-400 mb-1">Son Randevu</div>
                                  <div className="text-sm font-bold text-slate-900">{deadline.toLocaleDateString('tr-TR')}</div>
                                </div>
                                <div className="bg-white/70 rounded-xl p-3 text-center">
                                  <div className="text-xs font-bold text-slate-400 mb-1">Kalan Gün</div>
                                  <div className={`text-xl font-bold ${isLate ? 'text-rose-600' : isUrgent ? 'text-amber-600' : 'text-teal-600'}`}>
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
                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
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
                      <h3 className="text-2xl font-bold">Belge Tutarlılık Matrisi</h3>
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
                    className="w-full py-4 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md shadow-brand-500/15 hover:-translate-y-0.5 transition-all duration-300">
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
                      <h3 className="text-2xl font-bold">Vizesiz Ülkeler & Pasaport Güçlendirici</h3>
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
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${country.entryType === 'Vizesiz' ? 'bg-emerald-100 text-emerald-700' : country.entryType === 'e-Vize' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                              {country.entryType}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 mb-3">
                            <div className="text-center p-2 bg-slate-50 rounded-xl">
                              <div className="text-[10px] font-bold text-slate-400">Kalış</div>
                              <div className="text-sm font-bold text-slate-900">{country.maxDays}g</div>
                            </div>
                            <div className="text-center p-2 bg-slate-50 rounded-xl">
                              <div className="text-[10px] font-bold text-slate-400">Uçuş</div>
                              <div className="text-sm font-bold text-slate-900">{country.flightHours}s</div>
                            </div>
                            <div className="text-center p-2 bg-emerald-50 rounded-xl">
                              <div className="text-[10px] font-bold text-emerald-600">+Puan</div>
                              <div className="text-sm font-bold text-emerald-700">+{country.scoreBoost}</div>
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
                      <h3 className="text-2xl font-bold">Banka Dökümü Vize Analizi</h3>
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
                        <h4 className="font-bold text-slate-900">Vize Uyumluluk Raporu</h4>
                        <button onClick={() => { setAiBankResult(null); setAiBankFile(''); setAiBankIncome(''); setAiBankBalance(''); setAiBankMonths('3'); setAiBankSalaryRegular(true); setAiBankLargeDeposit(false); }}
                          className="ml-auto flex items-center gap-1 text-sm font-bold text-blue-600 hover:underline">
                          <RefreshCw className="w-4 h-4"/> Yeni Analiz
                        </button>
                      </div>

                      {/* Skor Kartı */}
                      <div className={`p-5 rounded-2xl border-2 ${aiBankResult.score >= 80 ? 'bg-emerald-50 border-emerald-300' : aiBankResult.score >= 65 ? 'bg-blue-50 border-blue-300' : aiBankResult.score >= 50 ? 'bg-amber-50 border-amber-300' : 'bg-rose-50 border-rose-300'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Hedef Ülke</p>
                            <p className="font-bold text-slate-900 text-lg">{aiBankResult.country}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Vize Uyum Puanı</p>
                            <p className={`text-3xl font-bold ${aiBankResult.score >= 80 ? 'text-emerald-700' : aiBankResult.score >= 65 ? 'text-blue-700' : aiBankResult.score >= 50 ? 'text-amber-700' : 'text-rose-700'}`}>
                              {aiBankResult.score}<span className="text-base font-bold text-slate-400">/100</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{aiBankResult.gradeEmoji}</span>
                          <span className={`font-bold text-sm px-3 py-1 rounded-lg ${aiBankResult.score >= 80 ? 'bg-emerald-200 text-emerald-800' : aiBankResult.score >= 65 ? 'bg-blue-200 text-blue-800' : aiBankResult.score >= 50 ? 'bg-amber-200 text-amber-800' : 'bg-rose-200 text-rose-800'}`}>
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
                        <h5 className="font-bold text-emerald-800 text-sm mb-3 flex items-center gap-2">
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
                          <h5 className="font-bold text-rose-800 text-sm mb-3 flex items-center gap-2">
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
                          <h5 className="font-bold text-blue-800 text-sm mb-3 flex items-center gap-2">
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
                        <h5 className="font-bold text-slate-800 text-sm mb-2">Genel Değerlendirme</h5>
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
                      <h3 className="text-2xl font-bold">Başvuru Risk Tarayıcısı</h3>
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
                      <h3 className="text-2xl font-bold">Schengen Ülke Kıyaslayıcısı</h3>
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
                    const best = rankedCountries[0];
                    return best ? (
                      <div className="p-5 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex items-start gap-4 mb-2">
                        <div className="text-3xl">{best.flag}</div>
                        <div className="flex-1">
                          <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">
                            🎯 Profiliniz İçin #1 Öneri — Algoritma Seçimi
                          </div>
                          <div className="font-bold text-slate-900 text-lg">{best.name}</div>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs bg-emerald-200 text-emerald-800 font-bold px-2 py-0.5 rounded-lg">Profil Uyumu: %{best.matchScore}</span>
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
                    {rankedCountries.map((country) => {
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
                                <div className="font-bold text-slate-900 text-base">{country.name}</div>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${'matchScore' in country && (country as {matchScore:number}).matchScore >= 70 ? 'bg-emerald-100 text-emerald-700' : 'matchScore' in country && (country as {matchScore:number}).matchScore >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
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
                              <div className={`text-xs font-bold px-3 py-1 rounded-lg ${badgeColors[country.difficultyColor]}`}>
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
                                <span className={`font-bold ${country.rejectionRate > 30 ? 'text-rose-600' : country.rejectionRate > 20 ? 'text-orange-600' : country.rejectionRate > 12 ? 'text-amber-600' : 'text-emerald-600'}`}>
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
                                      <span className={`font-bold ${isBetter ? 'text-emerald-600' : isWorse ? 'text-rose-600' : 'text-slate-600'}`}>
                                        %{personalRate}
                                      </span>
                                      {isBetter && <span className="text-[9px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-md">Ortalamadan İyi</span>}
                                      {isWorse && <span className="text-[9px] font-bold bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-md">Ortalamadan Yüksek</span>}
                                      {!isBetter && !isWorse && <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md">Ortalama</span>}
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
                            <div className="text-sm font-bold text-slate-700">€{country.dailyBudgetReq}/gün</div>
                          </div>

                          {/* 2026 Trend notu */}
                          {'update2026' in country && (country as {update2026?: string}).update2026 && (
                            <div className="mt-3 p-2.5 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-2">
                              <TrendingUp className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5"/>
                              <p className="text-[11px] text-blue-800 leading-snug font-medium">
                                <span className="font-bold text-blue-700">2026 Trendi: </span>
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
                        <h3 className="text-lg font-bold text-slate-900">Sosyal Medya Denetim Rehberi</h3>
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
                          <span className={`font-bold text-base ${textColor}`}>{score}/100 — {label}</span>
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
                      <h4 className="text-xs font-bold text-rose-600 uppercase tracking-widest">
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
                                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
                                    item.severity === 'critical' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                                  }`}>
                                    {item.severity === 'critical' ? 'Kritik' : 'Uyarı'}
                                  </span>
                                )}
                                {done && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-600 shrink-0">Temizlendi</span>}
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
                      <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest">
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
                      <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
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
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-600 shrink-0">Avantaj</span>
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
                    className="w-full py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-2xl font-bold text-sm hover:shadow-lg hover:shadow-brand-500/20 hover:-translate-y-0.5 transition-all duration-300"
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
                    className="w-full py-4 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md shadow-brand-500/15 hover:-translate-y-0.5 transition-all duration-300"
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="engine-bg -mx-4 sm:-mx-6 lg:-mx-8 -mt-6 px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col relative"
            >
              {/* Üst bar */}
              <div className="w-full max-w-6xl mx-auto flex items-center justify-between py-6 relative z-10">
                <div className="flex items-center gap-2.5 font-display font-bold text-lg text-slate-900">
                  <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center shadow-md shadow-brand-500/20">
                    <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  VizeAkıl
                </div>
                <div className="flex items-center gap-5">
                  <a href="/blog" className="text-sm text-slate-400 hover:text-brand-600 transition-colors font-medium hidden sm:block">Blog</a>
                  <a href="/hakkimizda" className="text-sm text-slate-400 hover:text-brand-600 transition-colors font-medium hidden sm:block">Hakkımızda</a>
                  {hasSavedProfile && (
                    <button
                      type="button"
                      onClick={() => setStep('assessment')}
                      className="text-sm bg-brand-500 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-brand-500/20 hover:shadow-lg hover:shadow-brand-500/25 hover:-translate-y-0.5 transition-all duration-300"
                    >
                      Devam Et
                    </button>
                  )}
                </div>
              </div>

              {/* Ana içerik */}
              <div className="flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto w-full pb-20 relative z-10">
                <div className="text-center space-y-7 mb-14">
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <SocialProofBar />
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="text-4xl sm:text-5xl md:text-[3.75rem] font-bold tracking-tight text-slate-900 leading-[1.08]"
                  >
                    Vize başvurunuz{' '}
                    <span className="text-gradient">ne kadar güçlü?</span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="text-base sm:text-lg text-slate-400 max-w-lg mx-auto leading-relaxed font-light"
                  >
                    Ülkeni seç — AI motorumuz profilini analiz etsin ve sana özel strateji oluştursun.
                  </motion.p>
                </div>

                {/* Ülke Kartları */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.5 }}
                  className="w-full max-w-3xl grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-12"
                >
                  {([
                    { label: 'Almanya',    flag: '🇩🇪', rejRate: 23, tag: 'Schengen',     wait: '23 gün' },
                    { label: 'İngiltere',  flag: '🇬🇧', rejRate: 14, tag: 'UK Vizesi',    wait: '15 gün' },
                    { label: 'ABD',        flag: '🇺🇸', rejRate: 35, tag: 'B1/B2',        wait: '188 gün' },
                    { label: 'Fransa',     flag: '🇫🇷', rejRate: 15, tag: 'Schengen',     wait: '20 gün' },
                    { label: 'Hollanda',   flag: '🇳🇱', rejRate: 13, tag: 'Schengen',     wait: '14 gün' },
                    { label: 'İtalya',     flag: '🇮🇹', rejRate: 10, tag: 'Schengen',     wait: '10 gün' },
                    { label: 'Yunanistan', flag: '🇬🇷', rejRate: 6,  tag: 'En kolay',     wait: '5 gün' },
                    { label: 'Diğer',      flag: '🌍', rejRate: 20, tag: 'Tüm ülkeler',  wait: '' },
                  ] as const).map(({ label, flag, rejRate, tag, wait }, i) => (
                    <motion.button
                      key={label}
                      type="button"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.05, duration: 0.4 }}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        setOnboardingCountry(label);
                        setProfile((prev: ProfileData) => ({ ...prev, targetCountry: label }));
                        setOnboardingStep(1);
                        setStep('onboarding');
                      }}
                      className="group relative p-4 sm:p-5 rounded-2xl border-2 border-slate-100 bg-white text-left transition-all duration-300 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-500/[0.06]"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-3xl">{flag}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          rejRate <= 10 ? 'bg-emerald-50 text-emerald-600' :
                          rejRate <= 20 ? 'bg-amber-50 text-amber-600' :
                                         'bg-red-50 text-red-500'
                        }`}>
                          %{rejRate} ret
                        </span>
                      </div>
                      <div className="font-semibold text-slate-800 text-sm group-hover:text-brand-700 transition-colors">{label}</div>
                      <div className="text-[10px] text-slate-400 mt-1 font-medium">{tag}{wait && ` · ${wait}`}</div>
                    </motion.button>
                  ))}
                </motion.div>

                {/* Güven göstergeleri */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex flex-wrap items-center justify-center gap-6 sm:gap-10"
                >
                  {[
                    { icon: ShieldCheck, label: 'Veri saklanmaz', color: 'text-emerald-500' },
                    { icon: Zap, label: '18 analiz aracı', color: 'text-brand-500' },
                    { icon: Globe, label: '2026 konsolosluk verisi', color: 'text-sky-500' },
                  ].map(({ icon: Icon, label, color }, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                      <div className="w-7 h-7 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                        <Icon className={`w-3.5 h-3.5 ${color}`} />
                      </div>
                      <span className="font-medium">{label}</span>
                    </div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          )}

          {step === 'onboarding' && (
            <motion.div
              key="onboarding"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-lg mx-auto py-12 sm:py-20 px-4"
            >
              {onboardingStep === 1 && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="space-y-8">
                  {/* Geri + Ülke badge */}
                  <div className="flex items-center gap-3">
                    <button onClick={() => setStep('hero')}
                      className="p-2.5 rounded-xl text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-all duration-200">
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-full px-4 py-2 shadow-sm">
                      <span className="text-base">
                        {({'Almanya':'🇩🇪','İngiltere':'🇬🇧','ABD':'🇺🇸','Fransa':'🇫🇷','Hollanda':'🇳🇱','İtalya':'🇮🇹','Yunanistan':'🇬🇷'} as Record<string,string>)[onboardingCountry] || '🌍'}
                      </span>
                      <span className="text-xs font-semibold text-slate-700">{onboardingCountry}</span>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">Profilinizi seçin</h2>
                    <p className="text-sm text-slate-400 mt-2 font-light">Her profil farklı değerlendirilir — doğru seçim, doğru analiz.</p>
                  </div>

                  <div className="space-y-3">
                    {[
                      { id: 'employer',   icon: Briefcase, label: 'Çalışan / İşveren', desc: 'SGK\'lı iş veya şirket sahibi', color: 'from-brand-500 to-brand-600' },
                      { id: 'student',    icon: Brain,     label: 'Öğrenci',           desc: 'Üniversite veya lise', color: 'from-sky-500 to-blue-600' },
                      { id: 'unemployed', icon: Home,      label: 'Çalışmıyor / Emekli', desc: 'Eş veya aile sponsorluğu', color: 'from-amber-500 to-orange-500' },
                      { id: 'self',       icon: Target,    label: 'Serbest Meslek',     desc: 'Freelance veya esnaf', color: 'from-emerald-500 to-teal-600' },
                    ].map(({ id, icon: Icon, label, desc, color }) => (
                      <motion.button key={id}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setOnboardingProfile(id);
                          setApplicantType(id === 'employer' || id === 'unemployed' ? id as 'employer' | 'unemployed' : 'employer');
                          if (id === 'student') setProfile(prev => ({ ...prev, isStudent: true }));
                          setOnboardingStep(2);
                        }}
                        className="w-full card card-hover p-5 flex items-center gap-4 text-left"
                      >
                        <div className={`w-11 h-11 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center shrink-0 shadow-sm`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-800 text-sm">{label}</div>
                          <div className="text-xs text-slate-400 mt-0.5 font-light">{desc}</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-400 shrink-0 transition-colors" />
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {onboardingStep === 2 && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                  {/* Geri */}
                  <button onClick={() => setOnboardingStep(1)}
                    className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Profil seçimine dön
                  </button>

                  {/* Skor reveal */}
                  <div className="card p-7 sm:p-10 text-center space-y-7">
                    <div>
                      <div className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-600 text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">
                        <Sparkles className="w-3 h-3" />
                        Hızlı Analiz
                      </div>
                      <p className="text-sm text-slate-400 font-light">{onboardingCountry} · {onboardingProfile === 'employer' ? 'Çalışan' : onboardingProfile === 'student' ? 'Öğrenci' : onboardingProfile === 'unemployed' ? 'Çalışmıyor' : 'Serbest Meslek'}</p>
                    </div>

                    <div>
                      <div className={`text-7xl sm:text-8xl font-bold score-num ${
                        currentScore >= 82 ? 'text-emerald-500' :
                        currentScore >= 65 ? 'text-amber-500' : 'text-rose-500'
                      }`}>
                        %{currentScore}
                      </div>
                      <p className="text-xs text-slate-400 mt-3 font-light">Tahmini onay ihtimali</p>
                    </div>

                    {/* Status badge */}
                    <div className="flex items-center justify-center gap-2.5">
                      <span className={`badge ${
                        currentScore >= 82 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                        currentScore >= 65 ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                             'bg-rose-50 text-rose-700 border border-rose-100'
                      }`}>
                        {currentScore >= 82 ? 'Başvuruya Hazır' : currentScore >= 65 ? 'Geliştirmeli' : 'Riskli Profil'}
                      </span>
                      <span className="badge bg-slate-50 text-slate-500 border border-slate-100">
                        {currentConfidence.missingCount} eksik alan
                      </span>
                    </div>

                    {/* Progress */}
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${
                          currentScore >= 82 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' :
                          currentScore >= 65 ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 'bg-gradient-to-r from-rose-400 to-rose-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${currentScore}%` }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                      />
                    </div>
                  </div>

                  {/* CTA'lar */}
                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStep('assessment')}
                      className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2 group"
                    >
                      Profilini Detaylandır — Skoru Artır
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                    <motion.button
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStep('dashboard')}
                      className="btn-secondary w-full py-3.5 text-sm flex items-center justify-center gap-2"
                    >
                      <Zap className="w-4 h-4" />
                      Direkt Analiz Paneline Git
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}


          {step === 'assessment' && (
            <AssessmentStep
              profile={profile}
              currentScore={currentScore}
              currentConfidence={currentConfidence}
              actionItems={actionItems}
              applicantType={applicantType}
              onNavigate={setStep}
              onProfileUpdate={(patch) => setProfile(prev => ({ ...prev, ...patch }))}
              onProfileSet={setProfile}
              onApplicantTypeChange={setApplicantType}
              onProfileToggle={handleProfileToggle}
            />
          )}

          {step === 'dashboard' && (
            <DashboardStep
              profile={profile}
              currentScore={currentScore}
              currentConfidence={currentConfidence}
              countryWarning={countryWarning}
              rejectionMatches={rejectionMatches}
              intelligence={intelligence}
              bankHealthScore={bankHealthScore}
              roadmap={roadmap}
              actionItems={actionItems}
              baseScoreWithoutUs={baseScoreWithoutUs}
              isPremium={isPremium}
              simulatorValue={simulatorValue}
              isOcrScanning={isOcrScanning}
              ocrResults={ocrResults}
              letterData={letterData}
              feedbackStep={feedbackStep}
              fbEmail={fbEmail}
              fbDate={fbDate}
              fbStatus={fbStatus}
              fbRegisteredId={fbRegisteredId}
              fbOutcome={fbOutcome}
              fbRejCode={fbRejCode}
              fbRejNotes={fbRejNotes}
              dashToolTab={dashToolTab}
              showRiskDetail={showRiskDetail}
              onNavigate={setStep}
              onProfileUpdate={(patch) => setProfile(prev => ({ ...prev, ...patch }))}
              onProfileSet={setProfile}
              onReset={handleReset}
              onSimulatorValueChange={setSimulatorValue}
              onOcrUpload={handleOcrUpload}
              onGeneratePDF={generatePDF}
              onOpenReportModal={() => setIsAnalysisReportOpen(true)}
              onOpenTool={openTool}
              onFeedbackStepChange={setFeedbackStep}
              onFbEmailChange={setFbEmail}
              onFbDateChange={setFbDate}
              onFbStatusChange={setFbStatus}
              onFbRegisteredIdChange={setFbRegisteredId}
              onFbOutcomeChange={setFbOutcome}
              onFbRejCodeChange={setFbRejCode}
              onFbRejNotesChange={setFbRejNotes}
              onDashToolTabChange={setDashToolTab}
              onShowRiskDetailChange={setShowRiskDetail}
              setIsAiBankOpen={setIsAiBankOpen}
              setIsAppointmentOpen={setIsAppointmentOpen}
              setIsBankPlanOpen={setIsBankPlanOpen}
              setIsCalculatorOpen={setIsCalculatorOpen}
              setIsCommunityOpen={setIsCommunityOpen}
              setIsConsistencyOpen={setIsConsistencyOpen}
              setIsCopilotOpen={setIsCopilotOpen}
              setIsCountryGuideOpen={setIsCountryGuideOpen}
              setIsDocChecklistOpen={setIsDocChecklistOpen}
              setIsDocumentListOpen={setIsDocumentListOpen}
              setIsInterviewSimOpen={setIsInterviewSimOpen}
              setIsMultiCountryOpen={setIsMultiCountryOpen}
              setIsRedFlagOpen={setIsRedFlagOpen}
              setIsRefusalMapOpen={setIsRefusalMapOpen}
              setIsRefusalOpen={setIsRefusalOpen}
              setIsSchengenComparatorOpen={setIsSchengenComparatorOpen}
              setIsSocialMediaOpen={setIsSocialMediaOpen}
              setIsUpgradeOpen={setIsUpgradeOpen}
              setIsVisaFreeOpen={setIsVisaFreeOpen}
            />
          )}

          {step === 'tactics' && (
            <TacticsStep onNavigate={setStep} />
          )}

          {step === 'letter' && (
            <LetterStep
              activeLetterType={activeLetterType}
              letterData={letterData}
              onNavigate={setStep}
              onLetterTypeChange={setActiveLetterType}
              onLetterDataChange={setLetterData}
              buildLetterBody={buildLetterBody}
              generatePDF={generatePDF}
              generatePDFEN={generatePDFEN}
            />
          )}
        </AnimatePresence>
      </main>

      {/* ── Kişisel Analiz Raporu Modalı ─────────────────────────────── */}
      <AnalysisReportModal
        isOpen={isAnalysisReportOpen}
        onClose={() => setIsAnalysisReportOpen(false)}
        profile={profile}
        currentScore={currentScore}
        currentConfidence={currentConfidence}
        rejectionMatches={rejectionMatches}
        actionItems={actionItems}
      />

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
                  <h3 className="text-xl font-bold text-slate-900">Kullanım Koşulları</h3>
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
                    <h4 className="font-bold text-slate-900 mb-2">{title}</h4>
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
                  <h3 className="text-xl font-bold text-slate-900">KVKK Aydınlatma Metni</h3>
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
                    <h4 className="font-bold text-slate-900 mb-2">{title}</h4>
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
                  <h3 className="text-xl font-bold text-slate-900">Sık Sorulan Sorular</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Aklınızdaki her sorunun cevabı</p>
                </div>
                <button type="button" onClick={() => setIsFaqOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-5 h-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-7 space-y-4">
                {[
                  {
                    q: 'Başarı skorum neden düşük çıktı?',
                    a: 'Skor kartının altındaki "6 Eksen Profil" bölümüne bakın — hangi eksenin (Finansal, Mesleki, Bağlar, Seyahat, Başvuru, Güven) zayıf olduğunu yıldız sayısından anlayabilirsiniz. Her eksene tıklayınca somut aksiyon önerisi çıkar. "Puanınızı Nasıl Artırırsınız?" listesindeki her maddenin "Yaptım ✓" butonuna tıkladığınızda skor anlık yükselir. Banka düzenliliği, SGK belgesi ve seyahat sigortası en çok puan getiren 3 faktördür.'
                  },
                  {
                    q: 'Bilgilerimi girmek güvenli mi? Verilerim nereye gidiyor?',
                    a: 'Girdiğiniz tüm bilgiler yalnızca tarayıcınızda (cihazınızda) saklanır. Hiçbir bilginiz sunucularımıza iletilmez veya depolanmaz. Siteye bir sonraki girişinizde "Kaldığınız yerden devam edin" banneri görebilirsiniz — bu tamamen yerel bir özellik, sunucu tarafında kayıt yok. Tarayıcı geçmişini temizlediğinizde her şey silinir.'
                  },
                  {
                    q: '6 Eksen Profil nedir? Radar skorları nasıl yorumlanır?',
                    a: 'Skor kartındaki 6 Eksen Profil, başarı şansınızı bağımsız 6 boyutta değerlendirir: Finansal (banka düzeni, bakiye), Mesleki (SGK, işveren mektubu, kıdem), Bağlar (mülk, aile, sosyal), Seyahat (önceki vizeler, geçmiş), Başvuru (niyet mektubu, rezervasyon) ve Güven (pasaport, sigorta). Her eksen 0–100 arası puanlanır, yıldız sayısına (★★★★☆) dönüştürülür. Yeşil ≥80, sarı ≥50, kırmızı <50 anlamına gelir. Eksene tıklayarak o boyuta özel ipucu alabilirsiniz.'
                  },
                  {
                    q: 'Ülke Karşılaştırma (VS Modu) nasıl kullanılır?',
                    a: 'Dashboard\'daki "Ülke Karşılaştırma" widget\'ında 2 ülke seçin. Sistem ret oranını, bekleme gününü ve zorluk seviyesini yan yana bar grafiklerle gösterir ve hangisine önce başvurmanız gerektiğini otomatik hesaplar. Örneğin Almanya vs. Yunanistan karşılaştırmasında Yunanistan için ret oranı ve bekleme süresi belirgin şekilde düşük çıkar.'
                  },
                  {
                    q: 'Başvuru Zaman Çizelgesi nasıl çalışır?',
                    a: 'Dashboard\'daki "Başvuru Zaman Çizelgesi" widget\'ına planlanan başvuru tarihinizi girin. Sistem geriye doğru sayarak her görevi (profil değerlendirmesi, banka belgesi, sigorta, randevu vb.) ideal başlangıç tarihiyle listeler. Her görevin solundaki daireye tıklayarak tamamlandı olarak işaretleyebilirsiniz — bu bilgi tarayıcınızda kalır ve ilerlemenizi takip eder. Tarihi geçmiş görevler kırmızı renkte "⚠️ gecikti" uyarısıyla işaretlenir.'
                  },
                  {
                    q: 'Evrak Sihirbazı\'nda belge listesini nasıl kullanırım?',
                    a: 'Ülke ve çalışma durumunuzu seçtikten sonra "Liste Oluştur" butonuna tıklayın. Her belgeye tıkladığınızda üzeri çizilir — hazırladıklarınızı böyle takip edebilirsiniz. Başvuru tipinize göre (işveren, öğrenci, emekli vb.) farklı belge setleri otomatik oluşturulur.'
                  },
                  {
                    q: 'Ücretsiz araçlar neler? Premium ne kazandırıyor?',
                    a: 'Ücretsiz: Profil Skoru, 6 Eksen Radar, Ülke Karşılaştırma, Başvuru Zaman Çizelgesi, Evrak Listesi, Senaryo Simülatörü, Randevu Takvimi, Ülke Sıralaması. Premium ile: Vize Danışmanım (yapay zeka), Ret Mektubu Analizi, AI Banka Dökümü, Kırmızı Bayrak Tarayıcı, Sosyal Medya Rehberi, Ret Nedeni Haritası (2021–2026) ve Banka Hazırlık Planı.'
                  },
                  {
                    q: 'Başarı skorum nasıl hesaplanıyor?',
                    a: 'Algoritma v3.0 üç aşamalıdır: (1) 6 boyutta ham skor — finansal, mesleki, bağlar, seyahat, başvuru, güven. (2) Temporal Decay — eski vizeler ve eski ret cezaları zamanla azalan bir ağırlıkla değerlenir. (3) Bayes harmanı — ham skor (%65) + hedef ülkenin Türk başvurucu ret oranı (%35). Ek olarak planlanan başvuru ayı girilirse mevsimsel faktör (yaz pikinde Yunanistan/Almanya için hafif ceza) devreye girer. Şüpheli büyük mevduat veto koşulu olarak skoru 30\'a kısıtlar.'
                  },
                  {
                    q: 'Daha önce vize reddettim. Tekrar başvurabilir miyim?',
                    a: 'Evet. Önceki ret bilgilerinizi işaretlediğinizde Dashboard\'daki "Ret Risk Analizi" en yüksek riskli kalıpları yasal kodlarıyla gösterir. Temporal Decay sayesinde eski retlerin etkisi zamanla azalır — 3+ yıl önceki ret bugün çok daha az ağırlık taşır. "Ret Nedeni Haritası" ile hedef ülkenin 2021–2026 ret istatistiklerini de görebilirsiniz.'
                  },
                  {
                    q: 'Niyet mektubunu Türkçe ve İngilizce indirebiliyor muyum?',
                    a: 'Evet! 4 mektup türü (Başvuru Sahipliği, Sponsor, İşveren, Seyahat Planı) için hem 🇹🇷 Türkçe hem 🇬🇧 İngilizce PDF indirebilirsiniz. Skorunuz %65 üzerindeyse direkt "Niyet Mektubu Oluştur →" butonu skor kartında görünür.'
                  },
                  {
                    q: 'Ülke zorluk uyarısı (sarı/turuncu banner) ne anlama geliyor?',
                    a: 'Almanya, Fransa, İngiltere, ABD, Danimarka, İsveç veya Norveç seçtiğinizde Dashboard\'da otomatik uyarı çıkar (örn. Danimarka %66, ABD ~%45 ret oranı). Banner, profilinize göre daha elverişli 3 alternatif ülkeyi onay tahminleriyle önerir. Bilgilendirme amaçlıdır; seçiminizi değiştirmeden devam edebilirsiniz.'
                  },
                  {
                    q: 'Türkçe destek var mı?',
                    a: 'Platform tamamen Türkçe\'dir ve Türk pasaportuna sahip başvuru sahipleri için özel geliştirilmiştir. Teknik destek için destek@vizeakil.com adresine yazabilirsiniz.'
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
                    <h3 className="text-xl font-bold">VizeAkıl Nasıl Kullanılır?</h3>
                    <p className="text-brand-100 text-xs mt-1">Ülke seçiminden başvuruya — 3 adımda tam hazırlık</p>
                  </div>
                  <button type="button" onClick={() => setIsHowToOpen(false)} className="p-2 hover:bg-white/10 rounded-full"><X className="w-5 h-5" /></button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-7 space-y-8">
                {/* Adımlar */}
                {[
                  {
                    step: '01',
                    title: 'Ülke Seçin — Anında Bilgi Alın',
                    color: 'brand',
                    items: [
                      '"Ücretsiz Analizi Başlat" butonuna tıklayın.',
                      'Gelen bayrak ekranından başvuracağınız ülkeyi seçin — her ülkenin yanında ret oranı rozeti görünür.',
                      'Seçtiğiniz ülkeye ait bilgi kartı açılır: bekleme günü, zorluk seviyesi, kritik ipucu.',
                      '"Devam Et" ile analiz ekranına geçin. Daha önce ziyaret ettiyseniz "🔖 Kaldığınız yerden devam edin" banneri sizi doğrudan skor ekranına yönlendirir.',
                      'Başvuru tipinizi seçin (İşveren/Çalışmayan/Öğrenci/Sponsor) — ekran buna göre ilgili alanları otomatik gösterir/gizler.',
                    ]
                  },
                  {
                    step: '02',
                    title: 'Profil Doldurun — 6 Eksen Skor Alın',
                    color: 'indigo',
                    items: [
                      'Temel kriterleri işaretleyin (mobilde kart kart, masaüstünde grid olarak görünür).',
                      'Kalibrasyonlar bölümünde yaşınızı, kıdem sürenizi ve planlanan başvuru ayınızı girin — bu veriler temporal decay ve mevsimsel risk motorunu aktive eder.',
                      'Skor kartının altındaki "6 Eksen Profil"de her eksene tıklayarak zayıf noktanızı ve aksiyon önerisini görün.',
                      '"Puanınızı Nasıl Artırırsınız?" listesinde her adımı tamamladığınızda "Yaptım ✓" butonuna tıklayın — skor anında güncellenir, yeşil +X rozeti çıkar.',
                      'Skor %82+ olduğunda yeşil renkte "✓ Başvuruya hazır" gösterilir ve konfeti animasyonu tetiklenir.',
                    ]
                  },
                  {
                    step: '03',
                    title: 'Dashboard — Karşılaştır, Planla, Başvur',
                    color: 'violet',
                    items: [
                      '"Ülke Karşılaştırma" widget\'ında 2 ülkeyi yan yana karşılaştırın; ret oranı, bekleme süresi ve zorluk barları otomatik hesaplanır.',
                      '"Başvuru Zaman Çizelgesi"ne planlanan tarihinizi girin — görevler geriye doğru tarihlerle sıralanır, tamamladıklarınızı işaretleyin.',
                      '"Ret Risk Analizi" ile profilinize özgü risk kalıplarını yasal kodlarıyla görün.',
                      '"Niyet Mektubu" bölümünden 🇹🇷/🇬🇧 PDF indirin. Evrak Sihirbazı ile başvuru tipinize özel kontrol listesi oluşturun.',
                      'Kırmızı Bayrak Tarayıcı ile dosyanızdaki çelişkileri tespit edin; %82+ skorla güçlü bir başvuru yapın.',
                    ]
                  },
                ].map(({ step, title, color, items }) => (
                  <div key={step} className="flex gap-5">
                    <div className={`w-12 h-12 bg-${color}-50 rounded-2xl flex items-center justify-center shrink-0 border border-${color}-100`}>
                      <span className={`text-${color}-600 font-bold text-sm`}>{step}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 mb-3">{title}</h4>
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
                      <p className="text-xs text-amber-800 leading-relaxed">Başvurunuzdan <strong>en az 8 hafta önce</strong> sisteme girin ve "Başvuru Zaman Çizelgesi"ne tarihinizi girin. Görevleri teker teker işaretleyerek hiçbir adımı atlamayın. "Ret Risk Analizi" kartındaki uyarıları başvuru öncesinde sıfırlamayı hedefleyin — bu tek adım ret riskini önemli ölçüde azaltır.</p>
                    </div>
                  </div>
                </div>

                <button type="button"
                  onClick={() => { setIsHowToOpen(false); setOnboardingStep(0); setStep('onboarding'); }}
                  className="w-full py-4 bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
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
                    <div className="text-amber-200 text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                      <Brain className="w-4 h-4"/> Mülakat Simülatörü — Gerçek Konsolosluk Soruları
                    </div>
                    <h3 className="text-2xl font-bold">Vize Mülakatına Hazırlan</h3>
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
                      <h4 className="text-xl font-bold text-slate-900">Gerçek konsolosluk soruları, anında geri bildirim</h4>
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
                          <div className="font-bold text-slate-900 text-sm">{v.label}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{v.count} soru</div>
                        </button>
                      ))}
                    </div>
                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl text-xs text-amber-800 leading-relaxed">
                      <strong>Nasıl çalışır?</strong> Her soruya gerçek mülakata gibi cevap yazın. Sistem Türkçe cevabınızı analiz eder, not verir ve güçlendirilmesi gereken alanları gösterir. Mülakata gitmeden önce tüm soru kategorilerini pratiğe yapın.
                    </div>
                    <button onClick={() => { resetInterviewSim(); setInterviewPhase('question'); }}
                      className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-2xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
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
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-amber-100 text-amber-700 px-3 py-1 rounded-xl">{q.category}</span>
                        {interviewCurrentQ > 0 && prevAns && (
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-xl ${prevAns.score >= 6.5 ? 'bg-emerald-100 text-emerald-700' : prevAns.score >= 4.5 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                            Önceki: {prevAns.grade} ({prevAns.score.toFixed(1)}/10)
                          </span>
                        )}
                      </div>

                      {/* Soru */}
                      <div className="p-5 bg-gradient-to-br from-brand-50 to-indigo-50 border border-brand-100 rounded-2xl">
                        <div className="text-xs text-brand-500 font-bold mb-2">🎙 Konsolosluk Görevlisi:</div>
                        <p className="text-slate-800 font-bold leading-relaxed">{q.q}</p>
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
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Cevabınız:</label>
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
                          className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-2xl hover:opacity-90 transition-opacity disabled:opacity-40">
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
                        <div className={`text-6xl font-bold mb-1 ${gradeColor}`}>%{pct}</div>
                        <div className="text-xl font-bold text-white">{grade}</div>
                        <div className="text-slate-400 text-xs mt-2">{totalScore.toFixed(1)} / {maxScore} puan</div>
                        {/* Soru kartları */}
                        <div className="flex flex-wrap justify-center gap-1 mt-4">
                          {interviewAnswers.map((a,i) => (
                            <div key={i} className={`w-5 h-5 rounded-md text-[10px] font-bold flex items-center justify-center ${a.score>=8?'bg-emerald-500':a.score>=6.5?'bg-amber-500':a.score>=4.5?'bg-orange-500':'bg-rose-500'}`}>
                              {i+1}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Güçlü cevaplar */}
                      {strongAnswers.length > 0 && (
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-3">
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
                          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-3">
                            <AlertTriangle className="w-4 h-4 text-amber-500"/> Geliştirmeniz Gereken Alanlar
                          </h4>
                          <div className="space-y-3">
                            {weakAnswers.map((a,i) => (
                              <div key={i} className="p-4 bg-amber-50 border border-amber-100 rounded-2xl space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${a.score<4.5?'bg-rose-100 text-rose-700':'bg-amber-100 text-amber-700'}`}>{a.grade} • {a.score.toFixed(1)}/10</span>
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
                          className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-2xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                          <RefreshCw className="w-4 h-4"/> Tekrar Dene
                        </button>
                        <button onClick={() => setIsInterviewSimOpen(false)}
                          className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-2xl hover:opacity-90 transition-opacity">
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
                    <div className="text-cyan-200 text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                      <Plane className="w-4 h-4"/> Seyahat Planlayıcı
                    </div>
                    <h3 className="text-2xl font-bold">Kaç Vize Lazım?</h3>
                    <p className="text-cyan-100 text-sm mt-1">Gitmek istediğin ülkeleri seç → kaç başvuru gerektiğini anında hesapla</p>
                  </div>
                  <button onClick={() => setIsMultiCountryOpen(false)} className="p-2 hover:bg-white/10 rounded-full"><X className="w-6 h-6"/></button>
                </div>
                {/* Schengen bilgi kartı */}
                <div className="p-3 bg-white/15 rounded-2xl border border-white/20 flex items-start gap-3 mb-4">
                  <span className="text-2xl shrink-0">🇪🇺</span>
                  <div>
                    <div className="font-bold text-white text-sm">Schengen = 27 Ülke, 1 Vize!</div>
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
                    <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                      <span className="w-6 h-6 bg-cyan-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
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
                            <div className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-slate-900'}`}>{name}</div>
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
                        <span className="w-6 h-6 bg-cyan-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                        <h4 className="font-bold text-slate-900 text-base">Senin Planın</h4>
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
                              {isSchengen && <span className="text-[9px] text-cyan-600 font-bold bg-cyan-50 px-1 rounded">Schengen</span>}
                              <button onClick={() => setMcSelected(p=>p.filter(x=>x!==c))} className="text-slate-400 hover:text-rose-500 ml-0.5"><X className="w-3 h-3"/></button>
                            </div>
                          );
                        })}
                      </div>

                      {/* Sonuç kartı */}
                      <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl text-white">
                        <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">Toplam Başvuru Sayısı</div>
                        <div className="flex items-baseline gap-3 mb-4">
                          <div className="text-5xl font-bold text-white">{totalApplications}</div>
                          <div className="text-slate-300 text-sm leading-tight">{mcSelected.length} ülke için<br/><span className="text-white font-bold">{totalApplications} ayrı başvuru</span></div>
                        </div>

                        <div className="space-y-2">
                          {selectedSchengen.length > 0 && (
                            <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                              <div>
                                <div className="font-bold text-white text-sm">🇪🇺 Schengen Vizesi</div>
                                <div className="text-slate-300 text-xs mt-0.5">{selectedSchengen.map(c => `${multiCountryVisaData[c]?.flag} ${c}`).join(' · ')}</div>
                                <div className="text-emerald-300 text-[11px] font-bold mt-1">✓ {selectedSchengen.length} ülke için TEK başvuru!</div>
                              </div>
                              <div className="text-right shrink-0 ml-3">
                                <div className="text-2xl font-bold text-white">1</div>
                                <div className="text-slate-400 text-[10px]">başvuru</div>
                              </div>
                            </div>
                          )}
                          {needsConsulatVisa.map(c => (
                            <div key={c} className="flex items-center justify-between p-3 bg-rose-900/40 border border-rose-700/30 rounded-xl">
                              <div>
                                <div className="font-bold text-white text-sm">{multiCountryVisaData[c]?.flag} {c} Vizesi</div>
                                <div className="text-rose-200 text-xs mt-0.5">📋 Konsolosluk başvurusu gerekli</div>
                                <div className="text-slate-400 text-[10px] mt-0.5">{multiCountryVisaData[c]?.note}</div>
                              </div>
                              <div className="text-right shrink-0 ml-3">
                                <div className="text-2xl font-bold text-white">1</div>
                                <div className="text-slate-400 text-[10px]">başvuru</div>
                              </div>
                            </div>
                          ))}
                          {needsEvisa.map(c => (
                            <div key={c} className="flex items-center justify-between p-3 bg-blue-900/30 border border-blue-700/30 rounded-xl">
                              <div>
                                <div className="font-bold text-white text-sm">{multiCountryVisaData[c]?.flag} {c}</div>
                                <div className="text-blue-200 text-xs mt-0.5">🖥 Online e-Vize (kolay!)</div>
                                <div className="text-slate-400 text-[10px] mt-0.5">{multiCountryVisaData[c]?.note}</div>
                              </div>
                              <div className="text-right shrink-0 ml-3">
                                <div className="text-2xl font-bold text-white">1</div>
                                <div className="text-slate-400 text-[10px]">başvuru</div>
                              </div>
                            </div>
                          ))}
                          {kapida.length > 0 && (
                            <div className="p-3 bg-amber-900/30 border border-amber-700/30 rounded-xl">
                              <div className="font-bold text-white text-sm">🛂 Kapıda Vize</div>
                              <div className="text-amber-200 text-xs mt-0.5">{kapida.map(c=>`${multiCountryVisaData[c]?.flag} ${c}`).join(', ')} — havalimanında ödeme yap, geç!</div>
                              <div className="text-emerald-300 text-[11px] font-bold mt-1">✓ Önceden başvuru gerekmez</div>
                            </div>
                          )}
                          {vizsiz.length > 0 && (
                            <div className="p-3 bg-emerald-900/30 border border-emerald-700/30 rounded-xl">
                              <div className="font-bold text-white text-sm">✅ Vizesiz</div>
                              <div className="text-emerald-200 text-xs mt-0.5">{vizsiz.map(c=>`${multiCountryVisaData[c]?.flag} ${c}`).join(', ')} — pasaportunla direkt git!</div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* ADIM 3: Aksiyon planı */}
                      {totalApplications > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="w-6 h-6 bg-cyan-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                            <h4 className="font-bold text-slate-900 text-base">Ne Yapmalısın?</h4>
                          </div>
                          <div className="space-y-2">
                            {selectedSchengen.length > 0 && (
                              <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">1</div>
                                <div>
                                  <div className="font-bold text-blue-900 text-sm">Schengen Vizesi Başvur</div>
                                  <div className="text-blue-700 text-xs mt-1 leading-relaxed">
                                    En çok gün geçireceğin ülkenin konsolosluğuna başvur.{' '}
                                    <span className="font-bold">{selectedSchengen.length > 1 ? `${selectedSchengen[0]}'dan başvurabilirsin — geri kalan ${selectedSchengen.length-1} ülkeye de aynı vizeyle girersin.` : `${selectedSchengen[0]} konsolosluğuna başvur.`}</span>
                                  </div>
                                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                                    <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-xl">⏱ 15 gün önceden başvur</span>
                                    <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-xl">💰 ~€80-120 vize ücreti</span>
                                  </div>
                                </div>
                              </div>
                            )}
                            {needsEvisa.map((c, i) => (
                              <div key={c} className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                                <div className="w-8 h-8 bg-slate-700 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">{(selectedSchengen.length > 0 ? 1 : 0) + i + 1}</div>
                                <div>
                                  <div className="font-bold text-slate-900 text-sm">{multiCountryVisaData[c]?.flag} {c} e-Vizesi</div>
                                  <div className="text-slate-600 text-xs mt-1">Resmi e-devlet/konsolosluk sitesinden online başvur. 3-7 gün içinde onaylanır.</div>
                                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-xl">⏱ Seyahatten 1 hafta önce</span>
                                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-xl">🖥 Online — evden çıkmadan</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                            {needsConsulatVisa.map((c, i) => (
                              <div key={c} className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 rounded-2xl">
                                <div className="w-8 h-8 bg-rose-600 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">{(selectedSchengen.length > 0 ? 1 : 0) + needsEvisa.length + i + 1}</div>
                                <div>
                                  <div className="font-bold text-rose-900 text-sm">{multiCountryVisaData[c]?.flag} {c} Vizesi</div>
                                  <div className="text-rose-700 text-xs mt-1">{multiCountryVisaData[c]?.note} — Konsoloslukla randevu alman gerekiyor.</div>
                                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                                    <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-1 rounded-xl">⏱ 30+ gün önceden planla</span>
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
                    <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-2"><Star className="w-4 h-4"/> Topluluk Deneyimleri</div>
                    <h3 className="text-2xl font-bold">Gerçek Başvuru Deneyimleri</h3>
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
                          <div className="text-xl font-bold text-slate-900">{s.value}</div>
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
                              <span className="font-bold text-slate-900 text-sm">{e.consulate} — {e.city}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-xl ${e.result==='onaylandi'?'bg-emerald-100 text-emerald-700':e.result==='reddedildi'?'bg-rose-100 text-rose-700':'bg-amber-100 text-amber-700'}`}>
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
                      className="w-full py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-brand-500/20 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2">
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
                    <h4 className="font-bold text-slate-900">Başvuru Deneyiminizi Paylaşın</h4>
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
                        className="flex-1 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-brand-500/20 disabled:opacity-40 transition-all duration-300">
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
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-4">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              onClick={() => setIsAppointmentOpen(false)}
              className="absolute inset-0 bg-slate-950/50 backdrop-blur-md" />
            <motion.div initial={{opacity:0,scale:0.95,y:20}} animate={{opacity:1,scale:1,y:0}}
              exit={{opacity:0,scale:0.95,y:20}}
              className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[96vh] overflow-hidden">

              {/* ── Header — açık, okunaklı ── */}
              <div className="px-6 sm:px-8 pt-6 pb-5 border-b border-slate-100 shrink-0">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-md shadow-brand-500/15">
                        <Bell className="w-5 h-5 text-white"/>
                      </div>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Vize Randevu Takip</h3>
                        <p className="text-sm text-slate-400 font-light">VFS, TLS ve konsolosluk randevularını takip edin</p>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setIsAppointmentOpen(false)} className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors shrink-0">
                    <X className="w-5 h-5 text-slate-400"/>
                  </button>
                </div>

                {/* 3 adım — yatay, okunaklı */}
                <div className="flex gap-4 sm:gap-6 mb-5">
                  {[
                    { n: '1', b: 'Ülke Seç', d: 'Takip etmek istediğiniz merkezleri seçin' },
                    { n: '2', b: 'Bildirim Aç', d: 'E-posta ile anlık bildirim alın' },
                    { n: '3', b: 'Randevu Bul', d: 'Slot açılınca hemen başvurun' },
                  ].map(({ n, b, d }) => (
                    <div key={n} className="flex items-start gap-2.5">
                      <span className="w-7 h-7 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border border-brand-100">{n}</span>
                      <div>
                        <div className="text-sm font-semibold text-slate-800">{b}</div>
                        <div className="text-xs text-slate-400 font-light mt-0.5">{d}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ── Ülke Filtreleri — gruplu, büyük, okunaklı ── */}
                <div className="flex flex-wrap gap-2 items-center">
                  {(() => {
                    const SCHENGEN_COUNTRIES = ['Almanya','Fransa','İtalya','İspanya','Yunanistan','Portekiz','Hollanda','Avusturya','Polonya','Macaristan','Belçika','Danimarka','İsveç','Norveç','İsviçre'];
                    const groups = [
                      { id: 'Tümü', label: 'Tümü', flag: '' },
                      { id: 'ABD', label: 'ABD', flag: '🇺🇸' },
                      { id: 'İngiltere', label: 'İngiltere', flag: '🇬🇧' },
                      { id: 'Schengen', label: 'Schengen', flag: '🇪🇺' },
                      { id: 'Diğer', label: 'Diğer', flag: '🌍' },
                    ];
                    return (
                      <>
                        {groups.map(g => (
                          <button key={g.id} onClick={() => setApptCountryFilter(g.id)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                              apptCountryFilter === g.id
                                ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/20'
                                : 'bg-slate-50 text-slate-600 border border-slate-100 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200'
                            }`}>
                            {g.flag && <span className="mr-1.5">{g.flag}</span>}{g.label}
                          </button>
                        ))}

                        {/* Schengen alt-ülkeleri — sadece Schengen seçiliyken göster */}
                        {apptCountryFilter === 'Schengen' && (
                          <div className="w-full flex flex-wrap gap-1.5 mt-1 pt-2 border-t border-slate-100">
                            <button
                              onClick={() => setApptCountryFilter('Schengen')}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-50 text-brand-600 border border-brand-100">
                              Tüm Schengen
                            </button>
                            {SCHENGEN_COUNTRIES.map(c => {
                              const flags: Record<string,string> = {'Almanya':'🇩🇪','Fransa':'🇫🇷','İtalya':'🇮🇹','İspanya':'🇪🇸','Yunanistan':'🇬🇷','Portekiz':'🇵🇹','Hollanda':'🇳🇱','Avusturya':'🇦🇹','Polonya':'🇵🇱','Macaristan':'🇭🇺','Belçika':'🇧🇪','Danimarka':'🇩🇰','İsveç':'🇸🇪','Norveç':'🇳🇴','İsviçre':'🇨🇭'};
                              return (
                                <button key={c} onClick={() => setApptCountryFilter(c)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                    apptCountryFilter === c
                                      ? 'bg-brand-500 text-white shadow-sm'
                                      : 'bg-white text-slate-600 border border-slate-100 hover:border-brand-200 hover:text-brand-600'
                                  }`}>
                                  {flags[c] || ''} {c}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />
                        <button
                          onClick={() => setApptShowAvailableOnly(v => !v)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                            apptShowAvailableOnly
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-white text-slate-500 border-slate-100 hover:border-emerald-200 hover:text-emerald-600'
                          }`}
                        >
                          <span className={`w-2.5 h-2.5 rounded-full ${apptShowAvailableOnly ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          Müsait Olanlar
                        </button>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* ── İçerik ── */}
              <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6">
                {/* Uyarı */}
                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-amber-500" />
                  <span className="text-sm text-amber-700 leading-relaxed">
                    Bekleme süreleri <strong>tahminidir</strong> (Nisan 2026). Gerçek süre mevsim ve yoğunluğa göre değişir.
                  </span>
                </div>

                {/* İstatistikler */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label:'Takip Edilen', value:`${APPOINTMENT_TARGETS.length}`, unit:'Merkez', color:'text-slate-800', bg:'bg-slate-50' },
                    { label:'Müsait Şu An', value:`${APPOINTMENT_TARGETS.filter(t=>t.status==='müsait').length}`, unit:'Slot', color:'text-emerald-600', bg:'bg-emerald-50/60' },
                    { label:'Maks. Bekleme', value:`~${Math.max(...APPOINTMENT_TARGETS.map(t=>t.avgWaitDays))}`, unit:'Gün', color:'text-rose-500', bg:'bg-rose-50/60' },
                  ].map(s => (
                    <div key={s.label} className={`p-4 ${s.bg} rounded-2xl text-center border border-slate-100/60`}>
                      <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                      <div className="text-[11px] text-slate-500 font-medium mt-0.5">{s.unit}</div>
                      <div className="text-[10px] text-slate-400 mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* ── Konsolosluk listesi ── */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-slate-900 text-base">Merkezleri seçin</h4>
                    {apptSelected.length > 0 && (
                      <span className="text-sm font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-full">{apptSelected.length} seçildi</span>
                    )}
                  </div>
                  {apptShowAvailableOnly && (
                    <div className="flex items-center gap-2.5 p-3 bg-emerald-50 border border-emerald-100 rounded-xl mb-4 text-sm text-emerald-700 font-medium">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      Yalnızca müsait merkezler gösteriliyor
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(() => {
                      const SCHENGEN_LIST = ['Almanya','Fransa','İtalya','İspanya','Yunanistan','Portekiz','Hollanda','Avusturya','Polonya','Macaristan','Belçika','Danimarka','İsveç','Norveç','İsviçre'];
                      const NON_SCHENGEN_NON_MAJOR = ['Kanada'];
                      return APPOINTMENT_TARGETS
                        .filter(t => {
                          if (apptShowAvailableOnly && t.status !== 'müsait') return false;
                          if (apptCountryFilter === 'Tümü') return true;
                          if (apptCountryFilter === 'Schengen') return SCHENGEN_LIST.includes(t.country);
                          if (apptCountryFilter === 'Diğer') return NON_SCHENGEN_NON_MAJOR.includes(t.country);
                          return t.country === apptCountryFilter;
                        })
                        .map(t => {
                          const isSelected = apptSelected.includes(t.id);
                          const isMüsait = t.status === 'müsait';
                          const trendIcon = t.trend === 'artıyor' ? '↑' : t.trend === 'azalıyor' ? '↓' : '→';
                          const trendColor = t.trend === 'artıyor' ? 'text-rose-500' : t.trend === 'azalıyor' ? 'text-emerald-500' : 'text-slate-400';
                          const centerBadgeColor = t.centerType === 'VFS' ? 'bg-blue-50 text-blue-600 border-blue-100' : t.centerType === 'TLS' ? 'bg-violet-50 text-violet-600 border-violet-100' : 'bg-amber-50 text-amber-600 border-amber-100';
                          return (
                            <button key={t.id}
                              onClick={() => setApptSelected(p => isSelected ? p.filter(x=>x!==t.id) : [...p, t.id])}
                              className={`p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                                isSelected
                                  ? 'border-brand-400 bg-brand-50/50 shadow-sm shadow-brand-500/5'
                                  : isMüsait
                                  ? 'border-emerald-100 hover:border-emerald-300 bg-white hover:shadow-md'
                                  : 'border-slate-100 hover:border-slate-200 bg-white hover:shadow-md'
                              }`}>
                              {/* Satır 1: bayrak + ülke + durum */}
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <span className="text-2xl">{t.flag}</span>
                                  <div>
                                    <div className="font-bold text-slate-800 text-[15px]">{t.country}</div>
                                    <div className="text-sm text-slate-400">{t.city} · {t.visaType}</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${centerBadgeColor}`}>
                                    {t.centerType}
                                  </span>
                                  {isSelected && <CheckCircle2 className="w-5 h-5 text-brand-500"/>}
                                </div>
                              </div>

                              {/* Satır 2: durum + bekleme + trend */}
                              <div className="flex items-center gap-3 flex-wrap">
                                <span className={`text-xs font-bold px-3 py-1 rounded-full ${isMüsait ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                                  {isMüsait ? '● Müsait' : '○ Dolu'}
                                </span>
                                <span className="text-sm text-slate-500">
                                  Bekleme: <strong className={`${t.avgWaitDays > 60 ? 'text-rose-600' : t.avgWaitDays > 20 ? 'text-amber-600' : 'text-emerald-600'}`}>{t.avgWaitDays} gün</strong>
                                  <span className={`ml-1 font-bold ${trendColor}`}>{trendIcon}</span>
                                </span>
                              </div>

                              {/* Satır 3: notlar (varsa) */}
                              {t.notes && (
                                <div className="mt-3 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 leading-relaxed">
                                  {t.notes}
                                </div>
                              )}
                              {/* Satır 4: VFS linki */}
                              {isMüsait && (
                                <div className="mt-3">
                                  <a href={t.vfsUrl} target="_blank" rel="noopener noreferrer"
                                    onClick={e => e.stopPropagation()}
                                    className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors">
                                    {t.centerType === 'TLS' ? 'TLS' : t.centerType === 'Konsolosluk' ? 'Elçilik' : 'VFS'} sitesine git
                                    <ChevronRight className="w-4 h-4"/>
                                  </a>
                                </div>
                              )}
                            </button>
                          );
                        });
                    })()}
                    {/* Boş state */}
                    {APPOINTMENT_TARGETS.filter(t => {
                      const SCHENGEN_LIST = ['Almanya','Fransa','İtalya','İspanya','Yunanistan','Portekiz','Hollanda','Avusturya','Polonya','Macaristan','Belçika','Danimarka','İsveç','Norveç','İsviçre'];
                      const NON_SCHENGEN_NON_MAJOR = ['Kanada'];
                      if (apptShowAvailableOnly && t.status !== 'müsait') return false;
                      if (apptCountryFilter === 'Tümü') return true;
                      if (apptCountryFilter === 'Schengen') return SCHENGEN_LIST.includes(t.country);
                      if (apptCountryFilter === 'Diğer') return NON_SCHENGEN_NON_MAJOR.includes(t.country);
                      return t.country === apptCountryFilter;
                    }).length === 0 && (
                      <div className="col-span-2 text-center py-12 text-slate-500">
                        <div className="text-3xl mb-3">😔</div>
                        <p className="text-base font-medium">
                          {apptShowAvailableOnly
                            ? 'Seçili ülkede şu an müsait slot yok.'
                            : 'Bu ülke için merkez bulunamadı.'}
                        </p>
                        {apptShowAvailableOnly && (
                          <button onClick={() => setApptShowAvailableOnly(false)}
                            className="mt-3 text-sm text-brand-600 font-bold hover:text-brand-700">
                            Tüm merkezleri göster
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Bildirim aboneliği ── */}
                {apptSubStatus === 'success' ? (
                  <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl text-center">
                    <div className="text-3xl mb-2">✅</div>
                    <div className="font-bold text-emerald-800 text-lg">Abonelik Oluşturuldu!</div>
                    <div className="text-sm text-emerald-700 mt-1">
                      Seçtiğin merkezlerde slot açıldığında <strong>{apptSubEmail}</strong> adresine bildireceğiz.
                    </div>
                    <button onClick={() => { setApptSubStatus('idle'); setApptSubEmail(''); setApptSelected([]); }}
                      className="mt-4 text-sm text-emerald-600 font-bold hover:text-emerald-700">
                      Yeni abonelik oluştur
                    </button>
                  </div>
                ) : (
                  <div className="p-6 bg-slate-50/80 border border-slate-100 rounded-2xl space-y-4">
                    <h4 className="font-bold text-slate-900 text-base flex items-center gap-2.5">
                      <Bell className="w-5 h-5 text-brand-500"/> Slot açılınca haber ver
                    </h4>
                    <div className="flex gap-3">
                      <input
                        type="email"
                        value={apptSubEmail}
                        onChange={e => setApptSubEmail(e.target.value)}
                        placeholder="e-posta adresiniz"
                        className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-brand-100 focus:border-brand-400 transition-all"
                      />
                      <button
                        onClick={handleApptSubscribe}
                        disabled={!apptSubEmail || apptSelected.length === 0 || apptSubStatus === 'loading'}
                        className="btn-primary px-6 py-3 text-sm disabled:opacity-40">
                        {apptSubStatus === 'loading' ? '...' : 'Takip Et'}
                      </button>
                    </div>
                    {apptSelected.length === 0 && (
                      <p className="text-sm text-slate-400">Yukarıdan en az bir merkez seçin.</p>
                    )}
                    {apptSubStatus === 'error' && (
                      <p className="text-sm text-rose-600 font-medium">Bir hata oluştu. Lütfen tekrar deneyin.</p>
                    )}
                    <p className="text-xs text-slate-400 leading-relaxed">
                      E-postanız yalnızca bildirim amaçlı kullanılır. İstediğiniz zaman aboneliğinizi iptal edebilirsiniz.
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
                    <h3 className="text-lg font-bold text-slate-900">Banka Hesabı Hazırlık Planı</h3>
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
                  const requiredEur = params.dailyEur * days;
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
                          <div className="text-base font-bold text-green-600">+{(monthlyDeposit/1000).toFixed(0)}K</div>
                          <div className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">Aylık Min. Giriş</div>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                          <div className="text-base font-bold text-rose-600">max {(maxWithdraw/1000).toFixed(0)}K</div>
                          <div className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">Aylık Max. Çıkış</div>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                          <div className="text-base font-bold text-slate-800">{params.minDays} gün</div>
                          <div className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">Min. Hesap Özeti</div>
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
                        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Kritik Kurallar</div>
                        {[
                          `Son 28 günde tek seferde ${(requiredTL * 0.2 / 1000).toFixed(0)}K TL üzeri yatırım yapmayın`,
                          'Her ay düzenli maaş/gelir girişi olsun (aynı günler ideal)',
                          `Hesapta her zaman en az ${(requiredTL * 0.7 / 1000).toFixed(0)}K TL tutun`,
                          'Giriş-çıkış oranı %40\'ı geçmesin (aktif ama şüpheli değil)',
                        ].map((r, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                            <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">{i+1}</div>
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
                  className="w-full py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-2xl font-bold text-sm hover:shadow-lg hover:shadow-brand-500/20 hover:-translate-y-0.5 transition-all duration-300">
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

              {/* Header */}
              <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-4 shrink-0">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    <h3 className="text-lg font-bold text-slate-900">Ret Nedeni Haritası</h3>
                  </div>
                  <p className="text-sm text-slate-500">2021–2026 gerçek ret kodları — Schengen · İngiltere · ABD</p>
                </div>
                <button onClick={() => setIsRefusalMapOpen(false)} aria-label="Kapat"
                  className="p-2 rounded-xl hover:bg-slate-100 transition-colors shrink-0">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

                {/* ── Ülke seçimi ── */}
                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Schengen</div>
                  <div className="flex gap-1.5 flex-wrap">
                    {['Almanya','Fransa','İspanya','İtalya','Hollanda','Avusturya','Belçika','Danimarka','İsveç','Norveç','Yunanistan','Portekiz','Polonya','İsviçre'].map(c => (
                      <button key={c} onClick={() => setRefusalMapCountry(c)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${refusalMapCountry === c ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-slate-600 border-slate-200 hover:border-orange-300'}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Diğer</div>
                  <div className="flex gap-1.5 flex-wrap">
                    {['İngiltere','ABD'].map(c => (
                      <button key={c} onClick={() => setRefusalMapCountry(c)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${refusalMapCountry === c ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-slate-600 border-slate-200 hover:border-orange-300'}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── Görsel bar chart ── */}
                {(() => {
                  const isUK  = refusalMapCountry === 'İngiltere';
                  const isUSA = refusalMapCountry === 'ABD';

                  /* UK */
                  if (isUK) {
                    const maxPct = Math.max(...UK_REFUSAL_CODES.map(x => x.pct));
                    const userRisks = UK_REFUSAL_CODES.filter(r => r.profileRisk(profile));
                    return (
                      <div className="space-y-3">
                        {userRisks.length > 0 && (
                          <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                            <div>
                              <div className="font-bold text-sm text-orange-900">Profilinizde {userRisks.length} UK riski tespit edildi</div>
                              <div className="text-xs text-orange-700 mt-0.5">{userRisks.map(r => r.label).join(' · ')}</div>
                            </div>
                          </div>
                        )}
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">İngiltere — 2021-2026 Ret Nedeni Dağılımı (Türk başvurucular)</div>
                        <div className="space-y-2">
                          {UK_REFUSAL_CODES.map(rc => {
                            const isRisk = rc.profileRisk(profile);
                            const barW = Math.round((rc.pct / maxPct) * 100);
                            return (
                              <div key={rc.code} className={`p-3 rounded-2xl border ${isRisk ? 'bg-orange-50 border-orange-200' : 'bg-slate-50 border-slate-100'}`}>
                                <div className="flex items-center gap-3 mb-2">
                                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ${isRisk ? 'bg-orange-100 text-orange-700' : 'bg-slate-200 text-slate-600'}`}>{rc.code}</span>
                                  <span className="text-xs font-bold text-slate-800 flex-1">{rc.label}</span>
                                  <span className="text-sm font-bold text-slate-700 shrink-0">%{rc.pct}</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-1.5 mb-1">
                                  <div className={`h-1.5 rounded-full ${isRisk ? 'bg-orange-400' : 'bg-slate-400'}`} style={{ width: `${barW}%` }} />
                                </div>
                                <p className="text-[10px] text-slate-500 leading-relaxed">{rc.desc}</p>
                                {isRisk && <div className="mt-1 text-[10px] font-bold text-orange-600">⚠ Profilinizde bu risk mevcut</div>}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }

                  /* USA */
                  if (isUSA) {
                    const maxPct = Math.max(...USA_REFUSAL_CODES.map(x => x.pct));
                    const userRisks = USA_REFUSAL_CODES.filter(r => r.profileRisk(profile));
                    return (
                      <div className="space-y-3">
                        {userRisks.length > 0 && (
                          <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                            <div>
                              <div className="font-bold text-sm text-orange-900">Profilinizde {userRisks.length} ABD riski tespit edildi</div>
                              <div className="text-xs text-orange-700 mt-0.5">{userRisks.map(r => r.label).join(' · ')}</div>
                            </div>
                          </div>
                        )}
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">ABD — 2021-2026 B1/B2 Ret Nedeni Dağılımı (Türk başvurucular)</div>
                        <div className="space-y-2">
                          {USA_REFUSAL_CODES.map(rc => {
                            const isRisk = rc.profileRisk(profile);
                            const barW = Math.round((rc.pct / maxPct) * 100);
                            return (
                              <div key={rc.code} className={`p-3 rounded-2xl border ${isRisk ? 'bg-orange-50 border-orange-200' : 'bg-slate-50 border-slate-100'}`}>
                                <div className="flex items-center gap-3 mb-2">
                                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ${isRisk ? 'bg-orange-100 text-orange-700' : 'bg-slate-200 text-slate-600'}`}>{rc.code}</span>
                                  <span className="text-xs font-bold text-slate-800 flex-1">{rc.label}</span>
                                  <span className="text-sm font-bold text-slate-700 shrink-0">%{rc.pct}</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-1.5 mb-1">
                                  <div className={`h-1.5 rounded-full ${isRisk ? 'bg-orange-400' : 'bg-slate-400'}`} style={{ width: `${barW}%` }} />
                                </div>
                                <p className="text-[10px] text-slate-500 leading-relaxed">{rc.desc}</p>
                                {isRisk && <div className="mt-1 text-[10px] font-bold text-orange-600">⚠ Profilinizde bu risk mevcut</div>}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }

                  /* Schengen */
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
                  const maxVal = Math.max(...SCHENGEN_REFUSAL_CODES.map(x => x.byCountry[refusalMapCountry] ?? 0));

                  return (
                    <div className="space-y-3">
                      {topUserRisk && (
                        <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                          <div>
                            <div className="font-bold text-sm text-orange-900">Profilinize göre en yüksek riskiniz:</div>
                            <div className="text-sm text-orange-700 mt-0.5"><strong>Kod {topUserRisk.code} — {topUserRisk.label}</strong></div>
                            <div className="text-xs text-orange-600 mt-1">{topUserRisk.desc}</div>
                          </div>
                        </div>
                      )}
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{refusalMapCountry} — 2021-2026 Ret Kodu Dağılımı (Türk başvurucular)</div>
                      <div className="space-y-2">
                        {SCHENGEN_REFUSAL_CODES
                          .filter(rc => (rc.byCountry[refusalMapCountry] ?? 0) > 0)
                          .sort((a, b) => (b.byCountry[refusalMapCountry] ?? 0) - (a.byCountry[refusalMapCountry] ?? 0))
                          .map(rc => {
                            const val = rc.byCountry[refusalMapCountry] ?? 0;
                            const barW = Math.round((val / maxVal) * 100);
                            const isHighRisk = (profileRisks[rc.code] ?? 0) > 10;
                            return (
                              <div key={rc.code} className={`p-3 rounded-2xl border ${isHighRisk ? 'bg-orange-50 border-orange-200' : 'bg-slate-50 border-slate-100'}`}>
                                <div className="flex items-center gap-3 mb-2">
                                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ${isHighRisk ? 'bg-orange-100 text-orange-700' : 'bg-slate-200 text-slate-600'}`}>KOD {rc.code}</span>
                                  <span className="text-xs font-bold text-slate-800 flex-1">{rc.label}</span>
                                  <span className="text-sm font-bold text-slate-700 shrink-0">%{val}</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-1.5 mb-1">
                                  <div className={`h-1.5 rounded-full ${isHighRisk ? 'bg-orange-400' : 'bg-slate-400'}`} style={{ width: `${barW}%` }} />
                                </div>
                                <p className="text-[10px] text-slate-500 leading-relaxed">{rc.desc}</p>
                                {isHighRisk && <div className="mt-1 text-[10px] font-bold text-orange-600">⚠ Profilinizde bu risk mevcut</div>}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  );
                })()}

                <p className="text-[10px] text-slate-400 text-center pt-2">
                  Kaynak: EU Schengen Visa Statistics 2021-2025, UK Home Office, US Dept of State NIV Statistics · Türk başvurucular · Yüzdeler ret içindeki dağılımı gösterir
                </p>
              </div>

              <div className="px-6 py-4 border-t border-slate-100 shrink-0">
                <button onClick={() => setIsRefusalMapOpen(false)}
                  className="w-full py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-2xl font-bold text-sm hover:shadow-lg hover:shadow-brand-500/20 hover:-translate-y-0.5 transition-all duration-300">
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
                    <h3 className="text-lg font-bold text-slate-900">Senin Gibi Kaç Kişi?</h3>
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
                        <div className="text-4xl font-bold text-slate-900">{bracket.total.toLocaleString()}</div>
                        <div className="text-sm text-slate-500 mt-1">Benzer profilli başvuru sahibi</div>
                        <div className="text-xs text-purple-600 font-bold mt-0.5">
                          Skor aralığı: {Math.max(0, score-10)}–{Math.min(100, score+10)} puan
                        </div>
                      </div>

                      {/* Onay / Ret dağılımı */}
                      <div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Sonuç Dağılımı</div>
                        <div className="flex rounded-xl overflow-hidden h-10 mb-2">
                          <div className="bg-emerald-500 flex items-center justify-center text-white font-bold text-sm transition-all"
                            style={{ width: `${approvedPct}%` }}>
                            %{approvedPct}
                          </div>
                          <div className="bg-rose-400 flex items-center justify-center text-white font-bold text-sm transition-all"
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
                                <div className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center text-[10px] font-bold text-rose-600 shrink-0">
                                  {i+1}
                                </div>
                                <span className="text-sm text-slate-700 flex-1">{r.reason}</span>
                                <span className="text-sm font-bold text-rose-600 shrink-0">%{r.pct}</span>
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
                  className="w-full py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-2xl font-bold text-sm hover:shadow-lg hover:shadow-brand-500/20 hover:-translate-y-0.5 transition-all duration-300">
                  Kapat
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── ARAÇ: Belge Kontrol Listesi ──────────────────────────────────────── */}
      <DocChecklistModal
        isOpen={isDocChecklistOpen}
        onClose={() => setIsDocChecklistOpen(false)}
        profile={profile}
        onDownloadPDF={generateDocumentChecklistPDF}
      />
      {/* ── ARAÇ 18: Nereye Gidebilirim ────────────────────────────────── */}
      <CountryGuideModal
        isOpen={isCountryGuideOpen}
        onClose={() => setIsCountryGuideOpen(false)}
        currentScore={currentScore}
      />

      {/* ── YARDIM SAYFASI ─────────────────────────────────────────────── */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

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
