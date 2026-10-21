---
slug: maintenance-after-launch
lang: uz
title: "Ishga tushirgach: ilova va saytni qoʻllab-quvvatlashga nimalar kiradi"
description: "Ilova ishga tushdi, lekin ish tugamadi. Yangilanishlar, server, xavfsizlik, doʻkon talablari va kichik oʻzgarishlar: qoʻllab-quvvatlash va uning byudjeti."
date: 2026-10-21
tags: [ilovani qoʻllab-quvvatlash, saytni qoʻllab-quvvatlash, texnik qoʻllab-quvvatlash, IT autsorsing, jarayon]
related: [sup-sla, cloud-devops, cloud-backup-dr, sup-app-store]
reading_minutes: 11
---

Ishga tushirilgandan keyin ilova yoki sayt hech narsa qoʻshilmasa ham muntazam parvarish talab qiladi: iOS va Androidning yangi versiyalari hamda doʻkonlarning har yilgi talablari uchun yangilanishlar, server, domen va sertifikatlarni uzaytirish, xavfsizlik yangilanishlari, zaxira nusxalar va xatolarni tuzatish. Buning byudjeti kafolatlangan javob vaqti bilan oylik abonement yoki har bir vazifa uchun toʻlov sifatida rejalashtiriladi; koʻpincha monitoring va jiddiy nosozliklar uchun kichik abonement va soatbay oʻzgartirishlar eng yaxshi ishlaydi. Nima xato, nima yangi funksiya ekanini oldindan kelishib oling, kod va akkauntlarni esa boshqa jamoa qabul qila olishi uchun oʻz nomingizda saqlang.

Ilova doʻkonga chiqdi, sayt ochilyapti, bot buyurtma qabul qilyapti. Qabul qilish dalolatnomasi imzolandi va dasturlash xarajatlari ortda qolgandek tuyuladi. Olti oydan keyin esa shanba kuni kechqurun bot birdan javob bermay qoʻyadi, Google Playdan yangi talablar haqida xat keladi, loyihani qilgan dasturchi esa boshqa ish bilan band va ikki kundan keyin javob beradi. Qoʻllab-quvvatlash oldindan kelishilmagan loyihalarda bu odatiy holat. Quyida sayt, ilova va botni texnik qoʻllab-quvvatlashga nimalar kirishi, xatoni tuzatish yangi vazifadan qanday farq qilishi, shartnomaga qanday javob muddatlarini yozish, birinchi yilga qancha pul ajratish va zarurat boʻlsa loyihani boshqa jamoa qabul qila olishi uchun nimalarni oldindan qilib qoʻyish haqida soʻz boradi.

## Hech kim tegmasa ham dastur nega eskiradi

Kod zanglamaydi, lekin uning atrofidagi hamma narsa oʻzgarib turadi:

- **Telefonlar yangilanadi.** Apple har kuzda iOSning, Google esa har yili Androidning yangi versiyasini chiqaradi. Bildirishnomalar, geolokatsiya va fonda ishlash qoidalari oʻzgaradi, oʻtgan versiyada muammosiz ishlagan funksiya esa endi boshqacha ishlashi mumkin.
- **Kutubxonalarda zaifliklar topiladi.** Ilova yoki sayt odatda oʻnlab tayyor komponentlardan yigʻiladi: tarmoq, toʻlov, xarita, maʼlumotlar bazasi bilan ishlash uchun. Ularning mualliflari muntazam ravishda xavfsizlik tuzatishlarini chiqarib turadi. Tuzatishlar oʻrnatilmasa, zaiflik sizning mahsulotingizda qoladi, oʻz kodingiz qanchalik puxta boʻlmasin.
- **Tashqi servislar oʻzgaradi.** Telegram Bot API va Mini Appsning yangi versiyalarini chiqaradi. Click, Payme va Uzum oʻz protokollari va talablarini yangilab turadi, masalan, fiskal chek uchun qanday maʼlumot yuborilishi kerakligini. 1C konfiguratsiyasi yangilangach, ombor qoldiqlari almashinuvi toʻxtab qolishi mumkin. Didox va Faktura.uz kabi elektron hisob-faktura servislari ham oʻz interfeyslarini oʻzgartiradi.
- **Maʼlumot koʻpayadi.** Ming buyurtma boʻlganda bir soniyada ochilgan hisobot yuz ming buyurtmada bir daqiqa ochilishi mumkin. Odatda bu xato emas, biznes oʻsganining belgisi.
- **Muddatlar tugaydi.** Domen, SSL sertifikatlar, Apple Developer Program aʼzoligi, tashqi servislarning kirish kalitlari.

