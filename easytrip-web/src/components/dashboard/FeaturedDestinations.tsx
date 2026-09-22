import React, { useState, useRef, useEffect } from 'react';
import { useTrip } from '../../context/TripContext';
import { 
  Star, 
  MapPin, 
  Calendar, 
  IndianRupee, 
  Sparkles, 
  ArrowRight, 
  Utensils, 
  Building2, 
  Compass, 
  Car, 
  Landmark,
  ChevronLeft,
  ChevronRight,
  X,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Destination } from '../../types/trip';

export const FeaturedDestinations: React.FC = () => {
  const { destinations, openPlannerWithDestination } = useTrip();
  const [selectedTab, setSelectedTab] = useState<'all' | 'places' | 'food' | 'hotels' | 'activities' | 'transport'>('all');
  const [inspectedDest, setInspectedDest] = useState<Destination | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const tabs = [
    { id: 'all', label: 'All Destinations', icon: Compass },
    { id: 'places', label: 'Places & Sights', icon: Landmark },
    { id: 'food', label: 'Food & Dining', icon: Utensils },
    { id: 'hotels', label: 'Verified Stays', icon: Building2 },
    { id: 'activities', label: 'Experiences', icon: Sparkles },
    { id: 'transport', label: 'Transit Corridors', icon: Car },
  ] as const;

  const filterMap: Record<string, (d: Destination) => boolean> = {
    all: () => true,
    places: (d) => d.category.includes('Heritage') || d.highlights.some(h => h.includes('Ghat') || h.includes('Museum') || h.includes('Tower')),
    food: (d) => d.highlights.some(h => h.includes('Food') || h.includes('Fish') || h.includes('Seafood') || h.includes('Cafe') || h.includes('Wine') || h.includes('Ramen')),
    hotels: () => true,
    activities: (d) => d.highlights.some(h => h.includes('Train') || h.includes('Hike') || h.includes('Safari') || h.includes('Cruise') || h.includes('Ropeway')),
    transport: (d) => !!d.idealDays,
  };

  const filtered = destinations.filter(filterMap[selectedTab] || (() => true));

  // Check scroll boundary
  const updateScrollButtons = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener('scroll', updateScrollButtons);
      updateScrollButtons();
      return () => el.removeEventListener('scroll', updateScrollButtons);
    }
  }, [filtered]);

  // Mouse Drag to Scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsMouseDown(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeftState(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Drag sensitivity
    scrollContainerRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const scrollByAmount = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const amount = direction === 'left' ? -380 : 380;
    scrollContainerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      scrollByAmount('left');
    } else if (e.key === 'ArrowRight') {
      scrollByAmount('right');
    }
  };

  return (
    <section id="explore" className="my-16 sm:my-24 scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-[#182232] text-[#f3b740] text-xs font-bold border border-[#f3b740]/30">
            <Compass className="w-3.5 h-3.5" />
            <span>SECTION 02 — KINETIC EXPLORATION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#f1f5f9] tracking-tight">
            Explore your next destination.
          </h2>
          <p className="text-sm text-[#94a3b8] max-w-xl leading-relaxed">
            Drag, swipe, or browse verified travel hubs featuring iconic local landmarks, signature regional culinary specialties, and comfortable stays.
          </p>
        </div>

        {/* Category Pill Filters & Arrow Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-1.5 bg-[#121924] p-1 rounded-md border border-[#222d3d]">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = selectedTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`px-3 py-1.5 rounded-sm text-xs font-bold transition-all duration-200 active:scale-95 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#182232] text-[#f3b740] shadow-[0_0_12px_rgba(243,183,64,0.2)] border border-[#f3b740]/40'
                      : 'text-[#94a3b8] hover:text-[#f1f5f9]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-[#f3b740]" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Precision Spring Arrow Controls */}
          <div className="hidden sm:flex items-center gap-1.5 bg-[#121924] p-1 rounded-md border border-[#222d3d]">
            <button
              onClick={() => scrollByAmount('left')}
              disabled={!canScrollLeft}
              className={`p-2 rounded-sm text-[#cbd5e1] hover:bg-[#182232] hover:text-[#f3b740] transition-all duration-200 active:scale-90 shadow-sm ${
                !canScrollLeft ? 'opacity-30 cursor-not-allowed' : ''
              }`}
              title="Previous Destinations"
              aria-label="Previous Destinations"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollByAmount('right')}
              disabled={!canScrollRight}
              className={`p-2 rounded-sm text-[#cbd5e1] hover:bg-[#182232] hover:text-[#f3b740] transition-all duration-200 active:scale-90 shadow-sm ${
                !canScrollRight ? 'opacity-30 cursor-not-allowed' : ''
              }`}
              title="Next Destinations"
              aria-label="Next Destinations"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Kinetic Horizontal Destination Carousel Track */}
      <div 
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        className={`flex gap-6 overflow-x-auto pb-6 pt-2 px-1 no-scrollbar select-none focus:outline-none focus:ring-1 focus:ring-[#f3b740]/50 rounded-md ${
          isMouseDown ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{ scrollBehavior: isMouseDown ? 'auto' : 'smooth' }}
      >
        {filtered.map((dest: Destination) => (
          <div
            key={dest.id}
            className="group surface-card rounded-md overflow-hidden border border-[#222d3d] hover:border-[#f3b740]/50 transition-all duration-300 flex flex-col justify-between interactive-card min-w-[290px] sm:min-w-[340px] max-w-[340px] shrink-0 bg-[#141b26]"
          >
            {/* Top Image Container with Zoom & Blur Mask */}
            <div 
              className="relative h-56 w-full overflow-hidden cursor-pointer"
              onClick={() => setInspectedDest(dest)}
            >
              <img
                src={dest.image}
                alt={(dest.imageAlt || (dest.id === 'vizag' || dest.name.toLowerCase().includes('visakhapatnam') ? 'RK Beach Promenade, Visakhapatnam' : dest.name))}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08090c]/90 via-[#08090c]/25 to-transparent" />
              
              {/* Badge */}
              <span className="absolute top-3 left-3 px-2 py-0.5 rounded-sm bg-[#0b0e14]/90 backdrop-blur-md text-[10px] font-extrabold text-[#f3b740] shadow-sm uppercase tracking-wider border border-[#222d3d]">
                {dest.badge}
              </span>

              {/* Rating */}
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-sm bg-[#0b0e14]/90 backdrop-blur-md text-xs font-extrabold text-[#f1f5f9] shadow-sm border border-[#222d3d]">
                <Star className="w-3 h-3 text-[#f3b740] fill-[#f3b740]" />
                <span>{dest.rating}</span>
              </div>

              {/* Destination & Country at Bottom of Image */}
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="text-xl font-black tracking-tight flex items-center gap-1.5 text-[#f1f5f9]">
                  <MapPin className="w-4 h-4 text-[#34d399]" />
                  {dest.name}
                </h3>
                <p className="text-xs text-[#94a3b8] font-medium">{dest.country}</p>
              </div>
            </div>

            {/* Details Content */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-xs text-[#94a3b8] line-clamp-2 leading-relaxed">
                {dest.tagline}
              </p>

              {/* Highlights tags */}
              <div className="flex flex-wrap gap-1.5">
                {dest.highlights.slice(0, 3).map((hl: string) => (
                  <span
                    key={hl}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-sm bg-[#182232] text-[#cbd5e1] border border-[#222d3d]"
                  >
                    {hl}
                  </span>
                ))}
              </div>

              {/* Stats Row */}
              <div className="pt-3 border-t border-[#222d3d] flex items-center justify-between text-xs text-[#94a3b8]">
                <div className="flex items-center gap-1 font-semibold text-[#cbd5e1]">
                  <Calendar className="w-3.5 h-3.5 text-[#f3b740]" />
                  <span>{dest.idealDays}</span>
                </div>
                {/* Forest Emerald Price Chip */}
                <div className="flex items-center gap-0.5 font-bold px-2 py-0.5 rounded-sm bg-[#062c20] text-[#34d399] border border-[#059669]/40">
                  <IndianRupee className="w-3.5 h-3.5" />
                  <span>₹{dest.avgCostPerDay.moderate.toLocaleString('en-IN')}/day</span>
                </div>
              </div>

              {/* Dual Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => setInspectedDest(dest)}
                  className="py-2.5 rounded-sm bg-[#182232] hover:bg-[#222d3d] text-[#cbd5e1] font-bold text-xs tracking-normal transition-all text-center active:scale-95 border border-[#222d3d]"
                >
                  Quick Inspect
                </button>
                <button
                  onClick={() => openPlannerWithDestination(dest.name)}
                  className="py-2.5 rounded-sm bg-[#f3b740] hover:bg-[#e5a83b] text-[#0e131f] font-bold text-xs tracking-normal transition-all flex items-center justify-center gap-1 shadow-[0_0_12px_rgba(243,183,64,0.25)] active:scale-95"
                >
                  <span>Plan Trip</span>
                  <ArrowRight className="w-3 h-3 text-[#0e131f]" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Shared-Element Destination Detail Modal with Morphing Transition */}
      {inspectedDest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#08090c]/80 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#141b26] border border-[#222d3d] rounded-md overflow-hidden shadow-2xl my-8 animate-marker-pop">
            
            {/* Header Image */}
            <div className="relative h-64 sm:h-72 w-full overflow-hidden">
              <img
                src={inspectedDest.image}
                alt={(inspectedDest.imageAlt || (inspectedDest.id === 'vizag' || inspectedDest.name.toLowerCase().includes('visakhapatnam') ? 'RK Beach Promenade, Visakhapatnam' : inspectedDest.name))}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141b26] via-[#141b26]/40 to-transparent" />
              
              <button
                onClick={() => setInspectedDest(null)}
                className="absolute top-4 right-4 p-2 rounded-sm bg-[#0b0e14]/80 hover:bg-[#0b0e14] text-white backdrop-blur-md transition-all active:scale-95 border border-[#222d3d]"
                aria-label="Close details"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-sm bg-[#f3b740] text-[#0e131f] text-[10px] font-bold uppercase tracking-wider">
                    {inspectedDest.badge}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold bg-[#0b0e14]/80 backdrop-blur-md px-2 py-0.5 rounded-sm border border-[#222d3d]">
                    <Star className="w-3.5 h-3.5 text-[#f3b740] fill-[#f3b740]" />
                    {inspectedDest.rating} Rating
                  </span>
                </div>
                <h3 className="text-3xl font-black tracking-tight flex items-center gap-2 text-[#f1f5f9]">
                  <MapPin className="w-6 h-6 text-[#34d399]" />
                  {inspectedDest.name}, {inspectedDest.country}
                </h3>
              </div>
            </div>

            {/* Modal Body Content */}
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h4 className="text-xs uppercase font-bold text-[#f3b740] tracking-wider mb-2">
                  Destination Overview
                </h4>
                <p className="text-sm text-[#cbd5e1] leading-relaxed">
                  {inspectedDest.tagline}. Renowned for historic landmarks, scenic routes, and authentic local culture verified by EasyTrip local intelligence.
                </p>
              </div>

              {/* Highlights List */}
              <div>
                <h4 className="text-xs uppercase font-bold text-[#f3b740] tracking-wider mb-2.5">
                  Verified Local Highlights
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {inspectedDest.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 p-2.5 rounded-sm bg-[#182232] border border-[#222d3d] text-xs font-semibold text-[#f1f5f9]">
                      <CheckCircle2 className="w-4 h-4 text-[#34d399] shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cost & Duration Summary */}
              <div className="p-4 rounded-md bg-[#182232] border border-[#222d3d] flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-[#94a3b8] uppercase block">Estimated Moderate Budget</span>
                  <span className="text-base font-extrabold text-[#f3b740]">
                    ₹{inspectedDest.avgCostPerDay.moderate.toLocaleString('en-IN')} <span className="text-xs font-normal text-[#94a3b8]">/ person / day</span>
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-[#94a3b8] uppercase block">Recommended Stay</span>
                  <span className="text-sm font-extrabold text-[#f7d56e]">{inspectedDest.idealDays}</span>
                </div>
              </div>

              {/* Modal CTA */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => setInspectedDest(null)}
                  className="flex-1 py-3.5 rounded-sm bg-[#182232] hover:bg-[#222d3d] text-[#cbd5e1] font-bold text-xs transition-all border border-[#222d3d]"
                >
                  Close Preview
                </button>
                <button
                  onClick={() => {
                    const destName = inspectedDest.name;
                    setInspectedDest(null);
                    openPlannerWithDestination(destName);
                  }}
                  className="flex-1 py-3.5 rounded-sm bg-[#f3b740] hover:bg-[#e5a83b] text-[#0e131f] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_2px_12px_rgba(243,183,64,0.3)] active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Design Itinerary for {inspectedDest.name}</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
};
