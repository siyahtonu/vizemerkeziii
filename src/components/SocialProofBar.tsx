import { useEffect, useState } from 'react';

function seedNum(base: number, seed: number, spread: number): number {
  const h = Math.abs(Math.sin(seed) * 10000);
  return Math.round(base + (h % spread) - spread / 2);
}

function todaySeed(): number {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

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
    requestAnimationFrame(step);
  }, [target]);
  return <>{n.toLocaleString('tr-TR')}</>;
}

export function SocialProofBar() {
  const s = todaySeed();
  const stats = [
    { value: seedNum(52847, s, 3000), label: 'profil analiz edildi', suffix: '+' },
    { value: seedNum(91, s + 2, 14), label: 'bugün skor artırdı' },
    { value: seedNum(43, s + 1, 18), label: 'niyet mektubu oluşturuldu' },
  ];

  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[11px] sm:text-xs">
      {stats.map((stat, i) => (
        <div key={i} className="flex items-center gap-1.5 text-slate-500">
          <span className="font-bold text-white score-num">
            <AnimatedNumber target={stat.value} />{stat.suffix || ''}
          </span>
          <span>{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
