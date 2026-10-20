---
slug: click-payme-uzum-payments
lang: uz
title: "Click, Payme va Uzum toʻlovlarini ulash: biznes egasi uchun qoʻllanma"
description: "Sayt, ilova yoki Telegram-botga onlayn toʻlovni ulash: shartnoma, texnik qism, fiskal chek, pulni qaytarish va eng koʻp uchraydigan xatolar."
date: 2026-10-21
tags: [onlayn toʻlov, Click, Payme, Uzum, fiskal chek, integratsiya]
related: [backend, web, telegram, mobile]
reading_minutes: 9
---

Hozir toʻlov sizda, ehtimol, shunday ishlaydi: menejer mijozga Telegramda karta raqamini yozadi, mijoz pul oʻtkazib, skrinshot yuboradi, menejer bank ilovasini ochib, oʻsha oʻtkazmani qidiradi. Kuniga oʻnta buyurtma boʻlganda bunga chidasa boʻladi. Keyin esa hech kim topa olmaydigan oʻtkazmalar, «axir toʻlaganman-ku» degan tortishuvlar, berilmagan cheklar va buxgalterning «tushum nega shaxsiy kartaga kelyapti?» degan savoli boshlanadi. Click, Payme yoki Uzum orqali onlayn toʻlov bularni hal qiladi, lekin bu aslida ikkita loyiha. Biri biznes tomoni: toʻlov tizimlari bilan shartnoma, fiskal chek, pulni qaytarish qoidalari. Ikkinchisi texnik tomoni: toʻlov haqidagi xabarlar, buyurtma holatlari, har kungi solishtirish. Ikkalasini ham qaysi tartibda qilish kerak boʻlsa, oʻsha tartibda koʻrib chiqamiz.

## Biznes oʻsgani sari kartaga oʻtkazma nega ish bermay qoladi

Kartaga oʻtkazma boshida qulay: hech narsa imzolash ham, dasturlash ham shart emas. Ammo uning chegarasi bor va u siz oʻylagandan tezroq keladi.

- **Qoʻlda tekshirish.** Har bir skrinshotni kimdir ochadi, summa va vaqtni koʻchirma bilan solishtiradi, keyin kerakli buyurtmani qidiradi. Bitta toʻlovga bir necha daqiqa ketadi, kun oxirida esa bu soatlab ish vaqti.
- **Xatolar.** Ikki mijoz bir soat ichida bir xil summa oʻtkazdi. Skrinshot eski yoki tahrirlangan. Mijoz yuz ming soʻm kam oʻtkazdi va buni hech kim sezmadi.
- **Chek yoʻq.** Mijoz fiskal chek olmaydi, biznesda esa sotuvlarning toʻgʻri hisobi boʻlmaydi.
- **Soliq va ishonch.** Kompaniya puli egasining yoki xodimning shaxsiy kartasiga tushadi. Soliq uchun bu savol, buxgalter uchun qoʻl mehnati, yangi mijoz esa notanish odamga pul oʻtkazishdan oldin ikkilanadi. Kartasi «kassa» boʻlib turgan xodim ishdan ketsa, kassa ham u bilan ketadi.
- **Avtomatlashtirish shu yerda toʻxtaydi.** Buyurtma oʻz-oʻzidan «toʻlangan» boʻlolmaydi, ombor yigʻishni boshlash vaqti kelganini bilmaydi, kuryer yetkazib berishda pul olish kerakmi yoki yoʻqmi, koʻrmaydi.

Oraliq qadam ham bor. Toʻlov tizimlarida odatda dasturlashsiz toʻlov qabul qilish usullari boʻladi: merchant kabinetidan olingan havola yoki QR-kod. Pul endi kartaga emas, kompaniya hisob raqamiga tushadi, lekin toʻlovni buyurtma bilan baribir qoʻlda solishtirasiz. Hajm kichik boʻlsa, bu oqilona boshlanish. Integratsiya buyurtmalar koʻpayganda yoki toʻlovning oʻzi keyingi qadamlarni ishga tushirishi kerak boʻlganda kerak boʻladi.

## Kod yozishdan oldin nimalar kerak

Tayyorgarlikning katta qismi dasturchiga emas, biznes egasi va buxgalterga tushadi.

