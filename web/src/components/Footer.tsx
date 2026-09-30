"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0B2345] text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          
          {/* Brand & Slogan (5 cols) */}
          <div className="md:col-span-5">
            <Logo size="lg" dark={true} className="mb-4" />
            <p className="text-sm font-semibold text-emerald-400 mb-4">
              “Bir şeyi almadan önce bütçene etkisini gör.”
            </p>
            <p className="text-xs text-slate-300 max-w-sm leading-relaxed mb-6">
              Yeni nesil kişisel finansal karar destek platformu. Harcamaların aylık bütçe ve tasarruf hedeflerine etkisini önceden görünür kılar.
            </p>
            <div className="text-[11px] text-slate-400">
              HASAT2026 & Teknopark Girişimi
            </div>
          </div>

          {/* Quick Navigation (3 cols) */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Navigasyon
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <a href="#hero" className="hover:text-emerald-400 transition-colors">
                  Ana Sayfa
                </a>
              </li>
              <li>
                <a href="#problem-solution" className="hover:text-emerald-400 transition-colors">
                  Problem & Çözüm
                </a>
              </li>
              <li>
                <a href="#nasil-calisir" className="hover:text-emerald-400 transition-colors">
                  Nasıl Çalışır?
                </a>
              </li>
              <li>
                <a href="#urun-demo" className="hover:text-emerald-400 transition-colors">
                  Ürün & Simülatör
                </a>
              </li>
              <li>
                <a href="#teknoloji" className="hover:text-emerald-400 transition-colors">
                  Teknoloji Altyapısı
                </a>
              </li>
              <li>
                <a href="#yol-haritasi" className="hover:text-emerald-400 transition-colors">
                  Yol Haritası
                </a>
              </li>
              <li>
                <a href="#hakkimizda" className="hover:text-emerald-400 transition-colors">
                  Hakkımızda & Ekip
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links (4 cols) */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Yasal & Güvenlik
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
              <li>
                <Link href="/terms" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <span>Kullanım Koşulları</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <span>Gizlilik Politikası</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link href="/kvkk" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <span>KVKK Aydınlatma Metni</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
            </ul>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-300 leading-relaxed">
              <strong>Sorumluluk Reddi:</strong> KararOS yatırım veya finansal danışmanlık hizmeti sunmaz. Karar destek ve bütçe simülasyonu sağlar.
            </div>
          </div>

        </div>

        {/* Bottom Subfooter */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © 2026 KararOS. Tüm hakları saklıdır.
          </div>
          <div className="flex items-center gap-4">
            <span>Türkiye / İstanbul</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">v1.4 Production Ready</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
