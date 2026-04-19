import { apiUrl } from './api';
import type { ProfileData } from '../types';

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
