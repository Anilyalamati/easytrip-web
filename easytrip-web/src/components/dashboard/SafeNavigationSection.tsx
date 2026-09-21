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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-[#182232] text-[#f3b740] text-xs font-bold border border-[#f3b740]/30">
          <Route className="w-3.5 h-3.5" />
          <span>SECTION 03 — SAFE NAVIGATION</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#f1f5f9] tracking-tight">
          Navigate with confidence, every kilometer.
        </h2>
        <p className="text-sm text-[#94a3b8] leading-relaxed">
          Real road and transit geometry with live distance calculation, highway codes, verified emergency checkpoints, and direct Google Maps sync.
        </p>
      </div>

      {/* Main Navigation Card Container */}
      <div className="surface-elevated rounded-md p-6 sm:p-8 border border-[#222d3d] shadow-2xl max-w-5xl mx-auto space-y-6 bg-[#141b26]">
        
        {/* Top Corridor Selector Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#222d3d]">
          <span className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider">
            Select Transit Corridor:
          </span>
          <div className="flex flex-wrap gap-2">
            {corridors.map(c => (
              <button
                key={c.id}
                onClick={() => setActiveCorridor(c)}
                className={`px-3 py-1.5 rounded-sm text-xs font-bold transition-all ${
                  activeCorridor.id === c.id
                    ? 'bg-[#f3b740] text-[#0e131f] shadow-[0_0_12px_rgba(243,183,64,0.3)]'
                    : 'bg-[#182232] text-[#cbd5e1] hover:bg-[#222d3d] border border-[#222d3d]'
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
                <span className="px-2.5 py-0.5 rounded-sm bg-[#062c20] text-[#34d399] border border-[#059669]/40 text-[10px] font-black uppercase">
                  {activeCorridor.safetyStatus}
                </span>
                <span className="text-xs font-bold text-[#94a3b8] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#34d399]" />
                  {activeCorridor.safetyScore} Safety Index
                </span>
              </div>
              <h3 className="text-2xl font-black text-[#f1f5f9] tracking-tight">
                {activeCorridor.origin} <span className="text-[#f3b740]">→</span> {activeCorridor.destination}
              </h3>
              <p className="text-xs font-semibold text-[#f3b740] mt-0.5">
                {activeCorridor.highway}
              </p>
            </div>

            {/* Travel Specs Card */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-md bg-[#182232] border border-[#222d3d] text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#94a3b8] block mb-0.5">
                  Direct Corridor Distance
                </span>
                <span className="text-base font-black text-[#f3b740]">
                  {activeCorridor.distance}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#94a3b8] block mb-0.5">
                  Estimated Travel Duration
                </span>
                <span className="text-xs font-bold text-[#f1f5f9]">
                  {activeCorridor.duration}
                </span>
              </div>
            </div>

            {/* Safety & Road Amenities */}
            <div className="space-y-2 text-xs text-[#94a3b8]">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#34d399] shrink-0 mt-0.5" />
                <span>{activeCorridor.patrolCoverage}</span>
              </div>
              <div className="flex items-start gap-2">
                <Fuel className="w-4 h-4 text-[#f3b740] shrink-0 mt-0.5" />
                <span>{activeCorridor.restStops}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-sm bg-[#f3b740] hover:bg-[#e5a83b] text-[#0e131f] font-bold text-xs tracking-normal shadow-[0_2px_12px_rgba(243,183,64,0.3)] transition-all flex items-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5 text-[#0e131f]" />
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>

              <button
                onClick={() => setActiveView('map')}
                className="px-4 py-2.5 rounded-sm bg-[#182232] hover:bg-[#222d3d] text-[#f1f5f9] border border-[#222d3d] font-bold text-xs tracking-normal transition-all flex items-center gap-1.5"
              >
                <span>Interactive Route Viewer</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#f3b740]" />
              </button>
            </div>
          </div>

          {/* Right 6 Cols: Graphical Corridor Route Diagram */}
          <div className="lg:col-span-6 bg-[#182232] rounded-md p-5 border border-[#222d3d] space-y-4">
            
            {/* Diagram Header */}
            <div className="flex items-center justify-between text-xs font-bold text-[#f1f5f9]">
              <span className="flex items-center gap-1.5">
                <Route className="w-4 h-4 text-[#f3b740]" />
                Live Animated Corridor Schematic
              </span>
              <span className="text-[10px] font-bold text-[#34d399] bg-[#062c20] px-2 py-0.5 rounded-sm border border-[#059669]/40">
                OSRM Routing Synced
              </span>
            </div>

            {/* Interactive Animated SVG Corridor Canvas */}
            <div className="relative h-28 w-full bg-[#0b0e14] rounded-sm border border-[#222d3d] p-2 overflow-hidden flex items-center justify-center">
              <svg 
                key={activeCorridor.id}
                viewBox="0 0 400 80" 
                className="w-full h-full"
              >
                <defs>
                  <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f7d56e" />
                    <stop offset="50%" stopColor="#f3b740" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>

                {/* Subtle Background Guide Track */}
                <path
                  d="M 40 40 Q 120 15, 200 40 T 360 40"
                  fill="none"
                  stroke="#222d3d"
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
                <circle cx="40" cy="40" r="7" fill="#f3b740" className="animate-pulse" />
                <circle cx="40" cy="40" r="3" fill="#0e131f" />
                <text x="35" y="65" fontSize="10" fontWeight="bold" fill="#f1f5f9">
                  {activeCorridor.origin.split(' ')[0]}
                </text>

                {/* Midway Checkpoint */}
                <circle cx="200" cy="40" r="5" fill="#e5a83b" />
                <circle cx="200" cy="40" r="2" fill="#0e131f" />
                <text x="180" y="24" fontSize="9" fontWeight="600" fill="#94a3b8">
                  Rest Plaza
                </text>

                {/* Destination Pin with Spring Radar */}
                <circle cx="360" cy="40" r="7" fill="#10b981" className="animate-ping" opacity="0.4" />
                <circle cx="360" cy="40" r="7" fill="#10b981" />
                <circle cx="360" cy="40" r="3" fill="#ffffff" />
                <text x="330" y="65" fontSize="10" fontWeight="bold" fill="#f1f5f9">
                  {activeCorridor.destination.split(' ')[0]}
                </text>
              </svg>
            </div>

            {/* Visual Waypoint Track with Spring Nodes */}
            <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-[#f3b740] before:via-[#e5a83b] before:to-[#10b981]">
              
              {/* Departure Node */}
              <div className="relative">
                <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-[#f3b740] ring-4 ring-[#f3b740]/20 animate-pulse" />
                <div className="text-xs font-bold text-[#f1f5f9]">{activeCorridor.origin} Hub Departure</div>
                <div className="text-[11px] text-[#94a3b8]">Terminal & Highway Interchange Hub</div>
              </div>

              {/* En-Route Checkpoint */}
              <div className="relative">
                <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-[#e5a83b] ring-4 ring-[#e5a83b]/20" />
                <div className="text-xs font-bold text-[#f7d56e]">Midway Rest & Safety Checkpoint</div>
                <div className="text-[11px] text-[#94a3b8]">{activeCorridor.restStops}</div>
              </div>

              {/* Destination Node */}
              <div className="relative">
                <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-[#10b981] ring-4 ring-[#10b981]/20 animate-pulse" />
                <div className="text-xs font-bold text-[#f1f5f9]">{activeCorridor.destination} Arrival</div>
                <div className="text-[11px] text-[#94a3b8]">24/7 Regulated Prepaid Cabs & Hotel Links</div>
              </div>

            </div>

            {/* Emergency Hotline Banner inside diagram */}
            <div className="p-3 rounded-sm bg-[#141b26] border border-[#222d3d] text-xs flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <Hospital className="w-4 h-4 text-rose-500" />
                <span className="font-semibold text-[#cbd5e1]">En-route Emergency Dispatch:</span>
              </div>
              <span className="font-bold text-rose-400 font-mono">112 / 108</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
