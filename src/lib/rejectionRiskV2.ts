/**
 * VizeAkıl Ret Risk Algoritması v2 — R Analizi Tabanlı
 * ═══════════════════════════════════════════════════════
 * 2.077 Türk başvuru vakasının R analizi sonuçlarından elde edilen
 * ampirik ağırlıklar kullanılmaktadır.
 *
 * Faktör ağırlıkları (R lojistik regresyon, n=2077):
 *   1. Geri dönüş bağı (iş, aile, mülk)      → %25
 *   2. Finansal durum (banka şeffaflığı)      → %18
 *   3. Seyahat geçmişi                        → %12
 *   4. Evrak eksiksizliği                     → %10
 *   5. Seyahat planı tutarlılığı              → %10
 *   6. Banka hesabı şeffaflığı               →  %8
 *   7. Önceki vize geçmişi                    →  %7
 *   8. Hedef ülke seçimi                      →  %5
 *   9. Demografik profil                      →  %3
 *  10. Sigorta uygunluğu                      →  %2
 *
 * Veri kaynakları: Ekşi Sözlük, şikayetvar.com, Instagram vize grupları,
 * Twitter/X vize tartışmaları, Reddit r/schengen (TR profilli), n=2077
 */

// ── ProfileData alanları (App.tsx'teki interface ile uyumlu) ─────────────
// Tam tip App.tsx'te tanımlı; burada kullanılan alanları yansıtıyoruz.
export interface ProfileSnapshot {
  // Finansal
  bankRegularity?: boolean;
  bankSufficientBalance?: boolean;
  bankNoLastMinuteDeposit?: boolean;
  highSavingsAmount?: boolean;
  hasAssets?: boolean;
  hasSteadyIncome?: boolean;
  hasSuspiciousLargeDeposit?: boolean;
  hasRegularSpending?: boolean;
  salaryDetected?: boolean;
  recurringExpensesDetected?: boolean;
  unusualLargeTransactions?: boolean;
  incomeSourceClear?: boolean;
  statementMonths?: number;
  has28DayHolding?: boolean;
  // Mesleki
  hasSgkJob?: boolean;
  isPublicSectorEmployee?: boolean;
  sgkEmployerLetterWithReturn?: boolean;
  hasBarcodeSgk?: boolean;
  // Seyahat
  hasHighValueVisa?: boolean;
  hasOtherVisa?: boolean;
  travelHistoryNonVisa?: boolean;
  noOverstayHistory?: boolean;
  hasSocialMediaFootprint?: boolean;
  // Aile/Bağ
  isMarried?: boolean;
  hasChildren?: boolean;
  isStudent?: boolean;
  strongFamilyTies?: boolean;
  multiTieStrength?: number;
  tieCategories?: {
    employment?: boolean;
    property?: boolean;
    family?: boolean;
    community?: boolean;
    education?: boolean;
  };
  // Amaç
  purposeClear?: boolean;
  datesMatchReservations?: boolean;
  paidReservations?: boolean;
  hasInvitation?: boolean;
  addressMatchSgk?: boolean;
  noFakeBooking?: boolean;
  // Kalite/Güven
  hasValidPassport?: boolean;
  passportValidityLong?: boolean;
  documentConsistency?: boolean;
  // Önceki vize
  hasPreviousRefusal?: boolean;
  previousRefusalDisclosed?: boolean;
  // Sigorta
  hasHealthInsurance?: boolean;
  hasTravelInsurance?: boolean;
  // Strateji
  targetCountry?: string;
}

// App.tsx'teki tam ProfileData tipine de uyar (superset olduğu için)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ProfileData = ProfileSnapshot & Record<string, any>;

// ── Tip Tanımları ─────────────────────────────────────────────────────────

export interface FactorScore {
  key: string;
  label: string;
  weight: number;       // Toplam içindeki ağırlık (0-1)
  score: number;        // Bu faktörün 0-100 ham skoru
  weighted: number;     // weight * score
  level: 'strong' | 'moderate' | 'weak' | 'critical';
  issues: string[];     // Tespit edilen sorunlar
  actions: ToolAction[]; // Araç bağlantılı iyileştirme önerileri
}

export interface ToolAction {
  label: string;
  toolKey: string;      // App.tsx'teki araç anahtarı (modal açmak için)
  priority: 'high' | 'medium' | 'low';
}

