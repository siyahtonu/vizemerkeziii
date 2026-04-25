import React from 'react';
import { AlertTriangle, CheckCircle2, Info, ShieldCheck } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'kapida-vize-veren-ulkeler-2026',
  title: "Türk Pasaportuyla Kapıda Vize Alınabilecek Ülkeler 2026",
  description: "2026 güncel listesi: Türk vatandaşlarının kapıda vize alabildiği ülkeler, koşullar, ücretler ve dikkat edilmesi gerekenler. Dubai, Maldivler, Endonezya ve daha fazlası.",
  category: 'Genel',
  readingTime: 6,
  date: '2026-04-16',
  tags: ['kapıda vize', 'vizesiz ülkeler', 'Türk pasaportu', '2026 seyahat', 'vize gerektirmeyen'],
};

const ARTICLE_SCHEMA = {
  '@type': 'Article',
  headline: POST.title,
  description: POST.description,
  author: { '@type': 'Organization', name: 'VizeAkıl', url: 'https://vizeakil.com' },
  publisher: { '@type': 'Organization', name: 'VizeAkıl', logo: { '@type': 'ImageObject', url: 'https://vizeakil.com/og-image.png' } },
  datePublished: POST.date,
  dateModified: POST.date,
  url: `https://vizeakil.com/blog/${POST.slug}`,
};

const FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: "Türk pasaportuyla kapıda vize alınabilen ülkeler 2026'da değişti mi?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "2026 itibarıyla Türk vatandaşlarının kapıda vize alabildiği ülke sayısı yaklaşık 35-40 civarındadır. Liste yıldan yıla değişebilir; ikili anlaşmalar veya diplomatik gelişmeler koşulları etkileyebilir. Seyahat öncesi hedef ülkenin büyükelçiliği veya resmi hükümeti sitesini kontrol edin.",
      },
    },
    {
      '@type': 'Question',
      name: "Dubai kapıda vize ücretsiz mi?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Evet, Türk pasaportu sahipleri Dubai Havalimanı'nda ücretsiz kapıda vize alabilir. Vize genellikle 30 gün geçerlidir ve uzatılabilir. Türk pasaportunun BAE kapıda vize listesinde yer aldığını seyahat öncesi teyit etmenizi öneririz.",
      },
    },
    {
      '@type': 'Question',
      name: "Kapıda vize için hangi belgeler gerekir?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Genel olarak geçerli pasaport, dönüş bileti, otel rezervasyonu ve yeterli nakit/kart kanıtı istenir. Bazı ülkeler fotoğraf da talep eder. Belgeler ülkeden ülkeye değişir; seyahat öncesi araştırın.",
      },
    },
    {
      '@type': 'Question',
      name: "Maldivler için kapıda vize ücreti ne kadar?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Maldivler, Türk vatandaşları dahil tüm turistlere ücretsiz 30 günlük kapıda vize verir. Pasaport kontrolünde otomatik olarak işlenir, ayrıca form doldurmanıza gerek yoktur.",
      },
    },
    {
      '@type': 'Question',
      name: "Kapıda vize ile e-vize arasındaki fark nedir?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Kapıda vize (visa on arrival) sınır kapısında verilirken, e-vize (electronic visa) seyahat öncesi çevrimiçi başvurularak alınır. E-vize genellikle kapıda bekleme olmadan dijital onay sağlar. Bazı ülkeler her ikisini de sunarken, bazıları yalnızca birine izin verir.",
      },
    },
    {
      '@type': 'Question',
      name: "Kapıda vize reddedilirse ne olur?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Kapıda vize reddedilirse ülkeye giriş yapılamaz ve genellikle aynı veya bir sonraki uçuşla geri gönderilirsiniz. Bu durumda uçuş, otel ve diğer harcamalar kayıp olabilir. Risk faktörü olan profiller (sık ziyaret, overstay geçmişi) için önceden e-vize almak tercih edilmelidir.",
      },
    },
  ],
};

const ULKELER: Array<{
  ulke: string;
  kita: string;
  sure: string;
  ucret: string;
  not: string;
}> = [
  { ulke: 'Dubai / BAE', kita: 'Orta Doğu', sure: '30 gün', ucret: 'Ücretsiz', not: "Uzatılabilir. Türk pasaportu listede; ancak seyahat öncesi teyit edin." },
  { ulke: 'Maldivler', kita: 'Asya', sure: '30 gün', ucret: 'Ücretsiz', not: "Turistlere otomatik verilir. Dönüş bileti ve konaklama gösterilmeli." },
  { ulke: 'Nepal', kita: 'Asya', sure: '15-90 gün', ucret: '30-100 USD', not: "Süreye göre ücret değişir. Havalimanında kolayca alınır." },
  { ulke: 'Etiyopya', kita: 'Afrika', sure: '30 gün', ucret: '52 USD', not: "Hem havalimanı hem e-vize seçeneği var. Addis Ababa transit için popüler." },
  { ulke: 'Madagaskar', kita: 'Afrika', sure: '30 gün (uzatılabilir)', ucret: '35 USD', not: "Havalimanında verilir." },
  { ulke: 'Endonezya', kita: 'Asya', sure: '30 gün', ucret: '35 USD', not: "VOA (Visa on Arrival) ve e-VOA seçeneği. Bali, Jakarta havalimanlarında." },
  { ulke: 'Nijer', kita: 'Afrika', sure: '30 gün', ucret: 'Değişken', not: "Transit veya turizm için." },
  { ulke: 'Togo', kita: 'Afrika', sure: '7-30 gün', ucret: 'Değişken', not: "E-vize de mevcuttur." },
  { ulke: 'Mozambik', kita: 'Afrika', sure: '30 gün', ucret: '50 USD', not: "Dönüş bileti ve yeterli nakit şart." },
  { ulke: "Komorlar", kita: 'Afrika', sure: '45 gün', ucret: '30 USD', not: "Havalimanında veya limanda." },
  { ulke: 'Timor-Leste', kita: 'Asya', sure: '30 gün', ucret: '30 USD', not: "Dili havalimanında." },
  { ulke: 'Madagaskar', kita: 'Afrika', sure: '30 gün', ucret: '35 USD', not: "Havalimanında." },
];

