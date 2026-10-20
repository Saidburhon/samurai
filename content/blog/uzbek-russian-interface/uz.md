---
slug: uzbek-russian-interface
lang: uz
title: "Oʻzbek va rus tilida soʻzlashuvchi mijozlar uchun interfeys dizayni"
description: "Ikki tilli auditoriya uchun interfeys: til tanlash, lotin va kirill yozuvi, matn uzunligi, shriftlarda ʻ belgisi, sana va pul formatlari."
date: 2026-10-21
tags: [UX, ilova dizayni, sayt dizayni, ikki tilli sayt, lokalizatsiya]
related: [web, mobile, telegram]
reading_minutes: 8
---

Koʻp uchraydigan holat: sayt yoki ilova avval rus tilida qilinadi, ishga tushirishdan oldin esa «oʻzbekchasini ham qoʻshib qoʻyamiz» deyiladi. Natijada «Buyurtmani rasmiylashtirish» tugmaga sigʻmay, uch qatorga tushadi, menyuning yarmi ruscha qoladi, toʻlovdagi xato inglizcha chiqadi, «somsa» deb qidirgan mijoz esa «Hech narsa topilmadi» yozuvini koʻradi, chunki katalogda «самса» deb yozilgan. Oʻzbekistonda ikkinchi til oxirida buyurtma qilinadigan tarjima emas. U ham ekran oʻlchami kabi vazifaning bir sharti, uni birinchi maketdanoq hisobga olish kerak. Quyida sigʻmay qolgan tugmalar va yarim tarjima qilingan ekranlardan saqlaydigan amaliy qoidalar.

## Kim nimani oʻqiydi

Mijozlaringiz kamida uch xil koʻrinishda oʻqiydi va yozadi: lotin yozuvidagi oʻzbekcha, kirill yozuvidagi oʻzbekcha va ruscha. Lotin yozuvi rasmiy alifbo, maktabda shu yozuvda oʻqitiladi. Kirill yozuvidan katta yoshdagi koʻp odamlar hali ham foydalanadi, yozishmalarda ham u koʻp uchraydi: odam oʻzbekcha yozadi, lekin rus klaviaturasida. Mijozlarning sezilarli qismi uchun, ayniqsa Toshkentda, rus tili ham ish, ham uy tili. Koʻpchilik esa kun davomida tilni almashtirib turadi: shartnomani ruscha oʻqiydi, kuryer bilan oʻzbekcha yozishadi.

Bundan nima kelib chiqadi:

- Brauzer, telefon yoki Telegram tili faqat ishora, qaror emas. Koʻp odamning telefoni ruscha yoki inglizcha sozlangan, oʻqish uchun esa oʻzbekcha qulayroq.
- Bir marta soʻrang, lekin bu hech narsaga xalaqit bermaydigan joyda: botni birinchi ishga tushirganda, ilovaning birinchi ekranida.
- Tilni bir-ikki bosishda almashtirish imkoni doim boʻlsin, savat va toʻldirilgan forma esa yoʻqolmasin.

Qaysi tillarni qoʻllab-quvvatlashni taxmin bilan emas, oʻz mijozlaringizga qarab hal qiling. Oddiy usul: qoʻllab-quvvatlash xizmati yoki savdo chatidagi oxirgi 200 ta murojaatni oling va qaysi tilda, qaysi yozuvda yozilganini sanab chiqing. Sezilarli qismi oʻzbekchani kirill yozuvida yozsa, uchinchi variant, «Ўзбекча» haqida oʻylab koʻring. Odatda u lotin yozuvidan avtomatik transliteratsiya va istisnolar roʻyxati orqali tayyorlanadi, shuning uchun toʻliq uchinchi tildan arzonroq tushadi. Lekin uni ham alohida tekshirish kerak boʻladi.

## Til almashtirgich

Qanday boʻlishi kerak:

