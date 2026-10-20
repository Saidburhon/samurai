---
slug: uzbek-russian-interface
lang: en
title: "Designing for Uzbek and Russian speakers in one interface"
description: "Interfaces for a bilingual audience: choosing the language, Latin and Cyrillic, text length, the ʻ letter in fonts, dates and money formats."
date: 2026-10-21
tags: [UX, app design, bilingual website, localization, Uzbekistan]
related: [web, mobile, telegram]
reading_minutes: 8
---

A familiar story: the site or app is built in Russian, and shortly before launch someone "adds Uzbek". The button "Buyurtmani rasmiylashtirish" wraps onto three lines, half the menu is still in Russian, the payment error arrives in English, and a customer who searches for "somsa" gets "nothing found" because the catalogue says «самса». For a business in Uzbekistan the second language is not a translation you order at the end. It is a design constraint, like the size of a phone screen, and it belongs in the first mockup. What follows are practical rules that keep layouts from breaking and screens from ending up half translated.

## Who reads what

Your customers read and write in at least three forms: Uzbek in Latin script, Uzbek in Cyrillic, and Russian. Latin is the official alphabet and the one schools teach. Many older people still use Cyrillic, and you see a lot of it in messages: someone writes in Uzbek, but on a Russian keyboard layout. For a noticeable share of customers, especially in Tashkent, Russian is the language of both work and home. And plenty of people switch during the day: they read the contract in Russian and message the courier in Uzbek.

What follows from this:

- The language of the browser, the phone or Telegram is a hint, not a decision. Many phones are set to Russian or English even when the owner prefers to read Uzbek.
- Ask once, where asking costs nothing: on the bot's first start, on the app's first screen.
- Always let people change the language in one or two taps without losing their cart or a half-filled form.

Decide which languages to support from your own customers, not from a hunch. A simple method: take the last 200 messages to support or the sales chat and count which language and which script they are written in. If a noticeable share writes Uzbek in Cyrillic, consider a third option, «Ўзбекча». It is usually produced by automatic transliteration from Latin plus a list of exceptions, so it costs less than a full third language. It still needs its own testing.

## The language switch

What it needs:

- It is visible on every screen: in the site header, in the app's profile, in the bot's menu. Not in the footer, and not under "Settings, Other".
- Each language is labelled in itself: «Oʻzbekcha», «Ўзбекча», «Русский». A Russian speaker who lands on the Uzbek version spots «Русский» at once; "Rus tili" is easier to miss. The same works the other way.
- No flags. A flag stands for a country, not a language, and a Russian flag next to «Русский» on a site for customers in Uzbekistan looks odd.
- The choice is stored in the customer's profile on the server, not only in the browser. Then notifications go out in the right language, and the customer sees the familiar interface on any device.
- Switching keeps the person on the same page with the same cart. Dumping them on the home page is a common and irritating mistake.
- Each language version of the site has its own address, such as /uz/ and /ru/, with hreflang tags. Search engines then show the right version, and links can be shared in the right language. Don't switch the language silently based on IP address.
- In a mobile app, the switch lives inside the app. Don't send people to the phone's system settings.
- In a bot, ask on the first /start with two or three buttons, and let people change it later through a command and a menu item. One catch: Telegram picks the command menu by the language of the Telegram app itself, not by the choice made in your bot. Once the customer picks a language, you can set the commands separately for their chat.

The default language is a business decision, not a developer's. It follows from who your customers are, the language of your ads, and the language you can answer in. If the ads run in Uzbek and the site opens in Russian, you are paying for clicks after which the first thing a person does is look for the switch. On a website, opening in the main language with a clearly visible switch works better than a full-screen chooser that covers the content. In a bot it is the reverse: a short question with buttons at the start costs almost nothing.

## Write both versions; don't translate word for word

Customers notice text translated word for word straight away. The Russian «Что-то пошло не так» ("something went wrong") becomes "Nimadir notoʻgʻri ketdi": grammatically fine, but nobody talks like that. "Xatolik yuz berdi. Qaytadan urinib koʻring" ("An error occurred. Please try again") sounds natural. «Ваша заявка принята» rendered as "Sizning arizangiz qabul qilindi" reads like a reply from a government office, when a café only needs "Buyurtmangiz qabul qilindi" ("Your order is in"). It works the other way too: Russian translated from Uzbek comes out heavy and bureaucratic.

How to organise the copy:

1. Keep a glossary: a table of the product's key words in both languages. Order is buyurtma / заказ, cart is savat / корзина, delivery is yetkazib berish / доставка, payment is toʻlov / оплата. Settle the disputed points early: "ilova" or "dastur" for "app", whether Russian uses a lowercase «вы» or a capitalised «Вы», how the currency is written, whether the brand name is translated.
2. Each version is written by a native speaker who understands the product. Machine translation is fine for a first draft, but Uzbek text almost always has to be rewritten after it.
3. One person signs off the copy in both languages. Not the developer who pasted in a translation so the screen wouldn't be empty.
4. Copy lives outside the code, in translation files or in the admin panel. Then a typo can be fixed without a new app build, and a missing translation shows up in a report rather than on a customer's screen.

Grammar affects the interface as well. Russian has three noun forms after a number: 1 товар, 2 товара, 5 товаров. Uzbek nouns don't change after a number: "5 ta mahsulot", not "5 ta mahsulotlar". So strings with numbers should use the plural rules every decent localisation library provides, instead of gluing a word and an ending together in code. The second trap is an Uzbek suffix attached to a variable. A template like "{shahar}ga" ("to {city}") works for "Toshkent", but for Chirchiq it produces "Chirchiqga" instead of the correct "Chirchiqqa", because the suffix depends on the word's last letter: -ga, -ka or -qa. It is safer to phrase things so the variable stands on its own: "Shahar: Chirchiq" ("City: Chirchiq").

Where untranslated bits usually hide:

- error and form validation messages from server code and off-the-shelf libraries, which often default to English;
- system dialogs: camera and location permission prompts, date pickers;
- the payment page: if the payment service accepts a language parameter, pass the customer's language;
- emails, SMS, push notifications, PDF invoices and receipts;
- the 404 page, empty states, placeholder hints inside fields;
- the app store description and screenshots, where the store supports the language;
- the bot's menu, commands and buttons.

## Text length and layout

The same meaning takes up different space in the two languages. Uzbek is often longer: «В корзину» versus "Savatga qoʻshish" (add to cart), «Оформить заказ» versus "Buyurtmani rasmiylashtirish" (check out). Sometimes it is the other way round: «Личный кабинет» versus "Kabinet" (my account). Every element of the layout has to cope with the longer of the two.

Practical rules:

- Design mockups with real copy in both languages, not "Lorem ipsum" and not Russian only. The designer needs to see the longest label for every button.
- Buttons and menu items wrap to a second line rather than being cut off with an ellipsis. A truncated "Buyurtmani rasmiy…" is worse than a short "Buyurtma berish" (place order), so sometimes the right fix is shorter copy.
- Uzbek words can get very long because of suffixes, and automatic hyphenation in browsers may not work for Uzbek. Don't rely on it in headings and narrow columns.
- The bottom navigation bar of a mobile app is the tightest spot: four or five items of one short word each. Choose the words in both languages before the icons are signed off.
- Test on a narrow phone and with an enlarged system font, since some users have it switched on.
- In a bot, a long label on an inline button gets cut off on a phone screen. Keep labels short in both languages.

## Letters, fonts and the okina

In Uzbek Latin, the letters oʻ and gʻ are written with a special mark, ʻ (U+02BB in Unicode), and the separator in words like "maʼlumot" (information) is ʼ (U+02BC). Neither is on a standard keyboard, so people type an apostrophe, a backtick or a typographic quote instead. In an interface this looks careless, and it is worst when one screen shows three different versions.

What to do:

- Use the correct ʻ and ʼ in interface copy. Put this in the glossary and check it with a search across the translation files before every release.
- Pick a font that has ʻ and ʼ, plus Cyrillic with the Uzbek letters Ў, Қ, Ғ, Ҳ. The test is simple: type "Oʻzbekiston, gʻisht, maʼlumot, Ўзбекистон, қўшиш, ғишт, ҳисоб" in every style you use, regular, bold and italic.
- If the font comes from Google Fonts, the letters Қ, Ғ, Ҳ are in the extended Cyrillic subset (cyrillic-ext), not the basic one. Forget to include it and those letters render in a different font.
- When a font lacks a character, the browser or phone takes it from a system font, with a different weight and height, and the word looks jumpy. In PDF receipts, images and card terminals the letter may turn into an empty box or a question mark. You only see this on real documents, so print them and open them yourself.
- SMS: any character outside the basic GSM set, whether Cyrillic or ʻ, switches the message to Unicode, and one segment then holds 70 characters instead of 160. That is why senders often replace ʻ with a plain apostrophe in SMS. It is a trade-off for price; make it deliberately, and only for SMS.

## Search that understands both scripts

Customers search the way they are used to typing. The same item gets searched as "somsa", "samsa", «самса» and «сомса». A district as "Chilonzor", «Чилонзор» and «Чиланзар». The Russian name often differs from the Cyrillic spelling of the Uzbek one: "Chilonzor" in Uzbek Cyrillic is «Чилонзор», while in Russian the district is called «Чиланзар». And hardly anyone types the ʻ at all; they write "ozbek" or "qoshish".

