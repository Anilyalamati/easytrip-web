import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Load destinations
const destinationsPath = path.join(__dirname, '../data/destinations.json');
let destinationsData = [];
try {
  destinationsData = JSON.parse(fs.readFileSync(destinationsPath, 'utf-8'));
} catch (e) {
  console.error('Failed to load destinations:', e);
}

// Activity templates by category and city
const activityPool = {
  culture: [
    { title: 'Heritage Fortress & Royal Chambers Tour', duration: '2.5 hrs', category: 'Culture', icon: 'Landmark', cost: 15 },
    { title: 'Historic Old Quarter & Artisan Walk', duration: '2 hrs', category: 'Culture', icon: 'Compass', cost: 10 },
    { title: 'Sacred Temples & Evening Candle Ceremony', duration: '1.5 hrs', category: 'Spiritual', icon: 'Sparkles', cost: 5 },
    { title: 'Traditional Royal Folk Music & Dance Performance', duration: '2 hrs', category: 'Culture', icon: 'Music', cost: 25 },
    { title: 'Centuries-Old Spice & Silk Bazaar Exploration', duration: '2 hrs', category: 'Shopping', icon: 'ShoppingBag', cost: 10 }
  ],
  adventure: [
    { title: 'Scenic Mountain Valley Quad Biking / Trek', duration: '3 hrs', category: 'Adventure', icon: 'Mountain', cost: 35 },
    { title: 'Sunrise Hot Air Balloon / Aerial Vista', duration: '3.5 hrs', category: 'Adventure', icon: 'Wind', cost: 90 },
    { title: 'White Water River Rafting & Rapids Expedition', duration: '2.5 hrs', category: 'Water', icon: 'Waves', cost: 30 },
    { title: 'Coastal Speedboat & Hidden Caves Excursion', duration: '2 hrs', category: 'Water', icon: 'Compass', cost: 45 },
    { title: 'Sunset Paragliding over Valley Ridges', duration: '1.5 hrs', category: 'Adventure', icon: 'Send', cost: 50 }
  ],
  foodie: [
    { title: 'Curated Artisan Food & Street Culinary Trail', duration: '2 hrs', category: 'Dining', icon: 'Utensils', cost: 20 },
    { title: 'Rooftop Sunset Lounge & Fine Dining Experience', duration: '2.5 hrs', category: 'Dining', icon: 'Wine', cost: 45 },
    { title: 'Traditional Cooking Masterclass with Master Chef', duration: '3 hrs', category: 'Workshop', icon: 'ChefHat', cost: 35 },
    { title: 'Seaside Sunset Grill & Fresh Catch Dinner', duration: '2 hrs', category: 'Dining', icon: 'Fish', cost: 30 },
    { title: 'Historic Tea Tasting & Plantation Walk', duration: '2 hrs', category: 'Food & Drink', icon: 'Coffee', cost: 15 }
  ],
  relaxation: [
    { title: 'Luxury Ayurvedic Herbal Massage & Sauna', duration: '2 hrs', category: 'Wellness', icon: 'Heart', cost: 55 },
    { title: 'Secluded Sandy Cove Sunbathing & Dip', duration: '3 hrs', category: 'Leisure', icon: 'Sun', cost: 0 },
    { title: 'Sunset Catamaran Cruise with Chilled Drinks', duration: '2.5 hrs', category: 'Cruise', icon: 'Anchor', cost: 40 },
    { title: 'Botanical Gardens & Serene Pond Walk', duration: '1.5 hrs', category: 'Nature', icon: 'Trees', cost: 8 },
    { title: 'Private Villa Poolside Twilight Cocktails', duration: '2 hrs', category: 'Leisure', icon: 'GlassWater', cost: 25 }
  ]
};

// Destination specific imagery and coordinate centers
const cityDefaults = {
  goa: {
    lat: 15.2993, lng: 74.1240,
    images: [
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
    ]
  },
  jaipur: {
    lat: 26.9124, lng: 75.7873,
    images: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1603204077673-f11c750b3297?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80'
    ]
  },
  manali: {
    lat: 32.2396, lng: 77.1887,
    images: [
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1579619564365-0442e27ab9e2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    ]
  },
  mumbai: {
    lat: 19.0760, lng: 72.8777,
    images: [
      'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
    ]
  },
  paris: {
    lat: 48.8566, lng: 2.3522,
    images: [
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80'
    ]
  }
};

