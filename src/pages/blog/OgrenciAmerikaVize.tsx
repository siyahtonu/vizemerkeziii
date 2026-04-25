import React from 'react';
import { AlertTriangle, CheckCircle2, Info, ShieldCheck } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'ogrenci-sponsorsuz-amerika-turist-vizesi',
  title: 'Öğrenciler için Sponsorsuz Amerika Turist Vizesi (B-2) Alma Rehberi 2026',
  description: 'Kendi başına başvuran üniversite öğrencileri için ABD B-2 turist vizesi: DS-160, mülakat taktikleri, Türkiye bağını güçlendirme ve sık reddedilme sebepleri.',
  category: 'ABD',
  readingTime: 10,
  date: '2026-04-16',
  tags: ['öğrenci', 'Amerika vizesi', 'B-2', 'turist vizesi', 'sponsorsuz'],
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

const BELGELER = [
  'Geçerli pasaport (en az 6 ay geçerlilik)',
  'DS-160 onay sayfası (barkodlu)',
  'Fotoğraf (5×5 cm, beyaz arka fon, son 6 aydan)',
  'Mülakat randevu onay belgesi',
  'Vize ücret makbuzu (MRV fee)',
  'Öğrenci belgesi (aktif kayıtlı olduğunuzu gösterir)',
  'Transkript (başarılı akademik geçmiş, geri dönme güdüsü)',
  'Okul dönemi takvimi (tatil döneminde başvuruluyorsa daha güçlü)',
  'Son 3-6 aylık kendi veya aile banka dökümü',
  'Aile gelir belgesi (anne-baba maaş bordrosu)',
  'Türkiye\'deki kayıtlı adres belgesi',
  'Varsa önceki vize ve seyahat geçmişi',
];

