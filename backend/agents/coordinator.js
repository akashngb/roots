// agents/coordinator.js - stub to get things talking tonight
const { getOrCreateSession } = require('../services/backboard');
const immigrationAgent = require('./immigration');

// In-memory session store for tonight — replace with Backboard persistence tomorrow
const sessions = {};

async function handle(userId, message) {
  if (!sessions[userId]) {
    sessions[userId] = { stage: 'onboarding', profile: {} };
  }

  const session = sessions[userId];

  // Route based on stage
  if (session.stage === 'onboarding') {
    return await immigrationAgent.onboard(session, message);
  }

  // Default: echo back with context while you build
  return `Got your message: "${message}". Building Roots 🌱`;
}

module.exports = { handle };