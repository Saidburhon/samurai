---
slug: speed-on-android
lang: en
title: "Speed on a mid-range Android phone: why it costs you orders"
description: "Many customers open your site on a mid-range Android over mobile data, not a flagship on office Wi-Fi. How to test speed and what to fix first."
date: 2026-10-21
tags: [site speed, mobile apps, Android, UX, Core Web Vitals]
related: [web, mobile, telegram]
reading_minutes: 6
---

A new design usually gets signed off like this: the developer shows the site on his phone, the owner opens it on hers, and on the office Wi-Fi everything is instant. A month later the ads are running, the clicks are coming in, and orders are thin. The likely reason is that your customer opens the same site on an Android phone bought two years ago, with its storage nearly full, over mobile data, in a lift or in a shop half below street level. They see a white screen, wait a few seconds and go back to Telegram, where a competitor has already replied. Nobody writes to tell you the site is slow. They just leave. Here is how to see your site and app the way that customer does, how to measure speed for free, and what to fix first.

## The phone you test on is not your customer's

A flagship and a mid-range Android differ in more than the camera. The expensive phone has a fast processor, plenty of memory and free storage. The cheaper one has a noticeably slower processor, and its memory is taken up by the Telegram cache, photos and a dozen other apps. JavaScript that runs unnoticed on an iPhone can freeze the page here for a second or two.

The network is different too. The office has fibre and Wi-Fi. The customer has mobile data, which drops off in a lift, a basement, a crowded shopping centre, on the edge of the city and outside it. Many people are on plans with a limited data allowance, and they won't wait for a video on your home page to load.

There is one more difference. You have opened your own site hundreds of times, and your browser has it cached. A customer arriving from an Instagram ad or a link in a Telegram channel is opening it for the first time, often in the app's built-in browser, and everything loads from scratch.

So the rule is simple: test on the kind of phone your customers carry, over mobile data, with the cache cleared. Your analytics will tell you which models they use: both Google Analytics 4 and Yandex Metrica report device models.

## Why speed is money

It is easy to reach for someone else's statistics with impressive percentages. We will skip them: the mechanics are clear enough, and you can work out your own numbers.

- **People leave before they see the offer.** While the page loads, they tap back. Sometimes the visit never reaches your analytics at all, because the tracking script hadn't loaded yet. That is why a slow site often doesn't show up in reports.
- **You pay for clicks that never reach the page.** The ad platform charges for the click, not for what the person saw. If the Meta pixel is on your site, compare Link clicks with Landing page views in Ads Manager. A large gap means a good share of people leave before the page loads.
- **A slow interface causes errors.** Someone taps "Pay", nothing happens, so they tap again. If the system isn't built for that, you get a second order, sometimes a second payment, and then a call to support.
- **Search engines look at page experience.** Google states that its ranking systems use Core Web Vitals. It is not the main factor: a relevant, useful answer matters more. But when everything else is equal, the slow site loses.

You can estimate the loss roughly but honestly: what a click costs, how many clicks you get a month, and what share of people left before the page appeared. Even a rough figure usually tells you whether a week of developer time on speed is worth paying for.

## How to measure it for free

Three tools cover almost everything.

**PageSpeed Insights** (pagespeed.web.dev). Enter the address and look at the mobile tab. At the top you get data from real Chrome users over the last 28 days, if the site has enough traffic; small sites often don't get this block. Below it is a lab test that emulates a mid-range phone on a slow mobile connection. Run it three times and look at the typical result, because the score moves between runs. Test more than the home page: the catalogue, a product page and the cart too.

**Chrome DevTools.** Open the site in Chrome on a computer and press F12. In the Network tab, throttle the connection (Slow 4G or 3G); in the Performance tab, slow the CPU down 4 or 6 times. You will see what loads, how heavy it is and what holds up the first screen. You can also turn on USB debugging on a real Android phone, plug it in, open `chrome://inspect` and look at the same data on the phone itself.

**An inexpensive test phone.** The most honest method. Buy a mid-range Android that is a year or two old, like the ones your customers carry, for example from the Samsung Galaxy A or Redmi lines. Turn off Wi-Fi, clear the cache and go through the whole customer journey: ad → site → product → cart → payment. Try it in a lift or an underground car park as well. It costs less than any audit and convinces people better than any report.

