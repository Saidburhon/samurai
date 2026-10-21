---
slug: security-basics
lang: uz
title: "Sayt, ilova va bot xavfsizligi: kichik biznes uchun minimal choralar"
description: "Koʻp muammo murakkab hujumdan emas, oddiy xatodan boshlanadi: zaif parol, ochiq admin panel, ishdan ketgan xodimning akkaunti. Avval nimani tekshirish kerak."
date: 2026-10-21
tags: [sayt xavfsizligi, maʼlumotlar xavfsizligi, Telegram-bot, kiberxavfsizlik, kichik biznes, backend]
related: [cloud-security-audit, cloud-backup-dr, cloud-identity, sup-sla]
reading_minutes: 10
---

Kichik biznes uchun minimal talab: domen, xosting, bot va toʻlov kabinetlari kompaniya nomida; hamma joyda parol menejeri va ikki bosqichli kirish; xodimlar va pudratchilar uchun eng kam huquqli shaxsiy akkauntlar, ular ketganda yopiladi; bot tokenlari va toʻlov kalitlari kabi maxfiy maʼlumotlar serverda saqlanadi; zaxira nusxalar asosiy serverdan alohida turadi va ular haqiqatan tiklab koʻrilgan; muntazam yangilanishlar va biror narsa javob bermay qolganda ogohlantirishlar. Biror narsa yuz bersa kimga qoʻngʻiroq qilishni bir sahifalik rejada oldindan yozib qoʻying; maqola oxiridagi «ha yoki yoʻq» roʻyxati qayerda turganingizni koʻrsatadi.

Biznes egasi «saytni buzishibdi» degan gapni eshitsa, koʻz oldiga serverga haftalab kalit tanlaydigan xaker keladi. Kichik biznesda esa odatda hammasi ancha oddiy, alam qiladigani ham shu: hosting paroli bir daqiqada topiladi, saytning admin paneli butun internetga ochiq va ikki yildan beri yangilanmagan, bot tokeni umumiy ish chatida turibdi, bahorda ishdan boʻshatilgan menejer esa hamon CRMga kirib yuribdi. Bunga isteʼdodli xaker kerak emas. Internetdagi barcha manzillarni ketma-ket tekshirib chiqadigan va qurbonni biznesning kattaligiga qarab tanlamaydigan avtomatik skaner yoki xafa boʻlib ketgan sobiq xodim kifoya. Quyida biznes egasi texnik bilimsiz oʻzi tekshira oladigan va dasturchidan talab qila oladigan minimal choralar jamlangan. Bu bankning xavfsizlik dasturi emas, balki buyurtma va pul oʻtadigan har qanday sayt, bot yoki ilovada boʻlishi shart boʻlgan narsalar.

## Akkauntlar kompaniyaniki boʻlsin

Eng yomoni buzib kirish emas, sayt sizniki ekanini isbotlay olmay qolishdir. Deylik, oʻquv markazining sayti va botini frilanser qilgan. Domenni u oʻz nomiga olgan, hostingni oʻz kartasidan toʻlagan, botni BotFatherda oʻzining Telegramidan roʻyxatdan oʻtkazgan. Munosabatlar yaxshi paytda buni hech kim sezmaydi. U gʻoyib boʻlsa, raqamini almashtirsa yoki «loyihani topshirgani uchun» pul soʻrasa, kompaniyada logotipdan boshqa hech narsa yoʻqligi maʼlum boʻladi.

Quyidagilar kompaniya nomiga rasmiylashtirilgan va biznes egasi oʻzi kira oladigan boʻlishi kerak:

