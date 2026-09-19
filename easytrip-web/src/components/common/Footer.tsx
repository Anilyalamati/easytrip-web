import React from 'react';
import { Compass, ShieldCheck, Zap, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-navy-750 bg-navy-950 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Brand Col */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-navy-800 border border-gold-500/30 flex items-center justify-center p-1">
              <img src="/assets/easytrip_logo.png" alt="EasyTrip" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Easy<span className="gold-gradient-text">Trip</span>
            </span>
          </div>
          <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
            Every screen is designed to make travel feel lighter. Intelligently balancing your time, budget, and curiosity into one beautiful plan.
          </p>
          <div className="flex items-center gap-4 text-xs text-gold-400/80 font-medium">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-500" /> Real Road Routing
            </span>
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-gold-500" /> AI Itinerary Engine
            </span>
            <span className="flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-gold-500" /> Global Destinations
            </span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
            Explore Features
          </h4>
          <ul className="space-y-2 text-xs">
            <li className="hover:text-gold-400 transition-colors cursor-pointer">AI Trip Planner</li>
            <li className="hover:text-gold-400 transition-colors cursor-pointer">Live Route Navigation</li>
            <li className="hover:text-gold-400 transition-colors cursor-pointer">Luxury & Boutique Stays</li>
            <li className="hover:text-gold-400 transition-colors cursor-pointer">Chauffeur & Flights Booking</li>
            <li className="hover:text-gold-400 transition-colors cursor-pointer">Travel Safety & SOS</li>
          </ul>
        </div>

        {/* Brand Values */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
            Destinations Catalog
          </h4>
          <ul className="space-y-2 text-xs">
            <li className="hover:text-gold-400 transition-colors cursor-pointer">Goa Beach Escapes</li>
            <li className="hover:text-gold-400 transition-colors cursor-pointer">Jaipur Royal Heritage</li>
            <li className="hover:text-gold-400 transition-colors cursor-pointer">Manali Mountain Retreats</li>
            <li className="hover:text-gold-400 transition-colors cursor-pointer">Parisian Chic Itineraries</li>
            <li className="hover:text-gold-400 transition-colors cursor-pointer">Tokyo Neon Adventures</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-navy-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© 2026 EasyTrip Inc. All rights reserved. Plan more. Worry less.</p>
        <p className="flex items-center gap-1">
          Crafted with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for passionate explorers worldwide
        </p>
      </div>
    </footer>
  );
};
