---
slug: what-to-automate-first
lang: en
title: "What to automate first in a small business"
description: "Where to start with automation: find the repetitive work, rank it by cost and risk, and don't pay for software where a spreadsheet will do."
date: 2026-10-21
tags: [automation, small-business, telegram, payments, 1c]
related: [telegram, business, ai]
reading_minutes: 8
---

Orders come in through Telegram, Instagram and phone calls. Only the owner really knows what's in stock. Every evening an administrator spends an hour matching the cash drawer, the card terminal and card-to-card transfers, and something is usually a little off. It's tempting to "automate everything", and plenty of people will offer to sell you a CRM, build you an app or "add AI". Starting with a purchase is the most expensive way in. It's cheaper to find out which work eats the most hours and where a mistake costs the most, and start there. Here is a practical order of steps for a business of 5 to 50 people in Tashkent: a shop, café, clinic, learning centre or service company.

## Signs the business has outgrown manual work

- **Orders get lost in chats.** A customer wrote in the evening; by morning the message was buried and nobody had answered.
- **One person knows the stock.** When they're off sick or on holiday, purchasing is guesswork.
- **Evening reconciliation takes an hour or more**, and being a few tens of thousands of sum off has become normal.
- **The same invoice mistakes keep coming back:** an old price, the wrong tax ID, a mixed-up quantity.
- **A new hire spends a week learning "how we do things here"**, because none of it is written down.
- **The owner can't take three days off** without the phone ringing every hour.

If two or three of these sound familiar, it's time. Start by counting, not buying.

## Write down a normal week before buying anything

Before looking at software, log every repeated task for one week. The people who do the work should log it: administrator, cashier, manager, storekeeper. Owners remember what annoys them and tend not to see what quietly fills their staff's day.

A shared table with six columns is enough:

- the task in plain words: "take an order from Telegram and pass it to the kitchen";
- who does it;
- how many times a week;
- minutes each time;
- where it happens: a chat, Excel, a notebook, 1C, the phone;
- what breaks when it goes wrong, and whether that happened this week.

Pick an ordinary week, not a holiday or a sale. Also check what the software you already pay for can do: 1C, Bitrix24 or amoCRM may already have the feature, and nobody has switched it on yet.

## Score each task: frequency, time, cost of a mistake

For each row, work out minutes per week (times × minutes) and multiply by the cost of a mistake:

- **1**: annoying but easy to fix;
- **2**: we lose money, or time fixing it;
- **3**: we lose a customer, or money we won't get back.

Take a hypothetical café with three branches that does delivery and takeaway. The numbers are made up to show the method.

| Task | Times a week | Minutes each | Minutes a week | Mistake cost | Score |
|---|---|---|---|---|---|
| Take an order from Telegram or the phone and pass it to the kitchen | 280 | 3 | 840 | 3 | 2520 |
| Evening reconciliation of cash, terminal and transfers | 21 | 40 | 840 | 2 | 1680 |
| Check stock and order from suppliers | 9 | 30 | 270 | 2 | 540 |
| Weekly report for the owner | 1 | 120 | 120 | 1 | 120 |
| Staff shift schedule | 1 | 90 | 90 | 1 | 90 |

Orders and reconciliation take the same time, but a lost order is a lost customer, so orders win. The owner's weekly report, the thing they wanted automated first, lands near the bottom: irritating, but two hours a week and rarely a real loss. And until the data lives in one place, there's nothing to build the report from.

The rule: boring, frequent work with an expensive mistake goes first.

## Usually first: every order and request in one place

In Uzbekistan, automation most often starts with Telegram, because that's where customers write. Requests typically arrive through three or four channels: Telegram, Instagram, calls, sometimes a website. Each employee has their own chat, and the handover between shifts depends on memory. Step one: every request becomes a record with a number, channel, customer, status (new, accepted, in progress, done, cancelled) and an assignee.

Two common routes:

1. **A Telegram bot plus a table or simple database.** The customer orders in the bot in Uzbek or Russian; the order gets a number and lands in the table and in the right branch's work group. The administrator enters phone and Instagram orders into the same bot by hand: an extra minute, but the order can't get lost.
2. **A CRM with messengers connected.** amoCRM and Bitrix24 can pull Telegram and Instagram conversations into one window, with an assignee and a stage for each request. This fits better when a sale is a conversation: questions, a quote, a follow-up call a week later.

Whatever the tool:

- If a request isn't in the system, it doesn't exist. Close the old group chat for orders, or within a month you'll have two parallel streams.
- Every shift reads the statuses the same way, and there's a clear rule for cancellations, substitutions and refunds.
- Store the customer base where the law requires. Under Uzbekistan's personal data law, Uzbek citizens' personal data has to be stored on servers in Uzbekistan. A customer's name and phone number count as personal data, so a customer list in a foreign online spreadsheet doesn't meet that requirement. Plan for a server in Uzbekistan from the start.

A bot plus a table for one process usually takes one to three weeks. More branches, a bigger menu or catalogue, payment inside the bot and a link to 1C all add time. Configuring an off-the-shelf CRM takes a few days to a couple of weeks, plus staff training, which nearly everyone underestimates.

## Then: payments, receipts and reconciliation

With orders in one place, the next pain is money: the customer sends a card transfer and a screenshot, the cashier checks it by eye, and in the evening the administrator reconciles cash, terminal and transfers.

