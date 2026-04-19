import { apiUrl } from './api';
import type { ProfileData, LetterData } from '../types';
import type { RefusalRule } from '../data/documents';
import type { BankAnalysisResult } from '../data/countries';

/**
 * Backend'deki /api/ai endpoint'ine prompt gönderir, Claude'un metin yanıtını
 * döner. Hata durumunda Error fırlatır — çağıran UI'da yakalamalı.
 */
export async function askAI(prompt: string): Promise<string> {
  const res = await fetch(apiUrl('/api/ai'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error ?? `AI servisi ${res.status} döndü.`);
  }

  const data = (await res.json()) as { result?: string };
  if (!data.result) throw new Error('AI boş yanıt döndü.');
  return data.result;
}

/**
 * AI yanıtı içinden ilk JSON bloğunu çıkarır. Claude genelde açıklama +
 * kod bloğu şeklinde cevap verir; bu helper tri-backtick JSON veya düz
 * { ... } ifadesini yakalar.
 */
export function extractJSON<T = unknown>(text: string): T | null {
  // ```json ... ``` formatı
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) {
    try { return JSON.parse(fenced[1]) as T; } catch { /* düş */ }
  }
  // Kaba fallback: ilk { ... son }
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end > start) {
    try { return JSON.parse(text.slice(start, end + 1)) as T; } catch { /* düş */ }
  }
  return null;
}

// ── Vize Danışmanım (Copilot) ────────────────────────────────────────────
export interface CopilotResult {
  steps: { text: string; urgent: boolean }[];
  countryTip: string;
}

/**
 * Profil özetini Claude'a yollar, kişiye özel 3 kritik adım + hedef ülke
 * taktiği ister. JSON parse başarısız olursa CopilotError fırlatır.
 */
export async function askCopilot(profile: ProfileData): Promise<CopilotResult> {
  // Profile içinden AI için anlamlı olan alanları özetle — tüm şemayı
  // göndermeye gerek yok, token israfı olur.
  const summary = {
    hedefUlke: profile.targetCountry || 'belirtilmedi',
    yasGrubu: profile.applicantAge || 'belirtilmedi',
    meslek: profile.hasSgkJob ? (profile.isPublicSectorEmployee ? 'kamu çalışanı' : 'SGK çalışanı') : 'belirtilmedi',
    isYili: profile.yearsInCurrentJob,
    bankaSaglik: profile.bankHealthScore,
    aylikGelirTL: profile.monthlyIncome,
    bakiyeTL: profile.bankBalance,
    sonDakikaMevduat: profile.hasSuspiciousLargeDeposit,
    maasDuzenli: profile.salaryDetected,
    ayEkstre: profile.statementMonths,
    onceYuksekVize: profile.hasHighValueVisa,
    onceVize: profile.hasOtherVisa,
    oncedenRet: profile.hasPreviousRefusal,
    retBeyan: profile.previousRefusalDisclosed,
    evli: profile.isMarried,
    cocuk: profile.hasChildren,
    aileBaglari: profile.strongFamilyTies,
    davetMektubu: profile.hasInvitation,
    odenmisRezervasyon: profile.paidReservations,
    donusBileti: profile.hasReturnTicket,
    sigorta: profile.hasHealthInsurance,
    sosyalMedyaTemiz: profile.hasSocialMediaFootprint,
    amacNet: profile.purposeClear,
    multakatGuven: profile.interviewConfidence,
  };

  const prompt = `Sen deneyimli bir Türk vatandaşı vize danışmanısın. Aşağıdaki başvurucu profili için kişiye özel tavsiye üret.

Profil (JSON):
${JSON.stringify(summary, null, 2)}

Görev:
1. En kritik 3 adımı belirle. Generic tavsiye değil — bu profildeki spesifik zayıflıklara odaklan. Her adım 1-2 cümle, Türkçe, somut eylem.
2. Hedef ülkeye (${summary.hedefUlke}) özel, profilini göz önünde bulunduran 1 paragraf taktik (2-3 cümle).

ÇIKTI SADECE JSON, başka metin EKLEME:
{
  "steps": [
    { "text": "adım 1 metni", "urgent": true },
    { "text": "adım 2 metni", "urgent": false },
    { "text": "adım 3 metni", "urgent": false }
  ],
  "countryTip": "ülke spesifik taktik metni"
}

urgent=true: hemen şimdi (30 gün içinde) yapılmazsa ret riski yükselten adımlar için.`;

  const raw = await askAI(prompt);
  const parsed = extractJSON<CopilotResult>(raw);
  if (!parsed || !Array.isArray(parsed.steps) || parsed.steps.length === 0) {
    throw new Error('AI yanıtı beklenmedik formatta.');
  }
  return parsed;
}

