---
slug: mobile-app-cost
lang: uz
title: "Mobil ilova narxi: byudjet nimalardan tashkil topadi"
description: "iOS va Android ilova narxi nimaga bogʻliq: ekranlar, backend, toʻlovlar, integratsiyalar, doʻkonlarga joylash va ishga tushirilgandan keyingi xarajatlar."
date: 2026-10-21
tags: [mobil ilova, narx, iOS, Android, backend]
related: [mobile, backend, web]
reading_minutes: 10
---

Yetkazib berish, onlayn yozilish, bonus dasturi yoki ulgurji buyurtmalar uchun ilova qilmoqchisiz va birinchi savol tabiiy: mobil ilova narxi qancha? Toshkentda ilova yasash haqida bir nechta kompaniyadan soʻrasangiz, bir-biridan bir necha barobar farq qiladigan summalarni eshitasiz. Smetalardagi qatorlarning yarmi esa telefonda koʻrinmaydigan narsalar haqida boʻladi: server, admin panel, integratsiyalar, test. Quyida ilova ishlab chiqish narxi aslida nimalardan yigʻilishini, byudjetni qaysi qarorlar eng koʻp oʻzgartirishini va ishga tushirilgandan keyin qanday xarajatlar boshlanishini koʻrib chiqamiz. Maqsad oddiy: pulni faqat ishga tushirish kuniga emas, ilovaning birinchi yiliga rejalashtirish.

## Ilova bitta emas, uchta mahsulot

Mijoz App Store yoki Google Play orqali yuklab oladigan ilova faqat koʻrinadigan qism. U ishlashi uchun yana ikkita qism kerak.

- **Mijoz ilovasi** (iOS va Android): katalog, savat, toʻlov, profil.
- **Admin panel** xodimlar uchun, odatda login bilan kiriladigan veb-sahifa. Unda mahsulot va narxlarni oʻzgartirishadi, buyurtmalarni koʻrib, holatini almashtirishadi, push-xabarlar yuborishadi, banner va promokod qoʻyishadi, xodimlarga huquq berishadi.
- **Server (backend)** ularning oʻrtasida turadi. U foydalanuvchilar va buyurtmalarni saqlaydi, toʻlov tizimlaridan kelgan javoblarni qabul qiladi, bildirishnomalar yuboradi, 1C yoki CRM bilan maʼlumot almashadi.

Masalan, uchta filiali bor osh markazi yetkazib berish ilovasini istaydi. Mijoz menyuni va «Toʻlash» tugmasini koʻradi. Operator panelda yangi buyurtmani koʻrib, uni kerakli filial oshxonasiga yuboradi. Shu paytda server manzil yetkazib berish hududiga kirishini tekshiradi, Payme orqali toʻlov tasdigʻini oladi va mijozga «Kuryer yoʻlga chiqdi» degan push yuboradi. Kuryerlarga marshrut va holatlar koʻrinadigan alohida ilova kerak boʻlsa, bu allaqachon toʻrtinchi mahsulot.

Tijoriy taklifda faqat mijoz ilovasining ekranlari yozilgan boʻlsa, qolgan qismlar qayerda va ularni kim qilishini soʻrang. Admin panelsiz har bir narx oʻzgarishi dasturchi orqali oʻtadi, yaxshi serversiz esa chiroyli ilova eskirgan maʼlumotni koʻrsatadi.

## Narxni ekranlar emas, mijozning yoʻllari belgilaydi

Ilova qilish narxini ekranlar soni yomon bashorat qiladi. «Buyurtma uchun rahmat» ekrani bir soatda qilinadi, tekshiruvlari va xatolarni qayta ishlashi bor toʻlov ekrani esa bir necha kunda. Mijoz bosib oʻtadigan yoʻllarni sanash aniqroq:

