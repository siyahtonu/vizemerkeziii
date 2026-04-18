import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, ShieldCheck, ChevronDown, ChevronUp,
  BarChart3, Calendar, Sparkles, Radar, GitCompare,
  Wallet, CalendarClock, FileText, Map, HelpCircle,
} from 'lucide-react';
import { SEO } from '../components/SEO';

// ── Araç tanımları ─────────────────────────────────────────────────────
type Tool = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  what: string;
  how: string;
  when: string;
};

const tools: Tool[] = [
  {
    icon: BarChart3,
    title: 'Ret Riski Analizi',
    what: 'Profilinizin istatistiksel ret olasılığını, her ret sebebinin ağırlığına göre ayrıştırarak gösterir.',
    how: 'Analiz ekranında otomatik olarak hesaplanır. Üzerine tıklayarak hangi faktörün riski ne kadar artırdığını görebilirsiniz.',
    when: 'Başvurunuzun en zayıf halkasını tespit etmek ve önce hangi eksiği kapatmanız gerektiğine karar vermek için.',
  },
  {
    icon: Calendar,
    title: 'Mevsimsellik Göstergesi',
    what: 'Seçtiğiniz ülke ve aya göre konsolosluk yoğunluğunu ve tarihsel ret eğilimini yansıtır.',
    how: 'Başvuru tarihinizi girdiğinizde, seçtiğiniz ayın ret oranını nasıl etkilediğini skorunuzda görebilirsiniz.',
    when: 'Esnek bir seyahat takviminiz varsa; yüksek ret dönemlerinden kaçınmak ve uygun pencereyi bulmak için.',
  },
  {
    icon: Sparkles,
    title: 'Ne Olur Eğer? Simülatörü',
    what: 'Yaptıklarınızı kaldırırsanız ne kadar puan kaybedersiniz veya eksiklerinizi tamamlarsanız ne kadar kazanırsınız, canlı olarak görürsünüz.',
    how: 'Panelde "Yaptıkların" bölümü mevcut kazanımlarınızı, "Yapabileceklerin" ise tamamlayabileceğiniz eylemleri listeler. Her satır +/- puan etkisini gösterir.',
    when: 'Hangi belge veya hazırlığın başvurunuza en çok katkı sağlayacağını önceliklendirmek için.',
  },
  {
    icon: Radar,
    title: 'Profil Radar Haritası',
    what: 'Sekiz başvuru boyutundaki (finansal, bağlar, seyahat, belge vb.) performansınızı tek görselde gösterir.',
    how: 'Panelin üst bölümünde bulunan örümcek grafik; eksenlerde 0–100 arası puanlarınızı gösterir.',
    when: 'Profilinizin genel dengesini görmek ve "tek bacak eksik" tablosunun hangi boyut olduğunu tespit etmek için.',
  },
  {
    icon: GitCompare,
    title: 'Ülke Karşılaştırma',
    what: 'Aynı profille farklı Schengen ülkeleri veya Birleşik Krallık / ABD arasında hangisinin sizin için daha uygun olduğunu karşılaştırır.',
    how: 'Panelden ek ülke seçerek skorlarınızı yan yana görebilirsiniz.',
    when: 'Esnek bir destinasyon seçeneğiniz varsa veya ilk başvurunuzu en yüksek kabul şansıyla vermek istiyorsanız.',
  },
  {
    icon: Wallet,
    title: 'Maliyet Hesaplayıcı',
    what: 'Başvuru ücreti, VFS servis bedeli, sigorta, tercüme ve seyahat belgeleri dâhil toplam masrafı tahmin eder.',
    how: 'Panel içindeki "Maliyet" modalında ülke, refakatçi sayısı ve ek hizmetleri seçerek hesaplatabilirsiniz.',
    when: 'Başvuru bütçenizi planlamak ve PDF raporunuza maliyet özetini eklemek için.',
  },
  {
    icon: CalendarClock,
    title: '90/180 Gün Hesaplayıcı',
    what: 'Önceki Schengen girişlerinize göre önümüzdeki 180 günlük pencere içinde kaç gün daha kalma hakkınız olduğunu hesaplar.',
    how: 'Geçmiş giriş-çıkış tarihlerinizi girdiğinizde, aşım riski ve kalan süreniz otomatik olarak çıkar.',
    when: 'Çoklu giriş vizesiyle seyahat ederken ve özellikle EES sonrası otomatik süre takibine geçilmişken kritiktir.',
  },
  {
    icon: FileText,
    title: 'AI Destekli Niyet Mektubu',
    what: 'Profilinize özel, konsolosluğa yönelik niyet mektubu taslağı üretir.',
    how: 'Panelde "Mektup" sekmesinden oluşturup üzerinde serbestçe düzenleme yapabilirsiniz.',
    when: 'Özellikle Birleşik Krallık ve ABD başvurularında ya da Schengen için detaylı açıklama gereken durumlarda.',
  },
  {
    icon: Map,
    title: 'Taktikler ve Eylem Planı',
    what: 'Profilinize göre hangi belgeleri, ne sırayla ve ne kadar süre öncesinden hazırlamanız gerektiğini listeler.',
    how: 'Panelden "Taktikler" sekmesine geçerek haftalık eylem planınızı görebilirsiniz.',
    when: 'Başvuru tarihi öncesinde zamanı verimli kullanmak ve son dakika eksiklerinden kaçınmak için.',
  },
];

