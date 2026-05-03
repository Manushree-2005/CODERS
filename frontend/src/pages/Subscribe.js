import { useState } from "react";
import { subscribeSMS } from "../services/api";

function Subscribe() {
  const [phone, setPhone] = useState("");
  const [med, setMed] = useState("");

  const handleSubscribe = async () => {
    try {
      await subscribeSMS({ phone, medicine: med });
      alert("✅ Subscribed successfully!");
      setPhone("");
      setMed("");
    } catch (err) {
      console.error(err);
      alert("❌ Subscription failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🔔 Subscribe Alerts</h2>

      <input
        placeholder="Phone (+91XXXXXXXXXX)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />

      <input
        placeholder="Medicine (e.g., Insulin)"
        value={med}
        onChange={(e) => setMed(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />

      <button onClick={handleSubscribe}>
        Subscribe
      </button>
    </div>
  );
}

export default Subscribe;