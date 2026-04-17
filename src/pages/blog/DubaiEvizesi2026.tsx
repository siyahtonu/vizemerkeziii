import React from 'react';
import { CheckCircle2, Info, Plane, Clock, AlertTriangle, Sparkles, MapPin } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'dubai-e-vizesi-2026-basvuru-rehberi',
  title: 'Dubai E-Vizesi 2026: Başvuru Süreci, Ücretler ve İpuçları',
  description: 'Dubai/BAE e-vizesi nasıl alınır? 14, 30, 60 günlük e-vize seçenekleri, ücretler, gerekli belgeler ve pratik ipuçları. 2026 güncel rehber.',
  category: 'Dubai',
  readingTime: 8,
  date: '2026-04-17',
  tags: ['Dubai vizesi', 'BAE e-vize', 'Dubai başvuru', '2026'],
};

const VIZE_TURLERI = [
  { tur: 'Turist e-vizesi', sure: '58 gün geçerli', ucret: '375 AED (~3.800 TL)', kalis: '14 gün' },
  { tur: '30 gün turist vizesi', sure: '58 gün geçerli', ucret: '475 AED (~4.800 TL)', kalis: '30 gün' },
  { tur: '60 gün turist vizesi', sure: '58 gün geçerli', ucret: '675 AED (~6.900 TL)', kalis: '60 gün' },
  { tur: 'Çok girişli 1 yıllık', sure: '1 yıl', ucret: '800 AED (~8.200 TL)', kalis: 'Her giriş 90 gün' },
  { tur: 'Transit vizesi', sure: '14 gün', ucret: '200 AED (~2.000 TL)', kalis: '96 saat' },
];

const BELGELER = [
  'Pasaport (en az 6 ay geçerli, 2 boş sayfa)',
  'Pasaport fotoğraf sayfasının renkli taraması',
  'Vesikalık fotoğraf (beyaz arka plan, dijital)',
  'Gidiş-dönüş uçak bileti rezervasyonu',
  'Otel rezervasyonu',
  'Seyahat sigortası (tavsiye edilir, zorunlu değil)',
];

const RED_NEDENLERI = [
  'Pasaportta İsrail damgası (bazen reddedilir)',
  'Önceki BAE seyahatinde fazla kalma',
  'Pasaport son 6 aydan az geçerli',
  'Pasaport hasarlı veya sayfası eksik',
  'Başvuru formundaki bilgi yanlışlıkları',
  'Yasaklı listelerde isim benzerliği (nadir)',
];

const MUAFIYETLER = [
  'GCC ülkeleri vatandaşları (Suudi Arabistan, Kuveyt, Katar, Bahreyn, Umman)',
  '14 yaş altı çocukların transit vizesi',
  '48 saat içinde aktarma yapan yolcular (transit alanda kalıyorsa)',
  "BAE'de ikamet izni olan yabancılar (ikamet vizesi yeterli)",
];

const IPUCLARI = [
  'Yaz aylarından (Haziran-Eylül) kaçının — sıcaklık 45°C\'ye çıkar',
  'En iyi seyahat zamanı: Kasım-Mart arası (sıcaklık 20-30°C)',
  'Alkol tüketimi sadece otel barlarında ve lisanslı restoranlarda serbest',
  'Ramazan ayında gündüz yeme-içme kamu alanlarında yasaktır',
  'Dubai Metrosu pratik ve ucuzdur (Nol kartı 25 AED)',
  'Taksi ve Careem/Uber uygulamaları aktif',
  'Arapça bilmenize gerek yok — İngilizce yaygın',
];

const EMIRLIKLER = [
  { ad: 'Dubai', aciklama: 'En turistik, lüks alışveriş, Burj Khalifa, Palm Jumeirah' },
  { ad: 'Abu Dhabi', aciklama: 'Başkent, Sheikh Zayed Camii, Louvre Abu Dhabi' },
  { ad: 'Sharjah', aciklama: 'Kültürel merkez, müzeler (alkol yasaktır)' },
  { ad: 'Ras Al-Khaimah', aciklama: 'Dağ macerası, Jebel Jais' },
];

