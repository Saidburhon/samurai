---
slug: chatbot-ux
lang: en
title: "A chatbot customers don't hate: design rules for Telegram bots"
description: "Endless menus, unwanted broadcasts, no way to reach a person. The mistakes that drive customers out of a bot, and practical rules for a usable one."
date: 2026-10-21
tags: [telegram-bot, chatbot, ux, bot-design, broadcasts]
related: [telegram, ai]
reading_minutes: 8
---

Your business has a Telegram bot, or will soon. A customer presses Start, and here is what happens: booking a dentist takes five levels of menus, a typed question gets "Unknown command", there is no "Talk to a person" button anywhere, and every other day a promotion arrives that nobody asked for. The customer does the easy thing: blocks the bot and messages the manager directly, or calls. The bot technically works; people just don't use it. Below are rules for designing a bot as a product with its own user experience, not as a tree of menus. They apply equally to a bot built on buttons and to one with AI behind it.

## One bot, one main job

Ask yourself why most customers come to you. For a delivery service it is ordering food; for a clinic, booking an appointment; for a learning centre, checking the timetable and signing up for a trial lesson; for a service company, leaving a request. That is the main job, and it should be the first button. Everything else (about us, vacancies, reviews, franchising) is secondary and goes lower down or into a "More" section.

How to find the main job:

- write down what customers ask your managers most often, in Telegram and on the phone;
- if the bot is already live, check which button people press most often right after /start;
- if you end up with three "main" jobs, pick one. The other two become the second and third buttons, not equal sections.

The first message after /start should be one or two sentences: what the bot can do and where to begin. The company mission statement does not belong here. Don't make people choose a language, accept terms, send their phone number and subscribe to your channel before they can do anything useful. You can guess the language from Telegram itself, since the bot receives the language code of the user's app. But an Uzbek-speaking customer may well have Telegram set to Russian or English, so offer a one-tap language switch. The phone number can wait until checkout.

A useful habit: bot links with a start parameter, where something like ?start=branch2 is added to the end of the link. A QR code on a table or in a shop window opens the bot in the right place, for example the menu of a specific branch or booking with a specific doctor. As a bonus, you can see where the customer came from.

## Buttons, menus and depth

- **Short labels in the customer's words.** "Order", "Book", "My orders", "Contact us". Not "Service catalogue" or "Booking module". Uzbek labels often run longer than Russian ones, so check in both languages that button text isn't cut off on a narrow phone screen.
- **As few levels as possible.** If the main action is more than two or three taps away, people get lost. Cut long lists (a hundred products, twenty doctors) down with a filter or search. A catalogue with hundreds of items works better as a Mini App than as pages of buttons.
- **"Back" and "Home" on every step.** The customer should be able to go back one step without losing what they already chose, or start over, at any moment.
- **Two kinds of buttons for two different jobs.** Buttons under the input field (the reply keyboard) suit a permanent main menu. Buttons attached to a message (inline buttons) suit choices inside a step: date, time, quantity.
- **Edit the message instead of sending a new one.** When a customer pages through a menu or changes a quantity, the bot can update the current message. Otherwise, within a minute the chat turns into a feed of identical menus and nobody can tell which buttons still work.
- **Old buttons must not break the bot.** A customer taps a button in a week-old message. The bot should answer sensibly ("This menu is out of date, here is the current one"), not stay silent or throw an error.
- **A command menu.** Set a short list of commands through BotFather (/start, /menu, /help, /language). They show up in the menu button next to the input field. Command descriptions can be set separately for Uzbek and Russian; that is done in the bot's code.

## When the customer types instead of tapping

Plenty of people ignore the buttons and write as if to a person: "salom", "how much is a cleaning", "what time do you close", "can I come tomorrow?". Some send a voice message or a screenshot of a product from Instagram. Answering any of these with "Unknown command" is the worst thing a bot can do: the customer feels they are talking to a wall.

