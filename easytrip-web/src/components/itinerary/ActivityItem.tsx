import React from 'react';
import { ActivitySlot } from '../../types/trip';
import { Clock, MapPin, DollarSign, Lightbulb, Compass, Sun, Moon, Sunset } from 'lucide-react';

export const ActivityItem: React.FC<{ slot: ActivitySlot; period: string }> = ({ slot, period }) => {
  const PeriodIcon = period === 'Morning' ? Sun : period === 'Afternoon' ? Sunset : Moon;

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-navy-850/90 border border-navy-700/80 hover:border-gold-500/40 transition-all duration-300 group">
      {/* Image Thumbnail */}
      <div className="sm:w-44 h-32 rounded-xl overflow-hidden relative shrink-0 border border-navy-700">
        <img
          src={slot.image}
          alt={slot.title}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
        
        {/* Period Badge */}
        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-navy-900/90 backdrop-blur-md border border-gold-500/30 text-[10px] font-bold text-gold-300 flex items-center gap-1">
          <PeriodIcon className="w-3 h-3 text-gold-400" />
          {slot.period}
        </span>

        {/* Category Badge */}
        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-navy-900/80 text-[10px] font-semibold text-slate-300">
          {slot.category}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between space-y-2">
        <div>
          {/* Time & Cost Header */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1 font-semibold text-gold-400">
              <Clock className="w-3.5 h-3.5" />
              {slot.time}
            </span>
            <span className="font-bold text-slate-200 flex items-center gap-0.5 bg-navy-800 px-2 py-0.5 rounded-md border border-navy-700">
              <DollarSign className="w-3 h-3 text-gold-400" />
              Est. ${slot.cost}
            </span>
          </div>

          {/* Title */}
          <h4 className="text-base font-bold text-white group-hover:text-gold-300 transition-colors">
            {slot.title}
          </h4>

          {/* Location */}
          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-gold-500 shrink-0" />
            {slot.location}
          </p>

          {/* Description */}
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            {slot.description}
          </p>
        </div>

        {/* Local Tip Box */}
        {slot.tips && (
          <div className="flex items-start gap-2 p-2 rounded-xl bg-navy-900/90 border border-navy-750 text-[11px] text-slate-300">
            <Lightbulb className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
            <span><strong className="text-gold-400">Insider Tip:</strong> {slot.tips}</span>
          </div>
        )}
      </div>
    </div>
  );
};
