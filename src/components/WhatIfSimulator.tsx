// ============================================================
// WhatIfSimulator — "Ne Yaparsam Skorum Ne Olur?" Paneli
// Her seçenek işaretlendiğinde calculateScore yeniden çağrılır.
// ============================================================
import { useState, useMemo } from 'react';
import { Zap, TrendingUp, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import type { ProfileData } from '../types';
import { calculateScore } from '../scoring/core';

interface Scenario {
  id: string;
  label: string;
  description: string;
  patch: Partial<ProfileData>;
  /** Sadece belirli ülkelerde göster (undefined = hepsinde) */
  onlyFor?: string[];
  /** Zaten aktifse gösterme */
  skipIf: (p: ProfileData) => boolean;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'cover_letter',
    label: 'Niyet mektubu hazırla',
    description: 'Şablonumuzu kullan + amacını net belirt',
    patch: { purposeClear: true, useOurTemplate: true },
    skipIf: p => p.purposeClear && p.useOurTemplate,
  },
  {
    id: 'hotel',
    label: 'Otel + uçak rezervasyonu yap',
    description: 'İptal edilebilir ön rezervasyon yeterli',
    patch: { paidReservations: true, datesMatchReservations: true },
    skipIf: p => p.paidReservations && p.datesMatchReservations,
  },
  {
    id: 'insurance',
    label: 'Seyahat sigortası yaptır (€30.000+)',
    description: 'Schengen için zorunlu — %15 ret sebebi',
    patch: { hasHealthInsurance: true, hasTravelInsurance: true },
    skipIf: p => p.hasHealthInsurance || p.hasTravelInsurance,
  },
  {
    id: 'employer_letter',
    label: 'İşveren + geri dönüş mektubu al',
    description: 'SGK\'lı çalışanlar için güçlü kanıt',
    patch: { sgkEmployerLetterWithReturn: true },
    skipIf: p => p.sgkEmployerLetterWithReturn,
  },
  {
    id: 'return_ticket',
    label: 'Dönüş bileti rezervasyonu yap',
    description: 'Geri dönme niyetini somutlaştırır',
    patch: { hasReturnTicket: true },
    skipIf: p => p.hasReturnTicket,
  },
  {
    id: 'barcode_sgk',
    label: 'Barkodlu SGK belgesi ekle',
    description: 'QR kodlu resmi baskı — sahtecilik ihtimalini sıfırlar',
    patch: { hasBarcodeSgk: true, sgkAddressMatchesDs160: true },
    skipIf: p => p.hasBarcodeSgk,
  },
  {
    id: 'bank_regularity',
    label: 'Banka düzenliliğini artır (3 ay)',
    description: 'Düzenli harcama + gelir hareketi göster',
    patch: { bankRegularity: true, incomeSourceClear: true },
    skipIf: p => p.bankRegularity && p.incomeSourceClear,
  },
  {
    id: 'passport_validity',
    label: 'Uzun geçerli pasaport al / yenile',
    description: 'Uzun geçerlilik konsolosluğa güven verir',
    patch: { passportValidityLong: true, passportConditionGood: true },
    skipIf: p => p.passportValidityLong,
  },
  {
    id: 'uk_28day',
    label: '28 gün boyunca para hesapta beklet (UK)',
    description: 'İngiltere için en kritik finansal kural',
    patch: { has28DayHolding: true },
    onlyFor: ['İngiltere'],
    skipIf: p => p.has28DayHolding,
  },
  {
    id: 'uk_6month',
    label: '6 aylık banka ekstresi hazırla (UK)',
    description: 'İngiltere standart gereksinimi',
    patch: { has6MonthStatements: true, statementMonths: 6 },
    onlyFor: ['İngiltere'],
    skipIf: p => p.has6MonthStatements,
  },
  {
    id: 'interview_prep',
    label: 'Mülakat hazırlığı yap (ABD)',
    description: 'B1/B2 soruları için pratik — güven sinyali',
    patch: { interviewPrepared: true, interviewConfidence: 'high' },
    onlyFor: ['ABD'],
    skipIf: p => p.interviewPrepared && p.interviewConfidence === 'high',
  },
];

