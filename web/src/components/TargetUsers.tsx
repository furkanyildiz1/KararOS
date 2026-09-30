"use client";

import React from "react";
import { Users, User, UserPlus, Target } from "lucide-react";

const personas = [
  {
    icon: User,
    color: "bg-blue-50 text-blue-700 border-blue-200",
    title: "Sabit Gelirli Genç Profesyoneller",
    subtitle: "Aylık maaş, net hedefler",
    pain: "Maaşın yatmasıyla ilk hafta rahat harcama yapıp, ayın son iki haftası nakit sıkışıklığı çekmek.",
    usecase: "Herhangi bir keyfi harcama (kahve, dışarıda yemek, giyim) öncesi KararOS'a sorarak 'bu alım beni ay sonunda zorlar mı?' sorusunu gidermek.",
  },
  {
    icon: Target,
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    title: "Tasarruf Hedefi Olanlar",
    subtitle: "Araba peşinatı, tatil, teknoloji",
    pain: "Birikim hedefine sadık kalmaya çalışırken, karşılaşılan cazip fırsatlar karşısında hedefin ne kadar etkileneceğini görememek.",
    usecase: "KararOS'un 'Tasarruf Güvencesi' metriğine bakarak, yapılacak alımın tasarruf hedefinden çalıp çalmadığını anında görmek.",
  },
  {
    icon: UserPlus,
    color: "bg-amber-50 text-amber-700 border-amber-200",
    title: "Dürtüsel Harcama Eğilimi",
    subtitle: "Kampanya ve indirim odaklı",
    pain: "Sosyal medya ve e-ticaret sitelerindeki aciliyet hissiyle (fomo) anlık kararlar alıp sonradan pişman olmak.",
    usecase: "KararOS'un '48 Saat Ertele' butonunu bir dürtü soğutucu olarak kullanmak. KararOS iki gün sonra hatırlattığında alım kararını mantıkla yeniden değerlendirmek.",
  },
];

export function TargetUsers() {
  return (
    <section className="py-20 md:py-28 bg-slate-50 relative border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="eyebrow bg-slate-200 text-slate-700 border border-slate-300 mb-5 mx-auto w-fit">
            <Users className="w-3.5 h-3.5" />
            <span>Erken Aşama Hedef Kitle (Early Adopters)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B2345] tracking-tight leading-tight mb-4">
            Kimin için tasarlandı?
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            KararOS, detaylı muhasebe tutmak isteyenler için değil, günlük hayatın hızında finansal kararlarının etkisini görmek isteyenler içindir.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {personas.map((p, i) => {
            const Icon = p.icon;
            return (
              <div key={i} className="product-card p-6 md:p-8 flex flex-col h-full hover:-translate-y-1 transition-transform duration-300">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border mb-6 ${p.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                
                <h3 className="text-lg font-black text-[#0B2345] mb-1">{p.title}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">{p.subtitle}</p>
                
                <div className="space-y-5 flex-1">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      Problem
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{p.pain}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      KararOS Çözümü
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{p.usecase}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
