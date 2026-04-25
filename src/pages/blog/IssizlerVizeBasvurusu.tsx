import React from 'react';
import { CheckCircle2, Info, AlertTriangle, Users, Heart, Sparkles, XCircle } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'issizler-ve-calismayanlar-icin-vize',
  title: 'İşsizler ve Çalışmayanlar İçin Vize Alabilir misiniz? 2026 Rehber',
  description: 'İşsizler, çalışmayanlar, iş arayanlar vize başvurusu yapabilir mi? Sponsor desteği ile Schengen, ABD, İngiltere vizesi nasıl alınır?',
  category: 'Genel',
  readingTime: 9,
  date: '2026-04-17',
  tags: ['işsiz vize', 'çalışmayan', 'sponsor', 'Schengen'],
};

const PROFILLER = [
  'İşten çıkarılmış, yeni iş arayanlar',
  'Emekli olmamış ama çalışmayan gençler',
  'Doğum sonrası çalışmayan anneler',
  'Üniversite mezunu, henüz iş bulamayanlar',
  'İstifa etmiş, seyahat sonrası yeni işe başlayacak olanlar',
  'Ev hanımları (ayrı kategori, farklı rehberimiz var)',
  'Engelli bireyler, çalışamama raporu olanlar',
];

const SPONSORLAR = [
  {
    tip: '1. Eş Sponsorluğu',
    aciklama:
      'Evliyseniz ve eşiniz çalışıyorsa, en güçlü sponsorluk seçeneğidir. Aile bağı ve ortak finansal sorumluluk, konsolosluk gözünde güven sinyali verir.',
  },
  {
    tip: '2. Ebeveyn Sponsorluğu',
    aciklama:
      'Ebeveynleriniz çalışıyor veya emekliyse, sponsor olabilirler. Özellikle 25 yaş altı gençler için uygun seçenektir.',
  },
  {
    tip: '3. Kardeş Sponsorluğu',
    aciklama:
      'Kardeşlerinizin finansal durumu sağlamsa sponsor olabilirler. Ancak birinci derece akraba olan ebeveynler veya eş kadar güçlü değildir.',
  },
  {
    tip: '4. Yurtdışı Akraba Sponsorluğu (Davet Üzerine)',
    aciklama:
      'Gitmek istediğiniz ülkede akrabalarınız varsa, onlar sizi davet edebilir. Bu durumda "davet üzerine ziyaret" başvurusu yapılır ve farklı belge gerektirir.',
  },
];

const BIREYSEL_PROFIL = [
  'Banka hesabında 100.000-200.000 TL birikim (tutarın uzun süredir orada olduğu kanıtlanmalı)',
  'Mülk sahipliği (ev, arsa — tapu belgeleri)',
  'Düzenli ek gelir (kira, yatırım, temettü)',
  'Eski çalışma geçmişi (işten çıkarıldıysanız önceki çalışma belgeleri)',
  'Eğitim durumu (yüksek lisans, doktora gibi kıymetli belgeler)',
];

const BELGE_BLOKLARI = [
  {
    baslik: 'Standart Belgeler',
    items: [
      'Pasaport, fotoğraf, başvuru formu',
      'Seyahat sigortası (30.000 € Schengen için)',
      'Uçak ve otel rezervasyonu',
      'Seyahat planı',
    ],
  },
  {
    baslik: 'Çalışmadığınızı Gösteren Belgeler',
    items: [
      'SGK Hizmet Dökümü (son 5 yıl)',
      'Önceki çalışma belgeleriniz (varsa)',
      'İstifa/işten çıkış belgesi (son iş için)',
      'İşsizlik ödeneği belgesi (alıyorsanız)',
    ],
  },
  {
    baslik: 'Finansal Güç Kanıtı',
    items: [
      'Kendi banka hesap dökümünüz (son 6 ay)',
      'Yatırım hesaplarınız (varsa)',
      'Tapu belgeleri',
      'Araç ruhsatı',
    ],
  },
  {
    baslik: 'Sponsor Belgeleri',
    items: [
      'Sponsor taahhüdü (noter onaylı)',
      'Sponsorun kimlik bilgileri',
      'Sponsorun banka dökümü (son 6 ay)',
      'Sponsorun çalışma belgesi, maaş bordroları',
      'Sponsorla akrabalık belgesi',
    ],
  },
];

const SEYAHAT_AMACLARI = [
  'Kültürel gezi: Floransa müzeleri, Paris sanat turları, Roma tarihi',
  'Aile ziyareti: Yakın akraba, arkadaş ziyareti (davet mektubu ile)',
  'Sağlık turizmi: Belirli sağlık hizmetleri, tıbbi kontrol',
  'Fuar veya etkinlik: Uluslararası fuar, konferans, festival katılımı',
  'Dil kursu: Kısa süreli dil eğitimi',
  'Düğün, cenaze, aile olayı: Spesifik aile olayı için ziyaret',
];

