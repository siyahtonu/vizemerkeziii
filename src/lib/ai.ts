import { apiUrl } from './api';
import type { ProfileData, LetterData } from '../types';
import type { RefusalRule } from '../data/documents';
import type { BankAnalysisResult } from '../data/countries';

/**
 * Backend'deki /api/ai endpoint'ine prompt gönderir, AI'ın metin yanıtını
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
 * AI yanıtı içinden ilk JSON bloğunu çıkarır. Modeller genelde açıklama +
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
 * Profil özetini AI'a yollar, kişiye özel 3 kritik adım + hedef ülke
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
export interface RefusalTimelineStep {
  when: string;    // "Hemen", "1 hafta", "1 ay", "3 ay" gibi zaman etiketi
  step: string;    // somut eylem
}
export interface RefusalFinding extends RefusalRule {
  timeline?: RefusalTimelineStep[];
}

/**
 * Konsolosluktan gelen ret mektubu metnini AI'a yollar, hangi gerekçelerin
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
      "actions": ["somut eylem 1", "somut eylem 2", "somut eylem 3"],
      "timeline": [
        { "when": "Hemen", "step": "bugün yapılacak ilk eylem" },
        { "when": "1 hafta", "step": "1 hafta içinde tamamlanacak adım" },
        { "when": "1 ay", "step": "1 ay içinde toplanacak belge/kanıt" },
        { "when": "Yeniden başvuru", "step": "başvuru anında yapılacak eylem" }
      ]
    }
  ]
}

Kurallar:
- Her "actions" maddesi Türkçe, 1 cümle, uygulanabilir olsun.
- "timeline" her finding için 3-5 adım: "when" zaman etiketi ("Hemen" / "1 hafta" / "1 ay" / "3 ay" / "Yeniden başvuru"); "step" o zamanda yapılacak eylem.
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
  rawText?: string;         // PDF'den çıkarılmış ham metin (opsiyonel)
}

/**
 * Kullanıcının banka dökümü özet girdilerini (rakamlar + 2 checkbox) alır,
 * AI'dan konsolosluk bakış açısıyla 0-100 skor + gerekçeli rapor ister.
 * Dönüş BankAnalysisResult şemasına birebir uyar (mevcut UI değişmeden çalışır).
 */
