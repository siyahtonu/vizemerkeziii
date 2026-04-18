// ============================================================
// Ülke Veritabanı
// App.tsx'ten modüler yapıya taşındı
// ============================================================

// ============================================================
// ÖZELLİK 7 (YENİ): VİZESİZ ÜLKELER BULUCU
// ============================================================
export interface VisaFreeCountry {
  name: string;
  flag: string;
  region: string;
  entryType: 'Vizesiz' | 'e-Vize' | 'Kapıda Vize';
  maxDays: number;
  flightHours: number;
  avgCostEur: number;
  scoreBoost: number;
  stampValue: 'Yüksek' | 'Orta' | 'Düşük';
  tip: string;
}

export const visaFreeCountries: VisaFreeCountry[] = [
  { name: 'Sırbistan', flag: '🇷🇸', region: 'Balkanlar', entryType: 'Vizesiz', maxDays: 30, flightHours: 1.5, avgCostEur: 150, scoreBoost: 6, stampValue: 'Yüksek', tip: 'En stratejik başlangıç ülkesi. Belgrad vizesini görürsünüz.' },
  { name: 'Karadağ', flag: '🇲🇪', region: 'Balkanlar', entryType: 'Vizesiz', maxDays: 30, flightHours: 1.5, avgCostEur: 180, scoreBoost: 5, stampValue: 'Yüksek', tip: 'Sırbistan ile kombine gezi: 2 ülke 1 hafta.' },
  { name: 'Makedonya', flag: '🇲🇰', region: 'Balkanlar', entryType: 'Vizesiz', maxDays: 90, flightHours: 1, avgCostEur: 120, scoreBoost: 5, stampValue: 'Yüksek', tip: 'Üsküp güzel bir şehir. AB aday ülkesi — damga değerli.' },
  { name: 'Arnavutluk', flag: '🇦🇱', region: 'Balkanlar', entryType: 'Vizesiz', maxDays: 90, flightHours: 1.5, avgCostEur: 100, scoreBoost: 4, stampValue: 'Orta', tip: 'Çok ucuz. Bütçe kısıtlıysa ideal.' },
  { name: 'Bosna Hersek', flag: '🇧🇦', region: 'Balkanlar', entryType: 'Vizesiz', maxDays: 30, flightHours: 1.5, avgCostEur: 130, scoreBoost: 4, stampValue: 'Orta', tip: 'Saraybosna kültürel açıdan çok zengin.' },
  { name: 'Georgia', flag: '🇬🇪', region: 'Kafkasya', entryType: 'Vizesiz', maxDays: 365, flightHours: 2.5, avgCostEur: 200, scoreBoost: 5, stampValue: 'Yüksek', tip: '1 yıl kalabilirsin. Uzun giriş-çıkış geçmişi oluşturur.' },
  { name: 'Azerbaycan', flag: '🇦🇿', region: 'Kafkasya', entryType: 'e-Vize', maxDays: 30, flightHours: 2, avgCostEur: 160, scoreBoost: 3, stampValue: 'Orta', tip: 'E-Vize 30$ — kolay alınıyor.' },
  { name: 'Japonya', flag: '🇯🇵', region: 'Asya', entryType: 'Vizesiz', maxDays: 90, flightHours: 12, avgCostEur: 1200, scoreBoost: 10, stampValue: 'Yüksek', tip: 'Japonya damgası Schengen/UK başvurularında çok güçlü referans.' },
  { name: 'Singapur', flag: '🇸🇬', region: 'Asya', entryType: 'Vizesiz', maxDays: 30, flightHours: 11, avgCostEur: 900, scoreBoost: 9, stampValue: 'Yüksek', tip: 'Gelişmiş ülke damgası — vize geçmişi için ideal.' },
  { name: 'Hong Kong', flag: '🇭🇰', region: 'Asya', entryType: 'Vizesiz', maxDays: 14, flightHours: 11, avgCostEur: 800, scoreBoost: 8, stampValue: 'Yüksek', tip: 'İstanbul\'dan direkt uçuş var.' },
  { name: 'Güney Kore', flag: '🇰🇷', region: 'Asya', entryType: 'Vizesiz', maxDays: 90, flightHours: 11, avgCostEur: 950, scoreBoost: 9, stampValue: 'Yüksek', tip: '90 gün vizesiz. K-ETA gerekli (ücretsiz).' },
  { name: 'Ukrayna', flag: '🇺🇦', region: 'Doğu Avrupa', entryType: 'Vizesiz', maxDays: 90, flightHours: 1.5, avgCostEur: 120, scoreBoost: 3, stampValue: 'Düşük', tip: 'Şu an güvenli değil — tavsiye edilmez.' },
  { name: 'Tunus', flag: '🇹🇳', region: 'Afrika', entryType: 'Vizesiz', maxDays: 90, flightHours: 2.5, avgCostEur: 350, scoreBoost: 2, stampValue: 'Düşük', tip: 'Ucuz tatil ama vize geçmişine katkısı az.' },
  { name: 'Maldivler', flag: '🇲🇻', region: 'Hint Okyanusu', entryType: 'Kapıda Vize', maxDays: 30, flightHours: 8, avgCostEur: 1500, scoreBoost: 4, stampValue: 'Orta', tip: 'Lüks tatil + pasaport damgası.' },
  { name: 'Tayland', flag: '🇹🇭', region: 'Asya', entryType: 'Vizesiz', maxDays: 30, flightHours: 10, avgCostEur: 700, scoreBoost: 5, stampValue: 'Orta', tip: 'Bangkok + Phuket popüler. Makul maliyetli.' },
];

/**
 * Ziyaret edilen vizesiz ülkelerden algoritma ham skoruna eklenecek bonus.
 * Maksimum scoreBoost değerine bakar — toplam değil (abuse önler).
 *   ≥ 8  (Japonya, Singapur, Hong Kong, Güney Kore) → +2
 *   5–7  (Sırbistan, Georgia, Tayland, Karadağ vs.) → +1
 *   < 5                                              →  0
 */
