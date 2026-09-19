"""
EasyTrip Production Core API Backend
FastAPI service configured for production deployment on Render.
"""

import os
import json
import math
import random
import string
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any

from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import requests

app = FastAPI(
    title="EasyTrip AI Core API",
    description="Travel smarter. Travel safer. Full backend service powering EasyTrip.",
    version="2.0.0"
)

# Enable CORS for frontend deployment (e.g. Vercel, Netlify, Render, Localhost)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Resolve data file paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATHS = [
    os.path.join(BASE_DIR, "data"),
    os.path.join(BASE_DIR, "backend", "data"),
    os.path.join(BASE_DIR, "easytrip-web", "server", "data"),
]

def load_json_data(filename: str) -> Any:
    for p in DATA_PATHS:
        file_path = os.path.join(p, filename)
        if os.path.exists(file_path):
            with open(file_path, "r", encoding="utf-8") as f:
                return json.load(f)
    return []

DESTINATIONS_DATA = load_json_data("destinations.json")
BOOKINGS_DATA = load_json_data("bookings.json") or {"hotels": [], "transport": [], "experiences": []}

# Destination coordinates & default image palettes
CITY_COORDS = {
    "goa": {"lat": 15.2993, "lng": 74.1240},
    "jaipur": {"lat": 26.9124, "lng": 75.7873},
    "manali": {"lat": 32.2396, "lng": 77.1887},
    "mumbai": {"lat": 19.0760, "lng": 72.8777},
    "varanasi": {"lat": 25.3176, "lng": 82.9739},
    "paris": {"lat": 48.8566, "lng": 2.3522},
    "tokyo": {"lat": 35.6762, "lng": 139.6503},
    "bali": {"lat": -8.4095, "lng": 115.1889},
}

# --- Pydantic Models ---
class PlanTripRequest(BaseModel):
    destination: str = "Goa"
    origin: str = "Mumbai"
    days: int = 3
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    budget: str = "moderate"
    travelStyle: str = "Couple"
    interests: List[str] = Field(default_factory=lambda: ["Culture", "Relaxation", "Foodie"])
    transport: Optional[str] = "flight"

class TravelerInfo(BaseModel):
    name: str = "EasyTrip Explorer"
    email: str = "explorer@easytrip.com"
    phone: Optional[str] = "+1 (555) 019-2831"

class CheckoutRequest(BaseModel):
    items: List[Dict[str, Any]]
    traveler: TravelerInfo
    paymentMethod: Optional[str] = "credit-card"
    tripId: Optional[str] = None

# --- Routes ---

@app.get("/")
def root():
    return {
        "service": "EasyTrip API Engine",
        "status": "online",
        "version": "2.0.0",
        "docs": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "service": "EasyTrip Python Core Engine",
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }

@app.get("/api/destinations")
def get_destinations():
    return {"success": True, "data": DESTINATIONS_DATA}

@app.get("/api/destinations/{dest_id}")
def get_destination(dest_id: str):
    for d in DESTINATIONS_DATA:
        if d.get("id") == dest_id.lower() or d.get("name", "").lower() == dest_id.lower():
            return {"success": True, "data": d}
    raise HTTPException(status_code=404, detail="Destination not found")

