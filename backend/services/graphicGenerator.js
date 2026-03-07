const { createCanvas } = require('canvas');
const { uploadBuffer } = require('./cloudinary');
const irccData = require('../data/ircc_seed.json');

// ─── MAIN EXPORT ───────────────────────────────────────────
async function generatePulseCard(type, options) {
  let canvas;
  if (type === 'processingTrend') canvas = drawProcessingTrend(options);
  else if (type === 'taskProgress') canvas = drawTaskProgress(options);
  else if (type === 'applicationBreakdown') canvas = drawApplicationBreakdown(options);
  else throw new Error('Unknown card type: ' + type);

  const buffer = canvas.toBuffer('image/png');
  const url = await uploadBuffer(buffer, `pulse_${type}_${Date.now()}`, 'image');
  return url;
}

// ─── SHARED HELPERS ────────────────────────────────────────
const W = 1080, H = 566;
const FOREST = '#1A3A2A', TERRACOTTA = '#A64D32', CREAM = '#FDFCFB';
const MINT = '#E8F3ED', CHARCOAL = '#141414', GOLD = '#D4AF37', TAUPE = '#E2DDD9';

function baseCanvas() {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = CREAM;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = FOREST;
  ctx.fillRect(0, 0, 10, H);
  ctx.fillStyle = TERRACOTTA;
  ctx.fillRect(0, H - 5, W, 5);
  return { canvas, ctx };
}

function drawLabel(ctx, text, x, y) {
  ctx.fillStyle = FOREST;
  ctx.font = `bold 22px sans-serif`;
  ctx.fillText('Roots 🌱', 40, H - 28);
  ctx.fillStyle = TAUPE;
  ctx.font = '18px sans-serif';
  ctx.fillText(text, x, y);
}

function drawTitle(ctx, title, subtitle) {
  ctx.fillStyle = CHARCOAL;
  ctx.font = 'bold 38px sans-serif';
  ctx.fillText(title, 40, 60);
  if (subtitle) {
    ctx.fillStyle = '#777';
    ctx.font = '22px sans-serif';
    ctx.fillText(subtitle, 40, 92);
  }
}

function pill(ctx, text, x, y) {
  ctx.font = '18px sans-serif';
  const tw = ctx.measureText(text).width + 28;
  ctx.fillStyle = MINT;
  ctx.beginPath();
  ctx.roundRect(x, y - 20, tw, 28, 14);
  ctx.fill();
  ctx.fillStyle = FOREST;
  ctx.fillText(text, x + 14, y);
}

// ─── CARD 1: PROCESSING TREND (Line Chart) ─────────────────
function drawProcessingTrend({ applicationType, userMonths }) {
  const { canvas, ctx } = baseCanvas();

  const relevant = irccData.profiles
    .filter(p => p.type === applicationType && p.outcome === 'approved')
    .sort((a, b) => a.submittedMonthsAgo - b.submittedMonthsAgo);

  // Build monthly average buckets
  const buckets = {};
  relevant.forEach(p => {
    const key = p.submittedMonthsAgo;
    if (!buckets[key]) buckets[key] = [];
    buckets[key].push(p.totalMonths);
  });
  const points = Object.entries(buckets)
    .map(([k, v]) => ({ x: parseInt(k), y: v.reduce((a, b) => a + b, 0) / v.length }))
    .sort((a, b) => a.x - b.x);

  drawTitle(ctx, `${applicationType} Processing Trend`, 'Approved applications · months to decision');
  pill(ctx, 'Pulse Alert', W - 180, 55);

  // Chart area
  const cx = 60, cy = 130, cw = W - 120, ch = 340;
  const maxY = Math.max(...points.map(p => p.y)) + 2;
  const minX = points[0].x, maxX = points[points.length - 1].x;

  // Grid lines
  ctx.strokeStyle = TAUPE;
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const gy = cy + ch - (i / 4) * ch;
    ctx.beginPath(); ctx.moveTo(cx, gy); ctx.lineTo(cx + cw, gy); ctx.stroke();
    ctx.fillStyle = '#aaa'; ctx.font = '16px sans-serif';
    ctx.fillText(`${Math.round((i / 4) * maxY)}mo`, cx - 42, gy + 5);
  }

  // Line
  ctx.strokeStyle = FOREST;
  ctx.lineWidth = 3;
  ctx.beginPath();
  points.forEach((p, i) => {
    const px = cx + ((p.x - minX) / (maxX - minX)) * cw;
    const py = cy + ch - (p.y / maxY) * ch;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  });
  ctx.stroke();

  // Dots
  points.forEach(p => {
    const px = cx + ((p.x - minX) / (maxX - minX)) * cw;
    const py = cy + ch - (p.y / maxY) * ch;
    ctx.fillStyle = FOREST;
    ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();
  });

  // User marker
  if (userMonths) {
    const ux = cx + ((userMonths - minX) / (maxX - minX)) * cw;
    ctx.strokeStyle = TERRACOTTA;
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath(); ctx.moveTo(ux, cy); ctx.lineTo(ux, cy + ch); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = TERRACOTTA;
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('You', ux + 6, cy + 20);
  }

  drawLabel(ctx, `Based on ${relevant.length} approved applications`, 200, H - 28);
  return canvas;
}

