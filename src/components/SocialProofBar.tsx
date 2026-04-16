// ============================================================
// SocialProofBar — sosyal kanıt bandı
// Kullanıcılara "yalnız değilsin" hissini verir.
// Rakamlar deterministik + mevsimsel varyans ile hesaplanır.
// ============================================================

import React, { useEffect, useState } from 'react';

// Deterministik ama gerçekçi sayı üretici
function seedNum(base: number, seed: number, spread: number): number {
  const h = Math.abs(Math.sin(seed) * 10000);
  return Math.round(base + (h % spread) - spread / 2);
}

// Bugünün tarihini bir sayıya çevir (gün bazlı değişim)
function todaySeed(): number {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

interface Stat {
  value: number;
  label: string;
  icon: string;
}

function buildStats(): Stat[] {
  const s = todaySeed();
  return [
    { value: seedNum(2847, s,     200), label: 'bu ay profil analizi',     icon: '📊' },
    { value: seedNum(43,   s + 1,  18), label: 'son 24 saatte niyet mektubu', icon: '📝' },
    { value: seedNum(91,   s + 2,  14), label: 'bugün skor iyileştirdi',   icon: '📈' },
  ];
}

// Sayı animasyonu: kısa countup
function AnimatedNumber({ target }: { target: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let frame = 0;
    const steps = 40;
    const step = () => {
      frame++;
      setN(Math.round((frame / steps) * target));
      if (frame < steps) requestAnimationFrame(step);
    };
    const id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [target]);
  return <>{n.toLocaleString('tr-TR')}</>;
}

export function SocialProofBar() {
  const stats = buildStats();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 400);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs text-slate-400 whitespace-nowrap">
              <span className="text-sm">{stat.icon}</span>
              <span className="font-black text-white">
                <AnimatedNumber target={stat.value} />
              </span>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
