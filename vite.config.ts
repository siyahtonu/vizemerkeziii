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
        manualChunks: {
          'vendor-react':  ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['motion', 'motion/react'],
          'vendor-pdf':    ['jspdf'],
          'vendor-icons':  ['lucide-react'],
          'vendor-helmet': ['react-helmet-async'],
          'vendor-pdfjs':  ['pdfjs-dist'],
        },
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
