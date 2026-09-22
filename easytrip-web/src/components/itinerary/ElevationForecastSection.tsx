import React, { useState } from 'react';
import { 
  Mountain, 
  Sun, 
  Compass, 
  TrendingUp, 
  Thermometer, 
  Wind, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Gauge
} from 'lucide-react';

interface ElevationForecastSectionProps {
  destination: string;
  origin?: string;
  distanceKm?: number;
  tempBase?: number;
}

export const ElevationForecastSection: React.FC<ElevationForecastSectionProps> = ({
  destination,
  origin = 'Current Location',
  distanceKm = 580,
  tempBase = 28
}) => {
  const [activeTab, setActiveTab] = useState<'elevation' | 'climate'>('elevation');
  const [selectedPointIndex, setSelectedPointIndex] = useState<number>(2);

  // Generate realistic elevation and temperature curve data tailored to the destination type
  const isMountain = destination.toLowerCase().includes('manali') || 
                     destination.toLowerCase().includes('ooty') || 
                     destination.toLowerCase().includes('shimla') ||
                     destination.toLowerCase().includes('leh');

  const isCoastal = destination.toLowerCase().includes('vizag') || 
                    destination.toLowerCase().includes('visakhapatnam') || 
                    destination.toLowerCase().includes('goa') ||
                    destination.toLowerCase().includes('mumbai') ||
                    destination.toLowerCase().includes('chennai');

  const elevationData = isMountain
    ? [
        { label: 'Valley Origin', dist: '0 km', alt: 920, temp: '22°C', grade: '0%', note: 'Smooth highway departure' },
        { label: 'Foothill Junction', dist: `${Math.round(distanceKm * 0.35)} km`, alt: 1480, temp: '19°C', grade: '+4.2%', note: 'Entering mountain scenic corridor' },
        { label: 'Alpine Ridge Pass', dist: `${Math.round(distanceKm * 0.7)} km`, alt: 2240, temp: '14°C', grade: '+6.8%', note: 'Peak elevation view overlook' },
        { label: 'Highland Plateau', dist: `${Math.round(distanceKm * 0.9)} km`, alt: 2050, temp: '16°C', grade: '-1.5%', note: 'Pine forest plateau & lake bypass' },
        { label: `${destination} Hub`, dist: `${distanceKm} km`, alt: 2000, temp: '17°C', grade: '0%', note: 'Arrival in resort district' },
      ]
    : isCoastal
    ? [
        { label: `${origin} Departure`, dist: '0 km', alt: 540, temp: `${tempBase - 2}°C`, grade: '0%', note: 'Deccan plateau departure' },
        { label: 'Mid-Corridor Bypass', dist: `${Math.round(distanceKm * 0.35)} km`, alt: 180, temp: `${tempBase}°C`, grade: '-1.8%', note: 'River basin crossing & rest plaza' },
        { label: 'Coastal Ghat Ridge', dist: `${Math.round(distanceKm * 0.7)} km`, alt: 360, temp: `${tempBase - 1}°C`, grade: '+3.5%', note: 'Scenic coastal ridge vista' },
        { label: 'Waterfront Promenade', dist: `${Math.round(distanceKm * 0.9)} km`, alt: 15, temp: `${tempBase + 1}°C`, grade: '-2.2%', note: 'Approaching ocean sea level' },
        { label: `${destination} Port`, dist: `${distanceKm} km`, alt: 8, temp: `${tempBase}°C`, grade: '0%', note: 'Coastal sea breeze arrival' },
      ]
    : [
        { label: `${origin} Departure`, dist: '0 km', alt: 216, temp: `${tempBase - 3}°C`, grade: '0%', note: 'Interstate corridor departure' },
        { label: 'Historic Waypoint', dist: `${Math.round(distanceKm * 0.35)} km`, alt: 310, temp: `${tempBase}°C`, grade: '+1.2%', note: 'Arid scrubland & toll plaza' },
        { label: 'Plateau Overlook', dist: `${Math.round(distanceKm * 0.7)} km`, alt: 480, temp: `${tempBase + 2}°C`, grade: '+2.5%', note: 'Panoramic sandstone ridge' },
        { label: 'Valley Gateway', dist: `${Math.round(distanceKm * 0.9)} km`, alt: 340, temp: `${tempBase + 1}°C`, grade: '-1.8%', note: 'Approaching city perimeter' },
        { label: `${destination} Terminal`, dist: `${distanceKm} km`, alt: 430, temp: `${tempBase}°C`, grade: '0%', note: 'Urban heritage core arrival' },
      ];

  const climateData = [
    { label: 'Early Dawn (06:00)', dist: '06:00 AM', alt: 'Sunrise', temp: `${tempBase - 4}°C`, grade: '92% RH', note: 'Cool crisp morning mist' },
    { label: 'Mid-Morning (09:30)', dist: '09:30 AM', alt: 'Pleasant', temp: `${tempBase - 1}°C`, grade: '75% RH', note: 'Ideal exploration light' },
    { label: 'Solar Peak (13:30)', dist: '01:30 PM', alt: 'Warm Peak', temp: `${tempBase + 3}°C`, grade: '55% RH', note: 'Peak sun • indoor dining recommended' },
    { label: 'Golden Dusk (17:30)', dist: '05:30 PM', alt: 'Sunset', temp: `${tempBase}°C`, grade: '68% RH', note: 'Atmospheric twilight golden hour' },
    { label: 'Night Breeze (21:30)', dist: '09:30 PM', alt: 'Cool Night', temp: `${tempBase - 3}°C`, grade: '80% RH', note: 'Pleasant night promenade' },
  ];

  const currentDataset = activeTab === 'elevation' ? elevationData : climateData;
  const activePoint = currentDataset[selectedPointIndex];

  // SVG Normalized Curve Points (5 points mapped across width 600, height 180)
  // Height coordinates: 150 (low altitude / low temp) to 35 (high peak / high temp)
  const elevationSvgPoints = isMountain
    ? [
        { x: 30, y: 135 },
        { x: 160, y: 100 },
        { x: 300, y: 35 },
        { x: 440, y: 55 },
        { x: 570, y: 60 },
      ]
    : isCoastal
    ? [
        { x: 30, y: 65 },
        { x: 160, y: 110 },
        { x: 300, y: 75 },
        { x: 440, y: 140 },
        { x: 570, y: 145 },
      ]
    : [
        { x: 30, y: 120 },
        { x: 160, y: 100 },
        { x: 300, y: 55 },
        { x: 440, y: 95 },
        { x: 570, y: 75 },
      ];

  const climateSvgPoints = [
    { x: 30, y: 130 },
    { x: 160, y: 85 },
    { x: 300, y: 40 },
    { x: 440, y: 75 },
    { x: 570, y: 115 },
  ];

  const activeSvgPoints = activeTab === 'elevation' ? elevationSvgPoints : climateSvgPoints;

  // Build cubic Bezier curve path string
  const p = activeSvgPoints;
  const curvePath = `M ${p[0].x} ${p[0].y} ` +
    `C ${p[0].x + 60} ${p[0].y}, ${p[1].x - 60} ${p[1].y}, ${p[1].x} ${p[1].y} ` +
    `C ${p[1].x + 60} ${p[1].y}, ${p[2].x - 60} ${p[2].y}, ${p[2].x} ${p[2].y} ` +
    `C ${p[2].x + 60} ${p[2].y}, ${p[3].x - 60} ${p[3].y}, ${p[3].x} ${p[3].y} ` +
    `C ${p[3].x + 60} ${p[3].y}, ${p[4].x - 60} ${p[4].y}, ${p[4].x} ${p[4].y}`;

  const areaFillPath = `${curvePath} L ${p[4].x} 170 L ${p[0].x} 170 Z`;

  return (
    <div className="specular-sheen bg-[#141b26] rounded-md p-6 sm:p-8 border border-[#222d3d] space-y-6 shadow-2xl relative">
      {/* Header & Metric Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#222d3d] gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#f3b740] text-xs font-bold uppercase tracking-wider mb-1">
            {activeTab === 'elevation' ? (
              <Mountain className="w-4 h-4 text-[#f3b740]" />
            ) : (
              <Sun className="w-4 h-4 text-[#f3b740]" />
            )}
            <span>Transit Telemetry & Topography</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {activeTab === 'elevation' ? (
              <>Route Elevation & Topographic Profile</>
            ) : (
              <>24-Hour Climate & Weather Pacing</>
            )}
            <span className="ml-2.5 text-xs font-semibold px-2.5 py-0.5 rounded-sm bg-[#062c20] text-[#34d399] border border-[#059669]/40">
              Live Verified Curve
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {activeTab === 'elevation'
              ? `Real gradient progression and altitude variations between ${origin} and ${destination}.`
              : `Solar trajectory, temperature swings, and ideal sightseeing pacing in ${destination}.`}
          </p>
        </div>

        {/* Tab Toggle with Physical Spring Transition */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-[#0f1520] p-1.5 rounded-sm border border-[#222d3d]">
          <button
            onClick={() => {
              setActiveTab('elevation');
              setSelectedPointIndex(2);
            }}
            className={`px-3.5 py-1.5 rounded-sm text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'elevation'
                ? 'bg-[#f3b740] text-[#0e131f] shadow-gold-glow'
                : 'text-slate-300 hover:text-white hover:bg-[#182232]'
            }`}
          >
            <Mountain className="w-3.5 h-3.5" />
            <span>Elevation (m ASL)</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('climate');
              setSelectedPointIndex(2);
            }}
            className={`px-3.5 py-1.5 rounded-sm text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'climate'
                ? 'bg-[#f3b740] text-[#0e131f] shadow-gold-glow'
                : 'text-slate-300 hover:text-white hover:bg-[#182232]'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Diurnal Climate (°C)</span>
          </button>
        </div>
      </div>

      {/* SVG Canvas Container with Animated Gradient Fill & Self-Drawing Curve */}
      <div className="relative w-full bg-[#0b0e14] rounded-sm border border-[#222d3d] p-4 sm:p-6 overflow-hidden">
        
        {/* Ambient Subtle Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#141b26_1px,transparent_1px),linear-gradient(to_bottom,#141b26_1px,transparent_1px)] bg-[size:40px_30px] opacity-40 pointer-events-none" />

        {/* Baseline Axis Labels */}
        <div className="absolute left-4 top-4 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
          {activeTab === 'elevation' ? '▲ Altitude (Meters ASL)' : '▲ Temperature (°C)'}
        </div>
        <div className="absolute right-4 bottom-2 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
          {activeTab === 'elevation' ? 'Distance Corridor ▶' : 'Timeline Pacing ▶'}
        </div>

        {/* Main SVG Graph */}
        <svg 
          key={activeTab + destination}
          viewBox="0 0 600 180" 
          className="w-full h-44 sm:h-52 relative z-10 overflow-visible"
        >
          <defs>
            {/* Amber Gold Stroke Gradient (#d97706, #f3b740, #fbbf24) */}
            <linearGradient id="elevationStrokeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="50%" stopColor="#f3b740" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>

            {/* Amber Gold Area Fill Wipe Gradient */}
            <linearGradient id="elevationAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.28" />
              <stop offset="50%" stopColor="#d97706" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#0b0e14" stopOpacity="0.0" />
            </linearGradient>

            {/* Glow Filter for Active Node */}
            <filter id="amberGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#f3b740" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Area Fill Wipe Underneath Curve */}
          <path
            d={areaFillPath}
            fill="url(#elevationAreaGrad)"
            className="elevation-area-wipe"
          />

          {/* Self-Drawing Dynamic SVG Curve */}
          <path
            d={curvePath}
            fill="none"
            stroke="url(#elevationStrokeGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="elevation-curve-draw"
          />

          {/* Horizontal Reference Grid Lines */}
          <line x1="30" y1="50" x2="570" y2="50" stroke="#222d3d" strokeDasharray="3 4" strokeWidth="1" />
          <line x1="30" y1="100" x2="570" y2="100" stroke="#222d3d" strokeDasharray="3 4" strokeWidth="1" />
          <line x1="30" y1="150" x2="570" y2="150" stroke="#222d3d" strokeWidth="1.5" />

          {/* Telemetry Waypoint Nodes */}
          {activeSvgPoints.map((pt, idx) => {
            const isSelected = selectedPointIndex === idx;
            const dataPoint = currentDataset[idx];

            return (
              <g 
                key={idx} 
                className="cursor-pointer group"
                onClick={() => setSelectedPointIndex(idx)}
              >
                {/* Vertical Drop Guideline on Selected */}
                {isSelected && (
                  <line
                    x1={pt.x}
                    y1={pt.y}
                    x2={pt.x}
                    y2="150"
                    stroke="#f3b740"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                    opacity="0.75"
                  />
                )}

                {/* Outer Ping Ring for Active */}
                {isSelected && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="11"
                    fill="#fbbf24"
                    opacity="0.25"
                    className="animate-ping"
                  />
                )}

                {/* Interactive Node Dot */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isSelected ? '6.5' : '4.5'}
                  fill={isSelected ? '#fbbf24' : '#141b26'}
                  stroke={isSelected ? '#0e131f' : '#f3b740'}
                  strokeWidth={isSelected ? '2.5' : '2'}
                  filter={isSelected ? 'url(#amberGlow)' : undefined}
                  className="elevation-dot-pop transition-all duration-300 group-hover:scale-125"
                  style={{ animationDelay: `${idx * 160}ms` }}
                />

                {/* Hover Value Tooltip */}
                <text
                  x={pt.x}
                  y={pt.y - 12}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="bold"
                  fill={isSelected ? '#fbbf24' : '#94a3b8'}
                  className="transition-colors duration-200 select-none"
                >
                  {activeTab === 'elevation' ? `${dataPoint.alt}m` : dataPoint.temp}
                </text>

                {/* Waypoint Label at Baseline */}
                <text
                  x={pt.x}
                  y="166"
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight={isSelected ? 'bold' : 'normal'}
                  fill={isSelected ? '#f1f5f9' : '#64748b'}
                  className="select-none"
                >
                  {dataPoint.dist}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Node Telemetry Detail Card with Spring Feedback */}
      {activePoint && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 sm:p-5 rounded-md bg-[#182232] border border-[#222d3d] text-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Waypoint / Phase</span>
            <span className="font-black text-sm text-white flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#f3b740]" />
              {activePoint.label}
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              {activeTab === 'elevation' ? 'Altitude Above Sea Level' : 'Forecast Temperature'}
            </span>
            <span className="font-extrabold text-base text-[#f3b740] flex items-center gap-1">
              {activeTab === 'elevation' ? (
                <>
                  <Mountain className="w-4 h-4 text-[#f3b740]" />
                  {activePoint.alt} meters
                </>
              ) : (
                <>
                  <Thermometer className="w-4 h-4 text-[#f3b740]" />
                  {activePoint.temp}
                </>
              )}
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              {activeTab === 'elevation' ? 'Road Gradient / Terrain' : 'Atmospheric Humidity'}
            </span>
            <span className="font-bold text-sm text-[#34d399] flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-[#34d399]" />
              {activePoint.grade}
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Curator Telemetry Note</span>
            <span className="font-medium text-slate-300 block line-clamp-2">
              {activePoint.note}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