const KITA_RENK: Record<string, { bg: string; text: string }> = {
  'Orta Doğu': { bg: 'bg-amber-100', text: 'text-amber-800' },
  'Asya': { bg: 'bg-blue-100', text: 'text-blue-800' },
  'Afrika': { bg: 'bg-emerald-100', text: 'text-emerald-800' },
};

export default function KapidaVizeUlkeler() {
  const tekUlkeler = ULKELER.filter((u, i, a) => a.findIndex(x => x.ulke === u.ulke) === i);

  return (
    <BlogPostLayout post={POST} schema={[ARTICLE_SCHEMA, FAQ_SCHEMA]}>

      <p className="text-slate-700 leading-relaxed text-base mb-6">
        Kapıda vize veya e-vize, önceden konsolosluk randevusu almadan seyahat
        esnekliği sağlar. Türk pasaportu 2026 itibarıyla yaklaşık 35-40 ülkede
        kapıda vize imkânı tanımaktadır. Bu ülkelerin büyük çoğunluğu turizm için
        kapılarını açık tutarken bazıları ek belgeler veya ücret talep eder.
        Güncel ve güvenilir liste, dikkat noktalarıyla.
      </p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-800 text-sm mb-1">Listeler Değişebilir</p>
          <p className="text-amber-700 text-sm leading-relaxed">
            Kapıda vize listesi ikili anlaşmalara bağlıdır ve diplomatik gelişmelere göre
            değişebilir. <strong>Bu rehber bilgi amaçlıdır;</strong> seyahat öncesi
            hedef ülkenin resmi kaynağını veya büyükelçiliğini mutlaka kontrol edin.
          </p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">2026 Öne Çıkan Kapıda Vize Destinasyonları</h2>
      <div className="space-y-3 mb-10">
        {tekUlkeler.map(({ ulke, kita, sure, ucret, not }) => {
          const r = KITA_RENK[kita] ?? { bg: 'bg-slate-100', text: 'text-slate-700' };
          return (
            <div key={ulke} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-4 py-3 flex items-center justify-between bg-slate-50">
                <p className="font-bold text-slate-800 text-sm">{ulke}</p>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${r.bg} ${r.text}`}>{kita}</span>
                  <span className="text-xs text-slate-500">{sure}</span>
                  <span className="text-xs font-semibold text-brand-700">{ucret}</span>
                </div>
              </div>
              <div className="px-4 py-3 text-sm text-slate-600">{not}</div>
            </div>
          );
        })}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Kapıda Vizede Sıkça İstenen Belgeler</h2>
      <ul className="space-y-2 mb-8">
        {[
          'Geçerli pasaport (en az 6 ay geçerlilik)',
          'Dönüş biletinin kanıtı',
          'Konaklama rezervasyonu veya adres bilgisi',
          'Yeterli nakit veya kredi kartı gösterimi',
          "Bazı ülkeler: fotoğraf, vize ücretinin nakit (USD/Euro) ödenmesi",
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Kapıda Vize mi, E-Vize mi?</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm">
          <p className="font-semibold text-blue-800 mb-2">Kapıda Vize Avantajları</p>
          <ul className="space-y-1 text-blue-700">
            <li>• Önceden işlem yok, anlık giriş</li>
            <li>• Tarih esnekliği</li>
            <li>• Genellikle ücretsiz veya düşük ücret</li>
          </ul>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm">
          <p className="font-semibold text-emerald-800 mb-2">E-Vize Avantajları</p>
          <ul className="space-y-1 text-emerald-700">
            <li>• Havalimanında bekleme yok</li>
            <li>• Önceden onay güvencesi</li>
            <li>• Ret riski yok (onaylı geliyor)</li>
          </ul>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-blue-800 text-sm leading-relaxed">
          <strong>Pratik Tavsiye:</strong> Endonezya ve Etiyopya gibi ülkelerde kapıda vize
          yerine e-vize almak havalimanında sıraya girmeyi ortadan kaldırır.
          Uzun yolculuk sonrası yorgunluğa vize kuyruğu eklememek için e-vize
          seçeneği varsa önce bunu değerlendirin.
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Sık Sorulan Sorular</h2>
      <div className="space-y-4 mb-8">
        {FAQ_SCHEMA.mainEntity.map(({ name, acceptedAnswer }) => (
          <div key={name} className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="font-semibold text-slate-800 text-sm mb-2">{name}</p>
            <p className="text-slate-600 text-sm leading-relaxed">{acceptedAnswer.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-brand-50 border border-brand-200 rounded-2xl p-6">
        <h3 className="font-bold text-brand-900 mb-2">Kapıda Vize: Kolaylık Ama Garantisiz</h3>
        <p className="text-brand-800 text-sm leading-relaxed">
          Kapıda vize seyahat özgürlüğünü artırır; ancak "garantili giriş" değildir.
          Belgelerinizi eksiksiz taşıyın, seyahat öncesi güncel bilgiyi doğrulayın ve
          nakit USD veya Euro bulundurun — kart kabul etmeyen kapılar hâlâ var.
        </p>
      </div>

    </BlogPostLayout>
  );
}
