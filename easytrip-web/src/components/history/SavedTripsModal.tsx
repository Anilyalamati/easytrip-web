import React from 'react';
import { useTrip } from '../../context/TripContext';
import { X, Bookmark, Trash2, ArrowRight, Calendar, MapPin, Sparkles } from 'lucide-react';
import { TripItinerary } from '../../types/trip';

export const SavedTripsModal: React.FC = () => {
  const { 
    isSavedTripsOpen, 
    setIsSavedTripsOpen, 
    savedTrips, 
    selectTrip, 
    removeTrip,
    setIsPlannerOpen 
  } = useTrip();

  if (!isSavedTripsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-navy-850 border border-gold-500/30 rounded-md p-6 sm:p-8 shadow-gold-glow-lg my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-navy-700/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-navy-800 border border-gold-500/40 flex items-center justify-center p-2">
              <Bookmark className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Saved Trips History
              </h2>
              <p className="text-xs text-slate-400">
                Your offline & synced AI travel itineraries (v1)
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSavedTripsOpen(false)}
            className="p-2 rounded-sm text-slate-400 hover:text-white hover:bg-navy-750 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Trips List */}
        <div className="mt-6 space-y-4 max-h-96 overflow-y-auto pr-1">
          {savedTrips.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-3">
              <div className="w-12 h-12 rounded-sm bg-navy-900 border border-navy-750 flex items-center justify-center mx-auto text-gold-400">
                <Bookmark className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">No AI trips yet</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Create a trip from the planner and your full itinerary will be saved here automatically for quick access.
              </p>
              <button
                onClick={() => {
                  setIsSavedTripsOpen(false);
                  setIsPlannerOpen(true);
                }}
                className="px-5 py-2.5 rounded-sm gold-gradient-bg text-navy-950 font-bold text-xs shadow-gold-glow inline-flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Design My First Trip</span>
              </button>
            </div>
          ) : (
            savedTrips.map((trip: TripItinerary) => (
              <div
                key={trip.id}
                className="p-4 rounded-md bg-navy-900/90 border border-navy-750 hover:border-gold-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-sm overflow-hidden shrink-0 border border-navy-700">
                    <img src={trip.heroImage} alt={trip.destination} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white group-hover:text-gold-300 transition-colors">
                      {trip.destination}, {trip.country}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gold-400" />
                        From {trip.origin}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gold-400" />
                        {trip.days} Days
                      </span>
                      <span className="text-gold-400 font-semibold">
                        ₹{trip.estimatedTotalCost.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => removeTrip(trip.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 rounded-sm hover:bg-navy-800 transition-all"
                    title="Delete saved trip"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => selectTrip(trip)}
                    className="px-4 py-2 rounded-sm gold-gradient-bg text-navy-950 font-bold text-xs tracking-wide shadow-sm hover:brightness-110 flex items-center gap-1.5"
                  >
                    <span>Open Plan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
