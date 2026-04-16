// ============================================================
// Test Fixture — Referans profiller
// ============================================================
import type { ProfileData } from '../../types';

/** Ortalama bir Schengen başvurucusu — ne çok güçlü ne çok zayıf (~50-60 skor) */
export const BASE_PROFILE: ProfileData = {
  // Finansal
  bankRegularity: true,
  bankSufficientBalance: true,
  bankNoLastMinuteDeposit: true,
  highSavingsAmount: false,
  hasAssets: false,
  hasSteadyIncome: true,
  bankHealthScore: 60,
  hasSuspiciousLargeDeposit: false,
  hasRegularSpending: true,
  salaryDetected: true,
  recurringExpensesDetected: true,
  unusualLargeTransactions: false,
  lowSpendingActivity: false,
  monthlyInflow: 15000,
  monthlyOutflow: 10000,
  transactionFrequency: 'medium',
  recurringPaymentTypes: [],

  // Mesleki
  hasSgkJob: true,
  isPublicSectorEmployee: false,
  sgkEmployerLetterWithReturn: false,
  yearsInCurrentJob: 1,
  sgkAddressMatchesDs160: false,

  // Seyahat
  hasHighValueVisa: false,
  hasOtherVisa: false,
  travelHistoryNonVisa: false,
  noOverstayHistory: true,
  hasSocialMediaFootprint: false,
  hasPreviousRefusal: false,
  previousRefusalDisclosed: false,

  // Aile & Sosyal
  isMarried: false,
  hasChildren: false,
  isStudent: false,
  strongFamilyTies: false,

  // Niyet
  useOurTemplate: false,
  hasInvitation: false,
  paidReservations: true,
  addressMatchSgk: false,
  datesMatchReservations: false,
  purposeClear: false,
  hasReturnTicket: false,
  noFakeBooking: true,

  // Kalite & Güven
  hasValidPassport: true,
  passportConditionGood: true,
  passportValidityLong: false,
  documentConsistency: false,
  interviewPrepared: false,
  cleanCriminalRecord: true,
  hasBarcodeSgk: false,
  hasTravelInsurance: false,
  hasHealthInsurance: false,

  // UK özel
  has28DayHolding: false,
  has6MonthStatements: false,
  statementMonths: 3,
  dailyBudgetSufficient: false,

  // Bağlar
  multiTieStrength: 1,
  tieCategories: {
    employment: true,
    property: false,
    family: false,
    community: false,
    education: false,
  },

  // Strateji
  targetCountry: 'Almanya',
  persona: '',
  readinessStatus: 'wait',
  documentStrengths: { financial: 0, professional: 0, history: 0, trust: 0 },
  timelineAdvice: '',
  strategyRoute: [],

  // Algoritma v3.0
  lastVisaYear: 0,
  lastRejectionYear: 0,
  applicantAge: 30,

  // Mülakat
  interviewConfidence: 'medium',
  incomeSourceClear: true,

  // Form
  bankBalance: '150000',
  monthlyIncome: '15000',
};
