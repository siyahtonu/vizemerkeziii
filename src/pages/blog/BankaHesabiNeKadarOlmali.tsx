import React from 'react';
import { AlertTriangle, CheckCircle2, Info, Wallet, TrendingUp } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'vize-icin-banka-hesabi-ne-kadar-olmali',
  title: 'Vize İçin Banka Hesabında Ne Kadar Para Olmalı? 2026 Ülke Bazlı Rehber',
  description: 'Schengen, İngiltere, ABD ve Kanada vizesi için banka hesabında tutulması gereken minimum bakiye, günlük harcama kuralı ve 28 gün bekletme yöntemi.',
  category: 'İpucu',
  readingTime: 9,
  date: '2026-04-17',
  tags: ['banka hesabı', 'vize parası', 'banka ekstresi', 'günlük bütçe'],
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: POST.title,
      description: POST.description,
      author: { '@type': 'Organization', name: 'VizeAkıl', url: 'https://vizeakil.com' },
      publisher: { '@type': 'Organization', name: 'VizeAkıl' },
      datePublished: POST.date,
      dateModified: POST.date,
      url: `https://vizeakil.com/blog/${POST.slug}`,
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Vize için banka hesabında ne kadar para olmalı?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Schengen için günlük €80–120, 10 günlük seyahatte asgari €1.200–1.500. İngiltere için günlük £80–100, 2 haftalık seyahatte ~£1.500. ABD için sabit kural olmasa da $3.000–5.000+ beklenir.',
          },
        },
        {
          '__type': 'Question',
          '@type': 'Question',
          name: 'Banka hesabına son dakika para yatırmak risk mi?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Evet. Konsolosluklar 3–6 aylık hareketi inceler; başvurudan hemen önce yapılan büyük yatırışlar şüphe uyandırır ve red gerekçesi olabilir. İngiltere parayı 28 gün hesapta görmek ister.',
          },
        },
        {
          '@type': 'Question',
          name: 'Kendi hesabımda yeterli para yoksa ne yaparım?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sponsor ile başvurabilirsiniz. Sponsorun 6 aylık banka dökümü, gelir belgesi, taahhüt mektubu ve akrabalık belgesi gerekir.',
          },
        },
      ],
    },
  ],
};

const ULKE_MIKTARLARI = [
  { ulke: 'Schengen (Ortalama)', gunluk: '€80–120', toplam: '10 gün: ~€1.200–1.500', not: 'Almanya ve Hollanda daha yüksek, Yunanistan ve İtalya daha toleranslı.' },
  { ulke: 'İngiltere', gunluk: '£80–100', toplam: '2 hafta: ~£1.500', not: 'Paranın 28 gün boyunca hesapta kalması zorunlu.' },
  { ulke: 'ABD (B1/B2)', gunluk: 'Sabit kural yok', toplam: '$3.000–5.000+', not: 'Seyahat planına ve yaşam standardına göre değişir. Düzenli gelir daha önemli.' },
  { ulke: 'Kanada (TRV)', gunluk: 'CAD 100–150', toplam: '2 hafta: CAD 2.000–3.000', not: 'Son 4 aylık hareketin düzenli olması istenir.' },
  { ulke: 'Dubai E-Vize', gunluk: 'AED 3.000 aylık gelir', toplam: 'Minimum 15.000–20.000 TL bakiye', not: 'Sürekli gelir ve son 3 ay dökümü yeterli.' },
];

