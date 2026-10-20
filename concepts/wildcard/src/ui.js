import { STRIPES } from './cartoon.js';

// e-gasuri pixel arrow (down-right), drawn on a 9x9 grid
const ARROW = `<svg class="arr" viewBox="0 0 9 9" aria-hidden="true"><path d="M1 1h1v1H1zM2 2h1v1H2zM3 3h1v1H3zM4 4h1v1H4zM5 5h1v1H5zM6 6h1v1H6zM7 2h1v6H7zM2 7h6v1H2z" fill="currentColor"/></svg>`;
const STRING = `<svg class="snd" viewBox="0 0 26 10" aria-hidden="true"><circle cx="2" cy="5" r="1.6"/><circle cx="24" cy="5" r="1.6"/><path d="M3.5 5H22.5" stroke="currentColor" stroke-width="1.2"/></svg>`;
const YAGASURI = `<svg class="ya" viewBox="0 0 18 34" aria-hidden="true">${[0, 1, 2]
  .map((k) => `<g transform="translate(0 ${k * 10})" opacity="${1 - k * 0.22}"><path d="M0 0L9 6V10L0 4Z" fill="var(--saffron)"/><path d="M18 0L9 6V10L18 4Z" fill="var(--ivory)"/></g>`)
  .join('')}</svg>`;

// custom cursor: ring over woven type, with a hanging dyed thread that lags behind the sweep
const cursor = ([x, y]) => `<svg class="cur" style="left:${x - 60}px;top:${y - 20}px" width="120" height="110" viewBox="-60 -20 120 110" aria-hidden="true">
  <circle cx="0" cy="0" r="14" fill="none" stroke="var(--ai)" stroke-width="1.5"/>
  <circle cx="0" cy="0" r="2.5" fill="var(--ai)"/>
  <path d="M0 14 C -2 30, -14 44, -26 54 S -40 72, -36 84" fill="none" stroke="var(--atlas)" stroke-width="2.4" stroke-linecap="round"/>
  <path d="M0 14 C -2 30, -14 44, -26 54 S -40 72, -36 84" fill="none" stroke="rgba(255,255,255,.45)" stroke-width=".8" stroke-linecap="round" transform="translate(-.6 -.4)"/>
  <circle cx="-36" cy="85" r="2.6" fill="var(--atlas)"/>
</svg>`;

const wordmark = (cls = '') => `<a class="wm ${cls}" aria-label="Qilich">Q<i class="t1"></i>L<i class="t2"></i>CH</a>`;

const selvedge = (cur) =>
  `<nav class="selv" aria-label="Sahifa">${Array.from({ length: 14 }, (_, k) => `<a class="${k === cur ? 'on' : ''}"></a>`).join('')}</nav>`;

function header({ idx, tone = 'light', mobile }) {
  if (mobile)
    return `<header class="hd ${tone}">${wordmark()}<div class="hr"><span class="lang1">UZ <svg viewBox="0 0 8 5" class="dd"><path d="M0 0h8L4 5z" fill="currentColor"/></svg></span><button class="menu" aria-label="Menyu"><i></i><i></i><i></i></button></div></header>`;
  return `<header class="hd ${tone}">
    ${wordmark()}
    <span class="idx">${idx}</span>
    <div class="hr">
      <a class="tel">+998 97 270 70 07</a>
      <span class="lang"><b>UZ</b><span>RU</span><span>EN</span></span>
      ${STRING}
      <a class="tag tag-s"><span>Aloqa</span></a>
    </div>
  </header>`;
}

export function ui(scene, { W, H, mobile, cfg, layout }) {
  if (scene === 'hero' && !mobile) {
    const b4 = layout.bases[3];
    return `${header({ idx: '00 · QILICH' })}
    ${selvedge(0)}
    <h1 class="sr">Yapon IT agenstvasi endi Oʻzbekistonda!</h1>
    <div class="tate" lang="ja">日本の開発会社、ウズベキスタンに上陸。</div>
    <div class="lower" style="top:${b4 + 48}px">
      <p class="sub">Yapon sifati — Toshkent vaqtida.</p>
      <p class="svc">iOS · ANDROID · VEB · TELEGRAM · BACKEND · IoT · AI</p>
      <a class="tag tag-l"><span>Loyihani boshlash</span>${ARROW}</a>
    </div>
    <div class="fr fr-l" style="top:${H - 30}px">経糸 · TANDA · 240 IP</div>
    <div class="fr fr-r" style="top:${H - 42}px">${YAGASURI}<span>PASTGA</span></div>
    ${layout.cursor ? cursor(layout.cursor) : ''}`;
  }
  if (scene === 'hero' && mobile) {
    const colW = layout.vLeft - 16 - 14;
    const y = cfg.fell - cfg.jiyak - 36 - 142;
    return `${header({ mobile })}
    <h1 class="sr">Yapon IT agenstvasi endi Oʻzbekistonda!</h1>
    <div class="lower m" style="top:${y}px;width:${colW}px">
      <p class="sub">Yapon sifati — Toshkent vaqtida.</p>
      <a class="tag tag-l"><span>Loyihani boshlash</span>${ARROW}</a>
      <p class="svc">iOS · ANDROID · VEB · TELEGRAM · BACKEND · IoT · AI</p>
    </div>
    <div class="fr fr-l m" style="top:${H - 28}px" lang="ja">日本の開発会社、ウズベキスタンに上陸。</div>
    <div class="fr fr-r m" style="top:${H - 36}px">${YAGASURI}</div>`;
  }
  if (scene === 'weave') {
    return `<div class="fr fr-l count" style="top:${H - 40}px">経糸 · TANDA · <b>240</b> IP</div>`;
  }
  if (scene === 'stripes') {
    const rows = layout.rows
      .map((r, k) => {
        const s = STRIPES[k];
        const vis = k < layout.k;
        return `<p class="desc${vis ? '' : ' hide'}" style="top:${r.y0}px;color:${s.ink}">${s.d}</p>`;
      })
      .join('');
    return `${header({ idx: '05 · QURAMIZ' })}
    ${selvedge(5)}
    <div class="strip"><h2>QURAMIZ · 7 YOʻNALISH</h2><span>縞 · SHIMA · YOʻL-YOʻL</span></div>
    ${rows}
    <div class="fr fr-l" style="top:${H - 40}px">TOʻQILMOQDA · 04 / 07</div>`;
  }
  if (scene === 'jidoka') {
    return `${header({ idx: '03 · JIDOKA', tone: 'dark' })}
    ${selvedge(3)}
    <div class="jd">
      <p class="lbl">自働化 · JIDOKA · TOYODA, 1924</p>
      <h2>Ip uzilsa —<br>dastgoh toʻxtaydi.</h2>
      <p class="p">Bizda ham shunday: test oʻtmasa, reliz chiqmaydi.</p>
    </div>
    <div class="fr fr-l" style="top:${cfg.fell + 34}px">経糸 · TANDA 149 · <b class="red">UZILDI</b></div>`;
  }
  return '';
}
