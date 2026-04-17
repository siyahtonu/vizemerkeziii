import React from 'react';
import { AlertTriangle, CheckCircle2, Info, Scale, FileText } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'vize-reddi-sonrasi-ne-yapmali-itiraz-rehberi',
  title: 'Vize Reddi Sonrası Ne Yapmalı? 2026 İtiraz ve Yeniden Başvuru Rehberi',
  description: 'Schengen, İngiltere, ABD ret kararları sonrası izlenecek adımlar: ret gerekçelerini anlama, itiraz dilekçesi yazma ve güçlü bir yeniden başvuru stratejisi.',
  category: 'Genel',
  readingTime: 10,
  date: '2026-04-17',
  tags: ['vize reddi', 'itiraz', 'yeniden başvuru', 'ret kodları'],
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
    {
      '@type': 'HowTo',
      name: 'Vize reddi sonrası ne yapmalı',
      step: [
        { '@type': 'HowToStep', name: 'Ret kararını oku', text: 'Ret mektubundaki kodu ve gerekçeyi anlayarak neyin eksik olduğunu tespit et.' },
        { '@type': 'HowToStep', name: 'İtiraz mı yeniden başvuru mu', text: 'Hata varsa itiraz, belge eksikliği varsa yeniden başvuru daha etkilidir.' },
        { '@type': 'HowToStep', name: 'Belgeleri güçlendir', text: 'Ret gerekçesine göre banka, iş veya bağ belgelerini kuvvetlendir.' },
        { '@type': 'HowToStep', name: 'Yeni başvuru yap', text: 'En az 1-3 ay bekle, farklı konsolosluk seçeneklerini değerlendir.' },
      ],
    },
  ],
};