const SSS = [
  {
    q: "Dubai'ye vizesiz gidebilir miyim?",
    a: "Hayır, Türk vatandaşları için Dubai vizesi zorunludur. Ancak Umman'da ikamet izniniz varsa veya GCC vatandaşıysanız vizesiz girebilirsiniz.",
  },
  {
    q: 'Dubai e-vize ne kadar sürede çıkar?',
    a: 'Genellikle 3-5 iş günü. Bazen 24 saat içinde de çıkabilir. Yoğun sezonlarda (Aralık-Ocak) süre uzayabilir. Seyahatten en az 10 gün önce başvuru yapmak güvenlidir.',
  },
  {
    q: "Dubai'de vizemi uzatabilir miyim?",
    a: "Evet. 30 günlük vizeyi 30 gün daha uzatabilirsiniz (620 AED). Bunu bir seyahat acentesi veya Amer Service aracılığıyla yapabilirsiniz. Ancak ülkeden çıkıp tekrar girmek (Umman'a gidip dönmek) genellikle daha pratiktir.",
  },
  {
    q: "Eşim Umman'da yaşıyor, Dubai'ye birlikte gidebilir miyiz?",
    a: "Eşiniz Umman ikamet izni sahibiyse Dubai'ye vizesiz girebilir. Siz Türk vatandaşı olarak e-vize almanız gerekir. Her ikinizin de farklı vize durumu olabilir.",
  },
  {
    q: 'Dubai vize süresi geçtikten sonra ülkeden nasıl çıkarım?',
    a: 'Havalimanındaki "Amer Service" noktasında overstay cezasını ödeyip çıkış yapabilirsiniz. Ödemeden çıkış yapılamaz. Büyük fazla kalma durumlarında detaylı sorgulama yapılabilir.',
  },
  {
    q: "Dubai'de e-vize dijital mi yoksa yazdırmam mı gerekir?",
    a: 'Her ikisi de kabul edilir. Telefonunuzda PDF olarak bulundurmak yeterlidir. Ancak yedek olarak yazıcıdan bir kopya basılı bulundurmak güvenlidir.',
  },
];

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
      mainEntity: SSS.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    },
  ],
};

