import React from 'react';
import { Compass, ShieldCheck, MapPin, Zap } from 'lucide-react';

export const TripStats: React.FC = () => {
  const stats = [
    {
      icon: Compass,
      value: '100% Tailored',
      label: 'AI Day-by-Day Plans',
      desc: 'Balanced for your exact schedule, travel vibe & budget tier'
    },
    {
      icon: MapPin,
      value: 'Real Road Route',
      label: 'Interactive Navigation',
      desc: 'Powered by road geometry with instant Google Maps sync'
    },
    {
      icon: ShieldCheck,
      value: 'Travel Safety SOS',
      label: 'Emergency Guidance',
      desc: 'Direct access to tourist emergency helplines & embassies'
    },
    {
      icon: Zap,
      value: 'Curated Booking',
      label: 'Stays & Experiences',
      desc: 'Handpicked resorts, flights, and private chauffeur options'
    }
  ];

  return (
    <section className="my-12 py-8 px-6 sm:px-10 rounded-2xl bg-white border border-slate-200/80 shadow-card">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="flex flex-col space-y-2">
              <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-200/60 flex items-center justify-center text-brand-600 mb-1">
                <Icon className="w-6 h-6" />
              </div>
              <div className="text-xl font-bold text-charcoal-900 tracking-tight">
                {s.value}
              </div>
              <div className="text-xs uppercase font-bold text-brand-600 tracking-wider">
                {s.label}
              </div>
              <p className="text-xs text-charcoal-500 leading-relaxed">
                {s.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
