import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useContext } from "react";

import Home from "./pages/Home";
import Pharmacy from "./pages/Pharmacy";
import Users from "./pages/Users";
import Sms from "./pages/Sms";
import Register from "./pages/Register";

import { LanguageProvider, LanguageContext } from "./context/LanguageContext";
import { translations } from "./utils/language";

function AppWrapper() {
  return (
    <LanguageProvider>
      <App />
    </LanguageProvider>
  );
}

function App() {
  const { lang, setLang } = useContext(LanguageContext);
  const t = translations[lang];

  return (
    <BrowserRouter>

      {/* NAVBAR */}
      <nav style={navStyle}>
        <h2 style={{ color: "white" }}>💊 MedChain</h2>

        <div style={{ display: "flex", alignItems: "center", gap: 15 }}>

          <Link to="/" style={linkStyle}>{t.home}</Link>
          <Link to="/pharmacy" style={linkStyle}>{t.pharmacy}</Link>
          <Link to="/search" style={linkStyle}>{t.users}</Link>
          <Link to="/sms" style={linkStyle}>{t.sms}</Link>

          {/* 🌍 LANGUAGE SWITCH */}
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            style={{
              padding: "5px",
              borderRadius: "5px",
              border: "none"
            }}
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="kn">ಕನ್ನಡ</option>
          </select>

        </div>
      </nav>

      {/* ROUTES */}
      <div style={{ padding: 20 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/pharmacy" element={<Pharmacy />} />
          <Route path="/search" element={<Users />} />
          <Route path="/sms" element={<Sms />} />
        </Routes>
      </div>

    </BrowserRouter>
  );
}

const navStyle = {
  padding: "15px 30px",
  background: "#04353D",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "500"
};

export default AppWrapper;