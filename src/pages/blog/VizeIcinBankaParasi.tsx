import React from 'react';
import { AlertTriangle, CheckCircle2, Info, ShieldCheck } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'vize-icin-banka-hesabinda-ne-kadar-para',
  title: 'Banka Hesabında Ne Kadar Para Olması Vize Almayı Garantiler?',
  description: 'Schengen, ABD ve İngiltere vizesi için banka hesabında ne kadar para gerekir? Ülke bazlı minimum miktarlar, "sahte bakiye" tuzağı ve banka ekstresini doğru sunma rehberi.',
  category: 'İpucu',
  readingTime: 8,
  date: '2026-04-16',
  tags: ['banka ekstresi', 'vize parası', 'Schengen finansal', 'ne kadar para', 'vize garantisi'],
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: POST.title,
  description: POST.description,
  author: { '@type': 'Organization', name: 'VizeAkıl', url: 'https://vizeakil.com' },
  publisher: { '@type': 'Organization', name: 'VizeAkıl' },
  datePublished: POST.date,
  dateModified: POST.date,
  url: `https://vizeakil.com/blog/${POST.slug}`,
};

const ULKE_TUTARLARI = [
  { ulke: 'Schengen (Genel)', gun: '€80-120 / gün', min: '10 günlük seyahat için min. ~€1.200', not: 'Bazı ülkeler (Almanya, Hollanda) daha yüksek standart uygular.' },
  { ulke: 'Fransa', gun: '€120 / gün', min: '1 hafta için ~€850', not: 'Paris seyahatleri için daha yüksek bütçe beklentisi var.' },
  { ulke: 'İtalya', gun: '€80-100 / gün', min: '10 gün için ~€1.000', not: 'En tutarlı uygulama, orta miktarda bakiye kabul edilir.' },
  { ulke: 'ABD (B-2)', gun: 'Sabit kural yok', min: 'Genelde $3.000-5.000+ beklentisi', not: 'Seyahat uzunluğu ve koşam standardına göre değişir.' },
  { ulke: 'İngiltere', gun: '£80-100 / gün', min: '2 hafta için ~£1.500', not: 'Hesabın son 3-6 ay stabil olması kritik.' },
];

