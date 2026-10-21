---
slug: automation-roi
lang: en
title: "Will automation pay for itself? A simple way to calculate it"
description: "When the money spent on software or a bot comes back: how to count hours saved, fewer errors, orders not lost, and the running costs."
date: 2026-10-21
tags: [automation, ROI, payback, business processes, Telegram bot]
related: [business, telegram, ai]
reading_minutes: 10
---

A contractor has sent a quote for a Telegram ordering bot, and it's a single number. A CRM salesperson says it will "pay for itself in three months" but doesn't show the maths. Your accountant wants to know which budget the monthly support fee comes out of. You don't need a consultant or a financial model to decide whether a project is worth the money. A spreadsheet, two weeks of observation and honest assumptions are enough. Below is a method an owner or finance person can use to estimate the payback before the project starts, and to check afterwards whether the estimate held.

The whole calculation comes down to one formula:

**Payback period in months = one-off costs ÷ (monthly return − monthly running costs).**

The return comes from three sources: time saved, fewer mistakes, and revenue you stop losing. ROI, the figure sales decks like to quote, comes from the same numbers, but a small business owner usually gets more out of the answer in months: when does the money come back?

## Measure before you build

Without a "before" measurement, six months from now you can't prove anything to yourself, your partner or your contractor. Everyone will remember that "it used to be worse", and nobody will be able to say by how much. So start recording two weeks before the project begins, ideally before you sign the contract.

What to record:

- **Volume.** How many orders, requests or documents arrive per day, and through which channel: Telegram, phone, Instagram, the website.
- **Time per task.** Measured with a stopwatch, not estimated: time 20 to 30 ordinary cases and take the average. People almost always quote less than it really takes, because they don't count interruptions and follow-up questions.
- **Mistakes.** One line per case: what happened, who noticed, what had to be done and what it cost: a second delivery trip, a discount, a write-off, time spent fixing it.
- **Messages left waiting.** How many arrived at night and at weekends, how long before someone replied, and how many of those people ended up ordering.
- **Overtime.** Who stays late and for how long, especially at the end of the day and the month.

Two weeks is a compromise: one week catches too few mistakes, and after a month people get tired of logging. Pick ordinary weeks: no holidays, promotions or seasonal peaks. If you can't measure something, write "don't know". That's more honest than a number from memory, and it tells you straight away not to count a return from that item.

If you haven't chosen a process to automate yet, start with [What to automate first in a small business](/en/blog/what-to-automate-first/).

## Return 1: hours saved

The easiest part to understand, and the one people get wrong most often.

Formula: **(minutes per task before − minutes after) × tasks per month ÷ 60 × cost of an hour of staff time.**

Count the full cost of an hour: salary plus the social tax the employer pays, divided by the hours actually worked. A five-day, eight-hour week gives about 170 hours a month, and fewer once you take out leave and sick days. Count "minutes after" including any checking: if an operator reviews and confirms every order from the bot, that's time too.

The main trap is counting hours that are freed up only on paper. If an operator gets three spare minutes between calls, on paper it adds up to dozens of hours a month. In real life it's the same eight-hour day, just calmer. Saved time only turns into money if it goes into something:

- you don't hire the next person even though orders have grown;
- you cut overtime or an evening shift;
- the employee takes on specific work that nobody did before, or that someone more expensive was doing: calling customers back, reconciliation, purchasing.

If none of these applies to you, put the time return down as zero, or count only the part you would stake your name on. And don't price the owner's time at the operator's rate. It's worth something different, and it belongs in the section below on what the formula can't capture.

## Return 2: fewer mistakes

Manual work goes wrong in predictable places: retyping, handing work over between people and shifts, and hunting for a message in a long chat. Typical losses:

- a wrong order or address: the courier goes out a second time, and sometimes the customer gets something free as an apology;
- a payment not matched to an order: the customer paid by card transfer, but the books show them as owing, or the other way round; forgotten debts belong here too;
- a wrong tax ID or price on an e-invoice, which then has to be corrected and reissued through Didox or Faktura.uz;
- write-offs: stock expired because nobody could see what was on the shelf;
- fines and penalties for mistakes in documents and missed contract deadlines.

Formula: **cost of one mistake × how often it happens per month × the share of those mistakes the new system will actually prevent.**