A card-to-card transfer carries no order number, so matching it automatically comes down to guessing by amount and time. The reliable route is a merchant connection with Click, Payme or Uzum. The customer pays via a link or button tied to a specific order, the payment system notifies your system, and the order marks itself as paid. On top of that, the owner gets a daily Telegram summary: number of orders, what was paid and how, what's unpaid, a breakdown by branch and a short list of discrepancies. One message instead of three merchant dashboards.

Plan for these:

- Humo and Uzcard terminal payments are reconciled against the bank statement. If your bank exports it in a consistent format, that can be automated too, at least partly.
- Ask your accountant how receipts must be issued for online payments, and put it into the requirements before work starts.
- If you issue e-invoices through Didox or Faktura.uz, check whether they can be generated straight from 1C. Wrong tax IDs and prices usually come from retyping.

Expect two to six weeks. Often the timeline is set by the merchant contract rather than the programming: paperwork, review, test mode. Each payment system connects separately with its own protocol, so three cost noticeably more than one. Start with the one your customers use most.

## Then: stock, schedules and reminders

These automate well, but each has a condition. Without it, you get noise instead of help.

**Low-stock alerts.** Many 1C configurations let you set a minimum level per item, and a Telegram alert to whoever does purchasing is a small integration. The condition: stock in 1C has to match what's actually on the shelves. Deliveries are entered the same day, write-offs are posted, and a café keeps recipe cards so that selling a dish writes off its ingredients. If the books run a week behind, the alerts will be wrong and within a month nobody will read them. Fixing the books costs only discipline; do it before any integration.

**Appointment reminders** for clinics, learning centres and salons. The condition: every booking goes into one schedule, not "the administrator's notebook and partly their phone", and phone numbers are stored in one format (+998…). Reminders go out a day before and a couple of hours before, with "I'll come" and "Cancel" buttons, and a freed slot shows up in the schedule at once. Mind a Telegram limit: a bot can only message people who have started it themselves. So bring customers into the bot when they book, and send SMS to those who don't use Telegram.

**Staff shifts.** A shared table is often enough. A bot that sends each person tomorrow's shift in the evening and records swaps pays off when there are several branches and the schedule changes often.

## What not to automate yet

- **Processes that change every month.** If you're still working out your delivery model or discounts, let the rules settle first, or you'll hard-code something you'll be rewriting in a month.
- **Tasks done once a quarter.** For a quarterly report, a template beats an integration.
- **Anything nobody has written down.** If three employees do one task three ways, agree on one and put it on a page first. Automating chaos only makes the chaos faster.
- **Decisions that need a person:** negotiating with a key supplier, a complicated complaint. It's enough that these don't get lost.

The same goes for AI. It helps once the data is in one place: sorting incoming messages by topic, answering common questions, pulling figures from delivery notes. It won't fix scattered chats.

## Ready-made, configured or custom

**A shared spreadsheet.** Fine when one to three people use it, nothing needs integrating and the process is simple. It breaks down when several people edit at once, rows get deleted by accident, or you need access rights.

**Configuring a ready-made tool: amoCRM, Bitrix24, 1C.** A fit when your process looks standard: request, deal, payment, shipment. Costs are a licence or subscription, setup and training; the timeline is a few days to a few weeks. The common mistake is buying a CRM, never shaping it around your process, and deciding two months later that "the CRM doesn't work".

**A small custom piece: a bot or an integration.** Justified when the gap is between systems: Telegram and 1C, payments and orders, a website and the warehouse. Or when the customer side has to live in Telegram in two languages and an off-the-shelf CRM is awkward for that. Usually two to eight weeks.

**A custom system.** Justified when the process is what sets you apart, when there are many roles and branches, when the off-the-shelf tool needs daily workarounds, or when you need full control over your data and where it's stored. Months, not weeks, plus an ongoing support budget.

What drives the cost of a build most:

- integrations, especially with a customised 1C: the more changes in your configuration, the more the connection costs;
- the number of roles and access levels: cashier, branch administrator, accountant, owner;
- a two-language interface: small, but unavoidable;
- reports, since each new one is a separate task;
- a server in Uzbekistan for customer data;
- support after launch. Ask about it before work starts, not after.

## A first 30-day plan

1. **Week 1.** Log a normal week, score it, pick one process. Name one responsible person on the business side: someone who does this work daily, not only the owner. Record the "before": minutes per day on the task, and errors or lost orders per week.
2. **Week 2.** Describe the process on one page: steps, who is responsible for what, statuses, exceptions (cancellation, refund, out of stock). Pick the simplest tool that covers that page.
3. **Week 3.** Configure or build the solution and launch it in one branch or one shift. Keep the old way as a fallback, with a date to switch it off.
4. **Week 4.** Compare "after" with "before", fix what gets in the staff's way, and only then roll it out to the other branches.

If development is needed, week 3 will stretch; the sequence and the measurements stay the same. Without the "before" number, a month later nobody can say whether anything improved.

Then take the next process on the list. Small step, measure, improve: that's kaizen, and in automation it beats one big "do everything" project. If you work with a contractor, agree on a short weekly report: what's done, what's blocking, which decision they need from you.

If you'd like to work through your own case, tell SamurAI on qilich.com what your business does and which task eats the most hours.
