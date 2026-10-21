---
slug: chatbot-ux
lang: uz
title: "Mijozning joniga tegmaydigan chatbot: Telegram-bot dizayni qoidalari"
description: "Cheksiz menyular, keraksiz xabarlar, operator bilan bogʻlanib boʻlmaydi. Mijozlarni botdan qochiradigan xatolar va qulay botning amaliy qoidalari."
date: 2026-10-21
tags: [telegram-bot, chatbot, UX, bot dizayni, rassilka]
related: [telegram, ai]
reading_minutes: 8
---

Mijozlar birinchi tugmadanoq bitta asosiy ishni bajaradigan, menyusi sayoz, «nomaʼlum buyruq» oʻrniga yozilgan matnni tushunadigan va doim bir bosishda odam bilan bogʻlaydigan Telegram-botda qoladi. Maʼlumotni faqat vazifa uchun kerak boʻlganda soʻrang, xabarnomalarni kam yuboring va har bir bosishga soniyalar ichida javob bering. Botingiz allaqachon boʻlsa, operator tugmasi va tushunilmagan matnga toʻgʻri javobdan boshlang: bu eng arzon tuzatish va mijozlar uni darhol sezadi.

Biznesingizda Telegram-bot bor yoki yaqinda ishga tushadi. Mijoz botni ishga tushiradi va muammolar boshlanadi: stomatologga yozilish uchun besh darajali menyudan oʻtish kerak, yozib yuborilgan savolga bot «Nomaʼlum buyruq» deb javob beradi, «Operator bilan bogʻlanish» tugmasi umuman yoʻq, har ikki kunda esa hech kim soʻramagan aksiya keladi. Mijoz eng oson yoʻlni tanlaydi: botni bloklaydi-yu, menejerga shaxsiy chatda yozadi yoki qoʻngʻiroq qiladi. Bot texnik jihatdan ishlayapti, faqat undan hech kim foydalanmayapti. Quyida botni menyular daraxti sifatida emas, oʻz foydalanuvchi tajribasi (UX) boʻlgan mahsulot sifatida loyihalash qoidalari. Ular tugmali oddiy botga ham, AI bilan ishlaydigan botga ham birdek taalluqli.

## Bitta bot, bitta asosiy vazifa

Oʻzingizdan soʻrang: mijozlarning koʻpchiligi sizga nima uchun murojaat qiladi? Yetkazib berish xizmatida bu ovqatga buyurtma berish, klinikada qabulga yozilish, oʻquv markazida dars jadvalini bilish va sinov darsiga yozilish, servis kompaniyasida ariza qoldirish. Mana shu asosiy vazifa birinchi tugma boʻlishi kerak. Qolgani — kompaniya haqida, boʻsh ish oʻrinlari, mijozlar fikri, franshiza — ikkinchi darajali, ularni pastroqqa yoki «Boshqa» boʻlimiga oʻtkazing.

Asosiy vazifani qanday aniqlash mumkin:

- menejerlar Telegramda va telefonda eng koʻp qaysi savolga javob berishini yozib boring;
- bot allaqachon ishlayotgan boʻlsa, /start buyrugʻidan keyin qaysi tugma eng koʻp bosilishini koʻring;
- uchta «asosiy» vazifa chiqib qolsa, bittasini tanlang. Qolgan ikkitasi ikkinchi va uchinchi tugma boʻladi, teng darajali boʻlimlar emas.

/start buyrugʻidan keyingi birinchi xabar bir-ikki gapdan oshmasin: bot nima qila oladi va nimadan boshlash kerak. Kompaniya missiyasi haqidagi uzun matnga bu yerda joy yoʻq. Birinchi foydali qadamdan oldin mijozdan tilni tanlash, shartlarni qabul qilish, raqam yuborish va kanalga obuna boʻlishni talab qilmang. Tilni Telegram sozlamalaridan taxmin qilish mumkin: bot foydalanuvchi ilovasi tilining kodini oladi. Lekin oʻzbekzabon mijozning Telegrami ruscha yoki inglizcha sozlangan boʻlishi ham mumkin, shuning uchun tilni bitta tugma bilan almashtirish imkonini bering. Telefon raqami keyinroq, buyurtmani rasmiylashtirishda kerak boʻladi.

