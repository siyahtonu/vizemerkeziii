// ============================================================
// ProfileRadarChart — 6 Eksenli Kişisel Risk Haritası
// Harici kütüphane yok — saf SVG
// ============================================================
import { useMemo, useState } from 'react';
import type { ProfileData } from '../types';
import {
  getDimensionScores,
  DIMENSION_LABELS,
  DIMENSION_TIPS,
  type DimensionScores,
} from '../scoring/dimensions';

interface Props {
  profile: ProfileData;
}

const CX = 130;
const CY = 130;
const R  = 100; // maksimum yarıçap
const AXES = 6;
const AXIS_KEYS: (keyof DimensionScores)[] = [
  'financial', 'professional', 'trust', 'travel', 'application', 'ties',
];

// Açı hesabı: üstten başla (-90°), saat yönünde
function axisAngle(i: number) {
  return (Math.PI * 2 * i) / AXES - Math.PI / 2;
}

function polarToXY(angle: number, r: number) {
  return { x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle) };
}

// Renk: skora göre yeşil/sarı/kırmızı
function scoreColor(score: number) {
  if (score >= 70) return '#10b981'; // emerald
  if (score >= 45) return '#f59e0b'; // amber
  return '#ef4444';                  // red
}

function dimensionColor(key: keyof DimensionScores) {
  const colors: Record<keyof DimensionScores, string> = {
    financial:    '#6366f1', // indigo
    professional: '#0ea5e9', // sky
    trust:        '#10b981', // emerald
    travel:       '#f59e0b', // amber
    application:  '#ec4899', // pink
    ties:         '#8b5cf6', // violet
  };
  return colors[key];
}