1. telefon raqami va SMS-kod bilan kirish;
2. katalog: kategoriyalar, qidiruv, filtrlar, mahsulot kartochkasi;
3. savat va buyurtmani rasmiylashtirish: manzil, hudud, vaqt, izoh;
4. toʻlov;
5. buyurtma holati va bildirishnomalar;
6. profil: manzillar, tarix, til, akkauntni oʻchirish;
7. qoʻllab-quvvatlash xizmatiga yozish.

Har bir yoʻlning nostandart holatlari bor va ishlab chiqish hamda testning asosiy vaqti aynan shularga ketadi. SMS-kod kelmadi. Mahsulot savatda turganda tugab qoldi. Pul yechildi, lekin toʻlov tizimidan tasdiq kechikdi. Manzil hududdan tashqarida chiqdi. Toʻlov paytida internet uzildi yoki qoʻngʻiroq kelib, ilova fonga oʻtdi. Mijoz buyurtma oʻrtasida tilni almashtirdi.

Tayyorgarlikning amaliy usuli: har bir yoʻlni bir qatorda yozing («mijoz oʻtgan buyurtmani takrorlamoqchi: tarixni ochadi, „Takrorlash“ tugmasini bosadi, saqlangan karta bilan toʻlaydi»), tagiga esa nima notoʻgʻri ketishi mumkinligini yozib chiqing. Bu roʻyxat takliflarni solishtirganda sizga, baho berayotganda dasturchiga kerak boʻladi. «Narxga qaysi yoʻllar va qaysi nostandart holatlarni kiritdingiz?» degan savol kim jiddiy hisoblaganini darrov koʻrsatadi.

## Bitta kodmi yoki ikkita

iOS va Android uchun mobil ilova ishlab chiqishning ikki asosiy yoʻli bor.

**Kross-platforma** (Flutter, React Native): ikkala platformaga bitta kod, bitta jamoa, har bir funksiya bir marta yoziladi. Aksariyat biznes ilovalari uchun shu yetarli: katalog, buyurtma, yozilish, bonuslar, ulgurji arizalar xuddi shunday ishlaydi va mijoz farqni sezmaydi.

**Nativ ishlab chiqish** (iOS uchun Swift, Android uchun Kotlin): ikkita alohida ilova. Har bir funksiya ikki marta yoziladi, ikki marta test qilinadi, keyin ikki marta qoʻllab-quvvatlanadi. Bu sezilarli qimmatroq, lekin ikki baravar emas, chunki server, admin panel va dizayn umumiy.

Nativ yoʻl ilova telefon imkoniyatlariga tayanib ishlaganda oʻzini oqlaydi:

- Bluetooth qurilmalar, sensorlar, savdo uskunalari bilan doimiy ishlash;
- geolokatsiyani soatlab fonda kuzatish, masalan, kuryerlarda;
- kameradan kelgan videoni qayta ishlash, toʻldirilgan reallik (AR);
- har bir kadr muhim boʻlgan murakkab animatsiya va grafika.

Ilova asosan roʻyxatlar, formalar va toʻlovdan iborat boʻlsa, ikkita kod uchun pul toʻlashga odatda hojat yoʻq. Oraliq variant ham bor: Flutter yoki React Native asosidagi umumiy kod va bitta-ikkita ogʻir funksiya uchun nativ modullar.

Pudratchidan qaysi texnologiyani taklif qilayotganini va nega, qaysi qismlar nativ boʻlishini, keyin bu kodni boshqa jamoa qoʻllab-quvvatlay oladimi, soʻrang. Texnologiyani tanlayotib, ikki yildan keyin qanday dasturchilarni topa olishingizni ham tanlaysiz.

## Backend, admin panel va integratsiyalar

Server va integratsiyalar koʻpincha ilovaning oʻzi qadar, baʼzan undan ham koʻp ish talab qiladi. Butun mantiq shu yerda: kim kira oladi, Yunusobodga yetkazib berish qancha turadi, toʻlov kelmasa buyurtma bilan nima qilinadi.

Odatda nimalar kiradi:

- **Akkaunt va kirish.** Oʻzbekistonda koʻpincha telefon raqami va SMS-kod bilan kiriladi. Kodlarni SMS-provayder, masalan Eskiz yoki Play Mobile yuboradi va har bir xabar pullik.
- **Buyurtmalar, holatlar, push-bildirishnomalar.** Push-xabarni yetkazishning oʻzi Firebase Cloud Messaging va Apple xizmati orqali bepul. Ish kimga, qachon va nima yuborishni hal qiladigan serverga ketadi.
- **Click, Payme, Uzum orqali toʻlov.** Toʻlov tizimi bilan shartnomani dasturchi emas, biznes tuzadi va buni loyihaning birinchi haftasida boshlagan maʼqul. Har bir provayder oʻz protokoliga ega alohida integratsiya. Fiskal chekni ham hisobga oling: buning uchun har bir mahsulotga MXIK kodi va QQS stavkasi kerak, ularni katalogga kiritish esa buxgalteringizning ishi. Humo va Uzcard kartalarini saqlab, bir bosishda toʻlash imkoni provayderga bogʻliq.
- **Integratsiyalar.** Qoldiq va narxlarni 1C bilan bogʻlash, mijoz va bitimlarni amoCRM yoki Bitrix24 bilan sinxronlash, restoranlarda menyuni iiko yoki R-Keeper bilan bogʻlash. Narx tizimda API bor-yoʻqligiga, maʼlumot qaysi tomonga oqishiga, qanchalik tez-tez solishtirilishiga va maʼlumotnomalar qanchalik tartibli ekaniga bogʻliq. 1C konfiguratsiyasi sizga moslab oʻzgartirilgan boʻlsa, deyarli har doim sizning 1C dasturchingiz ham kerak boʻladi.
- **Maʼlumotlarni saqlash.** Ilova Oʻzbekiston fuqarolarining ismi, telefoni va manzilini saqlasa, qonun bu maʼlumotlarni Oʻzbekistondagi serverlarda saqlashni talab qiladi. Hostingni tanlashda buni boshidanoq hisobga oling: keyin koʻchish qimmatroqqa tushadi.

Doʻkonlar qoidalari haqida alohida. Jismoniy tovar va xizmatlar (ovqat, yetkazib berish, sartaroshga yozilish, ulgurji yetkazib berish) uchun Click yoki Payme orqali toʻlov olish mumkin. Ilova ichida isteʼmol qilinadigan raqamli tovarlarni, masalan, kurslar, obuna yoki pullik funksiyalarni esa Apple va Google, qoida tariqasida, oʻzlarining ichki toʻlovi orqali sotishni talab qiladi va 15–30 % komissiya oladi. Onlayn maktab ilovasi uchun bu butun hisob-kitobni oʻzgartiradi, shuning uchun bu savolni dizayndan oldin hal qiling.

Baholashni toʻrt qatorga ajratib berishni soʻrang: mijoz ilovasi, admin panel, server, integratsiyalar. Shunda nima uchun pul toʻlayotganingiz tushunarli boʻladi va ikki taklifni solishtirish osonlashadi.

## Dizayn, test va haqiqiy telefonlar

**Dizayn koddan oldin boshlanadi.** Yaxshi tartib: avval yoʻllar sxemasi, keyin Figma dasturida bosib koʻriladigan prototip, soʻng yakuniy ekranlar. Prototipni besh-olti haqiqiy mijozga koʻrsatish foydali: tugmani prototipda tuzatish tayyor ilovada tuzatishdan arzon. Standart komponentlar va tartibli setka mualliflik illyustratsiyalari va murakkab animatsiyadan arzonroq tushadi. Ikkinchisi ilova sizning asosiy vitrinangiz boʻlsa, oʻzini oqlaydi.

