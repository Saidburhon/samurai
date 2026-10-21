---
slug: maintenance-after-launch
lang: en
title: "After launch: what maintaining an app or website actually involves"
description: "The app is live, but the work isn't over. Updates, servers, security, store rules and small changes: what maintenance covers and how to budget for it."
date: 2026-10-21
tags: [maintenance, technical support, mobile apps, websites, process]
related: [sup-sla, cloud-devops, cloud-backup-dr, sup-app-store]
reading_minutes: 11
---

After launch an app or website needs regular care even when nothing new is added: updates for new iOS and Android versions and the stores' yearly requirements, server, domain and certificate renewals, security updates, backups and bug fixes. Budget for it as a monthly retainer with guaranteed response times or as pay per task; a small retainer for monitoring and critical failures plus change requests by the hour often works best. Agree in advance what counts as a bug and what is a new feature, and keep the code and accounts in your name so another team could take over.

The app is in the stores, the website loads, the bot is taking orders. The acceptance certificate is signed, and it feels as if the development costs are behind you. Then, six months later, the bot goes silent on a Saturday evening, Google Play emails you about new requirements, and the developer who built it all is busy on another project and replies two days later. That is what usually happens when nobody agreed on support in advance. Below we cover what maintaining a website, app or bot involves, how a bug differs from a new feature, which response times to put in the contract, how much to budget for the first year, and how to set things up so that another team could take over if it ever had to.

## Why software needs care when nothing changes

Code doesn't rust, but everything around it keeps moving:

- **Phones update.** Apple ships a new version of iOS every autumn, and Google releases a new version of Android every year. The rules for notifications, location and background work change, and things that worked on last year's version start behaving differently.
- **Libraries get security fixes.** An app or website is usually assembled from dozens of ready-made components for networking, payments, maps and the database. Their authors regularly release security fixes. If nobody installs them, the vulnerability stays in your product, however careful your own code is.
- **Outside services change.** Telegram releases new versions of the Bot API and Mini Apps. Click, Payme and Uzum update their protocols and requirements, for example what data has to be sent for the fiscal receipt. An update to your 1C configuration can break the exchange of stock levels. E-invoicing services such as Didox and Faktura.uz change their interfaces too.
- **Data grows.** A report that opened in a second with a thousand orders can take a minute with a hundred thousand. Usually that isn't a bug. It means the business grew.
- **Things expire.** Domains, SSL certificates, the yearly Apple Developer Program membership, access keys for outside services.

Almost none of this depends on you or your contractor. What does depend on you is whether you hear about a change in advance or from a customer who couldn't pay for an order.

## Store requirements you can't skip

For a mobile app, this is the most predictable part of maintenance: the rules are announced ahead of time, but there's no way around them.

**Google Play** raises the Android version that apps must target (the target API level) every year. At the time of writing, in October 2026, the rules are:

- since 31 August 2026, new apps and app updates are only accepted if they target Android 16 (API level 36) or higher;
- existing apps must target at least Android 15 (API level 35), or they stop being shown to new users on phones running a newer version of Android.

People who already installed the app keep it. But a new customer with a new phone simply won't find it in search. It's a quiet loss that can go unnoticed for months. In recent years the deadline has fallen at the end of August, so plan the update work for the summer.

**Apple** requires apps to be built with current tools. Since 28 April 2026, everything uploaded to App Store Connect must be built with Xcode 26 and the iOS 26 SDK. The version already in the store keeps working, but any update, even a one-line fix, first has to be moved to the new tools. If the project uses old libraries that don't build with the new Xcode, an urgent fix turns into several days of work.

Two more things people forget:

- **The Apple Developer Program membership** costs $99 a year. If it lapses, your app is removed from the App Store.
- **Privacy declarations.** Google Play has the Data safety section, the App Store has App Privacy details. They have to be updated whenever the app starts collecting new data, including through an analytics or advertising library you add. Both stores also require that users can delete their account if the app lets them create one. A mismatch between the declaration and what the app actually does is a common reason updates get rejected.

What to do: plan a separate piece of work once a year for each platform. Move the project to the new SDKs, update the libraries, and test on the new iOS and Android versions and on a couple of inexpensive Android phones. If the app is updated regularly, this usually takes a few days. If nobody has touched it for two years, it can stretch to weeks: the libraries have moved several versions ahead, and part of the code has to be rewritten.

## Servers, domains and certificates

The most frustrating outages aren't caused by clever bugs. They come from forgotten renewals and full disks.

A hypothetical example. A chain of three cafes has a delivery bot that runs on a webhook. On Friday evening the SSL certificate on the server expires, and Telegram stops delivering messages to the bot, because a webhook needs a valid HTTPS certificate. Customers write, the bot stays silent, and the operators assume it's just a quiet evening. They find out on Saturday when a regular customer phones. Automatic certificate renewal and one external check would have prevented it.

What every project should have in place:

- **Uptime monitoring.** An outside check every few minutes: does the website load, does the app's server respond, does the bot accept messages. It also helps to watch business signals: if no orders arrive in an hour that usually brings ten, someone should look.
- **Error tracking.** The server and the app send errors and crashes to a system the team watches. The team should know about a failure before a customer does.
- **Backups.** A daily database backup, stored separately from the main server. And a test: once a month or once a quarter, someone actually restores from it. A backup that has never been restored is a hope, not a backup.
- **Renewals.** SSL certificates must renew automatically: since March 2026, public certificates are issued for at most 200 days, and that limit will keep shrinking. The domain is set to auto-renew, with a contact email that someone reads. If push notifications to iPhones are sent with a certificate rather than a key, that certificate is valid for a year, and when it expires the notifications quietly stop.
- **Server updates.** The operating system, database and web server get security fixes. They are installed on a schedule, on a test server first.
- **Disk space and load.** Watch free disk space and server load too: a disk filled with logs stops a server as effectively as an attack.

Most of website maintenance is exactly this: work nobody notices while everything is fine.

If the system stores personal data of Uzbek citizens, the server holding it has to be in Uzbekistan. Local hosting providers offer fewer ready-made managed services, so there is often more administration work, and the support plan has to account for it. More in [Storing personal data in Uzbekistan](/en/blog/personal-data-in-uzbekistan/). For the minimum set of protections, see [Security for your site, app and bot](/en/blog/security-basics/).

Decide separately who gets the alert at night. An alert that lands in a shared chat nobody reads after 7 p.m. doesn't work. Agree who is on call on the contractor's side, where alerts go (usually a dedicated Telegram group, plus a phone call for critical cases), and who in your company needs to hear about a problem: the owner, the manager or the senior operator.

## Bug or new feature?

This is the most common argument in support. The client says: "It's a bug, why should I pay?" The contractor says: "That wasn't in the spec, it's a change request." To stop the argument repeating every month, agree on the criteria in advance and write them down.

**A bug** is when the system doesn't do what was agreed and accepted, or stops doing something it used to do. For example, the pay button doesn't respond on iPhones, the receipt total doesn't match the cart, or the filter by branch disappeared after an update.

**A change request** is anything that alters agreed behaviour or adds something new: another payment method, a new report, a different order of checkout steps, a third interface language.

**The grey zone**, best discussed before signing:

- **Changes in outside services.** Telegram, a payment provider or 1C changed something, and the integration broke. It isn't the contractor's fault, but you can't be left with payments that don't work either. Adapting to outside changes is usually included in the monthly support package, and bigger rework is estimated separately.
- **Growing load.** A slow report on a large dataset is a bug if speed requirements were written down, and a change request if they weren't.
- **Devices that weren't on the list.** For example, push notifications don't arrive on Huawei phones without Google services. If those models weren't on the agreed device list, supporting them is a separate task.
- **"It's awkward."** Customers can't find a button. That is a reason to improve something, not a development error.

How to write it up:

1. In the contract or an annex to it: definitions of a bug and a change request, in plain words, with a couple of examples.
2. A warranty period after acceptance, for example three or six months. During it, bugs are fixed free of charge and don't use up support hours.
3. Every request is first sorted into one of three types: bug, outside change or change request. A change request is estimated in hours before work starts, and you approve it in writing.

For how to set up the contract so that these rules work, see [Fixed price or hourly: how to set up a software development contract](/en/blog/fixed-price-or-hourly/).

## Response times

Not everything is equally urgent. Three levels plus a separate line for change requests is usually enough. The figures below are a starting point for negotiation. Yours depend on what an hour of downtime costs you and what you're willing to pay for on-call cover.

| Level | Examples | Response | Fix or workaround |
|---|---|---|---|
| Critical | payments failing, site or bot down, suspected data leak | 30–60 minutes with 24/7 on-call cover; within a few working hours on a business-hours plan | within a few hours |
| Important | one feature broken but there's a workaround: a report won't generate, operators don't get notifications | within the working day | 1–2 working days |
| Minor | a typo, a misaligned element on one screen | 1–2 working days | in the next planned update |
| Change request | a new report, a new field in a form | estimate within a few working days | on the agreed schedule |

Points to pin down:

- **A response isn't a fix.** A response means someone has picked up the problem, understood its scope and told you. The fix can take longer, especially if the cause is on the payment provider's side. A fix to a mobile app also has to pass store review, which takes anywhere from a few hours to a few days. That's why risky features are best built so they can be switched off from the server.
- **Working hours in Tashkent time.** For example, 9:00 to 18:00 on weekdays. If your delivery runs until 2 a.m. and support ends at 6 p.m., agree separately how critical issues are handled out of hours. On-call cover costs money, and that's fair.
- **Holidays.** Navruz, Ramadan Hayit (Eid al-Fitr), Kurban Hayit (Eid al-Adha), Independence Day, New Year. For delivery and retail these are often the busiest days. Agree in advance who is reachable, and don't ship big updates the day before.
- **One channel for requests.** A task tracker or a dedicated Telegram chat, with a phone call to the on-call number for critical issues. Requests sent as private messages to different developers get lost.

