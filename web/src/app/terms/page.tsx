import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowLeft, Shield } from "lucide-react";

export const metadata = {
  title: "Kullanım Koşulları | KararOS",
  description: "KararOS platformu kullanım koşulları ve yasal şartlar.",
};

export default function TermsPage() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 mb-4">
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            <span>Hukuki Şartlar</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B2345] mb-2">
            Kullanım Koşulları
          </h1>
          <p className="text-xs text-slate-400 mb-8 pb-4 border-b border-slate-100">
            Son Güncelleme: 30 Eylül 2026 • Versiyon 1.4.0
          </p>

          <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-[#0B2345] mb-2">
                1. Hizmetin Niteliği ve Kapsamı
              </h2>
              <p>
                KararOS (“Platform”), bireysel kullanıcıların harcama öncesi bütçe ve tasarruf hedeflerine ilişkin olası etkileri simüle etmelerine yardımcı olan bir karar destek aracıdır.
              </p>
            </section>

            <section className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 font-medium">
              <h3 className="font-bold text-amber-900 mb-1">
                2. Finansal Danışmanlık ve Yatırım Tavsiyesi Reddi
              </h3>
              <p className="text-xs">
                KararOS bir banka, aracı kurum, ödeme kuruluşu veya 6362 sayılı Sermaye Piyasası Kanunu kapsamında yetkilendirilmiş bir yatırım danışmanlığı şirketi değildir. Platform tarafından üretilen tüm skorlar ve çıktılar yalnızca kullanıcının girdiği verilere dayalı matematiksel simülasyonlardır. Nihai harcama ve bütçe kararı tamamen kullanıcıya aittir.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0B2345] mb-2">
                3. Kullanıcı Yükümlülükleri
              </h2>
              <p>
                Kullanıcı, platforma girdiği bütçe ve gider verilerinin doğruluğundan bizzat sorumludur. Hatalı veya eksik veri girişi sebebiyle oluşabilecek simülasyon farklılıklarından KararOS sorumlu tutulamaz.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0B2345] mb-2">
                4. Hesap ve Veri Güvenliği
              </h2>
              <p>
                Kullanıcı, hesap şifresinin gizliliğini korumakla yükümlüdür. Kullanıcı dilediği zaman profil ayarlarından hesabını ve tüm karar kayıtlarını kalıcı olarak silebilir.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0B2345] mb-2">
                5. Değişiklikler ve İletişim
              </h2>
              <p>
                KararOS, işbu kullanım koşullarını önceden bildirimde bulunarak güncelleme hakkını saklı tutar. Sorularınız için <strong>kararos.bilgi@gmail.com</strong> adresinden bize ulaşabilirsiniz.
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
