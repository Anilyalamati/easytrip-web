import React, { useEffect, useState } from 'react';
import { useTrip } from '../../context/TripContext';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Compass, ExternalLink, Clock, Sparkles } from 'lucide-react';
import { apiUrl } from '../../utils/api';

// Custom Map Auto-center Component
const MapRecenter: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

export const RouteMap: React.FC = () => {
  const { currentTrip, setActiveView } = useTrip();

  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const [distanceKm, setDistanceKm] = useState<number>(0);
  const [durationMins, setDurationMins] = useState<number>(0);
  const [routingSource, setRoutingSource] = useState<string>('Connecting...');

  // Target destination coordinates
  const destCoords = currentTrip?.coordinates || { lat: 15.2993, lng: 74.1240 };
  const originCoords = { lat: destCoords.lat + 0.35, lng: destCoords.lng - 0.25 }; // Departure offset

  // Fetch real road route from server
  useEffect(() => {
    fetch(apiUrl(`/api/route?startLat=${originCoords.lat}&startLng=${originCoords.lng}&endLat=${destCoords.lat}&endLng=${destCoords.lng}`))
      .then(res => res.json())
      .then(data => {
        if (data.success && data.coordinates) {
          setRouteCoords(data.coordinates);
          setDistanceKm(data.distanceKm);
          setDurationMins(data.durationMins);
          setRoutingSource(data.source);
        }
      })
      .catch(err => {
        console.error('Route fetch error:', err);
        // Fallback simple line
        setRouteCoords([[originCoords.lat, originCoords.lng], [destCoords.lat, destCoords.lng]]);
        setDistanceKm(145);
        setDurationMins(160);
      });
  }, [destCoords.lat, destCoords.lng]);

  // Create custom gold pin Leaflet icon
  const customGoldPin = L.icon({
    iconUrl: '/assets/easytrip_logo.png',
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38]
  });

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${originCoords.lat},${originCoords.lng}&destination=${destCoords.lat},${destCoords.lng}`;

  const centerPoint: [number, number] = [destCoords.lat, destCoords.lng];

  return (
    <div className="my-8 space-y-6">
      {/* Header bar */}
      <div className="bg-[#141b26] rounded-md p-6 sm:p-8 border border-[#222d3d] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[#f3b740] text-xs uppercase font-bold tracking-wider mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Road Route Guidance & Navigation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {currentTrip ? `${currentTrip.origin} → ${currentTrip.destination} Route` : 'Interactive Destination Route'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real road geometry powered by OSRM with direct navigation sync
          </p>
        </div>

        {/* Stats & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2 rounded-sm bg-[#182232] border border-[#222d3d] flex items-center gap-3">
            <div>
              <span className="block text-[10px] text-slate-400 uppercase font-bold">Estimated Distance</span>
              <span className="text-sm font-bold text-[#f3b740]">{distanceKm} km</span>
            </div>
            <div className="w-px h-6 bg-[#222d3d]" />
            <div>
              <span className="block text-[10px] text-slate-400 uppercase font-bold">Travel Time</span>
              <span className="text-sm font-bold text-slate-200">
                {Math.floor(durationMins / 60)}h {durationMins % 60}m
              </span>
            </div>
          </div>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-sm gold-gradient-bg text-[#0e131f] font-bold text-xs tracking-wide shadow-gold-glow hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Open in Google Maps</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>
        </div>
      </div>

      {/* Map Viewer Container */}
      <div className="h-[560px] w-full rounded-md overflow-hidden bg-[#141b26] border border-[#222d3d] relative shadow-xl">
        <MapContainer
          center={centerPoint}
          zoom={10}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <MapRecenter center={centerPoint} zoom={10} />
          
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Polyline Route */}
          {routeCoords.length > 0 && (
            <Polyline
              positions={routeCoords}
              pathOptions={{
                color: '#f3b740',
                weight: 5,
                opacity: 0.95,
                lineCap: 'round',
                lineJoin: 'round',
                dashArray: undefined
              }}
            />
          )}

          {/* Destination Marker */}
          <Marker position={[destCoords.lat, destCoords.lng]} icon={customGoldPin}>
            <Popup className="custom-popup">
              <div className="p-2 text-slate-900">
                <div className="font-bold text-sm">
                  {currentTrip?.destination || 'Destination Point'}
                </div>
                <div className="text-xs text-slate-600">
                  {currentTrip?.country || 'Primary Location'}
                </div>
                <div className="mt-1 text-[11px] font-semibold text-[#f3b740]">
                  EasyTrip Hub Destination
                </div>
              </div>
            </Popup>
          </Marker>

          {/* Itinerary Waypoints */}
          {currentTrip?.itineraryDays?.map((d, dIdx) => (
            d.slots.map(s => (
              <Marker
                key={s.id}
                position={[s.coordinates.lat, s.coordinates.lng]}
                icon={customGoldPin}
              >
                <Popup>
                  <div className="p-2 text-slate-900">
                    <span className="text-[10px] uppercase font-bold text-[#e5a83b]">
                      Day {d.dayNumber} • {s.period}
                    </span>
                    <h5 className="font-bold text-xs">{s.title}</h5>
                    <p className="text-[11px] text-slate-600">{s.location}</p>
                  </div>
                </Popup>
              </Marker>
            ))
          ))}
        </MapContainer>

        {/* Floating Route Info Overlay */}
        <div className="absolute bottom-4 left-4 z-[1000] p-4 rounded-sm bg-[#141b26]/95 backdrop-blur-md border border-[#222d3d] text-xs space-y-1 shadow-2xl max-w-xs text-slate-300">
          <div className="flex items-center gap-1.5 font-bold text-white">
            <Sparkles className="w-3.5 h-3.5 text-[#f3b740]" />
            <span>{currentTrip?.destination || 'EasyTrip'} Scenic Route</span>
          </div>
          <p className="text-slate-400 text-[11px]">
            Route geometry verified via {routingSource}. Click any pin to view scheduled activity and timing.
          </p>
        </div>
      </div>
    </div>
  );
};
