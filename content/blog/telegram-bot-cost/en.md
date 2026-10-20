---
slug: telegram-bot-cost
lang: en
title: "What a Telegram bot costs in Tashkent, and what drives the price"
description: "From a menu bot to one with payments, CRM sync and AI: what really sets the price of a Telegram bot, where you can save and where you shouldn't."
date: 2026-10-21
tags: [telegram bot, cost, payments, integrations, AI]
related: [telegram, backend, ai]
reading_minutes: 9
---

You asked three companies for "a Telegram bot for orders" and got three prices that differ several times over. One looks suspiciously cheap, another is expensive for no obvious reason, and you can't compare them: one quote is two lines long, the other is a page of jargon. Most likely nobody is trying to cheat you. Each of them simply priced a different bot. This article breaks a bot into the parts you actually pay for, shows what each part adds to the build and to the monthly bill, and gives you a way to put two quotes side by side, line by line.

## Why quotes for "a bot" differ so much

The word "bot" says nothing about the amount of work. It can be a menu of five buttons with your address, prices and phone number. Or it can be an ordering system: a catalogue with live stock, a cart, delivery zones, Payme payments, alerts to operators, a panel for the manager and an exchange with 1C. The gap between those two is measured in multiples, not percentages. So the honest answer to "how much does a Telegram bot cost" is: it depends on what the bot has to do.

Say a clothing shop asks for "a bot that takes orders". The first company reads that as: the customer types the order as free text and the bot forwards it to the managers' group. The second assumes the customer picks size and colour from a catalogue synced with 1C and pays by Click on the spot. Both quotes are honest. They describe two different products.

Two more reasons for the spread:

- **Bot builder or custom development.** Builder platforms get you started fast for a monthly fee, but you hit their limits as soon as you need a non-standard flow or an integration. Custom development costs more up front, and the code and data stay with you.
- **What the price includes.** One company includes testing, the server and a month of support; another quotes only the programming, and the rest turns up later.

## The parts of a bot you pay for

- **Conversation flows.** Every path a customer takes: sign-up with a phone number, catalogue, cart, checkout, order status, feedback. Cost grows less with the number of screens than with the branches: what happens when the customer taps "Back", the item is out of stock, or the address is outside the delivery zone.
- **Admin panel.** Where staff edit products and prices, see orders and move them from status to status. It can be a web panel or commands inside Telegram. Without one, every price change goes through a developer.
- **Database.** Customers, orders, history. Almost every bot beyond a simple info menu needs one.
- **Staff notifications.** A new order lands in the operators' group with "accept" and "reject" buttons, the courier gets the address, the owner gets the day's summary.
- **Broadcasts.** A message to every subscriber about a promotion or a new menu. Telegram limits how fast a bot can send, so a large list needs a queue, and the bot has to handle people who have blocked it.
- **Reports.** At the start an export of orders to Excel is usually enough. Charts and dashboards can come later.

## Payments: Click, Payme, Uzum and fiscal receipts

Payments get their own line in the quote because they are a separate integration with someone else's system, and mistakes there cost real money.

What goes into it:

- **The merchant contract.** This is the business's job, not the developer's: your company or sole proprietorship (YaTT) signs a contract with Click, Payme or Uzum and receives the keys to connect. Start this in the first week of the project, or the finished bot will sit waiting for paperwork.
- **How the customer pays.** A link to a payment page, or payment inside Telegram through a connected provider; which one depends on the provider you sign with.
- **Handling the payment system's requests.** The bot's server has to accept requests from Payme or Click, answer them in that system's protocol (each has its own sequence: check, create, confirm and cancel a transaction) and match every payment to the right order.
- **Edge cases.** The customer paid but no confirmation arrived. The same request came twice. The customer cancelled after paying. Part of the amount has to be refunded. Most of the testing time goes on exactly these cases.
- **Fiscal receipts.** Online payments usually require a fiscal receipt, and that needs an IKPU (MXIK) code, a package code and a VAT rate for every item. The payment system can issue the receipt itself if the bot sends the order contents with the codes. If your catalogue has no codes, they have to be filled in before launch, and that is your accountant's job, not the developer's: ask them how the rules apply to your business.

Each additional provider is another integration with its own protocol and its own testing. If most of your customers pay the courier in cash or with a Humo or Uzcard card on a terminal, you can launch without online payment and add it in a second stage.

## Integrations: 1C, amoCRM, Bitrix24, Google Sheets

Integrations stop the bot and your other systems from living separate lives: stock and prices come from 1C, orders go back into it, and leads land in amoCRM or Bitrix24 tagged as coming from the bot.

The cost depends on four things:

1. **Whether the other system has a usable API.** amoCRM and Bitrix24 do, and it is documented. With 1C it depends on the configuration: a standard one is easier to connect, one customised for you is harder, and you often need your own 1C programmer to open up the exchange.
2. **Direction.** Reading prices from 1C is simpler than also writing orders back into it.
3. **Frequency.** Refreshing stock once an hour and checking it at the moment of every order are different jobs.
4. **How clean the data is.** If the same product sits in 1C three times under three names, the integration will technically work and the customer will see a mess in the catalogue. Cleaning up the product list sometimes takes longer than the integration itself.

Google Sheets is a cheap way to start: a manager edits prices in a spreadsheet and the bot reads them. For a catalogue of a few dozen items that is enough. Trouble starts when someone renames a column, types a comma instead of a decimal point, or three people edit the sheet at once.

## Two languages, AI answers and other add-ons

