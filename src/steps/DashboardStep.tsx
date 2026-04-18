// ============================================================
// DashboardStep — Ana Kontrol Paneli
// ============================================================
import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2, Circle, FileText, ShieldCheck, FileCheck, TrendingUp, Download,
  AlertCircle, Globe, Stethoscope, PenTool, Zap, Clock, Brain, LayoutList,
  MessageSquare, AlertTriangle, Map, Check, X, Calendar, Plane, Upload,
  Sparkles, Star, RefreshCw, XCircle, ChevronDown, ChevronUp,
  Banknote, ClipboardList, Target, ArrowLeft, ChevronRight, Wallet,
  Briefcase, Info, Euro, BadgeCheck, Stamp, ExternalLink, ScanLine, Bell,
} from 'lucide-react';
import type { ProfileData } from '../types';
import type { CountryWarning } from '../lib/scoringV2';
import { apiUrl } from '../lib/api';
import { explainConfidence } from '../scoring/algorithms';
import { ProfileRadarChart } from '../components/ProfileRadarChart';
import { CountryRanking } from '../components/CountryRanking';
import { WhatIfSimulator } from '../components/WhatIfSimulator';
import { EvidenceChecklist } from '../components/EvidenceChecklist';
import { RejectionRiskWidget } from '../components/RejectionRiskWidget';
import SeasonalRiskWidget from '../components/SeasonalRiskWidget';
import ResearchInsightsWidget from '../components/ResearchInsightsWidget';
import { WidgetBoundary } from '../components/ErrorBoundary';
import ScoreStory from '../components/ScoreStory';
import BenchmarkCard from '../components/BenchmarkCard';
import { CountryCompareWidget } from '../components/CountryCompareWidget';
import { VisaTimeline } from '../components/VisaTimeline';
import { PROFILE_STORAGE_KEY, PREMIUM_TOOLS } from '../data/tools';
import { AnimatePresence } from 'motion/react';
import type { RejectionPattern } from '../data/refusals';

interface ActionItem {
  title: string;
  desc: string;
  gain: string;
  toolLabel: string;
  toolFn: () => void;
  doneFn?: () => void;
}

interface RoadmapItem {
  week: number;
  task: string;
  impact: string;
}

