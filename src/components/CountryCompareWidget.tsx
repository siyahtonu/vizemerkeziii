// ============================================================
// CountryCompareWidget — #8 VS Karşılaştırma Ekranı
// 2 ülke yan yana: skor, ret oranı, bekleme, zorluk, tavsiye
// ============================================================

import React, { useState, useMemo } from 'react';
import { Download } from 'lucide-react';
import { TR_REJECTION_RATES } from '../scoring/matrices';
import { ensureTurkishFont, TR_FONT, safePdfFilename } from '../lib/pdfFont';

// ── Ülke meta verisi ─────────────────────────────────────────────────────────
interface CountryMeta {
  flag:       string;
  waitDays:   number;  // ortalama gün
  difficulty: 1 | 2 | 3 | 4;  // 1=kolay, 4=çok zor
  tip:        string;
  visaType:   string;
}

const COUNTRY_META: Record<string, CountryMeta> = {
  'Almanya':    { flag: '🇩🇪', waitDays: 45, difficulty: 3, visaType: 'Schengen', tip: 'Finansal süreklilik bakiyeden önemli' },
  'Fransa':     { flag: '🇫🇷', waitDays: 21, difficulty: 3, visaType: 'Schengen', tip: 'Seyahat sigortası ön koşul' },
  'Hollanda':   { flag: '🇳🇱', waitDays: 14, difficulty: 2, visaType: 'Schengen', tip: 'Banka düzeni ön planda' },
  'İtalya':     { flag: '🇮🇹', waitDays: 10, difficulty: 3, visaType: 'Schengen', tip: 'Başlıca güzergah uyumu önemli' },
  'İspanya':    { flag: '🇪🇸', waitDays: 8,  difficulty: 2, visaType: 'Schengen', tip: 'Otel + uçak rezervasyonu yeterli' },
  'Yunanistan': { flag: '🇬🇷', waitDays: 5,  difficulty: 1, visaType: 'Schengen', tip: 'İlk Schengen başvurusu için ideal' },
  'Avusturya':  { flag: '🇦🇹', waitDays: 20, difficulty: 2, visaType: 'Schengen', tip: 'Ret oranı makul, değerlendirme hızlı' },
  'Belçika':    { flag: '🇧🇪', waitDays: 15, difficulty: 3, visaType: 'Schengen', tip: 'Amaç belgesi kritik' },
  'Portekiz':   { flag: '🇵🇹', waitDays: 12, difficulty: 2, visaType: 'Schengen', tip: 'Göçmen ülke etkisi düşük' },
  'İsviçre':    { flag: '🇨🇭', waitDays: 22, difficulty: 3, visaType: 'Schengen', tip: 'Finansal eşik yüksek' },
  'İsveç':      { flag: '🇸🇪', waitDays: 35, difficulty: 2, visaType: 'Schengen', tip: 'Dijital başvuru kolaylaştı' },
  'Norveç':     { flag: '🇳🇴', waitDays: 18, difficulty: 2, visaType: 'Schengen', tip: 'Davet mektubu işe yarıyor' },
  'Danimarka':  { flag: '🇩🇰', waitDays: 42, difficulty: 4, visaType: 'Schengen', tip: '%66 ret oranı — en zorlu Schengen' },
  'Polonya':    { flag: '🇵🇱', waitDays: 9,  difficulty: 2, visaType: 'Schengen', tip: 'Düşük ret oranı, hızlı süreç' },
  'Macaristan': { flag: '🇭🇺', waitDays: 7,  difficulty: 1, visaType: 'Schengen', tip: 'İlk Schengen için alternatif' },
  'İngiltere':  { flag: '🇬🇧', waitDays: 15, difficulty: 2, visaType: 'UK Vizesi', tip: '2026 eVisa sistemi ile başvur' },
  'ABD':        { flag: '🇺🇸', waitDays: 90, difficulty: 4, visaType: 'B1/B2',    tip: 'Mülakat kritik — önceden hazırlan' },
};

const DIFFICULTY_LABEL: Record<number, string> = { 1: 'Kolay', 2: 'Orta', 3: 'Zor', 4: 'Çok Zor' };
const DIFFICULTY_COLOR: Record<number, string> = {
  1: 'text-emerald-600 bg-emerald-50',
  2: 'text-amber-600 bg-amber-50',
  3: 'text-orange-600 bg-orange-50',
  4: 'text-rose-600 bg-rose-50',
};

const COUNTRIES = Object.keys(COUNTRY_META);

