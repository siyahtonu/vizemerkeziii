// ============================================================
// AnalysisReportModal — "Sonucu Çıkart" kapsamlı PDF raporu
// Claude Research tarzında: özet + ülke tablosu + aksiyon planı
// window.print() ile PDF üretir — jsPDF gerektirmez
// ============================================================

import React, { useMemo, useRef } from 'react';
import { X, Download, AlertTriangle, CheckCircle2, TrendingUp, Globe } from 'lucide-react';
import type { ProfileData } from '../types';
import type { RejectionPattern } from '../data/refusals';
import { calculateScore, calculateScoreDetailed } from '../scoring/core';
import { getDimensionScores, DIMENSION_LABELS, DIMENSION_TIPS } from '../scoring/dimensions';
import { TR_REJECTION_RATES } from '../scoring/matrices';
import { getProfileCountryFactor } from '../scoring/algorithms';
import { getTimingAdvice } from '../scoring/seasonal';

// ── Yardımcı ─────────────────────────────────────────────────────────────────
const FLAG: Record<string, string> = {
  Yunanistan: '🇬🇷', Macaristan: '🇭🇺', İtalya: '🇮🇹', Portekiz: '🇵🇹',
  Polonya: '🇵🇱', İspanya: '🇪🇸', Hollanda: '🇳🇱', Avusturya: '🇦🇹',
  Norveç: '🇳🇴', Fransa: '🇫🇷', ABD: '🇺🇸', İsveç: '🇸🇪',
  Almanya: '🇩🇪', İngiltere: '🇬🇧', Danimarka: '🇩🇰', Belçika: '🇧🇪',
  İsviçre: '🇨🇭',
};

const WAIT_DAYS: Record<string, number> = {
  Yunanistan: 5, Macaristan: 7, İtalya: 10, Portekiz: 12,
  Polonya: 9, İspanya: 8, Hollanda: 14, Avusturya: 20,
  Norveç: 18, Fransa: 21, ABD: 90, İsveç: 35,
  Almanya: 45, İngiltere: 15, Danimarka: 42, Belçika: 15,
  İsviçre: 22,
};

const DIFFICULTY: Record<string, string> = {
  Yunanistan: 'Kolay', Macaristan: 'Kolay', İtalya: 'Orta', Portekiz: 'Orta',
  Polonya: 'Orta', İspanya: 'Orta', Hollanda: 'Orta', Avusturya: 'Orta',
  Norveç: 'Orta', Fransa: 'Zor', ABD: 'Çok Zor', İsveç: 'Orta',
  Almanya: 'Zor', İngiltere: 'Orta', Danimarka: 'Çok Zor', Belçika: 'Zor',
  İsviçre: 'Zor',
};

const DIFF_COLOR: Record<string, string> = {
  Kolay: '#10b981', Orta: '#f59e0b', Zor: '#f97316', 'Çok Zor': '#ef4444',
};

function scoreLabel(s: number) {
  if (s >= 82) return 'Güçlü — Başvuruya Hazır';
  if (s >= 65) return 'Orta — Geliştirilebilir';
  if (s >= 45) return 'Zayıf — Önemli Eksikler Var';
  return 'Çok Zayıf — Önce Profili Güçlendirin';
}

function scoreColor(s: number) {
  if (s >= 82) return '#10b981';
  if (s >= 65) return '#f59e0b';
  return '#ef4444';
}

function dimColor(s: number) {
  if (s >= 70) return '#10b981';
  if (s >= 45) return '#f59e0b';
  return '#ef4444';
}

function today() {
  return new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileData;
  currentScore: number;
  currentConfidence: { label: string; low: number; high: number; missingCount: number };
  rejectionMatches: RejectionPattern[];
  actionItems: { title: string; desc: string; gain: string }[];
}

