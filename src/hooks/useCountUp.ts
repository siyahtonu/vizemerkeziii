// ============================================================
// useCountUp — animates a number from its current value to target
// Uses ease-out cubic so it feels snappy at the start and smooth at the end.
// ============================================================

import { useState, useEffect, useRef } from 'react';

export function useCountUp(target: number, duration = 800): number {
  const [display, setDisplay] = useState(target);
  const currentRef = useRef(target);
  const rafRef     = useRef<number>(0);

  useEffect(() => {
    const startVal = currentRef.current;
    const delta    = target - startVal;
    if (delta === 0) return;

    let startTime: number | null = null;

    const tick = (ts: number) => {
      if (!startTime) startTime = ts;
      const elapsed  = ts - startTime;
      const progress = Math.min(elapsed / Math.max(duration, 1), 1);
      // ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const newVal   = Math.round(startVal + delta * eased);
      currentRef.current = newVal;
      setDisplay(newVal);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]); // eslint-disable-line react-hooks/exhaustive-deps

  return display;
}
