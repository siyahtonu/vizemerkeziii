import React from 'react';
import { CheckCircle2, Info, FileText, AlertTriangle, PenLine } from 'lucide-react';
import BlogPostLayout from './BlogPostLayout';
import { BlogPost } from './BlogIndex';

export const POST: BlogPost = {
  slug: 'sponsor-dilekcesi-nasil-yazilir-ornek',
  title: 'Sponsor Dilekçesi Nasıl Yazılır? Örnek Metin ve 2026 Rehber',
  description: 'Vize başvurusu için sponsor dilekçesi (taahhütname) nasıl yazılır, hangi bilgiler zorunludur, noter onayı gerekir mi — indirilebilir şablon ve örnekler.',
  category: 'İpucu',
  readingTime: 7,
  date: '2026-04-17',
  tags: ['sponsor dilekçesi', 'taahhütname', 'vize belgeleri', 'şablon'],
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

export default function SponsorDilekcesiOrnek() {
  return (
    <BlogPostLayout post={POST} schema={SCHEMA}>
      <p className="text-slate-700 leading-relaxed text-base mb-6">
        Sponsor dilekçesi (taahhütname), vize başvurusunda kişinin masraflarını başkasının
        karşılayacağını beyan eden resmi bir belgedir. Ev hanımları, öğrenciler, işsizler ve
        düşük gelirli başvurucular için kritiktir. Yanlış yazılmış veya eksik bilgili bir sponsor
        dilekçesi tüm başvuruyu geçersiz kılabilir. Bu rehber sponsor dilekçesinin nasıl
        yazılması gerektiğini, örnek metinleri ve yaygın hataları gösterir.
      </p>

      <div className="bg-brand-50 border border-brand-200 rounded-xl p-5 mb-8 flex gap-3">
        <PenLine className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
        <p className="text-brand-900 text-sm leading-relaxed">
          <strong>Kritik nokta:</strong> Sponsor dilekçesi tek başına yeterli değildir.
          Sponsor'un banka dökümü, gelir belgesi ve akrabalık belgesi ile desteklenmek zorundadır.
          Dilekçe bir "giriş", belgeler ise "ispat"tır.
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">1. Sponsor Dilekçesinde Olması Gerekenler</h2>
      <ul className="space-y-2 mb-6">
        {[
          'Sponsorun tam kimlik bilgileri (ad, soyad, TC kimlik no, doğum tarihi, adres)',
          'Sponsorun mesleği ve işyeri bilgisi',
          'Başvurucunun kimlik bilgileri (ad, soyad, pasaport no)',
          'Başvurucu ile sponsor arasındaki akrabalık ilişkisi',
          'Seyahat tarihleri (gidiş-dönüş) ve gidilecek ülke',
          'Hangi masrafları karşılayacak (uçak, otel, günlük, sigorta)',
          'Kısmi/tam sponsorluk olduğu',
          'Dilekçenin yazıldığı tarih ve imza',
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">2. Örnek Sponsor Dilekçesi (Türkçe)</h2>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6 text-sm text-slate-700 leading-relaxed">
        <p className="font-semibold mb-3">[Tarih: ...]</p>
        <p className="font-semibold mb-3">Sayın İtalya Büyükelçiliği Konsolosluk Birimi'ne,</p>
        <p className="mb-3">
          Ben, <strong>[Ad Soyad]</strong>, TC Kimlik No: <strong>[... 11 hane ...]</strong>,
          <strong> [Doğum Tarihi]</strong> doğumlu, <strong>[Ev Adresi]</strong> ikametgahında,
          <strong> [Meslek]</strong> olarak <strong>[İşyeri]</strong>'nde çalışmaktayım.
          Aşağıda bilgileri yer alan kişinin eşim/kızım/oğlum/babam/... olduğunu beyan ederim:
        </p>
        <div className="bg-white border border-slate-200 rounded p-3 mb-3">
          <p>Ad Soyad: <strong>[Başvurucu Ad Soyad]</strong></p>
          <p>TC Kimlik No: <strong>[...]</strong></p>
          <p>Pasaport No: <strong>[...]</strong></p>
          <p>Doğum Tarihi: <strong>[...]</strong></p>
          <p>Akrabalık: <strong>Eşim / Kızım / Oğlum / ...</strong></p>
        </div>
        <p className="mb-3">
          Eşimin/Kızımın/Oğlumun <strong>[Gidiş Tarihi] - [Dönüş Tarihi]</strong> tarihleri arasında
          <strong> [Ülke]</strong>'ye yapacağı turistik seyahatin tüm masraflarını (uçak bileti,
          konaklama, günlük harcamalar, seyahat sağlık sigortası) tarafımdan karşılanacağını
          kabul, beyan ve taahhüt ederim.
        </p>
        <p className="mb-3">
          Ekte banka hesap dökümüm, maaş bordrom, SGK hizmet dökümüm ve nüfus kayıt örneğim yer
          almaktadır.
        </p>
        <p className="mb-3">Saygılarımla,</p>
        <p className="mt-4">
          <strong>[Ad Soyad]</strong><br />
          İmza: _____________<br />
          Telefon: [...]<br />
          E-posta: [...]
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">3. İngilizce Versiyonu</h2>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6 text-sm text-slate-700 leading-relaxed">
        <p className="font-semibold mb-3">To the Consulate of [Country],</p>
        <p className="mb-3">
          I, <strong>[Full Name]</strong>, Turkish ID No: <strong>[...]</strong>, born on
          <strong> [DOB]</strong>, residing at <strong>[Address]</strong>, working as
          <strong> [Occupation]</strong> at <strong>[Employer]</strong>, hereby declare and
          undertake that I will fully cover all travel expenses (including flight tickets,
          accommodation, daily expenses, travel health insurance) of my <strong>spouse /
          daughter / son / ...</strong>, <strong>[Applicant Name]</strong> (Passport No:
          <strong> [...]</strong>), during his/her trip to <strong>[Country]</strong> between
          <strong> [Start Date]</strong> and <strong>[End Date]</strong>.
        </p>
        <p className="mb-3">
          Attached please find my bank statement, salary slip, employment certificate and
          family registry document.
        </p>
        <p className="mb-3">Sincerely,</p>
        <p>
          <strong>[Full Name]</strong><br />
          Signature: _____________<br />
          Phone: [...]<br />
          E-mail: [...]
        </p>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">4. Noter Onayı Gerekli mi?</h2>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6 flex gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-800 text-sm mb-1">Ülkeye göre değişir</p>
          <ul className="text-amber-700 text-sm space-y-1 mt-1">
            <li>• <strong>Schengen çoğu:</strong> Noter onayı önerilir ama zorunlu değildir.</li>
            <li>• <strong>Almanya, Hollanda:</strong> "Verpflichtungserklärung" / "Garantstelling" — resmi formda, belediyeden onaylı gerekli.</li>
            <li>• <strong>İngiltere:</strong> Noter onayı gerekli değil, imza yeterli.</li>
            <li>• <strong>ABD:</strong> I-134 formu (Affidavit of Support) önerilir ama zorunlu değildir.</li>
            <li>• <strong>Kanada:</strong> Noter onayı şiddetle önerilir.</li>
          </ul>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">5. Dilekçeye Eklenecek Belgeler</h2>
      <ul className="space-y-2 mb-6">
        {[
          'Sponsorun son 6 aylık banka dökümü (kaşeli, imzalı)',
          'Sponsorun SGK hizmet dökümü',
          'Sponsorun son 3 maaş bordrosu VEYA vergi levhası (serbest meslek)',
          'Sponsorun işveren yazısı (antetli, çalıştığına dair)',
          'Sponsorun pasaport fotokopisi veya kimlik fotokopisi',
          'Tapu fotokopisi (varsa — mülk kanıtı)',
          'Akrabalık belgesi (nüfus kayıt örneği, evlilik cüzdanı vs.)',
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">6. En Sık Yapılan Hatalar</h2>
      <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-red-800 text-sm mb-1">Dilekçeniz geçersiz sayılmasın</p>
          <ul className="text-red-700 text-sm space-y-1 mt-1">
            <li>• Tarih eksik veya güncel değil (1 aydan eski)</li>
            <li>• Sponsor'un imzası yok veya kopyalandığı belli</li>
            <li>• Akrabalık belirtilmemiş veya "arkadaş" yazılmış (kabul edilmeyebilir)</li>
            <li>• Hangi masrafları karşılayacağı spesifik değil</li>
            <li>• Başvurucunun kimlik bilgisi yanlış yazılmış</li>
            <li>• Banka dökümü ile dilekçe tutarsız (bakiye vaat edilenin altında)</li>
          </ul>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">7. Kimler Sponsor Olabilir?</h2>
      <div className="space-y-3 mb-8">
        {[
          { k: '1. Derece Akraba', n: 'Eş, anne, baba, oğul, kız — her konsoloslukta kabul edilir.' },
          { k: '2. Derece Akraba', n: 'Kardeş, dede, nine, amca, teyze — akrabalık belgesi ile.' },
          { k: '3. Derece Akraba', n: 'Kuzen — kabul edilir ama daha detaylı akrabalık belgesi gerekir.' },
          { k: 'Eş sayılan ilişki', n: 'Nikahsız birlikte yaşama — bazı ülkelerde (Hollanda, Almanya) tanınır; noter belgesi gerekir.' },
          { k: 'Arkadaş veya işveren', n: 'Çok zor. İş gezisi değilse kabul görmeyebilir.' },
        ].map(({ k, n }) => (
          <div key={k} className="bg-white border border-slate-200 rounded-xl p-4 text-sm">
            <p className="font-semibold text-slate-800 mb-1">{k}</p>
            <p className="text-slate-600">{n}</p>
          </div>
        ))}
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-8 flex gap-3">
        <FileText className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-emerald-800 text-sm mb-1">Danışman İpucu</p>
          <p className="text-emerald-700 text-sm leading-relaxed">
            Dilekçenizi el yazısıyla değil, bilgisayarda yazıp sadece imzayı elle atın. Mümkünse
            noterde onaylatın (50-100 TL). Konsolosluk "bu kişi gerçekten imzaladı mı"
            şüphesine düşmesin. İngilizce tercümesini de mutlaka ekleyin — bazı görevliler
            Türkçe anlamıyor ve önemli detayları kaçırabilir.
          </p>
        </div>
      </div>

      <div className="mt-12 bg-brand-50 border border-brand-200 rounded-2xl p-6">
        <h3 className="font-bold text-brand-900 mb-2">Özet</h3>
        <p className="text-brand-800 text-sm leading-relaxed">
          Sponsor dilekçesi iyi yazıldığında başvurunun belkemiğidir. 8 zorunlu bilgi +
          destekleyici belgeler + (gerekirse) noter onayı üçlüsüyle hazırlanan dilekçe,
          ev hanımı/öğrenci/işsiz başvurularının onay oranını %70'ten %90'a çıkarabilir.
          Şablonu kopyalayıp bilgilerinizi girerek hızlıca hazırlayabilirsiniz.
        </p>
      </div>
    </BlogPostLayout>
  );
}
