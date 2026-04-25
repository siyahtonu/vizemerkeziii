import React from 'react';
import { AlertTriangle, CheckCircle2, Info, ShieldCheck } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'ingiltere-evisa-rehberi',
  title: "İngiltere eVisa Nedir? 2026'da Dijital Vize Zorunluluğu ve Başvuru Rehberi",
  description: "25 Şubat 2026 itibarıyla İngiltere fiziksel vize etiketini tamamen kaldırdı. Türk vatandaşları için İngiltere eVisa başvurusu, UKVI hesabı, BRP kartı iptali ve seyahatte dikkat edilecekler.",
  category: 'İngiltere',
  readingTime: 7,
  date: '2026-04-16',
  tags: ['İngiltere eVisa', 'UK vize', 'dijital vize', 'UKVI', 'BRP kartı'],
};

const ARTICLE_SCHEMA = {
  '@type': 'Article',
  headline: POST.title,
  description: POST.description,
  author: { '@type': 'Organization', name: 'VizeAkıl', url: 'https://vizeakil.com' },
  publisher: { '@type': 'Organization', name: 'VizeAkıl', logo: { '@type': 'ImageObject', url: 'https://vizeakil.com/og-image.png' } },
  datePublished: POST.date,
  dateModified: POST.date,
  url: `https://vizeakil.com/blog/${POST.slug}`,
};

const FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'İngiltere eVisa nedir?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "İngiltere eVisa, pasaportunuza yapıştırılan fiziksel vize etiketi yerine UKVI (UK Visas and Immigration) çevrimiçi hesabınıza dijital olarak bağlanan elektronik vize kaydıdır. 25 Şubat 2026 itibarıyla İngiltere tüm vize türleri için fiziksel etiketi kaldırarak tamamen dijitale geçmiştir.",
      },
    },
    {
      '@type': 'Question',
      name: 'İngiltere eVisa başvurusu nasıl yapılır?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "İngiltere eVisa başvurusu gov.uk/evisa adresi üzerinden UKVI hesabı oluşturularak yapılır. Pasaport, fotoğraf, biyometrik bilgi ve ücret ödeme sonrasında onay e-posta ve UKVI hesabına dijital olarak iletilir. Türk vatandaşları standart ziyaretçi vizesi için bu süreçten geçmektedir.",
      },
    },
    {
      '@type': 'Question',
      name: 'BRP kartım var, ne yapmalıyım?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "BRP (Biometric Residence Permit) kartları 31 Aralık 2024 itibarıyla geçersiz hale gelmiştir. Öğrenci, çalışma veya uzun süreli ikamet iznine sahipseniz UKVI hesabınızı oluşturarak eVisa'ya geçmeniz gerekmekteydi. Geçiş yapmayanlar ciddi sorunlarla karşılaşabilir; havalimanında giriş engellenebilir.",
      },
    },
    {
      '@type': 'Question',
      name: 'İngiltere eVisa ile seyahatte ne gösterilir?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Artık pasaportunuzda fiziksel vize damgası veya etiketi olmayacak. Havalimanında sınır görevlisi pasaportunuzdaki biyometrik bilgileri ve UKVI sistemindeki kaydı eşleştirerek giriş iznini doğrular. Bilet kontrolünde havayolunuz da aynı sistemi sorgular. UKVI hesabınıza erişim bağlantısını (share code) uçuş öncesi hazır tutmanız yeterlidir.",
      },
    },
    {
      '@type': 'Question',
      name: 'İngiltere ziyaretçi vizesi Türk vatandaşları için kaç günlük?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Standart ziyaretçi vizesi 6 aya kadar kalış hakkı tanır. Birden fazla giriş hakkı tanıyan 2 yıllık ve 5 yıllık multiple-entry ziyaretçi vizeleri de mevcuttur. Uzun vadeli vize seçeneği sık gidenlere maliyet avantajı sağlar.",
      },
    },
    {
      '@type': 'Question',
      name: 'ETA ile eVisa arasındaki fark nedir?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "ETA (Electronic Travel Authorisation), vizesiz ülke vatandaşları (AB, ABD, Kanada gibi) için zorunlu ön-onay sistemidir; vize değildir. eVisa ise vize gerektiren ülkelerden (Türkiye dahil) başvuranların aldığı dijital vize kaydıdır. Türk vatandaşları ETA değil eVisa başvurusu yapar.",
      },
    },
  ],
};

