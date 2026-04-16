// ============================================================
// ScoreRadarMini — #12 Kompakt 6-Eksen Skor Görselleştirme
// Skor kartı içinde: ★★★★☆ yıldız derecelendirme, tıklanabilir
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

// #1 — Zayıf eksene göre ilgili blog yazıları
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

function Stars({ value }: { value: number }) {
  const filled = Math.round(value / 20); // 0–100 → 0–5
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <span
          key={i}
          className={`text-sm leading-none ${
            i <= filled
              ? value >= 80 ? 'text-emerald-400' :
                value >= 50 ? 'text-amber-400' : 'text-rose-400'
              : 'text-white/20'
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export function ScoreRadarMini({ profile }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const scores = getDimensionScores(profile);
  const keys = Object.keys(scores) as (keyof typeof scores)[];

  // En zayıf eksen — blog önerisi için
  const weakestKey = keys.reduce((a, b) => scores[a] <= scores[b] ? a : b);
  const weakestScore = scores[weakestKey];
  const blogLinks = DIMENSION_BLOGS[weakestKey] ?? [];

  return (
    <div className="mt-3 space-y-1.5">
      <div className="text-[10px] font-bold text-white/40 uppercase tracking-[0.15em] mb-2">
        6 Eksen Profil
      </div>
      {keys.map((key) => {
        const score = scores[key];
        const isOpen = expanded === key;
        const color =
          score >= 80 ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' :
          score >= 50 ? 'bg-amber-500/20 border-amber-500/30 text-amber-300' :
                        'bg-rose-500/20 border-rose-500/30 text-rose-300';

        return (
          <div key={key}>
            <button
              type="button"
              onClick={() => setExpanded(isOpen ? null : key)}
              className="w-full flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-white/5 transition-colors group text-left"
            >
              <span className="text-xs w-4 text-center shrink-0">
                {DIMENSION_ICONS[key]}
              </span>
              <span className="text-[11px] font-semibold text-white/70 w-16 shrink-0 leading-tight">
                {DIMENSION_LABELS[key]}
              </span>
              <Stars value={score} />
              <span className={`ml-auto text-[10px] font-black px-1.5 py-0.5 rounded border ${color}`}>
                %{score}
              </span>
              <span className={`text-[9px] text-white/30 transition-transform group-hover:text-white/60 ${isOpen ? 'rotate-180' : ''}`}>
                ▾
              </span>
            </button>

            {isOpen && (
              <div className="mx-2 mb-1 px-3 py-2.5 bg-white/5 rounded-lg border border-white/10">
                <p className="text-[11px] text-white/60 leading-relaxed">
                  {DIMENSION_TIPS[key]}
                </p>
                {score < 70 && (
                  <p className="text-[10px] text-amber-400 font-bold mt-1.5">
                    → {DIMENSION_ACTIONS[key]}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* #1 — En zayıf eksene göre blog önerisi */}
      {weakestScore < 65 && blogLinks.length > 0 && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em] mb-2">
            📚 {DIMENSION_LABELS[weakestKey]} için okuma önerisi
          </div>
          <div className="space-y-1.5">
            {blogLinks.map(link => (
              <Link
                key={link.slug}
                to={`/blog/${link.slug}`}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
              >
                <span className="text-[10px] text-brand-300 shrink-0">→</span>
                <span className="text-[11px] text-white/60 group-hover:text-white/90 transition-colors leading-tight">
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
