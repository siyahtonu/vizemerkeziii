/**
 * VizeAkıl — İletişim Formu Endpoint'i
 * ═══════════════════════════════════════════════════════
 * POST /api/contact
 * Frontend iletişim formundan gelen mesajı, CONTACT_TO adresine
 * SMTP üzerinden iletir. Mevcut SMTP yapılandırmasını (outcomes.ts
 * ile aynı) yeniden kullanır.
 */

import express, { Router } from 'express';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';

const router: Router = express.Router();

// ── SMTP Transport (outcomes.ts ile aynı pattern) ────────────────────────────
function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT ?? '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  return nodemailer.createTransport({
    host, port,
    secure: port === 465,
    auth: { user, pass },
    // TLS sertifika doğrulaması aktif — standart SMTP sağlayıcıları (Gmail,
    // Sendgrid, Amazon SES, vs.) için varsayılan. Kurumsal self-signed CA
    // kullanılıyorsa SMTP_TLS_ALLOW_SELF_SIGNED=1 env'iyle açılabilir.
    tls: {
      rejectUnauthorized: process.env.SMTP_TLS_ALLOW_SELF_SIGNED !== '1',
    },
  });
}

// İletişim formu için saldırı/spam koruması: IP başına 5 dakikada 3 mesaj.
const contactLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Çok fazla mesaj gönderdiniz. Lütfen 5 dakika sonra tekrar deneyin.' },
});

// HTML escape — kullanıcı girdisi mail body'sine inject edilmeden önce
function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ── POST /api/contact ────────────────────────────────────────────────────────
router.post('/', contactLimiter, async (req, res) => {
  const { name, email, subject, message } = (req.body ?? {}) as {
    name?: string; email?: string; subject?: string; message?: string;
  };

  // Validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Tüm alanlar zorunludur.' });
  }
  if (typeof name !== 'string' || name.length > 120) {
    return res.status(400).json({ error: 'Ad geçersiz.' });
  }
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) {
    return res.status(400).json({ error: 'Geçerli bir e-posta adresi girin.' });
  }
  if (typeof subject !== 'string' || subject.length > 200) {
    return res.status(400).json({ error: 'Konu geçersiz.' });
  }
  if (typeof message !== 'string' || message.length < 5 || message.length > 5000) {
    return res.status(400).json({ error: 'Mesaj 5-5000 karakter arasında olmalı.' });
  }

  const transporter = createTransporter();
  if (!transporter) {
    console.error('[contact] SMTP yapılandırması eksik — mesaj gönderilemedi.');
    return res.status(503).json({ error: 'Mesaj servisi şu an kullanılamıyor.' });
  }

  // CONTACT_TO zorunlu — hardcoded fallback yok (kişisel e-postaya sızıntı engeli)
  const to = process.env.CONTACT_TO;
  if (!to) {
    console.error('[contact] CONTACT_TO env değişkeni tanımlı değil — mesaj gönderilemedi.');
    return res.status(503).json({ error: 'Mesaj servisi şu an kullanılamıyor.' });
  }
  const fromAddr = process.env.SMTP_USER!;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1e3a5f; color: white; padding: 20px; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 18px;">📬 VizeAkıl İletişim Formu</h1>
      </div>
      <div style="background: #f8fafc; padding: 20px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; color: #64748b; width: 110px;">Gönderen:</td>
            <td style="padding: 8px 0; color: #0f172a; font-weight: bold;">${esc(name)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">E-posta:</td>
            <td style="padding: 8px 0; color: #0f172a;">
              <a href="mailto:${esc(email)}" style="color: #1e40af;">${esc(email)}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Konu:</td>
            <td style="padding: 8px 0; color: #0f172a;">${esc(subject)}</td>
          </tr>
        </table>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; white-space: pre-wrap; color: #334155; line-height: 1.6;">${esc(message)}</div>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 16px;">
          Bu mesaj vizeakil.com/iletisim formundan gönderildi.
        </p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"VizeAkıl İletişim" <${fromAddr}>`,
      to,
      replyTo: email,
      subject: `[İletişim] ${subject}`,
      html,
      text: `Gönderen: ${name} <${email}>\nKonu: ${subject}\n\n${message}`,
    });
    return res.json({ ok: true });
  } catch (err: unknown) {
    console.error('[contact] Mail gönderilemedi:', err);
    return res.status(500).json({ error: 'Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyin.' });
  }
});

export default router;
