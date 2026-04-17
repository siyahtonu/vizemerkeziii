// ============================================================
// EvidenceChecklist — Kişiselleştirilmiş Kanıt Kontrol Listesi v2
//
// Özellikler:
//  • Her madde için anlık skor delta (+X puan badge)
//  • localStorage kalıcılığı — sayfa yenilemede ilerleme korunur
//  • "Sıradaki En Etkili Adım" sticky kartı
//  • Öncelik grubu + kategori breakdown
//  • %25 / %50 / %75 / %100 milestone kutlamaları
//  • "Yaptım ✓" → profil güncelleme + "Geri al" ile güvenli revert
// ============================================================
import { useMemo, useState, useEffect, useCallback } from 'react';
import {
  CheckCircle2, ExternalLink, ChevronDown, ChevronUp,
  ListChecks, Zap, TrendingUp, Trophy, ArrowRight, RotateCcw,
} from 'lucide-react';
import type { ProfileData } from '../types';
import { calculateScore } from '../scoring/core';

type Priority = 'critical' | 'high' | 'medium';
type Category = 'financial' | 'professional' | 'application' | 'trust' | 'country';

interface ChecklistItem {
  id: string;
  label: string;
  detail: string;
  link?: string;
  linkLabel?: string;
  patch: Partial<ProfileData>;
  priority: Priority;
  category: Category;
  showIf: (p: ProfileData) => boolean;
}

