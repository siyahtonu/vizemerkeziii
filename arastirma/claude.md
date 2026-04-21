1. ALGORİTMA

"Bayes karışımı" diye adlandırdığın şey Bayes değil, lineer enterpolasyon. finalA = raw * 0.65 + (1 - trReject) * 0.35 — bu ağırlıklı ortalama. Posterior = likelihood × prior / evidence formülü yok ortada. İsmini doğru koy; yoksa kodu açan bir istatistikçinin gözünde mühendis sihirli sayılarla oynuyor olarak okunur.
0.65/0.35 nereden geldi? Kalibrasyon eğrisi, Brier skoru, log-loss, ROC/AUC ile optimize edilmemişse bu iki sabit senin iç sesin. Gerçek veriyle grid search yap, optimal katsayıyı bul — büyük ihtimalle 0.65 değil, ve ülkeye göre değişiyor.
Çift sayım var, ciddi biçimde. Katman 2'de (1 - trRejectionRate) ülke base rate'ini veriyor; Katman 3'te "profil × ülke" yine ülke bazlı; Katman 4'te "konsolosluk zone" hâlâ aynı ülkenin içinde. Aynı sinyali üç kez fiyatlıyorsun. Ülkeyi tek yerde modelle (ya Katman 2'de base rate olarak, ya Katman 3'te profil etkileşimi olarak — ikisi birden değil).
Katmanlar çarpımlı/karışık → hata birikimi. Her katmanda ±%5-10 gürültü varsayarsak, 5 katman sonrası skorun efektif belirsizlik aralığı ±15-25 puan. Buna rağmen UI'da "83" gibi iki basamaklı tek sayı göstermek sahte hassasiyet (false precision) — dürüst gösterim "Yüksek (70-85 aralığı, güven %60)" olmalı.
8 bölümün additive toplamı korelasyonu görmezden geliyor. Yüksek bakiye, sabit maaş, mülk sahibi, düzenli SGK — bunlar ortogonal değil, aynı "ekonomik köklenmişlik" faktörünün gölgeleri. Additive model bu korelasyonu çifte ödüllendiriyor; varlıklı profiller skorda tavan yapıyor, sınırda profiller hak ettiğinden aşağıda. Çözüm: PCA ile factor collapse ya da L2 regularizasyonlu logistic regression.
Veto cap'in yeri sağlam, ama cap sonrası katmanların cap'i yumuşatıp yumuşatmadığını kontrol etmen lazım. Katman 1'de cap 45'e düştüyse, Katman 2'deki (1-trReject)*0.35 terimi hâlâ 45'i 50+'ye itebiliyor. Cap'i en son uygula; veto = hard ceiling, ondan sonra hiçbir katman ekleyemesin.
temporalDecay(halfLifeYears) literatürde standart değil — konsolosluk sistemleri böyle çalışmıyor. VIS/CCD kayıtları overstay'i, refüseyi, iptal edilmiş vizeleri unutmaz; yılda %X silinmez. Decay'i olumlu sinyaller için (eski onaylanmış vize) kullan, olumsuzlar için kullanma. Half-life = evrensel sabit değil, event türüne göre farklı (onay: 3 yıl makul, ret: kalıcı flag, overstay: kalıcı + ciddi discount).
eventYear = -1 "hiç yok", 0 "bilinmiyor" → magic value anti-pattern. Null handling için undefined + explicit "unknown" enum kullan. İleride 0 = year 2000 diye geçen bir veri seti gelirse pipeline sessizce yanlış davranır.
Profil × ülke matrisi = 160 hücre, n=2077 → hücre başına ~13 gözlem. Hiyerarşik Bayesian shrinkage veya en azından Laplace smoothing yapmıyorsan bu tablo overfit. "Serbest meslek × Litvanya" hücresi muhtemelen 2 gözleme dayanıyor ve 1.15 çarpanı istatistiksel olarak gürültü.
"Konsolosluk kalibrasyonu" (Katman 4) — güncelleme mekanizmasını söylemedin. Hard-coded sabitse 3 ay içinde eskir; manuel güncelleniyorsa bu astroloji. Objektif kaynak lazım: VFS randevu doluluk oranı, EU open data'dan aylık ret oranı delta'sı, kullanıcı feedback'i istatistiksel anlamlılığa ulaştığında update.
Mevsimsellik ±%8 fazla agresif. Yaz aylarında Schengen için "ret oranı artar" daha çok mit, gerçekte artan şey wait time ve dossiers-per-officer ratio. Onay oranında istatistiksel anlamlı fark genelde ±%2-3'tür. ±%8 büyük ihtimalle overfit — doğrula.
Asıl sorun: Katman 1 additive + Katman 2 "Bayes" + Katman 3-4-5 multiplicative = melez Frankenstein model. Ya tam probabilistic (logistic regression / gradient boosting, kalibre edilmiş, n=2077 için bile yapılabilir), ya tam kural tabanlı expert system. Ortadaki konumda ne açıklanabilir ne güvenilir.

