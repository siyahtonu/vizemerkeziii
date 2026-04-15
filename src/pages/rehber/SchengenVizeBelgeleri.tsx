import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, CheckCircle2, AlertTriangle, ExternalLink, FileText, ChevronRight } from 'lucide-react';
import { SEO } from '../../components/SEO';

const SCHEMA = {
  '@type': 'Article',
  headline: 'Schengen Vize Belgeleri 2026 — Türk Vatandaşları İçin Eksiksiz Liste',
  description: 'Schengen vizesi başvurusu için 2026 güncel belge listesi. Pasaport, banka ekstresi, sigorta, konaklama ve işveren belgelerinin tümü.',
  author: { '@type': 'Organization', name: 'VizeAkıl', url: 'https://vizeakil.com' },
  publisher: { '@type': 'Organization', name: 'VizeAkıl', logo: 'https://vizeakil.com/og-image.png' },
  datePublished: '2026-04-01',
  dateModified: '2026-04-15',
  url: 'https://vizeakil.com/rehber/schengen-vize-belgeleri',
  mainEntityOfPage: 'https://vizeakil.com/rehber/schengen-vize-belgeleri',
};

const ZORUNLU = [
  { belge: 'Geçerli pasaport', detay: 'Son 10 yılda alınmış, en az 2 boş sayfa, vize süresini 3 ay aşan geçerlilik.' },
  { belge: 'Önceki pasaportlar', detay: 'Vizeli ve damgalı sayfaları içeren tüm eski pasaportlar.' },
  { belge: 'Vize başvuru formu', detay: 'Eksiksiz doldurulmuş ve el yazısıyla imzalanmış.' },
  { belge: 'Biyometrik fotoğraf', detay: '35×45 mm, beyaz arka fon, 6 aydan yeni, gözlük yasak.' },
  { belge: 'Nüfus cüzdanı fotokopisi', detay: 'Ön ve arka yüz, renkli.' },
  { belge: 'Vukuatlı nüfus kayıt örneği', detay: 'e-Devlet\'ten barkodlu, 6 aydan yeni.' },
  { belge: 'Yerleşim yeri belgesi', detay: 'e-Devlet\'ten barkodlu (ikametgah belgesi).' },
  { belge: 'Tarihçeli yerleşim yeri belgesi', detay: 'e-Devlet\'ten, uzun dönemli oturumu kanıtlar.' },
  { belge: 'Yurda giriş-çıkış belgesi', detay: 'e-Devlet\'ten 01.01.2009\'dan bugüne tüm geçişler.' },
  { belge: 'Uçak rezervasyonu', detay: 'Gidiş-dönüş, iptal edilebilir opsiyonlu tercih edilir.' },
  { belge: 'Konaklama rezervasyonu', detay: 'Otel, apart otel veya ev sahibi davet mektubu.' },
  { belge: 'Detaylı seyahat planı', detay: 'Her gün için aktivite ve ziyaret listesi (itinerary).' },
  { belge: 'Seyahat sağlık sigortası', detay: 'Min. 30.000 € teminat, tüm Schengen bölgesi kapsamı, seyahat tarihleri dahil.' },
  { belge: 'Niyet mektubu', detay: 'Seyahat amacı, tarihler, tüm masrafların karşılanacağı taahhüdü.' },
];

const FINANSAL = [
  { belge: 'Son 3 aylık banka hesap dökümü', detay: 'Banka kaşeli ve imzalı. Günlük 100-120 € karşılığı bakiye gösterilebilmeli.' },
  { belge: 'Maaş bordrosu', detay: 'Son 3 aya ait, kaşeli ve imzalı (çalışanlar için).' },
  { belge: 'Tapu fotokopisi', detay: 'Varsa, güçlü Türkiye bağı kanıtı olarak eklenir.' },
  { belge: 'Araç ruhsatı fotokopisi', detay: 'Varsa, varlık kanıtı olarak.' },
];

