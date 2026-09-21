export interface Coordinates {
  lat: number;
  lng: number;
}

export interface ActivitySlot {
  id: string;
  period: 'Morning' | 'Afternoon' | 'Evening';
  time: string;
  title: string;
  location: string;
  description: string;
  category: string;
  cost: number;
  duration: string;
  image: string;
  imageUrl?: string;
  coordinates: Coordinates;
  tips: string;
  photoQuery?: string;
  unsplashSearchUrl?: string;
}

export interface DiningRecommendation {
  name: string;
  cuisine: string;
  specialty: string;
  location: string;
  priceRange: string;
  timing?: string;
  rating: number;
}

export interface DayPlan {
  dayNumber: number;
  date: string;
  title: string;
  theme: string;
  weather: {
    temp: number;
    condition: string;
    icon: string;
  };
  slots: ActivitySlot[];
  diningRecommendations?: DiningRecommendation[];
  imageUrl?: string;
  image?: string;
}

export interface HotelRecommendation {
  name: string;
  tier: 'budget' | 'moderate' | 'luxury';
  location: string;
  pricePerNight: number;
  rating: number;
  amenities: string[];
  image: string;
  badge?: string;
}

export interface TransitOption {
  mode: 'flight' | 'train' | 'drive' | 'cab';
  title: string;
  duration: string;
  estimatedCost: number;
  routeOverview: string;
  highlights: string[];
  terminalDetails?: {
    departureTerminal?: string;
    arrivalTerminal?: string;
  };
}

export interface JourneyTransitBreakdown {
  preferredMode: 'flight' | 'train' | 'drive' | 'cab';
  origin: string;
  destination: string;
  distanceKm: number;
  primaryOption: TransitOption;
  alternativeOptions: TransitOption[];
  travelTips: string[];
}

export interface TripItinerary {
  id: string;
  destination: string;
  country: string;
  origin: string;
  originCoordinates?: Coordinates;
  days: number;
  startDate: string;
  endDate: string;
  budgetTier: 'budget' | 'moderate' | 'luxury';
  travelStyle: string;
  interests: string[];
  coordinates: Coordinates;
  heroImage: string;
  estimatedTotalCost: number;
  currency: string;
  itineraryDays: DayPlan[];
  aiNotes: string[];
  preferredTransport?: string;
  journeyTransit?: JourneyTransitBreakdown;
  hotelRecommendations?: HotelRecommendation[];
  savedAt?: string;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  tagline: string;
  category: string;
  badge: string;
  rating: number;
  reviewCount: number;
  image: string;
  bannerImage: string;
  coordinates: Coordinates;
  idealDays: string;
  avgCostPerDay: {
    budget: number;
    moderate: number;
    luxury: number;
  };
  currency: string;
  bestSeason: string;
  highlights: string[];
  tags: string[];
}

export interface BookingHotel {
  id: string;
  destinationId: string;
  name: string;
  type: string;
  rating: number;
  reviews: number;
  pricePerNight: number;
  currency: string;
  image: string;
  amenities: string[];
  location: string;
  badge: string;
}

export interface BookingTransport {
  id: string;
  type: 'flight' | 'cab';
  title: string;
  carrier: string;
  duration: string;
  departure: string;
  arrival: string;
  price: number;
  currency: string;
  badge: string;
  baggage: string;
  class: string;
}

export interface BookingExperience {
  id: string;
  destinationId: string;
  title: string;
  category: string;
  rating: number;
  reviews: number;
  duration: string;
  price: number;
  currency: string;
  image: string;
  badge: string;
}

export interface CartItem {
  id: string;
  type: 'hotel' | 'flight' | 'cab' | 'experience';
  title: string;
  subtitle: string;
  price: number;
  quantity: number;
  image?: string;
  badge?: string;
}

export interface ReservationConfirmation {
  id: string;
  bookingDate: string;
  status: string;
  tripId?: string;
  traveler: {
    name: string;
    email: string;
    phone: string;
  };
  items: CartItem[];
  pricing: {
    subtotal: number;
    tax: number;
    conciergeDiscount: number;
    total: number;
    currency: string;
  };
  payment: {
    method: string;
    last4: string;
    status: string;
  };
  supportContact: string;
}
