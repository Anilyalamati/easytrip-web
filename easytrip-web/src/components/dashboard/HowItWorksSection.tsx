import React from 'react';
import { 
  Sparkles, 
  Compass, 
  Cpu, 
  ShieldCheck, 
  HeartHandshake, 
  ArrowRight 
} from 'lucide-react';
import { ScrollReveal } from '../common/ScrollReveal';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Tell Us Your Plan',
      icon: Compass,
      desc: 'Enter your destination, dates, budget tier, companion style, and preferred activities in seconds.'
    },
    {
      step: '02',
      title: 'AI Builds Your Journey',
      icon: Cpu,
      desc: 'EasyTrip AI crafts day-by-day sightseeing landmarks, authentic regional dining, stays, and transit.'
    },
    {
      step: '03',
      title: 'AI Analyzes Safety',
      icon: ShieldCheck,
      desc: 'Evaluates 8 safety factors, hospital and police proximity, safe departure hours, and optimal highway routes.'
    },
    {
      step: '04',
      title: 'Travel With Confidence',
      icon: HeartHandshake,
      desc: 'Enjoy one-touch 3-second SOS protection, verified emergency directory, and our 24/7 AI travel concierge.'
    }
  ];

  return (
    <section id="how-it-works-section" className="my-16 sm:my-20 scroll-mt-24">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-[#182232] text-[#f3b740] text-xs font-bold border border-[#f3b740]/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>HOW EASYTRIP WORKS</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#f1f5f9] tracking-tight">
          Four simple steps to intelligent travel.
        </h2>
        <p className="text-sm text-[#94a3b8] leading-relaxed">
          From initial inspiration to on-the-road peace of mind, EasyTrip seamlessly unifies AI planning, road telemetry, and active traveler safety.
        </p>
      </div>

      {/* 4 Steps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <ScrollReveal
              key={item.step}
              index={idx}
              staggerMs={110}
              className="h-full flex flex-col"
            >
              <div className="surface-elevated rounded-md p-6 border border-[#222d3d] hover:border-[#f3b740]/40 transition-all bg-[#141b26] shadow-xl specular-sheen h-full flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-[#f3b740] tracking-tight">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-sm bg-[#182232] border border-[#222d3d] flex items-center justify-center text-[#f3b740] group-hover:border-[#f3b740]/40 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-[#f3b740] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#94a3b8] leading-relaxed mt-2">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-[#222d3d]/50 flex items-center gap-1 text-[11px] font-semibold text-slate-400 group-hover:text-[#f3b740] transition-colors">
                  <span>Step {idx + 1} of 4</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
};
