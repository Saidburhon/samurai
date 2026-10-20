---
slug: brief-for-it-agency
lang: en
title: "How to write a brief for an IT agency and get an accurate quote"
description: "A good brief makes the estimate sharper and the deadline more reliable. What to put on one or two pages: goal, users, features, limits, budget."
date: 2026-10-21
tags: [brief, specification, project estimate, timeline, process]
related: [web, mobile, telegram, support]
reading_minutes: 9
---

You sent the same message to three companies: "We need a website that takes orders online, how much?" The three prices that came back differ several times over. Usually nobody is cheating. Each company pictured a different product. One priced a single page with a form that sends the order to a manager's Telegram. Another priced a catalogue pulled from 1C, payment through Click and customer accounts. A brief closes that gap. The good news is that you don't need to know programming or write a technical specification to produce one. You need to describe, honestly, the business problem, the people who will use the system and the limits you work within. Below: what to put in each section, the questions a good agency should ask you back, and a one-page template you can copy and fill in.

## A brief is not a technical specification

A technical specification describes how the system will be built: screens, roles, fields, statuses, integrations, and what has to work for the job to count as accepted. The agency writes it: an analyst works from your brief and one or two meetings with you. A brief answers a different question: why the business needs this. What the problem is, who suffers from it, how the work is done today, what can't change, how much money and time there is. One or two pages in plain language.

Responsibility splits like this:

- **You own the truth about the business.** How processes actually run, which exceptions happen, who makes decisions, who provides access, texts, photos and prices. The contract with the payment provider is signed by the business too, not by the developer.
- **The agency owns the translation.** It turns your brief into a specification, estimates it part by part, names the risks and proposes a simpler option when there is one. Asking when something is missing is also its job.

Many owners start by downloading a specification template and filling it in. The template describes someone else's project, and the owner ends up making decisions that aren't theirs to make: "built on React", "with microservices", "a separate iOS app". Picking the technology up front rules out simpler and cheaper options. If you already have a specification, send it, but add the brief part on top: why, and for whom.

This holds whether you're ordering a website, a bot or an app. For a mobile app the agency still writes the specification; it just has more sections: iOS and Android screens, notifications, publishing to the App Store and Google Play.

Japanese teams plan first and build second. A decision is cheapest to change on paper and most expensive to change in finished code. A good brief is the first step of that planning, and you are the one who takes it.

## The goal in one sentence you can check

The formula: who will be able to do what, which current problem goes away, and how you'll know it worked.

- Weak: "We need a modern website." "An app like the big marketplaces have." "Automate everything."
- Strong: "Customers order delivery without calling, and operators no longer retype orders from Telegram into 1C. A month after launch, phone orders should be at least halved."
- Strong: "Patients book a doctor themselves at any hour, and the receptionist no longer keeps appointments in a notebook."

The check is something you can count before and after: calls per day, minutes per order, mistakes on invoices, requests nobody answered. Count the "before" now, while you still work the old way. Without that number, a month after launch nobody can say whether the project worked.

If you have two goals, rank them. The first one shapes version one; the second goes to the next stage.

## Who will use it

Every site, app or bot has several kinds of users. For each one the agency needs four facts: how many there are, what devices they use, which language they read, and how comfortable they are with apps.

For example, a café chain with three branches and its own delivery might describe its users like this:

| Who | How many | Device | Language | What they do |
|---|---|---|---|---|
| Customers | hundreds a week | mostly budget Android phones, some iPhones | Uzbek (Latin) and Russian | pick dishes, pay, track the order |
| Operators | two per shift | computer at the till | Russian | enter phone orders, edit, cancel |
| Couriers | six | own phones, mobile data | Uzbek | see the address, mark "delivered" |
| Owner | one | iPhone | Russian | checks revenue by branch in the evening |

Why this changes the estimate:

- each role is its own set of screens and permissions, and the staff panel often turns out bigger than the customer side;
- two languages means translation plus checking that long Uzbek words still fit on buttons. Say whether you also need Uzbek in Cyrillic;
- budget phones and weak mobile internet in the regions call for light pages and screens;
- if many customers or staff are older and haven't used apps much, plan for fewer screens and more clearly labelled buttons.

