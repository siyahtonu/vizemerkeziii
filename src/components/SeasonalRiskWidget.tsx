// ============================================================
// SeasonalRiskWidget — Mevsimsel Zamanlama Önerisi (v1.0)
// "Şu an başvursanız mı, 2 ay bekleseniz mi?" görseli
// ============================================================

import React, { useMemo } from 'react';
import {
  getTimingAdvice,
  getSeasonalWindow,
  MONTH_NAMES,
  type TimingRec,
} from '../scoring/seasonal';

interface Props {
  country: string;
  score: number;
  /** Başvuru planladığı ay (1-12). Verilmezse bu ay kullanılır. */
  applyMonth?: number;
  applyYear?: number;
  /** Konsolosluk matrisinden gelen randevu bekleme (gün) */
  baseWaitDays?: number;
}

const REC_CONFIG: Record<TimingRec, { color: string; bg: string; border: string; icon: string }> = {
  apply_now:    { color: 'text-emerald-700', bg: 'bg-emerald-50',  border: 'border-emerald-300', icon: '✓' },
  wait:         { color: 'text-amber-700',   bg: 'bg-amber-50',    border: 'border-amber-300',   icon: '⏳' },
  rush_before:  { color: 'text-red-700',     bg: 'bg-red-50',      border: 'border-red-300',     icon: '⚡' },
  caution:      { color: 'text-orange-700',  bg: 'bg-orange-50',   border: 'border-orange-300',  icon: '⚠' },
};

const SCRUTINY_LABEL: Record<string, string> = {
  deep:    'Derin İnceleme',
  normal:  'Normal İnceleme',
  surface: 'Yüzeysel İnceleme',
};
const SCRUTINY_COLOR: Record<string, string> = {
  deep:    'text-blue-600',
  normal:  'text-slate-600',
  surface: 'text-orange-500',
};

// Mini 12-ay bar chart
const MonthBar: React.FC<{ score: number; isActive: boolean; month: number; isBest: boolean }> = ({
  score, isActive, month, isBest,
}) => {
  const height = Math.round(score * 40); // 0-40px
  const bg = isBest
    ? 'bg-emerald-500'
    : isActive
    ? 'bg-indigo-500'
    : 'bg-slate-200';

  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="flex items-end h-10">
        <div
          className={`w-4 rounded-t transition-all ${bg}`}
          style={{ height: `${height}px` }}
          title={`${MONTH_NAMES[month]}: ${Math.round(score * 100)}%`}
        />
      </div>
      <span className={`text-[9px] font-medium ${isActive ? 'text-indigo-600' : isBest ? 'text-emerald-600' : 'text-slate-400'}`}>
        {MONTH_NAMES[month]?.slice(0, 3)}
      </span>
    </div>
  );
};

