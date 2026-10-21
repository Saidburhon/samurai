---
slug: 1c-integration
lang: uz
title: "Sayt va Telegram-botni 1C bilan bogʻlash: qoldiq, narx, buyurtma"
description: "Saytdagi qoldiq ombordagi bilan bir xil boʻlsin, buyurtmalar qoʻlda koʻchirilmasin: 1C integratsiyasi qanday ishlaydi va oldindan nimani tekshirish kerak."
date: 2026-10-21
tags: [1C, integratsiya, internet doʻkon, Telegram-bot, ombor hisobi, ulgurji savdo]
related: [biz-1c-integration, web-ecommerce, tg-b2b-ordering, mob-field-sales]
reading_minutes: 9
---

1C bilan integratsiyada narxlar va qoldiqlar 1Cda qoladi, sayt yoki botdagi buyurtmalar esa 1Cga tayyor hujjat boʻlib tushadi va ularni hech kim qayta yozmaydi. Tipik konfiguratsiyada CommerceML orqali standart almashinuv odatda bir necha kundan ikki haftagacha, bot yoki bir nechta kanal uchun maxsus almashinuv esa bitta oqim uchun odatda bir necha hafta oladi. Loyihani koʻpincha 1Cdagi tartibsiz maʼlumotlar choʻzadi, shuning uchun takroriy yozuvlar, narxlar va oʻlchov birliklarini ish boshlanishidan oldin tartibga keltiring.

Tovar qoldigʻi va narxlar ombor hisobi dasturida, koʻpincha 1Cda yuritiladi, sotuv esa sayt, Telegram-bot yoki savdo agentlari orqali ham boʻladi. 1C bilan sayt, bot va ilova oʻrtasida almashinuv boʻlmasa, bu ishni kimdir qoʻlda qiladi: kuniga bir marta narxlar roʻyxatini Excelga chiqaradi, saytdagi narxlarni tuzatadi, botga tushgan buyurtmalarni 1Cga qayta kiritadi. Bunday ishda xato muqarrar. Mijoz omborda allaqachon qolmagan tovar uchun pul toʻlaydi. Ulgurji xaridor botda eski narxni koʻrib, tovarni aynan shu narxda yuklab berishingizni talab qiladi. Buyurtma chat bilan buxgalteriya orasida yoʻqolib qoladi. 1C integratsiyasi bu muammolarni hal qiladi, lekin bir narsani ish boshlanmasdan oldin bilib qoʻygan maʼqul: almashinuv maʼlumotni borligicha uzatadi. 1Cda bitta tovarning uchta kartochkasi boʻlsa, saytda ham uchta tovar chiqadi. Shuning uchun gapni texnologiyadan emas, nima qayerga uzatilishi va maʼlumotlaringiz qanday holatda ekanidan boshlaymiz.

## Nima qayerga uzatilishi kerak

Qoida oddiy: har bir turdagi maʼlumotning bitta egasi boʻladi. Narx va qoldiq 1Cda yuritiladi, sayt ularni oʻzgartirmaydi. Buyurtma esa sayt yoki botda paydo boʻladi va 1Cga ketadi. Bitta maydonni ikki joyda oʻzgartirish mumkin boʻlsa, ertami-kechmi qiymatlar farq qilib qoladi va qaysi biri toʻgʻriligini hech kim ayta olmaydi.