// ── Profil özeti yardımcı ────────────────────────────────────────────────
function summarizeProfile(profile: ProfileData) {
  return {
    hedefUlke: profile.targetCountry || 'belirtilmedi',
    yasGrubu: profile.applicantAge || 'belirtilmedi',
    meslek: profile.hasSgkJob ? (profile.isPublicSectorEmployee ? 'kamu çalışanı' : 'SGK çalışanı') : 'SGK yok',
    isYili: profile.yearsInCurrentJob,
    aylikGelirTL: profile.monthlyIncome,
    bakiyeTL: profile.bankBalance,
    bankaSaglik: profile.bankHealthScore,
    sonDakikaMevduat: profile.hasSuspiciousLargeDeposit,
    maasDuzenli: profile.salaryDetected,
    ayEkstre: profile.statementMonths,
    onceYuksekVize: profile.hasHighValueVisa,
    onceVize: profile.hasOtherVisa,
    oncedenRet: profile.hasPreviousRefusal,
    retBeyan: profile.previousRefusalDisclosed,
    evli: profile.isMarried,
    cocuk: profile.hasChildren,
    aileBaglari: profile.strongFamilyTies,
    davetMektubu: profile.hasInvitation,
    odenmisRezervasyon: profile.paidReservations,
    donusBileti: profile.hasReturnTicket,
    sigorta: profile.hasHealthInsurance,
    amacNet: profile.purposeClear,
    multakatGuven: profile.interviewConfidence,
  };
}

// ── Ret Mektubu Analizi ──────────────────────────────────────────────────
export type RefusalFinding = RefusalRule;

/**
 * Konsolosluktan gelen ret mektubu metnini Claude'a yollar, hangi gerekçelerin
 * tetiklendiğini ve ne kadar beklenmesi gerektiğini döner. UI mevcut
 * RefusalRule renderer'ını kullanır, o yüzden şema bire bir uyumludur.
 */
export async function askRefusalAnalysis(refusalText: string): Promise<RefusalFinding[]> {
  const trimmed = refusalText.trim();
  if (!trimmed) throw new Error('Ret mektubu metni boş.');

  const prompt = `Sen Schengen/UK/ABD vize ret mektubu analisti bir Türk vize danışmanısın.
Kullanıcı, konsolosluktan aldığı ret mektubunu paylaşıyor. Mektuptaki gerçek kodları/ifadeleri
analiz et, tespit edilen RET SEBEPLERİNİ çıkar. Mektupta olmayan sebebi uydurma.

Ret mektubu metni:
"""
${trimmed.slice(0, 3500)}
"""

ÇIKTI SADECE JSON (başka metin EKLEME):
{
  "findings": [
    {
      "keywords": ["mektupta tespit edilen anahtar ifade(ler)"],
      "title": "kısa Türkçe başlık (örn. 'Seyahat amacı belgelendirilmemiş')",
      "category": "financial | ties | purpose | document | history",
      "severity": "critical | high | medium",
      "waitMonths": 3,
      "actions": ["somut eylem 1", "somut eylem 2", "somut eylem 3"]
    }
  ]
}

Kurallar:
- Her "actions" maddesi Türkçe, 1 cümle, uygulanabilir olsun.
- waitMonths: bu sebep giderilmeden yeniden başvuru için tavsiye edilen bekleme süresi.
- En fazla 5 finding dön. Mektupta net bir sebep yoksa boş liste dön.`;

  const raw = await askAI(prompt);
  const parsed = extractJSON<{ findings: RefusalFinding[] }>(raw);
  if (!parsed || !Array.isArray(parsed.findings)) {
    throw new Error('AI yanıtı beklenmedik formatta.');
  }
  return parsed.findings;
}

// ── AI Banka Dökümü Analizi ──────────────────────────────────────────────
export interface BankAnalysisInput {
  fileName: string;
  country: string;
  income: string;           // TL
  balance: string;          // TL
  months: number;           // 3 / 6 / 12
  salaryRegular: boolean;
  largeDeposit: boolean;
}

