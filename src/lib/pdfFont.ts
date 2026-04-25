// ============================================================
// pdfFont — jsPDF için Türkçe karakter desteği
// ============================================================
// jsPDF'in default 'helvetica' font'u ı, ğ, ş, ç, ö, ü gibi Latin
// Extended-A karakterlerini render edemez. Bu helper Roboto TTF'sini
// runtime'da yükleyip jsPDF'e ekler — böylece PDF'lerde Türkçe metin
// doğru görünür.
//
// Font dosyaları public/fonts/ altında:
//   - Roboto-Regular.ttf (~155KB)
//   - Roboto-Bold.ttf    (~155KB)
//
// İlk kullanımda fetch + base64 dönüşümü yapılır, sonraki çağrılar
// cache'den hızlı çalışır. Yükleme başarısız olursa helvetica'ya
// fallback yapılır (Türkçe karakterler bozulabilir ama PDF üretilir).

import type { jsPDF } from 'jspdf';

const FONT_BASE_PATH = '/fonts';
const FONT_REGULAR_FILE = 'Roboto-Regular.ttf';
const FONT_BOLD_FILE = 'Roboto-Bold.ttf';
const FONT_NAME = 'Roboto';

interface FontData {
  regular: string; // base64
  bold: string;    // base64
}

let cachedFont: FontData | null = null;
let pendingFetch: Promise<FontData | null> | null = null;

// ArrayBuffer → base64 (browser-safe, büyük buffer'lar için chunked)
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const CHUNK = 0x8000;
  let binary = '';
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(binary);
}

async function fetchFontFile(filename: string): Promise<string> {
  const res = await fetch(`${FONT_BASE_PATH}/${filename}`);
  if (!res.ok) throw new Error(`[pdfFont] ${filename} alınamadı: ${res.status}`);
  const buf = await res.arrayBuffer();
  return arrayBufferToBase64(buf);
}

async function loadFonts(): Promise<FontData | null> {
  if (cachedFont) return cachedFont;
  if (pendingFetch) return pendingFetch;
  pendingFetch = (async () => {
    try {
      const [regular, bold] = await Promise.all([
        fetchFontFile(FONT_REGULAR_FILE),
        fetchFontFile(FONT_BOLD_FILE),
      ]);
      cachedFont = { regular, bold };
      return cachedFont;
    } catch (err) {
      // Font yüklenmediyse uyar — PDF üretilmeye devam eder
      console.warn('[pdfFont] Türkçe font yüklenemedi, default helvetica kullanılacak.', err);
      return null;
    } finally {
      pendingFetch = null;
    }
  })();
  return pendingFetch;
}

/**
 * jsPDF doc'una Türkçe destekli Roboto fontunu ekler ve aktif eder.
 * Çağırdıktan sonra `doc.setFont('Roboto', 'normal'|'bold')` ile kullanılır.
 *
 * @returns true: Türkçe font yüklendi ve aktif. false: yüklenemedi, helvetica.
 *
 * Kullanım:
 * ```ts
 * const { jsPDF } = await import('jspdf');
 * const doc = new jsPDF();
 * await ensureTurkishFont(doc);
 * doc.setFont('Roboto', 'bold');
 * doc.text('İçerik başlığı', 14, 20);
 * ```
 */
export async function ensureTurkishFont(doc: jsPDF): Promise<boolean> {
  const data = await loadFonts();
  if (!data) return false;
  // VFS'e ekle ve fontu kaydet
  doc.addFileToVFS(`${FONT_NAME}-Regular.ttf`, data.regular);
  doc.addFont(`${FONT_NAME}-Regular.ttf`, FONT_NAME, 'normal');
  doc.addFileToVFS(`${FONT_NAME}-Bold.ttf`, data.bold);
  doc.addFont(`${FONT_NAME}-Bold.ttf`, FONT_NAME, 'bold');
  doc.setFont(FONT_NAME, 'normal');
  return true;
}

/**
 * Aktif font ismi — ensureTurkishFont sonrası 'Roboto', aksi halde 'helvetica'.
 * setFont çağrıları için kullanışlı.
 */
export const TR_FONT = FONT_NAME;

/**
 * PDF dosya adı için güvenli string üretir — path traversal ve özel karakter
 * sorunlarını engeller (RFC 5987 / RFC 6266 uyumlu).
 *
 * Riskler:
 *   - Kullanıcı `letterData.fullName` gibi alanlara `../etc/passwd` veya
 *     Türkçe karakter (İ, Ğ, Ş) yazabilir; bazı tarayıcılarda Content-Disposition
 *     bunu "?????.pdf" olarak çevirir
 *   - AI cevabından gelen `fileName` prompt injection ile zarar verebilir
 *
 * Bu helper:
 *   - Türkçe karakterleri ASCII'ye normalize eder (İ → I, Ğ → G, vb.)
 *   - Yalnızca alfanümerik + `_` + `-` bırakır
 *   - 80 karakter ile sınırlandırır
 *   - Boş string yerine fallback döner
 */
export function safePdfFilename(input: string | null | undefined, fallback = 'Belge'): string {
  if (!input) return fallback;
  // Türkçe → ASCII
  const trMap: Record<string, string> = {
    'İ': 'I', 'I': 'I', 'ı': 'i',
    'Ğ': 'G', 'ğ': 'g',
    'Ü': 'U', 'ü': 'u',
    'Ş': 'S', 'ş': 's',
    'Ö': 'O', 'ö': 'o',
    'Ç': 'C', 'ç': 'c',
  };
  const normalized = input.replace(/[İIıĞğÜüŞşÖöÇç]/g, (ch) => trMap[ch] ?? ch);
  // Sadece alfanumerik, alt-tire, tire bırak; diğerlerini alt-tireye çevir
  const cleaned = normalized
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_\-]/g, '')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');
  if (cleaned.length === 0) return fallback;
  return cleaned.slice(0, 80);
}

/**
 * Font'u arka planda önbelleğe alır (PDF üretimine girmeden).
 * Dashboard yüklendiğinde `requestIdleCallback` ile çağrılır; kullanıcı PDF
 * butonuna bastığında font cache'ten anında gelir, gecikme yaşanmaz.
 */
export function prefetchTurkishFont(): void {
  if (cachedFont || pendingFetch) return;
  // Browser idle window — main thread'i bloklamaz.
  type IdleWindow = Window & {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  };
  const w = window as IdleWindow;
  const schedule = w.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 1000));
  schedule(() => { void loadFonts(); }, { timeout: 5000 });
}
