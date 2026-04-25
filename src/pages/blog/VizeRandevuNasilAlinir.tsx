import React from 'react';
import { AlertTriangle, CheckCircle2, Info, ShieldCheck } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'vize-randevusu-nasil-alinir',
  title: "Vize Randevusu Nasıl Alınır? 2026 VFS ve Konsolosluk Rehberi",
  description: "Schengen, İngiltere, ABD ve diğer ülkeler için vize randevusu alma adımları, VFS Global ve TLScontact portalleri, randevu bulunamadığında ne yapılır, iptal takibi nasıl yapılır.",
  category: 'Genel',
  readingTime: 6,
  date: '2026-04-16',
  tags: ['vize randevusu', 'VFS Global', 'TLScontact', 'randevu iptal', 'konsolosluk randevu'],
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
      name: "VFS Global nedir?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "VFS Global, 150'den fazla ülkede konsolosluklar adına vize başvurusu kabul eden dünyanın en büyük vize hizmet şirketidir. Schengen ülkelerinin çoğu (Almanya, Fransa, Hollanda, İsviçre, vb.) Türkiye'deki başvuruları VFS aracılığıyla toplar. VFS vize kararı vermez; belge toplama ve biyometrik kayıt hizmeti sunar.",
      },
    },
    {
      '@type': 'Question',
      name: "Randevu bulunamıyor — ne yapmalıyım?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "VFS veya TLS portalında randevu görünmüyorsa her gün farklı saatlerde kontrol edin; iptaller gün içinde açılır. Premium öncelikli randevu (ek ücretli) seçeneğini değerlendirin. İstanbul dışı şehirlerde (Ankara, İzmir) randevu daha kolay olabilir. Seyahat tarihinizi esnetme imkânınız varsa sezon dışı dönemleri hedefleyin.",
      },
    },
    {
      '@type': 'Question',
      name: "ABD vize randevusu nasıl alınır?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "ABD vizesi için ustravisa.state.gov adresinden profil oluşturulur, DS-160 formu doldurulur ve randevu bu platform üzerinden alınır. ABD vizesi VFS üzerinden değil, doğrudan Amerikan Büyükelçiliği'nin kendi sistemi üzerinden yönetilir. İstanbul ve Ankara konsolosluklarında randevu bulunabilir.",
      },
    },
    {
      '@type': 'Question',
      name: "Randevu günü geç kalırsam ne olur?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Çoğu VFS merkezi belirlenen randevu saatinden 15-30 dakika sonrasına kadar kabul eder; ancak bu garanti değildir. Geç kalma durumunda randevunuz iptal edilip sizi redde gönderebilirler. Randevu iptal edilirse yeni randevu almanız gerekir. Erken gitmeniz her zaman tavsiye edilir.",
      },
    },
    {
      '@type': 'Question',
      name: "Randevu alırken belge taslağım hazır olmalı mı?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Randevu alırken belgelerinizin hazır olması gerekmez; önce randevu alın, ardından belgeleri hazırlayın. Ancak randevu tarihinden en az 1 hafta önce tüm belgelerinizin eksiksiz olduğundan emin olun. Randevu gününde eksik belge başvurunuzu geçersiz kılabilir.",
      },
    },
    {
      '@type': 'Question',
      name: "Üçüncü şahıs aracısına randevu kaptırmamak için ne yapabilirim?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Bot veya aracıların randevuları kapmaması için resmi portali doğrudan düzenli takip edin. Sabah erken saatler (07:00-09:00) ve gece yarısı yeni slot açılma olasılığı yüksektir. VFS'in bazı ülkeler için açtığı premium randevu servisi, aracı olmadan öncelik sağlar.",
      },
    },
  ],
};

const RANDEVU_MERKEZLERI = [
  { ulke: 'Almanya', merkez: 'VFS Global', sehirler: 'İstanbul, Ankara, İzmir, Bursa, Antalya' },
  { ulke: 'Fransa', merkez: 'TLScontact', sehirler: 'İstanbul, Ankara, İzmir' },
  { ulke: 'İtalya', merkez: 'VFS Global', sehirler: 'İstanbul, Ankara, İzmir' },
  { ulke: 'Hollanda', merkez: 'VFS Global', sehirler: 'İstanbul, Ankara' },
  { ulke: 'İspanya', merkez: 'BLS International', sehirler: 'İstanbul, Ankara' },
  { ulke: 'İngiltere', merkez: 'VFS Global', sehirler: 'İstanbul, Ankara, İzmir' },
  { ulke: 'ABD', merkez: 'Doğrudan Büyükelçilik', sehirler: 'İstanbul, Ankara' },
  { ulke: 'Kanada', merkez: 'VFS Global', sehirler: 'İstanbul, Ankara' },
];

