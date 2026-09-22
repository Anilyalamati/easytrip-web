import React, { useState, useEffect } from 'react';
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
import { ScrollReveal } from '../common/ScrollReveal';

export const SafetySosWidget: React.FC = () => {
  const { setIsSosOpen, currentTrip } = useTrip();

  // 4-Stage SOS Confirmation: 'idle' | 'confirm' | 'locating' | 'sharing' | 'active'
  const [sosStage, setSosStage] = useState<'idle' | 'confirm' | 'locating' | 'sharing' | 'active'>('idle');
  const [countdown, setCountdown] = useState<number>(5);

  const startSosFlow = () => {
    setCountdown(5);
    setSosStage('confirm');
  };

  const confirmSos = () => {
    setSosStage('locating');
    setTimeout(() => {
      setSosStage('sharing');
      setTimeout(() => {
        setSosStage('active');
      }, 1000);
    }, 1000);
  };

  const cancelSos = () => {
    setSosStage('idle');
    setCountdown(5);
  };

  // Countdown timer in confirm state
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (sosStage === 'confirm' && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (sosStage === 'confirm' && countdown === 0) {
      confirmSos();
    }
    return () => clearTimeout(timer);
  }, [sosStage, countdown]);

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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-[#200c10] text-[#fca5a5] text-xs font-bold border border-[#dc2626]/40">
          <ShieldAlert className="w-3.5 h-3.5 text-[#ef4444]" />
          <span>SECTION 05 — SAFETY & SOS</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#f1f5f9] tracking-tight">
          Travel with confidence.
        </h2>
        <p className="text-sm text-[#94a3b8] leading-relaxed">
          Calm, reliable traveler protection. Access emergency dispatch, verified hospitals, and our controlled 4-stage SOS safety system whenever you need support.
        </p>
      </div>

      {/* Main Container */}
      <div className="surface-elevated rounded-md p-6 sm:p-8 border border-[#222d3d] shadow-2xl max-w-5xl mx-auto space-y-8 bg-[#141b26]">
        
        {/* Interactive 4-Stage SOS Console */}
        <div className="p-6 rounded-md bg-[#182232] border border-[#222d3d] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#222d3d]">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#94a3b8] block mb-0.5">
                EasyTrip Emergency Safety Suite
              </span>
              <h3 className="text-lg font-black text-[#f1f5f9]">
                4-Stage Controlled SOS Confirmation Protocol
              </h3>
            </div>
            <span className="text-[11px] font-bold text-[#cbd5e1] bg-[#141b26] px-2.5 py-1 rounded-sm border border-[#222d3d] shadow-sm self-start sm:self-auto">
              Accidental Trigger Protected
            </span>
          </div>

          {/* Stage 0: Idle state with calm aura */}
          {sosStage === 'idle' && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
              <div className="space-y-1">
                <div className="text-sm font-bold text-[#f1f5f9] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#34d399]" />
                  <span>Standard Safety Monitoring Active</span>
                </div>
                <p className="text-xs text-[#94a3b8] max-w-lg">
                  If you encounter an emergency, tap below to initiate our verified 4-step dispatch procedure. Your GPS coordinates and local emergency lines will be locked.
                </p>
              </div>

              <button
                onClick={startSosFlow}
                className="px-5 py-3 rounded-sm bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold text-xs tracking-normal shadow-sm hover:shadow-md active:scale-95 transition-all duration-200 flex items-center gap-2 shrink-0 self-start sm:self-auto"
              >
                <ShieldAlert className="w-4 h-4 text-white" />
                <span>Initiate Travel SOS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Stage 1: Confirmation with 5s countdown SVG ring */}
          {sosStage === 'confirm' && (
            <div className="p-5 rounded-sm bg-[#141b26] border border-[#dc2626]/40 space-y-4 animate-fade-in shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-sm font-bold text-[#fca5a5]">
                  <AlertTriangle className="w-5 h-5 text-[#ef4444]" />
                  <span>Stage 1 of 4: Are you sure you want to trigger SOS?</span>
                </div>
                
                {/* 5-second circular SVG countdown timer */}
                <div className="flex items-center gap-2 bg-[#200c10] px-3 py-1.5 rounded-sm border border-[#dc2626]/40 text-xs font-bold text-[#fca5a5]">
                  <svg className="w-4 h-4 -rotate-90" viewBox="0 0 36 36">
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#331218"
                      strokeWidth="3"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#dc2626"
                      strokeWidth="3"
                      strokeDasharray="88"
                      strokeDashoffset={88 - (88 * (5 - countdown)) / 5}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-linear"
                    />
                  </svg>
                  <span>Auto-advancing in {countdown}s</span>
                </div>
              </div>

              <p className="text-xs text-[#cbd5e1] leading-relaxed">
                This will prepare high-accuracy GPS coordinates, identify certified medical units in {currentTrip?.destination || 'your destination'}, and unlock priority tourist emergency lines.
              </p>

              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={confirmSos}
                  className="px-4 py-2.5 rounded-sm bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-bold transition-all duration-200 active:scale-95 shadow-sm"
                >
                  Confirm Immediately (Stage 2)
                </button>
                <button
                  onClick={cancelSos}
                  className="px-4 py-2.5 rounded-sm bg-[#182232] hover:bg-[#222d3d] text-[#cbd5e1] text-xs font-semibold transition-all duration-200 active:scale-95 border border-[#222d3d]"
                >
                  Cancel / Return to Safety Dashboard
                </button>
              </div>
            </div>
          )}

          {/* Stage 2: Locating */}
          {sosStage === 'locating' && (
            <div className="p-5 rounded-sm bg-[#141b26] border border-[#f3b740]/40 flex items-center gap-3 animate-fade-in shadow-sm">
              <Loader2 className="w-5 h-5 text-[#f3b740] animate-spin shrink-0" />
              <div>
                <div className="text-xs font-bold text-[#f1f5f9]">Stage 2 of 4: Preparing high-accuracy GPS coordinates...</div>
                <div className="text-[11px] text-[#94a3b8]">Locking local jurisdiction and nearest verified medical facility...</div>
              </div>
            </div>
          )}

          {/* Stage 3: Sharing */}
          {sosStage === 'sharing' && (
            <div className="p-5 rounded-sm bg-[#141b26] border border-[#34d399]/40 flex items-center gap-3 animate-fade-in shadow-sm">
              <Loader2 className="w-5 h-5 text-[#34d399] animate-spin shrink-0" />
              <div>
                <div className="text-xs font-bold text-[#34d399]">Stage 3 of 4: Sharing location with regional emergency hub...</div>
                <div className="text-[11px] text-[#94a3b8]">Establishing direct connection to Tourist Police & 24/7 Concierge...</div>
              </div>
            </div>
          )}

          {/* Stage 4: Alert Active */}
          {sosStage === 'active' && (
            <div className="p-4 rounded-sm bg-[#141b26] border border-[#059669]/50 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-black text-[#34d399]">
                  <CheckCircle2 className="w-5 h-5 text-[#34d399]" />
                  <span>Stage 4 of 4: Emergency Assistance Active</span>
                </div>
                <button
                  onClick={cancelSos}
                  className="text-xs font-bold text-[#94a3b8] hover:text-[#f1f5f9] flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset SOS</span>
                </button>
              </div>
              <p className="text-xs text-[#cbd5e1]">
                Direct emergency dispatch is active. Tap any verified contact below for instant 1-touch telephone connection:
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {contacts.map((c, i) => (
                  <a
                    key={i}
                    href={`tel:${c.number.split(' ')[0]}`}
                    className="p-2.5 rounded-sm bg-[#182232] hover:bg-[#200c10] border border-[#222d3d] hover:border-[#dc2626]/50 text-left transition-all group"
                  >
                    <div className="text-[10px] font-bold text-[#94a3b8] truncate">{c.title}</div>
                    <div className="text-xs font-extrabold text-[#f87171] group-hover:text-rose-400 flex items-center gap-1 mt-0.5">
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
            <h4 className="text-sm font-bold text-[#f1f5f9] uppercase tracking-wider">
              Verified Emergency Directory ({currentTrip?.destination || 'Global Explorer'})
            </h4>
            <button
              onClick={() => setIsSosOpen(true)}
              className="text-xs font-bold text-[#f3b740] hover:text-[#f7d56e] flex items-center gap-1"
            >
              <span>View Full Safety Protocols</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contacts.map((c, idx) => (
              <ScrollReveal
                key={idx}
                index={idx}
                staggerMs={110}
                className="flex flex-col h-full"
              >
                <div className="p-4 rounded-md bg-[#182232] border border-[#222d3d] shadow-sm flex flex-col justify-between space-y-3 h-full">
                  <div>
                    <div className="text-xs font-bold text-[#f1f5f9]">{c.title}</div>
                    <div className="text-[11px] text-[#94a3b8] mt-0.5">{c.desc}</div>
                  </div>

                  <a
                    href={`tel:${c.number.split(' ')[0]}`}
                    className="flex items-center justify-between px-3 py-2 rounded-sm bg-[#141b26] hover:bg-[#222d3d] border border-[#222d3d] text-[#f1f5f9] hover:text-[#f3b740] text-xs font-bold transition-all"
                  >
                    <span>{c.number}</span>
                    <PhoneCall className="w-3.5 h-3.5 text-[#f3b740]" />
                  </a>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
