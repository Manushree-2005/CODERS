import React, { useState } from "react";

const Sms = () => {
  const [phone, setPhone] = useState("+919110626667");
  const [medicine, setMedicine] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");

  /* PHONE FORMAT */
  const formatPhone = (num) => {
    let cleaned = num.trim();
    if (!cleaned.startsWith("+")) cleaned = "+" + cleaned;
    return cleaned;
  };

  /* VOICE INPUT */
  const startVoice = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;

      const qty = text.match(/(\d+\s*(tablet|tablets|strip|strips))/i);
      const loc = text.match(/at (.+)/i);

      const words = text.split(" ");
      const medIndex = words.findIndex(w => w.toLowerCase() === "need");

      setMedicine(words.slice(medIndex + 1, medIndex + 2).join(" ") || "");
      setQuantity(qty ? qty[0] : "");
      setLocation(loc ? loc[1] : "");
    };

    recognition.start();
  };

  /* SEND SMS */
  const sendSMS = async () => {
    try {
      setStatus("Sending...");

      const message = `
💊 Medicine Request

Tablet: ${medicine}
📦 Quantity: ${quantity}
📍 Location: ${location}
      `;

      const res = await fetch("http://localhost:5000/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: formatPhone(phone),
          message
        })
      });

      const data = await res.json();
      setStatus(data.success ? "✅ Sent Successfully" : "❌ Failed");

    } catch {
      setStatus("❌ Server Error");
    }
  };

  return (
    <div style={styles.page}>

      <h2 style={styles.title}>📩 Smart Medicine Request</h2>

      <div style={styles.card}>

        <input
          style={styles.input}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone Number"
        />

        <input
          style={styles.input}
          value={medicine}
          onChange={(e) => setMedicine(e.target.value)}
          placeholder="Tablet Name (e.g. Paracetamol)"
        />

        <input
          style={styles.input}
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Quantity (e.g. 2 strips)"
        />

        <input
          style={styles.input}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location (e.g. Kukarhalli)"
        />

        <button style={styles.voiceBtn} onClick={startVoice}>
          🎤 Speak Medicine Request
        </button>

        <button style={styles.sendBtn} onClick={sendSMS}>
          📩 Send SMS
        </button>

        <p style={styles.status}>{status}</p>

      </div>
    </div>
  );
};

/* ================= STYLES ================= */
const styles = {
  page: {
    padding: 20,
    maxWidth: 450,
    margin: "auto",
    fontFamily: "Segoe UI"
  },

  title: {
    textAlign: "center",
    color: "#0b5ed7",
    marginBottom: 20
  },

  card: {
    background: "#ffffff",
    padding: 20,
    borderRadius: 15,
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
  },

  input: {
    width: "100%",
    padding: 10,
    marginTop: 10,
    borderRadius: 8,
    border: "1px solid #ddd",
    outline: "none"
  },

  voiceBtn: {
    width: "100%",
    marginTop: 15,
    padding: 10,
    background: "#0b5ed7",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer"
  },

  sendBtn: {
    width: "100%",
    marginTop: 10,
    padding: 12,
    background: "#198754",
    color: "white",
    border: "none",
    borderRadius: 8,
    fontWeight: "bold",
    cursor: "pointer"
  },

  status: {
    textAlign: "center",
    marginTop: 10
  }
};

export default Sms;