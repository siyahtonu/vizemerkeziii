import React from 'react';
import { CheckCircle2, GraduationCap, Info, AlertTriangle, BookOpen } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'ogrenciler-icin-vize-rehberi-2026',
  title: 'Öğrenci Vizesi Nasıl Alınır? Erasmus, ABD, Kanada Rehberi 2026',
  description: 'Öğrenciler için tüm vize türlerinin rehberi: Erasmus, F-1, Kanada Study Permit, İngiltere Student. Başvuru süreci, belgeler, ipuçları.',
  category: 'Genel',
  readingTime: 12,
  date: '2026-04-17',
  tags: ['öğrenci vizesi', 'F-1', 'Erasmus', 'Study Permit', 'Student Visa'],
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: POST.title,
      description: POST.description,
      author: { '@type': 'Organization', name: 'VizeAkıl', url: 'https://vizeakil.com' },
      publisher: { '@type': 'Organization', name: 'VizeAkıl', logo: { '@type': 'ImageObject', url: 'https://vizeakil.com/og-image.png' } },
      datePublished: POST.date,
      dateModified: POST.date,
      url: `https://vizeakil.com/blog/${POST.slug}`,
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'Öğrenci vizesi için dil yeterliliği şart mı?', acceptedAnswer: { '@type': 'Answer', text: 'Çoğu ülkede evet. İngilizce programlar için IELTS/TOEFL, Almanya için TestDaF/DSH, Fransa için DELF/DALF gerekir. Bazı ülkelerde (özellikle Kanada) minimum puan şartı kesindir.' } },
        { '@type': 'Question', name: 'Ebeveynim sponsor olabilir mi?', acceptedAnswer: { '@type': 'Answer', text: 'Evet. Ebeveyn sponsorluğu tüm öğrenci vize türlerinde kabul edilir. Ebeveynin finansal gücünü belgelemesi ve noter onaylı sponsor taahhüdü vermesi gerekir.' } },
        { '@type': 'Question', name: 'Burs almış bir öğrenciyim, finansal belgelere gerek var mı?', acceptedAnswer: { '@type': 'Answer', text: 'Burs belgesi tam finansmanı kapsıyorsa (eğitim + yaşam masrafı), ek finansal belge istenmeyebilir. Kısmi burslarda kalan masrafı karşılayacak finansal kanıt gerekir.' } },
        { '@type': 'Question', name: 'Öğrenci vizesi ile çalışabilir miyim?', acceptedAnswer: { '@type': 'Answer', text: 'Çoğu ülkede kısıtlı çalışma hakkı vardır (genellikle haftada 20 saat). Ancak çalışma izni için öğrenci vizesi yeterli değildir — ek iş izni gerekir. Bu kural her ülkede farklıdır.' } },
        { '@type': 'Question', name: 'Mezuniyet sonrası ülkede kalabilir miyim?', acceptedAnswer: { '@type': 'Answer', text: 'Çoğu ülkede evet: Kanada PGWP (1-3 yıl), İngiltere Graduate Route (2 yıl), Almanya iş arama vizesi (18 ay), ABD OPT (12-36 ay).' } },
        { '@type': 'Question', name: 'Öğrenci vizesi red alabilir mi?', acceptedAnswer: { '@type': 'Answer', text: 'Evet. En yaygın red sebepleri: yetersiz finansal kanıt, zayıf akademik profil, şüpheli dönüş niyeti, eksik belgeler. İlk red sonrası doğru strateji ile yeniden başvuru başarılı olabilir.' } },
      ],
    },
  ],
};

const VIZE_TURLERI = [
  { ulke: 'ABD', kod: 'F-1 (akademik), M-1 (mesleki)', sure: 'Eğitim süresi boyunca', calisma: 'Kampüs içi haftada 20 saat' },
  { ulke: 'Kanada', kod: 'Study Permit', sure: 'Eğitim süresi + kalış izni', calisma: 'Kampüs dışı haftada 20 saat' },
  { ulke: 'İngiltere', kod: 'Student Visa', sure: 'Eğitim süresi + 3 ay', calisma: 'Haftada 20 saat' },
  { ulke: 'Almanya', kod: 'Ulusal Vize (D-Tipi)', sure: 'Eğitim süresi + 4 ay', calisma: 'Yılda 120 tam / 240 yarım gün' },
  { ulke: 'Hollanda', kod: 'MVV + İkamet İzni', sure: 'Eğitim süresi', calisma: 'Haftada 16 saat' },
  { ulke: 'İtalya', kod: 'Ulusal Vize', sure: 'Eğitim süresi', calisma: 'Haftada 20 saat' },
  { ulke: 'Avustralya', kod: 'Subclass 500', sure: 'Eğitim süresi', calisma: '2 haftada 48 saat' },
];