- **Domen.** Registratorda domen egasi — kompaniyangiz, aloqa pochtasi esa dasturchining shaxsiy pochtasi emas, korporativ pochta. Muddat avtomatik toʻlov bilan yoki bir oy oldin keladigan eslatma bilan uzaytiriladi: muddati oʻtib, boʻshab qolgan domenni istalgan odam oʻziga roʻyxatdan oʻtkazib olishi mumkin.
- **Hosting va serverlar.** Provayderdagi akkaunt, shartnoma va toʻlov kompaniyadan. Dasturchi akkaunt egasi sifatida emas, foydalanuvchi sifatida kirish huquqini oladi.
- **App Store va Google Playdagi dasturchi akkauntlari.** Ularni tashkilot nomiga oching. Buning uchun ikkala doʻkon ham D-U-N-S raqamini soʻraydi, uni olish esa vaqt talab qiladi, shuning uchun loyihaning birinchi haftalaridayoq boshlang. Ilovani boshqa akkauntdan koʻchirish mumkin, lekin bu alohida jarayon va hozirgi egasining ishtirokisiz amalga oshmaydi.
- **BotFatherdagi bot.** Bot qaysi Telegram akkauntidan roʻyxatdan oʻtkazilgan boʻlsa, oʻshanga tegishli. Yangi botni kompaniyaning ishchi raqamidan oching. Bot allaqachon boshqa birovning akkauntida boʻlsa, egalikni BotFather orqali kompaniya akkauntiga oʻtkazib berishni soʻrang.
- **Click, Payme, Uzum kabinetlari va internet-bank.** Shartnoma baribir kompaniya bilan tuzilgan, lekin kabinetga kirish koʻpincha bitta xodimning shaxsiy telefon raqamiga bogʻlangan boʻladi. Uni ishchi raqamga oʻtkazing va kirish qanday tiklanishini oldindan bilib qoʻying.
- **Hamma narsa roʻyxatdan oʻtkazilgan pochta.** Ikki ishonchli odam kira oladigan alohida korporativ pochta qutisi. Qolgan hamma narsaning paroli shu pochta orqali tiklanadi, shuning uchun uni hammasidan yaxshiroq himoya qiling.
- **Kod repozitoriysi, CRM, analitika, reklama kabinetlari** — xuddi shu tamoyil boʻyicha.

Tekshirish yarim soatcha vaqt oladi: bu servislarning har biriga oʻzingiz kirib koʻring. Buning uchun dasturchiga qoʻngʻiroq qilishga toʻgʻri kelsa, qilinadigan ishlar roʻyxatining birinchi bandini topdingiz.

## Parollar va ikki bosqichli kirish

Hamma narsaga bitta parol, kompaniya nomi va yildan iborat parol, besh kishi biladigan parol — akkauntdan ayrilib qolish haqidagi hikoyalar odatda shundan boshlanadi. Ikkita chora bunday muammolarning katta qismining oldini oladi.

**Parol menejeri.** Masalan, Bitwarden, 1Password yoki KeePass. Har bir servisga alohida uzun va tasodifiy parol qoʻyiladi, ularni yodlab olish shart emas. Bitwarden yoki 1Password kabi servislarning jamoaviy tariflarida turli huquqli umumiy omborlar bor: buxgalter bank kabinetlarini, dasturchi serverlarni koʻradi, hech kim parolni Telegram orqali joʻnatmaydi. Bu odatda bir kishi uchun oyiga bir necha dollar turadi, baʼzi servislarning bepul tariflari ham bor.

**Ikki bosqichli kirish (2FA).** Paroldan tashqari telefondagi bir martalik kod ham soʻraladi. Uni birinchi navbatda akkauntni yoʻqotish eng qimmatga tushadigan joylarda yoqing:

- domen, hosting va ilova doʻkonlari roʻyxatdan oʻtkazilgan pochta;
- biznes egasining hamda bot va kanallarni boshqaradigan xodimlarning Telegram akkauntlari (Telegramda bu maxfiylik sozlamalaridagi bulutli parol);
- hosting, domen registratori, DNS;
- CRM (Bitrix24 yoki amoCRM) va, masofadan kirish mumkin boʻlsa, 1C;
- toʻlov tizimlarining kabinetlari va internet-bank;
- App Store, Google Play va kod repozitoriysi.

Autentifikator ilovasidagi kodlar SMSdan ishonchliroq: firibgar raqamingizga yangi SIM-karta chiqartirib olsa, SMS kodlar unga keladi. Akkauntni tiklash uchun beriladigan zaxira kodlarni faqat bir odamning telefonida emas, parol menejerida ham saqlang.

Telegram haqida alohida. Akkauntni oʻgʻirlashning keng tarqalgan yoʻli umuman buzib kirish emas, balki «ovoz berish uchun», «yetkazib berishni tasdiqlash uchun» yoki «xavfsizlik xizmatidan» deb kirish kodini soʻrash. Xodimlarga tushuntiring: bu kod hech kimga aytilmaydi, uni soʻragan odam — firibgar. Oyda bir marta Telegram sozlamalarida qurilmalar roʻyxatini ochib, notanish seanslarni yakunlang.

