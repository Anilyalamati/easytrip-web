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
  IndianRupee, 
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
      <div className="bg-[#141b26] rounded-md p-6 sm:p-8 border border-[#222d3d] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-[#f3b740] text-xs uppercase font-bold tracking-wider mb-1">
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
          className="relative px-5 py-3 rounded-sm gold-gradient-bg text-[#0e131f] font-bold text-xs tracking-wide shadow-gold-glow hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>View Cart & Checkout ({totalCartCount})</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#222d3d] pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('hotels')}
          className={`px-5 py-2.5 rounded-sm text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'hotels'
              ? 'bg-[#f3b740] text-[#0e131f] shadow-gold-glow'
              : 'bg-[#182232] text-slate-400 hover:text-white hover:bg-[#1f2c3f] border border-[#222d3d]'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Hotels & Resorts ({options.hotels.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('transport')}
          className={`px-5 py-2.5 rounded-sm text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'transport'
              ? 'bg-[#f3b740] text-[#0e131f] shadow-gold-glow'
              : 'bg-[#182232] text-slate-400 hover:text-white hover:bg-[#1f2c3f] border border-[#222d3d]'
          }`}
        >
          <Plane className="w-4 h-4" />
          <span>Flights & Chauffeur Cabs ({options.transport.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('experiences')}
          className={`px-5 py-2.5 rounded-sm text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'experiences'
              ? 'bg-[#f3b740] text-[#0e131f] shadow-gold-glow'
              : 'bg-[#182232] text-slate-400 hover:text-white hover:bg-[#1f2c3f] border border-[#222d3d]'
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
              <div key={hotel.id} className="bg-[#141b26] rounded-md overflow-hidden border border-[#222d3d] flex flex-col justify-between hover:border-[#f3b740]/40 transition-all shadow-md group">
                <div>
                  <div className="relative h-48 w-full overflow-hidden">
                    <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-sm bg-[#0b0e14]/85 text-[10px] font-bold text-[#f3b740] border border-[#f3b740]/30 uppercase">
                      {hotel.badge}
                    </span>
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-sm bg-[#0b0e14]/85 text-xs font-bold text-white">
                      <Star className="w-3 h-3 text-[#f3b740] fill-[#f3b740]" />
                      <span>{hotel.rating}</span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-[#f3b740] transition-colors">{hotel.name}</h3>
                    <p className="text-xs text-slate-400">{hotel.location}</p>
                    <p className="text-xs text-[#f3b740] font-medium">{hotel.type}</p>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {hotel.amenities.map(a => (
                        <span key={a} className="text-[10px] px-2 py-0.5 rounded-sm bg-[#182232] text-slate-300 border border-[#222d3d]">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-3 border-t border-[#222d3d] flex items-center justify-between mt-4 bg-[#141b26]/50">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Nightly Rate</span>
                    <div className="text-lg font-extrabold text-[#34d399]">
                      ₹{hotel.pricePerNight.toLocaleString('en-IN')} <span className="text-xs text-slate-400 font-normal">/ night</span>
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
                    className={`px-4 py-2 rounded-sm text-xs font-bold transition-all flex items-center gap-1.5 ${
                      inCart
                        ? 'bg-[#062c20] text-[#34d399] border border-[#059669]/40'
                        : 'gold-gradient-bg text-[#0e131f] hover:brightness-110 shadow-sm'
                    }`}
                  >
                    {inCart ? <Check className="w-3.5 h-3.5 text-[#34d399]" /> : <Plus className="w-3.5 h-3.5" />}
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
              <div key={tr.id} className="bg-[#141b26] rounded-md p-6 border border-[#222d3d] flex flex-col justify-between space-y-4 hover:border-[#f3b740]/40 transition-all shadow-md">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-1 rounded-sm bg-[#182232] text-[#f3b740] border border-[#f3b740]/30 text-[10px] font-bold uppercase">
                      {tr.badge}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Icon className="w-4 h-4 text-[#f3b740]" />
                      <span className="font-semibold text-slate-200">{tr.class}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white">{tr.title}</h3>
                  <p className="text-xs text-slate-400">{tr.carrier}</p>

                  <div className="my-4 p-3 rounded-sm bg-[#182232] border border-[#222d3d] flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Departure</span>
                      <div className="font-bold text-slate-200">{tr.departure}</div>
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] text-[#f3b740] font-bold">{tr.duration}</span>
                      <div className="w-16 h-0.5 bg-[#f3b740]/40 mx-auto mt-1" />
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Arrival</span>
                      <div className="font-bold text-slate-200">{tr.arrival}</div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    <strong>Includes:</strong> {tr.baggage}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#222d3d] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Rate</span>
                    <div className="text-lg font-extrabold text-[#34d399]">₹{tr.price.toLocaleString('en-IN')}</div>
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
                    className={`px-4 py-2 rounded-sm text-xs font-bold transition-all flex items-center gap-1.5 ${
                      inCart
                        ? 'bg-[#062c20] text-[#34d399] border border-[#059669]/40'
                        : 'gold-gradient-bg text-[#0e131f] hover:brightness-110 shadow-sm'
                    }`}
                  >
                    {inCart ? <Check className="w-3.5 h-3.5 text-[#34d399]" /> : <Plus className="w-3.5 h-3.5" />}
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
              <div key={exp.id} className="bg-[#141b26] rounded-md overflow-hidden border border-[#222d3d] flex flex-col justify-between hover:border-[#f3b740]/40 transition-all shadow-md group">
                <div>
                  <div className="relative h-44 w-full overflow-hidden">
                    <img src={exp.image} alt={exp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-sm bg-[#0b0e14]/85 text-[10px] font-bold text-[#f3b740] border border-[#f3b740]/30 uppercase">
                      {exp.badge}
                    </span>
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-sm bg-[#0b0e14]/85 text-xs font-bold text-white">
                      <Star className="w-3 h-3 text-[#f3b740] fill-[#f3b740]" />
                      <span>{exp.rating}</span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="text-base font-bold text-white group-hover:text-[#f3b740] transition-colors">{exp.title}</h3>
                    <p className="text-xs text-slate-400">{exp.category} • {exp.duration}</p>
                  </div>
                </div>

                <div className="p-5 pt-3 border-t border-[#222d3d] flex items-center justify-between mt-4 bg-[#141b26]/50">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Per Person</span>
                    <div className="text-lg font-extrabold text-[#34d399]">₹{exp.price.toLocaleString('en-IN')}</div>
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
                    className={`px-4 py-2 rounded-sm text-xs font-bold transition-all flex items-center gap-1.5 ${
                      inCart
                        ? 'bg-[#062c20] text-[#34d399] border border-[#059669]/40'
                        : 'gold-gradient-bg text-[#0e131f] hover:brightness-110 shadow-sm'
                    }`}
                  >
                    {inCart ? <Check className="w-3.5 h-3.5 text-[#34d399]" /> : <Plus className="w-3.5 h-3.5" />}
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
