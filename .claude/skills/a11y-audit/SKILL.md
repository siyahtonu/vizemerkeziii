---
name: a11y-audit
description: VizeAkıl form-ağırlıklı UI için WCAG 2.2 AA erişilebilirlik denetimi. Semantic HTML, ARIA, klavye navigasyonu, focus management, renk kontrastı, Türkçe screen reader testi, skip-link, form label eşleşmesi, hata mesajı aria-describedby. Bir bileşen veya tüm sayfa için çalıştır.
---

# Kullanım

- "Accessibility denetim yap"
- "/basla sayfasını a11y için kontrol et"
- "Form validation mesajları screen reader'da duyuluyor mu?"

# Adımlar

## 1. Kapsam

Kullanıcı spesifik dosya verdiyse → Read → aşağıdaki kontrolleri uygula.
Genel denetim → `src/steps/`, `src/components/` tarayarak pattern kontrolü.

## 2. Semantic HTML

```bash
# div-soup tespiti: interactive elementler
grep -rn "onClick" src/components/ | grep -v "button\|Link\|<a " | head -20
```

Bulgular:
- `<div onClick>` → `<button>` olmalı (veya `role="button"` + `tabIndex={0}` + keyboard handler)
- `<span>` link olarak kullanılmış → `<a>` olmalı
- Başlık hiyerarşisi: h1 → h2 → h3 atlamasız. `grep -oE "<h[1-6]" src/pages/X.tsx`

## 3. Form etiketleri (VizeAkıl kritik)

```bash
grep -rn "<input" src/ | head -30
```

Her `<input>` için:
- `<label htmlFor="id">` eşleşmesi VAR mı, yoksa `aria-label` / `aria-labelledby`
- `id` unique mi (aynı form'da duplicate → WCAG fail)
- `required` → `aria-required="true"` (HTML5 yeterli ama belirt)
- Error: `aria-invalid="true"` + `aria-describedby="err-id"` bağlantısı

## 4. Keyboard navigation

Manuel test (mümkünse):
- Tab → tüm interactive element'e ulaşılıyor mu
- Shift+Tab → geri
- Enter/Space → activate
- Escape → modal/dropdown kapatıyor
- Arrow keys → radio group/combobox
- Tab order DOM order ile uyumlu (`tabIndex` > 0 yasak)

Kod:
- `tabIndex={-1}` programatik focus (OK)
- `tabIndex={0}` sadece native non-focusable'a (OK)
- `tabIndex={1+}` → **kaldır** (tab order'ı kırar)

## 5. Focus management

- Route change → `main` veya h1'e focus (screen reader odağı kaybetmesin)
- Modal açılınca → içeriye focus
- Modal kapanınca → tetikleyen butona geri
- `outline: none` kullanımı → `:focus-visible` için custom style olmalı, yoksa **kaldır**

```bash
grep -rn "outline.*none\|outline: 0" src/ | grep -v "focus-visible"
```

## 6. Renk kontrastı

WCAG AA eşikleri:
- Normal metin: **4.5:1**
- Büyük metin (18pt+ / 14pt bold+): **3:1**
- UI components & graphics: **3:1**

VizeAkıl'ın Tailwind 4 palette'i:
- Primary/background kombinasyonları denetlen
- `text-gray-400` üzerine beyaz BG → tipik fail
- Focus ring kontrastı: border ile 3:1 min

Araç: `tailwindcss-text-contrast` plugin veya manuel chrome DevTools contrast checker. Kod içinde yaklaşık listeyi çıkar, kullanıcıdan browser denetimi iste.

## 7. ARIA doğruluğu

Yaygın hatalar:
- `role="button"` + `<button>` (redundant, kaldır)
- `aria-hidden="true"` focusable element üstünde (FAIL — screen reader gizlendi ama tab hâlâ ulaşıyor)
- `aria-label` + görünür text (çakışma, görünür text yeterli)
- `role="alert"` sabit içerik (dynamic olmalı, sayfa yüklemede tetiklenmez)

```bash
grep -rn "role=" src/ | head -20
grep -rn "aria-" src/ | head -30
```

## 8. Skip link

`index.html` veya layout'ta:
```html
<a href="#main" class="sr-only focus:not-sr-only">İçeriğe atla</a>
<main id="main">...</main>
```
Mobile'de gözükmese bile klavye kullanıcısı için zorunlu.

## 9. Türkçe lang + yön

- `<html lang="tr">`
- Karışık dilli alıntılarda: `<span lang="en">...</span>`
- Screen reader Türkçe telaffuz: `aria-label` Türkçe
- Sayılar: binlik ayraç nokta, ondalık virgül (`1.234,56` TR)

## 10. Motion & animation

- `prefers-reduced-motion` respect mi? (framer-motion auto-honors ama kontrol et)
- Auto-playing animation 5s üstü → pause kontrolü olmalı
- Vestibular trigger'lar (parallax, ani slide): azalt

```bash
grep -rn "prefers-reduced-motion" src/
```

# Çıktı formatı

```markdown
## A11y Audit — <konum>

### ❌ BLOCKER (WCAG A/AA fail)
1. **<Kural>** — konum:satır — fix önerisi

### ⚠️ SERIOUS
...

### 💡 IMPROVEMENT
...

### ✅ İyi durumda
- <kısa liste>

### Metrikler
- Semantic score: X/10
- Form a11y: X/Y form
- Keyboard nav: pass/fail
- Skip link: var/yok

### Sıradaki adım
Kullanıcıya önerilen ilk 3 aksiyon, "hangisini düzelteyim?" sorusu.
```

# Yapma

- Otomatik fix yazma (preview yaz, kullanıcı onayı ile ilgili agent uygulasın)
- `axe-core` runtime çağrısı — yok. Önermek OK ama kurmayı kullanıcıya bırak.
- Lighthouse a11y score'unu tek metrik olarak sunma — yüzeysel
- Overengineer: `role="main"` zaten `<main>`'de var