The last factor matters. A bot gets rid of retyping errors and lost messages, but it won't fix an address the customer typed wrong. Go through the two-week mistake log and, for each one, mark honestly whether it goes away with the new system. Use direct, checkable costs for each mistake: the trip, the goods, the discount, the hours spent fixing it. Don't include customers who left for good here. If you want to count those losses, they belong in the next section.

## Return 3: revenue you stop losing

This is the most tempting source and the riskiest one: it's where it's easiest to make up any number you like. So be careful with it.

Where the money goes:

- messages that came in at night or at the weekend were answered in the morning, by which time the customer had ordered elsewhere;
- replies during the day were slow: someone asked for a price, waited twenty minutes and left;
- calls went unanswered at busy times;
- a customer started an order and gave up. You can only measure this after launch, once the bot or website has a funnel to look at.

How to count it: take the number of enquiries from your "before" log that never turned into an order, and multiply by the margin on one order, not by its price. Say an order is 50,000 sum and after the goods, the courier and the packaging you keep 20,000: the figure to use is 20,000. Then assume the new system wins back only some of those people, say half or fewer. Some will still prefer to phone, and some would have left even with an instant reply.

What not to do: don't add sales growth to the plan just because you'll have a nice bot. New customers come from marketing, product range and price. If a project only pays for itself when sales grow, that's hope, not a calculation.

## All the costs, not only the build

The contractor's quote is usually just the first line. The full list for year one:

- **Build or setup.** A one-off payment. What moves it most: integrations (1C, and payment providers, since Click, Payme and Uzum each connect separately), the number of roles and access levels, a staff panel, two interface languages, and reports. A Telegram bot for one process typically takes two to eight weeks, and signing a merchant agreement with a payment provider sometimes takes longer than the code.
- **Licences and subscriptions.** Off-the-shelf CRMs are paid for monthly: amoCRM per user, cloud Bitrix24 per plan with a user limit. 1C has its own licences and support. A custom build may have no licence fees, but support then costs more.
- **Server and storage.** If the system holds customers' names, phone numbers and addresses, Uzbekistan's Law on Personal Data requires that data about Uzbek citizens be stored on servers in Uzbekistan. Add backups and monitoring. More in [Storing personal data in Uzbekistan: what it means for your site, app and bot](/en/blog/personal-data-in-uzbekistan/).
- **AI usage.** If the project uses AI, the provider charges by volume of text, and the bill grows with the number of requests. Estimate it on your own volumes, not a demo: length of request and reply × requests per month × the provider's price. More in [Where AI actually lowers business costs, and where it doesn't](/en/blog/ai-to-cut-costs/).
- **Fees and SMS.** Payment providers take a fee on every payment. SMS to customers who don't use Telegram costs money too.
- **Training and switchover.** Hours of training, written instructions, and a week or two when the old and new ways run side by side and everything is slower. This one is almost always underestimated.
- **First-year support.** Bug fixes, small changes, and updates when Telegram, a payment provider or 1C changes something. Ask the contractor for the support price in writing before work starts. What it should cover is in [After launch: what maintaining an app or website actually involves](/en/blog/maintenance-after-launch/).
- **Your own time.** Meetings, answering questions, testing, sign-off. Nobody invoices you for it, but if the owner spends two weeks on the project, that's a cost.

Split everything into two columns: one-off and monthly. Monthly costs come off the return every month, and they are most often what turns a good project into a losing one: a large subscription eats a small saving.

## A worked example

Take a hypothetical drinking-water delivery business in Tashkent. Every number below is invented for illustration. These are not market prices and not our quote, just round numbers that make the method easy to follow.

**How it works today.** About 3,000 orders a month, by phone and Telegram. Operators take each order, type it into a spreadsheet and forward it to the couriers' group: about 4 minutes per order on average. The two-week log recorded 15 mistakes (wrong address, wrong quantity, forgotten order), so about 30 a month. Each costs 60,000 sum on average: a second trip and a free bottle of water. About 80 people a month wrote in the evening or at night, got a reply in the morning and didn't order.

**The plan.** A Telegram ordering bot where a customer can repeat their last order with one button, with payment through Click and Payme, an address list for couriers, and an evening summary for the owner. Phone orders stay, but the operators enter them into the same bot. Since the bot takes most orders on its own, the operators' average time per order drops from 4 minutes to 1.5: (4 − 1.5) × 3,000 = 7,500 minutes, or 125 hours a month.

