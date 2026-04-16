// ============================================================
// 404 — Sayfa Bulunamadı
// ============================================================
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Search, BookOpen, Zap } from 'lucide-react';
import { SEO } from '../components/SEO';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SEO
        title="Sayfa Bulunamadı (404) | VizeAkıl"
        description="Aradığınız sayfa bulunamadı."
        canonical="/404"
        noIndex
      />

      {/* Minimal nav */}
      <nav className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-brand-600 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            VizeAkıl
          </Link>
        </div>
      </nav>

      {/* 404 content */}
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-lg">

          {/* Animated 404 number */}
          <div className="relative mb-8 inline-block">
            <div className="text-[120px] sm:text-[160px] font-black text-slate-100 leading-none select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center border border-slate-100">
                <Search className="w-10 h-10 text-slate-400" />
              </div>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
            Sayfa bulunamadı
          </h1>
          <p className="text-slate-500 text-base leading-relaxed mb-8">
            Aradığınız sayfa taşınmış, silinmiş ya da hiç var olmamış olabilir.
            Ama vize başvurunuzu analiz etmek için doğru yerdesiniz!
          </p>

          {/* Quick actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-700 transition-colors"
            >
              <Zap className="w-4 h-4" />
              Ücretsiz Analiz Başlat
            </Link>
            <Link
              to="/blog"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Blog Yazıları
            </Link>
          </div>

          {/* Popular pages */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 text-left">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              Popüler Sayfalar
            </p>
            <div className="space-y-1.5">
              {[
                { to: '/basla',   label: 'Profil Analizi — Vize Başarı Skorunuzu Hesaplayın' },
                { to: '/panel',   label: 'Araçlar Paneli — 18 Vize Analiz Aracı' },
                { to: '/blog/schengen-vizesi-nasil-alinir', label: 'Schengen Vizesi Rehberi 2026' },
                { to: '/blog/almanya-vizesi-nasil-alinir-2026', label: 'Almanya Vizesi 2026' },
                { to: '/blog/abd-vizesi-nasil-alinir-2026', label: 'ABD Vizesi 2026' },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-2 text-sm text-brand-600 hover:text-brand-800 hover:underline transition-colors py-1"
                >
                  <ArrowLeft className="w-3 h-3 shrink-0" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
