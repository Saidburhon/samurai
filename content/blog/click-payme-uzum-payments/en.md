---
slug: click-payme-uzum-payments
lang: en
title: "Accepting Click, Payme and Uzum payments: a guide for business owners"
description: "How online payment gets connected to a website, app or Telegram bot: the contract, the technical part, fiscal receipts, refunds and common mistakes."
date: 2026-10-21
tags: [online payments, Click, Payme, Uzum, fiscal receipts, integrations]
related: [backend, web, telegram, mobile]
reading_minutes: 9
---

Right now your payments probably work like this: a manager sends the customer a card number in Telegram, the customer transfers the money and sends a screenshot, and the manager opens the banking app to look for that transfer. At ten orders a day you can live with it. After that come the transfers nobody can find, the "but I already paid" arguments, the missing receipts, and the accountant asking why revenue is landing on someone's personal card. Online payment through Click, Payme or Uzum fixes this, but it is really two projects. One is business: merchant contracts, fiscal receipts, refund rules. The other is technical: payment notifications, order statuses, daily reconciliation. Here are both, in the order you should tackle them.

## Why card-to-card transfers stop working as you grow

Transfers to a card are convenient at the start: nothing to sign, nothing to build. But they have limits, and you reach them sooner than you expect.

- **Manual checking.** Someone opens every screenshot, compares the amount and time with the bank statement, then finds the matching order. That is a few minutes per payment and hours of staff time by the end of the day.
- **Mistakes.** Two customers send the same amount within the same hour. The screenshot is old or edited. A customer sends a hundred thousand soʻm less than the total and nobody notices.
- **No receipts.** The customer gets no fiscal receipt and the business has no proper record of its sales.
- **Tax and trust.** Company money sits on the owner's or an employee's personal card. That raises questions with the tax authority, means manual work for the accountant, and makes a first-time customer hesitate before sending money to a stranger. When the employee whose card serves as the till leaves, the till leaves with them.
- **A dead end for automation.** The order cannot mark itself paid, the warehouse does not learn it can start packing, and the courier cannot see whether to collect cash on delivery.

There is a middle step. Payment providers usually offer ways to take payments without any development: a payment link or a QR code from the merchant cabinet. The money goes to the company's account instead of a card, but matching payments to orders is still manual. For a small volume that is a sensible start. You need an integration once orders pile up or the payment itself has to trigger the next steps.

## What you need before any code

Most of the preparation falls on the owner and the accountant, not the developer.

1. **A registered business.** A sole proprietor (YaTT) or a company: payment providers sign contracts with businesses, not with private individuals.
2. **A bank account** for the money to land in.
3. **A merchant agreement with each provider.** Click, Payme and Uzum are separate companies, each with its own list of documents, its own fee and its own timing. They usually ask for registration documents, bank details, a short description of what you sell, and the address of the website, bot or app where customers will pay. They often check that the site has a public offer (terms of sale), contacts, prices and refund terms. Ask the provider's manager for the exact list, because the requirements change.
4. **Access.** Once the agreement is signed you get a merchant cabinet and technical details: a cashbox or service ID, a secret key, access to a test environment. Pass them to the developer through a secure channel, not the team chat.
5. **Product codes for receipts.** More on these below, but start on them now.
6. **An owner for payments.** Decide in advance who issues refunds, who watches reconciliation, and who an operator turns to when a customer says "I paid but there is no order".

Your company signs the agreement with the payment provider. If a developer offers to connect payments "temporarily" through their own company, say no: your customers' money would go to them.

The agreement takes from one to several weeks, depending on the provider, whether you have every document ready, and whether the site already has its public offer. Apply in the same week development starts. Otherwise you get the familiar picture: everything is built and you are waiting for keys.

## How a payment actually flows

All three providers follow a similar pattern:

