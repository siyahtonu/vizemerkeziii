import React from 'react';
import { AlertTriangle, CheckCircle2, Info, ShieldCheck } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'schengen-vize-ret-kodlari-c1-c14',
  title: "Schengen Vize Ret Kodları: C1'den C14'e Anlam ve İtiraz Rehberi",
  description: "Schengen vize reddinde bildirimde yer alan C1-C14 ret kodları ne anlama gelir? Her koda göre neyin eksik olduğu, nasıl düzeltilebileceği ve itiraz hakkının nasıl kullanılacağı.",
  category: 'Schengen',
  readingTime: 8,
  date: '2026-04-16',
  tags: ['Schengen ret', 'vize reddi', 'ret kodu', 'itiraz', 'C1 C2 C14'],
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
      name: 'Schengen vize reddinde itiraz süresi ne kadardır?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Schengen vize reddi tebliğ tarihinden itibaren genellikle 8 hafta (bazı ülkelerde 30 gün) itiraz süresi tanınır. Bu süre, ret bildiriminin üzerinde veya ekindeki itiraz talimatlarında belirtilir. Süreyi kaçıranlar yeni başvuru yapmak zorundadır.',
      },
    },
    {
      '@type': 'Question',
      name: 'C3 ret kodu ne anlama gelir?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "C3 kodu 'Seyahat amacını ve koşullarını kanıtlayan belgeler sunulmamıştır' anlamına gelir. Uçak rezervasyonu, otel rezervasyonu veya niyet mektubunun eksik ya da yetersiz bulunduğunu gösterir. Çözüm: ayrıntılı itinerary, güçlü niyet mektubu ve tüm rezervasyonların yeniden hazırlanarak başvuru yenilenmesidir.",
      },
    },
    {
      '@type': 'Question',
      name: 'C6 ret kodu var — ne yapmalıyım?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "C6 kodu 'Pasaport veya seyahat belgesi geçerli değil' anlamına gelir. Pasaportunuzun süresi, geçerlilik tarihi veya boş sayfa durumu başvuru kriterlerini karşılamıyor olabilir. Pasaportunuzu yenileyip yeni başvuru yapmanız gerekir.",
      },
    },
    {
      '@type': 'Question',
      name: 'Ret kararına itiraz nasıl yapılır?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'İtiraz, reddi veren konsolosluğun bağlı olduğu ülkenin ilgili idare mahkemesine veya itiraz makamına yazılı dilekçe ile yapılır. Dilekçede ret kararının hatalı veya eksik değerlendirme içerdiğini kanıtlayan belgeler eklenir. İtiraz sonucu olumlu çıkmazsa yeni başvuru yapılabilir.',
      },
    },
    {
      '@type': 'Question',
      name: 'Ret sonrası hemen yeni başvuru yapılabilir mi?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Evet, yasal bir bekleme süresi yoktur. Ancak ret gerekçesini gidermeden yapılan yeni başvurular genellikle yine reddedilir. Ret kararını dikkatlice okuyun, eksiklikleri tamamlayın, dosyayı güçlendirin. Özellikle aynı konsolosluktan birden fazla ret almak bir sonraki başvuruyu zorlaştırır.',
      },
    },
    {
      '@type': 'Question',
      name: 'Ret kararı vize geçmişimi nasıl etkiler?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ret kararları Schengen bilgi sistemine işlenir ve diğer üye ülkelerin konsolosluklarına görünür. Tek bir ret çok büyük sorun yaratmaz; ancak aynı gerekçelerle birden fazla ret almak güven profilinizi zayıflatır. EES sisteminin devreye girmesiyle birlikte overstay kayıtlarının da aynı şekilde kalıcı izlere yol açtığını unutmayın.',
      },
    },
  ],
};

