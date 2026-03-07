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
  ctx.fillStyle = FOREST;
  ctx.beginPath();
  ctx.roundRect(0, 0, W, H, 56);
  ctx.fill();
  ctx.fillStyle = CREAM;
  ctx.beginPath();
  ctx.roundRect(24, 24, W - 48, H - 48, 40);
  ctx.fill();
  return { canvas, ctx };
}

function drawHeader(ctx, eyebrow, title, pillText, pillBg = MINT, pillFg = FOREST) {
  ctx.fillStyle = TERRACOTTA;
  ctx.font = '500 26px sans-serif';
  ctx.fillText(eyebrow.toUpperCase(), 64, 100);

  ctx.fillStyle = CHARCOAL;
  ctx.font = 'bold 72px sans-serif';
  const lines = title.split('\n');
  lines.forEach((line, i) => ctx.fillText(line, 64, 175 + i * 82));

  ctx.fillStyle = GOLD;
  ctx.beginPath();
  ctx.roundRect(64, 175 + lines.length * 82 - 10, 60, 5, 3);
  ctx.fill();

  ctx.font = 'bold 22px sans-serif';
  const tw = ctx.measureText(pillText).width + 44;
  ctx.fillStyle = pillBg;
  ctx.beginPath();
  ctx.roundRect(W - 64 - tw, 60, tw, 44, 22);
  ctx.fill();
  ctx.fillStyle = pillFg;
  ctx.fillText(pillText, W - 64 - tw + 22, 89);
}

function drawFooter(ctx) {
  ctx.fillStyle = TAUPE;
  ctx.fillRect(64, H - 130, W - 128, 1);
  ctx.fillStyle = FOREST;
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText('Roots 🌱', 64, H - 72);
  const cta = 'Track your application → 49parallel.app';
  ctx.fillStyle = TERRACOTTA;
  ctx.font = '24px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(cta, W - 64, H - 72);
  ctx.textAlign = 'left';
}

