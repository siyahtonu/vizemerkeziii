import React from 'react';
import { CheckCircle2, Info, Heart, ShieldCheck, AlertTriangle } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'emekliler-icin-vize-basvurusu-rehberi',
  title: 'Emekliler İçin Vize Rehberi: Hangi Ülke Daha Kolay? 2026',
  description: 'Emekliler Schengen, ABD, İngiltere vize başvurusunu nasıl yapar? Gerekli belgeler, emekli maaşı şartları, kolay ülkeler ve başarı ipuçları.',
  category: 'Genel',
  readingTime: 10,
  date: '2026-04-17',
  tags: ['emekli', 'emekli vize', 'SGK', 'sağlık sigortası'],
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: POST.title,
      description: POST.description,
      author: { '@type': 'Organization', name: 'VizeAkıl', url: 'https://vizeakil.com' },
      publisher: { '@type': 'Organization', name: 'VizeAkıl', logo: { '@type': 'ImageObject', url: 'https://vizeakil.com/og-image.png' } },
      datePublished: POST.date,
      dateModified: POST.date,
      url: `https://vizeakil.com/blog/${POST.slug}`,
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: '70 yaşındayım, vize alabilir miyim?', acceptedAnswer: { '@type': 'Answer', text: 'Evet. Yaş sınırı yoktur. Sağlıklı olduğunuzu gösteren rapor ve uygun sağlık sigortası yeterlidir. 70-80 yaş grubu başvurularında onay oranları sağlıklı ve güçlü maddi profille yüksektir.' } },
        { '@type': 'Question', name: 'Emekli maaşım çok düşük, vize alamam mı?', acceptedAnswer: { '@type': 'Answer', text: 'Alabilirsiniz. Çocuk veya eş sponsorluğu ile başvurursanız, onların finansal gücü değerlendirilir. Ek olarak varsa mülk ve birikimleriniz de desteklik belge olarak sunulabilir.' } },
        { '@type': 'Question', name: 'Eşim ve ben birlikte başvuruyoruz, ayrı mı ortak mı?', acceptedAnswer: { '@type': 'Answer', text: 'Her ikiniz de ayrı başvuru formu doldurursunuz, ancak aile başvurusu olarak birlikte sunulur. Mali belgeler her iki için de aynı dosyada yer alabilir. Randevu alırken "aile başvurusu" seçilir.' } },
        { '@type': 'Question', name: 'Kronik hastalığım var, seyahat sigortası kapsar mı?', acceptedAnswer: { '@type': 'Answer', text: 'Standart poliçeler kronik hastalıkları kapsamaz. "Kronik hastalık alerjisi" veya "önceden var olan durum" kapsamı olan özel poliçelere ihtiyacınız olur. Bu poliçeler daha pahalıdır ancak reddedilme riskinizi azaltır.' } },
        { '@type': 'Question', name: 'Emekli olduktan hemen sonra başvurabilir miyim?', acceptedAnswer: { '@type': 'Answer', text: 'Evet, ancak emeklilikten en az 3-6 ay geçmesi, emekli maaşınızın banka hesabına düzenli yatmaya başlaması tavsiye edilir.' } },
        { '@type': 'Question', name: 'Torunumu ziyarete Almanya\'ya gideceğim, ne yapmalıyım?', acceptedAnswer: { '@type': 'Answer', text: 'Davet mektubu (Einladung/Verpflichtungserklärung) gerekir. Almanya\'daki torununuzun ikamet ettiği yerin Ausländerbehörde\'sinden alınır. Bu belge, finansal sorumluluğu üstlendiği anlamına gelir ve başvurunuzu güçlendirir.' } },
      ],
    },
  ],
};

const KOLAY_ULKELER = [
  { ulke: 'İtalya', onay: '%95+', tavsiye: 'Altın emeklilik turu için ideal.' },
  { ulke: 'Yunanistan', onay: '%92', tavsiye: 'Komşu ülke, kısa seyahatler için mükemmel.' },
  { ulke: 'İspanya', onay: '%91', tavsiye: 'Sahil ve kültür turları.' },
  { ulke: 'Fransa', onay: '%90', tavsiye: 'Paris kültür gezileri için ideal.' },
  { ulke: 'Portekiz', onay: '%89', tavsiye: 'Az rekabet, kolay randevu.' },
  { ulke: 'Almanya', onay: '%82', tavsiye: 'Bekleme süresi uzun olabilir.' },
];

