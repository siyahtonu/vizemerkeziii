import React from 'react';
import { CheckCircle2, Info, Briefcase, AlertTriangle, TrendingUp, FileText, Sparkles } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'serbest-meslek-sahipleri-icin-vize-rehberi',
  title: 'Serbest Meslek Sahipleri İçin Vize: Freelance ve Bireysel Çalışanlar İçin Rehber',
  description: 'Serbest meslek sahipleri, freelancer, esnaf ve şirket sahipleri vize başvurusunu nasıl yapar? Gerekli belgeler, ipuçları ve kritik detaylar.',
  category: 'Genel',
  readingTime: 10,
  date: '2026-04-17',
  tags: ['serbest meslek', 'vergi levhası', 'freelance', 'şirket sahibi'],
};

const GRUPLAR = [
  'Serbest muhasebeci mali müşavirler (SMMM)',
  'Avukatlar, hukuk müşavirleri',
  'Özel muayenehane hekimleri, diş hekimleri',
  'Mimarlar, mühendisler (proje bazlı)',
  'Freelance web tasarımcıları, yazılımcılar, grafik tasarımcılar',
  'Çevirmenler, içerik üreticileri',
  'Fotoğrafçılar, video yapımcıları',
  'Sanatçılar (ressam, heykeltraş, müzisyen)',
  'Emlak danışmanları (bireysel)',
  'Şahıs şirketi sahipleri, esnaf',
];

const VERGI_LEVHASI_ICERIK = [
  'Faaliyet türü (meslek kodu)',
  'Şirket/muayenehane adı',
  'Vergi numarası',
  'Faaliyet başlangıç tarihi',
  'Adres ve iletişim bilgileri',
];

const GELIR_SEVIYELERI = [
  { seviye: 'Alt limit tavsiyesi', deger: 'Yıllık 200.000 TL + gelir beyanı (Schengen için)' },
  { seviye: 'Orta seviye', deger: '500.000 TL-1 milyon TL (güçlü başvuru)' },
  { seviye: 'Üst seviye', deger: '1 milyon TL+ (ABD, İngiltere dahil her ülke için ideal)' },
];

const BANKA_KURALLARI = [
  'Bireysel hesap: Son 6 ay',
  'İş hesabı (varsa): Son 6 ay',
  'Düzenli gelir girişleri görünür olmalı (müşteri ödemeleri)',
  "Toplam bakiye: yıllık gelirin %15-25'i tavsiye edilir",
];

const FREELANCER_ONERILER = [
  'Şahıs şirketi kurun: Kuruluş kolaydır (SMMM ile 1-2 hafta), aylık maliyeti düşüktür',
  'Sigortalı olun: Bağ-Kur kaydı resmi sinyal verir',
  'Fatura kesin ve kayıt altına alın: Banka üzerinden gelir kanıtı birikir',
  'Her ay düzenli gelir beyanı yapın: Yıllık beyannamede tutarlılık gösterir',
  'Yabancı müşterileriniz varsa bunu vurgulayın: Uluslararası gelir = uluslararası bağ demek',
];

const SIRKET_BELGELERI = [
  'Ticaret sicil gazetesi (son 3 ay içinde)',
  'İmza sirküleri (noter onaylı)',
  'Ticaret Odası faaliyet belgesi',
  'Son 1 yıl kurumlar vergisi beyannamesi',
  'Şirket bilançosu (bilirkişi onaylı)',
  'Ticari taahhütname',
  'Kendinize ödenen maaşın bordrosu',
];

const BANKA_STRATEJISI = [
  'Toplam yıllık tutara bakar (beyanname üzerinden)',
  'Ortalamayı hesaplar (düzensiz ama yıllık istikrarlı görürse olumludur)',
  'Büyük tek seferlik ödemeler şüphelidir (sahte fatura algısı)',
  'Düzenli küçük-orta ödemeler güven verir (müşteri ağı izlenimi)',
];

const BASARI_IPUCLARI = [
  'Başvurudan 1 yıl önce resmi yapıyı kurun — kayıt dışı profil hep zordur',
  'Yıllık vergi beyannamenizi düzenli verin, eksik bırakmayın',
  'Banka işlemlerinizin çoğunluğunu havale ile yapın (nakit risklidir)',
  'Yurtdışında müşteriniz varsa bunu sponsorluk belgesi gibi kullanın',
  'Uluslararası sertifikalarınız varsa ekleyin (CPA, PMP, Adobe gibi)',
  'Web sitesi, profesyonel e-posta, LinkedIn profili gibi dijital izler de destek belgesi olabilir',
];

