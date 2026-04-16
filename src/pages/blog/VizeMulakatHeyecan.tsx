import React from 'react';
import { AlertTriangle, CheckCircle2, Info, ShieldCheck } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'vize-mulakatinda-heyecan',
  title: 'Vize Mülakatında Heyecanlanmamak için Bilmeniz Gerekenler',
  description: 'ABD, İngiltere ve Schengen vize mülakatlarında heyecan neden tehlikelidir, mülakat soruları nasıl hazırlanır, beden dili ve cevap teknikleri nelerdir?',
  category: 'İpucu',
  readingTime: 7,
  date: '2026-04-16',
  tags: ['vize mülakatı', 'heyecan', 'ABD vizesi', 'mülakat soruları', 'ipucu'],
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

const SORULAR = [
  { s: 'Neden bu ülkeye gidiyorsunuz?', c: 'Kısa, net, turizm/ziyaret odaklı. "Müze gezmek, arkadaş ziyareti" gibi somut.' },
  { s: 'Ne kadar kalacaksınız?', c: 'Biletinizle örtüşen tarihi söyleyin. "14 gün, 3-15 Mayıs arası."' },
  { s: 'Masraflarınızı kim karşılıyor?', c: 'Kendiniz mi, sponsor mu? Net ve belgelerle desteklenmiş olsun.' },
  { s: 'İşiniz / okul durumunuz ne?', c: 'Sahip olduğunuz belgeyle tutarlı cevap. Yanınızda belge var.' },
  { s: 'Aileniz nerede?', c: 'Türkiye\'de aile var = güçlü geri dönüş mesajı. Bunu vurgulayın.' },
  { s: 'Daha önce reddedildiniz mi?', c: 'Evet ise dürüstçe söyleyin ve kısaca "o dönemde belge eksikti, şimdi tamamladım" deyin.' },
];

