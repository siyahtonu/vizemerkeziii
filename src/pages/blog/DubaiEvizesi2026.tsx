import React from 'react';
import { CheckCircle2, Info, Plane, Clock, AlertTriangle } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'dubai-e-vizesi-2026-basvuru-rehberi',
  title: 'Dubai E-Vizesi 2026 — Başvuru Rehberi, Ücretler ve Süreler',
  description: 'Dubai ve BAE için e-vize başvurusu 2026: 30/60/90 günlük vize türleri, gereken belgeler, ücretler ve hızlı onay için ipuçları.',
  category: 'Dubai',
  readingTime: 8,
  date: '2026-04-17',
  tags: ['Dubai vizesi', 'UAE e-vize', 'Dubai başvuru', '2026'],
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

export default function DubaiEvizesi2026() {
  return (
    <BlogPostLayout post={POST} schema={SCHEMA}>
      <p className="text-slate-700 leading-relaxed text-base mb-6">
        Türk vatandaşları Dubai ve BAE'ye seyahat ederken vize almak zorundadır — 2023 sonrası
        kapıda vize seçeneği kaldırıldı ve e-vize zorunluluğu başladı. İyi haber: onay oranı %95+,
        işlem süresi 3-5 iş günü ve başvuru tamamen online. 2026 itibarıyla GDRFA (Dubai General
        Directorate of Residency) ve ICP (Federal Authority) iki ayrı portal üzerinden başvuru
        alıyor. Bu rehber hangisinin sizin için uygun olduğunu ve adım adım süreci gösterir.
      </p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 flex gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-amber-900 text-sm leading-relaxed">
          <strong>Dikkat:</strong> 2023'ten itibaren Türk pasaportuyla Dubai'ye kapıda vize
          alınamıyor. Uçağa binmeden önce e-viza onayınızın cep telefonunuzda PDF olarak
          bulunması zorunlu. Aksi halde uçak şirketi boarding izni vermeyecektir.
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">1. E-Vize Türleri ve Ücretleri</h2>
      <div className="space-y-3 mb-8">
        {[
          { tur: '30 gün Tek Giriş', ucret: '$90 (yaklaşık 2.900 TL)', uygun: 'Kısa tatil, alışveriş gezisi, iş görüşmesi.' },
          { tur: '30 gün Çok Girişli', ucret: '$180 (yaklaşık 5.800 TL)', uygun: 'Iki kez gitme planı, transit seyahat.' },
          { tur: '60 gün Tek Giriş', ucret: '$180', uygun: 'Uzun tatil, mülk görme turu.' },
          { tur: '60 gün Çok Girişli', ucret: '$360', uygun: 'Iki kez ziyaret + transit.' },
          { tur: '90 gün Tek Giriş', ucret: '$350', uygun: 'Uzun süreli proje, akraba ziyareti.' },
          { tur: '90 gün Çok Girişli', ucret: '$650', uygun: '3 aylık esnek ziyaret.' },
          { tur: '5 yıl Multiple-Entry', ucret: '$700 + şartlar', uygun: 'Tekrarlayan ziyaretçi, iş sahibi.' },
        ].map(({ tur, ucret, uygun }) => (
          <div key={tur} className="bg-white border border-slate-200 rounded-xl p-4 text-sm">
            <div className="flex justify-between items-start mb-1">
              <p className="font-semibold text-slate-800">{tur}</p>
              <span className="text-brand-600 font-medium text-xs shrink-0 ml-2">{ucret}</span>
            </div>
            <p className="text-slate-600">{uygun}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">2. Başvuru İçin Gerekli Belgeler</h2>
      <ul className="space-y-2 mb-6">
        {[
          'Pasaport (en az 6 ay geçerli) — renkli taraması',
          'Biyometrik vesikalık fotoğraf (beyaz arka plan)',
          'Dönüş uçak bileti (rezervasyon yeterli, ödeme şart değil)',
          'Otel rezervasyonu (Booking.com iptal hakkı olan rezervasyonlar kabul)',
          'Seyahat sağlık sigortası (önerilen, zorunlu değil)',
          'Son 3 ay banka dökümü veya maaş bordrosu (talep edilirse)',
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">3. 3 Başvuru Yolu</h2>
      <div className="grid sm:grid-cols-3 gap-3 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="font-semibold text-blue-900 text-sm mb-2">✈️ Uçak şirketi üzerinden</p>
          <p className="text-blue-800 text-xs leading-relaxed">
            Emirates, Fly Dubai, Etihad Dubai uçuşu satın alanlara özel e-vize hizmeti.
            En pratik ve en ucuz yol.
          </p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <p className="font-semibold text-emerald-900 text-sm mb-2">🏨 Otel üzerinden</p>
          <p className="text-emerald-800 text-xs leading-relaxed">
            Dubai'de rezervasyon yaptırdığınız otel e-vize başvurunuzu üstlenebilir. Hizmet
            bedeli yaklaşık $30 ek.
          </p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="font-semibold text-amber-900 text-sm mb-2">💻 Resmi portal</p>
          <p className="text-amber-800 text-xs leading-relaxed">
            GDRFA.ae veya ICP.gov.ae üzerinden direkt başvuru. Biraz daha karışık ama
            komisyonsuz.
          </p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">4. Adım Adım Başvuru Süreci</h2>
      <div className="space-y-3 mb-8">
        {[
          { n: '1', b: 'Uçak biletini satın alın', d: 'Emirates/Fly Dubai üzerinden alırsanız e-vize hizmeti de kolayca aktive edilir.' },
          { n: '2', b: 'Portala giriş yapın', d: 'Uçak şirketinin "Visa Services" bölümüne gidin ve pasaport/fotoğraf yükleyin.' },
          { n: '3', b: 'Formları doldurun', d: 'Kişisel bilgiler, seyahat tarihleri, konaklama adresi (otel veya akraba).' },
          { n: '4', b: 'Ücreti ödeyin', d: 'Kredi kartı veya havale. Ödeme onayı e-posta ile gelir.' },
          { n: '5', b: 'Bekleyin', d: '3-5 iş günü; acele başvuruda 24 saat (ek ücret $75).' },
          { n: '6', b: 'E-vize PDF\'yi indirin', d: 'Cep telefonunuzda, tabletinizde ve basılı kopya halinde yanınızda bulundurun.' },
        ].map(({ n, b, d }) => (
          <div key={n} className="flex gap-3 text-sm">
            <span className="w-7 h-7 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold shrink-0 text-xs mt-0.5">{n}</span>
            <div>
              <p className="font-semibold text-slate-800 mb-1">{b}</p>
              <p className="text-slate-600 leading-relaxed">{d}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">5. Vize Uzatma</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Dubai'deyken vizeniz bitmek üzereyse Amer hizmet merkezi veya online portal üzerinden
        uzatabilirsiniz:
      </p>
      <ul className="space-y-2 mb-6">
        <li className="flex items-start gap-2 text-sm text-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <span>30 gün → 30 gün daha: $160 (total 60 gün)</span>
        </li>
        <li className="flex items-start gap-2 text-sm text-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <span>60 gün → 30 gün daha: $160 (total 90 gün)</span>
        </li>
        <li className="flex items-start gap-2 text-sm text-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <span>Maksimum 90 gün üzerinde ülke dışına çıkmak gerekir</span>
        </li>
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">6. Overstay (Aşım) Cezaları</h2>
      <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-red-800 text-sm mb-1">Vize süresini aşmayın</p>
          <ul className="text-red-700 text-sm space-y-1 mt-1">
            <li>• Her aşım günü için AED 50 (~$13) ceza</li>
            <li>• Havalimanında ödemediğiniz takdirde ülkeye tekrar girişte engel</li>
            <li>• 180 gün+ aşım: deport + 5 yıl giriş yasağı</li>
            <li>• BAE cezaları Schengen sistemine işlenmez ama Türkiye'ye dönüşte kayıt kalır</li>
          </ul>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">7. Reddedilme Sebepleri</h2>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6 text-sm text-slate-700">
        <ul className="space-y-1">
          <li>• Pasaport 6 aydan az geçerli</li>
          <li>• Fotoğrafta gözlük, başörtü görülmeyen yüz</li>
          <li>• BAE'de daha önce overstay kaydı</li>
          <li>• İsrail damgası (2020 sonrası artık sorun değil ama bazı durumlar kalır)</li>
          <li>• Sabıka kaydı (interpol listesi kontrolü yapılır)</li>
        </ul>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-8 flex gap-3">
        <Plane className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-emerald-800 text-sm mb-1">Danışman İpucu</p>
          <p className="text-emerald-700 text-sm leading-relaxed">
            Yaz ayları (Haziran-Eylül) Dubai'de çok sıcak ama vize ücretleri düşebilir. Kasım-Nisan
            arası en yoğun dönem — ücretler normal. Expo 2020 Dubai sonrası Türk vatandaşlarına
            5 yıllık multiple-entry vize seçeneği açıldı; sık gidenler için uzun vadeli karlı.
          </p>
        </div>
      </div>

      <div className="mt-12 bg-brand-50 border border-brand-200 rounded-2xl p-6">
        <h3 className="font-bold text-brand-900 mb-2">Özet</h3>
        <p className="text-brand-800 text-sm leading-relaxed">
          Dubai e-vizesi Türk vatandaşları için en kolay ve hızlı vize türlerinden biri. 30 gün
          tek giriş için $90, 3-5 iş günü işlem süresi ve %95+ onay oranı. Emirates/Fly Dubai
          üzerinden başvuru en pratik yol; otel veya resmi portal alternatif olarak kullanılabilir.
          Overstay yapmamaya dikkat — cezalar hızlı birikiyor.
        </p>
      </div>
    </BlogPostLayout>
  );
}