| Item | How it's calculated | Per month, sum |
|---|---|---|
| Time saved | of 125 hours, only the 60 that will go on calling customers and tracking returnable bottles are counted, at 35,000 an hour: 60 × 35,000 | 2,100,000 |
| Fewer mistakes | half of the 30 mistakes; 15 × 60,000 | 900,000 |
| Orders kept | half of the 80 lost; 40 × 20,000 margin | 800,000 |
| **Total return** | | **3,800,000** |
| Server in Uzbekistan | | −400,000 |
| Support and small changes | | −700,000 |
| Payment fees and SMS | | −200,000 |
| **Net monthly return** | | **2,500,000** |

One-off costs: 32 million sum for the build and 3 million for training and the switchover, 35 million in total. There are no licence fees in this example because the bot is built for this business; with an off-the-shelf CRM, the table above would gain a monthly subscription line.

**Payback: 35,000,000 ÷ 2,500,000 = 14 months.**

What the calculation shows:

1. **At the end of year one the project is still behind.** Twelve months of net return come to 30 million against 35 million spent. It only breaks even at the end of month 14 and is in profit from month 15. Looking at year one alone would give a different decision, so choose the time horizon before you start.
2. **The first month or two will return less,** while customers get used to the bot and staff to the new routine. Adding a month or two to the payback is more realistic.
3. **Almost everything rests on the hours.** If only 30 of the freed hours go into real work instead of 60, the net return falls to 1,450,000 a month and payback stretches to about two years. If none do, 400,000 a month is left and payback runs past seven years: in practice, it never pays back. So test the most important assumption first: what exactly will the operators do with the time?

If your finance person wants ROI: over three years the return is 3.8 million × 36 = 136.8 million, total costs (35 million up front plus 1.3 million a month) are 35 + 1.3 × 36 = 81.8 million, so ROI = (136.8 − 81.8) ÷ 81.8 ≈ 67%. But three years assumes the process doesn't change in that time.

To decide, compare the payback period with how long the process will run without major changes. If you're confident you'll work this way for another three years, 14 to 16 months is a reasonable bet. If you plan to change how delivery works within a year, cut the project down to something that pays back faster: for example, order taking and the evening summary first, without the courier lists.

## What the formula can't capture

Some of the value of automation doesn't fit in a spreadsheet. List it next to the calculation, but don't put a price on it.

- **The owner's time and peace of mind.** No more answering calls at 11 pm or checking every order, and you can actually take a few days off.
- **Data for decisions.** Once orders are in one database, you can see which districts order most, when you're short of couriers, and which customers have stopped ordering. The value shows up later, and you can't predict it in advance.
- **Less dependence on one person.** If only the senior operator knows regular customers' addresses and special arrangements, their leaving is a risk to the whole business.
- **The customer's experience.** An order confirmation and a clear status instead of "call back in an hour".

These points help when the numbers are borderline: payback close to two years, with a stable process. They shouldn't be used to justify a project that, on the numbers, never pays back. If the calculation is negative without "peace of mind", that's a reason to shrink the project, not to add another line to the spreadsheet.

## Check after launch

The calculation before you start is a forecast. For it to mean anything, agree in advance when and how you'll check it.

1. **Set a date.** Usually two to three months after launch: the first weeks are for getting used to it, and their numbers understate the real effect.
2. **Measure the same things the same way.** Same metrics, same two weeks, same stopwatch. Convert everything to per-unit figures: minutes per order, mistakes per 100 orders, share of enquiries left unanswered. People order more water in summer than in winter, and a raw comparison will show growth that has nothing to do with the bot.
3. **Check that people use the system.** What share of orders comes through the bot, and are staff keeping a parallel spreadsheet "just in case"? While the old way is still alive, there's no saving, however much the build cost.
4. **Compare actual running costs with the plan:** server, support, payment fees, AI usage.
5. **Decide feature by feature:** keep it, improve it or switch it off. A feature nobody uses still needs support and testing with every update.

Write the result up on one page: what you expected, what you got, and why. You'll want it when deciding on the next project. Small fixes based on the measurement, then measure again, then fix again: that's kaizen. With a contractor it works best through short regular reports: what's done, what's blocking, which decision is needed from you. More in [Kaizen in software: why small improvements beat big releases](/en/blog/kaizen-in-software/).

Describe the process you want to automate to SamurAI on qilich.com: how many times a month it happens and how long it takes today. Every calculation starts from those two numbers.
