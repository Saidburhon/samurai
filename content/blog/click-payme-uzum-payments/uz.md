---
slug: click-payme-uzum-payments
lang: uz
title: "Click, Payme va Uzum toʻlovlarini ulash: biznes egasi uchun qoʻllanma"
description: "Sayt, ilova yoki Telegram-botga onlayn toʻlovni ulash: shartnoma, texnik qism, fiskal chek, pulni qaytarish va eng koʻp uchraydigan xatolar."
date: 2026-10-21
tags: [onlayn toʻlov, Click, Payme, Uzum, fiskal chek, integratsiya]
related: [biz-payments, web-ecommerce, tg-order-bot, biz-1c-integration]
reading_minutes: 9
---

Ehtimol, hozir sizda toʻlov shunday oʻtadi: menejer mijozga Telegramda karta raqamini yozadi, mijoz pul oʻtkazib, skrinshot yuboradi, menejer esa bank ilovasini ochib, oʻsha oʻtkazmani qidiradi. Kuniga oʻnta buyurtma boʻlsa, bunga chidasa boʻladi. Buyurtmalar koʻpaygach esa hech kim topa olmaydigan oʻtkazmalar, «axir toʻlaganman-ku» degan tortishuvlar, berilmagan cheklar va buxgalterning «tushum nega shaxsiy kartaga kelyapti?» degan savoli boshlanadi. Click, Payme yoki Uzum orqali onlayn toʻlov bu muammolarni hal qiladi, lekin aslida bu ikkita loyiha. Biri biznes tomoni: toʻlov tizimlari bilan shartnoma, fiskal chek, pulni qaytarish qoidalari. Ikkinchisi texnik tomoni: toʻlov haqidagi xabarlar, buyurtma holatlari, kundalik solishtirish. Quyida ikkalasini ham qilinish tartibida koʻrib chiqamiz.

## Biznes oʻsgani sari kartaga oʻtkazma nega ish bermay qoladi

Kartaga oʻtkazma boshida qulay: hech narsani imzolash yoki dasturlash shart emas. Ammo uning chegarasi bor va unga siz kutgandan tezroq yetib kelasiz.

- **Qoʻlda tekshirish.** Har bir skrinshotni kimdir ochadi, summa va vaqtni bank koʻchirmasi bilan solishtiradi, keyin kerakli buyurtmani qidiradi. Bitta toʻlovga bir necha daqiqa ketadi, buyurtmalar koʻpaysa esa kuniga soatlab ish vaqti shunga sarflanadi.
- **Xatolar.** Ikki mijoz bir soat ichida bir xil summa oʻtkazadi. Skrinshot eski yoki tahrirlangan boʻlib chiqadi. Mijoz yuz ming soʻm kam oʻtkazadi, buni esa hech kim sezmaydi.
- **Chek yoʻq.** Mijoz fiskal chek olmaydi, biznesda esa savdoning toʻgʻri hisobi boʻlmaydi.
- **Soliq va ishonch.** Kompaniya puli egasining yoki xodimning shaxsiy kartasiga tushadi. Bu soliq organlarida savol tugʻdirishi mumkin, buxgalterga esa qoʻl mehnatini koʻpaytiradi. Yangi mijoz notanish odamga pul oʻtkazishdan oldin ikkilanadi. Kartasi «kassa» boʻlib turgan xodim ishdan ketsa, kassa ham u bilan ketadi.
- **Avtomatlashtirish shu yerda toʻxtaydi.** Buyurtma oʻz-oʻzidan «toʻlangan» holatiga oʻta olmaydi, ombor buyurtmani yigʻish vaqti kelganini bilmaydi, kuryer esa mijozdan pul olish kerakmi-yoʻqmi, koʻrmaydi.

