import React from 'react';
import { AlertTriangle, CheckCircle2, Info, ShieldCheck } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'ev-hanimi-italya-schengen-vizesi',
  title: 'Çalışmayan Ev Hanımları için İtalya Schengen Vizesi Nasıl Alınır? (2026 Rehberi)',
  description: 'Gelir belgesi olmayan ev hanımları için İtalya Schengen vizesi başvurusunda eş geliri, sponsor belgeleri ve banka ekstresi nasıl hazırlanır? Adım adım açıklıyoruz.',
  category: 'Schengen',
  readingTime: 8,
  date: '2026-04-16',
  tags: ['ev hanımı', 'İtalya vizesi', 'Schengen', 'sponsor', 'çalışmayan'],
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
  mainEntityOfPage: `https://vizeakil.com/blog/${POST.slug}`,
};

const BELGELER_ES = [
  'Son 3 aylık maaş bordrosu (kaşeli, imzalı)',
  'SGK hizmet dökümü (e-Devlet\'ten)',
  'Çalıştığı kurumdan izin yazısı',
  'Son 6 aylık banka hesap dökümü',
  'Vergi levhası veya gelir vergi beyannamesi',
];

const BELGELER_KISI = [
  'Geçerli pasaport + önceki pasaportlar',
  'Biyometrik fotoğraf (35×45 mm, beyaz fon)',
  'Nüfus cüzdanı fotokopisi',
  'Vukuatlı nüfus kayıt örneği (e-Devlet, barkodlu)',
  'Evlilik cüzdanı fotokopisi',
  'Seyahat sağlık sigortası (min. 30.000 €, tüm Schengen)',
  'Konaklama rezervasyonu (otel veya davet mektubu)',
  'Uçak rezervasyonu (iptale açık)',
  'Niyet mektubu (el yazısı veya imzalı)',
  'Aile bütçesi ve masraf karşılama taahhüdü',
];

