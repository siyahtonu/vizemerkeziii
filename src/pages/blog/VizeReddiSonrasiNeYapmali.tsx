import React from 'react';
import { AlertTriangle, CheckCircle2, Info, Scale, FileText, XCircle } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'vize-reddi-sonrasi-ne-yapmali-itiraz-rehberi',
  title: 'Vize Reddi Sonrası Ne Yapmalı? İtiraz ve Yeniden Başvuru 2026',
  description: 'Schengen, ABD, İngiltere vize reddi aldınız mı? İtiraz mı, yeniden başvuru mu daha iyi? Adım adım çözüm rehberi ve başarı stratejileri.',
  category: 'Genel',
  readingTime: 11,
  date: '2026-04-17',
  tags: ['vize reddi', 'itiraz', 'yeniden başvuru', 'ret kodları'],
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
      '@type': 'HowTo',
      name: 'Vize reddi sonrası ne yapmalı',
      step: [
        { '@type': 'HowToStep', name: 'Red sebebini tam anla', text: 'Ret mektubundaki maddeyi ve gerekçeyi net şekilde çöz.' },
        { '@type': 'HowToStep', name: 'Red sebebini hedef alan belgeler hazırla', text: 'Ret "geri dönüş şüphesi" ise bağ belgeleri, "finansal" ise 3-6 aylık hareketli hesap.' },
        { '@type': 'HowToStep', name: 'Hemen değil zamanında başvur', text: 'En az 1-3 ay bekle, profilini güçlendir.' },
        { '@type': 'HowToStep', name: 'Doğru ülkeyi seç', text: 'Planlanan ilk seyahat ülkesine başvur, taktiksel ülke değişikliği yapma.' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Vize reddi pasaporta işlenir mi?',
          acceptedAnswer: { '@type': 'Answer', text: 'Hayır, fiziksel bir "red damgası" bulunmaz. Red, konsolosluk sistemine (VIS) kayıt edilir ve tüm Schengen ülkeleri bu kaydı görebilir. Ancak pasaport üzerinde görünür bir işaret yoktur.' },
        },
        {
          '@type': 'Question',
          name: 'Vize ücreti red halinde iade edilir mi?',
          acceptedAnswer: { '@type': 'Answer', text: 'Hayır. Konsolosluk harçları (Schengen 90 €, VFS hizmet bedeli 25-40 €) her durumda tahsil edilir. Red halinde iade söz konusu değildir.' },
        },
        {
          '@type': 'Question',
          name: 'Ret aldıktan sonra ne kadar beklemeliyim?',
          acceptedAnswer: { '@type': 'Answer', text: 'Minimum 1-3 ay. Bu sürede eksiklerinizi gidermelisiniz. Hemen yapılan başvurular "aynı durumda ısrarcı kişi" algısı yaratır ve tekrar reddedilir.' },
        },
        {
          '@type': 'Question',
          name: 'Ret aldıktan sonra kaç defa tekrar başvurabilirim?',
          acceptedAnswer: { '@type': 'Answer', text: 'Başvuru sayısında yasal bir sınır yoktur. Ancak her red "tekrarlayan red geçmişi" olarak kaydedilir. 3\'ten fazla ret, ciddi bir kırmızı bayrak oluşturur.' },
        },
        {
          '@type': 'Question',
          name: 'Danışmanlık firması ile başvurmak ret ihtimalini azaltır mı?',
          acceptedAnswer: { '@type': 'Answer', text: 'Danışman direkt "onay garantisi" vermez. Ancak deneyimli bir danışman evraklarınızı doğru hazırlar, red sebeplerini öngörür ve ikinci başvuru için strateji oluşturur.' },
        },
        {
          '@type': 'Question',
          name: 'Red sonrası yeni pasaport alsam red kaydı silinir mi?',
          acceptedAnswer: { '@type': 'Answer', text: 'Hayır. Red kaydı sistemde kişi bazlı tutulur, pasaport numarasına bağlı değildir. Yeni pasaportta ret kaydı görünmese bile, konsolosluk sizi kimlik bilgilerinizden tespit eder.' },
        },
      ],
    },
  ],
};

