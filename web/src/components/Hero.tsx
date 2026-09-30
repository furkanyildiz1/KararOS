"use client";

import React from "react";
import { ArrowRight, ArrowUpRight, CheckCircle2, Sparkles, TrendingUp, Zap } from "lucide-react";

// Live animated decision scenario preview inside the phone mockup
function PhoneDecisionCard() {
  return (
    <div className="phone-frame animate-float" style={{ maxWidth: 300 }}>
      <div className="phone-screen bg-slate-50 text-slate-900">

        {/* Status bar */}
        <div className="flex items-center justify-between px-5 pt-3 pb-2 text-[10px] font-semibold text-slate-500">
          <span>09:41</span>
          <span className="font-bold text-[#0B2345] text-xs">KararOS</span>
          <span>%94 🔋</span>
        </div>

        {/* Top greeting */}
        <div className="px-5 pt-1 pb-3 border-b border-slate-200/70">
          <p className="text-[11px] text-slate-400 font-medium">Merhaba Furkan 👋</p>
          <p className="text-sm font-bold text-[#0B2345] mt-0.5">Bir karar mı alıyorsun?</p>
        </div>

        {/* Scenario */}
        <div className="p-4 space-y-3">

          {/* Item card */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Alınmak İstenen</span>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Elektronik</span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900">Kablosuz Kulaklık</p>
                <p className="text-[11px] text-slate-500">Ayın 18. günü • 12 gün kaldı</p>
              </div>
              <p className="text-lg font-black text-[#0B2345]">₺3.200</p>
            </div>
          </div>

          {/* KararOS Analysis */}
          <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-2xl p-3.5 border border-emerald-200">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">KararOS Analizi</span>
            </div>

            <p className="text-xs font-bold text-emerald-950 leading-snug mb-3">
              "Bu harcama bütçeni zorlamıyor ancak ay sonuna kalan paya dikkat."
            </p>

            {/* Mini metric bars */}
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[9px] font-semibold text-slate-600 mb-1">
                  <span>Serbest Pay Kullanımı</span>
                  <span>%42</span>
                </div>
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "42%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[9px] font-semibold text-slate-600 mb-1">
                  <span>Tasarruf Hedefi Güvencesi</span>
                  <span>%100</span>
                </div>
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "100%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Verdict badge */}
          <div className="verdict-low rounded-xl px-3 py-2.5 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <p className="text-[11px] font-bold text-emerald-900">DÜŞÜK RİSK — Bütçen elverişli</p>
          </div>

          {/* Action row */}
          <div className="grid grid-cols-3 gap-1.5">
            <button className="py-2 rounded-xl bg-emerald-600 text-white text-[10px] font-black shadow-sm">
              Şimdi Al
            </button>
            <button className="py-2 rounded-xl bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
              Ertele
            </button>
            <button className="py-2 rounded-xl bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
              Vazgeç
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">

      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F0F7FF] via-white to-[#F0FFF4] pointer-events-none" />
      <div className="absolute inset-0 bg-grid opacity-70 pointer-events-none" />

      {/* Large ambient blobs */}
      <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-emerald-200/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">

          {/* ── LEFT: Narrative ── */}
          <div className="lg:col-span-7 flex flex-col items-start">

            {/* Eyebrow */}
            <div className="eyebrow bg-emerald-50 text-emerald-800 border border-emerald-200 mb-6 animate-fade-in-up">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Yeni Nesil Finansal Karar Desteği</span>
            </div>

            {/* Main headline — product narrative first */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] mb-5 animate-fade-in-up delay-100">
              <span className="text-[#0B2345]">Bir şeyi almadan önce<br /></span>
              <span className="relative inline-block mt-1">
                <span className="relative z-10 text-emerald-700">bütçene etkisini gör.</span>
                <span className="absolute -bottom-1 left-0 w-full h-3 bg-emerald-200/60 rounded -z-0" />
              </span>
            </h1>

            {/* Narrative pitch */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mb-4 animate-fade-in-up delay-200">
              Karar vermeden önce o kararın bütçene ve tasarruf hedefinize etkisini simüle eder. Sonucu takip eder. Ve zamanla seni daha iyi kararlar almaya götürür.
            </p>

            {/* 4-Step flow inline */}
            <div className="flex items-center gap-2 mb-8 animate-fade-in-up delay-300">
              {["SOR", "SEÇ", "TAKİP ET", "ÖĞREN"].map((step, i) => (
                <React.Fragment key={step}>
                  <span className="px-3 py-1 rounded-lg bg-[#0B2345] text-white text-[11px] font-black tracking-wide">
                    {step}
                  </span>
                  {i < 3 && (
                    <span className="text-emerald-600 font-bold text-sm">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-10 animate-fade-in-up delay-400">
              <a
                href="#urun-demo"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-black text-white bg-[#159653] hover:bg-[#117E45] shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Simülatörü Dene</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#nasil-calisir"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold text-[#0B2345] bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm transition-all"
              >
                <span>Nasıl Çalışır?</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </a>
            </div>

            {/* Product status proof badges */}
            <div className="w-full animate-fade-in-up delay-500">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                Doğrulanmış Mühendislik Durumu
              </p>
              <div className="flex flex-wrap gap-2.5">
                {[
                  { text: "MVP Tamamlandı", dot: "bg-emerald-500" },
                  { text: ".NET 9 Backend Canlı", dot: "bg-emerald-500" },
                  { text: "APK Test Aşaması", dot: "bg-blue-400" },
                  { text: "18/18 Test Başarılı", dot: "bg-emerald-500" },
                ].map((b) => (
                  <div
                    key={b.text}
                    className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl shadow-xs text-xs font-semibold text-slate-700"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${b.dot} animate-pulse`} />
                    <span>{b.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Phone Mockup ── */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end gap-4 relative animate-fade-in delay-300">

            {/* Floating context card above phone */}
            <div className="glass-white rounded-2xl px-4 py-3 shadow-lg border border-slate-200/60 flex items-center gap-3 self-center lg:self-start animate-fade-in-up delay-400">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 text-lg">
                🤔
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold">Kullanıcı Sorusu</p>
                <p className="text-xs font-bold text-slate-900">"Bu kulaklığı almalı mıyım?"</p>
              </div>
            </div>

            <PhoneDecisionCard />

            {/* Floating result card below phone */}
            <div className="glass-white rounded-2xl px-4 py-3 shadow-lg border border-emerald-200/70 flex items-center gap-3 self-center lg:self-end animate-fade-in-up delay-600">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-700" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold">KararOS Simülasyonu</p>
                <p className="text-xs font-bold text-emerald-900">Karar senin — etki görünür.</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
