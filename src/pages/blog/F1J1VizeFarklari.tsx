import React from 'react';
import { AlertTriangle, CheckCircle2, Info, ShieldCheck } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'f1-j1-vizesi-farklari',
  title: 'Amerika F-1 (Öğrenci) ve J-1 (Work and Travel) Vizesi Arasındaki Farklar',
  description: 'ABD F-1 öğrenci vizesi ile J-1 Work and Travel vizesinin farklılıkları: kimler başvurabilir, izin verilen çalışma hakları, süre, SEVIS ücreti ve Türk gençleri için ipuçları.',
  category: 'ABD',
  readingTime: 9,
  date: '2026-04-16',
  tags: ['F-1 vizesi', 'J-1 vizesi', 'Work and Travel', 'öğrenci vizesi', 'ABD'],
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: POST.title,
  description: POST.description,
  author: { '@type': 'Organization', name: 'VizeAkıl', url: 'https://vizeakil.com' },
  publisher: { '@type': 'Organization', name: 'VizeAkıl', logo: { '@type': 'ImageObject', url: 'https://vizeakil.com/og-image.png' } },
  datePublished: POST.date,
  dateModified: POST.date,
  url: `https://vizeakil.com/blog/${POST.slug}`,
};

const KIYASLAMA = [
  { kriter: 'Amaç', f1: 'ABD\'de tam zamanlı akademik eğitim', j1: 'Kültürel değişim; çalışma ve seyahat' },
  { kriter: 'Kimler başvurabilir?', f1: 'ABD üniversitelerine kabul alan öğrenciler', j1: 'Türk üniversitesi öğrencisi (çoğunlukla 2-4. sınıf)' },
  { kriter: 'Sponsor', f1: 'Üniversite (DSO ataması)', j1: 'Onaylı J-1 sponsor kuruluş (State Dept onaylı)' },
  { kriter: 'Çalışma izni', f1: 'Kampüs içi sınırlı, OPT/CPT ile kampüs dışı', j1: 'Sponsor gözetiminde belirli iş yerlerinde yasal' },
  { kriter: 'Geçerlilik süresi', f1: 'Eğitim süresi + 60 gün grace', j1: 'Genellikle 4-6 ay (yaz sezonu)' },
  { kriter: 'SEVIS ücreti', f1: '$350', j1: '$220' },
  { kriter: 'Mülakat', f1: 'Zorunlu', j1: 'Zorunlu' },
  { kriter: 'Geri dönüş şartı', f1: 'Yasal yükümlülük değil ama güçlü bağ beklenir', j1: '212(e) kuralı: bazı durumlarda 2 yıl Türkiye\'de kalma zorunluluğu' },
  { kriter: 'Ücret / maliyet', f1: 'Yüksek (eğitim + yaşam)', j1: 'Orta (program ücreti + bilet)' },
];

