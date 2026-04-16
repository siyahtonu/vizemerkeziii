import React from 'react';
import { AlertTriangle, CheckCircle2, Info, ShieldCheck } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'schengen-vizesi-nasil-alinir',
  title: "Schengen Vizesi Nasıl Alınır? 2026 Güncel Adım Adım Rehber",
  description: "Türk vatandaşları için Schengen vizesi başvurusu: hangi ülkeye başvurulur, hangi belgeler gerekir, banka hesabı nasıl olmalı, bekleme süresi ne kadar? Randevudan onaya eksiksiz rehber.",
  category: 'Schengen',
  readingTime: 10,
  date: '2026-04-16',
  tags: ['Schengen vizesi', 'vize başvurusu', 'vize belgeleri', 'Schengen 2026', 'nasıl alınır'],
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
      name: 'Schengen vizesi başvurusu ne kadar önce yapılmalı?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Schengen vizesi başvurusu, seyahat tarihinden en az 15 iş günü (yaklaşık 3 hafta) önce yapılmalıdır. Yoğun dönemlerde (yaz, tatil sezonları) Almanya ve Fransa gibi ülkeler için randevu 6-8 hafta öncesinden alınabilmektedir. Güvenli plan için seyahat tarihinden 2 ay önce başvuru sürecini başlatın.',
      },
    },
    {
      '@type': 'Question',
      name: 'Hangi ülkenin konsolosluğuna başvurulur?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Schengen kuralına göre en uzun süre konaklayacağınız ülkenin konsolosluğuna başvurmanız gerekir. Birden fazla ülkeyi eşit süre geçirecekseniz ilk giriş yapacağınız Schengen ülkesine başvurulur. 'Kolay vize almak' için ana destinasyonunuzu değiştirmek kurallara aykırıdır ve vize iptaline yol açabilir.",
      },
    },
    {
      '@type': 'Question',
      name: 'Banka hesabında ne kadar para olmalı?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Kesin bir yasal minimum yoktur ancak pratikte gün başına 50-100 Euro gösterilmesi beklenmektedir. 10 günlük seyahat için hesapta en az 500-1000 Euro görünmesi tavsiye edilir. Hesap son 3-6 ayı yansıtmalı, para aniden yatırılmış olmamalı, düzenli gelir akışı göstermelidir.",
      },
    },
    {
      '@type': 'Question',
      name: 'Schengen vize ücreti ne kadar?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "2026 itibarıyla standart Schengen vize ücreti 90 Euro (yetişkin), 45 Euro (6-12 yaş çocuk) ve 0 Euro (6 yaş altı çocuk) olarak belirlenmiştir. VFS gibi aracı merkezler ek hizmet bedeli alabilir (+15-30 Euro). Ücret ret durumunda iade edilmez.",
      },
    },
    {
      '@type': 'Question',
      name: 'Ret alırsam ne yapabilirim?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Ret bildirimi ret kodunu ve gerekçesini içermelidir. Red kararına 8 hafta içinde itiraz hakkınız vardır. İtirazı ret kararını veren konsolosluğun bağlı olduğu ülkenin itiraz makamına yazılı yaparsınız. Alternatif olarak eksikliği tamamlayıp yeni başvuru da yapılabilir.",
      },
    },
    {
      '@type': 'Question',
      name: 'Seyahat sigortası zorunlu mu?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Evet, Schengen vizesi için tüm seyahat süresini kapsayan, minimum 30.000 Euro tıbbi kapsamlı ve Schengen bölgesinin tamamında geçerli sigorta zorunludur. Sigorta poliçesinin başlangıç ve bitiş tarihleri seyahat tarihleriyle örtüşmelidir.",
      },
    },
  ],
};

