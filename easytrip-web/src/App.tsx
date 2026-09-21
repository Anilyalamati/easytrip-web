import React from 'react';
import { useTrip } from './context/TripContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HeroBanner } from './components/dashboard/HeroBanner';
import { QuickPlannerBar } from './components/dashboard/QuickPlannerBar';
import { FeaturedDestinations } from './components/dashboard/FeaturedDestinations';
import { SafeNavigationSection } from './components/dashboard/SafeNavigationSection';
import { AiAssistantSection } from './components/dashboard/AiAssistantSection';
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
    <div className="min-h-screen flex flex-col bg-canvas text-charcoal-900 font-sans selection:bg-brand-500/20 selection:text-brand-900">
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
            <SafeNavigationSection />
            <AiAssistantSection />
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
