import React from 'react';
import { CheckCircle2, Info, Heart, ShieldCheck, User } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'emekliler-icin-vize-basvurusu-rehberi',
  title: 'Emekliler İçin Vize Başvurusu — 2026 Tam Rehber',
  description: 'Emekli Türk vatandaşları için Schengen, İngiltere, ABD ve Kanada vize başvurusu: SGK emekli belgesi, kısıt gelir, sağlık sigortası ve dönüş güvencesi.',
  category: 'Genel',
  readingTime: 9,
  date: '2026-04-17',
  tags: ['emekli', 'emekli vize', 'SGK', 'sağlık sigortası'],
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
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Emekliler vize alırken avantajlı mıdır?',
          acceptedAnswer: { '@type': 'Answer', text: 'Evet. Türkiye\'ye dönüş güvencesi (emekli aylığı, torunlar, mülk) konsolosluk gözünde en güçlü bağlardır. Emeklilerin onay oranı ortalamanın üzerindedir.' },
        },
        {
          '@type': 'Question',
          name: 'Emekli maaşı düşükse ne yapılır?',
          acceptedAnswer: { '@type': 'Answer', text: 'Birikim hesabı, kira geliri veya çocukların sponsorluğu eklenebilir. Emekli maaşı tek başına yeterli olmasa da tamamlayıcıdır.' },
        },
        {
          '@type': 'Question',
          name: '65 yaş üstü sağlık sigortası zor mu?',
          acceptedAnswer: { '@type': 'Answer', text: 'Bazı sigorta şirketleri 65+ yaşta prim artırır veya limitli poliçe verir. Schengen zorunluluğu €30.000 teminattır; bu seviyede her yaşta poliçe bulunabilir.' },
        },
      ],
    },
  ],
};

