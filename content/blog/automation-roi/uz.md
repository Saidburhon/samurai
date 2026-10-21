---
slug: automation-roi
lang: uz
title: "Avtomatlashtirish oʻzini oqlaydimi: oddiy hisob-kitob usuli"
description: "Dastur yoki botga sarflangan pul qachon qaytadi: tejalgan soatlar, kamaygan xatolar, yoʻqotilmagan buyurtmalar va doimiy xarajatlarni hisoblash."
date: 2026-10-21
tags: [avtomatlashtirish, samaradorlik, ROI, biznes jarayonlari, Telegram-bot]
related: [business, telegram, ai]
reading_minutes: 10
---

Pudratchi buyurtmalar uchun Telegram-bot smetasini yubordi, unda faqat bitta umumiy summa bor. CRM sotuvchisi «uch oyda oʻzini oqlaydi» deydi, lekin hisob-kitobini koʻrsatmaydi. Buxgalter esa qoʻllab-quvvatlash uchun har oy toʻlanadigan pul qayerdan olinishini soʻrayapti. Dastur oʻzini oqlaydimi, yoʻqmi, buni bilish uchun konsultant ham, murakkab moliyaviy model ham shart emas. Bitta jadval, ikki haftalik kuzatuv va halol taxminlar yetadi. Quyida shunday usulni koʻrib chiqamiz: biznes egasi yoki moliyachi avtomatlashtirish samaradorligini loyiha boshlanishidan oldin oʻzi hisoblaydi, ishga tushirgandan keyin esa hisob toʻgʻri chiqqanini tekshiradi.

Butun hisob-kitob bitta formulaga tushadi:

**Oʻzini oqlash muddati (oylarda) = bir martalik xarajatlar ÷ (oylik samara − tizimni ishlatishning oylik xarajatlari).**

Samara uch manbadan keladi: tejalgan vaqt, kamaygan xatolar va endi yoʻqotilmayotgan tushum. Taqdimotlarda koʻp tilga olinadigan ROI ham shu raqamlardan hisoblanadi, lekin kichik biznes egasiga «pul necha oyda qaytadi» degan savolga javob koʻproq kerak.

## Boshlashdan oldin hozirgi holatni oʻlchang

Biznes jarayonlarini avtomatlashtirishdan oldin hozirgi holat oʻlchanmasa, yarim yildan keyin oʻzingizga ham, sherigingizga ham, pudratchiga ham hech narsani isbotlab boʻlmaydi. Hamma «avval yomonroq edi» deb eslaydi, lekin qanchaga yomonroq boʻlganini hech kim ayta olmaydi. Shuning uchun loyiha boshlanishidan ikki hafta oldin, iloji boʻlsa shartnoma imzolashdan ham oldin yozib borishni boshlang.

Nimani yozib borish kerak:

- **Hajm.** Kuniga nechta buyurtma, soʻrov yoki hujjat keladi va qaysi kanaldan: Telegram, telefon, Instagram, sayt.
- **Bitta amalga ketadigan vaqt.** Xodimning gapiga qarab emas, sekundomer bilan: 20–30 ta oddiy holatni oʻlchab, oʻrtachasini oling. Odamlar deyarli har doim amaldagidan kamroq aytadi, chunki boshqa ishga chalgʻish va qoʻshimcha savollarga ketgan vaqtni hisobga olmaydi.
- **Xatolar.** Har bir holat bitta qatorda: nima boʻldi, kim payqadi, nima qilishga toʻgʻri keldi va bu qanchaga tushdi — kuryerning qayta borishi, chegirma, hisobdan chiqarish, tuzatishga ketgan vaqt.
- **Javobsiz qolgan murojaatlar.** Kechasi va dam olish kunlari nechta xabar kelgan, ularga qancha vaqtdan keyin javob berilgan va yozganlardan nechtasi oxir-oqibat buyurtma bergan.
- **Ortiqcha ish soatlari.** Kim va qancha vaqt ishda ushlanib qoladi, ayniqsa kun va oy oxirida.

