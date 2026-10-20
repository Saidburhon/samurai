---
slug: speed-on-android
lang: uz
title: "Sayt va ilova tezligi: oʻrta narxdagi Android telefonda tekshiring"
description: "Koʻp mijozlar saytni flagmandan emas, oʻrta narxdagi Android va mobil internet orqali ochadi. Tezlikni qanday tekshirish va nimani birinchi tuzatish kerak."
date: 2026-10-21
tags: [sayt tezligi, mobil ilova, Android, UX, Telegram-bot]
related: [web, mobile, telegram]
reading_minutes: 6
---

Yangi dizaynni odatda shunday qabul qilishadi: dasturchi saytni oʻz telefonida koʻrsatadi, rahbar oʻzinikida ochib koʻradi, ofisdagi Wi-Fi orqali hammasi chaqmoqdek ishlaydi. Bir oydan keyin reklama ketyapti, saytga oʻtishlar bor, buyurtma esa kam. Katta ehtimol bilan mijoz shu saytni ikki yil oldin olingan, xotirasi toʻlib qolgan Android telefonda, mobil internet orqali, liftda yoki yertoʻladagi doʻkonda ochyapti. Oq ekranni koʻradi, bir necha soniya kutadi va Telegramga qaytadi: u yerda raqobatchi allaqachon javob berib boʻlgan. Mijoz sizga «sayt sekin ochilyapti» deb yozmaydi, shunchaki ketadi. Quyida saytingiz va ilovangizni shunday mijozning koʻzi bilan qanday koʻrish, sayt tezligini bepul qanday oʻlchash va nimani birinchi tuzatish kerakligi haqida.

## Siz tekshirayotgan telefon mijozning telefoni emas

Flagman bilan oʻrta narxdagi Android faqat kamerasi bilan farq qilmaydi. Qimmat telefonning protsessori tez, operativ xotirasi koʻp, joyi boʻsh. Arzonrogʻining protsessori ancha sust, xotirasi esa Telegram keshi, rasmlar va oʻnlab ilovalar bilan band. iPhone telefonida sezilmaydigan JavaScript bu yerda sahifani bir-ikki soniyaga qotirib qoʻyadi.

Tarmoq ham boshqacha. Ofisda optika va Wi-Fi. Mijozda esa mobil internet, u liftda, yertoʻlada, odam gavjum savdo markazida, shahar chetida va shahardan tashqarida sezilarli sekinlashadi. Koʻp tariflarda trafik cheklangan, shuning uchun bosh sahifadagi videoni hech kim kutib oʻtirmaydi.

Yana bir farq bor. Siz oʻz saytingizga yuzlab marta kirgansiz, brauzer uni keshda saqlab qoʻygan. Instagram reklamasidan yoki Telegram kanaldagi havoladan kelgan mijoz esa uni birinchi marta ochyapti, koʻpincha ilovaning ichidagi brauzerda, va hammasi unga noldan yuklanadi.

Xulosa oddiy: mijozlarnikiga oʻxshash telefonda, mobil internet orqali, keshni tozalab tekshirish kerak. Mijozlaringiz qaysi modellardan foydalanishini analitikadan bilasiz: Google Analytics 4 ham, Yandex Metrika ham qurilma modellarini koʻrsatadi.

## Tezlik nega pulga teng

Bu yerda chiroyli foizli begona statistikaga berilib ketish oson. Ammo unsiz ham mexanika tushunarli, oʻz raqamlaringizni esa oʻzingiz hisoblaysiz.

- **Odamlar taklifni koʻrmasdan ketadi.** Sahifa yuklanguncha odam «orqaga» tugmasini bosadi. Baʼzan bunday tashrif analitikada umuman qayd etilmaydi: hisoblagich yuklanib ulgurmagan boʻladi. Shuning uchun sekin sayt hisobotlarda koʻpincha koʻrinmaydi.
- **Sahifaga yetib bormagan kliklar uchun pul toʻlaysiz.** Reklama tizimi odam nimanidir koʻrgani uchun emas, oʻtgani uchun pul oladi. Saytda Meta pikseli oʻrnatilgan boʻlsa, Ads Manager kabinetida havola bosilishlari (Link clicks) va maqsadli sahifa koʻrishlari (Landing page views) sonini solishtiring. Farq katta boʻlsa, odamlarning sezilarli qismi sahifa yuklanishini kutmay ketyapti.
- **Sekin interfeys xatolarga olib keladi.** Odam «Toʻlash»ni bosdi, hech narsa boʻlmadi, yana bosdi. Tizim bunga tayyor boʻlmasa, ikkinchi buyurtma, baʼzan esa ikkinchi toʻlov paydo boʻladi, ortidan qoʻllab-quvvatlash xizmatiga qoʻngʻiroq keladi.
- **Qidiruv tizimlari sahifa qulayligini hisobga oladi.** Google oʻz reyting tizimlari Core Web Vitals koʻrsatkichlarini hisobga olishini ochiq yozadi. Bu asosiy omil emas: soʻrovga foydali javob muhimroq. Lekin qolgan hamma narsa teng boʻlsa, sekin sayt yutqazadi.

