import React from 'react';
import { AlertTriangle, CheckCircle2, Info, ShieldCheck } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'ees-sistemi-nedir',
  title: 'EES Sistemi Nedir? Schengen Sınırında Pasaport Damgası Kalktı — 2026 Rehberi',
  description: 'Nisan 2026\'da tam devreye giren EES (Entry/Exit System) ile Schengen\'de pasaport damgası tarihe karıştı. Parmak izi, yüz tanıma, 90/180 gün otomatik sayım ve bekleme süreleri hakkında bilmeniz gereken her şey.',
  category: 'Schengen',
  readingTime: 7,
  date: '2026-04-16',
  tags: ['EES sistemi', 'Schengen', 'pasaport damgası', '90/180 gün', 'biyometrik'],
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
      name: 'EES sistemi nedir?',
      acceptedAnswer: { '@type': 'Answer', text: 'EES (Entry/Exit System — Giriş/Çıkış Sistemi), Schengen bölgesine giren üçüncü ülke vatandaşlarının (vizeli veya vizesiz) her giriş ve çıkışını biyometrik olarak kaydeden bir AB dijital sınır yönetimi sistemidir. 10 Nisan 2026 itibarıyla tüm Schengen ülkelerinde tam kapasiteyle çalışmaktadır.' },
    },
    {
      '@type': 'Question',
      name: 'EES ile pasaport damgası tamamen kalktı mı?',
      acceptedAnswer: { '@type': 'Answer', text: 'Evet. EES devreye girdikten sonra Schengen ülkeleri pasaport damgası basmıyor. Giriş-çıkış kaydı dijital olarak EES veritabanına işleniyor. Bu bilgi tüm Schengen sınır noktalarıyla paylaşılıyor.' },
    },
    {
      '@type': 'Question',
      name: '90/180 gün kuralı EES ile nasıl değişti?',
      acceptedAnswer: { '@type': 'Answer', text: 'Hesaplama kuralı değişmedi — hâlâ son 180 günde maksimum 90 gün Schengen\'de kalabilirsiniz. Değişen şey takip mekanizması: EES sistemi bu hesaplamayı otomatik yapıyor ve sınır görevlileri ekranlarında anlık olarak bakiye günlerinizi görüyor. Overstay tespiti artık çok daha kesin ve anlık.' },
    },
    {
      '@type': 'Question',
      name: 'EES için ilk girişte ne yapılıyor?',
      acceptedAnswer: { '@type': 'Answer', text: 'İlk girişte 4 parmak izi ve yüz fotoğrafı alınarak kişisel profil oluşturuluyor. Bu işlem yaklaşık 2-5 dakika sürüyor. Bir kez kayıt olduktan sonra sonraki girişlerde biyometrik okuma yeterli oluyor.' },
    },
    {
      '@type': 'Question',
      name: 'EES vize almayı zorlaştırdı mı?',
      acceptedAnswer: { '@type': 'Answer', text: 'Doğrudan vize almayı zorlaştırmadı; vize sistemi ayrı işliyor. Ancak overstay takibini çok daha kesin hale getirdi. Geçmişte fark edilmeden kalan süre aşımları artık sistemde kalıcı kayıt oluşturuyor ve cascade haklarını etkiliyor.' },
    },
    {
      '@type': 'Question',
      name: 'Çocuklar ve bebekler EES kaydından muaf mı?',
      acceptedAnswer: { '@type': 'Answer', text: '12 yaşın altındaki çocuklar biyometrik parmak izi kaydından muaftır; sadece yüz fotoğrafı alınır. 12-18 yaş arasındakiler parmak izi vermekle yükümlüdür.' },
    },
  ],
};

