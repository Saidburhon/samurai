---
slug: fixed-price-or-hourly
lang: en
title: "Fixed price or hourly: how to set up a software development contract"
description: "The questions that matter in a development contract: payment model, stages, acceptance criteria, who owns the code and accounts, and the warranty."
date: 2026-10-21
tags: [contract, fixed price, time and materials, acceptance, process]
related: [mobile, web, telegram, support]
reading_minutes: 8
---

A familiar story: you agreed a price, paid the advance, and two months later the project is "almost done" while the contractor asks for extra money for work you thought was included from the start. Or the reverse: you paid by the hour, the reports kept coming, and the budget ran out before there was anything you could actually use. These disputes rarely start with bad code. They start with a contract that leaves out the parts that matter.

The choice between fixed price and time and materials matters, but less than most people think. What protects you more is a handful of clauses: what counts as done, what you pay for and when, whose name the code and accounts are in, and what happens after acceptance. The same questions apply whether you hire an agency in Tashkent, a team abroad or a freelancer. Below: how to choose a payment model and what to check in the contract before you sign.

## Fixed price: when it works

Fixed price works when the scope is clear and won't move: a landing page, a company website, a booking bot with known steps, a 1C integration where the data exchange is already described. You know the amount and the date up front, and the contractor carries the risk of getting the estimate wrong.

You pay for that risk. An honest agency adds a margin for the unknown, and the vaguer the task, the bigger the margin. So a fixed price quoted from a half-page brief is usually either expensive or so narrowly worded that it later gets read against you.

Fixed price only works if the contract has three things:

- **A detailed scope** in an appendix: screens, roles, user flows, integrations, languages. Anything not listed isn't in the price.
- **An explicit "not included" list**: entering content, moving data from the old system, publishing to the App Store and Google Play, copywriting, photos.
- **A change request procedure.** Every change is put in writing: what changes, why, what it costs, how far the date moves. Work on it starts only after you approve it.

A warning sign: the contractor quotes a fixed price without asking a single question and agrees to everything. After that, an argument about what was "included" is close to guaranteed.

## Hourly or time and materials: when it works

With hourly billing, or time and materials (T&M), you pay for the hours the team actually spends, at agreed rates. It's the honest model for a product that will keep changing: a startup testing ideas, an app that evolves after launch based on customer feedback, a scope nobody can pin down in advance. You don't pay a risk margin, and you can change priorities every week without renegotiating the contract.

The risk is now yours: if the team is slow or the task turns out harder than expected, you pay. Without controls, T&M becomes a bottomless pit. What the contract needs:

- **Rates by role**: developer, designer, tester, project manager. Plus when and how rates can be reviewed.
- **A budget ceiling** per month or per stage. The contractor warns you well before reaching it, say when three quarters are spent, and never goes over without your written approval.
- **Reports by task, not by person**: hours per task and what came out of it. A line that reads "development: 160 hours" tells you nothing.
- **Regular demos**, so you see working software and not just a timesheet.
- **The right to stop**: you can end the work with agreed notice and receive everything you've paid for.

## The middle path: plan first, then fixed stages

Most projects are clear in outline but not yet in detail, and for them a third option fits best. It starts with a short, paid planning stage: an analyst and a designer walk through your processes, write the specification, draw the key screens and estimate the work part by part. Depending on the number of roles and integrations, that usually takes one to two weeks, or three to five if you also want a clickable prototype. After that, each development stage gets its own fixed price and date.

Why this works in the client's favour:

- you commit a small sum before you commit the whole budget;
- the planning output (specification, prototype, estimate) stays with you, even if you take it to another contractor;
- each stage is priced against a clear scope, so the risk margin is smaller;
- after every stage you can revisit the plan, dropping or adding things without rewriting the contract.

This is the Japanese habit of planning before building. A mistake is cheapest to fix on paper and most expensive to fix in finished code. What to prepare for the planning stage is covered in [How to write a brief for an IT agency](/en/blog/brief-for-it-agency/).

The three models side by side:

| | Fixed price | Time and materials | Plan, then fixed stages |
|---|---|---|---|
| Fits when | scope is clear and stable | the product keeps changing | the task is clear in outline |
| Estimate risk sits with | the contractor (who adds a margin) | the client | shared: you carry the small planning stage, the contractor carries each stage after it |
| What you control | the scope document and changes | hours, the ceiling, demo results | acceptance of each stage |
| Typical trap | arguing over what was "included" | budget gone, no product | stages that are too large |

## Stages and payments

The core rule: pay for accepted results, not for time passing. "On the 30th of every month" is a poor payment schedule for a fixed-price project. "After the stage 2 acceptance act is signed" is a good one.

How to cut the stages:

1. Each stage ends with something you can see and check: a working menu in a test bot, a Click payment in test mode, an operator panel.
2. Keep stages short. If more than six to eight weeks pass between acceptances, you go too long without seeing results. Two to six weeks is a comfortable length.
3. Order them by importance: first the main path from the first screen to payment, then everything else.

For example, an ordering bot for a restaurant with three branches might be staged like this: planning and specification; menu, cart and checkout; payment through Click and Payme; operator and courier screens; data exchange with 1C; launch and test period.

The advance is a negotiation. The contractor needs it to commit a team to you; you don't want to pay for things that don't exist yet. A sensible compromise is an advance for the first stage, not for the whole project. Some clients also hold back part of the final payment until the test period ends.