**Har bir ekranda ikki til.** Toshkentda deyarli har bir biznesga oʻzbek va rus tili kerak, baʼzan oʻzbek tilining kirill yozuvi ham. Bu faqat tugmalar emas: bildirishnomalar, SMS, xato matnlari, doʻkonlardagi tavsif va skrinshotlar ham. Oʻzbekcha va ruscha soʻzlar inglizchadan uzunroq, shuning uchun dizaynni eng uzun variantda tekshirishadi: maketga sigʻgan tugma telefonda ikki qatorga tushib qolishi mumkin. Matnlar koddan alohida saqlansin, shunda yangi til qayta ishlash orqali emas, tarjima orqali qoʻshiladi.

**Mijozlaringiz telefonida test.** Oʻzbekistonda mijozlarning aksariyati Android ishlatadi va koʻpchilikda flagman emas, xotirasi kichik, tizimi unchalik yangi boʻlmagan arzon yoki oʻrta narxdagi telefon. Dasturchining yangi iPhone telefonida uchib ishlaydigan ilova bunday telefonda sekin ochilishi va toʻlovda yopilib qolishi mumkin. Eng kamida quyidagilarni tekshiring:

- turli ishlab chiqaruvchilarning ikki-uchta arzon va oʻrta Android telefoni hamda bir necha yillik iPhone;
- kichik ekran va telefon sozlamalaridagi yirik shrift;
- sekin yoki uzilib turadigan internet;
- toʻlov paytida fonga oʻtish, kiruvchi qoʻngʻiroq;
- har bir ekranda ikkala til.

Test byudjetning sezilarli qismini oladi va bu normal holat. Kim test qilishini (alohida QA mutaxassisimi yoki dasturchining oʻzimi), qaysi qurilmalarda tekshirilishini va ommaviy relizdan oldin TestFlight hamda Google Play yopiq testi orqali beta-test boʻladimi, soʻrang.

## Doʻkonlardagi akkauntlar va tekshiruv

Ilovani doʻkonlarga joylash oʻz muddatlari va majburiy toʻlovlari bor alohida bosqich.

- **Apple Developer Program** yiliga $99 turadi, roʻyxatdan oʻtishda narx mahalliy valyutada koʻrsatilishi mumkin. Aʼzolik uzaytirilmasa, ilova App Store doʻkonidan olib tashlanadi.
- **Google Play** dasturchi akkaunti uchun bir martalik $25 toʻlov oladi.
- **D-U-N-S raqami.** Tashkilot akkaunti uchun ikkala doʻkon ham D-U-N-S raqamini talab qiladi. U bepul, lekin Google uni olish 30 kungacha choʻzilishi mumkinligi haqida ogohlantiradi. Uni loyihaning birinchi haftasida soʻrang.
- **Akkaunt dasturchiga emas, kompaniyaga ochilsin.** Aks holda doʻkonda sotuvchi sifatida begona ism turadi, ilovani keyin koʻchirish esa vaqt oladi. Yangi Google Play akkaunti shaxsiy sifatida roʻyxatdan oʻtgan boʻlsa, Google nashrdan oldin yopiq test talab qiladi: kamida 12 ta tester 14 kun uzluksiz.

Apple har bir versiyani tekshiradi, odatda bu bir necha soatdan bir-ikki kungacha davom etadi. Google ham ilovalarni tekshiradi va yangi akkauntlarda bu bir hafta va undan ham koʻproq choʻzilishi mumkin. Birinchi nashrga taxminan bir hafta ajrating: birinchi urinish koʻpincha izohlar bilan qaytadi.

Rad etilishning oldini olish oson boʻlgan sabablari:

- tekshiruvchida test uchun login yoʻq, SMS-kodsiz u kira olmaydi;
- ilovada roʻyxatdan oʻtish bor, lekin akkauntni oʻchirish yoʻq, Apple esa buni talab qiladi;
- maxfiylik siyosatiga havola yoʻq yoki u ilova yigʻayotgan maʼlumotlarga mos kelmaydi;
- ilova saytning oʻramiga oʻxshaydi va oʻzi deyarli hech narsa qila olmaydi;
- tekshiruvchining qurilmasida ilova ishdan chiqadi, kontent oʻrnida vaqtinchalik matn turibdi;
- geolokatsiya yoki kameraga ruxsat nega kerakligini tushuntirmasdan soʻraladi.

