"use client";

import React from "react";
import { AlertTriangle, Clock, BrainCircuit } from "lucide-react";

// A visual "thought bubble" showing what users go through before KararOS
function DecisionAnxietyCard() {
  return (
    <div className="product-card p-6">
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
        Karar Anındaki Zihinsel Yük
      </p>
      <div className="space-y-2.5">
        {[
          { q: "Bu ay daha ne kadar harcama yapabilirim?", color: "text-slate-600" },
          { q: "Bu alım tasarruf planımı bozar mı?", color: "text-slate-600" },
          { q: "Aylık kira + fatura sonrası ne kalıyor?", color: "text-slate-600" },
          { q: "Al mı, bekle mi, vazgeç mi?", color: "text-slate-700 font-semibold" },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-300 text-sm font-black mt-0.5">?</span>
            <span className={`text-xs leading-snug ${item.color}`}>{item.q}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 font-medium">
        Bu soruları genellikle <span className="text-red-600 font-bold">sezgisel olarak</span> cevaplarız.
      </div>
    </div>
  );
}

export function ProblemSection() {
  const painPoints = [
    {
      icon: Clock,
      tag: "Öngörü Yok",
      tagStyle: "bg-red-50 text-red-700 border-red-200",
      iconBg: "bg-red-50 text-red-600 border-red-100",
      title: "Karardan önce etkisini görmenin yolu yok",
      desc: "Banka ekranları ne harcandığını gösterir. Fakat 'şimdi bu alımı yapsam ay sonunda planım nasıl değişir?' sorusu yanıtsız kalır.",
    },
    {
      icon: BrainCircuit,
      tag: "Bağlantı Kopuk",
      tagStyle: "bg-amber-50 text-amber-700 border-amber-200",
      iconBg: "bg-amber-50 text-amber-600 border-amber-100",
      title: "Tasarruf hedefi ile günlük harcama arasındaki köprü yok",
      desc: "Ay başında bir tasarruf planı yapılır, ama küçük kararların bu planı nasıl aşındırdığı ancak ay sonunda fark edilir.",
    },
    {
      icon: AlertTriangle,
      tag: "Geç Fark Edilme",
      tagStyle: "bg-orange-50 text-orange-700 border-orange-200",
      iconBg: "bg-orange-50 text-orange-600 border-orange-100",
      title: "Yanlış kararın bedeli ay sonuna kadar görünmüyor",
      desc: "Kümülatif küçük harcamaların etkisi ancak yetersiz bakiye veya aşılan bütçeyle yüzleşildiğinde anlaşılır; iş işten geçmiştir.",
    },
  ];

  return (
    <section id="problem-solution" className="py-20 md:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* Left column: narrative + pain cards */}
          <div className="lg:col-span-7">
            <div className="eyebrow bg-red-50 text-red-700 border border-red-200 mb-5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Mevcut Durum Problemi</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B2345] tracking-tight leading-tight mb-5">
              Finans uygulamaları geçmişi gösteriyor. Karar anı hâlâ belirsiz.
            </h2>

            <p className="text-base text-slate-600 leading-relaxed mb-4">
              Bankalar ve bütçe uygulamaları elimizdeki paranın nereye gittiğini raporlar. Ancak günlük hayatta asıl kritik soru harcama yapılmadan önce gelir:
            </p>

            <div className="p-5 rounded-2xl bg-slate-900 text-white mb-8">
              <span className="text-xs font-bold text-slate-400 block mb-2">Her gün milyonlarca kez sorulan soru:</span>
              <p className="text-xl sm:text-2xl font-black text-white leading-snug">
                "Bu harcamayı bugün yaparsam ay sonu planım nasıl değişir?"
              </p>
            </div>

            {/* 3 pain-point rows */}
            <div className="space-y-4">
              {painPoints.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="product-card p-5 flex items-start gap-4"
                  >
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${item.iconBg}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <h3 className="text-sm font-bold text-[#0B2345]">{item.title}</h3>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                    </div>
                    <span className={`shrink-0 self-start text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.tagStyle}`}>
                      {item.tag}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right column: visual "decision anxiety" card */}
          <div className="lg:col-span-5 flex flex-col gap-5">

            <DecisionAnxietyCard />

            {/* Typical user behavior breakdown */}
            <div className="product-card p-6">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4">
                Mevcut Alternatifler & Neden Yetersiz
              </p>
              <div className="space-y-3">
                {[
                  { method: "Banka ekranına bakmak", problem: "Geçmişi gösterir, geleceği göstermez" },
                  { method: "Excel / not defteri", problem: "Manuel giriş yorucu, sürdürülemez" },
                  { method: "Sezgisel karar", problem: "Tutarsız, duygusal, takipsiz" },
                  { method: "Bütçe uygulamaları", problem: "Raporlar ancak karar anında desteklemez" },
                ].map((r, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-black shrink-0 mt-0.5">
                      ✕
                    </span>
                    <div>
                      <p className="font-bold text-slate-800">{r.method}</p>
                      <p className="text-slate-500">{r.problem}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bridge statement */}
            <div className="rounded-2xl bg-emerald-600 text-white p-5">
              <p className="text-xs font-bold text-emerald-200 uppercase tracking-wider mb-1">
                KararOS bu boşluğu kapatıyor
              </p>
              <p className="text-sm font-bold leading-snug">
                Karar anında, serbest bütçe ve tasarruf hedefini bilen, sonucu simüle eden ve kararı takip eden bir karar destek altyapısı.
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