| Maʼlumot | Qayerdan qayerga | Odatda qanchalik tez-tez | Sizda kim javob beradi |
|---|---|---|---|
| Katalog: nomlar, guruhlar, artikul, shtrix-kod | 1C → sayt, bot, ilova | oʻzgarganda yoki kuniga bir marta | tovarshunos yoki buxgalter |
| Narxlar: chakana, ulgurji, boshqa narx turlari | 1C → sotuv kanallari | oʻzgarganda | narxni tasdiqlaydigan odam |
| Omborlar boʻyicha qoldiq | 1C → sotuv kanallari | har bir necha daqiqadan sutkada bir martagacha | ombor |
| Buyurtmalar | sayt, bot, ilova → 1C | darhol yoki har bir necha daqiqada | sotuv menejeri |
| Toʻlovlar | toʻlov tizimi → sayt → 1C | tasdiqlangan zahoti | buxgalter |
| Buyurtma holati | 1C → sayt, bot | oʻzgarganda | menejer, ombor |
| Tavsif va rasmlar | odatda saytning oʻzida yuritiladi | kerak boʻlganda | kontent-menejer yoki marketolog |

Mijozlar maʼlumotini ikki tomonlama almashish oʻylaganingizdan kamroq hollarda kerak boʻladi. Chakana doʻkon uchun buyurtmaning oʻzida ism, telefon va manzil boʻlsa yetarli, har bir xaridorni 1Cda kontragent qilib ochish shart emas. Ulgurji savdoda boshqa gap: mijozning shartnomasi, alohida narxlari, toʻlovni kechiktirish sharti va qarzi bor. Bu yerda mijozlar maʼlumotini almashish kerak, lekin asosan bir yoʻnalishda, 1Cdan tashqariga: bot yoki agent ilovasi mijozga uning narxlari va qarzini koʻrsatadi, yangi kontragentni esa sayt emas, buxgalter ochadi.

## Avval 1Cdagi maʼlumotlarni tartibga keltiring

Loyihaning eng koʻp eʼtibordan chetda qoladigan qismi shu. Almashinuvni bir haftada sozlash mumkin, keyin esa saytda nega narxsiz tovarlar turganini bir oy davomida aniqlashga toʻgʻri keladi. Boshlashdan oldin quyidagi roʻyxatni koʻrib chiqing:

- **Dublikatlar.** Bitta tovar ikki marta, har xil nom bilan ochilgan, qoldiq esa ikki kartochkaga boʻlinib ketgan. Saytda xaridor «mavjud emas» degan yozuvni koʻradi, omborda esa butun bir quti turibdi.
- **Nomlar.** «Kungab. yogʻi 1L PET» omborchiga tushunarli, xaridorga esa yoʻq. Xaridor uchun nom qayerda turishini hal qiling: 1Cdagi qoʻshimcha rekvizitdami yoki saytda.
- **Shtrix-kod va artikullar.** Tizimlar orasida tovarlar aynan shular boʻyicha moslashtiriladi. Yagona kalit boʻlmasa, almashinuv tovarlarni chalkashtirib yuboradi.
- **Oʻlchov birliklari.** Omborda hisob dona bilan yuritiladi, ulgurji mijozga esa qutilab sotasiz. Qayta hisoblash koeffitsiyenti menejerning yodida emas, 1Cda turishi kerak.
- **Xarakteristikalar.** Oʻlcham, rang, hajm bitta tovarning xarakteristikasi sifatida kiritilganmi yoki oʻnlab alohida kartochka qilib ochilganmi? Tovar katalogda qanday koʻrinishi shunga bogʻliq.
- **Omborlar.** Sayt uchun qaysi omborlar hisobga olinishini hal qiling: asosiy ombor ha, doʻkondagi vitrina va brak ombori yoʻq. Filiallar boʻlsa va mijoz tovarni oʻzi olib ketsa, har bir filial boʻyicha qoldiq kerak.
- **MXIK va qadoq kodlari.** Ularsiz onlayn toʻlovda fiskal chek chiqmaydi, ularni esa 1Cdagi tovar kartochkasida saqlash eng qulay.
- **Rasmlar.** Rasmlarni 1Cda yuritmoqchi boʻlsangiz, nechta tovarning rasmi yoʻqligini tekshiring. Koʻpincha rasm va tavsifni sayt tomonida yuritish osonroq.

