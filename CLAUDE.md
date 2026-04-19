# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

VizeAkıl — Türk vatandaşları için Schengen / İngiltere / ABD vize başvuru profil değerlendirme uygulaması. AI destekli skorlama, ret riski tahmini, başvuru taktikleri ve kapak mektubu üretir. Kullanıcıya yönelik metinler **Türkçe** yazılır; kod yorumları da büyük ölçüde Türkçedir, bu konvansiyonu koruyun.

## Commands

```bash
npm run dev              # Vite frontend (port 3000)
npm run dev:server       # Express API (port 3001) — tsx watch ile hot reload
npm run build            # Production build → dist/
npm run lint             # tsc --noEmit (type-check)
npm run test             # Vitest tek seferlik
npm run test:watch       # Vitest watch mode
npm run test:coverage    # Coverage (yalnızca src/scoring/**)
```

Tek bir test dosyası çalıştırma: `npx vitest run src/scoring/__tests__/core.test.ts`

Geliştirme için iki süreç birlikte çalışmalı: `npm run dev` (frontend) **ve** `npm run dev:server` (API). Vite, `/api/*` isteklerini `localhost:3001`'e proxy eder ([vite.config.ts](vite.config.ts)).

## Architecture — büyük resim

İki ayrı deploy hedefi vardır:
- **Frontend**: Statik SPA (Render — `render.yaml`, `staticPublishPath: ./dist`) → `vizeakil.com`
- **Backend**: Express API → `api.vizeakil.com`. CORS allow-list [server/index.ts](server/index.ts) içinde sabit. Frontend, `VITE_API_URL` env'i ile API'ye yönlendirilir; tanımsızsa relative `/api` (dev proxy senaryosu) kullanır → [src/lib/api.ts](src/lib/api.ts).

### Frontend yapısı

- **[src/main.tsx](src/main.tsx)** — Tek BrowserRouter; sayfaların **tamamı `lazy()` ile code-split** edilmiştir. Yeni sayfa eklerken hem `lazy import` hem `<Route>` ekleyin. `App` aynı tek bileşendir ve `/`, `/basla`, `/sonuc`, `/panel`, `/mektup`, `/taktikler` route'larını **tümü** render eder — adım yönetimini içeride yapar.
- **[src/App.tsx](src/App.tsx)** — ~6800 satır, ana akış: Assessment → Dashboard → Tactics → Letter. Bu dosya bilinçli olarak büyüktür; **bölmeden önce sahibine sorun**. Adım bileşenleri zaten [src/steps/](src/steps/) altında ayrı, ama orkestrasyon ve `ProfileData` state'i `App.tsx`'tedir.
- **[src/steps/](src/steps/)** — 4 adım bileşeni (`AssessmentStep`, `DashboardStep`, `TacticsStep`, `LetterStep`).
- **[src/components/](src/components/)** — Widget'lar (RejectionRisk, Seasonal, WhatIf, Radar, Compare vb.) ve `ErrorBoundary`, `SEO`, `ScrollToTop` gibi altyapı bileşenleri.
- **Build chunking**: [vite.config.ts](vite.config.ts) `vendor-react`, `vendor-motion`, `vendor-pdf`, `vendor-icons`, `vendor-helmet` olarak bölünmüş manuel chunk'lara sahip — yeni ağır bağımlılık eklerken chunk haritasına ekleyin.

### Skorlama motoru — kritik bölge

Tüm skorlama mantığı **[src/scoring/](src/scoring/)** altındadır ve **versiyonlanmıştır** (şu an v3.x). Hesaplamayı App.tsx içinde inline yazmayın; her zaman `core.ts`'teki fonksiyonları çağırın.

Final skor 5 katmanlı bir pipeline'dır ([core.ts:185-227](src/scoring/core.ts#L185)):

