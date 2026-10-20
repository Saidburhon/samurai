---
slug: telegram-bot-cost
lang: uz
title: "Telegram-bot narxi Toshkentda: summa nimalarga bogʻliq"
description: "Menyuli oddiy botdan toʻlov, CRM va AI bilan ishlaydigan botgacha: Telegram-bot narxini nima belgilaydi, qayerda tejash mumkin, qayerda yoʻq."
date: 2026-10-21
tags: [telegram-bot, narx, toʻlov, integratsiya, AI]
related: [telegram, business, ai]
reading_minutes: 9
---

Telegram-bot buyurtma qilmoqchi boʻlib, uchta kompaniyaga yozdingiz va bir-biridan bir necha barobar farq qiladigan uchta narx oldingiz. Biri shubhali darajada arzon, boshqasining nega bunchalik qimmatligi esa tushunarsiz. Solishtirib ham boʻlmaydi: bir taklifda ikki qator matn, ikkinchisida bir sahifa atama. Ehtimol, hech kim sizni aldamoqchi emas, shunchaki har kim oʻzi tasavvur qilgan botni baholagan. Quyida bot qanday qismlardan iboratligini, har bir qism ishlab chiqish narxiga va oylik xarajatga nima qoʻshishini hamda ikki taklifni qatorma-qator qanday solishtirishni koʻrib chiqamiz.

## Nega “bot” narxlari bunchalik farq qiladi

“Bot” soʻzi ish hajmi haqida hech narsa aytmaydi. Bu manzil, narxlar va telefon raqami yozilgan beshta tugmali menyu boʻlishi mumkin. Yoki toʻliq buyurtma tizimi: qoldiqlari koʻrinib turadigan katalog, savat, yetkazib berish hududlari, Payme orqali toʻlov, operatorlarga xabarnoma, menejer uchun panel va 1C bilan maʼlumot almashish. Bu ikki variant orasidagi farq foizlarda emas, barobarlarda oʻlchanadi. Shuning uchun “Telegram bot ochish narxi qancha?” degan savolga halol javob bitta: bot nima qilishi kerakligiga bogʻliq.

Masalan, kiyim doʻkoni “buyurtma qabul qiladigan bot” soʻraydi. Birinchi kompaniya buni shunday tushunadi: mijoz buyurtmani oddiy matn qilib yozadi, bot uni menejerlar guruhiga yuboradi. Ikkinchisi esa mijoz 1C bilan bogʻlangan katalogdan oʻlcham va rangni tanlab, darhol Click orqali toʻlaydi, deb hisoblaydi. Ikkala baho ham halol, faqat ular ikki xil mahsulotga berilgan.

Narxlar bunchalik farq qilishining yana ikki sababi bor:

- **Konstruktormi yoki individual ishlab chiqishmi.** Konstruktorda botni tez yasash mumkin, toʻlov esa oyma-oy, lekin nostandart ssenariy yoki integratsiya kerak boʻlishi bilanoq uning cheklovlariga duch kelasiz. Individual ishlab chiqish boshida qimmatroq, ammo kod va maʼlumotlar sizniki boʻladi (buni shartnomaga yozib qoʻying).
- **Narxga nima kiradi.** Biri test, server va bir oylik qoʻllab-quvvatlashni qoʻshib hisoblaydi, boshqasi faqat dasturlash narxini aytadi, qolgani esa keyin alohida hisob boʻlib chiqadi.

## Botning siz pul toʻlaydigan qismlari

