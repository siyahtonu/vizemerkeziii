// ============================================================
// StepProgress — funnel adım göstergesi
// ● Ülke  ● Profil  ◉ Değerlendirme  ○ Analiz  ○ Mektup
// Hero adımında gizlenir. Kullanıcıya nerede olduğunu ve
// kaç dakika kaldığını gösterir.
// ============================================================

import React from 'react';

type AppStep = 'hero' | 'onboarding' | 'assessment' | 'dashboard' | 'letter' | 'tactics';

interface FlowStep {
  key: AppStep;
  label: string;
  minutes: number; // remaining time when ON this step
}

const FLOW: FlowStep[] = [
  { key: 'onboarding', label: 'Ülke',          minutes: 4 },
  { key: 'assessment', label: 'Profil',         minutes: 3 },
  { key: 'dashboard',  label: 'Analiz',         minutes: 2 },
  { key: 'letter',     label: 'Mektup / Plan',  minutes: 1 },
];

// tactics and letter share the same visual position
function normalise(s: AppStep): AppStep {
  return s === 'tactics' ? 'letter' : s;
}

function flowIndex(s: AppStep): number {
  return FLOW.findIndex(f => f.key === normalise(s));
}

interface Props {
  currentStep: AppStep;
  onNavigate?: (step: AppStep) => void;
}

export function StepProgress({ currentStep, onNavigate }: Props) {
  if (currentStep === 'hero') return null;

  const currentIdx = flowIndex(currentStep);
  const flowStep   = FLOW[currentIdx];
  const remaining  = flowStep?.minutes ?? 0;
  // progress bar: midpoint of each step fills proportionally
  const pct = currentIdx < 0
    ? 100
    : Math.round(((currentIdx + 0.5) / FLOW.length) * 100);

  return (
    <div className="bg-white border-b border-slate-100 px-4 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto space-y-1.5">

        {/* Step dots row */}
        <div className="flex items-center">
          {FLOW.map((s, i) => {
            const isDone    = i < currentIdx;
            const isCurrent = i === currentIdx;
            return (
              <React.Fragment key={s.key}>
                <button
                  type="button"
                  onClick={() => onNavigate?.(s.key)}
                  className={`flex items-center gap-1 text-[10px] sm:text-xs font-semibold transition-colors ${
                    isDone    ? 'text-emerald-600' :
                    isCurrent ? 'text-slate-800'   : 'text-slate-300 cursor-default'
                  }`}
                  disabled={!isDone && !isCurrent}
                >
                  <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 transition-all ${
                    isDone    ? 'bg-emerald-500 text-white' :
                    isCurrent ? 'bg-slate-900 text-white ring-2 ring-slate-900 ring-offset-1' :
                                'bg-slate-100 text-slate-400'
                  }`}>
                    {isDone ? '✓' : i + 1}
                  </div>
                  <span className={`hidden sm:inline ${isCurrent ? 'font-bold' : ''}`}>
                    {s.label}
                  </span>
                </button>

                {i < FLOW.length - 1 && (
                  <div className={`flex-1 h-px mx-1 sm:mx-2 transition-colors ${
                    i < currentIdx ? 'bg-emerald-300' : 'bg-slate-100'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Progress bar + time hint */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-indigo-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
          {remaining > 0 && (
            <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">
              ~{remaining} dk kaldı
            </span>
          )}
          {remaining === 0 && currentIdx >= 0 && (
            <span className="text-[10px] text-emerald-500 whitespace-nowrap shrink-0 font-bold">
              ✓ Tamamlandı
            </span>
          )}
        </div>

      </div>
    </div>
  );
}