const RET_KODLARI = [
  { kod: 'C1', anlam: 'Sahte veya değiştirilmiş belge sunuldu', yol: 'Dolandırıcılık kapsamına girer; itiraz yetersiz kalır. Hukuki danışmanlık alın.' },
  { kod: 'C2', anlam: 'Vize amacını ve koşullarını kanıtlayan seyahat belgesi yok', yol: 'Pasaport veya seyahat belgesi yoktur ya da geçerli değildir.' },
  { kod: 'C3', anlam: 'Seyahat amacı ve koşulları kanıtlanmadı', yol: 'Niyet mektubu, rezervasyon, davetiye eksik veya yetersiz. Dosyayı yeniden hazırlayın.' },
  { kod: 'C4', anlam: 'Mali yeterlilik kanıtlanmadı', yol: "En yaygın ret gerekçesi. Banka hesabı, maaş bordrosu, mali kefalet belgesi güçlendirilmeli." },
  { kod: 'C5', anlam: "Daha önce 90/180 gün aşımı yapılmış", yol: "EES öncesinde de ciddi bir ret gerekçesiydi. EES sonrasında kalıcı kayıt oluşturuyor. Gerçek bir ihlal varsa itiraz zordur." },
  { kod: 'C6', anlam: 'Pasaport ya da seyahat belgesi geçersiz', yol: 'Pasaportu yenileyin. Süre, boş sayfa veya hasar sorunu olabilir.' },
  { kod: 'C7', anlam: 'Seyahat sigortası yok veya yetersiz', yol: 'Minimum 30.000 Euro kapsam, tüm Schengen bölgesi geçerli, seyahat tarihlerini kapsayan sigorta sunun.' },
  { kod: 'C8', anlam: "Üçüncü ülkeye geri dönüş bağlantısı kanıtlanmadı", yol: 'İş, mülk, aile bağı kanıtlayın. İzin yazısı, tapu, doğum belgesi işe yarar.' },
  { kod: 'C9', anlam: "Asıl oturma ülkesinden başvuru yapılmadı", yol: "Türkiye'de ikamet etmeyenler için. İkamet durumunuzu belgeleyin veya yetkili konsolosluğu bulun." },
  { kod: 'C10', anlam: "Çocuk için yetki belgesi eksik", yol: "Refakat eden ebeveynin yanında olmayan çocuklar için noter onaylı veli izni gerekir." },
  { kod: 'C11', anlam: 'Ülkeye giriş yasağı mevcut (SIS uyarısı)', yol: "Schengen ülkelerinden birinin ülkeye girişi yasakladığını gösterir. Yasaklayan ülkeye başvurup kaydı temizlemek gerekir." },
  { kod: 'C12', anlam: "Kamu politikası veya ulusal güvenlik tehdidi", yol: "İtiraz etmek için hukuki destek şarttır." },
  { kod: 'C13', anlam: 'Vize ücreti ödenmedi', yol: 'Teknik bir ret; ücreti ödeyerek yeniden başvurun.' },
  { kod: 'C14', anlam: 'Birden fazla gerekçe mevcuttur', yol: 'C14 tek bir sorun değildir; ret kararının ayrıntısını okuyun ve tüm eksiklikleri giderin.' },
];

