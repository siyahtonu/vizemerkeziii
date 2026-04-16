import React, { useState, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, ChevronRight, Tag, Search, X } from 'lucide-react';
import { SEO } from '../../components/SEO';
import Footer from '../../components/Footer';

// ── Blog yazısı meta verisi ─────────────────────────────────────────────────
export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  readingTime: number; // dakika
  date: string;        // "YYYY-AA-GG"
  tags: string[];
}

// ── Yayınlanan blog yazıları (yeni yazı eklendiğinde buraya ekle) ──────────
export const BLOG_POSTS: BlogPost[] = [
  // ── Demografik & Meslek ─────────────────────────────────────────────────
  {
    slug: 'ev-hanimi-italya-schengen-vizesi',
    title: 'Çalışmayan Ev Hanımları için İtalya Schengen Vizesi Nasıl Alınır? (2026 Rehberi)',
    description: 'Gelir belgesi olmayan ev hanımları için İtalya Schengen vizesi başvurusunda eş geliri, sponsor belgeleri ve banka ekstresi nasıl hazırlanır?',
    category: 'Schengen',
    readingTime: 8,
    date: '2026-04-16',
    tags: ['ev hanımı', 'İtalya vizesi', 'Schengen', 'sponsor'],
  },
  {
    slug: 'freelance-ingiltere-vize-basvurusu',
    title: 'Şahıs Şirketi Olmayan Freelance Çalışanlar İçin İngiltere Vize Başvurusu (2026)',
    description: 'Vergi kaydı veya şahıs şirketi olmadan freelance geliriyle İngiltere Standard Visitor vizesi nasıl alınır? Gerekli belgeler ve banka ekstresi stratejisi.',
    category: 'İngiltere',
    readingTime: 9,
    date: '2026-04-16',
    tags: ['freelance', 'İngiltere vizesi', 'UK visitor visa'],
  },
  {
    slug: 'ogrenci-sponsorsuz-amerika-turist-vizesi',
    title: 'Öğrenciler için Sponsorsuz Amerika Turist Vizesi (B-2) Alma Rehberi 2026',
    description: 'Kendi başına başvuran üniversite öğrencileri için ABD B-2 turist vizesi: DS-160, mülakat taktikleri ve Türkiye bağını güçlendirme.',
    category: 'ABD',
    readingTime: 10,
    date: '2026-04-16',
    tags: ['öğrenci', 'Amerika vizesi', 'B-2', 'turist vizesi'],
  },
  {
    slug: 'emekli-yunanistan-kapi-vizesi-2026',
    title: 'Emekliler için Yunanistan Kapı Vizesi: Gerekli Evraklar ve Püf Noktalar 2026',
    description: 'Schengen vizesi olmayan Türk emekliler için Yunanistan adaları kapı vizesi süreci, gerekli belgeler ve dikkat edilmesi gerekenler.',
    category: 'Schengen',
    readingTime: 7,
    date: '2026-04-16',
    tags: ['emekli', 'Yunanistan', 'kapı vizesi', 'border visa'],
  },
  // ── Sorun & Çözüm ──────────────────────────────────────────────────────
  {
    slug: 'schengen-reddi-madde-8-itiraz',
    title: 'Schengen Vizesi Reddi (Madde 8) Ne Anlama Gelir? İtiraz Dilekçesi Nasıl Yazılır?',
    description: 'Schengen vize ret yazısındaki hukuki gerekçe kodlarını, özellikle Madde 8\'i anlıyoruz; ardından itiraz dilekçesi nasıl yazılır.',
    category: 'Schengen',
    readingTime: 9,
    date: '2026-04-16',
    tags: ['Schengen reddi', 'Madde 8', 'vize itirazı', 'ret mektubu'],
  },
  {
    slug: 'pasaportunda-ret-varken-yeni-vize',
    title: 'Pasaportunda Ret Varken Yeni Vize Başvurusu Yapmanın Püf Noktaları',
    description: 'Önceki ret damgası olan pasaportla Schengen, İngiltere veya ABD vizesi için yeniden başvururken nelere dikkat etmeli?',
    category: 'Genel',
    readingTime: 8,
    date: '2026-04-16',
    tags: ['vize reddi', 'ret geçmişi', 'yeni başvuru', 'pasaport'],
  },
  {
    slug: 'vize-mulakatinda-heyecan',
    title: 'Vize Mülakatında Heyecanlanmamak için Bilmeniz Gerekenler',
    description: 'ABD, İngiltere ve Schengen vize mülakatlarında heyecan neden tehlikelidir, mülakat soruları nasıl hazırlanır, beden dili ve cevap teknikleri.',
    category: 'İpucu',
    readingTime: 7,
    date: '2026-04-16',
    tags: ['vize mülakatı', 'heyecan', 'mülakat soruları', 'ipucu'],
  },
  {
    slug: 'vize-icin-banka-hesabinda-ne-kadar-para',
    title: 'Banka Hesabında Ne Kadar Para Olması Vize Almayı Garantiler?',
    description: 'Schengen, ABD ve İngiltere vizesi için banka hesabında ne kadar para gerekir? Ülke bazlı minimum miktarlar ve banka ekstresini doğru sunma rehberi.',
    category: 'İpucu',
    readingTime: 8,
    date: '2026-04-16',
    tags: ['banka ekstresi', 'vize parası', 'Schengen finansal'],
  },
  // ── Nasıl Yapılır ───────────────────────────────────────────────────────
  {
    slug: 'fransa-vize-randevu-alternatif',
    title: 'VFS Global Üzerinden Fransa Vize Randevusu Bulamayanlar İçin Alternatif Taktikler',
    description: 'Fransa Schengen vizesi için VFS Global randevusu doluyken ne yapılır? Alternatif şehirler, erken randevu stratejisi ve iptal slotları.',
    category: 'Schengen',
    readingTime: 7,
    date: '2026-04-16',
    tags: ['Fransa vizesi', 'VFS Global', 'randevu', 'Schengen'],
  },
  {
    slug: 'ds-160-form-doldurma-rehberi',
    title: 'Adım Adım DS-160 Formu Doldurma Rehberi (Türkçe Açıklamalı) 2026',
    description: 'ABD vize başvurusu için DS-160 formunu Türkçe açıklamalarla nasıl dolduracaksınız? En çok hata yapılan bölümler ve tuzaklı sorular.',
    category: 'ABD',
    readingTime: 11,
    date: '2026-04-16',
    tags: ['DS-160', 'ABD vize formu', 'Amerika vizesi', 'form doldurma'],
  },
  {
    slug: 'ingiltere-tier4-niyet-mektubu',
    title: 'İngiltere Student Visa (Tier 4) için Niyet Mektubu Nasıl Yazılır?',
    description: 'UK Student Visa başvurusunda personal statement / niyet mektubunda neler yazılmalı, neler yazılmamalı? Yapı, uzunluk ve kaçınılması gereken klişeler.',
    category: 'İngiltere',
    readingTime: 9,
    date: '2026-04-16',
    tags: ['İngiltere öğrenci vizesi', 'Tier 4', 'niyet mektubu', 'personal statement'],
  },
  // ── Karşılaştırma ───────────────────────────────────────────────────────
  {
    slug: '2026-schengen-kolay-zor-ulkeler',
    title: '2026\'da En Kolay ve En Zor Schengen Vizesi Veren Ülkeler Karşılaştırması',
    description: 'Türk vatandaşları için 2024-2026 Schengen onay istatistiklerine göre hangi ülkeler kolay, hangisi zor vize veriyor?',
    category: 'Schengen',
    readingTime: 8,
    date: '2026-04-16',
    tags: ['Schengen karşılaştırma', 'kolay vize', 'onay oranı', '2026'],
  },
  {
    slug: 'dubai-evize-mi-kapida-vize-mi',
    title: 'Dubai E-Vize mi, Kapıda Vize mi Daha Avantajlı? 2026 Güncel Karşılaştırma',
    description: 'Dubai\'ye gidecek Türk vatandaşları için e-vize ve kapıda vize arasındaki farklar: maliyet, süre, riskler ve hangi durumda hangisi tercih edilmeli?',
    category: 'Dubai',
    readingTime: 6,
    date: '2026-04-16',
    tags: ['Dubai vizesi', 'e-vize', 'kapıda vize', 'UAE'],
  },
  {
    slug: 'f1-j1-vizesi-farklari',
    title: 'Amerika F-1 (Öğrenci) ve J-1 (Work and Travel) Vizesi Arasındaki Farklar',
    description: 'ABD F-1 öğrenci vizesi ile J-1 Work and Travel vizesinin farklılıkları: kimler başvurabilir, çalışma hakları, süre ve SEVIS ücreti.',
    category: 'ABD',
    readingTime: 9,
    date: '2026-04-16',
    tags: ['F-1 vizesi', 'J-1 vizesi', 'Work and Travel', 'öğrenci vizesi'],
  },
  // ── SEO Strateji Yazıları (2026 Eklentisi) ──────────────────────────────
  {
    slug: 'cascade-kurali-schengen-vizesi',
    title: "Cascade Kuralı Nedir? Schengen'de 6 Aydan 5 Yıla Uzanan Vize Hakkı",
    description: "AB Cascade kuralı (C(2025) 4694) ile Schengen vizesi nasıl adım adım 1, 3 ve 5 yıllık multiple-entry'ye dönüşür? Her adımın koşulları, kazanımlar ve dikkat noktaları.",
    category: 'Schengen',
    readingTime: 8,
    date: '2026-04-16',
    tags: ['cascade kuralı', 'multiple-entry', 'Schengen', 'çok girişli vize'],
  },
  {
    slug: 'ees-sistemi-nedir',
    title: "EES Sistemi Nedir? Schengen Sınırında Pasaport Damgası Kalktı — 2026 Rehberi",
    description: "Nisan 2026'da tam devreye giren EES (Entry/Exit System) ile Schengen'de pasaport damgası tarihe karıştı. Parmak izi, yüz tanıma, 90/180 gün otomatik sayım ve bekleme süreleri.",
    category: 'Schengen',
    readingTime: 7,
    date: '2026-04-16',
    tags: ['EES sistemi', 'Schengen', 'pasaport damgası', '90/180 gün', 'biyometrik'],
  },
  {
    slug: 'ingiltere-evisa-rehberi',
    title: "İngiltere eVisa Nedir? 2026'da Dijital Vize Zorunluluğu ve Başvuru Rehberi",
    description: "25 Şubat 2026 itibarıyla İngiltere fiziksel vize etiketini tamamen kaldırdı. Türk vatandaşları için İngiltere eVisa başvurusu, UKVI hesabı, BRP kartı iptali ve seyahatte dikkat edilecekler.",
    category: 'İngiltere',
    readingTime: 7,
    date: '2026-04-16',
    tags: ['İngiltere eVisa', 'UK vize', 'dijital vize', 'UKVI', 'BRP kartı'],
  },
  {
    slug: 'schengen-vizesi-nasil-alinir',
    title: "Schengen Vizesi Nasıl Alınır? 2026 Güncel Adım Adım Rehber",
    description: "Türk vatandaşları için Schengen vizesi başvurusu: hangi ülkeye başvurulur, hangi belgeler gerekir, banka hesabı nasıl olmalı, bekleme süresi ne kadar? Randevudan onaya eksiksiz rehber.",
    category: 'Schengen',
    readingTime: 10,
    date: '2026-04-16',
    tags: ['Schengen vizesi', 'vize başvurusu', 'vize belgeleri', 'Schengen 2026'],
  },
  {
    slug: 'schengen-vize-ret-kodlari-c1-c14',
    title: "Schengen Vize Ret Kodları: C1'den C14'e Anlam ve İtiraz Rehberi",
    description: "Schengen vize reddinde bildirimde yer alan C1-C14 ret kodları ne anlama gelir? Her koda göre neyin eksik olduğu, nasıl düzeltilebileceği ve itiraz hakkının nasıl kullanılacağı.",
    category: 'Schengen',
    readingTime: 8,
    date: '2026-04-16',
    tags: ['Schengen ret', 'vize reddi', 'ret kodu', 'itiraz', 'C1 C2 C14'],
  },
  {
    slug: 'vize-randevusu-nasil-alinir',
    title: "Vize Randevusu Nasıl Alınır? 2026 VFS ve Konsolosluk Rehberi",
    description: "Schengen, İngiltere, ABD ve diğer ülkeler için vize randevusu alma adımları, VFS Global ve TLScontact portalleri, randevu bulunamadığında ne yapılır.",
    category: 'Genel',
    readingTime: 6,
    date: '2026-04-16',
    tags: ['vize randevusu', 'VFS Global', 'TLScontact', 'randevu iptal'],
  },
  {
    slug: 'almanya-vizesi-nasil-alinir-2026',
    title: "Almanya Vizesi Nasıl Alınır? 2026 Güncel Belgeler, Bekleme Süresi ve İpuçları",
    description: "Türk vatandaşları için 2026 Almanya Schengen vizesi başvurusu: gerekli belgeler, banka hesabı şartları, VFS randevu süreci ve onay oranını artıracak püf noktaları.",
    category: 'Almanya',
    readingTime: 8,
    date: '2026-04-16',
    tags: ['Almanya vizesi', 'Almanya Schengen', 'VFS Almanya', '2026 Almanya'],
  },
  {
    slug: 'abd-vizesi-nasil-alinir-2026',
    title: "ABD Vizesi Nasıl Alınır? 2026 DS-160, Mülakat ve Tam Rehber",
    description: "Türk vatandaşları için 2026 ABD B1/B2 vize başvurusu: DS-160 formu, mülakat hazırlığı, ret gerekçeleri, bekleme süreleri. Adım adım güncel rehber.",
    category: 'ABD',
    readingTime: 9,
    date: '2026-04-16',
    tags: ['ABD vizesi', 'Amerika vizesi', 'DS-160', 'B1 B2 vize', 'ABD mülakat'],
  },
  {
    slug: 'kapida-vize-veren-ulkeler-2026',
    title: "Türk Pasaportuyla Kapıda Vize Alınabilecek Ülkeler 2026",
    description: "2026 güncel listesi: Türk vatandaşlarının kapıda vize alabildiği ülkeler, koşullar, ücretler ve dikkat edilmesi gerekenler. Dubai, Maldivler, Endonezya ve daha fazlası.",
    category: 'Genel',
    readingTime: 6,
    date: '2026-04-16',
    tags: ['kapıda vize', 'vizesiz ülkeler', 'Türk pasaportu', '2026 seyahat'],
  },
  {
    slug: 'kanada-vizesi-nasil-alinir-2026',
    title: "Kanada Vizesi Nasıl Alınır? 2026 TRV Başvuru Rehberi",
    description: "Türk vatandaşları için 2026 Kanada Geçici İkamet Vizesi (TRV) başvurusu: IRCC online başvuru, biyometrik kayıt, belge gereksinimleri ve bekleme süreleri.",
    category: 'Genel',
    readingTime: 8,
    date: '2026-04-16',
    tags: ['Kanada vizesi', 'TRV', 'IRCC', 'Kanada başvurusu', '2026 Kanada'],
  },
  {
    slug: 'dijital-nomad-vizesi-2026',
    title: "Dijital Nomad Vizesi 2026: Türk Vatandaşları İçin En Cazip Ülkeler",
    description: "2026'da uzaktan çalışarak yurt dışında yaşamak isteyen Türk vatandaşları için dijital nomad vizesi sunan ülkeler: Portekiz, Hırvatistan, Yunanistan, Mauritius ve daha fazlası.",
    category: 'İpucu',
    readingTime: 8,
    date: '2026-04-16',
    tags: ['dijital nomad vizesi', 'uzaktan çalışma vizesi', 'Portekiz dijital nomad', 'remote work vize'],
  },
];

