const express = require('express');
const router = express.Router();
const { sendWhatsAppMessage } = require('../services/twilio');
const coordinator = require('../agents/coordinator');

router.post('/', async (req, res) => {
  const message = req.body.Body;
  const from = req.body.From; // e.g. "whatsapp:+14161234567"

  res.status(200).send('OK'); // Twilio needs this immediately

  try {
    const response = await coordinator.handle(from, message);
    await sendWhatsAppMessage(from, response);
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;