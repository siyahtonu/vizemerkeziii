import React from 'react';
import { Check } from 'lucide-react';

type AppStep = 'hero' | 'onboarding' | 'assessment' | 'dashboard' | 'letter' | 'tactics';

interface FlowStep {
  key: AppStep;
  label: string;
}

const FLOW: FlowStep[] = [
  { key: 'onboarding', label: 'Başla' },
  { key: 'assessment', label: 'Profil' },
  { key: 'dashboard',  label: 'Analiz' },
  { key: 'letter',     label: 'Mektup' },
];

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

  return (
    <div className="bg-white/80 backdrop-blur-lg border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            type="button"
            onClick={() => onNavigate?.('hero')}
            className="flex items-center gap-2 font-display font-bold text-lg text-slate-900 hover:text-brand-600 transition-colors shrink-0"
          >
            <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="hidden sm:inline">VizeAkıl</span>
          </button>

          {/* Steps */}
          <div className="flex items-center gap-1">
            {FLOW.map((s, i) => {
              const isDone = i < currentIdx;
              const isCurrent = i === currentIdx;
              const canClick = isDone || isCurrent;

              return (
                <React.Fragment key={s.key}>
                  <button
                    type="button"
                    onClick={() => canClick && onNavigate?.(s.key)}
                    disabled={!canClick}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isCurrent
                        ? 'bg-brand-50 text-brand-700'
                        : isDone
                        ? 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                        : 'text-slate-300 cursor-default'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                      isDone
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                        ? 'bg-brand-600 text-white'
                        : 'bg-slate-100 text-slate-400'
                    }`}>
                      {isDone ? <Check className="w-3 h-3" /> : i + 1}
                    </div>
                    <span className="hidden sm:inline">{s.label}</span>
                  </button>

                  {i < FLOW.length - 1 && (
                    <div className={`w-4 sm:w-8 h-px transition-colors ${
                      i < currentIdx ? 'bg-emerald-300' : 'bg-slate-150'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Spacer for balance */}
          <div className="w-7 sm:w-24 shrink-0" />
        </div>
      </div>
    </div>
  );
}
