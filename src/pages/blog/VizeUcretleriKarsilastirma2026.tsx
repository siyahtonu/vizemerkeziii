import React from 'react';
import { Info, DollarSign, TrendingDown, TrendingUp, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'vize-ucretleri-karsilastirma-2026',
  title: 'Vize Ücreti Karşılaştırması 2026: Tüm Ülkelerin Güncel Ücretleri',
  description: 'Schengen, ABD, İngiltere, Kanada, Dubai, Avustralya vize ücretleri 2026 güncel karşılaştırma. Hangi ülke en ucuz, hangisi en pahalı?',
  category: 'Genel',
  readingTime: 10,
  date: '2026-04-17',
  tags: ['vize ücretleri', 'başvuru bedeli', 'VFS ücret', '2026'],
};

const SCHENGEN_KALEMLER = [
  { kalem: 'Schengen vize ücreti (yetişkin)', ucret: '90 €', tl: '~3.870 TL' },
  { kalem: 'Schengen vize ücreti (6-12 yaş)', ucret: '45 €', tl: '~1.935 TL' },
  { kalem: 'VFS Global hizmet bedeli', ucret: '25-40 €', tl: '~1.075-1.720 TL' },
  { kalem: 'iDATA hizmet bedeli', ucret: '25-40 €', tl: '~1.075-1.720 TL' },
  { kalem: 'Seyahat sigortası (10 günlük)', ucret: '15-30 €', tl: '~645-1.290 TL' },
  { kalem: 'Yeminli tercüme (standart dosya)', ucret: '—', tl: '~500-1.200 TL' },
  { kalem: 'Fotoğraf (2 adet biyometrik)', ucret: '—', tl: '~100-200 TL' },
  { kalem: 'Kargo/kurye', ucret: '—', tl: '~80-150 TL' },
  { kalem: 'TOPLAM (yetişkin, standart)', ucret: '~150-200 €', tl: '~6.500-8.500 TL', toplam: true },
];

const ABD_KALEMLER = [
  { kalem: 'Başvuru ücreti (B1/B2 turist)', ucret: '185 USD', tl: '~7.770 TL' },
  { kalem: 'Başvuru ücreti (F-1 öğrenci)', ucret: '185 USD', tl: '~7.770 TL' },
  { kalem: 'Başvuru ücreti (H1B çalışma)', ucret: '205-780 USD', tl: '~8.610-32.760 TL' },
  { kalem: 'SEVIS ücreti (F/M vize)', ucret: '350 USD', tl: '~14.700 TL' },
  { kalem: 'Visa Integrity Fee (özel durumlar)', ucret: '250 USD', tl: '~10.500 TL' },
  { kalem: 'Mülakat fotoğrafı', ucret: '—', tl: '~100-200 TL' },
  { kalem: 'Ulaşım (Ankara/İstanbul)', ucret: '—', tl: '~500-2.000 TL' },
  { kalem: 'TOPLAM (turist)', ucret: '~185 USD', tl: '~8.500-10.000 TL', toplam: true },
  { kalem: 'TOPLAM (F-1 öğrenci)', ucret: '~535 USD', tl: '~23.000-25.000 TL', toplam: true },
];

const INGILTERE_TURLER = [
  { tur: 'Standart ziyaretçi vizesi (6 ay)', ucret: '115 £', tl: '~5.980 TL' },
  { tur: '2 yıllık ziyaretçi vizesi', ucret: '400 £', tl: '~20.800 TL' },
  { tur: '5 yıllık ziyaretçi vizesi', ucret: '771 £', tl: '~40.092 TL' },
  { tur: '10 yıllık ziyaretçi vizesi', ucret: '963 £', tl: '~50.076 TL' },
  { tur: 'Öğrenci vizesi', ucret: '490 £', tl: '~25.480 TL' },
  { tur: 'IHS (Öğrenci, yıllık)', ucret: '776 £', tl: '~40.352 TL' },
  { tur: 'Skilled Worker vizesi (3 yıl)', ucret: '769 £', tl: '~39.988 TL' },
  { tur: 'VFS hizmet bedeli', ucret: '~£60', tl: '~3.120 TL' },
];

