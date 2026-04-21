VizeAkıl'ı dışarıdan okuyan biri olarak söylüyorum: fikir doğru yerde kaşınıyor, ama uygulaman şu an "istatistik gibi görünen kanaat motoru". Aşağıda acımasızca döküyorum.

1. ALGORİTMA: 5 katmanlı skorlama mantığı istatistiksel olarak sağlam değil
Bayes değil, ağırlıklı ortalama. finalA = raw*0.65 + (1-TRrej)*0.35 formülü Bayes teoremi ile alakasız. Gerçek Bayes P(onay|profil) = P(profil|onay)*P(onay)/P(profil) ister. Sen population base rate'i lineer karıştırıyorsun, bu kalibrasyon değil, skorun varyansını suni olarak daraltıyor.
0.65/0.35 tamamen keyfi. Neden 0.65? Validasyon setinde AUC, Brier score ile optimize ettiğine dair kanıt yok. Bu oran her ülke için farklı olmalı, tek sabit tüm modeli çarpıtır.
Çift sayım var. Finansal bölümde "28 günlük sabit bakiye" zaten var, sonra Katman 3'te "öğrenci × Hollanda = 1.08" ile tekrar çarpıyorsun. Aynı sinyal iki kez ağırlık alıyor. Bağlar (ties) hem ham skorda hem getReturnTieMultiplier'da, veto cap'ten sonra tekrar uygulanıyor.
Veto cap mantığı yanlış yerde. "Son dakika mevduat → max 45" gibi sert tavanlar, gradyanı öldürüyor. Konsolosluk böyle keskin eşik kullanmaz, risk artar ama lineer değil. Cap'i en sona koyman, önceki katmanların emeğini çöpe atıyor.
TemporalDecay: halfLifeYears kavramı doğru, ama sen eventYear = 0 için "5 yıl varsayımı, yarı ağırlık" diyorsun. Bu istatistik değil, uydurma. Schengen için overstay etkisi 3 yıl, UK için 10 yıl ban var, half-life ülkeye göre değişir. Tek fonksiyon hepsini bozar.
Konsolosluk kalibrasyonu ("ruh hali çarpanı") en tehlikeli katman. "İstanbul Alman daha sıkı" diye çarpan koymak, n=2077'de İstanbul-Almanya alt kümesi muhtemelen <80 vaka. Bu overfitting, yarın konsolos değişince model çöker. Veri değil dedikodu.
Mevsimsellik ±%8: 2022'de ret oranı %16.5'e çıktı, ama bu yaz-kış değil, siyasi gerilimdi. Mevsimsellik için en az 5 yıl aylık panel gerekir, sende yok.
134 Vitest testi kodu korur, modeli değil. Regresyon testleri "çıktı değişmedi" der, "çıktı doğru" demez. 
Doğrusu: ham özellikleri logistic regression / XGBoost ile eğit, sonra Platt scaling ile 0-100 kalibre et. Ülke ve profil için ayrı model veya etkileşim terimi kullan, çarpanla değil.