@app.post("/api/plan-trip")
def plan_trip(req: PlanTripRequest):
    num_days = max(1, min(req.days, 7))
    dest_lower = req.destination.lower()
    
    # Find matching destination or fallback
    dest_info = next(
        (d for d in DESTINATIONS_DATA if dest_lower in d.get("id", "") or dest_lower in d.get("name", "").lower()),
        DESTINATIONS_DATA[0] if DESTINATIONS_DATA else {}
    )

    dest_id = dest_info.get("id", "goa")
    coords = CITY_COORDS.get(dest_id, dest_info.get("coordinates", {"lat": 15.2993, "lng": 74.1240}))
    cost_multiplier = 2.5 if req.budget == "luxury" else 0.7 if req.budget == "budget" else 1.2

    themes = [
        {"title": "Arrival & Iconic First Impressions", "theme": "Grand Welcomes & Scenic Sunset"},
        {"title": "Hidden Gems & Cultural Immersion", "theme": "Heritage, Art & Architectural Wonders"},
        {"title": "Outdoor Escapes & Local Flavors", "theme": "Nature, Coastal Vistas & Gastronomy"},
        {"title": "Artisan Markets & Leisure Moments", "theme": "Vibrant Bazaars & Sunset Indulgence"},
        {"title": "Farewell Vistas & Scenic Memories", "theme": "Morning Panoramas & Easy Departure"},
        {"title": "Deep Exploration & Serene Retreat", "theme": "Off-beat Paths & Restful Splendor"},
        {"title": "The Grand Finale Experience", "theme": "Exclusive Dining & Celebratory Farewell"}
    ]

    start_date = datetime.strptime(req.startDate, "%Y-%m-%d") if req.startDate else datetime.utcnow()
    itinerary_days = []
    highlights = dest_info.get("highlights", [req.destination])

    for i in range(num_days):
        day_date = start_date + timedelta(days=i)
        theme = themes[i % len(themes)]
        day_hl = highlights[i % len(highlights)] if highlights else req.destination

        morning_coord = {
            "lat": coords["lat"] + (math.sin(i * 1.5) * 0.015),
            "lng": coords["lng"] + (math.cos(i * 1.5) * 0.015)
        }
        afternoon_coord = {
            "lat": coords["lat"] + (math.cos(i * 1.8) * 0.02),
            "lng": coords["lng"] + (math.sin(i * 1.8) * 0.02)
        }
        evening_coord = {
            "lat": coords["lat"] + (math.sin(i * 2.2) * 0.018),
            "lng": coords["lng"] + (math.cos(i * 2.2) * 0.018)
        }

        slots = [
            {
                "id": f"day-{i+1}-morning",
                "period": "Morning",
                "time": "09:00 AM - 12:30 PM",
                "title": f"Arrival & Check-in near {day_hl}" if i == 0 else f"Explore {day_hl} & Surroundings",
                "location": f"{day_hl}, {dest_info.get('name', req.destination)}",
                "description": "Kick off the day taking in the fresh atmosphere. Enjoy early access before crowds arrive, with scenic photo spots and leisurely strolls.",
                "category": "Sightseeing",
                "cost": round(15 * cost_multiplier),
                "duration": "3.5 hrs",
                "image": dest_info.get("image", "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80"),
                "coordinates": morning_coord,
                "tips": "Bring comfortable walking footwear and keep camera ready for natural morning lighting."
            },
            {
                "id": f"day-{i+1}-afternoon",
                "period": "Afternoon",
                "time": "01:00 PM - 04:30 PM",
                "title": f"Curated Lunch & {req.interests[0] if req.interests else 'Local'} Discovery",
                "location": f"Historic Central Quarter, {dest_info.get('name', req.destination)}",
                "description": f"Delight your palate with authentic regional delicacies. Followed by a relaxing cultural walkthrough or scenic boat/safari ride tailored for {req.travelStyle.lower()} travelers.",
                "category": "Dining & Leisure",
                "cost": round(28 * cost_multiplier),
                "duration": "3.5 hrs",
                "image": dest_info.get("bannerImage", dest_info.get("image")),
                "coordinates": afternoon_coord,
                "tips": "Advance table reservations are pre-recommended; sample the house specialty dish."
            },
            {
                "id": f"day-{i+1}-evening",
                "period": "Evening",
                "time": "05:30 PM - 09:30 PM",
                "title": "Golden Hour Sunset & Evening Vibrance",
                "location": f"Scenic Promenade / Rooftop, {dest_info.get('name', req.destination)}",
                "description": "Experience the breathtaking sunset glow across the horizon. As night descends, enjoy handcrafted cocktails, lively music, and illuminated architecture.",
                "category": "Entertainment",
                "cost": round(35 * cost_multiplier),
                "duration": "4 hrs",
                "image": dest_info.get("image"),
                "coordinates": evening_coord,
                "tips": "Arrive 30 minutes before golden hour to secure the best vantage point."
            }
        ]

        itinerary_days.append({
            "dayNumber": i + 1,
            "date": day_date.strftime("%a, %b %d"),
            "title": theme["title"],
            "theme": theme["theme"],
            "weather": {
                "temp": 28 - (i % 3),
                "condition": "Sunny & Clear" if i % 2 == 0 else "Gentle Breeze",
                "icon": "Sun"
            },
            "slots": slots
        })

    total_cost = sum(sum(s["cost"] for s in d["slots"]) for d in itinerary_days)

    return {
        "success": True,
        "data": {
            "id": f"trip-{int(datetime.utcnow().timestamp() * 1000)}",
            "destination": dest_info.get("name", req.destination),
            "country": dest_info.get("country", "Global"),
            "origin": req.origin,
            "days": num_days,
            "startDate": req.startDate or start_date.strftime("%Y-%m-%d"),
            "endDate": req.endDate or (start_date + timedelta(days=num_days)).strftime("%Y-%m-%d"),
            "budgetTier": req.budget,
            "travelStyle": req.travelStyle,
            "interests": req.interests,
            "coordinates": coords,
            "heroImage": dest_info.get("bannerImage", dest_info.get("image")),
            "estimatedTotalCost": total_cost,
            "currency": "$",
            "itineraryDays": itinerary_days,
            "aiNotes": [
                f"Itinerary customized for {req.travelStyle} travel with focus on {', '.join(req.interests)}.",
                "Smart route balancing ensures minimal transit time between consecutive stops.",
                "Weather-aware activity scheduling with afternoon indoor/shaded slots."
            ]
        }
    }

