"use client";

import React from "react";
import { Award, CheckCircle2, ArrowRight, Layers } from "lucide-react";

// Milestone timeline card — replaces old generic checkboxes
function MilestoneCard({
  icon,
  title,
  sub,
  status,
}: {
  icon: string;
  title: string;
  sub: string;
  status: "done" | "active" | "plan";
}) {
  const statusMap = {
    done:   { dot: "bg-emerald-500", pill: "bg-emerald-100 text-emerald-800 border-emerald-300", label: "Tamamlandı" },
    active: { dot: "bg-blue-400 animate-pulse", pill: "bg-blue-100 text-blue-800 border-blue-300", label: "Devam Ediyor" },
    plan:   { dot: "bg-slate-300", pill: "bg-slate-100 text-slate-600 border-slate-200", label: "Planlı" },
  };
  const s = statusMap[status];
  return (
    <div className="product-card p-5 flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-xl shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <p className="text-sm font-bold text-[#0B2345] leading-snug truncate">{title}</p>
          <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border ${s.pill}`}>
            {s.label}
          </span>
        </div>
        <p className="text-[11px] text-slate-500">{sub}</p>
      </div>
    </div>
  );
}

const milestones = [
  { icon: "🧠", title: "Problem & Kullanıcı Araştırması", sub: "Finansal karar belirsizliği doğrulandı", status: "done" as const },
  { icon: "📱", title: "Mobil MVP — React Native / Expo", sub: "TypeScript, Expo SDK 57, Clean Architecture", status: "done" as const },
  { icon: "⚙️", title: ".NET 9 Backend & Clean Architecture", sub: "ASP.NET Core Web API, PostgreSQL, EF Core", status: "done" as const },
  { icon: "🧮", title: "Açıklanabilir Karar Motoru v1", sub: "Deterministik kural motoru — 15 birim testi", status: "done" as const },
  { icon: "🔐", title: "Kimlik Doğrulama & E-posta Servisi", sub: "JWT, BCrypt, Resend API, OTP akışı", status: "done" as const },
  { icon: "🌐", title: "Canlı Sunucu Yayını", sub: "Render Cloud, HTTPS, .NET 9 production deploy", status: "done" as const },
  { icon: "🤖", title: "Sesli Karar Ayrıştırıcı", sub: "Türkçe NLP regex parser, expo-speech-recognition", status: "done" as const },
  { icon: "📦", title: "APK Cihaz Testi", sub: "EAS Build, fiziksel cihaz & emülatör testi", status: "active" as const },
  { icon: "👥", title: "Kapalı Beta & Kullanıcı Doğrulama", sub: "Hedef: 50+ pilot kullanıcı kohortu", status: "plan" as const },
];

export function TractionSection() {
  return (
    <section className="py-20 md:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="eyebrow bg-emerald-50 text-emerald-800 border border-emerald-200 mb-5">
            <Award className="w-3.5 h-3.5" />
            <span>Doğrulanmış Mühendislik Süreci</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B2345] tracking-tight leading-tight mb-4">
            Fikirden çalışan ürüne.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            KararOS sadece bir proje veya prototip değildir. Frontend, backend, veri tabanı ve karar motoru tamamen inşa edilmiş ve canlı ortamda test edilmiş çalışan bir MVP'dir.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* Left: scorecard + tech stack */}
          <div className="lg:col-span-4 flex flex-col gap-5">

            {/* 18/18 scorecard */}
            <div className="rounded-3xl bg-gradient-to-br from-[#0B2345] to-slate-900 text-white p-7 shadow-xl">
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2">
                Teknik Test Skoru
              </p>
              <div className="text-5xl font-black tracking-tight text-white mb-1">
                18 / 18
              </div>
              <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                15 Karar Motoru birim testi<br />
                3 Uçtan uca API entegrasyon testi
              </p>
              <div className="space-y-2">
                {[
                  { k: "Birim Testleri", v: "15/15", pct: 100 },
                  { k: "Entegrasyon Testleri", v: "3/3", pct: 100 },
                ].map((r) => (
                  <div key={r.k}>
                    <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-1">
                      <span>{r.k}</span>
                      <span>{r.v}</span>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${r.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Current phase */}
            <div className="product-card p-5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                Mevcut Aşama
              </p>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <p className="text-sm font-black text-[#0B2345]">APK Test & Kullanıcı Doğrulama</p>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Android APK cihaz testleri yürütülüyor. Kapalı beta kullanıcı grubuna geçiş planlanıyor.
              </p>
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                  <p className="text-slate-400 text-[10px] mb-0.5">Backend</p>
                  <p className="font-black text-emerald-700 text-[11px]">● Canlı / 7/24</p>
                </div>
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                  <p className="text-slate-400 text-[10px] mb-0.5">Mobil</p>
                  <p className="font-black text-blue-700 text-[11px]">● APK Test</p>
                </div>
              </div>
            </div>

            {/* Stack badges */}
            <div className="product-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Layers className="w-4 h-4 text-slate-500" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Teknik Altyapı</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["React Native","Expo","TypeScript",".NET 9","PostgreSQL","EF Core","Clean Arch","JWT","Render","Docker"].map((t) => (
                  <span key={t} className="text-[10px] font-bold px-2 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                    {t}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Right: milestone timeline */}
          <div className="lg:col-span-8 flex flex-col gap-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Tamamlanan ve Planlanan Geliştirme Aşamaları
            </p>
            {milestones.map((m, i) => (
              <MilestoneCard key={i} {...m} />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