export default function BankaHesabiNeKadarOlmali() {
  return (
    <BlogPostLayout post={POST} schema={SCHEMA}>
      <p className="text-slate-700 leading-relaxed text-base mb-6">
        "Hesabımda X TL var, vize alabilir miyim?" vize danışmanlarının en sık karşılaştığı sorudur.
        Yanıt basit değildir çünkü konsoloslukların ilan edilmiş tek bir alt sınırı yoktur.
        Ancak 2026 güncel uygulamalara göre ülke bazında tavsiye edilen minimum tutarlar bellidir
        ve bunun kadar önemli olan <strong>bakiyenin nasıl göründüğüdür</strong>.
      </p>

      <div className="bg-brand-50 border border-brand-200 rounded-xl p-5 mb-8 flex gap-3">
        <Wallet className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
        <p className="text-brand-900 text-sm leading-relaxed">
          <strong>Altın kural:</strong> Konsolosluk sizin "zengin mi fakir mi" olduğunuzu
          değerlendirmez; "gidecek ve geri dönecek güvencesi var mı" diye bakar.
          Miktardan çok paranın hikayesi belirleyicidir.
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">1. Ülke Bazında Önerilen Minimum Bakiye (2026)</h2>
      <div className="space-y-3 mb-8">
        {ULKE_MIKTARLARI.map(({ ulke, gunluk, toplam, not }) => (
          <div key={ulke} className="bg-white border border-slate-200 rounded-xl p-4 text-sm">
            <p className="font-semibold text-slate-800 mb-1">{ulke}</p>
            <div className="grid sm:grid-cols-2 gap-2 text-slate-600">
              <p><span className="font-medium text-slate-700">Günlük:</span> {gunluk}</p>
              <p><span className="font-medium text-slate-700">Toplam:</span> {toplam}</p>
            </div>
            <p className="text-slate-500 text-xs mt-1 italic">{not}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">2. Günlük Harcama Kuralı Nasıl Hesaplanır?</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Schengen konsoloslukları sıklıkla "günlük harcama × kalınacak gün sayısı" formülünü uygular.
        Fransa için €120/gün, İtalya için €80-100/gün, Almanya için €60 zorunlu + otel masrafı baz
        alınır. Bu rakam gidilecek şehrin maliyetine göre değişir — Paris veya Amsterdam gibi pahalı
        şehirler için daha yüksek beklenti vardır.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">3. İngiltere'nin "28 Gün Kuralı"</h2>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6 flex gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-800 text-sm mb-1">UK Visitor Visa için özel kural</p>
          <p className="text-amber-700 text-sm leading-relaxed">
            İngiltere vizesi başvurusunda paranızın son <strong>28 gün</strong> boyunca
            kesintisiz hesapta kalmış olması gerekir. 28 günden kısa süre önce yatırılan büyük
            meblağlar açıklanamazsa başvuru reddedilir. Bu nedenle başvuru tarihinden en az
            1 ay önce para planınızı netleştirin.
          </p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">4. "Sahte Bakiye" Tuzağı</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Başvuru öncesi hesaba büyük miktar para yatırmak iyi niyetli görünebilir ama konsolosluk
        gözünde en büyük kırmızı bayraktır. Görevli son 3-6 ayın hareketini karşılaştırır ve şunu sorar:
        "Bu para nereden geldi, neden daha önce yoktu?"
      </p>
      <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-red-800 text-sm mb-1">Kaçınılması gerekenler</p>
          <ul className="text-red-700 text-sm space-y-1 mt-1">
            <li>• Başvurudan önceki 30 gün içinde büyük transfer/yatırım</li>
            <li>• Arkadaş/akrabadan alınan kısa vadeli borcun hesaba girişi</li>
            <li>• Başvuru sonrası çekilmesi planlanan "gösterme parası"</li>
            <li>• Birden fazla hesap arası büyük EFT'ler (aynı kişiye ait bile olsa)</li>
          </ul>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">5. Konsolosluğun Aradığı 4 Özellik</h2>
      <div className="space-y-3 mb-8">
        {[
          { n: '1', b: 'Düzenlilik', d: 'Her ay maaş giren, faturalar çıkan canlı bir hesap.' },
          { n: '2', b: 'Stabil veya artan bakiye', d: 'Belirli bir alt limitin üzerinde kalan ve ara ara büyüyen bakiye.' },
          { n: '3', b: 'Açıklanabilir hareketler', d: 'Büyük transferlerin arkasında net bir kaynak (satış, kira geliri, yatırım) olması.' },
          { n: '4', b: 'Organik büyüklük', d: 'Başvurudan 3-6 ay önce başlayan, kademeli birikim.' },
        ].map(({ n, b, d }) => (
          <div key={n} className="flex gap-3 text-sm">
            <span className="w-7 h-7 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold shrink-0 text-xs mt-0.5">{n}</span>
            <div>
              <p className="font-semibold text-slate-800 mb-1">{b}</p>
              <p className="text-slate-600 leading-relaxed">{d}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">6. Yeterli Para Yoksa: Sponsor Seçeneği</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Kendi hesabınızda yeterli bakiye yoksa sponsor desteği tamamen yasal ve kabul gören bir yoldur.
        Ama tam belge seti şart:
      </p>
      <ul className="space-y-2 mb-6">
        {[
          'Sponsorun noter onaylı taahhüt/davet mektubu',
          'Sponsorun son 6 aylık banka dökümü (kaşeli, imzalı)',
          'Sponsorun maaş bordrosu veya gelir belgesi (SGK hizmet dökümü, vergi levhası)',
          'Akrabalık belgesi (nüfus kayıt örneği, evlilik cüzdanı, pasaport sayfaları)',
          'Sizin "masraflarımı [Ad Soyad] karşılayacaktır" beyanınız',
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">7. Banka Ekstresi Nasıl Sunulmalı?</h2>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8 space-y-2 text-sm text-slate-700">
        <p className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/>Banka şubesinden kaşeli ve imzalı alın — ekran görüntüsü kabul edilmez</p>
        <p className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/>Son 3 ay minimum, İngiltere için son 6 ay şarttır</p>
        <p className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/>Tüm sayfaları eksiksiz sunun (1/5, 2/5, … şeklinde sayfa numaralı)</p>
        <p className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/>IBAN, ad-soyad, TC kimlik no görünür olmalı</p>
        <p className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/>Döviz hesabıysa o gün kuru ile TL/EUR karşılığını da hesaplayın</p>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-8 flex gap-3">
        <TrendingUp className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-emerald-800 text-sm mb-1">Uzman Tavsiyesi</p>
          <p className="text-emerald-700 text-sm leading-relaxed">
            Güçlü iş belgesi, düzenli gelir ve tutarlı seyahat planı olan bir başvurucu için 50.000 TL
            bakiye yeterlidir. Tersine, belgeler zayıfsa 200.000 TL bakiye bile vizeyi garantilemez.
            Para miktarı profilin <strong>bir parçasıdır</strong>, tamamı değil.
          </p>
        </div>
      </div>

      <div className="mt-12 bg-brand-50 border border-brand-200 rounded-2xl p-6">
        <h3 className="font-bold text-brand-900 mb-2">Özet: Para Miktarı Değil, Para Hikayesi</h3>
        <p className="text-brand-800 text-sm leading-relaxed">
          Hesabınızdaki para bir rakam değil, konsolosluğa anlattığınız bir hikayedir.
          Planlamaya başvurudan 3-6 ay önce başlayın, düzenli gelir akışı gösterin ve
          büyük hareketleri açıklayabilecek belgeleri hazırda tutun.
        </p>
      </div>
    </BlogPostLayout>
  );
}