Oraliq qadam ham bor. Toʻlov tizimlarida odatda dasturlashsiz toʻlov qabul qilish usullari boʻladi: merchant kabinetidan olingan havola yoki QR-kod. Pul endi kartaga emas, kompaniya hisob raqamiga tushadi, lekin toʻlovni buyurtma bilan baribir qoʻlda solishtirasiz. Buyurtmalar kam boʻlsa, bu oqilona boshlanish. Integratsiya esa buyurtmalar koʻpayganda yoki toʻlov oʻtishi bilan keyingi qadamlar oʻzi boshlanishi kerak boʻlganda zarur boʻladi.

## Kod yozishdan oldin nimalar kerak

Tayyorgarlikning katta qismi dasturchiga emas, biznes egasi va buxgalterga tushadi.

1. **Roʻyxatdan oʻtgan biznes.** YaTT yoki yuridik shaxs: toʻlov tizimlari odatda jismoniy shaxs bilan emas, biznes bilan shartnoma tuzadi.
2. **Bank hisob raqami.** Pul shunga tushadi.
3. **Har bir toʻlov tizimi bilan alohida shartnoma.** Click, Payme va Uzum har xil kompaniyalar, har birining oʻz hujjatlar roʻyxati, oʻz komissiyasi va oʻz muddatlari bor. Odatda roʻyxatdan oʻtganlik hujjatlari, bank rekvizitlari, nima sotishingiz haqida qisqacha maʼlumot va toʻlov qabul qilinadigan sayt, bot yoki ilova manzili soʻraladi. Koʻpincha saytda ommaviy oferta, kontaktlar, narxlar va pulni qaytarish shartlari bor-yoʻqligi tekshiriladi. Aniq roʻyxatni provayder menejeridan soʻrang: talablar oʻzgarib turadi.
4. **Kirish maʼlumotlari.** Shartnoma imzolangach, sizga merchant kabineti va texnik maʼlumotlar beriladi: kassa yoki servis identifikatori, maxfiy kalit, test muhitiga kirish. Ularni dasturchiga umumiy chat orqali emas, himoyalangan kanal orqali bering.
5. **Chek uchun mahsulot kodlari.** Ular haqida quyida batafsil gaplashamiz, lekin bu ishni hozirdanoq boshlagan maʼqul.
6. **Masʼul odam.** Kompaniyada pulni kim qaytarishi, solishtirishni kim kuzatishi va mijoz «toʻladim, buyurtma yoʻq» desa, operator kimga murojaat qilishini oldindan hal qiling.

Toʻlov tizimi bilan shartnomani kompaniyangiz imzolaydi. Dasturchi toʻlovni «vaqtincha» oʻz firmasiga ulab berishni taklif qilsa, rozi boʻlmang: mijozlaringizning puli unga tushadi.

Shartnomaga odatda bir haftadan bir necha haftagacha vaqt ketadi. Bu provayderga, hamma hujjatlar qoʻlingizda bor-yoʻqligiga va saytda oferta tayyorligiga bogʻliq. Arizalarni ishlab chiqish boshlangan haftadayoq topshiring. Aks holda tanish holat yuzaga keladi: hammasi tayyor, faqat kalitlarni kutyapmiz.

## Toʻlov aslida qanday oʻtadi

Uchala tizimda ham sxema oʻxshash:

1. **Mijoz buyurtma beradi.** Tizimingiz uni «toʻlov kutilmoqda» holatida saqlaydi va summani qayd etadi.
2. **Mijoz «Toʻlash» tugmasini bosadi** va toʻlov tizimining sahifasiga yoki ilovasiga oʻtadi. Karta maʼlumotlarini u yerda kiritadi, sizda emas: saytingiz karta raqamlarini koʻrmaydi ham, saqlamaydi ham.
3. **Toʻlov tizimi serveringizdan soʻraydi:** bunday buyurtma bormi, summa toʻgʻrimi, uni hali toʻlash mumkinmi?
4. **Serveringiz javob beradi:** «ha» yoki sababini koʻrsatib «yoʻq».
5. **Mijoz toʻlovni tasdiqlaydi**, pul yechiladi.
6. **Toʻlov tizimi serveringizga xabar beradi:** toʻlov oʻtdi. Server buyurtmani «toʻlangan» holatiga oʻtkazadi, chek uchun maʼlumotlarni yuboradi, mijoz va xodimlarga xabar beradi.
7. **Mijoz saytga yoki botga qaytadi** va buyurtma holatini koʻradi.