const MESLEKI = [
  { belge: 'SGK hizmet dökümü', detay: 'e-Devlet\'ten barkodlu, tüm çalışma geçmişi.' },
  { belge: 'İşveren izin ve görev yazısı', detay: 'Kesin geri dönüş tarihi içermeli, kaşeli-imzalı. "İzin verilmiştir" tek başına yetmez.' },
  { belge: 'Vergi levhası fotokopisi', detay: 'İşyerine ait, güncel.' },
  { belge: 'Ticaret Odası kayıt sureti', detay: 'Serbest meslek sahipleri için, 6 aydan yeni.' },
];

const IPUCLARI = [
  { tip: 'uyarı', baslik: '28 Gün Kuralı', metin: 'Başvurudan 28 gün önce banka hesabına büyük para yatırılması "son dakika mevduatı" sayılır ve ret sebebi olabilir.' },
  { tip: 'uyarı', baslik: 'Sahte Rezervasyon Riski', metin: 'Sahte otel rezervasyonu PDF\'leri konsolosluklar tarafından sistematik olarak tespit edilmektedir. Booking.com\'un ücretsiz iptalli gerçek rezervasyonunu kullanın.' },
  { tip: 'bilgi', baslik: 'İlk Schengen Başvurusu', metin: 'İlk kez başvuruyorsanız İtalya, Yunanistan veya İspanya daha yüksek onay oranıyla başlamak için iyi seçimdir.' },
  { tip: 'bilgi', baslik: 'Belge Tutarlılığı', metin: 'Formda yazan ad, adres ve işveren bilgilerinin tüm belgelerle birebir eşleşmesi zorunludur. Küçük bir tutarsızlık bile reddedilme sebebi sayılabilir.' },
];

