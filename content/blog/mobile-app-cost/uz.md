---
slug: mobile-app-cost
lang: uz
title: "Mobil ilova narxi: byudjet nimalardan tashkil topadi"
description: "iOS va Android ilova narxi nimaga bogʻliq: mijoz yoʻllari, backend, toʻlovlar, integratsiyalar, doʻkonlarga joylash va ishga tushirilgandan keyingi xarajatlar."
date: 2026-10-21
tags: [mobil ilova, narx, iOS, Android, backend]
related: [mobile, cloud, web]
reading_minutes: 10
---

Yetkazib berish, onlayn yozilish, bonus dasturi yoki ulgurji buyurtmalar uchun ilova qilmoqchisiz va birinchi savol tabiiy: mobil ilova narxi qancha? Toshkentdagi bir nechta kompaniyadan ilova yasash narxini soʻrasangiz, eng qimmat taklif eng arzonidan bir necha baravar yuqori chiqishi mumkin. Smetadagi qatorlarning koʻpi esa telefonda koʻrinmaydigan narsalarga tegishli: server, admin panel, integratsiyalar, test. Quyida ilova ishlab chiqish narxi aslida nimalardan yigʻilishini, byudjetga qaysi qarorlar eng koʻp taʼsir qilishini va ishga tushirilgandan keyin qanday xarajatlar boshlanishini koʻrib chiqamiz. Maqsad oddiy: pulni faqat ishga tushirish kuniga emas, ilovaning birinchi yiliga rejalashtirish.

## Ilova bitta emas, uchta mahsulot

Mijoz App Store yoki Google Play orqali yuklab oladigan ilova — faqat koʻrinadigan qism. U ishlashi uchun yana ikki qism kerak.

- **Mijoz ilovasi** (iOS va Android): katalog, savat, toʻlov, profil.
- **Admin panel** — xodimlar uchun, odatda login va parol bilan kiriladigan veb-sahifa. Unda xodimlar mahsulot va narxlarni oʻzgartiradi, buyurtmalarni koʻrib, ularning holatini almashtiradi, push-xabarlar yuboradi, banner va promokodlar qoʻyadi, kimga qanday huquq berilishini belgilaydi.
- **Server (backend)** — ularning oʻrtasidagi qism. U foydalanuvchilar va buyurtmalarni saqlaydi, toʻlov tizimlaridan kelgan javoblarni qabul qiladi, bildirishnomalar yuboradi, 1C yoki CRM bilan maʼlumot almashadi.

Masalan, uchta filiali bor osh markazi yetkazib berish ilovasini istaydi. Mijoz menyuni va «Toʻlash» tugmasini koʻradi. Operator panelda yangi buyurtmani koʻrib, uni kerakli filial oshxonasiga yuboradi. Bu vaqtda server manzil yetkazib berish hududiga kirishini tekshiradi va Payme tizimidan toʻlov tasdigʻini oladi, keyinroq esa mijozga «Kuryer yoʻlga chiqdi» degan push-xabar yuboradi. Kuryerlarga marshrut va holatlar koʻrinadigan alohida ilova kerak boʻlsa, bu allaqachon toʻrtinchi mahsulot.

Tijorat taklifida faqat mijoz ilovasining ekranlari yozilgan boʻlsa, qolgan qismlar qayerda va ularni kim qilishini soʻrang. Admin panelsiz har bir narx oʻzgarishi dasturchi orqali oʻtadi, yaxshi serversiz esa chiroyli ilova eskirgan maʼlumotni koʻrsatadi.

## Narxni ekranlar soni emas, mijozning yoʻllari belgilaydi

Ekranlar soni ilova qilish narxi haqida kam narsa aytadi. «Buyurtma uchun rahmat» ekrani bir soatda qilinadi, tekshiruvlari va xato holatlariga javoblari bor toʻlov ekrani esa bir necha kunda. Mijoz bosib oʻtadigan yoʻllarni sanash aniqroq natija beradi:

1. telefon raqami va SMS-kod bilan kirish;
2. katalog: kategoriyalar, qidiruv, filtrlar, mahsulot kartochkasi;
3. savat va buyurtmani rasmiylashtirish: manzil, yetkazib berish hududi, vaqt, izoh;
4. toʻlov;
5. buyurtma holati va bildirishnomalar;
6. profil: manzillar, buyurtmalar tarixi, til, akkauntni oʻchirish;
7. qoʻllab-quvvatlash xizmatiga yozish.

Har bir yoʻlning nostandart holatlari bor va ishlab chiqish hamda testning asosiy vaqti aynan shularga ketadi. SMS-kod kelmadi. Mahsulot savatda turganda tugab qoldi. Pul yechildi, lekin toʻlov tizimidan tasdiq kechikdi. Manzil yetkazib berish hududidan tashqarida boʻlib chiqdi. Toʻlov paytida internet uzildi yoki qoʻngʻiroq kelib, ilova fonga oʻtdi. Mijoz buyurtmani rasmiylashtirayotib tilni almashtirdi.

Oldindan tayyorlanishning oddiy usuli: har bir yoʻlni bir qatorda yozing («mijoz oʻtgan buyurtmani takrorlamoqchi: tarixni ochadi, „Takrorlash“ tugmasini bosadi, saqlangan karta bilan toʻlaydi»), tagiga esa nimalar xato ketishi mumkinligini sanab chiqing. Bu roʻyxat takliflarni solishtirganda sizga, baho berayotganda dasturchiga kerak boʻladi. «Narxga qaysi yoʻllar va qaysi nostandart holatlarni kiritdingiz?» degan savol kim jiddiy hisoblaganini darrov koʻrsatadi.

## Bitta kodmi, ikkitami

iOS va Android uchun mobil ilova ishlab chiqishning ikki asosiy yoʻli bor.

**Kross-platformali ishlab chiqish** (Flutter, React Native): ikkala platformaga bitta kod, bitta jamoa, har bir funksiya bir marta yoziladi. Aksariyat biznes ilovalari uchun shu yetarli: katalog, buyurtma, yozilish, bonuslar, ulgurji arizalar nativ ilovadagidek ishlaydi va mijoz farqni sezmaydi.

**Nativ ishlab chiqish** (iOS uchun Swift, Android uchun Kotlin): ikkita alohida ilova. Har bir funksiya ikki marta yoziladi, ikki marta test qilinadi, keyin ikki marta qoʻllab-quvvatlanadi. Bu sezilarli qimmatroq, lekin ikki baravar emas, chunki server, admin panel va dizayn umumiy.

Nativ yoʻl ilova telefon imkoniyatlariga tayanib ishlaganda oʻzini oqlaydi:

- Bluetooth qurilmalar, sensorlar, savdo uskunalari bilan doimiy ishlash;
- fonda soatlab geolokatsiyani kuzatish, masalan, kuryerlar uchun;
- kameradan kelgan videoni qayta ishlash, toʻldirilgan reallik (AR);
- har bir kadr muhim boʻlgan murakkab animatsiya va grafika.

Ilova asosan roʻyxatlar, formalar va toʻlovdan iborat boʻlsa, ikkita kod uchun pul toʻlashga odatda hojat yoʻq. Oraliq variant ham bor: Flutter yoki React Native asosidagi umumiy kod va bir-ikkita ogʻir funksiya uchun nativ modullar.

Pudratchidan soʻrang: qaysi texnologiyani taklif qilyapti va nima uchun, qaysi qismlar nativ boʻladi, keyinchalik bu kodni boshqa jamoa qoʻllab-quvvatlay oladimi. Texnologiyani tanlayotib, ikki yildan keyin qanday dasturchilarni topa olishingizni ham tanlaysiz.

## Backend, admin panel va integratsiyalar

