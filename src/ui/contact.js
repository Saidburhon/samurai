// Copy buttons beside the phone number and the email; the toast text comes from the page (#strings).
import { toast } from './toast.js';

export function initContact() {
  const said = document.querySelector('#strings [data-k=copied]')?.textContent || '';
  document.addEventListener('click', async (e) => {
    const b = e.target.closest('button.copy');
    if (!b) return;
    const text = b.getAttribute('data-copy');
    let ok = false;
    try { await navigator.clipboard.writeText(text); ok = true; } catch (err) {
      const t = document.createElement('textarea'); t.value = text; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select();
      try { ok = document.execCommand('copy'); } catch (e2) { ok = false; }
      t.remove();
    }
    if (ok) toast(`${said} · ${text}`);
  });
}
