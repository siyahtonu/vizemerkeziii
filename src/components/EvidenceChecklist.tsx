// ============================================================
// EvidenceChecklist — Kişiselleştirilmiş Kanıt Kontrol Listesi
// Profildeki eksik alanlara göre dinamik oluşur.
// "Yaptım" → profil güncellemesi → skor anında yükselir.
// ============================================================
import { useMemo, useState } from 'react';
import { CheckCircle2, Circle, ExternalLink, ChevronDown, ChevronUp, ListChecks } from 'lucide-react';
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

const ALL_ITEMS: ChecklistItem[] = [
  // ── KRİTİK ──────────────────────────────────────────────────────────────
  {
    id: 'insurance',
    label: 'Seyahat/sağlık sigortası yaptır (min €30.000)',
    detail: 'Schengen zorunluluğu. Türk başvurularında %15 ret sebebi.',
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
    detail: 'Düzenli harcama ve gelir hareketi konsoloslukta güven oluşturur.',
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
    detail: 'Seyahat amacını net açıkla. Türk başvurularında #2 ret sebebi.',
    patch: { purposeClear: true, useOurTemplate: true },
    priority: 'critical',
    category: 'application',
    showIf: p => !p.purposeClear || !p.useOurTemplate,
  },

  // ── YÜKSEK ──────────────────────────────────────────────────────────────
  {
    id: 'employer_letter',
    label: 'İşveren mektubu + geri dönüş onayı al',
    detail: 'Şirket antetli, imzalı. İşveren adı, pozisyon, izin tarihleri içermeli.',
    patch: { sgkEmployerLetterWithReturn: true },
    priority: 'high',
    category: 'professional',
    showIf: p => p.hasSgkJob && !p.sgkEmployerLetterWithReturn,
  },
  {
    id: 'hotel',
    label: 'Otel rezervasyonu yap (iptal edilebilir)',
    detail: 'Booking.com üzerinden ücretsiz iptal seçenekli rezervasyon yeterli.',
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
    detail: 'flyrez.com veya benzer bir servisle ücret ödemeden rezervasyon yapılabilir.',
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
    detail: 'Gidiş tarihi + vize süresi + 3 ay tampon gerekli. Gerekirse yenile.',
    patch: { passportValidityLong: true, passportConditionGood: true },
    priority: 'high',
    category: 'trust',
    showIf: p => !p.passportValidityLong,
  },

  // ── ORTA ────────────────────────────────────────────────────────────────
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
    detail: 'Schengen standart: seyahat günü × €100 minimum. Hesap ekstresinde görünmeli.',
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

  // ── ÜLKE ÖZEL ─────────────────────────────────────────────────────────
  {
    id: 'uk_28day',
    label: 'UK: Parayı 28 gün önceden hesaba yatır',
    detail: 'İngiltere vize ofisi son 28 günlük ekstre ister. Son dakika yatırımı reddeder.',
    patch: { has28DayHolding: true },
    priority: 'critical',
    category: 'country',
    showIf: p => p.targetCountry === 'İngiltere' && !p.has28DayHolding,
  },
  {
    id: 'uk_6month',
    label: 'UK: 6 aylık banka dökümü hazırla',
    detail: 'İngiltere standart gereksinimi — Schengen\'in aksine 6 ay zorunlu.',
    patch: { has6MonthStatements: true, statementMonths: 6 },
    priority: 'high',
    category: 'country',
    showIf: p => p.targetCountry === 'İngiltere' && !p.has6MonthStatements,
  },
  {
    id: 'usa_interview',
    label: 'ABD: B1/B2 mülakat soruları çalış',
    detail: '214(b) testi için hazırlan. Geri dönüş bağlarını somut cevaplarla destekle.',
    patch: { interviewPrepared: true, interviewConfidence: 'high' },
    priority: 'critical',
    category: 'country',
    showIf: p => p.targetCountry === 'ABD' && !p.interviewPrepared,
  },
];

const PRIORITY_ORDER: Priority[] = ['critical', 'high', 'medium'];
const PRIORITY_LABEL: Record<Priority, string> = {
  critical: 'Kritik',
  high: 'Önemli',
  medium: 'Orta',
};
const PRIORITY_COLOR: Record<Priority, string> = {
  critical: 'bg-rose-100 text-rose-700 border-rose-200',
  high:     'bg-amber-100 text-amber-700 border-amber-200',
  medium:   'bg-slate-100 text-slate-600 border-slate-200',
};

