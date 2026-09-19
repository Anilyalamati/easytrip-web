import React from 'react';
import { useTrip } from '../../context/TripContext';
import { ShieldAlert, PhoneCall, Hospital, HeartHandshake, ArrowRight } from 'lucide-react';

export const SafetySosWidget: React.FC = () => {
  const { setIsSosOpen } = useTrip();

  return (
    <div className="my-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-950/40 via-navy-850 to-navy-900 border border-rose-500/30 glass-card">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 shrink-0">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded-md border border-rose-500/30 mb-1">
              EasyTrip SOS Safety Suite
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              SOS Tools & Real-Time Route Guidance
            </h3>
            <p className="text-xs text-slate-300 max-w-xl mt-1 leading-relaxed">
              Travel with peace of mind. Access one-tap global emergency helplines, nearby certified hospitals, embassy contacts, and offline emergency guidance wherever you roam.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsSosOpen(true)}
          className="px-5 py-3 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs tracking-wide shadow-lg shadow-rose-950/50 active:scale-95 transition-all flex items-center gap-2 shrink-0"
        >
          <PhoneCall className="w-4 h-4" />
          <span>Access Safety & SOS Guide</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
