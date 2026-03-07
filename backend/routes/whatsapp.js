const express = require('express');
const router = express.Router();
const coordinator = require('../agents/coordinator');

router.post('/', async (req, res) => {
  const message = req.body.Body;
  const from = req.body.From;

  res.status(200).send('OK');

  try {
    const response = await coordinator.handle(from, message);
    console.log('--- RESPONSE TO', from, '---');
    console.log(response);
    console.log('------------------------');

    // Only send via Twilio if credentials exist
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      const { sendWhatsAppMessage } = require('../services/twilio');
      await sendWhatsAppMessage(from, response);

      // Try sending a voice note version asynchronously!
      if (process.env.ELEVENLABS_API_KEY) {
        const { sendRootsVoiceNote } = require('../services/elevenlabs');
        sendRootsVoiceNote(from, response).catch(err => {
          console.error('Failed to send ElevenLabs voice note:', err);
        });
      }
    }
  } catch (err) {
    console.error('Handler error:', err);
  }
});

module.exports = router;