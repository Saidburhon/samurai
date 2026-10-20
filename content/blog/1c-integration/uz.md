---
slug: 1c-integration
lang: uz
title: "Sayt, ilova va Telegram-botni 1C bilan bogʻlash: qoldiqlar, narxlar, buyurtmalar"
description: "Saytdagi qoldiq ombordagi bilan bir xil boʻlsin, buyurtma qoʻlda koʻchirilmasin. 1C integratsiyasi qanday ishlaydi, oldindan nimani tekshirish kerak."
date: 2026-10-21
tags: [1C, integratsiya, internet doʻkon, Telegram-bot, ombor hisobi, ulgurji savdo]
related: [backend, web, telegram, mobile]
reading_minutes: 8
---

Tovar qoldigʻi va narxlar ombor hisobi dasturida, koʻpincha 1C da yuritiladi, sotuv esa sayt, Telegram-bot yoki savdo agentlari orqali ham ketadi. 1C bilan sayt, bot va ilova oʻrtasida almashinuv boʻlmasa, bu ishni kimdir qoʻlda qiladi: kuniga bir marta praysni Excelga chiqaradi, saytdagi narxlarni tuzatadi, botga tushgan buyurtmalarni 1C ga qaytadan yozadi. Xatolar esa muqarrar. Mijoz omborda allaqachon qolmagan tovar uchun pul toʻlaydi. Ulgurji xaridor botda eski narxni koʻrib, aynan shu narxda yuk berishingizni talab qiladi. Buyurtma chat bilan buxgalteriya orasida yoʻqolib qoladi. 1C integratsiyasi bu muammolarni yechadi, faqat bitta shart bor va uni ish boshlanishidan oldin bilib qoʻygan maʼqul: almashinuv maʼlumotni qanday boʻlsa, shundayligicha uzatadi. 1C da bitta tovarning uchta kartochkasi boʻlsa, saytda ham uchta tovar chiqadi. Shuning uchun gapni texnologiyadan emas, nima qayerga uzatilishi va maʼlumotlaringiz qanday holatda ekanidan boshlaymiz.

## Nima qayerga uzatilishi kerak

Qoida oddiy: har bir turdagi maʼlumotning bitta egasi boʻladi. Narx va qoldiq 1C da yuritiladi, sayt ularni oʻzgartirmaydi. Buyurtma esa sayt yoki botda paydo boʻladi va 1C ga ketadi. Bitta maydonni ikki joyda oʻzgartirish mumkin boʻlsa, ertami-kechmi qiymatlar farq qilib qoladi va qaysi biri toʻgʻriligini hech kim ayta olmaydi.

| Maʼlumot | Qayerdan qayerga | Odatda qanchalik tez-tez | Sizda kim javob beradi |
|---|---|---|---|
| Katalog: nomlar, guruhlar, artikul, shtrix-kod | 1C → sayt, bot, ilova | oʻzgarganda yoki kuniga bir marta | tovarshunos yoki buxgalter |
| Narxlar: chakana, ulgurji, boshqa narx turlari | 1C → sotuv kanallari | oʻzgarganda | narxni tasdiqlaydigan odam |
| Omborlar boʻyicha qoldiq | 1C → sotuv kanallari | bir necha daqiqadan sutkada bir martagacha | ombor |
| Buyurtmalar | sayt, bot, ilova → 1C | darhol yoki har bir necha daqiqada | sotuv menejeri |
| Toʻlovlar | toʻlov tizimi → sayt → 1C | tasdiqlangan zahoti | buxgalter |
| Buyurtma holati | 1C → sayt, bot | oʻzgarganda | menejer, ombor |
| Tavsif va rasmlar | odatda saytning oʻzida yuritiladi | kerak boʻlganda | kontent-menejer yoki marketolog |

Mijozlar roʻyxatini ikki tomonga uzatish oʻylaganingizdan kamroq kerak boʻladi. Chakana doʻkon uchun buyurtmaning oʻzida ism, telefon va manzil boʻlsa yetarli, har bir xaridorni 1C da kontragent qilib ochish shart emas. Ulgurji savdoda boshqa gap: mijozning shartnomasi, alohida narxlari, kechiktirilgan toʻlovi va qarzi bor. Bu yerda mijoz maʼlumotlari almashinuvi kerak, asosan bir tomonga, 1C dan tashqariga: bot yoki agent ilovasi mijozga uning narxlari va qarzini koʻrsatadi, yangi kontragentni esa sayt emas, buxgalter ochadi.

