// POST /api/lead (SOLUTIONS-SPEC §6): a visitor sends their estimate (or the contact form) to Qilich. Nothing is
// stored: the lead goes straight to the owner's Telegram chat through the bot when TELEGRAM_BOT_TOKEN and
// TELEGRAM_CHAT_ID are set (TG_BOT_TOKEN / TG_CHAT_ID are accepted too), otherwise the answer is 501 with the estimate's
// text for a prefilled e-mail (without the lead score, which only the owner's chat sees). The log says only "lead ok" or "lead fail <status>": never a name, a phone or a text.
import * as F from '../src/shared/format.js';
import { NOT_ALLOWED } from './copy-rules.js';

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const clean = (s, n) => [...String(s ?? '').normalize('NFC').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(NOT_ALLOWED.ja, '').replace(/\s+/g, ' ').trim()].slice(0, n).join('');
export const PHONE_UZ = /^\+998\d{9}$/;
const PHONE_INTL = /^\+[1-9]\d{7,14}$/;
const EMAIL = /^[^\s@<>]{1,64}@[^\s@<>]{1,190}\.[a-z]{2,}$/i;
const DAY = 864e5;
// the estimate link is the whole estimate (the hash holds it): never cut, so the owner can open it. Real links with
// four solutions run to 6–9 000 characters; past LINK_MAX it is dropped whole rather than broken.
const LINK = /^https:\/\/qilich\.com\/[^\s<>"]*$/;
const LINK_DEV = /^http:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?\/[^\s<>"]*$/; // only under wrangler dev
export const LINK_MAX = 12000;
const TG_MAX = 4096; // Telegram's limit for one message's text

/** §6 lead score: ≥ 4 ISSIQ, 2–3 ILIQ, otherwise SOVUQ, with the reasons in Uzbek. */
export function leadScore(b, { visits = 1, today = new Date().toISOString().slice(0, 10) } = {}) {
  let score = 0;
  const why = [];
  const min = Number(b?.totals?.usd?.[0]) || 0, budget = Number(b?.budget_usd) || 0;
  if (budget > 0 && min > 0 && budget >= min) { score += 2; why.push('byudjet smetaga mos'); }
  if (b?.deadline && /^\d{4}-\d{2}-\d{2}$/.test(b.deadline)) {
    const days = (Date.parse(`${b.deadline}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / DAY;
    if (days >= 0 && days <= 56) { score += 1; why.push('muddat 8 hafta ichida'); }
  }
  if (b?.size === 'medium' || b?.size === 'large') { score += 1; why.push(b.size === 'large' ? 'katta biznes' : 'oʻrta biznes'); }
  const n = (b?.solutions || []).filter((s) => s.state !== 'off').length;
  if (n >= 2) { score += 1; why.push(`${n} ta yechim`); }
  if (Number(visits) >= 2) { score += 1; why.push('qayta tashrif'); }
  return { level: score >= 4 ? 'ISSIQ' : score >= 2 ? 'ILIQ' : 'SOVUQ', score, why };
}

const STATE = { mvp: 'MVP', full: 'Toʻliq', off: 'keyinroq' };
const host = (u) => { try { return new URL(u).hostname; } catch { return ''; } };

/** Validates the body: { lead } with clean fields, or { error }. dev: wrangler dev (a local estimate link is kept). */
export function parseLead(body, { dev = false } = {}) {
  if (!body || typeof body !== 'object') return { error: 'bad_input' };
  const lang = ['uz', 'ru', 'en', 'ja'].includes(body.lang) ? body.lang : 'uz';
  const name = clean(body.name, 60);
  const raw = clean(body.phone || body.contact || '', 120);
  const phoneDigits = raw.replace(/[^\d+]/g, '').replace(/^00/, '+');
  // an Uzbek number is +998 and exactly nine digits, whatever the page; another country's number only where the page
  // takes one: the Japanese lead sheet and the contact form's free "contact" field (never the uz/ru/en lead sheet)
  const uzbek = !raw.includes('@') && /^\+?998/.test(phoneDigits);
  const intlOk = !uzbek && PHONE_INTL.test(phoneDigits) && (lang === 'ja' || !body.phone);
  const phone = PHONE_UZ.test(phoneDigits) || intlOk ? phoneDigits : '';
  const email = !phone && EMAIL.test(raw) ? raw : EMAIL.test(clean(body.email, 120)) ? clean(body.email, 120) : '';
  if (!name) return { error: 'name' };
  if (!phone && !email) return { error: 'phone' };
  if (body.phone && !phone) return { error: 'phone' };
  if (uzbek && !phone) return { error: 'phone' };
  const b = body.brief && typeof body.brief === 'object' ? body.brief : null;
  const brief = b ? {
    brief_no: clean(b.brief_no, 24), summary: clean(b.summary, 300), size: clean(b.size, 12),
    solutions: (Array.isArray(b.solutions) ? b.solutions : []).slice(0, 6).map((s) => ({ title: clean(s?.title, 80), state: ['mvp', 'full', 'off'].includes(s?.state) ? s.state : 'mvp', weeks: (s?.weeks || []).slice(0, 2).map(Number), uzs: (s?.uzs || []).slice(0, 2).map(Number) })),
    totals: b.totals ? { usd: (b.totals.usd || []).slice(0, 2).map(Number), uzs: (b.totals.uzs || []).slice(0, 2).map(Number), weeks: (b.totals.weeks || []).slice(0, 2).map(Number) } : null,
    budget_usd: Number(b.budget_usd) || 0, budget_uzs: Number(b.budget_uzs) || 0, deadline: /^\d{4}-\d{2}-\d{2}$/.test(b.deadline || '') ? b.deadline : '',
    answers: (Array.isArray(b.answers) ? b.answers : []).slice(0, 6).map((a) => `${clean(a?.q, 70)}: ${clean(a?.a, 30)}`),
    text: clean(b.text, 1500), link: (LINK.test(String(b.link || '')) || (dev && LINK_DEV.test(String(b.link || '')))) && String(b.link).length <= LINK_MAX ? String(b.link) : '',
    source: ['samurai', 'basket'].includes(b.source) ? b.source : 'samurai',
  } : null;
  return {
    lead: {
      lang, name, phone, email, slot: clean(body.slot, 60), company: clean(body.company, 80), message: clean(body.text || body.message, 1500),
      page: clean(body.page, 120), referrer: host(body.referrer), utm: clean([body.utm?.source, body.utm?.campaign].filter(Boolean).join('/'), 80),
      visits: Number(body.visits) || 1, brief,
    },
  };
}

/**
 * The message, in Uzbek: { head, link, plain, html, level }. head is everything but the link, fitted to one Telegram
 * message by shortening the visitor's own text first (never a number, the contact or the link); link is the estimate
 * link, whole; plain is head and link together for the e-mail fallback; html is head as escaped Telegram HTML.
 */
export function leadText(l, today) {
  const b = l.brief;
  const lines = [];
  const sc = b ? leadScore(b, { visits: l.visits, today }) : null;
  lines.push(b ? `${sc.level} · Smeta ${b.brief_no || '—'}` : 'Aloqa shakli');
  if (sc?.why.length) lines.push(`Sabab: ${sc.why.join('; ')}`);
  lines.push([`Ism: ${l.name}`, l.phone && `Tel: ${l.phone}`, l.email && `Pochta: ${l.email}`, l.slot && `Qulay vaqt: ${l.slot}`].filter(Boolean).join('   '));
  if (l.company) lines.push(`Kompaniya: ${l.company}`);
  lines.push(`Til: ${l.lang} · Sahifa: ${l.page || '—'}${l.referrer || l.utm ? ` · Manba: ${[l.referrer, l.utm].filter(Boolean).join(' ')}` : ''}`);
  let said = '';
  if (b) {
    if (b.summary) lines.push(`Biznes: ${b.summary}`);
    b.solutions.forEach((s, i) => lines.push(`${i + 1}. ${s.title} · ${STATE[s.state]}${s.weeks.length === 2 ? ` · ${F.weeks(s.weeks, 'uz')}` : ''}${s.uzs.length === 2 ? ` · ${F.uzs(s.uzs, 'uz')}` : ''}`));
    if (b.totals?.uzs?.length === 2) lines.push(`Jami: ${F.uzs(b.totals.uzs, 'uz')}${b.totals.weeks?.length === 2 ? ` · ${F.weeks(b.totals.weeks, 'uz')}` : ''}`);
    const extra = [b.budget_uzs ? `Byudjet: ${F.uzs([b.budget_uzs, b.budget_uzs], 'uz')}` : b.budget_usd ? `Byudjet: ${F.usd([b.budget_usd, b.budget_usd], 'uz')}` : '', b.deadline ? `Muddat: ${F.dateNum(b.deadline, 'uz')}` : '', b.answers.length ? `Javoblar: ${b.answers.join('; ')}` : ''].filter(Boolean);
    if (extra.length) lines.push(extra.join(' · '));
    said = b.text ? 'Matn' : '';
  } else if (l.message) said = 'Xabar';
  const words = b ? b.text : l.message;
  const link = b?.link || '';
  // the visitor's words give way first: the head (with them) fits one message in its escaped HTML form
  const fit = (text) => [...lines, ...(said && text ? [`${said}: «${text}»`] : [])].join('\n');
  let head = fit(words);
  const LIMIT = TG_MAX - 16;
  if (esc(head).length > LIMIT) {
    const chars = [...(words || '')];
    let n = chars.length;
    while (n > 0 && esc(fit(`${chars.slice(0, n).join('')}…`)).length > LIMIT) n = Math.floor(n * 0.9);
    head = n > 0 ? fit(`${chars.slice(0, n).join('')}…`) : fit('');
    // never reached with the parser's caps (six solutions, 300-character summary); a last guard all the same
    if (esc(head).length > LIMIT) head = [...head].slice(0, LIMIT - 600).join('');
  }
  const plain = link ? `${head}\nSmeta: ${link}` : head;
  // what the visitor's own e-mail carries when there is no bot: the estimate and their words, never Qilich's lead
  // score, its reasons or the source line (those are for the owner's chat only)
  const internal = new Set([lines[0], sc?.why.length ? lines[1] : null, lines.find((x) => x.startsWith('Til: '))]);
  const visitor = [...(b ? [`Smeta ${b.brief_no || '—'}`] : []), ...head.split('\n').filter((x) => !internal.has(x)), ...(link ? [link] : [])].join('\n');
  return { head, link, plain, visitor, html: esc(head), level: sc?.level || null };
}

/**
 * To Telegram: the message, then the link. A link that fits one message (with its label) follows as its own message,
 * so it is never cut; a longer one goes as a small HTML file the owner taps to open the estimate.
 */
export async function sendLead(env, lead, today, fetcher = fetch) {
  const token = env.TELEGRAM_BOT_TOKEN || env.TG_BOT_TOKEN, chat = env.TELEGRAM_CHAT_ID || env.TG_CHAT_ID;
  const msg = leadText(lead, today);
  const subject = lead.brief?.brief_no ? `Smeta ${lead.brief.brief_no}` : 'Qilich: soʻrov';
  if (!token || !chat) return { status: 501, body: { ok: false, fallback: 'mailto', subject, text: msg.visitor } };
  const api = (method, init) => fetcher(`https://api.telegram.org/bot${token}/${method}`, { method: 'POST', signal: AbortSignal.timeout(8000), ...init });
  const json = (o) => ({ headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(o) });
  try {
    const r = await api('sendMessage', json({ chat_id: chat, text: msg.html, parse_mode: 'HTML', link_preview_options: { is_disabled: true } }));
    const j = await r.json().catch(() => ({}));
    if (!(r.ok && j.ok)) { console.log(`lead fail ${r.status}`); return { status: 501, body: { ok: false, fallback: 'mailto', subject, text: msg.visitor } }; }
    if (msg.link) {
      const label = `Smeta ${lead.brief?.brief_no || ''}: `;
      let r2;
      if (label.length + msg.link.length <= TG_MAX) {
        r2 = await api('sendMessage', json({ chat_id: chat, text: label + msg.link, reply_parameters: { message_id: j.result?.message_id, allow_sending_without_reply: true }, link_preview_options: { is_disabled: true } }));
      } else {
        const page = `<!doctype html><meta charset="utf-8"><title>${esc(subject)}</title><meta http-equiv="refresh" content="0;url=${esc(msg.link)}"><a href="${esc(msg.link)}">${esc(subject)}</a>`;
        const form = new FormData();
        form.append('chat_id', String(chat));
        form.append('caption', label.trim());
        if (j.result?.message_id) form.append('reply_parameters', JSON.stringify({ message_id: j.result.message_id, allow_sending_without_reply: true }));
        form.append('document', new Blob([page], { type: 'text/html' }), `smeta-${(lead.brief?.brief_no || 'qilich').replace(/[^\w-]/g, '')}.html`);
        r2 = await api('sendDocument', { body: form });
      }
      if (!r2.ok) console.log(`lead link fail ${r2.status}`);
    }
    console.log('lead ok');
    return { status: 200, body: { ok: true, via: 'telegram', brief_no: lead.brief?.brief_no || null } };
  } catch { console.log('lead fail network'); }
  return { status: 501, body: { ok: false, fallback: 'mailto', subject, text: msg.visitor } };
}
