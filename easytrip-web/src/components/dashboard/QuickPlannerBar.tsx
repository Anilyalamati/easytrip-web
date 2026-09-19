import React, { useState } from 'react';
import { useTrip } from '../../context/TripContext';
import { Sparkles, MapPin, Calendar, Compass, ArrowRight } from 'lucide-react';

export const QuickPlannerBar: React.FC = () => {
  const { planTrip, openPlannerWithDestination } = useTrip();
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState('3');

  const handleQuickPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (destination.trim()) {
      openPlannerWithDestination(destination.trim());
    } else {
      openPlannerWithDestination('Goa');
    }
  };

  return (
    <div className="w-full glass-card p-4 sm:p-5 rounded-3xl border border-gold-500/25 shadow-navy-card -mt-2 mb-10">
      <form onSubmit={handleQuickPlan} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
        
        {/* Destination Input */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-navy-900 border border-navy-700 focus-within:border-gold-500/80 transition-all md:col-span-2">
          <MapPin className="w-4 h-4 text-gold-400 shrink-0" />
          <div className="w-full">
            <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Where to?
            </span>
            <input
              type="text"
              value={destination}
              onChange={e => setDestination(e.target.value)}
              placeholder="Search city, e.g. Goa, Jaipur, Paris, Tokyo..."
              className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-medium"
            />
          </div>
        </div>

        {/* Days selector */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-navy-900 border border-navy-700">
          <Calendar className="w-4 h-4 text-gold-400 shrink-0" />
          <div>
            <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Duration
            </span>
            <select
              value={days}
              onChange={e => setDays(e.target.value)}
              className="bg-transparent text-sm text-white font-medium focus:outline-none cursor-pointer"
            >
              <option value="2" className="bg-navy-900 text-white">2 Days Weekend</option>
              <option value="3" className="bg-navy-900 text-white">3 Days Getaway</option>
              <option value="4" className="bg-navy-900 text-white">4 Days Escape</option>
              <option value="5" className="bg-navy-900 text-white">5 Days Explorer</option>
              <option value="7" className="bg-navy-900 text-white">7 Days Grand Tour</option>
            </select>
          </div>
        </div>

        {/* Action Button */}
        <div>
          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-2xl gold-gradient-bg text-navy-950 font-bold text-xs tracking-wide shadow-gold-glow hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Itinerary</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </form>
    </div>
  );
};
