"use client";

import React from "react";
import { Smartphone, Zap, Bell, Mic, ArrowRight, Star, CheckCircle2 } from "lucide-react";

// Widget ekran mockup'ı
function WidgetMockup() {
  return (
    <div className="relative flex flex-col gap-3 w-full max-w-xs mx-auto select-none">
      {/* Ana Widget - Geniş (4x2) */}
      <div
        className="w-full rounded-2xl p-4 flex items-center gap-4 shadow-xl border border-white/10"
        style={{
          background: "linear-gradient(135deg, #070E1A 0%, #0D2137 100%)",
          boxShadow: "0 8px 32px rgba(7,14,26,0.45)",
        }}
      >
        {/* Sol: Marka + metin */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
              <span className="text-[8px] font-black text-white">K</span>
            </div>
            <span className="text-xs font-bold text-white tracking-tight">KararOS</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
          </div>
          <p className="text-[10px] text-slate-400 leading-snug">
            Sesli harcama karar sorgusu
          </p>
          <div className="mt-2 flex items-center gap-1.5">
            <div className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/30">
              <span className="text-[9px] font-bold text-emerald-400">🔥 3 Günlük Seri</span>
            </div>
          </div>
        </div>
        {/* Sağ: Mikrofon butonu */}
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg"
          style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
        >
          <Mic className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Küçük Widget (2x2) */}
      <div className="flex gap-3">
        <div
          className="flex-1 rounded-2xl p-3 flex flex-col items-center justify-center gap-1 shadow-lg border border-white/5"
          style={{ background: "linear-gradient(135deg, #0D1F2D, #0a192f)" }}
        >
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
            <Bell className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-[9px] font-bold text-slate-300 text-center leading-tight">Proaktif Uyarı</span>
          <span className="text-[8px] text-slate-500 text-center">Harcama öncesi</span>
        </div>

        <div
          className="flex-1 rounded-2xl p-3 flex flex-col items-center justify-center gap-1 shadow-lg border border-white/5"
          style={{ background: "linear-gradient(135deg, #0D1F2D, #0a192f)" }}
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-[9px] font-bold text-slate-300 text-center leading-tight">Hızlı Karar</span>
          <span className="text-[8px] text-slate-500 text-center">1 dokunuş</span>
        </div>

        <div
          className="flex-1 rounded-2xl p-3 flex flex-col items-center justify-center gap-1 shadow-lg border border-white/5"
          style={{ background: "linear-gradient(135deg, #0D1F2D, #0a192f)" }}
        >
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
            <Star className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-[9px] font-bold text-slate-300 text-center leading-tight">Günlük Seri</span>
          <span className="text-[8px] text-slate-500 text-center">Takip et</span>
        </div>
      </div>

      {/* Bildirim kartı */}
      <div
        className="w-full rounded-2xl px-4 py-3 flex items-center gap-3 shadow-lg border border-slate-700/50"
        style={{ background: "rgba(13,33,55,0.9)", backdropFilter: "blur(12px)" }}
      >
        <div className="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center border border-amber-500/25 shrink-0">
          <Bell className="w-4 h-4 text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-white leading-tight">
            "Sony Kulaklık ₺3.200" almak üzeresin
          </p>
          <p className="text-[9px] text-emerald-400 font-medium mt-0.5">
            KararOS → Bütçen elverişli ✓
          </p>
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    icon: Mic,
    color: "emerald",
    title: "Sesli Harcama Sorgula",
    desc: "Ana ekranda widget'a basıp sesle \"Kulaklık almalı mıyım?\" dersen KararOS anında değerlendirip yanıtlar.",
  },
  {
    icon: Bell,
    color: "blue",
    title: "Proaktif Uyarı Sistemi",
    desc: "Uygulamayı açmana gerek yok. Widget, dürtüsel harcama anında doğrudan bildirimle seni uyarır.",
  },
  {
    icon: Zap,
    color: "violet",
    title: "1 Dokunuşla Karar",
    desc: "Uygulama yüklemesi bekleme. Kilit ekranından bile anlık kararını sorgulayabilirsin.",
  },
];

export function WidgetSection() {
  return (
    <section
      id="widget"
      className="relative py-20 sm:py-28 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #f8fafc 0%, #0B2345 18%, #070E1A 60%, #0B2345 100%)",
      }}
    >
      {/* Arka plan dekor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Eyebrow */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Android Widget · Ana Ekranda Her Zaman Hazır</span>
          </div>
        </div>

        {/* Başlık */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Uygulamayı açmana<br />
            <span className="text-emerald-400">gerek bile yok.</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            KararOS widget'ı, ana ekranında seni proaktif olarak izler.
            Sesli komutla, tek dokunuşla — harcama kararın nerede olursan ol yanında.
          </p>
        </div>

        {/* Grid: Sol özellikler + Sağ mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Sol: Özellikler */}
          <div className="flex flex-col gap-6 order-2 lg:order-1">
            {features.map((f, i) => {
              const Icon = f.icon;
              const colorMap: Record<string, { bg: string; border: string; text: string }> = {
                emerald: { bg: "bg-emerald-500/15", border: "border-emerald-500/30", text: "text-emerald-400" },
                blue: { bg: "bg-blue-500/15", border: "border-blue-500/30", text: "text-blue-400" },
                violet: { bg: "bg-violet-500/15", border: "border-violet-500/30", text: "text-violet-400" },
              };
              const c = colorMap[f.color];
              return (
                <div
                  key={i}
                  className="flex gap-4 p-5 rounded-2xl border border-white/8 hover:border-white/15 transition-all group"
                  style={{ background: "rgba(13, 33, 55, 0.6)", backdropFilter: "blur(8px)" }}
                >
                  <div className={`w-11 h-11 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                    <Icon className={`w-5 h-5 ${c.text}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">{f.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              );
            })}

            {/* Proof badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              {[
                { text: "Android 12+ Destekli", icon: CheckCircle2 },
                { text: "Kilitsiz Ekran Erişimi", icon: CheckCircle2 },
                { text: "Arka Plan Çalışmaz — Pil Dostu", icon: CheckCircle2 },
              ].map((b) => (
                <div key={b.text} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-xs font-medium">
                  <b.icon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{b.text}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <a
              href="#urun-demo"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-[#0B2345] bg-emerald-400 hover:bg-emerald-300 shadow-lg hover:shadow-emerald-400/30 transition-all self-start mt-1"
            >
              <span>Ürün Demosunu İncele</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Sağ: Widget Mockup */}
          <div className="order-1 lg:order-2 flex items-center justify-center">
            <div className="relative">
              {/* Hale efekti */}
              <div className="absolute -inset-8 bg-emerald-500/10 rounded-3xl blur-2xl pointer-events-none" />
              <div className="relative p-4">
                <WidgetMockup />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
