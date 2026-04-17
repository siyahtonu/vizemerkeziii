import React from 'react';
import { CheckCircle2, Info, FileText, AlertTriangle, PenLine, Users, Briefcase } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'sponsor-dilekcesi-nasil-yazilir-ornek',
  title: 'Sponsor Dilekçesi Nasıl Yazılır? Örnek Şablonlar ve İpuçları',
  description: 'Vize başvurusu için sponsor dilekçesi nasıl yazılır? Noter onaylı örnek şablonlar, İngilizce sürüm, sık yapılan hatalar ve pratik ipuçları.',
  category: 'İpucu',
  readingTime: 9,
  date: '2026-04-17',
  tags: ['sponsor dilekçesi', 'taahhütname', 'vize belgeleri', 'şablon'],
};

const BIRINCI_DERECE = ['Eş', 'Anne ve baba', '18 yaş üstü çocuk'];
const IKINCI_DERECE = ['Kardeş', 'Büyükanne, büyükbaba', 'Torun'];
const UCUNCU_DERECE = [
  'Amca, dayı, hala, teyze',
  'Yeğen',
  'Yakın arkadaşlar (zayıf sponsor, destekleyici olarak kabul edilir)',
  'İş arkadaşları, yöneticiler (iş amaçlı başvurular için)',
];

const SPONSOR_BILGILERI = [
  'Tam adı ve soyadı',
  'TC kimlik numarası',
  'Doğum tarihi ve yeri',
  'Ev adresi',
  'Telefon numarası',
  'E-posta adresi',
  'Mesleği ve çalıştığı yer',
];

const BASVURUCU_BILGILERI = [
  'Tam adı ve soyadı',
  'TC kimlik numarası',
  'Doğum tarihi',
  'Pasaport numarası',
  'Akrabalık bağı (eş, oğul/kız, vb.)',
];

const SEYAHAT_BILGILERI = [
  'Hedef ülke (veya Schengen bölgesi)',
  'Seyahat tarihleri (gidiş-dönüş)',
  'Seyahat süresi',
  'Seyahat amacı (turizm, aile ziyareti, vb.)',
];

const FINANSAL_TAAHHUT = [
  '"Tüm masrafları karşılayacağım" beyanı',
  'Konaklama, yol, günlük harcama, sağlık masraflarını kapsadığı',
  'Başvurucunun ülkesine döneceğine dair garanti',
  'Sponsorun finansal sorumluluk aldığı açıklaması',
];

const HATALAR = [
  'Noter onayı yaptırmamak — en büyük hata, geçersiz kabul edilir',
  'Genel ifadelerle yazmak ("masrafları karşılarım") — detaylı kalem kalem belirtilmeli',
  'Finansal sorumluluğu belirsiz bırakmak — "kısmen" veya "gerekirse" gibi ifadelerden kaçının',
  'Başvurucunun bilgilerini eksik yazmak — TC kimlik no, pasaport no unutulmamalı',
  'Dönüş garantisi vermemek — "Türkiye\'ye döneceğine kefalet ediyorum" cümlesi mutlaka olmalı',
  'Tarihleri kontrol etmemek — gezi tarihleri ve sponsor dilekçesi uçak rezervasyonu ile uyumlu olmalı',
  'İmzanın eksik olması — dilekçe sponsor tarafından imzalanmalı, noter tarafından onaylanmalı',
];

const EK_BELGELER = [
  'Sponsorun kimlik belgesi fotokopisi (nüfus cüzdanı)',
  'Sponsorun son 6 aylık banka hesap dökümü',
  'Sponsorun çalışma belgesi (şirket antetli kağıtta)',
  'Sponsorun son 3 aylık maaş bordroları',
  'Sponsorun vergi levhası (şirket sahibiyse)',
  'Akrabalık bağını gösteren belgeler (vukuatlı nüfus kayıt örneği, evlilik cüzdanı)',
];

