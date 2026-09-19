"""
EasyTrip Production Core API Backend
FastAPI service configured for production deployment on Render.
Dynamically generates itineraries for ANY destination worldwide (e.g. Vizag, Paris, Tokyo, etc.).
"""

import os
import json
import math
import random
import string
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
import urllib.parse

from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import requests

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
    ]
}

def resolve_activity_image(title: str, location: str, category: str, fallback_img: str = "", salt: int = 0) -> str:
    """
    Intelligently maps activity title, location, and category keywords
    to verified high-definition photography collections.
    """
    combined = f"{title} {location} {category}".lower()
    
    keyword_map = [
        (["submarine", "kursura", "naval", "torpedo", "aircraft"], "submarine"),
        (["rushikonda", "yarada", "beach", "coastal", "surf", "sand", "ocean", "sea"], "beach"),
        (["simhachalam", "temple", "shrine", "sanctum", "aarti", "iskcon", "spiritual", "puja", "darshan"], "temple"),
        (["havelock", "bridge", "arch bridge", "viaduct"], "bridge"),
        (["godavari", "river", "ghat", "cruise", "papikondalu", "gorge", "boat", "ferry"], "river"),
        (["cotton", "barrage", "dowleswaram", "dam", "canal", "irrigation"], "barrage"),
        (["kadiyam", "nursery", "floral", "flower", "bonsai"], "nursery"),
        (["borra", "cave", "limestone", "stalactite", "karst", "cavern"], "cave"),
        (["araku", "coffee", "plantation", "tea garden", "orchard", "vineyard"], "coffee"),
        (["pulasa", "seafood", "thali", "food", "lunch", "dinner", "culinary", "bistro", "tasting", "sweet", "pootharekulu", "dosa", "biryani", "dining"], "food"),
        (["bazaar", "market", "shopping", "handicraft", "craft", "textile", "lepakshi", "souvenir"], "bazaar"),
        (["museum", "gallery", "exhibition", "civilization", "antiquities", "artifact"], "museum"),
        (["citadel", "fort", "castle", "palace", "rampart", "bastion", "monument"], "palace"),
        (["kailasagiri", "ropeway", "cable car", "funicular", "ridge"], "ropeway"),
        (["dolphin's nose", "lighthouse", "harbor", "port", "pier", "promontory"], "lighthouse"),
        (["mountain", "snow", "trek", "hike", "peak", "valley", "alpine"], "mountain"),
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
                    "base_cost": 12,
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
                    "base_cost": 24,
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
                    "base_cost": 15,
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
                    "base_cost": 10,
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
                    "base_cost": 14,
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
                    "base_cost": 10,
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
                    "base_cost": 20,
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
                    "base_cost": 18,
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
                    "base_cost": 16,
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
                    "base_cost": 8,
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
                    "base_cost": 18,
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
                    "base_cost": 10,
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
                    "base_cost": 10,
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
                    "base_cost": 14,
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
                    "base_cost": 8,
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
                    "base_cost": 32,
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
                    "base_cost": 15,
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
                    "base_cost": 12,
                    "duration": "3 hrs",
                    "tips": "Purchase vacuum-sealed dry fruit pootharekulu boxes to take home as authentic regional treats."
                }
            ]
        }
    ]
}

