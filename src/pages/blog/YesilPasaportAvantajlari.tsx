import React from 'react';
import { CheckCircle2, Info, ShieldCheck, Globe, Award } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'yesil-pasaport-avantajlari-vizesiz-ulkeler-2026',
  title: 'Yeşil Pasaport Avantajları — 2026 Vizesiz Ülkeler ve Kullanım Rehberi',
  description: 'Hususi pasaport (yeşil pasaport) sahipleri için 2026 güncel vizesiz ülkeler listesi, kimler yeşil pasaport alabilir, avantajları ve sınırlı olduğu ülkeler.',
  category: 'Genel',
  readingTime: 8,
  date: '2026-04-17',
  tags: ['yeşil pasaport', 'hususi pasaport', 'vizesiz ülkeler', 'Türk pasaportu'],
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

const VIZESIZ_YESIL = [
  { kategori: 'Schengen Bölgesi (90 gün)', ulkeler: ['Almanya', 'Avusturya', 'Belçika', 'Fransa', 'Hollanda', 'İspanya', 'İtalya', 'Polonya', 'Portekiz', 'Yunanistan', 'Çekya', 'Danimarka', 'Estonya', 'Finlandiya', 'İsveç', 'İzlanda', 'Letonya', 'Litvanya', 'Lüksemburg', 'Macaristan', 'Malta', 'Norveç', 'Slovakya', 'Slovenya', 'İsviçre', 'Hırvatistan'] },
  { kategori: 'Balkan Ülkeleri', ulkeler: ['Bosna-Hersek', 'Sırbistan', 'Karadağ', 'Kuzey Makedonya', 'Arnavutluk', 'Kosova'] },
  { kategori: 'Karayip ve Pasifik', ulkeler: ['Bahamalar', 'Barbados', 'Jamaika', 'Fiji', 'Tonga', 'Vanuatu'] },
  { kategori: 'Güneydoğu Asya', ulkeler: ['Filipinler (30 gün)', 'Singapur', 'Tayland', 'Malezya', 'Güney Kore (60 gün)', 'Japonya (eVisa ile)'] },
  { kategori: 'Orta ve Güney Amerika', ulkeler: ['Brezilya', 'Arjantin', 'Şili', 'Kolombiya', 'Meksika', 'Peru', 'Panama'] },
  { kategori: 'Diğer', ulkeler: ['Fas', 'Tunus', 'Ürdün', 'Gürcistan', 'KKTC', 'Azerbaycan', 'Beyaz Rusya'] },
];

const VIZE_GEREKLI = [
  'ABD (vize zorunlu, yeşil pasaport bir avantaj sağlamaz)',
  'İngiltere (2020 sonrası vize zorunlu)',
  'Kanada (yeşil pasaport ile de vize gerekli)',
  'Avustralya (eVisa gerekli)',
  'Yeni Zelanda (NZeTA gerekli)',
  'Rusya (30 gün vize muafiyeti sadece diplomatik pasaportla)',
  'Çin (vize gerekli, 30 gün transit muafiyeti bazı durumlarda)',
];