Bularning deyarli hech biri na sizga, na pudratchiga bogʻliq. Sizga bogʻliq narsa boshqa: oʻzgarish haqida oldindan bilasizmi yoki buyurtmasi uchun pul toʻlay olmagan mijozdan eshitasizmi.

## Doʻkonlarning chetlab oʻtib boʻlmaydigan talablari

Ilovani qoʻllab-quvvatlashning eng oldindan maʼlum qismi shu: qoidalar oldindan eʼlon qilinadi, faqat ularni chetlab oʻtishning iloji yoʻq.

**Google Play** har yili ilovalar moʻljallanishi shart boʻlgan Android versiyasini (target API level) koʻtaradi. Maqola chiqqan paytda, 2026-yil oktyabrida, qoidalar quyidagicha:

- 2026-yil 31-avgustdan boshlab yangi ilovalar va yangilanishlar faqat Android 16 (API 36) yoki undan yangi versiya uchun yigʻilgan boʻlsa qabul qilinadi;
- doʻkonda turgan ilovalar kamida Android 15 (API 35) uchun yigʻilgan boʻlishi kerak, aks holda ular Androidning yangiroq versiyasi oʻrnatilgan telefonlardagi yangi foydalanuvchilarga koʻrsatilmay qoʻyadi.

Ilovani allaqachon oʻrnatganlarda u qoladi. Lekin yangi telefon olgan yangi mijoz uni qidiruvda shunchaki topa olmaydi. Bunday yoʻqotish shovqinsiz boʻladi va oylab sezilmasligi mumkin. Soʻnggi yillarda navbatdagi muddat avgust oxiriga toʻgʻri kelyapti, shuning uchun yangilash ishini yozga rejalashtirgan maʼqul.

**Apple** ilovalarni yangi vositalar bilan yigʻishni talab qiladi. 2026-yil 28-apreldan boshlab App Store Connectga yuklanadigan har qanday versiya Xcode 26 va iOS 26 SDK bilan yigʻilgan boʻlishi kerak. Doʻkondagi versiya ishlashda davom etadi, lekin har qanday yangilanishni, hatto bitta xatoni tuzatishni ham avval yangi vositalarga oʻtkazishga toʻgʻri keladi. Loyihada yangi Xcode bilan yigʻilmaydigan eski kutubxonalar boʻlsa, shoshilinch tuzatish bir necha kunlik ishga aylanadi.

Yana ikki narsa koʻpincha esdan chiqadi:

- **Apple Developer Program aʼzoligi** yiliga $99 turadi. Uzaytirilmasa, ilova App Storedan yoʻqoladi.
- **Maʼlumotlar haqidagi shakllar.** Google Playda bu Data safety boʻlimi, App Storeda App Privacy. Ilova yangi turdagi maʼlumot yigʻa boshlasa (jumladan, qoʻshilgan analitika yoki reklama kutubxonasi orqali), bu shakllarni yangilash kerak. Ilovada akkaunt ochish mumkin boʻlsa, ikkala doʻkon ham foydalanuvchi uni oʻchira olishini talab qiladi. Shaklda yozilgan bilan ilova amalda qiladigan ish oʻrtasidagi nomuvofiqlik yangilanish rad etilishining koʻp uchraydigan sabablaridan biri.

Nima qilish kerak. Har bir platforma uchun yiliga bir marta alohida ish rejalashtiring: loyihani yangi SDKga oʻtkazish, kutubxonalarni yangilash, ilovani iOS va Androidning yangi versiyalarida hamda bir-ikkita arzon Android telefonda tekshirish. Ilova muntazam yangilanib tursa, bunga odatda bir necha kun ketadi. Ikki yil davomida unga hech kim tegmagan boʻlsa, ish haftalarga choʻzilishi mumkin: kutubxonalar bir necha versiya oldinga ketgan boʻladi va kodning bir qismini qayta yozishga toʻgʻri keladi.