2. VERİ

n=2077 bu parametre sayısı için yetersiz. 40+ raw feature, 160 profil×ülke hücresi, 240 mevsimsellik hücresi → efektif parametre sayısı 300+. Serbestlik derecesi gözlem sayısına yaklaşıyor. Rule of thumb: modelin parametre sayısının en az 10 katı gözlem. Senin durumunda bu 3000+ demek, tek tek hücreler için çok daha fazla.
Veri nasıl toplandı? Self-reported ise survivorship bias baştan bozuk. Başarılı başvuranlar paylaşır, reddedilenler susar ya da utanır. Tahminim: empirik ret oranın gerçekte olduğundan düşük. Sistematik undersampling.
Label granularity muhtemelen çok düşük. Sadece "approved/rejected" değil, "multi vs single entry", "validity süresi", "ret + ek belge istendi + kabul edildi" gibi multi-class olmalı. Tek bit label = bilgi kaybı.
Eksik kovariyetler (değer sırasıyla):

Schengen kaskadı geçmişi (çok önemli): 15 Temmuz 2025 sonrası AB, son 3 yılda 2 Schengen vizesini yasal kullanmış Türkleri "bona fide traveller" olarak özel muameleye tabi tutuyor. 1 yıllık → 3 yıllık → 5 yıllık zincir var. Önceki vize süresi ve son başvuru tarihine göre kademeli olarak daha uzun vizeler verilebilir. EEAS Modelin bunu ayrıca işliyor mu, yoksa "önceki Schengen sayısı" olarak mı geçiyor? Cascade kuralı binary bir sıçrama yaratıyor, lineer değil.
Pasaport yaşı + doluluk oranı (yeni pasaport = ret sinyali)
Önceki başvuruların aynı konsolosluk mu / farklı konsolosluk mu (konsolosluk "shopping" davranışı kırmızı bayrak)
Employer büyüklüğü (büyük kurumsal vs <5 kişilik LLC vs yeni kurulmuş şirket)
Askerlik durumu — Türk erkekleri için ABD/UK'de ciddi sinyal (tecil, bedelli, muaf, uzman)
Medeni durum x eş seyahat durumu (eşi başvurmuyor + sen başvuruyorsan → dönüş bağı zayıf)
Schengen D tipi vs C tipi önceki deneyim (uzun süreli vize geçmişi çok farklı sinyal)
Başvuru dosyasındaki "ek belge talep edildi mi" bayrağı
Pasaportta önceki vizelerin kullanıldığını gösteren damgaların kullanım yoğunluğu


Kesinlikle TOPLAMA: etnik köken, doğum yeri (Güneydoğu illeri ile korelasyonu üzerinden dolaylı proxy olur), Kürt kimliği, Alevi/Sünni, din, siyasi görüş. Hem KVKK madde 6 özel nitelikli veri, hem ahlaki felaket, hem PR bombası. Konsolosluğun ayrımcılık yapması senin onu modele sokman için bahane değil.
Makul ama dikkat: sektör (inşaat vs IT vs kamu) anlamlı sinyal, ama SGK düzenliliği + gelir istikrarı ile korelasyonlu — çifte sayım tuzağı. Kamu çalışanı için zaten yıllık izin + sözleşme türü sinyallerini alıyorsun.

3. ÜRÜN

