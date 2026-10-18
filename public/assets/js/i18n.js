/* Qilich — language switcher. The page ships in Uzbek; English lives here. */
(() => {
  'use strict';

  // English for every [data-i18n] (innerHTML), [data-i18n-ph] (placeholder) and [data-i18n-label] (aria-label).
  // Uzbek is read from the page itself on load, so the HTML stays the single source for it.
  const EN = {
    "meta.title": "Qilich — IT Solutions Agency",
    "pl.label": "Sharpening the blade",
    "pl.meta": "IT Solutions — Uzbekistan",
    "nav.home": "Qilich — home",
    "nav.work": "Work",
    "nav.way": "The Way",
    "cta.start": "Start a project",
    "nav.contact": "Contact",
    "hero.slogan": "A Japanese IT agency, now in Uzbekistan!",
    "hero.l1": "We cut through",
    "hero.l2": "the <em>impossible.</em>",
    "hero.sub": "<b>Qilich</b> means “sword” in Uzbek. We bring a samurai's discipline to software other teams walk away from: mobile apps that reach into the operating system itself, club systems wired to real hardware, café apps people actually love, and platforms for companies that can't afford to fail.",
    "cta.demos": "Play with the demos",
    "hero.hint": "Move your cursor to draw the blade",
    "hero.hintTouch": "Swipe sideways to slash",
    "stat.1": "operating systems controlled at system level: iOS &amp; Android",
    "stat.2": "apps shipped as one ecosystem in Tikoncha",
    "stat.3": "tables per club, run from one ClubTime screen",
    "stat.4": "team from first sketch to App Store and beyond",
    "mq.label": "What we build",
    "mq.red": "<span>Android</span><i>斬</i><span>iOS</span><i>斬</i><span>Screen Time APIs</span><i>斬</i><span>Web platforms</span><i>斬</i><span>Telegram bots</span><i>斬</i><span>IoT &amp; hardware</span><i>斬</i><span>Café apps</span><i>斬</i>",
    "mq.dark": "<span>Admin panels</span><i>✦</i><span>AI integrations</span><i>✦</i><span>Desktop software</span><i>✦</i><span>Payments</span><i>✦</i><span>Landing pages</span><i>✦</i><span>Enterprise systems</span><i>✦</i><span>Dashboards</span><i>✦</i>",
    "work.eye": "Battle record",
    "work.h": "Forged in the field.",
    "work.lead": "Real products with real constraints: operating-system limits, physical hardware, money on the table. These are the battles behind the blade, and you can play with both of them below.",
    "tk.tags": "<li>EdTech</li><li>Parental control</li><li>iOS &amp; Android</li>",
    "tk.lead": "Screen-time management is not beginner territory. Tikoncha reaches into the operating system itself, on Android <em>and</em> iOS, to keep students focused in class, and puts parents and teachers in control.",
    "tk.m1": "Default",
    "tk.m1d": "Quiet tracking: usage stats and daily reports for parents.",
    "tk.m2d": "Smart policies that switch on inside the school geofence.",
    "tk.m3d": "Shield mode: OS-level blocking that can't be uninstalled or bypassed.",
    "tk.note": "Qalqon unlocks only by timer, secret code, text challenge or parent approval.",
    "tk.eco": "One ecosystem, five products",
    "tk.ecoList": "<li>Student app <small>Android &amp; iOS</small></li><li>Parent app + Telegram bot</li><li>Teacher app <small>&amp; web</small></li><li>School admin panel</li><li>Superadmin</li>",
    "tk.platform": "Platform",
    "tk.school": "At school",
    "tk.today": "screen time today",
    "app.games": "Games",
    "app.videos": "Videos",
    "app.social": "Social",
    "app.ebooks": "E-books",
    "app.math": "Math",
    "app.dictionary": "Dictionary",
    "app.maps": "Maps",
    "tk.week": "This week",
    "tk.days": "<span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span>",
    "tk.shieldT": "Qalqon is on",
    "tk.blocked": "is blocked until <b>14:00</b>. Lessons first.",
    "tk.back": "Back to lessons",
    "tk.other": "Other ways out: timer · secret code · text challenge",
    "tk.mode": "Mode",
    "tk.hint": "Pick a mode, then try to open <b>Reels</b>.",
    "ct.tags": "<li>Desktop</li><li>IoT</li><li>Telegram</li><li>Hospitality</li>",
    "ct.lead": "An operating system for billiard and table-tennis clubs. Every table is timed, every drink is counted, every lamp is wired, and the owner sees it all in Telegram from anywhere in the world.",
    "ct.f1": "Session timers per table. Start now or back-date, split into named rounds, settle who pays what.",
    "ct.f2": "Bar inventory with orders, returns, stock and cost price, so you see real profit.",
    "ct.f3": "Branded thermal receipts with your socials as a QR code.",
    "ct.f4": "Tamper-proof reports: a Telegram message after every session and an Excel file at day's end.",
    "ct.f5": "Wi-Fi relays switch the lamp over each table on START and STOP.",
    "ct.window": "ClubTime · Club floor",
    "ct.rev": "Revenue today",
    "som": "so'm",
    "ct.active": "Active tables",
    "ct.relays": "Relays online",
    "ct.tables": "Tables",
    "ct.tea": "Tea",
    "ct.cola": "Cola",
    "ct.snacks": "Snacks",
    "ct.hint": "Pick a table, press <b>START</b>, order a tea, then <b>STOP</b>. One second here is one minute in the club.",
    "dojo.eye": "The Dojo · concept demos",
    "dojo.h": "What if they had a&nbsp;<em>Qilich?</em>",
    "dojo.lead": "We haven't worked with these brands yet. We built these concepts anyway, to show what we'd forge for them. Every screen here is live, so tap around.",
    "dojo.tabs": "Concept demos",
    "tab.safia": "Bakery &amp; café app",
    "tab.bon": "Coffee pre-order",
    "tab.akfa": "Industrial platform",
    "tab.next": "Next in line",
    "tab.you": "Your brand",
    "concept": "Concept · not affiliated",
    "sf.h": "A cake builder that <em>sells itself.</em>",
    "sf.p": "A bakery chain lives on celebrations. So the app starts with them: design the cake, watch it come together live, pick a slot for tomorrow, and follow it from the oven to the door.",
    "sf.checks": "<li><svg class=\"i\"><use href=\"#i-check\"/></svg>Live cake builder with an inscription on top</li><li><svg class=\"i\"><use href=\"#i-check\"/></svg>Pickup slots per branch or courier delivery</li><li><svg class=\"i\"><use href=\"#i-check\"/></svg>Birthday reminders and a loyalty wallet</li><li><svg class=\"i\"><use href=\"#i-check\"/></svg>Behind it: kitchen display, courier app, admin and POS sync</li>",
    "sf.build": "Build your cake",
    "sf.preview": "Cake preview",
    "sf.sponge": "Sponge",
    "sf.honey": "Honey",
    "sf.choco": "Choco",
    "sf.topping": "Topping",
    "sf.berries": "Berries",
    "sf.drip": "Drip",
    "sf.nuts": "Nuts",
    "sf.size": "Size",
    "sf.ontop": "On top",
    "sf.insLabel": "Cake inscription",
    "sf.order": "Order for tomorrow",
    "sf.onway": "Your cake is on its way to you",
    "sf.s1": "Order received",
    "sf.s1d": "Tomorrow · 10:00",
    "sf.s2": "Baking",
    "sf.s2d": "Sponge in the oven",
    "sf.s3": "Decorating",
    "sf.s3d": "Writing “<em class=\"sf-ins-echo\">Happy B-day!</em>”",
    "sf.s4": "On the way",
    "sf.again": "Build another",
    "bn.h": "Skip the queue. <em>Keep the ritual.</em>",
    "bn.p": "Morning rush means queues. Order on the way, pay in the app, and walk in to a cup with your name on it. Every cup fills the loyalty card, and the card brings people back.",
    "bn.checks": "<li><svg class=\"i\"><use href=\"#i-check\"/></svg>Pre-order with a live pickup ETA per branch</li><li><svg class=\"i\"><use href=\"#i-check\"/></svg>Digital stamp card: 8 stamps earn a free cup</li><li><svg class=\"i\"><use href=\"#i-check\"/></svg>Payme, Click and card payments in one tap</li><li><svg class=\"i\"><use href=\"#i-check\"/></svg>Barista queue screen and peak-hour analytics</li>",
    "bn.eta": "Nearest · 4 min",
    "bn.drink": "Drink",
    "bn.capp": "Cappuccino",
    "bn.cocoa": "Cocoa",
    "bn.your": "Your drink",
    "bn.name": "for Malika",
    "bn.milk": "Milk",
    "bn.classic": "Classic",
    "bn.oat": "Oat",
    "bn.coco": "Coco",
    "bn.stamps": "Stamp card",
    "bn.order": "Order &amp; pay",
    "ak.h": "From a website to <em>a sales machine.</em>",
    "ak.p": "A manufacturer's site shouldn't be a brochure. Customers configure a window, see the price and thermal rating instantly, and get routed to the nearest dealer. Dealers get a portal and the factory gets the data.",
    "ak.checks": "<li><svg class=\"i\"><use href=\"#i-check\"/></svg>Product configurator with instant price and thermal rating</li><li><svg class=\"i\"><use href=\"#i-check\"/></svg>Dealer locator and B2B ordering portal</li><li><svg class=\"i\"><use href=\"#i-check\"/></svg>ERP and 1C integration, with order tracking down to the installer</li>",
    "ak.links": "<span>Windows</span><span>Doors</span><span>Facades</span><span>Dealers</span>",
    "ak.concept": "Concept",
    "ak.preview": "Window preview",
    "ak.cfg": "Configure your window",
    "ak.sashes": "Sashes",
    "ak.w": "Width <b class=\"ak-w\">1400</b> mm",
    "ak.wLabel": "Width in millimetres",
    "ak.h2": "Height <b class=\"ak-hh\">1400</b> mm",
    "ak.hLabel": "Height in millimetres",
    "ak.profile": "Profile",
    "ak.glass": "Glass",
    "ak.g1": "Single",
    "ak.g2": "Double",
    "ak.g3": "Triple",
    "ak.color": "Colour",
    "ak.white": "White",
    "ak.anthracite": "Anthracite",
    "ak.oak": "Golden oak",
    "ak.est": "Estimate",
    "ak.estNote": "so'm · sample estimate",
    "ak.heat": "Heat loss",
    "you.h": "Your brand. <em>Our blade.</em>",
    "you.p": "Café, clinic, factory, school, bank or marketplace: send us your brand and we'll show you what it could look like, before you spend a single so'm.",
    "you.chips": "<li>Restaurants &amp; cafés</li><li>Retail &amp; e-commerce</li><li>Manufacturing</li><li>Clinics</li><li>Education</li><li>Logistics</li><li>Hotels &amp; travel</li><li>Fintech</li>",
    "you.cta": "Ask for a concept",
    "dojo.disc": "Concept work for demonstration only. Qilich is not affiliated with, endorsed by, or working for Safia, Bon! or Akfa. All names and trademarks belong to their respective owners.",
    "ars.h": "One team. Every layer of&nbsp;the&nbsp;stack.",
    "ars.lead": "From the kernel-level permissions on a student's phone to the relay over a billiard table, we own the whole cut. No hand-offs, no excuses.",
    "ars.rare": "Rare skill",
    "ars.sys": "System-level mobile",
    "ars.sysP": "Accessibility services, device admin, usage stats, overlays, and Apple's Screen Time frameworks. The deep end most agencies won't touch.",
    "ars.mob": "Mobile apps",
    "ars.mobP": "Native Android and iOS, or cross-platform when it makes sense.",
    "ars.web": "Web platforms",
    "ars.webP": "Corporate sites, e-commerce, dashboards and landing pages that convert.",
    "ars.be": "Backend &amp; APIs",
    "ars.beP": "Fast, secure, and hosted in Uzbekistan when the law requires it.",
    "ars.iot": "IoT &amp; hardware",
    "ars.iotP": "Software that flips real switches: relays, printers, POS terminals and sensors.",
    "ars.tgP": "Bots, mini apps, payments and the reports owners actually read.",
    "ars.ai": "AI that runs where it should",
    "ars.aiP": "On-device neural filters that block harmful images without anything leaving the phone, plus LLM assistants that explain, summarize and automate.",
    "ars.adm": "Admin panels &amp; analytics",
    "ars.admP": "Roles, permissions, exports and dashboards for schools, clubs and enterprises.",
    "ars.relays": "Wi-Fi relays",
    "ars.auto": "Automation",
    "ars.code": "Code sample",
    "way.h": "Four moves. Zero wasted&nbsp;cuts.",
    "way.s1": "The stance",
    "way.s1p": "We study your business before we write a single line: goals, users, constraints. Then you get a clear scope, timeline and price.",
    "way.s2": "The form",
    "way.s2p": "User flows, interface design and a clickable prototype. You touch the product before it's built.",
    "way.s3": "The cut",
    "way.s3p": "Short sprints and a working build every week. Clean code that you own. No black boxes.",
    "way.s4": "Remaining mind",
    "way.s4p": "Launch isn't the end. Monitoring, support, analytics and new features: we stay alert after the strike.",
    "man.label": "Manifesto",
    "man.t": "Every line of code is a cut. A samurai doesn't make sloppy cuts. Neither do we.",
    "ct2.h": "Bring us the <em>impossible.</em>",
    "ct2.lead": "Tell us what you want to build. We'll tell you how we'd cut it: stack, timeline and an honest price.",
    "ct2.call": "Call us",
    "f.legend": "What are we forging?",
    "f.mob": "Mobile app",
    "f.web": "Website",
    "f.cafe": "Café app",
    "f.ent": "Enterprise system",
    "f.iot": "IoT / hardware",
    "f.wild": "Something wild",
    "f.name": "Your name",
    "f.contact": "Phone or Telegram",
    "f.budget": "Budget",
    "f.b0": "Not sure yet",
    "f.b1": "Under $3k",
    "f.msg": "Tell us about it",
    "f.msgPh": "We want an app that…",
    "f.send": "Send it to the dojo",
    "f.doneT": "Message sealed.",
    "f.doneS": "Your message is ready. If your mail app opened, just press send. We'll be in touch.",
    "f.back": "Back to the form",
    "ft.nav": "Navigate",
    "ft.battles": "Battles",
    "ft.motto": "Qilich yo'li: the way of the sword.<br>Discipline in code. Honor in delivery.",
    "ft.copy": "Qilich · IT solutions. Forged in Uzbekistan.",
    "ft.disc": "Concept demos are illustrative and not affiliated with the brands shown.",
    "ft.top": "Back to top",
    "ars.eye": "The Arsenal"
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

  function pick(key, fallback, lang) {
    if (lang !== 'en') return fallback;
    if (!(key in EN)) { console.warn(`[Qilich] Missing English text for "${key}"`); return fallback; }
    return EN[key];
  }

  function apply(lang, announce) {
    lang = lang === 'en' ? 'en' : 'uz';
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
    // main.js and demos.js re-render what they draw themselves
    if (announce) document.dispatchEvent(new CustomEvent('qilich:lang', { detail: lang }));
  }

  document.addEventListener('DOMContentLoaded', () => {
    capture();
    const fromUrl = new URLSearchParams(location.search).get('lang');
    if (fromUrl === 'en' || fromUrl === 'uz') store.set(fromUrl);
    apply(fromUrl || store.get() || 'uz', false);
    document.querySelectorAll('.lang [data-lang]').forEach(b => b.addEventListener('click', () => {
      if (b.dataset.lang === doc.lang) return;
      store.set(b.dataset.lang);
      apply(b.dataset.lang, true);
    }));
  });
})();
