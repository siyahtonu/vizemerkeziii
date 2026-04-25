/**
 * .env.local yükleyici — diğer modüllerden ÖNCE import edilmeli.
 * ESM'de import hoisting nedeniyle module-level env.* okumaları bundan önce çalışırdı,
 * bu dosya side-effect ile dotenv.config'i import'lardan önce tetikler.
 */
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// ── Startup validation ─────────────────────────────────────────────────────
// İki kategori:
//
//   REQUIRED (HARD FAIL) — bu eksikse sunucu çalışmaz. Çekirdek özellikler
//   bunlara bağlı (AI proxy, JWT, admin endpoint'leri).
//
//   RECOMMENDED (SOFT WARN) — eksik olabilir; ilgili özellikler 503 döner
//   ama sunucu ayağa kalkar. Iyzico, SMTP, contact gibi opsiyonel modüller.
//   Henüz iyzico üyeliği veya SMTP yapılandırması olmayan deploy'lar için.
const REQUIRED_IN_PROD = [
  'DEEPSEEK_API_KEY',    // /api/ai proxy (DeepSeek OpenAI-uyumlu chat completions)
  'JWT_SECRET',          // payment premium token'ı imzalama
  'ADMIN_SECRET',        // admin endpoint'leri (outcomes, rates, appointments, answena)
  'CHECK_SECRET',        // outcomes check script (cron tetikleme)
] as const;

const RECOMMENDED_IN_PROD = [
  'IYZICO_API_KEY',      // /api/payment — yoksa ödeme akışı 503
  'IYZICO_SECRET_KEY',
  'APP_URL',             // payment callback URL — yoksa redirect bozuk olur
  'CONTACT_TO',          // /api/contact — yoksa iletişim formu 503
  'SMTP_HOST',           // tüm e-posta gönderimleri (contact, outcomes follow-up, randevu bildirimi)
  'SMTP_USER',
  'SMTP_PASS',
] as const;

const missingRequired = REQUIRED_IN_PROD.filter((k) => !process.env[k]);
const missingRecommended = RECOMMENDED_IN_PROD.filter((k) => !process.env[k]);

if (missingRequired.length > 0) {
  if (process.env.NODE_ENV === 'production') {
    console.error(
      `[env] KRİTİK: Aşağıdaki ZORUNLU env değişkenleri tanımlı değil, üretim başlatılamıyor:\n  - ${missingRequired.join('\n  - ')}`
    );
    process.exit(1);
  } else {
    console.warn(
      `[env] Uyarı: Aşağıdaki zorunlu env değişkenleri eksik (geliştirmede izin verilir):\n  - ${missingRequired.join('\n  - ')}`
    );
  }
}

if (missingRecommended.length > 0) {
  console.warn(
    `[env] Bilgi: Aşağıdaki opsiyonel env değişkenleri tanımlı değil — ilgili özellikler devre dışı (sunucu çalışmaya devam eder):\n  - ${missingRecommended.join('\n  - ')}`
  );
}
