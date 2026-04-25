import React from 'react';
import { AlertTriangle, CheckCircle2, Info, ShieldCheck } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'kanada-vizesi-nasil-alinir-2026',
  title: "Kanada Vizesi Nasıl Alınır? 2026 TRV Başvuru Rehberi",
  description: "Türk vatandaşları için 2026 Kanada Geçici İkamet Vizesi (TRV) başvurusu: IRCC online başvuru, biyometrik kayıt, belge gereksinimleri, bekleme süreleri ve ret gerekçeleri.",
  category: 'Genel',
  readingTime: 8,
  date: '2026-04-16',
  tags: ['Kanada vizesi', 'TRV', 'IRCC', 'Kanada başvurusu', '2026 Kanada'],
};

const ARTICLE_SCHEMA = {
  '@type': 'Article',
  headline: POST.title,
  description: POST.description,
  author: { '@type': 'Organization', name: 'VizeAkıl', url: 'https://vizeakil.com' },
  publisher: { '@type': 'Organization', name: 'VizeAkıl', logo: { '@type': 'ImageObject', url: 'https://vizeakil.com/og-image.png' } },
  datePublished: POST.date,
  dateModified: POST.date,
  url: `https://vizeakil.com/blog/${POST.slug}`,
};

const FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: "Kanada vizesi ne kadar sürer?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Kanada TRV başvurusu 2026 itibarıyla ortalama 4-12 hafta sürmektedir. IRCC yoğunluğa göre bu süre uzayabilir. Seyahattan en az 3-4 ay önce başvuru yapmanız önerilir.",
      },
    },
    {
      '@type': 'Question',
      name: "Kanada vizesi için biyometrik kayıt zorunlu mu?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Evet. 14-79 yaş arası Türk vatandaşları Kanada vizesi için VFS Global Kanada ofisinde biyometrik kayıt (parmak izi ve fotoğraf) yaptırmak zorundadır. Biyometrik ücret: 85 CAD. Biyometrik kayıt 10 yıl geçerlidir.",
      },
    },
    {
      '@type': 'Question',
      name: "Kanada vize ücreti ne kadar?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Kanada TRV başvuru ücreti tek kişi için 100 CAD, aile için 500 CAD'dır. Biyometrik ücret (85 CAD) ayrıca ödenir. Ücretler IRCC sistemi üzerinden kredi kartıyla ödenir ve ret durumunda iade edilmez.",
      },
    },
    {
      '@type': 'Question',
      name: "Kanada vizesi için hangi belgeler gerekir?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Temel belgeler: geçerli pasaport, biyometrik fotoğraf, uçak ve otel rezervasyonu, son 6 aylık banka hesap özeti, çalışma veya iş belgesi, geri dönüş bağlılık kanıtı, niyet mektubu. Kanada, AB veya ABD vize geçmişi pozitif etki yapar.",
      },
    },
    {
      '@type': 'Question',
      name: "Kanada vizesi online mı yoksa şahsen mi başvurulur?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Kanada vizesi IRCC online portalı (ircc.canada.ca) üzerinden başvurulur. Belgeler dijital olarak yüklenir. Biyometrik kayıt için VFS Global ofisine gitmek gerekir. Şahsen konsolosluğa gitme zorunluluğu yoktur.",
      },
    },
    {
      '@type': 'Question',
      name: "Kanada'da Türk öğrenciler için vize farklı mı?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Kanada'da 6 ayı aşan dil kursları veya üniversite eğitimi için öğrenci izni (study permit) gerekir. 6 ay ve altı kurslar için TRV yeterlidir. Öğrenci izni başvurusu TRV'den farklı bir süreçtir ve kabul mektubu gerektirir.",
      },
    },
  ],
};