- **Muloqot ssenariylari.** Mijoz bosib oʻtadigan har bir yoʻl: telefon raqami bilan roʻyxatdan oʻtish, katalog, savat, buyurtma berish, buyurtma holati, fikr qoldirish. Narxga ekranlar sonidan koʻra “agar … boʻlsa-chi?” degan holatlar koʻproq taʼsir qiladi: mijoz “Orqaga” tugmasini bossa, mahsulot tugab qolsa, manzil yetkazib berish hududidan tashqarida boʻlsa nima boʻladi.
- **Admin panel.** Xodimlar mahsulot va narxlarni oʻzgartiradigan, buyurtmalarni koʻrib, ularning holatini yangilaydigan joy. Bu veb-panel ham, toʻgʻridan-toʻgʻri Telegram ichidagi buyruqlar ham boʻlishi mumkin. Usiz har bir narxni dasturchi orqali oʻzgartirishga toʻgʻri keladi.
- **Maʼlumotlar bazasi.** Mijozlar, buyurtmalar, tarix. Oddiy maʼlumot beruvchi menyudan murakkabroq deyarli har qanday botga kerak.
- **Xodimlarga xabarnomalar.** Yangi buyurtma operatorlar guruhiga “Qabul qilish” va “Rad etish” tugmalari bilan tushadi, kuryer manzilni oladi, rahbar kun yakuni boʻyicha hisobot oladi.
- **Ommaviy xabarlar (rassilka).** Barcha foydalanuvchilarga aksiya yoki yangi menyu haqida xabar. Telegram xabar yuborish tezligini cheklaydi, shuning uchun katta roʻyxatga xabarlarni navbat bilan yuborish va botni bloklaganlarni hisobga olish kerak.
- **Hisobotlar.** Boshida koʻpincha buyurtmalarni Excelga yuklab olish yetadi. Grafik va dashbordlarni keyinroq qoʻshish mumkin.

## Toʻlov: Click, Payme, Uzum va fiskal chek

Toʻlov smetada alohida qatorga chiqariladi: bu tashqi tizim bilan integratsiya, undagi xato esa toʻgʻridan-toʻgʻri pulga taʼsir qiladi.

Unga nimalar kiradi:

- **Toʻlov tizimi bilan shartnoma.** Bu dasturchining emas, biznesning ishi: yuridik shaxs yoki YaTT Click, Payme yoki Uzum bilan shartnoma tuzadi va ulanish uchun kalitlarni oladi. Bu ishni loyihaning birinchi haftasidayoq boshlang, aks holda tayyor bot hujjatlarni kutib turib qoladi.
- **Toʻlov usuli.** Mijoz havola orqali toʻlov sahifasiga oʻtadi yoki ulangan provayder orqali toʻgʻridan-toʻgʻri Telegram ichida toʻlaydi; qaysi biri mumkinligi provayderga bogʻliq.
- **Toʻlov tizimi soʻrovlarini qayta ishlash.** Bot serveri Payme yoki Click soʻrovlarini qabul qilib, ularning protokoli boʻyicha javob berishi (har birida oʻz tartibi bor, masalan, Payme tizimida: tranzaksiyani tekshirish, ochish, tasdiqlash, bekor qilish) va har bir toʻlovni aniq bir buyurtmaga bogʻlashi kerak.
- **Nostandart holatlar.** Mijoz toʻladi, lekin tasdiq kelmadi. Bitta soʻrov ikki marta keldi. Mijoz toʻlagandan keyin buyurtmani bekor qildi. Summaning bir qismini qaytarish kerak. Test vaqtining asosiy qismi aynan shu holatlarga ketadi.
- **Fiskal chek.** Onlayn toʻlovda odatda fiskal chek kerak, buning uchun esa har bir mahsulotning MXIK (IKPU) kodi, qadoq kodi va QQS stavkasi boʻlishi lozim. Bot buyurtma tarkibini kodlari bilan uzatsa, chekni toʻlov tizimining oʻzi shakllantirishi mumkin. Agar katalogingizda kodlar boʻlmasa, ularni ishga tushirishdan oldin kiritib chiqish kerak. Bu dasturchining emas, buxgalterning ishi: qoidalar aynan sizga qanday tatbiq etilishini undan soʻrang.

Har bir qoʻshimcha provayder oʻz protokoli va oʻz testlari bilan yana bitta integratsiya degani. Agar mijozlaringizning koʻpchiligi kuryerga naqd yoki terminal orqali Humo/Uzcard kartasi bilan toʻlasa, onlayn toʻlovsiz ishga tushirib, uni ikkinchi bosqichda qoʻshish mumkin.

## Integratsiyalar: 1C, amoCRM, Bitrix24, Google Sheets

Integratsiya botni boshqa tizimlaringiz bilan bogʻlaydi: qoldiq va narxlar 1C tizimidan keladi, buyurtmalar unga qaytib tushadi, arizalar esa amoCRM yoki Bitrix24 tizimiga “botdan kelgan” belgisi bilan tushadi.

Integratsiya narxi toʻrt narsaga bogʻliq:

1. **Boshqa tizimda qulay API bormi.** amoCRM va Bitrix24 tizimlarida bor va hujjatlashtirilgan. 1C bilan hammasi konfiguratsiyaga bogʻliq: tipik konfiguratsiyani ulash osonroq, sizga moslab oʻzgartirilganini esa qiyinroq; koʻpincha maʼlumot almashinuvini ochish uchun sizning 1C dasturchingiz kerak boʻladi.
2. **Yoʻnalish.** 1C tizimidan faqat narxlarni oʻqish unga buyurtmalarni ham yozishdan osonroq.
3. **Qanchalik tez-tez.** Qoldiqlarni soatda bir marta yangilash bilan ularni har bir buyurtma paytida tekshirish ikki xil ish.
4. **Maʼlumotlar tozaligi.** Agar bitta mahsulot 1C tizimiga uch xil nom bilan uch marta kiritilgan boʻlsa, integratsiya texnik jihatdan ishlaydi, lekin mijoz katalogda chalkashlik koʻradi. Mahsulotlar roʻyxatini tartibga keltirish baʼzan integratsiyaning oʻzidan koʻproq vaqt oladi.

Google Sheets arzon boshlash yoʻli: menejer narxlarni jadvalda oʻzgartiradi, bot ularni oʻqiydi. Bir necha oʻnlab mahsulotli katalog uchun bu yetarli. Muammolar kimdir ustun nomini oʻzgartirganda, nuqta oʻrniga vergul qoʻyganda yoki jadvalni uch kishi bir vaqtda tahrirlaganda boshlanadi.

## Ikki til, AI javoblari va boshqa qoʻshimchalar

**Oʻzbek va rus tillari.** Toshkentdagi koʻpchilik bizneslarga ikkalasi ham kerak. Bu faqat tugmalarni tarjima qilish emas: xato matnlari, xabarnomalar, mahsulot tavsiflari, operator javoblari ham bor. Tavsiflarni odatda biznesning oʻzi yozadi, buni rejaga oldindan kiritib qoʻying. Alohida savol: lotin va kirill. Katta yoshdagi mijozlarning bir qismi kirillchada oʻqishga oʻrganib qolgan. Har bir yozuv varianti oʻzgarish kiritilgan sayin yangilab turiladigan yana bitta matnlar toʻplami degani. Katalog boʻyicha qidiruv ham ikkala yozuvni va imlo xatolarini tushunishi kerak: mijoz “somsa”, “samsa” yoki “сомса” deb yozishi mumkin.

Bitta tilda ishga tushirsangiz ham, matnlar koddan alohida saqlanishini soʻrang. Shunda ikkinchi til botni qayta qurmasdan, oddiy tarjima boʻlib qoʻshiladi.

**Erkin savollar uchun sunʼiy intellekt (AI).** Mijozlar “Yunusobodga yetkazib berasizlarmi?”, “Mashina qoʻyadigan joy bormi?”, “Qabulni ertaga koʻchirsa boʻladimi?” deb yozadi. AI modeli bunday savollarga sizning bilimlar bazangiz asosida javob berishi, javobini bilmagan savolni esa xodimga oʻtkazishi mumkin. Bu nimalarni qoʻshadi:

- ishlab chiqishga: bilimlar bazasi, javoblarni sozlash, mijozlaringizning haqiqiy savollarida tekshirish, suhbatni operatorga oʻtkazish;
- oylik xarajatga: har bir soʻrov uchun AI provayderiga toʻlov, u suhbatlar soni bilan birga oʻsadi;
- xavflarga: modellar oʻzbek tilida koʻpincha rus tiliga qaraganda yomonroq javob beradi, shuning uchun ikkala tilda ham sinab koʻrish kerak.

Savollarning koʻpchiligi takrorlanadigan boʻlsa, tugmalar va “Koʻp beriladigan savollar” boʻlimi arzonroq va ishonchliroq chiqadi. AI savollar haqiqatan xilma-xil boʻlgan joyda oʻzini oqlaydi.

**Boshqa qoʻshimchalar**, har biri smetada alohida qator: geolokatsiya boʻyicha yetkazib berish hududlari, klinikalar uchun qabulga va oʻquv markazlari uchun darsga yozilish, bonus va sodiqlik dasturi, tugmalar oʻrniga Mini App. Mini App — Telegram ichida ochiladigan, rasm, filtr va savatli veb-interfeys. Yuzlab mahsulotli katalog uchun u tugmalardan qulayroq, lekin ancha qimmatroq, chunki aslida bu kichik sayt.