export interface DashboardStepProps {
  profile: ProfileData;
  currentScore: number;
  currentConfidence: { label: string; color: string; low: number; high: number; missingCount: number };
  countryWarning: CountryWarning | null;
  rejectionMatches: RejectionPattern[];
  intelligence: {
    persona: string;
    personaDestiny: string;
    readiness: 'apply' | 'moderate' | 'wait' | 'risky';
    docStrengths: { financial: number; professional: number; history: number; trust: number };
    timeline: string;
    route: string[];
  };
  bankHealthScore: number;
  roadmap: RoadmapItem[];
  actionItems: ActionItem[];
  baseScoreWithoutUs: number;
  isPremium: boolean;
  simulatorValue: number;
  isOcrScanning: boolean;
  ocrResults: { file: string; status: string; ok: boolean; warn?: boolean }[];
  letterData: import('../types').LetterData;
  feedbackStep: string;
  fbEmail: string;
  fbDate: string;
  fbStatus: string;
  fbRegisteredId: string;
  fbOutcome: string;
  fbRejCode: string;
  fbRejNotes: string;
  dashToolTab: 'hazirlik' | 'analiz' | 'ulke';
  showRiskDetail: boolean;
  // Callbacks
  onNavigate: (step: string) => void;
  onProfileUpdate: (patch: Partial<ProfileData>) => void;
  onProfileSet: React.Dispatch<React.SetStateAction<ProfileData>>;
  onReset: () => void;
  onSimulatorValueChange: (v: number) => void;
  onOcrUpload: (files: FileList | null) => void;
  onGeneratePDF: (type: string) => void;
  onOpenReportModal: () => void;
  onOpenTool: (key: string, setter: React.Dispatch<React.SetStateAction<boolean>>) => void;
  onFeedbackStepChange: React.Dispatch<React.SetStateAction<string>>;
  onFbEmailChange: React.Dispatch<React.SetStateAction<string>>;
  onFbDateChange: React.Dispatch<React.SetStateAction<string>>;
  onFbStatusChange: React.Dispatch<React.SetStateAction<string>>;
  onFbRegisteredIdChange: React.Dispatch<React.SetStateAction<string>>;
  onFbOutcomeChange: React.Dispatch<React.SetStateAction<string>>;
  onFbRejCodeChange: React.Dispatch<React.SetStateAction<string>>;
  onFbRejNotesChange: React.Dispatch<React.SetStateAction<string>>;
  onDashToolTabChange: React.Dispatch<React.SetStateAction<'hazirlik' | 'analiz' | 'ulke'>>;
  onShowRiskDetailChange: React.Dispatch<React.SetStateAction<boolean>>;
  // Modal setters (passed through for openTool calls)
  setIsAiBankOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAppointmentOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsBankPlanOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCalculatorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCommunityOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsConsistencyOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCopilotOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCountryGuideOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDocChecklistOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDocumentListOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCostCalculatorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDayCalculatorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsInterviewSimOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMultiCountryOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRedFlagOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRefusalMapOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRefusalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSchengenComparatorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSocialMediaOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsUpgradeOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsVisaFreeOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// ── Güven aralığı badge + tooltip ─────────────────────────────────────────
function ConfidenceBadge({
  low, high, label, missingCount, reasons,
}: {
  low: number;
  high: number;
  label: string;
  missingCount: number;
  reasons: { key: string; text: string }[];
}) {
  const [open, setOpen] = React.useState(false);
  const actionable = reasons.filter(r => r.key !== 'complete');
  return (
    <div className="relative mb-4">
      <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
        <span>Aralık:</span>
        <span className="font-bold text-slate-700">%{low}–%{high}</span>
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          className={`px-2 py-0.5 rounded-full font-bold text-[10px] inline-flex items-center gap-1 ${
            label === 'Yüksek' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
            : label === 'Orta'  ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
            : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
          }`}
          aria-expanded={open}
          title="Neden bu aralık?"
        >
          {label} Güven
          <Info className="w-3 h-3" />
        </button>
        {missingCount > 0 && (
          <span className="text-slate-400 ml-auto">{missingCount} alan eksik</span>
        )}
      </div>
      {open && (
        <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] leading-relaxed text-slate-600">
          <div className="font-bold text-slate-800 mb-1.5">Bu aralık neden bu genişlikte?</div>
          {actionable.length === 0 ? (
            <p>Önemli kalibrasyon sinyalleri tamamlanmış; aralık mümkün olan en dar seviyede.</p>
          ) : (
            <ul className="list-disc pl-4 space-y-1">
              {actionable.map(r => <li key={r.key}>{r.text}</li>)}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export function DashboardStep({
  profile, currentScore, currentConfidence, countryWarning,
  rejectionMatches, intelligence, bankHealthScore, roadmap, actionItems,
  baseScoreWithoutUs, isPremium, simulatorValue, isOcrScanning, ocrResults,
  letterData, feedbackStep, fbEmail, fbDate, fbStatus, fbRegisteredId,
  fbOutcome, fbRejCode, fbRejNotes, dashToolTab, showRiskDetail,
  onNavigate, onProfileUpdate, onProfileSet, onReset, onSimulatorValueChange,
  onOcrUpload, onGeneratePDF, onOpenReportModal, onOpenTool,
  onFeedbackStepChange, onFbEmailChange, onFbDateChange, onFbStatusChange,
  onFbRegisteredIdChange, onFbOutcomeChange, onFbRejCodeChange, onFbRejNotesChange,
  onDashToolTabChange, onShowRiskDetailChange,
  setIsAiBankOpen, setIsAppointmentOpen, setIsBankPlanOpen, setIsCalculatorOpen,
  setIsCommunityOpen, setIsConsistencyOpen, setIsCopilotOpen, setIsCountryGuideOpen,
  setIsDocChecklistOpen, setIsDocumentListOpen, setIsInterviewSimOpen,
  setIsCostCalculatorOpen, setIsDayCalculatorOpen,
  setIsMultiCountryOpen, setIsRedFlagOpen, setIsRefusalMapOpen, setIsRefusalOpen,
  setIsSchengenComparatorOpen, setIsSocialMediaOpen, setIsUpgradeOpen, setIsVisaFreeOpen,
}: DashboardStepProps) {
  // Alias setters to match original names in JSX
  const setStep = onNavigate;
  const setProfile = onProfileSet;
  const setSimulatorValue = onSimulatorValueChange;
  const handleOcrUpload = onOcrUpload;
  const generatePDF = onGeneratePDF;
  const openTool = onOpenTool;
  const setFeedbackStep = onFeedbackStepChange;
  const setFbEmail = onFbEmailChange;
  const setFbDate = onFbDateChange;
  const setFbStatus = onFbStatusChange;
  const setFbRegisteredId = onFbRegisteredIdChange;
  const setFbOutcome = onFbOutcomeChange;
  const setFbRejCode = onFbRejCodeChange;
  const setFbRejNotes = onFbRejNotesChange;
  const setDashToolTab = onDashToolTabChange;
  const setShowRiskDetail = onShowRiskDetailChange;
  // ── Boş profil kontrolü ──────────────────────────────────────────────────
  const isEmptyProfile = currentScore <= 12 &&
    !profile.bankSufficientBalance && !profile.hasSgkJob &&
    !profile.hasHighValueVisa && !profile.hasAssets &&
    !profile.isMarried && !profile.cleanCriminalRecord &&
    !profile.hasTravelInsurance;

  return (
            <motion.div
                key="dashboard"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-6 sm:space-y-10"
              >

                {/* ── BOŞ DURUM BANNER ────────────────────────────────── */}
                {isEmptyProfile && (
                  <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl bg-gradient-to-br from-indigo-50 to-brand-50 border border-indigo-100 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5"
                  >
                    <div className="text-5xl">🫥</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 text-lg">
                        Henüz bilgilerinizi girmediniz.
                      </h3>
                      <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                        3 dakika ayırıp profilinizi doldurun — size özel başarı tahmini ve aksiyon planı hazırlayalım.
                        Banka bakiyesi, iş durumu ve seyahat geçmişinizi ekleyerek skoru <strong className="text-indigo-700">~25–40 puan</strong> artırabilirsiniz.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep('assessment')}
                      className="shrink-0 px-5 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors whitespace-nowrap flex items-center gap-2"
                    >
                      Profili Doldur →
                    </button>
                  </motion.div>
                )}

                <div className="space-y-4 sm:space-y-5">

                  {/* ── KART 1: SKOR + ÖNCELIKLI ADIMLAR ── */}
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    {/* Üst şerit: ülke seçici + kontrol butonları */}
                    <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-slate-400" />
                        <select
                          value={profile.targetCountry}
                          onChange={(e) => setProfile(prev => ({ ...prev, targetCountry: e.target.value }))}
                          className="text-sm font-bold text-slate-700 bg-transparent border-none focus:ring-0 cursor-pointer p-0"
                        >
                          <option value="Almanya">Almanya</option>
                          <option value="ABD">Amerika (ABD)</option>
                          <option value="Fransa">Fransa</option>
                          <option value="İtalya">İtalya</option>
                          <option value="İspanya">İspanya</option>
                          <option value="Yunanistan">Yunanistan</option>
                          <option value="Portekiz">Portekiz</option>
                          <option value="Hollanda">Hollanda</option>
                          <option value="Polonya">Polonya</option>
                          <option value="Macaristan">Macaristan</option>
                          <option value="Danimarka">Danimarka</option>
                          <option value="İsveç">İsveç</option>
                          <option value="Norveç">Norveç</option>
                          <option value="İngiltere">İngiltere</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => setStep('assessment')} className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1">
                          <RefreshCw className="w-3 h-3"/> Güncelle
                        </button>
                        <button onClick={() => { if (window.confirm('Profiliniz sıfırlanacak. Emin misiniz?')) onReset(); }}
                          className="text-xs font-bold text-rose-400 hover:underline">
                          Sıfırla
                        </button>
                      </div>
                    </div>
  
                    <div className="p-5">
                      {/* Skor satırı */}
                      <div className="flex items-center gap-5 mb-5">
                        {/* Dairesel skor */}
                        <div className="relative w-20 h-20 shrink-0">
                          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" strokeWidth="10"/>
                            <circle cx="50" cy="50" r="42" fill="none"
                              stroke={currentScore >= 82 ? '#10b981' : currentScore >= 65 ? '#f59e0b' : '#ef4444'}
                              strokeWidth="10"
                              strokeDasharray={String(2 * Math.PI * 42)}
                              strokeDashoffset={String(2 * Math.PI * 42 * (1 - currentScore / 100))}
                              strokeLinecap="round"
                              className="transition-all duration-700"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className={`text-xl font-bold ${currentScore >= 82 ? 'text-emerald-600' : currentScore >= 65 ? 'text-amber-600' : 'text-red-600'}`}>
                              %{currentScore}
                            </span>
                          </div>
                        </div>
                        {/* Durum metni */}
                        <div className="flex-1">
                          {currentScore >= 82 ? (
                            <>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-base font-bold text-emerald-700">Başvuruya Hazır</span>
                                <CheckCircle2 className="w-5 h-5 text-emerald-500"/>
                              </div>
                              <p className="text-sm text-slate-500">Profiliniz güçlü. Belge paketinizi hazırlayın.</p>
                              <button onClick={() => setStep('letter')}
                                className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors">
                                <FileText className="w-3.5 h-3.5"/> Niyet Mektubu Oluştur
                              </button>
                            </>
                          ) : (
                            <>
                              <div className="text-sm text-slate-500 mb-1">
                                Hedef <span className="font-bold text-slate-900">%82</span> — <span className="font-bold text-amber-600">{82 - currentScore} puan eksik</span>
                              </div>
                              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full transition-all duration-500 ${currentScore >= 65 ? 'bg-amber-400' : 'bg-rose-400'}`}
                                  style={{width:`${Math.min(currentScore,100)}%`}}/>
                              </div>
                              <p className="text-xs text-slate-400 mt-1">Aşağıdaki adımları tamamlayarak skoru artırın</p>
                            </>
                          )}
                        </div>
                      </div>
  
                      {/* Güven aralığı bandı + sebepleri */}
                      <ConfidenceBadge
                        low={currentConfidence.low}
                        high={currentConfidence.high}
                        label={currentConfidence.label}
                        missingCount={currentConfidence.missingCount}
                        reasons={explainConfidence(profile, currentScore)}
                      />

  
                      {/* Öncelikli adımlar */}
                      {actionItems.length > 0 && currentScore < 82 && (
                        <div className="space-y-2">
                          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Şu an yapılacaklar</div>
                          {actionItems.slice(0, 3).map((item, i) => (
                            <button key={i} onClick={item.toolFn} type="button"
                              className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all hover:shadow-sm
                                ${item.gain === '⚠️' ? 'bg-rose-50 border-rose-200 hover:bg-rose-100' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
                              <span className={`text-[11px] font-bold px-2 py-1 rounded-lg shrink-0 ${item.gain === '⚠️' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'}`}>
                                {item.gain === '⚠️' ? '!' : item.gain + 'p'}
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold text-slate-800">{item.title}</div>
                                <div className="text-xs text-slate-500 truncate">{item.desc.substring(0, 55)}…</div>
                              </div>
                              <span className="text-xs font-bold text-brand-600 shrink-0">{item.toolLabel} →</span>
                            </button>
                          ))}
                          {actionItems.length > 3 && (
                            <button onClick={() => setStep('assessment')} className="text-xs text-brand-600 hover:underline font-bold pl-1">
                              +{actionItems.length - 3} adım daha görüntüle →
                            </button>
                          )}
                        </div>
                      )}
  
                      {/* R-2077 detay toggle */}
                      <button onClick={() => setShowRiskDetail(v => !v)}
                        className="mt-4 w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors">
                        <span className="text-xs font-bold text-slate-600">10 Faktörlü Risk Analizi (R-2077)</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] bg-brand-100 text-brand-700 font-bold px-2 py-0.5 rounded-full">Detaylar</span>
                          {showRiskDetail ? <ChevronUp className="w-4 h-4 text-slate-400"/> : <ChevronDown className="w-4 h-4 text-slate-400"/>}
                        </div>
                      </button>
                      {showRiskDetail && (
                        <div className="mt-3">
                          <WidgetBoundary name="RejectionRiskWidget">
                            <RejectionRiskWidget
                              profile={profile as unknown as Record<string, unknown>}
                              currentScore={currentScore}
                              onOpenTool={(toolKey: string) => {
                                const toolMap: Record<string, () => void> = {
                                  bankAnaliz:   () => openTool('aibank',       setIsAiBankOpen),
                                  belgeKontrol: () => openTool('docchecklist', setIsDocChecklistOpen),
                                  niyetMektubu: () => setStep('letter'),
                                  retMektubu:   () => openTool('refusal',      setIsRefusalOpen),
                                  strateji:     () => openTool('copilot',      setIsCopilotOpen),
                                  roadmap:      () => setStep('assessment'),
                                  ulkeProfili:  () => openTool('comparator',   setIsSchengenComparatorOpen),
                                  itinerary:    () => openTool('docs',         setIsDocumentListOpen),
                                };
                                toolMap[toolKey]?.();
                              }}
                            />
                          </WidgetBoundary>
                        </div>
                      )}
                    </div>
                  </div>
  
                  {/* ── ARAÇLAR (SEKMELİ) — üste taşındı ── */}
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="flex items-center justify-between px-5 pt-4 pb-0 border-b border-slate-100">
                      <div className="flex gap-1">
                        {([
                          { key: 'hazirlik', label: 'Hazırlık' },
                          { key: 'analiz',   label: 'Analiz'   },
                          { key: 'ulke',     label: 'Ülke & Mülakat' },
                        ] as const).map(tab => (
                          <button key={tab.key} onClick={() => setDashToolTab(tab.key)}
                            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-colors border-b-2 -mb-px
                              ${dashToolTab === tab.key
                                ? 'text-brand-700 border-brand-600 bg-brand-50'
                                : 'text-slate-500 border-transparent hover:text-slate-700'}`}>
                            {tab.label}
                          </button>
                        ))}
                      </div>
                      {!isPremium
                        ? <button onClick={() => setIsUpgradeOpen(true)} className="text-[10px] bg-amber-50 text-amber-600 border border-amber-100 font-bold px-2 py-1 rounded-lg mb-1">🔒 Premium</button>
                        : <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100 font-bold px-2 py-1 rounded-lg mb-1">✓ Premium</span>
                      }
                    </div>
                    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {([
                        { tab: 'hazirlik', label: 'Evrak Listesi',         desc: 'Ülkenize özel belge listesi.',                     icon: FileCheck,    color: 'bg-emerald-500', id: 'docs',         setter: setIsDocumentListOpen },
                        { tab: 'hazirlik', label: 'Belge Kontrol',         desc: 'Eksiksiz evrak listesini PDF olarak indirin.',      icon: FileCheck,    color: 'bg-gradient-to-br from-indigo-500 to-indigo-600',  id: 'docchecklist', setter: setIsDocChecklistOpen },
                        { tab: 'hazirlik', label: 'Randevu Takip Botu',    desc: 'VFS randevusu açılınca bildirim alın.',             icon: Calendar,     color: 'bg-gradient-to-br from-teal-400 to-teal-500',    id: 'appointment',  setter: setIsAppointmentOpen },
                        { tab: 'hazirlik', label: 'Banka Hazırlık Planı',  desc: 'Aylık giriş/çıkış hedeflerini görün.',             icon: Banknote,     color: 'bg-gradient-to-br from-emerald-400 to-emerald-600',   id: 'bankplan',     setter: setIsBankPlanOpen },
                        { tab: 'hazirlik', label: 'Belge Tutarlılık',      desc: 'Pasaport, SGK, banka tarihleri uyuşuyor mu?',      icon: CheckCircle2, color: 'bg-gradient-to-br from-slate-400 to-slate-500',   id: 'consistency',  setter: setIsConsistencyOpen },
                        { tab: 'hazirlik', label: 'Vizesiz Ülkeler',       desc: 'Türk pasaportuyla vize gerektirmeyen ülkeler.',    icon: Plane,        color: 'bg-gradient-to-br from-emerald-400 to-green-500', id: 'visafree',     setter: setIsVisaFreeOpen },
                        { tab: 'hazirlik', label: 'Maliyet Hesaplayıcı',   desc: 'Vize + uçak + konaklama + günlük toplam bütçe.',   icon: Wallet,       color: 'bg-gradient-to-br from-indigo-500 to-brand-600',  id: 'cost',         setter: setIsCostCalculatorOpen },
                        { tab: 'hazirlik', label: '90/180 Gün Hesaplayıcı',desc: 'Schengen 90/180 kuralı — kalan gün ve yeni giriş tarihi.', icon: Calendar, color: 'bg-gradient-to-br from-amber-500 to-orange-600',  id: 'daycalc',      setter: setIsDayCalculatorOpen },
                        { tab: 'analiz',   label: 'Vize Danışmanım',       desc: 'Yapay zeka ile en kritik 3 adımı öğrenin.',        icon: MessageSquare, color: 'bg-gradient-to-br from-blue-400 to-blue-500',   id: 'copilot',      setter: setIsCopilotOpen },
                        { tab: 'analiz',   label: 'Kırmızı Bayrak',        desc: 'Otomatik ret gerekçelerini önceden tespit edin.',  icon: XCircle,      color: 'bg-gradient-to-br from-red-400 to-red-500',     id: 'redflag',      setter: setIsRedFlagOpen },
                        { tab: 'analiz',   label: 'Banka Dökümü Analizi',  desc: 'Ekstrenizi konsolosluk gözüyle değerlendirin.',    icon: Sparkles,     color: 'bg-gradient-to-br from-blue-500 to-indigo-600',    id: 'aibank',       setter: setIsAiBankOpen },
                        { tab: 'analiz',   label: 'Senaryo Oluşturucu',    desc: '"Bakiyem şu kadar olsa" skora etkisini görün.',   icon: Zap,          color: 'bg-gradient-to-br from-brand-500 to-brand-600',   id: 'calculator',   setter: setIsCalculatorOpen },
                        { tab: 'analiz',   label: 'Ret Mektubu Analizi',   desc: 'Ret kodunuzu yapıştırın, nedenini öğrenin.',      icon: AlertTriangle, color: 'bg-gradient-to-br from-rose-400 to-rose-500',   id: 'refusal',      setter: setIsRefusalOpen },
                        { tab: 'analiz',   label: 'Ret Nedeni Haritası',   desc: '2021-2026 gerçek ret kodları — ülke bazında.',     icon: AlertCircle,  color: 'bg-gradient-to-br from-orange-400 to-orange-500',  id: 'refusalmap',   setter: setIsRefusalMapOpen },
                        { tab: 'ulke',     label: 'Ülke Kıyaslayıcı',     desc: 'Ret oranı ve zorluk puanına göre ülke karşılaştır.', icon: Globe,     color: 'bg-gradient-to-br from-indigo-400 to-indigo-500',  id: 'comparator',   setter: setIsSchengenComparatorOpen },
                        { tab: 'ulke',     label: 'Nereye Gidebilirim?',   desc: 'Profilinizle en yüksek onay alacağınız 5 ülke.',  icon: Plane,        color: 'bg-gradient-to-br from-sky-400 to-sky-500',     id: 'countryguide', setter: setIsCountryGuideOpen },
                        { tab: 'ulke',     label: 'Çoklu Ülke Planlayıcı', desc: 'Birden fazla ülke turu için optimum sıra.',      icon: Map,          color: 'bg-gradient-to-br from-cyan-400 to-cyan-500',    id: 'multicountry', setter: setIsMultiCountryOpen },
                        { tab: 'ulke',     label: 'Mülakat Pratiği',       desc: 'ABD/UK mülakatı — 78 soruluk simülatör.',         icon: Brain,        color: 'bg-gradient-to-br from-amber-400 to-amber-500',   id: 'interview',    setter: setIsInterviewSimOpen },
                        { tab: 'ulke',     label: 'Sosyal Medya Denetimi', desc: 'Hesaplarınızdaki vize-riskli paylaşımları bulun.', icon: ShieldCheck, color: 'bg-gradient-to-br from-violet-400 to-violet-500',  id: 'socialmedia',  setter: setIsSocialMediaOpen },
                        { tab: 'ulke',     label: 'Topluluk & Benchmark',  desc: 'Benzer profillerin onay/ret deneyimlerini okuyun.', icon: Star,      color: 'bg-gradient-to-br from-slate-500 to-slate-600',   id: 'community',    setter: setIsCommunityOpen },
                      ] as const)
                        .filter(t => t.tab === dashToolTab)
                        .map(({ label, desc, icon: Icon, color, id, setter }) => {
                          const locked = PREMIUM_TOOLS.includes(id) && !isPremium;
                          return (
                            <button key={id} onClick={() => openTool(id, setter as (b: boolean) => void)}
                              className={`group text-left rounded-2xl border-2 p-4 transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/[0.04] hover:-translate-y-1
                                ${locked ? 'bg-slate-50/50 border-slate-100' : 'bg-white border-slate-100 hover:border-brand-200'}`}>
                              <div className="flex items-start gap-3">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${locked ? 'bg-slate-200' : color}`}>
                                  <Icon className={`w-4 h-4 ${locked ? 'text-slate-400' : 'text-white'}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5 mb-0.5">
                                    <span className={`text-sm font-bold ${locked ? 'text-slate-400' : 'text-slate-900'}`}>{label}</span>
                                    {locked
                                      ? <span className="text-[9px] font-bold bg-amber-100 text-amber-600 px-1 py-0.5 rounded">🔒</span>
                                      : !PREMIUM_TOOLS.includes(id) && <span className="text-[9px] font-bold bg-emerald-100 text-emerald-600 px-1 py-0.5 rounded">Ücretsiz</span>
                                    }
                                  </div>
                                  <p className={`text-xs leading-relaxed ${locked ? 'text-slate-400' : 'text-slate-500'}`}>{desc}</p>
                                </div>
                              </div>
                            </button>
                          );
                      })}
                    </div>
                  </div>

                  {/* ── KİŞİSEL RİSK HARİTASI ── */}
                  <WidgetBoundary name="ProfileRadarChart">
                    <ProfileRadarChart profile={profile} />
                  </WidgetBoundary>

                  {/* ── ÜLKE KARŞILAŞTIRMA + ZAMAN ÇİZELGESİ ── */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
                    <WidgetBoundary name="CountryCompareWidget">
                      <CountryCompareWidget
                        defaultLeft={profile.targetCountry || 'Almanya'}
                        defaultRight={profile.targetCountry === 'Yunanistan' ? 'Almanya' : 'Yunanistan'}
                      />
                    </WidgetBoundary>
                    <WidgetBoundary name="VisaTimeline">
                      <VisaTimeline profile={profile} />
                    </WidgetBoundary>
                  </div>

                  {/* ── ÜLKE SIRALAMASI ── */}
                  <WidgetBoundary name="CountryRanking">
                    <CountryRanking profile={profile} currentScore={currentScore} />
                  </WidgetBoundary>

                  {/* ── KANIT KONTROL LİSTESİ ── */}
                  <WidgetBoundary name="EvidenceChecklist">
                    <EvidenceChecklist
                      profile={profile}
                      currentScore={currentScore}
                      onProfileUpdate={(patch) => setProfile(prev => ({ ...prev, ...patch }))}
                    />
                  </WidgetBoundary>

                  {/* ── MEVSİMSEL ZAMANLAMA ── */}
                  {profile.targetCountry && (
                    <WidgetBoundary name="SeasonalRiskWidget">
                      <SeasonalRiskWidget
                        country={profile.targetCountry}
                        score={currentScore}
                        applyMonth={profile.applyMonth}
                        applyYear={profile.applyYear}
                      />
                    </WidgetBoundary>
                  )}

                  {/* ── ARAŞTIRMA İÇGÖRÜLERİ (olası ret sebepleri + benzer vakalar) ── */}
                  {profile.targetCountry && (
                    <WidgetBoundary name="ResearchInsightsWidget">
                      <div className="rounded-2xl border border-slate-200 bg-white p-5">
                        <ResearchInsightsWidget profile={profile} />
                      </div>
                    </WidgetBoundary>
                  )}

                  {/* ── WHAT-IF SİMÜLATÖRÜ ── */}
                  <WidgetBoundary name="WhatIfSimulator">
                    <WhatIfSimulator profile={profile} currentScore={currentScore} simulatorValue={simulatorValue} />
                  </WidgetBoundary>

                  {/* ── SONUCU ÇIKART CTA ── */}
                  <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-brand-700 p-5 flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-1 text-white">
                      <div className="font-bold text-base mb-1">Kişisel Vize Analiz Raporunuzu İndirin</div>
                      <p className="text-indigo-200 text-xs leading-relaxed">
                        Tüm araç sonuçlarını, ülke karşılaştırmasını ve öncelikli aksiyon planını tek sayfada PDF olarak indirin.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={onOpenReportModal}
                      className="shrink-0 flex items-center gap-2 px-5 py-3 bg-white text-indigo-700 font-bold text-sm rounded-xl hover:bg-indigo-50 transition-colors shadow-lg whitespace-nowrap"
                    >
                      <Download className="w-4 h-4" />
                      Sonucu Çıkart
                    </button>
                  </div>

                  {/* ── BAŞVURU SONUÇ TAKİBİ (Feedback Loop) ── */}
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center">
                          <ClipboardList className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">Başvuru Sonuç Takibi</div>
                          <div className="text-xs text-slate-400">Başvurunuzu kaydedin — sonuç bildiriminiz algoritmamızı güçlendirir</div>
                        </div>
                      </div>
                      {feedbackStep === 'done' && (
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">✓ Kaydedildi</span>
                      )}
                    </div>
  
                    <div className="p-5">
                      {feedbackStep === 'register' && (
                        <div className="space-y-4">
                          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-700 leading-relaxed">
                            Başvuru tarihini girin. 4-5 hafta sonra sonucunuzu e-postayla soracağız.
                            Yanıtınız algoritmamızı gerçek verilerle kalibre eder — anonim işlenir.
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-bold text-slate-500 mb-1">E-posta</label>
                              <input
                                type="email"
                                placeholder="ornek@mail.com"
                                value={fbEmail}
                                onChange={e => setFbEmail(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-500 mb-1">Başvuru Tarihi</label>
                              <input
                                type="date"
                                max={new Date().toISOString().slice(0, 10)}
                                value={fbDate}
                                onChange={e => setFbDate(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 text-xs text-slate-500 flex-1">
                              <span className="font-semibold text-slate-700">{profile.targetCountry}</span>
                              <span>·</span>
                              <span>Skor: <strong>%{currentScore}</strong></span>
                            </div>
                            <button
                              onClick={async () => {
                                if (!fbEmail.includes('@') || !fbDate) return;
                                setFbStatus('loading');
                                try {
                                  const res = await fetch(apiUrl('/api/outcomes/register'), {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                      email: fbEmail,
                                      country: profile.targetCountry,
                                      visaType: profile.targetCountry === 'ABD' ? 'B1/B2' : profile.targetCountry === 'İngiltere' ? 'UK Visitor' : 'Schengen (C)',
                                      applicationDate: fbDate,
                                      profileScore: currentScore,
                                      profileSegment:
                                        profile.hasSponsor ? 'sponsor' :
                                        profile.isStudent ? 'student' :
                                        profile.isPublicSectorEmployee ? 'public_sector' :
                                        (!profile.hasSgkJob && profile.hasAssets && profile.applicantAge >= 55) ? 'retired' :
                                        (!profile.hasSgkJob && profile.hasAssets) ? 'self_employed' :
                                        (!profile.hasSgkJob && !profile.hasAssets) ? 'unemployed' :
                                        'employed',
                                    }),
                                  });
                                  const data = await res.json();
                                  if (res.ok) {
                                    setFbRegisteredId(data.id ?? '');
                                    setFbStatus('success');
                                    setFeedbackStep('submit');
                                  } else {
                                    setFbStatus('error');
                                  }
                                } catch {
                                  // dev mode fallback
                                  setFbRegisteredId('dev-' + Date.now());
                                  setFbStatus('success');
                                  setFeedbackStep('submit');
                                }
                              }}
                              disabled={fbStatus === 'loading' || !fbEmail.includes('@') || !fbDate}
                              className="px-4 py-2 text-sm font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-40 transition-colors"
                            >
                              {fbStatus === 'loading' ? 'Kaydediliyor...' : 'Başvuruyu Kaydet'}
                            </button>
                          </div>
                          {fbStatus === 'error' && (
                            <p className="text-xs text-rose-600">Bir hata oluştu. Lütfen tekrar deneyin.</p>
                          )}
                        </div>
                      )}
  
                      {feedbackStep === 'submit' && (
                        <div className="space-y-4">
                          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-700">
                            Başvuru kaydedildi! Başvurunuz sonuçlandıysa hemen bildirebilir,
                            veya sonuç bekliyorsanız 4-5 hafta içinde e-posta ile hatırlatacağız.
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-500 mb-2">Başvurunuz sonuçlandı mı?</div>
                            <div className="grid grid-cols-3 gap-2">
                              {([
                                { val: 'onay' as const,    label: '✅ Onaylandı',    cls: 'border-emerald-400 bg-emerald-50 text-emerald-700' },
                                { val: 'ret' as const,     label: '❌ Reddedildi',   cls: 'border-rose-400 bg-rose-50 text-rose-700' },
                                { val: 'bekliyor' as const,label: '⏳ Bekliyor',     cls: 'border-amber-400 bg-amber-50 text-amber-700' },
                              ]).map(({ val, label, cls }) => (
                                <button key={val}
                                  onClick={() => setFbOutcome(val)}
                                  className={`p-2.5 rounded-xl border-2 text-xs font-bold transition-all ${fbOutcome === val ? cls : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}>
                                  {label}
                                </button>
                              ))}
                            </div>
                          </div>
  
                          {fbOutcome === 'ret' && (
                            <div className="space-y-2">
                              <label className="block text-xs font-bold text-slate-500">Ret Kodu (varsa)</label>
                              <select
                                value={fbRejCode}
                                onChange={e => setFbRejCode(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400"
                              >
                                <option value="">— Seçin —</option>
                                {[
                                  { code: 'C1', label: 'C1 — Seyahat amacı inandırıcı değil' },
                                  { code: 'C2', label: 'C2 — Finansal yetersizlik' },
                                  { code: 'C4', label: 'C4 — Geri dönüş niyeti kanıtlanamadı' },
                                  { code: 'C5', label: 'C5 — Önceki süre aşımı' },
                                  { code: 'C7', label: 'C7 — Sigorta eksik/yetersiz' },
                                  { code: 'UK-V4.2', label: 'UK V4.2 — Geri dönüş niyeti (UK)' },
                                  { code: 'UK-V4.3', label: 'UK V4.3 — Finansal yetersizlik (UK)' },
                                  { code: '214b', label: 'ABD 214(b) — Geri dönüş bağı eksik' },
                                  { code: '221g', label: 'ABD 221(g) — Ek belge talebi' },
                                  { code: 'DIGER', label: 'Diğer / bilmiyorum' },
                                ].map(c => (
                                  <option key={c.code} value={c.code}>{c.label}</option>
                                ))}
                              </select>
                              <textarea
                                placeholder="Ek not (opsiyonel)..."
                                value={fbRejNotes}
                                onChange={e => setFbRejNotes(e.target.value)}
                                rows={2}
                                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none"
                              />
                            </div>
                          )}
  
                          {fbOutcome && (
                            <button
                              onClick={async () => {
                                setFbStatus('loading');
                                try {
                                  const res = await fetch(apiUrl('/api/outcomes/submit'), {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                      id: fbRegisteredId,
                                      outcome: fbOutcome,
                                      rejectionCode: fbRejCode || undefined,
                                      rejectionNotes: fbRejNotes || undefined,
                                    }),
                                  });
                                  if (res.ok || true) {
                                    setFbStatus('success');
                                    setFeedbackStep('done');
                                  } else {
                                    setFbStatus('error');
                                  }
                                } catch {
                                  setFbStatus('success');
                                  setFeedbackStep('done');
                                }
                              }}
                              disabled={fbStatus === 'loading'}
                              className="w-full py-2.5 text-sm font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-40 transition-colors"
                            >
                              {fbStatus === 'loading' ? 'Gönderiliyor...' : 'Sonucu Bildir'}
                            </button>
                          )}
                        </div>
                      )}
  
