Bayes Karışım Oranı (0.65/0.35) İstatistiksel Dayanaktan Yoksun. Bu oran subjektif bir ağırlıklandırmadır, herhangi bir log-odds regresyonundan veya kalibrasyon eğrisinden türetilmemiştir. TR_REJECTION_RATES verisi ile Ham Skor aynı olguyu ölçmeye çalışır (ret olasılığı). Bayes güncellemesi yapmak için prior (ülke ret oranı) ve likelihood (profil skoru) kullanılır. Burada yapılan şey güncelleme değil, lineer interpolasyondur. Sonuç: Skor 100 olan birinin ret oranı %30 olan ülkede final skoru 0.65*1 + 0.35*0.7 = 0.895. Bu doğrusal bir skaladır, olasılık değildir. Üstelik rawScore 45'te cap'lenmiş bir profil, bu karışımda hala 0.65*0.45 + 0.35*0.7 = 0.537 alır. Oysa veto'lu bir profilin onay şansı pratikte %5'in altındadır. Çift Sayım Riski: Katman 1'de (Finansal) zaten banka düzeni ve bakiye var. Katman 2'de ülke genel ret oranı ekleniyor. Katman 3'te profil × ülke matrisi tekrar ülke bazlı düzeltme yapıyor. Katman 4 (Konsolosluk) ve Katman 5 (Mevsimsellik) toplam varyansın %10'undan fazlasını açıklamazken modele eklenmesi aşırı uyum (overfitting) göstergesidir. Özellikle "İstanbul Alman Konsolosluğu ruh hali" gibi değişkenler regresyon testi yapılmadıkça gürültüden ibarettir.

Veto Cap Mantığı Yanlış Yerde ve Eksik. Skoru 45 ile kırpmak, kullanıcıya "orta riskli" izlenimi verir. Oysa overstay geçmişi olan bir Türk vatandaşı için Schengen onayı neredeyse imkansızdır. Bu durumda skor 0-5 bandında olmalı, 45 değil. 45 değeri, kullanıcıyı yanlış yönlendirir ("belki olur"). Ayrıca veto cap'ler sadece skoru değil, ret riskini de tetiklemeli. Ret Riski Algoritması n=2077 veriyle çalışıyor demişsiniz ama veto durumları bu veri setinde yeterince temsil ediliyor mu? Overstay geçmişi olan kaç vaka var?

TemporalDecay Lineer Olmayan Riski Göz Ardı Ediyor. Overstay gibi olaylarda yarılanma ömrü (halfLife) yaklaşımı yanlıştır. 10 yıl önce 1 gün overstay yapan birisi ile 2 yıl önce 90 gün overstay yapan birisi aynı kefede değildir. Schengen sisteminde SIS (Schengen Information System) kaydı 3-5 yıl sürer. Kayıt silinene kadar risk %99'dur, silindikten sonra aniden düşer. TemporalDecay bu sert eşik gerçeğini yumuşatıp "azaldı" yanılsaması verir.

Konsolosluk Kalibrasyonu ve Mevsimsellik. Bu katmanların varlığı, temel skorun güvenilirliğini zedeler. Kullanıcı aynı profile İstanbul'da 65 alırken Ankara'da 72 alıyorsa, algoritma keyfi görünür. Elinizde bunu destekleyecek resmi ret oranı verisi yoksa (ki konsolosluklar bunu yayınlamaz), bu sadece anekdotal tahmindir ve ürünü amatörleştirir.

2. VERİ
n=2077 Tamamen Yetersiz. Bu sayı 8 profil tipi × 20 ülke matrisini doldurmaya yetmez. Her hücre için ortalama 13 vaka düşer. Alt kırılımlarda (örn. İşveren × İsveç) veri sıfır olacaktır. Bu veri setiyle yapılan herhangi bir regresyon aşırı öğrenme (overfitting) yapacaktır. Pratikte bu veri seti sadece "genel fikir" vermeye yarar, hassas skor üretmeye değil.

Gözden Kaçan Kovariyetler (Türkiye Özel):

