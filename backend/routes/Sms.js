const express = require("express");
const router = express.Router();
const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

router.post("/", async (req, res) => {
  try {
    let { phone, message } = req.body;

    // ensure + prefix
    if (!phone.startsWith("+")) {
      phone = "+" + phone;
    }

    const medicine = message.split(" ")[0];

    const reply = `MedChain Alert:
Medicine Requested: ${medicine}
Check nearest pharmacy in dashboard`;

    const result = await client.messages.create({
      body: reply,
      from: process.env.TWILIO_PHONE,
      to: phone
    });

    console.log("SMS Sent:", result.sid);

    res.json({
      success: true,
      message: "SMS sent successfully",
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

module.exports = router;