export default function VizeRandevuNasilAlinir() {
  return (
    <BlogPostLayout post={POST} schema={[ARTICLE_SCHEMA, FAQ_SCHEMA]}>

      <p className="text-slate-700 leading-relaxed text-base mb-6">
        Birçok kişi vize sürecini belge hazırlamakla başlatır — oysa ilk adım
        <strong> randevu almaktır.</strong> Özellikle yoğun sezonlarda Almanya ve
        Fransa gibi ülkeler için randevu bulmak haftalar sürebilir. Bu rehberde
        hangi merkez, hangi platform, nasıl randevu alınır ve randevu bulunamadığında
        ne yapılır — pratik ve güncel bilgilerle.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Ülkelere Göre Randevu Merkezi</h2>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700">
              <th className="text-left p-3 rounded-tl-lg font-semibold">Ülke</th>
              <th className="text-left p-3 font-semibold">Aracı Merkez</th>
              <th className="text-left p-3 rounded-tr-lg font-semibold">Türkiye'deki Şehirler</th>
            </tr>
          </thead>
          <tbody>
            {RANDEVU_MERKEZLERI.map(({ ulke, merkez, sehirler }, i) => (
              <tr key={ulke} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                <td className="p-3 font-medium text-slate-700">{ulke}</td>
                <td className="p-3 text-slate-600">{merkez}</td>
                <td className="p-3 text-slate-500">{sehirler}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">VFS Global'da Randevu Adımları</h2>
      <div className="space-y-3 mb-8">
        {[
          { n: '1', b: "vfsglobal.com'a gidin", d: "Hedef ülkeyi ve başvuran ülkeyi (Türkiye) seçin. Her ülke için ayrı portal var." },
          { n: '2', b: "Hesap oluşturun / giriş yapın", d: "E-posta ile kayıt. Başvuru sahibinin adına hesap açılmalı." },
          { n: '3', b: "Başvuru türünü seçin", d: "Ziyaretçi, öğrenci, aile birleşimi gibi kategoriyi seçin." },
          { n: '4', b: "Şehir ve tarih seçin", d: "Mevcut randevular takvimde görünür. İlk uygun slotu seçin." },
          { n: '5', b: "Ödeme yapın ve onaylayın", d: "VFS hizmet ücreti kredi/banka kartıyla alınır. Randevu onay e-postasını saklayın." },
          { n: '6', b: "Randevu gününe hazırlanın", d: "Onay e-postası, pasaport ve tüm belgelerle belirlenen saatte merkezde olun." },
        ].map(({ n, b, d }) => (
          <div key={n} className="flex gap-3 text-sm">
            <span className="w-7 h-7 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold shrink-0 text-xs mt-0.5">{n}</span>
            <div>
              <p className="font-semibold text-slate-800 mb-0.5">{b}</p>
              <p className="text-slate-600 leading-relaxed">{d}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-800 text-sm mb-1">Sezon Uyarısı</p>
          <p className="text-amber-700 text-sm leading-relaxed">
            Mayıs–Ağustos döneminde Almanya ve Fransa randevuları <strong>4-8 hafta
            öncesinden</strong> doluyor. Yaz tatili için Nisan başında randevu almaya
            çalışın. Ekim–Şubat döneminde randevu bulmak çok daha kolay.
          </p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Randevu Bulunamadığında Ne Yapılır?</h2>
      <ul className="space-y-2 mb-8">
        {[
          "Her gün sabah 07:00-09:00 ve gece 23:00-01:00 arası portal kontrol edin — iptal slotları bu saatlerde açılır",
          "İstanbul dolu mu? Ankara, İzmir, Bursa şubelerini deneyin",
          "VFS Premium (öncelikli) randevu hizmetini değerlendirin — ek ücret, ama bekleme süresini kısaltır",
          "Seyahat tarihini esnetebiliyorsanız sezon dışı dönem hedefleyin",
          "İptal gün takibi için tarayıcı bildirimi açın veya belirli saatlerden kontrol takvimi yapın",
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Randevu Günü Neleri Getirmelisiniz?</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm">
          <p className="font-bold text-slate-800 mb-2">Zorunlu</p>
          <ul className="space-y-1 text-slate-600">
            <li>• Randevu onay çıktısı veya dijital kopyası</li>
            <li>• Orijinal pasaport</li>
            <li>• Doldurulmuş başvuru formu</li>
            <li>• Biyometrik fotoğraflar</li>
            <li>• Tüm destekleyici belgeler</li>
          </ul>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm">
          <p className="font-bold text-slate-800 mb-2">Tavsiye Edilen</p>
          <ul className="space-y-1 text-slate-600">
            <li>• Tüm belgelerin fotokopisi (sıra sıra)</li>
            <li>• Dosya veya klasörde düzenli sıralama</li>
            <li>• Yedek fotoğraf</li>
            <li>• Ödeme dekontu (VFS hizmet ücreti)</li>
          </ul>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-blue-800 text-sm leading-relaxed">
          <strong>ABD Vizesi Farkı:</strong> ABD vize randevusu VFS üzerinden değil, doğrudan
          Amerikan Büyükelçiliği'nin sistemi olan <strong>ustravisa.state.gov</strong> üzerinden
          alınır. DS-160 formunu doldurmadan randevu oluşturulamaz. Süreç diğer ülkelerden farklıdır.
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
        <h3 className="font-bold text-brand-900 mb-2">Randevu: Vize Sürecinin Gerçek Başlangıcı</h3>
        <p className="text-brand-800 text-sm leading-relaxed">
          Belgeleri hazırlamak önemli ama randevu bulamadıysanız bunların hiçbiri bir
          anlam ifade etmez. Randevuyu erken alın, belgeleri hazırlamaya o zamandan
          başlayın. Vize süreci belge hazırlıkla değil, takvim planlamasıyla başlar.
        </p>
      </div>

    </BlogPostLayout>
  );
}
