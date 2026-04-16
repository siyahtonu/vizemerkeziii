// ============================================================
// Puanlama Matrisleri
// App.tsx'ten modüler yapıya taşındı
// ============================================================

// ── Türk başvurucular için ülke ret oranları (2024 gerçek veri) ──────────
export const TR_REJECTION_RATES: Record<string, number> = {
  'Yunanistan': 0.06,
  'Macaristan': 0.08,
  'İtalya':     0.087,
  'Portekiz':   0.09,
  'Polonya':    0.09,
  'İspanya':    0.10,
  'Hollanda':   0.14,
  'Avusturya':  0.14,
  'Norveç':     0.20,
  'Fransa':     0.21,
  'ABD':        0.22,
  'İsveç':      0.22,
  'Almanya':    0.23,
  'İngiltere':  0.30,
  'Danimarka':  0.66,
};

export const DIFFICULT_COUNTRIES = new Set(['Almanya', 'Fransa', 'İngiltere', 'ABD', 'Danimarka', 'İsveç', 'Norveç']);

// ── #4 Profil-Ülke Uyum Matrisi (v2 — tam matris) ────────────────────────
// Mantık: Belirli profil × ülke kombinasyonları tarihsel olarak daha/az uyumlu.
// Kaynak: Schengen Visa Statistics 2024-2026 + AB Komisyon segment raporları + uzman kalibrasyonu.
// Değer aralığı: 0.82 (dezavantajlı) → 1.18 (avantajlı), 1.0 = nötr
// Segmentler: employed | student | public_sector | retired | self_employed | unemployed
// ─────────────────────────────────────────────────────────────────────────────────────────
// Okuma kılavuzu:
//   1.10 → bu profil bu ülkede %10 avantajlı (final skor ×1.10)
//   0.90 → bu profil bu ülkede %10 dezavantajlı (final skor ×0.90)
//   1.00 → nötr, matris etkisi yok
// ─────────────────────────────────────────────────────────────────────────────────────────
export const PROFILE_COUNTRY_MATRIX: Record<string, Record<string, number>> = {
  // Çalışan (SGK'lı, özel sektör) — genel referans profil
  'employed': {
    'Almanya':    1.02, // Düzenli SGK = memnuniyet, ama yüksek ret oranı baskılıyor
    'Avusturya':  1.03,
    'Fransa':     1.00, // TLScontact süreç nötr
    'İtalya':     1.05, // Turizm odaklı konsolosluk, çalışanlara pozitif
    'İspanya':    1.06, // İspanya Türklere görece açık
    'Yunanistan': 1.08, // En düşük ret oranı — en toleranslı
    'Portekiz':   1.07,
    'Hollanda':   1.02,
    'Belçika':    1.01,
    'Polonya':    1.04,
    'Macaristan': 1.05,
    'Danimarka':  0.94, // %66 ret oranı — çalışan bile dezavantajlı
    'İsveç':      0.96,
    'Norveç':     0.97,
    'İngiltere':  1.03, // Çalışan profil UK için olumlu
    'ABD':        1.00, // 214b bağlılık testi nötr başlangıç
  },

  // Kamu sektörü çalışanı — konsolosluklar devlet çalışanlarını en güvenilir profil olarak görür
  'public_sector': {
    'Almanya':    1.12, // Devlet işi + Almanya: güçlü kombinasyon
    'Avusturya':  1.10,
    'Fransa':     1.10, // Fransa kamu çalışanlarına tarihi olarak pozitif
    'İtalya':     1.08,
    'İspanya':    1.08,
    'Yunanistan': 1.07,
    'Portekiz':   1.08,
    'Hollanda':   1.06,
    'Belçika':    1.07,
    'Polonya':    1.05,
    'Macaristan': 1.06,
    'Danimarka':  0.97, // Yüksek ret oranı kamu çalışanını da zorluyor
    'İsveç':      1.00,
    'Norveç':     1.01,
    'İngiltere':  1.12, // UK Tier sistemi kamu çalışanlarına çok olumlu
    'ABD':        1.08, // Devlet işi = güçlü geri dönüş kanıtı
  },

  // Öğrenci — gelir ispat zorluğu var, özellikle Almanya/İngiltere kısıtlayıcı
  'student': {
    'Almanya':    0.88, // Öğrenci Almanya'dan en zor onay alıyor (göç riski)
    'Avusturya':  0.90,
    'Fransa':     0.91, // Fransa öğrenci kısıtlayıcı, özellikle uzun süreli
    'İtalya':     1.06, // İtalya kısa turist/öğrenci başvurularına açık
    'İspanya':    1.07, // İspanya en toleranslı ülkelerden
    'Yunanistan': 1.12, // Yunanistan en kolay — turizm öncelikli
    'Portekiz':   1.05,
    'Hollanda':   1.00,
    'Belçika':    0.98,
    'Polonya':    1.04,
    'Macaristan': 1.06,
    'Danimarka':  0.88, // Danimarka öğrenci için en zor
    'İsveç':      0.90,
    'Norveç':     0.91,
    'İngiltere':  0.88, // UK öğrenci turist vizesi net dezavantajlı
    'ABD':        0.86, // ABD öğrenci turistik B2 için en zorlu segment
  },

  // Emekli — geri dönüş riski en düşük profil, neredeyse her ülkede avantajlı
  'retired': {
    'Almanya':    1.08,
    'Avusturya':  1.10,
    'Fransa':     1.08,
    'İtalya':     1.12, // İtalya emekliye çok pozitif
    'İspanya':    1.14, // İspanya emeklileri sever
    'Yunanistan': 1.18, // En avantajlı kombinasyon — Yunanistan + emekli
    'Portekiz':   1.14,
    'Hollanda':   1.06,
    'Belçika':    1.07,
    'Polonya':    1.08,
    'Macaristan': 1.10,
    'Danimarka':  0.96, // Genel yüksek ret — emekliyi de zorluyor
    'İsveç':      1.03,
    'Norveç':     1.04,
    'İngiltere':  1.05,
    'ABD':        0.96, // ABD emekliye şüpheci değil ama 214b yine geçerli
  },

  // Serbest meslek / freelance — gelir belgesi zor, konsolosluklar şüpheci
  'self_employed': {
    'Almanya':    0.86, // Almanya serbest meslek için en kısıtlayıcı
    'Avusturya':  0.88,
    'Fransa':     0.89,
    'İtalya':     0.95, // İtalya görece tolere ediyor
    'İspanya':    0.97,
    'Yunanistan': 1.06, // Yunanistan gelir belgesi kontrolü gevşek
    'Portekiz':   1.00,
    'Hollanda':   0.92,
    'Belçika':    0.92,
    'Polonya':    0.95,
    'Macaristan': 0.96,
    'Danimarka':  0.84, // En zorlu kombinasyon
    'İsveç':      0.88,
    'Norveç':     0.90,
    'İngiltere':  0.83, // UK serbest meslek için en dezavantajlı
    'ABD':        0.88,
  },

  // İşsiz / gelir kaynağı yok — en riskli segment
  'unemployed': {
    'Almanya':    0.82, // Neredeyse kesin ret riski
    'Avusturya':  0.84,
    'Fransa':     0.84,
    'İtalya':     0.90,
    'İspanya':    0.92,
    'Yunanistan': 0.98, // Yunanistan bile işsize dikkatli
    'Portekiz':   0.93,
    'Hollanda':   0.86,
    'Belçika':    0.86,
    'Polonya':    0.90,
    'Macaristan': 0.91,
    'Danimarka':  0.82,
    'İsveç':      0.83,
    'Norveç':     0.85,
    'İngiltere':  0.82,
    'ABD':        0.84,
  },
};