## Avval 1C dagi maʼlumotlarni tartibga keltiring

Loyihaning eng koʻp eʼtibordan chetda qoladigan qismi shu. Almashinuvni bir haftada sozlash mumkin, keyin esa bir oy davomida saytda nega narxsiz tovarlar turgani aniqlanadi. Boshlashdan oldin shu roʻyxatdan oʻting:

- **Dublikatlar.** Bitta tovar ikki marta, har xil nom bilan ochilgan, qoldiq esa ikki kartochkaga boʻlinib ketgan. Saytda xaridor «mavjud emas» degan yozuvni koʻradi, omborda esa bir quti turibdi.
- **Nomlar.** «Kungab. yogʻi 1L PET» omborchiga tushunarli, xaridorga esa yoʻq. Xaridor uchun nom qayerda turishini hal qiling: 1C dagi qoʻshimcha rekvizitdami yoki saytda.
- **Shtrix-kod va artikullar.** Tizimlar orasida tovarlar aynan shular boʻyicha moslashtiriladi. Yagona kalit boʻlmasa, almashinuv pozitsiyalarni chalkashtira boshlaydi.
- **Oʻlchov birliklari.** Omborda hisob donada, ulgurji mijozga esa quti bilan sotasiz. Qayta hisoblash koeffitsiyenti menejerning xotirasida emas, 1C da turishi kerak.
- **Xarakteristikalar.** Oʻlcham, rang, hajm bitta tovarning xarakteristikasi sifatida ochilganmi yoki oʻnlab alohida kartochka boʻlibmi? Katalogda tovar qanday koʻrinishi shunga bogʻliq.
- **Omborlar.** Sayt uchun qaysi omborlar hisobga olinadi. Asosiy ombor ha, doʻkondagi vitrina va brak ombori yoʻq. Filiallar boʻlsa va mijoz tovarni oʻzi olib ketsa, har bir filial boʻyicha qoldiq kerak.
- **MXIK va qadoq kodlari.** Ularsiz onlayn toʻlovda fiskal chek chiqmaydi, ularni esa 1C dagi tovar kartochkasida saqlash eng qulayi.
- **Rasmlar.** Rasmlarni 1C da yuritmoqchi boʻlsangiz, nechta tovar rasmsizligini tekshiring. Koʻpincha rasm va tavsifni sayt tomonida yuritish osonroq.

Maʼlumotlarni sizning tomoningiz tuzatadi: buxgalter, tovarshunos, xarid menejeri. Dasturchi hisobotlar bilan yordam beradi: shtrix-kodsiz, narxsiz yoki nomi shubhali darajada oʻxshash tovarlar roʻyxatini chiqarib beradi. Lekin ikki kartochkadan qaysi biri haqiqiy ekanini omborni biladigan odam hal qiladi. Buning uchun ishga tushirishdan oldin vaqt ajrating va kelajak uchun qoida kelishib oling: yangi tovarning narxi, shtrix-kodi, MXIK kodi va rasmi boʻlmaguncha u saytga chiqmaydi.

## Almashinuv qanday ishlaydi

Asosan uchta yoʻl bor.

**CommerceML orqali standart almashinuv.** Bu XML asosidagi format, internet doʻkon 1C bilan odatda shu orqali bogʻlanadi. Koʻp savdo konfiguratsiyalarida «Обмен с сайтом» moduli tayyor turadi, internet doʻkon platformalarining koʻpchiligi ham bu formatni qabul qiladi. 1C jadval boʻyicha oʻzi saytga ulanadi, katalog, narx va qoldiqlarni yuboradi, yangi buyurtmalarni olib ketadi. Afzalligi: tez, arzon, koʻplab doʻkonlarda sinalgan, 1C bazasini internetga ochish shart emas. Kamchiligi: format bot yoki agent ilovasi uchun emas, internet doʻkon uchun moʻljallangan; katalog katta boʻlsa, toʻliq yuklash uzoq davom etadi; nostandart maydon va mantiqni qoʻshish qiyin.

