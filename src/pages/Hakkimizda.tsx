import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Target, Brain, Users } from 'lucide-react';
import { SEO } from '../components/SEO';

const Hakkimizda: React.FC = () => (
  <div className="min-h-screen bg-slate-50">
    <SEO
      title="Hakkımızda | VizeAkıl"
      description="VizeAkıl, Türk vatandaşlarının Schengen, UK ve ABD vize başvurularını yapay zeka ile analiz etmelerine yardımcı olan bir platformdur."
      canonical="/hakkimizda"
    />
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 py-4">
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2 text-brand-600 font-bold hover:opacity-80 transition-opacity">
          <ArrowLeft className="w-5 h-5" /> Ana Sayfa
        </Link>
        <div className="h-4 w-px bg-slate-300" />
        <div className="flex items-center gap-2 text-slate-700 font-display font-bold text-lg">
          <ShieldCheck className="w-5 h-5 text-brand-600"/> VizeAkıl
        </div>
      </div>
    </nav>

    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Hakkımızda</h1>
      <p className="text-slate-500 mb-10 text-lg leading-relaxed">
        VizeAkıl, vize başvuru sürecini şeffaf ve erişilebilir hale getirmek için kuruldu.
      </p>

      <div className="space-y-8">
        {/* Misyon */}
        <div className="p-7 bg-white rounded-2xl border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-brand-600"/>
            </div>
            <h2 className="text-xl font-bold text-slate-900">Misyonumuz</h2>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Türkiye'den yurt dışına seyahat etmek isteyen her bireyin, pahalı vize danışmanı
            tutmadan başvurusunu hazırlayabilmesini sağlamak. Konsolosluk verilerini,
            gerçek başvuru deneyimlerini ve yapay zekayı bir araya getirerek
            başvuruculara nesnel bir ön değerlendirme sunuyoruz.
          </p>
        </div>

        {/* Nasıl çalışır */}
        <div className="p-7 bg-white rounded-2xl border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
              <Brain className="w-5 h-5 text-brand-600"/>
            </div>
            <h2 className="text-xl font-bold text-slate-900">Algoritmamız</h2>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Profilinizi birden çok boyutta değerlendiren, kamuya açık vize istatistikleri ve
            gerçek başvuru deneyimleriyle kalibre edilmiş yapay zeka destekli bir skorlama
            motoru kullanıyoruz. Hedef ülkeye göre ayrı ayrı ayarlanır ve size kişisel bir
            başarı tahmini sunar.
          </p>
          <p className="text-slate-500 text-sm leading-relaxed mt-3">
            Algoritmanın teknik ayrıntıları ticari sır kapsamındadır ve kötüye kullanımı
            önlemek için paylaşılmaz.
          </p>
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
            <strong>Önemli:</strong> Tüm skorlar istatistiksel tahmindir. Konsolosluk kararını garanti etmez.
          </div>
        </div>

        {/* Takım */}
        <div className="p-7 bg-white rounded-2xl border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-brand-600"/>
            </div>
            <h2 className="text-xl font-bold text-slate-900">Ekip</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: '[Kurucu Adı]', role: 'Kurucu & CEO', bio: 'Vize başvuru süreçlerinde 5+ yıl deneyim.' },
              { name: '[Teknik Kurucu]', role: 'CTO', bio: 'AI ve backend geliştirme uzmanı.' },
            ].map(m => (
              <div key={m.name} className="p-4 bg-slate-50 rounded-xl">
                <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center mb-3 font-bold text-brand-700">
                  {m.name[1]}
                </div>
                <div className="font-bold text-slate-900">{m.name}</div>
                <div className="text-xs text-brand-600 font-bold mb-1">{m.role}</div>
                <div className="text-xs text-slate-500">{m.bio}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link to="/iletisim"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-colors">
            İletişime Geç →
          </Link>
        </div>
      </div>
    </main>
  </div>
);

export default Hakkimizda;
