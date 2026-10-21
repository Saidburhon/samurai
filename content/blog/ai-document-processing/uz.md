---
slug: ai-document-processing
lang: uz
title: "AI yordamida hujjatlarni qayta ishlash: hisobvaraq-faktura, yuk xati, shartnoma"
description: "Qogʻoz va PDF hujjatlarni qoʻlda koʻchirish shart emas: AI ularni oʻqib, maʼlumotni 1C yoki jadvalga kiritadi. Qayerda ishlaydi, qayerda tekshiruv shart."
date: 2026-10-21
tags: [AI, hujjatlar, 1C, elektron hisobvaraq-faktura, avtomatlashtirish, shaxsiy maʼlumotlar]
related: [ai, business, telegram]
reading_minutes: 7
---

AI skanerlangan, suratga olingan va PDF koʻrinishidagi yuk xatlari va hisob-fakturalarni oʻqib, maydonlarni 1C yoki jadvalga kirita oladi, agar har bir qiymat arifmetik va maʼlumotnoma tekshiruvlaridan oʻtsa va belgilangan maydonlarni inson tasdiqlasa. Didox yoki Faktura.uz orqali keladigan elektron hisob-fakturalar allaqachon maʼlumot, ular uchun AI emas, integratsiya kerak. Eng koʻp keladigan bitta hujjat turi va 100–200 ta haqiqiy namuna bilan pilotdan boshlang.

Buxgalteriyaga har kuni bir dasta hujjat keladi: taʼminotchilarning yuk xatlari, hisobvaraqlar, dalolatnomalar, ishonchnomalar, shartnomalar. Bir qismi Didoxda turibdi, bir qismini Telegramga PDF qilib tashlashgan, yana bir qismini haydovchi qogʻozda olib kelgan: gʻijimlangan, raqamlar ustidan muhr bosilgan. Kimdir ularni birma-bir ochib, taʼminotchi, STIR, tovarlar, miqdor va summalarni 1Cga koʻchiradi. Ish sekin va zerikarli, xatolar esa bir oydan keyin, taʼminotchi bilan hisob-kitoblar solishtirilganda yuzaga chiqadi. Oʻqish va koʻchirish ishini AI oʻz zimmasiga olishi mumkin, lekin hamma hujjatda emas va tekshiruvsiz emas. Quyida shular haqida: qaysi hujjatlarni AIga berish kerak, rasmdan 1Cdagi yozuvgacha boʻlgan yoʻl qanday quriladi va qayerda odamsiz ish bitmaydi.

## Qaysi hujjatlar allaqachon tayyor maʼlumot

Avval oddiy roʻyxat tuzing: nima keladi, qanday koʻrinishda va oyiga nechta. Koʻpincha kiruvchi hujjatlarning sezilarli qismi allaqachon elektron ekani maʼlum boʻladi.

Taʼminotchi Didox, Faktura.uz yoki boshqa operator orqali yuborgan elektron hisobvaraq-faktura rasm emas. Bu E-IMZO elektron raqamli imzosi bilan imzolangan tuzilmalangan maʼlumot: STIR, tovarlar, miqdor, narx va QQS unda allaqachon alohida maydonlarda turadi. Uni AI orqali oʻtkazish ekrandagi matnni qayta terish uchun ekranni suratga olishga oʻxshaydi. Toʻgʻri yoʻl — integratsiya: hujjatlar operatordan API yoki tayyor modul orqali olinadi va 1Cga kirim hujjati qoralamasi boʻlib tushadi. Operatorlarda 1C uchun tayyor yechimlar uchraydi; konfiguratsiyangiz jiddiy oʻzgartirilgan boʻlsa, alohida integratsiya kerak boʻladi. 1C bilan bogʻlash haqida batafsil: [Sayt, ilova va Telegram-botni 1C bilan bogʻlash](/blog/1c-integration/).

Operatorlar orqali faqat hisobvaraq-fakturalar almashilmaydi, shuning uchun yirik taʼminotchilardan yana qaysi hujjatlarni elektron yubora olishini soʻrang. Koʻp uchraydigan xatodan ham ehtiyot boʻling: taʼminotchi operatorda allaqachon turgan hisobvaraq-fakturaning PDF nusxasini Telegramga ham tashlaydi, ofisda esa shu PDFni tanib olishga yuborishadi.

