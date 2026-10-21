---
slug: uzbek-russian-interface
lang: uz
title: "Oʻzbek va rus tilida soʻzlashuvchi mijozlar uchun interfeys dizayni"
description: "Ikki tilli auditoriya uchun interfeys: til tanlash, lotin va kirill yozuvi, matn uzunligi, shriftlarda ʻ belgisi, sana va pul formatlari."
date: 2026-10-21
tags: [UX, ilova dizayni, sayt dizayni, ikki tilli sayt, lokalizatsiya]
related: [web, mobile, telegram]
reading_minutes: 9
---

Boshidanoq matnning uch shakli uchun loyihalang: lotin yozuvidagi oʻzbekcha, kirill yozuvidagi oʻzbekcha va ruscha. Til almashtirgich har bir ekranda boʻlsin va har bir til oʻz tilida nomlansin; ikkala versiya soʻzma-soʻz tarjima qilinmasdan yozilsin; koʻpincha uzunroq boʻladigan oʻzbekcha matnga joy qoldirilsin; shriftda ʻ (U+02BB) belgisi boʻlsin, qidiruv esa ikkala yozuvni tushunsin. Ikkinchi til birinchi maketdan rejalashtirilsa, matn va test uchun bir necha kun qoʻshadi; keyin qoʻshilsa, maket va kodni qayta ishlashga toʻgʻri keladi.

Koʻp uchraydigan holat: sayt yoki ilova avval rus tilida qilinadi, ishga tushirishdan oldin esa «oʻzbekchasini ham qoʻshib qoʻyamiz» deyiladi. Natijada «Buyurtmani rasmiylashtirish» yozuvi tugmaga sigʻmay, uch qatorga boʻlinib ketadi, menyuning yarmi ruscha qoladi, toʻlovdagi xatolik haqidagi xabar inglizcha chiqadi, «somsa» deb qidirgan mijoz esa «Hech narsa topilmadi» yozuvini koʻradi, chunki katalogda «самса» deb yozilgan. Oʻzbekistondagi biznes uchun ikkinchi til ish oxirida buyurtma qilinadigan tarjima emas. U telefon ekranining oʻlchami kabi vazifaning shartlaridan biri, uni birinchi maketdanoq hisobga olish kerak. Quyida tugmalar sigʻmay qolishi va ekranlar yarim tarjima qilinib qolishining oldini oladigan amaliy qoidalarni keltiramiz.

## Kim nimani oʻqiydi

Mijozlaringiz kamida uch xil koʻrinishda oʻqiydi va yozadi: lotin yozuvidagi oʻzbekcha, kirill yozuvidagi oʻzbekcha va ruscha. Lotin yozuvi rasmiy alifbo hisoblanadi, maktablarda shu yozuvda oʻqitiladi. Katta yoshdagi koʻpchilik hali ham kirill yozuvidan foydalanadi, yozishmalarda ham u tez-tez uchraydi: odam oʻzbekcha yozadi, lekin rus klaviaturasida. Mijozlarning sezilarli qismi uchun, ayniqsa Toshkentda, rus tili ishda ham, uyda ham asosiy til. Koʻp odamlar esa kun davomida bir tildan boshqasiga oʻtib turadi: shartnomani ruscha oʻqiydi, kuryer bilan oʻzbekcha yozishadi.

Amalda bu quyidagini anglatadi:

- Brauzer, telefon yoki Telegram tili qaror emas, faqat ishora. Koʻpchilikning telefoni rus yoki ingliz tilida sozlangan, lekin oʻqish uchun ularga oʻzbekcha qulayroq.
- Tilni bir marta, soʻrash ortiqcha boʻlmaydigan joyda soʻrang: botni birinchi marta ishga tushirganda, ilovaning birinchi ekranida.
- Tilni bir-ikki bosishda almashtirish imkoni doim boʻlsin, bunda savat va toʻldirilgan forma yoʻqolmasin.

