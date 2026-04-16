import React from 'react';
import { AlertTriangle, CheckCircle2, Info, ShieldCheck } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'abd-vizesi-nasil-alinir-2026',
  title: "ABD Vizesi Nasıl Alınır? 2026 DS-160, Mülakat ve Tam Rehber",
  description: "Türk vatandaşları için 2026 ABD B1/B2 vize başvurusu: DS-160 formu, mülakat hazırlığı, ret gerekçeleri, bekleme süreleri ve EVUS kaydı. Adım adım güncel rehber.",
  category: 'ABD',
  readingTime: 9,
  date: '2026-04-16',
  tags: ['ABD vizesi', 'Amerika vizesi', 'DS-160', 'B1 B2 vize', 'ABD mülakat'],
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
      name: "ABD B1/B2 vizesi nedir?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "B1/B2, ABD'nin turizm ve iş amaçlı kısa ziyaretçi vizesidir. B1 iş ziyareti (toplantı, konferans), B2 turizm içindir; genellikle ikisi birlikte verilir. Bu vize ile ABD'de çalışmak veya okumak yasaktır. Standart geçerlilik 10 yıl, her giriş maksimum 6 ay.",
      },
    },
    {
      '@type': 'Question',
      name: "DS-160 formu nasıl doldurulur?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "DS-160 formu ceac.state.gov adresinden çevrimiçi doldurulur. Kişisel bilgiler, seyahat geçmişi, çalışma bilgisi ve güvenlik sorularını içerir. Tahminen 1-2 saat sürer. Form kayıt kodunu mutlaka not alın. Yanlış veya eksik bilgi vize reddine veya iptale yol açar.",
      },
    },
    {
      '@type': 'Question',
      name: "ABD vize mülakatında ne sorulur?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Mülakatta konsolosluk yetkilisi seyahat amacınızı, ABD'de kimi ziyaret edeceğinizi, işinizi ve Türkiye'ye geri dönme niyetinizi değerlendirir. Sorular kısa ve nettir. Kısa, dürüst ve tutarlı cevaplar beklenirken uzun anlatılar yerine öz cevaplar tercih edilir. Mülakat genellikle 2-5 dakika sürer.",
      },
    },
    {
      '@type': 'Question',
      name: "ABD vizesi için bekleme süresi ne kadar?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "2026 itibarıyla İstanbul ve Ankara'da B1/B2 mülakat randevusu bekleme süresi 3-8 ay arasında değişmektedir. ABD Büyükelçiliği sistemi üzerinden randevu takvimini düzenli takip etmek gerekir; randevu iptalleri nedeniyle beklenmedik erken tarihler açılabilir.",
      },
    },
    {
      '@type': 'Question',
      name: "221(g) kodu ne anlama gelir?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "221(g) bir ret değildir; ek bilgi veya belge talebidir. Konsolosluk pasaportunuzu alıkoyabilir veya ek belgeler için e-posta gönderebilir. Talep edilen belgeler zamanında teslim edilirse vize işlemi tamamlanır. Süresi belirtilmediğinde aylarca sürebileceğini göz önünde bulundurun.",
      },
    },
    {
      '@type': 'Question',
      name: "ABD vizesi reddi 214(b) gerekçesi ne anlama gelir?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "214(b) reddi, başvurunuzun ABD'de kalma niyetini yeterince çürütemediği anlamına gelir. Bu gerekçeyle reddedilenlerin büyük çoğunluğunun sorunu bağlılık kanıtıdır: iş, mülk, aile, sosyal bağlar yetersiz bulunmuştur. Yeni başvuruda güçlü bağlılık kanıtları sunmak kritiktir.",
      },
    },
  ],
};

