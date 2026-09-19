import React, { useState } from 'react';
import { useTrip } from '../../context/TripContext';
import { DayCard } from './DayCard';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Bookmark, 
  Check, 
  Map, 
  ShoppingBag, 
  Printer, 
  ArrowLeft,
  Compass,
  Users
} from 'lucide-react';

export const ItineraryView: React.FC = () => {
  const { currentTrip, saveCurrentTrip, savedTrips, setActiveView, setIsPlannerOpen } = useTrip();
  const [selectedDayFilter, setSelectedDayFilter] = useState<number | 'all'>('all');
  const [isSavedRecently, setIsSavedRecently] = useState(false);

  if (!currentTrip) {
    return (
      <div className="my-16 text-center py-20 glass-card rounded-3xl border border-navy-750 max-w-xl mx-auto p-8">
        <div className="w-16 h-16 rounded-3xl bg-navy-850 border border-gold-500/30 flex items-center justify-center mx-auto mb-4 text-gold-400">
          <Sparkles className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">No Active Itinerary</h3>
        <p className="text-sm text-slate-400 mb-6 max-w-sm mx-auto">
          Create your first trip with EasyTrip AI and your full day-by-day itinerary will appear here automatically.
        </p>
        <button
          onClick={() => setIsPlannerOpen(true)}
          className="px-6 py-3 rounded-2xl gold-gradient-bg text-navy-950 font-bold text-xs tracking-wide shadow-gold-glow hover:brightness-110 transition-all inline-flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Design a Trip Now</span>
        </button>
      </div>
    );
  }

  const isAlreadySaved = savedTrips.some(t => t.id === currentTrip.id) || isSavedRecently;

  const handleSave = () => {
    saveCurrentTrip();
    setIsSavedRecently(true);
    setTimeout(() => setIsSavedRecently(false), 3000);
  };

  const filteredDays = selectedDayFilter === 'all'
    ? currentTrip.itineraryDays
    : currentTrip.itineraryDays.filter(d => d.dayNumber === selectedDayFilter);

  return (
    <div className="my-8 space-y-8">
      {/* Top Banner Header */}
      <div className="relative rounded-3xl overflow-hidden glass-card border border-gold-500/30 shadow-navy-card">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 scale-105"
          style={{ backgroundImage: `url(${currentTrip.heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-900/80 to-navy-950/60" />

        <div className="relative p-6 sm:p-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-gold-500/20 border border-gold-500/40 text-gold-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> EasyTrip AI Curated
              </span>
              <span className="px-2.5 py-1 rounded-full bg-navy-800/80 border border-navy-700 text-xs font-semibold text-slate-300 capitalize">
                {currentTrip.budgetTier} Tier
              </span>
              <span className="px-2.5 py-1 rounded-full bg-navy-800/80 border border-navy-700 text-xs font-semibold text-slate-300">
                {currentTrip.travelStyle}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {currentTrip.destination}, <span className="gold-gradient-text">{currentTrip.country}</span>
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300">
              <span className="flex items-center gap-1">
                <Compass className="w-4 h-4 text-gold-400" />
                From {currentTrip.origin}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-gold-400" />
                {currentTrip.days} Days ({currentTrip.startDate})
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-gold-400" />
                Est. Total ${currentTrip.estimatedTotalCost}
              </span>
            </div>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            <button
              onClick={handleSave}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                isAlreadySaved
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-navy-800 text-slate-200 border-navy-700 hover:border-gold-500/40'
              }`}
            >
              {isAlreadySaved ? <Check className="w-4 h-4 text-emerald-400" /> : <Bookmark className="w-4 h-4" />}
              <span>{isAlreadySaved ? 'Saved to Trips' : 'Save Itinerary'}</span>
            </button>

            <button
              onClick={() => setActiveView('map')}
              className="px-4 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-750 text-slate-200 border border-navy-700 hover:border-gold-500/40 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Map className="w-4 h-4 text-gold-400" />
              <span>Road Route</span>
            </button>

            <button
              onClick={() => setActiveView('booking')}
              className="px-4 py-2.5 rounded-xl gold-gradient-bg text-navy-950 font-bold text-xs tracking-wide shadow-gold-glow hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Book Stays & Transport</span>
            </button>

            <button
              onClick={() => window.print()}
              className="p-2.5 rounded-xl bg-navy-800 border border-navy-700 text-slate-400 hover:text-white transition-all hidden sm:flex"
              title="Print Itinerary"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Day Filter Tabs */}
        <div className="px-6 sm:px-10 py-3 bg-navy-900/90 border-t border-navy-800 flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-2 shrink-0">
            Select Day:
          </span>
          <button
            onClick={() => setSelectedDayFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
              selectedDayFilter === 'all'
                ? 'bg-gold-500 text-navy-950 shadow'
                : 'bg-navy-800 text-slate-300 hover:bg-navy-750'
            }`}
          >
            All Days ({currentTrip.days})
          </button>
          {currentTrip.itineraryDays.map(d => (
            <button
              key={d.dayNumber}
              onClick={() => setSelectedDayFilter(d.dayNumber)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
                selectedDayFilter === d.dayNumber
                  ? 'bg-gold-500 text-navy-950 shadow'
                  : 'bg-navy-800 text-slate-300 hover:bg-navy-750'
              }`}
            >
              Day {d.dayNumber}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Days List + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Days Itinerary */}
        <div className="lg:col-span-2 space-y-6">
          {filteredDays.map(day => (
            <DayCard key={day.dayNumber} day={day} />
          ))}
        </div>

        {/* Right 1 Col: AI Insights & Quick Stats */}
        <div className="space-y-6">
          {/* AI Curator Notes */}
          <div className="glass-card rounded-3xl p-6 border border-gold-500/25 space-y-4">
            <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>EasyTrip AI Design Notes</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
              {currentTrip.aiNotes?.map((note, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-1.5 shrink-0" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Budget & Cost Estimator Card */}
          <div className="glass-card rounded-3xl p-6 border border-navy-750 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Budget Breakdown
              </h4>
              <span className="text-xs text-gold-400 font-semibold">
                {currentTrip.currency}{currentTrip.estimatedTotalCost} Est.
              </span>
            </div>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex justify-between py-1 border-b border-navy-750">
                <span>Daily Activities & Sightseeing</span>
                <span className="font-semibold text-slate-200">
                  ${Math.round(currentTrip.estimatedTotalCost * 0.45)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-navy-750">
                <span>Curated Dining & Cafes</span>
                <span className="font-semibold text-slate-200">
                  ${Math.round(currentTrip.estimatedTotalCost * 0.35)}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span>Local Transit & Entry Passes</span>
                <span className="font-semibold text-slate-200">
                  ${Math.round(currentTrip.estimatedTotalCost * 0.20)}
                </span>
              </div>
            </div>
            <button
              onClick={() => setActiveView('booking')}
              className="w-full py-2.5 rounded-xl bg-navy-800 hover:bg-gold-500 hover:text-navy-950 text-slate-200 font-bold text-xs tracking-wide border border-navy-700 hover:border-gold-400 transition-all flex items-center justify-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add Hotel & Travel Passes</span>
            </button>
          </div>

          {/* Plan Another Trip CTA */}
          <div className="p-6 rounded-3xl bg-navy-850 border border-navy-700 text-center space-y-3">
            <h4 className="text-sm font-bold text-white">Want to adjust your trip?</h4>
            <p className="text-xs text-slate-400">
              Re-run the planner with new dates, other travel companions, or a different budget tier.
            </p>
            <button
              onClick={() => setIsPlannerOpen(true)}
              className="w-full py-2.5 rounded-xl bg-navy-800 hover:bg-navy-750 text-gold-400 border border-gold-500/40 font-semibold text-xs transition-all"
            >
              Modify Plan & Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