| Hujjat | Odatda qanday keladi | Nima qilish kerak |
|---|---|---|
| Elektron hisobvaraq-faktura | Didox, Faktura.uz va boshqa operatorlar orqali | Operator bilan integratsiya, AI kerak emas |
| Bank koʻchirmasi | Bank-mijoz tizimidan yuklab olinadi | 1C bilan standart almashinuv |
| Taʼminotchining narxlar roʻyxati | Excel, baʼzan PDF | Excel — ustunlar shabloni boʻyicha oʻqish; PDF va yangi shakllar — AI |
| Qogʻozdagi yuk xati, dalolatnoma | Rasm, skan | AI, tekshiruv qoidalari, odam |
| Shartnoma | PDF, skan, Word | AI qisqacha mazmunini tayyorlaydi, qarorni odam qabul qiladi |

## AI qayerda yordam beradi: skan, rasm va PDF

Qolgani — rasm yoki tuzilmasiz fayl koʻrinishida keladigan hamma narsa. Masalan, bir qurilish kompaniyasini olaylik: obyektlarga har kuni sement, armatura, gʻisht olib kelinadi, har bir yuk bilan yuk xati keladi, har bir taʼminotchining shakli oʻziniki. Ilgari har bir shakl uchun alohida tanib olish shabloni sozlanardi, shakl biroz oʻzgarsa, shablon buzilardi. Hozirgi modellar hujjatni maʼnosiga qarab oʻqiydi: shaklni birinchi marta koʻrsa ham, odatda taʼminotchi, raqam, sana, tovarlar jadvali va jami summani topa oladi.

Yaxshi oʻqiladi:

- PDF va tiniq skanlardagi bosma matn va jadvallar;
- rekvizitlar, sanalar, raqamlar, summalar;
- oʻzbekcha va ruscha hujjatlar, lotin va kirill yozuvida. Oʻz namunalaringizda sinab koʻring: oʻzbek tilida modellarning sifati bir-biridan sezilarli farq qiladi.

Yomonroq oʻqiladi:

- qoʻlda yozilgan belgilar, masalan bosma «50» ustiga yozilgan «48 ta qabul qilindi»;
- raqamlar ustidagi muhr yoki imzo;
- qiyshiq yoki soyada olingan surat, gʻijimlangan qogʻoz;
- ikkinchi sahifaga oʻtib ketadigan jadvallar, ayniqsa ikkinchi sahifani suratga olish esdan chiqqan boʻlsa.

Qoʻlda yozilgan narsa xatolarning asosiy manbai. Omborchi yoki prorab haqiqatda qabul qilingan miqdorni qoʻlda yozsa, model uni qanchalik ishonch bilan oʻqimasin, bu maydon har doim odam tasdigʻiga ketishi kerak.

## Rasmdan yozuvgacha

Hujjatning yoʻli besh qadamdan iborat. Har birini soddaroq yoki murakkabroq qilish mumkin, lekin birortasini ham tashlab ketib boʻlmaydi.

1. **Qabul qilish.** Omborchi yoki haydovchi yuk xatini telefonda suratga olib, Telegram-botga yuboradi; taʼminotchilar hujjatlarni shu ish uchun ochilgan alohida pochta manziliga joʻnatadi; ofisdagi skaner fayllarni papkaga tashlaydi. Bot rasm sifatini darhol tekshiradi: surat xira yoki chala tushgan boʻlsa, haydovchi hali omborda ekanida qayta suratga olishni soʻraydi.
2. **Ajratib olish.** Model hujjatni oʻqiydi va maydonlarni qatʼiy tuzilmada qaytaradi: taʼminotchi, STIR, raqam va sana, tovarlar (nomi, miqdori, oʻlchov birligi, narxi, summasi), QQS, jami. Har bir maydonga ishonch darajasi ham biriktiriladi.
3. **Tekshirish.** Mexanik qoidalarni AI emas, oddiy dastur tekshiradi. Ular haqida keyingi boʻlimda.
4. **Koʻrib chiqish.** Hammasi mos kelgan hujjatni odam tez koʻzdan kechiradi. Biror narsa mos kelmasa, belgilangan maydonlarni tuzatadi.
5. **Yozish.** Tasdiqlangan hujjat HTTP-servis yoki OData orqali 1Cga yuboriladi va u yerda oʻtkazilmagan kirim hujjati boʻlib turadi; jadval bilan ishlasangiz, jadvalga yangi qator qoʻshiladi. Hujjatni buxgalterning oʻzi oʻtkazadi. Asl fayl yozuv yonida saqlanadi va bir bosishda ochiladi.

