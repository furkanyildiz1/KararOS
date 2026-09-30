"use client";

import React from "react";
import { User, Linkedin, Github, Mail } from "lucide-react";

export function AboutSection() {
  return (
    <section id="hakkimizda" className="py-20 md:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          <div>
            <div className="eyebrow bg-slate-100 text-slate-700 border border-slate-200 mb-5">
              <User className="w-3.5 h-3.5" />
              <span>Kurucu & Hikaye</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B2345] tracking-tight leading-tight mb-6">
              Kişisel bir ihtiyaçtan doğan, mühendislik ürünü.
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>
                KararOS'un hikayesi basit bir farkındalıkla başladı: Maaş yattıktan sonra yapılan harcamaların kümülatif etkisini, ancak ay sonunda banka ekstresine baktığımızda anlıyoruz.
              </p>
              <p>
                Excel tabloları çok yorucu, geleneksel bütçe uygulamaları ise sadece geçmişi raporluyordu. "Kararı almadan önce etkisini görebileceğim bir simülatöre ihtiyacım var" düşüncesi KararOS'un temelini attı.
              </p>
              <p>
                Furkan Yıldız tarafından tek kişilik bir girişim (Solo Founder) olarak başlatılan KararOS, şu anda kuluçka hedefleri doğrultusunda MVP aşamasını tamamlamış, sağlam bir .NET ve React Native mimarisi üzerinde çalışan bir teknoloji girişimidir.
              </p>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="product-card p-6 sm:p-8 max-w-sm w-full">
              <h3 className="text-lg font-black text-[#0B2345] mb-1">Furkan Yıldız</h3>
              <p className="text-sm text-emerald-600 font-bold mb-4">Kurucu & Yazılım Mühendisi</p>
              
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                .NET ve React ekosistemlerine odaklanan tam zamanlı yazılım geliştirici. KararOS'un mimarisinden ürün vizyonuna kadar tüm süreçlerini yönetiyor.
              </p>

              <div className="flex gap-3">
                <a 
                  href="https://www.linkedin.com/in/furkany%C4%B1ld%C4%B1z1/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors border border-slate-200"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a 
                  href="https://github.com/furkanyildiz1" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors border border-slate-200"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
