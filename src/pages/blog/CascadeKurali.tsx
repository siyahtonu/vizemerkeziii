import React from 'react';
import { AlertTriangle, CheckCircle2, Info, ShieldCheck } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'cascade-kurali-schengen-vizesi',
  title: 'Cascade Kuralı ile 5 Yıllık Schengen Vizesi Nasıl Alınır? (2026 Güncel Rehber)',
  description: 'Temmuz 2025\'te yürürlüğe giren Cascade kuralı nedir? Türk vatandaşları kademeli olarak 6 ay, 1 yıl, 3 yıl ve 5 yıllık çok girişli Schengen vizesi nasıl alır?',
  category: 'Schengen',
  readingTime: 8,
  date: '2026-04-16',
  tags: ['cascade kuralı', 'Schengen', 'çok girişli vize', '5 yıllık vize', '2026'],
};

const ARTICLE_SCHEMA = {
  '@type': 'Article',
  headline: POST.title,
  description: POST.description,
  author: { '@type': 'Organization', name: 'VizeAkıl', url: 'https://vizeakil.com' },
  publisher: { '@type': 'Organization', name: 'VizeAkıl' },
  datePublished: POST.date,
  dateModified: POST.date,
  url: `https://vizeakil.com/blog/${POST.slug}`,
};

const FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Cascade kuralı nedir?',
      acceptedAnswer: { '@type': 'Answer', text: 'Cascade kuralı (Avrupa Komisyonu C(2025) 4694 sayılı karar), önceki Schengen vizelerini kurallara uygun kullanan Türk vatandaşlarına kademeli olarak daha uzun süreli ve çok girişli vize verilmesini zorunlu kılan AB düzenlemesidir. İlk vize → 6 ay → 1 yıl → 3 yıl → 5 yıl şeklinde ilerler.' },
    },
    {
      '@type': 'Question',
      name: 'Cascade kuralı ne zaman yürürlüğe girdi?',
      acceptedAnswer: { '@type': 'Answer', text: '15 Temmuz 2025 tarihinde tüm Schengen ülkelerinde uygulamaya girmiştir.' },
    },
    {
      '@type': 'Question',
      name: 'Cascade kuralı için hangi şartlar gerekiyor?',
      acceptedAnswer: { '@type': 'Answer', text: 'Son 3 yıl içinde en az bir Schengen vizesi almış ve bu vizeyi kurallara uygun (kalmaya izin verilen süreyi aşmadan, belirlenen ülkelerde kalarak) kullanmış olmak gerekir. Overstay, vize ihlali veya sınır dışı edilme geçmişi varsa cascade hakkı kullanılamaz.' },
    },
    {
      '@type': 'Question',
      name: '5 yıllık Schengen vizesi almak için kaç kez vize kullanmak gerekiyor?',
      acceptedAnswer: { '@type': 'Answer', text: 'Kademeli sistem şöyle işler: İlk başvuru → tek veya çift girişli kısa süreli vize. Ardından: 6 aylık çok girişli → 1 yıllık çok girişli → 3 yıllık çok girişli → 5 yıllık çok girişli. Her kademe için bir önceki vizeyi kurallara uygun kullanmış olmak şarttır.' },
    },
    {
      '@type': 'Question',
      name: 'Farklı Schengen ülkelerindeki vizeler cascade için sayılıyor mu?',
      acceptedAnswer: { '@type': 'Answer', text: 'Evet. Hangi Schengen ülkesinden alınmış olursa olsun tüm Schengen vizeleri cascade zincirinde sayılır. Almanya\'dan 1 yıllık vize aldıysanız, bir sonraki başvurunuzu İtalya\'ya yapabilir ve 3 yıllık vize hakkından faydalanabilirsiniz.' },
    },
    {
      '@type': 'Question',
      name: 'Cascade kural pasaport yenilenmesi veya süre aşımında bozuluyor mu?',
      acceptedAnswer: { '@type': 'Answer', text: 'Pasaport yenilemek cascade zincirini bozmaz; eski pasaport ve yeni başvuru birlikte sunulur. Ancak aradan 3 yıldan fazla geçmesi veya vize ihlali cascade haklarını sıfırlayabilir.' },
    },
  ],
};