const KANADA_TURLER = [
  { tur: 'Geçici Oturum Vizesi (TRV)', ucret: '100 CAD', tl: '~3.100 TL' },
  { tur: 'Study Permit (öğrenci)', ucret: '150 CAD', tl: '~4.650 TL' },
  { tur: 'Work Permit', ucret: '155 CAD', tl: '~4.805 TL' },
  { tur: 'Biyometri ücreti (kişi başı)', ucret: '85 CAD', tl: '~2.635 TL' },
  { tur: 'VFS hizmet bedeli', ucret: '~42 CAD', tl: '~1.302 TL' },
  { tur: 'Tıbbi muayene (uzun süreli)', ucret: '~250 CAD', tl: '~7.750 TL' },
  { tur: 'TOPLAM (turist)', ucret: '~227 CAD', tl: '~7.000-8.000 TL', toplam: true },
  { tur: 'TOPLAM (öğrenci)', ucret: '~527 CAD', tl: '~16.000-18.000 TL', toplam: true },
];

const DIGER_ULKELER = [
  { ulke: 'Dubai (BAE)', ucret: '375-475 AED', tl: '~3.800-4.800 TL' },
  { ulke: 'Avustralya', ucret: '195 AUD', tl: '~5.300 TL' },
  { ulke: 'Japonya', ucret: 'Ücretsiz (Türkler için)', tl: '0 TL' },
  { ulke: 'Güney Kore', ucret: 'Ücretsiz', tl: '0 TL' },
  { ulke: 'Rusya', ucret: '3.750 RUB', tl: '~1.700 TL' },
  { ulke: 'Çin', ucret: '25-145 USD', tl: '~1.050-6.090 TL' },
  { ulke: 'Hindistan (e-visa)', ucret: '10-25 USD', tl: '~420-1.050 TL' },
  { ulke: 'Güney Afrika', ucret: 'Ücretsiz (Türkler için)', tl: '0 TL' },
  { ulke: 'Mısır', ucret: '25 USD (kapıda)', tl: '~1.050 TL' },
];

const VIZESIZ_ULKELER = [
  'Avrupa: Sırbistan, Karadağ, Kosova, Arnavutluk, Bosna Hersek, Kuzey Makedonya',
  'Asya: Tayland, Malezya, Singapur, Endonezya, Güney Kore, Japonya',
  'Orta Asya: Azerbaycan, Kazakistan, Kırgızistan, Gürcistan',
  'Orta/Güney Amerika: Arjantin, Brezilya, Şili, Kolombiya, Peru',
  'Afrika: Fas, Tunus, Güney Afrika, Kenya (e-vize)',
];

const EN_UCUZ = [
  'Japonya: Ücretsiz',
  'Güney Kore: Ücretsiz',
  'Güney Afrika: Ücretsiz',
  'Hindistan: 10-25 USD e-vize',
  'Rusya: ~1.700 TL',
];

const EN_PAHALI = [
  'İngiltere (5 yıllık): ~40.000 TL',
  'İngiltere (10 yıllık): ~50.000 TL',
  'ABD (H1B): ~33.000 TL',
  'Kanada (öğrenci tam paket): ~20.000 TL',
  'ABD F-1 öğrenci (SEVIS dahil): ~25.000 TL',
];

const AILE_INDIRIM = [
  'Schengen: 6 yaş altı ücretsiz, 6-12 yaş 45 €',
  'İngiltere: Aile üyeleri için ayrı başvuru ama birleşik dosya',
  'ABD: Aile başvurularında ücret indirimi yok, her kişi 185 USD',
  'Dubai: 18 yaş altı bazı durumlarda indirimli',
];

const TASARRUF_IPUCLARI = [
  'Uzun süreli vizeleri tercih edin: Tek 5 yıllık Schengen, beş kere yıllık vize almaktan ucuzdur',
  'VIP/Premium hizmetlerden kaçının: Standart başvuru yeterlidir',
  'Kendi başvurunuzu yapın: Danışmanlık 2.000-5.000 TL ek maliyet',
  'Yeminli tercüme sadece gerekli belgeler için yapılmalı',
  'Sigortayı karşılaştırma sitelerinden alın (%30-40 tasarruf)',
  'Fotoğraf çektirmeyin, kendi çekip bastırın (standartlara uyuyorsa)',
];

