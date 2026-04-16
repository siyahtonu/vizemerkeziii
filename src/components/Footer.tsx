import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Sol: Marka + Yasal uyarı */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white font-display font-black text-xl">
              <div className="w-8 h-8 bg-brand-600 rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
              VizeAkıl
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              VizeAkıl, bağımsız bir dijital asistandır. Resmi vize otoritesi değildir;
              konsolosluk adına işlem yapmaz, hukuki tavsiye vermez.
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Sunulan başarı oranları ve analizler, geçmiş istatistiksel verilere dayalı
              tahmindir. Konsolosluğun nihai kararını öngörmez ve garanti etmez.
              Başvuru sahibi beyanlarından bizzat sorumludur.
            </p>
          </div>

          {/* Orta: Kurumsal linkler */}
          <div>
            <div className="font-bold text-white text-sm uppercase tracking-wider mb-4">Kurumsal</div>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Blog', href: '/blog' },
                { label: 'İletişim', href: '/iletisim' },
                { label: 'Hakkımızda', href: '/hakkimizda' },
                { label: 'KVKK Aydınlatma Metni', href: '/kvkk' },
                { label: 'Gizlilik Politikası', href: '/gizlilik-politikasi' },
                { label: 'Kullanım Koşulları', href: '/kullanim-kosullari' },
                { label: 'Mesafeli Satış Sözleşmesi', href: '/mesafeli-satis' },
                { label: 'Çerez Politikası', href: '/cerez-politikasi' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link to={href} className="text-slate-400 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sağ: İletişim */}
          <div>
            <div className="font-bold text-white text-sm uppercase tracking-wider mb-4">İletişim</div>
            <div className="space-y-3 text-sm">
              <a href="mailto:destek@vizeakil.com"
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                <Mail className="w-4 h-4 shrink-0"/>
                destek@vizeakil.com
              </a>
              <a href="https://wa.me/905000000000" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp Destek
              </a>
              <div className="pt-2 border-t border-slate-800 text-xs text-slate-500 space-y-1 leading-relaxed">
                <div>Şirket Ünvanı: <span className="text-slate-400">[Şirket Adı A.Ş.]</span></div>
                <div>Vergi No: <span className="text-slate-400">[Vergi Dairesi — No]</span></div>
                <div>MERSİS: <span className="text-slate-400">[MERSİS No]</span></div>
                <div>Adres: <span className="text-slate-400">[İl, Türkiye]</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Alt satır */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>© {year} VizeAkıl — Tüm hakları saklıdır.</span>
          <span>
            Kaynak: Schengen Visa Statistics, EU Commission 2024-2026. Geçmiş veri; bireysel sonuç garanti edilmez.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
