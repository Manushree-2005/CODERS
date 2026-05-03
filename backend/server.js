const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const Pharmacy = require("./models/Pharmacy");
const Stock = require("./models/Stock");

const twilio = require("twilio");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

/* ================= MONGO ================= */
mongoose.connect("mongodb://127.0.0.1:27017/medchain")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

/* ================= TWILIO ================= */
const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/* ================= SMS API ================= */
app.post("/sms", async (req, res) => {
  try {
    let { phone, message } = req.body;

    // format phone
    if (!phone.startsWith("+")) {
      phone = "+" + phone;
    }

    const medicine = message.split(" ")[0];

    const smsText = `💊 MedChain Alert
Medicine: ${medicine}
Check nearby pharmacy in app`;

    const result = await client.messages.create({
      body: smsText,
      from: process.env.TWILIO_PHONE,
      to: phone
    });

    console.log("SMS Sent:", result.sid);

    res.json({
      success: true,
      sid: result.sid
    });

  } catch (err) {
    console.error("TWILIO ERROR:", err.message);

    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

/* ================= PHARMACY ================= */
app.post("/pharmacy", async (req, res) => {
  const pharmacy = new Pharmacy(req.body);
  await pharmacy.save();
  res.json(pharmacy);
});

/* ================= STOCK ================= */
app.post("/pharmacy-stock", async (req, res) => {
  const stock = new Stock({
    ...req.body,
    txHash: Date.now().toString(),
    time: new Date().toISOString()
  });

  await stock.save();
  io.emit("stockUpdated", stock);

  res.json({ success: true });
});

/* ================= SEARCH ================= */
app.get("/search", async (req, res) => {
  const { medicine } = req.query;

  const stocks = await Stock.find({
    medicine: { $regex: medicine, $options: "i" }
  });

  res.json(stocks);
});

/* ================= SOCKET ================= */
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
});

/* ================= SERVER ================= */
server.listen(5000, () =>
  console.log("Server running on http://localhost:5000")
);