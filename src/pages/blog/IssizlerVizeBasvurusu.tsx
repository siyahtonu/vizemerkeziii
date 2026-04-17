import React from 'react';
import { CheckCircle2, Info, AlertTriangle, Users, Heart } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'issizler-ve-calismayanlar-icin-vize',
  title: 'İşsizler ve Çalışmayanlar İçin Vize Başvurusu — 2026 Rehberi',
  description: 'İş kaybı sonrası, mezun olmuş ama iş bulamamış veya kendi isteğiyle çalışmayan kişiler için Schengen ve diğer ülkelere vize başvurusu stratejisi.',
  category: 'Genel',
  readingTime: 9,
  date: '2026-04-17',
  tags: ['işsiz vize', 'çalışmayan', 'sponsor', 'Schengen'],
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

export default function IssizlerVizeBasvurusu() {
  return (
    <BlogPostLayout post={POST} schema={SCHEMA}>
      <p className="text-slate-700 leading-relaxed text-base mb-6">
        "Çalışmıyorum, vize alamam" — bu yaygın yanılgı pek çok iyi başvuruyu daha başlamadan
        engelliyor. Gerçek şu: İşsizlik tek başına ret sebebi değildir. Konsolosluk "çalışıyor
        mu çalışmıyor mu" sorusunun ötesine bakar ve asıl cevabını "dönüş güvencesi ve masrafların
        nasıl karşılanacağı" sorusunda arar. Bu rehber, geçici veya kalıcı olarak çalışmayan
        kişilerin başvuru stratejisini gösterir.
      </p>

      <div className="bg-brand-50 border border-brand-200 rounded-xl p-5 mb-8 flex gap-3">
        <Heart className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
        <p className="text-brand-900 text-sm leading-relaxed">
          <strong>Altın kural:</strong> İşsizlik = finansal eksikliktir; bağ eksikliği değil.
          Finansal eksikliği sponsor ile, bağ eksikliğini aile, mülk, okul ile kapatın.
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">1. İşsizlik Türleri ve Yaklaşım</h2>
      <div className="space-y-3 mb-8">
        {[
          { tur: 'Yeni mezun (iş aramada)', s: 'Diploma + aile sponsoru + ebeveyn banka dökümü. Yaş genç olduğu için tolerans yüksek.' },
          { tur: 'İşten çıkarılmış (son 6 ay)', s: 'İşsizlik maaşı belgesi + eski işverenden tavsiye mektubu + birikim dökümü.' },
          { tur: 'Uzun süreli işsiz (1+ yıl)', s: 'Sponsor şart. Sağlam mülk belgesi, aile bağı ve birikim kritik.' },
          { tur: 'Kendi isteğiyle çalışmayan', s: 'Mülk geliri, yatırım getirisi, eş geliri belgeleri ön plana çıkarılmalı.' },
          { tur: 'Ev hanımı', s: 'Eş sponsorluğu + çocuklar + evlilik cüzdanı tam belge seti.' },
          { tur: 'Emekli', s: 'SGK emekli belgesi + maaşın düzenli yattığı banka + torunlar.' },
        ].map(({ tur, s }) => (
          <div key={tur} className="bg-white border border-slate-200 rounded-xl p-4 text-sm">
            <p className="font-semibold text-slate-800 mb-1">{tur}</p>
            <p className="text-slate-600">{s}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">2. Sponsor Olmazsa Olmaz</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        İşsizseniz banka dökümünüz tek başına genelde yeterli değildir. Sponsor paketinizi tam
        sunun:
      </p>
      <ul className="space-y-2 mb-6">
        {[
          'Noter onaylı sponsor taahhüt mektubu (Türkçe + İngilizce)',
          'Sponsorun 6 aylık banka dökümü (kaşeli)',
          'Sponsorun SGK hizmet dökümü veya vergi levhası',
          'Sponsorun son 3 maaş bordrosu',
          'Sponsorun tapu/araç ruhsatı (varlık kanıtı)',
          'Akrabalık belgesi (1. derece akraba idealdir)',
          'Akrabalık 1. derece değilse nüfus kayıt örneği ile ilişki göster',
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">3. Türkiye'ye Bağ Kanıtları</h2>
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-6 flex gap-3">
        <Users className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-emerald-800 text-sm mb-1">İşsiz ama "bağlı" olmanızı kanıtlayan belgeler</p>
          <ul className="text-emerald-700 text-sm space-y-1 mt-1">
            <li>• Tapu (kendi adınıza veya yakın aileye ait)</li>
            <li>• Araç ruhsatı</li>
            <li>• Evlilik cüzdanı</li>
            <li>• Çocukların okul kayıt belgesi</li>
            <li>• Türkiye'deki yaşlı anne/baba bakımı belgesi</li>
            <li>• Kira kontratı (kiracı iseniz de stabiliteyi gösterir)</li>
            <li>• Kredili mülk alımı — ileride ödenecek kredi Türkiye\'de kalma sebebi</li>
          </ul>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">4. Banka Dökümü Stratejisi</h2>
      <p className="text-slate-700 leading-relaxed mb-4">
        İşsiz olsanız da banka hareketleriniz hikayenizi anlatır. Önerilen yaklaşım:
      </p>
      <div className="space-y-3 mb-8">
        {[
          { n: '1', b: 'Birikim hesabı açın', d: 'En az 50.000-100.000 TL birikim yaparak "birikim kültürü" gösterin.' },
          { n: '2', b: 'Düzenli hareket yaratın', d: 'Aile desteği bile olsa aylık düzenli giriş görünsün.' },
          { n: '3', b: 'Fatura ödemeleri', d: 'Kart ekstresinde elektrik, su, telefon, kira ödemeleri "yaşıyorum" sinyali.' },
          { n: '4', b: 'Son dakika büyük para yatırmayın', d: 'Başvurudan 1 ay önce birden 200.000 TL yatmak = kırmızı bayrak.' },
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

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">5. Başvuru Formundaki "Meslek" Sorusu</h2>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6 flex gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-800 text-sm mb-1">Doğru ifade önemlidir</p>
          <ul className="text-amber-700 text-sm space-y-1 mt-1">
            <li>• "İşsiz" yerine "İş arayan" (Seeking employment)</li>
            <li>• "Çalışmıyor" yerine "Ev hanımı" (Homemaker) — kadınlar için</li>
            <li>• "Boşta" yerine "Özel sebepli ara" (Career break)</li>
            <li>• Mezun olmuş iş arıyorsanız "Recent graduate" yazın</li>
            <li>• "Student (mezun)" — bazı ülkeler için kullanılabilir</li>
          </ul>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">6. En Uygun Ülkeler</h2>
      <div className="space-y-3 mb-8">
        {[
          { u: 'Yunanistan', n: 'Kapı vizesi seçeneği sezonluk; onay oranı yüksek.' },
          { u: 'İtalya', n: 'Sponsor belgelerine toleranslı, ev hanımlarına kolay.' },
          { u: 'İspanya', n: 'Aile ziyareti başvurularında esnek.' },
          { u: 'Letonya/Litvanya', n: '%95 onay oranı, düşük yoğunluk.' },
          { u: 'Hırvatistan', n: 'Yeni Schengen üyesi, Türklere olumlu yaklaşım.' },
        ].map(({ u, n }) => (
          <div key={u} className="bg-white border border-slate-200 rounded-xl p-4 text-sm">
            <p className="font-semibold text-slate-800 mb-1">{u}</p>
            <p className="text-slate-600">{n}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">7. Kaçınılması Gereken Ülkeler</h2>
      <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-red-800 text-sm mb-1">İşsizlerin en çok reddedildiği ülkeler</p>
          <ul className="text-red-700 text-sm space-y-1 mt-1">
            <li>• Belçika — %30+ ret oranı işsizler için</li>
            <li>• Almanya — maddi yeterlilik çok sıkı</li>
            <li>• Hollanda — sponsor formu (garantstelling) gerektiriyor</li>
            <li>• Danimarka — en yüksek ret oranı</li>
            <li>• İsveç — işsizlik yüksek risk olarak görülüyor</li>
          </ul>
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-8 flex gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-emerald-800 text-sm mb-1">Danışman İpucu</p>
          <p className="text-emerald-700 text-sm leading-relaxed">
            İşsiz değilseniz ama işvereninizle aranız iyi değilse, başvurudan önce pozisyonu
            netleştirin. İşverenden izin belgesi alamayacağınız zor bir durumdaysanız, başvurudan
            önce işten ayrılıp "emeklilik planı" veya "kendi işini kurma" gibi bir durum belgesi
            hazırlamak ret riskini azaltır.
          </p>
        </div>
      </div>

      <div className="mt-12 bg-brand-50 border border-brand-200 rounded-2xl p-6">
        <h3 className="font-bold text-brand-900 mb-2">Özet</h3>
        <p className="text-brand-800 text-sm leading-relaxed">
          İşsiz olmak vize başvurusunda otomatik ret değildir. Sponsor + sağlam Türkiye bağları +
          stratejik ülke seçimi üçlüsüyle onay oranı %80'e kadar çıkabilir. Önemli olan "İşsizim
          ama geri dönecek düzenim var" hikayesini belgelerle kanıtlamaktır.
        </p>
      </div>
    </BlogPostLayout>
  );
}