export default function YesilPasaportAvantajlari() {
  return (
    <BlogPostLayout post={POST} schema={SCHEMA}>
      <p className="text-slate-700 leading-relaxed text-base mb-6">
        Hususi pasaport (yeşil pasaport), Türk vatandaşlarının sahip olabileceği en ayrıcalıklı
        seyahat belgelerinden biridir. 2026 itibarıyla yeşil pasaportunuzla 100'ün üzerinde ülkeye
        vizesiz veya kolay vize ile seyahat edebilirsiniz. Bu rehber yeşil pasaportun kimler için
        uygun olduğunu, hangi ülkelere vizesiz girişi sağladığını ve hangi durumlarda sınırlı
        kaldığını açıklar.
      </p>

      <div className="bg-brand-50 border border-brand-200 rounded-xl p-5 mb-8 flex gap-3">
        <Award className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
        <p className="text-brand-900 text-sm leading-relaxed">
          <strong>Yeşil pasaport nedir?</strong> 5682 sayılı Pasaport Kanunu'nun 14. maddesine göre
          devlet memuru, yüksek rütbeli askeri personel, emekli kamu görevlileri ve bu kişilerin
          eş/çocuklarına verilen hususi pasaporttur. Türk Silahlı Kuvvetleri, Emniyet teşkilatı ve
          üst düzey bürokratların da kapsamındadır.
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">1. Yeşil Pasaportu Kimler Alabilir?</h2>
      <ul className="space-y-2 mb-6">
        {[
          '1, 2, 3. dereceden devlet memurları (ek gösterge 3600+ olanlar)',
          'Askeri personel (binbaşı ve üstü)',
          'Emniyet teşkilatı (komiser yardımcısı ve üstü)',
          'İhracatçı ve TİM üyesi (son 3 yıl 500 bin $+ ihracat yapanlar)',
          'Milletvekilleri ve eski milletvekilleri',
          'Üniversite öğretim üyeleri (profesör, doçent)',
          'Yukarıdaki kişilerin eşleri ve reşit olmayan çocukları',
          '25 yaş altı öğrenimi devam eden çocuklar',
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">2. Vizesiz Girilebilen Ülkeler (2026)</h2>
      <div className="space-y-4 mb-8">
        {VIZESIZ_YESIL.map(({ kategori, ulkeler }) => (
          <div key={kategori} className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="font-semibold text-slate-800 mb-2 text-sm">{kategori}</p>
            <div className="flex flex-wrap gap-1.5">
              {ulkeler.map((u) => (
                <span key={u} className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2.5 py-0.5 text-xs font-medium">
                  {u}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">3. Schengen Bölgesi - 90/180 Kuralı</h2>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6 flex gap-3">
        <Globe className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-blue-900 text-sm mb-1">Schengen için kritik kural</p>
          <p className="text-blue-800 text-sm leading-relaxed">
            Yeşil pasaportla Schengen'e vizesiz girebilirsiniz ama 180 günlük bir pencerede
            maksimum 90 gün kalabilirsiniz. Nisan 2026'da aktive olan EES (Entry/Exit System)
            otomatik olarak bu süreyi takip eder; süreyi aşmak ciddi cezalara yol açar.
          </p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">4. Yeşil Pasaportun Sınırlandığı Ülkeler</h2>
      <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6">
        <p className="font-semibold text-red-900 text-sm mb-2">Yeşil pasaport avantaj sağlamayan ülkeler:</p>
        <ul className="text-red-800 text-sm space-y-1">
          {VIZE_GEREKLI.map((u) => (
            <li key={u}>• {u}</li>
          ))}
        </ul>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">5. Pasaport Kullanımında Dikkat</h2>
      <ul className="space-y-2 mb-6">
        {[
          'Eş ve çocuklar pasaportu ancak sahibiyle birlikte kullanırlar, yalnız seyahat ederken (18 yaş altı) sadece okul/kurs gibi onaylı durumlarda',
          'Pasaportun Yeşil olduğunu bilmeyen havayolu personeli karışıklık yapabilir — havalimanında sakin kalın',
          'Eş boşanırsa yeşil pasaport geçersiz olur; çıkışa hemen umuma mahsus (bordo) pasaport almalı',
          'Çocuklar 25 yaşına girdiğinde öğrenim devam etse bile yeşil pasaport biter',
          'İş değiştirirseniz ve kamu görevinden ayrılırsanız yeşil pasaport iade edilmelidir',
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">6. Umuma Mahsus (Bordo) ile Karşılaştırma</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <p className="font-semibold text-emerald-900 text-sm mb-2">🟢 Yeşil Pasaport</p>
          <ul className="text-emerald-800 text-sm space-y-1">
            <li>✓ 100+ ülke vizesiz</li>
            <li>✓ Schengen 90 gün vizesiz</li>
            <li>✓ Ucret sadece harç (230 TL)</li>
            <li>✓ Konsolosluk önceliği</li>
            <li>✗ ABD, UK, Kanada vizeli</li>
            <li>✗ Kamu görevinde kalma şartı</li>
          </ul>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <p className="font-semibold text-slate-800 text-sm mb-2">🔴 Umuma Mahsus (Bordo)</p>
          <ul className="text-slate-700 text-sm space-y-1">
            <li>• ~40 ülke vizesiz</li>
            <li>• Schengen için vize şart</li>
            <li>• 10 yıllık 1.600 TL</li>
            <li>• Standard başvuru</li>
            <li>• ABD, UK, Kanada için vize gerekli</li>
            <li>• İstikrarlı — hayat boyu</li>
          </ul>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">7. Stratejik Kullanım</h2>
      <div className="space-y-3 mb-8">
        {[
          { b: 'Schengen başvurusu gerekli değil', d: '5 yıllık multiple-entry beklemenize gerek yok, direkt uçak bileti alın.' },
          { b: 'ABD için normal vize süreci', d: 'Yeşil pasaport ABD\'ye avantaj sağlamaz — B1/B2 başvurusu yapın.' },
          { b: 'Aile seyahati', d: 'Eş ve çocuklar da yeşil pasaportla vizesiz gelebilir.' },
          { b: 'İş gezisi', d: 'Toplantı veya konferans için anında uçağa binebilirsiniz, randevu yok.' },
          { b: 'Acil durum', d: 'Schengen içinde hastanelik olmuş akraba ziyareti için vize beklenmez.' },
        ].map(({ b, d }) => (
          <div key={b} className="bg-white border border-slate-200 rounded-xl p-4 text-sm">
            <p className="font-semibold text-slate-800 mb-1">{b}</p>
            <p className="text-slate-600">{d}</p>
          </div>
        ))}
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-8 flex gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-emerald-800 text-sm mb-1">Danışman İpucu</p>
          <p className="text-emerald-700 text-sm leading-relaxed">
            Yeşil pasaport sahibiyseniz ABD ve İngiltere başvurularında yeşil pasaportla
            başvurun — Türkiye'de kamuda çalışıyor olmanız kendi başına güçlü bir dönüş
            güvencesi sinyalidir. Onay oranı bordo pasaport sahiplerinden belirgin yüksektir.
          </p>
        </div>
      </div>

      <div className="mt-12 bg-brand-50 border border-brand-200 rounded-2xl p-6">
        <h3 className="font-bold text-brand-900 mb-2">Özet</h3>
        <p className="text-brand-800 text-sm leading-relaxed">
          Yeşil pasaport Türk vatandaşlarına 100+ ülkeye vizesiz veya kolay vize ile giriş imkanı
          sağlar. Schengen, Balkanlar ve Güney Amerika en büyük kazanımdır. ABD, İngiltere ve
          Kanada için yine vize gerekir. Hakkınız varsa mutlaka alın — vize ücreti ve stresinden
          kurtulursunuz.
        </p>
      </div>
    </BlogPostLayout>
  );
}
