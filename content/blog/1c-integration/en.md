---
slug: 1c-integration
lang: en
title: "Connecting 1C to your site and Telegram bot: stock, prices, orders"
description: "Real stock on your site and no more retyping orders: how a 1C integration works and what to check before the work starts."
date: 2026-10-21
tags: [1C, integrations, online store, Telegram bot, inventory, e-invoicing]
related: [biz-1c-integration, web-ecommerce, tg-b2b-ordering, mob-field-sales]
reading_minutes: 9
---

Your stock and prices live in 1C, but you also sell through a website, a Telegram bot or sales reps. Without an exchange between them, someone does the job by hand: exports a price list to Excel once a day, fixes prices on the site, retypes bot orders into 1C. Mistakes follow. A customer pays for an item that is no longer in the warehouse. A wholesale buyer sees an old price in the bot and insists on it. An order gets lost somewhere between the chat and accounting. Connecting 1C fixes this, with one caveat worth hearing before any work starts: the exchange moves your data exactly as it is. If 1C has three records for the same product, the site will show three products. So we start not with technology but with what should flow where, and what state your data is in.

## What should flow where

The rule is simple: each kind of data has one owner. Prices and stock are kept in 1C, and the site never edits them. An order starts on the site or in the bot and goes to 1C. If the same field can be changed in two places, sooner or later the values drift apart and nobody can say which one is right.

| Data | From and to | Typical frequency | Owner on your side |
|---|---|---|---|
| Catalogue: names, groups, SKUs, barcodes | 1C → site, bot, app | on change or daily | merchandiser or accountant |
| Prices: retail, wholesale, other price types | 1C → sales channels | on change | whoever approves prices |
| Stock by warehouse | 1C → sales channels | every few minutes to once a day | warehouse |
| Orders | site, bot, app → 1C | instantly or every few minutes | sales manager |
| Payments | payment provider → site → 1C | right after confirmation | accountant |
| Order status | 1C → site, bot | on change | sales, warehouse |
| Descriptions and photos | usually kept on the site | as needed | content manager or marketer |

Customer records need to flow both ways less often than people expect. A retail shop usually needs only the name, phone and address on the order itself; there is no need to set up a counterparty in 1C for every buyer. Wholesale is different: the client has a contract, individual prices, payment terms and an outstanding balance. Here customer data does need to move, mostly in one direction, out of 1C: the bot or the sales rep's app shows the client their prices and debt, and new counterparties are set up by the accountant, not by the website.

## Clean the data in 1C first

This is the most underestimated part of the project. The exchange can be set up in a week, and then a month goes into finding out why the site shows products with no price. Before you start, go through this list:

- **Duplicates.** The same product was entered twice under different names, and its stock is split between the two records. The site says "out of stock" while a full box sits in the warehouse.
- **Names.** "Sunfl. oil 1L PET" is clear to the storekeeper, not to a customer. Decide where the customer-facing name lives: in an extra attribute in 1C or on the site.
- **Barcodes and SKUs.** This is how products are matched between systems. Without one shared key, the exchange starts mixing up items.
- **Units.** The warehouse counts pieces, but wholesale clients buy by the box. The conversion factor belongs in 1C, not in a sales manager's head.
- **Variants.** Are sizes, colours and volumes set up as variants of one product, or as dozens of separate records? That decides how the product looks in the catalogue.
- **Warehouses.** Decide which ones count for the site: the main warehouse, yes; the shop display and the defective-goods store, no. If you have branches with pickup, you need stock for each one.
- **IKPU and package codes.** IKPU is the national product and service code. Without these codes there is no fiscal receipt for online payments, and the product record in 1C is the most convenient place to keep them.
- **Photos.** If you plan to keep them in 1C, check how many products have none. Photos and descriptions are often easier to manage on the site side.

Your side fixes the data: the accountant, the merchandiser, the purchasing manager. The developer can help with reports: lists of products without a barcode, without a price, or with suspiciously similar names. But deciding which of two records is the real one takes someone who knows the warehouse. Set aside time for this before launch, and agree on a rule for the future: a new product does not go on the site until it has a price, a barcode, an IKPU code and a photo.

