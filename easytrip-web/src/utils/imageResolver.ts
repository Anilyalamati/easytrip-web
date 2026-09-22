/**
 * EasyTrip Image Resolver Helper
 * Resolves verified destination & attraction photography from Wikipedia or Unsplash.
 * Ensures "Vizag", "Visakhapatnam", and "RK Beach" prioritize searching for
 * "Ramakrishna Mission Beach" or "Beach Road, Visakhapatnam" so it never defaults
 * to generic mountain or Himalayan stock photos.
 */

export const VERIFIED_LANDMARK_IMAGES: Record<string, string> = {
  vizag: 'https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?auto=format&fit=crop&w=1200&q=80',
  visakhapatnam: 'https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?auto=format&fit=crop&w=1200&q=80',
  'rk beach': 'https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?auto=format&fit=crop&w=1200&q=80',
  'rk beach promenade': 'https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?auto=format&fit=crop&w=1200&q=80',
  'ramakrishna beach': 'https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?auto=format&fit=crop&w=1200&q=80',
  'ramakrishna mission beach': 'https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?auto=format&fit=crop&w=1200&q=80',
  'beach road, visakhapatnam': 'https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?auto=format&fit=crop&w=1200&q=80',
  rajahmundry: 'https://upload.wikimedia.org/wikipedia/commons/9/94/Archbridgegodavari.JPG',
  'godavari arch bridge': 'https://upload.wikimedia.org/wikipedia/commons/9/94/Archbridgegodavari.JPG',
  kailasagiri: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Kailasagiri.jpg',
  'ins kursura': 'https://upload.wikimedia.org/wikipedia/commons/f/fd/INS_Kursura_%28S20%29_underway.jpg',
  simhachalam: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Simhachalam_Temple.jpg/330px-Simhachalam_Temple.jpg',
  'borra caves': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Borra_Caves_Inside_View.jpg/330px-Borra_Caves_Inside_View.jpg',
  'ooty lake': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Ooty_Lake%2C_Tamil_Nadu%2C_India.jpg/330px-Ooty_Lake%2C_Tamil_Nadu%2C_India.jpg',
  'nilgiri mountain railway': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Nilgiri_Mountain_Railway_steam_locomotive.jpg/330px-Nilgiri_Mountain_Railway_steam_locomotive.jpg',
  'eiffel tower': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Tour_Eiffel_Wikimedia_Commons.jpg/330px-Tour_Eiffel_Wikimedia_Commons.jpg',
  louvre: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Louvre_Museum_Wikimedia_Commons.jpg/330px-Louvre_Museum_Wikimedia_Commons.jpg',
};

export async function resolveLandmarkPhoto(placeName: string): Promise<string> {
  if (!placeName || !placeName.trim()) {
    return 'https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?auto=format&fit=crop&w=1200&q=80';
  }

  const cleanName = placeName.trim();
  const lower = cleanName.toLowerCase();

  // 1. Check local verified cache
  for (const [key, url] of Object.entries(VERIFIED_LANDMARK_IMAGES)) {
    if (lower === key || lower.includes(key) || key.includes(lower)) {
      return url;
    }
  }

  // 2. Build prioritized Wikipedia search candidates
  const candidates: string[] = [];
  const isVizagOrBeach = ['vizag', 'visakhapatnam', 'rk beach', 'ramakrishna'].some(t => lower.includes(t));
  if (isVizagOrBeach) {
    candidates.push(
      'Ramakrishna Mission Beach',
      'Beach Road, Visakhapatnam',
      'Visakhapatnam'
    );
  }
  candidates.push(cleanName);

  // 3. Query Wikipedia API
  for (const cand of candidates) {
    try {
      const encoded = encodeURIComponent(cand.replace(/ /g, '_'));
      const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`, {
        headers: { 'User-Agent': 'EasyTrip/1.0 (travel-planner@easytrip.travel)' }
      });
      if (res.ok) {
        const data = await res.json();
        const img = data.thumbnail?.source || data.originalimage?.source;
        if (img) {
          VERIFIED_LANDMARK_IMAGES[lower] = img;
          return img;
        }
      }
    } catch {
      // Continue to next candidate
    }
  }

  // 4. Fallback
  if (isVizagOrBeach) {
    return 'https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?auto=format&fit=crop&w=1200&q=80';
  }

  return `https://images.unsplash.com/featured/?${encodeURIComponent(cleanName)}`;
}