A good request says what happened, where (site, bot or app; phone model and OS version; interface language) and when, and gives the order number and a screenshot. "Nothing works" with no details costs an hour of back-and-forth.

## Budgeting for support

The cost of maintenance depends on how you pay and how much work there is. There are two main models.

**A monthly retainer.** A fixed monthly amount for a package of hours and guaranteed response times. The team keeps the project in its head, monitoring and updates happen on schedule, and a critical failure gets fixed without negotiating a quote first. The downside: you pay in quiet months too. Ask what happens to unused hours: do they carry over or expire?

**Pay per task.** You pay only for work done. This suits a simple website that hardly changes. The downsides: nobody watches the project between tasks, nobody guarantees response times, and every time a developer comes back to the project they start by remembering how it works, which is billable time too.

A combination often makes sense: a small retainer for monitoring, updates and critical failures, plus change requests paid by the hour as agreed.

A rough guide to the volume of basic upkeep, without regular improvement work:

- a simple website or landing page: a few hours a month for updates, backup checks and minor edits;
- a bot or website with payments, customer accounts and an admin panel: roughly 8 to 20 hours a month;
- an iOS and Android app with its own server and a 1C exchange: 20 to 40 hours a month or more, plus the yearly work for store requirements.

If you also want regular improvements, the volume moves closer to the figures in [Kaizen in software: why small improvements beat big releases](/en/blog/kaizen-in-software/).

The volume goes up when there are several platforms, many integrations (each one is a separate point that can break), no automated tests, code written by another team with no documentation, or a need for round-the-clock response.

Besides the team's hours, the first-year budget includes the server, database and backup storage, the domain, the Apple Developer Program ($99 a year) and Google Play ($25 once), SMS for login codes, 1C and CRM licences, AI services if the product uses them, and a reserve for outside changes nobody can predict.

Common mistakes:

- **Dropping support in the first months.** That is exactly when real users on less common phones find the bugs that never showed up in testing.
- **Comparing contractors only on the launch price.** Ask for the support price in writing together with the development price, and compare the total for the first year.
- **Saving updates for "later".** Two years without updates costs more than two years of small, regular ones, and you usually find out at the worst possible moment.

## Not being locked in

Even with a good contractor, things change: they grow and stop taking small projects, they raise prices, a key developer leaves. Your project should be set up so that another team could take it over in weeks, not months.

What to check:

1. **The code is in your repository.** The GitHub, GitLab or similar account belongs to your company, and the contractor works in it as a member. Not "we'll send you an archive if you ask".
2. **Accounts are in your company's name.** Apple Developer and Google Play Console should be organisation accounts. Both require a D-U-N-S number, which takes time to get, so start early. The domain, hosting, the Click, Payme and Uzum merchant accounts and the SMS service are registered to your legal entity, with access held by someone on your staff. The bot is registered in BotFather from a Telegram account your company controls, not from the developer's personal number.
3. **Passwords and keys** live in a password manager you have access to. When the team changes, they get changed.
4. **Documentation.** How to deploy the project from scratch, which servers and environments exist, which integrations there are and where their settings live, how backups work, what to do in common failures. Not a hundred-page novel, a working manual.
5. **Rights to the code.** The contract states that exclusive rights to the code pass to you once it's paid for, with a list of third-party components and their licences attached.
6. **An exit procedure.** What the contractor must do if the contract ends: hand over access and documentation, walk the new team through the project, and answer its questions for an agreed period.

A simple test: ask a developer who didn't build the project to deploy it from the documentation to a test server. If they manage without phoning the author, the documentation works.

## Using support time well

Support hours don't have to go only on firefighting. This is where the Japanese principle of kaizen helps: fixes are combined with small improvements. If a developer is already in the checkout code to fix a bug, it's a good moment to remove an unnecessary field or speed up a slow step. That's cheaper than coming back to the same code three months later as a separate task. A sensible month: some hours for planned updates and checks, some for fixes, and the rest for one or two improvements you chose with the team.

Once a month, the contractor sends a short report covering:

- failures during the month: what happened, how long it lasted, the cause, and what was done so it doesn't recur;
- updates installed: libraries, server, app versions in the stores;
- when restoring from a backup was last tested;
- hours spent per task and what's left in the package;
- upcoming deadlines: domain renewal, the next Google Play deadline, Apple requirements, licence expiry;
- recommendations for next month, and why.

A report like that shows in five minutes what you're paying for. For more on regular reporting, see [Hōrensō: how your software team should report to you](/en/blog/horenso-reporting/).

Describe what you have running today to SamurAI on qilich.com (website, bot, app, integrations with 1C and payment providers) and ask what its upkeep should include.
