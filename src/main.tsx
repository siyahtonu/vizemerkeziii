import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ScrollToTop } from './components/ScrollToTop';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary';

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
// ── Blog — SEO Strateji Yazıları ────────────────────────────────────────
const CascadeKurali             = lazy(() => import('./pages/blog/CascadeKurali'));
const EesSistemi                = lazy(() => import('./pages/blog/EesSistemi'));
const IngiltereEvisa            = lazy(() => import('./pages/blog/IngiltereEvisa'));
const SchengenNasilAlinir       = lazy(() => import('./pages/blog/SchengenNasilAlinir'));
const SchengenRetKodlari        = lazy(() => import('./pages/blog/SchengenRetKodlari'));
const VizeRandevuNasilAlinir    = lazy(() => import('./pages/blog/VizeRandevuNasilAlinir'));
const AlmanyaVizesi2026         = lazy(() => import('./pages/blog/AlmanyaVizesi2026'));
const AbdVizesi2026             = lazy(() => import('./pages/blog/AbdVizesi2026'));
const KapidaVizeUlkeler         = lazy(() => import('./pages/blog/KapidaVizeUlkeler'));
const KanadaVizesi2026          = lazy(() => import('./pages/blog/KanadaVizesi2026'));
const DijitalNomadVizesi        = lazy(() => import('./pages/blog/DijitalNomadVizesi'));
// ── Blog — 2026 PDF Rehber Yazıları ────────────────────────────────────
const BankaHesabiNeKadarOlmali  = lazy(() => import('./pages/blog/BankaHesabiNeKadarOlmali'));
const EvHanimlariSchengenVizesi = lazy(() => import('./pages/blog/EvHanimlariSchengenVizesi'));
const VizeReddiSonrasiNeYapmali = lazy(() => import('./pages/blog/VizeReddiSonrasiNeYapmali'));
const Ds160NasilDoldurulur      = lazy(() => import('./pages/blog/Ds160NasilDoldurulur'));
const EnKolaySchengen2026       = lazy(() => import('./pages/blog/EnKolaySchengen2026'));
const EmekliVizeBasvurusu       = lazy(() => import('./pages/blog/EmekliVizeBasvurusu'));
const SchengenGerekliBelgeler2026 = lazy(() => import('./pages/blog/SchengenGerekliBelgeler2026'));
const OgrencilerIcinVize2026    = lazy(() => import('./pages/blog/OgrencilerIcinVize2026'));
const DubaiEvizesi2026          = lazy(() => import('./pages/blog/DubaiEvizesi2026'));
const VizeUcretleriKarsilastirma2026 = lazy(() => import('./pages/blog/VizeUcretleriKarsilastirma2026'));
const SerbestMeslekVize         = lazy(() => import('./pages/blog/SerbestMeslekVize'));
const IssizlerVizeBasvurusu     = lazy(() => import('./pages/blog/IssizlerVizeBasvurusu'));
const YesilPasaportAvantajlari  = lazy(() => import('./pages/blog/YesilPasaportAvantajlari'));
const SponsorDilekcesiOrnek     = lazy(() => import('./pages/blog/SponsorDilekcesiOrnek'));
const Kurali90180NasilHesaplanir = lazy(() => import('./pages/blog/Kurali90180NasilHesaplanir'));
const SeyahatSigortasiNasilSecilir = lazy(() => import('./pages/blog/SeyahatSigortasiNasilSecilir'));
// ── Feedback loop sayfaları ─────────────────────────────────────────────
const OutcomeReport             = lazy(() => import('./pages/OutcomeReport'));
const OutcomesStats             = lazy(() => import('./pages/OutcomesStats'));
const AppointmentsAnnounce      = lazy(() => import('./pages/AppointmentsAnnounce'));
const NotFound                  = lazy(() => import('./pages/NotFound'));

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
  </div>
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary name="Root">
      <HelmetProvider>
        <BrowserRouter>
          <ScrollToTop />
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
            {/* Blog — SEO Strateji Yazıları */}
            <Route path="/blog/cascade-kurali-schengen-vizesi"           element={<CascadeKurali />} />
            <Route path="/blog/ees-sistemi-nedir"                        element={<EesSistemi />} />
            <Route path="/blog/ingiltere-evisa-rehberi"                  element={<IngiltereEvisa />} />
            <Route path="/blog/schengen-vizesi-nasil-alinir"             element={<SchengenNasilAlinir />} />
            <Route path="/blog/schengen-vize-ret-kodlari-c1-c14"        element={<SchengenRetKodlari />} />
            <Route path="/blog/vize-randevusu-nasil-alinir"              element={<VizeRandevuNasilAlinir />} />
            <Route path="/blog/almanya-vizesi-nasil-alinir-2026"         element={<AlmanyaVizesi2026 />} />
            <Route path="/blog/abd-vizesi-nasil-alinir-2026"             element={<AbdVizesi2026 />} />
            <Route path="/blog/kapida-vize-veren-ulkeler-2026"           element={<KapidaVizeUlkeler />} />
            <Route path="/blog/kanada-vizesi-nasil-alinir-2026"          element={<KanadaVizesi2026 />} />
            <Route path="/blog/dijital-nomad-vizesi-2026"                element={<DijitalNomadVizesi />} />
            {/* Blog — 2026 PDF Rehber Yazıları */}
            <Route path="/blog/vize-icin-banka-hesabi-ne-kadar-olmali"   element={<BankaHesabiNeKadarOlmali />} />
            <Route path="/blog/ev-hanimlari-icin-schengen-vizesi"        element={<EvHanimlariSchengenVizesi />} />
            <Route path="/blog/vize-reddi-sonrasi-ne-yapmali-itiraz-rehberi" element={<VizeReddiSonrasiNeYapmali />} />
            <Route path="/blog/ds-160-formu-nasil-doldurulur-rehberi"    element={<Ds160NasilDoldurulur />} />
            <Route path="/blog/en-kolay-schengen-vizesi-veren-ulkeler-2026" element={<EnKolaySchengen2026 />} />
            <Route path="/blog/emekliler-icin-vize-basvurusu-rehberi"    element={<EmekliVizeBasvurusu />} />
            <Route path="/blog/schengen-vizesi-gerekli-belgeler-2026"    element={<SchengenGerekliBelgeler2026 />} />
            <Route path="/blog/ogrenciler-icin-vize-rehberi-2026"        element={<OgrencilerIcinVize2026 />} />
            <Route path="/blog/dubai-e-vizesi-2026-basvuru-rehberi"      element={<DubaiEvizesi2026 />} />
            <Route path="/blog/vize-ucretleri-karsilastirma-2026"        element={<VizeUcretleriKarsilastirma2026 />} />
            <Route path="/blog/serbest-meslek-sahipleri-icin-vize-rehberi" element={<SerbestMeslekVize />} />
            <Route path="/blog/issizler-ve-calismayanlar-icin-vize"      element={<IssizlerVizeBasvurusu />} />
            <Route path="/blog/yesil-pasaport-avantajlari-vizesiz-ulkeler-2026" element={<YesilPasaportAvantajlari />} />
            <Route path="/blog/sponsor-dilekcesi-nasil-yazilir-ornek"    element={<SponsorDilekcesiOrnek />} />
            <Route path="/blog/90-180-gun-kurali-nasil-hesaplanir"       element={<Kurali90180NasilHesaplanir />} />
            <Route path="/blog/vize-icin-seyahat-sigortasi-nasil-secilir" element={<SeyahatSigortasiNasilSecilir />} />
            {/* Feedback loop */}
            <Route path="/sonuc-bildir"                 element={<OutcomeReport />} />
            <Route path="/admin/outcomes-stats"         element={<OutcomesStats />} />
            <Route path="/admin/appointments-announce" element={<AppointmentsAnnounce />} />
            <Route path="*"                    element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>,
);