export default function SchengenVizeBelgeleri() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SEO
        title="Schengen Vize Belgeleri 2026 — Türk Vatandaşları İçin Eksiksiz Liste"
        description="Schengen vizesi başvurusu için 2026 güncel ve eksiksiz belge listesi. Pasaport, banka ekstresi, seyahat sigortası, işveren belgesi ve ipuçları."
        canonical="/rehber/schengen-vize-belgeleri"
        schema={SCHEMA}
      />

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 text-brand-600 font-bold hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5" /> Ana Sayfa
          </Link>
          <div className="h-4 w-px bg-slate-300" />
          <div className="flex items-center gap-2 text-slate-700 font-black text-sm">
            <ShieldCheck className="w-4 h-4 text-brand-600" /> VizeAkıl Rehber
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">

        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-400 mb-6">
          <Link to="/" className="hover:text-brand-600 transition-colors">Ana Sayfa</Link>
          <ChevronRight className="w-3 h-3" />
          <span>Rehber</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-600">Schengen Vize Belgeleri</span>
        </nav>

        {/* Hero */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-full mb-4">
            <FileText className="w-3.5 h-3.5" /> 2026 Güncel
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 leading-tight">
            Schengen Vize Belgeleri<br />Türk Vatandaşları İçin Eksiksiz Liste
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            2026 yılı konsolosluk standartlarına göre hazırlanmış Schengen vize başvurusu belge listesi.
            Eksik bir belge başvurunuzun reddedilmesine yol açabilir — bu sayfayı kontrol listesi olarak kullanın.
          </p>
        </div>

        {/* Hızlı CTA */}
        <div className="p-5 bg-brand-600 rounded-2xl text-white mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <div className="font-black text-lg mb-1">Profilinize Özel Liste İster misiniz?</div>
            <div className="text-brand-100 text-sm">VizeAkıl, çalışma durumunuza, medeni halinize ve seyahat geçmişinize göre kişiselleştirilmiş belge listesi oluşturur.</div>
          </div>
          <Link to="/basla"
            className="shrink-0 bg-white text-brand-700 font-black px-5 py-2.5 rounded-xl text-sm hover:bg-brand-50 transition-colors">
            Ücretsiz Analiz Başlat →
          </Link>
        </div>

        {/* Zorunlu Belgeler */}
        <section className="mb-10">
          <h2 className="text-2xl font-black text-slate-900 mb-2">1. Zorunlu Belgeler</h2>
          <p className="text-slate-500 text-sm mb-5">Her başvurucunun sunması gereken temel belgeler. Bunların eksikliği anında reddedilme sebebidir.</p>
          <div className="space-y-2">
            {ZORUNLU.map((item) => (
              <div key={item.belge} className="flex gap-3 p-4 bg-white rounded-xl border border-slate-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-800 text-sm">{item.belge}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{item.detay}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Finansal Belgeler */}
        <section className="mb-10">
          <h2 className="text-2xl font-black text-slate-900 mb-2">2. Finansal Belgeler</h2>
          <p className="text-slate-500 text-sm mb-5">Konsolosluklar finansal yeterliliğinizi bu belgelerle değerlendirir.</p>
          <div className="space-y-2">
            {FINANSAL.map((item) => (
              <div key={item.belge} className="flex gap-3 p-4 bg-white rounded-xl border border-slate-200">
                <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-800 text-sm">{item.belge}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{item.detay}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mesleki Belgeler */}
        <section className="mb-10">
          <h2 className="text-2xl font-black text-slate-900 mb-2">3. Mesleki Belgeler</h2>
          <p className="text-slate-500 text-sm mb-5">Çalışanlar, kamu görevlileri ve serbest meslek sahipleri için.</p>
          <div className="space-y-2">
            {MESLEKI.map((item) => (
              <div key={item.belge} className="flex gap-3 p-4 bg-white rounded-xl border border-slate-200">
                <CheckCircle2 className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-800 text-sm">{item.belge}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{item.detay}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* İpuçları */}
        <section className="mb-10">
          <h2 className="text-2xl font-black text-slate-900 mb-5">4. Kritik İpuçları</h2>
          <div className="space-y-3">
            {IPUCLARI.map((ip) => (
              <div key={ip.baslik} className={`flex gap-3 p-4 rounded-xl border ${ip.tip === 'uyarı' ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200'}`}>
                <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${ip.tip === 'uyarı' ? 'text-amber-600' : 'text-blue-600'}`} />
                <div>
                  <div className={`font-bold text-sm mb-0.5 ${ip.tip === 'uyarı' ? 'text-amber-800' : 'text-blue-800'}`}>{ip.baslik}</div>
                  <div className={`text-xs leading-relaxed ${ip.tip === 'uyarı' ? 'text-amber-700' : 'text-blue-700'}`}>{ip.metin}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Diğer rehberler */}
        <section className="mb-10">
          <h2 className="text-xl font-black text-slate-900 mb-4">İlgili Rehberler</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <Link to="/rehber/almanya-vize-basvurusu"
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50/30 transition-colors group">
              <span className="text-2xl">🇩🇪</span>
              <div>
                <div className="font-bold text-slate-800 text-sm group-hover:text-brand-700">Almanya Vize Başvurusu 2026</div>
                <div className="text-xs text-slate-400">En zorlu Schengen ülkesi için tam rehber</div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-300 ml-auto group-hover:text-brand-400" />
            </Link>
            <Link to="/rehber/abd-vize-b2"
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50/30 transition-colors group">
              <span className="text-2xl">🇺🇸</span>
              <div>
                <div className="font-bold text-slate-800 text-sm group-hover:text-brand-700">ABD B1/B2 Vize Başvurusu</div>
                <div className="text-xs text-slate-400">Mülakat, DS-160 ve 214(b) rehberi</div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-300 ml-auto group-hover:text-brand-400" />
            </Link>
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="p-6 bg-slate-900 rounded-2xl text-white text-center">
          <div className="font-black text-xl mb-2">Başvurunuz ne kadar güçlü?</div>
          <p className="text-slate-300 text-sm mb-5">VizeAkıl, 6 kategori üzerinden profilinizi analiz eder ve kişisel onay tahmini sunar.</p>
          <Link to="/"
            className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors">
            <ShieldCheck className="w-4 h-4" /> Ücretsiz Skor Al
          </Link>
        </div>

      </main>
    </div>
  );
}
