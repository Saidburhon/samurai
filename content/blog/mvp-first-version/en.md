---
slug: mvp-first-version
lang: en
title: "MVP: what to leave out of the first version"
description: "The first version doesn't need everything. How to choose MVP features, what to drop without regret, and how to know when it's time for the next step."
date: 2026-10-21
tags: [MVP, startup, mobile app, Telegram Mini App, backend]
related: [mobile, telegram, web, cloud]
reading_minutes: 8
---

The feature list for a new product grows faster than the budget: customer accounts, loyalty points, chat with a manager, three languages, recommendations, a separate app for couriers. Every item feels essential because "the competitors have it". The result is a first version that ships months late, money that runs out around launch, and the one question that matters still unanswered: will customers use it and pay for it? An MVP exists to get that answer sooner and for less. Here is how to decide what goes into version one, what waits, and how to settle in advance what you will do after launch. This applies as much to a startup in Tashkent as to an established business that has run for years on phone calls and an administrator's notebook and is now moving online.

## What MVP means and what it doesn't

An MVP (minimum viable product) is the smallest version of a product that answers one business question with real customers. It is not a Figma mock-up you show friends, and it is not a pitch deck. A person arrives, goes through the whole journey, books or pays, and you see what happened.

The common mistake is to treat an MVP as a cheap, poor version of the "full" product. If the first version is slow, loses orders or gets payments wrong, you learn nothing about demand: people leave because of the bugs, and you conclude the idea doesn't work. So the rule is: few features, and the ones you have work reliably and feel finished. One service that can be ordered and paid for without a hitch is worth more than twenty sections where half the buttons lead nowhere.

What an MVP is not:

- "phase one" of a big specification with half the screens crossed out;
- a version "for investors" that no customer uses;
- a product you hand over and forget: the important part starts after launch.

## Find the riskiest assumption

Every idea rests on a few assumptions. Write them down and ask of each one: if this is wrong, does the rest still make sense?

Usually it is one of three:

1. **Demand.** People want to order or book online instead of calling or walking in.
2. **Payment.** They will pay in advance through Click, Payme or Uzum, at your price.
3. **Staff.** Your team will work the new way instead of keeping the old notebook going on the side.

The riskiest assumption is the one you are least sure of and on which the most depends. The MVP tests that one first. If customers already message you on Telegram every day, demand is not in doubt, but whether they will pay up front is unknown. So the first version has to go all the way to a real payment. If the doubt is about staff, launch in one branch and watch whether the administrators keep records in the system without being reminded.

A useful question to ask yourself: what do I need to see two months from now to put the same amount of money in again? The answer is the goal of the MVP.

## Cut by journey, never by quality

A journey is the path a customer takes from first contact to the result: saw it, chose, placed the order, paid, got a confirmation. A good first version contains one such journey from start to finish, with no gaps. A bad one has a piece of each of five: you can register, browse the catalogue and leave a review, but you can't pay.

How to cut scope when building an MVP:

1. List every journey that comes to mind: order, repeat order, cancellation, refund, loyalty points, review, inviting a friend, the courier's work, the owner's report.
2. Mark the one without which you can't test the main assumption. Sometimes there are two: the customer's path and the shortest path for the staff member who handles that order.
3. For the rest, decide: drop it entirely, replace it with manual work, or postpone it.
4. Inside the chosen journey, keep only the steps that are needed. Registration with a password is often unnecessary: in Telegram the customer is already known, and on a website a phone number with an SMS code is enough.

What you never cut, even in the smallest version:

- testing on real phones, including inexpensive Android models;
- security: personal logins for the admin panel, HTTPS, database backups;
- money: the "paid" status comes from the payment provider, not from a staff member looking at a screenshot;
- the law: customers' personal data is stored on a server in Uzbekistan;
- clear error messages and a way to reach a real person;
- basic analytics: how many people started the journey and at which step they left. Without it the MVP doesn't test anything.

