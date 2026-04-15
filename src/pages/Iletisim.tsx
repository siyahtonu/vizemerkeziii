import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Mail, MessageSquare, MapPin, Clock } from 'lucide-react';
import { SEO } from '../components/SEO';

const Iletisim: React.FC = () => {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: backend form gönderimi
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO
        title="İletişim | VizeAkıl"
        description="VizeAkıl ile iletişime geçin. Vize başvurusu, teknik destek ve genel sorularınız için bize ulaşın."
        canonical="/iletisim"
      />
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 text-brand-600 font-bold hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5" /> Ana Sayfa
          </Link>
          <div className="h-4 w-px bg-slate-300" />
          <div className="flex items-center gap-2 text-slate-700 font-display font-black text-lg">
            <ShieldCheck className="w-5 h-5 text-brand-600"/> VizeAkıl
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-black text-slate-900 mb-2">İletişim</h1>
        <p className="text-slate-500 mb-10">Sorularınız, geri bildirimleriniz veya iş birliği teklifleriniz için.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Sol: İletişim bilgileri */}
          <div className="space-y-6">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-5">
              <a href="mailto:destek@vizeakil.com"
                className="flex items-center gap-3 text-slate-700 hover:text-brand-600 transition-colors">
                <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-brand-600"/>
                </div>
                <div>
                  <div className="font-black text-sm">E-posta</div>
                  <div className="text-sm text-slate-500">destek@vizeakil.com</div>
                </div>
              </a>

              <a href="https://wa.me/905000000000" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 text-slate-700 hover:text-emerald-600 transition-colors">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-emerald-600"/>
                </div>
                <div>
                  <div className="font-black text-sm">WhatsApp Destek</div>
                  <div className="text-sm text-slate-500">+90 (500) 000 00 00</div>
                </div>
              </a>

              <div className="flex items-center gap-3 text-slate-700">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-slate-500"/>
                </div>
                <div>
                  <div className="font-black text-sm">Destek Saatleri</div>
                  <div className="text-sm text-slate-500">Hafta içi 09:00 – 18:00</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-700">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-slate-500"/>
                </div>
                <div>
                  <div className="font-black text-sm">Şirket Bilgileri</div>
                  <div className="text-xs text-slate-500 leading-relaxed mt-0.5">
                    [Şirket Adı A.Ş.]<br/>
                    Vergi No: [Vergi Dairesi / No]<br/>
                    MERSİS: [No]<br/>
                    [İl, Türkiye]
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ: Form */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200">
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 py-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-emerald-600"/>
                </div>
                <h3 className="font-black text-slate-900 text-lg">Mesajınız İletildi!</h3>
                <p className="text-slate-500 text-sm text-center">En geç 24 saat içinde dönüş yapacağız.</p>
                <button onClick={() => { setSent(false); setForm({ name:'', email:'', subject:'', message:'' }); }}
                  className="px-5 py-2 bg-slate-100 rounded-xl font-bold text-sm text-slate-700 hover:bg-slate-200">
                  Yeni Mesaj
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-black text-slate-900">Mesaj Gönder</h3>
                {[
                  { key: 'name', label: 'Ad Soyad', type: 'text', placeholder: 'Adınız' },
                  { key: 'email', label: 'E-posta', type: 'email', placeholder: 'ornek@email.com' },
                  { key: 'subject', label: 'Konu', type: 'text', placeholder: 'Konu başlığı' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-bold text-slate-600 mb-1">{f.label}</label>
                    <input
                      type={f.type}
                      required
                      placeholder={f.placeholder}
                      value={form[f.key as keyof typeof form]}
                      onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Mesajınız</label>
                  <textarea
                    required rows={4}
                    placeholder="Mesajınızı buraya yazın..."
                    value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                  />
                </div>
                <button type="submit"
                  className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-black rounded-xl transition-colors">
                  Gönder →
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Iletisim;