export default function EmekliVizeBasvurusu() {
  return (
    <BlogPostLayout post={POST} schema={SCHEMA}>
      <p className="text-slate-700 leading-relaxed text-base mb-6">
        Emeklilerin vize başvurusu söz konusu olduğunda yaygın bir yanılgı vardır: "Çalışmıyorum,
        reddederler." Oysa konsolosluklar açısından emekli olmak büyük bir <strong>avantajdır</strong> —
        emekli maaşı, SGK kaydı, Türkiye'deki mülk ve çocuklarla kurulan bağlar konsolosluğun
        aradığı her şeyi kapsar. Bu rehber emeklilerin vize başvurusunda öne çıkarması gereken
        belgeleri ve en uygun ülke tercihlerini gösterir.
      </p>

      <div className="bg-brand-50 border border-brand-200 rounded-xl p-5 mb-8 flex gap-3">
        <Heart className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
        <p className="text-brand-900 text-sm leading-relaxed">
          <strong>Emeklilerin onay oranı %92-95'tir</strong> — çalışan başvurucuların %75-85 onay
          ortalamasının üzerinde. Sebep basit: emekli bir kişinin Türkiye'de "geri dönecek düzeni
          olduğu" genelde açıktır.
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">1. Emeklinin En Güçlü Belgeleri</h2>
      <ul className="space-y-2 mb-6">
        {[
          'SGK Emekli Belgesi (e-devletten, PDF)',
          'Emekli kimlik kartı fotokopisi',
          'Son 3 aylık banka dökümü (maaşın düzenli yattığını gösteren)',
          'Tapu fotokopisi (varsa — Türkiye\'ye bağın en güçlü kanıtı)',
          'Nüfus kayıt örneği (çocuklar ve torunlar görünür)',
          'Varsa kira kontratı veya düzenli gelir kaynağı belgesi',
          'Sağlık sigortası (Schengen için min. €30.000 teminat)',
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">2. Emekli Maaşı Düşükse Ne Yapılır?</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Türkiye'de asgari emekli maaşı konsolosluklar için yetersiz görülebilir. Çözümler:
      </p>
      <div className="space-y-3 mb-8">
        {[
          { b: 'Birikim hesabı', d: 'Son 3-6 ay istikrarlı TL veya döviz bakiyesi (en az 50.000-100.000 TL).' },
          { b: 'Kira geliri', d: 'Kira sözleşmesi + kira gelirinin banka dökümünde görünmesi.' },
          { b: 'Çocuk sponsorluğu', d: 'Çocuklarınızın noter onaylı taahhütlü sponsor mektubu + banka dökümleri.' },
          { b: 'Eş sponsorluğu', d: 'Eşin ayrı bir emekli maaşı veya çalışma geliri varsa birleştirin.' },
          { b: 'Yatırım hesabı', d: 'BES, hisse, altın hesabı — tümü kabul edilir.' },
        ].map(({ b, d }) => (
          <div key={b} className="bg-white border border-slate-200 rounded-xl p-4 text-sm">
            <p className="font-semibold text-slate-800 mb-1">{b}</p>
            <p className="text-slate-600">{d}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">3. Sağlık Sigortasında Dikkat Edilmesi Gerekenler</h2>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6 flex gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-800 text-sm mb-1">65 yaş üstü poliçeler</p>
          <ul className="text-amber-700 text-sm space-y-1 mt-1">
            <li>• Schengen poliçesi min. €30.000 teminat şartı — her yaşta karşılanabilir</li>
            <li>• 70+ yaşta prim yaklaşık 2 katına çıkar ama poliçe bulunur</li>
            <li>• Kronik hastalık beyanı yapın — saklarsanız poliçe geçersiz sayılır</li>
            <li>• Covid-19 dahil acil durum kapsamı olmalıdır</li>
            <li>• Allianz, Axa, Mapfre, Acıbadem Sağlık en çok tanınan sağlayıcılar</li>
          </ul>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">4. Emekliler İçin En Uygun Ülkeler</h2>
      <div className="space-y-3 mb-8">
        {[
          { ulke: 'Yunanistan', avantaj: 'Sezonluk kapı vizesi, kısa mesafe, hem uçak hem karayolu seçeneği.' },
          { ulke: 'İtalya', avantaj: 'Türk emeklilere toleranslı, 5 yıllık multiple-entry\'ye kolay uzanır.' },
          { ulke: 'İspanya', avantaj: 'Aile bağlarına toleranslı, uzun vadeli sağlık tedavisi için ideal.' },
          { ulke: 'Portekiz', avantaj: 'D7 emekli vizesi ile uzun süre yaşama hakkı, iklim avantajı.' },
          { ulke: 'İngiltere', avantaj: 'Standart Visitor Visa — 6 aya kadar kalış, emekliler için 28 gün kuralı önemli.' },
        ].map(({ ulke, avantaj }) => (
          <div key={ulke} className="bg-white border border-slate-200 rounded-xl p-4 text-sm">
            <p className="font-semibold text-slate-800 mb-1">{ulke}</p>
            <p className="text-slate-600">{avantaj}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">5. Refakat/Sağlık Ziyareti Vizesi</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Yurtdışında yaşayan çocuğunuzu ziyaret etmek veya sağlık tedavisi için gidiyorsanız
        standard turist vizesi yerine "aile ziyareti" veya "medical treatment" vize kategorisini
        seçebilirsiniz. Ek belgeler:
      </p>
      <ul className="space-y-2 mb-6">
        {[
          'Çocuğun yaşadığı ülkede ikamet belgesi (Aufenthaltstitel, Meldung vb.)',
          'Çocuğun davet mektubu (noter onaylı)',
          'Çocuğun iş/gelir durumu belgesi',
          'Akrabalık belgesi (nüfus kayıt örneği)',
          'Tedavi ise: hastane randevu yazışmaları, tedavi planı, maliyet beyanı',
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">6. ABD Emekli Başvuruları</h2>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6 flex gap-3">
        <User className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-blue-900 text-sm mb-1">80+ yaş mülakatsız başvuru</p>
          <p className="text-blue-800 text-sm leading-relaxed">
            ABD, 80 yaş ve üstü başvuranlar için <strong>mülakatsız (dropbox) başvuru</strong>
            hakkı tanır. 79 yaşındaysanız 80'i bekleyerek mülakat stresinden kurtulabilirsiniz.
            Daha önceki ABD vizesi yenileme başvurularında da mülakat muafiyeti vardır.
          </p>
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-8 flex gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-emerald-800 text-sm mb-1">Danışman İpucu</p>
          <p className="text-emerald-700 text-sm leading-relaxed">
            Emekliler için en güçlü koz <strong>torunlardır</strong>. Torunların fotoğrafı ve
            okul belgesi başvuruya konulmamalı — ama sözlü görüşmede "torunlarımın okulu başlıyor,
            Eylül'de dönmeliyim" cümlesi kesin dönüş güvencesi sinyalidir.
          </p>
        </div>
      </div>

      <div className="mt-12 bg-brand-50 border border-brand-200 rounded-2xl p-6">
        <h3 className="font-bold text-brand-900 mb-2">Özet</h3>
        <p className="text-brand-800 text-sm leading-relaxed">
          Emekli olmak vize başvurusunda bir engel değil, bir güç kaynağıdır. SGK emekli belgesi,
          tapu, torunlar ve düzenli maaş dörtlüsüyle %90+ onay oranı mümkündür. Yunanistan, İtalya
          ve İspanya emekliler için en rahat Schengen seçeneklerindedir. 80+ yaşta ABD mülakatsız
          başvuru avantajını unutmayın.
        </p>
      </div>
    </BlogPostLayout>
  );
}