// ── Kategori renk haritası ──────────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  Schengen:  'bg-blue-100 text-blue-700',
  'ABD':     'bg-red-100 text-red-700',
  Almanya:   'bg-yellow-100 text-yellow-800',
  İngiltere: 'bg-purple-100 text-purple-700',
  Dubai:     'bg-amber-100 text-amber-700',
  Genel:     'bg-slate-100 text-slate-700',
  İpucu:     'bg-emerald-100 text-emerald-700',
};

function categoryColor(cat: string) {
  return CATEGORY_COLORS[cat] ?? 'bg-violet-100 text-violet-700';
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('tr-TR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

// ── Schema.org ──────────────────────────────────────────────────────────────
const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'VizeAkıl Blog',
  description: 'Vize başvurusu rehberleri, ipuçları ve güncel bilgiler.',
  url: 'https://vizeakil.com/blog',
  publisher: { '@type': 'Organization', name: 'VizeAkıl', url: 'https://vizeakil.com' },
};

// ── Kategoriler (arama filtresi için) ──────────────────────────────────────
const ALL_CATEGORIES = ['Tümü', ...Array.from(new Set(BLOG_POSTS.map((p) => p.category)))];

// ── Bileşen ─────────────────────────────────────────────────────────────────
export default function BlogIndex() {
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tümü');

  // Etiket linklerinden gelen state'i oku
  useEffect(() => {
    const state = location.state as { searchQuery?: string } | null;
    if (state?.searchQuery) {
      setQuery(state.searchQuery);
      setActiveCategory('Tümü');
    }
  }, [location.state]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return BLOG_POSTS.filter((post) => {
      const matchCategory = activeCategory === 'Tümü' || post.category === activeCategory;
      if (!matchCategory) return false;
      if (!q) return true;
      return (
        post.title.toLowerCase().includes(q) ||
        post.description.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [query, activeCategory]);

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO
        title="Blog — Vize Rehberleri ve İpuçları | VizeAkıl"
        description="Schengen, ABD, Almanya ve düzinelerce ülke için vize başvuru rehberleri, ret sebepleri, belge listeleri ve uzman ipuçları. Güncel ve SEO dostu içerikler."
        canonical="/blog"
        schema={SCHEMA}
      />

      {/* ── Üst navigasyon ── */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Ana sayfaya dön
          </Link>
        </div>
      </div>

      {/* ── Hero + Arama ── */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-brand-600 font-semibold text-sm uppercase tracking-wider">
              VizeAkıl Blog
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-slate-900 mb-3 leading-tight">
            Vize Rehberleri & İpuçları
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl leading-relaxed mb-8">
            Schengen, ABD, Almanya ve daha fazlası için güncel vize rehberleri.
            Belge listeleri, ret sebepleri ve başarılı başvuru stratejileri.
          </p>

          {/* ── Arama kutusu ── */}
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Konu, ülke veya anahtar kelime ara…"
              className="w-full pl-11 pr-10 py-3 border border-slate-200 rounded-2xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 transition-colors"
                aria-label="Aramayı temizle"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* ── Kategori filtreleri ── */}
          <div className="flex flex-wrap gap-2 mt-4">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── İçerik ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Sonuç sayısı */}
        {(query || activeCategory !== 'Tümü') && (
          <p className="text-sm text-slate-500 mb-6">
            {filtered.length > 0
              ? <><strong className="text-slate-800">{filtered.length}</strong> yazı bulundu</>
              : 'Arama sonucu bulunamadı.'}
            {query && <span className="ml-1">— "<span className="italic">{query}</span>"</span>}
          </p>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Search className="w-7 h-7 text-slate-400" />
            </div>
            <h2 className="text-lg font-bold text-slate-700 mb-2">Sonuç bulunamadı</h2>
            <p className="text-slate-500 text-sm max-w-xs mx-auto">
              Farklı anahtar kelimeler deneyin veya kategori filtresini kaldırın.
            </p>
            <button
              onClick={() => { setQuery(''); setActiveCategory('Tümü'); }}
              className="mt-4 px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors"
            >
              Tümünü Göster
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group bg-white rounded-2xl border border-slate-200 hover:border-brand-300 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col"
              >
                {/* Kategori bandı */}
                <div className="h-1.5 bg-brand-600 w-full" />

                <div className="p-6 flex flex-col flex-1">
                  {/* Kategori + okuma süresi */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColor(post.category)}`}>
                      <Tag className="w-3 h-3" />
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readingTime} dk
                    </span>
                  </div>

                  {/* Başlık */}
                  <h2 className="text-base font-bold text-slate-900 group-hover:text-brand-700 transition-colors leading-snug mb-2 flex-1">
                    {post.title}
                  </h2>

                  {/* Açıklama */}
                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 mb-4">
                    {post.description}
                  </p>

                  {/* Etiketler */}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {post.tags.slice(0, 3).map((tag) => (
                        <button
                          key={tag}
                          onClick={(e) => { e.preventDefault(); setQuery(tag); setActiveCategory('Tümü'); }}
                          className="text-[10px] px-2 py-0.5 bg-slate-50 border border-slate-200 text-slate-500 rounded-full hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 transition-colors"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Alt satır: tarih + oku */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
                    <span className="text-xs text-slate-400">{formatDate(post.date)}</span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-brand-600 group-hover:gap-2 transition-all">
                      Oku <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
