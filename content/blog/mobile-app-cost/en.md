---
slug: mobile-app-cost
lang: en
title: "What a mobile app costs in Tashkent: where the budget goes"
description: "What sets the price of an iOS and Android app: screens, backend, payments, integrations, store publishing, and the costs that start after launch."
date: 2026-10-21
tags: [mobile app, cost, iOS, Android, backend]
related: [mobile, backend, web]
reading_minutes: 10
---

You want an app for delivery, bookings, a loyalty programme or wholesale orders, and the first question is what it will cost. Ask a few companies in Tashkent and the figures differ several times over, and half the lines in each estimate are about things you never see on the phone: the server, the admin panel, integrations, testing. This article walks through where the money in an app actually goes, which decisions move the budget most, and which costs begin after launch, so that you plan for the app's first year and not only for release day.

## An app is three products, not one

What customers download from the App Store and Google Play is only the visible part. Two more parts have to exist for it to work.

- **The customer app** for iOS and Android: catalogue, cart, payment, profile.
- **The admin panel** for your staff, usually a web page behind a login. This is where they change products and prices, see orders and move them through statuses, send push campaigns, set banners and promo codes, and give staff their access rights.
- **The server (backend)** between the two. It stores users and orders, receives confirmations from payment providers, sends notifications and exchanges data with 1C or your CRM.

Take a hypothetical chain of three cafés with delivery. The customer sees a menu and a "Pay" button. An operator sees the new order in the panel and sends it to the right branch's kitchen. Meanwhile the server checks that the address is inside the delivery zone, gets the payment confirmation from Payme and sends the customer a "Your courier is on the way" push. If couriers need their own app with routes and statuses, that is a fourth product.

When a proposal describes only the customer app's screens, ask where the other parts are and who builds them. Without a panel, every price change goes through a programmer. Without a proper server, a good-looking app shows stale data.

## Journeys, not screens, drive the cost

The number of screens is a poor predictor of price. A "Thank you for your order" screen takes an hour; a payment screen with its checks and error handling takes days. It is more accurate to count the journeys a customer goes through:

1. signing in with a phone number and an SMS code;
2. the catalogue: categories, search, filters, product page;
3. cart and checkout: address, delivery zone, time, comment;
4. payment;
5. order status and notifications;
6. profile: addresses, history, language, account deletion;
7. contacting support.

Every journey has edge cases, and that is where most of the build and test time goes. The SMS code never arrives. An item sells out while it sits in the cart. The money is taken but the provider's confirmation is late. The address turns out to be outside the zone. The connection drops on the payment step, or a call comes in and the app goes to the background. The customer switches language halfway through checkout.

A practical way to prepare: write each journey as one line ("the customer wants to repeat last week's order: opens history, taps Repeat, pays with a saved card") and list underneath what can go wrong. You will use this list to compare proposals, and the developer will use it to estimate. Asking "which journeys and which edge cases did you price in?" quickly shows who did the arithmetic properly.

## One codebase or two

There are two main ways to build for iOS and Android.

**Cross-platform** (Flutter, React Native): one codebase for both platforms, one team, each feature written once. For most business apps this is enough. Catalogues, orders, bookings, loyalty and wholesale ordering work the same way, and customers won't notice the difference.

**Native** (Swift for iOS, Kotlin for Android): two separate apps. Every feature is written twice, tested twice and maintained twice. It costs noticeably more, though not double, because the server, the admin panel and the design are shared.

Native is worth paying for when the app depends on the phone's hardware:

- constant work with Bluetooth devices, sensors or retail equipment;
- hours of background location tracking, for couriers for example;
- processing video from the camera, augmented reality;
- complex animation and graphics where every frame counts.

If the app is mostly lists, forms and payments, two codebases are usually money you don't need to spend. There is a middle option too: a shared Flutter or React Native codebase with native modules for one or two heavy features.

Ask the developer what they propose to build with and why, which parts will be native, and whether another team could maintain the code later. Choosing a technology also decides which programmers you will be able to hire two years from now.

## Backend, admin panel and integrations

The server and the integrations often take as much work as the app itself, and sometimes more. All the logic lives here: who can sign in, what delivery to Yunusabad costs, what happens to an order when the payment doesn't arrive.

