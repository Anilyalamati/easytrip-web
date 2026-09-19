import React, { useState, useEffect } from 'react';
import { useTrip } from '../../context/TripContext';
import { BookingHotel, BookingTransport, BookingExperience } from '../../types/trip';
import { 
  Building2, 
  Plane, 
  Car, 
  Compass, 
  Star, 
  Check, 
  Plus, 
  ShoppingBag, 
  DollarSign, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';
import { apiUrl } from '../../utils/api';

export const BookingHub: React.FC = () => {
  const { currentTrip, addToCart, cart, setIsCheckoutOpen } = useTrip();
  const [activeTab, setActiveTab] = useState<'hotels' | 'transport' | 'experiences'>('hotels');
  
  const [options, setOptions] = useState<{
    hotels: BookingHotel[];
    transport: BookingTransport[];
    experiences: BookingExperience[];
  }>({ hotels: [], transport: [], experiences: [] });

  const [loading, setLoading] = useState(true);

  const destination = currentTrip?.destination || 'Goa';

  useEffect(() => {
    setLoading(true);
    fetch(apiUrl(`/api/bookings/options?destination=${encodeURIComponent(destination)}`))
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          setOptions(json.data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [destination]);

  const totalCartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="my-8 space-y-8">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-navy-750 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-gold-400 text-xs uppercase font-bold tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Booking Suggestions Around Your Plan</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Book Stays, Transport & Experiences for <span className="gold-gradient-text">{destination}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Hand-picked luxury selections matched to your itinerary dates and preferences.
          </p>
        </div>

        {/* Floating Cart Trigger */}
        <button
          onClick={() => setIsCheckoutOpen(true)}
          className="relative px-5 py-3 rounded-2xl gold-gradient-bg text-navy-950 font-bold text-xs tracking-wide shadow-gold-glow hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>View Cart & Checkout ({totalCartCount})</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-navy-800 pb-3">
        <button
          onClick={() => setActiveTab('hotels')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'hotels'
              ? 'bg-gold-500 text-navy-950 shadow-gold-glow'
              : 'bg-navy-850 text-slate-400 hover:text-white hover:bg-navy-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Hotels & Resorts ({options.hotels.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('transport')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'transport'
              ? 'bg-gold-500 text-navy-950 shadow-gold-glow'
              : 'bg-navy-850 text-slate-400 hover:text-white hover:bg-navy-800'
          }`}
        >
          <Plane className="w-4 h-4" />
          <span>Flights & Chauffeur Cabs ({options.transport.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('experiences')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'experiences'
              ? 'bg-gold-500 text-navy-950 shadow-gold-glow'
              : 'bg-navy-850 text-slate-400 hover:text-white hover:bg-navy-800'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Curated Experiences ({options.experiences.length})</span>
        </button>
      </div>

      {/* Content for Hotels */}
      {activeTab === 'hotels' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {options.hotels.map(hotel => {
            const inCart = cart.some(i => i.id === hotel.id);
            return (
              <div key={hotel.id} className="glass-card rounded-3xl overflow-hidden border border-navy-750 flex flex-col justify-between glass-card-hover">
                <div>
                  <div className="relative h-48 w-full overflow-hidden">
                    <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-navy-900/90 text-[10px] font-bold text-gold-300 border border-gold-500/30 uppercase">
                      {hotel.badge}
                    </span>
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-navy-900/90 text-xs font-bold text-white">
                      <Star className="w-3 h-3 text-gold-400 fill-gold-400" />
                      <span>{hotel.rating}</span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="text-lg font-bold text-white tracking-tight">{hotel.name}</h3>
                    <p className="text-xs text-slate-400">{hotel.location}</p>
                    <p className="text-xs text-gold-300 font-medium">{hotel.type}</p>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {hotel.amenities.map(a => (
                        <span key={a} className="text-[10px] px-2 py-0.5 rounded-md bg-navy-800 text-slate-300 border border-navy-700">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-navy-800/80 flex items-center justify-between mt-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Nightly Rate</span>
                    <div className="text-lg font-extrabold text-white">
                      ${hotel.pricePerNight} <span className="text-xs text-slate-400 font-normal">/ night</span>
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart({
                      id: hotel.id,
                      type: 'hotel',
                      title: hotel.name,
                      subtitle: `${hotel.type} - ${hotel.location}`,
                      price: hotel.pricePerNight,
                      quantity: 1,
                      image: hotel.image,
                      badge: hotel.badge
                    })}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      inCart
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'gold-gradient-bg text-navy-950 hover:brightness-110 shadow-sm'
                    }`}
                  >
                    {inCart ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>{inCart ? 'In Cart' : 'Reserve Room'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Content for Transport */}
      {activeTab === 'transport' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {options.transport.map(tr => {
            const inCart = cart.some(i => i.id === tr.id);
            const isFlight = tr.type === 'flight';
            const Icon = isFlight ? Plane : Car;

            return (
              <div key={tr.id} className="glass-card rounded-3xl p-6 border border-navy-750 flex flex-col justify-between space-y-4 glass-card-hover">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-1 rounded-full bg-navy-850 text-gold-300 border border-gold-500/30 text-[10px] font-bold uppercase">
                      {tr.badge}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Icon className="w-4 h-4 text-gold-400" />
                      <span className="font-semibold text-slate-200">{tr.class}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white">{tr.title}</h3>
                  <p className="text-xs text-slate-400">{tr.carrier}</p>

                  <div className="my-4 p-3 rounded-2xl bg-navy-900/90 border border-navy-750 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Departure</span>
                      <div className="font-bold text-slate-200">{tr.departure}</div>
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] text-gold-400 font-bold">{tr.duration}</span>
                      <div className="w-16 h-0.5 bg-gold-500/40 mx-auto mt-1" />
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Arrival</span>
                      <div className="font-bold text-slate-200">{tr.arrival}</div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    <strong>Includes:</strong> {tr.baggage}
                  </p>
                </div>

                <div className="pt-3 border-t border-navy-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Rate</span>
                    <div className="text-lg font-extrabold text-white">${tr.price}</div>
                  </div>

                  <button
                    onClick={() => addToCart({
                      id: tr.id,
                      type: tr.type,
                      title: tr.title,
                      subtitle: `${tr.carrier} (${tr.class})`,
                      price: tr.price,
                      quantity: 1,
                      badge: tr.badge
                    })}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      inCart
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'gold-gradient-bg text-navy-950 hover:brightness-110'
                    }`}
                  >
                    {inCart ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>{inCart ? 'Booked in Cart' : 'Book Transit'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Content for Experiences */}
      {activeTab === 'experiences' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {options.experiences.map(exp => {
            const inCart = cart.some(i => i.id === exp.id);
            return (
              <div key={exp.id} className="glass-card rounded-3xl overflow-hidden border border-navy-750 flex flex-col justify-between glass-card-hover">
                <div>
                  <div className="relative h-44 w-full overflow-hidden">
                    <img src={exp.image} alt={exp.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-navy-900/90 text-[10px] font-bold text-gold-300 border border-gold-500/30 uppercase">
                      {exp.badge}
                    </span>
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-navy-900/90 text-xs font-bold text-white">
                      <Star className="w-3 h-3 text-gold-400 fill-gold-400" />
                      <span>{exp.rating}</span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="text-base font-bold text-white">{exp.title}</h3>
                    <p className="text-xs text-slate-400">{exp.category} • {exp.duration}</p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-navy-800/80 flex items-center justify-between mt-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Per Person</span>
                    <div className="text-lg font-extrabold text-white">${exp.price}</div>
                  </div>

                  <button
                    onClick={() => addToCart({
                      id: exp.id,
                      type: 'experience',
                      title: exp.title,
                      subtitle: `${exp.category} - ${exp.duration}`,
                      price: exp.price,
                      quantity: 1,
                      image: exp.image,
                      badge: exp.badge
                    })}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      inCart
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'gold-gradient-bg text-navy-950 hover:brightness-110'
                    }`}
                  >
                    {inCart ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>{inCart ? 'Selected' : 'Add Pass'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