const RED_SEBEPLERI = [
  { sebep: 'Yetersiz maddi gelir', cozum: 'Sponsor desteği veya ek gelir belgeleri' },
  { sebep: 'Sağlık sigortası uygun değil', cozum: '30.000 € kapsamlı yeni poliçe' },
  { sebep: 'Seyahat amacı belirsiz', cozum: 'Detaylı program ve gezi listesi' },
  { sebep: 'Geri dönüş şüphesi', cozum: 'Mülk tapuları, aile bağı belgeleri' },
  { sebep: 'Kronik hastalık endişesi', cozum: 'Seyahate uygunluk raporu' },
];

export default function EmekliVizeBasvurusu() {
  return (
    <BlogPostLayout post={POST} schema={SCHEMA}>
      <p className="text-slate-700 leading-relaxed text-base mb-6">
        Emeklilik, seyahat için en uygun dönemdir: bol zaman, birikmiş bütçe, rahatlık. Ancak
        vize konsoloslukları bazen emeklilere gereksiz soru işaretleriyle bakar — "gelir düşük,
        geri dönmeyebilir" gibi. Gerçek şu ki, emekliler için vize almak, ev hanımlarından bile
        daha kolay olabilir. Doğru belgelerle başvurulduğunda, emekliler en yüksek onay oranlarına
        sahip gruplar arasındadır.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Emekliler Vize Başvurusunda Neden Avantajlı?</h2>
      <div className="bg-brand-50 border border-brand-200 rounded-xl p-5 mb-8 flex gap-3">
        <Heart className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
        <p className="text-brand-900 text-sm leading-relaxed">
          Emekliler, konsolosluk gözünde birçok nedenden avantajlıdır. Evvel emirde, emekli
          maaşı düzenli ve güvenceli bir gelir kaynağıdır — SGK, Bağ-Kur veya özel emekli
          maaşları devlet tarafından garanti altına alınmıştır. İkinci olarak, emekliler genellikle
          ev sahibidir; Türkiye'de mülkü, aile bağları, torunları olan biri, ülkede kalma
          motivasyonu güçlüdür. Üçüncüsü, emekliler tipik olarak turist profilinde seyahat eder.
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Emekliler İçin Gerekli Belgeler</h2>
      <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">Standart Belgeler</h3>
      <ul className="space-y-2 mb-6">
        {[
          'Pasaport (6+ ay geçerli, 2+ boş sayfa)',
          '2 adet biyometrik fotoğraf (6 ay içinde)',
          'Başvuru formu (online veya matbu)',
          'Seyahat sigortası (minimum 30.000 € tutarında)',
          'Uçak rezervasyonu',
          'Otel rezervasyonu veya konaklama belgesi',
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>
      <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">Emeklilere Özel Belgeler</h3>
      <ul className="space-y-2 mb-6">
        {[
          'Emekli maaş belgesi: SGK, Bağ-Kur veya ilgili emekli sandığından alınmış aylık gelir beyannamesi',
          'Emekli kimlik kartı: Fotokopisi veya onaylı sureti',
          'Banka hesap dökümü: Son 3-6 aylık, emekli maaşının düzenli yatışını gösteren',
          'Emeklilik onay yazısı: İlk emekliliğe çıktığınız tarih ve kurumun belirten resmi yazı',
          'Ek gelir belgeleri: Varsa kira geliri, yatırım geliri, dividend gibi belgeler',
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>
      <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">Mülk ve Aile Bağları</h3>
      <ul className="space-y-2 mb-8">
        {[
          'Tapu belgeleri: Ev, arsa, yazlık gibi gayrimenkullerin tapu fotokopileri',
          'Araç ruhsatı: Arabanız varsa, Türkiye\'deki yaşamınızın göstergesi',
          'Vukuatlı nüfus kayıt örneği: Aile yapısını gösterir (çocuklar, torunlar)',
          'Çocuklarınızın ve torunlarınızın bilgileri: Türkiye\'de yaşadıklarının kanıtı',
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Emekli Maaşı Miktarı Vize Kararını Nasıl Etkiler?</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        "Emekli maaşım 18.000 TL, vize alabilir miyim?" — sık sorulan soru.
        <strong> Cevap: Evet.</strong> Konsolosluk tek bir rakama bakmaz; toplam finansal
        tablonuza bakar. 2026 yılı için tavsiye edilen finansal profil:
      </p>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border border-slate-200 rounded-xl overflow-hidden">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left px-3 py-2 font-semibold text-slate-700">Finansal Kalem</th>
              <th className="text-left px-3 py-2 font-semibold text-slate-700">Minimum Tavsiye</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Aylık emekli maaşı', '10.000+ TL (yeterli minimum)'],
              ['Banka hesap bakiyesi', '80.000-150.000 TL arası'],
              ['Ek gelir (varsa)', 'Kira, yatırım geliri değerli'],
              ['Mülk değeri (toplam)', '500.000+ TL gayrimenkul'],
            ].map(([k, v]) => (
              <tr key={k} className="border-t border-slate-200">
                <td className="px-3 py-2 text-slate-700">{k}</td>
                <td className="px-3 py-2 text-slate-600">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-slate-700 leading-relaxed mb-8 text-sm">
        <strong>Düşük emekli maaşı olanlar için strateji:</strong> Eş veya çocukların sponsor
        olması. Emekliyseniz ve eşiniz de çalışıyorsa, iki gelir de başvuruya eklenmelidir.
        Oğlunuz veya kızınız sponsor olarak masrafları üstlenebilir — bu, tamamen kabul görür
        bir durumdur.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Emekliler İçin En Kolay Ülkeler</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Emekliler için onay oranları genel ortalamadan yüksek seyreder. 2024 istatistiklerine göre:
      </p>
      <div className="space-y-2 mb-8">
        {KOLAY_ULKELER.map(({ ulke, onay, tavsiye }) => (
          <div key={ulke} className="bg-white border border-slate-200 rounded-xl p-4 text-sm">
            <div className="flex justify-between items-center mb-1">
              <p className="font-semibold text-slate-800">{ulke}</p>
              <span className="text-emerald-700 font-bold">{onay}</span>
            </div>
            <p className="text-slate-600 italic">{tavsiye}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Sağlık Sigortası: Emekliler İçin Kritik Konu</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Schengen vizesi için 30.000 € seyahat sağlık sigortası zorunludur. Ancak 65 yaş üstü
        başvurucular için durum farklıdır:
      </p>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <ul className="text-amber-900 text-sm space-y-1">
          <li>• 65 yaş üstü poliçe fiyatları yüksektir (10 günlük poliçe 500-1.500 TL)</li>
          <li>• Kronik hastalıklar genellikle poliçe kapsamı dışındadır — özel poliçe gerekir</li>
          <li>• Bazı sigorta şirketleri 75 yaş üstüne poliçe yazmaz</li>
          <li>• "All coverage" poliçeler kronik hastalıkları da kapsayabilir</li>
        </ul>
      </div>
      <p className="text-slate-700 leading-relaxed mb-8 text-sm">
        <strong>Önerilen sigorta şirketleri:</strong> AK Sigorta, Allianz, AXA, Mapfre, Türkiye
        Sigorta. Online karşılaştırma siteleri (sigortam.net, koalay.com) 65+ için en uygun
        poliçeyi bulmanıza yardım eder.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Emeklilere Özel 7 Başarı İpucu</h2>
      <div className="space-y-3 mb-8">
        {[
          'Banka hesap hareketlerinizi 6 ay sakin tutun — ani büyük transferler olmasın',
          'Mülk tapularınızın güncel değeri olan kopyalarını hazırlayın',
          'Torunlarınızla fotoğraflar, aile bağı gücünü gösterir (dosyaya eklenebilir)',
          'Sağlık raporu ekleyin (sağlıklı olduğunuzu gösteren ve seyahate uygun)',
          'Seyahat sigortasını güvenilir şirketten alın (ucuz internet poliçesi kabul edilmeyebilir)',
          'Seyahat programını detaylı yazın — geziler, müzeler, şehirler listelensin',
          'Eşinizle birlikte başvurun — aile başvurusu güvenlik sinyali verir',
        ].map((tip, i) => (
          <div key={tip} className="flex gap-3">
            <span className="shrink-0 w-7 h-7 rounded-full bg-brand-100 text-brand-700 font-bold text-xs flex items-center justify-center">{i + 1}</span>
            <p className="text-slate-700 text-sm leading-relaxed">{tip}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Yaygın Red Sebepleri ve Çözümleri</h2>
      <div className="space-y-2 mb-8">
        {RED_SEBEPLERI.map(({ sebep, cozum }) => (
          <div key={sebep} className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
              <p className="font-semibold text-red-800">{sebep}</p>
              <p className="text-emerald-700">→ {cozum}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Sık Sorulan Sorular (SSS)</h2>
      <div className="space-y-4 mb-8">
        {[
          { q: '70 yaşındayım, vize alabilir miyim?', a: 'Evet. Yaş sınırı yoktur. Sağlıklı olduğunuzu gösteren rapor ve uygun sağlık sigortası yeterlidir. 70-80 yaş grubu başvurularında onay oranları sağlıklı ve güçlü maddi profille yüksektir.' },
          { q: 'Emekli maaşım çok düşük, vize alamam mı?', a: 'Alabilirsiniz. Çocuk veya eş sponsorluğu ile başvurursanız, onların finansal gücü değerlendirilir. Ek olarak varsa mülk ve birikimleriniz de desteklik belge olarak sunulabilir.' },
          { q: 'Eşim ve ben birlikte başvuruyoruz, ayrı mı ortak mı?', a: 'Her ikiniz de ayrı başvuru formu doldurursunuz, ancak aile başvurusu olarak birlikte sunulur. Mali belgeler her iki için de aynı dosyada yer alabilir. Randevu alırken "aile başvurusu" seçilir.' },
          { q: 'Kronik hastalığım var, seyahat sigortası kapsar mı?', a: 'Standart poliçeler kronik hastalıkları kapsamaz. "Kronik hastalık alerjisi" veya "önceden var olan durum" kapsamı olan özel poliçelere ihtiyacınız olur. Bu poliçeler daha pahalıdır ancak reddedilme riskinizi azaltır.' },
          { q: 'Emekli olduktan hemen sonra başvurabilir miyim?', a: 'Evet, ancak emeklilikten en az 3-6 ay geçmesi, emekli maaşınızın banka hesabına düzenli yatmaya başlaması tavsiye edilir. Yeni emeklilik, düzensiz finansal görüntü oluşturabilir.' },
          { q: 'Torunumu ziyarete Almanya\'ya gideceğim, ne yapmalıyım?', a: 'Davet mektubu (Einladung/Verpflichtungserklärung) gerekir. Almanya\'daki torununuzun ikamet ettiği yerin Ausländerbehörde\'sinden alınır. Bu belge, finansal sorumluluğu üstlendiği anlamına gelir ve başvurunuzu güçlendirir.' },
        ].map(({ q, a }) => (
          <div key={q} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="font-semibold text-slate-800 text-sm mb-1 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" /> {q}
            </p>
            <p className="text-slate-600 text-sm leading-relaxed pl-6">{a}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-brand-50 border border-brand-200 rounded-2xl p-6 flex gap-3">
        <ShieldCheck className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-brand-900 mb-2">Özet</h3>
          <p className="text-brand-800 text-sm leading-relaxed">
            Emekli olmak vize başvurusunda bir engel değil, bir güç kaynağıdır. Emekli maaş
            belgesi, tapu, torunlar ve düzenli maaş dörtlüsüyle %90+ onay oranı mümkündür.
            İtalya, Yunanistan ve İspanya emekliler için en rahat Schengen seçenekleridir.
            Düşük maaş durumlarında çocuk veya eş sponsorluğuyla başvuru güçlendirilebilir.
          </p>
        </div>
      </div>
    </BlogPostLayout>
  );
}
