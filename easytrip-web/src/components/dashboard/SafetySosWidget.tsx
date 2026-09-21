import React, { useState } from 'react';
import { useTrip } from '../../context/TripContext';
import { 
  ShieldAlert, 
  ShieldCheck, 
  PhoneCall, 
  Hospital, 
  HeartHandshake, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  Loader2, 
  XCircle, 
  RefreshCw 
} from 'lucide-react';

export const SafetySosWidget: React.FC = () => {
  const { setIsSosOpen, currentTrip } = useTrip();

  // 4-Stage SOS Confirmation: 'idle' | 'confirm' | 'locating' | 'sharing' | 'active'
  const [sosStage, setSosStage] = useState<'idle' | 'confirm' | 'locating' | 'sharing' | 'active'>('idle');

  const startSosFlow = () => {
    setSosStage('confirm');
  };

  const confirmSos = () => {
    setSosStage('locating');
    setTimeout(() => {
      setSosStage('sharing');
      setTimeout(() => {
        setSosStage('active');
      }, 1200);
    }, 1200);
  };

  const cancelSos = () => {
    setSosStage('idle');
  };

  const contacts = [
    { title: 'Police / Law Enforcement', number: '112 / 100', desc: 'Instant local emergency dispatch' },
    { title: 'Medical / Ambulance', number: '108 / 102', desc: 'Certified emergency paramedic unit' },
    { title: 'Tourist Safety Helpline', number: '1363', desc: '24/7 Government multilingual assistance' },
    { title: 'EasyTrip 24/7 Concierge', number: '+1 (800) 555-TRIP', desc: 'Priority traveler relocation desk' },
  ];

  return (
    <section id="safety-section" className="my-16 sm:my-20 scroll-mt-24">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-safety-50 text-safety-700 text-xs font-bold border border-safety-200">
          <ShieldAlert className="w-3.5 h-3.5 text-safety-600" />
          <span>SECTION 05 — SAFETY & SOS</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-midnight-900 tracking-tight">
          Travel with confidence.
        </h2>
        <p className="text-sm text-charcoal-600 leading-relaxed">
          Calm, reliable traveler protection. Access emergency dispatch, verified hospitals, and our controlled 4-stage SOS safety system whenever you need support.
        </p>
      </div>

      {/* Main Container */}
      <div className="surface-elevated rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-elevated max-w-5xl mx-auto space-y-8">
        
        {/* Interactive 4-Stage SOS Console */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500 block mb-0.5">
                EasyTrip Emergency Safety Suite
              </span>
              <h3 className="text-lg font-black text-midnight-900">
                4-Stage Controlled SOS Confirmation Protocol
              </h3>
            </div>
            <span className="text-[11px] font-bold text-charcoal-600 bg-white px-2.5 py-1 rounded-full border border-slate-200 shadow-sm self-start sm:self-auto">
              Accidental Trigger Protected
            </span>
          </div>

          {/* Stage 0: Idle state */}
          {sosStage === 'idle' && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
              <div className="space-y-1">
                <div className="text-sm font-bold text-midnight-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Standard Safety Monitoring Active</span>
                </div>
                <p className="text-xs text-charcoal-500 max-w-lg">
                  If you encounter an emergency, tap below to initiate our verified 4-step dispatch procedure. Your GPS coordinates and local emergency lines will be locked.
                </p>
              </div>

              <button
                onClick={startSosFlow}
                className="px-5 py-3 rounded-2xl bg-safety-600 hover:bg-safety-700 text-white font-bold text-xs tracking-normal shadow-sm hover:shadow-md active:scale-95 transition-all flex items-center gap-2 shrink-0 self-start sm:self-auto"
              >
                <ShieldAlert className="w-4 h-4 text-white" />
                <span>Initiate Travel SOS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Stage 1: Confirmation */}
          {sosStage === 'confirm' && (
            <div className="p-4 rounded-xl bg-white border border-safety-200 space-y-3 animate-fade-in">
              <div className="flex items-center gap-2 text-sm font-bold text-safety-700">
                <AlertTriangle className="w-4 h-4 text-safety-600" />
                <span>Stage 1 of 4: Are you sure you want to trigger SOS?</span>
              </div>
              <p className="text-xs text-charcoal-600">
                This will prepare your current GPS coordinates, identify the nearest police and ambulance stations in {currentTrip?.destination || 'your location'}, and unlock priority tourist dispatch lines.
              </p>
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={confirmSos}
                  className="px-4 py-2 rounded-xl bg-safety-600 hover:bg-safety-700 text-white text-xs font-bold transition-all shadow-sm"
                >
                  Yes, Proceed to SOS (Stage 2)
                </button>
                <button
                  onClick={cancelSos}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-charcoal-700 text-xs font-semibold transition-all"
                >
                  Cancel / Return to Safety Dashboard
                </button>
              </div>
            </div>
          )}

          {/* Stage 2: Locating */}
          {sosStage === 'locating' && (
            <div className="p-4 rounded-xl bg-white border border-brand-200 flex items-center gap-3 animate-fade-in">
              <Loader2 className="w-5 h-5 text-brand-600 animate-spin shrink-0" />
              <div>
                <div className="text-xs font-bold text-midnight-900">Stage 2 of 4: Preparing high-accuracy GPS coordinates...</div>
                <div className="text-[11px] text-charcoal-500">Locking local jurisdiction and nearest verified medical facility...</div>
              </div>
            </div>
          )}

          {/* Stage 3: Sharing */}
          {sosStage === 'sharing' && (
            <div className="p-4 rounded-xl bg-white border border-teal-200 flex items-center gap-3 animate-fade-in">
              <Loader2 className="w-5 h-5 text-teal-600 animate-spin shrink-0" />
              <div>
                <div className="text-xs font-bold text-teal-900">Stage 3 of 4: Sharing location with regional emergency hub...</div>
                <div className="text-[11px] text-charcoal-500">Establishing direct connection to Tourist Police & 24/7 Concierge...</div>
              </div>
            </div>
          )}

          {/* Stage 4: Alert Active */}
          {sosStage === 'active' && (
            <div className="p-4 rounded-xl bg-white border border-emerald-300 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-black text-emerald-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Stage 4 of 4: Emergency Assistance Active</span>
                </div>
                <button
                  onClick={cancelSos}
                  className="text-xs font-bold text-charcoal-500 hover:text-midnight-900 flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset SOS</span>
                </button>
              </div>
              <p className="text-xs text-charcoal-600">
                Direct emergency dispatch is active. Tap any verified contact below for instant 1-touch telephone connection:
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {contacts.map((c, i) => (
                  <a
                    key={i}
                    href={`tel:${c.number.split(' ')[0]}`}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-safety-50 border border-slate-200 hover:border-safety-300 text-left transition-all group"
                  >
                    <div className="text-[10px] font-bold text-charcoal-500 truncate">{c.title}</div>
                    <div className="text-xs font-extrabold text-safety-600 group-hover:text-safety-700 flex items-center gap-1 mt-0.5">
                      <PhoneCall className="w-3 h-3" />
                      <span>{c.number}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Emergency Helplines Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-midnight-900 uppercase tracking-wider">
              Verified Emergency Directory ({currentTrip?.destination || 'Global Explorer'})
            </h4>
            <button
              onClick={() => setIsSosOpen(true)}
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <span>View Full Safety Protocols</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contacts.map((c, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="text-xs font-bold text-midnight-900">{c.title}</div>
                  <div className="text-[11px] text-charcoal-500 mt-0.5">{c.desc}</div>
                </div>

                <a
                  href={`tel:${c.number.split(' ')[0]}`}
                  className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 hover:bg-brand-50 border border-slate-200 hover:border-brand-300 text-midnight-900 hover:text-brand-600 text-xs font-bold transition-all"
                >
                  <span>{c.number}</span>
                  <PhoneCall className="w-3.5 h-3.5 text-brand-600" />
                </a>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
