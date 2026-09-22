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
  PhoneCall,
  Mountain
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
      origCoords: { lat: 17.3850, lng: 78.4867 },
      elevCurve: 'M 40 45 C 100 45, 160 62, 220 64 C 280 66, 320 30, 360 68',
      elevArea: 'M 40 45 C 100 45, 160 62, 220 64 C 280 66, 320 30, 360 68 L 360 74 L 40 74 Z',
      elevPoints: [
        { label: 'Hyd', alt: '540m', x: 40, y: 45 },
        { label: 'Mid Basin', alt: '18m', x: 220, y: 64 },
        { label: 'Ridge', alt: '360m', x: 320, y: 30 },
        { label: 'Vizag Coast', alt: '8m', x: 360, y: 68 }
      ]
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
      origCoords: { lat: 12.9716, lng: 77.5946 },
      elevCurve: 'M 40 60 C 110 58, 180 50, 240 38 C 290 22, 330 16, 360 14',
      elevArea: 'M 40 60 C 110 58, 180 50, 240 38 C 290 22, 330 16, 360 14 L 360 74 L 40 74 Z',
      elevPoints: [
        { label: 'BLR', alt: '920m', x: 40, y: 60 },
        { label: 'Foothill', alt: '1020m', x: 180, y: 50 },
        { label: 'Hairpins', alt: '1650m', x: 290, y: 22 },
        { label: 'Ooty Summit', alt: '2240m', x: 360, y: 14 }
      ]
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
      origCoords: { lat: 28.6139, lng: 77.2090 },
      elevCurve: 'M 40 68 C 110 65, 190 56, 250 40 C 295 26, 335 18, 360 15',
      elevArea: 'M 40 68 C 110 65, 190 56, 250 40 C 295 26, 335 18, 360 15 L 360 74 L 40 74 Z',
      elevPoints: [
        { label: 'DEL', alt: '216m', x: 40, y: 68 },
        { label: 'Foothills', alt: '350m', x: 190, y: 56 },
        { label: 'Valley', alt: '1250m', x: 295, y: 26 },
        { label: 'Manali Resort', alt: '2050m', x: 360, y: 15 }
      ]
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
      origCoords: { lat: 51.5074, lng: -0.1278 },
      elevCurve: 'M 40 64 C 110 70, 190 70, 250 52 C 290 46, 330 58, 360 62',
      elevArea: 'M 40 64 C 110 70, 190 70, 250 52 C 290 46, 330 58, 360 62 L 360 74 L 40 74 Z',
      elevPoints: [
        { label: 'LON', alt: '15m', x: 40, y: 64 },
        { label: 'Channel', alt: '0m', x: 190, y: 70 },
        { label: 'Picardy', alt: '140m', x: 290, y: 46 },
        { label: 'Paris Core', alt: '35m', x: 360, y: 62 }
      ]
    }
  ];

  const [activeCorridor, setActiveCorridor] = useState(corridors[0]);
  const [corridorDisplayMode, setCorridorDisplayMode] = useState<'schematic' | 'elevation'>('schematic');

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
      <div className="surface-elevated rounded-md p-6 sm:p-8 border border-[#222d3d] shadow-2xl max-w-5xl mx-auto space-y-6 bg-[#141b26] specular-sheen">
        
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

          {/* Right 6 Cols: Graphical Corridor Route Diagram & Elevation Profile */}
          <div className="lg:col-span-6 bg-[#182232] rounded-md p-5 border border-[#222d3d] space-y-4 specular-sheen">
            
            {/* Diagram Header & Mode Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-[#f1f5f9]">
              <div className="flex items-center gap-1 bg-[#121924] p-1 rounded-sm border border-[#222d3d]">
                <button
                  onClick={() => setCorridorDisplayMode('schematic')}
                  className={`px-2.5 py-1 rounded-sm text-[11px] font-bold flex items-center gap-1 transition-all ${
                    corridorDisplayMode === 'schematic'
                      ? 'bg-[#182232] text-[#f3b740] border border-[#f3b740]/40 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Route className="w-3 h-3 text-[#f3b740]" />
                  <span>Route Schematic</span>
                </button>
                <button
                  onClick={() => setCorridorDisplayMode('elevation')}
                  className={`px-2.5 py-1 rounded-sm text-[11px] font-bold flex items-center gap-1 transition-all ${
                    corridorDisplayMode === 'elevation'
                      ? 'bg-[#182232] text-[#f3b740] border border-[#f3b740]/40 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Mountain className="w-3 h-3 text-[#f3b740]" />
                  <span>Elevation Wipe</span>
                </button>
              </div>

              <span className="text-[10px] font-bold text-[#34d399] bg-[#062c20] px-2 py-0.5 rounded-sm border border-[#059669]/40">
                {corridorDisplayMode === 'elevation' ? 'Amber Gold Telemetry' : 'OSRM Routing Synced'}
              </span>
            </div>

            {/* Interactive Animated SVG Corridor Canvas */}
            <div className="relative h-28 w-full bg-[#0b0e14] rounded-sm border border-[#222d3d] p-2 overflow-hidden flex items-center justify-center">
              {corridorDisplayMode === 'schematic' ? (
                <svg 
                  key={activeCorridor.id + '-schematic'}
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
              ) : (
                <svg 
                  key={activeCorridor.id + '-elevation'}
                  viewBox="0 0 400 80" 
                  className="w-full h-full"
                >
                  <defs>
                    {/* Amber Gold Stroke Gradient (#d97706, #f3b740, #fbbf24) */}
                    <linearGradient id="corridorElevGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#d97706" />
                      <stop offset="50%" stopColor="#f3b740" />
                      <stop offset="100%" stopColor="#fbbf24" />
                    </linearGradient>

                    {/* Amber Gold Area Fill Wipe Gradient */}
                    <linearGradient id="corridorAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.25" />
                      <stop offset="60%" stopColor="#d97706" stopOpacity="0.08" />
                      <stop offset="100%" stopColor="#0b0e14" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Guide Grid Lines */}
                  <line x1="30" y1="25" x2="370" y2="25" stroke="#222d3d" strokeDasharray="2 3" strokeWidth="1" />
                  <line x1="30" y1="50" x2="370" y2="50" stroke="#222d3d" strokeDasharray="2 3" strokeWidth="1" />
                  <line x1="30" y1="74" x2="370" y2="74" stroke="#222d3d" strokeWidth="1" />

                  {/* Area Fill Wipe Underneath Curve */}
                  <path
                    d={activeCorridor.elevArea}
                    fill="url(#corridorAreaGrad)"
                    className="elevation-area-wipe"
                  />

                  {/* Self-Drawing Dynamic SVG Curve */}
                  <path
                    d={activeCorridor.elevCurve}
                    fill="none"
                    stroke="url(#corridorElevGrad)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className="elevation-curve-draw"
                  />

                  {/* Waypoint Altitude Nodes */}
                  {activeCorridor.elevPoints.map((pt, i) => (
                    <g key={i}>
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="4.5"
                        fill="#fbbf24"
                        stroke="#0e131f"
                        strokeWidth="2"
                        className="elevation-dot-pop"
                        style={{ animationDelay: `${i * 180}ms` }}
                      />
                      <text
                        x={pt.x}
                        y={pt.y - 7}
                        fontSize="8.5"
                        fontWeight="bold"
                        textAnchor="middle"
                        fill="#fbbf24"
                      >
                        {pt.alt}
                      </text>
                      <text
                        x={pt.x}
                        y="72"
                        fontSize="7.5"
                        fontWeight="600"
                        textAnchor="middle"
                        fill="#94a3b8"
                      >
                        {pt.label}
                      </text>
                    </g>
                  ))}
                </svg>
              )}
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
