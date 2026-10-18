/* Qilich — languages. Each language is its own page, so search engines index all three:
   Uzbek at /, Russian at /ru/, English at /en/ (built by scripts/build-langs.mjs).
   This only remembers the visitor's choice and honours old ?lang= links. */
(() => {
  'use strict';

  const KEY = 'qilich-lang';
  const PATH = { uz: '/', ru: '/ru/', en: '/en/' };
  const store = {
    get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } },
    set(v) { try { localStorage.setItem(KEY, v); } catch (e) { /* private mode */ } }
  };
  const cur = document.documentElement.lang;
  const go = lang => location.replace(PATH[lang] + location.hash);

  const asked = new URLSearchParams(location.search).get('lang');
  if (PATH[asked]) { store.set(asked); if (asked !== cur) { go(asked); return; } }

  // a returning visitor who picked another language lands on it, unless they just clicked across from our own page
  let internal = false;
  try { internal = !!document.referrer && new URL(document.referrer).host === location.host; } catch (e) { /* no referrer */ }
  const want = store.get();
  if (!asked && PATH[want] && want !== cur && !internal) { go(want); return; }

  document.addEventListener('click', e => {
    const a = e.target.closest && e.target.closest('.lang a[hreflang]');
    if (a) store.set(a.getAttribute('hreflang'));
  });
})();
