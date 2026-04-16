import React from 'react';
import { AlertTriangle, CheckCircle2, Info, ShieldCheck } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'dubai-evize-mi-kapida-vize-mi',
  title: 'Dubai E-Vize mi, Kapıda Vize mi Daha Avantajlı? 2026 Güncel Karşılaştırma',
  description: 'Dubai\'ye gidecek Türk vatandaşları için e-vize ve kapıda vize arasındaki farklar: maliyet, süre, riskler ve hangi durumda hangisi tercih edilmeli?',
  category: 'Dubai',
  readingTime: 6,
  date: '2026-04-16',
  tags: ['Dubai vizesi', 'e-vize', 'kapıda vize', 'UAE', 'Dubai seyahati'],
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: POST.title,
  description: POST.description,
  author: { '@type': 'Organization', name: 'VizeAkıl', url: 'https://vizeakil.com' },
  publisher: { '@type': 'Organization', name: 'VizeAkıl' },
  datePublished: POST.date,
  dateModified: POST.date,
  url: `https://vizeakil.com/blog/${POST.slug}`,
};

type Kazanan = 'evize' | 'kapida' | 'esit';

const KIYASLAMA: Array<{
  kriter: string;
  evize: string;
  kapida: string;
  kazanan: Kazanan;
}> = [
  {
    kriter: 'Ücret',
    evize: '~$90-110 (30 gün, tek giriş)',
    kapida: 'Ücretsiz (Türk pasaportu)',
    kazanan: 'kapida',
  },
  {
    kriter: 'Süre',
    evize: '30 gün (uzatılabilir)',
    kapida: '30 gün (uzatılabilir)',
    kazanan: 'esit',
  },
  {
    kriter: 'Giriş hakkı',
    evize: 'Tek veya çok girişli seçenek',
    kapida: 'Tek giriş (genelde)',
    kazanan: 'evize',
  },
  {
    kriter: 'Önceden onay',
    evize: 'Evet, uçmadan önce onaylı',
    kapida: 'Havalimanında verilir',
    kazanan: 'evize',
  },
  {
    kriter: 'Risk',
    evize: 'Minimum (onaylı geliyor)',
    kapida: 'Kapıda reddedilme riski (nadir)',
    kazanan: 'evize',
  },
  {
    kriter: 'Esneklik',
    evize: 'Tarih değişikliğinde yeni başvuru',
    kapida: 'Herhangi bir günde gidebilirsiniz',
    kazanan: 'kapida',
  },
  {
    kriter: 'İşlem süresi',
    evize: '1-3 iş günü',
    kapida: 'Havalimanında anında',
    kazanan: 'kapida',
  },
];