const BELGELER = [
  { grup: 'Kimlik ve Pasaport', belgeler: ['Geçerli pasaport (son 3 ayda düzenlenmemiş, en az 2 boş sayfa)', 'Pasaportun tüm sayfa fotokopisi', 'Nüfus cüzdanı fotokopisi', 'Varsa önceki pasaportlar'] },
  { grup: 'Başvuru Formu ve Fotoğraf', belgeler: ['İmzalı Schengen başvuru formu', '2 adet biyometrik fotoğraf (son 6 ay)'] },
  { grup: 'Seyahat Planı', belgeler: ['Uçak rezervasyonu (bilet değil, rezervasyon)', 'Otel rezervasyonu veya ev sahibi davet mektubu', 'Seyahat güzergahı / itinerary'] },
  { grup: 'Finansal Kanıt', belgeler: ['Son 3-6 ay banka hesap özeti', 'Maaş bordrosu (son 3 ay)', 'Varsa tapu, araç belgesi, diğer varlık kanıtları'] },
  { grup: 'Bağlılık Kanıtı', belgeler: ['Çalışan: İşe giriş bildirimi + izin yazısı + SGK dökümü', 'Serbest meslek: Vergi levhası + Ticaret Sicil', 'Öğrenci: Öğrenci belgesi + transkript', 'Emekli: Emekli maaş belgesi'] },
  { grup: 'Sigorta', belgeler: ['30.000 Euro teminatlı Schengen seyahat sigortası', 'Tüm seyahat tarihlerini kapsamalı'] },
];

