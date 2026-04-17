import React from 'react';
import { CheckCircle2, Info, ShieldCheck, AlertTriangle, Globe } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'vize-icin-seyahat-sigortasi-nasil-secilir',
  title: 'Vize İçin Seyahat Sigortası Nasıl Seçilir? 2026 Rehberi',
  description: 'Schengen, İngiltere, ABD vizesi için zorunlu seyahat sağlık sigortası: minimum teminat, kapsamlar, fiyatlar ve güvenilir sigorta şirketleri.',
  category: 'İpucu',
  readingTime: 8,
  date: '2026-04-17',
  tags: ['seyahat sigortası', 'sağlık sigortası', 'Schengen', 'poliçe'],
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

const ULKE_MIN_TEMINAT = [
  { ulke: 'Schengen (27 ülke)', min: '€30.000', not: 'Tıbbi masraf, ülke içinde nakil, vefat durumu cenaze iadesi.' },
  { ulke: 'İngiltere', min: 'Zorunlu değil', not: 'Önerilir — NHS\'yi aşan durumlar için (£50.000+ tavsiye).' },
  { ulke: 'ABD', min: 'Zorunlu değil', not: '$100.000+ şiddetle önerilir — sağlık masrafları çok yüksek.' },
  { ulke: 'Kanada', min: 'Zorunlu değil', not: 'CAD 100.000+ önerilir — ziyaretçi sigortası.' },
  { ulke: 'Rusya', min: '€30.000', not: 'Schengen standartlarına benzer.' },
  { ulke: 'Çin', min: '€30.000 önerilir', not: 'Özellikle tıbbi nakil için.' },
  { ulke: 'Avustralya', min: 'Zorunlu değil', not: 'AUD 300.000+ önerilir — uzak ülke nakli pahalıdır.' },
];

