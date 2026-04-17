import React from 'react';
import { AlertTriangle, CheckCircle2, Info, Camera, Clock, FileText } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'ds-160-formu-nasil-doldurulur-rehberi',
  title: 'DS-160 Formu Nasıl Doldurulur? 2026 Adım Adım Türkçe Rehber',
  description: 'ABD vize başvurusu için DS-160 formu nasıl doldurulur? Ekran görüntülü adım adım Türkçe rehber, sık yapılan hatalar ve pratik ipuçları.',
  category: 'ABD',
  readingTime: 13,
  date: '2026-04-17',
  tags: ['DS-160', 'ABD vizesi', 'form doldurma', 'B1 B2 vize'],
};

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
      '@type': 'HowTo',
      name: 'DS-160 formu nasıl doldurulur',
      totalTime: 'PT90M',
      step: [
        { '@type': 'HowToStep', name: 'Başlangıç sayfası', text: 'ceac.state.gov/genniv adresine git, konsolosluğu seç, Application ID\'yi not et.' },
        { '@type': 'HowToStep', name: 'Kişisel bilgiler', text: 'Pasaporttaki gibi ad-soyad, medeni hal, cinsiyet bilgilerini gir.' },
        { '@type': 'HowToStep', name: 'Seyahat bilgileri', text: 'Amaç, varış tarihi, kalış süresi, adres bilgilerini doldur.' },
        { '@type': 'HowToStep', name: 'Önceki seyahat/İş/Eğitim', text: 'Son 5 yıl seyahat, iki işveren ve eğitim geçmişini gir.' },
        { '@type': 'HowToStep', name: 'Güvenlik & sosyal medya', text: 'Arka plan sorularını dürüstçe cevapla, 5 yıllık sosyal medya hesaplarını listele.' },
        { '@type': 'HowToStep', name: 'Fotoğraf ve gönderim', text: '51x51 mm biyometrik fotoğraf yükle, onay sayfasını yazdır.' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'DS-160\'ı Türkçe doldurabilir miyim?', acceptedAnswer: { '@type': 'Answer', text: 'Hayır. Form tamamen İngilizce doldurulmalıdır. Sadece "Native Alphabet" bölümünde Türkçe karakterler kullanılır.' } },
        { '@type': 'Question', name: 'Başvuruyu gönderdim ama hata var, ne yapmalıyım?', acceptedAnswer: { '@type': 'Answer', text: 'DS-160 gönderildikten sonra değiştirilemez. Mülakatta konsolosluk memuruna hatayı açıklayabilirsiniz veya yeni bir DS-160 doldurabilirsiniz.' } },
        { '@type': 'Question', name: 'DS-160 ücreti ne kadar?', acceptedAnswer: { '@type': 'Answer', text: 'DS-160 formunun kendisi ücretsizdir. Vize başvuru ücreti (185 USD, yaklaşık 7.500 TL, 2026) formdan ayrı olarak mülakat randevusu alırken ödenir.' } },
        { '@type': 'Question', name: 'Sosyal medya hesabım yoksa ne yazmalıyım?', acceptedAnswer: { '@type': 'Answer', text: '"None" seçeneğini işaretleyin. Sosyal medya kullanmadığınız için bu cevap kabul edilir.' } },
        { '@type': 'Question', name: 'Ailemdekiler de ayrı ayrı DS-160 dolduracak mı?', acceptedAnswer: { '@type': 'Answer', text: 'Evet. Her başvurucu (eş, çocuk dahil) ayrı DS-160 formu doldurmalıdır. 14 yaş altı çocukların formu ebeveyn tarafından doldurulur.' } },
        { '@type': 'Question', name: 'Pasaportum yenileniyor, eski numarayla DS-160 doldurabilir miyim?', acceptedAnswer: { '@type': 'Answer', text: 'Hayır, mevcut ve geçerli pasaportunuzla doldurmalısınız. Pasaport yenileniyor ise önce onu tamamlayıp DS-160\'ı yeni pasaportla doldurun.' } },
      ],
    },
  ],
};

