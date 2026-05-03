import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function Pharmacy() {
  const [active, setActive] = useState("dashboard");

  const [medicine, setMedicine] = useState("");
  const [quantity, setQuantity] = useState("");

  // ✅ LOAD FROM LOCALSTORAGE
  const [stockList, setStockList] = useState(() => {
    const saved = localStorage.getItem("stockList");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedView, setSelectedView] = useState(null);

  const [position, setPosition] = useState([13.0827, 80.2707]);

  const [pharmacyName, setPharmacyName] = useState("");
  const [pharmacyLocation, setPharmacyLocation] = useState("");

  /* 🔗 FAKE BLOCKCHAIN HASH */
  const generateTxHash = () => {
    return "0x" + Math.random().toString(16).substr(2, 64);
  };

  /* ✅ SAVE TO LOCALSTORAGE WHEN DATA CHANGES */
  useEffect(() => {
    localStorage.setItem("stockList", JSON.stringify(stockList));
  }, [stockList]);

  /* LOAD REGISTER DATA */
  useEffect(() => {
    const name = localStorage.getItem("pharmacyName");
    const location = localStorage.getItem("pharmacyLocation");

    if (name) setPharmacyName(name);

    if (location) {
      setPharmacyLocation(location);
      loadLocationOnMap(location);
    }
  }, []);

  /* MAP LOAD */
  const loadLocationOnMap = async (place) => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${place}`
    );
    const data = await res.json();

    if (data.length > 0) {
      setPosition([
        parseFloat(data[0].lat),
        parseFloat(data[0].lon)
      ]);
    }
  };

  /* ADD MEDICINE */
  const addStock = () => {
    if (!medicine || !quantity) return;

    const newItem = {
      medicine,
      quantity: Number(quantity),
      status: Number(quantity) === 0 ? "Out" : "Available",
      txHash: generateTxHash(),
      time: new Date().toLocaleString()
    };

    setStockList([newItem, ...stockList]);

    setMedicine("");
    setQuantity("");
  };

  /* UPDATE MEDICINE */
  const updateStock = (statusType) => {
    if (!medicine || !quantity) return;

    const updated = stockList.map((item) => {
      if (item.medicine.toLowerCase() === medicine.toLowerCase()) {
        return {
          ...item,
          quantity: Number(quantity),
          status: statusType,
          txHash: generateTxHash(),
          time: new Date().toLocaleString()
        };
      }
      return item;
    });

    setStockList(updated);

    setMedicine("");
    setQuantity("");
  };

  /* FILTER */
  const totalStock = stockList;
  const availableStock = stockList.filter(s => s.status === "Available");
  const outStock = stockList.filter(s => s.status === "Out");

  const getDisplayList = () => {
    if (selectedView === "total") return totalStock;
    if (selectedView === "available") return availableStock;
    if (selectedView === "out") return outStock;
    return [];
  };

  return (
    <div style={{ display: "flex", fontFamily: "Arial" }}>

      {/* SIDEBAR */}
      <div style={sidebar}>
        <h3>💊 {pharmacyName || "Pharmacy"}</h3>

        {["dashboard", "update", "location", "logout"].map((item) => (
          <div
            key={item}
            onClick={() => {
              setActive(item);
              setSelectedView(null);
            }}
            style={{
              ...menuItem,
              background: active === item ? "#28a745" : "",
              color: active === item ? "white" : "black"
            }}
          >
            {item.toUpperCase()}
          </div>
        ))}
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: 20 }}>

        {/* DASHBOARD */}
        {active === "dashboard" && (
          <>
            <h2>📊 Dashboard</h2>

            <div style={{ display: "flex", gap: 15 }}>
              <Card title="Total Stock" value={totalStock.length} color="#007bff" onClick={() => setSelectedView("total")} />
              <Card title="Available Stock" value={availableStock.length} color="#28a745" onClick={() => setSelectedView("available")} />
              <Card title="Out of Stock" value={outStock.length} color="#dc3545" onClick={() => setSelectedView("out")} />
            </div>

            {selectedView && (
              <table style={{ marginTop: 20, width: "100%" }}>
                <thead>
                  <tr>
                    <th style={th}>Medicine</th>
                    <th style={th}>Quantity</th>
                    <th style={th}>Status</th>
                    <th style={th}>Transaction ID</th>
                    <th style={th}>Time</th>
                  </tr>
                </thead>

                <tbody>
                  {getDisplayList().map((item, i) => (
                    <tr key={i}>
                      <td style={td}>{item.medicine}</td>
                      <td style={td}>{item.quantity}</td>
                      <td style={td}>{item.status}</td>
                      <td style={td}><small>{item.txHash}</small></td>
                      <td style={td}>{item.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

        {/* UPDATE */}
        {active === "update" && (
          <>
            <h2>💊 Manage Medicines</h2>

            <div style={{ display: "flex", gap: 20 }}>

              <div style={box}>
                <h3>Add Medicine</h3>
                <input placeholder="Medicine Name" value={medicine} onChange={(e) => setMedicine(e.target.value)} style={input} />
                <input placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} style={input} />
                <button style={btn} onClick={addStock}>Add</button>
              </div>

              <div style={box}>
                <h3>Update Medicine</h3>
                <input placeholder="Medicine Name" value={medicine} onChange={(e) => setMedicine(e.target.value)} style={input} />
                <input placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} style={input} />

                <div style={{ display: "flex", gap: 10 }}>
                  <button style={{ ...btn, background: "green" }} onClick={() => updateStock("Available")}>
                    Available
                  </button>

                  <button style={{ ...btn, background: "red" }} onClick={() => updateStock("Out")}>
                    Out of Stock
                  </button>
                </div>
              </div>

            </div>
          </>
        )}

        {/* LOCATION */}
        {active === "location" && (
          <>
            <h2>📍 Pharmacy Location</h2>

            <p><b>Name:</b> {pharmacyName}</p>
            <p><b>Location:</b> {pharmacyLocation}</p>

            <MapContainer center={position} zoom={13} style={{ height: 300 }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={position}>
                <Popup>{pharmacyLocation}</Popup>
              </Marker>
            </MapContainer>
          </>
        )}

        {active === "logout" && <h2>Logged out</h2>}

      </div>
    </div>
  );
}

/* UI */
const Card = ({ title, value, color, onClick }) => (
  <div onClick={onClick} style={{
    background: color,
    color: "white",
    padding: 20,
    borderRadius: 10,
    cursor: "pointer",
    flex: 1
  }}>
    <h4>{title}</h4>
    <h1>{value}</h1>
  </div>
);

const sidebar = { width: 220, background: "#f5f5f5", padding: 20 };
const menuItem = { padding: 10, margin: "5px 0", cursor: "pointer", borderRadius: 5 };
const input = { width: "100%", padding: 10, margin: "10px 0" };
const btn = { width: "100%", padding: 10, border: "none", background: "#28a745", color: "white" };
const box = { flex: 1, background: "#f9f9f9", padding: 20, borderRadius: 10 };
const th = { textAlign: "left", padding: 10 };
const td = { padding: 10 };

export default Pharmacy;