AI hujjatni oʻzi oʻtkazmasligi kerak. Buxgalter bitta tugma bilan oʻtkazadigan qoralama avtomatik oʻtkazish bilan deyarli bir xil vaqtni tejaydi, lekin xato toʻgʻridan-toʻgʻri buxgalteriya hisobi va hisobotlarga kirib ketmaydi.

Alohida masala — nomenklatura. Taʼminotchining hujjatida «Armatura A500 d12» deb yozilgan, sizning 1Cingizda esa xuddi shu tovar boshqacha nomlangan. Bu moslik jadvali bilan hal qilinadi: birinchi marta odam 1Cdagi pozitsiyani tanlaydi, keyin tizim «taʼminotchi + uning hujjatidagi nom» juftligini eslab qoladi. AI mos pozitsiyani taklif qilishi mumkin, lekin jadvalga odam tanlagani yoziladi. Doimiy taʼminotchilar odatda bir xil tovarlarni olib keladi, shuning uchun bir necha haftadan keyin ularning aksariyat pozitsiyalari avtomatik moslanadi.

## Xatolarni ushlaydigan tekshiruvlar

Model «8»ni ishonch bilan «3» deb oʻqishi yoki bitta qatorni tushirib qoldirishi mumkin. Shuning uchun ajratib olingan har bir qiymat oddiy kodda yozilgan qoidalardan oʻtadi:

- **arifmetika**: miqdor × narx = qator summasi, qatorlar yigʻindisi = jami, QQS stavka boʻyicha qayta hisoblanadi;
- **STIR**: formati toʻgʻri (tashkilotda toʻqqiz raqam) va shu STIRli kontragent maʼlumotnomada bor. Yangi STIR har doim odamga ketadi;
- **nomenklatura**: har bir pozitsiya nomenklatura maʼlumotnomangizdagi tovar bilan moslangan;
- **buyurtma**: tovarlar, miqdor va narxlar taʼminotchiga berilgan buyurtmaga mos keladi, belgilangan chegaradan katta farq ajratib koʻrsatiladi;
- **dublikatlar**: shu taʼminotchi, raqam va sana bilan hujjat avval kiritilgan boʻlsa, u ikkinchi marta kiritilmaydi. Bitta yuk xatini ham rasm, ham PDF qilib yuborishganda bu tez-tez uchraydi;
- **sanalar**: sana kelajakda emas va yopilgan davrga tushmaydi;
- **modelning ishonchi**: ishonch darajasi past maydonlar arifmetika mos kelsa ham ajratib koʻrsatiladi. Bu baho taxminiy, shuning uchun u qoidalarni toʻldiradi, oʻrnini bosmaydi.

Sxemani ishonchli qiladigan narsa aynan qoidalar. Modelni boshqasiga almashtirish mumkin, qoidalar esa qoladi va xatolarni ushlashda davom etadi.

## Odam tekshiruvi — sxemaning bir qismi

Koʻrib chiqishni keyin olib tashlanadigan vaqtinchalik yechim deb oʻylamang. Uni asosiy ish ekrani sifatida loyihalash kerak:

- chapda hujjat rasmi, oʻngda maydonlar; maydonni bossangiz, rasmda u qayerdan olingani koʻrinadi;
- belgilangan maydonlar tepada, sababi bilan: «qatorlar yigʻindisi jamiga teng emas», «yangi taʼminotchi», «qoʻlda yozilgan tuzatish»;
- maydonni tuzatish va hujjatni tasdiqlash klaviaturadan, ortiqcha oynalarsiz;
- har bir tuzatish saqlanadi va ulardan qaysi taʼminotchilarda va qaysi maydonlarda xato koʻpligi koʻrinadi.