- Har bir ekranda koʻrinib tursin: sayt sarlavhasida, ilovadagi profilda, bot menyusida. Sahifaning eng pastida yoki «Sozlamalar → Boshqa» ichida emas.
- Har bir til oʻz tilida yozilsin: «Oʻzbekcha», «Ўзбекча», «Русский». Ruscha oʻqiydigan mijoz oʻzbekcha sahifada «Rus tili»ni emas, «Русский»ni darrov koʻradi. Teskarisi ham shunday.
- Bayroqlar kerak emas. Bayroq tilni emas, davlatni bildiradi: Oʻzbekistondagi mijozlar uchun qilingan saytda «Русский» yonidagi Rossiya bayrogʻi gʻalati koʻrinadi.
- Tanlov faqat brauzerda emas, serverdagi profilda ham saqlansin. Shunda bildirishnomalar ham kerakli tilda boradi, mijoz boshqa qurilmadan kirganda ham oʻziga odatiy interfeysni koʻradi.
- Til almashtirilganda odam oʻsha sahifada, oʻsha savat bilan qolsin. Bosh sahifaga otib yuborish koʻp uchraydigan va asabga tegadigan xato.
- Saytning har bir til versiyasi oʻz manziliga ega boʻlsin, masalan /uz/ va /ru/, sahifalarga esa hreflang belgilari qoʻyilsin. Shunda qidiruv tizimlari kerakli versiyani koʻrsatadi, havolani esa kerakli tilda ulashish mumkin. IP-manzilga qarab tilni jimgina almashtirmang.
- Ilovada til ilovaning oʻzida almashtirilsin, odamni telefon sozlamalariga yubormang.
- Botda til birinchi /start paytida ikki-uch tugma bilan soʻraladi, keyin uni buyruq va menyu orqali almashtirish mumkin. Bir narsani hisobga oling: Telegramdagi buyruqlar menyusi botdagi tanlovga emas, Telegram ilovasining tiliga qarab chiqadi. Mijoz tilni tanlagandan keyin buyruqlarni aynan uning chati uchun alohida belgilash mumkin.

Standart til dasturchining emas, biznesning qarori. Uni mijozlaringiz, reklama tili va qaysi tilda javob bera olishingiz belgilaydi. Reklama oʻzbekcha boʻlib, sayt ruscha ochilsa, siz shunday kliklar uchun pul toʻlaysiz: odam saytga kiradi-yu, birinchi navbatda til almashtirgichni qidiradi. Saytda butun ekranni yopib qoʻyadigan til tanlash oynasidan koʻra, asosiy tilni koʻzga tashlanadigan almashtirgich bilan ochgan maʼqul. Botda esa aksincha: boshida tugmali qisqa savol deyarli hech narsaga tushmaydi.

## Ikkala versiyani yozing, soʻzma-soʻz tarjima qilmang

Ruschadan soʻzma-soʻz oʻgirilgan matnni mijoz darrov sezadi. «Что-то пошло не так» «Nimadir notoʻgʻri ketdi» boʻlib qoladi: grammatik xato yoʻq, lekin hech kim bunday gapirmaydi. Tabiiyrogʻi: «Xatolik yuz berdi. Qaytadan urinib koʻring». «Ваша заявка принята» esa «Sizning arizangiz qabul qilindi» koʻrinishida idoradan kelgan javobdek eshitiladi, holbuki kafe uchun «Buyurtmangiz qabul qilindi» yetarli. Teskarisi ham shunday: oʻzbekchadan tarjima qilingan ruscha matn ogʻir va rasmiy chiqadi, rusiyzabon mijoz uni ham darrov sezadi.

Matnlar ustidagi ishni qanday tashkil qilish kerak:

1. Glossariy tuzing: mahsulotdagi asosiy soʻzlarning ikki tildagi jadvali. Buyurtma / заказ, savat / корзина, yetkazib berish / доставка, toʻlov / оплата. Bahsli joylarni oldindan kelishib oling: «ilova» yoki «dastur», ruschada «вы» kichik harf bilan yoziladimi yoki «Вы» katta harf bilan, valyuta qanday yoziladi, brend nomi tarjima qilinadimi.
2. Har bir versiyani shu til ona tili boʻlgan va mahsulotni tushunadigan odam yozadi. Mashina tarjimasidan qoralama sifatida foydalanish mumkin, lekin undan keyin oʻzbekcha matnni deyarli har doim qayta yozishga toʻgʻri keladi.
3. Ikkala tildagi matnlarni bitta odam tasdiqlaydi. «Boʻsh turmasin» deb tarjimani qoʻyib qoʻygan dasturchi emas.
4. Matnlar koddan alohida saqlanadi: tarjima fayllarida yoki admin panelda. Shunda xatoni ilovani qayta yigʻmasdan tuzatish mumkin, tushib qolgan tarjima esa mijozning ekranida emas, hisobotda koʻrinadi.

Grammatika ham interfeysga taʼsir qiladi. Ruschada sondan keyin otning uch xil shakli bor: 1 товар, 2 товара, 5 товаров. Oʻzbekchada sondan keyin ot oʻzgarmaydi: «5 ta mahsulot», «5 ta mahsulotlar» emas. Shuning uchun sonli satrlar kodda soʻz bilan qoʻshimchani yopishtirib emas, lokalizatsiya kutubxonalaridagi koʻplik qoidalari orqali yoziladi. Ikkinchi tuzoq: oʻzgaruvchiga yopishtirilgan qoʻshimcha. «{shahar}ga» shabloni «Toshkent» uchun toʻgʻri ishlaydi, Chirchiq uchun esa «Chirchiqqa» oʻrniga «Chirchiqga» chiqadi, chunki qoʻshimcha soʻzning oxirgi harfiga bogʻliq: -ga, -ka yoki -qa. Gapni oʻzgaruvchi alohida turadigan qilib tuzish ishonchliroq: «Shahar: Chirchiq».

Tarjima qilinmagan boʻlaklar odatda qayerda yashirinadi:

- server kodi va tayyor kutubxonalardan keladigan xato va maydonlarni tekshirish xabarlari, ular koʻpincha inglizcha boʻladi;
- tizim oynalari: kamera va geolokatsiyaga ruxsat soʻrash, sana tanlash;
- toʻlov sahifasi: toʻlov xizmati til parametrini qabul qilsa, mijozning tilini uzating;
- xatlar, SMS, push-bildirishnomalar, PDF hisoblar va cheklar;
- 404 sahifasi, boʻsh ekranlar, maydonlar ichidagi maslahat matnlari;
- ilova doʻkonlaridagi tavsif va skrinshotlar, doʻkon kerakli tilni qoʻllab-quvvatlagan joyda;
- botning menyusi, buyruqlari va tugmalari.

## Matn uzunligi va maket

Bir xil maʼno ikki tilda har xil joy egallaydi. Oʻzbekcha matn koʻpincha uzunroq: «В корзину» va «Savatga qoʻshish», «Оформить заказ» va «Buyurtmani rasmiylashtirish». Aksincha boʻlishi ham mumkin: «Личный кабинет» va «Kabinet». Har bir joyda maket ikkala variantning uzunrogʻini koʻtara olishi kerak.

Amaliy qoidalar:

- Maketlarni ikkala tildagi haqiqiy matnlar bilan chizing: «Lorem ipsum» bilan ham, faqat ruscha matn bilan ham emas. Dizayner har bir tugmaning eng uzun yozuvini koʻrishi kerak.
- Tugma va menyu bandlaridagi matn uch nuqta bilan qirqilmasin, ikkinchi qatorga oʻtsin. Qirqilgan «Buyurtmani rasmiy…» qisqa «Buyurtma berish»dan yomonroq, shuning uchun baʼzan matnning oʻzini qisqartirish toʻgʻriroq.
- Qoʻshimchalar tufayli oʻzbekcha soʻzlar juda uzun boʻlishi mumkin, brauzerlardagi avtomatik boʻgʻin koʻchirish esa oʻzbek tili uchun ishlamasligi mumkin. Sarlavhalar va tor ustunlarda unga umid qilmang.
- Mobil ilovaning pastki menyusi eng tor joy: toʻrt-besh band, har biri bitta qisqa soʻz. Ikonkalar tasdiqlanmasidan oldin ikkala tilda soʻzlarni tanlab qoʻying.
- Tor ekranli telefonda va kattalashtirilgan tizim shrifti bilan tekshiring: baʼzi foydalanuvchilarda u yoqilgan boʻladi.
- Botda inline-tugmadagi uzun yozuv telefon ekranida qirqiladi. Ikkala tilda ham tugma yozuvlarini qisqa qiling.

## Harflar, shriftlar va ʻ belgisi

Lotin yozuvida oʻ va gʻ harflari maxsus ʻ belgisi bilan yoziladi (Unicodeda U+02BB), «maʼlumot» kabi soʻzlardagi tutuq belgisi esa ʼ (U+02BC). Oddiy klaviaturada ular yoʻq, shuning uchun oʻrniga apostrof, teskari apostrof yoki tipografik qoʻshtirnoq qoʻyiladi. Interfeysda bu beparvolikdek koʻrinadi, eng yomoni esa bitta ekranda uch xil variant chiqishi.

Nima qilish kerak:

- Interfeys matnlarida toʻgʻri ʻ va ʼ belgilarini ishlating. Buni glossariyga yozib qoʻying va har bir yangilanishdan oldin tarjima fayllarida qidiruv orqali tekshiring.
- Shriftda ʻ va ʼ belgilari hamda Ў, Қ, Ғ, Ҳ harflari bor kirill yozuvi boʻlishi kerak. Tekshirish oson: ishlatadigan barcha uslublarda, yaʼni oddiy, qalin va kursivda «Oʻzbekiston, gʻisht, maʼlumot, Ўзбекистон, қўшиш, ғишт, ҳисоб» deb yozib koʻring.
- Shrift Google Fontsdan ulansa, Қ, Ғ, Ҳ harflari asosiy kirill toʻplamiga emas, kengaytirilgan toʻplamga (cyrillic-ext) kiradi. Uni ulash esdan chiqsa, bu harflar boshqa shriftda chiqadi.
- Shriftda belgi boʻlmasa, brauzer yoki telefon uni tizim shriftidan oladi: qalinligi va balandligi boshqacha boʻladi, soʻz «sakrab» turadi. PDF cheklarda, rasmlarda va kassa terminallarida harf oʻrnida boʻsh kvadrat yoki soʻroq belgisi chiqishi mumkin. Buni faqat haqiqiy hujjatlarda koʻrish mumkin, shuning uchun ularni chop etib, oʻzingiz ochib koʻring.
- SMS: GSM asosiy toʻplamidan tashqaridagi har qanday belgi, xoh kirill harfi, xoh ʻ boʻlsin, xabarni Unicodega oʻtkazadi va bitta segmentga 160 emas, 70 ta belgi sigʻadi. Shuning uchun SMSda ʻ koʻpincha oddiy apostrof bilan almashtiriladi. Bu narx uchun qilingan murosa: uni ongli ravishda va faqat SMS uchun qabul qiling.

## Ikkala yozuvni tushunadigan qidiruv

Mijoz qanday yozishga odatlangan boʻlsa, shunday qidiradi. Bitta mahsulotni «somsa», «samsa», «самса» va «сомса» deb qidirishadi. Tumanni esa «Chilonzor», «Чилонзор» va «Чиланзар» deb. Ruscha nom koʻpincha oʻzbekcha nomning kirillchasiga mos kelmaydi: «Chilonzor» kirill yozuvida «Чилонзор», ruschada esa «Чиланзар». ʻ belgisini esa deyarli hech kim terib oʻtirmaydi: «ozbek», «qoshish» deb yozib qoʻya qolishadi.

