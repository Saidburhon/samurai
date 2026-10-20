---
slug: horenso-reporting
lang: uz
title: "Hōrensō: IT jamoa sizga qanday hisobot berishi kerak"
description: "Yapon ish madaniyatidagi hōrensō: hisobot berish, xabardor qilish, maslahatlashish. Dasturchilar jamoasidan nimani, qachon va qanday shaklda kutish kerak."
date: 2026-10-21
tags: [IT loyihani boshqarish, loyiha hisoboti, dasturchilar bilan ishlash, IT autsorsing, jarayon]
related: [mobile, web, telegram, backend]
reading_minutes: 7
---

Tanish holat: dasturchi topdingiz, avans toʻladingiz, birinchi kunlari yozishmalar qizgʻin ketdi. Keyin javoblar qisqara boshladi: «hammasi joyida», «deyarli tayyor». Bir oydan keyin natijani birinchi marta koʻrasiz, u kelishilgan narsaga unchalik oʻxshamaydi, muddat esa allaqachon surilgan. Koʻpincha muammo kodda emas. Shunchaki jamoada buyurtmachiga nima boʻlayotganini muntazam va aniq aytib turish odati yoʻq edi. Yapon kompaniyalarida bu odat hōrensō deyiladi. Quyida u nimalardan iborat, Telegramdagi yaxshi hisobot qanday koʻrinadi, jamoa sizdan nima kutadi, pudratchi sizni bexabar qoldirayotganini qaysi belgilardan bilish mumkin va shartnomadan oldin nimani soʻrash kerak. Dasturchilar bilan ishlash tajribangiz yoqimsiz boʻlgan boʻlsa yoki jamoani birinchi marta yollayotgan boʻlsangiz, shu yerdan boshlang.

## Bu soʻz qayerdan kelgan

Hōrensō (報連相) uchta yapon soʻzining bosh boʻgʻinlaridan tuzilgan:

- **hōkoku** (報告) — ish qanday ketayotgani va natijasi haqida hisobot berish;
- **renraku** (連絡) — boshqalar bilishi kerak boʻlgan faktlarni, ayniqsa oʻzgarishlarni yetkazish;
- **sōdan** (相談) — qaror qabul qilishdan oldin maslahatlashish.

Qisqartma yapon tilidagi «ismaloq» soʻzi bilan bir xil eshitiladi, shuning uchun oson esda qoladi. Unda hech qanday sir yoʻq. Koʻp yapon kompaniyalarida buni yangi xodimlarga birinchi haftalardayoq oʻrgatishadi, xuddi rasmiy xat yozish qoidalari kabi. Mohiyati oddiy: natija uchun javob beradigan va pul toʻlaydigan odam muhim yangilikni eng oxirida eshitmasligi kerak.

Pudratchi bilan ishlaganda rahbar oʻrnida siz turasiz. Jamoa hisobot beradi, xabardor qiladi, maslahatlashadi, sizda esa qaror qabul qilish uchun yetarli manzara boʻladi. IT loyihani boshqarish uchun kodni tushunish shart emas, shu tartib boʻlsa kifoya.

## Hōkoku: faktlar bilan muntazam hisobot

Yaxshi loyiha hisoboti «ishlar qalay?» degan qoʻngʻiroq ham, sizning xavotirli xabaringizga javob ham emas. U oʻzi keladi: har safar bir kunda va bir xil shaklda.

Unda nima boʻlishi kerak:

1. **Nima qilindi** va uni qayerda koʻrish mumkin: test bot, ilovaning sinov versiyasi, test serverdagi sahifa, skrinshot.
2. **Keyin nima** — keyingi hisobotgacha reja.
3. **Nima xalaqit beryapti va sizdan nima kerak** — aniq va sana bilan: «chorshanbagacha Payme kabinetiga kirish».
4. **Muddat va byudjet** — rejadamiz, xatar bor yoki kechikyapmiz, qanchaga.

Yaxshi hisobotni yomonidan nima ajratadi:

- **Umumiy gap emas, fakt.** «Toʻlov ustida ishladik» hech narsa demaydi. «Click orqali toʻlov test botda ishlayapti, muvaffaqiyatli toʻlov, rad etilgan toʻlov va qayta urinish tekshirildi» — buni tekshirib koʻrsa boʻladi.
- **Foiz emas, funksiyalar holati.** Dasturlashda «80 foiz tayyor» bir oy davom etishi mumkin. «Tayyor», «tekshiruvda», «jarayonda», «boshlanmagan» deb belgilangan funksiyalar roʻyxati ancha koʻp narsani koʻrsatadi.
- **Qisqa.** Hisobot telefonda bir-ikki daqiqada oʻqiladi. Tafsilot kerak boʻlsa, havolada turadi.
- **Bir xil shakl.** Har safar shakl oʻzgarsa, haftalarni bir-biri bilan solishtirib boʻlmaydi.

Telegramda bunday hisobot quyidagicha koʻrinishi mumkin. Loyiha shartli: masalan, ulgurji savdo kompaniyasi uchun dilerlar buyurtma beradigan bot va menejerlar uchun admin panel.

```
Hisobot, 3-hafta (14–18-oktyabr)

Bajarildi:
1. Katalog va savat — test botda ishlayapti (havola)
2. Qoldiqlar 1Cdan har 15 daqiqada yangilanadi, test bazada tekshirildi
3. Admin panel: buyurtmalar roʻyxati, holatni oʻzgartirish

Keyingi hafta:
1. Payme orqali toʻlov
2. Diler uchun buyurtmalar tarixi
3. Yangi buyurtma haqida menejerga xabar

Sizdan kerak:
1. Payme kabinetiga kirish — 22-oktyabrgacha, aks holda toʻlov 5-haftaga suriladi
2. Narx turlari roʻyxati (ulgurji, yirik ulgurji)

Muddat va byudjet: rejada.
Xatar: 1Cdagi oʻzgartirilgan konfiguratsiya tavsifi hali yoʻq, buyurtmalarni 1Cga yuklashni baholay olmayapmiz.
```

## Renraku: yomon xabar darhol

Kechikish, jiddiy xato, tashqi servisdagi oʻzgarish, App Store yoki Google Play ilovani qaytargani, asosiy dasturchining kasal boʻlib qolgani — jamoa bularning barchasini bilgan kuniyoq aytadi. Juma kungi hisobotda emas va «tuzatib qoʻyamiz, keyin aytamiz» degan umidda ham emas.

Muammo haqidagi yaxshi xabar toʻrtta savolga javob beradi:

1. Nima boʻldi.
2. Nimaga taʼsir qiladi: muddat, pul, foydalanuvchilar.
3. Jamoa hozir nima qilyapti.
4. Sizdan nima kerak, agar kerak boʻlsa.

Misol: «1C dasturchingiz yangilanish oʻrnatgandan keyin qoldiqlar almashinuvi toʻxtadi. Taʼsiri: botdagi qoldiqlar kechagi holatda qoldi, dilerlar omborda yoʻq tovarga buyurtma berishi mumkin. Hozir botda vaqtincha „qoldiqni menejerdan aniqlang“ yozuvini chiqardik. Sizdan: bugun 1C dasturchingiz bilan 15 daqiqalik qoʻngʻiroq».

Nega pudratchilar yomon xabarni yashiradi: mijozni yoʻqotishdan qoʻrqishadi yoki jimgina tuzatib qoʻyishga umid qilishadi. Bunday sukut sizga qimmatga tushadi. Bir haftalik kechikishni ishga tushirishdan uch hafta oldin bilsangiz, reklamani surasiz, xodimlarni ogohlantirasiz. Bir kun oldin bilsangiz, reklama toʻlab boʻlingan, dilerlarga esa «ertadan buyurtmani botdan beramiz» deb aytilgan.

Sizdan bitta shart: haqiqatni aytgani uchun jazolamang. Har bir yomon xabarga janjal bilan javob bersangiz, keyingi safar sukut eshitasiz.

## Sōdan: avval soʻrash, keyin qilish

Har bir qaror sizga kelishi shart emas. Kutubxona tanlash yoki maʼlumotlar bazasining tuzilishi — jamoaning ishi. Lekin faqat buyurtmachi hal qiladigan qarorlar bor:

- ish hajmi, narx yoki muddatni oʻzgartiradigan hamma narsa;
- foydalanuvchilar koʻradigan hamma narsa: buyurtma qadamlari, matnlar, dizayn;
- pullik tashqi servislar: SMS, xarita, hosting, AI modellar — bular sizning oylik xarajatingizga aylanadi;
- mijozlarning shaxsiy maʼlumotlari qayerda va qanday saqlanishi. Qonunga koʻra, Oʻzbekiston fuqarolarining shaxsiy maʼlumotlari Oʻzbekiston hududidagi serverlarda saqlanishi kerak, bu hosting tanlashga taʼsir qiladi. Batafsil: [Shaxsiy maʼlumotlarni Oʻzbekistonda saqlash](/blog/personal-data-in-uzbekistan/).

