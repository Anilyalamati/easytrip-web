import React, { createContext, useContext, useState, useEffect } from 'react';
import { TripItinerary, CartItem, Destination, ReservationConfirmation } from '../types/trip';
import { getSavedTrips, saveTrip, deleteSavedTrip, getCartItems, saveCartItems } from '../utils/storage';
import { apiUrl } from '../utils/api';

interface TripContextType {
  currentTrip: TripItinerary | null;
  savedTrips: TripItinerary[];
  cart: CartItem[];
  destinations: Destination[];
  activeView: 'dashboard' | 'itinerary' | 'booking' | 'map';
  isPlannerOpen: boolean;
  isGenerating: boolean;
  isSavedTripsOpen: boolean;
  isSosOpen: boolean;
  isCheckoutOpen: boolean;
  prefillDestination: string | null;
  prefillDays: number | null;
  latestConfirmation: ReservationConfirmation | null;
  setActiveView: (view: 'dashboard' | 'itinerary' | 'booking' | 'map') => void;
  setIsPlannerOpen: (open: boolean) => void;
  setIsSavedTripsOpen: (open: boolean) => void;
  setIsSosOpen: (open: boolean) => void;
  setIsCheckoutOpen: (open: boolean) => void;
  setLatestConfirmation: (conf: ReservationConfirmation | null) => void;
  planTrip: (params: any) => Promise<TripItinerary>;
  saveCurrentTrip: () => void;
  removeTrip: (id: string) => void;
  selectTrip: (trip: TripItinerary) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  openPlannerWithDestination: (destName?: string, daysCount?: number) => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrip, setCurrentTrip] = useState<TripItinerary | null>(null);
  const [savedTrips, setSavedTrips] = useState<TripItinerary[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [activeView, setActiveView] = useState<'dashboard' | 'itinerary' | 'booking' | 'map'>('dashboard');
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSavedTripsOpen, setIsSavedTripsOpen] = useState(false);
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [prefillDestination, setPrefillDestination] = useState<string | null>(null);
  const [prefillDays, setPrefillDays] = useState<number | null>(null);
  const [latestConfirmation, setLatestConfirmation] = useState<ReservationConfirmation | null>(null);

  useEffect(() => {
    setSavedTrips(getSavedTrips());
    setCart(getCartItems());

    // Fetch destinations catalog
    fetch(apiUrl('/api/destinations'))
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setDestinations(json.data);
        }
      })
      .catch(err => console.error('Error fetching destinations:', err));
  }, []);

  const planTrip = async (params: any): Promise<TripItinerary> => {
    setIsGenerating(true);
    try {
      console.log('[EasyTrip API] Submitting plan-trip payload:', params);
      const response = await fetch(apiUrl('/api/plan-trip'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      const result = await response.json();
      if (!result.success || !result.data) {
        throw new Error(result.message || 'Failed to generate itinerary');
      }

      const generatedTrip: TripItinerary = result.data;
      console.log('[EasyTrip API] Received generated trip:', generatedTrip.destination);
      setCurrentTrip(generatedTrip);
      setActiveView('itinerary');
      setIsPlannerOpen(false);
      setPrefillDestination(null);
      setPrefillDays(null);
      return generatedTrip;
    } finally {
      setIsGenerating(false);
    }
  };

  const saveCurrentTrip = () => {
    if (!currentTrip) return;
    const updated = saveTrip(currentTrip);
    setSavedTrips(updated);
  };

  const removeTrip = (id: string) => {
    const updated = deleteSavedTrip(id);
    setSavedTrips(updated);
    if (currentTrip?.id === id) {
      setCurrentTrip(null);
      setActiveView('dashboard');
    }
  };

  const selectTrip = (trip: TripItinerary) => {
    setCurrentTrip(trip);
    setActiveView('itinerary');
    setIsSavedTripsOpen(false);
  };

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === item.id);
      let updated: CartItem[];
      if (exists) {
        updated = prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      } else {
        updated = [...prev, { ...item, quantity: 1 }];
      }
      saveCartItems(updated);
      return updated;
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const updated = prev.filter(i => i.id !== id);
      saveCartItems(updated);
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    saveCartItems([]);
  };

  const openPlannerWithDestination = (destName?: string, daysCount?: number) => {
    if (destName) {
      setPrefillDestination(destName.trim());
    } else {
      setPrefillDestination(null);
    }
    if (daysCount) {
      setPrefillDays(daysCount);
    }
    setIsPlannerOpen(true);
  };

  return (
    <TripContext.Provider
      value={{
        currentTrip,
        savedTrips,
        cart,
        destinations,
        activeView,
        isPlannerOpen,
        isGenerating,
        isSavedTripsOpen,
        isSosOpen,
        isCheckoutOpen,
        prefillDestination,
        prefillDays,
        latestConfirmation,
        setActiveView,
        setIsPlannerOpen,
        setIsSavedTripsOpen,
        setIsSosOpen,
        setIsCheckoutOpen,
        setLatestConfirmation,
        planTrip,
        saveCurrentTrip,
        removeTrip,
        selectTrip,
        addToCart,
        removeFromCart,
        clearCart,
        openPlannerWithDestination,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};