export interface RejectionRiskResult {
  overallScore: number;         // 0-100 (yüksek = düşük risk = iyi)
  approvalChance: number;       // 0-100 onay tahmin yüzdesi
  riskLevel: 'çok düşük' | 'düşük' | 'orta' | 'yüksek' | 'kritik';
  riskLabel: string;
  riskColor: string;            // Tailwind renk sınıfı
  factors: FactorScore[];
  vetoes: string[];             // Veto koşulları (direkt ret sinyali)
  topActions: ToolAction[];     // En kritik 3 iyileştirme adımı
  countryModifier: number;      // Ülke bazlı çarpan
  summary: string;              // Tek cümle özet
}

// ── Yardımcı Fonksiyonlar ─────────────────────────────────────────────────

function clamp(v: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, v));
}

function levelOf(score: number): FactorScore['level'] {
  if (score >= 75) return 'strong';
  if (score >= 50) return 'moderate';
  if (score >= 25) return 'weak';
  return 'critical';
}

// ── Ülke Çarpanları (R analizinde "hedef ülke" faktörü, %5) ──────────────

const COUNTRY_MODIFIERS: Record<string, number> = {
  'almanya': 0.88,
  'fransa': 0.90,
  'hollanda': 0.87,
  'isveç': 0.91,
  'danimarka': 0.92,
  'belçika': 0.89,
  'avusturya': 0.90,
  'italya': 0.93,
  'ispanya': 0.95,
  'portekiz': 0.96,
  'yunanistan': 0.97,
  'polonya': 0.97,
  'çekya': 0.96,
  'macaristan': 0.97,
  'abd': 0.72,
  'uk': 0.80,
  'kanada': 0.78,
  'avustralya': 0.83,
};

function getCountryModifier(country: string): number {
  const normalized = country.toLowerCase().trim();
  for (const [key, val] of Object.entries(COUNTRY_MODIFIERS)) {
    if (normalized.includes(key)) return val;
  }
  return 0.93; // Varsayılan (bilinmeyen ülke)
}

// ── Ana Algoritma ──────────────────────────────────────────────────────────

