// ============================================================
// TacticsStep — Kabul Oranı Taktikleri
// ============================================================
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, ArrowLeft, Info, Briefcase, Globe, Wallet, PenTool } from 'lucide-react';

interface Props {
  onNavigate: (step: string) => void;
}

export function TacticsStep({ onNavigate }: Props) {
  const setStep = onNavigate;
  return (
              <motion.div 
                key="tactics"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="flex items-center gap-6">
                  <button onClick={() => setStep('dashboard')} className="p-3 bg-white border border-slate-100 hover:bg-slate-50 rounded-2xl transition-all shadow-sm">
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                  <div>
                    <h2 className="text-4xl font-bold text-slate-900">Kabul Oranı Taktikleri</h2>
                    <p className="text-slate-500 text-lg">Sahadan 7 gizli taktik ile başvurunuzu profesyonelleştirin.</p>
                  </div>
                </div>
  
                <div className="grid grid-cols-1 gap-6">
                  {[
                    { 
                      icon: Wallet, 
                      title: "1. Banka Hesabı", 
                      desc: "Son 3 ay düzenli giriş-çıkış olmalı. Günlük harcama x gün sayısı + %30 fazla bakiye bulundurun. Son dakika yüklü para yatırmaktan kaçının.",
                      color: "blue"
                    },
                    { 
                      icon: Briefcase, 
                      title: "2. SGK + Maaş Bordrosu", 
                      desc: "İşveren izin yazısında mutlaka 'şu tarihte işe dönecek' ibaresi yer almalı. Bu, en güçlü bağlılık kanıdır.",
                      color: "green"
                    },
                    { 
                      icon: PenTool, 
                      title: "3. Niyet Mektubu", 
                      desc: "Maksimum 1 sayfa. 'Ne iş yapıyorum, ne kadar kazanıyorum, niye gidiyorum, masrafı nasıl karşılıyorum, ne zaman döneceğim' sorularını yanıtlayın.",
                      color: "violet"
                    },
                    { 
                      icon: Globe, 
                      title: "4. Seyahat Geçmişi", 
                      desc: "Pasaport boşsa ret riski yüksektir. Önce vizesiz Balkan veya Kafkas ülkelerine gidip seyahat geçmişi oluşturun.",
                      color: "indigo"
                    },
                    { 
                      icon: CheckCircle2, 
                      title: "5. Evrak Cross-Check", 
                      desc: "DS-160'daki iş adresiniz SGK ile aynı olmalı. Otel, uçak ve dilekçedeki tarihler 1 gün bile şaşmamalı.",
                      color: "emerald"
                    },
                    { 
                      icon: Info, 
                      title: "6. Mülakat", 
                      desc: "Kısa ve net cevaplar verin, göz teması kurun. 'Kalacak mısın?' sorusuna 'Hayır, şu tarihte işime dönmeliyim' diyerek kanıt sunun.",
                      color: "amber"
                    },
                    { 
                      icon: ShieldCheck, 
                      title: "7. Pasaport", 
                      desc: "Pasaportunuz yıpranmamış olmalı ve en az 1 yıl daha geçerlilik süresi bulunmalıdır.",
                      color: "slate"
                    }
                  ].map((tactic, i) => (
                    <motion.div 
                      key={`tactic-${i}`} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="group p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-500/5 transition-all flex gap-8 items-start"
                    >
                      <div className={`w-16 h-16 bg-${tactic.color}-50 rounded-[2rem] flex items-center justify-center text-${tactic.color}-600 shrink-0 group-hover:scale-110 transition-transform`}>
                        <tactic.icon className="w-8 h-8" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-bold text-xl text-slate-900">{tactic.title}</h3>
                        <p className="text-slate-500 leading-relaxed">{tactic.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
  
                <div className="p-10 bg-amber-600 rounded-[3rem] text-white flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl shadow-amber-900/20">
                  <div className="space-y-2 text-center lg:text-left">
                    <h4 className="text-2xl font-bold">Bu taktikleri uyguladınız mı?</h4>
                    <p className="text-amber-100 text-lg">Tüm adımları tamamladıysanız başvurunuz hazır demektir.</p>
                  </div>
                  <button 
                    onClick={() => setStep('dashboard')}
                    className="w-full lg:w-auto px-12 py-5 bg-white text-amber-600 rounded-2xl font-bold text-xl hover:bg-amber-50 transition-all shadow-xl"
                  >
                    Dashboard'a Dön
                  </button>
                </div>
              </motion.div>
  );
}
