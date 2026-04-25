import React from 'react';
import { AlertTriangle, CheckCircle2, Info, ShieldCheck } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'ds-160-form-doldurma-rehberi',
  title: 'Adım Adım DS-160 Formu Doldurma Rehberi (Türkçe Açıklamalı) 2026',
  description: 'ABD vize başvurusu için DS-160 formunu Türkçe açıklamalarla nasıl dolduracaksınız? En çok hata yapılan bölümler, tuzaklı sorular ve form kaydetme tüyoları.',
  category: 'ABD',
  readingTime: 11,
  date: '2026-04-16',
  tags: ['DS-160', 'ABD vize formu', 'Amerika vizesi', 'form doldurma', 'B-2'],
};

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: POST.title,
  description: POST.description,
  author: { '@type': 'Organization', name: 'VizeAkıl', url: 'https://vizeakil.com' },
  publisher: { '@type': 'Organization', name: 'VizeAkıl', logo: { '@type': 'ImageObject', url: 'https://vizeakil.com/og-image.png' } },
  datePublished: POST.date,
  dateModified: POST.date,
  url: `https://vizeakil.com/blog/${POST.slug}`,
};

const BOLUMLER = [
  {
    baslik: 'Personal Information 1 & 2',
    aciklama: 'Ad-soyad pasaportunuzdakiyle birebir aynı olmalı. Türkçe karakter yoktur; "Ş→SH, Ğ→G, Ü→U, Ö→O, Ç→C, İ→I" dönüşümlerini pasaport latin karşılığına göre yapın. "Other names used" alanına varsa kız soyadı veya takma ad girin.',
    uyari: 'Pasaportunuzda "ATALAY" yazıyorsa formda da "ATALAY" yazın. Orijinalden sapma tutarsızlık sayılır.',
  },
  {
    baslik: 'Travel Information',
    aciklama: '"Purpose of trip" → B-2 turist için "Pleasure/Tourism". Seyahat tarihinizi biliyorsanız kesin tarihi; bilmiyorsanız yaklaşık tarihi yazabilirsiniz. "Specific travel plans?" → "Yes" deyip tarihleri girin veya henüz bilmiyorsanız "No" seçip açıklama girin.',
    uyari: 'Bu bölümdeki tarih mülakatta sorulur. Bilet tarihinizle örtüşmeli.',
  },
  {
    baslik: 'Travel Companions',
    aciklama: 'Yalnız gidiyorsanız "No". Aile ile gidiyorsanız "Yes" seçip kişi bilgilerini girin. Her kişi kendi DS-160\'ını ayrı doldurur; ama companionlar birbirine referans verebilir.',
    uyari: null,
  },
  {
    baslik: 'Previous U.S. Travel',
    aciklama: 'Daha önce ABD\'ye gittiyseniz tarihleri ve pasaport numaralarını doğru girin. Vize numarasını çözük hatırlamıyorsanız eski pasaportunuza bakın veya "unknown" yazın — ama yalan beyan yapmayın.',
    uyari: 'Daha önce gidip zamanından uzun kaldıysanız (overstay) bunu beyan etmeniz gerekir. Gizlemek kalıcı ban riski oluşturur.',
  },
  {
    baslik: 'U.S. Contact Information',
    aciklama: 'Tanıdığınız biri varsa (arkadaş, akraba) adı-adresi girin. Kimseyi tanımıyorsanız "Will be staying at a hotel" seçip rezervasyon adresini yazın.',
    uyari: null,
  },
  {
    baslik: 'Family Information',
    aciklama: 'Anne-babanın adı, soyadı ve doğum yeri sorulur. ABD\'de akrabanız varsa bu bölümde bildirilmesi zorunludur.',
    uyari: 'ABD\'de akraba olmasını gizlemek sonradan tespit edilirse ciddi sonuçlar doğurabilir.',
  },
  {
    baslik: 'Work / Education / Training',
    aciklama: 'Son 5 yıldaki işleri, okul durumunu ve varsa askeri hizmet bilgilerini girin. İş yerinin tam adı, adresi ve telefonu gerekiyor. Emekli, öğrenci veya ev hanımı ise ilgili kategoriyi seçin.',
    uyari: null,
  },
  {
    baslik: 'Security and Background Questions',
    aciklama: 'Bu bölüm terör, suç, hastalık gibi sorular içerir. Neredeyse hepsinin cevabı "No". Ancak gerçekten ilgili bir geçmişiniz varsa dürüst olun — konsolosluk parmak izi ve kayıt bazlı kontrol yapar.',
    uyari: 'Bu sorulara yalan cevap vermek misrepresentation suçu oluşturur. ABD\'ye girişte 10+ yıl yasak getirebilir.',
  },
];

