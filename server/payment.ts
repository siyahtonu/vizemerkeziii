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

const router = express.Router();

// ── Güvenlik: JWT_SECRET zorunlu — eksikse sunucu başlamaz ───────────────
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret || jwtSecret.length < 32) {
  console.error('[HATA] JWT_SECRET .env.local dosyasında tanımlanmamış veya çok kısa (min 32 karakter). Sunucu durduruluyor.');
  process.exit(1);
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
      identityNumber: '11111111111', // test için
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
        res.status(500).json({ error: 'Ödeme başlatılamadı.', detail: result?.errorMessage });
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
// iyzico ödeme sonucunu buraya gönderir
router.post('/callback', express.urlencoded({ extended: true }), async (req, res) => {
  const { token } = req.body as { token?: string };
  if (!token) return res.status(400).send('Token bulunamadı.');

  const iyzipay = getIyzipay();
  if (!iyzipay) return res.status(503).send('Ödeme servisi yapılandırılmamış.');

  return new Promise<void>((resolve) => {
    iyzipay.checkoutForm.retrieve({ locale: 'tr', conversationId: '', token } as Parameters<typeof iyzipay.checkoutForm.retrieve>[0], (err: unknown, result: Record<string, unknown>) => {
      if (err || result.status !== 'success' || result.paymentStatus !== 'SUCCESS') {
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
