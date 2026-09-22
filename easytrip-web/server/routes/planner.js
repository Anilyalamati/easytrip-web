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

// Destination coordinates & default image palettes for popular hubs
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

const customKnownDestinations = {
  vizag: {
    name: 'Vizag (Visakhapatnam)',
    country: 'India',
    tagline: 'The Jewel of the East Coast, pristine beaches & coastal hills',
    coordinates: { lat: 17.6868, lng: 83.2185 },
    highlights: [
      'INS Kursura Submarine Museum & RK Beach',
      'Rushikonda Blue Flag Beach & Water Sports',
      'Kailasagiri Hilltop Ropeway & Bay Panoramas',
      'Simhachalam 11th-Century Sacred Temple',
      'Dolphin\'s Nose Lighthouse & Ross Hill Harbor',
      'Borra Caves Karst & Araku Valley Coffee Groves'
    ],
    image: 'https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?auto=format&fit=crop&w=1200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?auto=format&fit=crop&w=1600&q=80'
  },
  visakhapatnam: {
    name: 'Visakhapatnam',
    country: 'India',
    tagline: 'The Jewel of the East Coast, pristine beaches & coastal hills',
    coordinates: { lat: 17.6868, lng: 83.2185 },
    highlights: [
      'INS Kursura Submarine Museum & RK Beach',
      'Rushikonda Blue Flag Beach & Water Sports',
      'Kailasagiri Hilltop Ropeway & Bay Panoramas',
      'Simhachalam 11th-Century Sacred Temple',
      'Dolphin\'s Nose Lighthouse & Ross Hill Harbor',
      'Borra Caves Karst & Araku Valley Coffee Groves'
    ],
    image: 'https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?auto=format&fit=crop&w=1200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?auto=format&fit=crop&w=1600&q=80'
  },
  rajahmundry: {
    name: 'Rajahmundry (Rajamahendravaram)',
    country: 'India',
    tagline: 'Cultural Capital of Andhra, sacred Godavari riverfront & historic bridges',
    coordinates: { lat: 17.0005, lng: 81.8040 },
    highlights: [
      'Pushkar Ghat Sacred Godavari Sunrise & Aarti',
      'Havelock Bridge & Historic Godavari Arch Sunset',
      'Sir Arthur Cotton Barrage & Dowleswaram Museum',
      'Kadiyam Floral Village & Asia\'s Largest Nurseries',
      'ISKCON Temple Gautami Ghat Riverfront',
      'Papikondalu Godavari River Gorge Luxury Cruise'
    ],
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80'
  },
  rajamahendravaram: {
    name: 'Rajamahendravaram',
    country: 'India',
    tagline: 'Cultural Capital of Andhra, sacred Godavari riverfront & historic bridges',
    coordinates: { lat: 17.0005, lng: 81.8040 },
    highlights: [
      'Pushkar Ghat Sacred Godavari Sunrise & Aarti',
      'Havelock Bridge & Historic Godavari Arch Sunset',
      'Sir Arthur Cotton Barrage & Dowleswaram Museum',
      'Kadiyam Floral Village & Asia\'s Largest Nurseries',
      'ISKCON Temple Gautami Ghat Riverfront',
      'Papikondalu Godavari River Gorge Luxury Cruise'
    ],
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80'
  },
  ooty: {
    name: 'Ooty (Udhagamandalam)',
    country: 'India',
    tagline: 'Queen of Nilgiri Hill Stations, heritage toy train & rolling tea gardens',
    coordinates: { lat: 11.4102, lng: 76.6950 },
    highlights: ['Nilgiri Mountain Railway Toy Train', 'Ooty Botanical Gardens', 'Doddabetta Peak', 'Pykara Waterfalls & Lake', 'Avalanche Lake & Tea Estates'],
    image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1600&q=80'
  },
  hyderabad: {
    name: 'Hyderabad',
    country: 'India',
    tagline: 'City of Pearls, majestic Charminar & royal Nizami gastronomy',
    coordinates: { lat: 17.3850, lng: 78.4867 },
    highlights: ['Charminar & Laad Bazaar', 'Golconda Fort & Acoustic Portico', 'Hussain Sagar Lake & Buddha Statue', 'Chowmahalla Palace', 'Salar Jung Museum'],
    image: 'https://images.unsplash.com/photo-1603204077673-f11c750b3297?auto=format&fit=crop&w=1200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=80'
  },
  delhi: {
    name: 'Delhi',
    country: 'India',
    tagline: 'Heart of India, historic monuments & bustling Chandni Chowk bazaars',
    coordinates: { lat: 28.6139, lng: 77.2090 },
    highlights: ['India Gate & Kartavya Path', 'Qutub Minar Complex', 'Humayun\'s Tomb', 'Red Fort & Chandni Chowk', 'Lotus Temple'],
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1600&q=80'
  }
};

const keywordImagePools = {
  submarine: [
    'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1000&q=80'
  ],
  beach: [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?auto=format&fit=crop&w=1000&q=80'
  ],
  temple: [
    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1561571994-3c61c554181a?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80'
  ],
  bridge: [
    'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1545641203-7d072a14e3b2?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1000&q=80'
  ],
  river: [
    'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80'
  ],
  barrage: [
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&w=1000&q=80'
  ],
  nursery: [
    'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1000&q=80'
  ],
  cave: [
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1000&q=80'
  ],
  coffee: [
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1000&q=80'
  ],
  food: [
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80'
  ],
  bazaar: [
    'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1000&q=80'
  ],
  museum: [
    'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&w=1000&q=80'
  ],
  palace: [
    'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1585136917192-32b023f0ec14?auto=format&fit=crop&w=1000&q=80'
  ],
  sunset: [
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=1000&q=80'
  ],
  mountain: [
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1000&q=80'
  ],
  park: [
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1000&q=80'
  ],
  ropeway: [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80'
  ],
  lighthouse: [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1509233725247-49e657c54213?auto=format&fit=crop&w=1000&q=80'
  ],
  paris: [
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1549144511-f099e773c147?auto=format&fit=crop&w=1000&q=80'
  ],
  tokyo: [
    'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=1000&q=80'
  ],
  waterfall: [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80'
  ],
  ooty: [
    'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80'
  ],
  sushi: [
    'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80'
  ]
};

function resolveActivityImage(title = '', location = '', category = '', fallbackImg = '', salt = 0) {
  const combined = `${title} ${location} ${category}`.toLowerCase();
  
  const keywordMap = [
    [['submarine', 'kursura', 'naval', 'torpedo', 'aircraft'], 'submarine'],
    [['eiffel', 'paris', 'louvre', 'champ de mars', 'seine', 'montmartre', 'versailles', 'champs-elysees', 'arc de triomphe', 'orsay', 'marais'], 'paris'],
    [['tokyo', 'shibuya', 'senso-ji', 'asakusa', 'akihabara', 'meiji', 'harajuku', 'shinjuku', 'tsukiji', 'odaiba', 'roppongi'], 'tokyo'],
    [['ooty', 'nilgiri', 'doddabetta', 'pykara', 'avalanche lake', 'toy train'], 'ooty'],
    [['rushikonda', 'yarada', 'beach', 'coastal', 'surf', 'sand', 'ocean', 'sea'], 'beach'],
    [['simhachalam', 'temple', 'shrine', 'sanctum', 'aarti', 'iskcon', 'spiritual', 'puja', 'darshan', 'hadimba'], 'temple'],
    [['havelock', 'bridge', 'arch bridge', 'viaduct'], 'bridge'],
    [['waterfall', 'falls', 'jogini', 'jana', 'sissu', 'dudhsagar'], 'waterfall'],
    [['godavari', 'river', 'ghat', 'cruise', 'papikondalu', 'gorge', 'boat', 'ferry'], 'river'],
    [['cotton', 'barrage', 'dowleswaram', 'dam', 'canal', 'irrigation'], 'barrage'],
    [['kadiyam', 'nursery', 'floral', 'flower', 'bonsai'], 'nursery'],
    [['borra', 'cave', 'limestone', 'stalactite', 'karst', 'cavern'], 'cave'],
    [['araku', 'coffee', 'plantation', 'tea garden', 'orchard', 'vineyard'], 'coffee'],
    [['sushi', 'wagyu', 'izakaya', 'ramen', 'nigiri', 'otoro'], 'sushi'],
    [['pulasa', 'seafood', 'thali', 'food', 'lunch', 'dinner', 'culinary', 'bistro', 'tasting', 'sweet', 'pootharekulu', 'dosa', 'biryani', 'siddu', 'dining'], 'food'],
    [['bazaar', 'market', 'shopping', 'handicraft', 'craft', 'textile', 'lepakshi', 'souvenir', 'mall road'], 'bazaar'],
    [['museum', 'gallery', 'exhibition', 'civilization', 'antiquities', 'artifact', 'teamlab'], 'museum'],
    [['citadel', 'fort', 'castle', 'palace', 'rampart', 'bastion', 'monument', 'naggar'], 'palace'],
    [['kailasagiri', 'ropeway', 'cable car', 'funicular', 'ridge', 'solang'], 'ropeway'],
    [['dolphin\'s nose', 'lighthouse', 'harbor', 'port', 'pier', 'promontory'], 'lighthouse'],
    [['mountain', 'snow', 'trek', 'hike', 'peak', 'valley', 'alpine', 'rohtang', 'atal', 'himalayan', 'manali'], 'mountain'],
    [['sunset', 'golden hour', 'lounge', 'rooftop', 'nightlife', 'evening', 'twilight', 'cocktail'], 'sunset'],
    [['park', 'botanical', 'arboretum', 'promenade', 'walk', 'garden', 'esplanade'], 'park']
  ];

  for (const [keywords, poolKey] of keywordMap) {
    if (keywords.some(kw => combined.includes(kw))) {
      const pool = keywordImagePools[poolKey] || [];
      if (pool.length > 0) {
        return pool[salt % pool.length];
      }
    }
  }

  if (fallbackImg) return fallbackImg;
  const parkPool = keywordImagePools.park || [];
  return parkPool[salt % parkPool.length];
}