Bu sxemaning eng muhim joyi — 6-qadam. Toʻlov boʻlgan-boʻlmaganini mijozning «Rahmat» sahifasiga qaytgani emas, toʻlov tizimi serveringizga yuborgan xabar hal qiladi. Mijoz toʻlagan zahoti brauzerni yopib qoʻyishi yoki interneti uzilib qolishi mumkin. Tizim buyurtmani mijoz qaytganiga qarab toʻlangan deb belgilasa, ikki xil xato qiladi: toʻlangan buyurtmani oʻtkazib yuboradi, toʻlanmaganini esa toʻlangan deb hisoblaydi.

Tafsilotlar har bir tizimda oʻzgacha. Clickda bu prepare va complete bosqichlari, Paymeda tranzaksiyani tekshirish, ochish, oʻtkazish va bekor qilish metodlari, Uzumda esa oʻz protokoli. Mantiq bitta, lekin formatlar, soʻrovlar haqiqiyligini tekshirish usuli va xato kodlari har xil. Shuning uchun har bir provayder oʻz testlariga ega alohida integratsiya hisoblanadi.

Telegram-botda odatda ikki yoʻl bor: toʻlov sahifasini ochadigan tugma yoki Telegramning oʻzida toʻlash. Ikkinchisi uchun provayder BotFather orqali ulanadi, agar u buni qoʻllasa. Mini App sayt kabi ulanadi. Mobil ilovada mijoz provayder ilovasiga yoki sahifasiga oʻtib, yana qaytib keladi; bu yoʻlni iOSda ham, Androidda ham sinab koʻrish kerak. Ilovada raqamli kontent sotsangiz, masalan, onlayn darslarga kirish huquqini, App Store va Google Play qoidalarini oldindan tekshiring: raqamli mahsulotlar uchun ular doʻkonning oʻz toʻlov tizimini talab qilishi mumkin.

## Fiskal chek va MXIK kodlari

Onlayn savdoda odatda mijozga fiskal chek berish kerak. U elektron boʻladi: mijoz havola yoki QR-kod oladi.

Chek uchun har bir pozitsiyada quyidagilar boʻlishi kerak:

- tovar va xizmatlar milliy katalogidagi **MXIK (IKPU) kodi** (tasnif.soliq.uz);
- shu kod uchun **qadoq kodi** (oʻlchov birligi);
- **QQS stavkasi**.

Yetkazib berish, qadoqlash va xizmat haqini alohida olsangiz, ular ham oʻz kodiga ega alohida pozitsiya boʻladi.

Tizimingiz buyurtma tarkibini kodlari bilan uzatsa, chekni toʻlov tizimining oʻzi chiqarishi mumkin. Ikkinchi yoʻl: chekni oʻz onlayn kassangiz orqali chiqarish. Qaysi biri qulayligini provayder va buxgalteringiz bilan birga hal qiling.

Endi amaliy tomoni. Kodlar sayt mahsulotlarni oladigan bazada saqlanishi kerak, aks holda dasturchi ularni uzatish uchun hech qayerdan ololmaydi. Oʻttizta pozitsiyali katalog uchun bu bir kechalik ish. Bir necha ming pozitsiya boʻlsa, bu buxgalter uchun haftalab ish, shuning uchun uni ishlab chiqish bilan parallel boshlash kerak.

Yana bir koʻp uchraydigan muammo — chegirmalar. Chekdagi pozitsiyalar summasi toʻlov summasi bilan tiyinigacha mos kelishi kerak. Agar chegirma pozitsiyalar orasida qanday taqsimlanishi oldindan hal qilinmasa, promokod, butun buyurtmaga chegirma yoki maʼlum summadan oshgan buyurtmaga bepul yetkazib berish bu tenglikni buzadi.

