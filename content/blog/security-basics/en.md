---
slug: security-basics
lang: en
title: "Security for your site, app and bot: the minimum for a small business"
description: "Many problems start not with a clever attack but a simple slip: a weak password, an open admin panel, an ex-employee's access. The basic measures."
date: 2026-10-21
tags: [security, data protection, telegram bot, small business, backend]
related: [backend, web, telegram, mobile]
reading_minutes: 9
---

When owners hear "we've been hacked", they picture someone spending weeks breaking into a server. In a small business it is usually simpler, and more embarrassing: the hosting password can be guessed in a minute, the website's admin panel is open to the whole internet and hasn't been updated for two years, the bot token sits in the team chat, and the manager who was let go in spring still logs into the CRM. None of this needs a gifted attacker. An automated scanner that checks every address on the internet, whatever the size of the business behind it, is enough, and so is a former employee with a grudge. Below is the minimum an owner can check without technical knowledge and demand from the developer. It is not a bank's security programme. It is what any site, bot or app that handles orders and money should have.

## Own your accounts

The worst case is not a break-in. It is the day you can't prove the site is yours. Say a freelancer built the website and bot for a training centre. He bought the domain in his own name, paid for hosting with his own card and registered the bot in BotFather from his personal Telegram. While the relationship is good, nobody notices. When he disappears, changes his number or sends an invoice "for handing over the project", it turns out the company owns nothing but its logo.

These should be registered to the company and accessible to the owner:

- **Domain.** The registrant is your company and the contact email is a company address, not the developer's personal inbox. Renewal runs on auto-pay or with a reminder a month ahead: once a domain lapses, anyone can register it.
- **Hosting and servers.** The provider account, the contract and the payments are the company's. The developer gets access as a user, not as the account owner.
- **App Store and Google Play developer accounts.** Register them as an organisation. Both stores ask for a D-U-N-S number for that, and getting one takes time, so start in the first weeks of the project. An app can be moved from someone else's account, but it is a separate procedure and it doesn't happen without the current owner.
- **The bot in BotFather.** A bot belongs to the Telegram account that registered it. Register it from a company number. If it already sits on someone else's account, ask them to transfer ownership to the company account through BotFather.
- **Click, Payme and Uzum cabinets and online banking.** The contract is with the company anyway, but the login is often tied to one employee's personal phone. Move it to a company number and find out in advance how access is recovered.
- **The mailbox everything is registered to.** A separate company mailbox that two trusted people can open. Passwords to everything else are reset through it, so it gets the best protection of all.
- **Code repository, CRM, analytics, ad accounts:** the same principle.

The check takes half an hour: try logging into each of these yourself. If you have to call the developer to do it, you have found the first item on your to-do list.

## Passwords and two-factor login

One password for everything, a password made of the company name and the year, a password five people know: that is how stories about lost access usually begin. Two measures close most of these gaps.

**A password manager.** Bitwarden, 1Password or KeePass, for example. Every service gets its own long random password and nobody has to remember them. Team versions have shared vaults with different rights: the accountant sees the banking cabinets, the developer sees the servers, and nobody sends passwords over Telegram. Expect a few dollars per person per month; some have free plans.

**Two-factor login (2FA).** Besides the password, a one-time code from your phone is required. Turn it on first where losing access would cost the most:

- the email the domain, hosting and app store accounts are registered to;
- the Telegram accounts of the owner and of staff who manage the bot and channels (the cloud password in privacy settings);
- hosting, the domain registrar, DNS;
- the CRM, such as Bitrix24 or amoCRM, and 1C if it can be reached remotely;
- payment cabinets and online banking;
- App Store, Google Play and the code repository.

Codes from an authenticator app are safer than SMS: an SMS code can be talked out of someone over the phone or intercepted when a SIM card is reissued. Keep the recovery codes in the password manager, not only on one person's phone.

A word on Telegram. A common way to take over an account is not hacking at all, but asking for the login code "to vote", "to confirm a delivery" or "from the security team". Tell your staff that nobody has any reason to ask for that code. Once a month, open the list of devices in Telegram settings and end any sessions you don't recognise.

## Access for staff and contractors

Four rules:

1. **Personal accounts, not a shared login.** If everyone logs into the admin panel as "admin", you can't tell who deleted an order, and cutting off one person means changing the password for everyone.
2. **The minimum rights each person needs.** An operator doesn't need to export the whole customer base, a courier doesn't need a year of order history, the social media manager doesn't need server access. The fewer rights someone has, the less damage a mistake or a stolen account can do.
3. **Access is removed the day someone leaves.** Not "when we remember". The same goes for contractors: once the project is handed over, their access to the server and repository is switched off, or kept only for those working under a support contract. Don't forget the Telegram groups where orders arrive, or the admins of your channel.
4. **One list of who has what.** A simple table, updated whenever someone joins or leaves and reviewed once a quarter.

It might look like this:

| Service | Registered to | Who else has access | What rights | 2FA |
|---|---|---|---|---|
| Domain and DNS | Company, company email | Developer | DNS records only | Yes |
| Hosting | Company | Developer, support contractor | Project servers | Yes |
| Bot in BotFather | Company's work Telegram | Nobody | — | Cloud password |
| Click or Payme cabinet | Company | Accountant | View payments | Yes |
| CRM | Company | Sales managers | Own deals, no database export | Yes |
| Code repository | Company | Developers | Write, no right to delete | Yes |

If the "Registered to" column shows a person's name rather than the company, go back to the first section.

## Secrets: bot tokens, API and payment keys

A bot token is full control of the bot. Anyone who has it can intercept incoming messages and write to your customers as your bot. A leaked payment key, depending on how the integration is built, can be used to fake a payment confirmation: the order is marked as paid and no money arrives. API keys for the CRM, 1C or an SMS gateway open the way to customer data or to your balance.

The rules:

- **Not in chats or email.** Secrets are passed through the password manager. If a token was ever posted in a work group, assume that everyone who has ever been in that group knows it.
- **Not in the code or the repository.** Secrets live on the server, in environment variables or a secrets store. Deleting a key from the code is not enough: it stays in the repository history, so any key that got there is replaced.
- **Not in the app or the web page.** Anything built into a mobile app or the site's JavaScript can be extracted. Secret keys stay on the server, and the app talks to your server.
- **Replaced when there is a reason.** When someone with access leaves; when a key ends up in a chat, a screenshot or the repository; when you suspect a leak. A bot token can be replaced in BotFather in a minute, after which the developer updates it on the server. Agree in advance that the whole procedure takes minutes, not days.

Ask the developer for a list of every secret, without the values: what it is, where it is used, where it is stored, who replaces it and how. More on the payment side: [connecting Click, Payme and Uzum](/blog/click-payme-uzum-payments/).

## Backups you have actually restored

"We have backups" means nothing until someone has tried restoring one. The minimum:

- **Automatic.** On a schedule, not "the developer does it when he remembers".
- **Away from the main server.** On another server, in another data centre or with another provider. A copy on the same server dies with it, and ransomware encrypts it along with the database. The main server should not be able to delete old copies. If the database holds personal data of Uzbek citizens, keep the copies in the country too; see [storing personal data in Uzbekistan](/blog/personal-data-in-uzbekistan/).
- **Complete.** The database, uploaded files (product photos, documents, contracts) and server settings. The code lives in the company's repository.
- **Tested.** Once a quarter the developer restores a copy on a test server and shows you that the site opens and the latest orders are there. Write down how long it took: that is your real recovery time.
- **With history.** Not just the latest copy but copies from several days, weeks and months back: damaged data is sometimes noticed late.

How often to back up depends on two questions: how many hours of orders can you afford to lose and re-enter by hand, and how many hours can you be down?

- **A brochure site that changes once a month:** a daily copy is enough.
- **An online shop or a bot that takes orders:** at least daily, better every few hours.
- **Records where every entry is money** (payments, memberships, debts, stock): continuous logging of database changes so you can restore to any minute, plus daily copies.

## Updates and the admin panel

Updates close known vulnerabilities, and known vulnerabilities are exactly what automated scanners look for. On WordPress and similar CMS sites, trouble more often comes through an outdated plugin or theme than through the core. So:

- the CMS, plugins, themes, libraries and the server's operating system are updated regularly, and big updates are tried on a copy of the site first;
- unused plugins and themes are deleted: each one is someone else's code with access to your site;
- old test versions and forgotten subdomains like test or old, holding real data with no password, are switched off;
- updates are written into the support contract instead of waiting for something to break. More in [support after launch](/blog/maintenance-after-launch/).

Protect the admin panel with:

- two-factor login and personal accounts;
- a limit on login attempts, so passwords can't be guessed endlessly;
- where possible, access only from the office, over a VPN or from allowed addresses;
- a non-standard address: not protection in itself, but it cuts out some of the automated noise.

HTTPS everywhere: the site, the admin panel, the app's API. Telegram only accepts bot webhooks over HTTPS anyway. Certificates can be free (Let's Encrypt, for example) and renew automatically; set up an alert in case renewal fails.

A bot has its own admin panel too, and it needs the same checks. Ask the developer:

- Do the bot's staff commands respond only to Telegram IDs on the staff list? A hidden command "nobody knows about" is not protection.
- Is the data a Telegram Mini App sends checked on the server against its signature?
- Is the bot's webhook protected with a secret token?
- Is a payment confirmed by a message from the payment provider to your server, not by a screenshot of a transfer? Screenshots are easy to fake.

## Logs and alerts

You can't respond to what you don't know about. Set up a separate Telegram group for alerts with the owner, the developer and the manager in charge. The minimum set:

- the site, bot or API is not responding (external monitoring checks every few minutes);
- a login to the admin panel, hosting or a payment cabinet from a new device; many services send these emails on their own, what matters is that someone reads them;
- a spike in payment errors, or no successful payments at hours when there usually are some;
- a mass export or deletion of records in the CRM or admin panel;
- the disk is filling up, or a certificate or the domain is about to expire;
- a backup didn't run. This is the quietest failure: without an alert, you find out on the day you need the copy.

Keep the admin panel's activity log (who logged in, what they changed, what they exported) for several months. Passwords, card numbers and unnecessary personal data should never end up in logs.

A common mistake is forty alerts a day, after which everyone mutes the group. Start with five to seven events that someone must act on, and name who that person is.

## If something happens

Write a one-page plan in advance and keep it where you can find it even if email is down: a printed copy in the office and another in the password manager.

1. **Who to call.** The developer or support contractor (with a number that answers at weekends), the hosting provider, the payment providers' support, the bank, a lawyer.
2. **How to lock accounts.** In order: email, the owner's Telegram, hosting, payment cabinets. Change passwords, end all sessions, reissue the bot token and payment keys, disable suspicious accounts. For each step, who does it.
3. **Don't wipe the evidence.** Save the logs and a copy of the server first, then restore. Otherwise you won't learn how they got in, and a week later it happens again.
4. **What to tell customers.** Short and honest, in Uzbek and Russian: what happened, what was affected, what they should do. If the bot or channel was taken over, use your other channels to warn people not to answer messages "from us" asking for a payment or a code. Write the template now, while things are calm.
5. **Personal data.** If customer data has leaked, the main obligations sit with your company as the owner of the database, not with the developer. Find out from a lawyer in advance whom you must notify and how quickly, not on the day of the incident.
6. **Review.** A few days later, hold a calm review without hunting for someone to blame: what happened, why it was possible, and what changes so it doesn't happen again.

## Check yourself

Answer yes or no to each point:

- The domain, hosting, BotFather, app stores and payment cabinets are registered to the company, and I can log into them myself.
- Two-factor login is on for email, Telegram, hosting, the CRM and payment cabinets, and the recovery codes are not with one person only.
- Passwords are in a password manager, not in chats or spreadsheets.
- There is an access list, and everyone who has left has been removed.
- No tokens or keys sit in chats, code or the app, and I know how long replacing them takes.
- Backups are automatic, stored away from the server and restored at least once in the last three months.
- The CMS, plugins and server were updated within the last month, the admin panel is behind two-factor login, and HTTPS is everywhere.
- Alerts about downtime, payment errors and suspicious logins reach a Telegram group that someone reads.
- There is a one-page incident plan.

**How long it takes.** For a small site or bot, a check against this list is usually one to two days of developer work. Fixing what it finds takes anywhere from a few days to two or three weeks. What stretches it: the number of systems and contractors; whether the developer who built everything is still reachable; how outdated the CMS is, since jumping several versions at once sometimes breaks plugins and turns into a small project of its own; moving domains and apps between accounts, which depends on third parties; and setting up backups from scratch, including a restore test. The monthly cost of a password manager, backup storage and monitoring is usually small. The main cost is developer time for updates and backup checks, and it belongs in the support contract.

Go through the checklist, then write to inbox@qilich.com with the points you couldn't tick, and we'll suggest where to start.
