import React from 'react';
import { AlertTriangle, CheckCircle2, Info, ShieldCheck } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'freelance-ingiltere-vize-basvurusu',
  title: 'Şahıs Şirketi Olmayan Freelance Çalışanlar İçin İngiltere Vize Başvurusu (2026)',
  description: 'Vergi kaydı veya şahıs şirketi olmadan freelance geliriyle İngiltere Standard Visitor vizesi nasıl alınır? Gerekli belgeler, banka ekstresi stratejisi ve sık ret sebepleri.',
  category: 'İngiltere',
  readingTime: 9,
  date: '2026-04-16',
  tags: ['freelance', 'İngiltere vizesi', 'UK visitor visa', 'serbest çalışan'],
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

const GELIR_BELGESI = [
  'Freelance sözleşmelerin ekran görüntüsü veya PDF\'i (Upwork, Fiverr, doğrudan sözleşme)',
  'Müşteri ödeme makbuzları / fatura kopyaları',
  'Son 6 aylık banka hesap dökümü (düzenli gelen freelance ödemeleri görünmeli)',
  'Payoneer / Wise / IBAN transferlerini gösteren hesap özetleri',
  'E-posta yazışmaları (müşteriyle uzun vadeli iş ilişkisi kanıtı)',
  'Portfolyo linki veya web sitesi (çalışma alanını ve uzmanlığı kanıtlar)',
];

const TEMEL_BELGELER = [
  'Geçerli pasaport (en az 6 ay geçerliliği olmalı)',
  'Online başvuru formu (GOV.UK üzerinden, eksiksiz)',
  'Biyometrik randevu onayı (VFS Global)',
  'Seyahat sigortası poliçesi',
  'Konaklama ve uçak rezervasyonları',
  'Niyet mektubu (seyahat amacı + freelance çalışma durumu açıklaması)',
  'Türkiye\'deki bağları gösteren belgeler (kira kontratı, tapu, aile)',
];