export default function KanadaVizesi2026() {
  return (
    <BlogPostLayout post={POST} schema={[ARTICLE_SCHEMA, FAQ_SCHEMA]}>

      <p className="text-slate-700 leading-relaxed text-base mb-6">
        Kanada, son yıllarda Türk turistler ve öğrenciler için giderek popüler bir
        destinasyon haline geldi. Ancak Kanada Geçici İkamet Vizesi (TRV), ABD veya
        Schengen'den farklı bir süreç izliyor: tamamen online başvuru, biyometrik
        kayıt zorunluluğu ve uzun değerlendirme süreleri. Adım adım 2026 güncel rehber.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Kanada Vize Türleri</h2>
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { tur: 'TRV (Turizm/Ziyaret)', detay: 'Geçici İkamet Vizesi. Turizm, aile ziyareti, kısa iş. Maksimum 6 ay kalış.' },
          { tur: 'Çalışma Vizesi', detay: "İş teklifi olan veya IEC programına katılanlar için. TRV'den farklı süreç." },
          { tur: 'Öğrenci İzni', detay: "6 ay üzeri eğitim için. Kabul mektubu zorunlu. TRV'den bağımsız." },
        ].map(({ tur, detay }) => (
          <div key={tur} className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm">
            <p className="font-bold text-slate-800 mb-1">{tur}</p>
            <p className="text-slate-600 leading-relaxed">{detay}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Başvuru Adımları</h2>
      <div className="space-y-3 mb-8">
        {[
          { n: '1', b: 'IRCC hesabı oluşturun', d: 'ircc.canada.ca adresinden GCKey veya Sign-In Canada ile hesap açın.' },
          { n: '2', b: 'Online formu doldurun', d: 'IMM 5257 başvuru formu ve IMM 5645 (aile bilgisi) IRCC üzerinden doldurulur.' },
          { n: '3', b: 'Belgeleri yükleyin', d: "Pasaport, fotoğraf, mali kanıt, seyahat planı ve diğer belgeler PDF olarak sisteme yüklenir." },
          { n: '4', b: 'Ücret ödeyin', d: "100 CAD başvuru ücreti + 85 CAD biyometrik ücret kredi kartıyla ödenir." },
          { n: '5', b: 'Biyometrik randevusu alın', d: 'VFS Global Kanada ofisinde (İstanbul/Ankara) randevu alarak parmak izi ve fotoğraf verilir.' },
          { n: '6', b: 'Kararı bekleyin', d: 'Ortalama 4-12 hafta. IRCC sisteminden takip edilir. Onay e-postayla bildirilir.' },
          { n: '7', b: 'Pasaportu gönderin', d: 'Onay sonrası pasaport vizesi yapıştırılmak üzere VFS üzerinden gönderilir.' },
        ].map(({ n, b, d }) => (
          <div key={n} className="flex gap-3 text-sm">
            <span className="w-7 h-7 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold shrink-0 text-xs mt-0.5">{n}</span>
            <div>
              <p className="font-semibold text-slate-800 mb-0.5">{b}</p>
              <p className="text-slate-600 leading-relaxed">{d}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-800 text-sm mb-1">Biyometrik Kayıt Zorunlu</p>
          <p className="text-amber-700 text-sm leading-relaxed">
            Online başvuruyu tamamladıktan sonra <strong>30 gün içinde</strong> VFS Global
            Kanada ofisinde biyometrik kayıt yaptırılmalıdır. Bu süre kaçırılırsa
            başvuru otomatik iptal olur. İstanbul'da VFS Kanada ofisi mevcuttur.
          </p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Güçlü Dosya İçin Belgeler</h2>
      <div className="space-y-3 mb-8">
        {[
          { kategori: 'Kimlik', icerik: 'Geçerli pasaport + eski pasaportlar + nüfus cüzdanı fotokopisi' },
          { kategori: 'Mali Kanıt', icerik: 'Son 6 ay banka özeti + maaş bordrosu + vergi beyannamesi' },
          { kategori: 'Seyahat Planı', icerik: 'Uçak ve otel rezervasyonu + Kanada güzergahı + seyahat sigortası' },
          { kategori: 'Bağlılık', icerik: "İş veya çalışma belgesi + izin yazısı + mülk/kira kanıtı + aile durumu belgesi" },
          { kategori: 'Ek Güç', icerik: "Schengen, ABD, İngiltere gibi güçlü vize geçmişi IRCC değerlendirmesinde pozitif etki yapar" },
        ].map(({ kategori, icerik }) => (
          <div key={kategori} className="flex items-start gap-3 text-sm bg-white border border-slate-200 rounded-xl p-4">
            <span className="font-bold text-brand-700 shrink-0 min-w-[90px]">{kategori}</span>
            <p className="text-slate-600 leading-relaxed">{icerik}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">En Yaygın Ret Gerekçeleri</h2>
      <ul className="space-y-2 mb-8">
        {[
          "Geri dönüş niyetinin yetersiz kanıtlanması — iş, mülk, aile bağı güçlendirilmeli",
          "Mali yetersizlik — banka hesabı düşük veya düzensiz",
          "Seyahat geçmişi yokluğu — Türkiye dışına hiç çıkmamış profil daha riskli görünür",
          "Niyet mektubunun zayıf veya formül gibi yazılmış olması",
          "Önceki vize redlerinin beyan edilmemesi",
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-8 flex gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-emerald-800 text-sm mb-1">Danışman İpucu: Geçmiş Vize Gücü</p>
          <p className="text-emerald-700 text-sm leading-relaxed">
            Schengen, ABD veya İngiltere vizesi olan başvurucular Kanada değerlendirmesinde
            belirgin avantaj elde eder. IRCC, geçmiş vize sicilini güven göstergesi olarak
            değerlendirir. Kanada başvurusunu bu vizelerden sonraki bir adım olarak planlayın.
          </p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Sık Sorulan Sorular</h2>
      <div className="space-y-4 mb-8">
        {FAQ_SCHEMA.mainEntity.map(({ name, acceptedAnswer }) => (
          <div key={name} className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="font-semibold text-slate-800 text-sm mb-2">{name}</p>
            <p className="text-slate-600 text-sm leading-relaxed">{acceptedAnswer.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-brand-50 border border-brand-200 rounded-2xl p-6">
        <h3 className="font-bold text-brand-900 mb-2">Kanada Vizesi: Sabır ve Özenlilik İster</h3>
        <p className="text-brand-800 text-sm leading-relaxed">
          Kanada vize süreci uzun ama anlaşılır: güçlü belgeler, net niyet mektubu,
          güvenilir mali kanıt ve biyometrik kayıt. Online başvuru sistemi şeffaf —
          IRCC portalından sürecinizi anlık takip edebilirsiniz. Erken başvuru,
          her zaman en önemli adımdır.
        </p>
      </div>

    </BlogPostLayout>
  );
}
