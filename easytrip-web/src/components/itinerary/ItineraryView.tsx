import React, { useState } from 'react';
import { useTrip } from '../../context/TripContext';
import { DayCard } from './DayCard';
import { ElevationForecastSection } from './ElevationForecastSection';
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
import { ScrollReveal } from '../common/ScrollReveal';

export const ItineraryView: React.FC = () => {
  const { currentTrip, saveCurrentTrip, savedTrips, setActiveView, setIsPlannerOpen, addToCart, cart } = useTrip();
  const [selectedDayFilter, setSelectedDayFilter] = useState<number | 'all'>('all');
  const [isSavedRecently, setIsSavedRecently] = useState(false);
  const [selectedTransitMode, setSelectedTransitMode] = useState<string | null>(null);
  const [reservedHotelId, setReservedHotelId] = useState<string | null>(null);

  if (!currentTrip) {
    return (
      <div className="my-16 text-center py-20 bg-[#141b26] rounded-md border border-[#222d3d] max-w-xl mx-auto p-8 shadow-2xl">
        <div className="w-16 h-16 rounded-sm bg-[#182232] border border-[#f3b740]/30 flex items-center justify-center mx-auto mb-4 text-[#f3b740]">
          <Sparkles className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">No Active Itinerary</h3>
        <p className="text-sm text-slate-400 mb-6 max-w-sm mx-auto">
          Create your first trip with EasyTrip AI and your full day-by-day itinerary will appear here automatically.
        </p>
        <button
          onClick={() => setIsPlannerOpen(true)}
          className="px-6 py-3 rounded-sm gold-gradient-bg text-[#0e131f] font-bold text-xs tracking-wide shadow-gold-glow hover:brightness-110 transition-all inline-flex items-center gap-2"
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
    <div id="itinerary-view-container" className="my-8 space-y-8 scroll-mt-24">
      {/* Top Banner Header */}
      <div className="relative rounded-md overflow-hidden bg-[#141b26] border border-[#222d3d] shadow-2xl specular-sheen">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 scale-105"
          style={{ backgroundImage: `url(${currentTrip.heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-[#141b26]/90 to-[#141b26]/70" />

        <div className="relative p-6 sm:p-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-sm bg-[#f3b740]/15 border border-[#f3b740]/30 text-[#f3b740] text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> EasyTrip AI Curated
              </span>
              <span className="px-2.5 py-1 rounded-sm bg-[#182232] border border-[#222d3d] text-xs font-semibold text-slate-300 capitalize">
                {currentTrip.budgetTier} Tier
              </span>
              <span className="px-2.5 py-1 rounded-sm bg-[#182232] border border-[#222d3d] text-xs font-semibold text-slate-300">
                {currentTrip.travelStyle}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {currentTrip.destination}, <span className="gold-gradient-text">{currentTrip.country}</span>
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300">
              <span className="flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#f3b740]" />
                From {currentTrip.origin}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#f3b740]" />
                {currentTrip.days} Days ({currentTrip.startDate})
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm bg-[#062c20] border border-[#059669]/40 text-[#34d399] font-bold text-xs">
                <IndianRupee className="w-3.5 h-3.5 text-[#34d399]" />
                Est. Total ₹{currentTrip.estimatedTotalCost.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            <button
              onClick={handleSave}
              className={`px-4 py-2.5 rounded-sm border text-xs font-bold flex items-center gap-1.5 transition-all ${
                isAlreadySaved
                  ? 'bg-[#062c20] text-[#34d399] border-[#059669]/40'
                  : 'bg-[#182232] text-slate-200 border-[#222d3d] hover:border-[#f3b740]/40'
              }`}
            >
              {isAlreadySaved ? <Check className="w-4 h-4 text-[#34d399]" /> : <Bookmark className="w-4 h-4 text-[#f3b740]" />}
              <span>{isAlreadySaved ? 'Saved to Trips' : 'Save Itinerary'}</span>
            </button>

            <button
              onClick={() => setActiveView('map')}
              className="px-4 py-2.5 rounded-sm bg-[#182232] hover:bg-[#1f2c3f] text-slate-200 border border-[#222d3d] hover:border-[#f3b740]/40 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Map className="w-4 h-4 text-[#f3b740]" />
              <span>Road Route</span>
            </button>

            <button
              onClick={() => setActiveView('booking')}
              className="px-4 py-2.5 rounded-sm gold-gradient-bg text-[#0e131f] font-bold text-xs tracking-wide shadow-gold-glow hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Book Stays & Transport</span>
            </button>

            <button
              onClick={() => window.print()}
              className="p-2.5 rounded-sm bg-[#182232] border border-[#222d3d] text-slate-400 hover:text-white transition-all hidden sm:flex"
              title="Print Itinerary"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Day Filter Tabs */}
        <div className="px-6 sm:px-10 py-3 bg-[#0f1520] border-t border-[#222d3d] flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-2 shrink-0">
            Select Day:
          </span>
          <button
            onClick={() => setSelectedDayFilter('all')}
            className={`px-3.5 py-1.5 rounded-sm text-xs font-bold transition-all shrink-0 ${
              selectedDayFilter === 'all'
                ? 'bg-[#f3b740] text-[#0e131f] shadow-sm'
                : 'bg-[#182232] text-slate-300 hover:bg-[#1f2c3f] border border-[#222d3d]'
            }`}
          >
            All Days ({currentTrip.days})
          </button>
          {currentTrip.itineraryDays.map(d => (
            <button
              key={d.dayNumber}
              onClick={() => setSelectedDayFilter(d.dayNumber)}
              className={`px-3.5 py-1.5 rounded-sm text-xs font-bold transition-all shrink-0 ${
                selectedDayFilter === d.dayNumber
                  ? 'bg-[#f3b740] text-[#0e131f] shadow-sm'
                  : 'bg-[#182232] text-slate-300 hover:bg-[#1f2c3f] border border-[#222d3d]'
              }`}
            >
              Day {d.dayNumber}
            </button>
          ))}
        </div>
      </div>

      {/* Journey & Transit Breakdown Section */}
      {jt && (
        <div className="bg-[#141b26] rounded-md p-6 sm:p-8 border border-[#222d3d] space-y-6 shadow-xl specular-sheen">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#222d3d] gap-4">
            <div>
              <div className="flex items-center gap-2 text-[#f3b740] text-xs font-bold uppercase tracking-wider mb-1">
                <Route className="w-4 h-4 text-[#f3b740]" />
                <span>Journey & Transit Breakdown</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {jt.origin} <span className="text-[#f3b740]">→</span> {jt.destination}
                <span className="ml-3 text-xs font-semibold px-2.5 py-1 rounded-sm bg-[#182232] text-slate-300 border border-[#222d3d]">
                  Approx. {jt.distanceKm} km
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Preferred mode: <strong className="text-white capitalize">{jt.preferredMode}</strong>. Compare routes, travel times, and realistic INR costs below.
              </p>
            </div>

            {/* Interactive Mode Switcher Tabs */}
            <div className="flex flex-wrap gap-1.5 self-start sm:self-auto bg-[#0f1520] p-1.5 rounded-sm border border-[#222d3d]">
              {allTransitOptions.map(opt => {
                const ModeIcon = getTransitIcon(opt.mode);
                const isSelected = (opt.mode === currentMode);
                return (
                  <button
                    key={opt.mode}
                    onClick={() => setSelectedTransitMode(opt.mode)}
                    className={`px-3.5 py-1.5 rounded-sm text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#f3b740] text-[#0e131f] shadow-gold-glow'
                        : 'text-slate-300 hover:text-white hover:bg-[#182232]'
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
            <div className="p-5 sm:p-6 rounded-md bg-[#182232] border border-[#222d3d] space-y-4 specular-sheen">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-sm bg-[#f3b740]/15 text-[#f3b740] border border-[#f3b740]/30 text-[10px] font-extrabold uppercase">
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

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 shrink-0 bg-[#062c20] border border-[#059669]/40 px-4 py-2.5 rounded-sm">
                  <div className="flex items-center gap-1 text-[#34d399] font-extrabold text-base sm:text-lg">
                    <IndianRupee className="w-4 h-4 text-[#34d399]" />
                    <span>₹{activeTransitOption.estimatedCost.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[#a7f3d0]">
                    <Clock className="w-3 h-3 text-[#34d399]" />
                    <span>{activeTransitOption.duration}</span>
                  </div>
                </div>
              </div>

              {/* Terminal Details if applicable */}
              {activeTransitOption.terminalDetails && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#222d3d] text-xs">
                  <div className="p-3 rounded-sm bg-[#141b26] border border-[#222d3d]">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">Origin Terminal / Station</span>
                    <span className="font-semibold text-slate-200">{activeTransitOption.terminalDetails.departureTerminal}</span>
                  </div>
                  <div className="p-3 rounded-sm bg-[#141b26] border border-[#222d3d]">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">Destination Hub & Transit</span>
                    <span className="font-semibold text-[#f3b740]">{activeTransitOption.terminalDetails.arrivalTerminal}</span>
                  </div>
                </div>
              )}

              {/* Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                {activeTransitOption.highlights.map((hl, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-300 p-2.5 rounded-sm bg-[#141b26] border border-[#222d3d]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#34d399] shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>

              {/* Travel Tips */}
              {jt.travelTips && jt.travelTips.length > 0 && (
                <div className="pt-3 border-t border-[#222d3d]">
                  <span className="text-[11px] font-bold text-[#f3b740] uppercase tracking-wide block mb-1.5">
                    💡 Transit & Local Navigation Tips:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {jt.travelTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-sm bg-[#f3b740] mt-1.5 shrink-0" />
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

      {/* Dynamic Route Elevation & Climate Forecast Section with Self-Drawing Curve & Area Fill Wipe */}
      <ElevationForecastSection
        destination={currentTrip.destination}
        origin={currentTrip.origin}
        distanceKm={jt?.distanceKm || 580}
        tempBase={currentTrip.itineraryDays[0]?.weather?.temp || 28}
      />

      {/* Recommended Stays Section */}
      {currentTrip.hotelRecommendations && currentTrip.hotelRecommendations.length > 0 && (
        <div className="bg-[#141b26] rounded-md p-6 sm:p-8 border border-[#222d3d] space-y-6 shadow-xl specular-sheen">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#222d3d] gap-2">
            <div>
              <div className="flex items-center gap-2 text-[#f3b740] text-xs font-bold uppercase tracking-wider mb-1">
                <Star className="w-3.5 h-3.5 fill-[#f3b740] text-[#f3b740]" />
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
              className="text-xs text-[#f3b740] hover:text-[#fbbf24] font-bold flex items-center gap-1.5 self-start sm:self-auto transition-colors"
            >
              <span>Explore All Booking Options</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentTrip.hotelRecommendations.map((hotel, idx) => {
              const inCart = cart.some(i => i.title === hotel.name) || reservedHotelId === hotel.name;
              return (
                <ScrollReveal
                  key={idx}
                  index={idx}
                  staggerMs={110}
                  className="h-full flex flex-col"
                >
                  <div
                    className="rounded-md bg-[#182232] border border-[#222d3d] hover:border-[#f3b740]/40 transition-all flex flex-col justify-between overflow-hidden group shadow-md specular-sheen h-full"
                  >
                    <div>
                      <div className="relative h-44 w-full overflow-hidden">
                        <img
                          src={hotel.image}
                          alt={hotel.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#182232] via-transparent to-transparent" />
                        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-sm bg-[#0b0e14]/85 backdrop-blur-md text-[10px] font-bold text-[#f3b740] border border-[#222d3d] uppercase tracking-wider">
                          {hotel.badge || `${hotel.tier} stay`}
                        </span>
                        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-[#0b0e14]/85 backdrop-blur-md text-xs font-bold text-white border border-[#222d3d]">
                          <Star className="w-3 h-3 text-[#f3b740] fill-[#f3b740]" />
                          <span>{hotel.rating}</span>
                        </div>
                      </div>

                      <div className="p-4 space-y-2">
                        <h4 className="text-base font-bold text-white group-hover:text-[#f3b740] transition-colors">
                          {hotel.name}
                        </h4>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#f3b740] shrink-0" />
                          {hotel.location}
                        </p>

                        <div className="flex flex-wrap gap-1 pt-1.5">
                          {hotel.amenities.map(a => (
                            <span key={a} className="text-[9px] px-2 py-0.5 rounded-sm bg-[#141b26] text-slate-300 border border-[#222d3d]">
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-3 border-t border-[#222d3d] flex items-center justify-between mt-2 bg-[#141b26]/50">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">Nightly Rate</span>
                        <div className="text-base font-extrabold text-[#34d399] flex items-center">
                          <IndianRupee className="w-3.5 h-3.5 text-[#34d399]" />
                          <span>{hotel.pricePerNight.toLocaleString('en-IN')}</span>
                          <span className="text-[10px] text-slate-400 font-normal ml-1">/ night</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleBookHotel(hotel)}
                        className={`px-3.5 py-1.5 rounded-sm text-xs font-bold transition-all flex items-center gap-1 ${
                          inCart
                            ? 'bg-[#062c20] text-[#34d399] border border-[#059669]/40'
                            : 'gold-gradient-bg text-[#0e131f] hover:brightness-110 shadow-sm'
                        }`}
                      >
                        {inCart ? <Check className="w-3.5 h-3.5 text-[#34d399]" /> : <Plus className="w-3.5 h-3.5" />}
                        <span>{inCart ? 'Reserved' : 'Reserve'}</span>
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Grid: Days List + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Days Itinerary */}
        <div className="lg:col-span-2 space-y-6">
          {filteredDays.map((day, idx) => (
            <ScrollReveal key={day.dayNumber} index={idx} staggerMs={120}>
              <DayCard day={day} />
            </ScrollReveal>
          ))}
        </div>

        {/* Right 1 Col: AI Insights & Quick Stats */}
        <div className="space-y-6">
          {/* AI Curator Notes */}
          <div className="bg-[#141b26] rounded-md p-6 border border-[#f3b740]/25 space-y-4 shadow-xl specular-sheen">
            <div className="flex items-center gap-2 text-[#f3b740] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>EasyTrip AI Design Notes</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
              {currentTrip.aiNotes?.map((note, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-sm bg-[#f3b740] mt-1.5 shrink-0" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Budget & Cost Estimator Card */}
          <div className="bg-[#141b26] rounded-md p-6 border border-[#222d3d] space-y-4 shadow-xl specular-sheen">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Budget Breakdown
              </h4>
              <span className="text-xs font-bold flex items-center px-2 py-0.5 rounded-sm bg-[#062c20] text-[#34d399] border border-[#059669]/40">
                <IndianRupee className="w-3 h-3 text-[#34d399] mr-0.5" />
                ₹{currentTrip.estimatedTotalCost.toLocaleString('en-IN')} Est.
              </span>
            </div>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex justify-between py-1 border-b border-[#222d3d]">
                <span>Daily Activities & Sightseeing</span>
                <span className="font-semibold text-slate-200">
                  ₹{Math.round(currentTrip.estimatedTotalCost * 0.45).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#222d3d]">
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
              className="w-full py-2.5 rounded-sm bg-[#182232] hover:bg-[#f3b740] hover:text-[#0e131f] text-slate-200 font-bold text-xs tracking-wide border border-[#222d3d] hover:border-[#f3b740] transition-all flex items-center justify-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add Hotel & Travel Passes</span>
            </button>
          </div>

          {/* Plan Another Trip CTA */}
          <div className="p-6 rounded-md bg-[#182232] border border-[#222d3d] text-center space-y-3 shadow-xl">
            <h4 className="text-sm font-bold text-white">Want to adjust your trip?</h4>
            <p className="text-xs text-slate-400">
              Re-run the planner with new dates, other travel companions, or a different budget tier.
            </p>
            <button
              onClick={() => setIsPlannerOpen(true)}
              className="w-full py-2.5 rounded-sm bg-[#141b26] hover:bg-[#1f2c3f] text-[#f3b740] border border-[#f3b740]/40 font-semibold text-xs transition-all"
            >
              Modify Plan & Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