## How the exchange works

There are three main options.

**The standard CommerceML exchange.** CommerceML is an XML-based format and the usual way a 1C database talks to an online store. Many trade configurations come with a built-in site exchange module, and a good number of e-commerce platforms accept the format. On a schedule, 1C connects to the site, uploads the catalogue, prices and stock, and collects new orders. Pros: quick, inexpensive, proven in a great many shops, and your 1C database does not have to be reachable from the internet. Cons: the format is built for an online store, not for a bot or a sales rep app; with a large catalogue a full upload is slow; non-standard fields and logic are hard to add.

**HTTP services or OData in 1C.** A custom API is built for the job: the site, bot or app asks 1C for the stock of a specific item, sends an order and gets an answer straight away. HTTP services are the flexible option and are written by a 1C developer. OData is a standard platform interface that exposes database objects for reading and writing with almost no programming on the 1C side, but it needs careful permission settings. Pros: accuracy and flexibility; you can check stock at the moment of checkout. Cons: the database has to be published through a web server and opened to outside access, and protecting it is now your job; every customer request puts load on 1C; when 1C is down, the site cannot answer.

**A separate service in between.** 1C pushes changes to an intermediate database, and the site, bot, app and mini app work with that instead. Pros: channels respond fast and do not depend on whether the 1C server is on; orders queue up and reach 1C once it is back; a new channel connects to the service, not to 1C. Cons: it is one more system to build, host and maintain. If it stores customers' personal data (names, phone numbers, addresses), Uzbekistan's personal data law requires it to sit on servers inside the country.

How to choose:

- One online store on a platform that supports CommerceML, and a standard configuration: start with the standard exchange.
- A bot, a sales rep app or a mini app alongside the site: look at a service in between. A Tashkent distributor with, say, two warehouses, a retail site and five sales reps would usually end up here.
- Real-time stock checks or reservations, with 1C on a reliable server: HTTP services, often combined with a service in between.

## How often to sync

Instantly, every few minutes or nightly: it depends on how fast your goods sell.

- **Nightly.** Enough when the range is stable and stock is deep: building materials at a distributor, stationery, spare parts kept in large quantities.
- **Every 5 to 15 minutes.** A sensible default for most businesses that sell in a shop and online at the same time. Send only the changes, not the whole catalogue.
- **Instantly.** Needed when stock is low and items are expensive or sold one by one: electronics, goods with serial numbers. At checkout the site asks 1C for the current stock.

Between syncs, an item can sell in the shop while a customer orders it online. Decide in advance what happens then, not after the first complaint:

- show "in stock" only above a threshold, for example more than three units, rather than the exact number;
- reserve the item in 1C as soon as the order arrives there;
- for fast-moving items, check stock with a separate request at checkout;
- agree what the sales manager does when the item is gone: calls the customer within an hour, offers a replacement, or refunds by the same method the customer paid with.

## Orders and payments back into 1C

An order from the site or bot should arrive in 1C as a ready document, not as a message to a manager. In trade configurations this is usually the customer order document (called "Заказ клиента" or "Заказ покупателя", depending on the version). Agree in advance:

- which counterparty a retail order is recorded against: each buyer, or a shared "retail customer" with the phone number in the comment;
- which warehouse, legal entity and price type are filled in;
- how delivery is recorded: as a separate service with its own price, or not at all;
- which statuses come back from 1C to the bot: "packed", "handed to courier", "shipped".

**Payments.** An order counts as paid only after Click, Payme or Uzum confirms the payment to your server, not because the customer returned to the "thank you" page. After that, a payment document is posted in 1C or the order is marked as paid. Which one is the accountant's call, because providers differ in how they settle money and deduct fees. Once a day, compare three lists: payments in the provider's dashboard, paid orders on the site, and payments in 1C.

