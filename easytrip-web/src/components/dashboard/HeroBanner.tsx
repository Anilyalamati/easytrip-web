import React from 'react';
import { useTrip } from '../../context/TripContext';
import { Sparkles, Compass, ShieldCheck, MapPin, ArrowRight } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { setIsPlannerOpen, openPlannerWithDestination } = useTrip();

  return (
    <div className="relative w-full rounded-3xl overflow-hidden my-6 border border-navy-750 glass-card">
      {/* Background Graphic & Glows */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity scale-105 transition-transform duration-1000"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-900/90 to-transparent" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-gold-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative max-w-4xl p-8 sm:p-12 lg:p-16 space-y-6">
        
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill text-xs font-semibold text-gold-300 border border-gold-500/30">
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          <span>EasyTrip AI Travel Intelligence 2.0</span>
        </div>

        {/* Headlines */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
            Let AI plan your <br />
            <span className="gold-gradient-text">perfect escape.</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
            One beautiful plan. Discover curated destinations, live road routes, 5-star boutique stays, and personalized day-by-day itineraries tailored to your style.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="flex flex-wrap gap-4 pt-2 text-xs font-medium text-slate-300">
          <span className="flex items-center gap-1.5 bg-navy-800/80 px-3 py-1.5 rounded-lg border border-navy-700">
            <Compass className="w-3.5 h-3.5 text-gold-400" />
            AI Day-by-Day Route Planner
          </span>
          <span className="flex items-center gap-1.5 bg-navy-800/80 px-3 py-1.5 rounded-lg border border-navy-700">
            <MapPin className="w-3.5 h-3.5 text-gold-400" />
            Real Road Geometry & Map Navigation
          </span>
          <span className="flex items-center gap-1.5 bg-navy-800/80 px-3 py-1.5 rounded-lg border border-navy-700">
            <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
            Travel Safety & SOS Guidance
          </span>
        </div>

        {/* Action Button */}
        <div className="pt-4 flex flex-wrap items-center gap-4">
          <button
            onClick={() => setIsPlannerOpen(true)}
            className="px-6 py-3.5 rounded-2xl gold-gradient-bg text-navy-950 font-bold text-sm tracking-wide shadow-gold-glow hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Design My Trip Now</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <button
            onClick={() => openPlannerWithDestination('Goa')}
            className="px-5 py-3.5 rounded-2xl bg-navy-800/80 hover:bg-navy-750 text-slate-200 border border-gold-500/30 hover:border-gold-500/60 font-semibold text-sm transition-all flex items-center gap-2"
          >
            <span>Explore Goa Itinerary</span>
          </button>
        </div>

      </div>
    </div>
  );
};
