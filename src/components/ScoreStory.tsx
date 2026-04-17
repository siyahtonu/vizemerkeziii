// ============================================================
// ScoreStory — #14 Skor Anlatımı (Storytelling)
// "100 başvurucudan 72'si gibi profille..." yaklaşımı
// ============================================================

import { useMemo } from 'react';
import type { ProfileData } from '../types';
import { resolveSegment } from '../scoring/algorithms';

interface Props {
  profile: ProfileData;
  score: number;
  /** Simülatör değeri (banka bakiyesi override) */
  simValue?: number;
}

// ── Bölüm Verimlilik Hesabı ──────────────────────────────────────────────
interface SectionScore {
  name:       string;
  earned:     number;
  max:        number;
  efficiency: number; // 0-1
  hint:       string; // Nasıl iyileştirilir
}

function getSections(p: ProfileData, simValue = 0): SectionScore[] {
  // ─── Finansal ────────────────────────────────────────────────────────
  let fin = 0;
  const finMax = 28;
  if (p.bankSufficientBalance || simValue > 150000) fin += 7;
  else if (simValue > 75000) fin += 3;
  if (p.highSavingsAmount || simValue > 350000) fin += 5;
  if (p.bankRegularity) fin += 5;
  if (p.incomeSourceClear) fin += 4;
  if (p.salaryDetected) fin += 3;
  if (p.hasAssets) fin += 3;
  if (p.hasRegularSpending && p.recurringExpensesDetected) fin += 3;
  if (p.dailyBudgetSufficient) fin += 4;
  if (!p.hasRegularSpending) fin -= 8;
  if (p.unusualLargeTransactions) fin -= 5;
  if (p.monthlyInflow < p.monthlyOutflow && p.monthlyInflow > 0) fin -= 6;

  // ─── Mesleki ─────────────────────────────────────────────────────────
  // Segment-aware: öğrenci/sponsor/55+ emekli için SGK eksikliği ceza değil.
  let pro = 0;
  const proMax = 22;
  // core.ts:54 ile hizalı — segment bazlı (unemployed working-age için -5 ceza uygulanmaz)
  const segment = resolveSegment(p);
  const expectsEmployment = segment === 'employed' || segment === 'public_sector' || segment === 'self_employed';
  if (p.hasSgkJob) {
    pro += 12;
    if (p.yearsInCurrentJob >= 3) pro += 5;
    else if (p.yearsInCurrentJob === 2) pro += 4;
    else if (p.yearsInCurrentJob === 1) pro += 2;
    else pro -= 4;
  } else if (expectsEmployment) {
    pro -= 5;
  }
  if (p.isPublicSectorEmployee) pro += 6;
  if (p.sgkEmployerLetterWithReturn) pro += 5;
  if (p.sgkAddressMatchesDs160) pro += 2;
  if (p.hasBarcodeSgk) pro += 2;

  // ─── Bağlar ──────────────────────────────────────────────────────────
  let tie = 0;
  const tieMax = 20;
  if (p.tieCategories?.employment) tie += 5;
  if (p.tieCategories?.property)   tie += 5;
  if (p.tieCategories?.family)     tie += 4;
  if (p.tieCategories?.community)  tie += 3;
  if (p.tieCategories?.education)  tie += 3;
  if (p.isMarried) tie += 3;
  if (p.hasChildren) tie += 3;
  if (p.isStudent) tie += 2;
  if (p.strongFamilyTies) tie += 1;

  // ─── Seyahat ─────────────────────────────────────────────────────────
  let trav = 0;
  const travMax = 20;
  if (p.hasHighValueVisa) trav += 16;
  else if (p.hasOtherVisa) trav += 10;
  else if (p.travelHistoryNonVisa) trav += 6;
  if (!p.noOverstayHistory) trav -= 30;

  // ─── Başvuru Kalitesi ─────────────────────────────────────────────────
  let app = 0;
  const appMax = 15;
  if (p.useOurTemplate) app += 5;
  if (p.hasInvitation) app += 3;
  if (p.paidReservations) app += 3;
  if (p.addressMatchSgk) app += 2;
  if (p.datesMatchReservations) app += 2;
  if (p.purposeClear) app += 6;
  if (p.hasReturnTicket) app += 3;

  // ─── Belge Güven ─────────────────────────────────────────────────────
  let doc = 0;
  const docMax = 12;
  if (p.hasValidPassport && p.passportConditionGood) doc += 3;
  if (p.passportValidityLong) doc += 3;
  if (p.documentConsistency) doc += 3;
  if (p.cleanCriminalRecord) doc += 3;
  if (p.hasHealthInsurance || p.hasTravelInsurance) doc += 5;

  const clamp = (v: number, max: number) => Math.max(0, Math.min(v, max));

  return [
    {
      name: 'Finansal Güç', earned: clamp(fin, finMax), max: finMax,
      efficiency: clamp(fin, finMax) / finMax,
      hint: !p.bankRegularity
        ? '6 aylık düzenli banka dökümü eksik'
        : !p.bankSufficientBalance
        ? 'Bakiye €30/gün × gün sayısı eşiğinin altında'
        : p.unusualLargeTransactions
        ? 'Açıklanamayan büyük hareketler var'
        : 'Sigorta ve günlük bütçe ispat eksik',
    },
    {
      name: p.isStudent ? 'Öğrencilik Kanıtı'
          : p.hasSponsor ? 'Sponsor Güvencesi'
          : (p.applicantAge >= 55 && !p.hasSgkJob) ? 'Emeklilik & Varlık'
          : 'Mesleki Bağlılık',
      earned: clamp(pro, proMax), max: proMax,
      efficiency: clamp(pro, proMax) / proMax,
      hint: p.isStudent
        ? 'Öğrenci belgesi / transkript eksik'
        : p.hasSponsor
        ? 'Sponsor mektubu ve mali taahhüt belgesi eksik'
        : (p.applicantAge >= 55 && !p.hasSgkJob)
        ? 'Emeklilik belgesi / varlık kanıtı eksik'
        : !p.hasSgkJob
        ? 'SGK kaydı yok veya aktif değil'
        : !p.sgkEmployerLetterWithReturn
        ? 'Dönüş taahhütlü işveren mektubu eksik'
        : 'İş kıdemi 1 yılın altında',
    },
    {
      name: 'Türkiye Bağları', earned: clamp(tie, tieMax), max: tieMax,
      efficiency: clamp(tie, tieMax) / tieMax,
      hint: !p.tieCategories?.property
        ? 'Mülk / ev sahipliği belgesi eksik'
        : !p.tieCategories?.employment
        ? 'İş bağı kategorisi tamamlanmamış'
        : 'Aile bağı belgesi (evlilik/çocuk) eksik',
    },
    {
      name: 'Seyahat Geçmişi', earned: clamp(trav, travMax), max: travMax,
      efficiency: !p.noOverstayHistory ? 0 : clamp(trav, travMax) / travMax,
      hint: !p.noOverstayHistory
        ? 'Süre aşımı geçmişi — skor sınırı aktif'
        : !p.hasHighValueVisa && !p.hasOtherVisa
        ? 'Önceki vizesi yok (yüksek riskli profil)'
        : 'Eski vizenin üzerinden çok yıl geçti',
    },
    {
      name: 'Başvuru Kalitesi', earned: clamp(app, appMax), max: appMax,
      efficiency: clamp(app, appMax) / appMax,
      hint: !p.purposeClear
        ? 'Seyahat amacı yetersiz belgelenmiş'
        : !p.paidReservations
        ? 'Ödemeli otel/uçak rezervasyonu yok'
        : 'Profesyonel niyet mektubu eksik',
    },
    {
      name: 'Belge Güveni', earned: clamp(doc, docMax), max: docMax,
      efficiency: clamp(doc, docMax) / docMax,
      hint: !p.hasHealthInsurance && !p.hasTravelInsurance
        ? 'Seyahat sigortası eksik (Schengen zorunlu)'
        : !p.documentConsistency
        ? 'Belgeler arasında tutarsızlık var'
        : 'Pasaport seyahat sonrası 6 aydan az geçerli',
    },
  ];
}

