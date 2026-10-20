---
slug: maintenance-after-launch
lang: uz
title: "Ishga tushirilgandan keyin: ilova va saytni qoʻllab-quvvatlashga nima kiradi"
description: "Ilova ishga tushdi, lekin ish tugamadi. Yangilanishlar, server, xavfsizlik, doʻkon talablari va kichik oʻzgarishlar: qoʻllab-quvvatlash va uning byudjeti."
date: 2026-10-21
tags: [ilovani qoʻllab-quvvatlash, saytni qoʻllab-quvvatlash, texnik qoʻllab-quvvatlash, IT autsorsing, jarayon]
related: [mobile, web, telegram, backend]
reading_minutes: 11
---

Ilova doʻkonga chiqdi, sayt ochilyapti, bot buyurtma qabul qilyapti. Oxirgi dalolatnoma imzolandi, dasturlashga pul sarflash ortda qolgandek. Olti oydan keyin esa shanba kuni kechqurun bot birdan javob bermay qoʻyadi, Google Playdan yangi talablar haqida xat keladi, loyihani qilgan dasturchi esa boshqa ish bilan band va ikki kundan keyin javob beradi. Qoʻllab-quvvatlash oldindan kelishilmagan boʻlsa, deyarli har doim shunday boʻladi. Quyida: sayt, ilova va botni texnik qoʻllab-quvvatlashga nimalar kiradi, xatoni tuzatish yangi vazifadan nimasi bilan farq qiladi, shartnomaga qanday javob muddatlarini yozish kerak, birinchi yilga qancha ajratish kerak va kerak boʻlsa loyihani boshqa jamoa qabul qila olishi uchun nima qilish kerak.

## Hech kim tegmasa ham dastur nega eskiradi

Kod zanglamaydi, lekin uning atrofidagi hamma narsa oʻzgarib turadi:

- **Telefonlar yangilanadi.** Apple har kuzda yangi iOS chiqaradi, Google esa Androidning yangi versiyasini. Bildirishnomalar, geolokatsiya, fonda ishlash qoidalari oʻzgaradi va oʻtgan versiyada yaxshi ishlagan narsa boshqacha ishlay boshlaydi.
- **Kutubxonalarda zaifliklar topiladi.** Har qanday mahsulot oʻnlab tayyor komponentlardan yigʻiladi: tarmoq, toʻlov, xarita, maʼlumotlar bazasi uchun. Ularning mualliflari muntazam ravishda xavfsizlik tuzatishlarini chiqarib turadi. Ular oʻrnatilmasa, kamchilik sizning mahsulotingizda qoladi, oʻzingizning kodingiz qanchalik puxta boʻlmasin.
- **Tashqi servislar oʻzgaradi.** Telegram Bot API va Mini Apps uchun yangi versiyalar chiqaradi. Click, Payme va Uzum protokollari va talablarini yangilaydi, masalan fiskal chek uchun qanday maʼlumot yuborish kerakligini. 1C konfiguratsiyasi yangilangandan keyin qoldiqlar almashinuvi toʻxtab qolishi mumkin. Didox va Faktura.uz kabi elektron hisob-faktura servislari ham oʻz interfeyslarini oʻzgartiradi.
- **Maʼlumot koʻpayadi.** Ming buyurtmada bir soniyada ochilgan hisobot yuz ming buyurtmada bir daqiqa ochilishi mumkin. Bu xato emas, biznes oʻsganining belgisi.
- **Muddatlar tugaydi.** Domen, SSL sertifikat, Apple Developer Program aʼzoligi, tashqi servislarga kirish kalitlari.

Bularning deyarli hech biri na sizga, na pudratchiga bogʻliq. Bogʻliq boʻlgani boshqa narsa: oʻzgarish haqida oldindan bilasizmi yoki buyurtmasini toʻlay olmagan mijozdan eshitasizmi.

## Doʻkonlarning chetlab oʻtib boʻlmaydigan talablari

Ilovani qoʻllab-quvvatlashda bu eng oldindan koʻrinadigan qism: qoidalar oldindan eʼlon qilinadi, lekin ularni chetlab oʻtib boʻlmaydi.

**Google Play** har yili ilova moʻljallanishi kerak boʻlgan Android versiyasini (target API level) koʻtaradi. Maqola chiqqan paytda, 2026-yil oktyabrida, qoidalar quyidagicha:

