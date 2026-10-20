---
slug: ai-document-processing
lang: en
title: "AI for document processing: invoices, waybills and contracts"
description: "Instead of retyping data from paper and PDFs, AI reads documents and enters them into 1C or a spreadsheet. Where it works and where a check is a must."
date: 2026-10-21
tags: [ai, documents, 1c, e-invoicing, automation, personal-data]
related: [ai, backend, telegram]
reading_minutes: 7
---

Every day a stack of documents lands in accounting: supplier waybills, invoices, acts of completed work, powers of attorney, contracts. Some are already in Didox, some arrived as PDFs in Telegram, and some came with the driver on paper, creased, with a stamp across the figures. Someone opens each one and types the supplier, tax ID, line items, quantities and totals into 1C. It is slow, dull work, and its mistakes surface a month later when you reconcile with the supplier. AI can take over the reading and the typing, but not for every document and not without checks. This article covers which documents to give to AI, how the path from a photo to a 1C record should be built, and where a person has to stay in the loop.

## Which documents are already data

Start with a simple inventory: what arrives, in what form, and how many per month. It often turns out that a good share of incoming documents is already electronic.

An e-invoice that a supplier sends through Didox, Faktura.uz or another operator is not a picture. It is structured data signed with an E-IMZO digital signature, with the tax ID (STIR), line items, quantities, prices and VAT already in separate fields. Running it through AI is like photographing a screen so you can retype the text. The right tool is an integration: documents are pulled from the operator through an API or a ready-made module and land in 1C as draft purchase documents. Some operators offer ready-made 1C solutions; if your 1C configuration is heavily customised, you will need your own integration. More on that in [Connecting 1C to your website, app and Telegram bot](/en/blog/1c-integration/).

Operators carry more than invoices, so ask your larger suppliers which other documents they can send electronically. And watch for a common mistake: the supplier also drops a PDF copy of an e-invoice into Telegram, and the office sends that PDF off to be recognised even though the data is already sitting with the operator.

| Document | Usually arrives as | What to do |
|---|---|---|
| E-invoice | Through Didox, Faktura.uz and other operators | Integrate with the operator, no AI needed |
| Bank statement | Export from the bank's client system | Standard exchange with 1C |
| Supplier price list | Excel, sometimes PDF | Excel: parse by column template; PDF and new layouts: AI |
| Paper waybill or act | Photo, scan | AI, validation rules, a person |
| Contract | PDF, scan, Word | AI summarises, a person decides |

## Where AI helps: scans, photos and PDFs

What's left is everything that arrives as an image or an unstructured file. Take a hypothetical building contractor: cement, rebar and bricks arrive at its sites every day, each delivery comes with a waybill, and every supplier has its own layout. The old approach was to set up a recognition template for each layout, and any change to the layout broke it. Current models read a document by meaning. They find the supplier, number, date, line-item table and totals even on a layout they have never seen.

What reads well:

- printed text and tables in PDFs and clean scans;
- company details, dates, numbers and amounts;
- documents in Russian and Uzbek, in Latin and Cyrillic script. Test on your own samples, because models differ a lot in Uzbek.

What reads less well:

- handwriting, such as "48 received" written over a printed "50";
- a stamp or signature on top of figures;
- photos taken at an angle or in shadow, and creased paper;
- tables that run onto a second page, especially when nobody photographed the second page.

Handwriting is the main source of errors. If the storekeeper or site foreman writes the quantity actually received by hand, that field should always go to a person for confirmation, however confident the model looks.

## From a photo to a record

A document goes through five steps. Each can be simpler or more elaborate, but none can be skipped.

1. **Capture.** A storekeeper or driver photographs the waybill and sends it to a Telegram bot; suppliers email documents to a dedicated address; the office scanner drops files into a folder. The bot checks image quality straight away and asks for a new photo if it is blurry or cropped, while the driver is still at the warehouse.
2. **Extraction.** The model reads the document and returns fields in a fixed structure: supplier, tax ID, number and date, line items (name, quantity, unit, price, amount), VAT and total, with a confidence score for each field.
3. **Validation.** Ordinary code, not AI, runs mechanical rules. More on them in the next section.
4. **Review.** A person skims documents where everything checks out and corrects the flagged fields on the rest.
5. **Write.** The confirmed document goes into 1C as an unposted purchase document (through an HTTP service or OData), or into a spreadsheet as a row. The accountant posts it. The original file is stored alongside and opens from the record in one click.

AI should never post documents itself. A draft the accountant posts with one button saves almost as much time, and a mistake never reaches the books or the tax reports.

Product matching is a separate job. The supplier writes "Rebar A500 d12", while the same item has a different name in your 1C. A mapping table solves it: the first time, a person picks the item, and from then on the system remembers the pair "supplier plus supplier's name". AI can suggest a candidate, but the person's choice is what gets saved. After a few weeks, most items from regular suppliers match on their own.

## Checks that catch errors

A model can confidently read an "8" as a "3" or skip a line. So every extracted value goes through rules written in ordinary code:

