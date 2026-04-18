// ── Araştırma İçgörüleri Widget'ı ──────────────────────────────────────────
// İki bölüm:
//   1) Olası Ret Sebepleri — profil + ülke sinyallerinden top 3 tahmin
//   2) Benzer Profiller — kürasyonlu vaka havuzundan eşleşen anonim örnekler
//
// Veri kaynağı: src/scoring/rejectionReasons.ts + src/data/researchCases.ts
// (Türk forum/sözlük/şikayet platformu örüntülerinden damıtılmış.)

import { useMemo } from 'react';
import type { ProfileData } from '../types';
import { predictRejectionReasons, type PredictorSignals } from '../scoring/rejectionReasons';
import { findSimilarCases, type ResearchCase } from '../data/researchCases';

interface Props {
  profile: ProfileData;
}

// ── Profil → Predictor sinyalleri ─────────────────────────────────────────
function toSignals(p: ProfileData): PredictorSignals {
  const income = Number(p.monthlyIncome) || 0;
  const employmentType: PredictorSignals['employmentType'] =
    p.isStudent ? 'student' :
    p.isPublicSectorEmployee ? 'public_sector' :
    p.hasSgkJob ? 'employed' :
    'unemployed';

  return {
    country: p.targetCountry,
    monthlyIncomeTRY: income > 0 ? income : undefined,
    employmentType,
    hasPriorSchengen: p.hasOtherVisa,
    hasPriorUsUk: p.hasHighValueVisa,
    hasAnyTravel: p.hasOtherVisa || p.hasHighValueVisa || p.travelHistoryNonVisa,
    hasPropertyOrCar: p.hasAssets,
    maritalStatus: p.hasChildren ? 'evli_çocuklu' : p.isMarried ? 'evli' : 'bekar',
    ageYears: p.applicantAge > 0 ? p.applicantAge : undefined,
    hasPriorVisaViolation: !p.noOverstayHistory,
  };
}

// ── Profil → similar case arama anahtarı ───────────────────────────────────
function toCaseQuery(p: ProfileData) {
  const age = p.applicantAge;
  const ageBucket: ResearchCase['profile']['ageBucket'] =
    age >= 55 ? '55+' : age >= 45 ? '45-54' : age >= 35 ? '35-44' : age >= 25 ? '25-34' : '18-24';
  const profession: ResearchCase['profile']['profession'] =
    p.isStudent ? 'öğrenci' :
    p.isPublicSectorEmployee ? 'devlet_memuru' :
    p.hasSgkJob ? 'beyaz_yaka_özel' :
    'işsiz';
  const travelHistory: ResearchCase['profile']['travelHistory'] =
    p.hasHighValueVisa ? 'abd_uk_var' :
    p.hasOtherVisa ? 'schengen_var' :
    p.travelHistoryNonVisa ? 'sadece_kolay_ülke' :
    'hiç_yok';
  const maritalStatus: ResearchCase['profile']['maritalStatus'] =
    p.hasChildren ? 'evli_çocuklu' : p.isMarried ? 'evli' : 'bekar';

  return { country: p.targetCountry, profession, ageBucket, maritalStatus, travelHistory };
}

export default function ResearchInsightsWidget({ profile }: Props) {
  const predictions = useMemo(() => predictRejectionReasons(toSignals(profile), 3), [profile]);
  const similar = useMemo(() => findSimilarCases(toCaseQuery(profile), 4), [profile]);

  if (!profile.targetCountry) return null;

  return (
    <div className="space-y-5">
      {/* Olası Ret Sebepleri */}
      <section>
        <h3 className="text-sm font-semibold text-slate-800 mb-2">
          Olası ret sebepleri — {profile.targetCountry}
        </h3>
        <p className="text-xs text-slate-500 mb-3">
          Profil sinyallerin ve {profile.targetCountry} için toplanan red örüntüleriyle hesaplandı.
        </p>
        <ul className="space-y-2">
          {predictions.map(({ reason, weight, severity }) => (
            <li key={reason.key} className="border border-slate-200 rounded p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="font-medium text-sm text-slate-800">{reason.label}</div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full whitespace-nowrap ${
                  severity === 'yüksek' ? 'bg-red-50 text-red-700 border border-red-200' :
                  severity === 'orta' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                  'bg-slate-50 text-slate-600 border border-slate-200'
                }`}>
                  %{(weight * 100).toFixed(0)} · {severity}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">{reason.description}</p>
              <p className="text-xs text-emerald-700 mt-1.5">
                <span className="font-medium">Önlem:</span> {reason.preventiveAction}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Benzer Profiller */}
      <section>
        <h3 className="text-sm font-semibold text-slate-800 mb-2">
          Senin profiline benzer vakalar
        </h3>
        {similar.length === 0 ? (
          <p className="text-xs text-slate-500">
            Bu ülke için profilinle yakın eşleşen anonim vaka bulunamadı. Vaka havuzu büyüdükçe burası güncellenir.
          </p>
        ) : (
          <ul className="space-y-2">
            {similar.map(({ case: c, similarity }) => (
              <li key={c.id} className="border border-slate-200 rounded p-3">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <div className="text-xs font-mono text-slate-500">
                    {c.country} · {c.year} · {c.profile.profession} · {c.profile.ageBucket}
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${
                    c.outcome === 'kabul' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {c.outcome === 'kabul' ? 'KABUL' : 'RED'}{c.article ? ` · M.${c.article}` : ''}
                  </span>
                </div>
                <p className="text-sm text-slate-700">{c.summary}</p>
                {c.learning && (
                  <p className="text-xs text-slate-500 italic mt-1">→ {c.learning}</p>
                )}
                <div className="text-[10px] text-slate-400 mt-1 font-mono">benzerlik: %{similarity}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