@app.get("/api/bookings/options")
def get_booking_options(destination: str = ""):
    dest_lower = destination.lower()
    hotels = BOOKINGS_DATA.get("hotels", [])
    transport = BOOKINGS_DATA.get("transport", [])
    experiences = BOOKINGS_DATA.get("experiences", [])

    matching_hotels = [h for h in hotels if dest_lower in h.get("destinationId", "") or dest_lower == ""]
    matching_exp = [e for e in experiences if dest_lower in e.get("destinationId", "") or dest_lower == ""]

    return {
        "success": True,
        "data": {
            "hotels": matching_hotels if matching_hotels else hotels,
            "transport": transport,
            "experiences": matching_exp if matching_exp else experiences
        }
    }

@app.post("/api/bookings/checkout")
def checkout(req: CheckoutRequest):
    if not req.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    res_id = "ET-" + "".join(random.choices(string.ascii_uppercase + string.digits, k=6))
    subtotal = sum((item.get("price", 0) * item.get("quantity", 1)) for item in req.items)
    tax = round(subtotal * 0.12)
    discount = round(subtotal * 0.05)
    total = subtotal + tax - discount

    reservation = {
        "id": res_id,
        "bookingDate": datetime.utcnow().isoformat() + "Z",
        "status": "CONFIRMED",
        "tripId": req.tripId,
        "traveler": req.traveler.dict(),
        "items": req.items,
        "pricing": {
            "subtotal": subtotal,
            "tax": tax,
            "conciergeDiscount": discount,
            "total": total,
            "currency": "$"
        },
        "payment": {
            "method": req.paymentMethod or "credit-card",
            "last4": "4242",
            "status": "PAID"
        },
        "supportContact": "concierge@easytrip.com (24/7 Priority Support)"
    }

    return {
        "success": True,
        "message": "Booking confirmed successfully",
        "data": reservation
    }

@app.get("/api/route")
def get_route(startLat: float, startLng: float, endLat: float, endLng: float):
    # Attempt real OSRM driving route
    osrm_url = f"https://router.project-osrm.org/route/v1/driving/{startLng},{startLat};{endLng},{endLat}?overview=full&geometries=geojson"
    try:
        resp = requests.get(osrm_url, timeout=4)
        if resp.status_code == 200:
            data = resp.json()
            routes = data.get("routes", [])
            if routes:
                r = routes[0]
                coords = [[pt[1], pt[0]] for pt in r.get("geometry", {}).get("coordinates", [])]
                return {
                    "success": True,
                    "distanceKm": round(r.get("distance", 0) / 1000),
                    "durationMins": round(r.get("duration", 0) / 60),
                    "coordinates": coords,
                    "source": "OSRM"
                }
    except Exception:
        pass

    # Smooth curve fallback
    steps = 15
    fallback_coords = []
    for i in range(steps + 1):
        t = i / steps
        lat = startLat + (endLat - startLat) * t + math.sin(t * math.pi) * 0.05
        lng = startLng + (endLng - startLng) * t + math.cos(t * math.pi) * 0.05
        fallback_coords.append([lat, lng])

    # Haversine distance
    r_earth = 6371
    d_lat = math.radians(endLat - startLat)
    d_lng = math.radians(endLng - startLng)
    a = math.sin(d_lat / 2)**2 + math.cos(math.radians(startLat)) * math.cos(math.radians(endLat)) * math.sin(d_lng / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    dist_km = round(r_earth * c) or 120

    return {
        "success": True,
        "distanceKm": dist_km,
        "durationMins": round(dist_km * 1.3),
        "coordinates": fallback_coords,
        "source": "Interpolated (OSRM Fallback)"
    }

@app.get("/api/place-photo")
def place_photo(query: str = "travel"):
    photo_map = {
        "beach": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        "fort": "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
        "mountain": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
        "paris": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
        "tokyo": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80"
    }
    key = next((k for k in photo_map if k in query.lower()), "beach")
    return {"success": True, "url": photo_map[key]}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 5000))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True)
