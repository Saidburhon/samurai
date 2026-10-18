/* Qilich — language switcher. The page ships in Uzbek; English and Russian live here. */
(() => {
  'use strict';

  // English and Russian for every [data-i18n] (innerHTML), [data-i18n-ph] (placeholder) and [data-i18n-label] (aria-label).
  // Uzbek is read from the page itself on load, so the HTML stays the single source for it.
  const EN = {
    "meta.title": "Qilich — Japanese IT agency in Uzbekistan",
    "nav.home": "Qilich — home",
    "nav.label": "Sections",
    "nav.work": "Work",
    "nav.way": "Process",
    "nav.contact": "Contact",
    "nav.posters": "Posters",
    "nav.sound": "Sound",

    "hero.h": '<span class="ln"><span>A Japanese IT agency,</span></span> <span class="ln"><span>now in <em>Uzbekistan!</em></span></span>',
    "hero.down": "Go to projects",

    "ch.h": "First, we built <br>for ourselves.",
    "ch.sub": "Now — for you.",
    "ch.hg": "Screen time",
    "ch.pt": "Pool halls",

    "hg.h": "Kids’ phones. <br>Parents’ rules.",
    "hg.aka": "Known as Tikoncha in Uzbekistan",
    "hg.dial": "Daily schedule",
    "hg.poke": "Poke the hedgehog",
    "hg.replay": "Replay the day",
    "hg.sleep": "Sleep",
    "hg.sleepSub": "Phone locked",
    "hg.school": "School",
    "hg.schoolSub": "Study apps only",
    "hg.limit": "Limit",
    "hg.limitSub": "Games: 1 hour",
    "hg.free": "Free time",
    "hg.freeSub": "Everything open",
    "hg.f1": "Google Play installs",
    "hg.f2": "apps: child, parent, teacher",

    "pt.h": "Every minute <br>on the bill.",
    "pt.aka": "Known as ClubTime in Uzbekistan",
    "pt.today": "Today",
    "pt.f1": "languages",
    "pt.f2": "platforms",

    "mx.h": "One team. <br>Whole stack.",
    "mx.label": "Platforms",
    "mx.you": "Yours",
    "mx.web": "Web",

    "tk.h": "Tokyo standards. <br>Tashkent hours.",
    "tk.tokyo": "Tokyo · UTC+9",
    "tk.tash": "Tashkent · UTC+5",
    "tk.diff": "4 hours apart",
    "tk.t": "Tokyo",
    "tk.u": "Tashkent",
    "tk.both": "shared hours",

    "way.h": "Four strikes.",
    "way.1": "Plan",
    "way.2": "Design",
    "way.3": "Code",
    "way.4": "Support",

    "ct.h": "Got a project?",
    "ft.top": "Back to top ↑"
  };

  const RU = {
    "meta.title": "Qilich — японское IT-агентство в Узбекистане",
    "nav.home": "Qilich — главная",
    "nav.label": "Разделы",
    "nav.work": "Проекты",
    "nav.way": "Путь",
    "nav.contact": "Контакты",
    "nav.posters": "Постеры",
    "nav.sound": "Звук",

    "hero.h": '<span class="ln"><span>Японское IT-агентство</span></span> <span class="ln"><span>теперь в <em>Узбекистане!</em></span></span>',
    "hero.down": "К проектам",

    "ch.h": "Сначала мы построили <br>для себя.",
    "ch.sub": "Теперь — для вас.",
    "ch.hg": "Экранное время",
    "ch.pt": "Бильярдные клубы",

    "hg.h": "Телефон ребёнка. <br>Правила родителей.",
    "hg.aka": "В Узбекистане — Tikoncha",
    "hg.dial": "Распорядок дня",
    "hg.poke": "Ткнуть ёжика",
    "hg.replay": "Показать день заново",
    "hg.sleep": "Сон",
    "hg.sleepSub": "Телефон заблокирован",
    "hg.school": "Школа",
    "hg.schoolSub": "Только учебные приложения",
    "hg.limit": "Лимит",
    "hg.limitSub": "Игры: 1 час",
    "hg.free": "Свободно",
    "hg.freeSub": "Всё открыто",
    "hg.f1": "установок в Google Play",
    "hg.f2": "приложения: ребёнок, родитель, учитель",

    "pt.h": "Каждая минута — <br>в чеке.",
    "pt.aka": "В Узбекистане — ClubTime",
    "pt.today": "Сегодня",
    "pt.f1": "языков",
    "pt.f2": "платформы",

    "mx.h": "Одна команда. <br>Весь стек.",
    "mx.label": "Платформы",
    "mx.you": "Ваш",
    "mx.web": "Веб",

    "tk.h": "Стандарты Токио. <br>Время Ташкента.",
    "tk.tokyo": "Токио · UTC+9",
    "tk.tash": "Ташкент · UTC+5",
    "tk.diff": "Разница 4 часа",
    "tk.t": "Токио",
    "tk.u": "Ташкент",
    "tk.both": "общих часов",

    "way.h": "Четыре удара.",
    "way.1": "План",
    "way.2": "Дизайн",
    "way.3": "Код",
    "way.4": "Поддержка",

    "ct.h": "Есть проект?",
    "ft.top": "Наверх ↑"
  };

  const doc = document.documentElement;
  const KEY = 'qilich-lang';
  const store = {
    get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } },
    set(v) { try { localStorage.setItem(KEY, v); } catch (e) { /* private mode */ } }
  };
  const ATTRS = [['data-i18n-ph', 'placeholder'], ['data-i18n-label', 'aria-label']];
  const uz = { html: new Map(), attr: new Map(), title: '' };

  function capture() {
    uz.title = document.title;
    document.querySelectorAll('[data-i18n]').forEach(el => uz.html.set(el, el.innerHTML));
    ATTRS.forEach(([data, attr]) => document.querySelectorAll(`[${data}]`).forEach(el => uz.attr.set(el, el.getAttribute(attr))));
  }

  const DICTS = { en: EN, ru: RU };
  const LANGS = ['uz', 'ru', 'en'];

  function pick(key, fallback, lang) {
    const dict = DICTS[lang];
    if (!dict) return fallback;
    if (!(key in dict)) { console.warn(`[Qilich] Missing ${lang} text for "${key}"`); return fallback; }
    return dict[key];
  }

  function apply(lang, announce) {
    if (!LANGS.includes(lang)) lang = 'uz';
    doc.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const html = pick(el.dataset.i18n, uz.html.get(el), lang);
      if (html != null && el.innerHTML !== html) el.innerHTML = html;
    });
    ATTRS.forEach(([data, attr]) => document.querySelectorAll(`[${data}]`).forEach(el => {
      const v = pick(el.getAttribute(data), uz.attr.get(el), lang);
      if (v != null) el.setAttribute(attr, v);
    }));
    document.title = pick('meta.title', uz.title, lang);
    document.querySelectorAll('.lang [data-lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    // main.js and posters.js re-render what they draw themselves
    if (announce) document.dispatchEvent(new CustomEvent('qilich:lang', { detail: lang }));
  }

  document.addEventListener('DOMContentLoaded', () => {
    capture();
    const fromUrl = new URLSearchParams(location.search).get('lang');
    if (LANGS.includes(fromUrl)) store.set(fromUrl);
    // announce on load too: posters.js has already drawn its labels in Uzbek by now
    apply(fromUrl || store.get() || 'uz', true);
    document.querySelectorAll('.lang [data-lang]').forEach(b => b.addEventListener('click', () => {
      if (b.dataset.lang === doc.lang) return;
      store.set(b.dataset.lang);
      apply(b.dataset.lang, true);
    }));
  });
})();
