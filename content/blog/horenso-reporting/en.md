---
slug: horenso-reporting
lang: en
title: "Hōrensō: how your software team should report to you"
description: "The Japanese practice of hōrensō: report, inform, consult. What to expect from a development team, how often and in what form, so there are no surprises."
date: 2026-10-21
tags: [hōrensō, reporting, project management, outsourcing, process]
related: [mobile, web, telegram, backend]
reading_minutes: 7
---

You found a developer, paid the advance, and for the first few days the chat was lively. Then the replies got shorter: "all on track", "almost done". A month later you see the result for the first time, it isn't quite what you agreed, and the deadline has already slipped. Usually the code isn't the problem. The team simply had no habit of telling the client, regularly and in plain facts, what was going on. Japanese companies call that habit hōrensō. Below: its three parts, what a good report in Telegram looks like, what the team needs from you in return, the signs that a contractor is keeping you in the dark, and the questions to ask before you sign.

## Where the word comes from

Hōrensō (報連相) is built from the first syllables of three Japanese words:

- **hōkoku** (報告): report on progress and results;
- **renraku** (連絡): pass on facts other people need to know, especially changes;
- **sōdan** (相談): consult before making a decision.

Said aloud, it sounds the same as the Japanese word for spinach, which is why it sticks. There's nothing mystical about it. Many Japanese companies teach it to new hires in their first weeks, the way you'd teach someone how to write a business email. The point is simple: the person who is responsible for the result and pays for it should never be the last to hear important news.

When you work with a contractor, you're the one being reported to. The team reports, informs and consults, and you get a picture clear enough to make decisions without reading any code.

## Hōkoku: regular reports with facts

A report isn't a "how's it going?" call, and it isn't the team's reply to your worried messages. It arrives on its own, on the same day, in the same shape.

What goes in it:

1. **Done**, with a link to where you can see it: a test bot, a test build of the app, a page on the staging server, a screenshot.
2. **Next**: the plan until the next report.
3. **Blocked, and what's needed from you**: specific and dated, such as "access to the Payme merchant account by Wednesday".
4. **Timeline and budget**: on track, at risk, or behind, and by how much.

What separates a good report from a bad one:

- **Facts, not adjectives.** "Worked on payments" tells you nothing. "Click payments work in the test bot; we checked a successful payment, a declined payment and a retry" is something you can verify.
- **Status per feature, not a percentage.** "80% done" can last a month in software. A feature list marked done, in review, in progress or not started tells you far more.
- **Short.** Readable on a phone in a couple of minutes. Details sit behind a link.
- **The same format every time.** If the format changes each week, you can't compare one week with the next.

Here's what such a report could look like in Telegram. The project is hypothetical: say, an ordering bot and an operator panel for a chain of three cafés.

```
Report, week 3 (14–18 October)

Done:
1. Menu and cart work in the test bot (link)
2. Click payments: success, decline and retry checked
3. Operator panel: order list, status changes

Next week:
1. Payme
2. Courier screen
3. Daily sales by branch for the owner

Needed from you:
1. Access to the Payme merchant account by 22 October, otherwise Payme moves to week 5
2. Prices for the second branch's menu

Timeline and budget: on track.
Risk: no description of the 1C exchange yet, so we can't estimate sending orders to 1C.
```

## Renraku: bad news early

A delay, a serious bug, a change in a third-party service, an app store rejection, a key developer falling ill: the team tells you the same day it finds out. Not in Friday's report, and not after "we'll have it fixed by then".

A good problem message answers four questions:

1. What happened.
2. What it affects: timeline, money, users.
3. What the team is doing about it.
4. What's needed from you, if anything.

For example: "Apple sent the build back after review: they want a clearer explanation of why the app asks for location. Impact: publication moves by a few days. We'll rewrite the text today and need your approval of the wording by tomorrow."

Contractors sit on bad news because they're afraid of losing the client, or because they hope to fix things quietly. Here's what that silence costs you. If you learn about a one-week delay three weeks before launch, you move the advertising and warn your staff. If you learn the day before, the ads are already paid for and the couriers have been trained on a bot that doesn't exist yet.

Your side of the deal is one condition: don't punish honesty. If every piece of bad news gets a dressing-down, next time you'll get silence.

## Sōdan: ask before deciding

Not every decision should come to you. Picking a library or structuring the database is the team's job. But some decisions belong only to the client:

- anything that changes scope, cost or timeline;
- anything users see: the order flow, texts, design;
- paid third-party services such as SMS, maps, hosting or AI models, because they become your monthly costs;
- where and how customers' personal data is stored. Uzbek law requires the personal data of Uzbek citizens to be stored on servers located in Uzbekistan, which affects your choice of hosting. More in [Storing personal data in Uzbekistan](/en/blog/personal-data-in-uzbekistan/).

