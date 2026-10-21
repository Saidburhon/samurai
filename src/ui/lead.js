// The lead sheet (SOLUTIONS-SPEC §6): a <dialog> on deckle washi (bottom sheet on phones, right panel on desktop).
// Name, phone (+998 mask; any international number or an e-mail on the Japanese page), a call slot in Tashkent and
// Tokyo time, the brief preview, the consent line. POST /api/lead → Telegram; on 501 or a failure, a prefilled e-mail.
// Nothing is lost: the phone number is always on the sheet.
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// the call slots in Tashkent time (what the owner's Telegram message says) and their Tokyo twins
const SLOT_TAS = ['Bugun 14:00–18:00 (Toshkent)', 'Ertaga 09:00–12:00 (Toshkent)', 'Ertaga 14:00–18:00 (Toshkent)', 'Farqi yoʻq'];
const SLOT_OTHER = ['18:00–22:00', '13:00–16:00', '18:00–22:00', ''];
const SLOT_TAS_SHORT = ['14:00–18:00', '09:00–12:00', '14:00–18:00', ''];

// a torn-paper edge, the same for the same seed
function deckle(seed, side) {
  let a = seed >>> 0;
  const r = () => { a = (a * 1664525 + 1013904223) >>> 0; return a / 4294967296; };
  const pts = [];
  for (let i = 0; i <= 40; i++) { const t = (i / 40) * 100, j = (r() * 0.9 + (i % 3 === 0 ? 0.5 : 0)).toFixed(2); pts.push(side === 'top' ? `${t}% ${j}%` : `${j}% ${t}%`); }
  return side === 'top' ? `polygon(${pts.join(',')},100% 100%,0 100%)` : `polygon(${pts.join(',')},100% 100%,100% 0)`;
}
export function deckleFor(dialog, seed) {
  dialog.style.clipPath = deckle(seed, matchMedia('(max-width: 760px)').matches ? 'top' : 'left');
}

const digits = (s) => String(s).replace(/\D/g, '');
function maskUz(v) {
  let d = digits(v);
  if (d.startsWith('998')) d = d.slice(3);
  d = d.slice(0, 9);
  const g = [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean);
  return `+998${g.length ? ' ' + g.join(' ') : ' '}`;
}

/**
 * o: { S (page strings), lang, brief (the §6 brief), preview (HTML-safe lines), mailText (plain text for e-mail),
 *      phone, email, onDone }
 */
export function openLead(o) {
  const { S, lang } = o, L = S.ld, ja = lang === 'ja';
  const dlg = document.getElementById('lead-sheet');
  if (!dlg || dlg.open) return;
  const tel = o.phone.replace(/[^\d+]/g, '');
  dlg.innerHTML = `<button class="sheet-close" type="button" aria-label="${esc(S.close)}"><i></i></button>
    <h2 id="lead-h">${esc(L.h)}</h2>
    <div class="lead-prev">${o.preview.map(esc).join('<br>')}</div>
    <form class="lead-f" novalidate>
      <div class="fld"><label for="ld-name">${esc(L.name)}</label><input id="ld-name" name="name" autocomplete="name" maxlength="60" required></div>
      <div class="fld"><label for="ld-phone">${esc(L.phone)} <i>${esc(L.phoneHint)}</i></label><input id="ld-phone" name="phone" ${ja ? 'autocomplete="tel"' : 'inputmode="tel" autocomplete="tel" value="+998 "'} maxlength="${ja ? 80 : 17}" required></div>
      <fieldset class="slots"><legend>${esc(L.slot)}</legend>${L.slots.map((s, i) => `<label><input type="radio" name="slot" value="${i}"${i === 3 ? ' checked' : ''}><span>${esc(s)}</span>${(ja ? SLOT_TAS_SHORT : SLOT_OTHER)[i] ? `<small>${esc(L.tokyo)} ${esc((ja ? SLOT_TAS_SHORT : SLOT_OTHER)[i])}</small>` : ''}</label>`).join('')}</fieldset>
      <p class="fine">${esc(L.consent)}</p>
      <p class="err" role="alert"></p>
      <p class="send"><button class="btn" type="submit"><span>${esc(L.send)}</span><svg aria-hidden="true"><use href="#kissaki"/></svg></button></p>
    </form>`;
  deckleFor(dlg, 7 + (o.brief?.brief_no || '').length);
  const close = () => { dlg.close(); };
  dlg.querySelector('.sheet-close').onclick = close;
  dlg.addEventListener('close', () => document.documentElement.classList.remove('sheet-open'), { once: true });
  const form = dlg.querySelector('form'), err = dlg.querySelector('.err'), phoneIn = form.elements.phone;
  if (!ja) phoneIn.addEventListener('input', () => { phoneIn.value = maskUz(phoneIn.value); });
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = form.elements.name.value.trim();
    const raw = phoneIn.value.trim();
    const phone = ja ? raw : `+998${digits(raw).replace(/^998/, '')}`;
    if (!name) { err.textContent = L.noName; form.elements.name.focus(); return; }
    const okPhone = ja ? /^\+[1-9][\d\s-]{7,18}$/.test(raw) || /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(raw) : /^\+998\d{9}$/.test(phone);
    if (!okPhone) { err.textContent = L.badPhone; phoneIn.focus(); return; }
    err.textContent = '';
    const btn = form.querySelector('button[type=submit]');
    btn.disabled = true; btn.querySelector('span').textContent = L.sending;
    const slot = Number(form.elements.slot.value);
    const visits = Number((() => { try { return localStorage.getItem('qilich.visits'); } catch { return 1; } })()) || 1;
    const qs = new URLSearchParams(location.search);
    const body = { lang, name, ...(ja && raw.includes('@') ? { contact: raw } : { phone: ja ? raw.replace(/[\s-]/g, '') : phone }), slot: SLOT_TAS[slot], brief: o.brief, page: location.pathname, referrer: document.referrer, utm: { source: qs.get('utm_source') || '', campaign: qs.get('utm_campaign') || '' }, visits };
    window.dispatchEvent(new CustomEvent('qilich:lead', { detail: { form: 'samurai', lang } }));
    let j = null, status = 0;
    try { const r = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); status = r.status; j = await r.json().catch(() => null); } catch { status = 0; }
    if (status === 400 && j?.error === 'phone') { err.textContent = L.badPhone; btn.disabled = false; btn.querySelector('span').textContent = L.send; return; }
    const no = o.brief?.brief_no || '';
    if (j?.ok) {
      form.outerHTML = `<div class="lead-done"><p>${esc(L.ok.replace('{no}', no))}</p><p>${esc(L.urgent)}</p></div>`;
      o.onDone?.('telegram');
      return;
    }
    // no bot (501), a refusal (429) or no network: the estimate as a prefilled e-mail in the page's language (never the
    // server's text, which is the owner's Uzbek note), and the phone
    const href = `mailto:${o.email}?subject=${encodeURIComponent(`${S.res} ${no}`)}&body=${encodeURIComponent(`${o.mailText}\n\n${name} · ${body.phone || body.contact}`)}`;
    (window.__qilich || (window.__qilich = {})).lastMailto = href;
    form.outerHTML = `<div class="lead-done"><p><a class="btn" href="${esc(href)}"><span>${esc(L.mail)}</span></a></p><p>${esc(L.mailNote)}</p><p><a href="tel:${esc(tel)}">${esc(o.phone)}</a></p></div>`;
    o.onDone?.('mailto');
    try { location.href = href; } catch { /* the button stays */ }
  });
  document.documentElement.classList.add('sheet-open');
  dlg.showModal();
  form.elements.name.focus();
}
