import React from 'react';
import { CheckCircle2, Info, Calendar, AlertTriangle, Calculator, XCircle, Sparkles } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: '90-180-gun-kurali-nasil-hesaplanir',
  title: '90/180 Gün Kuralı Nasıl Hesaplanır? Schengen Kalış Süresi Rehberi',
  description: 'Schengen vizesi ile en fazla kaç gün kalabilirsiniz? 90/180 gün kuralı nasıl hesaplanır, EES sistemi, fazla kalma cezaları rehberi.',
  category: 'Schengen',
  readingTime: 9,
  date: '2026-04-17',
  tags: ['90/180 gün', 'Schengen', 'EES', 'vize süresi'],
};

const HESAP_ARACI_ADIMLARI = [
  'Sayfaya girin',
  '"Date of entry" ve "Date of exit" alanlarına tüm önceki Schengen girişlerinizi ve çıkışlarınızı girin',
  '"Date of planned control" alanına planladığınız yeni seyahat tarihini girin',
  '"Calculate" butonuna basın',
  'Size kalabileceğiniz gün sayısı bildirilir',
];

const EES_AKIS = [
  'Parmak iziniz alınır',
  'Yüz fotoğrafınız çekilir',
  'Pasaport bilgileriniz sisteme işlenir',
  'Giriş/çıkış tarihleriniz otomatik kaydedilir',
  '90/180 kuralı otomatik takip edilir',
];

const UZUN_SURELI_SECENEKLER = [
  {
    baslik: 'Ulusal Vize (D-Tipi)',
    aciklama:
      'Her Schengen ülkesi kendi ulusal vizesini verir. Bu vizeyle 90 günden uzun kalış mümkündür. Genellikle çalışma, eğitim, aile birleşimi gibi özel amaçlar içindir.',
  },
  {
    baslik: 'İkamet İzni (Residence Permit)',
    aciklama:
      "Uzun vadeli oturum için ikamet izni gerekir. Her ülkenin kendi kuralları vardır. Örneğin Almanya Blue Card (çalışma), Fransa Long Stay Visa, İspanya Non-Lucrative Visa.",
  },
  {
    baslik: 'Portekiz D7 Vizesi',
    aciklama:
      "Pasif gelirli (emekli, kira geliri vb.) Türk vatandaşlar için popüler seçenek. Aylık 870 € garantili gelir ile Portekiz'de yaşama hakkı verir.",
  },
  {
    baslik: 'İspanya Dijital Nomad Vizesi',
    aciklama:
      'Uzaktan çalışan profesyoneller için. Aylık 2.646 € minimum gelir gerekir. 3 yıla kadar yenilenebilir.',
  },
];

const CEZALAR = [
  'Para cezası: 500-1.000 € arası (ülkeye göre değişir)',
  "Schengen'e giriş yasağı: 1-3 yıl",
  'SIS (Schengen Information System) kaydı: Tüm Schengen ülkelerine bildirilir',
  'Gelecekteki vize başvurularında red riski: Ciddi şekilde artar',
  'Sınır dışı edilme (deportasyon) durumunda havaalanı masrafları başvurucuya yüklenir',
];

const YANILGI_HATALAR = [
  '"Başka ülkeye geçince sayaç sıfırlanır" yanılgısı — Schengen tek bir bölge olarak sayılır, ülke değiştirmek kalış süresini etkilemez',
  '"90 gün çıktıktan sonra yine 90 gün girebilirim" yanılgısı — kaydırmalı sistem bunu engelleyebilir',
  '"Pasaport damgası yoksa kayıt da yoktur" yanılgısı — EES ile tüm giriş-çıkışlar dijital kaydedilir',
  '"Uçakla değil kara yolundan geçsem hesaba girmez" yanılgısı — tüm Schengen sınırlarında (kara, hava, deniz) aynı sistem işler',
  'Avrupa Komisyonu hesap aracını kullanmadan seyahat planlamak',
];

const SCHENGEN_DISI = [
  'İngiltere (Brexit sonrası ayrıldı)',
  "İrlanda (hiç Schengen'e girmedi)",
  'Bulgaristan, Romanya (kısmi Schengen — kara sınırları hariç Schengen)',
  'Kıbrıs',
  'Sırbistan, Kuzey Makedonya, Bosna Hersek, Arnavutluk, Karadağ, Kosova',
  'Ukrayna, Moldova, Belarus',
];