Server va integratsiyalar koʻpincha ilovaning oʻzi qadar, baʼzan undan ham koʻp ish talab qiladi. Butun mantiq shu yerda: kim kira oladi, Yunusobodga yetkazib berish qancha boʻladi, toʻlov kelmasa buyurtma bilan nima qilinadi.

Odatda nimalar kiradi:

- **Akkaunt va kirish.** Oʻzbekistonda koʻpincha telefon raqami va SMS-kod bilan kiriladi. Kodlarni SMS-provayder (masalan, Eskiz yoki Play Mobile) yuboradi va har bir xabar pullik.
- **Buyurtmalar, holatlar, push-bildirishnomalar.** Push-xabarni yetkazishning oʻzi Firebase Cloud Messaging va Apple xizmati orqali bepul. Asosiy ish serverda: kimga, qachon va nima yuborishni u hal qiladi.
- **Click, Payme, Uzum orqali toʻlov.** Toʻlov tizimi bilan shartnomani dasturchi emas, biznes tuzadi va bu ishni loyihaning birinchi haftasida boshlagan maʼqul. Har bir provayder — oʻz protokoli bor alohida integratsiya. Fiskal chekni ham hisobga oling: buning uchun har bir mahsulotga MXIK kodi va QQS stavkasi kerak, toʻgʻri kodlarni tanlash esa dasturchining emas, buxgalteringizning ishi. Humo va Uzcard kartasini saqlab, keyin bir bosishda toʻlash imkoniyati provayderga bogʻliq.
- **Integratsiyalar.** Qoldiq va narxlarni 1C bilan bogʻlash, mijoz va bitimlarni amoCRM yoki Bitrix24 bilan sinxronlash, restoranlarda menyuni iiko yoki R-Keeper bilan bogʻlash. Narx tizimda API bor-yoʻqligiga, maʼlumot qaysi yoʻnalishda uzatilishiga, qanchalik tez-tez sinxronlanishiga va maʼlumotnomalar qanchalik tartibli yuritilishiga bogʻliq. 1C konfiguratsiyasi sizga moslab oʻzgartirilgan boʻlsa, deyarli har doim sizning 1C dasturchingiz ham ishga qoʻshilishi kerak boʻladi.
- **Maʼlumotlarni saqlash.** Ilova Oʻzbekiston fuqarolarining ismi, telefoni va manzilini saqlasa, «Shaxsga doir maʼlumotlar toʻgʻrisida»gi qonun bu maʼlumotlarni Oʻzbekistondagi serverlarda saqlashni talab qiladi. Hostingni tanlashda buni boshidanoq hisobga oling: keyin koʻchish qimmatroqqa tushadi.

Doʻkon qoidalari haqida alohida aytib oʻtish kerak. Jismoniy tovar va xizmatlar (ovqat, yetkazib berish, sartaroshga yozilish, ulgurji partiya) uchun toʻlovni Click yoki Payme orqali olish mumkin. Ilova ichida foydalaniladigan raqamli tovarlar — kurslar, obuna, pullik funksiyalar — uchun esa Apple va Google, qoida tariqasida, oʻzlarining ichki toʻlov tizimidan foydalanishni talab qiladi va 15–30 % komissiya oladi. Onlayn maktab ilovasi uchun bu butun hisob-kitobni oʻzgartiradi, shuning uchun bu savolni dizayndan oldin hal qiling.

Smetani toʻrt qatorga ajratib berishlarini soʻrang: mijoz ilovasi, admin panel, server, integratsiyalar. Shunda nima uchun pul toʻlayotganingiz tushunarli boʻladi va ikki taklifni solishtirish osonlashadi.

## Dizayn, test va haqiqiy telefonlar

**Dizayn koddan oldin boshlanadi.** Yaxshi tartib: avval yoʻllar sxemasi, keyin Figma dasturida bosib koʻriladigan prototip, soʻng yakuniy ekranlar. Prototipni besh-olti haqiqiy mijozga koʻrsatish foydali: tugmani prototipda tuzatish tayyor ilovada tuzatishdan arzon. Standart komponentlar va oddiy, tartibli maket mualliflik illyustratsiyalari va murakkab animatsiyadan arzonroq tushadi. Ular esa ilova sizning asosiy vitrinangiz boʻlganda oʻzini oqlaydi.