const KADEME = [
  { kademe: '1. Kademe', sure: 'İlk başvuru', vize: 'Tek/çift girişli, kısa süreli', sart: 'Genel Schengen şartları' },
  { kademe: '2. Kademe', sure: '6 aylık çok girişli', vize: 'Multiple-entry, 6 ay geçerli', sart: '1. kademede ihlalsiz kullanım' },
  { kademe: '3. Kademe', sure: '1 yıllık çok girişli', vize: 'Multiple-entry, 1 yıl geçerli', sart: '2. kademede ihlalsiz kullanım' },
  { kademe: '4. Kademe', sure: '3 yıllık çok girişli', vize: 'Multiple-entry, 3 yıl geçerli', sart: '3. kademede ihlalsiz kullanım' },
  { kademe: '5. Kademe', sure: '5 yıllık çok girişli', vize: 'Multiple-entry, 5 yıl geçerli', sart: '4. kademede ihlalsiz kullanım' },
];

export default function CascadeKurali() {
  return (
    <BlogPostLayout post={POST} schema={[ARTICLE_SCHEMA, FAQ_SCHEMA]}>

      <p className="text-slate-700 leading-relaxed text-base mb-6">
        15 Temmuz 2025'te yürürlüğe giren ve Türk vize tarihindeki en olumlu gelişme olarak
        nitelendirilen <strong>Cascade kuralı</strong>, dürüst vize sicili olan her Türk vatandaşına
        sistematik biçimde daha uzun ve daha güçlü vize kapısı açıyor. Büromuzdaki en sık sorulan
        soru artık "vize alabilir miyim?" değil, "bir sonraki kademede hangi vizeyi alacağım?"
        oldu. Bu rehber her sorunuzu yanıtlıyor.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Cascade Kuralı Nedir?</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Avrupa Komisyonu'nun C(2025) 4694 sayılı kararıyla hayata geçen Cascade kuralı, Schengen
        Vize Kodu'na eklenen bir zorunluluktur: konsolosluklar, önceki vizelerini kurallara uygun
        kullanan başvurucuya bir sonraki başvuruda <em>daha uzun süreli çok girişli vize vermekle
        yükümlüdür.</em> Bu bir tercih değil, hukuki zorunluluktur.
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-blue-800 text-sm leading-relaxed">
          Cascade kuralı yalnızca Türk vatandaşlarına özgü değil; Schengen bölgesinin tüm
          üçüncü ülke vatandaşlarına uygulanan evrensel bir kuraldır. Türkiye bu kuraldan
          özellikle güçlü faydalanıyor çünkü Türk başvurucular 2024'te 993.875 onay alarak
          dünyada 2. sıraya yerleşti — büyük bir geçmiş veritabanı oluştu.
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Kademeli Vize Sistemi: 5 Basamak</h2>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-brand-600 text-white">
              <th className="text-left p-3 rounded-tl-lg font-semibold">Kademe</th>
              <th className="text-left p-3 font-semibold">Süre</th>
              <th className="text-left p-3 font-semibold">Vize Türü</th>
              <th className="text-left p-3 rounded-tr-lg font-semibold">Şart</th>
            </tr>
          </thead>
          <tbody>
            {KADEME.map((k, i) => (
              <tr key={k.kademe} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                <td className="p-3 font-semibold text-brand-700">{k.kademe}</td>
                <td className="p-3 text-slate-700">{k.sure}</td>
                <td className="p-3 text-slate-700">{k.vize}</td>
                <td className="p-3 text-slate-600 text-xs">{k.sart}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">"Kurallara Uygun Kullanım" Ne Demek?</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Cascade'e hak kazanmak için bir önceki vizenin <strong>ihlalsiz</strong> kullanılmış
        olması şart. İhlal sayılan durumlar:
      </p>
      <ul className="space-y-2 mb-6">
        {[
          'Overstay: İzin verilen 90 günü aşmak',
          'Yanlış ülkede bulunmak: Ana giriş ülkesi dışında orantısız süre geçirmek',
          'Çalışma yasağı ihlali: Turist vizesiyle çalışmak',
          'Sınır dışı edilme veya entry ban kaydı',
          'Vize başvurusunda sahte belge kullanımı',
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-6 flex gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <p className="text-emerald-800 text-sm leading-relaxed">
          Vizesini kurallara uygun kullananlar için cascade <strong>otomatik hak</strong>tır.
          Ayrıca başvuru yapmanıza gerek yok; konsolosluk sistemi önceki vizeleri kontrol eder
          ve bir sonraki kademede vize vermekle yükümlüdür.
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Pratikte Cascade: Gerçek Senaryolar</h2>
      <div className="space-y-4 mb-8">
        {[
          {
            senaryo: 'Senaryo A: İlk kez başvuruyor',
            detay: 'Aslı Hanım daha önce hiç Schengen vizesi almamış. 2026\'da İtalya\'ya başvurdu, 15 günlük tek girişli vize aldı ve kurallara uygun döndü. Bir sonraki başvuruda 6 aylık çok girişli vize hakkı doğdu.',
          },
          {
            senaryo: 'Senaryo B: 6 aylık vizeden 1 yıllığa',
            detay: 'Mehmet Bey 2025\'te Yunanistan\'tan 6 aylık çok girişli vize aldı, 3 kez gidip geldi ve ihlal yaşamadı. 2026\'daki başvurusunda Fransa 1 yıllık çok girişli vize vermek zorunda.',
          },
          {
            senaryo: 'Senaryo C: Farklı ülkeler arası cascade',
            detay: 'Zeynep Hanım 2024\'te Almanya\'dan 1 yıllık vize aldı, 2026\'da İspanya\'ya başvurdu. Önceki Almanya vizesi cascade zincirinde sayılır; İspanya 3 yıllık vize vermekle yükümlü.',
          },
        ].map(({ senaryo, detay }) => (
          <div key={senaryo} className="bg-white border border-slate-200 rounded-xl p-4 text-sm">
            <p className="font-semibold text-slate-800 mb-1">{senaryo}</p>
            <p className="text-slate-600 leading-relaxed">{detay}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Cascade ile Başvururken Belgeler</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Cascade hakkından faydalanmak için standart Schengen belgelerine ek olarak:
      </p>
      <ul className="space-y-2 mb-8">
        {[
          'Önceki pasaport(lar) — tüm vize damgaları ve giriş-çıkış damgaları görünmeli',
          'E-Devlet\'ten yurda giriş-çıkış belgesi (2009\'dan bu yana tüm geçişler)',
          'Önceki Schengen vizelerini listeleyen özet (tek sayfada visa no, ülke, tarih)',
          'Son başvuruda overstay yapılmadığının kanıtı (çıkış damgası veya e-Devlet belgesi)',
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">EES ile Cascade Kombinasyonu</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Nisan 2026'da devreye giren <strong>EES (Entry/Exit System)</strong> sistemi, pasaport
        damgası yerine dijital kayıt kullanıyor. Bu cascade açısından şu anlama geliyor:
        Giriş-çıkış geçmişiniz artık biyometrik olarak merkezi sistemde kayıtlı. Konsolosluklar
        bu sisteme erişerek overstay kontrolü yapıyor. Dolayısıyla "damga yoktu, bilmiyorlar"
        düşüncesi artık geçersiz; her geçiş kayıt altında.
      </p>

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
        <h3 className="font-bold text-brand-900 mb-2">Cascade Kuralı: Dürüst Davranana En Büyük Ödül</h3>
        <p className="text-brand-800 text-sm leading-relaxed">
          Türkiye'de yılda 1,17 milyon Schengen başvurusu yapılıyor. Cascade kuralıyla bu
          başvurucuların büyük çoğunluğu zamanla 3-5 yıllık vizeye kavuşacak — bu Schengen
          tarihinde görülmemiş bir esneme. Tek şart: ihlalsiz, düzenli, planlı kullanım.
          Pasaportunuzu damga doldururken cascade zincirini de inşa ediyorsunuz.
        </p>
      </div>

    </BlogPostLayout>
  );
}
