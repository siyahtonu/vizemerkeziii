import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

const Gizlilik: React.FC = () => (
  <div className="min-h-screen bg-slate-50">
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
      <p className="text-slate-500 text-sm mb-8">Son güncelleme: 14 Nisan 2026</p>

      <div className="space-y-8 text-slate-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-slate-900">Topladığımız Veriler</h2>
          <p>VizeAkıl, yalnızca hizmeti sunmak için gerekli minimum veriyi toplar:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
            <li>Vize profil bilgileri (istihdam, finansal durum, seyahat geçmişi)</li>
            <li>E-posta adresi (kayıt sırasında, isteğe bağlı)</li>
            <li>Teknik log verileri (hata takibi için, 30 gün saklanır)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900">Çerezler</h2>
          <p className="text-sm">Oturum yönetimi ve analitik için çerez kullanılır. Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz. Üçüncü taraf reklam çerezi kullanılmaz.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900">Veri Paylaşımı</h2>
          <p className="text-sm">Kişisel verileriniz yasal zorunluluk olmadıkça üçüncü taraflarla paylaşılmaz. Hizmet altyapısı sağlayıcılarımız (hosting, e-posta) GDPR/KVKK uyumlu sözleşmelerle bağlıdır.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900">Güvenlik</h2>
          <p className="text-sm">Tüm iletişim TLS şifreli (HTTPS) bağlantı üzerinden yapılır. API anahtarları sunucu tarafında şifreli ortam değişkeni olarak saklanır; client'a gönderilmez.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900">İletişim</h2>
          <p className="text-sm">Gizlilik konularında: <strong>gizlilik@vizeakil.com</strong></p>
        </section>
      </div>
    </main>
  </div>
);

export default Gizlilik;
