const express = require('express');
const router = express.Router();
const coordinator = require('../agents/coordinator');

router.post('/', async (req, res) => {
  res.status(200).send('OK');

  const from = req.body.From;
  const numMedia = parseInt(req.body.NumMedia || '0');
  const mediaContentType = req.body.MediaContentType0 || '';
  const isVoiceNote = numMedia > 0 && mediaContentType.startsWith('audio/');

  try {
    let messageText;

    if (isVoiceNote) {
      // User sent a voice note — transcribe it first
      const mediaUrl = req.body.MediaUrl0;
      console.log(`🎙️ Voice note from ${from}, transcribing...`);

      const { transcribeVoiceNote } = require('../services/elevenlabs');
      messageText = await transcribeVoiceNote(mediaUrl);
      console.log(`📝 Transcribed: "${messageText}"`);
    } else {
      // Plain text message
      messageText = req.body.Body;
    }

    const response = await coordinator.handle(from, messageText);
    console.log('--- RESPONSE TO', from, '---');
    console.log(response);
    console.log('------------------------');

    // Only send via Twilio if credentials exist
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      if (isVoiceNote && process.env.ELEVENLABS_API_KEY) {
        // User sent voice → reply with voice note only
        console.log('🔊 Replying with voice note...');
        const { sendRootsVoiceNote } = require('../services/elevenlabs');
        await sendRootsVoiceNote(from, response);
      } else {
        // User sent text → reply with text only
        const { sendWhatsAppMessage } = require('../services/twilio');
        await sendWhatsAppMessage(from, response);
      }
    }
  } catch (err) {
    console.error('Handler error:', err);
  }
});

module.exports = router;