export default function DubaiEvizeKapiVize() {
  return (
    <BlogPostLayout post={POST} schema={SCHEMA}>

      <p className="text-slate-700 leading-relaxed text-base mb-6">
        Türk pasaportu, Dubai (BAE) için kapıda vize imkânı sunar. Bu ücretsiz bir kolaylık.
        Peki o zaman neden e-vize başvurusu yapsınız? Cevap: her seyahat aynı değildir.
        İş toplantısı, turizm, çocukluk festivali, kısa bağlantı — bunların her biri
        farklı vize seçimini uygun kılar. Bu rehberde her iki seçeneği derinlemesine
        karşılaştırıyoruz.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Türk Pasaportuyla Dubai'ye Kapıda Vize Hakkı Var mı?</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Evet. Türkiye Cumhuriyeti pasaport sahipleri Dubai Havalimanı'nda (ve diğer BAE
        havalimanlarında) <strong>ücretsiz kapıda vize</strong> alabilmektedir. Bu vize
        genellikle 30 gün geçerliliğe sahiptir ve gerektiğinde uzatılabilir.
      </p>
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-6 flex gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <p className="text-emerald-800 text-sm leading-relaxed">
          <strong>2026 Güncel Durum:</strong> Türk pasaportu BAE'nin kapıda vize listesinde
          yer almaya devam etmektedir. Ancak seyahat öncesi BAE Dışişleri Bakanlığı veya
          havayolu şirketinin güncel bildirimini kontrol edin; anlaşmalar değişebilir.
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">E-Vize ve Kapıda Vize: Kapsamlı Karşılaştırma</h2>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700">
              <th className="text-left p-3 rounded-tl-lg font-semibold">Kriter</th>
              <th className="text-left p-3 font-semibold">E-Vize</th>
              <th className="text-left p-3 rounded-tr-lg font-semibold">Kapıda Vize</th>
            </tr>
          </thead>
          <tbody>
            {KIYASLAMA.map(({ kriter, evize, kapida, kazanan }, i) => (
              <tr key={kriter} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                <td className="p-3 font-medium text-slate-700">{kriter}</td>
                <td className={`p-3 ${kazanan === 'evize' ? 'text-emerald-700 font-semibold' : 'text-slate-600'}`}>{evize}</td>
                <td className={`p-3 ${kazanan === 'kapida' ? 'text-emerald-700 font-semibold' : 'text-slate-600'}`}>{kapida}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Hangi Durumda Hangisi?</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm">
          <p className="font-semibold text-blue-800 mb-3">E-Vize tercih edin eğer:</p>
          <ul className="space-y-2 text-blue-700">
            {[
              'İş seyahati yapıyorsunuz ve onayı belgeleyen bir vize numaranız olsun istiyorsunuz',
              'Birden fazla giriş-çıkış planlıyorsunuz',
              'Vize durumunu önceden netleştirmek istiyorsunuz (kaygılı profil)',
              'BAE\'de uzun süre kalmayı (30+ gün) planlıyorsunuz',
              'Havayolunuz check-in öncesi vize sorabilir',
            ].map((i) => (
              <li key={i} className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0"/>{i}</li>
            ))}
          </ul>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm">
          <p className="font-semibold text-emerald-800 mb-3">Kapıda vize yeterli eğer:</p>
          <ul className="space-y-2 text-emerald-700">
            {[
              'Saf turistik seyahat, 30 gün veya daha az',
              'Plan değiştirebilir; tarih esnekliği istiyorsunuz',
              'Tasarruf etmek istiyorsunuz (~100$ fark)',
              'Transit veya kısa bağlantı durumu',
              'Temiz seyahat geçmişine sahipsiniz',
            ].map((i) => (
              <li key={i} className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0"/>{i}</li>
            ))}
          </ul>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Kapıda Vize Reddedilir mi?</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Nadir olmakla birlikte evet, reddedilebilir. Risk faktörleri:
      </p>
      <ul className="space-y-2 mb-6">
        {[
          'Kısa süreli çok sık Dubai ziyareti (6 ayda 3+ kez)',
          "Geçmişte BAE'de uzun kalma ihlali (overstay)",
          'Güvenlik kaydı veya siyasi hassasiyet',
          'İsrail damgalı pasaport (BAE 2020 sonrası bu kısıtlamayı kaldırdı ancak bazı vakalarda sorun yaşanabilir)',
          'Yeterli finansal kaynak gösterilememesi (havalimanında sorulabilir)',
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-blue-800 text-sm leading-relaxed">
          Bu risk faktörlerinden biri sizin için geçerliyse <strong>e-vize önceden alın.</strong>
          Uçuş, otel ve transfer harcaması yaptıktan sonra kapıda ret yaşamak çok daha maliyetlidir.
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">E-Vize Nasıl Alınır?</h2>
      <div className="space-y-2 mb-8 text-sm text-slate-700">
        {[
          '1. BAE Federal İçişleri Bakanlığı resmi portalından veya Emirates/FlyDubai web sitesinden başvurun',
          '2. Pasaport taraması, fotoğraf ve ödeme yeterlidir (belge gereksinimi minimal)',
          '3. Genellikle 1-3 iş günü içinde e-posta ile onay gelir',
          '4. Onay belgesini yazdırın veya telefonda hazır tutun',
        ].map((s) => (
          <p key={s} className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {s}
          </p>
        ))}
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-8 flex gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-emerald-800 text-sm mb-1">Danışman İpucu: Çok Girişli E-Vize</p>
          <p className="text-emerald-700 text-sm leading-relaxed">
            Dubai'ye sık gidiyorsanız (yılda 2+) 90 gün çok girişli e-vize seçeneğini
            değerlendirin. Maliyet daha yüksek ama her seyahat öncesi ayrı vize almak
            yerine bir kez başvurup yıl boyunca özgürce gidip gelebilirsiniz.
          </p>
        </div>
      </div>

      <div className="mt-12 bg-brand-50 border border-brand-200 rounded-2xl p-6">
        <h3 className="font-bold text-brand-900 mb-2">Karar: Bağlam Belirler</h3>
        <p className="text-brand-800 text-sm leading-relaxed">
          Sade bir turistik Dubai ziyareti için kapıda vize hem pratik hem de ücretsizdir.
          Sık giden, iş odaklı veya önceden plan netliği isteyen biri için e-vize güvenli
          ve akıllıca bir seçimdir. İkisi de yasal ve kabul görmüştür — durum gerektireni seçin.
        </p>
      </div>

    </BlogPostLayout>
  );
}