Fiskalizatsiya qoidalari oʻzgarib turadi. Ishga tushirishdan oldin amaldagi talablarni provayder va buxgalteringizdan aniqlab oling.

## Bitta provayder yoki bir nechta

Mijozlarning sevimli ilovalari bor. Kimdir yillardan beri Click orqali toʻlaydi, kimdir Uzum Bank kartasidan foydalanadi, yana kimdir Paymega oʻrganib qolgan. Humo va Uzcard kartalarini uchala tizim ham oʻz sahifasida qabul qiladi, shuning uchun kartalarni alohida ulash odatda shart emas. Chet ellik mijozlaringiz boʻlsa, Visa va Mastercard haqida alohida soʻrang: ular uchun koʻpincha boshqa yechim kerak boʻladi.

Bitta provayderdan boshlash oʻrinli, agar:

- buyurtmalar hozircha kam va mijozlar umuman onlayn toʻlaydimi-yoʻqmi, shuni tekshiryapsiz;
- byudjet cheklangan;
- hozirgi oʻtkazmalardan mijozlarning koʻpchiligi bitta ilovadan foydalanishi koʻrinib turibdi.

Ikki yoki uch provayder kerak boʻladi, agar mijozlar muntazam ravishda maʼlum bir ilovani soʻrasa, auditoriyangiz keng boʻlsa yoki mijozlarning sezilarli qismi buyurtmani toʻlov bosqichida tashlab ketsa.

Bitta provayder bilan ishga tushsangiz ham, dasturchidan umumiy toʻlov modulini soʻrang: buyurtmaning yagona holatlari, toʻlovlarning yagona jurnali va har bir provayder uchun alohida «adapter». Shunda ikkinchi provayderni ulash qayta qurish emas, yangi adapter va testlar boʻladi. Yana shuni hisobga oling: har bir provayder bu alohida shartnoma, komissiya, kabinet va solishtirishdagi yana bir qator, yaʼni buxgalterning ishi ham koʻpayadi. Muddatli toʻlov, masalan, Uzum Nasiya, oʻz qoidalariga ega alohida integratsiya.

Muddat va narxga nimalar taʼsir qiladi:

- **Buyurtmalar hisobi bormi.** Buyurtmalar allaqachon tizimda holatlari bilan yuritilsa, toʻlovni ulaydigan joy bor. Hozir buyurtma Telegramdagi xabardan iborat boʻlsa, avval buyurtmalar hisobini yoʻlga qoʻyish kerak.
- **Provayderlar soni.**
- **Fiskal chek** va katalogning holati.
- **Pulni qaytarish, qisman toʻlov, oldindan toʻlov.**
- **1C bilan maʼlumot almashish.**
- **Platforma:** sayt, bot, ilova yoki hammasi birdan.

Moʻljal: ishlab turgan buyurtmalar tizimiga birinchi provayder testlari bilan birga bir haftadan uch haftagacha ulanadi. Keyingilari odatda tezroq: bir necha kundan ikki haftagacha. 1C bilan almashinuv alohida baholanadi va konfiguratsiyaga bogʻliq. Shartnomalar bilan ish bunga parallel olib boriladi.

## Pulni qaytarish, bekor qilish va qisman toʻlov

«Toʻladi, demak buyurtma toʻlangan» tamoyilidagi oddiy integratsiya birinchi nostandart holatdayoq ishlamay qoladi. Eng koʻp uchraydiganlari:

| Holat | Tizim nima qilishi kerak | Kim hal qiladi |
|---|---|---|
| Mijoz toʻlagandan keyin buyurtmani bekor qildi | Provayder orqali toʻliq qaytarish, «bekor qilingan» holati, qaytarish cheki | Menejer |
| Toʻlovdan keyin mahsulotning bir qismi yoʻqligi maʼlum boʻldi | Qisman qaytarish yoki mijoz roziligi bilan almashtirish | Menejer mijoz bilan birga |
| Mijoz ikki marta toʻladi | Ikkinchi toʻlovni topib, qaytarish | Tizim topadi, menejer tasdiqlaydi |
| Buyurtma vaqti tugagani uchun bekor qilindi, toʻlov esa keyin keldi | Pul yoʻqolmasin: buyurtmani tiklash yoki pulni qaytarish | Menejer |
| Oldindan toʻlov onlayn, qolgani kuryerga | Bitta buyurtmaga ikki toʻlov, ikkalasi ham hisobotda koʻrinadi | Bir marta sozlanadi |