export function getVisaFreeBonus(visitedNames: string[] | undefined): number {
  if (!visitedNames || visitedNames.length === 0) return 0;
  let maxBoost = 0;
  for (const name of visitedNames) {
    const entry = visaFreeCountries.find(c => c.name === name);
    if (entry && entry.scoreBoost > maxBoost) maxBoost = entry.scoreBoost;
  }
  if (maxBoost >= 8) return 2;
  if (maxBoost >= 5) return 1;
  return 0;
}

// Banka Analizi Yapılandırılmış Sonuç
export interface BankAnalysisResult {
  fileName: string;
  country: string;
  score: number;
  grade: string;
  gradeEmoji: string;
  positives: string[];
  negatives: string[];
  tips: string[];
  summary: string;
}

// ============================================================
// ÖZELLİK 7: SCHENGEN ÜLKE KARŞILAŞTIRICI VERİ TABANI
// Kaynak: 2024-2025-2026 Schengen istatistikleri — Türk başvurucular
// AB Vize İstatistikleri Raporu + IKV + SchengenVisaInfo + Atlys
// SIRALAMA: En fazla vize veren (en düşük ret) → en az veren (en yüksek ret)
// ============================================================
export interface SchengenCountry {
  name: string;
  flag: string;
  rejectionRate: number;       // Türk başvurucular için ret oranı % (2024-2025)
  approvalRate: number;        // Onay oranı %
  totalApps2024: number;       // 2024 Türk başvuru sayısı (tahmini)
  avgProcessDays: number;
  dailyBudgetReq: number;
  difficulty: 'Kolay' | 'Orta' | 'Zor' | 'Çok Zor';
  difficultyColor: string;
  trend: 'İyileşiyor' | 'Stabil' | 'Kötüleşiyor';
  strengths: string[];
  warnings: string[];
  tip: string;
  consulate: string;
  update2026: string;          // 2026 güncelleme notu
}

