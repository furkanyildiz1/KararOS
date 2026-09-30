"use client";

import React, { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import {
  Sparkles,
  CheckCircle,
  AlertTriangle,
  AlertOctagon,
  RotateCcw,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Scenario {
  name: string;
  category: string;
  amount: number;
  dayOfMonth: number;
  emoji: string;
}

const PRESETS: Scenario[] = [
  { name: "Kablosuz Kulaklık", category: "Elektronik", amount: 3200, dayOfMonth: 18, emoji: "🎧" },
  { name: "Hafta Sonu Tatili", category: "Seyahat", amount: 14500, dayOfMonth: 12, emoji: "✈️" },
  { name: "Akşam Yemeği (2 Kişi)", category: "Yeme & İçme", amount: 950, dayOfMonth: 24, emoji: "🍽️" },
  { name: "Spor Ayakkabısı", category: "Giyim", amount: 4200, dayOfMonth: 8, emoji: "👟" },
];

// Simulated budget profile for demo
const PROFILE = {
  monthlyIncome: 45000,
  fixedExpenses: 22000,
  savingsGoal: 10000,
  alreadySpent: 4500,
};
const INITIAL_FREE = PROFILE.monthlyIncome - PROFILE.fixedExpenses - PROFILE.savingsGoal;
const AVAILABLE = Math.max(0, INITIAL_FREE - PROFILE.alreadySpent); // 8500

function getRisk(amount: number, available: number, remainingDays: number) {
  const projected = available - amount;
  const ratio = amount / (available || 1);
  const dailyAfter = projected / Math.max(1, remainingDays);

  if (projected < 0) {
    return {
      level: "HIGH" as const,
      label: "Yüksek Risk",
      sublabel: "Tasarruf etkilenebilir",
      verdict: `Bu alım serbest bütçenizi ${formatCurrency(Math.abs(projected))} aşıyor ve tasarruf hedefinize dokunuyor.`,
      style: "verdict-high",
      icon: AlertOctagon,
      iconColor: "text-red-600",
      barColor: "bg-red-500",
      barWidth: Math.min(100, Math.round(ratio * 100)),
    };
  }
  if (ratio > 0.48 || (dailyAfter < 150 && remainingDays > 10)) {
    return {
      level: "MEDIUM" as const,
      label: "Dikkat",
      sublabel: "Kısıtlı esneklik",
      verdict: `Bu alım serbest payınızın %${Math.round(ratio * 100)}'ini kullanır. Ay sonuna kalan ${remainingDays} günde günlük esneklik daralır.`,
      style: "verdict-medium",
      icon: AlertTriangle,
      iconColor: "text-amber-600",
      barColor: "bg-amber-500",
      barWidth: Math.min(100, Math.round(ratio * 100)),
    };
  }
  return {
    level: "LOW" as const,
    label: "Düşük Risk",
    sublabel: "Bütçen dengeli",
    verdict: `Bu harcama serbest payınızın %${Math.round(ratio * 100)}'ini kullanır. Tasarruf hedefiniz %100 korunur.`,
    style: "verdict-low",
    icon: CheckCircle,
    iconColor: "text-emerald-600",
    barColor: "bg-emerald-500",
    barWidth: Math.min(100, Math.round(ratio * 100)),
  };
}

export function ProductDemo() {
  const [selected, setSelected] = useState<Scenario>(PRESETS[0]);
  const [amount, setAmount] = useState(PRESETS[0].amount);
  const [day, setDay] = useState(PRESETS[0].dayOfMonth);
  const [action, setAction] = useState<null | "BOUGHT" | "POSTPONED" | "CANCELLED">(null);
  const [showExplain, setShowExplain] = useState(false);

  const remaining = Math.max(1, 30 - day);
  const projected = AVAILABLE - amount;
  const risk = getRisk(amount, AVAILABLE, remaining);
  const VerdictIcon = risk.icon;

  function applyPreset(p: Scenario) {
    setSelected(p);
    setAmount(p.amount);
    setDay(p.dayOfMonth);
    setAction(null);
    setShowExplain(false);
  }

  return (
    <section id="urun-demo" className="py-20 md:py-28 bg-slate-50 relative border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="eyebrow bg-blue-50 text-blue-800 border border-blue-200 mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Canlı Simülatör</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B2345] tracking-tight leading-tight mb-4">
            Satın almadan önce etkisini gör.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Aşağıdaki simülatör KararOS'un gerçek karar motoru mantığını yansıtır. Bir senaryo seç ya da tutarı kaydır.
          </p>
        </div>

        {/* Preset chips */}
        <div className="flex flex-wrap gap-2.5 mb-8">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => applyPreset(p)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold border transition-all ${
                selected.name === p.name
                  ? "bg-[#0B2345] text-white border-[#0B2345] shadow-sm"
                  : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <span>{p.emoji}</span>
              <span>{p.name}</span>
              <span className={`text-[10px] font-semibold ${selected.name === p.name ? "text-emerald-300" : "text-slate-400"}`}>
                ({formatCurrency(p.amount)})
              </span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ── LEFT INPUT PANEL ── */}
          <div className="lg:col-span-5 product-card p-6 sm:p-7">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black text-[#0B2345]">Karar Parametreleri</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Canlı
              </span>
            </div>

            {/* Budget profile snapshot */}
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 mb-5 space-y-2 text-xs">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                Bütçe Profilin
              </p>
              {[
                { k: "Aylık Net Gelir", v: formatCurrency(PROFILE.monthlyIncome), c: "" },
                { k: "Sabit Giderler", v: `−${formatCurrency(PROFILE.fixedExpenses)}`, c: "text-red-600" },
                { k: "Aylık Tasarruf Hedefi", v: `−${formatCurrency(PROFILE.savingsGoal)}`, c: "text-red-600" },
                { k: "Harcanan (bu ay)", v: `−${formatCurrency(PROFILE.alreadySpent)}`, c: "text-slate-500" },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-slate-500">{r.k}</span>
                  <span className={`font-bold ${r.c || "text-slate-800"}`}>{r.v}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-slate-200 flex justify-between">
                <span className="font-bold text-slate-800">Mevcut Serbest Pay</span>
                <span className="font-black text-[#0B2345]">{formatCurrency(AVAILABLE)}</span>
              </div>
            </div>

            {/* Amount slider */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-700">{selected.emoji} {selected.name}</label>
                <span className="text-sm font-black text-[#0B2345]">{formatCurrency(amount)}</span>
              </div>
              <input
                type="range"
                min={200}
                max={25000}
                step={100}
                value={amount}
                onChange={(e) => { setAmount(Number(e.target.value)); setAction(null); }}
                className="w-full accent-[#159653] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1">
                <span>₺200</span>
                <span>₺25.000</span>
              </div>
            </div>

            {/* Day slider */}
            <div className="mb-2">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-700">Ayın Kaçı?</label>
                <span className="text-xs font-black text-slate-700">
                  Ayın {day}. günü ({remaining} gün kaldı)
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={29}
                value={day}
                onChange={(e) => { setDay(Number(e.target.value)); setAction(null); }}
                className="w-full accent-[#0B2345] cursor-pointer"
              />
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => applyPreset(PRESETS[0])}
                className="text-[11px] font-bold text-slate-500 hover:text-[#0B2345] flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Sıfırla
              </button>
            </div>
          </div>

          {/* ── RIGHT OUTPUT PANEL ── */}
          <div className="lg:col-span-7 product-card p-6 sm:p-7 flex flex-col gap-5">

            {/* Verdict header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                  KararOS Değerlendirmesi
                </p>
                <h4 className="text-xl font-black text-[#0B2345]">
                  {selected.emoji} {selected.name}
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">{selected.category} • {formatCurrency(amount)}</p>
              </div>
              <div className={`px-4 py-2 rounded-2xl border text-xs font-black flex items-center gap-2 ${risk.style}`}>
                <VerdictIcon className={`w-4 h-4 ${risk.iconColor}`} />
                <div>
                  <p>{risk.label}</p>
                  <p className="font-medium opacity-75">{risk.sublabel}</p>
                </div>
              </div>
            </div>

            {/* Impact visualization */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                Etki Görselleştirme
              </p>

              {/* Before / after bars */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                    <span>Mevcut Serbest Pay</span>
                    <span className="font-black">{formatCurrency(AVAILABLE)}</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "100%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                    <span>Alımdan Sonra Kalan Pay</span>
                    <span className={`font-black ${projected < 0 ? "text-red-600" : ""}`}>
                      {projected >= 0 ? formatCurrency(projected) : `−${formatCurrency(Math.abs(projected))}`}
                    </span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${risk.barColor}`}
                      style={{ width: `${Math.max(0, 100 - risk.barWidth)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* 3-metric grid */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-center">
                  <p className="text-[10px] text-slate-500 font-semibold mb-1">Harcama Oranı</p>
                  <p className={`text-lg font-black ${risk.barWidth > 70 ? "text-red-600" : risk.barWidth > 45 ? "text-amber-600" : "text-emerald-700"}`}>
                    %{Math.min(100, risk.barWidth)}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-center">
                  <p className="text-[10px] text-slate-500 font-semibold mb-1">Tasarruf Hedefi</p>
                  <p className={`text-lg font-black ${projected < 0 ? "text-red-600" : "text-emerald-700"}`}>
                    {projected < 0 ? "Risk ⚠" : "%100 ✓"}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-center">
                  <p className="text-[10px] text-slate-500 font-semibold mb-1">Günlük Esneklik</p>
                  <p className={`text-lg font-black ${projected < 0 ? "text-red-600" : ""}`}>
                    {projected >= 0 ? formatCurrency(Math.round(projected / remaining)) : "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Expandable explanation */}
            <div className="rounded-2xl bg-emerald-50/60 border border-emerald-200/60 overflow-hidden">
              <button
                onClick={() => setShowExplain(!showExplain)}
                className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-emerald-900 hover:bg-emerald-50 transition-colors"
              >
                <span>Neden böyle düşünüyoruz?</span>
                {showExplain ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {showExplain && (
                <div className="px-4 pb-4 space-y-2 animate-fade-in">
                  {[
                    `Bu harcama (${formatCurrency(amount)}), mevcut serbest payınızın %${Math.min(100, risk.barWidth)}'ini oluşturmaktadır.`,
                    `Ay sonuna kalan ${remaining} gün için günlük harcama kapasitesi ${projected >= 0 ? formatCurrency(Math.round(projected / remaining)) + " olacaktır" : "yetersiz kalacaktır"}.`,
                    projected >= 0
                      ? `${formatCurrency(PROFILE.savingsGoal)} TL aylık tasarruf hedefiniz bu alımdan etkilenmemektedir.`
                      : `Bu alım tasarruf hedefinizden ${formatCurrency(Math.abs(projected))} TL ödün vermenize neden olabilir.`,
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* User action row */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">
                Kararını Kaydet:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: "BOUGHT" as const, label: "Şimdi Alındı", style: "bg-slate-900 text-white border-slate-900" },
                  { key: "POSTPONED" as const, label: "⏳ 48 Saat Ertele", style: "bg-amber-100 text-amber-900 border-amber-300" },
                  { key: "CANCELLED" as const, label: `💰 Vazgeç (+${formatCurrency(amount)})`, style: "bg-emerald-100 text-emerald-900 border-emerald-300" },
                ].map((btn) => (
                  <button
                    key={btn.key}
                    onClick={() => setAction(btn.key)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      action === btn.key
                        ? btn.style + " ring-2 ring-offset-1 ring-current"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>

              {action === "CANCELLED" && (
                <div className="mt-3 p-3 rounded-xl bg-emerald-100 border border-emerald-200 text-xs font-bold text-emerald-900 animate-fade-in">
                  🎉 {formatCurrency(amount)} TL sanal tasarruf havuzuna eklendi. Birikimin büyüdü!
                </div>
              )}
              {action === "POSTPONED" && (
                <div className="mt-3 p-3 rounded-xl bg-amber-100 border border-amber-200 text-xs font-bold text-amber-900 animate-fade-in">
                  ⏳ 48 saatlik dürtü soğuma süresi başladı. KararOS seni iki gün sonra hatırlatacak.
                </div>
              )}
              {action === "BOUGHT" && (
                <div className="mt-3 p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 animate-fade-in">
                  ✓ Karar kaydedildi. Ay sonunda bütçe durumun güncellenecek.
                </div>
              )}
            </div>

            <p className="text-[10px] text-slate-400 border-t border-slate-100 pt-3">
              <strong>Ürün İlkesi:</strong> KararOS asla "Satın alma" diye emretmez.
              Sadece etkiyi görünür kılar — karar daima senin.
            </p>

          </div>

        </div>

      </div>
    </section>
  );
}
