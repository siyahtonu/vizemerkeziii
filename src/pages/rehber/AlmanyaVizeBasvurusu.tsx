import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, AlertTriangle, CheckCircle2, ExternalLink, Clock, ChevronRight } from 'lucide-react';
import { SEO } from '../../components/SEO';

const SCHEMA = {
  '@type': 'Article',
  headline: 'Almanya Vize Başvurusu 2026 — Türkiye\'den Türk Vatandaşları İçin Rehber',
  description: 'Almanya Schengen vizesi başvurusu için 2026 güncel rehber. Gerekli belgeler, bekleme süreleri, ret nedenleri ve başarı ipuçları.',
  author: { '@type': 'Organization', name: 'VizeAkıl', url: 'https://vizeakil.com' },
  publisher: { '@type': 'Organization', name: 'VizeAkıl', logo: 'https://vizeakil.com/og-image.png' },
  datePublished: '2026-04-01',
  dateModified: '2026-04-15',
  url: 'https://vizeakil.com/rehber/almanya-vize-basvurusu',
};

const ADIMLAR = [
  { no: '1', baslik: 'VFS Randevu Alın', aciklama: 'visa.vfsglobal.com/tur/tr/deu adresinden randevu alın. İstanbul için 30-45 gün, Ankara için 20-30 gün önceden planlayın.' },
  { no: '2', baslik: 'Belgeleri Hazırlayın', aciklama: 'Zorunlu Schengen belgelerine ek olarak Almanya\'ya özel gereksinimler var. Özellikle işveren izin yazısı kritik.' },
  { no: '3', baslik: 'Banka Dökümünü Hazırlayın', aciklama: '3 aylık banka ekstresi, günlük 100 € karşılığı bakiye. 28 gün öncesinden bakiye hareketi yoksa "temiz" görünür.' },
  { no: '4', baslik: 'VFS Başvurusu Yapın', aciklama: 'Tüm belgeleri eksiksiz dosyalayın. Eksik belge için ek süre verilmez, başvuru reddedilir.' },
  { no: '5', baslik: 'Bekleme Süresi', aciklama: 'Almanya ortalama 15 iş gününde sonuçlandırır. Reddedildiyseniz VizeAkıl Ret Mektubu Analizi aracını kullanın.' },
];

const RET_NEDENLERI = [
  { neden: 'Geri dönüş şüphesi', oran: '%22', onlem: 'SGK dökümü, tapu, kira sözleşmesi — Türkiye bağları somutlaştırılmalı.' },
  { neden: 'Seyahat amacı inandırıcı değil', oran: '%18', onlem: 'Günlük itinerary + somut müze/etkinlik listesi hazırlayın.' },
  { neden: 'Belge-form çelişkisi', oran: '%12', onlem: 'Adres, işveren ve tarih bilgilerini tüm belgelerle çapraz kontrol edin.' },
  { neden: 'Banka bakiyesi yetersiz', oran: '%10', onlem: '10 günlük gezi için en az 55-60K TL bakiye + 3 ay öncesinden düzenli hareketler.' },
  { neden: 'Son dakika banka yatırımı', oran: '%8', onlem: 'Başvurudan 28 gün önce büyük yatırım yapmayın.' },
];

const OZEL_GEREKSINIMLER = [
  { baslik: 'İşveren İzin Yazısı', detay: 'Sadece "izin verilmiştir" yetmez. Yazıda tam giriş-çıkış tarihleri, çalışanın görevi ve işyerine ait kaşe-imza bulunmalıdır.', kritik: true },
  { baslik: 'SGK Hizmet Dökümü', detay: 'e-Devlet\'ten barkodlu, en az 6 aylık kesintisiz kayıt Almanya için güçlü bir profil sinyalidir.', kritik: true },
  { baslik: 'Seyahat Planı (İtinerary)', detay: 'Almanya konsolosluğu ayrıntılı seyahat planı ister. "Genel turizm" yetmez — şehir şehir, günlük program hazırlayın.', kritik: false },
  { baslik: 'Konaklama Belgesi', detay: 'Otel rezervasyonu veya Almanya\'da akraba varsa davet mektubu + ev sahibinin Aufenthaltstitel fotokopisi.', kritik: false },
];

