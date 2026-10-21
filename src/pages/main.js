// The bundle of the generated pages (about, contact, privacy, press; later the solutions pages and the blog): the
// phone menu, the copy buttons, the live clocks, the top bar's band, the contact form and the paper.
// No WebGL, no GSAP, no Lenis: every word is already in the HTML, and the page works without this file.
import { initMenu } from '../ui/menu.js';
import { initContact } from '../ui/contact.js';
import { paperTile, grainTile, toVar } from '../boot/tiles.js';
import { initForm } from './form.js';

const html = document.documentElement;
const Q = window.__qilich || (window.__qilich = {});
Q.lang = html.lang;
Q.page = html.dataset.page;

initMenu();
initContact();
initForm();

// the bar is transparent on the paper at the top, and takes a washi band once the page moves under it
const nav = document.getElementById('nav');
let queued = false;
const band = () => { queued = false; nav?.classList.toggle('band', window.scrollY > 8); };
addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(band); } }, { passive: true });
band();

// live clocks: Tashkent and Tokyo in the bar, Tashkent in the facts; aligned to the minute
const fmt = (tz) => { try { return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: tz }); } catch (e) { return null; } };
const fTas = fmt('Asia/Tashkent'), fTok = fmt('Asia/Tokyo');
if (fTas && fTok) {
  const tick = () => {
    const now = new Date();
    for (const el of document.querySelectorAll('time.t-tas')) el.textContent = fTas.format(now);
    for (const el of document.querySelectorAll('time.t-tok')) el.textContent = fTok.format(now);
    setTimeout(tick, 60000 - (now.getSeconds() * 1000 + now.getMilliseconds()) + 40);
  };
  tick();
  html.classList.add('clocks-live');
  for (const el of document.querySelectorAll('.live[hidden]')) el.hidden = false;
}

// the paper and the grain, drawn when the browser is idle (flat washi until then)
const idle = window.requestIdleCallback || ((f) => setTimeout(f, 120));
idle(() => { try { toVar(paperTile('washi'), '--washi-tile'); idle(() => toVar(grainTile(), '--grain-tile')); } catch (e) { /* flat washi */ } });
