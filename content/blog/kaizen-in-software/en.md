---
slug: kaizen-in-software
lang: en
title: "Kaizen in software: why small improvements beat big releases"
description: "Launch is not the end of the project. How to improve a site, app or bot a little every month, how many hours to budget, and what to measure."
date: 2026-10-21
tags: [kaizen, continuous improvement, product development, maintenance, process]
related: [sup-sla, cloud-devops, sup-qa, sup-dedicated-team]
reading_minutes: 8
---

Kaizen (改善) in software means improving a site, app or bot a little every month instead of saving a year of changes for one big release: pick one number, change one thing, measure it, then keep or roll back the change. Agree a fixed monthly volume of work with a steady rhythm of review, development, release and report, and protect frequent changes with automated tests of ordering, payment and login. Small releases show what worked and get each idea to customers within weeks.

Your site, app or bot is live and orders are coming in. Six months later you have a list of complaints: the booking form is too long, operators grumble about the admin panel, and the chat gets the same question every day. The usual response is to save it all for "version two" and then, two or three years on, to order a full rebuild. That costs a lot, takes months, and can break things that used to work. There is another way, known in Japan as kaizen: change the product a little at a time, every month, and check each time whether it actually got better. Below: what that looks like in practice, how many hours to budget, how to change things often without breaking them, and what to measure.

## What kaizen means, without the myth

Kaizen (改善) is simply the Japanese word for "improvement", a change for the better. It became widely known through Japanese manufacturing, above all the Toyota Production System, where workers on the line keep finding small losses and removing them without waiting for a big reorganisation. It is a working habit, not a slogan for the wall.

In software, kaizen is a rhythm of work:

- work on the product does not stop on launch day;
- each change is small and has a clear purpose;
- results are judged by a number, not by an impression;
- a change that didn't help is rolled back calmly, without hunting for someone to blame.

What kaizen is not:

- **An excuse for a half-finished launch.** "We'll fix it later" is not kaizen. Small improvements sit on top of a reliable foundation; they don't replace it.
- **A ban on big changes.** Sometimes a module has to be rewritten or the platform replaced. That too can be done in pieces.
- **Cosmetics.** Recolouring a button for the monthly report is not an improvement if no number moved.

## Why big releases are risky

Collecting a year of requests and shipping them in one big update feels logical. In practice:

- **You can't tell what worked.** The design, menu, payment flow and copy all changed at once, and orders went up or down. There's no way to find out why.
- **Long waits.** An idea from March reaches customers in December. Meanwhile the season, prices and competitors have changed, and some of the requests no longer matter.
- **Bigger bugs.** The more changes go out together, the more places something can break and the longer it takes to find. You usually can't roll back half a release.
- **Money up front.** You pay for months of work before you learn whether it helps.
- **Strain on staff.** Operators and cashiers have to relearn everything at once.

A small change costs less, is easy to undo if it doesn't work, and its effect can be seen on its own.

## The small-change loop

Every improvement goes through the same steps:

1. **Pick one number.** What exactly should get better: the share of bookings completed, the time to process an order, the number of repeat questions in the chat.
2. **Write down the starting value.** What it is now, and over what period. Without that baseline there is nothing to compare against.
3. **Make one change.** One, not five.
4. **Wait and measure.** Usually two to four weeks, longer if traffic is low. Compare like with like: an ordinary week against an ordinary week, not a holiday week around Navruz or the month of Ramadan against a normal month.
5. **Keep or roll back.** If the number improved, keep the change and pick the next task. If it didn't move or got worse, revert and write down what you learned. A negative result still counts: nobody has to argue about that idea again.

A hypothetical example. A restaurant with three branches takes table bookings through a Telegram bot. The form has eight fields: name, phone, email, branch, date, time, number of guests, and "how did you hear about us". Analytics show that plenty of people start a booking, but noticeably fewer reach the confirmation. The number to watch: the share of started bookings that get confirmed. The change: drop the email and "how did you hear about us" fields, and take the phone number through Telegram's "share contact" button instead of typing. After a month, compare with the previous month. If the share went up, keep it. If the hosts now find they are missing information, bring one field back, but as a separate, later step.

One honest caveat. If you have few customers, say a few dozen a week, an A/B test that splits users into two groups will tell you almost nothing: the difference gets lost in random noise. In that case compare before and after over a longer period, and add observation: ask five to ten customers to book while you watch and to think out loud, or spend an hour sitting next to the host who takes bookings.

## Where improvement ideas come from

There are usually more ideas than time. The main sources:

- **Support chats.** If people ask "where is my order?" in Telegram every week, the problem isn't the customers. The order status simply isn't visible anywhere.
- **Analytics.** Which checkout step people leave at, which screens nobody opens, where payments through Click, Payme or Uzum fail most often.
- **Staff.** Operators, couriers, cashiers and administrators use the system all day and know exactly where the extra taps are. Ask them: "What do you do by hand that the system could do for you?"
- **Your own use.** Once a month, place an order yourself: on an inexpensive Android phone, over mobile data, once in Uzbek and once in Russian.
- **Reviews** on Google Play, the App Store and maps.

