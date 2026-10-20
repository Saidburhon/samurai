---
slug: ai-document-processing
lang: uz
title: "AI yordamida hujjatlarni qayta ishlash: hisobvaraq-faktura, yuk xati, shartnoma"
description: "Qogʻoz va PDF hujjatlardagi maʼlumotni qoʻlda koʻchirish oʻrniga AI ularni oʻqib, 1C yoki jadvalga kiritadi. Qayerda ishlaydi, qayerda tekshiruv shart."
date: 2026-10-21
tags: [ai, documents, 1c, e-invoicing, automation, personal-data]
related: [ai, backend, telegram]
reading_minutes: 7
---

Buxgalteriyaga har kuni hujjat oqib keladi: taʼminotchilarning yuk xatlari, hisobvaraqlar, dalolatnomalar, ishonchnomalar, shartnomalar. Bir qismi Didoxda turibdi, bir qismini Telegramga PDF qilib tashlashgan, yana bir qismini haydovchi qogʻozda olib kelgan: gʻijimlangan, raqamlar ustidan muhr bosilgan. Kimdir ularni birma-bir ochib, taʼminotchi, STIR, tovarlar, miqdor va summalarni 1Cga koʻchiradi. Ish sekin va zerikarli, xatolar esa bir oydan keyin, taʼminotchi bilan hisob-kitob solishtirilganda chiqadi. Oʻqish va koʻchirish ishini AI oʻz zimmasiga olishi mumkin, lekin hamma hujjatda emas va tekshiruvsiz emas. Quyida qaysi hujjatni AIga berish kerak, rasmdan 1Cdagi yozuvgacha yoʻl qanday quriladi va qayerda odamsiz boʻlmaydi, shular haqida.

## Qaysi hujjatlar allaqachon maʼlumot

Avval oddiy roʻyxat tuzing: nima keladi, qanday koʻrinishda va oyiga nechta. Koʻpincha kiruvchi hujjatlarning sezilarli qismi allaqachon elektron ekani maʼlum boʻladi.

Taʼminotchi Didox, Faktura.uz yoki boshqa operator orqali yuborgan elektron hisobvaraq-faktura rasm emas. Bu E-IMZO elektron raqamli imzosi bilan imzolangan, tuzilgan maʼlumot: STIR, tovarlar, miqdor, narx va QQS unda allaqachon alohida maydonlarda turadi. Uni AI orqali oʻtkazish ekrandagi matnni qayta yozish uchun ekranni suratga olishga oʻxshaydi. Toʻgʻri yoʻl integratsiya: hujjatlar operatordan API yoki tayyor modul orqali olinadi va 1Cga kirim hujjati qoralamasi boʻlib tushadi. Operatorlarda 1C uchun tayyor yechimlar uchraydi; konfiguratsiyangiz qattiq oʻzgartirilgan boʻlsa, alohida integratsiya kerak boʻladi. 1C bilan bogʻlash haqida batafsil: [Sayt, ilova va Telegram-botni 1C bilan bogʻlash](/blog/1c-integration/).

Operatorlar orqali faqat hisobvaraq-fakturalar yurmaydi, shuning uchun yirik taʼminotchilardan yana qaysi hujjatlarni elektron yubora olishini soʻrang. Keng tarqalgan xatodan ham ehtiyot boʻling: taʼminotchi operatorda allaqachon turgan hisobvaraq-fakturaning PDF nusxasini Telegramga ham tashlaydi, ofisda esa uni tanib olishga yuborishadi.

| Hujjat | Odatda qanday keladi | Nima qilish kerak |
|---|---|---|
| Elektron hisobvaraq-faktura | Didox, Faktura.uz va boshqa operatorlar orqali | Operator bilan integratsiya, AI kerak emas |
| Bank koʻchirmasi | Bank-mijoz tizimidan yuklab olinadi | 1C bilan standart almashinuv |
| Taʼminotchining narxlar roʻyxati | Excel, baʼzan PDF | Excel ustunlar shabloni boʻyicha oʻqiladi; PDF va yangi shakllar uchun AI |
| Qogʻozdagi yuk xati, dalolatnoma | Rasm, skan | AI, tekshiruv qoidalari, odam |
| Shartnoma | PDF, skan, Word | AI qisqa bayon qiladi, qarorni odam qabul qiladi |

## AI qayerda yordam beradi: skan, rasm va PDF

Qolgani rasm yoki tuzilmasiz fayl boʻlib keladigan hamma narsa. Masalan, qurilish kompaniyasini olaylik: obyektlarga har kuni sement, armatura, gʻisht olib kelinadi, har bir yuk bilan yuk xati keladi, har bir taʼminotchining shakli oʻziniki. Ilgari har bir shakl uchun alohida tanib olish shabloni sozlanardi, shakl biroz oʻzgarsa, shablon buzilardi. Hozirgi modellar hujjatni maʼnosiga qarab oʻqiydi: shaklni birinchi marta koʻrsa ham taʼminotchi, raqam, sana, tovarlar jadvali va jami summani topadi.

