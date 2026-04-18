// ============================================================
// DayCalculatorModal — Schengen 90/180 Günlük Hesaplayıcı
// Kural: Herhangi 180 günlük hareketli pencerede Schengen'de maks 90 gün.
// Kullanıcı geçmiş girişlerini ekler, sistem:
//   • Referans tarih (bugün veya gelecekteki planlı giriş) için kullanılan/kalan gün
//   • Yeni 90 gün hakkı kazanılacağı en erken tarih
//   • Planlanan seyahatin kuralı ihlal edip etmediği
// ============================================================
import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Calendar, Plus, Trash2, AlertCircle, CheckCircle2, Info,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface Stay {
  id: string;
  entry: string;  // YYYY-MM-DD
  exit: string;   // YYYY-MM-DD
}

const MS_PER_DAY = 86_400_000;
const WINDOW_DAYS = 180;
const MAX_STAY = 90;

function parseDate(s: string): Date | null {
  if (!s) return null;
  const d = new Date(s + 'T00:00:00');
  return isNaN(d.getTime()) ? null : d;
}

function addDays(d: Date, n: number): Date {
  return new Date(d.getTime() + n * MS_PER_DAY);
}

function daysBetween(from: Date, to: Date): number {
  return Math.floor((to.getTime() - from.getTime()) / MS_PER_DAY);
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
}

function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Referans tarihin geriye 179 günü (toplam 180 gün penceresi — AB yorumu)
 * içine düşen stay günlerinin toplamını döner.
 *
 * AB Kuralı: giriş ve çıkış günü dahil sayılır. Pencere: refDate dahil son 180 gün.
 */
function daysUsedInWindow(stays: Stay[], refDate: Date): number {
  const windowStart = addDays(refDate, -(WINDOW_DAYS - 1)); // refDate dahil 180 gün
  let total = 0;
  for (const s of stays) {
    const e = parseDate(s.entry);
    const x = parseDate(s.exit);
    if (!e || !x) continue;
    if (x < e) continue; // geçersiz
    const effStart = e < windowStart ? windowStart : e;
    const effEnd = x > refDate ? refDate : x;
    if (effEnd < effStart) continue;
    // inclusive hem giriş hem çıkış günü
    total += daysBetween(effStart, effEnd) + 1;
  }
  return total;
}

/**
 * Kural ihlalini gidermek için en erken yeni giriş tarihini hesaplar.
 * Bugünkü pencereden ihlal edici günleri kaydıra kaydıra çıkarır.
 *
 * Mantık: referansı 1 gün ileri kaydırarak kullanılan günün 90'ın altına indiği
 * ilk tarihi bulur. Aşırı durumlar için 400 gün tavan.
 */
function nextEligibleDate(stays: Stay[], refDate: Date): Date | null {
  let cursor = new Date(refDate);
  for (let i = 0; i < 400; i++) {
    if (daysUsedInWindow(stays, cursor) < MAX_STAY) return cursor;
    cursor = addDays(cursor, 1);
  }
  return null;
}

