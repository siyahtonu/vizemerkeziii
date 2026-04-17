// ============================================================
// ScoreRadarMini — #12 Kompakt 6-Eksen Skor Görselleştirme
// Açık tema — okunaklı boyutlar, tıklanabilir detay
// + #1 Zayıf eksene göre gerçek zamanlı blog önerisi
// ============================================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { ProfileData } from '../types';
import { getDimensionScores, DIMENSION_LABELS, DIMENSION_TIPS } from '../scoring/dimensions';

interface Props {
  profile: ProfileData;
}

const DIMENSION_ICONS: Record<string, string> = {
  financial:    '💰',
  professional: '💼',
  ties:         '🔗',
  travel:       '✈️',
  application:  '📝',
  trust:        '🛡️',
};

const DIMENSION_ACTIONS: Record<string, string> = {
  financial:    'Banka ekstresi düzenle',
  professional: 'SGK + işveren mektubu al',
  ties:         'Mülk / aile belgesi ekle',
  travel:       'Önceki vize geçmişini belirt',
  application:  'Niyet mektubu oluştur',
  trust:        'Seyahat sigortası yaptır',
};

interface BlogLink { title: string; slug: string; }
const DIMENSION_BLOGS: Record<string, BlogLink[]> = {
  financial: [
    { title: 'Banka hesabında ne kadar para olmalı?', slug: 'vize-icin-banka-hesabinda-ne-kadar-para' },
    { title: 'Freelance geliriyle vize başvurusu', slug: 'freelance-ingiltere-vize-basvurusu' },
  ],
  professional: [
    { title: 'Çalışmayan ev hanımı için İtalya vizesi', slug: 'ev-hanimi-italya-schengen-vizesi' },
    { title: 'Emekli için Yunanistan kapı vizesi', slug: 'emekli-yunanistan-kapi-vizesi-2026' },
  ],
  ties: [
    { title: 'Öğrenci ABD B-2 turist vizesi rehberi', slug: 'ogrenci-sponsorsuz-amerika-turist-vizesi' },
    { title: 'Pasaportunda ret varken yeni başvuru', slug: 'pasaportunda-ret-varken-yeni-vize' },
  ],
  travel: [
    { title: 'Pasaportunda ret varken yeni başvuru', slug: 'pasaportunda-ret-varken-yeni-vize' },
    { title: 'Schengen ret kodları C1–C14 rehberi', slug: 'schengen-vize-ret-kodlari-c1-c14' },
  ],
  application: [
    { title: 'İngiltere niyet mektubu nasıl yazılır?', slug: 'ingiltere-tier4-niyet-mektubu' },
    { title: 'Schengen vizesi nasıl alınır? (2026)', slug: 'schengen-vizesi-nasil-alinir' },
  ],
  trust: [
    { title: 'Schengen Madde 8 ret itirazı', slug: 'schengen-reddi-madde-8-itiraz' },
    { title: 'Schengen ret kodları C1–C14 rehberi', slug: 'schengen-vize-ret-kodlari-c1-c14' },
  ],
};

function scoreColor(score: number): string {
  if (score >= 70) return 'text-emerald-600';
  if (score >= 45) return 'text-amber-600';
  return 'text-rose-500';
}

function scoreBg(score: number): string {
  if (score >= 70) return 'bg-emerald-50 border-emerald-100 text-emerald-700';
  if (score >= 45) return 'bg-amber-50 border-amber-100 text-amber-700';
  return 'bg-rose-50 border-rose-100 text-rose-600';
}

function barColor(score: number): string {
  if (score >= 70) return 'bg-gradient-to-r from-emerald-400 to-emerald-500';
  if (score >= 45) return 'bg-gradient-to-r from-amber-400 to-amber-500';
  return 'bg-gradient-to-r from-rose-400 to-rose-500';
}

export function ScoreRadarMini({ profile }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const scores = getDimensionScores(profile);
  const keys = Object.keys(scores) as (keyof typeof scores)[];

  const weakestKey = keys.reduce((a, b) => scores[a] <= scores[b] ? a : b);
  const weakestScore = scores[weakestKey];
  const blogLinks = DIMENSION_BLOGS[weakestKey] ?? [];

  return (
    <div className="mt-4 space-y-1">
      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
        6 Eksen Profil
      </div>

      {keys.map((key) => {
        const score = scores[key];
        const isOpen = expanded === key;

        return (
          <div key={key}>
            <button
              type="button"
              onClick={() => setExpanded(isOpen ? null : key)}
              className="w-full flex items-center gap-2.5 py-2 px-2.5 rounded-xl hover:bg-slate-50 transition-colors group text-left"
            >
              {/* Icon */}
              <span className="text-base w-5 text-center shrink-0">
                {DIMENSION_ICONS[key]}
              </span>

              {/* Label */}
              <span className="text-xs font-semibold text-slate-600 w-[60px] shrink-0">
                {DIMENSION_LABELS[key]}
              </span>

              {/* Progress bar */}
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${barColor(score)}`}
                  style={{ width: `${score}%` }}
                />
              </div>

              {/* Score badge */}
              <span className={`text-xs font-bold px-2 py-0.5 rounded-lg border shrink-0 ${scoreBg(score)}`}>
                %{score}
              </span>

              {/* Chevron */}
              <span className={`text-xs text-slate-300 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                ▾
              </span>
            </button>

            {isOpen && (
              <div className="mx-2 mb-1.5 px-3 py-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-500 leading-relaxed">
                  {DIMENSION_TIPS[key]}
                </p>
                {score < 70 && (
                  <p className="text-xs text-brand-600 font-semibold mt-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                    {DIMENSION_ACTIONS[key]}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Blog önerisi */}
      {weakestScore < 65 && blogLinks.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
            <span>📚</span> {DIMENSION_LABELS[weakestKey]} için okuma önerisi
          </div>
          <div className="space-y-1.5">
            {blogLinks.map(link => (
              <Link
                key={link.slug}
                to={`/blog/${link.slug}`}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-brand-50/50 border border-brand-100/60 hover:bg-brand-50 hover:border-brand-200 transition-all group"
              >
                <span className="text-xs text-brand-400 shrink-0">→</span>
                <span className="text-xs text-slate-600 group-hover:text-brand-700 transition-colors leading-snug font-medium">
                  {link.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
