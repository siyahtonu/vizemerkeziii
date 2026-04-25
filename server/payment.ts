/**
 * VizeAkıl — iyzico Ödeme Entegrasyonu
 * ══════════════════════════════════════════════════════════
 * Türkiye için iyzipay (iyzico resmi Node.js SDK) kullanılır.
 * 3D Secure zorunludur, test modunda çalışır.
 *
 * Kullanım:
 *   1. .env.local'a IYZICO_API_KEY ve IYZICO_SECRET_KEY ekleyin
 *   2. npm run dev:server ile sunucuyu başlatın
 *   3. Frontend /api/payment/init çağırır → iyzico URL'ye yönlendirir
 */

import express from 'express';
import Iyzipay from 'iyzipay';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const router = express.Router();

// ── Güvenlik: JWT_SECRET zorunlu — eksikse sunucu başlamaz ───────────────
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret || jwtSecret.length < 32) {
  console.error('[HATA] JWT_SECRET .env.local dosyasında tanımlanmamış veya çok kısa (min 32 karakter). Sunucu durduruluyor.');
  process.exit(1);
}

// ── Kullanılmış callback token'ları (replay koruması) ─────────────────────
// iyzico'nun checkoutForm.retrieve'i aynı token için her zaman aynı başarılı
// sonucu döner; saldırgan token'ı ele geçirirse teorik olarak kendi tarayıcısı
// için tekrar JWT üretebilir. Bu Map tüketilmiş token'ları tutar (24 saat TTL).
//
// Token'lar SHA-256 hash'lenmiş olarak saklanır — sunucu disk imajı sızdığında
// bile ham token değerleri tek yönlü hash'ten geri çıkarılamaz (CWE-312 mitigasyon).
//
// Persistent: applications.json pattern'i ile JSON dosyaya da yazılır.
// Render restart/redeploy sonrasında pencere sıfırlanmasın diye. Multi-instance
// deployment'te bu yine yetersizdir; o zaman Redis/Postgres'e taşınmalı.
const TOKENS_FILE = path.join(__dirname, 'consumed-tokens.json');
const TOKEN_REPLAY_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 saat

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function loadConsumedTokens(): Map<string, number> {
  try {
    if (fs.existsSync(TOKENS_FILE)) {
      const raw = fs.readFileSync(TOKENS_FILE, 'utf-8');
      const arr = JSON.parse(raw) as Array<[string, number]>;
      const cutoff = Date.now() - TOKEN_REPLAY_WINDOW_MS;
      // Yüklerken eski kayıtları ele.
      // Geriye uyum: önceki sürüm raw token saklıyordu. SHA-256 hex 64 karakter;
      // başka uzunluktaki kayıtlar (ham token, tipik ~32-64 char) sessizce
      // dropped — yeni kayıtlar hash'li gelir.
      return new Map(
        arr.filter(([h, ts]) => ts >= cutoff && typeof h === 'string' && h.length === 64),
      );
    }
  } catch (e) {
    console.error('[payment] consumed-tokens.json okunamadı:', e);
  }
  return new Map();
}

const consumedTokens: Map<string, number> = loadConsumedTokens();

// I/O serileştirme — eş zamanlı iki callback persist çağırırsa son yazan kazanır
// ve race oluşur. Tek bir Promise zinciri ile yazımları sıraya alıyoruz.
// Ayrıca senkron writeFileSync yerine async fs.promises.writeFile kullanıyoruz —
// event loop bloke olmaz, ödeme callback latency'si artmaz.
let writeQueue: Promise<void> = Promise.resolve();

function persistConsumedTokens(): void {
  // Snapshot al ve sıraya ekle — sıradaki yazıcılar bu snapshot'tan sonra yazar.
  const snapshot = Array.from(consumedTokens.entries());
  writeQueue = writeQueue
    .then(() => fs.promises.writeFile(TOKENS_FILE, JSON.stringify(snapshot), 'utf-8'))
    .catch((e) => {
      console.error('[payment] consumed-tokens.json yazılamadı:', e);
    });
}

function isTokenConsumed(token: string): boolean {
  return consumedTokens.has(hashToken(token));
}

/**
 * Token'ı atomik olarak Map'e ekler. Zaten varsa false döner (replay).
 * Yeni eklendiğinde true döner. Bu fonksiyon JS'in single-threaded event loop
 * sayesinde aynı async tick içinde atomik. Eş zamanlı iki callback yarışında
 * ilk gelen true alır, ikincisi false ile erken çıkar.
 */
function tryConsumeToken(token: string): boolean {
  const h = hashToken(token);
  if (consumedTokens.has(h)) return false;
  consumedTokens.set(h, Date.now());
  // Temizlik: 24 saatten eski kayıtları at
  const cutoff = Date.now() - TOKEN_REPLAY_WINDOW_MS;
  for (const [k, ts] of consumedTokens) {
    if (ts < cutoff) consumedTokens.delete(k);
  }
  persistConsumedTokens();
  return true;
}