// ── Bileşen ───────────────────────────────────────────────────────────────────
export function AnalysisReportModal({
  isOpen, onClose, profile, currentScore, currentConfidence, rejectionMatches, actionItems,
}: Props) {
  const printRef = useRef<HTMLDivElement>(null);

  // ── Ülke skorları — tüm ülkeler için hesapla ─────────────────────────────
  const countryRankings = useMemo(() => {
    return Object.keys(TR_REJECTION_RATES)
      .map(country => {
        const countryProfile = { ...profile, targetCountry: country };
        const score = calculateScore(countryProfile);
        const rejRate = TR_REJECTION_RATES[country] ?? 0.2;
        return {
          country,
          score,
          rejRate: Math.round(rejRate * 100),
          waitDays: WAIT_DAYS[country] ?? 14,
          difficulty: DIFFICULTY[country] ?? 'Orta',
          flag: FLAG[country] ?? '🌍',
        };
      })
      .sort((a, b) => b.score - a.score);
  }, [profile]);

  // ── 6 boyut ──────────────────────────────────────────────────────────────
  const dims = useMemo(() => getDimensionScores(profile), [profile]);
  const dimKeys = Object.keys(dims) as (keyof typeof dims)[];

  // ── Detaylı breakdown ────────────────────────────────────────────────────
  const breakdown = useMemo(() => calculateScoreDetailed(profile), [profile]);

  // ── Mevsimsel öneri ──────────────────────────────────────────────────────
  // getTimingAdvice(country, score, year?, month?, baseWaitDays?)
  const timing = useMemo(() => {
    if (!profile.targetCountry) return null;
    try {
      return getTimingAdvice(
        profile.targetCountry,
        currentScore,
        profile.applyYear,
        profile.applyMonth,
        WAIT_DAYS[profile.targetCountry] ?? 14,
      );
    } catch { return null; }
  }, [profile, currentScore]);

  // ── Profil segmenti ──────────────────────────────────────────────────────
  const segment = profile.isStudent ? 'Öğrenci'
    : profile.isPublicSectorEmployee ? 'Kamu Çalışanı'
    : profile.hasSgkJob ? 'SGK\'lı Çalışan'
    : profile.hasAssets ? 'Serbest / Varlıklı'
    : 'Çalışmıyor';

  // ── Öncelikli riskler ─────────────────────────────────────────────────────
  const topRisks = rejectionMatches.slice(0, 5);

  // ── Yazdır ───────────────────────────────────────────────────────────────
  function handlePrint() {
    window.print();
  }

  if (!isOpen) return null;

  const targetScore = countryRankings.find(c => c.country === profile.targetCountry)?.score ?? currentScore;
  const bestCountry = countryRankings[0];
  const safeCountries = countryRankings.filter(c => c.score >= 65 && c.rejRate <= 15);

  return (
    <>
      {/* ── Print CSS ─────────────────────────────────────────────── */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #analysis-report-print, #analysis-report-print * { visibility: visible !important; }
          #analysis-report-print { position: absolute !important; left: 0 !important; top: 0 !important; width: 100% !important; }
          .no-print { display: none !important; }
          .print-page-break { page-break-before: always; }
          @page { margin: 15mm 12mm; }
        }
      `}</style>

      {/* ── Modal overlay ────────────────────────────────────────────── */}
      <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 overflow-y-auto p-4 sm:p-8">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl">

          {/* ── Modal başlık ────────────────────────────────────────── */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 no-print sticky top-0 bg-white rounded-t-2xl z-10">
            <div>
              <h2 className="font-bold text-slate-900 text-lg">Kişisel Vize Analiz Raporu</h2>
              <p className="text-xs text-slate-400 mt-0.5">Tarayıcı yazdır menüsüyle PDF olarak kaydedin</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                PDF İndir
              </button>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
          </div>

          {/* ── RAPOR İÇERİĞİ ─────────────────────────────────────────── */}
          <div id="analysis-report-print" ref={printRef} className="p-6 sm:p-8 space-y-8 text-slate-800">

            {/* ── 1. KAPAK BAŞLIĞI ──────────────────────────────────── */}
            <div className="border-b-2 border-indigo-600 pb-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">VİZEAKIL — KİŞİSEL ANALİZ RAPORU</div>
                  <h1 className="text-2xl font-bold text-slate-900 leading-tight">
                    {FLAG[profile.targetCountry] || '🌍'} {profile.targetCountry || 'Hedef Ülke'} Vize Başvuru Analizi
                  </h1>
                  <p className="text-sm text-slate-500 mt-1">
                    Rapor Tarihi: {today()} · Profil: {segment} · Algoritma: v3.2
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div
                    className="text-4xl font-bold font-mono"
                    style={{ color: scoreColor(targetScore) }}
                  >
                    %{targetScore}
                  </div>
                  <div className="text-xs font-bold text-slate-500 mt-1">Başarı Skoru</div>
                  <div
                    className="text-xs font-bold mt-1 px-2 py-0.5 rounded-full inline-block"
                    style={{ backgroundColor: scoreColor(targetScore) + '20', color: scoreColor(targetScore) }}
                  >
                    {scoreLabel(targetScore)}
                  </div>
                </div>
              </div>

              {/* Skor çubuğu */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Başarı Tahmini: %{currentConfidence.low}–%{currentConfidence.high} ({currentConfidence.label} Güven)</span>
                  <span>Hedef: %82</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${Math.min(targetScore, 100)}%`, backgroundColor: scoreColor(targetScore) }}
                  />
                </div>
              </div>
            </div>

            {/* ── 2. YÜRÜTÜCÜ ÖZET ───────────────────────────────────── */}
            <section>
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-indigo-600 rounded-full inline-block" />
                Yürütücü Özet
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                {/* Genel durum */}
                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="text-xs font-bold text-slate-400 uppercase mb-1">Genel Durum</div>
                  <div className="font-bold text-slate-900">{scoreLabel(targetScore)}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {targetScore >= 82
                      ? 'Profiliniz başvuruya hazır. Belgelerinizi hazırlayın.'
                      : targetScore >= 65
                      ? `%82 hedefine ${82 - targetScore} puan eksik. Aşağıdaki aksiyonları uygulayın.`
                      : 'Ciddi profil eksiklikleri var. Başvurmadan önce güçlendirin.'}
                  </div>
                </div>
                {/* En iyi ülke */}
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="text-xs font-bold text-emerald-600 uppercase mb-1">En Uygun Ülke</div>
                  <div className="font-bold text-slate-900">{bestCountry.flag} {bestCountry.country}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    %{bestCountry.score} tahmini onay · %{bestCountry.rejRate} ret oranı · {bestCountry.waitDays} gün bekleme
                  </div>
                </div>
                {/* Kritik risk */}
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
                  <div className="text-xs font-bold text-rose-600 uppercase mb-1">
                    {topRisks.length > 0 ? 'Kritik Risk' : 'Risk Durumu'}
                  </div>
                  <div className="font-bold text-slate-900">
                    {topRisks.length > 0 ? topRisks[0].name : 'Risk Tespit Edilmedi'}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {topRisks.length > 0 ? topRisks[0].explanation?.slice(0, 80) + '…' : 'Profilinizde bilinen ret kalıpları bulunamadı.'}
                  </div>
                </div>
              </div>

              {/* Özet paragraf */}
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-sm leading-relaxed text-slate-700">
                <strong>Algoritmik Değerlendirme:</strong>{' '}
                {profile.targetCountry} için hesaplanan başarı skoru <strong>%{targetScore}</strong> olup
                Bayes blending (%65 profil + %35 tarihsel ret oranı), profil-ülke matrisi (çarpan: {breakdown.countryFactor.toFixed(2)}),
                {breakdown.consulateCity ? ` ${breakdown.consulateCity} konsolosluğu kalibrasyonu,` : ''}
                {' '}ve mevsimsel düzeltmeden oluşmaktadır.
                Ham profil puanı <strong>{breakdown.rawScore}/100</strong>'dür.
                {safeCountries.length > 0
                  ? ` Güçlü onay ihtimali olan ülkeler: ${safeCountries.slice(0, 3).map(c => `${c.flag} ${c.country} (%${c.score})`).join(', ')}.`
                  : ' Profil güçlendirilmeden onay oranı yüksek ülkeler için de risk mevcuttur.'}
              </div>
            </section>

            {/* ── 3. PROFİL BOYUT ANALİZİ ───────────────────────────── */}
            <section>
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-indigo-600 rounded-full inline-block" />
                6 Boyutlu Profil Analizi
              </h2>
              <div className="space-y-3">
                {dimKeys.map(key => {
                  const score = dims[key];
                  const color = dimColor(score);
                  const status = score >= 70 ? 'Güçlü' : score >= 45 ? 'Orta' : 'Zayıf — Öncelikli';
                  return (
                    <div key={key} className="rounded-xl border border-slate-200 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{DIMENSION_LABELS[key]}</span>
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: color + '20', color }}
                          >
                            {status}
                          </span>
                        </div>
                        <span className="text-lg font-bold font-mono" style={{ color }}>%{score}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                        <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: color }} />
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{DIMENSION_TIPS[key]}</p>
                      {score < 45 && (
                        <div className="mt-2 text-xs font-bold text-rose-600 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Bu boyut zayıf — aşağıdaki aksiyon planına bakın.
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ── 4. ÜLKE BAŞARI SIRALAMASI ─────────────────────────────── */}
            <section className="print-page-break">
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-600" />
                Profilinize Göre Ülke Başarı Sıralaması
              </h2>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                Algoritmamız her ülke için profilinizi ayrı ayrı değerlendirdi. Skor, ret oranı × profil uyumu × ülke matrisi çarpımıyla hesaplandı.
                Yeşil = güvenli, Sarı = dikkatli, Kırmızı = riskli.
              </p>
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left px-3 py-2.5 text-xs font-bold text-slate-500 uppercase w-6">#</th>
                      <th className="text-left px-3 py-2.5 text-xs font-bold text-slate-500 uppercase">Ülke</th>
                      <th className="text-center px-3 py-2.5 text-xs font-bold text-slate-500 uppercase">Başarı Tahmini</th>
                      <th className="text-center px-3 py-2.5 text-xs font-bold text-slate-500 uppercase">Ret Oranı</th>
                      <th className="text-center px-3 py-2.5 text-xs font-bold text-slate-500 uppercase">Zorluk</th>
                      <th className="text-center px-3 py-2.5 text-xs font-bold text-slate-500 uppercase">Bekleme</th>
                    </tr>
                  </thead>
                  <tbody>
                    {countryRankings.map((c, i) => {
                      const isTarget = c.country === profile.targetCountry;
                      return (
                        <tr
                          key={c.country}
                          className={`border-b border-slate-100 last:border-0 ${isTarget ? 'bg-indigo-50' : i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}
                        >
                          <td className="px-3 py-2.5 text-xs font-bold text-slate-400">{i + 1}</td>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-2">
                              <span className="text-base">{c.flag}</span>
                              <span className={`font-bold text-sm ${isTarget ? 'text-indigo-700' : 'text-slate-800'}`}>
                                {c.country}
                                {isTarget && <span className="ml-1 text-[9px] font-bold text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded-full">Seçili</span>}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            <span
                              className="font-bold text-sm"
                              style={{ color: scoreColor(c.score) }}
                            >
                              %{c.score}
                            </span>
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden mx-auto mt-1">
                              <div className="h-full rounded-full" style={{ width: `${c.score}%`, backgroundColor: scoreColor(c.score) }} />
                            </div>
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            <span className="text-xs font-bold text-slate-600">%{c.rejRate}</span>
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            <span
                              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: DIFF_COLOR[c.difficulty] + '20', color: DIFF_COLOR[c.difficulty] }}
                            >
                              {c.difficulty}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 text-center text-xs text-slate-500">{c.waitDays}g</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 italic">
                * Başarı tahmini istatistiksel modeldir, garanti değildir. 2024-2026 Schengen/UK/ABD istatistiklerine dayanır.
              </p>
            </section>

            {/* ── 5. RİSK FAKTÖRLERİ ────────────────────────────────────── */}
            <section>
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                Tespit Edilen Risk Faktörleri ({topRisks.length})
              </h2>
              {topRisks.length === 0 ? (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <div className="font-bold text-emerald-800 text-sm">Kritik Risk Tespit Edilmedi</div>
                    <p className="text-xs text-emerald-600 mt-0.5">Profiliniz bilinen ret kalıplarıyla eşleşmiyor. Yine de belge kalitesine dikkat edin.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {topRisks.map((risk, i) => (
                    <div key={i} className="rounded-xl border border-rose-200 bg-rose-50 p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-lg bg-rose-500 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-rose-800 text-sm">{risk.name}</span>
                            {risk.legalCode && (
                              <span className="text-[9px] font-bold bg-rose-200 text-rose-700 px-1.5 py-0.5 rounded-full uppercase">
                                {risk.legalCode}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-rose-700 leading-relaxed">{risk.explanation}</p>
                          {risk.mitigation && (
                            <div className="mt-2 text-xs font-bold text-rose-800 bg-white/60 rounded-lg px-3 py-1.5 border border-rose-200">
                              Çözüm: {risk.mitigation}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* ── 6. MEVSİMSEL ZAMANLAMA ─────────────────────────────────── */}
            {timing && (
              <section>
                <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-amber-500 rounded-full inline-block" />
                  Mevsimsel Zamanlama Analizi
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-xl border border-slate-200 p-4">
                    <div className="text-xs font-bold text-slate-400 uppercase mb-1">Güncel Pencere</div>
                    <div className="font-bold text-slate-900 text-lg">{timing.currentWindowScore >= 0.65 ? 'Uygun' : 'Dikkatli'}</div>
                    <div className="text-xs text-slate-500 mt-1">Pencere skoru: {(timing.currentWindowScore * 100).toFixed(0)}%</div>
                  </div>
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                    <div className="text-xs font-bold text-emerald-600 uppercase mb-1">Optimum Ay</div>
                    <div className="font-bold text-slate-900">
                      {timing.recommendation === 'apply_now' ? 'Şu an uygun' :
                       timing.targetMonthName ?? (timing.bestWindowMonth
                         ? ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'][timing.bestWindowMonth - 1]
                         : 'Hesaplanıyor')}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">En iyi pencere skoru: {(timing.bestWindowScore * 100).toFixed(0)}%</div>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-4">
                    <div className="text-xs font-bold text-slate-400 uppercase mb-1">Tahmini Randevu Bekleme</div>
                    <div className="font-bold text-slate-900">{timing.appointmentWaitEst ?? WAIT_DAYS[profile.targetCountry ?? ''] ?? 14} Gün</div>
                    <div className="text-xs text-slate-500 mt-1">Mevsimsel talep dahil tahmin</div>
                  </div>
                </div>
                {timing.activeWarnings && timing.activeWarnings.length > 0 && (
                  <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 p-3">
                    <div className="text-xs font-bold text-amber-700 mb-1">Dönem Uyarıları:</div>
                    <ul className="list-disc list-inside space-y-0.5">
                      {timing.activeWarnings.map((w, i) => (
                        <li key={i} className="text-xs text-amber-700">{w}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}

            {/* ── 7. ÖNCELİKLİ AKSİYON PLANI ───────────────────────────── */}
            <section>
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                Öncelikli Aksiyon Planı
              </h2>
              {actionItems.length === 0 ? (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
                  <div className="font-bold text-emerald-800 text-sm">Başvuruya Hazırsınız</div>
                  <p className="text-xs text-emerald-600 mt-1">Profiliniz %82 eşiğini geçiyor. Belge paketinizi hazırlayın ve randevu alın.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {actionItems.slice(0, 7).map((item, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-xl border border-slate-200 p-3">
                      <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white ${
                        item.gain === '⚠️' ? 'bg-rose-500' : 'bg-indigo-600'
                      }`}>
                        {item.gain === '⚠️' ? '!' : item.gain}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-slate-900 text-sm">{item.title}</div>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* ── 8. ALGORİTMİK NOTLAR ───────────────────────────────────── */}
            <section className="border-t border-slate-200 pt-6">
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-slate-400 rounded-full inline-block" />
                Algoritmik Metedoloji
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 space-y-1">
                  <div className="font-bold text-slate-700">Ham Profil Puanı</div>
                  <div>6 boyut × ağırlıklı katsayı = <strong>{breakdown.rawScore}</strong> / 100</div>
                  <div className="text-slate-400">Finansal, Mesleki, Bağlar, Seyahat, Başvuru, Güven</div>
                </div>
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 space-y-1">
                  <div className="font-bold text-slate-700">Bayes Blending</div>
                  <div>(Ham/100) × 0.65 + (1 - RetOranı) × 0.35 = <strong>{(breakdown.blendedScore * 100).toFixed(1)}</strong></div>
                  <div className="text-slate-400">Tarihsel ret oranı ağırlıklı düzeltme</div>
                </div>
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 space-y-1">
                  <div className="font-bold text-slate-700">Profil-Ülke Matrisi</div>
                  <div>Çarpan: <strong>{breakdown.countryFactor.toFixed(3)}</strong> (Segment: {segment})</div>
                  <div className="text-slate-400">Tarihsel segment × ülke uyum verileri</div>
                </div>
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 space-y-1">
                  <div className="font-bold text-slate-700">Konsolosluk + Mevsim</div>
                  <div>
                    Konsülosluk: {breakdown.consulateCity ?? 'N/A'} ({breakdown.consulateFactor.toFixed(3)})
                    · Mevsim: {breakdown.seasonalFactor.toFixed(3)}
                  </div>
                  <div className="text-slate-400">v3.1 konsolosluk + v3.2 mevsimsel kalibrasyon</div>
                </div>
              </div>
            </section>

            {/* ── Footer ─────────────────────────────────────────────────── */}
            <div className="border-t border-slate-200 pt-4 flex items-center justify-between text-[10px] text-slate-400">
              <span>VizeAkıl · vizeakil.com · {today()}</span>
              <span>Bu rapor istatistiksel tahmindir, hukuki/resmi tavsiye değildir.</span>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default AnalysisReportModal;