export default function VizeMulakatHeyecan() {
  return (
    <BlogPostLayout post={POST} schema={SCHEMA}>

      <p className="text-slate-700 leading-relaxed text-base mb-6">
        Vize mülakatına girenlerin büyük çoğunluğu o camın arkasındaki üniformalı kişiyi
        bir yargıç gibi görür. Oysa vize görevlisi bir anket uygulayıcısıdır: belirli sorular sorar,
        cevabınızın belgeleriyle tutarlı olup olmadığını kontrol eder. Heyecan doğal ve anlaşılırdır,
        ama <em>hazırlıklı olmak heyecanı yönetmenin tek yoludur.</em>
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Görevli Heyecanı Neden Farklı Okuyor?</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Vize görevlileri onlarca mülakatı art arda yapar. Heyecan mükemmel normal görünmez ama
        sorun da değildir — yeter ki heyecan çelişkili cevap doğurmasın. Asıl sorun şudur:
        heyecanlı insanlar aşırı konuşur, gereksiz bilgi verir ve yavaş yavaş kendileriyle
        çelişmeye başlar. <strong>Sade, kısa, tutarlı cevaplar</strong> hem güven verir hem de
        heyecanı yönetmeyi kolaylaştırır.
      </p>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-800 text-sm mb-1">Heyecanın Tetiklediği En Tehlikeli Hatalar</p>
          <ul className="text-amber-700 text-sm space-y-1 mt-1">
            <li>• Sorulmadan fazla bilgi vermek ("Aslında biraz da iş toplantısı var, arkadaşlarım da gidiyor, belki 2 hafta uzatabilirim…")</li>
            <li>• Sonradan pişman olunacak itiraflar yapmak</li>
            <li>• Belgelerde yazanla söylediklerinin çelişmesi</li>
            <li>• Soruya farklı soru sorar gibi yanıt vermek</li>
          </ul>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Mülakat Öncesi Hazırlık: 3 Adım</h2>
      <div className="space-y-3 mb-8">
        {[
          { n: '1', b: 'Belgelerinizi ezberleyin, sıralayın', d: 'Pasaport, DS-160/form çıktısı, sigorta, rezervasyon, banka dökümü. Hangi sırada verilecek? Görevli bir şey istediğinde "bir dakika" demeden bulabilmeli.' },
          { n: '2', b: 'Cevaplarınızı tek cümleye indirin', d: '"Neden gidiyorsunuz?" — 3 cümleyle değil, 1 cümleyle yanıt verin. Fazla konuşmak sizi savunmaya geçirir.' },
          { n: '3', b: 'Belgelerle prova yapın', d: 'Bir arkadaşınıza sizi sorgulatın. Cevaplarınızın her belgeyle örtüştüğünden emin olun. Tutarsızlık görünce düzeltin.' },
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

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">En Sık Sorulan Sorular ve Yanıt Stratejisi</h2>
      <div className="space-y-3 mb-8">
        {SORULAR.map(({ s, c }) => (
          <div key={s} className="bg-white border border-slate-200 rounded-xl p-4 text-sm">
            <p className="font-semibold text-slate-800 mb-1">"{s}"</p>
            <p className="text-slate-600 leading-relaxed">{c}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Beden Dili: Küçük Detaylar, Büyük İzlenim</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm">
          <p className="font-semibold text-emerald-800 mb-2">Yapın</p>
          <ul className="space-y-1 text-emerald-700">
            <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0"/>Görevliyle göz teması kurun</li>
            <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0"/>Dik durun, elleri masanın üstünde tutun</li>
            <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0"/>Cevaplamadan önce 1-2 sn düşünün</li>
            <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0"/>Belge isterken sıralı dosyanızı açın</li>
            <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0"/>Konuşma hızınızı yavaşlatın</li>
          </ul>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm">
          <p className="font-semibold text-red-800 mb-2">Yapmayın</p>
          <ul className="space-y-1 text-red-700">
            <li className="flex items-start gap-1.5"><AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0"/>Çok hızlı, neredeyse ezberlenmiş gibi konuşmak</li>
            <li className="flex items-start gap-1.5"><AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0"/>Kolları kavuşturmak (savunmacı izlenimi)</li>
            <li className="flex items-start gap-1.5"><AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0"/>Telefona bakmak</li>
            <li className="flex items-start gap-1.5"><AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0"/>Soru bitmeden cevap vermeye çalışmak</li>
            <li className="flex items-start gap-1.5"><AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0"/>Çok fazla gülümseyerek samimiyetsiz görünmek</li>
          </ul>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">Dil Engeli: İngilizce Bilmiyorum, Ne Yapacağım?</h2>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-blue-800 text-sm leading-relaxed">
            ABD ve İngiltere mülakatlarında Türkçe konuşabilirsiniz — çoğu konsoloslukta
            Türkçe bilen görevli veya tercüman bulunur. Bunu önceden sormak, tercümanın hazır
            olmasını sağlar. Konuşamadığınız dilde cevap vermeye çalışmak yanlış kelime seçimi
            yaratabilir ve güven hissini düşürür. <strong>Ana dilinizde net olmak, kırık
            İngilizceden çok daha iyidir.</strong>
          </p>
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-8 flex gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-emerald-800 text-sm mb-1">Son Dakika Sakinleştirme Tekniği</p>
          <p className="text-emerald-700 text-sm leading-relaxed">
            Mülakata girmeden 5 dakika önce derin bir nefes alın ve şunu aklınıza kazıyın:
            <em> "Belgelerim eksiksiz, hikayem tutarlı. Sadece onaylayın diyorum."</em>
            Sizi test etmeye gelmediler — sizi anlamaya çalışıyorlar. Bu zihniyet değişikliği
            heyecanı yarıya indirir.
          </p>
        </div>
      </div>

      <div className="mt-12 bg-brand-50 border border-brand-200 rounded-2xl p-6">
        <h3 className="font-bold text-brand-900 mb-2">Mülakat Formülü: Az Konuş, Çok Belgele</h3>
        <p className="text-brand-800 text-sm leading-relaxed">
          Vize mülakatında kazandıran iki şey vardır: eksiksiz belgeler ve tutarlı cevaplar.
          Heyecanınız yoksa bile bunlar olmadan geçemezsiniz. Heyecanınız varsa ama bunlar
          varsa, geçersiniz. Hazırlık korkuyu bozar. Provasını yapın, sıralı gidin, kısa konuşun.
        </p>
      </div>

    </BlogPostLayout>
  );
}