The reports show three Core Web Vitals. In plain words:

| Metric | What it means for the customer | Good, according to Google |
|---|---|---|
| LCP (Largest Contentful Paint) | When the main thing appears: the banner, the product photo, the headline | 2.5 seconds or less |
| INP (Interaction to Next Paint) | How quickly the page responds to a tap | 200 milliseconds or less |
| CLS (Cumulative Layout Shift) | Whether the content jumps around while it loads | 0.1 or less |

Google assesses these at the 75th percentile: a result counts as good if at least three visits in four reach it. INP can only be measured on real users, so lab tests show Total Blocking Time instead, the total time the page couldn't respond to input.

## Usual suspects on websites

The causes are nearly always the same.

**Oversized photos.** A content manager uploads a photo of several megabytes straight from a phone or a photographer, and on screen it is 400 pixels wide. What to do: resize and compress images automatically on upload, serve them as WebP or AVIF, and give the browser several sizes (`srcset`) so the phone picks a small one. Load images below the first screen as the user scrolls (`loading="lazy"`), but not the main banner, which should load first. Set width and height on every image so the page doesn't jump.

**Sliders and video on the home page.** Five banners in a carousel mean five large images before the person sees anything, and few people get as far as the third slide. One static banner with a clear offer loads faster and doesn't hide the point. On mobile, replace a background video with an image.

**Pixels, counters and widgets.** Over the years a site collects the Meta Pixel, Google Tag Manager, Yandex Metrica with Webvisor, a TikTok pixel, social buttons, an online chat from the CRM and a pop-up survey. Each script downloads its own code and keeps the processor busy, and a chat widget can weigh more than the rest of the page. What to do: list them with your marketer and keep only those whose data someone actually uses. Load the chat after the user's first interaction or after a few seconds. Often a plain "Message us on Telegram" button that opens your bot or support account does the job of a heavy widget.

**Heavy fonts.** Three weights of one font plus another font for headings, all loaded before any text appears. Keep two or three weights, use WOFF2, and load them with `font-display: swap` so the text shows immediately in a system font. If you subset a font to the characters you need, make sure the subset includes Cyrillic and the Uzbek ʻ (U+02BB). Otherwise that mark in oʻ and gʻ renders in a different font or as an empty box.

**No caching or compression.** The server sends everything fresh every time, without gzip or Brotli and without cache headers. This takes hours to set up, not weeks. Where the server sits matters too: the further from your customers, the longer every request takes. And if the site stores customers' phone numbers and addresses, the law already requires personal data of Uzbek citizens to be stored on servers in Uzbekistan.

**Site builders and all-in-one themes.** On Tilda, or WordPress with a visual page builder, you can compress images and remove blocks, but you can't change how the platform loads its own code. If the site is still slow after all the clean-up, the platform is the problem, and the question becomes a different one: rebuild the template or move.

## Usual suspects in apps

App speed starts with the same rule: test on an inexpensive phone, not your own.

**Slow start-up.** On launch the app initialises analytics, ads, crash reporting and chat, loads the profile, the catalogue and the promotions, and only then shows a screen. On a flagship that's a second. On a cheaper phone it's a splash screen people stare at. In Android vitals, Google treats a cold start of 5 seconds or more as excessive. What to do: show the first screen straight away from saved data and refresh it in the background, initialise secondary libraries later, and load the catalogue in pages.

**Loading everything at once.** A feed of hundreds of products, and the app pulls all of it from the server with full-size images. You need paged loading and images the server sizes for the screen.

**A large download.** When a phone has a gigabyte or two free and warns every day that storage is running out, its owner thinks twice about a 150 MB app, and it is the first one they delete. Size comes from unused libraries, video and animation files bundled into the app, fonts, and images that could have come from the server. Google Play shows the size on the app's page, and customers see it.

**Too many animations.** Every extra animation is work for a weak processor and GPU. Transitions that are smooth on a flagship stutter on a cheaper phone. Keep the animations that explain what happened (the item flies into the cart) and drop the decorative ones.