export default function AbdVizesi2026() {
  return (
    <BlogPostLayout post={POST} schema={[ARTICLE_SCHEMA, FAQ_SCHEMA]}>

      <p className="text-slate-700 leading-relaxed text-base mb-6">
        ABD vizesi, başvuru sahiplerinin en çok tereddüt yaşadığı vize türlerinden biridir.
        Mülakat zorunluluğu, uzun bekleme süreleri ve 214(b) reddi kaygısı öne çıkar.
        Oysa iyi hazırlanmış bir dosya ve doğal bir mülakat performansıyla ABD B1/B2 vizesi
        pekâlâ alınabilir. 2026 güncel süreç, adımlar ve gerçekçi beklentiler.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">ABD Vize Süreci Özet</h2>
      <div className="grid sm:grid-cols-4 gap-3 mb-8">
        {[
          { adim: '1', baslik: 'DS-160', detay: 'Çevrimiçi form doldur' },
          { adim: '2', baslik: 'Randevu', detay: 'Büyükelçilik sistemi' },
          { adim: '3', baslik: 'Mülakat', detay: 'Konsoloslukta yüz yüze' },
          { adim: '4', baslik: 'Pasaport', detay: 'Kuryeyle teslim' },
        ].map(({ adim, baslik, detay }) => (
          <div key={adim} className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-center">
            <span className="w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold text-xs mx-auto mb-2">{adim}</span>
            <p className="font-bold text-slate-800 mb-0.5">{baslik}</p>
            <p className="text-slate-500">{detay}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Adım 1: DS-160 Formunu Doldurun</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        DS-160 formu, ceac.state.gov adresinden doldurulur ve tüm vize başvurularının
        temelini oluşturur. Form kişisel bilgiler, seyahat geçmişi, çalışma geçmişi
        ve güvenlik sorularını içerir.
      </p>
      <ul className="space-y-2 mb-8">
        {[
          "Formu doldurmadan randevu alınamaz — önce DS-160, sonra randevu",
          "Tüm bilgiler pasaportunuzdaki verilerle birebir eşleşmeli",
          "Seyahat geçmişini doğru beyan edin: ABD ret veya iptal geçmişi gizlenemez",
          "Barkod numarasını not alın veya PDF olarak kaydedin",
          "Form doldurma süresi: 1-2 saat; oturumunuzu kaydedin, süresi dolar",
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Adım 2: Randevu ve Ücret</h2>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-800 text-sm mb-1">Uzun Bekleme Süresi</p>
          <p className="text-amber-700 text-sm leading-relaxed">
            2026 itibarıyla İstanbul ve Ankara'da B1/B2 mülakat randevusu için
            <strong> 3-8 ay bekleme süresi</strong> görülmektedir. ABD seyahati
            planlayanların en az 6 ay öncesinden başvurması önerilir.
          </p>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm">
          <p className="font-bold text-slate-800 mb-2">Başvuru Ücreti (MRV)</p>
          <p className="text-slate-600">B1/B2 vize ücreti: <strong>185 USD</strong></p>
          <p className="text-slate-500 text-xs mt-1">Ret durumunda iade edilmez. Ödeme ustravisa.state.gov üzerinden yapılır.</p>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm">
          <p className="font-bold text-slate-800 mb-2">Kurye Ücreti</p>
          <p className="text-slate-600">Pasaport teslim için: <strong>~20-25 USD</strong></p>
          <p className="text-slate-500 text-xs mt-1">Onaylı pasaport kurye servisine verilir.</p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Adım 3: Mülakat Hazırlığı</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Mülakat ABD vize sürecinin en kritik adımıdır. Konsolosluk yetkilisi kısa sorularla
        seyahat amacınızı ve Türkiye'ye geri dönme niyetinizi ölçer.
      </p>
      <div className="space-y-3 mb-8">
        {[
          { soru: "Neden ABD'ye gidiyorsunuz?", cevap: "Kısa, net: 'Los Angeles'ta tatil yapacağım' veya 'Chicago'da iş toplantısı.' Aşırı detay şüphe uyandırır." },
          { soru: "ABD'de kaç gün kalacaksınız?", cevap: "Gerçekçi ve tutarlı bir süre. Rezervasyonlarınızla örtüşmeli." },
          { soru: "İşiniz nedir?", cevap: "Net ve özlü. Şirket adı, pozisyon, kaç yıldır çalıştığınız. Belgenizle tutarlı olsun." },
          { soru: "Türkiye'ye geri dönecek misiniz?", cevap: "Evet, ve bunu destekleyen bağlar: iş, aile, mülk. Kararlı ve doğal bir ifade." },
        ].map(({ soru, cevap }) => (
          <div key={soru} className="bg-white border border-slate-200 rounded-xl p-4 text-sm">
            <p className="font-semibold text-slate-800 mb-1">{soru}</p>
            <p className="text-slate-600 leading-relaxed">{cevap}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Götürmeniz Gereken Belgeler</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div>
          <p className="font-semibold text-slate-700 mb-2 text-sm">Zorunlu</p>
          <ul className="space-y-1">
            {[
              'Geçerli pasaport',
              'DS-160 barkod çıktısı',
              'Randevu onay belgesi',
              'MRV ücret ödeme dekontu',
              'Biyometrik fotoğraf (mülakat günü)',
            ].map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                {b}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold text-slate-700 mb-2 text-sm">Destekleyici (isteğe bağlı ama önemli)</p>
          <ul className="space-y-1">
            {[
              'Banka hesap özeti',
              'İş belgesi veya vergi levhası',
              'Otel ve uçuş rezervasyonu',
              'Aile ve mülk belgesi',
              "ABD'deki kişiden davet mektubu (varsa)",
            ].map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
                <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-8 flex gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-emerald-800 text-sm mb-1">Danışman İpucu: 214(b) Reddini Önlemek</p>
          <p className="text-emerald-700 text-sm leading-relaxed">
            ABD'nin en sık kullandığı ret gerekçesi 214(b): geri dönmeyebilirsiniz
            şüphesi. Bunu çürütmenin yolu güçlü Türkiye bağıdır: stabil iş + izin yazısı,
            mülk veya kira sözleşmesi, çocuk veya eş kaydı. Bunları yanınızda
            bulundurun; sorulmasa bile hazır olduğunuzu hissettirin.
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
        <h3 className="font-bold text-brand-900 mb-2">ABD Vizesi: Bağlılık İspatlama Sınavı</h3>
        <p className="text-brand-800 text-sm leading-relaxed">
          ABD vize mülakatı temelde şu soruyu yanıtlar: "Bu kişi ABD'ye gidip geri
          dönecek mi?" Buna ikna edici bir cevap verebilmek için dürüst, tutarlı ve
          belgeli bir hazırlık yeterlidir. Paniklemeden, aşırı bilgi vermeden,
          güvende ve sakin bir mülakat çok büyük fark yaratır.
        </p>
      </div>

    </BlogPostLayout>
  );
}
