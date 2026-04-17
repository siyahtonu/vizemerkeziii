import React from 'react';
import { CheckCircle2, Heart, Info, ShieldCheck, Users } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'ev-hanimlari-icin-schengen-vizesi',
  title: 'Ev Hanımları İçin Schengen Vizesi Nasıl Alınır? 2026 Tam Rehber',
  description: 'Çalışmayan ev hanımları için Schengen vize başvurusu: eş sponsorluğu, banka ekstresi, kısıt belgeler ve en kolay onaylanan ülkeler.',
  category: 'Schengen',
  readingTime: 9,
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
      publisher: { '@type': 'Organization', name: 'VizeAkıl' },
      datePublished: POST.date,
      dateModified: POST.date,
      url: `https://vizeakil.com/blog/${POST.slug}`,
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Ev hanımları Schengen vizesi alabilir mi?',
          acceptedAnswer: { '@type': 'Answer', text: 'Evet. Eş sponsorluğu, aile bağları ve tutarlı belgeler sunulduğunda ev hanımlarının Schengen onay oranı çalışanlardan düşük değildir.' },
        },
        {
          '@type': 'Question',
          name: 'Ev hanımlarının en çok hangi ülkeye onayı çıkıyor?',
          acceptedAnswer: { '@type': 'Answer', text: '2025–2026 istatistiklerine göre İtalya, Yunanistan ve İspanya konsoloslukları ev hanımlarına en toleranslı yaklaşan ülkelerdir.' },
        },
        {
          '@type': 'Question',
          name: 'Eş sponsoru için hangi belgeler gerekir?',
          acceptedAnswer: { '@type': 'Answer', text: 'Eşin 6 aylık banka dökümü, SGK hizmet dökümü, maaş bordrosu, noter onaylı taahhüt mektubu ve evlilik cüzdanı fotokopisi.' },
        },
      ],
    },
  ],
};