What you can do even without AI:

1. Collect frequent phrases and questions from your managers' chats, in both languages, in Latin and Cyrillic script, typos included: "narxi", "нархи", "цена", "skoka".
2. Map them to answers or to the right section: "manzil" or "адрес" gets the address with a map pin; "operator" or "person" gets handed to a manager.
3. Reply to anything the bot didn't understand like a person would, and show the next step: "I didn't quite get that. Pick a section below or write to an operator", followed by the main menu buttons and an "Operator" button.
4. Don't ignore voice messages, photos and files the bot can't handle. Pass them to an operator.
5. Save every message the bot didn't understand and read them once a week. That is the best list of what to teach the bot next.

With AI, a bot understands free text much better and can answer questions from your knowledge base. It still needs rules: what it may promise and what it hands to a person. It also brings a monthly bill for requests that grows with the number of conversations. If most questions repeat, a phrase dictionary and good buttons are often enough.

## A person always one tap away

Few things annoy customers more than a bot with no way out to a human.

- The "Talk to an operator" button is visible in the main menu and appears in every reply where the bot couldn't cope. Don't bury it three levels deep under "Help".
- When it is pressed, say straight away when an operator will answer. At night, for example: "Operators answer from 9:00 to 21:00. Leave your question and we'll reply first thing in the morning." Then do what you promised.
- The operator sees the whole conversation: what the customer chose, what they wrote, what they ordered before. The customer shouldn't have to explain everything again. There are different ways to set this up: a separate topic per customer in the operators' Telegram group, or, if your managers work in amoCRM or Bitrix24, the conversation goes there.
- The customer can tell they are now talking to a person ("Dilnoza, the administrator, is answering you") and can tell when that conversation is over and the bot is answering again.
- If there are several operators, each conversation has an owner. Then two people don't answer the same customer at once, and no question is left hanging.

## Asking for data politely

- Ask only for what this task needs, and only when it needs it. For delivery: phone and address at checkout. For a booking: name and phone. Date of birth, email, passport details only if you genuinely can't do without them.
- Get the phone number through a "Send my number" button. Telegram shares it in one tap, with no typos. But keep the option to type a different number: the person may be ordering for their mother or may not want to share their main number.
- Say why you are asking: "We need your number so the courier can call when they arrive."
- You can prefill the name from the Telegram profile, but let people correct it; profiles contain all sorts of things.
- For the address, offer a "Send location" button and ask for a landmark separately. In Tashkent a landmark often matters more to a courier than the house number.
- Don't ask again for what you already know. On the second order, show the saved address and number with one button: "Yes, same address."
- Keep the law in mind: personal data of Uzbek citizens (name, phone, address) must be stored on servers in Uzbekistan, and that includes the bot's database. The less you collect, the less you have to store and protect. Check the law's other requirements for your situation with a lawyer.

## Broadcasts people don't block

A broadcast is the fastest way to lose a subscriber. Blocking a bot takes two taps, and getting the person back is close to impossible, because a bot cannot message someone who has blocked it. The opposite limit applies too: a bot can only message people who started it themselves, so you can't buy a list of phone numbers and send to it.

- **Less often than you'd like.** Start with infrequent broadcasts, and after each one check how many people blocked the bot. Telegram notifies the bot every time someone blocks it, so you can count them. If blocks after a broadcast are clearly higher than usual, the frequency or the content was wrong.
- **Relevant to the person.** The message should be useful to this particular customer: the next level for a student finishing the current course, a promotion at the branch near their home, a reminder about a check-up six months after a cleaning.
- **Segments by what the customer bought**, and by branch, district and language. Three targeted broadcasts beat one "everything for everyone". For that the bot needs purchase history, either in its own database or from 1C. The second case needs a separate integration.
- **An easy way to stop.** A "No promotions, please" button under each broadcast and in the settings. Opting out of promotions must not switch off order status updates and appointment reminders; service messages and advertising are kept apart.
- **Timing and sound.** Don't send promotions at eleven at night. Non-urgent messages can go out silently.
- **Queue large lists.** Telegram limits how fast a bot can send, so a broadcast to several thousand people takes a while to go out. That is normal, but plan for it if the offer is "until 18:00 only".