**1C dagi HTTP-servislar yoki OData.** Vazifaga moslab alohida API ishlab chiqiladi: sayt, bot yoki ilova 1C dan aniq bir tovar qoldigʻini soʻraydi, buyurtma yuboradi va darhol javob oladi. HTTP-servislar moslashuvchan variant, ularni 1C dasturchisi yozadi. OData esa platformaning standart interfeysi: u baza obyektlarini 1C tomonida deyarli dasturlashsiz oʻqish va yozish uchun ochadi, lekin huquqlarni ehtiyotkorlik bilan sozlashni talab qiladi. Afzalligi: aniqlik va moslashuvchanlik, qoldiqni buyurtma rasmiylashtirilayotgan paytning oʻzida tekshirsa boʻladi. Kamchiligi: bazani veb-serverda publikatsiya qilish va tashqaridan ochish kerak, uni himoya qilish esa endi sizning zimmangizda; xaridorning har bir soʻrovi 1C ga yuk boʻladi; 1C ishlamay qolsa, sayt javob bera olmaydi.

**1C bilan kanallar oʻrtasida alohida servis.** 1C oʻzgarishlarni oraliq bazaga yuboradi, sayt, bot, ilova va mini ilova esa shu baza bilan ishlaydi. Afzalligi: kanallar tez javob beradi va 1C serveri yoniq-yoʻqligiga bogʻliq boʻlmaydi; buyurtmalar navbatda yigʻiladi va 1C qayta ishlaganda unga yetib boradi; yangi kanal 1C ga emas, servisga ulanadi. Kamchiligi: bu yana bitta tizim, uni ishlab chiqish, serverga joylashtirish va qoʻllab-quvvatlash kerak. Unda mijozlar maʼlumotlari saqlansa, shaxsga doir maʼlumotlar toʻgʻrisidagi qonunga koʻra uni Oʻzbekistondagi serverlarda joylashtirish kerak.

Qanday tanlash kerak:

- CommerceML ni qoʻllab-quvvatlaydigan platformada bitta internet doʻkon va tipik konfiguratsiya boʻlsa, standart almashinuvdan boshlang;
- saytdan tashqari bot, agentlar ilovasi yoki mini ilova ham boʻlsa, oraliq servisni koʻrib chiqing. Masalan, Toshkentda ikki ombori, chakana savdo uchun sayti va beshta savdo agenti bor distribyutorga odatda shu variant toʻgʻri keladi;
- qoldiqni real vaqtda tekshirish yoki tovarni rezervga qoʻyish kerak boʻlsa va 1C ishonchli serverda tursa, HTTP-servislarni tanlang, koʻpincha oraliq servis bilan birga.

## Qanchalik tez-tez sinxronlash kerak

Darhol, har bir necha daqiqada yoki sutkada bir marta: tanlov tovaringiz qanchalik tez sotilishiga bogʻliq.

- **Sutkada bir marta, tunda.** Assortiment barqaror va zaxira katta boʻlsa yetadi: distribyutordagi qurilish materiallari, kanselyariya, omborda koʻp turadigan ehtiyot qismlar.
- **Har 5–15 daqiqada.** Bir vaqtning oʻzida ham doʻkonda, ham onlayn sotadigan koʻpchilik biznes uchun oqilona variant. Butun katalogni emas, faqat oʻzgarishlarni yuborish kerak.
- **Darhol.** Tovar kam, qimmat yoki donalab sotiladigan boʻlsa kerak: texnika, seriya raqamli tovarlar. Bunda buyurtma rasmiylashtirilayotganda sayt 1C dan joriy qoldiqni soʻraydi.

Sinxronlashlar orasida tovar doʻkonda sotilib ketishi mumkin, saytdagi xaridor esa yoʻq narsaga buyurtma beradi. Bu holatda nima boʻlishini birinchi shikoyatdan keyin emas, oldindan hal qiling:

- aniq sonni emas, qoldiq maʼlum chegaradan, masalan uch donadan koʻp boʻlsagina «mavjud» deb koʻrsatish;
- buyurtma 1C ga tushishi bilan tovarni rezervga qoʻyish;
- tez sotiladigan tovarlar uchun rasmiylashtirish paytida qoldiqni alohida soʻrov bilan tekshirish;
- tovar qolmagan boʻlsa, menejer nima qilishini kelishib olish: bir soat ichida qoʻngʻiroq qiladi, oʻrniga boshqasini taklif qiladi yoki pulni mijoz qanday toʻlagan boʻlsa, shu yoʻl bilan qaytaradi.

## Buyurtma va toʻlovlarni 1C ga qaytarish

Sayt yoki botdan kelgan buyurtma 1C ga menejerga xabar sifatida emas, tayyor hujjat boʻlib tushishi kerak. Savdo konfiguratsiyalarida bu odatda versiyaga qarab «Заказ клиента» yoki «Заказ покупателя» hujjati boʻladi. Oldindan kelishib oling:

- chakana buyurtma qaysi kontragentga yoziladi: har bir xaridorgami yoki izohida telefon raqami bor umumiy «Chakana xaridor»gami;
- qaysi ombor, tashkilot va narx turi qoʻyiladi;
- yetkazib berish qanday aks etadi: narxi bilan alohida xizmat sifatidami yoki umuman yoʻqmi;
- 1C dan botga qaysi holatlar qaytadi: «yigʻildi», «kuryerga berildi», «joʻnatildi».

**Toʻlov.** Buyurtma Click, Payme yoki Uzum serveringizga toʻlovni tasdiqlagandan keyingina toʻlangan hisoblanadi, mijoz «Rahmat» sahifasiga qaytgani uchun emas. Shundan keyin 1C da toʻlov hujjati rasmiylashtiriladi yoki buyurtmaga belgi qoʻyiladi. Qaysi biri boʻlishini buxgalter hal qiladi, chunki provayderlarda pul tushish tartibi va komissiya ushlab qolinishi har xil. Kuniga bir marta uchta roʻyxatni solishtirib turing: provayder kabinetidagi toʻlovlar, saytdagi toʻlangan buyurtmalar va 1C dagi toʻlovlar.

**Elektron hisobvaraq-fakturalar.** Ulgurji mijozlarga fakturani odatda buxgalter 1C dan yoki operator kabinetidan chiqaradi: Didox, Faktura.uz yoki siz allaqachon ishlayotgan boshqa operator orqali. Sayt bilan integratsiya fakturani oʻzi yuborishi shart emas. Uning vazifasi 1C da buyurtma va sotuvni toʻgʻri rasmiylashtirish: kontragent, STIR, narxlar va MXIK kodlari toʻgʻri boʻlsin. Shunda faktura odatdagi yoʻl bilan ketadi.

## Sizdagi 1C va 1C mutaxassisingiz

Narx aytishdan oldin dasturchi quyidagilarni bilishi kerak:

- **Konfiguratsiya va versiya.** Tipik «Управление торговлей», «Розница», «Бухгалтерия», tarmoq yechimi yoki yillar davomida sizga moslab yozilgan konfiguratsiya. Tayyor almashinuv moduli bor-yoʻqligi va u kutilganidek ishlashi shunga bogʻliq.
- **Oʻzgartirishlar.** Tipik hujjatlar qayta ishlangan boʻlsa, standart almashinuv kutilmagan ishlarni qilishi mumkin. Almashinuv uchun yangi funksiyalarni konfiguratsiya kengaytmalari (расширения) orqali qilgan maʼqul: shunda konfiguratsiya qoʻllab-quvvatlashda qoladi, yangilanishlar esa muammosiz oʻrnatiladi.
- **Baza qayerda turibdi.** Kechqurun oʻchirib qoʻyiladigan buxgalter kompyuteridagi fayl baza har oʻn daqiqada boʻladigan almashinuv uchun yomon joy. Ofisdagi yoki ijaraga olingan serverdagi server versiyasi ishonchliroq ishlaydi. HTTP-servislar va OData uchun bazani veb-server orqali publikatsiya qilish va himoyalash kerak: HTTPS, minimal huquqli alohida foydalanuvchi, faqat kerakli manzillardan kirish.
- **Platforma versiyasi.** 7.7 va eski 8.x versiyalarida zamonaviy almashinuv usullarining bir qismi umuman yoʻq.

1C dasturchisi bilan sayt dasturchisi birga ishlaydi. Birinchisi 1C ichida boʻladigan hamma narsaga javob beradi: maʼlumotni chiqarish, buyurtmalarni qabul qilish, oʻzgartirishlar. Ikkinchisi sayt, bot, ilova va oraliq servisga. Loyiha odatda har ikki tomon «bu maydonni u tomon uzatishi kerak» deb hisoblaganda choʻzilib ketadi. Buning davosi bitta hujjat: maydonlar jadvali, unda har bir maydon qayerdan olinishi, qaysi formatda boʻlishi va unga kim javob berishi yozilgan boʻladi. 1C mutaxassisining ishi koʻpincha 1C hamkoringiz orqali alohida toʻlanadi, buni byudjetga boshidanoq qoʻshing.

## Almashinuv buzilganda