## Xodimlar va pudratchilarning kirish huquqlari

Toʻrtta qoida:

1. **Umumiy login oʻrniga shaxsiy akkauntlar.** Hamma admin panelga «admin» nomi bilan kirsa, buyurtmani kim oʻchirganini bilib boʻlmaydi, bitta odamni chiqarib yuborish uchun esa umumiy parolni almashtirib, uni qolganlarga qaytadan tarqatishga toʻgʻri keladi.
2. **Minimal huquqlar.** Operatorga butun mijozlar bazasini yuklab olish, kuryerga bir yillik buyurtmalar tarixi, SMM mutaxassisiga serverga kirish kerak emas. Odamning huquqlari qancha kam boʻlsa, uning xatosi yoki oʻgʻirlangan akkauntidan zarar ham shuncha kam.
3. **Kirish huquqi odam ketgan kuniyoq yopiladi.** «Esimizga tushganda» emas. Bu pudratchilarga ham tegishli: loyiha topshirildi — server va repozitoriyga kirish oʻchiriladi yoki faqat qoʻllab-quvvatlash shartnomasi boʻyicha ishlayotganlarga qoldiriladi. Buyurtmalar tushadigan ishchi Telegram guruhlarini va kanal adminlarini ham unutmang.
4. **Kimda nima borligi bitta roʻyxatda.** Kimdir ishga kirganda yoki ketganda yangilanadigan va chorakda bir marta koʻrib chiqiladigan oddiy jadval.

U taxminan shunday koʻrinishi mumkin:

| Servis | Kimning nomida | Yana kim kira oladi | Qanday huquqlar | 2FA |
|---|---|---|---|---|
| Domen va DNS | Kompaniya, korporativ pochta | Dasturchi | Faqat DNS yozuvlari | Ha |
| Hosting | Kompaniya | Dasturchi, qoʻllab-quvvatlash pudratchisi | Loyiha serverlari | Ha |
| BotFatherdagi bot | Kompaniyaning ishchi Telegrami | Hech kim | — | Bulutli parol |
| Click yoki Payme kabineti | Kompaniya | Buxgalter | Toʻlovlarni koʻrish | Ha |
| CRM | Kompaniya | Sotuv menejerlari | Oʻz bitimlari, bazani yuklab olmasdan | Ha |
| Kod repozitoriysi | Kompaniya | Dasturchilar | Yozish, oʻchirish huquqisiz | Ha |

«Kimning nomida» ustunida kompaniya emas, biror odamning ismi chiqsa, birinchi boʻlimga qayting.

## Maxfiy kalitlar: bot tokeni, API va toʻlov kalitlari

Bot tokeni — bot ustidan toʻliq nazorat. Uni bilgan odam botga kelayotgan xabarlarni tutib olishi va mijozlarga botingiz nomidan yozishi mumkin. Sizib chiqqan toʻlov kaliti, integratsiya qanday qurilganiga qarab, toʻlov tasdigʻini soxtalashtirishga imkon berishi mumkin: tizimda buyurtma toʻlangan deb belgilanadi, pul esa kelmaydi. CRM, 1C yoki SMS-shlyuzning API kalitlari mijozlar maʼlumotlariga yoki balansingizga yoʻl ochadi.

Qoidalar:

- **Chatda ham, pochtada ham emas.** Maxfiy kalit parol menejeri orqali uzatiladi. Token qachondir ishchi guruhga tashlangan boʻlsa, uni shu guruhda qachondir boʻlgan hamma biladi deb hisoblang.
- **Kodda ham, repozitoriyda ham emas.** Kalitlar serverda, muhit oʻzgaruvchilarida yoki maxfiy maʼlumotlar omborida saqlanadi. Kalitni koddan oʻchirish yetmaydi: u repozitoriy tarixida qoladi, shuning uchun u yerga tushib qolgan kalit almashtiriladi.
- **Ilovada ham, sayt sahifasida ham emas.** Mobil ilovaga yoki saytning JavaScript kodiga joylangan har qanday narsani ajratib olish mumkin. Maxfiy kalitlar faqat serverda turadi, ilova esa serveringizga murojaat qiladi.
- **Sababi boʻlganda almashtiriladi.** Kirish huquqi bor odam ketganda; kalit chatga, skrinshotga yoki repozitoriyga tushib qolganda; sizib chiqqanidan shubha boʻlganda. Bot tokeni BotFatherda bir daqiqada almashtiriladi, keyin dasturchi uni serverda yangilaydi. Kim nimani almashtirishini dasturchi bilan oldindan kelishib oling, shunda butun jarayon kunlar emas, daqiqalar oladi.