export default function OgrenciAmerikaVize() {
  return (
    <BlogPostLayout post={POST} schema={SCHEMA}>

      <p className="text-slate-700 leading-relaxed text-base mb-6">
        "Öğrenciyim, sponsorum yok, Amerika vizesi alabilir miyim?" Bu soruyu büyük ihtimalle
        bir arkadaşınızdan ret haberi aldıktan sonra sordunuz. Gerçek şu: ABD konsolosluğu
        öğrencilere karşı sistematik bir önyargıyla çalışıyor — çünkü kalma riski, düşük gelir
        ve belirsiz geri dönüş niyeti bir arada görülüyor. Ama bu, vizesi alınamaz anlamına
        gelmiyor. <strong>Doğru anlatı ve doğru belgelerle öğrenciler de B-2 vizesi alabilir.</strong>
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Konsolosluğun Aklındaki Tek Soru</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        ABD vize mevzuatı (INA 214b) başvuranın <em>göçmen olmadığını ispat etmesini</em> zorunlu
        kılar. Yani ispat yükü size aittir. Vize görevlisi mülakatta şunu düşünür: "Bu genç
        öğrenci ABD'ye girip kalır mı?" Sizi ret etmesi için bir neden aramamasına gerek yok;
        sizi onaylaması için yeterli kanıtı siz sunmalısınız.
      </p>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-800 text-sm mb-1">Öğrencilerin En Büyük Hatası</p>
          <p className="text-amber-700 text-sm leading-relaxed">
            Mülakatta "Amerika'da okumak istiyorum" veya "belki ileride orada çalışmayı düşünüyorum"
            demek doğrudan ret sebebidir. Mülakat boyunca Türkiye'ye dönme niyetinizi net tutun.
          </p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Belge Listesi</h2>
      <ul className="space-y-2 mb-8">
        {BELGELER.map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Öğrenci Bağını Güçlendirme: Türkiye'ye Neden Döneceksiniz?</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Sponsorsuz bir öğrenci için en güçlü argüman şudur: <strong>Okumaya devam etmek için
        Türkiye'ye dönmek zorundayım.</strong> Bunu somutlaştırın:
      </p>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6 space-y-3 text-sm text-slate-700">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <p><strong>Aktif öğrencilik:</strong> Bir sonraki dönem kayıt belgesi veya ders programı</p>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <p><strong>Burs:</strong> Burs alıyorsanız belgeyi ekleyin — ülkede kalmak zorunda olduğunuzu gösterir</p>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <p><strong>Staj/iş teklifi:</strong> Türkiye'de mezuniyet sonrası sizi bekleyen bir iş varsa belgeleyin</p>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <p><strong>Aile:</strong> Anne-baba, kardeş — "onlara bakmak zorundayım" mesajı güçlü bir bağdır</p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Finansal Durum: Sponsor Yoksa Ne Olur?</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Sponsorsuz başvuruda bile masrafların karşılanabileceği gösterilmelidir. Seçenekler:
      </p>
      <ul className="space-y-3 mb-6">
        {[
          { b: 'Aile finansmanı', d: 'Anne-babanın maaş bordrosu + banka dökümü. "Ailemin masraflarımı karşılayacağı" beyanı ile birlikte sunun.' },
          { b: 'Kendi birikimi', d: 'Düzenli çalışıyorsanız (yarı zamanlı) veya burs parası biriktirdiyseniz bunları belgeleyin.' },
          { b: 'Seyahat bütçesi kısıtlı tutun', d: 'Uzun vadeli değil, kısa süreli (7-14 gün) planlar daha güvenilir görünür. 45 gün turizm için gidecek kaynağınız var mı diye sorulur.' },
        ].map(({ b, d }) => (
          <li key={b} className="bg-white border border-slate-200 rounded-xl p-4 text-sm">
            <p className="font-semibold text-slate-800 mb-1">{b}</p>
            <p className="text-slate-600 leading-relaxed">{d}</p>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Mülakat: Öğrenciler İçin 5 Altın Kural</h2>
      <div className="space-y-3 mb-8">
        {[
          { n: '1', b: 'Kısa ve net konuşun', d: 'Uzun açıklamalar şüphe uyandırır. "Neden ABD\'ye gidiyorsunuz?" → "Grand Canyon ve New York\'u görmek istiyorum, 10 gün kalacağım."' },
          { n: '2', b: 'Türkçe konuşabilirsiniz', d: 'Mülakat Türkçe yapılabilir. İngilizce bilmek zorunlu değil, ancak temel sorulara İngilizcede hazırlıklı olun.' },
          { n: '3', b: 'Destekleyici belgeleri sıralı tutun', d: 'Görevli belge istediğinde doğru olanı hemen bulabilmelisiniz. Dağınık dosya kötü izlenim bırakır.' },
          { n: '4', b: 'Geri dönüş niyetinizi ilk sözlerinizde kurun', d: '"... döndüğümde mezun olacağım ve..." cümle yapısını aktif kullanın.' },
          { n: '5', b: 'Tatil döneminde başvurun', d: 'Akademik yıl içinde başvurursanız "okul varken neden gidiyorsun?" sorusuyla karşılaşabilirsiniz. Yaz veya sömestr tatilinde başvurmak açıklamayı kolaylaştırır.' },
        ].map(({ n, b, d }) => (
          <div key={n} className="bg-white border border-slate-200 rounded-xl p-4 flex gap-3 text-sm">
            <span className="w-7 h-7 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold shrink-0 text-xs">{n}</span>
            <div>
              <p className="font-semibold text-slate-800 mb-1">{b}</p>
              <p className="text-slate-600 leading-relaxed">{d}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-blue-800 text-sm leading-relaxed">
          <strong>Önemli:</strong> DS-160 formunda "Bu başvurudan önce herhangi bir ABD vizesi
          için reddedildiniz mi?" sorusu mutlaka dürüstçe yanıtlanmalıdır. Yalan beyan kalıcı
          ban getirebilir.
        </p>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-8 flex gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-emerald-800 text-sm mb-1">Danışman İpucu: Zamanlama</p>
          <p className="text-emerald-700 text-sm leading-relaxed">
            ABD konsolosluğu Ankara'da mülakatlar yoğun sezonlarda (Haziran-Ağustos) 2-3 ay
            bekletebilir. Seyahatinizden en az 3 ay önce başvurun. Istanbul VFS üzerinden randevu
            bulmak Ankara'ya kıyasla zaman zaman daha hızlıdır.
          </p>
        </div>
      </div>

      <div className="mt-12 bg-brand-50 border border-brand-200 rounded-2xl p-6">
        <h3 className="font-bold text-brand-900 mb-2">Sonuç: Hikayeniz Tutarlıysa Şans Var</h3>
        <p className="text-brand-800 text-sm leading-relaxed">
          Sponsorsuz öğrenci olmak ret anlamına gelmiyor. Akademik bağlılığınızı, aile
          finansmanını ve Türkiye'ye net geri dönüş nedeninizi belgeleyin. Mülakatta sakin,
          kısa ve tutarlı olun. Red geldiyse 6-12 ay bekleyip değişen koşullarla (mezuniyet
          yaklaştı, iş teklifi geldi vb.) tekrar başvurabilirsiniz.
        </p>
      </div>

    </BlogPostLayout>
  );
}
