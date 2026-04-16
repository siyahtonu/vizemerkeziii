// ============================================================
// Merkezi Tip Tanımları
// App.tsx'ten modüler yapıya taşındı
// ============================================================

export interface ProfileData {
  // 1. Financial (Max 25)
  bankRegularity: boolean;
  bankSufficientBalance: boolean;
  bankNoLastMinuteDeposit: boolean;
  highSavingsAmount: boolean;
  hasAssets: boolean;
  hasSteadyIncome: boolean;
  bankHealthScore: number; // 0-100 analysis
  hasSuspiciousLargeDeposit: boolean;
  hasRegularSpending: boolean;
  salaryDetected: boolean;
  recurringExpensesDetected: boolean;
  unusualLargeTransactions: boolean;
  lowSpendingActivity: boolean;
  monthlyInflow: number;
  monthlyOutflow: number;
  transactionFrequency: 'low' | 'medium' | 'high';
  recurringPaymentTypes: string[];

  // 2. Professional (Max 20)
  hasSgkJob: boolean;
  isPublicSectorEmployee: boolean;
  sgkEmployerLetterWithReturn: boolean;
  yearsInCurrentJob: number;
  sgkAddressMatchesDs160: boolean;

  // 3. Travel History (Max 20)
  hasHighValueVisa: boolean;
  hasOtherVisa: boolean;
  travelHistoryNonVisa: boolean;
  noOverstayHistory: boolean;
  hasSocialMediaFootprint: boolean; // New 2025 criteria

  // 4. Family & Social Ties (Max 10)
  isMarried: boolean;
  hasChildren: boolean;
  isStudent: boolean;
  strongFamilyTies: boolean;

  // 5. Purpose & Commitment (Max 15)
  useOurTemplate: boolean;
  hasInvitation: boolean;
  paidReservations: boolean;
  addressMatchSgk: boolean;
  datesMatchReservations: boolean;
  purposeClear: boolean;

  // 6. Quality & Trust (Max 10)
  hasValidPassport: boolean;
  passportConditionGood: boolean;
  passportValidityLong: boolean;
  documentConsistency: boolean;
  interviewPrepared: boolean;
  cleanCriminalRecord: boolean;
  hasBarcodeSgk: boolean; // Tactic: barkodlu SGK

  // Extra
  hasTravelInsurance: boolean;

  // 7. Kritik Yeni Alanlar (2025-2026 Konsolosluk Kuralları)
  has28DayHolding: boolean;         // UK: Para 28 gün hesapta bekledi mi?
  has6MonthStatements: boolean;     // UK: 6 aylık hesap dökümü var mı?
  hasPreviousRefusal: boolean;      // Önceki vize reddi var mı?
  previousRefusalDisclosed: boolean;// Önceki ret beyan edildi mi?
  dailyBudgetSufficient: boolean;   // Schengen: Günlük €100-120 gösterilebiliyor mu?
  hasReturnTicket: boolean;         // Dönüş bileti rezervasyonu var mı?
  hasHealthInsurance: boolean;      // Sağlık/seyahat sigortası var mı? (Schengen zorunlu)
  multiTieStrength: number;         // Kaç farklı bağ kategorisi var? (0-4: iş, mülk, aile, sosyal)
  interviewConfidence: 'low' | 'medium' | 'high'; // ABD mülakatı için özgüven/hazırlık
  statementMonths: number;          // Kaç aylık banka dökümü sunulacak (3, 6, 12)
  incomeSourceClear: boolean;       // Gelir kaynağı netçe banka dökümünde görünüyor mu?
  noFakeBooking: boolean;           // Sahte otel/uçak rezervasyonu yok mu?
  tieCategories: {                  // Çok katmanlı bağlar - her biri ayrı puan
    employment: boolean;
    property: boolean;
    family: boolean;
    community: boolean;
    education: boolean;
  };

  // Strategy & Intelligence (New)
  targetCountry: string;
  persona: string;
  readinessStatus: 'apply' | 'wait' | 'risky';
  documentStrengths: {
    financial: number;
    professional: number;
    history: number;
    trust: number;
  };
  timelineAdvice: string;
  strategyRoute: string[];

  // ── Algoritma v3.0 Ek Alanlar ─────────────────────────────────────────
  lastVisaYear: number;       // #1 Temporal: son vizenin yılı (0 = bilinmiyor)
  lastRejectionYear: number;  // #1 Temporal: son reddin yılı (0 = red yok)
  applicantAge: number;       // #2 Context: başvurucu yaşı (0 = belirtilmedi)

  // ── Form/UI Alanları ──────────────────────────────────────────────────
  bankBalance: string;        // Banka bakiyesi (form string)
  monthlyIncome: string;      // Aylık gelir (form string)

  // ── Konsolosluk Kalibrasyonu (v3.1) ──────────────────────────────────
  applicantCity?: string;     // Başvurucunun yaşadığı şehir (konsolosluk eşleme için)
}

export interface Conflict {
  type: 'error' | 'warning';
  message: string;
  suggestion: string;
}

export interface RoadmapItem {
  week: number;
  task: string;
  impact: string;
}

export interface LetterData {
  // Ortak alanlar
  fullName: string;
  passportNumber: string;
  birthDate: string;
  nationality: string;
  phone: string;
  email: string;
  address: string;
  targetCountry: string;
  purpose: string;
  startDate: string;
  endDate: string;
  // Finansal & Mesleki
  occupation: string;
  companyEmployer: string;
  monthlyIncome: string;
  bankBalance: string;
  insuranceProvider: string;
  insurancePolicyNo: string;
  // Konaklama & Uçuş
  hotelName: string;
  hotelAddress: string;
  hotelReservationNo: string;
  flightOutbound: string;
  flightInbound: string;
  // Bağlar
  tieDescription: string;
  // Sponsor alanları
  sponsorFullName: string;
  sponsorRelation: string;
  sponsorId: string;
  sponsorAddress: string;
  sponsorPhone: string;
  sponsorOccupation: string;
  sponsorIncome: string;
  // İşveren alanları
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  jobStartDate: string;
  authorizedName: string;
  authorizedTitle: string;
  returnDate: string;
  // Seyahat planı
  dailyPlan: string;
}