const SSS = [
  {
    q: 'Şahıs şirketim var ama kazancım düşük, vize alabilir miyim?',
    a: "Alabilirsiniz. Düşük gelir tek başına engel değildir. Sponsor (eş, ebeveyn) desteği, banka birikimleriniz ve Türkiye'deki bağlarınız (mülk, aile) başvurunuzu güçlendirir.",
  },
  {
    q: 'Vergi levham yok, ne yapmalıyım?',
    a: 'Vergi mükellefi değilseniz, serbest meslek sahibi olarak başvurmak zordur. Ya başvurudan önce vergi mükellefi olun (SMMM yardımıyla kolay), ya da sponsor (eş, ebeveyn) üzerinden başvurun.',
  },
  {
    q: "Yabancı bir şirkete çalışan Türk freelancer'ım, vize nasıl alırım?",
    a: "Bu özel bir durum. Yabancı müşterinizle yapılan sözleşme ve aylık ödemelerinizin banka kayıtları değerli belgelerdir. Ayrıca Türkiye'de vergi beyanında bulunduğunuza dair kanıtlar da olumludur.",
  },
  {
    q: 'Şirketimin bilançosu zayıf, ne yapmalıyım?',
    a: 'Şirket bilançosundan daha önemli olan kişisel finansal durumunuzdur. Bireysel banka hesabınız güçlüyse ve düzenli gelir görünüyorsa, şirket bilançosu zayıf olsa bile başarılı olabilirsiniz.',
  },
  {
    q: 'Birden fazla mesleğim var (doktor + yazar), hangisini yazmalıyım?',
    a: 'Başvuru formunda "ana mesleğiniz" sorulur. En yüksek gelirli ve kayıtlı olduğunuz mesleği ana meslek olarak yazın. Diğerlerini "ek gelir" veya "hobi olarak yapılan aktivite" olarak belirtebilirsiniz.',
  },
  {
    q: 'Yeni kurulan şirketim var (6 aylık), vize alabilir miyim?',
    a: 'Teoride evet ama zor. Yeni şirket, konsolosluk gözünde henüz "kurulu değil, istikrarlı değil" algısı yaratır. 1 yıllık şirket geçmişiniz varsa çok daha güçlü bir başvuru yapabilirsiniz. Bu süreye kadar eşi sponsor olarak göstermek iyi bir seçenektir.',
  },
];

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
      mainEntity: SSS.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    },
  ],
};