export function ProfileRadarChart({ profile }: Props) {
  const scores = useMemo(() => getDimensionScores(profile), [profile]);
  const [hovered, setHovered] = useState<keyof DimensionScores | null>(null);

  // Eksenlerin uç noktaları (tam skor = R)
  const axisEndpoints = AXIS_KEYS.map((_, i) => polarToXY(axisAngle(i), R));

  // Grid çizgileri: %25, %50, %75, %100
  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  // Kullanıcı poligonu
  const dataPoints = AXIS_KEYS.map((key, i) => {
    const r = (scores[key] / 100) * R;
    return polarToXY(axisAngle(i), r);
  });
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + ' Z';

  // Etiket konumları (biraz dışarıya)
  const labelPositions = AXIS_KEYS.map((_, i) => polarToXY(axisAngle(i), R + 24));

  // Hover edilen eksen
  const hoveredScore = hovered ? scores[hovered] : null;
  const hoveredTip   = hovered ? DIMENSION_TIPS[hovered] : null;

  // Zayıf boyutlar (<=45)
  const weakDimensions = AXIS_KEYS.filter(k => scores[k] <= 45);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {/* Başlık */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
          <svg viewBox="0 0 16 16" className="w-4 h-4 text-indigo-600 fill-indigo-600">
            <polygon points="8,1 15,6 12,14 4,14 1,6" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        </div>
        <div>
          <div className="font-black text-slate-900 text-sm">Kişisel Risk Haritası</div>
          <div className="text-xs text-slate-400">6 boyutlu profil analizi — zayıf eksenleri tespit edin</div>
        </div>
      </div>

      <div className="p-5">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          {/* SVG Radar */}
          <div className="shrink-0">
            <svg
              width={260}
              height={260}
              viewBox={`0 0 260 260`}
              className="overflow-visible"
            >
              {/* Grid seviyeleri */}
              {gridLevels.map(level => {
                const pts = AXIS_KEYS.map((_, i) => {
                  const p = polarToXY(axisAngle(i), R * level);
                  return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
                }).join(' ');
                return (
                  <polygon
                    key={level}
                    points={pts}
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth={level === 1 ? 1.5 : 1}
                  />
                );
              })}

              {/* Eksen çizgileri */}
              {axisEndpoints.map((ep, i) => (
                <line
                  key={i}
                  x1={CX} y1={CY}
                  x2={ep.x.toFixed(1)} y2={ep.y.toFixed(1)}
                  stroke={hovered === AXIS_KEYS[i] ? dimensionColor(AXIS_KEYS[i]) : '#e2e8f0'}
                  strokeWidth={hovered === AXIS_KEYS[i] ? 2 : 1}
                />
              ))}

              {/* Kullanıcı alanı */}
              <path
                d={dataPath}
                fill="rgba(99,102,241,0.15)"
                stroke="#6366f1"
                strokeWidth={2}
                strokeLinejoin="round"
              />

              {/* Veri noktaları */}
              {dataPoints.map((p, i) => {
                const key = AXIS_KEYS[i];
                const s   = scores[key];
                return (
                  <circle
                    key={key}
                    cx={p.x} cy={p.y} r={5}
                    fill={dimensionColor(key)}
                    stroke="white"
                    strokeWidth={2}
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setHovered(key)}
                    onMouseLeave={() => setHovered(null)}
                    style={{ filter: hovered === key ? 'drop-shadow(0 0 4px rgba(0,0,0,0.3))' : 'none' }}
                  />
                );
              })}

              {/* Eksen etiketleri */}
              {labelPositions.map((lp, i) => {
                const key   = AXIS_KEYS[i];
                const score = scores[key];
                const angle = axisAngle(i);
                // Sağa doğru: sol hizala, sola doğru: sağ hizala, üst/alt: ortala
                const anchor =
                  Math.abs(Math.cos(angle)) < 0.3 ? 'middle' :
                  Math.cos(angle) > 0 ? 'start' : 'end';
                return (
                  <g
                    key={key}
                    className="cursor-pointer"
                    onMouseEnter={() => setHovered(key)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <text
                      x={lp.x} y={lp.y}
                      textAnchor={anchor}
                      dominantBaseline="central"
                      fontSize={10}
                      fontWeight={hovered === key ? 800 : 700}
                      fill={hovered === key ? dimensionColor(key) : '#475569'}
                    >
                      {DIMENSION_LABELS[key]}
                    </text>
                    <text
                      x={lp.x} y={lp.y + 13}
                      textAnchor={anchor}
                      dominantBaseline="central"
                      fontSize={9}
                      fontWeight={700}
                      fill={scoreColor(score)}
                    >
                      %{score}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Sağ panel: boyut listesi + hover detayı */}
          <div className="flex-1 w-full space-y-2">
            {/* Hover tooltip */}
            {hovered && (
              <div className="mb-3 p-3 rounded-xl border border-indigo-100 bg-indigo-50 text-xs text-indigo-700 leading-relaxed">
                <span className="font-black">{DIMENSION_LABELS[hovered]}: %{hoveredScore}</span>
                <br />{hoveredTip}
              </div>
            )}

            {/* Boyut barları */}
            {AXIS_KEYS.map(key => {
              const score = scores[key];
              const color = dimensionColor(key);
              return (
                <div
                  key={key}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                    hovered === key ? 'bg-slate-50' : 'hover:bg-slate-50'
                  }`}
                  onMouseEnter={() => setHovered(key)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div className="w-16 text-xs font-bold text-slate-600 shrink-0">
                    {DIMENSION_LABELS[key]}
                  </div>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${score}%`, backgroundColor: color }}
                    />
                  </div>
                  <div
                    className="w-9 text-right text-xs font-black shrink-0"
                    style={{ color: scoreColor(score) }}
                  >
                    %{score}
                  </div>
                </div>
              );
            })}

            {/* Zayıf boyut uyarısı */}
            {weakDimensions.length > 0 && (
              <div className="mt-2 p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-700">
                <span className="font-black">Öncelikli geliştirme:</span>{' '}
                {weakDimensions.map(k => DIMENSION_LABELS[k]).join(', ')} boyutu zayıf.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