export default function EvHanimlariSchengenVizesi() {
  return (
    <BlogPostLayout post={POST} schema={SCHEMA}>
      <p className="text-slate-700 leading-relaxed text-base mb-6">
        "Çalışmıyorum, sigortam yok, vize alabilir miyim?" sorusu binlerce ev hanımı için engelleyici
        bir korkudur. Oysa 2025-2026 onay istatistiklerine göre belgelerini doğru hazırlayan ev hanımları,
        çalışan başvurucuların üzerinde onay oranına sahiptir. Sır basittir: <strong>gelir belgesi
        eksikliğini güçlü aile bağlarıyla telafi etmek.</strong>
      </p>

      <div className="bg-brand-50 border border-brand-200 rounded-xl p-5 mb-8 flex gap-3">
        <Heart className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
        <p className="text-brand-900 text-sm leading-relaxed">
          Konsolosluğun sorduğu temel soru şudur: "Bu kişinin Türkiye'ye geri dönmesi için
          yeterli sebep var mı?" Ev hanımları için bu sebepler genellikle eş, çocuklar ve
          mülktür — ve doğru belgelendiğinde çalışan biri kadar güçlüdür.
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">1. Eş Sponsorluğu: Olmazsa Olmaz Belgeler</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Ev hanımı başvurusunda en kritik kısım eş sponsorluğudur. Eşin Türkiye'deki iş
        durumu, geliri ve seyahatin masraflarını üstlendiğine dair taahhüdü açık olmalıdır.
      </p>
      <ul className="space-y-2 mb-6">
        {[
          'Eşin noter onaylı taahhüt/destek mektubu (Türkçe + İngilizce)',
          'Eşin 6 aylık banka dökümü (kaşeli, imzalı)',
          'Eşin SGK hizmet dökümü (çalışıyorsa) veya vergi levhası (işveren/esnafsa)',
          'Eşin son 3 maaş bordrosu',
          'Evlilik cüzdanı fotokopisi + nüfus kayıt örneği',
          'Eğer sponsor eş dışı akraba ise akrabalık belgesi',
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">2. Kendi Adınıza Sunacağınız Belgeler</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Eş sponsorluğu tek başına yeterli değildir; ev hanımının da kendi kimliği, durumu ve
        Türkiye'ye bağları belgelenmelidir.
      </p>
      <ul className="space-y-2 mb-6">
        {[
          'Pasaport (en az 6 ay geçerli, en az 2 boş sayfa)',
          'Başvuru formu (tam doldurulmuş, imzalı)',
          '2 adet biyometrik fotoğraf (son 6 ay içinde çekilmiş)',
          'Seyahat sağlık sigortası (min. €30.000 teminat, Schengen bölgesi geçerli)',
          'Otel ve uçak rezervasyonu',
          'Nüfus kayıt örneği (e-devletten, son 1 ay içinde)',
          'Kendi adınıza banka hesabı varsa dökümü',
          'Varsa tapu, araç ruhsatı gibi mülk belgeleri',
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">3. Aile Bağları Nasıl Güçlendirilir?</h2>
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-6 flex gap-3">
        <Users className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-emerald-800 text-sm mb-1">Ev hanımının en güçlü kozu: Çocuklar</p>
          <p className="text-emerald-700 text-sm leading-relaxed">
            Türkiye'de okula giden çocukların olması, konsolosluk gözünde en sağlam geri dönüş
            güvencesidir. Çocukların okul kayıt belgesi başvuruya eklenmelidir. Bakımı gereken yaşlı
            ebeveyn de benzer etkide bir bağdır.
          </p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">4. En Kolay Onay Veren Schengen Ülkeleri</h2>
      <div className="space-y-3 mb-8">
        {[
          { ulke: 'İtalya', onay: '%88', not: 'Ev hanımlarına en toleranslı. Kısa bekleme, esnek randevu.' },
          { ulke: 'Yunanistan', onay: '%90+', not: 'Adalar için kapı vizesi seçeneği (sezonluk).' },
          { ulke: 'İspanya', onay: '%85', not: 'Aile sponsoru belgelerine toleranslı, VFS üzerinden başvuru.' },
          { ulke: 'Fransa', onay: '%82', not: 'Standart belge seti ile onay veriyor, Paris yoğun.' },
          { ulke: 'Almanya', onay: '%78', not: 'Daha sıkı incelenir; banka hareketleri çok önemlidir.' },
        ].map(({ ulke, onay, not }) => (
          <div key={ulke} className="bg-white border border-slate-200 rounded-xl p-4 text-sm">
            <div className="flex justify-between items-center mb-1">
              <p className="font-semibold text-slate-800">{ulke}</p>
              <span className="text-emerald-700 font-bold">{onay}</span>
            </div>
            <p className="text-slate-500 text-xs italic">{not}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">5. En Sık Yapılan 5 Hata</h2>
      <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6">
        <ul className="text-red-800 text-sm space-y-2">
          <li>• "Çalışmıyorum" yerine "işsizim" yazmak — farklı anlama gelir</li>
          <li>• Eşin banka ekstresi eksikliği veya başvurudan hemen önce para yatırışı</li>
          <li>• Çocukların okul belgesinin unutulması</li>
          <li>• Sadece sponsor taahhüt mektubu — hesap dökümü ile desteklenmemesi</li>
          <li>• Kendi adına küçük de olsa bir hesabın bulundurulmaması</li>
        </ul>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">6. Mülakat/Görüşme Varsa Ne Sorulur?</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Schengen başvurularında genelde mülakat yoktur ama özel hallerde aramak sorulabilir.
        Muhtemel sorular:
      </p>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6 space-y-2 text-sm text-slate-700">
        <p className="flex items-start gap-2"><Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5"/><span><strong>Eşiniz ne iş yapıyor?</strong> — Net ve kısa cevap verin.</span></p>
        <p className="flex items-start gap-2"><Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5"/><span><strong>Seyahatinizi kim karşılıyor?</strong> — Eş/sponsor ismi + sponsor belgelerine referans.</span></p>
        <p className="flex items-start gap-2"><Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5"/><span><strong>Çocuklarınız nerede kalacak?</strong> — Anne/baba veya çocukların da geliyorsa detaylı plan.</span></p>
        <p className="flex items-start gap-2"><Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5"/><span><strong>Daha önce yurtdışı seyahatiniz oldu mu?</strong> — Vize geçmişinizi hatırlayın.</span></p>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-8 flex gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-emerald-800 text-sm mb-1">Danışman Tavsiyesi</p>
          <p className="text-emerald-700 text-sm leading-relaxed">
            İlk Schengen başvurunuzda İtalya veya Yunanistan gibi toleranslı ülkelerle başlayın.
            Onay alıp seyahat ettikten sonra Almanya ve Fransa gibi daha sıkı ülkelerin kapıları
            açılacaktır. "Temiz bir Schengen geçmişi" gelecek başvuruların en güçlü kozudur.
          </p>
        </div>
      </div>

      <div className="mt-12 bg-brand-50 border border-brand-200 rounded-2xl p-6">
        <h3 className="font-bold text-brand-900 mb-2">Özet</h3>
        <p className="text-brand-800 text-sm leading-relaxed">
          Ev hanımları için Schengen vizesi almak hiç de imkansız değildir. Eş sponsorluğu + aile
          bağları + tutarlı belge seti üçlüsüyle onay oranı %85'in üzerindedir. Doğru ülkeyi seçin,
          belge setinizi tamamlayın ve başvurunuzu 2 ay öncesinden planlayın.
        </p>
      </div>
    </BlogPostLayout>
  );
}
