import { TripItinerary, CartItem } from '../types/trip';

const TRIP_STORAGE_KEY = 'easytrip_ai_trip_history_v1';
const CART_STORAGE_KEY = 'easytrip_cart_items_v1';

export function getSavedTrips(): TripItinerary[] {
  try {
    const raw = localStorage.getItem(TRIP_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to read saved trips:', e);
    return [];
  }
}

export function saveTrip(trip: TripItinerary): TripItinerary[] {
  try {
    const current = getSavedTrips();
    const existingIndex = current.findIndex(t => t.id === trip.id);
    const updatedTrip = { ...trip, savedAt: new Date().toISOString() };
    
    let updatedList: TripItinerary[];
    if (existingIndex >= 0) {
      updatedList = [...current];
      updatedList[existingIndex] = updatedTrip;
    } else {
      updatedList = [updatedTrip, ...current];
    }
    
    localStorage.setItem(TRIP_STORAGE_KEY, JSON.stringify(updatedList));
    return updatedList;
  } catch (e) {
    console.error('Failed to save trip:', e);
    return [];
  }
}

export function deleteSavedTrip(id: string): TripItinerary[] {
  try {
    const current = getSavedTrips();
    const updatedList = current.filter(t => t.id !== id);
    localStorage.setItem(TRIP_STORAGE_KEY, JSON.stringify(updatedList));
    return updatedList;
  } catch (e) {
    console.error('Failed to delete trip:', e);
    return [];
  }
}

export function getCartItems(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveCartItems(items: CartItem[]): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save cart:', e);
  }
}
