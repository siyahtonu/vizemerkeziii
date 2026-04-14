import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

const KullanimKosullari: React.FC = () => (
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
        <h1 className="text-3xl font-black text-slate-900 mb-2">Kullanım Koşulları</h1>
        <p className="text-sm text-slate-400">Son güncelleme: Nisan 2026</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">1. Genel Hükümler</h2>
        <p>
          VizeAkıl platformuna ("<strong>Platform</strong>") erişim sağlayarak ve/veya hizmetlerimizden yararlanarak
          işbu Kullanım Koşulları'nı ("<strong>Koşullar</strong>") kabul etmiş sayılırsınız.
          Koşulları kabul etmiyorsanız Platformu kullanmamanızı tavsiye ederiz.
        </p>
        <p>
          Platform, yalnızca bilgilendirme ve rehberlik amacıyla sunulmaktadır. Resmi bir vize danışmanlık
          bürosu değildir; konsolosluk veya göçmenlik makamlarını temsil etmemektedir.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">2. Hizmetin Kapsamı</h2>
        <p>VizeAkıl aşağıdaki hizmetleri sunmaktadır:</p>
        <ul className="list-disc list-inside space-y-2 text-slate-600">
          <li>İstatistiksel verilere dayalı vize başarı skoru tahmini</li>
          <li>Gerekli belge listeleri ve evrak rehberleri</li>
          <li>Banka dökümü, sosyal medya ve ret mektubu analizi</li>
          <li>Niyet mektubu şablonları ve içerik önerileri</li>
          <li>Randevu takip bildirimleri</li>
        </ul>
        <p>
          Sunulan analizler ve skor tahminleri, geçmiş istatistiksel verilere dayalıdır.
          Konsolosluğun nihai kararını garanti etmez.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">3. Kullanıcı Yükümlülükleri</h2>
        <p>Platform kullanıcıları aşağıdaki kurallara uymayı kabul eder:</p>
        <ul className="list-disc list-inside space-y-2 text-slate-600">
          <li>Platforma yanlış, yanıltıcı veya sahte bilgi girmemek</li>
          <li>Platformu hukuka aykırı amaçlarla kullanmamak</li>
          <li>Üçüncü kişilerin hesaplarına yetkisiz erişim sağlamamak</li>
          <li>Platforma zarar verecek teknik müdahalelerde bulunmamak</li>
          <li>Telif hakkı ve fikri mülkiyet haklarına riayet etmek</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">4. Sorumluluk Sınırlaması</h2>
        <p>
          VizeAkıl, sunduğu analizler sonucunda alınan vize kararlarından sorumlu tutulamaz.
          Platform, yalnızca rehberlik ve bilgilendirme hizmeti verir. Kullanıcılar, başvuru
          beyanlarından ve sonuçlarından bizzat sorumludur.
        </p>
        <p>
          Platform üzerindeki bilgilerin güncelliği, doğruluğu ve tamlığı konusunda azami özen
          gösterilmekte; ancak konsolosluk politikalarındaki ani değişiklikler nedeniyle mutlak
          doğruluk garanti edilmemektedir.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">5. Fikri Mülkiyet</h2>
        <p>
          Platform üzerindeki tüm içerik, yazılım, tasarım ve algoritmalar VizeAkıl'a aittir.
          İzinsiz çoğaltılamaz, dağıtılamaz veya ticari amaçla kullanılamaz.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">6. Değişiklikler</h2>
        <p>
          VizeAkıl, işbu Koşulları önceden haber vermeksizin değiştirme hakkını saklı tutar.
          Güncel Koşullar her zaman bu sayfada yayımlanır. Platformu kullanmaya devam etmeniz,
          değişiklikleri kabul ettiğiniz anlamına gelir.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">7. Uygulanacak Hukuk</h2>
        <p>
          İşbu Koşullar Türk Hukuku'na tabidir. Uyuşmazlıklarda İstanbul Mahkemeleri ve
          İcra Daireleri yetkilidir.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">8. İletişim</h2>
        <p>
          Kullanım koşullarına ilişkin sorularınız için:{' '}
          <a href="mailto:destek@vizeakil.com" className="text-brand-600 hover:underline font-medium">
            destek@vizeakil.com
          </a>
        </p>
      </section>
    </main>
  </div>
);

export default KullanimKosullari;
