import React from 'react';
import { AlertTriangle, CheckCircle2, Info, ShieldCheck } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'almanya-vizesi-nasil-alinir-2026',
  title: "Almanya Vizesi Nasıl Alınır? 2026 Güncel Belgeler, Bekleme Süresi ve İpuçları",
  description: "Türk vatandaşları için 2026 Almanya Schengen vizesi başvurusu: gerekli belgeler, banka hesabı şartları, VFS randevu süreci, bekleme süreleri ve onay oranını artıracak püf noktaları.",
  category: 'Almanya',
  readingTime: 8,
  date: '2026-04-16',
  tags: ['Almanya vizesi', 'Almanya Schengen', 'VFS Almanya', '2026 Almanya', 'Almanya vize belgeleri'],
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
      name: "Almanya vizesi ne kadar sürer?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Almanya vize başvurusu genellikle 4-8 hafta sürmektedir. Yoğun dönemlerde (Mayıs-Ağustos) bu süre 10 haftaya uzayabilir. Seyahat tarihinden en az 2 ay öncesinden başvurunuzu tamamlamanız önerilir.",
      },
    },
    {
      '@type': 'Question',
      name: "Almanya vizesi için banka hesabında ne kadar para olmalı?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Almanya konsolosluğu mali yeterlilik için kesin rakam vermemekle birlikte pratikte günlük 50-100 Euro baz alınır. 10 günlük seyahat için 500-1000 Euro, uzun seyahatler için daha fazlası beklenir. Hesap son 6 aylık düzenli gelir akışını yansıtmalı; toplu para yatırımları şüpheyle karşılanır.",
      },
    },
    {
      '@type': 'Question',
      name: "Almanya VFS randevusu nasıl alınır?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "vfsglobal.com adresinden 'Germany - Turkey' seçilerek hesap oluşturulur ve uygun tarih seçilir. İstanbul, Ankara, İzmir, Antalya ve Bursa'da VFS merkezi mevcuttur. Yaz sezonunda randevu 4-6 hafta öncesinden doluyor; erken rezervasyon şart.",
      },
    },
    {
      '@type': 'Question',
      name: "Almanya ilk kez vize başvurusunda zorluk çıkarır mı?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "İlk kez başvuranlara Almanya daha temkinli yaklaşır. Güçlü belgeler (düzenli gelir, stabil iş, mülk/kira, aile bağı) ve ikna edici niyet mektubunun rolü kritiktir. Pasaportunuzda başka ülke vizeleri veya Schengen geçmişi varsa pozitif etki yapar. İlk Schengen vizesi için Yunanistan veya İtalya daha kabul edici seçenektir.",
      },
    },
    {
      '@type': 'Question',
      name: "Almanya multiple-entry vize ne zaman verilir?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Almanya multiple-entry vize için genellikle geçmiş Schengen sicili aranır. İlk başvuruda single-entry alırsınız. Almanya'ya birden fazla başvurusu olan ve her seferinde kurallara uyan başvurucular 1 yıllık veya daha uzun multiple-entry vize alabilmektedir.",
      },
    },
    {
      '@type': 'Question',
      name: "Almanya iş vizesi turistik vizeden farklı mı?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Schengen kapsamındaki kısa süreli iş ziyaretleri (toplantı, konferans, fuar) turistik vize ile yapılabilir, ayrı iş vizesi gerekmez. Ancak başvuru formunda amacı 'iş' olarak beyan etmeniz ve davet mektubu, şirket belgesi gibi ek kanıtlar sunmanız beklenir.",
      },
    },
  ],
};

const BELGELER_ALMANYA = [
  {
    kategori: 'Temel Belgeler',
    liste: [
      'Geçerli biyometrik pasaport (son 10 yılda verilmiş, en az 3 ay geçerli)',
      'Önceki pasaportlar (varsa)',
      'İmzalı Schengen başvuru formu',
      '2 adet son 6 ay biyometrik fotoğraf',
      'Nüfus cüzdanı fotokopisi',
    ],
  },
  {
    kategori: 'Seyahat Belgeleri',
    liste: [
      'Uçak rezervasyonu (bilet değil, onaylı rezervasyon)',
      'Otel rezervasyonu veya davet mektubu',
      'Almanya-Schengen güzergah planı',
      'Minimum 30.000 Euro Schengen seyahat sigortası',
    ],
  },
  {
    kategori: 'Mali Belgeler',
    liste: [
      'Son 6 aylık banka hesap özeti (resmi mühürlü)',
      'Maaş bordrosu (son 3 ay)',
      'Gelir vergisi beyannamesi veya muhtasar bildirimi',
      'Varsa tapu, araç ruhsatı, ek varlık kanıtları',
    ],
  },
  {
    kategori: 'Bağlılık Kanıtı (Birini Seçin)',
    liste: [
      'Çalışanlar: İş sözleşmesi + SGK dökümü + işveren izin yazısı',
      'Serbest meslek: Vergi levhası + Ticaret Sicil + son dönem beyanname',
      'Öğrenciler: Öğrenci belgesi + transkript + veli veya burs garantisi',
      'Emekliler: Emekli maaşı belgesi + sosyal güvenlik kaydı',
    ],
  },
];

