import React from 'react';
import { CheckCircle2, Info, ShieldCheck, AlertTriangle, Globe, XCircle, Sparkles } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'vize-icin-seyahat-sigortasi-nasil-secilir',
  title: 'Seyahat Sigortası Nasıl Seçilir? 2026 Schengen ve Dünya Rehberi',
  description: 'Vize için seyahat sağlık sigortası nasıl seçilir? Schengen zorunlu 30.000 €, en iyi şirketler, fiyatlar ve dikkat edilecek detaylar.',
  category: 'İpucu',
  readingTime: 9,
  date: '2026-04-17',
  tags: ['seyahat sigortası', 'sağlık sigortası', 'Schengen', 'poliçe'],
};

const SCHENGEN_KRITERLER = [
  'Minimum teminat: 30.000 € (tıbbi giderler ve acil nakil)',
  'Kapsam alanı: Tüm Schengen ülkeleri',
  'Süre: Tüm seyahat dönemini kapsamalı',
  'Acil tıbbi müdahale dahil',
  'Hastaneye nakil dahil',
  'Ölüm halinde memlekete gönderme dahil',
];

const ULKE_SIGORTA = [
  { ulke: 'Schengen', teminat: '30.000 €', kapsam: 'Tıbbi, nakil, ölüm halinde iade' },
  { ulke: 'ABD', teminat: 'Zorunlu değil ama önerilir', kapsam: '100.000 USD tavsiye' },
  { ulke: 'İngiltere', teminat: 'Zorunlu değil', kapsam: 'Seyahat sırasında tavsiye' },
  { ulke: 'Kanada', teminat: '100.000 CAD tavsiye', kapsam: 'Uzun süre kalışta gerekli' },
  { ulke: 'Rusya', teminat: '30.000 €', kapsam: 'Schengen benzeri' },
  { ulke: 'Avustralya', teminat: 'Zorunlu değil', kapsam: 'Ancak çok tavsiye edilir' },
  { ulke: 'Küba', teminat: 'Zorunlu', kapsam: 'Ülkeye girişte kontrol edilir' },
  { ulke: 'Dubai', teminat: 'Önerilir', kapsam: 'Zorunlu değildir' },
];

const DETAYLAR = [
  {
    baslik: '1. Teminat Tutarı',
    aciklama:
      'Sadece minimum 30.000 € yetmez. Bazı şirketler "toplam teminat" olarak bu rakamı gösterir, aslında farklı kalemler arasında bölünmüş olabilir. "Tıbbi giderler 30.000 €" ibaresi açıkça belirtilmiş olmalıdır.',
  },
  {
    baslik: '2. Süre',
    aciklama:
      'Poliçe süresi, seyahat tarihlerinden 1-2 gün önce başlamalı ve 1-2 gün sonra bitmelidir. Tam aynı gün başlayan poliçelerde, uçak iptali gibi durumlarda sorun yaşanabilir.',
  },
  {
    baslik: '3. Kronik Hastalık Kapsamı',
    aciklama:
      'Standart poliçeler kronik hastalıkları (kalp, diyabet, kanser gibi mevcut durumlar) kapsamaz. Bu durumlar için "Pre-existing Condition Coverage" eklenmiş poliçeler gereklidir. Bu poliçeler biraz daha pahalıdır (%20-40 daha fazla) ama hayati önem taşır.',
  },
  {
    baslik: '4. Sportif Aktiviteler',
    aciklama:
      'Tehlikeli sporlar (kayak, dağcılık, skydive, dalış, bungee jumping) standart poliçelerde kapsanmaz. Bu aktiviteleri yapacaksanız "Extreme Sports Cover" seçeneğini eklemek gerekir.',
  },
  {
    baslik: '5. COVID-19 Kapsamı',
    aciklama:
      "2026 itibarıyla çoğu poliçe COVID-19'u kapsamaya devam ediyor — hem test hem tedavi hem de izolasyon giderlerini. Ancak bazı ucuz poliçeler bu maddeyi çıkarmış olabilir. Mutlaka kontrol edin.",
  },
  {
    baslik: '6. Bagaj ve Gecikme Kapsamı',
    aciklama:
      'Poliçeler vize başvurusu için tıbbi kapsamı önemser ama seyahat pratiğinde bagaj kaybı, uçuş gecikmesi gibi ek teminatlar da değerlidir. 10-20 € ek ödeyerek kapsamlı poliçe alabilirsiniz.',
  },
  {
    baslik: '7. Yaş Limiti',
    aciklama:
      'Çoğu şirket 70+ yaş için farklı koşullar uygular. 75 yaş üstü için poliçe fiyatları 3-5 kat artabilir. Bazı şirketler 80 yaş üstüne poliçe yazmaz.',
  },
];

