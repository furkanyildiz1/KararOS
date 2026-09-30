"use client";

import React, { useState } from "react";
import { Mail, Send, CheckCircle2, MessageSquare, Building2, User, Sparkles } from "lucide-react";

export function ContactSection() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [subject, setSubject] = useState("Pilot / İş Birliği");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !message) return;
    setSubmitted(true);
  };

  return (
    <section id="iletisim" className="py-20 md:py-28 bg-slate-50 relative border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Context & Channels (5 cols) */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80 mb-4">
              <Mail className="w-3.5 h-3.5 text-emerald-600" />
              <span>İletişim & İş Birlikleri</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B2345] tracking-tight leading-tight mb-4">
              KararOS ile iletişime geçin.
            </h2>
            
            <p className="text-base text-slate-600 leading-relaxed mb-8">
              Pilot çalışmalar, yatırım ve mentorluk görüşmeleri, kurumsal çalışan esenlik ortaklıkları ve kapalı beta katılımı için bize dilediğiniz zaman ulaşabilirsiniz.
            </p>

            {/* Direct Contact Cards */}
            <div className="space-y-4 mb-8">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Resmi E-posta
                  </span>
                  <a
                    href="mailto:kararos.bilgi@gmail.com"
                    className="text-sm font-bold text-[#0B2345] hover:text-[#159653] transition-colors"
                  >
                    kararos.bilgi@gmail.com
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 font-bold text-sm">
                  in
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    LinkedIn
                  </span>
                  <span className="text-sm font-bold text-[#0B2345]">
                    linkedin.com/company/kararos
                  </span>
                </div>
              </div>
            </div>


          </div>

          {/* Right Column: Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-card">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-[#0B2345] mb-2">
                  Mesajınız Alındı!
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
                  Talebiniz ekibimize ulaştı. En kısa sürede sizinle e-posta adresiniz üzerinden irtibata geçeceğiz.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
                >
                  Yeni Mesaj Gönder
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Ad Soyad *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Örn: Ayşe Yılmaz"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#159653]/30 focus:border-[#159653]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      E-posta Adresi *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ornek@sirket.com"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#159653]/30 focus:border-[#159653]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Kurum / Şirket / Üniversite
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder="Örn: Teknopark / Şirket Adı"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#159653]/30 focus:border-[#159653]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Görüşme Konusu *
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#159653]/30 focus:border-[#159653] bg-white"
                    >
                      <option value="Pilot / İş Birliği">Pilot / İş Birliği</option>
                      <option value="Yatırım">Yatırım Görüşmesi</option>
                      <option value="Mentorluk">Mentorluk & Danışmanlık</option>
                      <option value="Beta Kullanıcısı">Kapalı Beta Katılımı</option>
                      <option value="HASAT2026">HASAT2026 Süreci</option>
                      <option value="Diğer">Diğer</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mesajınız *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Görüşmek istediğiniz konuyu kısaca özetleyiniz..."
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#159653]/30 focus:border-[#159653]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#159653] hover:bg-[#117E45] text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Mesajı Gönder</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
