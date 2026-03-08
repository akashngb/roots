const axios = require('axios');

async function generateCriticalPath(profile) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

  const prompt = `You are an expert on Canadian immigration and newcomer onboarding.
Given this immigrant profile, generate a sequenced critical path of tasks for their first 90 days.
Return JSON only. No markdown. No backticks. No explanation.

Profile: ${JSON.stringify(profile)}

Return exactly this structure with 5-7 tasks:
{"tasks":[{"id":"sin","title":"Apply for your SIN","description":"Your Social Insurance Number is required before you can work legally in Canada.","daysFromArrival":1,"urgency":"critical","estimatedTime":"2-3 hours"}]}`;

  const response = await axios.post(url, {
    contents: [{ parts: [{ text: prompt }] }]
  });

  const text = response.data.candidates[0].content.parts[0].text;
  return JSON.parse(text.replace(/```json|```/g, '').trim());
}

async function transcribeAudio(audioBuffer, mimeType = 'audio/webm') {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

  const payload = {
    contents: [{
      parts: [
        { text: "Accurately transcribe this audio. Return ONLY the transcription text. No explanation." },
        {
          inline_data: {
            mime_type: mimeType,
            data: audioBuffer.toString('base64')
          }
        }
      ]
    }]
  };

  const response = await axios.post(url, payload);
  return response.data.candidates[0].content.parts[0].text.trim();
}

async function extractDocumentData(imageUrl) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

  console.log('Sending image to Gemini:', imageUrl);
  try {
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(imageResponse.data).toString('base64');
    
    // Determine mime type heuristically based on url, default to jpeg
    const mimeType = imageUrl.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';

    const prompt = `You are a strict data extraction assistant for Canadian immigrant documents.
Process this ID document image.

1. Identify the document type (e.g. passport, visa, PR card, SIN letter, driver's license).
2. Extract key fields: name, document number, expiry date, issuing country.
3. Determine the "nextStep" for the user based on the document type (e.g. "Keep this safe", "Next, apply for a health card").
4. List any intuitively missing companion documents in "missingDocs" (e.g. if arriving with a visa, they might need a work permit).
5. CRITICAL: NEVER output sensitive ID numbers in plain text. Always redact them as "[REDACTED XXXXX]".

Return ONLY structured JSON matching this shape, with no markdown, backticks or extra text:
{
  "docType": "Document Type Here",
  "fields": {
    "name": "Extracted Name",
    "documentNumber": "[REDACTED XXXXX]",
    "expiryDate": "YYYY-MM-DD",
    "issuingCountry": "Country Name"
  },
  "nextStep": "Actionable next step",
  "missingDocs": ["Doc1", "Doc2"]
}`;

    const payload = {
      contents: [{
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: mimeType,
              data: imageBuffer
            }
          }
        ]
      }]
    };

    const response = await axios.post(url, payload);
    const text = response.data.candidates[0].content.parts[0].text;
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch (error) {
    console.error('Error extracting document data:', error?.response?.data || error.message);
    throw new Error('Failed to process document image');
  }
}

module.exports = { generateCriticalPath, transcribeAudio, extractDocumentData };

// At the bottom of gemini.js, temporarily:
if (require.main === module) {
  generateCriticalPath({ answers: ["Toronto", "PR", "Engineer", "alone", "banking"] })
    .then(console.log)
    .catch(e => console.error(e.response?.data || e.message));
}