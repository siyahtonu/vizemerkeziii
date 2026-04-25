import React from 'react';
import { CheckCircle2, AlertTriangle, FileText, Info } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'schengen-vizesi-gerekli-belgeler-2026',
  title: 'Schengen Vizesi Gerekli Belgeler 2026 | Çalışan, Öğrenci, Emekli',
  description: 'Schengen vizesi için gereken tüm belgelerin profil bazlı listesi. Çalışan, öğrenci, emekli, ev hanımı için özel evrak rehberi.',
  category: 'Schengen',
  readingTime: 11,
  date: '2026-04-17',
  tags: ['Schengen belgeleri', 'vize belgeleri', 'kontrol listesi', '2026'],
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
        { '@type': 'Question', name: 'Belgelerin hepsi İngilizce mi olmalı?', acceptedAnswer: { '@type': 'Answer', text: 'Hayır, tüm belgeler Türkçe olabilir ancak resmi yeminli tercüme İngilizce versiyonu sunulması güçlü şekilde tavsiye edilir. Bazı konsolosluklar çeviri zorunluluğu aramaz, bazıları arar.' } },
        { '@type': 'Question', name: 'Tercüman olmadan belgelerimi nasıl çevirebilirim?', acceptedAnswer: { '@type': 'Answer', text: 'Resmi başvurularda mutlaka yeminli tercüman kullanılmalıdır. Google Translate veya kendi çeviriniz kabul edilmez. İstanbul ve Ankara\'da yeminli tercümanlık hizmetleri kolayca bulunabilir.' } },
        { '@type': 'Question', name: 'Belgelerimin hepsi eksiksiz ama yine de reddedildim, neden?', acceptedAnswer: { '@type': 'Answer', text: 'Belgeler tek başına yeterli değildir; belgelerin tutarlılığı da önemlidir. Başvuru formu, banka dökümü, seyahat planı birbiriyle uyumlu olmalıdır. Tutarsızlıklar red sebebidir.' } },
        { '@type': 'Question', name: 'Noter onayı tüm belgelere gerekli mi?', acceptedAnswer: { '@type': 'Answer', text: 'Hayır. Sadece sponsor dilekçesi, muvafakatname, vekaletname gibi resmi taahhüt içeren belgeler için noter onayı gerekir. Çalışma belgesi, maaş bordrosu gibi şirket belgeleri için şirket kaşesi yeterlidir.' } },
        { '@type': 'Question', name: 'Seyahat sigortası poliçesini nereden almalıyım?', acceptedAnswer: { '@type': 'Answer', text: 'Güvenilir, Schengen bölgesi tarafından tanınan büyük şirketlerden almalısınız: Allianz, AXA, Mapfre, AK Sigorta, Türkiye Sigorta. 30.000 € kapsamı ve acil tıbbi müdahale koşulu olduğundan emin olun.' } },
        { '@type': 'Question', name: 'Belge dosyasını nasıl düzenlemeliyim?', acceptedAnswer: { '@type': 'Answer', text: 'Standart sıra: başvuru formu, pasaport, fotoğraf, seyahat sigortası, uçak rezervasyonu, otel rezervasyonu, banka dökümü, çalışma belgesi, maaş bordrosu, ek belgeler. Hepsi ayrı plastik poşetlerde, düzenli olmalıdır.' } },
      ],
    },
  ],
};