const SeasonalRiskWidget: React.FC<Props> = ({
  country,
  score,
  applyMonth,
  applyYear,
  baseWaitDays = 0,
}) => {
  const now  = new Date();
  const year  = applyYear  ?? now.getFullYear();
  const month = applyMonth ?? (now.getMonth() + 1);

  const advice = useMemo(
    () => getTimingAdvice(country, score, year, month, baseWaitDays),
    [country, score, year, month, baseWaitDays],
  );

  // 12 aylık pencere skorları — grafik için
  const monthlyScores = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => {
      const m = i + 1;
      const w = getSeasonalWindow(country, year, m);
      return w.windowScore;
    }),
  [country, year]);

  if (!country) return null;

  const cfg = REC_CONFIG[advice.recommendation];
  const currentWindow = getSeasonalWindow(country, year, month);

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">

      {/* Header */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">📅</span>
          <span className="font-semibold text-slate-800 text-sm">Zamanlama Analizi</span>
        </div>
        <span className="text-xs text-slate-500">
          {MONTH_NAMES[month]} {year} · {country}
        </span>
      </div>

      {/* Açıklama — widget ne işe yarar? */}
      <div className="px-4 pt-3 pb-1 text-[11px] text-slate-500 leading-relaxed">
        Konsolosluğun aylık iş yüküne, yoğunluk döngüsüne ve politik risk
        pencerelerine göre; <strong className="text-slate-700">şimdi mi başvurmalısın yoksa
        X ay beklemek mi daha avantajlı</strong> sorusunu cevaplar. Yeşil bar en yüksek
        kabul şansı olan ayı, mavi bar seçili ayını gösterir.
      </div>

      {/* Ana Öneri Kartı */}
      <div className={`mx-4 mt-4 rounded-lg border p-3 ${cfg.bg} ${cfg.border}`}>
        <div className="flex items-start gap-2.5">
          <span className={`text-xl mt-0.5 ${cfg.color}`}>{cfg.icon}</span>
          <div className="flex-1 min-w-0">
            <p className={`font-bold text-sm leading-tight ${cfg.color}`}>{advice.headline}</p>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{advice.reason}</p>
            {advice.urgencyNote && (
              <p className={`text-xs font-medium mt-1.5 ${cfg.color}`}>{advice.urgencyNote}</p>
            )}
          </div>
        </div>
      </div>

      {/* Metrikler */}
      <div className="mx-4 mt-3 grid grid-cols-3 gap-2">

        {/* Pencere Skoru */}
        <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-center">
          <div className="text-lg font-bold text-slate-800">
            {Math.round(advice.currentWindowScore * 100)}
            <span className="text-xs font-normal text-slate-400">/100</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Pencere Skoru</div>
          <div className="mt-1 h-1 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all"
              style={{ width: `${advice.currentWindowScore * 100}%` }}
            />
          </div>
        </div>

        {/* İnceleme Derinliği */}
        <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-center">
          <div className={`text-xs font-bold ${SCRUTINY_COLOR[currentWindow.scrutiny]}`}>
            {SCRUTINY_LABEL[currentWindow.scrutiny]}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">İnceleme Modu</div>
          <div className="mt-1 text-[10px] text-slate-400">
            {currentWindow.scrutiny === 'deep' && 'Güçlü profil avantajlı'}
            {currentWindow.scrutiny === 'normal' && 'Dengeli değerlendirme'}
            {currentWindow.scrutiny === 'surface' && 'Hızlı karar, az detay'}
          </div>
        </div>

        {/* Randevu Bekleme */}
        <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-center">
          <div className="text-lg font-bold text-slate-800">
            {advice.appointmentWaitEst}
            <span className="text-xs font-normal text-slate-400"> gün</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Randevu Bekleme</div>
          <div className="text-[10px] text-slate-400 mt-1">tahmini</div>
        </div>
      </div>

      {/* 12-Aylık Grafik */}
      <div className="mx-4 mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-medium text-slate-600">12 Aylık Pencere Skoru</span>
          <div className="flex items-center gap-3 text-[10px] text-slate-400">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-indigo-500 inline-block" /> Şu an</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-500 inline-block" /> En iyi</span>
          </div>
        </div>
        <div className="flex items-end gap-0.5 justify-between">
          {monthlyScores.map((sc, i) => (
            <MonthBar
              key={i}
              score={sc}
              month={i + 1}
              isActive={i + 1 === month}
              isBest={i + 1 === advice.bestWindowMonth && i + 1 !== month}
            />
          ))}
        </div>
      </div>

      {/* Politik Uyarılar */}
      {advice.activeWarnings.length > 0 && (
        <div className="mx-4 mt-3">
          <div className="rounded-lg bg-red-50 border border-red-200 p-2.5">
            <p className="text-[11px] font-semibold text-red-700 mb-1">Aktif Politik Riskler</p>
            {advice.activeWarnings.map((w, i) => (
              <p key={i} className="text-[11px] text-red-600 flex items-center gap-1">
                <span>›</span> {w}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* En İyi Pencere */}
      {advice.recommendation === 'wait' && advice.targetMonthName && (
        <div className="mx-4 mt-3">
          <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2.5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-emerald-700">Önerilen Hedef Ay</p>
              <p className="text-lg font-bold text-emerald-800">{advice.targetMonthName}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-emerald-600">Pencere skoru</p>
              <p className="text-lg font-bold text-emerald-700">{Math.round(advice.bestWindowScore * 100)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer: Sezonsal Çarpan */}
      <div className="mx-4 mt-3 mb-4 flex items-center justify-between text-[10px] text-slate-400">
        <span>Sezonsal çarpan: ×{advice.seasonalMultiplier.toFixed(3)}</span>
        <span>Skor etkisi: {advice.seasonalMultiplier >= 1 ? '+' : ''}{Math.round((advice.seasonalMultiplier - 1) * 100 * 0.03)}%</span>
      </div>

    </div>
  );
};

export default SeasonalRiskWidget;
