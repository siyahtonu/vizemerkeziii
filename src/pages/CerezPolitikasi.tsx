import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

const CerezPolitikasi: React.FC = () => (
  <div className="min-h-screen bg-slate-50">
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

    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8 text-slate-700">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Çerez Politikası</h1>
        <p className="text-sm text-slate-400">Son güncelleme: Nisan 2026</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">1. Çerez Nedir?</h2>
        <p>
          Çerezler (cookie), web sitelerinin tarayıcınıza yerleştirdiği küçük metin dosyalarıdır.
          Tercihlerinizi hatırlamak, oturum bilgilerini yönetmek ve site performansını ölçmek
          amacıyla kullanılırlar.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">2. Kullandığımız Çerez Türleri</h2>

        <div className="space-y-4">
          <div className="bg-white border border-slate-100 rounded-2xl p-5">
            <h3 className="font-bold text-slate-900 mb-2">Zorunlu Çerezler</h3>
            <p className="text-sm text-slate-600">
              Sitenin temel işlevleri için gereklidir. Oturum yönetimi ve güvenlik kontrollerini
              sağlar. Bu çerezler devre dışı bırakılamaz.
            </p>
            <div className="mt-3 text-xs text-slate-400 space-y-1">
              <p>• <code className="bg-slate-50 px-1 rounded">vizeakil_session</code> — Oturum yönetimi</p>
              <p>• <code className="bg-slate-50 px-1 rounded">vizeakil_custom_cursor</code> — Cursor tercihi (localStorage)</p>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-5">
            <h3 className="font-bold text-slate-900 mb-2">İşlevsel Çerezler</h3>
            <p className="text-sm text-slate-600">
              Kullanıcı tercihlerini ve uygulama durumunu hatırlamak için kullanılır.
              Örneğin topluluk deneyimleri ve taslak başvuru bilgileri localStorage'de saklanır.
            </p>
            <div className="mt-3 text-xs text-slate-400 space-y-1">
              <p>• <code className="bg-slate-50 px-1 rounded">vizeakil_community_v1</code> — Topluluk girdileri</p>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-5">
            <h3 className="font-bold text-slate-900 mb-2">Analitik Çerezler</h3>
            <p className="text-sm text-slate-600">
              Sitenin nasıl kullanıldığını anlamamıza yardımcı olur. Toplanan veriler
              anonimleştirilir ve kişisel bilgi içermez.
            </p>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-5">
            <h3 className="font-bold text-slate-900 mb-2">Ödeme Çerezleri</h3>
            <p className="text-sm text-slate-600">
              Premium abonelik satın alma işlemlerinde iyzico ödeme altyapısı tarafından
              kullanılır. Bu çerezler iyzico'nun gizlilik politikasına tabidir.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">3. Çerez Yönetimi</h2>
        <p>
          Tarayıcı ayarlarınızdan çerezleri silebilir veya engelleyebilirsiniz. Ancak zorunlu
          çerezlerin devre dışı bırakılması sitenin düzgün çalışmamasına neden olabilir.
        </p>
        <p>Popüler tarayıcılar için çerez yönetim bağlantıları:</p>
        <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
          <li>Google Chrome: Ayarlar → Gizlilik ve güvenlik → Çerezler</li>
          <li>Mozilla Firefox: Seçenekler → Gizlilik ve Güvenlik</li>
          <li>Safari: Tercihler → Gizlilik</li>
          <li>Microsoft Edge: Ayarlar → Çerezler ve site izinleri</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">4. Üçüncü Taraf Çerezleri</h2>
        <p>
          VizeAkıl, iyzico ödeme altyapısını kullanmaktadır. Ödeme sayfasında iyzico'ya ait
          çerezler yerleştirilebilir. Bu çerezler iyzico'nun kendi politikasına tabidir.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">5. İletişim</h2>
        <p>
          Çerez politikamıza ilişkin sorularınız için:{' '}
          <a href="mailto:destek@vizeakil.com" className="text-brand-600 hover:underline font-medium">
            destek@vizeakil.com
          </a>
        </p>
        <p>
          Kişisel verilerinizin işlenmesi hakkında daha fazla bilgi için{' '}
          <Link to="/kvkk" className="text-brand-600 hover:underline font-medium">KVKK Aydınlatma Metni</Link>'ni
          ve{' '}
          <Link to="/gizlilik-politikasi" className="text-brand-600 hover:underline font-medium">Gizlilik Politikası</Link>'nı
          inceleyebilirsiniz.
        </p>
      </section>
    </main>
  </div>
);

export default CerezPolitikasi;