The minimum for search:

1. Normalisation. All apostrophe variants (' ` ‘ ’ ʻ ʼ) are mapped to one, in both the query and the catalogue. Search without the mark has to work too: "ozbek" finds "oʻzbek".
2. Transliteration. A Latin query also searches Cyrillic names, and the other way round. For Uzbek the rules are almost one-to-one (sh and ш, ch and ч, oʻ and ў, gʻ and ғ), with exceptions: Russian loanwords with «ц», «е» versus «э» at the start of a word, proper names. Keep those in a separate list.
3. Synonyms. Russian and Uzbek names for products and services, everyday words, old names of streets and landmarks. The business keeps this dictionary up to date, not the programmer, so it needs a place in the admin panel.
4. Wrong keyboard layout: "gkjd" instead of «плов». A simple rule that recovers lost searches.
5. A report of searches with no results. Review it weekly; it is the cheapest source of new synonyms.

On timing: normalisation and basic transliteration for a small catalogue usually take a few days. Full search with morphology, synonyms and typo tolerance takes from one to several weeks, depending on the catalogue's size and what it is built on.

## Numbers, dates, money and addresses

| | Uzbek | Russian |
|---|---|---|
| Price | 125 000 soʻm | 125 000 сум |
| Large amount | 1,2 mln soʻm | 1,2 млн сум |
| Date | 2026-yil 21-oktabr, 21.10.2026 | 21 октября 2026 г., 21.10.2026 |
| Time | 14:30 | 14:30 |
| Quantity | 5 ta mahsulot | 1 товар, 2 товара, 5 товаров |
| Phone | +998 90 123 45 67 | +998 90 123 45 67 |

What to watch:

- Money. The thousands separator is a space, and it should be a non-breaking one so an amount doesn't split across two lines. The decimal separator is a comma, so some customers will read "125,000" as one hundred and twenty-five. Prices don't show tiyin, so drop the ",00". The currency goes after the number.
- Dates. In Russian, the month after a day number takes the genitive case: «21 октября», not «21 октябрь». This bug is common when one list of month names is used both for the calendar and for running text. In Uzbek it is "21-oktabr", with a hyphen. The week starts on Monday and time uses the 24-hour clock. Standard formatting tools for the uz and ru locales save time, but check the output by eye: not every library and device handles the Uzbek locale equally well.
- Phone. The mask is +998 and nine digits. Accept input in any form: with or without the plus, with or without 998, with spaces, brackets and dashes. Normalise it to one format on the server. Don't hard-code a strict list of operator codes, because new codes appear.
- Addresses. Districts and streets often have two or three names: Uzbek, Russian and an old one. Show the name in the interface language in drop-downs and accept all of them in search. Always include a landmark field ("moʻljal" / «ориентир»): couriers often find it more useful than the house number. The article on [UX mistakes that lose orders](/blog/ux-mistakes-that-lose-orders/) covers the address form in more detail.

## Notifications and support in the customer's language

A customer picks Uzbek, and an hour later gets an SMS in Russian and a receipt with English headings. That puts people off more than a misaligned button does.

- The customer's language is stored in their profile on the server, and every channel reads it from there: push, SMS, bot messages, emails, receipts, order status updates.
- Every notification template exists in every supported language. If one is missing, that should come up in testing or in a report, not in front of the customer.
- Support requests reach staff tagged with the customer's language. If someone on a shift is only confident in one language, route requests with that in mind.
- Canned support replies are also written in both languages, using the same glossary as the interface.
- If an AI assistant handles the first line, check that it replies in the language of the question and understands Uzbek in Cyrillic and mixed-language messages. The article on [AI support in Telegram](/blog/ai-support-in-telegram/) goes into this.

## Timelines, cost and what changes them

When both languages are planned from the first mockup, the second language mostly adds copywriting and testing. For a typical site or bot that is usually days, not weeks.

When copy is hard-coded and the layout was designed for one language, "adding Uzbek later" starts with pulling the strings out of the code: from a few days for a small site to several weeks for an app with dozens of screens. Then come fixes for the tight spots that only show up once real copy is in place.

The work grows with:

- the number of screens and notification templates;
- a third option, «Ўзбекча»;
- search with transliteration and synonyms;
- documents: PDF invoices, contracts, receipts;
- separate page addresses for search engines;
- an admin panel where every item has two names and two descriptions.

There is also an ongoing cost people forget: every new product, promotion and news item now has to be written twice. Decide before launch who writes it and who approves it. And just before launch, walk through the main journey, from sign-in to payment and the notification that follows, in each language, on a real phone, together with a native speaker of that language.

Send screenshots of your site or app in both languages to inbox@qilich.com, and we'll point out what to fix first.