const SSS = [
  {
    q: 'Vize ücreti red halinde iade edilir mi?',
    a: 'Hayır. Vize başvuru ücreti işlem ücretidir, onay garantisi değildir. Red halinde hiçbir kurum ücret iadesi yapmaz. VFS/iDATA hizmet bedelleri de iade edilmez.',
  },
  {
    q: 'Schengen vize ücreti nerede en ucuz?',
    a: 'Tüm Schengen ülkeleri aynı ücreti (90 €) alır. Fark yoktur. Hizmet bedelleri (VFS 25-40 €) de ülkeler arasında yakındır.',
  },
  {
    q: 'Çocuklar için vize ücreti ne kadar?',
    a: 'Schengen: 6-12 yaş 45 €, 6 yaş altı ücretsiz. ABD: 185 USD (her yaşta). İngiltere: yetişkinle aynı. Kanada: yetişkinle aynı.',
  },
  {
    q: 'Vize ücretini taksitle ödeyebilir miyim?',
    a: 'Hayır, resmi başvuru ücretleri peşin ödenmelidir. Ancak danışmanlık firmaları hizmet bedellerini taksitlendirme imkanı sunabilir.',
  },
  {
    q: 'Ücretsiz vize veren ülkeler var mı?',
    a: 'Evet. Türkiye ile vize muafiyeti anlaşması olan ülkelere vizesiz gidilir: Japonya, Güney Kore, Güney Afrika, Malezya, Tayland ve daha birçok ülke.',
  },
  {
    q: 'Kur değiştiğinde vize ücreti değişir mi?',
    a: 'Konsolosluk ücretleri genellikle Euro/USD/GBP cinsinden sabittir. TL değiştiğinde TL karşılığı değişir. Ödeme anında güncel kur uygulanır.',
  },
];

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
      '@type': 'FAQPage',
      mainEntity: SSS.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    },
  ],
};