const RET_KODLARI = [
  { k: 'Madde 3', a: 'Sahte belge şüphesi', c: 'Belge gerçekliği sorgulandı' },
  { k: 'Madde 6', a: 'Seyahat amacı ve koşullar yetersiz', c: 'Otel, uçak, niyet açık değil' },
  { k: 'Madde 7', a: 'Konaklama kanıtı yetersiz', c: 'Rezervasyon iptal veya tutarsız' },
  { k: 'Madde 8', a: 'Geri dönüş şüphesi', c: 'Türkiye bağları zayıf' },
  { k: 'Madde 10', a: 'Seyahat sigortası geçersiz', c: '€30.000 teminat eksik veya yanlış' },
  { k: 'Madde 14', a: 'Ülke bağlarının yetersiz olması', c: 'İş, aile, mülk belgeleri yok' },
];

const KARAR_TABLOSU = [
  { durum: 'Sahte belge şüphesi (Madde 3)', tercih: 'İtiraz', neden: 'Haksız iddiayı çürütmek için önce itiraz.' },
  { durum: 'Eksik belge (Madde 6, 7, 10)', tercih: 'Yeniden başvuru', neden: 'Eksiği tamamlayıp yeniden başvurmak daha hızlı.' },
  { durum: 'Geri dönüş şüphesi (Madde 8, 14)', tercih: 'Yeniden başvuru', neden: 'Güçlü belgelerle tekrar denemek daha etkili.' },
  { durum: 'Finansal yetersizlik', tercih: 'Yeniden başvuru', neden: 'Daha iyi mali tablo ile tekrar başvuru.' },
  { durum: 'Keyfi / haksız ret', tercih: 'İtiraz', neden: 'Mahkeme süreci ile hakların savunulması.' },
];