Ikki hafta — oʻrtacha yechim: bir haftada xatolar juda kam yigʻiladi, bir oyda esa odamlar yozishdan charchaydi. Oddiy haftalarni tanlang: bayram, aksiya yoki mavsum avjiga toʻgʻri kelmasin. Biror koʻrsatkichni oʻlchashning iloji boʻlmasa, shunday deb yozing: «bilmaymiz». Bu xayoldan raqam qoʻyishdan halolroq va shu banddan samara hisoblamaslik kerakligini ham darrov koʻrsatadi.

Qaysi jarayonni avtomatlashtirishni hali tanlamagan boʻlsangiz, avval [Kichik biznesda birinchi navbatda nimani avtomatlashtirish kerak](/blog/what-to-automate-first/) maqolasini oʻqing.

## 1-manba: tejalgan soatlar

Eng tushunarli qism, lekin eng koʻp xato ham shu yerda qilinadi.

Formula: **(oldin bir amalga ketgan daqiqalar − keyin ketadigan daqiqalar) × oyiga amallar soni ÷ 60 × xodimning bir soati narxi.**

Bir soat narxini toʻliq hisoblang: maoshga ish beruvchi toʻlaydigan ijtimoiy soliqni qoʻshib, haqiqatda ishlangan soatlarga boʻling. Haftasiga besh kun sakkiz soatdan ishlansa, oyiga 170 soatga yaqin chiqadi, taʼtil va kasallik kunlarini ayirsangiz, undan ham kam. «Keyin ketadigan daqiqalar»ni tekshiruv bilan birga oling: operator botdan kelgan har bir buyurtmani koʻrib, tasdiqlab chiqsa, bu ham vaqt.

Asosiy tuzoq — faqat qogʻozda boʻshaydigan soatlarni hisobga qoʻshish. Operatorda qoʻngʻiroqlar orasida uch daqiqadan boʻshab qolsa, qogʻozda oyiga oʻnlab soat chiqadi, hayotda esa bu oʻsha sakkiz soatlik ish kuni, faqat tinchroq. Boʻshagan vaqt pulga faqat quyidagi hollarda aylanadi:

- buyurtmalar koʻpaygan boʻlsa ham, keyingi xodimni yollamaysiz;
- ortiqcha ish soatlarini yoki kechki smenani qisqartirasiz;
- xodim avval hech kim qilmagan yoki qimmatroq xodim qilgan aniq ishni oʻz zimmasiga oladi: mijozlarga qoʻngʻiroq qilish, toʻlovlarni solishtirish, xarid.

Bularning birortasi sizga toʻgʻri kelmasa, vaqt boʻyicha samarani nol deb yozing yoki faqat kafolat bera oladigan qismini oling. Egasining vaqtini esa operator stavkasi bilan hisoblamang: uning qiymati boshqacha, bu haqda pastda, formula hisobga olmaydigan narsalar boʻlimida.

## 2-manba: kamroq xato

Qoʻlda ishlaganda xatolar oldindan maʼlum joylarda chiqadi: qayta yozishda, ishni bir odamdan boshqasiga yoki smenadan smenaga topshirishda, uzun chatdan kerakli xabarni qidirishda. Odatiy yoʻqotishlar:

- notoʻgʻri buyurtma yoki manzil: kuryer ikkinchi marta boradi, baʼzan esa uzr sifatida mijozga mahsulot tekin beriladi;
- buyurtmaga bogʻlanmagan toʻlov: mijoz kartaga oʻtkazgan, hisobda esa qarzdor boʻlib turibdi yoki aksincha; unutilgan qarzlar ham shu yerga kiradi;
- hisob-fakturada notoʻgʻri STIR yoki narx: keyin uni Didox yoki Faktura.uz orqali tuzatib, qaytadan yuborishga toʻgʻri keladi;
- hisobdan chiqarish: qoldiqni hech kim koʻrmagani uchun mahsulotning yaroqlilik muddati oʻtib ketgan;
- hujjatlardagi xatolar va shartnoma muddatlari buzilgani uchun jarima va penyalar.

Formula: **bitta xato narxi × oyiga necha marta takrorlanadi × yangi tizim bunday xatolarning qancha qismini haqiqatan bartaraf qiladi.**