**Har bir ekranda ikki til.** Toshkentda deyarli har bir biznesga oʻzbek va rus tili kerak, baʼzan oʻzbek tilining kirill yozuvi ham. Gap faqat tugmalarda emas: bildirishnomalar, SMS, xato matnlari, doʻkondagi tavsif va skrinshotlar ham ikki tilda boʻlishi kerak. Oʻzbekcha va ruscha soʻzlar inglizchadan uzunroq, shuning uchun dizayn eng uzun variant bilan tekshiriladi: maketga sigʻgan tugma telefonda ikki qatorga tushib qolishi mumkin. Matnlar koddan alohida saqlansin, shunda yangi til kodni qayta yozmasdan, tarjima bilan qoʻshiladi.

**Mijozlaringiz telefonida test.** Oʻzbekistonda mijozlarning aksariyati Android ishlatadi va koʻpchilikning qoʻlida flagman emas, xotirasi kichik, tizimi unchalik yangi boʻlmagan arzon yoki oʻrta narxdagi telefon. Dasturchining yangi iPhone telefonida tez ishlaydigan ilova bunday telefonda sekin ochilishi va toʻlov paytida yopilib qolishi mumkin. Eng kamida quyidagilarni tekshiring:

- turli ishlab chiqaruvchilarning ikki-uchta arzon va oʻrta Android telefoni hamda bir necha yillik iPhone;
- kichik ekran va telefon sozlamalaridagi yirik shrift;
- sekin yoki uzilib turadigan internet;
- toʻlov paytida fonga oʻtish, kiruvchi qoʻngʻiroq;
- har bir ekranda ikkala til.

Test byudjetning sezilarli qismini oladi va bu normal holat. Soʻrang: kim test qiladi (alohida QA mutaxassisimi yoki kodni yozgan dasturchining oʻzimi), qaysi qurilmalarda tekshiriladi va ommaviy relizdan oldin TestFlight hamda Google Play yopiq testi orqali beta-test boʻladimi.

## Doʻkonlardagi akkauntlar va tekshiruv

Ilovani doʻkonlarga joylash — oʻz muddatlari va majburiy toʻlovlari bor alohida bosqich.

- **Apple Developer Program**: yiliga $99, roʻyxatdan oʻtishda narx mahalliy valyutada koʻrsatilishi mumkin. Aʼzolik uzaytirilmasa, ilova App Store doʻkonidan olib tashlanadi.
- **Google Play** dasturchi akkaunti uchun bir martalik $25 toʻlov oladi.
- **D-U-N-S raqami.** Tashkilot akkaunti uchun ikkala doʻkon ham D-U-N-S raqamini talab qiladi. U bepul, lekin Google uni olish 30 kungacha choʻzilishi mumkinligi haqida ogohlantiradi. Uni loyihaning birinchi haftasidayoq soʻrab qoʻying.
- **Akkauntlarni dasturchi nomiga emas, kompaniyangiz nomiga oching.** Aks holda doʻkonda sotuvchi sifatida boshqa birovning ismi koʻrinadi, ilovani keyin koʻchirish esa vaqt oladi. Yangi Google Play akkaunti shaxsiy akkaunt sifatida roʻyxatdan oʻtgan boʻlsa, Google ilovani ommaga chiqarishdan oldin yopiq test talab qiladi: kamida 12 tester, 14 kun uzluksiz.

Apple har bir versiyani tekshiradi, odatda bu bir necha soatdan bir-ikki kungacha davom etadi. Google ham ilovalarni tekshiradi va yangi akkauntlarda bu bir hafta yoki undan koʻproq choʻzilishi mumkin. Doʻkonga birinchi marta joylash uchun taxminan bir hafta ajrating: birinchi urinish koʻpincha izohlar bilan qaytariladi.

