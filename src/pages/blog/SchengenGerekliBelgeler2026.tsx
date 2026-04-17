import React from 'react';
import { CheckCircle2, AlertTriangle, FileText, Info, FileCheck } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'schengen-vizesi-gerekli-belgeler-2026',
  title: 'Schengen Vizesi Gerekli Belgeler 2026 — Tam Kontrol Listesi',
  description: '2026 güncel Schengen vize başvurusu için eksiksiz belge listesi: zorunlu evraklar, opsiyonel güçlendiriciler ve ülkeye özel farklılıklar.',
  category: 'Schengen',
  readingTime: 9,
  date: '2026-04-17',
  tags: ['Schengen belgeleri', 'vize belgeleri', 'kontrol listesi', '2026'],
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

export default function SchengenGerekliBelgeler2026() {
  return (
    <BlogPostLayout post={POST} schema={SCHEMA}>
      <p className="text-slate-700 leading-relaxed text-base mb-6">
        Schengen vize başvurusunun %40'ı belge eksikliği nedeniyle reddedilir ya da geri çevrilir.
        Bu yüzden <strong>tam ve doğru belge seti</strong> başarıya giden yolun yarısıdır.
        2026 itibarıyla AB ortak kurallarıyla tüm Schengen ülkelerinde zorunlu 10 ana belge vardır,
        ek olarak her ülkenin kendi ek taleplerini bilmek gerekir. Bu kontrol listesi son güncel
        duruma göre hazırlanmıştır.
      </p>

      <div className="bg-brand-50 border border-brand-200 rounded-xl p-5 mb-8 flex gap-3">
        <FileCheck className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
        <p className="text-brand-900 text-sm leading-relaxed">
          <strong>Ana kural:</strong> Tüm belgeleri <em>orijinal + fotokopi</em> şeklinde götürün.
          Yabancı dildeki belgelere İngilizce/konsolosluk dili tercümesi ekleyin. Noter onayı her
          belge için gerekli değildir ama imzalı ve tarihli olması zorunludur.
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">1. Zorunlu Ana Belgeler (Tüm Schengen Ülkeleri İçin)</h2>
      <div className="space-y-2 mb-8">
        {[
          { b: 'Başvuru Formu', d: 'Tam doldurulmuş, imzalı; başvuru sahibinin bizzat imzalaması şart.' },
          { b: 'Pasaport', d: 'En az 6 ay geçerli, en az 2 boş sayfa. Son 10 yıl içinde düzenlenmiş olmalı.' },
          { b: 'Biyometrik Fotoğraf', d: '2 adet, 35x45 mm, son 6 ay içinde çekilmiş, beyaz arka plan.' },
          { b: 'Seyahat Sağlık Sigortası', d: 'Min. €30.000 teminat, tüm Schengen\'de geçerli, seyahat süresini kapsar.' },
          { b: 'Uçak Rezervasyonu', d: 'Gidiş-dönüş, teyit edilebilir ama ödenmemiş olabilir.' },
          { b: 'Otel / Konaklama Rezervasyonu', d: 'Tüm Schengen süresini kapsayan otel rezervasyonu veya davet belgesi.' },
          { b: 'Banka Hesap Dökümü', d: 'Son 3 ay (veya 6 ay), kaşeli-imzalı, en az €3.000-5.000 bakiye tercihli.' },
          { b: 'Gelir Belgesi', d: 'SGK hizmet dökümü + maaş bordrosu veya vergi levhası.' },
          { b: 'İşveren İzin Belgesi', d: 'Çalışanlar için. İşyerinin antetli kağıdı, tatil onayı, dönüş tarihi.' },
          { b: 'Nüfus Kayıt Örneği', d: 'e-devletten son 1 ay içinde alınmış, aile bireyleri görünür.' },
        ].map(({ b, d }, i) => (
          <div key={b} className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3 text-sm">
            <span className="w-7 h-7 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold shrink-0 text-xs">{i + 1}</span>
            <div>
              <p className="font-semibold text-slate-800 mb-1">{b}</p>
              <p className="text-slate-600">{d}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">2. Destekleyici Belgeler (Güçlendirici)</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Bu belgeler zorunlu değildir ama başvurunuzu önemli ölçüde güçlendirir:
      </p>
      <ul className="space-y-2 mb-6">
        {[
          'Tapu fotokopisi (mülk sahipliği = Türkiye\'ye bağ)',
          'Araç ruhsatı fotokopisi',
          'Çocukların okul kayıt belgesi',
          'Seyahat planı / itinerary (günlük program)',
          'Gidilecek müze-etkinlik rezervasyonları',
          'Önceki Schengen/ABD/İngiltere vizelerinin fotokopisi',
          'Evlilik cüzdanı (aile ziyaretinde)',
          'Emekli belgesi (emekliyseniz)',
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">3. Ülkeye Özel Ek Belgeler</h2>
      <div className="space-y-3 mb-8">
        {[
          { u: 'Almanya', e: '3 aylık detaylı banka hareket dökümü, seyahat planı zorunlu. Apostilli belgeler istenir.' },
          { u: 'Fransa', e: 'France-Visas online başvuru gerekli. Detaylı itinerary, Paris dışı ziyaretler belgelensin.' },
          { u: 'İtalya', e: 'Aile ziyaretinde Italyan tarafın invito letterası (Kaymakamlıkta vidimato).' },
          { u: 'İspanya', e: 'BLS randevu sistemi. Aile ziyaretinde carta de invitación gerekli.' },
          { u: 'Hollanda', e: 'VFS üzerinden başvuru. Kısa süreli ziyaret için sponsor bildirim formu (garantstelling).' },
          { u: 'Yunanistan', e: 'Konsolosluğa direkt başvuru. Ada başvurularında otel rezervasyonu dikkat.' },
        ].map(({ u, e }) => (
          <div key={u} className="bg-white border border-slate-200 rounded-xl p-4 text-sm">
            <p className="font-semibold text-slate-800 mb-1">{u}</p>
            <p className="text-slate-600">{e}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">4. Profile Göre Özel Belgeler</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <p className="font-semibold text-slate-800 mb-2">🎓 Öğrenciler</p>
          <ul className="text-slate-700 text-sm space-y-1">
            <li>• Öğrenci belgesi</li>
            <li>• Transkript</li>
            <li>• Anne/baba sponsor mektubu</li>
            <li>• Anne/baba banka dökümü</li>
          </ul>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <p className="font-semibold text-slate-800 mb-2">🏠 Ev Hanımları</p>
          <ul className="text-slate-700 text-sm space-y-1">
            <li>• Eş sponsor mektubu</li>
            <li>• Eş banka dökümü</li>
            <li>• Evlilik cüzdanı</li>
            <li>• Çocukların okul belgesi</li>
          </ul>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <p className="font-semibold text-slate-800 mb-2">👔 Serbest Meslek</p>
          <ul className="text-slate-700 text-sm space-y-1">
            <li>• Vergi levhası</li>
            <li>• Faaliyet belgesi (oda kaydı)</li>
            <li>• Son yıl gelir tablosu</li>
            <li>• KDV beyannameleri</li>
          </ul>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <p className="font-semibold text-slate-800 mb-2">👴 Emekliler</p>
          <ul className="text-slate-700 text-sm space-y-1">
            <li>• SGK emekli belgesi</li>
            <li>• Emekli cüzdanı</li>
            <li>• Maaşın yattığı hesap dökümü</li>
            <li>• Tapu (varsa)</li>
          </ul>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">5. En Sık Unutulan 8 Belge</h2>
      <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6">
        <ol className="text-red-800 text-sm space-y-1 list-decimal list-inside">
          <li>Tüm pasaport sayfalarının fotokopisi (boş sayfalar dahil)</li>
          <li>Eski vize/damga fotokopisi</li>
          <li>Sigorta poliçesinin İngilizce versiyonu</li>
          <li>İşveren belgesinin başvuru tarihinde 1 aydan eski olması</li>
          <li>Banka dökümünün kaşesiz/imzasız gelmesi</li>
          <li>Otel rezervasyonunun sadece "hold" edilmiş olması — başvuru günü iptal edilmiş çıkabilir</li>
          <li>Nüfus kayıt örneğinin 1 aydan eski olması</li>
          <li>Biyometrik fotoğrafın 6 aydan eski olması</li>
        </ol>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">6. Belge Sıralama ve Sunum</h2>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-blue-900 text-sm mb-1">Görevliyi bunaltmayın, yönlendirin</p>
          <ul className="text-blue-800 text-sm space-y-1 mt-1">
            <li>• Belgeleri 3 ayrı dosyada toplayın: Kimlik/Seyahat, Finansal, Destekleyici</li>
            <li>• Her dosyanın önüne kontrol listesi koyun</li>
            <li>• Orijinal ve fotokopileri ayrı — fotokopiyi konsolosluğa bırakırsınız</li>
            <li>• Staplersız — konsolosluk belgeleri ayırmak zorunda kalmasın</li>
          </ul>
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-8 flex gap-3">
        <FileText className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-emerald-800 text-sm mb-1">Danışman İpucu</p>
          <p className="text-emerald-700 text-sm leading-relaxed">
            Belgeleri teslim etmeden önce <strong>tüm belgeleri cep telefonunuzda PDF olarak</strong>
            yedekleyin. Başvuru sonrası eksik/ek belge istenirse hızla gönderebilirsiniz.
            Ayrıca randevu günü belgelerden birini unutmanıza karşı dijital yedek kurtarıcıdır.
          </p>
        </div>
      </div>

      <div className="mt-12 bg-brand-50 border border-brand-200 rounded-2xl p-6">
        <h3 className="font-bold text-brand-900 mb-2">Özet Kontrol Listesi</h3>
        <p className="text-brand-800 text-sm leading-relaxed">
          Tam belge seti = %70 onay garantisi. Zorunlu 10 ana belge + profilinize özgü ek belgeler +
          ülkeye özel farklılıklar — bu üçlü tamamsa onay oranınız ciddi anlamda yükselir.
          Randevu tarihinden 2 hafta önce belgeleri tamamlayıp son 48 saatte yeniden kontrol edin.
        </p>
      </div>
    </BlogPostLayout>
  );
}
