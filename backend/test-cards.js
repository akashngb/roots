require('dotenv').config();
const { generatePulseCard } = require('./services/graphicGenerator');

Promise.all([
  generatePulseCard('processingTrend', { applicationType: 'PR - Express Entry', userMonths: 14 }),
  generatePulseCard('taskProgress', { userName: 'Ahmed', tasks: [
    { title: 'Apply for SIN', daysFromArrival: 1, urgency: 'critical', done: true },
    { title: 'Open bank account', daysFromArrival: 3, urgency: 'critical', done: true },
    { title: 'Get OHIP', daysFromArrival: 7, urgency: 'high', done: false },
    { title: 'Find housing', daysFromArrival: 14, urgency: 'high', done: false },
    { title: 'Secured credit card', daysFromArrival: 30, urgency: 'normal', done: false },
  ]}),
  generatePulseCard('applicationBreakdown', { applicationType: 'PR - Express Entry' }),
]).then(urls => urls.forEach((u, i) => console.log('Card', i+1, u))).catch(console.error);