/**
 * Kullanıcının banka dökümü özet girdilerini (rakamlar + 2 checkbox) alır,
 * Claude'dan konsolosluk bakış açısıyla 0-100 skor + gerekçeli rapor ister.
 * Dönüş BankAnalysisResult şemasına birebir uyar (mevcut UI değişmeden çalışır).
 */
export async function askBankAnalysis(input: BankAnalysisInput): Promise<BankAnalysisResult> {
  const prompt = `Sen bir vize ofisi banka dökümü analistisin. Aşağıdaki başvurucu verilerini
konsolosluk gözüyle değerlendir ve 0-100 arası skor üret.

Veriler (JSON):
${JSON.stringify(input, null, 2)}

Skor referansı:
- 80+ çok iyi (A): düzenli maaş, yeterli bakiye, temiz hareket.
- 65-79 iyi (B): ufak eksikler, kabul edilebilir.
- 50-64 orta (C): dikkat çekici riskler var.
- <50 zayıf (D): son-dakika mevduat, düşük bakiye, ölü hesap gibi kritik sinyaller.

ÇIKTI SADECE JSON (başka metin EKLEME):
{
  "fileName": "${input.fileName || 'Banka Dökümü'}",
  "country": "${input.country || 'Hedef'}",
  "score": 0-100,
  "grade": "A / B / C / D",
  "gradeEmoji": "🟢 | 🔵 | 🟡 | 🔴",
  "positives": ["2-4 Türkçe güçlü yön"],
  "negatives": ["0-4 Türkçe risk/eksik"],
  "tips": ["2-4 Türkçe somut eylem"],
  "summary": "1-2 cümle Türkçe genel değerlendirme"
}

Kurallar:
- Son dakika büyük mevduat varsa skoru 60 üstüne çıkarma.
- Düzensiz maaş + <3 ay döküm varsa skoru 55 üstüne çıkarma.
- "tips" her zaman somut: rakam, eylem, süre içersin.`;

  const raw = await askAI(prompt);
  const parsed = extractJSON<BankAnalysisResult>(raw);
  if (!parsed || typeof parsed.score !== 'number') {
    throw new Error('AI yanıtı beklenmedik formatta.');
  }
  return parsed;
}

// ── Kırmızı Bayrak Tarayıcı ──────────────────────────────────────────────
export interface RedFlagInput {
  bakiyeTL: number;
  ucakTL: number;
  otelTL: number;
  seyahatGunu: number;
  gunlukButceEur: number;
  sigortaVar: boolean;
  sigortaTumSureyiKapsiyor: boolean;
  donusBiletiVar: boolean;
  ilkYurtDisi: boolean;
  mulkVar: boolean;
  sgkVar: boolean;
  hedefUlke?: string;
}

export interface RedFlagFinding {
  severity: 'critical' | 'warn' | 'ok';
  msg: string;
}

/**
 * Kullanıcının girdiği 5 sayı + 6 checkbox kombinasyonunu Claude'a yollar,
 * konsolosluk otomatik tarama bakış açısıyla kırmızı bayrak listesi üretir.
 * Dönüş mevcut state (`{severity, msg}[]`) ile bire bir uyumludur.
 */
export async function askRedFlagScan(input: RedFlagInput): Promise<RedFlagFinding[]> {
  const prompt = `Sen konsolosluk otomatik risk tarayıcısısın. Aşağıdaki profili incele ve
kritik/uyarı/temiz bayrakları listele. Sadece gerçekten sinyal veren bayrakları üret —
abartma, her alanı finding'e çevirme.

Veriler (JSON):
${JSON.stringify(input, null, 2)}

ÇIKTI SADECE JSON (başka metin EKLEME):
{
  "findings": [
    { "severity": "critical | warn | ok", "msg": "1 cümle Türkçe açıklama + neden bayrak" }
  ]
}

Kurallar:
- severity 'critical' = başvuru yakılabilir (veto). Örn: sahte rezervasyon, beyansız ret.
- severity 'warn' = iyileştirilebilir risk.
- severity 'ok' = dikkat çekici pozitif sinyal (en fazla 1 tane).
- En fazla 6 finding dön. Kullanıcı metni yok, sadece rakam/checkbox analizi yap.`;

  const raw = await askAI(prompt);
  const parsed = extractJSON<{ findings: RedFlagFinding[] }>(raw);
  if (!parsed || !Array.isArray(parsed.findings)) {
    throw new Error('AI yanıtı beklenmedik formatta.');
  }
  return parsed.findings;
}