// ── Tüm Maddeler ─────────────────────────────────────────────────────────────
const ALL_ITEMS: ChecklistItem[] = [
  // ── KRİTİK ──────────────────────────────────────────────────────────────────
  {
    id: 'insurance',
    label: 'Seyahat/sağlık sigortası yaptır (min €30.000)',
    detail: 'Schengen zorunluluğu. Türk başvurularında %15 ret sebebi. AXA, Allianz veya Mapfre.',
    link: 'https://www.axasigortaonline.com.tr',
    linkLabel: 'Sigorta al →',
    patch: { hasHealthInsurance: true, hasTravelInsurance: true },
    priority: 'critical',
    category: 'trust',
    showIf: p => !p.hasHealthInsurance && !p.hasTravelInsurance,
  },
  {
    id: 'bank_regularity',
    label: 'Son 6 ay banka dökümü al (kaşeli/imzalı)',
    detail: 'Düzenli harcama ve gelir hareketi konsoloslukta güven oluşturur. Banka şubesinden kaşeli alın.',
    link: 'https://www.turkiye.gov.tr',
    linkLabel: 'e-Devlet banka ekstresine git →',
    patch: { bankRegularity: true, incomeSourceClear: true },
    priority: 'critical',
    category: 'financial',
    showIf: p => !p.bankRegularity,
  },
  {
    id: 'cover_letter',
    label: 'Niyet mektubu hazırla (şablondan)',
    detail: 'Seyahat amacını net açıkla. Türk başvurularında #2 ret sebebi. Belge üretici aracımızı kullan.',
    patch: { purposeClear: true, useOurTemplate: true },
    priority: 'critical',
    category: 'application',
    showIf: p => !p.purposeClear || !p.useOurTemplate,
  },
  {
    id: 'uk_28day',
    label: 'UK: Parayı 28 gün önceden hesaba yatır',
    detail: 'İngiltere vize ofisi son 28 günlük ekstre ister. Son dakika yatırımı otomatik reddeder.',
    patch: { has28DayHolding: true },
    priority: 'critical',
    category: 'country',
    showIf: p => p.targetCountry === 'İngiltere' && !p.has28DayHolding,
  },
  {
    id: 'usa_interview',
    label: 'ABD: B1/B2 mülakat soruları çalış',
    detail: '214(b) testi için hazırlan. "Neden geri dönersiniz?" sorusunu somut bağlarla yanıtla.',
    patch: { interviewPrepared: true, interviewConfidence: 'high' },
    priority: 'critical',
    category: 'country',
    showIf: p => p.targetCountry === 'ABD' && !p.interviewPrepared,
  },

  // ── YÜKSEK ──────────────────────────────────────────────────────────────────
  {
    id: 'employer_letter',
    label: 'İşveren mektubu + geri dönüş onayı al',
    detail: 'Şirket antetli, imzalı, kaşeli. İşveren adı, pozisyon, izin tarihleri içermeli.',
    patch: { sgkEmployerLetterWithReturn: true },
    priority: 'high',
    category: 'professional',
    showIf: p => p.hasSgkJob && !p.sgkEmployerLetterWithReturn,
  },
  {
    id: 'hotel',
    label: 'Otel rezervasyonu yap (iptal edilebilir)',
    detail: 'Booking.com üzerinden ücretsiz iptal seçenekli rezervasyon yeterlidir. Ödeme gerekmez.',
    link: 'https://www.booking.com',
    linkLabel: 'Booking.com →',
    patch: { paidReservations: true, datesMatchReservations: true },
    priority: 'high',
    category: 'application',
    showIf: p => !p.paidReservations,
  },
  {
    id: 'flight',
    label: 'Uçak rezervasyonu yap (onaysız bilet)',
    detail: 'flyrez.com veya benzer servisle ücret ödemeden rezervasyon yapılabilir.',
    link: 'https://www.flyrez.com',
    linkLabel: 'Flyrez →',
    patch: { hasReturnTicket: true },
    priority: 'high',
    category: 'application',
    showIf: p => !p.hasReturnTicket,
  },
  {
    id: 'sgk_barcode',
    label: 'Barkodlu SGK hizmet dökümü al (e-Devlet)',
    detail: 'QR kodlu baskı sahtecilik şüphesini sıfırlar. Adres eşleşmesini kontrol et.',
    link: 'https://www.turkiye.gov.tr/sosyal-guvenlik-kurumu-hizmet-dokumu',
    linkLabel: 'e-Devlet SGK →',
    patch: { hasBarcodeSgk: true, sgkAddressMatchesDs160: true },
    priority: 'high',
    category: 'professional',
    showIf: p => p.hasSgkJob && !p.hasBarcodeSgk,
  },
  {
    id: 'passport_check',
    label: 'Pasaport geçerliliğini kontrol et (min 6 ay)',
    detail: 'Gidiş tarihi + vize süresi + 3 ay tampon gerekli. Süre kısaysa yenileme başvurusu yap.',
    patch: { passportValidityLong: true, passportConditionGood: true },
    priority: 'high',
    category: 'trust',
    showIf: p => !p.passportValidityLong,
  },
  {
    id: 'uk_6month',
    label: 'UK: 6 aylık banka dökümü hazırla',
    detail: 'İngiltere standart gereksinimi — Schengen\'in aksine 6 ay zorunludur.',
    patch: { has6MonthStatements: true, statementMonths: 6 },
    priority: 'high',
    category: 'country',
    showIf: p => p.targetCountry === 'İngiltere' && !p.has6MonthStatements,
  },

  // ── ORTA ────────────────────────────────────────────────────────────────────
  {
    id: 'doc_consistency',
    label: 'Belgelerdeki adres/isim tutarlılığını kontrol et',
    detail: 'Pasaport, SGK, banka ekstresindeki ad ve adres birebir aynı olmalı.',
    patch: { documentConsistency: true, addressMatchSgk: true },
    priority: 'medium',
    category: 'trust',
    showIf: p => !p.documentConsistency,
  },
  {
    id: 'daily_budget',
    label: 'Günlük €100-120 karşılığı bakiye göster',
    detail: 'Schengen standart: seyahat günü × €100 minimum. Hesap ekstresinde net görünmeli.',
    patch: { dailyBudgetSufficient: true, bankSufficientBalance: true },
    priority: 'medium',
    category: 'financial',
    showIf: p => !p.dailyBudgetSufficient,
  },
  {
    id: 'social_media',
    label: 'Sosyal medya hesaplarını kontrol et (2025 kriteri)',
    detail: 'Hesaplar kapalı olmamalı. LinkedIn veya Instagram profili olumlu sinyal.',
    patch: { hasSocialMediaFootprint: true },
    priority: 'medium',
    category: 'application',
    showIf: p => !p.hasSocialMediaFootprint,
  },
  {
    id: 'criminal_record',
    label: 'Sabıka kaydı belgesi al',
    detail: 'e-Devlet üzerinden ücretsiz, anlık. Bazı ülkeler noterli kopya ister.',
    link: 'https://www.turkiye.gov.tr/adalet-bakanligi-adli-sicil-belgesi',
    linkLabel: 'e-Devlet →',
    patch: { cleanCriminalRecord: true },
    priority: 'medium',
    category: 'trust',
    showIf: p => !p.cleanCriminalRecord,
  },
];

