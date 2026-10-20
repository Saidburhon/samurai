---
slug: personal-data-in-uzbekistan
lang: uz
title: "Shaxsiy maʼlumotlarni Oʻzbekistonda saqlash: sayt, ilova va bot egalari uchun"
description: "Oʻzbekiston fuqarolarining shaxsiy maʼlumotlari mamlakatdagi serverlarda saqlanishi kerak. Bu sayt, ilova, bot va CRM uchun amalda nimani anglatadi."
date: 2026-10-21
tags: [shaxsiy maʼlumotlar, qonun, hosting, xavfsizlik, backend, Telegram-bot]
related: [backend, web, mobile, telegram]
reading_minutes: 10
---

Sayti, boti yoki CRMi bor deyarli har bir biznes shaxsiy maʼlumot yigʻadi: ism, telefon raqami, yetkazib berish manzili, buyurtmalar tarixi. Qonun Oʻzbekiston fuqarolarining bunday maʼlumotlarini jismonan Oʻzbekistonda turgan serverlarda saqlashni talab qiladi. Amalda esa botning bazasi koʻpincha xorijiy hostingda turadi, arizalar bulutli CRMga tushadi, mijozlarning telefon raqamlari «kuryerlar uchun» ochilgan Google Jadvalda yotadi, zaxira nusxalar esa provayder sukut boʻyicha qayerga yuborsa, oʻsha yoqqa ketadi. Biznes egasi bundan koʻpincha dasturchidan toʻgʻridan-toʻgʻri soʻragandagina xabar topadi. Quyida yuristning emas, muhandisning nigohi: oddiy mahsulotda nimalar shaxsiy maʼlumot hisoblanadi, ular aslida qayerlarga borib qoladi va asosiy nusxa Oʻzbekistonda turishi uchun tizimni qanday qurish kerak. Sizning holatingiz boʻyicha huquqiy xulosani yurist beradi.

## Qonun nima deydi, qisqacha

- **Asosiy qonun.** «Shaxsga doir maʼlumotlar toʻgʻrisida»gi Oʻzbekiston Respublikasining 2019-yil 2-iyuldagi OʻRQ-547-son Qonuni. Koʻpchilik uni qisqacha shaxsiy maʼlumotlar toʻgʻrisidagi qonun deydi. U shaxsiy maʼlumot nima ekanini, baza mulkdori va operatori kimligini, qachon odamning roziligi kerakligini va odamning huquqlarini belgilaydi: oʻzi haqida nima saqlanayotganini bilish, maʼlumotni tuzattirish, roziligini qaytarib olish, oʻchirishni talab qilish.
- **Lokalizatsiya talabi.** 2021-yilda qonunga 27¹-modda qoʻshildi. Oʻzbekiston fuqarolarining shaxsiy maʼlumotlarini axborot texnologiyalari yordamida, jumladan internetda qayta ishlaydigan mulkdor va operator ularni Oʻzbekiston hududida jismonan joylashgan texnik vositalardagi bazalarda yigʻishi, tizimlashtirishi va saqlashi shart. Shaxsiy maʼlumotlarni lokalizatsiya qilish deganda aynan shu talab tushuniladi.
- **Roʻyxatdan oʻtkazish.** Bunday bazalar Shaxsga doir maʼlumotlar bazalari davlat reyestrida roʻyxatdan oʻtgan boʻlishi kerak. Qonun vakolatli organ sifatida Vazirlar Mahkamasi huzuridagi Davlat personallashtirish markazini koʻrsatadi. Tartib va masʼul idoralar vaqt oʻtishi bilan oʻzgarib turadi, shuning uchun shaxsiy maʼlumotlar bazasini roʻyxatdan oʻtkazishning amaldagi tartibini yuristdan aniqlab oling.
- **Javobgarlik.** Qoidabuzarlik uchun maʼmuriy va jinoiy javobgarlik nazarda tutilgan, servisga kirish cheklanishi ham mumkin. 2021-yilda bir nechta yirik xorijiy ijtimoiy tarmoqlarga kirish aynan lokalizatsiya talabiga tayanib cheklangan edi.