export default function IngiltereEvisa() {
  return (
    <BlogPostLayout post={POST} schema={[ARTICLE_SCHEMA, FAQ_SCHEMA]}>

      <p className="text-slate-700 leading-relaxed text-base mb-6">
        25 Şubat 2026 itibarıyla İngiltere pasaporttaki fiziksel vize etiketini tamamen
        tarihe gömdü. Artık İngiltere'ye gidecek Türk vatandaşları için geçerli olan
        tek şey: <strong>UKVI hesabına bağlı dijital eVisa.</strong> Pasaportunuzda
        ne damga ne de etiket göreceksiniz — ama sisteme kayıtlı olmazsanız uçağa
        bile binemezsiniz. Bu geçiş ne anlama geliyor, nasıl başvurulur ve nelere
        dikkat edilmeli?
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">eVisa Nedir ve Neden Zorunlu Oldu?</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        İngiltere Göçmenlik Bakanlığı (UKVI), uzun yıllardır yürüttüğü dijitalleşme
        projesini 2026 yılı başında tamamladı. Artık tüm vize türleri — ziyaretçi,
        öğrenci, çalışma, aile birleşimi — fiziksel etiket yerine dijital kayıt
        olarak UKVI sisteminde tutuluyor.
      </p>
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { baslik: 'Fiziksel Etiket', icerik: '25 Şubat 2026 sonrası tamamen kaldırıldı. Yeni pasaportlara yapıştırılmıyor.' },
          { baslik: 'UKVI Hesabı', icerik: "Vizeniz bu hesaba bağlı. Seyahat öncesi hesabınıza erişebildiğinizden emin olun." },
          { baslik: 'Share Code', icerik: "Havayolu, işveren veya ev sahibine vizenizi göstermek için UKVI'dan alınan geçici kod." },
        ].map(({ baslik, icerik }) => (
          <div key={baslik} className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm">
            <p className="font-bold text-slate-800 mb-1">{baslik}</p>
            <p className="text-slate-600 leading-relaxed">{icerik}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Türk Vatandaşı İçin eVisa Başvuru Adımları</h2>
      <div className="space-y-3 mb-8">
        {[
          { n: '1', b: 'UKVI hesabı oluşturun', d: 'gov.uk/evisa adresinden UK Visas and Immigration çevrimiçi hesabı açın. E-posta adresiniz ve telefon numaranız gerekli.' },
          { n: '2', b: 'Vize türünü seçin', d: 'Ziyaretçi (6 ay), Öğrenci, Çalışma gibi kategorilerden seyahat amacınıza uygun olanı seçin.' },
          { n: '3', b: 'Belgeleri yükleyin', d: 'Pasaport fotoğrafı, biyometrik pasaport verisi, mali kanıt ve niyet mektubunu yükleyin.' },
          { n: '4', b: 'Biometrics Appointment (gerekirse)', d: 'İlk kez başvuruyorsanız Türkiye\'deki İngiltere Konsolosluğu VFS ofisinde randevu alarak parmak izi ve fotoğraf vermeniz gerekebilir.' },
          { n: '5', b: 'Onayı alın', d: 'Onay UKVI hesabınıza düşer. Pasaportunuza hiçbir şey yapıştırılmaz; sisteme kayıt yeterlidir.' },
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
          <p className="font-semibold text-amber-800 text-sm mb-1">BRP Kartı Sahipleri Dikkat</p>
          <p className="text-amber-700 text-sm leading-relaxed">
            BRP kartları <strong>31 Aralık 2024 itibarıyla geçersiz.</strong> Öğrenci veya
            çalışma iznine sahip olanların UKVI hesabına eVisa geçişi yapması zorunluydu.
            Bu geçişi henüz yapmadıysanız İngiltere girişinde sorun yaşarsınız.
          </p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Ziyaretçi Vizesi Seçenekleri</h2>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700">
              <th className="text-left p-3 rounded-tl-lg font-semibold">Vize Türü</th>
              <th className="text-left p-3 font-semibold">Geçerlilik</th>
              <th className="text-left p-3 rounded-tr-lg font-semibold">Uygunluk</th>
            </tr>
          </thead>
          <tbody>
            {[
              { tur: 'Standart Ziyaretçi', gecerlilik: '6 ay (tek veya çok girişli)', uygun: 'Turizm, aile ziyareti, kısa iş toplantısı' },
              { tur: '2 Yıllık Multiple-Entry', gecerlilik: '2 yıl, her seyahat 6 aya kadar', uygun: 'Sık giden turistler' },
              { tur: '5 Yıllık Multiple-Entry', gecerlilik: '5 yıl, her seyahat 6 aya kadar', uygun: 'Düzenli iş veya aile ziyareti' },
              { tur: '10 Yıllık Multiple-Entry', gecerlilik: '10 yıl, her seyahat 6 aya kadar', uygun: 'Çok güçlü geçmiş ve güven skoru' },
            ].map(({ tur, gecerlilik, uygun }, i) => (
              <tr key={tur} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                <td className="p-3 font-medium text-slate-700">{tur}</td>
                <td className="p-3 text-slate-600">{gecerlilik}</td>
                <td className="p-3 text-slate-600">{uygun}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">eVisa ile Seyahatte Pratik Bilgiler</h2>
      <ul className="space-y-2 mb-8">
        {[
          'Uçuş check-in sırasında havayolu UKVI sistemini sorgular — pasaportunuzu ve UKVI hesap e-postanızı hazır tutun',
          "Vize durumunuzu başkalarıyla paylaşmak için UKVI'dan 'share code' alabilirsiniz (30 gün geçerli)",
          'UKVI hesabınız için kayıtlı e-posta ve şifreyi unutmayın; seyahat öncesi giriş testini yapın',
          'Pasaportunuzu yenilediğinizde UKVI hesabınızdaki pasaport bilgisini güncellemeniz gerekir',
          'İngiltere artık Schengen bölgesinde değil — İngiltere vizesi Avrupa için geçersiz, tersi de geçersiz',
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-blue-800 text-sm mb-1">ETA ile Karıştırmayın</p>
          <p className="text-blue-800 text-sm leading-relaxed">
            İngiltere, AB vatandaşları ve vizesiz ülke pasaport sahipleri için <strong>ETA
            (Electronic Travel Authorisation)</strong> sistemini hayata geçirdi.
            Türk vatandaşları ETA alamaz — Türkiye vizeli ülke kategorisinde. Türk
            vatandaşları her zaman tam vize başvurusu (eVisa) yapmalıdır.
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
        <h3 className="font-bold text-brand-900 mb-2">eVisa: Daha Az Kağıt, Daha Çok Sorumluluk</h3>
        <p className="text-brand-800 text-sm leading-relaxed">
          Dijital dönüşüm seyahati kolaylaştırıyor, ancak UKVI hesabınıza erişimi
          kaybetmek eskiden pasaportu kaybetmek kadar kritik hale geldi.
          Hesap bilgilerinizi güvende tutun, seyahat öncesi mutlaka giriş testi yapın
          ve yeni pasaport alırsanız bilgileri güncelleyin.
        </p>
      </div>

    </BlogPostLayout>
  );
}