function KalemTable({ rows, headers }: { rows: any[]; headers: [string, string, string] }) {
  return (
    <div className="overflow-x-auto mb-6">
      <table className="min-w-full text-sm border border-slate-200 rounded-xl overflow-hidden">
        <thead className="bg-brand-50">
          <tr>
            <th className="text-left px-4 py-3 font-semibold text-slate-900">{headers[0]}</th>
            <th className="text-left px-4 py-3 font-semibold text-slate-900">{headers[1]}</th>
            <th className="text-left px-4 py-3 font-semibold text-slate-900">{headers[2]}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {rows.map((r, i) => (
            <tr key={i} className={r.toplam ? 'bg-emerald-50 font-semibold' : 'hover:bg-slate-50'}>
              <td className="px-4 py-3 text-slate-800">{r.kalem ?? r.tur ?? r.ulke}</td>
              <td className="px-4 py-3 text-slate-700">{r.ucret}</td>
              <td className="px-4 py-3 text-slate-700">{r.tl}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function VizeUcretleriKarsilastirma2026() {
  return (
    <BlogPostLayout post={POST} schema={SCHEMA}>
      <p className="text-slate-700 leading-relaxed text-base mb-6">
        Vize başvurusu planlıyorsunuz ama bütçenizi nasıl planlayacağınızı bilmiyor musunuz?
        Schengen 90 €, İngiltere 115 £, Kanada 100 CAD diye rakamları internette görüyorsunuz, ama
        gerçek maliyet bundan fazla. VFS/iDATA hizmet bedeli, sigorta, tercüme, randevu ücreti gibi
        kalemler ekleniyor. Bu rehberde 2026 yılı için tüm ülkelerin gerçek toplam vize maliyetini
        karşılaştırmalı olarak sunuyoruz.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Schengen Vize Ücretleri 2026</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Schengen vize ücreti 2024 Haziran'da 80 €'dan 90 €'ya yükseldi ve 2026 itibarıyla da bu
        seviyede. Ancak "vize ücreti" tek başına yeterli maliyet hesabı değil:
      </p>
      <KalemTable rows={SCHENGEN_KALEMLER} headers={['Kalem', 'Ücret (2026)', 'TL Karşılığı (Kur: 43 TL/€)']} />
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-amber-900 text-sm leading-relaxed">
          <strong>Ek hizmetler için ekstra maliyetler:</strong> Premium randevu hizmeti 300-800 TL,
          VIP paketleme 500-1.500 TL, danışmanlık 2.000-5.000 TL, kapıda teslim 300-700 TL.
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">ABD Vize Ücreti 2026</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        ABD vize ücreti 2023'te 160 USD'den 185 USD'ye yükseldi. 2025-2026 itibarıyla da 185 USD
        seviyesinde. Ancak yeni "Visa Integrity Fee" (vize bütünlük ücreti) 250 USD ek maliyetle
        gelebilir (özel durumlar için).
      </p>
      <KalemTable rows={ABD_KALEMLER} headers={['Kalem', 'Ücret (2026)', 'TL Karşılığı (Kur: 42 TL/USD)']} />

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">İngiltere Vize Ücreti 2026</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        İngiltere vize ücretleri 2026'da güncellendi. Kısa süreli ziyaret (6 ay) 115 £, uzun süreli
        2 yıllık 400 £, öğrenci vizesi ise hem başvuru hem IHS (sağlık surcharge) maliyeti içerir.
      </p>
      <KalemTable rows={INGILTERE_TURLER} headers={['Vize Türü', 'Ücret (2026)', 'TL Karşılığı (Kur: 52 TL/£)']} />
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 flex gap-3">
        <DollarSign className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-blue-900 text-sm leading-relaxed">
          <strong>İngiltere öğrenci vizesi toplam maliyeti</strong> (1 yıllık program için): 490 £
          başvuru + 776 £ IHS + 60 £ VFS = yaklaşık 1.326 £ (~69.000 TL).
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Kanada Vize Ücreti 2026</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Kanada vize ücretleri nispeten uygun ama ek biyometri ve işlem ücretleri vardır:
      </p>
      <KalemTable rows={KANADA_TURLER} headers={['Vize Türü', 'Ücret (2026)', 'TL Karşılığı (Kur: 31 TL/CAD)']} />

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Diğer Popüler Ülke Ücretleri</h2>
      <KalemTable rows={DIGER_ULKELER} headers={['Ülke', 'Turistik Vize Ücreti', 'TL Karşılığı']} />

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Vizesiz Gidilen Ülkeler (Ücret Yok)</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Bazı ülkelere Türk pasaportuyla vizesiz gidebilirsiniz — hiçbir vize ücreti ödemeden:
      </p>
      <ul className="space-y-2 mb-8">
        {VIZESIZ_ULKELER.map((v) => (
          <li key={v} className="flex gap-2 text-slate-700">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <span>{v}</span>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">En Ucuz ve En Pahalı Ülkeler</h2>
      <div className="grid gap-4 sm:grid-cols-2 mb-8">
        <div className="border border-emerald-200 rounded-xl p-5 bg-emerald-50">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-slate-900">En Ucuz 5 Vize</h3>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-slate-700 text-sm">
            {EN_UCUZ.map((u) => (
              <li key={u}>{u}</li>
            ))}
          </ol>
        </div>
        <div className="border border-red-200 rounded-xl p-5 bg-red-50">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-slate-900">En Pahalı 5 Vize</h3>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-slate-700 text-sm">
            {EN_PAHALI.map((u) => (
              <li key={u}>{u}</li>
            ))}
          </ol>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Aile Başvurusu İndirimleri</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Bazı ülkeler aile başvurularında indirim veya muafiyet uygular:
      </p>
      <ul className="space-y-2 mb-8">
        {AILE_INDIRIM.map((a) => (
          <li key={a} className="flex gap-2 text-slate-700">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <span>{a}</span>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Vize Masraflarını Düşürme İpuçları</h2>
      <ol className="list-decimal list-inside space-y-2 text-slate-700 mb-8 pl-2">
        {TASARRUF_IPUCLARI.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ol>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Sık Sorulan Sorular (SSS)</h2>
      <div className="space-y-4 mb-10">
        {SSS.map((item) => (
          <div key={item.q} className="border border-slate-200 rounded-xl p-5 bg-white">
            <h3 className="font-semibold text-slate-900 mb-2">{item.q}</h3>
            <p className="text-slate-700 text-sm leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>
    </BlogPostLayout>
  );
}