## Ishga tushgandan keyingi xarajatlar

Telegram Bot API dan foydalanishning oʻzi bepul, lekin ishlab turgan botning oʻz xarajatlari bor. Bot bir oy ishlashi qanchaga tushishini oldindan soʻrang va buni ishlab chiqish narxiga qoʻshib hisoblang.

- **Server.** Oylik toʻlov. Oddiy botga kichik server yetadi; foydalanuvchilar, fayllar va AI soʻrovlari koʻpaygani sari yuklama ham oshadi.
- **Domen va sertifikat** admin panel uchun. Domen odatda yiliga bir marta toʻlanadi, sertifikatni esa bepul olish mumkin (Let's Encrypt).
- **AI.** Qancha ishlatsangiz, shuncha toʻlaysiz. Kutilmagan hisob kelmasligi uchun oylik limit qoʻying.
- **Toʻlov tizimi komissiyasi.** Uni dasturchi emas, Click, Payme yoki Uzum bilan tuzilgan shartnoma belgilaydi.
- **Monitoring va zaxira nusxalar.** Bot juma kuni kechqurun javob bermay qolsa, buni mijozlar yozishidan oldin kimdir bilishi kerak.
- **Mayda oʻzgarishlar.** Yangi tugma, yangi yetkazib berish hududi, mavsumiy menyu. Oldindan kelishib oling: soatbay toʻlovmi yoki oylik paketmi.
- **Yangilanishlar.** Telegram Bot API vaqti-vaqti bilan oʻzgarib turadi, kutubxonalar ham yangilanadi. Bu kichik, lekin muntazam ish.

Oʻzbekiston uchun muhim jihat: agar bot Oʻzbekiston fuqarolarining ismi, telefon raqami va manzilini saqlasa, shaxsga doir maʼlumotlar toʻgʻrisidagi qonun bu maʼlumotlarni mamlakat hududidagi serverlarda saqlashni talab qiladi. Mahalliy maʼlumotlar markazidagi hosting yirik xorijiy bulut xizmatlaridan qimmatroq yoki noqulayroq boʻlishi mumkin, lekin bu tanlov emas, talab. Qonunning boshqa talablarini oʻz holatingiz boʻyicha yurist bilan aniqlang.

## Qayerda tejash mumkin, qayerda yoʻq

Tejasa boʻladi:

- ortiqcha ekranlar va oyda bir marta ishlatiladigan funksiyalarda;
- Excelga yuklab olish yetib tursa, birinchi versiyadagi murakkab tahlilda;
- boshida ikkinchi toʻlov provayderida;
- savollar takrorlanib tursa, AI ulashda;
- katalogda bor-yoʻgʻi oʻttizta mahsulot boʻlsa, Mini App qilishda;
- mijozlaringiz deyarli ishlatmasa, oʻzbekcha kirill variantida (qaror qilishdan oldin tekshirib koʻring).

Tejab boʻlmaydi:

- **testda**, ayniqsa toʻlov va buyurtma berish jarayonini haqiqiy telefonlarda va sekin internetda sinashda;
- **admin panelda**, aks holda har bir narx oʻzgarishida dasturchiga qaram boʻlib qolasiz;
- **zaxira nusxalarda**: yoʻqolgan mijozlar bazasi butun botdan ham qimmatga tushishi mumkin;
- **toʻlovdagi nostandart holatlarda**: ikki marta yechib olingan pul yoki “toʻladim, buyurtma yoʻq” holati ishonchga har qanday dizayn kamchiligidan qattiqroq zarba beradi;
- **xatolar haqidagi xabarnomalarda**: bot toʻxtab qolsa, buni birinchi boʻlib jamoangiz bilishi kerak.

## Ikki taklifni qanday solishtirish kerak

Har bir kompaniyadan narxni qismlarga ajratib berishni soʻrang, keyin javoblarni bitta jadvalga yigʻing.

| Qism | Taklifda nimani tekshirish kerak |
|---|---|
| Ssenariylar | Mijozning barcha yoʻllari sanab oʻtilganmi, nostandart holatlarda nima boʻladi |
| Admin panel | Vebmi yoki Telegram ichidami, dasturchisiz nimalarni oʻzgartirsa boʻladi |
| Toʻlov | Qaysi provayderlar, fiskal chek, pulni qaytarish, kim test qiladi |
| Integratsiyalar | Qaysi tizimlar bilan, qaysi yoʻnalishda, qanchalik tez-tez |
| Tillar | Oʻzbekcha (lotin, kirill), ruscha; matnlarni kim yozadi |
| AI | Ishlab chiqishga nima kiradi, foydalanish oyiga taxminan qanchaga tushadi |
| Server | Kimning akkaunti, qayerda joylashgan, kim toʻlaydi |
| Qoʻllab-quvvatlash | Qancha muddat, nima xato va nima yangi vazifa hisoblanadi, qanchalik tez javob beriladi |
| Huquqlar | Kod, bot va token kimga tegishli |

Alohida aniqlab oling:

- **Bot va token egasi kim.** Bot BotFather orqali kompaniyangizning Telegram akkauntida roʻyxatdan oʻtkazilishi yoki topshirish paytida sizga oʻtkazilishi kerak. Bot dasturchida qolsa, hamkorlik tugaganda botni ham, uning foydalanuvchilarini ham yoʻqotishingiz mumkin.
- **Manba kodi** va repozitoriyga kirish huquqi beriladimi.
- **Bosqichlar boʻyicha muddatlar**: ssenariylarni ishlab chiqish, dasturlash, test, ishga tushirish. Har bir bosqichda sizdan nima kerakligini ham soʻrang: matnlar, rasmlar, toʻlov tizimi bilan shartnoma, 1C tizimiga kirish huquqi.

Muddatlar boʻyicha moʻljal, agar siz tomondan hamma narsa vaqtida tayyor boʻlsa: menyuli bot taxminan bir haftada, admin panelli buyurtma boti bir necha haftada, toʻlov va 1C integratsiyasi bor bot bir oydan uch oygacha tayyorlanadi. Muddatlarni koʻpincha dasturlash emas, toʻlov tizimi bilan shartnomani, 1C tizimiga kirish huquqini va matnlarni kutish surib yuboradi.

Ehtiyot boʻlish kerak boʻlgan belgilar: biznesingiz haqida birorta savol bermasdan narx aytildi; roʻyxatsiz “hammasi kiradi”; test bosqichi yoʻq; bot dasturchining akkauntida roʻyxatdan oʻtkaziladi.

## Qilichdan qanday baho olish mumkin

Biz Toshkentda ishlaymiz va Telegram-bot ishlab chiqish narxini qismlar roʻyxatini koʻrgandan keyin aniq aytamiz: shunda uni boshqa takliflar bilan qatorma-qator solishtirsa boʻladi. Bunday baho olish uchun quyidagi savollarga javob bering.

- Biznesingiz nima bilan shugʻullanadi va bot nima qilishi kerak, bir jumlada; botdan kim foydalanadi (mijozlar, operatorlar, kuryerlar, rahbar).
- Asosiy ssenariylar: masalan, katalog, savat, manzil, toʻlov, buyurtma holati.
- Qancha mahsulot yoki xizmat bor, narxlar qanchalik tez-tez oʻzgaradi va hozir qayerda saqlanadi: 1C tizimida, Excelda yoki menejerning yodida.
- Mijozlar qanday toʻlaydi: naqd, kuryerga karta bilan, Click, Payme yoki Uzum orqali; toʻlov tizimi bilan shartnoma bormi, fiskal chek kerakmi.
- Botni qaysi tizimlar bilan bogʻlash kerak: 1C (qaysi konfiguratsiya), amoCRM, Bitrix24, Google Sheets. Siz tomondan kirish huquqini kim beradi.
- Tillar: oʻzbekcha lotin, oʻzbekcha kirill, ruscha.
- Kuniga taxminan nechta buyurtma yoki murojaat va erkin savol keladi (hozir ularga kim javob beryapti).
- Botni har kuni kim boshqaradi va buni qayerdan qilish qulay: telefondanmi yoki kompyuterdanmi.
- Ishga tushirishning qatʼiy sanasi bormi, matn va rasmlarni kim tayyorlaydi, ishga tushgandan keyin qanday qoʻllab-quvvatlash kerak.

Javob sifatida qismlar va bosqichlar boʻyicha baho yuboramiz: nima kiradi, nima kirmaydi va har bir bosqich qancha vaqt oladi.

Qanday bot kerakligini qilich.com saytidagi SamurAI yordamchisiga yozing yoki shu savollarga javoblaringizni inbox@qilich.com manziliga yuboring.