Rad etishning koʻp uchraydigan va oldini olish oson sabablari:

- tekshiruvchiga test login berilmagan, SMS-kodsiz esa u kira olmaydi;
- ilovada roʻyxatdan oʻtish bor, lekin akkauntni oʻchirish yoʻq, ikkala doʻkon esa buni talab qiladi;
- maxfiylik siyosatiga havola yoʻq yoki u ilova yigʻayotgan maʼlumotlarga mos kelmaydi;
- ilova shunchaki saytni ochib beradi va oʻzi deyarli hech narsa qilmaydi;
- ilova tekshiruvchining qurilmasida yopilib qoladi yoki kontent oʻrnida vaqtinchalik matn turibdi;
- geolokatsiya yoki kameraga ruxsat nega kerakligi tushuntirilmasdan soʻraladi.

Ikkala doʻkon ham maʼlumotlar haqida anketa toʻldirishni talab qiladi: App Store uchun maxfiylik boʻlimi (qanday maʼlumot yigʻiladi, nima uchun va u foydalanuvchiga bogʻlanadimi), Google Play uchun «Data safety» boʻlimi. Yana yosh reytingi, kerakli tillardagi tavsif va talab qilingan ekran oʻlchamlari uchun skrinshotlar kerak. Odatda bularni dasturchi tayyorlaydi, lekin anketadagi javoblar kompaniyangiz nomidan berilgan bayonot, shuning uchun ularni oʻzingiz tekshiring.

## Ishga tushirilgandan keyingi xarajatlar

Relizdan keyin ham ilova pul talab qiladi, shuning uchun birinchi yil byudjetini darhol hisoblab qoʻygan maʼqul.

| Xarajat | Qanday toʻlanadi | Kimga |
|---|---|---|
| Apple Developer Program | yiliga $99 | Apple |
| Google Play | bir marta $25 | Google |
| Oʻzbekistondagi server va maʼlumotlar bazasi | har oy, yuklama oshgani sari koʻpayadi | hosting-provayderga |
| Kirish uchun SMS-kodlar | har bir xabar uchun | SMS-provayderga |
| Onlayn toʻlov | shartnoma boʻyicha har bir toʻlovdan foiz | Click, Payme, Uzum |
| Ilova ichidagi raqamli tovarlar | har bir xariddan doʻkon komissiyasi | Apple, Google |
| Push-bildirishnomalar | odatda bepul | — |
| Analitika va nosozlik hisobotlari | boshida koʻpincha bepul tarif yetadi | xizmat provayderiga |
| Qoʻllab-quvvatlash va qoʻshimcha ishlar | oylik paket yoki soatbay | dasturchiga |

Yana nimalarni hisobga olish kerak:

- **Har yilgi tizim yangilanishlari.** Apple har kuzda iOS tizimining yangi versiyasini chiqaradi, Google ham har yili Androidning yangi versiyasini chiqaradi. Doʻkonlar ilovani yangi versiyalarga moslab yigʻishni muntazam talab qiladi: Google Play har yili yangilanishlar moʻljallanishi shart boʻlgan Android versiyasini koʻtaradi. Bir yil davomida hech kim qaramagan ilovani bir kun kelib avval tartibga keltirmasdan yangilab boʻlmay qoladi.
- **Kutubxonalar va toʻlov tizimlarining SDK paketlari** ham yangilanadi, baʼzan eski versiya bilan mos kelmaydigan oʻzgarishlar bilan.
- **Xatolarni tuzatish.** Ayrim xatolar faqat haqiqiy foydalanuvchilarda va kam uchraydigan telefonlarda chiqadi.
- **Shaxsiy maʼlumotlarsiz analitika.** Mashhur analitika vositalari maʼlumotni chet elda saqlaydi. Ularga ism va telefon raqamlarini yubormang, aynan sizning holatingizda nima mumkinligini yuristdan aniqlang.
- **Yaxshilanishlar.** Birinchi oylar mijozlar savatni qayerda tashlab ketishini va qaysi funksiyani hech kim ochmasligini koʻrsatadi. Haqiqiy maʼlumotga tayangan kichik oʻzgarishlar taxminga qurilgan katta ikkinchi versiyadan koʻproq foyda beradi. Yapon amaliyotida buni kaizen deyishadi: kichik, lekin muntazam yaxshilanishlar.