export default function AlmanyaVizeBasvurusu() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SEO
        title="Almanya Vize Başvurusu 2026 — Türkiye'den Eksiksiz Rehber"
        description="Almanya Schengen vizesi için 2026 güncel rehber. Gerekli belgeler, VFS randevu, banka döküm gereksinimleri ve sık ret nedenleri."
        canonical="/rehber/almanya-vize-basvurusu"
        schema={SCHEMA}
      />

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

        <nav aria-label="breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-400 mb-6">
          <Link to="/" className="hover:text-brand-600 transition-colors">Ana Sayfa</Link>
          <ChevronRight className="w-3 h-3" />
          <span>Rehber</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-600">Almanya Vize Başvurusu</span>
        </nav>

        {/* Hero */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">🇩🇪</span>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
              Zorluk: Zor
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
              <Clock className="w-3.5 h-3.5" /> ~45 gün bekleme
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 leading-tight">
            Almanya Vize Başvurusu 2026<br />Türkiye'den Adım Adım Rehber
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Almanya, Türk başvurucular için en yüksek Schengen standartlarını uygulayan ülkedir.
            Bu rehber size adım adım ne yapmanız, nelere dikkat etmeniz gerektiğini anlatır.
          </p>
        </div>

        {/* Uyarı */}
        <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-10">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-amber-800 text-sm mb-1">Dikkat: Randevu Süreleri Uzun</div>
            <div className="text-amber-700 text-xs leading-relaxed">
              Almanya VFS randevuları İstanbul'da 30-45 gün önceden dolmaktadır. Seyahat tarihinizden
              en az 2-3 ay önce planlamaya başlayın. VizeAkıl'ın Randevu Takip Botu ile slot açıldığında
              anında bildirim alabilirsiniz.
            </div>
          </div>
        </div>

        {/* Başvuru Adımları */}
        <section className="mb-10">
          <h2 className="text-2xl font-black text-slate-900 mb-5">Başvuru Adımları</h2>
          <div className="space-y-3">
            {ADIMLAR.map((adim) => (
              <div key={adim.no} className="flex gap-4 p-4 bg-white rounded-xl border border-slate-200">
                <div className="w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center font-black text-sm shrink-0">
                  {adim.no}
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-sm">{adim.baslik}</div>
                  <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">{adim.aciklama}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Almanya'ya Özel Gereksinimler */}
        <section className="mb-10">
          <h2 className="text-2xl font-black text-slate-900 mb-2">Almanya'ya Özel Gereksinimler</h2>
          <p className="text-slate-500 text-sm mb-5">Genel Schengen belgelerine ek olarak Almanya'nın özel beklentileri:</p>
          <div className="space-y-3">
            {OZEL_GEREKSINIMLER.map((item) => (
              <div key={item.baslik} className={`flex gap-3 p-4 rounded-xl border ${item.kritik ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
                <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${item.kritik ? 'text-red-500' : 'text-emerald-500'}`} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 text-sm">{item.baslik}</span>
                    {item.kritik && <span className="text-[10px] font-black bg-red-100 text-red-600 px-1.5 py-0.5 rounded">Kritik</span>}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.detay}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sık Ret Nedenleri */}
        <section className="mb-10">
          <h2 className="text-2xl font-black text-slate-900 mb-2">Sık Ret Nedenleri</h2>
          <p className="text-slate-500 text-sm mb-5">50 gerçek vaka analizinden türetilmiş veriler:</p>
          <div className="space-y-2">
            {RET_NEDENLERI.map((item) => (
              <div key={item.neden} className="p-4 bg-white rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-800 text-sm">{item.neden}</span>
                  <span className="text-xs font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">{item.oran}</span>
                </div>
                <div className="text-xs text-slate-500 leading-relaxed">→ {item.onlem}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="p-5 bg-brand-600 rounded-2xl text-white mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <div className="font-black text-lg mb-1">Almanya başvurunuz ne kadar güçlü?</div>
            <div className="text-brand-100 text-sm">VizeAkıl ile profilinizi analiz edin, kişisel onay tahmininizi ve eksiklerinizi öğrenin.</div>
          </div>
          <Link to="/basla" className="shrink-0 bg-white text-brand-700 font-black px-5 py-2.5 rounded-xl text-sm hover:bg-brand-50 transition-colors">
            Ücretsiz Analiz →
          </Link>
        </div>

        {/* İlgili rehberler */}
        <section>
          <h2 className="text-xl font-black text-slate-900 mb-4">İlgili Rehberler</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <Link to="/rehber/schengen-vize-belgeleri"
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50/30 transition-colors group">
              <span className="text-2xl">🇪🇺</span>
              <div>
                <div className="font-bold text-slate-800 text-sm group-hover:text-brand-700">Schengen Vize Belgeleri</div>
                <div className="text-xs text-slate-400">Tüm Schengen ülkeleri için belge listesi</div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-300 ml-auto group-hover:text-brand-400" />
            </Link>
            <Link to="/rehber/abd-vize-b2"
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50/30 transition-colors group">
              <span className="text-2xl">🇺🇸</span>
              <div>
                <div className="font-bold text-slate-800 text-sm group-hover:text-brand-700">ABD B1/B2 Vize</div>
                <div className="text-xs text-slate-400">Mülakat, DS-160 ve 214(b) rehberi</div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-300 ml-auto group-hover:text-brand-400" />
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}
