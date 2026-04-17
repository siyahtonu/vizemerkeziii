import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

const KVKK: React.FC = () => (
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

    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 prose prose-slate max-w-none">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">KVKK Aydınlatma Metni</h1>
      <p className="text-slate-500 text-sm mb-8">Son güncelleme: 14 Nisan 2026</p>

      <div className="space-y-8 text-slate-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-slate-900">1. Veri Sorumlusu</h2>
          <p>
            6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında veri sorumlusu sıfatıyla
            <strong> [Şirket Adı A.Ş.]</strong> ([Vergi No], [MERSİS No], [Adres]) hareket etmektedir.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900">2. İşlenen Kişisel Veriler</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Kimlik verileri:</strong> Ad, soyad (yalnızca kullanıcı giymesi halinde)</li>
            <li><strong>İletişim verileri:</strong> E-posta adresi</li>
            <li><strong>Kullanım verileri:</strong> Vize profil bilgileri, istihdam durumu, seyahat geçmişi</li>
            <li><strong>Teknik veriler:</strong> IP adresi, tarayıcı türü, oturum bilgileri</li>
            <li><strong>Finansal veriler:</strong> Kullanıcının girdiği banka bakiyesi ve gelir bilgisi (ham banka dökümü sunucuya yüklenmez)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900">3. Kişisel Verilerin İşlenme Amaçları</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Vize başvuru analizi ve kişiselleştirilmiş evrak listesi oluşturulması</li>
            <li>Hizmet kalitesinin iyileştirilmesi ve teknik destek sağlanması</li>
            <li>Yasal yükümlülüklerin yerine getirilmesi</li>
            <li>İzin verilmesi halinde pazarlama iletişimi</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900">4. Hukuki Dayanak</h2>
          <p>Kişisel verileriniz; KVKK Madde 5 uyarınca sözleşmenin ifası, meşru menfaat ve açık rıza hukuki gerekçeleriyle işlenmektedir.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900">5. Veri Saklama Süresi</h2>
          <p>Veriler, hizmet ilişkisi devam ettiği sürece ve ilgili yasal süreler boyunca saklanır. Hesap silinmesi halinde 30 gün içinde imha edilir.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900">6. İlgili Kişi Hakları (KVKK Madde 11)</h2>
          <p>Kişisel verilerinize ilişkin haklarınızı kullanmak için <strong>destek@vizeakil.com</strong> adresine başvurabilirsiniz:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Verilerinizin işlenip işlenmediğini öğrenme</li>
            <li>İşlenen veriler hakkında bilgi talep etme</li>
            <li>Verilerin düzeltilmesini veya silinmesini isteme</li>
            <li>İşlemeye itiraz etme hakkı</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900">7. İletişim</h2>
          <p>KVKK kapsamındaki talepleriniz için: <strong>kvkk@vizeakil.com</strong></p>
        </section>
      </div>
    </main>
  </div>
);

export default KVKK;
