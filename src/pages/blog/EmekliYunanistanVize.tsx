import React from 'react';
import { AlertTriangle, CheckCircle2, Info, ShieldCheck } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'emekli-yunanistan-kapi-vizesi-2026',
  title: 'Emekliler için Yunanistan Kapı Vizesi: Gerekli Evraklar ve Püf Noktalar 2026',
  description: 'Schengen vizesi olmayan Türk emekliler için Yunanistan adaları kapı vizesi (border visa) süreci, gerekli belgeler, kaç günlük alınır ve dikkat edilmesi gerekenler.',
  category: 'Schengen',
  readingTime: 7,
  date: '2026-04-16',
  tags: ['emekli', 'Yunanistan', 'kapı vizesi', 'border visa', 'ada turu'],
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

const BELGELER = [
  'Geçerli pasaport (min. 3 ay geçerliliği, vize süresini aşan)',
  'Biyometrik fotoğraf (35×45 mm, beyaz arka fon)',
  'Dönüş bileti veya rezervasyonu (gemi/uçak)',
  'Seyahat sağlık sigortası (min. 30.000 €, Yunanistan dahil)',
  'Konaklama kanıtı (otel, pansion rezervasyonu)',
  'Emekli maaşı belgesi (SGK veya banka dekonu)',
  'Son 3 aylık banka hesap dökümü',
  'Nakit para (kapıda €30-50 harç ücreti istenebilir)',
];

const KAPILARI = [
  { ada: 'Rodos (Rhodes)', gemi: 'Bodrum veya Marmaris feribot', sure: 'Günlük veya sezonluk' },
  { ada: 'Kos (İstanköy)', gemi: 'Bodrum feribot', sure: 'Günlük veya çok günlük' },
  { ada: 'Sakız (Chios)', gemi: 'Çeşme feribot', sure: 'Günlük veya çok günlük' },
  { ada: 'Midilli (Lesbos)', gemi: 'Dikili veya Ayvalık feribot', sure: 'Günlük veya çok günlük' },
  { ada: 'Samos', gemi: 'Kuşadası feribot', sure: 'Günlük veya çok günlük' },
];