Ishlab chiqish boshlanishidan oldin aniqlab oling:

- **Provayder API orqali qisman qaytarishni qoʻllaydimi.** Hammasi ham qoʻllamaydi: baʼzilarida API orqali faqat toʻliq bekor qilish mumkin, qisman holatlar esa kabinet yoki qoʻllab-quvvatlash xizmati orqali hal qilinadi. «Beshta mahsulotdan bittasi yoʻq» holatini qanday hal qilishingiz shunga bogʻliq.
- **Qaytarish cheki.** Pulni qaytarishga ham fiskal chek chiqariladi.
- **Pul qachon qaytib tushadi.** Bu mijozning banki va provayderga bogʻliq. Muddatlarni bilib oling va qaytarish shartlariga yozib qoʻying, shunda operator «bugunoq tushadi» deb vaʼda bermaydi.

Eng muhimi: «Qaytarish» tugmasini kim bosadi. Bu har qanday operator emas, admin panelda shunga huquqi bor aniq bir rol boʻlishi kerak. Tizim kim, qachon va nima sababdan pul qaytarganini yozib boradi. Katta summalar uchun egasining tasdigʻini qoʻshish mumkin.

## Solishtirish va hisobotlar

Pul hisob raqamingizga odatda har bir buyurtma boʻyicha alohida emas, maʼlum davr uchun bitta umumiy summa boʻlib, komissiya ushlab qolingan holda tushadi. Shuning uchun bank koʻchirmasidan qaysi buyurtma toʻlanganini bilib boʻlmaydi.

Har kuni uchta roʻyxat mos kelishi kerak:

- tizimingiz toʻlangan deb hisoblaydigan buyurtmalar;
- toʻlov tizimi hisobotidagi tranzaksiyalar;
- hisob raqamga kelgan tushumlar.

Tizim ularni har kecha oʻzi solishtirib, farqlarni koʻrsatishi mumkin: buyurtmalarni provayder hisobotidagi tranzaksiyalar bilan tranzaksiya identifikatori boʻyicha, provayder hisobotini esa bank tushumlari bilan summalar boʻyicha. Odatiy farqlar: provayderda toʻlov bor, lekin buyurtma toʻlangan deb belgilanmagan (xabar yoʻqolgan); buyurtma belgilangan, lekin toʻlov yoʻq (xato yoki test buyurtmasi); pul kabinet orqali qaytarilgan, tizimda esa buyurtma hamon faol.

**1Cga uzatish.** Ishlab chiqishdan oldin buxgalter bilan kelishib oling: toʻlovlar 1Cga qanday koʻrinishda tushadi, har bir buyurtma boʻyichami yoki har bir provayder boʻyicha kunlik jami bilanmi, komissiya va qaytarishlar qanday aks ettiriladi. Qanchalik aniq kelishsangiz, keyin shunchalik kam narsani qayta qilishga toʻgʻri keladi.

**Egasi uchun Telegramda kunlik xulosa.** Kun oxirida qisqa xabar, masalan:

> 14-noyabr yakuni: onlayn 52 ta buyurtma toʻlandi, jami 18,4 mln soʻm. Click — 21, Payme — 24, Uzum — 7. Qaytarishlar: 2. Mos kelmadi: 1, tafsilotlar panelda.

Raqamlar shartli, gap formatda: egasi butun manzarani bir qarashda koʻradi va tekshiradigan narsa bor-yoʻqligini biladi.

## Ishga tushirishdan oldin sinov

