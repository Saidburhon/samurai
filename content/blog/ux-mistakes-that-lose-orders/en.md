---
slug: ux-mistakes-that-lose-orders
lang: en
title: "UX mistakes that lose orders, from cart to payment"
description: "A customer adds to cart and leaves. The mistakes in websites, apps and bots that cost businesses orders, and how to find and fix them."
date: 2026-10-21
tags: [UX, ecommerce, checkout, payments, usability]
related: [web, mobile, telegram]
reading_minutes: 8
---

Most lost orders come from a few fixable mistakes: sign-up before the order, delivery cost and the minimum order shown only at the end, address forms that ignore landmarks, a payment step that leaves the customer unsure what happened, a hidden language switch, slow screens on mid-range Android, and buttons too small to tap. Find your own leaks with a step-by-step funnel in Google Analytics 4, Yandex Metrica or your bot's logs, and fix the cheapest things first: text and settings often take hours, not a redesign.

The ads are running, people visit the site, dozens start the bot every day, and still there are fewer orders than you expected. In analytics this shows up as abandoned carts. In real life it is a customer who picked plov for four, got as far as checkout and closed the tab. The reason is usually neither the price nor the product. It is the small things between the cart and the payment: an extra step, a confusing field, a total that jumps on the last screen. Below are the common UX mistakes in online shops, delivery services and booking businesses in Tashkent, and how to spot each one in your own business, either in the numbers or simply by watching a customer.

## Sign-up before the order

The customer wants to order, and you ask them to invent a password, enter an email and confirm it. Many customers have no use for email when they shop: they expect the confirmation in Telegram or by phone. And nobody remembers the password for a site they buy from once a month.

What to do:

- Let people order without an account. The phone number is the account, and they type it in for delivery anyway.
- Confirm the number with a one-time SMS code at the end, once the cart is ready, not at the door.
- On a website you can add Telegram login. In a bot or a mini app you don't need a login at all: Telegram already knows the user, and the bot can ask for the phone number with a single "Share contact" button.
- After the first order, offer to keep the details: "Save this address for next time?"

How to spot it: compare how many people open the sign-up screen with how many get past it. If sign-up sits between the cart and checkout, also compare add-to-cart events with checkouts started.

## Delivery cost and minimum order shown too late

The customer fills the cart and only on the last screen finds out that delivery costs extra, the cart is below the minimum order, and the food will take two hours. A surprise at the end feels like a trick, even when the amount is small.

What to do:

- Show the delivery cost, minimum order and rough delivery time before the cart: in the site header, on the branch page, in the bot's first message.
- If the price depends on the district or distance, ask for the district first and show the terms straight away.
- In the cart, say how much is left to free delivery or to the minimum: "Add 15,000 sum more and delivery is free."
- The cart total must match the amount on the payment screen to the last sum. Service fee, packaging, a surcharge for card payment: all of it visible in advance.
- If the kitchen is closed or no courier is free, say so before the customer builds a cart, not after.

How to spot it: if noticeably more people leave at the step where the total with delivery first appears than at the steps around it, that step is the most likely cause.

## Address forms that ignore how Tashkent gives directions

Forms copied from foreign shops ask for street, house number and postcode. In Tashkent an address sounds different: "Yunusobod, block 4, building 12, landmark: the school" or "Sergeli, behind the mosque, blue gate". For a courier the landmark, the moʻljal, often matters more than the house number, and nobody needs a postcode for delivery inside the city.

What the form needs:

- district or massiv (housing estate), street or block, building: free text, no strict validation;
- a separate "Landmark" field with an example under it;
- a pin on the map: a "Send location" button in the bot, a map with a draggable pin on the site and in the app;
- entrance, floor, flat and intercom code as separate optional fields, since a private house has none of them;
- a note for the courier;
- saved addresses: "Home", "Work", "Mum's". A repeat order should take less than a minute.

A common mistake is to require a street from a reference list and block the next step until one is found. Many Tashkent streets have been renamed, and people still use the old names. Let the customer write the address the way they always do and drop the pin themselves.

How to spot it: listen to your couriers' calls to customers. If almost every one starts with "Where are you?", the form is not collecting what the courier needs. In analytics, look at which form field people stall on before they leave.

## Payment that leaves the customer unsure

This is the most expensive moment: the person has already decided to pay. Orders are lost here in two ways. Either the payment method they want is missing, or after paying they don't know what happened.

What to do:

- Show every method at once, clearly: Click, Payme, Uzum, a Humo or Uzcard card, cash to the courier. Logo plus a label. If you take cash, don't hide it.
- Remember the customer's choice for the next order.
- After the customer returns from the payment system, show a dedicated screen: "Payment received, order 1043 accepted, the courier will arrive around 19:40." If the confirmation hasn't arrived yet, say so: "Waiting for confirmation from the payment system", and refresh the page automatically. A blank page or a bounce to the home page will not do.
- The payment status has to come from the payment system's server, not from whether the customer came back to your site. They can close the tab after the money has already left their card.
- Repeat the confirmation in Telegram or by SMS, so the customer can check without opening the site.
- Give them a "My order" page or bot command with the status: accepted, being prepared, with the courier, delivered.
- If the payment fails, tell them what to do next: try again, choose another method, pay the courier. A retry must not create a second order.

How to spot it: compare the number of people sent to payment with the number of paid orders, separately for each payment system. Count how many support requests start with "I paid, but…".

## Language and script surprises

Customers in Tashkent write in both Uzbek and Russian, and many switch in the middle of a sentence. Uzbek itself is written in both Latin and Cyrillic.

What breaks:

- The default language is a poor guess and the switch is buried in the footer or the profile settings. Make it visible on every screen: "Oʻz | Рус". In a bot, take the language from the user's Telegram settings on first start and let them change it with one command.
- Half-translated screens: the menu is in Uzbek, but the pay button, the errors and the SMS are in Russian or English. System texts are the usual gap: error messages, notifications, the text on the payment page. And an error is exactly when the customer is already confused.
- Machine-translated dish and product names. Have a native speaker check them.
- Search that understands only one script. A customer types "лагмон", "lagʻmon", "лагман" or "lagmon", and all four should find the same dish. The mark in oʻ and gʻ is also typed with different characters or left out entirely. Search should bring all of this to one form, and for popular items it is worth keeping synonyms in both languages and both scripts.

How to spot it: export the search queries that returned nothing. That is usually a ready-made list of missing synonyms.

## Slow screens on mid-range Android

The site was tested on a new iPhone over office Wi-Fi. The customer opens it on a mid-range Android phone, on mobile data, on the move. Every extra second of waiting is a reason to go back to Telegram and order somewhere else.

The usual causes:

- product photos of several megabytes, uploaded at full size;
- video on the home page, sliders and animations;
- a dozen third-party scripts (chat, pixels, widgets, counters), each downloading something of its own;
- a catalogue that loads in full instead of the first twenty items;
- in a mini app, a heavy framework for three screens.

What to do: compress images and serve them at the right size in modern formats (WebP, AVIF); load images below the first screen as the user scrolls; remove scripts nobody uses; check your pages in PageSpeed Insights. Most important: take a phone like the ones your customers use, switch off Wi-Fi and place an order from start to finish on mobile data. It costs less than any audit.

How to spot it: split bounces by device in your analytics. If people from the same ads leave noticeably more often on Android than on iPhone, the cause is often speed or the mobile layout.

## Small buttons, faint text, unhelpful errors

- **Buttons.** A finger is bigger than a cursor. Apple recommends a tap target of at least 44 × 44 pt, Google 48 × 48 dp. The "−" and "+" in the cart, the delete cross and the consent checkbox are usually smaller.
- **Contrast.** Light grey text on white looks elegant in the mockup and can't be read in sunlight. WCAG at level AA requires a contrast ratio of at least 4.5:1 for normal text. Any contrast checker tells you in a minute.
- **Errors.** "Invalid format", "Error 400", a red border with no text. The customer can't tell what they did wrong, so they leave.

A good error message says what happened and how to fix it, without blaming anyone:

- instead of "Invalid phone number": "Enter the 9 digits after +998, for example 90 123 45 67";
- instead of "Payment error": "The payment didn't go through. Try again, choose another card or pay the courier." If money might have been taken, say what will happen to it.

Three more small things: keep what the customer typed when an error appears; accept the phone number in any form, with or without +998, with spaces or brackets; open the numeric keyboard for phone numbers and codes.

## How to find your own leaks

Start with the funnel: at each step, count what share of people move on to the next one.

| Step | What to count | If people leave here, check |
|---|---|---|
| Product page → cart | share who add to cart | price, photos, availability, the "Add to cart" button on a phone |
| Cart → checkout | share who start checkout | sign-up, delivery cost, minimum order |
| Checkout → payment choice | share who reach payment | address form, field errors, speed |
| Payment → paid order | share of successful payments per system | payment page, the return after payment, order status |

How to go about it:

1. Set up an event for every step: product viewed, added to cart, checkout started, address entered, sent to payment, payment confirmed. On a website, Google Analytics 4 and Yandex Metrica can do this; in a bot, write the same events to your own database.
2. Look at the funnel separately by device, language and traffic source. The overall figure hides problems: everything may be fine in Russian and poor in Uzbek, for example.
3. Turn on session recordings, Webvisor in Yandex Metrica or Microsoft Clarity, and watch twenty or thirty recordings of people who left checkout. Check in the settings that the contents of phone and address fields are masked: these services store recordings on servers abroad, and the law requires personal data of Uzbek citizens to be stored on servers in Uzbekistan.
4. Watch real people. Ask five people who don't work for you to place an order on their own phone while you watch in silence. Don't help. Write down where they hesitate, what they ask, where they tap the wrong thing. Japanese practice calls this gemba: go to where the work actually happens and see it yourself instead of reading reports.
5. Read your support chats and listen to calls. Questions like "where is the button", "how much is delivery" and "did my payment go through" are your UX mistakes, already written down for you by your customers.

## Fix the cheapest things first

A redesign looks like the answer to everything, but it is slow, expensive and changes everything at once, so afterwards you can't tell what helped. A better order:

1. **Text and settings:** usually a few hours to a couple of days. Show delivery cost in the header, rewrite error messages, drop the mandatory email, turn on guest checkout, add a landmark field, reorder the payment methods.
2. **Individual screens:** usually one to four weeks. A new address form with a map, the screen after payment, order status, search with synonyms. The time depends on what the site runs on: in an off-the-shelf CMS a lot is settings and plugins, in a custom system it goes through a developer, and a link to 1C adds time.
3. **Speed:** a few days if the problem is images and unused scripts, several weeks if the architecture itself is in the way, such as a heavy template or a catalogue without paged loading.
4. **Rebuilding checkout or the whole product:** one to three months, sometimes more. Worth it when small fixes keep running into how the system is built.

Measure each change on its own. Record the step's figure before the change, make one change, wait a week or two, and compare the same days of the week. Holidays, Ramadan, sales and changes in advertising distort the picture, so allow for them. If you don't have many orders, a difference of a couple of percent can be chance: look for a shift that holds, not one good day.

Send the link to your site or bot to inbox@qilich.com and say where you think orders get lost.