export const schengenCountries: SchengenCountry[] = [
  // ═══ KOLAY — En yüksek onay oranları ═══
  {
    name: "Romanya", flag: "🇷🇴", rejectionRate: 4.4, approvalRate: 95.6,
    totalApps2024: 28000, avgProcessDays: 8, dailyBudgetReq: 50,
    difficulty: "Kolay", difficultyColor: "emerald", trend: "İyileşiyor",
    strengths: ["En yüksek onay oranı (%95.6)", "Hızlı işlem (8 gün)", "En düşük finansal baskı", "Türklere karşı pozitif tutum"],
    warnings: ["Ülke kısıtlaması: çoğu zaman sadece Romanya için geçerli", "Tüm Schengen'de kullanamayabilirsiniz"],
    tip: "Romanya; Schengen geçmişi olmayanlar için en güvenli ilk adım. Onay aldıktan sonra seyahat geçmişi oluşturulabilir.",
    consulate: "Ankara / İstanbul",
    update2026: "Romanya 2024'te Schengen'e tam üye oldu — artık tüm Schengen bölgesinde geçerli."
  },
  {
    name: "Slovakya", flag: "🇸🇰", rejectionRate: 6.7, approvalRate: 93.3,
    totalApps2024: 12000, avgProcessDays: 10, dailyBudgetReq: 60,
    difficulty: "Kolay", difficultyColor: "emerald", trend: "Stabil",
    strengths: ["2. en yüksek onay oranı (%93.3)", "Az başvuru — hızlı randevu", "Esnek finansal değerlendirme"],
    warnings: ["Turistik gerekçe net olmalı", "Bratislava dışı seyahat planı ekleyin"],
    tip: "Slovakya; stratejik ilk başvuru için ideal. Geçmiş olmayan profillere genellikle pozitif yaklaşıyor.",
    consulate: "Ankara",
    update2026: "2026 politikası değişmedi. Önceki Schengen geçmişi olanlara çoklu giriş imkânı."
  },
  {
    name: "Portekiz", flag: "🇵🇹", rejectionRate: 8.7, approvalRate: 91.3,
    totalApps2024: 18000, avgProcessDays: 12, dailyBudgetReq: 70,
    difficulty: "Kolay", difficultyColor: "emerald", trend: "İyileşiyor",
    strengths: ["%91.3 onay oranı", "Turizm ülkesi — güçlü motivasyon", "Lizbon/Porto çekici destinasyonlar"],
    warnings: ["Sahte rezervasyon Portekiz'de de tespit ediliyor", "Sigorta €30.000 şart"],
    tip: "Portekiz, İspanya ile aynı konsolosluktan işlem yapılabilir. Kombine gezi planı avantaj sağlar.",
    consulate: "İstanbul / Ankara",
    update2026: "Turizm artışı nedeniyle 2026'da randevu süreleri 2-3 hafta uzadı."
  },
  {
    name: "Malta", flag: "🇲🇹", rejectionRate: 9.2, approvalRate: 90.8,
    totalApps2024: 8000, avgProcessDays: 10, dailyBudgetReq: 80,
    difficulty: "Kolay", difficultyColor: "emerald", trend: "Stabil",
    strengths: ["%90.8 onay oranı", "Ada turizmi — güçlü gerekçe", "İngilizce dil okulu + turizm avantajı"],
    warnings: ["Ada ülkesi — çıkış-giriş kontrolü sıkı", "Çalışma şüphesi riski var"],
    tip: "Malta için dil kursu + turizm kombini mükemmel. İngilizce kurs kaydı başvuruyu güçlendirir.",
    consulate: "Ankara",
    update2026: "Malta 2026'da dijital başvuruya geçiyor — VFS üzerinden online."
  },
  {
    name: "İtalya", flag: "🇮🇹", rejectionRate: 11.3, approvalRate: 88.7,
    totalApps2024: 95000, avgProcessDays: 15, dailyBudgetReq: 80,
    difficulty: "Kolay", difficultyColor: "emerald", trend: "Stabil",
    strengths: ["%88.7 onay oranı", "Yüksek hacim — deneyimli konsolosluk", "Turizm gerekçesi çok güçlü"],
    warnings: ["Roma/Milano'da sahte rezervasyon sistematik tespit ediliyor", "Tatil sezonunda ek inceleme"],
    tip: "İtalya; Schengen'e ilk adım için en popüler güvenli seçim. Yüksek hacim sayesinde süreç standartlaştı.",
    consulate: "İstanbul / Ankara / İzmir",
    update2026: "VFS Global altyapısı güncellendi. Randevu online — biyometrik zorunlu."
  },
  {
    name: "Slovenya", flag: "🇸🇮", rejectionRate: 12.1, approvalRate: 87.9,
    totalApps2024: 6000, avgProcessDays: 12, dailyBudgetReq: 70,
    difficulty: "Kolay", difficultyColor: "emerald", trend: "Stabil",
    strengths: ["Düşük ret oranı (%12.1)", "Az kalabalık — hızlı randevu", "Güzel doğa destinasyonu"],
    warnings: ["Bled/Ljubljana dışı plan zayıf görülebilir", "Güçlü geri dönüş kanıtı şart"],
    tip: "Slovenya, Hırvatistan ve Avusturya ile kombine planlayın. Güçlü çok ülke itinerary oluşturun.",
    consulate: "Ankara",
    update2026: "Slovenya Schengen kotasını artırdı. 2026'da daha fazla Türk başvurucuya olumlu."
  },
  {
    name: "Yunanistan", flag: "🇬🇷", rejectionRate: 13.0, approvalRate: 87.0,
    totalApps2024: 296377, avgProcessDays: 12, dailyBudgetReq: 80,
    difficulty: "Kolay", difficultyColor: "emerald", trend: "İyileşiyor",
    strengths: ["En yüksek Türk başvurusu (296.377 — 1. sıra)", "Turizm ekonomisi — çok çekici", "Ada + kıta seçenekleri"],
    warnings: ["Yüksek hacimde sahte rezervasyon tespit sistemi aktif", "Yaz aylarında randevu 4-6 hafta öne alın"],
    tip: "Yunanistan en çok tercih edilen hedef. Erken başvuru, gerçek otel + dönüş bileti ile yüksek başarı.",
    consulate: "İstanbul / Ankara / İzmir",
    update2026: "Yunanistan 2026'da 5 yıllık çoklu giriş vizesini pozitif geçmişlilere uyguluyor."
  },
  {
    name: "İspanya", flag: "🇪🇸", rejectionRate: 14.2, approvalRate: 85.8,
    totalApps2024: 72000, avgProcessDays: 15, dailyBudgetReq: 90,
    difficulty: "Orta", difficultyColor: "amber", trend: "Stabil",
    strengths: ["%85.8 onay oranı", "Turizm motivasyonu çok güçlü", "Barselona/Madrid çekiciliği"],
    warnings: ["UGE-CE sahte rezervasyon sistemi aktif — gizlenmiş ret = kalıcı ban", "Sigorta eksikliği direkt ret"],
    tip: "İspanya'da yalnızca gerçek rezervasyonla başvurun. Sahte tespit oranı Schengen'in en yükseği.",
    consulate: "İstanbul / Ankara",
    update2026: "İspanya 2026'da Schengen kotasını genişletti. Turizm sezonunda başvurular artıyor."
  },
  {
    name: "Çek Cumhuriyeti", flag: "🇨🇿", rejectionRate: 15.8, approvalRate: 84.2,
    totalApps2024: 22000, avgProcessDays: 14, dailyBudgetReq: 75,
    difficulty: "Orta", difficultyColor: "amber", trend: "Stabil",
    strengths: ["Orta ret oranı (%15.8)", "Prag turizm motivasyonu güçlü", "Hızlı işlem"],
    warnings: ["Orta Avrupa kışı için turizm gerekçesi zayıf", "Güçlü iş/ticaret bağlantısı avantaj"],
    tip: "Çek Cumhuriyeti için Avrupa merkezi konumu — çok ülke gezi planıyla başvurun.",
    consulate: "Ankara",
    update2026: "Çek Cumhuriyeti Schengen kotasını artırmadı, yoğunluk hafifçe arttı."
  },
  {
    name: "Avusturya", flag: "🇦🇹", rejectionRate: 16.4, approvalRate: 83.6,
    totalApps2024: 35000, avgProcessDays: 18, dailyBudgetReq: 90,
    difficulty: "Orta", difficultyColor: "amber", trend: "Stabil",
    strengths: ["Kültür/müzik motivasyonu güçlü", "Viyana çekici destinasyon", "İş amacı iyi değerlendiriliyor"],
    warnings: ["Finansal süreklilik önemli", "Tatil sezonunda ek inceleme"],
    tip: "Avusturya için kültür programı (opera, müze, festival) başvuruyu güçlendirir.",
    consulate: "İstanbul / Ankara",
    update2026: "Avusturya 2026'da biyometrik zorunluluğunu sıkılaştırdı."
  },
  {
    name: "İsviçre", flag: "🇨🇭", rejectionRate: 17.1, approvalRate: 82.9,
    totalApps2024: 28000, avgProcessDays: 20, dailyBudgetReq: 130,
    difficulty: "Orta", difficultyColor: "amber", trend: "Stabil",
    strengths: ["İş/kongre amacı çok iyi karşılanır", "Finans sektörü bağlantısı avantajlı"],
    warnings: ["En yüksek günlük bütçe (€130) şart", "Sadece turistik gerekçe zayıf görülebilir"],
    tip: "İsviçre için güçlü finansal profil şart. Günlük €130+ bütçe gösteremeyen başvurmamalı.",
    consulate: "Ankara",
    update2026: "İsviçre Schengen politikasına uyum sağlayarak 2026'da çoklu vize uygulamasına geçti."
  },
  {
    name: "Macaristan", flag: "🇭🇺", rejectionRate: 17.9, approvalRate: 82.1,
    totalApps2024: 19000, avgProcessDays: 14, dailyBudgetReq: 65,
    difficulty: "Orta", difficultyColor: "amber", trend: "İyileşiyor",
    strengths: ["Nispeten düşük ret oranı", "Budapeşte turizm motivasyonu güçlü", "Düşük bütçe gereksinimi"],
    warnings: ["Son yıllarda yabancı politikasında sertleşme eğilimi"],
    tip: "Macaristan; bütçe kısıtlıysa iyi alternatif. Budapeşte + Viyana kombine planı tercih edilir.",
    consulate: "Ankara",
    update2026: "Macaristan 2026'da Türk turistlere özel hızlı işlem pilot uygulaması başlattı."
  },
  {
    name: "Polonya", flag: "🇵🇱", rejectionRate: 18.5, approvalRate: 81.5,
    totalApps2024: 25000, avgProcessDays: 15, dailyBudgetReq: 65,
    difficulty: "Orta", difficultyColor: "amber", trend: "Stabil",
    strengths: ["Uygun ret oranı (%18.5)", "Varşova/Krakow turizm", "Ekonomik ülke — bütçe gereksinimi düşük"],
    warnings: ["Doğu Avrupa ülkesi — bazı konsolosluklar katı"],
    tip: "Polonya için iş amacı veya kültür/tarih gerekçesi güçlü. Varşova Avrupa merkezi konumu avantaj.",
    consulate: "Ankara / İstanbul",
    update2026: "Polonya 2025'te başvuru kapasitesini artırdı. Randevu süreleri kısaldı."
  },
  {
    name: "Fransa", flag: "🇫🇷", rejectionRate: 18.9, approvalRate: 81.1,
    totalApps2024: 151640, avgProcessDays: 20, dailyBudgetReq: 100,
    difficulty: "Orta", difficultyColor: "amber", trend: "Stabil",
    strengths: ["Kültür/sanat motivasyonu çok güçlü", "Paris çekiciliği", "İş bağlantısı avantajlı"],
    warnings: ["Belge kalitesi ve tutarlılığı kritik", "Fransızca davetiye veya etkinlik belgesi fark yaratır"],
    tip: "Fransa için davetiye, kültürel etkinlik kaydı veya müze/galeri rezervasyonu ekleyin. Ret oranı eğitimlilerde çok düşüyor.",
    consulate: "İstanbul / Ankara",
    update2026: "Paris Olimpiyatları sonrası 2026'da vize kapasitesi normale döndü."
  },
  {
    name: "Norveç", flag: "🇳🇴", rejectionRate: 19.8, approvalRate: 80.2,
    totalApps2024: 14000, avgProcessDays: 20, dailyBudgetReq: 120,
    difficulty: "Orta", difficultyColor: "amber", trend: "Stabil",
    strengths: ["Doğa turizmi — güçlü gerekçe (fiyordlar, aurora)", "Nispeten standart süreç"],
    warnings: ["Yüksek yaşam maliyeti — bütçe kanıtı kritik", "Kış turizmi gerekçesi çok güçlü olmalı"],
    tip: "Norveç için fiyord turu veya aurora borealis paketi ile başvurun. Doğa gerekçesi çok inandırıcı.",
    consulate: "Ankara",
    update2026: "Norveç EES sistemine entegre oldu (Ekim 2025). Biyometrik beklenti artıyor."
  },
  {
    name: "İsveç", flag: "🇸🇪", rejectionRate: 21.4, approvalRate: 78.6,
    totalApps2024: 20000, avgProcessDays: 22, dailyBudgetReq: 110,
    difficulty: "Orta", difficultyColor: "amber", trend: "Stabil",
    strengths: ["İskandinav turizminde görece orta ret oranı", "İş/aile ziyareti iyi karşılanır"],
    warnings: ["Günlük bütçe yüksek tutulmalı (€110+)", "Kış turizmi gerekçesi zayıf görülebilir"],
    tip: "İsveç için Stockholm + Gothenburg kombine itin. İş/kültür amacı turistik gerekçeden daha güçlü.",
    consulate: "Ankara",
    update2026: "İsveç 2026'da dijital başvuruya geçmekte. VFS üzerinden online işlem."
  },
  {
    name: "Almanya", flag: "🇩🇪", rejectionRate: 22.0, approvalRate: 78.0,
    totalApps2024: 215506, avgProcessDays: 30, dailyBudgetReq: 100,
    difficulty: "Zor", difficultyColor: "orange", trend: "Stabil",
    strengths: ["En yüksek Türk topluluğu — aile ziyareti güçlü gerekçe", "İş/fuar amacı çok iyi değerlendiriliyor"],
    warnings: ["İstanbul ret %21.5 / Ankara ret %27.1 — şehir seçimi kritik", "Son dakika büyük mevduat kesin ret sebebi", "6 aylık finansal tutarlılık şart"],
    tip: "Almanya başvurusunda son 6 ayın her ayında düzenli maaş görünmeli. Ankara yerine İstanbul konsolosluğunu tercih edin.",
    consulate: "İstanbul (önerilir) / Ankara / İzmir",
    update2026: "Almanya 2025'te işçi ailesi için birleşik vize uygulamasını genişletti. 2026'da çoklu vize yaygınlaştı."
  },
  {
    name: "Hollanda", flag: "🇳🇱", rejectionRate: 24.1, approvalRate: 75.9,
    totalApps2024: 38000, avgProcessDays: 25, dailyBudgetReq: 110,
    difficulty: "Zor", difficultyColor: "orange", trend: "Stabil",
    strengths: ["Fuar/iş amacı çok iyi değerlendiriliyor (Amsterdam)", "Lale/müze turizmi güçlü gerekçe"],
    warnings: ["Yüksek ret oranı (%24.1)", "Finansal kanıt çok güçlü olmalı", "VFS randevu 3-4 hafta önceden alın"],
    tip: "Hollanda için davet mektubu veya fuar kaydı (Interpack, METS vb.) başarıyı %30 artırıyor.",
    consulate: "Ankara",
    update2026: "Hollanda 2026'da yüksek reddedilen profillere 3 ay bekleme uyguluyor."
  },
  {
    name: "Belçika", flag: "🇧🇪", rejectionRate: 27.5, approvalRate: 72.5,
    totalApps2024: 16000, avgProcessDays: 28, dailyBudgetReq: 100,
    difficulty: "Zor", difficultyColor: "orange", trend: "Kötüleşiyor",
    strengths: ["AB kurumları — iş amacı güçlü gerekçe", "Brugge turizm motivasyonu"],
    warnings: ["Ret oranı artıyor (%27.5)", "Belge tutarsızlığı toleransı çok düşük", "Güçlü Türkiye bağı kanıtı şart"],
    tip: "Belçika için çok güçlü finansal profil + net iş/kültür gerekçesi şart. Zayıf profillerle başvurmayın.",
    consulate: "Ankara",
    update2026: "Belçika 2025-2026'da inceleme kriterlerini sıkılaştırdı. Ret oranı artma eğiliminde."
  },
  {
    name: "Letonya", flag: "🇱🇻", rejectionRate: 28.3, approvalRate: 71.7,
    totalApps2024: 5000, avgProcessDays: 20, dailyBudgetReq: 80,
    difficulty: "Zor", difficultyColor: "orange", trend: "Stabil",
    strengths: ["Az başvurucu — hızlı randevu", "Riga turizm gerekçesi kabul görüyor"],
    warnings: ["Baltık ülkesi — genel ret oranı yüksek", "Güçlü iş/aile bağlantısı şart"],
    tip: "Letonya için seyahat amacı çok net olmalı. Riga + Tallinn kombine planı tercih edin.",
    consulate: "Ankara",
    update2026: "Letonya EES sistemine geçiş tamamlandı (Ekim 2025)."
  },
  {
    name: "Litvanya", flag: "🇱🇹", rejectionRate: 31.5, approvalRate: 68.5,
    totalApps2024: 7000, avgProcessDays: 25, dailyBudgetReq: 80,
    difficulty: "Çok Zor", difficultyColor: "rose", trend: "Kötüleşiyor",
    strengths: ["Vilnius tarihi merkezi güçlü turizm gerekçesi"],
    warnings: ["Ret oranı artıyor (%31.5)", "Baltık bölgesi sıkı inceleme", "Önceki Schengen geçmişi olmadan başvurma"],
    tip: "Litvanya'ya başvurmadan önce İtalya veya Portekiz geçmişi oluşturun. Direkt başvuru riski yüksek.",
    consulate: "Ankara",
    update2026: "Litvanya 2026'da Türk başvurularında ek belge talep etmeye başladı."
  },
  {
    name: "Finlandiya", flag: "🇫🇮", rejectionRate: 31.3, approvalRate: 68.7,
    totalApps2024: 9000, avgProcessDays: 30, dailyBudgetReq: 115,
    difficulty: "Çok Zor", difficultyColor: "rose", trend: "Stabil",
    strengths: ["Aurora/doğa turizmi — benzersiz gerekçe", "Akraba ziyareti güçlü kanıt"],
    warnings: ["Yüksek ret oranı (%31.3)", "Kış turizmi güçlü gerekçeyle sunulmalı", "€115+ günlük bütçe şart"],
    tip: "Finlandiya için özel aurora paketi veya Finlandiyalı aile bağlantısı çok etkili. Zayıf profillerle başvurma.",
    consulate: "Ankara",
    update2026: "Finlandiya 2026'da biyometrik kayıt zorunluluğunu öne aldı."
  },
  {
    name: "Estonya", flag: "🇪🇪", rejectionRate: 42.5, approvalRate: 57.5,
    totalApps2024: 4000, avgProcessDays: 40, dailyBudgetReq: 100,
    difficulty: "Çok Zor", difficultyColor: "rose", trend: "Kötüleşiyor",
    strengths: ["Dijital nomad/teknoloji iş amacı kabul görebilir", "e-Rezidency iş bağlantısı"],
    warnings: ["En yüksek ret oranlarından (%42.5)", "Güçlü iş gerekçesi olmadan başvurma", "İşlem süresi çok uzun (40 gün)"],
    tip: "Estonya'ya direkt başvurmak yerine önceki Schengen geçmişi oluşturun. Bu istatistik çok yüksek.",
    consulate: "Ankara",
    update2026: "Estonya 2025-2026'da dijital başvuruya geçti. İşlem süresi kısaldı ama ret oranı değişmedi."
  },
  {
    name: "Danimarka", flag: "🇩🇰", rejectionRate: 65.8, approvalRate: 34.2,
    totalApps2024: 6500, avgProcessDays: 35, dailyBudgetReq: 120,
    difficulty: "Çok Zor", difficultyColor: "rose", trend: "Kötüleşiyor",
    strengths: ["Aile/akraba daveti tek güçlü gerekçe", "Özel iş bağlantısı"],
    warnings: ["EN YÜKSEK RET ORANI: %65.8", "Her 3 başvurudan sadece 1'i onaylanıyor", "Kısa kıdem kesin ret sebebi", "Zayıf finansal profil başvurmamalı"],
    tip: "Danimarka'ya başvurmadan önce en az 2 Schengen geçmişi ve %90+ skor gereklidir. Birinci başvuru için kesinlikle tercih etmeyin.",
    consulate: "Ankara",
    update2026: "Danimarka 2025'te Türk başvurularında ek inceleme protokolü uygulamaya koydu."
  },
];

