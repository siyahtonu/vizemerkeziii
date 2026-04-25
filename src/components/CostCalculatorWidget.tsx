// ============================================================
// CostCalculatorWidget — Vize + Seyahat Maliyet Hesaplayıcı
// Kullanıcı: ülke (profilden), gün, kişi, tier, şehir tipi, sezon seçer.
// Çıktı: kalemli EUR + TL breakdown + konsolosluk min kontrolü.
// ============================================================

import React, { useMemo, useState, useEffect } from 'react';
import { Calculator, Euro, Plane, Bed, Utensils, ShieldCheck, Info, AlertCircle, Users, Download } from 'lucide-react';
import { ensureTurkishFont, TR_FONT, safePdfFilename } from '../lib/pdfFont';
import {
  COUNTRY_COSTS,
  calculateTripCost,
  type TravelTier,
  type CityTier,
  type Season,
} from '../data/countries';

interface Props {
  country: string;
  /** EUR → TL kur. Prop olarak verilmezse default kullanılır. */
  eurToTry?: number;
  /** Modal içinde render ediliyorsa dış kart çerçevesini kaldırır. */
  embedded?: boolean;
  /** Dış parent (modal) bu ref'e PDF indirme fonksiyonunu yazar — header butonu kullanır */
  downloadRef?: React.MutableRefObject<(() => void) | null>;
}

// Nisan 2026 ortalama kur varsayımı — gerçek kur için backend endpoint'i eklenebilir.
// 2025 sonu/2026 başı: €1 ≈ ₺52,7 (Merkez Bankası ortalama günlük efektif).
const DEFAULT_EUR_TRY = 52.72;

const TIER_LABEL: Record<TravelTier, string> = {
  budget:  'Ekonomik',
  mid:     'Orta Segment',
  premium: 'Premium',
};
const CITY_LABEL: Record<CityTier, string> = {
  low:  'Ucuz Şehir',
  mid:  'Orta',
  high: 'Pahalı Şehir',
};
const SEASON_LABEL: Record<Season, string> = {
  off:      'Düşük Sezon',
  shoulder: 'Normal',
  peak:     'Yoğun Sezon',
};
const SEASON_HINT: Record<Season, string> = {
  off:      'Kasım-Şubat',
  shoulder: 'Mart-Mayıs / Eylül-Ekim',
  peak:     'Haziran-Ağustos / Aralık',
};

function fmtEUR(v: number): string {
  return '€' + v.toLocaleString('tr-TR', { maximumFractionDigits: 0 });
}
function fmtTRY(v: number): string {
  return '₺' + Math.round(v).toLocaleString('tr-TR');
}