interface Props {
  profile: ProfileData;
  currentScore: number;
  onProfileUpdate: (patch: Partial<ProfileData>) => void;
}

export function EvidenceChecklist({ profile, currentScore, onProfileUpdate }: Props) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState(true);

  // Profildeki eksiklere göre filtrele
  const visible = useMemo(
    () => ALL_ITEMS.filter(item => item.showIf(profile)),
    [profile],
  );

  const total     = visible.length;
  const doneCount = checked.size;
  const progress  = total === 0 ? 100 : Math.round((doneCount / total) * 100);

  // Birleşik patch (işaretlenen tüm maddeler)
  const combinedPatch = useMemo(() => {
    const merged: Partial<ProfileData> = {};
    visible.forEach(item => {
      if (checked.has(item.id)) Object.assign(merged, item.patch);
    });
    return merged;
  }, [checked, visible]);

  const projectedScore = useMemo(
    () => Object.keys(combinedPatch).length > 0
      ? calculateScore({ ...profile, ...combinedPatch })
      : currentScore,
    [combinedPatch, profile, currentScore],
  );

  const totalGain = projectedScore - currentScore;

  const handleToggle = (item: ChecklistItem) => {
    const next = new Set(checked);
    if (next.has(item.id)) {
      next.delete(item.id);
    } else {
      next.add(item.id);
      // Profili gerçekten güncelle
      onProfileUpdate(item.patch);
    }
    setChecked(next);
  };

  if (visible.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-3 text-sm text-emerald-700">
        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
        <span className="font-bold">Tüm kanıt kontrol maddelerini tamamladınız!</span>
      </div>
    );
  }

  // Öncelik gruplarına ayır
  const grouped = PRIORITY_ORDER
    .map(priority => ({
      priority,
      items: visible.filter(i => i.priority === priority),
    }))
    .filter(g => g.items.length > 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {/* Başlık */}
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
            <div className="font-black text-slate-900 text-sm">Kanıt Kontrol Listesi</div>
            <div className="text-xs text-slate-400">
              {doneCount}/{total} madde tamamlandı
              {totalGain > 0 && ` — +${totalGain} puan kazanıldı`}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Progress yüzdesi */}
          <span className={`text-xs font-black px-2.5 py-1 rounded-full ${
            progress === 100 ? 'bg-emerald-100 text-emerald-700'
            : progress >= 50 ? 'bg-amber-100 text-amber-700'
            : 'bg-rose-100 text-rose-700'
          }`}>
            %{progress}
          </span>
          {expanded
            ? <ChevronUp className="w-4 h-4 text-slate-400" />
            : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </button>

      {expanded && (
        <div className="p-5 space-y-5">
          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  progress === 100 ? 'bg-emerald-500'
                  : progress >= 50 ? 'bg-amber-400'
                  : 'bg-rose-400'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
            {totalGain > 0 && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Mevcut: %{currentScore}</span>
                <span className="font-black text-emerald-600">Tahmini: %{projectedScore} (+{totalGain})</span>
              </div>
            )}
          </div>

          {/* Gruplar */}
          {grouped.map(({ priority, items }) => (
            <div key={priority}>
              <div className={`inline-flex items-center gap-1.5 text-[10px] font-black px-2 py-0.5 rounded-full border mb-2 ${PRIORITY_COLOR[priority]}`}>
                {priority === 'critical' && '⚠ '}
                {PRIORITY_LABEL[priority]}
              </div>

              <div className="space-y-2">
                {items.map(item => {
                  const isChecked = checked.has(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                        isChecked
                          ? 'border-emerald-200 bg-emerald-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {/* Checkbox */}
                      <button
                        type="button"
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
                          <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                            {item.detail}
                          </div>
                        )}
                        {!isChecked && item.link && (
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
                      </div>

                      {/* Yaptım butonu */}
                      {!isChecked && (
                        <button
                          type="button"
                          onClick={() => handleToggle(item)}
                          className="shrink-0 px-3 py-1.5 text-xs font-black bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-200 rounded-lg transition-colors whitespace-nowrap"
                        >
                          Yaptım ✓
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <p className="text-[10px] text-slate-400 text-center">
            "Yaptım" işaretlediğinizde profiliniz güncellenir ve skor anında yeniden hesaplanır.
          </p>
        </div>
      )}
    </div>
  );
}