Rough numbers are fine. The agency cares more about the order of magnitude (tens, hundreds or thousands a day) than the exact figure.

## How it works today

Describe the current process step by step as it really runs, not as it was meant to run. Include the workarounds: "the operator copies the order from Telegram into Excel, phones the kitchen, and in the evening the accountant re-enters everything in 1C." The workarounds are where time and money leak, and they are what the new system should remove.

Attach what you already have:

- screenshots of the Excel file you work from;
- screenshots of the Telegram work chat where orders come in;
- photos of the paper form, the logbook, the delivery note;
- a sample invoice or a 1C export;
- the report the owner looks at every week.

Before you send anything, blur customer names and phone numbers. The agency needs the structure of the data, not the personal data itself.

List the exceptions separately: cancellations, returns, swapped items, out of stock, partial payment, wholesale prices for regulars. This is where estimates fall apart most often. The main path is relatively easy to build; "what if the customer changes their mind after paying?" adds screens, statuses and checks.

Add volumes too: orders per day, items in the catalogue, number of branches, peak hours.

## Must have, nice to have, not now

Sort the features into three lists.

1. **Must have.** Launching without it makes no sense. The test: "If this isn't there on launch day, do we still launch?" If yes, it doesn't belong here.
2. **Nice to have.** Worth doing if it fits the budget and the deadline.
3. **Not now.** Things you are deliberately postponing: a loyalty programme, a separate courier app, analytics, a second language for the internal panel.

The third list saves money even though nothing on it gets built. Without it the agency guesses what you meant and adds a buffer for the guesses. With it, the system can be prepared cheaply for a later feature without building the feature now, for example by leaving room in the database for loyalty points. Every feature costs development, then testing, then support after launch, so a feature you didn't need costs you more than once. And when "while we're at it, could we also…" comes up mid-project, there is already a place to put it without an argument.

How to decide what goes into version one is covered in [MVP: what to leave out of the first version](/en/blog/mvp-first-version/).

## Systems it has to work with

List everything the new system has to exchange data with, and who on your side is responsible for each.

- **1C**: which configuration, standard or customised, where the database runs (your own server or the cloud), who your 1C programmer is. A customised configuration almost always means more integration work.
- **CRM**: amoCRM or Bitrix24, which plan, who the administrator is.
- **Payments**: Click, Payme, Uzum. Is there a contract yet, do you need fiscal receipts, are the product codes (IKPU) filled in for the catalogue? The business signs the contract, and it's best to start the paperwork in the first week of the project.
- **E-invoicing**: Didox or Faktura.uz, and who holds the digital signature the invoices are signed with.
- **The current website**: where the domain is registered, where it's hosted, who has the passwords.
- **The Telegram bot**, if there is one: whose account it's registered to.
- **Developer accounts** on the App Store and Google Play, if this is an app.

Give a separate line to who holds the access and admin rights. A common story: the domain is in a former employee's name, the bot belongs to a freelancer who no longer replies, and nobody remembers the hosting password. Recovering access sometimes takes longer than the work itself, so start finding out now.

One more limit belongs in the brief. If the system will store customer data, Uzbekistan's law on personal data requires Uzbek citizens' personal data to be stored on servers in Uzbekistan. That affects the choice of hosting and sometimes the price. More in [Storing personal data in Uzbekistan](/en/blog/personal-data-in-uzbekistan/).

## Budget range and deadline, honestly

Many owners keep the budget to themselves, worried the agency will simply price up to it. In practice, leaving it out works against you. The same goal can be met several ways: a bot with a spreadsheet, a Telegram mini app, a website or a mobile app. An agency that doesn't know your limits will either quote the full, expensive version or cut features at random. Give it a range and it will propose what fits, or tell you plainly that nothing sensible fits.