export default function VizeReddiSonrasiNeYapmali() {
  return (
    <BlogPostLayout post={POST} schema={SCHEMA}>
      <p className="text-slate-700 leading-relaxed text-base mb-6">
        Vize reddi almak ne sizin kişisel başarısızlığınızdır ne de bir daha asla onay alamayacağınız
        anlamına gelir. Aksine, ret mektubu size <strong>neyin eksik olduğunu söyleyen en değerli
        geri bildirimdir.</strong> Önemli olan bu bilgiyi doğru okumak ve bir sonraki adımı stratejik
        olarak atmaktır. Bu rehber size reddin ilk 72 saatinde ve sonraki haftalarda yapmanız
        gerekenleri adım adım gösterir.
      </p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-amber-900 text-sm leading-relaxed">
          <strong>İlk kural: Panik yapmayın.</strong> Ret almak "vize geçmişini bozmaz";
          tersine aynı hatayı tekrarlamadan ikinci başvuruya gitmek profilinizi güçlendirir.
          Türkiye'de ilk başvurularının %15-20'si reddedilir — reddiniz istatistiksel olarak normaldir.
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">1. Ret Mektubunu Doğru Okuyun</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Schengen reddinde mektupta C1-C14 arası kod yer alır. Her kod farklı bir eksiği temsil eder:
      </p>
      <div className="space-y-2 mb-8 text-sm">
        {[
          { k: 'C1', a: 'Seyahat belgesi sahte/geçersiz', c: 'Pasaport problemi' },
          { k: 'C2', a: 'Seyahat amacı kanıtlanmadı', c: 'Otel/uçak rezervasyonu/niyet mektubu yetersiz' },
          { k: 'C3', a: 'Konaklama kanıtı yetersiz', c: 'Otel rezervasyonu iptal edilmiş veya sahte' },
          { k: 'C4', a: 'Maddi yeterlilik kanıtlanmadı', c: 'Banka ekstresi yetersiz veya tutarsız' },
          { k: 'C7', a: 'Dönüş güvencesi zayıf', c: 'Türkiye\'deki bağlar yeterince belgelenmedi' },
          { k: 'C8', a: 'Madde 8 - sahte bilgi', c: 'Önceki ret beyan edilmedi veya yanlış bilgi verildi' },
          { k: 'C14', a: 'Güvenlik/kamu düzeni', c: 'Sabıka veya göç geçmişi' },
        ].map(({ k, a, c }) => (
          <div key={k} className="bg-white border border-slate-200 rounded-xl p-3 flex items-start gap-3">
            <span className="bg-red-100 text-red-700 font-bold text-xs px-2.5 py-1 rounded">{k}</span>
            <div className="flex-1">
              <p className="font-semibold text-slate-800">{a}</p>
              <p className="text-slate-500 text-xs">{c}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">2. İtiraz mı Yoksa Yeniden Başvuru mu?</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Scale className="w-5 h-5 text-blue-600" />
            <p className="font-semibold text-blue-900">İtiraz (Remonstrance)</p>
          </div>
          <p className="text-sm text-blue-800 mb-2">Konsolosluk bir hata yaptığında kullanılır.</p>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Ret gerekçesi haksız/yanlış</li>
            <li>• Belgeleriniz eksiksiz sunulmuştu</li>
            <li>• 30-60 gün içinde yapılmalı</li>
            <li>• Cevap 1-3 ay sürebilir</li>
          </ul>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            <p className="font-semibold text-emerald-900">Yeniden Başvuru</p>
          </div>
          <p className="text-sm text-emerald-800 mb-2">Belge eksikliği veya zayıf başvuruda.</p>
          <ul className="text-sm text-emerald-700 space-y-1">
            <li>• Eksik belgeyi tamamlayabiliyorsunuz</li>
            <li>• Profilinizi güçlendirdiniz</li>
            <li>• En az 1-3 ay beklemek mantıklı</li>
            <li>• Ret gerekçesine göre hareket edin</li>
          </ul>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">3. İtiraz Dilekçesi Nasıl Yazılır?</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        İyi bir itiraz dilekçesi <strong>duygusal değil, olgusaldır.</strong> Şu yapıyı izleyin:
      </p>
      <ol className="space-y-3 mb-6 text-sm text-slate-700">
        <li><strong>Giriş:</strong> Başvuru tarihi, başvuru numarası, ret tarihi — net kimlik bilgileri.</li>
        <li><strong>Ret gerekçesine atıf:</strong> "Ret mektubunda belirtilen C4 gerekçesi..."</li>
        <li><strong>Karşı-argüman:</strong> "Banka ekstremde ... EUR bakiye vardı, günlük €120 için X gün seyahat yeterlidir."</li>
        <li><strong>Ek belge referansı:</strong> Yeni sunulan veya göz ardı edilmiş belgelere atıf.</li>
        <li><strong>Kapanış:</strong> Karar gözden geçirme talebi + saygılı ton.</li>
      </ol>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6 text-sm text-slate-700">
        <p className="font-semibold mb-1">Örnek giriş cümlesi:</p>
        <p className="italic">"Sayın Konsolosluk, ... tarihinde yapmış olduğum ... numaralı başvurumun reddine dair ...
        tarihli kararınıza istinaden aşağıdaki hususları dikkatinize sunmak isterim..."</p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">4. Yeniden Başvuru Stratejisi</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Ret gerekçesine göre yeniden başvuruda hamlelerinizi belirleyin:
      </p>
      <div className="space-y-3 mb-8">
        {[
          { g: 'C2 (Seyahat amacı)', h: 'Detaylı seyahat planı, orijinal otel rezervasyonu, gidilecek yerlerin listesi, mümkünse gidilecek müze/etkinliklerin rezervasyonu.' },
          { g: 'C4 (Maddi yeterlilik)', h: 'Banka ekstresini 3 ay bekleterek güçlendirin; ek gelir kaynağı (kira, yatırım) belgeleri ekleyin; sponsor değerlendirin.' },
          { g: 'C7 (Dönüş güvencesi)', h: 'İşveren mektubu (tatil onayı), SGK hizmet dökümü, tapu/araç ruhsatı, aile belgeleri ekleyin.' },
          { g: 'C8 (Sahte bilgi)', h: 'ÇOK zor durum. Yeni başvuruda eski reddi açıkça beyan edin, hangi bilginin hata olduğunu açıklayın.' },
        ].map(({ g, h }) => (
          <div key={g} className="bg-white border border-slate-200 rounded-xl p-4 text-sm">
            <p className="font-semibold text-slate-800 mb-1">{g}</p>
            <p className="text-slate-600 leading-relaxed">{h}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">5. Farklı Konsolosluk Seçeneği</h2>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-blue-900 text-sm mb-1">Cascade taktiği</p>
          <p className="text-blue-800 text-sm leading-relaxed">
            Almanya reddettiyse İtalya veya Yunanistan'a başvurabilirsiniz <strong>ancak</strong>
            Schengen kurallarına göre ana hedef ülkesi gidilecek ülke olmalıdır. Sahte plan kurmayın:
            "Asıl İtalya'ya gitmek istiyorum, Almanya'yı iptal ettim" gibi mantıklı bir anlatı olsun.
          </p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">6. Önceki Reddi Asla Saklamayın</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        Başvuru formunda "Daha önce vize reddi aldınız mı?" sorusuna EVET yanıtı verin ve hangi ülke,
        ne zaman olduğunu yazın. Bu bilgi konsolosluklar arası paylaşılır; yalan söylemek Madde 8
        (sahte bilgi) gerekçesiyle kesin reddi getirir ve gelecekte de sizi takip eder.
      </p>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-8 flex gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-emerald-800 text-sm mb-1">Danışman Tavsiyesi</p>
          <p className="text-emerald-700 text-sm leading-relaxed">
            İki ret üst üste geldiyse profesyonel danışman desteği almayı düşünün. Üç reddin ardından
            Schengen sisteminde "high risk" etiketi alırsınız ve sonraki başvurular çok daha zor
            olacaktır. İlk rette müdahale etmek, üçüncüyü beklemekten çok daha ucuzdur.
          </p>
        </div>
      </div>

      <div className="mt-12 bg-brand-50 border border-brand-200 rounded-2xl p-6">
        <h3 className="font-bold text-brand-900 mb-2">Özet Kontrol Listesi</h3>
        <ul className="text-brand-800 text-sm space-y-1">
          <li>✔ Ret mektubundaki kodu doğru okudum</li>
          <li>✔ İtiraz mı yeniden başvuru mu kararı verdim</li>
          <li>✔ Eksik belgeleri tamamladım ve güçlendirdim</li>
          <li>✔ En az 1-3 ay beklemeyi planladım</li>
          <li>✔ Yeni başvuruda eski reddi beyan ettim</li>
        </ul>
      </div>
    </BlogPostLayout>
  );
}