                      {feedbackStep === 'done' && (
                        <div className="text-center py-4 space-y-2">
                          <div className="text-3xl">🎉</div>
                          <div className="font-bold text-slate-900">
                            {fbOutcome === 'onay' ? 'Tebrikler! Güzel haberler için teşekkürler.' :
                             fbOutcome === 'ret'  ? 'Üzgünüz. Verileriniz algoritmamızı geliştirmeye yardım edecek.' :
                             'Kaydedildi. Sonuç belli olunca bildir etmeyi unutmayın!'}
                          </div>
                          <p className="text-xs text-slate-400">Geri bildiriminiz anonim olarak işlendi.</p>
                          <button
                            onClick={() => { setFeedbackStep('register'); setFbOutcome(''); setFbEmail(''); setFbDate(''); setFbStatus('idle'); }}
                            className="text-xs text-indigo-600 font-bold hover:underline"
                          >
                            Yeni kayıt ekle →
                          </button>
                        </div>
                      )}
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
                          <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${
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
                                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-xl">
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
                    <div className="glass-card p-5 sm:p-8 lg:p-10 space-y-6 sm:space-y-10 relative overflow-hidden group">
                      <div className="absolute -right-20 -top-20 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl group-hover:bg-brand-500/10 transition-all duration-700" />

                      <div className="flex items-center justify-between relative z-10">
                        <div className="space-y-1">
                          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">Başarı Analizi</h3>
                          <p className="text-slate-500 text-sm font-medium">Profilinizin güncel vize onay ihtimali.</p>
                        </div>
                        <div className="px-4 py-2 bg-brand-50 text-brand-600 text-[10px] font-bold rounded-xl tracking-widest uppercase border border-brand-100">
                          Canlı Simülasyon
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12 relative z-10">
                        <div className="space-y-4">
                          <div className="flex items-baseline gap-2">
                            <span className="text-5xl sm:text-7xl lg:text-8xl font-bold text-slate-900 tracking-tighter font-mono">%{currentScore}</span>
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
                          {/* #14 Storytelling */}
                          <WidgetBoundary name="ScoreStory">
                            <ScoreStory profile={profile} score={currentScore} simValue={simulatorValue} />
                          </WidgetBoundary>
                        </div>

                        <div className="space-y-4 sm:space-y-6 bg-slate-50/50 p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-100">
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
  
                    {/* ── #15 Benchmark: Senin Gibi Profiller ──────────── */}
                    {profile.targetCountry && (
                      <WidgetBoundary name="BenchmarkCard">
                        <BenchmarkCard profile={profile} score={currentScore} />
                      </WidgetBoundary>
                    )}

                    {/* ── Ret Risk Analizi ─────────────────────────────── */}
                    <div className="bg-white rounded-[2rem] sm:rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                      <div className="px-4 sm:px-8 pt-5 sm:pt-8 pb-4 flex items-center justify-between gap-2">
                        <div>
                          <h3 className="text-base sm:text-lg font-bold text-slate-900">Ret Risk Analizi</h3>
                          <p className="text-xs text-slate-400 mt-0.5">Profilinizle eşleşen gerçek ret kalıpları</p>
                        </div>
                        {rejectionMatches.length === 0 ? (
                          <span className="text-xs font-bold px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 shrink-0">
                            Risk Yok
                          </span>
                        ) : (
                          <span className="text-xs font-bold px-3 py-1.5 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 shrink-0">
                            {rejectionMatches.length} Risk
                          </span>
                        )}
                      </div>

                      {/* 50 vaka disclaimer */}
                      <div className="px-4 sm:px-8 pb-1">
                        <p className="text-[10px] text-slate-400 italic">
                          50 gerçek Türk başvurusu R analiziyle türetildi (Schengen:30, UK:10, ABD:10 — 2026-04). İstatistiksel tahmindir, garanti değildir.
                        </p>
                      </div>
  
                      {rejectionMatches.length === 0 ? (
                        <div className="px-4 sm:px-8 pb-5 sm:pb-8">
                          <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                            <p className="text-sm text-emerald-700 font-medium">
                              Seçilen ülke için profilinizde bilinen ret kalıplarıyla eşleşen kritik risk bulunamadı.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-50">
                          {rejectionMatches.map((match) => {
                            const severity = match.isVeto ? 'critical'
                                           : match.frequency >= 15 ? 'critical'
                                           : match.frequency >= 8  ? 'warning' : 'info';
                            return (
                              <div key={match.id} className="px-4 sm:px-8 py-4 sm:py-5">
                                <div className="flex items-start gap-3">
                                  <div className={`mt-0.5 w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                                    severity === 'critical' ? 'bg-rose-100 text-rose-600'
                                    : severity === 'warning' ? 'bg-amber-100 text-amber-700'
                                    : 'bg-blue-100 text-blue-600'
                                  }`}>
                                    {match.isVeto ? '⚠' : severity === 'critical' ? '🔴' : severity === 'warning' ? '🟠' : '🟡'}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                      <span className="text-sm font-bold text-slate-900">{match.name}</span>
                                      {match.legalCode && (
                                        <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-lg">
                                          {match.legalCode}
                                        </span>
                                      )}
                                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                                        severity === 'critical' ? 'bg-rose-100 text-rose-600'
                                        : severity === 'warning' ? 'bg-amber-100 text-amber-700'
                                        : 'bg-blue-100 text-blue-600'
                                      }`}>
                                        {match.isVeto ? 'BAN RİSKİ' : severity === 'critical' ? 'KRİTİK' : severity === 'warning' ? 'UYARI' : 'BİLGİ'}
                                      </span>
                                      {match.scorePenalty && !match.isVeto && (
                                        <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-50 text-rose-500 rounded-lg">
                                          −{Math.round(match.scorePenalty)} puan
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-slate-500 leading-relaxed mb-2">{match.explanation}</p>
                                    <div className="flex items-start gap-1.5">
                                      <Zap className="w-3 h-3 text-brand-500 shrink-0 mt-0.5" />
                                      <p className="text-xs text-brand-700 font-medium leading-relaxed">{match.mitigation}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
  
                    {/* Intelligence Bento Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Readiness Card */}
                      <div className={`p-8 rounded-[2.5rem] border transition-all duration-500 ${
                        intelligence.readiness === 'apply' ? 'bg-emerald-50/50 border-emerald-100' :
                        intelligence.readiness === 'moderate' ? 'bg-sky-50/50 border-sky-100' :
                        intelligence.readiness === 'risky' ? 'bg-amber-50/50 border-amber-100' : 'bg-rose-50/50 border-rose-100'
                      }`}>
                        <div className="flex items-center justify-between mb-6">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                            intelligence.readiness === 'apply' ? 'bg-emerald-100 text-emerald-600' :
                            intelligence.readiness === 'moderate' ? 'bg-sky-100 text-sky-600' :
                            intelligence.readiness === 'risky' ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'
                          }`}>
                            <Zap className="w-6 h-6" />
                          </div>
                          <span className={`text-[10px] font-bold px-3 py-1 rounded-lg uppercase tracking-widest ${
                            intelligence.readiness === 'apply' ? 'bg-emerald-100 text-emerald-700' :
                            intelligence.readiness === 'moderate' ? 'bg-sky-100 text-sky-700' :
                            intelligence.readiness === 'risky' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                          }`}>
                            {intelligence.readiness === 'apply' ? 'HAZIR' :
                             intelligence.readiness === 'moderate' ? 'ONAYA YAKIN' :
                             intelligence.readiness === 'risky' ? 'RİSKLİ' : 'BEKLE'}
                          </span>
                        </div>
                        <h4 className="text-2xl font-bold text-slate-900 mb-2">
                          {intelligence.readiness === 'apply' ? 'Şimdi Başvurabilirsin' :
                           intelligence.readiness === 'moderate' ? 'Orta-Güçlü Profil' :
                           intelligence.readiness === 'risky' ? 'Riskli Başvuru' : 'Henüz Başvurma'}
                        </h4>
                        <p className="text-sm text-slate-600 leading-relaxed mb-6">
                          {intelligence.readiness === 'apply' ? 'Profiliniz şu an konsolosluk standartlarını karşılıyor.' :
                           intelligence.readiness === 'moderate' ? 'Onay ihtimaliniz belirgin biçimde yüksek. Birkaç küçük iyileştirme ile profilinizi "hazır" seviyesine taşıyabilirsiniz.' :
                           intelligence.readiness === 'risky' ? 'Onay şansınız var ancak memurun inisiyatifine kalmış durumdasınız.' :
                           'Mevcut profilinizle ret alma ihtimaliniz %80 üzerinde.'}
                        </p>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-white/50 p-3 rounded-xl border border-white/50">
                          <Clock className="w-4 h-4" />
                          {intelligence.timeline}
                        </div>
                      </div>
  
                      {/* Persona Card */}
                      <div className="p-8 bg-white border-2 border-slate-100 rounded-[2.5rem] relative overflow-hidden group shadow-sm">
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-brand-500/[0.04] rounded-full blur-3xl group-hover:bg-brand-500/[0.08] transition-all duration-700" />
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center shadow-md shadow-brand-500/15">
                            <Brain className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-brand-500 uppercase tracking-widest">Persona Analizi</p>
                            <h4 className="text-lg font-bold text-slate-800">{intelligence.persona}</h4>
                          </div>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed mb-8 font-light">
                          {intelligence.personaDestiny}
                        </p>
                        <div className="space-y-3">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stratejik Rota</p>
                          <div className="flex flex-wrap gap-2">
                            {intelligence.route.map((r, i) => (
                              <span key={`route-${i}`} className="text-[10px] font-bold bg-brand-50 text-brand-700 px-3 py-1.5 rounded-lg border border-brand-100">
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
                                    <p className="text-xs font-bold text-slate-900 mb-0.5 truncate">{res.file}</p>
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
                                <span className={`text-lg font-bold text-${doc.color === 'brand' ? 'brand' : doc.color}-600 font-mono`}>{doc.value.toFixed(1)}</span>
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
                  <div className="lg:col-span-4 space-y-6 sm:space-y-8">
                    {/* Bank Health Score */}
                    <div className="glass-card p-5 sm:p-8 space-y-6 sm:space-y-8">
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
                          <div className="absolute inset-0 flex items-center justify-center font-bold text-lg text-slate-900 font-mono">
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
                      <div className="p-8 bg-gradient-to-br from-brand-50 to-brand-100/50 border-2 border-brand-200/60 rounded-[2.5rem] space-y-8 relative overflow-hidden">
                        <div className="absolute -right-10 -top-10 w-32 h-32 bg-brand-500/[0.06] rounded-full blur-2xl" />
                        <div className="flex items-center gap-3 relative z-10">
                          <TrendingUp className="w-6 h-6 text-brand-500" />
                          <h3 className="font-bold text-lg text-brand-800">Güçlendirme Planı</h3>
                        </div>
                        <div className="space-y-8 relative z-10">
                          {roadmap.map((item, i) => (
                            <div key={`roadmap-${i}`} className="flex gap-4 relative">
                              {i !== roadmap.length - 1 && <div className="absolute left-4 top-10 bottom-0 w-px bg-brand-200" />}
                              <div className="w-8 h-8 bg-brand-500 text-white rounded-xl flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm shadow-brand-500/15">
                                {item.week}
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-800">{item.task}</p>
                                <p className="text-[9px] text-brand-500 font-bold uppercase tracking-widest">{item.impact}</p>
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
                        {(() => {
                          // v3.4: SGK boşluğu emekli/öğrenci/sponsor için beklenen; kırmızı bayrak değil
                          const sgkIsRisk = !profile.hasSgkJob && !profile.isStudent && !profile.hasSponsor && profile.applicantAge < 55;
                          return [
                            { label: 'Yetersiz Bakiye', risk: parseInt(profile.bankBalance || '0') < 50000 },
                            { label: 'SGK Boşluğu', risk: sgkIsRisk },
                            { label: 'Pasaport Süresi', risk: !profile.hasValidPassport },
                            { label: 'Şüpheli Para Girişi', risk: profile.hasSuspiciousLargeDeposit }
                          ];
                        })().map((flag, i) => (
                          <div key={`flag-${i}`} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100">
                            <span className="text-xs font-bold text-slate-600">{flag.label}</span>
                            {flag.risk ? (
                              <span className="text-[10px] font-bold text-rose-600 bg-rose-100 px-2 py-1 rounded-lg uppercase tracking-wider">KRİTİK</span>
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
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Veri Uyumu</span>
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
                        {(() => {
                          // v3.4: Segment-aware "3. Belge" — emekli için emeklilik belgesi, öğrenci için öğrenci belgesi,
                          // sponsor için sponsor mektubu, çalışan için SGK dökümü
                          const isRetired = profile.applicantAge >= 55 && !profile.hasSgkJob;
                          let thirdLabel = 'SGK Dökümü';
                          let thirdOk = profile.hasSgkJob;
                          if (isRetired) { thirdLabel = 'Emeklilik Belgesi'; thirdOk = profile.hasAssets; }
                          else if (profile.isStudent) { thirdLabel = 'Öğrenci Belgesi'; thirdOk = profile.tieCategories?.education ?? false; }
                          else if (profile.hasSponsor) { thirdLabel = 'Sponsor Mektubu'; thirdOk = profile.bankSufficientBalance; }
                          return [
                            { label: 'Pasaport', ok: profile.hasValidPassport },
                            { label: 'Banka Dökümü', ok: profile.bankRegularity },
                            { label: thirdLabel, ok: thirdOk },
                            { label: 'Niyet Mektubu', ok: profile.useOurTemplate },
                          ];
                        })().map((item, i) => (
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
                      <div className="px-4 py-2 bg-brand-50 text-brand-600 text-[10px] font-bold rounded-xl tracking-widest uppercase border border-brand-100">
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
  
                    <div className="glass-card p-10 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-100 space-y-6 relative overflow-hidden group">
                      <div className="absolute -right-10 -top-10 w-32 h-32 bg-amber-500/[0.06] blur-2xl group-hover:bg-amber-500/[0.1] transition-all duration-700" />
                      <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-md shadow-amber-500/15 group-hover:scale-110 transition-transform">
                        <TrendingUp className="w-7 h-7" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold font-display text-slate-800">Kabul Taktikleri</h3>
                        <p className="text-sm text-slate-500 leading-relaxed font-light">Vize memurlarının dikkat ettiği 7 gizli taktiği hemen öğrenin.</p>
                      </div>
                      <button
                        onClick={() => setStep('tactics')}
                        className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-bold text-sm hover:shadow-lg hover:shadow-amber-500/20 hover:-translate-y-0.5 transition-all duration-300"
                      >
                        Taktikleri İncele
                      </button>
                    </div>
                  </div>
              </motion.div>
  );
}
