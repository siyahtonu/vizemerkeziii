import React from 'react';
import { CheckCircle2, Info, ShieldCheck, Globe, Award, AlertTriangle, XCircle, Users } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'yesil-pasaport-avantajlari-vizesiz-ulkeler-2026',
  title: 'Yeşil Pasaport Avantajları ve Vizesiz Ülkeler 2026',
  description: 'Yeşil pasaport nedir? Kim alabilir? Hangi ülkelere vizesiz gidilir? 2026 güncel avantajlar, kullanım kuralları ve başvuru süreci.',
  category: 'Genel',
  readingTime: 9,
  date: '2026-04-17',
  tags: ['yeşil pasaport', 'hususi pasaport', 'vizesiz ülkeler', 'Türk pasaportu'],
};

const HAK_SAHIPLERI = [
  'Devlet memurlarından 1., 2. ve 3. derece kadrolarda olanlar',
  'Emekli olurken 1. veya 2. derece görevde olanlar',
  'TBMM üyeleri, eski milletvekilleri',
  'Büyükelçiler, başkonsoloslar (görev sonrası da)',
  'Yargı mensupları (hakimler, savcılar — bazı kademelerde)',
  'Belediye başkanları (büyükşehir ve il)',
  'Yukarıdakilerin eşleri ve 18 yaş altı çocukları',
  '25 yaşını doldurmamış, evli olmayan, çalışmayan, eğitimini sürdüren çocuklar',
];

const AVANTAJLAR = [
  {
    baslik: '1. Vizesiz Seyahat',
    aciklama:
      'En büyük avantaj: Pek çok Avrupa, Asya ve Amerika ülkesine vizesiz giriş hakkı. Normal pasaportla Schengen 90 € vize ücreti ödeyen bir Türk, yeşil pasaportla aynı ülkelere ücretsiz giriş yapar.',
  },
  {
    baslik: '2. Daha Uzun Kalış Hakkı',
    aciklama:
      'Bazı ülkelerde yeşil pasaport sahibi, normal pasaportla 30 gün kalabileceği bir ülkede 60-90 gün kalabilir. Örneğin Kazakistan yeşil pasaportla 90 güne kadar vizesiz kabul eder.',
  },
  {
    baslik: '3. Hızlı Giriş',
    aciklama:
      'Birçok havalimanında yeşil pasaport sahipleri için özel kuyruk (Fast Track) vardır. Özellikle Türkiye\'ye dönüşte Türk havalimanlarında bu avantaj kullanılır.',
  },
  {
    baslik: '4. Diplomatik Koruma (Sınırlı)',
    aciklama:
      'Yeşil pasaport, diplomatik dokunulmazlık sağlamaz ama bazı konsolosluk işlemlerinde öncelik sunar.',
  },
];

const ASYA_ULKELER = [
  'Kazakistan (90 gün)',
  'Kırgızistan (90 gün)',
  'Gürcistan (1 yıl)',
  'Azerbaycan (90 gün)',
  'Malezya (30 gün)',
  'Singapur (90 gün)',
  'Tayland (30 gün)',
  'Endonezya (30 gün)',
  'Güney Kore (90 gün)',
  'Japonya (90 gün)',
  'Hong Kong (90 gün)',
  'Moğolistan (30 gün)',
  'İran (90 gün)',
];

const AMERIKA_ULKELER = [
  'Brezilya (90 gün)',
  'Arjantin (90 gün)',
  'Şili (90 gün)',
  'Kolombiya (90 gün)',
  'Peru (90 gün)',
  'Panama (180 gün)',
  'Meksika (180 gün — ETA gerekebilir)',
];

const AFRIKA_ULKELER = [
  'Güney Afrika (90 gün)',
  'Tunus (90 gün)',
  'Fas (90 gün)',
  'Kenya (e-vize, kolay)',
  'Tanzanya (kapıda vize)',
];

const VIZE_GEREKEN = [
  'ABD: Vize zorunlu (normal başvuru, 185 USD)',
  'İngiltere: Vize zorunlu (115 £+)',
  'Kanada: Vize zorunlu (100 CAD+)',
  'Avustralya: Vize zorunlu (ETA başvurusu)',
  'Yeni Zelanda: Vize zorunlu',
  'Çin: Vize zorunlu',
  'Hindistan: Vize zorunlu (e-vize mümkün)',
  'Rusya: Vize zorunlu',
  'Suudi Arabistan: Vize zorunlu',
  'BAE (Dubai): E-vize zorunlu',
];

const BASVURU_ADIMLARI = [
  'Kurumunuzdan yeşil pasaport hak sahipliği yazısı alın',
  "İl Emniyet Müdürlüğü Pasaport Şubesi'ne randevu alın",
  'Pasaport başvuru formunu doldurun',
  'Biyometrik fotoğraf ve imza için şubeye gidin',
  'Pasaport harcı ve değerli kağıt bedelini ödeyin',
  '15-30 gün içinde pasaport teslim alınır',
];

