import React, { useState, useEffect } from 'react';
import { useTrip } from '../../context/TripContext';
import { 
  Sparkles, 
  Bookmark, 
  ShoppingBag, 
  ShieldAlert, 
  Compass, 
  MapPin, 
  Bot, 
  Menu, 
  X, 
  ArrowRight,
  ShieldCheck 
} from 'lucide-react';

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

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navigateToSection = (sectionId: string, targetView?: 'dashboard' | 'itinerary' | 'booking' | 'map') => {
    setIsMobileMenuOpen(false);
    if (targetView && activeView !== targetView) {
      setActiveView(targetView);
    } else if (activeView !== 'dashboard') {
      setActiveView('dashboard');
    }

    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  return (
    <header 
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-sm' 
          : 'bg-white/60 backdrop-blur-md border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div 
          onClick={() => {
            setActiveView('dashboard');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-10 h-10 rounded-2xl bg-midnight-900 border border-slate-200 flex items-center justify-center p-1.5 shadow-sm group-hover:scale-105 transition-transform">
            <img 
              src="/assets/easytrip_logo.png" 
              alt="EasyTrip Logo" 
              className="w-full h-full object-contain filter drop-shadow-sm"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-midnight-900 font-sans">
                Easy<span className="text-brand-600">Trip</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest font-bold px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-charcoal-500 font-medium tracking-normal hidden sm:block">
              Travel smarter. Travel safer.
            </p>
          </div>
        </div>

        {/* Center Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-full border border-slate-200/90">
          <button
            onClick={() => navigateToSection('explore', 'dashboard')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-normal transition-all flex items-center gap-1.5 ${
              activeView === 'dashboard'
                ? 'bg-white text-midnight-900 shadow-sm font-bold'
                : 'text-charcoal-600 hover:text-midnight-900 hover:bg-white/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-brand-600" />
            Explore
          </button>

          <button
            onClick={() => navigateToSection('plan-section')}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-charcoal-600 hover:text-midnight-900 hover:bg-white/60 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            Plan Trip
          </button>

          <button
            onClick={() => {
              if (activeView !== 'map') {
                setActiveView('map');
              } else {
                navigateToSection('navigation-section');
              }
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-normal transition-all flex items-center gap-1.5 ${
              activeView === 'map'
                ? 'bg-white text-midnight-900 shadow-sm font-bold'
                : 'text-charcoal-600 hover:text-midnight-900 hover:bg-white/60'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-teal-600" />
            Safe Navigation
          </button>

          <button
            onClick={() => navigateToSection('ai-assistant-section')}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-charcoal-600 hover:text-midnight-900 hover:bg-white/60 transition-all flex items-center gap-1.5"
          >
            <Bot className="w-3.5 h-3.5 text-brand-600" />
            AI Assistant
          </button>

          <button
            onClick={() => navigateToSection('safety-section')}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-charcoal-600 hover:text-midnight-900 hover:bg-white/60 transition-all flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            Safety
          </button>

          <button
            onClick={() => setActiveView('booking')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-normal transition-all flex items-center gap-1.5 ${
              activeView === 'booking'
                ? 'bg-white text-midnight-900 shadow-sm font-bold'
                : 'text-charcoal-600 hover:text-midnight-900 hover:bg-white/60'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-brand-600" />
            Stays
          </button>
        </nav>

        {/* Right Actions & CTAs */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Saved Trips Trigger */}
          <button
            onClick={() => setIsSavedTripsOpen(true)}
            className="relative p-2.5 rounded-xl bg-white border border-slate-200 text-charcoal-700 hover:text-brand-600 hover:border-brand-300 hover:shadow-sm transition-all"
            title="Saved Trips"
          >
            <Bookmark className="w-4 h-4" />
            {savedTrips.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-brand-600 text-white text-[10px] font-bold flex items-center justify-center shadow">
                {savedTrips.length}
              </span>
            )}
          </button>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="relative p-2.5 rounded-xl bg-white border border-slate-200 text-charcoal-700 hover:text-brand-600 hover:border-brand-300 hover:shadow-sm transition-all"
            title="Booking Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center shadow animate-pulse">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* SOS Safety Button */}
          <button
            onClick={() => setIsSosOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-safety-50 border border-safety-200 text-safety-700 hover:bg-safety-100 hover:border-safety-300 text-xs font-bold transition-all active:scale-95"
            title="Emergency SOS & Safety Tools"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-safety-600" />
            <span className="hidden md:inline">Travel SOS</span>
          </button>

          {/* Primary Plan Trip CTA */}
          <button
            onClick={() => setIsPlannerOpen(true)}
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs tracking-normal shadow-sm hover:shadow-md active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Plan My Trip</span>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-white border border-slate-200 text-charcoal-700 hover:text-midnight-900 transition-all"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-2xl border-b border-slate-200 px-4 py-4 space-y-3 shadow-elevated animate-slide-down">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => navigateToSection('explore', 'dashboard')}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-left text-xs font-semibold text-charcoal-800 hover:bg-brand-50 hover:text-brand-600 transition-all flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-brand-600" />
              <span>Explore Places</span>
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsPlannerOpen(true);
              }}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-left text-xs font-semibold text-charcoal-800 hover:bg-brand-50 hover:text-brand-600 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>AI Trip Planner</span>
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setActiveView('map');
              }}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-left text-xs font-semibold text-charcoal-800 hover:bg-brand-50 hover:text-brand-600 transition-all flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 text-teal-600" />
              <span>Safe Navigation</span>
            </button>

            <button
              onClick={() => navigateToSection('ai-assistant-section')}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-left text-xs font-semibold text-charcoal-800 hover:bg-brand-50 hover:text-brand-600 transition-all flex items-center gap-2"
            >
              <Bot className="w-4 h-4 text-brand-600" />
              <span>AI Assistant</span>
            </button>

            <button
              onClick={() => navigateToSection('safety-section')}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-left text-xs font-semibold text-charcoal-800 hover:bg-brand-50 hover:text-brand-600 transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Safety & SOS</span>
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setActiveView('booking');
              }}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-left text-xs font-semibold text-charcoal-800 hover:bg-brand-50 hover:text-brand-600 transition-all flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-brand-600" />
              <span>Stays & Cabs</span>
            </button>
          </div>

          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsPlannerOpen(true);
            }}
            className="w-full py-3 rounded-xl bg-brand-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Plan My Trip</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      )}
    </header>
  );
};
