// ============================================================
// useCountryRates — public/data/countries.json'ı boot'ta yükler
// ============================================================
/// <reference types="vite/client" />
// Kullanım: App bileşeninin en üst seviyesinde bir kez çağrılır.
// Başarıyla yüklenirse TR_REJECTION_RATES ve DIFFICULT_COUNTRIES
// override edilir — sonraki calculateScore çağrıları güncel değerleri kullanır.
// Hata durumunda sessizce fallback (hardcoded) değerler kullanılır.
// ============================================================

import { useEffect, useRef } from 'react';
import { overrideRejectionRates, overrideDifficultCountries } from '../scoring/matrices';

interface CountriesJson {
  _meta?: { version: string; lastUpdated: string };
  rejectionRates: Record<string, number>;
  difficultCountries: string[];
}

let _loaded = false; // Modül seviyesi flag — birden fazla mount'ta tekrar çekmesin

export function useCountryRates(): { loaded: boolean } {
  const loaded = useRef(_loaded);

  useEffect(() => {
    if (_loaded) return; // Zaten yüklenmiş

    const controller = new AbortController();

    fetch('/data/countries.json', {
      signal: controller.signal,
      cache: 'no-store', // Her deploy sonrası güncel versiyonu al
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<CountriesJson>;
      })
      .then(data => {
        if (data.rejectionRates && typeof data.rejectionRates === 'object') {
          overrideRejectionRates(data.rejectionRates);
        }
        if (Array.isArray(data.difficultCountries) && data.difficultCountries.length > 0) {
          overrideDifficultCountries(data.difficultCountries);
        }
        _loaded = true;
        loaded.current = true;

        if (import.meta.env.DEV) {
          const meta = data._meta;
          console.info(
            `[CountryRates] ✓ public/data/countries.json yüklendi` +
            (meta ? ` (v${meta.version}, ${meta.lastUpdated})` : ''),
          );
        }
      })
      .catch(err => {
        if (err.name === 'AbortError') return;
        // Sessiz hata: hardcoded fallback değerler aktif kalır
        if (import.meta.env.DEV) {
          console.warn('[CountryRates] JSON yüklenemedi, hardcoded fallback kullanılıyor:', err.message);
        }
      });

    return () => controller.abort();
  }, []);

  return { loaded: loaded.current };
}