export default function SeyahatSigortasiNasilSecilir() {
  return (
    <BlogPostLayout post={POST} schema={SCHEMA}>
      <p className="text-slate-700 leading-relaxed text-base mb-6">
        Seyahat sağlık sigortası Schengen vizesinin zorunlu belgelerinden biridir. Fakat ucuz
        poliçe aldığınızda konsolosluk reddediyor, yanlış kapsam aldığınızda yurtdışında ödeme
        yapamıyorsunuz. 2026'da doğru poliçe seçimi için bilmeniz gereken kriterler, minimum
        teminatlar, en güvenilir şirketler ve fiyat karşılaştırmaları bu rehberdedir.
      </p>

      <div className="bg-brand-50 border border-brand-200 rounded-xl p-5 mb-8 flex gap-3">
        <ShieldCheck className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
        <p className="text-brand-900 text-sm leading-relaxed">
          <strong>Schengen için zorunlu kriterler:</strong> Minimum €30.000 teminat, tüm Schengen
          ülkelerinde geçerli, seyahat süresinin tamamını kapsar, ülkeye dönüş nakli ve vefat
          durumunda cenaze iadesi dahil.
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">1. Ülkeye Göre Minimum Teminat</h2>
      <div className="space-y-2 mb-8">
        {ULKE_MIN_TEMINAT.map(({ ulke, min, not }) => (
          <div key={ulke} className="bg-white border border-slate-200 rounded-xl p-4 text-sm">
            <div className="flex justify-between items-start mb-1">
              <p className="font-semibold text-slate-800">{ulke}</p>
              <span className="text-brand-700 font-bold text-xs shrink-0 ml-2">{min}</span>
            </div>
            <p className="text-slate-500 text-xs italic">{not}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">2. Poliçede Olması Gereken Kapsamlar</h2>
      <ul className="space-y-2 mb-6">
        {[
          'Tıbbi masraflar (hospital, doctor, ilaç) — min. €30.000',
          'Acil tıbbi nakil (hastaneye taşıma) — sınırsız tercihli',
          'Ülkeye dönüş nakli — Türkiye\'ye tıbbi amaçlı dönüş',
          'Vefat durumunda cenaze iadesi — min. €7.500',
          'Bagaj kaybı — €1.000-2.000',
          'Seyahat iptali (isteğe bağlı)',
          'COVID-19 kapsamı (2026\'da önerilir, zorunlu değil)',
          'Spor ve macera aktiviteleri (gerekirse)',
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">3. 2026 Fiyat Karşılaştırması</h2>
      <div className="space-y-3 mb-8">
        {[
          { firma: 'Allianz', fiyat: '10 gün: 350-500 TL', ozellik: 'En geniş anlaşmalı ağ, her yaşta poliçe, 7/24 Türkçe destek.' },
          { firma: 'AXA Sigorta', fiyat: '10 gün: 300-450 TL', ozellik: 'Schengen\'de en yaygın kabul gören markalardan, direkt ödeme.' },
          { firma: 'Mapfre', fiyat: '10 gün: 280-400 TL', ozellik: 'İspanya kökenli, tüm Avrupa\'da güçlü, uygun fiyat.' },
          { firma: 'Acıbadem Sağlık', fiyat: '10 gün: 250-380 TL', ozellik: 'Türk sigorta, Schengen onaylı, Acıbadem Hastane ağı.' },
          { firma: 'Anadolu Sigorta', fiyat: '10 gün: 250-350 TL', ozellik: 'En ucuz seçeneklerden, standart kapsam.' },
          { firma: 'Europ Assistance', fiyat: '10 gün: 400-600 TL', ozellik: 'Avrupa\'nın en büyük travel insurance şirketi, premium hizmet.' },
        ].map(({ firma, fiyat, ozellik }) => (
          <div key={firma} className="bg-white border border-slate-200 rounded-xl p-4 text-sm">
            <div className="flex justify-between items-start mb-1">
              <p className="font-semibold text-slate-800">{firma}</p>
              <span className="text-brand-600 font-medium text-xs shrink-0 ml-2">{fiyat}</span>
            </div>
            <p className="text-slate-600">{ozellik}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">4. Ucuz Poliçenin Tuzakları</h2>
      <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-red-800 text-sm mb-1">150 TL'lik poliçede dikkat edin</p>
          <ul className="text-red-700 text-sm space-y-1 mt-1">
            <li>• Muafiyet çok yüksek olabilir (ilk €500-1.000 sizden)</li>
            <li>• Limitli konsolosluk kabulü ("Schengen approved" yazmıyor)</li>
            <li>• COVID-19 kapsamı dışı</li>
            <li>• Kronik hastalık hariç</li>
            <li>• Macera aktiviteleri hariç (kayak, dalış yok)</li>
            <li>• Direkt ödeme yok — sen öde, sonra iade al</li>
          </ul>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">5. Yaş Gruplarına Göre Dikkat</h2>
      <div className="space-y-3 mb-8">
        {[
          { y: '18-40 yaş', n: 'Standart poliçe yeterli, 250-400 TL aralığında bulunur.' },
          { y: '40-60 yaş', n: 'Kronik hastalık beyanı yapın. Prim 1.3-1.5 katı.' },
          { y: '60-70 yaş', n: 'Özel yaşlı seyahat sigortası. Prim 1.5-2 katı.' },
          { y: '70-80 yaş', n: 'Bazı şirketler prim ister. Allianz, Mapfre güvenilir.' },
          { y: '80+ yaş', n: 'Poliçe bulmak zor. Özel doktor muayene raporu istenebilir.' },
        ].map(({ y, n }) => (
          <div key={y} className="bg-white border border-slate-200 rounded-xl p-4 text-sm">
            <p className="font-semibold text-slate-800 mb-1">{y}</p>
            <p className="text-slate-600">{n}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">6. Online mı, Acenteden mi?</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <p className="font-semibold text-emerald-900 text-sm mb-2">✓ Online (Sigortam.net, HeyGidi, ...)</p>
          <ul className="text-emerald-800 text-sm space-y-1">
            <li>• %30-50 daha ucuz</li>
            <li>• PDF anında alınır</li>
            <li>• Karşılaştırma kolay</li>
            <li>• 7/24 satın alabilirsiniz</li>
          </ul>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="font-semibold text-blue-900 text-sm mb-2">📞 Acente / Banka</p>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Kişisel danışmanlık</li>
            <li>• Özel durumlar için güvenli</li>
            <li>• Banka kampanyaları</li>
            <li>• Daha pahalı (genelde)</li>
          </ul>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">7. Poliçe Satın Alırken Kontrol Listesi</h2>
      <ul className="space-y-2 mb-6">
        {[
          'Poliçe tarihi seyahat tarihlerini tam kapsıyor mu?',
          'Gidilecek ülkeler listesi doğru mu? (Schengen çoğunlukla default)',
          'Teminat €30.000 + cenaze iadesi var mı?',
          'Poliçe Türkçe + İngilizce olarak çıkıyor mu?',
          'Kronik hastalık beyanım doğru mu?',
          'Acil numara 7/24 ulaşılabilir mi?',
          'Direkt ödeme mi, sonradan iade mi?',
          'COVID-19 dahil mi? (Açıkça "included" yazmalı)',
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6 flex gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-800 text-sm mb-1">Acil durum yaşarsanız</p>
          <ol className="text-amber-700 text-sm space-y-1 mt-1 list-decimal list-inside">
            <li>Önce sigortanızın acil numarasını arayın (poliçede yazar)</li>
            <li>Acil durumda yakın hastaneye başvurun</li>
            <li>Ödeme yapmadan sigorta şirketine haber verin</li>
            <li>Tüm faturaları saklayın</li>
            <li>Türkiye'ye döndükten sonra 15 gün içinde talep bildirin</li>
          </ol>
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-8 flex gap-3">
        <Globe className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-emerald-800 text-sm mb-1">Danışman İpucu</p>
          <p className="text-emerald-700 text-sm leading-relaxed">
            Kısa bir hafta seyahati için 300 TL harcayıp güvenilir bir poliçe almak; 3.000 TL'lik
            acil ambulans masrafı ile karşılaşmaktan çok daha ucuzdur. Ayrıca vize danışmanlığı
            kadar sigortanın da kaliteli olması Schengen onay sürecini hızlandırır.
          </p>
        </div>
      </div>

      <div className="mt-12 bg-brand-50 border border-brand-200 rounded-2xl p-6">
        <h3 className="font-bold text-brand-900 mb-2">Özet</h3>
        <p className="text-brand-800 text-sm leading-relaxed">
          Schengen için min. €30.000 teminat zorunlu. Allianz, AXA, Mapfre gibi tanınmış markalar
          güvenli. Online 10 günlük poliçe 250-500 TL, acente fiyatları %30-50 daha yüksek. Ucuz
          poliçelerde muafiyet ve kapsam dışı maddeleri mutlaka kontrol edin.
        </p>
      </div>
    </BlogPostLayout>
  );
}
