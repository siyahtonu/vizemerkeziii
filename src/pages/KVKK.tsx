import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, AlertTriangle } from 'lucide-react';
import { SEO } from '../components/SEO';

// ────────────────────────────────────────────────────────────────────────────
// DİKKAT — OPERASYON EKİBİNE NOT:
// Aşağıdaki alanlar gerçek veri sorumlusu bilgileriyle doldurulmadan sayfa
// yayına çıkmamalıdır. KVKK Madde 10 ve Aydınlatma Yükümlülüğü Tebliği
// uyarınca bu alanların placeholder ile kalması uyumsuzluktur.
//
//  1. [Şirket Unvanı A.Ş.]   → gerçek ticari unvan
//  2. [MERSİS Numarası]      → MERSİS 16 haneli numara
//  3. [Vergi Dairesi / No]   → bağlı olunan vergi dairesi ve no
//  4. [Kayıtlı Adres]        → ticaret siciline kayıtlı adres
//  5. [KEP Adresi]           → kayıtlı elektronik posta
//
// Sayfanın üstünde (yalnız geliştirme ortamında görünür) bir uyarı bandı
// mevcut; gerçek bilgileri girip bu yorum bloğunu ve <DraftBanner>'ı
// kaldırdığınızda sayfa yayına hazır sayılır.
// ────────────────────────────────────────────────────────────────────────────
const IS_DEV = import.meta.env.DEV;

const DraftBanner: React.FC = () => (
  <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-4 flex gap-3 items-start">
    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
    <div className="text-sm text-amber-900">
      <strong className="block mb-1">TASLAK — yayına çıkmadan önce doldurulmalı</strong>
      Veri sorumlusu kimliği (Ticari unvan, MERSİS, Vergi No, Kayıtlı Adres, KEP) alanları
      placeholder durumunda. KVKK Aydınlatma Yükümlülüğü Tebliği uyarınca bu bilgiler yayına
      çıkmadan gerçek değerleriyle değiştirilmelidir. Bu uyarı yalnızca geliştirme ortamında görünür.
    </div>
  </div>
);

