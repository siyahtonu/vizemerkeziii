import React from 'react';
import { AlertTriangle, CheckCircle2, Info, ShieldCheck, XCircle } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'schengen-reddi-madde-8-itiraz',
  title: 'Schengen Vizesi Reddi (Madde 8) Ne Anlama Gelir? İtiraz Dilekçesi Nasıl Yazılır?',
  description: 'Schengen vize ret yazısındaki hukuki gerekçe kodlarını, özellikle Madde 8\'i anlıyoruz; ardından itiraz dilekçesi nasıl yazılır, hangi kanıtlar eklenir, zaman aşımı ne kadar?',
  category: 'Schengen',
  readingTime: 9,
  date: '2026-04-16',
  tags: ['Schengen reddi', 'Madde 8', 'vize itirazı', 'ret mektubu', 'dilekçe'],
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

const RET_MADDELERI = [
  { m: 'Madde 6(1)(a)', a: 'Geçerli seyahat belgesi yok (pasaport sorunu)' },
  { m: 'Madde 6(1)(b)', a: 'Çocuk belgesi / vasi izni eksik' },
  { m: 'Madde 6(1)(c)', a: 'Giriş izni veya dönüş vizesi ispatlanamıyor' },
  { m: 'Madde 6(1)(d)', a: 'Yeterli geçim kaynağı yok' },
  { m: 'Madde 6(1)(e)', a: 'SIS kayıtlı (güvenlik riski / yasaklı)' },
  { m: 'Madde 6(1)(f)', a: 'Kamu sağlığı riski' },
  { m: 'Madde 8(3)(c)', a: 'Beyan edilen seyahat amacı kanıtlanamıyor' },
  { m: 'Madde 8(3)(d)', a: 'Yeterli konaklama ve geri dönüş imkânı kanıtlanamıyor' },
  { m: 'Madde 8(6)', a: 'Konsolosluğun takdir hakkı (genel şüphe)' },
];

