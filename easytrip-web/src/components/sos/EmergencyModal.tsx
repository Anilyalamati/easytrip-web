import React from 'react';
import { useTrip } from '../../context/TripContext';
import { X, ShieldAlert, PhoneCall, Hospital, HeartHandshake, Compass, AlertTriangle, CheckSquare } from 'lucide-react';

export const EmergencyModal: React.FC = () => {
  const { isSosOpen, setIsSosOpen, currentTrip } = useTrip();

  if (!isSosOpen) return null;

  const emergencyContacts = [
    { title: 'Police / Law Enforcement', number: '112 / 911 / 100', desc: 'Immediate local police dispatch' },
    { title: 'Medical / Ambulance', number: '102 / 108 / 911', desc: 'Emergency paramedic & hospital dispatch' },
    { title: 'Tourist Safety Helpline', number: '1363 (24/7 Multilingual)', desc: 'Government verified tourist assistance' },
    { title: 'EasyTrip Priority Concierge', number: '+1 (800) 555-TRIP', desc: 'Instant relocation & travel assistance' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-elevated my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-safety-50 border border-safety-200 flex items-center justify-center p-2 text-safety-600">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-charcoal-900 tracking-tight flex items-center gap-2">
                <span>Travel Safety & Emergency Directory</span>
                <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-safety-50 text-safety-700 border border-safety-200">
                  Priority 24/7
                </span>
              </h2>
              <p className="text-xs text-charcoal-500">
                Official emergency dispatch, verified hotlines, and route protocols
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSosOpen(false)}
            className="p-2 rounded-xl text-charcoal-400 hover:text-charcoal-700 hover:bg-slate-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Emergency Contacts Grid */}
        <div className="mt-6 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
            Emergency Hotlines ({currentTrip?.destination || 'Global Explorer'})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {emergencyContacts.map((contact, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-2 hover:border-safety-300 transition-all"
              >
                <div>
                  <div className="text-xs font-bold text-charcoal-900">{contact.title}</div>
                  <div className="text-[11px] text-charcoal-500">{contact.desc}</div>
                </div>
                <a
                  href={`tel:${contact.number.split(' ')[0]}`}
                  className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-safety-600 hover:bg-safety-700 text-white text-xs font-bold transition-all shadow-sm"
                >
                  <span>{contact.number}</span>
                  <PhoneCall className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Protocol Checklist */}
        <div className="mt-6 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-700 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>Essential Travel Safety Checklist</span>
          </h3>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-charcoal-700">
            <div className="flex items-start gap-2">
              <CheckSquare className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
              <span>Offline Itinerary & Maps: Export or screenshot your day routes prior to remote transit.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckSquare className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
              <span>Embassy Hotline: Register your stay details with your home country consulate or embassy.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckSquare className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
              <span>Digital Health Pass: Keep copies of medical insurance policy and prescription medications.</span>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="mt-6">
          <button
            onClick={() => setIsSosOpen(false)}
            className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-charcoal-800 font-bold text-xs border border-slate-300/80 transition-all"
          >
            Close Emergency Directory
          </button>
        </div>

      </div>
    </div>
  );
};
