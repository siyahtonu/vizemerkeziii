// ============================================================
// VisaTimeline — #9 "Ne Zaman Ne Yapmalıyım?" Zaman Çizelgesi
// Kullanıcı başvuru tarihini girer, geriye doğru plan hesaplanır.
// Her görevin tamamlanma durumu localStorage'da tutulur.
// ============================================================

import React, { useState, useMemo, useCallback } from 'react';
import type { ProfileData } from '../types';

const STORAGE_KEY = 'vize_timeline_checks';

interface TimelineTask {
  id:      string;
  weeksBefore: number;  // başvurudan kaç hafta önce
  label:   string;
  desc:    string;
  icon:    string;
  cond?:   (p: ProfileData) => boolean;  // koşul: sadece bu profil için
}

const BASE_TASKS: TimelineTask[] = [
  {
    id: 'profile_eval',
    weeksBefore: 8,
    label: 'Profil Değerlendirmesi',
    desc: 'VizeAkıl ile ücretsiz analiz yap — hangi belgeler eksik, skor kaç?',
    icon: '🔍',
  },
  {
    id: 'bank_docs',
    weeksBefore: 7,
    label: 'Banka Belgelerini Topla',
    desc: '6 aylık hesap hareketleri, maaş dekontu veya kira geliri belgesi.',
    icon: '🏦',
    cond: (p) => !p.bankSufficientBalance || !p.bankRegularity,
  },
  {
    id: 'sgk_doc',
    weeksBefore: 7,
    label: 'SGK & İşveren Belgesi Al',
    desc: 'E-Devlet barkodlu SGK dökümü + dönüş taahhütlü işveren mektubu.',
    icon: '💼',
    // Öğrenci/sponsor/55+ emekli profilleri SGK/işveren belgesi beklemez.
    cond: (p) => !p.hasSgkJob && !p.isStudent && !p.hasSponsor && p.applicantAge < 55,
  },
  {
    id: 'balance_target',
    weeksBefore: 6,
    label: 'Banka Bakiyesini Düzenle',
    desc: '€30/gün × seyahat süresi minimumu. Düzenli giriş-çıkış örüntüsü oluştur.',
    icon: '💰',
    cond: (p) => !p.bankSufficientBalance,
  },
  {
    id: 'insurance',
    weeksBefore: 5,
    label: 'Seyahat Sigortası Yaptır',
    desc: '€30.000 teminatlı Schengen/UK sigortası — başvurudan en az 2 gün önce.',
    icon: '🛡️',
    cond: (p) => !p.hasTravelInsurance,
  },
  {
    id: 'hotel_flight',
    weeksBefore: 5,
    label: 'Otel & Uçak Rezervasyonu',
    desc: 'İptal edilebilir rezervasyonlar yeterli. Tarihler SGK ve pasaportla uyuşmalı.',
    icon: '✈️',
  },
  {
    id: 'cover_letter',
    weeksBefore: 4,
    label: 'Niyet Mektubu Hazırla',
    desc: '2026 konsolosluk standartlarına uygun profesyonel niyet mektubu.',
    icon: '📝',
    cond: (p) => !p.useOurTemplate,
  },
  {
    id: 'document_pack',
    weeksBefore: 3,
    label: 'Belge Paketini Tamamla',
    desc: 'Tüm belgeler eksiksiz toplandı mı? Tutarlılık taraması yap.',
    icon: '📁',
  },
  {
    id: 'appointment',
    weeksBefore: 3,
    label: 'Randevu Al',
    desc: 'VFS Global veya konsolosluk portali üzerinden randevu oluştur.',
    icon: '📅',
  },
  {
    id: 'final_check',
    weeksBefore: 1,
    label: 'Son Kontrol',
    desc: 'Pasaport, biyometrik fotoğraf, tüm belgeler hazır mı? Kırmızı bayrak taraması yap.',
    icon: '✅',
  },
  {
    id: 'apply',
    weeksBefore: 0,
    label: 'Başvuru Günü',
    desc: 'Tüm orijinaller ve fotokopiler yanında. Randevu saatinden 15 dk önce hazır ol.',
    icon: '🎯',
  },
];

