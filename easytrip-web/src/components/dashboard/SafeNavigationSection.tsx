import React, { useState } from 'react';
import { useTrip } from '../../context/TripContext';
import { 
  MapPin, 
  Navigation, 
  Route, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  ExternalLink, 
  Compass, 
  Fuel, 
  Hospital, 
  PhoneCall 
} from 'lucide-react';

export const SafeNavigationSection: React.FC = () => {
  const { setActiveView } = useTrip();

  const corridors = [
    {
      id: 'vizag',
      origin: 'Hyderabad',
      destination: 'Vizag (Visakhapatnam)',
      highway: 'NH16 East Coast Corridor',
      distance: '580 km',
      duration: '1h 15m air / 8h 30m train / 11h drive',
      safetyScore: '98%',
      safetyStatus: 'Verified Low Risk',
      patrolCoverage: '24/7 Highway Patrol Active',
      restStops: '14 verified food plazas & EV chargers',
      destCoords: { lat: 17.6868, lng: 83.2185 },
      origCoords: { lat: 17.3850, lng: 78.4867 }
    },
    {
      id: 'ooty',
      origin: 'Bengaluru',
      destination: 'Ooty (Nilgiris)',
      highway: 'NH181 via 36 Hairpin Bends Ghat Road',
      distance: '270 km',
      duration: '5h 30m scenic mountain drive',
      safetyScore: '99%',
      safetyStatus: 'Scenic Tourist Corridor',
      patrolCoverage: 'Tamil Nadu Hill Patrol & Forest Checkposts',
      restStops: 'Misty tea viewpoint rest bays',
      destCoords: { lat: 11.4102, lng: 76.6950 },
      origCoords: { lat: 12.9716, lng: 77.5946 }
    },
    {
      id: 'manali',
      origin: 'Delhi',
      destination: 'Manali (Himachal)',
      highway: 'NH3 via Kiratpur-Nerchowk Expressway',
      distance: '530 km',
      duration: '11h scenic Himalayan drive',
      safetyScore: '97%',
      safetyStatus: 'Mountain Safety Protocols Active',
      patrolCoverage: 'Border Roads Organisation & Traffic Police',
      restStops: 'Himalayan dhabas & snow chains support',
      destCoords: { lat: 32.2432, lng: 77.1892 },
      origCoords: { lat: 28.6139, lng: 77.2090 }
    },
    {
      id: 'paris',
      origin: 'London',
      destination: 'Paris',
      highway: 'Eurostar High-Speed Rail & A1 Motorway',
      distance: '460 km',
      duration: '2h 15m Eurostar / 5h 45m drive',
      safetyScore: '96%',
      safetyStatus: 'Schengen Border Control Verified',
      patrolCoverage: 'French Gendarmerie & Station Security',
      restStops: 'Aire de service motorways',
      destCoords: { lat: 48.8566, lng: 2.3522 },
      origCoords: { lat: 51.5074, lng: -0.1278 }
    }
  ];

  const [activeCorridor, setActiveCorridor] = useState(corridors[0]);

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${activeCorridor.origCoords.lat},${activeCorridor.origCoords.lng}&destination=${activeCorridor.destCoords.lat},${activeCorridor.destCoords.lng}`;

  return (
    <section id="navigation-section" className="my-16 sm:my-20 scroll-mt-24">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200">
          <Route className="w-3.5 h-3.5" />
          <span>SECTION 03 — SAFE NAVIGATION</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-midnight-900 tracking-tight">
          Navigate with confidence, every kilometer.
        </h2>
        <p className="text-sm text-charcoal-600 leading-relaxed">
          Real road and transit geometry with live distance calculation, highway codes, verified emergency checkpoints, and direct Google Maps sync.
        </p>
      </div>

      {/* Main Navigation Card Container */}
      <div className="surface-elevated rounded-md p-6 sm:p-8 border border-slate-200/90 shadow-elevated max-w-5xl mx-auto space-y-6">
        
        {/* Top Corridor Selector Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <span className="text-xs font-bold text-charcoal-500 uppercase tracking-wider">
            Select Transit Corridor:
          </span>
          <div className="flex flex-wrap gap-2">
            {corridors.map(c => (
              <button
                key={c.id}
                onClick={() => setActiveCorridor(c)}
                className={`px-3 py-1.5 rounded-sm text-xs font-bold transition-all ${
                  activeCorridor.id === c.id
                    ? 'bg-midnight-900 text-white shadow-sm'
                    : 'bg-slate-100 text-charcoal-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {c.origin} → {c.destination.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Corridor Details & Visual Representation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left 6 Cols: Metrics & Route Narrative */}
          <div className="lg:col-span-6 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-sm bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-black uppercase">
                  {activeCorridor.safetyStatus}
                </span>
                <span className="text-xs font-bold text-charcoal-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  {activeCorridor.safetyScore} Safety Index
                </span>
              </div>
              <h3 className="text-2xl font-black text-midnight-900 tracking-tight">
                {activeCorridor.origin} <span className="text-brand-600">→</span> {activeCorridor.destination}
              </h3>
              <p className="text-xs font-semibold text-brand-700 mt-0.5">
                {activeCorridor.highway}
              </p>
            </div>

            {/* Travel Specs Card */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-md bg-slate-50 border border-slate-200/80 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-charcoal-400 block mb-0.5">
                  Direct Corridor Distance
                </span>
                <span className="text-base font-black text-midnight-900">
                  {activeCorridor.distance}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-charcoal-400 block mb-0.5">
                  Estimated Travel Duration
                </span>
                <span className="text-xs font-bold text-charcoal-700">
                  {activeCorridor.duration}
                </span>
              </div>
            </div>

            {/* Safety & Road Amenities */}
            <div className="space-y-2 text-xs text-charcoal-600">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>{activeCorridor.patrolCoverage}</span>
              </div>
              <div className="flex items-start gap-2">
                <Fuel className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <span>{activeCorridor.restStops}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-sm bg-midnight-900 hover:bg-black text-white font-bold text-xs tracking-normal shadow-sm transition-all flex items-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5 text-teal-400" />
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>

              <button
                onClick={() => setActiveView('map')}
                className="px-4 py-2.5 rounded-sm bg-white hover:bg-slate-50 text-midnight-900 border border-slate-200 font-bold text-xs tracking-normal transition-all flex items-center gap-1.5"
              >
                <span>Interactive Route Viewer</span>
                <ArrowRight className="w-3.5 h-3.5 text-brand-600" />
              </button>
            </div>
          </div>

          {/* Right 6 Cols: Graphical Corridor Route Diagram */}
          <div className="lg:col-span-6 bg-slate-50 rounded-md p-5 border border-slate-200/80 space-y-4">
            
            {/* Diagram Header */}
            <div className="flex items-center justify-between text-xs font-bold text-midnight-900">
              <span className="flex items-center gap-1.5">
                <Route className="w-4 h-4 text-brand-600" />
                Live Animated Corridor Schematic
              </span>
              <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-sm border border-teal-200">
                OSRM Routing Synced
              </span>
            </div>

            {/* Interactive Animated SVG Corridor Canvas */}
            <div className="relative h-28 w-full bg-white rounded-sm border border-slate-200 p-2 overflow-hidden flex items-center justify-center">
              <svg 
                key={activeCorridor.id}
                viewBox="0 0 400 80" 
                className="w-full h-full"
              >
                <defs>
                  <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2563EB" />
                    <stop offset="50%" stopColor="#0D9488" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>
                </defs>

                {/* Subtle Background Guide Track */}
                <path
                  d="M 40 40 Q 120 15, 200 40 T 360 40"
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="6"
                  strokeLinecap="round"
                />

                {/* Animated Glowing Active Polyline */}
                <path
                  d="M 40 40 Q 120 15, 200 40 T 360 40"
                  fill="none"
                  stroke="url(#routeGradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="svg-route-draw"
                />

                {/* Origin Pin with Pulse */}
                <circle cx="40" cy="40" r="7" fill="#2563EB" className="animate-pulse" />
                <circle cx="40" cy="40" r="3" fill="#FFFFFF" />
                <text x="35" y="65" fontSize="10" fontWeight="bold" fill="#0F172A">
                  {activeCorridor.origin.split(' ')[0]}
                </text>

                {/* Midway Checkpoint */}
                <circle cx="200" cy="40" r="5" fill="#0D9488" />
                <circle cx="200" cy="40" r="2" fill="#FFFFFF" />
                <text x="180" y="24" fontSize="9" fontWeight="600" fill="#64748B">
                  Rest Plaza
                </text>

                {/* Destination Pin with Spring Radar */}
                <circle cx="360" cy="40" r="7" fill="#10B981" className="animate-ping" opacity="0.4" />
                <circle cx="360" cy="40" r="7" fill="#10B981" />
                <circle cx="360" cy="40" r="3" fill="#FFFFFF" />
                <text x="330" y="65" fontSize="10" fontWeight="bold" fill="#0F172A">
                  {activeCorridor.destination.split(' ')[0]}
                </text>
              </svg>
            </div>

            {/* Visual Waypoint Track with Spring Nodes */}
            <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-brand-600 before:via-teal-500 before:to-emerald-600">
              
              {/* Departure Node */}
              <div className="relative">
                <span className="absolute -left-6 top-1 w-3 h-3 rounded-sm bg-brand-600 ring-4 ring-brand-100 animate-pulse" />
                <div className="text-xs font-bold text-midnight-900">{activeCorridor.origin} Hub Departure</div>
                <div className="text-[11px] text-charcoal-500">Terminal & Highway Interchange Hub</div>
              </div>

              {/* En-Route Checkpoint */}
              <div className="relative">
                <span className="absolute -left-6 top-1 w-3 h-3 rounded-sm bg-teal-500 ring-4 ring-teal-100" />
                <div className="text-xs font-bold text-teal-900">Midway Rest & Safety Checkpoint</div>
                <div className="text-[11px] text-charcoal-500">{activeCorridor.restStops}</div>
              </div>

              {/* Destination Node */}
              <div className="relative">
                <span className="absolute -left-6 top-1 w-3 h-3 rounded-sm bg-emerald-600 ring-4 ring-emerald-100 animate-pulse" />
                <div className="text-xs font-bold text-midnight-900">{activeCorridor.destination} Arrival</div>
                <div className="text-[11px] text-charcoal-500">24/7 Regulated Prepaid Cabs & Hotel Links</div>
              </div>

            </div>

            {/* Emergency Hotline Banner inside diagram */}
            <div className="p-3 rounded-sm bg-white border border-slate-200 text-xs flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <Hospital className="w-4 h-4 text-rose-500" />
                <span className="font-semibold text-charcoal-700">En-route Emergency Dispatch:</span>
              </div>
              <span className="font-bold text-rose-600 font-mono">112 / 108</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