export default function SchengenNasilAlinir() {
  return (
    <BlogPostLayout post={POST} schema={[ARTICLE_SCHEMA, FAQ_SCHEMA]}>

      <p className="text-slate-700 leading-relaxed text-base mb-6">
        Schengen vizesi, Türkiye'den en çok başvuru yapılan vize türü ve aynı zamanda
        en çok soru işareti taşıyanı. Hangi konsolosluk, hangi belgeler, banka hesabı
        nasıl gösterilmeli, ne zaman başvurulmalı — bu sorulara net ve pratik cevaplar.
        2026 güncellemelerini de içeren, adım adım tam rehber.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Schengen Bölgesi Nedir?</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Schengen bölgesi, aralarındaki sınır kontrollerini kaldırmış 27 Avrupa ülkesinden
        oluşur. Tek bir Schengen vizesiyle bu ülkelerin tamamında seyahat edebilirsiniz.
        Türk vatandaşları Schengen bölgesine girmek için vize almak zorundadır.
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-blue-800 text-sm leading-relaxed">
          <strong>2026 Hatırlatması:</strong> 10 Nisan 2026 itibarıyla Schengen sınırlarında
          EES (Entry/Exit System) tam kapasiteyle çalışıyor. Artık pasaport damgası yok;
          giriş-çıkışlar biyometrik olarak kayıt altına alınıyor. 90/180 gün kuralı
          sistematik olarak takip ediliyor.
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Adım 1: Hangi Konsolosluğa Başvurulur?</h2>
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { durum: 'Tek ülke ziyareti', kural: 'O ülkenin konsolosluğuna başvurun.' },
          { durum: 'Birden fazla ülke — farklı süreler', kural: 'En uzun konakladığınız ülkeye başvurun.' },
          { durum: 'Eşit süreli çoklu ülke', kural: 'İlk giriş yapacağınız ülkeye başvurun.' },
        ].map(({ durum, kural }) => (
          <div key={durum} className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm">
            <p className="font-bold text-slate-800 mb-1">{durum}</p>
            <p className="text-slate-600 leading-relaxed">{kural}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Adım 2: Gerekli Belgeler</h2>
      <div className="space-y-4 mb-8">
        {BELGELER.map(({ grup, belgeler }) => (
          <div key={grup} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-100 px-4 py-2">
              <p className="font-semibold text-slate-800 text-sm">{grup}</p>
            </div>
            <ul className="p-4 space-y-1">
              {belgeler.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Adım 3: Banka Hesabı Nasıl Gösterilmeli?</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Mali yeterlilik, ret kararlarında en sık gösterilen gerekçelerden biridir.
        Doğru gösterim şöyle olmalıdır:
      </p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm">
          <p className="font-semibold text-red-700 mb-2">Yanlış Yaklaşım</p>
          <ul className="space-y-1 text-red-700">
            <li>• Başvuru öncesi hesaba büyük nakit yatırmak</li>
            <li>• Yalnızca yüksek bakiye, düzenli akış yok</li>
            <li>• Başkasından ödünç alınan para gösterimi</li>
            <li>• Sadece son 1 aylık özet sunmak</li>
          </ul>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm">
          <p className="font-semibold text-emerald-700 mb-2">Doğru Yaklaşım</p>
          <ul className="space-y-1 text-emerald-700">
            <li>• Son 6 ay düzenli maaş girişi göster</li>
            <li>• Harcama ve giriş dengesi tutarlı olsun</li>
            <li>• Seyahat için yeterli bakiye + acil tampon</li>
            <li>• Farklı hesaplar varsa hepsini sun</li>
          </ul>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Adım 4: Randevu ve Başvuru Merkezi</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Çoğu Schengen ülkesi Türkiye'de VFS Global veya TLScontact aracı merkezlerini
        kullanır. Randevu bu merkezlerden alınır, belgeler burada teslim edilir, biyometrik
        bilgiler buradan toplanır. Randevu için konsolosluğun VFS/TLS portalını kullanın.
      </p>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-800 text-sm mb-1">Randevu Sıkışıklığı</p>
          <p className="text-amber-700 text-sm leading-relaxed">
            Almanya ve Fransa randevuları Nisan-Eylül döneminde <strong>6-8 haftaya
            uzayabiliyor.</strong> Yaz tatili planlayanların en az Nisan başında
            randevu alması gerekiyor. Erken planlama her zaman avantajlıdır.
          </p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Adım 5: Başvuru Sonrası Süreç</h2>
      <div className="space-y-3 mb-8">
        {[
          { sure: '5-10 iş günü', aciklama: 'Yunanistan, İtalya gibi aktif turizm ülkeleri için tipik süre' },
          { sure: '10-21 iş günü', aciklama: 'Fransa ve orta zorluklu ülkeler için beklenen süre' },
          { sure: '4-8 hafta', aciklama: 'Almanya ve Hollanda gibi yüksek talep gören ülkeler' },
        ].map(({ sure, aciklama }) => (
          <div key={sure} className="flex items-start gap-3 text-sm bg-white border border-slate-200 rounded-xl p-4">
            <span className="font-bold text-brand-700 shrink-0 min-w-[90px]">{sure}</span>
            <p className="text-slate-600 leading-relaxed">{aciklama}</p>
          </div>
        ))}
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-8 flex gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-emerald-800 text-sm mb-1">Danışman İpucu: Niyet Mektubunun Gücü</p>
          <p className="text-emerald-700 text-sm leading-relaxed">
            Niyet mektubunu formül gibi yazmayın. Seyahatin amacını, güzergahını, ne görmek
            istediğinizi ve neden döneceğinizi (iş, aile, mülk) içtenlikle açıklayan
            kişiselleştirilmiş bir mektup, belgeler arasında en dikkat çekici unsur olabilir.
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
        <h3 className="font-bold text-brand-900 mb-2">Schengen Vizesi: Hazırlık Her Şeydir</h3>
        <p className="text-brand-800 text-sm leading-relaxed">
          Schengen vizesi almak karmaşık değil, titizlik isteyen bir süreçtir. Doğru
          konsolosluk, eksiksiz belgeler, tutarlı mali kanıt ve gerçekçi seyahat planıyla
          büyük çoğunluk olumlu sonuç alıyor. Eksik veya çelişkili dosya ise güçlü
          pasaportu bile zayıf düşürebilir.
        </p>
      </div>

    </BlogPostLayout>
  );
}
