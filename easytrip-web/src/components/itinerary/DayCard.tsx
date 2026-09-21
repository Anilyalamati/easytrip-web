import React from 'react';
import { DayPlan } from '../../types/trip';
import { ActivityItem } from './ActivityItem';
import { Sun, Sparkles, UtensilsCrossed, Star, MapPin } from 'lucide-react';

export const DayCard: React.FC<{ day: DayPlan }> = ({ day }) => {
  return (
    <div className="glass-card rounded-md p-6 sm:p-8 border border-navy-750 mb-8 space-y-6">
      {/* Day Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-navy-750 gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-sm bg-gold-500/20 border border-gold-500/40 text-gold-400 font-extrabold text-lg flex items-center justify-center shadow-gold-glow">
            D{day.dayNumber}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white tracking-tight">
                {day.title}
              </h3>
              <span className="text-xs px-2.5 py-0.5 rounded-sm bg-navy-800 text-gold-300 border border-navy-700 font-semibold">
                {day.date}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium flex items-center gap-1 mt-0.5">
              <Sparkles className="w-3 h-3 text-gold-400" />
              Theme: {day.theme}
            </p>
          </div>
        </div>

        {/* Weather Forecast Badge */}
        {day.weather && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-navy-800 border border-navy-700 text-xs text-slate-300 self-start sm:self-auto">
            <Sun className="w-4 h-4 text-amber-400" />
            <span>{day.weather.temp}°C, {day.weather.condition}</span>
          </div>
        )}
      </div>

      {/* Activity Slots */}
      <div className="space-y-4">
        {day.slots.map(slot => (
          <ActivityItem key={slot.id} slot={slot} period={slot.period} />
        ))}
      </div>

      {/* Curated Local Dining Section */}
      {day.diningRecommendations && day.diningRecommendations.length > 0 && (
        <div className="mt-6 pt-5 border-t border-navy-750/80">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-sm bg-gold-500/10 border border-gold-500/30 flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4 text-gold-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">
                Curated Culinary Picks & Signature Spots (Day {day.dayNumber})
              </h4>
              <p className="text-[11px] text-slate-400">Authentic regional flavors and top-rated local dining</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {day.diningRecommendations.map((dining, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-sm bg-navy-900/90 border border-navy-750 hover:border-gold-500/40 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="font-bold text-white text-sm hover:text-gold-300 transition-colors">
                      {dining.name}
                    </h5>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 shrink-0 bg-navy-800 px-1.5 py-0.5 rounded-sm border border-navy-700">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {dining.rating}
                    </span>
                  </div>

                  <span className="inline-block text-[11px] font-medium text-gold-400/90 mt-0.5">
                    {dining.cuisine} • <span className="text-slate-400">{dining.timing}</span>
                  </span>

                  <p className="text-xs text-slate-300 mt-2">
                    <strong className="text-slate-200">Must Try:</strong> {dining.specialty}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-navy-800 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-gold-500 shrink-0" />
                    {dining.location}
                  </span>
                  <span className="font-semibold text-gold-300 shrink-0">
                    {dining.priceRange}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