const BOLUMLER = [
  { t: 'Bölüm 1: Başlangıç Sayfası', b: 'https://ceac.state.gov/genniv/ adresine gidin. "Start an Application" seçin. Konsolosluğu seçin ("TURKEY, ANKARA" veya "TURKEY, ISTANBUL"). Güvenlik sorusunu seçip cevabını aklınızda tutun — forma geri dönmek için gereklidir. Size "Application ID" verilecek (AAxxxxxxxx formatında). Bu numarayı mutlaka kaydedin.' },
  { t: 'Bölüm 2: Personal Information (Kişisel Bilgiler)', b: 'Ad-soyadınızı pasaporttaki gibi tam olarak yazın. Türkçe karakterler (ç, ğ, ı, ö, ş, ü) İngilizce karşılıklarıyla yazılır (c, g, i, o, s, u). Surnames (pasaporttaki soyadı), Given Names (orta ad dahil), Full Name in Native Alphabet (Türkçe karakterlerle tam ad), Other Names (evlilik öncesi vb.), Sex, Marital Status.' },
  { t: 'Bölüm 3: Travel Information (Seyahat Bilgileri)', b: 'Purpose of Trip (Turizm için "TOURISM/VACATION"), Have you made specific travel plans? (Hayır seçerseniz bilet almanız gerekmez), Intended Date of Arrival, Length of Stay (3-4 hafta turist için makul), Address Where You Will Stay. Verdiğiniz cevaplar mülakatta size soru olarak dönecek.' },
  { t: 'Bölüm 4: Travel Companions (Seyahat Arkadaşları)', b: 'Yalnız seyahat ediyorsanız "No" seçin. Eş veya çocuk ile seyahat ediyorsanız onların bilgilerini girin.' },
  { t: 'Bölüm 5: Previous US Travel (Önceki ABD Seyahatleri)', b: 'Daha önce ABD\'ye gittiyseniz her seyahatin tarihini ve süresini girin. Önceki vizenizin bilgilerini ekleyin (type, expiration date). ABD\'de daha uzun kalmışsanız bu sorgulanır.' },
  { t: 'Bölüm 6: Address and Phone (Adres ve Telefon)', b: 'Türkiye\'deki ev adresinizi, telefonunuzu ve e-postanızı girin. E-posta adresini dikkatlice girin — tüm yazışmalar buraya gelecek.' },
  { t: 'Bölüm 7: Passport (Pasaport Bilgileri)', b: 'Passport Type: Regular (turkuaz/bordo). Passport Number (harfler büyük). Issuance Date, Expiration Date: pasaport düzenleme ve bitiş tarihleri.' },
  { t: 'Bölüm 8: U.S. Contact Information (ABD\'deki İletişim Noktası)', b: 'ABD\'de tanıdığınız yoksa, kaldığınız otelin bilgilerini girin. Otel resmi bir iletişim noktası olarak kabul edilir.' },
  { t: 'Bölüm 9: Family Information (Aile Bilgileri)', b: 'Anne-baba, eş, çocuk bilgileri girilir. ABD\'de yaşayan akrabanız varsa belirtilir. Bu, "göçmenlik niyeti" sinyali olarak dikkatle değerlendirilir.' },
  { t: 'Bölüm 10: Work/Education/Training', b: 'Mevcut işinizin detayları (şirket, adres, pozisyon, süre, maaş). Son iki işinizin bilgileri. Eğitim geçmişiniz (lise ve üniversite). Maaş bilgisi aylık olarak USD cinsinden girilir.' },
  { t: 'Bölüm 11: Security and Background', b: 'Bu bölüm 30+ soru içerir: terör örgütü üyeliği, suç geçmişi, sağlık durumu, göçmenlik ihlalleri vb. Hepsine dürüst cevap verin. Yalan beyan, ömür boyu ABD vizesi yasağına yol açabilir.' },
  { t: 'Bölüm 12: Social Media', b: 'Son 5 yıldaki sosyal medya hesap isimleriniz. Facebook, Twitter/X, Instagram, LinkedIn, YouTube, Reddit vb. platformlar listede varsa, kullanıcı adınızı (@kullaniciadi) girin. Saklamaya çalışmayın — ABD yetkilileri inceleyebilir.' },
];

