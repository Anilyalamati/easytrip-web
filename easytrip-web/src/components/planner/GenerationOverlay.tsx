import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface GenerationOverlayProps {
  destination: string;
}

const steps = [
  'Understanding your preferences...',
  'Finding authentic local places & sights...',
  'Checking verified travel & transit options...',
  'Curating authentic dining & signature dishes...',
  'Balancing daily pace & realistic INR budget...',
  'Building your verified itinerary...',
  'Your EasyTrip plan is ready.'
];

export const GenerationOverlay: React.FC<GenerationOverlayProps> = ({ destination }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 850);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-midnight-950/70 backdrop-blur-xl p-4">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 text-center relative overflow-hidden shadow-2xl">
        
        {/* Subtle Background Accent */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-brand-100/50 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Icon with Pulse Animation */}
        <div className="relative mx-auto w-20 h-20 mb-6">
          <div className="absolute inset-0 rounded-3xl bg-brand-500/15 blur-lg animate-pulse" />
          <div className="relative w-full h-full rounded-2xl bg-midnight-900 border border-slate-200 flex items-center justify-center p-3 shadow-md">
            <img 
              src="/assets/easytrip_logo.png" 
              alt="EasyTrip Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-brand-600 text-white shadow">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-black text-midnight-900 mb-1.5 tracking-tight">
          Curating Your <span className="text-brand-600">{destination}</span> Journey
        </h3>
        <p className="text-xs text-charcoal-500 mb-8 font-medium">
          EasyTrip AI is assembling verified routes, dining, and hotel stays
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
                    ? 'text-midnight-900 font-bold scale-[1.02] pl-0.5' 
                    : isDone 
                      ? 'text-charcoal-500 opacity-90' 
                      : 'text-charcoal-300 opacity-40'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : isCurrent ? (
                  <div className="w-4 h-4 rounded-full border-2 border-brand-600 border-t-transparent animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                )}
                <span>{step}</span>
              </div>
            );
          })}
        </div>

        {/* Bottom Loading Bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
          <div 
            className="h-full bg-brand-600 transition-all duration-500 rounded-full"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
