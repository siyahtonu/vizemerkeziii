import React from 'react';
import { CheckCircle2, Info, Briefcase, AlertTriangle, TrendingUp } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'serbest-meslek-sahipleri-icin-vize-rehberi',
  title: 'Serbest Meslek Sahipleri İçin Vize Rehberi 2026',
  description: 'Avukat, doktor, mimar, mali müşavir gibi serbest meslek sahipleri için Schengen ve diğer ülkeler vize başvurusu: vergi levhası, faaliyet belgesi, gelir tablosu.',
  category: 'Genel',
  readingTime: 9,
  date: '2026-04-17',
  tags: ['serbest meslek', 'vergi levhası', 'Schengen', 'freelance'],
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

export default function SerbestMeslekVize() {
  return (
    <BlogPostLayout post={POST} schema={SCHEMA}>
      <p className="text-slate-700 leading-relaxed text-base mb-6">
        Avukat, doktor, mimar, mühendis, mali müşavir, diş hekimi gibi serbest meslek sahipleri
        için vize başvurusu, maaşlı çalışanlardan farklı bir belge setiyle yürür. Düzenli aylık
        bordro yerine vergi levhası, oda kaydı, aylık gelir tablosu ve müşteri sözleşmeleri gerekir.
        Bu rehber serbest meslek sahiplerinin başvurusunu konsolosluğa nasıl güçlü bir profil
        olarak sunacağını adım adım gösterir.
      </p>

      <div className="bg-brand-50 border border-brand-200 rounded-xl p-5 mb-8 flex gap-3">
        <Briefcase className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
        <p className="text-brand-900 text-sm leading-relaxed">
          <strong>Avantaj:</strong> Serbest meslek sahipleri genelde SGK 4/a değil 4/b sigortalısıdır.
          Konsolosluk gözünde kendi işinin patronu olmak Türkiye'de sahip olunan yatırım ve bağ
          demektir — bu güçlü bir dönüş güvencesi sinyalidir.
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">1. Temel Belge Seti</h2>
      <ul className="space-y-2 mb-6">
        {[
          'Vergi Levhası (güncel, 1 yıllık — vergi dairesinden veya e-devletten)',
          'Faaliyet Belgesi (Baro, Oda, TTB gibi meslek odasından son 1 ay içinde)',
          'Vergi dairesi mükellef bilgi yazısı',
          'Son yıl gelir tablosu (yıllık beyanname)',
          'Son 3 aylık KDV beyannameleri',
          'SGK 4/b (Bağ-Kur) hizmet dökümü',
          'İmza sirküleri (varsa)',
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">2. Meslek Bazlı Ek Belgeler</h2>
      <div className="space-y-3 mb-8">
        {[
          { meslek: 'Avukat', ek: 'Baro kimlik kartı fotokopisi, güncel Baro faaliyet belgesi, son 3 ay dava listesi (tercihli).' },
          { meslek: 'Doktor / Diş Hekimi', ek: 'Tabip Odası / Diş Hekimleri Odası kimliği, muayene açılış izni, son 3 ay randevu listesi.' },
          { meslek: 'Mimar / Mühendis', ek: 'Mimar/Mühendis Odası kaydı, SMM (serbest mühendislik müşavirlik) yetki belgesi, devam eden proje sözleşmeleri.' },
          { meslek: 'Mali Müşavir', ek: 'SMMM kimliği, oda kaydı, müşteri sözleşmeleri listesi (isim saklanabilir).' },
          { meslek: 'Eczacı', ek: 'Eczacılar Odası kimliği, eczane ruhsatı, SGK sözleşmesi.' },
          { meslek: 'Freelancer / Dijital', ek: 'Vergi levhası, Upwork/Fiverr gelir ekran görüntüleri, müşteri sözleşmeleri, faturalar.' },
        ].map(({ meslek, ek }) => (
          <div key={meslek} className="bg-white border border-slate-200 rounded-xl p-4 text-sm">
            <p className="font-semibold text-slate-800 mb-1">{meslek}</p>
            <p className="text-slate-600">{ek}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">3. Banka Ekstresinin Önemi</h2>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6 flex gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-800 text-sm mb-1">Serbest meslek için ekstra dikkat</p>
          <p className="text-amber-700 text-sm leading-relaxed">
            Düzenli maaş bordrosu olmadığı için banka dökümünüz maaşlı çalışandan daha
            kritiktir. Konsolosluk "geliriniz nereden geliyor, düzenli mi" sorusuna banka
            hareketlerinizden cevap arar. Müşteri faturalarının karşılığı olan transferleri
            ekstrenizde göstermek büyük avantajdır.
          </p>
        </div>
      </div>
      <ul className="space-y-2 mb-6">
        {[
          '6 aylık banka dökümü (3 ay minimum, 6 ay ideal)',
          'Hem kişisel hem ticari hesapları sunun (ayrıysa)',
          'Büyük müşteri ödemelerinin yanına faturayı ekleyin',
          'Düzenli aylık gelir akışı görünür olmalı',
          'Her ayın ortalama gelirinin yıllık 150.000 TL+ olması tercihli',
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">4. Faaliyet Geçmişi ve Oturmuşluk</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Konsolosluk "oturmuş bir iş mi" kontrolü yapar. Güçlü sinyaller:
      </p>
      <div className="space-y-3 mb-8">
        {[
          { s: '3+ yıl faaliyet', n: 'Vergi levhasının 3 yıldan eski olması kabul görmüş iş sinyalidir.' },
          { s: 'Yükselen gelir', n: 'Son 3 yılın gelir beyannamesinde artış trendi idealdir.' },
          { s: 'Ofis / muayenehane / atölye', n: 'Mülk sahipliği veya uzun vadeli kira kontratı.' },
          { s: 'Yanında çalışan personel', n: '1+ SGK\'lı çalışanınız varsa bu çok güçlü bir bağdır.' },
          { s: 'Aynı müşterilerle devam eden ilişki', n: 'Tekrar eden faturalar / uzun vadeli sözleşmeler.' },
        ].map(({ s, n }) => (
          <div key={s} className="bg-white border border-slate-200 rounded-xl p-4 text-sm">
            <p className="font-semibold text-slate-800 mb-1">{s}</p>
            <p className="text-slate-600">{n}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">5. Seyahat Süresi ve "Kim İşe Bakıyor?" Sorusu</h2>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-blue-900 text-sm mb-1">Konsolosluk özel sorar</p>
          <p className="text-blue-800 text-sm leading-relaxed">
            Serbest meslek sahipleri için sık sorulan soru: "İşinizin sahibisiniz, seyahatte
            kim bakacak?" Cevap hazır olmalı:
          </p>
          <ul className="text-blue-800 text-sm mt-2 space-y-1">
            <li>• Ortak varsa: "Ortağım yönetecek"</li>
            <li>• Personel varsa: "Sekreterim/stajyerim tutacak"</li>
            <li>• Tek çalışansanız: "10 günlük ara, müşterilerime duyurdum"</li>
          </ul>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">6. "İşsiz Görünmemek" İçin Taktikler</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Bazı serbest meslek sahipleri resmi belgelerde düşük gelir görünür ama gerçekte refah
        seviyeleri yüksektir. Bunu konsolosluğa "gizlenmiş zenginlik" değil, "gerçek profil"
        olarak sunmak için:
      </p>
      <ul className="space-y-2 mb-6">
        {[
          'Tapu ve araç ruhsatı ekleyin (mülk varlığı)',
          'BES, hisse, fon hesaplarının dökümü',
          'Eş gelirinin belgelenmesi (ev geliri ortaklığı)',
          'Aylık harcama düzeni (kart ekstresi, kira, aile masrafları)',
          'Son 1 yılın yurtdışı seyahatleri (varsa)',
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">7. En Sık Yapılan Hatalar</h2>
      <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-red-800 text-sm mb-1">Kaçınılması gereken durumlar</p>
          <ul className="text-red-700 text-sm space-y-1 mt-1">
            <li>• Vergi levhasında çok düşük gelir beyanı</li>
            <li>• Faaliyet belgesinin 1 aydan eski olması</li>
            <li>• Ticari hesap ile kişisel hesabın karışması</li>
            <li>• Bağ-Kur prim borcu (konsolosluk e-devletten görebilir)</li>
            <li>• Ana işin dışında "sosyal medya influencer" gibi açıklanmayan ek gelir</li>
          </ul>
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-8 flex gap-3">
        <TrendingUp className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-emerald-800 text-sm mb-1">Danışman İpucu</p>
          <p className="text-emerald-700 text-sm leading-relaxed">
            Serbest meslek sahipleri için en güçlü başvuru şekli "iş gezisi" olarak değil, "meslek
            seminerine katılım" olarak sunmaktır. Konferans kaydı, kurs katılım mektubu veya iş
            görüşme e-postası başvurunuza profesyonel bir kimlik kazandırır ve onay oranını
            yükseltir.
          </p>
        </div>
      </div>

      <div className="mt-12 bg-brand-50 border border-brand-200 rounded-2xl p-6">
        <h3 className="font-bold text-brand-900 mb-2">Özet</h3>
        <p className="text-brand-800 text-sm leading-relaxed">
          Serbest meslek sahipleri için vize başvurusu, doğru belge setiyle maaşlı çalışanlardan
          daha güçlüdür. Vergi levhası + oda kaydı + banka dökümü üçlüsü temel; profesyonel sözleşmeler
          ve mülk belgeleri güçlendirici. 3+ yıl faaliyet göstermiş bir serbest meslek sahibinin
          onay oranı %88-92 arasındadır.
        </p>
      </div>
    </BlogPostLayout>
  );
}
