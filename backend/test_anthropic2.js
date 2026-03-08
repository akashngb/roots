const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
async function main() {
  const models = ['claude-3-5-sonnet', 'claude-3-5-sonnet-latest', 'claude-3-haiku-20240307', 'claude-3-opus-latest'];
  for (const model of models) {
    try {
      await client.messages.create({
        model: model,
        max_tokens: 10,
        messages: [{ role: 'user', content: 'test' }]
      });
      console.log(`✅ ${model} works`);
    } catch (e) {
      console.log(`❌ ${model} failed: ${e.message}`);
    }
  }
}
main();