// ── Çoklu Ülke Vize Verisi (Türk Pasaportu) ─────────────────────────────────
export const multiCountryVisaData: Record<string, { flag: string; region: string; visaType: 'vizsiz'|'evisa'|'kapida'|'tam_vize'; note: string; maxDays: number }> = {
  'Azerbaycan': { flag:'🇦🇿', region:'Yakın Çevre', visaType:'vizsiz', note:'Kimlikle girilebilir', maxDays:90 },
  'Gürcistan': { flag:'🇬🇪', region:'Yakın Çevre', visaType:'vizsiz', note:'90 gün vizesiz', maxDays:90 },
  'Kuzey Kıbrıs': { flag:'🇨🇾', region:'Yakın Çevre', visaType:'vizsiz', note:'Kimlikle girilebilir', maxDays:90 },
  'Bosna Hersek': { flag:'🇧🇦', region:'Avrupa', visaType:'vizsiz', note:'90/180 gün', maxDays:90 },
  'Sırbistan': { flag:'🇷🇸', region:'Avrupa', visaType:'vizsiz', note:'90 gün vizesiz', maxDays:90 },
  'Arnavutluk': { flag:'🇦🇱', region:'Avrupa', visaType:'vizsiz', note:'90 gün vizesiz', maxDays:90 },
  'Kuzey Makedonya': { flag:'🇲🇰', region:'Avrupa', visaType:'vizsiz', note:'90 gün vizesiz', maxDays:90 },
  'Karadağ': { flag:'🇲🇪', region:'Avrupa', visaType:'vizsiz', note:'90 gün vizesiz', maxDays:90 },
  'Moldova': { flag:'🇲🇩', region:'Avrupa', visaType:'vizsiz', note:'90 gün vizesiz', maxDays:90 },
  'Ürdün': { flag:'🇯🇴', region:'Orta Doğu', visaType:'kapida', note:'Kapıda vize alınır', maxDays:30 },
  'Lübnan': { flag:'🇱🇧', region:'Orta Doğu', visaType:'vizsiz', note:'Mütekabiliyet bazlı', maxDays:30 },
  'Kazakistan': { flag:'🇰🇿', region:'Orta Asya', visaType:'vizsiz', note:'30 gün vizesiz', maxDays:30 },
  'Kırgızistan': { flag:'🇰🇬', region:'Orta Asya', visaType:'vizsiz', note:'Kimlikle girilebilir', maxDays:30 },
  'Özbekistan': { flag:'🇺🇿', region:'Orta Asya', visaType:'vizsiz', note:'30 gün vizesiz', maxDays:30 },
  'Mısır': { flag:'🇪🇬', region:'Afrika', visaType:'evisa', note:'e-Vize veya kapıda', maxDays:30 },
  'Fas': { flag:'🇲🇦', region:'Afrika', visaType:'vizsiz', note:'90 gün vizesiz', maxDays:90 },
  'Tunus': { flag:'🇹🇳', region:'Afrika', visaType:'vizsiz', note:'90 gün vizesiz', maxDays:90 },
  'Tayland': { flag:'🇹🇭', region:'Uzak Doğu', visaType:'kapida', note:'30 gün kapıda vize', maxDays:30 },
  'Endonezya': { flag:'🇮🇩', region:'Uzak Doğu', visaType:'evisa', note:'e-Vize zorunlu', maxDays:30 },
  'Vietnam': { flag:'🇻🇳', region:'Uzak Doğu', visaType:'evisa', note:'e-Vize gerekli', maxDays:30 },
  'Hindistan': { flag:'🇮🇳', region:'Güney Asya', visaType:'evisa', note:'e-Vize zorunlu', maxDays:60 },
  'Sri Lanka': { flag:'🇱🇰', region:'Güney Asya', visaType:'evisa', note:'e-Vize alınır', maxDays:30 },
  'Japonya': { flag:'🇯🇵', region:'Uzak Doğu', visaType:'tam_vize', note:'Konsolosluk vizesi', maxDays:90 },
  'Almanya': { flag:'🇩🇪', region:'Schengen', visaType:'tam_vize', note:'Schengen vizesi', maxDays:90 },
  'Fransa': { flag:'🇫🇷', region:'Schengen', visaType:'tam_vize', note:'Schengen vizesi', maxDays:90 },
  'İtalya': { flag:'🇮🇹', region:'Schengen', visaType:'tam_vize', note:'Schengen vizesi', maxDays:90 },
  'İspanya': { flag:'🇪🇸', region:'Schengen', visaType:'tam_vize', note:'Schengen vizesi', maxDays:90 },
  'Hollanda': { flag:'🇳🇱', region:'Schengen', visaType:'tam_vize', note:'Schengen vizesi', maxDays:90 },
  'İngiltere': { flag:'🇬🇧', region:'Avrupa', visaType:'tam_vize', note:'UK Standard Visitor', maxDays:180 },
  'ABD': { flag:'🇺🇸', region:'Kuzey Amerika', visaType:'tam_vize', note:'B1/B2 vizesi', maxDays:180 },
  'Kanada': { flag:'🇨🇦', region:'Kuzey Amerika', visaType:'tam_vize', note:'Visitor Visa', maxDays:180 },
  'Dubai/BAE': { flag:'🇦🇪', region:'Orta Doğu', visaType:'vizsiz', note:'90 gün vizesiz', maxDays:90 },
  'Katar': { flag:'🇶🇦', region:'Orta Doğu', visaType:'kapida', note:'Kapıda vize alınır', maxDays:30 },
  'Arjantin': { flag:'🇦🇷', region:'Güney Amerika', visaType:'vizsiz', note:'90 gün vizesiz', maxDays:90 },
};

