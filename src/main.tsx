import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

// ── Code splitting: sayfalar lazy yüklenir ──────────────────────────────
const App      = lazy(() => import('./App'));
const KVKK     = lazy(() => import('./pages/KVKK'));
const Gizlilik = lazy(() => import('./pages/Gizlilik'));
const Iletisim = lazy(() => import('./pages/Iletisim'));
const Hakkimizda = lazy(() => import('./pages/Hakkimizda'));

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
  </div>
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/"                    element={<App />} />
          <Route path="/kvkk"                element={<KVKK />} />
          <Route path="/gizlilik-politikasi" element={<Gizlilik />} />
          <Route path="/iletisim"            element={<Iletisim />} />
          <Route path="/hakkimizda"          element={<Hakkimizda />} />
          <Route path="*"                    element={<App />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
);
