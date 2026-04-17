import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* Marka */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 font-display font-bold text-lg text-slate-900 mb-3">
              <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              VizeAkıl
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              AI destekli vize analiz motoru. Resmi vize otoritesi değildir.
            </p>
          </div>

          {/* Ürün */}
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Ürün</div>
            <ul className="space-y-2">
              {[
                { label: 'Blog', href: '/blog' },
                { label: 'Hakkımızda', href: '/hakkimizda' },
                { label: 'İletişim', href: '/iletisim' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link to={href} className="text-sm text-slate-600 hover:text-slate-900 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Yasal */}
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Yasal</div>
            <ul className="space-y-2">
              {[
                { label: 'KVKK', href: '/kvkk' },
                { label: 'Gizlilik', href: '/gizlilik-politikasi' },
                { label: 'Kullanım Koşulları', href: '/kullanim-kosullari' },
                { label: 'Çerez Politikası', href: '/cerez-politikasi' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link to={href} className="text-sm text-slate-600 hover:text-slate-900 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">İletişim</div>
            <ul className="space-y-2">
              <li>
                <a href="mailto:destek@vizeakil.com" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  destek@vizeakil.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-xs text-slate-400">© {year} VizeAkıl. Tüm hakları saklıdır.</span>
          <span className="text-[10px] text-slate-400">
            Kaynak: EU Commission Schengen Visa Statistics 2024-2026
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