Dasturchidan barcha maxfiy kalitlar roʻyxatini qiymatlarisiz tuzib berishni soʻrang. Har biri uchun: bu nima, qayerda ishlatiladi, qayerda saqlanadi, kim va qanday almashtiradi. Toʻlov qismi haqida batafsil: [Click, Payme va Uzumni ulash](/blog/click-payme-uzum-payments/).

## Tiklab koʻrilgan zaxira nusxalar

«Bizda bekap bor» degan gap nusxani hech kim tiklab koʻrmaguncha hech narsani anglatmaydi. Minimal talablar:

- **Avtomatik.** «Dasturchi esiga tushganda qiladi» emas, jadval boʻyicha.
- **Asosiy serverdan alohida.** Boshqa serverda, boshqa maʼlumotlar markazida yoki boshqa provayderda. Oʻsha serverning oʻzidagi nusxa u bilan birga yoʻqoladi, maʼlumotlarni qulflab, pul talab qiladigan virus esa nusxani ham baza bilan birga shifrlab qoʻyadi. Asosiy server eski nusxalarni oʻchira olmasligi kerak. Bazada Oʻzbekiston fuqarolarining shaxsiy maʼlumotlari boʻlsa, nusxalarni ham mamlakat ichida saqlang. Batafsil: [shaxsiy maʼlumotlarni Oʻzbekistonda saqlash](/blog/personal-data-in-uzbekistan/).
- **Toʻliq.** Maʼlumotlar bazasi, yuklangan fayllar (mahsulot rasmlari, hujjatlar, shartnomalar) va server sozlamalari. Kod esa kompaniyaning repozitoriysida turadi.
- **Tekshirilgan.** Chorakda bir marta dasturchi nusxani test serverda tiklab, sizga sayt ochilayotganini va oxirgi buyurtmalar joyida ekanini koʻrsatadi. Bu qancha vaqt olganini yozib qoʻying: haqiqiy tiklanish vaqtingiz shu.
- **Tarixi bilan.** Faqat oxirgi nusxa emas, bir necha kun, hafta va oy oldingi nusxalar ham: buzilgan maʼlumot baʼzan darhol sezilmaydi.

Nusxani qanchalik tez-tez olish bitta savolga bogʻliq: necha soatlik buyurtmalarni yoʻqotib, keyin qoʻlda qayta kiritishga tayyorsiz? Necha soat ishlamay tura olishingiz esa tiklash qanchalik tez boʻlishi kerakligini belgilaydi.

- **Oyda bir marta oʻzgaradigan vizitka sayt:** kuniga bir marta yetarli.
- **Internet-doʻkon yoki buyurtma qabul qiladigan bot:** kamida kuniga bir marta, yaxshisi har bir necha soatda.
- **Har bir yozuv pulga teng boʻlgan hisob** (toʻlovlar, abonementlar, qarzlar, qoldiqlar): istalgan daqiqadagi holatni tiklash uchun baza oʻzgarishlarini uzluksiz yozib borish va qoʻshimcha ravishda kunlik nusxalar.

## Yangilanishlar va admin panel

Yangilanishlar allaqachon maʼlum boʻlgan zaifliklarni yopadi, avtomatik skanerlar esa aynan shularni qidiradi. WordPress va shunga oʻxshash CMSdagi saytlarda muammo koʻpincha yadroning oʻzidan emas, eskirgan plagin yoki mavzudan keladi. Shuning uchun:

- CMS, plaginlar, mavzular, kutubxonalar va serverning operatsion tizimi muntazam yangilanadi, katta yangilanishlar avval sayt nusxasida sinab koʻriladi;
- ishlatilmaydigan plagin va mavzular oʻchiriladi: ularning har biri saytingiz ichida ishlaydigan begona kod;
- eski test versiyalar va test, old kabi unutilgan subdomenlar oʻchiriladi: ularda baʼzan haqiqiy maʼlumotlar parolsiz turgan boʻladi;
- yangilanishlar biror narsa buzilganda emas, reja boʻyicha qilinadi va qoʻllab-quvvatlash shartnomasiga kiritiladi. Batafsil: [ishga tushirilgandan keyingi qoʻllab-quvvatlash](/blog/maintenance-after-launch/).

