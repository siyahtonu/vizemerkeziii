import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Lock, TrendingUp, AlertCircle, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { SEO } from '../components/SEO';

interface StatsResponse {
  total: number;
  withOutcome: number;
  responseRate: number;
  outcomes: { approved: number; rejected: number; pending: number };
  approvalRate: number | null;
  byCountry: Record<string, { total: number; approved: number; rejected: number }>;
  byScoreBucket: Record<string, { total: number; approved: number }>;
  rejectionCodes: Record<string, number>;
  note?: string;
}

const OutcomesStats: React.FC = () => {
  const [secret, setSecret] = useState('');
  const [data, setData] = useState<StatsResponse | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const load = async () => {
    if (!secret) return;
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/outcomes/stats', {
        headers: { 'x-admin-secret': secret },
      });
      if (res.status === 403) {
        setErrorMsg('Yanlış admin secret.');
        setStatus('error');
        return;
      }
      if (!res.ok) {
        setErrorMsg(`Sunucu hatası (${res.status})`);
        setStatus('error');
        return;
      }
      const json = await res.json();
      setData(json as StatsResponse);
      setStatus('idle');
    } catch {
      setErrorMsg('Bağlantı hatası.');
      setStatus('error');
    }
  };

  const sortedCountries = data
    ? Object.entries(data.byCountry).sort((a, b) => b[1].total - a[1].total)
    : [];

  const sortedRejCodes = data
    ? Object.entries(data.rejectionCodes).sort((a, b) => b[1] - a[1])
    : [];

  const bucketOrder = ['0-40', '40-60', '60-75', '75-85', '85-100'];

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO
        title="Outcomes Stats | VizeAkıl Admin"
        description="Başvuru sonuç istatistikleri — admin paneli."
        canonical="/admin/outcomes-stats"
        noIndex
      />

      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 text-brand-600 font-bold hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5" /> Ana Sayfa
          </Link>
          <div className="h-4 w-px bg-slate-300" />
          <div className="flex items-center gap-2 text-slate-700 font-display font-bold text-lg">
            <ShieldCheck className="w-5 h-5 text-brand-600" /> VizeAkıl Admin
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Lock className="w-6 h-6 text-indigo-600" />
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Başvuru Sonuç İstatistikleri</h1>
        </div>

        {!data && (
          <div className="max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
              Admin Secret
            </label>
            <input
              type="password"
              value={secret}
              onChange={e => setSecret(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') load(); }}
              placeholder=".env.local'daki ADMIN_SECRET"
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              onClick={load}
              disabled={!secret || status === 'loading'}
              className="w-full py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-40 transition-colors"
            >
              {status === 'loading' ? 'Yükleniyor...' : 'İstatistikleri Getir'}
            </button>
            {status === 'error' && errorMsg && (
              <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                {errorMsg}
              </div>
            )}
          </div>
        )}

        {data && (
          <div className="space-y-6">
            {/* Özet kartlar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Toplam Başvuru" value={data.total} icon={<TrendingUp className="w-5 h-5" />} color="indigo" />
              <StatCard label="Yanıt Oranı" value={`%${data.responseRate}`} icon={<CheckCircle2 className="w-5 h-5" />} color="emerald" sub={`${data.withOutcome}/${data.total}`} />
              <StatCard
                label="Onay Oranı"
                value={data.approvalRate !== null ? `%${data.approvalRate}` : '—'}
                icon={<CheckCircle2 className="w-5 h-5" />}
                color="green"
                sub={`${data.outcomes.approved} onay`}
              />
              <StatCard
                label="Ret Sayısı"
                value={data.outcomes.rejected}
                icon={<XCircle className="w-5 h-5" />}
                color="rose"
                sub={`${data.outcomes.pending} bekliyor`}
              />
            </div>

            {/* Ülke bazında */}
            <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Ülke Bazında Sonuçlar</h2>
              {sortedCountries.length === 0 ? (
                <p className="text-sm text-slate-500">Henüz ülke bazında veri yok.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-slate-500 uppercase tracking-wide border-b border-slate-200">
                        <th className="pb-3">Ülke</th>
                        <th className="pb-3 text-right">Toplam</th>
                        <th className="pb-3 text-right text-emerald-600">Onay</th>
                        <th className="pb-3 text-right text-rose-600">Ret</th>
                        <th className="pb-3 text-right">Onay %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedCountries.map(([country, row]) => {
                        const decided = row.approved + row.rejected;
                        const pct = decided > 0 ? Math.round((row.approved / decided) * 100) : null;
                        return (
                          <tr key={country} className="border-b border-slate-100">
                            <td className="py-2.5 font-semibold text-slate-800">{country}</td>
                            <td className="py-2.5 text-right text-slate-700">{row.total}</td>
                            <td className="py-2.5 text-right text-emerald-700 font-semibold">{row.approved}</td>
                            <td className="py-2.5 text-right text-rose-700 font-semibold">{row.rejected}</td>
                            <td className="py-2.5 text-right font-bold">
                              {pct !== null ? `%${pct}` : '—'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* Skor bucket bazında */}
            <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-2">Skor → Gerçek Onay Oranı (Kalibrasyon)</h2>
              <p className="text-xs text-slate-500 mb-4">
                VizeAkıl skorunun gerçek başvuru sonuçlarıyla ne kadar örtüştüğünü gösterir.
                İyi kalibre bir model: yüksek skor → yüksek onay oranı olmalı.
              </p>
              <div className="space-y-3">
                {bucketOrder.map(bucket => {
                  const row = data.byScoreBucket[bucket] ?? { total: 0, approved: 0 };
                  const pct = row.total > 0 ? Math.round((row.approved / row.total) * 100) : 0;
                  return (
                    <div key={bucket}>
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1.5">
                        <span>Skor {bucket}</span>
                        <span>
                          {row.approved}/{row.total} <span className="text-slate-400">({pct}%)</span>
                        </span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all"
                          style={{ width: row.total > 0 ? `${pct}%` : '0%' }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Ret kodu dağılımı */}
            <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Ret Kodu Dağılımı</h2>
              {sortedRejCodes.length === 0 ? (
                <p className="text-sm text-slate-500">Henüz ret kodu bildirimi yok.</p>
              ) : (
                <div className="space-y-2">
                  {sortedRejCodes.map(([code, count]) => (
                    <div key={code} className="flex items-center justify-between p-2.5 bg-rose-50/50 border border-rose-100 rounded-lg">
                      <span className="font-semibold text-slate-800 text-sm">{code}</span>
                      <span className="text-rose-700 font-bold">{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Bekleyen başvurular özeti */}
            <section className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-900">
                <strong className="block mb-1">Yanıt Bekleyen Başvurular</strong>
                Kaydedilen {data.total} başvurunun {data.total - data.withOutcome} tanesi henüz sonuç bildirmedi.
                Cron her gün 09:00'da (İstanbul) 4+ hafta geçmiş kayıtlara follow-up gönderiyor.
              </div>
            </section>

            {data.note && (
              <p className="text-xs text-slate-400 italic">{data.note}</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

const StatCard: React.FC<{
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'indigo' | 'emerald' | 'green' | 'rose';
  sub?: string;
}> = ({ label, value, icon, color, sub }) => {
  const bg = {
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    green: 'bg-green-50 text-green-700 border-green-100',
    rose: 'bg-rose-50 text-rose-700 border-rose-100',
  }[color];

  return (
    <div className={`${bg} border rounded-2xl p-4 shadow-sm`}>
      <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wide opacity-80">
        {icon}
        {label}
      </div>
      <div className="text-2xl sm:text-3xl font-bold">{value}</div>
      {sub && <div className="text-xs opacity-70 mt-1">{sub}</div>}
    </div>
  );
};

export default OutcomesStats;
