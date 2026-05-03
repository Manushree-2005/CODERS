import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Home.css";

/* DATA */
const BENEFITS = [
  { icon: "⏱", title: "Real-time Availability", desc: "Check medicine availability nearby.", theme: "green" },
  { icon: "🛡", title: "Reliable & Secure", desc: "Data is safe and tamper-proof.", theme: "blue" },
  { icon: "📶", title: "Low Connectivity", desc: "Works using SMS also.", theme: "purple" },
  { icon: "👥", title: "Easy Access", desc: "Simple for all users.", theme: "orange" },
];

const STEPS = [
  "Search medicine",
  "Use SMS / voice",
  "Get availability",
  "Get medicine"
];

function Home() {
  const navigate = useNavigate();

  return (
    <main className="home">

      {/* HERO */}
      <header className="hero">

  <div className="hero-content">

    {/* LEFT → IMAGE */}
    <div className="hero-image">
      <img src="/medical.png" alt="Medical" />
    </div>

    {/* RIGHT → TEXT */}
    <div className="hero-text">
      <h1 className="main-title fade-in">
       Rural Medicine Availability System
      </h1>

      <p className="tagline fade-in">
        Find medicines easily. Save time. Stay healthy.
      </p>
    </div>

  </div>

</header>

      {/* BENEFITS */}
      <section className="section">
        <h2>Benefits</h2>

        <div className="scroll-container">
          {BENEFITS.map((item, index) => (
            <motion.div
              className={`card benefit-card ${item.theme}`}
              key={index}
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* INSTRUCTIONS */}
      <section className="section">
        <h2>Instructions</h2>

        <div className="scroll-container">
          {STEPS.map((step, index) => (
            <motion.div
              className="card step-card"
              key={index}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="step-number">{index + 1}</div>
              <p>{step}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ACTION */}
      <section className="section">
        <h2>Choose how you want to continue</h2>

        <div className="actions">

          <motion.button
            className="action-card green-card"
            onClick={() => navigate("/register")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <h3>Proceed as Pharmacist</h3>
            <p>Register and manage stock</p>
            <span>Proceed →</span>
          </motion.button>

          <motion.button
            className="action-card blue-card"
            onClick={() => navigate("/search")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <h3>Proceed as User</h3>
            <p>Search medicine availability</p>
            <span>Proceed →</span>
          </motion.button>

        </div>
      </section>

      <footer className="footer">
        💚 Together, let’s build a healthier community
      </footer>

    </main>
  );
}

export default Home;