- 2026-yil 31-avgustdan boshlab yangi ilovalar va yangilanishlar faqat Android 16 (API 36) uchun yigʻilgan boʻlsa qabul qilinadi;
- allaqachon chiqarilgan ilovalar kamida Android 15 (API 35) uchun yigʻilgan boʻlishi kerak, aks holda ular Androidning yangiroq versiyasi oʻrnatilgan telefonlardagi yangi foydalanuvchilarga koʻrsatilmay qoʻyadi.

Ilovani oʻrnatib boʻlganlarda u yoʻqolmaydi. Lekin yangi telefonli yangi mijoz uni qidiruvda shunchaki topmaydi. Bu oylab sezilmay qolishi mumkin boʻlgan jimgina yoʻqotish. Soʻnggi yillarda navbatdagi chegara avgust oxiriga toʻgʻri kelyapti, shuning uchun yangilash ishini yozga rejalashtirgan maʼqul.

**Apple** ilovani yangi vositalar bilan yigʻishni talab qiladi. 2026-yil 28-apreldan boshlab App Store Connectga yuklanadigan har qanday versiya Xcode 26 va iOS 26 SDK bilan yigʻilgan boʻlishi kerak. Doʻkondagi versiya ishlashda davom etadi, lekin har qanday yangilanishni, hatto bitta xatoni tuzatishni ham avval yangi vositalarga oʻtkazishga toʻgʻri keladi. Loyihada yangi Xcode bilan yigʻilmaydigan eski kutubxonalar boʻlsa, shoshilinch tuzatish bir necha kunlik ishga aylanadi.

Yana ikki narsa koʻpincha esdan chiqadi:

- **Apple Developer Program aʼzoligi** yiliga $99 turadi. Uzaytirilmasa, ilova App Storedan yoʻqoladi.
- **Maʼlumotlar haqidagi shakllar.** Google Playda bu Data safety boʻlimi, App Storeda App Privacy. Ilova yangi maʼlumot yigʻa boshlasa, jumladan ulangan analitika yoki reklama kutubxonasi orqali, ularni yangilash kerak. Ilovada akkaunt ochish mumkin boʻlsa, ikkala doʻkon ham uni oʻchirish imkoniyatini talab qiladi. Shakldagi maʼlumot bilan ilovaning haqiqiy ishlashi orasidagi farq yangilanish rad etilishining koʻp uchraydigan sababi.

Nima qilish kerak: har bir platforma uchun yiliga bir marta alohida ish rejalashtiring. Loyihani yangi SDKga oʻtkazish, kutubxonalarni yangilash, ilovani iOS va Androidning yangi versiyalarida hamda bir-ikkita arzon Android telefonda tekshirish. Ilova muntazam yangilanib tursa, bu odatda bir necha kun. Ikki yil tegilmagan boʻlsa, ish haftalarga choʻzilishi mumkin: kutubxonalar bir necha versiya oldinga ketgan, kodning bir qismini qayta yozishga toʻgʻri keladi.

## Server, domen va sertifikatlar

Eng alamli toʻxtashlar murakkab xatolar tufayli emas, unutilgan muddatlar va toʻlib qolgan disk tufayli boʻladi.

Shartli misol. Uchta filiali bor restoranning yetkazib berish boti bor, u webhook orqali ishlaydi. Juma kuni kechqurun serverdagi SSL sertifikat muddati tugaydi va Telegram botga xabarlarni yetkazishni toʻxtatadi: webhook uchun amaldagi HTTPS sertifikat kerak. Mijozlar yozyapti, bot jim, operatorlar esa bugun kech tinch ekan deb oʻylaydi. Buni shanba kuni doimiy mijoz telefon qilgandagina bilishadi. Sertifikatni avtomatik uzaytirish va bitta tashqi tekshiruv bu muammoni odamlarsiz hal qilgan boʻlardi.

Har qanday loyihada nima sozlangan boʻlishi kerak:

- **Monitoring.** Har bir necha daqiqada tashqaridan tekshiruv: sayt ochilyaptimi, ilova serveri javob beryaptimi, bot xabar qabul qilyaptimi. Biznes signallarini kuzatish ham foydali: odatda oʻnta buyurtma keladigan soatda bitta ham kelmasa, qarab koʻrish kerak.
- **Xatolarni yigʻish.** Server va ilova xato va qulashlarni jamoa koʻradigan tizimga yuboradi. Jamoa nosozlik haqida mijozdan oldin bilishi kerak.
- **Zaxira nusxalar.** Bazaning har kungi nusxasi, asosiy serverdan alohida saqlanadi. Va tekshiruv: oyda yoki chorakda bir marta nusxadan tiklab koʻriladi. Hech qachon tiklab koʻrilmagan nusxa zaxira emas, umid xolos.
- **Muddatlarni uzaytirish.** SSL sertifikatlar faqat avtomatik uzaytiriladi: 2026-yil martidan boshlab ommaviy sertifikatlar koʻpi bilan 200 kunga beriladi va bu muddat bundan keyin ham qisqaradi. Domen avtomatik uzaytiriladigan qilib, kimdir oʻqiydigan pochta bilan roʻyxatdan oʻtgan boʻlsin. iPhonega push-bildirishnomalar kalit orqali emas, sertifikat orqali yuborilsa, u bir yil amal qiladi, muddati tugagach bildirishnomalar jimgina kelmay qoʻyadi.
- **Serverni yangilash.** Operatsion tizim, maʼlumotlar bazasi, veb-server xavfsizlik tuzatishlarini oladi. Ular reja boʻyicha, avval test serverda oʻrnatiladi.
- **Disk va yuklama.** Loglar bilan toʻlib qolgan disk serverni hujum kabi toʻxtatib qoʻyadi.

Saytni qoʻllab-quvvatlashning katta qismi aynan shu: hammasi joyida boʻlganda koʻzga koʻrinmaydigan ish.

Tizimda Oʻzbekiston fuqarolarining shaxsiy maʼlumotlari saqlansa, ular turgan server Oʻzbekistonda boʻlishi kerak. Mahalliy hostinglarda tayyor boshqariladigan servislar kamroq, shuning uchun administratorlik ishi koʻproq boʻladi va buni qoʻllab-quvvatlashda hisobga olish kerak. Batafsil: [Shaxsiy maʼlumotlarni Oʻzbekistonda saqlash](/blog/personal-data-in-uzbekistan/). Minimal himoya choralari haqida: [Sayt, ilova va bot xavfsizligi](/blog/security-basics/).

Tunda ogohlantirishni kim olishini alohida hal qiling. Soat 19:00 dan keyin hech kim oʻqimaydigan umumiy chatga tushadigan ogohlantirish ishlamaydi. Pudratchi tomonida kim navbatchi boʻlishini, ogohlantirishlar qayerga kelishini (odatda Telegramdagi alohida guruh, jiddiy holatlarda qoʻngʻiroq ham) va kompaniyangizda kim muammo haqida bilishi kerakligini kelishib oling: egasi, boshqaruvchi yoki katta operator.

## Xatomi yoki yangi vazifa?

Qoʻllab-quvvatlashdagi eng koʻp uchraydigan bahs. Buyurtmachi: «Bu xato-ku, nega pul toʻlashim kerak?» Pudratchi: «Bu texnik topshiriqda yoʻq edi, bu qoʻshimcha ish». Bahs har oy takrorlanmasligi uchun mezonlarni oldindan kelishib, yozib qoʻying.

**Xato** — tizim kelishilgan va qabul qilingan narsani qilmayapti yoki oldin qilgan narsasini qilmay qoʻydi. iPhoneda toʻlov tugmasi bosilmayapti, chekdagi summa savat bilan mos kelmayapti, yangilanishdan keyin filiallar boʻyicha filtr yoʻqolib qoldi.

**Qoʻshimcha ish** — kelishilgan ishlashni oʻzgartiradigan yoki yangi narsa qoʻshadigan har qanday vazifa: yana bitta toʻlov usuli, yangi hisobot, buyurtma rasmiylashtirish qadamlarining boshqa tartibi, interfeysga uchinchi til.

**Kulrang zona**, uni shartnomadan oldin muhokama qilgan maʼqul:

- **Tashqi servislardagi oʻzgarishlar.** Telegram, toʻlov tizimi yoki 1C nimanidir oʻzgartirdi va integratsiya buzildi. Pudratchining aybi yoʻq, lekin sizni ishlamaydigan toʻlov bilan tashlab qoʻyib ham boʻlmaydi. Odatda tashqi oʻzgarishlarga moslashtirish oylik qoʻllab-quvvatlashga kiritiladi, katta qayta ishlashlar esa alohida baholanadi.
- **Yuklama oshishi.** Katta hajmdagi maʼlumotda sekin ochiladigan hisobot tezlik talablari yozilgan boʻlsa xato, yozilmagan boʻlsa qoʻshimcha ish hisoblanadi.
- **Roʻyxatda boʻlmagan qurilmalar.** Masalan, Google servislari boʻlmagan Huawei telefonlariga push-bildirishnomalar kelmayapti. Bu modellar kelishilgan qurilmalar roʻyxatida boʻlmagan boʻlsa, ularni qoʻllab-quvvatlash alohida vazifa.
- **«Noqulay».** Mijozlar tugmani topa olmayapti. Bu yaxshilash uchun sabab, dasturlash xatosi emas.