export default function DubaiEvizesi2026() {
  return (
    <BlogPostLayout post={POST} schema={SCHEMA}>
      <p className="text-slate-700 leading-relaxed text-base mb-6">
        Türk gezginlerin en popüler destinasyonlarından biri olan Dubai, hem lüks alışveriş hem de
        görkemli mimarisiyle dikkat çekiyor. İyi haber: Dubai vizesi, Schengen vizesine kıyasla çok
        daha kolay ve hızlı. E-vize sistemiyle başvuru tamamen dijital ve genellikle 3-5 gün içinde
        sonuçlanıyor. Bu rehber, Dubai (BAE) e-vizesinin tüm detaylarını içeriyor.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Dubai (BAE) Vize Türleri</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Birleşik Arap Emirlikleri (BAE), Dubai dahil tüm emirlikler için Türk vatandaşlarından vize
        ister. Ancak birçok farklı seçenek vardır:
      </p>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full text-sm border border-slate-200 rounded-xl overflow-hidden">
          <thead className="bg-brand-50">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-slate-900">Vize Türü</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-900">Süre</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-900">Ücret (2026)</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-900">Kalış Hakkı</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {VIZE_TURLERI.map((v) => (
              <tr key={v.tur} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-800 font-medium">{v.tur}</td>
                <td className="px-4 py-3 text-slate-700">{v.sure}</td>
                <td className="px-4 py-3 text-slate-700">{v.ucret}</td>
                <td className="px-4 py-3 text-slate-700">{v.kalis}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-8 flex gap-3">
        <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <p className="text-emerald-900 text-sm leading-relaxed">
          En popüler seçenek <strong>30 günlük turist vizesidir</strong>. Çoğu tatilci için ideal
          süredir ve makul fiyatlıdır.
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Dubai E-Vizesi Nasıl Alınır? Adım Adım</h2>

      <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">Yöntem 1: Havayolu Üzerinden Başvuru (En Kolay)</h3>
      <p className="text-slate-700 leading-relaxed mb-4">
        Emirates Airlines, flydubai veya Etihad Airways ile Dubai'ye uçacaksanız, bilet satın
        alırken doğrudan e-vize başvurusu yapabilirsiniz. Bu yöntem en pratik ve güvenilir olanıdır.
      </p>
      <ol className="list-decimal list-inside space-y-2 text-slate-700 mb-6 pl-2">
        <li>Emirates/flydubai/Etihad sitesinden gidiş-dönüş bileti alın</li>
        <li>"Visa Services" veya "Manage Your Booking" menüsünden e-vize başvurusunu seçin</li>
        <li>Pasaport bilgilerinizi ve fotoğrafınızı yükleyin</li>
        <li>Ödeme yapın (kredi kartı ile)</li>
        <li>3-5 iş günü içinde e-vize e-postanıza gelir</li>
      </ol>

      <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">Yöntem 2: Otel Üzerinden Başvuru</h3>
      <p className="text-slate-700 leading-relaxed mb-6">
        Dubai'de 4-5 yıldızlı bir otelde konaklayacaksanız, otel genellikle sizin için vize
        başvurusu yapabilir. Otel rezervasyonu yaparken "visa sponsorship" seçeneğini sorun.
      </p>

      <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">Yöntem 3: Konsolosluk / Vize Merkezi</h3>
      <p className="text-slate-700 leading-relaxed mb-6">
        Direkt BAE konsolosluğundan başvuru da mümkündür. İstanbul veya Ankara'daki BAE
        Başkonsolosluklarından randevu alabilirsiniz. Ancak genellikle e-vize daha hızlı ve
        kolaydır.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Dubai E-Vizesi İçin Gerekli Belgeler</h2>
      <ul className="space-y-2 mb-4">
        {BELGELER.map((b) => (
          <li key={b} className="flex gap-2 text-slate-700">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-blue-900 text-sm leading-relaxed">
          <strong>Önemli:</strong> Dubai e-vizesi başvurusu için banka hesap dökümü, çalışma belgesi
          gibi Schengen seviyesinde evrak istenmez. Süreç çok daha basittir.
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Başvuru Sonrası Süreç</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Başvurunuzu tamamladıktan sonra 3-5 iş günü içinde (bazen 24 saat içinde) e-vize e-posta ile
        gelir. E-vize PDF formatındadır ve üzerinde:
      </p>
      <ul className="space-y-2 mb-4">
        {['Referans numarası', 'Pasaport bilgileri', 'Giriş ve kalış süresi', 'QR kod (havalimanında taranır)'].map((x) => (
          <li key={x} className="flex gap-2 text-slate-700">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <span>{x}</span>
          </li>
        ))}
      </ul>
      <p className="text-slate-700 leading-relaxed mb-8">
        E-vizeyi yazıcıdan basarak veya telefonunuzda PDF olarak yanınızda bulundurun. Dubai
        havalimanında bu belge ibraz edilerek giriş yapılır.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Dubai Havalimanında Giriş Süreci</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Dubai Uluslararası Havalimanı (DXB), dünyanın en yoğun havalimanlarından biri. Ancak sistem
        çok hızlı çalışır:
      </p>
      <ol className="list-decimal list-inside space-y-2 text-slate-700 mb-4 pl-2">
        <li>Uçaktan indikten sonra "Arrivals" tabelalarını takip edin</li>
        <li>Pasaport kontrolüne gelirken e-vizenizi hazır bulundurun</li>
        <li>"Smart Gate" (akıllı kapı) kuyruğu daha hızlıdır — biyometrik pasaportla kullanılabilir</li>
        <li>İlk girişte parmak izi ve iris taraması yapılır</li>
        <li>Bagaj alanına geçip bagajınızı alın</li>
        <li>Gümrükten çıkış (herhangi bir beyan yoksa "Nothing to Declare" çıkışı)</li>
      </ol>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-8 flex gap-3">
        <Clock className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
        <p className="text-slate-800 text-sm leading-relaxed">
          Normal geçiş süresi 20-45 dakika arası değişir. Yoğun saatlerde 1 saati bulabilir.
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Çok Girişli Dubai Vizesi Avantajı</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Dubai'ye sık sık giden iş insanları veya yatırımcılar için 1 yıllık çok girişli vize ideal
        bir seçenektir. 800 AED ücretiyle 1 yıl boyunca sınırsız giriş yapabilirsiniz. Her girişte
        90 güne kadar kalma hakkı vardır.
      </p>
      <p className="text-slate-700 leading-relaxed mb-8">
        Bu vize özellikle şu profillere uygun: Dubai'de iş ortağı olan Türk iş insanları, altın
        piyasasında aktif olanlar, gayrimenkul sahipleri, sık tatil yapanlar.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Dubai Vize Reddi: Neden Olabilir?</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Dubai vizesi nadiren reddedilir ancak bazı durumlar sorun yaratır:
      </p>
      <ul className="space-y-2 mb-4">
        {RED_NEDENLERI.map((r) => (
          <li key={r} className="flex gap-2 text-slate-700">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <span>{r}</span>
          </li>
        ))}
      </ul>
      <p className="text-slate-700 leading-relaxed mb-8">
        Red halinde Dubai vize ücreti iade edilmez. Yeniden başvuru yapılabilir.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Dubai Vize Ücretleri Kimler Muaf?</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Bazı özel durumlarda Dubai vizesinden muafiyet vardır:
      </p>
      <ul className="space-y-2 mb-8">
        {MUAFIYETLER.map((m) => (
          <li key={m} className="flex gap-2 text-slate-700">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <span>{m}</span>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Dubai'de Kalış Süresi Aşımı (Overstay)</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Dubai'de vize süreniz dolduktan sonra her gün için ceza ödemeniz gerekir:
      </p>
      <ul className="space-y-2 mb-4">
        <li className="flex gap-2 text-slate-700"><AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" /><span>İlk gün: 100 AED</span></li>
        <li className="flex gap-2 text-slate-700"><AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" /><span>Sonraki her gün: 25 AED</span></li>
        <li className="flex gap-2 text-slate-700"><AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" /><span>10 gün sonra: Ekstra 1.000 AED cezası</span></li>
      </ul>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-amber-900 text-sm leading-relaxed">
          <strong>Örnek:</strong> 5 gün fazla kaldığınızda cezanız yaklaşık 200 AED (~2.000 TL)
          olur. Uzun süreli overstay'ler (30+ gün) Türkiye'ye geri dönüş yasağına yol açabilir.
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Dubai Seyahati Pratik İpuçları</h2>
      <ol className="list-decimal list-inside space-y-2 text-slate-700 mb-8 pl-2">
        {IPUCLARI.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ol>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Dubai vs Abu Dhabi vs Diğer Emirlikler</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        BAE vize tüm 7 emirliği kapsar. Yani Dubai e-vizesi ile Abu Dhabi, Sharjah, Ajman, Ras
        Al-Khaimah, Fujairah ve Umm Al-Quwain'e de gidebilirsiniz.
      </p>
      <div className="grid gap-3 sm:grid-cols-2 mb-8">
        {EMIRLIKLER.map((e) => (
          <div key={e.ad} className="border border-slate-200 rounded-xl p-4 bg-white">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-brand-600" />
              <h3 className="font-semibold text-slate-900">{e.ad}</h3>
            </div>
            <p className="text-slate-700 text-sm">{e.aciklama}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Sık Sorulan Sorular (SSS)</h2>
      <div className="space-y-4 mb-10">
        {SSS.map((item) => (
          <div key={item.q} className="border border-slate-200 rounded-xl p-5 bg-white">
            <h3 className="font-semibold text-slate-900 mb-2">{item.q}</h3>
            <p className="text-slate-700 text-sm leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>
    </BlogPostLayout>
  );
}