Qaysi tillarni qoʻllab-quvvatlashni taxmin bilan emas, oʻz mijozlaringizga qarab hal qiling. Oddiy usul: qoʻllab-quvvatlash xizmati yoki savdo chatidagi oxirgi 200 ta murojaatni oling va ular qaysi tilda, qaysi yozuvda yozilganini sanab chiqing. Agar murojaatlarning sezilarli qismi oʻzbekcha kirill yozuvida boʻlsa, uchinchi variant, «Ўзбекча» haqida oʻylab koʻring. Odatda u lotin yozuvidagi matndan avtomatik transliteratsiya va istisnolar roʻyxati orqali tayyorlanadi, shuning uchun toʻliq uchinchi tildan arzonroq tushadi. Lekin uni ham alohida sinab chiqish kerak.

## Til almashtirgich

Yaxshi til almashtirgich qanday boʻladi:

- Uni izlab oʻtirish kerak emas: saytda har bir sahifaning yuqori qismida, ilovada profilda, botda menyuda turadi. Sahifaning eng pastida yoki «Sozlamalar → Boshqa» ichida emas.
- Har bir til nomi shu tilning oʻzida yozilgan: «Oʻzbekcha», «Ўзбекча», «Русский». Oʻzbekcha sahifaga tushib qolgan rusiyzabon mijoz «Rus tili» yozuvini emas, «Русский»ni darrov taniydi. Teskarisi ham shunday.
- Bayroq ishlatilmaydi. Bayroq tilni emas, davlatni bildiradi: Oʻzbekistondagi mijozlar uchun qilingan saytda «Русский» yonidagi Rossiya bayrogʻi gʻalati koʻrinadi.
- Mijoz roʻyxatdan oʻtgan boʻlsa, tanlangan til faqat brauzerda emas, serverdagi profilida ham saqlanadi. Shunda bildirishnomalar ham shu tilda boradi, mijoz boshqa qurilmadan kirganda ham oʻrgangan interfeysini koʻradi.
- Til almashtirilganda odam oʻsha sahifada, oʻsha savat bilan qoladi. Uni bosh sahifaga qaytarib yuborish koʻp uchraydigan va asabga tegadigan xato.
- Saytning har bir til versiyasi oʻz manziliga ega, masalan /uz/ va /ru/, sahifalarda esa hreflang teglari bor. Shunda qidiruv tizimlari kerakli versiyani koʻrsatadi, havolani esa kerakli tilda ulashish mumkin. IP-manzilga qarab tilni jimgina almashtirmang.
- Ilovada til ilovaning oʻzida almashtiriladi, odamni telefon sozlamalariga yubormang.
- Botda til birinchi /start bosilganda ikki-uch tugma orqali soʻraladi, keyin uni buyruq yoki menyu orqali almashtirish mumkin. Bir narsani hisobga oling: Telegramdagi buyruqlar menyusi botdagi tanlovga emas, Telegram ilovasining tiliga qarab chiqadi. Mijoz tilni tanlagach, buyruqlar roʻyxatini aynan uning chati uchun shu tilda oʻrnatib qoʻyish mumkin.

Sayt qaysi tilda ochilishi dasturchining emas, biznesning qarori. Uni mijozlaringiz, reklama tili va qaysi tilda javob bera olishingiz belgilaydi. Reklama oʻzbekcha boʻlib, sayt ruscha ochilsa, siz shunday kliklar uchun pul toʻlaysiz: odam saytga kiradi-yu, birinchi ishi til almashtirgichni qidirish boʻladi. Saytda butun ekranni yopib qoʻyadigan til tanlash oynasidan koʻra, asosiy tilda ochib, almashtirgichni koʻzga tashlanadigan joyga qoʻygan maʼqul. Botda esa aksincha: boshidagi tugmali qisqa savol mijozga deyarli xalaqit bermaydi.

## Ikkala versiyani yozing, soʻzma-soʻz tarjima qilmang

Ruschadan soʻzma-soʻz oʻgirilgan matnni mijoz darrov sezadi. «Что-то пошло не так» tarjimada «Nimadir notoʻgʻri ketdi»ga aylanadi: grammatik xato yoʻq, lekin hech kim bunday gapirmaydi. Tabiiyroq variant: «Xatolik yuz berdi. Qaytadan urinib koʻring». «Ваша заявка принята» esa «Sizning arizangiz qabul qilindi» koʻrinishida idoradan kelgan javobdek eshitiladi, holbuki kafe uchun «Buyurtmangiz qabul qilindi» yetarli. Teskarisi ham shunday: oʻzbekchadan tarjima qilingan ruscha matn ogʻir va rasmiy chiqadi, rusiyzabon mijoz uni ham darrov sezadi.

