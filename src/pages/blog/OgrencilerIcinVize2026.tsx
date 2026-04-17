import React from 'react';
import { CheckCircle2, GraduationCap, Info, BookOpen, AlertTriangle } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'ogrenciler-icin-vize-rehberi-2026',
  title: 'Öğrenciler İçin Vize Rehberi 2026 — Turist, Staj ve Eğitim Vizesi',
  description: 'Üniversite öğrencileri için turist, eğitim ve staj vize başvurusu: aile sponsorluğu, öğrenci belgesi, GKS/burs durumu ve en uygun ülkeler.',
  category: 'Genel',
  readingTime: 10,
  date: '2026-04-17',
  tags: ['öğrenci vizesi', 'eğitim vizesi', 'staj vizesi', '2026'],
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
  ],
};

export default function OgrencilerIcinVize2026() {
  return (
    <BlogPostLayout post={POST} schema={SCHEMA}>
      <p className="text-slate-700 leading-relaxed text-base mb-6">
        Öğrenciler vize başvurusunda hem avantajlı hem dezavantajlıdır. Avantaj: Türkiye'de okul
        kaydı güçlü bir "geri dönüş güvencesi" sinyalidir. Dezavantaj: düzenli geliri yoktur,
        banka hesabı zayıftır, iş belgesi yerine sadece öğrenci belgesi vardır. Bu rehber, yaz
        tatili turist vizesi, Erasmus staj vizesi ve uzun dönem eğitim vizesi farklarını açıklar
        ve her biri için başvuru stratejisini gösterir.
      </p>

      <div className="bg-brand-50 border border-brand-200 rounded-xl p-5 mb-8 flex gap-3">
        <GraduationCap className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
        <p className="text-brand-900 text-sm leading-relaxed">
          <strong>Altın kural:</strong> Öğrenci başvurularında öğrenci belgesi + aile banka dökümü
          ikilisi çalışanların maaş bordrosu + işveren izni kadar güçlüdür. Türkiye'deki okul
          kaydınızı öne çıkarın.
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">1. Öğrenci Vize Türleri</h2>
      <div className="space-y-3 mb-8">
        {[
          { tur: 'Turist Vizesi (C Tipi)', sure: '1-90 gün', amac: 'Tatil, yaz okulu, kültürel gezi, kısa ziyaret.' },
          { tur: 'Staj Vizesi', sure: '3-12 ay', amac: 'Zorunlu staj (üniversite onayı gerekli), Erasmus+.' },
          { tur: 'Eğitim Vizesi (D Tipi)', sure: '3+ ay', amac: 'Üniversite öğrencisi, yüksek lisans, doktora.' },
          { tur: 'Dil Okulu Vizesi', sure: '3-12 ay', amac: 'Yabancı dil eğitimi (C veya D tipi, süreye göre).' },
        ].map(({ tur, sure, amac }) => (
          <div key={tur} className="bg-white border border-slate-200 rounded-xl p-4 text-sm">
            <div className="flex justify-between items-center mb-1">
              <p className="font-semibold text-slate-800">{tur}</p>
              <span className="text-brand-600 font-medium text-xs">{sure}</span>
            </div>
            <p className="text-slate-600">{amac}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">2. Turist Vizesi İçin Öğrenci Belgeleri</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Yaz tatili ya da kısa ziyaret için turist vizesine başvuruyorsanız:
      </p>
      <ul className="space-y-2 mb-6">
        {[
          'Öğrenci belgesi (son 1 ay içinde alınmış, e-devletten çıktı kabul edilir)',
          'Transkript (son yılın notları)',
          'Kayıt tarihini gösteren okul diploması (varsa)',
          'Okulun başlangıç/bitiş tarihi (dönüş bilet tarihi bu süreyle uyumlu olmalı)',
          'Aile (anne-baba) sponsorluk mektubu noter onaylı',
          'Anne-baba son 3 ay banka dökümü',
          'Anne-baba SGK hizmet dökümü + maaş bordrosu veya vergi levhası',
          'Akrabalık belgesi (nüfus kayıt örneği)',
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">3. Erasmus ve Staj Vizesi</h2>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6 flex gap-3">
        <BookOpen className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-blue-900 text-sm mb-1">Erasmus+ ek belgeleri</p>
          <ul className="text-blue-800 text-sm space-y-1 mt-1">
            <li>• Üniversitenin gönderdiği kabul mektubu (Letter of Acceptance)</li>
            <li>• Hibe sözleşmesi (Grant Agreement)</li>
            <li>• Staj sözleşmesi / Learning Agreement</li>
            <li>• Konaklama (öğrenci yurdu sözleşmesi veya kira kontratı)</li>
            <li>• Erasmus hibe bilgisinin banka dökümünde görünmesi avantajlı</li>
          </ul>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">4. Eğitim Vizesi (Full-Time)</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Almanya'da master, ABD'de F-1, İngiltere'de Student Visa başvuruları için:
      </p>
      <div className="space-y-3 mb-6">
        {[
          { u: 'Almanya (Visum zum Studium)', b: 'Kabul mektubu + 11.208€ blocked account (Sperrkonto) veya sponsor taahhüdü + TestDaF/DSH dil belgesi + sağlık sigortası.' },
          { u: 'ABD (F-1)', b: 'I-20 formu + SEVIS ücreti ($350) + MRV ücreti + DS-160 + mülakat + kabul edilen üniversitenin yazışması + finansal yeterlilik.' },
          { u: 'İngiltere (Student Visa)', b: 'CAS (Confirmation of Acceptance) + TB testi + IELTS + finansal kanıt 9 ay £1.334/ay (Londra) veya £1.023/ay (dışı).' },
          { u: 'Kanada (Study Permit)', b: 'Letter of Acceptance + GIC hesabı CAD 10.000+ + SIN + biyometrik + medikal muayene.' },
        ].map(({ u, b }) => (
          <div key={u} className="bg-white border border-slate-200 rounded-xl p-4 text-sm">
            <p className="font-semibold text-slate-800 mb-1">{u}</p>
            <p className="text-slate-600">{b}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">5. Sponsor Mektubu Nasıl Yazılır?</h2>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6 text-sm text-slate-700">
        <p className="font-semibold mb-2">Anne/Baba sponsor mektubu örneği:</p>
        <p className="italic leading-relaxed">
          "Ben [Ad Soyad], TC [...], [Ad Soyad]'ın babasıyım/annesiyim. Oğlum/kızım [Ad Soyad]'ın
          [Tarih] – [Tarih] tarihleri arasında [Ülke]'ye yapacağı seyahatin tüm masraflarını
          (uçak, konaklama, günlük harcamalar, sağlık sigortası) karşılayacağımı taahhüt ederim.
          Ekte banka dökümüm ve gelir belgelerim yer almaktadır."
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">6. Öğrenciler İçin En Uygun Ülkeler</h2>
      <div className="space-y-3 mb-8">
        {[
          { u: 'Yunanistan, İtalya', n: 'Yaz tatili için kolay onay, kısa mesafe, uygun maliyet.' },
          { u: 'Almanya', n: 'Eğitim vizesi ucret 75€, 3-4 yıl öğrenci oturması alınabilir.' },
          { u: 'Polonya, Çekya', n: 'Az bilinen ama onay oranı yüksek, ucuz yaşam.' },
          { u: 'Hollanda', n: 'Staj başvurularına toleranslı, İngilizce programlar.' },
          { u: 'İngiltere', n: 'Student Visa ile çalışma hakkı (20 saat/hafta).' },
        ].map(({ u, n }) => (
          <div key={u} className="bg-white border border-slate-200 rounded-xl p-4 text-sm">
            <p className="font-semibold text-slate-800 mb-1">{u}</p>
            <p className="text-slate-600">{n}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">7. En Sık Reddedilen Öğrenci Başvuruları</h2>
      <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-red-800 text-sm mb-1">Kaçınılması gereken durumlar</p>
          <ul className="text-red-700 text-sm space-y-1 mt-1">
            <li>• Öğrenci belgesi olmadan turist başvurusu</li>
            <li>• Akademik kayıtta ayrıtıltı veya dondurma</li>
            <li>• Sosyal medyada kalıcı göç niyeti belirten paylaşımlar</li>
            <li>• Aile banka dökümünün zayıf olması</li>
            <li>• Okul tatili dışında 3+ aylık başvuru</li>
          </ul>
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-8 flex gap-3">
        <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-emerald-800 text-sm mb-1">Strateji İpucu</p>
          <p className="text-emerald-700 text-sm leading-relaxed">
            Yaz tatilinde önce kolay bir Schengen ülkesi (İtalya/Yunanistan) ile vize geçmişi
            oluşturun. Mezun olduktan sonra Almanya/Hollanda gibi eğitim vizesi başvurularında
            bu geçmiş büyük avantaj sağlar. ABD F-1 başvurusu yapacak öğrenciler Schengen
            geçmişinden faydalanır çünkü "yurtdışına gitti, döndü" kaydınız olur.
          </p>
        </div>
      </div>

      <div className="mt-12 bg-brand-50 border border-brand-200 rounded-2xl p-6">
        <h3 className="font-bold text-brand-900 mb-2">Özet</h3>
        <p className="text-brand-800 text-sm leading-relaxed">
          Öğrenciler için vize = öğrenci belgesi + aile sponsorluğu + güçlü niyet mektubu. Turist
          vizesinde aile banka dökümü, eğitim vizesinde finansal yeterlilik kanıtı merkezi rol oynar.
          İlk başvurunuzu Yunanistan veya İtalya ile yapın; sonrasında kapılar açılır.
        </p>
      </div>
    </BlogPostLayout>
  );
}
