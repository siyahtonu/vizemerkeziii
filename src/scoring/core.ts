// ============================================================
// Çekirdek Puanlama Fonksiyonları
// App.tsx'ten modüler yapıya taşındı — ALGORİTMA v3.0
// ============================================================

import type { ProfileData } from '../types';
import { TR_REJECTION_RATES, SCHENGEN_COUNTRIES } from './matrices';
import { temporalDecay, DECAY_LAMBDA, EVENT_YEAR, isEventYearNone, getReturnTieMultiplier, getProfileSegmentFactor, getConsulateAdjustment, resolveSegment } from './algorithms';
import { getSeasonalMultiplier } from './seasonal';
import { getVisaFreeBonus } from '../data/countries';

// ── Cascade Kuralı Yardımcıları (v3.9) ──────────────────────────────────
// 15 Temmuz 2025'te yürürlüğe giren AB C(2025) 4694 düzenlemesi:
// "Son 3 yılda kurallara uygun kullanılmış Schengen vizesi" varsa konsolosluk
// bir sonraki başvuruda kademeli daha uzun MEV vermek ZORUNDA. Skorlama
// bunu bona fide traveller sinyali olarak yansıtır.

export interface CascadeStatus {
  /** Cascade haklarından faydalanabilir mi? */
  eligible: boolean;
  /** Tahmini kademe: 0 = yok, 1 = 6 ay MEV, 2 = 1 yıl MEV, 3 = 3 yıl MEV, 4 = 5 yıl MEV */
  tier: 0 | 1 | 2 | 3 | 4;
  /** Neden eligible değil (eligible=false ise dolu) */
  disqualifier?: 'non_schengen' | 'no_history' | 'overstay' | 'refusal' | 'pending';
  /** Skor bonusu (ham puan) */
  bonus: number;
  /** İnsan okur açıklama */
  label: string;
}

/** Hedef ülke Schengen üyesi mi? */
export const isSchengenTarget = (country: string): boolean =>
  SCHENGEN_COUNTRIES.has(country);

/**
 * Cascade kuralı uygunluk kontrolü ve kademe tahmini.
 * Saf-fonksiyon: herhangi bir mutasyon yapmaz, rapor objesi döner.
 */
export const getCascadeStatus = (data: ProfileData): CascadeStatus => {
  const count = data.schengenVisasLast3Years ?? 0;

  if (!isSchengenTarget(data.targetCountry)) {
    return { eligible: false, tier: 0, disqualifier: 'non_schengen', bonus: 0,
             label: 'Cascade yalnız Schengen ülkeleri içindir' };
  }
  if (count <= 0) {
    return { eligible: false, tier: 0, disqualifier: 'no_history', bonus: 0,
             label: 'Son 3 yılda kullanılmış Schengen vizesi yok' };
  }
  // Overstay cascade haklarını sıfırlar (C(2025) 4694 temel şart).
  if (!data.noOverstayHistory) {
    return { eligible: false, tier: 0, disqualifier: 'overstay', bonus: 0,
             label: 'Overstay geçmişi cascade haklarını iptal eder' };
  }
  // Beyan edilmemiş ret cascade güven zincirini kırar.
  if (data.hasPreviousRefusal && !data.previousRefusalDisclosed) {
    return { eligible: false, tier: 0, disqualifier: 'refusal', bonus: 0,
             label: 'Gizlenmiş ret geçmişi cascade uygunluğunu bozar' };
  }

  // Tier & bonus haritası — konservatif; ampirik vaka sayısı az olduğu
  // için band dar tutulur (max +10 ham puan).
  let tier: CascadeStatus['tier'];
  let bonus: number;
  let label: string;
  if (count >= 3) {
    tier = 4; bonus = 10; label = '5 yıl MEV adayı — en yüksek kademe';
  } else if (count === 2) {
    tier = 3; bonus = 7;  label = '3 yıl MEV adayı — güçlü cascade profili';
  } else {
    tier = 2; bonus = 4;  label = '1 yıl MEV adayı — cascade başlangıç kademesi';
  }

  // Beyan edilmiş ret bonusu yarıya indirir (temiz zincir bozulmuş ama şeffaf).
  if (data.hasPreviousRefusal && data.previousRefusalDisclosed) {
    bonus = Math.round(bonus / 2);
    label = `${label} (beyan edilmiş ret nedeniyle bonus azaltıldı)`;
  }

  return { eligible: true, tier, bonus, label };
};

