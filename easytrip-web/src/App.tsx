import React from 'react';
import { useTrip } from './context/TripContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HeroBanner } from './components/dashboard/HeroBanner';
import { QuickPlannerBar } from './components/dashboard/QuickPlannerBar';
import { FeaturedDestinations } from './components/dashboard/FeaturedDestinations';
import { TripStats } from './components/dashboard/TripStats';
import { SafetySosWidget } from './components/dashboard/SafetySosWidget';
import { ItineraryView } from './components/itinerary/ItineraryView';
import { RouteMap } from './components/map/RouteMap';
import { BookingHub } from './components/booking/BookingHub';
import { TripPlannerModal } from './components/planner/TripPlannerModal';
import { CheckoutModal } from './components/booking/CheckoutModal';
import { SavedTripsModal } from './components/history/SavedTripsModal';
import { EmergencyModal } from './components/sos/EmergencyModal';

export const App: React.FC = () => {
  const { activeView } = useTrip();

  return (
    <div className="min-h-screen flex flex-col bg-navy-900 text-slate-100 font-sans selection:bg-gold-500/30 selection:text-gold-200">
      {/* Navigation */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {activeView === 'dashboard' && (
          <>
            <HeroBanner />
            <QuickPlannerBar />
            <TripStats />
            <FeaturedDestinations />
            <SafetySosWidget />
          </>
        )}

        {activeView === 'itinerary' && <ItineraryView />}
        {activeView === 'booking' && <BookingHub />}
        {activeView === 'map' && <RouteMap />}
      </main>

      {/* Global Modals */}
      <TripPlannerModal />
      <CheckoutModal />
      <SavedTripsModal />
      <EmergencyModal />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