export default function SerbestMeslekVize() {
  return (
    <BlogPostLayout post={POST} schema={SCHEMA}>
      <p className="text-slate-700 leading-relaxed text-base mb-6">
        Serbest meslek, bağımsızlık ve esneklik demek. Ancak vize başvurusunda bu bağımsızlık,
        bazen dezavantaja dönüşür. "Maaşlı çalışan gibi sabit gelirim yok" diye endişelenen
        freelancer'lar, SMMM'ler, avukatlar, doktorlar, web tasarımcıları vize alabilir mi? Cevap
        kesinlikle evet. Ama farklı bir strateji gerekir. Bu rehber, serbest çalışan profesyoneller
        için özel hazırlanmıştır.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Serbest Meslek Grupları Kimler?</h2>
      <p className="text-slate-700 leading-relaxed mb-4">Bu kategoride yer alanlar:</p>
      <ul className="space-y-2 mb-8">
        {GRUPLAR.map((g) => (
          <li key={g} className="flex gap-2 text-slate-700">
            <Briefcase className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
            <span>{g}</span>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Serbest Meslek Sahibi İçin Vize Neden Daha Karmaşık?</h2>
      <p className="text-slate-700 leading-relaxed mb-8">
        Maaşlı çalışan için "her ay aynı tarihte aynı maaş yatar" basit bir gelir sinyalidir.
        Serbest meslek sahibi için gelir düzensiz olabilir — bir ay yüksek, bir ay düşük.
        Konsolosluk memuru için bu tablo anlaşılması zor olabilir. Bu yüzden daha detaylı ve çok
        yönlü belge desteği gereklidir.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Gerekli Ana Belgeler</h2>

      <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">1. Vergi Levhası (En Kritik Belge)</h3>
      <p className="text-slate-700 leading-relaxed mb-4">
        Vergi levhası, serbest meslek sahibi olduğunuzu resmi olarak kanıtlayan ana belgedir.
        Güncel (son 1 yıl içinde alınmış) ve onaylı olmalıdır. Levhada:
      </p>
      <ul className="space-y-2 mb-6">
        {VERGI_LEVHASI_ICERIK.map((v) => (
          <li key={v} className="flex gap-2 text-slate-700">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <span>{v}</span>
          </li>
        ))}
      </ul>

      <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">2. Oda Kaydı Belgesi</h3>
      <p className="text-slate-700 leading-relaxed mb-6">
        Mesleki odaya kayıtlıysanız (SMMM Odası, Tabip Odası, Baro, Mimarlar Odası), oda
        tarafından verilen üyelik belgesi çok değerlidir. Bu belge, mesleği meşru şekilde
        yaptığınızın kanıtıdır.
      </p>

      <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">3. Son 1 Yıllık Gelir Vergi Beyannamesi</h3>
      <p className="text-slate-700 leading-relaxed mb-4">
        Geçen yıl beyan ettiğiniz toplam gelir. Bu, mali profilinizin en güçlü göstergesidir.
        Yıllık geliriniz ne kadar yüksekse, vize şansınız o kadar artar.
      </p>
      <div className="space-y-2 mb-6">
        {GELIR_SEVIYELERI.map((g) => (
          <div key={g.seviye} className="flex gap-3 items-start border border-slate-200 rounded-lg p-3 bg-white">
            <TrendingUp className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900">{g.seviye}</p>
              <p className="text-slate-700 text-sm">{g.deger}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">4. Banka Hesap Dökümleri</h3>
      <p className="text-slate-700 leading-relaxed mb-4">
        Serbest meslekte çoğu zaman hem bireysel hem de iş banka hesapları bulunur. Her ikisi de
        sunulmalıdır:
      </p>
      <ul className="space-y-2 mb-6">
        {BANKA_KURALLARI.map((b) => (
          <li key={b} className="flex gap-2 text-slate-700">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">5. Fatura Örnekleri</h3>
      <p className="text-slate-700 leading-relaxed mb-6">
        Son 6-12 aya ait kestiğiniz bazı faturaların örnekleri, aktif olarak çalıştığınızı
        kanıtlar. 10-15 farklı müşteriye kesilmiş fatura iyi bir örnektir.
      </p>

      <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">6. Müşteri Sözleşmeleri (Varsa)</h3>
      <p className="text-slate-700 leading-relaxed mb-6">
        Devam eden sözleşmeleriniz varsa, bu sözleşmelerin örnekleri (kişisel bilgiler karartılmış
        olabilir) çok güçlü bir kanıttır. Uzun vadeli müşteri ilişkileri, sürekli gelir demek.
      </p>

      <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">7. Sosyal Güvenlik Belgeleri</h3>
      <p className="text-slate-700 leading-relaxed mb-8">
        SGK Bağ-Kur kaydınızın hizmet dökümü. Bağ-Kur, serbest meslek sahiplerinin sosyal güvenlik
        sistemidir ve resmi olarak çalıştığınızın kanıtıdır.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Freelancer'lar İçin Özel Durumlar</h2>
      <p className="text-slate-700 leading-relaxed mb-8">
        Türkiye'de freelance çalışan gençlerin vize almakta zorlandığı bilinir — çünkü resmi
        çalışma yapıları sıklıkla eksiktir. Eğer şirketleşmediyseniz veya vergi mükellefi olarak
        kaydolmadıysanız, vize başvurusu riskli olur.
      </p>

      <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">Freelancer'lar İçin Öneriler</h3>
      <ol className="list-decimal list-inside space-y-2 text-slate-700 mb-8 pl-2">
        {FREELANCER_ONERILER.map((o) => (
          <li key={o}>{o}</li>
        ))}
      </ol>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Şirket Sahipleri İçin Ek Belgeler</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Şahıs şirketi, limited şirket veya anonim şirket sahibiyseniz, ek belgeler istenir:
      </p>
      <ul className="space-y-2 mb-8">
        {SIRKET_BELGELERI.map((s) => (
          <li key={s} className="flex gap-2 text-slate-700">
            <FileText className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
            <span>{s}</span>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Serbest Meslek Sahipleri İçin Banka Hesabı Stratejisi</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Serbest mesleğin en hassas konusu gelir düzensizliğidir. Bazı aylar 50.000 TL gelirken,
        bazı aylar 200.000 TL olabilir. Konsolosluk bu tabloya nasıl bakar?
      </p>
      <ol className="list-decimal list-inside space-y-2 text-slate-700 mb-8 pl-2">
        {BANKA_STRATEJISI.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ol>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Başarı İpuçları</h2>
      <ol className="list-decimal list-inside space-y-2 text-slate-700 mb-8 pl-2">
        {BASARI_IPUCLARI.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ol>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Sık Sorulan Sorular (SSS)</h2>
      <div className="space-y-4 mb-10">
        {SSS.map((item) => (
          <div key={item.q} className="border border-slate-200 rounded-xl p-5 bg-white">
            <h3 className="font-semibold text-slate-900 mb-2">{item.q}</h3>
            <p className="text-slate-700 text-sm leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>
    </BlogPostLayout>
  );
}