Qanday rasmiylashtirish kerak:

1. Shartnomada yoki uning ilovasida xato va qoʻshimcha ishning taʼrifi, oddiy soʻzlar bilan va bir-ikkita misol bilan.
2. Qabul qilingandan keyingi kafolat muddati, masalan uch yoki olti oy. Bu vaqtda xatolar bepul tuzatiladi va qoʻllab-quvvatlash soatlarini sarflamaydi.
3. Har bir murojaat avval uch turdan biriga ajratiladi: xato, tashqi oʻzgarish yoki qoʻshimcha ish. Qoʻshimcha ish boshlanishidan oldin soatlarda baholanadi va siz uni yozma tasdiqlaysiz.

Bu qoidalar ishlashi uchun shartnomani qanday tuzish haqida: [Qatʼiy narx yoki soatbay toʻlov](/blog/fixed-price-or-hourly/).

## Javob berish muddatlari

Hamma narsa bir xil shoshilinch emas. Odatda uchta daraja va qoʻshimcha ishlar yetarli. Quyidagi raqamlar qoʻllab-quvvatlash shartnomalarida koʻp uchraydigan moʻljallar. Sizniki bir soatlik toʻxtash sizga qanchaga tushishi va navbatchilik uchun qancha toʻlashga tayyorligingizga bogʻliq.

| Daraja | Misollar | Javob | Yechim yoki vaqtinchalik chora |
|---|---|---|---|
| Jiddiy | toʻlovlar oʻtmayapti, sayt yoki bot ishlamayapti, maʼlumot sizib chiqqan boʻlishi mumkin | 15–60 daqiqa, kelishilgan boʻlsa tunda va dam olish kunlari ham | bir necha soat ichida |
| Muhim | bitta funksiya buzilgan, lekin aylanib oʻtish yoʻli bor: hisobot chiqmayapti, operatorlarga bildirishnoma kelmayapti | ish kuni davomida | 1–2 ish kuni |
| Oddiy | matndagi xato, bitta ekranda siljib ketgan element | 1–2 ish kuni | navbatdagi rejali yangilanishda |
| Qoʻshimcha ish | yangi hisobot, formadagi yangi maydon | bir necha ish kunida baholash | kelishilgan reja boʻyicha |

Nimalarni aniqlashtirish kerak:

- **Javob tuzatish degani emas.** Javob kimdir muammoni oʻz zimmasiga oldi, koʻlamini tushundi va sizga yozdi degani. Tuzatish uzoqroq choʻzilishi mumkin, ayniqsa sabab toʻlov tizimi tomonida boʻlsa. Mobil ilovadagi tuzatish yana doʻkon tekshiruvidan oʻtadi: bir necha soatdan bir necha kungacha. Shuning uchun xavfli funksiyalarni serverdan oʻchirib qoʻyish mumkin boʻladigan qilib qilgan maʼqul.
- **Toshkent vaqti bilan ish vaqti.** Masalan, ish kunlari 9:00 dan 18:00 gacha. Yetkazib berish tungi soat ikkigacha ishlasa-yu, qoʻllab-quvvatlash kechki oltigacha boʻlsa, ish vaqtidan tashqari jiddiy darajani alohida yozish kerak. Navbatchilik uchun alohida toʻlanadi va bu adolatli.
- **Bayramlar.** Navroʻz, Ramazon hayiti, Qurbon hayiti, Mustaqillik kuni, Yangi yil. Yetkazib berish va chakana savdo uchun bular koʻpincha eng qizgʻin kunlar. Kim aloqada boʻlishini oldindan kelishib oling va bayram arafasida katta yangilanish chiqarmang.
- **Murojaatlar uchun bitta kanal.** Vazifalar trekeri yoki Telegramdagi alohida chat, jiddiy holatda esa navbatchi raqamga qoʻngʻiroq. Turli dasturchilarga shaxsiy xabarda yozilgan murojaatlar yoʻqolib ketadi.