// ── Mini bar ─────────────────────────────────────────────────────────────────
function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${Math.min(100, (value / max) * 100)}%` }}
      />
    </div>
  );
}

// ── Ana bileşen ───────────────────────────────────────────────────────────────
interface Props {
  defaultLeft?:  string;
  defaultRight?: string;
}

export function CountryCompareWidget({ defaultLeft = 'Almanya', defaultRight = 'Yunanistan' }: Props) {
  const [left,  setLeft]  = useState(defaultLeft);
  const [right, setRight] = useState(defaultRight);

  const L = useMemo(() => ({
    ...COUNTRY_META[left],
    rejRate: Math.round((TR_REJECTION_RATES[left]  ?? 0.2) * 100),
  }), [left]);

  const R = useMemo(() => ({
    ...COUNTRY_META[right],
    rejRate: Math.round((TR_REJECTION_RATES[right] ?? 0.2) * 100),
  }), [right]);

  // Tavsiye: daha düşük ret × daha düşük zorluk → önce oraya
  const leftScore  = (100 - L.rejRate) * 0.6 + (5 - L.difficulty) * 10;
  const rightScore = (100 - R.rejRate) * 0.6 + (5 - R.difficulty) * 10;
  const recommend  = leftScore >= rightScore ? 'left' : 'right';

  const Row = ({
    label, lv, rv, lBar, rBar, barMax, barColor, isLower,
  }: {
    label: string; lv: string; rv: string;
    lBar: number; rBar: number; barMax: number; barColor: string; isLower?: boolean;
  }) => {
    const lWins = isLower ? lBar <= rBar : lBar >= rBar;
    const rWins = isLower ? rBar <= lBar : rBar >= lBar;
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <span>{lv}</span>
          <span className="text-slate-500">{label}</span>
          <span>{rv}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full shrink-0 ${lWins ? 'bg-emerald-500' : 'bg-slate-200'}`} />
          <Bar value={lBar} max={barMax} color={lWins ? barColor : 'bg-slate-300'} />
          {/* divider */}
          <div className="w-px h-3 bg-slate-200 shrink-0" />
          <Bar value={rBar} max={barMax} color={rWins ? barColor : 'bg-slate-300'} />
          <span className={`w-2 h-2 rounded-full shrink-0 ${rWins ? 'bg-emerald-500' : 'bg-slate-200'}`} />
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
        <span className="text-base">⚖️</span>
        <span className="font-semibold text-slate-800 text-sm">Ülke Karşılaştırma</span>
        <span className="ml-auto text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
          VS Modu
        </span>
        <button
          type="button"
          title="Karşılaştırmayı PDF olarak indir"
          onClick={async () => {
            const { jsPDF } = await import('jspdf');
            const doc = new jsPDF();
            await ensureTurkishFont(doc);
            const today = new Date().toLocaleDateString('tr-TR');
            doc.setFillColor(99, 102, 241);
            doc.rect(0, 0, 220, 22, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(14);
            doc.setFont(TR_FONT, 'bold');
            doc.text('VizeAkıl — Ülke Karşılaştırma', 14, 14);
            doc.setFontSize(9);
            doc.setFont(TR_FONT, 'normal');
            doc.text(today, 196, 14, { align: 'right' });
            doc.setTextColor(15, 23, 42);
            let y = 32;
            doc.setFontSize(13);
            doc.setFont(TR_FONT, 'bold');
            doc.text(`${left}  vs  ${right}`, 14, y); y += 10;
            doc.setFontSize(10);
            doc.setFillColor(241, 245, 249);
            doc.rect(14, y - 5, 182, 8, 'F');
            doc.text('Ölçüt', 18, y);
            doc.text(left, 110, y, { align: 'right' });
            doc.text(right, 192, y, { align: 'right' });
            y += 8;
            doc.setFont(TR_FONT, 'normal');
            const rows: Array<[string, string, string]> = [
              ['Vize Tipi', L.visaType, R.visaType],
              ['Ret Oranı (%)', String(L.rejRate), String(R.rejRate)],
              ['Onay Oranı (%)', String(100 - L.rejRate), String(100 - R.rejRate)],
              ['Ortalama Bekleme (gün)', String(L.waitDays), String(R.waitDays)],
              ['Zorluk', DIFFICULTY_LABEL[L.difficulty], DIFFICULTY_LABEL[R.difficulty]],
            ];
            rows.forEach(([k, lv, rv]) => {
              doc.text(k, 18, y);
              doc.text(lv, 110, y, { align: 'right' });
              doc.text(rv, 192, y, { align: 'right' });
              doc.setDrawColor(226, 232, 240);
              doc.line(14, y + 2, 196, y + 2);
              y += 7;
            });
            y += 4;
            doc.setFont(TR_FONT, 'bold');
            doc.setFontSize(11);
            doc.setTextColor(5, 150, 105);
            const winner = leftScore >= rightScore ? left : right;
            doc.text(`Tavsiye: Önce ${winner}'a başvur`, 14, y); y += 7;
            doc.setFont(TR_FONT, 'normal');
            doc.setFontSize(9);
            doc.setTextColor(15, 23, 42);
            doc.text('Daha düşük ret oranı ve daha kısa bekleme süresi avantajı.', 14, y); y += 8;
            doc.setFont(TR_FONT, 'bold');
            doc.text(`${left} için ipucu:`, 14, y); y += 5;
            doc.setFont(TR_FONT, 'normal');
            const lt = doc.splitTextToSize(L.tip, 180);
            doc.text(lt, 14, y); y += lt.length * 4.5 + 4;
            doc.setFont(TR_FONT, 'bold');
            doc.text(`${right} için ipucu:`, 14, y); y += 5;
            doc.setFont(TR_FONT, 'normal');
            const rt = doc.splitTextToSize(R.tip, 180);
            doc.text(rt, 14, y);
            doc.setFontSize(8);
            doc.setTextColor(148, 163, 184);
            doc.text('Veriler 2024-2025 EU/UK/US istatistik havuzuna dayanır.', 14, 285);
            doc.text('vizeakil.com', 196, 285, { align: 'right' });
            doc.save(`VizeAkil_${safePdfFilename(left)}_vs_${safePdfFilename(right)}_${today.replace(/\//g, '-')}.pdf`);
          }}
          className="ml-1 inline-flex items-center gap-1 px-2 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <Download className="w-3 h-3" />
          PDF
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Country selectors */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">1. Ülke</label>
            <select
              value={left}
              onChange={e => { if (e.target.value !== right) setLeft(e.target.value); }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-brand-400"
            >
              {COUNTRIES.map(c => (
                <option key={c} value={c}>{COUNTRY_META[c].flag} {c}</option>
              ))}
            </select>
          </div>
          <div className="text-slate-400 font-bold text-sm mt-4">VS</div>
          <div className="flex-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">2. Ülke</label>
            <select
              value={right}
              onChange={e => { if (e.target.value !== left) setRight(e.target.value); }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-brand-400"
            >
              {COUNTRIES.map(c => (
                <option key={c} value={c}>{COUNTRY_META[c].flag} {c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Country name row */}
        <div className="flex items-center gap-2 text-center">
          <div className={`flex-1 py-2 rounded-xl border-2 transition-all ${recommend === 'left' ? 'border-emerald-400 bg-emerald-50' : 'border-slate-100 bg-slate-50'}`}>
            <div className="text-2xl">{L.flag}</div>
            <div className="text-xs font-bold text-slate-800 mt-0.5">{left}</div>
            <div className="text-[10px] text-slate-400">{L.visaType}</div>
          </div>
          <div className="text-slate-300 font-bold text-sm">VS</div>
          <div className={`flex-1 py-2 rounded-xl border-2 transition-all ${recommend === 'right' ? 'border-emerald-400 bg-emerald-50' : 'border-slate-100 bg-slate-50'}`}>
            <div className="text-2xl">{R.flag}</div>
            <div className="text-xs font-bold text-slate-800 mt-0.5">{right}</div>
            <div className="text-[10px] text-slate-400">{R.visaType}</div>
          </div>
        </div>

        {/* Comparison rows */}
        <div className="space-y-3">
          <Row
            label="Ret Oranı"
            lv={`%${L.rejRate}`} rv={`%${R.rejRate}`}
            lBar={100 - L.rejRate} rBar={100 - R.rejRate}
            barMax={100} barColor="bg-emerald-400"
            isLower={false}
          />
          <Row
            label="Bekleme Günü"
            lv={`${L.waitDays}g`} rv={`${R.waitDays}g`}
            lBar={90 - L.waitDays} rBar={90 - R.waitDays}
            barMax={90} barColor="bg-brand-400"
            isLower={true}
          />
          <Row
            label="Zorluk"
            lv={DIFFICULTY_LABEL[L.difficulty]} rv={DIFFICULTY_LABEL[R.difficulty]}
            lBar={5 - L.difficulty} rBar={5 - R.difficulty}
            barMax={4} barColor="bg-indigo-400"
            isLower={true}
          />
        </div>

        {/* Stat badges */}
        <div className="flex gap-2">
          <div className="flex-1 text-center space-y-1">
            <div className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${DIFFICULTY_COLOR[L.difficulty]}`}>
              {DIFFICULTY_LABEL[L.difficulty]}
            </div>
            <div className="text-[9px] text-slate-400 leading-tight">{L.tip}</div>
          </div>
          <div className="flex-1 text-center space-y-1">
            <div className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${DIFFICULTY_COLOR[R.difficulty]}`}>
              {DIFFICULTY_LABEL[R.difficulty]}
            </div>
            <div className="text-[9px] text-slate-400 leading-tight">{R.tip}</div>
          </div>
        </div>

        {/* Recommendation */}
        <div className={`rounded-xl p-3 text-center ${recommend === 'left' ? 'bg-emerald-50 border border-emerald-100' : 'bg-emerald-50 border border-emerald-100'}`}>
          <p className="text-xs font-bold text-emerald-700">
            {recommend === 'left' ? `← ${L.flag} ${left}` : `${R.flag} ${right} →`} önce başvur
          </p>
          <p className="text-[10px] text-emerald-600 mt-0.5">
            Ret oranı ve bekleme süresi daha uygun.
          </p>
        </div>
      </div>
    </div>
  );
}
