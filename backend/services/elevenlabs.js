const { ElevenLabsClient } = require('@elevenlabs/elevenlabs-js');
const twilio = require('twilio');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Initialize clients
const elevenlabs = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function uploadToStorage(audioStream) {
    const fileName = `voice_${Date.now()}_${Math.floor(Math.random() * 1000)}.ogg`;
    const publicDir = path.join(__dirname, '..', 'public', 'voice_notes');

    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }

    const filePath = path.join(publicDir, fileName);

    return new Promise((resolve, reject) => {
        const fileStream = fs.createWriteStream(filePath);
        audioStream.pipe(fileStream);
        fileStream.on('finish', () => {
            const publicUrl = `${process.env.PUBLIC_URL}/public/voice_notes/${fileName}`;
            resolve(publicUrl);
        });
        fileStream.on('error', reject);
    });
}

// Download a Twilio media URL (requires Basic Auth) and transcribe via ElevenLabs STT
async function transcribeVoiceNote(mediaUrl) {
    // 1. Download the audio from Twilio (requires auth because media is private)
    const response = await axios.get(mediaUrl, {
        responseType: 'arraybuffer',
        auth: {
            username: process.env.TWILIO_ACCOUNT_SID,
            password: process.env.TWILIO_AUTH_TOKEN
        }
    });

    // 2. Save temp file
    const tmpDir = path.join(__dirname, '..', 'public', 'voice_notes');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
    const tmpFile = path.join(tmpDir, `incoming_${Date.now()}.ogg`);
    fs.writeFileSync(tmpFile, response.data);

    // 3. Transcribe via ElevenLabs STT
    try {
        const transcript = await elevenlabs.speechToText.convert({
            file: fs.createReadStream(tmpFile),
            model_id: 'scribe_v1'
        });
        // Return both the text and the detected language code (e.g. "ar", "ur", "fr")
        return { text: transcript.text, language: transcript.language_code || 'en' };
    } finally {
        // Cleanup temp file
        fs.unlink(tmpFile, () => { });
    }
}

// Emotion profiles for ElevenLabs v3 audio tags
const EMOTION_PROFILES = {
    urgent: '[serious][calm]',
    empathetic: '[warmly][softly]',
    cheerful: '[cheerfully][excited]',
    neutral: '[calm]',
    onboarding: '[warmly][gently]',
};

function detectMessageType(text) {
    const lower = text.toLowerCase();
    if (/expires|deadline|urgent|days left|critical/.test(lower)) return 'urgent';
    if (/hard|worry|alone|difficult|stress|miss/.test(lower)) return 'empathetic';
    if (/congratulations|completed|approved|great job|well done/.test(lower)) return 'cheerful';
    if (/welcome to roots|first question|let's start/.test(lower)) return 'onboarding';
    return 'neutral';
}

function addEmotionTags(text, messageType) {
    const tags = EMOTION_PROFILES[messageType] || EMOTION_PROFILES.neutral;
    return `${tags} ${text}`;
}

async function sendRootsVoiceNote(userPhoneNumber, geminiResponseText) {
    if (!process.env.ELEVENLABS_API_KEY) {
        console.warn('Skipping ElevenLabs voice note: no API key.');
        return;
    }

    // 1. Detect tone and prepend emotion tags for v3
    const messageType = detectMessageType(geminiResponseText);
    const taggedText = addEmotionTags(geminiResponseText, messageType);
    console.log(`🎭 Emotion type: ${messageType}`);

    // 2. Convert text to OGG/Opus using eleven_v3 with Creative stability
    const audioStream = await elevenlabs.textToSpeech.convert(
        "JBFqnCBsd6RMkjVDRZzb",
        {
            text: taggedText,
            model_id: "eleven_v3",
            output_format: "ogg_44100_128",
            voice_settings: { stability: 0.3, similarity_boost: 0.8 }
        }
    );

    // 3. Save locally and get public URL
    const publicAudioUrl = await uploadToStorage(audioStream);

    const fromNumber = process.env.TWILIO_WHATSAPP_FROM.startsWith('whatsapp:')
        ? process.env.TWILIO_WHATSAPP_FROM
        : `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`;

    const toNumber = userPhoneNumber.startsWith('whatsapp:')
        ? userPhoneNumber
        : `whatsapp:${userPhoneNumber}`;

    // 4. Send as voice note via Twilio
    await client.messages.create({
        from: fromNumber,
        to: toNumber,
        mediaUrl: [publicAudioUrl]
    });
}

module.exports = { sendRootsVoiceNote, transcribeVoiceNote };

