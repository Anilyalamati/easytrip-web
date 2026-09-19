import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
  const { startLat, startLng, endLat, endLng } = req.query;

  if (!startLat || !startLng || !endLat || !endLng) {
    return res.status(400).json({
      success: false,
      message: 'startLat, startLng, endLat, and endLng are required'
    });
  }

  const origin = `${startLng},${startLat}`;
  const dest = `${endLng},${endLat}`;
  const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${origin};${dest}?overview=full&geometries=geojson`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(osrmUrl, { signal: controller.signal });
    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const coordinates = route.geometry.coordinates.map(pt => [pt[1], pt[0]]); // [lat, lng]
        return res.json({
          success: true,
          distanceKm: Math.round(route.distance / 1000),
          durationMins: Math.round(route.duration / 60),
          coordinates,
          source: 'OSRM'
        });
      }
    }
  } catch (err) {
    // Graceful fallback below
  }

  // Graceful fallback geometry interpolation
  const sLat = parseFloat(startLat);
  const sLng = parseFloat(startLng);
  const eLat = parseFloat(endLat);
  const eLng = parseFloat(endLng);

  const steps = 15;
  const fallbackCoords = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lat = sLat + (eLat - sLat) * t + Math.sin(t * Math.PI) * 0.05;
    const lng = sLng + (eLng - sLng) * t + Math.cos(t * Math.PI) * 0.05;
    fallbackCoords.push([lat, lng]);
  }

  // Haversine distance
  const R = 6371;
  const dLat = (eLat - sLat) * Math.PI / 180;
  const dLon = (eLng - sLng) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(sLat * Math.PI / 180) * Math.cos(eLat * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distKm = Math.round(R * c);

  res.json({
    success: true,
    distanceKm: distKm || 120,
    durationMins: Math.round((distKm || 120) * 1.3),
    coordinates: fallbackCoords,
    source: 'Interpolated (OSRM Fallback)'
  });
});

export default router;
