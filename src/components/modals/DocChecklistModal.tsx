import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, FileCheck, Download, CheckCircle2 } from 'lucide-react';
import type { ProfileData } from '../../types';
import { buildSections, type DocChecklistProfile } from '../../lib/docChecklist';

// Re-export — diğer modüller bu modalden type import etmeye alışkın olabilir.
export type { DocChecklistProfile };

interface Props {
  isOpen: boolean;
  onClose: () => void;
  profile: DocChecklistProfile;
  /** İşaretli belge metinleri parametresiyle çağrılır; PDF üreticisi bu Set'i
   *  kullanarak işaretli kalemleri PDF'te işaretli + üstü çizili gösterir. */
  onDownloadPDF: (checked: Set<string>) => void;
  /** İşaretlenen belgelere göre profile flag güncellemesi uygular. */
  onProfileUpdate?: (updates: Partial<ProfileData>) => void;
}

// Checked item metinlerini profil flag'lerine çevirir.
// Her anahtar kelime (lowercase, eşiz karakter normalize) item içinde
// varsa ilgili flag/alan güncellemesi biriktirilir.
function mapCheckedItemsToProfile(
  checkedTexts: Set<string>,
  profile: DocChecklistProfile,
): Partial<ProfileData> {
  const u: Partial<ProfileData> = {};
  const has = (text: string, kw: string) => text.toLowerCase().includes(kw.toLowerCase());

  for (const text of checkedTexts) {
    // ── Pasaport ─────────────────────────────────────────────────
    if (has(text, 'geçerli pasaport')) {
      u.hasValidPassport = true;
      u.passportConditionGood = true;
      u.passportValidityLong = true;
    }

    // ── Sigorta ──────────────────────────────────────────────────
    if (has(text, 'sağlık sigortası') || has(text, 'seyahat sigortası')) {
      u.hasHealthInsurance = true;
      u.hasTravelInsurance = true;
    }

    // ── Banka ────────────────────────────────────────────────────
    if (has(text, 'banka hesap dökümü') || has(text, 'banka dökümü')) {
      u.bankRegularity = true;
      // 6 aylık UK → 6, aksi halde 3
      const months = has(text, '6 aylık') ? 6 : 3;
      u.statementMonths = months;
      if (months >= 6) u.has6MonthStatements = true;
    }
    if (has(text, '28 gün') && has(text, 'bakiye')) {
      u.has28DayHolding = true;
    }

    // ── Gelir / maaş ─────────────────────────────────────────────
    if (has(text, 'maaş bordrosu')) {
      u.salaryDetected = true;
      u.hasSteadyIncome = true;
      u.incomeSourceClear = true;
    }

    // ── Varlık ───────────────────────────────────────────────────
    if (has(text, 'tapu') || has(text, 'araç ruhsatı')) {
      u.hasAssets = true;
      u.tieCategories = { ...(profile as ProfileData).tieCategories, property: true };
    }

    // ── SGK / İşveren ────────────────────────────────────────────
    if (has(text, 'sgk') && has(text, 'barkodlu')) {
      u.hasBarcodeSgk = true;
    }
    if (has(text, 'işveren') && has(text, 'geri dönüş')) {
      u.sgkEmployerLetterWithReturn = true;
    }

    // ── Seyahat planı / amaç ─────────────────────────────────────
    if (has(text, 'niyet mektubu')) {
      u.useOurTemplate = true;
      u.purposeClear = true;
    }
    if (has(text, 'detaylı seyahat planı') || has(text, 'itinerary')) {
      u.datesMatchReservations = true;
    }
    if (has(text, 'uçak rezervasyonu') || has(text, 'otel') || has(text, 'konaklama rezervasyonu')) {
      u.paidReservations = true;
      u.noFakeBooking = true;
    }
    if (has(text, 'biyometrik fotoğraf')) {
      u.documentConsistency = true;
    }

    // ── Aile / evlilik ───────────────────────────────────────────
    if (has(text, 'evlilik cüzdanı') || has(text, 'formül b')) {
      u.tieCategories = { ...(u.tieCategories ?? (profile as ProfileData).tieCategories), family: true };
      u.strongFamilyTies = true;
    }

    // ── Önceki ret ───────────────────────────────────────────────
    if (has(text, 'önceki ret mektubu') || has(text, 'ret mektubu fotokopisi')) {
      u.previousRefusalDisclosed = true;
    }

    // ── Yerleşim / adres ─────────────────────────────────────────
    if (has(text, 'yerleşim yeri belgesi')) {
      u.addressMatchSgk = true;
    }

    // ── Strong ties paketi (ABD) ─────────────────────────────────
    if (has(text, 'strong ties')) {
      u.strongFamilyTies = true;
      u.tieCategories = {
        ...(u.tieCategories ?? (profile as ProfileData).tieCategories),
        employment: true, property: true, family: true,
      };
    }
  }

  return u;
}

