import React from 'react';
import { Info, DollarSign, TrendingDown, AlertTriangle } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'vize-ucretleri-karsilastirma-2026',
  title: 'Vize Ücretleri Karşılaştırması 2026 — Ülke Bazlı Tam Liste',
  description: 'Türk vatandaşları için 2026 güncel vize ücretleri: Schengen, İngiltere, ABD, Kanada, Dubai ve diğer ülkelerin başvuru bedelleri, VFS hizmet ücretleri ve gizli masraflar.',
  category: 'Genel',
  readingTime: 8,
  date: '2026-04-17',
  tags: ['vize ücretleri', 'başvuru bedeli', 'VFS ücret', '2026'],
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

const UCRETLER = [
  { ulke: 'Schengen (Tüm ülkeler)', resmi: '€90', vfs: '€30-40', toplam: '~€120-130 (3.900 TL)', not: 'Nisan 2024\'te €80\'den €90\'a yükseldi. 6-12 yaş arası €45.' },
  { ulke: 'İngiltere (Standard Visitor)', resmi: '£127', vfs: '£0 (premium £72)', toplam: '~£127 (4.100 TL)', not: '6 ay geçerli. 2 yıl: £475, 5 yıl: £848, 10 yıl: £1.059.' },
  { ulke: 'ABD (B1/B2)', resmi: '$185', vfs: '$0', toplam: '~$185 (5.900 TL)', not: '2023 sonrası $160\'tan $185\'e yükseldi. Mülakat sonrası iade edilmez.' },
  { ulke: 'ABD (F-1 öğrenci)', resmi: '$185 + $350 SEVIS', vfs: '$0', toplam: '~$535 (17.000 TL)', not: 'SEVIS ücreti I-901 formuyla ayrı ödenir.' },
  { ulke: 'Kanada (TRV)', resmi: 'CAD 100', vfs: 'CAD 85 (biyometrik)', toplam: '~CAD 185 (5.000 TL)', not: 'Aile başvurusu max CAD 500.' },
  { ulke: 'Kanada (eTA)', resmi: 'CAD 7', vfs: '-', toplam: '~CAD 7 (170 TL)', not: 'Türk pasaportu uygun değil, vize gerekli.' },
  { ulke: 'Dubai (30 gün)', resmi: '$90', vfs: '-', toplam: '~$90 (2.900 TL)', not: 'Emirates uçuş paketi ile daha ucuz olabilir.' },
  { ulke: 'Rusya (Turistik)', resmi: '€35', vfs: '€25', toplam: '~€60 (1.950 TL)', not: 'Davet mektubu (voucher) gerekli.' },
  { ulke: 'Çin (L vizesi)', resmi: '€60', vfs: '€55', toplam: '~€115 (3.700 TL)', not: 'Davet mektubu veya otel rezervasyonu zorunlu.' },
  { ulke: 'Japonya', resmi: 'Ücretsiz', vfs: '€15', toplam: '~€15 (500 TL)', not: 'Türkler için tek giriş vizesi ücretsiz (2023-2026 kampanya).' },
  { ulke: 'Avustralya (Visitor)', resmi: 'AUD 190', vfs: '-', toplam: '~AUD 190 (4.200 TL)', not: 'Online başvuru, biyometrik alınır.' },
  { ulke: 'Yeni Zelanda', resmi: 'NZD 291', vfs: '-', toplam: '~NZD 291 (5.800 TL)', not: 'IVL (turizm vergisi) NZD 35 ek.' },
];

const COCUK_INDIRIMLI = [
  { ulke: 'Schengen (6-12 yaş)', ucret: '€45' },
  { ulke: 'Schengen (6 yaş altı)', ucret: 'Ücretsiz' },
  { ulke: 'İngiltere (çocuk için aynı)', ucret: '£127' },
  { ulke: 'ABD (çocuk için aynı)', ucret: '$185' },
];