export default function EvHanimiItalyaSchengen() {
  return (
    <BlogPostLayout post={POST} schema={SCHEMA}>

      {/* ── Giriş ── */}
      <p className="text-slate-700 leading-relaxed text-base mb-6">
        Büromuza gelen sorulardan en sık karşılaştığımız şüphesiz şu: <em>"Ben ev hanımıyım, gelir belgesiz
        vize alabilir miyim?"</em> Kısa cevap: <strong>Evet, alabilirsiniz.</strong> Uzun cevap ise bu
        rehberin tamamı. Konsolosluklar çalışmayan başvuru sahiplerini reddetmek için değil, <em>bağ ve finansal
        güvence</em> aramak için belgelerinizi inceler. Siz bu iki unsuru doğru belgeleyebildiğiniz sürece
        İtalya Schengen vizesi kapınızı size açacaktır.
      </p>

      {/* ── Temel sorun ── */}
      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Asıl Sorun: Gelir Değil, Güvence</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        İtalya konsolosluğu bir başvuruya baktığında iki temel soruya yanıt arar: <em>"Bu kişi masraflarını
        karşılayabilir mi?"</em> ve <em>"Dönecek bir nedeni var mı?"</em> Çalışmayan bir ev hanımı için ilk
        sorunun yanıtı eşin veya birinci derece yakının geliriyle; ikinci sorunun yanıtı ise Türkiye'deki
        aile bağları, ev, çocuk gibi sosyal kökleriyle verilir.
      </p>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-800 text-sm mb-1">Kritik Hatırlatma</p>
          <p className="text-amber-700 text-sm leading-relaxed">
            Konsolosluklar "boş banka hesabına para yatır, vizeyi al" formülünü 2023'ten bu yana
            sistematik biçimde sorguluyor. Son 3 ayda ani para girişi olan hesaplar alarm veriyor.
            Sahici, organik bir hesap hareketi çok daha güçlü bir belgedir.
          </p>
        </div>
      </div>

      {/* ── Eş sponsorluğu ── */}
      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Eş Sponsorluğu: Altın Standart</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Ev hanımları için en güçlü finansal dayanak eşin geliridir. Eş yurt dışına çıkmıyor olsa bile
        sponsor olabilir; hatta bu durum "geri dönüş güvencesi" açısından olumlu bile değerlendirilir.
      </p>
      <p className="text-sm font-semibold text-slate-700 mb-2">Eşten toplanacak belgeler:</p>
      <ul className="space-y-2 mb-6">
        {BELGELER_ES.map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-blue-800 text-sm leading-relaxed">
          Eş aynı zamanda seyahat ediyorsa belgeleri birleştirin. Ayrı ayrı toplam gelir
          güçlü bir finansal tablo oluşturur.
        </p>
      </div>

      {/* ── Kişisel belgeler ── */}
      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Ev Hanımının Kendi Belgeleri</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Finansal destek eşten gelse de başvuru sahibinin kişisel belgeleri eksiksiz olmalıdır.
        Aşağıdaki liste İtalya Konsolosluğu'nun 2026 güncel gereksinimlerine göre hazırlanmıştır:
      </p>
      <ul className="space-y-2 mb-8">
        {BELGELER_KISI.map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>

      {/* ── Niyet mektubu ── */}
      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Niyet Mektubu: En Çok Atlanan Belge</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Niyet mektubu (cover letter) birçok başvuru sahibinin hafife aldığı ama konsolosluğun
        en dikkatli okuduğu belgedir. Özellikle çalışmayan kişiler için mektubun içermesi
        gerekenler:
      </p>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6 space-y-2 text-sm text-slate-700">
        <p><span className="font-semibold">1.</span> Seyahatin amacı ve rotası (şehir şehir, tarih tarih)</p>
        <p><span className="font-semibold">2.</span> Tüm masrafların kim tarafından karşılandığı (eş/sponsor adı, gelir kaynağı)</p>
        <p><span className="font-semibold">3.</span> Geri dönüş bağı: çocuklar, ev, aile sorumluluğu</p>
        <p><span className="font-semibold">4.</span> Türkiye'deki bağlar: ev, aile, varlıklar</p>
        <p><span className="font-semibold">5.</span> Varsa önceki yurt dışı deneyimleri</p>
      </div>

      {/* ── İtalya'nın avantajları ── */}
      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Neden İtalya? Schengen'de Doğru Seçim mi?</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        İtalya, Türk başvuru sahiplerine karşı Avrupa'daki en tutarlı onay oranlarından birini sergiler.
        2024 EU Schengen istatistiklerine göre Türk başvuru sahiplerinde İtalya onay oranı %78-82
        aralığındadır. Buna ek olarak birden fazla giriş (multiple-entry) vizesi verme konusunda
        Almanya veya Hollanda'ya kıyasla daha cömert bir tarih ortalamasına sahiptir.
      </p>
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-6 flex gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-emerald-800 text-sm mb-1">Danışman İpucu</p>
          <p className="text-emerald-700 text-sm leading-relaxed">
            İlk Schengen başvurusunu yapıyorsanız ve birden fazla ülkeyi ziyaret edecekseniz,
            en uzun konakladığınız ülkeyi değil vizenizi en rahat vereceğini düşündüğünüz ülkeyi
            başvuru ülkesi olarak seçin. İtalya bu konuda güvenli bir liman.
          </p>
        </div>
      </div>

      {/* ── SSS ── */}
      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Sık Sorulan Sorular</h2>
      <div className="space-y-5">
        {[
          {
            s: 'Eşim yurt dışına çıkamıyorsa (askerlik, dava vb.) sponsor olabilir mi?',
            c: 'Evet. Sponsor olmak için eşin seyahate katılması gerekmez. Türkiye\'de kalması hatta ek bir "geri dönüş güvencesi" olarak değerlendirilir.',
          },
          {
            s: 'Pasaportumda hiç vize yok, bu dezavantaj mı?',
            c: 'İlk başvuruda bu normaldir. Boş pasaportu telafi etmek için belge kalitesini ve niyet mektubunu güçlendirin. İspanya, Yunanistan ve İtalya ilk başvuru sahiplerine görece daha açıktır.',
          },
          {
            s: 'Kendi hesabımda ne kadar para olmalı?',
            c: 'Eş sponsor ise kendi hesabınızda sıfır olsa da olur ama en az 2-3 aylık günlük harcamaya yetecek miktar (seyahat başına yaklaşık 1.500-2.500 €) kendi hesabınızda bulunursa belge paketi daha güçlü görünür.',
          },
          {
            s: 'Çocuklarım var, bunu belirtmeli miyim?',
            c: 'Kesinlikle. Çocuk nüfus kayıt örneğini, varsa okul kayıt belgelerini ekleyin. Bunlar Türkiye\'ye bağlılığınızın en somut kanıtıdır.',
          },
        ].map(({ s, c }) => (
          <div key={s} className="bg-white border border-slate-200 rounded-xl p-5">
            <p className="font-semibold text-slate-800 text-sm mb-2">{s}</p>
            <p className="text-slate-600 text-sm leading-relaxed">{c}</p>
          </div>
        ))}
      </div>

      {/* ── Sonuç ── */}
      <div className="mt-12 bg-brand-50 border border-brand-200 rounded-2xl p-6">
        <h3 className="font-bold text-brand-900 mb-2">Sonuç: Doğru Hazırlık Her Şeyi Değiştirir</h3>
        <p className="text-brand-800 text-sm leading-relaxed">
          Çalışmayan ev hanımları için İtalya Schengen vizesi kesinlikle alınabilir.
          Eşin güçlü gelir belgesi, eksiksiz kişisel belgeler ve özenle yazılmış bir niyet mektubu
          dosyanızı tamamlayacaktır. Belge toplarken kaliteye odaklanın; konsoluğu ikna etmek
          miktarla değil, tutarlılık ve açıklıkla olur.
        </p>
      </div>

    </BlogPostLayout>
  );
}