const STANDART_BELGELER = [
  { t: '1. Pasaport', items: ['En az 6 ay geçerli (seyahat bitiş tarihinden sonra)', 'Minimum 2 boş sayfa', 'Son 10 yıl içinde alınmış olmalı', 'İyi durumda, yırtılmamış, sayfası eksik olmayan'] },
  { t: '2. Biyometrik Fotoğraf', items: ['Boyut: 35mm x 45mm', 'Arka plan: Beyaz', 'Son 6 ay içinde çekilmiş', 'Gözlüksüz (sağlık gerekmedikçe), doğal ifade', '2 adet (1 forma yapıştırılır, 1 yedek)'] },
  { t: '3. Vize Başvuru Formu', items: ['Online (genellikle) veya matbu', 'İngilizce veya seyahat edilecek ülkenin dilinde doldurulmuş', 'Tüm alanlar eksiksiz (boş bırakılan alan ret sebebi olabilir)', 'Son sayfada başvurucunun imzası'] },
  { t: '4. Seyahat Sağlık Sigortası', items: ['Minimum 30.000 € teminat', 'Tüm Schengen ülkelerini kapsayan', 'Seyahat süresini tam karşılayan tarih aralığı', 'Acil tıbbi müdahale, hastaneye nakil, ölüm halinde memlekete gönderme kapsamı'] },
  { t: '5. Uçak Rezervasyonu', items: ['Gidiş-dönüş (round-trip) rezervasyonu', 'Ad, soyad, tarih, uçuş numarası görünür olmalı', 'Bilet almak zorunlu değil — sadece rezervasyon yeterli', 'Opsiyonlu rezervasyon (seyahat acentesinden) kabul edilir'] },
  { t: '6. Konaklama Belgesi', items: ['Otel rezervasyonu (Booking.com, Hotels.com gibi)', 'İptal edilebilir olması önerilir', 'Tüm seyahat süresini kapsamalı', 'Davet üzerine kalacaksanız: resmi davet mektubu (Einladung vb.)'] },
  { t: '7. Seyahat Planı (Itinerary)', items: ['Gün gün detaylı program', 'Hangi şehirde hangi tarihte kalacağınız', 'Ziyaret edilecek yerler, turistik aktiviteler', 'Tavsiye edilen format: PDF, 1-2 sayfa'] },
  { t: '8. Banka Hesap Dökümü', items: ['Son 3-6 aylık, bankanın resmi antetli kağıdında', 'İmzalı ve kaşeli (şube tarafından onaylı)', 'Minimum önerilen bakiye: günlük 60-100 € × seyahat süresi × 1,5'] },
];

