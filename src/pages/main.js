// The bundle of the generated pages (about, contact, privacy, press, the solutions pages and the blog): the shared
// chrome (src/pages/chrome.js: menu, copy buttons, clocks, the bar's band, the paper) and the contact form.
// No WebGL, no GSAP, no Lenis: every word is already in the HTML, and the page works without this file.
import './chrome.js';
import { initForm } from './form.js';

initForm();
