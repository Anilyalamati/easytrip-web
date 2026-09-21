import React, { useState } from 'react';
import { useTrip } from '../../context/TripContext';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Compass, 
  ArrowRight, 
  Plane, 
  Train, 
  Car, 
  Locate, 
  Loader2, 
  CheckCircle2, 
  DollarSign, 
  Users 
} from 'lucide-react';
import { GenerationOverlay } from '../planner/GenerationOverlay';

export const QuickPlannerBar: React.FC = () => {
  const { planTrip, openPlannerWithDestination } = useTrip();
  
  const [destination, setDestination] = useState('Vizag');
  const [origin, setOrigin] = useState('Current Location');
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState<'budget' | 'moderate' | 'luxury'>('moderate');
  const [travelStyle, setTravelStyle] = useState('Couple');
  const [transport, setTransport] = useState('flight');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const [originCoordinates, setOriginCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  const quickCities = ['Vizag', 'Rajahmundry', 'Ooty', 'Manali', 'Paris', 'Tokyo', 'Goa'];

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation not supported');
      return;
    }

    setIsLocating(true);
    setLocationStatus('Locating...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          let resolvedCity = '';

          try {
            const bdcRes = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            if (bdcRes.ok) {
              const data = await bdcRes.json();
              resolvedCity = data.city || data.locality || data.principalSubdivision || '';
            }
          } catch (e) {
            console.warn('BigDataCloud lookup failed:', e);
          }

          setOriginCoordinates({ lat: latitude, lng: longitude });
          if (resolvedCity) {
            setOrigin(resolvedCity);
            setLocationStatus(`Located: ${resolvedCity}`);
          } else {
            setOrigin('Current Location');
            setLocationStatus('GPS active');
          }
        } catch (err) {
          console.error(err);
          setLocationStatus('Failed to locate');
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        console.warn(err);
        setIsLocating(false);
        setLocationStatus('GPS permission denied');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalDest = destination.trim();
    if (!finalDest) return;

    setIsSubmitting(true);
    try {
      await planTrip({
        destination: finalDest,
        origin: origin.trim() || 'Current Location',
        originCoordinates,
        days,
        budget,
        travelStyle,
        interests: ['Culture', 'Relaxation', 'Foodie'],
        transport
      });
    } catch (err) {
      console.error('Plan trip error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isSubmitting && <GenerationOverlay destination={destination} />}

      <section id="plan-section" className="my-12 sm:my-16 scroll-mt-24">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-[#182232] text-[#f3b740] text-xs font-bold border border-[#f3b740]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SECTION 01 — PLAN</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#f1f5f9] tracking-tight">
            Start with where you want to go.
          </h2>
          <p className="text-sm text-[#94a3b8] leading-relaxed">
            Select your destination, schedule, and preferred style. EasyTrip builds verified transit corridors, stays, and authentic daily stops.
          </p>
        </div>

        {/* Interactive Planner Canvas */}
        <div className="surface-elevated rounded-md p-6 sm:p-8 border border-[#222d3d] shadow-2xl max-w-5xl mx-auto bg-[#141b26]">
          <form onSubmit={handleGenerate} className="space-y-6">
            
            {/* Top Grid: Departure & Destination */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Departure Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-[#cbd5e1]">
                  <label className="flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-[#f3b740]" />
                    Departure From
                  </label>
                  <button
                    type="button"
                    onClick={detectLocation}
                    disabled={isLocating}
                    className="text-[11px] font-semibold text-[#f3b740] hover:text-[#f7d56e] flex items-center gap-1 transition-colors"
                  >
                    {isLocating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Locate className="w-3 h-3" />}
                    <span>{locationStatus || 'Auto-Detect GPS'}</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={origin}
                    onChange={e => setOrigin(e.target.value)}
                    placeholder="e.g. Hyderabad, Bengaluru, Delhi"
                    className="w-full px-4 py-3 rounded-sm bg-[#161e2b] border border-[#222d3d] text-sm font-medium text-[#f1f5f9] placeholder-[#64748b] focus:bg-[#182232] focus:outline-none focus:border-[#f3b740] focus:ring-2 focus:ring-[#f3b740]/20 transition-all"
                  />
                </div>
              </div>

              {/* Destination Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#cbd5e1] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#34d399]" />
                  Destination City or Region
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={destination}
                    onChange={e => setDestination(e.target.value)}
                    placeholder="e.g. Vizag, Rajahmundry, Ooty, Paris, Manali"
                    required
                    className="w-full px-4 py-3 rounded-sm bg-[#161e2b] border border-[#222d3d] text-sm font-semibold text-[#f1f5f9] placeholder-[#64748b] focus:bg-[#182232] focus:outline-none focus:border-[#f3b740] focus:ring-2 focus:ring-[#f3b740]/20 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Quick Destination Recommendation Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-bold text-[#94a3b8] mr-1">Popular Escapes:</span>
              {quickCities.map(city => (
                <button
                  key={city}
                  type="button"
                  onClick={() => setDestination(city)}
                  className={`text-xs px-3 py-1.5 rounded-sm border transition-all ${
                    destination.toLowerCase() === city.toLowerCase()
                      ? 'bg-[#f3b740] text-[#0e131f] border-[#f3b740] font-bold shadow-[0_0_12px_rgba(243,183,64,0.3)]'
                      : 'bg-[#161e2b] text-[#cbd5e1] border-[#222d3d] hover:border-[#f3b740]/40 hover:text-[#f3b740]'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>

            {/* Middle Grid: Duration, Budget, Transport */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2 border-t border-[#222d3d]">
              
              {/* Duration Pills */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#cbd5e1] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#f3b740]" />
                  Duration
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[2, 3, 5, 7].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setDays(num)}
                      className={`py-2 rounded-sm text-xs font-bold border transition-all ${
                        days === num
                          ? 'bg-[#f3b740] text-[#0e131f] border-[#f3b740] shadow-[0_0_12px_rgba(243,183,64,0.3)]'
                          : 'bg-[#161e2b] text-[#cbd5e1] border-[#222d3d] hover:border-[#f3b740]/40'
                      }`}
                    >
                      {num} Days
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget Tier */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#cbd5e1] flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-[#34d399]" />
                  Budget Tier (INR ₹)
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { key: 'budget', label: 'Budget' },
                    { key: 'moderate', label: 'Moderate' },
                    { key: 'luxury', label: 'Luxury' },
                  ].map(b => (
                    <button
                      key={b.key}
                      type="button"
                      onClick={() => setBudget(b.key as any)}
                      className={`py-2 px-1 text-center rounded-sm text-xs font-bold border transition-all capitalize ${
                        budget === b.key
                          ? 'bg-[#f3b740] text-[#0e131f] border-[#f3b740] shadow-[0_0_12px_rgba(243,183,64,0.3)]'
                          : 'bg-[#161e2b] text-[#cbd5e1] border-[#222d3d] hover:border-[#f3b740]/40'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferred Transport */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#cbd5e1] flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-[#f3b740]" />
                  Preferred Transport
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'flight', label: 'Air', icon: Plane },
                    { id: 'train', label: 'Train', icon: Train },
                    { id: 'drive', label: 'Drive', icon: Compass },
                    { id: 'cab', label: 'Cab', icon: Car },
                  ].map(t => {
                    const Icon = t.icon;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTransport(t.id)}
                        className={`py-2 text-center rounded-sm text-xs font-bold border flex items-center justify-center gap-1 transition-all ${
                          transport === t.id
                            ? 'bg-[#f3b740] text-[#0e131f] border-[#f3b740] shadow-[0_0_12px_rgba(243,183,64,0.3)]'
                            : 'bg-[#161e2b] text-[#cbd5e1] border-[#222d3d] hover:border-[#f3b740]/40'
                        }`}
                        title={t.label}
                      >
                        <Icon className="w-3 h-3" />
                        <span>{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Submit Bar */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-md bg-[#f3b740] hover:bg-[#e5a83b] text-[#0e131f] font-extrabold text-sm tracking-normal shadow-[0_2px_14px_rgba(243,183,64,0.35)] active:scale-[0.99] transition-all flex items-center justify-center gap-2 ${
                  isSubmitting ? 'opacity-85 cursor-wait' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-[#0e131f] border-t-transparent animate-spin" />
                    <span>Contacting Grok Intelligence & Mapping Itinerary...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#0e131f]" />
                    <span>Generate Verified {days}-Day Itinerary for {destination || 'Destination'}</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

      </section>
    </>
  );
};