// ─── CARD 2: TASK PROGRESS (Bar Chart) ─────────────────────
function drawTaskProgress({ userName, tasks }) {
  const { canvas, ctx } = baseCanvas();

  drawTitle(ctx, `${userName}'s First 90 Days`, 'Critical path progress');
  pill(ctx, 'Your Journey', W - 200, 55);

  const cx = 40, cy = 110, cw = W - 80, ch = 370;
  const barH = Math.floor(ch / tasks.length) - 10;
  const maxDays = 90;

  tasks.forEach((task, i) => {
    const y = cy + i * (barH + 10);
    const fillW = (task.daysFromArrival / maxDays) * (cw - 200);

    // Background bar
    ctx.fillStyle = TAUPE;
    ctx.beginPath(); ctx.roundRect(200, y, cw - 200, barH, 6); ctx.fill();

    // Fill bar
    ctx.fillStyle = task.done ? FOREST : task.urgency === 'critical' ? TERRACOTTA : GOLD;
    ctx.beginPath(); ctx.roundRect(200, y, Math.max(fillW, 12), barH, 6); ctx.fill();

    // Label
    ctx.fillStyle = CHARCOAL;
    ctx.font = `${barH > 28 ? 18 : 15}px sans-serif`;
    ctx.fillText(task.title.length > 22 ? task.title.slice(0, 22) + '…' : task.title, cx, y + barH / 2 + 6);

    // Day marker
    ctx.fillStyle = '#aaa';
    ctx.font = '15px sans-serif';
    ctx.fillText(`Day ${task.daysFromArrival}`, 200 + fillW + 8, y + barH / 2 + 6);
  });

  // Legend
  [[FOREST, 'Complete'], [TERRACOTTA, 'Critical'], [GOLD, 'Upcoming']].forEach(([color, label], i) => {
    ctx.fillStyle = color;
    ctx.fillRect(W - 280 + i * 90, H - 44, 14, 14);
    ctx.fillStyle = '#777'; ctx.font = '15px sans-serif';
    ctx.fillText(label, W - 262 + i * 90, H - 32);
  });

  drawLabel(ctx, '', 40, H - 28);
  return canvas;
}

// ─── CARD 3: APPLICATION BREAKDOWN (Donut Chart) ───────────
function drawApplicationBreakdown({ applicationType }) {
  const { canvas, ctx } = baseCanvas();

  const relevant = irccData.profiles.filter(p => p.type === applicationType);
  const approved = relevant.filter(p => p.outcome === 'approved').length;
  const pending = relevant.filter(p => p.outcome === 'pending').length;
  const total = relevant.length;

  drawTitle(ctx, `${applicationType}`, `${total} similar applications in our database`);
  pill(ctx, 'Status Insight', W - 220, 55);

  // Donut
  const cx = 320, cy = 320, r = 180, inner = 100;
  const slices = [
    { value: approved, color: FOREST, label: 'Approved' },
    { value: pending, color: GOLD, label: 'Pending' },
  ];
  let startAngle = -Math.PI / 2;
  slices.forEach(slice => {
    const angle = (slice.value / total) * Math.PI * 2;
    ctx.fillStyle = slice.color;
    ctx.beginPath();
    ctx.arc(cx, cy, r, startAngle, startAngle + angle);
    ctx.arc(cx, cy, inner, startAngle + angle, startAngle, true);
    ctx.closePath(); ctx.fill();
    startAngle += angle;
  });

  // Center text
  ctx.fillStyle = CHARCOAL;
  ctx.font = 'bold 52px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${Math.round((approved / total) * 100)}%`, cx, cy + 10);
  ctx.font = '20px sans-serif';
  ctx.fillStyle = '#777';
  ctx.fillText('approval rate', cx, cy + 38);
  ctx.textAlign = 'left';

  // Stats right side
  const avg = relevant.filter(p => p.totalMonths).reduce((a, p) => a + p.totalMonths, 0) /
    relevant.filter(p => p.totalMonths).length;

  const stats = [
    { label: 'Avg processing', value: `${avg.toFixed(1)} months` },
    { label: 'Approved', value: `${approved} of ${total}` },
    { label: 'Still pending', value: `${pending}` },
  ];

  stats.forEach((s, i) => {
    const sy = 180 + i * 90;
    ctx.fillStyle = TAUPE;
    ctx.fillRect(680, sy, 340, 70);
    ctx.fillStyle = '#777'; ctx.font = '18px sans-serif';
    ctx.fillText(s.label, 700, sy + 26);
    ctx.fillStyle = CHARCOAL; ctx.font = 'bold 28px sans-serif';
    ctx.fillText(s.value, 700, sy + 56);
  });

  drawLabel(ctx, `Roots community data`, 200, H - 28);
  return canvas;
}

module.exports = { generatePulseCard };