// ============================================================
// SkeletonCard — #14 Yükleme İskelet Ekranı
// Dashboard widgetları ve kart alanları için shimmer placeholder
// ============================================================

import React from 'react';

interface SkeletonLineProps {
  width?: string;
  height?: string;
}

function SkeletonLine({ width = 'w-full', height = 'h-3' }: SkeletonLineProps) {
  return (
    <div
      className={`${width} ${height} bg-slate-200 rounded-full animate-pulse`}
    />
  );
}

export function SkeletonCard({ rows = 3, showHeader = true }: { rows?: number; showHeader?: boolean }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      {showHeader && (
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
          <div className="w-4 h-4 bg-slate-200 rounded animate-pulse" />
          <SkeletonLine width="w-32" height="h-3.5" />
        </div>
      )}
      <div className="p-4 space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="space-y-2">
            <SkeletonLine width={i % 2 === 0 ? 'w-full' : 'w-3/4'} />
            {i === 0 && <SkeletonLine width="w-1/2" height="h-2" />}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonScoreCard() {
  return (
    <div className="p-8 bg-slate-900 rounded-[2rem] flex flex-col lg:flex-row items-center gap-8">
      <div className="space-y-4 w-full lg:w-auto">
        <div className="w-24 h-4 bg-white/20 rounded-full animate-pulse" />
        <div className="w-40 h-16 bg-white/20 rounded-2xl animate-pulse" />
        <div className="w-32 h-2 bg-white/10 rounded-full animate-pulse" />
        <div className="space-y-2 mt-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-16 h-2 bg-white/15 rounded animate-pulse" />
              <div className={`h-1.5 bg-white/10 rounded animate-pulse`} style={{ width: `${40 + i * 12}%` }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