Toʻlov tizimlari ishga tushirishdan oldin hammasini sinab koʻrish imkonini beradi: masalan, Paymeda test muhiti (sandbox) bor. Click va Uzumda sinov qanday oʻtishini oʻz menejeringizdan soʻrang. Test kartalari va maʼlumotlarini provayder beradi. Quyidagilarni tekshiring:

- har bir provayder orqali telefondan va kompyuterdan muvaffaqiyatli toʻlov;
- mavjud boʻlmagan, allaqachon toʻlangan yoki bekor qilingan buyurtmani toʻlashga urinish;
- mijoz tomonida summani oʻzgartirishga urinish;
- oʻsha toʻlov haqida takroriy xabar: buyurtma ikki marta qayta ishlanmasligi, ombordagi qoldiq ikki marta kamaymasligi, mijozga ikkita xabar bormasligi kerak;
- serveringiz sekin javob berib, toʻlov tizimi javobni kutib ololmagan holat;
- toʻlagan zahoti sahifani yopib qoʻygan mijoz;
- toʻlovdan keyin buyurtmani bekor qilish va bekor qilingandan keyin kelgan toʻlov;
- toʻliq va qisman qaytarish, qaytarish cheki;
- sekin mobil internet;
- toʻlov sahifasi va xabarnomalardagi oʻzbekcha va ruscha matnlar.

Toʻlov tizimidan kelgan har bir soʻrov jurnalda saqlanishi kerak. Mijoz «toʻladim» deb yozsa, operator savolni dasturchiga yubormasdan, tranzaksiyani bir daqiqada topadi.

Oxirgi qadam — ishchi rejimda oʻz kartangizdan kichik summa toʻlab, keyin uni qaytarib koʻrish. Shundan keyingina toʻlovni barcha mijozlar uchun yoqing.

## Integratsiya muddati va narxi

Har bir toʻlov tizimini ulash loyihaga qancha vaqt va pul qoʻshishi Qilich katalogi boʻyicha quyida keltirilgan. Soʻmdagi summa Markaziy bank kursi boʻyicha hisoblanadi.

{{integration:payme}}

{{integration:click}}

{{integration:uzum}}

## Ishga tushirishdan oldingi tekshiruv roʻyxati

Dasturchi bilan:

- buyurtma faqat toʻlov tizimidan kelgan xabar boʻyicha toʻlangan hisoblanadi;
- takroriy xabarlar qoldiqni ikki marta kamaytirmaydi va mijozga ikki marta xabar yubormaydi;
- summa serverda tekshiriladi, mijoz uni oʻzgartira olmaydi;
- kalitlar ilova kodida yoki yozishmalarda emas, serverda saqlanadi;
- toʻlov tizimlaridan kelgan barcha soʻrovlar jurnalga yoziladi;
- pulni qaytarish ishlaydi, unga huquq faqat belgilangan odamlarda bor;
- tungi solishtirish farqlar haqida xabar yuboradi;
- mijozlarning shaxsiy maʼlumotlari, «Shaxsga doir maʼlumotlar toʻgʻrisida»gi qonun talab qilganidek, Oʻzbekistondagi serverlarda saqlanadi.

Buxgalter bilan:

- har bir pozitsiyada, jumladan yetkazib berishda ham, MXIK kodi, qadoq kodi va QQS stavkasi bor;
- sinov cheki tekshirilgan: pozitsiyalar, summalar, chegirmalar;
- qaytarish cheki tekshirilgan;
- toʻlovlar, komissiya va qaytarishlar 1Cga qanday tushishi aniq.

Biznes tomonidan:

- shartnomalar imzolangan, ishchi kalitlar olingan;
- saytda oferta, qaytarish shartlari va kontaktlar bor;
- operatorlar «toʻladim, lekin buyurtma yoʻq» degan savolga nima deb javob berishni biladi;
- haqiqiy toʻlov va uni qaytarish sinab koʻrilgan.

Hozir toʻlovni qanday qabul qilayotganingizni va nima xalaqit berayotganini qilich.com saytidagi SamurAI yordamchisiga yozing, qayerdan boshlash kerakligini maslahat beramiz.
