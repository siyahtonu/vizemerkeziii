import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Target, Brain, Scale, BookOpen } from 'lucide-react';
import { SEO } from '../components/SEO';

const Hakkimizda: React.FC = () => (
  <div className="min-h-screen bg-slate-50">
    <SEO
      title="Hakkımızda | VizeAkıl"
      description="VizeAkıl, Türk vatandaşlarının Schengen, Birleşik Krallık ve Amerika Birleşik Devletleri vize başvurularını ampirik veri temelli bir algoritma ile ön değerlendiren bağımsız bir platformdur."
      canonical="/hakkimizda"
    />
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 py-4">
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2 text-brand-600 font-bold hover:opacity-80 transition-opacity">
          <ArrowLeft className="w-5 h-5" /> Ana Sayfa
        </Link>
        <div className="h-4 w-px bg-slate-300" />
        <div className="flex items-center gap-2 text-slate-700 font-display font-bold text-lg">
          <ShieldCheck className="w-5 h-5 text-brand-600"/> VizeAkıl
        </div>
      </div>
    </nav>

    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Hakkımızda</h1>
      <p className="text-slate-600 text-lg leading-relaxed mb-10">
        VizeAkıl; Türk vatandaşlarının vize başvuru sürecini şeffaflaştırmak,
        bireysel profilleri nesnel kriterlerle ön değerlendirmek ve başvuru hazırlığını
        veri temelli önerilerle desteklemek amacıyla kurulmuş bağımsız bir dijital platformdur.
      </p>

      <div className="space-y-8">
        {/* Misyon */}
        <section className="p-7 bg-white rounded-2xl border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-brand-600"/>
            </div>
            <h2 className="text-xl font-bold text-slate-900">Misyonumuz</h2>
          </div>
          <p className="text-slate-700 leading-relaxed">
            Misyonumuz, Türkiye'den yurt dışına seyahat etmek isteyen her bireyin;
            başvuru öncesi profilini nesnel kriterlerle değerlendirebilmesini,
            başvurunun hangi boyutlarının güçlü, hangilerinin zayıf olduğunu somut verilerle görebilmesini
            ve eksik olan belge, bağ veya nitelikleri önceden tamamlayabilmesini sağlamaktır.
          </p>
          <p className="text-slate-700 leading-relaxed mt-3">
            Vize süreci çoğu başvuru sahibi için belirsizlik, yüksek danışmanlık ücretleri ve
            bilgi asimetrisi anlamına gelir. VizeAkıl; kamuya açık konsolosluk istatistiklerini,
            gerçek başvuru sonuçlarından damıtılmış örüntüleri ve kural tabanlı bir skorlama motorunu
            tek bir arayüzde birleştirerek bu asimetriyi azaltmayı amaçlar. Hedefimiz, bir kullanıcının
            danışmanlık firmalarına gitmeden önce kendi başvurusu hakkında bilinçli bir karar verebilmesidir.
          </p>
        </section>

        {/* Algoritma — %30 şeffaflık */}
        <section className="p-7 bg-white rounded-2xl border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
              <Brain className="w-5 h-5 text-brand-600"/>
            </div>
            <h2 className="text-xl font-bold text-slate-900">Algoritmamız Nasıl Çalışır?</h2>
          </div>
          <p className="text-slate-700 leading-relaxed mb-4">
            VizeAkıl skor motoru; başvuru sahibinin profilini sekiz farklı boyutta, birden çok
            katmandan geçen bir işleme hattı (pipeline) ile değerlendirir. Her katman, başvurunun
            farklı bir gerçekliğini modeller.
          </p>

          <ol className="space-y-3 text-slate-700 text-sm leading-relaxed list-decimal pl-5">
            <li>
              <span className="font-semibold text-slate-900">Kural tabanlı ham puan:</span>{' '}
              Finansal durum, mesleki geçmiş, Türkiye'deki bağlar, seyahat tarihi, başvuru kalitesi,
              belge tutarlılığı, ülkeye özgü kurallar ve kritik veto faktörleri (süre aşımı, sahte beyan)
              üzerinden 0-100 aralığında bir ham puan hesaplanır.
            </li>
            <li>
              <span className="font-semibold text-slate-900">Lineer kalibrasyon:</span>{' '}
              Ham puan, hedef ülkenin Türk vatandaşları için kamuya açık ret oranıyla ağırlıklı ortalama
              olarak harmanlanır (Bayes posterior değil; baz ret oranını profil puanına kademeli enjekte
              eden bir kalibrasyon katmanı). Böylece skor yalnızca bireysel profili değil, o ülkenin
              genel katılık düzeyini de yansıtır.
            </li>
            <li>
              <span className="font-semibold text-slate-900">Profil-ülke uyum matrisi:</span>{' '}
              Meslek segmenti ile ülke eşleşmesine göre kalibre edilir.
              Örneğin aynı profil, bazı Schengen ülkelerinde diğerlerine kıyasla daha avantajlıdır.
            </li>
            <li>
              <span className="font-semibold text-slate-900">Konsolosluk ve şehir kalibrasyonu:</span>{' '}
              Başvurucunun bağlı olduğu konsolosluğun tarihsel ruh hali ve eğilimleri skoru hafifçe modüle eder.
            </li>
            <li>
              <span className="font-semibold text-slate-900">Mevsimsel ayarlama:</span>{' '}
              Başvurunun yapıldığı ay ve yıl, yoğun dönemlerde ret oranı artışlarını hesaba katar.
            </li>
          </ol>

          <p className="text-slate-700 leading-relaxed mt-4">
            Yukarıdaki katmanlar, VizeAkıl algoritmasının genel çerçevesidir. Ağırlık katsayıları,
            matris içerikleri, veto eşikleri ve kalibrasyon parametreleri başta olmak üzere algoritmanın
            ayrıntılı içyapısı ticari sır kapsamındadır ve üçüncü şahıslarla paylaşılmaz.
          </p>

          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-900">
            <span className="font-semibold">Önemli uyarı:</span> VizeAkıl tarafından üretilen tüm
            skor, olasılık ve öneriler istatistiksel tahminlerdir ve hiçbir surette konsolosluk
            kararını garanti etmez. Vize kararı yalnızca ilgili ülkenin konsolosluğunun münhasır
            takdirindedir.
          </div>
        </section>

        {/* Veri & Metodoloji */}
        <section className="p-7 bg-white rounded-2xl border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-brand-600"/>
            </div>
            <h2 className="text-xl font-bold text-slate-900">Veri Kaynaklarımız ve Güncellik</h2>
          </div>
          <p className="text-slate-700 leading-relaxed">
            Algoritmamız; Avrupa Birliği Komisyonu'nun yıllık Schengen vize istatistikleri,
            hedef ülke konsolosluklarının kamuya açık başvuru kılavuzları, bağımsız hukuki
            kaynaklar ve anonim bir havuzda toplanan başvuru sonuçlarından elde edilen ampirik
            örüntülerle kalibre edilmektedir. Veri havuzumuz ve kalibrasyon parametreleri
            düzenli aralıklarla güncellenir; kullanıcılarımızdan gelen gönüllü başvuru sonuç
            bildirimleri de bu sürecin parçasıdır.
          </p>
        </section>

        {/* Bağımsızlık & Etik */}
        <section className="p-7 bg-white rounded-2xl border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
              <Scale className="w-5 h-5 text-brand-600"/>
            </div>
            <h2 className="text-xl font-bold text-slate-900">Bağımsızlık ve Etik İlkeler</h2>
          </div>
          <ul className="space-y-2 text-slate-700 text-sm leading-relaxed list-disc pl-5">
            <li>VizeAkıl, hiçbir konsolosluk, vize başvuru merkezi veya aracı kurum ile organik bir bağa sahip değildir.</li>
            <li>Kullanıcıların kişisel verileri 6698 sayılı Kişisel Verilerin Korunması Kanunu çerçevesinde işlenir; üçüncü kişilere pazarlama amacıyla aktarılmaz.</li>
            <li>Sunulan skor, öneri ve içerikler bilgilendirme amaçlıdır; hukuki danışmanlık, göçmenlik danışmanlığı veya resmi başvuru hizmeti niteliği taşımaz.</li>
            <li>Platformda yayımlanan içerikler tarafsızdır; belirli bir ülke, konsolosluk veya firma lehine/aleyhine yönlendirme içermez.</li>
          </ul>
        </section>

        <div className="text-center">
          <Link to="/iletisim"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-colors">
            İletişime Geç →
          </Link>
        </div>
      </div>
    </main>
  </div>
);

export default Hakkimizda;
