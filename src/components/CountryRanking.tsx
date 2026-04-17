// ============================================================
// CountryRanking — "Hangi Ülkeye Başvurmalıyım?"
// Mevcut profil üzerinden 15 ülkenin skorunu hesaplar
// ============================================================
import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Globe, TrendingUp } from 'lucide-react';
import type { ProfileData } from '../types';
import { calculateScore } from '../scoring/core';
import { TR_REJECTION_RATES } from '../scoring/matrices';

const VISA_TYPES: Record<string, string> = {
  'Almanya':    'Schengen',
  'Avusturya':  'Schengen',
  'Fransa':     'Schengen',
  'İtalya':     'Schengen',
  'İspanya':    'Schengen',
  'Yunanistan': 'Schengen',
  'Portekiz':   'Schengen',
  'Hollanda':   'Schengen',
  'Belçika':    'Schengen',
  'Polonya':    'Schengen',
  'Macaristan': 'Schengen',
  'Danimarka':  'Schengen',
  'İsveç':      'Schengen',
  'Norveç':     'Schengen',
  'İngiltere':  'UK Visa',
  'ABD':        'B1/B2',
};

const FLAGS: Record<string, string> = {
  'Almanya':    '🇩🇪', 'Avusturya': '🇦🇹', 'Fransa':    '🇫🇷',
  'İtalya':     '🇮🇹', 'İspanya':   '🇪🇸', 'Yunanistan':'🇬🇷',
  'Portekiz':   '🇵🇹', 'Hollanda':  '🇳🇱', 'Belçika':   '🇧🇪',
  'Polonya':    '🇵🇱', 'Macaristan':'🇭🇺', 'Danimarka': '🇩🇰',
  'İsveç':      '🇸🇪', 'Norveç':    '🇳🇴', 'İngiltere': '🇬🇧',
  'ABD':        '🇺🇸',
};

const MEDALS = ['🥇', '🥈', '🥉'];

// Ülkelere göre kısa stratejik not
function getCountryNote(country: string, rank: number, topCountry: string): string {
  if (country === 'Yunanistan' || country === 'Macaristan' || country === 'İtalya') {
    return 'Düşük ret oranı — Schengen geçmişi oluşturmak için ideal başlangıç noktası.';
  }
  if (country === 'Almanya' || country === 'Fransa') {
    return 'Güçlü profil gerektirir. Önce daha kolay bir Schengen onayı almanız skoru artırır.';
  }
  if (country === 'İngiltere') {
    return 'UK vizesi bağımsız sistem — 28 gün kural ve 6 aylık ekstre kritik.';
  }
  if (country === 'ABD') {
    return '214(b) testi: geri dönüş bağlarını somut kanıtlarla ispatlayın.';
  }
  if (country === 'Danimarka') {
    return '%66 ret oranı — profilinizi önemli ölçüde güçlendirmeden riskli.';
  }
  if (rank === 0) return 'En yüksek onay ihtimaliniz bu ülkede — önce buraya başvurun.';
  return `${topCountry}'dan onay aldıktan 6+ ay sonra başvurmak güçlü Schengen geçmişi sağlar.`;
}

interface RankedCountry {
  name: string;
  score: number;
  flag: string;
  visaType: string;
  rejRate: number;
}

interface Props {
  profile: ProfileData;
  currentScore: number;
}