Qoʻllab-quvvatlash narxini ishlab chiqish narxi bilan birga soʻrang va nima xato hisoblanishi, nima yangi vazifa ekanini oldindan kelishib oling.

## Mahsulotga zarar yetkazmasdan byudjetni qanday qisqartirish mumkin

- **Bitta asosiy yoʻl bilan MVP chiqaring.** Yetkazib berish uchun bu menyu, savat, toʻlov va buyurtma holati. Bonuslar, sharhlar, referal dastur va chat mijozlar asosiy yoʻldan qanday foydalanishini koʻrmaguningizcha kutib tursin.
- **Boshida bitta onlayn toʻlov usuli.** Koʻpchilik kuryerga naqd yoki terminal orqali karta bilan toʻlasa, ikkinchi provayderni keyin qoʻshish mumkin.
- **Avval Telegram Mini App.** Mijozlaringiz allaqachon Telegramda: hech narsa oʻrnatish shart emas, doʻkon tekshiruvi va yillik toʻlov yoʻq, yangilanish darhol koʻrinadi. Cheklovlari ham bor: telefon imkoniyatlaridan kamroq foydalaniladi, bildirishnomalar bot xabari sifatida keladi, hammasi Telegram qoidalariga bogʻliq. Mini App talab borligini koʻrsatsa va server boshidanoq shunga moʻljallab qurilgan boʻlsa, oʻsha server va admin panel keyin mobil ilovaga ham xizmat qiladi. Ular uchun ikkinchi marta pul toʻlamaysiz.
- **Bor narsadan foydalaning.** Katalog va narxlar 1C bazasidan olinsin, parallel yuritiladigan yangi maʼlumotnoma kerak emas. Mijozlar CRM tizimingizda qolsin. Amaldagi toʻlov shartnomangiz, Telegram-botingiz boʻlsa uning serveri ham ilovaga xizmat qila oladi.

Toʻlov testi, admin panel, zaxira nusxalar va xatolar haqidagi ogohlantirishlarda tejamang: bunday tejashning har biri keyin tejalgan puldan qimmatga tushadi.

## Katalogdagi narxlar

Qilich katalogidagi ikki keng tarqalgan ilova turining muddati va narxi quyida. Soʻmdagi summa Markaziy bank kursi boʻyicha hisoblanadi va sayt yangilanganda qayta hisoblanadi. Aniq narx ekranlar, integratsiyalar va platformalarga bogʻliq.

{{solution:mob-customer-app}}

{{solution:mob-booking-app}}

## Pudratchi bilan gaplashishdan oldin nima tayyorlash kerak

Muddatlar boʻyicha moʻljal (sizning tomoningizdan hammasi oʻz vaqtida tayyor boʻlsa): bitta asosiy yoʻl, admin panel va bitta toʻlov tizimi bilan MVP odatda 2–3 oy oladi. Bonus dasturi va bir nechta integratsiyasi bor toʻliqroq versiya 4–7 oy oladi, kuryerlar uchun alohida ilova esa bu muddatni yana uzaytiradi. Muddatni koʻpincha dasturlash emas, kutish surib yuboradi: toʻlov tizimi bilan shartnoma, D-U-N-S raqami va doʻkon akkauntlari, 1C bazasiga kirish, matn va rasmlar, doʻkondagi birinchi tekshiruv.

Turli pudratchilarning baholarini solishtira olishingiz uchun quyidagilarni tayyorlang:

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
