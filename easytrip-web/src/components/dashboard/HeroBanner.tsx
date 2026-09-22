import React, { useState, useRef, useEffect } from 'react';
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
      image: 'https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?auto=format&fit=crop&w=1200&q=80',
      alt: 'RK Beach Promenade, Visakhapatnam'
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
      image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80',
      alt: 'UNESCO Toy Train & Doddabetta, Ooty'
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
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
      alt: 'Eiffel Tower Summit, Paris'
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

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {
        // Safe catch for strict browser autoplay permissions
      });
    }
  }, []);

  return (
    <section className="relative pt-6 sm:pt-10 pb-16 overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <video 
          ref={videoRef}
          src="/easytrip-background.mp4"
          autoPlay 
          muted 
          loop 
          playsInline 
          preload="auto"
          className="w-full h-full object-cover brightness-110 contrast-105" 
        >
          <source src="/easytrip-background.mp4" type="video/mp4" />
        </video>
        {/* Subtle Cinematic Readability Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0e14]/40 via-transparent to-[#0b0e14]/95 pointer-events-none" />
        <div className="absolute inset-0 bg-[#0b0e14]/20 pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Editorial Hero Intro Header */}
        <div className="max-w-3xl mx-auto text-center space-y-5 mb-12 sm:mb-16">
          
          {/* Eyebrow Sharp Badge */}
          <div className="animate-fade-in inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#141b26]/90 backdrop-blur-md border border-[#222d3d] shadow-sm text-xs font-bold text-[#f3b740]">
            <span className="w-1.5 h-1.5 rounded-none bg-[#f3b740]" />
            <span className="tracking-widest uppercase text-[11px]">SMART TRAVEL COMPANION</span>
          </div>

          {/* Large Editorial Headline */}
          <h1 className="animate-fade-in-up text-4xl sm:text-6xl lg:text-7xl font-black text-[#f1f5f9] tracking-tight leading-[1.08] drop-shadow-lg">
            Travel smarter. <br />
            <span className="gold-gradient-text">Travel safer.</span>
          </h1>

          {/* Supporting Description */}
          <p className="animate-fade-in-up text-base sm:text-xl text-[#94a3b8] font-normal leading-relaxed max-w-2xl mx-auto">
            Plan your journey, discover places worth visiting, and get safety-aware travel assistance — all in one place.
          </p>

          {/* Action CTAs */}
          <div className="animate-fade-in-up pt-2 flex flex-wrap items-center justify-center gap-3.5">
            <button
              onClick={() => setIsPlannerOpen(true)}
              className="btn-primary px-6 py-3 rounded-md font-bold text-sm tracking-normal flex items-center gap-2 group shadow-[0_2px_12px_rgba(243,183,64,0.35)] active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#0e131f] group-hover:rotate-12 transition-transform duration-300" />
              <span>Design My Trip</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
            </button>

            <button
              onClick={scrollToExplore}
              className="btn-secondary px-6 py-3 rounded-md font-bold text-sm tracking-normal shadow-sm"
            >
              Explore EasyTrip
            </button>
          </div>

          {/* Trust Value Badges */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-[#cbd5e1]">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#141b26] border border-[#222d3d] shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#34d399]" />
              Real Verified Landmarks
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#141b26] border border-[#222d3d] shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#34d399]" />
              National Highway & Rail Routes
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#141b26] border border-[#222d3d] shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#34d399]" />
              100% INR (₹) Realistic Budgets
            </span>
          </div>
        </div>

        {/* Interactive 3D Mockup */}
        <div 
          className="perspective-container max-w-5xl mx-auto"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div 
            className="surface-elevated rounded-md p-4 sm:p-7 border border-[#222d3d] shadow-2xl relative overflow-hidden transition-transform duration-300 ease-out specular-sheen"
            style={{
              transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Dynamic Cursor Spotlight Glare */}
            <div 
              className="pointer-events-none absolute inset-0 rounded-md transition-opacity duration-300 -z-0"
              style={{
                background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(243, 183, 64, 0.15) 0%, transparent 60%)`,
                opacity: glare.opacity,
              }}
            />
            
            {/* Mockup Window Chrome Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#222d3d] gap-3 relative z-10">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 mr-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/80" />
                </div>
                <span className="text-xs font-bold text-[#f1f5f9] flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-[#f3b740]" />
                  EasyTrip Intelligence Preview
                </span>
              </div>

              {/* Quick City Switcher within mockup */}
              <div className="flex items-center gap-1 bg-[#121924] p-1 rounded-sm border border-[#222d3d]">
                {(['Vizag', 'Ooty', 'Paris'] as const).map(city => (
                  <button
                    key={city}
                    onClick={() => setActivePreviewCity(city)}
                    className={`px-3 py-1 rounded-sm text-xs font-bold transition-all duration-200 active:scale-95 ${
                      activePreviewCity === city
                        ? 'bg-[#182232] text-[#f3b740] shadow-sm border border-[#f3b740]/40'
                        : 'text-[#94a3b8] hover:text-[#f1f5f9]'
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
              <div className="lg:col-span-7 rounded-md overflow-hidden relative min-h-[300px] sm:min-h-[360px] flex flex-col justify-between p-5 border border-[#222d3d] group specular-sheen">
                <img
                  src={currentPreview.image}
                  alt={currentPreview.alt || currentPreview.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08090c]/95 via-[#08090c]/40 to-transparent" />

                {/* Floating Top Indicators */}
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-sm bg-[#0b0e14]/90 backdrop-blur-md text-[#f1f5f9] font-extrabold text-xs shadow-sm flex items-center gap-1 border border-[#222d3d]">
                    <Sun className="w-3.5 h-3.5 text-[#f3b740]" />
                    {currentPreview.temp} • {currentPreview.condition}
                  </span>

                  <span className="px-2.5 py-1 rounded-sm bg-[#062c20] text-[#34d399] border border-[#059669]/60 font-bold text-xs shadow-sm flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#34d399]" />
                    {currentPreview.safetyScore} Safety Index
                  </span>
                </div>

                {/* Bottom Card Context */}
                <div className="relative z-10 space-y-2 text-white">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#f3b740]">
                    FEATURED ITINERARY PREVIEW
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-[#f1f5f9]">
                    {currentPreview.name}
                  </h3>
                  <p className="text-xs text-[#cbd5e1] max-w-md line-clamp-2">
                    <strong className="text-white">Highlight:</strong> {currentPreview.highlight}
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => openPlannerWithDestination(currentPreview.name)}
                      className="px-4 py-2 rounded-sm bg-[#f3b740] hover:bg-[#e5a83b] text-[#0e131f] font-bold text-xs transition-all inline-flex items-center gap-1.5 shadow-[0_0_15px_rgba(243,183,64,0.3)] active:scale-95"
                    >
                      <span>View Full 3-Day Plan</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#0e131f]" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right 5 Cols: Live Metrics & Hero Accent Card */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                
                {/* Route & Transit Card */}
                <div className="p-4 rounded-md bg-[#141b26] border border-[#222d3d] space-y-2 hover:border-[#f3b740]/40 transition-colors specular-sheen">
                  <div className="flex items-center justify-between text-xs text-[#94a3b8] font-semibold">
                    <span className="flex items-center gap-1">
                      <Route className="w-3.5 h-3.5 text-[#f3b740]" />
                      Verified Corridor
                    </span>
                    <span className="text-[#f3b740] font-bold">{currentPreview.distance}</span>
                  </div>
                  <div className="text-sm font-bold text-[#f1f5f9]">
                    {currentPreview.route}
                  </div>
                  <div className="text-xs text-[#94a3b8] flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#64748b]" />
                    <span>Est. Duration: {currentPreview.duration}</span>
                  </div>
                </div>

                {/* Header / Hero Accent Card: Warm Sunlit Gold gradient card with bold dark contrast text */}
                <div 
                  className="p-4 rounded-md space-y-2 shadow-lg relative overflow-hidden specular-sheen specular-sheen-pulse"
                  style={{ background: 'linear-gradient(135deg, #f7d56e, #e8a635)' }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#0e131f] flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-[#0e131f]" />
                      Safety Corridor Assessment
                    </span>
                    <span className="text-[11px] font-black text-[#0e131f] bg-[#0e131f]/10 px-2 py-0.5 rounded-sm border border-[#0e131f]/20">
                      High Confidence
                    </span>
                  </div>
                  <p className="text-xs text-[#0e131f] leading-relaxed font-semibold">
                    {currentPreview.safetyStatus}. Automated SOS connection to emergency police, certified hospitals, and travel helplines active 24/7.
                  </p>
                </div>

                {/* Recommended Stay Preview */}
                <div className="p-4 rounded-md bg-[#141b26] border border-[#222d3d] space-y-1.5 shadow-sm specular-sheen">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-[#f3b740] block">
                      Curated Verified Stay
                    </span>
                    <span className="px-2 py-0.5 rounded-sm bg-[#062c20] text-[#34d399] border border-[#059669]/40 text-[10px] font-bold">
                      Verified Pick
                    </span>
                  </div>
                  <div className="text-xs font-bold text-[#f1f5f9]">
                    {currentPreview.stayPick}
                  </div>
                  <p className="text-[11px] text-[#94a3b8]">
                    Verified rating 4.8+ • Breakfast & executive airport transfer included.
                  </p>
                </div>

                {/* Quick Action */}
                <button
                  onClick={() => setIsPlannerOpen(true)}
                  className="w-full py-3 rounded-md bg-[#182232] hover:bg-[#222d3d] text-[#f3b740] border border-[#f3b740]/40 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#f3b740]" />
                  <span>Customize This Trip with AI</span>
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Continuous Flow Scroll Indicator */}
        <div className="mt-12 flex flex-col items-center justify-center gap-2 text-[#64748b] hover:text-[#f3b740] transition-colors cursor-pointer group" onClick={() => {
          document.getElementById('plan-section')?.scrollIntoView({ behavior: 'smooth' });
        }}>
          <span className="text-[11px] font-bold uppercase tracking-wider">Start Trip Planning</span>
          <div className="w-5 h-8 rounded-sm border-2 border-[#222d3d] group-hover:border-[#f3b740] flex items-start justify-center p-1 transition-colors">
            <div className="w-1 h-1.5 rounded-none bg-[#64748b] group-hover:bg-[#f3b740] animate-bounce" />
          </div>
        </div>

      </div>
    </section>
  );
};
