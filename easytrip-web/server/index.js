import express from 'express';
import cors from 'cors';
import plannerRouter from './routes/planner.js';
import destinationsRouter from './routes/destinations.js';
import bookingsRouter from './routes/bookings.js';
import routeRouter from './routes/route.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Endpoints
app.use('/api', plannerRouter);
app.use('/api/destinations', destinationsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/route', routeRouter);

// Place photo proxy endpoint (mirroring the app's https://easytrip-backend-1.onrender.com/api/place-photo?query=)
app.get('/api/place-photo', (req, res) => {
  const { query = 'travel' } = req.query;
  // Redirect to high quality photography matching query
  const photoMap = {
    beach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    fort: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    mountain: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    paris: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    tokyo: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80'
  };
  const key = Object.keys(photoMap).find(k => query.toLowerCase().includes(k)) || 'beach';
  res.json({ success: true, url: photoMap[key] });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'EasyTrip Core API Engine',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[EasyTrip Core API] running on http://127.0.0.1:${PORT}`);
});