## Speed and errors

- Reply within seconds. When someone taps an inline button, the bot should acknowledge it immediately; otherwise a loading indicator spins on the button and the customer taps again.
- If an action takes time (checking a Click or Payme payment, a request to 1C, an AI answer), show the "typing…" status or a message such as "Checking availability…", then replace it with the result.
- Guard against double taps: pressing "Confirm" twice must not create two orders.
- An error message says what happened, whether what the customer entered was kept, and what to do next.
- If an external system is down, don't end the conversation. Accept the request and say a manager will confirm it.
- Set up monitoring: if the bot goes down or keeps failing, the team should hear about it straight away, for example from an automatic message in a work group on Telegram. It is better if a separate service checks the bot from outside, since a bot that has crashed can't report on itself. Hearing about a problem from customers on a Friday evening is the worst way to find out.

The same situations, handled badly and better:

| Situation | Bad | Better |
|---|---|---|
| Bot didn't understand the text | "Unknown command" | "I didn't quite get that. Pick a section or write to an operator", plus buttons |
| Slot taken | "Error 409" | "15:00 is already booked. 15:30 and 16:00 are free", plus buttons for those times |
| Payment not confirmed yet | Silence | "Waiting for confirmation from the payment system. If the money has been taken, your order is saved and we'll send the confirmation here" |
| Outside working hours | "Operator unavailable" | "Operators work from 9:00 to 21:00. Leave your question and we'll answer in the morning" |

## Test with real customers

- Invite five or six people who resemble your customers (not staff, not developers) and give them a task: "Book a teeth cleaning for Saturday." Then watch in silence and don't help. Note where they hesitate, what they try to type instead of tapping, and where they tap the wrong thing.
- Test on an ordinary inexpensive Android phone, on mobile internet, in both languages.
- Build a step-by-step funnel from the logs, from /start to the completed main job: how many people reach each step. The step where most people drop off is the first thing to fix.
- Once a week, go through the messages the bot didn't understand, the requests for an operator (if people ask a person for something, the bot can't do it yet) and the blocks after broadcasts. A small improvement every week is what kaizen means in practice.

## If you already have a bot: where to start and how long it takes

The order that usually pays off fastest:

1. An operator button and a decent reply to text the bot didn't understand. Cheapest, and customers notice straight away.
2. The first message and the main button.
3. A shorter menu, with "Back" and "Home" on every step.
4. Logs and a funnel, if you don't have them yet.
5. Segmented broadcasts and an easy opt-out.

What drives time and cost:

- **Where the texts live.** If button labels and messages are stored separately from the code, reworking the menu takes a few days. If they are hard-coded, every change is a programmer's job.
- **How operator handover is built.** A Telegram group with topics is the simpler option, typically a few days to a couple of weeks. Integration with amoCRM or Bitrix24, several operators and routing by working hours take several weeks.
- **Whether data for segments exists.** If purchase history is in the bot's database, segments are quick to set up. If it lives only in 1C, you need an integration.
- **A phrase dictionary or AI.** A dictionary is inexpensive. AI means development, testing on real questions in both languages, and a monthly fee for requests.
- **Who holds the code and the bot.** If another contractor built the bot and you don't have the code, rewriting is sometimes easier than fixing. Also check that the bot belongs to a company Telegram account, not the developer's personal one: only the owner can manage a bot through BotFather.

Reviewing an existing bot (walking through every scenario, reading the logs, running a few tests with customers) usually takes from a few days to two weeks, depending on how many scenarios there are and whether logs are kept at all.

If you'd like us to look at your bot, send its name to inbox@qilich.com and say what customers most often come to it for.
