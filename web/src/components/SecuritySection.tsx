"use client";

import React from "react";
import { ShieldCheck, Lock, EyeOff, FileText } from "lucide-react";

export function SecuritySection() {
  return (
    <section className="py-20 md:py-28 bg-[#0B2345] text-white relative border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="eyebrow bg-blue-900/50 text-blue-300 border border-blue-500/30 mb-5 mx-auto w-fit">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Güvenlik ve Gizlilik</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-4 text-white">
            Finansal verin sadece sana aittir.
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            KararOS, verilerini reklam verenlere satmaz. KVKK standartlarına tam uyumlu altyapımızla, verilerin şifrelenir ve anonimleştirilir.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="glass-navy p-8 rounded-2xl flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">Modern Şifreleme</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Tüm veri trafiği HTTPS/TLS 1.3 ile korunur. Şifrelerin Bcrypt ile hashlenerek saklanır; biz dahil kimse şifreni göremez. Kimlik doğrulama için endüstri standardı JWT kullanılır.
            </p>
          </div>

          <div className="glass-navy p-8 rounded-2xl flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mb-6">
              <EyeOff className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">Sıfır İzleme, Sıfır Reklam</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Uygulama içinde davranışsal reklam profillemesi yapılmaz. KararOS bir reklam platformu değil, senin kişisel finansal asistanındır. Kararların sadece sana hizmet eder.
            </p>
          </div>

          <div className="glass-navy p-8 rounded-2xl flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center mb-6">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">KVKK Tam Uyum</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Veri tabanımızdaki veriler KVKK ilkelerine uygun olarak işlenir. Hesabını sildiğinde, seninle ilişkilendirilebilecek tüm veriler kalıcı olarak sistemlerimizden silinir (Hard Delete).
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