export const CostCalculatorWidget: React.FC<Props> = ({ country, eurToTry = DEFAULT_EUR_TRY, embedded = false, downloadRef }) => {
  const [days, setDays]           = useState(7);
  const [travelers, setTravelers] = useState(1);
  const [tier, setTier]           = useState<TravelTier>('mid');
  const [cityTier, setCityTier]   = useState<CityTier>('mid');
  const [season, setSeason]       = useState<Season>('shoulder');
  const [insurance, setInsurance] = useState(true);

  const hasCostData = !!COUNTRY_COSTS[country];

  const breakdown = useMemo(() => {
    if (!hasCostData) return null;
    return calculateTripCost({
      country,
      days,
      travelers,
      tier,
      cityTier,
      season,
      includeInsurance: insurance,
    });
  }, [country, days, travelers, tier, cityTier, season, insurance, hasCostData]);

  if (!hasCostData) {
    return (
      <div className={embedded ? 'p-1' : 'bg-white rounded-2xl border border-slate-200 p-5'}>
        {!embedded && (
          <div className="flex items-center gap-2 mb-2">
            <Calculator className="w-4 h-4 text-slate-400" />
            <div className="font-bold text-slate-900 text-sm">Maliyet Hesaplayıcı</div>
          </div>
        )}
        <div className="text-xs text-slate-500">
          {country || 'Hedef ülke'} için maliyet verisi henüz mevcut değil. Schengen ülkeleri, İngiltere ve ABD desteklenir.
        </div>
      </div>
    );
  }

  if (!breakdown) return null;

  const rows = [
    { icon: <Euro        className="w-4 h-4" />, label: 'Vize harcı',         eur: breakdown.visaFeeEUR,    note: travelers > 1 ? `${travelers} kişi` : undefined },
    { icon: <Info        className="w-4 h-4" />, label: 'VFS / servis',        eur: breakdown.serviceFeeEUR, note: breakdown.serviceFeeEUR === 0 ? 'ABD doğrudan' : undefined },
    { icon: <ShieldCheck className="w-4 h-4" />, label: 'Seyahat sigortası',  eur: breakdown.insuranceEUR,  note: insurance ? `${days} gün × ${travelers} kişi` : 'seçilmedi' },
    { icon: <Plane       className="w-4 h-4" />, label: 'Uçak (gidiş-dönüş)', eur: breakdown.flightEUR,     note: `${SEASON_LABEL[season]} bandı` },
    { icon: <Bed         className="w-4 h-4" />, label: 'Konaklama',          eur: breakdown.lodgingEUR,    note: `${days} gece, ${CITY_LABEL[cityTier]}` },
    { icon: <Utensils    className="w-4 h-4" />, label: 'Günlük yaşam',       eur: breakdown.dailyLifeEUR,  note: `yemek + ulaşım + aktivite` },
  ];

  // ── PDF üretimi (Türkçe font destekli) ──────────────────────────────
  // Hem widget alt butonu hem de modal header butonu (downloadRef üzerinden)
  // bu fonksiyonu çağırır.
  const handleDownloadPdf = async () => {
    if (!breakdown) return;
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    await ensureTurkishFont(doc);
    const today = new Date().toLocaleDateString('tr-TR');
    // Header
    doc.setFillColor(99, 102, 241);
    doc.rect(0, 0, 220, 22, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont(TR_FONT, 'bold');
    doc.text('VizeAkıl — Tahmini Seyahat Maliyeti', 14, 14);
    doc.setFontSize(9);
    doc.setFont(TR_FONT, 'normal');
    doc.text(today, 196, 14, { align: 'right' });
    // Body
    doc.setTextColor(15, 23, 42);
    let y = 35;
    doc.setFontSize(11);
    doc.setFont(TR_FONT, 'bold');
    doc.text(`Hedef Ülke: ${country}`, 14, y); y += 7;
    doc.setFont(TR_FONT, 'normal');
    doc.text(`Süre: ${days} gün  ·  Kişi: ${travelers}  ·  Sezon: ${SEASON_LABEL[season]}`, 14, y); y += 6;
    doc.text(`Stil: ${TIER_LABEL[tier]}  ·  Şehir: ${CITY_LABEL[cityTier]}`, 14, y); y += 10;
    // Tablo başlığı
    doc.setFont(TR_FONT, 'bold');
    doc.setFillColor(241, 245, 249);
    doc.rect(14, y - 5, 182, 8, 'F');
    doc.text('Kalem', 18, y);
    doc.text('Tutar (€)', 192, y, { align: 'right' });
    y += 7;
    doc.setFont(TR_FONT, 'normal');
    for (const r of rows) {
      doc.text(r.label + (r.note ? ` (${r.note})` : ''), 18, y);
      doc.text(`€ ${r.eur.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}`, 192, y, { align: 'right' });
      y += 6;
    }
    // Toplam
    y += 4;
    doc.setDrawColor(99, 102, 241);
    doc.setLineWidth(0.5);
    doc.line(14, y, 196, y);
    y += 7;
    doc.setFont(TR_FONT, 'bold');
    doc.setFontSize(13);
    doc.text('TOPLAM', 18, y);
    doc.text(`€ ${breakdown.totalEUR.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}`, 192, y, { align: 'right' });
    y += 6;
    doc.setFontSize(10);
    doc.setFont(TR_FONT, 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Yaklaşık ₺${Math.round(breakdown.totalEUR * eurToTry).toLocaleString('tr-TR')} (kur €1 ≈ ₺${eurToTry.toLocaleString('tr-TR', { minimumFractionDigits: 2 })})`, 18, y);
    y += 12;
    // Konsolosluk min kontrol
    doc.setTextColor(15, 23, 42);
    if (breakdown.consulateMinEUR !== null) {
      doc.setFont(TR_FONT, 'bold');
      doc.setFontSize(10);
      doc.text(`Konsolosluk minimum bütçe: € ${breakdown.consulateMinEUR.toLocaleString('tr-TR')}`, 14, y); y += 5;
      doc.setFont(TR_FONT, 'normal');
      doc.setFontSize(9);
      doc.text(
        breakdown.meetsConsulateMin
          ? '✓ Bütçeniz konsolosluk minimum şartını karşılıyor.'
          : '⚠ Bütçeniz konsolosluk minimum şartının altında olabilir; banka bakiyenizi kontrol edin.',
        14, y,
      );
      y += 8;
    }
    // Notlar
    if (breakdown.notes.length > 0) {
      doc.setFont(TR_FONT, 'bold');
      doc.setFontSize(10);
      doc.text('Notlar:', 14, y); y += 5;
      doc.setFont(TR_FONT, 'normal');
      doc.setFontSize(9);
      for (const n of breakdown.notes) {
        const lines = doc.splitTextToSize('• ' + n, 180);
        doc.text(lines, 14, y);
        y += lines.length * 4.5;
      }
    }
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('Rakamlar 2026 piyasa ortalamasına göre tahmini.', 14, 285);
    doc.text('vizeakil.com', 196, 285, { align: 'right' });
    doc.save(`VizeAkil_Maliyet_${safePdfFilename(country)}_${today.replace(/\//g, '-')}.pdf`);
  };

  // Modal header'ında PDF butonu için ref'e en güncel handler'ı yaz.
  // useEffect ile yan etkiye taşındı — render saflığı korunur (React 19 +
  // Concurrent Mode'da render fonksiyonu birden çok kez çalışabilir).
  useEffect(() => {
    if (downloadRef) downloadRef.current = handleDownloadPdf;
    return () => {
      if (downloadRef) downloadRef.current = null;
    };
  }, [downloadRef, handleDownloadPdf]);

  return (
    <div className={embedded ? '' : 'bg-white rounded-2xl border border-slate-200 overflow-hidden'}>
      {!embedded && (
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center">
            <Calculator className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <div className="font-bold text-slate-900 text-sm">Maliyet Hesaplayıcı</div>
            <div className="text-xs text-slate-400">{country} için tahmini toplam bütçe</div>
          </div>
        </div>
      )}

      <div className={embedded ? 'space-y-4' : 'p-5 space-y-4'}>
        {/* ── Girdiler ────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-600">Kalış (gün)</span>
            <input
              type="number"
              min={1}
              max={180}
              value={days}
              onChange={(e) => setDays(Math.max(1, Math.min(180, Number(e.target.value) || 1)))}
              className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-600 flex items-center gap-1">
              <Users className="w-3 h-3" /> Kişi sayısı
            </span>
            <input
              type="number"
              min={1}
              max={8}
              value={travelers}
              onChange={(e) => setTravelers(Math.max(1, Math.min(8, Number(e.target.value) || 1)))}
              className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </label>

          <label className="flex flex-col gap-1 col-span-2 sm:col-span-1">
            <span className="text-xs font-medium text-slate-600">Sezon</span>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value as Season)}
              className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="off">{SEASON_LABEL.off} ({SEASON_HINT.off})</option>
              <option value="shoulder">{SEASON_LABEL.shoulder} ({SEASON_HINT.shoulder})</option>
              <option value="peak">{SEASON_LABEL.peak} ({SEASON_HINT.peak})</option>
            </select>
          </label>
        </div>

        {/* ── Tier seçim ─────────────────────────────────────── */}
        <div>
          <div className="text-xs font-medium text-slate-600 mb-1.5">Seyahat Stili</div>
          <div className="grid grid-cols-3 gap-1.5">
            {(['budget', 'mid', 'premium'] as TravelTier[]).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setTier(t)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  tier === t
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {TIER_LABEL[t]}
              </button>
            ))}
          </div>
        </div>

        {/* ── Şehir tipi ────────────────────────────────────── */}
        <div>
          <div className="text-xs font-medium text-slate-600 mb-1.5">Destinasyon Tipi</div>
          <div className="grid grid-cols-3 gap-1.5">
            {(['low', 'mid', 'high'] as CityTier[]).map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setCityTier(c)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  cityTier === c
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {CITY_LABEL[c]}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer">
          <input
            type="checkbox"
            checked={insurance}
            onChange={(e) => setInsurance(e.target.checked)}
            className="w-4 h-4 rounded accent-indigo-600"
          />
          Seyahat sigortası dahil (30.000€ teminat — Schengen için zorunlu)
        </label>

        {/* ── Breakdown ─────────────────────────────────────── */}
        <div className="rounded-xl border border-slate-200 overflow-hidden">
          {rows.map((r, i) => (
            <div
              key={r.label}
              className={`flex items-center justify-between px-4 py-2.5 text-sm ${
                i % 2 === 0 ? 'bg-slate-50' : 'bg-white'
              }`}
            >
              <div className="flex items-center gap-2 text-slate-700">
                <span className="text-slate-400">{r.icon}</span>
                <span>{r.label}</span>
                {r.note && <span className="text-[10px] text-slate-400">· {r.note}</span>}
              </div>
              <div className="font-mono font-semibold text-slate-900">{fmtEUR(r.eur)}</div>
            </div>
          ))}
        </div>

        {/* ── Toplam ────────────────────────────────────────── */}
        {/*
          Editorial ton: gradient yerine düz koyu yüzey. Türk kullanıcısı için
          asıl kritik bilgi TRY — bu yüzden TRY üstte ve daha büyük, EUR ikincil.
        */}
        <div className="rounded-xl bg-slate-900 p-4 text-white">
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">Tahmini Toplam</div>
              <div className="text-2xl font-bold mt-1 text-white">
                {fmtTRY(breakdown.totalEUR * eurToTry)}
              </div>
              <div className="text-sm text-slate-300 mt-0.5">
                {fmtEUR(breakdown.totalEUR)}
                <span className="ml-2 text-[11px] text-slate-500">
                  (kur €1 ≈ ₺{eurToTry.toLocaleString('tr-TR', { minimumFractionDigits: 2 })})
                </span>
              </div>
            </div>
            <div className="text-right text-xs text-slate-400">
              <div>{days} gün · {travelers} kişi</div>
              <div>{TIER_LABEL[tier]} · {SEASON_LABEL[season]}</div>
            </div>
          </div>
        </div>

        {/* ── Konsolosluk min kontrol ───────────────────────── */}
        {breakdown.consulateMinEUR !== null && (
          <div
            className={`rounded-xl p-3 text-xs border ${
              breakdown.meetsConsulateMin
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}
          >
            <div className="flex items-start gap-2">
              {breakdown.meetsConsulateMin ? (
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="font-semibold mb-0.5">
                  Konsolosluk Minimum Bütçe Kontrolü:{' '}
                  {breakdown.meetsConsulateMin ? 'Karşılıyor' : 'Eksik olabilir'}
                </div>
                <div className="opacity-90">
                  {country} konsolosluğu ~{fmtEUR(breakdown.consulateMinEUR)} (konaklama + günlük yaşam) bekler.
                  Banka bakiyenizin bunun üstünde olduğundan emin olun.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Uyarılar ──────────────────────────────────────── */}
        {breakdown.notes.length > 0 && (
          <ul className="space-y-1.5">
            {breakdown.notes.map((n, i) => (
              <li key={i} className="text-[11px] text-slate-500 flex gap-1.5 items-start">
                <Info className="w-3 h-3 shrink-0 mt-0.5 text-slate-400" />
                <span>{n}</span>
              </li>
            ))}
          </ul>
        )}

        {/* ── PDF indirme butonu (alt) ───────────────────────────── */}
        <button
          type="button"
          onClick={handleDownloadPdf}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-indigo-200 text-indigo-700 rounded-xl text-sm font-bold hover:bg-indigo-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          PDF olarak indir
        </button>

        <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100">
          Rakamlar 2026 piyasa ortalamalarına göre tahmini. Gerçek fiyatlar sezon, rezervasyon zamanı ve tercihlere göre değişir.
        </div>
      </div>
    </div>
  );
};

export default CostCalculatorWidget;