Oxirgi koʻpaytuvchi muhim. Bot qayta yozishdagi xatolarga va yoʻqolgan xabarlarga barham beradi, lekin mijozning oʻzi notoʻgʻri yozgan manzilni tuzatib qoʻymaydi. Ikki haftalik xatolar roʻyxatini koʻzdan kechiring va har birining yonida halol belgilang: yangi tizim bilan bu xato yoʻqoladimi yoki yoʻqmi. Xato narxini toʻgʻridan-toʻgʻri va tekshirsa boʻladigan qilib oling: qayta qatnov, mahsulot, chegirma, tuzatishga ketgan soatlar. Butunlay ketib qolgan mijozni bu yerga qoʻshmang: bunday yoʻqotishlar keyingi boʻlimga tegishli.

## 3-manba: endi yoʻqotilmaydigan tushum

Bu eng jozibali va eng xavfli manba: bu yerda xohlagan raqamni yozib qoʻyish eng oson. Shuning uchun ehtiyot boʻlib hisoblang.

Pul qayerda yoʻqoladi:

- kechasi va dam olish kunlari kelgan xabarlarga ertalab javob berilgan, mijoz esa bu orada boshqa joydan buyurtma qilib boʻlgan;
- kunduzi sekin javob berilgan: odam narxni soʻragan, yigirma daqiqa kutib, ketib qolgan;
- eng gavjum soatlarda qoʻngʻiroqlar javobsiz qolgan;
- mijoz buyurtmani rasmiylashtirishni boshlagan, lekin oxiriga yetkazmagan. Buni faqat ishga tushirgandan keyin, botda yoki saytda sotuv voronkasi paydo boʻlgach oʻlchash mumkin.

Qanday hisoblash kerak: «oldin» oʻlchovidan mijoz baribir buyurtma bermagan murojaatlar sonini oling va uni buyurtma summasiga emas, bitta buyurtmadan qoladigan marjaga koʻpaytiring. Masalan, buyurtma narxi 50 000 soʻm, xarid, kuryer va qadoq xarajatidan keyin esa sizda 20 000 soʻm qoladi: hisobga 20 000 kiradi. Keyin yangi tizim bu odamlarning faqat bir qismini, masalan yarmini yoki undan kamini qaytaradi, deb hisoblang. Kimdir baribir qoʻngʻiroq qilishni afzal koʻradi, kimdir esa darhol javob olsa ham ketib qolardi.

Nima qilmaslik kerak: faqat qulay bot paydo boʻlgani uchun sotuv oʻsadi, deb rejaga yozmang. Yangi mijozlar reklama, assortiment va narx tufayli keladi. Loyiha faqat sotuv oʻssagina oʻzini oqlasa, bu endi hisob-kitob emas, umid.

## Faqat ishlab chiqish emas, barcha xarajatlar

Biznesni avtomatlashtirish narxi deganda koʻpincha pudratchi smetasidagi summa tushuniladi, lekin bu roʻyxatning faqat birinchi qatori. Birinchi yil uchun toʻliq roʻyxat:

- **Ishlab chiqish yoki sozlash.** Bir martalik toʻlov. Narxni eng koʻp oshiradigan narsalar: integratsiyalar (1C va toʻlov tizimlari: Click, Payme va Uzum har biri alohida ulanadi), rollar va kirish huquqlari soni, xodimlar uchun panel, interfeysning ikki tilda boʻlishi va hisobotlar. Bitta jarayon uchun Telegram-bot odatda ikki haftadan ikki oygacha ishlab chiqiladi, toʻlov tizimi bilan merchant shartnomasini rasmiylashtirish esa baʼzan dasturlashdan ham uzoqroq choʻziladi.
- **Litsenziya va obuna.** amoCRM va Bitrix24 kabi tayyor CRMlar uchun har oy toʻlanadi: amoCRMda har bir foydalanuvchi uchun, Bitrix24 bulut versiyasida esa foydalanuvchilar soni cheklangan tarif uchun. 1Cning oʻz litsenziyalari va xizmat koʻrsatishi bor. Oʻzingiz uchun ishlab chiqilgan tizimda litsenziya toʻlovi boʻlmasligi mumkin, lekin unda qoʻllab-quvvatlash qimmatroq tushadi.
- **Server va saqlash.** Tizimda mijozlarning ismi, telefoni va manzili saqlansa, «Shaxsga doir maʼlumotlar toʻgʻrisida»gi qonunga koʻra Oʻzbekiston fuqarolariga oid bunday maʼlumotlar Oʻzbekistondagi serverlarda saqlanishi kerak. Bunga zaxira nusxalar va monitoringni ham qoʻshing. Batafsil: [Shaxsiy maʼlumotlarni Oʻzbekistonda saqlash](/blog/personal-data-in-uzbekistan/).
- **AI uchun toʻlov.** Loyihada AI ishlatilsa, provayder matn hajmi uchun pul oladi va bu summa murojaatlar soni bilan birga oʻsadi. Demo boʻyicha emas, oʻz hajmingiz boʻyicha hisoblang: soʻrov va javob uzunligi × oyiga soʻrovlar soni × provayder narxi. Batafsil: [Sunʼiy intellekt xarajatlarni qayerda haqiqatan kamaytiradi](/blog/ai-to-cut-costs/).
- **Komissiya va SMS.** Toʻlov tizimlari har bir toʻlovdan komissiya oladi. Telegramdan foydalanmaydigan mijozlarga yuboriladigan SMS ham pulli.
- **Oʻrgatish va oʻtish davri.** Oʻqitishga ketadigan soatlar, yoʻriqnomalar, eski va yangi usul parallel ishlab, hammasi sekinroq ketadigan bir-ikki hafta. Bu xarajatni deyarli har doim kam baholashadi.
- **Birinchi yildagi qoʻllab-quvvatlash.** Xatolarni tuzatish, kichik oʻzgartirishlar, Telegram, toʻlov tizimlari yoki 1Cdagi oʻzgarishlardan keyingi yangilanishlar. Qoʻllab-quvvatlash narxini ish boshlanishidan oldin pudratchidan yozma ravishda soʻrang. Unga nimalar kirishi haqida: [Ishga tushirilgandan keyin: ilova va saytni qoʻllab-quvvatlashga nima kiradi](/blog/maintenance-after-launch/).
- **Sizning vaqtingiz.** Uchrashuvlar, savollarga javob, test, ishni qabul qilish. Buning uchun hech kimga pul toʻlamaysiz, lekin egasi ikki hafta loyiha bilan band boʻlsa, bu ham xarajat.

Hammasini ikki ustunga ajrating: bir martalik va oylik. Oylik xarajatlar har oy samaradan ayriladi va foydali loyihani zararliga aylantiradigan narsa koʻpincha aynan shular: katta abonent toʻlovi kichik tejamni yeb qoʻyadi.

## Hisob-kitob misoli

Toshkentdagi shartli ichimlik suvi yetkazib berish xizmatini olaylik. Quyidagi barcha raqamlar tushuntirish uchun oʻylab topilgan: bu bozor narxlari ham, bizning smetamiz ham emas, usulni koʻrsatishga qulay yaxlit sonlar.

**Hozir qanday ishlashadi.** Oyiga 3 000 ga yaqin buyurtma, telefon va Telegram orqali. Operatorlar buyurtmani qabul qiladi, jadvalga yozadi va kuryerlar guruhiga yuboradi, bir buyurtmaga oʻrtacha 4 daqiqa ketadi. Ikki haftalik oʻlchovda 15 ta xato yigʻildi (notoʻgʻri manzil, notoʻgʻri yozilgan miqdor, unutilgan buyurtma), yaʼni oyiga 30 ga yaqin. Har biri oʻrtacha 60 000 soʻmga tushadi: kuryer qayta boradi va mijozga bir idish suv sovgʻa qilinadi. Oyiga 80 ga yaqin odam kechqurun yoki tunda yozgan, javobni ertalab olgan va buyurtma bermagan.

**Rejada nima bor.** Buyurtmalar uchun Telegram-bot: oldingi buyurtmani bitta tugma bilan takrorlash, Click va Payme orqali toʻlov, kuryerlar uchun manzillar roʻyxati va egasiga kechki hisobot. Qoʻngʻiroqlar qoladi, lekin operatorlar bunday buyurtmalarni ham oʻsha botga kiritadi. Buyurtmalarning koʻp qismini bot oʻzi qabul qilgani uchun operatorlarning bir buyurtmaga sarflaydigan oʻrtacha vaqti 4 daqiqadan 1,5 daqiqaga tushadi: (4 − 1,5) × 3 000 = 7 500 daqiqa, yaʼni oyiga 125 soat.