export default function AlmanyaVizesi2026() {
  return (
    <BlogPostLayout post={POST} schema={[ARTICLE_SCHEMA, FAQ_SCHEMA]}>

      <p className="text-slate-700 leading-relaxed text-base mb-6">
        Almanya, Türk vatandaşlarının en fazla vize başvurusu yaptığı Schengen ülkesi —
        ve aynı zamanda ret oranının en yüksek olduğu ülkelerden biri. Schengen
        istatistiklerine göre Almanya turizm başvurularında %60-68 onay oranıyla
        Yunanistan ve İtalya'nın çok gerisinde kalıyor. Bunun sebebi yüksek belge
        standardı ve mali yeterlilik beklentisi. Bu rehberde 2026 güncel belgeler,
        VFS süreci ve onay şansınızı artıracak kritik detaylar var.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Almanya Vize Türleri</h2>
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { tur: 'Turizm / Ziyaret', detay: 'En yaygın kategori. Aile ziyareti, tatil veya kültürel turizm için.' },
          { tur: 'İş Ziyareti', detay: 'Toplantı, fuar, konferans. Schengen vizesiyle yapılır; ayrı iş vizesi gerekmez.' },
          { tur: 'Transit', detay: 'Almanya üzerinden üçüncü ülkeye geçiş. Havalimanı transit vizesi ayrıdır.' },
        ].map(({ tur, detay }) => (
          <div key={tur} className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm">
            <p className="font-bold text-slate-800 mb-1">{tur}</p>
            <p className="text-slate-600 leading-relaxed">{detay}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Gerekli Belgeler</h2>
      <div className="space-y-4 mb-8">
        {BELGELER_ALMANYA.map(({ kategori, liste }) => (
          <div key={kategori} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-100 px-4 py-2">
              <p className="font-semibold text-slate-800 text-sm">{kategori}</p>
            </div>
            <ul className="p-4 space-y-1">
              {liste.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-800 text-sm mb-1">Almanya'nın Katı Banka Kontrolü</p>
          <p className="text-amber-700 text-sm leading-relaxed">
            Almanya konsolosluğu mali yeterlilik değerlendirmesinde en katı standartları
            uygular. <strong>Son 6 aylık banka hesap özetinin resmi banka mühürü
            taşıması zorunludur.</strong> İnternet bankacılığı çıktısı çoğu durumda
            kabul edilmez. Şubeye giderek resmi döküm alın.
          </p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">VFS Almanya Randevusu</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Almanya, Türkiye'de vize başvurularını VFS Global üzerinden alıyor. Türkiye'de
        İstanbul, Ankara, İzmir, Antalya ve Bursa'da VFS merkezi mevcut.
      </p>
      <ul className="space-y-2 mb-8">
        {[
          'Randevu: vfsglobal.com → Germany → Turkey',
          'Yaz sezonu (Nisan-Eylül) randevuları 4-8 hafta öncesinden doluyor',
          'Premium öncelikli randevu mevcut (ek ücret, yaklaşık 60-80 Euro)',
          'İstanbul merkezi en yoğun; Ankara ve İzmir daha kolay randevu',
          'VFS hizmet ücreti: ~30-35 Euro (vize ücretine ek)',
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Onay Şansını Artıran Faktörler</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm">
          <p className="font-semibold text-emerald-700 mb-2">Güçlendiren Unsurlar</p>
          <ul className="space-y-1 text-emerald-700">
            <li>• Pasaportsuz Schengen damgaları (Yunanistan, İtalya)</li>
            <li>• Düzenli maaş, stabil iş durumu</li>
            <li>• Mülk veya tapu belgesi</li>
            <li>• Almanya'da ikamet eden yakın aile üyesi</li>
            <li>• Güçlü niyet mektubu</li>
          </ul>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm">
          <p className="font-semibold text-red-700 mb-2">Zayıflatan Unsurlar</p>
          <ul className="space-y-1 text-red-700">
            <li>• Pasaportsuz Schengen damgası yok (ilk başvuru)</li>
            <li>• Düzensiz veya düşük banka hareketi</li>
            <li>• Önceki vize reddinin açıklanmaması</li>
            <li>• Seyahat sigortası eksik veya kapsamı yetersiz</li>
            <li>• Başvuru formundaki tutarsızlıklar</li>
          </ul>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-blue-800 text-sm leading-relaxed">
          <strong>Strateji Notu:</strong> Almanya ilk Schengen vizesi için en zor
          seçeneklerden biridir. Pasaportunuzda hiç Schengen damgası yoksa önce
          Yunanistan veya İtalya'dan başlayın. Oradan birkaç seyahat sonrası
          Almanya başvurusu çok daha güçlü bir profiyle yapılır.
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
        <h3 className="font-bold text-brand-900 mb-2">Almanya Vizesi: Hazırlıklı Gelen Kazanır</h3>
        <p className="text-brand-800 text-sm leading-relaxed">
          Almanya vize sürecinde zorluk belgede değil; konsolosluğun beklediği kalite
          ve tutarlılıkta. Resmi banka dökümü, eksiksiz belgeler, güçlü niyet mektubu
          ve geçmiş seyahat sicili bir arada olduğunda Almanya vizesi alınamaz değil —
          sadece daha özenli hazırlık gerektiriyor.
        </p>
      </div>

    </BlogPostLayout>
  );
}