export const DayCalculatorModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [stays, setStays]   = useState<Stay[]>([{ id: '1', entry: '', exit: '' }]);
  const [refDate, setRefDate] = useState<string>(() => toISO(new Date()));
  const [planEntry, setPlanEntry] = useState<string>('');
  const [planExit, setPlanExit]   = useState<string>('');

  const result = useMemo(() => {
    const ref = parseDate(refDate);
    if (!ref) return null;
    const validStays = stays.filter(s => s.entry && s.exit);
    const used = daysUsedInWindow(validStays, ref);
    const remaining = Math.max(0, MAX_STAY - used);
    const windowStart = addDays(ref, -(WINDOW_DAYS - 1));
    const eligibleDate = used >= MAX_STAY ? nextEligibleDate(validStays, ref) : null;

    // Planlı seyahat kontrolü
    let plannedCheck: { days: number; ok: boolean; exceedsBy: number; rollingMax: number } | null = null;
    const pe = parseDate(planEntry);
    const px = parseDate(planExit);
    if (pe && px && px >= pe) {
      // Planlı seyahat sırasında her gün için daysUsed'i kontrol et — maks bul
      const plannedDays = daysBetween(pe, px) + 1;
      // Planlı stays dahil edilerek günlük kontrol
      const combined = [...validStays, { id: 'planned', entry: planEntry, exit: planExit }];
      let rollingMax = 0;
      let day = new Date(pe);
      while (day <= px) {
        const u = daysUsedInWindow(combined, day);
        if (u > rollingMax) rollingMax = u;
        day = addDays(day, 1);
      }
      plannedCheck = {
        days: plannedDays,
        ok: rollingMax <= MAX_STAY,
        exceedsBy: Math.max(0, rollingMax - MAX_STAY),
        rollingMax,
      };
    }

    return { used, remaining, windowStart, eligibleDate, plannedCheck };
  }, [stays, refDate, planEntry, planExit]);

  const addStay = () => setStays(p => [...p, { id: String(Date.now()), entry: '', exit: '' }]);
  const removeStay = (id: string) => setStays(p => p.filter(s => s.id !== id));
  const updateStay = (id: string, field: 'entry' | 'exit', value: string) =>
    setStays(p => p.map(s => s.id === id ? { ...s, [field]: value } : s));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-3xl bg-white rounded-[2rem] shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden"
          >
            <div className="p-6 bg-gradient-to-r from-amber-600 to-orange-700 text-white rounded-t-[2rem] shrink-0">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 text-amber-200 text-xs font-bold uppercase tracking-widest mb-2">
                    <Calendar className="w-4 h-4" /> Schengen 90/180 Günlük Kural
                  </div>
                  <h3 className="text-2xl font-bold">Kalan Günlerimi Hesapla</h3>
                  <p className="text-amber-100 text-sm mt-1">
                    Geçmiş Schengen girişlerini ekle — sistem bugüne kadar kaç gün kullandığını ve ne zaman yeniden girebileceğini hesaplar.
                  </p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors" aria-label="Kapat">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* ── KURAL AÇIKLAMASI ─────────────────────────────── */}
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 flex gap-2 text-xs text-amber-800">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <b>Kural:</b> Herhangi 180 günlük hareketli pencerede Schengen bölgesinde maksimum 90 gün kalabilirsin. Giriş ve çıkış günleri dahil sayılır.
                </div>
              </div>

              {/* ── REFERANS TARİH ─────────────────────────────── */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">
                  Referans Tarih (hangi gün için hesaplama?)
                </label>
                <input
                  type="date"
                  value={refDate}
                  onChange={e => setRefDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
                />
                <div className="text-[11px] text-slate-400 mt-1">
                  Default bugün. Gelecekteki bir tarih girersen "o gün durumum ne olacak" hesabı yapılır.
                </div>
              </div>

              {/* ── GEÇMİŞ GİRİŞLER ─────────────────────────────── */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Geçmiş Schengen Girişleri
                  </label>
                  <button
                    type="button"
                    onClick={addStay}
                    className="flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-700"
                  >
                    <Plus className="w-3 h-3" /> Giriş Ekle
                  </button>
                </div>
                <div className="space-y-2">
                  {stays.map((s, i) => (
                    <div key={s.id} className="flex items-center gap-2">
                      <div className="text-xs font-medium text-slate-400 w-6">#{i + 1}</div>
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-[10px] text-slate-400 mb-0.5">Giriş</div>
                          <input
                            type="date"
                            value={s.entry}
                            onChange={e => updateStay(s.id, 'entry', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30"
                          />
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 mb-0.5">Çıkış</div>
                          <input
                            type="date"
                            value={s.exit}
                            onChange={e => updateStay(s.id, 'exit', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30"
                          />
                        </div>
                      </div>
                      {stays.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeStay(s.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label="Gidiş sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* ── SONUÇ ───────────────────────────────────────── */}
              {result && (
                <div className="rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-5">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                    <div>
                      <div className="text-[10px] font-bold text-amber-700 uppercase">Pencere</div>
                      <div className="text-xs text-slate-700 mt-0.5">
                        {fmtDate(result.windowStart)}
                        <br />→ {fmtDate(parseDate(refDate)!)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-amber-700 uppercase">Kullanılan</div>
                      <div className="text-2xl font-black text-amber-900 mt-0.5 font-mono">
                        {result.used}
                        <span className="text-xs text-slate-400 font-normal"> /90</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-emerald-700 uppercase">Kalan Hak</div>
                      <div className={`text-2xl font-black mt-0.5 font-mono ${result.remaining > 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                        {result.remaining}
                        <span className="text-xs text-slate-400 font-normal"> gün</span>
                      </div>
                    </div>
                  </div>

                  {result.used >= MAX_STAY && result.eligibleDate && (
                    <div className="rounded-xl bg-red-50 border border-red-200 p-3 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div className="text-xs text-red-800">
                        <b>Kuralı aşmışsın!</b> 90 günlük limit doldu. En erken{' '}
                        <b>{fmtDate(result.eligibleDate)}</b> tarihinde yeniden Schengen'e girebilirsin (tam hak sıfırlanması için {fmtDate(addDays(result.windowStart, WINDOW_DAYS))} dönemine bakman gerekir).
                      </div>
                    </div>
                  )}

                  {result.used < MAX_STAY && (
                    <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="text-xs text-emerald-800">
                        <b>Kural içindesin.</b> Bu pencere içinde {result.remaining} gün daha kalabilirsin.
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── PLANLI SEYAHAT KONTROLÜ ───────────────────── */}
              <div className="border-t border-slate-100 pt-5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">
                  Planladığın Sonraki Seyahat (opsiyonel)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-[10px] text-slate-400 mb-0.5">Giriş</div>
                    <input
                      type="date"
                      value={planEntry}
                      onChange={e => setPlanEntry(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
                    />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 mb-0.5">Çıkış</div>
                    <input
                      type="date"
                      value={planExit}
                      onChange={e => setPlanExit(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
                    />
                  </div>
                </div>

                {result?.plannedCheck && (
                  <div className={`mt-3 rounded-xl p-3 border flex items-start gap-2 ${
                    result.plannedCheck.ok
                      ? 'bg-emerald-50 border-emerald-200'
                      : 'bg-red-50 border-red-200'
                  }`}>
                    {result.plannedCheck.ok ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    )}
                    <div className={`text-xs ${result.plannedCheck.ok ? 'text-emerald-800' : 'text-red-800'}`}>
                      {result.plannedCheck.ok ? (
                        <>
                          <b>Plan uygun.</b> {result.plannedCheck.days} gün boyunca maksimum {result.plannedCheck.rollingMax}/90 gün kullanılır.
                        </>
                      ) : (
                        <>
                          <b>Plan kuralı ihlal ediyor.</b> Seyahat sırasında pencere maksimumu {result.plannedCheck.rollingMax}/90 güne çıkıyor — {result.plannedCheck.exceedsBy} gün fazla. Seyahati {result.plannedCheck.exceedsBy} gün kısaltman veya ileri tarihe almanı öneririz.
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                Bu araç Schengen bölgesi içindir. İngiltere, İrlanda ve Schengen olmayan AB üyeleri (Kıbrıs) ayrı kurallar uygular.
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DayCalculatorModal;
