import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const bookingsPath = path.join(__dirname, '../data/bookings.json');

let bookingsData = { hotels: [], transport: [], experiences: [] };
try {
  bookingsData = JSON.parse(fs.readFileSync(bookingsPath, 'utf-8'));
} catch (e) {
  console.error('Failed to load bookings data:', e);
}

// In-memory confirmed bookings store
const confirmedReservations = [];

router.get('/options', (req, res) => {
  const { destination = '' } = req.query;
  const destCleaned = destination.trim();
  const destLower = destCleaned.toLowerCase();

  // Filter or return relevant options
  let matchingHotels = bookingsData.hotels.filter(h => 
    destLower && (destLower.includes(h.destinationId.toLowerCase()) || h.destinationId.toLowerCase().includes(destLower))
  );

  let matchingExperiences = bookingsData.experiences.filter(e => 
    destLower && (destLower.includes(e.destinationId.toLowerCase()) || e.destinationId.toLowerCase().includes(destLower))
  );

  const destDisplay = destCleaned ? destCleaned.charAt(0).toUpperCase() + destCleaned.slice(1) : 'Your Destination';
  const destId = destLower.replace(/\s+/g, '-');

  if (destCleaned && matchingHotels.length === 0) {
    matchingHotels = [
      {
        id: `h-${destId}-1`,
        destinationId: destId,
        name: `The Grand ${destDisplay} Palace & Resort`,
        type: 'Luxury 5-Star Waterfront Resort',
        rating: 4.9,
        reviews: 1180,
        pricePerNight: 210,
        currency: '$',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        amenities: ['Infinity Bay Pool', 'Fine Dining', 'Concierge Chauffeur', 'Wellness Spa', 'Ocean Views'],
        location: `Prime Bay District, ${destDisplay}`,
        badge: 'EasyTrip Luxury Pick'
      },
      {
        id: `h-${destId}-2`,
        destinationId: destId,
        name: `${destDisplay} Heritage Boutique Haven`,
        type: 'Boutique Coastal Retreat',
        rating: 4.8,
        reviews: 840,
        pricePerNight: 145,
        currency: '$',
        image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
        amenities: ['Sunset Terrace', 'Organic Breakfast', 'Artisan Lounge', 'Bicycle Rentals'],
        location: `Heritage Quarter, ${destDisplay}`,
        badge: 'Charming Escape'
      }
    ];
  }

  if (destCleaned && matchingExperiences.length === 0) {
    matchingExperiences = [
      {
        id: `exp-${destId}-1`,
        destinationId: destId,
        title: `Exclusive Private Guided Tour & Highlights of ${destDisplay}`,
        category: 'Culture & Sightseeing',
        rating: 4.9,
        reviews: 320,
        duration: '4 Hours',
        price: 65,
        currency: '$',
        image: 'https://images.unsplash.com/photo-1540946485038-a0c24cb4d271?auto=format&fit=crop&w=800&q=80',
        badge: 'Top Rated'
      },
      {
        id: `exp-${destId}-2`,
        destinationId: destId,
        title: `Sunset Coastal Cruise & Culinary Walk in ${destDisplay}`,
        category: 'Leisure & Dining',
        rating: 4.9,
        reviews: 460,
        duration: '3 Hours',
        price: 85,
        currency: '$',
        image: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=800&q=80',
        badge: 'Must Do'
      }
    ];
  }

  res.json({
    success: true,
    data: {
      hotels: matchingHotels.length > 0 ? matchingHotels : bookingsData.hotels,
      transport: bookingsData.transport,
      experiences: matchingExperiences.length > 0 ? matchingExperiences : bookingsData.experiences
    }
  });
});

router.post('/checkout', (req, res) => {
  const { items = [], traveler = {}, paymentMethod = 'credit-card', tripId } = req.body;

  if (!items.length) {
    return res.status(400).json({ success: false, message: 'Cart is empty' });
  }

  const reservationId = 'ET-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  const subtotal = items.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0);
  const tax = Math.round(subtotal * 0.12);
  const conciergeDiscount = Math.round(subtotal * 0.05);
  const total = subtotal + tax - conciergeDiscount;

  const reservation = {
    id: reservationId,
    bookingDate: new Date().toISOString(),
    status: 'CONFIRMED',
    tripId,
    traveler: {
      name: traveler.name || 'EasyTrip Explorer',
      email: traveler.email || 'explorer@easytrip.com',
      phone: traveler.phone || '+1 (555) 019-2831'
    },
    items,
    pricing: {
      subtotal,
      tax,
      conciergeDiscount,
      total,
      currency: '$'
    },
    payment: {
      method: paymentMethod,
      last4: '4242',
      status: 'PAID'
    },
    supportContact: 'concierge@easytrip.com (24/7 Priority Support)'
  };

  confirmedReservations.push(reservation);

  res.json({
    success: true,
    message: 'Booking confirmed successfully',
    data: reservation
  });
});

export default router;
