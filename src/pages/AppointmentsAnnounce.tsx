import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Lock, Bell, CheckCircle2, AlertCircle, Send, Users } from 'lucide-react';
import { SEO } from '../components/SEO';
import { apiUrl } from '../lib/api';

interface Target {
  id: string;
  country: string;
  city: string;
  visaType: string;
  vfsUrl: string;
  flag: string;
}

// Frontend App.tsx'teki APPOINTMENT_TARGETS listesiyle senkronize olmalı.
// Yeni merkez eklendiğinde ikisini de güncelle.
const TARGETS: Target[] = [
  { id: 'de-ist', country: 'Almanya',    city: 'İstanbul', visaType: 'Schengen (C)', vfsUrl: 'https://visa.vfsglobal.com/tur/tr/deu', flag: '🇩🇪' },
  { id: 'de-ank', country: 'Almanya',    city: 'Ankara',   visaType: 'Schengen (C)', vfsUrl: 'https://visa.vfsglobal.com/tur/tr/deu', flag: '🇩🇪' },
  { id: 'de-izm', country: 'Almanya',    city: 'İzmir',    visaType: 'Schengen (C)', vfsUrl: 'https://visa.vfsglobal.com/tur/tr/deu', flag: '🇩🇪' },
  { id: 'fr-ist', country: 'Fransa',     city: 'İstanbul', visaType: 'Schengen (C)', vfsUrl: 'https://fr.tlscontact.com/visa/TR/TRist2Paris', flag: '🇫🇷' },
  { id: 'fr-ank', country: 'Fransa',     city: 'Ankara',   visaType: 'Schengen (C)', vfsUrl: 'https://fr.tlscontact.com/visa/TR/TRank2Paris', flag: '🇫🇷' },
  { id: 'it-ist', country: 'İtalya',     city: 'İstanbul', visaType: 'Schengen (C)', vfsUrl: 'https://visa.vfsglobal.com/tur/tr/ita', flag: '🇮🇹' },
  { id: 'it-ank', country: 'İtalya',     city: 'Ankara',   visaType: 'Schengen (C)', vfsUrl: 'https://visa.vfsglobal.com/tur/tr/ita', flag: '🇮🇹' },
  { id: 'es-ist', country: 'İspanya',    city: 'İstanbul', visaType: 'Schengen (C)', vfsUrl: 'https://visa.vfsglobal.com/tur/tr/esp', flag: '🇪🇸' },
  { id: 'es-ank', country: 'İspanya',    city: 'Ankara',   visaType: 'Schengen (C)', vfsUrl: 'https://visa.vfsglobal.com/tur/tr/esp', flag: '🇪🇸' },
  { id: 'gr-ist', country: 'Yunanistan', city: 'İstanbul', visaType: 'Schengen (C)', vfsUrl: 'https://visa.vfsglobal.com/tur/tr/grc', flag: '🇬🇷' },
  { id: 'gr-ank', country: 'Yunanistan', city: 'Ankara',   visaType: 'Schengen (C)', vfsUrl: 'https://visa.vfsglobal.com/tur/tr/grc', flag: '🇬🇷' },
  { id: 'pt-ist', country: 'Portekiz',   city: 'İstanbul', visaType: 'Schengen (C)', vfsUrl: 'https://visa.vfsglobal.com/tur/tr/prt', flag: '🇵🇹' },
  { id: 'nl-ist', country: 'Hollanda',   city: 'İstanbul', visaType: 'Schengen (C)', vfsUrl: 'https://visa.vfsglobal.com/tur/tr/nld', flag: '🇳🇱' },
  { id: 'be-ist', country: 'Belçika',    city: 'İstanbul', visaType: 'Schengen (C)', vfsUrl: 'https://visa.vfsglobal.com/tur/tr/bel', flag: '🇧🇪' },
  { id: 'at-ist', country: 'Avusturya',  city: 'İstanbul', visaType: 'Schengen (C)', vfsUrl: 'https://visa.vfsglobal.com/tur/tr/aut', flag: '🇦🇹' },
  { id: 'at-ank', country: 'Avusturya',  city: 'Ankara',   visaType: 'Schengen (C)', vfsUrl: 'https://visa.vfsglobal.com/tur/tr/aut', flag: '🇦🇹' },
  { id: 'pl-ist', country: 'Polonya',    city: 'İstanbul', visaType: 'Schengen (C)', vfsUrl: 'https://visa.vfsglobal.com/tur/tr/pol', flag: '🇵🇱' },
  { id: 'hu-ist', country: 'Macaristan', city: 'İstanbul', visaType: 'Schengen (C)', vfsUrl: 'https://visa.vfsglobal.com/tur/tr/hun', flag: '🇭🇺' },
  { id: 'dk-ist', country: 'Danimarka',  city: 'İstanbul', visaType: 'Schengen (C)', vfsUrl: 'https://visa.vfsglobal.com/tur/tr/dnk', flag: '🇩🇰' },
  { id: 'se-ist', country: 'İsveç',      city: 'İstanbul', visaType: 'Schengen (C)', vfsUrl: 'https://visa.vfsglobal.com/tur/tr/swe', flag: '🇸🇪' },
  { id: 'no-ist', country: 'Norveç',     city: 'İstanbul', visaType: 'Schengen (C)', vfsUrl: 'https://visa.vfsglobal.com/tur/tr/nor', flag: '🇳🇴' },
  { id: 'ch-ist', country: 'İsviçre',    city: 'İstanbul', visaType: 'Schengen (C)', vfsUrl: 'https://fr.tlscontact.com/visa/TR/TRist2Bern', flag: '🇨🇭' },
  { id: 'gb-ist', country: 'İngiltere',  city: 'İstanbul', visaType: 'UK Visitor',   vfsUrl: 'https://visa.vfsglobal.com/tur/tr/gbr', flag: '🇬🇧' },
  { id: 'gb-ank', country: 'İngiltere',  city: 'Ankara',   visaType: 'UK Visitor',   vfsUrl: 'https://visa.vfsglobal.com/tur/tr/gbr', flag: '🇬🇧' },
  { id: 'us-ist', country: 'ABD',        city: 'İstanbul', visaType: 'B1/B2 Turist', vfsUrl: 'https://ais.usvisa-info.com/tr-tr/niv', flag: '🇺🇸' },
  { id: 'us-ank', country: 'ABD',        city: 'Ankara',   visaType: 'B1/B2 Turist', vfsUrl: 'https://ais.usvisa-info.com/tr-tr/niv', flag: '🇺🇸' },
  { id: 'ca-ist', country: 'Kanada',     city: 'İstanbul', visaType: 'Visitor (B)',  vfsUrl: 'https://visa.vfsglobal.com/tur/tr/can', flag: '🇨🇦' },
];