Admin panel quyidagilar bilan himoyalanadi:

- ikki bosqichli kirish va shaxsiy akkauntlar;
- parolni cheksiz tanlab boʻlmasligi uchun kirish urinishlarini cheklash;
- imkon boʻlsa, faqat ofisdan, VPN orqali yoki ruxsat berilgan manzillardan kirish;
- standart boʻlmagan manzil: bu oʻz-oʻzidan himoya emas, lekin avtomatik «axlat»ning bir qismini toʻsadi.

HTTPS hamma joyda boʻlsin: saytda, admin panelda, ilova APIsida. Telegram esa bot vebhuki uchun baribir faqat HTTPS manzilni qabul qiladi. Sertifikat bepul ham boʻladi va avtomatik uzaytirilishi mumkin. Uzaytirish ishlamay qolsa, xabar keladigan qilib qoʻying.

Botning ham oʻz «admin paneli» bor, uni ham tekshirish kerak. Dasturchidan soʻrang:

- botning xizmat buyruqlari faqat xodimlar roʻyxatidagi Telegram IDlarga javob beradimi? «Hech kim bilmaydigan» yashirin buyruq himoya emas;
- Telegram Mini App yuboradigan maʼlumotlar serverda imzo boʻyicha tekshiriladimi?
- bot vebhuki maxfiy token bilan himoyalanganmi?
- toʻlov oʻtkazma skrinshoti bilan emas, toʻlov tizimidan serverga keladigan xabar bilan tasdiqlanadimi? Chek skrinshotini soxtalashtirish oson.

## Loglar va ogohlantirishlar

Bilmagan narsangizga chora koʻra olmaysiz. Ogohlantirishlar uchun alohida Telegram guruh oching va unga biznes egasi, dasturchi va masʼul menejerni qoʻshing. Minimal toʻplam:

- sayt, bot yoki API javob bermayapti: tashqi monitoring ularni har bir necha daqiqada tekshirib turadi;
- admin panel, hosting yoki toʻlov kabinetiga yangi qurilmadan kirildi. Koʻp servislar bunday xatni oʻzi yuboradi, muhimi — uni kimdir oʻqishi;
- toʻlov xatolari keskin koʻpaydi yoki odatda toʻlov boʻladigan soatlarda birorta ham muvaffaqiyatli toʻlov yoʻq;
- CRM yoki admin panelda yozuvlar ommaviy yuklab olindi yoki oʻchirildi;
- diskda joy tugayapti, sertifikat yoki domen muddati tugayapti;
- zaxira nusxa olinmadi. Bu eng jim nosozlik: ogohlantirish boʻlmasa, bundan nusxa kerak boʻlgan kuni xabar topasiz.

Admin paneldagi harakatlar jurnalini (kim kirdi, nimani oʻzgartirdi, nimani yuklab oldi) bir necha oy saqlang. Loglarga parollar, karta raqamlari va ortiqcha shaxsiy maʼlumotlar tushmasligi kerak.

Koʻp uchraydigan xato — kuniga qirqta ogohlantirish, shundan keyin hamma guruhning ovozini oʻchirib qoʻyadi. Kimdir albatta javob berishi kerak boʻlgan besh-yetti hodisadan boshlang va har biriga kim javob berishini belgilab qoʻying.

## Nimadir yuz bersa

Bir sahifalik rejani oldindan tayyorlab qoʻying va uni pochta ishlamay qolganda ham topsa boʻladigan joyda saqlang: bosma nusxasini ofisda, elektron nusxasini parol menejerida.