Foydali odat — start parametrli havolalar: bot havolasining oxiriga ?start=filial2 kabi qoʻshimcha yoziladi. Stol ustidagi yoki vitrinadagi QR-kod botni darhol kerakli joyda ochadi: muayyan filial menyusida yoki muayyan shifokorga yozilish bosqichida. Shu bilan birga mijoz qayerdan kelgani ham koʻrinib turadi.

## Tugmalar, menyular va chuqurlik

- **Tugmada qisqa matn, mijozning oʻz soʻzlari bilan.** «Buyurtma berish», «Qabulga yozilish», «Buyurtmalarim», «Biz bilan bogʻlanish». «Xizmatlar katalogi» yoki «Bron qilish moduli» emas. Oʻzbekcha matn koʻpincha ruschasidan uzunroq chiqadi, shuning uchun tugma yozuvi tor ekranli telefonda kesilib qolmasligini ikkala tilda tekshiring.
- **Darajalar imkon qadar kam.** Asosiy amalgacha ikki-uch bosishdan koʻp boʻlsa, odam adashadi. Uzun roʻyxatni — yuzta mahsulot, yigirmata shifokor — filtr yoki qidiruv bilan qisqartiring. Yuzlab mahsulotdan iborat katalogni tugmalar bilan varaqlatgandan koʻra Mini App orqali koʻrsatgan qulayroq.
- **Har bir qadamda «Orqaga» va «Bosh menyu».** Mijoz istalgan payt tanlagan narsasini yoʻqotmasdan bir qadam orqaga qaytishi yoki qaytadan boshlashi mumkin boʻlsin.
- **Ikki xil tugma, ikki xil vazifa uchun.** Yozish maydoni ostidagi tugmalar (reply klaviatura) doimiy bosh menyu uchun qulay. Xabar ostidagi tugmalar (inline) qadam ichidagi tanlov uchun: sana, vaqt, miqdor.
- **Yangi xabar yubormang, borini tahrirlang.** Mijoz menyuni varaqlayotganda yoki miqdorni oʻzgartirayotganda bot oʻsha xabarning oʻzini yangilashi mumkin. Aks holda bir daqiqa oʻtmay chat bir xil menyular tasmasiga aylanadi va qaysi tugma hali ishlashini tushunib boʻlmaydi.
- **Eski tugmalar botni buzmasin.** Mijoz bir hafta oldingi xabardagi tugmani bosdi. Bot jim qolmasin va xato bermasin, «Bu menyu eskirgan, mana yangisi» deb javob qaytarsin.
- **Buyruqlar menyusi.** BotFather orqali qisqa buyruqlar roʻyxatini sozlang (/start, /menu, /help, /language): ular yozish maydoni yonidagi menyu tugmasida koʻrinadi. Buyruqlar izohini oʻzbek va rus tilida alohida berish mumkin, bu bot kodida sozlanadi.

## Mijoz tugma bosish oʻrniga yozsa

Koʻp odam tugmalarni bosmaydi, odamga yozgandek yozadi: «salom», «tish tozalash necha pul», «soat nechagacha ishlaysizlar», «ertaga boʻladimi?». Kimdir ovozli xabar yoki Instagramdagi mahsulot skrinshotini yuboradi. Bularning har biriga «Nomaʼlum buyruq» deb javob berish — bot qila oladigan eng yomon ish: mijoz devor bilan gaplashayotgandek boʻladi.

AI boʻlmasa ham qilsa boʻladigan ishlar:

1. Menejerlar yozishmalaridan tez-tez uchraydigan ibora va savollarni yigʻing — ikkala tilda, lotin va kirill yozuvida, imlo xatolari bilan birga: «narxi», «нархи», «цена», «skoka».
2. Ularni javoblarga yoki kerakli boʻlimga bogʻlang: «manzil» yoki «адрес» deb yozgan odamga manzil va xaritadagi nuqta yuborilsin, «operator» yoki «odam» deb yozgan odam menejerga ulansin.
3. Bot tushunmagan har qanday xabarga odamdek javob bering va keyingi qadamni koʻrsating: «Savolingizni toʻliq tushunmadim. Quyidagi boʻlimlardan birini tanlang yoki operatorga yozing» — va shu xabarning oʻzida bosh menyu tugmalari hamda «Operator» tugmasi.
4. Bot tushuna olmaydigan ovozli xabar, rasm va fayllarni eʼtiborsiz qoldirmang, ularni operatorga oʻtkazing.
5. Bot tushunmagan barcha xabarlarni saqlang va haftada bir marta koʻrib chiqing. Botga keyin nimani oʻrgatish kerakligini shu roʻyxat eng yaxshi koʻrsatadi.