export function CountryRanking({ profile, currentScore }: Props) {
  const [expanded, setExpanded] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const ranked = useMemo<RankedCountry[]>(() => {
    return Object.keys(TR_REJECTION_RATES)
      .map(country => ({
        name: country,
        score: calculateScore({ ...profile, targetCountry: country }),
        flag: FLAGS[country] ?? '🌐',
        visaType: VISA_TYPES[country] ?? 'Vize',
        rejRate: TR_REJECTION_RATES[country],
      }))
      .sort((a, b) => b.score - a.score);
  }, [profile]);

  const top3    = ranked.slice(0, 3);
  const rest    = ranked.slice(3);
  const topName = top3[0]?.name ?? '';

  // Stratejik özet mesajı
  const strategicMessage = useMemo(() => {
    if (!top3[0]) return '';
    const easy    = top3[0];
    const target  = profile.targetCountry;
    const targetR = ranked.find(r => r.name === target);
    if (target === easy.name) {
      return `Doğru ülkeyi hedefliyorsunuz! ${easy.name} profilinize en uygun ülke.`;
    }
    const easyRank = ranked.findIndex(r => r.name === easy.name) + 1;
    const tgtRank  = ranked.findIndex(r => r.name === target) + 1;
    if (tgtRank > 3) {
      return `${target} profiliniz için ${tgtRank}. sırada. Önce ${easy.name}'a başvurarak Schengen geçmişi oluşturun, ardından ${target} başvurunuz %${(targetR?.score ?? 0) + 8}+'a çıkabilir.`;
    }
    return `${easy.name}'dan onay aldıktan 6 ay sonra ${target}'a başvurmanız başarı şansını artırır.`;
  }, [ranked, profile.targetCountry, top3]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {/* Başlık */}
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 border-b border-slate-100 hover:bg-slate-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
            <Globe className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div className="font-bold text-slate-900 text-sm">Hangi Ülkeye Başvurmalıyım?</div>
            <div className="text-xs text-slate-400">Profilinize göre {ranked.length} ülke onay olasılığı — büyükten küçüğe</div>
          </div>
        </div>
        {expanded
          ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
          : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
      </button>

      {expanded && (
        <div className="p-5 space-y-4">
          {/* Stratejik mesaj */}
          {strategicMessage && (
            <div className="flex items-start gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
              <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-700 leading-relaxed">{strategicMessage}</p>
            </div>
          )}

          {/* Top 3 podyum */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {top3.map((c, rank) => {
              const isCurrent = c.name === profile.targetCountry;
              return (
                <div
                  key={c.name}
                  className={`p-4 rounded-xl border-2 space-y-2 ${
                    rank === 0
                      ? 'border-amber-300 bg-amber-50'
                      : rank === 1
                      ? 'border-slate-300 bg-slate-50'
                      : 'border-orange-200 bg-orange-50/50'
                  } ${isCurrent ? 'ring-2 ring-brand-400' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl">{MEDALS[rank]}</span>
                    <span className="text-lg">{c.flag}</span>
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{c.name}</div>
                    <div className="text-[10px] text-slate-500">{c.visaType}</div>
                  </div>
                  <div className="flex items-end gap-1">
                    <span className={`text-2xl font-bold ${
                      c.score >= 75 ? 'text-emerald-600' :
                      c.score >= 60 ? 'text-amber-600' : 'text-rose-600'
                    }`}>%{c.score}</span>
                    <span className="text-xs text-slate-400 pb-0.5">onay</span>
                  </div>
                  {/* Ret oranı */}
                  <div className="text-[10px] text-slate-400">
                    TR ret: %{Math.round(c.rejRate * 100)}
                  </div>
                  {isCurrent && (
                    <div className="text-[10px] font-bold text-brand-600">← Mevcut hedefiniz</div>
                  )}
                  {/* Kısa not */}
                  <p className="text-[10px] text-slate-500 leading-snug border-t border-slate-200 pt-2">
                    {getCountryNote(c.name, rank, topName)}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Diğer ülkeler (açılır) */}
          {rest.length > 0 && (
            <div>
              <button
                type="button"
                onClick={() => setShowAll(v => !v)}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors"
              >
                {showAll ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                {showAll ? 'Daha az göster' : `Diğer ${rest.length} ülkeyi göster`}
              </button>

              {showAll && (
                <div className="mt-3 space-y-1.5">
                  {rest.map((c, i) => {
                    const rank  = i + 3;
                    const isCur = c.name === profile.targetCountry;
                    return (
                      <div
                        key={c.name}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl border ${
                          isCur ? 'border-brand-200 bg-brand-50' : 'border-slate-100'
                        }`}
                      >
                        <span className="w-5 text-xs font-bold text-slate-400 text-center">{rank + 1}.</span>
                        <span className="text-base">{c.flag}</span>
                        <span className="flex-1 text-xs font-bold text-slate-700">{c.name}</span>
                        <span className="text-[10px] text-slate-400">{c.visaType}</span>
                        <span className={`text-xs font-bold ${
                          c.score >= 75 ? 'text-emerald-600' :
                          c.score >= 60 ? 'text-amber-600' : 'text-rose-600'
                        }`}>%{c.score}</span>
                        {isCur && <span className="text-[10px] font-bold text-brand-500">◀</span>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