Yoʻqotishni taxminan, lekin halol hisoblash mumkin: bitta klik qancha turadi, oyiga nechta klik keladi, ulardan qanchasi sahifani kutmay ketgan. Hatto taxminiy raqam ham saytni tezlashtirish dasturchining bir haftalik ishiga arziydimi, degan savolga odatda javob beradi.

## Bepul qanday oʻlchash mumkin

Uchta vosita deyarli hamma narsani qamrab oladi.

**PageSpeed Insights** (pagespeed.web.dev). Manzilni kiriting va mobil qurilmalar yorligʻini oching. Yuqorida Chrome brauzeridagi haqiqiy foydalanuvchilarning oxirgi 28 kunlik maʼlumotlari chiqadi, agar saytga yetarlicha odam kirsa; kichik saytlarda bu blok koʻpincha boʻlmaydi. Pastda laboratoriya testi: u oʻrta darajadagi telefonni sekin mobil internetda taqlid qiladi. Testni uch marta ishga tushiring va oʻrtacha natijaga qarang, chunki baho har safar biroz oʻzgaradi. Faqat bosh sahifani emas, katalog, mahsulot sahifasi va savatni ham tekshiring.

**Chrome DevTools.** Saytni kompyuterdagi Chrome brauzerida oching va F12 ni bosing. Network yorligʻida tarmoqni cheklang (Slow 4G yoki 3G), Performance yorligʻida protsessorni 4–6 barobar sekinlashtiring. Shunda nima yuklanayotgani, qancha ogʻirlikda ekani va birinchi ekranni nima ushlab turgani koʻrinadi. Haqiqiy Android telefonni ham shunday tekshirish mumkin: uning sozlamalarida USB debugging rejimini yoqing, telefonni kompyuterga ulang va `chrome://inspect` sahifasini oching.

**Arzon test telefoni.** Eng halol yoʻl. Mijozlaringiznikiga oʻxshash, bir-ikki yillik oʻrta narxdagi Android sotib oling, masalan Samsung Galaxy A yoki Redmi seriyasidan. Wi-Fi ni oʻchiring, keshni tozalang va mijoz yoʻlini boshidan oxirigacha bosib oʻting: reklama → sayt → mahsulot → savat → toʻlov. Liftda yoki yer osti avtoturargohida ham sinab koʻring. Bu har qanday auditdan arzon va har qanday hisobotdan ishonarliroq.

Hisobotlarda Core Web Vitals deb ataladigan uchta koʻrsatkichni koʻrasiz. Oddiy qilib aytganda:

| Koʻrsatkich | Mijoz uchun maʼnosi | Google boʻyicha yaxshi natija |
|---|---|---|
| LCP (Largest Contentful Paint) | Asosiy narsa qachon chiqdi: banner, mahsulot rasmi, sarlavha | 2,5 soniyagacha |
| INP (Interaction to Next Paint) | Sahifa bosishga qanchalik tez javob beradi | 200 millisoniyagacha |
| CLS (Cumulative Layout Shift) | Yuklanayotganda sahifa sakrab ketmayaptimi | 0,1 gacha |

Google 75-persentil boʻyicha baholaydi: har toʻrtta tashrifdan kamida uchtasida shu natijaga erishilsa, u yaxshi hisoblanadi. INP faqat haqiqiy foydalanuvchilarda oʻlchanadi, shuning uchun laboratoriya testida uning oʻrniga Total Blocking Time, yaʼni sahifa bosishga javob bermay turgan umumiy vaqt qaraladi.

## Saytlarda odatiy aybdorlar

Sabablar deyarli har doim bir xil.