Maʼlumotlarni sizning tomoningiz tuzatadi: buxgalter, tovarshunos, xarid menejeri. Dasturchi hisobotlar bilan yordam beradi: shtrix-kodsiz, narxsiz yoki nomlari shubhali darajada oʻxshash tovarlar roʻyxatini chiqarib beradi. Lekin ikki kartochkadan qaysi biri haqiqiy ekanini omborni biladigan odam hal qiladi. Buning uchun ishga tushirishdan oldin vaqt ajrating va keyingi ish uchun bitta qoidani kelishib oling: yangi tovarning narxi, shtrix-kodi, MXIK kodi va rasmi boʻlmaguncha u saytga chiqmaydi.

## Almashinuv qanday ishlaydi

Asosan uchta yoʻl bor.

**CommerceML orqali standart almashinuv.** Bu XML asosidagi format, internet doʻkon 1C bilan odatda shu orqali bogʻlanadi. Koʻp savdo konfiguratsiyalarida tayyor «Обмен с сайтом» moduli bor, koʻplab internet doʻkon platformalari ham bu formatni qabul qiladi. 1C belgilangan jadval boʻyicha saytga oʻzi ulanadi, katalog, narx va qoldiqlarni yuboradi va yangi buyurtmalarni olib ketadi. Afzalligi: tez, arzon, koʻplab doʻkonlarda sinalgan, 1C bazasini internetga ochish shart emas. Kamchiligi: format bot yoki agent ilovasi uchun emas, internet doʻkon uchun moʻljallangan; katalog katta boʻlsa, toʻliq yuklash uzoq davom etadi; nostandart maydon va mantiqni qoʻshish qiyin.

**1Cdagi HTTP-servislar yoki OData.** Vazifaga moslab alohida API ishlab chiqiladi: sayt, bot yoki ilova 1Cdan aniq bir tovar qoldigʻini soʻraydi, buyurtma yuboradi va darhol javob oladi. HTTP-servislar moslashuvchan variant, ularni 1C dasturchisi yozadi. OData esa platformaning standart interfeysi: u baza obyektlarini 1C tomonida deyarli dasturlashsiz oʻqish va yozish uchun ochadi, lekin huquqlarni ehtiyotkorlik bilan sozlashni talab qiladi. Afzalligi: aniqlik va moslashuvchanlik, qoldiqni buyurtma rasmiylashtirilayotgan paytning oʻzida tekshirsa boʻladi. Kamchiligi: bazani veb-serverda publikatsiya qilish va tashqaridan ochish kerak, uni himoya qilish esa endi sizning zimmangizda; xaridorning har bir soʻrovi 1Cga qoʻshimcha yuk boʻladi; 1C ishlamay qolsa, sayt javob bera olmaydi.

**1C bilan kanallar oʻrtasida alohida servis.** 1C oʻzgarishlarni oraliq bazaga yuboradi, sayt, bot, ilova va mini ilova esa shu baza bilan ishlaydi. Afzalligi: kanallar tez javob beradi va 1C serveri yoniq-yoʻqligiga bogʻliq boʻlmaydi; buyurtmalar navbatda yigʻiladi va 1C yana ishga tushganda unga yetib boradi; yangi kanal 1Cga emas, servisga ulanadi. Kamchiligi: bu yana bitta tizim, uni ishlab chiqish, serverga joylashtirish va qoʻllab-quvvatlash kerak. Unda mijozlarning shaxsga doir maʼlumotlari (ism, telefon, manzil) saqlansa, «Shaxsga doir maʼlumotlar toʻgʻrisida»gi qonunga koʻra bu baza Oʻzbekistondagi serverlarda turishi kerak.

Qaysi birini tanlash kerak:

