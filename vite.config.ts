import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';

// NOT: SPA prerender için production deploy'da Netlify/Vercel SSG
// veya ayrı bir `prerender` build adımı önerilir. react-helmet-async
// tüm sayfalarda meta tag/title yönetimini üstlenir.

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    hmr: process.env.DISABLE_HMR !== 'true',
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Sadece statik graph'tan gelen büyük vendor'ları manuel chunk'a alıyoruz.
        // jspdf ve pdfjs-dist tamamen dynamic import ile çağrılır (PDF üretimi
        // ve banka/SGK PDF metin çıkarımı). Bu paketleri manualChunks'a koymak
        // Vite'ın <link rel="modulepreload"> üretmesine ve ilk yükte ~262KB
        // gzip boşa indirilmesine neden oluyordu — listeden çıkardık. Rollup
        // şimdi bu paketleri natural dynamic chunk olarak ayırır.
        manualChunks: {
          'vendor-react':  ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['motion', 'motion/react'],
          'vendor-icons':  ['lucide-react'],
          'vendor-helmet': ['react-helmet-async'],
        },
      },
    },
    // Modulepreload yine üretilsin (vendor-react gibi statik graph chunk'ları için
    // gerekli) ama dinamik chunk'lar listeye girmesin. Vite 5+ varsayılan
    // davranışı bu — dinamik import'lar preload listesine girmez. Yine de
    // emin olmak için dependency resolver'ı override ediyoruz: sadece initial
    // entry'nin direct deps'i preload edilsin.
    modulePreload: {
      polyfill: false,
      resolveDependencies: (filename, deps, { hostType }) => {
        if (hostType !== 'html') return deps;
        // Dinamik chunk'ları (jspdf, pdfjs-dist, html2canvas, dompurify) ve
        // lazy step/modal chunk'larını preload listesinden ele.
        return deps.filter((d) =>
          !/jspdf|pdfjs|html2canvas|purify|DashboardStep|AssessmentStep|TacticsStep|LetterStep|AnalysisReportModal|HelpModal|CountryGuideModal|DocChecklistModal|CostCalculatorModal|DayCalculatorModal|ResearchInsightsWidget/.test(d)
        );
      },
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/__tests__/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/scoring/**'],
      reporter: ['text', 'html'],
    },
  },
});
