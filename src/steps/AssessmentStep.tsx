// ============================================================
// AssessmentStep — Hızlı Profil Analizi
// ============================================================
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, ShieldCheck, ChevronRight, ArrowLeft, Briefcase, Home, Globe, Wallet, Zap } from 'lucide-react';
import type { ProfileData } from '../types';
import ScoreStory from '../components/ScoreStory';
import BenchmarkCard from '../components/BenchmarkCard';

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
  onApplicantTypeChange: (t: 'employer' | 'unemployed' | 'minor' | 'sponsor') => void;
  onProfileToggle: (key: keyof ProfileData) => void;
}

export function AssessmentStep({
  profile, currentScore, currentConfidence, actionItems,
  applicantType, onNavigate, onProfileUpdate, onProfileSet,
  onApplicantTypeChange, onProfileToggle,
}: Props) {
  const setStep = onNavigate;
  const setApplicantType = onApplicantTypeChange;
  const setProfile = onProfileSet;
  const handleProfileToggle = onProfileToggle;
  return (
            <motion.div
                key="assessment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-4xl mx-auto space-y-8 sm:space-y-12 px-4 sm:px-0"
              >
                <div className="flex items-center gap-3 sm:gap-6">
                  <button onClick={() => setStep('hero')} className="p-3 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all shadow-sm">
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                  </button>
                  <div className="flex-1">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Hızlı Profil Analizi</h2>
                    <p className="text-slate-500 font-medium">Temel kriterlerinizi seçerek ilk tahmininizi alın.</p>
                  </div>
                </div>
  
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
                        <span className={`text-sm font-black ${pct >= 70 ? 'text-emerald-600' : pct >= 40 ? 'text-amber-600' : 'text-rose-500'}`}>{pct}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${pct >= 70 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-400' : 'bg-rose-400'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-400 mt-1.5">
                        {filled}/{total} kriter seçildi
                        {pct < 50 && ' — Daha fazla kriter seçerek skorunuzu iyileştirin.'}
                        {pct >= 50 && pct < 80 && ' — İyi ilerliyorsunuz, devam edin.'}
                        {pct >= 80 && ' — Güçlü profil! Skoru görüntüleyin.'}
                      </p>
                    </div>
                  );
                })()}
  
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
  
                  {/* Algoritma v3.0 Ek Alanlar */}
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">3. Zaman Bazlı Kalibrasyonlar <span className="text-xs font-normal text-slate-400 ml-2">Opsiyonel — algoritmayı hassaslaştırır</span></h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-white border border-slate-200 rounded-2xl p-4">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Yaşınız</label>
                        <input
                          type="number"
                          min={18} max={90}
                          placeholder="örn. 34"
                          value={profile.applicantAge || ''}
                          onChange={(e) => setProfile(prev => ({ ...prev, applicantAge: parseInt(e.target.value) || 0 }))}
                          className="w-full text-2xl font-black text-slate-900 border-none outline-none bg-transparent p-0 placeholder:text-slate-300"
                        />
                        <p className="text-xs text-slate-400 mt-1">Geri dönüş taahhüdü puanını kişiselleştirir</p>
                      </div>
                      <div className="bg-white border border-slate-200 rounded-2xl p-4">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Son Vize Yılı</label>
                        <input
                          type="number"
                          min={2000} max={new Date().getFullYear()}
                          placeholder="örn. 2022"
                          value={profile.lastVisaYear || ''}
                          onChange={(e) => setProfile(prev => ({ ...prev, lastVisaYear: parseInt(e.target.value) || 0 }))}
                          className="w-full text-2xl font-black text-slate-900 border-none outline-none bg-transparent p-0 placeholder:text-slate-300"
                        />
                        <p className="text-xs text-slate-400 mt-1">Eski vize puanı zamanla azalır (temporal decay)</p>
                      </div>
                      <div className="bg-white border border-slate-200 rounded-2xl p-4">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Son Red Yılı</label>
                        <input
                          type="number"
                          min={2000} max={new Date().getFullYear()}
                          placeholder="örn. 2020"
                          value={profile.lastRejectionYear || ''}
                          onChange={(e) => setProfile(prev => ({ ...prev, lastRejectionYear: parseInt(e.target.value) || 0 }))}
                          className="w-full text-2xl font-black text-slate-900 border-none outline-none bg-transparent p-0 placeholder:text-slate-300"
                        />
                        <p className="text-xs text-slate-400 mt-1">Eski ret cezası yıllar geçtikçe azalır</p>
                      </div>
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
                <div className="p-5 sm:p-8 md:p-10 bg-slate-900 rounded-[2rem] sm:rounded-[2.5rem] text-white flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/20 blur-[100px] rounded-full pointer-events-none" />
                  <div className="space-y-3 text-center lg:text-left relative z-10 w-full lg:w-auto">
                    <div className="text-brand-400 text-xs font-bold uppercase tracking-[0.2em]">Tahmini Başarı İhtimali</div>
                    <div className="flex items-end gap-3 justify-center lg:justify-start">
                      <div className="text-5xl sm:text-6xl md:text-7xl font-black text-white">%{currentScore}</div>
                      <div className="text-sm text-slate-400 pb-2">
                        {currentScore < 82 ? `Hedef: %82 (+${82 - currentScore} puan)` : '✓ Başvuruya hazır'}
                      </div>
                    </div>
                    {/* Güven aralığı */}
                    <div className="flex flex-wrap items-center gap-2 text-xs justify-center lg:justify-start">
                      <span className="text-white/60">Aralık:</span>
                      <span className="text-white font-semibold">%{currentConfidence.low}–%{currentConfidence.high}</span>
                      <span className={`px-2 py-0.5 rounded-full font-bold ${currentConfidence.label === 'Yüksek' ? 'bg-emerald-500/30 text-emerald-300' : currentConfidence.label === 'Orta' ? 'bg-amber-500/30 text-amber-300' : 'bg-rose-500/30 text-rose-300'}`}>
                        {currentConfidence.label} Güven
                      </span>
                      {currentConfidence.missingCount > 0 && (
                        <span className="text-white/40">(+{currentConfidence.missingCount} alan eksik)</span>
                      )}
                    </div>
                    {/* Mini progress bar */}
                    <div className="w-full max-w-xs h-2 bg-white/10 rounded-full overflow-hidden mx-auto lg:mx-0">
                      <div className={`h-full rounded-full transition-all ${currentScore >= 82 ? 'bg-emerald-400' : currentScore >= 65 ? 'bg-amber-400' : 'bg-rose-400'}`}
                        style={{width:`${currentScore}%`}}/>
                    </div>
                    {/* Storytelling Anlatı Kartı */}
                    <div className="mt-3">
                      <ScoreStory profile={profile} score={currentScore} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 relative z-10 w-full lg:w-auto">
                    <button
                      type="button"
                      onClick={() => setStep('dashboard')}
                      className="btn-primary w-full lg:w-auto px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base flex items-center justify-center gap-2 group">
                      Araçlarla Puanı Artır <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    {currentScore >= 65 && (
                      <button type="button" onClick={() => setStep('letter')}
                        className="w-full lg:w-auto px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-bold bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center gap-2 transition-colors">
                        Niyet Mektubu Oluştur →
                      </button>
                    )}
                    {/* Benchmarking Widget */}
                    {profile.targetCountry && (
                      <BenchmarkCard profile={profile} score={currentScore} />
                    )}
                  </div>
                </div>
              </motion.div>
  );
}