18 araç açık bir hata. Bu tool graveyard. Kullanıcı 18 aracın ne yaptığını keşfetmek için enerji harcamaz — ilk 3 aracı dener, beklediğini bulamazsa çıkar. 5-6 güçlü araç tüm değeri verir.
Ayrıştırıcı (korunacak): skorlama motoru, ret risk algoritması, ret mektubu decoder, kırmızı bayrak tarayıcı, niyet mektubu üretici (TR+EN), ret nedeni haritası (2021-2026 kodlar — tek başına moat). Banka dökümü analizi de potansiyel olarak iyi ama AI hallucination riski yüksek.
Gürültü (kaldır veya kenarda sakla):

Vizesiz ülkeler rehberi → Google ilk sonuç
Maliyet hesaplayıcı → trivial, diferansiyasyon yok
90/180 hesaplayıcı → schengensimplecalculator.com, 5+ ücretsiz alternatif
Çoklu ülke planlayıcı → Rome2Rio, Skyscanner halediyor
Sosyal medya audit → etik gri alan, zayıf sinyal, PR riski yüksek
Randevu takip botu → byigitt/visa-checker açık kaynak, Telegram ücretsiz bot, bu konuda rekabet edemezsin — ücretsizinin üstünde para isteme
Ülke kıyaslayıcı + "Nereye gidebilirim" — bunlar aynı aracın iki yüzü, birleştir


Freemium eşiği yanlış yerde. Skoru ücretsiz vermek = değerli hook'u bedava dağıtmak. Kullanıcı skorunu alır, sonuç iyiyse çıkar gider. Doğru model: e-posta karşılığı skor + en zayıf 2 boyut açıklaması ücretsiz; detaylı breakdown + niyet mektubu PDF'i + ret risk raporu + ret mektubu decoder ücretli. "Teaser" değil "free value + paid leverage" yapısı.
Onboarding: 8 profil tipi fazla. Merge önerisi:

"Gelir kaynağım var" (çalışan + işveren + serbest + emekli) — bu 4'ü tek soruyla içeri al, sonra alt-soru sor.
"Gelir kaynağım yok" (öğrenci + çalışmıyor)
"Sponsorluyum" — profil değil, modifier (ana profile eklenen bayrak)
"Reşit değilim" — modifier (aile ile seyahat flag'i)
Bu sadeleştirme tek tıklama 3 tıklamaya dönüşmesin diye önemli.


6800 satırlık App.tsx bir ürün sorunu değil ama 6 ay sonra kendini köstekleyecek bir zaman bombası. Yeni özellik eklerken re-render patlamaları, diff takibi çok pahalılaşır. Bunu state machine + feature module'lere bölmek için şimdi bir hafta harca, yoksa 3 ay sonra iki hafta harcarsın.

4. KULLANIM SENARYOLARI (unutulanlar)

Overstay sonrası rehabilitasyon — en değerli niş senaryolardan biri ve sen unutmuşsun. 5 yıl önce 30 gün overstay yapmış bir kullanıcı hâlâ tekrar alabilir ama çok spesifik strateji ister. Bu tek başına bir premium feature olabilir.
Askerlik durumu (Türk erkekleri) — büyük eksik. Tecil, bedelli ödenmiş, muaf, er olarak tamamlanmış, uzmanlık — hepsi ayrı sinyal. ABD B1/B2'de mülakatta ilk 3 soru arasında. Ankara/İzmir gibi şehirden başvuran 25-35 yaş erkek için bu primary risk factor.
Cascade rule'dan yararlanabilir profil (2025 sonrası yeni kategori). Son 3 yılda 2 Schengen'i yasal kullanmış başvuru sahibi → skoru ayrı bir boost almalı, ayrı bir strateji ekranı görmeli ("1 yıllık yerine 3 yıllık iste").
Re-application (önceki reddi olan kullanıcı) — yeniden başvuru stratejisi tamamen farklı: ret mektubu adresleme, değişen koşulları vurgulama, ek belge paketi. Buna ayrı akış lazım.
Eşe bağımlı başvuran + aile başvurusu — tek skorla değerlendiremezsin. Family unit score gerekli.
Pasaport türü farkı: bordo vs yeşil (hususi) vs gri (hizmet) vs diplomatik. Yeşil pasaport sahipleri zaten bazı Schengen ülkelerine vizesiz gidiyor — ürün bu durumda kendini "gerek yok" diyerek susturmalı, yoksa güven kaybeder.
Çifte vatandaş (TR+EU/US/UK) — bu durumda aracın mantığı yanlış. Kullanıcı diğer pasaportunu kullanmalı, senin skorlama motorun irrelevant. Uygulama bunu sormuyorsa boşa iş yapıyor.
Üçüncü ülkeden başvuran Türk — Londra'da yaşayan, orada kalış izni olan Türk, Schengen'e Londra'dan başvuruyor. Residency country farklı → bambaşka consulate rules.
Yeni kurulmuş şirket sahibi (< 6 ay) — "işveren" profil tipinde ama klasik işveren sinyallerini vermiyor; ters çevrilmiş risk.
Kripto / gig ekonomisi geliri — banka dökümünde düzensiz görünen meşru gelir. Bunu açıklayacak üretici (declaration letter) + SGK olmaması meşru hale nasıl getirilir rehberi.
Kürt/Güneydoğulu/Suriye kökenli TC kimliği — reel bias var, kullanıcıyı uyaracak ve strateji önerecek bilinçli mekanizma lazım. Proxy olarak doğum yeri bilgisini toplama (yapma), ama kullanıcı kendi ifade ederse "bu konuda belge desteği güçlendir" yönlendirmesi yapabilir.
İsim değiştirme (evlilik, hukuki, trans) — önceki vizelerle pasaportun isim uyuşmazlığı ciddi red flag. Bunu açıklayan ek belge rehberi.
Gazetecilik / akademik / araştırma işi — özellikle ABD'de B1 yerine J-1/I gerekliliği riski, yanlış vize kategorisi başvurusu uyarısı.
Sağlık sebebi seyahat — yanlış vize kategorisi tuzağı, davetiyeli tedavi başvurusu farklı dokümantasyon.

5. RAKİP / ALTERNATİF

vizelim.com (Türkiye, direkt rakip): "14 faktörlü deterministik analiz motoru" diyorlar. Senin 5 katmanlı + 8 bölümlü yapın teknik olarak daha derin, ama onlar markete çıkmış ve SEO'da görünüyorlar. Hız + pazarlama kaybediyorsun.
VisaHQ (global): Offline ağırlıklı, traditional agency model, AI yok. Türkiye'de zayıf varlık. Senin AI avantajın burada.
Atlys (ABD merkezli, app-based): Concierge model, Türkçe değil, Türkiye pazarında yok. Fakat UX bar'ını koyuyorlar — tool katalog yerine "submit & relax" illüzyonu satıyorlar. Senin 18 araçlı yapının aksine tek flow.
Setur / Turistika / klasik vize acenteleri: Offline, pahalı (500-1500 TL), AI yok, ölçeklenmez. Senin orta fiyat + self-service modelin onları altından alıyor ama güven konusunda onlara geride.
GitHub açık kaynak çözümler (byigitt/visa-checker, visasbot.com API): Randevu takibi commodity. Bu konuda ücretli ürün satamazsın.
Senin gerçek moat'ların:

n=2077 Türk-spesifik ampirik data — erişilemez
Ret mektubu decoder (2021-2026 kod kataloğu) — erişilemez
TR+EN niyet mektubu AI üretimi — kopyalanabilir ama prompt tuning kalitesi moat
Versioned scoring engine + regression testing disiplini — operasyonel olgunluk


Kopyalayan yanların:

Skor meter UI (industry standard)
"AI copilot" sekmesi (trendy, generic)
Tool catalogue yaklaşımı (Atlys'den esinlenmiş hissi var)



6. RİSKLER

KVKK madde 6 özel nitelikli kişisel veri ihlali riski açık. Topladığın şeyler: mali durum (banka bakiyesi, gelir), sabıka bilgisi, sosyal medya footprint — bunlar özel nitelikli veri ya da ona dolaylı erişim. Açık rıza şart, amaç sınırlaması belirgin olmalı, VERBİS kaydı yapılmış mı kontrol et. Yapılmamışsa idari para cezası 1.000.000-6.000.000 TL arası.
GDPR tetikliyor çünkü AB'ye veri transferi var. Anthropic API (US merkezli) ile Standard Contractual Clauses (SCC) veya DPA imzaladın mı? Anthropic'in Data Processing Addendum'u var, ama senin data controller olarak bunu kabul edip sözleşmeni güncelleyip kullanıcılarına açıklaman gerekiyor.
Vize danışmanlığı regüle değil ama "hukuki yorum" yasak. Türkiye'de avukatlık kanunu 35. madde — avukat olmayanın hukuki görüş bildirmesi yasak. Senin ret mektubu decoder'ı eğer "bu Schengen Visa Code madde X'e göre..." gibi hukuki yorum yapıyorsa riskli. Disclaimer yeterli değil — metnin kendisi "bilgilendirme, hukuki görüş değil" sınırında kalmalı.
"%82 onay olasılığınız var" → kullanıcı reddedilirse tüketici hakem heyeti + sosyal medya ateş çemberi. TOS'taki "bu tahmindir, garanti değildir" maddesi hukuki olarak kısmen korur, ama marka zararı tamir edilemez. En az 2-3 ret vakası Twitter'da viral olur.
AI hallucination → niyet mektubunda uydurma referans. "Schengen Vize Kodu madde 23'e göre talep ediyorum" — böyle bir madde olmayabilir. Konsolos görürse mektup güvenilirliği sıfırlanır + başvuru düşer. Niyet mektubu template'lerinde AI output post-processing ile regülatif referansları white-list ile filtrele.
Konsolosluk veri güncelleme açığı. "Consulate mood multiplier" 3 ay eskimişse senin "85" skorun gerçekte 70. Kullanıcı mağduriyeti senin hatandan. Bu veriye actual güncelleme pipeline'ı yoksa Katman 4'ü tamamen kaldır — eksik özellik var olmayan özellikten iyidir.
Feedback loop survivor bias'i algoritmayı içten çürütüyor. Başarılılar paylaşır, başarısızlar sessiz kalır. Model yanlış tarafa kalibre olur. Çözüm: proaktif outreach — başvuru tarihinden 6 hafta sonra mail at "sonuç ne oldu?" diye; ret oranını %30'a çıkarmayı başar.
Etik: düşük skor aldığı için başvurmaktan vazgeçen meşru başvuru sahibi. Bu senin ret oranını artırıcı davranış değil ama meşru hakların kullanılmasını engelliyor. Skor düşük çıktığında "başvurma" değil, "başvurmadan önce şu 3 şeyi düzelt, 3 ay bekle, tekrar dene" yönlendirmesi olmalı.
"Gaming" etik sorunu: ürün aslında konsolosluğu manipüle etme tekniği öğretiyor. Bu bir süre iyi çalışır — sonra konsolosluklar pattern'ı tanır, bu patternları bayrak yapar, ve senin ürününü kullananlar daha çok reddedilmeye başlar. Kendi kuyruğunu yiyen etki.
İyzipay entegrasyonu + kullanıcı verisi = PCI-DSS yükümlülüğü. Kart bilgileri Iyzipay'de kalıyorsa sen SAQ-A kapsamındasın, ama her yıl compliance evidence tutman lazım.
Claude API rate limiting IP bazlı (60 sn'de 10 istek) yetersiz. Kullanıcı VPN değiştirerek sınırı aşar, maliyetin tavan yapar. API anahtar kullanılan kullanıcı ID + session bazlı limit + monthly quota eklentisi lazım.

7. YANLIŞ YAPTIĞIN NE VAR — düz, filtresiz

"Bayes karışımı" terim yanlışı ciddi bir kredibilite delgeci. Herhangi bir istatistik background'u olan yatırımcı, danışman, mühendis koda bakarsa "bu kişi kavramı anlamamış, magic number oynuyor" sonucuna varır. Ya doğru Bayesian (likelihood × prior, posterior distribution, credible interval) yap, ya "lineer blend" olarak isimlendir. Ortada kalmak en kötü.
134 test, model validation değil regression testing. Regression test = "önceki çıktıyla bugünkü çıktı aynı mı". Model doğru mu sorusunu cevaplamaz. Eğer her iki çıktı da yanlışsa, 134 test her ikisinin de yanlış olduğunu onaylıyor. Gerçek validasyon için lazım olan: train/test split (%80/%20), Brier skoru (kalibrasyonun ne kadar iyi olduğunu ölçer), reliability diagram, ROC-AUC. Bu olmadan "istatistiksel olarak sağlam" iddian temelsiz.
İki ayrı pipeline (skor motoru + ret riski) tutup "consistency test"le zorla hizalaman, açık bir code smell. Eğer iki model aynı sonucu vermek zorundaysa, zaten tek modeldirler — sadece iki farklı yolla hesaplıyorsun. Bilgi kazanımı yok, sadece bakım maliyeti çift. Ya gerçekten farklı sinyallerden besleniyorlar ve tutarsızlık beklenen bir şey olmalı (ensemble), ya da birini sil. Ortada kalan "tutarlı olmak zorundalar" kontrolü = çifte defter tutuyorsun.
Skoru 0-100 arasında tek sayı olarak sunman sahte hassasiyet. Gerçek dünyada tahmin belirsizliği ±20 puan. "82" diye göstermek, olmayan bir hassasiyet yansıtıyor. Dürüst gösterim: "Yüksek (75-90 aralığı)" + renk bandı + güven notu. Medical imaging ve weather forecasting sektörleri bunu 40 yıldır böyle yapıyor, ML ürünleri yeni öğreniyor.
"Konsolosluk mood multiplier" objektif update pipeline'ı olmadan saf astroloji. Elle giriliyorsa haftada eskir. Bunu silene kadar dürüst olmazsın.
TR_REJECTION_RATES tablon "2026 verisi" diyor — kaynağı? EU Commission aylık statistics yayınlıyor, senin tablon oradan API ile mi çekiyor, yoksa hard-coded mu? Hard-coded ise 6 ay sonra eski. 2024 Türkiye Schengen ret oranı 2023'e göre düşüş gösterdi; 2025-2026 trend farklı olabilir. Canlı pipeline yoksa bu tablo tehlikelidir.
Cascade kuralını (15 Temmuz 2025) modelin özel işliyor mu? İşlemiyorsa 2025 sonrası en büyük Schengen kural değişikliğini kaçırıyorsun. "Son 3 yılda 2 yasal kullanılmış vize" bir threshold değişkeni olmalı ve cascade hakkına sahip başvuranlar için apayrı bir skorlama kolu işletilmeli.
Frontend monolit (6800 satır App.tsx) product-market fit'in önünde engel değil ama iteration hızının en büyük düşmanı olacak. Bunu söylüyorum çünkü senin hızın rekabet avantajın — vizelim'in karşısında 2 kat hızlı iterate edebilmelisin. Monolit bu hızı keser.
İş modeli tarafında: "freemium" diyorsun ama esas değerini (skor) ücretsiz veriyorsun. Bu freemium değil, free-giveaway. Freemium'da ücretsiz tier kullanıcıyı hook'layıp, ücretli tier'a itmelidir. Skor hook ise, skorun detayı / aksiyon / belge paketi paywall arkasında olmalı.
Pozisyonlamada kafa karışıklığı var. "Vize şansı hesaplayıcı" mı, "vize hazırlık asistanı" mı, "red olduysa itiraz aracı" mı? Üçü de var ama hiçbiri baskın değil. Ana sayfada tek cümlede söyle ne sattığını — "Schengen skorunuzu ölçer, düşükse nasıl yükselteceğinizi öğretir" ya da "Ret aldıysanız niçin aldığınızı deşifre eder". İkisinden birini seç, diğerini ikincil tut.
18 araç + versioning + 134 test + 5 katmanlı pipeline — sen mühendislik disiplininde çok iyisin, ama ürün disiplininde 3 kat fazla ürün yapmışsın. En acımasız gözlem: bu ürün 3 aya 5.000 aktif kullanıcıya ulaşamazsa sorun algoritmada değil, ürünün çok kalabalık ve odak eksik olmasında olacak. Algoritmanın karmaşıklığıyla ürününün traction'ı arasında ters orantı var şu anda.


Son not: Vizelim.com pazarda, Alman konsolosluğu 11 ay bekleme süresi açıklıyor, Schengen başvuru sayısı Türkiye'de 1.17 milyonu geçti 2024'te rekor kıran 1.1 milyon Schengen vizesi Türkiye'de verildi. EEAS — pazar devasa, senin en büyük düşmanın başka bir ürün değil, odak kaybı. Bir şeyi sil: ya 13 aracı, ya Katman 4'ü, ya ret risk ikinci pipeline'ını. Üçünü de silersen ürün iki kat hızlı olur, iki kat daha dürüst.