const SIRKETLER = [
  "Allianz Travel: Avrupa'nın en büyük sigortacılarından, Schengen standardı",
  'AXA Assistance: Uluslararası tanınırlık, güçlü kapsam',
  'AK Sigorta: Yerel güven, uygun fiyatlar, Türkçe müşteri hizmetleri',
  'Mapfre: İspanyol kökenli, Avrupa\'da yaygın kabul',
  'Türkiye Sigorta: Devlet destekli, geniş acente ağı',
  "Anadolu Sigorta: Türkiye'nin en eski ve güçlü şirketlerinden",
  "Europ Assistance: Schengen'de köklü, geniş ağ",
];

const KARSILASTIRMA_SITELERI = ['sigortam.net', 'koalay.com', 'sigortadunyasi.com', 'compareinsurance.com (global)'];

const FIYATLAR = [
  { tur: 'Schengen kısa (1 haftalık)', sure: '7 gün', fiyat: '150-400 TL' },
  { tur: 'Schengen orta (10-14 gün)', sure: '10-14 gün', fiyat: '200-600 TL' },
  { tur: 'Schengen uzun (30 gün)', sure: '30 gün', fiyat: '400-1.200 TL' },
  { tur: 'ABD seyahati (10 gün)', sure: '10 gün', fiyat: '500-1.500 TL' },
  { tur: 'Dünya turu yıllık', sure: '1 yıl', fiyat: '2.500-8.000 TL' },
  { tur: '65 yaş üstü standart', sure: '10 gün', fiyat: '500-1.500 TL' },
  { tur: 'Kronik hastalık kapsamlı', sure: '10 gün', fiyat: '800-2.500 TL' },
];

const KONTROL_LISTESI = [
  '"Schengen approved" veya "Vize başvurusu için uygundur" yazısı var mı?',
  'Tıbbi kapsam tam 30.000 € mi? Daha az değil mi?',
  "Ülke kapsamı tüm Schengen'i içeriyor mu?",
  'Seyahat tarihlerini tam kapsıyor mu (önce ve sonra 1-2 gün eklendi mi)?',
  'Acil tıbbi müdahale, hastaneye nakil, ölüm halinde iade kapsamı var mı?',
  'COVID-19 dahil mi?',
  'Kronik hastalık varsa kapsam eklenmiş mi?',
  'Sportif aktivite planlıyorsanız kapsama alınmış mı?',
  'Poliçe PDF dökümanı elinize geçti mi? (Konsolosluk baskılı poliçe ister)',
  'Acil durumda arayacağınız 24 saat Türkçe hat var mı?',
];

const RED_SEBEPLERI = [
  "30.000 €'nun altında teminat",
  'Schengen bölgesini tam kapsamama (bazı ülkeleri dışarıda bırakan poliçeler)',
  'Seyahat tarihlerinin poliçe süresine uymaması',
  'Anlaşılmaz veya belirsiz poliçe metni',
  'Sigorta şirketinin Schengen listesinde olmaması',
  'Poliçenin İngilizce versiyonunun olmaması (tavsiye, bazı ülkelerde zorunlu)',
];

