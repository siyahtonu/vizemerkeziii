import React from 'react';
import { AlertTriangle, CheckCircle2, Info, ShieldCheck } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'dijital-nomad-vizesi-2026',
  title: "Dijital Nomad Vizesi 2026: Türk Vatandaşları İçin En Cazip Ülkeler",
  description: "2026'da uzaktan çalışarak yurt dışında yaşamak isteyen Türk vatandaşları için dijital nomad vizesi sunan ülkeler: Portekiz, Hırvatistan, Yunanistan, Mauritius ve daha fazlası. Koşullar, gelir şartları ve başvuru rehberi.",
  category: 'İpucu',
  readingTime: 8,
  date: '2026-04-16',
  tags: ['dijital nomad vizesi', 'uzaktan çalışma vizesi', 'Portekiz dijital nomad', 'remote work vize', '2026 nomad'],
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
      name: "Dijital nomad vizesi nedir?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Dijital nomad vizesi, yabancı bir ülkede uzaktan çalışarak belirli süre ikamet etmeye olanak tanıyan özel vize kategorisidir. Turistik vizeden farklı olarak uzun süreli (genellikle 1-2 yıl) kalışa izin verir. Kendi ülkenizdeki veya uluslararası bir işverenle çalışmanız, ev sahibi ülkeye vergi ödememe koşuluyla genellikle yeterlidir.",
      },
    },
    {
      '@type': 'Question',
      name: "Portekiz dijital nomad vizesi 2026'da hâlâ geçerli mi?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Portekiz, AB üyesi olmayan vatandaşlar için D8 kategorisi altında dijital nomad vizesi sunmaya devam etmektedir. 2026 itibarıyla aylık 3,480 Euro minimum gelir şartı uygulanmaktadır. Vize 1 yıl için verilir, ikamet iznine dönüştürülebilir.",
      },
    },
    {
      '@type': 'Question',
      name: "Türk vatandaşı dijital nomad vizesiyle Schengen'de serbest dolaşabilir mi?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Portekiz, Yunanistan veya Hırvatistan gibi Schengen ülkelerinden alınan ikamet izni veya uzun süreli vize, diğer Schengen ülkelerine kısa süreli (90 gün) giriş hakkı tanıyabilir. Ancak bu, tüm Schengen'de çalışma hakkı vermez — yalnızca vize aldığınız ülkede çalışabilirsiniz.",
      },
    },
    {
      '@type': 'Question',
      name: "Gelir kanıtı nasıl gösterilir?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Genellikle son 3-6 aylık banka özeti, sözleşme veya iş belgesi ve müşteri sözleşmeleri (freelancer için) yeterlidir. Bazı ülkeler apostilli gelir belgesi veya çevrilmiş iş sözleşmesi isteyebilir.",
      },
    },
    {
      '@type': 'Question',
      name: "Dijital nomad vizesinde vergi durumu nasıl olur?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Her ülkenin vergi anlaşması ve 183 gün kuralı farklıdır. Portekiz'de NHR (Non-Habitual Resident) statüsü yabancı gelire 10 yıl boyunca vergi avantajı sağlayabilir. Türkiye ile çifte vergilendirme anlaşması olan ülkeleri tercih etmek hem yasal hem avantajlıdır. Bir vergi danışmanıyla görüşmenizi öneririz.",
      },
    },
    {
      '@type': 'Question',
      name: "En düşük gelir şartıyla dijital nomad vizesi hangi ülkede?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Mauritius (yaklaşık 1,500 USD/ay), Cape Verde ve Arnavutluk daha düşük gelir şartıyla dijital nomad programları sunar. AB ülkeleri (Portekiz, Hırvatistan, Yunanistan) daha yüksek gelir eşiği uygular ancak yaşam kalitesi ve hukuki güvence açısından daha cazip olabilir.",
      },
    },
  ],
};