At acceptance, test the release build only. Debug builds are noticeably slower, especially in Flutter and React Native, and they mislead. After launch, watch Android vitals in Google Play Console and, if you have it set up, Firebase Performance Monitoring: they show start-up time and freezes on real devices.

## Telegram bots and Mini Apps

In a bot, speed is response time. Someone taps a button, three or four seconds pass with nothing, and the bot looks broken. So they tap again, and again. Until the bot answers an inline button press (`answerCallbackQuery`), Telegram shows a loading indicator on the button.

Why bots reply slowly:

- on every tap the bot calls 1C or the CRM and waits for the answer;
- heavy database queries without indexes;
- a request to an AI model takes several seconds, and the user sees nothing meanwhile;
- the server goes to sleep when idle and takes a long time to wake up on the first request.

What to do: acknowledge the tap at once, show "typing…" (`sendChatAction`) or a short "Checking stock…", do the slow work in the background and send the result as the next message. Keep the catalogue, prices and stock in your own database and sync with 1C on a schedule or on events, rather than asking 1C on every tap. A repeated tap must not place a second order.

A Mini App is a web page inside Telegram, so everything above about websites applies, only more strictly: the person opened it from a chat and expects it to open as fast as the chat did. Watch the size of your JavaScript bundle: the framework, the component library, charts and maps all load on first open. Call `Telegram.WebApp.ready()` as early as you can, as soon as the main interface is ready; until then Telegram shows a loading placeholder. Product images follow the same rules as on the website.

## Put a speed budget in the contract

"The site must be fast" is a wish, not a requirement, because nobody can check it. A requirement looks different, and it belongs in the specification or an annex to the contract:

- **Test device:** a specific phone model, Android version, and the current version of Chrome. Best of all, a phone that stays with you.
- **Conditions:** cache cleared, mobile data or the Slow 4G preset in DevTools, three runs, the median counts.
- **Pages and screens:** home, catalogue, product page, cart, checkout; in an app, launch to the first useful screen.
- **Numbers.** These are examples; agree the actual values with your contractor for your project: LCP no more than 2.5 seconds and CLS no more than 0.1 in the PageSpeed Insights mobile test; the home page no heavier than 2 MB; a cold start to the catalogue on the test phone within 3 seconds; the bot responds to a button tap within a second. What matters is that there are numbers.
- **Who checks and when:** before each stage is accepted, using the same method every time. If a target is missed, the contractor fixes it before the acceptance certificate is signed.
- **After launch:** the budget applies to new features too. If you later add three pixels and a chat widget yourself, speed will drop, and that is no longer the contractor's fault. It is fairer to agree that any new third-party script gets tested on the test phone first.

A budget has a cost: it limits the design. A video on the home page, heavy 3D animation and a dozen widgets won't fit in it. That conversation belongs at the design stage, not after launch.

## What to fix first

The order that almost always pays off:

1. **Images.** Compress, resize, convert to WebP or AVIF, lazy-load everything below the first screen, and set up automatic processing on upload in the admin panel. Usually a day to a week, depending on the number of templates and what the site is built on.
2. **Third-party scripts.** Remove the unused ones, defer the chat and secondary counters. Technically a few hours to a couple of days, but marketing has to agree first, and that often takes longer than the work itself.
3. **Fonts, caching, server compression.** Hours or days.
4. **Everything else:** a heavy template, code that loads the whole catalogue at once, slow queries to the database and integrations, slow app start-up. Now you are talking weeks, usually two to six, sometimes more. The time depends on whether you have the source code and access, what the product is built on, and how tightly it is tied to 1C or the CRM.

After each step, measure again on the same phone in the same conditions. That way you see what worked and don't spend money on what didn't. It is plain kaizen: a small change, a measurement, the next change. And make the check a routine, because new banners, promotions and integrations bring a site back to where it was faster than you'd expect.

Mistakes to avoid:

- chasing a score of 100 in PageSpeed Insights instead of watching how the site behaves in a customer's hand;
- lazy-loading the main banner, which only makes LCP worse;
- installing three "speed-up" plugins on WordPress that conflict with each other;
- approving the design from a mockup on a large monitor;
- testing once before launch and never again.

Send your site's address to inbox@qilich.com and ask for a check on a mid-range Android phone.