**Ulkan rasmlar.** Kontent-menejer telefondan yoki fotografdan kelgan bir necha megabaytlik suratni yuklaydi, ekranda esa u 400 piksel enida koʻrinadi. Nima qilish kerak: rasmlarni admin panelga yuklash paytida avtomatik siqish va kichraytirish, WebP yoki AVIF formatida berish, brauzerga bir nechta oʻlcham berish (`srcset`), toki telefon kichigini olsin. Birinchi ekrandan pastdagi rasmlarni sahifa aylantirilgan sari yuklash (`loading="lazy"`), lekin asosiy bannerni emas: uni aksincha birinchi yuklash kerak. Hamma rasmlarning eni va boʻyini koʻrsatish, shunda sahifa sakramaydi.

**Bosh sahifadagi slayder va video.** Karuselda beshta banner boʻlsa, odam biror narsani koʻrishidan oldin beshta katta rasm yuklanadi, uchinchi slaydgacha esa kam odam yetib boradi. Tushunarli taklifli bitta statik banner tezroq yuklanadi va asosiy gapni yashirmaydi. Mobil versiyadagi fon videosini rasm bilan almashtirgan maʼqul.

**Piksellar, hisoblagichlar, vidjetlar.** Yillar davomida saytda Meta Pixel, Google Tag Manager, Vebvizorli Yandex Metrika, TikTok pikseli, ijtimoiy tarmoq tugmalari, CRM tizimining onlayn chati, qalqib chiquvchi soʻrovnoma yigʻilib qoladi. Har bir skript oʻzinikini yuklaydi va protsessorni band qiladi, chat vidjeti esa qolgan butun sahifadan ogʻirroq boʻlishi mumkin. Nima qilish kerak: marketolog bilan birga roʻyxat tuzing va faqat maʼlumotidan haqiqatan foydalanilayotganlarini qoldiring. Chatni foydalanuvchi birinchi harakat qilgandan keyin yoki bir necha soniyadan soʻng yuklang. Koʻp hollarda ogʻir vidjet oʻrniga botingizga yoki qoʻllab-quvvatlash akkauntiga olib boradigan oddiy «Telegramda yozish» tugmasi yetarli.

**Ogʻir shriftlar.** Bitta shriftning uchta qalinligi, sarlavhalar uchun yana bir shrift, va bularning hammasi matn chiqishidan oldin yuklanadi. Ikki-uchta qalinlik qoldiring, WOFF2 formatidan foydalaning va `font-display: swap` bilan ulang, shunda matn darhol tizim shriftida chiqadi. Shriftni faqat kerakli belgilarga qisqartirsangiz, toʻplamga kirill harflari va ʻ belgisi (U+02BB) kirganini tekshiring. Aks holda oʻ va gʻ dagi bu belgi boshqa shriftda yoki kvadratcha boʻlib chiqadi.

**Kesh va siqish yoʻq.** Server har safar hamma narsani gzip yoki Brotli bilan siqmasdan, kesh sarlavhalarisiz qaytadan yuboradi. Bu haftalar emas, soatlar ichida sozlanadi. Server qayerda turgani ham muhim: mijozlardan qanchalik uzoq boʻlsa, har bir soʻrov shunchalik uzoq yuradi. Sayt mijozlarning telefon raqami va manzilini saqlasa, qonun baribir Oʻzbekiston fuqarolarining shaxsiy maʼlumotlarini Oʻzbekistondagi serverlarda saqlashni talab qiladi.

**Konstruktorlar va «hammasi bir joyda» shablonlar.** Tilda yoki vizual konstruktorli WordPress saytida rasmlarni siqish va ortiqcha bloklarni olib tashlash mumkin, lekin platforma oʻz kodini qanday yuklashini oʻzgartira olmaysiz. Hamma tozalashlardan keyin ham sayt sekin boʻlsa, sabab endi platformada, savol esa boshqacha qoʻyiladi: shablonni qayta qilish kerakmi yoki boshqa platformaga koʻchishmi.

## Ilovalarda odatiy aybdorlar

Mobil ilova tezligi ham xuddi shu qoidadan boshlanadi: oʻz telefoningizda emas, arzon telefonda qarang.

**Uzoq ishga tushish.** Ochilayotganda ilova analitika, reklama, xato hisobotlari va chatni ishga tushiradi, profil, katalog va aksiyalarni yuklaydi, faqat shundan keyin ekranni koʻrsatadi. Flagmanda bu bir soniya, arzon telefonda esa uzoq tikilib turiladigan yuklanish ekrani. Google Android vitals hisobotida 5 soniya va undan uzoq sovuq ishga tushishni haddan tashqari uzoq deb hisoblaydi. Nima qilish kerak: birinchi ekranni saqlangan maʼlumotlardan darhol koʻrsatish va fonda yangilash, ikkinchi darajali kutubxonalarni keyinroq ishga tushirish, katalogni boʻlib-boʻlib yuklash.

