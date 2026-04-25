// ============================================================
// TacticsStep — Kabul Oranı Taktikleri
// Kaynak: R-2077 ampirik analizi + core.ts puanlama + blog yazıları
// Her taktik, algoritmadaki gerçek ağırlıkla eşleştirilmiştir.
// ============================================================
import { useState } from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2, ShieldCheck, ArrowLeft, Info, Briefcase, Globe, Wallet, PenTool,
  Home, Calendar, Plane, FileText, AlertTriangle, MessageSquare, Sparkles, RefreshCw, Zap,
} from 'lucide-react';
import type { ProfileData } from '../types';
import { askPersonalTactics, type PersonalTactic } from '../lib/ai';
import { getCascadeStatus } from '../scoring/core';

interface Props {
  onNavigate: (step: string) => void;
  profile: ProfileData;
}

interface Tactic {
  icon: typeof Wallet;
  title: string;
  desc: string;
  impact: string;   // Skoraya katkısı (R-2077 ağırlığı veya core.ts puanı)
  source: string;   // Veri kaynağı (hangi algoritma/veri)
  color: 'blue' | 'green' | 'violet' | 'indigo' | 'emerald' | 'amber' | 'slate' | 'rose' | 'cyan' | 'orange';
}

const TACTICS: Tactic[] = [
  {
    icon: Wallet,
    title: '1. Son-Dakika Para Yatırma Tuzağı',
    desc: '2.077 vakalık analizde #1 ret sebebi: başvurudan kısa süre önce hesabına büyük miktar yatırmak. Para 28 gün boyunca hesapta beklemeli. UK için bu kural zorunlu; Schengen için güçlü sinyal. Hesabına maaşınızı yansıtmayan ani girişler (>₺50 000) otomatik şüpheli işaretlenir.',
    impact: 'Skor tavanı: 30 (veto). Bu tek başına başvuruyu yakabilir.',
    source: 'core.ts Bölüm 8 — hasSuspiciousLargeDeposit veto cap',
    color: 'rose',
  },
  {
    icon: Calendar,
    title: '2. 6 Aylık Banka Dökümü + Düzenli Hareketlilik',
    desc: 'Son 6 ayın dökümünde her ay maaş girişi, market-kira-fatura çıkışı görünmeli. "Ölü hesap" (hiç hareket yok) ret sebebi; çünkü ya sahte ya da hesabın kullanılmadığını gösterir. UK için 6 ay şart, Schengen için en az 3 ay — 6 ay önerilir.',
    impact: '+8 puan (6 ay) · +2 puan (3 ay) · −8 puan (ölü hesap)',
    source: 'R-2077 Faktör #6 (%8 ağırlık) · core.ts Bölüm 1',
    color: 'blue',
  },
  {
    icon: Briefcase,
    title: '3. Barkodlu SGK + İşveren Mektubu (Dönüş Tarihli)',
    desc: 'İşveren mektubunda "çalışan, şu tarihte işine dönecektir" ifadesi açık yer almalı. Barkodlu SGK hizmet dökümü E-Devlet\'ten alınır — tahrifat imkansızdır. Çalışan profilleri için bu ikili en güçlü geri dönüş kanıtıdır.',
    impact: '+12 (SGK) + 5 (dönüş tarihli mektup) + 2 (barkod) = +19 puan',
    source: 'core.ts Bölüm 3 · R-2077 Faktör #1 (%25 ağırlık)',
    color: 'green',
  },
  {
    icon: Home,
    title: '4. Çok Katmanlı Bağ Stratejisi (4+ kategori)',
    desc: 'Algoritma tek bir güçlü bağ değil, KAÇ FARKLI alanda bağınızın olduğunu ödüllendirir: iş, mülk, aile, sosyal topluluk, eğitim. 4 veya daha fazla kategoride bağ = ekstra +6 puan bonus. Ev hanımı/emekli/sponsor profilleri bu çok-katmanlı bağ stratejisiyle SGK boşluğunu telafi edebilir.',
    impact: '+20 ham puan (5 kat × 5-3 pts) + 6 bonus',
    source: 'core.ts Bölüm 4 · dimensions.ts tieCategories',
    color: 'emerald',
  },
  {
    icon: PenTool,
    title: '5. Amacı Netleştiren Niyet Mektubu',
    desc: 'Türk başvurucular için Code 2 (seyahat amacı belirsiz) #2 ret sebebi. Mektup 1 sayfa, 5 soruya net cevap verir: (a) ne iş yapıyorum, (b) ne kadar kazanıyorum, (c) niye bu ülkeye gidiyorum, (d) masrafı nasıl karşılıyorum, (e) ne zaman ve nasıl döneceğim. Rastgele turist mektubu yerine konsolosluk formatını kullanın.',
    impact: '+6 puan (purposeClear) + 5 (şablon) = +11 puan',
    source: 'core.ts Bölüm 6 · R-2077 Faktör #5 (%10)',
    color: 'violet',
  },
  {
    icon: Plane,
    title: '6. Seyahat Geçmişini Akıllıca İnşa Et',
    desc: 'Boş pasaport = ret riski yüksek. Güçlü damga stratejisi: Japonya, Singapur, Güney Kore gibi vizesiz ama seçici ülkeler +2 puan; Sırbistan, Gürcistan gibi kolay ülkeler +1 puan bonus verir. UK/ABD/Schengen vizesi varsa Temporal Decay kuralı: vize ne kadar yeni o kadar değerli (5 yıl sonra ağırlığı %37\'ye düşer).',
    impact: '+20 × decay (high-value) · +1/+2 vizesiz bonus',
    source: 'core.ts Bölüm 5 (temporalDecay) · visa-free v3.5',
    color: 'cyan',
  },
  {
    icon: CheckCircle2,
    title: '7. Adres & Tarih Cross-Check',
    desc: 'Konsolosluk otomatik tutarlılık denetimi yapar: DS-160\'taki ev/iş adresin SGK dökümündeki adresle aynı olmalı. Otel, uçak bileti ve dilekçedeki tarihler 1 gün bile şaşmamalı. Tarih tutarsızlığı, profesyonel değil aceleyle hazırlanmış başvuru sinyalidir.',
    impact: '+2 (addressMatchSgk) +2 (datesMatch) +3 (documentConsistency)',
    source: 'dimensions.ts application + trust skorları',
    color: 'indigo',
  },
  {
    icon: AlertTriangle,
    title: '8. Sahte Rezervasyon = Yasak Listesi',
    desc: 'Ücretsiz "refundable" rezervasyon siteleri konsolosluklarca sistemli olarak tespit edilir (Booking, Expedia veri paylaşımı). Sahte rezervasyon veto kategorisinde — tespit edilirse sadece red değil, 5-10 yıl yasak gelebilir. Ödenmiş (non-refundable) veya iptal garantili kurumsal rezervasyon kullanın.',
    impact: '−15 puan + veto işareti',
    source: 'core.ts Bölüm 6 · R-2077 Faktör #4 (%10)',
    color: 'orange',
  },
  {
    icon: ShieldCheck,
    title: '9. Sigorta: €30 000 Asgari Teminat',
    desc: 'Schengen vize kodu zorunlu: minimum €30 000 teminatlı seyahat sigortası, tüm Schengen bölgesini kapsamalı, kaza-hastalık-sağlık-iade-geri dönüş dahil. Uygun olmayan sigorta, R-2077\'de %15 ret sebebi. ABD ve İngiltere için zorunlu değil ama tavsiye edilir.',
    impact: '+7 puan (var) · −5 puan (Schengen, yok)',
    source: 'core.ts Bölüm 7 · R-2077 Faktör #10',
    color: 'emerald',
  },
  {
    icon: MessageSquare,
    title: '10. ABD Mülakatı: Kısa, Net, Tereddütsüz',
    desc: 'Ortalama mülakat süresi 90 saniye — her cümle önemli. Altın kural: "Kalacak mısın?" sorusuna "Hayır, [tarih] tarihinde işime dönmeliyim, [ebeveyn/eş/iş] Türkiye\'de beni bekliyor" diyerek 3 katmanlı bağ gösterin. Heyecan, uzun cevap, göz kaçırma = red sinyali. Hazırlıklı + yüksek özgüven profili +7 puan.',
    impact: '+4 (prep) +3 (high confidence) · −2 (low confidence)',
    source: 'core.ts Bölüm 6 — ABD özel kural',
    color: 'amber',
  },
  {
    icon: FileText,
    title: '11. Önceki Ret Varsa: Beyan Et, Gizleme',
    desc: 'Pasaportunda ret damgası olan başvurular için 2 kural: (1) önceki reddi mutlaka beyan et — gizleme 10 yıla kadar yasak sebebidir (visa fraud), (2) ret sebebini yeni başvuruda nasıl kapattığını belge ile göster. Beyan edilmiş ret, zamanla ağırlığı %35 exponential decay ile azalır.',
    impact: 'Beyan: −5 × decay (hafif) · Gizleme: −20 × decay + veto',
    source: 'core.ts refusalDecay · R-2077 Faktör #7',
    color: 'slate',
  },
  {
    icon: Globe,
    title: '12. Ülke Seçimi: Profilinize Uyanı Seç',
    desc: 'Aynı profil Almanya\'da ret, İspanya\'da onay alabilir. Ülke farkı doğrudan tarihsel ret oranlarına yansır: Yunanistan %6, Portekiz %9, Almanya %23, Danimarka %66. Profil-segment çarpanı (emekli/kamu 1.07, öğrenci/sponsor 0.92-0.97, işsiz 0.87) bağımsız bir eksen; ikisini çarparak karar verin.',
    impact: 'Ülke ret oranı: %6 — %66 · Segment çarpanı: ×0.87 — ×1.07',
    source: 'matrices.ts TR_REJECTION_RATES · SEGMENT_FACTORS · COUNTRY_DB',
    color: 'blue',
  },
  {
    icon: Info,
    title: '13. Zamanlama: Yoğun Sezonu Kaçır',
    desc: 'Konsolosluklar yaz aylarında (Mayıs-Ağustos) iş yükü artınca derinlemesine inceleme yerine yüzeysel kararlar verir — bu güçlü profiller için dezavantaj. Eylül-Kasım ve Şubat-Nisan pencereleri "derin inceleme" modunda geçer; hazırlıklı profiller bu aylarda +5-8% avantaj elde eder. Zamanlama Analizi aracı aylık pencere skorunu gösterir.',
    impact: 'Mevsimsellik çarpanı: ×0.97 — ×1.03 (final skorun ~%3\'ü)',
    source: 'scoring/seasonal.ts · getSeasonalMultiplier',
    color: 'cyan',
  },
];

