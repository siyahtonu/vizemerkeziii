import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, AlertTriangle, CheckCircle2, ExternalLink, Clock, ChevronRight } from 'lucide-react';
import { SEO } from '../../components/SEO';

const SCHEMA = {
  '@type': 'Article',
  headline: 'ABD B1/B2 Vize Başvurusu 2026 — Türkiye\'den Mülakat Rehberi',
  description: 'ABD B1/B2 turistik vize başvurusu için 2026 güncel rehber. DS-160, mülakat hazırlığı, 214(b) ret kodu ve Türkiye bağları.',
  author: { '@type': 'Organization', name: 'VizeAkıl', url: 'https://vizeakil.com' },
  publisher: { '@type': 'Organization', name: 'VizeAkıl', logo: 'https://vizeakil.com/og-image.png' },
  datePublished: '2026-04-01',
  dateModified: '2026-04-15',
  url: 'https://vizeakil.com/rehber/abd-vize-b2',
};

const ADIMLAR = [
  { no: '1', baslik: 'DS-160 Formunu Doldurun', aciklama: 'ceac.state.gov adresinden online form doldurun. Barkod sayfasını mutlaka yazdırın. Form son derece detaylıdır — tüm yurt dışı seyahatlerinizi ve sosyal medya hesaplarınızı belirtin.' },
  { no: '2', baslik: 'Mülakat Randevusu Alın', aciklama: 'ais.usvisa-info.com/tr-tr/niv adresinden randevu alın. İstanbul için ortalama 188 gün bekleme (2026 verisi). VizeAkıl Randevu Takibi ile slot açıldığında bildirim alın.' },
  { no: '3', baslik: 'Türkiye Bağlarınızı Belgeleyin', aciklama: '"Strong ties to Turkey" — tapu, SGK dökümü, aile nüfus kaydı, işveren belgesi. Bu paket mülakatta en önemli unsurdur.' },
  { no: '4', baslik: 'Mülakata Hazırlanın', aciklama: 'Mülakat 2-5 dakika sürer. Seyahat amacı, kimimi ziyaret ediyorum, geri döneceğimi ne garantiliyor sorularına hazırlıklı olun.' },
  { no: '5', baslik: 'Mülakat Günü', aciklama: 'ABD Başkonsolosluğu, Esentepe, İstanbul. Pasaport, fotoğraf, randevu onayı, DS-160 barkodu ve tüm belgelerinizle gidin.' },
];

const BELGE_LISTESI = [
  { belge: 'Geçerli pasaport', kritik: true, detay: 'Vize bitiş tarihinden en az 6 ay geçerli.' },
  { belge: 'DS-160 barkod sayfası', kritik: true, detay: 'Yazılı hâlde, barkod görünür olmalı.' },
  { belge: 'Mülakat randevu onayı', kritik: true, detay: 'E-posta veya printout.' },
  { belge: 'Biyometrik fotoğraf', kritik: true, detay: '5×5 cm, beyaz arka fon, son 6 ayda çekilmiş.' },
  { belge: 'SGK hizmet dökümü', kritik: true, detay: 'e-Devlet\'ten barkodlu, en az 6 aylık kayıt.' },
  { belge: 'İşveren belgesi', kritik: true, detay: 'Görev, maaş, izin tarihleri, kesin geri dönüş taahhüdü.' },
  { belge: 'Son 3 aylık banka ekstresi', kritik: true, detay: 'Banka kaşeli, yetersiz bakiye en sık ret sebeplerindendir.' },
  { belge: 'Tapu fotokopisi', kritik: false, detay: 'Türkiye\'de mülk varsa kesinlikle ekleyin.' },
  { belge: 'Aile nüfus kayıt örneği', kritik: false, detay: 'Evli ve/veya çocukluysa güçlü bağ kanıtı.' },
  { belge: 'Önceki vize ve pasaport damgaları', kritik: false, detay: 'Schengen veya UK vizesi varsa çok güçlü etki.' },
];

const MULAKAT_SORULARI = [
  { soru: 'ABD\'ye neden gitmek istiyorsunuz?', ipucu: 'Somut cevap: "New York\'ta Metropolitan Müzesi\'ni ve Niagara Şelalesi\'ni görmek istiyorum." Belirsiz cevaplar şüphe uyandırır.' },
  { soru: 'Kim finanse edecek?', ipucu: 'Banka ekstrenizi hazır bulundurun. Rakamı bilmelisiniz: "Hesabımda X TL var."' },
  { soru: 'Türkiye\'ye neden döneceğinizden emin olmalıyım.', ipucu: 'İş, mülk, aile — en az 2 somut neden. "Kadrolu devlet memuruyum" çok güçlü bir cevaptır.' },
  { soru: 'Daha önce vize reddiniz var mı?', ipucu: 'Dürüst olun — USCIS tüm geçmişi görür. Ret varsa neyin değiştiğini açıklayın.' },
  { soru: 'ABD\'de tanıdığınız var mı?', ipucu: 'Varsa adını, statüsünü ve ilişkinizi bilin. Yoksa söyleyin — problem değil.' },
];