| Modda | Qanday hisoblandi | Oyiga, soʻm |
|---|---|---|
| Tejalgan vaqt | 125 soatdan faqat mijozlarga qoʻngʻiroq qilish va qaytariladigan idishlarni hisoblashga ketadigan 60 soat olindi; bir soat 35 000 soʻm: 60 × 35 000 | 2 100 000 |
| Kamroq xato | 30 ta xatoning yarmi; 15 × 60 000 | 900 000 |
| Saqlab qolingan buyurtmalar | 80 ta yoʻqotilganning yarmi; 40 × 20 000 marja | 800 000 |
| **Jami samara** | | **3 800 000** |
| Oʻzbekistondagi server | | −400 000 |
| Qoʻllab-quvvatlash va kichik oʻzgartirishlar | | −700 000 |
| Komissiya va SMS | | −200 000 |
| **Sof samara** | | **2 500 000** |

Bir martalik xarajatlar: ishlab chiqish 32 mln soʻm, oʻrgatish va oʻtish davri yana 3 mln, jami 35 mln soʻm. Bu misolda litsenziya yoʻq, chunki bot shu biznes uchun ishlab chiqilgan; tayyor CRM ishlatilganda yuqoridagi jadvalga oylik obuna toʻlovi qatori qoʻshilardi.

**Oʻzini oqlash muddati: 35 000 000 ÷ 2 500 000 = 14 oy.**

Bu hisobdan nima koʻrinadi:

1. **Birinchi yil oxirida loyiha hali minusda.** 12 oyda sof samara 30 mln boʻladi, sarflangani esa 35 mln. Plyusga 15-oyda chiqadi. Faqat birinchi yilga qarasangiz, qaror boshqacha boʻladi, shuning uchun loyihani necha yillik davrda baholashingizni oldindan hal qiling.
2. **Birinchi bir-ikki oyda samara kamroq boʻladi:** mijozlar botga, xodimlar yangi tartibga koʻnikib oladi. Muddatga yana bir-ikki oy qoʻshib qoʻyish realroq.
3. **Deyarli hammasi soatlarga bogʻliq.** Agar boʻshagan vaqtdan 60 emas, atigi 30 soat foydali ishga ketsa, sof samara oyiga 1 450 000 soʻmga tushadi va muddat taxminan ikki yilgacha choʻziladi. Boʻshagan vaqt umuman ishlatilmasa, oyiga 400 000 soʻm qoladi va muddat yetti yildan oshadi, yaʼni amalda loyiha oʻzini oqlamaydi. Shuning uchun eng muhim taxminni birinchi boʻlib tekshiring: boʻshagan vaqtda operatorlar aynan nima bilan shugʻullanadi.

Moliyachiga ROI kerak boʻlsa: uch yilda samara 3,8 mln × 36 = 136,8 mln, barcha xarajatlar (bir martalik 35 mln va oyiga 1,3 mln) 35 + 1,3 × 36 = 81,8 mln, ROI = (136,8 − 81,8) ÷ 81,8 ≈ 67 %. Lekin uch yil — bu jarayon shu vaqt davomida oʻzgarmaydi degan taxmin.

Qaror qabul qilish uchun oʻzini oqlash muddatini jarayon katta oʻzgarishlarsiz yana qancha vaqt shu holicha ishlashi bilan solishtiring. Yana uch yil shunday ishlashingizga ishonchingiz komil boʻlsa, 14–16 oy oqilona muddat. Bir yildan keyin yetkazib berish tartibini oʻzgartirmoqchi boʻlsangiz, loyihani tezroq oʻzini oqlaydigan hajmgacha qisqartiring: masalan, avval faqat buyurtma qabul qilish va hisobot, kuryerlar roʻyxatisiz.

## Formula nimani hisobga olmaydi

Avtomatlashtirish beradigan foydaning bir qismi jadvalga sigʻmaydi. Uni hisob-kitob yonida sanab oʻting, lekin pul bilan baholamang.