## Server, domen va sertifikatlar

Eng alamli toʻxtab qolishlar murakkab xatolardan emas, unutilgan muddatlar va toʻlib qolgan diskdan boʻladi.

Shartli misol. Uchta filialli restoranning yetkazib berish boti webhook orqali ishlaydi. Juma kuni kechqurun serverdagi SSL sertifikatning muddati tugaydi va Telegram botga xabarlarni yetkazmay qoʻyadi, chunki webhook amaldagi HTTPS sertifikatsiz ishlamaydi. Mijozlar yozyapti, bot jim, operatorlar esa bugun kechqurun ish kam ekan, deb oʻylaydi. Nima boʻlganini faqat shanba kuni doimiy mijozlardan biri qoʻngʻiroq qilganda bilishadi. Sertifikatning avtomatik uzaytirilishi va bitta tashqi tekshiruv bu holatning oldini olgan boʻlardi.

Har qanday loyihada nimalar sozlangan boʻlishi kerak:

- **Monitoring.** Har bir necha daqiqada tashqaridan tekshirish: sayt ochilyaptimi, ilova serveri javob beryaptimi, bot xabar qabul qilyaptimi. Biznes koʻrsatkichlarini kuzatish ham foydali: odatda oʻnta buyurtma keladigan soatda birorta ham kelmasa, sababini tekshirish kerak.
- **Xatolarni yigʻish.** Server va ilova xatolar hamda ilovaning kutilmaganda yopilib qolishi haqida jamoa kuzatadigan tizimga xabar yuboradi. Jamoa nosozlik haqida mijozdan oldin bilishi kerak.
- **Zaxira nusxalar.** Maʼlumotlar bazasining har kuni olinadigan nusxasi asosiy serverdan alohida joyda saqlanadi. Va tekshiruv: oyda yoki chorakda bir marta maʼlumotlar shu nusxadan tiklab koʻriladi. Hech qachon tiklab koʻrilmagan nusxa zaxira emas, shunchaki umid.
- **Muddatlarni uzaytirish.** SSL sertifikatlar faqat avtomatik uzaytirilishi kerak: 2026-yil martidan boshlab ommaviy sertifikatlar koʻpi bilan 200 kunga beriladi, keyingi yillarda bu muddat yana qisqaradi. Domen avtomatik uzaytirilishi va kimdir muntazam oʻqiydigan pochtaga bogʻlangan boʻlishi kerak. iPhonega push-bildirishnomalar kalit orqali emas, sertifikat orqali yuborilsa, bu sertifikat bir yil amal qiladi va muddati tugagach bildirishnomalar hech qanday ogohlantirishsiz kelmay qoʻyadi.
- **Serverni yangilash.** Operatsion tizim, maʼlumotlar bazasi va veb-server uchun xavfsizlik tuzatishlari chiqib turadi. Ular reja asosida, avval test serverda oʻrnatiladi.
- **Disk va yuklama.** Disk joyi va server yuklamasi ham kuzatiladi: loglar bilan toʻlib qolgan disk serverni xuddi hujumdek toʻxtatib qoʻyadi.

Saytni qoʻllab-quvvatlashning katta qismi aynan shu: hammasi joyida boʻlganda koʻzga koʻrinmaydigan ish.

Tizimda Oʻzbekiston fuqarolarining shaxsiy maʼlumotlari saqlansa, ular turgan server Oʻzbekistonda boʻlishi kerak. Mahalliy hosting provayderlarida tayyor boshqariladigan servislar kamroq, shuning uchun serverni administratorlash ishi koʻpincha koʻproq boʻladi va buni qoʻllab-quvvatlash rejasida hisobga olish kerak. Batafsil: [Shaxsiy maʼlumotlarni Oʻzbekistonda saqlash](/blog/personal-data-in-uzbekistan/). Minimal himoya choralari haqida: [Sayt, ilova va bot xavfsizligi](/blog/security-basics/).

