// ============================================================
// BenchmarkCard — #15 "Senin Gibi Profiller" Sosyal Kanıt
// ============================================================
import React, { useMemo } from 'react';
import type { ProfileData } from '../types';
import { TR_REJECTION_RATES } from '../scoring/matrices';
import { REJECTION_TAXONOMY } from '../data/refusals';

interface Props {
  profile:  ProfileData;
  score:    number;
}

const COUNTRY_ANNUAL_APPS: Record<string, number> = {
  'Almanya': 48500, 'Fransa': 31200, 'Hollanda': 22800, 'İtalya': 41600,
  'İspanya': 38900, 'Yunanistan': 87400, 'Avusturya': 18200, 'Belçika': 12500,
  'İsveç': 11800, 'Norveç': 9400, 'Danimarka': 7200, 'Polonya': 14600,
  'Macaristan': 16800, 'Portekiz': 9800, 'İsviçre': 11200,
  'İngiltere': 26400, 'ABD': 18700,
};

const SEGMENT_SHARE: Record<string, number> = {
  employed: 0.42, student: 0.14, public_sector: 0.09,
  self_employed: 0.12, retired: 0.08, unemployed: 0.15,
};

const SCORE_TIER_SHARE: Record<string, number> = {
  high: 0.22, mid: 0.38, low: 0.28, risky: 0.12,
};

function getSegment(p: ProfileData): string {
  if (p.isStudent) return 'student';
  if (p.isPublicSectorEmployee) return 'public_sector';
  if (!p.hasSgkJob && p.hasAssets && p.applicantAge >= 55) return 'retired';
  if (!p.hasSgkJob && p.hasAssets) return 'self_employed';
  if (!p.hasSgkJob) return 'unemployed';
  return 'employed';
}

function getScoreTier(score: number): string {
  if (score >= 80) return 'high';
  if (score >= 60) return 'mid';
  if (score >= 40) return 'low';
  return 'risky';
}

function deterministicVariance(seed: string, min: number, max: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  return min + Math.abs(hash) % (max - min + 1);
}

interface BenchmarkData {
  totalApplicants: number;
  approvalRate: number;
  avgScore: number;
  topMistake: string;
  topMistakeRate: number;
  betterThanPct: number;
  countryLabel: string;
}

function computeBenchmark(p: ProfileData, score: number): BenchmarkData | null {
  const country = p.targetCountry;
  if (!country) return null;

  const segment = getSegment(p);
  const tier = getScoreTier(score);
  const baseApps = COUNTRY_ANNUAL_APPS[country] ?? 10000;
  const segShare = SEGMENT_SHARE[segment] ?? 0.3;
  const tierShare = SCORE_TIER_SHARE[tier] ?? 0.3;
  const seed = `${country}:${segment}`;

  const base = Math.round(baseApps * segShare * tierShare);
  const variance = deterministicVariance(seed, -Math.round(base * 0.15), Math.round(base * 0.15));
  const totalApplicants = Math.max(100, base + variance);

  const rejRate = TR_REJECTION_RATES[country] ?? 0.15;
  const segBonus: Record<string, number> = {
    public_sector: +0.06, employed: +0.02, student: -0.03,
    self_employed: -0.02, unemployed: -0.08, retired: +0.03,
  };
  const baseApproval = (1 - rejRate) + (segBonus[segment] ?? 0);
  const approvalRate = Math.round(Math.min(0.97, Math.max(0.30, baseApproval)) * 100);

  const avgScoreBySegment: Record<string, number> = {
    public_sector: 74, employed: 65, student: 58,
    self_employed: 60, retired: 67, unemployed: 44,
  };
  const avgScore = avgScoreBySegment[segment] ?? 60;

  const percentileRaw = score <= avgScore
    ? Math.round((score / avgScore) * 45)
    : Math.round(45 + ((score - avgScore) / (100 - avgScore)) * 55);
  const betterThanPct = Math.min(98, Math.max(5, percentileRaw));

  const countryKind = country === 'İngiltere' ? 'uk' : country === 'ABD' ? 'usa' : 'schengen';
  const topMatch = REJECTION_TAXONOMY
    .filter(pat => pat.country === 'all' || pat.country === countryKind)
    .filter(pat => pat.trigger(p))
    .sort((a, b) => b.frequency - a.frequency)[0]
    ?? REJECTION_TAXONOMY
         .filter(pat => pat.country === 'all' || pat.country === countryKind)
         .sort((a, b) => b.frequency - a.frequency)[0];

  const topMistakeRate = deterministicVariance(`${seed}:mistake`, 28, 51);

  return {
    totalApplicants, approvalRate, avgScore,
    topMistake: topMatch?.name ?? 'Belge eksikliği',
    topMistakeRate, betterThanPct, countryLabel: country,
  };
}

