/**
 * RejectionRiskWidget — R Analizi Tabanlı Ret Risk Göstergesi
 * ════════════════════════════════════════════════════════════
 * 2.077 vaka analizinden elde edilen 10 faktörlü algoritmayı gösterir.
 * App.tsx dashboard'una entegre edilir.
 */

import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, TrendingUp, Zap, Info, Clock } from 'lucide-react';
import { calculateRejectionRisk, type RejectionRiskResult, type FactorScore } from '../lib/rejectionRiskV2';

// ── Tip Tanımları ─────────────────────────────────────────────────────────

interface RejectionRiskWidgetProps {
  profile: Record<string, unknown>;
  currentScore: number;   // calculateScore çıktısı — blend kalibrasyonu için
  onOpenTool: (toolKey: string) => void;
}

// ── Renk Yardımcıları ─────────────────────────────────────────────────────

const LEVEL_CONFIG = {
  strong:   { bar: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', label: 'Güçlü' },
  moderate: { bar: 'bg-yellow-400',  text: 'text-yellow-700',  bg: 'bg-yellow-50',  label: 'Orta'  },
  weak:     { bar: 'bg-orange-500',  text: 'text-orange-700',  bg: 'bg-orange-50',  label: 'Zayıf' },
  critical: { bar: 'bg-red-500',     text: 'text-red-700',     bg: 'bg-red-50',     label: 'Kritik'},
};

const RISK_CONFIG = {
  'çok düşük': { ring: 'ring-emerald-400', scoreColor: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-800' },
  'düşük':     { ring: 'ring-green-400',   scoreColor: 'text-green-600',   badge: 'bg-green-100 text-green-800'    },
  'orta':      { ring: 'ring-yellow-400',  scoreColor: 'text-yellow-600',  badge: 'bg-yellow-100 text-yellow-800'  },
  'yüksek':    { ring: 'ring-orange-400',  scoreColor: 'text-orange-600',  badge: 'bg-orange-100 text-orange-800'  },
  'kritik':    { ring: 'ring-red-400',     scoreColor: 'text-red-600',     badge: 'bg-red-100 text-red-800'        },
};

// ── Alt Bileşenler ────────────────────────────────────────────────────────

interface FactorRowProps {
  factor: FactorScore;
  expanded: boolean;
  onToggle: () => void;
  onOpenTool: (toolKey: string) => void;
}

const FactorRow: React.FC<FactorRowProps> = ({ factor, expanded, onToggle, onOpenTool }) => {
  const cfg = LEVEL_CONFIG[factor.level];
  const pct = factor.score;

  return (
    <div className={`rounded-xl border overflow-hidden transition-all ${cfg.bg} ${expanded ? 'border-slate-300' : 'border-slate-200'}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-black/5 transition-colors"
      >
        {/* Ağırlık etiketi */}
        <span className="text-[10px] font-black text-slate-400 w-7 shrink-0">
          %{Math.round(factor.weight * 100)}
        </span>

        {/* Faktör adı */}
        <span className="flex-1 text-left text-sm font-semibold text-slate-700">{factor.label}</span>

        {/* Skor barı */}
        <div className="w-24 shrink-0">
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${cfg.bar}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Seviye etiketi */}
        <span className={`text-[10px] font-black px-2 py-0.5 rounded w-14 text-center shrink-0 ${cfg.text} ${cfg.bg}`}>
          {cfg.label}
        </span>

        {/* Genişlet ikon */}
        {(factor.issues.length > 0 || factor.actions.length > 0)
          ? (expanded ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />)
          : <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        }
      </button>

      {expanded && (factor.issues.length > 0 || factor.actions.length > 0) && (
        <div className="px-4 pb-3 space-y-2 border-t border-slate-200/80">
          {factor.issues.map((issue, i) => (
            <div key={i} className="flex items-start gap-2 pt-2">
              <AlertTriangle className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
              <span className="text-xs text-slate-600">{issue}</span>
            </div>
          ))}
          {factor.actions.map((action, i) => (
            <button
              key={i}
              onClick={() => onOpenTool(action.toolKey)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors text-left mt-1
                ${action.priority === 'high'
                  ? 'bg-brand-600 text-white hover:bg-brand-700'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-brand-300 hover:text-brand-700'
                }`}
            >
              <Zap className="w-3.5 h-3.5 shrink-0" />
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Ana Widget ────────────────────────────────────────────────────────────

export function RejectionRiskWidget({ profile, currentScore, onOpenTool }: RejectionRiskWidgetProps) {
  const [expandedFactor, setExpandedFactor] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: RejectionRiskResult = calculateRejectionRisk(profile as any, currentScore);
  const riskCfg = RISK_CONFIG[result.riskLevel];

  const visibleFactors = showAll ? result.factors : result.factors.slice(0, 5);

  // Dairesel gösterge için SVG
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (result.overallScore / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {/* Başlık */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-brand-600" />
          <span className="font-black text-slate-800">Ret Risk Analizi</span>
          <span className="text-[10px] bg-brand-100 text-brand-700 font-black px-2 py-0.5 rounded-full">R-2077</span>
        </div>
        <span className={`text-xs font-black px-2.5 py-1 rounded-full ${riskCfg.badge}`}>
          {result.riskLabel}
        </span>
      </div>

      <div className="p-5">
        {/* Skor — tek headline, dashboard ile tutarlı */}
        <div className="flex items-center gap-5 mb-5">
          {/* Dairesel skor — currentScore ile birebir aynı */}
          <div className="relative w-24 h-24 shrink-0">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="8" />
              <circle
                cx="50" cy="50" r={radius} fill="none"
                stroke={result.riskLevel === 'kritik' ? '#ef4444' : result.riskLevel === 'yüksek' ? '#f97316' : result.riskLevel === 'orta' ? '#eab308' : '#10b981'}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-2xl font-black ${riskCfg.scoreColor}`}>%{result.overallScore}</span>
              <span className="text-[9px] text-slate-400 font-bold leading-tight text-center">başarı<br/>şansı</span>
            </div>
          </div>

          {/* Sağ: özet + ülke bilgisi */}
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-700 leading-relaxed mb-2">{result.summary}</p>
            {/* Ülke bilgi satırı */}
            {result.countryInfo && result.countryInfo.name !== 'Belirtilmemiş' && (
              <div className="flex flex-wrap gap-1.5">
                <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full
                  ${result.countryInfo.difficulty === 'çok zor' ? 'bg-red-100 text-red-700' :
                    result.countryInfo.difficulty === 'zor'     ? 'bg-orange-100 text-orange-700' :
                    result.countryInfo.difficulty === 'orta'    ? 'bg-yellow-100 text-yellow-700' :
                                                                   'bg-green-100 text-green-700'}`}>
                  {result.countryInfo.name} · {result.countryInfo.difficulty}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                  <Clock className="w-2.5 h-2.5" /> ~{result.countryInfo.avgProcessingDays} gün
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                  SM onay: %{result.countryInfo.approvalPct}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Veto uyarıları */}
        {result.vetoes.length > 0 && (
          <div className="mb-4 space-y-2">
            {result.vetoes.map((v, i) => (
              <div key={i} className="flex gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span className="text-xs text-red-700 font-semibold">{v}</span>
              </div>
            ))}
          </div>
        )}

        {/* Faktör listesi */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-1.5 mb-3">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-400 font-semibold">10 Faktörlü R-Analizi Sonuçları</span>
          </div>

          {visibleFactors.map((factor) => (
            <FactorRow
              key={factor.key}
              factor={factor}
              expanded={expandedFactor === factor.key}
              onToggle={() => setExpandedFactor(expandedFactor === factor.key ? null : factor.key)}
              onOpenTool={onOpenTool}
            />
          ))}

          {result.factors.length > 5 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full py-2 text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors"
            >
              {showAll ? 'Daha az göster ↑' : `${result.factors.length - 5} faktör daha göster ↓`}
            </button>
          )}
        </div>

        {/* En kritik aksiyonlar */}
        {result.topActions.length > 0 && (
          <div className="pt-4 border-t border-slate-100">
            <div className="text-xs font-black text-slate-600 mb-2.5">Öncelikli İyileştirme Adımları</div>
            <div className="space-y-2">
              {result.topActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => onOpenTool(action.toolKey)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors text-left
                    ${action.priority === 'high'
                      ? 'bg-brand-600 text-white hover:bg-brand-700'
                      : 'bg-slate-50 border border-slate-200 text-slate-700 hover:border-brand-300 hover:bg-brand-50'
                    }`}
                >
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded shrink-0
                    ${action.priority === 'high' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {i + 1}
                  </span>
                  <span className="flex-1">{action.label}</span>
                  <span className="shrink-0 opacity-60">→</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Veri kaynağı notu */}
        <p className="text-[10px] text-slate-300 text-center mt-4">
          2.077 Türk başvuru vakasının R analizi · Ağırlıklar: Geri dönüş %25, Finansal %18, Seyahat %12
        </p>
      </div>
    </div>
  );
}
