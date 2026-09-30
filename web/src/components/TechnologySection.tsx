"use client";

import React from "react";
import { Code2, Server, Database, Smartphone, GitBranch } from "lucide-react";

export function TechnologySection() {
  return (
    <section id="teknoloji" className="py-20 md:py-28 bg-[#0B2345] text-white relative border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-3xl mb-16">
          <div className="eyebrow bg-blue-900/50 text-blue-300 border border-blue-500/30 mb-5">
            <Code2 className="w-3.5 h-3.5" />
            <span>Modern Teknoloji Yığını</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-4 text-white">
            Ölçeklenebilir, test edilmiş mimari.
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            MVP'miz "No-Code" araçlarla değil, kurumsal standartlarda Clean Architecture (Temiz Mimari) prensipleriyle sıfırdan yazılmıştır. Yatırıma ve hızla büyümeye hazırdır.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="glass-navy p-6 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-2">Mobil Frontend (İstemci)</h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-blue-400" /> React Native & Expo 57</li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-blue-400" /> TypeScript</li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-blue-400" /> Tailwind CSS (NativeWind)</li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-blue-400" /> Zustand (State Management)</li>
            </ul>
          </div>

          <div className="glass-navy p-6 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-2">Backend & Karar Motoru</h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-emerald-400" /> .NET 9 Web API</li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-emerald-400" /> C# 13 & Clean Architecture</li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-emerald-400" /> MediatR (CQRS Pattern)</li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-emerald-400" /> JWT tabanlı kimlik doğrulama</li>
            </ul>
          </div>

          <div className="glass-navy p-6 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-2">Veri Katmanı & Servisler</h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-amber-400" /> PostgreSQL</li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-amber-400" /> Entity Framework Core</li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-amber-400" /> Resend (E-posta / OTP)</li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-amber-400" /> Render (Cloud Hosting)</li>
            </ul>
          </div>

          <div className="glass-navy p-6 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
              <GitBranch className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-2">Kalite & DevOps</h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-purple-400" /> xUnit & Moq (Birim Testleri)</li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-purple-400" /> Expo Application Services (EAS)</li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-purple-400" /> Git (Sürüm Kontrolü)</li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-purple-400" /> Semantic Commits</li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