const ACIL_DURUM = [
  'Poliçenizdeki 24 saat acil hattı arayın (daima yanınızda bulundurun)',
  'Durumunuzu anlatın, nerede olduğunuzu söyleyin',
  'Şirket size en yakın anlaşmalı hastaneyi yönlendirir',
  'Tedavi alırken faturaları saklayın',
  'Şirket genellikle doğrudan ödeme yapar, ancak bazı durumlarda siz ödeyip sonra iade alırsınız',
  'Polis raporu gerektiren durumlar (hırsızlık, kaza) için yerel polise de bildirin',
];

const SSS = [
  {
    q: 'En ucuz Schengen sigortası kaç lira?',
    a: "7 günlük standart poliçe 150-200 TL'den başlar. Ancak en ucuz, her zaman en doğru seçim değildir. Kapsamlı, güvenilir poliçeyi tercih edin.",
  },
  {
    q: "Poliçeyi Türkiye'den mi yoksa yurtdışından mı almalıyım?",
    a: 'Türkiye\'den almak daha pratik. Türk sigorta şirketleri Schengen kurallarına uygun poliçeler sunar ve Türkçe müşteri hizmetleri sağlar. Yurtdışı poliçelerde Türkçe destek olmayabilir.',
  },
  {
    q: 'Vizem reddedilirse poliçe ücreti iade edilir mi?',
    a: 'Çoğu şirket, vize reddi halinde poliçe ücretinin tamamını veya büyük bölümünü iade eder. Alırken bu koşulu sorgulayın. İade politikası şirkete göre değişir.',
  },
  {
    q: 'Aile üyeleri için tek poliçe yeterli mi?',
    a: 'Aile poliçesi seçeneği vardır. Her aile üyesi için ayrı ayrı 30.000 € teminat sağlar ama tek bir poliçe olarak satılır. Bu genellikle bireysel poliçelerden daha ekonomiktir.',
  },
  {
    q: 'Çocuklar için özel poliçe gerekli mi?',
    a: 'Hayır, çocuklar aile poliçesine dahil edilebilir. Bazı şirketler 12 yaş altı çocukları ücretsiz ekler. 18 yaş altı için özel indirimli poliçeler vardır.',
  },
  {
    q: 'Bedenen engelliyim, sigorta alabilir miyim?',
    a: 'Evet ama bazı şirketler sağlık durumunuzu sorgulayıp ek prim talep edebilir. Engellilik durumu mevcut sağlık durumu olarak değerlendirilir ve standart poliçeye ek kapsam gerekir.',
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
      publisher: { '@type': 'Organization', name: 'VizeAkıl', logo: { '@type': 'ImageObject', url: 'https://vizeakil.com/og-image.png' } },
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

export default function SeyahatSigortasiNasilSecilir() {
  return (
    <BlogPostLayout post={POST} schema={SCHEMA}>
      <p className="text-slate-700 leading-relaxed text-base mb-6">
        Seyahat sigortası, Schengen vizesinin zorunlu şartıdır ve pek çok başvuru sigorta hatası
        yüzünden reddedilir. "En ucuz" poliçe her zaman en doğru seçim olmayabilir. Bu rehber,
        vize için nasıl seyahat sigortası seçmeniz gerektiğini, hangi kapsama dikkat etmeniz
        gerektiğini ve güvenilir şirketleri anlatıyor.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Schengen Seyahat Sigortası Zorunlu Şartları</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Schengen vizesi için seyahat sigortası kabul kriterleri:
      </p>
      <ul className="space-y-2 mb-4">
        {SCHENGEN_KRITERLER.map((k) => (
          <li key={k} className="flex gap-2 text-slate-700">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <span>{k}</span>
          </li>
        ))}
      </ul>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-blue-900 text-sm leading-relaxed">
          Bu kriterler Schengen Anlaşması'nın resmi gereksinimleridir. Hiçbir konsolosluk bunları
          esnetmez. Poliçeyi internette satın alırken mutlaka "Schengen için uygundur" veya
          "Schengen approved" ifadesinin yazılı olduğunu kontrol edin.
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Farklı Ülkelerin Sigorta Gereksinimleri</h2>
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full text-sm border border-slate-200 rounded-xl overflow-hidden">
          <thead className="bg-brand-50">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-slate-900">Ülke</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-900">Minimum Teminat</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-900">Kapsam Özellikleri</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {ULKE_SIGORTA.map((u) => (
              <tr key={u.ulke} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-800 font-medium">{u.ulke}</td>
                <td className="px-4 py-3 text-slate-700">{u.teminat}</td>
                <td className="px-4 py-3 text-slate-700">{u.kapsam}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Seyahat Sigortasında Dikkat Edilecek Detaylar</h2>
      <div className="space-y-4 mb-8">
        {DETAYLAR.map((d) => (
          <div key={d.baslik} className="border border-slate-200 rounded-xl p-5 bg-white">
            <h3 className="font-semibold text-slate-900 mb-2">{d.baslik}</h3>
            <p className="text-slate-700 text-sm leading-relaxed">{d.aciklama}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Güvenilir Sigorta Şirketleri</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Türkiye'de Schengen onaylı seyahat sigortası satan güvenilir şirketler:
      </p>
      <ul className="space-y-2 mb-8">
        {SIRKETLER.map((s) => (
          <li key={s} className="flex gap-2 text-slate-700">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <span>{s}</span>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Online Karşılaştırma Siteleri</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        En iyi poliçeyi bulmak için karşılaştırma sitelerini kullanın:
      </p>
      <ul className="space-y-2 mb-4">
        {KARSILASTIRMA_SITELERI.map((k) => (
          <li key={k} className="flex gap-2 text-slate-700">
            <Globe className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
            <span>{k}</span>
          </li>
        ))}
      </ul>
      <p className="text-slate-700 leading-relaxed mb-8">
        Bu siteler farklı şirketlerin aynı teminat için fiyatlarını karşılaştırır. 10 dakika içinde
        en uygun poliçeyi bulabilirsiniz.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Tahmini Fiyatlar (2026)</h2>
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full text-sm border border-slate-200 rounded-xl overflow-hidden">
          <thead className="bg-brand-50">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-slate-900">Seyahat Türü</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-900">Süre</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-900">Fiyat Aralığı</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {FIYATLAR.map((f) => (
              <tr key={f.tur} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-800 font-medium">{f.tur}</td>
                <td className="px-4 py-3 text-slate-700">{f.sure}</td>
                <td className="px-4 py-3 text-slate-700">{f.fiyat}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-slate-600 text-sm mb-8">
        Fiyatlar yaş, sağlık durumu, ek teminatlar, şirket ve poliçe tipine göre değişir.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Poliçe Satın Alırken Yapılması Gereken 10 Kontrol</h2>
      <ol className="list-decimal list-inside space-y-2 text-slate-700 mb-8 pl-2">
        {KONTROL_LISTESI.map((k) => (
          <li key={k}>{k}</li>
        ))}
      </ol>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">En Sık Red Sebepleri (Sigorta Kaynaklı)</h2>
      <ul className="space-y-2 mb-8">
        {RED_SEBEPLERI.map((r) => (
          <li key={r} className="flex gap-2 text-slate-700">
            <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <span>{r}</span>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Acil Durumda Nasıl Kullanılır?</h2>
      <p className="text-slate-700 leading-relaxed mb-4">Seyahatinizde tıbbi bir sorun yaşarsanız:</p>
      <ol className="list-decimal list-inside space-y-2 text-slate-700 mb-8 pl-2">
        {ACIL_DURUM.map((a) => (
          <li key={a}>{a}</li>
        ))}
      </ol>

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
