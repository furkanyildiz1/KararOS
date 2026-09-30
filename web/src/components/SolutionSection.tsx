"use client";

import React from "react";
import { Sparkles, MessageSquare } from "lucide-react";

// Mini chat-style before/after mockup
function ChatBubble({ side, text, tag }: { side: "left" | "right"; text: string; tag?: string }) {
  return (
    <div className={`flex ${side === "right" ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[85%]">
        {tag && (
          <span className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1 px-1">
            {tag}
          </span>
        )}
        <div
          className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed font-medium shadow-xs ${
            side === "right"
              ? "bg-[#0B2345] text-white rounded-tr-sm"
              : "bg-white text-slate-800 border border-slate-200 rounded-tl-sm"
          }`}
        >
          {text}
        </div>
      </div>
    </div>
  );
}

function TraditionalApp() {
  return (
    <div className="product-card p-5">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
        <div className="w-7 h-7 rounded-lg bg-slate-200 flex items-center justify-center text-slate-600">
          <span className="text-xs font-black">B</span>
        </div>
        <div>
          <p className="text-[11px] font-bold text-slate-800">Geleneksel Bütçe Uygulaması</p>
          <p className="text-[9px] text-slate-400">Geçmiş Odaklı Görünüm</p>
        </div>
      </div>

      <div className="space-y-3">
        <ChatBubble
          side="right"
          text="Bu kulaklığı alsam bütçemi etkiler mi?"
          tag="Kullanıcı"
        />
        <ChatBubble
          side="left"
          text="Geçen ay Elektronik kategorisinde 4.200 ₺ harcandı."
          tag="Bütçe Uygulaması"
        />
        <ChatBubble side="right" text="Peki ya bu ay?" />
        <div className="flex justify-start">
          <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-[10px] text-slate-400 italic border border-slate-200">
            Mevcut ay verisi henüz tamamlanmadı...
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100">
        <p className="text-[10px] text-red-600 font-bold">Sonuç: Kullanıcı yine sezgisel karar vermek zorunda.</p>
      </div>
    </div>
  );
}

function KararOSApp() {
  return (
    <div className="product-card p-5 border-emerald-200/60 ring-2 ring-emerald-100/80">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
        {/* Brand icon */}
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-[#0B2345] flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white">
            <path d="M12 6V18M12 12L17 7M12 12L17 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <p className="text-[11px] font-bold text-slate-800">KararOS</p>
          <p className="text-[9px] text-emerald-700 font-semibold">Karar Anı Simülasyonu</p>
        </div>
        <span className="ml-auto text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
          Canlı
        </span>
      </div>

      <div className="space-y-3">
        <ChatBubble
          side="right"
          text="₺3.200'lük kulaklık alsam ne olur?"
          tag="Kullanıcı"
        />
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl rounded-tl-sm px-3.5 py-3 border border-emerald-200/70">
          <p className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider mb-1.5">
            KararOS Simülasyonu
          </p>
          <p className="text-[11px] font-bold text-emerald-950 leading-snug mb-2">
            "Serbest bütçenizin %42'sini kullanır. Tasarruf hedefiniz etkilenmez. Ay sonuna 2.800 ₺ kalır."
          </p>
          <div className="grid grid-cols-3 gap-1.5 text-center text-[9px]">
            <div className="bg-white rounded-lg p-1.5 border border-emerald-100">
              <p className="font-black text-emerald-900">%42</p>
              <p className="text-slate-500">Pay Kullanım</p>
            </div>
            <div className="bg-white rounded-lg p-1.5 border border-emerald-100">
              <p className="font-black text-emerald-900">%100</p>
              <p className="text-slate-500">Hedef Güvende</p>
            </div>
            <div className="bg-white rounded-lg p-1.5 border border-emerald-100">
              <p className="font-black text-[#0B2345]">₺2.800</p>
              <p className="text-slate-500">Ay Sonu Bakiye</p>
            </div>
          </div>
        </div>
        <ChatBubble side="right" text="Tamam, alıyorum." />
        <div className="bg-slate-50 rounded-2xl px-3 py-2 border border-slate-100 text-[10px] text-slate-500">
          ✓ Karar kaydedildi. Ay sonunda sonucu göreceksin.
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-emerald-100">
        <p className="text-[10px] text-emerald-700 font-bold">Sonuç: Bilinçli karar — etki görünür, karar kullanıcıda.</p>
      </div>
    </div>
  );
}

export function SolutionSection() {
  return (
    <section className="py-20 md:py-28 bg-slate-50 relative border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="eyebrow bg-emerald-100 text-emerald-800 border border-emerald-300/60 mb-5 mx-auto w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            <span>KararOS Farkı</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B2345] tracking-tight leading-tight mb-4">
            Karar vermeden önce sonucu görünür kılan finansal karar desteği.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Geleneksel araçlar geçmişi raporlar. KararOS ise geliri, sabit giderleri, tasarruf hedefini ve planlanan harcamayı birlikte değerlendirerek kararı simüle eder.
          </p>
        </div>

        {/* Side-by-side chat comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              Geleneksel Yaklaşım
            </div>
            <TraditionalApp />
          </div>

          <div>
            <div className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              KararOS Yaklaşımı
            </div>
            <KararOSApp />
          </div>
        </div>

        {/* Core philosophy banner */}
        <div className="rounded-3xl bg-[#0B2345] text-white p-8 sm:p-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-400/25 flex items-center justify-center text-2xl shrink-0">
            💡
          </div>
          <div>
            <h3 className="text-lg font-black text-white mb-2">
              Temel Fark: Raporlama değil — Karar Döngüsü
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              KararOS sana "Bunu alma" demiyor. Sadece "Alırsan şu olur, ertelersen şu olur" diyor. Karar her zaman sende.
              <span className="text-emerald-400 font-bold"> Finansal özerkliği koruyarak öngörü sağlamak.</span>
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
