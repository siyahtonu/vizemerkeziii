---
name: scoring-regression
description: VizeAkıl skorlama motoru (src/scoring/, v3.10, 5 katmanlı pipeline) değişikliklerini analiz eder. Katman çift sayımı, veto cap sıralaması, PROFILE_COUNTRY_MATRIX artığı, temporalDecay konvansiyon ihlali, getReturnTieMultiplier sıralama hatası gibi yaygın regresyonları tespit eder. Skorlama dosyası değiştiğinde veya PR'dan önce çalıştır.
---

# Kullanım

- "Skorlama motorunda ne değişti?"
- "src/scoring/core.ts son commit'te değişti, regresyon var mı?"
- "Yeni katman ekledim, çift sayım var mı?"

# Adımlar

## 1. Diff'i al

```bash
# Staged + unstaged
git diff HEAD -- src/scoring/ | head -300

# Son commit'te değişenler
git log --oneline -10 -- src/scoring/
git show <hash> -- src/scoring/

# Spesifik dosya
git diff HEAD src/scoring/core.ts
```

## 2. Kritik kural kontrolü (CLAUDE.md özel)

### A. Katman sıralaması (5 katmanlı pipeline)

```
1. calculateRawScore (0-100 ham)
2. Lineer kalibrasyon: (raw/100)*0.65 + (1-trRejRate)*0.35
3. getProfileSegmentFactor (segment çarpanı)
4. applyMonth (mevsim ±%3)
5. computeVetoCap (final hard ceiling)
```

**YANLIŞ**: çarpanlar veto cap'ten sonra uygulanıyor → hard ceiling aşılır.
**YANLIŞ**: ülke sinyali Katman 2 dışında yerde (çift sayım).

Kontrol:
```bash
grep -n "calculateRawScore\|applyMonth\|computeVetoCap\|getProfileSegmentFactor" src/scoring/core.ts
```
Sıralama bu sırada mı? Sonda `computeVetoCap` var mı?

### B. v3.10'da kaldırılanlar

Bu referanslar artık OLMAMALI:
- `PROFILE_COUNTRY_MATRIX` (7×16 matris kaldırıldı, segment factor'a evrildi)
- Konsolosluk mood çarpanı skoru değiştirme (sadece UI)

```bash
grep -rn "PROFILE_COUNTRY_MATRIX" src/
grep -rn "consulateAdjustment.*\*" src/scoring/   # UI'da OK, core.ts'te yasak
```

Varsa → **regresyon**. Kullanıcıya bildir, kaldırmayı öner.

### C. `temporalDecay` konvansiyonu

[algorithms.ts:22](src/scoring/algorithms.ts#L22):
- `eventYear === -1` → "hiç yok" → 0 ağırlık
- `eventYear === 0` → "bilinmiyor" → 5 yıl varsayım, yarı ağırlık
- Pozitif → actual year

Kontrol:
```bash
grep -B2 -A15 "temporalDecay" src/scoring/algorithms.ts
```

Yeni callsite `-1` / `0` ayrımını doğru yapıyor mu?

### D. `getReturnTieMultiplier` sıralaması

[algorithms.ts:35](src/scoring/algorithms.ts#L35):
**55+ yaş** kontrolü, **evli+çocuklu** kontrolünden **ÖNCE** gelmeli. Aksi halde 55+ aile babası fazla ceza alır.

```bash
grep -A 30 "getReturnTieMultiplier" src/scoring/algorithms.ts
```

### E. Ret risk tutarlılık

`src/lib/rejectionRiskV2.ts` ile `src/scoring/` kopuk olabilir ama `src/lib/__tests__/rejectionRiskV2.consistency.test.ts` eşleşmeyi doğrular.

```bash
npx vitest run src/lib/__tests__/rejectionRiskV2.consistency.test.ts
```

Kırılırsa: hangi profilde ayrışıyor, neden?

## 3. Etki analizi

Diff'ten değişen fonksiyonları listele. Her biri için:

```bash
# Bu fonksiyon nerelerden çağrılıyor?
grep -rn "functionName" src/ --include="*.ts" --include="*.tsx" | head
```

Caller'ları etkiliyor mu? Özellikle:
- `App.tsx` → UI breakdown ("Neden bu skor?")
- `rejectionRiskV2.ts` → consistency test

## 4. Test çalıştır

```bash
npm test                                   # full
npx vitest run src/scoring/__tests__/      # sadece scoring
npx vitest run --coverage src/scoring      # coverage
```

Failing test varsa:
- Expected değişti mi (intentional)? → fixture güncelle + commit mesajında belgele
- Kod bozuk mu? → geri al

## 5. Skor dağılımı smoke test

Synthetic profil grubunda skor dağılımı dramatik değişti mi?

```bash
# (varsa) fixture dataset çalıştır
node --import tsx scripts/score-distribution.ts
```

Eğer script yoksa: "bu araç yok, önerim: N profilin ham skoru + final skor'u before/after karşılaştıran mini script ekle" — kullanıcıya sor.

## 6. Commit mesajı kontrolü

Skorlama değişiklikleri için konvansiyon:
```
feat(scoring): <ne>

- Katman X: <değişiklik>
- Kırılan fixture: <hangisi>, neden (haklı/değil)
- Etki: <ortalama skor ±X puan>
```

Boş/generic mesaj → kullanıcıya uyar.

# Çıktı formatı

```markdown
## Scoring Regression Analizi

### Değişen dosyalar
- src/scoring/core.ts (+N -M)
- src/scoring/matrices.ts (...)

### Tespit edilen regresyonlar
❌ **[KRİTİK] veto cap sıralaması bozuldu** — core.ts:124
   applyMonth, computeVetoCap'ten sonra geliyor → hard ceiling aşılıyor.
   Fix: sıralama 1→2→3→4→5 olmalı.

❌ **[YÜKSEK] PROFILE_COUNTRY_MATRIX referansı kaldı** — algorithms.ts:87
   v3.10'da kaldırıldı. Bu satırı sil.

⚠️ **[ORTA] Test fixture 3 yerden kırıldı**
   - core.test.ts: "orta profil" expected 52 → aldı 58 — intentional?

### Test durumu
- npm test → 4/6 pass, 2 fail
- Coverage: scoring %87 (önceki %89, -2)

### Etki tahmini
Ortalama skor değişimi (smoke): yaklaşık +3 puan.
Bu istatistiksel gürültü mü, sistematik shift mi? Manuel doğrulama gerekli.

### Önerilen aksiyon
1. veto cap sıralama fix (derhal)
2. PROFILE_COUNTRY_MATRIX kalıntı temizle
3. Fixture kırılmaları: kullanıcı onayı ile güncelle VEYA geri al
4. Commit mesajına katman değişikliklerini ekle
```

# Yapma

- Kod düzeltme — sadece tespit + öneri. Fix'i `react-specialist` veya kullanıcı uygular.
- Yeni skorlama kuralı ekleme önerisi — scope dışı
- Test silme — failing test kod bug'ının habercisidir, önce sebep araştır
- Skoru "daha iyi" yapmak için kalibrasyon oyna — business decision, kullanıcı bilsin