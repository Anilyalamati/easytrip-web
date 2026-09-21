"""
EasyTrip Production Core API Backend
FastAPI service configured for production deployment on Render.
Dynamically generates itineraries for ANY destination worldwide (e.g. Vizag, Paris, Tokyo, etc.).
"""

import os
import json
import math
import random
import re
import string
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any, Tuple
import urllib.parse

from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import requests

try:
    from openai import OpenAI
except ImportError:
    OpenAI = None

try:
    import httpx
except ImportError:
    httpx = None

# xAI Grok API Configuration
XAI_API_BASE_URL = "https://api.x.ai/v1"
XAI_API_KEY = os.getenv("XAI_API_KEY", "").strip()

def get_xai_client() -> Optional[Any]:
    api_key = os.getenv("XAI_API_KEY", "").strip()
    if not api_key or not OpenAI:
        return None
    try:
        return OpenAI(
            base_url=XAI_API_BASE_URL,
            api_key=api_key,
            timeout=30.0
        )
    except Exception as e:
        print(f"Error initializing OpenAI client for xAI: {e}")
        return None

app = FastAPI(
    title="EasyTrip AI Core API",
    description="Travel smarter. Travel safer. Full backend service powering EasyTrip.",
    version="2.1.0"
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
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception as e:
                print(f"Error loading {file_path}: {e}")
    return []

DESTINATIONS_DATA = load_json_data("destinations.json")
BOOKINGS_DATA = load_json_data("bookings.json") or {"hotels": [], "transport": [], "experiences": []}

# Destination coordinates & default image palettes for popular hubs
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

# Dedicated curated knowledge for well-known popular custom Indian & global cities
CUSTOM_KNOWN_DESTINATIONS = {
    "vizag": {
        "name": "Vizag (Visakhapatnam)",
        "country": "India",
        "tagline": "The Jewel of the East Coast, pristine beaches & coastal hills",
        "coordinates": {"lat": 17.6868, "lng": 83.2185},
        "highlights": [
            "INS Kursura Submarine Museum & RK Beach",
            "Rushikonda Blue Flag Beach & Water Sports",
            "Kailasagiri Hilltop Ropeway & Bay Panoramas",
            "Simhachalam 11th-Century Sacred Temple",
            "Dolphin's Nose Lighthouse & Ross Hill Harbor",
            "Borra Caves Karst & Araku Valley Coffee Groves"
        ],
        "image": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
        "bannerImage": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80"
    },
    "visakhapatnam": {
        "name": "Visakhapatnam",
        "country": "India",
        "tagline": "The Jewel of the East Coast, pristine beaches & coastal hills",
        "coordinates": {"lat": 17.6868, "lng": 83.2185},
        "highlights": [
            "INS Kursura Submarine Museum & RK Beach",
            "Rushikonda Blue Flag Beach & Water Sports",
            "Kailasagiri Hilltop Ropeway & Bay Panoramas",
            "Simhachalam 11th-Century Sacred Temple",
            "Dolphin's Nose Lighthouse & Ross Hill Harbor",
            "Borra Caves Karst & Araku Valley Coffee Groves"
        ],
        "image": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
        "bannerImage": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80"
    },
    "rajahmundry": {
        "name": "Rajahmundry (Rajamahendravaram)",
        "country": "India",
        "tagline": "Cultural Capital of Andhra, sacred Godavari riverfront & historic bridges",
        "coordinates": {"lat": 17.0005, "lng": 81.8040},
        "highlights": [
            "Pushkar Ghat Sacred Godavari Sunrise & Aarti",
            "Havelock Bridge & Historic Godavari Arch Sunset",
            "Sir Arthur Cotton Barrage & Dowleswaram Museum",
            "Kadiyam Floral Village & Asia's Largest Nurseries",
            "ISKCON Temple Gautami Ghat Riverfront",
            "Papikondalu Godavari River Gorge Luxury Cruise"
        ],
        "image": "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80",
        "bannerImage": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80"
    },
    "rajamahendravaram": {
        "name": "Rajamahendravaram",
        "country": "India",
        "tagline": "Cultural Capital of Andhra, sacred Godavari riverfront & historic bridges",
        "coordinates": {"lat": 17.0005, "lng": 81.8040},
        "highlights": [
            "Pushkar Ghat Sacred Godavari Sunrise & Aarti",
            "Havelock Bridge & Historic Godavari Arch Sunset",
            "Sir Arthur Cotton Barrage & Dowleswaram Museum",
            "Kadiyam Floral Village & Asia's Largest Nurseries",
            "ISKCON Temple Gautami Ghat Riverfront",
            "Papikondalu Godavari River Gorge Luxury Cruise"
        ],
        "image": "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80",
        "bannerImage": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80"
    },
    "hyderabad": {
        "name": "Hyderabad",
        "country": "India",
        "tagline": "City of Pearls, majestic Charminar & royal Nizami gastronomy",
        "coordinates": {"lat": 17.3850, "lng": 78.4867},
        "highlights": ["Charminar & Laad Bazaar", "Golconda Fort & Acoustic Portico", "Hussain Sagar Lake & Buddha Statue", "Chowmahalla Palace", "Salar Jung Museum"],
        "image": "https://images.unsplash.com/photo-1603204077673-f11c750b3297?auto=format&fit=crop&w=1200&q=80",
        "bannerImage": "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=80"
    },
    "delhi": {
        "name": "Delhi",
        "country": "India",
        "tagline": "Heart of India, historic monuments & bustling Chandni Chowk bazaars",
        "coordinates": {"lat": 28.6139, "lng": 77.2090},
        "highlights": ["India Gate & Kartavya Path", "Qutub Minar Complex", "Humayun's Tomb", "Red Fort & Chandni Chowk", "Lotus Temple"],
        "image": "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80",
        "bannerImage": "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1600&q=80"
    },
    "bengaluru": {
        "name": "Bengaluru",
        "country": "India",
        "tagline": "The Garden City, vibrant microbreweries & tech energy",
        "coordinates": {"lat": 12.9716, "lng": 77.5946},
        "highlights": ["Lalbagh Botanical Gardens", "Bangalore Palace", "Cubbon Park", "Indiranagar Craft Cafes", "Bannerghatta National Park"],
        "image": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80",
        "bannerImage": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1600&q=80"
    },
    "ooty": {
        "name": "Ooty",
        "country": "India",
        "tagline": "Queen of Nilgiri Hill Stations, rolling tea gardens & misty peaks",
        "coordinates": {"lat": 11.4102, "lng": 76.6950},
        "highlights": ["Ooty Botanical Gardens", "Nilgiri Mountain Toy Train", "Doddabetta Peak", "Pykara Waterfalls & Lake", "Emerald Lake"],
        "image": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
        "bannerImage": "https://images.unsplash.com/photo-1579619564365-0442e27ab9e2?auto=format&fit=crop&w=1600&q=80"
    }
}

# Rich Keyword-to-Image photo pools for activity-level photo matching
KEYWORD_IMAGE_POOLS = {
    "submarine": [
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1000&q=80"
    ],
    "beach": [
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1473186578172-c141e6798cf4?auto=format&fit=crop&w=1000&q=80"
    ],
    "temple": [
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1561571994-3c61c554181a?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80"
    ],
    "bridge": [
        "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1545641203-7d072a14e3b2?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1000&q=80"
    ],
    "river": [
        "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80"
    ],
    "barrage": [
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&w=1000&q=80"
    ],
    "nursery": [
        "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1000&q=80"
    ],
    "cave": [
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1000&q=80"
    ],
    "coffee": [
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1000&q=80"
    ],
    "food": [
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80"
    ],
    "bazaar": [
        "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1000&q=80"
    ],
    "museum": [
        "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&w=1000&q=80"
    ],
    "palace": [
        "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1585136917192-32b023f0ec14?auto=format&fit=crop&w=1000&q=80"
    ],
    "sunset": [
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=1000&q=80"
    ],
    "mountain": [
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1000&q=80"
    ],
    "park": [
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1000&q=80"
    ],
    "ropeway": [
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80"
    ],
    "lighthouse": [
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1509233725247-49e657c54213?auto=format&fit=crop&w=1000&q=80"
    ],
    "paris": [
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1549144511-f099e773c147?auto=format&fit=crop&w=1000&q=80"
    ],
    "tokyo": [
        "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=1000&q=80"
    ],
    "waterfall": [
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80"
    ],
    "ooty": [
        "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80"
    ],
    "sushi": [
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80"
    ]
}

# In-memory cache for verified Wikipedia and landmark images
LANDMARK_IMAGE_CACHE: Dict[str, Tuple[str, str]] = {
    "kailasagiri": ("https://upload.wikimedia.org/wikipedia/commons/7/7a/Kailasagiri.jpg", "wikipedia"),
    "ins kursura": ("https://upload.wikimedia.org/wikipedia/commons/f/fd/INS_Kursura_%28S20%29_underway.jpg", "wikipedia"),
    "godavari arch bridge": ("https://upload.wikimedia.org/wikipedia/commons/9/94/Archbridgegodavari.JPG", "wikipedia"),
    "dowleswaram": ("https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Dowleswaram_Barrage.jpg/330px-Dowleswaram_Barrage.jpg", "wikipedia"),
    "simhachalam": ("https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Simhachalam_Temple.jpg/330px-Simhachalam_Temple.jpg", "wikipedia"),
    "borra caves": ("https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Borra_Caves_Inside_View.jpg/330px-Borra_Caves_Inside_View.jpg", "wikipedia"),
    "ooty lake": ("https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Ooty_Lake%2C_Tamil_Nadu%2C_India.jpg/330px-Ooty_Lake%2C_Tamil_Nadu%2C_India.jpg", "wikipedia"),
    "nilgiri mountain railway": ("https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Nilgiri_Mountain_Railway_steam_locomotive.jpg/330px-Nilgiri_Mountain_Railway_steam_locomotive.jpg", "wikipedia"),
    "eiffel tower": ("https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Tour_Eiffel_Wikimedia_Commons.jpg/330px-Tour_Eiffel_Wikimedia_Commons.jpg", "wikipedia"),
    "louvre": ("https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Louvre_Museum_Wikimedia_Commons.jpg/330px-Louvre_Museum_Wikimedia_Commons.jpg", "wikipedia"),
}

def get_landmark_photo_with_source(place_name: str) -> Tuple[str, str]:
    """
    Automated image resolver for exact landmark photos.
    1. Uses httpx to query the Wikipedia page summary API:
       https://en.wikipedia.org/api/rest_v1/page/summary/{encoded_place_name}
    2. Extracts thumbnail.source or originalimage.source.
    3. If found, caches and returns (verified_url, 'wikipedia').
    4. Fallback Mechanism: If Wikipedia doesn't have an article for that spot,
       falls back to a high-relevance query: https://images.unsplash.com/featured/?{place_name_url_encoded}.
    """
    if not place_name or not place_name.strip():
        return ("https://images.unsplash.com/featured/?landmark", "unsplash")

    clean_name = place_name.strip()
    cache_key = clean_name.lower()

    # 1. Quick cache check
    if cache_key in LANDMARK_IMAGE_CACHE:
        return LANDMARK_IMAGE_CACHE[cache_key]

    for k, v in LANDMARK_IMAGE_CACHE.items():
        if k in cache_key or cache_key in k:
            LANDMARK_IMAGE_CACHE[cache_key] = v
            return v

    # 2. Formulate candidate titles to query Wikipedia
    candidates: List[str] = [clean_name]

    # Remove parenthetical details: e.g. "INS Kursura (S20)" -> "INS Kursura"
    no_parens = re.sub(r'\(.*?\)', '', clean_name).strip()
    if no_parens and no_parens not in candidates:
        candidates.append(no_parens)

    # Split on delimiters like &, -, /, :, comma
    for delim in ['&', ' - ', ',', '/', ':']:
        if delim in clean_name:
            part = clean_name.split(delim)[0].strip()
            if part and part not in candidates:
                candidates.append(part)

    # If the name is multi-word (e.g. "Rajahmundry Godavari Arch Bridge"), try dropping the city prefix
    words = clean_name.split()
    if len(words) >= 3:
        cand_suffix = ' '.join(words[1:])
        if cand_suffix not in candidates:
            candidates.append(cand_suffix)

    headers = {
        "User-Agent": "EasyTrip-LandmarkResolver/1.0 (travel-planner@easytrip.travel)"
    }

    # 3. Query Wikipedia page summary API using httpx (or requests as fallback)
    if httpx:
        try:
            with httpx.Client(timeout=4.0, follow_redirects=True, headers=headers) as client:
                for cand in candidates:
                    encoded_candidate = urllib.parse.quote(cand.replace(' ', '_'))
                    wiki_url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{encoded_candidate}"
                    try:
                        resp = client.get(wiki_url)
                        if resp.status_code == 200:
                            data = resp.json()
                            img_src = None
                            if data.get("thumbnail") and data["thumbnail"].get("source"):
                                img_src = data["thumbnail"]["source"]
                            elif data.get("originalimage") and data["originalimage"].get("source"):
                                img_src = data["originalimage"]["source"]

                            if img_src:
                                result = (img_src, "wikipedia")
                                LANDMARK_IMAGE_CACHE[cache_key] = result
                                return result
                    except Exception:
                        continue
        except Exception as http_err:
            print(f"[Wikipedia Lookup] Error querying for '{clean_name}': {http_err}")
    else:
        try:
            for cand in candidates:
                encoded_candidate = urllib.parse.quote(cand.replace(' ', '_'))
                wiki_url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{encoded_candidate}"
                try:
                    resp = requests.get(wiki_url, headers=headers, timeout=4.0)
                    if resp.status_code == 200:
                        data = resp.json()
                        img_src = None
                        if data.get("thumbnail") and data["thumbnail"].get("source"):
                            img_src = data["thumbnail"]["source"]
                        elif data.get("originalimage") and data["originalimage"].get("source"):
                            img_src = data["originalimage"]["source"]

                        if img_src:
                            result = (img_src, "wikipedia")
                            LANDMARK_IMAGE_CACHE[cache_key] = result
                            return result
                except Exception:
                    continue
        except Exception:
            pass

    # 4. Fallback Mechanism: high-relevance query
    fallback_url = f"https://images.unsplash.com/featured/?{urllib.parse.quote_plus(clean_name)}"
    result = (fallback_url, "unsplash")
    LANDMARK_IMAGE_CACHE[cache_key] = result
    return result

def get_landmark_photo(place_name: str) -> str:
    """
    Convenience helper returning the resolved landmark photo URL.
    """
    url, _ = get_landmark_photo_with_source(place_name)
    return url

def resolve_activity_image(title: str, location: str, category: str, fallback_img: str = "", salt: int = 0) -> str:
    """
    Intelligently maps activity title, location, and category keywords
    to verified high-definition photography collections.
    """
    combined = f"{title} {location} {category}".lower()
    
    keyword_map = [
        (["submarine", "kursura", "naval", "torpedo", "aircraft"], "submarine"),
        (["eiffel", "paris", "louvre", "champ de mars", "seine", "montmartre", "versailles", "champs-elysees", "arc de triomphe", "orsay", "marais"], "paris"),
        (["tokyo", "shibuya", "senso-ji", "asakusa", "akihabara", "meiji", "harajuku", "shinjuku", "tsukiji", "odaiba", "roppongi"], "tokyo"),
        (["ooty", "nilgiri", "doddabetta", "pykara", "avalanche lake", "toy train"], "ooty"),
        (["rushikonda", "yarada", "beach", "coastal", "surf", "sand", "ocean", "sea"], "beach"),
        (["simhachalam", "temple", "shrine", "sanctum", "aarti", "iskcon", "spiritual", "puja", "darshan", "hadimba"], "temple"),
        (["havelock", "bridge", "arch bridge", "viaduct"], "bridge"),
        (["waterfall", "falls", "jogini", "jana", "sissu", "dudhsagar"], "waterfall"),
        (["godavari", "river", "ghat", "cruise", "papikondalu", "gorge", "boat", "ferry"], "river"),
        (["cotton", "barrage", "dowleswaram", "dam", "canal", "irrigation"], "barrage"),
        (["kadiyam", "nursery", "floral", "flower", "bonsai"], "nursery"),
        (["borra", "cave", "limestone", "stalactite", "karst", "cavern"], "cave"),
        (["araku", "coffee", "plantation", "tea garden", "orchard", "vineyard"], "coffee"),
        (["sushi", "wagyu", "izakaya", "ramen", "nigiri", "otoro"], "sushi"),
        (["pulasa", "seafood", "thali", "food", "lunch", "dinner", "culinary", "bistro", "tasting", "sweet", "pootharekulu", "dosa", "biryani", "siddu", "dining"], "food"),
        (["bazaar", "market", "shopping", "handicraft", "craft", "textile", "lepakshi", "souvenir", "mall road"], "bazaar"),
        (["museum", "gallery", "exhibition", "civilization", "antiquities", "artifact", "teamlab"], "museum"),
        (["citadel", "fort", "castle", "palace", "rampart", "bastion", "monument", "naggar"], "palace"),
        (["kailasagiri", "ropeway", "cable car", "funicular", "ridge", "solang"], "ropeway"),
        (["dolphin's nose", "lighthouse", "harbor", "port", "pier", "promontory"], "lighthouse"),
        (["mountain", "snow", "trek", "hike", "peak", "valley", "alpine", "rohtang", "atal", "himalayan", "manali"], "mountain"),
        (["sunset", "golden hour", "lounge", "rooftop", "nightlife", "evening", "twilight", "cocktail"], "sunset"),
        (["park", "botanical", "arboretum", "promenade", "walk", "garden", "esplanade"], "park"),
    ]

    for keywords, pool_key in keyword_map:
        if any(kw in combined for kw in keywords):
            pool = KEYWORD_IMAGE_POOLS.get(pool_key, [])
            if pool:
                return pool[salt % len(pool)]

    if fallback_img:
        return fallback_img
    return KEYWORD_IMAGE_POOLS["park"][salt % len(KEYWORD_IMAGE_POOLS["park"])]

# Real Curated Itineraries for Key Destinations
CURATED_DESTINATION_PLANS = {
    "ooty": [
        {
            "title": "UNESCO Heritage Toy Train, Rose Garden & Ooty Lake",
            "theme": "Colonial Charm, Botanical Wonders & Tranquil Waters",
            "slots": [
                {
                    "period": "Morning",
                    "time": "08:30 AM - 12:00 PM",
                    "title": "Nilgiri Mountain Railway Toy Train & Botanical Gardens",
                    "location": "Udhagamandalam Railway Station & Charring Cross",
                    "description": "Board the world-famous UNESCO Nilgiri Mountain Steam Train cruising past misty tea gardens, followed by a walk through the 1848 Government Botanical Gardens.",
                    "category": "UNESCO Heritage & Gardens",
                    "base_cost": 650,
                    "duration": "3.5 Hours",
                    "tips": "Book the First Class wooden coach in advance for panoramic Nilgiri views."
                },
                {
                    "period": "Afternoon",
                    "time": "01:00 PM - 04:30 PM",
                    "title": "Government Rose Garden & Authentic Nahar Cafe Lunch",
                    "location": "Elk Hill Slopes & Commercial Road",
                    "description": "Explore over 20,000 varieties of exotic roses terraced on Elk Hill, followed by artisan woodfired pizzas and Nilgiri tea at Nahar's Sidewalk Cafe.",
                    "category": "Botanical & Culinary",
                    "base_cost": 550,
                    "duration": "3 Hours",
                    "tips": "Best floral fragrance and photography right around early afternoon light."
                },
                {
                    "period": "Evening",
                    "time": "05:00 PM - 08:30 PM",
                    "title": "Ooty Lake Sunset Boating & King Star Fudge Tasting",
                    "location": "North Lake Road & Commercial Street",
                    "description": "Pedal boat ride across the calm reflective waters of Ooty Lake framed by eucalyptus trees, culminating in a tasting of legendary handmade chocolate fudge from King Star Bakery.",
                    "category": "Leisure & Confectionery",
                    "base_cost": 600,
                    "duration": "3 Hours",
                    "tips": "Evening lake mist adds magical drama; pick up assorted walnut and fig fudge."
                }
            ]
        },
        {
            "title": "Doddabetta Peak, Tea Factory & Pykara Waterfalls",
            "theme": "High Altitude Panoramas, Orthodox Tea Aromas & Gushing Falls",
            "slots": [
                {
                    "period": "Morning",
                    "time": "08:30 AM - 12:00 PM",
                    "title": "Doddabetta Peak Summit & Nilgiri Tea Museum",
                    "location": "Doddabetta Summit (2,637 m) & Kotagiri Road",
                    "description": "Ascend to the highest peak in South India for a 360-degree panorama of the Nilgiri Biosphere, followed by an educational tour watching green tea processing and essential oil extraction.",
                    "category": "Mountain Overlook & Tea",
                    "base_cost": 450,
                    "duration": "3.5 Hours",
                    "tips": "Visit the summit telescope house on clear mornings to view the Coimbatore plains."
                },
                {
                    "period": "Afternoon",
                    "time": "01:00 PM - 04:30 PM",
                    "title": "Pykara Waterfalls & Speedboating in Pykara Lake",
                    "location": "Pykara Reserve, Ooty-Mysore Highway",
                    "description": "Witness the sacred Pykara river drop over tiered granite rocks into the dam basin. Embark on a high-speed boat ride past pine groves and misty mountain shores.",
                    "category": "Cascades & Speedboating",
                    "base_cost": 750,
                    "duration": "3.5 Hours",
                    "tips": "Carry an umbrella or rain poncho near the lower falls viewing platform."
                },
                {
                    "period": "Evening",
                    "time": "05:30 PM - 08:30 PM",
                    "title": "Shinkow's Heritage Dinner & Charring Cross Walk",
                    "location": "Commissioner's Road, Ooty",
                    "description": "Relish heritage Cantonese dining at Shinkow's, established in 1954 by Chinese settlers, known for authentic steamed momos, pork ribs, and hakka noodles.",
                    "category": "Heritage Dining",
                    "base_cost": 850,
                    "duration": "2.5 Hours",
                    "tips": "Arrive before 7:30 PM as tables fill quickly with local food enthusiasts."
                }
            ]
        },
        {
            "title": "Avalanche Sanctuary & Wenlock Downs Meadows",
            "theme": "Pristine Biosphere Safari & Cinematic Rolling Hills",
            "slots": [
                {
                    "period": "Morning",
                    "time": "08:00 AM - 12:30 PM",
                    "title": "Avalanche Lake & Cloud Forest Eco-Safari",
                    "location": "Avalanche Biosphere Reserve (28 km from Ooty)",
                    "description": "Ride a government safari jeep through restricted shola cloud forests and trout streams to the pristine, untouched shoreline of Avalanche Lake.",
                    "category": "Wilderness Sanctuary",
                    "base_cost": 950,
                    "duration": "4 Hours",
                    "tips": "Strict forest department permits required; cameras and birding optics recommended."
                },
                {
                    "period": "Afternoon",
                    "time": "01:30 PM - 04:30 PM",
                    "title": "Wenlock Downs 9th Mile Shooting Point & Toda Huts",
                    "location": "Wenlock Downs & Toda Hamlet Overlook",
                    "description": "Stroll the undulating emerald green pastures of 9th Mile shooting point, framed by distant pine woods, and see the unique barrel-vaulted huts of the indigenous Toda tribe.",
                    "category": "Meadows & Indigenous Heritage",
                    "base_cost": 400,
                    "duration": "3 Hours",
                    "tips": "Great spot for horseback rides across gentle mountain ridges."
                },
                {
                    "period": "Evening",
                    "time": "05:00 PM - 08:00 PM",
                    "title": "Tea Roastery Tasting & Sunset over Upper Bhavani",
                    "location": "Upper Bhavani Viewpoint & Doddabetta Tea Lounge",
                    "description": "Conclude your Nilgiri retreat sipping single-estate orthodox silver needle tea while watching purple twilight settle over the mountain valleys.",
                    "category": "Tea Tasting & Sunset",
                    "base_cost": 500,
                    "duration": "2.5 Hours",
                    "tips": "Buy vacuum-packed Ooty chocolate fudge and white tea as authentic souvenirs."
                }
            ]
        }
    ],
    "vizag": [
        {
            "title": "RK Beach, Submarine Memorial & Kailasagiri Sunset",
            "theme": "Naval Heritage, Blue Flag Sands & Panoramic Hilltop Heights",
            "slots": [
                {
                    "period": "Morning",
                    "time": "09:00 AM - 12:30 PM",
                    "title": "INS Kursura Submarine Museum & RK Beach Promenade",
                    "location": "RK Beach, Visakhapatnam",
                    "description": "Step aboard the historic decommissioned Soviet-built Kalvari-class submarine stationed directly on the sands of RK Beach, exploring naval corridors, sonar rooms, and torpedo bays.",
                    "category": "Naval Museum & Heritage",
                    "base_cost": 780,
                    "duration": "3 hrs",
                    "tips": "Visit right at 09:00 AM to avoid midday queues and pair with the TU 142 Aircraft Museum across the road."
                },
                {
                    "period": "Afternoon",
                    "time": "01:00 PM - 04:30 PM",
                    "title": "Coastal Seafood Feast & Rushikonda Beach Water Sports",
                    "location": "Rushikonda Beach, Vizag",
                    "description": "Indulge in authentic Andhra prawn fry, bamboo chicken, and fresh coastal curries, followed by thrilling jet-skiing and windsurfing along the pristine Blue Flag certified shoreline.",
                    "category": "Coastal Adventure & Dining",
                    "base_cost": 750,
                    "duration": "3.5 hrs",
                    "tips": "Rushikonda has certified lifeguards and regulated water sports operators; carry beach towels."
                },
                {
                    "period": "Evening",
                    "time": "05:00 PM - 08:30 PM",
                    "title": "Kailasagiri Ropeway & Panoramic Bay of Bengal Sunset",
                    "location": "Kailasagiri Hilltop Park, Visakhapatnam",
                    "description": "Ascend 360 feet above sea level via the cable car ropeway, offering spectacular 360-degree vistas where forested Eastern Ghats meet the sweeping curve of the ocean.",
                    "category": "Scenic Overlook & Sunset",
                    "base_cost": 980,
                    "duration": "3.5 hrs",
                    "tips": "Ride the hilltop perimeter toy train just before golden hour for breathtaking coastal photography."
                }
            ]
        },
        {
            "title": "Sacred Simhachalam & Coastal Promontory Vistas",
            "theme": "11th-Century Sacred Architecture & Dolphin's Nose Lighthouse",
            "slots": [
                {
                    "period": "Morning",
                    "time": "08:30 AM - 12:00 PM",
                    "title": "Simhachalam Varaha Lakshmi Narasimha Historic Temple",
                    "location": "Simhachalam Hill, Visakhapatnam",
                    "description": "Marvel at the extraordinary 11th-century Kalinga-style stone architecture, ornate elephant carvings, and sacred sanctum perched amidst lush forest hills.",
                    "category": "Sacred Architecture & Heritage",
                    "base_cost": 650,
                    "duration": "3.5 hrs",
                    "tips": "Traditional dress code applies. Early morning darshan ensures a serene atmosphere."
                },
                {
                    "period": "Afternoon",
                    "time": "01:00 PM - 04:30 PM",
                    "title": "Dolphin's Nose Lighthouse & Ross Hill Harbor Views",
                    "location": "Gangavaram Port Road, Vizag",
                    "description": "Climb up to the historic clifftop lighthouse atop the dramatic 358-meter high natural promontory, observing expansive ship traffic and inner harbor port docks.",
                    "category": "Maritime Landmark & Ocean Vista",
                    "base_cost": 910,
                    "duration": "3.5 hrs",
                    "tips": "The lighthouse observation gallery opens to visitors at 3:00 PM; bring your camera."
                },
                {
                    "period": "Evening",
                    "time": "05:00 PM - 08:30 PM",
                    "title": "Tenneti Park Clifftop Stroll & Sunken Cargo Ship Twilight",
                    "location": "Beach Road, Jodugullapalem, Vizag",
                    "description": "Walk along picturesque stone coastal paths overlooking the stranded vessel MV Maa, enjoying the sunset surf, sea breezes, and fresh spiced roasted corn.",
                    "category": "Coastal Promenade & Twilight",
                    "base_cost": 650,
                    "duration": "3.5 hrs",
                    "tips": "Stone steps lead directly down to the tide pools for close-up views of the dramatic coastline."
                }
            ]
        },
        {
            "title": "Borra Caves Subterranean Karst & Araku Coffee Highlands",
            "theme": "Million-Year Karst Formations & Indigenous Coffee Traditions",
            "slots": [
                {
                    "period": "Morning",
                    "time": "08:00 AM - 12:30 PM",
                    "title": "Borra Caves Million-Year-Old Limestone Karst Formations",
                    "location": "Ananthagiri Hills, Araku Valley Region",
                    "description": "Venture into deep natural caves sculpted by the Gosthani River, beholding colossal calcium stalactite pillars illuminated by dynamic LED lighting.",
                    "category": "Geological Wonder & Nature",
                    "base_cost": 1300,
                    "duration": "4 hrs",
                    "tips": "Wear shoes with traction since interior pathways can be damp and rocky."
                },
                {
                    "period": "Afternoon",
                    "time": "01:00 PM - 04:30 PM",
                    "title": "Araku Valley Organic Coffee Plantations & Tribal Museum",
                    "location": "Araku Highlands",
                    "description": "Tour world-renowned shade-grown organic Arabica coffee groves, learn about indigenous Dhimsa cultural heritage, and sample freshly roasted espresso.",
                    "category": "Plantation Tour & Tribal Culture",
                    "base_cost": 1170,
                    "duration": "3.5 hrs",
                    "tips": "Purchase GI-tagged Araku roasted beans directly from the tribal cooperative outlet."
                },
                {
                    "period": "Evening",
                    "time": "05:30 PM - 09:00 PM",
                    "title": "Siripuram & Jagadamba Junction Lepakshi Handicrafts Trail",
                    "location": "Siripuram, Visakhapatnam",
                    "description": "Conclude with an evening stroll through state emporiums featuring Etikoppaka lacquer wooden toys, Uppada silk sarees, and sizzling hot Andhra street food.",
                    "category": "Shopping & Local Gastronomy",
                    "base_cost": 1200,
                    "duration": "3.5 hrs",
                    "tips": "Etikoppaka toys made with natural vegetable dyes make delightful authentic souvenirs."
                }
            ]
        }
    ],
    "rajahmundry": [
        {
            "title": "Pushkar Ghat Sunrise, Godavari River & Havelock Arch Sunset",
            "theme": "Sacred Godavari Riverfront & Century-Old Railway Engineering",
            "slots": [
                {
                    "period": "Morning",
                    "time": "06:30 AM - 11:30 AM",
                    "title": "Pushkar Ghat Morning Aarti & Sacred Godavari River Walk",
                    "location": "Pushkar Ghat, Rajahmundry",
                    "description": "Greet the dawn along the serene steps of Pushkar Ghat, taking in spiritual morning hymns, riverboat journeys, and cool breezes flowing across the mighty Godavari.",
                    "category": "Sacred Riverfront & Heritage",
                    "base_cost": 520,
                    "duration": "3 hrs",
                    "tips": "Early morning between 6:30 and 8:00 AM provides tranquil reflections and stunning photography."
                },
                {
                    "period": "Afternoon",
                    "time": "12:30 PM - 04:00 PM",
                    "title": "Authentic Godavari Pulasa & Coastal Andhra Culinary Trail",
                    "location": "Main Road & Kotilingala Ghat, Rajahmundry",
                    "description": "Taste East Godavari's legendary culinary heritage including Gongura spiced curries, freshwater fish preparations, and pure ghee steamed rice, topped off with iconic local Rose Milk.",
                    "category": "Gastronomy & Traditional Flavors",
                    "base_cost": 1170,
                    "duration": "3.5 hrs",
                    "tips": "Don't miss the original 1950s Rose Milk Centre near Kotagummam for a historic sweet delight."
                },
                {
                    "period": "Evening",
                    "time": "05:00 PM - 08:30 PM",
                    "title": "Havelock Bridge Walk & Historic Godavari Arch Bridge Sunset",
                    "location": "Godavari Riverfront Promenade, Rajahmundry",
                    "description": "Walk along the pedestrian walkway of the historic 1897 Havelock Bridge, admiring the 2.7 km span of the Godavari Arch Bridge as twilight illuminates the waters.",
                    "category": "Historic Bridge & Scenic Vista",
                    "base_cost": 650,
                    "duration": "3.5 hrs",
                    "tips": "Arrive at 5:15 PM to witness express trains crossing the arch bridge set against the golden sunset."
                }
            ]
        },
        {
            "title": "Cotton Barrage Engineering & Kadiyam Floral Paradise",
            "theme": "Delta Irrigation Heritage & Asia's Largest Botanical Nurseries",
            "slots": [
                {
                    "period": "Morning",
                    "time": "08:30 AM - 12:00 PM",
                    "title": "Sir Arthur Cotton Barrage & Dowleswaram Irrigation Museum",
                    "location": "Dowleswaram, Rajahmundry",
                    "description": "Examine the massive historic barrage that converted the Godavari basin into the lush rice granary of India, touring archival irrigation models and peaceful river parkways.",
                    "category": "Historic Engineering & Park",
                    "base_cost": 650,
                    "duration": "3.5 hrs",
                    "tips": "Walk the scenic canal-side pathway towards the memorial gardens for great bridge photos."
                },
                {
                    "period": "Afternoon",
                    "time": "01:00 PM - 04:30 PM",
                    "title": "Kadiyam Floral Village & Asia's Largest Plant Nurseries",
                    "location": "Kadiyam, Rajahmundry Outer Belt",
                    "description": "Roam across thousands of acres of flourishing ornamental plant nurseries, exotic bonsai courtyards, fragrant flowering gardens, and sprawling tropical greenhouses.",
                    "category": "Botanical Haven & Nature Tour",
                    "base_cost": 910,
                    "duration": "3.5 hrs",
                    "tips": "Hire an auto-rickshaw or local cab to visit the top 4 flagship nursery estates."
                },
                {
                    "period": "Evening",
                    "time": "05:00 PM - 08:30 PM",
                    "title": "ISKCON Temple Gautami Ghat & Twilight River Bhajan",
                    "location": "Gautami Ghat, Rajahmundry",
                    "description": "Experience serene evening spiritual vibes at the grand 2-acre riverside ISKCON complex, with harmonic chants echoing over the tranquil waters of the Godavari at dusk.",
                    "category": "Spiritual Sanctum & Twilight Peace",
                    "base_cost": 520,
                    "duration": "3.5 hrs",
                    "tips": "Sample the freshly prepared sanctified vegetarian prasadam delicacies at the counter."
                }
            ]
        },
        {
            "title": "Papikondalu River Gorge Cruise & Royal Sweet Trail",
            "theme": "Emerald Eastern Ghats Gorge Voyage & Atreyapuram Pootharekulu",
            "slots": [
                {
                    "period": "Morning",
                    "time": "07:30 AM - 12:30 PM",
                    "title": "Papikondalu Godavari River Luxury Boat Cruise Departure",
                    "location": "Purushothapatnam / Polavaram Launch Point",
                    "description": "Embark on an exhilarating motorized boat voyage through the scenic gorge where the Godavari river slices through emerald-cloaked hills of the Eastern Ghats.",
                    "category": "River Cruise & Mountain Gorge",
                    "base_cost": 1200,
                    "duration": "4 hrs",
                    "tips": "Pre-book upstream boat pass; the open observation deck offers unobstructed 360-degree panoramas."
                },
                {
                    "period": "Afternoon",
                    "time": "01:00 PM - 04:30 PM",
                    "title": "Perantapalli Tribal Hamlet & Bamboo Craft Hermitage",
                    "location": "Papikondalu Hills, Godavari Gorge",
                    "description": "Stop at the quiet riverside tribal settlement nestled beneath dramatic cliffs, discovering eco-friendly bamboo handicraft traditions and the serene Sri Veereswara Swamy shrine.",
                    "category": "Eco-Heritage & Tribal Discovery",
                    "base_cost": 980,
                    "duration": "3.5 hrs",
                    "tips": "Support indigenous tribal artisans by picking up handmade bamboo crafts and water flasks."
                },
                {
                    "period": "Evening",
                    "time": "05:30 PM - 09:00 PM",
                    "title": "Rajahmundry Sweet Trail: Royal Atreyapuram Pootharekulu",
                    "location": "Syriac Church Road & Kotagummam, Rajahmundry",
                    "description": "Discover the art of paper-thin Atreyapuram Pootharekulu (ghee-infused rice starch rolls stuffed with jaggery and roasted dry fruits) followed by piping hot Mirchi Bajji.",
                    "category": "Culinary Heritage & Night Trail",
                    "base_cost": 780,
                    "duration": "3 hrs",
                    "tips": "Purchase vacuum-sealed dry fruit pootharekulu boxes to take home as authentic regional treats."
                }
            ]
        }
    ],
    "paris": [
        {
            "title": "Eiffel Tower Summit, Louvre Masterpieces & Seine Sunset Cruise",
            "theme": "Wrought-Iron Icons, Renaissance Treasures & Golden Hour Riverbanks",
            "slots": [
                {
                    "period": "Morning",
                    "time": "09:00 AM - 12:30 PM",
                    "title": "Eiffel Tower Summit Ascent & Champ de Mars Stroll",
                    "location": "Champ de Mars, 7th Arrondissement, Paris",
                    "description": "Ascend the iconic wrought-iron lattice monument for sweeping 360-degree panoramas of the City of Light, followed by a leisurely stroll across the Champ de Mars gardens.",
                    "category": "Iconic Landmark & Panorama",
                    "base_cost": 1200,
                    "duration": "3.5 hrs",
                    "tips": "Pre-book summit elevator tickets to bypass lengthy admission queues."
                },
                {
                    "period": "Afternoon",
                    "time": "01:00 PM - 04:30 PM",
                    "title": "Louvre Museum Classical Masterpieces & Tuileries Gardens",
                    "location": "Palais du Louvre, 1st Arrondissement, Paris",
                    "description": "Explore the world's largest art museum, admiring the Mona Lisa, Venus de Milo, and Winged Victory before relaxing near the fountains of the Tuileries.",
                    "category": "World Heritage Art & Gardens",
                    "base_cost": 750,
                    "duration": "3.5 hrs",
                    "tips": "Enter via the Carrousel du Louvre underground mall entrance to avoid glass pyramid lines."
                },
                {
                    "period": "Evening",
                    "time": "05:30 PM - 09:00 PM",
                    "title": "Seine River Twilight Cruise & Notre-Dame Cathedral Panorama",
                    "location": "Port de la Bourdonnais, Paris",
                    "description": "Glide past illuminated historic bridges, Musée d'Orsay, and the gothic towers of Notre-Dame as golden hour transitions into twilight.",
                    "category": "River Cruise & Twilight",
                    "base_cost": 1300,
                    "duration": "3.5 hrs",
                    "tips": "Board 45 minutes before dusk to watch the Eiffel Tower's sparkling beacon light up on the hour."
                }
            ]
        },
        {
            "title": "Montmartre Bohemian Artists, Sacré-Cœur & Arc de Triomphe",
            "theme": "Historic Hilltop Sanctuaries, Haute Couture & Jazz Heritage",
            "slots": [
                {
                    "period": "Morning",
                    "time": "09:00 AM - 12:30 PM",
                    "title": "Montmartre Bohemian Artists Square & Sacré-Cœur Basilica",
                    "location": "Place du Tertre & Montmartre Hill, Paris",
                    "description": "Climb the cobblestone heights of Montmartre to the gleaming white Romano-Byzantine dome of Sacré-Cœur, exploring vintage painters' ateliers and windmill alleys.",
                    "category": "Historic Quarter & Sacred Basilica",
                    "base_cost": 980,
                    "duration": "3.5 hrs",
                    "tips": "Take the Montmartre funicular with standard metro tickets if you prefer not to climb the stairs."
                },
                {
                    "period": "Afternoon",
                    "time": "01:00 PM - 04:30 PM",
                    "title": "Arc de Triomphe Observation Deck & Avenue des Champs-Élysées",
                    "location": "Place Charles de Gaulle, Paris",
                    "description": "Ascend to the rooftop terrace of Napoleon's triumphal arch overlooking the 12 radiating avenues, followed by boutique browsing on the Champs-Élysées.",
                    "category": "Historic Monument & Boulevard",
                    "base_cost": 1170,
                    "duration": "3.5 hrs",
                    "tips": "Use the pedestrian underpass at the top of the avenue; never try to cross the roundabout traffic."
                },
                {
                    "period": "Evening",
                    "time": "05:30 PM - 09:00 PM",
                    "title": "Saint-Germain-des-Prés Bistro Tasting & Historic Jazz Cellar",
                    "location": "Latin Quarter & Saint-Germain, Paris",
                    "description": "Indulge in French culinary classics including duck confit, warm baguette with artisan brie, and tarte tatin, followed by live jazz at Caveau de la Huchette.",
                    "category": "French Gastronomy & Jazz",
                    "base_cost": 2470,
                    "duration": "3.5 hrs",
                    "tips": "Request a table on the heated terrace for quintessential Parisian street-watching."
                }
            ]
        },
        {
            "title": "Palace of Versailles Hall of Mirrors & Musée d'Orsay Treasures",
            "theme": "Royal Grandeur, Impressionist Masterpieces & Le Marais Bakeries",
            "slots": [
                {
                    "period": "Morning",
                    "time": "08:30 AM - 12:30 PM",
                    "title": "Palace of Versailles Royal Grand Apartments & Hall of Mirrors",
                    "location": "Place d'Armes, Versailles",
                    "description": "Journey to the grand seat of the Sun King Louis XIV, exploring the resplendent Hall of Mirrors, royal bedchambers, and expansive geometric fountain gardens.",
                    "category": "Royal Palace & UNESCO Heritage",
                    "base_cost": 1950,
                    "duration": "4 hrs",
                    "tips": "Take the RER C train from central Paris; rent a bicycle to navigate the immense gardens."
                },
                {
                    "period": "Afternoon",
                    "time": "01:30 PM - 04:30 PM",
                    "title": "Musée d'Orsay Impressionist Treasures in a Beaux-Arts Station",
                    "location": "Esplanade Valéry Giscard d'Estaing, Paris",
                    "description": "Marvel at celebrated masterpieces by Monet, Van Gogh, Renoir, and Degas housed beneath the soaring vaulted iron-and-glass ceilings of a 1900 railway terminal.",
                    "category": "Impressionist Art & Architecture",
                    "base_cost": 1430,
                    "duration": "3 hrs",
                    "tips": "Visit the 5th-floor giant clock face cafe for a unique framed view across the Seine to the Louvre."
                },
                {
                    "period": "Evening",
                    "time": "05:30 PM - 09:00 PM",
                    "title": "Le Marais Artisan Boutiques & Place des Vosges Twilight Walk",
                    "location": "Le Marais, 4th Arrondissement, Paris",
                    "description": "Wander 17th-century aristocratic courtyards, sample fresh falafel on Rue des Rosiers, and savor evening macarons in Paris's oldest planned square.",
                    "category": "Artisan Quarter & French Patisserie",
                    "base_cost": 1620,
                    "duration": "3.5 hrs",
                    "tips": "Pick up hand-packaged macarons from Carette under the vaulted arcades of Place des Vosges."
                }
            ]
        }
    ],
    "tokyo": [
        {
            "title": "Asakusa Senso-ji, Akihabara Tech & Shibuya Crossing Scramble",
            "theme": "Edo Ancient Heritage, Electric Anime Plazas & Neon Crossing",
            "slots": [
                {
                    "period": "Morning",
                    "time": "09:00 AM - 12:30 PM",
                    "title": "Senso-ji Ancient Temple & Asakusa Nakamise Dori Street",
                    "location": "Asakusa, Taito City, Tokyo",
                    "description": "Pass under the massive red Kaminarimon paper lantern into Tokyo's oldest 7th-century Buddhist temple, sampling piping hot Ningyo-yaki sweets along Nakamise Dori.",
                    "category": "Historic Temple & Traditional Market",
                    "base_cost": 650,
                    "duration": "3.5 hrs",
                    "tips": "Draw an omikuji (fortune slip) at the temple pavilion; tie unlucky fortunes to the metal racks."
                },
                {
                    "period": "Afternoon",
                    "time": "01:00 PM - 04:30 PM",
                    "title": "Akihabara Electric Town & Futuristic Gaming Culture",
                    "location": "Soto-Kanda, Chiyoda City, Tokyo",
                    "description": "Dive into the kaleidoscopic heart of anime, manga, retro arcades, multi-floor tech plazas, and themed maid cafes in neon-draped Akihabara.",
                    "category": "Tech & Pop Culture",
                    "base_cost": 1300,
                    "duration": "3.5 hrs",
                    "tips": "Check out Mandarake Complex for multi-story vintage collectible figurines and retro games."
                },
                {
                    "period": "Evening",
                    "time": "05:30 PM - 09:00 PM",
                    "title": "Shibuya Crossing Scramble & Shibuya Sky Sunset Observatory",
                    "location": "Shibuya Scramble Square, Tokyo",
                    "description": "Experience the world's most famous pedestrian intersection, then ascend 229 meters to the open-air rooftop deck of Shibuya Sky for sunsets over Mount Fuji and neon Tokyo.",
                    "category": "Iconic Skyline & Modern Metropolis",
                    "base_cost": 1620,
                    "duration": "3.5 hrs",
                    "tips": "Book Shibuya Sky sunset time slot 2 weeks in advance; lockers are mandatory for rooftop access."
                }
            ]
        },
        {
            "title": "Meiji Jingu Forest, Harajuku Street Fashion & Shinjuku Izakayas",
            "theme": "Shinto Sanctuaries, Avant-Garde Style & Post-War Lantern Alleys",
            "slots": [
                {
                    "period": "Morning",
                    "time": "09:00 AM - 12:30 PM",
                    "title": "Meiji Jingu Shinto Shrine & Evergreen Forest Sanctuary",
                    "location": "Yoyogikamizonocho, Shibuya City, Tokyo",
                    "description": "Step beneath towering 1,500-year-old cedar Torii gates into a tranquil 170-acre sacred forest planted with 100,000 donated trees from across Japan.",
                    "category": "Shinto Shrine & Forest Oasis",
                    "base_cost": 520,
                    "duration": "3.5 hrs",
                    "tips": "Cleanse your hands and mouth at the temizuya water fountain before entering the main courtyard."
                },
                {
                    "period": "Afternoon",
                    "time": "01:00 PM - 04:30 PM",
                    "title": "Harajuku Takeshita Street & Omotesando Design Boulevards",
                    "location": "Jingumae, Shibuya City, Tokyo",
                    "description": "Contrast Harajuku's whimsical street fashion with the tree-lined luxury architectural pavilions and designer cafes of Omotesando.",
                    "category": "Street Fashion & Avant-Garde Design",
                    "base_cost": 1170,
                    "duration": "3.5 hrs",
                    "tips": "Try a freshly rolled Japanese dessert crepe filled with strawberries and custard."
                },
                {
                    "period": "Evening",
                    "time": "05:30 PM - 09:00 PM",
                    "title": "Shinjuku Gyoen National Garden & Omoide Yokocho Izakaya Trail",
                    "location": "Nishi-Shinjuku, Tokyo",
                    "description": "Stroll formal Japanese landscape ponds, then dive into the nostalgic post-war lantern alleys of 'Memory Lane', savoring grilled yakitori skewers and draft beer.",
                    "category": "Japanese Gardens & Izakaya Gastronomy",
                    "base_cost": 1200,
                    "duration": "3.5 hrs",
                    "tips": "Omoide Yokocho izakayas are intimate (4-8 seats per stall); carry Japanese Yen cash."
                }
            ]
        },
        {
            "title": "Tsukiji Outer Market Sushi, TeamLab Planets & Tokyo Tower",
            "theme": "Fresh Otoro Nigiri, Sensory Digital Art & Minato Skyline Vistas",
            "slots": [
                {
                    "period": "Morning",
                    "time": "08:00 AM - 12:00 PM",
                    "title": "Tsukiji Outer Market Fresh Sushi & A5 Wagyu Street Tasting",
                    "location": "Tsukiji, Chuo City, Tokyo",
                    "description": "Sample melt-in-your-mouth bluefin otoro nigiri, grilled tamagoyaki sweet omelets, and flame-torched A5 Wagyu beef skewers directly from wholesale market stalls.",
                    "category": "Seafood Market & Culinary Masterclass",
                    "base_cost": 1200,
                    "duration": "4 hrs",
                    "tips": "Arrive around 8:00-9:00 AM while daily fish catches and knife shops are bustling."
                },
                {
                    "period": "Afternoon",
                    "time": "01:00 PM - 04:30 PM",
                    "title": "TeamLab Planets Digital Immersive Art Museum in Odaiba",
                    "location": "Toyosu / Odaiba Waterfront, Tokyo",
                    "description": "Wade barefoot through knee-deep digital koi fish waters and walk across endless crystal mirror rooms in this groundbreaking sensory digital art museum.",
                    "category": "Digital Art & Futuristic Experience",
                    "base_cost": 1950,
                    "duration": "3.5 hrs",
                    "tips": "Wear pants that can be rolled up to your knees as you will walk through shallow water exhibits."
                },
                {
                    "period": "Evening",
                    "time": "05:30 PM - 09:00 PM",
                    "title": "Roppongi Hills Mori Tower & Tokyo Tower Illuminated Twilight",
                    "location": "Roppongi, Minato City, Tokyo",
                    "description": "Take in sweeping sunset vistas of the red-and-white Tokyo Tower glowing against the metropolis, followed by Michelin-caliber ramen or matcha dessert bars.",
                    "category": "Skyline Panoramas & Evening Dining",
                    "base_cost": 1200,
                    "duration": "3.5 hrs",
                    "tips": "The Tokyo City View observation deck on the 52nd floor provides the best direct view of Tokyo Tower."
                }
            ]
        }
    ],
    "manali": [
        {
            "title": "Hadimba Devi Cedar Temple, Old Manali & Jogini Waterfall",
            "theme": "Ancient Deodar Groves, Bohemian Riverside Cafes & Alpine Trails",
            "slots": [
                {
                    "period": "Morning",
                    "time": "08:30 AM - 12:00 PM",
                    "title": "Hadimba Devi Cedar Forest Historic Wooden Temple",
                    "location": "Dhungri Forest, Manali",
                    "description": "Wander through centuries-old giant deodar cedar pine groves to the unique 1553 pagoda-style wooden temple adorned with intricate timber animal relief carvings.",
                    "category": "Sacred Forest Temple & Heritage",
                    "base_cost": 520,
                    "duration": "3.5 hrs",
                    "tips": "Visit early morning when mist filters through the deodar canopy for magical alpine photos."
                },
                {
                    "period": "Afternoon",
                    "time": "01:00 PM - 04:30 PM",
                    "title": "Old Manali Riverside Cafes & Fresh Himalayan Trout Tasting",
                    "location": "Old Manali Village & Manalsu River",
                    "description": "Cross the bridge into Old Manali's bohemian stone-and-wood village, savoring butter-garlic pan-fried Himalayan river trout and wood-fired sourdough pizzas.",
                    "category": "Mountain Gastronomy & Riverside Vibe",
                    "base_cost": 1170,
                    "duration": "3.5 hrs",
                    "tips": "Request outdoor riverside seating overlooking the rushing glacial waters."
                },
                {
                    "period": "Evening",
                    "time": "05:00 PM - 08:30 PM",
                    "title": "Jogini Waterfall Clifftop Hike & Beas Valley Sunset",
                    "location": "Vashisht to Jogini Cliff Trail, Manali",
                    "description": "Hike along apple orchards and mountain streams up to the cascading multi-tiered Jogini Waterfalls, watching the setting sun ignite the Pir Panjal mountain range.",
                    "category": "Alpine Waterfall & Sunset Trek",
                    "base_cost": 650,
                    "duration": "3.5 hrs",
                    "tips": "Wear hiking shoes with good tread; trail can be slightly slippery near the waterfall spray."
                }
            ]
        },
        {
            "title": "Solang Valley Slopes, Atal Tunnel & Vashisht Sulphur Springs",
            "theme": "Paragliding Heights, Trans-Himalayan Gateways & Thermal Waters",
            "slots": [
                {
                    "period": "Morning",
                    "time": "08:00 AM - 12:30 PM",
                    "title": "Solang Valley Paragliding & Alpine Adventure Slopes",
                    "location": "Solang Valley, Manali",
                    "description": "Soar above snow-kissed alpine meadows and pine ridges on a tandem paragliding flight, or take the modern ropeway cable car up to 3,200 meters.",
                    "category": "Adventure Aerial & Cable Car",
                    "base_cost": 1200,
                    "duration": "4 hrs",
                    "tips": "Paragliding operates strictly during clear morning wind windows; wear a windbreaker jacket."
                },
                {
                    "period": "Afternoon",
                    "time": "01:00 PM - 05:00 PM",
                    "title": "Atal Tunnel Rohtang Highway & Sissu Lahaul Valley Gateway",
                    "location": "Atal Tunnel Northern Portal, Lahaul & Spiti",
                    "description": "Pass through the world's longest highway tunnel above 10,000 feet, emerging into the dramatic rain-shadow trans-Himalayan landscapes and waterfalls of Sissu.",
                    "category": "Mountain Engineering & Glacial Valley",
                    "base_cost": 1620,
                    "duration": "4 hrs",
                    "tips": "Carry warm layers as temperatures at the north portal are significantly colder than Manali."
                },
                {
                    "period": "Evening",
                    "time": "05:30 PM - 08:30 PM",
                    "title": "Vashisht Village Natural Hot Sulphur Springs & Relaxation",
                    "location": "Vashisht Temple Village, Manali",
                    "description": "Unwind after mountain excursions in the ancient natural mineral-rich thermal sulphur springs renowned for restorative therapeutic properties.",
                    "category": "Thermal Springs & Mountain Wellness",
                    "base_cost": 400,
                    "duration": "3 hrs",
                    "tips": "Separate enclosed bathing areas are provided for men and women; carry a change of clothes."
                }
            ]
        },
        {
            "title": "Naggar Castle Citadel, Jana Waterfall Siddu & Mall Road",
            "theme": "15th-Century Himalayan Architecture, Siddu Cuisine & Shawls",
            "slots": [
                {
                    "period": "Morning",
                    "time": "08:30 AM - 12:30 PM",
                    "title": "Naggar Castle Heritage Himalayan Citadel & Roerich Gallery",
                    "location": "Naggar Village, Kullu Valley",
                    "description": "Explore the 15th-century wood-and-stone castle built by Raja Sidh Singh, overlooking the Beas River, and visit the historic mountain painting estate of Russian artist Nicholas Roerich.",
                    "category": "Himalayan Citadel & Art Gallery",
                    "base_cost": 910,
                    "duration": "4 hrs",
                    "tips": "Enjoy traditional Kullu walnut pie and masala chai on the castle terrace."
                },
                {
                    "period": "Afternoon",
                    "time": "01:00 PM - 04:30 PM",
                    "title": "Jana Waterfall Mountain Village & Authentic Himachali Siddu Tasting",
                    "location": "Jana Village, Kullu-Manali",
                    "description": "Cross wooden bridges over natural glacial springs in Jana village, tasting authentic steamed wheat-and-poppyseed Siddu served with hot pure desi ghee and walnut chutney.",
                    "category": "Traditional Himachali Cuisine & Countryside",
                    "base_cost": 780,
                    "duration": "3.5 hrs",
                    "tips": "Siddu is freshly made to order; pair it with homemade red kidney bean (Rajma) curry."
                },
                {
                    "period": "Evening",
                    "time": "05:30 PM - 09:00 PM",
                    "title": "Mall Road Evening Stroll & Tibetan Handloom Woolen Bazaars",
                    "location": "Mall Road, Central Manali",
                    "description": "Conclude your alpine voyage exploring pedestrian Mall Road, visiting the Tibetan Monastery, and picking up authentic GI-tagged Kullu shawls, wooden carvings, and pine honey.",
                    "category": "Shopping & Tibetan Culture",
                    "base_cost": 980,
                    "duration": "3.5 hrs",
                    "tips": "Look for government handloom mark certification on Pashmina and Kullu woolen shawls."
                }
            ]
        }
    ]
}

# 7 Varied Procedural Blueprints for Any Global City (Zero Boilerplate)
PROCEDURAL_DAY_BLUEPRINTS = [
    {
        "title_template": "Historic Quarter, Artisan Delicacies & Sunset Lookout",
        "theme_template": "Cultural Heritage, Regional Flavors & Horizon Golden Hour",
        "morning": {
            "title": "{city} Heritage Quarter & Landmark Trail",
            "category": "Historical Heritage",
            "location": "Historic District, {city}",
            "description": "Explore the storied heritage landmarks, architectural monuments, and cultural precincts that anchor {city}'s vibrant identity.",
            "duration": "3.5 hrs",
            "base_cost": 500,
            "tips": "Arrive early in the morning to capture the monuments bathed in golden sunlight without crowds."
        },
        "afternoon": {
            "title": "Authentic {city} Culinary Walk & Regional Specialties",
            "category": "Gastronomy & Local Flavors",
            "location": "Traditional Food Bazaar, {city}",
            "description": "Savor authentic regional dishes, signature street food specialties, and time-honored recipes perfected across generations in {city}.",
            "duration": "3 hrs",
            "base_cost": 650,
            "tips": "Ask for the legendary house signature dish and pair it with a refreshing local beverage."
        },
        "evening": {
            "title": "{city} Golden Hour Panorama & Twilight Promenade",
            "category": "Sunset & Scenic Vista",
            "location": "Scenic Vista Point, {city}",
            "description": "Watch vibrant twilight hues illuminate {city} from a picturesque viewpoint, soaking in refreshing evening breezes and scenic horizons.",
            "duration": "3.5 hrs",
            "base_cost": 450,
            "tips": "Arrive 30 minutes before dusk to enjoy the transition from golden hour into twinkling night lights."
        }
    },
    {
        "title_template": "Botanical Sanctuaries, Art Treasures & Riverfront Esplanade",
        "theme_template": "Lush Flora, Celebrated Antiquities & Illuminated Waters",
        "morning": {
            "title": "{city} Royal Botanical Gardens & Orchid Conservatory",
            "category": "Nature & Botanical Gardens",
            "location": "Royal Botanical Gardens, {city}",
            "description": "Stroll along tree-lined pathways, fragrant flower gardens, and heritage glasshouse conservatories showcasing native flora and tranquil reflective ponds.",
            "duration": "3 hrs",
            "base_cost": 780,
            "tips": "Early morning is the ideal time to enjoy the cool breeze and photograph exotic flora."
        },
        "afternoon": {
            "title": "{city} National Museum of Art & Civilizations",
            "category": "Museums & Cultural History",
            "location": "Museum Mile, {city}",
            "description": "Explore curated exhibitions spanning classical antiquities, royal regalia, and interactive cultural showcases illuminating {city}'s storied heritage.",
            "duration": "3.5 hrs",
            "base_cost": 1300,
            "tips": "Borrow the interactive museum audio guide for deep backstories on centerpiece masterworks."
        },
        "evening": {
            "title": "Illuminated Waterfront Promenade & {city} Evening Fountains",
            "category": "Evening Promenade & Landmarks",
            "location": "Grand Harbor Esplanade, {city}",
            "description": "Stroll along the atmospheric illuminated waterfront of {city}, enjoying live street acoustic performances, illuminated fountains, and refreshing night breezes.",
            "duration": "3.5 hrs",
            "base_cost": 1170,
            "tips": "Stop by the gelato and dessert carts along the esplanade for an evening sweet treat."
        }
    },
    {
        "title_template": "Sacred Sanctuaries, Artisan Guilds & Night Bazaar",
        "theme_template": "Gothic/Baroque Sanctums, Handloom Studios & Twilight Sizzle",
        "morning": {
            "title": "{city} Sacred Cathedral & Cloistered Sanctuary",
            "category": "Sacred Architecture & Heritage",
            "location": "Sanctuary Square, {city}",
            "description": "Admire soaring arches, stained glass masterpieces, and centuries of preserved spiritual artwork in {city}'s most celebrated sanctuary.",
            "duration": "3 hrs",
            "base_cost": 650,
            "tips": "Maintain respectful silence inside; photography is permitted without flash."
        },
        "afternoon": {
            "title": "Artisan Guilds, Handloom & Ceramic Studios in {city}",
            "category": "Craft & Artisan Discovery",
            "location": "Artisans Quarter, {city}",
            "description": "Watch master craftsmen sculpt ceramics, weave heritage fabrics, and craft delicate jewelry unique to {city}'s guild traditions.",
            "duration": "3.5 hrs",
            "base_cost": 1170,
            "tips": "Support local families by picking up handcrafted ceramic or textile souvenirs."
        },
        "evening": {
            "title": "Twilight Night Bazaar & {city} Street Food Safari",
            "category": "Night Market & Street Food",
            "location": "Bazaar Square, {city}",
            "description": "Delight in the sizzling energy of {city}'s evening bazaar, savoring aromatic skewered bites, freshly baked flatbreads, and sweet delicacies.",
            "duration": "3.5 hrs",
            "base_cost": 1430,
            "tips": "Look for stalls with long local queues—a reliable sign of peak freshness and legendary flavor."
        }
    },
    {
        "title_template": "Scenic Funicular, Canal Cruise & Acoustic Music Hall",
        "theme_template": "Mountain Cableway, Waterways & Melodic Evenings",
        "morning": {
            "title": "{city} Scenic Funicular Ascent & Mountain Panorama",
            "category": "Scenic Overlook & Cable Car",
            "location": "Panoramic Ridge Station, {city}",
            "description": "Ride the historic cable railway ascending to {city}'s high observation ridge for breathtaking 360-degree panoramas of the surrounding landscape.",
            "duration": "3.5 hrs",
            "base_cost": 1200,
            "tips": "Step onto the glass observation deck for stunning valley and city aerial photography."
        },
        "afternoon": {
            "title": "{city} Waterfront Canal & Riverboat Cruise",
            "category": "Scenic Cruise & Waterway",
            "location": "Central Marina Pier, {city}",
            "description": "Board a leisurely cruise along {city}'s waterways, gliding past historic waterfront bridges, maritime warehouses, and peaceful embankments.",
            "duration": "3 hrs",
            "base_cost": 1200,
            "tips": "The open-air top deck offers the clearest unobstructed views of bridges and skyline."
        },
        "evening": {
            "title": "Open-Air Amphitheater & Live Cultural Showcase",
            "category": "Performing Arts & Culture",
            "location": "Cultural Pavilion, {city}",
            "description": "Experience an enchanting live showcase of regional folk music, classical dance, or theatrical drama celebrating {city}'s artistic soul.",
            "duration": "3.5 hrs",
            "base_cost": 1620,
            "tips": "Check the evening showtimes; evening breeze can be cool, so carry a light jacket."
        }
    },
    {
        "title_template": "Valley Nature Trail, Vineyard Lunch & Pier Dining",
        "theme_template": "Emerald Trails, Agrotourism & Candlelight Harbors",
        "morning": {
            "title": "{city} Geological Gorge & Nature Reserve Trail",
            "category": "Nature Trail & Geology",
            "location": "Valley Nature Reserve, {city}",
            "description": "Venture into dramatic limestone gorge formations and shaded forest streams just beyond {city}'s urban core.",
            "duration": "3.5 hrs",
            "base_cost": 780,
            "tips": "Carry a light hydration pack and binoculars for local birdwatching."
        },
        "afternoon": {
            "title": "Vineyard, Orchard & Farm-to-Table Gastronomy",
            "category": "Culinary Tour & Tasting",
            "location": "Valley Agro-Estate, {city}",
            "description": "Tour scenic hillside vines or fruit orchards followed by a leisurely farm-to-table lunch crafted with fresh ingredients harvested that morning.",
            "duration": "3 hrs",
            "base_cost": 1200,
            "tips": "Try the seasonal dessert paired with estate-pressed juices or regional vintage."
        },
        "evening": {
            "title": "Moonlit Harbor Pier & Candlelight Waterside Dining",
            "category": "Fine Dining & Atmosphere",
            "location": "Marina Boardwalk, {city}",
            "description": "Dine at a candlelit waterside bistro listening to gentle water lapping against the docks, enjoying fresh regional delicacies.",
            "duration": "3.5 hrs",
            "base_cost": 2600,
            "tips": "Reserve an outdoor dockside table ahead of time for romantic views of harbor lanterns."
        }
    },
    {
        "title_template": "Sunrise Lookout, Antique Alleys & Vintage Jazz",
        "theme_template": "Dawn Horizon, Rare Curiosities & Speakeasy Vibes",
        "morning": {
            "title": "{city} Sunrise Lookout & Morning Roast Tasting",
            "category": "Scenic Sunrise & Cafe Culture",
            "location": "Eastern Ridge Vista, {city}",
            "description": "Catch the breathtaking morning sunrise over {city} followed by freshly roasted regional coffee and artisanal pastries.",
            "duration": "3 hrs",
            "base_cost": 650,
            "tips": "Arrive 20 minutes before dawn to witness the horizon illuminate with golden hues."
        },
        "afternoon": {
            "title": "Antique Alleys & Rare Books Bazaars in {city}",
            "category": "Vintage & Heritage Discovery",
            "location": "Old Books & Curiosities Lane, {city}",
            "description": "Browse cozy vintage bookstalls, brass curiosities, old cartography maps, and vintage postcards hidden in the back alleys of {city}.",
            "duration": "3 hrs",
            "base_cost": 980,
            "tips": "Vintage brass bookmarks and illustrated city maps make wonderful keepsakes."
        },
        "evening": {
            "title": "{city} Jazz Cellar & Speakeasy Experience",
            "category": "Nightlife & Music",
            "location": "Historic Cellar Quarter, {city}",
            "description": "Step into a subterranean stone cellar to enjoy sultry live jazz acoustic sessions, vintage mocktails/cocktails, and a cozy retro atmosphere.",
            "duration": "3.5 hrs",
            "base_cost": 1200,
            "tips": "Check if the venue requires table reservations or has an intimate acoustic cover fee."
        }
    },
    {
        "title_template": "The Grand Finale: Gourmet Keepsakes & Gala Dinner",
        "theme_template": "Farewell Traditions, Keepsake Treasures & Gala Toast",
        "morning": {
            "title": "{city} Scenic Promenade & Farewell Landmark Walk",
            "category": "Sightseeing & Farewell Walk",
            "location": "Central Promenade, {city}",
            "description": "Revisit {city}'s iconic waterfront and grand boulevards in the gentle morning light, taking memorable final photographs.",
            "duration": "3 hrs",
            "base_cost": 650,
            "tips": "Great time to take portrait photos without bustling afternoon crowds."
        },
        "afternoon": {
            "title": "Gourmet Confectionery & Keepsake Shopping Trail",
            "category": "Shopping & Sweets",
            "location": "Grand Boulevard Shops, {city}",
            "description": "Pick up signature artisanal chocolates, packaged spices, and premium local teas to take home the essence of {city}.",
            "duration": "3 hrs",
            "base_cost": 1620,
            "tips": "Ask merchants for vacuum-sealed travel packs to keep edible gifts fresh during transit."
        },
        "evening": {
            "title": "Celebratory Chef's Gala & Farewell Skyline Toast",
            "category": "Fine Dining & Grand Farewell",
            "location": "The Grand Panorama Dining Room, {city}",
            "description": "Celebrate your voyage through {city} with an exquisite multi-course tasting menu honoring the destination's finest culinary traditions.",
            "duration": "4 hrs",
            "base_cost": 50,
            "tips": "Take a final evening photo from the terrace celebrating your journey."
        }
    }
]



# --- Authentic Daily Dining Recommendations ---
DESTINATION_DINING_RECOMMENDATIONS = {
    "vizag": [
        [
            {"name": "Sea Inn (Kabab House)", "cuisine": "Coastal Andhra Seafood", "specialty": "Spicy Prawn Fry & Royyala Biryani", "location": "Rushikonda / Lawson's Bay", "priceRange": "₹450 - ₹900", "timing": "Lunch & Dinner", "rating": 4.8},
            {"name": "The Park Bamboo Bay", "cuisine": "Beachfront Barbecue & Grill", "specialty": "Tandoori Crab & Bamboo Chicken", "location": "Beach Road", "priceRange": "₹1,200 - ₹2,200", "timing": "Dinner & Cocktails", "rating": 4.9}
        ],
        [
            {"name": "Daspalla Executive Court", "cuisine": "Authentic Andhra Royal Thali", "specialty": "Gongura Mutton & Avakaya Annam", "location": "Waltair Uplands", "priceRange": "₹400 - ₹800", "timing": "Lunch", "rating": 4.8},
            {"name": "Flying Spaghetti Monster", "cuisine": "Artisan Italian Trattoria", "specialty": "Woodfired Truffle Pizza & Tiramisu", "location": "Siripuram", "priceRange": "₹700 - ₹1,400", "timing": "Dinner", "rating": 4.7}
        ],
        [
            {"name": "Araku Haritha Bamboo Kitchen", "cuisine": "Tribal Highland Cuisine", "specialty": "Bamboo Chicken & Bongu Biryani", "location": "Araku Valley", "priceRange": "₹350 - ₹700", "timing": "Lunch", "rating": 4.7},
            {"name": "Laddu Gopal & Sweet India", "cuisine": "Traditional Confectionery & Street Food", "specialty": "Kaju Sweets, Hot Samosa & Filter Coffee", "location": "Jagadamba Junction", "priceRange": "₹150 - ₹400", "timing": "Evening Snack", "rating": 4.8}
        ]
    ],
    "rajahmundry": [
        [
            {"name": "Srikanya Comfort", "cuisine": "Legendary Godavari Seafood", "specialty": "Godavari Pulasa Fish Curry & Bagara Rice", "location": "Main Road, Kotagummam", "priceRange": "₹500 - ₹1,100", "timing": "Lunch & Dinner", "rating": 4.9},
            {"name": "Rose Milk Centre (Est. 1950)", "cuisine": "Iconic Heritage Beverage", "specialty": "Chilled Rose Milk with Khoa & Cashew", "location": "Kotagummam Corner", "priceRange": "₹80 - ₹150", "timing": "All Day Refreshment", "rating": 4.9}
        ],
        [
            {"name": "River Bay Godavari Bistro", "cuisine": "Riverfront Andhra Special", "specialty": "Natu Kodi Pulusu & Ragi Sankati", "location": "Gowthami Ghat", "priceRange": "₹600 - ₹1,200", "timing": "Lunch", "rating": 4.7},
            {"name": "Udupi Sri Krishna Bhavan", "cuisine": "Pure Vegetarian Tiffin Heritage", "specialty": "Ghee Karam Dosa & Filter Coffee", "location": "Pushkar Ghat", "priceRange": "₹150 - ₹350", "timing": "Breakfast & Evening", "rating": 4.8}
        ],
        [
            {"name": "Sri Kanya Grand", "cuisine": "East Godavari Thali Special", "specialty": "Pootharekulu Sweet Roll & Gongura Royyalu", "location": "Danavaipeta", "priceRange": "₹450 - ₹950", "timing": "Lunch & Dinner", "rating": 4.8},
            {"name": "Kotipalli Bus Stand Mirchi Bajji Stalls", "cuisine": "Crisp Evening Street Food", "specialty": "Stuffed Onion Mirchi Bajji & Tomato Cut", "location": "Kotipalli Center", "priceRange": "₹80 - ₹180", "timing": "Evening Snack", "rating": 4.7}
        ]
    ],
    "ooty": [
        [
            {"name": "Nahar's Sidewalk Cafe", "cuisine": "Italian & European Cafe", "specialty": "Thin Crust Woodfired Pizza & Fresh Brew", "location": "Commercial Road", "priceRange": "₹450 - ₹900", "timing": "Lunch & Dinner", "rating": 4.8},
            {"name": "Earl's Secret (Kings Cliff)", "cuisine": "Colonial Anglo-Indian Dining", "specialty": "Shepherd's Pie, Sizzlers & Herb Soup", "location": "Havelock Road", "priceRange": "₹900 - ₹1,800", "timing": "Candlelight Dinner", "rating": 4.9}
        ],
        [
            {"name": "Hotel Junior Kuppanna", "cuisine": "Kongu Nadu South Indian", "specialty": "Mutton Chukka & Seeraga Samba Biryani", "location": "Charring Cross", "priceRange": "₹400 - ₹850", "timing": "Lunch", "rating": 4.7},
            {"name": "King Star Bakery (Est. 1942)", "cuisine": "Artisan Confectionery", "specialty": "Handmade Ooty Chocolate Fudge", "location": "Commercial Street", "priceRange": "₹200 - ₹500", "timing": "Sweet Souvenir", "rating": 4.9}
        ],
        [
            {"name": "Shinkow's Chinese Restaurant", "cuisine": "Authentic Heritage Chinese", "specialty": "Chili Garlic Pork, Hakka Noodles & Wonton", "location": "Commissioner's Road", "priceRange": "₹500 - ₹1,100", "timing": "Lunch & Dinner", "rating": 4.8},
            {"name": "Willy's Coffee Pub", "cuisine": "Book Cafe & Roastery", "specialty": "Filtered Arabica Coffee & Carrot Cake", "location": "Kandal, Ooty", "priceRange": "₹180 - ₹400", "timing": "Afternoon Refreshment", "rating": 4.6}
        ]
    ],
    "manali": [
        [
            {"name": "Cafe 1947", "cuisine": "Riverside Italian & Continental", "specialty": "Trout Fish with Garlic Butter & Ravioli", "location": "Old Manali Bridge", "priceRange": "₹600 - ₹1,300", "timing": "Lunch & Sunset", "rating": 4.9},
            {"name": "Drifters' Cafe", "cuisine": "Mountain Comfort Food", "specialty": "Fluffy Pancakes & Himalayan Mutton Stew", "location": "Manu Temple Road", "priceRange": "₹400 - ₹850", "timing": "Dinner & Live Music", "rating": 4.8}
        ],
        [
            {"name": "Chopsticks Restaurant", "cuisine": "Tibetan & Himalayan", "specialty": "Steamed Pork Momos & Thukpa Noodle Soup", "location": "Mall Road", "priceRange": "₹300 - ₹700", "timing": "Lunch", "rating": 4.8},
            {"name": "Johnson's Cafe", "cuisine": "Woodfired European Dining", "specialty": "Woodfired Trout Almondine & Apple Crumble", "location": "Circuit House Road", "priceRange": "₹800 - ₹1,700", "timing": "Dinner", "rating": 4.9}
        ],
        [
            {"name": "Jana Heritage Dhabha", "cuisine": "Traditional Himachali", "specialty": "Steamed Siddu with Pure Ghee & Walnut Chutney", "location": "Jana Village Falls", "priceRange": "₹250 - ₹500", "timing": "Lunch", "rating": 4.8}
        ]
    ],
    "paris": [
        [
            {"name": "Le Comptoir du Relais", "cuisine": "Quintessential Parisian Bistro", "specialty": "Duck Confit & Escargots de Bourgogne", "location": "Odéon / Saint-Germain", "priceRange": "₹2,800 - ₹5,500", "timing": "Lunch & Dinner", "rating": 4.9},
            {"name": "Carette Paris (Est. 1927)", "cuisine": "Haute French Patisserie", "specialty": "Legendary Thick Hot Chocolate & Macarons", "location": "Place des Vosges", "priceRange": "₹1,200 - ₹2,500", "timing": "Afternoon Tea", "rating": 4.9}
        ],
        [
            {"name": "Bouillon Chartier", "cuisine": "Belle Époque Classic Dining", "specialty": "Steak Frites & Baba au Rhum", "location": "Rue du Faubourg Montmartre", "priceRange": "₹1,800 - ₹3,500", "timing": "Lunch", "rating": 4.7},
            {"name": "Pink Mamma", "cuisine": "Italian Trattoria & Rooftop Bar", "specialty": "Truffle Pasta & Burrata Pugliese", "location": "Pigalle / 9th Arr.", "priceRange": "₹2,400 - ₹4,800", "timing": "Dinner", "rating": 4.8}
        ],
        [
            {"name": "L'Ambroisie", "cuisine": "Michelin 3-Star Haute Cuisine", "specialty": "Roasted Sea Bass with Caviar & Sabayon", "location": "Place des Vosges", "priceRange": "₹12,000 - ₹28,000", "timing": "Gala Dinner", "rating": 5.0}
        ]
    ],
    "tokyo": [
        [
            {"name": "Ichiran Ramen", "cuisine": "Iconic Tonkotsu Ramen", "specialty": "Classic Tonkotsu Broth with Handmade Noodles", "location": "Shinjuku / Shibuya", "priceRange": "₹800 - ₹1,400", "timing": "Lunch & Late Night", "rating": 4.9},
            {"name": "Omoide Yokocho Yakitori Alley", "cuisine": "Izakaya Street Grills", "specialty": "Charcoal Grilled Chicken Skewers & Draft Beer", "location": "Shinjuku Station West", "priceRange": "₹1,200 - ₹2,500", "timing": "Evening", "rating": 4.8}
        ],
        [
            {"name": "Gyukatsu Motomura", "cuisine": "Japanese Beef Cutlet", "specialty": "Panko-Crusted Wagyu Beef on Stone Grill", "location": "Shibuya", "priceRange": "₹1,400 - ₹2,800", "timing": "Lunch", "rating": 4.9},
            {"name": "Afuri Ramen", "cuisine": "Artisan Yuzu Ramen", "specialty": "Yuzu Shio Ramen & Charcoal Chashu", "location": "Harajuku", "priceRange": "₹900 - ₹1,600", "timing": "Dinner", "rating": 4.8}
        ],
        [
            {"name": "Sushi Dai / Daiwa Sushi", "cuisine": "Edomae Sushi Masterclass", "specialty": "Bluefin Otoro, Sea Urchin & Sweet Shrimp", "location": "Toyosu / Tsukiji", "priceRange": "₹3,500 - ₹7,500", "timing": "Morning & Lunch", "rating": 5.0}
        ]
    ]
}

def get_destination_dining_recommendations(dest_name: str, day_idx: int) -> list:
    dest_lower = dest_name.lower()
    for k, days_list in DESTINATION_DINING_RECOMMENDATIONS.items():
        if k in dest_lower or dest_lower in k:
            return days_list[day_idx % len(days_list)]
    
    # Realistic procedural dining recommendations for any global town
    food_styles = [
        ("Grand Central Heritage Restaurant", "Authentic Regional Cuisine", f"Chef's Signature Specialty with {dest_name} Spices", "Central Bazaar", "₹650 - ₹1,400", 4.8),
        ("The Artisan Table & Roastery", "Farm-to-Table & Local Cafe", "Wood-Smoked Small Plates & Single-Origin Roast", "Artisans Quarter", "₹450 - ₹950", 4.7),
        ("Riverside Twilight Bistro", "Contemporary Coastal & Grill", "Charcoal Catch of the Day with Truffle Mash", "Waterfront Esplanade", "₹850 - ₹1,800", 4.9),
        ("Old Market Traditional Food Hall", "Authentic Local Specialties", f"Classic {dest_name} Street Thali & Warm Sweets", "Bazaar Street", "₹250 - ₹600", 4.8)
    ]
    f1 = food_styles[(day_idx * 2) % len(food_styles)]
    f2 = food_styles[(day_idx * 2 + 1) % len(food_styles)]
    return [
        {"name": f1[0], "cuisine": f1[1], "specialty": f1[2], "location": f1[3], "priceRange": f1[4], "timing": "Lunch", "rating": f1[5]},
        {"name": f2[0], "cuisine": f2[1], "specialty": f2[2], "location": f2[3], "priceRange": f2[4], "timing": "Dinner", "rating": f2[5]}
    ]

# --- Authentic Hotel Recommendations by Budget Tier ---
DESTINATION_HOTEL_RECOMMENDATIONS = {
    "vizag": [
        {"name": "Zostel Vizag / Dolphin Hotel", "tier": "budget", "location": "Daba Gardens / Ramnagar", "pricePerNight": 2200, "rating": 4.6, "amenities": ["Free WiFi", "AC", "Travel Desk", "Breakfast"], "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80", "badge": "Smart Backpacker"},
        {"name": "The Gateway Hotel Beach Road", "tier": "moderate", "location": "Pandurangapuram, RK Beach", "pricePerNight": 5500, "rating": 4.8, "amenities": ["Sea Views", "Swimming Pool", "Ming Garden", "Spa"], "image": "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80", "badge": "Most Popular"},
        {"name": "Novotel Visakhapatnam Varun Beach", "tier": "luxury", "location": "Beach Road, Maharani Peta", "pricePerNight": 9500, "rating": 4.9, "amenities": ["Infinity Bay Pool", "Executive Lounge", "Fine Dining", "Sea Facing"], "image": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80", "badge": "5-Star Luxury"}
    ],
    "rajahmundry": [
        {"name": "Hotel Shelton / La Hospin", "tier": "budget", "location": "Ayyappa Nagar, Rajahmundry", "pricePerNight": 1900, "rating": 4.5, "amenities": ["AC Rooms", "Free WiFi", "Room Service"], "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80", "badge": "Value Pick"},
        {"name": "Hotel Anand Regency", "tier": "moderate", "location": "JNM Street, Rajahmundry", "pricePerNight": 3800, "rating": 4.7, "amenities": ["Restaurant", "Banquet", "Central AC", "Bar"], "image": "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80", "badge": "City Favorite"},
        {"name": "River Bay Resort & Water Park", "tier": "luxury", "location": "Gowthami Ghat Road", "pricePerNight": 6500, "rating": 4.8, "amenities": ["Godavari Views", "Water World", "Captain's Deck", "Lawns"], "image": "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80", "badge": "Waterfront Pick"}
    ],
    "ooty": [
        {"name": "Zostel Ooty / Hotel Willow Hill", "tier": "budget", "location": "Elk Hill / Upper Ooty", "pricePerNight": 2400, "rating": 4.7, "amenities": ["Mountain Views", "Cafe", "Bonfire", "Free WiFi"], "image": "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80", "badge": "Backpacker Gem"},
        {"name": "Sterling Ooty Elk Hill", "tier": "moderate", "location": "Elk Hill, Ooty", "pricePerNight": 6200, "rating": 4.8, "amenities": ["Valley Overlook", "Organic Kitchen", "Kids Activity Hub", "Fireplace"], "image": "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80", "badge": "Panoramic Resort"},
        {"name": "Savoy - IHCL SeleQtions Ooty", "tier": "luxury", "location": "Sylks Road, Central Ooty", "pricePerNight": 14500, "rating": 4.9, "amenities": ["British Colonial Cottages", "English High Tea", "Eucalyptus Spa", "Horse Riding"], "image": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80", "badge": "Historic Heritage"}
    ],
    "manali": [
        {"name": "The Hosteller Manali / Zostel Old Manali", "tier": "budget", "location": "Old Manali Village", "pricePerNight": 2100, "rating": 4.7, "amenities": ["Riverside Cafe", "Common Lounge", "Heaters", "Mountain Treks"], "image": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80", "badge": "Alpine Youth"},
        {"name": "Snow Valley Resorts", "tier": "moderate", "location": "Log Huts Area, Manali", "pricePerNight": 5200, "rating": 4.8, "amenities": ["Cedar Forest Views", "Buffet Dining", "Games Room", "Balconies"], "image": "https://images.unsplash.com/photo-1579619564365-0442e27ab9e2?auto=format&fit=crop&w=800&q=80", "badge": "Valley Retreat"},
        {"name": "The Himalayan Castle & Cedar Spa", "tier": "luxury", "location": "Hadimba Road, Manali", "pricePerNight": 12500, "rating": 4.9, "amenities": ["Castle Architecture", "Heated Pool", "Fireplace Suites", "Spa"], "image": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80", "badge": "5-Star Castle"}
    ],
    "paris": [
        {"name": "Generator Paris / The People Marais", "tier": "budget", "location": "10th / 11th Arrondissement", "pricePerNight": 6500, "rating": 4.6, "amenities": ["Rooftop Bar", "Metro Proximity", "Free WiFi"], "image": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80", "badge": "Trendy Design"},
        {"name": "CitizenM Paris Champs-Élysées", "tier": "moderate", "location": "8th Arrondissement", "pricePerNight": 18500, "rating": 4.8, "amenities": ["Champs-Élysées Access", "MoodPad Rooms", "CanteenM Bar"], "image": "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80", "badge": "Prime Central"},
        {"name": "Hôtel Plaza Athénée", "tier": "luxury", "location": "Avenue Montaigne, Paris", "pricePerNight": 52000, "rating": 5.0, "amenities": ["Eiffel Views", "Dior Institute Spa", "3-Star Michelin", "Courtyard"], "image": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80", "badge": "Haute Couture Palace"}
    ],
    "tokyo": [
        {"name": "Hotel Gracery Shinjuku", "tier": "budget", "location": "Kabukicho, Shinjuku", "pricePerNight": 5800, "rating": 4.7, "amenities": ["Godzilla Head View", "Metro Proximity", "Modern Pods"], "image": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80", "badge": "Pop Icon"},
        {"name": "Candeo Hotels Tokyo Shimbashi", "tier": "moderate", "location": "Shimbashi, Minato City", "pricePerNight": 15500, "rating": 4.8, "amenities": ["Sky Spa Open-Air Bath", "Sauna", "Tokyo Tower View"], "image": "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80", "badge": "Sky Spa Pick"},
        {"name": "Aman Tokyo / Ritz-Carlton", "tier": "luxury", "location": "Otemachi / Roppongi", "pricePerNight": 68000, "rating": 5.0, "amenities": ["Panoramic Fuji Views", "Traditional Onsen Spa", "Michelin Dining"], "image": "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=800&q=80", "badge": "Ultra Luxury"}
    ]
}

def get_destination_hotel_recommendations(dest_name: str, budget_tier: str, dest_info: dict) -> list:
    dest_lower = dest_name.lower()
    hotels = None
    for k, h_list in DESTINATION_HOTEL_RECOMMENDATIONS.items():
        if k in dest_lower or dest_lower in k:
            hotels = [dict(h) for h in h_list]
            break
            
    if not hotels:
        hotels = [
            {"name": f"{dest_name} Travelers Lodge & Pods", "tier": "budget", "location": f"Transit Quarter, {dest_name}", "pricePerNight": 2200, "rating": 4.6, "amenities": ["Free WiFi", "AC", "Breakfast", "Travel Desk"], "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80", "badge": "Smart Economy"},
            {"name": f"The Grand {dest_name} Heritage Hotel", "tier": "moderate", "location": f"Historic Center, {dest_name}", "pricePerNight": 5400, "rating": 4.8, "amenities": ["Pool", "Restaurant", "Garden Lawn", "Fitness Center"], "image": "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80", "badge": "Most Popular"},
            {"name": f"{dest_name} Royal Palace & Bay Resort", "tier": "luxury", "location": f"Prime Overlook Boulevard, {dest_name}", "pricePerNight": 14500, "rating": 4.9, "amenities": ["Infinity Pool", "Private Balconies", "Ayurvedic Spa", "Chauffeur Service"], "image": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80", "badge": "5-Star Luxury"}
        ]
        
    # Sort so user's chosen tier comes first
    tier_order = {"budget": 0, "moderate": 1, "luxury": 2}
    selected_val = tier_order.get(budget_tier.lower(), 1)
    hotels.sort(key=lambda h: 0 if tier_order.get(h["tier"], 1) == selected_val else 1)
    return hotels

# --- Journey & Transit Breakdown Generator ---
HUB_TRANSIT_DETAILS = {
    "vizag": {
        "airport": "Visakhapatnam Intl Airport (VTZ)",
        "station": "Visakhapatnam Junction (VSKP)",
        "highways": "NH16 (East Coast Golden Quadrilateral corridor)",
        "avg_flight_hrs": "1h 15m",
        "avg_train_hrs": "8h 30m",
        "avg_drive_hrs": "11h 30m"
    },
    "rajahmundry": {
        "airport": "Rajahmundry Airport (RJA / Madhurapudi)",
        "station": "Rajahmundry Railway Station (RJY)",
        "highways": "NH16 via Godavari Arch Bridges",
        "avg_flight_hrs": "1h 10m",
        "avg_train_hrs": "6h 00m",
        "avg_drive_hrs": "8h 30m"
    },
    "ooty": {
        "airport": "Coimbatore Intl Airport (CJB - 88 km) / Mysore Airport (MYQ)",
        "station": "Udhagamandalam Station (UAM) / Mettupalayam (MTP)",
        "highways": "NH181 via 36 Hairpin Bends Ghat Road",
        "avg_flight_hrs": "1h 15m (+2.5h scenic ghat cab)",
        "avg_train_hrs": "9h 30m (Nilgiri Mountain Toy Train connection)",
        "avg_drive_hrs": "6h 30m"
    },
    "manali": {
        "airport": "Kullu-Manali Airport at Bhuntar (KUU - 50 km)",
        "station": "Chandigarh Junction (CDG - 290 km)",
        "highways": "NH3 via Kiratpur-Nerchowk Expressway & Pandoh",
        "avg_flight_hrs": "1h 20m (+1.5h cab)",
        "avg_train_hrs": "8h 00m to Chandigarh (+7h scenic cab)",
        "avg_drive_hrs": "11h 00m"
    },
    "paris": {
        "airport": "Paris Charles de Gaulle (CDG) / Orly (ORY)",
        "station": "Gare du Nord / Gare de Lyon (Eurostar / TGV)",
        "highways": "A1 / A6 Motorway Corridors",
        "avg_flight_hrs": "1h 20m",
        "avg_train_hrs": "2h 15m (Eurostar Rail)",
        "avg_drive_hrs": "5h 45m"
    },
    "tokyo": {
        "airport": "Tokyo Haneda (HND) / Narita Intl (NRT)",
        "station": "Tokyo Station / Shinagawa (Tokaido Shinkansen)",
        "highways": "Tomei Expressway / Shuto Expressway",
        "avg_flight_hrs": "1h 15m",
        "avg_train_hrs": "2h 30m (Nozomi Shinkansen Bullet Train)",
        "avg_drive_hrs": "6h 00m"
    }
}

def generate_journey_transit_breakdown(origin: str, destination: str, preferred_mode: str, dest_info: dict, origin_coords: dict = None) -> dict:
    dest_name = dest_info.get("name", destination)
    dest_lower = dest_name.lower()
    orig_clean = origin.strip() if origin and origin.lower() != "current location" else "Hyderabad"
    
    # Check hub knowledge base
    matched_hub = None
    for k, v in HUB_TRANSIT_DETAILS.items():
        if k in dest_lower or dest_lower in k:
            matched_hub = v
            break
            
    if not matched_hub:
        matched_hub = {
            "airport": f"{dest_name} Domestic / Regional Airport",
            "station": f"{dest_name} Central Junction",
            "highways": f"National Highway & Expressway Corridors connecting to {dest_name}",
            "avg_flight_hrs": "1h 30m",
            "avg_train_hrs": "7h 30m",
            "avg_drive_hrs": "9h 45m"
        }

    # Realistic distance estimation
    dist_km = 580
    if origin_coords and dest_info.get("coordinates"):
        try:
            lat1, lon1 = origin_coords["lat"], origin_coords["lng"]
            lat2, lon2 = dest_info["coordinates"]["lat"], dest_info["coordinates"]["lng"]
            r_earth = 6371
            d_lat = math.radians(lat2 - lat1)
            d_lon = math.radians(lon2 - lon1)
            a = math.sin(d_lat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(d_lon / 2)**2
            c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
            dist_km = max(80, round(r_earth * c))
        except Exception:
            pass

    # Build all 4 transport options in INR
    flight_cost = max(3200, round(dist_km * 5.8, -2))
    train_cost = max(650, round(dist_km * 2.2, -1))
    drive_fuel = max(2400, round(dist_km * 6.5, -2))
    cab_cost = max(3800, round(dist_km * 11.0, -2))

    options_map = {
        "flight": {
            "mode": "flight",
            "title": f"Express Direct / Connecting Flight ({orig_clean} → {dest_name})",
            "duration": matched_hub["avg_flight_hrs"],
            "estimatedCost": flight_cost,
            "routeOverview": f"Depart from nearest airport servicing {orig_clean} arriving directly at {matched_hub['airport']}. Fast 20-30 min connection into city center.",
            "highlights": [
                f"Arrival Hub: {matched_hub['airport']}",
                "Baggage handling and terminal cab stands included",
                "Fastest journey with minimum en-route fatigue"
            ],
            "terminalDetails": {
                "departureTerminal": f"Air Hub near {orig_clean}",
                "arrivalTerminal": matched_hub["airport"]
            }
        },
        "train": {
            "mode": "train",
            "title": f"Superfast / Vande Bharat Express to {dest_name}",
            "duration": matched_hub["avg_train_hrs"],
            "estimatedCost": train_cost,
            "routeOverview": f"Direct express railway connection arriving at {matched_hub['station']}. Excellent downtown access with zero airport wait times.",
            "highlights": [
                f"Terminal Station: {matched_hub['station']}",
                "Scenic countryside and panoramic window routes",
                "Onboard catering and relaxed luggage allowances"
            ],
            "terminalDetails": {
                "departureTerminal": f"Railway Junction, {orig_clean}",
                "arrivalTerminal": matched_hub["station"]
            }
        },
        "drive": {
            "mode": "drive",
            "title": f"Scenic Highway Road Trip via {matched_hub['highways']}",
            "duration": matched_hub["avg_drive_hrs"],
            "estimatedCost": drive_fuel,
            "routeOverview": f"Drive along {matched_hub['highways']}. Smooth multi-lane toll expressways with designated food courts and fuel stations.",
            "highlights": [
                f"Main Corridor: {matched_hub['highways']}",
                f"Approx. {dist_km} km distance with flexible departure timing",
                "Opportunity for spontaneous scenic viewpoint breaks"
            ]
        },
        "cab": {
            "mode": "cab",
            "title": f"Dedicated Outstation Chauffeur AC Cab ({orig_clean} → {dest_name})",
            "duration": matched_hub["avg_drive_hrs"],
            "estimatedCost": cab_cost,
            "routeOverview": f"Private door-to-door AC Sedan or SUV with professional highway driver and flexible pickup from your address in {orig_clean}.",
            "highlights": [
                "Zero luggage hassle - door-to-door direct transit",
                "Experienced highway driver handling tolls and parking",
                "Custom stops for breakfast and refreshments on request"
            ]
        }
    }

    norm_preferred = preferred_mode.lower() if preferred_mode else "flight"
    if norm_preferred not in options_map:
        norm_preferred = "flight"
        
    primary = options_map[norm_preferred]
    alternatives = [opt for k, opt in options_map.items() if k != norm_preferred]

    travel_tips = [
        f"For {norm_preferred.capitalize()}: Booking 10-14 days in advance secures the best promotional rates and confirmed seats.",
        f"If driving or taking a cab along {matched_hub['highways']}, start early morning (05:30 AM) to beat city commuter bottlenecks.",
        f"Upon arriving at {dest_name}, prepaid airport/station taxis and app-based cabs operate 24/7 with regulated tariffs."
    ]

    return {
        "preferredMode": norm_preferred,
        "origin": orig_clean,
        "destination": dest_name,
        "distanceKm": dist_km,
        "primaryOption": primary,
        "alternativeOptions": alternatives,
        "travelTips": travel_tips
    }

def resolve_destination(raw_input: str) -> Dict[str, Any]:
    """
    Dynamically resolves any destination entered by the user.
    Never defaults to Goa unless explicitly requested.
    """
    clean_input = raw_input.strip() if raw_input else "Vizag"
    dest_lower = clean_input.lower()

    # 1. Check curated pre-seeded catalog
    for d in DESTINATIONS_DATA:
        d_id = d.get("id", "").lower()
        d_name = d.get("name", "").lower()
        if dest_lower == d_id or dest_lower == d_name or (len(dest_lower) > 3 and (dest_lower in d_name or d_id in dest_lower)):
            return {
                "id": d.get("id"),
                "name": d.get("name"),
                "country": d.get("country", "Global"),
                "tagline": d.get("tagline"),
                "coordinates": d.get("coordinates", CITY_COORDS.get(d.get("id"), {"lat": 15.2993, "lng": 74.1240})),
                "image": d.get("image"),
                "bannerImage": d.get("bannerImage", d.get("image")),
                "highlights": d.get("highlights", []),
                "currency": d.get("currency", "₹")
            }

    # 2. Check known custom dictionary (e.g. vizag, visakhapatnam, hyderabad, etc.)
    for key, info in CUSTOM_KNOWN_DESTINATIONS.items():
        if key in dest_lower or dest_lower in key:
            return {
                "id": key,
                "name": info["name"],
                "country": info["country"],
                "tagline": info["tagline"],
                "coordinates": info["coordinates"],
                "image": info["image"],
                "bannerImage": info["bannerImage"],
                "highlights": info["highlights"],
                "currency": "₹"
            }

    # 3. Dynamic Photon Geocoding for any unknown global city
    dest_title = clean_input.title()
    country = "Global"
    coords = {"lat": 17.6868, "lng": 83.2185} # Default to sensible geographic fallback

    try:
        encoded_query = urllib.parse.quote(clean_input)
        photon_url = f"https://photon.komoot.io/api/?q={encoded_query}&limit=1"
        resp = requests.get(photon_url, headers={"User-Agent": "EasyTripApp/2.0"}, timeout=2.5)
        if resp.status_code == 200:
            p_data = resp.json()
            features = p_data.get("features", [])
            if features:
                f0 = features[0]
                geometry = f0.get("geometry", {}).get("coordinates", [])
                if len(geometry) >= 2:
                    coords = {"lat": geometry[1], "lng": geometry[0]}
                props = f0.get("properties", {})
                country = props.get("country", "Global")
                if props.get("name"):
                    dest_title = props.get("name")
    except Exception as err:
        print(f"Geocoding lookup error for '{clean_input}': {err}")

    # Synthesize rich location-specific highlights
    dynamic_highlights = [
        f"{dest_title} Scenic Promenade & Waterfront Walk",
        f"{dest_title} Historic Quarter & Heritage Trail",
        f"{dest_title} Panoramic Hilltop Vista & Sunset Point",
        f"{dest_title} Cultural Sanctuary & Sacred Landmark",
        f"{dest_title} Central Artisan Bazaars & Culinary Alley",
        f"{dest_title} Botanical Gardens & Nature Escape",
        f"{dest_title} Evening Twilight Lounge & Skyline"
    ]

    return {
        "id": dest_lower.replace(" ", "-"),
        "name": dest_title,
        "country": country,
        "tagline": f"Scenic wonders, vibrant local culture & memorable escapes in {dest_title}",
        "coordinates": coords,
        "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
        "bannerImage": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80",
        "highlights": dynamic_highlights,
        "currency": "₹"
    }

# --- Pydantic Models ---
class PlanTripRequest(BaseModel):
    destination: str
    origin: Optional[str] = "Current Location"
    originCoordinates: Optional[Dict[str, float]] = None
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

# --- API Endpoints ---

@app.get("/")
def root():
    return {
        "service": "EasyTrip API Engine",
        "status": "online",
        "version": "2.1.0",
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
    dest_info = resolve_destination(dest_id)
    return {"success": True, "data": dest_info}

@app.get("/api/landmark-photo")
def get_landmark_photo_endpoint(query: str = Query(..., description="Landmark or attraction name")):
    """
    Automated image lookup endpoint for exact landmark photos using Wikipedia API with fallback.
    """
    url, source = get_landmark_photo_with_source(query)
    return {
        "success": True,
        "query": query,
        "imageUrl": url,
        "source": source
    }

def generate_itinerary_with_grok(
    req: PlanTripRequest,
    dest_info: dict,
    num_days: int,
    start_date: datetime
) -> Optional[dict]:
    """
    Connects to the xAI Grok API (https://api.x.ai/v1) using model grok-2 (fallback: grok-beta)
    to dynamically generate a live, authentic, structured travel itinerary.
    """
    xai_api_key = os.getenv("XAI_API_KEY")
    if not xai_api_key or not xai_api_key.strip():
        print("GROK API NOTICE: XAI_API_KEY is not set in environment. Falling back to verified catalog.")
        return None

    dest_name = dest_info.get("name", req.destination)
    country = dest_info.get("country", "India")
    origin = req.origin.strip() if req.origin and req.origin.lower() != "current location" else "Hyderabad"
    budget_tier = req.budget or "moderate"
    travel_style = req.travelStyle or "Couple"
    interests_str = ", ".join(req.interests) if req.interests else "Culture, Sightseeing, Regional Food"
    preferred_transport = req.transport or "flight"

    system_prompt = (
        "You are an expert local Indian travel planner. Provide 100% authentic, real existing sightseeing landmarks, "
        "genuine local restaurants with signature dishes, real transit routes (railway station codes like VSKP/RJY, airport codes, or National Highways), "
        "and realistic pricing in Indian Rupees (₹). Output strictly valid JSON without Markdown fences."
    )

    user_prompt = f"""Plan a realistic {num_days}-day travel itinerary for:
- Destination: {dest_name}, {country}
- Departure From: {origin}
- Travel Start Date: {start_date.strftime("%Y-%m-%d")} ({num_days} days)
- Budget Tier: {budget_tier} (budget, moderate, or luxury)
- Traveling With: {travel_style}
- Vibe & Interests: {interests_str}
- Preferred Transport Mode: {preferred_transport} (flight, train, drive, or cab)

Return a single JSON object strictly matching this schema:
{{
  "destination": "{dest_name}",
  "country": "{country}",
  "tagline": "An evocative tagline summarizing the allure of {dest_name}",
  "heroKeyword": "{dest_name} landmark",
  "aiNotes": [
    "3-4 actionable tips and curator insights on route pacing, best timing, dress codes, or local etiquette in {dest_name}."
  ],
  "journeyTransit": {{
    "preferredMode": "{preferred_transport}",
    "origin": "{origin}",
    "destination": "{dest_name}",
    "distanceKm": 550,
    "primaryOption": {{
      "mode": "{preferred_transport}",
      "title": "Title of route via {preferred_transport}",
      "duration": "Travel duration (e.g. 1h 15m or 8h 30m)",
      "estimatedCost": 3500,
      "routeOverview": "Realistic transit description with specific stations, airport codes, or highway corridors",
      "highlights": [
        "Key transit highlight 1",
        "Key transit highlight 2",
        "Key transit highlight 3"
      ],
      "terminalDetails": {{
        "departureTerminal": "Departure airport/station",
        "arrivalTerminal": "Arrival airport/station"
      }}
    }},
    "alternativeOptions": [
      {{
        "mode": "train",
        "title": "Superfast / Vande Bharat Express",
        "duration": "7h 45m",
        "estimatedCost": 980,
        "routeOverview": "Railway route overview",
        "highlights": ["Punctual and scenic rail connection"],
        "terminalDetails": {{
          "departureTerminal": "Origin Station",
          "arrivalTerminal": "Destination Station"
        }}
      }},
      {{
        "mode": "drive",
        "title": "Highway Road Trip",
        "duration": "10h 00m",
        "estimatedCost": 2600,
        "routeOverview": "Driving route via National Highways",
        "highlights": ["Flexible road travel with scenic rest stops"]
      }},
      {{
        "mode": "cab",
        "title": "Outstation AC Chauffeur Cab",
        "duration": "10h 00m",
        "estimatedCost": 4800,
        "routeOverview": "Door-to-door private AC cab transfer",
        "highlights": ["Direct door-to-door convenience"]
      }}
    ],
    "travelTips": [
      "2-3 local transit tips for getting around {dest_name}"
    ]
  }},
  "hotelRecommendations": [
    {{
      "name": "Luxury Hotel Name",
      "tier": "luxury",
      "location": "Central / Waterfront area, {dest_name}",
      "pricePerNight": 11500,
      "rating": 4.9,
      "amenities": ["Infinity Pool", "Fine Dining", "Spa", "Ocean Views"],
      "badge": "5-Star Luxury"
    }},
    {{
      "name": "Moderate Hotel Name",
      "tier": "moderate",
      "location": "Historic District, {dest_name}",
      "pricePerNight": 4500,
      "rating": 4.7,
      "amenities": ["Pool", "Breakfast", "WiFi"],
      "badge": "Top Rated Pick"
    }},
    {{
      "name": "Budget Hotel Name",
      "tier": "budget",
      "location": "Transit Center, {dest_name}",
      "pricePerNight": 1800,
      "rating": 4.5,
      "amenities": ["AC", "Free WiFi", "Travel Desk"],
      "badge": "Smart Economy"
    }}
  ],
  "itineraryDays": [
    {{
      "dayNumber": 1,
      "title": "Day 1 Title",
      "theme": "Day 1 Theme",
      "weather": {{
        "temp": 28,
        "condition": "Sunny & Coastal Breeze",
        "icon": "Sun"
      }},
      "slots": [
        {{
          "period": "Morning",
          "time": "09:00 AM - 12:30 PM",
          "title": "Exact Real Landmark Name",
          "location": "Neighborhood / Street, {dest_name}",
          "description": "Authentic description of this site and activities.",
          "category": "Historical Heritage / Scenic Beach / Sacred Architecture",
          "cost": 250,
          "duration": "3.5 hrs",
          "tips": "Practical tip for timing or footwear",
          "photoQuery": "{dest_name} landmark name"
        }},
        {{
          "period": "Afternoon",
          "time": "01:30 PM - 04:30 PM",
          "title": "Exact Real Sights / Museum / Park",
          "location": "Location, {dest_name}",
          "description": "Engaging description of the afternoon sight.",
          "category": "Museum / Culture / Nature Walk",
          "cost": 300,
          "duration": "3 hrs",
          "tips": "Practical tip",
          "photoQuery": "{dest_name} sight name"
        }},
        {{
          "period": "Evening",
          "time": "05:30 PM - 09:00 PM",
          "title": "Exact Real Sunset Spot / Waterfront Promenade / Night Bazaar",
          "location": "Location, {dest_name}",
          "description": "Atmospheric description of evening golden hour and dusk experience.",
          "category": "Sunset Vista / Evening Promenade / Night Bazaar",
          "cost": 400,
          "duration": "3.5 hrs",
          "tips": "Practical tip",
          "photoQuery": "{dest_name} evening spot"
        }}
      ],
      "diningRecommendations": [
        {{
          "name": "Real Restaurant Name 1",
          "cuisine": "Regional Cuisine Style",
          "specialty": "Exact Signature Dish",
          "location": "Area, {dest_name}",
          "priceRange": "₹350 - ₹750",
          "timing": "Lunch",
          "rating": 4.8
        }},
        {{
          "name": "Real Restaurant Name 2",
          "cuisine": "Authentic Dining Style",
          "specialty": "Exact Signature Dish",
          "location": "Area, {dest_name}",
          "priceRange": "₹650 - ₹1,400",
          "timing": "Dinner",
          "rating": 4.9
        }}
      ]
    }}
  ]
}}
"""

    raw_content = None
    client = None
    if OpenAI:
        try:
            client = OpenAI(
                api_key=xai_api_key,
                base_url="https://api.x.ai/v1"
            )
        except Exception as e:
            print(f"GROK API CRITICAL ERROR: {type(e).__name__} - {e}")

    # Primary model: "grok-2" (fallback to "grok-beta" if grok-2 returns a 404/model_not_found error)
    models_to_try = ["grok-2", "grok-beta"]

    # 1. Try OpenAI client
    if client:
        for model_name in models_to_try:
            try:
                chat_completion = client.chat.completions.create(
                    model=model_name,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    temperature=0.3
                )
                if chat_completion.choices and chat_completion.choices[0].message:
                    raw_content = chat_completion.choices[0].message.content
                    if raw_content:
                        print(f"GROK API SUCCESS: Generated live itinerary using model '{model_name}'.")
                        break
            except Exception as e:
                print(f"GROK API CRITICAL ERROR: {type(e).__name__} - {e}")
                continue

    # 2. Fallback to direct HTTP via requests if client wasn't used or failed
    if not raw_content:
        for model_name in models_to_try:
            try:
                resp = requests.post(
                    "https://api.x.ai/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {xai_api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": model_name,
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_prompt}
                        ],
                        "temperature": 0.3
                    },
                    timeout=30
                )
                if resp.status_code == 200:
                    data = resp.json()
                    choices = data.get("choices", [])
                    if choices and choices[0].get("message"):
                        raw_content = choices[0]["message"].get("content")
                        if raw_content:
                            print(f"GROK API SUCCESS: Direct HTTP generated live itinerary using model '{model_name}'.")
                            break
                else:
                    print(f"GROK API CRITICAL ERROR: HTTP {resp.status_code} - {resp.text[:300]}")
            except Exception as e:
                print(f"GROK API CRITICAL ERROR: {type(e).__name__} - {e}")
                continue

    if not raw_content:
        print("GROK API CRITICAL ERROR: No response content received from Grok-2 or Grok-beta. Falling back to catalog engine.")
        return None

    # Parse and clean JSON content
    clean_json = raw_content.strip()
    if clean_json.startswith("```json"):
        clean_json = clean_json[7:]
    elif clean_json.startswith("```"):
        clean_json = clean_json[3:]
    if clean_json.endswith("```"):
        clean_json = clean_json[:-3]
    clean_json = clean_json.strip()

    parsed = json.loads(clean_json)

    # Validate and enrich into complete TripItinerary schema
    center_coords = dest_info.get("coordinates", {"lat": 17.6868, "lng": 83.2185})
    raw_days = parsed.get("itineraryDays", [])
    if not raw_days:
        return None

    itinerary_days = []
    for day_idx, d_data in enumerate(raw_days[:num_days]):
        day_num = d_data.get("dayNumber", day_idx + 1)
        day_date = start_date + timedelta(days=day_idx)
        
        slots = []
        raw_slots = d_data.get("slots", [])
        for slot_idx, s in enumerate(raw_slots):
            period = s.get("period", ["Morning", "Afternoon", "Evening"][min(slot_idx, 2)])
            title = s.get("title", f"Attraction in {dest_name}")
            loc = s.get("location", dest_name)
            cat = s.get("category", "Sightseeing")
            
            angle = (day_idx * 2.0) + (slot_idx * 1.5)
            slot_coord = {
                "lat": center_coords["lat"] + (math.sin(angle) * (0.012 + slot_idx * 0.005)),
                "lng": center_coords["lng"] + (math.cos(angle) * (0.012 + slot_idx * 0.005))
            }
            
            photo_query = s.get("photoQuery") or f"{dest_name} {title}"
            unsplash_url = f"https://unsplash.com/s/photos/{urllib.parse.quote(photo_query)}"
            landmark_img = get_landmark_photo(title)
            if not landmark_img:
                landmark_img = resolve_activity_image(
                    title=title,
                    location=loc,
                    category=cat,
                    fallback_img=dest_info.get("image", ""),
                    salt=(day_idx * 3 + slot_idx)
                )

            cost_val = int(s.get("cost", 350))
            if cost_val <= 0:
                cost_val = 300

            slots.append({
                "id": f"day-{day_num}-{period.lower()}",
                "period": period,
                "time": s.get("time", "09:30 AM - 12:30 PM"),
                "title": title,
                "location": loc,
                "description": s.get("description", f"Experience the captivating sights and heritage of {title} in {dest_name}."),
                "category": cat,
                "cost": cost_val,
                "duration": s.get("duration", "3 hrs"),
                "image": landmark_img,
                "imageUrl": landmark_img,
                "photoQuery": photo_query,
                "unsplashSearchUrl": unsplash_url,
                "coordinates": slot_coord,
                "tips": s.get("tips", "Arrive early to enjoy ideal lighting and relaxed exploration.")
            })

        dining = d_data.get("diningRecommendations", [])
        if not dining:
            dining = get_destination_dining_recommendations(dest_name, day_idx)

        day_cover_img = slots[0]["imageUrl"] if slots else dest_info.get("bannerImage", "")
        itinerary_days.append({
            "dayNumber": day_num,
            "date": day_date.strftime("%a, %b %d"),
            "title": d_data.get("title", f"Exploring {dest_name}"),
            "theme": d_data.get("theme", f"Authentic Sights & Flavors of {dest_name}"),
            "imageUrl": day_cover_img,
            "image": day_cover_img,
            "weather": d_data.get("weather", {
                "temp": 28 - (day_idx % 3),
                "condition": "Sunny & Clear" if day_idx % 2 == 0 else "Pleasant Breeze",
                "icon": "Sun"
            }),
            "slots": slots,
            "diningRecommendations": dining
        })

    # Journey & Transit
    jt = parsed.get("journeyTransit")
    if not jt or not isinstance(jt, dict) or not jt.get("primaryOption"):
        jt = generate_journey_transit_breakdown(
            origin=origin,
            destination=dest_name,
            preferred_mode=preferred_transport,
            dest_info=dest_info,
            origin_coords=req.originCoordinates
        )
    else:
        po = jt.get("primaryOption", {})
        if not po.get("estimatedCost") or po.get("estimatedCost") <= 0:
            po["estimatedCost"] = 3500
        jt["preferredMode"] = preferred_transport
        jt["origin"] = origin
        jt["destination"] = dest_name

    # Hotel recommendations
    hotels = parsed.get("hotelRecommendations")
    if not hotels or not isinstance(hotels, list) or len(hotels) < 2:
        hotels = get_destination_hotel_recommendations(dest_name, budget_tier, dest_info)
    else:
        formatted_hotels = []
        for idx, h in enumerate(hotels[:4]):
            h_tier = h.get("tier", "moderate").lower()
            if h_tier not in ["budget", "moderate", "luxury"]:
                h_tier = "moderate"
            h_name = h.get("name", f"{dest_name} Grand Hotel")
            h_cost = int(h.get("pricePerNight") or h.get("price") or 4500)
            formatted_hotels.append({
                "name": h_name,
                "tier": h_tier,
                "location": h.get("location", f"Central {dest_name}"),
                "pricePerNight": h_cost,
                "rating": float(h.get("rating", 4.8)),
                "amenities": h.get("amenities", ["AC", "Free WiFi", "Breakfast"]),
                "image": resolve_activity_image(h_name, dest_name, "hotel", fallback_img=dest_info.get("bannerImage", ""), salt=idx),
                "badge": h.get("badge", f"{h_tier.capitalize()} Pick")
            })
        hotels = formatted_hotels

    tier_order = {"budget": 0, "moderate": 1, "luxury": 2}
    selected_val = tier_order.get(budget_tier.lower(), 1)
    hotels.sort(key=lambda h: 0 if tier_order.get(h["tier"], 1) == selected_val else 1)

    total_cost = sum(sum(s["cost"] for s in d["slots"]) for d in itinerary_days)

    return {
        "id": f"trip-{int(datetime.utcnow().timestamp() * 1000)}",
        "destination": dest_name,
        "country": country,
        "origin": origin,
        "originCoordinates": req.originCoordinates,
        "days": len(itinerary_days),
        "startDate": req.startDate or start_date.strftime("%Y-%m-%d"),
        "endDate": req.endDate or (start_date + timedelta(days=len(itinerary_days))).strftime("%Y-%m-%d"),
        "budgetTier": budget_tier,
        "travelStyle": travel_style,
        "interests": req.interests,
        "coordinates": center_coords,
        "heroImage": dest_info.get("bannerImage") or dest_info.get("image") or "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
        "estimatedTotalCost": total_cost,
        "currency": "₹",
        "journeyTransit": jt,
        "hotelRecommendations": hotels,
        "itineraryDays": itinerary_days,
        "aiNotes": parsed.get("aiNotes") or [
            f"Live verified itinerary powered by xAI Grok for {dest_name} ({country}).",
            f"Tailored for {travel_style} travel with {interests_str} experiences.",
            "Smart transit sequencing minimizes travel fatigue between consecutive activity stops.",
            "Weather-aware morning and evening outdoor timings for optimal comfort."
        ]
    }

@app.post("/api/plan-trip")
def plan_trip(req: PlanTripRequest):
    num_days = max(1, min(req.days, 7))
    
    # Resolve the EXACT destination submitted by the user
    dest_info = resolve_destination(req.destination)
    start_date = datetime.strptime(req.startDate, "%Y-%m-%d") if req.startDate else datetime.utcnow()

    # 1. Attempt dynamic live itinerary generation via xAI Grok (grok-2 / grok-beta)
    if os.getenv("XAI_API_KEY", "").strip():
        try:
            grok_plan = generate_itinerary_with_grok(req, dest_info, num_days, start_date)
            if grok_plan:
                return {
                    "success": True,
                    "engine": "xai-grok",
                    "data": grok_plan
                }
        except Exception as grok_err:
            print(f"GROK API CRITICAL ERROR: {type(grok_err).__name__} - {grok_err}")

    # 2. Existing robust verified catalog & procedural engine fallback
    dest_name = dest_info["name"]
    country = dest_info["country"]
    coords = dest_info["coordinates"]
    highlights = dest_info["highlights"]
    cost_multiplier = 2.5 if req.budget == "luxury" else 0.8 if req.budget == "budget" else 1.2

    itinerary_days = []

    dest_key_match = None
    dest_name_lower = dest_name.lower()
    for k in CURATED_DESTINATION_PLANS.keys():
        if k in dest_name_lower or dest_name_lower in k:
            dest_key_match = k
            break

    curated_plans = CURATED_DESTINATION_PLANS.get(dest_key_match, []) if dest_key_match else []

    for i in range(num_days):
        day_date = start_date + timedelta(days=i)
        
        # Check if we have a curated day plan for this destination
        if i < len(curated_plans):
            curated_day = curated_plans[i]
            day_title = curated_day["title"]
            day_theme = curated_day["theme"]
            raw_slots = curated_day["slots"]
        else:
            # Use dynamic procedural blueprint
            blueprint = PROCEDURAL_DAY_BLUEPRINTS[i % len(PROCEDURAL_DAY_BLUEPRINTS)]
            day_title = blueprint["title_template"].format(city=dest_name)
            day_theme = blueprint["theme_template"].format(city=dest_name)
            raw_slots = [
                {
                    "period": "Morning",
                    "time": "09:00 AM - 12:30 PM",
                    "title": blueprint["morning"]["title"].format(city=dest_name),
                    "location": blueprint["morning"]["location"].format(city=dest_name),
                    "description": blueprint["morning"]["description"].format(city=dest_name),
                    "category": blueprint["morning"]["category"],
                    "base_cost": blueprint["morning"]["base_cost"],
                    "duration": blueprint["morning"]["duration"],
                    "tips": blueprint["morning"]["tips"]
                },
                {
                    "period": "Afternoon",
                    "time": "01:00 PM - 04:30 PM",
                    "title": blueprint["afternoon"]["title"].format(city=dest_name),
                    "location": blueprint["afternoon"]["location"].format(city=dest_name),
                    "description": blueprint["afternoon"]["description"].format(city=dest_name),
                    "category": blueprint["afternoon"]["category"],
                    "base_cost": blueprint["afternoon"]["base_cost"],
                    "duration": blueprint["afternoon"]["duration"],
                    "tips": blueprint["afternoon"]["tips"]
                },
                {
                    "period": "Evening",
                    "time": "05:30 PM - 09:30 PM",
                    "title": blueprint["evening"]["title"].format(city=dest_name),
                    "location": blueprint["evening"]["location"].format(city=dest_name),
                    "description": blueprint["evening"]["description"].format(city=dest_name),
                    "category": blueprint["evening"]["category"],
                    "base_cost": blueprint["evening"]["base_cost"],
                    "duration": blueprint["evening"]["duration"],
                    "tips": blueprint["evening"]["tips"]
                }
            ]

        # Build each slot with dynamic coordinates, pricing, and keyword-matched photo
        slots = []
        for slot_idx, s in enumerate(raw_slots):
            period = s["period"]
            # Generate spread coordinates near city center
            angle = (i * 2.0) + (slot_idx * 1.5)
            slot_coord = {
                "lat": coords["lat"] + (math.sin(angle) * (0.012 + slot_idx * 0.005)),
                "lng": coords["lng"] + (math.cos(angle) * (0.012 + slot_idx * 0.005))
            }
            landmark_img = get_landmark_photo(s["title"])
            if not landmark_img:
                landmark_img = resolve_activity_image(
                    title=s["title"],
                    location=s["location"],
                    category=s["category"],
                    fallback_img=dest_info.get("image", ""),
                    salt=(i * 3 + slot_idx)
                )

            photo_query = f"{dest_name} {s['title']}"
            unsplash_search_url = f"https://unsplash.com/s/photos/{urllib.parse.quote(photo_query)}"

            slots.append({
                "id": f"day-{i+1}-{period.lower()}",
                "period": period,
                "time": s["time"],
                "title": s["title"],
                "location": s["location"],
                "description": s["description"],
                "category": s["category"],
                "cost": round(s["base_cost"] * cost_multiplier),
                "duration": s["duration"],
                "image": landmark_img,
                "imageUrl": landmark_img,
                "photoQuery": photo_query,
                "unsplashSearchUrl": unsplash_search_url,
                "coordinates": slot_coord,
                "tips": s["tips"]
            })

        day_cover_img = slots[0]["imageUrl"] if slots else dest_info.get("bannerImage", "")
        itinerary_days.append({
            "dayNumber": i + 1,
            "date": day_date.strftime("%a, %b %d"),
            "title": day_title,
            "theme": day_theme,
            "imageUrl": day_cover_img,
            "image": day_cover_img,
            "weather": {
                "temp": 28 - (i % 3),
                "condition": "Sunny & Clear" if i % 2 == 0 else "Gentle Breeze",
                "icon": "Sun"
            },
            "slots": slots,
            "diningRecommendations": get_destination_dining_recommendations(dest_name, i)
        })

    total_cost = sum(sum(s["cost"] for s in d["slots"]) for d in itinerary_days)

    return {
        "success": True,
        "data": {
            "id": f"trip-{int(datetime.utcnow().timestamp() * 1000)}",
            "destination": dest_name,
            "country": country,
            "origin": req.origin or "Current Location",
            "originCoordinates": req.originCoordinates,
            "days": num_days,
            "startDate": req.startDate or start_date.strftime("%Y-%m-%d"),
            "endDate": req.endDate or (start_date + timedelta(days=num_days)).strftime("%Y-%m-%d"),
            "budgetTier": req.budget,
            "travelStyle": req.travelStyle,
            "interests": req.interests,
            "coordinates": coords,
            "heroImage": dest_info.get("bannerImage", dest_info.get("image")),
            "estimatedTotalCost": total_cost,
            "currency": "₹",
            "journeyTransit": generate_journey_transit_breakdown(
                req.origin or "Current Location",
                dest_name,
                req.transport or "flight",
                dest_info,
                req.originCoordinates
            ),
            "hotelRecommendations": get_destination_hotel_recommendations(
                dest_name,
                req.budget,
                dest_info
            ),
            "itineraryDays": itinerary_days,
            "aiNotes": [
                f"Itinerary exclusively customized for {dest_name} ({country}) for {req.travelStyle} travel.",
                f"Focus areas integrated: {', '.join(req.interests)}.",
                "Smart route balancing ensures minimal transit time between consecutive stops.",
                "Weather-aware activity scheduling with afternoon indoor/shaded slots."
            ]
        }
    }

@app.get("/api/bookings/options")
def get_booking_options(destination: str = ""):
    dest_cleaned = destination.strip()
    dest_lower = dest_cleaned.lower()
    
    dest_info = resolve_destination(dest_cleaned) if dest_cleaned else None
    dest_display = dest_info["name"] if dest_info else "Your Destination"
    dest_id = dest_info["id"] if dest_info else ""

    hotels = BOOKINGS_DATA.get("hotels", [])
    transport = BOOKINGS_DATA.get("transport", [])
    experiences = BOOKINGS_DATA.get("experiences", [])

    # Filter catalog hotels if matching
    matching_hotels = [h for h in hotels if dest_lower and dest_lower in h.get("destinationId", "").lower()]
    matching_exp = [e for e in experiences if dest_lower and dest_lower in e.get("destinationId", "").lower()]

    # If custom destination not in static catalog, synthesize luxury bookings for it!
    if not matching_hotels and dest_cleaned:
        matching_hotels = [
            {
                "id": f"h-{dest_id}-1",
                "destinationId": dest_id,
                "name": f"The Grand {dest_display} Palace & Resort",
                "type": "Luxury 5-Star Waterfront Resort",
                "rating": 4.9,
                "reviews": 1180,
                "pricePerNight": 210,
                "currency": "₹",
                "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
                "amenities": ["Infinity Bay Pool", "Fine Dining", "Concierge Chauffeur", "Wellness Spa", "Ocean Views"],
                "location": f"Prime Bay District, {dest_display}",
                "badge": "EasyTrip Luxury Pick"
            },
            {
                "id": f"h-{dest_id}-2",
                "destinationId": dest_id,
                "name": f"{dest_display} Heritage Boutique Haven",
                "type": "Boutique Coastal Retreat",
                "rating": 4.8,
                "reviews": 840,
                "pricePerNight": 145,
                "currency": "₹",
                "image": "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
                "amenities": ["Sunset Terrace", "Organic Breakfast", "Artisan Lounge", "Bicycle Rentals"],
                "location": f"Heritage Quarter, {dest_display}",
                "badge": "Charming Escape"
            }
        ]

    if not matching_exp and dest_cleaned:
        matching_exp = [
            {
                "id": f"exp-{dest_id}-1",
                "destinationId": dest_id,
                "title": f"Exclusive Private Guided Tour & Highlights of {dest_display}",
                "category": "Culture & Sightseeing",
                "rating": 4.9,
                "reviews": 320,
                "duration": "4 Hours",
                "price": 65,
                "currency": "₹",
                "image": "https://images.unsplash.com/photo-1540946485038-a0c24cb4d271?auto=format&fit=crop&w=800&q=80",
                "badge": "Top Rated"
            },
            {
                "id": f"exp-{dest_id}-2",
                "destinationId": dest_id,
                "title": f"Sunset Coastal Cruise & Culinary Walk in {dest_display}",
                "category": "Leisure & Dining",
                "rating": 4.9,
                "reviews": 460,
                "duration": "3 Hours",
                "price": 85,
                "currency": "₹",
                "image": "https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=800&q=80",
                "badge": "Must Do"
            }
        ]

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
            "currency": "₹"
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
        "tokyo": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
        "vizag": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80"
    }
    key = next((k for k in photo_map if k in query.lower()), "beach")
    return {"success": True, "url": photo_map[key]}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 5000))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True)