Tunda ogohlantirishni kim olishini alohida hal qiling. Soat 19:00 dan keyin hech kim oʻqimaydigan umumiy chatga tushadigan ogohlantirish ishlamaydi. Pudratchi tomonida kim navbatchi boʻlishini, ogohlantirishlar qayerga kelishini (odatda Telegramdagi alohida guruh, jiddiy holatlarda qoʻngʻiroq ham) va kompaniyangizda muammo haqida kim bilishi kerakligini kelishib oling: egasi, boshqaruvchi yoki katta operator.

## Xatomi yoki yangi vazifa?

Qoʻllab-quvvatlashda eng koʻp chiqadigan bahs. Buyurtmachi: «Bu xato-ku, nega pul toʻlashim kerak?» Pudratchi: «Bu texnik topshiriqda yoʻq edi, bu qoʻshimcha ish». Bahs har oy takrorlanmasligi uchun mezonlarni oldindan kelishib, yozib qoʻying.

**Xato** — tizim kelishib qabul qilingan ishni bajarmasa yoki ilgari bajargan ishini bajarmay qoʻysa. Masalan, iPhoneda toʻlov tugmasi bosilmayapti, chekdagi summa savat bilan mos kelmayapti, yangilanishdan keyin filiallar boʻyicha filtr yoʻqolib qoldi.

**Qoʻshimcha ish** — kelishilgan ishlash tartibini oʻzgartiradigan yoki yangi imkoniyat qoʻshadigan har qanday vazifa: yana bitta toʻlov usuli, yangi hisobot, buyurtma rasmiylashtirish qadamlarining boshqa tartibi, interfeysga uchinchi til.

**Kulrang zona** — buni shartnoma imzolanishidan oldin muhokama qilgan maʼqul:

- **Tashqi servislardagi oʻzgarishlar.** Telegram, toʻlov tizimi yoki 1C nimanidir oʻzgartirdi va integratsiya buzildi. Pudratchining aybi yoʻq, lekin sizni ishlamaydigan toʻlov bilan tashlab qoʻyib ham boʻlmaydi. Odatda tashqi oʻzgarishlarga moslashtirish oylik qoʻllab-quvvatlashga kiritiladi, katta oʻzgartirishlar esa alohida baholanadi.
- **Yuklama oshishi.** Katta hajmdagi maʼlumotda sekin ochiladigan hisobot tezlik talablari yozilgan boʻlsa xato, yozilmagan boʻlsa qoʻshimcha ish hisoblanadi.
- **Roʻyxatda boʻlmagan qurilmalar.** Masalan, Google servislari boʻlmagan Huawei telefonlariga push-bildirishnomalar kelmayapti. Bu modellar kelishilgan qurilmalar roʻyxatida boʻlmagan boʻlsa, ularni qoʻllab-quvvatlash alohida vazifa.
- **«Noqulay».** Mijozlar tugmani topa olmayapti. Bu yaxshilash uchun sabab, dasturlash xatosi emas.

Qanday rasmiylashtirish kerak:

1. Shartnomada yoki unga ilovada xato va qoʻshimcha ishning oddiy soʻzlar bilan yozilgan taʼrifi va bir-ikkita misol.
2. Qabul qilingandan keyingi kafolat muddati, masalan, uch yoki olti oy. Bu davrda xatolar bepul tuzatiladi va qoʻllab-quvvatlash soatlari hisobidan ketmaydi.
3. Har bir murojaat avval uch turdan biriga ajratiladi: xato, tashqi oʻzgarish yoki qoʻshimcha ish. Qoʻshimcha ish boshlanishidan oldin soatlarda baholanadi va siz uni yozma ravishda tasdiqlaysiz.

Bu qoidalar ishlashi uchun shartnomani qanday tuzish kerakligi haqida: [Qatʼiy narx yoki soatbay toʻlov](/blog/fixed-price-or-hourly/).

## Javob berish muddatlari

