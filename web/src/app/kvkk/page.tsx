import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowLeft, FileCheck } from "lucide-react";

export const metadata = {
  title: "KVKK Aydınlatma Metni | KararOS",
  description: "6698 sayılı Kişisel Verilerin Korunması Kanunu uyarınca KararOS aydınlatma metni.",
};

export default function KvkkPage() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200 mb-4">
            <FileCheck className="w-3.5 h-3.5 text-purple-600" />
            <span>Mevzuat Uyumu</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B2345] mb-2">
            KVKK Aydınlatma Metni
          </h1>
          <p className="text-xs text-slate-400 mb-8 pb-4 border-b border-slate-100">
            6698 Sayılı Kanun Uyarınca • Son Güncelleme: 30 Eylül 2026
          </p>

          <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-[#0B2345] mb-2">
                1. Veri Sorumlusu
              </h2>
              <p>
                6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca, KararOS olarak veri sorumlusu sıfatıyla kişisel verilerinizi aşağıda açıklanan amaçlar doğrultusunda işlemekteyiz.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0B2345] mb-2">
                2. İşlenen Kişisel Veriler ve İşleme Amaçları
              </h2>
              <p>
                Platformumuzda işlenen kişisel veriler; kimlik ve iletişim bilgileri (e-posta adresi), oturum bilgileri (şifrelenmiş parola ve token) ve kullanıcının bütçe simülasyonu amacıyla kendi rızasıyla girdiği finansal karar parametreleridir. Bu veriler yalnızca karar motorunun çalıştırılması, hesap güvenliğinin sağlanması ve mevzuat yükümlülüklerinin yerine getirilmesi amacıyla işlenir.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0B2345] mb-2">
                3. Kişisel Veri Toplamanın Hukuki Sebebi
              </h2>
              <p>
                Kişisel verileriniz, KVKK’nın 5. maddesinde belirtilen “Bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması” ve “Veri sorumlusunun meşru menfaatleri” hukuki sebeplerine dayalı olarak dijital ortamda otomatik yollarla toplanmaktadır.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0B2345] mb-2">
                4. İlgili Kişinin Hakları (KVKK Madde 11)
              </h2>
              <p>
                KVKK’nın 11. maddesi uyarınca veri sahipleri; kişisel verilerinin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, verilerin silinmesini veya yok edilmesini isteme ve kanuna aykırı işleme nedeniyle zarara uğraması hâlinde zararın giderilmesini talep etme haklarına sahiptir.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0B2345] mb-2">
                5. Başvuru Yolu
              </h2>
              <p>
                Haklarınıza ilişkin taleplerinizi <strong>kararos.bilgi@gmail.com</strong> e-posta adresi üzerinden yazılı olarak şirketimize iletebilirsiniz. Başvurularınız en geç 30 gün içinde ücretsiz olarak sonuçlandırılacaktır.
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
