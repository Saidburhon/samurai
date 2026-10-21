---
slug: personal-data-in-uzbekistan
lang: en
title: "Storing personal data in Uzbekistan: sites, apps and bots"
description: "Personal data of Uzbek citizens must be stored on servers in the country. Here is what that means in practice for your website, app, bot and CRM."
date: 2026-10-21
tags: [personal data, compliance, hosting, security, backend, telegram-bot]
related: [cloud-data-compliance, cloud-hosting-uz, cloud-backup-dr, cloud-migration]
reading_minutes: 10
---

Almost every business with a website, bot or CRM collects personal data: names, phone numbers, delivery addresses, order history. Uzbek law requires this data about Uzbek citizens to be stored on servers physically located in Uzbekistan. In practice, the bot's database often sits with a foreign host, leads go into a cloud CRM, customer phone numbers live in a Google Sheet made "for the couriers", and backups go wherever the provider sends them by default. Owners usually find out only when they ask their developer directly. What follows is an engineer's view, not a lawyer's: what counts as personal data in a typical product, where it actually ends up, and how to build the system so the main copy stays in Uzbekistan. The legal conclusions for your case are a lawyer's job.

## What the law says, briefly

- **The main law.** The Law of the Republic of Uzbekistan "On Personal Data", No. ZRU-547 of 2 July 2019. It defines personal data, the owner and the operator of a database, when a person's consent is needed, and the person's rights: to know what is stored about them, to have it corrected, to withdraw consent, and to ask for deletion.
- **The localisation rule.** In 2021 Article 27¹ was added. An owner or operator processing personal data of Uzbek citizens with information technology, including on the internet, must collect, organise and store it in databases on hardware physically located in Uzbekistan. This is what people mean by personal data localisation in Uzbekistan.
- **Registration.** Those databases have to be registered in the State Register of Personal Data Databases. The law names the State Personalisation Centre under the Cabinet of Ministers as the authorised body. Procedures and responsible agencies change over time, so check the current registration process with a lawyer.
- **Liability.** Violations carry administrative and criminal liability, and access to a service can be restricted. In 2021, access to several large foreign social networks was restricted, with the localisation rule cited as the reason.

