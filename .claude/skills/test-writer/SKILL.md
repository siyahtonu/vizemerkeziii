---
name: test-writer
description: Verilen bir dosya veya fonksiyon için Vitest test iskeleti üretir. VizeAkıl stack'ine uygun (Vitest + React Testing Library + @testing-library/user-event). Skorlama fonksiyonları için tablo-güdümlü fixture testi, React bileşenleri için semantic query + userEvent, API client için mock + error path.
---

# Kullanım

- "Şu dosyaya test yaz: src/scoring/algorithms.ts"
- "RejectionRisk bileşeni için smoke test yaz"
- "api.ts için error path testleri ekle"

# Adımlar

## 1. Hedefi oku

Read ile kaynak dosyayı aç. Şunu tespit et:
- **Tip**: pure function / React component / hook / API client
- **Public API**: export edilen fonksiyon/bileşen
- **Dep'ler**: import edilen modüller (hangilerini mock edeceksin)
- **Türkçe kısmı**: Türkçe yorumu `describe/it` başlıklarında kullanabilirsin

## 2. Test dosyasını yerleştir

Konvansiyon:
- `src/scoring/foo.ts` → `src/scoring/__tests__/foo.test.ts`
- `src/components/Foo.tsx` → `src/components/__tests__/Foo.test.tsx`
- `src/lib/foo.ts` → `src/lib/__tests__/foo.test.ts`

## 3. Şablon seç

### A. Pure function (scoring, algorithms, utils)

```ts
import { describe, it, expect } from 'vitest';
import { foo } from '../foo';

describe('foo', () => {
  describe('baz durumu', () => {
    it.each([
      { input: {...}, expected: 42, label: 'normal profil' },
      { input: {...}, expected: 0, label: 'boş profil' },
      { input: {...}, expected: 100, label: 'ideal profil' },
    ])('$label → $expected', ({ input, expected }) => {
      expect(foo(input)).toBe(expected);
    });
  });

  describe('sınır durumlar', () => {
    it('negatif input clamp ediyor', () => {
      expect(foo({ x: -1 })).toBeGreaterThanOrEqual(0);
    });
  });
});
```

### B. React component

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Foo } from '../Foo';

describe('Foo', () => {
  it('render eder ve başlık görünür', () => {
    render(<Foo title="Test" />);
    expect(screen.getByRole('heading', { name: 'Test' })).toBeInTheDocument();
  });

  it('butona tıklayınca callback tetiklenir', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Foo onClick={onClick} />);
    await user.click(screen.getByRole('button', { name: /devam/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('loading state gösterir', () => {
    render(<Foo loading />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
```

### C. Hook

```ts
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFoo } from '../useFoo';

describe('useFoo', () => {
  it('başlangıç değeri döner', () => {
    const { result } = renderHook(() => useFoo(5));
    expect(result.current.count).toBe(5);
  });

  it('increment arttırır', () => {
    const { result } = renderHook(() => useFoo(0));
    act(() => result.current.increment());
    expect(result.current.count).toBe(1);
  });
});
```

### D. API client (mock ile)

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { postAi } from '../api';

beforeEach(() => {
  vi.clearAllMocks();
  global.fetch = vi.fn();
});

describe('postAi', () => {
  it('başarılı response dönüyor', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, data: { text: 'hi' } }),
    });
    const res = await postAi({ prompt: 'test' });
    expect(res.text).toBe('hi');
  });

  it('404 hatayı throw eder', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ ok: false, error: { message: 'not found' } }),
    });
    await expect(postAi({ prompt: 'x' })).rejects.toThrow();
  });

  it('network hatası yakalanır', async () => {
    (global.fetch as any).mockRejectedValue(new Error('network'));
    await expect(postAi({ prompt: 'x' })).rejects.toThrow('network');
  });
});
```

## 4. Fixture zenginleştir (scoring için kritik)

Skorlama testinde:
- En az 5 profil: düşük / orta / yüksek / veto / sınır
- Katman-bazlı: `calculateRawScore` / kalibrasyon / segment çarpanı ayrı test
- Regresyon guard: "X profil Y skoru vermeli" pin (snapshot tercih etme — brittle)

## 5. Write + koştur

```bash
npx vitest run <new-test-file>
```

Geçiyorsa → rapor. Geçmiyorsa → kullanıcıya göster, düzeltme öner (kodda bug mu, testte assumption mu?).

## 6. Coverage kontrolü

```bash
npm run test:coverage -- <file>
```

Hedef: **%80 line coverage**. Ama her dalı zorla %100'e çıkarma → kırılgan test.

# Çıktı formatı

```markdown
## Test yazıldı: <dosya>

### Kapsam
- <Yöntem/bileşen> → X test
- Mutlu yol: ✓
- Sınır durumlar: ✓
- Error path: ✓

### Koştu
`npx vitest run` → N passing

### Coverage (varsa)
- Line: %X
- Branch: %Y

### Eksik / gelecek
- <şu anda test edilmeyen şey>
- Kullanıcı: bunları eklememi ister misin?
```

# Yapma

- Mock overuse — real fonksiyon kullan, sadece yan etki (fetch, date, random) mock'la
- Snapshot serpme — kırılgan, manuel merge ağrılı
- `any` tip kullanma — test bile olsa strict
- E2E yazma (Playwright) — scope dışı
- `enzyme` / `jest` — Vitest + RTL stack'teyiz