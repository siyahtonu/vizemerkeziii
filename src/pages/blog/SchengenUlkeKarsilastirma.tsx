import React from 'react';
import { AlertTriangle, CheckCircle2, Info, ShieldCheck } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: '2026-schengen-kolay-zor-ulkeler',
  title: '2026\'da En Kolay ve En Zor Schengen Vizesi Veren Ülkeler Karşılaştırması',
  description: 'Türk vatandaşları için 2024-2026 Schengen onay istatistiklerine göre hangi ülkeler kolay, hangisi zor vize veriyor? Ülke bazlı onay oranları, bekleme süreleri ve tavsiyeler.',
  category: 'Schengen',
  readingTime: 8,
  date: '2026-04-16',
  tags: ['Schengen karşılaştırma', 'kolay vize', 'onay oranı', '2026 Schengen', 'hangi ülke vize veriyor'],
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

const ULKELER = [
  {
    ulke: 'Yunanistan',
    zorluk: 'Kolay',
    oran: '%82-88',
    sure: '4-8 iş günü',
    renk: 'emerald',
    not: 'Türk başvurucular için en yüksek onay oranlarından biri. Turizm ekonomisini destekleme politikası. İlk Schengen başvurusu için ideal.',
  },
  {
    ulke: 'İtalya',
    zorluk: 'Kolay-Orta',
    oran: '%78-82',
    sure: '5-10 iş günü',
    renk: 'emerald',
    not: 'Tutarlı onay oranı, multiple-entry vize vermeye açık. İlk başvurular için güvenilir seçim.',
  },
  {
    ulke: 'İspanya',
    zorluk: 'Orta',
    oran: '%75-80',
    sure: '7-12 iş günü',
    renk: 'blue',
    not: 'Schengen ortalamasında, turizmde güçlü. Yaz sezonunda randevu darboğazı yaşanabilir.',
  },
  {
    ulke: 'Portekiz',
    zorluk: 'Orta',
    oran: '%73-78',
    sure: '7-15 iş günü',
    renk: 'blue',
    not: 'Artan Türk turist ilgisiyle birlikte değerlendirmeler güçlendi. Aşırı yoğun değil.',
  },
  {
    ulke: 'Fransa',
    zorluk: 'Orta-Zor',
    oran: '%68-74',
    sure: '10-21 iş günü',
    renk: 'amber',
    not: 'Randevu sorunu en çok burada yaşanır. Belge kalitesi yüksek tutulmalı. Güçlü niyet mektubu kritik.',
  },
  {
    ulke: 'Almanya',
    zorluk: 'Zor',
    oran: '%60-68',
    sure: '4-8 hafta',
    renk: 'red',
    not: 'İş amaçlı başvurular için daha az sorunlu; turizm başvurularında en yüksek belge standardı beklenir. Banka kontrolü en katı burada.',
  },
  {
    ulke: 'Hollanda',
    zorluk: 'Zor',
    oran: '%55-63',
    sure: '3-6 hafta',
    renk: 'red',
    not: 'Güçlü finansal kanıt zorunluluğu, ret oranı görece yüksek. İlk başvuru için tavsiye edilmez.',
  },
  {
    ulke: 'İsveç / Norveç',
    zorluk: 'Zor',
    oran: '%50-60',
    sure: '3-8 hafta',
    renk: 'red',
    not: 'Türkiye-İskandinav turizm hacmi düşük olduğundan deneyim az; konsolosluk kütüphanesi katı standartlar uygular.',
  },
];

