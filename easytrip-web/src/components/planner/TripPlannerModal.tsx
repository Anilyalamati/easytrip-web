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

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-fade-in">
        <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-md p-6 sm:p-8 shadow-elevated my-8 animate-marker-pop">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm bg-brand-50 border border-brand-200 flex items-center justify-center p-2 text-brand-600">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-charcoal-900 tracking-tight">
                  Design Your <span className="text-brand-600">EasyTrip</span>
                </h2>
                <p className="text-xs text-charcoal-500">
                  EasyTrip AI balances your schedule, transit routes, and budget tier
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsPlannerOpen(false)}
              className="p-2 rounded-sm text-charcoal-400 hover:text-charcoal-700 hover:bg-slate-100 transition-all"
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
                  <label className="text-xs font-semibold text-charcoal-700 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-brand-600" /> Departure From
                  </label>
                  <button
                    type="button"
                    onClick={detectLocation}
                    disabled={isLocating}
                    className="text-[11px] font-medium text-brand-600 hover:text-brand-700 transition-colors flex items-center gap-1 cursor-pointer bg-brand-50 px-2 py-0.5 rounded-sm border border-brand-200 hover:bg-brand-100"
                    title="Detect city from current GPS coordinates"
                  >
                    {isLocating ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin text-brand-600" />
                        <span>Detecting...</span>
                      </>
                    ) : (
                      <>
                        <Locate className="w-3 h-3 text-brand-600" />
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
                    className="w-full px-4 py-2.5 pr-9 rounded-sm bg-slate-50 border border-slate-200 text-charcoal-900 placeholder-charcoal-400 focus:outline-none focus:border-brand-500 focus:bg-white text-sm transition-all"
                  />
                  <button
                    type="button"
                    onClick={detectLocation}
                    disabled={isLocating}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-sm text-charcoal-400 hover:text-brand-600 hover:bg-slate-200 transition-all"
                    title="Detect city from GPS location"
                  >
                    {isLocating ? (
                      <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
                    ) : (
                      <Locate className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {locationStatus && (
                  <p className="text-[10px] text-teal-600 font-medium mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5 text-teal-600" />
                    {locationStatus}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-600" /> Destination
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={e => setDestination(e.target.value)}
                  placeholder="e.g. Goa, Jaipur, Manali"
                  required
                  className="w-full px-4 py-2.5 rounded-sm bg-slate-50 border border-slate-200 text-charcoal-900 placeholder-charcoal-400 focus:outline-none focus:border-brand-500 focus:bg-white text-sm transition-all"
                />
              </div>
            </div>

            {/* Quick destination suggestion chips */}
            <div>
              <span className="text-[11px] text-charcoal-500 font-medium mr-2">Popular escapes:</span>
              <div className="inline-flex flex-wrap gap-1.5 mt-1">
                {quickCities.map(city => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setDestination(city)}
                    className={`text-xs px-2.5 py-1 rounded-sm border transition-all ${
                      destination.toLowerCase() === city.toLowerCase()
                        ? 'bg-brand-600 text-white border-brand-600 font-bold shadow-sm'
                        : 'bg-slate-50 text-charcoal-700 border-slate-200 hover:border-brand-300 hover:bg-slate-100'
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
                <label className="block text-xs font-semibold text-charcoal-700 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-brand-600" /> Travel Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-sm bg-slate-50 border border-slate-200 text-charcoal-900 focus:outline-none focus:border-brand-500 focus:bg-white text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-brand-600" /> Duration (Days)
                </label>
                <div className="flex items-center gap-2">
                  {[2, 3, 4, 5, 7].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setDays(num)}
                      className={`flex-1 py-2 rounded-sm text-xs font-semibold border transition-all ${
                        days === num
                          ? 'bg-brand-600 text-white border-brand-600 font-bold shadow-sm'
                          : 'bg-slate-50 text-charcoal-700 border-slate-200 hover:border-brand-300 hover:bg-slate-100'
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
              <label className="block text-xs font-semibold text-charcoal-700 mb-2 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-brand-600" /> Budget Tier
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
                    className={`p-3 rounded-sm border text-left transition-all ${
                      budget === item.key
                        ? 'bg-brand-50 border-brand-500 text-charcoal-900 shadow-sm ring-1 ring-brand-500'
                        : 'bg-slate-50 border-slate-200 text-charcoal-700 hover:border-slate-300'
                    }`}
                  >
                    <div className={`text-xs font-bold ${budget === item.key ? 'text-brand-700' : 'text-charcoal-800'}`}>
                      {item.label}
                    </div>
                    <div className="text-[10px] text-charcoal-500 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Travel Style */}
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-brand-600" /> Traveling With
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['Solo', 'Couple', 'Family', 'Friends'].map(style => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setTravelStyle(style)}
                    className={`py-2 px-3 rounded-sm text-xs font-semibold border transition-all ${
                      travelStyle === style
                        ? 'bg-brand-600 text-white border-brand-600 font-bold shadow-sm'
                        : 'bg-slate-50 text-charcoal-700 border-slate-200 hover:border-brand-300 hover:bg-slate-100'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Transport Preference */}
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-2 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-brand-600" /> Preferred Transport Mode
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
                      className={`py-2 px-2.5 rounded-sm text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                        transport === item.id
                          ? 'bg-brand-600 text-white border-brand-600 font-bold shadow-sm'
                          : 'bg-slate-50 text-charcoal-700 border-slate-200 hover:border-brand-300 hover:bg-slate-100'
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
              <label className="block text-xs font-semibold text-charcoal-700 mb-2">
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
                      className={`px-3 py-1.5 rounded-sm text-xs font-medium border transition-all ${
                        isSelected
                          ? 'bg-brand-50 border-brand-300 text-brand-700 font-semibold'
                          : 'bg-slate-50 border-slate-200 text-charcoal-600 hover:border-slate-300'
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
                className="w-full py-3.5 rounded-md bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm tracking-wide shadow-card hover:shadow-elevated active:scale-[0.99] transition-all flex items-center justify-center gap-2"
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
