// services/gemini.js
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateCriticalPath(profile) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `
You are an expert on Canadian immigration and newcomer onboarding.
Given this immigrant profile, generate a sequenced critical path of tasks for their first 90 days.
Return JSON only. No markdown.

Profile: ${JSON.stringify(profile)}

Return this exact structure:
{
  "tasks": [
    {
      "id": "sin",
      "title": "Apply for your SIN",
      "description": "Your Social Insurance Number is required before you can work legally in Canada.",
      "daysFromArrival": 1,
      "urgency": "critical",
      "unlocks": ["bank_account", "tax_return"],
      "blockedBy": [],
      "link": "https://www.canada.ca/en/employment-social-development/services/sin.html",
      "estimatedTime": "2-3 hours"
    }
  ]
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return JSON.parse(text.replace(/```json|```/g, '').trim());
}

module.exports = { generateCriticalPath };
```

---

## Your `.env` File
```
# Twilio
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

# Gemini
GEMINI_API_KEY=

# Backboard
BACKBOARD_API_KEY=

# ElevenLabs
ELEVENLABS_API_KEY=

# Server
PORT=3000