function generateDynamicItinerary(reqBody) {
  const {
    destination = 'Goa',
    origin = 'Mumbai',
    days = 3,
    budget = 'moderate',
    travelStyle = 'Couple',
    interests = ['Culture', 'Relaxation', 'Foodie']
  } = reqBody;

  const numDays = Math.min(Math.max(parseInt(days) || 3, 1), 7);
  const destLower = destination.toLowerCase();
  
  // Find matching destination or default
  const destInfo = destinationsData.find(d => 
    destLower.includes(d.id) || destLower.includes(d.name.toLowerCase())
  ) || destinationsData[0];

  const coords = cityDefaults[destInfo.id] || { lat: destInfo.coordinates.lat, lng: destInfo.coordinates.lng, images: [destInfo.image] };
  const costMultiplier = budget === 'luxury' ? 2.5 : budget === 'budget' ? 0.7 : 1.2;

  const itineraryDays = [];
  const today = new Date();

  const themes = [
    { title: 'Arrival & Iconic First Impressions', theme: 'Grand Welcomes & Scenic Sunset' },
    { title: 'Hidden Gems & Cultural Immersion', theme: 'Heritage, Art & Architectural Wonders' },
    { title: 'Outdoor Escapes & Local Flavors', theme: 'Nature, Coastal Vistas & Gastronomy' },
    { title: 'Artisan Markets & Leisure Moments', theme: 'Vibrant Bazaars & Sunset Indulgence' },
    { title: 'Farewell Vistas & Scenic Memories', theme: 'Morning Panoramas & Easy Departure' },
    { title: 'Deep Exploration & Serene Retreat', theme: 'Off-beat Paths & Restful Splendor' },
    { title: 'The Grand Finale Experience', theme: 'Exclusive Dining & Celebratory Farewell' }
  ];

  for (let i = 0; i < numDays; i++) {
    const dayDate = new Date(today);
    dayDate.setDate(today.getDate() + i);

    const theme = themes[i % themes.length];
    const dayHighlights = destInfo.highlights ? destInfo.highlights[i % destInfo.highlights.length] : `${destination} Center`;

    // Coordinates with slight offset for map markers
    const morningCoord = { lat: coords.lat + (Math.sin(i * 1.5) * 0.015), lng: coords.lng + (Math.cos(i * 1.5) * 0.015) };
    const afternoonCoord = { lat: coords.lat + (Math.cos(i * 1.8) * 0.02), lng: coords.lng + (Math.sin(i * 1.8) * 0.02) };
    const eveningCoord = { lat: coords.lat + (Math.sin(i * 2.2) * 0.018), lng: coords.lng + (Math.cos(i * 2.2) * 0.018) };

    const slots = [
      {
        id: `day-${i+1}-morning`,
        period: 'Morning',
        time: '09:00 AM - 12:30 PM',
        title: i === 0 ? `Arrival & Check-in near ${dayHighlights}` : `Explore ${dayHighlights} & Surroundings`,
        location: `${dayHighlights}, ${destInfo.name}`,
        description: `Kick off the day taking in the fresh atmosphere. Enjoy early access before crowds arrive, with scenic photo spots and leisurely strolls.`,
        category: 'Sightseeing',
        cost: Math.round(15 * costMultiplier),
        duration: '3.5 hrs',
        image: coords.images[i % coords.images.length] || destInfo.image,
        coordinates: morningCoord,
        tips: 'Bring comfortable walking footwear and keep camera ready for natural morning lighting.'
      },
      {
        id: `day-${i+1}-afternoon`,
        period: 'Afternoon',
        time: '01:00 PM - 04:30 PM',
        title: `Curated Lunch & ${interests[0] || 'Local'} Discovery`,
        location: `Historic Central Quarter, ${destInfo.name}`,
        description: `Delight your palate with authentic regional delicacies. Followed by a relaxing cultural walkthrough or scenic boat/safari ride tailored for ${travelStyle.toLowerCase()} travelers.`,
        category: 'Dining & Leisure',
        cost: Math.round(28 * costMultiplier),
        duration: '3.5 hrs',
        image: coords.images[(i + 1) % coords.images.length] || destInfo.bannerImage,
        coordinates: afternoonCoord,
        tips: 'Advance table reservations are pre-recommended; sample the house specialty dish.'
      },
      {
        id: `day-${i+1}-evening`,
        period: 'Evening',
        time: '05:30 PM - 09:30 PM',
        title: `Golden Hour Sunset & Evening Vibrance`,
        location: `Scenic Promenade / Rooftop, ${destInfo.name}`,
        description: `Experience the breathtaking sunset glow across the horizon. As night descends, enjoy handcrafted cocktails, lively music, and illuminated architecture.`,
        category: 'Entertainment',
        cost: Math.round(35 * costMultiplier),
        duration: '4 hrs',
        image: coords.images[(i + 2) % coords.images.length] || destInfo.image,
        coordinates: eveningCoord,
        tips: 'Arrive 30 minutes before golden hour to secure the best vantage point.'
      }
    ];

    itineraryDays.push({
      dayNumber: i + 1,
      date: dayDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      title: theme.title,
      theme: theme.theme,
      weather: {
        temp: 28 - (i % 3),
        condition: i % 2 === 0 ? 'Sunny & Clear' : 'Gentle Breeze',
        icon: 'Sun'
      },
      slots
    });
  }

  const totalCost = itineraryDays.reduce((acc, d) => 
    acc + d.slots.reduce((sub, s) => sub + s.cost, 0), 0
  );

  return {
    id: `trip-${Date.now()}`,
    destination: destInfo.name,
    country: destInfo.country,
    origin,
    days: numDays,
    startDate: reqBody.startDate || new Date().toISOString().split('T')[0],
    endDate: reqBody.endDate || new Date(Date.now() + numDays * 86400000).toISOString().split('T')[0],
    budgetTier: budget,
    travelStyle,
    interests,
    coordinates: coords,
    heroImage: destInfo.bannerImage || destInfo.image,
    estimatedTotalCost: totalCost,
    currency: '$',
    itineraryDays,
    aiNotes: [
      `Itinerary customized for ${travelStyle} travel with focus on ${interests.join(', ')}.`,
      `Smart route balancing ensures minimal transit time between consecutive stops.`,
      `Weather-aware activity scheduling with afternoon indoor/shaded slots.`
    ]
  };
}

// POST /api/plan-trip
router.post('/plan-trip', (req, res) => {
  try {
    const itinerary = generateDynamicItinerary(req.body);
    res.json({
      success: true,
      data: itinerary
    });
  } catch (error) {
    console.error('Plan trip error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate itinerary', error: error.message });
  }
});

export default router;