Hamma muammo bir xil darajada shoshilinch emas. Odatda uchta daraja va qoʻshimcha ishlar uchun alohida qator yetarli. Quyidagi raqamlar kelishuvni boshlash uchun moʻljal. Sizga mos raqamlar bir soatlik toʻxtab qolish sizga qanchaga tushishi va navbatchilik uchun qancha toʻlashga tayyorligingizga bogʻliq.

| Daraja | Misollar | Javob | Yechim yoki vaqtinchalik chora |
|---|---|---|---|
| Jiddiy | toʻlovlar oʻtmayapti, sayt yoki bot ishlamayapti, maʼlumot sizib chiqqan boʻlishi mumkin | kecha-kunduz navbatchilik kelishilgan boʻlsa 30–60 daqiqa, faqat ish vaqtidagi tarifda bir necha ish soati ichida | bir necha soat ichida |
| Muhim | bitta funksiya buzilgan, lekin vaqtincha boshqa yoʻl bilan ishlasa boʻladi: hisobot chiqmayapti, operatorlarga bildirishnoma kelmayapti | ish kuni davomida | 1–2 ish kuni |
| Oddiy | matndagi xato, bitta ekranda siljib ketgan element | 1–2 ish kuni | navbatdagi rejali yangilanishda |
| Qoʻshimcha ish | yangi hisobot, formadagi yangi maydon | bir necha ish kunida baholash | kelishilgan reja boʻyicha |

Nimalarni aniqlashtirish kerak:

- **Javob tuzatish degani emas.** Javob — bu kimdir muammoni oʻz zimmasiga olgani, uning koʻlamini tushungani va sizga xabar bergani. Tuzatish uzoqroq choʻzilishi mumkin, ayniqsa sabab toʻlov tizimi tomonida boʻlsa. Mobil ilovadagi tuzatish bundan tashqari doʻkon tekshiruvidan ham oʻtadi, bu bir necha soatdan bir necha kungacha vaqt oladi. Shuning uchun xavfli funksiyalarni serverdan oʻchirib qoʻyish mumkin boʻladigan qilib ishlab chiqqan maʼqul.
- **Toshkent vaqti bilan ish vaqti.** Masalan, ish kunlari 9:00 dan 18:00 gacha. Yetkazib berish xizmatingiz tungi soat ikkigacha ishlasa-yu, qoʻllab-quvvatlash kechki oltigacha boʻlsa, ish vaqtidan tashqaridagi jiddiy holatlar shartnomada alohida yozilishi kerak. Navbatchilik alohida pullik va bu adolatli.
- **Bayramlar.** Navroʻz, Ramazon hayiti, Qurbon hayiti, Mustaqillik kuni, Yangi yil. Yetkazib berish va chakana savdo uchun bular koʻpincha eng qizgʻin kunlar. Kim aloqada boʻlishini oldindan kelishib oling va bayram arafasida katta yangilanish chiqarmang.
- **Murojaatlar uchun bitta kanal.** Vazifalar trekeri yoki Telegramdagi alohida chat, jiddiy holatda esa navbatchi raqamga qoʻngʻiroq. Turli dasturchilarga shaxsiy xabar orqali yuborilgan murojaatlar yoʻqolib ketadi.

Yaxshi murojaatda nima boʻlgani, qayerda (sayt, bot yoki ilova; telefon modeli va tizim versiyasi; interfeys tili), qachon boʻlgani, buyurtma raqami va skrinshot boʻladi. Tafsilotsiz «bizda hech narsa ishlamayapti» bir soatlik yozishmaga aylanadi.

## Qoʻllab-quvvatlash byudjeti

Saytga xizmat koʻrsatish narxi toʻlov modeli va ish hajmiga bogʻliq. Asosiy modellar ikkita.

**Oylik abonent toʻlovi.** Har oy soatlar paketi va kafolatlangan javob muddatlari uchun qatʼiy summa toʻlanadi. Jamoa loyihani doim yodda tutadi, monitoring va yangilanishlar reja boʻyicha boradi, jiddiy nosozlik smeta kelishilmasdan hal qilinadi. Kamchiligi: tinch oylarda ham toʻlaysiz. Ishlatilmagan soatlar nima boʻlishini aniqlang: keyingi oyga oʻtadimi yoki bekor boʻladimi.