const colorClasses: Record<Tactic['color'], { bg: string; text: string; ring: string }> = {
  blue:    { bg: 'bg-blue-50',    text: 'text-blue-600',    ring: 'ring-blue-100' },
  green:   { bg: 'bg-green-50',   text: 'text-green-600',   ring: 'ring-green-100' },
  violet:  { bg: 'bg-violet-50',  text: 'text-violet-600',  ring: 'ring-violet-100' },
  indigo:  { bg: 'bg-indigo-50',  text: 'text-indigo-600',  ring: 'ring-indigo-100' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-100' },
  amber:   { bg: 'bg-amber-50',   text: 'text-amber-600',   ring: 'ring-amber-100' },
  slate:   { bg: 'bg-slate-50',   text: 'text-slate-600',   ring: 'ring-slate-100' },
  rose:    { bg: 'bg-rose-50',    text: 'text-rose-600',    ring: 'ring-rose-100' },
  cyan:    { bg: 'bg-cyan-50',    text: 'text-cyan-600',    ring: 'ring-cyan-100' },
  orange:  { bg: 'bg-orange-50',  text: 'text-orange-600',  ring: 'ring-orange-100' },
};

export function TacticsStep({ onNavigate, profile }: Props) {
  const setStep = onNavigate;

  const [aiTactics, setAiTactics] = useState<PersonalTactic[] | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const runAiTactics = async () => {
    setAiLoading(true);
    setAiError(null);
    try {
      setAiTactics(await askPersonalTactics(profile));
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'AI yanıt vermedi.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <motion.div
      key="tactics"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-10"
    >
      <div className="flex items-center gap-6">
        <button
          onClick={() => setStep('dashboard')}
          className="p-3 bg-white border border-slate-100 hover:bg-slate-50 rounded-2xl transition-all shadow-sm"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-4xl font-bold text-slate-900">Kabul Oranı Taktikleri</h2>
          <p className="text-slate-500 text-lg">
            2.077 vakalık ampirik analiz + algoritma ağırlıklarıyla kanıtlanmış 13 taktik.
          </p>
        </div>
      </div>

      {/* Ampirik Kaynak Bandı */}
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-6">
        <p className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-2">
          Veri Temeli
        </p>
        <p className="text-sm text-slate-700 leading-relaxed">
          Aşağıdaki taktikler, site algoritmasının (core.ts) kaynak kodundaki ağırlıklarla birebir
          eşleştirilmiştir. Her taktik için <strong>gerçek puan etkisi</strong> ve
          <strong> veri kaynağı</strong> gösterilir — gönül rahatlığıyla uygulayın.
        </p>
      </div>

      {/* Cascade MEV stratejisi — sadece eligible profillerde (v3.9) */}
      {(() => {
        const cs = getCascadeStatus(profile);
        if (!cs.eligible) return null;
        const tierLabel =
          cs.tier === 4 ? '5 yıllık çok girişli' :
          cs.tier === 3 ? '3 yıllık çok girişli' :
          cs.tier === 2 ? '1 yıllık çok girişli' :
                          '6 aylık çok girişli';
        return (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6">
            <p className="text-xs uppercase tracking-wider font-semibold text-emerald-700 mb-2 flex items-center gap-1.5">
              <span>🪜</span> Cascade Stratejisi
            </p>
            <h3 className="text-lg font-bold text-emerald-900 mb-2">
              Bir sonraki hedef: {tierLabel} Schengen vizesi
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              Önceki Schengen vizelerinizi kurallara uygun kullandığınız için C(2025) 4694
              cascade kuralı kapsamındasınız. Bu başvuruda konsolosluk bir sonraki kademedeki
              çok girişli vizeyi vermekle <strong>yükümlüdür</strong> — tek giriş vize verirse
              itiraz hakkınız doğar. Dilekçenizde "cascade hakkım çerçevesinde {tierLabel} vize
              talep ediyorum" ifadesini açıkça belirtin.
            </p>
            <a
              href="/blog/cascade-kurali-schengen-vizesi"
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline mt-3"
            >
              Cascade rehberini oku → /blog/cascade-kurali
            </a>
          </div>
        );
      })()}

      {/* Kişiye Özel Taktikler (AI) */}
      <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/60 to-white p-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold text-indigo-600 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Size Özel
            </p>
            <h3 className="text-lg font-bold text-slate-900">Profilinize göre en etkili 5 taktik</h3>
            <p className="text-sm text-slate-600 mt-1">
              13 genel taktiğin üstüne, yapay zekâ profilinizdeki zayıflık ve güçleri analiz ederek
              kişiselleştirilmiş 5 madde çıkarır.
            </p>
          </div>
          {!aiTactics && (
            <button
              type="button"
              onClick={runAiTactics}
              disabled={aiLoading}
              className="shrink-0 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-sm font-bold flex items-center gap-2"
            >
              {aiLoading ? (
                <><RefreshCw className="w-4 h-4 animate-spin" /> Üretiliyor…</>
              ) : (
                <><Zap className="w-4 h-4" /> Üret</>
              )}
            </button>
          )}
        </div>

        {aiError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
            {aiError}
          </div>
        )}

        {aiTactics && (
          <div className="space-y-3">
            {aiTactics.map((t, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl border ${t.urgent ? 'bg-rose-50/60 border-rose-200' : 'bg-white border-slate-200'}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${t.urgent ? 'bg-rose-600 text-white' : 'bg-indigo-600 text-white'}`}>
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="font-bold text-slate-900 text-sm">{t.title}</h4>
                      {t.urgent && (
                        <span className="text-[9px] font-bold bg-rose-600 text-white px-1.5 py-0.5 rounded uppercase tracking-wider">
                          Acil
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">{t.detail}</p>
                    <p className="text-xs font-semibold text-indigo-600 mt-2">Etki: {t.impact}</p>
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={runAiTactics}
              disabled={aiLoading}
              className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Yeniden üret
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {TACTICS.map((tactic, i) => {
          const cls = colorClasses[tactic.color];
          return (
            <motion.div
              key={`tactic-${i}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group p-6 md:p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-500/5 transition-all flex gap-6 items-start"
            >
              <div
                className={`w-14 h-14 md:w-16 md:h-16 ${cls.bg} rounded-2xl flex items-center justify-center ${cls.text} shrink-0 group-hover:scale-110 transition-transform ring-4 ${cls.ring}`}
              >
                <tactic.icon className="w-7 h-7 md:w-8 md:h-8" />
              </div>
              <div className="space-y-3 min-w-0">
                <h3 className="font-bold text-lg md:text-xl text-slate-900">{tactic.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                  {tactic.desc}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                      Skor Etkisi
                    </span>
                    <span className={`text-xs font-semibold ${cls.text}`}>{tactic.impact}</span>
                  </div>
                  <span className="hidden sm:inline text-slate-200">·</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                      Kaynak
                    </span>
                    <span className="text-xs font-mono text-slate-500">{tactic.source}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="p-10 bg-gradient-to-br from-amber-600 to-orange-600 rounded-[2.5rem] text-white flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl shadow-amber-900/20">
        <div className="space-y-2 text-center lg:text-left">
          <h4 className="text-2xl font-bold">13 taktiğin kaçı profilinizde aktif?</h4>
          <p className="text-amber-100 text-lg">
            Dashboard&apos;da ret risk analizi ve belge kontrol listesi ile tek tek doğrulayın.
          </p>
        </div>
        <button
          onClick={() => setStep('dashboard')}
          className="w-full lg:w-auto px-12 py-5 bg-white text-amber-600 rounded-2xl font-bold text-xl hover:bg-amber-50 transition-all shadow-xl"
        >
          Dashboard&apos;a Dön
        </button>
      </div>
    </motion.div>
  );
}