- CommerceMLni qoʻllab-quvvatlaydigan platformada bitta internet doʻkon va tipik konfiguratsiya boʻlsa, standart almashinuvdan boshlang;
- saytdan tashqari bot, agentlar ilovasi yoki mini ilova ham boʻlsa, oraliq servisni koʻrib chiqing. Masalan, Toshkentda ikki ombori, chakana savdo uchun sayti va beshta savdo agenti bor distribyutorga odatda shu variant toʻgʻri keladi;
- qoldiqni real vaqtda tekshirish yoki tovarni rezervga qoʻyish kerak boʻlsa va 1C ishonchli serverda tursa, HTTP-servislarni tanlang, koʻpincha oraliq servis bilan birga.

## Qanchalik tez-tez sinxronlash kerak

Darhol, har bir necha daqiqada yoki sutkada bir marta: tanlov tovaringiz qanchalik tez sotilishiga bogʻliq.

- **Sutkada bir marta, tunda.** Assortiment barqaror va zaxira katta boʻlsa yetadi: distribyutordagi qurilish materiallari, kanselyariya, omborda koʻp miqdorda turadigan ehtiyot qismlar.
- **Har 5–15 daqiqada.** Bir vaqtning oʻzida ham doʻkonda, ham onlayn sotadigan koʻpchilik biznes uchun oqilona variant. Butun katalogni emas, faqat oʻzgarishlarni yuborish kerak.
- **Darhol.** Tovar kam, qimmat yoki donalab sotiladigan boʻlsa kerak: texnika, seriya raqamli tovarlar. Bunda buyurtma rasmiylashtirilayotganda sayt 1Cdan joriy qoldiqni soʻraydi.

Sinxronlashlar orasida tovar doʻkonda sotilib ketishi mumkin, saytdagi xaridor esa allaqachon yoʻq tovarga buyurtma beradi. Bu holatda nima boʻlishini birinchi shikoyatdan keyin emas, oldindan hal qiling:

- aniq sonni emas, qoldiq maʼlum chegaradan, masalan uch donadan koʻp boʻlsagina «mavjud» deb koʻrsatish;
- buyurtma 1Cga tushishi bilan tovarni rezervga qoʻyish;
- tez sotiladigan tovarlar uchun rasmiylashtirish paytida qoldiqni alohida soʻrov bilan tekshirish;
- tovar qolmagan boʻlsa, menejer nima qilishini kelishib olish: bir soat ichida mijozga qoʻngʻiroq qiladi, oʻrniga boshqasini taklif qiladi yoki pulni mijoz qanday toʻlagan boʻlsa, shu yoʻl bilan qaytaradi.

## Buyurtma va toʻlovlarni 1Cga qaytarish

Sayt yoki botdan kelgan buyurtma 1Cga menejerga xabar sifatida emas, tayyor hujjat boʻlib tushishi kerak. Savdo konfiguratsiyalarida bu odatda versiyaga qarab «Заказ клиента» yoki «Заказ покупателя» hujjati boʻladi. Oldindan kelishib oling:

- chakana buyurtma qaysi kontragentga yoziladi: har bir xaridorgami yoki izohiga telefon raqami yozilgan umumiy «Chakana xaridor»gami;
- qaysi ombor, tashkilot va narx turi qoʻyiladi;
- yetkazib berish qanday aks ettiriladi: alohida narxli xizmat sifatidami yoki umuman aks ettirilmaydimi;
- 1Cdan botga qaysi holatlar qaytadi: «yigʻildi», «kuryerga berildi», «joʻnatildi».

**Toʻlov.** Buyurtma Click, Payme yoki Uzum serveringizga toʻlovni tasdiqlagandan keyingina toʻlangan hisoblanadi, mijoz «Rahmat» sahifasiga qaytgani uchun emas. Shundan keyin 1Cda toʻlov hujjati rasmiylashtiriladi yoki buyurtmaga belgi qoʻyiladi. Qaysi biri boʻlishini buxgalter hal qiladi, chunki provayderlarda pul tushish tartibi va komissiya ushlab qolinishi har xil. Kuniga bir marta uchta roʻyxatni solishtirib turing: provayder kabinetidagi toʻlovlar, saytdagi toʻlangan buyurtmalar va 1Cdagi toʻlovlar.