// ============================================================
// Askerlik Durumu Sinyali (v3.10)
// ============================================================
// Saf fonksiyon: sinyal uygulanabilir mi kontrol eder, değilse 0 döner.
// Yaş aralığı 20-41: askere alma çağı (21-41 yasal aralık; 20 son okul
// mezuniyeti için buffer).
export const getMilitaryStatusSignal = (data: ProfileData): number => {
  if (data.applicantGender !== 'male') return 0;
  if (data.applicantAge < 20 || data.applicantAge > 41) return 0;
  if (data.targetCountry !== 'ABD' && data.targetCountry !== 'İngiltere') return 0;

  switch (data.militaryStatus) {
    case 'completed': return +2;
    case 'exempt':    return +2;
    case 'active':    return +2;
    case 'deferred':  return -3;
    default:          return 0; // 'n_a' veya tanımsız
  }
};

// ============================================================
// calculateRawScore: ülke kalibrasyonu öncesi ham skor (0-100)
// ============================================================
export const calculateRawScore = (data: ProfileData, simValue: number = 0): number => {
  let score = 10; // Temel başlangıç puanı

  // ─────────────────────────────────────────────────────────
  // BÖLÜM 1: FİNANSAL GÜÇ (Maks 28 puan)
  // ─────────────────────────────────────────────────────────

  if (data.bankSufficientBalance || simValue > 150000) score += 7;
  else if (simValue > 75000) score += 3;

  if (data.highSavingsAmount || simValue > 350000) score += 5;
  if (data.bankRegularity) score += 5;
  if (data.incomeSourceClear) score += 4;
  if (data.salaryDetected) score += 3;
  if (data.hasAssets) score += 3;
  if (data.hasRegularSpending && data.recurringExpensesDetected) score += 3;
  if (data.dailyBudgetSufficient) score += 4;

  // Finansal cezalar
  if (!data.hasRegularSpending) score -= 8;        // "Ölü hesap" — emanet şüphesi
  if (data.unusualLargeTransactions) score -= 5;   // Açıklanamayan hareketler
  if (data.monthlyInflow < data.monthlyOutflow && data.monthlyInflow > 0) score -= 6;

  // ─────────────────────────────────────────────────────────
  // BÖLÜM 2: İNGİLTERE ÖZEL KURALLAR
  // ─────────────────────────────────────────────────────────
  if (data.targetCountry === 'İngiltere') {
    if (data.has28DayHolding) score += 8;
    else score -= 12;

    if (data.has6MonthStatements) score += 6;
    else if (data.statementMonths >= 3) score += 2;
    else score -= 8;
  }

  // ─────────────────────────────────────────────────────────
  // BÖLÜM 3: MESLEKİ BAĞLILIK (Maks 22 puan)
  // v3.4: Segment-aware — emekli/öğrenci/sponsor için SGK yokluğu beklenen
  // ─────────────────────────────────────────────────────────
  const segment = resolveSegment(data);
  const expectsEmployment = segment === 'employed' || segment === 'public_sector' || segment === 'self_employed';

  if (data.hasSgkJob) score += 12;
  else if (expectsEmployment) score -= 5; // çalışan profil için SGK yok = #3 ret sebebi
  // emekli/öğrenci/sponsor/işsiz: SGK yokluğu beklenir, ceza yok

  if (data.isPublicSectorEmployee) score += 6;
  if (data.sgkEmployerLetterWithReturn) score += 5;

  // Kıdem değerlendirmesi: sadece SGK işi olan profiller için anlamlı
  if (data.hasSgkJob) {
    if (data.yearsInCurrentJob >= 3) score += 5;
    else if (data.yearsInCurrentJob === 2) score += 4;
    else if (data.yearsInCurrentJob === 1) score += 2;
    else score -= 4; // SGK var ama kıdem 0 = yeni iş riski
  }

  if (data.sgkAddressMatchesDs160) score += 2;
  if (data.hasBarcodeSgk) score += 2;

  // ─────────────────────────────────────────────────────────
  // BÖLÜM 4: ÇOK KATMANLI BAĞLAR (Maks 20 puan)
  // #2 Context-Aware Multiplier: yaş+profil bağ puanını kalibre eder
  // ─────────────────────────────────────────────────────────
  const activeTieCount = [
    data.tieCategories?.employment,
    data.tieCategories?.property,
    data.tieCategories?.family,
    data.tieCategories?.community,
    data.tieCategories?.education,
  ].filter(Boolean).length;

  if (data.tieCategories?.employment) score += 5;
  if (data.tieCategories?.property) score += 5;
  if (data.tieCategories?.family) score += 4;
  if (data.tieCategories?.community) score += 3;
  if (data.tieCategories?.education) score += 3;

  if (activeTieCount >= 4) score += 6;
  else if (activeTieCount === 3) score += 3;

  if (data.isMarried) score += 3;
  if (data.hasChildren) score += 3;
  if (data.isStudent) score += 2;
  if (data.strongFamilyTies) score += 1;
  if (data.hasSocialMediaFootprint) score += 2;

  // Context-aware çarpan: bağ kategorisi 0-1 ise ceza uygula (ancak profile göre ölçeklendir)
  if (activeTieCount === 0) {
    const tieMultiplier = getReturnTieMultiplier({
      age: data.applicantAge,
      isStudent: data.isStudent,
      isMarried: data.isMarried,
      hasChildren: data.hasChildren,
      hasSgkJob: data.hasSgkJob,
    });
    score -= Math.round(8 * tieMultiplier); // Temel -8, profile göre ±
  }

  // ─────────────────────────────────────────────────────────
  // BÖLÜM 5: SEYAHAT GEÇMİŞİ (Maks 20 puan)
  // #1 Temporal Decay: eski vize/ret olayları zamanla daha az ağırlık taşır
  // ─────────────────────────────────────────────────────────
  const visaDecay = temporalDecay(data.lastVisaYear, DECAY_LAMBDA.VISA);
  if (data.hasHighValueVisa) score += Math.round(20 * visaDecay);
  else if (data.hasOtherVisa) score += Math.round(12 * visaDecay);
  else if (data.travelHistoryNonVisa) score += 6;

  if (!data.noOverstayHistory) score -= 45; // Süre aşımı → neredeyse kesin ret

  // Ret cezası onay'dan daha yavaş erir — konsolosluklar VIS kayıtlarında
  // retleri uzun süre tutar; "2 yıl önceki ret artık önemli değil" illüzyonunu
  // kırmak için REFUSAL lambda VISA'dan düşüktür (bkz. algorithms.ts yorumu).
  const refusalDecay = temporalDecay(data.lastRejectionYear, DECAY_LAMBDA.REFUSAL);
  if (data.hasPreviousRefusal && !data.previousRefusalDisclosed) score -= Math.round(20 * refusalDecay);
  if (data.hasPreviousRefusal && data.previousRefusalDisclosed) score -= Math.round(5 * refusalDecay);

  // v3.6: "Temiz sicil" pozitif bonusu — hiç ret yok + overstay yok + önceki
  // başarılı vize geçmişi varsa güvenilirlik sinyali. Sadece ceza yokluğu
  // yerine aktif ödül — konsolosluklar "track record" taşıyanı tercih ediyor.
  if (!data.hasPreviousRefusal && data.noOverstayHistory) {
    if (data.hasHighValueVisa && data.hasOtherVisa) score += 5;       // çoklu elite
    else if (data.hasHighValueVisa || data.hasOtherVisa) score += 3;  // tek başarı
    else if (data.travelHistoryNonVisa) score += 1;                   // vizesiz olsa bile temiz
  }

  // v3.5: Vizesiz seyahat geçmişi bonusu (+0/+1/+2).
  // Kullanıcı Japonya/Singapur/Kore gibi "güçlü damga" ülkelerini ziyaret
  // ettiyse geri dönüş güvenilirliği artar. Abuse önlemek için maksimum
  // scoreBoost'a bakıyoruz (sum değil) — tavan +2 puan.
  score += getVisaFreeBonus(data.visitedVisaFreeCountries);

  // ─────────────────────────────────────────────────────────
  // BÖLÜM 6: BAŞVURU KALİTESİ & NİYET KANITI (Maks 24 puan)
  // ─────────────────────────────────────────────────────────
  if (data.useOurTemplate) score += 5;
  if (data.hasInvitation) score += 3;
  if (data.paidReservations) score += 3;
  if (data.addressMatchSgk) score += 2;
  if (data.datesMatchReservations) score += 2;
  if (data.purposeClear) score += 6; // v2.5: +2 → +6 (Code 2 Türklerde #2 ret sebebi)
  if (data.hasReturnTicket) score += 3;
  if (!data.noFakeBooking) score -= 15; // Sahte rezervasyon = yasak listesi

  if (data.targetCountry === 'ABD') {
    if (data.interviewPrepared) score += 4;
    if (data.interviewConfidence === 'high') score += 3;
    else if (data.interviewConfidence === 'medium') score += 1;
    else score -= 2;
  }

  // ─────────────────────────────────────────────────────────
  // BÖLÜM 7: GÜVEN & BELGE KALİTESİ (Maks 12 puan)
  // ─────────────────────────────────────────────────────────
  if (data.hasValidPassport && data.passportConditionGood) score += 3;
  if (data.passportValidityLong) score += 3;
  if (data.documentConsistency) score += 3;
  if (data.cleanCriminalRecord) score += 3;

  // v2.5: Sigorta ağırlığı güncellendi (+4→+7, -10→-5)
  // Türk vakalarında %15 ret sebebi — min €30.000 teminat şartı
  if (data.hasHealthInsurance || data.hasTravelInsurance) score += 7;
  else if (data.targetCountry !== 'ABD' && data.targetCountry !== 'İngiltere') score -= 5;

  // ─────────────────────────────────────────────────────────
  // BÖLÜM 7.5: ETKİLEŞİM TERİMLERİ (v3.7)
  // Tek başına ölçülemeyen profil kombinasyonları. Küçük etkiler
  // (±3…±5) — overfit'i önlemek için kasıtlı olarak ölçülü.
  // ─────────────────────────────────────────────────────────

  // I1: "Mütevazı gelir + güçlü geri dönüş çapası"
  // Bankada az para var ama çoklu bağ (iş + aile + çocuk) = düşük kaçma riski.
  // Ev hanımı + çalışan eş + çocuk, kendi hesabı küçük ama ev/arsa mevcut vb.
  if (!data.bankSufficientBalance
      && activeTieCount >= 3
      && data.noOverstayHistory
      && data.hasChildren) {
    score += 4;
  }

  // I2: "Hikâyesiz para" — büyük birikim + iş yok + seyahat yok + bağ yok
  // Konsolosluklar için en şüpheli kombinasyon: nereden geldiği belirsiz
  // yüksek mevduat, anchor'sız profil. Emekli/sponsor segmentinde uygulanmaz.
  const isEliteTraveler = data.hasHighValueVisa || data.hasOtherVisa;
  if (data.bankSufficientBalance
      && data.highSavingsAmount
      && !isEliteTraveler
      && !data.travelHistoryNonVisa
      && isEventYearNone(data.lastVisaYear)
      && activeTieCount <= 1
      && segment !== 'retired'
      && segment !== 'sponsor') {
    score -= 5;
  }

  // I3: "Güvenilir müdavim" — çoklu pozitif sinyal birleşimi
  // Elit vize geçmişi + tutarlı belgeler + düzenli banka + temiz sicil.
  // Her biri ayrı ayrı ödüllendiriliyor; birleşince ek küçük güven bonusu.
  if (data.hasHighValueVisa
      && data.documentConsistency
      && data.bankRegularity
      && data.noOverstayHistory
      && !data.hasPreviousRefusal) {
    score += 3;
  }

  // I4: "Genç, bekâr, ilk başvuru → zor ülke" etkileşimi
  // Her faktör tek başına zaten kısmen cezalandırılıyor; birleşimi ABD/UK
  // için sistemik 214(b) / V4.2 riskini yansıtır.
  if (data.applicantAge > 0
      && data.applicantAge < 28
      && !data.isMarried
      && !data.hasChildren
      && !data.hasSgkJob
      && isEventYearNone(data.lastVisaYear)
      && !data.travelHistoryNonVisa
      && (data.targetCountry === 'ABD' || data.targetCountry === 'İngiltere')) {
    score -= 3;
  }

  // ─────────────────────────────────────────────────────────
  // BÖLÜM 7.6: CASCADE KURALI (v3.9 — 15 Temmuz 2025 / C(2025) 4694)
  // Son 3 yılda kurallara uygun kullanılmış Schengen vizesi olan
  // başvurucular için "bona fide traveller" bonusu. Schengen hedefli
  // başvurularda kademeli MEV hakkını skorda yansıtır.
  // getCascadeStatus tüm overstay/ret/ülke kontrollerini yapar.
  // ─────────────────────────────────────────────────────────
  score += getCascadeStatus(data).bonus;

  // ─────────────────────────────────────────────────────────
  // BÖLÜM 7.7: ASKERLİK DURUMU (v3.10)
  // TR erkek başvurucular için UK/ABD konsolosları askerliğini henüz
  // yapmamış adayları "hizmetten kaçış" kategorisinde işaretleyebilir
  // (US: 214(b), UK: V4.2). Sinyal dar ölçekli:
  //   • Sadece erkek + 20-41 yaş + hedef UK/ABD durumunda aktif
  //   • tamamlandı/muaf: +2 (obligation fulfilled — bağ sinyali)
  //   • tecilli:         -3 (göç riski şüphesi)
  //   • profesyonel asker: +2 (public_sector benzeri kurumsal bağ)
  // Kadın / 41+ / Schengen hedefi / bilgi yok → etki yok.
  // ─────────────────────────────────────────────────────────
  score += getMilitaryStatusSignal(data);

  // ─────────────────────────────────────────────────────────
  // BÖLÜM 8: VETO — Kritik eşik aşıldığında skoru zorla kırp
  // v2.5: Son dakika mevduat Türklerde #1 ret sebebi (%43)
  // NOT: Aynı tavan pipeline'ın en sonunda da uygulanır — sonraki
  // kalibrasyon katmanları (2-5) cezayı yumuşatamaz.
  // ─────────────────────────────────────────────────────────
  const vetoCap = computeVetoCap(data);
  score = Math.min(score, vetoCap);
  return Math.max(0, Math.min(score, 100));
};