**E-invoices.** For wholesale clients, the accountant usually issues e-invoices from 1C or from the operator's account, through Didox, Faktura.uz or whichever operator you already use. The site integration does not need to send invoices itself. Its job is to record the order and the sale in 1C correctly: the right counterparty, tax ID (STIR), prices and IKPU codes. Then the invoice goes out the usual way.

## Your 1C setup and your 1C specialist

Before giving you a price, a developer needs to know:

- **Configuration and version.** Standard Trade Management, Retail or Accounting, an industry solution, or a configuration that has been customised for you over the years. This decides whether a ready exchange module exists and whether it will behave as intended.
- **Custom changes.** If standard documents were modified, the standard exchange may do unexpected things. New exchange features are best added through configuration extensions: the configuration stays on vendor support and updates are much easier to install.
- **Where the database runs.** A file-mode database on the accountant's computer, which is switched off every evening, is a poor home for an exchange that runs every ten minutes. A client-server installation in the office or on a rented server is more reliable. For HTTP services and OData, the database must be published through a web server and protected: HTTPS, a separate user with minimal rights, access only from the addresses that need it.
- **Platform version.** On 7.7 and older 8.x versions, some modern exchange options simply do not exist.

The 1C specialist and the site developer work together. The first owns everything inside 1C: data export, order import, modifications. The second owns the site, bot, app and any service in between. Projects usually drag when each side assumes a field is "the other side's job". The cure is one document: a field table that says, for each field, where it comes from, in what format and who is responsible for it. The 1C specialist's work is often billed separately through your 1C partner, so put it in the budget from the start.

## When the exchange breaks

It will break: after a 1C update, after a password change, when the server runs out of disk space, when someone saves a product with an empty price. What matters is who finds out and how fast.

- **Exchange logs** on both sides: when the last successful run was, how many products and orders went through, what errors came up.
- **Alerts to a Telegram group:** no exchange for over half an hour, an order did not reach 1C, a product arrived without a price, a payment exists but the order does not.
- **A manual fallback.** The site and bot keep taking orders even when 1C is unavailable; orders queue and go through once the connection is back. The sales manager knows where to see them and how to enter them by hand if needed.
- **A check after every 1C update:** on a copy of the database first, then on the live one.
- **A daily reconciliation:** yesterday's orders on the site against orders in 1C. Five minutes a day costs less than working out a month later where several orders went.

## Timelines and what drives the cost

Rough guides for planning:

- the standard CommerceML exchange with a standard configuration and a ready online store: usually from a few days to a couple of weeks, testing included;
- a custom exchange for a bot, a sales rep app or several channels: usually a few weeks for a single flow, and up to about three months for several channels with a service in between;
- cleaning up the data: from a few days to a few weeks, depending on the size and condition of the catalogue. This runs in parallel and often sets the launch date.

What pushes the cost up:

- the number of channels: site, bot, mini app, sales rep app;
- how heavily the configuration has been modified, and the lack of a test database;
- variants, several price types and warehouses, individual prices for wholesale clients;
- statuses flowing back, reservations and real-time stock checks;
- a service in between and its hosting;
- 1C specialist hours, often billed separately;
- ongoing support: after 1C updates the exchange needs checking and sometimes fixing.

## Checklist before starting

- Configuration name and version, platform version, list of modifications.
- Where the database runs: file mode or client-server, office or rented server, who administers it.
- Access: a 1C user for the exchange with the right permissions, admin access to the site, payment provider keys.
- A field table: what flows, in which direction, how often, who owns it.
- Which price types and warehouses take part in the exchange.
- A decision on what happens when an item sells out between syncs.
- A test copy of the database. Testing on the live database is not an option: test orders end up in reports and stock.
- Responsible people on both sides: on yours, someone who knows the accounting and can make decisions; on the contractor's, the 1C specialist and the site developer, with a single contact for questions.
- The e-invoice and payment reconciliation process agreed with the accountant.

Tell SamurAI on qilich.com which 1C configuration you use and where you sell, whether on a site, in a bot or through sales reps, and we will suggest which exchange option to start with.