export default function VizeIcinBankaParasi() {
  return (
    <BlogPostLayout post={POST} schema={SCHEMA}>

      <p className="text-slate-700 leading-relaxed text-base mb-6">
        "Hesabımda 5.000 € var, vize alır mıyım?" sorusunun doğrudan bir yanıtı yoktur —
        çünkü vize garantisi yoktur. Ancak daha doğru bir soru sormak mümkün:
        <em>"Konsolosluk hangi banka profilini güvenilir buluyor?"</em> Miktar önemlidir,
        ama tek başına yeterli değildir. Paranın nereden geldiği ve ne zamandır hesapta
        olduğu en az miktar kadar kritiktir.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Ülke Bazında Tavsiye Edilen Minimum Tutarlar</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Resmi bir eşik yayımlanmamış olsa da konsoloslukların uygulamalarına bakarak
        şu referans değerler kullanılabilir:
      </p>
      <div className="space-y-3 mb-8">
        {ULKE_TUTARLARI.map(({ ulke, gun, min, not }) => (
          <div key={ulke} className="bg-white border border-slate-200 rounded-xl p-4 text-sm">
            <p className="font-semibold text-slate-800 mb-1">{ulke}</p>
            <div className="grid sm:grid-cols-2 gap-2 text-slate-600">
              <p><span className="font-medium text-slate-700">Günlük:</span> {gun}</p>
              <p><span className="font-medium text-slate-700">Minimum:</span> {min}</p>
            </div>
            <p className="text-slate-500 text-xs mt-1 italic">{not}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Miktar Yeterli ama "Sahte Bakiye" Tuzağı</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Konsolosluklarda vize görevlilerinin kılavuz eğitiminde bu senaryoya özellikle dikkat
        çekilir: başvuru tarihinden hemen önce hesaba büyük miktarda para yatırmak.
        Bu strateji <strong>backfire eder.</strong>
      </p>
      <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-red-800 text-sm mb-1">Son Dakika Para Yatırmanın Riskleri</p>
          <ul className="text-red-700 text-sm space-y-1 mt-1">
            <li>• Görevli son 3-6 ayın hareketini inceler; büyük bir yatırış şüphe uyandırır</li>
            <li>• "Bu para nereden geldi?" sorusu gündeme girer</li>
            <li>• Bir kişiden alınan borç veya kısa süreli transfer anında tespit edilir</li>
            <li>• Alman konsolosluğu gibi bazı yerlerde banka kaynağını ayrıca belgeletir</li>
          </ul>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Konsolosluğun Gerçekten Baktığı 4 Şey</h2>
      <div className="space-y-3 mb-8">
        {[
          { n: '1', b: 'Organik hareket', d: 'Düzenli giren maaş, düzenli giden faturalar. "Bu hesap aktif ve gerçek bir hayatı yansıtıyor" mesajı güven verir.' },
          { n: '2', b: 'Stabil veya büyüyen bakiye', d: 'Her ay belirli bir miktarın üzerinde kalan, zaman zaman yükselen hesap. Dalgalı ama genel eğilim artışta olan hesaplar da kabul görür.' },
          { n: '3', b: 'Açıklanamayan işlemsizlik', d: '"Son 2 yıldır hesapta hiç hareket yok, birden bire para yatırıldı" tablosu kötüdür.' },
          { n: '4', b: 'Açıklanamayan büyük para çekişleri', d: 'Başvuru öncesinde hesaptan büyük para çıkışı olmuşsa (ev alımı hariç) bu neden sorulabilir.' },
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

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Kendi Hesabınızda Para Yoksa Ne Yapabilirsiniz?</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Sponsor desteği yasal ve kabul gören bir yoldur. Ancak doğru belgelenmelidir:
      </p>
      <ul className="space-y-2 mb-6">
        {[
          'Sponsor davet/taahhüt mektubu (imzalı, noter onaylı tercih edilir)',
          'Sponsorun 6 aylık banka dökümü',
          'Sponsorun maaş bordrosu veya gelir belgesi',
          'Akrabalık belgesi (pasaport sayfası, nüfus kayıt örneği)',
          'Sizin "seyahat masraflarımı [isim] karşılayacak" yazılı beyanınız',
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-blue-800 text-sm leading-relaxed">
          <strong>Birden fazla hesabı var mı?</strong> TL hesabı + döviz hesabı + yatırım hesabı
          varsa hepsinin dökümünü sunun. Konsolosluk toplam varlık portföyünüzü değerlendirir.
          Tek hesap yetersiz görünüyorsa diğer hesaplar tabloyu güçlendirir.
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Banka Ekstresini Doğru Hazırlama</h2>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8 space-y-2 text-sm text-slate-700">
        <p className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/>Banka şubesinden kaşeli ve imzalı alın (online çıktı bazı konsolosluklar tarafından kabul edilmez)</p>
        <p className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/>Son 3 ay minimum, son 6 ay ideal</p>
        <p className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/>Tüm sayfaların tam olduğundan emin olun (1/3, 2/3, 3/3 şeklinde numaralı geliyorsa tüm sayfalar)</p>
        <p className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/>Ad, soyad ve IBAN'ın açıkça göründüğünden emin olun</p>
        <p className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/>Döviz hesabıysa TL karşılığını da belirtin (Almanya için Avro karşılığını hesaplayın)</p>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-8 flex gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-emerald-800 text-sm mb-1">Danışman İpucu: "Yeterli Para" Yanıltıcıdır</p>
          <p className="text-emerald-700 text-sm leading-relaxed">
            Büyük miktarda para, diğer belgeler yoksa sizi kurtarmaz. Ama güçlü belgeler +
            makul miktarda para birlikte çalışır. 50.000 TL hesapta olan biri ile 15.000 TL
            olan biri arasında, belge kalitesi eşit olduğunda fark minimaldır. Konsolosluk
            "zengin mi, fakir mi?" değil "gidecek güvencesi var mı, dönecek nedeni var mı?"
            diye sorar.
          </p>
        </div>
      </div>

      <div className="mt-12 bg-brand-50 border border-brand-200 rounded-2xl p-6">
        <h3 className="font-bold text-brand-900 mb-2">Kısaca: Para Miktarı Değil, Para Hikayesi</h3>
        <p className="text-brand-800 text-sm leading-relaxed">
          Hesabınızdaki para bir sayıdan ibaret değil; konsolosluğa anlattığınız bir hikayedir.
          Düzenli gelir, stabil bakiye ve organik hareketler bu hikayeyi güçlü kılar.
          "Son dakika" para yatırışları ise sizi güvenilir değil, umutsuz gösterir.
          Planlamayı 3 ay öncesinden başlatın; para kendi kendine biriksin.
        </p>
      </div>

    </BlogPostLayout>
  );
}