1. **Roʻyxatdan oʻtgan biznes.** YaTT yoki yuridik shaxs: toʻlov tizimlari jismoniy shaxs bilan emas, biznes bilan shartnoma tuzadi.
2. **Bankda hisob raqam**, pul shu yerga tushadi.
3. **Har bir toʻlov tizimi bilan alohida shartnoma.** Click, Payme va Uzum har xil kompaniyalar, har birining oʻz hujjatlar roʻyxati, oʻz komissiyasi va oʻz muddatlari bor. Odatda roʻyxatdan oʻtganlik hujjatlari, bank rekvizitlari, nima sotishingiz haqida qisqacha maʼlumot va toʻlov qabul qilinadigan sayt, bot yoki ilova manzili soʻraladi. Koʻpincha saytda ommaviy oferta, kontaktlar, narxlar va pulni qaytarish shartlari bor-yoʻqligi tekshiriladi. Aniq roʻyxatni provayder menejeridan soʻrang: talablar oʻzgarib turadi.
4. **Kirish maʼlumotlari.** Shartnomadan keyin merchant kabineti va texnik maʼlumotlar beriladi: kassa yoki servis identifikatori, maxfiy kalit, test muhitiga kirish. Ularni dasturchiga umumiy chat orqali emas, himoyalangan kanal orqali bering.
5. **Chek uchun mahsulot kodlari.** Ular haqida pastda gaplashamiz, lekin bu ishni hozirdan boshlagan maʼqul.
6. **Masʼul odam.** Kompaniyada pulni kim qaytarishi, solishtirishni kim kuzatishi va mijoz «toʻladim, buyurtma yoʻq» desa operator kimga murojaat qilishini oldindan hal qiling.

Toʻlov tizimi bilan shartnomani kompaniyangiz imzolaydi. Dasturchi toʻlovni «vaqtincha» oʻz firmasiga ulab berishni taklif qilsa, rozi boʻlmang: mijozlaringizning puli unga tushadi.

Shartnomaga bir haftadan bir necha haftagacha vaqt ketadi. Bu provayderga, hamma hujjatlar qoʻlingizda bor-yoʻqligiga va saytda oferta tayyorligiga bogʻliq. Arizalarni ishlab chiqish boshlangan haftadayoq topshiring. Aks holda tanish manzara: hammasi tayyor, kalitlarni kutyapmiz.

## Toʻlov aslida qanday oʻtadi

Uchala tizimda ham sxema oʻxshash:

1. **Mijoz buyurtma beradi.** Tizimingiz uni «toʻlov kutilmoqda» holati bilan yozib qoʻyadi va summani belgilaydi.
2. **Mijoz «Toʻlash» tugmasini bosadi** va toʻlov tizimining sahifasiga yoki ilovasiga oʻtadi. Karta maʼlumotlarini u yerda kiritadi, sizda emas: saytingiz karta raqamlarini koʻrmaydi ham, saqlamaydi ham.
3. **Toʻlov tizimi serveringizdan soʻraydi:** bunday buyurtma bormi, summa toʻgʻrimi, uni hali toʻlash mumkinmi?
4. **Serveringiz javob beradi:** «ha» yoki sababi bilan «yoʻq».
5. **Mijoz toʻlovni tasdiqlaydi**, pul yechiladi.
6. **Toʻlov tizimi serveringizga xabar beradi:** toʻlov oʻtdi. Server buyurtmani «toʻlangan» holatiga oʻtkazadi, chek uchun maʼlumotlarni yuboradi, mijoz va xodimlarga xabar beradi.
7. **Mijoz saytga yoki botga qaytadi** va buyurtma holatini koʻradi.

Bu sxemaning eng muhim joyi — 6-qadam. Toʻlov boʻlgan-boʻlmaganini mijozning «Rahmat» sahifasiga qaytgani emas, toʻlov tizimi serveringizga yuborgan xabar hal qiladi. Mijoz toʻlagan zahoti brauzerni yopib qoʻyishi, interneti uzilib qolishi mumkin. Tizim buyurtmani mijoz qaytganiga qarab toʻlangan deb belgilasa, ikki tomonga ham adashadi.

Tafsilotlar har bir tizimda oʻzgacha. Clickda bu prepare va complete bosqichlari, Paymeda tranzaksiyani tekshirish, ochish, oʻtkazish va bekor qilish metodlari, Uzumda oʻz protokoli bor. Mantiq bitta, lekin formatlar, soʻrov imzolari va xato kodlari har xil. Shuning uchun har bir provayder oʻz testlari bilan alohida integratsiya hisoblanadi.