AI bilan bot erkin matnni ancha yaxshi tushunadi va bilimlar bazangiz asosida savollarga javob bera oladi. Lekin unga ham qoidalar kerak: nimani vaʼda qilishi mumkin va nimani odamga oʻtkazishi kerak. Buning ustiga soʻrovlar uchun har oy hisob keladi va u suhbatlar soni bilan birga oʻsadi. Savollar asosan takrorlanib tursa, iboralar lugʻati va yaxshi tugmalar koʻpincha yetarli.

## Odam doim bir bosish narida

Tirik odamga chiqib boʻlmaydigan botchalik jahlni chiqaradigan narsa kam.

- «Operator bilan bogʻlanish» tugmasi bosh menyuda koʻrinib tursin va bot uddalay olmagan har bir javob ostida chiqsin. Uni «Yordam» ichiga, uchinchi darajaga yashirmang.
- Tugma bosilganda operator qachon javob berishini darhol yozing. Masalan, tunda: «Operatorlar 9:00 dan 21:00 gacha javob beradi. Savolingizni yozib qoldiring, ertalab birinchi boʻlib javob beramiz». Va aytganingizni bajaring.
- Operator butun suhbatni koʻrsin: mijoz nimani tanlagan, nima yozgan, avval nima buyurtma qilgan. Mijoz hammasini boshidan tushuntirishga majbur boʻlmasin. Texnik jihatdan buni turlicha qilish mumkin: operatorlarning Telegram guruhida har bir mijoz uchun alohida mavzu ochiladi yoki, menejerlar amoCRM yoxud Bitrix24 tizimida ishlasa, suhbat oʻsha yerga tushadi.
- Mijoz endi odam bilan gaplashayotganini («Sizga administrator Dilnoza javob beryapti») va suhbat tugab, bot yana oʻzi javob bera boshlaganini tushunib tursin.
- Operatorlar bir nechta boʻlsa, har bir suhbatning masʼuli boʻlsin. Shunda ikki kishi bir mijozga bir vaqtda javob bermaydi va birorta savol javobsiz qolib ketmaydi.

## Maʼlumotni odob bilan soʻrash

- Faqat shu vazifa uchun kerak boʻlgan narsani va faqat kerakli paytda soʻrang. Yetkazib berish uchun — rasmiylashtirish bosqichida telefon va manzil. Qabulga yozilish uchun — ism va telefon. Tugʻilgan sana, e-mail, pasport maʼlumotlari — faqat ularsiz haqiqatan iloji boʻlmasa.
- Telefon raqamini «Raqamni yuborish» tugmasi orqali oling: Telegram raqamni bitta bosishda va xatosiz yuboradi. Lekin boshqa raqamni qoʻlda kiritish imkonini ham qoldiring: odam onasi uchun buyurtma berayotgan yoki asosiy raqamini bergisi kelmayotgan boʻlishi mumkin.
- Nima uchun soʻrayotganingizni ayting: «Kuryer yetib kelganda sizga qoʻngʻiroq qilishi uchun raqam kerak».
- Ismni Telegram profilidan olib taklif qilish mumkin, lekin tuzatishga imkon bering: profilda har xil narsa yozilgan boʻladi.
- Manzil uchun «Geolokatsiyani yuborish» tugmasini qoʻying va moʻljalni alohida soʻrang. Toshkentda kuryerga moʻljal koʻpincha uy raqamidan muhimroq.
- Bilganingizni qayta soʻramang. Ikkinchi buyurtmada saqlangan manzil va raqamni koʻrsating va bitta tugma qoʻying: «Ha, oʻsha manzilga».
- Qonunni yodda tuting: Oʻzbekiston fuqarolarining shaxsga doir maʼlumotlari — ismi, telefoni, manzili — Oʻzbekistondagi serverlarda saqlanishi kerak, bot yigʻgan baza ham bunga kiradi. Qancha kam yigʻsangiz, shuncha kam saqlaysiz va himoya qilasiz. Qonunning boshqa talablari sizga qanday taalluqli ekanini yurist bilan aniqlang.

