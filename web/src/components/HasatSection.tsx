"use client";

import React from "react";
import { Network, Trophy, CheckCircle, ArrowRight } from "lucide-react";

export function HasatSection() {
  return (
    <section className="py-20 md:py-28 bg-emerald-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-10" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div>
            <div className="eyebrow bg-emerald-800 text-emerald-300 border border-emerald-600 mb-5">
              <Network className="w-3.5 h-3.5" />
              <span>Pazar Doğrulaması & Ekosistem</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-6">
              Sadece bir fikir değil, canlı ve test edilmiş bir ürün.
            </h2>
            <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed mb-8">
              KararOS, kağıt üzerinde kalan bir proje olmanın ötesine geçerek teknoloji ekosisteminde kendini kanıtlamıştır. Katıldığımız kuluçka ve hızlandırma programlarıyla (HASAT vb.) sürekli evrilmeye devam ediyoruz.
            </p>
            
            <div className="space-y-4">
              {[
                "MVP uygulaması uçtan uca yazıldı ve APK olarak cihazlarda test edildi.",
                "Yapay zeka iddiaları arkasına saklanılmadan, %100 deterministik ve açıklanabilir Karar Motoru oluşturuldu.",
                "Backend mimarisi kurumsal .NET 9 standartlarında hazırlandı ve bulut ortamında canlıya alındı.",
                "Yatırıma hazır, temiz mimari (Clean Architecture) ile yazılmış ölçeklenebilir bir altyapı tasarlandı."
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-1 shrink-0 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                  <p className="text-sm text-emerald-50 leading-relaxed font-medium">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="glass-navy p-8 rounded-3xl border border-emerald-700/50 shadow-2xl text-center">
              <Trophy className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-2xl font-black text-white mb-2">Büyüme Yolculuğu</h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-8">
                Teknopark İstanbul HASAT ve benzeri prestijli kuluçka programlarıyla pazar vizyonumuzu genişletiyor, teknik kapasitemizi mentorluk ağı ile birleştirerek ürünümüzü açık pazara hazırlıyoruz.
              </p>
              
              <a 
                href="#iletisim"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-emerald-900 text-sm font-black hover:bg-emerald-50 transition-colors"
              >
                Yatırımcı ve Partner İletişimi
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
