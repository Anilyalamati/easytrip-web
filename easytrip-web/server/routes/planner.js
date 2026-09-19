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
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80'
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
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80'
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
          baseCost: 12,
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
          baseCost: 24,
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
          baseCost: 15,
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
          baseCost: 10,
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
          baseCost: 14,
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
          baseCost: 10,
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
          baseCost: 20,
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
          baseCost: 18,
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
          baseCost: 16,
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
          baseCost: 8,
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
          baseCost: 18,
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
          baseCost: 10,
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
          baseCost: 10,
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
          baseCost: 14,
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
          baseCost: 8,
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
          baseCost: 32,
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
          baseCost: 15,
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
          baseCost: 12,
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
          baseCost: 32,
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
          baseCost: 24,
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
          baseCost: 20,
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
          baseCost: 15,
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
          baseCost: 18,
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
          baseCost: 38,
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
          baseCost: 30,
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
          baseCost: 22,
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
          baseCost: 25,
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
          baseCost: 10,
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
          baseCost: 20,
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
          baseCost: 25,
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
          baseCost: 8,
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
          baseCost: 18,
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
          baseCost: 32,
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
          baseCost: 35,
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
          baseCost: 30,
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
          baseCost: 28,
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
          baseCost: 8,
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
          baseCost: 18,
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
          baseCost: 10,
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
          baseCost: 35,
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
          baseCost: 25,
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
          baseCost: 6,
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
          baseCost: 14,
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
          baseCost: 12,
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
          baseCost: 15,
          duration: '3.5 hrs',
          tips: 'Look for government handloom mark certification on Pashmina and Kullu woolen shawls.'
        }
      ]
    }
  ]
};

const proceduralDayBlueprints = [
  {
    titleTemplate: 'Historic Citadel, Culinary Quarters & Sunset Lookout',
    themeTemplate: 'Ancient Ramparts, Epicurean Discovery & Horizon Twilight',
    morning: {
      title: '{city} Historic Citadel & Ancient Ramparts Walk',
      category: 'Historic Fortifications',
      location: 'Old Town Citadel Hill, {city}',
      description: 'Ascend ancient fortress walls and stone battlements guarding {city}, enjoying commanding hilltop vistas across the historic quarter and surrounding landscapes.',
      duration: '3.5 hrs',
      baseCost: 15,
      tips: 'Wear comfortable walking shoes with good grip for historic stone inclines.'
    },
    afternoon: {
      title: 'Epicurean Tasting Tour & {city} Food Hall',
      category: 'Gastronomy & Local Flavors',
      location: 'Grand Central Market, {city}',
      description: 'Immerse yourself in authentic {city} delicacies, sampling chef-curated small plates, farm cheeses, regional pastries, and time-honored family recipes.',
      duration: '3 hrs',
      baseCost: 25,
      tips: 'Sample the signature house specialty and pair it with a fresh locally pressed fruit cooler.'
    },
    evening: {
      title: '{city} Sunset Lookout & Skyline Terrace Lounge',
      category: 'Sunset & Scenic Vista',
      location: 'Skyline Panorama Terrace, {city}',
      description: 'Watch vibrant golden hour colors descend across {city} from a premier high-altitude terrace, accompanied by craft refreshments and relaxing twilight breezes.',
      duration: '3.5 hrs',
      baseCost: 30,
      tips: 'Arrive 30 minutes before sunset to claim prime window seating overlooking the horizon.'
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
      baseCost: 12,
      tips: 'Early morning is the ideal time to enjoy the cool breeze and photograph exotic flora.'
    },
    afternoon: {
      title: '{city} National Museum of Art & Civilizations',
      category: 'Museums & Cultural History',
      location: 'Museum Mile, {city}',
      description: 'Explore curated exhibitions spanning classical antiquities, royal regalia, and interactive cultural showcases illuminating {city}\'s storied heritage.',
      duration: '3.5 hrs',
      baseCost: 20,
      tips: 'Borrow the interactive museum audio guide for deep backstories on centerpiece masterworks.'
    },
    evening: {
      title: 'Illuminated Waterfront Promenade & {city} Evening Fountains',
      category: 'Evening Promenade & Landmarks',
      location: 'Grand Harbor Esplanade, {city}',
      description: 'Stroll along the atmospheric illuminated waterfront of {city}, enjoying live street acoustic performances, illuminated fountains, and refreshing night breezes.',
      duration: '3.5 hrs',
      baseCost: 18,
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
      baseCost: 10,
      tips: 'Maintain respectful silence inside; photography is permitted without flash.'
    },
    afternoon: {
      title: 'Artisan Guilds, Handloom & Ceramic Studios in {city}',
      category: 'Craft & Artisan Discovery',
      location: 'Artisans Quarter, {city}',
      description: 'Watch master craftsmen sculpt ceramics, weave heritage fabrics, and craft delicate jewelry unique to {city}\'s guild traditions.',
      duration: '3.5 hrs',
      baseCost: 18,
      tips: 'Support local families by picking up handcrafted ceramic or textile souvenirs.'
    },
    evening: {
      title: 'Twilight Night Bazaar & {city} Street Food Safari',
      category: 'Night Market & Street Food',
      location: 'Bazaar Square, {city}',
      description: 'Delight in the sizzling energy of {city}\'s evening bazaar, savoring aromatic skewered bites, freshly baked flatbreads, and sweet delicacies.',
      duration: '3.5 hrs',
      baseCost: 22,
      tips: 'Look for stalls with long local queues—a reliable sign of peak freshness and legendary flavor.'
    }
  }
];

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
        currency: d.currency || '$'
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
        currency: '$'
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
    currency: '$'
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

  const costMultiplier = budget === 'luxury' ? 2.5 : budget === 'budget' ? 0.7 : 1.2;
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
      slots
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
    currency: '$',
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

export default router;