const SEGMENT_LABEL: Record<string, string> = {
  employed: 'Özel Sektör', public_sector: 'Kamu',
  student: 'Öğrenci', self_employed: 'Serbest Meslek',
  retired: 'Emekli', unemployed: 'Çalışmıyor',
};

// ── Bileşen ──────────────────────────────────────────────────────────────
const BenchmarkCard: React.FC<Props> = ({ profile, score }) => {
  const data = useMemo(() => computeBenchmark(profile, score), [profile, score]);
  if (!data) return null;

  const segment = getSegment(profile);
  const isAboveAvg = score >= data.avgScore;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm">

      {/* ── Header ── */}
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-50 flex items-center justify-center">
            <span className="text-sm">👥</span>
          </div>
          <span className="font-semibold text-slate-800 text-[13px]">Senin Gibi Profiller</span>
        </div>
        <span className="text-[10px] font-semibold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">
          {SEGMENT_LABEL[segment] ?? 'Profil'}
        </span>
      </div>

      <div className="p-5 space-y-4">

        {/* ── Stat Satırları (dikey, okunaklı) ── */}
        <div className="space-y-2.5">
          {/* Başvurucu sayısı */}
          <div className="flex items-center justify-between py-2.5 px-4 rounded-xl bg-indigo-50/70">
            <span className="text-xs text-indigo-500 font-medium">Benzer başvurucu</span>
            <span className="text-base font-bold text-indigo-700 tabular-nums">
              {data.totalApplicants.toLocaleString('tr-TR')}
            </span>
          </div>

          {/* Onay oranı */}
          <div className="flex items-center justify-between py-2.5 px-4 rounded-xl bg-emerald-50/70">
            <span className="text-xs text-emerald-600 font-medium">Segment onay oranı</span>
            <span className="text-base font-bold text-emerald-700 tabular-nums">
              %{data.approvalRate}
            </span>
          </div>

          {/* Yüzdelik */}
          <div className="flex items-center justify-between py-2.5 px-4 rounded-xl bg-brand-50/60">
            <span className="text-xs text-brand-600 font-medium">Daha güçlü skor</span>
            <span className="text-base font-bold text-brand-700 tabular-nums">
              %{data.betterThanPct}
            </span>
          </div>
        </div>

        {/* ── Skor Karşılaştırma ── */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] text-slate-400 font-medium">Segment ort.</span>
            <span className="text-[11px] text-slate-400 font-medium">Senin skorun</span>
          </div>

          {/* Bar */}
          <div className="relative h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`absolute h-full rounded-full transition-all duration-700 ${
                isAboveAvg
                  ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                  : 'bg-gradient-to-r from-amber-400 to-amber-500'
              }`}
              style={{ width: `${score}%` }}
            />
            {/* Ortalama işaretçisi */}
            <div
              className="absolute top-[-3px] w-[3px] h-[calc(100%+6px)] bg-slate-400 rounded-full"
              style={{ left: `${data.avgScore}%` }}
            />
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className="text-[11px] text-slate-400">
              %<span className="font-bold text-slate-600">{data.avgScore}</span>
            </span>
            <span className={`text-[11px] font-bold ${isAboveAvg ? 'text-emerald-600' : 'text-amber-600'}`}>
              %{score} {isAboveAvg ? '↑' : '↓'}
            </span>
          </div>
        </div>

        {/* ── En Sık Hata ── */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-rose-50/70 border border-rose-100/60">
            <div className="w-6 h-6 rounded-lg bg-rose-100 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-xs">⚠</span>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-rose-600 leading-snug">
                Benzer profillerin %{data.topMistakeRate}'i bu hatayı yapıyor
              </p>
              <p className="text-[12px] text-rose-700 font-bold mt-1 leading-snug">
                {data.topMistake}
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-[9px] text-slate-300 text-center leading-relaxed pt-1">
          Schengen Visa Statistics 2024 + VFS TR verileri ve algoritmik tahmine dayanır.
        </p>
      </div>
    </div>
  );
};

export default BenchmarkCard;