export default function SchengenReddiMadde8() {
  return (
    <BlogPostLayout post={POST} schema={SCHEMA}>

      <p className="text-slate-700 leading-relaxed text-base mb-6">
        Posta kutusuna düşen o beyaz zarf, içinde "REDDEDILDI" yazısı… Yıllar içinde büyük çoğunluğunun
        çözülebilir bir soruna dayandığını gördük. Önemli olan ret mektubundaki gerekçeyi doğru okumak
        ve itirazı veya yeni başvuruyu buna göre şekillendirmektir. Bu rehberde ret mektubunu satır
        satır nasıl analiz edeceğinizi ve itiraz dilekçesini nasıl yazacağınızı açıklıyoruz.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Ret Mektubunu Anlama: Hangi Madde, Ne Anlama Gelir?</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Schengen Vize Kodu kapsamında konsolosluklar ret kararını belirli maddelere dayandırmak
        zorundadır. Mektubunuzdaki işaretli kutu size neyin eksik bulunduğunu söyler:
      </p>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700">
              <th className="text-left p-3 rounded-tl-lg font-semibold">Madde</th>
              <th className="text-left p-3 rounded-tr-lg font-semibold">Anlam</th>
            </tr>
          </thead>
          <tbody>
            {RET_MADDELERI.map((r, i) => (
              <tr key={r.m} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                <td className="p-3 font-mono font-medium text-brand-700">{r.m}</td>
                <td className="p-3 text-slate-700">{r.a}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Madde 8 Detayı: "Amaç Kanıtlanamıyor"</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        <strong>Madde 8(3)(c)</strong> — yani "beyan edilen seyahat amacının kanıtlanamadığı" —
        en yaygın ret gerekçelerinden biridir ve çoğunlukla şu durumlarda işaretlenir:
      </p>
      <ul className="space-y-2 mb-6">
        {[
          'Konaklama ve uçak rezervasyonu sunulmamış veya sahte görünümlü',
          'Niyet mektubu çok genel kalmış, özel plan içermiyor',
          'Seyahat planı (itinerary) hiç eklenmemiş',
          'Turizm amacı bildirilmiş ama hesapta para yetersiz',
          'Başvuru formundaki bilgilerle belgeler uyumsuz',
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-blue-800 text-sm leading-relaxed">
          Madde 8 redi, belge kalitesine odaklanan bir reddedir. Bu, güvenlik veya yasaklılık
          kaynaklı değildir. Doğru belgelerle itiraz veya yeni başvuru çoğunlukla başarıyla
          sonuçlanır.
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">İtiraz Hakkı: Süre ve Usul</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Schengen Vize Kodu Madde 32(3) uyarınca ret kararına itiraz hakkı bulunmaktadır.
        Ancak itirazın yapılacağı mercii ve süresi ülkeden ülkeye değişir:
      </p>
      <div className="space-y-3 mb-8">
        {[
          { u: 'Almanya', b: 'Konsolosluk kararına itiraz: Konsolosluğa doğrudan yazılı itiraz (Widerspruch). Ret tarihinden itibaren 1 ay.', r: 'Yüksek' },
          { u: 'Fransa', b: 'Fransız Göç Mahkemesi\'ne (CNDA) başvuru. Pratik açıdan zor ve pahalı.', r: 'Düşük' },
          { u: 'İtalya', b: 'Yerel İtalyan idare mahkemesine başvuru veya konsolosluğa yeniden başvuru daha pratiktir.', r: 'Orta' },
          { u: 'İspanya', b: 'Büyükelçiliğe yazılı itiraz. 1 ay içinde yanıt verilmesi zorunlu.', r: 'Orta' },
        ].map(({ u, b, r }) => (
          <div key={u} className="bg-white border border-slate-200 rounded-xl p-4 text-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-slate-800">{u}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${r === 'Yüksek' ? 'bg-emerald-100 text-emerald-700' : r === 'Orta' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                İtiraz başarı şansı: {r}
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed">{b}</p>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-amber-700 text-sm leading-relaxed">
          <strong>Pratik gerçek:</strong> Çoğu hukuk bürosunun tavsiyesi, uzun soluklu yargı
          sürecine girmek yerine eksiklikleri giderip <em>yeni başvuru yapmaktır.</em>
          Özellikle Madde 8 retlerinde bu yaklaşım hem hızlı hem de daha yüksek başarı oranı
          sunar.
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">İtiraz Dilekçesi Nasıl Yazılır?</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        İtiraz dilekçesini Türkçe değil, konsolosluğun dilinde veya İngilizce yazın.
        Dilekçenizin içermesi gerekenler:
      </p>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6 space-y-3 text-sm text-slate-700">
        <div className="flex items-start gap-2">
          <span className="font-bold text-brand-600 shrink-0">1.</span>
          <p><strong>Başlık ve kimlik:</strong> Ad-soyad, pasaport numarası, başvuru tarihi, ret mektup tarihi ve ref. numarası.</p>
        </div>
        <div className="flex items-start gap-2">
          <span className="font-bold text-brand-600 shrink-0">2.</span>
          <p><strong>Ret gerekçesine itiraz:</strong> Hangi maddeye karşı çıkıyorsunuz, neden hatalı bulduğunuzu açıklayın. "Konaklama belgemi ekledim, yeniden değerlendirilmesini talep ediyorum" gibi.</p>
        </div>
        <div className="flex items-start gap-2">
          <span className="font-bold text-brand-600 shrink-0">3.</span>
          <p><strong>Yeni/ek kanıtlar:</strong> Eksik bulunan belgelerle birlikte dilekçenizi sunun. Sadece yazı yeterli değil, kanıt ekleyin.</p>
        </div>
        <div className="flex items-start gap-2">
          <span className="font-bold text-brand-600 shrink-0">4.</span>
          <p><strong>Geri dönüş taahhüdü:</strong> Türkiye'deki bağlarınızı bir kez daha netleştirin (iş, aile, mülk).</p>
        </div>
        <div className="flex items-start gap-2">
          <span className="font-bold text-brand-600 shrink-0">5.</span>
          <p><strong>Talep cümlesi:</strong> "Ret kararının yeniden değerlendirilerek vizem onaylanmasını saygıyla arz ederim" gibi net bir kapanış.</p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">İtiraz mı, Yeni Başvuru mu?</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-sm">
          <p className="font-semibold text-slate-800 mb-2">İtiraz tercih edin eğer:</p>
          <ul className="space-y-1 text-slate-600">
            <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0"/>Ret açıkça hatalı (belgeler ibraz edilmişti ama görmezden gelindi)</li>
            <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0"/>Almanya konsolosluğu gibi güçlü itiraz süreci olan ülke söz konusu</li>
            <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0"/>Yanınızda itiraz sürecini yönetebilecek hukuk desteği var</li>
          </ul>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-sm">
          <p className="font-semibold text-slate-800 mb-2">Yeni başvuru tercih edin eğer:</p>
          <ul className="space-y-1 text-slate-600">
            <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0"/>Belgelerinizde gerçekten eksiklik vardı</li>
            <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0"/>Yeni koşullar oluştu (yeni iş, daha güçlü banka ekstresi)</li>
            <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0"/>Zaman baskısı yok, 2-3 ay bekleyebilirsiniz</li>
          </ul>
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-8 flex gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-emerald-800 text-sm mb-1">Danışman İpucu: Ret'i İfşa Etmeli misiniz?</p>
          <p className="text-emerald-700 text-sm leading-relaxed">
            Yeni başvuruda "daha önce reddedildiniz mi?" sorusu sizi dürüstlüğe zorlar.
            <strong> Evet deyin, gizlemeyin.</strong> Konsolosluklar kayıtları kontrol eder.
            Ret yaşandığını gizlemek, mevcut ret sebebinden çok daha ciddi bir sorun yaratır.
          </p>
        </div>
      </div>

      <div className="mt-12 bg-brand-50 border border-brand-200 rounded-2xl p-6">
        <h3 className="font-bold text-brand-900 mb-2">Ret Bir Son Değil, Geri Bildirimdir</h3>
        <p className="text-brand-800 text-sm leading-relaxed">
          Büromuzdaki deneyimler gösteriyor: İlk başvuruda reddedilenlerin büyük çoğunluğu
          eksiklikleri giderdikten sonra ikinci başvurularını onaylattı. Ret mektubundaki
          maddeyi doğru okuyun, eksiği giderin ve hikayenizi tutarlı belgelerle destekleyin.
          Konsolosluklar insanları cezalandırmak için değil, değerlendirmek için orada.
        </p>
      </div>

    </BlogPostLayout>
  );
}