## Manual work behind the scenes is fine

Customers don't care how an order is handled internally. They care that they get an answer quickly and that nothing goes wrong. So a lot of what will later be automatic can be done by a person in the first version.

A hypothetical example: a learning centre with English and programming courses for school pupils, two branches, everything currently done by phone and Instagram. The wish list is an app with accounts, timetables, homework, payment and a bonus for bringing a friend. But there is really only one question: will parents enrol their children and pay for a month online, without coming to reception?

The first version could look like this:

- a Telegram bot in Uzbek and Russian: choose a course and a branch, see group times and the price, tap "Enrol", share a phone number with one button;
- the application is saved to a database on a server in Uzbekistan and appears at once in the administrators' work group;
- an administrator calls, checks the child's level and confirms the place with a button in the bot;
- after confirmation the bot sends a Payme or Click payment link tied to that application, and once the parent pays, the status changes to "paid" automatically;
- courses, timetables, prices and free places are kept in a Google Sheet that the administrator edits and the bot reads. That sheet is the first admin panel.

What's missing: accounts, attendance records, homework, an app for teachers, bonuses. The level check still happens over the phone.

One caveat about the sheet. It holds only things that aren't personal data: courses, groups, prices. Parents' and children's names and phone numbers live in the database on a server in Uzbekistan from day one, not in a foreign cloud service.

Manual work is fine while staff can handle it without strain. When confirmations start taking up most of a shift, that's good news: there is demand, and it's time to automate that particular step rather than something else.

## A Telegram bot or Mini App as the MVP

If your customers already write to you on Telegram, testing demand there is cheaper. You don't have to persuade anyone to download an app, you don't need to publish to the App Store and Google Play, and fixes don't wait for store review. The bot knows the user, the customer shares a phone number with one tap, and notifications arrive in a chat they read anyway.

A button-based bot is enough when the choice is small: a course, a service, a time slot. A Mini App, a web interface that opens inside Telegram, is for a catalogue with photos, filters and a cart.

| First version format | When it fits | Timeline | What stretches it |
|---|---|---|---|
| Button-based bot | bookings, simple orders, a short list | 2–4 weeks | payment, 1C, several branches |
| Telegram Mini App | catalogue with photos, cart, payment | 4–7 weeks | catalogue size, 1C or iiko, delivery zones |
| Web platform | customers come from search, desktop work, B2B | 6–10 weeks | roles and permissions, integrations, custom design |
| iOS and Android app | frequent use, push notifications, camera, location, offline | 2–3 months plus about a week for publishing | store accounts, review, integrations |

These timelines assume everything on your side is ready on time: texts, prices, access, the contract with Click, Payme or Uzum. The business signs that contract itself, and it's best to start on it in the first week of the project. Deadlines slip more often because of waiting than because of programming.

When Telegram stops being enough:

- new customers come from Google and Yandex search, not from chat;
- the product needs background work, offline mode, the camera or precise location, as a courier app does;
- people use it every day, and an icon on the home screen really matters;
- you need complex screens for desktop work: tables, reports, accounts for corporate clients.

Even then the work isn't lost if the backend is built separately from the bot: a website or an app connects to the same database and follows the same rules. More on the choice in [App, website or Telegram Mini App: which one your business needs](/en/blog/app-website-or-mini-app/).

## Features to postpone

These are the features most often requested for version one, and they can almost always wait.

- **Loyalty points.** Retention makes sense for customers who have already come back. First check whether they do. A discount for early customers can be a promo code.
- **Complex roles and permissions.** Two or three are enough at the start: administrator, staff, owner. A detailed permission matrix is for when you have many people and branches. Do allow for roles in the database now, though; it costs little.
- **A third language.** In Tashkent, Uzbek and Russian are usually part of the core journey, not an extra: if your customers speak both, you need both from day one. English can wait until there are customers who need it. Keep interface texts separate from the code so a language can be added without rework.
- **Recommendations and "picked for you".** They need purchase history, which an MVP doesn't have yet. A "Popular" block that an administrator fills in is enough.
- **In-app chat.** A good chat is a project of its own: message delivery, notifications, history, files, and the question of who answers at night. A "Message us on Telegram" button does the same job today.
- **Reviews, ratings, referral schemes, dark mode, elaborate animations.** All useful once people are actually using the product.

