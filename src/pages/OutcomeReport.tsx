import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, CheckCircle2, XCircle, Clock, Send, AlertTriangle } from 'lucide-react';
import { SEO } from '../components/SEO';
import { apiUrl } from '../lib/api';

type Outcome = 'onay' | 'ret' | 'bekliyor';

interface RejectionCode {
  code: string;
  label: string;
}

const FALLBACK_CODES: RejectionCode[] = [
  { code: 'C1',     label: 'C1 — Seyahat amacı inandırıcı değil' },
  { code: 'C2',     label: 'C2 — Finansal yetersizlik' },
  { code: 'C4',     label: 'C4 — Geri dönüş niyeti kanıtlanamadı' },
  { code: 'C5',     label: 'C5 — Önceki süre aşımı / kural ihlali' },
  { code: 'C7',     label: 'C7 — Sigorta eksik / yetersiz' },
  { code: 'C8',     label: 'C8 — Konaklama belgesi eksik' },
  { code: 'C9',     label: 'C9 — Davet mektubu eksik / geçersiz' },
  { code: 'UK-V4.2',label: 'UK V4.2 — Geri dönüş niyeti (UK)' },
  { code: 'UK-V4.3',label: 'UK V4.3 — Finansal yetersizlik (28 gün kuralı)' },
  { code: '214b',   label: 'ABD 214(b) — Geri dönüş bağı eksik' },
  { code: '221g',   label: 'ABD 221(g) — Ek belge talebi' },
  { code: 'DIGER',  label: 'Diğer / bilmiyorum' },
];

const OUTCOME_OPTIONS: Array<{
  val: Outcome;
  label: string;
  icon: React.ReactNode;
  activeCls: string;
  idleCls: string;
}> = [
  {
    val: 'onay',
    label: 'Onaylandı',
    icon: <CheckCircle2 className="w-5 h-5" />,
    activeCls: 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md',
    idleCls: 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300',
  },
  {
    val: 'ret',
    label: 'Reddedildi',
    icon: <XCircle className="w-5 h-5" />,
    activeCls: 'border-rose-500 bg-rose-50 text-rose-700 shadow-md',
    idleCls: 'border-slate-200 bg-white text-slate-600 hover:border-rose-300',
  },
  {
    val: 'bekliyor',
    label: 'Hâlâ Bekliyor',
    icon: <Clock className="w-5 h-5" />,
    activeCls: 'border-amber-500 bg-amber-50 text-amber-700 shadow-md',
    idleCls: 'border-slate-200 bg-white text-slate-600 hover:border-amber-300',
  },
];

