// ============================================================
// AssessmentStep — Hızlı Profil Analizi
// ============================================================
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, ShieldCheck, ChevronRight, ArrowLeft, Briefcase, Home, Globe, Wallet, Zap, ChevronLeft } from 'lucide-react';
import type { ProfileData } from '../types';
import ScoreStory from '../components/ScoreStory';
import BenchmarkCard from '../components/BenchmarkCard';
import { useCountUp } from '../hooks/useCountUp';
import { ScoreRadarMini } from '../components/ScoreRadarMini';

interface ActionItem {
  title: string;
  desc: string;
  gain: string;
  toolLabel: string;
  toolFn: () => void;
  doneFn?: () => void;
}

interface ConfidenceInfo {
  label: 'Yüksek' | 'Orta' | 'Düşük';
  color: string;
  low: number;
  high: number;
  missingCount: number;
}

interface Props {
  profile: ProfileData;
  currentScore: number;
  currentConfidence: ConfidenceInfo;
  actionItems: ActionItem[];
  applicantType: string;
  onNavigate: (step: string) => void;
  onProfileUpdate: (patch: Partial<ProfileData>) => void;
  onProfileSet: React.Dispatch<React.SetStateAction<ProfileData>>;
  onApplicantTypeChange: (t: 'employer' | 'employee' | 'student' | 'self' | 'unemployed' | 'retired' | 'minor' | 'sponsor') => void;
  onProfileToggle: (key: keyof ProfileData) => void;
}

// ── Kriter tanımları (swipe card + grid ortak) ──────────────────────────────
const CRITERIA = [
  { id: 'bankSufficientBalance', label: 'Yeterli Banka Bakiyesi', icon: Wallet,       color: 'brand',  desc: 'Günlük €30 × gün sayısı eşiğini karşılıyor' },
  { id: 'hasSgkJob',             label: 'Düzenli İş & SGK',       icon: Briefcase,    color: 'emerald', desc: 'Aktif SGK kaydı veya eşdeğer istihdam kanıtı' },
  { id: 'hasHighValueVisa',      label: 'Önceki Güçlü Vizeler',   icon: ShieldCheck,  color: 'amber',   desc: 'ABD, Schengen veya İngiltere vizesi geçmişi' },
  { id: 'hasAssets',             label: 'Gayrimenkul / Araç',     icon: Home,         color: 'purple',  desc: 'Tapu, araç ruhsatı veya mülk belgesi' },
  { id: 'isMarried',             label: 'Aile Bağları (Evli)',    icon: Globe,        color: 'indigo',  desc: 'Evlilik cüzdanı + eş/çocuk ikametgâh belgesi' },
  { id: 'cleanCriminalRecord',   label: 'Temiz Adli Sicil',       icon: CheckCircle2, color: 'emerald', desc: 'Adli sicil kaydı yok (e-Devlet)' },
] as const;