// ============================================================
// computeVetoCap: Kritik kırmızı bayrakların tanımladığı hard ceiling
// - Son dakika büyük mevduat       → max 30
// - Süre aşımı (overstay) geçmişi  → max 10
// Hem calculateRawScore içinde hem de final pipeline sonunda uygulanır.
// Böylece kalibrasyon çarpanları veto'yu aşamaz.
// ============================================================
export const computeVetoCap = (data: ProfileData): number => {
  let cap = 100;
  if (data.hasSuspiciousLargeDeposit) cap = Math.min(cap, 30);
  if (!data.noOverstayHistory)        cap = Math.min(cap, 10);
  return cap;
};

// ============================================================
// calculateScore: kalibre edilmiş final skor
//
// Pipeline (v3.10 — ülke çift-sayımı ve konsolosluk çarpanı kaldırıldı):
//   1. calculateRawScore       → ham profil puanı (0-100)
//   2. Lineer kalibrasyon      → (raw/100)×0.65 + (1-trRejRate)×0.35
//      (NOT: "Bayes" DEĞİL — ağırlıklı ortalama; posterior türetmiyor.
//       Ülke sinyali TEK yerden burada giriyor: base rate.)
//   3. SEGMENT_FACTORS         → profil segment çarpanı (ülke boyutu yok)
//      (Eski PROFILE_COUNTRY_MATRIX n=2077 ile hücre başına ~13 gözlem
//       istatistik gürültüsüydü ve Katman 2 ile çift sayıyordu.)
//   4. SEASONAL_MULTIPLIER     → ay × ülke × profil gücü kalibrasyonu
//      (applyMonth tanımlıysa; yoksa 1.0 → geriye uyumlu)
//   5. VETO TAVAN (final)      → son dakika mevduat/overstay gibi kritik
//      kırmızı bayraklar hard ceiling olarak en sonda yeniden dayatılır.
//
// KALDIRILAN: Konsolosluk mood multiplier (v3.1-3.9). "İstanbul konsolosluğu
// strict × 0.95" sabiti ampirik olarak savunulamıyordu (vaka başına <10 gözlem,
// konsolosluk bazlı ret oranları zaten TR_REJECTION_RATES'e dâhil).
// `getConsulateAdjustment` hâlâ UI'da bilgi amaçlı kullanılıyor (bekleme süresi,
// mood göstergesi) ama final skorda çarpan değil.
// ============================================================
export const calculateScore = (data: ProfileData, simValue: number = 0): number => {
  const raw = calculateRawScore(data, simValue);
  const trRejRate = TR_REJECTION_RATES[data.targetCountry] ?? 0.15;
  const blended = (raw / 100) * 0.65 + (1 - trRejRate) * 0.35;
  const segmentFactor = getProfileSegmentFactor(data);

  // Mevsimsellik kalibrasyonu (v3.2 → v3.8): applyMonth tanımlıysa uygula
  // Ağırlık: final skorda ±%3 belirleyici (düşük sinyal).
  // Formül: 0.97 (base) + 0.03 × seasonalMultiplier
  // Not: Önceki ±%8 band literatüre göre (Schengen aylık ret farkı ~%2-3)
  // agresifti; tahminde sahte hassasiyete yol açıyordu.
  let seasonalFactor = 1.0;
  if (data.applyMonth) {
    const sm = getSeasonalMultiplier(
      data.targetCountry,
      Math.round(blended * segmentFactor * 100),
      data.applyMonth,
      data.applyYear,
    );
    seasonalFactor = 0.97 + 0.03 * sm;
  }

  const calibrated = Math.round(blended * segmentFactor * seasonalFactor * 100);
  const vetoCap = computeVetoCap(data);
  return Math.max(0, Math.min(100, Math.min(calibrated, vetoCap)));
};

