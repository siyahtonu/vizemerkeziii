import React from 'react';
import { AlertTriangle, CheckCircle2, Info, ShieldCheck } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'ingiltere-tier4-niyet-mektubu',
  title: 'İngiltere Student Visa (Tier 4) için Niyet Mektubu (Personal Statement) Nasıl Yazılır?',
  description: 'UK Student Visa başvurusunda personal statement / niyet mektubunda neler yazılmalı, neler yazılmamalı? Yapı, uzunluk, dil ve kaçınılması gereken klişeler.',
  category: 'İngiltere',
  readingTime: 9,
  date: '2026-04-16',
  tags: ['İngiltere öğrenci vizesi', 'Tier 4', 'niyet mektubu', 'personal statement', 'UK student visa'],
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: POST.title,
  description: POST.description,
  author: { '@type': 'Organization', name: 'VizeAkıl', url: 'https://vizeakil.com' },
  publisher: { '@type': 'Organization', name: 'VizeAkıl' },
  datePublished: POST.date,
  dateModified: POST.date,
  url: `https://vizeakil.com/blog/${POST.slug}`,
};

const YAPI = [
  {
    baslik: '1. Neden bu program?',
    icerik: 'Seçtiğiniz programın sizin için neden doğru olduğunu açıklayın. Üniversitenin web sitesinden kopyalanan genel bilgiler değil; programın spesifik modülleri, öğretim kadrosu veya araştırma odağı hakkında somut bilgi gösterin. Bu araştırma yaptığınızı kanıtlar.',
  },
  {
    baslik: '2. Neden bu üniversite?',
    icerik: '"İngiltere\'nin en iyi üniversitelerinden biri" klişesini yazmayın. Üniversitenin laboratuvarları, endüstri bağlantıları, şehir konumu veya mezun ağı gibi spesifik özellikleri ön plana çıkarın.',
  },
  {
    baslik: '3. Akademik ve profesyonel geçmişiniz',
    icerik: 'Lisans veya yüksek lisans notlarınız, tamamladığınız projeler, aldığınız sertifikalar, yayınlarınız. Neden bu alana ilgi duymaya başladığınızı kısa bir hikayeyle aktarın.',
  },
  {
    baslik: '4. Geleceğe bağlantı: Türkiye\'ye dönüş planı',
    icerik: 'Bu bölüm vize açısından en kritik kısımdır. Mezun olduktan sonra Türkiye\'de ne yapacaksınız? Belirli bir iş teklifi, aile işi, sektör planı veya girişim fikri varsa bunları yazın. UK Visas & Immigration "Bu kişi İngiltere\'de kalır mı?" sorusuna burada yanıt arar.',
  },
  {
    baslik: '5. Finansal plan',
    icerik: 'Eğitim ve yaşam masraflarını nasıl karşılayacaksınız? Burs mı, aile desteği mi, bireysel birikim mi? Kısaca belirtin; detaylar belgelerle desteklenecek.',
  },
];

const YAPMA = [
  '"İngiltere her zaman hayalimdi" ile başlamak — klişe ve etkisiz',
  'Programın web sitesini birebir kopyalamak — plagiarism tespiti olabilir',
  'Akademik yetersizlikleri doğrudan değil, dolaylı gerekçelerle geçiştirmek',
  'Belirsiz kariyer hedefleri: "ileride bir şeyler yapmak istiyorum"',
  '"İngilizce\'mi geliştirmek istiyorum" demek — bu vize amacı değil',
  'Bir sayfadan uzun yazmak — odak ve özlülük önemli',
];