export default function SchengenRetKodlari() {
  return (
    <BlogPostLayout post={POST} schema={[ARTICLE_SCHEMA, FAQ_SCHEMA]}>

      <p className="text-slate-700 leading-relaxed text-base mb-6">
        Schengen vize ret bildirimi elinize geçtiğinde ilk bakacağınız yer:
        hangi kutucuk işaretlenmiş. C1'den C14'e uzanan bu kodlar, konsolosluğun
        red gerekçesini standartlaştırılmış biçimde bildirmesini sağlar.
        Kodu bilirseniz neyin eksik olduğunu anlarsınız ve bir sonraki adımı
        doğru planlarsınız.
      </p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-800 text-sm mb-1">Ret ≠ Kalıcı Engel</p>
          <p className="text-amber-700 text-sm leading-relaxed">
            Schengen vizesi reddedilmesi, bir daha vize alamamak anlamına gelmez.
            Büyük çoğunluk doğru dosya hazırlığıyla bir sonraki başvuruda olumlu
            sonuç alır. Önemli olan red gerekçesini anlamak ve gerçekten gidermektir.
          </p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">C1–C14 Ret Kodları Tablosu</h2>
      <div className="space-y-3 mb-10">
        {RET_KODLARI.map(({ kod, anlam, yol }) => (
          <div key={kod} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-100 px-4 py-2 flex items-center gap-3">
              <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full border border-red-200">{kod}</span>
              <p className="font-semibold text-slate-800 text-sm">{anlam}</p>
            </div>
            <div className="px-4 py-3">
              <p className="text-sm text-slate-600 leading-relaxed">{yol}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">En Sık Görülen 3 Ret Gerekçesi ve Çözümü</h2>
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          {
            no: '1',
            kod: 'C4 — Mali Yetersizlik',
            cozum: "Son 6 aylık banka özetini sunun. Hesaba son dakika para yatırmak değil, düzenli gelir akışı kritik. Mülk, tapu veya araç belgesi ek destek sağlar.",
          },
          {
            no: '2',
            kod: 'C3 — Seyahat Amacı',
            cozum: "Niyet mektubu kişisel ve inandırıcı olmalı. Turistik güzergah, aile bağı, iş toplantısı — amacı somut belgelerle destekleyin.",
          },
          {
            no: '3',
            kod: 'C8 — Geri Dönüş Bağlantısı',
            cozum: "İşe giriş bildirimi + izin yazısı güçlü kanıttır. Kira kontratı, tapu ya da okul kaydı da geri dönüş niyetini kanıtlar.",
          },
        ].map(({ no, kod, cozum }) => (
          <div key={no} className="bg-white border border-slate-200 rounded-xl p-4 text-sm">
            <p className="font-bold text-brand-700 mb-1">{no}.</p>
            <p className="font-semibold text-slate-800 mb-2">{kod}</p>
            <p className="text-slate-600 leading-relaxed">{cozum}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">İtiraz Hakkı Nasıl Kullanılır?</h2>
      <div className="space-y-3 mb-8">
        {[
          { n: '1', b: "Ret bildirimini okuyun", d: "Hangi kodlar işaretlenmiş? Ret gerekçeleri net belirtilmiş mi? Bildirimde itiraz süresi ve makamı yazmalı." },
          { n: '2', b: "Süreyi takip edin", d: "Genellikle 8 hafta içinde itiraz yapılmalı. Bu süre ülkeden ülkeye değişir; bildirimdeki tarihe bakın." },
          { n: '3', b: "İtiraz dilekçesi hazırlayın", d: "Ret kararının hatalı veya yetersiz değerlendirme içerdiğini kanıtlayan belgelerle desteklenmiş yazılı dilekçe." },
          { n: '4', b: "İlgili makama gönderin", d: "İtiraz genellikle reddi veren konsolosluğun bağlı olduğu ülkenin idare mahkemesine yapılır." },
          { n: '5', b: "Sonuca göre hareket edin", d: "İtiraz reddedilirse yeni başvuru yolu açıktır. İtiraz onaylanırsa vize yeniden değerlendirilir." },
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

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-8 flex gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-emerald-800 text-sm mb-1">Danışman İpucu: İtiraz mı, Yeni Başvuru mu?</p>
          <p className="text-emerald-700 text-sm leading-relaxed">
            İtiraz süreci uzun ve belirsizdir. Çoğu durumda ret gerekçesini gerçekten
            gideren yeni bir başvuru, itirazdan daha hızlı ve pratik sonuç verir.
            İtirazı tercih edin; ancak yalnızca kararın açık bir hata veya haksızlık
            içerdiğini düşünüyorsanız.
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
        <h3 className="font-bold text-brand-900 mb-2">Ret Kodu: Yol Haritası, Engel Değil</h3>
        <p className="text-brand-800 text-sm leading-relaxed">
          C kodları, konsolosluğun size söylediği şeyin kısaltmasıdır. Onu anlamak,
          bir sonraki başvuruyu nasıl hazırlayacağınızı anlamaktır. Paniklemek yerine
          kodu çözün, eksikliği giderin ve güçlü bir dosyayla geri dönün.
        </p>
      </div>

    </BlogPostLayout>
  );
}