What it usually includes:

- **Accounts and sign-in.** In Uzbekistan most apps sign people in with a phone number and an SMS code. An SMS provider such as Eskiz or Play Mobile sends the codes, and every message costs money.
- **Orders, statuses, push notifications.** Delivering pushes through Firebase Cloud Messaging and Apple's service is free. The work is in the server that decides who gets what, and when.
- **Payment through Click, Payme or Uzum.** The business signs the merchant contract, not the developer, and it's best started in the first week of the project. Each provider is a separate integration with its own protocol. Plan for fiscal receipts as well: they need a product code (IKPU) and a VAT rate for every item, and filling those into the catalogue is your accountant's job. Saved Humo and Uzcard cards for one-tap payment depend on what the provider supports.
- **Integrations.** Stock and prices from 1C, customers and deals in amoCRM or Bitrix24, menus from iiko or R-Keeper in restaurants. The price depends on whether the other system has an API, which way the data flows, how often it has to be synchronised and how clean your reference data is. If your 1C configuration has been customised, you will almost certainly need your own 1C programmer involved.
- **Data storage.** If the app stores names, phone numbers and addresses of Uzbek citizens, the law requires that data to be kept on servers in Uzbekistan. Choose hosting with this in mind from the start, because moving later costs more.

A separate point about store rules. Physical goods and services (food, delivery, a haircut booking, a wholesale shipment) can be paid for through Click or Payme. Digital goods used inside the app, such as courses, subscriptions or paid features, generally have to be sold through Apple's and Google's own in-app payment, which takes a 15–30% commission. For an online school's app this changes the economics, so settle it before design starts.

Ask for the estimate split into four lines: customer app, admin panel, server, integrations. It makes clear what you are paying for, and it makes two proposals comparable.

## Design, testing and real devices

**Design starts before code.** A sound order is: a map of the journeys, then a clickable prototype in Figma, then the final screens. Show the prototype to five or six real customers; moving a button in a prototype is cheaper than moving it in a finished app. Standard components on a tidy grid cost less than custom illustration and elaborate animation, which are worth it when the app is your main shop window.

**Two languages on every screen.** Almost every business in Tashkent needs Uzbek and Russian, sometimes Uzbek Cyrillic as well. That means notifications, SMS texts, error messages, store descriptions and screenshots, not just buttons. Uzbek and Russian words run longer than English ones, so designs are checked against the longest version: a button that fitted in the mock-up wraps onto two lines on a real phone. Keep the texts separate from the code, so a new language is a translation job rather than a rebuild.

**Testing on the phones your customers carry.** Most customers in Uzbekistan use Android, and many of them have a budget or mid-range phone with little memory and an older system version rather than a flagship. An app that flies on the developer's new iPhone can be slow to open on such a phone and crash at checkout. A minimum set of checks:

- two or three budget and mid-range Android phones from different makers, plus an iPhone a few years old;
- a small screen, and large text turned on in the phone's settings;
- a slow or patchy connection;
- the app going to the background during payment, an incoming call;
- both languages on every screen.

Testing takes a noticeable share of the budget, and it should. Ask who tests (a dedicated tester or the programmer who wrote the code), on which devices, and whether there will be a beta through TestFlight and Google Play closed testing before the public release.

## Store accounts and review

Publishing is a stage of its own, with its own lead times and fees.

- **Apple Developer Program**: $99 a year; at sign-up the price may be shown in local currency. If the membership lapses, the app is removed from the App Store.
- **Google Play**: a one-time $25 fee for the developer account.
- **D-U-N-S number.** Both stores require one for an organisation account. It is free, but Google warns that getting one can take up to 30 days, so request it in the first week of the project.
- **Register the accounts to your company, not to the developer.** Otherwise someone else's name appears as the seller, and transferring the app later takes time. If a new Google Play account is registered as a personal one, Google requires a closed test with at least 12 testers for 14 days in a row before the app can go public.

Apple reviews every version, usually within a few hours to a couple of days. Google reviews apps too, and for new accounts it can take a week or longer. Allow about a week for the first release, because the first submission often comes back with remarks.

Common reasons for rejection that are easy to prevent:

- the reviewer has no test login and can't get past the SMS code;
- the app lets people register but not delete their account, which Apple requires;
- there is no privacy policy link, or it doesn't match what the app collects;
- the app looks like a wrapper around a website and does little on its own;
- crashes on the reviewer's device, placeholder content;
- asking for location or camera access without explaining why.

Both stores require a data questionnaire: the App Store's privacy section (what data is collected, why, and whether it is linked to the user) and Google Play's Data safety section. You also need an age rating, descriptions in the right languages and screenshots in the required sizes. The developer usually prepares all this, but the answers are a statement by your company, so check them yourself.

## Costs after launch

An app keeps costing money after release, so work out the first year's budget now.

| Item | How it's paid | To whom |
|---|---|---|
| Apple Developer Program | $99 a year | Apple |
| Google Play | $25 once | Google |
| Server and database in Uzbekistan | monthly, grows with load | hosting provider |
| SMS sign-in codes | per message | SMS provider |
| Online payments | a percentage per payment, set by contract | Click, Payme, Uzum |
| Digital goods sold in the app | store commission on each purchase | Apple, Google |
| Push notifications | usually free | — |
| Analytics and crash reports | a free tier is often enough at first | the service provider |
| Support and changes | monthly package or hourly | the developer |

What else to plan for:

- **Yearly system updates.** Apple ships a new iOS every autumn and Google a new Android. The stores regularly require apps to be built for recent versions: every year Google Play raises the Android version that updates must target. An app nobody has touched for a year will at some point be impossible to update until it is brought up to date.
- **Libraries and payment SDKs** change too, sometimes in ways that break older versions.
- **Bug fixes.** Some bugs only show up with real users on less common phones.
- **Analytics without personal data.** Popular analytics tools store data abroad. Don't send them names or phone numbers, and check the details for your case with a lawyer.
- **Improvements.** The first months show where customers abandon the cart and which features nobody opens. Small changes based on real use do more than a big second version built on guesses. Japanese practice calls this kaizen: small improvements, made regularly.

Ask for the support price at the same time as the build price, and agree in advance what counts as a bug and what counts as a new task.

## How to cut the budget without hurting the product

- **Launch an MVP with one core journey.** For delivery that is menu, cart, payment and order status. Loyalty points, reviews, referrals and chat can wait until you see how customers use the core.
- **One online payment method at the start.** If many customers pay the courier in cash or by card at a terminal, a second provider can come later.
- **A Telegram Mini App first.** Your customers are already in Telegram: nothing to install, no store review, no yearly fees, and updates appear at once. There are limits: less access to the phone's features, notifications arrive as bot messages, and everything depends on Telegram's rules. If the Mini App proves the demand and the server was designed with this in mind, the same server and admin panel can later serve the mobile app, and you don't pay for them twice.
- **Reuse what you already have.** Take the catalogue and prices from 1C rather than a new list someone has to maintain in parallel. Keep customers in your CRM. Your existing merchant contract, and your Telegram bot's server if you have one, can serve the app too.

Don't save on payment testing, the admin panel, backups or error alerts: each of those savings ends up costing more than it saved.

## What to prepare before you talk to developers

Timelines, assuming everything on your side is ready on time: an MVP with one core journey, an admin panel and one payment provider usually takes 2–3 months. A fuller version with loyalty, several integrations and a separate courier app takes 4–7 months. What usually moves the date is not the programming but the waiting: the merchant contract, the D-U-N-S number and store accounts, access to 1C, texts and photos, the first store review.

To get estimates you can compare, prepare:

- one sentence on what the app does and for whom;
- the list of customer journeys and their edge cases;
- who works in the admin panel and what they need to change there;
- whether couriers, technicians or sales reps need an app of their own;
- how customers will pay, and whether you already have a contract with Click, Payme or Uzum;
- which systems to connect: 1C (which configuration), amoCRM, Bitrix24, iiko;
- languages: Uzbek in Latin, in Cyrillic, Russian;
- whether there is a fixed launch date, and who prepares texts and photos;
- what budget you can set aside for the first year, support included.

Describe your app idea to SamurAI on qilich.com, or send this list to inbox@qilich.com.
