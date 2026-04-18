import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { SEO } from '../components/SEO';

const CerezPolitikasi: React.FC = () => (
  <div className="min-h-screen bg-slate-50">
    <SEO
      title="Çerez Politikası | VizeAkıl"
      description="VizeAkıl'ın web sitesinde kullandığı çerez türleri, amaçları, saklama süreleri ve çerez yönetimi hakkında bilgilendirme."
      canonical="/cerez-politikasi"
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

    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8 text-slate-700 leading-relaxed">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Çerez Politikası</h1>
        <p className="text-slate-500 text-sm">Yürürlük tarihi: 19 Nisan 2026 · Versiyon: 2.0</p>
      </div>

      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-3">1. Amaç ve Kapsam</h2>
        <p>
          İşbu Çerez Politikası; <strong>vizeakil.com</strong> ve alt alan adlarında kullanılan
          çerezler ("<strong>Cookie</strong>") ve benzeri izleme teknolojileri (yerel depolama,
          oturum depolaması, piksel) hakkında kullanıcıları bilgilendirmek ve 6698 sayılı
          KVKK ile Avrupa Birliği e-Privacy mevzuatı kapsamındaki şeffaflık yükümlülüğünü
          yerine getirmek amacıyla düzenlenmiştir.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-3">2. Çerez Nedir?</h2>
        <p>
          Çerezler; ziyaret edilen web siteleri tarafından kullanıcının cihazına (bilgisayar,
          mobil telefon, tablet) yerleştirilen ve genellikle harf ile rakamlardan oluşan küçük
          metin dosyalarıdır. Çerezler; oturumun sürdürülmesi, tercihlerin hatırlanması, güvenlik
          kontrolleri ve istatistiki analiz gibi işlevler için kullanılır.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-3">3. Çerez Türleri ve Amaçları</h2>

        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h3 className="font-bold text-slate-900 mb-2">a) Zorunlu Çerezler</h3>
            <p className="text-sm">
              Platformun temel işlevlerini (oturum yönetimi, güvenlik kontrolleri, CSRF koruması)
              sağlamak için vazgeçilmezdir. Bu çerezler kullanıcının açık rızası aranmaksızın işlem
              görür; zira hizmetin sunumu bakımından teknik zorunluluk teşkil eder.
            </p>
            <div className="mt-3 text-xs text-slate-500 space-y-1">
              <p>• <code className="bg-slate-50 px-1 rounded">vizeakil_session</code> — Oturum yönetimi (tarayıcı kapanışında silinir)</p>
              <p>• <code className="bg-slate-50 px-1 rounded">vizeakil_csrf</code> — İstek doğrulaması (CSRF)</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h3 className="font-bold text-slate-900 mb-2">b) İşlevsel Çerezler</h3>
            <p className="text-sm">
              Dil, arayüz tercihleri ve taslak başvuru verileri gibi kullanıcı seçimlerini
              hatırlayarak deneyimi iyileştirir. Bu çerezler <strong>localStorage</strong>
              kullanılarak yalnızca kullanıcının tarayıcısında tutulur ve sunucuya aktarılmaz.
            </p>
            <div className="mt-3 text-xs text-slate-500 space-y-1">
              <p>• <code className="bg-slate-50 px-1 rounded">vizeakil_profile_draft</code> — Taslak profil bilgileri</p>
              <p>• <code className="bg-slate-50 px-1 rounded">vizeakil_community_v1</code> — Topluluk deneyim girişleri</p>
              <p>• <code className="bg-slate-50 px-1 rounded">vizeakil_custom_cursor</code> — Arayüz tercihleri</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h3 className="font-bold text-slate-900 mb-2">c) Analitik Çerezler</h3>
            <p className="text-sm">
              Sayfa ziyaretleri, oturum süreleri ve hata istatistikleri gibi toplu verileri
              anonim olarak ölçmek için kullanılır. Kullanıcıların bireysel olarak
              tanımlanmalarına olanak veren hiçbir veri işlenmez.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h3 className="font-bold text-slate-900 mb-2">d) Ödeme Çerezleri (Üçüncü Taraf)</h3>
            <p className="text-sm">
              Premium abonelik satın alma sürecinde ödeme altyapı sağlayıcımız
              <strong> iyzico </strong>tarafından yerleştirilen çerezlerdir. Söz konusu çerezlerin
              içeriği, amaçları ve saklama süreleri iyzico'nun kendi gizlilik ve çerez
              politikalarına tabidir.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-3">4. Saklama Süreleri</h2>
        <p>Çerezler, türlerine göre farklı sürelerle saklanır:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1.5 text-sm">
          <li><strong>Oturum çerezleri:</strong> Tarayıcı kapatıldığında otomatik olarak silinir.</li>
          <li><strong>Kalıcı çerezler:</strong> Azami 12 ay süreyle saklanır; ardından otomatik olarak silinir.</li>
          <li><strong>İşlevsel localStorage kayıtları:</strong> Kullanıcı manuel olarak temizleyene kadar tarayıcıda kalır.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-3">5. Çerez Yönetimi</h2>
        <p>
          Kullanıcılar; tarayıcı ayarlarından çerezleri silme, engelleme veya belirli sitelere
          özel izin verme seçeneklerini kullanabilir. Ancak zorunlu çerezlerin devre dışı
          bırakılması hâlinde Platform'un tüm işlevlerinden yararlanılamayabileceği önemle
          hatırlatılır.
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
          <li><strong>Google Chrome:</strong> Ayarlar → Gizlilik ve güvenlik → Çerezler ve diğer site verileri</li>
          <li><strong>Mozilla Firefox:</strong> Seçenekler → Gizlilik ve Güvenlik → Çerezler ve Site Verileri</li>
          <li><strong>Apple Safari:</strong> Tercihler → Gizlilik → Çerezler ve web sitesi verileri</li>
          <li><strong>Microsoft Edge:</strong> Ayarlar → Çerezler ve site izinleri</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-3">6. Üçüncü Taraf Çerezleri</h2>
        <p>
          Platform üzerinden yönlendirilebilecek ödeme sayfalarında, iyzico tarafından
          çerez yerleştirilmektedir. Kullanıcı; ödeme işlemine başlamakla söz konusu üçüncü
          tarafın politikalarını kabul etmiş sayılır. VizeAkıl; üçüncü tarafların çerez
          politikalarındaki değişikliklerden sorumlu değildir.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-3">7. Politika Değişiklikleri</h2>
        <p>
          İşbu Çerez Politikası güncellenebilir. Güncel metin her zaman bu sayfada yayımlanır;
          kullanıcıların önemli değişiklikler hakkında makul bir süre önceden bilgilendirilmesi
          esas alınır.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-3">8. İlgili Politikalar ve İletişim</h2>
        <p>
          Kişisel verilerinize ilişkin kapsamlı bilgi için{' '}
          <Link to="/kvkk" className="text-brand-600 hover:underline font-medium">KVKK Aydınlatma Metni</Link>
          {' '}ve{' '}
          <Link to="/gizlilik-politikasi" className="text-brand-600 hover:underline font-medium">Gizlilik Politikası</Link>
          {' '}sayfalarını inceleyebilirsiniz.
        </p>
        <p className="mt-3">
          Her türlü soru için:{' '}
          <a href="mailto:destek@vizeakil.com" className="text-brand-600 hover:underline font-medium">
            destek@vizeakil.com
          </a>
        </p>
      </section>
    </main>
  </div>
);

export default CerezPolitikasi;