export default function VizeReddiSonrasiNeYapmali() {
  return (
    <BlogPostLayout post={POST} schema={SCHEMA}>
      <p className="text-slate-700 leading-relaxed text-base mb-6">
        Vize reddi, aylarca bekleyip umutla yaptığınız başvurunun 3-4 satırlık bir mektupla
        sonlanması demek. Üzücü ama son değil. 2024 istatistiklerine göre Türkiye'den yapılan
        Schengen başvurularının <strong>%14,5'i reddediliyor</strong> — yani her yıl yaklaşık
        170.000 kişi bu durumu yaşıyor. İyi haber şu: Reddin doğru analiz edilmesi ve stratejik
        bir ikinci başvuru ile, bu kişilerin önemli bir kısmı bir sonraki denemede vize alıyor.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Red Kararını İlk Günden Dikkatle Okuyun</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Vize reddi bir felaket gibi görünür ama aslında çok değerli bir belgedir:
        <strong> Konsolosluk size neyin eksik olduğunu açıkça söyler.</strong> Red mektubunda
        (refusal letter) genellikle bir veya birkaç "madde" belirtilir. Bu maddeler kodlanmıştır
        ve her biri farklı bir eksikliği ifade eder.
      </p>
      <div className="space-y-2 mb-8 text-sm">
        {RET_KODLARI.map(({ k, a, c }) => (
          <div key={k} className="bg-white border border-slate-200 rounded-xl p-3 flex items-start gap-3">
            <span className="bg-red-100 text-red-700 font-bold text-xs px-2.5 py-1 rounded shrink-0">{k}</span>
            <div className="flex-1">
              <p className="font-semibold text-slate-800">{a}</p>
              <p className="text-slate-500 text-xs">{c}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">İtiraz mı Yoksa Yeniden Başvuru mu?</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Bu, ret sonrası en çok sorulan sorudur. İkisinin de avantajları ve dezavantajları var.
        İşte pratik karar rehberi:
      </p>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border border-slate-200 rounded-xl overflow-hidden">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left px-3 py-2 font-semibold text-slate-700">Durum</th>
              <th className="text-left px-3 py-2 font-semibold text-slate-700">Tercih</th>
              <th className="text-left px-3 py-2 font-semibold text-slate-700">Neden</th>
            </tr>
          </thead>
          <tbody>
            {KARAR_TABLOSU.map(({ durum, tercih, neden }) => (
              <tr key={durum} className="border-t border-slate-200">
                <td className="px-3 py-2 text-slate-700">{durum}</td>
                <td className="px-3 py-2">
                  <span className={`font-semibold ${tercih === 'İtiraz' ? 'text-blue-700' : 'text-emerald-700'}`}>{tercih}</span>
                </td>
                <td className="px-3 py-2 text-slate-600 text-xs">{neden}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 flex gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-amber-900 text-sm leading-relaxed">
          Genel eğilim <strong>yeniden başvuru</strong> lehinedir çünkü itiraz süreci 2-6 ay sürer
          ve başarı oranı düşüktür (%20-30). Yeniden başvuru ise doğru hazırlandığında %60-80
          başarı şansına sahiptir.
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Yeniden Başvuruda Nasıl Strateji İzlenir?</h2>
      <div className="space-y-4 mb-8">
        {[
          { t: 'Adım 1: Red Sebebini Tam Olarak Anlayın', b: 'Red mektubunu dikkatle okuyun. Her kutucuğun ne anlama geldiğini araştırın. Emin değilseniz vize danışmanına göstermek mantıklıdır. Red sebebinin net anlaşılması başarılı ikinci başvurunun %50\'sidir.' },
          { t: 'Adım 2: Red Sebebini Hedef Alan Ek Belgeler Hazırlayın', b: 'Eğer ret sebebi "geri dönüş şüphesi" ise, Türkiye\'deki bağlarınızı çok daha güçlü belgelerle kanıtlamanız gerekir: tapu belgeleri, iş sözleşmesi, çocukların okul kayıtları, SGK hizmet dökümü. Eğer ret "finansal yetersizlik" ise, banka hesabınızı 3-6 ay hareketli tutup yeni bakiyelerle başvurun.' },
          { t: 'Adım 3: Hemen Değil, Zamanında Başvurun', b: 'Red aldıktan sonra hemen yeniden başvurmayın. En az 1-3 ay bekleyin. Bu süre içinde eksiklerinizi gidermiş, profilinizi güçlendirmiş olursunuz. Hemen yapılan başvuru, "ısrarcı ama durumu aynı kişi" izlenimi verir ve genellikle yine reddedilir.' },
          { t: 'Adım 4: Aynı Ülkeye mi Yoksa Başka Ülkeye mi?', b: 'Schengen kurallarına göre, planlanan ilk seyahatin ülkesine başvurmak zorundasınız. Bu yüzden "ret aldım, başka ülkeye başvurayım" stratejisi yanlıştır. Seyahat planınız doğru hazırlanırsa, aynı ülkeye veya farklı bir ülkeye başvurabilirsiniz.' },
        ].map(({ t, b }) => (
          <div key={t} className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="font-semibold text-slate-800 mb-1 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {t}
            </p>
            <p className="text-slate-600 text-sm leading-relaxed pl-6">{b}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Vize Reddi İtiraz Süreci</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        İtiraz yolunu seçtiyseniz, süreç şu şekilde işler:
      </p>
      <ol className="space-y-2 mb-8 list-decimal list-inside text-sm text-slate-700">
        <li>Red mektubundaki itiraz süresi içinde hareket edin (genellikle 15-30 gün)</li>
        <li>Red kararına itiraz dilekçesi yazın (aşağıda örnek)</li>
        <li>Ek belgeler ve kanıtlarla destekleyin</li>
        <li>Konsolosluğa veya ülkenin yetkili mahkemesine sunun</li>
        <li>Karar süreci: 2-6 ay</li>
      </ol>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">İtiraz Dilekçesi Örneği (Şablon)</h2>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8 text-sm text-slate-700 leading-relaxed">
        <div className="flex items-start gap-2 mb-3">
          <FileText className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <p className="font-semibold text-slate-800">Sayın [Ülke] Başkonsolosluğu'na,</p>
        </div>
        <p className="mb-2">
          [Tarih]'te yapmış olduğum ve [Başvuru No] ile kayıtlı olan Schengen vize başvurum,
          [Red Sebebi Maddesi] gerekçesiyle reddedilmiştir. Bu karara aşağıdaki gerekçelerle
          itiraz etmekteyim:
        </p>
        <p className="mb-2">
          <strong>[1. Gerekçe ve Kanıt]</strong> — Red gerekçesinde belirtilen [konu] hakkında
          aşağıdaki ek belgeleri sunuyorum: [Belge listesi]
        </p>
        <p className="mb-2">
          <strong>[2. Gerekçe ve Kanıt]</strong> — [Detaylı açıklama]
        </p>
        <p className="mb-2">
          Yukarıdaki gerekçeler doğrultusunda, başvurumun yeniden değerlendirilmesini ve olumlu
          sonuçlandırılmasını saygılarımla talep ediyorum.
        </p>
        <p className="font-semibold">[Ad Soyad, İmza, Tarih]</p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Red Sonrası Yapılan En Büyük 5 Hata</h2>
      <div className="space-y-3 mb-8">
        {[
          { t: 'Panikle hemen başka ülkeye başvurmak', b: 'Aynı profil ile kısa süre sonra yapılan başvuru kesin reddedilir.' },
          { t: 'Red sebebini anlamadan yeniden başvurmak', b: 'Aynı hatayı tekrarlamak kaçınılmazdır.' },
          { t: 'Belge abartmak veya sahte belge kullanmak', b: 'Bu, sadece o vize başvurusunu değil, tüm Schengen geleceğinizi riske atar. Sahte belge tespiti 5 yıl yasak getirir.' },
          { t: 'Pasaportta "red damgası" olduğu için telaşa kapılmak', b: 'Aslında fiziksel bir "red damgası" yoktur. Ret sadece kaydınıza işlenir, pasaporta görünür bir işaret basılmaz.' },
          { t: 'Her başvuru için farklı danışmanla çalışmak', b: 'Tutarlı bir strateji yoksa, her danışman farklı yön önerir ve süreç karışır.' },
        ].map(({ t, b }, idx) => (
          <div key={t} className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
            <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900 text-sm">{idx + 1}. {t}</p>
              <p className="text-red-800 text-sm leading-relaxed">{b}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Başka Ülke Vizesini Etkiler mi?</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Evet, kısmen. Schengen red kaydı, ABD, İngiltere, Kanada gibi ülkelerin dikkatini çeker.
        Bu ülkelerin başvuru formlarında "Daha önce herhangi bir ülke vize reddi aldınız mı?"
        sorusu vardır. Bunu "evet" işaretlemeniz ve ret sebebini açıklamanız gerekir.
        <strong> Dürüstlük önemlidir</strong> — yalan beyan tespit edilirse yasak gelir.
      </p>
      <p className="text-slate-700 leading-relaxed mb-8">
        Ancak Schengen reddi ABD vizesini otomatik olarak olumsuz etkilemez. ABD'nin kendi
        değerlendirme kriterleri vardır ve güçlü bir ABD başvurusu, Schengen reddine rağmen
        onaylanabilir.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Sık Sorulan Sorular (SSS)</h2>
      <div className="space-y-4 mb-8">
        {[
          { q: 'Vize reddi pasaporta işlenir mi?', a: 'Hayır, fiziksel bir "red damgası" bulunmaz. Red, konsolosluk sistemine (VIS) kayıt edilir ve tüm Schengen ülkeleri bu kaydı görebilir. Ancak pasaport üzerinde görünür bir işaret yoktur.' },
          { q: 'Vize ücreti red halinde iade edilir mi?', a: 'Hayır. Konsolosluk harçları (Schengen 90 €, VFS hizmet bedeli 25-40 €) her durumda tahsil edilir. Red halinde iade söz konusu değildir. Bu, başvurunun işlem ücretidir, onay garantisi değildir.' },
          { q: 'Ret aldıktan sonra ne kadar beklemeliyim?', a: 'Minimum 1-3 ay. Bu sürede eksiklerinizi gidermelisiniz. Hemen yapılan başvurular "aynı durumda ısrarcı kişi" algısı yaratır ve tekrar reddedilir.' },
          { q: 'Ret aldıktan sonra kaç defa tekrar başvurabilirim?', a: 'Başvuru sayısında yasal bir sınır yoktur. Ancak her red "tekrarlayan red geçmişi" olarak kaydedilir. 3\'ten fazla ret, ciddi bir kırmızı bayrak oluşturur.' },
          { q: 'Danışmanlık firması ile başvurmak ret ihtimalini azaltır mı?', a: 'Danışman direkt "onay garantisi" vermez — hiçbir firma bunu yasal olarak yapamaz. Ancak deneyimli bir danışman evraklarınızı doğru hazırlar, red sebeplerini öngörür ve ikinci başvuru için strateji oluşturur. Bu, başarı şansını artırır.' },
          { q: 'Red sonrası yeni pasaport alsam red kaydı silinir mi?', a: 'Hayır. Red kaydı sistemde kişi bazlı tutulur, pasaport numarasına bağlı değildir. Yeni pasaportta ret kaydı görünmese bile, konsolosluk sizi kimlik bilgilerinizden tespit eder.' },
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
        <Scale className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-brand-900 mb-2">Özet</h3>
          <p className="text-brand-800 text-sm leading-relaxed">
            Vize reddi, son değil başlangıçtır. Ret mektubunu doğru okuyun, itiraz ve yeniden
            başvuru arasında doğru seçimi yapın, en az 1-3 ay bekleyerek eksiklerinizi giderin,
            sonra güçlü bir dosya ile geri dönün. Yeniden başvuru doğru hazırlandığında %60-80
            başarı oranına sahiptir — sabır ve strateji kapıları açar.
          </p>
        </div>
      </div>
    </BlogPostLayout>
  );
}
