import React, { useState, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, ChevronRight, Tag, Search, X, Plane, Stamp, Globe, Shield, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { SEO } from '../../components/SEO';
import Footer from '../../components/Footer';

// ── Blog yazısı meta verisi ─────────────────────────────────────────────────
export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  readingTime: number; // dakika
  date: string;        // "YYYY-AA-GG"
  tags: string[];
}

// ── Yayınlanan blog yazıları (yeni yazı eklendiğinde buraya ekle) ──────────
export const BLOG_POSTS: BlogPost[] = [
  // ── Demografik & Meslek ─────────────────────────────────────────────────
  {
    slug: 'ev-hanimi-italya-schengen-vizesi',
    title: 'Çalışmayan Ev Hanımları için İtalya Schengen Vizesi Nasıl Alınır? (2026 Rehberi)',
    description: 'Gelir belgesi olmayan ev hanımları için İtalya Schengen vizesi başvurusunda eş geliri, sponsor belgeleri ve banka ekstresi nasıl hazırlanır?',
    category: 'Schengen',
    readingTime: 8,
    date: '2026-04-16',
    tags: ['ev hanımı', 'İtalya vizesi', 'Schengen', 'sponsor'],
  },
  {
    slug: 'freelance-ingiltere-vize-basvurusu',
    title: 'Şahıs Şirketi Olmayan Freelance Çalışanlar İçin İngiltere Vize Başvurusu (2026)',
    description: 'Vergi kaydı veya şahıs şirketi olmadan freelance geliriyle İngiltere Standard Visitor vizesi nasıl alınır? Gerekli belgeler ve banka ekstresi stratejisi.',
    category: 'İngiltere',
    readingTime: 9,
    date: '2026-04-16',
    tags: ['freelance', 'İngiltere vizesi', 'UK visitor visa'],
  },
  {
    slug: 'ogrenci-sponsorsuz-amerika-turist-vizesi',
    title: 'Öğrenciler için Sponsorsuz Amerika Turist Vizesi (B-2) Alma Rehberi 2026',
    description: 'Kendi başına başvuran üniversite öğrencileri için ABD B-2 turist vizesi: DS-160, mülakat taktikleri ve Türkiye bağını güçlendirme.',
    category: 'ABD',
    readingTime: 10,
    date: '2026-04-16',
    tags: ['öğrenci', 'Amerika vizesi', 'B-2', 'turist vizesi'],
  },
  {
    slug: 'emekli-yunanistan-kapi-vizesi-2026',
    title: 'Emekliler için Yunanistan Kapı Vizesi: Gerekli Evraklar ve Püf Noktalar 2026',
    description: 'Schengen vizesi olmayan Türk emekliler için Yunanistan adaları kapı vizesi süreci, gerekli belgeler ve dikkat edilmesi gerekenler.',
    category: 'Schengen',
    readingTime: 7,
    date: '2026-04-16',
    tags: ['emekli', 'Yunanistan', 'kapı vizesi', 'border visa'],
  },
  // ── Sorun & Çözüm ──────────────────────────────────────────────────────
  {
    slug: 'schengen-reddi-madde-8-itiraz',
    title: 'Schengen Vizesi Reddi (Madde 8) Ne Anlama Gelir? İtiraz Dilekçesi Nasıl Yazılır?',
    description: 'Schengen vize ret yazısındaki hukuki gerekçe kodlarını, özellikle Madde 8\'i anlıyoruz; ardından itiraz dilekçesi nasıl yazılır.',
    category: 'Schengen',
    readingTime: 9,
    date: '2026-04-16',
    tags: ['Schengen reddi', 'Madde 8', 'vize itirazı', 'ret mektubu'],
  },
  {
    slug: 'pasaportunda-ret-varken-yeni-vize',
    title: 'Pasaportunda Ret Varken Yeni Vize Başvurusu Yapmanın Püf Noktaları',
    description: 'Önceki ret damgası olan pasaportla Schengen, İngiltere veya ABD vizesi için yeniden başvururken nelere dikkat etmeli?',
    category: 'Genel',
    readingTime: 8,
    date: '2026-04-16',
    tags: ['vize reddi', 'ret geçmişi', 'yeni başvuru', 'pasaport'],
  },
  {
    slug: 'vize-mulakatinda-heyecan',
    title: 'Vize Mülakatında Heyecanlanmamak için Bilmeniz Gerekenler',
    description: 'ABD, İngiltere ve Schengen vize mülakatlarında heyecan neden tehlikelidir, mülakat soruları nasıl hazırlanır, beden dili ve cevap teknikleri.',
    category: 'İpucu',
    readingTime: 7,
    date: '2026-04-16',
    tags: ['vize mülakatı', 'heyecan', 'mülakat soruları', 'ipucu'],
  },
  {
    slug: 'vize-icin-banka-hesabinda-ne-kadar-para',
    title: 'Banka Hesabında Ne Kadar Para Olması Vize Almayı Garantiler?',
    description: 'Schengen, ABD ve İngiltere vizesi için banka hesabında ne kadar para gerekir? Ülke bazlı minimum miktarlar ve banka ekstresini doğru sunma rehberi.',
    category: 'İpucu',
    readingTime: 8,
    date: '2026-04-16',
    tags: ['banka ekstresi', 'vize parası', 'Schengen finansal'],
  },
  // ── Nasıl Yapılır ───────────────────────────────────────────────────────
  {
    slug: 'fransa-vize-randevu-alternatif',
    title: 'VFS Global Üzerinden Fransa Vize Randevusu Bulamayanlar İçin Alternatif Taktikler',
    description: 'Fransa Schengen vizesi için VFS Global randevusu doluyken ne yapılır? Alternatif şehirler, erken randevu stratejisi ve iptal slotları.',
    category: 'Schengen',
    readingTime: 7,
    date: '2026-04-16',
    tags: ['Fransa vizesi', 'VFS Global', 'randevu', 'Schengen'],
  },
  {
    slug: 'ds-160-form-doldurma-rehberi',
    title: 'Adım Adım DS-160 Formu Doldurma Rehberi (Türkçe Açıklamalı) 2026',
    description: 'ABD vize başvurusu için DS-160 formunu Türkçe açıklamalarla nasıl dolduracaksınız? En çok hata yapılan bölümler ve tuzaklı sorular.',
    category: 'ABD',
    readingTime: 11,
    date: '2026-04-16',
    tags: ['DS-160', 'ABD vize formu', 'Amerika vizesi', 'form doldurma'],
  },
  {
    slug: 'ingiltere-tier4-niyet-mektubu',
    title: 'İngiltere Student Visa (Tier 4) için Niyet Mektubu Nasıl Yazılır?',
    description: 'UK Student Visa başvurusunda personal statement / niyet mektubunda neler yazılmalı, neler yazılmamalı? Yapı, uzunluk ve kaçınılması gereken klişeler.',
    category: 'İngiltere',
    readingTime: 9,
    date: '2026-04-16',
    tags: ['İngiltere öğrenci vizesi', 'Tier 4', 'niyet mektubu', 'personal statement'],
  },
  // ── Karşılaştırma ───────────────────────────────────────────────────────
  {
    slug: '2026-schengen-kolay-zor-ulkeler',
    title: '2026\'da En Kolay ve En Zor Schengen Vizesi Veren Ülkeler Karşılaştırması',
    description: 'Türk vatandaşları için 2024-2026 Schengen onay istatistiklerine göre hangi ülkeler kolay, hangisi zor vize veriyor?',
    category: 'Schengen',
    readingTime: 8,
    date: '2026-04-16',
    tags: ['Schengen karşılaştırma', 'kolay vize', 'onay oranı', '2026'],
  },
  {
    slug: 'dubai-evize-mi-kapida-vize-mi',
    title: 'Dubai E-Vize mi, Kapıda Vize mi Daha Avantajlı? 2026 Güncel Karşılaştırma',
    description: 'Dubai\'ye gidecek Türk vatandaşları için e-vize ve kapıda vize arasındaki farklar: maliyet, süre, riskler ve hangi durumda hangisi tercih edilmeli?',
    category: 'Dubai',
    readingTime: 6,
    date: '2026-04-16',
    tags: ['Dubai vizesi', 'e-vize', 'kapıda vize', 'UAE'],
  },
  {
    slug: 'f1-j1-vizesi-farklari',
    title: 'Amerika F-1 (Öğrenci) ve J-1 (Work and Travel) Vizesi Arasındaki Farklar',
    description: 'ABD F-1 öğrenci vizesi ile J-1 Work and Travel vizesinin farklılıkları: kimler başvurabilir, çalışma hakları, süre ve SEVIS ücreti.',
    category: 'ABD',
    readingTime: 9,
    date: '2026-04-16',
    tags: ['F-1 vizesi', 'J-1 vizesi', 'Work and Travel', 'öğrenci vizesi'],
  },
  // ── SEO Strateji Yazıları (2026 Eklentisi) ──────────────────────────────
  {
    slug: 'cascade-kurali-schengen-vizesi',
    title: "Cascade Kuralı Nedir? Schengen'de 6 Aydan 5 Yıla Uzanan Vize Hakkı",
    description: "AB Cascade kuralı (C(2025) 4694) ile Schengen vizesi nasıl adım adım 1, 3 ve 5 yıllık multiple-entry'ye dönüşür? Her adımın koşulları, kazanımlar ve dikkat noktaları.",
    category: 'Schengen',
    readingTime: 8,
    date: '2026-04-16',
    tags: ['cascade kuralı', 'multiple-entry', 'Schengen', 'çok girişli vize'],
  },
  {
    slug: 'ees-sistemi-nedir',
    title: "EES Sistemi Nedir? Schengen Sınırında Pasaport Damgası Kalktı — 2026 Rehberi",
    description: "Nisan 2026'da tam devreye giren EES (Entry/Exit System) ile Schengen'de pasaport damgası tarihe karıştı. Parmak izi, yüz tanıma, 90/180 gün otomatik sayım ve bekleme süreleri.",
    category: 'Schengen',
    readingTime: 7,
    date: '2026-04-16',
    tags: ['EES sistemi', 'Schengen', 'pasaport damgası', '90/180 gün', 'biyometrik'],
  },
  {
    slug: 'ingiltere-evisa-rehberi',
    title: "İngiltere eVisa Nedir? 2026'da Dijital Vize Zorunluluğu ve Başvuru Rehberi",
    description: "25 Şubat 2026 itibarıyla İngiltere fiziksel vize etiketini tamamen kaldırdı. Türk vatandaşları için İngiltere eVisa başvurusu, UKVI hesabı, BRP kartı iptali ve seyahatte dikkat edilecekler.",
    category: 'İngiltere',
    readingTime: 7,
    date: '2026-04-16',
    tags: ['İngiltere eVisa', 'UK vize', 'dijital vize', 'UKVI', 'BRP kartı'],
  },
  {
    slug: 'schengen-vizesi-nasil-alinir',
    title: "Schengen Vizesi Nasıl Alınır? 2026 Güncel Adım Adım Rehber",
    description: "Türk vatandaşları için Schengen vizesi başvurusu: hangi ülkeye başvurulur, hangi belgeler gerekir, banka hesabı nasıl olmalı, bekleme süresi ne kadar? Randevudan onaya eksiksiz rehber.",
    category: 'Schengen',
    readingTime: 10,
    date: '2026-04-16',
    tags: ['Schengen vizesi', 'vize başvurusu', 'vize belgeleri', 'Schengen 2026'],
  },
  {
    slug: 'schengen-vize-ret-kodlari-c1-c14',
    title: "Schengen Vize Ret Kodları: C1'den C14'e Anlam ve İtiraz Rehberi",
    description: "Schengen vize reddinde bildirimde yer alan C1-C14 ret kodları ne anlama gelir? Her koda göre neyin eksik olduğu, nasıl düzeltilebileceği ve itiraz hakkının nasıl kullanılacağı.",
    category: 'Schengen',
    readingTime: 8,
    date: '2026-04-16',
    tags: ['Schengen ret', 'vize reddi', 'ret kodu', 'itiraz', 'C1 C2 C14'],
  },
  {
    slug: 'vize-randevusu-nasil-alinir',
    title: "Vize Randevusu Nasıl Alınır? 2026 VFS ve Konsolosluk Rehberi",
    description: "Schengen, İngiltere, ABD ve diğer ülkeler için vize randevusu alma adımları, VFS Global ve TLScontact portalleri, randevu bulunamadığında ne yapılır.",
    category: 'Genel',
    readingTime: 6,
    date: '2026-04-16',
    tags: ['vize randevusu', 'VFS Global', 'TLScontact', 'randevu iptal'],
  },
  {
    slug: 'almanya-vizesi-nasil-alinir-2026',
    title: "Almanya Vizesi Nasıl Alınır? 2026 Güncel Belgeler, Bekleme Süresi ve İpuçları",
    description: "Türk vatandaşları için 2026 Almanya Schengen vizesi başvurusu: gerekli belgeler, banka hesabı şartları, VFS randevu süreci ve onay oranını artıracak püf noktaları.",
    category: 'Almanya',
    readingTime: 8,
    date: '2026-04-16',
    tags: ['Almanya vizesi', 'Almanya Schengen', 'VFS Almanya', '2026 Almanya'],
  },
  {
    slug: 'abd-vizesi-nasil-alinir-2026',
    title: "ABD Vizesi Nasıl Alınır? 2026 DS-160, Mülakat ve Tam Rehber",
    description: "Türk vatandaşları için 2026 ABD B1/B2 vize başvurusu: DS-160 formu, mülakat hazırlığı, ret gerekçeleri, bekleme süreleri. Adım adım güncel rehber.",
    category: 'ABD',
    readingTime: 9,
    date: '2026-04-16',
    tags: ['ABD vizesi', 'Amerika vizesi', 'DS-160', 'B1 B2 vize', 'ABD mülakat'],
  },
  {
    slug: 'kapida-vize-veren-ulkeler-2026',
    title: "Türk Pasaportuyla Kapıda Vize Alınabilecek Ülkeler 2026",
    description: "2026 güncel listesi: Türk vatandaşlarının kapıda vize alabildiği ülkeler, koşullar, ücretler ve dikkat edilmesi gerekenler. Dubai, Maldivler, Endonezya ve daha fazlası.",
    category: 'Genel',
    readingTime: 6,
    date: '2026-04-16',
    tags: ['kapıda vize', 'vizesiz ülkeler', 'Türk pasaportu', '2026 seyahat'],
  },
  {
    slug: 'kanada-vizesi-nasil-alinir-2026',
    title: "Kanada Vizesi Nasıl Alınır? 2026 TRV Başvuru Rehberi",
    description: "Türk vatandaşları için 2026 Kanada Geçici İkamet Vizesi (TRV) başvurusu: IRCC online başvuru, biyometrik kayıt, belge gereksinimleri ve bekleme süreleri.",
    category: 'Genel',
    readingTime: 8,
    date: '2026-04-16',
    tags: ['Kanada vizesi', 'TRV', 'IRCC', 'Kanada başvurusu', '2026 Kanada'],
  },
  {
    slug: 'dijital-nomad-vizesi-2026',
    title: "Dijital Nomad Vizesi 2026: Türk Vatandaşları İçin En Cazip Ülkeler",
    description: "2026'da uzaktan çalışarak yurt dışında yaşamak isteyen Türk vatandaşları için dijital nomad vizesi sunan ülkeler: Portekiz, Hırvatistan, Yunanistan, Mauritius ve daha fazlası.",
    category: 'İpucu',
    readingTime: 8,
    date: '2026-04-16',
    tags: ['dijital nomad vizesi', 'uzaktan çalışma vizesi', 'Portekiz dijital nomad', 'remote work vize'],
  },
  // ── 2026 PDF Rehber Yazıları ────────────────────────────────────────────
  {
    slug: 'vize-icin-banka-hesabi-ne-kadar-olmali',
    title: 'Vize İçin Banka Hesabında Ne Kadar Para Olmalı? 2026 Ülke Bazlı Rehber',
    description: 'Schengen, İngiltere, ABD ve Kanada vizesi için banka hesabında tutulması gereken minimum bakiye, günlük harcama kuralı ve 28 gün bekletme yöntemi.',
    category: 'İpucu',
    readingTime: 9,
    date: '2026-04-17',
    tags: ['banka hesabı', 'vize parası', 'banka ekstresi', 'günlük bütçe'],
  },
  {
    slug: 'ev-hanimlari-icin-schengen-vizesi',
    title: 'Ev Hanımları İçin Schengen Vizesi Nasıl Alınır? 2026 Tam Rehber',
    description: 'Çalışmayan ev hanımları için Schengen vize başvurusu: eş sponsorluğu, banka ekstresi, kısıt belgeler ve en kolay onaylanan ülkeler.',
    category: 'Schengen',
    readingTime: 9,
    date: '2026-04-17',
    tags: ['ev hanımı', 'Schengen vizesi', 'sponsor', 'çalışmayan'],
  },
  {
    slug: 'vize-reddi-sonrasi-ne-yapmali-itiraz-rehberi',
    title: 'Vize Reddi Sonrası Ne Yapmalı? 2026 İtiraz ve Yeniden Başvuru Rehberi',
    description: 'Schengen, İngiltere, ABD ret kararları sonrası izlenecek adımlar: ret gerekçelerini anlama, itiraz dilekçesi yazma ve güçlü bir yeniden başvuru stratejisi.',
    category: 'Genel',
    readingTime: 10,
    date: '2026-04-17',
    tags: ['vize reddi', 'itiraz', 'yeniden başvuru', 'ret kodları'],
  },
  {
    slug: 'ds-160-formu-nasil-doldurulur-rehberi',
    title: 'DS-160 Formu Nasıl Doldurulur? 2026 Adım Adım Türkçe Rehber',
    description: 'ABD vize başvurusu için DS-160 formunu sıfırdan doldurma rehberi: bölüm bölüm ne yazılır, en çok hata yapılan sorular ve tuzaklı alanlar.',
    category: 'ABD',
    readingTime: 12,
    date: '2026-04-17',
    tags: ['DS-160', 'ABD vizesi', 'form doldurma', 'B1 B2 vize'],
  },
  {
    slug: 'en-kolay-schengen-vizesi-veren-ulkeler-2026',
    title: 'En Kolay Schengen Vizesi Veren Ülkeler 2026 — Onay Oranlarına Göre Sıralama',
    description: '2024-2026 AB resmi istatistiklerine göre Türk vatandaşlarına en yüksek onay oranıyla Schengen vizesi veren ülkeler ve stratejik seçim rehberi.',
    category: 'Schengen',
    readingTime: 8,
    date: '2026-04-17',
    tags: ['Schengen', 'onay oranı', 'kolay vize', '2026 istatistik'],
  },
  {
    slug: 'emekliler-icin-vize-basvurusu-rehberi',
    title: 'Emekliler İçin Vize Başvurusu — 2026 Tam Rehber',
    description: 'Emekli Türk vatandaşları için Schengen, İngiltere, ABD ve Kanada vize başvurusu: SGK emekli belgesi, kısıt gelir, sağlık sigortası ve dönüş güvencesi.',
    category: 'Genel',
    readingTime: 9,
    date: '2026-04-17',
    tags: ['emekli', 'emekli vize', 'SGK', 'sağlık sigortası'],
  },
  {
    slug: 'schengen-vizesi-gerekli-belgeler-2026',
    title: 'Schengen Vizesi Gerekli Belgeler 2026 — Tam Kontrol Listesi',
    description: '2026 güncel Schengen vize başvurusu için eksiksiz belge listesi: zorunlu evraklar, opsiyonel güçlendiriciler ve ülkeye özel farklılıklar.',
    category: 'Schengen',
    readingTime: 9,
    date: '2026-04-17',
    tags: ['Schengen belgeleri', 'vize belgeleri', 'kontrol listesi', '2026'],
  },
  {
    slug: 'ogrenciler-icin-vize-rehberi-2026',
    title: 'Öğrenciler İçin Vize Rehberi 2026 — Turist, Staj ve Eğitim Vizesi',
    description: 'Üniversite öğrencileri için turist, eğitim ve staj vize başvurusu: aile sponsorluğu, öğrenci belgesi, GKS/burs durumu ve en uygun ülkeler.',
    category: 'Genel',
    readingTime: 10,
    date: '2026-04-17',
    tags: ['öğrenci vizesi', 'eğitim vizesi', 'staj vizesi', '2026'],
  },
  {
    slug: 'dubai-e-vizesi-2026-basvuru-rehberi',
    title: 'Dubai E-Vizesi 2026 — Başvuru Rehberi, Ücretler ve Süreler',
    description: 'Dubai ve BAE için e-vize başvurusu 2026: 30/60/90 günlük vize türleri, gereken belgeler, ücretler ve hızlı onay için ipuçları.',
    category: 'Dubai',
    readingTime: 8,
    date: '2026-04-17',
    tags: ['Dubai vizesi', 'UAE e-vize', 'Dubai başvuru', '2026'],
  },
  {
    slug: 'vize-ucretleri-karsilastirma-2026',
    title: 'Vize Ücretleri Karşılaştırması 2026 — Ülke Bazlı Tam Liste',
    description: 'Türk vatandaşları için 2026 güncel vize ücretleri: Schengen, İngiltere, ABD, Kanada, Dubai ve diğer ülkelerin başvuru bedelleri, VFS hizmet ücretleri ve gizli masraflar.',
    category: 'Genel',
    readingTime: 8,
    date: '2026-04-17',
    tags: ['vize ücretleri', 'başvuru bedeli', 'VFS ücret', '2026'],
  },
  {
    slug: 'serbest-meslek-sahipleri-icin-vize-rehberi',
    title: 'Serbest Meslek Sahipleri İçin Vize Rehberi 2026',
    description: 'Avukat, doktor, mimar, mali müşavir gibi serbest meslek sahipleri için Schengen ve diğer ülkeler vize başvurusu: vergi levhası, faaliyet belgesi, gelir tablosu.',
    category: 'Genel',
    readingTime: 9,
    date: '2026-04-17',
    tags: ['serbest meslek', 'vergi levhası', 'Schengen', 'freelance'],
  },
  {
    slug: 'issizler-ve-calismayanlar-icin-vize',
    title: 'İşsizler ve Çalışmayanlar İçin Vize Başvurusu — 2026 Rehberi',
    description: 'İş kaybı sonrası, mezun olmuş ama iş bulamamış veya kendi isteğiyle çalışmayan kişiler için Schengen ve diğer ülkelere vize başvurusu stratejisi.',
    category: 'Genel',
    readingTime: 9,
    date: '2026-04-17',
    tags: ['işsiz vize', 'çalışmayan', 'sponsor', 'Schengen'],
  },
  {
    slug: 'yesil-pasaport-avantajlari-vizesiz-ulkeler-2026',
    title: 'Yeşil Pasaport Avantajları — 2026 Vizesiz Ülkeler ve Kullanım Rehberi',
    description: 'Hususi pasaport (yeşil pasaport) sahipleri için 2026 güncel vizesiz ülkeler listesi, kimler yeşil pasaport alabilir, avantajları ve sınırlı olduğu ülkeler.',
    category: 'Genel',
    readingTime: 8,
    date: '2026-04-17',
    tags: ['yeşil pasaport', 'hususi pasaport', 'vizesiz ülkeler', 'Türk pasaportu'],
  },
  {
    slug: 'sponsor-dilekcesi-nasil-yazilir-ornek',
    title: 'Sponsor Dilekçesi Nasıl Yazılır? Örnek Metin ve 2026 Rehber',
    description: 'Vize başvurusu için sponsor dilekçesi (taahhütname) nasıl yazılır, hangi bilgiler zorunludur, noter onayı gerekir mi — indirilebilir şablon ve örnekler.',
    category: 'İpucu',
    readingTime: 7,
    date: '2026-04-17',
    tags: ['sponsor dilekçesi', 'taahhütname', 'vize belgeleri', 'şablon'],
  },
  {
    slug: '90-180-gun-kurali-nasil-hesaplanir',
    title: '90/180 Gün Kuralı Nasıl Hesaplanır? Schengen 2026 Rehberi',
    description: 'Schengen 90/180 gün kuralı nedir, EES sistemi ile otomatik hesaplama, aşım durumunda cezalar ve kalan günlerinizi nasıl takip edersiniz.',
    category: 'Schengen',
    readingTime: 7,
    date: '2026-04-17',
    tags: ['90/180 gün', 'Schengen', 'EES', 'vize süresi'],
  },
  {
    slug: 'vize-icin-seyahat-sigortasi-nasil-secilir',
    title: 'Vize İçin Seyahat Sigortası Nasıl Seçilir? 2026 Rehberi',
    description: 'Schengen, İngiltere, ABD vizesi için zorunlu seyahat sağlık sigortası: minimum teminat, kapsamlar, fiyatlar ve güvenilir sigorta şirketleri.',
    category: 'İpucu',
    readingTime: 8,
    date: '2026-04-17',
    tags: ['seyahat sigortası', 'sağlık sigortası', 'Schengen', 'poliçe'],
  },
];