export default function EesSistemi() {
  return (
    <BlogPostLayout post={POST} schema={[ARTICLE_SCHEMA, FAQ_SCHEMA]}>

      <p className="text-slate-700 leading-relaxed text-base mb-6">
        10 Nisan 2026 itibarıyla Schengen sınırlarında köklü bir değişim yaşandı: <strong>pasaport
        damgası tarihe karıştı.</strong> Artık her giriş ve çıkışınız parmak iziniz ve yüz
        fotoğrafınızla dijital olarak kayıt altına alınıyor. Pek çok yolcu bu sistemin ne
        anlama geldiğini, seyahatini nasıl etkilediğini ve 90/180 gün hesabını nasıl
        değiştirdiğini soruyor. Tüm sorular, net cevaplar.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">EES Sistemi Nedir?</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        <strong>Entry/Exit System (EES)</strong>, AB'nin yıllarca geliştirdiği dijital sınır yönetimi
        altyapısıdır. Tüm Schengen ülkelerine giren üçüncü ülke vatandaşlarının — vizeli ya da
        vizesiz — her giriş ve çıkışını kaydeder. Sisteme kayıtlı bilgiler tüm Schengen
        sınır kapılarıyla anlık paylaşılır.
      </p>
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { baslik: 'Kayıt Edilen', icerik: 'Ad-soyad, pasaport, uyruk, vize bilgisi, giriş-çıkış tarihi ve noktası' },
          { baslik: 'Biyometrik', icerik: '4 parmak izi + yüz fotoğrafı (ilk girişte, sonra tekrar gerekmiyor)' },
          { baslik: 'Saklama', icerik: 'Veriler 3 yıl saklanır; overstay durumunda 5 yıl' },
        ].map(({ baslik, icerik }) => (
          <div key={baslik} className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm">
            <p className="font-bold text-slate-800 mb-1">{baslik}</p>
            <p className="text-slate-600 leading-relaxed">{icerik}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">İlk Girişte Ne Olacak?</h2>
      <div className="space-y-3 mb-8">
        {[
          { n: '1', b: 'Pasaport taraması', d: 'Standart pasaport taraması yapılır, kişisel bilgiler sisteme aktarılır.' },
          { n: '2', b: 'Parmak izi kaydı', d: '4 parmak izi alınır (işaret ve orta parmaklar, her iki elden). İşlem yaklaşık 1-2 dakika.' },
          { n: '3', b: 'Yüz fotoğrafı', d: 'Kameraya bakmanız istenir, yüz tanıma için fotoğraf çekilir.' },
          { n: '4', b: 'Vize kontrolü', d: 'Vizenizin EES verileriyle uyumu kontrol edilir, kalan gün bakiyeniz hesaplanır.' },
          { n: '5', b: 'Giriş onayı', d: 'Sistem onay verirse pasaportunuza eski gibi damga vurulmaz; yalnızca dijital kayıt oluşur.' },
        ].map(({ n, b, d }) => (
          <div key={n} className="flex gap-3 text-sm">
            <span className="w-7 h-7 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold shrink-0 text-xs mt-0.5">{n}</span>
            <div>
              <p className="font-semibold text-slate-800 mb-0.5">{b}</p>
              <p className="text-slate-600 leading-relaxed">{d}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-800 text-sm mb-1">Bekleme Süresi Artışı</p>
          <p className="text-amber-700 text-sm leading-relaxed">
            AB verilerine göre EES ilk devreye girdiğinde sınır bekleme süreleri <strong>%70'e
            kadar artabildi.</strong> Özellikle havalimanlarında daha erken check-in ve
            pasaport kontrolüne gitmeyi planlayın. Sistem olgunlaştıkça bekleme süreleri
            düşüyor; ancak yaz sezonunda yine yükselme beklenebilir.
          </p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">90/180 Gün Kuralı: EES ile Ne Değişti?</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Kural değişmedi: son 180 günde en fazla 90 gün Schengen'de kalabilirsiniz. Değişen
        şey <strong>kesinlik</strong>:
      </p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 text-sm">
          <p className="font-semibold text-slate-700 mb-2">EES Öncesi</p>
          <ul className="space-y-1 text-slate-600">
            <li>• Pasaport damgaları manuel sayılırdı</li>
            <li>• Damga okunaksızsa veya yoksa hesap güçleşirdi</li>
            <li>• Kısa süreli overstay zaman zaman tespit edilemezdi</li>
          </ul>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm">
          <p className="font-semibold text-emerald-700 mb-2">EES Sonrası</p>
          <ul className="space-y-1 text-emerald-700">
            <li>• Her giriş-çıkış saniye hassasiyetiyle kayıtlı</li>
            <li>• Sınır görevlisi ekranda anlık bakiye görüyor</li>
            <li>• 1 günlük overstay bile kalıcı kayıt oluşturuyor</li>
          </ul>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">EES ile Cascade Kuralı Nasıl Etkileşiyor?</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        EES ve Cascade kuralı birbirini tamamlar. EES sistemi, cascade hak kontrolünü
        konsolosluklara sağlıklı veri sağlayarak kolaylaştırır. Aynı zamanda overstay veya
        ihlalleri de şeffaf hale getirir:
      </p>
      <ul className="space-y-2 mb-8">
        {[
          'Konsolosluklar cascade uygunluğunu EES verisiyle anlık doğrulayabilir',
          'Temiz EES sicili cascade zincirini güçlendirir',
          'EES\'teki overstay kaydı cascade hakkını kesiyor ve uzun yıllar dosyanızda kalıyor',
          'Her seyahat EES üzerinden belgeleniyor — ayrıca e-Devlet çıktısı gerekmiyor',
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>

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
        <h3 className="font-bold text-brand-900 mb-2">EES: Dürüst Yolcunun Dostu, Kural İhlali Yapanın Kabusu</h3>
        <p className="text-brand-800 text-sm leading-relaxed">
          EES sistemi aslında kurallara uyan yolcular için olumlu bir gelişmedir. Cascade haklarını
          güvence altına alır, overstay iddialarına karşı dijital kanıt sağlar ve vize
          değerlendirmelerini daha şeffaf kılar. Tek yapmanız gereken: gün sayısını takip etmek,
          zamanında çıkmak ve ihlalsiz bir sicil inşa etmek.
        </p>
      </div>

    </BlogPostLayout>
  );
}
