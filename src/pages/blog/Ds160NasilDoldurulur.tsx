import React from 'react';
import { AlertTriangle, CheckCircle2, Info, Keyboard, Clock } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'ds-160-formu-nasil-doldurulur-rehberi',
  title: 'DS-160 Formu Nasıl Doldurulur? 2026 Adım Adım Türkçe Rehber',
  description: 'ABD vize başvurusu için DS-160 formunu sıfırdan doldurma rehberi: bölüm bölüm ne yazılır, en çok hata yapılan sorular ve tuzaklı alanlar.',
  category: 'ABD',
  readingTime: 12,
  date: '2026-04-17',
  tags: ['DS-160', 'ABD vizesi', 'form doldurma', 'B1 B2 vize'],
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: POST.title,
      description: POST.description,
      author: { '@type': 'Organization', name: 'VizeAkıl', url: 'https://vizeakil.com' },
      publisher: { '@type': 'Organization', name: 'VizeAkıl' },
      datePublished: POST.date,
      dateModified: POST.date,
      url: `https://vizeakil.com/blog/${POST.slug}`,
    },
    {
      '@type': 'HowTo',
      name: 'DS-160 formu nasıl doldurulur',
      totalTime: 'PT90M',
      step: [
        { '@type': 'HowToStep', name: 'CEAC sayfasına giriş', text: 'ceac.state.gov/genniv üzerinden Türkiye\'yi ve konsolosluğu seç, güvenlik sorusunu belirle.' },
        { '@type': 'HowToStep', name: 'Kişisel bilgiler', text: 'İsim, doğum bilgileri, medeni durum sorularını pasaportla tam uyumlu yanıtla.' },
        { '@type': 'HowToStep', name: 'Seyahat planı', text: 'Tahmini varış tarihi, kalış süresi ve adres bilgilerini doldur.' },
        { '@type': 'HowToStep', name: 'İş ve eğitim', text: 'İşveren, maaş, eğitim geçmişi — SGK ve diploma ile tutarlı girilmeli.' },
        { '@type': 'HowToStep', name: 'Fotoğraf ve gönderim', text: '5x5 cm biyometrik fotoğraf yükle, kontrol et ve gönder. Onay sayfasını yazdır.' },
      ],
    },
  ],
};

