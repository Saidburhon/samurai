// The company pages (about, contact, privacy, press) rendered from scripts/pages/copy-company.mjs and the facts in
// content/site.json. A fact that is empty in site.json is not shown, and a section that would hold nothing is dropped.
import { PAGES } from './copy-company.mjs';
import { t, links } from './chrome.mjs';
import { site, has, esc, html, telHref, nbspPhone, HOME } from '../site.mjs';

const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return u; } };
const fmtDate = (lang, iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  if (lang === 'ja') return `${y}年${m}月${d}日`;
  if (lang === 'en') return `${d} ${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][m - 1]} ${y}`;
  return `${String(d).padStart(2, '0')}.${String(m).padStart(2, '0')}.${y}`;
};
const analyticsOn = () => has(site.analytics.ga4) || has(site.analytics.yandexMetrika);
// a privacy string may be { on, off }
const pick = (v) => (v && typeof v === 'object' && 'on' in v ? (analyticsOn() ? v.on : v.off) : v);

// the facts table: rows with an empty value are left out
function facts(lang, set) {
  const L = (k) => t(lang, k);
  const langs = site.contact.availableLanguage.map((l) => L('langNames')[l]).join(L('listSep'));
  const a = site.address, j = site.japan;
  const street = [a.streetAddress, a.postalCode].filter(has).join(', ');
  const japan = has(j.legalName) ? [j.legalName, [j.streetAddress, j.locality, j.postalCode].filter(has).join(', '), has(j.telephone) ? `<a href="${telHref(j.telephone)}">${nbspPhone(j.telephone)}</a>` : ''].filter(has).join('<br>') : '';
  const clock = `${L('tz')}<span class="live" hidden> · ${L('now')} <time class="t-tas">00:00</time></span>`;
  const rows = {
    name: [L('fName'), site.brand + (lang === 'ja' && has(site.brandKana) ? `（${site.brandKana}）` : '')],
    legal: [L('fLegal'), site.legalName],
    founded: [L('fFounded'), site.foundingDate],
    services: [L('fServices'), L('services').map((x, i) => (i && /^\p{Lu}\p{Ll}+(\s|-|$)/u.test(x) && !/^(Telegram|Android)/.test(x) ? x[0].toLowerCase() + x.slice(1) : x)).join(L('listSep'))],
    city: [L('fCity'), L('city')],
    address: [L('fAddress'), street ? `${street}, ${L('city')}` : ''],
    tz: [L('fTz'), clock],
    hours: [L('fHours'), site.contact.hours],
    rep: [L('fRep'), site.representative],
    langs: [L('fLangs'), langs],
    phone: [L('fPhone'), `<a href="${telHref(site.telephone)}">${nbspPhone(site.telephone)}</a>`],
    email: [L('fEmail'), `<a href="mailto:${site.email}">${site.email}</a>`],
    web: [L('fWeb'), `<a href="${HOME[lang]}">qilich.com</a>`],
    japan: [L('fJapan'), japan],
    certs: [L('fCerts'), (site.certifications || []).map((c) => (typeof c === 'string' ? esc(c) : c.url ? `<a href="${esc(c.url)}">${esc(c.name)}</a>` : esc(c.name))).join(L('listSep'))],
    profiles: [L('fProfiles'), (site.sameAs || []).map((u) => `<a href="${esc(u)}" rel="me">${esc(host(u))}</a>`).join(L('listSep'))],
  };
  const SETS = {
    about: ['name', 'legal', 'founded', 'rep', 'city', 'address', 'tz', 'langs', 'phone', 'email', 'web', 'japan', 'certs', 'profiles'],
    press: ['name', 'legal', 'founded', 'services', 'city', 'tz', 'langs', 'web', 'email', 'phone', 'japan', 'profiles'],
    contact: ['city', 'address', 'tz', 'hours', 'langs', 'japan'],
  };
  const out = SETS[set].map((k) => rows[k]).filter(([, v]) => has(v)).map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`);
  return `<dl class="facts">${out.join('')}</dl>`;
}

function people(lang) {
  if (!has(site.people)) return '';
  const L = (k) => t(lang, k);
  const li = site.people.map((p) => {
    const img = has(p.photo) ? `<img src="${esc(p.photo)}" width="160" height="200" alt="${esc(p.name)}" loading="lazy" decoding="async">` : '';
    const role = has(p.role) ? `<p class="role mono">${esc(p.role[lang] || p.role.en)}</p>` : '';
    const bio = has(p.bio) ? `<p>${esc(p.bio[lang] || p.bio.en)}</p>` : '';
    const prof = has(p.sameAs) ? `<p class="mono">${p.sameAs.map((u) => `<a href="${esc(u)}">${esc(host(u))}</a>`).join(' ')}</p>` : '';
    return `<li>${img}<div><h3>${esc(p.name)}</h3>${role}${bio}${prof}</div></li>`;
  });
  return section('jamoa', L('team'), `<ul class="people">${li.join('')}</ul>`);
}

const section = (id, h2, inner) => `  <section class="row" id="${id}" aria-labelledby="h-${id}"><h2 id="h-${id}">${h2}</h2><div class="row-body">${inner}</div></section>`;
// {legal} {street} {rep}: the legal name, street address and representative from content/site.json, or nothing
const REP = { uz: ', rahbar: ', ru: ', руководитель: ', en: ', represented by ', ja: '代表者：' };
const tokens = (lang, s) => s
  .replace('{legal}', has(site.legalName) ? (lang === 'ja' ? `（${esc(site.legalName)}）` : ` (${esc(site.legalName)})`) : '')
  .replace('{street}', has(site.address.streetAddress) ? (lang === 'ja' ? ` ${esc(site.address.streetAddress)}` : `, ${esc(site.address.streetAddress)}`) : '')
  .replace('{rep}', has(site.representative) ? REP[lang] + esc(site.representative) : '');
const paras = (lang, ps = []) => ps.map((x) => links(lang, tokens(lang, html(pick(x))))).filter((x) => x.trim()).map((x) => `<p>${x}</p>`).join('');

function sections(lang, copy, def) {
  const L = (k) => t(lang, k);
  return copy.sections.map((s) => {
    let inner = '';
    if (s.quote) inner = `<p class="quote">${esc(site.description[lang]).replace(/&amp;nbsp;/g, '&nbsp;')}</p>`;
    if (s.ol) inner += `<ol class="steps">${s.ol.map((x) => `<li>${links(lang, html(pick(x)))}</li>`).join('')}</ol>`;
    if (s.ul) inner += `<ul class="list">${s.ul.map((x) => `<li>${links(lang, html(pick(x)))}</li>`).join('')}</ul>`;
    if (s.services) inner += `<ul class="svc-list">${L('services').map((x) => `<li>${x}</li>`).join('')}</ul>`;
    if (s.facts) inner += facts(lang, s.facts);
    if (s.logo) inner += `<figure class="logo"><img src="/assets/img/logo-512.png" width="512" height="512" alt="${esc(L('logoAlt'))}" loading="lazy" decoding="async"><figcaption class="mono"><a href="/assets/img/logo-512.png" download="qilich-logo-512.png">${L('logoPng')}</a> <a href="/assets/img/favicon.svg" download="qilich-logo.svg">${L('logoSvg')}</a></figcaption></figure>`;
    inner += paras(lang, s.p);
    const out = section(s.id, s.h2, inner);
    // the team follows the facts on the about and press pages, when content/site.json lists people
    return def.people && s.facts ? out + '\n' + people(lang) : out;
  }).join('\n');
}

function contactBody(lang, copy) {
  const L = (k) => t(lang, k);
  const privacy = links(lang, '{privacy}');
  const api = site.lead.api ? '1' : '0';
  const subject = L('fmSubject');
  const block = `  <address class="contact">
    <span class="c-row"><a class="tel" href="${telHref(site.telephone)}">${nbspPhone(site.telephone).replace(/^(\S+\u00a0\S+)\u00a0/, '$1 ')}</a><button class="copy" type="button" data-copy="${esc(site.telephone)}" aria-label="${esc(L('copy'))}"><svg aria-hidden="true"><use href="#i-copy"/></svg></button></span>
    <span class="c-row"><a class="mail" href="mailto:${site.email}">${site.email}</a><button class="copy" type="button" data-copy="${site.email}" aria-label="${esc(L('copy'))}"><svg aria-hidden="true"><use href="#i-copy"/></svg></button></span>${copy.telNote ? `\n    <span class="c-note">${copy.telNote}</span>` : ''}
  </address>`;
  const opt = `<i>${L('fmOptional')}</i>`;
  const form = `<form class="lead" action="mailto:${site.email}?subject=${encodeURIComponent(subject)}" method="post" enctype="text/plain" data-api="${api}" data-to="${site.email}" data-subject="${esc(subject)}">
      <p class="fld"><label for="f-name">${L('fmName')}</label><input id="f-name" name="name" type="text" autocomplete="name" required maxlength="80"></p>
      <p class="fld"><label for="f-contact">${L('fmContact')}</label><input id="f-contact" name="contact" type="text" autocomplete="email" required maxlength="120"></p>
      <p class="fld"><label for="f-company">${L('fmCompany')} ${opt}</label><input id="f-company" name="company" type="text" autocomplete="organization" maxlength="120"></p>
      <p class="fld wide"><label for="f-message">${L('fmMessage')} ${opt}</label><textarea id="f-message" name="message" rows="4" maxlength="1500"></textarea></p>
      <p class="send"><button class="btn" type="submit" data-cta="contact-form"><span>${L('fmSend')}</span><svg aria-hidden="true"><use href="#kissaki"/></svg></button></p>
      <p class="agree"><input id="f-agree" name="agree" type="checkbox" value="yes" required><label for="f-agree">${L('fmAgree').replace('{privacy}', privacy)}</label></p>
      <p class="fine">${L('fmConsent')}</p>
      <p class="fine${site.lead.api ? ' nojs-only' : ''}">${L('fmNoJs')}</p>
      <p class="status" role="status" aria-live="polite"></p>
    </form>`;
  return [
    block,
    `  <figure class="plate p-kissaki" aria-hidden="true">{plate:kissaki}</figure>`,
    section('shakl', copy.formH, form),
    section('joy', copy.factsH, facts(lang, 'contact') + `<p>${links(lang, html(copy.after))}</p>`),
  ].join('\n');
}

// returns { main, strings } for the chrome
export function renderCompany(slug, lang) {
  const def = PAGES[slug], copy = def[lang];
  const headBlock = `  <div class="pg-head">
    <h1>${html(copy.h1)}</h1>
    <p class="lede">${links(lang, html(copy.lede))}</p>${def.effective ? `\n    <p class="meta mono">${t(lang, 'updated')} <time datetime="${def.effective}">${fmtDate(lang, def.effective)}</time></p>` : ''}
  </div>`;
  const plate = def.plate && def.plate !== 'kissaki' && def.plate !== 'mon' ? `  <figure class="plate p-${def.plate}" aria-hidden="true">{plate:${def.plate}}</figure>` : '';
  const body = slug === 'contact' ? contactBody(lang, copy) : sections(lang, copy, def);
  const review = def.review ? `  <!-- REVIEW (${def.review}): written in plain terms from what the site does; not yet reviewed by a lawyer. Check against Uzbekistan's Law ZRU-547 (incl. the 2021 data-localisation rule, Art. 27-1) and Japan's APPI (Art. 28, information to give before a transfer abroad). -->\n` : '';
  const strings = slug === 'contact'
    ? `<span data-k="sentMail">${t(lang, 'fmSentMail')}</span><span data-k="sentApi">${t(lang, 'fmSentApi')}</span><span data-k="error">${t(lang, 'fmError')}</span>`
    : '';
  return { main: [review + headBlock, plate, body].filter(Boolean).join('\n'), strings, copy, def };
}

export { PAGES };
