import React, { useState } from 'react';
import { useTrip } from '../../context/TripContext';
import { DayCard } from './DayCard';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  IndianRupee, 
  Bookmark, 
  Check, 
  Map, 
  ShoppingBag, 
  Printer, 
  Compass, 
  Plane, 
  Train, 
  Car, 
  Star, 
  Clock, 
  Navigation, 
  CheckCircle2, 
  Plus, 
  ShieldCheck, 
  ArrowRight,
  Route
} from 'lucide-react';
import { TransitOption, HotelRecommendation } from '../../types/trip';

export const ItineraryView: React.FC = () => {
  const { currentTrip, saveCurrentTrip, savedTrips, setActiveView, setIsPlannerOpen, addToCart, cart } = useTrip();
  const [selectedDayFilter, setSelectedDayFilter] = useState<number | 'all'>('all');
  const [isSavedRecently, setIsSavedRecently] = useState(false);
  const [selectedTransitMode, setSelectedTransitMode] = useState<string | null>(null);
  const [reservedHotelId, setReservedHotelId] = useState<string | null>(null);

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

  // Transit breakdown helpers
  const jt = currentTrip.journeyTransit;
  const allTransitOptions: TransitOption[] = jt 
    ? [jt.primaryOption, ...(jt.alternativeOptions || [])]
    : [];

  const currentMode = selectedTransitMode || jt?.preferredMode || 'flight';
  const activeTransitOption = allTransitOptions.find(o => o.mode === currentMode) || jt?.primaryOption;

  const getTransitIcon = (mode: string) => {
    switch (mode) {
      case 'flight': return Plane;
      case 'train': return Train;
      case 'drive':
      case 'cab': return Car;
      default: return Navigation;
    }
  };

  const handleBookHotel = (hotel: HotelRecommendation) => {
    addToCart({
      id: `hotel-${hotel.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      type: 'hotel',
      title: hotel.name,
      subtitle: `${hotel.tier.toUpperCase()} • ${hotel.location}`,
      price: hotel.pricePerNight,
      quantity: 1,
      image: hotel.image,
      badge: hotel.badge
    });
    setReservedHotelId(hotel.name);
    setTimeout(() => setReservedHotelId(null), 2500);
  };

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
              <span className="flex items-center gap-1 font-bold text-gold-300">
                <IndianRupee className="w-4 h-4 text-gold-400" />
                Est. Total ₹{currentTrip.estimatedTotalCost.toLocaleString('en-IN')}
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

      {/* Journey & Transit Breakdown Section */}
      {jt && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-navy-750 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-navy-750 gap-4">
            <div>
              <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Route className="w-4 h-4 text-gold-400" />
                <span>Journey & Transit Breakdown</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {jt.origin} <span className="text-gold-400">→</span> {jt.destination}
                <span className="ml-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-navy-800 text-slate-300 border border-navy-700">
                  Approx. {jt.distanceKm} km
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Preferred mode: <strong className="text-white capitalize">{jt.preferredMode}</strong>. Compare routes, travel times, and realistic INR costs below.
              </p>
            </div>

            {/* Interactive Mode Switcher Tabs */}
            <div className="flex flex-wrap gap-1.5 self-start sm:self-auto bg-navy-900/90 p-1.5 rounded-2xl border border-navy-750">
              {allTransitOptions.map(opt => {
                const ModeIcon = getTransitIcon(opt.mode);
                const isSelected = (opt.mode === currentMode);
                return (
                  <button
                    key={opt.mode}
                    onClick={() => setSelectedTransitMode(opt.mode)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-gold-500 text-navy-950 shadow-gold-glow'
                        : 'text-slate-300 hover:text-white hover:bg-navy-800'
                    }`}
                  >
                    <ModeIcon className="w-3.5 h-3.5" />
                    <span className="capitalize">{opt.mode}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Option Detail Card */}
          {activeTransitOption && (
            <div className="p-5 sm:p-6 rounded-2xl bg-navy-900/90 border border-navy-700/80 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-gold-500/20 text-gold-300 border border-gold-500/30 text-[10px] font-extrabold uppercase">
                      {activeTransitOption.mode === jt.preferredMode ? '★ Selected Choice' : 'Alternative Mode'}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      {activeTransitOption.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    {activeTransitOption.routeOverview}
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 shrink-0 bg-navy-800/80 px-4 py-2.5 rounded-xl border border-navy-700">
                  <div className="flex items-center gap-1 text-gold-300 font-extrabold text-base sm:text-lg">
                    <IndianRupee className="w-4 h-4 text-gold-400" />
                    <span>₹{activeTransitOption.estimatedCost.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="w-3 h-3 text-gold-400" />
                    <span>{activeTransitOption.duration}</span>
                  </div>
                </div>
              </div>

              {/* Terminal Details if applicable */}
              {activeTransitOption.terminalDetails && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-navy-800 text-xs">
                  <div className="p-3 rounded-xl bg-navy-850 border border-navy-750">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">Origin Terminal / Station</span>
                    <span className="font-semibold text-slate-200">{activeTransitOption.terminalDetails.departureTerminal}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-navy-850 border border-navy-750">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">Destination Hub & Transit</span>
                    <span className="font-semibold text-gold-300">{activeTransitOption.terminalDetails.arrivalTerminal}</span>
                  </div>
                </div>
              )}

              {/* Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                {activeTransitOption.highlights.map((hl, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-300 p-2.5 rounded-xl bg-navy-850/60 border border-navy-750">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>

              {/* Travel Tips */}
              {jt.travelTips && jt.travelTips.length > 0 && (
                <div className="pt-3 border-t border-navy-800">
                  <span className="text-[11px] font-bold text-gold-400 uppercase tracking-wide block mb-1.5">
                    💡 Transit & Local Navigation Tips:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {jt.travelTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-1.5 shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Recommended Stays Section */}
      {currentTrip.hotelRecommendations && currentTrip.hotelRecommendations.length > 0 && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-navy-750 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-navy-750 gap-2">
            <div>
              <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
                <span>Verified Accommodations</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Recommended Stays in <span className="gold-gradient-text">{currentTrip.destination}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Authentic hotel options tailored for your selected <strong className="text-white capitalize">{currentTrip.budgetTier}</strong> tier.
              </p>
            </div>
            <button
              onClick={() => setActiveView('booking')}
              className="text-xs text-gold-400 hover:text-gold-300 font-bold flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Explore All Booking Options</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentTrip.hotelRecommendations.map((hotel, idx) => {
              const inCart = cart.some(i => i.title === hotel.name) || reservedHotelId === hotel.name;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-navy-900/90 border border-navy-750 hover:border-gold-500/40 transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div>
                    <div className="relative h-44 w-full overflow-hidden">
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-navy-900/90 text-[10px] font-bold text-gold-300 border border-gold-500/30 uppercase">
                        {hotel.badge}
                      </span>
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-navy-900/90 text-xs font-bold text-white">
                        <Star className="w-3 h-3 text-gold-400 fill-gold-400" />
                        <span>{hotel.rating}</span>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <h4 className="text-base font-bold text-white group-hover:text-gold-300 transition-colors">
                        {hotel.name}
                      </h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gold-400 shrink-0" />
                        {hotel.location}
                      </p>

                      <div className="flex flex-wrap gap-1 pt-1.5">
                        {hotel.amenities.map(a => (
                          <span key={a} className="text-[9px] px-2 py-0.5 rounded-md bg-navy-800 text-slate-300 border border-navy-700">
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-3 border-t border-navy-800/80 flex items-center justify-between mt-2">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Nightly Rate</span>
                      <div className="text-base font-extrabold text-white flex items-center">
                        <IndianRupee className="w-3.5 h-3.5 text-gold-400" />
                        <span>{hotel.pricePerNight.toLocaleString('en-IN')}</span>
                        <span className="text-[10px] text-slate-400 font-normal ml-1">/ night</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleBookHotel(hotel)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                        inCart
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'gold-gradient-bg text-navy-950 hover:brightness-110 shadow-sm'
                      }`}
                    >
                      {inCart ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Plus className="w-3.5 h-3.5" />}
                      <span>{inCart ? 'Reserved' : 'Reserve'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
              <span className="text-xs text-gold-400 font-bold flex items-center">
                <IndianRupee className="w-3 h-3 text-gold-400 mr-0.5" />
                ₹{currentTrip.estimatedTotalCost.toLocaleString('en-IN')} Est.
              </span>
            </div>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex justify-between py-1 border-b border-navy-750">
                <span>Daily Activities & Sightseeing</span>
                <span className="font-semibold text-slate-200">
                  ₹{Math.round(currentTrip.estimatedTotalCost * 0.45).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-navy-750">
                <span>Curated Dining & Cafes</span>
                <span className="font-semibold text-slate-200">
                  ₹{Math.round(currentTrip.estimatedTotalCost * 0.35).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span>Local Transit & Entry Passes</span>
                <span className="font-semibold text-slate-200">
                  ₹{Math.round(currentTrip.estimatedTotalCost * 0.20).toLocaleString('en-IN')}
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
