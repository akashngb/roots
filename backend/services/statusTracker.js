const data = require('../data/ircc_seed.json');

function analyzeStatus(applicationType, monthsWaiting) {
  // Find similar profiles
  const similar = data.profiles.filter(p => 
    p.type.toLowerCase().includes(applicationType.toLowerCase()) ||
    applicationType.toLowerCase().includes(p.type.toLowerCase().split(' ')[0])
  );

  if (similar.length === 0) {
    return {
      message: `I don't have enough data for ${applicationType} applications yet, but your wait of ${monthsWaiting} months is being tracked.`,
      normal: true
    };
  }

  const resolved = similar.filter(p => p.outcome === 'approved');
  const avgMonths = resolved.reduce((sum, p) => sum + p.totalMonths, 0) / resolved.length;
  const maxMonths = Math.max(...resolved.map(p => p.totalMonths));
  const pctResolvedByNow = resolved.filter(p => p.totalMonths <= monthsWaiting).length / resolved.length * 100;
  const isNormal = monthsWaiting <= avgMonths * 1.3;

  return {
    avgMonths: avgMonths.toFixed(1),
    maxMonths,
    pctResolvedByNow: pctResolvedByNow.toFixed(0),
    sampleSize: similar.length,
    isNormal,
    monthsWaiting
  };
}

function formatStatusMessage(applicationType, monthsWaiting) {
  const result = analyzeStatus(applicationType, monthsWaiting);
  
  if (result.message) return result.message;

  const { avgMonths, maxMonths, pctResolvedByNow, sampleSize, isNormal } = result;

  let msg = `📊 *${applicationType} Status Analysis*\n\n`;
  msg += `Your wait: *${monthsWaiting} months*\n`;
  msg += `Average for similar applications: *${avgMonths} months*\n`;
  msg += `Based on ${sampleSize} similar profiles\n\n`;

  if (isNormal) {
    msg += `✅ *Your timeline is completely normal.*\n\n`;
    msg += `${pctResolvedByNow}% of similar applications resolved within ${monthsWaiting} months. `;
    msg += `Most applications in your category resolve by ${maxMonths} months.\n\n`;
    msg += `There is nothing you need to do right now. Stop refreshing the portal 🙏`;
  } else {
    msg += `⚠️ *Your wait is longer than average.*\n\n`;
    msg += `This doesn't mean something is wrong — complex cases take longer. `;
    msg += `Consider checking:\n`;
    msg += `• Your application status on the IRCC portal\n`;
    msg += `• Whether any documents were requested and missed\n`;
    msg += `• Whether your contact info is up to date with IRCC\n\n`;
    msg += `You can also contact your MP's office for a free application inquiry.`;
  }

  return msg;
}

module.exports = { formatStatusMessage };