Toʻgʻri savol shunday tuziladi: muammo, narxi, muddati va oqibati koʻrsatilgan ikki-uchta variant, jamoaning tavsiyasi va javob qaysi sanagacha kerakligi. Variantsiz «qanday qilaylik?» — bu sōdan emas, bu ishni sizning boʻyningizga yuklash.

Misol. Loyiha oʻrtasida dilerlar oʻtgan buyurtmani bitta tugma bilan takrorlashni xohlashi maʼlum boʻldi. Jamoa shunday yozadi:

- **A. Hozir toʻliq qilish:** «takrorlash» tugmasi, qoldiq va yangi narxlarni tekshirish bilan. Qoʻshimcha 3–4 kun, ishga tushirish suriladi.
- **B. Hozir soddaroq:** buyurtmalar tarixi, tovarlarni diler oʻzi qayta qoʻshadi. Qoʻshimcha 1 kun.
- **C. Ishga tushirgandan keyin:** toʻliq versiya birinchi yaxshilash bosqichida. Muddat oʻzgarmaydi.
- **Tavsiyamiz C:** avval dilerlar buyurtmani aslida qanchalik tez-tez takrorlashini koʻrish kerak. Javob payshanbagacha kerak.

Qabul qilingan qaror yozib qoʻyiladi: sana, nima hal qilindi, kim hal qildi, muddat va narxga qanday taʼsir qiladi. Telegram chat lentasi jurnal emas. Ikki oydan keyin «takrorlash»ni kim va qachon kelishganini hech kim topa olmaydi. Qarorlar jurnali alohida hujjatda yoki vazifalar doskasidagi alohida boʻlimda yuritiladi.

## Haftama-hafta bu qanday koʻrinadi

| Qachon | Nima | Sizning vaqtingiz |
|---|---|---|
| Har juma | Telegramda yozma hisobot | 5 daqiqa |
| 1–2 haftada bir marta | demo: jamoa slayd emas, ishlayotgan mahsulotni koʻrsatadi | 20–40 daqiqa |
| Oʻsha kuni | muammo haqida xabar | vaziyatga qarab |
| Kerak boʻlganda | variantlari bilan savol | kelishilgan muddatda javob |
| Bosqich oxirida | yakun: nima qilindi, qancha sarflandi, hajmda nima oʻzgardi | 30 daqiqa |
| Doim | sizda kirish huquqi bor vazifalar doskasi | xohlagan paytingiz |

Masalan, oʻquv markazi uchun kurslarga yozilish va oylik toʻlov qabul qiladigan mini ilovali Telegram-bot, 8–10 haftalik shartli loyiha:

- **1-hafta:** boshlangʻich uchrashuv. Ikki tomondan kim aloqada boʻlishi, hisobot qaysi kuni va qaysi chatga kelishi kelishiladi.
- **2–3-haftalar:** birinchi demo — yozilish ekranlarining bosib koʻrsa boʻladigan maketi. Dasturlash boshlanmasdan oldingi tuzatish eng arzon tuzatish.
- **4–5-haftalar:** test botda birinchi ishlaydigan versiya. Siz va bir-ikki administrator oʻzingiz kursga yozilib koʻrasiz.
- **6–8-haftalar:** Click va Payme orqali toʻlov, eslatmalar, administrator paneli. Har hafta demo.
- **Oxirgi 1–2 hafta:** real holatlarda sinash, tuzatishlar, ishga tushirish.

Hammasi boʻlib haftasiga yarim soatdan bir soatgacha vaqtingiz ketadi. Kutilmagan yangiliklar boʻlmasligining narxi shu.

Pul haqida ochigʻi: bunday hisobot jamoaning ham vaqtini oladi. Hisobot, demo va qarorlar jurnalini loyiha menejeri yuritadi, uning soatlari narxga kiradi. Takliflardan biri boshqalaridan sezilarli arzon boʻlsa, aynan shu yerdan tejalmaganini tekshiring.

## Jamoa sizdan nima kutadi