Every feature you postpone saves money not only on development but also on testing and on support after launch. Keep the postponed items on a separate list. When it's time for version two, that list is your first draft, and customers will tell you the order.

## Set the numbers before launch

The most common mistake after an MVP goes live is judging it by feel: friends liked it, the first orders came in, "it seems to be working". To avoid that, write the following on one page before the first customer arrives:

1. **What we are testing.** One sentence: "Parents are willing to enrol their children and pay for a month online."
2. **How long the test runs.** Usually 4–8 weeks. Shorter, and there's too little data; longer, and the test drifts on without a decision.
3. **Where people will come from.** A post in your channel, a QR code at reception, a message to your existing customers, a small ad budget. Without people coming in, an MVP shows nothing: the product may be good and simply unknown.
4. **Which numbers we watch.** How many people opened the bot, started an application, reached payment, came back a second time.
5. **Decision thresholds.**
   - **Continue:** the numbers meet the threshold; take the postponed list and plan version two.
   - **Change:** people arrive but most drop out at one step, payment for example. Fix that step and test for another 2–4 weeks, without adding features.
   - **Stop:** people don't come even once they know about it. The assumption is wrong, not the code, and it's better to find out now.

You set the thresholds yourself, based on your own economics. A hypothetical example: "If at least 40 applications come through the bot in six weeks and at least a third of them are paid online, we continue." The numbers here are only an illustration. What matters is that they are written down in advance and everyone who makes the decision agrees with them.

If you work with a contractor, agree on a short weekly report: what was done, what's blocking, which decisions they need from you. In Japanese practice this habit of reporting, informing and consulting is called hōrensō. At the MVP stage it is especially useful, because decisions have to be made quickly. More in [Hōrensō: how your software team should report to you](/en/blog/horenso-reporting/).

## Build it so it can grow

An MVP is small on the outside, but inside it needs a foundation you can keep building on. Otherwise version two starts with rewriting version one.

What to get right from the start:

- **The data model.** Customer, order, product or service, payment, branch as separate entities, even if there is only one branch for now. A Telegram ID is a way to sign in, not the customer: tomorrow the same person will arrive through the website or the app.
- **A backend separate from the interface.** The bot, Mini App, website and app are different windows onto one system through an API. A new channel then doesn't need a second database.
- **Statuses and history.** An order has statuses and a record of who changed them and when. You'll need it for reports and for disputes with customers.
- **Tidy data from day one.** Phone numbers in one format (+998…), prices and texts in the database or the sheet, not in the code.
- **Everything registered to the business.** The domain, the server, the bot in BotFather, developer accounts in the app stores, the payment provider dashboard, the code repository. If the contractor changes, the product should stay with you.

A frank word about no-code builders. Putting the first version together on a bot builder or a no-code platform is sometimes faster and cheaper, and for testing demand it's a reasonable choice. Just know in advance that if it works, part of it will have to be rewritten and the customers and data moved. The problem isn't the choice itself; it's finding that out in year two.

What drives the budget of a first version most: the number of journeys and roles, the number of platforms (Telegram, web, iOS, Android), integrations (each payment provider is connected separately, and 1C is its own piece of work), custom design instead of a template, how complex the admin panel is, and how ready your own materials are. More on app budgets in [What a mobile app costs in Tashkent: where the budget goes](/en/blog/mobile-app-cost/).

Describe your product idea to SamurAI on qilich.com and ask what the smallest useful first version would be.
