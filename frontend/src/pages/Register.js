import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);

  const registerPharmacy = async () => {
    if (!name || !city) {
      alert("⚠️ Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/pharmacy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, city }),
      });

      // ✅ no unused variable warning
      const { message } = await res.json();

      // ✅ store data for dashboard
      localStorage.setItem("pharmacyName", name);
      localStorage.setItem("pharmacyLocation", city);

      // ✅ success message
      alert(message || "✅ Registered successfully!");

      // ✅ navigate to dashboard
      navigate("/pharmacy");

    } catch (error) {
      alert("❌ Registration failed");
    }

    setLoading(false);
  };

  return (
    <div style={container}>
      <div style={card}>
        <h2 style={{ textAlign: "center" }}>💊 Pharmacy Registration</h2>

        <input
          placeholder="Pharmacy Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={input}
        />

        <input
          placeholder="City / Location"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={input}
        />

        <button style={button} onClick={registerPharmacy}>
          {loading ? "Registering..." : "Register"}
        </button>
      </div>
    </div>
  );
}

/* 🎨 STYLES */
const container = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #0b5ed7, #28a745)"
};

const card = {
  background: "#fff",
  padding: 30,
  borderRadius: 12,
  width: 320,
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
};

const input = {
  width: "100%",
  padding: 12,
  margin: "10px 0",
  borderRadius: 8,
  border: "1px solid #ccc",
  outline: "none"
};

const button = {
  width: "100%",
  padding: 12,
  marginTop: 10,
  border: "none",
  borderRadius: 8,
  background: "#0b5ed7",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer"
};

export default Register;