// ── Sabitler ──────────────────────────────────────────────────────────────────
const PRIORITY_ORDER: Priority[] = ['critical', 'high', 'medium'];
const PRIORITY_LABEL: Record<Priority, string> = {
  critical: 'Kritik',
  high: 'Önemli',
  medium: 'Orta',
};
const PRIORITY_COLOR: Record<Priority, { badge: string; glow: string }> = {
  critical: { badge: 'bg-rose-100 text-rose-700 border-rose-200',   glow: 'border-rose-200 bg-rose-50/40' },
  high:     { badge: 'bg-amber-100 text-amber-700 border-amber-200', glow: 'border-amber-200 bg-amber-50/40' },
  medium:   { badge: 'bg-slate-100 text-slate-600 border-slate-200', glow: 'border-slate-200 bg-white' },
};
const CATEGORY_LABEL: Record<Category, string> = {
  financial: 'Finansal', professional: 'Profesyonel',
  application: 'Başvuru', trust: 'Güven', country: 'Ülke Özel',
};
const STORAGE_KEY = 'evidence_checklist_v2';
const MILESTONES = [25, 50, 75, 100];

// ── Skor delta hesabı (tek madde için) ───────────────────────────────────────
function scoreDelta(profile: ProfileData, patch: Partial<ProfileData>, base: number): number {
  return Math.round(calculateScore({ ...profile, ...patch }) - base);
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  profile: ProfileData;
  currentScore: number;
  onProfileUpdate: (patch: Partial<ProfileData>) => void;
}

