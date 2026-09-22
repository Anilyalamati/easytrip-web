import React from 'react';
import { useTrip } from '../../context/TripContext';
import { 
  Compass, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  ShieldAlert, 
  Sparkles,
  Users,
  Clock 
} from 'lucide-react';

export const ActiveJourneyBanner: React.FC = () => {
  const { currentTrip, setActiveView, setIsSosOpen } = useTrip();

  if (!currentTrip) return null;

  const firstDay = currentTrip.itineraryDays[0];
  const firstSlot = firstDay?.slots[0];
  const safetyScore = currentTrip.safetyAssessment?.score || 98;

  return (
    <section className="mt-6 mb-8 animate-fade-in">
      <div className="surface-elevated rounded-md p-5 sm:p-6 border border-[#f3b740]/40 bg-[#141b26] shadow-xl specular-sheen relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#f3b740]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          
          {/* Left Info */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-sm bg-[#f3b740] text-[#0e131f] text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3" /> Active Journey In Progress
              </span>
              <span className="px-2.5 py-0.5 rounded-sm bg-[#062c20] text-[#34d399] border border-[#059669]/40 text-[10px] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#34d399]" />
                Safety: {safetyScore}% Verified
              </span>
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                <Users className="w-3 h-3 text-[#f3b740]" />
                {currentTrip.travelStyle} ({currentTrip.travelersCount || 2} Travelers)
              </span>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>{currentTrip.destination}</span>
                <span className="text-[#f3b740] font-normal">•</span>
                <span className="text-sm font-semibold text-slate-300">
                  {currentTrip.days}-Day Itinerary ({currentTrip.startDate})
                </span>
              </h3>
            </div>

            {firstSlot && (
              <p className="text-xs text-slate-300 flex items-center gap-1.5 pt-0.5">
                <Clock className="w-3.5 h-3.5 text-[#f3b740] shrink-0" />
                <span>Today's Highlight: <strong>{firstSlot.title}</strong> ({firstSlot.time})</span>
              </p>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsSosOpen(true)}
              className="px-3.5 py-2.5 rounded-sm bg-[#200c10] hover:bg-[#2c1016] text-[#fca5a5] border border-rose-500/40 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              title="Open Emergency SOS Console"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
              <span>Emergency SOS</span>
            </button>

            <button
              onClick={() => setActiveView('itinerary')}
              className="px-5 py-2.5 rounded-sm gold-gradient-bg text-[#0e131f] font-extrabold text-xs tracking-wide shadow-gold-glow hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span>View Full Itinerary</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