export default function AbdVizeB2() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SEO
        title="ABD B1/B2 Vize Başvurusu 2026 — Mülakat Rehberi ve Belgeler"
        description="ABD B1/B2 turistik vize için 2026 güncel rehber. DS-160 doldurma, mülakat hazırlığı, 214(b) ret kodu ve Türkiye bağları belgelerini öğrenin."
        canonical="/rehber/abd-vize-b2"
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
          <span className="text-slate-600">ABD B1/B2 Vize</span>
        </nav>

        {/* Hero */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">🇺🇸</span>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold bg-red-100 text-red-700 px-3 py-1 rounded-full">
              Zorluk: Çok Zor
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
              <Clock className="w-3.5 h-3.5" /> ~188 gün bekleme
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 leading-tight">
            ABD B1/B2 Vize Başvurusu 2026<br />Mülakat Rehberi ve Belgeler
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            ABD turistik vizesi, Türk başvurucular için en zorlu vize türüdür. Bu rehber DS-160 formundan
            mülakat sorularına, 214(b) ret kodundan Türkiye bağ belgelerine kadar tüm detayları kapsar.
          </p>
        </div>

        {/* 214(b) uyarı */}
        <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-10">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-red-800 text-sm mb-1">214(b) Ret Kodu Nedir?</div>
            <div className="text-red-700 text-xs leading-relaxed">
              ABD vizesinin en sık ret kodu. "Türkiye\'ye döneceğinizi kanıtlayamadınız" anlamına gelir.
              Konsolosluk <strong>reddi varsayımla başlar</strong> — siz aksi ispat etmek zorundAsınız.
              SGK, tapu, evlilik cüzdanı, işveren belgesi ile somut Türkiye bağlarınızı kanıtlayın.
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

        {/* Belge Listesi */}
        <section className="mb-10">
          <h2 className="text-2xl font-black text-slate-900 mb-2">Gerekli Belgeler</h2>
          <p className="text-slate-500 text-sm mb-5">Kırmızı olanlar kritik — bunlar olmadan mülakat başlamaz veya kesin ret gelir.</p>
          <div className="space-y-2">
            {BELGE_LISTESI.map((item) => (
              <div key={item.belge} className={`flex gap-3 p-4 rounded-xl border ${item.kritik ? 'bg-white border-rose-200' : 'bg-slate-50 border-slate-200'}`}>
                <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${item.kritik ? 'text-rose-500' : 'text-slate-400'}`} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 text-sm">{item.belge}</span>
                    {item.kritik && <span className="text-[10px] font-black bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded">Zorunlu</span>}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{item.detay}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mülakat Soruları */}
        <section className="mb-10">
          <h2 className="text-2xl font-black text-slate-900 mb-2">Sık Sorulan Mülakat Soruları</h2>
          <p className="text-slate-500 text-sm mb-5">Mülakat genellikle 2-5 dakika sürer. Bu soruların cevaplarını önceden hazırlayın.</p>
          <div className="space-y-3">
            {MULAKAT_SORULARI.map((item) => (
              <div key={item.soru} className="p-4 bg-white rounded-xl border border-slate-200">
                <div className="font-bold text-slate-800 text-sm mb-1.5">"{item.soru}"</div>
                <div className="text-xs text-brand-700 bg-brand-50 rounded-lg p-2.5 leading-relaxed">
                  💡 {item.ipucu}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-slate-900 rounded-xl text-white">
            <div className="font-bold text-sm mb-1">78 Soruluk Mülakat Simülatörü</div>
            <div className="text-slate-300 text-xs mb-3">VizeAkıl'ın Mülakat Simülatörü ile cevaplarınız puanlanır, zayıf noktalar işaretlenir.</div>
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold bg-brand-500 hover:bg-brand-600 px-3 py-2 rounded-lg transition-colors">
              Simülatörü Başlat →
            </Link>
          </div>
        </section>

        {/* CTA */}
        <div className="p-5 bg-brand-600 rounded-2xl text-white mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <div className="font-black text-lg mb-1">ABD vize profiliniz ne kadar güçlü?</div>
            <div className="text-brand-100 text-sm">Türkiye bağlarınızı, finansal durumunuzu ve seyahat geçmişinizi analiz edin.</div>
          </div>
          <Link to="/basla" className="shrink-0 bg-white text-brand-700 font-black px-5 py-2.5 rounded-xl text-sm hover:bg-brand-50 transition-colors">
            Ücretsiz Analiz →
          </Link>
        </div>

        {/* İlgili Rehberler */}
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
            <Link to="/rehber/almanya-vize-basvurusu"
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50/30 transition-colors group">
              <span className="text-2xl">🇩🇪</span>
              <div>
                <div className="font-bold text-slate-800 text-sm group-hover:text-brand-700">Almanya Vize Başvurusu</div>
                <div className="text-xs text-slate-400">En zorlu Schengen ülkesi için tam rehber</div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-300 ml-auto group-hover:text-brand-400" />
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}