**Elektron hisobvaraq-fakturalar.** Ulgurji mijozlarga fakturani odatda buxgalter 1Cdan yoki operator kabinetidan chiqaradi: Didox, Faktura.uz yoki siz allaqachon ishlayotgan boshqa operator orqali. Sayt bilan integratsiya fakturani oʻzi yuborishi shart emas. Uning vazifasi 1Cda buyurtma va sotuvni toʻgʻri rasmiylashtirish: kontragent, STIR, narxlar va MXIK kodlari toʻgʻri boʻlsin. Shunda faktura odatdagi yoʻl bilan ketadi.

## Sizdagi 1C va 1C mutaxassisingiz

Narx aytishdan oldin dasturchi quyidagilarni bilishi kerak:

- **Konfiguratsiya va versiya.** Tipik «Управление торговлей», «Розница», «Бухгалтерия», tarmoq yechimi yoki yillar davomida sizga moslab oʻzgartirilgan konfiguratsiya. Tayyor almashinuv moduli bor-yoʻqligi va u kutilganidek ishlashi shunga bogʻliq.
- **Oʻzgartirishlar.** Tipik hujjatlar qayta ishlangan boʻlsa, standart almashinuv oʻzini kutilmagan tarzda tutishi mumkin. Almashinuv uchun yangi funksiyalarni konfiguratsiya kengaytmalari (расширения) orqali qilgan maʼqul: shunda konfiguratsiya yetkazib beruvchining qoʻllab-quvvatlashida qoladi, yangilanishlarni oʻrnatish esa ancha oson boʻladi.
- **Baza qayerda turibdi.** Har kuni kechqurun oʻchiriladigan buxgalter kompyuteridagi fayl baza har oʻn daqiqada ishlaydigan almashinuv uchun yaramaydi. Ofisdagi yoki ijaraga olingan serverdagi mijoz-server versiyasi ishonchliroq ishlaydi. HTTP-servislar va OData uchun bazani veb-server orqali publikatsiya qilish va himoyalash kerak: HTTPS, minimal huquqli alohida foydalanuvchi, faqat kerakli manzillardan kirish.
- **Platforma versiyasi.** 7.7 va eski 8.x versiyalarida zamonaviy almashinuv usullarining bir qismi umuman yoʻq.

1C dasturchisi bilan sayt dasturchisi birga ishlaydi. Birinchisi 1C ichida boʻladigan hamma narsaga javob beradi: maʼlumotni chiqarish, buyurtmalarni qabul qilish, oʻzgartirishlar. Ikkinchisi sayt, bot, ilova va oraliq servisga javob beradi. Loyiha odatda har ikki tomon «bu maydonni boshqa tomon uzatishi kerak» deb hisoblaganda choʻzilib ketadi. Buning yechimi bitta hujjat: maydonlar jadvali. Unda har bir maydon qayerdan olinishi, qaysi formatda boʻlishi va unga kim javob berishi yoziladi. 1C mutaxassisining ishi koʻpincha 1C hamkoringiz orqali alohida toʻlanadi, buni byudjetga boshidanoq kiriting.

## Almashinuv buzilganda

Almashinuv baribir buziladi: 1C yangilangandan keyin, parol almashtirilganda, serverda joy tugaganda, kimdir tovarni boʻsh narx bilan saqlaganda. Muhimi, buni kim va qanchalik tez bilib qolishi.