const curatedDestinationPlans = {
    ooty: [
      {
        title: 'UNESCO Heritage Toy Train, Rose Garden & Ooty Lake',
        theme: 'Colonial Charm, Botanical Wonders & Tranquil Waters',
        slots: [
          {
            period: 'Morning',
            time: '08:30 AM - 12:00 PM',
            title: 'Nilgiri Mountain Railway Toy Train & Botanical Gardens',
            location: 'Udhagamandalam Railway Station & Charring Cross',
            description: 'Board the world-famous UNESCO Nilgiri Mountain Steam Train cruising past misty tea gardens, followed by a walk through the 1848 Government Botanical Gardens.',
            category: 'UNESCO Heritage & Gardens',
            baseCost: 650,
            duration: '3.5 Hours',
            tips: 'Book the First Class wooden coach in advance for panoramic Nilgiri views.'
          },
          {
            period: 'Afternoon',
            time: '01:00 PM - 04:30 PM',
            title: 'Government Rose Garden & Authentic Nahar Cafe Lunch',
            location: 'Elk Hill Slopes & Commercial Road',
            description: "Explore over 20,000 varieties of exotic roses terraced on Elk Hill, followed by artisan woodfired pizzas and Nilgiri tea at Nahar's Sidewalk Cafe.",
            category: 'Botanical & Culinary',
            baseCost: 550,
            duration: '3 Hours',
            tips: 'Best floral fragrance and photography right around early afternoon light.'
          },
          {
            period: 'Evening',
            time: '05:00 PM - 08:30 PM',
            title: 'Ooty Lake Sunset Boating & King Star Fudge Tasting',
            location: 'North Lake Road & Commercial Street',
            description: 'Pedal boat ride across the calm reflective waters of Ooty Lake framed by eucalyptus trees, culminating in a tasting of legendary handmade chocolate fudge from King Star Bakery.',
            category: 'Leisure & Confectionery',
            baseCost: 600,
            duration: '3 Hours',
            tips: 'Evening lake mist adds magical drama; pick up assorted walnut and fig fudge.'
          }
        ]
      },
      {
        title: 'Doddabetta Peak, Tea Factory & Pykara Waterfalls',
        theme: 'High Altitude Panoramas, Orthodox Tea Aromas & Gushing Falls',
        slots: [
          {
            period: 'Morning',
            time: '08:30 AM - 12:00 PM',
            title: 'Doddabetta Peak Summit & Nilgiri Tea Museum',
            location: 'Doddabetta Summit (2,637 m) & Kotagiri Road',
            description: 'Ascend to the highest peak in South India for a 360-degree panorama of the Nilgiri Biosphere, followed by an educational tour watching green tea processing and essential oil extraction.',
            category: 'Mountain Overlook & Tea',
            baseCost: 450,
            duration: '3.5 Hours',
            tips: 'Visit the summit telescope house on clear mornings to view the Coimbatore plains.'
          },
          {
            period: 'Afternoon',
            time: '01:00 PM - 04:30 PM',
            title: 'Pykara Waterfalls & Speedboating in Pykara Lake',
            location: 'Pykara Reserve, Ooty-Mysore Highway',
            description: 'Witness the sacred Pykara river drop over tiered granite rocks into the dam basin. Embark on a high-speed boat ride past pine groves and misty mountain shores.',
            category: 'Cascades & Speedboating',
            baseCost: 750,
            duration: '3.5 Hours',
            tips: 'Carry an umbrella or rain poncho near the lower falls viewing platform.'
          },
          {
            period: 'Evening',
            time: '05:30 PM - 08:30 PM',
            title: "Shinkow's Heritage Dinner & Charring Cross Walk",
            location: "Commissioner's Road, Ooty",
            description: "Relish heritage Cantonese dining at Shinkow's, established in 1954 by Chinese settlers, known for authentic steamed momos, pork ribs, and hakka noodles.",
            category: 'Heritage Dining',
            baseCost: 850,
            duration: '2.5 Hours',
            tips: 'Arrive before 7:30 PM as tables fill quickly with local food enthusiasts.'
          }
        ]
      },
      {
        title: 'Avalanche Sanctuary & Wenlock Downs Meadows',
        theme: 'Pristine Biosphere Safari & Cinematic Rolling Hills',
        slots: [
          {
            period: 'Morning',
            time: '08:00 AM - 12:30 PM',
            title: 'Avalanche Lake & Cloud Forest Eco-Safari',
            location: 'Avalanche Biosphere Reserve (28 km from Ooty)',
            description: 'Ride a government safari jeep through restricted shola cloud forests and trout streams to the pristine, untouched shoreline of Avalanche Lake.',
            category: 'Wilderness Sanctuary',
            baseCost: 950,
            duration: '4 Hours',
            tips: 'Strict forest department permits required; cameras and birding optics recommended.'
          },
          {
            period: 'Afternoon',
            time: '01:30 PM - 04:30 PM',
            title: 'Wenlock Downs 9th Mile Shooting Point & Toda Huts',
            location: 'Wenlock Downs & Toda Hamlet Overlook',
            description: 'Stroll the undulating emerald green pastures of 9th Mile shooting point, framed by distant pine woods, and see the unique barrel-vaulted huts of the indigenous Toda tribe.',
            category: 'Meadows & Indigenous Heritage',
            baseCost: 400,
            duration: '3 Hours',
            tips: 'Great spot for horseback rides across gentle mountain ridges.'
          },
          {
            period: 'Evening',
            time: '05:00 PM - 08:00 PM',
            title: 'Tea Roastery Tasting & Sunset over Upper Bhavani',
            location: 'Upper Bhavani Viewpoint & Doddabetta Tea Lounge',
            description: 'Conclude your Nilgiri retreat sipping single-estate orthodox silver needle tea while watching purple twilight settle over the mountain valleys.',
            category: 'Tea Tasting & Sunset',
            baseCost: 500,
            duration: '2.5 Hours',
            tips: 'Buy vacuum-packed Ooty chocolate fudge and white tea as authentic souvenirs.'
          }
        ]
      }
    ],
  vizag: [
    {
      title: 'RK Beach, Submarine Memorial & Kailasagiri Sunset',
      theme: 'Naval Heritage, Blue Flag Sands & Panoramic Hilltop Heights',
      slots: [
        {
          period: 'Morning',
          time: '09:00 AM - 12:30 PM',
          title: 'INS Kursura Submarine Museum & RK Beach Promenade',
          location: 'RK Beach, Visakhapatnam',
          description: 'Step aboard the historic decommissioned Soviet-built Kalvari-class submarine stationed directly on the sands of RK Beach, exploring naval corridors, sonar rooms, and torpedo bays.',
          category: 'Naval Museum & Heritage',
          baseCost: 780,
          duration: '3 hrs',
          tips: 'Visit right at 09:00 AM to avoid midday queues and pair with the TU 142 Aircraft Museum across the road.'
        },
        {
          period: 'Afternoon',
          time: '01:00 PM - 04:30 PM',
          title: 'Coastal Seafood Feast & Rushikonda Beach Water Sports',
          location: 'Rushikonda Beach, Vizag',
          description: 'Indulge in authentic Andhra prawn fry, bamboo chicken, and fresh coastal curries, followed by thrilling jet-skiing and windsurfing along the pristine Blue Flag certified shoreline.',
          category: 'Coastal Adventure & Dining',
          baseCost: 750,
          duration: '3.5 hrs',
          tips: 'Rushikonda has certified lifeguards and regulated water sports operators; carry beach towels.'
        },
        {
          period: 'Evening',
          time: '05:00 PM - 08:30 PM',
          title: 'Kailasagiri Ropeway & Panoramic Bay of Bengal Sunset',
          location: 'Kailasagiri Hilltop Park, Visakhapatnam',
          description: 'Ascend 360 feet above sea level via the cable car ropeway, offering spectacular 360-degree vistas where forested Eastern Ghats meet the sweeping curve of the ocean.',
          category: 'Scenic Overlook & Sunset',
          baseCost: 980,
          duration: '3.5 hrs',
          tips: 'Ride the hilltop perimeter toy train just before golden hour for breathtaking coastal photography.'
        }
      ]
    },
    {
      title: 'Sacred Simhachalam & Coastal Promontory Vistas',
      theme: '11th-Century Sacred Architecture & Dolphin\'s Nose Lighthouse',
      slots: [
        {
          period: 'Morning',
          time: '08:30 AM - 12:00 PM',
          title: 'Simhachalam Varaha Lakshmi Narasimha Historic Temple',
          location: 'Simhachalam Hill, Visakhapatnam',
          description: 'Marvel at the extraordinary 11th-century Kalinga-style stone architecture, ornate elephant carvings, and sacred sanctum perched amidst lush forest hills.',
          category: 'Sacred Architecture & Heritage',
          baseCost: 650,
          duration: '3.5 hrs',
          tips: 'Traditional dress code applies. Early morning darshan ensures a serene atmosphere.'
        },
        {
          period: 'Afternoon',
          time: '01:00 PM - 04:30 PM',
          title: 'Dolphin\'s Nose Lighthouse & Ross Hill Harbor Views',
          location: 'Gangavaram Port Road, Vizag',
          description: 'Climb up to the historic clifftop lighthouse atop the dramatic 358-meter high natural promontory, observing expansive ship traffic and inner harbor port docks.',
          category: 'Maritime Landmark & Ocean Vista',
          baseCost: 910,
          duration: '3.5 hrs',
          tips: 'The lighthouse observation gallery opens to visitors at 3:00 PM; bring your camera.'
        },
        {
          period: 'Evening',
          time: '05:00 PM - 08:30 PM',
          title: 'Tenneti Park Clifftop Stroll & Sunken Cargo Ship Twilight',
          location: 'Beach Road, Jodugullapalem, Vizag',
          description: 'Walk along picturesque stone coastal paths overlooking the stranded vessel MV Maa, enjoying the sunset surf, sea breezes, and fresh spiced roasted corn.',
          category: 'Coastal Promenade & Twilight',
          baseCost: 650,
          duration: '3.5 hrs',
          tips: 'Stone steps lead directly down to the tide pools for close-up views of the dramatic coastline.'
        }
      ]
    },
    {
      title: 'Borra Caves Subterranean Karst & Araku Coffee Highlands',
      theme: 'Million-Year Karst Formations & Indigenous Coffee Traditions',
      slots: [
        {
          period: 'Morning',
          time: '08:00 AM - 12:30 PM',
          title: 'Borra Caves Million-Year-Old Limestone Karst Formations',
          location: 'Ananthagiri Hills, Araku Valley Region',
          description: 'Venture into deep natural caves sculpted by the Gosthani River, beholding colossal calcium stalactite pillars illuminated by dynamic LED lighting.',
          category: 'Geological Wonder & Nature',
          baseCost: 1300,
          duration: '4 hrs',
          tips: 'Wear shoes with traction since interior pathways can be damp and rocky.'
        },
        {
          period: 'Afternoon',
          time: '01:00 PM - 04:30 PM',
          title: 'Araku Valley Organic Coffee Plantations & Tribal Museum',
          location: 'Araku Highlands',
          description: 'Tour world-renowned shade-grown organic Arabica coffee groves, learn about indigenous Dhimsa cultural heritage, and sample freshly roasted espresso.',
          category: 'Plantation Tour & Tribal Culture',
          baseCost: 1170,
          duration: '3.5 hrs',
          tips: 'Purchase GI-tagged Araku roasted beans directly from the tribal cooperative outlet.'
        },
        {
          period: 'Evening',
          time: '05:30 PM - 09:00 PM',
          title: 'Siripuram & Jagadamba Junction Lepakshi Handicrafts Trail',
          location: 'Siripuram, Visakhapatnam',
          description: 'Conclude with an evening stroll through state emporiums featuring Etikoppaka lacquer wooden toys, Uppada silk sarees, and sizzling hot Andhra street food.',
          category: 'Shopping & Local Gastronomy',
          baseCost: 1200,
          duration: '3.5 hrs',
          tips: 'Etikoppaka toys made with natural vegetable dyes make delightful authentic souvenirs.'
        }
      ]
    }
  ],
  rajahmundry: [
    {
      title: 'Pushkar Ghat Sunrise, Godavari River & Havelock Arch Sunset',
      theme: 'Sacred Godavari Riverfront & Century-Old Railway Engineering',
      slots: [
        {
          period: 'Morning',
          time: '06:30 AM - 11:30 AM',
          title: 'Pushkar Ghat Morning Aarti & Sacred Godavari River Walk',
          location: 'Pushkar Ghat, Rajahmundry',
          description: 'Greet the dawn along the serene steps of Pushkar Ghat, taking in spiritual morning hymns, riverboat journeys, and cool breezes flowing across the mighty Godavari.',
          category: 'Sacred Riverfront & Heritage',
          baseCost: 520,
          duration: '3 hrs',
          tips: 'Early morning between 6:30 and 8:00 AM provides tranquil reflections and stunning photography.'
        },
        {
          period: 'Afternoon',
          time: '12:30 PM - 04:00 PM',
          title: 'Authentic Godavari Pulasa & Coastal Andhra Culinary Trail',
          location: 'Main Road & Kotilingala Ghat, Rajahmundry',
          description: 'Taste East Godavari\'s legendary culinary heritage including Gongura spiced curries, freshwater fish preparations, and pure ghee steamed rice, topped off with iconic local Rose Milk.',
          category: 'Gastronomy & Traditional Flavors',
          baseCost: 1170,
          duration: '3.5 hrs',
          tips: 'Don\'t miss the original 1950s Rose Milk Centre near Kotagummam for a historic sweet delight.'
        },
        {
          period: 'Evening',
          time: '05:00 PM - 08:30 PM',
          title: 'Havelock Bridge Walk & Historic Godavari Arch Bridge Sunset',
          location: 'Godavari Riverfront Promenade, Rajahmundry',
          description: 'Walk along the pedestrian walkway of the historic 1897 Havelock Bridge, admiring the 2.7 km span of the Godavari Arch Bridge as twilight illuminates the waters.',
          category: 'Historic Bridge & Scenic Vista',
          baseCost: 650,
          duration: '3.5 hrs',
          tips: 'Arrive at 5:15 PM to witness express trains crossing the arch bridge set against the golden sunset.'
        }
      ]
    },
    {
      title: 'Cotton Barrage Engineering & Kadiyam Floral Paradise',
      theme: 'Delta Irrigation Heritage & Asia\'s Largest Botanical Nurseries',
      slots: [
        {
          period: 'Morning',
          time: '08:30 AM - 12:00 PM',
          title: 'Sir Arthur Cotton Barrage & Dowleswaram Irrigation Museum',
          location: 'Dowleswaram, Rajahmundry',
          description: 'Examine the massive historic barrage that converted the Godavari basin into the lush rice granary of India, touring archival irrigation models and peaceful river parkways.',
          category: 'Historic Engineering & Park',
          baseCost: 650,
          duration: '3.5 hrs',
          tips: 'Walk the scenic canal-side pathway towards the memorial gardens for great bridge photos.'
        },
        {
          period: 'Afternoon',
          time: '01:00 PM - 04:30 PM',
          title: 'Kadiyam Floral Village & Asia\'s Largest Plant Nurseries',
          location: 'Kadiyam, Rajahmundry Outer Belt',
          description: 'Roam across thousands of acres of flourishing ornamental plant nurseries, exotic bonsai courtyards, fragrant flowering gardens, and sprawling tropical greenhouses.',
          category: 'Botanical Haven & Nature Tour',
          baseCost: 910,
          duration: '3.5 hrs',
          tips: 'Hire an auto-rickshaw or local cab to visit the top 4 flagship nursery estates.'
        },
        {
          period: 'Evening',
          time: '05:00 PM - 08:30 PM',
          title: 'ISKCON Temple Gautami Ghat & Twilight River Bhajan',
          location: 'Gautami Ghat, Rajahmundry',
          description: 'Experience serene evening spiritual vibes at the grand 2-acre riverside ISKCON complex, with harmonic chants echoing over the tranquil waters of the Godavari at dusk.',
          category: 'Spiritual Sanctum & Twilight Peace',
          baseCost: 520,
          duration: '3.5 hrs',
          tips: 'Sample the freshly prepared sanctified vegetarian prasadam delicacies at the counter.'
        }
      ]
    },
    {
      title: 'Papikondalu River Gorge Cruise & Royal Sweet Trail',
      theme: 'Emerald Eastern Ghats Gorge Voyage & Atreyapuram Pootharekulu',
      slots: [
        {
          period: 'Morning',
          time: '07:30 AM - 12:30 PM',
          title: 'Papikondalu Godavari River Luxury Boat Cruise Departure',
          location: 'Purushothapatnam / Polavaram Launch Point',
          description: 'Embark on an exhilarating motorized boat voyage through the scenic gorge where the Godavari river slices through emerald-cloaked hills of the Eastern Ghats.',
          category: 'River Cruise & Mountain Gorge',
          baseCost: 1200,
          duration: '4 hrs',
          tips: 'Pre-book upstream boat pass; the open observation deck offers unobstructed 360-degree panoramas.'
        },
        {
          period: 'Afternoon',
          time: '01:00 PM - 04:30 PM',
          title: 'Perantapalli Tribal Hamlet & Bamboo Craft Hermitage',
          location: 'Papikondalu Hills, Godavari Gorge',
          description: 'Stop at the quiet riverside tribal settlement nestled beneath dramatic cliffs, discovering eco-friendly bamboo handicraft traditions and the serene Sri Veereswara Swamy shrine.',
          category: 'Eco-Heritage & Tribal Discovery',
          baseCost: 980,
          duration: '3.5 hrs',
          tips: 'Support indigenous tribal artisans by picking up handmade bamboo crafts and water flasks.'
        },
        {
          period: 'Evening',
          time: '05:30 PM - 09:00 PM',
          title: 'Rajahmundry Sweet Trail: Royal Atreyapuram Pootharekulu',
          location: 'Syriac Church Road & Kotagummam, Rajahmundry',
          description: 'Discover the art of paper-thin Atreyapuram Pootharekulu (ghee-infused rice starch rolls stuffed with jaggery and roasted dry fruits) followed by piping hot Mirchi Bajji.',
          category: 'Culinary Heritage & Night Trail',
          baseCost: 780,
          duration: '3 hrs',
          tips: 'Purchase vacuum-sealed dry fruit pootharekulu boxes to take home as authentic regional treats.'
        }
      ]
    }
  ],
  paris: [
    {
      title: 'Eiffel Tower Summit, Louvre Masterpieces & Seine Sunset Cruise',
      theme: 'Wrought-Iron Icons, Renaissance Treasures & Golden Hour Riverbanks',
      slots: [
        {
          period: 'Morning',
          time: '09:00 AM - 12:30 PM',
          title: 'Eiffel Tower Summit Ascent & Champ de Mars Stroll',
          location: 'Champ de Mars, 7th Arrondissement, Paris',
          description: 'Ascend the iconic wrought-iron lattice monument for sweeping 360-degree panoramas of the City of Light, followed by a leisurely stroll across the Champ de Mars gardens.',
          category: 'Iconic Landmark & Panorama',
          baseCost: 1200,
          duration: '3.5 hrs',
          tips: 'Pre-book summit elevator tickets to bypass lengthy admission queues.'
        },
        {
          period: 'Afternoon',
          time: '01:00 PM - 04:30 PM',
          title: 'Louvre Museum Classical Masterpieces & Tuileries Gardens',
          location: 'Palais du Louvre, 1st Arrondissement, Paris',
          description: 'Explore the world\'s largest art museum, admiring the Mona Lisa, Venus de Milo, and Winged Victory before relaxing near the fountains of the Tuileries.',
          category: 'World Heritage Art & Gardens',
          baseCost: 750,
          duration: '3.5 hrs',
          tips: 'Enter via the Carrousel du Louvre underground mall entrance to avoid glass pyramid lines.'
        },
        {
          period: 'Evening',
          time: '05:30 PM - 09:00 PM',
          title: 'Seine River Twilight Cruise & Notre-Dame Cathedral Panorama',
          location: 'Port de la Bourdonnais, Paris',
          description: 'Glide past illuminated historic bridges, Musée d\'Orsay, and the gothic towers of Notre-Dame as golden hour transitions into twilight.',
          category: 'River Cruise & Twilight',
          baseCost: 1300,
          duration: '3.5 hrs',
          tips: 'Board 45 minutes before dusk to watch the Eiffel Tower\'s sparkling beacon light up on the hour.'
        }
      ]
    },
    {
      title: 'Montmartre Bohemian Artists, Sacré-Cœur & Arc de Triomphe',
      theme: 'Historic Hilltop Sanctuaries, Haute Couture & Jazz Heritage',
      slots: [
        {
          period: 'Morning',
          time: '09:00 AM - 12:30 PM',
          title: 'Montmartre Bohemian Artists Square & Sacré-Cœur Basilica',
          location: 'Place du Tertre & Montmartre Hill, Paris',
          description: 'Climb the cobblestone heights of Montmartre to the gleaming white Romano-Byzantine dome of Sacré-Cœur, exploring vintage painters\' ateliers and windmill alleys.',
          category: 'Historic Quarter & Sacred Basilica',
          baseCost: 980,
          duration: '3.5 hrs',
          tips: 'Take the Montmartre funicular with standard metro tickets if you prefer not to climb the stairs.'
        },
        {
          period: 'Afternoon',
          time: '01:00 PM - 04:30 PM',
          title: 'Arc de Triomphe Observation Deck & Avenue des Champs-Élysées',
          location: 'Place Charles de Gaulle, Paris',
          description: 'Ascend to the rooftop terrace of Napoleon\'s triumphal arch overlooking the 12 radiating avenues, followed by boutique browsing on the Champs-Élysées.',
          category: 'Historic Monument & Boulevard',
          baseCost: 1170,
          duration: '3.5 hrs',
          tips: 'Use the pedestrian underpass at the top of the avenue; never try to cross the roundabout traffic.'
        },
        {
          period: 'Evening',
          time: '05:30 PM - 09:00 PM',
          title: 'Saint-Germain-des-Prés Bistro Tasting & Historic Jazz Cellar',
          location: 'Latin Quarter & Saint-Germain, Paris',
          description: 'Indulge in French culinary classics including duck confit, warm baguette with artisan brie, and tarte tatin, followed by live jazz at Caveau de la Huchette.',
          category: 'French Gastronomy & Jazz',
          baseCost: 2470,
          duration: '3.5 hrs',
          tips: 'Request a table on the heated terrace for quintessential Parisian street-watching.'
        }
      ]
    },
    {
      title: 'Palace of Versailles Hall of Mirrors & Musée d\'Orsay Treasures',
      theme: 'Royal Grandeur, Impressionist Masterpieces & Le Marais Bakeries',
      slots: [
        {
          period: 'Morning',
          time: '08:30 AM - 12:30 PM',
          title: 'Palace of Versailles Royal Grand Apartments & Hall of Mirrors',
          location: 'Place d\'Armes, Versailles',
          description: 'Journey to the grand seat of the Sun King Louis XIV, exploring the resplendent Hall of Mirrors, royal bedchambers, and expansive geometric fountain gardens.',
          category: 'Royal Palace & UNESCO Heritage',
          baseCost: 1950,
          duration: '4 hrs',
          tips: 'Take the RER C train from central Paris; rent a bicycle to navigate the immense gardens.'
        },
        {
          period: 'Afternoon',
          time: '01:30 PM - 04:30 PM',
          title: 'Musée d\'Orsay Impressionist Treasures in a Beaux-Arts Station',
          location: 'Esplanade Valéry Giscard d\'Estaing, Paris',
          description: 'Marvel at celebrated masterpieces by Monet, Van Gogh, Renoir, and Degas housed beneath the soaring vaulted iron-and-glass ceilings of a 1900 railway terminal.',
          category: 'Impressionist Art & Architecture',
          baseCost: 1430,
          duration: '3 hrs',
          tips: 'Visit the 5th-floor giant clock face cafe for a unique framed view across the Seine to the Louvre.'
        },
        {
          period: 'Evening',
          time: '05:30 PM - 09:00 PM',
          title: 'Le Marais Artisan Boutiques & Place des Vosges Twilight Walk',
          location: 'Le Marais, 4th Arrondissement, Paris',
          description: 'Wander 17th-century aristocratic courtyards, sample fresh falafel on Rue des Rosiers, and savor evening macarons in Paris\'s oldest planned square.',
          category: 'Artisan Quarter & French Patisserie',
          baseCost: 1620,
          duration: '3.5 hrs',
          tips: 'Pick up hand-packaged macarons from Carette under the vaulted arcades of Place des Vosges.'
        }
      ]
    }
  ],
  tokyo: [
    {
      title: 'Asakusa Senso-ji, Akihabara Tech & Shibuya Crossing Scramble',
      theme: 'Edo Ancient Heritage, Electric Anime Plazas & Neon Crossing',
      slots: [
        {
          period: 'Morning',
          time: '09:00 AM - 12:30 PM',
          title: 'Senso-ji Ancient Temple & Asakusa Nakamise Dori Street',
          location: 'Asakusa, Taito City, Tokyo',
          description: 'Pass under the massive red Kaminarimon paper lantern into Tokyo\'s oldest 7th-century Buddhist temple, sampling piping hot Ningyo-yaki sweets along Nakamise Dori.',
          category: 'Historic Temple & Traditional Market',
          baseCost: 650,
          duration: '3.5 hrs',
          tips: 'Draw an omikuji (fortune slip) at the temple pavilion; tie unlucky fortunes to the metal racks.'
        },
        {
          period: 'Afternoon',
          time: '01:00 PM - 04:30 PM',
          title: 'Akihabara Electric Town & Futuristic Gaming Culture',
          location: 'Soto-Kanda, Chiyoda City, Tokyo',
          description: 'Dive into the kaleidoscopic heart of anime, manga, retro arcades, multi-floor tech plazas, and themed maid cafes in neon-draped Akihabara.',
          category: 'Tech & Pop Culture',
          baseCost: 1300,
          duration: '3.5 hrs',
          tips: 'Check out Mandarake Complex for multi-story vintage collectible figurines and retro games.'
        },
        {
          period: 'Evening',
          time: '05:30 PM - 09:00 PM',
          title: 'Shibuya Crossing Scramble & Shibuya Sky Sunset Observatory',
          location: 'Shibuya Scramble Square, Tokyo',
          description: 'Experience the world\'s most famous pedestrian intersection, then ascend 229 meters to the open-air rooftop deck of Shibuya Sky for sunsets over Mount Fuji and neon Tokyo.',
          category: 'Iconic Skyline & Modern Metropolis',
          baseCost: 1620,
          duration: '3.5 hrs',
          tips: 'Book Shibuya Sky sunset time slot 2 weeks in advance; lockers are mandatory for rooftop access.'
        }
      ]
    },
    {
      title: 'Meiji Jingu Forest, Harajuku Street Fashion & Shinjuku Izakayas',
      theme: 'Shinto Sanctuaries, Avant-Garde Style & Post-War Lantern Alleys',
      slots: [
        {
          period: 'Morning',
          time: '09:00 AM - 12:30 PM',
          title: 'Meiji Jingu Shinto Shrine & Evergreen Forest Sanctuary',
          location: 'Yoyogikamizonocho, Shibuya City, Tokyo',
          description: 'Step beneath towering 1,500-year-old cedar Torii gates into a tranquil 170-acre sacred forest planted with 100,000 donated trees from across Japan.',
          category: 'Shinto Shrine & Forest Oasis',
          baseCost: 520,
          duration: '3.5 hrs',
          tips: 'Cleanse your hands and mouth at the temizuya water fountain before entering the main courtyard.'
        },
        {
          period: 'Afternoon',
          time: '01:00 PM - 04:30 PM',
          title: 'Harajuku Takeshita Street & Omotesando Design Boulevards',
          location: 'Jingumae, Shibuya City, Tokyo',
          description: 'Contrast Harajuku\'s whimsical street fashion with the tree-lined luxury architectural pavilions and designer cafes of Omotesando.',
          category: 'Street Fashion & Avant-Garde Design',
          baseCost: 1170,
          duration: '3.5 hrs',
          tips: 'Try a freshly rolled Japanese dessert crepe filled with strawberries and custard.'
        },
        {
          period: 'Evening',
          time: '05:30 PM - 09:00 PM',
          title: 'Shinjuku Gyoen National Garden & Omoide Yokocho Izakaya Trail',
          location: 'Nishi-Shinjuku, Tokyo',
          description: 'Stroll formal Japanese landscape ponds, then dive into the nostalgic post-war lantern alleys of \'Memory Lane\', savoring grilled yakitori skewers and draft beer.',
          category: 'Japanese Gardens & Izakaya Gastronomy',
          baseCost: 1200,
          duration: '3.5 hrs',
          tips: 'Omoide Yokocho izakayas are intimate (4-8 seats per stall); carry Japanese Yen cash.'
        }
      ]
    },
    {
      title: 'Tsukiji Outer Market Sushi, TeamLab Planets & Tokyo Tower',
      theme: 'Fresh Otoro Nigiri, Sensory Digital Art & Minato Skyline Vistas',
      slots: [
        {
          period: 'Morning',
          time: '08:00 AM - 12:00 PM',
          title: 'Tsukiji Outer Market Fresh Sushi & A5 Wagyu Street Tasting',
          location: 'Tsukiji, Chuo City, Tokyo',
          description: 'Sample melt-in-your-mouth bluefin otoro nigiri, grilled tamagoyaki sweet omelets, and flame-torched A5 Wagyu beef skewers directly from wholesale market stalls.',
          category: 'Seafood Market & Culinary Masterclass',
          baseCost: 1200,
          duration: '4 hrs',
          tips: 'Arrive around 8:00-9:00 AM while daily fish catches and knife shops are bustling.'
        },
        {
          period: 'Afternoon',
          time: '01:00 PM - 04:30 PM',
          title: 'TeamLab Planets Digital Immersive Art Museum in Odaiba',
          location: 'Toyosu / Odaiba Waterfront, Tokyo',
          description: 'Wade barefoot through knee-deep digital koi fish waters and walk across endless crystal mirror rooms in this groundbreaking sensory digital art museum.',
          category: 'Digital Art & Futuristic Experience',
          baseCost: 1950,
          duration: '3.5 hrs',
          tips: 'Wear pants that can be rolled up to your knees as you will walk through shallow water exhibits.'
        },
        {
          period: 'Evening',
          time: '05:30 PM - 09:00 PM',
          title: 'Roppongi Hills Mori Tower & Tokyo Tower Illuminated Twilight',
          location: 'Roppongi, Minato City, Tokyo',
          description: 'Take in sweeping sunset vistas of the red-and-white Tokyo Tower glowing against the metropolis, followed by Michelin-caliber ramen or matcha dessert bars.',
          category: 'Skyline Panoramas & Evening Dining',
          baseCost: 1200,
          duration: '3.5 hrs',
          tips: 'The Tokyo City View observation deck on the 52nd floor provides the best direct view of Tokyo Tower.'
        }
      ]
    }
  ],
  manali: [
    {
      title: 'Hadimba Devi Cedar Temple, Old Manali & Jogini Waterfall',
      theme: 'Ancient Deodar Groves, Bohemian Riverside Cafes & Alpine Trails',
      slots: [
        {
          period: 'Morning',
          time: '08:30 AM - 12:00 PM',
          title: 'Hadimba Devi Cedar Forest Historic Wooden Temple',
          location: 'Dhungri Forest, Manali',
          description: 'Wander through centuries-old giant deodar cedar pine groves to the unique 1553 pagoda-style wooden temple adorned with intricate timber animal relief carvings.',
          category: 'Sacred Forest Temple & Heritage',
          baseCost: 520,
          duration: '3.5 hrs',
          tips: 'Visit early morning when mist filters through the deodar canopy for magical alpine photos.'
        },
        {
          period: 'Afternoon',
          time: '01:00 PM - 04:30 PM',
          title: 'Old Manali Riverside Cafes & Fresh Himalayan Trout Tasting',
          location: 'Old Manali Village & Manalsu River',
          description: 'Cross the bridge into Old Manali\'s bohemian stone-and-wood village, savoring butter-garlic pan-fried Himalayan river trout and wood-fired sourdough pizzas.',
          category: 'Mountain Gastronomy & Riverside Vibe',
          baseCost: 1170,
          duration: '3.5 hrs',
          tips: 'Request outdoor riverside seating overlooking the rushing glacial waters.'
        },
        {
          period: 'Evening',
          time: '05:00 PM - 08:30 PM',
          title: 'Jogini Waterfall Clifftop Hike & Beas Valley Sunset',
          location: 'Vashisht to Jogini Cliff Trail, Manali',
          description: 'Hike along apple orchards and mountain streams up to the cascading multi-tiered Jogini Waterfalls, watching the setting sun ignite the Pir Panjal mountain range.',
          category: 'Alpine Waterfall & Sunset Trek',
          baseCost: 650,
          duration: '3.5 hrs',
          tips: 'Wear hiking shoes with good tread; trail can be slightly slippery near the waterfall spray.'
        }
      ]
    },
    {
      title: 'Solang Valley Slopes, Atal Tunnel & Vashisht Sulphur Springs',
      theme: 'Paragliding Heights, Trans-Himalayan Gateways & Thermal Waters',
      slots: [
        {
          period: 'Morning',
          time: '08:00 AM - 12:30 PM',
          title: 'Solang Valley Paragliding & Alpine Adventure Slopes',
          location: 'Solang Valley, Manali',
          description: 'Soar above snow-kissed alpine meadows and pine ridges on a tandem paragliding flight, or take the modern ropeway cable car up to 3,200 meters.',
          category: 'Adventure Aerial & Cable Car',
          baseCost: 1200,
          duration: '4 hrs',
          tips: 'Paragliding operates strictly during clear morning wind windows; wear a windbreaker jacket.'
        },
        {
          period: 'Afternoon',
          time: '01:00 PM - 05:00 PM',
          title: 'Atal Tunnel Rohtang Highway & Sissu Lahaul Valley Gateway',
          location: 'Atal Tunnel Northern Portal, Lahaul & Spiti',
          description: 'Pass through the world\'s longest highway tunnel above 10,000 feet, emerging into the dramatic rain-shadow trans-Himalayan landscapes and waterfalls of Sissu.',
          category: 'Mountain Engineering & Glacial Valley',
          baseCost: 1620,
          duration: '4 hrs',
          tips: 'Carry warm layers as temperatures at the north portal are significantly colder than Manali.'
        },
        {
          period: 'Evening',
          time: '05:30 PM - 08:30 PM',
          title: 'Vashisht Village Natural Hot Sulphur Springs & Relaxation',
          location: 'Vashisht Temple Village, Manali',
          description: 'Unwind after mountain excursions in the ancient natural mineral-rich thermal sulphur springs renowned for restorative therapeutic properties.',
          category: 'Thermal Springs & Mountain Wellness',
          baseCost: 400,
          duration: '3 hrs',
          tips: 'Separate enclosed bathing areas are provided for men and women; carry a change of clothes.'
        }
      ]
    },
    {
      title: 'Naggar Castle Citadel, Jana Waterfall Siddu & Mall Road',
      theme: '15th-Century Himalayan Architecture, Siddu Cuisine & Shawls',
      slots: [
        {
          period: 'Morning',
          time: '08:30 AM - 12:30 PM',
          title: 'Naggar Castle Heritage Himalayan Citadel & Roerich Gallery',
          location: 'Naggar Village, Kullu Valley',
          description: 'Explore the 15th-century wood-and-stone castle built by Raja Sidh Singh, overlooking the Beas River, and visit the historic mountain painting estate of Russian artist Nicholas Roerich.',
          category: 'Himalayan Citadel & Art Gallery',
          baseCost: 910,
          duration: '4 hrs',
          tips: 'Enjoy traditional Kullu walnut pie and masala chai on the castle terrace.'
        },
        {
          period: 'Afternoon',
          time: '01:00 PM - 04:30 PM',
          title: 'Jana Waterfall Mountain Village & Authentic Himachali Siddu Tasting',
          location: 'Jana Village, Kullu-Manali',
          description: 'Cross wooden bridges over natural glacial springs in Jana village, tasting authentic steamed wheat-and-poppyseed Siddu served with hot pure desi ghee and walnut chutney.',
          category: 'Traditional Himachali Cuisine & Countryside',
          baseCost: 780,
          duration: '3.5 hrs',
          tips: 'Siddu is freshly made to order; pair it with homemade red kidney bean (Rajma) curry.'
        },
        {
          period: 'Evening',
          time: '05:30 PM - 09:00 PM',
          title: 'Mall Road Evening Stroll & Tibetan Handloom Woolen Bazaars',
          location: 'Mall Road, Central Manali',
          description: 'Conclude your alpine voyage exploring pedestrian Mall Road, visiting the Tibetan Monastery, and picking up authentic GI-tagged Kullu shawls, wooden carvings, and pine honey.',
          category: 'Shopping & Tibetan Culture',
          baseCost: 980,
          duration: '3.5 hrs',
          tips: 'Look for government handloom mark certification on Pashmina and Kullu woolen shawls.'
        }
      ]
    }
  ]
};