Find the current text with all amendments on [lex.uz](https://lex.uz) and read that, not someone's summary, this one included. This article is not legal advice. It is meant to help you prepare questions for your lawyer and your developer.

## What counts as personal data in your product

The law defines personal data broadly: any information that relates to a specific person or makes it possible to identify them. In a typical bot, app or CRM that includes:

- name, phone number, email, date of birth;
- Telegram ID and username, which identify a person even if they never shared a phone number;
- delivery addresses and any location a customer sent to the bot;
- order history. For a pharmacy or a clinic it shows what someone is being treated for, and the law treats health data as a special category with stricter rules;
- photos and documents: a selfie for identity checks, "before and after" photos at a clinic, passport scans;
- passport details and the personal identification number (PINFL), common in hotels, clinics, training centres and instalment plans;
- children's data at training centres, sports clubs and private schools;
- support chats, voice messages, call recordings;
- biometrics, if people enter a club or office by face or fingerprint.

Your staff count too. HR records and payroll in 1C, and the CVs candidates send to your HR manager on Telegram, are all personal data.

A simple working rule: if you can tell who a record is about, treat it as personal data until a lawyer tells you otherwise.

## Map where your data goes

A product almost never lives on one server. Take a hypothetical flower delivery business with a website, a Telegram bot and a cloud CRM. A single order leaves a trace in the main database, the backups, the CRM, an SMS notification, the website analytics, the logs, and possibly a spreadsheet a manager made for the couriers.

Fill in a table like this one for your own product, together with your developer. One meeting is usually enough.

| Where | What data | Where the servers physically are | What to check |
|---|---|---|---|
| Main database of the site or bot | Customers, orders, addresses | Depends on the host | Country and data centre written into the contract |
| Backups | A full copy of the database | Often not where the main server is | Where they go, how long they are kept |
| CRM | Names, phones, chats, deals | For a cloud CRM, on the vendor's servers | Which country your account's data is stored in |
| SMS, email, push | Phone numbers, email addresses, message text | A local gateway or a foreign service | Whether extra details end up in the text |
| Analytics and session recordings | Site activity, sometimes form contents | Usually abroad | Whether phone numbers are sent, whether fields are masked |
| AI services | Chats, documents, requests | Usually abroad | What exactly goes into each request |
| Logs and error monitoring | Whole requests, with phones and addresses | Often abroad | Whether personal data is stripped out |
| Payment provider | Amount, order number, sometimes a phone number | Click, Payme and Uzum are local companies | Whether you send more than needed |
| Spreadsheets and cloud drives | Customer lists made "for now" | Usually abroad | Who made them and who has access |
| Laptops and test servers | Copies of the production database | Anywhere | Whether real data exists outside production |

Telegram itself is a separate question. Messages a customer sends to your bot pass through Telegram's servers, and you cannot change that. What you control is what your bot stores and where it sends it next. One useful engineering detail: a Telegram Mini App is a web page that opens inside Telegram, and a form in it sends data straight to your server, not as a message through Telegram. If your bot collects something sensitive, such as a photo of an ID document, it is better to do that in a mini app with its backend in Uzbekistan. How to treat Telegram as a channel under the law is a question for your lawyer.

The most common findings when a business draws this map for the first time: backups in another country, a spreadsheet of phone numbers made "for a couple of weeks" two years ago, and a copy of the production database on the laptop of a developer who stopped working with you long ago.

## Hosting in Uzbekistan

Tashkent has data centres run by telecom operators and private companies, and cloud providers that offer virtual servers. Some also offer managed databases and file storage. The choice is narrower than with global clouds, but it is enough for the website, bot or app of a small or medium business.

What to ask a provider before you sign:

1. **Where the servers physically are.** City and data centre. Ask for the contract to state that data is stored in Uzbekistan.
2. **Where the backups go.** How often they are made, how long they are kept, which country they are stored in. Whether they have tested a restore and how long it took.
3. **Availability.** What uptime they commit to, what happens when power or the network goes down, whether they have had major outages and how they told customers about them.
4. **Support.** Hours, channel, language, and how fast they respond at night and on weekends.
5. **What is included.** Just a virtual server, or also a managed database, file storage, a load balancer, DDoS protection, monitoring. Anything the provider does not offer, your team has to set up and run itself.
6. **Connectivity.** A connection to TAS-IX, so the site loads fast for local users, and the speed of the international link if your system calls foreign APIs.
7. **Paperwork.** A legal entity in Uzbekistan, a contract, payment in UZS by bank transfer, e-invoices through Didox or Faktura.uz. Your accountant will be glad you asked.
8. **How to leave.** Whether you can export your data and server images if you decide to switch providers.

An honest word about cost. For a small business's bot or website, server rent is usually not the main expense. Looking after the servers costs more: updates, monitoring, checking that backups actually restore. Local providers offer fewer ready-made managed services, so there can be more of this work than in a global cloud. Budget for it in monthly maintenance, not only in the one-off development cost.

## Foreign services: CRM, analytics, AI

Dropping every foreign service is usually neither necessary nor realistic. The working principle: the master copy of the data lives in Uzbekistan, and each external service gets only what it cannot work without. Whether a particular transfer abroad is allowed in your setup is for your lawyer to decide, because the law treats cross-border transfer separately.

- **CRM.** Ask the vendor or partner which country your cloud account's data is physically stored in. If it is not Uzbekistan, the options are an on-premise version on your own server in Uzbekistan (Bitrix24, for example, has one), your own system on local hosting, or a setup where the CRM receives as few fields as possible. More in [Choosing a CRM](/en/blog/choosing-a-crm/).
- **Analytics.** A visitor counter does not need names or phone numbers. Keep them out of events and parameters, use an internal ID instead of a phone number, and turn on input masking for session recordings.
- **AI services.** Most strong models run on servers abroad. Before sending text, replace names, phone numbers, addresses and document numbers with placeholders such as [NAME] and [PHONE], then put the real values back on your side when the answer comes in. For sensitive tasks, consider a model running on your own server. More in [AI answering customers in Telegram](/en/blog/ai-support-in-telegram/).
- **SMS, email and push.** The service needs a number and a text, nothing more. Keep the text short: "Your order is ready", not the order contents and the address. Local SMS gateways exist.
- **Logs and error monitoring.** An error report can easily include the whole request, phone number and address included. Filter personal data out before it is sent, and keep logs for a short time.
- **Maps and geocoding.** An address you send to get coordinates goes to an outside service. Send the address without the name and phone number.

Read each service's terms as well: where it stores data, whether it uses your data to train models, and how to delete everything if you stop using it.

## Consent and the privacy notice

In most cases the law requires a person's consent before you process their personal data. In practice:

- **In a bot:** before asking for a phone number, the bot briefly explains why it needs it, links to the privacy notice and shows an "I agree" button. The customer then sends the number with the "Share contact" button.
- **On a website or in an app:** a separate checkbox next to the form, not ticked in advance, with a link to the notice.
- **For marketing messages,** ask for separate consent rather than relying on the consent given with an order.
- **Record the consent:** who agreed, when, and to which version of the text. Without that record, consent is hard to prove.

Write the privacy notice in plain language, in Uzbek and Russian, and make both versions say the same thing:

1. who you are: company name, tax ID (STIR), contacts;
2. what data you collect;
3. why you need each item;
4. where it is stored and who it is shared with: the payment provider, the delivery service, the CRM;
5. how long it is kept;
6. how a person can find out what you hold about them, correct it, withdraw consent and ask for deletion, by Telegram, phone or email;
7. the date of the last change.

A template found online and machine-translated will not do, because it describes someone else's system. The notice is written from your data map and then checked by a lawyer.

Deletion on request has to actually work. The data must be deleted or anonymised in the main database, the CRM and the mailing service, and backups containing it should expire on their normal schedule. Some records must be kept under other laws, such as invoices and fiscal receipts. That is normal, but decide in advance what gets deleted, what gets anonymised and what stays.

## Design it in from the start

In a new project, localisation costs little: it is a choice of host plus a few architecture decisions, usually a few days of work inside the project. Moving an existing system is a project of its own, from one or two weeks for a bot with a single database to several months for a system with a CRM, analytics and integrations. The timeline grows with the number of places the data lives, the size of the database, whether the CRM has to be replaced, how much downtime you can accept, and whether the developer who built the system is still around.

Decisions that make localisation easy:

- **One source of truth.** The main customer database sits on your server in Uzbekistan. The CRM, mailing tools and analytics receive only the fields they need, or just an internal ID.
- **All outbound data goes through your backend.** Then there is one place where you can see which fields go where. A list of allowed fields is safer than "send everything, it might come in handy".
- **Personal data kept apart.** Separate tables or a separate service for customer data, especially passports and medical details, with their own access rights, encryption and a separate store for scanned documents.
- **Backups inside the country.** Encrypted, in a different data centre or with a different provider in Uzbekistan, with restores tested regularly.
- **Lean logs.** Phone and document numbers masked, short retention.
- **No real data in development.** Test servers and developers' laptops work with generated or anonymised data.
- **Roles and an audit log.** You can see who viewed, exported and deleted data.
- **Portability.** Containers and infrastructure described in code, so that if you need to, you can change providers in days rather than months.

For the other protective measures, see [Security for your site, app and bot](/en/blog/security-basics/).

The most common mistakes:

- choosing a foreign host "for the start" and putting off the move while the database keeps growing;
- checking the server but forgetting the backups, logs and spreadsheets;
- sending whole records to AI and analytics "just in case";
- leaving it all to the developer. Registering the database and publishing the privacy notice are the job of the data owner, which is your company; the developer prepares the technical part;
- copying a privacy notice from someone else's website.

## Questions to ask your developer

Ask these before work starts, or now if your system is already running. Ask for the answers in writing.

- Where are the server and the database physically located? Which provider and which data centre?
- Where do backups go, how often are they made, how long are they kept, and when was a restore last tested?
- Which external services receive customer data, and exactly which fields?
- What ends up in logs and error monitoring, and where are they stored?
- Who has access to the production database, on our side and on yours? How is access removed when someone leaves?
- Is there real customer data on laptops, test servers or in spreadsheets?
- How long is each kind of data kept, and how does deletion on request work?
- Is data encrypted in transit and at rest? Where are scanned documents stored?
- What will you prepare for the database registration and for the privacy notice?
- How much time and work would moving to another provider take?

If the answer to half of these is "I don't know", there is no need to panic. It is a reason to draw your data map in the next few weeks and use it to decide what to move first.

Tell SamurAI on qilich.com what your product does and what data it collects, and we will suggest where that data should live.