**Uzbek and Russian.** Almost every business in Tashkent needs both. That means more than translating buttons: there are error messages, notifications, product descriptions and operator replies. Descriptions are usually written by the business itself, so put that in the plan. A separate question is Latin versus Cyrillic Uzbek: some older customers are more at home with Cyrillic. Every variant is one more set of texts to update with every change. Catalogue search should cope with both scripts and with typos: a customer may type "somsa", "samsa" or "сомса".

Even if you launch in one language, ask for the texts to be kept separate from the code. Then a second language is a translation job, not a rebuild.

**AI for free-text questions.** Customers write "Do you deliver to Yunusabad?", "Is there parking?", "Can I move my appointment to tomorrow?". An AI model can answer such questions from your own knowledge base and pass to a person whatever it doesn't know. What that adds:

- to the build: the knowledge base, tuning the answers, testing on your customers' real questions, handing the conversation to an operator;
- to the monthly bill: a usage fee to the AI provider for every request, which grows with the number of conversations;
- to the risk: models often answer worse in Uzbek than in Russian, so test in both languages.

If most questions repeat, buttons and an FAQ section are cheaper and more reliable. AI pays off where the questions really vary.

**Other add-ons**, each its own line: delivery zones by location, time-slot booking for clinics and learning centres, bonuses and loyalty, and a Mini App instead of buttons. A Mini App is a web interface inside Telegram with photos, filters and a cart. For a catalogue of hundreds of items it is easier to use than buttons, but it costs noticeably more, because it is essentially a small website.

## Running costs after launch

Ask up front what a month of running the bot will cost, and count it together with the build price.

- **Server.** A monthly fee. A simple bot runs on a small server; load grows with users, files and AI requests.
- **Domain and certificate** for the admin panel. The certificate can be free (Let's Encrypt).
- **AI.** You pay for what you use. Set a monthly cap so you don't get a surprise bill.
- **Payment fees.** Set by your contract with Click, Payme or Uzum, not by the developer.
- **Monitoring and backups.** Someone has to find out the bot stopped answering on Friday evening before customers start writing about it.
- **Small changes.** A new button, a new delivery district, a seasonal menu. Agree in advance: hourly rate or a monthly package.
- **Updates.** Telegram changes its Bot API from time to time, and libraries get updated. Small but regular work.

Using the Telegram Bot API itself is free.

One point specific to Uzbekistan: if the bot stores names, phone numbers and addresses of Uzbek citizens, the law on personal data requires that data to be kept on servers inside the country. Hosting in a local data centre can be more expensive or less convenient than the big foreign clouds, but it is a requirement, not an option. Check the law's other requirements for your case with a lawyer.

## Where saving is fine and where it isn't

Fine to cut:

- extra screens and features used once a month;
- complex analytics in the first version, if an Excel export does the job;
- a second payment provider at the start;
- AI, if the questions repeat;
- a Mini App, if the catalogue has thirty items;
- Cyrillic Uzbek, if your customers barely use it (check before you decide).

Don't cut:

- **testing**, especially payment and checkout, on real phones and on a slow connection;
- **the admin panel**, or you depend on a developer for every price change;
- **backups**: a lost customer database costs more than the whole bot;
- **payment edge cases**: a double charge or "I paid and there's no order" damages trust more than any design flaw;
- **error alerts**: if the bot goes down, your team should be the first to know.

## How to compare two quotes

Ask each company to break the price into parts, then put the answers in one table.

| Part | What to check in the quote |
|---|---|
| Flows | Are all the customer's paths listed, and what happens in the unusual cases |
| Admin panel | Web or inside Telegram; what staff can change without a developer |
| Payments | Which providers, fiscal receipts, refunds, who tests |
| Integrations | Which systems, in which direction, how often |
| Languages | Uzbek (Latin, Cyrillic), Russian; who writes the texts |
| AI | What the build includes and roughly what usage costs per month |
| Server | Whose account, where it is, who pays |
| Support | How long, what counts as a bug and what as a new task, how fast they respond |
| Ownership | Who owns the code, the bot and the token |

Also ask:

- **Who owns the bot and its token.** The bot should be registered through BotFather on your company's account, or transferred to you at handover. If the bot stays with the developer, you risk losing your subscribers when you part ways.
- **Whether you get the source code** and access to the repository.
- **The timeline by stage**: working out the flows, development, testing, launch. And what they need from you at each stage: texts, photos, the merchant contract, access to 1C.

As a rough guide, if everything on your side is ready on time: a menu bot takes about a week, an ordering bot with an admin panel a few weeks, and a bot with payments and a 1C integration one to three months. Timelines slip less often because of programming than because of waiting for the merchant contract, 1C access and texts.

Warning signs: a price given without a single question about your business; "everything included" without a list; no testing stage; the bot registered on the developer's account.

## Qilich prices

We give an exact figure for a Telegram bot once we have seen the list of parts, so you can compare it with other quotes line by line. To get one, answer the questions below.

- What the business does and what the bot should do, in one sentence; who will use it (customers, operators, couriers, the owner).
- The main flows: for example catalogue, cart, address, payment, order status.
- How many products or services, how often prices change and where they live now: 1C, Excel or a manager's head.
- How customers pay: cash, card to the courier, Click, Payme, Uzum; whether you already have a merchant contract and need fiscal receipts.
- Which systems to connect: 1C (which configuration), amoCRM, Bitrix24, Google Sheets, and who on your side can give access.
- Languages: Uzbek in Latin script, Uzbek in Cyrillic, Russian.
- Rough daily volume: orders or requests, and free-text questions (and who answers them now).
- Who will run the bot day to day, and from a phone or a computer.
- Any hard launch date, who prepares texts and photos, and what support you need after launch.

We will send back an estimate by part and by stage: what is included, what is not, and how long each stage takes.

Describe the bot you have in mind to SamurAI on qilich.com, or send this checklist to inbox@qilich.com.