export default function OgrencilerIcinVize2026() {
  return (
    <BlogPostLayout post={POST} schema={SCHEMA}>
      <p className="text-slate-700 leading-relaxed text-base mb-6">
        Yurtdışı eğitimi, Türk gençlerinin en büyük hayallerinden biri. Ama hayalden gerçeğe
        giden yolda bir engel var: vize. Öğrenci vizesi, turist vizesinden farklı bir süreç ve
        farklı belgeler gerektiriyor. Erasmus'a mı gidiyorsunuz, ABD'de master mı yapacaksınız,
        Kanada'da study permit mi arıyorsunuz — her biri ayrı dünya. Bu rehber, öğrenci
        vizesinin tüm türlerini ve süreçlerini açıklıyor.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Öğrenci Vizesi Türleri</h2>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm border border-slate-200 rounded-xl overflow-hidden">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left px-3 py-2 font-semibold text-slate-700">Ülke</th>
              <th className="text-left px-3 py-2 font-semibold text-slate-700">Vize Kodu</th>
              <th className="text-left px-3 py-2 font-semibold text-slate-700">Süre</th>
              <th className="text-left px-3 py-2 font-semibold text-slate-700">Çalışma İzni</th>
            </tr>
          </thead>
          <tbody>
            {VIZE_TURLERI.map(({ ulke, kod, sure, calisma }) => (
              <tr key={ulke} className="border-t border-slate-200">
                <td className="px-3 py-2 font-semibold text-slate-800">{ulke}</td>
                <td className="px-3 py-2 text-slate-700">{kod}</td>
                <td className="px-3 py-2 text-slate-600 text-xs">{sure}</td>
                <td className="px-3 py-2 text-slate-600 text-xs">{calisma}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Erasmus+ Vize Rehberi (Schengen)</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Erasmus programı kapsamında AB üniversitelerine giden öğrenciler, Schengen turistik
        vize değil, öğrenci amaçlı kısa süreli Schengen vizesi (C-tipi) alır. Süresi 90 güne
        kadar ise C-tipi, daha uzun ise ulusal vize (D-tipi) gerekir.
      </p>
      <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">Erasmus İçin Gerekli Belgeler</h3>
      <ul className="space-y-2 mb-6">
        {[
          'Pasaport (6+ ay geçerli)',
          '2 biyometrik fotoğraf',
          'Schengen başvuru formu',
          'Seyahat sağlık sigortası (30.000 € + Erasmus süresini kapsayan)',
          'Erasmus kabul mektubu (Learning Agreement)',
          'Ev sahibi üniversitenin kabul yazısı (Invitation Letter)',
          'Türkiye\'deki üniversiteden öğrenci belgesi',
          'Transkript',
          'Ebeveyn sponsor dilekçesi (noter onaylı)',
          'Ebeveynin finansal belgeleri (banka dökümü, maaş)',
          'Konaklama belgesi (yurt veya ev kiralama sözleşmesi)',
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8 flex gap-3">
        <BookOpen className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-blue-900 text-sm mb-1">Erasmus İçin İpuçları</p>
          <ul className="text-blue-800 text-sm space-y-1 mt-1">
            <li>• Erasmus kabul mektubunuzu aldıktan sonra hemen randevu alın (Nisan-Ağustos yoğun dönem)</li>
            <li>• Banka hesap bakiyesi: aylık 600-800 € × kalış süresi</li>
            <li>• Türkiye'deki bağlar vurgulanmalı: "Erasmus sonrası dönüş" motivasyonu güçlü olmalı</li>
            <li>• Yurt rezervasyonu hazır olmalı — "evim yok" başvuruları riskli</li>
            <li>• Learning Agreement ve Invitation Letter tarihleri uçak biletiyle uyumlu olmalı</li>
          </ul>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">ABD F-1 Öğrenci Vizesi</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        ABD'de eğitim almak için F-1 vizesi gerekir. Üniversite, kolej, yüksek lisans, doktora
        programları için standart yoldur. Süreç: I-20 formu → SEVIS ücreti → DS-160 → Mülakat.
      </p>
      <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">F-1 İçin Adım Adım Süreç</h3>
      <ol className="space-y-2 mb-6 list-decimal list-inside text-sm text-slate-700">
        <li>Üniversiteye kabul alın — üniversite size I-20 formunu gönderecek</li>
        <li>SEVIS ücreti ödeyin (350 USD, online)</li>
        <li>DS-160 formu doldurun</li>
        <li>Vize başvuru ücreti ödeyin (185 USD)</li>
        <li>Ankara veya İstanbul konsolosluğundan mülakat randevusu alın</li>
        <li>Mülakat günü belgelerinizle gidin</li>
      </ol>
      <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">F-1 İçin Gerekli Belgeler</h3>
      <ul className="space-y-2 mb-6">
        {[
          'Pasaport (gelecek 6 ay geçerli minimum)',
          'I-20 formu (üniversite tarafından verilen)',
          'DS-160 onay sayfası (barkod)',
          'SEVIS ödeme makbuzu',
          'Vize başvuru ücreti makbuzu',
          'Fotoğraf (51x51mm, beyaz arka plan)',
          'Akademik transkript',
          'İngilizce yeterlilik belgesi (TOEFL/IELTS)',
          'Finansal belgeler (banka dökümü, sponsor beyanı, burs yazısı vb.)',
          'Türkiye\'ye dönüş amacını kanıtlayan belgeler',
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-800 text-sm mb-1">F-1 Mülakat İpuçları</p>
          <p className="text-amber-700 text-sm leading-relaxed mb-2">
            F-1 mülakatı ABD vizelerinin en zorudur. Memurun endişesi: "Bu öğrenci mezuniyet
            sonrası ABD'de kalmaya çalışabilir mi?"
          </p>
          <ul className="text-amber-800 text-sm space-y-1">
            <li>• Türkiye'ye dönüş planınızı net anlatın — "aile işi, iş imkanı, kariyer planı"</li>
            <li>• Eğitim amacınızı spesifik yapın — "Neden bu üniversite, neden bu program?"</li>
            <li>• Finansmanı net gösterin — "Eğitimim tamamen finanse edilmiş"</li>
            <li>• ABD'deki akrabaları gizlemeyin ama vurgulamayın</li>
            <li>• Kısa, net ve dürüst cevaplar verin — mülakat 2-5 dakika sürer</li>
          </ul>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Kanada Study Permit</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Kanada'da eğitim için Study Permit (Öğrenci İzni) alınır. Üniversite veya DLI
        (Designated Learning Institution) listesindeki kurumlardan kabul gerekir.
      </p>
      <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">Kanada Study Permit İçin Belgeler</h3>
      <ul className="space-y-2 mb-6">
        {[
          'Pasaport',
          'DLI kabul mektubu',
          'GIC (Guaranteed Investment Certificate) — 20.635 CAD yatırım (2026)',
          'Öğrenim ücreti ödeme makbuzu (ilk yıl)',
          'Dil yeterlilik (TOEFL, IELTS, CELPIP)',
          'Eğitim geçmişi belgeleri (transkript)',
          'Motivasyon mektubu (SOP — Statement of Purpose)',
          'Finansal belgeler',
          'Biyometri ve tıbbi muayene',
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-8 text-sm text-emerald-900">
        <p className="font-semibold mb-2">Kanada Avantajları</p>
        <ul className="space-y-1">
          <li>• Mezuniyet sonrası 1-3 yıl çalışma izni (PGWP)</li>
          <li>• Daimi ikamet için yol açar</li>
          <li>• Eş ve çocuğu getirme imkanı</li>
          <li>• Kampüs dışı haftada 20 saat çalışma</li>
        </ul>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">İngiltere Student Visa</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        İngiltere'de eğitim için Student Visa (eski Tier 4) gerekir. 2026 itibarıyla İngilizce
        seviyesi B2'ye yükseltilmiştir.
      </p>
      <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">İngiltere Student Visa İçin Belgeler</h3>
      <ul className="space-y-2 mb-6">
        {[
          'CAS (Confirmation of Acceptance for Studies) — üniversite tarafından',
          'Pasaport',
          'Online başvuru formu',
          'Finansal belgeler (28 gün boyunca hesapta duran para)',
          'İngilizce yeterlilik (IELTS UKVI, B2 minimum)',
          'TB testi (tüberküloz tarama, akciğer filmi)',
          'ATAS sertifikası (bazı teknoloji alanları için)',
          'Akademik transkript',
          'Motivasyon mektubu',
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8 text-sm text-blue-900">
        <p className="font-semibold mb-2">İngiltere Finansal Kanıt</p>
        <p className="leading-relaxed">
          Londra'da yaşayacaksanız aylık <strong>1.334 £</strong>, dışında <strong>1.023 £</strong>
          {' '}hesabınızda göstermeniz gerekir (2026 güncel). Bu para 28 gün kesintisiz hesapta
          durmalıdır. İngilizce kursu ve çift programlar için ayrı finansal hesaplamalar vardır.
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Almanya Öğrenci Vizesi</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Almanya'da eğitim için Ulusal Vize (D-tipi) gerekir. Almanya, öğrenci vizelerinde hem
        katı hem cömert bir ülkedir: şartlar sıkı, ancak kabul alan öğrencilere pek çok avantaj
        sunar.
      </p>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8 text-sm text-slate-700">
        <p className="font-semibold text-slate-800 mb-2">Almanya Öğrenci Vizesi İçin Finansal Kanıt</p>
        <p className="leading-relaxed mb-2">
          Almanya'da eğitim için en bilinen finansal kanıt yöntemi "Sperrkonto" (bloke hesap)
          açmaktır. 2026 yılı için minimum yıllık tutar: <strong>11.904 €</strong>. Bu tutar Alman
          bankasında bloke hesabına yatırılır ve aylık 992 € olarak öğrenciye serbest bırakılır.
        </p>
        <ul className="space-y-1">
          <li>• Sperrkonto açan bankalar: Fintiba, Expatrio, Deutsche Bank</li>
          <li>• Alternatif: ebeveyn resmi taahhüdü (Verpflichtungserklärung)</li>
          <li>• Burs kabul yazısı da finansal kanıt olarak kullanılabilir</li>
        </ul>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Ortak Başarı İpuçları (Tüm Öğrenci Vizeleri İçin)</h2>
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-8 flex gap-3">
        <GraduationCap className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <ol className="text-emerald-900 text-sm space-y-2 list-decimal list-inside">
          <li>Kabul mektubunuzu aldıktan sonra vize süreçlerine 3-4 ay önceden başlayın</li>
          <li>Finansal belgeleriniz en az 6 aydır düzenli ve şeffaf olmalı</li>
          <li>Dil sınavı sertifikanızın geçerlilik süresi vize başvuru tarihine kadar devam etmeli</li>
          <li>Motivasyon mektubunuzu (SOP) dikkatle yazın — kopyala-yapıştır belli olur</li>
          <li>Türkiye'deki bağlarınızı vurgulayın — aile, yatırım, kariyer planı</li>
          <li>Mülakata hazırlanırken olası soruları önceden prova edin</li>
          <li>Sosyal medyanızda uygunsuz içerikleri temizleyin (vize memurları kontrol edebilir)</li>
        </ol>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Sık Sorulan Sorular (SSS)</h2>
      <div className="space-y-4 mb-8">
        {[
          { q: 'Öğrenci vizesi için dil yeterliliği şart mı?', a: 'Çoğu ülkede evet. İngilizce programlar için IELTS/TOEFL, Almanya için TestDaF/DSH, Fransa için DELF/DALF gerekir. Bazı ülkelerde (özellikle Kanada) minimum puan şartı kesindir.' },
          { q: 'Ebeveynim sponsor olabilir mi?', a: 'Evet. Ebeveyn sponsorluğu tüm öğrenci vize türlerinde kabul edilir. Ebeveynin finansal gücünü belgelemesi ve noter onaylı sponsor taahhüdü vermesi gerekir.' },
          { q: 'Burs almış bir öğrenciyim, finansal belgelere gerek var mı?', a: 'Burs belgesi tam finansmanı kapsıyorsa (eğitim + yaşam masrafı), ek finansal belge istenmeyebilir. Kısmi burslarda kalan masrafı karşılayacak finansal kanıt gerekir.' },
          { q: 'Öğrenci vizesi ile çalışabilir miyim?', a: 'Çoğu ülkede kısıtlı çalışma hakkı vardır (genellikle haftada 20 saat). Ancak çalışma izni için öğrenci vizesi yeterli değildir — ek iş izni gerekir. Bu kural her ülkede farklıdır.' },
          { q: 'Mezuniyet sonrası ülkede kalabilir miyim?', a: 'Çoğu ülkede evet: Kanada PGWP (1-3 yıl), İngiltere Graduate Route (2 yıl), Almanya iş arama vizesi (18 ay), ABD OPT (12-36 ay). Bu sistemler kariyer ve yerleşme için köprü işlevi görür.' },
          { q: 'Öğrenci vizesi red alabilir mi?', a: 'Evet. En yaygın red sebepleri: yetersiz finansal kanıt, zayıf akademik profil, şüpheli dönüş niyeti, eksik belgeler. İlk red sonrası doğru strateji ile yeniden başvuru başarılı olabilir.' },
        ].map(({ q, a }) => (
          <div key={q} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="font-semibold text-slate-800 text-sm mb-1 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" /> {q}
            </p>
            <p className="text-slate-600 text-sm leading-relaxed pl-6">{a}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-brand-50 border border-brand-200 rounded-2xl p-6 flex gap-3">
        <BookOpen className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-brand-900 mb-2">Özet</h3>
          <p className="text-brand-800 text-sm leading-relaxed">
            Öğrenci vizesi hayalinizin anahtarıdır — her ülkenin kendi kapısı ve anahtarı var.
            Erasmus için Schengen C-tipi, Almanya için Sperrkonto, Kanada için GIC 20.635 CAD,
            İngiltere için 28-gün kuralı ve ABD için F-1 mülakatı. Kabul mektubunu aldıktan sonra
            3-4 ay öncesinden süreci başlatın ve Türkiye'ye dönüş güvencenizi ön plana çıkarın.
          </p>
        </div>
      </div>
    </BlogPostLayout>
  );
}