export default function Ds160Rehberi() {
  return (
    <BlogPostLayout post={POST} schema={SCHEMA}>

      <p className="text-slate-700 leading-relaxed text-base mb-6">
        DS-160 formu ABD vize başvurusunun bel kemiğidir. Yanlış veya eksik doldurulan bir
        form mülakattan önce redde yol açabilir; doldurma sırasında yapılan bir itiraf ise
        beklenmedik bir soruya kapı aralar. Bu rehber formu bölüm bölüm, Türkçe açıklamalarla
        inceliyor. Özellikle "tuzak" içeren kısımlara dikkat edin.
      </p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-800 text-sm mb-1">Başlamadan Önce Bilin</p>
          <ul className="text-amber-700 text-sm space-y-1">
            <li>• Form session-based'dir; 20 dakika işlem yapmazsanız oturum kapanır. Sık sık "Kaydet" tuşuna basın.</li>
            <li>• Application ID (AA ile başlayan) not alın — formu daha sonra sürdürmek için gerekir.</li>
            <li>• Chrome veya Firefox kullanın; IE/Edge ile form düzgün çalışmayabilir.</li>
            <li>• Form tüm cihazlarda aynı değil; kaydettiğiniz cihazdan devam edin.</li>
          </ul>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Bölüm Bölüm DS-160 Rehberi</h2>
      <div className="space-y-5 mb-10">
        {BOLUMLER.map(({ baslik, aciklama, uyari }) => (
          <div key={baslik} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-3">
              <p className="font-bold text-slate-800 text-sm">{baslik}</p>
            </div>
            <div className="p-4 text-sm text-slate-700 leading-relaxed space-y-2">
              <p>{aciklama}</p>
              {uyari && (
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-lg p-3 mt-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-amber-800 text-xs">{uyari}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">En Çok Hata Yapılan 5 Alan</h2>
      <div className="space-y-3 mb-8">
        {[
          { n: '1', b: 'Ad-soyad Türkçe karakter hatası', d: 'Pasaportunuzun latin sayfasındaki yazıma bakın ve formu buna göre doldurun. "İlhan" değil "ILHAN" yazılmalı.' },
          { n: '2', b: '"Have you ever been denied a U.S. visa?" sorusu', d: 'Daha önce ABD vizesi için reddedildiyseniz "Yes" deyin. Formdaki bu beyan mülakatta açıkça sorulur; tutarlı olun.' },
          { n: '3', b: 'Sosyal medya hesapları', d: '2019\'dan itibaren eklenen bu bölümde kullandığınız sosyal platformları (Instagram, Twitter vb.) listeleyin. Sahte hesap veya gizleme tespit edilirse ciddi sonuçlar doğar.' },
          { n: '4', b: 'Boşluklar', d: 'İş geçmişinde veya eğitimde boşluklar varsa (askerlik, hastalık, ev hanımlığı) "Explain the gaps" alanına kısaca açıklayın.' },
          { n: '5', b: 'Form submit etmeden "Sign" basmamak', d: 'Formu doldurup submit etmeyi unutmak çok yaygın bir hata. Submit edilmemiş form mülakatta geçersizdir. Onay barcod sayfasını yazdırın.' },
        ].map(({ n, b, d }) => (
          <div key={n} className="flex gap-3 text-sm">
            <span className="w-7 h-7 bg-red-100 text-red-700 rounded-full flex items-center justify-center font-bold shrink-0 text-xs mt-0.5">{n}</span>
            <div>
              <p className="font-semibold text-slate-800 mb-1">{b}</p>
              <p className="text-slate-600 leading-relaxed">{d}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Form Tamamlandıktan Sonra Yapılacaklar</h2>
      <ul className="space-y-2 mb-8">
        {[
          'Barkodlu onay sayfasını (confirmation page) yazdırın — bu sayfa olmadan mülakata giremezsiniz',
          'MRV ücretini ödeyin (2026 itibariyle non-immigrant için ~$185)',
          'CGI Federal sistemi üzerinden mülakat randevusu alın',
          'Randevu onay sayfasını ve DS-160 barkod sayfasını birlikte dosyalayın',
          'Mülakata 15 dakika erken gidin — biyometrik kayıt için süre gerekir',
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-blue-800 text-sm leading-relaxed">
          <strong>Formu güncelleme gerekirse:</strong> DS-160 submit edildikten sonra değiştirilemez.
          Ancak aynı Application ID ile yeni bir form açıp bilgileri güncelleyebilir, ardından
          yeni formu submit edebilirsiniz. Mülakatta hangi formun geçerli olduğunu belirtin
          (en son submitedilen geçerlidir).
        </p>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-8 flex gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-emerald-800 text-sm mb-1">Danışman İpucu: Çeviri Desteği</p>
          <p className="text-emerald-700 text-sm leading-relaxed">
            Form İngilizce ama yanıtlar Türkçe bilgiyi yansıtabilir (örn. şehir adları).
            Çeviri gereken alanlarda resmi Türkçe adını İngilizce karşılığıyla yazın:
            "İstanbul" → "Istanbul", "Trabzon Belediyesi" → "Trabzon Municipality" gibi.
            Büyük şehirlerin dünyaca bilinen İngilizce adları doğrudan kullanılabilir.
          </p>
        </div>
      </div>

      <div className="mt-12 bg-brand-50 border border-brand-200 rounded-2xl p-6">
        <h3 className="font-bold text-brand-900 mb-2">DS-160 Özeti: Dikkat, Tutarlılık, Dürüstlük</h3>
        <p className="text-brand-800 text-sm leading-relaxed">
          DS-160 formu sadece bir form değil; mülakata götürdüğünüz belgelerle çelişmemesi
          gereken bir taahhüttür. Oturum kapatmadan kaydedin, barkod sayfasını yazdırın ve
          güvenlik sorularına dürüst yanıt verin. Her şeyden önemlisi: formdaki bilgilerle
          mülakatınızdaki cevaplar örtüşsün. Bu formülü uygulayanlar büyük çoğunlukla mülakatı
          sorunsuz geçiyor.
        </p>
      </div>

    </BlogPostLayout>
  );
}
