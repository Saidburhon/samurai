// The bundle of the Solutions pages (catalogue, group, solution and price pages): the shared page chrome, the
// register (rows that fold open, lens, two-script search, sort) and the brief basket. Every word and figure is in
// the HTML already; without this file the rows still open (<details>) and every link works.
import '../pages/chrome.js';
import { initRegister } from './register.js';
import { initBasket } from './basket.js';

let cfg = {};
try { cfg = JSON.parse(document.getElementById('sol-data')?.textContent || '{}'); } catch { /* no data: the page stays static */ }
initRegister(cfg);
initBasket(cfg);
