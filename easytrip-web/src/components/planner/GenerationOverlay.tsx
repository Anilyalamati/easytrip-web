import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface GenerationOverlayProps {
  destination: string;
}

const steps = [
  'Reading your travel brief...',
  'Shaping the perfect route...',
  'Grouping places so your days flow naturally...',
  'Balancing your time & budget...',
  'Keeping the itinerary practical and comfortable...',
  'Polishing your EasyTrip...',
  'Your premium travel plan is almost ready...'
];

export const GenerationOverlay: React.FC<GenerationOverlayProps> = ({ destination }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/90 backdrop-blur-2xl p-4">
      <div className="max-w-md w-full glass-card p-8 rounded-3xl border border-gold-500/30 text-center relative overflow-hidden shadow-gold-glow-lg">
        {/* Background glow circle */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Icon with Pulse Animation */}
        <div className="relative mx-auto w-24 h-24 mb-6">
          <div className="absolute inset-0 rounded-3xl bg-gold-500/20 blur-xl animate-pulse" />
          <div className="relative w-full h-full rounded-3xl bg-navy-800 border-2 border-gold-500/40 flex items-center justify-center p-3 shadow-2xl">
            <img 
              src="/assets/easytrip_logo.png" 
              alt="EasyTrip Logo" 
              className="w-full h-full object-contain animate-bounce"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-gold-500 text-navy-950 shadow-md">
            <Sparkles className="w-4 h-4 animate-spin-slow" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-white mb-1">
          Designing Your <span className="gold-gradient-text">{destination}</span> Escape
        </h3>
        <p className="text-xs text-slate-400 mb-8 font-medium">
          EasyTrip AI is curating a personalized day-by-day plan
        </p>

        {/* Steps Progress List */}
        <div className="space-y-3 text-left mb-8 max-w-xs mx-auto">
          {steps.map((step, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div 
                key={step} 
                className={`flex items-center gap-3 text-xs transition-all duration-300 ${
                  isCurrent 
                    ? 'text-gold-300 font-semibold scale-105 pl-1' 
                    : isDone 
                      ? 'text-slate-400 opacity-80' 
                      : 'text-slate-600 opacity-40'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <div className="w-4 h-4 rounded-full border-2 border-gold-400 border-t-transparent animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                )}
                <span>{step}</span>
              </div>
            );
          })}
        </div>

        {/* Bottom Loading Bar */}
        <div className="w-full bg-navy-800 h-1.5 rounded-full overflow-hidden border border-navy-700">
          <div 
            className="h-full gold-gradient-bg transition-all duration-500 rounded-full"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