For companies in Uzbekistan, a stage is closed with an act of completed work, and the act and the invoice often go through Didox or Faktura.uz. Agree in advance who on your side signs them with an electronic signature, or payment can sit for a week.

## Acceptance criteria: what "done" means

The most common source of conflict is that the client and the contractor picture "done" differently. Write it down before work starts, in the specification or a contract appendix.

What to include:

- **Features and flows**: which actions a user can complete from start to finish, including the exceptions: cancelling an order, a failed payment, a retry.
- **Devices and browsers**: for example, Android from a stated version up, iPhone, Chrome and Safari, screens from 360 pixels wide. If your customers use budget Android phones, testing on one is not optional.
- **Speed**: for example, the menu opens within a couple of seconds on mobile internet. The condition has to be measurable, not "works fast".
- **Languages**: Uzbek (Latin script, and whether Cyrillic is needed) and Russian, covering every text, including error messages and notifications.
- **Data and load**: how many products in the catalogue, orders per day, users at the same time.
- **Test period**: how many days you get to check (for example, five to ten working days), how you report bugs, and what happens if you say nothing. Many contracts treat a stage as accepted if no objections arrive in time. That's fair; just put the deadline in your calendar.

Separate bugs from wishes. A bug is a deviation from the specification, and the contractor fixes it within the stage. "Let's make the button green" is a change, and it goes through a change request.

## Who owns what

Problems here cost the most and surface the latest: you decide to switch contractors and find that the bot is on their account, the domain is in a former employee's name, and you never had the source code.

What should be in your name or handed over to you:

- **Source code**, in a repository (GitHub, GitLab) owned by your company, with the contractor working in it as a member. Not an archive at the end of the project, but access from day one.
- **Design files**: Figma mockups in your workspace, or handed over in their original form.
- **The domain**, registered to your company.
- **Hosting and servers**, on an account in your name. If the system stores personal data of Uzbek citizens, Uzbekistan's personal data law requires that data to be stored on servers in Uzbekistan. More in [Storing personal data in Uzbekistan](/en/blog/personal-data-in-uzbekistan/).
- **App Store and Google Play developer accounts**, in your organisation's name. Registering an organisation takes time (Apple, for example, asks for a D-U-N-S number), so start in the first week.
- **The Telegram bot**, registered from a Telegram account your company controls, not from a developer's personal account. The contractor gets the bot token from you.
- **Merchant accounts with Click, Payme and Uzum**: the business itself, not the contractor, signs the contracts with payment providers.
- **Access and documentation**: a list of every service, password and key, and instructions for deploying the system.

Paying for the work doesn't always mean the rights to the code have passed to you. Write in a transfer of exclusive rights to the code and design once each stage is paid, and state separately on what terms the contractor may use its own existing libraries and open-source components. Have a lawyer check these clauses: this article covers the business side of the contract and isn't legal advice.

## Warranty and support

Warranty and support are different things, and the contract should keep them apart.

**Warranty** means the contractor fixes, free of charge, bugs found after acceptance, that is, deviations from the accepted specification. The period is negotiated. Ideally it covers at least one full cycle of your business: for example, a month-end, if the system produces reports or exports to 1C. Write down how bugs are reported and how quickly the contractor picks them up.

What the warranty doesn't cover: new features, changes you ask for after acceptance, problems caused by someone else editing the code, and changes on the side of Telegram, the payment providers or 1C.

**Support** is a separate agreement that starts when the warranty ends: servers, backups, updates, App Store and Google Play requirements, small changes, response times for outages. It's usually paid monthly, either as a fixed fee or as hours with a cap. Ask for the support price in writing before you sign the main contract, so you know the full cost of the first year. What it should cover: [After launch: what maintaining an app or website actually involves](/en/blog/maintenance-after-launch/).

## Communication belongs in the contract too

Many disputes aren't about code at all, but about who said what, and when. So the rules of communication deserve the same treatment as deadlines.

- **Reporting rhythm.** A weekly report in the same format every time: what was done, what's next, what's needed from you, where the timeline and budget stand. Bad news the same day. Japanese teams call this hōrensō; more in [Hōrensō: how your software team should report to you](/en/blog/horenso-reporting/).
- **Contact people.** One person on each side who can make decisions, plus a stand-in for holidays.
- **Response times on both sides.** If you take a week to grant access to 1C, the deadline moves, and the contract should say so.
- **How decisions are recorded.** Anything agreed on a call or in a Telegram voice message gets confirmed in writing in the shared chat or by email. Scope changes go only through a change request.
- **Language of the documents.** The contract can be in Uzbek, Russian or both. If there are two versions, state which one prevails when they differ. Specifications and acceptance acts should be in the language of the person who accepts the work.

## Common mistakes

- Comparing fixed prices from different contractors without comparing what each one covers. The cheapest quote often means the narrowest description.
- Signing without a scope appendix. "Development of a mobile app" is not a scope.
- Accepting a stage from a demo on the developer's laptop instead of testing on your own devices with test payments.
- Letting the contractor register everything in their own name "to save time".
- Leaving out what happens if the contract ends early: what you pay for, what you receive, and how soon.
- Insisting on a fixed price for a product you yourself plan to change every week. The contractor will either add a large margin or argue over every change.

To see how a Qilich contract splits a project into stages, write to inbox@qilich.com.