// ── SSS ────────────────────────────────────────────────────────────────
type Faq = { q: string; a: React.ReactNode };

const faqs: Faq[] = [
  {
    q: 'VizeAkıl resmi bir vize başvuru merkezi midir?',
    a: (
      <>
        Hayır. VizeAkıl; hiçbir konsolosluk veya vize başvuru merkeziyle kurumsal bağı bulunmayan
        bağımsız bir dijital değerlendirme platformudur. Resmi başvurular yalnızca ilgili ülkenin
        konsolosluğu veya yetkili başvuru merkezi üzerinden yapılır.
      </>
    ),
  },
  {
    q: 'Skorun yüksek olması vizeyi garantiler mi?',
    a: (
      <>
        Hayır. Skor, kamuya açık istatistiklere ve ampirik örüntülere dayalı bir <strong>tahmindir</strong>;
        konsolosluğun münhasır takdirini etkilemez. Yüksek skor, başvurunuzun güçlü yönleri olduğunu
        gösterir; ancak tek başına kabul anlamına gelmez.
      </>
    ),
  },
  {
    q: 'Verdiğim bilgileri saklıyor musunuz?',
    a: (
      <>
        Pasaport, banka dökümü veya kimlik gibi ham belge içerikleri sunucularımıza yüklenmez; belge
        analizi tarayıcınızda gerçekleştirilir. Ayrıntı için{' '}
        <Link to="/gizlilik-politikasi" className="text-brand-600 hover:underline">Gizlilik Politikası</Link>{' '}
        ve{' '}
        <Link to="/kvkk" className="text-brand-600 hover:underline">KVKK Aydınlatma Metni</Link>.
      </>
    ),
  },
  {
    q: 'Hangi ülkeler için skorlama yapılabiliyor?',
    a: (
      <>
        Tüm Schengen üyesi devletler, Birleşik Krallık ve Amerika Birleşik Devletleri için ayrı
        ayrı kalibre edilmiş puanlama sağlanır. Her ülkenin Türk vatandaşları için tarihsel ret
        oranı, meslek profili uyumu ve konsolosluk eğilimi ayrıca hesaba katılır.
      </>
    ),
  },
  {
    q: 'Profilimi girdim ama skorum düşük çıktı. Ne yapmalıyım?',
    a: (
      <>
        Öncelikle panelden <strong>Ret Riski Analizi</strong> ile en zayıf boyutunuzu belirleyin.
        Ardından <strong>Ne Olur Eğer?</strong> simülatöründe "Yapabileceklerin" sekmesinde en yüksek
        puan kazandıracak eylemlere öncelik verin. Başvuruyu aceleye getirmek yerine eksikleri
        tamamlamak uzun vadede daha yüksek kabul şansı sağlar.
      </>
    ),
  },
  {
    q: 'Daha önce vizem reddedildi. Yeniden başvurmam doğru mu?',
    a: (
      <>
        Ret kararı bir yasak değildir; yeniden başvurabilirsiniz. Ancak aynı koşullarla yapılan
        ikinci bir başvurunun kabul şansı düşüktür. Profilinizdeki eksiği (belge tutarsızlığı,
        finansal yetersizlik, zayıf bağlar vb.) somut biçimde kapatmadan başvurmamanız önerilir.
        Yeni başvurudan önce{' '}
        <Link to="/blog/vize-reddi-sonrasi-ne-yapmali-itiraz-rehberi" className="text-brand-600 hover:underline">
          ret sonrası ne yapmalı
        </Link>{' '}
        rehberimizi okuyun.
      </>
    ),
  },
  {
    q: 'Ödeme yaptıktan sonra iade alabilir miyim?',
    a: (
      <>
        Dijital hizmet niteliğindeki aboneliklerde, teslim başlar başlamaz cayma hakkının istisna
        kapsamına girebileceği hatırlatılır. Koşulların ayrıntısı için{' '}
        <Link to="/mesafeli-satis" className="text-brand-600 hover:underline">Mesafeli Satış Sözleşmesi</Link>{' '}
        sayfasına bakabilirsiniz.
      </>
    ),
  },
  {
    q: 'Algoritma güncelleniyor mu?',
    a: (
      <>
        Evet. Profil-ülke matrisi, konsolosluk kalibrasyonu ve mevsimsellik çarpanları; Avrupa
        Birliği Komisyonu'nun yıllık Schengen istatistikleri, kullanıcı geri bildirimleri ve kamuya
        açık rehberlerdeki değişiklikler doğrultusunda düzenli aralıklarla güncellenir.
      </>
    ),
  },
  {
    q: 'Sonucumu nasıl paylaşabilirim?',
    a: (
      <>
        Panelin üst bölümünde yer alan <strong>PDF Raporu</strong> butonu, skorunuzu, radar
        haritanızı, maliyet özetinizi ve öneri listenizi tek bir belgede dışa aktarır. Bu belgeyi
        danışmanınızla veya aile üyelerinizle paylaşabilirsiniz.
      </>
    ),
  },
  {
    q: 'Sitede hata veya yanlış bilgi buldum.',
    a: (
      <>
        Geri bildirimleriniz için{' '}
        <Link to="/iletisim" className="text-brand-600 hover:underline">İletişim</Link>{' '}
        sayfasındaki formu veya{' '}
        <a href="mailto:destek@vizeakil.com" className="text-brand-600 hover:underline">
          destek@vizeakil.com
        </a>{' '}
        adresini kullanabilirsiniz. Konsolosluk kurallarındaki değişiklik bildirimleri öncelikli
        olarak değerlendirilir.
      </>
    ),
  },
];

