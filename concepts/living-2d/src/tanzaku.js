// Scene 3: 技 NIMALAR QURAMIZ — the services hang as tanzaku strips from an ink string, on ikat.
import { bakeWashi } from './washi.js';
import { createAbr } from './abr.js';
import { OK, TT, el, navBar } from './common.js';
import { clamp, vnoise, mulberry } from './noise.js';

const STRIPS = [
  { n: '01', a: 'iOS va Android', b: 'ilovalar', ja: 'アプリ', paper: '#EEE6D4', ink: 'sumi' },
  { n: '02', a: 'Saytlar va', b: 'veb-platformalar', ja: 'ウェブ', paper: '#CF4A30', ink: 'kinu' },
  { n: '03', a: 'Telegram', b: 'botlar', ja: 'ボット', paper: '#F0E9D9', ink: 'sumi' },
  { n: '04', a: 'Backend va', b: 'integratsiyalar', ja: 'バックエンド', paper: '#C9D6E3', ink: 'sumi' },
  { n: '05', a: 'Desktop', b: 'dasturlar', ja: 'デスクトップ', paper: '#ECE3CF', ink: 'sumi' },
  { n: '06', a: 'IoT', b: 'qurilmalar', ja: 'IoT機器', paper: '#1D1915', ink: 'kinu' },
  { n: '07', a: `Sun${TT}iy`, b: 'intellekt (AI)', ja: '人工知能', paper: '#E2D6BE', ink: 'sumi' },
];

function shade(hex, k) {
  const v = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return '#' + v.map((c) => Math.round(Math.max(0, Math.min(255, c * k))).toString(16).padStart(2, '0')).join('');
}