// ── Puan → Anlatı Üretici ────────────────────────────────────────────────
function buildNarrative(
  profile:   ProfileData,
  score:     number,
  weak:      SectionScore,
  strong:    SectionScore,
  potential: number,
): { opener: string; body: string; cta: string; indicator: '🟢' | '🟡' | '🔴' } {

  const name    = profile.targetCountry || 'bu ülke';
  const gainStr = potential > score ? ` (+${potential - score} puan)` : '';

  if (!profile.noOverstayHistory) {
    return {
      indicator: '🔴',
      opener: 'Kritik bir engel tespit edildi.',
      body:   'Pasaport/vize geçmişinizde süre aşımı kaydı bulunuyor. Bu, skor üst sınırını %10\'a kitleyen bir veto kuralıdır. Başvurudan önce bu durumu açıklayıcı bir dilekçeyle ele almalısınız.',
      cta:    'Süre aşımını nasıl açıklayacağınızı öğrenin',
    };
  }

  if (score >= 82) {
    return {
      indicator: '🟢',
      opener: `Güçlü Profil — ${name} için hazır görünüyor.`,
      body:   `100 başvurucudan ${score}'u gibi profilli kişiler genellikle onay alıyor. **${strong.name}** çok güçlü. Belge paketinizi eksiksiz hazırlayın — bu seviyede reddedilmelerin %90'ı belge eksikliğinden kaynaklanıyor.`,
      cta:    'Niyet mektubunuzu oluşturun',
    };
  }

  if (score >= 72) {
    return {
      indicator: '🟢',
      opener: `Güçlü Profil — ama ${82 - score} puanlık bir fark var.`,
      body:   `100 başvurucudan ${score}'u gibi profille değerlendirme alıyorsunuz. **${strong.name}** iyi — ama **${weak.name}** zayıf (${weak.hint}). Bunu kapatırsanız skor ${potential}'e çıkabilir${gainStr}.`,
      cta:    `${weak.name} bölümünü güçlendirin`,
    };
  }

  if (score >= 55) {
    return {
      indicator: '🟡',
      opener: 'Orta Profil — iyileştirme ile onay mümkün.',
      body:   `100 başvurucudan yaklaşık ${score}'u benzer profil taşıyor. **${strong.name}** olumlu — ama en kritik eksik **${weak.name}** (${weak.hint}). Bu tek alanı düzeltmek skoru ${potential}'e taşıyabilir${gainStr}.`,
      cta:    `En kritik adımı görün`,
    };
  }

  return {
    indicator: '🔴',
    opener: 'Dikkat: Başvuru yüksek riskli.',
    body:   `Mevcut profilde ciddi eksikler var. En ağır sorun: **${weak.name}** — ${weak.hint}. Başvurmadan önce bu açığı kapatmak reddi büyük ölçüde azaltır.`,
    cta:    `Kritik eksikleri listeleyin`,
  };
}