// ── Mobil tek-kart swipe UI ──────────────────────────────────────────────────
function SwipeCriteriaCards({
  profile,
  onToggle,
  applicantType,
}: {
  profile: ProfileData;
  onToggle: (key: keyof ProfileData) => void;
  applicantType: string;
}) {
  const visibleCriteria = CRITERIA.filter(c => {
    if (c.id === 'hasSgkJob' && (applicantType === 'unemployed' || applicantType === 'retired' || applicantType === 'minor' || applicantType === 'student' || applicantType === 'self' || applicantType === 'employer' || applicantType === 'sponsor')) return false;
    return true;
  });
  const [idx, setIdx] = useState(0);
  const safeIdx = Math.min(idx, visibleCriteria.length - 1);
  const card = visibleCriteria[safeIdx];
  const isOn = !!profile[card.id as keyof ProfileData];
  const Icon = card.icon;

  const colorMap: Record<string, string> = {
    brand:   'from-brand-500 to-brand-700',
    emerald: 'from-emerald-500 to-emerald-700',
    amber:   'from-amber-400 to-amber-600',
    purple:  'from-purple-500 to-purple-700',
    indigo:  'from-indigo-500 to-indigo-700',
  };

  return (
    <div className="md:hidden">
      {/* Progress dots */}
      <div className="flex justify-center gap-1.5 mb-4">
        {visibleCriteria.map((c, i) => (
          <div
            key={c.id}
            className={`h-1.5 rounded-full transition-all ${
              i === safeIdx ? 'w-5 bg-slate-900' :
              !!profile[c.id as keyof ProfileData] ? 'w-2 bg-emerald-400' :
              'w-2 bg-slate-200'
            }`}
          />
        ))}
      </div>

      {/* Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={card.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.2 }}
          className={`rounded-3xl p-7 text-center ${
            isOn
              ? `bg-gradient-to-br ${colorMap[card.color]} text-white shadow-xl`
              : 'bg-white border-2 border-slate-100 text-slate-800 shadow-sm'
          }`}
        >
          <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4 ${
            isOn ? 'bg-white/20' : 'bg-slate-50'
          }`}>
            <Icon className={`w-8 h-8 ${isOn ? 'text-white' : 'text-slate-500'}`} />
          </div>
          <h3 className="text-lg font-bold mb-1">{card.label}</h3>
          <p className={`text-xs mb-6 ${isOn ? 'text-white/70' : 'text-slate-400'}`}>
            {card.desc}
          </p>
          {/* YES / NO */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => { if (isOn) onToggle(card.id as keyof ProfileData); }}
              className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all ${
                !isOn
                  ? 'bg-rose-100 text-rose-600 font-bold shadow-sm scale-105'
                  : 'bg-white/20 text-white/70 hover:bg-white/30'
              }`}
            >
              ✕  Hayır
            </button>
            <button
              type="button"
              onClick={() => { if (!isOn) onToggle(card.id as keyof ProfileData); }}
              className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all ${
                isOn
                  ? 'bg-white text-emerald-600 font-bold shadow-sm scale-105'
                  : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
              }`}
            >
              ✓  Evet
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Prev / Next */}
      <div className="flex items-center justify-between mt-4">
        <button
          type="button"
          onClick={() => setIdx(i => Math.max(0, i - 1))}
          disabled={safeIdx === 0}
          className="p-2.5 rounded-xl bg-white border border-slate-200 disabled:opacity-30 transition-opacity"
        >
          <ChevronLeft className="w-4 h-4 text-slate-600" />
        </button>
        <span className="text-xs text-slate-400 font-medium">
          {safeIdx + 1} / {visibleCriteria.length}
        </span>
        <button
          type="button"
          onClick={() => setIdx(i => Math.min(visibleCriteria.length - 1, i + 1))}
          disabled={safeIdx === visibleCriteria.length - 1}
          className="p-2.5 rounded-xl bg-white border border-slate-200 disabled:opacity-30 transition-opacity"
        >
          <ChevronRight className="w-4 h-4 text-slate-600" />
        </button>
      </div>
    </div>
  );
}