const PROFILLER = [
  {
    ulke: 'Çalışanlar İçin Ek Belgeler', renk: 'blue', items: [
      'Çalışma belgesi: Şirketin antetli kağıdında, pozisyon, başlangıç tarihi, maaş bilgisi içeren',
      'Son 3 aylık maaş bordroları: İmzalı ve kaşeli orijinal veya onaylı kopyalar',
      'SGK hizmet dökümü: SGK e-Devlet üzerinden alınmış son 12 ay',
      'İzin yazısı: İşveren tarafından izin tarihlerinizin onaylandığına dair yazı',
      'Vergi levhası: Şirket sahibi/serbest meslek sahibi iseniz',
    ],
  },
  {
    ulke: 'Öğrenciler İçin Ek Belgeler', renk: 'emerald', items: [
      'Öğrenci belgesi: Üniversite/lisenin son 1 ay içinde vermiş olduğu resmi belge',
      'Transkript: Güncel dönem not durumunu gösteren belge',
      'Ebeveyn sponsor dilekçesi: Noter onaylı, masrafları karşılama taahhüdü',
      'Ebeveynin finansal belgeleri: Banka dökümü, çalışma belgesi, maaş bordrosu',
      'Aile bağları: Vukuatlı nüfus kayıt örneği',
      'Seyahat amacı belgesi: Erasmus kabul mektubu, dil okulu kaydı vb. (varsa)',
    ],
  },
  {
    ulke: 'Emekliler İçin Ek Belgeler', renk: 'amber', items: [
      'Emekli maaş belgesi: SGK/Bağ-Kur\'dan alınmış son 3 aylık gelir belgesi',
      'Emekli kimlik kartı: Fotokopisi',
      'Emeklilik yazısı: İlk emeklilik tarihi ve kurumu gösteren',
      'Tapu belgeleri: Mülkleriniz için',
      'Ek gelir belgeleri: Kira geliri, temettü vb. varsa',
    ],
  },
  {
    ulke: 'Ev Hanımları İçin Ek Belgeler', renk: 'pink', items: [
      'Eş sponsor dilekçesi: Noter onaylı, tüm masrafları karşılama taahhüdü',
      'Eşin çalışma belgesi: İşvereni tarafından antetli kağıtta',
      'Eşin maaş bordroları: Son 3 aylık',
      'Eşin banka dökümü: Son 6 aylık',
      'Evlilik cüzdanı fotokopisi: Akrabalık bağını kanıtlar',
      'Varsa çocuğun okul belgesi: Türkiye\'deki yaşamınızın kanıtı',
    ],
  },
  {
    ulke: 'Serbest Meslek Sahipleri İçin Ek Belgeler', renk: 'slate', items: [
      'Vergi levhası: Güncel tarihli, onaylı',
      'Oda kaydı: Mesleki oda (SMMM, tabip, avukat vb.) üyelik belgesi',
      'Son 1 yıllık vergi beyannamesi: Gelir durumunu gösterir',
      'Şirket banka hesap dökümü: Eğer şirket hesabı varsa',
      'Bireysel banka hesap dökümü: Son 6 ay',
      'Faaliyet gösterdiğinizin kanıtı: Fatura örnekleri, müşteri sözleşmeleri',
    ],
  },
  {
    ulke: 'Şirket Sahipleri İçin Ek Belgeler', renk: 'indigo', items: [
      'Ticaret sicil gazetesi: Şirket sahipliğini gösteren',
      'İmza sirküleri: Noter onaylı',
      'Şirket vergi levhası: Güncel',
      'Şirket faaliyet belgesi: Ticaret Odası\'ndan',
      'Son 1 yıl kurumlar vergi beyannamesi: Şirketin ciro durumunu gösterir',
      'Kendine ait maaş bordrosu: Şirketinizden aldığınız maaşı gösteren',
    ],
  },
];