const SSS = [
  {
    q: "Schengen'den 90 gün kaldıktan sonra ne zaman tekrar girebilirim?",
    a: "Tam 90 gün kaldıysanız ve son giriş tarihiniz 1 Ocak ise, teorik olarak 3 Temmuz'da yeni 90 gün hakkınız tamamlanır. Ancak gerçek hesaplama kaydırmalı sistemdedir — Avrupa Komisyonu hesap aracını kullanın.",
  },
  {
    q: '90/180 kuralı çok girişli vizeyi etkiler mi?',
    a: 'Evet. 5 yıllık çok girişli vizeniz olsa bile 90/180 kuralına uymak zorundasınız. Vize sadece "Schengen\'e giriş hakkı" verir, sınırsız kalış değil.',
  },
  {
    q: 'Hava durumu nedeniyle fazla kaldım, ceza alır mıyım?',
    a: 'Uçuş iptalleri, doğal afetler gibi mücbir sebeplerle fazla kalma durumunda konsolosluktan uzatma alabilirsiniz. Uçak iptalinin belgesi (havayolu resmi yazısı) gereklidir.',
  },
  {
    q: '90 gün üzerinde kaldım ama kimse fark etmedi, sorun var mı?',
    a: 'Eskiden mümkündü, artık değil. EES sistemi dijital kayıt tutar. Bir sonraki Schengen başvurunuzda overstay geçmişiniz görünür ve büyük ihtimalle reddedilirsiniz.',
  },
  {
    q: 'Türk vatandaşı olarak 90/180 kuralına tabi miyim?',
    a: 'Evet, çünkü Türkiye vize gerektiren ülkeler listesindedir. Vizesiz ülkelerden gelen vatandaşlar (ABD, Kanada, Japonya) da 90/180 kuralına tabidir, sadece vize başvurusu yapmaz.',
  },
  {
    q: '90 günden fazla kalmak isteyen tüm seçeneklerim neler?',
    a: 'Ulusal vize (D-tipi), oturum izni, çalışma izni, öğrenci izni, emekli vizesi, dijital nomad vizesi, yatırımcı vizesi (Gold Visa), aile birleşimi — her biri farklı şartlar ve belgeler gerektirir.',
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
      publisher: { '@type': 'Organization', name: 'VizeAkıl', logo: { '@type': 'ImageObject', url: 'https://vizeakil.com/og-image.png' } },
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

export default function Kurali90180NasilHesaplanir() {
  return (
    <BlogPostLayout post={POST} schema={SCHEMA}>
      <p className="text-slate-700 leading-relaxed text-base mb-6">
        Schengen vizesinin en çok yanlış anlaşılan kuralı 90/180 gün kuralıdır. "3 ay kaldım, şimdi
        3 ay çıkıp yine girebilirim" diye düşünen binlerce kişi var — ama bu yanlıştır. 90/180
        kuralı, kaydırmalı bir sistem olarak çalışır ve 2025-2026'da devreye giren EES (Entry/Exit
        System) ile artık otomatik takip ediliyor. Bu rehber, kuralı doğru anlamanızı ve ceza
        yemeden seyahat etmenizi sağlar.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">90/180 Kuralı Nedir?</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Schengen kuralı şu şekilde özetlenir: Herhangi bir 180 günlük dönem içinde, toplam en
        fazla 90 gün Schengen bölgesinde kalabilirsiniz. Bu 90 gün bir tek seyahatte
        tüketilebileceği gibi, birkaç seyahate de bölünebilir.
      </p>
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 flex gap-3">
        <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <p className="text-red-900 text-sm leading-relaxed">
          <strong>Yanlış anlama:</strong> "90 gün kaldım, 90 gün çıktım, tekrar 90 gün kalabilirim"
          — bu yanlıştır. Kural kaydırmalı (rolling) bir sistemle çalışır. Her günde, geriye doğru
          son 180 güne bakılır ve toplam Schengen'de geçirilen gün sayısı hesaplanır.
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Kaydırmalı (Rolling) Sistem Nasıl İşler?</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Örnek ile anlatalım. Bugünün tarihi: 16 Nisan 2026. Geriye 180 gün saydığımızda: 19 Ekim
        2025'e geliriz. Demek ki "referans dönem" 19 Ekim 2025 - 16 Nisan 2026 arasıdır. Bu 180
        gün içinde toplam kaç gün Schengen'deydiniz? Eğer 85 gün ise 5 gün daha kalabilirsiniz.
        Eğer 90 günün üstünde ise hemen çıkmalısınız.
      </p>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-amber-900 text-sm leading-relaxed">
          <strong>Önemli:</strong> Bu hesap her gün yeniden yapılır. Bugün kalabileceğiniz süre,
          dünün hesabından farklı olabilir. Çünkü 180 günün başındaki eski seyahatler tablo dışına
          çıkar.
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Pratik Hesaplama Örneği</h2>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8 flex gap-3">
        <Calendar className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
        <p className="text-slate-800 text-sm leading-relaxed">
          <strong>Senario:</strong> 2025 Ekim'de 30 gün İtalya'da kaldınız. 2026 Ocak'ta 40 gün
          Almanya'da kaldınız. 2026 Mart'ta 25 gün Fransa'da kaldınız. Toplam: 95 gün. Fransa'dan
          çıkarken sınır memuru hesaplar: son 180 gün içinde 95 gün Schengen'desiniz. Bu ihlal
          sebebidir. 5 gün fazla kaldığınız için cezalandırılırsınız.
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Hesaplama Araçları</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Avrupa Komisyonu'nun resmi hesaplama aracı:{' '}
        <a
          href="https://ec.europa.eu/home-affairs/content/visa-calculator_en"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-600 underline hover:text-brand-900"
        >
          ec.europa.eu/home-affairs/content/visa-calculator_en
        </a>
      </p>
      <p className="text-slate-700 leading-relaxed mb-4">Bu aracı kullanmak için:</p>
      <ol className="list-decimal list-inside space-y-2 text-slate-700 mb-6 pl-2">
        {HESAP_ARACI_ADIMLARI.map((a) => (
          <li key={a}>{a}</li>
        ))}
      </ol>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 flex gap-3">
        <Calculator className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-blue-900 text-sm leading-relaxed">
          Bu aracı seyahat öncesinde mutlaka kullanın. Tahmini hesaplamalar yapmayın — kaydırmalı
          sistem karmaşıktır.
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">EES Sistemi ile Otomatik Takip</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        10 Nisan 2026 itibarıyla, tüm Schengen sınır kapılarında EES (Entry/Exit System) tam
        devreye girdi. Bu, kağıt damgalarının yerini alan dijital bir sistemdir. Her girişinizde ve
        çıkışınızda:
      </p>
      <ul className="space-y-2 mb-4">
        {EES_AKIS.map((e) => (
          <li key={e} className="flex gap-2 text-slate-700">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <span>{e}</span>
          </li>
        ))}
      </ul>
      <p className="text-slate-700 leading-relaxed mb-8">
        EES öncesinde sınır memurunun gözden kaçırdığı damgalar, kağıt kayıtların karışması gibi
        sorunlar vardı. Şimdi her şey dijital ve milisaniyede kontrol ediliyor. Fazla kalma
        durumunuz derhal sisteme yansır.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">90 Gün Üzerinde Kalmak İsterseniz</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Eğer 90 günden fazla Schengen'de kalmak istiyorsanız, kısa süreli vize (C-tipi) yeterli
        değildir. Aşağıdaki seçeneklere ihtiyacınız olur:
      </p>
      <div className="space-y-4 mb-8">
        {UZUN_SURELI_SECENEKLER.map((s) => (
          <div key={s.baslik} className="border border-slate-200 rounded-xl p-5 bg-white">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-brand-600" />
              <h3 className="font-semibold text-slate-900">{s.baslik}</h3>
            </div>
            <p className="text-slate-700 text-sm leading-relaxed">{s.aciklama}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Fazla Kalma (Overstay) Cezaları</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        90/180 kuralını ihlal ederseniz ciddi sonuçları olur:
      </p>
      <ul className="space-y-2 mb-8">
        {CEZALAR.map((c) => (
          <li key={c} className="flex gap-2 text-slate-700">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <span>{c}</span>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Sık Yapılan Hatalar</h2>
      <ol className="list-decimal list-inside space-y-2 text-slate-700 mb-8 pl-2">
        {YANILGI_HATALAR.map((y) => (
          <li key={y}>{y}</li>
        ))}
      </ol>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Schengen Dışı Avrupa Ülkeleri</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Bu ülkeler Schengen'e dahil değildir ve 90/180 kuralına girmez:
      </p>
      <ul className="space-y-2 mb-4">
        {SCHENGEN_DISI.map((s) => (
          <li key={s} className="flex gap-2 text-slate-700">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <span>{s}</span>
          </li>
        ))}
      </ul>
      <p className="text-slate-700 leading-relaxed mb-8">
        Bu ülkelere giriş çıkış Schengen sayacınızı etkilemez. Yani 85 gün İspanya'da kaldıysanız,
        Sırbistan'a geçerek orada 30 gün daha kalabilirsiniz. Sonra tekrar Schengen'e girebilmek
        için 180 günlük dönem içinde kalan hakkınızı beklemeniz gerekir.
      </p>

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
