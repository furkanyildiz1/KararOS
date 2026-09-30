"use client";

import React from "react";
import {
  HelpCircle,
  SlidersHorizontal,
  CheckSquare,
  BrainCircuit,
  RefreshCw,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    num: "01",
    key: "SOR",
    icon: HelpCircle,
    headline: "Bu harcamayı yapmalı mıyım?",
    scenario: {
      label: "Kullanıcı giriyor",
      fields: [
        { k: "Ürün", v: "Kablosuz Kulaklık" },
        { k: "Tutar", v: "₺3.200" },
        { k: "Kategori", v: "Elektronik" },
        { k: "Gün", v: "Ayın 18'i" },
      ],
    },
    color: { ring: "ring-blue-500/20", icon: "bg-blue-50 text-blue-600 border-blue-100", tag: "bg-blue-100 text-blue-800" },
  },
  {
    num: "02",
    key: "SEÇ",
    icon: SlidersHorizontal,
    headline: "Alternatiflerin etkisini gör.",
    scenario: {
      label: "KararOS simüle ediyor",
      fields: [
        { k: "Şimdi Al", v: "₺2.800 kalır" },
        { k: "Ertele 1 ay", v: "₺6.000 kalır" },
        { k: "Vazgeç", v: "₺6.000 → hedefe eklenir" },
      ],
    },
    color: { ring: "ring-emerald-500/20", icon: "bg-emerald-50 text-emerald-600 border-emerald-100", tag: "bg-emerald-100 text-emerald-800" },
  },
  {
    num: "03",
    key: "TAKİP ET",
    icon: CheckSquare,
    headline: "Kararın sonucunu kaydet.",
    scenario: {
      label: "Kullanıcı günceller",
      fields: [
        { k: "Seçim", v: "Alındı ✓" },
        { k: "Tarih", v: "18 Eylül" },
        { k: "Etki", v: "Beklendiği gibi" },
        { k: "Birikim", v: "Dokunulmadı" },
      ],
    },
    color: { ring: "ring-amber-500/20", icon: "bg-amber-50 text-amber-600 border-amber-100", tag: "bg-amber-100 text-amber-800" },
  },
  {
    num: "04",
    key: "ÖĞREN",
    icon: BrainCircuit,
    headline: "Davranış örüntülerin ortaya çıkıyor.",
    scenario: {
      label: "KararOS içgörü üretiyor",
      fields: [
        { k: "Gözlem", v: "Elektronik: 4 kez ORTA risk" },
        { k: "Örüntü", v: "Ayın 15+ sonrası alımlar riskli" },
        { k: "Öneri", v: "Sonraki ay eşik düşürüldü" },
      ],
    },
    color: { ring: "ring-purple-500/20", icon: "bg-purple-50 text-purple-600 border-purple-100", tag: "bg-purple-100 text-purple-800" },
  },
];

export function DecisionLoop() {
  return (
    <section id="nasil-calisir" className="py-20 md:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="eyebrow bg-emerald-50 text-emerald-800 border border-emerald-200 mb-5 mx-auto w-fit">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Kapalı Karar Döngüsü</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B2345] tracking-tight leading-tight mb-4">
            Sor{" "}
            <span className="text-emerald-600">→</span>{" "}
            Seç{" "}
            <span className="text-emerald-600">→</span>{" "}
            Takip Et{" "}
            <span className="text-emerald-600">→</span>{" "}
            Öğren
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            KararOS yalnızca tek seferlik bir hesap makinesi değildir. Her karar seni bir sonrakine daha iyi hazırlar.
          </p>
        </div>

        {/* 4-step grid with mini mockups */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className={`product-card p-5 relative ring-1 ${step.color.ring} flex flex-col`}
              >
                {/* Step number */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[11px] font-black px-2.5 py-1 rounded-lg ${step.color.tag}`}>
                    {step.key}
                  </span>
                  <span className="text-2xl font-black text-slate-100">{step.num}</span>
                </div>

                {/* Icon */}
                <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center mb-3 ${step.color.icon}`}>
                  <Icon className="w-5 h-5" />
                </div>

                {/* Headline */}
                <h3 className="text-sm font-black text-[#0B2345] mb-3 leading-snug">
                  {step.headline}
                </h3>

                {/* Mini scenario card */}
                <div className="mt-auto rounded-xl bg-slate-50 border border-slate-100 p-3">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    {step.scenario.label}
                  </p>
                  <div className="space-y-1.5">
                    {step.scenario.fields.map((f, fi) => (
                      <div key={fi} className="flex justify-between text-[11px]">
                        <span className="text-slate-500 font-medium">{f.k}</span>
                        <span className="font-bold text-slate-800 text-right max-w-[60%] leading-tight">{f.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Closed loop explanation banner */}
        <div className="rounded-3xl bg-gradient-to-r from-[#0B2345] to-[#133566] text-white p-7 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-2xl font-black shrink-0">
              ∞
            </div>
            <div>
              <h4 className="text-base font-bold text-white mb-1">
                Kapalı Döngü: Her karar seni bir sonrakine hazırlar
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
                Geleneksel bütçelemede her ay sıfırdan başlanır. KararOS'ta geçmiş kararların davranış örüntüleri gelecekteki simülasyonları kalibre eder.
              </p>
            </div>
          </div>
          <a
            href="#urun-demo"
            className="shrink-0 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-black transition flex items-center gap-2 shadow-sm"
          >
            Simülatörde Dene
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
}