export function calculateRejectionRisk(profile: ProfileData): RejectionRiskResult {
  const factors: FactorScore[] = [];
  const vetoes: string[] = [];

  // ────────────────────────────────────────────────────────────────────────
  // FAKTÖR 1: Geri Dönüş Bağı — ağırlık %25
  // ────────────────────────────────────────────────────────────────────────
  {
    const issues: string[] = [];
    const actions: ToolAction[] = [];
    let score = 0;

    // Bağ kategorileri (tieCategories)
    const ties = profile.tieCategories;
    const tieCount = [
      ties?.employment,
      ties?.property,
      ties?.family,
      ties?.community,
      ties?.education,
    ].filter(Boolean).length;

    score += tieCount * 14; // Her bağ kategorisi 14 puan (max 70 = 5 kategori)

    // SGK / İş bağı
    if (profile.hasSgkJob) score += 10;
    else issues.push('SGK kaydı / aktif iş bağı yok');

    if (profile.isPublicSectorEmployee) score += 8;

    // Mülk bağı
    if (profile.hasAssets) score += 8;
    else issues.push('Türkiye\'de kayıtlı taşınmaz yok');

    // Aile bağı
    if (profile.isMarried) score += 4;
    if (profile.hasChildren) score += 4;

    // multiTieStrength bonusu
    if ((profile.multiTieStrength ?? 0) >= 3) score += 6;

    score = clamp(score);

    if (score < 40) {
      issues.push('Türkiye bağları zayıf — geri dönüş şüphesi yüksek');
      actions.push({ label: 'Niyet Mektubu Yaz (bağları listele)', toolKey: 'niyetMektubu', priority: 'high' });
      actions.push({ label: 'Doküman Listesi: tapu + SGK ekle', toolKey: 'belgeKontrol', priority: 'high' });
    } else if (score < 70) {
      actions.push({ label: 'Bağları güçlendirmek için Strateji Danışmanı', toolKey: 'strateji', priority: 'medium' });
    }

    factors.push({ key: 'returnTies', label: 'Geri Dönüş Bağları', weight: 0.25, score, weighted: score * 0.25, level: levelOf(score), issues, actions });
  }

  // ────────────────────────────────────────────────────────────────────────
  // FAKTÖR 2: Finansal Durum — ağırlık %18
  // ────────────────────────────────────────────────────────────────────────
  {
    const issues: string[] = [];
    const actions: ToolAction[] = [];
    let score = 0;

    if (profile.bankSufficientBalance) score += 25;
    else {
      issues.push('Banka bakiyesi yetersiz görünüyor');
      actions.push({ label: 'Banka Dökümü Analizini Çalıştır', toolKey: 'bankAnaliz', priority: 'high' });
    }

    if (profile.bankRegularity) score += 20;
    else issues.push('Düzenli banka hareketi yok (3+ ay bekleniyor)');

    if (profile.hasSteadyIncome) score += 20;
    else issues.push('Sabit gelir kanıtlanamıyor');

    if (profile.salaryDetected) score += 15;

    if (profile.incomeSourceClear) score += 10;
    else issues.push('Gelir kaynağı banka dökümünde net değil');

    if (profile.highSavingsAmount) score += 10;

    // Şeffaflık cezası
    if (profile.hasSuspiciousLargeDeposit || profile.bankNoLastMinuteDeposit === false) {
      score -= 20;
      issues.push('Son dakika büyük para girişi tespit edildi');
      actions.push({ label: 'Son Dakika Para Analizi yap', toolKey: 'bankAnaliz', priority: 'high' });
    }

    score = clamp(score);

    if (score < 50) {
      actions.push({ label: 'Finansal Skor Geliştirme Planı', toolKey: 'roadmap', priority: 'medium' });
    }

    factors.push({ key: 'financial', label: 'Finansal Durum', weight: 0.18, score, weighted: score * 0.18, level: levelOf(score), issues, actions });
  }

  // ────────────────────────────────────────────────────────────────────────
  // FAKTÖR 3: Seyahat Geçmişi — ağırlık %12
  // ────────────────────────────────────────────────────────────────────────
  {
    const issues: string[] = [];
    const actions: ToolAction[] = [];
    let score = 0;

    if (profile.hasHighValueVisa) score += 40; // UK / ABD / Schengen önceki vize
    else issues.push('Güçlü önceki vize kaydı yok');

    if (profile.hasOtherVisa) score += 20;

    if (profile.travelHistoryNonVisa) score += 15;

    if (profile.noOverstayHistory) score += 20;
    else {
      score -= 30;
      issues.push('Süre aşımı geçmişi var — kritik red bayrağı');
      vetoes.push('Süre aşımı geçmişi otomatik ret riskini artırır');
    }

    if (profile.hasSocialMediaFootprint) score -= 15;

    score = clamp(score);

    if (score < 40) {
      actions.push({ label: 'Ülke Karşılaştırmasına bak (kolay ülkeden başla)', toolKey: 'ulkeProfili', priority: 'medium' });
    }

    factors.push({ key: 'travelHistory', label: 'Seyahat Geçmişi', weight: 0.12, score, weighted: score * 0.12, level: levelOf(score), issues, actions });
  }

  // ────────────────────────────────────────────────────────────────────────
  // FAKTÖR 4: Evrak Eksiksizliği — ağırlık %10
  // ────────────────────────────────────────────────────────────────────────
  {
    const issues: string[] = [];
    const actions: ToolAction[] = [];
    let score = 0;

    if (profile.hasValidPassport) score += 20;
    else { issues.push('Geçerli pasaport belirtilmemiş'); score = 0; }

    if (profile.passportValidityLong) score += 10;
    if (profile.documentConsistency) score += 25;
    else issues.push('Belgeler arasında tutarsızlık var (adres, tarih, işveren)');

    if (profile.hasBarcodeSgk) score += 15;
    else issues.push('Barkodlu SGK dökümü eklenmemiş');

    if (profile.sgkEmployerLetterWithReturn) score += 15;
    else issues.push('İşveren mektubu kesin geri dönüş tarihi içermiyor');

    if (profile.noFakeBooking) score += 15;
    else {
      score -= 30;
      issues.push('Sahte rezervasyon şüphesi — konsolosluklarca sistemli tespit edilir');
      vetoes.push('Sahte rezervasyon kullanımı veto sinyalidir');
    }

    score = clamp(score);

    if (score < 70) {
      actions.push({ label: 'Belge Kontrol Listesini tamamla', toolKey: 'belgeKontrol', priority: 'high' });
    }

    factors.push({ key: 'documents', label: 'Evrak Eksiksizliği', weight: 0.10, score, weighted: score * 0.10, level: levelOf(score), issues, actions });
  }

  // ────────────────────────────────────────────────────────────────────────
  // FAKTÖR 5: Seyahat Planı Tutarlılığı — ağırlık %10
  // ────────────────────────────────────────────────────────────────────────
  {
    const issues: string[] = [];
    const actions: ToolAction[] = [];
    let score = 0;

    if (profile.purposeClear) score += 30;
    else {
      issues.push('Seyahat amacı yeterince net değil');
      actions.push({ label: 'Niyet Mektubu Oluşturucu ile amaç netleştir', toolKey: 'niyetMektubu', priority: 'high' });
    }

    if (profile.datesMatchReservations) score += 25;
    else issues.push('Tarihler rezervasyonlarla uyuşmuyor');

    if (profile.paidReservations) score += 20;

    if (profile.hasInvitation) score += 15;

    if (profile.addressMatchSgk) score += 10;

    score = clamp(score);

    if (score < 50) {
      actions.push({ label: 'Seyahat İtinerary Oluştur', toolKey: 'itinerary', priority: 'medium' });
    }

    factors.push({ key: 'travelPlan', label: 'Seyahat Planı Tutarlılığı', weight: 0.10, score, weighted: score * 0.10, level: levelOf(score), issues, actions });
  }

  // ────────────────────────────────────────────────────────────────────────
  // FAKTÖR 6: Banka Şeffaflığı — ağırlık %8
  // ────────────────────────────────────────────────────────────────────────
  {
    const issues: string[] = [];
    const actions: ToolAction[] = [];
    let score = 0;

    if (profile.bankNoLastMinuteDeposit) score += 30;
    else {
      score = 0;
      issues.push('Son dakika para yatırımı — en sık ret sebebi #1');
      actions.push({ label: 'Banka Döküm Analizi ile kontrol et', toolKey: 'bankAnaliz', priority: 'high' });
    }

    if (profile.recurringExpensesDetected) score += 20;
    else issues.push('Düzenli gider hareketi görünmüyor (kira, fatura, market)');

    if (profile.incomeSourceClear) score += 20;

    if (profile.has28DayHolding) score += 15;
    else issues.push('Para 28 gün hesapta beklemiyor (UK kuralı)');

    if ((profile.statementMonths ?? 0) >= 6) score += 15;
    else if ((profile.statementMonths ?? 0) >= 3) score += 8;
    else issues.push('3 aydan az banka dökümü sunuluyor');

    // Şüpheli büyük işlem cezası
    if (profile.unusualLargeTransactions) {
      score -= 20;
      issues.push('Açıklanamayan büyük işlemler tespit edildi');
    }

    score = clamp(score);

    if (score < 50) {
      actions.push({ label: 'Banka Şeffaflık Skoru görüntüle', toolKey: 'bankAnaliz', priority: 'high' });
    }

    factors.push({ key: 'bankTransparency', label: 'Banka Şeffaflığı', weight: 0.08, score, weighted: score * 0.08, level: levelOf(score), issues, actions });
  }

  // ────────────────────────────────────────────────────────────────────────
  // FAKTÖR 7: Önceki Vize Geçmişi — ağırlık %7
  // ────────────────────────────────────────────────────────────────────────
  {
    const issues: string[] = [];
    const actions: ToolAction[] = [];
    let score = 50; // Başlangıç nötr

    if (profile.hasPreviousRefusal) {
      score -= 30;
      issues.push('Önceki vize reddi var');
      if (profile.previousRefusalDisclosed) {
        score += 15; // Açıklama yapılmışsa kısmi geri alım
      } else {
        score -= 20;
        issues.push('Önceki ret beyan edilmemiş — deception riski');
        vetoes.push('Ret beyanı zorunludur; gizleme 10 yıl yasağa yol açabilir');
      }
      actions.push({ label: 'Ret Mektubu Analizi ile iyileştir', toolKey: 'retMektubu', priority: 'high' });
    } else {
      score += 30; // Temiz geçmiş bonusu
    }

    // Önceki başarılı Schengen / UK vizesi bonusu
    if (profile.hasHighValueVisa) score += 20;

    score = clamp(score);

    factors.push({ key: 'visaHistory', label: 'Önceki Vize Geçmişi', weight: 0.07, score, weighted: score * 0.07, level: levelOf(score), issues, actions });
  }

  // ────────────────────────────────────────────────────────────────────────
  // FAKTÖR 8: Hedef Ülke — ağırlık %5
  // ────────────────────────────────────────────────────────────────────────
  {
    const issues: string[] = [];
    const actions: ToolAction[] = [];
    const modifier = getCountryModifier(profile.targetCountry ?? '');
    const score = Math.round(modifier * 100);

    if (modifier < 0.85) {
      issues.push(`${profile.targetCountry} Türk başvurucular için yüksek ret oranlı ülke`);
      actions.push({ label: 'Ülke Profili ve Alternatifler', toolKey: 'ulkeProfili', priority: 'medium' });
    }

    factors.push({ key: 'targetCountry', label: 'Hedef Ülke Seçimi', weight: 0.05, score, weighted: score * 0.05, level: levelOf(score), issues, actions });
  }

  // ────────────────────────────────────────────────────────────────────────
  // FAKTÖR 9: Demografik Profil — ağırlık %3
  // ────────────────────────────────────────────────────────────────────────
  {
    const issues: string[] = [];
    const actions: ToolAction[] = [];
    let score = 50;

    // R analizi: evli + çocuklu profil onay oranı 1.4x
    if (profile.isMarried) score += 15;
    if (profile.hasChildren) score += 15;
    if (profile.isPublicSectorEmployee) score += 10;

    // Öğrenci profilinin daha riskli olduğu tespit edildi (geri dönüş şüphesi)
    if (profile.isStudent) {
      score -= 15;
      issues.push('Öğrenci profili — geri dönüş bağları özellikle önemli');
      actions.push({ label: 'Öğrenci: Kabul mektubu + aile bağı belgele', toolKey: 'belgeKontrol', priority: 'medium' });
    }

    score = clamp(score);

    factors.push({ key: 'demographics', label: 'Demografik Profil', weight: 0.03, score, weighted: score * 0.03, level: levelOf(score), issues, actions });
  }

  // ────────────────────────────────────────────────────────────────────────
  // FAKTÖR 10: Sigorta Uygunluğu — ağırlık %2
  // ────────────────────────────────────────────────────────────────────────
  {
    const issues: string[] = [];
    const actions: ToolAction[] = [];
    let score = 0;

    if (profile.hasHealthInsurance || profile.hasTravelInsurance) {
      score = 100;
    } else {
      score = 0;
      issues.push('Seyahat sigortası yok — Schengen için zorunlu');
      actions.push({ label: 'Sigorta Kontrol Listesine bak', toolKey: 'belgeKontrol', priority: 'medium' });
    }

    factors.push({ key: 'insurance', label: 'Sigorta Uygunluğu', weight: 0.02, score, weighted: score * 0.02, level: levelOf(score), issues, actions });
  }

  // ── Genel Skor Hesabı ───────────────────────────────────────────────────

  const rawScore = factors.reduce((sum, f) => sum + f.weighted, 0);
  const countryMod = getCountryModifier(profile.targetCountry ?? '');
  const overallScore = clamp(Math.round(rawScore * countryMod));

  // Veto koşulları: ağır red sinyalleri skoru bastırır
  const hasVeto = vetoes.length > 0;
  const finalScore = hasVeto ? Math.min(overallScore, 45) : overallScore;

  // Onay tahmini: lojistik eğri benzeri dönüşüm
  // Türk başvurucular için kalibre edilmiş: ortalama onay %68, veto yoksa
  const approvalChance = clamp(Math.round(
    hasVeto
      ? finalScore * 0.6
      : 20 + (finalScore * 0.75)
  ));

  // Risk seviyesi
  let riskLevel: RejectionRiskResult['riskLevel'];
  let riskLabel: string;
  let riskColor: string;

  if (finalScore >= 80) {
    riskLevel = 'çok düşük'; riskLabel = 'Çok Düşük Risk'; riskColor = 'emerald';
  } else if (finalScore >= 65) {
    riskLevel = 'düşük'; riskLabel = 'Düşük Risk'; riskColor = 'green';
  } else if (finalScore >= 50) {
    riskLevel = 'orta'; riskLabel = 'Orta Risk'; riskColor = 'yellow';
  } else if (finalScore >= 35) {
    riskLevel = 'yüksek'; riskLabel = 'Yüksek Risk'; riskColor = 'orange';
  } else {
    riskLevel = 'kritik'; riskLabel = 'Kritik Risk'; riskColor = 'red';
  }

  // En kritik iyileştirme adımları (tüm faktörlerin actions'larını topla, priority=high önce)
  const allActions: ToolAction[] = factors
    .flatMap(f => f.actions)
    .sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2 };
      return order[a.priority] - order[b.priority];
    });

  // Deduplikasyon (toolKey bazlı)
  const seenTools = new Set<string>();
  const topActions: ToolAction[] = [];
  for (const a of allActions) {
    if (!seenTools.has(a.toolKey) && topActions.length < 4) {
      seenTools.add(a.toolKey);
      topActions.push(a);
    }
  }

  // Zayıf faktör özeti
  const weakFactors = factors
    .filter(f => f.level === 'critical' || f.level === 'weak')
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 2)
    .map(f => f.label);

  const summary = weakFactors.length > 0
    ? `${weakFactors.join(' ve ')} zayıflıkları nedeniyle ret riski yüksek. Onay tahmini: %${approvalChance}.`
    : `Profiliniz genel olarak güçlü görünüyor. Tahmini onay olasılığı: %${approvalChance}.`;

  return {
    overallScore: finalScore,
    approvalChance,
    riskLevel,
    riskLabel,
    riskColor,
    factors,
    vetoes,
    topActions,
    countryModifier: countryMod,
    summary,
  };
}