## Bloklanmaydigan rassilkalar

Rassilka — obunachini yoʻqotishning eng tez yoʻli. Botni ikki bosishda bloklash mumkin, odamni qaytarish esa deyarli imkonsiz: bot uni bloklagan odamga yoza olmaydi. Yana bir cheklov bor: bot faqat oʻzini ishga tushirgan odamlarga yoza oladi, yaʼni raqamlar bazasini sotib olib, unga xabar tarqatib boʻlmaydi.

- **Xohlaganingizdan kamroq.** Kam yuborishdan boshlang va har bir rassilkadan keyin necha kishi botni bloklaganini kuzating: Telegram har bir bloklash haqida botning oʻziga xabar beradi, shuning uchun ularni sanash mumkin. Rassilkadan keyin bloklashlar odatdagidan sezilarli darajada koʻp boʻlsa, yo chastota, yo mazmun toʻgʻri kelmagan.
- **Foydali boʻlsin.** Xabar aynan shu odamga kerak boʻlishi lozim: joriy kursini tugatayotgan oʻquvchiga keyingi daraja, uyiga yaqin filialdagi aksiya, tish tozalatganiga olti oy boʻlganda koʻrikka eslatma.
- **Mijoz nima sotib olganiga qarab segmentlar**, shuningdek filial, tuman va til boʻyicha. Uchta aniq rassilka «hammaga hamma narsa haqida» bitta rassilkadan yaxshiroq. Buning uchun bot xaridlar tarixini bilishi kerak: oʻz bazasidan yoki 1C tizimidan. Ikkinchi holatda alohida integratsiya kerak boʻladi.
- **Obunadan chiqish oson boʻlsin.** «Aksiyalarni yubormang» tugmasi rassilka ostida ham, sozlamalarda ham tursin. Aksiyalardan voz kechish buyurtma holati va qabul haqidagi eslatmalarni oʻchirmasligi kerak: xizmat xabarlari va reklama alohida.
- **Vaqt va ovoz.** Aksiyani kechki soat oʻn birda yubormang. Shoshilinch boʻlmagan xabarlarni ovozsiz yuborish mumkin.
- **Katta roʻyxat — navbat bilan.** Telegram yuborish tezligini cheklaydi, shuning uchun bir necha ming kishiga rassilka bir zumda ketmaydi. Bu normal holat, lekin aksiya «faqat soat 18:00 gacha» boʻlsa, buni hisobga oling.

## Tezlik va xatolar

- Soniyalar ichida javob bering. Inline tugma bosilganda bot buni darhol tasdiqlashi kerak, aks holda tugmada yuklanish belgisi aylanib turadi va mijoz uni yana bosadi.
- Amal uzoq davom etsa — Click yoki Payme toʻlovini tekshirish, 1C tizimiga soʻrov, AI javobi — «yozmoqda…» holatini yoki «Mavjudligini tekshiryapman…» xabarini koʻrsating, keyin bu xabarni natija bilan almashtiring.
- Ikki marta bosishdan himoya qiling: «Tasdiqlash» tugmasi ikki marta bosilsa, ikkita buyurtma tushmasin.
- Xato haqidagi xabar nima boʻlganini, mijoz kiritgan maʼlumot saqlanganmi yoki yoʻqligini va endi nima qilish kerakligini aytsin.
- Tashqi tizim ishlamay qolsa, suhbatni uzmang: arizani qabul qiling va menejer uni tasdiqlashini ayting.
- Monitoring kerak: bot toʻxtab qolsa yoki ketma-ket xato bera boshlasa, jamoa bundan darhol xabar topsin, masalan, jamoaning Telegram guruhiga keladigan avtomatik xabardan. Botning ishlayotganini tashqaridan kuzatib turadigan alohida xizmat boʻlgani maʼqul, chunki toʻxtab qolgan bot oʻzi haqida xabar bera olmaydi. Muammo haqida juma kuni kechqurun mijozlardan eshitish — eng yomon variant.

Turli holatlarda yomon va yaxshiroq javob:

| Holat | Yomon | Yaxshiroq |
|---|---|---|
| Bot matnni tushunmadi | «Nomaʼlum buyruq» | «Toʻliq tushunmadim. Boʻlimni tanlang yoki operatorga yozing» va tugmalar |
| Vaqt band | «Xato 409» | «Soat 15:00 band. 15:30 va 16:00 boʻsh» va shu vaqtlar uchun tugmalar |
| Toʻlov tasdigʻi kelmadi | Jimlik | «Toʻlov tizimidan tasdiq kutyapmiz. Pul yechilgan boʻlsa, buyurtmangiz saqlangan, tasdiqni shu yerga yuboramiz» |
| Ish vaqtidan tashqari | «Operator mavjud emas» | «Operatorlar 9:00 dan 21:00 gacha ishlaydi. Savolingizni yozing, ertalab javob beramiz» |

## Haqiqiy mijozlar bilan sinab koʻring

- Mijozlaringizga oʻxshagan besh-olti kishini taklif qiling (xodimlar va dasturchilarni emas) va vazifa bering: «Shanba kuniga tish tozalashga yoziling». Keyin jim kuzating, yordam bermang. Odam qayerda ikkilangani, tugma oʻrniga nimani yozishga urinib koʻrgani, qayerda notoʻgʻri tugmani bosganini yozib boring.
- Oddiy arzon Android telefonda, mobil internetda va ikkala tilda sinang.
- Loglar asosida voronka tuzing: /start buyrugʻidan asosiy vazifa bajarilgunicha har bir qadamda nechta odam qolganini koʻring. Eng koʻp odam chiqib ketadigan qadam birinchi navbatda tuzatiladi.
- Haftada bir marta bot tushunmagan xabarlarni, operatorga murojaatlarni (odamdan nimani soʻrashgan boʻlsa, bot hozircha shuni qila olmaydi) va rassilkalardan keyingi bloklashlarni koʻrib chiqing. Har hafta kichik yaxshilanish — kaizen aynan shu.

## Bot allaqachon bor boʻlsa: nimadan boshlash kerak va qancha vaqt ketadi

Odatda eng tez oʻzini oqlaydigan tartib:

1. Operator tugmasi va tushunilmagan matnga odamdek javob. Bu eng arzoni, mijozlar ham farqni darhol sezadi.
2. Birinchi xabar va asosiy tugma.
3. Qisqa menyu, har bir qadamda «Orqaga» va «Bosh menyu».
4. Loglar va voronka, agar ular hali yoʻq boʻlsa.
5. Segmentlar boʻyicha rassilka va obunadan oson chiqish.

Muddat va narxga nimalar taʼsir qiladi:

- **Matnlar qayerda turadi.** Tugma va xabar matnlari koddan alohida saqlansa, menyuni qayta qurish bir necha kun oladi. Kodning ichiga yozib qoʻyilgan boʻlsa, har bir tuzatish dasturchining ishi.
- **Operatorga oʻtkazish qanday tuzilgan.** Telegram guruhida mavzular bilan ishlash soddaroq variant, odatda bir necha kundan bir-ikki haftagacha. Bitrix24 yoki amoCRM bilan integratsiya, bir nechta operator va ish vaqtiga qarab taqsimlash — bir necha hafta.
- **Segmentlar uchun maʼlumot bormi.** Xaridlar tarixi bot bazasida boʻlsa, segmentlar tez sozlanadi. Faqat 1C tizimida boʻlsa, integratsiya kerak.
- **Iboralar lugʻatimi yoki AI.** Lugʻat arzonga tushadi. AI esa ishlab chiqish, ikkala tildagi haqiqiy savollarda tekshirish va soʻrovlar uchun oylik toʻlov degani.
- **Kod va bot kimda.** Botni boshqa pudratchi qilgan va kod qoʻlingizda boʻlmasa, baʼzan tuzatgandan koʻra qaytadan yozgan osonroq. Bot dasturchining shaxsiy akkauntida emas, kompaniyaga tegishli Telegram akkauntida turganini ham tekshiring: botni BotFather orqali faqat uning egasi boshqaradi.

Mavjud botni tahlil qilish — barcha ssenariylarni bosib chiqish, loglarni koʻrish va bir nechta mijoz bilan sinov — odatda bir necha kundan ikki haftagacha vaqt oladi. Bu ssenariylar soniga va loglar umuman yuritiladimi-yoʻqmi, shunga bogʻliq.

Botingizni koʻrib chiqishimizni istasangiz, nomini inbox@qilich.com manziliga yuboring va mijozlar unga koʻpincha nima uchun kirishini yozing.
