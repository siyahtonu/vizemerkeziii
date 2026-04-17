import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">

            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-4 shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Info className="w-5 h-5 text-brand-600" />
                  <h3 className="text-lg font-bold text-slate-900">Yardım & Araç Rehberi</h3>
                </div>
                <p className="text-sm text-slate-500">VizeAkıl'ın tüm özelliklerini ve araçlarını keşfedin</p>
              </div>
              <button onClick={onClose} aria-label="Kapat"
                className="p-2 rounded-xl hover:bg-slate-100 transition-colors shrink-0">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 px-6 py-5 space-y-8">

              {/* Nasıl Çalışır */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Nasıl Çalışır?</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { step: '1', icon: '🌍', title: 'Ülke Seç', desc: 'Başvurmak istediğin ülkeyi ve vize tipini belirle' },
                    { step: '2', icon: '👤', title: 'Profil Oluştur', desc: 'Finansal, mesleki ve kişisel bilgilerini gir' },
                    { step: '3', icon: '📊', title: 'Skor Al', desc: 'Gerçek veriye dayalı onay tahmini ve risk analizi' },
                    { step: '4', icon: '🛠', title: 'Araçları Kullan', desc: '18+ araçla başvurunu güçlendir ve eksikleri gider' },
                  ].map(s => (
                    <div key={s.step} className="p-3 bg-slate-50 rounded-2xl text-center border border-slate-100">
                      <div className="text-2xl mb-1">{s.icon}</div>
                      <div className="text-xs font-bold text-slate-800 mb-0.5">{s.title}</div>
                      <div className="text-[10px] text-slate-500 leading-snug">{s.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skor Nasıl Hesaplanır */}
              <div className="p-4 bg-brand-50 border border-brand-100 rounded-2xl">
                <h4 className="text-sm font-bold text-brand-800 mb-2">Skor Nasıl Hesaplanır?</h4>
                <p className="text-xs text-brand-700 leading-relaxed">
                  Skor, 6 kategoride değerlendirme yapılarak hesaplanır: <strong>Finansal (25p)</strong>, <strong>Mesleki (20p)</strong>, <strong>Seyahat Geçmişi (20p)</strong>, <strong>Aile & Bağ (10p)</strong>, <strong>Amaç & Taahhüt (15p)</strong> ve <strong>Kalite & Güven (10p)</strong>. Toplam 100 puan üzerinden hesaplanan ham skor, ülkenin Türk başvurucular için gerçek ret oranıyla Bayes yöntemiyle harmanlanır. 82+ = yeşil, 65-81 = sarı, 65 altı = kırmızı risk bölgesi.
                </p>
              </div>

              {/* Ücretsiz Araçlar */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">ÜCRETSİZ — 9 araç</span>
                </div>
                <div className="space-y-2">
                  {[
                    { icon: '📊', name: 'Profil Skoru & Risk Analizi', desc: 'Ana ekran. 6 kategoride (finansal, mesleki, geçmiş, aile, amaç, kalite) profil skorunu hesapla. Schengen, UK ve ABD için ayrı kalibrasyon. Anlık kırmızı bayrak uyarıları.' },
                    { icon: '🗂', name: 'Evrak Listesi', desc: 'Başvuru tipine (çalışan, çalışmayan, öğrenci, reşit olmayan, sponsor) göre eksiksiz belge listesini görüntüle. UK ve Schengen ayrı listeler.' },
                    { icon: '🎭', name: 'Senaryo Simülatörü', desc: '"Bankamda 50K TL daha olsaydı skorum ne olurdu?" — slider ile hipotetik değişikliklerin skor etkisini anlık gör, hangi adımın en çok kazandıracağını ölç.' },
                    { icon: '✅', name: 'Belge Kontrol Listesi', desc: 'Profiline özel belge listesi oluşturur. Her belgeyi hazırladıkça tıkla — üstü çizilir, ilerleme çubuğu güncellenir. PDF olarak indir.' },
                    { icon: '🌍', name: 'Ülke Karşılaştırma Tablosu', desc: '10 hedef ülkeyi kart veya tablo görünümünde karşılaştır — kişisel tahmini onay oranı, zorluk seviyesi (Kolay→Çok Zor), randevu bekleme süresi.' },
                    { icon: '📅', name: 'Randevu Takip Botu', desc: 'VFS konsolosluklarını gerçek zamanlı izler. Almanya, Fransa, İngiltere, ABD vb. için slot açıldığında anında e-posta bildirimi gönderir.' },
                    { icon: '🔍', name: 'Belge Tutarlılık Matrisi', desc: 'Ad, adres, işveren, gelir ve tarih bilgilerinin tüm belgeler arasında tutarlı olup olmadığını kontrol eder. Çelişki varsa işaretler.' },
                    { icon: '🗺', name: 'Vizesiz Ülkeler', desc: 'Türk pasaportuyla vizesiz, e-vize veya kapıda vize ile gidebileceğin 80+ ülke. Bölgeye göre filtrele, en yüksek seyahat geçmişi katkısını olan ülkeleri öğren.' },
                    { icon: '📝', name: 'Niyet Mektubu Oluşturucu', desc: '4 farklı profesyonel mektup tipi — Başvuru Sahibi, Finansal Sponsor, İşveren İzin, Seyahat Planı. Bilgilerini gir, hem Türkçe hem İngilizce PDF indir.' },
                  ].map(t => (
                    <div key={t.name} className="flex gap-3 p-3 bg-white border border-slate-100 rounded-xl hover:border-slate-200 transition-colors">
                      <span className="text-xl shrink-0 mt-0.5">{t.icon}</span>
                      <div>
                        <div className="text-sm font-bold text-slate-800">{t.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">{t.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ücretsiz — Topluluk */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">ÜCRETSİZ — Topluluk & Analiz (2 araç)</span>
                </div>
                <div className="space-y-2">
                  {[
                    { icon: '🏆', name: 'Benchmark', desc: 'Senin gibi profildeki başvuru sahiplerinin onay/ret oranını ve en sık ret sebeplerini gösterir. Kendi başarı şansını karşılaştır.' },
                    { icon: '👥', name: 'Topluluk Deneyimleri', desc: 'Gerçek başvuruların sonuçları — hangi konsolosluk, ne kadar bekleme, hangi belgeler fark yarattı. Kendi deneyimini de ekle.' },
                  ].map(t => (
                    <div key={t.name} className="flex gap-3 p-3 bg-white border border-slate-100 rounded-xl hover:border-slate-200 transition-colors">
                      <span className="text-xl shrink-0 mt-0.5">{t.icon}</span>
                      <div>
                        <div className="text-sm font-bold text-slate-800">{t.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">{t.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Premium Araçlar */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">PREMİUM — 10 araç</span>
                </div>
                <div className="space-y-2">
                  {[
                    { icon: '🤖', name: 'Vize Danışmanım (AI Copilot)', desc: 'Yapay zeka destekli kişisel vize danışmanı. Profilini analiz eder, en kritik 3 adımı belirler, sorularını yanıtlar. Gemini 2.0 Flash ile çalışır.' },
                    { icon: '📊', name: 'Schengen Ülke Kıyaslayıcı', desc: 'Schengen ülkelerini 8 kriter üzerinde detaylı karşılaştır — TR ret oranı, ortalama bekleme, finansal eşik, randevu kolaylığı.' },
                    { icon: '💬', name: 'Ret Mektubu Analizi', desc: 'Elindeki ret mektubunu yapıştır. Hangi koddan reddedildiğini, ne kadar beklemen gerektiğini ve hangi belgeleri güçlendirmen gerektiğini öğren.' },
                    { icon: '🏦', name: 'AI Banka Dökümü Analizi', desc: 'Banka ekstrenini yükle veya rakamları gir, yapay zeka konsolosluk gözüyle değerlendirir. Son dakika mevduatı, düzensizlik, şüpheli hareketleri işaretler.' },
                    { icon: '🚩', name: 'Kırmızı Bayrak Tarayıcı', desc: 'Başvurmadan önce otomatik ret gerekçelerini tespit et — 12 farklı risk kategorisi, ciddiyet puanlaması ve her bayrak için aksiyon önerisi.' },
                    { icon: '📱', name: 'Sosyal Medya Denetim Rehberi', desc: 'LinkedIn, Instagram ve Twitter profillerindeki vize-riskli paylaşımları tespit et. "Yurt dışında iş arıyorum" gibi ifadeleri temizle.' },
                    { icon: '🧠', name: 'Mülakat Simülatörü', desc: 'ABD B1/B2 ve UK mülakat soruları için 78 soruluk interaktif simülatör. Cevapların puanlanır, zayıf noktalar işaretlenir, ipuçları verilir.' },
                    { icon: '🗺', name: 'Çoklu Ülke Planlayıcı', desc: 'Birden fazla ülkeyi aynı Schengen turunda gezerken optimum vize başvuru sırası ve strateji önerir. Hangi ülkeden başvurulacağını hesaplar.' },
                    { icon: '🔥', name: 'Ret Nedeni Haritası', desc: '2021-2026 gerçek ret kodları — Schengen (16 ülke), İngiltere ve ABD için ülke bazında görsel dağılım. En sık ret sebebi hangi ülkede hangisi?' },
                    { icon: '💰', name: 'Banka Hazırlık Planı', desc: 'Başvuruya kaç ay kaldı? Aylık hedef giriş/çıkış miktarlarını ve hesap aktivitesi grafiğini oluşturur. 28-gün UK kuralı için özel plan.' },
                  ].map(t => (
                    <div key={t.name} className="flex gap-3 p-3 bg-amber-50/50 border border-amber-100 rounded-xl">
                      <span className="text-xl shrink-0 mt-0.5">{t.icon}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-slate-800">{t.name}</span>
                          <span className="text-[9px] font-bold bg-amber-200 text-amber-700 px-1 py-0.5 rounded">PRO</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">{t.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sık Sorulan Sorular */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Sık Sorulan Sorular</h4>
                <div className="space-y-2">
                  {[
                    { q: 'Skor kaç olmalı ki başvurayım?', a: '70+ güvenli başvuru bölgesi, 82+ yüksek güven. 65 altında reddedilme riski yüksek — önce eksikleri gider.' },
                    { q: 'Bilgilerimi kaydediyor musunuz?', a: 'Hayır. Tüm veriler sadece tarayıcınızda (localStorage) tutulur, sunucumuza iletilmez.' },
                    { q: 'Veriler gerçek mi?', a: 'Evet. Schengen istatistikleri, Ekşi Sözlük, forum vakaları ve 50+ gerçek başvuru deneyimi analiz edildi. Yine de kesin sonuç garantisi verilmez.' },
                    { q: 'Randevu bildirimi gerçekten çalışıyor mu?', a: '/api/appointments/subscribe endpointine kayıt yaptırırsın. Sistem konsoloslukları periyodik tarayarak müsaitlik açıldığında e-posta gönderir.' },
                  ].map((faq, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="text-sm font-bold text-slate-800 mb-1">{faq.q}</div>
                      <div className="text-xs text-slate-500 leading-relaxed">{faq.a}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 shrink-0">
              <button onClick={onClose}
                className="w-full py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-colors">
                Anladım, Kapat
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
