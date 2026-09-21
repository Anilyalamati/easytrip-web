import React from 'react';
import { DayPlan } from '../../types/trip';
import { ActivityItem } from './ActivityItem';
import { Sun, Sparkles, UtensilsCrossed, Star, MapPin } from 'lucide-react';

export const DayCard: React.FC<{ day: DayPlan }> = ({ day }) => {
  return (
    <div className="glass-card rounded-md p-6 sm:p-8 border border-[#222d3d] mb-8 space-y-6 bg-[#141b26]">
      {/* Day Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#222d3d] gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-sm bg-[#f3b740]/20 border border-[#f3b740]/40 text-[#f3b740] font-extrabold text-lg flex items-center justify-center shadow-[0_0_12px_rgba(243,183,64,0.3)]">
            D{day.dayNumber}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-[#f1f5f9] tracking-tight">
                {day.title}
              </h3>
              <span className="text-xs px-2.5 py-0.5 rounded-sm bg-[#182232] text-[#f7d56e] border border-[#222d3d] font-semibold">
                {day.date}
              </span>
            </div>
            <p className="text-xs text-[#94a3b8] font-medium flex items-center gap-1 mt-0.5">
              <Sparkles className="w-3 h-3 text-[#f3b740]" />
              Theme: {day.theme}
            </p>
          </div>
        </div>

        {/* Weather Forecast Badge */}
        {day.weather && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[#182232] border border-[#222d3d] text-xs text-[#cbd5e1] self-start sm:self-auto">
            <Sun className="w-4 h-4 text-[#f3b740]" />
            <span>{day.weather.temp}°C, {day.weather.condition}</span>
          </div>
        )}
      </div>

      {/* Activity Slots with Vertical Connected Amber Timeline */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-[2px] before:bg-gradient-to-b before:from-[#f3b740] before:via-[#e5a83b]/60 before:to-[#f3b740]/20">
        {day.slots.map(slot => (
          <ActivityItem key={slot.id} slot={slot} period={slot.period} />
        ))}
      </div>

      {/* Curated Local Dining Section */}
      {day.diningRecommendations && day.diningRecommendations.length > 0 && (
        <div className="mt-6 pt-5 border-t border-[#222d3d]">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-sm bg-[#f3b740]/20 border border-[#f3b740]/30 flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4 text-[#f3b740]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#f1f5f9] tracking-wide">
                Curated Culinary Picks & Signature Spots (Day {day.dayNumber})
              </h4>
              <p className="text-[11px] text-[#94a3b8]">Authentic regional flavors and top-rated local dining</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {day.diningRecommendations.map((dining, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-sm bg-[#182232] border border-[#222d3d] hover:border-[#f3b740]/40 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="font-bold text-[#f1f5f9] text-sm hover:text-[#f3b740] transition-colors">
                      {dining.name}
                    </h5>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-[#f3b740] shrink-0 bg-[#141b26] px-1.5 py-0.5 rounded-sm border border-[#222d3d]">
                      <Star className="w-3 h-3 fill-[#f3b740]" />
                      {dining.rating}
                    </span>
                  </div>

                  <span className="inline-block text-[11px] font-medium text-[#f7d56e] mt-0.5">
                    {dining.cuisine} • <span className="text-[#94a3b8]">{dining.timing}</span>
                  </span>

                  <p className="text-xs text-[#cbd5e1] mt-2">
                    <strong className="text-[#f1f5f9]">Must Try:</strong> {dining.specialty}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#222d3d] text-[11px] text-[#94a3b8]">
                  <span className="flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-[#f3b740] shrink-0" />
                    {dining.location}
                  </span>
                  <span className="font-semibold text-[#f3b740] shrink-0">
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
