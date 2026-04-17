import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, FileCheck, Download } from 'lucide-react';

export interface DocChecklistProfile {
  targetCountry?: string;
  hasSteadyIncome: boolean;
  salaryDetected: boolean;
  hasAssets: boolean;
  hasSgkJob: boolean;
  isPublicSectorEmployee: boolean;
  isStudent: boolean;
  isMarried: boolean;
  hasChildren: boolean;
  hasPreviousRefusal: boolean;
  hasHighValueVisa?: boolean;
  hasOtherVisa?: boolean;
  strongFamilyTies?: boolean;
  hasSponsor?: boolean;
  applicantAge?: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  profile: DocChecklistProfile;
  onDownloadPDF: () => void;
}

type DocItem = { text: string; note?: string; status: 'required' | 'conditional' };
type DocSection = { title: string; icon: string; items: DocItem[] };

function buildSections(profile: DocChecklistProfile): DocSection[] {
  const country = profile.targetCountry || 'Schengen';
  const isUK = country === 'İngiltere';
  const isUSA = country === 'ABD';
  const sections: DocSection[] = [];

  sections.push({
    title: 'Zorunlu Belgeler',
    icon: '📋',
    items: [
      { text: 'Geçerli pasaport (en az 2 boş sayfa)', status: 'required' },
      { text: 'Önceki pasaportlar (vizeli/damgalı sayfalarla)', status: 'required' },
      { text: 'Vize başvuru formu (eksiksiz ve imzalı)', status: 'required' },
      { text: 'Biyometrik fotoğraf — 35x45mm, beyaz arka fon, 6 aydan yeni', status: 'required' },
      { text: 'Nüfus cüzdanı fotokopisi (ön ve arka)', status: 'required' },
      { text: 'Tam tekmil vukuatlı nüfus kayıt örneği (e-Devlet, barkodlu)', status: 'required' },
      { text: 'Yerleşim yeri belgesi (e-Devlet, barkodlu)', status: 'required' },
      { text: 'Tarihçeli yerleşim yeri belgesi (e-Devlet, barkodlu)', status: 'required' },
      { text: 'e-Devlet yurda giriş-çıkış belgesi (2009\'dan bugüne)', status: 'required' },
      { text: 'Uçak rezervasyonu — gidiş ve dönüş', status: 'required' },
      { text: 'Otel / konaklama rezervasyonu', status: 'required' },
      { text: 'Detaylı seyahat planı (itinerary)', status: 'required' },
      ...(!isUSA ? [{ text: 'Seyahat sağlık sigortası (min. €30.000, Schengen kapsamı)', note: 'AXA, Allianz, Europ Assistance önerilir', status: 'required' as const }] : []),
    ],
  });

  sections.push({
    title: 'Finansal Belgeler',
    icon: '💰',
    items: [
      {
        text: isUK
          ? 'Son 6 aylık banka hesap dökümü (banka kaşeli ve imzalı)'
          : 'Son 3 aylık banka hesap dökümü (banka kaşeli ve imzalı)',
        note: isUK
          ? '28-gün kuralı: para en az 28 gün hesapta olmalı'
          : 'Günlük min. €100-120 gösterilebilmeli',
        status: 'required',
      },
      ...(profile.hasSteadyIncome || profile.salaryDetected
        ? [{ text: 'Son 3 aylık maaş bordrosu', status: 'conditional' as const }]
        : []),
      ...(profile.hasAssets
        ? [{ text: 'Tapu fotokopisi ve/veya araç ruhsatı', status: 'conditional' as const }]
        : []),
    ],
  });

  const isRetired = !profile.hasSgkJob && profile.hasAssets && (profile.applicantAge ?? 0) >= 55;

  if (profile.hasSgkJob || profile.isPublicSectorEmployee) {
    sections.push({
      title: 'Mesleki Belgeler',
      icon: '💼',
      items: [
        { text: 'SGK hizmet dökümü (e-Devlet, barkodlu)', status: 'required' },
        ...(profile.isPublicSectorEmployee
          ? [
              { text: 'Kamu kurumu görev belgesi (imzalı ve kaşeli)', status: 'required' as const },
              { text: 'Kamu kurumu izin onay belgesi (geri dönüş tarihi içeren)', status: 'required' as const },
            ]
          : [
              { text: 'İşveren izin ve görev yazısı (geri dönüş taahhütlü, kaşeli-imzalı)', note: '"İzin verilmiştir" tek başına yetmez; kesin geri dönüş tarihi içermeli', status: 'required' as const },
              { text: 'İşyerine ait güncel vergi levhası fotokopisi', status: 'required' as const },
              { text: 'Ticaret Odası kayıt sureti (6 aydan eski olmayan)', status: 'conditional' as const },
            ]
        ),
      ],
    });
  } else if (profile.isStudent) {
    sections.push({
      title: 'Öğrenci Belgeleri',
      icon: '🎓',
      items: [
        { text: 'Güncel öğrenci belgesi (tercihen İngilizce/Almanca)', status: 'required' },
        { text: 'Not dökümü / Transkript', status: 'required' },
        { text: 'Burs belgesi veya veli finansal sponsorluğu', status: 'conditional' },
      ],
    });
  } else if (isRetired) {
    sections.push({
      title: 'Emeklilik Belgeleri',
      icon: '🏖️',
      items: [
        { text: 'SGK / Bağ-Kur emeklilik belgesi (e-Devlet, barkodlu)', status: 'required' },
        { text: 'Son 3 aylık emekli maaşı hesap dökümü', status: 'required' },
        { text: 'Varlık beyanı (tapu, araç ruhsatı, mevduat)', status: 'conditional' },
      ],
    });
  }

  if (profile.hasSponsor) {
    sections.push({
      title: 'Sponsor Belgeleri',
      icon: '🤝',
      items: [
        { text: 'Noter onaylı sponsor taahhütnamesi (masrafları karşılama beyanı)', status: 'required' },
        { text: 'Sponsorun son 3 aylık banka dökümü (kaşeli-imzalı)', status: 'required' },
        { text: 'Sponsorun kimlik/pasaport fotokopisi', status: 'required' },
        { text: 'Sponsorluk ilişki belgesi (akrabalık / davet / resmi bağ)', status: 'required' },
        { text: 'Sponsorun gelir belgesi (maaş bordrosu veya vergi levhası)', status: 'conditional' },
      ],
    });
  }

  if (profile.isMarried || profile.hasChildren) {
    const familyItems: DocItem[] = [];
    if (profile.isMarried) {
      familyItems.push({ text: 'Evlilik cüzdanı fotokopisi', status: 'required' });
      familyItems.push({ text: 'Formül B — evlilik kayıt belgesi (e-Devlet)', status: 'required' });
    }
    if (profile.hasChildren) {
      familyItems.push({ text: 'Çocukların nüfus cüzdanı fotokopisi', status: 'conditional' });
      familyItems.push({ text: 'Formül A — doğum belgesi (e-Devlet)', status: 'conditional' });
    }
    sections.push({ title: 'Aile ve Memleket Bağ Belgeleri', icon: '👨‍👩‍👧', items: familyItems });
  }

  const countrySpecific: DocItem[] = [];
  if (isUSA) {
    countrySpecific.push({ text: 'DS-160 formu (online, barkod sayfası basılmış)', status: 'required' });
    countrySpecific.push({ text: 'Mülakat randevu onayı', status: 'required' });
    countrySpecific.push({ text: '"Strong ties to Turkey" belge paketi (SGK + tapu + aile)', status: 'required' });
  } else if (isUK) {
    countrySpecific.push({ text: 'Online UK vize başvurusu teyidi (IHS ücreti makbuzu)', status: 'required' });
    countrySpecific.push({ text: '28 gün boyunca sabit banka bakiyesi kanıtı', status: 'required' });
    countrySpecific.push({ text: 'Schengen vize geçmişi (eski pasaport sayfası)', note: 'Schengen geçmişi olmadan UK başvurusu riskli', status: 'conditional' });
  } else {
    countrySpecific.push({ text: 'Konsolosluğa hitaben niyet mektubu (amaç, tarihler, masraf karşılama)', status: 'required' });
    if (profile.hasPreviousRefusal) {
      countrySpecific.push({ text: 'Önceki ret mektubu fotokopisi — MUTLAKA beyan edilmeli', note: 'Gizlemek kara listeye alınmanıza yol açar', status: 'required' });
    }
  }
  if (countrySpecific.length > 0) {
    sections.push({ title: `${country} Özel Belgeler`, icon: '🏛️', items: countrySpecific });
  }

  return sections;
}

export function DocChecklistModal({ isOpen, onClose, profile, onDownloadPDF }: Props) {
  const [checkedDocs, setCheckedDocs] = useState<Set<string>>(new Set());

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
            <div className="px-6 py-4 border-t border-slate-100 flex gap-3 shrink-0">
              <button onClick={onDownloadPDF}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-colors">
                <Download className="w-4 h-4" />
                PDF Olarak İndir
              </button>
              <button onClick={onClose}
                className="px-5 py-3 bg-slate-100 text-slate-700 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-colors">
                Kapat
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