// Profil bayraklarından belgenin "zaten hazır" sayılıp sayılmayacağını döner.
// `mapCheckedItemsToProfile`'ın tersi; aynı anahtar kelimeleri kullanır.
function isItemCompletedInProfile(text: string, profile: DocChecklistProfile): boolean {
  const has = (kw: string) => text.toLowerCase().includes(kw.toLowerCase());

  if (has('geçerli pasaport')) return !!(profile.hasValidPassport && profile.passportValidityLong);
  if (has('sağlık sigortası') || has('seyahat sigortası'))
    return !!(profile.hasHealthInsurance || profile.hasTravelInsurance);
  if (has('banka hesap dökümü') || has('banka dökümü')) {
    if (has('6 aylık')) return !!(profile.bankRegularity && profile.has6MonthStatements);
    return !!profile.bankRegularity;
  }
  if (has('28 gün') && has('bakiye')) return !!profile.has28DayHolding;
  if (has('maaş bordrosu')) return !!(profile.hasSteadyIncome || profile.salaryDetected);
  if (has('tapu') || has('araç ruhsatı')) return !!profile.hasAssets;
  if (has('sgk') && has('barkodlu')) return !!profile.hasBarcodeSgk;
  if (has('işveren') && has('geri dönüş')) return !!profile.sgkEmployerLetterWithReturn;
  if (has('niyet mektubu')) return !!(profile.useOurTemplate && profile.purposeClear);
  if (has('detaylı seyahat planı') || has('itinerary')) return !!profile.datesMatchReservations;
  if (has('uçak rezervasyonu') || has('konaklama rezervasyonu') || has('otel'))
    return !!profile.paidReservations;
  if (has('biyometrik fotoğraf')) return !!profile.documentConsistency;
  if (has('evlilik cüzdanı') || has('formül b'))
    return !!(profile.isMarried && profile.strongFamilyTies);
  if (has('önceki ret mektubu') || has('ret mektubu fotokopisi'))
    return !!profile.previousRefusalDisclosed;
  if (has('yerleşim yeri belgesi')) return !!profile.addressMatchSgk;
  if (has('strong ties')) return !!profile.strongFamilyTies;
  return false;
}

// buildSections + DocItem + DocSection tipleri src/lib/docChecklist.ts'e taşındı.
// Modal hem render'da hem App.tsx'in PDF generator'ı aynı listeyi paylaşır.