export default function Ds160NasilDoldurulur() {
  return (
    <BlogPostLayout post={POST} schema={SCHEMA}>
      <p className="text-slate-700 leading-relaxed text-base mb-6">
        DS-160, ABD vize başvurusunun en teknik ve en stresli aşamasıdır. Form 20+ sayfadan oluşur,
        yüzlerce soru içerir ve yanlış veya tutarsız cevaplar ret gerekçesi olur. İyi haber şu:
        doğru stratejiyle 60-90 dakikada tamamlanabilir. Bu rehber bölüm bölüm formu Türkçe
        açıklamalarla göstermektedir ve en sık hata yapılan 12 noktayı işaretlemektedir.
      </p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 flex gap-3">
        <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-amber-900 text-sm leading-relaxed">
          <strong>Öncelikle zamanlama:</strong> DS-160'ı doldurmaya başlamadan önce pasaport,
          son 5 yıldaki işverenlerin isim ve adresleri, eğitim bilgileri ve 5x5 cm dijital
          fotoğrafınız hazır olsun. Kaydedilmeden tamamlandığında değişiklik yapmak imkansızdır.
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">1. Başlangıç: CEAC Sayfasına Giriş</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        <a href="https://ceac.state.gov/genniv" target="_blank" rel="noopener noreferrer" className="text-brand-600 underline">ceac.state.gov/genniv</a> adresine gidin:
      </p>
      <ul className="space-y-2 mb-6">
        {[
          'Location: "TURKEY, ANKARA" veya "TURKEY, ISTANBUL" (başvuracağınız konsolosluk)',
          'Güvenlik karakterlerini girin',
          '"Start an Application" tıklayın',
          'Size verilen Application ID\'yi (AA00XXXXXXX) not edin — formu kaydetmek için şart',
          'Güvenlik sorusu ve cevabınızı belirleyin',
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">2. Personal Information 1-2 (Kişisel Bilgiler)</h2>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6 space-y-3 text-sm text-slate-700">
        <div>
          <p className="font-semibold text-slate-800 mb-1">Surnames / Given Names</p>
          <p>Pasaportunuzdaki LATIN harfler ile AYNEN. Türkçe karakterler yok (Özgür → Ozgur).</p>
        </div>
        <div>
          <p className="font-semibold text-slate-800 mb-1">Full Name in Native Alphabet</p>
          <p>Türkçe karakterlerle (Özgür). Yabancı dildeki adınız.</p>
        </div>
        <div>
          <p className="font-semibold text-slate-800 mb-1">Other Names Used</p>
          <p>Takma ad, eski soyadı varsa yazın. Evlilik öncesi soyadınız da buraya.</p>
        </div>
        <div>
          <p className="font-semibold text-slate-800 mb-1">Sex</p>
          <p>Pasaporttaki cinsiyetle uyumlu.</p>
        </div>
        <div>
          <p className="font-semibold text-slate-800 mb-1">Country of Birth</p>
          <p>Türkiye.</p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">3. Travel Information (Seyahat Bilgileri)</h2>
      <p className="text-slate-700 leading-relaxed mb-4">Bu bölüm en kritik olanıdır. Her cevap mülakatta doğrulanabilir:</p>
      <ul className="space-y-2 mb-6">
        {[
          'Purpose of Trip: Turist için "Temporary Visitor for Pleasure (B2)", iş için "Temporary Business Visitor (B1)"',
          'Intended Date of Arrival: Tahmini tarih, net planınız yoksa 3-6 ay sonra bir tarih',
          'Intended Length of Stay: Maksimum 29 gün yazın (90 günden az olması dönüş güvencesi sinyalidir)',
          'Address where you will stay: Otel adı + adresi veya akraba adresi — MUTLAKA doğrulanabilir',
          'Person/Entity Paying: Kendiniz mi, iş yeriniz mi, yoksa başka biri mi?',
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">4. Previous US Travel</h2>
      <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-red-800 text-sm mb-1">En riskli bölüm</p>
          <p className="text-red-700 text-sm leading-relaxed">
            Daha önce ABD'ye gittiyseniz <strong>tüm tarihleri ve kalış sürelerini doğru yazın</strong>.
            Daha önce vize reddi aldıysanız "Yes" işaretleyin ve nedenini açıklayın. Sakladığınız
            bilgi sistemde zaten vardır; yalan = Madde 212(a)(6)(C) ile ömür boyu yasak.
          </p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">5. Family & Work / Education</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Ailenizin ABD'de yaşıyor olması <strong>dezavantaj değildir</strong>, aksine düzgün
        beyan edildiğinde güven verir. Saklamayın.
      </p>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6 text-sm text-slate-700">
        <p className="font-semibold mb-2">İş bilgileri (Work):</p>
        <ul className="space-y-1">
          <li>• Present Occupation: Resmi iş unvanınız</li>
          <li>• Employer Name: Şirket adı (SGK'dakiyle aynı)</li>
          <li>• Employer Address: Tam adres</li>
          <li>• Monthly Income in USD: Maaşınızı kura çevirerek girin</li>
          <li>• Briefly describe your duties: 2-3 cümleyle ne yaptığınız</li>
        </ul>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">6. Security and Background</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        50+ "Yes/No" sorusu. Neredeyse hepsine "No" cevap vereceksiniz. Dikkat:
      </p>
      <ul className="space-y-2 mb-6 text-sm text-slate-700">
        <li>• Herhangi bir suçtan hüküm giydiniz mi? — <strong>Hatırladığınız her şeyi dürüstçe</strong></li>
        <li>• Uyuşturucu geçmişi — Tedavi gördüyseniz bile "Yes"</li>
        <li>• Terörist/örgüt bağlantısı — 99.9% No</li>
        <li>• Önceki ABD vize sorunu — Daha önce red aldıysanız "Yes"</li>
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">7. Fotoğraf Yükleme</h2>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-blue-900 text-sm mb-1">Fotoğraf özellikleri</p>
          <ul className="text-blue-800 text-sm space-y-1 mt-1">
            <li>• 5x5 cm (2x2 inch) kare</li>
            <li>• Son 6 ay içinde çekilmiş, renkli, beyaz arka plan</li>
            <li>• Gözlük YOK (2016 sonrası)</li>
            <li>• Başörtüsü dini sebep varsa OK ama yüz net görünmeli</li>
            <li>• Dijital fotoğraf kabul etmezse konsolosluğa fiziksel götürürsünüz</li>
          </ul>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">8. En Sık Yapılan 12 Hata</h2>
      <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6">
        <ol className="text-red-800 text-sm space-y-1 list-decimal list-inside">
          <li>Pasaport bilgileri ile DS-160'daki isim farklı</li>
          <li>Doğum tarihinde GG/AA karışıklığı</li>
          <li>Adres bilgisi SGK'daki adresten farklı</li>
          <li>Eğitim bilgisi diplomada ayrı tarih göstermek</li>
          <li>ABD'deki akrabayı beyan etmemek</li>
          <li>Önceki seyahatleri saklamak</li>
          <li>"Kim ödüyor" sorusuna sponsor bilgisi koymamak</li>
          <li>Social media hesapları — tümünü listelememek</li>
          <li>"Duties" kısmını boş veya tek kelime geçmek</li>
          <li>Fotoğrafın çok eski olması</li>
          <li>Application ID'yi kaydetmeyi unutmak</li>
          <li>Gönderdikten sonra barkodlu onay sayfasını yazdırmamak</li>
        </ol>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">9. Onay Sayfası ve Sonrası</h2>
      <ul className="space-y-2 mb-8">
        {[
          'DS-160 onay sayfasını (barkodlu) yazdırın',
          'MRV ücretini ödeyin (~$185 — 2026)',
          'US Travel Docs üzerinden mülakat randevusu alın',
          'Mülakat günü: pasaport + onay sayfası + ücret dekontu + destek belgeleri',
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-8 flex gap-3">
        <Keyboard className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-emerald-800 text-sm mb-1">Zaman Kazandıran İpucu</p>
          <p className="text-emerald-700 text-sm leading-relaxed">
            DS-160 tek oturumda bitirilmek zorunda değildir. Application ID + güvenlik sorusu ile
            30 gün süre var. İlk 10-15 dakika "save application" butonu görünene kadar doldurup
            sonra devam edin. Böylece yanlışlık yaparsanız da geri dönüp düzeltebilirsiniz.
          </p>
        </div>
      </div>

      <div className="mt-12 bg-brand-50 border border-brand-200 rounded-2xl p-6">
        <h3 className="font-bold text-brand-900 mb-2">Özet</h3>
        <p className="text-brand-800 text-sm leading-relaxed">
          DS-160 bir test değil, bir hikayenizin kaydıdır. Tutarlı, dürüst ve dikkatle
          doldurulduğunda bile reddedilebilirsiniz — ama tutarsızsa kesinlikle reddedilirsiniz.
          Acele etmeyin, 2 saat ayırın, aile bireyleriyle çapraz kontrol yapın ve göndermeden
          önce tüm sayfaları tekrar okuyun.
        </p>
      </div>
    </BlogPostLayout>
  );
}