**Hammasi birdaniga.** Yuzlab mahsulotdan iborat lenta, ilova esa hammasini rasmlari bilan, toʻliq oʻlchamda serverdan bir yoʻla tortadi. Sahifalab yuklash va server ekran oʻlchamiga moslab beradigan rasmlar kerak.

**Yuklab olish hajmi.** Telefonda bir-ikki gigabayt joy qolgan, telefon har kuni xotira tugayotgani haqida ogohlantiradi. Bunday odam 150 MB lik ilovani oʻrnatish-oʻrnatmaslikni ikki marta oʻylaydi va keyin birinchi boʻlib aynan uni oʻchiradi. Hajmni foydalanilmaydigan kutubxonalar, ilova ichiga joylangan video va animatsiyalar, shriftlar, serverdan yuklasa boʻladigan rasmlar oshiradi. Google Play hajmni ilova sahifasida koʻrsatadi, mijoz ham uni koʻradi.

**Animatsiyalar.** Har bir ortiqcha animatsiya kuchsiz protsessor va grafika uchun qoʻshimcha ish. Flagmandagi silliq oʻtishlar arzon telefonda toʻxtab-toʻxtab ketadi. Nima boʻlganini tushuntiradigan animatsiyalarni qoldiring (mahsulot savatga uchib tushdi), bezak uchun qoʻyilganlarini olib tashlang.

Qabul qilishda faqat reliz yigʻmasini tekshiring. Debug versiyalar, ayniqsa Flutter va React Native ilovalarida, sezilarli sekinroq ishlaydi va chalgʻitadi. Ishga tushirilgandan keyin Google Play Console ichidagi Android vitals boʻlimiga va ulangan boʻlsa Firebase Performance Monitoring xizmatiga qarang: u yerda haqiqiy qurilmalardagi ishga tushish vaqti va qotib qolishlar koʻrinadi.

## Telegram-botlar va mini ilovalar

Botda tezlik bu javob vaqti. Odam tugmani bosdi, uch-toʻrt soniya jimlik, bot buzilgandek tuyuladi va odam qayta-qayta bosadi. Bot inline tugma bosilishiga javob bermaguncha (`answerCallbackQuery`), Telegram tugmada yuklanish belgisini koʻrsatib turadi.

Bot sekin javob berishining odatiy sabablari:

- har bir bosishda bot 1C yoki CRM tizimiga borib, javobini kutib turadi;
- bazaga indekssiz ogʻir soʻrovlar;
- AI modeliga soʻrov bir necha soniya oladi, foydalanuvchi esa bu vaqtda hech narsa koʻrmaydi;
- yuklama boʻlmaganda «uxlab qoladigan» va birinchi soʻrovda uzoq uygʻonadigan server.

Nima qilish kerak: bosishga darhol javob bering, «yozmoqda…» holatini (`sendChatAction`) yoki qisqa «Mavjudligini tekshiryapman…» xabarini koʻrsating, uzoq ishni esa fonda bajarib, natijani keyingi xabarda yuboring. Katalog, narx va qoldiqlarni oʻz bazangizda saqlang va 1C bilan jadval yoki voqea boʻyicha sinxronlang, har bir bosishda 1C dan soʻramang. Qayta bosish ikkinchi buyurtma ochmasligi kerak.

Mini ilova (Mini App) bu Telegram ichidagi veb-sahifa, shuning uchun saytlar haqida aytilganlarning hammasi unga ham tegishli, faqat talab qattiqroq: odam uni chatdan ochdi va chatning oʻzidek tez ochilishini kutadi. JavaScript yigʻmasining hajmini kuzating: freymvork, komponentlar kutubxonasi, grafiklar, xaritalar birinchi ochilishda yuklanadi. `Telegram.WebApp.ready()` ni asosiy interfeys tayyor boʻlishi bilan imkon qadar erta chaqiring: shungacha Telegram yuklanish oynasini koʻrsatib turadi. Mahsulot rasmlariga saytdagi qoidalar amal qiladi.

## Tezlik byudjetini shartnomaga yozing

«Sayt tez ishlashi kerak» degan gap talab emas, istak: uni tekshirib boʻlmaydi. Talab boshqacha koʻrinadi va uni texnik topshiriqqa yoki shartnoma ilovasiga yozib qoʻygan maʼqul:

