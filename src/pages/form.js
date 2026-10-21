// The contact form. Without JavaScript it is a plain mailto form (method post, text/plain): the visitor's mail app
// opens with the fields. With JavaScript it posts to /api/lead when the Worker has it (data-api="1", set from
// content/site.json lead.api), and otherwise opens a tidy prefilled email. Either way it announces generate_lead for
// the analytics (src/ui/analytics.js listens; nothing happens when analytics are off). Every message it shows is in
// the page (#strings), so the font subsets and the lint see it.
export function initForm() {
  const form = document.querySelector('form.lead');
  if (!form) return;
  const status = form.querySelector('.status');
  const say = (k) => { const s = document.querySelector(`#strings [data-k="${k}"]`); if (status && s) status.textContent = s.textContent; };
  const label = (name) => (form.querySelector(`label[for="${form.elements[name]?.id}"]`)?.firstChild?.textContent || name).trim();
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const data = Object.fromEntries([...new FormData(form)].map(([k, v]) => [k, String(v).trim()]));
    const lang = document.documentElement.lang;
    window.dispatchEvent(new CustomEvent('qilich:lead', { detail: { form: 'contact', lang } }));
    if (form.dataset.api === '1') {
      try {
        const r = await fetch('/api/lead', {
          method: 'POST', headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ lang, name: data.name, contact: data.contact, company: data.company, text: data.message, page: location.pathname, referrer: document.referrer }),
        });
        const j = r.ok ? await r.json().catch(() => ({})) : {};
        if (j.ok) { form.reset(); say('sentApi'); return; }
      } catch (err) { /* fall back to email */ }
    }
    const body = ['name', 'contact', 'company', 'message'].filter((k) => data[k]).map((k) => (k === 'message' ? `\n${data[k]}` : `${label(k)}: ${data[k]}`)).join('\n');
    const href = `mailto:${form.dataset.to}?subject=${encodeURIComponent(form.dataset.subject || '')}&body=${encodeURIComponent(body)}`;
    (window.__qilich || (window.__qilich = {})).lastMailto = href;
    say('sentMail');
    window.location.href = href;
  });
}