Yaxshi oʻqiladi:

- PDF va tiniq skanlardagi bosma matn va jadvallar;
- rekvizitlar, sanalar, raqamlar, summalar;
- oʻzbekcha va ruscha hujjatlar, lotin va kirill yozuvida. Oʻz namunalaringizda sinab koʻring: oʻzbek tilida modellar bir-biridan sezilarli farq qiladi.

Yomonroq oʻqiladi:

- qoʻlda yozilgan belgilar, masalan bosma «50» ustiga yozilgan «48 ta qabul qilindi»;
- raqamlar ustidagi muhr yoki imzo;
- qiyshiq yoki soyada tushirilgan rasm, gʻijimlangan qogʻoz;
- ikkinchi sahifaga oʻtib ketadigan jadvallar, ayniqsa ikkinchi sahifani suratga olish esdan chiqqan boʻlsa.

Qoʻlyozma xatolarning asosiy manbai. Omborchi yoki prorab haqiqatda qabul qilingan miqdorni qoʻlda yozsa, model uni qanchalik ishonch bilan oʻqimasin, bu maydon har doim odam tasdigʻiga ketishi kerak.

## Rasmdan yozuvgacha

Hujjatning yoʻli besh qadamdan iborat. Har birini soddaroq yoki murakkabroq qilish mumkin, lekin birortasini ham tashlab ketib boʻlmaydi.

1. **Qabul qilish.** Omborchi yoki haydovchi yuk xatini telefonda suratga olib, Telegram-botga yuboradi; taʼminotchilar hujjatlarni alohida pochta manziliga joʻnatadi; ofisdagi skaner fayllarni papkaga tashlaydi. Bot rasm sifatini darhol tekshiradi: xira yoki chala tushgan boʻlsa, haydovchi hali omborda ekanida qayta suratga olishni soʻraydi.
2. **Ajratib olish.** Model hujjatni oʻqiydi va maydonlarni qatʼiy tuzilmada qaytaradi: taʼminotchi, STIR, raqam va sana, tovarlar (nomi, miqdori, oʻlchov birligi, narxi, summasi), QQS, jami. Har bir maydon uchun ishonch darajasi ham beriladi.
3. **Tekshirish.** AI emas, oddiy dastur mexanik qoidalarni ishlatadi. Ular haqida keyingi boʻlimda.
4. **Koʻrib chiqish.** Hammasi mos kelgan hujjatni odam tez koʻzdan kechiradi. Biror narsa mos kelmasa, belgilangan maydonlarni tuzatadi.
5. **Yozish.** Tasdiqlangan hujjat 1Cga oʻtkazilmagan kirim hujjati boʻlib (HTTP-servis yoki OData orqali) yoki jadvalga qator boʻlib tushadi. Uni buxgalter oʻtkazadi. Asl fayl yonida saqlanadi va yozuvdan bir bosishda ochiladi.

AI hujjatni oʻzi oʻtkazmasligi kerak. Buxgalter bitta tugma bilan oʻtkazadigan qoralama deyarli shuncha vaqtni tejaydi, xato esa hisob va hisobotga kirib ketmaydi.

Alohida masala nomenklatura. Taʼminotchida «Armatura A500 d12», sizning 1Cda esa xuddi shu tovar boshqacha nomlangan. Bu moslik jadvali bilan hal qilinadi: birinchi marta odam pozitsiyani tanlaydi, keyin tizim «taʼminotchi + uning nomi» juftligini eslab qoladi. AI nomzod taklif qilishi mumkin, lekin odamning tanlovi saqlanadi. Bir necha haftadan keyin doimiy taʼminotchilarning aksariyat pozitsiyalari oʻzi moslanadi.

## Xatolarni ushlaydigan tekshiruvlar

Model «8»ni ishonch bilan «3» deb oʻqishi yoki bitta qatorni tushirib qoldirishi mumkin. Shuning uchun ajratib olingan har bir qiymat oddiy kodda yozilgan qoidalardan oʻtadi:

- **arifmetika**: miqdor × narx = qator summasi, qatorlar yigʻindisi = jami, QQS stavka boʻyicha qayta hisoblanadi;
- **STIR**: toʻqqiz raqam va shu STIRli kontragent roʻyxatda bor. Yangi STIR har doim odamga ketadi;
- **nomenklatura**: har bir pozitsiya sizning roʻyxatingiz bilan moslangan;
- **buyurtma**: tovarlar, miqdor va narxlar taʼminotchiga berilgan buyurtmaga mos keladi, belgilangan chegaradan katta farq ajratib koʻrsatiladi;
- **dublikatlar**: shu taʼminotchi, raqam va sana bilan hujjat avval kiritilgan boʻlsa, ikkinchi marta kiritilmaydi. Bitta yuk xatini ham rasm, ham PDF qilib yuborishganda bu tez-tez uchraydi;
- **sanalar**: kelajakdagi sana emas va yopilgan davrga tegishli emas;
- **modelning ishonchi**: ishonch darajasi past maydonlar arifmetika mos kelsa ham ajratib koʻrsatiladi.

