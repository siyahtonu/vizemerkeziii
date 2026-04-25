import React from 'react';
import { CheckCircle2, Heart, Info, ShieldCheck, AlertTriangle, Sparkles } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'ev-hanimlari-icin-schengen-vizesi',
  title: 'Ev Hanımları İçin Schengen Vizesi Nasıl Alınır? 2026 Rehber',
  description: 'Çalışmayan ev hanımları Schengen vizesini nasıl alabilir? Gerekli belgeler, sponsor dilekçesi örneği, en kolay ülkeler ve red riskini azaltma ipuçları.',
  category: 'Schengen',
  readingTime: 11,
  date: '2026-04-17',
  tags: ['ev hanımı', 'Schengen vizesi', 'sponsor', 'çalışmayan'],
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
        {
          '@type': 'Question',
          name: 'Eşim çalışıyor ama ben çalışmıyorum, vize alabilir miyim?',
          acceptedAnswer: { '@type': 'Answer', text: 'Evet. Eşinizin maaş ve finansal belgeleri sizin için de yeterlidir. Noter onaylı sponsor dilekçesi ile başvurabilirsiniz.' },
        },
        {
          '@type': 'Question',
          name: 'Ben hiç çalışmadım, hayatımda gelir belgem yok, vize çıkar mı?',
          acceptedAnswer: { '@type': 'Answer', text: 'Evet, çıkabilir. Ancak eşinizin veya ebeveynlerinizin güçlü finansal belgeleri, aile bağlarınız ve Türkiye\'de oturduğunuzu gösteren belgeler (ev tapusu, nüfus kaydı) güçlü şekilde sunulmalıdır.' },
        },
        {
          '@type': 'Question',
          name: 'Kendi banka hesabımda hiç para olmasa olur mu?',
          acceptedAnswer: { '@type': 'Answer', text: 'Tavsiye edilmez. Sembolik de olsa kendi adınıza açık bir hesabınızın olması iyidir (20-30 bin TL civarı). Tamamen boş bir kişisel hesap, konsolosluk gözünde olumsuz sinyaldir.' },
        },
        {
          '@type': 'Question',
          name: 'Eşimden boşanmış bir ev hanımıyım, sponsor kim olabilir?',
          acceptedAnswer: { '@type': 'Answer', text: 'Ebeveynleriniz (anne-baba) veya 18 yaş üstü çocuğunuz sponsor olabilir. Kardeşler de sponsor olabilir ancak birinci derece akrabalar kadar güçlü değildir.' },
        },
        {
          '@type': 'Question',
          name: 'Tek başıma seyahat etmek istiyorum, riskli mi?',
          acceptedAnswer: { '@type': 'Answer', text: 'Riskli değil. "Yalnız seyahat eden ev hanımı" profili artık yaygın kabul görüyor. Önemli olan Türkiye\'deki bağlarınızın güçlü olması ve dönüş motivasyonunuzun inandırıcı olmasıdır.' },
        },
        {
          '@type': 'Question',
          name: 'Schengen vize başvurusu için randevu bulamıyorum, ne yapmalıyım?',
          acceptedAnswer: { '@type': 'Answer', text: 'VFS Global\'in alternatif saatlerini (sabah 08:00-09:00 arası) düzenli kontrol edin, başka şehirlerdeki konsolosluk randevularını değerlendirin. Premium randevu hizmetleri de mevcuttur.' },
        },
      ],
    },
  ],
};

const KOLAY_ULKELER = [
  { ulke: 'İtalya', onay: '%92+', not: 'En yüksek onay oranı, ev hanımlarına yumuşak yaklaşım.' },
  { ulke: 'Fransa', onay: '%89', not: '3 gün içinde sonuçlanma, hızlı süreç.' },
  { ulke: 'İspanya', onay: '%88', not: 'Turizm amaçlı başvurularda esnek.' },
  { ulke: 'Yunanistan', onay: '%86', not: 'Komşu ülke avantajı, kolay randevu.' },
  { ulke: 'Portekiz', onay: '%85', not: 'Az bilinen ama kolay ülke.' },
];

