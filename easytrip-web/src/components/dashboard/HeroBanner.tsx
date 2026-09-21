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

  return (
    <section className="relative pt-6 sm:pt-10 pb-16 overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-brand-100/40 via-teal-50/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Hero Intro Header */}
        <div className="max-w-3xl mx-auto text-center space-y-5 mb-12 sm:mb-16">
          
          {/* 150ms Sequence: Eyebrow */}
          <div className="animate-fade-in inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-sm text-xs font-bold text-teal-700">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
            <span className="tracking-wider uppercase">SMART TRAVEL COMPANION</span>
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

          {/* 650ms Sequence: Action CTAs */}
          <div className="animate-fade-in-up pt-2 flex flex-wrap items-center justify-center gap-3.5">
            <button
              onClick={() => setIsPlannerOpen(true)}
              className="px-6 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm tracking-normal shadow-button hover:shadow-lg active:scale-95 transition-all flex items-center gap-2 group"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Plan My Trip</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={scrollToExplore}
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-midnight-900 border border-slate-200/90 font-bold text-sm tracking-normal shadow-sm hover:border-slate-300 active:scale-95 transition-all"
            >
              Explore EasyTrip
            </button>
          </div>

          {/* Trust Value Badges */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-charcoal-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              Real Verified Landmarks
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              National Highway & Rail Routes
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              100% INR (₹) Realistic Budgets
            </span>
          </div>
        </div>

        {/* 800ms Sequence: Interactive Product Mockup Settle */}
        <div className="animate-fade-in-up surface-elevated rounded-3xl p-4 sm:p-7 max-w-5xl mx-auto border border-slate-200/90 shadow-elevated relative overflow-hidden">
          
          {/* Mockup Window Chrome Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 mr-2">
                <span className="w-3 h-3 rounded-full bg-rose-400/80" />
                <span className="w-3 h-3 rounded-full bg-amber-400/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-400/80" />
              </div>
              <span className="text-xs font-bold text-midnight-900 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-brand-600" />
                EasyTrip Intelligence Preview
              </span>
            </div>

            {/* Quick City Switcher within mockup */}
            <div className="flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-xl">
              {(['Vizag', 'Ooty', 'Paris'] as const).map(city => (
                <button
                  key={city}
                  onClick={() => setActivePreviewCity(city)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activePreviewCity === city
                      ? 'bg-white text-midnight-900 shadow-sm'
                      : 'text-charcoal-500 hover:text-midnight-900'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Inner Interactive Dashboard Layout */}
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            
            {/* Left 7 Cols: Image & Itinerary Preview */}
            <div className="lg:col-span-7 rounded-2xl overflow-hidden relative min-h-[300px] sm:min-h-[360px] flex flex-col justify-between p-5 border border-slate-200/80 group">
              <img
                src={currentPreview.image}
                alt={currentPreview.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-midnight-950/90 via-midnight-950/40 to-transparent" />

              {/* Floating Top Indicators */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-midnight-900 font-extrabold text-xs shadow-sm flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  {currentPreview.temp} • {currentPreview.condition}
                </span>

                <span className="px-3 py-1 rounded-full bg-emerald-500/90 backdrop-blur-md text-white font-bold text-xs shadow-sm flex items-center gap-1">
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
                    className="px-4 py-2 rounded-xl bg-white text-midnight-900 hover:bg-brand-50 font-bold text-xs transition-all inline-flex items-center gap-1.5 shadow"
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
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
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
              <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-800 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-teal-600" />
                    Safety Corridor Assessment
                  </span>
                  <span className="text-[11px] font-black text-teal-700 bg-white px-2 py-0.5 rounded-md border border-teal-200">
                    High Confidence
                  </span>
                </div>
                <p className="text-xs text-teal-900 leading-relaxed font-medium">
                  {currentPreview.safetyStatus}. Automated SOS connection to emergency police, certified hospitals, and travel helplines active 24/7.
                </p>
              </div>

              {/* Recommended Stay Preview */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-1.5 shadow-sm">
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
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-midnight-900 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span>Customize This Trip with AI</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