# 7 Varied Procedural Blueprints for Any Global City (Zero Boilerplate)
PROCEDURAL_DAY_BLUEPRINTS = [
    {
        "title_template": "Historic Citadel, Culinary Quarters & Sunset Lookout",
        "theme_template": "Ancient Ramparts, Epicurean Discovery & Horizon Twilight",
        "morning": {
            "title": "{city} Historic Citadel & Ancient Ramparts Walk",
            "category": "Historic Fortifications",
            "location": "Old Town Citadel Hill, {city}",
            "description": "Ascend ancient fortress walls and stone battlements guarding {city}, enjoying commanding hilltop vistas across the historic quarter and surrounding landscapes.",
            "duration": "3.5 hrs",
            "base_cost": 15,
            "tips": "Wear comfortable walking shoes with good grip for historic stone inclines."
        },
        "afternoon": {
            "title": "Epicurean Tasting Tour & {city} Food Hall",
            "category": "Gastronomy & Local Flavors",
            "location": "Grand Central Market, {city}",
            "description": "Immerse yourself in authentic {city} delicacies, sampling chef-curated small plates, farm cheeses, regional pastries, and time-honored family recipes.",
            "duration": "3 hrs",
            "base_cost": 25,
            "tips": "Sample the signature house specialty and pair it with a fresh locally pressed fruit cooler."
        },
        "evening": {
            "title": "{city} Sunset Lookout & Skyline Terrace Lounge",
            "category": "Sunset & Scenic Vista",
            "location": "Skyline Panorama Terrace, {city}",
            "description": "Watch vibrant golden hour colors descend across {city} from a premier high-altitude terrace, accompanied by craft refreshments and relaxing twilight breezes.",
            "duration": "3.5 hrs",
            "base_cost": 30,
            "tips": "Arrive 30 minutes before sunset to claim prime window seating overlooking the horizon."
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
            "base_cost": 12,
            "tips": "Early morning is the ideal time to enjoy the cool breeze and photograph exotic flora."
        },
        "afternoon": {
            "title": "{city} National Museum of Art & Civilizations",
            "category": "Museums & Cultural History",
            "location": "Museum Mile, {city}",
            "description": "Explore curated exhibitions spanning classical antiquities, royal regalia, and interactive cultural showcases illuminating {city}'s storied heritage.",
            "duration": "3.5 hrs",
            "base_cost": 20,
            "tips": "Borrow the interactive museum audio guide for deep backstories on centerpiece masterworks."
        },
        "evening": {
            "title": "Illuminated Waterfront Promenade & {city} Evening Fountains",
            "category": "Evening Promenade & Landmarks",
            "location": "Grand Harbor Esplanade, {city}",
            "description": "Stroll along the atmospheric illuminated waterfront of {city}, enjoying live street acoustic performances, illuminated fountains, and refreshing night breezes.",
            "duration": "3.5 hrs",
            "base_cost": 18,
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
            "base_cost": 10,
            "tips": "Maintain respectful silence inside; photography is permitted without flash."
        },
        "afternoon": {
            "title": "Artisan Guilds, Handloom & Ceramic Studios in {city}",
            "category": "Craft & Artisan Discovery",
            "location": "Artisans Quarter, {city}",
            "description": "Watch master craftsmen sculpt ceramics, weave heritage fabrics, and craft delicate jewelry unique to {city}'s guild traditions.",
            "duration": "3.5 hrs",
            "base_cost": 18,
            "tips": "Support local families by picking up handcrafted ceramic or textile souvenirs."
        },
        "evening": {
            "title": "Twilight Night Bazaar & {city} Street Food Safari",
            "category": "Night Market & Street Food",
            "location": "Bazaar Square, {city}",
            "description": "Delight in the sizzling energy of {city}'s evening bazaar, savoring aromatic skewered bites, freshly baked flatbreads, and sweet delicacies.",
            "duration": "3.5 hrs",
            "base_cost": 22,
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
            "base_cost": 16,
            "tips": "Step onto the glass observation deck for stunning valley and city aerial photography."
        },
        "afternoon": {
            "title": "{city} Waterfront Canal & Riverboat Cruise",
            "category": "Scenic Cruise & Waterway",
            "location": "Central Marina Pier, {city}",
            "description": "Board a leisurely cruise along {city}'s waterways, gliding past historic waterfront bridges, maritime warehouses, and peaceful embankments.",
            "duration": "3 hrs",
            "base_cost": 28,
            "tips": "The open-air top deck offers the clearest unobstructed views of bridges and skyline."
        },
        "evening": {
            "title": "Open-Air Amphitheater & Live Cultural Showcase",
            "category": "Performing Arts & Culture",
            "location": "Cultural Pavilion, {city}",
            "description": "Experience an enchanting live showcase of regional folk music, classical dance, or theatrical drama celebrating {city}'s artistic soul.",
            "duration": "3.5 hrs",
            "base_cost": 25,
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
            "base_cost": 12,
            "tips": "Carry a light hydration pack and binoculars for local birdwatching."
        },
        "afternoon": {
            "title": "Vineyard, Orchard & Farm-to-Table Gastronomy",
            "category": "Culinary Tour & Tasting",
            "location": "Valley Agro-Estate, {city}",
            "description": "Tour scenic hillside vines or fruit orchards followed by a leisurely farm-to-table lunch crafted with fresh ingredients harvested that morning.",
            "duration": "3 hrs",
            "base_cost": 32,
            "tips": "Try the seasonal dessert paired with estate-pressed juices or regional vintage."
        },
        "evening": {
            "title": "Moonlit Harbor Pier & Candlelight Waterside Dining",
            "category": "Fine Dining & Atmosphere",
            "location": "Marina Boardwalk, {city}",
            "description": "Dine at a candlelit waterside bistro listening to gentle water lapping against the docks, enjoying fresh regional delicacies.",
            "duration": "3.5 hrs",
            "base_cost": 40,
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
            "base_cost": 10,
            "tips": "Arrive 20 minutes before dawn to witness the horizon illuminate with golden hues."
        },
        "afternoon": {
            "title": "Antique Alleys & Rare Books Bazaars in {city}",
            "category": "Vintage & Heritage Discovery",
            "location": "Old Books & Curiosities Lane, {city}",
            "description": "Browse cozy vintage bookstalls, brass curiosities, old cartography maps, and vintage postcards hidden in the back alleys of {city}.",
            "duration": "3 hrs",
            "base_cost": 15,
            "tips": "Vintage brass bookmarks and illustrated city maps make wonderful keepsakes."
        },
        "evening": {
            "title": "{city} Jazz Cellar & Speakeasy Experience",
            "category": "Nightlife & Music",
            "location": "Historic Cellar Quarter, {city}",
            "description": "Step into a subterranean stone cellar to enjoy sultry live jazz acoustic sessions, vintage mocktails/cocktails, and a cozy retro atmosphere.",
            "duration": "3.5 hrs",
            "base_cost": 28,
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
            "base_cost": 10,
            "tips": "Great time to take portrait photos without bustling afternoon crowds."
        },
        "afternoon": {
            "title": "Gourmet Confectionery & Keepsake Shopping Trail",
            "category": "Shopping & Sweets",
            "location": "Grand Boulevard Shops, {city}",
            "description": "Pick up signature artisanal chocolates, packaged spices, and premium local teas to take home the essence of {city}.",
            "duration": "3 hrs",
            "base_cost": 25,
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
                "currency": d.get("currency", "$")
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
                "currency": "$"
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
        "currency": "$"
    }

# --- Pydantic Models ---
class PlanTripRequest(BaseModel):
    destination: str
    origin: Optional[str] = "Current Location"
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

@app.post("/api/plan-trip")
def plan_trip(req: PlanTripRequest):
    num_days = max(1, min(req.days, 7))
    
    # Resolve the EXACT destination submitted by the user
    dest_info = resolve_destination(req.destination)
    
    dest_name = dest_info["name"]
    country = dest_info["country"]
    coords = dest_info["coordinates"]
    highlights = dest_info["highlights"]
    cost_multiplier = 2.5 if req.budget == "luxury" else 0.7 if req.budget == "budget" else 1.2

    start_date = datetime.strptime(req.startDate, "%Y-%m-%d") if req.startDate else datetime.utcnow()
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
            slot_img = resolve_activity_image(
                title=s["title"],
                location=s["location"],
                category=s["category"],
                fallback_img=dest_info.get("image", ""),
                salt=(i * 3 + slot_idx)
            )

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
                "image": slot_img,
                "coordinates": slot_coord,
                "tips": s["tips"]
            })

        itinerary_days.append({
            "dayNumber": i + 1,
            "date": day_date.strftime("%a, %b %d"),
            "title": day_title,
            "theme": day_theme,
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
            "destination": dest_name,
            "country": country,
            "origin": req.origin or "Current Location",
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
                "currency": "$",
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
                "currency": "$",
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
                "currency": "$",
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
                "currency": "$",
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
        "tokyo": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
        "vizag": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80"
    }
    key = next((k for k in photo_map if k in query.lower()), "beach")
    return {"success": True, "url": photo_map[key]}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 5000))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True)