- **arithmetic**: quantity × price equals the line amount, the lines add up to the total, VAT recalculates at the rate;
- **tax ID (STIR)**: nine digits, and a counterparty with that ID exists in your list. A new tax ID always goes to a person;
- **products**: every line is matched to an item in your catalogue;
- **purchase order**: items, quantities and prices match your order to the supplier, and any difference above a set threshold is flagged;
- **duplicates**: if a document with the same supplier, number and date was already entered, it isn't entered again. This happens often when the same waybill is sent as a photo and as a PDF;
- **dates**: not in the future and not in a closed period;
- **model confidence**: low-confidence fields are highlighted even when the arithmetic works.

The rules are what make the setup reliable. You can swap the model for another one; the rules stay and keep catching its mistakes.

## Human review is part of the design

Don't think of review as a temporary crutch to be removed later. Design it as the main working screen:

- the document image on the left, the fields on the right; clicking a field shows where on the image it came from;
- flagged fields at the top with the reason: "lines don't add up to total", "new supplier", "handwritten correction";
- fixing a field and confirming the document by keyboard, with no extra windows;
- every correction is logged, which shows which suppliers and fields go wrong most often.

Manual review is reduced gradually, based on data. If a particular supplier and document type have gone several weeks without corrections, their documents that pass every rule can be confirmed automatically, with spot checks kept in place, for example every twentieth document. New suppliers, new layouts and anything that fails a rule still go to a person.

Decide up front who owns the queue. If documents sit in review for a week, you have the same backlog as before, just in a different window.

## Contracts: a summary, not a decision

Contracts are a different job. There is nothing to copy line by line, but they have to be read without missing what matters. AI is good at the summary:

- the parties, subject, amount, currency and payment terms;
- dates: delivery, payment, contract term, automatic renewal;
- penalties, termination terms, and which court hears disputes;
- clauses that differ from your standard contract, and clauses your standard contract doesn't have at all.

A useful local case is the bilingual contract with Uzbek and Russian side by side in two columns. AI can flag places where the two texts differ on an amount, a deadline or a party's obligations. That kind of mismatch is easy to miss when reading by eye.

A summary is an aid for a lawyer or manager, not a legal opinion. The model may miss a clause or misread a reference to an annex. Whether to sign is decided by a person who has read the whole contract. One more practical gain is deadlines: dates from the summary go into a calendar or a Telegram reminder, so the end of a contract doesn't catch you by surprise.

## Costs and data protection

What the cost is made of:

- **development**: capture, extraction, rules, the review screen, writing to 1C. Time and price are driven mostly by the number of document types, the state of your reference lists in 1C (duplicate counterparties and products will need cleaning) and how heavily your 1C is customised;
- **model fees**: per page or by volume of text and images. This is usually cents per page rather than dollars, but it depends on the model, the image resolution, and whether you run each document twice to cross-check;
- **hosting**: the application server and storage for original files and logs;
- **maintenance**: new layouts, new suppliers, and re-testing after the provider updates the model;
- **review time**: staff minutes, which come off the savings.

On timelines: one document type with rules, a review screen and writing to 1C usually takes 3 to 8 weeks. An integration with your e-invoice operator is much quicker if a ready-made module exists for your configuration, and slower on a heavily customised 1C. Each additional document type costs less than the first, because capture, review and the write to 1C are already in place.

Now the data. Many documents contain personal data: contracts with individuals (passport details, personal ID number), powers of attorney issued to drivers, HR paperwork. Uzbekistan's law on personal data requires the personal data of Uzbek citizens to be stored on servers in Uzbekistan. In practice:

- original files, extracted data and logs are stored on a server in Uzbekistan;
- documents with personal data are anonymised before going to an external model, or processed by a model on your own server. Scans make this harder than plain text: recognition runs on your side first, and only text without passport details goes to the external model;
- you have read the provider's terms: whether it keeps files and whether it uses them for training;
- access to the review screen is limited, so a warehouse operator doesn't see contracts with salary figures.

Agree the setup with a lawyer. More in [Storing personal data in Uzbekistan](/en/blog/personal-data-in-uzbekistan/).

## A pilot on one document type

Don't start with every document at once.

1. **Pick the most frequent document.** Usually it's waybills from a few large suppliers. Not contracts: there are few of them, and the gain there isn't measured in minutes.
2. **Collect 100 to 200 real samples** from past months, bad photos and handwritten corrections included, together with the correct values from 1C.
3. **Measure "before"**: minutes per document from arrival to the 1C record, how many errors show up later in reconciliation, how large the backlog gets on busy days.
4. **Write the criteria down in advance**: share of documents with no corrections, time per document including review, zero errors reaching posting.
5. **Run two weeks in shadow mode**: the system processes the real flow, people work as usual and compare results.
6. **Then work through the review screen**, with the same measurements.

If time per document, review included, hasn't dropped noticeably, find where the minutes go: bad photos, messy reference lists, an awkward screen. Often the model isn't the problem at all. For the payback sum, see [Will automation pay for itself?](/en/blog/automation-roi/).

Mistakes to avoid:

- running OCR on documents the operator already holds electronically;
- letting AI post documents in 1C without a person;
- trusting the model with arithmetic instead of the rules;
- starting without a product mapping table and with messy reference lists;
- switching off manual review for all suppliers at once.

Tell SamurAI on qilich.com which documents your team retypes every week. That is a good place to start talking about a pilot.
