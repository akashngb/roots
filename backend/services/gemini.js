const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateCriticalPath(profile) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const prompt = `You are an expert on Canadian immigration and newcomer onboarding.
Given this immigrant profile, generate a sequenced critical path of tasks for their first 90 days.
Return JSON only. No markdown. No backticks.

Profile: ${JSON.stringify(profile)}

Return this exact structure:
{"tasks":[{"id":"sin","title":"Apply for your SIN","description":"Your Social Insurance Number is required before you can work legally in Canada.","daysFromArrival":1,"urgency":"critical","unlocks":["bank_account"],"blockedBy":[],"link":"https://www.canada.ca/en/employment-social-development/services/sin.html","estimatedTime":"2-3 hours"}]}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return JSON.parse(text.replace(/```json|```/g, '').trim());
}

module.exports = { generateCriticalPath };