Almashinuv buziladi: 1C yangilangandan keyin, parol almashtirilganda, serverda joy tugaganda, kimdir tovarni boʻsh narx bilan saqlaganda. Muhimi, buni kim va qancha vaqtda bilib qolishi.

- **Almashinuv jurnali** ikkala tomonda: oxirgi muvaffaqiyatli almashinuv qachon boʻlgan, nechta tovar va buyurtma oʻtgan, qanday xatolar chiqqan.
- **Telegram-guruhga ogohlantirishlar:** almashinuv yarim soatdan beri oʻtmayapti, buyurtma 1C ga yetib bormadi, tovar narxsiz yuklandi, toʻlov bor, buyurtma esa yoʻq.
- **Qoʻlda ishlash varianti.** 1C ishlamay qolsa ham sayt va bot buyurtma qabul qilishda davom etadi; buyurtmalar yigʻilib turadi va aloqa tiklanganda ketadi. Menejer ularni qayerda koʻrishini va kerak boʻlsa qanday qilib qoʻlda kiritishini biladi.
- **Har bir 1C yangilanishidan keyin tekshiruv:** avval baza nusxasida, keyin ishchi bazada.
- **Har kungi solishtirish:** kechagi kun boʻyicha saytdagi buyurtmalar va 1C dagi buyurtmalar. Kuniga besh daqiqa bir oydan keyin bir nechta buyurtma qayerga yoʻqolganini qidirishdan arzonga tushadi.

## Muddatlar va narxga nima taʼsir qiladi

Rejalashtirish uchun moʻljal:

- tipik konfiguratsiya va tayyor internet doʻkon bilan CommerceML orqali standart almashinuv: odatda testlar bilan birga bir necha kundan bir-ikki haftagacha;
- bot, agentlar ilovasi yoki bir nechta kanal uchun alohida almashinuv: koʻpincha bir oydan uch oygacha;
- maʼlumotlarni tartibga keltirish: katalog hajmi va holatiga qarab bir necha kundan bir necha haftagacha. Bu ish parallel boradi va koʻpincha ishga tushirish sanasini aynan u belgilaydi.

Narxni oshiradigan omillar:

- kanallar soni: sayt, bot, mini ilova, agentlar ilovasi;
- konfiguratsiya qanchalik oʻzgartirilgani va test bazasi yoʻqligi;
- tovar xarakteristikalari, bir nechta narx turi va ombor, ulgurji mijozlar uchun alohida narxlar;
- buyurtma holatlarini qaytarish, rezerv va qoldiqni real vaqtda tekshirish;
- oraliq servis va uni joylashtirish;
- koʻpincha alohida hisoblanadigan 1C dasturchisi soatlari;
- qoʻllab-quvvatlash: 1C yangilangandan keyin almashinuvni tekshirish, baʼzan esa tuzatish kerak boʻladi.

## Boshlashdan oldin tekshiruv roʻyxati

- Konfiguratsiya nomi va versiyasi, platforma versiyasi, oʻzgartirishlar roʻyxati.
- Baza qayerda: fayl yoki server, ofisdami yoki ijaradagi serverdami, uni kim boshqaradi.
- Kirish huquqlari: almashinuv uchun kerakli huquqlarga ega 1C foydalanuvchisi, saytning admin paneli, toʻlov tizimlari kalitlari.
- Maydonlar jadvali: nima uzatiladi, qaysi yoʻnalishda, qanchalik tez-tez, kim javob beradi.
- Almashinuvda qatnashadigan narx turlari va omborlar.
- Sinxronlashlar orasida tovar sotilib ketsa nima qilinishi haqida qaror.
- Test uchun baza nusxasi. Ishchi bazada test qilib boʻlmaydi: sinov buyurtmalari hisobot va qoldiqlarga tushib qoladi.
- Ikki tomondan masʼullar: sizdan hisobni biladigan va qaror qabul qila oladigan odam; ijrochilardan 1C dasturchisi va sayt dasturchisi, savollar uchun bitta aloqa shaxsi bilan.
- Faktura chiqarish va toʻlovlarni solishtirish tartibi buxgalter bilan kelishilgan.

qilich.com saytidagi SamurAI yordamchisiga qaysi 1C konfiguratsiyasidan foydalanishingizni va qayerda sotayotganingizni yozing: saytdami, botdami yoki savdo agentlari orqalimi. Almashinuvning qaysi variantidan boshlash kerakligini maslahat beramiz.