const KVKK: React.FC = () => (
  <div className="min-h-screen bg-slate-50">
    <SEO
      title="KVKK Aydınlatma Metni | VizeAkıl"
      description="6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında VizeAkıl'ın veri sorumlusu olarak gerçekleştirdiği kişisel veri işleme faaliyetleri hakkında aydınlatma metni."
      canonical="/kvkk"
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
      {IS_DEV && <DraftBanner />}
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Kişisel Verilerin Korunması Hakkında Aydınlatma Metni</h1>
      <p className="text-slate-500 text-sm mb-2">Yürürlük tarihi: 19 Nisan 2026</p>
      <p className="text-slate-500 text-sm mb-8">Versiyon: 2.0</p>

      <div className="space-y-8 text-slate-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">1. Veri Sorumlusunun Kimliği</h2>
          <p>
            İşbu Aydınlatma Metni; 6698 sayılı Kişisel Verilerin Korunması Kanunu
            ("<strong>KVKK</strong>") Madde 10 ile Aydınlatma Yükümlülüğünün Yerine Getirilmesinde
            Uyulacak Usul ve Esaslar Hakkında Tebliğ uyarınca, veri sorumlusu sıfatıyla
            <strong> [Şirket Unvanı A.Ş.]</strong> ("<strong>Şirket</strong>" veya "<strong>VizeAkıl</strong>")
            tarafından hazırlanmıştır.
          </p>
          <div className="mt-3 text-sm bg-slate-100 p-3 rounded">
            <p><strong>Ticari Unvan:</strong> [Şirket Unvanı A.Ş.]</p>
            <p><strong>MERSİS No:</strong> [MERSİS Numarası]</p>
            <p><strong>Vergi Dairesi / No:</strong> [Vergi Dairesi] / [Vergi No]</p>
            <p><strong>Adres:</strong> [Kayıtlı Adres]</p>
            <p><strong>KEP Adresi:</strong> [KEP Adresi]</p>
            <p><strong>Aydınlatma Yükümlülüğü İrtibat:</strong> kvkk@vizeakil.com</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">2. İşlenen Kişisel Veri Kategorileri</h2>
          <p>Şirketimiz tarafından aşağıdaki kişisel veri kategorileri işlenmektedir:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1.5 text-sm">
            <li><strong>Kimlik Bilgisi:</strong> Ad, soyad; yalnızca kullanıcının kendisinin girmesi hâlinde.</li>
            <li><strong>İletişim Bilgisi:</strong> E-posta adresi, teslim sonuç bildirimlerinde ileti alınabilmesi için.</li>
            <li><strong>Müşteri İşlem:</strong> Vize profil değerlendirmesine ilişkin kullanıcı girdileri; meslek segmenti, gelir aralığı, seyahat geçmişi, hedef ülke, medeni hâl.</li>
            <li><strong>Finansal Bilgi:</strong> Kullanıcının manuel olarak beyan ettiği bakiye ve aylık gelir aralığı. Kullanıcı bu isteğe bağlı özellikleri kullandığında banka dökümü veya SGK hizmet dökümünden çıkarılan metin, değerlendirme amacıyla üçüncü taraf yapay zekâ sağlayıcısına (aşağıda 5. bölümde belirtilen alıcı kategorisi) iletilebilir; bu evraklar sunucularımızda kalıcı olarak saklanmaz.</li>
            <li><strong>İşlem Güvenliği:</strong> IP adresi, tarayıcı türü, oturum tanımlayıcıları; güvenlik ve dolandırıcılık önleme amacıyla.</li>
            <li><strong>Pazarlama Bilgisi:</strong> Yalnızca açık rıza verilmesi hâlinde; e-bülten tercihleri ve kampanya iletişim kayıtları.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">3. Kişisel Verilerin İşlenme Amaçları</h2>
          <p>Kişisel verileriniz KVKK Madde 4'te yer alan genel ilkeler çerçevesinde ve aşağıdaki amaçlar doğrultusunda işlenir:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1.5 text-sm">
            <li>Vize profil değerlendirme hizmetinin ifası ve kişiselleştirilmiş skor, öneri ve evrak listelerinin üretilmesi,</li>
            <li>Kullanıcı taleplerinin karşılanması, destek süreçlerinin yürütülmesi ve iletişim faaliyetlerinin gerçekleştirilmesi,</li>
            <li>Hizmet kalitesinin, ürün geliştirme süreçlerinin ve algoritma kalibrasyonunun yürütülmesi (anonimleştirilmiş veri setleri üzerinden),</li>
            <li>Sözleşmesel ve yasal yükümlülüklerimizin yerine getirilmesi; saklama ve raporlama mevzuatına uyum,</li>
            <li>Bilgi güvenliğinin sağlanması, sistem kötüye kullanımının önlenmesi, hukuki uyuşmazlıkların çözümü,</li>
            <li>Açık rıza verilmiş olması hâlinde pazarlama, tanıtım ve kampanya iletişimi.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">4. Kişisel Veri İşlemenin Hukuki Sebepleri</h2>
          <p>Kişisel verileriniz, KVKK Madde 5 uyarınca aşağıdaki hukuki sebeplere dayanılarak işlenmektedir:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1.5 text-sm">
            <li>Bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması (Kullanım Koşulları uyarınca hizmetin sunumu),</li>
            <li>Şirketimizin hukuki yükümlülüklerini yerine getirebilmesi için zorunlu olması,</li>
            <li>Temel hak ve özgürlüklerinize zarar vermemek kaydıyla, veri sorumlusunun meşru menfaatleri için işlemenin zorunlu olması,</li>
            <li>Pazarlama faaliyetleri bakımından açık rızanızın bulunması.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">5. Kişisel Verilerin Aktarılması</h2>
          <p>
            Kişisel verileriniz; yalnızca işleme amaçlarıyla sınırlı olarak, gerekli teknik
            ve idari güvenlik tedbirleri alınmak suretiyle aşağıda belirtilen alıcı gruplarına
            aktarılabilmektedir:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1.5 text-sm">
            <li><strong>Hizmet altyapısı sağlayıcıları:</strong> Barındırma (hosting), e-posta gönderim, hata izleme ve yedekleme hizmeti veren iş ortakları. Yurt dışı aktarım yalnızca KVKK Madde 9 kapsamında güvenceli ülkelere veya yeterli korumayı sağlayan taahhütname imzalanmış firmalara yönelik gerçekleştirilir.</li>
            <li><strong>Yapay zekâ değerlendirme hizmeti sağlayıcısı:</strong> Kişiselleştirilmiş skor açıklaması, ret sebebi analizi, banka/SGK döküm yorumlaması ve kapak mektubu üretimi için DeepSeek (Hangzhou DeepSeek Artificial Intelligence Co., Ltd. — Çin Halk Cumhuriyeti) hizmetlerinden faydalanılmaktadır. Bu amaçla, yalnızca ilgili istek için gerekli olan metin ve profil alanları DeepSeek API'sine iletilmektedir. DeepSeek'in kamuya açık API kullanım şartları uyarınca API üzerinden iletilen veriler hizmet sunumu amaçlı işlenir. Bu aktarım, KVKK Madde 9 kapsamında <strong>yurt dışına kişisel veri aktarımı</strong> niteliğindedir ve <strong>açık rızanız</strong> alınarak gerçekleştirilir; rızanızı çekmeniz hâlinde yapay zekâ destekli analizler kullanılamaz hâle gelir. Çin Halk Cumhuriyeti, KVK Kurulu tarafından yeterli korumaya sahip ülkeler listesine alınmış değildir; bu nedenle aktarım, açık rıza dışında bir hukuki sebebe dayanmamaktadır.</li>
            <li><strong>Ödeme altyapısı:</strong> Premium özellikler için tercih edilen ödeme kuruluşu (iyzico) nezdinde zorunlu işlem verileri.</li>
            <li><strong>Yasal merciler:</strong> Kanunen yetkili kamu kurum ve kuruluşlarının taleplerine yönelik, mevzuatın öngördüğü çerçevede.</li>
          </ul>
          <p className="mt-3">Kişisel verileriniz; pazarlama amacıyla üçüncü taraflara <strong>satılmaz</strong> ve ticari kazanç elde etmek amacıyla paylaşılmaz.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">6. Kişisel Verilerin Toplanma Yöntemleri</h2>
          <p>
            Kişisel verileriniz; platform üzerinden doldurduğunuz formlar, iletişim kanalları,
            kullanıcı arayüzü ile elektronik ortamda toplanmaktadır. Üçüncü taraf kaynaklardan
            aktarılan veri toplanmaz.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">7. Saklama Süreleri</h2>
          <p>
            Kişisel veriler, işleme amacının gerektirdiği süre boyunca ve ilgili mevzuatın
            öngördüğü azami sürelerle saklanır:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1.5 text-sm">
            <li>Hesap ve profil verileri: Hizmet ilişkisi süresince ve hesabın silinmesinden sonra en fazla 30 gün.</li>
            <li>Ticari iletişim, fatura ve ödeme kayıtları: İlgili vergi ve ticaret mevzuatı uyarınca 10 yıl.</li>
            <li>Log ve güvenlik kayıtları: 5651 sayılı Kanun kapsamında en az 6 ay, en fazla 2 yıl.</li>
            <li>Pazarlama amacıyla işlenen veriler: Açık rızanın geri alınmasına kadar.</li>
          </ul>
          <p className="mt-3">Saklama süresinin dolmasını müteakip veriler, Kişisel Verileri Saklama ve İmha Politikamız uyarınca silinir, yok edilir veya anonim hâle getirilir.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">8. İlgili Kişinin Hakları (KVKK Madde 11)</h2>
          <p>Kişisel verisi işlenen gerçek kişi olarak Kanun'un 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1.5 text-sm">
            <li>Kişisel verinizin işlenip işlenmediğini öğrenme,</li>
            <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
            <li>İşlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
            <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri öğrenme,</li>
            <li>Eksik veya yanlış işlenmiş olması hâlinde düzeltilmesini isteme,</li>
            <li>Kanun'un 7. maddesi çerçevesinde silinmesini, yok edilmesini veya anonim hâle getirilmesini talep etme,</li>
            <li>Düzeltme, silme veya yok etme işlemlerinin verinin aktarıldığı üçüncü kişilere bildirilmesini isteme,</li>
            <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhe bir sonuç ortaya çıkmasına itiraz etme,</li>
            <li>Kanuna aykırı işleme sebebiyle zarara uğraması hâlinde zararın giderilmesini talep etme.</li>
          </ul>
          <p className="mt-3">
            Haklarınızı kullanmak için yazılı olarak Şirket adresine veya <strong>kvkk@vizeakil.com </strong>
            adresine iletebileceğiniz başvurunuz, Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında
            Tebliğ'de öngörülen usule uygun olarak düzenlenmelidir. Başvurularınız en geç 30 gün
            içinde sonuçlandırılır.
          </p>

          {/* Hızlı işlem kartları — yerel veri silme + e-posta talebi */}
          <div className="mt-5 grid sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                if (!window.confirm('Tarayıcınızdaki yerel profil verileri ve tüm tercihler silinsin mi? Bu işlem geri alınamaz.')) return;
                try {
                  // Skorlama profili, mülakat ilerlemesi, AI rıza vs. tüm uygulama state'i
                  const keys = [
                    'vizeakil_profile_v1',
                    'vizeakil_applicant_type',
                    'vizeakil_used_tools',
                    'vizeakil_completed_tools',
                    'vizeakil_custom_cursor',
                    'vizeakil_community_v1',
                    'vizeakil_ai_kvkk_consent_v1',
                  ];
                  for (const k of keys) localStorage.removeItem(k);
                  alert('Yerel verileriniz silindi. Sayfa yenileniyor.');
                  window.location.href = '/';
                } catch {
                  alert('Silme sırasında bir hata oluştu. Tarayıcı verilerinizi manuel temizleyebilirsiniz.');
                }
              }}
              className="text-left p-4 bg-white border border-slate-200 hover:border-rose-300 hover:bg-rose-50/30 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
            >
              <div className="text-sm font-bold text-slate-900 mb-1">🗑️ Yerel Verilerimi Sil</div>
              <div className="text-xs text-slate-500 leading-relaxed">
                Tarayıcı belleğindeki profil bilgileri, AI rızası ve tercihleri tek tıkla siler.
                Sunucudaki kayıtlar (varsa) için aşağıdaki e-posta talebi gerekir.
              </div>
            </button>

            <a
              href="mailto:kvkk@vizeakil.com?subject=KVKK%20Madde%2011%20-%20Veri%20Silme%20Talebi&body=KVKK%20Madde%2011%20kapsam%C4%B1nda%20taraf%C4%B1ma%20ait%20ki%C5%9Fisel%20verilerin%20silinmesini%2C%20yok%20edilmesini%20veya%20anonim%20h%C3%A2le%20getirilmesini%20talep%20ediyorum.%0A%0AAd%2C%20Soyad%3A%20%5B...%5D%0AKay%C4%B1tl%C4%B1%20E-posta%3A%20%5B...%5D%0ATalep%3A%20%5BSilme%20%2F%20Anonimle%C5%9Ftirme%20%2F%20D%C3%BCzeltme%5D%0A%0ATe%C5%9Fekk%C3%BCrler."
              className="block text-left p-4 bg-white border border-slate-200 hover:border-brand-300 hover:bg-brand-50/30 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
            >
              <div className="text-sm font-bold text-slate-900 mb-1">✉️ Sunucu Verisi Silme Talebi</div>
              <div className="text-xs text-slate-500 leading-relaxed">
                E-posta hazır şablonla açılır. Talebiniz <strong>30 gün</strong> içinde sonuçlandırılır.
                Bilgilerinizi doldurup gönderin.
              </div>
            </a>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">9. Değişiklikler</h2>
          <p>
            İşbu Aydınlatma Metni, mevzuat değişiklikleri veya Şirket süreçlerindeki güncellemeler
            doğrultusunda revize edilebilir. Güncel metin her zaman bu sayfada yayımlanır; önemli
            değişiklikler ayrıca kayıtlı e-posta adresinize bildirilir.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">10. İletişim</h2>
          <p>
            KVKK kapsamında her türlü soru, talep ve başvurunuzu aşağıdaki kanallardan iletebilirsiniz:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
            <li>E-posta: <strong>kvkk@vizeakil.com</strong></li>
            <li>Posta: [Kayıtlı Adres]</li>
            <li>KEP: [KEP Adresi]</li>
          </ul>
        </section>
      </div>
    </main>
  </div>
);

export default KVKK;
