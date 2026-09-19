import React, { useState, useEffect } from 'react';
import { useTrip } from '../../context/TripContext';
import { X, Sparkles, MapPin, Calendar, DollarSign, Users, Compass, Car, Plane, Train, Locate, Loader2, CheckCircle2 } from 'lucide-react';
import { GenerationOverlay } from './GenerationOverlay';

export const TripPlannerModal: React.FC = () => {
  const { isPlannerOpen, setIsPlannerOpen, planTrip, prefillDestination, prefillDays, destinations } = useTrip();

  const [destination, setDestination] = useState('Vizag');
  const [origin, setOrigin] = useState('Current Location');
  const [days, setDays] = useState(3);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [budget, setBudget] = useState<'budget' | 'moderate' | 'luxury'>('moderate');
  const [travelStyle, setTravelStyle] = useState('Couple');
  const [interests, setInterests] = useState<string[]>(['Culture', 'Relaxation', 'Foodie']);
  const [transport, setTransport] = useState('flight');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const [originCoordinates, setOriginCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (prefillDestination) {
      setDestination(prefillDestination);
    }
  }, [prefillDestination]);

  useEffect(() => {
    if (prefillDays) {
      setDays(prefillDays);
    }
  }, [prefillDays]);

  if (!isPlannerOpen) return null;

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation not supported by browser');
      return;
    }

    setIsLocating(true);
    setLocationStatus('Detecting GPS location...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          let resolvedCity = '';

          // 1. Try BigDataCloud reverse geocode client (fast, CORS-friendly)
          try {
            const bdcRes = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            if (bdcRes.ok) {
              const data = await bdcRes.json();
              resolvedCity = data.city || data.locality || data.principalSubdivision || '';
            }
          } catch (e) {
            console.warn('BigDataCloud lookup failed, trying Nominatim fallback:', e);
          }

          // 2. Fallback to OpenStreetMap Nominatim
          if (!resolvedCity) {
            try {
              const nomRes = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`,
                { headers: { 'User-Agent': 'EasyTripWeb/2.0' } }
              );
              if (nomRes.ok) {
                const data = await nomRes.json();
                const addr = data.address || {};
                resolvedCity = addr.city || addr.town || addr.village || addr.county || addr.state_district || addr.state || '';
              }
            } catch (e) {
              console.warn('Nominatim reverse geocode error:', e);
            }
          }

          setOriginCoordinates({ lat: latitude, lng: longitude });
          if (resolvedCity) {
            setOrigin(resolvedCity);
            setLocationStatus(`Located: ${resolvedCity}`);
          } else {
            setOrigin('Current Location');
            setLocationStatus('Could not resolve city');
          }
        } catch (err) {
          console.error('Location resolution error:', err);
          setLocationStatus('Lookup failed');
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        console.warn('Geolocation permission error:', err);
        setIsLocating(false);
        setLocationStatus('Location permission denied');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const toggleInterest = (tag: string) => {
    setInterests(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
        startDate,
        budget,
        travelStyle,
        interests,
        transport
      });
    } catch (err) {
      console.error('Plan trip error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickCities = ['Vizag', 'Rajahmundry', 'Goa', 'Jaipur', 'Manali', 'Paris', 'Tokyo'];

  return (
    <>
      {isSubmitting && <GenerationOverlay destination={destination} />}

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md overflow-y-auto">
        <div className="relative w-full max-w-2xl bg-navy-850 border border-gold-500/30 rounded-3xl p-6 sm:p-8 shadow-gold-glow-lg my-8">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-navy-700/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-navy-800 border border-gold-500/40 flex items-center justify-center p-2">
                <Sparkles className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Design Your <span className="gold-gradient-text">EasyTrip</span>
                </h2>
                <p className="text-xs text-slate-400">
                  EasyTrip AI will turn these choices into a tailored day-by-day plan
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsPlannerOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-navy-750 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            
            {/* Origin & Destination */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-gold-400" /> Departure From
                  </label>
                  <button
                    type="button"
                    onClick={detectLocation}
                    disabled={isLocating}
                    className="text-[11px] font-medium text-gold-400 hover:text-gold-300 transition-colors flex items-center gap-1 cursor-pointer bg-navy-800/80 px-2 py-0.5 rounded-md border border-navy-700 hover:border-gold-500/40"
                    title="Detect city from current GPS coordinates"
                  >
                    {isLocating ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin text-gold-400" />
                        <span>Detecting...</span>
                      </>
                    ) : (
                      <>
                        <Locate className="w-3 h-3 text-gold-400" />
                        <span>Auto-Detect GPS</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={origin}
                    onChange={e => {
                      setOrigin(e.target.value);
                      if (locationStatus) setLocationStatus(null);
                    }}
                    onFocus={() => {
                      if (origin === 'Current Location') {
                        detectLocation();
                      }
                    }}
                    placeholder="e.g. Mumbai, Visakhapatnam, London"
                    required
                    className="w-full px-4 py-2.5 pr-9 rounded-xl bg-navy-900 border border-navy-700 text-white placeholder-slate-500 focus:outline-none focus:border-gold-500/80 text-sm"
                  />
                  <button
                    type="button"
                    onClick={detectLocation}
                    disabled={isLocating}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-gold-400 hover:bg-navy-800 transition-all"
                    title="Detect city from GPS location"
                  >
                    {isLocating ? (
                      <Loader2 className="w-4 h-4 animate-spin text-gold-400" />
                    ) : (
                      <Locate className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {locationStatus && (
                  <p className="text-[10px] text-gold-400/90 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5 text-gold-400" />
                    {locationStatus}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gold-400" /> Destination
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={e => setDestination(e.target.value)}
                  placeholder="e.g. Goa, Jaipur, Manali"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-white placeholder-slate-500 focus:outline-none focus:border-gold-500/80 text-sm"
                />
              </div>
            </div>

            {/* Quick destination suggestion chips */}
            <div>
              <span className="text-[11px] text-slate-400 font-medium mr-2">Popular escapes:</span>
              <div className="inline-flex flex-wrap gap-1.5 mt-1">
                {quickCities.map(city => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setDestination(city)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                      destination.toLowerCase() === city.toLowerCase()
                        ? 'bg-gold-500 text-navy-950 border-gold-400 font-bold'
                        : 'bg-navy-800 text-slate-300 border-navy-700 hover:border-gold-500/40'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Dates & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gold-400" /> Travel Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-white focus:outline-none focus:border-gold-500/80 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gold-400" /> Duration (Days)
                </label>
                <div className="flex items-center gap-2">
                  {[2, 3, 4, 5, 7].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setDays(num)}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        days === num
                          ? 'bg-gold-500 text-navy-950 border-gold-400 font-bold shadow-sm'
                          : 'bg-navy-900 text-slate-300 border-navy-700 hover:border-gold-500/40'
                      }`}
                    >
                      {num}d
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Budget Tier */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-gold-400" /> Budget Tier
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: 'budget', label: 'Backpacker / Budget', desc: 'Smart & practical' },
                  { key: 'moderate', label: 'Balanced / Moderate', desc: 'Comfort & leisure' },
                  { key: 'luxury', label: 'High Luxury', desc: 'First class & 5-star' },
                ].map(item => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setBudget(item.key as any)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      budget === item.key
                        ? 'bg-gold-500/15 border-gold-400 text-white shadow-gold-glow'
                        : 'bg-navy-900 border-navy-700 text-slate-300 hover:border-gold-500/30'
                    }`}
                  >
                    <div className={`text-xs font-bold ${budget === item.key ? 'text-gold-300' : 'text-slate-200'}`}>
                      {item.label}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Travel Style */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-gold-400" /> Traveling With
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['Solo', 'Couple', 'Family', 'Friends'].map(style => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setTravelStyle(style)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      travelStyle === style
                        ? 'bg-gold-500 text-navy-950 border-gold-400 font-bold'
                        : 'bg-navy-900 text-slate-300 border-navy-700 hover:border-gold-500/30'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Transport Preference */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-gold-400" /> Preferred Transport Mode
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'flight', label: 'Flight', icon: Plane },
                  { id: 'train', label: 'Train', icon: Train },
                  { id: 'drive', label: 'Drive', icon: Compass },
                  { id: 'cab', label: 'Taxi / Cab', icon: Car },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTransport(item.id)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                        transport === item.id
                          ? 'bg-gold-500 text-navy-950 border-gold-400 font-bold'
                          : 'bg-navy-900 text-slate-300 border-navy-700 hover:border-gold-500/30'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interests Multi-Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Your Interests & Vibe
              </label>
              <div className="flex flex-wrap gap-2">
                {['Culture', 'Adventure', 'Foodie', 'Relaxation', 'Nature', 'Nightlife', 'Photography'].map(tag => {
                  const isSelected = interests.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleInterest(tag)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                        isSelected
                          ? 'bg-gold-500/20 border-gold-400 text-gold-200 font-semibold'
                          : 'bg-navy-900 border-navy-700 text-slate-400 hover:border-gold-500/30'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}{tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl gold-gradient-bg text-navy-950 font-extrabold text-sm tracking-wide shadow-gold-glow hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Design My Journey with EasyTrip AI</span>
              </button>
            </div>

          </form>

        </div>
      </div>
    </>
  );
};
