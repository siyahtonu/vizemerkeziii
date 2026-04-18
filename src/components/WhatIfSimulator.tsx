// ============================================================
// WhatIfSimulator — "Ne Yaparsam Skorum Ne Olur?" Paneli
//
// İki bölüm:
//   1) "Yapılanlar" — aktif olan adımlar, yeşil rozetle + puan etkisi
//   2) "Yapılabilecekler" — eksik olan adımlar, kırmızı rozet + eksilen puan
//
// v3.6: Baseline bug'ı düzeltildi — simulatorValue prop'u parent'tan gelir,
// tüm calculateScore çağrıları aynı simValue ile yapılır (aksi halde delta
// kayıyordu).
// ============================================================
import { useState, useMemo } from 'react';
import { Zap, TrendingUp, CheckCircle2, ChevronDown, ChevronUp, XCircle } from 'lucide-react';
import type { ProfileData } from '../types';
import { calculateScore } from '../scoring/core';

interface Scenario {
  id: string;
  label: string;
  description: string;
  patch: Partial<ProfileData>;
  /** Sadece belirli ülkelerde göster (undefined = hepsinde) */
  onlyFor?: string[];
  /** Bu şart sağlanıyorsa senaryo "aktif" sayılır. */
  isActive: (p: ProfileData) => boolean;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'cover_letter',
    label: 'Niyet mektubu hazırla',
    description: 'Şablonumuzu kullan + amacını net belirt',
    patch: { purposeClear: true, useOurTemplate: true },
    isActive: p => p.purposeClear && p.useOurTemplate,
  },
  {
    id: 'hotel',
    label: 'Otel + uçak rezervasyonu yap',
    description: 'İptal edilebilir ön rezervasyon yeterli',
    patch: { paidReservations: true, datesMatchReservations: true },
    isActive: p => p.paidReservations && p.datesMatchReservations,
  },
  {
    id: 'insurance',
    label: 'Seyahat sigortası yaptır (€30.000+)',
    description: 'Schengen için zorunlu — %15 ret sebebi',
    patch: { hasHealthInsurance: true, hasTravelInsurance: true },
    isActive: p => p.hasHealthInsurance || p.hasTravelInsurance,
  },
  {
    id: 'employer_letter',
    label: 'İşveren + geri dönüş mektubu al',
    description: 'SGK\'lı çalışanlar için güçlü kanıt',
    patch: { sgkEmployerLetterWithReturn: true },
    isActive: p => p.sgkEmployerLetterWithReturn,
  },
  {
    id: 'return_ticket',
    label: 'Dönüş bileti rezervasyonu yap',
    description: 'Geri dönme niyetini somutlaştırır',
    patch: { hasReturnTicket: true },
    isActive: p => p.hasReturnTicket,
  },
  {
    id: 'barcode_sgk',
    label: 'Barkodlu SGK belgesi ekle',
    description: 'QR kodlu resmi baskı — sahtecilik ihtimalini sıfırlar',
    patch: { hasBarcodeSgk: true, sgkAddressMatchesDs160: true },
    isActive: p => p.hasBarcodeSgk,
  },
  {
    id: 'bank_regularity',
    label: 'Banka düzenliliğini artır (3 ay)',
    description: 'Düzenli harcama + gelir hareketi göster',
    patch: { bankRegularity: true, incomeSourceClear: true },
    isActive: p => p.bankRegularity && p.incomeSourceClear,
  },
  {
    id: 'passport_validity',
    label: 'Uzun geçerli pasaport al / yenile',
    description: 'Uzun geçerlilik konsolosluğa güven verir',
    patch: { passportValidityLong: true, passportConditionGood: true },
    isActive: p => p.passportValidityLong,
  },
  {
    id: 'uk_28day',
    label: '28 gün boyunca para hesapta beklet (UK)',
    description: 'İngiltere için en kritik finansal kural',
    patch: { has28DayHolding: true },
    onlyFor: ['İngiltere'],
    isActive: p => p.has28DayHolding,
  },
  {
    id: 'uk_6month',
    label: '6 aylık banka ekstresi hazırla (UK)',
    description: 'İngiltere standart gereksinimi',
    patch: { has6MonthStatements: true, statementMonths: 6 },
    onlyFor: ['İngiltere'],
    isActive: p => p.has6MonthStatements,
  },
  {
    id: 'interview_prep',
    label: 'Mülakat hazırlığı yap (ABD)',
    description: 'B1/B2 soruları için pratik — güven sinyali',
    patch: { interviewPrepared: true, interviewConfidence: 'high' },
    onlyFor: ['ABD'],
    isActive: p => p.interviewPrepared && p.interviewConfidence === 'high',
  },
];

interface Props {
  profile: ProfileData;
  currentScore: number;
  /** Parent'taki simulatorValue — aynı skor pipeline'ını kullanmak için şart. */
  simulatorValue?: number;
}