const ULKELER = [
  {
    ulke: 'Portekiz',
    kategori: 'D8 Vizesi',
    sure: '1 yıl (uzatılabilir)',
    gelir: '3,480 EUR/ay',
    zorluk: 'Orta',
    renk: 'emerald',
    ozellik: "AB ülkesi, NHR vergi avantajı, ikamet iznine dönüştürülebilir. Schengen'in en cazip nomad destinasyonu.",
  },
  {
    ulke: 'Yunanistan',
    kategori: 'Dijital Nomad Vizesi',
    sure: '1 yıl (uzatılabilir)',
    gelir: '3,500 EUR/ay',
    zorluk: 'Orta',
    renk: 'emerald',
    ozellik: "AB ülkesi, yaşam maliyeti görece uygun, iklim avantajı. Vergi teşvikleri mevcuttur.",
  },
  {
    ulke: 'Hırvatistan',
    kategori: 'Digital Nomad Residence',
    sure: '1 yıl',
    gelir: '2,539 EUR/ay',
    zorluk: 'Kolay',
    renk: 'emerald',
    ozellik: "AB ülkesi, Schengen üyesi. Posta ücreti düşük, deniz kıyıları eşsiz. Türkiye ile iyi uçuş bağlantısı.",
  },
  {
    ulke: 'Mauritius',
    kategori: 'Premium Visa',
    sure: '1-2 yıl',
    gelir: '~1,500 USD/ay',
    zorluk: 'Kolay',
    renk: 'blue',
    ozellik: "Düşük gelir eşiği, İngilizce geçerli, vergisiz gelir avantajı. Uzak ama ekzotik bir seçenek.",
  },
  {
    ulke: 'Arnavutluk',
    kategori: 'Uzun Süreli İkametçi',
    sure: '1 yıl',
    gelir: 'Esnek (düşük)',
    zorluk: 'Kolay',
    renk: 'blue',
    ozellik: "Düşük yaşam maliyeti, vizesiz Türk girişi. Henüz AB üyesi değil; banka ve servis altyapısı gelişiyor.",
  },
  {
    ulke: 'Karadağ',
    kategori: 'Dijital Nomad',
    sure: '1 yıl',
    gelir: 'Esnek',
    zorluk: 'Kolay',
    renk: 'blue',
    ozellik: "Adriyatik kıyısında uygun fiyatlı yaşam. Türkiye ile vizesiz giriş. Aday ülke statüsünde AB'ye yakın.",
  },
];

const RENK_MAP: Record<string, { bg: string; text: string; border: string }> = {
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
};