// ── Kategori renk haritası ──────────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  Schengen:  'bg-blue-100 text-blue-700',
  'ABD':     'bg-red-100 text-red-700',
  Almanya:   'bg-yellow-100 text-yellow-800',
  İngiltere: 'bg-purple-100 text-purple-700',
  Dubai:     'bg-amber-100 text-amber-700',
  Genel:     'bg-slate-100 text-slate-700',
  İpucu:     'bg-emerald-100 text-emerald-700',
};

function categoryColor(cat: string) {
  return CATEGORY_COLORS[cat] ?? 'bg-violet-100 text-violet-700';
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('tr-TR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

// ── Schema.org ──────────────────────────────────────────────────────────────
const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'VizeAkıl Blog',
  description: 'Vize başvurusu rehberleri, ipuçları ve güncel bilgiler.',
  url: 'https://vizeakil.com/blog',
  publisher: { '@type': 'Organization', name: 'VizeAkıl', url: 'https://vizeakil.com', logo: { '@type': 'ImageObject', url: 'https://vizeakil.com/og-image.png' } },
};

// ── Kategoriler (arama filtresi için) ──────────────────────────────────────
const ALL_CATEGORIES = ['Tümü', ...Array.from(new Set(BLOG_POSTS.map((p) => p.category)))];

// ── Visa Stats Section (scroll-triggered) ───────────────────────────────────
const VISA_STATS = [
  { icon: Globe, value: '27', label: 'Schengen Ülkesi', suffix: '' },
  { icon: Shield, value: '52K', label: 'Profil Analiz Edildi', suffix: '+' },
  { icon: Plane, value: '26', label: 'Ülke Rehberi', suffix: '' },
  { icon: Stamp, value: '98', label: 'Ret Kodu Analizi', suffix: '%' },
];

// ── Bileşen ─────────────────────────────────────────────────────────────────
export default function BlogIndex() {
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tümü');

  // Etiket linklerinden gelen state'i oku
  useEffect(() => {
    const state = location.state as { searchQuery?: string } | null;
    if (state?.searchQuery) {
      setQuery(state.searchQuery);
      setActiveCategory('Tümü');
    }
  }, [location.state]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    // Dizideki orijinal sıra tiebreaker olarak kullanılır: diziye en son eklenen = en yeni
    return BLOG_POSTS
      .map((post, idx) => ({ post, idx }))
      .filter(({ post }) => {
        const matchCategory = activeCategory === 'Tümü' || post.category === activeCategory;
        if (!matchCategory) return false;
        if (!q) return true;
        return (
          post.title.toLowerCase().includes(q) ||
          post.description.toLowerCase().includes(q) ||
          post.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        // Tarih azalan (yeni → eski); eşitse dizideki index azalan (sonra eklenen üstte)
        const cmp = b.post.date.localeCompare(a.post.date);
        return cmp !== 0 ? cmp : b.idx - a.idx;
      })
      .map(({ post }) => post);
  }, [query, activeCategory]);

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO
        title="Blog — Vize Rehberleri ve İpuçları | VizeAkıl"
        description="Schengen, ABD, Almanya ve düzinelerce ülke için vize başvuru rehberleri, ret sebepleri, belge listeleri ve uzman ipuçları. Güncel ve SEO dostu içerikler."
        canonical="/blog"
        schema={SCHEMA}
      />

      {/* ── Üst navigasyon ── */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Ana sayfaya dön
          </Link>
        </div>
      </div>

      {/* ── Hero + Arama (animated) ── */}
      <div className="bg-gradient-to-b from-brand-700 to-brand-600 overflow-hidden relative">
        {/* Decorative floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 0.06, x: 0 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="absolute top-8 left-[10%] text-white"
          >
            <Plane className="w-16 h-16 rotate-[-20deg]" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.05, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="absolute bottom-12 right-[8%] text-white"
          >
            <Globe className="w-24 h-24" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.04, scale: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="absolute top-1/2 right-[25%] text-white"
          >
            <Stamp className="w-20 h-20 rotate-12" />
          </motion.div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 mb-5"
          >
            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="text-white/80 font-semibold text-sm uppercase tracking-wider">
              VizeAkıl Blog
            </span>
            <span className="ml-auto text-white/60 text-xs">
              {BLOG_POSTS.length} yazı
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-display font-bold text-white mb-2 leading-tight"
          >
            Vize Rehberleri & İpuçları
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-brand-100 text-base max-w-2xl leading-relaxed mb-8"
          >
            Schengen, ABD, Almanya ve daha fazlası için güncel rehberler.
            Belge listeleri, ret sebepleri, başarılı başvuru stratejileri.
          </motion.p>

          {/* ── Arama kutusu ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative max-w-2xl"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ülke, konu veya anahtar kelime ara… (örn: Almanya banka)"
              className="w-full pl-12 pr-12 py-4 border-0 rounded-2xl text-sm bg-white shadow-xl focus:outline-none focus:ring-2 focus:ring-brand-300 transition-all text-slate-800 placeholder:text-slate-400"
              autoComplete="off"
            />
            {query ? (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all"
                aria-label="Aramayı temizle"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md pointer-events-none">
                ⌘K
              </div>
            )}
          </motion.div>

          {/* Hızlı etiketler */}
          {!query && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-2 mt-3"
            >
              <span className="text-xs text-white/50 self-center mr-1">Popüler:</span>
              {['Schengen', 'Almanya', 'banka ekstresi', 'niyet mektubu', 'ret itirazı', 'randevu'].map(tag => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="px-3 py-1 text-xs font-medium bg-white/15 text-white rounded-full hover:bg-white/25 transition-colors border border-white/20"
                >
                  {tag}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* ── Visa Stats Strip (scroll-triggered) ── */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8">
            {VISA_STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                  <stat.icon className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-xs text-slate-500">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Kategori filtreleri (sticky) ── */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-0.5">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                  activeCategory === cat
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
                {activeCategory === cat && activeCategory !== 'Tümü' && (
                  <span className="ml-1.5 opacity-70">
                    {BLOG_POSTS.filter(p => p.category === cat).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── İçerik ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* Sonuç sayısı + hızlı sıfırla */}
        {(query || activeCategory !== 'Tümü') && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-slate-500">
              {filtered.length > 0 ? (
                <><strong className="text-slate-800">{filtered.length}</strong> yazı bulundu
                {query && <> — "<span className="italic text-brand-600">{query}</span>"</>}</>
              ) : (
                'Arama sonucu bulunamadı.'
              )}
            </p>
            <button
              onClick={() => { setQuery(''); setActiveCategory('Tümü'); }}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-3 h-3" /> Filtreyi Kaldır
            </button>
          </div>
        )}

        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Search className="w-7 h-7 text-slate-400" />
            </div>
            <h2 className="text-lg font-bold text-slate-700 mb-2">Sonuç bulunamadı</h2>
            <p className="text-slate-500 text-sm max-w-xs mx-auto mb-5">
              Farklı anahtar kelimeler deneyin veya popüler konulara göz atın.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {['Schengen', 'Almanya', 'ABD', 'banka', 'niyet mektubu', 'ret itirazı'].map(t => (
                <button
                  key={t}
                  onClick={() => { setQuery(t); setActiveCategory('Tümü'); }}
                  className="px-3 py-1.5 bg-brand-50 text-brand-700 border border-brand-100 rounded-full text-xs font-semibold hover:bg-brand-100 transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>
            <button
              onClick={() => { setQuery(''); setActiveCategory('Tümü'); }}
              className="px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors"
            >
              Tüm Yazıları Göster
            </button>
          </motion.div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post, idx) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: (idx % 3) * 0.08 }}
              >
                <Link
                  to={`/blog/${post.slug}`}
                  className="group bg-white rounded-2xl border border-slate-200 hover:border-brand-300 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col h-full"
                >
                  {/* Kategori bandı */}
                  <div className="h-1.5 bg-brand-600 w-full" />

                  <div className="p-6 flex flex-col flex-1">
                    {/* Kategori + okuma süresi */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColor(post.category)}`}>
                        <Tag className="w-3 h-3" />
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readingTime} dk
                      </span>
                    </div>

                    {/* Başlık */}
                    <h2 className="text-base font-bold text-slate-900 group-hover:text-brand-700 transition-colors leading-snug mb-2 flex-1">
                      {post.title}
                    </h2>

                    {/* Açıklama */}
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 mb-4">
                      {post.description}
                    </p>

                    {/* Etiketler */}
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {post.tags.slice(0, 3).map((tag) => (
                          <button
                            key={tag}
                            onClick={(e) => { e.preventDefault(); setQuery(tag); setActiveCategory('Tümü'); }}
                            className="text-[10px] px-2 py-0.5 bg-slate-50 border border-slate-200 text-slate-500 rounded-full hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 transition-colors"
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Alt satır: tarih + oku */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
                      <span className="text-xs text-slate-400">{formatDate(post.date)}</span>
                      <span className="flex items-center gap-1 text-xs font-semibold text-brand-600 group-hover:gap-2 transition-all">
                        Oku <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* ── Visa-themed CTA section (scroll-triggered) ── */}
        {filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="mt-16 relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 p-8 sm:p-12 text-center"
          >
            {/* Decorative elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <motion.div
                initial={{ opacity: 0, x: -60 }}
                whileInView={{ opacity: 0.08, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="absolute -left-4 top-1/2 -translate-y-1/2"
              >
                <Plane className="w-32 h-32 text-white rotate-[-15deg]" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 0.06, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="absolute -right-6 -bottom-6"
              >
                <Globe className="w-40 h-40 text-white" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, rotate: -30 }}
                whileInView={{ opacity: 0.07, rotate: 12 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute right-[20%] top-4"
              >
                <Stamp className="w-16 h-16 text-white" />
              </motion.div>
            </div>

            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-white/80" />
                  <span className="text-xs font-medium text-white/90">Profilini analiz et</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-white mb-3">
                  Vize başvurun ne kadar güçlü?
                </h3>
                <p className="text-sm text-white/70 max-w-md mx-auto mb-6 leading-relaxed">
                  AI motorumuz profilini 6 boyutta analiz eder, zayıf noktalarını tespit eder ve
                  skor artırma stratejileri önerir.
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 bg-white text-brand-700 font-semibold px-6 py-3 rounded-xl text-sm hover:bg-brand-50 transition-colors shadow-lg"
                >
                  Ücretsiz Analiz Yap
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
}