export default function IngiltereNiyetMektubu() {
  return (
    <BlogPostLayout post={POST} schema={SCHEMA}>

      <p className="text-slate-700 leading-relaxed text-base mb-6">
        İngiltere öğrenci vizesi başvurusunda niyet mektubu (personal statement veya cover letter)
        akademik başvurudakinden farklı bir amaca hizmet eder. Üniversiteye "seni neden almalıyız?"
        yerine vize görevlisine <em>"neden geliyorum, neden dönüyorum?"</em> sorusunu yanıtlıyorsunuzdur.
        Bu fark, mektubun tamamını şekillendirir.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Vize Niyet Mektubu mu, Üniversite Personal Statement mi?</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Çoğu öğrenci üniversiteye gönderdiği personal statement'ı vize dosyasına da koyar.
        Bu yanlış değildir — ama yetersizdir. Vize mektubu ek olarak veya yerine aşağıdaki
        konuları ele almalıdır:
      </p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm">
          <p className="font-semibold text-blue-800 mb-2">Üniversite Personal Statement</p>
          <ul className="space-y-1 text-blue-700">
            <li>• Akademik motivasyon</li>
            <li>• Araştırma ilgi alanları</li>
            <li>• Başarılar ve projeler</li>
            <li>• Neden bu program?</li>
          </ul>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm">
          <p className="font-semibold text-emerald-800 mb-2">Vize Cover Letter (Ek)</p>
          <ul className="space-y-1 text-emerald-700">
            <li>• Türkiye'ye dönüş planı</li>
            <li>• Finansal kaynak açıklaması</li>
            <li>• Aile ve sosyal bağlar</li>
            <li>• Visa category doğrulaması</li>
          </ul>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Niyet Mektubunun Yapısı</h2>
      <div className="space-y-4 mb-10">
        {YAPI.map(({ baslik, icerik }) => (
          <div key={baslik} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-3">
              <p className="font-bold text-slate-800 text-sm">{baslik}</p>
            </div>
            <div className="p-4 text-sm text-slate-700 leading-relaxed">
              {icerik}
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Kesinlikle Yapmayın</h2>
      <ul className="space-y-2 mb-8">
        {YAPMA.map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Dil ve Uzunluk</h2>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8 space-y-2 text-sm text-slate-700">
        <p className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/>İngilizce yazın — güçlü İngilizce dil hakimiyeti vize görevlisine akademik hazırlık hakkında mesaj verir</p>
        <p className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/>Uzunluk: 400-600 kelime (1 A4 sayfa) idealdir</p>
        <p className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/>Paragraflar kısa ve akıcı olsun; akademik ama okunaklı bir dil</p>
        <p className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/>AI araçlarıyla yazılan metinler düzenleyin; görevli kalıpları tanır</p>
        <p className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/>İmzalayın, tarih atın</p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Örnek Güçlü Giriş Paragrafı</h2>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6 text-sm text-slate-700 leading-relaxed">
        <p className="italic text-slate-500 mb-2">Örnek:</p>
        <p>"I am applying for a UK Student Visa to pursue the MSc in Data Science at the University
        of Edinburgh, starting September 2026. My background in statistical modelling during my
        undergraduate studies at Boğaziçi University, combined with three years of experience
        in financial analytics, has led me to specifically choose Edinburgh's programme for its
        focus on applied machine learning in finance — an area I intend to develop further upon
        my return to Türkiye, where I have been offered a position at [Company Name]."</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-blue-800 text-sm leading-relaxed">
          Bu örnekte dikkat: Program spesifik olarak seçilmiş, akademik geçmiş somut,
          Türkiye'ye dönüş bağlantısı ilk paragrafta kurulmuş ve iş teklifi referans verilmiş.
          Tüm bunları bir paragrafta kurmak mektubu güçlü başlatır.
        </p>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-8 flex gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-emerald-800 text-sm mb-1">Danışman İpucu: CAS Numarası Gelmeden Yazın</p>
          <p className="text-emerald-700 text-sm leading-relaxed">
            Niyet mektubunu CAS (Confirmation of Acceptance for Studies) numarası gelmeden
            hazırlayabilirsiniz; sadece CAS numarasını ve başlangıç tarihini mektuba
            sonradan ekleyin. Erken hazırlık gözden geçirme ve düzeltme için zaman tanır.
          </p>
        </div>
      </div>

      <div className="mt-12 bg-brand-50 border border-brand-200 rounded-2xl p-6">
        <h3 className="font-bold text-brand-900 mb-2">Sonuç: Vize Mektubu İkna Belgesidir</h3>
        <p className="text-brand-800 text-sm leading-relaxed">
          Güçlü bir niyet mektubu vize görevlisine şunu söyler: "Bu kişi İngiltere'ye eğitim
          için geliyor, kalma niyeti yok ve dönüş için güçlü nedenleri var." Akademik motivasyonu
          ve dönüş planını aynı mektupta dengeli biçimde kurabilirseniz, belge dosyanızın
          tamamına güçlü bir temel oluşturursunuz.
        </p>
      </div>

    </BlogPostLayout>
  );
}