A proper question has this shape: the problem, two or three options with cost, time and consequences, the team's recommendation, and the date by which an answer is needed. "How should we do it?" with no options isn't sōdan. It's handing the team's work to you.

Example. Halfway through the project it turns out café customers want to repeat a past order with one tap. The team writes:

- **A. Full version now:** a "repeat" button that checks the dishes are still on the menu. Plus 3–4 days; launch moves.
- **B. Simple version now:** order history, and the customer adds the dishes again by hand. Plus 1 day.
- **C. After launch:** the full version in the first round of improvements. The date doesn't change.
- **We recommend C:** it's worth seeing first how often people really reorder. We need an answer by Thursday.

Once a decision is made, it gets written down: the date, what was decided, who decided, and how it changes time and cost. A Telegram chat history isn't a log. Two months later nobody will find who approved "repeat order", or when. Keep the decision log as a separate document or a section on the task board.

## What it looks like week to week

| When | What | Your time |
|---|---|---|
| Every Friday | written report in Telegram | 5 minutes |
| Every 1–2 weeks | demo: the team shows the working product, not slides | 20–40 minutes |
| Same day | message about a problem | as needed |
| When needed | a question with options | answer within the agreed time |
| End of each stage | summary: what's done, what's been spent, what changed in scope | 30 minutes |
| Always | a task board you can open | whenever you like |

Take a hypothetical 8 to 10 week project: a Telegram bot with a mini app for booking appointments at a clinic. The rhythm might go like this:

- **Week 1:** kickoff. Agree who the contact is on each side, and which day and in which chat reports arrive.
- **Weeks 2–3:** first demo, a clickable mock-up of the booking screens. Changes made before coding starts are the cheapest you'll ever get.
- **Weeks 4–5:** the first working version in a test bot. You and a couple of receptionists try booking appointments yourselves.
- **Weeks 6–8:** payments, reminders, the admin panel. A demo every week.
- **The last 1–2 weeks:** testing on real scenarios, fixes, launch.

All told, it takes half an hour to an hour of your time a week. That's the price of having no surprises.

To be straight about money: this kind of reporting takes the team's time too. A project manager writes the reports, prepares the demos and keeps the decision log, and those hours are part of the estimate. If one quote is much lower than the others, check whether this is where the saving came from.

## What the client owes the team

Hōrensō works both ways. If reports keep coming and answers don't, the project stalls just as it would with a silent contractor.

- **One decision-maker**, or one contact who can get decisions quickly. Three partners giving contradictory instructions in a group chat is a common reason deadlines slip.
- **Answers within an agreed time.** For instance, questions within one working day, and decisions with options within two or three days. If your answer is late, the deadline moves too, and the team is right to say so in the report.
- **Access.** Click, Payme or Uzum merchant accounts, 1C, hosting, the domain, App Store and Google Play developer accounts. All of them registered to your company, with access given to the team.
- **Materials.** Texts, prices, photos, in both languages if the interface is in Uzbek and Russian.
- **Specific feedback.** "The payment button doesn't respond on a Samsung, screenshot attached", not "something feels off".
- **Your own news.** The process changed, the budget was cut, a branch opening was postponed: that's renraku too, and the team needs to hear it right away.

## Red flags in a contractor

- Weeks with no news; replies come only when you ask.
- "Almost done" or "90%" for a month.
- The first demo comes at the very end, and until then there's nothing to look at.
- Decisions are made on calls and nothing is written down.
- Reports say "worked on…" with no links and no results.
- You hear about a problem together with an invoice ("it turned out harder, we need extra payment"), although the difficulty was visible long before.
- You have no access to a test version or to the code repository.
- They can't tell you who exactly is working on your project.

If this sounds familiar, ask them to show you what works right now within a few days, and to send a feature list with statuses. If they can't, that's your answer.

## Questions to ask before signing

The same questions work for a freelancer, a studio or an outsourcing company:

1. How often and in what form do you report? Can I see a sample report with client details removed?
2. Who is my contact, and who covers when they're on holiday or ill?
3. Where are tasks tracked, and will I have access?
4. Where are decisions recorded, and how are changes to scope and price agreed?
5. When is the first demo, and how often after that?
6. What do you do when you see you won't make a deadline?
7. Which language will reports and demos be in: Uzbek, Russian or English?
8. What do you need from me, and how quickly?

Put the answers in the contract or an appendix to it: how often reports and demos happen, response times on both sides, and a rule that scope changes are agreed in writing. For how to structure the contract itself when scope may still change, see [Fixed price or hourly: how to set up a software development contract](/en/blog/fixed-price-or-hourly/).

If you'd like to see what a weekly Qilich report looks like, write to inbox@qilich.com and we'll send you a sample.