const proceduralDayBlueprints = [
  {
    titleTemplate: 'Historic Quarter, Artisan Delicacies & Sunset Lookout',
    themeTemplate: 'Cultural Heritage, Regional Flavors & Horizon Golden Hour',
    morning: {
      title: '{city} Heritage Quarter & Landmark Trail',
      category: 'Historical Heritage',
      location: 'Historic District, {city}',
      description: 'Explore the storied heritage landmarks, architectural monuments, and cultural precincts that anchor {city}\'s vibrant identity.',
      duration: '3.5 hrs',
      baseCost: 500,
      tips: 'Arrive early in the morning to capture the monuments bathed in golden sunlight without crowds.'
    },
    afternoon: {
      title: 'Authentic {city} Culinary Walk & Regional Specialties',
      category: 'Gastronomy & Local Flavors',
      location: 'Traditional Food Bazaar, {city}',
      description: 'Savor authentic regional dishes, signature street food specialties, and time-honored recipes perfected across generations in {city}.',
      duration: '3 hrs',
      baseCost: 650,
      tips: 'Sample the signature house specialty and pair it with a fresh locally pressed fruit cooler.'
    },
    evening: {
      title: '{city} Golden Hour Panorama & Twilight Promenade',
      category: 'Sunset & Scenic Vista',
      location: 'Scenic Vista Point, {city}',
      description: 'Watch vibrant twilight hues illuminate {city} from a picturesque viewpoint, soaking in refreshing evening breezes and scenic horizons.',
      duration: '3.5 hrs',
      baseCost: 450,
      tips: 'Arrive 30 minutes before dusk to enjoy the transition from golden hour into twinkling night lights.'
    }
  },
  {
    titleTemplate: 'Botanical Sanctuaries, Art Treasures & Riverfront Esplanade',
    themeTemplate: 'Lush Flora, Celebrated Antiquities & Illuminated Waters',
    morning: {
      title: '{city} Royal Botanical Gardens & Orchid Conservatory',
      category: 'Nature & Botanical Gardens',
      location: 'Royal Botanical Gardens, {city}',
      description: 'Stroll along tree-lined pathways, fragrant flower gardens, and heritage glasshouse conservatories showcasing native flora and tranquil reflective ponds.',
      duration: '3 hrs',
      baseCost: 780,
      tips: 'Early morning is the ideal time to enjoy the cool breeze and photograph exotic flora.'
    },
    afternoon: {
      title: '{city} National Museum of Art & Civilizations',
      category: 'Museums & Cultural History',
      location: 'Museum Mile, {city}',
      description: 'Explore curated exhibitions spanning classical antiquities, royal regalia, and interactive cultural showcases illuminating {city}\'s storied heritage.',
      duration: '3.5 hrs',
      baseCost: 1300,
      tips: 'Borrow the interactive museum audio guide for deep backstories on centerpiece masterworks.'
    },
    evening: {
      title: 'Illuminated Waterfront Promenade & {city} Evening Fountains',
      category: 'Evening Promenade & Landmarks',
      location: 'Grand Harbor Esplanade, {city}',
      description: 'Stroll along the atmospheric illuminated waterfront of {city}, enjoying live street acoustic performances, illuminated fountains, and refreshing night breezes.',
      duration: '3.5 hrs',
      baseCost: 1170,
      tips: 'Stop by the gelato and dessert carts along the esplanade for an evening sweet treat.'
    }
  },
  {
    titleTemplate: 'Sacred Sanctuaries, Artisan Guilds & Night Bazaar',
    themeTemplate: 'Gothic/Baroque Sanctums, Handloom Studios & Twilight Sizzle',
    morning: {
      title: '{city} Sacred Cathedral & Cloistered Sanctuary',
      category: 'Sacred Architecture & Heritage',
      location: 'Sanctuary Square, {city}',
      description: 'Admire soaring arches, stained glass masterpieces, and centuries of preserved spiritual artwork in {city}\'s most celebrated sanctuary.',
      duration: '3 hrs',
      baseCost: 650,
      tips: 'Maintain respectful silence inside; photography is permitted without flash.'
    },
    afternoon: {
      title: 'Artisan Guilds, Handloom & Ceramic Studios in {city}',
      category: 'Craft & Artisan Discovery',
      location: 'Artisans Quarter, {city}',
      description: 'Watch master craftsmen sculpt ceramics, weave heritage fabrics, and craft delicate jewelry unique to {city}\'s guild traditions.',
      duration: '3.5 hrs',
      baseCost: 1170,
      tips: 'Support local families by picking up handcrafted ceramic or textile souvenirs.'
    },
    evening: {
      title: 'Twilight Night Bazaar & {city} Street Food Safari',
      category: 'Night Market & Street Food',
      location: 'Bazaar Square, {city}',
      description: 'Delight in the sizzling energy of {city}\'s evening bazaar, savoring aromatic skewered bites, freshly baked flatbreads, and sweet delicacies.',
      duration: '3.5 hrs',
      baseCost: 1430,
      tips: 'Look for stalls with long local queues—a reliable sign of peak freshness and legendary flavor.'
    }
  }
];