export default function F1J1VizeFarklari() {
  return (
    <BlogPostLayout post={POST} schema={SCHEMA}>

      <p className="text-slate-700 leading-relaxed text-base mb-6">
        "F-1 mi alayım, J-1 mi?" Bu soru her yıl yüzlerce Türk genç tarafından soruluyor.
        Görünürde iki vizede de Amerika var, ama temelden farklı amaçlara hizmet ediyorlar.
        Yanlış vize türüyle gitmek hem hukuki hem finansal sorunlara yol açabilir. Kararınızı
        net bir karşılaştırmayla verin.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Temel Fark: Amaç</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm">
          <p className="font-bold text-blue-800 text-base mb-3">F-1 Öğrenci Vizesi</p>
          <p className="text-blue-700 leading-relaxed">
            Bir ABD üniversitesi veya dil okuluyla <strong>tam zamanlı kayıtlı öğrenci</strong>
            olmak için verilen vize kategorisidir. Önce ABD'deki okula kabul alınır, ardından
            vize başvurusu yapılır. Eğitim süresi boyunca ABD'de yasal ikamet hakkı tanır.
          </p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm">
          <p className="font-bold text-amber-800 text-base mb-3">J-1 Work and Travel</p>
          <p className="text-amber-700 leading-relaxed">
            Kültürel değişim programı vizesidir. Türk üniversite öğrencileri ABD'de <strong>yaz
            döneminde çalışıp, seyahat edebilir.</strong> Sponsor kuruluş üzerinden başvurulur;
            çalışma yasal sınırlar içinde yapılır.
          </p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Detaylı Karşılaştırma Tablosu</h2>
      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700">
              <th className="text-left p-3 rounded-tl-lg font-semibold">Kriter</th>
              <th className="text-left p-3 font-semibold text-blue-700">F-1</th>
              <th className="text-left p-3 rounded-tr-lg font-semibold text-amber-700">J-1 (W&T)</th>
            </tr>
          </thead>
          <tbody>
            {KIYASLAMA.map(({ kriter, f1, j1 }, i) => (
              <tr key={kriter} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                <td className="p-3 font-medium text-slate-700">{kriter}</td>
                <td className="p-3 text-slate-600">{f1}</td>
                <td className="p-3 text-slate-600">{j1}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">J-1'deki 212(e) Kuralı: Dikkat!</h2>
      <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-8 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-red-800 text-sm mb-1">212(e) İki Yıl Kuralı</p>
          <p className="text-red-700 text-sm leading-relaxed">
            Bazı J-1 programları, katılımcının programdan sonra <strong>ülkesinde en az 2 yıl
            ikamet etmesi</strong> şartını (INA 212(e)) getirir. Bu şart yerine getirilmeden
            ABD'ye göçmen veya geçici çalışma vizesi alınamaz. J-1 programınızın bu şarta
            tabi olup olmadığını sponsor kuruluşunuzdan öğrenin. Waiver (muafiyet) başvurusu
            zor ve uzun bir süreçtir.
          </p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Çalışma Hakları: F-1 ve J-1 Farkı</h2>
      <div className="space-y-4 mb-8">
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-sm">
          <p className="font-semibold text-slate-800 mb-2">F-1 Çalışma Hakları</p>
          <ul className="space-y-1 text-slate-600">
            <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0"/>Kampüs içi iş: haftada 20 saat, sömestr; 40 saat, tatil</li>
            <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0"/>CPT (Curricular Practical Training): staj, programla ilgili olmak şartıyla</li>
            <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0"/>OPT (Optional Practical Training): mezuniyet sonrası 12 ay, STEM'de 36 ay</li>
            <li className="flex items-start gap-1.5"><AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0"/>Kampüs dışı izinsiz çalışmak yasadışı ve vize iptali sebebidir</li>
          </ul>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-sm">
          <p className="font-semibold text-slate-800 mb-2">J-1 Çalışma Hakları (W&T)</p>
          <ul className="space-y-1 text-slate-600">
            <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0"/>Sponsor onaylı iş yerlerinde çalışma yasal</li>
            <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0"/>Resmi sözleşme ve Social Security Number alma hakkı</li>
            <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0"/>Program sonrası 30 gün seyahat süresi</li>
            <li className="flex items-start gap-1.5"><AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0"/>Sponsor dışı iş yerinde çalışmak yasak</li>
          </ul>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Türk Gençler Hangi Durumda Hangisini Seçmeli?</h2>
      <div className="space-y-3 mb-8">
        {[
          { s: 'ABD\'de 4 yıl lisans veya yüksek lisans okumak istiyorum', c: 'F-1 Vizesi. Kabul aldıktan sonra süreç başlar. En önemli belge I-20 formu.' },
          { s: 'Yaz tatilimde Amerika\'yı görmek ve çalışmak istiyorum', c: 'J-1 Work and Travel. Türk üniversitesine kayıtlı olmanız yeterli. Sponsor kuruluş tüm süreci yönetir.' },
          { s: 'Dil okulu için 3-6 ay gidiyorum', c: 'F-1 (dil okulu I-20\'si ile). Çok kısa süreler için B-2 de değerlendirilebilir ama çalışma izni vermez.' },
          { s: 'ABD\'de çalışıp para biriktirip gezmek istiyorum', c: 'J-1 Work and Travel. F-1 bu amaca hizmet etmez.' },
          { s: 'Mezuniyet sonrası ABD\'de çalışmak istiyorum', c: 'F-1 + OPT. J-1 sonrası çalışma vizesi geçişi 212(e) nedeniyle zorlaşabilir.' },
        ].map(({ s, c }) => (
          <div key={s} className="bg-white border border-slate-200 rounded-xl p-4 text-sm">
            <p className="font-semibold text-slate-800 mb-1">"{s}"</p>
            <p className="text-slate-600 leading-relaxed">{c}</p>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-blue-800 text-sm leading-relaxed">
          <strong>SEVIS Ücreti:</strong> Her iki vizede de SEVIS (Öğrenci ve Ziyaretçi Bilgi Sistemi)
          ücreti ödenir. F-1 için $350, J-1 için $220. Bu ücret vize ücretine ek olup,
          online ödeme sonrası mülakatta makbuzu sunmanız gerekir.
        </p>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-8 flex gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-emerald-800 text-sm mb-1">Danışman İpucu: J-1 İçin Sponsor Seçimi</p>
          <p className="text-emerald-700 text-sm leading-relaxed">
            Türkiye'de CIEE, AIESEC, Work & Travel USA gibi birçok onaylı J-1 sponsor kuruluşu
            faaliyet gösteriyor. Seçeceğiniz sponsor iş bulma garantisi, destek kalitesi ve
            program ücreti açısından ciddi farklılıklar gösterir. Birden fazla kuruluşla
            görüşün, referansları kontrol edin.
          </p>
        </div>
      </div>

      <div className="mt-12 bg-brand-50 border border-brand-200 rounded-2xl p-6">
        <h3 className="font-bold text-brand-900 mb-2">Özet: Amacınız Vizinizi Belirler</h3>
        <p className="text-brand-800 text-sm leading-relaxed">
          F-1 uzun vadeli akademik kariyer için, J-1 kısa vadeli deneyim ve kültürel değişim için
          tasarlanmıştır. İkisini karıştırmayın; her birinin yasal sınırları var. Hangi vizede
          hangi haklarınız ve yükümlülükleriniz olduğunu bilmeden hareket etmek hem vize
          iptali hem de uzun vadeli ABD vize geçmişinizi olumsuz etkileyebilir.
        </p>
      </div>

    </BlogPostLayout>
  );
}