To avoid overpaying, ask for the estimate broken into parts: what's included, what isn't, what each stage costs and how long it takes. Quotes in that form can be compared line by line. Also be clear about what your own budget covers: development only, or design, texts and photos, servers, payment provider fees, App Store and Google Play accounts and first-year support as well.

What moves the estimate most:

- the number of roles, and the screens each role needs;
- integrations, especially with a customised 1C;
- payments and fiscal receipts;
- a two-language interface;
- the admin panel and reports, where each new report is a separate task;
- platforms: Telegram only, or web, iOS and Android too;
- moving data over from an old system or from Excel;
- hosting in Uzbekistan;
- support after launch.

**Deadline.** Separate a real deadline from a wished-for one. A real one is tied to an event: a branch opening, the start of the season, Ramadan, a trade show. A wished-for one sounds like "as soon as possible". If the date is fixed, say why. Then the scope becomes the thing that moves: you agree with the agency what will be ready by that date and what comes in the next stage.

Count your own time as well. Schedules slip more often from waiting than from programming: waiting for answers, for access to 1C, for the payment contract, for texts. Name one person who answers questions within a day and can make decisions.

For orientation: from a good brief, an agency can usually give a preliminary range within a few days. A firm price and a stage-by-stage plan come after a short analysis stage in which the specification is written. That stage usually takes one to two weeks, longer when there are many roles and integrations. Every "don't know" in the brief turns into a buffer in the estimate. Writing "don't know" is still fine, and more honest than guessing; a good agency will ask.

How to set up the contract while the scope may still change: [Fixed price or hourly: how to set up a software development contract](/en/blog/fixed-price-or-hourly/).

## Questions a good agency asks back

A brief starts a conversation; it isn't an order. The questions you get back show whether the agency understood the problem.

- What does this problem cost you today: time, money, lost customers?
- Who will use the system every day, and who will keep prices, texts and photos up to date?
- What happens on a cancellation, a return, a failed payment?
- What can wait for the second stage?
- Is there a simpler route: configuring the CRM you already pay for, a bot instead of an app?
- Whose name will the domain, the bot and the App Store and Google Play accounts be registered in? Do you get the source code?
- Where will customer data be stored?
- Who on your side tests and accepts the work?
- What happens after launch: who fixes bugs, how does support work?
- How often, and in what form, do you want progress reports?

Be careful if:

- you got a price without a single question;
- "everything included" comes without a list of what that means;
- they agree to everything and never once say "this could be simpler" or "you don't need this in version one";
- testing and support aren't mentioned at all;
- the domain, the bot and the accounts are being registered to the contractor.

Agree on regular reporting up front as well: what's done, what's blocking, which decision is needed from you. Japanese teams call this hōrensō; more in [Hōrensō: how your software team should report to you](/en/blog/horenso-reporting/).

## A one-page template

Copy it, fill it in and send it. Where you don't know the answer, write "don't know".

1. **About the company.** What you do, how many branches and staff, a link to your site or Telegram channel.
2. **Goal.** One sentence: who will be able to do what, and which current problem goes away. Which number will show it worked, and what it is today.
3. **Users.** Who (customers, staff, managers), how many, on which devices, in which language: Uzbek in Latin or Cyrillic, Russian.
4. **How it works today.** The steps, the workarounds, the exceptions (cancellation, return, out of stock). Volumes: orders per day, items, branches, peak hours. Attachments: screenshots of spreadsheets and chats, photos of forms, with customer data removed.
5. **Features.** Must have. Nice to have. Not now.
6. **Systems.** 1C (configuration, standard or customised), CRM, payments (Click, Payme, Uzum; contract or not), Didox or Faktura.uz, current site, bot. Who holds access and admin rights.
7. **Limits.** Where customer data must be stored, what can't change, any security requirements.
8. **Budget and deadline.** The budget range and what it covers. Launch date: fixed (and why) or wished-for.
9. **Contact.** Who answers questions and makes decisions, and how to reach them.

When it's filled in, send it to inbox@qilich.com, or describe the project to SamurAI on qilich.com. We'll start with questions.