**Har bir vazifa uchun toʻlov.** Faqat bajarilgan ish uchun toʻlaysiz. Deyarli oʻzgarmaydigan oddiy sayt uchun mos. Kamchiliklari: vazifalar orasida loyihani hech kim kuzatmaydi, javob muddatini hech kim kafolatlamaydi, har safar loyihaga qaytganda dasturchi hammasi qanday tuzilganini eslashdan boshlaydi va bu vaqt ham hisobga yoziladi.

Koʻpincha aralash variant oqilona: monitoring, yangilanishlar va jiddiy nosozliklar uchun kichik abonent paketi, qoʻshimcha ishlar esa kelishuv boʻyicha soatbay.

Muntazam rivojlantirishsiz, faqat asosiy qoʻllab-quvvatlash hajmi boʻyicha moʻljallar:

- oddiy sayt yoki lending sahifa: oyiga bir necha soat, yangilanishlar, zaxira nusxalarni tekshirish va mayda tuzatishlar uchun;
- toʻlov, shaxsiy kabinet va admin paneli bor bot yoki sayt: oyiga taxminan 8–20 soat;
- oʻz serveri va 1C bilan almashinuvi bor iOS va Android ilova: oyiga 20–40 soat va undan koʻp, ustiga doʻkon talablari uchun yillik ish.

Bunga qoʻshimcha ravishda muntazam yaxshilanishlar ham kerak boʻlsa, hajm [Dasturiy taʼminotda kaizen](/blog/kaizen-in-software/) maqolasidagi raqamlarga yaqinlashadi.

Hajm quyidagi hollarda oshadi: platformalar bir nechta boʻlsa, integratsiyalar koʻp boʻlsa (har biri buzilishi mumkin boʻlgan alohida nuqta), avtomatik testlar boʻlmasa, kodni boshqa jamoa yozgan va hujjatlar yoʻq boʻlsa, kecha-kunduz javob berish kerak boʻlsa.

Jamoa soatlaridan tashqari birinchi yil byudjetiga server, maʼlumotlar bazasi va zaxira nusxalar uchun joy, domen, Apple Developer Program (yiliga $99) va Google Play (bir marta $25), kirish kodlari uchun SMS, 1C va CRM litsenziyalari, mahsulotda AI ishlatilsa uning toʻlovi hamda oldindan bilib boʻlmaydigan tashqi oʻzgarishlar uchun zaxira kiradi.

Koʻp uchraydigan xatolar:

- **Birinchi oylarda qoʻllab-quvvatlashdan voz kechish.** Testda chiqmagan xatolar aynan shu paytda, haqiqiy foydalanuvchilar va kam uchraydigan telefonlarda yuzaga chiqadi.
- **Pudratchilarni faqat ishga tushirish narxi boʻyicha solishtirish.** Qoʻllab-quvvatlash narxini dasturlash narxi bilan birga yozma ravishda soʻrang va birinchi yil uchun umumiy summani solishtiring.
- **Yangilanishlarni «keyinga» surish.** Ikki yil yangilanmagan loyihani yangilash shu ikki yil davomida oz-ozdan yangilab borishdan qimmatga tushadi, buni esa odatda eng noqulay paytda bilib qolasiz.

## Bitta pudratchiga bogʻlanib qolmaslik

Yaxshi pudratchi bilan ham vaziyat oʻzgarishi mumkin: kompaniya oʻsib, kichik loyihalarni olmay qoʻyishi, narxlarni oshirishi yoki asosiy dasturchisi ketib qolishi mumkin. Loyiha shunday tuzilgan boʻlishi kerakki, boshqa jamoa uni oylar emas, haftalar ichida qabul qila olsin.

Nimani tekshirish kerak:

1. **Kod sizning repozitoriyingizda.** GitHub, GitLab yoki shunga oʻxshash servisdagi akkaunt kompaniyangiz nomida, pudratchi unda ishtirokchi sifatida ishlaydi. «Soʻrasangiz arxivini yuboramiz» emas.
2. **Akkauntlar kompaniyangiz nomida.** Apple Developer va Google Play Console tashkilot akkauntlari boʻlsin. Ikkalasi uchun ham D-U-N-S raqami kerak, uni olish vaqt talab qiladi, shuning uchun bu ishni oldindan boshlang. Domen, hosting, Click, Payme va Uzum kabinetlari, SMS servisi yuridik shaxsingiz nomiga rasmiylashtirilgan va ularga oʻz xodimingizning kirish huquqi boʻlsin. Bot BotFatherda dasturchining shaxsiy raqamidan emas, kompaniya nazorat qiladigan Telegram akkauntidan roʻyxatdan oʻtkazilgan boʻlsin.
3. **Parollar va kalitlar** sizda ham kirish huquqi bor parol menejerida saqlanadi. Jamoa almashganda ular oʻzgartiriladi.
4. **Hujjatlar.** Loyihani noldan qanday ishga tushirish, qanday serverlar va muhitlar bor, qanday integratsiyalar bor va ularning sozlamalari qayerda, zaxira nusxalar qanday ishlaydi, odatiy nosozliklarda nima qilish kerak. Yuz betlik roman emas, ishchi yoʻriqnoma.
5. **Kodga huquqlar.** Shartnomada kodga mutlaq huquqlar toʻlovdan keyin sizga oʻtishi yozilgan va uchinchi tomon komponentlari roʻyxati ularning litsenziyalari bilan ilova qilingan boʻlsin.
6. **Chiqish tartibi.** Shartnoma bekor qilinganda pudratchi nima qilishi shart: kirish huquqlari va hujjatlarni topshirish, ishlarni yangi jamoaga tushuntirib berish, uning savollariga kelishilgan muddat davomida javob berish.

Oddiy tekshiruv: bu loyihani yozmagan dasturchidan uni hujjatlarga qarab test serverda ishga tushirib koʻrishni soʻrang. Muallifga qoʻngʻiroq qilmasdan uddasidan chiqsa, hujjatlar ishlaydi.

## Qoʻllab-quvvatlash vaqtidan unumli foydalanish

Qoʻllab-quvvatlash soatlari faqat yongʻin oʻchirishga ketishi shart emas. Bu yerda yaponlarning kaizen tamoyili juda qoʻl keladi: tuzatishlar kichik yaxshilanishlar bilan birga qilinadi. Dasturchi xatoni tuzatish uchun baribir buyurtma rasmiylashtirish kodini koʻrib chiqayotgan boʻlsa, ortiqcha maydonni olib tashlash yoki sekin qadamni tezlashtirish uchun aynan qulay payt. Bu oʻsha kodga uch oydan keyin alohida vazifa bilan qaytishdan arzonroq. Oy uchun oqilona taqsimot: soatlarning bir qismi rejali yangilanish va tekshiruvlarga, bir qismi tuzatishlarga, qolgani esa jamoa bilan birga tanlangan bir-ikkita yaxshilanishga.

Oyda bir marta pudratchi qisqa hisobot yuboradi. Unda:

- oy davomidagi nosozliklar: nima boʻldi, qancha davom etdi, sababi va takrorlanmasligi uchun nima qilindi;
- oʻrnatilgan yangilanishlar: kutubxonalar, server, doʻkonlardagi ilova versiyalari;
- zaxira nusxadan tiklash oxirgi marta qachon tekshirilgani;
- vazifalar boʻyicha sarflangan soatlar va paket qoldigʻi;
- yaqinlashib kelayotgan muddatlar: domenni uzaytirish, Google Playning navbatdagi muddati, Apple talablari, litsenziyalar tugashi;
- keyingi oy uchun tavsiyalar va ularning sababi.

Bunday hisobotga besh daqiqa qarab, nima uchun pul toʻlayotganingizni tushunasiz. Muntazam hisobot haqida batafsil: [Hōrensō: IT jamoa sizga qanday hisobot berishi kerak](/blog/horenso-reporting/).

Hozir nimalar ishlayotganini (sayt, bot, ilova, 1C va toʻlov tizimlari bilan integratsiyalar) qilich.com saytidagi SamurAIga yozing va aynan sizdagi tizimlarni qoʻllab-quvvatlashga nimalar kirishi kerakligini soʻrang.