export default function SchengenUlkeKarsilastirma() {
  const renkMap: Record<string, { bg: string; text: string; border: string }> = {
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    red: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  };

  return (
    <BlogPostLayout post={POST} schema={SCHEMA}>

      <p className="text-slate-700 leading-relaxed text-base mb-6">
        "Hangi ülkeden Schengen vizesi almak daha kolay?" sorusu büromuza en çok sorulan sorulardan
        biridir. Cevap hem istatistiksel hem de bireysel koşullara bağlıdır. Aşağıdaki karşılaştırma
        2024-2025 EU Schengen istatistikleri ve Türk başvurucularla kendi deneyimlerimize dayanmaktadır.
        <strong> Bireysel durumunuz bu genel tabloyu değiştirebilir.</strong>
      </p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-amber-700 text-sm leading-relaxed">
          <strong>Önemli Not:</strong> "Kolay vize almak" için planlandığınız rotayı değil,
          en uygun ülkeyi seçmek hukuki açıdan sorunlu olabilir. Schengen kuralı gereği
          en uzun konaklayacağınız ülkenin konsolosluğuna başvurmanız gerekir.
          Bu listeyi bilgilenmek için kullanın; kural çiğniyor şekilde değil.
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Ülke Bazında Değerlendirme</h2>
      <div className="space-y-4 mb-10">
        {ULKELER.map(({ ulke, zorluk, oran, sure, renk, not }) => {
          const r = renkMap[renk];
          return (
            <div key={ulke} className={`rounded-xl border ${r.border} overflow-hidden`}>
              <div className={`${r.bg} px-4 py-3 flex items-center justify-between`}>
                <p className={`font-bold text-sm ${r.text}`}>{ulke}</p>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-white border ${r.border} ${r.text}`}>{zorluk}</span>
                  <span className="text-xs text-slate-500 font-medium">Onay: {oran}</span>
                </div>
              </div>
              <div className="p-4 bg-white text-sm text-slate-700">
                <div className="flex items-center gap-4 mb-2 text-xs text-slate-500">
                  <span>Bekleme süresi: <strong className="text-slate-700">{sure}</strong></span>
                </div>
                <p className="leading-relaxed">{not}</p>
              </div>
            </div>
          );
        })}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">İlk Schengen Başvurusu İçin En İyi Üçlü</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Pasaportunuzda hiç Schengen vizesi yoksa bu üç ülke en güvenli başlangıçtır:
      </p>
      <ul className="space-y-2 mb-8">
        {[
          { u: 'Yunanistan', n: 'Ada tatili, Atina veya Selanik için hem kolay hem popüler. Multiple-entry vize de kısa sürede gelebilir.' },
          { u: 'İtalya', n: 'İlk Schengen için Almanya\'dan çok daha kabul edici. Roma, Floransa, Venedik ciddi turizm trafiği taşır.' },
          { u: 'İspanya', n: 'Barcelona veya Madrid için güçlü turizm altyapısı. Belge kalitesi yüksek tutulursa sorun yaşanmaz.' },
        ].map(({ u, n }) => (
          <li key={u} className="flex items-start gap-2 text-sm text-slate-700 bg-white border border-slate-200 rounded-xl p-4">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div><span className="font-semibold">{u}:</span> {n}</div>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Neden Zorluk Değişir? Belirleyici Faktörler</h2>
      <div className="space-y-3 mb-8">
        {[
          { f: "Türkiye'ye yakınlık ve turizm hacmi", d: 'Yunanistan ile İtalya Türk ziyaretçi sayısından ekonomik olarak fayda sağlar. Bu vizede daha esnek bir tutuma yansır.' },
          { f: 'Konsolosluk kapasitesi', d: 'Almanya\'nın Türkiye\'de çok sayıda VFS ofisi olmasına rağmen talep kapasiteyi aşar. Bekleme süresini uzatır.' },
          { f: 'Başvuru sahibinin profili', d: 'Aynı ülkeye başvuran güçlü profilli bir kişi ile zayıf dosyalı biri için sonuç tamamen farklı olabilir. İstatistik bir ortalamadır.' },
          { f: 'Amaç', d: 'Turizm, iş, aile ziyareti aynı ülkede bile farklı onay oranlarına sahiptir.' },
        ].map(({ f, d }) => (
          <div key={f} className="bg-white border border-slate-200 rounded-xl p-4 text-sm">
            <p className="font-semibold text-slate-800 mb-1">{f}</p>
            <p className="text-slate-600 leading-relaxed">{d}</p>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-blue-800 text-sm leading-relaxed">
          <strong>Multiple-Entry Vizesi:</strong> İlk başvuruda single-entry alabilirsiniz.
          Ancak Yunanistan ve İtalya, güçlü dosyaya 1 veya 2 yıllık multiple-entry vize
          vermesiyle biliniyor. Bu vizelerden sonra Almanya ve Fransa başvurularında
          geçmişiniz çok daha güçlü görünür.
        </p>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-8 flex gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-emerald-800 text-sm mb-1">Danışman İpucu: Schengen Kademesi</p>
          <p className="text-emerald-700 text-sm leading-relaxed">
            Uzun vadeli strateji şöyle düşünülmeli: Yunanistan → İtalya → İspanya → Fransa →
            Almanya. Her ülkeyi gezip pasaportunuza damga biriktirdikçe daha "zor" ülkelerin
            konsoloslukları önünüzde daha kolay açılır. Sistem güven birikimine dayanır.
          </p>
        </div>
      </div>

      <div className="mt-12 bg-brand-50 border border-brand-200 rounded-2xl p-6">
        <h3 className="font-bold text-brand-900 mb-2">Özet: Ülke Seçimi Stratejik Olsun</h3>
        <p className="text-brand-800 text-sm leading-relaxed">
          2026'da Schengen vizesi için en kolay ülkeler Yunanistan ve İtalya, en zor olanlar
          Almanya ve Hollanda. Ancak "kolay" demek "belgesiz" demek değildir. Güçlü belgelerle
          her ülkeden vize alınabilir; zayıf belgelerle hiçbir ülkeden alınamaz. Strateji,
          kural çiğneden değil, akıllı rotasyondan geçiyor.
        </p>
      </div>

    </BlogPostLayout>
  );
}