export default function VizeUcretleriKarsilastirma2026() {
  return (
    <BlogPostLayout post={POST} schema={SCHEMA}>
      <p className="text-slate-700 leading-relaxed text-base mb-6">
        2026 itibarıyla Türk vatandaşları için vize ücretleri son 10 yılın en yüksek seviyesinde.
        Schengen €80'den €90'a, ABD $160'tan $185'e, İngiltere £100'den £127'ye yükseldi. Vize
        bedeli pasaport harcından daha yüksek olabiliyor. Bu rehber tüm büyük ülkelerin 2026
        güncel ücretlerini, VFS hizmet bedellerini ve "gizli masrafları" tek listede sunar.
      </p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-amber-900 text-sm leading-relaxed">
          <strong>Önemli:</strong> Ret aldığınızda vize ücreti iade edilmez. Başvuru masrafı =
          risk sermayesi. Belgelerinizi iyi hazırlayıp onay alma olasılığını artırmak uzun vadede
          daha ucuzdur.
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">1. Tam Ülke Karşılaştırma Tablosu</h2>
      <div className="space-y-2 mb-8">
        {UCRETLER.map(({ ulke, resmi, vfs, toplam, not }) => (
          <div key={ulke} className="bg-white border border-slate-200 rounded-xl p-4 text-sm">
            <div className="flex justify-between items-start mb-2">
              <p className="font-semibold text-slate-800">{ulke}</p>
              <span className="text-brand-700 font-bold text-xs shrink-0 ml-2">{toplam}</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-2 text-slate-600 text-xs mb-1">
              <p><span className="font-medium">Resmi:</span> {resmi}</p>
              <p><span className="font-medium">VFS:</span> {vfs}</p>
            </div>
            <p className="text-slate-500 text-xs italic">{not}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">2. Çocuk ve İndirimli Başvurular</h2>
      <div className="space-y-2 mb-6">
        {COCUK_INDIRIMLI.map(({ ulke, ucret }) => (
          <div key={ulke} className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex justify-between text-sm">
            <p className="text-slate-700">{ulke}</p>
            <span className="font-bold text-emerald-700">{ucret}</span>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">3. Gizli Masraflar</h2>
      <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6">
        <p className="font-semibold text-red-900 text-sm mb-2">Vize ücretinin üstüne eklenen "gizli" bedeller:</p>
        <ul className="text-red-800 text-sm space-y-1">
          <li>• Seyahat sağlık sigortası: 300-800 TL (zorunlu)</li>
          <li>• Biyometrik fotoğraf: 50-100 TL</li>
          <li>• Tercüme (gerekirse): 150-300 TL / belge</li>
          <li>• Kargo (pasaport teslimi): 100-200 TL</li>
          <li>• Premium randevu / acele: €40-200 ek</li>
          <li>• VFS VIP lounge: €50-100 ek</li>
          <li>• SMS/e-posta bildirim: €5-10</li>
        </ul>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">4. En Ucuz / En Pahalı Başvurular</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
          <p className="font-semibold text-emerald-900 text-sm mb-2">💰 En ucuz (Türk pasaportuyla)</p>
          <ul className="text-emerald-800 text-sm space-y-1">
            <li>• Japonya: ~500 TL (ücretsiz + VFS)</li>
            <li>• Rusya: ~1.950 TL</li>
            <li>• Dubai: ~2.900 TL</li>
            <li>• Çin: ~3.700 TL</li>
          </ul>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <p className="font-semibold text-red-900 text-sm mb-2">💸 En pahalı</p>
          <ul className="text-red-800 text-sm space-y-1">
            <li>• ABD F-1 öğrenci: ~17.000 TL</li>
            <li>• Yeni Zelanda: ~5.800 TL</li>
            <li>• ABD turist: ~5.900 TL</li>
            <li>• Kanada: ~5.000 TL</li>
          </ul>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">5. Tasarruf İpuçları</h2>
      <div className="space-y-3 mb-8">
        {[
          { b: 'Aile başvurusu', d: 'Kanada\'da aile başvurusu maksimum CAD 500\'dür — tek kişi CAD 185 düşünülürse 3+ kişilik ailede büyük tasarruf.' },
          { b: 'Multiple-entry tercihi', d: 'İngiltere 6 ay £127, 2 yıl £475. Sık gidiyorsanız 2 yıllık seçenek kullanıcı başına ucuzdur.' },
          { b: 'Schengen 5 yıllık kazanımı', d: 'Cascade Rule ile zamanla 5 yıllık multi-entry kazanılır; her başvuru için €90 ödemekten kurtulursunuz.' },
          { b: 'Acele işleme dikkat', d: 'Premium/express hizmet €50-200 ek getirir ve garanti vermez. Normal süreyi planlayın.' },
          { b: 'Kendi sigortanızı karşılaştırın', d: 'VFS\'nin sunduğu sigorta genelde pahalıdır. Allianz, Acıbadem gibi şirketler %40 daha ucuzdur.' },
        ].map(({ b, d }) => (
          <div key={b} className="bg-white border border-slate-200 rounded-xl p-4 text-sm">
            <p className="font-semibold text-slate-800 mb-1">{b}</p>
            <p className="text-slate-600">{d}</p>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8 flex gap-3">
        <TrendingDown className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-blue-900 text-sm mb-1">Döviz Dalgalanması Etkisi</p>
          <p className="text-blue-800 text-sm leading-relaxed">
            Vize ücretleri genelde dövizle (€, $, £) hesaplanır, TL değerine endeksli değildir.
            Euro 2024 başında 33 TL iken 2026 nisanında 44 TL'ye ulaştı — yani aynı vize ücreti
            2 yılda %33 zamlandı. Mümkünse başvurunuzu kur düşükken planlayın.
          </p>
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-8 flex gap-3">
        <DollarSign className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-emerald-800 text-sm mb-1">Danışman İpucu</p>
          <p className="text-emerald-700 text-sm leading-relaxed">
            Vize ücretlerinin yıllık ortalama %8-12 zam alması beklentisi var. 2026'da başvuru
            yapacaksanız şu sırayı önerdik: önce Schengen (€90, 5 yıllık multi-entry\'ye
            ulaşılabilir) → sonra İngiltere (£127, 10 yıllık ekonomik) → son ABD ($185, en pahalı).
          </p>
        </div>
      </div>

      <div className="mt-12 bg-brand-50 border border-brand-200 rounded-2xl p-6">
        <h3 className="font-bold text-brand-900 mb-2">Özet</h3>
        <p className="text-brand-800 text-sm leading-relaxed">
          2026'da ortalama bir Schengen başvurusu tüm masraflarıyla ~4.500 TL'ye mal olur; ABD
          mülakatsız + SEVIS ile öğrenci başvurusu 17.000 TL'ye çıkar. Ret durumunda iade olmaz;
          bu yüzden belgeleri iyi hazırlamak en büyük tasarruf. Sık seyahat edenler multi-entry
          vize tercih ederek uzun vadede ciddi kazanç sağlar.
        </p>
      </div>
    </BlogPostLayout>
  );
}
