const router = require("express").Router();
const Medicine = require("../models/Medicine");
const { addToBlockchain } = require("../utils/blockchain");
const { getDistance } = require("../utils/distance");
const sendSMS = require("../utils/sms"); // ✅ FIXED import

// ✅ ADD MEDICINE
router.post("/add-medicine", async (req, res) => {
  try {
    const med = new Medicine({
      ...req.body,
      lastUpdated: new Date()
    });

    await med.save();
    res.json({ success: true, message: "Medicine added", data: med });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ UPDATE STOCK + BLOCKCHAIN + SMS
router.post("/update-stock", async (req, res) => {
  try {
    const { id, quantity } = req.body;

    // 🔗 Blockchain transaction
    const hash = await addToBlockchain({ id, quantity });

    // 💾 Update DB
    const med = await Medicine.findByIdAndUpdate(
      id,
      {
        quantity,
        blockchainHash: hash,
        lastUpdated: new Date()
      },
      { new: true }
    );

    // 📱 SEND SMS ALERT
    const message = `${med.name} is now available at ${med.pharmacy} (Qty: ${quantity})`;

    await sendSMS("+91XXXXXXXXXX", message); // 👉 replace with your number

    res.json({
      success: true,
      message: "Stock updated + Blockchain + SMS",
      data: med
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ SEARCH
router.get("/search", async (req, res) => {
  try {
    const { medicine, lat, lng } = req.query;

    let meds = await Medicine.find({
      name: new RegExp(medicine, "i")
    });

    meds = meds.map(m => ({
      ...m._doc,
      distance: getDistance(lat, lng, m.lat, m.lng).toFixed(2)
    }));

    res.json(meds.sort((a, b) => a.distance - b.distance));

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🚨 EMERGENCY SEARCH
router.get("/emergency-search", async (req, res) => {
  try {
    const critical = ["insulin", "oxygen", "anti-venom"];

    const meds = await Medicine.find({
      name: { $in: critical }
    });

    res.json(meds);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;