// ── Kapak / Niyet Mektubu Üreteci ────────────────────────────────────────
export interface CoverLetterResult {
  body: string;
  tips: string[];
}

/**
 * LetterData + ProfileData'yı alır, Claude'dan konsolosluk formatında
 * 4 paragraflık Türkçe niyet mektubu gövdesi + 2-3 yazım ipucu üretir.
 * Form input'larını aynen kullanır — uydurmaz, boş alanları vurgular.
 */
export async function askCoverLetter(
  letter: LetterData,
  profile: ProfileData,
  letterType: 'cover' | 'sponsor' | 'employer' | 'itinerary' = 'cover',
): Promise<CoverLetterResult> {
  const typeLabel = {
    cover: 'Niyet Mektubu (başvurucunun kendi beyanı)',
    sponsor: 'Sponsor Taahhüt Mektubu',
    employer: 'İşveren İzin Yazısı',
    itinerary: 'Seyahat Planı / Itinerary',
  }[letterType];

  const prompt = `Sen deneyimli bir Türk vize danışmanısın. Aşağıdaki form verileriyle
konsolosluk standardında ${typeLabel} üret. 2024-2026 Schengen/UK/ABD formatına uy.

Form verisi:
${JSON.stringify(letter, null, 2)}

Profil özeti:
${JSON.stringify(summarizeProfile(profile), null, 2)}

Kurallar:
- Türkçe, profesyonel, 1. şahıs (mektup türüne göre başvurucu/işveren/sponsor).
- 4 paragraf: (1) kimlik + amaç, (2) finansal durum + iş, (3) Türkiye'deki bağlar, (4) dönüş taahhüdü.
- Forma girilmeyen alanı UYDURMA, "[girilmedi]" yaz.
- Başında tarih + konsolosluk hitabı, sonunda "Saygılarımla, [Ad Soyad]" bulunsun.

ÇIKTI SADECE JSON (başka metin EKLEME):
{
  "body": "mektubun tam gövdesi, \\n ile satır sonları",
  "tips": ["mektupla ilgili 2-3 Türkçe yazım ipucu"]
}`;

  const raw = await askAI(prompt);
  const parsed = extractJSON<CoverLetterResult>(raw);
  if (!parsed || typeof parsed.body !== 'string' || parsed.body.length < 40) {
    throw new Error('AI yanıtı beklenmedik formatta.');
  }
  return parsed;
}

// ── Kişiye Özel Taktikler ────────────────────────────────────────────────
export interface PersonalTactic {
  title: string;
  detail: string;
  impact: string;
  urgent: boolean;
}

/**
 * Profil özetini alır, Claude'dan bu profildeki en etkili 5 taktik ister.
 * TacticsStep'teki sabit 13 taktiğin üstüne "size özel" şerit olarak bağlanır.
 */
export async function askPersonalTactics(profile: ProfileData): Promise<PersonalTactic[]> {
  const summary = summarizeProfile(profile);

  const prompt = `Sen Türk vatandaşları için Schengen/UK/ABD vize danışmanısın. Aşağıdaki
başvurucu profilini oku ve KİŞİYE ÖZEL en etkili 5 taktiği döndür. Generic "döküm hazırla"
tavsiyeleri yerine bu profilin zayıflığını/gücünü kullan.

Profil (JSON):
${JSON.stringify(summary, null, 2)}

ÇIKTI SADECE JSON (başka metin EKLEME):
{
  "tactics": [
    {
      "title": "kısa Türkçe başlık",
      "detail": "2-3 cümle uygulama detayı",
      "impact": "beklenen skor/risk etkisi (örn. '+8 puan' veya 'ret riskini %12 düşürür')",
      "urgent": true
    }
  ]
}

Kurallar:
- Tam 5 taktik dön.
- urgent=true: 30 gün içinde yapılmazsa ret riskini ciddi şekilde yükseltenler için.
- Hedef ülkesi "${summary.hedefUlke}" için özel taktikler öne çıksın.`;

  const raw = await askAI(prompt);
  const parsed = extractJSON<{ tactics: PersonalTactic[] }>(raw);
  if (!parsed || !Array.isArray(parsed.tactics) || parsed.tactics.length === 0) {
    throw new Error('AI yanıtı beklenmedik formatta.');
  }
  return parsed.tactics;
}
