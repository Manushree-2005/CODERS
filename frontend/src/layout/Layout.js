const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

/* =========================
   📦 DATABASE
========================= */
const pharmacies = [
  {
    name: "City Medical",
    lat: 12.9716,
    lng: 77.5946,
    stock: { paracetamol: 20, dolo: 10, insulin: 5 },
    updatedAt: "2026-04-29",
    txHash: "0xabc123"
  },
  {
    name: "Health Care Pharmacy",
    lat: 12.9655,
    lng: 77.6011,
    stock: { paracetamol: 5, insulin: 12 },
    updatedAt: "2026-04-28",
    txHash: "0xdef456"
  }
];

/* =========================
   🗳️ VOTES STORAGE
========================= */
const votes = {};

/* =========================
   📍 DISTANCE FUNCTION
========================= */
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* =========================
   🔍 SEARCH MEDICINE API
========================= */
app.get("/api/search", (req, res) => {
  const { medicine, lat, lng } = req.query;

  const userLat = parseFloat(lat);
  const userLng = parseFloat(lng);

  const result = pharmacies
    .filter(p => p.stock?.[medicine])
    .map(p => {
      const dist = getDistance(userLat, userLng, p.lat, p.lng);

      return {
        name: p.name,
        lat: p.lat,
        lng: p.lng,
        quantity: p.stock[medicine],
        distance: Number(dist.toFixed(2)),
        updatedAt: p.updatedAt,
        blockchainHash: p.txHash,
        votes: votes[p.name] || { up: 0, down: 0 }
      };
    })
    .filter(p => p.distance <= 10)
    .sort((a, b) => a.distance - b.distance);

  res.json({ pharmacies: result });
});

/* =========================
   🗳️ VOTE API
========================= */
app.post("/api/vote", (req, res) => {
  const { pharmacyName, vote } = req.body;

  if (!votes[pharmacyName]) {
    votes[pharmacyName] = { up: 0, down: 0 };
  }

  if (vote === "up") votes[pharmacyName].up++;
  if (vote === "down") votes[pharmacyName].down++;

  res.json({
    success: true,
    pharmacyName,
    votes: votes[pharmacyName]
  });
});

/* =========================
   🚀 START SERVER
========================= */
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});