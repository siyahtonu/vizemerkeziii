/**
 * API base URL — production'da backend ayrı origin'de (api.vizeakil.com),
 * development'te Vite proxy /api isteklerini localhost:3001'e forward eder.
 *
 * VITE_API_URL env değişkeni build time'da okunur:
 *   - Production build:   VITE_API_URL=https://api.vizeakil.com npm run build
 *   - Development / same-origin deploy: boş bırak → relative /api çağrıları
 */
export const API_BASE = import.meta.env.VITE_API_URL ?? '';

export function apiUrl(path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${clean}`;
}