function addWeeks(date: Date, weeks: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + weeks * 7);
  return d;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });
}

function isOverdue(taskDate: Date): boolean {
  return taskDate < new Date();
}

interface Props {
  profile: ProfileData;
}

export function VisaTimeline({ profile }: Props) {
  const [applyDate,  setApplyDate]  = useState('');
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch { return {}; }
  });

  const toggleCheck = useCallback((id: string) => {
    setChecked(prev => {
      const next = { ...prev, [id]: !prev[id] };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const tasks = useMemo(() => {
    return BASE_TASKS.filter(t => !t.cond || t.cond(profile));
  }, [profile]);

  const dated = useMemo(() => {
    if (!applyDate) return null;
    const apply = new Date(applyDate);
    if (isNaN(apply.getTime())) return null;
    return tasks.map(t => ({
      ...t,
      date: addWeeks(apply, -t.weeksBefore),
    }));
  }, [applyDate, tasks]);

  const completedCount = tasks.filter(t => checked[t.id]).length;
  const pct = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
        <span className="text-base">📅</span>
        <span className="font-semibold text-slate-800 text-sm">Başvuru Zaman Çizelgesi</span>
        {pct > 0 && (
          <span className="ml-auto text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
            %{pct} tamamlandı
          </span>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Date picker */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Planlanan Başvuru Tarihiniz
          </label>
          <input
            type="date"
            value={applyDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={e => setApplyDate(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-brand-400 focus:bg-white transition-all"
          />
          {!applyDate && (
            <p className="text-[11px] text-slate-400 mt-1.5">
              Tarihi seçin — her görevin ideal başlangıç tarihi otomatik hesaplanır.
            </p>
          )}
        </div>

        {/* Progress bar */}
        {pct > 0 && (
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        )}

        {/* Task list */}
        <div className="space-y-2">
          {tasks.map((task, i) => {
            const taskDate  = dated ? dated.find(d => d.id === task.id)?.date : null;
            const done      = !!checked[task.id];
            const overdue   = !!taskDate && isOverdue(taskDate) && !done;
            const isApplyDay = task.weeksBefore === 0;

            return (
              <div
                key={task.id}
                className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                  done      ? 'bg-emerald-50 border-emerald-100' :
                  overdue   ? 'bg-rose-50 border-rose-100'       :
                  isApplyDay? 'bg-brand-50 border-brand-200'      :
                              'bg-white border-slate-100 hover:border-slate-200'
                }`}
              >
                {/* Timeline line */}
                <div className="flex flex-col items-center shrink-0 w-8">
                  <button
                    type="button"
                    onClick={() => toggleCheck(task.id)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                      done ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-200 hover:border-brand-400'
                    }`}
                  >
                    {done ? '✓' : task.icon}
                  </button>
                  {i < tasks.length - 1 && (
                    <div className={`w-px flex-1 min-h-4 mt-1 ${done ? 'bg-emerald-200' : 'bg-slate-100'}`} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-xs font-bold leading-tight ${
                      done ? 'text-emerald-700 line-through' :
                      overdue ? 'text-rose-700' :
                      isApplyDay ? 'text-brand-700' : 'text-slate-800'
                    }`}>
                      {task.label}
                    </span>
                    {taskDate && (
                      <span className={`text-[10px] font-semibold shrink-0 ${
                        overdue ? 'text-rose-500' : 'text-slate-400'
                      }`}>
                        {overdue && '⚠️ '}
                        {formatDate(taskDate)}
                      </span>
                    )}
                    {!taskDate && task.weeksBefore > 0 && (
                      <span className="text-[10px] text-slate-300 shrink-0">
                        -{task.weeksBefore} hafta
                      </span>
                    )}
                  </div>
                  {!done && (
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                      {task.desc}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <p className="text-[9px] text-slate-300 text-center">
          Tamamlanan görevler tarayıcınızda saklanır.
        </p>
      </div>
    </div>
  );
}