// ============================================================
// calculateScoreDetailed: Kalibrasyon katmanlarını ayrı döner
// UI'da "Neden bu skor?" breakdownı için kullanılır.
//
// v3.10 değişiklikleri:
//   • countryFactor → segmentFactor (ülke boyutu kaldırıldı)
//   • consulateFactor kaldırıldı (çarpan değil)
//   • consulateCity/Mood/WaitDays UI bilgi amaçlı tutuluyor
// ============================================================
export interface ScoreBreakdown {
  rawScore:        number;   // Ham profil puanı
  blendedScore:    number;   // Lineer kalibrasyon sonrası (0-1)
  segmentFactor:   number;   // Profil segment çarpanı (v3.10)
  seasonalFactor:  number;   // Mevsimsellik kalibrasyonu çarpanı
  vetoCap:         number;   // Kritik kırmızı bayrak tavanı (son adımda uygulanır)
  finalScore:      number;   // Tüm katmanlar sonrası (0-100)
  // UI bilgi alanları (skora dahil değil — kullanıcıya bekleme süresi /
  // konsolosluk tutumu göstermek için; v3.10'dan itibaren çarpan değil)
  consulateCity:   string | null;
  consulateMood:   string | null;
  consulateWaitDays: number | null;
}

export const calculateScoreDetailed = (data: ProfileData, simValue = 0): ScoreBreakdown => {
  const rawScore     = calculateRawScore(data, simValue);
  const trRejRate    = TR_REJECTION_RATES[data.targetCountry] ?? 0.15;
  const blendedScore = (rawScore / 100) * 0.65 + (1 - trRejRate) * 0.35;
  const segmentFactor = getProfileSegmentFactor(data);

  let consulateCity: string | null = null;
  let consulateMood: string | null = null;
  let consulateWaitDays: number | null = null;

  if (data.applicantCity) {
    const adj = getConsulateAdjustment(data);
    if (adj.profile) {
      consulateCity    = adj.resolvedCity;
      consulateMood    = adj.profile.mood;
      consulateWaitDays = adj.profile.appointmentWaitDays;
    }
  }

  let seasonalFactor = 1.0;
  if (data.applyMonth) {
    const sm = getSeasonalMultiplier(
      data.targetCountry,
      Math.round(blendedScore * segmentFactor * 100),
      data.applyMonth,
      data.applyYear,
    );
    seasonalFactor = 0.97 + 0.03 * sm;
  }

  const calibrated = Math.round(blendedScore * segmentFactor * seasonalFactor * 100);
  const vetoCap = computeVetoCap(data);

  return {
    rawScore,
    blendedScore,
    segmentFactor,
    seasonalFactor,
    vetoCap,
    finalScore: Math.max(0, Math.min(100, Math.min(calibrated, vetoCap))),
    consulateCity,
    consulateMood,
    consulateWaitDays,
  };
};
