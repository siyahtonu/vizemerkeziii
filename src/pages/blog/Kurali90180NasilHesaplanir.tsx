import React from 'react';
import { CheckCircle2, Info, Calendar, AlertTriangle, Calculator } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: '90-180-gun-kurali-nasil-hesaplanir',
  title: '90/180 Gün Kuralı Nasıl Hesaplanır? Schengen 2026 Rehberi',
  description: 'Schengen 90/180 gün kuralı nedir, EES sistemi ile otomatik hesaplama, aşım durumunda cezalar ve kalan günlerinizi nasıl takip edersiniz.',
  category: 'Schengen',
  readingTime: 7,
  date: '2026-04-17',
  tags: ['90/180 gün', 'Schengen', 'EES', 'vize süresi'],
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

export default function Kurali90180NasilHesaplanir() {
  return (
    <BlogPostLayout post={POST} schema={SCHEMA}>
      <p className="text-slate-700 leading-relaxed text-base mb-6">
        Schengen bölgesine seyahat eden her Türk vatandaşının bilmesi gereken en kritik kural:
        "Son 180 gün içinde maksimum 90 gün kalma" kuralıdır. Bu kural yanlış anlaşıldığında
        vize sahibi olsanız bile sınırdan geri çevrilebilir, ileride Schengen yasağı alabilirsiniz.
        2026'da aktive olan EES sistemi ile bu kural artık otomatik olarak takip ediliyor — hata
        affedilmiyor. Bu rehber kuralın nasıl hesaplandığını, kalan günlerinizi nasıl öğrenebileceğinizi
        ve aşım durumunda ne olacağını açıklar.
      </p>

      <div className="bg-brand-50 border border-brand-200 rounded-xl p-5 mb-8 flex gap-3">
        <Calculator className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
        <p className="text-brand-900 text-sm leading-relaxed">
          <strong>Temel formül:</strong> "Bugünün tarihinden geriye doğru 180 gün geri gidin, bu
          pencerede Schengen'de toplam kaldığınız gün sayısı 90'ı geçemez." Bu kayan (rolling)
          bir penceredir — her gün yeniden hesaplanır.
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">1. Kural Nasıl İşler?</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        90/180 kuralı kayan bir penceredir; takvim yılı değil, son 180 gündür. Örnek:
      </p>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6 text-sm text-slate-700">
        <p className="mb-2"><strong>Örnek 1 — Yeterli boşluk:</strong></p>
        <ul className="space-y-1 mb-3">
          <li>• Ocak: 30 gün kaldınız</li>
          <li>• Mart: 30 gün kaldınız</li>
          <li>• Haziran: 30 gün kaldınız → 90 gün doldu, yeni giriş yok</li>
          <li>• Ekim: Temmuz başındaki 30 gün penceresinden düştü → 30 gün hakkınız oldu</li>
        </ul>
        <p className="mb-2"><strong>Örnek 2 — Aşım:</strong></p>
        <ul className="space-y-1">
          <li>• Mayıs: 60 gün kaldınız</li>
          <li>• Ağustos: 40 gün kalmak istiyorsunuz</li>
          <li>• Hesap: 60 + 40 = 100 gün — 10 gün aşım!</li>
          <li>• Sonuç: Sınırdan geri çevrilir veya aşım cezası alırsınız</li>
        </ul>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">2. Hangi Ülkeler Sayılır?</h2>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-blue-900 text-sm mb-1">27 ülke tek havuzda</p>
          <p className="text-blue-800 text-sm leading-relaxed mb-2">
            Tüm Schengen ülkelerinde geçirilen süreler aynı havuzda toplanır. Fransa'da 30 + İtalya'da
            30 + İspanya'da 30 = 90 gün.
          </p>
          <p className="text-blue-800 text-sm leading-relaxed">
            <strong>Schengen dahil:</strong> Almanya, Avusturya, Belçika, Bulgaristan (2024'ten),
            Çekya, Danimarka, Estonya, Finlandiya, Fransa, Hırvatistan (2023'ten), Hollanda,
            İspanya, İsveç, İtalya, İzlanda, Letonya, Litvanya, Lüksemburg, Macaristan, Malta,
            Norveç, Polonya, Portekiz, Romanya (2024'ten), Slovakya, Slovenya, İsviçre, Yunanistan.
          </p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">3. Schengen Dışı Ülkelere Çıkış</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Eğer Schengen'den çıkıp 180 günlük pencereyi "sıfırlamaya" çalışırsanız bu işe yaramaz.
        Hesap sadece "fiziksel olarak Schengen'de olduğunuz günler"i sayar:
      </p>
      <ul className="space-y-2 mb-6">
        {[
          'Fransa\'dan çıkıp İngiltere\'ye gitseniz bile hesap duraklar',
          'İngiltere\'de geçen süre Schengen 90 gününden düşülmez',
          'Dönüş yaptığınızda kaldığınız gün sayısı oradan devam eder',
          'Schengen + Croatia = aynı havuz (Hırvatistan 2023\'ten itibaren)',
          'Bulgaristan + Romanya = aynı havuz (2024\'ten itibaren)',
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">4. EES Sistemi ile Otomatik Takip</h2>
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-6 flex gap-3">
        <Calendar className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-emerald-800 text-sm mb-1">Nisan 2026: EES tamamen aktive</p>
          <p className="text-emerald-700 text-sm leading-relaxed">
            EES (Entry/Exit System) her giriş ve çıkışı biyometrik olarak kayıt alır. Pasaport
            damgası yerine elektronik kayıt. Bu sayede:
          </p>
          <ul className="text-emerald-700 text-sm mt-2 space-y-1">
            <li>• Giriş anında kaç gün kaldığınız otomatik hesaplanır</li>
            <li>• Kalan gün sayısı sınır memuruna anında görünür</li>
            <li>• Aşım varsa sınırdan hemen reddedilirsiniz</li>
            <li>• "Bilmiyordum" savunması artık geçerli değil</li>
          </ul>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">5. Kalan Günleri Nasıl Hesaplayabilirsiniz?</h2>
      <div className="space-y-3 mb-8">
        {[
          { y: 'Resmi Schengen Hesaplama Aracı', d: 'ec.europa.eu/schengen-calculator — giriş/çıkış tarihlerini girip kalan gün sayısını görebilirsiniz.' },
          { y: 'EES Self-Service Kiosk', d: 'Havalimanında giriş/çıkış anında kaç gün kaldığınızı gösterir.' },
          { y: 'Mobil Uygulamalar', d: 'SchengenCalc, 90/180 Days gibi uygulamalar seyahat planlamasında yardımcı.' },
          { y: 'Excel Tablosu', d: 'Her seyahat için giriş-çıkış tarihlerini tablolayın — manuel takip de işe yarar.' },
        ].map(({ y, d }) => (
          <div key={y} className="bg-white border border-slate-200 rounded-xl p-4 text-sm">
            <p className="font-semibold text-slate-800 mb-1">{y}</p>
            <p className="text-slate-600">{d}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">6. Aşım Durumunda Cezalar</h2>
      <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-red-800 text-sm mb-1">Ceza miktarları (2026 güncel)</p>
          <ul className="text-red-700 text-sm space-y-1 mt-1">
            <li>• 1-5 gün aşım: Uyarı veya €50-200 para cezası</li>
            <li>• 5-30 gün aşım: €500-1.000 ceza + 1 yıl Schengen yasağı</li>
            <li>• 30+ gün aşım: €1.500+ ceza + 3 yıl Schengen yasağı</li>
            <li>• 90+ gün aşım: Sınır dışı + 5 yıl Schengen yasağı + ileride vize reddi</li>
            <li>• Kasıtlı gizleme: Madde 8 (sahte beyan) + kalıcı kayıt</li>
          </ul>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">7. Multiple-Entry Vize ile 90/180</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        5 yıllık multiple-entry Schengen vize almanız, 5 yıl boyunca sürekli kalabileceğiniz
        anlamına gelmez. 90/180 kuralı her zaman geçerlidir. Sadece vizeniz uzun süreli olduğu
        için her girişte yeni vize almanıza gerek kalmaz.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">8. Vize Sahibi İçin de Kural Geçerli mi?</h2>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6 flex gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-800 text-sm mb-1">Evet, her zaman</p>
          <p className="text-amber-700 text-sm leading-relaxed">
            Tip C (kısa süreli) Schengen vizesi ne kadar geçerli olursa olsun, kullanım süresi
            maksimum 90 gün / 180 gündür. Tip D (uzun süreli) eğitim veya çalışma vizesi ise
            farklıdır — o durum oturma izni sayılır, 90/180 kuralı uygulanmaz.
          </p>
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-8 flex gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-emerald-800 text-sm mb-1">Danışman İpucu</p>
          <p className="text-emerald-700 text-sm leading-relaxed">
            Her Schengen seyahatinden sonra pasaportunuza giriş/çıkış tarihlerini kaydedin
            (artık damga olmadığı için EES kaydınızı pasaportunuz.com üzerinden PDF olarak
            da alabilirsiniz). Hesap tutmadığınız bir gün, sonraki seyahatinizi tehlikeye atabilir.
          </p>
        </div>
      </div>

      <div className="mt-12 bg-brand-50 border border-brand-200 rounded-2xl p-6">
        <h3 className="font-bold text-brand-900 mb-2">Özet</h3>
        <p className="text-brand-800 text-sm leading-relaxed">
          90/180 gün kuralı Schengen'e seyahat eden herkes için bağlayıcıdır. Son 180 günde
          maksimum 90 gün — kayan pencere ile hesaplanır. EES sistemi ile artık otomatik takip
          ediliyor ve aşımlar anında yakalanıyor. Her seyahati kayıt altına alın, şüpheliyseniz
          resmi hesaplama aracını kullanın.
        </p>
      </div>
    </BlogPostLayout>
  );
}
