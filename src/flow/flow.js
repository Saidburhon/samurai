// Flow mode (no WebGL, ?tier=0, or GL failure): the catalogue. Lines rise through their masks once as they come
// into view, the big clocks are live, and the dial's drawn sword points to the hour in Tashkent.
import { hourAngle } from '../sword/dial.js';

const REVEAL = '.b-promise .st, .s-utsuri .h2, .s-yaki .big, .s-togi .st, .s-togi .after, .s-tsuba .st, .s-noto .st, .contact .tel';

export function initFlow() {
  const html = document.documentElement;
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    const els = [...document.querySelectorAll(REVEAL)];
    for (const el of els) {
      if (!el.querySelector('.ln')) el.innerHTML = `<span class="ln"><span>${el.innerHTML}</span></span>`;
      el.classList.add('rv');
    }
    html.classList.add('reveal');
    const io = new IntersectionObserver((list) => {
      for (const en of list) if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }, { rootMargin: '0px 0px -8% 0px' });
    for (const el of els) io.observe(el);
  }
  // live time on the Toki page: the big clocks and the hand of the dial
  const fmt = (tz) => { try { return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: tz }); } catch (e) { return null; } };
  const fTas = fmt('Asia/Tashkent'), fTok = fmt('Asia/Tokyo');
  const tas = document.querySelector('.clocks-big .tas'), tok = document.querySelector('.clocks-big .tok');
  const hand = document.querySelector('.dial .hand');
  const tickClock = () => {
    const now = new Date();
    if (fTas && tas) tas.textContent = fTas.format(now);
    if (fTok && tok) tok.textContent = fTok.format(now);
    if (fTas && hand) { const [h, m] = fTas.format(now).split(':').map(Number); hand.style.setProperty('--hand', `${hourAngle(h + m / 60).toFixed(2)}deg`); }
    setTimeout(tickClock, 60000 - (now.getSeconds() * 1000 + now.getMilliseconds()) + 40);
  };
  tickClock();
}