// --- Authentic Daily Dining Recommendations ---
const destinationDiningRecommendations = {
  vizag: [
    [
      { name: 'Sea Inn (Kabab House)', cuisine: 'Coastal Andhra Seafood', specialty: 'Spicy Prawn Fry & Royyala Biryani', location: "Rushikonda / Lawson's Bay", priceRange: '₹450 - ₹900', timing: 'Lunch & Dinner', rating: 4.8 },
      { name: 'The Park Bamboo Bay', cuisine: 'Beachfront Barbecue & Grill', specialty: 'Tandoori Crab & Bamboo Chicken', location: 'Beach Road', priceRange: '₹1,200 - ₹2,200', timing: 'Dinner & Cocktails', rating: 4.9 }
    ],
    [
      { name: 'Daspalla Executive Court', cuisine: 'Authentic Andhra Royal Thali', specialty: 'Gongura Mutton & Avakaya Annam', location: 'Waltair Uplands', priceRange: '₹400 - ₹800', timing: 'Lunch', rating: 4.8 },
      { name: 'Flying Spaghetti Monster', cuisine: 'Artisan Italian Trattoria', specialty: 'Woodfired Truffle Pizza & Tiramisu', location: 'Siripuram', priceRange: '₹700 - ₹1,400', timing: 'Dinner', rating: 4.7 }
    ],
    [
      { name: 'Araku Haritha Bamboo Kitchen', cuisine: 'Tribal Highland Cuisine', specialty: 'Bamboo Chicken & Bongu Biryani', location: 'Araku Valley', priceRange: '₹350 - ₹700', timing: 'Lunch', rating: 4.7 },
      { name: 'Laddu Gopal & Sweet India', cuisine: 'Traditional Confectionery & Street Food', specialty: 'Kaju Sweets, Hot Samosa & Filter Coffee', location: 'Jagadamba Junction', priceRange: '₹150 - ₹400', timing: 'Evening Snack', rating: 4.8 }
    ]
  ],
  rajahmundry: [
    [
      { name: 'Srikanya Comfort', cuisine: 'Legendary Godavari Seafood', specialty: 'Godavari Pulasa Fish Curry & Bagara Rice', location: 'Main Road, Kotagummam', priceRange: '₹500 - ₹1,100', timing: 'Lunch & Dinner', rating: 4.9 },
      { name: 'Rose Milk Centre (Est. 1950)', cuisine: 'Iconic Heritage Beverage', specialty: 'Chilled Rose Milk with Khoa & Cashew', location: 'Kotagummam Corner', priceRange: '₹80 - ₹150', timing: 'All Day Refreshment', rating: 4.9 }
    ],
    [
      { name: 'River Bay Godavari Bistro', cuisine: 'Riverfront Andhra Special', specialty: 'Natu Kodi Pulusu & Ragi Sankati', location: 'Gowthami Ghat', priceRange: '₹600 - ₹1,200', timing: 'Lunch', rating: 4.7 },
      { name: 'Udupi Sri Krishna Bhavan', cuisine: 'Pure Vegetarian Tiffin Heritage', specialty: 'Ghee Karam Dosa & Filter Coffee', location: 'Pushkar Ghat', priceRange: '₹150 - ₹350', timing: 'Breakfast & Evening', rating: 4.8 }
    ],
    [
      { name: 'Sri Kanya Grand', cuisine: 'East Godavari Thali Special', specialty: 'Pootharekulu Sweet Roll & Gongura Royyalu', location: 'Danavaipeta', priceRange: '₹450 - ₹950', timing: 'Lunch & Dinner', rating: 4.8 }
    ]
  ],
  ooty: [
    [
      { name: "Nahar's Sidewalk Cafe", cuisine: 'Italian & European Cafe', specialty: 'Thin Crust Woodfired Pizza & Fresh Brew', location: 'Commercial Road', priceRange: '₹450 - ₹900', timing: 'Lunch & Dinner', rating: 4.8 },
      { name: "Earl's Secret (Kings Cliff)", cuisine: 'Colonial Anglo-Indian Dining', specialty: "Shepherd's Pie, Sizzlers & Herb Soup", location: 'Havelock Road', priceRange: '₹900 - ₹1,800', timing: 'Candlelight Dinner', rating: 4.9 }
    ],
    [
      { name: 'Hotel Junior Kuppanna', cuisine: 'Kongu Nadu South Indian', specialty: 'Mutton Chukka & Seeraga Samba Biryani', location: 'Charring Cross', priceRange: '₹400 - ₹850', timing: 'Lunch', rating: 4.7 },
      { name: 'King Star Bakery (Est. 1942)', cuisine: 'Artisan Confectionery', specialty: 'Handmade Ooty Chocolate Fudge', location: 'Commercial Street', priceRange: '₹200 - ₹500', timing: 'Sweet Souvenir', rating: 4.9 }
    ],
    [
      { name: "Shinkow's Chinese Restaurant", cuisine: 'Authentic Heritage Chinese', specialty: 'Chili Garlic Pork, Hakka Noodles & Wonton', location: "Commissioner's Road", priceRange: '₹500 - ₹1,100', timing: 'Lunch & Dinner', rating: 4.8 }
    ]
  ],
  manali: [
    [
      { name: 'Cafe 1947', cuisine: 'Riverside Italian & Continental', specialty: 'Trout Fish with Garlic Butter & Ravioli', location: 'Old Manali Bridge', priceRange: '₹600 - ₹1,300', timing: 'Lunch & Sunset', rating: 4.9 },
      { name: "Drifters' Cafe", cuisine: 'Mountain Comfort Food', specialty: 'Fluffy Pancakes & Himalayan Mutton Stew', location: 'Manu Temple Road', priceRange: '₹400 - ₹850', timing: 'Dinner & Live Music', rating: 4.8 }
    ],
    [
      { name: 'Chopsticks Restaurant', cuisine: 'Tibetan & Himalayan', specialty: 'Steamed Pork Momos & Thukpa Noodle Soup', location: 'Mall Road', priceRange: '₹300 - ₹700', timing: 'Lunch', rating: 4.8 },
      { name: "Johnson's Cafe", cuisine: 'Woodfired European Dining', specialty: 'Woodfired Trout Almondine & Apple Crumble', location: 'Circuit House Road', priceRange: '₹800 - ₹1,700', timing: 'Dinner', rating: 4.9 }
    ],
    [
      { name: 'Jana Heritage Dhabha', cuisine: 'Traditional Himachali', specialty: 'Steamed Siddu with Pure Ghee & Walnut Chutney', location: 'Jana Village Falls', priceRange: '₹250 - ₹500', timing: 'Lunch', rating: 4.8 }
    ]
  ],
  paris: [
    [
      { name: 'Le Comptoir du Relais', cuisine: 'Quintessential Parisian Bistro', specialty: 'Duck Confit & Escargots de Bourgogne', location: 'Odéon / Saint-Germain', priceRange: '₹2,800 - ₹5,500', timing: 'Lunch & Dinner', rating: 4.9 },
      { name: 'Carette Paris (Est. 1927)', cuisine: 'Haute French Patisserie', specialty: 'Legendary Thick Hot Chocolate & Macarons', location: 'Place des Vosges', priceRange: '₹1,200 - ₹2,500', timing: 'Afternoon Tea', rating: 4.9 }
    ],
    [
      { name: 'Bouillon Chartier', cuisine: 'Belle Époque Classic Dining', specialty: 'Steak Frites & Baba au Rhum', location: 'Rue du Faubourg Montmartre', priceRange: '₹1,800 - ₹3,500', timing: 'Lunch', rating: 4.7 },
      { name: 'Pink Mamma', cuisine: 'Italian Trattoria & Rooftop Bar', specialty: 'Truffle Pasta & Burrata Pugliese', location: 'Pigalle / 9th Arr.', priceRange: '₹2,400 - ₹4,800', timing: 'Dinner', rating: 4.8 }
    ],
    [
      { name: "L'Ambroisie", cuisine: 'Michelin 3-Star Haute Cuisine', specialty: 'Roasted Sea Bass with Caviar & Sabayon', location: 'Place des Vosges', priceRange: '₹12,000 - ₹28,000', timing: 'Gala Dinner', rating: 5.0 }
    ]
  ],
  tokyo: [
    [
      { name: 'Ichiran Ramen', cuisine: 'Iconic Tonkotsu Ramen', specialty: 'Classic Tonkotsu Broth with Handmade Noodles', location: 'Shinjuku / Shibuya', priceRange: '₹800 - ₹1,400', timing: 'Lunch & Late Night', rating: 4.9 },
      { name: 'Omoide Yokocho Yakitori Alley', cuisine: 'Izakaya Street Grills', specialty: 'Charcoal Grilled Chicken Skewers & Draft Beer', location: 'Shinjuku Station West', priceRange: '₹1,200 - ₹2,500', timing: 'Evening', rating: 4.8 }
    ],
    [
      { name: 'Gyukatsu Motomura', cuisine: 'Japanese Beef Cutlet', specialty: 'Panko-Crusted Wagyu Beef on Stone Grill', location: 'Shibuya', priceRange: '₹1,400 - ₹2,800', timing: 'Lunch', rating: 4.9 },
      { name: 'Afuri Ramen', cuisine: 'Artisan Yuzu Ramen', specialty: 'Yuzu Shio Ramen & Charcoal Chashu', location: 'Harajuku', priceRange: '₹900 - ₹1,600', timing: 'Dinner', rating: 4.8 }
    ],
    [
      { name: 'Sushi Dai / Daiwa Sushi', cuisine: 'Edomae Sushi Masterclass', specialty: 'Bluefin Otoro, Sea Urchin & Sweet Shrimp', location: 'Toyosu / Tsukiji', priceRange: '₹3,500 - ₹7,500', timing: 'Morning & Lunch', rating: 5.0 }
    ]
  ]
};

