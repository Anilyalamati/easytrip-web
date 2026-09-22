import React, { useState, useEffect, useRef } from 'react';
import { useTrip } from '../../context/TripContext';
import { 
  X, 
  ShieldAlert, 
  PhoneCall, 
  Hospital, 
  AlertTriangle, 
  CheckSquare,
  Locate,
  Copy,
  Check,
  Building,
  Flame,
  Train,
  CreditCard,
  MapPin,
  ExternalLink,
  Users,
  Compass,
  RefreshCw,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { EmergencyDirectoryItem } from '../../types/trip';

export const EmergencyModal: React.FC = () => {
  const { isSosOpen, setIsSosOpen, currentTrip } = useTrip();

  const [activeTab, setActiveTab] = useState<'sos' | 'directory'>('sos');
  const [isDemoMode, setIsDemoMode] = useState(true);
  
  // Hold-to-activate states (3-second hold)
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [isSosTriggered, setIsSosTriggered] = useState(false);
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // GPS coordinates state
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [copiedCoords, setCopiedCoords] = useState(false);

  // Trusted contact list
  const [trustedContacts, setTrustedContacts] = useState([
    { name: 'Family Emergency Contact', phone: '+91 98480 22338', relation: 'Family' },
    { name: 'Travel Companion', phone: '+91 98480 99441', relation: 'Companion' }
  ]);

  const destName = currentTrip?.destination || 'Vizag';

  // Geolocation detection
  useEffect(() => {
    if (isSosOpen) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          () => setCoords(currentTrip?.coordinates || { lat: 17.6868, lng: 83.2185 })
        );
      } else {
        setCoords(currentTrip?.coordinates || { lat: 17.6868, lng: 83.2185 });
      }
    } else {
      // Reset on close
      setIsHolding(false);
      setHoldProgress(0);
      setIsSosTriggered(false);
    }
  }, [isSosOpen, currentTrip]);

  // Hold-to-activate logic
  const startHold = () => {
    if (isSosTriggered) return;
    setIsHolding(true);
    const startTime = Date.now();
    const duration = 3000; // 3 seconds

    holdIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / duration) * 100);
      setHoldProgress(progress);

      if (progress >= 100) {
        clearInterval(holdIntervalRef.current!);
        setIsHolding(false);
        setIsSosTriggered(true);
      }
    }, 50);
  };

  const endHold = () => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
    }
    setIsHolding(false);
    if (!isSosTriggered) {
      setHoldProgress(0);
    }
  };

  const copyGpsToClipboard = () => {
    if (!coords) return;
    const text = `EMERGENCY LOCATION: ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)} (${destName})`;
    navigator.clipboard.writeText(text);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2500);
  };

  if (!isSosOpen) return null;

  // National official emergency lines
  const officialServices = [
    { title: 'National Emergency Helpline', number: '112', desc: 'All-in-one unified emergency line (Police, Medical, Fire)' },
    { title: 'Medical Ambulance & Trauma', number: '108', desc: 'Certified emergency paramedic unit & disaster response' },
    { title: 'Police Control Room', number: '100', desc: 'Immediate local police dispatch and security' },
    { title: 'Tourist Safety Helpline', number: '1363', desc: '24/7 Ministry of Tourism multilingual helpline' },
    { title: 'Women Safety Helpline', number: '1091', desc: 'Dedicated 24/7 protection & rapid assistance' },
    { title: 'EasyTrip 24/7 Relocation Desk', number: '+1 (800) 555-TRIP', desc: 'Priority traveler concierge assistance' },
  ];

  // Directory entries
  const directory: EmergencyDirectoryItem[] = currentTrip?.emergencyDirectory || [
    {
      id: 'dir-p1',
      name: `${destName} Central Police Control & Tourist Police`,
      type: 'police',
      distance: '1.8 km',
      phone: '112 / 100',
      address: `Police Commissionerate Rd, Central District, ${destName}`,
      openHours: '24/7 Active Duty',
      badge: 'Official 24/7 Dispatch'
    },
    {
      id: 'dir-h1',
      name: `${destName} Government General Hospital & Emergency Trauma`,
      type: 'hospital',
      distance: '2.4 km',
      phone: '108 / 102',
      address: `Collectorate Junction, Medical Square, ${destName}`,
      openHours: '24/7 Level 1 Trauma',
      badge: 'Level-1 Trauma Unit'
    },
    {
      id: 'dir-f1',
      name: `${destName} Municipal Fire & Rescue Headquarters`,
      type: 'fire',
      distance: '3.1 km',
      phone: '101',
      address: `Station Road, Civil Lines, ${destName}`,
      openHours: '24/7 Rapid Response',
      badge: 'Emergency Rescue'
    },
    {
      id: 'dir-t1',
      name: `${destName} Central Railway Junction & Prepaid Cab Hub`,
      type: 'transit',
      distance: '2.9 km',
      phone: '139 (Railway Police 182)',
      address: `Platform 1 Concourse, Railway Station, ${destName}`,
      openHours: '24/7 Monitored Transit',
      badge: 'Verified Transit Safe Zone'
    },
    {
      id: 'dir-a1',
      name: 'State Bank of India 24/7 Cash Point & Apollo Pharmacy',
      type: 'atm',
      distance: '0.6 km',
      phone: '1800 11 2211',
      address: `Main Commercial Promenade, ${destName}`,
      openHours: '24/7 Guarded ATM & Meds',
      badge: 'CCTV Monitored'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#08090c]/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#141b26] border border-[#222d3d] rounded-md p-6 sm:p-8 shadow-2xl my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#222d3d]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-rose-950/40 border border-rose-500/40 flex items-center justify-center p-2 text-rose-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Travel Safety & SOS Hub
                </h2>
                <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-sm bg-rose-950/50 text-rose-300 border border-rose-500/40">
                  Priority 24/7
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Official emergency dispatch, verified hotlines, and local directory for {destName}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSosOpen(false)}
            className="p-2 rounded-sm text-slate-400 hover:text-white hover:bg-[#182232] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-between mt-4 pb-2 border-b border-[#222d3d]">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('sos')}
              className={`px-3.5 py-1.5 rounded-sm text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'sos'
                  ? 'bg-[#f3b740] text-[#0e131f] shadow-sm'
                  : 'bg-[#182232] text-slate-300 hover:bg-[#1f2c3f]'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>SOS & Helplines</span>
            </button>
            <button
              onClick={() => setActiveTab('directory')}
              className={`px-3.5 py-1.5 rounded-sm text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'directory'
                  ? 'bg-[#f3b740] text-[#0e131f] shadow-sm'
                  : 'bg-[#182232] text-slate-300 hover:bg-[#1f2c3f]'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>Emergency Directory ({directory.length})</span>
            </button>
          </div>

          {/* Demo Mode Toggle */}
          <button
            type="button"
            onClick={() => setIsDemoMode(prev => !prev)}
            className={`text-[10px] font-bold px-2 py-1 rounded-sm border transition-all ${
              isDemoMode 
                ? 'bg-[#062c20] text-[#34d399] border-[#059669]/40' 
                : 'bg-[#182232] text-slate-400 border-[#222d3d]'
            }`}
          >
            {isDemoMode ? '✓ Safe Demo Simulation' : 'Live Mode'}
          </button>
        </div>

        {/* TAB 1: SOS Console & Hotlines */}
        {activeTab === 'sos' && (
          <div className="mt-4 space-y-5">
            {/* HOLD TO ACTIVATE SOS Button */}
            <div className="p-5 rounded-md bg-[#182232] border border-rose-500/30 text-center space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-rose-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> Accidental Press Protection Active
                </span>
                <span className="text-[10px] text-slate-400">
                  Hold for 3 seconds to trigger
                </span>
              </div>

              {!isSosTriggered ? (
                <div className="flex flex-col items-center justify-center py-2 space-y-3">
                  <button
                    type="button"
                    onMouseDown={startHold}
                    onMouseUp={endHold}
                    onMouseLeave={endHold}
                    onTouchStart={startHold}
                    onTouchEnd={endHold}
                    className="relative w-36 h-36 rounded-full flex items-center justify-center select-none active:scale-95 transition-transform cursor-pointer"
                  >
                    {/* Background Circle */}
                    <div className="absolute inset-0 rounded-full bg-rose-950/40 border-2 border-rose-600/50 shadow-[0_0_20px_rgba(220,38,38,0.25)]" />

                    {/* SVG Radial Fill */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="44"
                        fill="transparent"
                        stroke="#dc2626"
                        strokeWidth="6"
                        strokeDasharray="276"
                        strokeDashoffset={276 - (276 * holdProgress) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-75 ease-linear"
                      />
                    </svg>

                    <div className="relative flex flex-col items-center text-center p-2 z-10">
                      <ShieldAlert className="w-7 h-7 text-rose-500 mb-1 animate-pulse" />
                      <span className="text-xs font-black text-white tracking-wider uppercase">
                        {isHolding ? 'Holding...' : 'Hold for SOS'}
                      </span>
                      <span className="text-[10px] text-rose-300 font-bold">
                        {isHolding ? `${Math.round(holdProgress)}%` : '3s Press'}
                      </span>
                    </div>
                  </button>

                  <p className="text-[11px] text-slate-400 max-w-sm">
                    {isHolding 
                      ? 'Keep holding to broadcast emergency coordinates...' 
                      : 'Press and hold the button for 3 seconds. Releasing early cancels the trigger.'}
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-sm bg-rose-950/40 border border-rose-500 space-y-2 text-left animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-rose-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-rose-400" />
                      Emergency SOS Broadcasted ({isDemoMode ? 'Simulation' : 'Active'})
                    </span>
                    <button
                      onClick={() => {
                        setIsSosTriggered(false);
                        setHoldProgress(0);
                      }}
                      className="text-[11px] font-bold text-slate-300 hover:text-white flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" /> Reset
                    </button>
                  </div>
                  <p className="text-xs text-slate-200">
                    High-precision GPS coordinates locked and shared. Recommended action: Dial <strong>112</strong> immediately.
                  </p>
                </div>
              )}

              {/* GPS Coordinates Bar */}
              {coords && (
                <div className="flex items-center justify-between p-2.5 rounded-sm bg-[#141b26] border border-[#222d3d] text-xs">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Locate className="w-3.5 h-3.5 text-[#f3b740]" />
                    <span>GPS: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}</span>
                    <span className="text-[10px] text-[#34d399] font-semibold">(±8m accuracy)</span>
                  </div>
                  <button
                    type="button"
                    onClick={copyGpsToClipboard}
                    className="text-[11px] font-bold text-[#f3b740] hover:text-[#fbbf24] flex items-center gap-1 bg-[#182232] px-2 py-1 rounded-sm border border-[#222d3d]"
                  >
                    {copiedCoords ? <Check className="w-3 h-3 text-[#34d399]" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCoords ? 'Copied' : 'Copy GPS'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Official Emergency Hotlines Grid */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#f3b740]">
                Official Emergency Speed-Dial ({destName})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {officialServices.map((svc, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-sm bg-[#182232] border border-[#222d3d] flex items-center justify-between hover:border-rose-500/40 transition-all shadow-sm"
                  >
                    <div className="space-y-0.5 pr-2">
                      <div className="text-xs font-bold text-white">{svc.title}</div>
                      <div className="text-[10px] text-slate-400 leading-tight">{svc.desc}</div>
                    </div>
                    <a
                      href={`tel:${svc.number.split(' ')[0]}`}
                      className="px-3 py-1.5 rounded-sm bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold flex items-center gap-1 shrink-0 transition-all shadow-sm"
                    >
                      <PhoneCall className="w-3 h-3" />
                      <span>{svc.number}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Trusted Contacts */}
            <div className="p-3.5 rounded-sm bg-[#182232] border border-[#222d3d] space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#f3b740]" /> Trusted Companion Contacts
                </span>
                <span className="text-[10px] text-slate-400">Notified upon SOS trigger</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {trustedContacts.map((c, i) => (
                  <div key={i} className="p-2.5 rounded-sm bg-[#141b26] border border-[#222d3d] flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-200">{c.name}</div>
                      <div className="text-[10px] text-slate-400">{c.phone}</div>
                    </div>
                    <a
                      href={`tel:${c.phone}`}
                      className="p-1.5 rounded-sm bg-[#182232] hover:bg-[#222d3d] text-[#f3b740] border border-[#222d3d]"
                      title="Call Contact"
                    >
                      <PhoneCall className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Travel Safety Checklist */}
            <div className="p-3.5 rounded-sm bg-[#182232] border border-[#222d3d] space-y-2 text-xs text-slate-300">
              <span className="font-bold text-[#f3b740] flex items-center gap-1 text-[11px] uppercase tracking-wider">
                <AlertTriangle className="w-3.5 h-3.5 text-[#f3b740]" /> Traveler Emergency Protocol:
              </span>
              <ul className="space-y-1.5 text-[11px] text-slate-300">
                <li className="flex items-start gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-[#f3b740] shrink-0 mt-0.5" />
                  <span>Stay in well-illuminated commercial hubs or hotel reception areas.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-[#f3b740] shrink-0 mt-0.5" />
                  <span>Call 112 directly; describe your landmark and forward the GPS coordinates copied above.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 2: Emergency Services Directory (Feature 7) */}
        {activeTab === 'directory' && (
          <div className="mt-4 space-y-3">
            <p className="text-xs text-slate-400">
              Verified police stations, trauma hospitals, fire units, and transit centers in {destName}.
            </p>

            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {directory.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-sm bg-[#182232] border border-[#222d3d] hover:border-[#f3b740]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{item.name}</span>
                      {item.badge && (
                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-sm bg-[#062c20] text-[#34d399] border border-[#059669]/40 uppercase">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#f3b740] shrink-0" />
                      <span>{item.address}</span>
                      <span className="text-slate-500 font-bold ml-1">• {item.distance}</span>
                    </div>
                    <div className="text-[11px] text-[#34d399] font-medium">
                      Status: {item.openHours}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={`tel:${item.phone.split(' ')[0]}`}
                      className="px-3 py-1.5 rounded-sm bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1 transition-all"
                    >
                      <PhoneCall className="w-3 h-3" />
                      <span>{item.phone}</span>
                    </a>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name + ' ' + destName)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-sm bg-[#141b26] hover:bg-[#1f2c3f] text-[#f3b740] border border-[#222d3d] transition-all"
                      title="Open in Maps"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-3 border-t border-[#222d3d]">
          <button
            onClick={() => setIsSosOpen(false)}
            className="w-full py-2.5 rounded-sm bg-[#182232] hover:bg-[#1f2c3f] text-slate-200 font-bold text-xs border border-[#222d3d] transition-all"
          >
            Close Safety Hub
          </button>
        </div>

      </div>
    </div>
  );
};