Qoʻlda tekshirish hajmi asta-sekin va maʼlumotlarga tayanib kamaytiriladi. Muayyan taʼminotchi va hujjat turi boʻyicha bir necha hafta tuzatish boʻlmagan boʻlsa, barcha qoidalardan oʻtgan shunday hujjatlarni avtomatik tasdiqlash mumkin. Tanlab nazorat baribir qoladi: masalan, har yigirmanchi hujjatni odam koʻradi. Yangi taʼminotchilar, yangi shakllar va qoidalardan oʻtmagan hamma narsa avvalgidek odamga boradi.

Navbatga kim javob berishini oldindan hal qiling. Tekshiruvdagi hujjatlar bir hafta yigʻilib qolsa, eski kechikishning oʻzi qaytadi, faqat boshqa oynada.

## Shartnomalar: qaror emas, qisqa bayon

Shartnomada vazifa boshqa. Undan qatorma-qator koʻchiriladigan narsa yoʻq, lekin uni oʻqib chiqish va muhim joyni oʻtkazib yubormaslik kerak. Qisqa bayonni AI yaxshi tayyorlaydi:

- tomonlar, predmet, summa, valyuta, toʻlov tartibi;
- muddatlar: yetkazib berish, toʻlov, shartnomaning amal qilish muddati, avtomatik uzaytirish;
- jarima va penyalar, shartnomani bekor qilish shartlari, nizolar qaysi sudda koʻriladi;
- sizning namunaviy shartnomangizdan farq qiladigan bandlar va unda umuman yoʻq bandlar.

Bizning sharoitda foydali holat: ikki tilda, ikki ustunda yozilgan shartnoma. AI oʻzbekcha va ruscha matn summa, muddat yoki tomonlarning majburiyatlarida farq qiladigan joylarni belgilab berishi mumkin. Koʻz bilan oʻqiganda bunday farq osongina eʼtibordan chetda qoladi.

Lekin qisqa bayon yurist yoki rahbar uchun yordam, huquqiy xulosa emas. Model bandni tushirib qoldirishi yoki ilovaga havolani notoʻgʻri tushunishi mumkin. Imzolash yoki imzolamaslikni shartnomani toʻliq oʻqigan odam hal qiladi. Yana bir amaliy foyda muddatlarda: bayondagi sanalar kalendarga yoki Telegramdagi eslatmaga tushadi va shartnoma muddati tugashi sizga kutilmagan yangilik boʻlmaydi.

## Xarajatlar va maʼlumotlar himoyasi

Narx nimalardan yigʻiladi:

- **ishlab chiqish**: hujjatlarni qabul qilish, ajratib olish, qoidalar, tekshiruv ekrani, 1Cga yozish. Muddat va narxga eng koʻp hujjat turlari soni, maʼlumotnomalar holati (kontragent va nomenklatura dublikatlarini tozalashga toʻgʻri keladi) va 1C qanchalik oʻzgartirilgani taʼsir qiladi;
- **model uchun toʻlov**: sahifa yoki matn va rasm hajmi boʻyicha. Odatda bu bir sahifa uchun dollar emas, sentlar, lekin aniq narx modelga, rasm oʻlchamiga va hujjatni tekshirish uchun ikki marta oʻtkazasizmi yoki yoʻqmi, shunga bogʻliq;
- **hosting**: ilova serveri, asl fayllar va jurnallarni saqlash;
- **qoʻllab-quvvatlash**: yangi shakllar, yangi taʼminotchilar, provayder modelni yangilaganidan keyingi qayta tekshiruv;
- **tekshiruvga ketadigan vaqt**: xodimlarning daqiqalari, ularni tejalgan vaqtdan ayirish kerak.

Muddat boʻyicha: qoidalar, tekshiruv ekrani va 1Cga yozish bilan birinchi bosqich (bittadan uchtagacha hujjat turi) odatda 5–8 hafta oladi. Elektron hisobvaraq-faktura operatori bilan integratsiya, konfiguratsiyangiz uchun tayyor modul boʻlsa, ancha tezroq; jiddiy oʻzgartirilgan 1Cda uzoqroq. Keyingi har bir hujjat turi birinchisidan arzonga tushadi: qabul qilish, tekshiruv ekrani va 1Cga yozish allaqachon tayyor.