Matnlar ustidagi ishni qanday tashkil qilish kerak:

1. Atamalar lugʻatini (glossariy) tuzing: mahsulotdagi asosiy soʻzlarning ikki tildagi jadvali. Buyurtma / заказ, savat / корзина, yetkazib berish / доставка, toʻlov / оплата. Bahsli joylarni oldindan kelishib oling: «ilova»mi yoki «dastur»mi, ruschada «вы» kichik harf bilan yoziladimi yoki «Вы» bosh harf bilan, valyuta qanday yoziladi, brend nomi tarjima qilinadimi.
2. Har bir versiyani shu til ona tili boʻlgan va mahsulotni tushunadigan odam yozadi. Mashina tarjimasidan qoralama sifatida foydalanish mumkin, lekin undan keyin oʻzbekcha matnni deyarli har doim qayta yozishga toʻgʻri keladi.
3. Ikkala tildagi matnlarni bitta odam tasdiqlaydi. «Boʻsh turmasin» deb tarjimani qoʻyib qoʻygan dasturchi emas.
4. Matnlar koddan alohida saqlanadi: tarjima fayllarida yoki admin panelda. Shunda matndagi xatoni tuzatish uchun kodni titkilash kerak boʻlmaydi (matnlar serverdan olinsa, ilovani qayta yigʻish ham shart emas), tushib qolgan tarjima esa mijozning ekranida emas, hisobotda koʻrinadi.

Grammatika ham interfeysga taʼsir qiladi. Ruschada sondan keyin otning uch xil shakli bor: 1 товар, 2 товара, 5 товаров. Oʻzbekchada sondan keyin ot oʻzgarmaydi: «5 ta mahsulotlar» emas, «5 ta mahsulot». Shuning uchun sonli satrlar kodda soʻz bilan qoʻshimchani yopishtirib emas, lokalizatsiya kutubxonalaridagi koʻplik qoidalari orqali yoziladi. Ikkinchi tuzoq: oʻzgaruvchiga yopishtirilgan qoʻshimcha. «{shahar}ga» shabloni «Toshkent» uchun toʻgʻri ishlaydi, Chirchiq uchun esa «Chirchiqqa» oʻrniga «Chirchiqga» chiqadi, chunki qoʻshimcha soʻzning oxirgi harfiga bogʻliq: -ga, -ka yoki -qa. Gapni oʻzgaruvchi alohida turadigan qilib tuzish ishonchliroq: «Shahar: Chirchiq».

Tarjima qilinmay qolgan joylar odatda qayerda yashirinadi:

- server va tayyor kutubxonalardan keladigan xatolik va maydonlarni tekshirish xabarlari: ular koʻpincha sukut boʻyicha inglizcha boʻladi;
- tizim oynalari: kamera va geolokatsiyaga ruxsat soʻrash, sana tanlash;
- toʻlov sahifasi: toʻlov xizmati til parametrini qabul qilsa, unga mijozning tilini uzating;
- elektron xatlar, SMS, push-bildirishnomalar, PDF hisoblar va cheklar;
- 404 sahifasi, boʻsh ekranlar, maydonlar ichidagi maslahat matnlari;
- ilova doʻkonlaridagi tavsif va skrinshotlar (doʻkon shu tilni qoʻllab-quvvatlasa);
- botning menyusi, buyruqlari va tugmalari.

## Matn uzunligi va maket

Bir xil maʼno ikki tilda har xil joy egallaydi. Oʻzbekcha matn koʻpincha uzunroq: «В корзину» va «Savatga qoʻshish», «Оформить заказ» va «Buyurtmani rasmiylashtirish». Aksincha boʻlishi ham mumkin: «Корзина» va «Savat». Maketning har bir elementi ikki variantdan uzunrogʻiga ham sigʻishi kerak.

Amaliy qoidalar:

- Maketlarni ikkala tildagi haqiqiy matnlar bilan chizing: «Lorem ipsum» bilan ham, faqat ruscha matn bilan ham emas. Dizayner har bir tugmaning eng uzun yozuvini koʻrishi kerak.
- Tugma va menyu bandlaridagi matn uch nuqta bilan qirqilmasin, kerak boʻlsa ikkinchi qatorga oʻtsin. Qirqilgan «Buyurtmani rasmiy…» qisqa «Buyurtma berish»dan yomonroq, shuning uchun baʼzan matnning oʻzini qisqartirish toʻgʻriroq.
- Qoʻshimchalar hisobiga oʻzbekcha soʻzlar juda uzun boʻlishi mumkin («rasmiylashtirilmagan»), brauzerlarning avtomatik boʻgʻin koʻchirishi esa oʻzbek tilida ishlamasligi ehtimoli bor. Sarlavhalar va tor ustunlarda unga umid qilmang.
- Mobil ilovaning pastki menyusi eng tor joy: toʻrt-besh band, har biri bitta qisqa soʻz. Ikonkalarni tasdiqlashdan oldin har bir band uchun ikkala tilda soʻz tanlab qoʻying.
- Tor ekranli telefonda va tizim shrifti kattalashtirilgan holatda tekshiring: baʼzi foydalanuvchilarda bu sozlama yoqilgan.
- Botda inline tugmadagi uzun yozuv telefon ekranida qirqiladi. Ikkala tilda ham tugma yozuvlari qisqa boʻlsin.

## Harflar, shriftlar va ʻ belgisi

Lotin yozuvida oʻ va gʻ harflari maxsus ʻ belgisi bilan yoziladi (Unicode kodi U+02BB), «maʼlumot» kabi soʻzlardagi tutuq belgisi esa ʼ (U+02BC). Odatdagi klaviaturada bu belgilar yoʻq, shuning uchun ular oʻrniga apostrof, teskari apostrof yoki tipografik qoʻshtirnoq qoʻyiladi. Interfeysda bu beparvolikdek koʻrinadi, eng yomoni esa bitta ekranning oʻzida uch xil variant uchrashi.

Nima qilish kerak:

- Interfeys matnlarida toʻgʻri ʻ va ʼ belgilarini ishlating. Buni glossariyga yozib qoʻying va har bir relizdan oldin tarjima fayllarida qidiruv orqali tekshiring.
- Shriftda ʻ va ʼ belgilari, shuningdek Ў, Қ, Ғ, Ҳ harflari bilan kirill alifbosi boʻlishi kerak. Tekshirish oson: ishlatadigan barcha uslublarda, yaʼni oddiy, qalin va kursivda «Oʻzbekiston, gʻisht, maʼlumot, Ўзбекистон, қўшиш, ғишт, ҳисоб» deb yozib koʻring.
- Google Fonts shriftlarida Қ, Ғ, Ҳ harflari asosiy kirill toʻplamiga emas, kengaytirilgan toʻplamga (cyrillic-ext) kiradi. Shriftni oʻzingizning serveringizga yuklab olsangiz yoki toʻplamlarni qoʻlda tanlasangiz, cyrillic-extni qoʻshishni unutmang, aks holda bu harflar boshqa shriftda chiqadi. Bu toʻplam tanlangan shriftning oʻzida borligini ham tekshiring.
- Shriftda belgi boʻlmasa, brauzer yoki telefon uni tizim shriftidan oladi: qalinligi va balandligi boshqacha boʻladi, soʻz «sakrab» turadi. PDF hisoblar, rasmlar va kassa cheklarida esa harf oʻrnida boʻsh kvadrat yoki soʻroq belgisi chiqishi mumkin. Bu faqat haqiqiy hujjatlarda bilinadi, shuning uchun ularni oʻzingiz ochib, chop etib koʻring.
- SMS: GSM asosiy toʻplamidan tashqaridagi har qanday belgi, xoh kirill harfi, xoh ʻ boʻlsin, xabarni Unicodega oʻtkazadi va bitta segmentga 160 emas, 70 ta belgi sigʻadi. Shuning uchun SMSda ʻ koʻpincha oddiy apostrof bilan almashtiriladi. Bu tejash uchun qilingan murosa: unga ongli ravishda va faqat SMS uchun boring.

## Ikkala yozuvni tushunadigan qidiruv

Mijoz qanday yozishga odatlangan boʻlsa, shunday qidiradi. Bitta mahsulotni «somsa», «samsa», «самса» va «сомса» deb qidirishadi. Tuman nomini esa «Chilonzor», «Чилонзор» yoki «Чиланзар» deb yozishadi. Ruscha nom koʻpincha oʻzbekcha nomning kirillchasiga mos kelmaydi: «Chilonzor» kirill yozuvida «Чилонзор», ruschada esa «Чиланзар». ʻ belgisini esa koʻpchilik umuman terib oʻtirmaydi: «ozbek», «qoshish» deb yozib qoʻya qoladi.