// ============================================================
// MALİYET HESAPLAYICI VERİ TABANI — 2026 gerçekçi EUR bazlı rakamlar
// ── Kaynaklar:
//   • Schengen harcı: AB Komisyonu — €90 (yetişkin, 2024'ten beri)
//   • UK Standard Visitor: £115 ≈ €135
//   • US B1/B2 MRV: $185 ≈ €170
//   • VFS/iData servis ücreti: €30–40 (ülkeye göre)
//   • Günlük bütçe beklentisi: konsolosluk tebliğleri + SchengenVisaInfo
//   • Uçuş bantları: Skyscanner/Kiwi ortalamaları (İstanbul çıkışı)
//   • Konaklama: Booking/Airbnb median (düşük sezon → yüksek sezon)
// ── NOT: Rakamlar tahmini. UI'da mutlaka "tahmini" ibaresi gösterin.
// ============================================================

export interface CountryCost {
  visaFeeEUR: number;         // Konsolosluk harcı
  serviceFeeEUR: number;      // VFS / iData / TLSContact servis ücreti
  insuranceDailyEUR: number;  // 30.000€ teminatlı seyahat sigortası / gün
  flight: { low: number; mid: number; high: number };     // İstanbul → hedef, gidiş-dönüş EUR
  lodging: { budget: number; mid: number; high: number }; // EUR / gece
  dailyLife: { low: number; mid: number; high: number };  // yemek + ulaşım + müze vs. EUR/gün
  consulateDailyRequirementEUR?: number;                  // Konsolosluğun beklediği min günlük bütçe
}