Yaxshi murojaatda nima boʻlgani, qayerda (sayt, bot yoki ilova; telefon modeli va versiya; interfeys tili), qachon, buyurtma raqami va skrinshot boʻladi. Tafsilotsiz «bizda hech narsa ishlamayapti» bir soatlik yozishmaga aylanadi.

## Qoʻllab-quvvatlash byudjeti

Saytga xizmat koʻrsatish narxi haqida soʻrashganda, javob toʻlov modeli va ish hajmiga bogʻliq. Asosiy modellar ikkita.

**Oylik abonent toʻlovi.** Har oy soatlar paketi va kafolatlangan javob muddatlari uchun belgilangan summa. Jamoa loyihani yodda tutadi, monitoring va yangilanishlar reja boʻyicha boradi, jiddiy nosozlik smeta kelishilmasdan hal qilinadi. Kamchiligi: tinch oylarda ham toʻlaysiz. Ishlatilmagan soatlar nima boʻlishini aniqlang: keyingi oyga oʻtadimi yoki kuyib ketadimi.

**Har bir vazifa uchun toʻlov.** Faqat bajarilgan ish uchun toʻlaysiz. Deyarli oʻzgarmaydigan oddiy sayt uchun mos. Kamchiliklari: vazifalar orasida loyihani hech kim kuzatmaydi, javob muddatini hech kim kafolatlamaydi, har safar loyihaga qaytganda dasturchi hammasi qanday tuzilganini eslashdan boshlaydi, bu ham pulli soatlar.

Koʻpincha aralash variant oqilona: monitoring, yangilanishlar va jiddiy nosozliklar uchun kichik abonent paketi, qoʻshimcha ishlar esa kelishuv boʻyicha soatbay.

Rivojlantirishsiz, faqat asosiy qoʻllab-quvvatlash hajmi uchun moʻljallar:

- oddiy sayt yoki lending sahifa: oyiga bir necha soat, yangilanishlar, nusxalarni tekshirish va mayda tuzatishlar uchun;
- toʻlov, shaxsiy kabinet va admin panel bor bot yoki sayt: oyiga taxminan 8–20 soat;
- oʻz serveri va 1C bilan almashinuvi bor iOS va Android ilova: oyiga 20–40 soatdan, ustiga doʻkon talablari uchun yillik ish.

Parallel ravishda muntazam yaxshilanishlar ham kerak boʻlsa, hajm [Dasturiy taʼminotda kaizen](/blog/kaizen-in-software/) maqolasidagi raqamlarga yaqinlashadi.

Hajm quyidagi hollarda oshadi: platformalar bir nechta boʻlsa, integratsiyalar koʻp boʻlsa (har biri buzilishi mumkin boʻlgan alohida nuqta), avtomatik testlar boʻlmasa, kodni boshqa jamoa yozgan va hujjat yoʻq boʻlsa, kecha-kunduz javob kerak boʻlsa.

Jamoa soatlaridan tashqari birinchi yil byudjetiga server, maʼlumotlar bazasi va zaxira nusxalar uchun joy, domen, Apple Developer Program (yiliga $99) va Google Play (bir marta $25), kirish kodlari uchun SMS, 1C va CRM litsenziyalari, mahsulotda AI boʻlsa uning toʻlovi hamda oldindan bilib boʻlmaydigan tashqi oʻzgarishlar uchun zaxira kiradi.

Koʻp uchraydigan xatolar:

- **Birinchi oylarda qoʻllab-quvvatlashdan voz kechish.** Testlarda boʻlmagan xatolar aynan shu paytda, haqiqiy foydalanuvchilar va kam uchraydigan telefonlarda chiqadi.
- **Pudratchilarni faqat ishga tushirish narxi boʻyicha solishtirish.** Qoʻllab-quvvatlash narxini dasturlash narxi bilan birga yozma soʻrang va birinchi yil uchun umumiy summani solishtiring.
- **Yangilanishlarni «keyinga» yigʻish.** Ikki yil yangilanmagan loyiha ikki yil davomida oz-ozdan yangilab turilganidan qimmatga tushadi va bu odatda eng noqulay paytda maʼlum boʻladi.

## Bitta pudratchiga bogʻlanib qolmaslik

Yaxshi pudratchi bilan ham vaziyat oʻzgarishi mumkin: kompaniya oʻsib, kichik loyihalarni olmay qoʻyadi, narxni oshiradi, asosiy dasturchi ketib qoladi. Loyiha shunday tuzilgan boʻlishi kerakki, boshqa jamoa uni oylar emas, haftalar ichida qabul qila olsin.

