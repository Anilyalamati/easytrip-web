import React, { useState } from 'react';
import { useTrip } from '../../context/TripContext';
import { Star, MapPin, Calendar, DollarSign, Sparkles, ArrowRight } from 'lucide-react';
import { Destination } from '../../types/trip';

export const FeaturedDestinations: React.FC = () => {
  const { destinations, openPlannerWithDestination } = useTrip();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Beach & Coastal', 'Heritage & Culture', 'Mountain Retreat', 'Urban Luxury'];

  const filtered = selectedCategory === 'All'
    ? destinations
    : destinations.filter(d => d.category === selectedCategory);

  return (
    <section className="my-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-gold-400 text-xs uppercase font-bold tracking-widest mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Catalog</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Popular <span className="gold-gradient-text">Destinations</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-lg">
            Real places from your EasyTrip destination catalog, complete with verified highlights and travel windows.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                selectedCategory === cat
                  ? 'bg-gold-500 text-navy-950 border-gold-400 font-bold shadow-gold-glow'
                  : 'bg-navy-850 text-slate-300 border-navy-700 hover:border-gold-500/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((dest: Destination) => (
          <div
            key={dest.id}
            className="group glass-card rounded-3xl overflow-hidden border border-navy-750 hover:border-gold-500/50 transition-all duration-300 flex flex-col glass-card-hover"
          >
            {/* Image Container */}
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent" />
              
              {/* Badge */}
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-navy-900/85 backdrop-blur-md border border-gold-500/40 text-[10px] font-bold text-gold-300 uppercase tracking-wider">
                {dest.badge}
              </span>

              {/* Rating */}
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-navy-900/85 backdrop-blur-md border border-navy-700 text-xs font-bold text-white">
                <Star className="w-3 h-3 text-gold-400 fill-gold-400" />
                <span>{dest.rating}</span>
              </div>

              {/* Destination & Country */}
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-gold-400" />
                  {dest.name}
                </h3>
                <p className="text-xs text-slate-300 font-medium">{dest.country}</p>
              </div>
            </div>

            {/* Details */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {dest.tagline}
              </p>

              {/* Highlights tags */}
              <div className="flex flex-wrap gap-1.5">
                {dest.highlights.slice(0, 3).map((hl: string) => (
                  <span
                    key={hl}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-navy-800 text-slate-300 border border-navy-700"
                  >
                    {hl}
                  </span>
                ))}
              </div>

              {/* Stats row */}
              <div className="pt-3 border-t border-navy-700/60 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gold-400" />
                  <span>{dest.idealDays}</span>
                </div>
                <div className="flex items-center gap-1 font-semibold text-slate-200">
                  <DollarSign className="w-3.5 h-3.5 text-gold-400" />
                  <span>${dest.avgCostPerDay.moderate}/day</span>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => openPlannerWithDestination(dest.name)}
                className="w-full py-2.5 rounded-xl bg-navy-800 hover:bg-gold-500 hover:text-navy-950 text-slate-200 border border-navy-700 hover:border-gold-400 font-bold text-xs tracking-wide transition-all flex items-center justify-center gap-2 group/btn"
              >
                <Sparkles className="w-3.5 h-3.5 text-gold-400 group-hover/btn:text-navy-950" />
                <span>Plan Trip Here</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
