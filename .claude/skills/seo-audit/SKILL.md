---
name: seo-audit
description: VizeAkıl blog ve sayfa SEO denetimi. Meta/canonical/OG/Twitter card, JSON-LD şema doğrulama, title+description uzunluk, sitemap.xml tutarlılık, internal link sayımı, Türkçe anahtar kelime yoğunluğu, AEO için FAQ şeması, orphan page tespiti. Belirli sayfa(lar) için veya toplu denetim için çalıştır.
---

# Kullanım

Bu skill'i kullanıcı aşağıdaki gibi tetikler:

- "SEO denetim yap" (tüm site)
- "Şu blog post'u SEO için denetle: src/pages/blog/Foo.tsx"
- "Sitemap ile route'lar eşleşiyor mu?"
- "Eksik canonical'ları bul"

# Adımlar

## 1. Kapsamı belirle

Kullanıcı bir sayfa verdiyse → sadece o. Yoksa → toplu tarama:

```bash
# Tüm route'ları listele
grep -h "path=" src/main.tsx | head -50
```

## 2. Meta hijyen (tek sayfa)

Read ile dosyayı aç, `<Helmet>` bloğunu bul. Kontrol:

| Alan | Kural | Araç |
|------|-------|------|
| `<title>` | 55-60 karakter, marka sonda ("...\| VizeAkıl") | Edit'le düzelt |
| `<meta name="description">` | 150-160 karakter, CTA | |
| `<link rel="canonical">` | Mutlak URL, `https://vizeakil.com/...` | |
| `<html lang="tr">` | index.html kontrol et | |
| `og:title/description/image/url` | Hepsi var mı | |
| `twitter:card` | `summary_large_image` | |

## 3. JSON-LD şema

Blog post için zorunlu şemalar:

```jsonld
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "...",
  "author": { "@type": "Person", "name": "..." },
  "datePublished": "2026-04-01",
  "dateModified": "2026-04-24",
  "image": "https://vizeakil.com/og/...",
  "publisher": {
    "@type": "Organization",
    "name": "VizeAkıl",
    "logo": { "@type": "ImageObject", "url": "https://vizeakil.com/logo.png" }
  }
}
```

Eğer sayfada FAQ bölümü varsa + `FAQPage` schema:

```jsonld
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "...",
    "acceptedAnswer": { "@type": "Answer", "text": "..." }
  }]
}
```

Kontrol: Her blog post'ta Article + BreadcrumbList + (FAQ varsa) FAQPage olmalı.

## 4. Sitemap tutarlılık

```bash
# Route'lar vs sitemap.xml karşılaştır
grep -oE 'path="[^"]+"' src/main.tsx | sort -u > /tmp/routes.txt
grep -oE '<loc>https://vizeakil\.com[^<]+</loc>' public/sitemap.xml | sed 's|<loc>https://vizeakil.com||' | sed 's|</loc>||' | sort -u > /tmp/sitemap.txt
diff /tmp/routes.txt /tmp/sitemap.txt
```

- Route'da var, sitemap'te yok → **ekle**
- Sitemap'te var, route'da yok → **kaldır** (404 sinyali SEO'ya zararlı)

## 5. Internal link sayımı

```bash
# Bir blog post'ta kaç internal link var
grep -oE 'to="/[^"]*"' src/pages/blog/Foo.tsx | wc -l
```

Hedef: **her blog post en az 3 internal link** (ilgili post veya ana CTA `/basla`).

## 6. Orphan detection

Hangi sayfalara hiç link yok?

```bash
# Tüm <Link to="/..."> toplam listesi
grep -rhoE 'to="/[^"]+"' src/ | sort -u > /tmp/linked.txt
# Route listesi ile fark
comm -23 /tmp/routes.txt /tmp/linked.txt
```

Çıkanlar orphan → iç linklenmeli.

## 7. Türkçe anahtar kelime yoğunluğu

Blog post için target keyword tek olmalı. H1'de, ilk 100 kelimede, H2'lerden birinde, URL slug'ında geçsin. Ama **stuffing yapma** (%1-2 density hedef).

## 8. robots.txt + llms.txt

```bash
# AI crawler'lar allow mu?
grep -E "GPTBot|ClaudeBot|PerplexityBot|Google-Extended" public/robots.txt
```

`llms.txt` güncel mi — ana sayfalar listelenmiş mi?

## 9. Core Web Vitals bağlantısı

LCP/INP/CLS SEO sinyali — sorun varsa `performance-engineer` agent'a bildir, kendi başına optimize etme.

# Çıktı formatı

```markdown
## SEO Audit — <sayfa adı veya "site geneli">

### ✅ İyi
- (3-5 madde)

### ⚠️ Düzeltilmeli (öncelik sırasıyla)
1. **[P0] <başlık>** — konum:satır — ne yapmalı (1-2 cümle)
2. **[P1] ...**
3. **[P2] ...**

### 📊 Metrikler
- Meta tag skoru: X/10
- Şema kapsamı: X/Y sayfa
- Internal link ort: X/sayfa
- Orphan sayfa: N

### 🔧 Önerilen aksiyon
Kullanıcıya tek cümle özet + "devam edeyim mi" sorusu.
```

# Yapma

- 3rd-party SEO API çağrısı (Semrush, Ahrefs) — ücretli, önerme
- On-page content rewrite — sadece öner, yazma (o `seo-specialist` işi)
- Skor manipülasyonu (cloaking, hidden text) — yasak
- Aşırı keyword stuffing önerisi