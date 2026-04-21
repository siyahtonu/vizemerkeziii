1) ALGORİTMA

Bayes karışımı (0.65 / 0.35)

Bu “Bayes” değil, lineer blend. Posterior türetmiyorsun; iki skoru keyfi ağırlıkla topluyorsun. 0.65/0.35 tamamen heuristik. Kalibrasyon eğrisi (reliability curve) göstermeden bu oran savunulamaz.
trRejectionRate ile zaten bazı sinyalleri ikinci kez sayma riski var (aşağıda).

Çift sayım (double counting)

Ülke bazlı ret oranını (Katman 2) koyup, üstüne profil×ülke matrisi (Katman 3) ve konsolosluk çarpanı (Katman 4) ekliyorsun. Bu üçü aynı varyansı farklı isimlerle tekrar sayıyor olabilir.
Örn. İstanbul’daki Alman konsolosluğunun “sıkılığı” zaten ret oranına yansımış olmalı. Üstüne tekrar çarpan koymak → sistematik bias.

Veto caps

Hard cap (örn. max 45) kalibrasyonu bozar. Model monoton değil; küçük iyileştirmeler skoru hiç oynatmayabilir → kullanıcıyı yanlış yönlendirir.
Bunun yerine “feature interaction” veya non-linear penalty (sigmoid/logit) kullanmalısın. Cap = kaba balta.

TemporalDecay

Half-life yaklaşımı doğru yönde ama uygulaman muhtemelen naive:
Tüm event’lere aynı half-life? Yanlış. Overstay ile “eski Schengen vizesi” aynı hızda çürümez.
eventYear = -1 / 0 gibi sentinel değerler → veri kalitesi maskeleniyor, model öğrenemiyor.
Survival analysis (Cox) veya en azından feature-specific decay gerekli.

Raw score mimarisi

0–100 normalize edilmiş “ham skor” + sonradan çarpanlar → bu bir scorecard, model değil.
Özellikle “güven” (social media, OCR) gibi düşük sinyalli alanlar noise katıyor ama ağırlıkları net değil.

Mevsimsellik

±%8 sabit bant → uydurma. Gerçek seasonal etkiler ülke × yıl × backlog ile değişir. Sabit clamp, yanlış güven verir.

Konsolosluk “ruh hali”

Bu açıkça spekülasyon. Veriyle desteklenmiyorsa modelde yeri yok. Ürünü kırılgan ve hukuki olarak riskli yapıyor.

Sonuç: Bu pipeline “stacked heuristics”. Çalışır gibi görünür ama out-of-sample çökebilir. Gerçek model değil.

2) VERİ

n=2077

Borderline. Özellikle 8 profil × 20 ülke × onlarca feature → sparsity problemi var.
Stratified breakdown yaparsan bazı hücrelerde n<30 kalıyordur → o hücrelerde skorlar gürültü.

Selection bias

Verin muhtemelen self-reported + platform kullanıcıları → başarısız başvurular fazla/az olabilir.
“Feedback loop” ile veri topluyorsun ama ret alan kullanıcı geri dönmeyebilir → survivorship bias.

Eksik kovaryatlar

İş sektörü (kamu vs startup vs kayıt dışı)
Gelir volatility (maaş var ama düzenli mi?)
Banka davranışı (cash vs transfer)
Eğitim seviyesi + okul türü
Daha önceki başvuruların zaman aralığı
Sponsorun profili (kritik ama ayrı model yok)

Tehlikeli sinyaller

Sosyal medya footprint → düşük sinyal, yüksek yanlış pozitif
Etnik köken / doğum yeri → hukuki risk + etik sorun, modelden uzak dur

Asıl eksik:

Ground truth kalitesi. Ret nedenleri çoğu zaman kodlanmış ama gerçek neden ≠ verilen neden.
3) ÜRÜN

18 araç

Evet, fazla. Bu bir “tool soup”.
Kullanıcı problemi: “Vizeyi alabilecek miyim ve ne yapmalıyım?” → 3-4 kritik araç yeterli.

Ayrıştırıcı olanlar

Skorlama + senaryo simülasyonu
Banka dökümü analizi
Ret mektubu analizi
Ülke önerisi

Gürültü

Vizesiz ülkeler rehberi (SEO içeriği)
Sosyal medya denetimi (zayıf sinyal)
Topluluk (erken aşamada boş kalır)

Freemium

Şu an fazla veriyorsun. “Aha moment”ı bedavaya veriyorsun.
Doğru kesim:
Free: skor + 2 kritik insight
Paid: “ne yaparsan skor X olur” simülasyonu + belge üretimi

Onboarding

Çok uzun. Kullanıcı daha değer görmeden veri giriyor.
Progressive disclosure yok → drop-off yüksek olur.
4) EDGE CASE’LER

Bunlar ciddi açık:

Overstay sonrası “rehabilitation path” (kaç yıl sonra normalize?)
Red sonrası re-apply timing modeli
Çifte vatandaşlık (TR + EU pasaport)
İkinci pasaport (Karayipler vb.)
Yeni iş değişimi (çok kritik ama ayrı ele alınmamış)
Freelance + global gelir (Stripe vs)
Aile birleşimi vs turistik başvuru karışımı
Refused but appealed cases
“Visa shopping” (aynı anda çok ülke başvurusu)
5) RAKİP / ALTERNATİF
Globalde bu kadar granular scoring yapan çok az.
Ama:
Danışmanlık firmaları insan + deneyim ile çalışıyor → senin modelin onların sezgisini kopyalamaya çalışıyor.
Bazı immigration SaaS’lar (özellikle ABD tarafında) rule-based eligibility checker yapıyor → sen de aslında buna yakınsın.

Farkın:

Türk pazarı + lokal veri
Ama risk: bu fark kolay kopyalanabilir (model değil, heuristic set).
6) RİSKLER

Hukuki

“Onay skoru” → kullanıcı bunu garanti gibi algılar.
KVKK: banka dökümleri + hassas veri → ciddi yükümlülük.
“Yanıltıcı yönlendirme” iddiası (özellikle ret sonrası)

Teknik

Model drift: konsolosluk davranışı değişir, senin skorlar bayatlar.
Overfitting: küçük veri + çok feature

Etik

Düşük skor → kullanıcıyı gereksiz korkutma
Yüksek skor → aşırı güven → ret → güven kaybı
7) YANLIŞ YAPTIĞIN KRİTİK NOKTALAR
“Bayes” diyorsun ama Bayes yok.
Konsolosluk “ruh hali” gibi ölçülemeyen şeyleri modele sokuyorsun.
Hard cap kullanıyorsun (model değil kural motoru).
Aynı sinyali 3 farklı katmanda tekrar sayıyorsun.
Veri hacmine göre model karmaşıklığın fazla.
Ürün tarafında “fazla özellik = değer” yanılgısı var.
NET SONUÇ

Şu anki sistem:

İyi paketlenmiş bir heuristic scoring engine
Ama henüz istatistiksel olarak güvenilir bir karar modeli değil

Bunu düzeltmek istiyorsan:

Tek model (logistic / gradient boosting) + proper calibration
Feature importance + SHAP ile açıklanabilirlik
Hard rule’ları minimize et
Veri kalitesini artır, feature sayısını azalt