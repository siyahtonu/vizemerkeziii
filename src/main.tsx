import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';

// ── Code splitting: sayfalar lazy yüklenir ──────────────────────────────
const App             = lazy(() => import('./App'));
const KVKK            = lazy(() => import('./pages/KVKK'));
const Gizlilik        = lazy(() => import('./pages/Gizlilik'));
const Iletisim        = lazy(() => import('./pages/Iletisim'));
const Hakkimizda      = lazy(() => import('./pages/Hakkimizda'));
const KullanimKosullari = lazy(() => import('./pages/KullanimKosullari'));
const MesafeliSatis   = lazy(() => import('./pages/MesafeliSatis'));
const CerezPolitikasi = lazy(() => import('./pages/CerezPolitikasi'));

// ── Rehber sayfaları ────────────────────────────────────────────────────
const SchengenRehber  = lazy(() => import('./pages/rehber/SchengenVizeBelgeleri'));
const AlmanyaRehber   = lazy(() => import('./pages/rehber/AlmanyaVizeBasvurusu'));
const AbdRehber       = lazy(() => import('./pages/rehber/AbdVizeB2'));

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
  </div>
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/"                    element={<App />} />
            <Route path="/basla"               element={<App />} />
            <Route path="/sonuc"               element={<App />} />
            <Route path="/panel"               element={<App />} />
            <Route path="/mektup"              element={<App />} />
            <Route path="/taktikler"           element={<App />} />
            <Route path="/kvkk"                element={<KVKK />} />
            <Route path="/gizlilik-politikasi" element={<Gizlilik />} />
            <Route path="/iletisim"            element={<Iletisim />} />
            <Route path="/hakkimizda"          element={<Hakkimizda />} />
            <Route path="/kullanim-kosullari"  element={<KullanimKosullari />} />
            <Route path="/mesafeli-satis"      element={<MesafeliSatis />} />
            <Route path="/cerez-politikasi"    element={<CerezPolitikasi />} />
            {/* Rehber sayfaları */}
            <Route path="/rehber/schengen-vize-belgeleri" element={<SchengenRehber />} />
            <Route path="/rehber/almanya-vize-basvurusu"  element={<AlmanyaRehber />} />
            <Route path="/rehber/abd-vize-b2"             element={<AbdRehber />} />
            <Route path="*"                    element={<App />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
);