const ISVEREN_TAAHHUT = [
  'Şirket antetli kağıt',
  'Şirketin ticari unvanı, adresi, vergi numarası',
  'Çalışanın seyahat amacı ve süresi',
  'Seyahat masraflarının şirket tarafından karşılandığı beyanı',
  'İmza yetkilisinin imzası ve kaşesi',
];

const SSS = [
  {
    q: 'Sponsor dilekçesi noter onaylı olmazsa kabul edilir mi?',
    a: 'Çoğunlukla hayır. Schengen ve ABD gibi büyük vize başvuruları için noter onayı şarttır. Kabul edilen istisnalar: işveren sponsorluğu (şirket imza sirküsü yeterli).',
  },
  {
    q: 'Birden fazla sponsor olabilir mi?',
    a: 'Evet. Örneğin hem anne hem baba birlikte sponsor olabilir. Her biri ayrı dilekçe yazar, kendi banka dökümleri ve finansal belgeleri ekler. Bu, daha güçlü bir başvuru profili oluşturur.',
  },
  {
    q: 'Sponsor yurtdışında yaşıyorsa ne olur?',
    a: 'Yurtdışındaki akraba sponsorluk yapabilir. Bu durumda "davet üzerine ziyaret" başvurusu yapılır. Örneğin Almanya\'da yaşayan bir akraba, Verpflichtungserklärung ile sponsor olur. Başvurucu, davet amaçlı Schengen vizesi için başvurur.',
  },
  {
    q: 'Sponsor ne kadar banka bakiyesi göstermeli?',
    a: 'Başvurucunun seyahat maliyetinin en az 2-3 katı. Örneğin 10 günlük Almanya seyahati için sponsor, yaklaşık 150.000-200.000 TL banka bakiyesi göstermelidir.',
  },
  {
    q: 'Kendi adıma hiç belge yoksa, tamamen sponsor üzerinden başvurabilir miyim?',
    a: "Evet ama riskli. Sponsor belgeleri yeterli olsa bile, kendi adınıza da Türkiye'deki bağlarınızı gösteren belgeler (aile kaydı, ev tapusu) sunmanız başarı şansını artırır.",
  },
  {
    q: 'Dilekçeyi İngilizce yazabilir miyim, noter Türkçe mi onaylar?',
    a: 'Noter Türkçe yazılmış dilekçeyi onaylar. İngilizce versiyonu yeminli tercüman tarafından ayrı olarak hazırlanır. İki dilde de aynı içerik bulunmalıdır.',
  },
];

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'HowTo',
      name: POST.title,
      description: POST.description,
      step: [
        { '@type': 'HowToStep', name: 'Sponsor bilgilerini ekleyin', text: 'Ad, TC kimlik, adres, meslek, banka dökümü için gerekli bilgileri hazırlayın.' },
        { '@type': 'HowToStep', name: 'Başvurucu bilgilerini ekleyin', text: 'TC kimlik, pasaport numarası, akrabalık bağı mutlaka yer almalıdır.' },
        { '@type': 'HowToStep', name: 'Seyahat ve finansal taahhüdü yazın', text: 'Kalem kalem karşılanacak masraflar (ulaşım, konaklama, yaşam, sağlık) detaylı belirtilmeli.' },
        { '@type': 'HowToStep', name: 'Noter onayı alın', text: 'Sponsor dilekçesini noter tasdiki ile onaylatın, ardından yeminli tercüme yaptırın.' },
      ],
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