const HATALAR = [
  'İsim yazım hatası (pasaporttakiyle tam uyuşmaması)',
  'Önceki seyahat tarihlerini yanlış girmek',
  '"Have you ever..." sorularına yanlışlıkla yanlış işaretlemek',
  'Fotoğraf kalite hatası (yüksek çözünürlük gerekir)',
  'Adres girişinde Türkçe karakter kullanmak (ı, ş, ç, ğ, ö, ü kullanılamaz)',
  'ABD\'deki akraba bilgisini saklamak (tespit edilirse yalan beyan sayılır)',
  'Sosyal medya hesaplarını eksik bildirmek',
  'Application ID\'yi kaydetmeyi unutmak (forma geri dönmek imkansızlaşır)',
  'Barkod sayfasını çıkarmayı unutmak (mülakata getirilmesi zorunlu)',
  'Gönderdikten sonra değişiklik yapmaya çalışmak (yeni başvuru gerekir)',
];

export default function Ds160NasilDoldurulur() {
  return (
    <BlogPostLayout post={POST} schema={SCHEMA}>
      <p className="text-slate-700 leading-relaxed text-base mb-6">
        ABD vize başvurusunun belki de en stresli aşaması DS-160 formudur. İngilizce, uzun,
        teknik detaylarla dolu ve tek bir yanlış cevap vize reddine sebep olabilir. Ancak aslında
        DS-160 o kadar da karmaşık değil — sadece doğru hazırlıkla doldurulması gerekiyor. Bu
        rehberde, her bölümü Türkçe açıklamalarla, pratik ipuçlarıyla ve sık yapılan hatalarla
        birlikte anlatıyoruz.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">DS-160 Formu Nedir ve Neden Önemli?</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        DS-160 (Online Nonimmigrant Visa Application), ABD Dışişleri Bakanlığı'nın online vize
        başvuru formudur. Tüm B1/B2 turist vizesi, F-1 öğrenci vizesi, J-1 değişim programı,
        H1B çalışma vizesi gibi tüm nonimmigrant (geçici) vize başvuruları bu form üzerinden
        yapılır.
      </p>
      <p className="text-slate-700 leading-relaxed mb-8">
        Formun önemi tartışılmaz: Konsolosluk memurunuz sizinle görüşmeden önce DS-160'ınızı
        inceler, mülakat sorularını buna göre hazırlar. Formdaki her cevap, kayıtlara geçer ve
        gelecekteki başvurularınızı da etkiler.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Başlamadan Önce Hazırlamanız Gerekenler</h2>
      <ul className="space-y-2 mb-6">
        {[
          'Pasaport (ilk sayfa taraması)',
          'Dijital fotoğraf (51mm x 51mm, beyaz arka plan, 6 ay içinde çekilmiş)',
          'Son 5 yıldaki tüm seyahat kayıtları (ülke, giriş-çıkış tarihleri)',
          'Son iki işvereninizin bilgileri (isim, adres, telefon, süre)',
          'Eğitim geçmişi (lise, üniversite — isim, adres, tarihler)',
          'ABD\'deki iletişim adresi (otel, arkadaş, akraba)',
          'Sosyal medya hesap isimleriniz (son 5 yıla ait)',
          'Varsa önceki ABD vizesi bilgileri',
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 flex gap-3">
        <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-amber-900 text-sm leading-relaxed">
          <strong>Önemli ipucu:</strong> Form 75 dakika aktif oturumda otomatik kapanır.
          Başlamadan tüm bilgileri yanınıza hazırlayın, aksi takdirde veri kaybı yaşayabilirsiniz.
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">DS-160 Adım Adım Doldurma Rehberi</h2>
      <div className="space-y-4 mb-8">
        {BOLUMLER.map(({ t, b }) => (
          <div key={t} className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="font-semibold text-slate-800 mb-1 flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-600" /> {t}
            </p>
            <p className="text-slate-600 text-sm leading-relaxed pl-6">{b}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Fotoğraf Yükleme</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        DS-160'ın en sık hata yapılan kısmı fotoğraf yüklemedir. Şartlar:
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6 flex gap-3">
        <Camera className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <ul className="text-blue-900 text-sm space-y-1">
          <li>• <strong>Boyut:</strong> 51mm x 51mm (kare)</li>
          <li>• <strong>Arka plan:</strong> Beyaz veya açık gri</li>
          <li>• <strong>Çekim tarihi:</strong> Son 6 ay içinde</li>
          <li>• <strong>Baş pozisyonu:</strong> Düz bakış, ifadesiz, ağız kapalı</li>
          <li>• <strong>Aksesuar:</strong> Gözlük yasak (sağlık gerekmedikçe), başörtüsü din gereği kabul</li>
          <li>• <strong>Dosya boyutu:</strong> 240KB-1MB arası</li>
          <li>• <strong>Format:</strong> JPEG</li>
        </ul>
      </div>
      <p className="text-slate-700 leading-relaxed mb-8 text-sm">
        Fotoğraf kabul edilmezse sistem uyarır; mülakatta da yeni fotoğraf isteyebilirler.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">DS-160'ta En Çok Yapılan 10 Hata</h2>
      <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-8">
        <ol className="text-red-800 text-sm space-y-2 list-decimal list-inside">
          {HATALAR.map((h) => <li key={h}>{h}</li>)}
        </ol>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Form Tamamlandıktan Sonra</h2>
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-8 flex gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <p className="text-emerald-900 text-sm leading-relaxed">
          Formu gönderdikten sonra "Confirmation Page" çıkar. Bu sayfayı PDF olarak kaydedin ve
          mutlaka yazıcıdan basın. Üzerinde barkod ve Application ID bulunur.
          <strong> Bu sayfa olmadan mülakat randevusuna alınmazsınız.</strong>
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Sık Sorulan Sorular (SSS)</h2>
      <div className="space-y-4 mb-8">
        {[
          { q: 'DS-160\'ı Türkçe doldurabilir miyim?', a: 'Hayır. Form tamamen İngilizce doldurulmalıdır. Sadece "Native Alphabet" bölümünde Türkçe karakterler kullanılır. Tüm diğer cevaplar İngilizce olmalıdır.' },
          { q: 'Başvuruyu gönderdim ama hata var, ne yapmalıyım?', a: 'DS-160 gönderildikten sonra değiştirilemez. Mülakatta konsolosluk memuruna hatayı açıklayabilirsiniz veya yeni bir DS-160 doldurabilirsiniz (yeni başvuru ücreti gerekir).' },
          { q: 'DS-160 ücreti ne kadar?', a: 'DS-160 formunun kendisi ücretsizdir. Vize başvuru ücreti (185 USD, yaklaşık 7.500 TL, 2026) formdan ayrı olarak mülakat randevusu alırken ödenir.' },
          { q: 'Form üzerinde sosyal medya hesabım yoksa ne yazmalıyım?', a: '"None" seçeneğini işaretleyin. Sosyal medya kullanmadığınız için bu cevap kabul edilir ve sorun yaratmaz.' },
          { q: 'Ailemdekiler de ayrı ayrı DS-160 dolduracak mı?', a: 'Evet. Her başvurucu (eş, çocuk dahil) ayrı DS-160 formu doldurmalıdır. 14 yaş altı çocukların formu ebeveyn tarafından doldurulur.' },
          { q: 'Pasaportum yenileniyor, eski numarayla DS-160 doldurabilir miyim?', a: 'Hayır, mevcut ve geçerli pasaportunuzla doldurmalısınız. Pasaport yenileniyor ise önce onu tamamlayıp DS-160\'ı yeni pasaportla doldurun.' },
        ].map(({ q, a }) => (
          <div key={q} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="font-semibold text-slate-800 text-sm mb-1 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" /> {q}
            </p>
            <p className="text-slate-600 text-sm leading-relaxed pl-6">{a}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-brand-50 border border-brand-200 rounded-2xl p-6 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-brand-900 mb-2">Özet</h3>
          <p className="text-brand-800 text-sm leading-relaxed">
            DS-160 dikkat isteyen bir formdur ama karmaşık değildir. Tüm belgelerinizi önceden
            hazırlayın, formu aceleye getirmeyin, pasaportunuzla tam uyumlu doldurun ve her
            soruda dürüst olun. Application ID'yi kaydetmeyi ve barkodlu onay sayfasını yazdırmayı
            asla unutmayın.
          </p>
        </div>
      </div>
    </BlogPostLayout>
  );
}
