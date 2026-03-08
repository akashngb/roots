const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function sendWhatsAppMessage(to, body, mediaUrl = null) {
<<<<<<< HEAD
  const payload = {
=======
  const messageData = {
>>>>>>> origin/cloudinary-integration
    from: process.env.TWILIO_WHATSAPP_FROM,
    to,
    body
  };
<<<<<<< HEAD

  if (mediaUrl) {
    payload.mediaUrl = [mediaUrl];
  }

  const result = await client.messages.create(payload);
=======
  
  if (mediaUrl) {
    messageData.mediaUrl = [mediaUrl];
  }

  const result = await client.messages.create(messageData);
>>>>>>> origin/cloudinary-integration
  console.log('Twilio send result:', result.sid, result.status);
  return result;
}

module.exports = { sendWhatsAppMessage };
