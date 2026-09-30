"use client";

import React from "react";
import { ServerCog, GitMerge, FileCode2, ShieldCheck, Zap } from "lucide-react";

const engineFeatures = [
  {
    icon: GitMerge,
    title: "Deterministik Karar Ağacı",
    desc: "KararOS bir 'kara kutu' yapay zeka değildir. Kurallar açıktır ve neden belirli bir risk seviyesi çıktığı her zaman kullanıcıya açıklanabilir.",
  },
  {
    icon: FileCode2,
    title: "Bağımsız Formüller",
    desc: "Motor; gelir, sabit gider ve tasarruf hedefini girdi olarak alır. Günlük esneklik ve pay kullanım oranını %100 matematiksel netlikle hesaplar.",
  },
  {
    icon: ShieldCheck,
    title: "Önyargısız Analiz",
    desc: "Uygulama senin harcama tercihlerini yargılamaz. Sadece 'Bu alım bütçene sığıyor mu?' sorusuna objektif matematiksel yanıt verir.",
  },
];

export function DecisionEngineSection() {
  return (
    <section className="py-20 md:py-28 bg-[#0B2345] text-white relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-900/20 to-transparent pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-900/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT: Text & Features */}
          <div>
            <div className="eyebrow bg-emerald-900/50 text-emerald-400 border border-emerald-500/30 mb-5">
              <ServerCog className="w-3.5 h-3.5" />
              <span>Açıklanabilir Karar Motoru</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-6 text-white">
              Kararlar şeffaftır, <span className="text-emerald-400">"Kara Kutu"</span> yoktur.
            </h2>
            <p className="text-base text-slate-300 leading-relaxed mb-10">
              Finansal kararlar güven gerektirir. Bu yüzden KararOS, anlaşılmaz yapay zeka modelleri yerine, 
              sonucu her zaman açıklanabilir olan güçlü bir deterministik kural motoru kullanır. 
              Sana asla nedenini açıklayamadığı bir "yapma" tavsiyesi vermez.
            </p>

            <div className="space-y-6">
              {engineFeatures.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-100 mb-1">{f.title}</h4>
                      <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Code / Logic Visual */}
          <div className="relative">
            <div className="glass-navy rounded-3xl p-6 shadow-2xl border border-slate-700/50">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-700/50">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <p className="text-xs font-mono text-slate-400">DecisionEngine.cs</p>
              </div>
              
              <div className="font-mono text-xs sm:text-sm text-slate-300 overflow-x-auto">
                <pre className="!bg-transparent !p-0 !m-0">
<span className="text-blue-400">public</span> <span className="text-emerald-300">DecisionResult</span> <span className="text-amber-200">Evaluate</span>(
  <span className="text-emerald-300">Purchase</span> <span className="text-slate-100">item</span>, 
  <span className="text-emerald-300">Budget</span> <span className="text-slate-100">state</span>) 
{`{`}
  <span className="text-slate-500">// 1. Mevcut serbest payı hesapla</span>
  <span className="text-blue-400">var</span> freeBudget = state.Income 
    - state.FixedExpenses 
    - state.SavingsTarget;

  <span className="text-slate-500">// 2. Alım sonrası projeksiyon</span>
  <span className="text-blue-400">var</span> projected = freeBudget - item.Amount;
  <span className="text-blue-400">var</span> remainingDays = <span className="text-blue-300">Math</span>.Max(1, 30 - item.Day);

  <span className="text-slate-500">// 3. Açıklanabilir risk analizi</span>
  <span className="text-purple-400">if</span> (projected &lt; 0) 
    <span className="text-purple-400">return</span> <span className="text-blue-300">RiskLevel</span>.High(<span className="text-orange-300">"Tasarruf etkilenir"</span>);

  <span className="text-blue-400">var</span> usageRatio = item.Amount / freeBudget;
  <span className="text-purple-400">if</span> (usageRatio &gt; <span className="text-amber-300">0.48m</span>) 
    <span className="text-purple-400">return</span> <span className="text-blue-300">RiskLevel</span>.Medium(<span className="text-orange-300">"Esneklik daralır"</span>);

  <span className="text-purple-400">return</span> <span className="text-blue-300">RiskLevel</span>.Low(<span className="text-orange-300">"Bütçe dengeli"</span>);
{`}`}
                </pre>
              </div>

              {/* Floating execution badge */}
              <div className="absolute -bottom-5 -right-5 glass-white rounded-xl p-3 sm:p-4 shadow-xl border border-slate-200 flex items-center gap-3 animate-float">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">İşlem Süresi</p>
                  <p className="text-sm font-black text-[#0B2345]">{'< 15ms'}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