export default function DijitalNomadVizesi() {
  return (
    <BlogPostLayout post={POST} schema={[ARTICLE_SCHEMA, FAQ_SCHEMA]}>

      <p className="text-slate-700 leading-relaxed text-base mb-6">
        Uzaktan çalışmak artık bireysel bir tercih değil, milyonlarca kişinin yaşam
        biçimi. Pek çok ülke bu kitleyi çekmek için özel "dijital nomad vizesi"
        programları başlattı. Türk vatandaşları için bu vizeler cazip bir fırsat:
        hem Avrupa'da uzun süreli ikamet hem de vergi avantajları mümkün.
        2026'da öne çıkan ülkeler, koşullar ve başvuru yolları.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Dijital Nomad Vizesi Nedir?</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Standart çalışma vizelerinden farklı olarak dijital nomad vizesi, ev sahibi
        ülkenin şirketlerine değil — kendi müşterilerinize veya uzaktan çalıştığınız
        yabancı/Türk işvereninize — çalışmanıza izin verir. Tek koşul: yeterli geliri
        kendi kaynağınızdan sağlamanız.
      </p>
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { baslik: 'Turistik Vize', icerik: 'Çalışmak yasak. Maksimum 90 gün. Uzatılamaz.' },
          { baslik: 'Çalışma Vizesi', icerik: 'Ev sahibi ülkedeki işveren için. İş teklifi zorunlu.' },
          { baslik: 'Dijital Nomad', icerik: 'Kendi işvereninle çalış. Uzun süreli ikamet. Vergi avantajı mümkün.' },
        ].map(({ baslik, icerik }) => (
          <div key={baslik} className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm">
            <p className="font-bold text-slate-800 mb-1">{baslik}</p>
            <p className="text-slate-600 leading-relaxed">{icerik}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">2026 Öne Çıkan Ülkeler</h2>
      <div className="space-y-4 mb-10">
        {ULKELER.map(({ ulke, kategori, sure, gelir, zorluk, renk, ozellik }) => {
          const r = RENK_MAP[renk];
          return (
            <div key={ulke} className={`rounded-xl border ${r.border} overflow-hidden`}>
              <div className={`${r.bg} px-4 py-3 flex items-center justify-between`}>
                <div>
                  <p className={`font-bold text-sm ${r.text}`}>{ulke}</p>
                  <p className={`text-xs ${r.text} opacity-80`}>{kategori}</p>
                </div>
                <div className="flex items-center gap-3 text-right">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">{sure}</p>
                    <p className="text-xs font-bold text-slate-700">{gelir}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-white border ${r.border} ${r.text}`}>{zorluk}</span>
                </div>
              </div>
              <div className="p-4 bg-white text-sm text-slate-700 leading-relaxed">{ozellik}</div>
            </div>
          );
        })}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Başvuru İçin Genellikle İstenen Belgeler</h2>
      <ul className="space-y-2 mb-8">
        {[
          'Geçerli pasaport',
          'Son 3-6 ay banka hesap özeti (gelir şartını karşılayan)',
          "İş sözleşmesi veya freelance müşteri sözleşmeleri",
          'Sağlık sigortası (kapsamlı, tüm ikamet süresini kapsayan)',
          'Cezai sicil kaydı (apostilli)',
          'Konaklama kanıtı (kira sözleşmesi veya rezervasyon)',
          'Niyet mektubu (neden bu ülkede çalışmak istediğinizi açıklayan)',
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-800 text-sm mb-1">Schengen 90 Gün Kuralı ve İkamet İzni Farkı</p>
          <p className="text-amber-700 text-sm leading-relaxed">
            Turizm vizesiyle Schengen'de 90 günden fazla kalamazsınız. Ancak <strong>Portekiz,
            Yunanistan veya Hırvatistan'dan ikamet izni aldığınızda</strong> bu kural
            değişir: ikamet iznine sahip biri için o ülkede kalış süresi 90 günle sınırlı
            değildir. EES sistemi bu farkı kayıt altına almaktadır.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-blue-800 text-sm mb-1">Vergi: Profesyonel Danışmanlık Alın</p>
          <p className="text-blue-800 text-sm leading-relaxed">
            Portekiz NHR, Yunanistan yabancı gelir teşviki gibi vergi avantajları cazip
            görünse de yasal koşulları karmaşıktır. Türkiye ile çifte vergilendirme
            anlaşması olan ülkelerde vergi yükümlülüğünüzü bir mali danışmanla
            netleştirmenizi kesinlikle öneririz.
          </p>
        </div>
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
        <h3 className="font-bold text-brand-900 mb-2">Dijital Nomad Vizesi: Özgürlük, Sorumlulukla Gelir</h3>
        <p className="text-brand-800 text-sm leading-relaxed">
          Uzaktan çalışarak Avrupa'da ikamet etmek artık hayal değil — ama her
          adımın hukuki ve mali boyutunu doğru anlamadan atlamak hata olur.
          Doğru ülke seçimi, eksiksiz başvuru ve vergi danışmanlığıyla dijital
          nomad yaşamı sürdürülebilir ve yasal zemine oturtulabilir.
        </p>
      </div>

    </BlogPostLayout>
  );
}