export const COUNTRY_COSTS: Record<string, CountryCost> = {
  // ═══ Schengen — €90 harç standart ═══
  'Almanya':    { visaFeeEUR: 90, serviceFeeEUR: 35, insuranceDailyEUR: 1.5, flight: { low: 120, mid: 220, high: 380 }, lodging: { budget: 55, mid: 110, high: 220 }, dailyLife: { low: 40, mid: 70, high: 120 }, consulateDailyRequirementEUR: 45 },
  'Fransa':     { visaFeeEUR: 90, serviceFeeEUR: 40, insuranceDailyEUR: 1.5, flight: { low: 140, mid: 240, high: 420 }, lodging: { budget: 70, mid: 150, high: 320 }, dailyLife: { low: 55, mid: 95, high: 160 }, consulateDailyRequirementEUR: 120 },
  'İtalya':     { visaFeeEUR: 90, serviceFeeEUR: 35, insuranceDailyEUR: 1.5, flight: { low: 100, mid: 200, high: 360 }, lodging: { budget: 55, mid: 120, high: 260 }, dailyLife: { low: 45, mid: 80, high: 140 }, consulateDailyRequirementEUR: 45 },
  'İspanya':    { visaFeeEUR: 90, serviceFeeEUR: 35, insuranceDailyEUR: 1.5, flight: { low: 130, mid: 230, high: 400 }, lodging: { budget: 50, mid: 110, high: 230 }, dailyLife: { low: 45, mid: 80, high: 140 }, consulateDailyRequirementEUR: 100 },
  'Hollanda':   { visaFeeEUR: 90, serviceFeeEUR: 35, insuranceDailyEUR: 1.5, flight: { low: 120, mid: 230, high: 400 }, lodging: { budget: 80, mid: 160, high: 320 }, dailyLife: { low: 55, mid: 95, high: 160 }, consulateDailyRequirementEUR: 55 },
  'Yunanistan': { visaFeeEUR: 90, serviceFeeEUR: 30, insuranceDailyEUR: 1.5, flight: { low: 60,  mid: 130, high: 260 }, lodging: { budget: 40, mid: 90,  high: 180 }, dailyLife: { low: 35, mid: 65, high: 110 }, consulateDailyRequirementEUR: 50 },
  'Macaristan': { visaFeeEUR: 90, serviceFeeEUR: 30, insuranceDailyEUR: 1.5, flight: { low: 90,  mid: 170, high: 300 }, lodging: { budget: 40, mid: 85,  high: 170 }, dailyLife: { low: 30, mid: 55, high: 95  }, consulateDailyRequirementEUR: 40 },
  'Polonya':    { visaFeeEUR: 90, serviceFeeEUR: 30, insuranceDailyEUR: 1.5, flight: { low: 100, mid: 180, high: 320 }, lodging: { budget: 35, mid: 80,  high: 160 }, dailyLife: { low: 30, mid: 55, high: 95  }, consulateDailyRequirementEUR: 35 },
  'Portekiz':   { visaFeeEUR: 90, serviceFeeEUR: 35, insuranceDailyEUR: 1.5, flight: { low: 180, mid: 280, high: 460 }, lodging: { budget: 50, mid: 105, high: 220 }, dailyLife: { low: 40, mid: 75, high: 130 }, consulateDailyRequirementEUR: 70 },
  'Avusturya':  { visaFeeEUR: 90, serviceFeeEUR: 35, insuranceDailyEUR: 1.5, flight: { low: 130, mid: 220, high: 380 }, lodging: { budget: 70, mid: 140, high: 280 }, dailyLife: { low: 50, mid: 90, high: 150 }, consulateDailyRequirementEUR: 100 },
  'Belçika':    { visaFeeEUR: 90, serviceFeeEUR: 35, insuranceDailyEUR: 1.5, flight: { low: 130, mid: 230, high: 400 }, lodging: { budget: 65, mid: 130, high: 260 }, dailyLife: { low: 50, mid: 90, high: 150 }, consulateDailyRequirementEUR: 95 },
  'İsviçre':    { visaFeeEUR: 90, serviceFeeEUR: 40, insuranceDailyEUR: 1.5, flight: { low: 150, mid: 260, high: 450 }, lodging: { budget: 110, mid: 220, high: 420 }, dailyLife: { low: 90, mid: 150, high: 240 }, consulateDailyRequirementEUR: 100 },
  'Norveç':     { visaFeeEUR: 90, serviceFeeEUR: 40, insuranceDailyEUR: 1.5, flight: { low: 180, mid: 320, high: 520 }, lodging: { budget: 100, mid: 200, high: 380 }, dailyLife: { low: 80, mid: 130, high: 210 }, consulateDailyRequirementEUR: 75 },
  'İsveç':      { visaFeeEUR: 90, serviceFeeEUR: 35, insuranceDailyEUR: 1.5, flight: { low: 160, mid: 280, high: 460 }, lodging: { budget: 80, mid: 160, high: 320 }, dailyLife: { low: 65, mid: 110, high: 180 }, consulateDailyRequirementEUR: 65 },
  'Danimarka':  { visaFeeEUR: 90, serviceFeeEUR: 40, insuranceDailyEUR: 1.5, flight: { low: 150, mid: 270, high: 450 }, lodging: { budget: 90, mid: 180, high: 350 }, dailyLife: { low: 75, mid: 125, high: 200 }, consulateDailyRequirementEUR: 70 },
  'Romanya':    { visaFeeEUR: 90, serviceFeeEUR: 30, insuranceDailyEUR: 1.5, flight: { low: 80,  mid: 160, high: 280 }, lodging: { budget: 35, mid: 75,  high: 150 }, dailyLife: { low: 25, mid: 50, high: 90  }, consulateDailyRequirementEUR: 50 },
  'Slovakya':   { visaFeeEUR: 90, serviceFeeEUR: 30, insuranceDailyEUR: 1.5, flight: { low: 100, mid: 180, high: 310 }, lodging: { budget: 40, mid: 85,  high: 170 }, dailyLife: { low: 30, mid: 55, high: 95  }, consulateDailyRequirementEUR: 60 },
  'Malta':      { visaFeeEUR: 90, serviceFeeEUR: 35, insuranceDailyEUR: 1.5, flight: { low: 140, mid: 240, high: 400 }, lodging: { budget: 60, mid: 120, high: 230 }, dailyLife: { low: 45, mid: 80, high: 130 }, consulateDailyRequirementEUR: 80 },
  // ═══ Non-Schengen ═══
  'İngiltere':  { visaFeeEUR: 135, serviceFeeEUR: 55, insuranceDailyEUR: 2.0, flight: { low: 160, mid: 280, high: 460 }, lodging: { budget: 90, mid: 180, high: 360 }, dailyLife: { low: 70, mid: 120, high: 200 } },
  'ABD':        { visaFeeEUR: 170, serviceFeeEUR: 0,  insuranceDailyEUR: 2.5, flight: { low: 400, mid: 650, high: 950 }, lodging: { budget: 110, mid: 220, high: 420 }, dailyLife: { low: 90, mid: 150, high: 250 } },
};