Qidiruv uchun eng kam toʻplam:

1. Normallashtirish. Apostrofning barcha variantlari (' ` ‘ ’ ʻ ʼ) ham soʻrovda, ham katalogda bittaga keltiriladi. Belgisiz qidiruv ham ishlashi kerak: «ozbek» soʻrovi «oʻzbek»ni topsin.
2. Transliteratsiya. Lotincha soʻrov kirillcha nomlar boʻyicha ham qidiriladi, kirillchasi esa lotincha nomlar boʻyicha. Oʻzbek tili uchun harflar deyarli birma-bir mos keladi (sh va ш, ch va ч, oʻ va ў, gʻ va ғ), lekin istisnolar bor: «ц» harfli ruscha oʻzlashma soʻzlar, soʻz boshidagi «е» va «э», atoqli otlar. Ular alohida roʻyxatda saqlanadi.
3. Sinonimlar. Mahsulot va xizmatlarning ruscha va oʻzbekcha nomlari, soʻzlashuvdagi nomlar, koʻchalar va moʻljallarning eski nomlari. Bu lugʻatni dasturchi emas, biznes toʻldiradi, shuning uchun uni admin panelda tahrirlash imkoni boʻlishi kerak.
4. Klaviatura tili almashtirilmay qolgan soʻrovlar: «плов» oʻrniga «gkjd». Qoida oddiy, natija bermaydigan soʻrovlar esa kamayadi.
5. Natija bermagan soʻrovlar hisoboti. Uni haftada bir marta koʻrib chiqing: bu yangi sinonimlarning eng arzon manbai.

Muddatlar haqida: kichik katalog uchun normallashtirish va oddiy transliteratsiya odatda bir necha kunlik ish. Morfologiya, sinonimlar va xato yozilgan soʻzlarni hisobga oladigan toʻliq qidiruv esa katalog hajmi va tizim nimada qurilganiga qarab bir haftadan bir necha haftagacha vaqt oladi.

## Sonlar, sanalar, pul va manzillar

| | Oʻzbekcha | Русский |
|---|---|---|
| Narx | 125 000 soʻm | 125 000 сум |
| Katta summa | 1,2 mln soʻm | 1,2 млн сум |
| Sana | 2026-yil 21-oktabr, 21.10.2026 | 21 октября 2026 г., 21.10.2026 |
| Vaqt | 14:30 | 14:30 |
| Miqdor | 5 ta mahsulot | 1 товар, 2 товара, 5 товаров |
| Telefon | +998 90 123 45 67 | +998 90 123 45 67 |

Nimaga eʼtibor berish kerak:

- Pul. Minglar boʻsh joy bilan ajratiladi, bu boʻsh joy uzilmaydigan boʻlsin, aks holda summa ikki qatorga boʻlinib ketadi. Kasr ajratgichi vergul, shuning uchun «125,000» yozuvini baʼzi mijozlar yuz yigirma besh deb oʻqiydi. Narxlarda tiyin koʻrsatilmaydi, shuning uchun oxiridagi «,00» ortiqcha. Valyuta sondan keyin yoziladi.
- Sanalar. Oʻzbekchada «21-oktabr» chiziqcha bilan yoziladi. Ruschada esa oy nomi qaratqich kelishigida turadi: «21 октябрь» emas, «21 октября». Kalendar va matn uchun oy nomlari bitta roʻyxatdan olinsa, bu xato tez-tez chiqadi. Hafta dushanbadan boshlanadi, vaqt 24 soatlik formatda yoziladi. uz va ru lokallari uchun standart formatlash vositalari vaqtni tejaydi, lekin natijani koʻz bilan tekshiring: oʻzbek lokalini hamma kutubxona va qurilmalar ham bir xil yaxshi bilmaydi.
- Telefon. +998 va toʻqqizta raqam. Har qanday shakldagi kiritishni qabul qiling: plyus bilan ham, plyussiz ham, 998 bilan ham, usiz ham, boʻsh joy, qavs va chiziqchalar bilan ham. Serverda esa bitta formatga keltiring. Operator kodlarining qatʼiy roʻyxatini kodga yozib qoʻymang: yangi kodlar paydo boʻlib turadi.
- Manzillar. Tuman va koʻchalarning koʻpincha ikki-uch xil nomi boʻladi: oʻzbekcha, ruscha va eskisi. Ochiladigan roʻyxatda interfeys tilidagi nomni koʻrsating, qidiruvda esa hammasini qabul qiling. «Moʻljal» maydoni albatta boʻlsin: kuryerga u koʻpincha uy raqamidan koʻra koʻproq yordam beradi. Manzil formasi [buyurtmani yoʻqotadigan UX xatolari](/blog/ux-mistakes-that-lose-orders/) haqidagi maqolada batafsil koʻrib chiqilgan.

## Bildirishnomalar va qoʻllab-quvvatlash mijoz tilida

Mijoz oʻzbek tilini tanladi, bir soatdan keyin esa ruscha SMS va inglizcha sarlavhali chek oldi. Bu uning hafsalasini qiyshiq tugmadan ham koʻproq pir qiladi.

- Mijozning tili serverdagi profilida saqlanadi va barcha kanallar uni shu yerdan oladi: push-bildirishnomalar, SMS, bot xabarlari, elektron xatlar, cheklar, buyurtma holati haqidagi xabarlar.
- Har bir bildirishnoma shabloni qoʻllab-quvvatlanadigan barcha tillarda boʻladi. Biror shablon yetishmasa, buni mijoz emas, siz sinov paytida yoki hisobotda koʻrishingiz kerak.
- Qoʻllab-quvvatlash xizmatiga kelgan har bir murojaatda mijozning tili belgilangan boʻladi. Smenada kimdir faqat bitta tilda ishonch bilan javob bersa, murojaatlarni shuni hisobga olib taqsimlang.
- Qoʻllab-quvvatlashning tayyor javoblari ham ikki tilda va interfeys bilan bir xil glossariy asosida yoziladi.
- Birinchi liniyada AI yordamchi javob bersa, u savol berilgan tilda javob berishini, kirill yozuvidagi oʻzbekchani va aralash tilda yozilgan xabarlarni tushunishini tekshiring. Bu haqda [Telegramda mijozlarga AI javob berishi](/blog/ai-support-in-telegram/) haqidagi maqolada batafsil yozganmiz.

## Muddat, narx va ularga nima taʼsir qiladi

Ikki til birinchi maketdanoq rejalashtirilgan boʻlsa, ikkinchi til asosan matnlar ustidagi ish va tekshiruvni qoʻshadi. Oddiy sayt yoki bot uchun bu odatda haftalar emas, kunlar.

Matnlar kodga yozib qoʻyilgan, maket esa bitta tilga moʻljallangan boʻlsa, «oʻzbekchasini keyin qoʻshamiz» degan ish satrlarni koddan ajratib olishdan boshlanadi: kichik sayt uchun bu bir necha kun, oʻnlab ekranli ilova uchun bir necha hafta oladi. Bunga haqiqiy matnlar qoʻyilgandagina koʻrinadigan tor joylarni qayta ishlash ham qoʻshiladi.

Ish hajmini oshiradigan narsalar:

- ekranlar va bildirishnoma shablonlari soni;
- uchinchi variant, «Ўзбекча»;
- transliteratsiya va sinonimlarni tushunadigan qidiruv;
- hujjatlar: PDF hisoblar, shartnomalar, cheklar;
- qidiruv tizimlari uchun alohida sahifa manzillari;
- har bir mahsulotning ikkita nomi va ikkita tavsifi boʻladigan admin panel.

Koʻpincha unutiladigan doimiy xarajat ham bor: endi har bir yangi mahsulot, aksiya va yangilikni ikki tilda yozish kerak. Kim yozishi va kim tasdiqlashini oldindan hal qiling. Ishga tushirish arafasida esa mijozning asosiy yoʻlini, kirishdan toʻlov va bildirishnomagacha, har bir tilda, haqiqiy telefonda, shu til ona tili boʻlgan odam bilan birga oʻtib chiqing.

Saytingiz yoki ilovangizning ikki tildagi skrinshotlarini inbox@qilich.com manziliga yuboring, birinchi navbatda nimani tuzatish kerakligini aytib beramiz.
