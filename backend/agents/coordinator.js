const { generateCriticalPath } = require('../services/gemini');
const { formatStatusMessage } = require('../services/statusTracker');

const sessions = {};

const ONBOARDING_QUESTIONS = [
  "Which city did you land in?",
  "What is your immigration status? (e.g. study permit, work permit, PR, visitor)",
  "What do you do professionally?",
  "Do you have family with you, or are you arriving alone?",
  "What are you most worried about right now?"
];

async function handle(userId, message) {
  if (!sessions[userId]) {
    sessions[userId] = {
      stage: 'onboarding',
      questionIndex: 0,
      profile: {},
      answers: []
    };
    return "Welcome to Roots 🌱\n\nI help newcomers to Canada figure out exactly what to do — and in what order. Let's start with a few quick questions.\n\nFirst: where did you arrive from, and when did you land in Canada?";
  }

  const session = sessions[userId];

  // STATUS flow
  if (message.trim().toUpperCase() === 'STATUS') {
    session.stage = 'status_q1';
    return "To check your application timeline, what type of application did you submit?\n\n(e.g. PR - Express Entry, Work Permit, Study Permit, PR - Spousal)";
  }

  if (session.stage === 'status_q1') {
    session.statusType = message;
    session.stage = 'status_q2';
    return "How many months ago did you submit your application?";
  }

  if (session.stage === 'status_q2') {
    const months = parseInt(message);
    session.stage = 'active';
    return formatStatusMessage(session.statusType, months);
  }

  // ONBOARDING flow
  if (session.stage === 'onboarding') {
    session.answers.push(message);
    session.questionIndex++;

    if (session.questionIndex < ONBOARDING_QUESTIONS.length) {
      return ONBOARDING_QUESTIONS[session.questionIndex];
    }

    // All questions answered — generate critical path
    session.stage = 'active';
    session.profile = {
      answers: session.answers,
      questions: ONBOARDING_QUESTIONS
    };

    try {
      const path = await generateCriticalPath(session.profile);
      const tasks = path.tasks.slice(0, 5);
      let response = "Here's your critical path for the next 90 days 🗺️\n\n";
      tasks.forEach((task, i) => {
        const emoji = task.urgency === 'critical' ? '🔴' : task.urgency === 'high' ? '🟡' : '🟢';
        response += `${emoji} *${i + 1}. ${task.title}*\n${task.description}\n⏱ ${task.estimatedTime}\n\n`;
      });
      response += "Reply with any question, or type *STATUS* to check your application timeline.";
      return response;
    } catch (err) {
      console.error('Gemini error:', err);
      return `Here's your critical path for the next 90 days 🗺️\n\n🔴 *1. Apply for your SIN*\nRequired before you can work legally in Canada.\n⏱ 2-3 hours\n\n🔴 *2. Open a Canadian bank account*\nNeeded for direct deposit and building credit.\n⏱ 1-2 hours\n\n🟡 *3. Get private health insurance*\nYou have a 90-day wait for OHIP. Get bridging coverage now.\n⏱ 30 minutes\n\n🟡 *4. Apply for your Ontario Health Card (OHIP)*\nBook this appointment now — the wait is real.\n⏱ 2 hours\n\n🟢 *5. Apply for a secured credit card*\nStart building Canadian credit history immediately.\n⏱ 30 minutes\n\nReply with any question, or type *STATUS* to check your application timeline.`;
    }
  }

  // ACTIVE — general responses
  return "I'm here to help. You can type *STATUS* to check your application timeline, or just ask me anything about settling in Canada 🌱";
}

module.exports = { handle };