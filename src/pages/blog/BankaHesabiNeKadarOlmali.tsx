import React from 'react';
import { AlertTriangle, CheckCircle2, Info, Wallet, TrendingUp } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'vize-icin-banka-hesabi-ne-kadar-olmali',
  title: 'Vize İçin Bankada Ne Kadar Para Olmalı? 2026 Ülke Bazlı Liste',
  description: 'Schengen, ABD, İngiltere, Kanada vizesi için gereken banka bakiyesi ne kadar? Hesap dökümü nasıl olmalı, kaç aylık, hangi format? 2026 ülke bazlı rehber.',
  category: 'İpucu',
  readingTime: 10,
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
          name: 'Vize için banka hesabımda 50.000 TL yeterli mi?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Hedef ülkeye göre değişir. Yunanistan veya İtalya için 7-10 günlük kısa bir seyahatte yeterli olabilir. Ancak Almanya, Fransa, İngiltere gibi daha pahalı ülkelerde en az 80.000-120.000 TL arası bir bakiye önerilir.',
          },
        },
        {
          '@type': 'Question',
          name: 'Başka birinin hesabından gelen para vizeyi etkiler mi?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Evet, büyük tutarlı ani transferler sorgulanır. Bu transferler ailenizden geliyorsa, sponsor dilekçesi ile belgelendirmeniz gerekir. Açıklanamayan para girişleri başvurunuzu riske atar.',
          },
        },
        {
          '@type': 'Question',
          name: 'Vadeli hesap veya döviz hesabı kabul edilir mi?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Evet. Vadeli TL, Euro, Dolar hesapları kabul edilir. Hatta döviz hesabı genellikle daha güçlü bir sinyaldir. Altın hesabı ve yatırım fonları da ek belge olarak sunulabilir.',
          },
        },
        {
          '@type': 'Question',
          name: 'Banka hesabımda hiç param yok ama eşim karşılayacak, vize alabilir miyim?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Evet, eş sponsorluğu ile başvurabilirsiniz. Eşinizin finansal gücü yeterliyse, noter onaylı sponsor dilekçesi ve eşin banka dökümleriyle başvuru başarılı olabilir.',
          },
        },
        {
          '@type': 'Question',
          name: 'Hesaptaki para Türk Lirası mı olmalı, yabancı para mı?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Her ikisi de kabul edilir. Ancak son dönemde TL\'nin değer kaybı nedeniyle döviz hesabı (Euro, Dolar, Sterlin) bulundurmak konsolosluk gözünde daha güçlü bir finansal profil oluşturur.',
          },
        },
        {
          '@type': 'Question',
          name: 'Son 3 ayda hesabım çok hareketliyse bu olumsuz mu?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Hayır, aksine olumludur. Sürekli para giriş-çıkışı olan, maaş yatan, faturalar ödenen hareketli bir hesap, doğal ve gerçek bir ekonomik hayat olduğunu gösterir. Durgun hesaplar daha şüphelidir.',
          },
        },
      ],
    },
  ],
};

const SCHENGEN_TABLOSU = [
  { ulke: 'Almanya',    gunluk: '45-65 €',   toplam10: '~85.000-100.000 TL' },
  { ulke: 'Fransa',     gunluk: '65-100 €',  toplam10: '~110.000-140.000 TL' },
  { ulke: 'İtalya',     gunluk: '40-50 €',   toplam10: '~75.000-90.000 TL' },
  { ulke: 'İspanya',    gunluk: '70-90 €',   toplam10: '~95.000-115.000 TL' },
  { ulke: 'Hollanda',   gunluk: '50-70 €',   toplam10: '~90.000-110.000 TL' },
  { ulke: 'Yunanistan', gunluk: '30-50 €',   toplam10: '~55.000-75.000 TL' },
  { ulke: 'Belçika',    gunluk: '95-120 €',  toplam10: '~130.000-160.000 TL' },
  { ulke: 'Avusturya',  gunluk: '60-80 €',   toplam10: '~95.000-120.000 TL' },
  { ulke: 'İsviçre',    gunluk: '100-150 €', toplam10: '~160.000-210.000 TL' },
  { ulke: 'Portekiz',   gunluk: '40-60 €',   toplam10: '~70.000-90.000 TL' },
];

