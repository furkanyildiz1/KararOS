import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowLeft, Lock } from "lucide-react";

export const metadata = {
  title: "Gizlilik Politikası | KararOS",
  description: "KararOS kullanıcı verilerinin gizliliği ve veri güvenliği politikası.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <div className="pt-36 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#0B2345] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Ana Sayfaya Dön</span>
        </Link>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-card">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-4">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Veri Güvenliği</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B2345] mb-2">
            Gizlilik Politikası
          </h1>
          <p className="text-xs text-slate-400 mb-8 pb-4 border-b border-slate-100">
            Son Güncelleme: 30 Eylül 2026 • Versiyon 1.4.0
          </p>

          <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-[#0B2345] mb-2">
                1. Toplanan Veriler ve Amacı
              </h2>
              <p>
                KararOS, yalnızca karar simülasyonu ve bütçe hesaplamalarının yapılabilmesi için zorunlu olan temel bütçe girdilerini (aylık gelir, sabit giderler, tasarruf hedefi, harcama tutarı ve ürün kategorisi) ve hesap oluşturma bilgilerini (e-posta ve şifrelenmiş parola) toplar.
              </p>
            </section>

            <section className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-medium">
              <h3 className="font-bold text-emerald-900 mb-1">
                2. Verilerin Üçüncü Taraflara Satılmaması Taahhüdü
              </h3>
              <p className="text-xs">
                Kullanıcılarımızın kişisel veya finansal verileri hiçbir şart altında reklam hedeflemesi, pazarlama veya ticari kazanç amacıyla üçüncü taraf şirketlere veya veri simsarlarına satılmaz.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0B2345] mb-2">
                3. Veri Güvenliği ve Şifreleme
              </h2>
              <p>
                Tüm veri iletişimi TLS/HTTPS protokolüyle şifrelenir. Kullanıcı şifreleri tek yönlü BCrypt hash algoritmasıyla veri tabanında saklanır. API erişimleri güvenli JWT token mekanizması ile sınırlandırılmıştır.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0B2345] mb-2">
                4. Veri Silme ve Unutulma Hakkı
              </h2>
              <p>
                Kullanıcı, mobil uygulama profil ekranı üzerinden veya <strong>kararos.bilgi@gmail.com</strong> adresine yazılı başvuruda bulunarak hesabını ve veri tabanında kayıtlı tüm karar geçmişini kalıcı olarak sildirme hakkına sahiptir.
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