Qidiruv uchun eng kam toʻplam:

1. Normallashtirish. Apostrofning barcha variantlari (' ` ‘ ’ ʻ ʼ) ham soʻrovda, ham katalogda bittaga keltiriladi. Belgisiz qidiruv ham ishlashi kerak: «ozbek» soʻrovi «oʻzbek»ni topsin.
2. Transliteratsiya. Lotincha soʻrov kirillcha nomlar boʻyicha ham qidiriladi, kirillchasi esa lotincha nomlar boʻyicha. Oʻzbek tili uchun qoidalar deyarli bir maʼnoli (sh va ш, ch va ч, oʻ va ў, gʻ va ғ), lekin istisnolar bor: «ц» harfli ruscha oʻzlashma soʻzlar, soʻz boshidagi «е» va «э», atoqli otlar. Ular alohida roʻyxatda saqlanadi.
3. Sinonimlar. Mahsulot va xizmatlarning ruscha va oʻzbekcha nomlari, kundalik soʻzlar, koʻchalar va moʻljallarning eski nomlari. Bu lugʻatni dasturchi emas, biznes toʻldiradi, shuning uchun unga admin panelda joy kerak.
4. Notoʻgʻri klaviatura: «плов» oʻrniga «gkjd». Qoida oddiy, yoʻqolgan soʻrovlar esa kamayadi.
5. Natija bermagan soʻrovlar hisoboti. Uni haftada bir marta koʻrib chiqing: bu yangi sinonimlarning eng arzon manbai.

Muddatlar haqida: kichik katalog uchun normallashtirish va oddiy transliteratsiya odatda bir necha kunlik ish. Morfologiya, sinonimlar va xato yozilgan soʻzlarni hisobga oladigan toʻliq qidiruv esa katalog hajmi va u nimada qurilganiga qarab bir haftadan bir necha haftagacha vaqt oladi.

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

- Pul. Minglar boʻsh joy bilan ajratiladi, u ham uzilmaydigan boʻsh joy boʻlsin, aks holda summa ikki qatorga boʻlinib ketadi. Kasr ajratgichi vergul, shuning uchun «125,000» yozuvini baʼzi mijozlar bir yuz yigirma besh deb oʻqiydi. Narxlarda tiyin koʻrsatilmaydi, oxiridagi «,00» ortiqcha. Valyuta sondan keyin yoziladi.
- Sanalar. Oʻzbekchada «21-oktabr» chiziqcha bilan yoziladi. Ruschada esa oy nomi kelishikda turadi: «21 октября», «21 октябрь» emas. Kalendar va matn uchun oy nomlari bitta roʻyxatdan olinsa, bu xato tez-tez chiqadi. Hafta dushanbadan boshlanadi, vaqt 24 soatlik formatda yoziladi. uz va ru lokallari uchun standart formatlash vositalari vaqtni tejaydi, lekin natijani koʻz bilan tekshiring: oʻzbek lokalini hamma kutubxona va qurilmalar ham bir xil yaxshi bilmaydi.
- Telefon. +998 va toʻqqizta raqam. Har qanday shakldagi kiritishni qabul qiling: plyus bilan ham, plyussiz ham, 998 bilan ham, usiz ham, boʻsh joy, qavs va chiziqchalar bilan ham. Serverda esa bitta formatga keltiring. Operator kodlarining qatʼiy roʻyxatini kodga yozib qoʻymang: yangi kodlar paydo boʻlib turadi.
- Manzillar. Tuman va koʻchalarning ikki-uch xil nomi boʻladi: oʻzbekcha, ruscha va eskisi. Roʻyxatda interfeys tilidagi nomni koʻrsating, qidiruvda esa hammasini qabul qiling. «Moʻljal» maydoni albatta boʻlsin: kuryerga u koʻpincha uy raqamidan koʻra koʻproq yordam beradi. Manzil formasi haqida [buyurtmani yoʻqotadigan UX xatolari](/blog/ux-mistakes-that-lose-orders/) haqidagi maqolada batafsil yozilgan.

## Bildirishnomalar va qoʻllab-quvvatlash mijoz tilida

Mijoz oʻzbek tilini tanladi, bir soatdan keyin esa ruscha SMS va inglizcha sarlavhali chek oldi. Bu uning hafsalasini qiyshiq tugmadan ham koʻproq pir qiladi.

- Mijozning tili serverdagi profilida saqlanadi va barcha kanallar uni shu yerdan oladi: push-bildirishnomalar, SMS, bot xabarlari, xatlar, cheklar, buyurtma holati.
- Har bir bildirishnoma shabloni qoʻllab-quvvatlanadigan barcha tillarda boʻladi. Shablon yetishmasa, bu mijozda emas, sinov paytida yoki hisobotda chiqishi kerak.
- Qoʻllab-quvvatlash xizmatiga kelgan murojaat xodimga mijoz tili belgisi bilan keladi. Smenada kimdir faqat bitta tilda ishonch bilan javob bersa, murojaatlarni shuni hisobga olib taqsimlang.
- Qoʻllab-quvvatlashning tayyor javoblari ham ikki tilda va interfeys bilan bir xil glossariy asosida yoziladi.
- Birinchi liniyada AI yordamchi javob bersa, u savol berilgan tilda javob berishini, kirill yozuvidagi oʻzbekchani va aralash tilda yozilgan xabarlarni tushunishini tekshiring. Bu haqda [Telegramda AI orqali qoʻllab-quvvatlash](/blog/ai-support-in-telegram/) maqolasida batafsil.

## Muddat, narx va ularga nima taʼsir qiladi

Ikki til birinchi maketdanoq rejalashtirilgan boʻlsa, ikkinchi til asosan matnlar ustidagi ish va tekshiruvni qoʻshadi. Oddiy sayt yoki bot uchun bu odatda haftalar emas, kunlar.

Matnlar kodga yozib qoʻyilgan, maket esa bitta tilga moʻljallangan boʻlsa, «oʻzbekchasini keyin qoʻshamiz» satrlarni koddan chiqarishdan boshlanadi: kichik sayt uchun bir necha kundan oʻnlab ekranli ilova uchun bir necha haftagacha. Bunga haqiqiy matnlar qoʻyilgandagina koʻrinadigan tor joylarni qayta ishlash ham qoʻshiladi.

Ish hajmini oshiradigan narsalar:

- ekranlar va bildirishnoma shablonlari soni;
- uchinchi variant, «Ўзбекча»;
- transliteratsiya va sinonimlarni tushunadigan qidiruv;
- hujjatlar: PDF hisoblar, shartnomalar, cheklar;
- qidiruv tizimlari uchun alohida sahifa manzillari;
- har bir mahsulotning ikkita nomi va ikkita tavsifi boʻladigan admin panel.

Koʻpincha unutiladigan doimiy xarajat ham bor: endi har bir yangi mahsulot, aksiya va yangilikni ikki marta yozish kerak. Kim yozishi va kim tasdiqlashini ishga tushirishdan oldin hal qiling. Ishga tushirish arafasida esa asosiy yoʻlni, kirishdan toʻlov va bildirishnomagacha, har bir tilda, haqiqiy telefonda, shu til ona tili boʻlgan odam bilan birga bosib chiqing.

Saytingiz yoki ilovangizning ikki tildagi skrinshotlarini inbox@qilich.com manziliga yuboring, birinchi navbatda nimani tuzatish kerakligini aytib beramiz.