const OutcomeReport: React.FC = () => {
  const [params] = useSearchParams();
  const id = params.get('id') ?? '';
  const token = params.get('token') ?? '';
  const initialOutcome = params.get('outcome') as Outcome | null;

  const [outcome, setOutcome] = useState<Outcome | ''>(
    initialOutcome && ['onay', 'ret', 'bekliyor'].includes(initialOutcome) ? initialOutcome : '',
  );
  const [codes, setCodes] = useState<RejectionCode[]>(FALLBACK_CODES);
  const [rejectionCode, setRejectionCode] = useState('');
  const [rejectionNotes, setRejectionNotes] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Backend'den güncel ret kodu listesini çek (opsiyonel — fallback var)
  useEffect(() => {
    let cancelled = false;
    fetch(apiUrl('/api/outcomes/codes'))
      .then(r => (r.ok ? r.json() : null))
      .then(d => {
        if (!cancelled && d && Array.isArray(d.codes) && d.codes.length > 0) {
          setCodes(d.codes as RejectionCode[]);
        }
      })
      .catch(() => { /* fallback kullanılır */ });
    return () => { cancelled = true; };
  }, []);

  const handleSubmit = async () => {
    if (!id) {
      setErrorMsg('Bu link geçersiz veya eksik. Lütfen e-postadaki tam linki kullanın.');
      setStatus('error');
      return;
    }
    if (!outcome) {
      setErrorMsg('Lütfen bir sonuç seçin.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch(apiUrl('/api/outcomes/submit'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          // token: yeni kayıtlarda e-posta linkinden gelir, eski kayıtlarda undefined'dir.
          // Backend token zorunluluğunu kaydın durumuna göre karar verir.
          token: token || undefined,
          outcome,
          rejectionCode: outcome === 'ret' ? (rejectionCode || undefined) : undefined,
          rejectionNotes: outcome === 'ret' ? (rejectionNotes.trim() || undefined) : undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus('success');
      } else {
        setErrorMsg(data?.error ?? 'Gönderim sırasında bir hata oluştu.');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Bağlantı hatası. Lütfen tekrar deneyin.');
      setStatus('error');
    }
  };

  const linkInvalid = !id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50">
      <SEO
        title="Sonuç Bildirimi | VizeAkıl"
        description="VizeAkıl başvuru sonucunuzu bildirin — algoritmamızı gerçek vakalarla iyileştiriyoruz."
        canonical="/sonuc-bildir"
        noIndex
      />

      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 text-brand-600 font-bold hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5" /> Ana Sayfa
          </Link>
          <div className="h-4 w-px bg-slate-300" />
          <div className="flex items-center gap-2 text-slate-700 font-display font-bold text-lg">
            <ShieldCheck className="w-5 h-5 text-brand-600" /> VizeAkıl
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        {status === 'success' ? (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 sm:p-10 text-center space-y-4">
            <div className="text-6xl mb-2">🎉</div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {outcome === 'onay'
                ? 'Tebrikler! Harika bir haber.'
                : outcome === 'ret'
                  ? 'Teşekkürler, bilgileriniz kaydedildi.'
                  : 'Kaydedildi — sonuç belli olunca tekrar bildir.'}
            </h1>
            <p className="text-slate-600 leading-relaxed max-w-lg mx-auto">
              {outcome === 'onay'
                ? 'Onay haberinizi paylaştığınız için teşekkürler. Verileriniz, benzer profildeki başvuru sahiplerine daha doğru analiz sunmamıza yardım ediyor.'
                : outcome === 'ret'
                  ? 'Üzgünüz. Ret nedenini paylaştığınız için minnettarız — bu bilgi, ret kodlarının güncel dağılımını takip etmemizi ve daha hassas tahmin yapmamızı sağlıyor.'
                  : 'Başvurunuz hâlâ sonuçlanmamışsa, sonucu öğrenir öğrenmez aynı linke dönüp güncellemeniz yeterli.'}
            </p>
            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-sm text-indigo-700 max-w-md mx-auto">
              <strong>🔒 Gizlilik:</strong> Yanıtınız tamamen anonim olarak işlendi. Adınız, pasaport numaranız veya kişisel detaylarınız saklanmıyor.
            </div>
            <div className="pt-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-colors"
              >
                Ana Sayfaya Dön
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                Başvurunuz Sonuçlandı mı?
              </h1>
              <p className="text-slate-500 text-sm sm:text-base">
                VizeAkıl'a kaydettiğiniz başvuruyla ilgili sonucu paylaşın — algoritmamızı gerçek vakalarla kalibre ediyoruz.
              </p>
            </div>

            {linkInvalid && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <strong className="block mb-1">Link eksik veya geçersiz</strong>
                  Bu sayfayı doğrudan açtınız veya link eksik. E-postadaki tam linki kullanmanız gerekiyor. Alternatif olarak Panel'den de bildirebilirsiniz.
                  <Link to="/panel" className="underline font-bold ml-1">Panel'e git →</Link>
                </div>
              </div>
            )}

            {!linkInvalid && (
              <>
                <div className="mb-6">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
                    Başvuru Durumu
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {OUTCOME_OPTIONS.map(opt => (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => setOutcome(opt.val)}
                        className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 font-bold text-sm transition-all ${
                          outcome === opt.val ? opt.activeCls : opt.idleCls
                        }`}
                      >
                        {opt.icon}
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {outcome === 'ret' && (
                  <div className="mb-6 space-y-3 p-4 bg-rose-50/50 border border-rose-100 rounded-xl">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">
                        Ret Kodu <span className="text-slate-400 normal-case font-normal">(biliyorsanız)</span>
                      </label>
                      <select
                        value={rejectionCode}
                        onChange={e => setRejectionCode(e.target.value)}
                        className="w-full border border-slate-200 bg-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                      >
                        <option value="">— Seçin (opsiyonel) —</option>
                        {codes.map(c => (
                          <option key={c.code} value={c.code}>{c.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">
                        Ek Not <span className="text-slate-400 normal-case font-normal">(opsiyonel)</span>
                      </label>
                      <textarea
                        value={rejectionNotes}
                        onChange={e => setRejectionNotes(e.target.value.slice(0, 500))}
                        rows={3}
                        placeholder="Ret mektubunda belirtilen ek bilgi veya izleniminiz..."
                        className="w-full border border-slate-200 bg-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none"
                      />
                      <div className="text-xs text-slate-400 mt-1 text-right">{rejectionNotes.length}/500</div>
                    </div>
                  </div>
                )}

                {outcome === 'onay' && (
                  <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-sm text-emerald-800">
                    🎊 Tebrikler! Aşağıdaki butonla sonucu gönderin ve istatistiklere katkıda bulunun.
                  </div>
                )}

                {outcome === 'bekliyor' && (
                  <div className="mb-6 p-4 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-800">
                    Sorun değil — sonuç belli olunca aynı linke dönüp güncelleyebilirsiniz.
                  </div>
                )}

                {status === 'error' && errorMsg && (
                  <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    {errorMsg}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!outcome || status === 'loading'}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {status === 'loading' ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Gönderiliyor...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Sonucu Bildir
                    </>
                  )}
                </button>

                <div className="mt-6 pt-6 border-t border-slate-100 text-xs text-slate-400 leading-relaxed">
                  <strong className="text-slate-600">🔒 Gizlilik:</strong> Yanıtınız tamamen anonim işlenir.
                  Adınız veya pasaport numaranız saklanmaz. Sadece ülke, skor aralığı ve ret kodu gibi
                  anonimleştirilebilir veriler istatistik için kullanılır.
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default OutcomeReport;