Qonunning barcha oʻzgarishlar kiritilgan amaldagi matnini [lex.uz](https://lex.uz) saytidan toping. Boshqalarning talqinini emas, jumladan bu maqolani ham emas, asl matnni oʻqing. Bu maqola yuridik maslahat emas: u yurist va dasturchiga beriladigan savollarni tayyorlashga yordam beradi.

## Mahsulotingizda nimalar shaxsiy maʼlumot hisoblanadi

Qonun shaxsiy maʼlumotni keng tushunadi: muayyan odamga tegishli yoki uni aniqlashga imkon beradigan har qanday axborot. Oddiy bot, ilova yoki CRMda bular:

- ism, telefon raqami, e-mail, tugʻilgan sana;
- Telegram ID va username: odam telefon qoldirmagan boʻlsa ham, ular orqali uni topish mumkin;
- yetkazib berish manzillari va mijoz botga yuborgan geolokatsiya;
- buyurtmalar tarixi. Dorixona yoki klinikada undan odam nima bilan kasallangani koʻrinadi, sogʻliq haqidagi maʼlumotlarni esa qonun alohida, ancha nozik toifaga kiritadi;
- rasm va hujjatlar: shaxsni tasdiqlash uchun selfi, klinikadagi «oldin va keyin» rasmlari, pasport nusxalari;
- pasport maʼlumotlari va JShShIR: mehmonxonalarda, klinikalarda, oʻquv markazlarida, muddatli toʻlov rasmiylashtirilganda;
- bolalar haqidagi maʼlumotlar: oʻquv markazlari, sport toʻgaraklari, xususiy maktablar;
- qoʻllab-quvvatlash xizmati bilan yozishmalar, ovozli xabarlar, qoʻngʻiroq yozuvlari;
- klub yoki ofisga yuz yoki barmoq izi orqali kirilsa, biometrik maʼlumotlar.

Xodimlar haqida alohida: 1Cdagi kadrlar hisobi va ish haqi, HR menejerga Telegramda keladigan nomzodlar anketalari ham shaxsiy maʼlumot.

Oddiy ish qoidasi: yozuvdan u kim haqida ekanini bilib olish mumkin boʻlsa, yurist boshqacha demaguncha uni shaxsiy maʼlumot deb hisoblang.

## Xarita: maʼlumotlar aslida qayerga ketadi

Mahsulot deyarli hech qachon bitta serverda turmaydi. Shartli misol: uchta filiali bor, sayt va Telegram-bot orqali yetkazib beradigan, buyurtmalarni bulutli CRMda yuritadigan restoran. Bitta buyurtma asosiy bazada, zaxira nusxalarda, CRMda, SMS-xabarda, sayt analitikasida, loglarda va, ehtimol, menejer kuryerlar uchun ochgan jadvalda iz qoldiradi.

Quyidagi jadvalni dasturchi bilan birga oʻz mahsulotingiz uchun toʻldiring. Odatda bitta uchrashuv yetadi.

| Qayerda | Qanday maʼlumot | Serverlar jismonan qayerda | Nimani tekshirish kerak |
|---|---|---|---|
| Sayt yoki botning asosiy bazasi | Mijozlar, buyurtmalar, manzillar | Hostingga bogʻliq | Shartnomada yozilgan davlat va data-markaz |
| Zaxira nusxalar | Bazaning toʻliq nusxasi | Koʻpincha asosiy serverdan boshqa joyda | Qayerga ketadi, qancha saqlanadi |
| CRM | Ism, telefon, yozishma, bitimlar | Bulutli CRMda vendorning serverlarida | Akkauntingiz qaysi davlatda saqlanadi |
| SMS, e-mail, push | Telefon, pochta manzili, matnlar | Mahalliy shlyuz yoki xorijiy servis | Matnga ortiqcha narsa tushadimi |
| Analitika va sessiya yozuvlari | Saytdagi harakatlar, baʼzan forma ichidagi matn | Odatda xorijda | Telefon uzatiladimi, maydonlar yashiriladimi |
| AI servislar | Yozishmalar, hujjatlar, murojaatlar | Odatda xorijda | Soʻrovda aynan nima ketadi |
| Loglar va xatolar monitoringi | Toʻliq soʻrovlar, telefon va manzil bilan | Koʻpincha xorijda | Shaxsiy maʼlumotlar tozalanadimi |
| Toʻlov provayderi | Summa, buyurtma raqami, baʼzan telefon | Click, Payme, Uzum — mahalliy kompaniyalar | Keragidan ortiq narsa uzatilmaydimi |
| Jadvallar va bulutli disklar | «Vaqtincha» ochilgan mijozlar roʻyxati | Odatda xorijda | Kim ochgan, kimda kirish huquqi bor |
| Noutbuklar va test serverlari | Ishchi bazadan olingan nusxalar | Istalgan joyda | Ishchi serverdan tashqarida haqiqiy maʼlumot bormi |

Telegramning oʻzi haqida alohida. Mijoz botga yozgan xabarlar Telegram serverlari orqali oʻtadi va bunga taʼsir qila olmaysiz. Taʼsir qila oladiganingiz — botingiz nimani saqlashi va keyin qayerga uzatishi. Foydali muhandislik tafsiloti: Telegram Mini App ichidagi forma maʼlumotni Telegram orqali xabar qilib emas, toʻgʻridan-toʻgʻri serveringizga yuboradi. Bot nozik narsani, masalan hujjat rasmini yigʻsa, buni backendi Oʻzbekistonda turgan mini ilova orqali qilgan maʼqul. Telegramning oʻzini kanal sifatida qonun nuqtai nazaridan qanday baholash kerakligini yurist bilan muhokama qiling.

Bunday xaritani tuzganda eng koʻp chiqadigan narsalar: boshqa davlatdagi zaxira nusxalar, ikki yil oldin «bir-ikki haftaga» ochilgan telefonlar jadvali va siz bilan allaqachon ishlamayotgan dasturchining noutbukidagi ishchi baza nusxasi.

## Oʻzbekistonda hosting

Toshkentda aloqa operatorlari va xususiy kompaniyalarning data-markazlari, virtual server beradigan bulutli provayderlar bor. Ayrimlarida boshqariladigan maʼlumotlar bazalari va fayl omborlari ham bor. Tanlov global bulutlarga qaraganda torroq, lekin kichik va oʻrta biznesning sayti, boti yoki ilovasi uchun Oʻzbekistonda server topish muammo emas.

Shartnoma imzolashdan oldin provayderdan nimalarni soʻrash kerak:

1. **Serverlar jismonan qayerda turadi.** Shahar va data-markaz. Maʼlumotlar Oʻzbekistonda saqlanishini shartnomaga yozib qoʻyishni soʻrang.
2. **Zaxira nusxalar qayerda.** Qanchalik tez-tez olinadi, qancha saqlanadi, qaysi davlatda turadi. Tiklashni sinab koʻrishganmi va u qancha vaqt oladi.
3. **Uzluksiz ishlash.** Qanday ishlash vaqti vaʼda qilinadi, elektr yoki kanal oʻchsa nima boʻladi, yirik uzilishlar boʻlganmi va mijozlarga bu haqda qanday xabar berishgan.
4. **Qoʻllab-quvvatlash.** Ish vaqti, aloqa kanali, til, kechasi va dam olish kunlari qanchalik tez javob berishadi.
5. **Xizmatga nima kiradi.** Faqat virtual servermi yoki boshqariladigan baza, fayl ombori, yuklamani taqsimlash, DDoSdan himoya, monitoring ham bormi. Provayderda yoʻq narsani jamoangiz oʻzi sozlaydi va oʻzi qarab turadi.
6. **Aloqa.** Mahalliy foydalanuvchilarda hammasi tez ochilishi uchun TAS-IXga ulanish va, tizim xorijiy APIlarga murojaat qilsa, xalqaro kanal tezligi.
7. **Hujjatlar.** Oʻzbekistondagi yuridik shaxs, shartnoma, soʻmda pul oʻtkazish yoʻli bilan toʻlov, Didox yoki Faktura.uz orqali elektron hisob-faktura. Buxgalteringiz rahmat aytadi.
8. **Qanday ketish mumkin.** Provayderni almashtirmoqchi boʻlsangiz, maʼlumotlar va server obrazlarini olib chiqib ketish mumkinmi.

Pul haqida ochiq gapiraylik. Kichik biznesning boti yoki sayti uchun server ijarasi odatda asosiy xarajat emas. Serverga qarash qimmatroq tushadi: yangilash, monitoring, zaxira nusxalarni tekshirish. Mahalliy provayderlarda tayyor boshqariladigan xizmatlar kamroq, shuning uchun bu ish global bulutdagidan koʻproq boʻlishi mumkin. Uni faqat bir martalik ishlab chiqish byudjetiga emas, oylik qoʻllab-quvvatlashga ham kiritib qoʻying.

## Xorijiy servislar: CRM, analitika, AI

Barcha xorijiy servislardan voz kechish odatda shart ham emas, imkoni ham yoʻq. Ishlaydigan tamoyil: maʼlumotlarning asosiy nusxasi Oʻzbekistonda turadi, har bir tashqi servis esa faqat usiz ishlay olmaydigan narsani oladi. Sizning sxemangizda aniq bir maʼlumotni xorijga uzatish mumkinmi, buni yurist hal qiladi: transchegaraviy uzatishni qonun alohida tartibga soladi.

- **CRM.** Vendor yoki hamkordan bulutli akkaunt maʼlumotlari jismonan qaysi davlatda saqlanishini soʻrang. Oʻzbekistonda boʻlmasa, variantlar: Oʻzbekistondagi oʻz serveringizda korobka versiya, mahalliy hostingdagi oʻz tizimingiz yoki CRM eng kam maydon oladigan sxema. Batafsil: [CRM tanlash](/blog/choosing-a-crm/).
- **Analitika.** Tashriflarni sanaydigan hisoblagichga ism va telefon kerak emas. Ularni hodisa va parametrlarda uzatmang, telefon oʻrniga ichki ID ishlating, sessiya yozuvlarida kiritish maydonlarini yashirishni yoqing.
- **AI servislar.** Kuchli modellarning aksariyati xorijdagi serverlarda ishlaydi. Yuborishdan oldin ism, telefon, manzil va hujjat raqamlarini [ISM], [TELEFON] kabi shartli belgilarga almashtiring, asl qiymatlarni esa javob kelgach oʻzingizda qaytarib qoʻying. Nozik vazifalar uchun oʻz serveringizda ishlaydigan modelni koʻrib chiqing. Batafsil: [Telegramda mijozlarga AI javob beradi](/blog/ai-support-in-telegram/).
- **SMS, e-mail va push.** Servisga raqam va matn kerak, xolos. Matnga ortiqcha narsa qoʻshmang: buyurtma tarkibi va manzil emas, «Buyurtmangiz tayyor». SMS uchun mahalliy shlyuzlar bor.
- **Loglar va xatolar monitoringi.** Xato haqidagi hisobotga butun soʻrov telefon va manzil bilan birga oson tushib qoladi. Yuborishdan oldin filtrlashni va qisqa saqlash muddatini sozlang.
- **Xarita va geokodlash.** Koordinatani aniqlash uchun yuborgan manzilingiz tashqi servisga ketadi. Manzilni ism va telefonsiz yuboring.

Har bir servisning shartlarini ham oʻqing: maʼlumotni qayerda saqlaydi, uni modellarni oʻqitish uchun ishlatadimi, servisdan voz kechganda hammasini qanday oʻchirish mumkin.

## Rozilik va maxfiylik siyosati

Qonun koʻp hollarda shaxsiy maʼlumotlarni qayta ishlash uchun odamning roziligini talab qiladi. Amalda bu shunday koʻrinadi:

- **Botda:** raqam soʻrashdan oldin bot u nima uchun kerakligini qisqa tushuntiradi, siyosatga havola va «Roziman» tugmasini beradi. Raqamning oʻzini mijoz «Kontaktni ulashish» tugmasi bilan yuboradi.
- **Sayt va ilovada:** forma yonida oldindan belgilanmagan alohida katakcha va siyosatga havola.
- **Reklama va aksiya xabarlari** uchun buyurtma berishdagi rozilik yetmaydi, alohida rozilik kerak.
- **Rozilik qayd etiladi:** kim, qachon va matnning qaysi versiyasini qabul qilgan. Busiz rozilik olinganini isbotlash qiyin.

Maxfiylik siyosati oddiy tilda, oʻzbek va rus tillarida, ikkala versiyada bir xil maʼnoda yoziladi:

1. siz kimsiz: kompaniya nomi, STIR, kontaktlar;
2. qanday maʼlumotlar yigʻasiz;
3. ularning har biri nima uchun kerak;
4. qayerda saqlanadi va kimga uzatiladi: toʻlov provayderiga, yetkazib berish xizmatiga, CRMga;
5. qancha muddat saqlanadi;
6. odam oʻzi haqida nima saqlanayotganini qanday bilishi, maʼlumotni tuzattirishi, roziligini qaytarib olishi va oʻchirishni soʻrashi mumkin: Telegram, telefon yoki e-mail orqali;
7. oxirgi oʻzgartirish sanasi.

Internetdan olinib, avtomatik tarjima qilingan shablon toʻgʻri kelmaydi: u boshqa birovning tizimini tasvirlaydi. Siyosat sizning maʼlumotlar xaritangiz asosida yoziladi, yurist esa uni tekshiradi.

Soʻrov boʻyicha oʻchirish amalda ishlashi kerak. Maʼlumotlar asosiy bazada, CRMda va xabarnoma servisida oʻchirilishi yoki anonimlashtirilishi, ular bor zaxira nusxalar esa saqlash muddati tugashi bilan yoʻq qilinishi kerak. Baʼzi maʼlumotlarni boshqa qonunlarga koʻra saqlashga toʻgʻri keladi, masalan hisob-fakturalar va fiskal cheklarni. Bu normal holat, lekin nima oʻchirilishi, nima anonimlashtirilishi va nima qolishini oldindan hal qiling.

## Buni boshidanoq hisobga oling

Yangi loyihada lokalizatsiya deyarli hech narsaga tushmaydi: bu hosting tanlash va bir nechta arxitektura qarori, odatda loyiha ichida bir necha kunlik ish. Ishlab turgan tizimni koʻchirish esa alohida loyiha: bitta bazali bot uchun bir-ikki haftadan tortib, CRM, analitika va integratsiyalari bor tizim uchun bir necha oygacha. Muddat bir nechta narsaga qarab choʻziladi: maʼlumotlar nechta joyda yotgani, baza hajmi, CRMni almashtirish kerakmi, tizim qancha vaqt toʻxtab tura oladi va uni qurgan dasturchi hamon aloqadami.

Lokalizatsiyani osonlashtiradigan qarorlar:

- **Bitta haqiqat manbai.** Mijozlarning asosiy bazasi Oʻzbekistondagi serveringizda. CRM, xabarnomalar va analitika faqat kerakli maydonlarni yoki ichki IDni oladi.
- **Barcha tashqi oqimlar backendingiz orqali.** Shunda qaysi maydon qayerga ketishi bitta joyda koʻrinadi. Ruxsat berilgan maydonlar roʻyxati «hammasini yuboraveramiz, kerak boʻlib qolar» degan yondashuvdan ishonchliroq.
- **Shaxsiy maʼlumotlar alohida.** Mijozlar maʼlumotlari, ayniqsa pasport va tibbiy maʼlumotlar uchun alohida jadvallar yoki servis: oʻz kirish huquqlari, shifrlash, hujjat nusxalari uchun alohida ombor.
- **Zaxira nusxalar mamlakat ichida.** Shifrlangan, boshqa data-markazda yoki Oʻzbekistondagi boshqa provayderda, tiklash muntazam tekshiriladi.
- **Ortiqcha narsasiz loglar.** Telefon va hujjat raqamlari yashiriladi, saqlash muddati qisqa.
- **Ishlab chiqish uchun soxta maʼlumotlar.** Test serverlari va dasturchilar noutbuklari generatsiya qilingan yoki anonimlashtirilgan maʼlumotlar bilan ishlaydi.
- **Rollar va harakatlar jurnali.** Maʼlumotlarni kim koʻrgani, yuklab olgani va oʻchirgani koʻrinib turadi.
- **Koʻchish oson boʻlsin.** Konteynerlar va kodda tasvirlangan infratuzilma: kerak boʻlsa, provayderni oylarda emas, kunlarda almashtirasiz.

Himoyaning boshqa choralari haqida batafsil: [Sayt, ilova va bot xavfsizligi](/blog/security-basics/).

Eng koʻp uchraydigan xatolar:

- «hozircha» xorijiy hostingni olib, baza oʻsib borayotgan paytda koʻchishni kechiktiraverish;
- serverni tekshirib, zaxira nusxalar, loglar va jadvallarni unutish;
- AI va analitikaga «har ehtimolga qarshi» yozuvlarni butunligicha yuborish;
- hammasini dasturchiga topshirib qoʻyish. Bazani roʻyxatdan oʻtkazish va siyosatni maʼlumotlar mulkdori, yaʼni kompaniyangiz rasmiylashtiradi, dasturchi texnik qismini tayyorlaydi;
- siyosatni boshqa birovning saytidan koʻchirib olish.

## Dasturchiga beriladigan savollar

Ularni ish boshlanishidan oldin yoki, tizim allaqachon ishlayotgan boʻlsa, hoziroq bering. Javoblarni yozma ravishda soʻrang.

- Server va baza jismonan qayerda? Qaysi provayder, qaysi data-markaz?
- Zaxira nusxalar qayerga ketadi, qanchalik tez-tez olinadi, qancha saqlanadi, tiklash oxirgi marta qachon tekshirilgan?
- Qaysi tashqi servislar mijozlar maʼlumotlarini oladi va aynan qaysi maydonlarni?
- Loglar va xatolar monitoringiga nima tushadi va ular qayerda saqlanadi?
- Ishchi bazaga siz va biz tomonda kimlarning kirish huquqi bor? Odam ishdan ketganda kirish qanday yopiladi?
- Noutbuklarda, test serverlarida, jadvallarda mijozlarning haqiqiy maʼlumotlari bormi?
- Har bir turdagi maʼlumot qancha saqlanadi va soʻrov boʻyicha oʻchirish qanday ishlaydi?
- Maʼlumotlar uzatishda va saqlashda shifrlanadimi? Hujjat nusxalari qayerda turadi?
- Bazani roʻyxatdan oʻtkazish va maxfiylik siyosati uchun nimalarni tayyorlab berasiz?
- Boshqa provayderga koʻchish qancha vaqt va mehnat talab qiladi?

Savollarning yarmiga javob «bilmayman» boʻlsa, vahimaga tushish shart emas. Bu yaqin haftalarda maʼlumotlar xaritasini tuzib, birinchi navbatda nimani koʻchirishni hal qilish uchun sabab.

Mahsulotingiz va u qanday maʼlumotlar yigʻishini qilich.com saytidagi SamurAI yordamchisiga yozib bering: bu maʼlumotlar qayerda saqlanishi kerakligini maslahat beramiz.
