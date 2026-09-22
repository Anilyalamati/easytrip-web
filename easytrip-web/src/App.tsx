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
import { GenerationOverlay } from './components/planner/GenerationOverlay';
import { BackgroundMotion } from './components/common/BackgroundMotion';

export const App: React.FC = () => {
  const { activeView, isGenerating, generatingDestination } = useTrip();

  return (
    <div className="relative min-h-screen flex flex-col bg-[#0b0e14] text-[#f1f5f9] font-sans selection:bg-[#f3b740]/30 selection:text-[#f7d56e] overflow-x-hidden">
      {/* Cinematic Ambient Background Motion System */}
      <BackgroundMotion />

      {/* Global Immersive Multi-Stage Loading Overlay */}
      {isGenerating && <GenerationOverlay destination={generatingDestination} />}

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