// ── Ana Bileşen ──────────────────────────────────────────────────────────────
export function AssessmentStep({
  profile, currentScore, currentConfidence, actionItems,
  applicantType, onNavigate, onProfileUpdate, onProfileSet,
  onApplicantTypeChange, onProfileToggle,
}: Props) {
  const setStep = onNavigate;
  const setApplicantType = onApplicantTypeChange;
  const setProfile = onProfileSet;
  const handleProfileToggle = onProfileToggle;

  // ── Skor animasyonu ────────────────────────────────────────────────────────
  // İlk mount: skor yüksekse 1.5s "analiz ediliyor" → countup reveal
  const [isAnalyzing, setIsAnalyzing] = useState(() => currentScore >= 15);
  const countTarget   = isAnalyzing ? 0 : currentScore;
  const displayScore  = useCountUp(countTarget, isAnalyzing ? 1 : 900);

  useEffect(() => {
    if (!isAnalyzing) return;
    const t = setTimeout(() => setIsAnalyzing(false), 1600);
    return () => clearTimeout(t);
  }, []); // mount-only

  // ── Mikro-feedback: skor delta rozeti ──────────────────────────────────────
  const prevScoreRef    = useRef(currentScore);
  const deltaTimerRef   = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [delta, setDelta] = useState<number | null>(null);

  useEffect(() => {
    if (isAnalyzing) { prevScoreRef.current = currentScore; return; }
    const diff = currentScore - prevScoreRef.current;
    if (Math.abs(diff) >= 1) {
      setDelta(diff);
      clearTimeout(deltaTimerRef.current);
      deltaTimerRef.current = setTimeout(() => setDelta(null), 2600);
    }
    prevScoreRef.current = currentScore;
  }, [currentScore]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
            <motion.div
                key="assessment"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="max-w-5xl mx-auto px-4 sm:px-0"
              >
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                  <button onClick={() => setStep('hero')} className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all">
                    <ArrowLeft className="w-5 h-5 text-slate-500" />
                  </button>
                  <div className="flex-1">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Profil Analizi</h2>
                    <p className="text-sm text-slate-500">Kriterlerinizi işaretleyin — skor anlık güncellenir.</p>
                  </div>
                  {/* Desktop: mini live skor */}
                  <div className="hidden sm:flex items-center gap-3 bg-white border-2 border-slate-100 rounded-2xl px-5 py-3 shadow-sm">
                    <div className={`text-2xl font-bold font-mono ${
                      currentScore >= 82 ? 'text-emerald-500' :
                      currentScore >= 65 ? 'text-amber-500' : 'text-rose-500'
                    }`}>
                      %{displayScore}
                    </div>
                    <div className="text-xs text-slate-400 leading-tight">
                      <div className="font-bold text-slate-800">Tahmini Skor</div>
                      <div>{currentConfidence.label} güven</div>
                    </div>
                  </div>
                </div>

                {/* Layout: form + sticky skor (desktop) */}
                <div className="flex flex-col lg:flex-row gap-8">

                {/* Sol: form alanları */}
                <div className="flex-1 space-y-8">

                {/* Profil tamamlanma çubuğu */}
                {(() => {
                  const criteriaKeys: (keyof ProfileData)[] = [
                    'bankSufficientBalance', 'hasSgkJob', 'hasHighValueVisa',
                    'hasAssets', 'isMarried', 'cleanCriminalRecord',
                    'hasTravelInsurance', 'hasValidPassport', 'purposeClear', 'noOverstayHistory',
                  ];
                  const filled = criteriaKeys.filter(k => profile[k] === true).length;
                  const total = criteriaKeys.length;
                  const pct = Math.round((filled / total) * 100);
                  return (
                    <div className="bg-white border border-slate-200 rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-slate-700">Profil Tamamlanma</span>
                        <span className={`text-sm font-bold ${pct >= 70 ? 'text-emerald-600' : pct >= 40 ? 'text-amber-600' : 'text-rose-500'}`}>{pct}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-500 ${pct >= 70 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-400' : 'bg-rose-400'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-400 mt-1.5">
                        {filled}/{total} kriter seçildi
                        {pct < 50 && ' — Daha fazla seçerek skoru artırın'}
                        {pct >= 50 && pct < 80 && ' — İyi ilerliyorsunuz'}
                        {pct >= 80 && ' — Güçlü profil!'}
                      </p>
                    </div>
                  );
                })()}
  
                <div className="space-y-10">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">1. Başvuru Tipiniz</h3>
                    <div className="flex flex-wrap gap-3">
                      {([
                        { id: 'employee',   label: 'Çalışan' },
                        { id: 'employer',   label: 'İşveren' },
                        { id: 'student',    label: 'Öğrenci' },
                        { id: 'self',       label: 'Serbest Meslek' },
                        { id: 'retired',    label: 'Emekli' },
                        { id: 'unemployed', label: 'Çalışmıyor' },
                        { id: 'sponsor',    label: 'Sponsorlu' },
                        { id: 'minor',      label: 'Reşit Olmayan' },
                      ] as const).map(({ id, label }) => (
                        <button
                          key={id}
                          onClick={() => setApplicantType(id)}
                          className={`px-6 py-4 rounded-2xl font-bold text-sm transition-all border-2 ${
                            applicantType === id
                              ? 'bg-blue-50 border-blue-600 text-blue-700'
                              : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
  
                  {/* ── #19 Conditional: applicantType-specific notice ── */}
                  {(applicantType === 'unemployed' || applicantType === 'retired' || applicantType === 'minor' || applicantType === 'employer' || applicantType === 'self' || applicantType === 'sponsor') && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 text-sm text-amber-800 font-medium flex items-start gap-2">
                      <span className="text-base mt-0.5">ℹ️</span>
                      <div>
                        {applicantType === 'unemployed' && (
                          <>SGK kriteri sizin için geçerli değil — <strong>sponsor mektubu veya aile geliri</strong> finansal bağ olarak değerlendiriliyor.</>
                        )}
                        {applicantType === 'retired' && (
                          <>Emekli profili — <strong>emekli maaşı banka dökümü, tapu/mülk belgeleri ve 55+ yaş</strong> güçlü geri dönüş sinyali sağlar. "Yaşınız" alanını doldurmayı ve mülk kriterini işaretlemeyi unutmayın.</>
                        )}
                        {applicantType === 'minor' && (
                          <>Reşit olmayan başvurucular için <strong>veli muvafakatnamesi ve okul kaydı</strong> en kritik belgelerdir.</>
                        )}
                        {applicantType === 'employer' && (
                          <>İşveren profili — <strong>vergi levhası, ticaret sicil gazetesi ve imza sirküleri</strong> şirket sahipliği için zorunludur.</>
                        )}
                        {applicantType === 'self' && (
                          <>Serbest meslek — <strong>vergi levhası, son 6 ay kazanç beyanı ve Bağ-Kur primleri</strong> ile mali durum gösterilir.</>
                        )}
                        {applicantType === 'sponsor' && (
                          <>Sponsor profili — sponsor eden kişinin <strong>SGK/banka ektresi + noter tasdikli taahhütname</strong> sunulur.</>
                        )}
                      </div>
                    </div>
                  )}
                  {(applicantType === 'student' || profile.isStudent) && (
                    <div className="bg-indigo-50 border border-indigo-200 rounded-2xl px-4 py-3 text-sm text-indigo-800 font-medium flex items-start gap-2">
                      <span className="text-base mt-0.5">🎓</span>
                      <div>Öğrenci profili aktif — <strong>okul kaydı / transkript</strong> belgesi bağ puanınıza katkı sağlıyor. SGK kriteri öğrenci için geçerli değildir.</div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">2. Temel Kriterleriniz</h3>

                    {/* ── Mobil: tek kart swipe ── */}
                    <SwipeCriteriaCards profile={profile} onToggle={handleProfileToggle} applicantType={applicantType} />

                    {/* ── Desktop: grid (md+ ) ── */}
                    <div className="hidden md:grid grid-cols-2 gap-4">
                      {CRITERIA.filter(item => {
                        if (item.id === 'hasSgkJob' && (applicantType === 'unemployed' || applicantType === 'retired' || applicantType === 'minor' || applicantType === 'student' || applicantType === 'self' || applicantType === 'employer' || applicantType === 'sponsor')) return false;
                        return true;
                      }).map((item) => (
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
  
                  {/* Algoritma v3.0 Ek Alanlar */}
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">3. Zaman Bazlı Kalibrasyonlar <span className="text-xs font-normal text-slate-400 ml-2">Opsiyonel — algoritmayı hassaslaştırır</span></h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-white border border-slate-200 rounded-2xl p-4">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Yaşınız</label>
                        <input
                          type="number"
                          min={18} max={90}
                          placeholder="28"
                          value={profile.applicantAge || ''}
                          onChange={(e) => setProfile(prev => ({ ...prev, applicantAge: parseInt(e.target.value) || 0 }))}
                          className="w-full text-2xl font-bold text-slate-900 border-none outline-none bg-transparent p-0 placeholder:text-slate-300"
                        />
                        <p className="text-xs text-slate-400 mt-1">Geri dönüş taahhüdü puanını kişiselleştirir</p>
                      </div>
                      <div className="bg-white border border-slate-200 rounded-2xl p-4">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Son Vize Yılı</label>
                        <label className="flex items-center gap-2 mb-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={profile.lastVisaYear === -1}
                            onChange={(e) => setProfile(prev => ({
                              ...prev,
                              lastVisaYear: e.target.checked ? -1 : 0,
                            }))}
                            className="w-4 h-4 accent-brand-600 rounded"
                          />
                          <span className="text-xs font-semibold text-slate-600">İlk kez başvuruyorum</span>
                        </label>
                        {profile.lastVisaYear !== -1 && (
                          <input
                            type="number"
                            min={2000} max={new Date().getFullYear()}
                            placeholder="örn. 2022"
                            value={profile.lastVisaYear || ''}
                            onChange={(e) => setProfile(prev => ({ ...prev, lastVisaYear: parseInt(e.target.value) || 0 }))}
                            className="w-full text-2xl font-bold text-slate-900 border-none outline-none bg-transparent p-0 placeholder:text-slate-300"
                          />
                        )}
                        {profile.lastVisaYear === -1 && (
                          <p className="text-sm font-bold text-brand-600">Daha önce vize almadım</p>
                        )}
                        <p className="text-xs text-slate-400 mt-1">
                          {profile.lastVisaYear === -1
                            ? 'İlk başvuru — önceki vize puanı hesaba katılmaz'
                            : 'Eski vize puanı zamanla azalır (temporal decay)'}
                        </p>
                      </div>
                      <div className="bg-white border border-slate-200 rounded-2xl p-4">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Son Red Yılı</label>
                        <label className="flex items-center gap-2 mb-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={profile.lastRejectionYear === -1}
                            onChange={(e) => setProfile(prev => ({
                              ...prev,
                              lastRejectionYear: e.target.checked ? -1 : 0,
                            }))}
                            className="w-4 h-4 accent-brand-600 rounded"
                          />
                          <span className="text-xs font-semibold text-slate-600">Hiç red almadım</span>
                        </label>
                        {profile.lastRejectionYear !== -1 && (
                          <input
                            type="number"
                            min={2000} max={new Date().getFullYear()}
                            placeholder="örn. 2020"
                            value={profile.lastRejectionYear || ''}
                            onChange={(e) => setProfile(prev => ({ ...prev, lastRejectionYear: parseInt(e.target.value) || 0 }))}
                            className="w-full text-2xl font-bold text-slate-900 border-none outline-none bg-transparent p-0 placeholder:text-slate-300"
                          />
                        )}
                        {profile.lastRejectionYear === -1 && (
                          <p className="text-sm font-bold text-emerald-600">Temiz geçmiş ✓</p>
                        )}
                        <p className="text-xs text-slate-400 mt-1">
                          {profile.lastRejectionYear === -1
                            ? 'Red geçmişi yok — ceza puanı uygulanmaz'
                            : 'Eski ret cezası yıllar geçtikçe azalır'}
                        </p>
                      </div>
                    </div>

                    {/* #16 Mesleki kıdem slider — işveren / çalışan için */}
                    {(applicantType === 'employer' || applicantType === 'employee' || applicantType === 'self') && (
                      <div className="mt-4 bg-white border border-slate-200 rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Mevcut İşte Kaç Yıl?
                          </label>
                          <span className={`text-sm font-bold px-2 py-0.5 rounded-lg ${
                            profile.yearsInCurrentJob >= 3 ? 'bg-emerald-100 text-emerald-700' :
                            profile.yearsInCurrentJob >= 1 ? 'bg-amber-100 text-amber-700' :
                                                              'bg-rose-100 text-rose-700'
                          }`}>
                            {profile.yearsInCurrentJob} yıl
                          </span>
                        </div>
                        <input
                          type="range"
                          min={0} max={20} step={1}
                          value={profile.yearsInCurrentJob ?? 0}
                          onChange={(e) => setProfile(prev => ({ ...prev, yearsInCurrentJob: parseInt(e.target.value) }))}
                          className="w-full accent-brand-600 h-1.5"
                        />
                        <div className="flex justify-between text-[10px] text-slate-300 mt-1">
                          <span>0</span><span>5</span><span>10</span><span>15</span><span>20</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1.5">
                          {profile.yearsInCurrentJob >= 3
                            ? '✓ 3+ yıl kıdem — profesyonel bağ puanına +5 katkı'
                            : profile.yearsInCurrentJob >= 1
                            ? '1–2 yıl kıdem — orta düzey bağ puanı'
                            : '0 yıl — yeni işe başladıysanız veya serbest meslek seçin'}
                        </p>
                      </div>
                    )}

                    {/* Mevsimsellik — Planlanan Başvuru Tarihi */}
                    <div className="mt-4 bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-base">📅</span>
                        <span className="text-sm font-bold text-indigo-800">Planlanan Başvuru Tarihi</span>
                        <span className="ml-auto text-[10px] text-indigo-400 bg-indigo-100 px-2 py-0.5 rounded-full">Mevsimsel Risk Analizi</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1.5">Ay</label>
                          <select
                            value={profile.applyMonth ?? ''}
                            onChange={(e) => setProfile(prev => ({
                              ...prev,
                              applyMonth: e.target.value ? parseInt(e.target.value) : undefined,
                            }))}
                            className="w-full bg-white border border-indigo-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-400 transition-colors"
                          >
                            <option value="">Ay seçin</option>
                            {['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran',
                              'Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'].map((m, i) => (
                              <option key={i + 1} value={i + 1}>{m}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1.5">Yıl</label>
                          <input
                            type="number"
                            min={new Date().getFullYear()}
                            max={new Date().getFullYear() + 2}
                            placeholder={String(new Date().getFullYear())}
                            value={profile.applyYear ?? ''}
                            onChange={(e) => setProfile(prev => ({
                              ...prev,
                              applyYear: e.target.value ? parseInt(e.target.value) : undefined,
                            }))}
                            className="w-full bg-white border border-indigo-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-400 transition-colors placeholder:text-slate-300"
                          />
                        </div>
                      </div>
                      {profile.applyMonth && (
                        <p className="text-[11px] text-indigo-500 mt-2">
                          ✓ Mevsimsel faktör aktif — skorunuza başvuru döneminin yoğunluk etkisi yansıtılıyor.
                        </p>
                      )}
                      {!profile.applyMonth && (
                        <p className="text-[11px] text-indigo-400 mt-2">
                          Ay girdiğinizde Yunanistan/Almanya gibi ülkelerde yaz pik etkisi skora dahil edilir.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
  
                {/* Puan Artırma Kılavuzu */}
                {actionItems.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-amber-500"/>
                      <h3 className="font-bold text-slate-900 text-sm">Skoru Artır</h3>
                      <span className="ml-auto text-xs font-bold text-slate-400">+{actionItems.filter(a=>a.gain!=='⚠️').reduce((s,a)=>s+parseInt(a.gain),0)} puan</span>
                    </div>
                    <div className="space-y-2">
                      {actionItems.slice(0, 4).map((item, i) => (
                        <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${item.gain === '⚠️' ? 'bg-rose-50 border-rose-200' : 'bg-white border-slate-100'}`}>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${item.gain === '⚠️' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                            {item.gain}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-900 text-sm">{item.title}</p>
                          </div>
                          <button type="button" onClick={item.toolFn}
                            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors whitespace-nowrap">
                            {item.toolLabel}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Mobil: Skor + Tam Analiz Paneli erişimi ── */}
                <div className="lg:hidden space-y-4 mt-2">
                  <div className="bg-white border-2 border-slate-100 rounded-3xl p-5 shadow-sm">
                    <div className="text-[10px] font-bold text-brand-500 uppercase tracking-widest mb-2">
                      Tahmini Başarı Skoru
                    </div>
                    <div className={`text-4xl font-bold font-mono mb-2 ${
                      currentScore >= 82 ? 'text-emerald-500' :
                      currentScore >= 65 ? 'text-amber-500' : 'text-rose-500'
                    }`}>
                      %{displayScore}
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
                      <motion.div
                        className={`h-full rounded-full ${
                          currentScore >= 82 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' :
                          currentScore >= 65 ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 'bg-gradient-to-r from-rose-400 to-rose-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${displayScore}%` }}
                        transition={{ duration: 0.9, ease: 'easeOut' }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs mb-2">
                      <span className={`px-2.5 py-1 rounded-full font-bold ${
                        currentConfidence.label === 'Yüksek' ? 'bg-emerald-50 text-emerald-600' :
                        currentConfidence.label === 'Orta' ? 'bg-amber-50 text-amber-600' :
                        'bg-rose-50 text-rose-600'
                      }`}>
                        {currentConfidence.label} Güven
                      </span>
                      <span className="text-slate-400 py-1">
                        %{currentConfidence.low}–%{currentConfidence.high}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                      Bu bir istatistiksel tahmindir. Konsolosluk kararı bağlayıcıdır.
                    </p>
                    <ScoreStory profile={profile} score={currentScore} />
                    <div className="mt-4">
                      <ScoreRadarMini profile={profile} />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep('dashboard')}
                    className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2 group"
                  >
                    Tam Analiz Paneli
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  {currentScore >= 65 && (
                    <button
                      type="button"
                      onClick={() => setStep('letter')}
                      className="btn-secondary w-full py-3 text-sm flex items-center justify-center gap-2"
                    >
                      Niyet Mektubu Oluştur
                    </button>
                  )}
                  {profile.targetCountry && (
                    <BenchmarkCard profile={profile} score={currentScore} />
                  )}
                </div>

                </div>{/* flex-1 form sonu */}

                {/* Sağ: Sticky Skor Paneli (desktop) */}
                <div className="hidden lg:block w-[340px] shrink-0">
                  <div className="sticky top-8 space-y-4">
                    {/* Skor kartı */}
                    <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 relative overflow-hidden shadow-sm">
                      <div className="absolute top-0 right-0 w-40 h-40 bg-brand-500/[0.06] blur-[60px] rounded-full pointer-events-none" />

                      {/* Delta badge */}
                      <AnimatePresence>
                        {delta !== null && (
                          <motion.div
                            key="delta"
                            initial={{ opacity: 0, y: 12, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8 }}
                            className={`absolute top-3 right-3 z-30 px-2.5 py-1 rounded-full text-xs font-bold ${
                              delta > 0 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                            }`}
                          >
                            {delta > 0 ? `+${delta}` : delta}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="relative z-10 space-y-4">
                        <div className="text-[10px] font-bold text-brand-500 uppercase tracking-widest">
                          Tahmini Başarı
                        </div>
                        <div className={`text-5xl font-bold font-mono ${
                          currentScore >= 82 ? 'text-emerald-500' :
                          currentScore >= 65 ? 'text-amber-500' : 'text-rose-500'
                        }`}>
                          %{displayScore}
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${
                              currentScore >= 82 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' :
                              currentScore >= 65 ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 'bg-gradient-to-r from-rose-400 to-rose-500'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${displayScore}%` }}
                            transition={{ duration: 0.9, ease: 'easeOut' }}
                          />
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className={`px-2.5 py-1 rounded-full font-bold ${
                            currentConfidence.label === 'Yüksek' ? 'bg-emerald-50 text-emerald-600' :
                            currentConfidence.label === 'Orta' ? 'bg-amber-50 text-amber-600' :
                            'bg-rose-50 text-rose-600'
                          }`}>
                            {currentConfidence.label} Güven
                          </span>
                          <span className="text-slate-400 py-1">
                            %{currentConfidence.low}–%{currentConfidence.high}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Bu bir istatistiksel tahmindir. Konsolosluk kararı bağlayıcıdır.
                        </p>
                        <ScoreStory profile={profile} score={currentScore} />
                        <ScoreRadarMini profile={profile} />
                      </div>
                    </div>

                    {/* CTA butonları */}
                    <button
                      type="button"
                      onClick={() => setStep('dashboard')}
                      className="btn-primary w-full py-3.5 text-sm flex items-center justify-center gap-2 group"
                    >
                      Tam Analiz Paneli
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    {currentScore >= 65 && (
                      <button
                        type="button"
                        onClick={() => setStep('letter')}
                        className="btn-secondary w-full py-3 text-sm flex items-center justify-center gap-2"
                      >
                        Niyet Mektubu Oluştur
                      </button>
                    )}
                    {profile.targetCountry && (
                      <BenchmarkCard profile={profile} score={currentScore} />
                    )}
                  </div>
                </div>

                </div>{/* flex row sonu */}

                {/* Mobil: alt sabit skor barı */}
                <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-2xl border-t border-slate-100 px-4 py-3 flex items-center justify-between safe-bottom">
                  <div className="flex items-center gap-3">
                    <div className={`text-2xl font-bold font-mono ${
                      currentScore >= 82 ? 'text-emerald-500' :
                      currentScore >= 65 ? 'text-amber-500' : 'text-rose-500'
                    }`}>
                      %{displayScore}
                    </div>
                    <div className="text-xs text-slate-400">
                      <div className="font-bold text-slate-700">{currentConfidence.label} Güven</div>
                      <div>%{currentConfidence.low}–%{currentConfidence.high}</div>
                    </div>
                    <AnimatePresence>
                      {delta !== null && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.7 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            delta > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                          }`}
                        >
                          {delta > 0 ? `+${delta}` : delta}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep('dashboard')}
                    className="btn-primary text-sm px-5 py-2.5 flex items-center gap-1.5"
                  >
                    Sonuçlar <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
  );
}