Endi maʼlumotlar haqida. Koʻp hujjatlarda shaxsiy maʼlumot bor: jismoniy shaxslar bilan shartnomalar (pasport maʼlumotlari, JShShIR), haydovchilarga berilgan ishonchnomalar, kadrlar hujjatlari. «Shaxsga doir maʼlumotlar toʻgʻrisida»gi qonun Oʻzbekiston fuqarolarining shaxsiy maʼlumotlarini Oʻzbekiston hududidagi serverlarda saqlashni talab qiladi. Amalda bu shunday:

- asl fayllar, ajratib olingan maʼlumotlar va jurnallar Oʻzbekistondagi serverda saqlanadi;
- shaxsiy maʼlumot bor hujjatlar tashqi modelga yuborilishidan oldin anonimlashtiriladi yoki oʻz serveringizdagi modelda qayta ishlanadi. Skanda buni qilish matndan qiyinroq: avval matn oʻz serveringizda tanib olinadi, soʻng tashqi modelga pasport maʼlumotlari olib tashlangan matn ketadi;
- AI provayderining shartlari oʻqib chiqilgan: u fayllarni saqlaydimi va ulardan modelni oʻqitishda foydalanadimi;
- tekshiruv ekraniga kirish cheklangan: ish haqi summalari yozilgan shartnomalarni omborchi koʻrmasligi kerak.

Sxemani yurist bilan kelishib olgan maʼqul: maʼlumotlarni chet elga uzatishni qonun alohida tartibga soladi. Batafsil: [Shaxsiy maʼlumotlarni Oʻzbekistonda saqlash](/blog/personal-data-in-uzbekistan/).

## Bitta hujjat turi bilan pilot

Birdaniga hamma hujjatlardan boshlamang.

1. **Eng koʻp keladigan hujjatni tanlang.** Odatda bu bir nechta yirik taʼminotchining yuk xatlari. Shartnomalar emas: ular kam, ulardagi foyda esa daqiqalarda oʻlchanmaydi.
2. **Oʻtgan oylardan 100–200 ta haqiqiy namuna yigʻing.** Yomon rasmlar va qoʻlda tuzatilganlari ham boʻlsin, yoniga 1Cdagi toʻgʻri qiymatlarni qoʻying.
3. **«Oldin»gi holatni oʻlchang**: hujjat kelganidan 1Cga yozilguncha necha daqiqa ketadi, keyin solishtirishda nechta xato chiqadi, qizgʻin kunlarda qancha hujjat yigʻilib qoladi.
4. **Mezonlarni oldindan yozib qoʻying**: tuzatishsiz oʻtgan hujjatlar ulushi, tekshiruv bilan birga bitta hujjatga ketadigan vaqt va oʻtkazilgan hujjatlarga yetib borgan xatolar soni: nol.
5. **Ikki hafta soya rejimida ishlating**: tizim real oqimni qayta ishlaydi, xodimlar esa odatdagidek ishlab, natijalarni solishtiradi.
6. **Keyin tekshiruv ekrani orqali ishlashga oʻting**, xuddi shu oʻlchovlar bilan.

Tekshiruv bilan birga bitta hujjatga ketadigan vaqt sezilarli qisqarmasa, daqiqalar qayerda yoʻqolayotganini qarang: yomon rasmlar, tartibsiz maʼlumotnomalar, noqulay ekran. Koʻpincha gap umuman modelda emas. Oʻzini oqlash muddatini qanday hisoblash haqida: [Avtomatlashtirish oʻzini oqlaydimi](/blog/automation-roi/).

Qochish kerak boʻlgan xatolar:

- operatorda elektron koʻrinishda turgan hujjatni tanib olishga yuborish;
- AIga hujjatlarni 1Cda odamsiz oʻtkazishga ruxsat berish;
- arifmetikani qoidalarga emas, modelga ishonib topshirish;
- nomenklatura moslik jadvalisiz va tartibsiz maʼlumotnomalar bilan boshlash;
- qoʻlda tekshirishni hamma taʼminotchilar uchun birdaniga oʻchirish.

Jamoangiz har hafta qaysi hujjatlarni qoʻlda qayta terishini qilich.com saytidagi SamurAIga yozing: pilot haqidagi suhbatni shundan boshlash qulay.
