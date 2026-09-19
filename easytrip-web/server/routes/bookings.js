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
  const destLower = destination.toLowerCase();

  // Filter or return relevant options
  const matchingHotels = bookingsData.hotels.filter(h => 
    destLower.includes(h.destinationId) || destLower === ''
  );

  const matchingExperiences = bookingsData.experiences.filter(e => 
    destLower.includes(e.destinationId) || destLower === ''
  );

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
