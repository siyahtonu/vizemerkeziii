// ============================================================
// ErrorBoundary — React hata sınırı + loglama
// ============================================================
// İki varyant:
//   <ErrorBoundary>     — Tam sayfa hata ekranı (main.tsx için)
//   <WidgetBoundary>    — Satır içi hata kartı (bileşen seviyesi)
//
// Loglama: console.error + window.__vizeMerkezi_onError hook
// Sentry veya başka bir izleme aracı entegre etmek için
// window.__vizeMerkezi_onError'ü override et:
//   window.__vizeMerkezi_onError = (err, info) => Sentry.captureException(err, { extra: info });
// ============================================================

/// <reference types="vite/client" />

import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';

// Global hook — dışarıdan override edilebilir (Sentry vb.)
declare global {
  interface Window {
    __vizeMerkezi_onError?: (error: Error, info: ErrorInfo) => void;
  }
}

interface Props {
  children: ReactNode;
  /** Özel fallback UI. Verilmezse varsayılan ekran gösterilir. */
  fallback?: ReactNode;
  /** Bileşen adı — hata logunda görünür */
  name?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorId: string | null;
}

// ── Tam sayfa hata ekranı ────────────────────────────────────────────────
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorId: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorId: `err_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    const name = this.props.name ?? 'App';
    console.error(`[ErrorBoundary:${name}]`, error, info.componentStack);
    try {
      window.__vizeMerkezi_onError?.(error, info);
    } catch {
      // izleme hook kendisi crash olursa uygulamayı etkilemesin
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null, errorId: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback;

    const { error, errorId } = this.state;

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Beklenmeyen Bir Hata Oluştu</h1>
          <p className="text-sm text-slate-500 mb-6">
            Özür dileriz — bir şeyler ters gitti. Sayfayı yenilemeyi deneyin.
            Sorun devam ederse destek ekibimize bildirin.
          </p>

          {import.meta.env.DEV && error && (
            <div className="text-left bg-red-50 border border-red-200 rounded-lg p-3 mb-5 max-h-32 overflow-auto">
              <p className="text-[11px] font-mono text-red-700 break-all">{error.message}</p>
            </div>
          )}

          <div className="flex gap-3 justify-center">
            <button
              onClick={this.handleRetry}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Tekrar Dene
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-colors"
            >
              Sayfayı Yenile
            </button>
          </div>

          {errorId && (
            <p className="text-[10px] text-slate-300 mt-4 font-mono">Hata kodu: {errorId}</p>
          )}
        </div>
      </div>
    );
  }
}

// ── Satır içi widget hata kartı ──────────────────────────────────────────
interface WidgetState {
  hasError: boolean;
  error: Error | null;
}

export class WidgetBoundary extends Component<Props, WidgetState> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): WidgetState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    const name = this.props.name ?? 'Widget';
    console.error(`[WidgetBoundary:${name}]`, error, info.componentStack);
    try {
      window.__vizeMerkezi_onError?.(error, info);
    } catch {
      // izleme hook kendisi crash olursa uygulamayı etkilemesin
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback;

    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-center">
        <p className="text-sm font-semibold text-rose-700 mb-1">Bu bileşen yüklenemedi</p>
        <p className="text-xs text-rose-500 mb-3">
          {import.meta.env.DEV && this.state.error
            ? this.state.error.message
            : 'Sayfayı yenilemeyi deneyin.'}
        </p>
        <button
          onClick={this.handleRetry}
          className="text-xs px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 font-semibold rounded-lg transition-colors"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }
}

export default ErrorBoundary;
