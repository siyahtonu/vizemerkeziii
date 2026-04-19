// ── Tarayıcıda PDF → düz metin çıkarıcı ──────────────────────────────────
// pdfjs-dist'in ESM build'ini kullanır; worker Vite ?url ile paketlenir.
// Kullanım: const text = await extractPdfText(file)
import * as pdfjs from 'pdfjs-dist';
// Vite worker import — build sırasında doğru path'e resolve edilir.
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl as string;

/**
 * PDF dosyasından tüm sayfalardaki metin katmanını çıkarır.
 * Tarama (görsel) PDF'lerde boş/kısa dönebilir — OCR yapmıyoruz.
 */
export async function extractPdfText(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: buf }).promise;
  const parts: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((it) => ('str' in it ? (it as { str: string }).str : ''))
      .join(' ');
    parts.push(pageText);
  }
  return parts.join('\n').replace(/\s+/g, ' ').trim();
}