export function EvidenceChecklist({ profile, currentScore, onProfileUpdate }: Props) {
  // localStorage'dan başlangıç durumu
  const [checked, setChecked] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? new Set<string>(JSON.parse(raw)) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  });
  const [expanded, setExpanded] = useState(true);
  const [recentMilestone, setRecentMilestone] = useState<number | null>(null);

  // Profildeki eksiklere göre filtrele
  const visible = useMemo(
    () => ALL_ITEMS.filter(item => item.showIf(profile)),
    [profile],
  );

  const total     = visible.length;
  const doneCount = [...checked].filter(id => visible.some(i => i.id === id)).length;
  const progress  = total === 0 ? 100 : Math.round((doneCount / total) * 100);

  // Her madde için bireysel delta (sadece görünür maddeler)
  const deltas = useMemo(() => {
    const map: Record<string, number> = {};
    visible.forEach(item => {
      if (!checked.has(item.id)) {
        map[item.id] = scoreDelta(profile, item.patch, currentScore);
      }
    });
    return map;
  }, [visible, profile, currentScore, checked]);

  // En yüksek kazanımlı sıradaki madde
  const topItem = useMemo(() => {
    const candidates = visible.filter(i => !checked.has(i.id));
    if (candidates.length === 0) return null;
    // Önce kritik, sonra en yüksek delta
    const criticals = candidates.filter(i => i.priority === 'critical');
    const pool = criticals.length > 0 ? criticals : candidates;
    return pool.reduce((best, cur) =>
      (deltas[cur.id] ?? 0) > (deltas[best.id] ?? 0) ? cur : best
    );
  }, [visible, checked, deltas]);

  // Toplam tahmini skor
  const combinedPatch = useMemo(() => {
    const merged: Partial<ProfileData> = {};
    visible.forEach(item => {
      if (checked.has(item.id)) Object.assign(merged, item.patch);
    });
    return merged;
  }, [checked, visible]);
  const projectedScore = useMemo(
    () => Object.keys(combinedPatch).length > 0
      ? Math.round(calculateScore({ ...profile, ...combinedPatch }))
      : currentScore,
    [combinedPatch, profile, currentScore],
  );
  const totalGain = projectedScore - currentScore;

  // Kategori breakdown
  const categoryStats = useMemo(() => {
    const cats = Array.from(new Set(visible.map(i => i.category)));
    return cats.map(cat => ({
      cat,
      done: visible.filter(i => i.category === cat && checked.has(i.id)).length,
      total: visible.filter(i => i.category === cat).length,
    }));
  }, [visible, checked]);

  // localStorage persist + milestone detection
  const prevProgress = useMemo(() => {
    const prevDone = doneCount - (recentMilestone !== null ? 1 : 0);
    return total === 0 ? 100 : Math.round((prevDone / total) * 100);
  }, [doneCount, total, recentMilestone]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...checked]));
  }, [checked]);

  const handleToggle = useCallback((item: ChecklistItem) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(item.id)) {
        next.delete(item.id);
      } else {
        next.add(item.id);
        onProfileUpdate(item.patch);
        // Milestone kontrolü
        const newProgress = total === 0 ? 100 : Math.round((next.size / total) * 100);
        const hit = MILESTONES.find(m => newProgress >= m && prevProgress < m);
        if (hit) {
          setRecentMilestone(hit);
          setTimeout(() => setRecentMilestone(null), 3000);
        }
      }
      return next;
    });
  }, [onProfileUpdate, total, prevProgress]);

  // Gruplar
  const grouped = PRIORITY_ORDER
    .map(priority => ({
      priority,
      items: visible.filter(i => i.priority === priority),
    }))
    .filter(g => g.items.length > 0);

  if (visible.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-emerald-200 p-5 flex items-center gap-3">
        <Trophy className="w-6 h-6 text-emerald-500 shrink-0" />
        <div>
          <div className="font-bold text-emerald-700 text-sm">Tüm maddeler tamamlandı!</div>
          <div className="text-xs text-slate-400 mt-0.5">Profiliniz konsolosluk için hazır görünüyor.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">

      {/* ── Başlık ── */}
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 border-b border-slate-100 hover:bg-slate-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-rose-50 rounded-xl flex items-center justify-center shrink-0">
            <ListChecks className="w-4 h-4 text-rose-600" />
          </div>
          <div>
            <div className="font-bold text-slate-900 text-sm">Kanıt Kontrol Listesi</div>
            <div className="text-xs text-slate-400">
              {doneCount}/{total} madde ·{' '}
              {totalGain > 0
                ? <span className="text-emerald-600 font-bold">+{totalGain} puan kazanıldı</span>
                : 'tiklediğinde skor anında yükselir'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
            progress === 100 ? 'bg-emerald-100 text-emerald-700'
            : progress >= 50 ? 'bg-amber-100 text-amber-700'
            : 'bg-rose-100 text-rose-700'
          }`}>
            %{progress}
          </span>
          {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </button>

      {expanded && (
        <div className="p-5 space-y-5">

          {/* ── Milestone kutlama banner ── */}
          {recentMilestone !== null && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 animate-pulse">
              <Trophy className="w-5 h-5 text-emerald-500 shrink-0" />
              <span className="text-sm font-bold text-emerald-700">
                %{recentMilestone} tamamlandı! {recentMilestone === 100 ? '🎉 Mükemmel!' : 'Harika gidiyorsun →'}
              </span>
            </div>
          )}

          {/* ── Progress bar ── */}
          <div className="space-y-2">
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  progress === 100 ? 'bg-emerald-500'
                  : progress >= 50 ? 'bg-amber-400'
                  : 'bg-rose-400'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Mevcut: <span className="font-bold text-slate-600">%{currentScore}</span></span>
              {totalGain > 0 && (
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Tahmini: %{projectedScore} <span className="text-emerald-500">(+{totalGain})</span>
                </span>
              )}
            </div>

            {/* Milestone işaretçileri */}
            <div className="relative w-full h-1">
              {MILESTONES.slice(0, -1).map(m => (
                <div
                  key={m}
                  className={`absolute top-0 w-1 h-1 rounded-full -translate-x-0.5 transition-colors ${
                    progress >= m ? 'bg-emerald-400' : 'bg-slate-300'
                  }`}
                  style={{ left: `${m}%` }}
                />
              ))}
            </div>
          </div>

          {/* ── Sıradaki En Etkili Adım ── */}
          {topItem && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-50 to-blue-50 border border-brand-100">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-brand-600 shrink-0" />
                <span className="text-[10px] font-bold text-brand-600 uppercase tracking-widest">Sıradaki En Etkili Adım</span>
                {(deltas[topItem.id] ?? 0) > 0 && (
                  <span className="ml-auto text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                    +{deltas[topItem.id]} puan
                  </span>
                )}
              </div>
              <div className="text-sm font-bold text-slate-800">{topItem.label}</div>
              <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">{topItem.detail}</div>
              <div className="flex items-center gap-2 mt-3">
                {topItem.link && (
                  <a
                    href={topItem.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline"
                  >
                    {topItem.linkLabel ?? topItem.link}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => handleToggle(topItem)}
                  className="ml-auto flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold bg-brand-600 text-white hover:bg-brand-700 rounded-xl transition-colors"
                >
                  Yaptım ✓ <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* ── Kategori özeti ── */}
          {categoryStats.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {categoryStats.map(({ cat, done, total: t }) => (
                <div key={cat} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                  done === t ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : done > 0 ? 'bg-amber-50 border-amber-200 text-amber-700'
                  : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}>
                  {done === t ? '✓' : `${done}/${t}`} {CATEGORY_LABEL[cat]}
                </div>
              ))}
            </div>
          )}

          {/* ── Öncelik grupları ── */}
          {grouped.map(({ priority, items }) => (
            <div key={priority}>
              <div className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full border mb-2.5 ${PRIORITY_COLOR[priority].badge}`}>
                {priority === 'critical' && '⚠ '}
                {PRIORITY_LABEL[priority]}
                <span className="opacity-60">
                  · {items.filter(i => checked.has(i.id)).length}/{items.length}
                </span>
              </div>

              <div className="space-y-2">
                {items.map(item => {
                  const isChecked = checked.has(item.id);
                  const delta = deltas[item.id] ?? 0;
                  return (
                    <div
                      key={item.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border transition-all duration-200 ${
                        isChecked
                          ? 'border-emerald-200 bg-emerald-50/60'
                          : `${PRIORITY_COLOR[priority].glow} hover:border-slate-300`
                      }`}
                    >
                      {/* Checkbox */}
                      <button
                        type="button"
                        aria-label={isChecked ? 'Geri al' : 'Yaptım'}
                        onClick={() => handleToggle(item)}
                        className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                          isChecked
                            ? 'bg-emerald-500 border-emerald-500'
                            : 'border-slate-300 hover:border-emerald-400'
                        }`}
                      >
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      </button>

                      {/* İçerik */}
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-bold ${isChecked ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                          {item.label}
                        </div>
                        {!isChecked && (
                          <>
                            <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.detail}</div>
                            {item.link && (
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline mt-1"
                                onClick={e => e.stopPropagation()}
                              >
                                {item.linkLabel ?? item.link}
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </>
                        )}
                      </div>

                      {/* Sağ: delta badge + aksiyon */}
                      <div className="shrink-0 flex flex-col items-end gap-1.5">
                        {!isChecked && delta > 0 && (
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                            +{delta} puan
                          </span>
                        )}
                        {!isChecked ? (
                          <button
                            type="button"
                            onClick={() => handleToggle(item)}
                            className="px-3 py-1.5 text-xs font-bold bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-200 rounded-lg transition-colors whitespace-nowrap"
                          >
                            Yaptım ✓
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleToggle(item)}
                            className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-200 rounded-lg transition-colors"
                          >
                            <RotateCcw className="w-3 h-3" /> Geri al
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <p className="text-[10px] text-slate-400 text-center pt-1">
            İlerlemeniz tarayıcıda saklanır — sayfa yenilesen de kaybolmaz.
          </p>
        </div>
      )}
    </div>
  );
}