Hōrensō ikki tomonlama ishlaydi. Hisobotlar kelib tursa-yu, javob boʻlmasa, loyiha jim pudratchi bilan ishlagandagidek toʻxtab qoladi.

- **Qaror qabul qiladigan bitta odam.** Yoki qarorni tez olib bera oladigan bitta kontakt. Umumiy chatda bir-biriga zid koʻrsatma beradigan uchta sherik — muddat buzilishining koʻp uchraydigan sababi.
- **Kelishilgan muddatda javob.** Masalan, savollarga bir ish kuni ichida, variantli qarorlarga ikki-uch kunda. Javob kechiksa, muddat ham suriladi va jamoa buni hisobotda yozishga haqli.
- **Kirish huquqlari.** Click, Payme yoki Uzum kabinetlari, 1C, hosting, domen, App Store va Google Playdagi dasturchi akkauntlari. Bularning barchasi sizning kompaniyangiz nomiga rasmiylashtiriladi, jamoaga kirish huquqini siz berasiz.
- **Materiallar.** Matnlar, narxlar, rasmlar. Interfeys oʻzbek va rus tilida boʻlsa, ikkala tilda.
- **Aniq fikr.** «Hammasi qandaydir notoʻgʻri» emas, «Samsungda toʻlov tugmasi bosilmayapti, skrinshot ilova qildim».
- **Oʻz yangiliklaringiz.** Jarayon oʻzgardi, byudjet qisqardi, yangi filial ochilishi surildi — bu ham renraku, jamoa buni darhol bilishi kerak.

## Pudratchidagi xavotirli belgilar

- Haftalab xabar yoʻq, javob faqat sizning savolingizga keladi.
- Bir oy davomida «deyarli tayyor» yoki «90 foiz».
- Birinchi demo faqat loyiha oxirida, unga qadar koʻradigan narsa yoʻq.
- Qarorlar qoʻngʻiroqda qabul qilinadi, yozma hech narsa qolmaydi.
- Hisobotlarda havolasiz va natijasiz «…ustida ishladik» degan gaplar.
- Muammo haqida hisob-faktura bilan birga eshitasiz: «murakkabroq chiqdi, qoʻshimcha toʻlov kerak», holbuki murakkablik ancha oldin koʻringan.
- Sinov versiyasiga va kod repozitoriysiga kirish huquqingiz yoʻq.
- Loyihangiz ustida aniq kim ishlayotganini ayta olishmaydi.

Oʻz holatingizni tanigan boʻlsangiz, bir necha kun ichida hozir nima ishlayotganini koʻrsatishni va funksiyalar roʻyxatini holatlari bilan yuborishni soʻrang. Qila olishmasa, bu ham javob.

## Shartnomadan oldin nimani soʻrash kerak

Frilanser, studiya yoki IT autsorsing kompaniyasi boʻladimi, savollar bir xil:

1. Qanchalik tez-tez va qanday shaklda hisobot berasiz? Mijoz maʼlumotlarisiz hisobot namunasini koʻrsam boʻladimi?
2. Mening kontaktim kim va u taʼtilda yoki kasal boʻlganda oʻrnini kim bosadi?
3. Vazifalar qayerda yuritiladi va menda kirish huquqi boʻladimi?
4. Qarorlar qayerda yoziladi, hajm va narxdagi oʻzgarishlar qanday kelishiladi?
5. Birinchi demo qachon va keyin qanchalik tez-tez?
6. Ulgurmayotganingizni koʻrsangiz, nima qilasiz?
7. Hisobot va demo qaysi tilda boʻladi: oʻzbekchami yoki ruschami?
8. Mendan nima va qaysi muddatda kerak boʻladi?

Javoblarni shartnomaga yoki uning ilovasiga kiriting: hisobot va demo qanchalik tez-tez boʻlishi, ikki tomonning javob muddatlari, oʻzgarishlar faqat yozma kelishilishi. Hajm hali oʻzgarishi mumkin boʻlsa, shartnomaning oʻzini qanday tuzish haqida: [Qatʼiy narx yoki soatbay toʻlov: dasturlash shartnomasini qanday tuzish kerak](/blog/fixed-price-or-hourly/).

Qilich jamoasining haftalik hisoboti qanday koʻrinishini koʻrmoqchi boʻlsangiz, inbox@qilich.com manziliga yozing, namunasini yuboramiz.
