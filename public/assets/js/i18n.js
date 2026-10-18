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

    "hero.h": '<span class="ln"><span>A Japanese IT agency,</span></span> <span class="ln"><span>now in <em>Uzbekistan!</em></span></span>',
    "hero.slogan": "A Japanese IT agency, now in Uzbekistan!",
    "hero.stack": "iOS · Android · Web · Desktop · IoT",
    "hero.hint": "Slice with your cursor",
    "hero.hintTouch": "Slice with your finger",
    "hero.down": "Go to projects",

    "hg.tag": "Screen time · iOS &amp; Android",
    "hg.h": "Kids’ phones. <br>Parents’ rules.",
    "hg.aka": "Known as Tikoncha in Uzbekistan",
    "hg.sleep": "Sleep",
    "hg.sleepSub": "Phone locked",
    "hg.school": "School",
    "hg.schoolSub": "Study apps only",
    "hg.limit": "Limit",
    "hg.limitSub": "Games: 1 hour",
    "hg.free": "Free time",
    "hg.freeSub": "Everything open",
    "hg.drag": "Spin the day",
    "hg.f1": "Google Play installs",
    "hg.f2": "apps: child, parent, teacher",

    "pt.tag": "For pool halls",
    "pt.h": "Every minute <br>on the bill.",
    "pt.aka": "Known as ClubTime in Uzbekistan",
    "pt.plug": "Smart plugs",
    "pt.print": "Receipts",
    "pt.hint": "Tap a table",
    "pt.today": "Today",
    "pt.f1": "languages",
    "pt.f2": "platforms",

    "mx.h": "One team. <br>Whole stack.",
    "mx.label": "Platforms",
    "mx.you": "Yours",
    "mx.web": "Web",

    "tk.city": "Tashkent",
    "tk.h": "Tokyo standards. <br>Tashkent hours.",
    "tk.tokyo": "Tokyo · UTC+9",
    "tk.tash": "Tashkent · UTC+5",
    "tk.diff": "4 hours apart",

    "way.h": "Four strikes.",
    "way.1": "Plan",
    "way.2": "Design",
    "way.3": "Code",
    "way.4": "Support",

    "ct.h": "Got a project?",
    "ct.call": "Call",
    "ct.mail": "Write",
    "ft.top": "Back to top ↑"
  };

  const RU = {
    "meta.title": "Qilich — японское IT-агентство в Узбекистане",
    "nav.home": "Qilich — главная",
    "nav.label": "Разделы",
    "nav.work": "Проекты",
    "nav.way": "Путь",
    "nav.contact": "Контакты",

    "hero.h": '<span class="ln"><span>Японское IT-агентство</span></span> <span class="ln"><span>теперь в <em>Узбекистане!</em></span></span>',
    "hero.slogan": "Японское IT-агентство теперь в Узбекистане!",
    "hero.stack": "iOS · Android · Веб · Desktop · IoT",
    "hero.hint": "Режьте курсором",
    "hero.hintTouch": "Режьте пальцем",
    "hero.down": "К проектам",

    "hg.tag": "Экранное время · iOS и Android",
    "hg.h": "Телефон ребёнка. <br>Правила родителей.",
    "hg.aka": "В Узбекистане — Tikoncha",
    "hg.sleep": "Сон",
    "hg.sleepSub": "Телефон заблокирован",
    "hg.school": "Школа",
    "hg.schoolSub": "Только учебные приложения",
    "hg.limit": "Лимит",
    "hg.limitSub": "Игры: 1 час",
    "hg.free": "Свободно",
    "hg.freeSub": "Всё открыто",
    "hg.drag": "Покрутите день",
    "hg.f1": "установок в Google Play",
    "hg.f2": "приложения: ребёнок, родитель, учитель",

    "pt.tag": "Для бильярдных клубов",
    "pt.h": "Каждая минута — <br>в чеке.",
    "pt.aka": "В Узбекистане — ClubTime",
    "pt.plug": "Умные розетки",
    "pt.print": "Чеки",
    "pt.hint": "Нажмите на стол",
    "pt.today": "Сегодня",
    "pt.f1": "языков",
    "pt.f2": "платформы",

    "mx.h": "Одна команда. <br>Весь стек.",
    "mx.label": "Платформы",
    "mx.you": "Ваш",
    "mx.web": "Веб",

    "tk.city": "Ташкент",
    "tk.h": "Стандарты Токио. <br>Время Ташкента.",
    "tk.tokyo": "Токио · UTC+9",
    "tk.tash": "Ташкент · UTC+5",
    "tk.diff": "Разница 4 часа",

    "way.h": "Четыре удара.",
    "way.1": "План",
    "way.2": "Дизайн",
    "way.3": "Код",
    "way.4": "Поддержка",

    "ct.h": "Есть проект?",
    "ct.call": "Позвонить",
    "ct.mail": "Написать",
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