Ikkala doʻkon ham maʼlumotlar haqida anketa toʻldirishni talab qiladi: App Store uchun maxfiylik boʻlimi (qanday maʼlumot yigʻiladi, nima uchun va foydalanuvchiga bogʻlanadimi), Google Play uchun «Data safety» boʻlimi. Yana yosh reytingi, kerakli tillardagi tavsif va talab qilingan ekran oʻlchamlari uchun skrinshotlar kerak. Odatda bularni dasturchi tayyorlaydi, lekin anketadagi javoblar kompaniyangiz nomidan berilgan bayonot, shuning uchun ularni oʻzingiz tekshiring.

## Ishga tushirilgandan keyingi xarajatlar

Relizdan keyin ham ilova pul talab qiladi, shuning uchun birinchi yil byudjetini darhol hisoblab qoʻygan maʼqul.

| Xarajat | Qanday toʻlanadi | Kimga |
|---|---|---|
| Apple Developer Program | yiliga $99 | Apple |
| Google Play | bir marta $25 | Google |
| Oʻzbekistondagi server va maʼlumotlar bazasi | har oy, yuklama bilan oshadi | hosting-provayderga |
| Kirish uchun SMS-kodlar | har bir xabar uchun | SMS-provayderga |
| Onlayn toʻlov | shartnoma boʻyicha toʻlovdan foiz | Click, Payme, Uzum |
| Ilova ichidagi raqamli tovarlar | har bir xariddan doʻkon komissiyasi | Apple, Google |
| Push-bildirishnomalar | odatda bepul | — |
| Analitika va nosozlik hisobotlari | boshida koʻpincha bepul tarif yetadi | xizmat provayderiga |
| Qoʻllab-quvvatlash va qoʻshimcha ishlar | oylik paket yoki soatbay | dasturchiga |

Yana nimalarni hisobga olish kerak:

- **Har yilgi tizim yangilanishlari.** Apple har kuzda iOS tizimining yangi versiyasini, Google esa Androidning yangi versiyasini chiqaradi. Doʻkonlar ilovani yangi versiyalarga moslab yigʻishni muntazam talab qiladi: Google Play har yili yangilanishlar moʻljallanishi kerak boʻlgan Android versiyasini koʻtaradi. Bir yil hech kim tegmagan ilovani bir kun kelib tartibga keltirmaguncha yangilab boʻlmay qoladi.
- **Kutubxonalar va toʻlov tizimlarining SDK paketlari** ham yangilanadi, baʼzan eski versiya bilan mos kelmaydigan oʻzgarishlar bilan.
- **Xatolarni tuzatish.** Ayrim xatolar faqat haqiqiy foydalanuvchilarda va kam uchraydigan telefonlarda chiqadi.
- **Shaxsiy maʼlumotlarsiz analitika.** Mashhur analitika vositalari maʼlumotni chet elda saqlaydi. Ularga ism va telefon raqamlarini yubormang, oʻz holatingiz boʻyicha tafsilotlarni yuristdan soʻrang.
- **Yaxshilashlar.** Birinchi oylar mijozlar savatni qayerda tashlab ketishini va qaysi funksiyani hech kim ochmasligini koʻrsatadi. Haqiqiy maʼlumotga tayangan kichik oʻzgarishlar taxminga qurilgan katta ikkinchi versiyadan koʻproq foyda beradi. Yapon amaliyotida buni kaizen deyishadi: kichik yaxshilanishlar, lekin muntazam.

Qoʻllab-quvvatlash narxini ishlab chiqish narxi bilan birga soʻrang va nima xato hisoblanishi, nima yangi vazifa ekanini oldindan kelishib oling.