// ── Sayfa ───────────────────────────────────────────────────────────────
const Yardim: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO
        title="Yardım & Araç Rehberi | VizeAkıl"
        description="VizeAkıl'ın sunduğu skor analizi, risk değerlendirmesi, simülatör, karşılaştırma ve hesaplayıcı araçlarının ne işe yaradığı ve nasıl kullanılacağına dair rehber."
        canonical="/yardim"
      />

      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 text-brand-600 font-bold hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5" /> Ana Sayfa
          </Link>
          <div className="h-4 w-px bg-slate-300" />
          <div className="flex items-center gap-2 text-slate-700 font-display font-bold text-lg">
            <ShieldCheck className="w-5 h-5 text-brand-600" /> VizeAkıl
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Yardım &amp; Araç Rehberi</h1>
          <p className="text-slate-600 leading-relaxed">
            VizeAkıl'da kullanabileceğiniz tüm analiz araçlarının ne işe yaradığını, nasıl çalıştığını
            ve hangi durumda hangi aracı kullanmanız gerektiğini aşağıda bulabilirsiniz. En altta ise
            sıkça sorulan sorulara doğrudan yanıtlar yer alır.
          </p>
        </header>

        {/* ── Araçlar ───────────────────────────────────────── */}
        <section className="mb-14">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-brand-600" /> Araçlar
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            {tools.map(({ icon: Icon, title, what, how, when }) => (
              <article
                key={title}
                className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-brand-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base leading-tight">{title}</h3>
                </div>

                <dl className="space-y-2.5 text-sm">
                  <div>
                    <dt className="font-semibold text-slate-800">Ne yapar?</dt>
                    <dd className="text-slate-600 leading-relaxed mt-0.5">{what}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-800">Nasıl kullanılır?</dt>
                    <dd className="text-slate-600 leading-relaxed mt-0.5">{how}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-800">Ne zaman faydalıdır?</dt>
                    <dd className="text-slate-600 leading-relaxed mt-0.5">{when}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>

        {/* ── Adım adım kullanım ─────────────────────────────── */}
        <section className="mb-14">
          <h2 className="text-xl font-bold text-slate-900 mb-6">VizeAkıl'ı nasıl kullanmalısınız?</h2>

          <ol className="space-y-4 text-slate-700 text-sm leading-relaxed">
            {[
              {
                t: 'Profil bilgilerinizi girin',
                d: 'Meslek, finansal durum aralığı, Türkiye\'deki bağlar, seyahat geçmişi ve hedef ülke. Veriler net olduğunda skor da isabetli olur.',
              },
              {
                t: 'Skorunuzu ve zayıf boyutlarınızı görün',
                d: 'Panel, sekiz boyut üzerinden sizi puanlar. Ret Riski Analizi hangi faktörlerin ağır bastığını gösterir.',
              },
              {
                t: '"Ne Olur Eğer?" simülatörü ile önceliklendirin',
                d: 'En çok puan kazandıracak eylemleri seçin. "Yaptıkların" ile şu an neyin sizi ayakta tuttuğunu, "Yapabileceklerin" ile neyi kazanacağınızı görün.',
              },
              {
                t: 'Taktikler ve belgeler listesini takip edin',
                d: 'Her profil için özel bir eylem planı çıkar. Belgeleri sırayla tamamlamak başvuru gününde stresi azaltır.',
              },
              {
                t: 'Niyet mektubunuzu oluşturun',
                d: 'Özellikle ABD ve Birleşik Krallık başvuruları için kritik. AI tarafından üretilen taslağı mutlaka kişisel detaylarınızla revize edin.',
              },
              {
                t: 'PDF raporunuzu alın',
                d: 'Başvuru hazırlığınızı kayıt altına alır; danışmanla veya aile ile paylaşılabilir tek belgedir.',
              },
            ].map((step, i) => (
              <li key={i} className="flex gap-4">
                <div className="w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold shrink-0">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-0.5">{step.t}</h3>
                  <p className="text-slate-600">{step.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ── SSS ───────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-brand-600" /> Sıkça Sorulan Sorular
          </h2>

          <div className="space-y-2">
            {faqs.map((faq, i) => {
              const open = openIndex === i;
              return (
                <div key={i} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenIndex(open ? null : i)}
                    className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 hover:bg-slate-50 transition-colors"
                    aria-expanded={open}
                  >
                    <span className="font-semibold text-slate-900">{faq.q}</span>
                    {open
                      ? <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                      : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                    }
                  </button>
                  {open && (
                    <div className="px-5 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Ek yardım ─────────────────────────────────────── */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 text-sm">
          <h2 className="font-bold text-slate-900 mb-2">Sorunuz burada yok mu?</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Site kullanımı, skorunuzla ilgili açıklama talepleri veya teknik sorunlar için bize
            ulaşabilirsiniz. Başvurunuzun sonucunu bildirerek algoritmanın iyileşmesine katkıda
            bulunmak isterseniz{' '}
            <Link to="/sonuc-bildir" className="text-brand-600 hover:underline font-medium">
              sonuç bildir
            </Link>{' '}
            formunu kullanabilirsiniz.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/iletisim"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700 transition-colors"
            >
              İletişim Formu
            </Link>
            <a
              href="mailto:destek@vizeakil.com"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors"
            >
              destek@vizeakil.com
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Yardim;
