const express = require("express");
const router = express.Router();
const Medicine = require("./models/Medicine"); // adjust path if needed
const sendSMS = require("./utils/sms"); // ✅ import SMS

// ✅ UPDATE STOCK + SEND SMS
router.post("/update-stock", async (req, res) => {
  try {
    const { id, quantity } = req.body;

    const med = await Medicine.findByIdAndUpdate(
      id,
      {
        quantity,
        lastUpdated: new Date()
      },
      { new: true }
    );

    // 📱 SEND SMS ALERT
    const message = `${med.name} is now available at ${med.pharmacy}`;

    await sendSMS("+919110626667", message); // 👉 replace with your number

    res.json({
      success: true,
      message: "Stock updated + SMS sent",
      data: med
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;