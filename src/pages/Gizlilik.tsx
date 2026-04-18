import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { SEO } from '../components/SEO';

const Gizlilik: React.FC = () => (
  <div className="min-h-screen bg-slate-50">
    <SEO
      title="Gizlilik Politikası | VizeAkıl"
      description="VizeAkıl'ın kullanıcı verilerini nasıl topladığı, işlediği, koruduğu ve sakladığına dair güncel gizlilik politikası."
      canonical="/gizlilik-politikasi"
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
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Gizlilik Politikası</h1>
      <p className="text-slate-500 text-sm mb-2">Yürürlük tarihi: 19 Nisan 2026</p>
      <p className="text-slate-500 text-sm mb-8">Versiyon: 2.0</p>

      <div className="space-y-8 text-slate-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">1. Kapsam</h2>
          <p>
            İşbu Gizlilik Politikası; <strong>vizeakil.com</strong> alan adı ve tüm alt alan
            adları üzerinden sunulan hizmetler bakımından; kullanıcıların kişisel verilerinin
            nasıl toplandığını, işlendiğini, saklandığını, korunduğunu ve hangi koşullarda
            aktarıldığını düzenler. Politika; 6698 sayılı Kişisel Verilerin Korunması Kanunu
            ve mümkün mertebe Avrupa Birliği Genel Veri Koruma Tüzüğü (GDPR) ilkelerine uygun
            olarak hazırlanmıştır.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">2. Topladığımız Veriler</h2>
          <p>Hizmetin ifası için gerekli asgari veri ilkesi gözetilerek aşağıdaki veriler toplanır:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1.5 text-sm">
            <li><strong>Doğrudan tarafınızdan sağlanan veriler:</strong> Vize profil girdileri (meslek segmenti, finansal durum aralıkları, seyahat geçmişi, hedef ülke), iletişim bilgileri, başvuru sonuç bildirimleri.</li>
            <li><strong>Otomatik toplanan veriler:</strong> IP adresi, oturum tanımlayıcıları, tarayıcı/işletim sistemi bilgisi, kullanım log'ları ve hata kayıtları.</li>
            <li><strong>Çerez verileri:</strong> Çerez Politikası'nda detaylandırılan kategorilerdeki çerezler aracılığıyla elde edilen tercih ve oturum verileri.</li>
          </ul>
          <p className="mt-3 text-sm bg-emerald-50 border border-emerald-200 p-3 rounded">
            <strong>Önemli:</strong> Ham banka dökümü, pasaport fotokopisi ve benzeri hassas belge içerikleri sunucularımıza yüklenmez.
            Belge analizine ilişkin işlemler kullanıcının tarayıcısı üzerinde (istemci tarafında) gerçekleştirilir ve yalnızca türetilmiş anonim sonuçlar
            gerekli olduğu ölçüde saklanır.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">3. Verilerin Kullanım Amaçları</h2>
          <ul className="list-disc pl-5 mt-2 space-y-1.5 text-sm">
            <li>Skor tahmini, belge kontrol listesi ve niyet mektubu önerisi gibi kişiselleştirilmiş hizmetlerin sunumu,</li>
            <li>Kullanıcı desteği, şikâyet/geri bildirim yönetimi ve hesap güvenliğinin sağlanması,</li>
            <li>Hizmetin iyileştirilmesine yönelik toplu ve anonim istatistiksel analiz,</li>
            <li>Yasal yükümlülüklerin yerine getirilmesi ve uyuşmazlık çözümü,</li>
            <li>Açık rızaya tabi pazarlama iletişimi (abonelik alınması hâlinde).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">4. Veri Paylaşımı ve Aktarım</h2>
          <p>
            Kişisel verileriniz; yalnızca hizmetin sunumu için zorunlu olan alt yüklenici ve
            iş ortaklarıyla, işlerliği sağlayacak asgari kapsamda paylaşılır. Söz konusu paylaşım
            şu kategorilerle sınırlıdır:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1.5 text-sm">
            <li>Barındırma ve altyapı sağlayıcıları,</li>
            <li>E-posta gönderim hizmetleri,</li>
            <li>Ödeme altyapısı (iyzico) — yalnızca zorunlu ödeme bilgileri,</li>
            <li>Resmi makamların mevzuata uygun talepleri.</li>
          </ul>
          <p className="mt-3">
            Kişisel verileriniz; <strong>reklamcılık, profil satışı veya pazarlama amacıyla üçüncü kişilere aktarılmaz</strong>.
            Yurt dışı aktarım, yalnızca KVKK Madde 9 ve GDPR 44-50 maddeleri çerçevesinde yeterli
            korumayı sağlayan mekanizmalarla gerçekleştirilir.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">5. Saklama Süreleri</h2>
          <p>
            Kişisel verileriniz, amaç için gerekli olduğu süre boyunca ve ilgili mevzuatın öngördüğü
            asgari süreler boyunca saklanır. Detaylı saklama takvimi için
            <Link to="/kvkk" className="text-brand-600 hover:underline font-medium"> KVKK Aydınlatma Metni</Link>
            Bölüm 7'ye başvurabilirsiniz.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">6. Güvenlik Tedbirleri</h2>
          <p>Kişisel verilerinizi korumak için aşağıdaki teknik ve idari tedbirleri uygulamaktayız:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1.5 text-sm">
            <li>Tüm veri iletişimi TLS 1.2+ standartlarında şifrelenmektedir (HTTPS).</li>
            <li>API anahtarları ve kritik sırlar yalnızca sunucu tarafı ortam değişkenlerinde tutulur; istemciye hiçbir koşulda aktarılmaz.</li>
            <li>Üçüncü taraf AI servislerine yapılan çağrılar yalnızca sunucu üzerinden gerçekleştirilir; anahtar bilgileri tarayıcıda yer almaz.</li>
            <li>Erişim kontrolleri asgari yetki ilkesine göre uygulanır; çalışanlar yalnızca görev tanımları gerektirdiği ölçüde veriye erişebilir.</li>
            <li>Düzenli yedekleme ve felaket kurtarma süreçleri işletilmektedir.</li>
            <li>Güvenlik ihlali veya veri ihlali durumunda; ilgili kişiler ve Kişisel Verileri Koruma Kurulu, mevzuatta öngörülen süreler içinde bilgilendirilir.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">7. Çocukların Gizliliği</h2>
          <p>
            Platform, 18 yaşın altındaki kullanıcılara yönelik olarak tasarlanmamıştır. 18 yaşından
            küçük olduğunu öğrendiğimiz kullanıcıların hesapları kapatılır ve verileri silinir.
            Reşit olmayan kişilerin başvurularında veli veya vasi onayı aranması önerilir.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">8. Haklarınız</h2>
          <p>
            Kişisel verileriniz hakkında sahip olduğunuz haklara ilişkin detaylı bilgi için
            <Link to="/kvkk" className="text-brand-600 hover:underline font-medium"> KVKK Aydınlatma Metni</Link>
            Bölüm 8'i inceleyebilirsiniz.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">9. Politika Değişiklikleri</h2>
          <p>
            İşbu Gizlilik Politikası zaman zaman güncellenebilir. Her güncelleme, üst kısımdaki
            yürürlük tarihinin değiştirilmesi suretiyle kullanıcıların bilgisine sunulur.
            Esaslı değişiklikler ayrıca elektronik posta veya site içi bildirim ile duyurulur.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">10. İletişim</h2>
          <p>
            Gizlilik ile ilgili her türlü başvuru için: <strong>gizlilik@vizeakil.com</strong>.
            KVKK kapsamındaki haklarınızın kullanımı için <strong>kvkk@vizeakil.com</strong> adresine başvurabilirsiniz.
          </p>
        </section>
      </div>
    </main>
  </div>
);

export default Gizlilik;
