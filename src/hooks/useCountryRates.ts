// ============================================================
// useCountryRates — ret oranlarını boot'ta yükler
// ============================================================
/// <reference types="vite/client" />
//
// Öncelik sırası (ilk başarılı kazanır):
//   1. /api/rates                — canlı, operator POST ile güncelleyebilir
//                                  (deploy'suz güncelleme; gerçek "live pipeline")
//   2. /data/countries.json      — static baseline, build'e dahil edilir
//   3. src/scoring/matrices.ts   — hardcoded fallback (her iki fetch de başarısız)
//
// Başarılı yükleme sonrası TR_REJECTION_RATES ve DIFFICULT_COUNTRIES override
// edilir; sonraki calculateScore çağrıları güncel değerleri kullanır.
// ============================================================

import { useEffect, useRef } from 'react';
import { overrideRejectionRates, overrideDifficultCountries } from '../scoring/matrices';
import { apiUrl } from '../lib/api';

interface CountriesJson {
  _meta?: { version: string; lastUpdated: string };
  rejectionRates: Record<string, number>;
  difficultCountries: string[];
}

let _loaded = false;

function applyData(data: CountriesJson, source: string): void {
  if (data.rejectionRates && typeof data.rejectionRates === 'object') {
    overrideRejectionRates(data.rejectionRates);
  }
  if (Array.isArray(data.difficultCountries) && data.difficultCountries.length > 0) {
    overrideDifficultCountries(data.difficultCountries);
  }
  if (import.meta.env.DEV) {
    const meta = data._meta;
    console.info(
      `[CountryRates] ✓ ${source} yüklendi` +
      (meta ? ` (v${meta.version}, ${meta.lastUpdated})` : ''),
    );
  }
}

async function fetchRates(signal: AbortSignal): Promise<void> {
  // Canlı endpoint — operator POST ile günceller
  try {
    const res = await fetch(apiUrl('/api/rates'), { signal, cache: 'no-store' });
    if (res.ok) {
      applyData(await res.json() as CountriesJson, '/api/rates');
      return;
    }
  } catch (err) {
    if ((err as Error).name === 'AbortError') return;
    // sessizce static fallback'e düş
  }

  // Static baseline — build'e dahil edilmiş JSON
  try {
    const res = await fetch('/data/countries.json', { signal, cache: 'no-store' });
    if (res.ok) {
      applyData(await res.json() as CountriesJson, '/data/countries.json (static)');
      return;
    }
    throw new Error(`HTTP ${res.status}`);
  } catch (err) {
    if ((err as Error).name === 'AbortError') return;
    if (import.meta.env.DEV) {
      console.warn('[CountryRates] Hiçbir kaynak yüklenemedi, hardcoded fallback aktif:', (err as Error).message);
    }
  }
}

export function useCountryRates(): { loaded: boolean } {
  const loaded = useRef(_loaded);

  useEffect(() => {
    if (_loaded) return;
    const controller = new AbortController();
    fetchRates(controller.signal).finally(() => {
      _loaded = true;
      loaded.current = true;
    });
    return () => controller.abort();
  }, []);

  return { loaded: loaded.current };
}
