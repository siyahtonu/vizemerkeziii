// ============================================================
// useLocalStorage — typed React hook for localStorage persistence
// ============================================================
// Read/write tek bir helper'a indirgenir; App.tsx'teki tekrarlanan
// `useState(() => { try { ... } catch { return default; } })` paterni
// için tek kaynak. SSR güvenli (typeof window kontrolü) ve serialize
// edilmiş JSON depolama.
//
// Kullanım:
//   const [count, setCount] = useLocalStorage('vk_count', 0);
//   const [profile, setProfile] = useLocalStorage<Profile | null>('vk_profile', null);

import { useState, useCallback, useEffect } from 'react';

type SetterArg<T> = T | ((prev: T) => T);

function readFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    // Bozuk veri / parse hatası → fallback
    return fallback;
  }
}

function writeToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota dolu, private mode vb. — sessizce geç
  }
}

export function useLocalStorage<T>(
  key: string,
  fallback: T,
): [T, (next: SetterArg<T>) => void] {
  const [state, setState] = useState<T>(() => readFromStorage(key, fallback));

  const set = useCallback(
    (next: SetterArg<T>) => {
      setState((prev) => {
        const value = typeof next === 'function' ? (next as (p: T) => T)(prev) : next;
        writeToStorage(key, value);
        return value;
      });
    },
    [key],
  );

  // Çoklu sekme senkronizasyonu — başka sekmede aynı key güncellenirse yansıt.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = (e: StorageEvent) => {
      if (e.key !== key || e.newValue === null) return;
      try { setState(JSON.parse(e.newValue) as T); } catch { /* noop */ }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [key]);

  return [state, set];
}