export default function EvHanimlariSchengenVizesi() {
  return (
    <BlogPostLayout post={POST} schema={SCHEMA}>
      <p className="text-slate-700 leading-relaxed text-base mb-6">
        "Çalışmıyorum, vize alamam" — bu, binlerce ev hanımının yanlışlıkla inandığı ve seyahat
        hayallerini ertelediği en büyük mit. Oysa çalışmayan ev hanımları da, doğru belgelerle ve
        doğru bir stratejiyle Schengen vizesini alabilir. Hatta çalışan biriyle aynı başarı oranına
        sahip olmaları mümkün. Bu rehber, ev hanımlarının en çok takıldığı noktaları adım adım çözüyor.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Çalışmayan Kişiler Schengen Vizesi Alabilir mi?</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        <strong>Kısa cevap: Evet.</strong> Schengen vize politikalarında "çalışıyor olma"
        zorunluluğu yoktur. Konsolosluğun aradığı asıl şey, başvurucunun Schengen bölgesinde
        izinsiz kalma riski oluşturmamasıdır. Bu risk, çalışma geliriyle değil, başvurucunun
        ülkesindeki güçlü bağlarıyla ölçülür.
      </p>
      <div className="bg-brand-50 border border-brand-200 rounded-xl p-5 mb-8 flex gap-3">
        <Heart className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
        <p className="text-brand-900 text-sm leading-relaxed">
          Ev hanımları için güçlü bağlar şunlardır: <strong>evlilik bağı, çocukların Türkiye'de
          okula gitmesi, mülk sahipliği, aile yapısı ve eşin istikrarlı işi.</strong> Tüm bu
          faktörler, sizin Türkiye'ye dönmek için güçlü nedenleriniz olduğunu kanıtlar.
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Ev Hanımları İçin Gerekli Özel Belgeler</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Ev hanımlarının başvurusu, çalışan bir bireyin başvurusundan farklı belgeler içerir.
        Standart belgelerin (pasaport, fotoğraf, vize formu, seyahat sigortası, uçak rezervasyonu,
        otel rezervasyonu) yanı sıra şu özel belgeleri hazırlamanız gerekir:
      </p>

      <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">1. Eş Sponsor Dilekçesi (En Kritik Belge)</h3>
      <p className="text-slate-700 leading-relaxed mb-3">
        Eşinizin sizin seyahat masraflarınızı karşılayacağını noter onaylı bir dilekçeyle beyan
        etmesi gerekir. Bu dilekçe İngilizce veya seyahat edeceğiniz ülkenin diline çevrilmiş
        olmalıdır. Dilekçede şunlar yer almalıdır:
      </p>
      <ul className="space-y-2 mb-6">
        {[
          'Eşin tam adı, kimlik numarası, adres bilgileri',
          'Başvurucuyla akrabalık bağı (evlilik)',
          'Seyahat tarihleri ve süresi',
          'Tüm masrafları karşılama taahhüdü (konaklama, yol, günlük harcama, sağlık)',
          'Ev hanımının Türkiye\'ye döneceğine dair garanti',
          'Noter onayı ve ıslak imza',
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>

      <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">2. Eşin Finansal Belgeleri</h3>
      <ul className="space-y-2 mb-6">
        {[
          'Eşin son 6 aylık banka hesap dökümü',
          'Eşin çalıştığı yerden alınmış antetli imzalı görev belgesi',
          'Eşin son 3 aylık maaş bordroları',
          'Eşin vergi levhası (şirket sahibiyse)',
          'SGK hizmet dökümü (eşin çalıştığının kanıtı)',
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>

      <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">3. Aile ve Statü Belgeleri</h3>
      <ul className="space-y-2 mb-8">
        {[
          'Evlilik cüzdanı fotokopisi',
          'Vukuatlı nüfus kayıt örneği (son 3 ay içinde alınmış)',
          'Tapu fotokopisi (ev, arsa, araç varsa)',
          'Çocuğunuzun okul yazısı (çocuğunuz varsa — Türkiye\'deki okul kaydını gösterir)',
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">En Kolay Vize Veren Ülkeler (Ev Hanımları İçin)</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Tüm Schengen ülkeleri teorik olarak aynı kuralları uygular; ancak pratikte bazı
        konsoloslukların ev hanımlarına yaklaşımı daha esnek olabilir. 2024 istatistiklerine göre
        Türk vatandaşları için en yüksek onay oranına sahip konsolosluklar şunlardır:
      </p>
      <div className="space-y-3 mb-6">
        {KOLAY_ULKELER.map(({ ulke, onay, not }) => (
          <div key={ulke} className="bg-white border border-slate-200 rounded-xl p-4 text-sm">
            <div className="flex justify-between items-center mb-1">
              <p className="font-semibold text-slate-800">{ulke}</p>
              <span className="text-emerald-700 font-bold">{onay}</span>
            </div>
            <p className="text-slate-500 text-xs italic">{not}</p>
          </div>
        ))}
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-amber-900 text-sm leading-relaxed">
          <strong>Not:</strong> "En kolay veren ülke" yaklaşımı riskli olabilir. Konsolosluk,
          planlanan ilk seyahatin hangi ülkede olacağını sorar. Eğer seyahat planınız başka bir
          ülkeyi içeriyorsa, o ülkenin konsolosluğuna başvurmanız gerekir. Aksi takdirde "yanlış
          konsolosluğa başvuru" gerekçesiyle reddedilebilirsiniz.
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Red Riskini Azaltmak İçin 7 Pratik İpucu</h2>
      <div className="space-y-4 mb-8">
        {[
          { title: 'Seyahat amacını net yazın', body: '"Turistik gezi" genel bir ifadedir. Bunun yerine "Roma Kolezyumu ziyareti, Vatikan turu, Floransa sanat müzeleri" gibi spesifik yerler belirtin. Bu ciddi planlama işaretidir.' },
          { title: 'Otel rezervasyonunu değiştirilebilir yapın', body: 'Booking.com\'dan iptal edilebilir rezervasyonlar alın. Başvuru sonrası iade edilmeyecek ödemeler yapmayın.' },
          { title: 'Uçak rezervasyonu yerine "opsiyonlu bilet" kullanın', body: 'Gerçek bilet almanıza gerek yok; seyahat acentesinden alacağınız rezervasyon belgesi yeterlidir.' },
          { title: 'Detaylı seyahat programı ekleyin', body: 'Gün gün nerede olacağınızı belirten bir PDF hazırlayın. Bu, "ciddi seyahat planı" sinyali verir.' },
          { title: 'Eşinizin düzenli maaş girişini kanıtlayın', body: 'Son 3 ayın banka dökümünde maaş girişleri belirgin olmalı. Düzensiz gelirli eşler için ek belgeler gerekir.' },
          { title: 'Türkiye\'deki bağları vurgulayın', body: 'Çocuğunuz varsa onun okul belgesi, ailenizle olan bağınızı gösteren nüfus kayıt örneği, evinizin veya arabanızın tapusu çok değerlidir.' },
          { title: 'İngilizce çeviriler önemli', body: 'Tüm Türkçe belgelerin (nüfus kaydı, tapu, evlilik cüzdanı) noter onaylı İngilizce çevirileri olmalıdır. Yeminli tercüman şarttır.' },
        ].map((tip, idx) => (
          <div key={tip.title} className="flex gap-3">
            <span className="shrink-0 w-7 h-7 rounded-full bg-brand-100 text-brand-700 font-bold text-xs flex items-center justify-center">{idx + 1}</span>
            <div>
              <p className="font-semibold text-slate-800 text-sm">{tip.title}</p>
              <p className="text-slate-600 text-sm leading-relaxed">{tip.body}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Başarı Hikayesi: Ayşe Hanım'ın Hikayesi</h2>
      <div className="bg-gradient-to-br from-emerald-50 to-brand-50 border border-emerald-200 rounded-xl p-5 mb-8 flex gap-3">
        <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-slate-700 text-sm leading-relaxed mb-2">
            42 yaşındaki Ayşe Hanım, iki çocuk annesi ev hanımı. İlk Schengen başvurusu "seyahat
            amacı yetersiz" gerekçesiyle reddedildi. İkinci başvurusunda şu stratejiyi uyguladı:
            eşinin son 6 aylık banka dökümünde düzenli 85.000 TL maaş girişi, oğlunun Ankara'daki
            okul kayıt belgesi, kendilerine ait 2 gayrimenkulün tapusu, İstanbul-Roma arası 10
            günlük detaylı seyahat programı. İkinci başvurusu 5 iş günü içinde onaylandı.
          </p>
          <p className="text-slate-800 text-sm leading-relaxed font-semibold">
            Bu hikayenin dersi net: Ev hanımı olmak engel değil, yanlış belge hazırlama engel.
            Doğru dosya, kapıları açar.
          </p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Sık Sorulan Sorular (SSS)</h2>
      <div className="space-y-4 mb-8">
        {[
          { q: 'Eşim çalışıyor ama ben çalışmıyorum, vize alabilir miyim?', a: 'Evet. Eşinizin maaş ve finansal belgeleri sizin için de yeterlidir. Noter onaylı sponsor dilekçesi ile başvurabilirsiniz.' },
          { q: 'Ben hiç çalışmadım, hayatımda gelir belgem yok, vize çıkar mı?', a: 'Evet, çıkabilir. Ancak eşinizin veya ebeveynlerinizin güçlü finansal belgeleri, aile bağlarınız ve Türkiye\'de oturduğunuzu gösteren belgeler (ev tapusu, nüfus kaydı) güçlü şekilde sunulmalıdır.' },
          { q: 'Kendi banka hesabımda hiç para olmasa olur mu?', a: 'Tavsiye edilmez. Sembolik de olsa kendi adınıza açık bir hesabınızın olması iyidir (20-30 bin TL civarı). Tamamen boş bir kişisel hesap, konsolosluk gözünde olumsuz sinyaldir.' },
          { q: 'Eşimden boşanmış bir ev hanımıyım, sponsor kim olabilir?', a: 'Ebeveynleriniz (anne-baba) veya 18 yaş üstü çocuğunuz sponsor olabilir. Kardeşler de sponsor olabilir ancak birinci derece akrabalar kadar güçlü değildir.' },
          { q: 'Tek başıma seyahat etmek istiyorum, riskli mi?', a: 'Riskli değil. "Yalnız seyahat eden ev hanımı" profili artık yaygın kabul görüyor. Önemli olan Türkiye\'deki bağlarınızın güçlü olması ve dönüş motivasyonunuzun inandırıcı olmasıdır.' },
          { q: 'Schengen vize başvurusu için randevu bulamıyorum, ne yapmalıyım?', a: 'Randevu krizi tüm başvurucuları etkiliyor. VFS Global\'in alternatif saatlerini (sabah 08:00-09:00 arası) düzenli kontrol edin, başka şehirlerdeki konsolosluk randevularını değerlendirin (örneğin Ankara yerine İzmir). Premium randevu hizmetleri de mevcuttur.' },
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
            Ev hanımları için Schengen vizesi bir mit değil, doğru belge setiyle gayet ulaşılabilir
            bir hedeftir. Eş sponsor dilekçesi + finansal belgeler + aile ve statü belgeleri üçlüsü
            güçlü hazırlandığında, çalışan başvurucularla aynı onay oranına ulaşmak mümkündür.
            İlk başvurunuzu İtalya, Fransa veya İspanya gibi toleranslı konsolosluklarda yapın.
          </p>
        </div>
      </div>
    </BlogPostLayout>
  );
}