All ideas go into one shared list, not five different chats. For each one, record:

- where it came from;
- which number it should improve;
- value: high, medium or low;
- effort: hours, days or weeks.

Take the valuable, cheap items first. Split the valuable, expensive ones into parts that can ship one at a time. Cross out the cheap but useless ones. That is a decision too, so write it down, or the same discussion will come back next month.

## A monthly rhythm and budget

Instead of a rebuild every few years, agree a fixed amount of work every month. For example:

- **Week 1.** You and the project manager review last month's numbers and pick tasks from the list.
- **Weeks 2 and 3.** Development and checking on the test version.
- **Week 4.** Release, measurement and a report: what was done, what changed in the numbers, what the team suggests next.

How many hours to budget depends on the product. As a rough guide:

- a small bot or website: 10 to 20 hours a month, enough for one or two improvements plus minor fixes;
- a product with payments, customer accounts and a 1C integration: 40 to 80 hours;
- an app on several platforms that carries most of your revenue: often a dedicated developer, part-time or full-time.

The scope grows when the product runs on several platforms (iOS, Android and web are three separate pieces of work), when changes need coordination with a third party (your 1C programmer, the payment provider), when there are no automated tests, and when the code was written by another contractor. In that last case the first one or two weeks usually go on an audit and tidying up.

What to put in the contract:

1. The number of hours per month, and what happens to unused hours: do they carry over or expire?
2. How improvements differ from bug fixes. Bugs found during the warranty period should not eat into improvement hours.
3. Urgent failures, such as payments not going through or the bot not responding, are handled outside the queue, with their own response time.
4. Who sets priorities: you, on the team's recommendation.
5. The format of the monthly report. For what a good one looks like, see [Hōrensō: how your software team should report to you](/en/blog/horenso-reporting/).

For everything else that post-launch work covers besides improvements, see [After launch: what maintaining an app or website actually involves](/en/blog/maintenance-after-launch/).

To be straight about the limits: kaizen doesn't mean you will never need a rebuild. If the platform is obsolete, the business model has changed, or every change breaks something elsewhere, that needs a proper conversation. The difference is that with regular work you make that call based on facts, not because "everything piled up".

## Changing often without breaking things

Frequent change is only safe when a few conditions are in place:

- **Automated tests for the critical paths:** ordering, payment, login, booking. Every release has to pass them before it reaches customers.
- **A test copy.** A separate test bot, a test server, the payment provider's test mode.
- **Gradual rollout.** Google Play lets you release an update to a share of users first, and the App Store has phased release. On the web and in a bot, a new feature can be switched on for one branch or for staff only before everyone else.
- **Fast rollback.** A website or bot can go back to the previous version in minutes, if this was set up in advance. Mobile apps are harder: you can't pull back a version already installed on someone's phone, and a fix has to pass store review again. That is why risky features in an app should be built with a switch on the server, so they can be turned off without a new release.
- **A database backup** before every change to its structure.
- **Error alerts.** The team should learn about a failure before a customer writes about it in the chat.
- **Sensible release timing.** Not on Friday evening, and not the day before a big promotion.

If the project doesn't have these yet, spend the first months putting them in place. Without tests and rollback, frequent changes turn into frequent outages.

## What to measure

One or two numbers per area. Any more and people stop looking at them.

| Area | What to measure |
|---|---|
| Online sales | share of started checkouts that end in payment |
| Bookings and requests | share of completed bookings, number of no-shows |
| Staff work | time per order, number of mistakes in orders |
| Support | requests per week, the most common questions |
| Speed | load time on an inexpensive Android phone over mobile data |
| Reliability | failed payments, app crashes, 1C sync failures |

Each number needs a starting value, a target and a person who watches it. For turning these numbers into money, see [Will automation pay for itself? A simple way to calculate it](/en/blog/automation-roi/).

## Kaizen for the team, not only the product

The same rules apply to how the team works. After every serious problem, the team writes a short review. It looks for the cause, not the culprit: if a person made a mistake, the process allowed it.

What goes into the review:

1. What happened and when.
2. Who was affected and how badly.
3. How it was spotted and how it was fixed.
4. Why it happened. The "five whys" technique from Toyota's practice helps here: keep asking "why?" until you reach a cause you can actually remove.
5. What changes so it doesn't happen again, who owns it, and by what date.

A hypothetical example: after the backend moved to a new domain, payment statuses stopped updating. Why? The payment provider was still sending notifications to the old address. Why? Nobody changed the address in the provider's dashboard. Why? The team had no checklist for server moves. The fix is not a reprimand for the developer. It is that checklist, plus an alert when payment notifications stop arriving for longer than usual.

Common mistakes that cancel out kaizen:

- changing several things at once, then guessing which one worked;
- measuring for two days and drawing conclusions;
- not recording the starting number;
- improving something almost nobody uses;
- skipping tests to "ship faster";
- keeping an idea list with no priorities, so whoever asks loudest gets their way.

Tell SamurAI on qilich.com what annoys you most about your current site, app or bot. That is a good place to start the first improvement cycle.