## Mahsulotga zarar yetkazmasdan byudjetni qanday qisqartirish mumkin

- **Bitta asosiy yoʻl bilan MVP chiqaring.** Yetkazib berish uchun bu menyu, savat, toʻlov va buyurtma holati. Bonuslar, sharhlar, referal dastur va chat mijozlar asosiy yoʻldan qanday foydalanishini koʻrmaguningizcha kutib tursin.
- **Boshida bitta onlayn toʻlov usuli.** Koʻpchilik kuryerga naqd yoki terminal orqali karta bilan toʻlasa, ikkinchi provayderni keyin qoʻshish mumkin.
- **Avval Telegram Mini App.** Mijozlaringiz allaqachon Telegramda, ularga hech narsa oʻrnatish shart emas, doʻkon tekshiruvi va yillik toʻlov yoʻq, yangilanish darhol koʻrinadi. Cheklovlari ham bor: telefon imkoniyatlaridan kamroq foydalaniladi, bildirishnomalar bot xabari sifatida keladi, hammasi Telegram qoidalariga bogʻliq. Mini App talab borligini koʻrsatsa va server boshidanoq shunga moʻljallab qurilgan boʻlsa, oʻsha server va admin panel keyin mobil ilovaga ham xizmat qiladi. Ular uchun ikkinchi marta pul toʻlamaysiz.
- **Bor narsadan foydalaning.** Katalog va narxlar 1C bazasidan olinsin, parallel yuritiladigan yangi maʼlumotnoma kerak emas. Mijozlar CRM tizimingizda qolsin. Amaldagi toʻlov shartnomasi va Telegram-botingiz boʻlsa, uning serveri ham ishga yaraydi.

Toʻlov testi, admin panel, zaxira nusxalar va xatolar haqidagi ogohlantirishlarni tejamang: bu tejashlarning har biri keyinchalik oʻzidan qimmatga tushadi.

## Pudratchi bilan gaplashishdan oldin nima tayyorlash kerak

Muddatlar boʻyicha moʻljal, agar sizning tomoningizdan hammasi oʻz vaqtida tayyor boʻlsa: bitta asosiy yoʻl, admin panel va bitta toʻlov tizimi bilan MVP odatda 2–3 oy oladi. Bonuslar, bir nechta integratsiya va kuryerlar uchun alohida ilovasi bor toʻliqroq versiya 4–7 oy davom etadi. Muddatni koʻpincha dasturlash emas, kutish surib yuboradi: toʻlov tizimi bilan shartnoma, D-U-N-S raqami va doʻkon akkauntlari, 1C bazasiga kirish, matn va rasmlar, doʻkondagi birinchi tekshiruv.

Boshqa takliflar bilan solishtirsa boʻladigan baho olish uchun quyidagilarni tayyorlang:

- ilova nima qilishi va kim uchunligi haqida bir gap;
- mijoz yoʻllari va nostandart holatlar roʻyxati;
- admin panelda kim ishlaydi va u yerda nimani oʻzgartiradi;
- kuryerlar, ustalar yoki savdo vakillari uchun alohida ilova kerakmi;
- mijozlar qanday toʻlaydi va Click, Payme yoki Uzum bilan shartnoma bormi;
- qaysi tizimlar bilan bogʻlash kerak: 1C (qaysi konfiguratsiya), amoCRM, Bitrix24, iiko;
- tillar: lotin va kirill yozuvidagi oʻzbek tili, rus tili;
- ishga tushirishning qatʼiy sanasi bormi, matn va rasmlarni kim tayyorlaydi;
- qoʻllab-quvvatlashni ham qoʻshganda birinchi yilga qancha byudjet ajratmoqchisiz.

Ilova gʻoyangizni qilich.com saytidagi SamurAI yordamchisiga yozib bering yoki bu roʻyxatni inbox@qilich.com manziliga yuboring.