1. **The customer places an order.** Your system records it as "awaiting payment" and fixes the amount.
2. **The customer taps "Pay"** and lands on the provider's page or in its app. They enter card details there, not on your site: your system never sees or stores card numbers.
3. **The provider asks your server:** does this order exist, is the amount right, can it still be paid?
4. **Your server answers** yes, or no with a reason.
5. **The customer confirms the payment** and the money is charged.
6. **The provider tells your server** the payment went through. The server marks the order paid, sends the receipt data, and notifies the customer and your staff.
7. **The customer returns** to your site or bot and sees the order status.

Step 6 is the one that matters. Whether an order is paid is decided by the server-to-server notification from the provider, not by the customer arriving on your "Thank you" page. The customer may close the browser right after paying, or lose their connection. A system that marks orders paid when the customer comes back will be wrong in both directions.

The details differ by provider. Click works in two stages, prepare and complete. Payme has a set of methods to check, create, perform and cancel a transaction. Uzum has its own protocol. The logic is the same, but the formats, request signatures and error codes are not, so each provider is a separate integration with its own testing.

A Telegram bot usually has two options: a button that opens the payment page, or payment inside Telegram through a provider connected in BotFather, where the provider supports it. A Mini App connects the same way a website does. In a mobile app the customer goes to the provider's app or page and comes back, and that round trip has to be tested on both iOS and Android. If your app sells digital content, such as access to online lessons, check the App Store and Google Play rules first: for digital goods they may require the store's own billing.

## Fiscal receipts and product codes

Online sales usually require a fiscal receipt. It is electronic: the customer gets a link or a QR code.

Each line on the receipt needs:

- an **MXIK (IKPU) code** from the national catalogue of goods and services (tasnif.soliq.uz);
- the **package code** (unit of measure) for that product code;
- the **VAT rate**.

Delivery, packaging and service charges, if you bill them separately, are lines with their own codes too.

The payment provider can issue the receipt if your system sends it the order contents with the codes. The other route is your own online cash register. Decide which one suits you with the provider and your accountant.

The practical part: the codes have to live in the same database your site reads products from, or the developer has nowhere to take them from. For a catalogue of thirty items that is an evening's work. For several thousand items it is weeks of the accountant's time, so it has to run in parallel with development.

Discounts are another common problem. The sum of the receipt lines has to match the payment amount exactly, down to the tiyin. Promo codes, a discount on the whole order or free delivery above a certain total will break that unless you decide in advance how a discount is spread across the lines.

Fiscal rules change. Before launch, confirm the current requirements with the provider and your accountant.

## One provider or several

Customers have their favourite apps. One has paid through Click for years, another banks with Uzum Bank, a third is used to Payme. All three providers accept Humo and Uzcard cards on their own payment pages, so you usually do not need a separate card integration. If you have foreign customers, ask specifically about Visa and Mastercard: that often needs a different solution.

Starting with one provider makes sense when:

- order volume is still low and you are testing whether customers will pay online at all;
- the budget is tight;
- your current transfers show that most customers already use one app.

You need two or three when customers keep asking for a particular app, your audience is broad, or a noticeable share of customers abandon the order at the payment step.

Even if you launch with one provider, ask the developer for a shared payment module: one set of order statuses, one payment log and a separate adapter for each provider. Then the second provider is a new adapter plus tests, not a rebuild. Remember too that every provider means another contract, another fee, another cabinet and another line in reconciliation, so the accountant's workload grows as well. Installments, such as Uzum Nasiya, are a separate integration with their own rules.

What drives the timeline and the cost:

- **Whether orders are tracked properly.** If orders already live in a system with statuses, there is something to connect payment to. If an order today is a Telegram message, order tracking has to come first.
- **The number of providers.**
- **Fiscal receipts** and the state of your catalogue.
- **Refunds, partial payments and prepayments.**
- **An exchange with 1C.**
- **The platform:** website, bot, app, or all of them.

As a guide, the first provider connected to a working order system takes one to three weeks including testing. Each further provider is usually quicker, from a few days to a couple of weeks. A 1C exchange is estimated separately and depends on your configuration. The merchant agreements run in parallel.

## Refunds, cancellations and partial payments

A simple "paid, so the order is paid" integration breaks on the first unusual case. These are the common ones:

| Case | What the system should do | Who decides |
|---|---|---|
| Customer cancels after paying | Full refund through the provider, status "cancelled", refund receipt | Manager |
| After payment, part of the order turns out to be out of stock | Partial refund, or a substitute if the customer agrees | Manager, with the customer |
| Customer paid twice | Find the second payment and refund it | System flags it, manager confirms |
| Order cancelled on timeout, payment arrives later | Do not lose the money: restore the order or refund | Manager |
| Prepayment online, balance to the courier | Two payments on one order, both visible in reports | Set up once |

Find out before development starts:

- **Whether the provider supports partial refunds through its API.** Not all do. Some allow only a full cancellation through the API, and partial cases go through the cabinet or support. That decides how you handle "one item out of five is missing".
- **Refund receipts.** A refund is fiscalised too.
- **When the money gets back.** That depends on the customer's bank and the provider. Find out the timing and put it in your refund terms, so operators do not promise "today".

Most important: who presses the refund button. It should be a specific role with rights in the admin panel, not every operator. The system records who refunded what, when and why. For large amounts you can add the owner's approval.

## Reconciliation and reports

Money reaches your bank account in lump sums for a period, minus the provider's fee, not order by order. So the bank statement alone cannot tell you which order was paid.

Three lists have to match every day:

- the orders your system considers paid;
- the transactions in the provider's report;
- the amounts received in your bank account.

The system can match them every night by transaction ID and show the differences. Typical ones: the provider has a payment but the order is not marked (a notification was lost); the order is marked but there is no payment (a bug or a test order); a refund was made in the cabinet but the order is still active in your system.

**Passing payments to 1C.** Agree with your accountant before development how payments should appear in 1C: per order or as a daily total per provider, and how fees and refunds are recorded. The more precisely you agree up front, the less rework later.

**A daily summary for the owner in Telegram.** A short message at the end of the day, for example:

> 14 November: 52 orders paid online, UZS 18.4 million in total. Click 21, Payme 24, Uzum 7. Refunds: 2. Not matched: 1, details in the panel.

The numbers are made up; the format is the point. The owner sees the whole picture in ten seconds and knows whether anything needs checking.

## Testing before going live

Providers give you somewhere to test: Payme has a sandbox, Click has a request emulator, and for Uzum ask your manager how testing works. Test cards and data come from the provider. Check:

- a successful payment through each provider, from a phone and from a computer;
- paying for an order that does not exist, is already paid or was cancelled;
- an attempt to change the amount on the customer's side;
- a repeated notification for the same payment: the order must not be processed twice, stock must not be written off twice, the customer must not get two messages;
- your server answering slowly, so the provider gives up waiting;
- a customer who closes the page right after paying;
- cancelling an order after payment, and a payment that arrives after cancellation;
- full and partial refunds, and the refund receipt;
- a slow mobile connection;
- the Uzbek and Russian texts on the payment screen and in notifications.

Every request from a provider should be kept in a log. When a customer writes "I paid", the operator finds the transaction in a minute instead of forwarding the question to a developer.

The last step is a real payment of a small amount from a real card in live mode, followed by a refund. Then open payment to all customers.

## Checklist before launch

With the developer:

- an order counts as paid only after the provider's notification;
- repeated notifications cause no double stock write-offs and no duplicate messages;
- the amount is checked on the server and the customer cannot change it;
- keys are kept on the server, not in the app's code or in chats;
- every provider request is written to a log;
- refunds work and only designated people have the right to issue them;
- the nightly reconciliation sends an alert when something does not match;
- customer data is stored on servers in Uzbekistan, as the personal data law requires.

With the accountant:

- every line, delivery included, has an MXIK code, a package code and a VAT rate;
- a test receipt has been checked: lines, amounts, discounts;
- the refund receipt has been checked;
- it is clear how payments, fees and refunds reach 1C.

On the business side:

- the agreements are signed and the live keys received;
- the site shows the public offer, refund terms and contacts;
- operators know what to say to "I paid but there is no order";
- a real payment and refund have been run.

Tell SamurAI on qilich.com how you take payments today and what gets in the way, and we will suggest where to start.