export async function askBankAnalysis(input: BankAnalysisInput): Promise<BankAnalysisResult> {
  const { rawText, ...summary } = input;
  const rawBlock = rawText
    ? `\n\nHAM EKSTRE METNİ (ilk 4000 karakter):\n"""\n${rawText.slice(0, 4000)}\n"""\n\nHam metindeki gerçek işlem/tarih örüntülerini kullan — kullanıcı girdisi ile çelişki varsa ham metne öncelik ver.`
    : '';
  const prompt = `Sen bir vize ofisi banka dökümü analistisin. Aşağıdaki başvurucu verilerini
konsolosluk gözüyle değerlendir ve 0-100 arası skor üret.

Veriler (JSON):
${JSON.stringify(summary, null, 2)}${rawBlock}

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
 * Kullanıcının girdiği 5 sayı + 6 checkbox kombinasyonunu AI'a yollar,
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
export type LetterType = 'cover' | 'sponsor' | 'employer' | 'itinerary';

export interface CoverLetterResult {
  body: string;
  tips: string[];
}

/**
 * Her belge tipi için ayrı ton + format tarifi. Prompt'un başına enjekte
 * edilir; generic "mektup yaz" yerine tipe-spesifik çerçeve üretir.
 */
const LETTER_TYPE_SPEC: Record<LetterType, { label: string; voice: string; structure: string }> = {
  cover: {
    label: 'Niyet Mektubu (Cover Letter) — başvurucunun kendi beyanı',
    voice: '1. tekil şahıs, saygılı ve kişisel. "Ben ...-im, ... amacıyla ... talep ediyorum."',
    structure: [
      '(1) HITAP: tarih + "Sayın [Ülke] Konsolosluğu Vize Görevlisi,"',
      '(2) KIMLIK + AMAÇ: ad, meslek, bu başvurunun net amacı, tarih aralığı (1 paragraf)',
      '(3) FINANSAL + MESLEK: aylık gelir, bakiye, iş pozisyonu, işe dönüş taahhüdü (1 paragraf)',
      '(4) TÜRKİYE BAĞLARI: aile, mülk, iş — somut detaylarla (1 paragraf)',
      '(5) DÖNÜŞ TAAHHÜDÜ: uçuş rezervasyon özeti + "[tarih]\'te döneceğim" cümlesi (1 paragraf)',
      '(6) KAPANIŞ: "Saygılarımla," + Ad Soyad + imza yeri',
    ].join('\n'),
  },
  sponsor: {
    label: 'Sponsor Taahhüt Mektubu — başvurucuyu finanse eden kişinin beyanı',
    voice: '1. tekil şahıs (sponsorun ağzından). Formal, noterlik tonu. "Ben [sponsor], ... tam masraflarını karşılayacağımı taahhüt ederim."',
    structure: [
      '(1) HITAP: tarih + konsolosluk hitabı',
      '(2) SPONSOR KİMLİĞİ: ad, TC, meslek, gelir, yakınlık derecesi',
      '(3) TAAHHÜT: tam masrafın karşılanacağı net ifade + süre + masraf kalemleri',
      '(4) FINANSAL KANIT REFERANSI: "ekte banka ekstrem + maaş bordrom bulunmaktadır"',
      '(5) KAPANIŞ: "Saygılarımla," + Sponsor Adı + imza',
    ].join('\n'),
  },
  employer: {
    label: 'İşveren İzin / Çalışma Belgesi — şirket antetli kağıdında',
    voice: 'Şirket adına 3. şahıs. Resmi, noterlik tonu. "Çalışanımız [ad], ... tarihleri arasında izinli olup, [dönüş tarihi] itibarıyla işine devam edecektir."',
    structure: [
      '(1) ŞİRKET BAŞLIĞI: şirket adı + adres + telefon (üst blok)',
      '(2) TARİH + HITAP: konsolosluk hitabı',
      '(3) ÇALIŞAN BİLGİSİ: ad, pozisyon, işe başlama tarihi, aylık maaş',
      '(4) İZİN + DÖNÜŞ: izin tarih aralığı + kesin işe dönüş tarihi',
      '(5) TAAHHÜT: "İzin süresi boyunca görevinin açık tutulduğunu beyan ederiz"',
      '(6) İMZA: yetkili ad + ünvan + şirket mührü yeri',
    ].join('\n'),
  },
  itinerary: {
    label: 'Seyahat Planı / Itinerary — günlük rota dökümü',
    voice: 'Tarafsız, planlama tonu. Madde-madde. Metni kısa tut, tablodaki gibi.',
    structure: [
      '(1) BAŞLIK: "[Ülke] Seyahat Programı — [Başlangıç] - [Bitiş]"',
      '(2) ÖZET: uçuşlar (gidiş/dönüş), konaklama (otel adı + adres), toplam gün',
      '(3) GÜN GÜN PLAN: her gün için 1 satır — tarih + şehir + yapılacaklar',
      '(4) SİGORTA + REZERVASYON REFERANSI: poliçe no, otel rezervasyon no',
      '(5) İMZA: başvurucu ad + tarih',
    ].join('\n'),
  },
};

/**
 * LetterData + ProfileData'yı alır, AI'dan belge tipine özel format + ton ile
 * Türkçe mektup gövdesi + 2-3 yazım ipucu üretir. Form input'larını aynen kullanır
 * — uydurmaz, boş alanları "[girilmedi]" ile vurgular.
 */
export async function askCoverLetter(
  letter: LetterData,
  profile: ProfileData,
  letterType: LetterType = 'cover',
): Promise<CoverLetterResult> {
  const spec = LETTER_TYPE_SPEC[letterType];

  const prompt = `Sen 2000'in üzerinde Türk vize başvurusu hazırlamış deneyimli bir vize danışmanısın.
Görevin: aşağıdaki form verileriyle konsolosluk standardında "${spec.label}" üret.

TON: ${spec.voice}

ZORUNLU YAPI (sırayla takip et):
${spec.structure}

FORM VERİSİ (bunları birebir kullan, UYDURMA):
${JSON.stringify(letter, null, 2)}

PROFİL ÖZETİ (mektuba referans için):
${JSON.stringify(summarizeProfile(profile), null, 2)}

KURALLAR:
- Türkçe, profesyonel, doğal akış — "AI tarafından yazılmış" görünmesin.
- Form'da boş alan varsa "[girilmedi]" yaz, rakam/isim uydurma.
- Klişe ifadelerden kaçın ("hayalimin ülkesi", "kültürünüzü tanımak için can atıyorum" gibi — konsolosluk bunları her gün görüyor).
- Rakam/tarih kullanırken formdaki değerleri değiştirme.
- Uzunluk: cover/sponsor/employer için 300-450 kelime; itinerary tablo/liste tarzı kısa.

ÇIKTI SADECE JSON (başka metin EKLEME):
{
  "body": "mektubun tam gövdesi, \\n ile satır sonları",
  "tips": ["3 Türkçe yazım/iyileştirme ipucu"]
}`;

  const raw = await askAI(prompt);
  const parsed = extractJSON<CoverLetterResult>(raw);
  if (!parsed || typeof parsed.body !== 'string' || parsed.body.length < 40) {
    throw new Error('AI yanıtı beklenmedik formatta.');
  }
  return parsed;
}

// ── Mektup Kalite Skoru ──────────────────────────────────────────────────
export interface LetterQualityScore {
  score: number;           // 0-100
  grade: 'A' | 'B' | 'C' | 'D';
  strengths: string[];
  weaknesses: string[];
  verdict: string;         // 1 cümle özet
}

/**
 * Üretilmiş bir mektubu konsolosluk gözüyle 0-100 puanlar. 2. tur AI çağrısı
 * — kullanıcıya "bu mektup 87/100, şu yönler eksik" diyerek güven/değer gösterir.
 */
export async function askLetterScore(
  body: string,
  letterType: LetterType,
): Promise<LetterQualityScore> {
  const spec = LETTER_TYPE_SPEC[letterType];

  const prompt = `Sen Schengen/UK/ABD konsolosluk vize görevlisisin. Aşağıdaki "${spec.label}"
metnini 0-100 arası puanla. Gerçekçi ol — mükemmel bir mektup 92+, ortalama 65-75 civarı.

Değerlendirme kriterleri:
- Format tamlığı (yapıya uyum)
- Ton ve profesyonellik (konsolosluk dili)
- Somutluk (rakam, tarih, ad yeterince kullanılmış mı)
- Klişeden kaçınma
- Türkçe dilbilgisi ve akış

Mektup metni:
"""
${body.slice(0, 6000)}
"""

ÇIKTI SADECE JSON:
{
  "score": 0-100,
  "grade": "A | B | C | D",
  "strengths": ["2-3 Türkçe güçlü yön"],
  "weaknesses": ["2-3 Türkçe zayıf yön / eksik"],
  "verdict": "1 cümle Türkçe genel değerlendirme"
}`;

  const raw = await askAI(prompt);
  const parsed = extractJSON<LetterQualityScore>(raw);
  if (!parsed || typeof parsed.score !== 'number') {
    throw new Error('AI yanıtı beklenmedik formatta.');
  }
  return parsed;
}

// ── Mektup Revize Et ─────────────────────────────────────────────────────
/**
 * Kullanıcının feedback'ine göre mevcut mektubu AI'a yeniden yazdırır.
 * Örn: "Türkiye bağlarını daha güçlü vurgula" / "Daha kısa yaz" gibi.
 */
export async function askLetterRevise(
  body: string,
  feedback: string,
  letterType: LetterType,
  letter: LetterData,
  profile: ProfileData,
): Promise<CoverLetterResult> {
  const spec = LETTER_TYPE_SPEC[letterType];

  const prompt = `Aşağıdaki "${spec.label}" metnini, kullanıcının TALEBİ doğrultusunda yeniden yaz.
Yapıyı ve tonu koru; sadece talebi uygula. Rakam/isim uydurma — orijinal form verisini kullan.

ORİJİNAL MEKTUP:
"""
${body.slice(0, 6000)}
"""

KULLANICI TALEBİ: "${feedback.trim().slice(0, 500)}"

FORM VERİSİ (referans):
${JSON.stringify(letter, null, 2)}

PROFİL (referans):
${JSON.stringify(summarizeProfile(profile), null, 2)}

ÇIKTI SADECE JSON:
{
  "body": "revize edilmiş mektup gövdesi, \\n ile satır sonları",
  "tips": ["2 Türkçe ipucu: revizede neyi değiştirdin, neyi korudun"]
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
 * Profil özetini alır, AI'dan bu profildeki en etkili 5 taktik ister.
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

// ── SGK Hizmet Dökümü Analizi ────────────────────────────────────────────
export interface SgkAnalysisInput {
  fileName: string;
  rawText?: string;              // e-Devlet SGK 4A hizmet dökümü metni
  declaredJobStartDate?: string; // kullanıcının beyan ettiği işe giriş (ISO)
  declaredEmployer?: string;     // beyan edilen mevcut işveren
  declaredMonthlyIncome?: string;// beyan edilen aylık gelir (TL)
}

export interface SgkAnalysisResult {
  score: number;                 // 0-100
  grade: 'A' | 'B' | 'C' | 'D';
  gradeEmoji: string;
  employerCount: number | null;  // son 2 yılda tahmini işveren sayısı
  gapsDetected: boolean;         // kesinti/boşluk var mı
  positives: string[];
  negatives: string[];
  tips: string[];
  summary: string;
}

/**
 * SGK 4A hizmet dökümündeki istihdam sürekliliğini konsolosluk gözüyle skorlar.
 * Ham metin varsa örüntü analizi yapar; yoksa beyan verisine göre hafif skor üretir.
 */
export async function askSgkAnalysis(input: SgkAnalysisInput): Promise<SgkAnalysisResult> {
  const { rawText, ...summary } = input;
  const rawBlock = rawText
    ? `\n\nHAM SGK METNİ (ilk 4000 karakter):\n"""\n${rawText.slice(0, 4000)}\n"""`
    : '\n\n(Ham metin yok — sadece beyan verisi ile değerlendir.)';

  const prompt = `Sen Türkiye'de vize başvurularını değerlendiren bir analistsin. Başvurucunun
SGK 4A hizmet dökümünü konsolosluk gözüyle analiz et: istihdam sürekliliği, işveren sayısı,
kesinti/boşluk, beyan ile belge tutarlılığı.

Beyan verisi (JSON):
${JSON.stringify(summary, null, 2)}${rawBlock}

Skor referansı:
- 80+ (A): 2+ yıl aynı işveren, kesintisiz, düzenli prim.
- 65-79 (B): son 2 yıl içinde 1 işveren değişikliği veya küçük boşluk.
- 50-64 (C): sık işveren değişikliği veya 30+ gün boşluk.
- <50 (D): son 6 ayda girilmiş, uzun kesinti, eski kayıtsızlık.

ÇIKTI SADECE JSON (başka metin EKLEME):
{
  "score": 0-100,
  "grade": "A | B | C | D",
  "gradeEmoji": "🟢 | 🔵 | 🟡 | 🔴",
  "employerCount": null veya sayı,
  "gapsDetected": true | false,
  "positives": ["2-4 Türkçe güçlü yön"],
  "negatives": ["0-4 Türkçe eksik/risk"],
  "tips": ["2-4 Türkçe somut eylem"],
  "summary": "1-2 cümle Türkçe özet"
}`;

  const raw = await askAI(prompt);
  const parsed = extractJSON<SgkAnalysisResult>(raw);
  if (!parsed || typeof parsed.score !== 'number') {
    throw new Error('AI yanıtı beklenmedik formatta.');
  }
  return parsed;
}

// ── Belgeler Arası Çapraz Tutarlılık ─────────────────────────────────────
export interface CrossConsistencyInput {
  bank?: { income?: string; balance?: string; employerFromText?: string; rawText?: string };
  sgk?:  { employer?: string; monthlyIncome?: string; rawText?: string };
  letterData?: { employer?: string; income?: string; jobStartDate?: string };
}

export interface ConsistencyIssue {
  severity: 'critical' | 'warn' | 'info';
  field: string;              // örn. "İşveren adı" / "Aylık gelir"
  message: string;            // çelişkinin Türkçe açıklaması
  suggestion: string;         // nasıl giderilir
}

export interface CrossConsistencyResult {
  ok: boolean;                // hiç kritik çelişki yoksa true
  issues: ConsistencyIssue[];
  summary: string;
}

/**
 * Banka + SGK + niyet mektubu verilerini karşılaştırır; işveren adı, gelir,
 * işe giriş tarihi gibi alanlarda çelişki tespit eder.
 */
export async function askCrossConsistency(input: CrossConsistencyInput): Promise<CrossConsistencyResult> {
  // Ham metinleri kırp
  const trimmed: CrossConsistencyInput = {
    bank: input.bank ? { ...input.bank, rawText: input.bank.rawText?.slice(0, 2500) } : undefined,
    sgk:  input.sgk  ? { ...input.sgk,  rawText: input.sgk.rawText?.slice(0, 2500) } : undefined,
    letterData: input.letterData,
  };

  const prompt = `Sen vize dosyası çapraz kontrol analistisin. Aşağıdaki 3 kaynaktaki
(banka ekstresi, SGK 4A dökümü, niyet/işveren mektubu verisi) bilgileri karşılaştır ve
çelişkileri tespit et. Mektupta yazan işveren ile SGK'daki son işveren aynı mı?
Banka'daki düzenli maaş tutarı ile beyan edilen aylık gelir uyumlu mu?
İşe giriş tarihi SGK'da görünüyor mu?

Kaynaklar (JSON):
${JSON.stringify(trimmed, null, 2)}

ÇIKTI SADECE JSON:
{
  "ok": true | false,
  "issues": [
    {
      "severity": "critical | warn | info",
      "field": "Türkçe alan adı",
      "message": "Türkçe çelişki açıklaması — hangi kaynak ne diyor",
      "suggestion": "Türkçe düzeltme önerisi"
    }
  ],
  "summary": "1-2 cümle Türkçe genel değerlendirme"
}

Kurallar:
- Sadece gerçekten kaynakta olan verilerden çelişki üret; eksik alanı "issue" olarak yazma.
- severity=critical: otomatik ret tetikleyen uyumsuzluk (isim/işveren çelişkisi).
- severity=warn: açıklama istenebilir fark (%20+ gelir sapması gibi).
- Hiç çelişki yoksa issues=[] ve ok=true dön.`;

  const raw = await askAI(prompt);
  const parsed = extractJSON<CrossConsistencyResult>(raw);
  if (!parsed || !Array.isArray(parsed.issues)) {
    throw new Error('AI yanıtı beklenmedik formatta.');
  }
  return parsed;
}
