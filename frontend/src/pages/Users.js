import React, { useState, useEffect, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Circle,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";

/* ================= ICON FIX ================= */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

/* ================= ICONS ================= */
const userIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  iconSize: [30, 30],
});

const pharmacyIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [30, 30],
});

const nearestIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  iconSize: [35, 35],
});

/* ================= ROUTING ================= */
function Routing({ userLoc, selected }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !userLoc || !selected) return;

    let routingControl;

    try {
      routingControl = L.Routing.control({
        waypoints: [
          L.latLng(userLoc.lat, userLoc.lng),
          L.latLng(selected.lat, selected.lng),
        ],
        lineOptions: {
          styles: [{ color: "#0b5ed7", weight: 5 }],
        },
        addWaypoints: false,
        draggableWaypoints: false,
        routeWhileDragging: false,
        show: false,
        createMarker: () => null,
      }).addTo(map);

      map.fitBounds([
        [userLoc.lat, userLoc.lng],
        [selected.lat, selected.lng],
      ]);
    } catch (err) {
      console.log("Routing error:", err);
    }

    return () => {
      try {
        if (routingControl) {
          map.removeControl(routingControl);
        }
      } catch (e) {
        console.log("cleanup ignored");
      }
    };
  }, [userLoc, selected, map]);

  return null;
}

/* ================= MAIN COMPONENT ================= */
function Users() {
  const [medicine, setMedicine] = useState("");
  const [city, setCity] = useState("");
  const [results, setResults] = useState([]);
  const [userLoc, setUserLoc] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const [radius, setRadius] = useState(50);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  /* ================= LIVE LOCATION ================= */
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setUserLoc(loc);
        setMapCenter(loc);
      },
      () => {
        const fallback = { lat: 12.9716, lng: 77.5946 };
        setUserLoc(fallback);
        setMapCenter(fallback);
      }
    );
  }, []);

  /* ================= CITY TO COORD ================= */
  const getCityCoordinates = async (cityName) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${cityName}`
      );
      const data = await res.json();

      if (data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
      }
    } catch {}
    return null;
  };

  /* ================= DISTANCE ================= */
  const getDistance = (a, b) => {
    const R = 6371;
    const dLat = (b.lat - a.lat) * Math.PI / 180;
    const dLng = (b.lng - a.lng) * Math.PI / 180;

    const x =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(a.lat * Math.PI / 180) *
      Math.cos(b.lat * Math.PI / 180) *
      Math.sin(dLng / 2) ** 2;

    return R * (2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x)));
  };

  /* ================= DUMMY DATA ================= */
  const generateDummy = (center) => [
    {
      pharmacyName: "Apollo Pharmacy",
      lat: center.lat + 0.01,
      lng: center.lng + 0.01,
    },
    {
      pharmacyName: "MedPlus",
      lat: center.lat - 0.01,
      lng: center.lng - 0.01,
    },
    {
      pharmacyName: "Local Medical Store",
      lat: center.lat + 0.02,
      lng: center.lng - 0.02,
    },
  ];

  /* ================= SEARCH ================= */
  const handleSearch = useCallback(async () => {
    if (!medicine) return;

    setLoading(true);

    try {
      let center = userLoc;

      if (city) {
        const coords = await getCityCoordinates(city);
        if (coords) center = coords;
      }

      if (!center) return;

      setMapCenter(center);

      let data = [];

      try {
        const res = await fetch(
          `http://localhost:5000/search?medicine=${medicine}`
        );
        data = await res.json();
      } catch {}

      if (!data || data.length === 0) {
        data = generateDummy(center);
      }

      const processed = data
        .filter((i) => i.lat && i.lng)
        .map((i) => ({
          ...i,
          dist: getDistance(center, i),
        }))
        .sort((a, b) => a.dist - b.dist);

      let nearby = processed.filter((i) => i.dist <= radius);

      if (nearby.length === 0) {
        nearby = processed.slice(0, 5);
      }

      setResults(nearby);
      setSelected(nearby[0] || null);
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  }, [medicine, city, radius, userLoc]);

  /* ================= UI ================= */
  return (
    <div style={{ padding: 15, fontFamily: "Segoe UI" }}>
      <h2>💊 MedChain - Nearby Pharmacies</h2>

      <input
        placeholder="Medicine"
        value={medicine}
        onChange={(e) => setMedicine(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />

      <input
        placeholder="City (optional)"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />

      <button onClick={handleSearch}>
        {loading ? "Searching..." : "Search"}
      </button>

      <div style={{ marginTop: 10 }}>
        Radius: {radius} km
        <input
          type="range"
          min="5"
          max="200"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          style={{ width: "100%" }}
        />
      </div>

      {/* MAP */}
      {mapCenter && (
        <MapContainer
          center={[mapCenter.lat, mapCenter.lng]}
          zoom={13}
          style={{ height: 400, marginTop: 20 }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <Circle
            center={[mapCenter.lat, mapCenter.lng]}
            radius={radius * 1000}
          />

          {/* USER */}
          {userLoc && (
            <Marker position={[userLoc.lat, userLoc.lng]} icon={userIcon}>
              <Popup>You are here</Popup>
            </Marker>
          )}

          {/* PHARMACIES */}
          {results.map((r, i) => (
            <Marker
              key={i}
              position={[r.lat, r.lng]}
              icon={i === 0 ? nearestIcon : pharmacyIcon}
              eventHandlers={{ click: () => setSelected(r) }}
            >
              <Popup>
                <b>{r.pharmacyName}</b>
                <br />
                {r.dist.toFixed(2)} km
              </Popup>
            </Marker>
          ))}

          <Routing userLoc={userLoc} selected={selected} />
        </MapContainer>
      )}

      {/* LIST */}
      <h3>Nearby Pharmacies</h3>

      {results.map((r, i) => (
        <div
          key={i}
          onClick={() => setSelected(r)}
          style={{
            padding: 10,
            marginTop: 10,
            background: "#f1f1f1",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          <b>{r.pharmacyName}</b> {i === 0 && "⭐"}
          <br />
          {r.dist.toFixed(2)} km
        </div>
      ))}
    </div>
  );
}

export default Users;