export default function FreelanceIngiltereVize() {
  return (
    <BlogPostLayout post={POST} schema={SCHEMA}>

      <p className="text-slate-700 leading-relaxed text-base mb-6">
        İngiltere vizesi söz konusu olduğunda büromuza en çok freelance çalışanlar gelir.
        Şahıs şirketi kurmadan, vergi levhası olmadan çalışıyorsunuz; gelir var ama kağıt yok.
        Peki UK Visas & Immigration bu durumu nasıl değerlendiriyor? Doğru belge stratejisiyle
        <strong> Standard Visitor Vizesi alabilirsiniz</strong> — yeter ki hikayeniz tutarlı olsun.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Neden Freelance Başvurular Reddediliyor?</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        İngiliz vize görevlisi dosyanıza baktığında aklında tek bir soru var: <em>"Bu kişi İngiltere'ye
        gelir, kalır mı?"</em> Freelance çalışan için en büyük risk şudur: sabit bir işveren yoktur,
        geri dönme mecburiyeti net değildir. Bunun üzerine bir de gelir belgesi eksikliği eklenince
        ret kaçınılmaz hale gelir.
      </p>
      <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-red-800 text-sm mb-1">En Yaygın Ret Sebepleri</p>
          <ul className="text-red-700 text-sm space-y-1 mt-1">
            <li>• Banka hesabında açıklanamayan büyük para transferleri</li>
            <li>• Gelir kaynağı ispatlanamıyor (sadece "serbest meslek" yazmak yetmiyor)</li>
            <li>• Türkiye'deki bağlar yetersiz gösterilmiş (kirasız, işsiz, bağsız görünüm)</li>
            <li>• Niyet mektubu yok veya çok genel kalıplarla yazılmış</li>
          </ul>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Gelir Kanıtı: Resmi Belge Olmadan Ne Sunulur?</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        İngiltere vizesi başvurusunda "resmi" bir vergi beyannamesi şart değil. Önemli olan
        <strong> gelirin düzenli, izlenebilir ve makul miktarda olduğunu kanıtlamaktır.</strong>
        Aşağıdaki belgeler bu amaca hizmet eder:
      </p>
      <ul className="space-y-2 mb-6">
        {GELIR_BELGESI.map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-blue-800 text-sm leading-relaxed">
          <strong>Altın kural:</strong> Banka hesabınızdaki gelen transferler ile sunduğunuz
          müşteri ödeme makbuzları birbiriyle örtüşmelidir. Hesapta düzenli 1.000 $ giriyor ama
          elinizde hiçbir iş belgesi yoksa bu durum soru işareti doğurur.
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Temel Belge Listesi</h2>
      <ul className="space-y-2 mb-8">
        {TEMEL_BELGELER.map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Banka Hesabı Stratejisi</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        İngiliz görevlileri özellikle son 3-6 ayın banka hareketlerine odaklanır. Hesabınızda şunlar
        görünmeli:
      </p>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6 space-y-3 text-sm text-slate-700">
        <div className="flex items-start gap-2">
          <span className="font-bold text-brand-600 shrink-0">1.</span>
          <p><strong>Düzenli gelir:</strong> Her ay belirli dönemlerde gelen freelance ödemeler. "Zaman zaman büyük para" değil, "periyodik küçük-orta ödemeler" güven verir.</p>
        </div>
        <div className="flex items-start gap-2">
          <span className="font-bold text-brand-600 shrink-0">2.</span>
          <p><strong>Stabil bakiye:</strong> Seyahat dönemi boyunca tüm masrafları karşılayacak tutar (İngiltere için günlük min. £80-100).</p>
        </div>
        <div className="flex items-start gap-2">
          <span className="font-bold text-brand-600 shrink-0">3.</span>
          <p><strong>Açıklanabilir hareketler:</strong> Büyük çekim veya yatırım varsa kaynağı belgelenebilir olmalı (satış bedeli, kira, birikim vb.).</p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Niyet Mektubu: Freelancer İçin Özel Notlar</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Niyet mektubunuz hem seyahat amacınızı hem de çalışma durumunuzu şeffaf biçimde açıklamalıdır.
        Saklamaya çalışmak yerine net ve dürüst olmak her zaman daha iyi sonuç verir.
      </p>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6 text-sm text-slate-700 space-y-2 leading-relaxed">
        <p className="italic text-slate-500">Örnek paragraf:</p>
        <p>"Türkiye'de dijital pazarlama alanında bağımsız danışmanlık yapıyorum. Müşterilerimle
        uzaktan çalıştığımdan ofise bağımlılığım yoktur. İngiltere seyahatim tamamen turistik
        amaçlıdır; X - Y tarihleri arasında Londra ve Edinburgh'u ziyaret etmeyi planlıyorum.
        Tüm masraflarımı kendi birikimimden karşılayacağım. Türkiye'de yürütmekte olduğum projeler
        ve ailem nedeniyle kesinlikle geri döneceğim."</p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Türkiye Bağını Güçlendirin</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Freelancer olmanın getirdiği "her yerden çalışabilir" imajı İngiliz görevlisinin gözünde
        risk faktörüdür. Bunu dengelemek için Türkiye'deki kökleri belgeleyin:
      </p>
      <ul className="space-y-2 mb-6">
        {[
          'Kira sözleşmesi veya tapu (Türkiye\'de kiracı/ev sahibi olduğunuzu gösterir)',
          'Türk müşterilerle aktif iş sözleşmeleri',
          'Aile bağı (anne-baba, eş, çocuk) — nüfus kayıt örneği',
          'Aktif bir Türk bankacılık geçmişi',
          'Vergi kaydı varsa ekleyin (şahıs şirketi olmasa bile basit gelir beyanı)',
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-6 flex gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-emerald-800 text-sm mb-1">Danışman İpucu</p>
          <p className="text-emerald-700 text-sm leading-relaxed">
            İngiltere'nin Avrupa'dan bağımsız vize sistemi olduğunu unutmayın. Schengen vizesi
            almış olsanız bile UK vizesi için ayrıca başvurmanız gerekir. Ancak geçmiş Schengen
            vizeleriniz dosyanıza güvenilirlik katar — mutlaka pasaportunuzdaki eski vizeleri
            gösterin.
          </p>
        </div>
      </div>

      <div className="mt-12 bg-brand-50 border border-brand-200 rounded-2xl p-6">
        <h3 className="font-bold text-brand-900 mb-2">Özet: Freelancer'ın Vize Formülü</h3>
        <p className="text-brand-800 text-sm leading-relaxed">
          Şahıs şirketi olmaması tek başına ret sebebi değildir. Önemli olan banka hesabınızdaki
          düzenli gelir izleri, müşteri ödeme belgeleri ve Türkiye'deki köklü bağlarınızın
          tutarlı biçimde sunulmasıdır. Niyet mektubunuzda çalışma durumunuzu gizlemeyin;
          şeffaf ve açıklayıcı olun. İngiliz sistemi hikayenizin tutarsızlığına çok hassastır.
        </p>
      </div>

    </BlogPostLayout>
  );
}
