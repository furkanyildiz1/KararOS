"use client";

import React from "react";
import { Milestone, Check, Clock, CircleDashed } from "lucide-react";

const roadmapData = [
  {
    phase: "Faz 1: Çekirdek (MVP)",
    status: "done",
    timeline: "2026 Q3",
    items: [
      "Mobil uygulama arayüzü ve navigasyon tasarımı",
      "Kullanıcı kimlik doğrulama altyapısı (JWT, OTP)",
      "Deterministik karar motorunun kodlanması ve testleri",
      ".NET 9 Backend API mimarisinin kurulması ve deploy edilmesi",
    ],
  },
  {
    phase: "Faz 2: Doğrulama & Beta",
    status: "active",
    timeline: "2026 Q4",
    items: [
      "Android cihazlarda kapalı beta testleri",
      "Kullanıcı geri bildirimleriyle UX optimizasyonu",
      "Sesli komut ile harcama senaryosu girişi (NLP)",
      "Performans ve güvenlik iyileştirmeleri",
    ],
  },
  {
    phase: "Faz 3: Lansman & Büyüme",
    status: "pending",
    timeline: "2027 Q1",
    items: [
      "Uygulama marketlerinde resmi lansman (App Store & Play Store)",
      "Kuluçka ve hızlandırma programı hedeflerinin gerçekleştirilmesi",
      "Freemium abonelik altyapısının devreye alınması",
      "Pazarlama kampanyaları ve kullanıcı edinimi",
    ],
  },
  {
    phase: "Faz 4: Zeka & Entegrasyon",
    status: "pending",
    timeline: "2027 Q2+",
    items: [
      "Makine öğrenimi destekli kişiselleştirilmiş içgörüler",
      "Banka API'leri ile açık bankacılık entegrasyonu",
      "E-ticaret siteleri için Checkout API geliştirilmesi",
      "Oyunlaştırma (Gamification) ve sosyal özellikler",
    ],
  }
];

export function Roadmap() {
  return (
    <section className="py-20 md:py-28 bg-slate-50 relative border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-3xl mb-16">
          <div className="eyebrow bg-slate-200 text-slate-700 border border-slate-300 mb-5">
            <Milestone className="w-3.5 h-3.5" />
            <span>Vizyon ve Yol Haritası</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B2345] tracking-tight leading-tight mb-4">
            Geleceği planladık, kodlamaya başladık.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Şu an MVP aşamasındayız, ancak mimarimizi ileride açık bankacılık ve yapay zeka entegrasyonlarını destekleyecek şekilde genişletilebilir kurguladık.
          </p>
        </div>

        <div className="space-y-6">
          {roadmapData.map((phase, i) => (
            <div 
              key={i} 
              className={`product-card p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-12 transition-all ${
                phase.status === 'active' ? 'ring-2 ring-blue-500/50 bg-blue-50/10' : ''
              }`}
            >
              <div className="md:w-1/4 shrink-0">
                <div className="flex items-center gap-2 mb-2">
                  {phase.status === 'done' && <Check className="w-4 h-4 text-emerald-500" />}
                  {phase.status === 'active' && <Clock className="w-4 h-4 text-blue-500 animate-pulse" />}
                  {phase.status === 'pending' && <CircleDashed className="w-4 h-4 text-slate-400" />}
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${
                    phase.status === 'done' ? 'text-emerald-600' :
                    phase.status === 'active' ? 'text-blue-600' : 'text-slate-400'
                  }`}>
                    {phase.timeline}
                  </span>
                </div>
                <h3 className="text-lg font-black text-[#0B2345]">{phase.phase}</h3>
              </div>
              
              <div className="md:w-3/4">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {phase.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <span className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${
                        phase.status === 'done' ? 'bg-emerald-500' :
                        phase.status === 'active' ? 'bg-blue-500' : 'bg-slate-300'
                      }`} />
                      <span className={`text-sm leading-relaxed ${
                        phase.status === 'done' ? 'text-slate-600' :
                        phase.status === 'active' ? 'text-slate-800 font-medium' : 'text-slate-500'
                      }`}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