export default function SchengenGerekliBelgeler2026() {
  return (
    <BlogPostLayout post={POST} schema={SCHEMA}>
      <p className="text-slate-700 leading-relaxed text-base mb-6">
        Schengen vize başvurusunun <strong>%70'i evrak aşamasında belirlenir</strong>. Doğru
        belgelerle gelen başvurucunun mülakatta sorun yaşama ihtimali %90 azalır. Bu rehber,
        tüm profiller için eksiksiz bir Schengen belge listesini içeriyor. Sadece "standart
        liste" değil, her profil için özelleştirilmiş belgeleri adım adım anlatıyoruz.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Herkes İçin Zorunlu Standart Belgeler</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Profiliniz ne olursa olsun, aşağıdaki belgeler tüm Schengen başvurularında zorunludur:
      </p>
      <div className="space-y-4 mb-8">
        {STANDART_BELGELER.map(({ t, items }) => (
          <div key={t} className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-600" /> {t}
            </p>
            <ul className="space-y-1 pl-6">
              {items.map((i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-1" /> {i}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {PROFILLER.map(({ ulke, items }) => (
        <React.Fragment key={ulke}>
          <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">{ulke}</h2>
          <ul className="space-y-2 mb-6">
            {items.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                {b}
              </li>
            ))}
          </ul>
        </React.Fragment>
      ))}

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Davet Üzerine Gidiyorsanız</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Akraba veya arkadaş davetiyle gidiyorsanız, normal turistik belgeler yerine davet
        belgeleri gerekir:
      </p>
      <ul className="space-y-2 mb-8">
        {[
          'Resmi davet mektubu: Almanya için Verpflichtungserklärung, Hollanda için Garantverklaring gibi',
          'Davet edenin kimlik belgesi: AB vatandaşı ise kimlik kartı, değilse oturum izni',
          'Davet edenin mali belgeleri: Çalışma belgesi, maaş bordrosu, banka dökümü',
          'Akrabalık bağı: Nüfus kaydı, evlilik belgesi, doğum belgesi',
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Tüm Belgelerin Ortak Kuralları</h2>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <ol className="text-amber-900 text-sm space-y-2 list-decimal list-inside">
          <li>Belgeler orijinal veya noter onaylı fotokopi olmalıdır</li>
          <li>Türkçe belgelerin resmi İngilizce çevirisi sunulmalıdır (yeminli tercüman)</li>
          <li>Tüm belgeler son 3 ay içinde alınmış olmalıdır</li>
          <li>Fotokopi kalitesi yüksek olmalı, okunaklı olmalıdır</li>
          <li>Belge sıralaması başvuru formunda belirtilen sıraya göre düzenlenmelidir</li>
          <li>Eksik belge, otomatik red sebebidir — listeyi baş harfine kadar takip edin</li>
        </ol>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Sık Sorulan Sorular (SSS)</h2>
      <div className="space-y-4 mb-8">
        {[
          { q: 'Belgelerin hepsi İngilizce mi olmalı?', a: 'Hayır, tüm belgeler Türkçe olabilir ancak resmi yeminli tercüme İngilizce versiyonu sunulması güçlü şekilde tavsiye edilir. Bazı konsolosluklar (Hollanda, Almanya) çeviri zorunluluğu arar, bazıları aramaz.' },
          { q: 'Tercüman olmadan belgelerimi nasıl çevirebilirim?', a: 'Resmi başvurularda mutlaka yeminli tercüman kullanılmalıdır. Google Translate veya kendi çeviriniz kabul edilmez. İstanbul ve Ankara\'da yeminli tercümanlık hizmetleri kolayca bulunabilir.' },
          { q: 'Belgelerimin hepsi eksiksiz ama yine de reddedildim, neden?', a: 'Belgeler tek başına yeterli değildir; belgelerin tutarlılığı da önemlidir. Başvuru formu, banka dökümü, seyahat planı birbiriyle uyumlu olmalıdır. Tutarsızlıklar red sebebidir.' },
          { q: 'Noter onayı tüm belgelere gerekli mi?', a: 'Hayır. Sadece sponsor dilekçesi, muvafakatname, vekaletname gibi resmi taahhüt içeren belgeler için noter onayı gerekir. Çalışma belgesi, maaş bordrosu gibi şirket belgeleri için şirket kaşesi yeterlidir.' },
          { q: 'Seyahat sigortası poliçesini nereden almalıyım?', a: 'Güvenilir, Schengen bölgesi tarafından tanınan büyük şirketlerden almalısınız: Allianz, AXA, Mapfre, AK Sigorta, Türkiye Sigorta. Ucuz internet poliçeleri bazen kabul edilmez — 30.000 € kapsamı ve acil tıbbi müdahale koşulu olduğundan emin olun.' },
          { q: 'Belge dosyasını nasıl düzenlemeliyim?', a: 'Standart sıra: başvuru formu, pasaport, fotoğraf, seyahat sigortası, uçak rezervasyonu, otel rezervasyonu, banka dökümü, çalışma belgesi, maaş bordrosu, ek belgeler. Hepsi ayrı plastik poşetlerde, düzenli olmalıdır.' },
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
        <FileText className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-brand-900 mb-2">Özet</h3>
          <p className="text-brand-800 text-sm leading-relaxed">
            Schengen başvurusunda tam belge seti onayın %70'ini belirler. 8 standart zorunlu
            belge + profilinize özel ek belgeler + tutarlılık üçlüsüyle başvurunuz güçlenir.
            Tüm belgeler son 3 ay içinde alınmış, yeminli tercümeyle desteklenmiş, orijinal
            veya noter onaylı olmalıdır.
          </p>
        </div>
      </div>
    </BlogPostLayout>
  );
}
