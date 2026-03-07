const { ElevenLabsClient } = require('@elevenlabs/elevenlabs-js');
const twilio = require('twilio');
const fs = require('fs');
const path = require('path');

// Initialize clients
const elevenlabs = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function uploadToStorage(audioStream) {
    const fileName = `voice_${Date.now()}_${Math.floor(Math.random() * 1000)}.ogg`;
    const publicDir = path.join(__dirname, '..', 'public', 'voice_notes');

    // Ensure the directory exists
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }

    const filePath = path.join(publicDir, fileName);

    return new Promise((resolve, reject) => {
        const fileStream = fs.createWriteStream(filePath);
        audioStream.pipe(fileStream);
        fileStream.on('finish', () => {
            // Provide a public URL via our Express static route
            const publicUrl = `${process.env.PUBLIC_URL}/public/voice_notes/${fileName}`;
            resolve(publicUrl);
        });
        fileStream.on('error', reject);
    });
}

async function sendRootsVoiceNote(userPhoneNumber, geminiResponseText) {
    if (!process.env.ELEVENLABS_API_KEY) {
        console.warn('Skipping ElevenLabs voice note: no API key currently provided.');
        return;
    }

    // 1. Convert Gemini text to OGG/Opus for that native WhatsApp feel
    const audioStream = await elevenlabs.textToSpeech.convert(
        "JBFqnCBsd6RMkjVDRZzb", // Your supportive voice ID
        {
            text: geminiResponseText,
            model_id: "eleven_multilingual_v2", // Note: SDK usually uses snake_case here
            output_format: "ogg_44100_128", // <--- CRITICAL FOR NATIVE VOICE NOTES
            voice_settings: { stability: 0.4, similarity_boost: 0.8 }
        }
    );

    // 2. Upload to your temporary local server to get a public URL 
    const publicAudioUrl = await uploadToStorage(audioStream);

    // Formulate From Number correctly using the env var
    const fromNumber = process.env.TWILIO_WHATSAPP_FROM.startsWith('whatsapp:')
        ? process.env.TWILIO_WHATSAPP_FROM
        : `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`;

    const toNumber = userPhoneNumber.startsWith('whatsapp:')
        ? userPhoneNumber
        : `whatsapp:${userPhoneNumber}`;

    // 3. Send via Twilio
    await client.messages.create({
        from: fromNumber,
        to: toNumber,
        mediaUrl: [publicAudioUrl]
    });
}

module.exports = { sendRootsVoiceNote };
