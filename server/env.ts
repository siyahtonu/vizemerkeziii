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
// Kritik secret'lar eksikse:
//   - production: fail-fast, süreç kapanır (yanlış deploy'u engeller)
//   - development: sadece uyarı logu (her dev ortamında tümü gerekmeyebilir)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const REQUIRED_IN_PROD = [
  'DEEPSEEK_API_KEY',    // /api/ai proxy (DeepSeek OpenAI-uyumlu chat completions)
  'JWT_SECRET',          // payment premium token'ı
  'ADMIN_SECRET',        // admin endpoint'leri (outcomes, rates, appointments, answena)
  'CHECK_SECRET',        // outcomes check script
  'IYZICO_API_KEY',      // ödeme entegrasyonu
  'IYZICO_SECRET_KEY',   // ödeme entegrasyonu
  'APP_URL',             // payment callback ve redirect URL'lerinde kullanılır
  'CONTACT_TO',          // iletişim formu hedef e-posta (yoksa 503 dönüyor zaten)
  'SMTP_HOST',           // tüm e-posta gönderimleri (contact, outcomes, appointment)
  'SMTP_USER',
  'SMTP_PASS',
] as const;

const missing = REQUIRED_IN_PROD.filter((k) => !process.env[k]);
if (missing.length > 0) {
  if (process.env.NODE_ENV === 'production') {
    console.error(
      `[env] KRİTİK: Aşağıdaki env değişkenleri tanımlı değil, üretim başlatılamıyor:\n  - ${missing.join('\n  - ')}`
    );
    process.exit(1);
  } else {
    console.warn(
      `[env] Uyarı: Aşağıdaki env değişkenleri eksik (geliştirmede izin verilir, üretime çıkmadan tanımlayın):\n  - ${missing.join('\n  - ')}`
    );
  }
}