Telegram-bot uchun odatda ikki yoʻl bor: toʻlov sahifasiga havolasi bor tugma yoki, provayder qoʻllasa, BotFather orqali ulangan provayder bilan toʻgʻridan-toʻgʻri Telegram ichida toʻlash. Mini App sayt kabi ulanadi. Mobil ilovada mijoz provayder ilovasiga yoki sahifasiga oʻtib, yana qaytib keladi va buni iOSda ham, Androidda ham sinab koʻrish kerak. Ilovada raqamli kontent sotsangiz, masalan onlayn darslarga kirish huquqini, App Store va Google Play qoidalarini oldindan tekshiring: raqamli mahsulotlar uchun ular doʻkonning oʻz toʻlov tizimini talab qilishi mumkin.

## Fiskal chek va MXIK kodlari

Onlayn sotuvda odatda mijozga fiskal chek berish kerak. U elektron boʻladi: mijoz havola yoki QR-kod oladi.

Chek uchun har bir pozitsiyada quyidagilar boʻlishi kerak:

- milliy mahsulot va xizmatlar katalogidagi **MXIK (IKPU) kodi** (tasnif.soliq.uz);
- shu kod uchun **qadoq kodi** (oʻlchov birligi);
- **QQS stavkasi**.

Yetkazib berish, qadoqlash va xizmat haqi, agar ularni alohida olsangiz, oʻz kodlariga ega alohida pozitsiyalar hisoblanadi.

Tizimingiz buyurtma tarkibini kodlari bilan uzatsa, chekni toʻlov tizimining oʻzi shakllantirishi mumkin. Boshqa yoʻli oʻz onlayn kassangiz orqali. Sizga qaysi biri qulayligini provayder va buxgalteringiz bilan hal qiling.

Amaliy tomoni. Kodlar sayt mahsulotlarni oladigan bazaning oʻzida turishi kerak, aks holda dasturchi ularni qayerdan olib uzatishni bilmaydi. Oʻttizta pozitsiyali katalog uchun bu bir kechalik ish. Bir necha ming pozitsiya boʻlsa, buxgalter uchun haftalab ish, uni ishlab chiqish bilan parallel boshlash kerak.

Yana bir koʻp uchraydigan muammo — chegirmalar. Chekdagi pozitsiyalar summasi toʻlov summasi bilan tiyinigacha mos kelishi kerak. Promokod, butun buyurtmaga chegirma yoki maʼlum summadan yuqori buyurtmaga bepul yetkazib berish, chegirma pozitsiyalarga qanday taqsimlanishi oldindan hal qilinmasa, bu tenglikni buzadi.

Fiskalizatsiya qoidalari oʻzgarib turadi. Ishga tushirishdan oldin amaldagi talablarni provayderdan va buxgalteringizdan aniqlab oling.

## Bitta provayder yoki bir nechta

Mijozlarning sevimli ilovalari bor. Kimdir yillardan beri Click orqali toʻlaydi, kimdir Uzum Bank kartasidan foydalanadi, yana kimdir Paymega oʻrganib qolgan. Humo va Uzcard kartalarini uchala tizim ham oʻz sahifasida qabul qiladi, shuning uchun kartalarni alohida ulash odatda shart emas. Chet ellik mijozlaringiz boʻlsa, Visa va Mastercard haqida alohida soʻrang: bu koʻpincha boshqa yechim talab qiladi.

Bitta provayderdan boshlash oʻrinli, agar:

- buyurtmalar hozircha kam va mijozlar umuman onlayn toʻlaydimi, shuni sinab koʻryapsiz;
- byudjet cheklangan;
- oʻtkazmalaringizdan koʻrinib turibdiki, mijozlarning koʻpchiligi allaqachon bitta ilovadan foydalanadi.

Ikki yoki uch provayder kerak boʻladi, agar mijozlar muntazam ravishda maʼlum bir ilovani soʻrasa, auditoriyangiz keng boʻlsa yoki mijozlarning sezilarli qismi buyurtmani toʻlov bosqichida tashlab ketsa.

Bitta provayder bilan ishga tushsangiz ham, dasturchidan umumiy toʻlov modulini soʻrang: buyurtmaning yagona holatlari, toʻlovlarning yagona jurnali va har bir provayder uchun alohida «adapter». Shunda ikkinchi provayder qayta qurish emas, yangi adapter va testlar boʻladi. Yana shuni hisobga oling: har bir provayder bu alohida shartnoma, komissiya, kabinet va solishtirishdagi yana bir qator, yaʼni buxgalterning ishi ham koʻpayadi. Muddatli toʻlov, masalan Uzum Nasiya, oʻz qoidalariga ega alohida integratsiya.

Muddat va narxga nimalar taʼsir qiladi:

- **Buyurtmalar hisobi bormi.** Buyurtmalar allaqachon holatlari bilan tizimda yursa, toʻlovni ulash uchun joy bor. Hozir buyurtma Telegramdagi xabardan iborat boʻlsa, avval hisobning oʻzini qilish kerak.
- **Provayderlar soni.**
- **Fiskal chek** va katalogning holati.
- **Pulni qaytarish, qisman toʻlov, oldindan toʻlov.**
- **1C bilan almashinuv.**
- **Platforma:** sayt, bot, ilova yoki hammasi birdan.

Moʻljal: ishlab turgan buyurtmalar tizimiga birinchi provayder test bilan birga bir haftadan uch haftagacha ulanadi. Keyingilari odatda tezroq, bir necha kundan ikki haftagacha. 1C bilan almashinuv alohida baholanadi va konfiguratsiyaga bogʻliq. Shartnomalar shu bilan parallel ketadi.

## Pulni qaytarish, bekor qilish va qisman toʻlov

«Toʻladi — buyurtma toʻlandi» degan oddiy integratsiya birinchi nostandart holatdayoq buziladi. Eng koʻp uchraydiganlari:

| Holat | Tizim nima qilishi kerak | Kim hal qiladi |
|---|---|---|
| Mijoz toʻlagandan keyin buyurtmani bekor qildi | Provayder orqali toʻliq qaytarish, «bekor qilingan» holati, qaytarish cheki | Menejer |
| Toʻlovdan keyin mahsulotning bir qismi yoʻqligi maʼlum boʻldi | Qisman qaytarish yoki mijoz roziligi bilan almashtirish | Menejer mijoz bilan birga |
| Mijoz ikki marta toʻladi | Ikkinchi toʻlovni topib, qaytarish | Tizim topadi, menejer tasdiqlaydi |
| Buyurtma vaqt tugagani uchun bekor boʻldi, toʻlov esa keyin keldi | Pulni yoʻqotmaslik: buyurtmani tiklash yoki pulni qaytarish | Menejer |
| Oldindan onlayn toʻlov, qolgani kuryerga | Bitta buyurtmaga ikki toʻlov, ikkalasi ham hisobotda koʻrinadi | Bir marta sozlanadi |

Ishlab chiqish boshlanishidan oldin aniqlab oling:

- **Provayder API orqali qisman qaytarishni qoʻllaydimi.** Hammasi ham emas: baʼzilarida API orqali faqat toʻliq bekor qilish mumkin, qisman holatlar esa kabinet yoki qoʻllab-quvvatlash xizmati orqali oʻtadi. «Beshta mahsulotdan bittasi yoʻq» holatini qanday hal qilishingiz shunga bogʻliq.
- **Qaytarish cheki.** Pulni qaytarish ham fiskallashtiriladi.
- **Pul qachon qaytib tushadi.** Bu mijozning banki va provayderga bogʻliq. Muddatlarni bilib oling va qaytarish shartlariga yozib qoʻying, shunda operator «bugunoq tushadi» deb vaʼda bermaydi.

Eng muhimi, «Qaytarish» tugmasini kim bosadi. Bu har bir operator emas, admin panelda huquqi bor aniq bir rol boʻlishi kerak. Tizim kim, qachon va nima sababdan pul qaytarganini yozib boradi. Katta summalar uchun egasining tasdigʻini qoʻshish mumkin.

## Solishtirish va hisobotlar

Pul hisob raqamga har bir buyurtma boʻyicha alohida emas, davr uchun umumiy summa boʻlib va komissiya ushlab qolingan holda tushadi. Shuning uchun bank koʻchirmasidan qaysi buyurtma toʻlanganini bilib boʻlmaydi.

Har kuni uchta roʻyxat mos kelishi kerak:

- tizimingiz toʻlangan deb hisoblaydigan buyurtmalar;
- toʻlov tizimi hisobotidagi tranzaksiyalar;
- hisob raqamga kelgan tushumlar.

Tizim ularni har kecha tranzaksiya identifikatori boʻyicha oʻzi solishtirib, farqlarni koʻrsatishi mumkin. Odatiy farqlar: provayderda toʻlov bor, lekin buyurtma belgilanmagan (xabar yoʻqolgan); buyurtma belgilangan, lekin toʻlov yoʻq (xato yoki test buyurtmasi); pul kabinet orqali qaytarilgan, tizimda esa buyurtma hamon faol.

