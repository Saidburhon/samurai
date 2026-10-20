---
slug: ai-to-cut-costs
lang: en
title: "Where AI actually lowers business costs, and where it doesn't"
description: "The jobs where AI saves time and money: sorting requests, reading documents, drafting replies. And the jobs where it only adds cost and risk."
date: 2026-10-21
tags: [ai, cost-reduction, automation, telegram, 1c, personal-data]
related: [ai, telegram, business]
reading_minutes: 8
---

Everyone is talking about AI: CRM vendors, Telegram channels, the business owner you know who says they've "already rolled it out". The promise is big: AI will replace your operators, your accountant and half the office. If you run a company on a limited budget, you need one answer out of all that noise: which tasks in my business can AI take over, and how much will that really save? The short answer: AI is good at reading, sorting and drafting text, and unreliable wherever the result has to be right every time without anyone checking it. The saving comes from fewer human minutes per task, not from replacing the team. Below is a task-by-task view, including the running costs that usually get left out of the sum.

## What today's AI is good at, in plain terms

Behind ChatGPT and similar services is a language model. It takes text in and predicts the most likely text to come next. That gives it real strengths:

- **reading and classifying**: telling that "Can I move it to Friday?" is a reschedule, not a new booking;
- **pulling out fields**: finding the supplier, tax ID, date, line items and totals on a waybill;
- **summarising**: turning forty messages from one day into five lines;
- **drafting**: a reply to a customer, a letter to a supplier, a product description.

And real limits:

- it doesn't know your business. It knows your prices, addresses and delivery terms only from what you give it;
- it doesn't check facts, it produces plausible text. If the answer isn't in the data it was given, it may write a wrong one with full confidence;
- arithmetic and exact figures are not its job. Totals and stock should be calculated by ordinary software, and prices taken from your database.

That leads to a simple rule: AI pays off where checking the result is much faster than doing the work, and where a mistake can be caught before it reaches a customer.

## Task 1: sorting incoming messages

Take a hypothetical private clinic with one reception desk. Its Telegram bot and its email get dozens of messages a day: book a visit, move a visit, the price of a blood test, whether results are ready, a complaint about the queue. The receptionist reads each one, decides who it's for, forwards it and replies, in between phone calls and the patients standing at the desk.

AI does one thing here: it reads each message and tags it with a topic (booking, reschedule, prices, results, complaint, other), an urgency level and a language. Ordinary code then routes by tag: bookings to the receptionist, results questions to the lab, complaints to the senior administrator. Anything that says a patient feels unwell is marked urgent and goes straight to a person. The AI gives no medical advice at all.

To make it work:

- **Keep the categories few, 5 to 10**, each described in a sentence or two with examples. If your staff mix up two categories, the model will too.
- **Have an "unsure" bin.** Whatever the model can't place with confidence goes to a person without a tag. That's cheaper than sending it to the wrong desk.
- **Suggest first, automate later.** For the first weeks the model only proposes a tag and a person confirms it. Switch to automatic only for the categories where it is consistently right.

Where the messages come from: your company bot, work groups, email, the CRM. If customers write to a manager's personal account, Telegram Business lets you connect a bot to it (this needs a Telegram Premium subscription). In amoCRM and Bitrix24 the tag can go straight onto the lead or request card.

A first working version usually takes 1 to 3 weeks. More channels, a CRM integration and more customer languages make it longer.

## Task 2: drafting replies a person approves

A large share of customer messages are the same handful of questions: how much is it, when will it arrive, are you open on Sunday, can I return it. Operators know the answers but type them out every time, in Uzbek or Russian depending on who's asking.

The setup: AI takes the question, finds the relevant part of your knowledge base and proposes a draft reply in the customer's language. The operator reads it, edits it and sends it. The person stays responsible for what goes out, and the time per reply drops, most of all on long, standard answers.

What you need first:

- **A knowledge base.** One document or section: services, prices, addresses, opening hours, delivery and return terms. It has an owner who updates it whenever something changes. Without that, drafts will quote last year's prices with confidence.
- **Exact data from your systems.** Price, availability and order status are filled in by code from 1C or the CRM, not recalled by the model.
- **Things it must not do.** A draft never promises a discount, a deadline or compensation that isn't in the knowledge base.

What to measure: average minutes per reply before and after, and the share of drafts sent without edits. If operators rewrite almost every draft, there's no saving: either the knowledge base is weak or the task doesn't fit.

Can AI answer customers with no person involved? For a narrow set of questions, yes, and there's a separate article on that: [AI answering customers in Telegram](/en/blog/ai-support-in-telegram/). Drafts are the safer place to start.

Timeline: 2 to 6 weeks, and most of it goes into collecting and cleaning up the knowledge base, not into code.

## Task 3: reading documents into your systems

Waybills, invoices, acceptance certificates and contracts from suppliers often arrive as PDFs, scans or phone photos. Someone copies the supplier, tax ID, items, quantities and totals into 1C or a spreadsheet. This is exactly the kind of work where AI helps: read a document and split it into fields.

The reliable pattern: the model extracts, code checks, a person confirms whatever failed the checks. The checks are simple and mechanical: line items add up to the total, the VAT is right when recalculated, the tax ID is in your list of counterparties, each item is matched to an item in your 1C catalogue. A person skims the documents that passed every check and reads the rest carefully.

Electronic invoices that come through Didox or Faktura.uz are already structured data. Take those through an integration, not through AI. AI is for what arrives on paper or as a PDF.

This usually takes 3 to 8 weeks. More document layouts, poor scans and a heavily customised 1C all stretch it. More in [AI for document processing](/en/blog/ai-document-processing/).

## Task 4: summaries for the owner

An owner who wants to stay on top of things reads every branch's work chats, listens to calls and goes through complaints. That's an hour or two a day, and things still slip past.

The alternative is one summary in Telegram every evening. The numbers (orders, revenue, cancellations) are calculated by ordinary code from your database; AI doesn't touch them. AI does what it's good at, summarising text. For example: "Seven complaints about late delivery, five of them from the Yunusabad branch after 7 pm. Two customers asked whether they can pay with Uzum, and we don't accept it yet." Each line links to the original messages so you can check.

If calls are recorded and transcribed, they can go into the summary too. Test speech recognition on Uzbek separately: it is often noticeably weaker than on Russian.

There is one condition: the data is already in one place. If orders live in five chats, you need an order system first, not AI. Once the data is collected, the summary takes 1 to 2 weeks to set up.

## Where AI adds cost instead of saving it

- **Rare tasks.** A quarterly report, one lease contract a month: setup and checking can cost more than years of doing it by hand.
- **Tasks that are already fast.** If a person spends 10 seconds on it, AI saves nothing and the check adds time.
- **Anything that needs full accuracy.** Prices on a price list, totals on an invoice and stock levels should come from a database and ordinary code. The legal wording of a contract and medical or tax advice are a specialist's job: AI can at most help find the right clause, and the decision and the wording stay with the specialist.
- **Made-up answers.** A model can tell a customer about a discount or a delivery date that doesn't exist. Each such mistake costs money and trust, and the protection against it, a human check, costs minutes too. If checking takes as long as doing, there's no saving.
- **A messy process.** If three people do the same job three different ways, AI only speeds up the mess. Sort out the process first; see [What to automate first in a small business](/en/blog/what-to-automate-first/).
- **Low volume.** Ten messages a day, a receptionist can handle alone.

A word about "we'll replace people with AI". In practice the saving is minutes per task: an operator gets through more, you don't have to hire as soon as volume grows, the receptionist has time for the patients at the desk. And someone on the team has to own the AI: review its mistakes and keep the knowledge base current.

## What it costs to run

