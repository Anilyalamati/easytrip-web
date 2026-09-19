# EasyTrip — Full-Stack Travel Companion & AI Itinerary Planner

EasyTrip is a luxury travel intelligence web platform featuring AI day-by-day itinerary design, real road route guidance, boutique hotel & transport booking, and 24/7 travel safety SOS tools.

---

## 🚀 Free Production Deployment Guide

### 1. Deploy the Backend (Python FastAPI) on [Render](https://render.com)
1. Push this repository to **GitHub** or **GitLab**.
2. Go to **Render Dashboard** → **New +** → **Web Service**.
3. Connect your repository.
4. Render will auto-detect the configuration from:
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT` (auto-loaded from `Procfile`)
5. Select the **Free Plan** and click **Create Web Service**.
6. Once deployed, copy your Render service URL (e.g. `https://easytrip-backend.onrender.com`).

---

### 2. Deploy the Frontend (React + Vite + Tailwind) on [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
1. Go to **Vercel** or **Netlify** → **Add New Project**.
2. Connect your repository.
3. Configure the build settings:
   - **Root Directory**: `easytrip-web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. In the **Environment Variables** section, add:
   ```env
   VITE_API_URL=https://your-render-backend-url.onrender.com
   ```
5. Click **Deploy**. Your EasyTrip application is now live worldwide!

---

## 💻 Local Development

### Option A: Python Backend + React Vite Frontend
1. **Start the Python FastAPI Backend**:
   ```bash
   uvicorn app:app --port 5000 --reload
   ```
2. **Start the React Frontend**:
   ```bash
   cd easytrip-web
   npm install
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173).

---

### Option B: All-in-One Node Backend & Frontend
```bash
cd easytrip-web
npm install
npm start
```
Starts both the Express API server (port 5000) and the Vite dev server (port 5173) concurrently.