- **Egasining vaqti va xotirjamligi.** Kechki soat oʻn birda qoʻngʻiroqlarga javob berish, har bir buyurtmani tekshirish shart emas, bir necha kunga dam olishga ketsa ham boʻladi.
- **Qaror uchun maʼlumot.** Buyurtmalar bitta bazaga yigʻilganda qaysi tumanlarda ular koʻproq, qaysi soatlarda kuryer yetishmasligi, qaysi mijozlar buyurtma berishni toʻxtatgani koʻrinadi. Bu maʼlumotning qiymati keyinroq bilinadi va uni oldindan aytib boʻlmaydi.
- **Bitta odamga kamroq bogʻliqlik.** Doimiy mijozlarning manzili va alohida kelishuvlarni faqat katta operator bilsa, uning ishdan ketishi butun biznes uchun xavf.
- **Mijozning taassuroti.** «Bir soatdan keyin qoʻngʻiroq qiling» oʻrniga buyurtma tasdigʻi va buyurtma holatini koʻrish imkoni.

Hisob-kitob chegarada turganda, masalan muddat ikki yilga yaqin, jarayon esa barqaror boʻlsa, bu bandlar tanlashga yordam beradi. Lekin ular raqamlar boʻyicha hech qachon oʻzini oqlamaydigan loyihani oqlamasligi kerak. «Xotirjamlik»siz hisobda minus chiqsa, bu jadvalga yana bir qator qoʻshishga emas, loyiha hajmini kichraytirishga sabab.

## Ishga tushirgandan keyin tekshiring

Loyiha boshlanishidan oldingi hisob — bu prognoz. U biror narsaga arzishi uchun qachon va qanday tekshirishni oldindan kelishib oling.

1. **Sanani belgilang.** Odatda ishga tushirgandan ikki-uch oy keyin: birinchi haftalar koʻnikishga ketadi va ulardagi raqamlar haqiqiysidan past chiqadi.
2. **Oʻsha narsani oʻsha usulda oʻlchang.** Oʻsha koʻrsatkichlar, xuddi shunday ikki hafta, oʻsha sekundomer. Hammasini birlikka keltiring: bir buyurtmaga daqiqa, 100 ta buyurtmaga xato, javobsiz murojaatlar ulushi. Yozda suvni qishdagidan koʻproq buyurtma qilishadi, toʻgʻridan-toʻgʻri solishtirsangiz, botga hech qanday aloqasi yoʻq oʻsishni koʻrasiz.
3. **Tizimdan foydalanishyaptimi, tekshiring.** Buyurtmalarning qancha qismi bot orqali keladi, xodimlar «har ehtimolga qarshi» parallel jadval yuritmayaptimi. Eski usul yashab turgan ekan, ishlab chiqish qanchaga tushgan boʻlmasin, tejam boʻlmaydi.
4. **Haqiqiy xarajatlarni reja bilan solishtiring:** server, qoʻllab-quvvatlash, komissiyalar, AI uchun toʻlovlar.
5. **Har bir funksiya boʻyicha qaror qiling:** qoldirish, yaxshilash yoki oʻchirish. Hech kim foydalanmaydigan funksiya ham har bir yangilanishda qoʻllab-quvvatlash va tekshiruvni talab qiladi.

Natijani bir sahifaga yozib qoʻying: nima kutilgan edi, nima chiqdi va nega. Keyingi loyiha haqida qaror qilganda bu juda asqatadi. Oʻlchov natijasiga koʻra kichik tuzatishlar, qayta oʻlchash, yana tuzatishlar — bu kaizen. Pudratchi bilan uni qisqa muntazam hisobotlar orqali olib borish qulay: nima qilindi, nima xalaqit beryapti, sizdan qanday qaror kerak. Batafsil: [Dasturiy taʼminotda kaizen](/blog/kaizen-in-software/).

Qaysi jarayonni avtomatlashtirmoqchi ekaningizni, u oyiga necha marta takrorlanishini va har safar qancha vaqt olishini qilich.com saytidagi SamurAIga yozing: har qanday hisob-kitob shu ikki raqamdan boshlanadi.