**1C ga uzatish.** Ishlab chiqishdan oldin buxgalter bilan kelishib oling: toʻlovlar 1C ga qanday koʻrinishda tushadi, har bir buyurtma boʻyichami yoki har bir provayder boʻyicha kunlik jami bilanmi, komissiya va qaytarishlar qanday aks ettiriladi. Qanchalik aniq kelishsangiz, keyin shunchalik kam qayta ishlanadi.

**Egasi uchun Telegramda kunlik xulosa.** Kun oxirida qisqa xabar, masalan:

> 14-noyabr yakuni: onlayn 52 ta buyurtma toʻlandi, jami 18,4 mln soʻm. Click — 21, Payme — 24, Uzum — 7. Qaytarishlar: 2. Mos kelmadi: 1, tafsilotlar panelda.

Raqamlar shartli, gap formatda: egasi oʻn soniyada butun manzarani koʻradi va tekshiradigan narsa bor-yoʻqligini biladi.

## Ishga tushirishdan oldin sinov

Toʻlov tizimlari sinov uchun muhit beradi: Paymeda bu test muhiti (sandbox), Clickda soʻrovlar emulyatori, Uzumda sinov tartibini oʻz menejeringizdan soʻrang. Test kartalari va maʼlumotlarni provayder beradi. Quyidagilarni tekshiring:

- har bir provayder orqali telefondan va kompyuterdan muvaffaqiyatli toʻlov;
- mavjud boʻlmagan, allaqachon toʻlangan yoki bekor qilingan buyurtmani toʻlash;
- mijoz tomonida summani oʻzgartirishga urinish;
- oʻsha toʻlov haqida takroriy xabar: buyurtma ikki marta ishlanmasligi, qoldiq ikki marta yechilmasligi, mijozga ikkita xabar bormasligi kerak;
- serveringiz sekin javob berib, toʻlov tizimi javobni kutib ololmagan holat;
- toʻlagan zahoti sahifani yopib qoʻygan mijoz;
- toʻlovdan keyin buyurtmani bekor qilish va bekor qilingandan keyin kelgan toʻlov;
- toʻliq va qisman qaytarish, qaytarish cheki;
- sekin mobil internet;
- toʻlov sahifasi va xabarnomalardagi oʻzbekcha va ruscha matnlar.

Toʻlov tizimidan kelgan har bir soʻrov jurnalda saqlanishi kerak. Mijoz «toʻladim» deb yozsa, operator savolni dasturchiga yubormasdan, tranzaksiyani bir daqiqada topadi.

Oxirgi qadam — haqiqiy kartadan, ishchi rejimda kichik summa bilan haqiqiy toʻlov va uni qaytarish. Shundan keyin toʻlovni barcha mijozlarga ochavering.

## Ishga tushirishdan oldingi roʻyxat

Dasturchi bilan:

- buyurtma faqat toʻlov tizimidan kelgan xabar boʻyicha toʻlangan hisoblanadi;
- takroriy xabarlar ikki marta yechish va ikki marta xabar yuborishga olib kelmaydi;
- summa serverda tekshiriladi, mijoz uni oʻzgartira olmaydi;
- kalitlar ilova kodida yoki yozishmalarda emas, serverda saqlanadi;
- toʻlov tizimlaridan kelgan barcha soʻrovlar jurnalga yoziladi;
- pulni qaytarish ishlaydi, unga huquq faqat belgilangan odamlarda bor;
- tungi solishtirish farqlar haqida xabar yuboradi;
- mijozlar maʼlumotlari shaxsga doir maʼlumotlar toʻgʻrisidagi qonun talab qilganidek, Oʻzbekistondagi serverlarda saqlanadi.

Buxgalter bilan:

- har bir pozitsiyada, yetkazib berishda ham, MXIK kodi, qadoq kodi va QQS stavkasi bor;
- sinov cheki tekshirilgan: pozitsiyalar, summalar, chegirmalar;
- qaytarish cheki tekshirilgan;
- toʻlovlar, komissiya va qaytarishlar 1C ga qanday tushishi aniq.

Biznes tomonidan:

- shartnomalar imzolangan, ishchi kalitlar olingan;
- saytda oferta, qaytarish shartlari va kontaktlar bor;
- operatorlar «toʻladim, lekin buyurtma yoʻq» degan savolga nima deb javob berishni biladi;
- qaytarish bilan birga haqiqiy toʻlov oʻtkazib koʻrilgan.

Hozir toʻlovni qanday qabul qilayotganingizni va nimasi xalaqit berayotganini qilich.com saytidagi SamurAI yordamchisiga yozib bering, qayerdan boshlash kerakligini maslahat beramiz.
