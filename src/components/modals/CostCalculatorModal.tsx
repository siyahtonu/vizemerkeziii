// ============================================================
// CostCalculatorModal — Maliyet Hesaplayıcı modal sarmalayıcısı
// Araçlar panelinden açılır. İçeride CostCalculatorWidget render eder.
// ============================================================
import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calculator, Download } from 'lucide-react';
import { CostCalculatorWidget } from '../CostCalculatorWidget';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  country: string;
}

export const CostCalculatorModal: React.FC<Props> = ({ isOpen, onClose, country }) => {
  // Widget render sırasında en güncel handleDownloadPdf'i bu ref'e yazar.
  // Modal header'ındaki PDF butonu bu ref üzerinden çalışır.
  const downloadRef = useRef<(() => void) | null>(null);

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
            className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden"
          >
            <div className="p-6 bg-gradient-to-r from-indigo-600 to-brand-700 text-white rounded-t-[2rem] shrink-0">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-indigo-200 text-xs font-bold uppercase tracking-widest mb-2">
                    <Calculator className="w-4 h-4" /> Maliyet Hesaplayıcı
                  </div>
                  <h3 className="text-2xl font-bold">Tahmini Seyahat Maliyeti</h3>
                  <div className="flex items-start gap-3 mt-1 flex-wrap">
                    <p className="text-indigo-100 text-sm flex-1 min-w-[200px]">
                      {country ? `${country} için` : 'Hedef ülke için'} vize + uçak + konaklama + günlük toplam bütçe.
                    </p>
                    <button
                      onClick={() => downloadRef.current?.()}
                      className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-indigo-700 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors"
                      title="Hesaplamayı PDF olarak indir"
                    >
                      <Download className="w-3.5 h-3.5" />
                      PDF olarak indir
                    </button>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors shrink-0" aria-label="Kapat">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <CostCalculatorWidget country={country} embedded downloadRef={downloadRef} />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CostCalculatorModal;
