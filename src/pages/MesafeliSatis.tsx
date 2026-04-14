import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

const MesafeliSatis: React.FC = () => (
  <div className="min-h-screen bg-slate-50">
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 py-4">
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2 text-brand-600 font-bold hover:opacity-80 transition-opacity">
          <ArrowLeft className="w-5 h-5" /> Ana Sayfa
        </Link>
        <div className="h-4 w-px bg-slate-300" />
        <div className="flex items-center gap-2 text-slate-700 font-display font-black text-lg">
          <ShieldCheck className="w-5 h-5 text-brand-600" /> VizeAkıl
        </div>
      </div>
    </nav>

    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8 text-slate-700">
      <div>
        <h1 className="text-3xl font-black text-slate-900 mb-2">Mesafeli Satış Sözleşmesi</h1>
        <p className="text-sm text-slate-400">Son güncelleme: Nisan 2026</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">1. Taraflar</h2>
        <p>
          İşbu Mesafeli Satış Sözleşmesi ("<strong>Sözleşme</strong>"), aşağıdaki taraflar arasında
          akdedilmiştir:
        </p>
        <div className="bg-white border border-slate-100 rounded-2xl p-6 space-y-2 text-sm">
          <p><strong>SATICI:</strong> [Şirket Adı A.Ş.]</p>
          <p><strong>Adres:</strong> [Şirket Adresi, İl, Türkiye]</p>
          <p><strong>Vergi No:</strong> [Vergi Dairesi – Vergi Numarası]</p>
          <p><strong>E-posta:</strong> destek@vizeakil.com</p>
          <p><strong>Web sitesi:</strong> vizeakil.com</p>
        </div>
        <p>
          <strong>ALICI:</strong> Ödeme işlemi sırasında iletişim bilgilerini paylaşan ve
          satın alma işlemini tamamlayan kullanıcı.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">2. Sözleşmenin Konusu</h2>
        <p>
          Bu Sözleşme, VizeAkıl platformu üzerinden sunulan dijital abonelik hizmetlerinin
          (Premium paketler) mesafeli olarak satışına ilişkin tarafların hak ve yükümlülüklerini
          düzenlemektedir. 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler
          Yönetmeliği hükümlerine tabidir.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">3. Hizmet ve Fiyatlar</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100">
              <tr>
                <th className="text-left p-3 font-bold text-slate-700">Paket</th>
                <th className="text-left p-3 font-bold text-slate-700">Süre</th>
                <th className="text-left p-3 font-bold text-slate-700">Fiyat (KDV Dahil)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              <tr>
                <td className="p-3">VizeAkıl Tek Başvuru</td>
                <td className="p-3">90 gün</td>
                <td className="p-3 font-bold">₺499,00</td>
              </tr>
              <tr>
                <td className="p-3">VizeAkıl Yıllık Pro</td>
                <td className="p-3">365 gün</td>
                <td className="p-3 font-bold">₺999,00</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-slate-500">
          Fiyatlara KDV dahildir. Ödeme iyzico altyapısı üzerinden 3D Secure ile güvenli biçimde gerçekleştirilir.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">4. Ödeme Koşulları</h2>
        <p>
          Ödeme, sipariş tamamlandığında tek seferlik olarak alınır. Otomatik yenileme uygulanmaz.
          Ödeme başarısız olursa hizmet aktive edilmez; kullanıcı tekrar ödeme yapabilir.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">5. Hizmetin İfası ve Teslim</h2>
        <p>
          Ödemenin onaylanmasının ardından, kullanıcının kayıtlı e-posta adresine premium erişim
          bilgileri iletilir ve hizmet derhal aktive edilir. Dijital hizmet niteliğinde olduğundan
          fiziksel teslimat söz konusu değildir.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">6. Cayma Hakkı</h2>
        <p>
          6502 sayılı Kanun'un 49. maddesi uyarınca, kullanıcının onayıyla ödeme anında ifasına
          başlanan dijital içerik ve hizmetlerde cayma hakkı kullanılamaz. Satın alma işlemini
          tamamlamanız, hizmetin anında aktive edileceğini ve cayma hakkından feragat ettiğinizi
          kabul ettiğiniz anlamına gelir.
        </p>
        <p>
          Bununla birlikte, teknik hata veya çift ödeme gibi hallerde{' '}
          <a href="mailto:destek@vizeakil.com" className="text-brand-600 hover:underline font-medium">
            destek@vizeakil.com
          </a>{' '}
          adresine başvurabilirsiniz. Talepler 3 iş günü içinde değerlendirilir.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">7. Gizlilik</h2>
        <p>
          Ödeme sürecinde toplanan kişisel veriler{' '}
          <Link to="/kvkk" className="text-brand-600 hover:underline font-medium">KVKK Aydınlatma Metni</Link> ve{' '}
          <Link to="/gizlilik-politikasi" className="text-brand-600 hover:underline font-medium">Gizlilik Politikası</Link>{' '}
          kapsamında işlenir.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">8. Uyuşmazlık Çözümü</h2>
        <p>
          Şikâyetlerinizi öncelikle{' '}
          <a href="mailto:destek@vizeakil.com" className="text-brand-600 hover:underline font-medium">
            destek@vizeakil.com
          </a>{' '}
          adresine iletebilirsiniz. Çözüme kavuşturulamazsa T.C. Ticaret Bakanlığı'na bağlı
          Tüketici Hakem Heyeti veya Tüketici Mahkemelerine başvurabilirsiniz.
        </p>
      </section>
    </main>
  </div>
);

export default MesafeliSatis;