1. **Kimga qoʻngʻiroq qilish.** Dasturchi yoki qoʻllab-quvvatlash pudratchisi (dam olish kunlari ham javob beradigan raqami bilan), hosting provayderi, toʻlov tizimlarining qoʻllab-quvvatlash xizmati, bank, yurist.
2. **Kirishni qanday yopish.** Tartib bilan: pochta, biznes egasining Telegrami, hosting, toʻlov kabinetlari. Parollarni almashtirish, barcha seanslarni yakunlash, bot tokeni va toʻlov kalitlarini yangilash, shubhali akkauntlarni oʻchirish. Har bir qadamni kim bajarishi yozib qoʻyilgan boʻlsin.
3. **Izlarni oʻchirmaslik.** Avval loglar va server nusxasini saqlab qoʻyish, keyin tiklash. Aks holda qanday kirishganini bilmay qolasiz va bir haftadan keyin hammasi takrorlanishi mumkin.
4. **Mijozlarga nima deyish.** Qisqa va rostini, oʻzbek va rus tillarida: nima boʻldi, nimaga taʼsir qildi, mijozlar nima qilishi kerak. Bot yoki kanalni oʻgʻirlab ketishgan boʻlsa, mijozlarni boshqa yoʻllar bilan ogohlantiring: «biz nomimizdan» toʻlov yoki kod soʻraydigan xabarlarga javob bermasinlar. Matn shablonini oldindan, xotirjam paytda yozib qoʻying.
5. **Shaxsiy maʼlumotlar.** Mijozlarning maʼlumotlari sizib chiqqan boʻlsa, asosiy majburiyatlar dasturchida emas, baza mulkdori sifatida kompaniyangizda boʻladi. Kimga va qanday muddatda xabar berish kerakligini hodisa kuni emas, oldindan yuristdan aniqlab oling.
6. **Tahlil.** Bir necha kundan keyin aybdor qidirmasdan xotirjam tahlil qiling: nima boʻldi, nega bu mumkin boʻldi va takrorlanmasligi uchun nimani oʻzgartiramiz.

## Oʻzingizni tekshiring

Har bir bandga «ha» yoki «yoʻq» deb javob bering:

- Domen, hosting, BotFather, ilova doʻkonlari va toʻlov kabinetlari kompaniya nomida va ularga oʻzim kira olaman.
- Pochta, Telegram, hosting, CRM va toʻlov kabinetlarida ikki bosqichli kirish yoqilgan, zaxira kodlar faqat bir odamda emas.
- Parollar chat va jadvallarda emas, parol menejerida.
- Kirish huquqlari roʻyxati bor va ketganlarning hammasi undan oʻchirilgan.
- Tokenlar va kalitlar chatlarda, kodda va ilovada yoʻq, ularni almashtirish qancha vaqt olishini bilaman.
- Zaxira nusxalar avtomatik olinadi, serverdan alohida saqlanadi va oxirgi uch oyda kamida bir marta tiklab koʻrilgan.
- CMS, plaginlar va server oxirgi oyda yangilangan, admin panelga ikki bosqichli kirish qoʻyilgan, hamma joyda HTTPS.
- Sayt yoki bot ishlamay qolgani, toʻlov xatolari va shubhali kirishlar haqidagi ogohlantirishlar kimdir oʻqib turadigan Telegram guruhga keladi.
- Hodisa yuz bergan holat uchun bir sahifalik reja bor.

**Bu qancha vaqt oladi.** Kichik sayt yoki bot uchun shu roʻyxat boʻyicha tekshiruv odatda dasturchining bir-ikki kunlik ishi. Topilgan kamchiliklarni tuzatish bir necha kundan ikki-uch haftagacha choʻzilishi mumkin. Muddatga quyidagilar taʼsir qiladi:

- tizimlar va pudratchilar soni;
- hammasini qilgan dasturchi bilan hali aloqa bormi;
- CMS qanchalik eskirgan: bir necha versiyadan sakrab yangilash baʼzan plaginlarni buzadi va alohida kichik loyihaga aylanadi;
- domen va ilovalarni akkauntlar oʻrtasida koʻchirish kerakmi: bu uchinchi tomonlarga bogʻliq;
- zaxira nusxalashni noldan sozlab, tiklashni sinab koʻrish kerakmi.

Parol menejeri, nusxalar ombori va monitoring uchun oylik xarajat odatda katta emas. Asosiy xarajat — dasturchining yangilanishlar va nusxalarni tekshirishga ketadigan vaqti, uni qoʻllab-quvvatlash shartnomasiga kiritib qoʻygan maʼqul.

Roʻyxatdan bir oʻtib chiqing va belgilay olmagan bandlaringizni inbox@qilich.com manziliga yozing: nimadan boshlashni maslahat beramiz.