// ── iyzico istemcisi (lazy — API key yoksa /api/payment 503 döner) ────────
let iyzipayClient: Iyzipay | null = null;
function getIyzipay(): Iyzipay | null {
  if (iyzipayClient) return iyzipayClient;
  const apiKey = process.env.IYZICO_API_KEY;
  const secretKey = process.env.IYZICO_SECRET_KEY;
  if (!apiKey || !secretKey) return null;
  iyzipayClient = new Iyzipay({
    apiKey,
    secretKey,
    uri: process.env.IYZICO_ENV === 'production'
      ? 'https://api.iyzipay.com'
      : 'https://sandbox-api.iyzipay.com',
  });
  return iyzipayClient;
}

const paymentLimiter = rateLimit({ windowMs: 60_000, max: 5 });

// ── Buyer identityNumber helper (BDDK/iyzico uyumu) ──────────────────────
// iyzico buyer.identityNumber alanı 11 haneli string ister. Dijital hizmet
// satışında bu alan zorunlu görünüyor ama iyzico tarafında içerik doğrulanmıyor.
// Hardcoded '11111111111' test verisi PROD'DA KULLANILMAMALIDIR:
//   1. IYZICO_FALLBACK_IDENTITY env'ini gerçek bir kurumsal değerle set edin
//      (ör. şirket TCKN'si veya iyzico desteğinin onayladığı dummy)
//   2. Uzun vadeli çözüm: checkout form'unda kullanıcıdan TCKN alın ve buraya
//      iletin (payment/init body'sine `buyerIdentity` ekleyin).
//
// Bu helper env yoksa uyarı loglar, prod'da hemen fark edilir.
let _identityFallbackWarned = false;
function getBuyerIdentityNumber(): string {
  const env = process.env.IYZICO_FALLBACK_IDENTITY;
  if (env && /^\d{11}$/.test(env)) return env;
  if (!_identityFallbackWarned) {
    console.warn(
      '[payment] UYARI: IYZICO_FALLBACK_IDENTITY env tanımlı değil veya 11 hane değil. ' +
      'Dummy placeholder gönderiliyor — BDDK/iyzico uyumu için prod\'a çıkmadan düzeltin.'
    );
    _identityFallbackWarned = true;
  }
  return '00000000000'; // açıkça "geçersiz/placeholder" — eski '11111111111' yerine
}

// ── Plan tanımları ────────────────────────────────────────────────────────
const PLANS = {
  single: { name: 'VizeAkıl Tek Başvuru', price: '499.00', currency: 'TRY', durationDays: 90 },
  annual: { name: 'VizeAkıl Yıllık Pro',  price: '999.00', currency: 'TRY', durationDays: 365 },
} as const;

type PlanId = keyof typeof PLANS;

