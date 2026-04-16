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

// ── Blog sayfaları ──────────────────────────────────────────────────────
const BlogIndex                 = lazy(() => import('./pages/blog/BlogIndex'));
const EvHanimiItalyaSchengen    = lazy(() => import('./pages/blog/EvHanimiItalyaSchengen'));
const FreelanceIngiltereVize    = lazy(() => import('./pages/blog/FreelanceIngiltereVize'));
const OgrenciAmerikaVize        = lazy(() => import('./pages/blog/OgrenciAmerikaVize'));
const EmekliYunanistanVize      = lazy(() => import('./pages/blog/EmekliYunanistanVize'));
const SchengenReddiMadde8       = lazy(() => import('./pages/blog/SchengenReddiMadde8'));
const PasaportRetYeniVize       = lazy(() => import('./pages/blog/PasaportRetYeniVize'));
const VizeMulakatHeyecan        = lazy(() => import('./pages/blog/VizeMulakatHeyecan'));
const VizeIcinBankaParasi       = lazy(() => import('./pages/blog/VizeIcinBankaParasi'));
const FransaVizeRandevu         = lazy(() => import('./pages/blog/FransaVizeRandevu'));
const Ds160Rehberi              = lazy(() => import('./pages/blog/Ds160Rehberi'));
const IngiltereNiyetMektubu     = lazy(() => import('./pages/blog/IngiltereNiyetMektubu'));
const SchengenUlkeKarsilastirma = lazy(() => import('./pages/blog/SchengenUlkeKarsilastirma'));
const DubaiEvizeKapiVize        = lazy(() => import('./pages/blog/DubaiEvizeKapiVize'));
const F1J1VizeFarklari          = lazy(() => import('./pages/blog/F1J1VizeFarklari'));

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
            {/* Blog — Ana sayfa */}
            <Route path="/blog"                           element={<BlogIndex />} />
            {/* Blog — Demografik & Meslek */}
            <Route path="/blog/ev-hanimi-italya-schengen-vizesi"         element={<EvHanimiItalyaSchengen />} />
            <Route path="/blog/freelance-ingiltere-vize-basvurusu"       element={<FreelanceIngiltereVize />} />
            <Route path="/blog/ogrenci-sponsorsuz-amerika-turist-vizesi" element={<OgrenciAmerikaVize />} />
            <Route path="/blog/emekli-yunanistan-kapi-vizesi-2026"       element={<EmekliYunanistanVize />} />
            {/* Blog — Sorun & Çözüm */}
            <Route path="/blog/schengen-reddi-madde-8-itiraz"            element={<SchengenReddiMadde8 />} />
            <Route path="/blog/pasaportunda-ret-varken-yeni-vize"        element={<PasaportRetYeniVize />} />
            <Route path="/blog/vize-mulakatinda-heyecan"                 element={<VizeMulakatHeyecan />} />
            <Route path="/blog/vize-icin-banka-hesabinda-ne-kadar-para"  element={<VizeIcinBankaParasi />} />
            {/* Blog — Nasıl Yapılır */}
            <Route path="/blog/fransa-vize-randevu-alternatif"           element={<FransaVizeRandevu />} />
            <Route path="/blog/ds-160-form-doldurma-rehberi"             element={<Ds160Rehberi />} />
            <Route path="/blog/ingiltere-tier4-niyet-mektubu"            element={<IngiltereNiyetMektubu />} />
            {/* Blog — Karşılaştırma */}
            <Route path="/blog/2026-schengen-kolay-zor-ulkeler"          element={<SchengenUlkeKarsilastirma />} />
            <Route path="/blog/dubai-evize-mi-kapida-vize-mi"            element={<DubaiEvizeKapiVize />} />
            <Route path="/blog/f1-j1-vizesi-farklari"                    element={<F1J1VizeFarklari />} />
            <Route path="*"                    element={<App />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
);