function drawProcessingTrend({ applicationType, userMonths }) {
  const { canvas, ctx } = baseCanvas();

  const relevant = irccData.profiles
    .filter(p => p.type === applicationType && p.outcome === 'approved')
    .sort((a, b) => a.submittedMonthsAgo - b.submittedMonthsAgo);

  // Build monthly average buckets
  const buckets = {};
  relevant.forEach(p => {
    if (!buckets[p.submittedMonthsAgo]) buckets[p.submittedMonthsAgo] = [];
    buckets[p.submittedMonthsAgo].push(p.totalMonths);
  });
  const points = Object.entries(buckets)
    .map(([k, v]) => ({ x: parseInt(k), y: v.reduce((a, b) => a + b) / v.length }))
    .sort((a, b) => a.x - b.x);

  const cx = 110, cy = 370, cw = W - 190, ch = 780;
  const maxY = Math.max(...points.map(p => p.y)) + 3;
  const minX = points[0].x, maxX = points[points.length - 1].x;
  const xRange = maxX - minX || 1;
  const toX = (x) => cx + ((x - minX) / xRange) * cw;
  const toY = (y) => cy + ch - (y / maxY) * ch;

  for (let i = 0; i <= 4; i++) {
    const gy = cy + ch - (i / 4) * ch;
    ctx.strokeStyle = TAUPE; ctx.lineWidth = 1; ctx.setLineDash([6, 6]);
    ctx.beginPath(); ctx.moveTo(cx, gy); ctx.lineTo(cx + cw, gy); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#aaa'; ctx.font = '22px sans-serif'; ctx.textAlign = 'right';
    ctx.fillText(`${Math.round((i / 4) * maxY)}mo`, cx - 14, gy + 8);
  }
  ctx.textAlign = 'left';

  const grad = ctx.createLinearGradient(0, cy, 0, cy + ch);
  grad.addColorStop(0, 'rgba(26,58,42,0.13)');
  grad.addColorStop(1, 'rgba(26,58,42,0.01)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  points.forEach((p, i) => i === 0 ? ctx.moveTo(toX(p.x), toY(p.y)) : ctx.lineTo(toX(p.x), toY(p.y)));
  ctx.lineTo(toX(points[points.length - 1].x), cy + ch);
  ctx.lineTo(toX(points[0].x), cy + ch);
  ctx.closePath(); ctx.fill();

  ctx.strokeStyle = FOREST; ctx.lineWidth = 5; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.beginPath();
  points.forEach((p, i) => i === 0 ? ctx.moveTo(toX(p.x), toY(p.y)) : ctx.lineTo(toX(p.x), toY(p.y)));
  ctx.stroke();

  points.forEach(p => {
    ctx.fillStyle = CREAM; ctx.beginPath(); ctx.arc(toX(p.x), toY(p.y), 10, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = FOREST; ctx.beginPath(); ctx.arc(toX(p.x), toY(p.y), 6, 0, Math.PI * 2); ctx.fill();
  });

  if (userMonths) {
    const ux = toX(userMonths);
    ctx.strokeStyle = TERRACOTTA; ctx.lineWidth = 2.5; ctx.setLineDash([10, 7]);
    ctx.beginPath(); ctx.moveTo(ux, cy + 70); ctx.lineTo(ux, cy + ch); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = TERRACOTTA;
    ctx.beginPath(); ctx.roundRect(ux - 60, cy + 20, 120, 48, 24); ctx.fill();
    ctx.fillStyle = CREAM; ctx.font = 'bold 26px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('You', ux, cy + 53);
    ctx.fillStyle = TERRACOTTA; ctx.font = '500 22px sans-serif';
    ctx.fillText(`Month ${userMonths}`, ux, cy + ch + 40);
    ctx.textAlign = 'left';
  }

  drawFooter(ctx);
  return canvas;
}

function drawTaskProgress({ userName, tasks }) {
  const { canvas, ctx } = baseCanvas();
  const doneCount = tasks.filter(t => t.done).length;
  drawHeader(ctx, 'Critical Path', `${userName}'s\nFirst 90 Days`, `${doneCount}/${tasks.length} complete`, FOREST, CREAM);

  const startY = 390;
  const barH = 116;
  const gap = 18;
  const barX = 64;
  const barW = W - 128;

  tasks.forEach((task, i) => {
    const y = startY + i * (barH + gap);
    const done = task.done;
    const color = done ? FOREST : task.urgency === 'critical' ? TERRACOTTA : GOLD;

    ctx.fillStyle = LIGHT_GRAY;
    ctx.beginPath(); ctx.roundRect(barX, y, barW, barH, barH / 2); ctx.fill();

    ctx.fillStyle = color;
    ctx.beginPath(); ctx.roundRect(barX, y, barW, barH, barH / 2); ctx.fill();

    ctx.fillStyle = done || task.urgency === 'critical' ? CREAM : CHARCOAL;
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText(task.title, barX + 40, y + 46);

    ctx.fillStyle = done || task.urgency === 'critical' ? 'rgba(253,252,251,0.7)' : '#666';
    ctx.font = '22px sans-serif';
    ctx.fillText(`Day ${task.daysFromArrival}${task.estimatedTime ? '  ·  ' + task.estimatedTime : ''}`, barX + 40, y + 82);

    ctx.textAlign = 'right';
    if (done) {
      ctx.fillStyle = CREAM; ctx.font = 'bold 36px sans-serif';
      ctx.fillText('✓', barX + barW - 36, y + 68);
    } else {
      ctx.fillStyle = color === GOLD ? 'rgba(0,0,0,0.4)' : 'rgba(253,252,251,0.5)';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(task.urgency === 'critical' ? 'URGENT' : 'UPCOMING', barX + barW - 36, y + 68);
    }
    ctx.textAlign = 'left';
  });

  drawFooter(ctx);
  return canvas;
}

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
  const rate = Math.round((approved / total) * 100);

  // Hero number
  ctx.fillStyle = FOREST;
  ctx.font = 'bold 200px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${rate}%`, W / 2, 520);
  ctx.fillStyle = '#aaa';
  ctx.font = '32px sans-serif';
  ctx.fillText(`approval rate · ${applicationType}`, W / 2, 575);
  ctx.textAlign = 'left';

  // Progress bar
  const bx = 64, by = 630, bw = W - 128, bh = 40;
  ctx.fillStyle = TAUPE;
  ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, bh / 2); ctx.fill();
  ctx.fillStyle = FOREST;
  ctx.beginPath(); ctx.roundRect(bx, by, (approved / total) * bw, bh, bh / 2); ctx.fill();

  ctx.fillStyle = FOREST; ctx.font = 'bold 24px sans-serif';
  ctx.fillText(`${approved} approved`, bx, by + bh + 38);
  ctx.fillStyle = '#aaa'; ctx.textAlign = 'right';
  ctx.fillText(`${pending} pending`, bx + bw, by + bh + 38);
  ctx.textAlign = 'left';

  // Stat cards
  const stats = [
    { icon: '⏱', label: 'Avg processing time', value: `${avg.toFixed(1)} months`, bg: MINT, accent: FOREST },
    { icon: '👥', label: 'Similar profiles tracked', value: `${total} applications`, bg: MINT, accent: FOREST },
    { icon: '🕐', label: 'Currently pending', value: `${pending} waiting`, bg: '#FDF8EC', accent: GOLD },
  ];

  const sy = 740, sh = 130, sg = 20;
  stats.forEach((s, i) => {
    const y = sy + i * (sh + sg);
    ctx.fillStyle = s.bg;
    ctx.beginPath(); ctx.roundRect(64, y, W - 128, sh, 22); ctx.fill();
    ctx.fillStyle = s.accent;
    ctx.beginPath(); ctx.roundRect(64, y, 7, sh, 3); ctx.fill();
    ctx.fillStyle = '#888'; ctx.font = '24px sans-serif';
    ctx.fillText(`${s.icon}  ${s.label}`, 100, y + 46);
    ctx.fillStyle = s.accent; ctx.font = 'bold 40px sans-serif';
    ctx.fillText(s.value, 100, y + 104);
  });

  drawLabel(ctx, `Roots community data`, 200, H - 28);
  return canvas;
}

module.exports = { generatePulseCard };