Sxemani ishonchli qiladigan narsa aynan qoidalar. Modelni boshqasiga almashtirish mumkin, qoidalar esa qoladi va xatolarni ushlashda davom etadi.

## Odam tekshiruvi sxemaning bir qismi

Koʻrib chiqishni keyin olib tashlanadigan vaqtinchalik yechim deb oʻylamang. Uni asosiy ish ekrani sifatida loyihalash kerak:

- chapda hujjat rasmi, oʻngda maydonlar; maydonni bossangiz, rasmda u qayerdan olingani koʻrinadi;
- belgilangan maydonlar tepada, sababi bilan: «qatorlar yigʻindisi jamiga teng emas», «yangi taʼminotchi», «qoʻlda tuzatilgan»;
- maydonni tuzatish va hujjatni tasdiqlash klaviaturadan, ortiqcha oynalarsiz;
- har bir tuzatish saqlanadi va ulardan qaysi taʼminotchi va maydonlarda xato koʻpligi koʻrinadi.

Qoʻlda tekshirish hajmi asta-sekin va maʼlumotga qarab kamaytiriladi. Muayyan taʼminotchi va hujjat turi boʻyicha bir necha hafta tuzatish boʻlmagan boʻlsa, uning barcha qoidalardan oʻtgan hujjatlarini avtomatik tasdiqlash mumkin, tanlab nazoratni qoldirgan holda, masalan har yigirmanchi hujjatni. Yangi taʼminotchilar, yangi shakllar va qoidalardan oʻtmagan hamma narsa avvalgidek odamga boradi.

Navbatga kim javob berishini oldindan hal qiling. Tekshiruvdagi hujjatlar bir hafta yigʻilib qolsa, eski kechikishning oʻzi qaytadi, faqat boshqa oynada.

## Shartnomalar: qaror emas, qisqa bayon

Shartnomada vazifa boshqa. Undan qatorma-qator koʻchiriladigan narsa yoʻq, lekin uni oʻqib chiqish va muhim joyni oʻtkazib yubormaslik kerak. AI qisqa bayonni yaxshi qiladi:

- tomonlar, predmet, summa, valyuta, toʻlov tartibi;
- muddatlar: yetkazib berish, toʻlov, shartnoma amal qilish muddati, avtomatik uzaytirish;
- jarima va penyalar, bekor qilish shartlari, nizolar qayerda koʻriladi;
- sizning namunaviy shartnomangizdan farq qiladigan va unda umuman yoʻq bandlar.

Bizning sharoitda foydali holat: ikki tilda, ikki ustunda yozilgan shartnoma. AI oʻzbekcha va ruscha matn summa, muddat yoki tomonlarning majburiyatlarida farq qiladigan joylarni belgilab berishi mumkin. Koʻz bilan oʻqiganda bunday narsa oson oʻtib ketadi.

Lekin qisqa bayon yurist yoki rahbar uchun yordam, xulosa emas. Model bandni tushirib qoldirishi yoki ilovaga havolani notoʻgʻri tushunishi mumkin. Imzolash yoki imzolamaslikni shartnomani toʻliq oʻqigan odam hal qiladi. Yana bir amaliy foyda muddatlarda: bayondagi sanalar kalendarga yoki Telegramdagi eslatmaga tushadi va shartnoma muddati tugashi kutilmaganda kelmaydi.

## Xarajatlar va maʼlumotlar himoyasi

Narx nimalardan yigʻiladi:

- **ishlab chiqish**: hujjatlarni qabul qilish, ajratib olish, qoidalar, tekshiruv ekrani, 1Cga yozish. Muddat va narxga eng koʻp hujjat turlari soni, maʼlumotnomalar holati (kontragent va nomenklatura dublikatlarini tozalashga toʻgʻri keladi) va 1C qanchalik oʻzgartirilgani taʼsir qiladi;
- **model uchun toʻlov**: sahifa yoki matn va rasm hajmi boʻyicha. Odatda bir sahifa uchun dollar emas, sentlar, lekin bu model, rasm oʻlchami va hujjatni solishtirish uchun ikki marta oʻtkazasizmi, shunga bogʻliq;
- **hosting**: ilova serveri, asl fayllar va jurnallarni saqlash;
- **qoʻllab-quvvatlash**: yangi shakllar, yangi taʼminotchilar, provayder modelni yangilaganidan keyingi qayta tekshiruv;
- **tekshiruvga ketadigan vaqt**: xodimlarning daqiqalari, ularni tejalgan vaqtdan ayirish kerak.

