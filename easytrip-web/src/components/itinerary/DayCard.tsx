import React from 'react';
import { DayPlan } from '../../types/trip';
import { ActivityItem } from './ActivityItem';
import { Sun, CloudSun, Calendar, Sparkles } from 'lucide-react';

export const DayCard: React.FC<{ day: DayPlan }> = ({ day }) => {
  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-navy-750 mb-8 space-y-6">
      {/* Day Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-navy-750 gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gold-500/20 border border-gold-500/40 text-gold-400 font-extrabold text-lg flex items-center justify-center shadow-gold-glow">
            D{day.dayNumber}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white tracking-tight">
                {day.title}
              </h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-navy-800 text-gold-300 border border-navy-700 font-semibold">
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
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-navy-800 border border-navy-700 text-xs text-slate-300 self-start sm:self-auto">
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
    </div>
  );
};