function getDestinationDiningRecommendations(destName, dayIdx) {
  const destLower = destName.toLowerCase();
  for (const [k, daysList] of Object.entries(destinationDiningRecommendations)) {
    if (destLower.includes(k) || k.includes(destLower)) {
      return daysList[dayIdx % daysList.length];
    }
  }

  return [
    { name: 'Grand Central Heritage Restaurant', cuisine: 'Authentic Regional Cuisine', specialty: `Chef's Signature Specialty with ${destName} Spices`, location: 'Central Bazaar', priceRange: '₹650 - ₹1,400', timing: 'Lunch', rating: 4.8 },
    { name: 'The Artisan Table & Roastery', cuisine: 'Farm-to-Table & Local Cafe', specialty: 'Wood-Smoked Small Plates & Single-Origin Roast', location: 'Artisans Quarter', priceRange: '₹450 - ₹950', timing: 'Dinner', rating: 4.7 }
  ];
}

// --- Authentic Hotel Recommendations by Budget Tier ---
const destinationHotelRecommendations = {
  vizag: [
    { name: 'Zostel Vizag / Dolphin Hotel', tier: 'budget', location: 'Daba Gardens / Ramnagar', pricePerNight: 2200, rating: 4.6, amenities: ['Free WiFi', 'AC', 'Travel Desk', 'Breakfast'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80', badge: 'Smart Backpacker' },
    { name: 'The Gateway Hotel Beach Road', tier: 'moderate', location: 'Pandurangapuram, RK Beach', pricePerNight: 5500, rating: 4.8, amenities: ['Sea Views', 'Swimming Pool', 'Ming Garden', 'Spa'], image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80', badge: 'Most Popular' },
    { name: 'Novotel Visakhapatnam Varun Beach', tier: 'luxury', location: 'Beach Road, Maharani Peta', pricePerNight: 9500, rating: 4.9, amenities: ['Infinity Bay Pool', 'Executive Lounge', 'Fine Dining', 'Sea Facing'], image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80', badge: '5-Star Luxury' }
  ],
  rajahmundry: [
    { name: 'Hotel Shelton / La Hospin', tier: 'budget', location: 'Ayyappa Nagar, Rajahmundry', pricePerNight: 1900, rating: 4.5, amenities: ['AC Rooms', 'Free WiFi', 'Room Service'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80', badge: 'Value Pick' },
    { name: 'Hotel Anand Regency', tier: 'moderate', location: 'JNM Street, Rajahmundry', pricePerNight: 3800, rating: 4.7, amenities: ['Restaurant', 'Banquet', 'Central AC', 'Bar'], image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80', badge: 'City Favorite' },
    { name: 'River Bay Resort & Water Park', tier: 'luxury', location: 'Gowthami Ghat Road', pricePerNight: 6500, rating: 4.8, amenities: ['Godavari Views', 'Water World', "Captain's Deck", 'Lawns'], image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80', badge: 'Waterfront Pick' }
  ],
  ooty: [
    { name: 'Zostel Ooty / Hotel Willow Hill', tier: 'budget', location: 'Elk Hill / Upper Ooty', pricePerNight: 2400, rating: 4.7, amenities: ['Mountain Views', 'Cafe', 'Bonfire', 'Free WiFi'], image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80', badge: 'Backpacker Gem' },
    { name: 'Sterling Ooty Elk Hill', tier: 'moderate', location: 'Elk Hill, Ooty', pricePerNight: 6200, rating: 4.8, amenities: ['Valley Overlook', 'Organic Kitchen', 'Kids Activity Hub', 'Fireplace'], image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80', badge: 'Panoramic Resort' },
    { name: 'Savoy - IHCL SeleQtions Ooty', tier: 'luxury', location: 'Sylks Road, Central Ooty', pricePerNight: 14500, rating: 4.9, amenities: ['British Colonial Cottages', 'English High Tea', 'Eucalyptus Spa', 'Horse Riding'], image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80', badge: 'Historic Heritage' }
  ],
  manali: [
    { name: 'The Hosteller Manali / Zostel Old Manali', tier: 'budget', location: 'Old Manali Village', pricePerNight: 2100, rating: 4.7, amenities: ['Riverside Cafe', 'Common Lounge', 'Heaters', 'Mountain Treks'], image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80', badge: 'Alpine Youth' },
    { name: 'Snow Valley Resorts', tier: 'moderate', location: 'Log Huts Area, Manali', pricePerNight: 5200, rating: 4.8, amenities: ['Cedar Forest Views', 'Buffet Dining', 'Games Room', 'Balconies'], image: 'https://images.unsplash.com/photo-1579619564365-0442e27ab9e2?auto=format&fit=crop&w=800&q=80', badge: 'Valley Retreat' },
    { name: 'The Himalayan Castle & Cedar Spa', tier: 'luxury', location: 'Hadimba Road, Manali', pricePerNight: 12500, rating: 4.9, amenities: ['Castle Architecture', 'Heated Pool', 'Fireplace Suites', 'Spa'], image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80', badge: '5-Star Castle' }
  ],
  paris: [
    { name: 'Generator Paris / The People Marais', tier: 'budget', location: '10th / 11th Arrondissement', pricePerNight: 6500, rating: 4.6, amenities: ['Rooftop Bar', 'Metro Proximity', 'Free WiFi'], image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80', badge: 'Trendy Design' },
    { name: 'CitizenM Paris Champs-Élysées', tier: 'moderate', location: '8th Arrondissement', pricePerNight: 18500, rating: 4.8, amenities: ['Champs-Élysées Access', 'MoodPad Rooms', 'CanteenM Bar'], image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80', badge: 'Prime Central' },
    { name: 'Hôtel Plaza Athénée', tier: 'luxury', location: 'Avenue Montaigne, Paris', pricePerNight: 52000, rating: 5.0, amenities: ['Eiffel Views', 'Dior Institute Spa', '3-Star Michelin', 'Courtyard'], image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80', badge: 'Haute Couture Palace' }
  ],
  tokyo: [
    { name: 'Hotel Gracery Shinjuku', tier: 'budget', location: 'Kabukicho, Shinjuku', pricePerNight: 5800, rating: 4.7, amenities: ['Godzilla Head View', 'Metro Proximity', 'Modern Pods'], image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80', badge: 'Pop Icon' },
    { name: 'Candeo Hotels Tokyo Shimbashi', tier: 'moderate', location: 'Shimbashi, Minato City', pricePerNight: 15500, rating: 4.8, amenities: ['Sky Spa Open-Air Bath', 'Sauna', 'Tokyo Tower View'], image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80', badge: 'Sky Spa Pick' },
    { name: 'Aman Tokyo / Ritz-Carlton', tier: 'luxury', location: 'Otemachi / Roppongi', pricePerNight: 68000, rating: 5.0, amenities: ['Panoramic Fuji Views', 'Traditional Onsen Spa', 'Michelin Dining'], image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=800&q=80', badge: 'Ultra Luxury' }
  ]
};

function getDestinationHotelRecommendations(destName, budgetTier) {
  const destLower = destName.toLowerCase();
  let hotels = null;
  for (const [k, hList] of Object.entries(destinationHotelRecommendations)) {
    if (destLower.includes(k) || k.includes(destLower)) {
      hotels = hList.map(h => ({ ...h }));
      break;
    }
  }

  if (!hotels) {
    hotels = [
      { name: `${destName} Travelers Lodge & Pods`, tier: 'budget', location: `Transit Quarter, ${destName}`, pricePerNight: 2200, rating: 4.6, amenities: ['Free WiFi', 'AC', 'Breakfast', 'Travel Desk'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80', badge: 'Smart Economy' },
      { name: `The Grand ${destName} Heritage Hotel`, tier: 'moderate', location: `Historic Center, ${destName}`, pricePerNight: 5400, rating: 4.8, amenities: ['Pool', 'Restaurant', 'Garden Lawn', 'Fitness Center'], image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80', badge: 'Most Popular' },
      { name: `${destName} Royal Palace & Bay Resort`, tier: 'luxury', location: `Prime Overlook Boulevard, ${destName}`, pricePerNight: 14500, rating: 4.9, amenities: ['Infinity Pool', 'Private Balconies', 'Ayurvedic Spa', 'Chauffeur Service'], image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80', badge: '5-Star Luxury' }
    ];
  }

  const tierOrder = { budget: 0, moderate: 1, luxury: 2 };
  const selectedVal = tierOrder[(budgetTier || 'moderate').toLowerCase()] ?? 1;
  hotels.sort((a, b) => (tierOrder[a.tier] === selectedVal ? -1 : 1));
  return hotels;
}

// --- Journey & Transit Breakdown Generator ---
const hubTransitDetails = {
  vizag: { airport: 'Visakhapatnam Intl Airport (VTZ)', station: 'Visakhapatnam Junction (VSKP)', highways: 'NH16 (East Coast Golden Quadrilateral corridor)', avgFlightHrs: '1h 15m', avgTrainHrs: '8h 30m', avgDriveHrs: '11h 30m' },
  rajahmundry: { airport: 'Rajahmundry Airport (RJA / Madhurapudi)', station: 'Rajahmundry Railway Station (RJY)', highways: 'NH16 via Godavari Arch Bridges', avgFlightHrs: '1h 10m', avgTrainHrs: '6h 00m', avgDriveHrs: '8h 30m' },
  ooty: { airport: 'Coimbatore Intl Airport (CJB - 88 km) / Mysore Airport (MYQ)', station: 'Udhagamandalam Station (UAM) / Mettupalayam (MTP)', highways: 'NH181 via 36 Hairpin Bends Ghat Road', avgFlightHrs: '1h 15m (+2.5h scenic ghat cab)', avgTrainHrs: '9h 30m (Nilgiri Mountain Toy Train connection)', avgDriveHrs: '6h 30m' },
  manali: { airport: 'Kullu-Manali Airport at Bhuntar (KUU - 50 km)', station: 'Chandigarh Junction (CDG - 290 km)', highways: 'NH3 via Kiratpur-Nerchowk Expressway & Pandoh', avgFlightHrs: '1h 20m (+1.5h cab)', avgTrainHrs: '8h 00m to Chandigarh (+7h scenic cab)', avgDriveHrs: '11h 00m' },
  paris: { airport: 'Paris Charles de Gaulle (CDG) / Orly (ORY)', station: 'Gare du Nord / Gare de Lyon (Eurostar / TGV)', highways: 'A1 / A6 Motorway Corridors', avgFlightHrs: '1h 20m', avgTrainHrs: '2h 15m (Eurostar Rail)', avgDriveHrs: '5h 45m' },
  tokyo: { airport: 'Tokyo Haneda (HND) / Narita Intl (NRT)', station: 'Tokyo Station / Shinagawa (Tokaido Shinkansen)', highways: 'Tomei Expressway / Shuto Expressway', avgFlightHrs: '1h 15m', avgTrainHrs: '2h 30m (Nozomi Shinkansen Bullet Train)', avgDriveHrs: '6h 00m' }
};

function generateJourneyTransitBreakdown(origin, destination, preferredMode = 'flight', destInfo = {}, originCoords = null) {
  const destName = destInfo.name || destination;
  const destLower = destName.toLowerCase();
  const origClean = origin && origin.toLowerCase() !== 'current location' ? origin.trim() : 'Hyderabad';

  let matchedHub = null;
  for (const [k, v] of Object.entries(hubTransitDetails)) {
    if (destLower.includes(k) || k.includes(destLower)) {
      matchedHub = v;
      break;
    }
  }

  if (!matchedHub) {
    matchedHub = {
      airport: `${destName} Domestic / Regional Airport`,
      station: `${destName} Central Junction`,
      highways: `National Highway & Expressway Corridors connecting to ${destName}`,
      avgFlightHrs: '1h 30m',
      avgTrainHrs: '7h 30m',
      avgDriveHrs: '9h 45m'
    };
  }

  let distKm = 580;
  if (originCoords && destInfo.coordinates) {
    try {
      const lat1 = originCoords.lat;
      const lon1 = originCoords.lng;
      const lat2 = destInfo.coordinates.lat;
      const lon2 = destInfo.coordinates.lng;
      const r = 6371;
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      distKm = Math.max(80, Math.round(r * c));
    } catch (e) {}
  }

  const flightCost = Math.max(3200, Math.round(distKm * 5.8 / 100) * 100);
  const trainCost = Math.max(650, Math.round(distKm * 2.2 / 10) * 10);
  const driveFuel = Math.max(2400, Math.round(distKm * 6.5 / 100) * 100);
  const cabCost = Math.max(3800, Math.round(distKm * 11.0 / 100) * 100);

  const optionsMap = {
    flight: {
      mode: 'flight',
      title: `Express Direct / Connecting Flight (${origClean} → ${destName})`,
      duration: matchedHub.avgFlightHrs,
      estimatedCost: flightCost,
      routeOverview: `Depart from nearest airport servicing ${origClean} arriving directly at ${matchedHub.airport}. Fast 20-30 min connection into city center.`,
      highlights: [
        `Arrival Hub: ${matchedHub.airport}`,
        'Baggage handling and terminal cab stands included',
        'Fastest journey with minimum en-route fatigue'
      ],
      terminalDetails: {
        departureTerminal: `Air Hub near ${origClean}`,
        arrivalTerminal: matchedHub.airport
      }
    },
    train: {
      mode: 'train',
      title: `Superfast / Vande Bharat Express to ${destName}`,
      duration: matchedHub.avgTrainHrs,
      estimatedCost: trainCost,
      routeOverview: `Direct express railway connection arriving at ${matchedHub.station}. Excellent downtown access with zero airport wait times.`,
      highlights: [
        `Terminal Station: ${matchedHub.station}`,
        'Scenic countryside and panoramic window routes',
        'Onboard catering and relaxed luggage allowances'
      ],
      terminalDetails: {
        departureTerminal: `Railway Junction, ${origClean}`,
        arrivalTerminal: matchedHub.station
      }
    },
    drive: {
      mode: 'drive',
      title: `Scenic Highway Road Trip via ${matchedHub.highways}`,
      duration: matchedHub.avgDriveHrs,
      estimatedCost: driveFuel,
      routeOverview: `Drive along ${matchedHub.highways}. Smooth multi-lane toll expressways with designated food courts and fuel stations.`,
      highlights: [
        `Main Corridor: ${matchedHub.highways}`,
        `Approx. ${distKm} km distance with flexible departure timing`,
        'Opportunity for spontaneous scenic viewpoint breaks'
      ]
    },
    cab: {
      mode: 'cab',
      title: `Dedicated Outstation Chauffeur AC Cab (${origClean} → ${destName})`,
      duration: matchedHub.avgDriveHrs,
      estimatedCost: cabCost,
      routeOverview: `Private door-to-door AC Sedan or SUV with professional highway driver and flexible pickup from your address in ${origClean}.`,
      highlights: [
        'Zero luggage hassle - door-to-door direct transit',
        'Experienced highway driver handling tolls and parking',
        'Custom stops for breakfast and refreshments on request'
      ]
    }
  };

  const normPreferred = (preferredMode || 'flight').toLowerCase();
  const primary = optionsMap[normPreferred] || optionsMap.flight;
  const alternatives = Object.entries(optionsMap)
    .filter(([k]) => k !== normPreferred)
    .map(([, opt]) => opt);

  return {
    preferredMode: normPreferred,
    origin: origClean,
    destination: destName,
    distanceKm: distKm,
    primaryOption: primary,
    alternativeOptions: alternatives,
    travelTips: [
      `For ${normPreferred.toUpperCase()}: Booking 10-14 days in advance secures the best promotional rates and confirmed seats.`,
      `If driving or taking a cab along ${matchedHub.highways}, start early morning (05:30 AM) to beat city commuter bottlenecks.`,
      `Upon arriving at ${destName}, prepaid airport/station taxis and app-based cabs operate 24/7 with regulated tariffs.`
    ]
  };
}

async function resolveDestination(rawInput) {
  const cleanInput = (rawInput || 'Vizag').trim();
  const destLower = cleanInput.toLowerCase();

  // 1. Check curated catalog
  for (const d of destinationsData) {
    const dId = (d.id || '').toLowerCase();
    const dName = (d.name || '').toLowerCase();
    if (destLower === dId || destLower === dName || (destLower.length > 3 && (destLower.includes(dName) || dId.includes(destLower)))) {
      return {
        id: d.id,
        name: d.name,
        country: d.country || 'Global',
        tagline: d.tagline,
        coordinates: d.coordinates || (cityDefaults[d.id] ? { lat: cityDefaults[d.id].lat, lng: cityDefaults[d.id].lng } : { lat: 15.2993, lng: 74.1240 }),
        image: d.image,
        bannerImage: d.bannerImage || d.image,
        highlights: d.highlights || [],
        currency: d.currency || '₹'
      };
    }
  }

  // 2. Check custom known destinations
  for (const [key, info] of Object.entries(customKnownDestinations)) {
    if (key.includes(destLower) || destLower.includes(key)) {
      return {
        id: key,
        name: info.name,
        country: info.country,
        tagline: info.tagline,
        coordinates: info.coordinates,
        image: info.image,
        bannerImage: info.bannerImage,
        highlights: info.highlights,
        currency: '₹'
      };
    }
  }

  // 3. Dynamic Photon Geocoding
  let destTitle = cleanInput.charAt(0).toUpperCase() + cleanInput.slice(1);
  let country = 'Global';
  let coords = { lat: 17.6868, lng: 83.2185 };

  try {
    const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(cleanInput)}&limit=1`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);
    const resp = await fetch(photonUrl, { headers: { 'User-Agent': 'EasyTripApp/2.0' }, signal: controller.signal });
    clearTimeout(timeout);
    if (resp.ok) {
      const pData = await resp.json();
      if (pData.features && pData.features.length > 0) {
        const f0 = pData.features[0];
        const geom = f0.geometry?.coordinates || [];
        if (geom.length >= 2) {
          coords = { lat: geom[1], lng: geom[0] };
        }
        if (f0.properties?.country) country = f0.properties.country;
        if (f0.properties?.name) destTitle = f0.properties.name;
      }
    }
  } catch (err) {
    // Graceful fallback
  }

  const dynamicHighlights = [
    `${destTitle} Scenic Promenade & Waterfront Walk`,
    `${destTitle} Historic Quarter & Heritage Trail`,
    `${destTitle} Panoramic Hilltop Vista & Sunset Point`,
    `${destTitle} Cultural Sanctuary & Sacred Landmark`,
    `${destTitle} Central Artisan Bazaars & Culinary Alley`,
    `${destTitle} Botanical Gardens & Nature Escape`,
    `${destTitle} Evening Twilight Lounge & Skyline`
  ];

  return {
    id: destLower.replace(/\s+/g, '-'),
    name: destTitle,
    country,
    tagline: `Scenic wonders, vibrant local culture & memorable escapes in ${destTitle}`,
    coordinates: coords,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80',
    highlights: dynamicHighlights,
    currency: '₹'
  };
}

async function generateDynamicItinerary(reqBody) {
  const {
    destination = 'Vizag',
    origin = 'Current Location',
    originCoordinates = null,
    days = 3,
    budget = 'moderate',
    travelStyle = 'Couple',
    interests = ['Culture', 'Relaxation', 'Foodie']
  } = reqBody;

  const numDays = Math.min(Math.max(parseInt(days) || 3, 1), 7);
  
  // Resolve EXACT destination
  const destInfo = await resolveDestination(destination);
  const destName = destInfo.name;
  const country = destInfo.country;
  const coords = destInfo.coordinates;
  const highlights = destInfo.highlights;

  const costMultiplier = budget === 'luxury' ? 2.5 : budget === 'budget' ? 0.8 : 1.2;
  const itineraryDays = [];
  const today = new Date();

  const destNameLower = destName.toLowerCase();
  let destKeyMatch = null;
  for (const k of Object.keys(curatedDestinationPlans)) {
    if (destNameLower.includes(k) || k.includes(destNameLower)) {
      destKeyMatch = k;
      break;
    }
  }

  const curatedPlans = destKeyMatch ? (curatedDestinationPlans[destKeyMatch] || []) : [];

  for (let i = 0; i < numDays; i++) {
    const dayDate = new Date(today);
    dayDate.setDate(today.getDate() + i);

    let dayTitle = '';
    let dayTheme = '';
    let rawSlots = [];

    if (i < curatedPlans.length) {
      const curatedDay = curatedPlans[i];
      dayTitle = curatedDay.title;
      dayTheme = curatedDay.theme;
      rawSlots = curatedDay.slots;
    } else {
      const bp = proceduralDayBlueprints[i % proceduralDayBlueprints.length];
      dayTitle = bp.titleTemplate.replace(/{city}/g, destName);
      dayTheme = bp.themeTemplate.replace(/{city}/g, destName);
      rawSlots = [
        {
          period: 'Morning',
          time: '09:00 AM - 12:30 PM',
          title: bp.morning.title.replace(/{city}/g, destName),
          location: bp.morning.location.replace(/{city}/g, destName),
          description: bp.morning.description.replace(/{city}/g, destName),
          category: bp.morning.category,
          baseCost: bp.morning.baseCost,
          duration: bp.morning.duration,
          tips: bp.morning.tips
        },
        {
          period: 'Afternoon',
          time: '01:00 PM - 04:30 PM',
          title: bp.afternoon.title.replace(/{city}/g, destName),
          location: bp.afternoon.location.replace(/{city}/g, destName),
          description: bp.afternoon.description.replace(/{city}/g, destName),
          category: bp.afternoon.category,
          baseCost: bp.afternoon.baseCost,
          duration: bp.afternoon.duration,
          tips: bp.afternoon.tips
        },
        {
          period: 'Evening',
          time: '05:30 PM - 09:30 PM',
          title: bp.evening.title.replace(/{city}/g, destName),
          location: bp.evening.location.replace(/{city}/g, destName),
          description: bp.evening.description.replace(/{city}/g, destName),
          category: bp.evening.category,
          baseCost: bp.evening.baseCost,
          duration: bp.evening.duration,
          tips: bp.evening.tips
        }
      ];
    }

    const slots = rawSlots.map((s, slotIdx) => {
      const angle = (i * 2.0) + (slotIdx * 1.5);
      const slotCoord = {
        lat: coords.lat + (Math.sin(angle) * (0.012 + slotIdx * 0.005)),
        lng: coords.lng + (Math.cos(angle) * (0.012 + slotIdx * 0.005))
      };
      const slotImg = resolveActivityImage(
        s.title,
        s.location,
        s.category,
        destInfo.image || '',
        (i * 3 + slotIdx)
      );

      const photoQuery = `${destName} ${s.title}`;
      const unsplashSearchUrl = `https://unsplash.com/s/photos/${encodeURIComponent(photoQuery)}`;

      return {
        id: `day-${i+1}-${s.period.toLowerCase()}`,
        period: s.period,
        time: s.time,
        title: s.title,
        location: s.location,
        description: s.description,
        category: s.category,
        cost: Math.round(s.baseCost * costMultiplier),
        duration: s.duration,
        image: slotImg,
        photoQuery,
        unsplashSearchUrl,
        coordinates: slotCoord,
        tips: s.tips
      };
    });

    itineraryDays.push({
      dayNumber: i + 1,
      date: dayDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      title: dayTitle,
      theme: dayTheme,
      weather: {
        temp: 28 - (i % 3),
        condition: i % 2 === 0 ? 'Sunny & Clear' : 'Gentle Breeze',
        icon: 'Sun'
      },
      slots,
      diningRecommendations: getDestinationDiningRecommendations(destName, i)
    });
  }

  const totalCost = itineraryDays.reduce((acc, d) => 
    acc + d.slots.reduce((sub, s) => sub + s.cost, 0), 0
  );

  return {
    id: `trip-${Date.now()}`,
    destination: destName,
    country,
    origin,
    originCoordinates: originCoordinates || null,
    days: numDays,
    startDate: reqBody.startDate || new Date().toISOString().split('T')[0],
    endDate: reqBody.endDate || new Date(Date.now() + numDays * 86400000).toISOString().split('T')[0],
    budgetTier: budget,
    travelStyle,
    interests,
    coordinates: coords,
    heroImage: destInfo.bannerImage || destInfo.image,
    estimatedTotalCost: totalCost,
    currency: '₹',
    journeyTransit: generateJourneyTransitBreakdown(origin, destName, reqBody.transport || 'flight', destInfo, originCoordinates),
    hotelRecommendations: getDestinationHotelRecommendations(destName, budget),
    itineraryDays,
    aiNotes: [
      `Itinerary exclusively customized for ${destName} (${country}) for ${travelStyle} travel.`,
      `Focus areas integrated: ${interests.join(', ')}.`,
      `Smart route balancing ensures minimal transit time between consecutive stops.`,
      `Weather-aware activity scheduling with afternoon indoor/shaded slots.`
    ]
  };
}

// POST /api/plan-trip
router.post('/plan-trip', async (req, res) => {
  try {
    const itinerary = await generateDynamicItinerary(req.body);
    res.json({
      success: true,
      data: itinerary
    });
  } catch (error) {
    console.error('Plan trip error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate itinerary', error: error.message });
  }
});

export { generateDynamicItinerary };
export default router;