Muddat boʻyicha: qoidalar, tekshiruv ekrani va 1Cga yozish bilan bitta hujjat turi odatda 3–8 hafta oladi. Elektron hisobvaraq-faktura operatori bilan integratsiya, konfiguratsiyangiz uchun tayyor modul boʻlsa, ancha tezroq; qattiq oʻzgartirilgan 1Cda uzoqroq. Keyingi har bir hujjat turi birinchisidan arzonga tushadi: qabul qilish, tekshiruv va yozish allaqachon tayyor.

Endi maʼlumotlar haqida. Koʻp hujjatlarda shaxsiy maʼlumot bor: jismoniy shaxslar bilan shartnomalar (pasport, JShShIR), haydovchilarga berilgan ishonchnomalar, kadrlar hujjatlari. «Shaxsga doir maʼlumotlar toʻgʻrisida»gi qonun Oʻzbekiston fuqarolarining shaxsiy maʼlumotlarini Oʻzbekistondagi serverlarda saqlashni talab qiladi. Amalda bu shunday:

- asl fayllar, ajratib olingan maʼlumotlar va jurnallar Oʻzbekistondagi serverda saqlanadi;
- shaxsiy maʼlumotli hujjatlar tashqi modelga yuborishdan oldin anonimlashtiriladi yoki oʻz serveringizdagi modelda qayta ishlanadi. Skan bilan bu matndan qiyinroq: avval matn oʻzingizda tanib olinadi, keyin tashqi modelga pasport maʼlumotlarisiz matn ketadi;
- provayder shartlari oʻqilgan: fayllarni saqlaydimi va ularni modelni oʻqitish uchun ishlatadimi;
- tekshiruv ekraniga kirish cheklangan: ish haqi summalari yozilgan shartnomalarni omborchi koʻrmasligi kerak.

Sxemani yurist bilan kelishib olgan maʼqul. Batafsil: [Shaxsiy maʼlumotlarni Oʻzbekistonda saqlash](/blog/personal-data-in-uzbekistan/).

## Bitta hujjat turida pilot

Hamma hujjatlardan birdaniga boshlamang.

1. **Eng koʻp keladigan hujjatni tanlang.** Odatda bu bir nechta yirik taʼminotchining yuk xatlari. Shartnomalar emas: ular kam, ulardagi foyda esa daqiqalarda oʻlchanmaydi.
2. **Oʻtgan oylardan 100–200 ta haqiqiy namuna yigʻing.** Yomon rasmlar va qoʻlda tuzatilganlari ham boʻlsin, yoniga 1Cdagi toʻgʻri qiymatlarni qoʻying.
3. **«Oldin»ni oʻlchang**: hujjat kelganidan 1Cga yozilguncha necha daqiqa ketadi, keyin solishtirishda nechta xato chiqadi, qizgʻin kunlarda qancha hujjat yigʻilib qoladi.
4. **Mezonlarni oldindan yozib qoʻying**: tuzatishsiz oʻtgan hujjatlar ulushi, tekshiruv bilan birga bitta hujjatga ketadigan vaqt, oʻtkazishgacha yetib borgan xatolar soni nol.
5. **Ikki hafta soya rejimi**: tizim oqimni qayta ishlaydi, odamlar odatdagidek ishlaydi va natijalarni solishtiradi.
6. **Keyin tekshiruv ekrani orqali ish**, xuddi shu oʻlchovlar bilan.

Tekshiruv bilan birga bitta hujjatga ketadigan vaqt sezilarli qisqarmasa, daqiqalar qayerda yoʻqolayotganini qarang: yomon rasmlar, tartibsiz maʼlumotnomalar, noqulay ekran. Koʻpincha gap umuman modelda emas. Oʻzini oqlashini qanday hisoblash haqida: [Avtomatlashtirish oʻzini oqlaydimi](/blog/automation-roi/).

Qochish kerak boʻlgan xatolar:

- operatorda elektron koʻrinishda turgan hujjatni tanib olishga yuborish;
- AIga hujjatlarni 1Cda odamsiz oʻtkazishga ruxsat berish;
- arifmetikani qoidalarga emas, modelga ishonib topshirish;
- nomenklatura moslik jadvalisiz va tartibsiz maʼlumotnomalar bilan boshlash;
- qoʻlda tekshirishni hamma taʼminotchilar uchun birdaniga oʻchirish.

Jamoangiz har hafta qoʻlda qayta yozadigan hujjatlarni qilich.com saytidagi SamurAIga yozing: pilot haqidagi suhbatni shundan boshlash qulay.