1. **`calculateRawScore`** — 8 bölümlü kural tabanlı 0-100 ham puan (finansal, mesleki, bağlar, seyahat, başvuru, güven, ülke özel, veto cap'leri). Bölüm 8 (`vetoCap`) son dakika mevduat / overstay gibi kritik durumlarda skoru üst sınırla zorla kırpar.
2. **Bayes blending** — `(raw/100) * 0.65 + (1 - trRejRate) * 0.35` ile [matrices.ts](src/scoring/matrices.ts) `TR_REJECTION_RATES` tablosu kullanılarak ülke baz hızıyla harmanlanır.
3. **`getProfileCountryFactor`** — segment × ülke matrisi.
4. **Konsolosluk kalibrasyonu** — `applicantCity` varsa şehir → konsolosluk zone → ruh hali çarpanı.
5. **Mevsimsellik** — `applyMonth` varsa ay/yıl × ülke kalibrasyonu (max ±%8 etki).

`calculateScoreDetailed` UI'da "Neden bu skor?" breakdown'u için katmanları ayrı döner. Skorlama değişiklikleri [src/scoring/__tests__/](src/scoring/__tests__/) altındaki snapshot/regresyon testlerini etkileyebilir — `npm test` çalıştırın.

`temporalDecay` ([algorithms.ts:22](src/scoring/algorithms.ts#L22)) konvansiyonu: `eventYear === -1` "hiç yok" demektir (0 ağırlık), `0` "bilinmiyor" demektir (5 yıl varsayımı, yarı ağırlık). Yeni kod yazarken bu konvansiyona uyun.

`getReturnTieMultiplier` ([algorithms.ts:35](src/scoring/algorithms.ts#L35)) sıralaması önemli: 55+ yaş kontrolü, "evli + çocuklu" kontrolünden **önce** gelmelidir, aksi halde 55+ aile babası fazladan ceza alır.

### Ret risk algoritması

[src/lib/rejectionRiskV2.ts](src/lib/rejectionRiskV2.ts) — n=2077 vakaya dayalı ampirik ağırlıklarla bağımsız bir ret olasılığı hesaplar. Skorlama motorundan ayrıdır; ikisi tutarlı kalmalı — [src/lib/__tests__/rejectionRiskV2.consistency.test.ts](src/lib/__tests__/rejectionRiskV2.consistency.test.ts) bu eşleşmeyi doğrular.

### Backend

[server/index.ts](server/index.ts) router'ları yükler:
- `/api/ai` — Claude Sonnet 4.6 proxy'si (`@anthropic-ai/sdk`). `ANTHROPIC_API_KEY` **yalnızca sunucuda** tutulur, asla client'a sızmamalı. AI mektup/taktik üretimi buradan geçer.
- `/api/payment` — Iyzipay entegrasyonu
- `/api/appointments` — node-cron ile randevu izleyici
- `/api/outcomes` — kullanıcı geri bildirim havuzu (feedback loop)
- `/api/contact` — nodemailer ile iletişim formu
- Genel `apiLimiter`: IP başına 60 sn'de 10 istek

[server/env.ts](server/env.ts) **diğer tüm sunucu modüllerinden önce import edilmelidir** (ESM hoisting). `index.ts` üst satırında `import './env.js'` korunmalı.

## Konvansiyonlar

- **Türkçe** kullanıcı metni ve kod yorumları korunur.
- Yorumlar `// ── Başlık ─────` ASCII çerçeve ile bölümlendirilir; mevcut stile uyun.
- Yeni blog/rehber sayfası eklerken: `src/pages/blog/` altına bileşen + `main.tsx` içinde `lazy import` + `<Route>` ekleyin. Tüm sayfalar `react-helmet-async` ile kendi SEO meta'sını yönetir.
- Backend `.js` extension'ı ile import edilir (`./payment.js`) — TypeScript ESM resolution gereği, kaynak `.ts` olsa bile.
- Skorlama formülünde değişiklik testleri kırarsa: hem yeni davranış doğru kabul edildiğinde fixture'ı güncelleyin hem de matrix/algoritma değişikliklerini commit mesajında dokümante edin (mevcut commit log'daki `feat(scoring):` formatına bakın).

## Env değişkenleri

`.env.local` dosyasında (gitignore'lu):
- `ANTHROPIC_API_KEY` — backend için zorunlu (Claude API anahtarı)
- `VITE_API_URL` — production frontend build'inde backend origin'i (örn. `https://api.vizeakil.com`); dev'de boş bırakılır
- Iyzipay, SMTP ve `x-admin-secret` / `x-check-secret` gibi sırlar ilgili router dosyalarında okunur