// ── POST /api/payment/init ────────────────────────────────────────────────
router.post('/init', paymentLimiter, async (req, res) => {
  const { planId, email, name, surname, ip } = req.body as {
    planId: PlanId; email: string; name: string; surname: string; ip?: string;
  };

  if (!planId || !PLANS[planId]) {
    return res.status(400).json({ error: 'Geçersiz plan.' });
  }
  if (!email || !name || !surname) {
    return res.status(400).json({ error: 'Ad, soyad ve e-posta zorunlu.' });
  }

  const plan = PLANS[planId];
  const conversationId = `va_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

  const request = {
    locale: 'tr',
    conversationId,
    price: plan.price,
    paidPrice: plan.price,
    currency: plan.currency,
    installment: '1',
    paymentChannel: 'WEB',
    paymentGroup: 'PRODUCT',
    callbackUrl: `${process.env.APP_URL}/api/payment/callback`,
    buyer: {
      id: `user_${Date.now()}`,
      name,
      surname,
      email,
      // iyzico "identityNumber" alanı dijital hizmet satışlarında doldurulması
      // gereken TCKN alanı. Gerçek TCKN'yi kullanıcıdan sormak (küçük kapsam
      // değişikliği) veya kurumsal varsayılan kullanmak gerekir. Bu değer
      // IYZICO_FALLBACK_IDENTITY env'inden gelir; tanımlı değilse anlaşılır
      // "belirtilmemiş" default'una düşer ve uyarı loglanır (prod'da hemen
      // fark edilsin diye).
      identityNumber: getBuyerIdentityNumber(),
      lastLoginDate: new Date().toISOString().replace('T', ' ').slice(0, 19),
      registrationDate: new Date().toISOString().replace('T', ' ').slice(0, 19),
      registrationAddress: 'Türkiye',
      ip: ip ?? req.ip ?? '127.0.0.1',
      city: 'Istanbul',
      country: 'Turkey',
      zipCode: '34000',
    },
    shippingAddress: { contactName: `${name} ${surname}`, city: 'Istanbul', country: 'Turkey', address: 'Türkiye', zipCode: '34000' },
    billingAddress:  { contactName: `${name} ${surname}`, city: 'Istanbul', country: 'Turkey', address: 'Türkiye', zipCode: '34000' },
    basketItems: [{
      id: planId,
      name: plan.name,
      category1: 'Dijital Hizmet',
      itemType: 'VIRTUAL',
      price: plan.price,
    }],
  };

  const iyzipay = getIyzipay();
  if (!iyzipay) {
    return res.status(503).json({ error: 'Ödeme servisi yapılandırılmamış (IYZICO_API_KEY eksik).' });
  }

  return new Promise<void>((resolve) => {
    iyzipay.checkoutFormInitialize.create(request, (err: unknown, result: Record<string, unknown>) => {
      if (err || result.status !== 'success') {
        // iyzico errorMessage iç referans / BIN ipucu içerebilir — client'a sızdırma.
        // Sadece sunucu loguna düşür, client'a generic mesaj döner.
        console.error('[/api/payment/init] iyzico hata:', err ?? result?.errorMessage ?? result?.errorCode);
        res.status(500).json({ error: 'Ödeme başlatılamadı. Lütfen daha sonra tekrar deneyin.' });
        return resolve();
      }
      res.json({
        checkoutFormContent: result.checkoutFormContent,
        token: result.token,
        conversationId,
      });
      resolve();
    });
  });
});

// ── POST /api/payment/callback ────────────────────────────────────────────
// iyzico ödeme sonucunu buraya gönderir (user-agent tarafından POST edilir).
// Replay koruma: aynı token ile tekrar JWT üretilmez; ilk başarılı kullanımdan
// sonra consumedTokens set'ine eklenir.
router.post('/callback', paymentLimiter, express.urlencoded({ extended: true }), async (req, res) => {
  const { token } = req.body as { token?: string };
  if (!token) return res.status(400).send('Token bulunamadı.');

  // Atomik check-and-set: token'ı iyzipay.retrieve ÖNCESİ işaretle. Eş zamanlı
  // iki callback aynı token ile gelirse ikinci denemenin tüm geri kalanı atlar.
  // (Bir önceki sürümde retrieve sonrası işaretlemek race açıyordu — iki callback
  // de iyzipay'e gidip iki ayrı JWT üretebiliyordu.) Token henüz Map'te değilse
  // ekleyip true döner; varsa false döner ve burada erken çıkılır.
  if (!tryConsumeToken(token)) {
    console.warn(`[payment] Replay denemesi tespit edildi (hash kısmi): ${hashToken(token).slice(0, 8)}...`);
    return res.redirect(`${process.env.APP_URL}/?payment=duplicate`);
  }

  const iyzipay = getIyzipay();
  if (!iyzipay) return res.status(503).send('Ödeme servisi yapılandırılmamış.');

  return new Promise<void>((resolve) => {
    iyzipay.checkoutForm.retrieve({ locale: 'tr', conversationId: '', token } as Parameters<typeof iyzipay.checkoutForm.retrieve>[0], (err: unknown, result: Record<string, unknown>) => {
      if (err || result.status !== 'success' || result.paymentStatus !== 'SUCCESS') {
        // iyzipay başarısız döndü — token zaten "consumed" olarak işaretli kaldı
        // (24h TTL ile silinecek). Saldırgan başarısız bir token'la spurious mark
        // tetikleyemez çünkü token iyzipay tarafından üretilen tek seferlik bir
        // değer; saldırgan bunu icat edemez.
        console.error('[/api/payment/callback] iyzico retrieve hata:', err ?? result?.errorCode);
        res.redirect(`${process.env.APP_URL}/?payment=failed`);
        return resolve();
      }

      // ── JWT premium token oluştur ─────────────────────────────────────
      const premiumToken = jwt.sign(
        { email: (result.buyer as Record<string, unknown>)?.email ?? '', plan: result.basketId, paid: true },
        jwtSecret,
        { expiresIn: '90d' }
      );

      // Token fragment (#) üzerinden iletilir — sunucu log'larına ve
      // HTTP Referer header'ına düşmez (fragment sunucuya gönderilmez)
      res.redirect(`${process.env.APP_URL}/?payment=success#token=${premiumToken}`);
      resolve();
    });
  });
});

// ── GET /api/payment/verify ───────────────────────────────────────────────
// Frontend her yüklenişte premium durumu doğrular
router.get('/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');
  if (!token) return res.json({ premium: false });

  try {
    const decoded = jwt.verify(token, jwtSecret) as { paid: boolean };
    return res.json({ premium: decoded.paid === true });
  } catch {
    return res.json({ premium: false });
  }
});

export default router;
