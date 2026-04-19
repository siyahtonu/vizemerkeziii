// ============================================================
// LetterStep — Profesyonel Vize Belgesi Oluşturucu
// ============================================================
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, ArrowLeft, Briefcase, Wallet, PenTool, Map, X, Star, Sparkles, RefreshCw } from 'lucide-react';
import type { LetterData, ProfileData } from '../types';
import { askCoverLetter } from '../lib/ai';

interface Props {
  activeLetterType: 'cover' | 'sponsor' | 'employer' | 'itinerary';
  letterData: LetterData;
  profile: ProfileData;
  onNavigate: (step: string) => void;
  onLetterTypeChange: (t: 'cover' | 'sponsor' | 'employer' | 'itinerary') => void;
  onLetterDataChange: React.Dispatch<React.SetStateAction<LetterData>>;
  buildLetterBody: (type: string) => string;
  generatePDF: (type: string) => void;
  generatePDFEN: (type: string) => void;
}

export function LetterStep({
  activeLetterType, letterData, profile, onNavigate,
  onLetterTypeChange, onLetterDataChange,
  buildLetterBody, generatePDF, generatePDFEN,
}: Props) {
  const setStep = onNavigate;
  const setActiveLetterType = onLetterTypeChange;
  const setLetterData = onLetterDataChange;

  // ── AI kişiselleştirme state'i ─────────────────────────────────────────
  // Her belge tipinin AI çıktısını ayrı tut; belge tipi değişince sıfırla.
  const [aiText, setAiText] = useState<string | null>(null);
  const [aiTips, setAiTips] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    // Belge tipi değiştiğinde AI çıktısı bu tipin değil — temizle.
    setAiText(null);
    setAiTips([]);
    setAiError(null);
  }, [activeLetterType]);

  const runAiLetter = async () => {
    setAiLoading(true);
    setAiError(null);
    try {
      const res = await askCoverLetter(letterData, profile, activeLetterType);
      setAiText(res.body);
      setAiTips(res.tips || []);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'AI yanıt vermedi.');
    } finally {
      setAiLoading(false);
    }
  };
  return (
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
                      <span className="text-[10px] font-bold bg-brand-50 text-brand-600 border border-brand-100 px-2 py-1 rounded-lg uppercase tracking-widest">Smart Document Generator 2.0</span>
                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-1 rounded-lg uppercase tracking-widest">2024-2026 Standartları</span>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900">Profesyonel Vize Belgesi Oluşturucu</h2>
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
                      <div className="font-bold text-slate-900 text-sm">{title}</div>
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
                      <h3 className="font-bold text-slate-900">Bilgilerinizi Girin</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Yazarken önizleme otomatik güncellenir</p>
                    </div>
                    <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                      {/* Ortak alanlar */}
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kimlik Bilgileri</div>
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
  
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-2">Seyahat Bilgileri</div>
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
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-2">Finansal & Mesleki</div>
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
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-2">Sponsor Bilgileri</div>
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
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-2">Mesleki Bilgiler</div>
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
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-2">Şirket Bilgileri</div>
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
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-2">Sigorta & Konaklama</div>
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
                          {aiText ?? buildLetterBody(activeLetterType)}
                        </pre>
                      </div>
                    </div>

                    {/* AI kişiselleştirme şeridi */}
                    <div className="p-4 bg-white border border-slate-100 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-indigo-600" />
                          <span className="text-sm font-bold text-slate-800">
                            {aiText ? 'Claude Versiyonu Aktif' : 'Claude ile Kişiselleştir'}
                          </span>
                        </div>
                        {aiText ? (
                          <button
                            type="button"
                            onClick={() => { setAiText(null); setAiTips([]); }}
                            className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-700"
                          >
                            <X className="w-3.5 h-3.5" /> Şablona Dön
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={runAiLetter}
                            disabled={aiLoading}
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                          >
                            {aiLoading ? (
                              <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Yazıyor…</>
                            ) : (
                              <>Üret</>
                            )}
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Profilinize ve forma girdiğiniz bilgilere göre Claude Sonnet 4.6 size özel mektup yazar.
                        Sonucu beğenmezseniz şablona dönebilirsiniz.
                      </p>
                      {aiError && (
                        <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                          {aiError}
                        </div>
                      )}
                      {aiTips.length > 0 && (
                        <ul className="space-y-1 pl-4 list-disc text-xs text-slate-600">
                          {aiTips.map((t, i) => <li key={i}>{t}</li>)}
                        </ul>
                      )}
                    </div>
  
                    {/* İndir butonları — TR + EN */}
                    <div className="grid grid-cols-2 gap-3">
                      <button type="button"
                        onClick={() => generatePDF(activeLetterType)}
                        className="py-3.5 bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-brand-500/30">
                        <Download className="w-4 h-4" />
                        🇹🇷 Türkçe PDF
                      </button>
                      <button type="button"
                        onClick={() => generatePDFEN(activeLetterType)}
                        className="py-3.5 bg-gradient-to-r from-slate-700 to-slate-900 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg">
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
  );
}