const HATALAR = [
  '"İşsizim ama maddi durumum iyi" demekle yetinmek — kanıt gerekir',
  'Sponsor belgelerini yetersiz hazırlamak',
  'Belirsiz seyahat amacı ("gezmek") beyan etmek',
  "Türkiye'de bağlarınızı kanıtlamamak (ev, aile, mülk belgelerini atlamak)",
  'Uzun süreli seyahat planı (20-30 gün) — konsolosluk şüphelenir',
  '"İş bulduğumda gelirim" gibi muğlak vaatler',
];

const ULKE_KATEGORILERI = [
  { renk: 'emerald', baslik: 'Daha kolay', ulkeler: 'İtalya, Yunanistan, İspanya (turizm odaklı, esnek)' },
  { renk: 'amber', baslik: 'Orta', ulkeler: 'Fransa, Portekiz, Macaristan' },
  { renk: 'orange', baslik: 'Daha sıkı', ulkeler: 'Almanya, Hollanda, Belçika, Norveç (göçmenlik riskine hassas)' },
  { renk: 'red', baslik: 'Çok sıkı', ulkeler: 'ABD, İngiltere, Kanada (iş geçmişi titizlikle incelenir)' },
];

const SSS = [
  {
    q: 'Hiç çalışmadım, hayatımda SGK kaydım yok, vize alabilir miyim?',
    a: "Evet ama zor. Sponsor (ebeveyn veya eş) olmalı ve Türkiye'deki güçlü bağlarınız gösterilmeli. Kolay ülkeler (İtalya, Yunanistan) tercih edilmeli.",
  },
  {
    q: 'İşsizlik ödeneği alıyorum, bu kanıt olur mu?',
    a: 'Kısmen. İşsizlik ödeneği resmi bir gelir gibi görülür ama tek başına yeterli değildir. Ek birikim veya sponsor gerekir.',
  },
  {
    q: 'Yeni istifa ettim, ay sonunda başka işe başlayacağım, ne yapmalıyım?',
    a: 'Yeni iş sözleşmeniz varsa mükemmel bir kanıttır. "Hem ayrıldım hem döneceğim" durumu göstermek, Türkiye\'ye bağlılık kanıtıdır. Yeni iş sözleşmesini mutlaka başvuruya ekleyin.',
  },
  {
    q: 'Eşim iş yapmıyor, kendi başıma vize nasıl alırım?',
    a: 'Sizin veya eşinizin ebeveynleri sponsor olabilir. Alternatif olarak, birikimleriniz, mülkleriniz ve aile bağlarınız (çocuklarınızın okul kaydı) güçlü gösterilmelidir.',
  },
  {
    q: 'Borçluyum, vize alabilir miyim?',
    a: 'Borçlu olmak tek başına engel değildir. Kredi kartı borcu, konut kredisi, ihtiyaç kredisi gibi normal borçlar sorun değildir. Ancak icra takibi, haciz gibi ciddi borç durumları konsoloslukça değerlendirilir.',
  },
  {
    q: 'Engelli raporum var, nasıl başvurmalıyım?',
    a: 'Engellilik vize başvurusuna engel değildir. Sağlık raporunuz, engellilik belgeniz eklenir. Seyahat sigortası, engellilik durumunu kapsayacak özel bir poliçe olmalıdır. Refakatçi ile seyahat etmeniz tavsiye edilir (ona ayrı başvuru).',
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

const COLOR_MAP: Record<string, string> = {
  emerald: 'border-emerald-200 bg-emerald-50',
  amber: 'border-amber-200 bg-amber-50',
  orange: 'border-orange-200 bg-orange-50',
  red: 'border-red-200 bg-red-50',
};

export default function IssizlerVizeBasvurusu() {
  return (
    <BlogPostLayout post={POST} schema={SCHEMA}>
      <p className="text-slate-700 leading-relaxed text-base mb-6">
        "İşim yok, vize alamam" — bu cümleyi binlerce kişi söylüyor ve seyahat etmekten
        vazgeçiyor. Oysa işsiz veya çalışmayan bir birey de, doğru stratejiyle vize alabilir.
        İşsizlik tek başına bir ret sebebi değildir — asıl önemli olan, Türkiye'de güçlü
        bağlarınızın olması ve seyahat süresince kendinizi finanse edebileceğinizdir. Bu rehber,
        çalışmayan profillerin vize başvurusunu başarıyla nasıl tamamlayabileceğini anlatıyor.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">İşsizlik Vize Başvurusunda Ne Demek?</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Vize başvurusunda "çalışmayan" kategorisine giren profiller:
      </p>
      <ul className="space-y-2 mb-6">
        {PROFILLER.map((p) => (
          <li key={p} className="flex gap-2 text-slate-700">
            <Users className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
      <p className="text-slate-700 leading-relaxed mb-8">
        Her profilin farklı dinamikleri vardır. Ancak ortak noktada finansal kanıt, ailesel bağ ve
        seyahat amacı netliği ön plandadır.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Kritik Faktör: Sponsorun Kim Olacağı</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Çalışmayan başvurucular için sponsorluk zorunlu değildir ama önemli ölçüde avantajlıdır.
        Sponsor tipleri:
      </p>
      <div className="space-y-4 mb-8">
        {SPONSORLAR.map((s) => (
          <div key={s.tip} className="border border-slate-200 rounded-xl p-5 bg-white">
            <h3 className="font-semibold text-slate-900 mb-2">{s.tip}</h3>
            <p className="text-slate-700 text-sm leading-relaxed">{s.aciklama}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Bireysel Başvuru İçin Güçlü Finansal Profil</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Sponsor olmadan, kendi adınıza başvurmak da mümkündür. Ancak çok güçlü bir finansal
        profil gerekir:
      </p>
      <ul className="space-y-2 mb-4">
        {BIREYSEL_PROFIL.map((b) => (
          <li key={b} className="flex gap-2 text-slate-700">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 flex gap-3">
        <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <p className="text-red-900 text-sm leading-relaxed">
          "Hiç param yok, işim yok, ama gezmek istiyorum" başvurusu, konsolosluk için yüksek risk
          sinyalidir.
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">İşsiz Başvurucu İçin Gerekli Belgeler</h2>
      <div className="space-y-4 mb-8">
        {BELGE_BLOKLARI.map((b) => (
          <div key={b.baslik} className="border border-slate-200 rounded-xl p-5 bg-white">
            <h3 className="font-semibold text-slate-900 mb-3">{b.baslik}</h3>
            <ul className="space-y-2">
              {b.items.map((i) => (
                <li key={i} className="flex gap-2 text-slate-700 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                  <span>{i}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Seyahat Amacı Nasıl Formüle Edilmeli?</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Çalışmayan birey için en kritik soru "neden gidiyorsunuz?" olacaktır. Genel "turizm"
        ifadesi yetersizdir. Daha spesifik amaçlar:
      </p>
      <ul className="space-y-2 mb-8">
        {SEYAHAT_AMACLARI.map((a) => (
          <li key={a} className="flex gap-2 text-slate-700">
            <Sparkles className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
            <span>{a}</span>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">"İş Arıyorum" Beyanı Risk mi?</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Bazı başvurucular, "yeni iş aradığım için seyahat ediyorum" diye beyan verir. Bu, çok
        riskli bir stratejidir. Konsolosluk bu beyanı "kaçıp kalmaya çalışabilir" olarak algılar.
        Çalışma amaçlı seyahat için zaten farklı vize türleri vardır (iş arama vizesi — Jobseeker
        Visa).
      </p>
      <p className="text-slate-700 leading-relaxed mb-8">
        Eğer gerçekten Almanya, Hollanda, İrlanda gibi ülkelere iş aramaya gidiyorsanız, özel "iş
        arama vizesi" için başvurmanız gerekir (6-12 ay geçerli, farklı belgeler).
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Başarı Hikayesi: Can Bey'in Stratejisi</h2>
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-8 flex gap-3">
        <Heart className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <p className="text-emerald-900 text-sm leading-relaxed">
          32 yaşında, son 8 ayda işsiz, henüz iş bulamamış Can Bey, ilk başvurusunda reddedildi.
          İkinci başvurusunda şu stratejiyi uyguladı: (1) babası emekli ve sponsor oldu (aylık
          25.000 TL emekli maaşı), (2) kendi banka hesabında iki yıldır 80.000 TL birikim
          gösterdi, (3) ailenin İstanbul'da 3 dairesi var (tapu belgeleri eklendi), (4) Roma'da 7
          günlük net seyahat planı hazırladı (müzeler, turlar), (5) iki yıl önceki çalıştığı yerden
          "geri dönüş teklifi" alındığını gösteren bir mesaj. Başvurusu onaylandı.
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Sık Yapılan Hatalar</h2>
      <ol className="list-decimal list-inside space-y-2 text-slate-700 mb-8 pl-2">
        {HATALAR.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ol>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Hangi Ülkeler İşsizlere Daha Toleranslı?</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Tüm ülkeler için kural teknik olarak aynı olsa da, bazı ülkeler çalışmayan başvurculara
        daha esnek yaklaşır:
      </p>
      <div className="grid gap-3 sm:grid-cols-2 mb-8">
        {ULKE_KATEGORILERI.map((k) => (
          <div key={k.baslik} className={`border rounded-xl p-4 ${COLOR_MAP[k.renk]}`}>
            <h3 className="font-semibold text-slate-900 mb-1">{k.baslik}</h3>
            <p className="text-slate-700 text-sm">{k.ulkeler}</p>
          </div>
        ))}
      </div>

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