const KULLANIM_KURALLARI = [
  'Hak sahipliği devam ettiği sürece geçerli',
  'Görev değişikliği halinde yenilenmesi gerekebilir',
  'Emekli olduğunuzda, son görevinizin derecesi belirleyicidir',
  'Aile üyeleri için de hak sahipliği devam etmeli',
  '18 yaşını geçen, evlenen, çalışmaya başlayan çocuklar artık yararlanamaz',
];

const UYARILAR = [
  'Hak sahipliğiniz sona erdiğinde yeşil pasaport geçersiz olur — yolda sorun yaşarsınız',
  'Bazı ülkeler giriş bilgilerinizi özel sisteme kaydeder — overstay riski',
  "Yeşil pasaportla bile 90/180 gün kuralı Schengen'de geçerlidir (sınırlı kalış)",
  'İki pasaport (yeşil + bordro) sahibi iseniz giriş-çıkışlarda aynı pasaportu kullanın',
  'Yurtdışında uzun süre (6 ay+) kalmak vatandaşlık ve hak sahipliği sorunları yaratabilir',
];

const SSS = [
  {
    q: "Yeşil pasaportla ABD'ye vizesiz gidebilir miyim?",
    a: 'Hayır. ABD, Türk yeşil pasaportuna vizesiz giriş hakkı tanımaz. Normal vize başvurusu (185 USD) gerekir.',
  },
  {
    q: 'Emekli olunca yeşil pasaportum iptal olur mu?',
    a: 'Hayır. Emekli olduğunuzda son görev dereceniz yeterliyse (1. veya 2. derece), yeşil pasaport hakkınız devam eder. Ancak ilk başta 3. derecede emekli olanlar hakkı kaybeder.',
  },
  {
    q: 'Eşim çalışıyor ama ben ev hanımıyım, yeşil pasaport alabilir miyim?',
    a: 'Eşiniz yeşil pasaport hak sahibi ise, siz de eş olarak hak sahibisiniz. Başvurunuz eşinizin yazısı ile yapılır.',
  },
  {
    q: '25 yaşındayım, üniversiteyi bitirdim, yeşil pasaport hakkım sürer mi?',
    a: '25 yaşını doldurmamış, evli olmayan, eğitimi devam eden çocuklar yararlanır. 25 yaş sonrası veya mezuniyet sonrası hak sona erer. Bekarlığınız ve eğitiminiz devam ediyorsa 25 yaşına kadar devam eder.',
  },
  {
    q: 'Yeşil pasaportla Schengen bölgesinde 90 gün üzeri kalabilir miyim?',
    a: 'Hayır. Yeşil pasaport sadece vize muafiyeti sağlar, kalış süresini uzatmaz. 180 gün içinde 90 gün kuralı yine geçerlidir.',
  },
  {
    q: 'İşten çıkarıldım, yeşil pasaportum geçersiz mi oldu?',
    a: 'Evet. Göreviniz sona erdiğinde yeşil pasaport hak sahipliğiniz biter. Pasaportunuzu iade etmeniz gerekir. Seyahatlerde hak sahipliğiniz kontrol edilebilir.',
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

export default function YesilPasaportAvantajlari() {
  return (
    <BlogPostLayout post={POST} schema={SCHEMA}>
      <p className="text-slate-700 leading-relaxed text-base mb-6">
        Yeşil pasaport — resmi adıyla hususi damgalı pasaport — Türkiye'nin en güçlü seyahat
        belgesi. Sahibine dünyanın birçok ülkesine vizesiz giriş hakkı tanıyan bu pasaport, kimlere
        verilir? Hangi avantajları sunar? 2026'da hangi ülkelere vizesiz gidilir? Bu rehberde yeşil
        pasaporta dair her şey var.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Yeşil Pasaport Nedir?</h2>
      <p className="text-slate-700 leading-relaxed mb-8">
        Yeşil pasaport (hususi damgalı pasaport), devlet memurlarına, belirli unvan ve statüdeki
        kişilere ve emekli devlet görevlilerine verilen özel bir pasaport türüdür. Hem yurtiçinde
        hem de yurtdışında ayrıcalıklı işlem sağlar. Normal bordo pasaporttan ayrılan temel
        özelliği: seyahat kolaylığı.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Yeşil Pasaportu Kimler Alabilir?</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        5682 sayılı Pasaport Kanunu'nda belirlenen kriterlere göre yeşil pasaport hakkı:
      </p>
      <ul className="space-y-2 mb-4">
        {HAK_SAHIPLERI.map((h) => (
          <li key={h} className="flex gap-2 text-slate-700">
            <Users className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
            <span>{h}</span>
          </li>
        ))}
      </ul>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-amber-900 text-sm leading-relaxed">
          2017'den itibaren 50.000 USD ve üzeri ihracat yapan iş insanlarına da yeşil pasaport
          verilmeye başlandı — ancak bu uygulama 2023'te kaldırıldı. Şu anda sadece devlet
          görevlileri ve aileleri yararlanabiliyor.
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Yeşil Pasaport Avantajları</h2>
      <div className="space-y-4 mb-8">
        {AVANTAJLAR.map((a) => (
          <div key={a.baslik} className="border border-slate-200 rounded-xl p-5 bg-white">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-brand-600" />
              <h3 className="font-semibold text-slate-900">{a.baslik}</h3>
            </div>
            <p className="text-slate-700 text-sm leading-relaxed">{a.aciklama}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Yeşil Pasaportla Vizesiz Gidilen Ülkeler (2026)</h2>
      <p className="text-slate-700 leading-relaxed mb-6">
        2026 güncel listesi (91 ülke civarı). Bazı ülkeler için kısa süreli vizesiz giriş, bazıları
        için kapıda vize avantajı vardır.
      </p>

      <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">Avrupa</h3>
      <div className="border border-slate-200 rounded-xl p-4 bg-white mb-4">
        <p className="font-semibold text-slate-900 mb-1">Schengen bölgesi (27 ülke):</p>
        <p className="text-slate-700 text-sm leading-relaxed">
          Almanya, Fransa, İtalya, İspanya, Hollanda, Belçika, Avusturya, Portekiz, Yunanistan,
          İsveç, Norveç (Schengen üyesi), Danimarka, Finlandiya, Polonya, Çek Cumhuriyeti,
          Macaristan, Slovakya, Slovenya, Hırvatistan, Lüksemburg, Malta, İsviçre (Schengen
          üyesi), Estonya, Letonya, Litvanya, Bulgaristan, Romanya, İzlanda, Lihtenştayn.
        </p>
      </div>
      <div className="border border-slate-200 rounded-xl p-4 bg-white mb-8">
        <p className="font-semibold text-slate-900 mb-1">Schengen dışı Avrupa:</p>
        <p className="text-slate-700 text-sm leading-relaxed">
          Arnavutluk, Bosna Hersek, Kuzey Makedonya, Karadağ, Sırbistan, Kosova, Moldova,
          Ukrayna.
        </p>
      </div>

      <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">Asya</h3>
      <ul className="grid gap-2 sm:grid-cols-2 mb-8">
        {ASYA_ULKELER.map((u) => (
          <li key={u} className="flex gap-2 text-slate-700 text-sm">
            <Globe className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
            <span>{u}</span>
          </li>
        ))}
      </ul>

      <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">Amerika ve Latin Amerika</h3>
      <ul className="grid gap-2 sm:grid-cols-2 mb-8">
        {AMERIKA_ULKELER.map((u) => (
          <li key={u} className="flex gap-2 text-slate-700 text-sm">
            <Globe className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
            <span>{u}</span>
          </li>
        ))}
      </ul>

      <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">Afrika</h3>
      <ul className="grid gap-2 sm:grid-cols-2 mb-8">
        {AFRIKA_ULKELER.map((u) => (
          <li key={u} className="flex gap-2 text-slate-700 text-sm">
            <Globe className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
            <span>{u}</span>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Yeşil Pasaportla Vize Gerektiren Önemli Ülkeler</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Yeşil pasaport her yerde geçerli değildir. Aşağıdaki ülkelere vizesiz gidilemez:
      </p>
      <ul className="space-y-2 mb-8">
        {VIZE_GEREKEN.map((v) => (
          <li key={v} className="flex gap-2 text-slate-700">
            <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <span>{v}</span>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Yeşil Pasaport Nasıl Alınır?</h2>
      <p className="text-slate-700 leading-relaxed mb-4">Yeşil pasaport başvurusu için:</p>
      <ol className="list-decimal list-inside space-y-2 text-slate-700 mb-8 pl-2">
        {BASVURU_ADIMLARI.map((a) => (
          <li key={a}>{a}</li>
        ))}
      </ol>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Yeşil Pasaport Ücreti 2026</h2>
      <ul className="space-y-2 mb-8">
        <li className="flex gap-2 text-slate-700"><CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" /><span>Hususi damgalı pasaport harcı: Tüm pasaport türleri gibi devlet harcı</span></li>
        <li className="flex gap-2 text-slate-700"><CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" /><span>4 yıllık geçerlilik: ~800 TL</span></li>
        <li className="flex gap-2 text-slate-700"><CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" /><span>8 yıllık geçerlilik: ~1.600 TL</span></li>
        <li className="flex gap-2 text-slate-700"><CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" /><span>10 yıllık geçerlilik: ~2.000 TL</span></li>
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Yeşil Pasaport Kullanım Kuralları</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Yeşil pasaport kullanmak özel kurallara tabidir:
      </p>
      <ol className="list-decimal list-inside space-y-2 text-slate-700 mb-8 pl-2">
        {KULLANIM_KURALLARI.map((k) => (
          <li key={k}>{k}</li>
        ))}
      </ol>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Yeşil Pasaportla Seyahat Uyarıları</h2>
      <ul className="space-y-2 mb-8">
        {UYARILAR.map((u) => (
          <li key={u} className="flex gap-2 text-slate-700">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <span>{u}</span>
          </li>
        ))}
      </ul>

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