export default function BankaHesabiNeKadarOlmali() {
  return (
    <BlogPostLayout post={POST} schema={SCHEMA}>
      <p className="text-slate-700 leading-relaxed text-base mb-6">
        Vize başvurusunda en çok kafa karıştıran sorulardan biri şudur: <strong>"Banka hesabımda ne kadar
        para olmalı ki vizem onaylansın?"</strong> İnternette dolaşan rakamlar birbirinden çok farklı, forum
        yorumları çelişkili, danışmanların her biri farklı tutarlar söylüyor. Bu rehberde, ülke ülke
        gerçekçi rakamları, hesap dökümünün nasıl hazırlanması gerektiğini ve en çok yapılan
        hataları net şekilde anlatıyoruz.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Banka Hesabı Vize Başvurusunda Neden Bu Kadar Önemli?</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Konsolosluklar vize başvurunuzu incelerken tek bir soruya cevap arar: <em>"Bu kişi ülkesine geri
        dönecek mi, yoksa bizim ülkemizde kalmaya mı çalışacak?"</em> Banka hesabınız bu sorunun en
        önemli cevaplarından birini oluşturur. Yeterli maddi imkana sahip bir başvurucunun yasadışı
        yollarla çalışmak için ülkede kalma olasılığı düşüktür — çünkü kendi ülkesinde zaten iyi bir
        yaşam standardı vardır.
      </p>
      <p className="text-slate-700 leading-relaxed mb-6">
        Ancak banka bakiyesi tek başına yeterli değildir. Konsoloslar özellikle şu üç şeye bakar:
      </p>
      <div className="grid sm:grid-cols-3 gap-3 mb-8">
        {[
          { n: '1', b: 'Hesabın geçmişi', d: 'Son 3-6 ayda hesabın nasıl hareket ettiği' },
          { n: '2', b: 'Düzenli gelir girişi', d: 'Maaş ya da işletme geliri gibi sürekli bir kaynak' },
          { n: '3', b: 'Bakiyenin doğallığı', d: 'Başvurudan önce aniden büyük para yatırılmaması' },
        ].map(({ n, b, d }) => (
          <div key={n} className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm">
            <span className="inline-flex w-6 h-6 bg-brand-600 text-white rounded-full items-center justify-center font-bold text-xs mb-2">{n}</span>
            <p className="font-semibold text-slate-800 mb-1">{b}</p>
            <p className="text-slate-600 leading-relaxed">{d}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Genel Kural: Günlük Harcama × Kalış Süresi</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Çoğu konsolosluğun kabul ettiği temel formül şudur: <strong>Seyahat edeceğiniz ülkenin günlük
        yaşam maliyeti × planlanan kalış süreniz</strong> kadar paranın hesabınızda görünmesi gerekir.
        Buna ek olarak <strong>acil durum fonu</strong> olarak bu tutarın en az 1,5 katına sahip olmanız
        beklenir.
      </p>
      <div className="bg-brand-50 border border-brand-200 rounded-xl p-5 mb-8 flex gap-3">
        <Wallet className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
        <p className="text-brand-900 text-sm leading-relaxed">
          <strong>Örnek:</strong> 10 gün Almanya'ya gidecekseniz, günlük ortalama 60-80 Avro × 10 gün
          = 600-800 Avro seyahat bütçeniz olmalı. Banka hesabınızda ise en az <strong>1.500-2.000 Avro</strong> karşılığı
          TL görünmesi tavsiye edilir (15 gün × 75 Avro × 1,5 güvenlik katsayısı).
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Schengen Ülkeleri İçin Gereken Banka Bakiyesi</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Schengen ülkeleri için resmi olarak belirlenmiş tek bir rakam yoktur; her ülke kendi günlük
        yaşam maliyetini baz alır. Aşağıdaki tablo, 2026 yılı için ülke bazlı tavsiye edilen minimum
        banka bakiyesini gösterir (<strong>10 günlük seyahat varsayımıyla</strong>):
      </p>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border border-slate-200 rounded-xl overflow-hidden">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-slate-700">Ülke</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-700">Günlük Tavsiye (€)</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-700">10 Gün Minimum Bakiye</th>
            </tr>
          </thead>
          <tbody>
            {SCHENGEN_TABLOSU.map(({ ulke, gunluk, toplam10 }, i) => (
              <tr key={ulke} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                <td className="px-4 py-2.5 font-semibold text-slate-800">{ulke}</td>
                <td className="px-4 py-2.5 text-slate-700">{gunluk}</td>
                <td className="px-4 py-2.5 text-slate-700">{toplam10}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-slate-600 text-sm italic mb-8">
        Bu rakamlar minimum tavsiyedir. Aile başvurularında her birey için ayrı bakiye gerekmez;
        toplam aile bakiyesi yeterlidir. Ancak ana başvurucunun hesabında daha yüksek tutar
        görünmesi avantajlıdır.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">ABD Vizesi İçin Banka Hesabı Gereksinimleri</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        ABD vizesi (B1/B2) başvurusunda, resmi bir minimum bakiye rakamı açıkça belirtilmez. Ancak
        konsolosluk mülakat memurları, başvurucunun seyahat boyunca kendini finanse
        edebileceğine ikna olmak ister. Pratikte, <strong>bir haftalık ABD seyahati için yaklaşık 4.000-5.000
        USD</strong> (yaklaşık 170.000-215.000 TL) civarında bir bakiye önerilir.
      </p>
      <p className="text-slate-700 leading-relaxed mb-8">
        ABD için daha önemli olan hususlar şunlardır: düzenli maaş girişi, Türkiye'deki güçlü bağlar
        (iş, aile, mülk), önceki seyahat geçmişi ve seyahat amacının netliği. Büyük bir banka bakiyesi,
        zayıf bağları olan bir başvurucuyu kurtarmaz; ancak yeterli bakiyenin olmaması güçlü bir profili
        bile riske atar.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">İngiltere Vizesi Banka Hesabı Şartları</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        İngiltere vizesi için "yeterli fon" kuralı geçerlidir. Standart Ziyaretçi Vizesi başvurusunda,
        seyahat süresi boyunca kendinizi finanse edebileceğinizi kanıtlamanız gerekir. Günlük
        <strong> 80-120 £</strong> arası bir bütçe makul kabul edilir.
      </p>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 flex gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-800 text-sm mb-1">28 Gün Kuralı</p>
          <p className="text-amber-700 text-sm leading-relaxed">
            İngiltere'nin özel bir kuralı vardır: Paranın hesabınızda <strong>en az 28 gün</strong> boyunca
            kesintisiz olarak durması gerekir. Bu kural özellikle öğrenci ve iş vizelerinde katı şekilde
            uygulanır. Başvurudan 29 gün önce yatırılan büyük tutarlar başvurunuzu tehlikeye sokar.
          </p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Kanada Vizesi Banka Hesabı</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Kanada Geçici Oturum Vizesi (TRV) başvurusunda, seyahat bütçesinin yanı sıra Türkiye'ye
        dönüş garantisi olarak da banka bakiyesi incelenir. İki haftalık bir Kanada ziyareti için
        <strong> 8.000-10.000 CAD</strong> (yaklaşık 250.000-310.000 TL) civarı bir bakiye tavsiye edilir.
      </p>
      <p className="text-slate-700 leading-relaxed mb-8">
        Kanada başvurularında dikkat çeken nokta: Başvurucunun ailesinden destek aldığı
        durumlarda, aile üyesinin hesap dökümü ve "taahhüt mektubu" da kabul edilir. Öğrenci
        vizelerinde ise <strong>GIC (Guaranteed Investment Certificate)</strong> sistemi üzerinden
        <strong> 20.635 CAD (2026)</strong> yatırmak zorunludur.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Banka Hesap Dökümü Nasıl Olmalı?</h2>
      <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">Süre: Kaç Aylık Döküm Gerekir?</h3>
      <p className="text-slate-700 leading-relaxed mb-6">
        Çoğu konsolosluk son <strong>3-6 aylık</strong> banka hesap dökümü ister. Schengen ülkeleri
        genellikle 3 ay kabul eder, ABD ve İngiltere 6 ay tercih eder, Kanada bazı durumlarda 4 ay
        ister. Güvenli seçim: her zaman son 6 aylık döküm hazırlayın.
      </p>

      <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">Format: Hangi Döküman Kabul Edilir?</h3>
      <ul className="space-y-2 mb-6">
        {[
          'Bankadan alınan, ıslak imzalı ve kaşeli resmi hesap hareketleri',
          'İnternet bankacılığından alınan PDF dökümanlar (çoğu konsolosluk artık kabul ediyor)',
          'İngilizce hesap bakiye mektubu (Schengen ve İngiltere için çok tavsiye edilir)',
          'Son 3 aya ait maaş dekontları (düzenli gelir kanıtı olarak)',
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>

      <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">Kredi Kartı Ekstresi Geçerli mi?</h3>
      <p className="text-slate-700 leading-relaxed mb-8">
        Kredi kartı ekstresi, banka hesap dökümünün yerini tutmaz. Konsolosluklar kredi kartı limitinizi
        gerçek paranız olarak değerlendirmez. Ancak ekstresi ek belge olarak sunulabilir — özellikle
        seyahat geçmişinizi gösterme konusunda destekleyici kanıt niteliğindedir.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Sık Yapılan Hatalar ve Kaçınılması Gerekenler</h2>
      <div className="space-y-3 mb-8">
        {[
          { n: '1', b: 'Başvurudan 1-2 hafta önce hesaba büyük miktar para yatırmak', d: 'Bu, konsolosluk tarafından anında fark edilir ve başvurunuzu tehlikeye atar. En az 3-4 ay önceden hesabınıza düzenli olarak para girişi olmalıdır.' },
          { n: '2', b: 'Hesapta sadece beklenen bakiyeyi tutmak', d: 'Eğer 100.000 TL tavsiye edilirse tam 100.000 TL değil, 150.000-180.000 TL bulundurmak daha ikna edici olur. Sınırda bakiye, "zorlanarak toplanmış para" izlenimi verir.' },
          { n: '3', b: 'Döküman formatı hataları', d: 'Logo olmayan, imzasız, tarihsiz dökümler reddedilir. Her zaman bankanın resmi antetli kağıdında, ıslak imzalı dökümanlar alın.' },
          { n: '4', b: 'Sadece maaş girişine güvenmek', d: 'Maaşınız yüksek olsa bile, her ay tüm maaşınızı çekiyorsanız ve hesapta bakiye tutmuyorsanız bu olumsuz bir sinyaldir. "Birikim yapabilen kişi" imajı vermelisiniz.' },
          { n: '5', b: 'Başka birinin hesabından para transfer etmek', d: 'Başvurudan önce hesabınıza yapılan büyük havaleler (aileden bile olsa) sorgulanabilir. Bunun için noter onaylı sponsor dilekçesi hazırlamanız gerekir.' },
        ].map(({ n, b, d }) => (
          <div key={n} className="flex gap-3 text-sm bg-red-50/40 border border-red-100 rounded-xl p-4">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800 mb-1">{n}. {b}</p>
              <p className="text-slate-600 leading-relaxed">{d}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Sponsorlu Başvurularda Mali Belgeler</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Ev hanımları, öğrenciler, işsiz kişiler veya yeterli bakiyesi olmayanlar sponsor üzerinden
        başvurabilir. Sponsor; eş, ebeveyn, kardeş veya Türkiye'deki birinci derece akraba olabilir.
        Sponsor başvurusunda şu belgeler istenir:
      </p>
      <ul className="space-y-2 mb-8">
        {[
          'Noter onaylı sponsor taahhüdü (masrafları karşılayacağını belirten)',
          'Sponsorun son 3-6 aylık banka hesap dökümü',
          'Sponsorun çalışma belgesi ve maaş bordroları',
          'Akrabalık bağını gösteren belgeler (vukuatlı nüfus kayıt örneği)',
          'Sponsorun pasaport fotokopisi ve kimlik bilgileri',
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Sık Sorulan Sorular (SSS)</h2>
      <div className="space-y-4 mb-8">
        {[
          { q: 'Vize için banka hesabımda 50.000 TL yeterli mi?', a: 'Hedef ülkeye göre değişir. Yunanistan veya İtalya için 7-10 günlük kısa bir seyahatte yeterli olabilir. Ancak Almanya, Fransa, İngiltere gibi daha pahalı ülkelerde en az 80.000-120.000 TL arası bir bakiye önerilir.' },
          { q: 'Başka birinin hesabından gelen para vizeyi etkiler mi?', a: 'Evet, büyük tutarlı ani transferler sorgulanır. Bu transferler ailenizden geliyorsa, sponsor dilekçesi ile belgelendirmeniz gerekir. Açıklanamayan para girişleri başvurunuzu riske atar.' },
          { q: 'Vadeli hesap veya döviz hesabı kabul edilir mi?', a: 'Evet. Vadeli TL, Euro, Dolar hesapları kabul edilir. Hatta döviz hesabı genellikle daha güçlü bir sinyaldir. Altın hesabı ve yatırım fonları da ek belge olarak sunulabilir.' },
          { q: 'Banka hesabımda hiç param yok ama eşim karşılayacak, vize alabilir miyim?', a: 'Evet, eş sponsorluğu ile başvurabilirsiniz. Eşinizin finansal gücü yeterliyse, noter onaylı sponsor dilekçesi ve eşin banka dökümleriyle başvuru başarılı olabilir.' },
          { q: 'Hesaptaki para Türk Lirası mı olmalı, yabancı para mı?', a: 'Her ikisi de kabul edilir. Ancak son dönemde TL\'nin değer kaybı nedeniyle döviz hesabı (Euro, Dolar, Sterlin) bulundurmak konsolosluk gözünde daha güçlü bir finansal profil oluşturur.' },
          { q: 'Son 3 ayda hesabım çok hareketliyse bu olumsuz mu?', a: 'Hayır, aksine olumludur. Sürekli para giriş-çıkışı olan, maaş yatan, faturalar ödenen hareketli bir hesap, doğal ve gerçek bir ekonomik hayat olduğunu gösterir. Durgun hesaplar daha şüphelidir.' },
        ].map(({ q, a }) => (
          <div key={q} className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="font-semibold text-slate-800 text-sm mb-2">{q}</p>
            <p className="text-slate-600 text-sm leading-relaxed">{a}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-brand-50 border border-brand-200 rounded-2xl p-6 flex gap-3">
        <TrendingUp className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-brand-900 mb-2">Özet: Para Miktarı Değil, Para Hikayesi</p>
          <p className="text-brand-800 text-sm leading-relaxed">
            Hesabınızdaki para bir rakam değil, konsolosluğa anlattığınız bir hikayedir.
            Planlamaya başvurudan 3-6 ay önce başlayın, düzenli gelir akışı gösterin ve
            büyük hareketleri açıklayabilecek belgeleri hazırda tutun.
          </p>
        </div>
      </div>
    </BlogPostLayout>
  );
}