export default function EmekliYunanistanVize() {
  return (
    <BlogPostLayout post={POST} schema={SCHEMA}>

      <p className="text-slate-700 leading-relaxed text-base mb-6">
        Ege'nin mavisi tam kapı komşunuzda duruyor; üstelik bir sabah vapuruyla geçilebilir.
        Yunanistan'ın Türkiye'ye yakın adaları (Rodos, Kos, Sakız, Midilli…) Türk vatandaşlarına
        <strong> kapı vizesi</strong> imkânı sunmaktadır. Emekliler için bu fırsat özellikle
        cazip: konsolosluk randevusu yok, haftalarca bekleme yok. Peki belgeler ne, süreç nasıl
        işliyor? Tüm gerçekleri aktarıyoruz.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Kapı Vizesi Nedir, Herkes Alabilir mi?</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Yunanistan'ın belirli sınır kapılarında (ağırlıklı olarak ada iskeleleri) sunduğu bu vize,
        Schengen Vize Kodu'nun 35. maddesi kapsamında "sınırda verilen geçici vize" statüsündedir.
        <strong>Tek girişli, maksimum 15 gün</strong> geçerli olarak verilir. Her ada için
        geçerlidir; Yunanistan anakarasına geçiş ayrı bir Schengen vizesi gerektirir.
      </p>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-800 text-sm mb-1">Dikkat: Sezonluk Uygulama</p>
          <p className="text-amber-700 text-sm leading-relaxed">
            Kapı vizesi uygulaması <strong>yalnızca yaz sezonu (Nisan–Ekim)</strong> aktif
            tutulmaktadır. Kış aylarında sefer sayısı azaldığı gibi kapı vizesi de kısıtlanabilir.
            Seyahat planınızı buna göre yapın.
          </p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Hangi Kapılardan Alınır?</h2>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700">
              <th className="text-left p-3 rounded-tl-lg font-semibold">Ada</th>
              <th className="text-left p-3 font-semibold">Türkiye'den Gemi</th>
              <th className="text-left p-3 rounded-tr-lg font-semibold">Vize Süresi</th>
            </tr>
          </thead>
          <tbody>
            {KAPILARI.map((k, i) => (
              <tr key={k.ada} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                <td className="p-3 font-medium text-slate-800">{k.ada}</td>
                <td className="p-3 text-slate-600">{k.gemi}</td>
                <td className="p-3 text-slate-600">{k.sure}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Gerekli Belgeler</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Kapıda hazır bulunması gereken belgeler konsolosluk başvurusuna kıyasla daha kısa ama
        eksik sunulan her belge sizi adanın iskelesinde mahkum edebilir. Önceden hazırlayın:
      </p>
      <ul className="space-y-2 mb-8">
        {BELGELER.map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Emekli Maaşı Belgesi: Ne Yeterli, Ne Yetersiz?</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Emekli maaşı belgesi hem gelir hem de Türkiye'ye dönüş güvencesi açısından son derece
        değerlidir. Yunan sınır görevlisi aşağıdakilere bakacak:
      </p>
      <div className="space-y-3 mb-8">
        {[
          { label: 'Aylık net emekli maaşı', detail: 'SGK emekli maaş dökümü veya banka hesabına düzenli yatan maaş transferleri. Min. €500/ay civarı güven verici kabul edilir.' },
          { label: 'Banka bakiyesi', detail: 'Kapıda beklenen bakiye belirli bir eşik değil ama günlük €50-80 harcama kapasitesi (toplam seyahat süresini karşılar) makul görülür.' },
          { label: 'Sağlık sigortası', detail: 'Emeklilerin genel sağlık sigortası (SGK kapsamı) Avrupa\'da geçerli değildir. Ayrıca özel seyahat sağlık sigortası zorunludur.' },
        ].map(({ label, detail }) => (
          <div key={label} className="bg-white border border-slate-200 rounded-xl p-4 text-sm">
            <p className="font-semibold text-slate-800 mb-1">{label}</p>
            <p className="text-slate-600 leading-relaxed">{detail}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Kapıda Vize Süreci Nasıl İşler?</h2>
      <div className="space-y-3 mb-8">
        {[
          { n: '1', s: 'Feribot veya motora binin', d: 'Gemiye binmeden önce bilet, pasaport ve belgelerinizi hazır tutun. Bazı hatlar Türk tarafında ön kontrol yapar.' },
          { n: '2', s: 'Yunan iskelesinde imigrason', d: 'Sınır polisi pasaport, sigorta, konaklama ve dönüş biletini inceler. Ortalama 20-40 dakika sürer, yoğun sezonda 1-2 saat uzayabilir.' },
          { n: '3', s: 'Vize harcı', d: '€30-50 arası, nakit Avro ile ödenir. Kart kabul edilmeyebilir — yanınızda nakit olsun.' },
          { n: '4', s: 'Vize damgası', d: 'Pasaportunuza "D (border)" kategorisi ile vize damgası vurulur. Geçerlilik süresi genellikle 15 gün veya dönüş tarihinizdir.' },
        ].map(({ n, s, d }) => (
          <div key={n} className="flex gap-3 text-sm">
            <span className="w-7 h-7 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold shrink-0 text-xs mt-0.5">{n}</span>
            <div>
              <p className="font-semibold text-slate-800 mb-1">{s}</p>
              <p className="text-slate-600 leading-relaxed">{d}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-blue-800 text-sm leading-relaxed">
          <strong>Sıkça Sorulan:</strong> Kapı vizesiyle Yunanistan'dan başka Schengen ülkesine
          geçebilir miyim? <strong>Hayır.</strong> Kapı vizesi yalnızca verilen adada ve
          Yunanistan'ın o bölgesinde geçerlidir. Başka bir Schengen ülkesine geçmek için
          ayrıca konsolosluktan Schengen vizesi almanız gerekir.
        </p>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-8 flex gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-emerald-800 text-sm mb-1">Deneyimli Danışman Notu</p>
          <p className="text-emerald-700 text-sm leading-relaxed">
            Rodos ve Kos en rahat kapı vizesi deneyimini sunar. Tesis yoğunluğu yüksek,
            Türkçe bilen personel mevcut ve iskeleler düzenli. Sakız ve Midilli daha sakin
            ama sefer sayısı az. Ekim sonrasına bırakmayın — sefer takvimleri daralır.
          </p>
        </div>
      </div>

      <div className="mt-12 bg-brand-50 border border-brand-200 rounded-2xl p-6">
        <h3 className="font-bold text-brand-900 mb-2">Kısa Özet</h3>
        <p className="text-brand-800 text-sm leading-relaxed">
          Yunanistan kapı vizesi emekliler için pratik ve ulaşılabilir bir Avrupa deneyimi kapısı.
          Emekli maaşı belgesi, 30.000 € sigorta ve dönüş bileti üçlüsü eksiksiz hazır olduğunda
          süreç genellikle sorunsuz ilerler. Nakit avro, sağlık sigortası ve fotoğrafı unutmayın;
          sabah erken vapura binin — hem kuyruk az hem de günü tam yaşarsınız.
        </p>
      </div>

    </BlogPostLayout>
  );
}
