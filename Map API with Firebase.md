# 🚀 SOP — Ultra-Low-Cost Live Order Tracking for MERN Quick Commerce App

**Stack:** Google Maps JS SDK (display only) + Firebase Realtime DB (live tracking) + FCM (push) + Directions API (once) + Throttled GPS
**Goal:** Production-grade, Swiggy/Zepto-style tracking with minimal API cost

---

## 📌 0. Prerequisites

### Accounts & Tools

* Google Cloud account (with billing enabled)
* Firebase project
* Node.js ≥ 18
* MongoDB (Atlas or self-hosted)
* MERN app (React + Node/Express)
* Domain (recommended for production)

---

## 📌 1. Enable Required Google Services

Go to 👉 https://console.cloud.google.com

Enable ONLY these APIs:

✔ Maps JavaScript API
✔ Directions API
✔ Geocoding API (optional)
✔ Places API (optional)

### 🔐 Create API Key

1. Credentials → Create API Key
2. Restrict key:

**Application restrictions**

* HTTP referrers (your domains)

**API restrictions**

* Maps JavaScript API
* Directions API

⚠️ Never expose unrestricted key in production.

---

## 📌 2. Create Firebase Project

Go to 👉 https://console.firebase.google.com

### Create Project → Enable:

✔ Realtime Database
✔ Cloud Messaging (FCM)

---

## 📌 3. Setup Firebase Realtime Database

### Create Database → Start in Production Mode

Choose region close to users.

---

### 🔹 Database Structure (Recommended)

```
live_tracking/
  {orderId}/
    riderId: string
    lat: number
    lng: number
    heading: number
    speed: number
    timestamp: number
```

---

### 🔒 Database Rules (Secure Version)

```
{
  "rules": {
    "live_tracking": {
      "$orderId": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    }
  }
}
```

---

## 📌 4. Install Firebase in MERN Frontend

### In BOTH Customer & Rider Apps

```bash
npm install firebase
```

---

## 📌 5. Firebase Configuration File

Create:

```
src/firebase/config.js
```

```js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  databaseURL: "YOUR_DB_URL",
  projectId: "YOUR_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
export const messaging = getMessaging(app);
```

---

# 🧭 RIDER SIDE IMPLEMENTATION

---

## 📌 6. Start GPS Tracking (Throttled)

Create:

```
src/services/locationTracker.js
```

```js
import { ref, update } from "firebase/database";
import { db } from "../firebase/config";

let watchId = null;
let lastSent = null;

function getDistance(a, b) {
  const R = 6371e3;
  const φ1 = a.lat * Math.PI/180;
  const φ2 = b.lat * Math.PI/180;
  const Δφ = (b.lat-a.lat) * Math.PI/180;
  const Δλ = (b.lng-a.lng) * Math.PI/180;

  const x = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ/2) * Math.sin(Δλ/2);

  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1-x));
  return R * c;
}

export function startTracking(orderId, riderId) {

  watchId = navigator.geolocation.watchPosition((pos) => {

    const current = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
      timestamp: Date.now()
    };

    if (!lastSent) lastSent = current;

    const distance = getDistance(lastSent, current);
    const timeDiff = current.timestamp - lastSent.timestamp;

    if (distance > 30 || timeDiff > 7000) {

      update(ref(db, `live_tracking/${orderId}`), {
        riderId,
        lat: current.lat,
        lng: current.lng,
        speed: pos.coords.speed || 0,
        heading: pos.coords.heading || 0,
        timestamp: current.timestamp
      });

      lastSent = current;
    }

  }, console.error, {
    enableHighAccuracy: true,
    maximumAge: 5000,
    timeout: 10000
  });
}

export function stopTracking(orderId) {
  navigator.geolocation.clearWatch(watchId);
}
```

---

# 🧭 CUSTOMER SIDE IMPLEMENTATION

---

## 📌 7. Load Google Map (Display Only)

Add script in index.html:

```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_KEY"></script>
```

---

## 📌 8. Map Component

```
src/components/LiveMap.jsx
```

```jsx
import { useEffect, useRef } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase/config";

export default function LiveMap({ orderId }) {

  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {

    const map = new google.maps.Map(mapRef.current, {
      zoom: 15,
      center: { lat: 0, lng: 0 },
      disableDefaultUI: true
    });

    const marker = new google.maps.Marker({
      position: { lat: 0, lng: 0 },
      map
    });

    markerRef.current = marker;

    const trackingRef = ref(db, `live_tracking/${orderId}`);

    const unsubscribe = onValue(trackingRef, (snapshot) => {

      const data = snapshot.val();
      if (!data) return;

      const pos = new google.maps.LatLng(data.lat, data.lng);

      marker.setPosition(pos);
      map.panTo(pos);

    });

    return () => unsubscribe();

  }, [orderId]);

  return <div ref={mapRef} style={{ height: "100vh" }} />;
}
```

---

# 🧭 BACKEND IMPLEMENTATION (Node + Express)

---

## 📌 9. Directions API — Call ONCE Per Order

Install axios:

```bash
npm install axios
```

---

### Route Calculation Endpoint

```js
import axios from "axios";

export async function getRoute(req, res) {

  const { origin, destination } = req.body;

  const response = await axios.get(
    "https://maps.googleapis.com/maps/api/directions/json",
    {
      params: {
        origin,
        destination,
        key: process.env.GMAPS_KEY
      }
    }
  );

  res.json(response.data);
}
```

---

## 📌 10. Save Route in MongoDB

Store polyline + ETA to avoid recalculation.

Example schema:

```
orders:
  _id
  riderId
  routePolyline
  distance
  eta
  status
```

---

# 🔔 PUSH NOTIFICATIONS (FCM)

---

## 📌 11. Backend Setup

Install Firebase Admin:

```bash
npm install firebase-admin
```

---

### Initialize Admin SDK

```js
import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
```

---

### Send Notification

```js
export async function sendDeliveryUpdate(token) {

  await admin.messaging().send({
    token,
    notification: {
      title: "Order Update",
      body: "Rider is on the way 🚀"
    }
  });

}
```

---

# 🧹 CLEANUP (VERY IMPORTANT)

---

## 📌 12. Stop Tracking After Delivery

### Rider App

```js
stopTracking(orderId);
```

---

### Remove Data from Firebase

```js
import { remove, ref } from "firebase/database";

remove(ref(db, `live_tracking/${orderId}`));
```

---

# ⚡ PERFORMANCE BEST PRACTICES

---

## ✔ DO

* Send location every 5–10 sec
* Use distance threshold
* Load map once
* Cache route
* Stop tracking when done
* Use marker animation for smooth UI

---

## ❌ DON'T

* Recalculate route continuously
* Poll backend repeatedly
* Reload map component
* Send GPS every second

---

# 💰 EXPECTED COST

### Optimized System

✔ Thousands of orders/day possible
✔ Very low Google Maps billing
✔ Firebase handles real-time updates

---

# 🏁 FINAL ARCHITECTURE

```
Rider GPS → Firebase Realtime DB → Customer Map

Backend:
  - Order logic
  - Directions API (once)
  - FCM notifications
  - MongoDB storage
```

---

# 🎯 RESULT

✅ Ultra-low cost
✅ Real-time tracking
✅ Production scalable
✅ Swiggy/Zepto-style experience
✅ MERN compatible

---

**SOP Version:** 1.0
**Use Case:** Quick Commerce / Food Delivery / Logistics Apps

---