2. VERİ: n=2077 yetersiz ve yanlı
8 profil × 20+ ülke × 8 boyut = binlerce hücre. n=2077'de çoğu hücre <5 örnek. Modelin "öğrenci × Hollanda" çarpanı istatistiksel gürültü.
Veri kaynağın anonim geri bildirim → self-selection bias. Ret alanlar daha çok raporlar, onay alanlar sessiz kalır. Base rate'in zaten şişik.
Kaçırdığın kovaryetler:
gelir / seyahat maliyeti oranı (konsolosun ilk baktığı)
işveren büyüklüğü, SGK prim gün devamlılığı
döviz geliri olan freelancer için fatura düzeni
önceki ret kodları (Schengen C kodu, UK 320)
seyahat amacı tutarlılığı (davetiye vs otel)
Türk'e özgü güçlü sinyaller: SGK hizmet dökümünde boşluk, ikamet ili (Anadolu'dan ilk başvuru riski yüksek), sektör riski (tekstil işçisi vs yazılımcı), yeşil pasaport aile bağı.
Ekleme değeri olmayan / yasak bölge: sosyal medya footprint, doğum yeri, etnik köken. KVKK madde 6'da özel nitelikli veri, ayrıca modeline ayrımcılık davası getirir. "Tartışmalı mı" diye sorma, direkt yasak.
3. ÜRÜN: 18 araç = odak kaybı
Kullanıcıya ilk 30 saniyede değer vermen lazım. Sen Hero → Onboarding → Assessment → Dashboard → Tactics → Letter diye 6 adım zorluyorsun. Drop-off %70 olur.
Ayrıştırıcı olanlar: Banka Dökümü Analizi, Kırmızı Bayrak Tarayıcı, Ret Mektubu Analizi, Senaryo Oluşturucu. Bunlar rakiplerde yok.
Gürültü olanlar: Vizesiz Ülkeler Rehberi, Maliyet Hesaplayıcı, 90/180 Hesaplayıcı – bunlar zaten ücretsiz app'ler. Sosyal Medya Denetimi hem etik risk hem de faydasız.
Freemium eşiği yanlış: Skoru ücretsiz verip "18 araç premium" diyorsun. Skor senin tek kancan, onu bedava verirsen ödeme motivasyonu kalmaz. Doğrusu: skor aralığı ücretsiz (ör. "orta risk"), detaylı kırılım ve taktikler ücretli.
6800 satırlık App.tsx tek dosya, bu mimari değil monolit. Lazy loading kurtarmaz, maintainability sıfır. 
4. KULLANIM SENARYOLARI: Unuttuğun edge caseler
Overstay sonrası rehabilitasyon: 3 yıl sonra başvuranın temporalDecay'in yetmez, ban süresi doldu mu kontrolü lazım.
Çifte vatandaşlık / ikinci pasaport: Türk pasaportuyla ret alıp AB pasaportuyla giren profil, modelin ties hesabını bozar.
Mavi kartlı eski Türk vatandaşı, KKTC vatandaşı, Suriyeli iken sonradan vatandaşlık alanlar – SGK geçmişi yok, banka yeni.
Sponsorlu başvuruda sponsorun geliri Türkiye'de değil Almanya'da ise, senin "Türkiye maaş" kuralın çöker.
Yeni doğan bebekle seyahat: bebek için ayrı finansal kanıt istenmez ama senin form bebek için de banka ister.
Freelancer döviz geliri: maaş bordrosu yok, fatura var. Senin "SGK, yıllık izin" alanı boş kalınca skor otomatik düşer.
ABD mülakatında DS-160 ile tutarsızlık: sen belge üretirken tarih formatı TR, form EN – tutarlılık matrisin yakalamaz.
5. RAKİP/ALTERNATİF: Kopyaladığın yer çok
Türkiye içi: Visefy "7/24 yapay zeka vize uzmanı" diye chatbot satıyor, skor yok. Rehberivize doğrudan "yapay zeka ile vize şansı analizi" diyor. Vizeka AI asistan. FlyVisto niyet mektubu üretiyor.
Global: VisaBot randevu botu + 25 ülke desteği, 25.000+ vize iddiası. Visaely Türkiye'den çıkmış, telefon destekli.
GitHub'da EasyVisa XGBoost ile onay tahmini yapıyor, senin n=2077'den daha temiz feature seti var.
Senin farkın: skorlama + kalibrasyon iddiası. Ama rakiplerin yapmadığı "onay yüzdesi" vermek aynı zamanda en büyük yasal riskin. Kimse % skor vermiyor çünkü garanti algısı yaratıyor. 
6. RİSKLER: Üç cephede açıktasın
Yasal – KVKK/GDPR: SGK dökümü, sabıka, banka ekstresi, sosyal medya taraması özel nitelikli veri. localStorage'da tutman açık rıza, şifreleme, veri minimizasyonu ilkelerine aykırı. Sunucuya yüklenen PDF'ler için aydınlatma metni yoksa 1.5 milyon TL ceza riski.
Yanıltıcı beyan: 0-100 "onay skoru" tüketici hukukunda "garanti vaadi" sayılır. 2022'de Türk ret oranı %16.5 iken, Estonya-Finlandiya-Belçika %40 üstü. Kullanıcı 82 alıp ret yerse, "VizeAkıl yanılttı" diye TKHK başvurusu açar.
Etik: Ret riski yüksek profile "max 45" demek, umut satmak yerine umutsuzluk satmak. Özellikle genç, ilk kez başvuran kullanıcıda anksiyete yaratır. Ayrıca AI mektup üretimi – konsolosluklar aynı şablonu görürse "sahte niyet" şüphesi doğar.
Teknik: Rate limiting IP başına 10/60sn, Claude proxy anahtarı sızarsa fatura patlar. Backend ayrı, frontend statik ama CORS allow-list sabit – mobil app ekleyince patlar. 
7. YANLIŞ YAPTIĞIN NE VAR – kibarlık yok
Tek cümle: "Bayes" diye adlandırdığın şey Bayes değil, ve 5 katmanlı çarpanlar yığını istatistik değil kanaat.
Amatörce detaylar: 6800 satırlık App.tsx, localStorage'da hassas veri, "ruh hali çarpanı" gibi dedikodu bazlı kalibrasyon, temporalDecay'de "bilinmiyor = 5 yıl" uydurması, freemium'da en değerli şeyi bedava vermek.
İstersen sıradaki adım: skor motorunu tek bir kalibre logistic modele indir, veto cap'leri kaldır, n=2077'yi feature importance ile buda, ve 18 araçtan 5 tanesine odaklan. Yoksa VizeAkıl, güzel arayüzlü bir fal uygulaması olarak kalır.