- **Test qurilmasi:** aniq telefon modeli, Android versiyasi, Chrome brauzerining joriy versiyasi. Eng yaxshisi, shu telefon sizda saqlansin.
- **Sharoit:** kesh tozalangan, mobil internet yoki DevTools ichidagi Slow 4G rejimi, uch marta oʻlchanadi, mediana olinadi.
- **Sahifa va ekranlar:** bosh sahifa, katalog, mahsulot sahifasi, savat, buyurtmani rasmiylashtirish; ilovada esa ishga tushishdan birinchi foydali ekrangacha boʻlgan yoʻl.
- **Raqamlar.** Quyidagilar namuna, aniq qiymatlarni loyihangizga qarab pudratchi bilan kelishing: PageSpeed Insights mobil testida LCP 2,5 soniyadan, CLS 0,1 dan oshmasin; bosh sahifa hajmi 2 MB dan oshmasin; ilova test telefonida sovuq holatdan katalog chiqqunicha 3 soniyadan koʻp ketmasin; bot tugma bosilishiga bir soniya ichida javob bersin. Asosiysi, raqam boʻlsin.
- **Kim va qachon tekshiradi:** har bir bosqich qabul qilinishidan oldin, bir xil usulda. Maqsadga erishilmasa, pudratchi aktni imzolashdan oldin tuzatadi.
- **Ishga tushirilgandan keyin:** byudjet yangi funksiyalarga ham tegishli. Keyinchalik oʻzingiz uchta piksel va chat vidjeti qoʻshsangiz, tezlik tushadi, bu endi pudratchining xatosi emas. Har qanday yangi tashqi ulanishni avval test telefonida tekshirishga kelishib olish halolroq.

Byudjetning teskari tomoni ham bor: u dizaynni cheklaydi. Bosh sahifadagi video, ogʻir 3D animatsiya va oʻnta vidjet unga sigʻmaydi. Bu haqda ishga tushirilgandan keyin emas, dizayn bosqichida gaplashish kerak.

## Birinchi nimani tuzatish kerak

Deyarli har doim oʻzini oqlaydigan tartib:

1. **Rasmlar.** Siqish, kichraytirish, WebP yoki AVIF ga oʻtkazish, birinchi ekrandan pastdagilarni kechiktirib yuklash, admin panelga yuklashda avtomatik qayta ishlashni sozlash. Odatda bir kundan bir haftagacha: shablonlar soniga va sayt nimada qilinganiga bogʻliq.
2. **Tashqi skriptlar.** Foydalanilmaydiganlarini olib tashlash, chat va ikkinchi darajali hisoblagichlarni kechiktirib yuklash. Texnik tomondan bir necha soatdan bir-ikki kungacha ish, lekin avval marketing roziligi kerak, bu esa koʻpincha ishning oʻzidan uzoqroq choʻziladi.
3. **Shriftlar, kesh, serverda siqish.** Soatlar yoki kunlar.
4. **Qolgan hamma narsa:** ogʻir shablon, butun katalogni bir yoʻla yuklaydigan kod, baza va integratsiyalarga sekin soʻrovlar, ilovaning uzoq ishga tushishi. Bu endi haftalar, odatda ikkidan olti haftagacha, baʼzan undan ham koʻp. Muddat manba kodi va kirish huquqlari sizda bor-yoʻqligiga, mahsulot nimada qilinganiga va u 1C yoki CRM bilan qanchalik bogʻlanganiga bogʻliq.

Har bir qadamdan keyin oʻsha telefonda, oʻsha sharoitda qayta oʻlchang. Shunda nima natija berganini koʻrasiz va yordam bermaydigan narsaga pul sarflamaysiz. Bu oddiy kaydzen: kichik oʻzgarish, oʻlchov, keyingi oʻzgarish. Tekshiruvni muntazam qiling: yangi bannerlar, aksiyalar va ulanishlar saytni oldingi holatiga siz oʻylagandan tezroq qaytaradi.

Nimadan qochish kerak:

- mijozning qoʻlida sayt qanday ishlashiga qarash oʻrniga PageSpeed Insights dagi 100 ball ketidan quvish;
- asosiy bannerga kechiktirib yuklashni yoqish: LCP bundan faqat yomonlashadi;
- WordPress saytiga bir-biri bilan toʻqnashadigan uchta «tezlashtirish» plaginini oʻrnatish;
- dizaynni katta monitordagi maket boʻyicha qabul qilish;
- ishga tushirishdan oldin bir marta tekshirib, keyin bu masalaga hech qaytmaslik.

Saytingiz manzilini inbox@qilich.com ga yuboring va uni oʻrta narxdagi Android telefonda tekshirib berishni soʻrang.
