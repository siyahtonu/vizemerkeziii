import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { SEO } from '../components/SEO';

const KullanimKosullari: React.FC = () => (
  <div className="min-h-screen bg-slate-50">
    <SEO
      title="Kullanım Koşulları | VizeAkıl"
      description="VizeAkıl platformunun kullanım koşulları, kullanıcı yükümlülükleri, sorumluluk sınırları ve hizmete ilişkin sözleşmesel esaslar."
      canonical="/kullanim-kosullari"
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
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Kullanım Koşulları</h1>
        <p className="text-slate-500 text-sm">Yürürlük tarihi: 19 Nisan 2026 · Versiyon: 2.0</p>
      </div>

      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-3">1. Taraflar ve Tanımlar</h2>
        <p>
          İşbu Kullanım Koşulları ("<strong>Koşullar</strong>"), bir tarafta <strong>[Şirket Unvanı A.Ş.]</strong>
          ("<strong>Şirket</strong>" veya "<strong>VizeAkıl</strong>") ile diğer tarafta platformun hizmetlerinden
          yararlanan gerçek veya tüzel kişi ("<strong>Kullanıcı</strong>") arasında; kullanıcının vizeakil.com
          ve ilgili alt alan adları üzerinden sunulan dijital hizmetlere ("<strong>Platform</strong>" veya
          "<strong>Hizmet</strong>") erişim şartlarını düzenler. Platforma erişim sağlanması işbu Koşulların
          zımnen kabulünü ifade eder.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-3">2. Hizmetin Niteliği</h2>
        <p>
          VizeAkıl; Türk vatandaşlarının Schengen, Birleşik Krallık, Amerika Birleşik Devletleri
          ve diğer ülkelere yönelik vize başvurularına ilişkin profil değerlendirmesi, belge
          hazırlığı, niyet mektubu taslağı ve bilgilendirme hizmetleri sunan bir dijital platformdur.
        </p>
        <p className="mt-3">
          Platform; <strong>göçmenlik veya vize danışmanlığı hizmeti değildir</strong>. 5718 sayılı
          Milletlerarası Özel Hukuk Kanunu ve diğer mevzuat uyarınca münhasıran avukat veya yetkili
          danışman tarafından verilebilecek hukuki görüşü ikame etmez. Kullanıcı, başvuruya ilişkin
          nihai hukuki değerlendirmeyi uzman kişilere yaptırmakla yükümlüdür.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-3">3. Kullanıcı Yükümlülükleri</h2>
        <p>Kullanıcı, Platformu kullanırken aşağıdaki yükümlülüklere uymayı kabul ve taahhüt eder:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1.5 text-sm">
          <li>Platforma yalnızca doğru, güncel ve yanıltıcı olmayan bilgi girişi yapmak,</li>
          <li>Başkasına ait kimlik, iletişim veya finansal bilgileri yetkisiz şekilde kullanmamak,</li>
          <li>Platformu; kötü niyetli yazılım yayma, yetkisiz erişim, veri kazıma (scraping), tersine mühendislik veya hizmeti engelleme amacıyla kullanmamak,</li>
          <li>Platform içeriğini; izinsiz kopyalama, çoğaltma, yeniden yayımlama veya ticari amaçla kullanma eylemlerine tabi tutmamak,</li>
          <li>Yürürlükteki Türk mevzuatı ve ilgili yabancı devlet hukuk düzenlemelerine aykırı davranışlardan kaçınmak,</li>
          <li>Premium abonelik alınması hâlinde ücret ödeme yükümlülüklerini zamanında yerine getirmek.</li>
        </ul>
        <p className="mt-3">
          Bu yükümlülüklere aykırılık hâlinde Şirket; herhangi bir tazminat yükümlülüğü doğmaksızın
          hesabı askıya alma, hizmeti sonlandırma ve hukuki yollara başvurma haklarını saklı tutar.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-3">4. Ücretlendirme ve İade</h2>
        <p>
          Platform; bir kısmı ücretsiz, bir kısmı premium aboneliğe tabi modüller sunmaktadır.
          Premium aboneliğin ücret, süresi, özellikleri ve varsa yenileme koşulları; satın alma
          ekranında Kullanıcıya açıkça bildirilir.
        </p>
        <p className="mt-3">
          6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği
          çerçevesinde Kullanıcı, dijital içerik hizmetinin ifasına başlanması için açık rıza
          verdiği ve cayma hakkını kullanamayacağını kabul ettiği hâller dışında, <strong>14 gün
          içinde cayma hakkını</strong> kullanabilir. İade koşulları; Mesafeli Satış Sözleşmesi'nde
          detaylandırılmıştır.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-3">5. Sorumluluk Sınırlaması</h2>
        <p>
          Platform; vize kararlarını garanti etmez. Skor, olasılık ve öneriler istatistiksel
          tahminlerdir. Vize başvurusunun sonucu yalnızca ilgili yabancı devletin konsolosluğunun
          münhasır takdirindedir.
        </p>
        <p className="mt-3">
          Şirket; mevzuatın emredici hükümleri saklı kalmak kaydıyla:
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1.5 text-sm">
          <li>Vize başvurusunun reddedilmesinden doğan doğrudan veya dolaylı zararlardan,</li>
          <li>Kullanıcının platforma yanlış bilgi girmesinden kaynaklanan sonuçlardan,</li>
          <li>Konsolosluk politikalarındaki ani değişikliklerden ileri gelen hatalı tahminlerden,</li>
          <li>Üçüncü taraf altyapı sağlayıcılarının hizmet kesintilerinden,</li>
        </ul>
        <p className="mt-3">
          sorumlu tutulamaz. Şirketin toplam sorumluluğu; hiçbir hâlde Kullanıcının son 12 ay
          içinde Platform'a ödediği toplam tutarı aşamaz.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-3">6. Fikri Mülkiyet Hakları</h2>
        <p>
          Platform üzerinde yer alan tüm metinler, grafikler, yazılım kodu, arayüz tasarımları,
          skorlama algoritmaları, veri setleri ve markalar; 5846 sayılı Fikir ve Sanat Eserleri
          Kanunu, 6769 sayılı Sınai Mülkiyet Kanunu ve ilgili uluslararası düzenlemeler
          çerçevesinde <strong>Şirket'in münhasır mülkiyetindedir</strong>.
        </p>
        <p className="mt-3">
          Kullanıcıya, Platformu kişisel ve ticari olmayan kullanım amacıyla sınırlı,
          münhasır olmayan, devredilemez, alt lisansa bağlanamayan ve her an geri alınabilir
          bir kullanım hakkı tanınmıştır. Bu hak; Platformun veya algoritmaların tersine
          mühendislikle çözümlenmesi, yeniden üretilmesi veya rekabet amaçlı bir hizmetin
          geliştirilmesi için kullanılmasına izin vermez.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-3">7. Hizmette Değişiklik ve Erişim Engeli</h2>
        <p>
          Şirket; Platform'da tekil modüller ekleme, mevcut modülleri değiştirme veya kaldırma;
          ücretlendirme yapısını güncelleme ve bakım sebebiyle hizmeti geçici olarak askıya alma
          hakkını saklı tutar. Esaslı değişiklikler, Kullanıcıların makul ölçüde önceden
          bilgilendirilmesi suretiyle uygulamaya konulur.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-3">8. Gizlilik ve Kişisel Veriler</h2>
        <p>
          Kullanıcıların kişisel verilerinin işlenmesine ilişkin esaslar;
          <Link to="/kvkk" className="text-brand-600 hover:underline font-medium"> KVKK Aydınlatma Metni</Link> ve
          <Link to="/gizlilik-politikasi" className="text-brand-600 hover:underline font-medium"> Gizlilik Politikası</Link>
          kapsamında düzenlenmiştir. Kullanıcı, Platformu kullanarak söz konusu metinleri
          okuduğunu ve kabul ettiğini beyan eder.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-3">9. Fesih</h2>
        <p>
          Kullanıcı; hesabını dilediği zaman kapatabilir. Şirket ise işbu Koşullara aykırılık,
          dolandırıcılık şüphesi, kötüye kullanım veya yasal zorunluluk hâllerinde Kullanıcının
          erişimini önceden bildirimsiz olarak askıya alma veya hesabı kalıcı olarak kapatma
          hakkını saklı tutar. Fesih, geçmişte doğmuş ödeme yükümlülüklerini etkilemez.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-3">10. Mücbir Sebep</h2>
        <p>
          Doğal afet, salgın, savaş, grev, siber saldırı, altyapı arızası ve benzeri, tarafların
          makul kontrolü dışında kalan hâllerde doğacak aksamalardan dolayı hiçbir tarafın
          sorumluluğu doğmaz.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-3">11. Uygulanacak Hukuk ve Yetkili Mahkeme</h2>
        <p>
          İşbu Koşullar Türkiye Cumhuriyeti hukukuna tabidir. Taraflar arasında doğacak
          uyuşmazlıkların çözümünde <strong>İstanbul (Merkez) Mahkemeleri ve İcra Daireleri</strong>
          yetkilidir. Tüketici sıfatını haiz kullanıcılar bakımından; 6502 sayılı Kanun uyarınca
          yetkili Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri de yetkili kılınmıştır.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-3">12. Bölünebilirlik ve Bütünlük</h2>
        <p>
          İşbu Koşulların herhangi bir hükmünün geçersiz, hukuka aykırı veya ifa edilemez
          bulunması; diğer hükümlerin geçerliliğini etkilemez. Koşullar; kendi içinde
          birlikte okunan tek ve bütün bir sözleşme teşkil eder.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-3">13. İletişim</h2>
        <p>
          Sorularınız ve bildirimleriniz için:{' '}
          <a href="mailto:destek@vizeakil.com" className="text-brand-600 hover:underline font-medium">
            destek@vizeakil.com
          </a>
        </p>
      </section>
    </main>
  </div>
);

export default KullanimKosullari;
