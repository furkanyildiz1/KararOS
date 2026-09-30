"use client";

import React from "react";
import { Briefcase, Key, Database, Sparkles, Building2 } from "lucide-react";

const revenueStreams = [
  {
    icon: Key,
    title: "Freemium (B2C)",
    desc: "Temel karar motoru ve aylık sınırlı senaryo simülasyonu ücretsizdir. Sınırsız senaryo, detaylı geçmiş analizi ve AI destekli kişisel içgörüler için Premium abonelik (Aylık/Yıllık) sunulur.",
    highlight: true
  },
  {
    icon: Database,
    title: "Anonimize Veri İçgörüleri (B2B)",
    desc: "Kullanıcıların KVKK kapsamında tamamen anonimleştirilmiş, trend bazlı 'karar anı' ve 'vazgeçme nedenleri' verileri, pazar araştırması için toplu içgörü raporları olarak sunulur.",
    highlight: false
  },
  {
    icon: Building2,
    title: "E-Ticaret Checkout Entegrasyonu",
    desc: "Uzun vadeli vizyonda, KararOS API'si e-ticaret sitelerinin ödeme adımlarına entegre edilerek, kullanıcının o siteden çıkmadan bütçe simülasyonu yapmasını sağlar.",
    highlight: false
  }
];

export function BusinessModel() {
  return (
    <section className="py-20 md:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-3xl mb-16">
          <div className="eyebrow bg-blue-50 text-blue-800 border border-blue-200 mb-5">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Gelir Modeli & Ölçeklenme</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B2345] tracking-tight leading-tight mb-4">
            Sürdürülebilir büyüme stratejisi.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            KararOS, kullanıcı güvenini merkeze alan ve veriyi asla 3. partilere satmayan şeffaf bir gelir modeline sahiptir. Monetizasyon, doğrudan kullanıcıya sunulan değer üzerinden şekillenir.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {revenueStreams.map((stream, i) => {
            const Icon = stream.icon;
            return (
              <div 
                key={i} 
                className={`product-card p-6 md:p-8 flex flex-col ${stream.highlight ? 'ring-2 ring-emerald-500/50 bg-emerald-50/10' : ''}`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${stream.highlight ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {stream.highlight && (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                      Faz 1
                    </span>
                  )}
                </div>
                
                <h3 className="text-lg font-black text-[#0B2345] mb-3">{stream.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed flex-1">{stream.desc}</p>
              </div>
            );
          })}
        </div>
        
        {/* Anti-pattern promise */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-900 flex flex-col sm:flex-row items-center gap-6 justify-between text-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
              <span className="text-red-400 font-bold text-xl">✕</span>
            </div>
            <div>
              <h4 className="font-bold text-slate-100 mb-1">Ne yapmıyoruz?</h4>
              <p className="text-sm text-slate-400">Kredi kartı satışı, komisyonlu kredi yönlendirmesi veya agresif reklam gösterimi KararOS modelinde yoktur.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
