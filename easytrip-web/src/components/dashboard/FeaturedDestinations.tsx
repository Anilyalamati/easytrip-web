import React, { useState } from 'react';
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
  Landmark 
} from 'lucide-react';
import { Destination } from '../../types/trip';

export const FeaturedDestinations: React.FC = () => {
  const { destinations, openPlannerWithDestination } = useTrip();
  const [selectedTab, setSelectedTab] = useState<'all' | 'places' | 'food' | 'hotels' | 'activities' | 'transport'>('all');

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

  return (
    <section id="explore" className="my-16 sm:my-20 scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200">
            <Compass className="w-3.5 h-3.5" />
            <span>SECTION 02 — EXPLORE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-midnight-900 tracking-tight">
            Curated places, authentic experiences.
          </h2>
          <p className="text-sm text-charcoal-600 max-w-xl leading-relaxed">
            Verified travel hubs featuring iconic local landmarks, signature regional culinary specialties, and comfortable stays.
          </p>
        </div>

        {/* Category Pill Filters */}
        <div className="flex flex-wrap gap-1.5 bg-slate-100/90 p-1 rounded-2xl border border-slate-200">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = selectedTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-white text-midnight-900 shadow-sm'
                    : 'text-charcoal-600 hover:text-midnight-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-brand-600" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((dest: Destination) => (
          <div
            key={dest.id}
            className="group surface-card rounded-3xl overflow-hidden border border-slate-200/90 hover:border-brand-300 transition-all duration-300 flex flex-col justify-between surface-card-hover"
          >
            {/* Top Image Container */}
            <div className="relative h-52 w-full overflow-hidden">
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-midnight-950/80 via-transparent to-transparent" />
              
              {/* Badge */}
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-extrabold text-midnight-900 shadow-sm uppercase tracking-wider">
                {dest.badge}
              </span>

              {/* Rating */}
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-xs font-extrabold text-midnight-900 shadow-sm">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span>{dest.rating}</span>
              </div>

              {/* Destination & Country at Bottom of Image */}
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="text-xl font-black tracking-tight flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-teal-400" />
                  {dest.name}
                </h3>
                <p className="text-xs text-slate-200 font-medium">{dest.country}</p>
              </div>
            </div>

            {/* Details Content */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-xs text-charcoal-600 line-clamp-2 leading-relaxed">
                {dest.tagline}
              </p>

              {/* Highlights tags */}
              <div className="flex flex-wrap gap-1.5">
                {dest.highlights.slice(0, 3).map((hl: string) => (
                  <span
                    key={hl}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-charcoal-700 border border-slate-200"
                  >
                    {hl}
                  </span>
                ))}
              </div>

              {/* Stats Row */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-charcoal-500">
                <div className="flex items-center gap-1 font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-brand-600" />
                  <span>{dest.idealDays}</span>
                </div>
                <div className="flex items-center gap-0.5 font-bold text-midnight-900">
                  <IndianRupee className="w-3.5 h-3.5 text-teal-600" />
                  <span>₹{dest.avgCostPerDay.moderate.toLocaleString('en-IN')}/day</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => openPlannerWithDestination(dest.name)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-brand-600 hover:text-white text-midnight-900 font-bold text-xs tracking-normal transition-all flex items-center justify-center gap-1.5 group/btn"
              >
                <span>Plan Trip to {dest.name}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
