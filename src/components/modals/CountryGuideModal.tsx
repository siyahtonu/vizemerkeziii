import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plane, Layers, LayoutList, Download } from 'lucide-react';
import { ensureTurkishFont, TR_FONT } from '../../lib/pdfFont';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentScore: number;
}

type CountryEntry = {
  name: string; flag: string; visaType: string; difficulty: number;
  approvalBase: number; tips: string; avgWait: number; difficultyLabel: string;
};

const ALL_COUNTRIES: CountryEntry[] = [
  { name: 'İtalya',    flag: '🇮🇹', visaType: 'Schengen (C)', difficulty: 0.92, approvalBase: 88, tips: 'En yüksek Schengen onay oranı. Turizm güçlüdür.', avgWait: 10,  difficultyLabel: 'Kolay' },
  { name: 'İspanya',   flag: '🇪🇸', visaType: 'Schengen (C)', difficulty: 0.90, approvalBase: 86, tips: 'Başvuru merkezi erişimi kolay. Kültürel gezi iyi kabul görür.', avgWait: 12,  difficultyLabel: 'Kolay' },
  { name: 'Yunanistan',flag: '🇬🇷', visaType: 'Schengen (C)', difficulty: 0.88, approvalBase: 85, tips: 'Ada ve kıyı turizmi güçlü gerekçe. Hızlı randevu.', avgWait: 8,   difficultyLabel: 'Kolay' },
  { name: 'Portekiz',  flag: '🇵🇹', visaType: 'Schengen (C)', difficulty: 0.87, approvalBase: 84, tips: 'Düşük ret oranı, hızlı süreç.', avgWait: 10,  difficultyLabel: 'Kolay' },
  { name: 'Macaristan',flag: '🇭🇺', visaType: 'Schengen (C)', difficulty: 0.88, approvalBase: 83, tips: 'Kültürel turizm, düşük bütçe gereksinimi.', avgWait: 7,   difficultyLabel: 'Kolay' },
  { name: 'Hollanda',  flag: '🇳🇱', visaType: 'Schengen (C)', difficulty: 0.82, approvalBase: 78, tips: 'Orta zorluk. Banka dökümü kritik.', avgWait: 14,  difficultyLabel: 'Orta' },
  { name: 'Fransa',    flag: '🇫🇷', visaType: 'Schengen (C)', difficulty: 0.80, approvalBase: 75, tips: 'Niyet mektubu ve konaklama belgesi önemli.', avgWait: 21,  difficultyLabel: 'Orta' },
  { name: 'Almanya',   flag: '🇩🇪', visaType: 'Schengen (C)', difficulty: 0.75, approvalBase: 70, tips: 'Yüksek standart. Finansal süreklilik şart.', avgWait: 45,  difficultyLabel: 'Zor' },
  { name: 'İngiltere', flag: '🇬🇧', visaType: 'UK Visitor',   difficulty: 0.72, approvalBase: 68, tips: '28 gün kuralı ve 6 aylık döküm zorunlu.', avgWait: 18,  difficultyLabel: 'Zor' },
  { name: 'ABD',       flag: '🇺🇸', visaType: 'B1/B2',        difficulty: 0.60, approvalBase: 55, tips: 'En zorlu. Mülakat + güçlü Türkiye bağı şart.', avgWait: 188, difficultyLabel: 'Çok Zor' },
];

