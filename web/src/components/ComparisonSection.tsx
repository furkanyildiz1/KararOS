"use client";

import React from "react";
import { Check, ArrowRight, Sparkles } from "lucide-react";

const rows = [
  {
    feature: "Temel Soru",
    old: "Paramın nereye gittiği?",
    kararos: "Bu kararı alırsam ne olur?",
    highlight: true,
  },
  {
    feature: "Yaklaşım",
    old: "Geçmişi raporlamak (post-mortem)",
    kararos: "Karardan önce simüle etmek (pre-decision)",
    highlight: true,
  },
  {
    feature: "Veri Kullanımı",
    old: "Statik kategori raporları",
    kararos: "Kontekst duyarlı canlı simülasyon",
  },
  {
    feature: "Karar Takibi",
    old: "Tek seferlik ekstre",
    kararos: "Alındı / Ertelendi / Vazgeçildi takibi",
  },
  {
    feature: "Öğrenme",
    old: "Genel bütçe tavsiyeleri",
    kararos: "Kişisel davranış örüntülerine dayalı içgörü",
  },
  {
    feature: "Kullanıcı Özerkliği",
    old: "Kısıtlayıcı veya edilgen",
    kararos: "Karar kullanıcıda — KararOS sadece öngörü sağlar",
  },
];

export function ComparisonSection() {
  return (
    <section id="neden-kararos" className="py-20 md:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="max-w-3xl mb-14">
          <div className="eyebrow bg-emerald-50 text-emerald-800 border border-emerald-200 mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pazar Konumlandırması</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B2345] tracking-tight leading-tight mb-4">
            Bir bütçe uygulamasından çok daha fazlası.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            KararOS, mevcut finans araçlarıyla doğrudan rekabet etmez. Onların kapsamadığı karar anını yakalar.
          </p>
        </div>

        {/* Comparison table */}
        <div className="rounded-3xl border border-slate-200 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-5 px-6 text-xs font-bold uppercase tracking-widest text-slate-400 w-1/4 bg-slate-50">
                    Kriter
                  </th>
                  <th className="py-5 px-6 text-xs font-bold uppercase tracking-widest text-slate-400 w-[37.5%] bg-slate-50">
                    Geleneksel Araçlar
                  </th>
                  <th className="py-5 px-6 text-xs font-bold uppercase tracking-widest text-emerald-700 w-[37.5%] bg-emerald-50/60 border-l border-emerald-100">
                    KararOS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((row, i) => (
                  <tr
                    key={i}
                    className={`transition-colors ${row.highlight ? "bg-slate-50/50" : "hover:bg-slate-50/40"}`}
                  >
                    <td className="py-4 px-6 text-sm font-bold text-[#0B2345] align-top">
                      {row.feature}
                    </td>
                    <td className="py-4 px-6 align-top">
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                          ✕
                        </span>
                        <span className="text-sm text-slate-500">{row.old}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 bg-emerald-50/20 border-l border-emerald-100 align-top">
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3" />
                        </span>
                        <span className="text-sm font-semibold text-emerald-950">{row.kararos}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom callout */}
          <div className="bg-slate-900 text-white px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm font-semibold text-slate-200">
              KararOS'un farkı yalnızca geçmişi raporlamak değil,{" "}
              <span className="text-emerald-400 font-black">karar döngüsünü kapatmaktır.</span>
            </p>
            <a
              href="#teknoloji"
              className="shrink-0 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition flex items-center gap-2"
            >
              Teknolojiyi İncele
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
