import React from 'react';
import { AlertTriangle, CheckCircle2, Info, ShieldCheck } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'pasaportunda-ret-varken-yeni-vize',
  title: 'Pasaportunda Ret Varken Yeni Vize Başvurusu Yapmanın Püf Noktaları',
  description: 'Önceki ret damgası olan pasaportla Schengen, İngiltere veya ABD vizesi için yeniden başvururken nelere dikkat etmeli? Ret geçmişini nasıl açıklarsınız, hangi belgeler durumu tersine çevirir?',
  category: 'Genel',
  readingTime: 8,
  date: '2026-04-16',
  tags: ['vize reddi', 'ret geçmişi', 'yeni başvuru', 'pasaport', 'Schengen'],
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

export default function PasaportRetYeniVize() {
  return (
    <BlogPostLayout post={POST} schema={SCHEMA}>

      <p className="text-slate-700 leading-relaxed text-base mb-6">
        Pasaportunuzdaki ret damgası bir yargı değil, bir veri noktasıdır. Konsolosluk o damgayı
        görür, evet — ama ne gördüğünüz kadar <em>nasıl açıkladığınız</em> da en az o kadar önemlidir.
        Bu rehberde ret geçmişiyle başvuruyu nasıl güçlendireceğinizi, ne söyleyeceğinizi ve
        nelerin işe yaramayacağını konuşacağız.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Ret Damgası Ne Kadar Süre Etkili?</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Schengen ve çoğu Batılı ülkede ret kayıtları sisteme işlenir ve silinmez.
        Yeni pasaport alsanız bile:
      </p>
      <div className="space-y-3 mb-8">
        {[
          { u: 'Schengen', d: 'VIS (Vize Bilgi Sistemi) tüm Schengen konsolosluklarında ret kayıtlarınızı paylaşır. Yeni pasaport almak bu kaydı silmez; form doldururken "daha önce reddedildiniz mi?" sorusunu dürüstçe yanıtlamanız gerekir.' },
          { u: 'ABD', d: 'DS-160 formundaki ret sorusu kalıcıdır. Yanlış yanıtlamak "misrepresentation" suçu oluşturur ve kalıcı ban sonucuna yol açabilir.' },
          { u: 'İngiltere', d: 'UK Visas & Immigration başvuru geçmişinizi kontrol eder. Ret beyan edilmesi gerekmektedir.' },
        ].map(({ u, d }) => (
          <div key={u} className="bg-white border border-slate-200 rounded-xl p-4 text-sm">
            <p className="font-semibold text-slate-800 mb-1">{u}</p>
            <p className="text-slate-600 leading-relaxed">{d}</p>
          </div>
        ))}
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <p className="text-red-800 text-sm leading-relaxed">
          <strong>Asla yapmayın:</strong> "Yeni pasaport aldım, redi bilmiyorlar" düşüncesi yanlıştır.
          Sistemler pasaport numarasından değil kimlik/biyometrik veri bazlıdır. Gizleme girişimi
          ilerleyen süreçte ciddi hukuki sonuçlar doğurur.
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Neden Reddedildiniz? Teşhis Olmadan Tedavi Olmaz</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Yeni başvuru yapmadan önce ret gerekçesini tam anlamalısınız. Elinizdeki ret mektubunu
        alın ve şu soruları sorun:
      </p>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6 space-y-2 text-sm text-slate-700">
        <p>• Hangi madde işaretlenmiş? (Finansal mı? Belge mi? Güvenlik mi?)</p>
        <p>• O gerekçe hâlâ geçerli mi? (Hâlâ gelir belgesiz misiniz, yoksa iş buldunuz mu?)</p>
        <p>• Koşullarınız değişti mi? (Evlendiniz, mülk aldınız, yurt dışı seyahat yaptınız)</p>
        <p>• Yeterli süre geçti mi? (Çok kısa süre içinde tekrar başvurmak olumsuz sinyaldir)</p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Yeni Başvuruda Ret Geçmişini Nasıl Açıklarsınız?</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Niyet mektubunuza veya ek açıklama sayfasına ret geçmişine dair kısa, dürüst ve çözüm
        odaklı bir paragraf ekleyin. Bunu yaparken üç kural:
      </p>
      <div className="space-y-3 mb-6">
        {[
          { n: '1', r: 'Savunmacı değil, açıklayıcı olun', d: '"2024\'teki başvurumda banka belgem eksikti ve bu nedenle reddedildim. Bu başvurumda 6 aylık eksiksiz hesap dökümü ve güncel maaş bordromu sunuyorum." — Bu doğru yaklaşımdır.' },
          { n: '2', r: 'Suçlamayın', d: 'Konsolosluğun hata yaptığını ima etmek veya sistemi eleştirmek görevi değerlendiren kişiyi karşınıza alır. Net ve saygılı kalın.' },
          { n: '3', r: 'Değişimi kanıtlayın', d: 'Salt "bu sefer farklı olacak" demek yetmez. Değişimi belgeleyin: yeni iş sözleşmesi, yeni banka ekstresi, yeni mülk belgesi, aradan geçen süre.' },
        ].map(({ n, r, d }) => (
          <div key={n} className="flex gap-3 text-sm">
            <span className="w-7 h-7 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold shrink-0 text-xs mt-0.5">{n}</span>
            <div>
              <p className="font-semibold text-slate-800 mb-1">{r}</p>
              <p className="text-slate-600 leading-relaxed">{d}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Ne Kadar Beklemeli?</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        "Ne kadar bekleyeyim?" en çok sorulan sorulardan biridir. Kısa cevap: koşullar değişmeden
        yapılan erken başvuru riski artırır.
      </p>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700">
              <th className="text-left p-3 rounded-tl-lg font-semibold">Koşul</th>
              <th className="text-left p-3 rounded-tr-lg font-semibold">Önerilen Bekleme</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Ret gerekçesi çözüldü (yeni iş, daha güçlü banka)', '1-3 ay yeterlidir'],
              ['Koşullar aynı ama farklı ülkeye başvuruyorsunuz', 'En az 3-6 ay'],
              ['Finansal durumunuz değişti (terfi, yeni birikim)', '3 ay (yeni banka dönemi oluşsun)'],
              ['Ret gerekçesi güvenlik kaynaklıysa', 'Avukat desteği alın; süre belirsiz'],
              ['Birden fazla ret varsa', 'Minimum 6-12 ay; koşul değişikliği şart'],
            ].map(([k, b], i) => (
              <tr key={k} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                <td className="p-3 text-slate-700">{k}</td>
                <td className="p-3 font-medium text-slate-800">{b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Güçlendirici Belgeler: Ret Geçmişini Dengelemek</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Ret geçmişinin olumsuz etkisini dengelemek için dosyanıza ekleyebileceğiniz güçlü belgeler:
      </p>
      <ul className="space-y-2 mb-8">
        {[
          'Yeni veya güncel iş sözleşmesi / maaş bordrosu',
          'Son 6 aylık organik banka hareketi (ani para yatırışı olmadan)',
          'Tapu, araç ruhsatı, varlık belgesi',
          'Aile bağı belgeleri (evlilik, çocuk nüfus kaydı)',
          'Önceki başarılı seyahat geçmişi (varsa: Schengen, ABD, İngiltere)',
          'İşveren izin yazısı ve geri dönüş güvencesi',
          'Türk müşteri veya iş sözleşmeleri (freelance ise)',
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-blue-800 text-sm leading-relaxed">
          <strong>Ülke değiştirmek çözüm mü?</strong> Schengen'de reddedildiniz diye başka
          Schengen ülkesine başvurmak çoğunlukla işe yaramaz; VIS sistemi redi tüm ülkelerle
          paylaşır. Ancak koşullarınız gerçekten değiştiyse farklı bir ülke konsolosluğu farklı
          değerlendirme yapabilir.
        </p>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-8 flex gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-emerald-800 text-sm mb-1">Danışman İpucu: Küçük Adım Stratejisi</p>
          <p className="text-emerald-700 text-sm leading-relaxed">
            Birden fazla ret yaşadıysanız doğrudan Schengen'e değil, Türkiye'den vize
            gerektirmeyen veya daha kolay vize veren ülkelere seyahat edin: Sırbistan, Georgia,
            Arnavutluk, Dubai gibi. Bu seyahatler pasaportunuza giriş-çıkış damgaları ekler ve
            bir sonraki Schengen başvurusunda "seyahat alışkanlığı" kanıtı olarak kullanılır.
          </p>
        </div>
      </div>

      <div className="mt-12 bg-brand-50 border border-brand-200 rounded-2xl p-6">
        <h3 className="font-bold text-brand-900 mb-2">Özetle: Ret Geçmişi Engel Değil, Engel Aşma Rehberidir</h3>
        <p className="text-brand-800 text-sm leading-relaxed">
          Her ret bir mesajdır: "Şu an yeterli değil, ama şunları değiştirirsen olabilir."
          Gerekçeyi doğru okuyun, koşullarınızı değiştirin, değişimi belgeleyin ve sabırlı olun.
          Pasaportundaki ret damgasına rağmen vize alan binlerce kişi var — sır, onların
          hikayelerini nasıl anlattıklarındadır.
        </p>
      </div>

    </BlogPostLayout>
  );
}