İş Sektörü: Kamu çalışanı (öğretmen, memur) vs. özel sektör (özellikle turizm/inşaat) arasında vize onayında ciddi fark vardır. Kamu çalışanı "kaçma riski düşük" algılanır. Algoritmada "Meslek" başlığı altında SGK var ama sektör ayrımı yok.
Bölgesel / İl Bazlı Sapma: Bazı iller (örneğin Doğu/Güneydoğu Anadolu'daki belirli iller) konsolosluklar tarafından istatistiki olarak daha riskli görülür. Doğum yeri veya ikametgah ili bu bias'ı yansıtır. KVKK ve etik açıdan bunu kullanmak sakıncalıdır ama yok saymak da modeli eksik bırakır. Bunu bilinçli olarak mı dahil etmediniz?
Geçmiş Vize Reddi Detayı: Sadece "ret var/yok" değil, ret kodu (örn. Schengen'de "Madde 2, 6, 15") kritiktir. Madde 2 (Seyahat amacı belirsiz) ile Madde 15 (Geri dönme niyeti yok) arasında dağlar kadar fark vardır. Algoritma ret kodunu dikkate almıyor (Ret Mektubu Analizi ayrı bir araç, skora entegre değil).
Pasaport Rengi ve Geçerlilik Süresi: Pasaport süresi 6 aydan az olan başvurular direkt elenir. Algoritma bunu bir "kırmızı bayrak" olarak işaretliyor mu? Yoksa sadece skor mu düşürüyor? (Skor düşürmek yetmez, uygulama "BAŞVURMAYIN" demeli).
Ampirik Verinin Niteliği: "Anonim Türk vizesi vakası" ifadesi belirsiz. Bu veriler:

Hangi yıllara ait? (2021-2026 denmiş ama pandemi sonrası 2023-2026 verisi farklıdır).

Ret kararları mı, yoksa başvuru sahibi beyanı mı? (İkincisi güvenilmezdir).

Veri setinde Suriye/Irak doğumlu Türk vatandaşları ayrıştırılmış mı? Bu grup için ret oranları genel ortalamanın çok üzerindedir.

3. ÜRÜN
18 Araç Fazla Değil, Dağınık. Bazı araçlar işe yaramaz, bazıları birleştirilmeli.

İşe Yaramaz: Vizesiz Ülkeler Rehberi (MFA sitesinde zaten var, SEO için konmuş gibi), Maliyet Hesaplayıcı (vize ücreti sabit, uçak/otel dinamik - bu bir seyahat uygulamasının işi, vize danışmanının değil).

Birleştirilmeli: Evrak Listesi + Belge Kontrol aynı şey. Banka Hazırlık Planı + Banka Dökümü Analizi tek bir "Finansal Danışman" modülü olmalı.

Eksik Araç: Seyahat Sigortası Karşılaştırma ve Onay Kontrolü. En sık yapılan hatalardan biri limiti düşük veya Schengen onaylı olmayan sigorta almaktır.

Freemium Eşik Yanlış. "Skor ve temel içgörüler ücretsiz" demek, kullanıcıya bedava umut veya bedava moral bozukluğu satmaktır. Kullanıcı skoru 35 gördüğü anda uygulamayı kapatır, premium almaz. Çünkü "zaten ret yiyeceğim" der. Öneri: Skoru gösterme. Ücretsiz kısımda sadece "Eksik Evraklar" ve "Kritik Hatalar (Kırmızı Bayraklar)" gösterilsin. Skor, sadece Premium Raporun içinde yer alsın. Aksi takdirde freemium dönüşüm oranı %1'in altında kalır.

Onboarding Akışı Karışık ve Sıkıcı. Hero → Onboarding → Assessment detaylı form. Kullanıcı daha skoru görmeden 15 dakika form doldurmak zorunda. Bu bounce rate'i patlatır. Öneri: Önce sadece Ülke, Yaş, Meslek, Aylık Gelir sor. 10 saniyede bir "ön skor" ver. Ardından "Daha isabetli skor için detayları doldur" de.

4. KULLANIM SENARYOLARI (UNUTULAN EDGE CASE'LER)
Çifte Vatandaşlık (Mavi Kart Hariç): Kullanıcı hem Türk hem de KKTC vatandaşı. KKTC pasaportu Schengen'de işe yaramaz. Algoritma bunu bilmiyor.

Mavi Kartlılar: Eski Türk vatandaşı olup Mavi Kartla seyahat edenler. Bu kişiler Türk vatandaşı değildir ve vize muafiyetleri farklıdır. Uygulama bu grubu hedef kitlesi dışında bırakmalı, yoksa yanlış yönlendirir.

Sponsorlu Başvuruda Sponsorun Profili: "Sponsorlu" profil tipi var. Peki sponsor kim? AB vatandaşı akraba mı, Türkiye'deki şirket mi? AB vatandaşı akraba varsa (Aile Birleşimi veya Ziyaret) skorun uçması gerekir. Algoritma "Sponsorlu" seçeneğini sadece Türkiye'deki bir işveren gibi mi değerlendiriyor? Yoksa AB vatandaşı faktörünü ayrıca puanlıyor mu?

Yeni Mezun / Askerlik Durumu: 22-28 yaş arası erkek, işsiz veya yeni işe başlamış. Askerlik durumu belirsiz (tecil var mı, yok mu?). Konsolosluklar için bu profil "kaçma ve iltica etme" riski en yüksek gruptur. Algoritma "askerlik durumu" değişkenini içermiyor.

Yeşil Pasaport (Hususi) Sahipleri: Bu kişiler Schengen vizesine tabi değildir. Uygulamaya girip skor sorsalar ne olacak? Uygulama "Vizeye ihtiyacın yok" demeli. Bu akış var mı?

Geçmiş Retlerin TemporalDecay'i Yanlış Uygulanmış: Ret kararı idari bir işlemdir. 5 yıl önceki ret, bugünkü başvuruda "daha önce ret yemiş" olarak kayıtlarda durur. Etkisi yarılanmaz, sabit bir eksi puandır. Sadece ret nedenini düzelttiyseniz etkisi azalır.

5. RAKİP / ALTERNATİF
Doğrudan Rakip Yok, Bu Bir Sorun. Piyasada bu işi otomatik yapan kimse yok. Bu, iş modelinin doğrulandığı anlamına gelmez; pazarın olmadığı anlamına gelebilir. İnsanlar vize işini ya kendileri halleder (bedava), ya da acenteye/danışmana güvenir (insan faktörü). 18-25 yaş arası "ben hallederim" diyen kitle için fiyat hassasiyeti yüksektir, premium almazlar. 35+ yaş çalışan kesim ise "uğraşamam, danışmana veririm" der.

Dolaylı Rakipler (Tehditler):

VFS Global / iDATA Bot'ları: Telegram'da 50 TL'ye randevu habercisi satan botlar. Sizin "Randevu Takip Botu"nuzun en büyük rakibi bunlar. Ücretsiz versiyonları bile var.
Reddit / Facebook Grupları (Topluluk & Benchmark): Sizin "Topluluk" aracınızın rakibi r/SchengenVisa veya Facebook'taki "Vize Mağdurları" grubudur. Orada anonim ve anlık feedback var. Sizin n=2077 veriniz, bu grupların günlük post sayısından azdır.
E-Devlet ve Banka Entegrasyonları: Bankalar (Akbank, İş Bankası) vize başvurusu için otomatik dekont ve yazı hazırlıyor. Sizin "Banka Hazırlık Planı"nızın karşısında bankanın kendi şubesi bedava hizmet veriyor.
Farkınız Zayıf: Tek farkınız "Skor". Ancak skorun güvenilirliği kanıtlanmamış. Kullanıcı "VizeAkıl 75 dedi ama ret yedim" derse, itibarınız bir haftada biter. Rakipler (Danışmanlar) ret yediklerinde "Konsolosluk keyfi" der geçer, siz algoritmayı savunmak zorunda kalırsınız.

6. RİSKLER
Yasal Risk (En Büyük Tehlike):

Yanıltıcı Ticari Uygulama: Uygulama "%87 onay şansı" veya "Skorunuz 85" dediğinde, bu bir hukuki taahhüt olarak yorumlanabilir. Ret alan kullanıcı, uçak bileti ve otel parasını sizden talep edebilir. Kullanım koşullarında "Bu bir tahmindir, garanti değildir" yazması mahkemede sizi kurtarmaz (özellikle ABD'deki FTC benzeri kurallar veya Türk Ticaret Kanunu madde 55/1-a kapsamında).
KVKK İhlali (Banka Ekstresi Yükleme): Kullanıcıya "Banka dökümünü yükle" dediğiniz an, Özel Nitelikli Kişisel Veri işlemiş olursunuz. Bu veriyi saklamasanız bile geçici olarak sunucuya almanız VERBİS kaydı ve açık rıza gerektirir. Sadece OCR yapıp silmek yeterli değildir. Bu verinin Claude API'sine gönderilmesi (Anthropic sunucuları ABD'de) yurt dışına veri aktarımı suçunu oluşturur. Bu, uygulamanın kapatılma sebebidir.
Sosyal Medya Denetimi: Kullanıcının hesabını taramak (scraping) platformların (Instagram, Twitter) ToS'una aykırıdır. Hesabınız askıya alınır. Ayrıca "vize-riskli paylaşım tarayıcı" ifadesi fişleme çağrışımı yapar, etik açıdan çok tehlikelidir.
Teknik Risk:

Claude Sonnet 4.6 Halüsinasyonu: AI "Kırmızı Bayrak" ararken var olmayan bir tutarsızlık üretebilir. Ya da ret mektubunu yanlış yorumlayıp kullanıcıya "Tekrar başvur, kesin alırsın" diyebilir. Bu, insan hatasından daha maliyetli bir hatadır.
Node-cron ile Randevu Takibi: VFS siteleri bot koruması (Cloudflare, DataDome) kullanır. 1 IP'den 1 hafta boyunca cron çalıştırmak IP ban ile sonuçlanır. Bu hizmeti veremezsiniz.
Etik Risk:

Umutsuzluğu Metalaştırmak: Düşük skorlu birine "Üzgünüz, şansın düşük" demek psikolojik olarak yıkıcıdır. Özellikle aile birleşimi için başvuran birine bunu söylemek sorumsuzluktur.

Veri Seti Bias'ı: n=2077 verisi muhtemelen internetten toplama veya anket verisidir. Bu veri setinde üst gelir grubu az temsil edilir (çünkü onlar danışmana gider). Dolayısıyla modeliniz fakir profillere gerçekte olduğundan daha yüksek ret riski biçecektir. Bu da ekonomik ayrımcılığa algoritmik zemin hazırlar.

7. YANLIŞ YAPTIĞINIZ ŞEYLER (FİLTRE YOK)
"Ret Riski Algoritması Skorlama Motorundan Tamamen Ayrı" cümleniz epistemolojik olarak yanlış. İkisi de aynı şeyi (vize sonucunu) tahmin ediyorsa ve aynı girdileri kullanıyorsa, aynı sonucu vermek zorundadır. "Consistency test" yapıyor olmanız, modelinizin gereksiz yere karmaşık olduğunu kanıtlar. Tek bir model (örn. XGBoost) hem skor hem risk üretsin. İki pipeline'ı aynı anda güncellemek bakım maliyetini ikiye katlar.

"Konsolosluk Ruh Hali Çarpanı" ifadesi profesyonellikten uzak, amatörce bir jargon. Yatırımcıya veya hukukçuya bunu açıklayamazsınız.

"18 Analiz Aracı" içinde "Ret Mektubu Analizi" var. Kullanıcı ret yemişse neden sizin uygulamanızı kullanmaya devam etsin? Bu araç, yeni müşteri getirmez. Sadece zarar azaltma (damage control) aracıdır. Ürünü ilk kez kullanan biri için bu aracın varlığı anlamsızdır.

"İşveren Belgesi Üretimi" (PDF). Konsoloslukların kabul ettiği işveren yazıları antetli kağıt, ıslak imza ve kaşe gerektirir. Sizin ürettiğiniz PDF'i kullanıcı gidip patronuna imzalatacak. Bu aracın katma değeri sıfıra yakındır. Kullanıcıya "İşte taslak, Word'e yapıştır" deseniz daha hızlıdır.

"SEO için react-helmet-async" demişsiniz. Bu bir SPA. Google botu JavaScript'i kısmen render eder. Vize rehberi içeriğiniz yoksa (blog yazıları, SSS), sırf helmet ile SEO yapamazsınız. Site site:vizeakil.com sorgusunda muhtemelen sadece ana sayfa indexlidir.

En Büyük Kör Nokta: Başvuru Formu Doldurma Entegrasyonu. Kullanıcı 15 dk form dolduruyor, skor alıyor. Sonra aynı bilgileri gidip VFS veya Konsolosluk sitesinde tekrar doldurmak zorunda. Uygulamanız iş yükünü azaltmıyor, artırıyor. Eğer kullanıcının girdiği verilerle otomatik olarak Schengen başvuru formunu (Application Form) PDF olarak doldurup vermiyorsanız, ürün bir oyuncak olarak kalır. Asıl değer teklifi budur: "Verilerini bir kere gir, tüm ülkelerin formlarını biz dolduralım." Bunu yapmamış olmanız büyük eksiklik.