export async function tanzaku(S) {
  const { W, H, kvg, phone, layers } = S;
  const t = S.t; // 1 = settled poster with residual sway; <1 = mid-gust
  const sw = 120, pitch = 158, x0 = 104, yS = Math.round(0.14 * H);
  const lens = [404, 432, 462, 512, 566, 612, 650];
  const gust = clamp(1 - t);
  const rnd = mulberry(5);
  const ang = STRIPS.map((_, i) => (Math.sin(1.7 + i * 0.85) * 1.4 + (rnd() - 0.5) * 0.8) * (1 - gust) + gust * 9 * Math.sin(2.4 - i * 0.62) * Math.exp(-i * 0.05));

  // ---------- cloth
  const abr = createAbr(layers.cloth);
  abr.render({ w: W, h: H, dpr: 1, time: 3, contrast: 0.38, scale: 1.05, boxes: [[x0 - 10, H - 200, 560, 160]], sheen: [W * 0.62, H * 0.62, 0.12], shade: [W * 0.45, H * 0.5, W * 0.8, 0.2], seed: 2.3 });

  // ---------- paper strips
  const pc = layers.paper; pc.width = W; pc.height = H; const ctx = pc.getContext('2d');
  const over = layers.over;
  const sagY = (x) => yS + 10 * Math.sin(Math.PI * x / W) + 4;
  const tops = [];
  for (let i = 0; i < STRIPS.length; i++) {
    const s = STRIPS[i];
    const cx = x0 + i * pitch + sw / 2;
    const top = sagY(cx) + 24;
    const L = lens[i];
    tops.push({ cx, top });
    const dark = s.ink === 'kinu' && s.paper === '#1D1915';
    const tex = bakeWashi(sw + 8, L + 16, { seed: 40 + i * 3, color: s.paper, deep: shade(s.paper, 0.93), lite: shade(s.paper, dark ? 1.35 : 1.04), scale: 0.8, chiri: dark ? 0 : 0.7, clouds: dark ? 1.6 : 0.9, fibres: dark ? 900 : 1500, fibreK: dark ? 0.16 : 0.85 });
    const tc = document.createElement('canvas'); tc.width = tex.w; tc.height = tex.h; tc.getContext('2d').putImageData(tex.img, 0, 0);
    if (dark) { // kurozome: fibres show lighter on black paper
      const g = tc.getContext('2d'); g.globalCompositeOperation = 'multiply'; g.fillStyle = 'rgba(40,34,28,1)'; g.globalAlpha = 0.0; g.fillRect(0, 0, tc.width, tc.height);
    }
    // strip outline: straight cut sides, deckled bottom
    const path = new Path2D();
    path.moveTo(-sw / 2, 0); path.lineTo(sw / 2, 0);
    const seg = 24;
    for (let j = 0; j <= seg; j++) {
      const x = sw / 2 - (j / seg) * sw;
      const y = L + (vnoise(j * 0.9, i * 7, 3) - 0.5) * 7 + (vnoise(j * 3.1, i * 5, 4) - 0.5) * 3;
      path.lineTo(x, y);
    }
    path.closePath();
    ctx.save();
    ctx.translate(cx, top); ctx.rotate(ang[i] * Math.PI / 180);
    ctx.shadowColor = 'rgba(6,10,30,.42)'; ctx.shadowBlur = 26; ctx.shadowOffsetX = 9; ctx.shadowOffsetY = 14;
    ctx.fillStyle = s.paper; ctx.fill(path);
    ctx.shadowColor = 'transparent';
    ctx.save(); ctx.clip(path); ctx.drawImage(tc, -sw / 2 - 4, -8);
    // soft light falloff along the strip and a faint fold line near the top
    const g = ctx.createLinearGradient(0, 0, 0, L);
    g.addColorStop(0, 'rgba(0,0,0,.10)'); g.addColorStop(0.08, 'rgba(0,0,0,0)'); g.addColorStop(0.85, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.06)');
    ctx.fillStyle = g; ctx.fillRect(-sw / 2, 0, sw, L + 10);
    const gs = ctx.createLinearGradient(-sw / 2, 0, sw / 2, 0);
    gs.addColorStop(0, 'rgba(255,255,255,.05)'); gs.addColorStop(0.5, 'rgba(255,255,255,0)'); gs.addColorStop(1, 'rgba(0,0,0,.07)');
    ctx.fillStyle = gs; ctx.fillRect(-sw / 2, 0, sw, L + 10);
    ctx.restore();
    // cut sides: a hairline of light
    ctx.strokeStyle = dark ? 'rgba(255,250,240,.18)' : 'rgba(255,252,246,.6)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(-sw / 2 + 0.5, 0); ctx.lineTo(-sw / 2 + 0.5, L - 3); ctx.stroke();
    ctx.restore();

    // DOM text riding the same transform
    const g2 = el('div', 'strip ' + s.ink, null, over);
    g2.style.left = (cx - sw / 2) + 'px'; g2.style.top = top + 'px'; g2.style.width = sw + 'px'; g2.style.height = L + 'px';
    g2.style.transformOrigin = '50% 0'; g2.style.transform = `rotate(${ang[i]}deg)`;
    el('span', 'idx', s.n, g2);
    el('span', 'name', `<span>${s.a}</span><span>${s.b}</span>`, g2);
    el('span', 'ja', s.ja, g2).setAttribute('lang', 'ja');
  }
  // ---------- the string and the koyori loops (SVG)
  let svg = `<svg class="string" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-hidden="true"><defs>
    <filter id="tw"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="3"/><feDisplacementMap in="SourceGraphic" scale="1.2"/></filter></defs>`;
  let d = `M -10 ${sagY(-10)}`;
  for (let x = 0; x <= W + 10; x += 20) d += ` L ${x} ${sagY(x).toFixed(1)}`;
  svg += `<path d="${d}" stroke="#0d1230" stroke-width="3.6" fill="none" opacity=".55" transform="translate(2 4)" filter="url(#tw)"/>`;
  svg += `<path d="${d}" stroke="#EFE8D8" stroke-width="2.2" fill="none" stroke-linecap="round" filter="url(#tw)"/>`;
  svg += `<path d="${d}" stroke="#a9a08e" stroke-width="2.2" fill="none" stroke-dasharray="2 3" opacity=".7"/>`;
  tops.forEach(({ cx, top }, i) => {
    const ys = sagY(cx);
    const a = ang[i] * Math.PI / 180;
    const bx = cx + Math.sin(-a) * 0, by = top;
    svg += `<path d="M ${cx - 7} ${ys - 2} C ${cx - 9} ${ys + 9}, ${cx - 4} ${by - 4}, ${bx} ${by + 6} C ${cx + 4} ${by - 4}, ${cx + 9} ${ys + 9}, ${cx + 7} ${ys - 2}" stroke="#F3EDE0" stroke-width="2.4" fill="none" stroke-linecap="round" filter="url(#tw)"/>`;
    svg += `<path d="M ${cx - 7} ${ys - 2} C ${cx - 9} ${ys + 9}, ${cx - 4} ${by - 4}, ${bx} ${by + 6}" stroke="#b5ab97" stroke-width="2.4" fill="none" stroke-dasharray="1.5 2.5"/>`;
    svg += `<circle cx="${cx}" cy="${ys - 1}" r="3.4" fill="#EFE8D8"/><circle cx="${cx + 0.8}" cy="${ys}" r="1.5" fill="#b5ab97"/>`;
  });
  svg += '</svg>';
  const sv = el('div', 'string-wrap', svg, over);

  // ---------- type
  navBar(over, kvg, { phone, dark: true });
  const h2 = el('h2', 'h2 tz-h2', 'Nimalar quramiz', over);
  const hint = el('p', 'tz-hint', `Keraklisini tanlang — xatga qo${OK}shamiz.`, over);
  el('div', 'spine', '<span lang="ja">七つの技</span><i>07</i>', over);
  return {};
}