Nimani tekshirish kerak:

1. **Kod sizning repozitoriyingizda.** GitHub, GitLab yoki shunga oʻxshash servisdagi akkaunt kompaniya nomida, pudratchi unda ishtirokchi sifatida ishlaydi. «Soʻrasangiz arxivini yuboramiz» emas.
2. **Akkauntlar kompaniyangiz nomida.** Apple Developer va Google Play Console tashkilot akkauntlari boʻlsin. Ikkalasi uchun ham D-U-N-S raqami kerak, uni olishga vaqt ketadi, shuning uchun oldindan boshlang. Domen, hosting, Click, Payme va Uzum kabinetlari, SMS servisi yuridik shaxsingiz nomida va xodimingizda kirish huquqi bilan boʻlsin. Bot BotFatherda dasturchining shaxsiy raqamidan emas, kompaniya nazorat qiladigan Telegram akkauntidan roʻyxatdan oʻtkazilgan boʻlsin.
3. **Parollar va kalitlar** sizda ham kirish huquqi bor parol menejerida saqlanadi. Jamoa almashganda ular oʻzgartiriladi.
4. **Hujjatlar.** Loyihani noldan qanday ishga tushirish, qanday serverlar va muhitlar bor, qanday integratsiyalar bor va ularning sozlamalari qayerda, zaxira nusxalar qanday ishlaydi, odatiy nosozliklarda nima qilish kerak. Yuz betlik roman emas, ishchi yoʻriqnoma.
5. **Kodga huquqlar.** Shartnomada kodga mutlaq huquqlar toʻlovdan keyin sizga oʻtishi yozilgan va uchinchi tomon komponentlari roʻyxati ularning litsenziyalari bilan ilova qilingan boʻlsin.
6. **Chiqish tartibi.** Shartnoma bekor qilinganda pudratchi nima qilishi shart: kirish huquqlari va hujjatlarni topshirish, ishlarni yangi jamoaga tushuntirib berish, uning savollariga kelishilgan muddat davomida javob berish.

Oddiy tekshiruv: bu loyihani yozmagan dasturchidan uni hujjatlar boʻyicha test serverda ishga tushirib berishni soʻrang. Muallifga qoʻngʻiroq qilmasdan uddalasa, hujjatlar ishlaydi.

## Qoʻllab-quvvatlash vaqtidan unumli foydalanish

Qoʻllab-quvvatlash soatlari faqat yongʻin oʻchirishga ketishi shart emas. Yapon kaizen tamoyili bu yerda juda amaliy ishlaydi: tuzatishlar kichik yaxshilanishlar bilan birga qilinadi. Dasturchi xato tufayli baribir buyurtma rasmiylashtirish kodini koʻrib chiqyaptimi, ortiqcha maydonni olib tashlash yoki sekin qadamni tezlashtirish uchun yaxshi payt. Bu oʻsha kodga uch oydan keyin alohida vazifa bilan qaytishdan arzonroq. Oy uchun oqilona taqsimot: soatlarning bir qismi rejali yangilanish va tekshiruvlarga, bir qismi tuzatishlarga, qolgani jamoa bilan birga tanlagan bir-ikkita yaxshilanishga.

Oyda bir marta pudratchi qisqa hisobot yuboradi. Unda:

- oy davomidagi nosozliklar: nima boʻldi, qancha davom etdi, sababi va takrorlanmasligi uchun nima qilindi;
- oʻrnatilgan yangilanishlar: kutubxonalar, server, doʻkonlardagi ilova versiyalari;
- zaxira nusxadan tiklash oxirgi marta qachon tekshirilgani;
- vazifalar boʻyicha sarflangan soatlar va paket qoldigʻi;
- yaqinlashib kelayotgan muddatlar: domenni uzaytirish, Google Playning navbatdagi chegarasi, Apple talablari, litsenziyalar tugashi;
- keyingi oy uchun tavsiyalar va nima uchun aynan ular.

Bunday hisobotdan nima uchun pul toʻlayotganingiz besh daqiqada koʻrinadi. Muntazam hisobot haqida batafsil: [Hōrensō: IT jamoa sizga qanday hisobot berishi kerak](/blog/horenso-reporting/).

Hozir nimalar ishlayotganini (sayt, bot, ilova, 1C va toʻlov tizimlari bilan integratsiyalar) qilich.com saytidagi SamurAIga yozing va aynan shu toʻplamni qoʻllab-quvvatlashga nimalar kirishi kerakligini soʻrang.
