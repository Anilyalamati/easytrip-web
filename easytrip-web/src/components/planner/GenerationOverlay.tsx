import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, ShieldCheck, Compass, Navigation, Cpu } from 'lucide-react';

interface GenerationOverlayProps {
  destination?: string;
  isClosing?: boolean;
}

const STAGES = [
  {
    id: 1,
    label: 'Understanding your route & travel preferences...',
    desc: 'Analyzing travel dates, group dynamics, pace, and INR budget calibration.',
    icon: Compass,
    startMs: 0,
    endMs: 1200
  },
  {
    id: 2,
    label: 'Contacting Google Gemini Intelligence & mapping verified landmarks...',
    desc: 'Connecting to Google Gemini 2.5 Flash neural engine and querying authentic local sights.',
    icon: Cpu,
    startMs: 1200,
    endMs: 2500
  },
  {
    id: 3,
    label: 'Checking train corridors, highways & regional transit...',
    desc: 'Verifying railway codes, airport transfers, highway routes, and hotel hubs.',
    icon: Navigation,
    startMs: 2500,
    endMs: 3800
  },
  {
    id: 4,
    label: 'Finalizing your personalized day-by-day itinerary...',
    desc: 'Curating regional gastronomy, timing balance, and verified photo streams.',
    icon: Sparkles,
    startMs: 3800,
    endMs: 5200
  }
];

export const GenerationOverlay: React.FC<GenerationOverlayProps> = ({ destination, isClosing = false }) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      setElapsed(Date.now() - start);
    }, 50);

    return () => clearInterval(timer);
  }, []);

  // Determine current active stage based on elapsed time:
  // Stage 1 (0–1.2s), Stage 2 (1.2–2.5s), Stage 3 (2.5–3.8s), Stage 4 (3.8s+)
  let activeStageId = 1;
  if (elapsed >= 3800) activeStageId = 4;
  else if (elapsed >= 2500) activeStageId = 3;
  else if (elapsed >= 1200) activeStageId = 2;

  // Calculate smooth progress percentage
  let progressPercent = Math.min(
    96,
    Math.round(10 + (elapsed / 5000) * 86)
  );
  if (isClosing) progressPercent = 100;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#08090c]/92 backdrop-blur-2xl transition-all duration-500 select-none ${
        isClosing ? 'opacity-0 scale-98 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="max-w-lg w-full bg-[#141b26] p-7 sm:p-9 rounded-md border border-[#222d3d] text-center relative overflow-hidden shadow-[0_10px_50px_rgba(0,0,0,0.85)]">
        
        {/* Ambient Warm Amber Glow in background */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#f3b740]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 right-0 w-64 h-64 bg-[#f3b740]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Pulsing Ambient Amber Indicator Ring & Brand Icon */}
        <div className="relative mx-auto w-24 h-24 mb-6 flex items-center justify-center">
          {/* Outermost Ping Effect */}
          <div className="absolute -inset-3 rounded-full border border-[#f3b740]/40 animate-ping opacity-25" />
          
          {/* Middle Ambient Glowing Ring */}
          <div className="absolute -inset-1 rounded-full border-2 border-[#f3b740]/60 shadow-[0_0_30px_rgba(243,183,64,0.4)] animate-pulse" />
          
          {/* Inner Badge Container */}
          <div className="relative w-[76px] h-[76px] rounded-sm bg-[#182232] border border-[#222d3d] flex items-center justify-center p-3.5 shadow-2xl z-10">
            <img 
              src="/assets/easytrip_logo.png" 
              alt="EasyTrip" 
              className="w-full h-full object-contain"
            />
          </div>
          
          {/* Spinning Sparkle Accent */}
          <div className="absolute -bottom-1 -right-1 p-1.5 rounded-sm bg-[#f3b740] text-[#0e131f] shadow-[0_0_10px_rgba(243,183,64,0.5)] z-20">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
          </div>
        </div>

        {/* Header & Destination Eyebrow */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-[#182232] border border-[#f3b740]/30 text-[#f3b740] text-[11px] font-bold uppercase tracking-wider mb-2">
          <Cpu className="w-3 h-3 text-[#f3b740]" />
          <span>Google Gemini 2.5 Flash Intelligence</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-tight">
          Curating Your <span className="gold-gradient-text">{destination || 'Destination'}</span> Journey
        </h3>
        <p className="text-xs text-[#94a3b8] mb-6 font-medium">
          EasyTrip AI is assembling verified sightseeing landmarks, transit corridors, and authentic regional dining.
        </p>

        {/* 4-Stage Sequential Progress Timeline */}
        <div className="space-y-3 text-left mb-6 bg-[#0e131f]/70 p-4 rounded-sm border border-[#222d3d]">
          {STAGES.map((st) => {
            const isDone = st.id < activeStageId;
            const isCurrent = st.id === activeStageId;

            return (
              <div 
                key={st.id} 
                className={`flex items-start gap-3 text-xs transition-all duration-300 ${
                  isCurrent 
                    ? 'text-[#f3b740] font-bold pl-1' 
                    : isDone 
                      ? 'text-[#cbd5e1] opacity-90' 
                      : 'text-[#64748b] opacity-45'
                }`}
              >
                {isDone ? (
                  <div className="mt-0.5 w-4 h-4 rounded-full bg-[#062c20] border border-[#059669]/60 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#34d399]" />
                  </div>
                ) : isCurrent ? (
                  <div className="mt-0.5 w-4 h-4 rounded-full border-2 border-[#f3b740] border-t-transparent animate-spin shrink-0" />
                ) : (
                  <div className="mt-0.5 w-4 h-4 rounded-full border border-[#222d3d] shrink-0" />
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`font-semibold text-xs ${isCurrent ? 'text-[#f3b740]' : isDone ? 'text-[#f1f5f9]' : 'text-[#64748b]'}`}>
                      {st.label}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-sm bg-[#f3b740]/20 text-[#f3b740] border border-[#f3b740]/40 animate-pulse shrink-0">
                        Active
                      </span>
                    )}
                  </div>
                  {isCurrent && (
                    <p className="text-[11px] text-[#94a3b8] font-normal mt-0.5 leading-snug">
                      {st.desc}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Metrics & Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-[#94a3b8]">
            <span className="flex items-center gap-1 text-[#cbd5e1]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#34d399]" />
              Stage {activeStageId} of 4
            </span>
            <span className="text-[#f3b740] font-bold">{progressPercent}%</span>
          </div>

          <div className="w-full bg-[#182232] h-2.5 rounded-sm overflow-hidden border border-[#222d3d]">
            <div 
              className="h-full bg-gradient-to-r from-[#f7d56e] via-[#f3b740] to-[#e5a83b] transition-all duration-300 rounded-sm shadow-[0_0_12px_rgba(243,183,64,0.5)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  );
};