interface SubscribersInfo {
  total: number;
  perTarget: Record<string, number>;
}

interface AnnounceResult {
  sentCount: number;
  failCount: number;
  skippedCount: number;
  totalSubscribers: number;
}

const AppointmentsAnnounce: React.FC = () => {
  const [secret, setSecret] = useState('');
  const [authed, setAuthed] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [info, setInfo] = useState<SubscribersInfo | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<AnnounceResult | null>(null);

  const loadInfo = async (s: string) => {
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch(apiUrl('/api/appointments/subscribers'), {
        headers: { 'x-admin-secret': s },
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
      setInfo({ total: json.total, perTarget: json.perTarget ?? {} });
      setAuthed(true);
      setStatus('idle');
    } catch {
      setErrorMsg('Bağlantı hatası.');
      setStatus('error');
    }
  };

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const announce = async () => {
    if (selected.size === 0) return;
    if (!confirm(`${selected.size} merkez için duyuru gönderilecek. Emin misin?`)) return;

    setStatus('loading');
    setErrorMsg('');
    const openTargets = TARGETS.filter(t => selected.has(t.id));
    try {
      const res = await fetch(apiUrl('/api/appointments/announce'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': secret,
        },
        body: JSON.stringify({ openTargets }),
      });
      if (!res.ok) {
        setErrorMsg(`Sunucu hatası (${res.status})`);
        setStatus('error');
        return;
      }
      const json = await res.json();
      setResult({
        sentCount: json.sentCount,
        failCount: json.failCount,
        skippedCount: json.skippedCount,
        totalSubscribers: json.totalSubscribers,
      });
      setSelected(new Set());
      setStatus('idle');
      loadInfo(secret);
    } catch {
      setErrorMsg('Bağlantı hatası.');
      setStatus('error');
    }
  };

  const totalSubs = info?.total ?? 0;
  const impacted = [...selected].reduce((acc, id) => acc + (info?.perTarget[id] ?? 0), 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO
        title="Randevu Duyuru | VizeAkıl Admin"
        description="Randevu slotu duyuru paneli — admin."
        canonical="/admin/appointments-announce"
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
          <Bell className="w-6 h-6 text-indigo-600" />
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Randevu Slotu Duyuru</h1>
        </div>

        {!authed && (
          <div className="max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-slate-700">
              <Lock className="w-4 h-4" />
              <span className="font-bold text-sm">Admin Girişi</span>
            </div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
              Admin Secret
            </label>
            <input
              type="password"
              value={secret}
              onChange={e => setSecret(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') loadInfo(secret); }}
              placeholder=".env.local'daki ADMIN_SECRET"
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              onClick={() => loadInfo(secret)}
              disabled={!secret || status === 'loading'}
              className="w-full py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-40 transition-colors"
            >
              {status === 'loading' ? 'Yükleniyor...' : 'Giriş Yap'}
            </button>
            {status === 'error' && errorMsg && (
              <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                {errorMsg}
              </div>
            )}
          </div>
        )}

        {authed && (
          <div className="space-y-6">
            {/* Özet */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wide text-indigo-700">
                  <Users className="w-4 h-4" /> Toplam Abone
                </div>
                <div className="text-3xl font-bold text-indigo-900">{totalSubs}</div>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wide text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" /> Seçili Merkez
                </div>
                <div className="text-3xl font-bold text-emerald-900">{selected.size}</div>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wide text-amber-700">
                  <Send className="w-4 h-4" /> Etkilenecek Abone
                </div>
                <div className="text-3xl font-bold text-amber-900">{impacted}</div>
                <div className="text-xs text-amber-700 mt-1">Seçili merkezleri takip eden</div>
              </div>
            </div>

            {/* Son duyuru sonucu */}
            {result && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-emerald-900">
                  <strong className="block mb-1">Duyuru Gönderildi!</strong>
                  {result.sentCount} kişiye mail gitti, {result.failCount} başarısız, {result.skippedCount} takip etmiyordu.
                </div>
              </div>
            )}

            {/* Hata */}
            {status === 'error' && errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                {errorMsg}
              </div>
            )}

            {/* Merkez listesi */}
            <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Merkezler</h2>
                  <p className="text-xs text-slate-500">Slot açılan merkezleri işaretle, altta duyuru gönder</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelected(new Set())}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Temizle
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {TARGETS.map(t => {
                  const isSelected = selected.has(t.id);
                  const subCount = info?.perTarget[t.id] ?? 0;
                  return (
                    <button
                      key={t.id}
                      onClick={() => toggle(t.id)}
                      className={`text-left p-3 rounded-xl border-2 transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-400 shadow-sm'
                          : 'bg-white border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      <div className="text-2xl flex-shrink-0">{t.flag}</div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-sm text-slate-900 truncate">
                          {t.country} / {t.city}
                        </div>
                        <div className="text-xs text-slate-500">{t.visaType}</div>
                        <div className="text-xs text-indigo-600 font-semibold mt-1">
                          {subCount} abone
                        </div>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Duyur butonu */}
            <div className="sticky bottom-4 z-10 bg-white/90 backdrop-blur-xl border border-slate-200 rounded-2xl p-4 shadow-lg flex items-center justify-between gap-4">
              <div className="text-sm text-slate-700">
                {selected.size === 0
                  ? 'Hiç merkez seçilmedi'
                  : <><strong>{selected.size}</strong> merkez, <strong>{impacted}</strong> aboneye mail gidecek</>}
              </div>
              <button
                onClick={announce}
                disabled={selected.size === 0 || status === 'loading'}
                className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-40 transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {status === 'loading' ? 'Gönderiliyor...' : 'Duyuru Gönder'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AppointmentsAnnounce;