export function CountryGuideModal({ isOpen, onClose, currentScore }: Props) {
  const [view, setView] = useState<'cards' | 'table'>('cards');

  // useMemo ile referans stabil: aksi halde her render'da yeni array → handleDownloadPdf
  // useCallback'i her render'da yeni fn döner ve memoization anlamsızlaşırdı.
  const scored = useMemo(() =>
    ALL_COUNTRIES.map(c => {
      const personalApproval = Math.round(
        (currentScore / 100) * c.approvalBase * c.difficulty +
        (1 - c.difficulty) * c.approvalBase * 0.3,
      );
      return { ...c, personalApproval: Math.min(99, Math.max(15, personalApproval)) };
    }).sort((a, b) => b.personalApproval - a.personalApproval),
  [currentScore]);

  const approvalColor = (v: number) =>
    v >= 75 ? 'text-emerald-600' : v >= 55 ? 'text-amber-600' : 'text-rose-600';
  const approvalBg = (v: number) =>
    v >= 75 ? 'bg-emerald-500' : v >= 55 ? 'bg-amber-400' : 'bg-rose-400';
  const difficultyBadge = (d: string) => {
    if (d === 'Kolay') return 'bg-emerald-100 text-emerald-700';
    if (d === 'Orta')  return 'bg-amber-100 text-amber-700';
    if (d === 'Zor')   return 'bg-orange-100 text-orange-700';
    return 'bg-rose-100 text-rose-700';
  };

  // ── PDF üretimi (üst ve alt buton aynı işlevi paylaşır) ────────────
  const handleDownloadPdf = useCallback(async () => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    await ensureTurkishFont(doc);
    const today = new Date().toLocaleDateString('tr-TR');
    // Header
    doc.setFillColor(14, 165, 233);
    doc.rect(0, 0, 220, 22, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont(TR_FONT, 'bold');
    doc.text('VizeAkıl — Ülke Karşılaştırma Tablosu', 14, 14);
    doc.setFontSize(9);
    doc.setFont(TR_FONT, 'normal');
    doc.text(today, 196, 14, { align: 'right' });
    // Body
    doc.setTextColor(15, 23, 42);
    let y = 32;
    doc.setFontSize(11);
    doc.setFont(TR_FONT, 'bold');
    doc.text(`Profil Skoru: %${currentScore}`, 14, y); y += 5;
    doc.setFontSize(9);
    doc.setFont(TR_FONT, 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('Tüm hedef ülkeler — kişisel onay tahmini ile sıralanmış', 14, y); y += 8;
    // Table header
    doc.setTextColor(15, 23, 42);
    doc.setFillColor(241, 245, 249);
    doc.rect(14, y - 5, 182, 8, 'F');
    doc.setFont(TR_FONT, 'bold');
    doc.setFontSize(9);
    doc.text('#', 17, y);
    doc.text('Ülke', 24, y);
    doc.text('Vize Tipi', 90, y);
    doc.text('Tahmini Onay (%)', 150, y, { align: 'right' });
    doc.text('Zorluk', 175, y, { align: 'right' });
    doc.text('Bekleme', 195, y, { align: 'right' });
    y += 7;
    doc.setFont(TR_FONT, 'normal');
    doc.setDrawColor(226, 232, 240);
    scored.forEach((c, i) => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.text(String(i + 1), 17, y);
      doc.text(c.name, 24, y);
      doc.text(c.visaType, 90, y);
      doc.text(`%${c.personalApproval}`, 150, y, { align: 'right' });
      doc.text(c.difficultyLabel, 175, y, { align: 'right' });
      doc.text(`${c.avgWait}g`, 195, y, { align: 'right' });
      y += 5;
      doc.line(14, y - 1, 196, y - 1);
    });
    y += 6;
    // İlk 5 detaylı taktik
    if (y > 240) { doc.addPage(); y = 20; }
    doc.setFont(TR_FONT, 'bold');
    doc.setFontSize(11);
    doc.text('İlk 5 Hedef — Taktik Notları', 14, y); y += 7;
    doc.setFont(TR_FONT, 'normal');
    doc.setFontSize(9);
    scored.slice(0, 5).forEach((c, i) => {
      if (y > 265) { doc.addPage(); y = 20; }
      doc.setFont(TR_FONT, 'bold');
      doc.text(`${i + 1}. ${c.name} — Tahmini onay %${c.personalApproval}`, 14, y); y += 5;
      doc.setFont(TR_FONT, 'normal');
      const tipLines = doc.splitTextToSize(c.tips, 180);
      doc.text(tipLines, 14, y);
      y += tipLines.length * 4 + 4;
    });
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('Tahminler 2024-2025 konsolosluk istatistikleri ve profilinize dayalıdır.', 14, 285);
    doc.text('vizeakil.com', 196, 285, { align: 'right' });
    doc.save(`VizeAkil_Ulke_Karsilastirma_${today.replace(/\//g, '-')}.pdf`);
  }, [scored, currentScore]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">

            <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-3 shrink-0">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Plane className="w-5 h-5 text-sky-600" />
                  <h3 className="text-lg font-bold text-slate-900">Ülke Karşılaştırma Tablosu</h3>
                </div>
                <div className="flex items-start gap-3 flex-wrap">
                  <p className="text-sm text-slate-500 flex-1 min-w-[220px]">
                    Tüm hedef ülkeler — skor {currentScore}/100 bazında kişisel onay tahmini
                  </p>
                  <button
                    onClick={handleDownloadPdf}
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 text-white rounded-lg text-xs font-bold hover:bg-sky-700 transition-colors shadow-sm"
                    title="Tabloyu PDF olarak indir"
                  >
                    <Download className="w-3.5 h-3.5" />
                    PDF olarak indir
                  </button>
                </div>
              </div>
              <button onClick={onClose} aria-label="Kapat"
                className="p-2 rounded-xl hover:bg-slate-100 transition-colors shrink-0">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Görünüm Seçici */}
            <div className="px-6 py-3 border-b border-slate-100 flex gap-2 shrink-0">
              <button onClick={() => setView('cards')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${view === 'cards' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                <Layers className="w-3.5 h-3.5" /> Kartlar
              </button>
              <button onClick={() => setView('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${view === 'table' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                <LayoutList className="w-3.5 h-3.5" /> Tablo
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-6 py-5">
              {view === 'table' ? (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Skor: {currentScore}/100 — {scored.length} Ülke Karşılaştırması
                  </div>
                  {/* Table Header */}
                  <div className="grid grid-cols-[1.8fr_1fr_0.9fr_0.9fr] gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>Ülke</span>
                    <span className="text-center">Tahmini Onay</span>
                    <span className="text-center">Zorluk</span>
                    <span className="text-center">Bekleme</span>
                  </div>
                  {scored.map((c, i) => (
                    <div key={c.name}
                      className={`grid grid-cols-[1.8fr_1fr_0.9fr_0.9fr] gap-2 items-center px-3 py-3 rounded-xl border transition-colors ${i === 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-lg shrink-0">{c.flag}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1 flex-wrap">
                            <span className="text-sm font-bold text-slate-900 truncate">{c.name}</span>
                            {i === 0 && <span className="text-[8px] font-bold bg-emerald-500 text-white px-1 py-0.5 rounded shrink-0">★ En İyi</span>}
                          </div>
                          <span className="text-[10px] text-slate-400">{c.visaType}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <span className={`text-base font-bold ${approvalColor(c.personalApproval)}`}>%{c.personalApproval}</span>
                        <div className="w-full bg-slate-100 rounded-full h-1">
                          <div className={`h-1 rounded-full ${approvalBg(c.personalApproval)}`}
                            style={{ width: `${c.personalApproval}%` }} />
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${difficultyBadge(c.difficultyLabel)}`}>
                          {c.difficultyLabel}
                        </span>
                      </div>
                      <div className="text-center">
                        <span className={`text-xs font-bold ${c.avgWait > 30 ? 'text-rose-600' : c.avgWait > 14 ? 'text-amber-600' : 'text-slate-600'}`}>
                          ~{c.avgWait}g
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500">
                    Tahminler 2024-2025 konsolosluk istatistikleri ve profilinize dayalıdır. Nihai karar konsolosluğa aittir.
                  </div>
                </div>
              ) : (
                /* Kart Görünümü */
                <div className="space-y-4">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Skor: {currentScore}/100 — En İyi 5 Hedef
                  </div>
                  {scored.slice(0, 5).map((c, i) => (
                    <div key={c.name} className={`p-4 rounded-2xl border ${i === 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200'}`}>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl shrink-0">{c.flag}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-900">{c.name}</span>
                            {i === 0 && <span className="text-[10px] font-bold bg-emerald-500 text-white px-1.5 py-0.5 rounded-md">En İyi Seçim</span>}
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${difficultyBadge(c.difficultyLabel)}`}>{c.difficultyLabel}</span>
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">{c.tips}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className={`text-xl font-bold ${approvalColor(c.personalApproval)}`}>
                            %{c.personalApproval}
                          </div>
                          <div className="text-[10px] text-slate-400">tahmini onay</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full ${approvalBg(c.personalApproval)}`}
                            style={{ width: `${c.personalApproval}%` }} />
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0">~{c.avgWait}g bekleme</span>
                      </div>
                    </div>
                  ))}
                  <div className="pt-2">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Diğer Ülkeler</div>
                    <div className="space-y-1.5">
                      {scored.slice(5).map(c => (
                        <div key={c.name} className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-base shrink-0">{c.flag}</span>
                          <span className="text-sm text-slate-600 flex-1">{c.name}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${difficultyBadge(c.difficultyLabel)}`}>{c.difficultyLabel}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-200 rounded-full h-1.5">
                              <div className={`h-1.5 rounded-full ${approvalBg(c.personalApproval)}`}
                                style={{ width: `${c.personalApproval}%` }} />
                            </div>
                            <span className={`text-xs font-bold w-8 text-right ${approvalColor(c.personalApproval)}`}>%{c.personalApproval}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500">
                    Tahminler, 2024-2025 konsolosluk istatistikleri ve mevcut profilinize dayalı modeldir. Nihai karar konsolosluğa aittir.
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-100 shrink-0 space-y-2">
              <button
                onClick={handleDownloadPdf}
                className="w-full flex items-center justify-center gap-2 py-3 bg-sky-600 text-white rounded-2xl font-bold text-sm hover:bg-sky-700 transition-colors shadow-md"
              >
                <Download className="w-4 h-4" />
                Tabloyu PDF Olarak İndir
              </button>
              <button onClick={onClose}
                className="w-full py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-colors">
                Kapat
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