export function DocChecklistModal({ isOpen, onClose, profile, onDownloadPDF, onProfileUpdate }: Props) {
  const [checkedDocs, setCheckedDocs] = useState<Set<string>>(new Set());
  const [savedFlash, setSavedFlash] = useState(false);

  // Modal her açıldığında profildeki mevcut bayraklara göre ön-işaretle.
  // Aksi halde sigortası/banka dökümü/pasaportu olan kullanıcı her açışta
  // sıfırdan tıklamak zorunda kalıyordu.
  useEffect(() => {
    if (!isOpen) return;
    const initial = new Set<string>();
    for (const section of buildSections(profile)) {
      for (const item of section.items) {
        if (isItemCompletedInProfile(item.text, profile)) {
          initial.add(item.text);
        }
      }
    }
    setCheckedDocs(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleProfileSave = () => {
    if (!onProfileUpdate) return;
    const updates = mapCheckedItemsToProfile(checkedDocs, profile);
    if (Object.keys(updates).length === 0) return;
    onProfileUpdate(updates);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1800);
  };

  const sections = buildSections(profile);
  const allItems = sections.flatMap(s => s.items);
  const totalCount = allItems.length;
  const doneCount = checkedDocs.size;

  const toggle = (text: string) => {
    setCheckedDocs(prev => {
      const next = new Set(prev);
      if (next.has(text)) next.delete(text);
      else next.add(text);
      return next;
    });
  };

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

            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-4 shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FileCheck className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-lg font-bold text-slate-900">Kişisel Belge Kontrol Listesi</h3>
                </div>
                <p className="text-sm text-slate-500">
                  <span className="font-semibold text-slate-700">{profile.targetCountry || 'Schengen'}</span> başvurusu — profilinize göre oluşturuldu
                </p>
              </div>
              <button onClick={onClose} aria-label="Kapat"
                className="p-2 rounded-xl hover:bg-slate-100 transition-colors shrink-0">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
              {/* Genel ilerleme çubuğu */}
              {totalCount > 0 && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                    <span>{doneCount}/{totalCount} belge hazır</span>
                    <span className={doneCount === totalCount ? 'text-emerald-600' : 'text-slate-400'}>
                      {doneCount === totalCount ? '✓ Tamamlandı!' : `${Math.round((doneCount / totalCount) * 100)}%`}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${doneCount === totalCount ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                      style={{ width: `${Math.round((doneCount / totalCount) * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {sections.map((section) => {
                const sectionDone = section.items.filter(it => checkedDocs.has(it.text)).length;
                return (
                  <div key={section.title}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-base">{section.icon}</span>
                      <h4 className="text-sm font-bold text-slate-800">{section.title}</h4>
                      <span className="text-xs text-slate-400 ml-auto">
                        {sectionDone}/{section.items.length}
                        {sectionDone === section.items.length && section.items.length > 0 && (
                          <span className="ml-1 text-emerald-600 font-bold">✓</span>
                        )}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {section.items.map((item) => {
                        const isChecked = checkedDocs.has(item.text);
                        return (
                          <button
                            key={item.text}
                            type="button"
                            onClick={() => toggle(item.text)}
                            className={`w-full text-left flex items-start gap-3 p-2.5 rounded-xl border transition-all duration-200 ${
                              isChecked
                                ? 'bg-emerald-50 border-emerald-200'
                                : item.status === 'required'
                                  ? 'bg-white border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/30'
                                  : 'bg-slate-50 border-slate-100 hover:border-slate-200'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded border-2 mt-0.5 shrink-0 flex items-center justify-center transition-all ${
                              isChecked ? 'bg-emerald-500 border-emerald-500' : item.status === 'required' ? 'border-indigo-400' : 'border-slate-300'
                            }`}>
                              {isChecked && (
                                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8">
                                  <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm leading-snug transition-all ${isChecked ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                                {item.text}
                              </p>
                              {item.note && !isChecked && (
                                <p className="text-xs text-amber-600 mt-0.5 font-medium">{item.note}</p>
                              )}
                            </div>
                            {item.status === 'conditional' && !isChecked && (
                              <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md shrink-0">Profile Göre</span>
                            )}
                            {isChecked && (
                              <span className="text-[9px] font-bold bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded-md shrink-0">Hazır ✓</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
                <span className="font-bold">Not:</span> Bu liste profilinize göre otomatik oluşturuldu. Konsolosluk ek belge isteyebilir — nihai kontrol için resmi konsolosluk sitesini ziyaret edin.
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 shrink-0 space-y-2.5">
              {onProfileUpdate && doneCount > 0 && (
                <button
                  onClick={handleProfileSave}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all ${
                    savedFlash
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-500 text-white hover:bg-emerald-600'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {savedFlash ? 'Profil Güncellendi ✓' : `Profili Güncelle (${doneCount} belge)`}
                </button>
              )}
              <div className="flex gap-3">
                <button onClick={() => onDownloadPDF(checkedDocs)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-colors">
                  <Download className="w-4 h-4" />
                  PDF Olarak İndir
                </button>
                <button onClick={onClose}
                  className="px-5 py-3 bg-slate-100 text-slate-700 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-colors">
                  Kapat
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
