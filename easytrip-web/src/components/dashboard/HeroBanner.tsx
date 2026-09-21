import React, { useState } from 'react';
import { useTrip } from '../../context/TripContext';
import { 
  Sparkles, 
  ArrowRight, 
  MapPin, 
  ShieldCheck, 
  Sun, 
  Compass, 
  Calendar, 
  Navigation, 
  Route, 
  CheckCircle2, 
  Clock, 
  IndianRupee 
} from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { setIsPlannerOpen, openPlannerWithDestination } = useTrip();
  const [activePreviewCity, setActivePreviewCity] = useState<'Vizag' | 'Ooty' | 'Paris'>('Vizag');

  const previews = {
    Vizag: {
      name: 'Vizag (Visakhapatnam)',
      country: 'India',
      route: 'Hyderabad → Vizag via NH16',
      distance: '580 km',
      duration: '1h 15m air / 8h train',
      temp: '28°C',
      condition: 'Sunny & Coastal Breeze',
      safetyScore: '98%',
      safetyStatus: 'Verified Safe • Low Risk',
      stayPick: 'Novotel Varun Beach (₹9,500/nt)',
      highlight: 'INS Kursura Submarine & RK Beach Promenade',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80'
    },
    Ooty: {
      name: 'Ooty (Nilgiris)',
      country: 'India',
      route: 'Bengaluru → Ooty via NH181',
      distance: '270 km',
      duration: '5h 30m scenic ghat drive',
      temp: '18°C',
      condition: 'Misty Highland Cloud',
      safetyScore: '99%',
      safetyStatus: 'Scenic Tourist Corridor',
      stayPick: 'Savoy - IHCL SeleQtions (₹14,500/nt)',
      highlight: 'UNESCO Toy Train & Doddabetta Tea Overlook',
      image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80'
    },
    Paris: {
      name: 'Paris',
      country: 'France',
      route: 'London → Paris via Eurostar',
      distance: '460 km',
      duration: '2h 15m high-speed rail',
      temp: '21°C',
      condition: 'Clear Belle Époque Sky',
      safetyScore: '96%',
      safetyStatus: 'Well-Policed Central Hubs',
      stayPick: 'CitizenM Champs-Élysées (₹18,500/nt)',
      highlight: 'Eiffel Tower Summit & Le Comptoir du Relais',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80'
    }
  };

  const currentPreview = previews[activePreviewCity];

  const scrollToExplore = () => {
    const exploreSection = document.getElementById('explore');
    if (exploreSection) {
      exploreSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Max 5 degrees tilt
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;

    setTilt({ x: rotateY, y: rotateX });
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.15
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  return (
    <section className="relative pt-6 sm:pt-10 pb-16 overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-brand-100/40 via-teal-50/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Hero Intro Header */}
        <div className="max-w-3xl mx-auto text-center space-y-5 mb-12 sm:mb-16">
          
          {/* 150ms Sequence: Eyebrow Sharp Badge */}
          <div className="animate-fade-in inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-white border border-slate-200 shadow-sm text-xs font-bold text-teal-700">
            <span className="w-1.5 h-1.5 rounded-none bg-teal-600" />
            <span className="tracking-widest uppercase text-[11px]">SMART TRAVEL COMPANION</span>
          </div>

          {/* 300ms Sequence: Large Editorial Headline */}
          <h1 className="animate-fade-in-up text-4xl sm:text-6xl lg:text-7xl font-black text-midnight-900 tracking-tight leading-[1.08]">
            Travel smarter. <br />
            <span className="text-brand-600">Travel safer.</span>
          </h1>

          {/* 500ms Sequence: Supporting Description */}
          <p className="animate-fade-in-up text-base sm:text-xl text-charcoal-600 font-normal leading-relaxed max-w-2xl mx-auto">
            Plan your journey, discover places worth visiting, and get safety-aware travel assistance — all in one place.
          </p>

          {/* 650ms Sequence: Action CTAs with Sharp Rectangles */}
          <div className="animate-fade-in-up pt-2 flex flex-wrap items-center justify-center gap-3.5">
            <button
              onClick={() => setIsPlannerOpen(true)}
              className="btn-primary px-6 py-3 rounded-md font-bold text-sm tracking-normal flex items-center gap-2 group"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Plan My Trip</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
            </button>

            <button
              onClick={scrollToExplore}
              className="btn-secondary px-6 py-3 rounded-md font-bold text-sm tracking-normal shadow-sm"
            >
              Explore EasyTrip
            </button>
          </div>

          {/* Trust Value Sharp Badges */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-charcoal-600">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-white border border-slate-200 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
              Real Verified Landmarks
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-white border border-slate-200 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
              National Highway & Rail Routes
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-white border border-slate-200 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
              100% INR (₹) Realistic Budgets
            </span>
          </div>
        </div>

        {/* 800ms Sequence: Interactive 3D Mockup with Crisp Rectangular Geometry */}
        <div 
          className="perspective-container max-w-5xl mx-auto"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div 
            className="surface-elevated rounded-md p-4 sm:p-7 border border-slate-200/90 shadow-elevated relative overflow-hidden transition-transform duration-300 ease-out"
            style={{
              transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Dynamic Cursor Spotlight Glare */}
            <div 
              className="pointer-events-none absolute inset-0 rounded-md transition-opacity duration-300 -z-0"
              style={{
                background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(37, 99, 235, 0.12) 0%, transparent 60%)`,
                opacity: glare.opacity,
              }}
            />
            
            {/* Mockup Window Chrome Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3 relative z-10">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 mr-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/80" />
                </div>
                <span className="text-xs font-bold text-midnight-900 flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-brand-600" />
                  EasyTrip Intelligence Preview
                </span>
              </div>

              {/* Quick City Switcher within mockup */}
              <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-sm border border-slate-200">
                {(['Vizag', 'Ooty', 'Paris'] as const).map(city => (
                  <button
                    key={city}
                    onClick={() => setActivePreviewCity(city)}
                    className={`px-3 py-1 rounded-sm text-xs font-bold transition-all duration-200 active:scale-95 ${
                      activePreviewCity === city
                        ? 'bg-white text-midnight-900 shadow-sm border border-slate-200/80'
                        : 'text-charcoal-500 hover:text-midnight-900'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Inner Interactive Dashboard Layout */}
            <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch relative z-10">
              
              {/* Left 7 Cols: Image & Itinerary Preview */}
              <div className="lg:col-span-7 rounded-md overflow-hidden relative min-h-[300px] sm:min-h-[360px] flex flex-col justify-between p-5 border border-slate-200/80 group">
                <img
                  src={currentPreview.image}
                  alt={currentPreview.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight-950/90 via-midnight-950/40 to-transparent" />

                {/* Floating Top Indicators */}
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-sm bg-white/95 backdrop-blur-md text-midnight-900 font-extrabold text-xs shadow-sm flex items-center gap-1 border border-slate-200">
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    {currentPreview.temp} • {currentPreview.condition}
                  </span>

                  <span className="px-2.5 py-1 rounded-sm bg-emerald-600 text-white font-bold text-xs shadow-sm flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {currentPreview.safetyScore} Safety Index
                  </span>
                </div>

                {/* Bottom Card Context */}
                <div className="relative z-10 space-y-2 text-white">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-teal-300">
                    FEATURED ITINERARY PREVIEW
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
                    {currentPreview.name}
                  </h3>
                  <p className="text-xs text-slate-200 max-w-md line-clamp-2">
                    <strong>Highlight:</strong> {currentPreview.highlight}
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => openPlannerWithDestination(currentPreview.name)}
                      className="px-4 py-2 rounded-sm bg-white text-midnight-900 hover:bg-brand-50 font-bold text-xs transition-all inline-flex items-center gap-1.5 shadow active:scale-95"
                    >
                      <span>View Full 3-Day Plan</span>
                      <ArrowRight className="w-3.5 h-3.5 text-brand-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right 5 Cols: Live Metrics & Safety Indicator Card */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                
                {/* Route & Transit Card */}
                <div className="p-4 rounded-md bg-slate-50 border border-slate-200/80 space-y-2 hover:border-brand-300 transition-colors">
                  <div className="flex items-center justify-between text-xs text-charcoal-500 font-semibold">
                    <span className="flex items-center gap-1">
                      <Route className="w-3.5 h-3.5 text-brand-600" />
                      Verified Corridor
                    </span>
                    <span className="text-midnight-900 font-bold">{currentPreview.distance}</span>
                  </div>
                  <div className="text-sm font-bold text-midnight-900">
                    {currentPreview.route}
                  </div>
                  <div className="text-xs text-charcoal-600 flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Est. Duration: {currentPreview.duration}</span>
                  </div>
                </div>

                {/* Safety & Emergency Status */}
                <div className="p-4 rounded-md bg-teal-50/70 border border-teal-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-teal-800 flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-teal-600" />
                      Safety Corridor Assessment
                    </span>
                    <span className="text-[11px] font-black text-teal-700 bg-white px-2 py-0.5 rounded-sm border border-teal-200">
                      High Confidence
                    </span>
                  </div>
                  <p className="text-xs text-teal-900 leading-relaxed font-medium">
                    {currentPreview.safetyStatus}. Automated SOS connection to emergency police, certified hospitals, and travel helplines active 24/7.
                  </p>
                </div>

                {/* Recommended Stay Preview */}
                <div className="p-4 rounded-md bg-white border border-slate-200/80 space-y-1.5 shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-charcoal-400 block">
                    Curated Verified Stay
                  </span>
                  <div className="text-xs font-bold text-midnight-900">
                    {currentPreview.stayPick}
                  </div>
                  <p className="text-[11px] text-charcoal-500">
                    Verified rating 4.8+ • Breakfast & executive airport transfer included.
                  </p>
                </div>

                {/* Quick Action */}
                <button
                  onClick={() => setIsPlannerOpen(true)}
                  className="w-full py-3 rounded-md bg-slate-900 hover:bg-midnight-900 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                  <span>Customize This Trip with AI</span>
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Continuous Flow Scroll Indicator */}
        <div className="mt-12 flex flex-col items-center justify-center gap-2 text-charcoal-400 hover:text-brand-600 transition-colors cursor-pointer group" onClick={() => {
          document.getElementById('plan-section')?.scrollIntoView({ behavior: 'smooth' });
        }}>
          <span className="text-[11px] font-bold uppercase tracking-wider">Start Trip Planning</span>
          <div className="w-5 h-8 rounded-sm border-2 border-slate-300 group-hover:border-brand-600 flex items-start justify-center p-1 transition-colors">
            <div className="w-1 h-1.5 rounded-none bg-slate-400 group-hover:bg-brand-600 animate-bounce" />
          </div>
        </div>

      </div>
    </section>
  );
};