export function WhatIfSimulator({ profile, currentScore, simulatorValue = 0 }: Props) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState(true);

  // Ülkeye göre filtrele
  const visible = useMemo(() =>
    SCENARIOS.filter(s => !s.onlyFor || s.onlyFor.includes(profile.targetCountry)),
  [profile.targetCountry]);

  // Aktif / eksik ayır
  const active  = visible.filter(s =>  s.isActive(profile));
  const missing = visible.filter(s => !s.isActive(profile));

  // Her aktif senaryo için "kazandıran puan" (kapatınca ne düşer)
  const activeContributions = useMemo(() =>
    active.map(s => {
      const invertedPatch: Partial<ProfileData> = {};
      for (const key of Object.keys(s.patch) as Array<keyof ProfileData>) {
        // boolean alanları tersine çevir, enum'ları eski değere döndürmek için özel durum
        const val = s.patch[key];
        if (typeof val === 'boolean') (invertedPatch as Record<string, unknown>)[key] = false;
      }
      const without = calculateScore({ ...profile, ...invertedPatch }, simulatorValue);
      return currentScore - without; // pozitif sayı: aktif olmanın katkısı
    }),
  [active, profile, simulatorValue, currentScore]);

  // Her eksik senaryo için "kazanılacak puan"
  const missingGains = useMemo(() =>
    missing.map(s => {
      const projected = calculateScore({ ...profile, ...s.patch }, simulatorValue);
      return projected - currentScore; // pozitif sayı: eklenirse kazanç
    }),
  [missing, profile, simulatorValue, currentScore]);

  // Seçili senaryoların birleşik patchi
  const combinedPatch = useMemo(() => {
    const merged: Partial<ProfileData> = {};
    missing.forEach(s => {
      if (checked.has(s.id)) Object.assign(merged, s.patch);
    });
    return merged;
  }, [checked, missing]);

  const projectedScore = useMemo(() =>
    Object.keys(combinedPatch).length > 0
      ? calculateScore({ ...profile, ...combinedPatch }, simulatorValue)
      : currentScore,
  [combinedPatch, profile, simulatorValue, currentScore]);

  const totalGain = projectedScore - currentScore;

  const toggle = (id: string) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
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
            <div className="font-bold text-slate-900 text-sm">Ne Yaparsam Skorum Ne Olur?</div>
            <div className="text-xs text-slate-400">Yaptıkların artı, eksik olanlar eksi puan olarak görünür</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {checked.size > 0 && (
            <span className="text-xs font-bold text-violet-700 bg-violet-100 px-2.5 py-1 rounded-full">
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
          {/* Özet banner */}
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
                <span className={`text-lg font-bold ${totalGain > 0 ? 'text-violet-700' : 'text-slate-700'}`}>
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

          {/* ── YAPILANLAR (aktif, pozitif katkı) ───────────────────────── */}
          {active.length > 0 && (
            <div className="mb-5">
              <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-2">
                Yaptıkların ({active.length})
              </div>
              <div className="space-y-2">
                {active.map((s, i) => {
                  const gain = activeContributions[i];
                  return (
                    <div
                      key={s.id}
                      className="w-full flex items-center gap-3 p-3 rounded-xl border border-emerald-200 bg-emerald-50/40"
                    >
                      <div className="w-5 h-5 rounded-md bg-emerald-600 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-emerald-900 truncate">{s.label}</div>
                        <div className="text-xs text-emerald-700/70 truncate">{s.description}</div>
                      </div>
                      <div className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
                        {gain > 0 ? `+${gain}` : gain === 0 ? '✓' : gain}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── EKSİKLER (yapılabilecekler) ──────────────────────────────── */}
          {missing.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-rose-700 uppercase tracking-wide mb-2">
                Yapabileceklerin ({missing.length}) — tıkla, etkisini gör
              </div>
              <div className="space-y-2">
                {missing.map((s, i) => {
                  const gain = missingGains[i];
                  const isChecked = checked.has(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggle(s.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all hover:shadow-sm ${
                        isChecked
                          ? 'border-violet-300 bg-violet-50'
                          : 'border-rose-200 bg-rose-50/30 hover:border-rose-300'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                        isChecked ? 'bg-violet-600 border-violet-600' : 'border-rose-300 bg-white'
                      }`}>
                        {isChecked
                          ? <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                          : <XCircle className="w-3.5 h-3.5 text-rose-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-bold truncate ${isChecked ? 'text-violet-900' : 'text-slate-800'}`}>
                          {s.label}
                        </div>
                        <div className="text-xs text-slate-400 truncate">{s.description}</div>
                      </div>
                      <div className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${
                        gain > 0 ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {gain > 0 ? `−${gain}` : '0'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Alt not */}
          <p className="mt-3 text-[10px] text-slate-400 text-center">
            Yeşil rozet: aktif — bu adımı kaldırırsan kaybedeceğin puan. Kırmızı rozet: eksik — eklersen kazanacağın puan.
          </p>
        </div>
      )}
    </div>
  );
}