// ── Maliyet sınıfları ───────────────────────────────────────────────────────
export type TravelTier = 'budget' | 'mid' | 'premium';
export type CityTier = 'low' | 'mid' | 'high';
export type Season = 'off' | 'shoulder' | 'peak';

export interface CostInput {
  country: string;
  days: number;            // Kalış gün sayısı
  travelers: number;       // Kişi sayısı (uçak + konaklama + günlük × kişi)
  tier: TravelTier;
  cityTier: CityTier;
  season: Season;
  includeInsurance: boolean;
}

export interface CostBreakdown {
  visaFeeEUR: number;
  serviceFeeEUR: number;
  insuranceEUR: number;
  flightEUR: number;
  lodgingEUR: number;
  dailyLifeEUR: number;
  totalEUR: number;
  currency: 'EUR';
  consulateMinEUR: number | null;   // Konsolosluk min günlük bütçe × gün × kişi
  meetsConsulateMin: boolean;
  notes: string[];
}

/**
 * Seyahat maliyetini ülke × süre × kişi × tier × sezon bazında hesaplar.
 * Tüm değerler EUR; UI tarafında TRY'ye çevrilebilir.
 */
export function calculateTripCost(input: CostInput): CostBreakdown | null {
  const c = COUNTRY_COSTS[input.country];
  if (!c) return null;

  const days = Math.max(1, input.days);
  const people = Math.max(1, input.travelers);
  const notes: string[] = [];

  // Uçak — sezona göre band seçimi
  const flightBand = input.season === 'off' ? c.flight.low
                   : input.season === 'peak' ? c.flight.high
                   : c.flight.mid;

  // Konaklama — tier × cityTier çarpımı (tier düşükse low/budget, premium ise high)
  const lodgingBand = input.tier === 'budget' ? c.lodging.budget
                    : input.tier === 'premium' ? c.lodging.high
                    : c.lodging.mid;
  const cityMultiplier = input.cityTier === 'low' ? 0.85 : input.cityTier === 'high' ? 1.2 : 1.0;
  const lodgingPerNight = lodgingBand * cityMultiplier;

  // Günlük yaşam — aynı city tier çarpanını uygula
  const dailyBand = input.tier === 'budget' ? c.dailyLife.low
                  : input.tier === 'premium' ? c.dailyLife.high
                  : c.dailyLife.mid;
  const dailyPerPerson = dailyBand * cityMultiplier;

  // Vize ücretleri — kişi başı, tek seferlik
  const visaFeeEUR = c.visaFeeEUR * people;
  const serviceFeeEUR = c.serviceFeeEUR * people;

  // Sigorta — gün × kişi
  const insuranceEUR = input.includeInsurance ? Math.round(c.insuranceDailyEUR * days * people) : 0;

  // Uçuş — kişi başı gidiş-dönüş
  const flightEUR = flightBand * people;

  // Konaklama — gece başı oda; çift kişi için +%40 varsayımı, 3+ kişi için /oda başına
  // Basitleştirme: 1 kişi tek, 2 kişi tek oda (×1.4), 3+ kişi (people/2 oda)
  const roomCount = people === 1 ? 1 : people === 2 ? 1 : Math.ceil(people / 2);
  const roomMultiplier = people === 2 ? 1.4 : 1.0;
  const lodgingEUR = Math.round(lodgingPerNight * days * roomCount * roomMultiplier);

  // Günlük yaşam — kişi × gün
  const dailyLifeEUR = Math.round(dailyPerPerson * days * people);

  const totalEUR = visaFeeEUR + serviceFeeEUR + insuranceEUR + flightEUR + lodgingEUR + dailyLifeEUR;

  // Konsolosluk minimum kontrolü
  const consulateMinEUR = c.consulateDailyRequirementEUR
    ? c.consulateDailyRequirementEUR * days * people
    : null;
  const meetsConsulateMin = consulateMinEUR === null
    ? true
    : (dailyLifeEUR + lodgingEUR) >= consulateMinEUR;

  // Notlar — konsolosluk beklentisi ve ipuçları
  if (consulateMinEUR && !meetsConsulateMin) {
    notes.push(`Konsolosluk ${input.country} için günlük min ~€${c.consulateDailyRequirementEUR} bekler — toplam min €${consulateMinEUR}. Banka bakiyenizin bunu karşıladığından emin olun.`);
  }
  if (input.season === 'peak') {
    notes.push('Yoğun sezon (Haziran-Ağustos, Aralık) — uçuş/konaklama %30-60 pahalı. Mart-Mayıs veya Ekim-Kasım dönemi daha uygun.');
  }
  if (input.tier === 'budget' && people === 1) {
    notes.push('Tek kişilik ekonomik seyahat — hostel/Airbnb + yerel ulaşım varsayıldı.');
  }

  return {
    visaFeeEUR,
    serviceFeeEUR,
    insuranceEUR,
    flightEUR,
    lodgingEUR,
    dailyLifeEUR,
    totalEUR: Math.round(totalEUR),
    currency: 'EUR',
    consulateMinEUR,
    meetsConsulateMin,
    notes,
  };
}
