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
          ? 'bg-[#0b0e14]/90 backdrop-blur-xl border-b border-[#222d3d] shadow-2xl' 
          : 'bg-[#0b0e14]/60 backdrop-blur-md border-b border-transparent'
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
          <div className="relative w-9 h-9 rounded-md bg-[#121924] border border-[#222d3d] flex items-center justify-center p-1.5 shadow-sm group-hover:scale-105 transition-transform group-hover:border-[#f3b740]/40">
            <img 
              src="/assets/easytrip_logo.png" 
              alt="EasyTrip Logo" 
              className="w-full h-full object-contain filter drop-shadow-sm"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-[#f1f5f9] font-sans">
                Easy<span className="text-[#f3b740]">Trip</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest font-bold px-1.5 py-0.5 rounded-sm bg-[#182232] text-[#f3b740] border border-[#f3b740]/30 shadow-sm">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-[#94a3b8] font-medium tracking-normal hidden sm:block">
              Travel smarter. Travel safer.
            </p>
          </div>
        </div>

        {/* Center Desktop Navigation with Sleek Midnight Navy geometry & Warm Amber glow */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#121924] p-1 rounded-md border border-[#222d3d] relative shadow-lg">
          <button
            onClick={() => navigateToSection('explore', 'dashboard')}
            className={`relative z-10 px-3.5 py-1.5 rounded-sm text-xs font-semibold tracking-normal transition-all duration-200 flex items-center gap-1.5 active:scale-95 ${
              activeView === 'dashboard'
                ? 'bg-[#182232] text-[#f3b740] shadow-[0_0_12px_rgba(243,183,64,0.2)] font-bold border border-[#f3b740]/40'
                : 'text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#182232]/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-[#f3b740]" />
            Explore
          </button>

          <button
            onClick={() => navigateToSection('plan-section')}
            className="relative z-10 px-3.5 py-1.5 rounded-sm text-xs font-semibold text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#182232]/60 transition-all duration-200 flex items-center gap-1.5 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#f3b740]" />
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
            className={`relative z-10 px-3.5 py-1.5 rounded-sm text-xs font-semibold tracking-normal transition-all duration-200 flex items-center gap-1.5 active:scale-95 ${
              activeView === 'map'
                ? 'bg-[#182232] text-[#f3b740] shadow-[0_0_12px_rgba(243,183,64,0.2)] font-bold border border-[#f3b740]/40'
                : 'text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#182232]/60'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-[#34d399]" />
            Safe Navigation
          </button>

          <button
            onClick={() => navigateToSection('ai-assistant-section')}
            className="relative z-10 px-3.5 py-1.5 rounded-sm text-xs font-semibold text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#182232]/60 transition-all duration-200 flex items-center gap-1.5 active:scale-95"
          >
            <Bot className="w-3.5 h-3.5 text-[#f3b740]" />
            AI Assistant
          </button>

          <button
            onClick={() => navigateToSection('safety-section')}
            className="relative z-10 px-3.5 py-1.5 rounded-sm text-xs font-semibold text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#182232]/60 transition-all duration-200 flex items-center gap-1.5 active:scale-95"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#34d399]" />
            Safety
          </button>

          <button
            onClick={() => setActiveView('booking')}
            className={`relative z-10 px-3.5 py-1.5 rounded-sm text-xs font-semibold tracking-normal transition-all duration-200 flex items-center gap-1.5 active:scale-95 ${
              activeView === 'booking'
                ? 'bg-[#182232] text-[#f3b740] shadow-[0_0_12px_rgba(243,183,64,0.2)] font-bold border border-[#f3b740]/40'
                : 'text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#182232]/60'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#f3b740]" />
            Stays
          </button>
        </nav>

        {/* Right Actions & CTAs */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Saved Trips Trigger */}
          <button
            onClick={() => setIsSavedTripsOpen(true)}
            className="relative p-2.5 rounded-md bg-[#141b26] border border-[#222d3d] text-[#cbd5e1] hover:text-[#f3b740] hover:border-[#f3b740]/50 hover:shadow-[0_0_12px_rgba(243,183,64,0.15)] transition-all duration-200 active:scale-90"
            title="Saved Trips"
          >
            <Bookmark className="w-4 h-4" />
            {savedTrips.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 rounded-sm bg-[#f3b740] text-[#0e131f] text-[10px] font-black flex items-center justify-center shadow animate-marker-pop">
                {savedTrips.length}
              </span>
            )}
          </button>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="relative p-2.5 rounded-md bg-[#141b26] border border-[#222d3d] text-[#cbd5e1] hover:text-[#f3b740] hover:border-[#f3b740]/50 hover:shadow-[0_0_12px_rgba(243,183,64,0.15)] transition-all duration-200 active:scale-90"
            title="Booking Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 rounded-sm bg-[#062c20] text-[#34d399] border border-[#059669]/60 text-[10px] font-bold flex items-center justify-center shadow animate-marker-pop">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* SOS Safety Button */}
          <button
            onClick={() => setIsSosOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-[#200c10] border border-[#dc2626]/40 text-[#fca5a5] hover:bg-[#331218] hover:border-[#dc2626]/70 text-xs font-bold transition-all duration-200 active:scale-95 shadow-sm"
            title="Emergency SOS & Safety Tools"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-[#ef4444]" />
            <span className="hidden md:inline">Travel SOS</span>
          </button>

          {/* Primary Plan Trip CTA */}
          <button
            onClick={() => setIsPlannerOpen(true)}
            className="btn-primary hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-md font-bold text-xs tracking-normal shadow-[0_2px_12px_rgba(243,183,64,0.35)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#0e131f]" />
            <span>Plan My Trip</span>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-md bg-[#141b26] border border-[#222d3d] text-[#cbd5e1] hover:text-[#f1f5f9] transition-all active:scale-90"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#121924]/95 backdrop-blur-2xl border-b border-[#222d3d] px-4 py-4 space-y-3 shadow-2xl animate-slide-down">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => navigateToSection('explore', 'dashboard')}
              className="p-3 rounded-md bg-[#182232] border border-[#222d3d] text-left text-xs font-semibold text-[#cbd5e1] hover:bg-[#141b26] hover:text-[#f3b740] hover:border-[#f3b740]/40 transition-all flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-[#f3b740]" />
              <span>Explore Places</span>
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsPlannerOpen(true);
              }}
              className="p-3 rounded-md bg-[#182232] border border-[#222d3d] text-left text-xs font-semibold text-[#cbd5e1] hover:bg-[#141b26] hover:text-[#f3b740] hover:border-[#f3b740]/40 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#f3b740]" />
              <span>AI Trip Planner</span>
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setActiveView('map');
              }}
              className="p-3 rounded-md bg-[#182232] border border-[#222d3d] text-left text-xs font-semibold text-[#cbd5e1] hover:bg-[#141b26] hover:text-[#34d399] hover:border-[#34d399]/40 transition-all flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 text-[#34d399]" />
              <span>Safe Navigation</span>
            </button>

            <button
              onClick={() => navigateToSection('ai-assistant-section')}
              className="p-3 rounded-md bg-[#182232] border border-[#222d3d] text-left text-xs font-semibold text-[#cbd5e1] hover:bg-[#141b26] hover:text-[#f3b740] hover:border-[#f3b740]/40 transition-all flex items-center gap-2"
            >
              <Bot className="w-4 h-4 text-[#f3b740]" />
              <span>AI Assistant</span>
            </button>

            <button
              onClick={() => navigateToSection('safety-section')}
              className="p-3 rounded-md bg-[#182232] border border-[#222d3d] text-left text-xs font-semibold text-[#cbd5e1] hover:bg-[#141b26] hover:text-[#34d399] hover:border-[#34d399]/40 transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-[#34d399]" />
              <span>Safety & SOS</span>
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setActiveView('booking');
              }}
              className="p-3 rounded-md bg-[#182232] border border-[#222d3d] text-left text-xs font-semibold text-[#cbd5e1] hover:bg-[#141b26] hover:text-[#f3b740] hover:border-[#f3b740]/40 transition-all flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-[#f3b740]" />
              <span>Stays & Cabs</span>
            </button>
          </div>

          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsPlannerOpen(true);
            }}
            className="w-full py-3 rounded-md bg-[#f3b740] hover:bg-[#e5a83b] text-[#0e131f] font-extrabold text-xs flex items-center justify-center gap-2 shadow-[0_2px_12px_rgba(243,183,64,0.3)]"
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