// ── Potansiyel skor: en zayıf bölüm düzelirse ne olur ────────────────────
function estimatePotential(score: number, weak: SectionScore): number {
  const gap  = weak.max - weak.earned;
  // %50 verimlilik iyileşmesi varsayımı (gerçekçi üst sınır)
  const gain = Math.round(gap * 0.5);
  return Math.min(99, score + gain);
}

// ── Ana Bileşen ─────────────────────────────────────────────────────────
const ScoreStory: React.FC<Props> = ({ profile, score, simValue = 0 }) => {
  const sections = useMemo(
    () => getSections(profile, simValue),
    [profile, simValue],
  );

  const weakest = useMemo(
    () => [...sections].sort((a, b) => a.efficiency - b.efficiency)[0],
    [sections],
  );

  const strongest = useMemo(
    () => [...sections].sort((a, b) => b.efficiency - a.efficiency)[0],
    [sections],
  );

  const potential = useMemo(
    () => estimatePotential(score, weakest),
    [score, weakest],
  );

  const { opener, body, cta, indicator } = useMemo(
    () => buildNarrative(profile, score, weakest, strongest, potential),
    [profile, score, weakest, strongest, potential],
  );

  const scoreColor =
    score >= 82 ? 'text-emerald-600' :
    score >= 65 ? 'text-amber-600'   : 'text-rose-600';
  const bgColor =
    score >= 82 ? 'bg-emerald-50 border-emerald-200' :
    score >= 65 ? 'bg-amber-50 border-amber-200'     : 'bg-rose-50 border-rose-200';

  // Bold markdown → span
  const renderBody = (text: string) =>
    text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
      i % 2 === 1
        ? <strong key={i} className="text-slate-900">{part}</strong>
        : <span key={i}>{part}</span>,
    );

  return (
    <div className={`rounded-xl border p-4 ${bgColor}`}>
      {/* Başlık */}
      <div className="flex items-start gap-3">
        <div className="text-2xl leading-none pt-0.5">{indicator}</div>
        <div className="flex-1 min-w-0">
          <p className={`font-bold text-sm ${scoreColor} leading-tight`}>{opener}</p>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            {renderBody(body)}
          </p>
        </div>
      </div>

      {/* Bölüm Çubukları — sadece orta ve zayıf profillerde */}
      {score < 82 && (
        <div className="mt-3 space-y-1.5">
          {sections.map(sec => (
            <div key={sec.name} className="flex items-center gap-2">
              <span className={`text-[10px] w-28 shrink-0 font-medium ${
                sec === weakest ? 'text-rose-600 font-bold' : 'text-slate-400'
              }`}>{sec.name}</span>
              <div className="flex-1 h-1.5 bg-white/70 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    sec === weakest
                      ? 'bg-rose-400'
                      : sec.efficiency >= 0.7
                      ? 'bg-emerald-400'
                      : sec.efficiency >= 0.45
                      ? 'bg-amber-400'
                      : 'bg-slate-300'
                  }`}
                  style={{ width: `${Math.max(4, Math.round(sec.efficiency * 100))}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 w-8 text-right">
                {Math.round(sec.efficiency * 100)}%
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Potansiyel göstergesi */}
      {score < 82 && potential > score + 2 && (
        <div className="mt-3 flex items-center gap-2 text-[11px]">
          <span className="text-slate-400">Potansiyel:</span>
          <span className="font-bold text-indigo-600">%{potential}</span>
          <span className="text-slate-300">→</span>
          <span className="text-slate-500">{cta}</span>
        </div>
      )}
    </div>
  );
};

import React from 'react';
export default ScoreStory;
export { getSections, buildNarrative, estimatePotential };
