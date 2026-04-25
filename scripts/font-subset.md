# Roboto Font Subset (PDF üretimi için)

## Sorun

`public/fonts/Roboto-Regular.ttf` ve `Roboto-Bold.ttf` toplam **~310 KB**.
Bu dosyalar PDF üretimi sırasında runtime'da fetch edilir; ilk PDF tıklamasında
mobil 4G'de **~200ms gecikme** yaşanıyor.

## Çözüm

Sadece Türkçe + Latin Extended-A karakterlerini içeren subset oluştur.
Dosyalar **~30-50 KB**'a düşer; gecikme **~30ms**'ye iner.

## Gereksinimler

- Python 3.8+
- `fonttools` kütüphanesi

```bash
pip install fonttools brotli
```

## Subset oluşturma

```bash
# Regular
pyftsubset public/fonts/Roboto-Regular.ttf \
  --output-file=public/fonts/Roboto-Regular.subset.ttf \
  --unicodes=U+0000-007F,U+00A0-024F,U+1E00-1EFF,U+2000-206F,U+2070-209F,U+20A0-20CF,U+2100-214F,U+2190-21FF,U+2200-22FF,U+2300-23FF \
  --layout-features=kern,liga,clig,locl \
  --no-hinting \
  --desubroutinize

# Bold
pyftsubset public/fonts/Roboto-Bold.ttf \
  --output-file=public/fonts/Roboto-Bold.subset.ttf \
  --unicodes=U+0000-007F,U+00A0-024F,U+1E00-1EFF,U+2000-206F,U+2070-209F,U+20A0-20CF,U+2100-214F,U+2190-21FF,U+2200-22FF,U+2300-23FF \
  --layout-features=kern,liga,clig,locl \
  --no-hinting \
  --desubroutinize

# Eski TTF'leri yedekle, subset'i isim değiştirip aktif et
mv public/fonts/Roboto-Regular.ttf public/fonts/Roboto-Regular.full.ttf
mv public/fonts/Roboto-Bold.ttf public/fonts/Roboto-Bold.full.ttf
mv public/fonts/Roboto-Regular.subset.ttf public/fonts/Roboto-Regular.ttf
mv public/fonts/Roboto-Bold.subset.ttf public/fonts/Roboto-Bold.ttf
```

## Unicode aralıkları açıklama

- `U+0000-007F` — Basic Latin (a-z, A-Z, 0-9, ASCII)
- `U+00A0-024F` — Latin-1 Supplement + Latin Extended-A
  - **Türkçe karakterler buradadır**: ı (U+0131), İ (U+0130), Ğ/ğ (U+011E/011F), Ş/ş (U+015E/015F), Ç/ç (U+00C7/00E7), Ö/ö (U+00D6/00F6), Ü/ü (U+00DC/00FC)
- `U+1E00-1EFF` — Latin Extended Additional (nadir aksanlı harfler)
- `U+2000-206F` — Genel Tipografi (em-dash, en-dash, smart quotes)
- `U+2070-209F` — Üst/alt indis sayılar
- `U+20A0-20CF` — Para birimleri (€, ₺, $, £)
- `U+2100-214F` — Harf benzeri semboller (©, ®, ™)
- `U+2190-21FF` — Oklar (→, ←, ↑, ↓)
- `U+2200-22FF` — Matematik operatörler
- `U+2300-23FF` — Çeşitli teknik

## Doğrulama

```bash
ls -la public/fonts/Roboto-*.ttf
# Beklenen: Regular ~30-50 KB, Bold ~30-50 KB
file public/fonts/Roboto-Regular.ttf  # → "TrueType Font data"
```

PDF üretiminde Türkçe karakterler hâlâ doğru render olmalı:
- Test: Hero → Tahmini Maliyet aç → İtalya seç → "PDF olarak indir"
- PDF'i aç, "İtalya için" başlığında "İ" doğru gözükmeli.

## Otomasyon (opsiyonel CI)

`package.json` script'i:
```json
"scripts": {
  "fonts:subset": "pyftsubset public/fonts/Roboto-Regular.full.ttf --output-file=public/fonts/Roboto-Regular.ttf --unicodes='U+0000-007F,U+00A0-024F,U+1E00-1EFF,U+2000-23FF' --no-hinting --desubroutinize && pyftsubset public/fonts/Roboto-Bold.full.ttf --output-file=public/fonts/Roboto-Bold.ttf --unicodes='U+0000-007F,U+00A0-024F,U+1E00-1EFF,U+2000-23FF' --no-hinting --desubroutinize"
}
```

CI ortamında Python + fonttools kurulu değilse skip edilebilir.