- **Almashinuv jurnali** ikkala tomonda: oxirgi muvaffaqiyatli almashinuv qachon boʻlgan, nechta tovar va buyurtma oʻtgan, qanday xatolar chiqqan.
- **Telegram-guruhga ogohlantirishlar:** almashinuv yarim soatdan beri oʻtmayapti, buyurtma 1Cga yetib bormadi, tovar narxsiz yuklandi, toʻlov bor, buyurtma esa yoʻq.
- **Qoʻlda ishlash varianti.** 1C ishlamay qolsa ham sayt va bot buyurtma qabul qilishda davom etadi; buyurtmalar yigʻilib turadi va aloqa tiklanganda ketadi. Menejer ularni qayerda koʻrishini va kerak boʻlsa qanday qilib qoʻlda kiritishini biladi.
- **Har bir 1C yangilanishidan keyin tekshiruv:** avval baza nusxasida, keyin ishchi bazada.
- **Har kungi solishtirish:** kechagi kun boʻyicha saytdagi buyurtmalar va 1Cdagi buyurtmalar. Kuniga besh daqiqa sarflash bir oydan keyin bir nechta buyurtma qayerga yoʻqolganini qidirishdan arzonroq.

## Muddatlar va narxga nima taʼsir qiladi

Rejalashtirish uchun moʻljal:

- tipik konfiguratsiya va tayyor internet doʻkon bilan CommerceML orqali standart almashinuv: odatda testlar bilan birga bir necha kundan bir-ikki haftagacha;
- bot, agentlar ilovasi yoki bir nechta kanal uchun alohida almashinuv: bitta oqim uchun koʻpincha bir necha hafta, bir nechta kanal va oraliq servis bilan esa uch oygacha;
- maʼlumotlarni tartibga keltirish: katalog hajmi va holatiga qarab bir necha kundan bir necha haftagacha. Bu ish parallel boradi va koʻpincha ishga tushirish sanasini aynan u belgilaydi.

Narxni oshiradigan omillar:

- kanallar soni: sayt, bot, mini ilova, agentlar ilovasi;
- konfiguratsiya qanchalik oʻzgartirilgani va test bazasi yoʻqligi;
- tovar xarakteristikalari, bir nechta narx turi va ombor, ulgurji mijozlar uchun alohida narxlar;
- buyurtma holatlarini qaytarish, rezerv va qoldiqni real vaqtda tekshirish;
- oraliq servis va uni serverga joylashtirish;
- koʻpincha alohida hisoblanadigan 1C dasturchisi soatlari;
- qoʻllab-quvvatlash: 1C yangilangandan keyin almashinuvni tekshirish, baʼzan esa tuzatish kerak boʻladi.

## Boshlashdan oldin tekshiruv roʻyxati

- Konfiguratsiya nomi va versiyasi, platforma versiyasi, oʻzgartirishlar roʻyxati.
- Baza qayerda: fayl yoki server, ofisdami yoki ijaradagi serverdami, uni kim boshqaradi.
- Kirish huquqlari: almashinuv uchun kerakli huquqlarga ega 1C foydalanuvchisi, saytning admin paneliga kirish, toʻlov tizimlari kalitlari.
- Maydonlar jadvali: nima uzatiladi, qaysi yoʻnalishda, qanchalik tez-tez, kim javob beradi.
- Almashinuvda qatnashadigan narx turlari va omborlar.
- Sinxronlashlar orasida tovar sotilib ketsa nima qilinishi haqida qaror.
- Test uchun baza nusxasi. Ishchi bazada test qilib boʻlmaydi: sinov buyurtmalari hisobot va qoldiqlarga tushib qoladi.
- Ikki tomondan masʼullar: sizdan hisobni biladigan va qaror qabul qila oladigan odam; ijrochi tomondan 1C dasturchisi va sayt dasturchisi, savollar uchun esa bitta aloqa shaxsi.
- Faktura chiqarish va toʻlovlarni solishtirish tartibi buxgalter bilan kelishilgan.

Qaysi 1C konfiguratsiyasida ishlashingizni va qayerda sotishingizni (saytdami, botdami yoki savdo agentlari orqalimi) qilich.com saytidagi SamurAI yordamchisiga yozing. Almashinuvning qaysi variantidan boshlash kerakligini maslahat beramiz.