export default function SponsorDilekcesiOrnek() {
  return (
    <BlogPostLayout post={POST} schema={SCHEMA}>
      <p className="text-slate-700 leading-relaxed text-base mb-6">
        Sponsor dilekçesi, vize başvurusunun en önemli belgelerinden biridir — ama aynı zamanda
        en yanlış yazılanı da. İnternette dolaşan hatalı şablonlar, eksik bilgilendirmeler yüzünden
        pek çok başvuru gereksiz yere reddediliyor. Bu rehberde, geçerli bir sponsor dilekçesinin
        nasıl yazılacağını, hangi bilgilerin mutlaka bulunması gerektiğini ve örnek şablonlarla
        birlikte anlatıyoruz.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Sponsor Dilekçesi Nedir?</h2>
      <p className="text-slate-700 leading-relaxed mb-8">
        Sponsor dilekçesi (sponsorship letter), başvurucunun seyahat giderlerini üçüncü bir kişinin
        karşılayacağını beyan eden resmi taahhüt belgesidir. Genellikle aile üyeleri (eş, ebeveyn,
        kardeş, çocuk) veya yakın akrabalar tarafından verilir. Hem Schengen, hem ABD, hem
        İngiltere, hem Kanada başvurularında kabul edilir.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Sponsor Olarak Kim Beyan Verebilir?</h2>
      <p className="text-slate-700 leading-relaxed mb-4">Sponsor olma hakkı genellikle şu kişilerdedir:</p>

      <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">Birinci Derece Akrabalar (En Güçlü)</h3>
      <ul className="space-y-2 mb-6">
        {BIRINCI_DERECE.map((b) => (
          <li key={b} className="flex gap-2 text-slate-700">
            <Users className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">İkinci Derece Akrabalar</h3>
      <ul className="space-y-2 mb-6">
        {IKINCI_DERECE.map((b) => (
          <li key={b} className="flex gap-2 text-slate-700">
            <Users className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">Üçüncü Derece ve Yakın Kişiler</h3>
      <ul className="space-y-2 mb-6">
        {UCUNCU_DERECE.map((b) => (
          <li key={b} className="flex gap-2 text-slate-700">
            <Users className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-blue-900 text-sm leading-relaxed">
          <strong>Önemli:</strong> Sponsor ne kadar yakın akrabaysa, başvurunun başarı şansı o
          kadar artar. Konsolosluk, birinci derece aile üyelerinin taahhütlerine daha çok güvenir.
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Sponsor Dilekçesinde Olması Gerekenler</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Geçerli bir sponsor dilekçesinde aşağıdaki bilgiler bulunmalıdır:
      </p>

      <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">Sponsorun Bilgileri</h3>
      <ul className="space-y-2 mb-6">
        {SPONSOR_BILGILERI.map((b) => (
          <li key={b} className="flex gap-2 text-slate-700"><CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" /><span>{b}</span></li>
        ))}
      </ul>

      <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">Başvurucunun Bilgileri</h3>
      <ul className="space-y-2 mb-6">
        {BASVURUCU_BILGILERI.map((b) => (
          <li key={b} className="flex gap-2 text-slate-700"><CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" /><span>{b}</span></li>
        ))}
      </ul>

      <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">Seyahat Bilgileri</h3>
      <ul className="space-y-2 mb-6">
        {SEYAHAT_BILGILERI.map((b) => (
          <li key={b} className="flex gap-2 text-slate-700"><CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" /><span>{b}</span></li>
        ))}
      </ul>

      <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">Finansal Taahhüt</h3>
      <ul className="space-y-2 mb-6">
        {FINANSAL_TAAHHUT.map((b) => (
          <li key={b} className="flex gap-2 text-slate-700"><CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" /><span>{b}</span></li>
        ))}
      </ul>

      <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">Noter Onayı</h3>
      <p className="text-slate-700 leading-relaxed mb-8">
        Sponsor dilekçesi, noter tarafından tasdiklenmiş olmalıdır. Ev ve özel noterler bu işlemi
        15-30 dakika içinde yapabilir. Noter harcı 2026 yılı için yaklaşık 600-900 TL'dir.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Sponsor Dilekçesi Örnek Şablon 1: Eş Sponsorluğu</h2>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8">
        <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-line font-mono">
{`Sayın [Ülke] Başkonsolosluğu'na,

Ben, [Sponsor Tam Ad], [TC Kimlik No] kimlik numaralı, [Adres] adresinde ikamet eden, [Meslek] mesleğini icra etmekteyim. Eşim [Başvurucu Tam Ad] ([TC Kimlik No], Pasaport No: [Pasaport No])'un [Başlangıç Tarihi] - [Bitiş Tarihi] tarihleri arasında [Ülke] ülkesine yapacağı [Seyahat Amacı] amaçlı seyahati süresince;

1. Konaklama masraflarını,
2. Ulaşım masraflarını,
3. Günlük yaşam harcamalarını,
4. Sağlık ve acil durum masraflarını

tarafımdan karşılayacağımı, eşimin seyahat sonunda Türkiye'ye döneceğine kefalet ettiğimi ve bu konuda tüm finansal sorumluluğu üstlendiğimi beyan ederim.

Ek belgelerimle birlikte bu taahhütnameyi saygılarımla sunarım.

[Sponsor Tam Ad], İmza, Tarih`}
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Sponsor Dilekçesi Örnek Şablon 2: Ebeveyn Sponsorluğu (Öğrenci İçin)</h2>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8">
        <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-line font-mono">
{`Sayın [Ülke] Başkonsolosluğu'na,

Ben, [Ebeveyn Adı], [TC Kimlik No], [Adres] adresinde ikamet etmekteyim ve [Meslek] mesleğini icra ediyorum. Kızım/Oğlum [Öğrenci Adı] ([TC Kimlik No]), [Pasaport No] numaralı pasaporta sahiptir ve [Üniversite] adlı üniversitede [Program]'de eğitim görmektedir. Çocuğumun [Seyahat Tarihleri] tarihleri arasında [Ülke] ülkesinde [Seyahat Amacı] amacıyla bulunacağı süre zarfında;

1. Uçak biletleri,
2. Konaklama giderleri,
3. Günlük yaşam giderleri,
4. Sağlık sigortası ve acil sağlık masrafları,
5. Tüm diğer seyahat masrafları

tarafımdan karşılanacak olup, ekte sunulan banka dökümlerimde bu masrafları karşılayabileceğim ispat edilmektedir. Çocuğumun eğitim faaliyetleri sonrası Türkiye'ye kesin olarak döneceğini tekeffül ediyorum.

Saygılarımla.

[Ebeveyn Adı], İmza, Tarih`}
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Sponsor Dilekçesinde Sık Yapılan Hatalar</h2>
      <ol className="list-decimal list-inside space-y-2 text-slate-700 mb-8 pl-2">
        {HATALAR.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ol>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">İngilizce Çeviri Gerekli mi?</h2>
      <p className="text-slate-700 leading-relaxed mb-8">
        Evet, çoğu ülkede tavsiye edilir. Türkçe noter onaylı dilekçenin yanı sıra, yeminli
        tercüman tarafından yapılmış İngilizce veya hedef ülkenin dilindeki (Almanca, Fransızca,
        İspanyolca) çevirisi eklenmelidir. Yeminli tercüme ücreti genellikle 200-500 TL arasıdır.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Sponsor Dilekçesine Eklenmesi Gereken Belgeler</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Sponsor dilekçesi tek başına yeterli değildir. Ekinde şu belgeler olmalıdır:
      </p>
      <ul className="space-y-2 mb-8">
        {EK_BELGELER.map((b) => (
          <li key={b} className="flex gap-2 text-slate-700">
            <FileText className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Almanya İçin Özel Durum: Verpflichtungserklärung</h2>
      <p className="text-slate-700 leading-relaxed mb-8">
        Almanya, sponsor dilekçesi için kendi standart formunu kullanır: Verpflichtungserklärung.
        Bu form Almanya'daki sponsor (akraba, arkadaş) tarafından Alman yetkililerden alınır ve
        Türkiye'deki başvurucuya gönderilir. Normal Türkçe sponsor dilekçesinin yerine geçmez —
        Almanya'nın kendi formu gereklidir.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">İş Amaçlı Sponsor (İşveren Taahhütnamesi)</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        İş amaçlı seyahatlerde sponsor genellikle işveren olur. İşveren tarafından verilen sponsor
        dilekçesinde:
      </p>
      <ul className="space-y-2 mb-8">
        {ISVEREN_TAAHHUT.map((b) => (
          <li key={b} className="flex gap-2 text-slate-700">
            <Briefcase className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
            <span>{b}</span>
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