interface Props {
  profile: ProfileData;
  currentScore: number;
}

export function WhatIfSimulator({ profile, currentScore }: Props) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState(true);

  // Ülkeye göre ve zaten aktif olmayan senaryoları filtrele
  const visible = useMemo(() =>
    SCENARIOS.filter(s => {
      if (s.skipIf(profile)) return false;
      if (s.onlyFor && !s.onlyFor.includes(profile.targetCountry)) return false;
      return true;
    }),
  [profile]);

  // Her senaryo için bireysel delta
  const deltas = useMemo(() =>
    visible.map(s => {
      const projected = calculateScore({ ...profile, ...s.patch });
      return projected - currentScore;
    }),
  [visible, profile, currentScore]);

  // Seçili senaryoların birleşik patchi
  const combinedPatch = useMemo(() => {
    const merged: Partial<ProfileData> = {};
    visible.forEach((s, i) => {
      if (checked.has(s.id)) Object.assign(merged, s.patch);
    });
    return merged;
  }, [checked, visible]);

  const projectedScore = useMemo(() =>
    Object.keys(combinedPatch).length > 0
      ? calculateScore({ ...profile, ...combinedPatch })
      : currentScore,
  [combinedPatch, profile, currentScore]);

  const totalGain = projectedScore - currentScore;

  const toggle = (id: string) => {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  if (visible.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {/* Başlık */}
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 border-b border-slate-100 hover:bg-slate-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-violet-50 rounded-xl flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-violet-600" />
          </div>
          <div>
            <div className="font-black text-slate-900 text-sm">Ne Yaparsam Skorum Ne Olur?</div>
            <div className="text-xs text-slate-400">İşaretlediğiniz adımların anlık etkisini görün</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {checked.size > 0 && (
            <span className="text-xs font-black text-violet-700 bg-violet-100 px-2.5 py-1 rounded-full">
              +{totalGain} puan
            </span>
          )}
          {expanded
            ? <ChevronUp className="w-4 h-4 text-slate-400" />
            : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </button>

      {expanded && (
        <div className="p-5">
          {/* Özet banner — seçim varsa göster */}
          {checked.size > 0 && (
            <div className={`mb-4 flex items-center justify-between p-3 rounded-xl border ${
              totalGain > 0 ? 'bg-violet-50 border-violet-200' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="text-sm text-slate-600">
                <span className="font-bold text-slate-900">{checked.size}</span> adım seçildi
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">%{currentScore}</span>
                <span className="text-slate-400">→</span>
                <span className={`text-lg font-black ${totalGain > 0 ? 'text-violet-700' : 'text-slate-700'}`}>
                  %{projectedScore}
                </span>
                {totalGain > 0 && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                    <TrendingUp className="w-3 h-3" />+{totalGain}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Senaryo listesi */}
          <div className="space-y-2">
            {visible.map((s, i) => {
              const delta = deltas[i];
              const isChecked = checked.has(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggle(s.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all hover:shadow-sm ${
                    isChecked
                      ? 'border-violet-300 bg-violet-50'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  {/* Checkbox */}
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                    isChecked ? 'bg-violet-600 border-violet-600' : 'border-slate-300'
                  }`}>
                    {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </div>

                  {/* Metin */}
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-bold truncate ${isChecked ? 'text-violet-900' : 'text-slate-800'}`}>
                      {s.label}
                    </div>
                    <div className="text-xs text-slate-400 truncate">{s.description}</div>
                  </div>

                  {/* Delta rozeti */}
                  <div className={`shrink-0 text-xs font-black px-2.5 py-1 rounded-full ${
                    delta > 0
                      ? 'bg-emerald-100 text-emerald-700'
                      : delta < 0
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {delta > 0 ? '+' : ''}{delta}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Alt not */}
          <p className="mt-3 text-[10px] text-slate-400 text-center">
            Tahminler mevcut profilinize göre hesaplanır. Gerçek skor birden fazla faktörden etkilenir.
          </p>
        </div>
      )}
    </div>
  );
}
