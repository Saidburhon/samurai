// The sound toggle (§5.7, §7.3): off by default. Turning it on creates and resumes the AudioContext inside the click
// (a user gesture) and answers with a soft chin. Remembered as on (localStorage), nothing plays until the first
// gesture of the visit resumes the context.
import { setAudio, sfx } from '../audio/audio.js';

const KEY = 'qilich.sound';
export function initSound() {
  const btns = [...document.querySelectorAll('button.sound')];
  let on = false;
  try { on = localStorage.getItem(KEY) === '1'; } catch (e) { on = false; }
  const Q = window.__qilich || (window.__qilich = {});
  const show = (v) => { for (const b of btns) b.setAttribute('aria-pressed', String(v)); document.documentElement.classList.toggle('snd', v); Q.sound = v; };
  const set = (v) => {
    on = v;
    show(v);
    try { localStorage.setItem(KEY, v ? '1' : '0'); } catch (e) { /* private mode */ }
    setAudio(v);
    if (v) sfx('chin');
  };
  show(on);
  if (on) {
    // remembered as on: the first gesture of the visit resumes the context (never before)
    const arm = () => { removeEventListener('pointerdown', arm, true); removeEventListener('keydown', arm, true); if (on) setAudio(true); };
    addEventListener('pointerdown', arm, true); addEventListener('keydown', arm, true);
  }
  for (const b of btns) b.addEventListener('click', () => set(!on));
}
