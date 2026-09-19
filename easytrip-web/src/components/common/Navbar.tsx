import React from 'react';
import { useTrip } from '../../context/TripContext';
import { Sparkles, Bookmark, ShoppingBag, ShieldAlert, MapPin, Compass } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    setIsPlannerOpen,
    savedTrips,
    cart,
    setIsSavedTripsOpen,
    setIsSosOpen,
    setIsCheckoutOpen,
  } = useTrip();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-navy-750 bg-navy-900/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div 
          onClick={() => setActiveView('dashboard')}
          className="flex items-center gap-3.5 cursor-pointer group"
        >
          <div className="relative w-11 h-11 rounded-2xl bg-navy-800 border border-gold-500/30 flex items-center justify-center p-1.5 shadow-gold-glow group-hover:border-gold-500/60 transition-all">
            <img 
              src="/assets/easytrip_logo.png" 
              alt="EasyTrip Logo" 
              className="w-full h-full object-contain filter drop-shadow"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-bold tracking-tight text-white font-sans">
                Easy<span className="gold-gradient-text">Trip</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-gold-500/20 text-gold-300 border border-gold-500/30">
                AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium tracking-wide">
              Travel smarter. Travel safer.
            </p>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-navy-850/80 p-1.5 rounded-full border border-navy-700/60 shadow-inner">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all flex items-center gap-2 ${
              activeView === 'dashboard'
                ? 'bg-gold-500 text-navy-950 shadow-md font-bold'
                : 'text-slate-300 hover:text-gold-400 hover:bg-navy-800/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Explore
          </button>

          <button
            onClick={() => setActiveView('itinerary')}
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all flex items-center gap-2 ${
              activeView === 'itinerary'
                ? 'bg-gold-500 text-navy-950 shadow-md font-bold'
                : 'text-slate-300 hover:text-gold-400 hover:bg-navy-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Itinerary
          </button>

          <button
            onClick={() => setActiveView('booking')}
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all flex items-center gap-2 ${
              activeView === 'booking'
                ? 'bg-gold-500 text-navy-950 shadow-md font-bold'
                : 'text-slate-300 hover:text-gold-400 hover:bg-navy-800/60'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Stays & Travel
          </button>

          <button
            onClick={() => setActiveView('map')}
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all flex items-center gap-2 ${
              activeView === 'map'
                ? 'bg-gold-500 text-navy-950 shadow-md font-bold'
                : 'text-slate-300 hover:text-gold-400 hover:bg-navy-800/60'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            Route Map
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Saved Trips Trigger */}
          <button
            onClick={() => setIsSavedTripsOpen(true)}
            className="relative p-2.5 rounded-xl bg-navy-800/80 border border-navy-700/80 text-slate-300 hover:text-gold-400 hover:border-gold-500/40 transition-all"
            title="Saved Trips"
          >
            <Bookmark className="w-4 h-4" />
            {savedTrips.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gold-500 text-navy-950 text-[10px] font-bold flex items-center justify-center shadow-md">
                {savedTrips.length}
              </span>
            )}
          </button>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="relative p-2.5 rounded-xl bg-navy-800/80 border border-navy-700/80 text-slate-300 hover:text-gold-400 hover:border-gold-500/40 transition-all"
            title="Booking Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-400 text-navy-950 text-[10px] font-bold flex items-center justify-center shadow-md animate-pulse">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* SOS Safety Button */}
          <button
            onClick={() => setIsSosOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 hover:bg-rose-900/60 hover:border-rose-500/60 text-xs font-semibold transition-all"
            title="Emergency SOS Guidance"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Travel SOS</span>
          </button>

          {/* Primary Plan Trip CTA */}
          <button
            onClick={() => setIsPlannerOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl gold-gradient-bg text-navy-950 font-bold text-xs tracking-wide shadow-gold-glow hover:brightness-110 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Design Trip</span>
          </button>
        </div>

      </div>
    </header>
  );
};
