// Analytics, only when content/site.json has an ID: the build then adds this module, its config
// (<script type="application/json" id="qilich-analytics">) and the consent banner to every page; with no IDs none of
// it ships. GA4 runs in consent mode with everything denied by default, and neither GA4 nor Yandex Metrika is loaded
// until the visitor allows cookies; the choice is kept in localStorage. The banner appears only after the visitor has
// scrolled (or after a few seconds on a page that cannot scroll), so it never covers the first screen, and it is
// fixed, so nothing moves; on the generated pages the page end is padded while it shows, so the footer stays readable.
// Events (also reachGoal in Metrika):
//   generate_lead   the contact form is sent (src/pages/form.js dispatches qilich:lead)
//   contact_click   { method: phone | email | telegram | whatsapp | line }   any such link
//   cta_click       { page, lang, cta }                                       .cta, .btn and [data-cta] that are not contact links
const KEY = 'qilich.consent';
const html = document.documentElement;
const Q = window.__qilich || (window.__qilich = {});
let cfg = {};
try { cfg = JSON.parse(document.getElementById('qilich-analytics')?.textContent || '{}'); } catch (e) { cfg = {}; }
const lang = html.lang;
Q.events = Q.events || [];

window.dataLayer = window.dataLayer || [];
function gtag() { window.dataLayer.push(arguments); } // eslint-disable-line prefer-rest-params
gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied' });

const read = () => { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
const write = (v) => { try { localStorage.setItem(KEY, v); } catch (e) { /* private mode: asked again next time */ } };
const script = (src) => { const s = document.createElement('script'); s.async = true; s.src = src; document.head.appendChild(s); };

let loaded = false;
function load() {
  if (loaded) return;
  loaded = true;
  gtag('consent', 'update', { analytics_storage: 'granted' });
  if (cfg.ga4) {
    gtag('js', new Date());
    gtag('config', cfg.ga4);
    script(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(cfg.ga4)}`);
  }
  if (cfg.ym) {
    window.ym = window.ym || function ym() { (window.ym.a = window.ym.a || []).push(arguments); }; // eslint-disable-line prefer-rest-params
    window.ym.l = Date.now();
    script('https://mc.yandex.ru/metrika/tag.js');
    window.ym(Number(cfg.ym), 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: false });
  }
  Q.analytics = 'on';
}

// every event is noted locally (Q.events, for QA); it is sent only after consent
export function track(name, params = {}) {
  Q.events.push({ name, params, sent: loaded });
  if (!loaded) return;
  gtag('event', name, params);
  if (cfg.ym && window.ym) window.ym(Number(cfg.ym), 'reachGoal', name, params);
}
Q.track = track;

const METHOD = [[/^tel:/, 'phone'], [/^mailto:/, 'email'], [/^https?:\/\/(t|telegram)[.]me\b/, 'telegram'], [/^https?:\/\/(wa[.]me|api[.]whatsapp[.]com)\b/, 'whatsapp'], [/^https?:\/\/line[.]me\b/, 'line']];
document.addEventListener('click', (e) => {
  const el = e.target.closest('a[href], button[data-cta]');
  if (!el || el.closest('#consent')) return;
  const href = el.getAttribute('href') || '';
  const method = METHOD.find(([re]) => re.test(href))?.[1];
  if (method) { track('contact_click', { method, page: location.pathname, lang }); return; }
  if (el.matches('.cta, .btn, [data-cta]') && el.type !== 'submit') track('cta_click', { page: location.pathname, lang, cta: el.dataset.cta || el.textContent.trim().slice(0, 40) });
}, true);
window.addEventListener('qilich:lead', (e) => track('generate_lead', { form: e.detail?.form || 'contact', page: location.pathname, lang }));

// the banner
const banner = document.getElementById('consent');
const choice = read();
if (choice === 'granted') load();
else if (choice !== 'denied' && banner) {
  const pad = html.hasAttribute('data-page'); // the generated pages; the landing's scroll length is the film's
  const show = () => {
    if (!banner.hidden) return;
    banner.hidden = false;
    requestAnimationFrame(() => {
      banner.classList.add('on');
      if (pad) { html.style.setProperty('--consent-h', `${banner.offsetHeight + 32}px`); html.classList.add('consent-pad'); }
    });
  };
  const away = () => Math.min(160, window.innerHeight * 0.2);
  if (document.documentElement.scrollHeight > window.innerHeight + 40) {
    const onScroll = () => { if (window.scrollY > away()) { removeEventListener('scroll', onScroll); show(); } };
    addEventListener('scroll', onScroll, { passive: true });
  } else setTimeout(show, 4000);
  banner.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-consent]');
    if (!b) return;
    write(b.dataset.consent);
    if (b.dataset.consent === 'granted') load();
    banner.classList.remove('on');
    html.classList.remove('consent-pad');
    setTimeout(() => { banner.hidden = true; }, 460);
  });
}