| Cost | When you pay | What drives it |
|---|---|---|
| Setup and integration | Once | Number of channels and systems (Telegram, CRM, 1C), categories, document layouts, languages |
| Model usage (API) | Monthly | Number of requests, length of each request including the knowledge base, choice of model |
| Upkeep | Monthly | How often prices, services and rules change; how many errors need looking into |
| Monitoring and checks | Ongoing | The share of outputs a person checks by hand |
| Servers in Uzbekistan | Monthly | Whether you store personal data or run a model on your own server |

API fees are charged by the volume of text going in and out, counted in tokens. Providers usually price input and output tokens differently, so the estimate is: (average request length × input price + average response length × output price) × requests per month. Keep two things in mind. Russian and Uzbek text usually takes more tokens than the same meaning in English. And the knowledge base you send with each request can be several times longer than the question itself.

Costs people forget:

- updating prompts and the knowledge base every time products or prices change;
- re-testing when the provider updates or retires a model, because its behaviour can change;
- a log of every request and response, and a weekly review of a sample of errors;
- staff time spent checking, which has to come off the saving.

The payback sum is simple: (minutes before − minutes after, checking included) × tasks per month × cost of a staff minute − monthly running costs. If the result is negative or close to zero, don't launch. If it's positive, divide the one-off setup cost by it to get the payback period in months. More in [Will automation pay for itself?](/en/blog/automation-roi/)

You only learn the "minutes after" on real data, so a pilot comes before rollout. A demo on hand-picked examples almost always looks better than the same model on your actual messages.

## Uzbek language and personal data

Customers in Tashkent write in Uzbek in both Latin and Cyrillic script, in Russian, in a mix of the two, with typos and voice messages. Large models handle Russian well; in Uzbek, quality varies a lot from model to model, most of all on everyday chat language. So test on 100 to 300 of your own real messages, not on demo examples, and look at accuracy for each language separately. Voice messages have to be turned into text first, which is one more step and one more source of errors.

Then there is personal data. The Law "On Personal Data" requires the personal data of Uzbek citizens to be stored on servers located in Uzbekistan. Most of the strongest models run on servers abroad. Before you send customers' names, phone numbers and conversations there, check with a lawyer how that fits the law in your particular setup. Practical measures:

- **anonymise before sending**: names, phone numbers, card and passport numbers are replaced with placeholders, and the lookup table stays with you;
- **keep** the customer base, logs and original documents on a server in Uzbekistan;
- **read the provider's terms**: how long it keeps requests and whether it uses them to train models;
- **for sensitive data** (medical, financial), consider running a model on your own server. The infrastructure costs more, and the quality in Uzbek has to be tested separately.

More in [Storing personal data in Uzbekistan](/en/blog/personal-data-in-uzbekistan/).

## How to run a two-week pilot

**Preparation, 3 to 5 days.**

1. Pick one task: frequent, dull, with a clear right answer. Not the most impressive one, but the one your team repeats most.
2. Collect 100 to 300 past examples, anonymise them and mark the correct answer by hand.
3. Measure "before": minutes per task, tasks per day, errors.
4. Write down the decision criteria in advance: the accuracy you need, how many minutes it has to save, which errors are not acceptable at all.

**Week 1: shadow mode.** AI processes the real flow, but its output goes nowhere. Staff work as usual and mark whether it got each one right. You learn its accuracy on your own data with no risk to customers.

**Week 2: with checks.** Staff use the AI output but check every single one. Measure minutes per task including checking and corrections, the share of outputs that needed correcting, and the cost of the requests.

**A decision on the numbers.** There are three possible outcomes: roll out, adjust and run again, or stop. Stopping is a normal result: two weeks of pilot cost far less than a full rollout that never pays for itself.

Mistakes to avoid:

- starting with a customer-facing bot instead of an internal task;
- testing on made-up examples;
- not measuring "before";
- removing the human check too early;
- launching without an owner for the knowledge base.

Tell SamurAI on qilich.com which task your team repeats most; it is a good first candidate for a pilot.
