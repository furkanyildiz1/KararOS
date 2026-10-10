import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowLeft, Trash2, Mail, ShieldAlert, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Hesap ve Veri Silme Talebi | KararOS",
  description: "KararOS kullanıcı hesabı ve kişisel verilerin silinmesi talebi bilgilendirme sayfası.",
};

export default function DeleteAccountPage() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200 mb-4">
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            <span>Hesap ve Veri Yönetimi</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B2345] mb-2">
            Hesap ve Veri Silme Talebi
          </h1>
          <p className="text-xs text-slate-400 mb-8 pb-4 border-b border-slate-100">
            Google Play & KVKK/GDPR Veri Güvenliği Politikası Kapsamında Bilgilendirme
          </p>

          <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-[#0B2345] mb-2">
                1. Genel Bilgilendirme
              </h2>
              <p>
                KararOS olarak kullanıcılarımızın gizliliğine ve veri sahipliği haklarına azami saygı gösteriyoruz. KararOS uygulamasında oluşturduğunuz hesabınızı ve hesabınıza bağlı tüm kişisel/finansal verilerinizi dilediğiniz an kalıcı olarak sildirme hakkına sahipsiniz.
              </p>
            </section>

            <section className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950">
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-amber-900 mb-1">
                    Silinecek Veri Kategorileri
                  </h3>
                  <p className="text-xs mb-2">
                    Hesabınız silindiğinde aşağıdaki tüm veriler sunucularımızdan ve veri tabanımızdan <strong>kalıcı ve geri döndürülemez şekilde</strong> silinir:
                  </p>
                  <ul className="text-xs space-y-1 list-disc list-inside">
                    <li>Kullanıcı kimliği, e-posta adresi ve şifreli kimlik bilgileri</li>
                    <li>Aylık gelir ve sabit gider kayıtları (Bütçe profili)</li>
                    <li>Geçmiş harcama girişleri ve simüle edilen karar kayıtları</li>
                    <li>Tanımlanan tasarruf hedefleri ve birikim ilerleme durumu</li>
                    <li>Uygulamaya verilmiş tüm yasal metin onay kayıtları ve oturum anahtarları</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0B2345] mb-3">
                2. Silme Yöntemleri
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center gap-2 font-bold text-[#0B2345] mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Yöntem 1: Uygulama İçi (Anında)</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    KararOS mobil uygulamasını açın &gt; <strong>Profil</strong> sekmesine gidin &gt; Sayfanın altındaki <strong>&quot;Hesabımı ve Verilerimi Sil&quot;</strong> butonuna tıklayın ve onaylayın. Hesabınız anında kalıcı olarak silinir.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center gap-2 font-bold text-[#0B2345] mb-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span>Yöntem 2: E-Posta ile Talep</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Uygulamayı sildiyseniz veya cihaza erişiminiz yoksa; KararOS&apos;a kayıtlı e-posta adresinizden <strong>kararos.bilgi@gmail.com</strong> adresine talep gönderebilirsiniz.
                  </p>
                </div>
              </div>
            </section>

            <section className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <h3 className="font-bold text-[#0B2345] mb-2 text-base">
                Web Üzerinden Silme Talebi İletin
              </h3>
              <p className="text-xs text-slate-600 mb-4 max-w-xl mx-auto">
                Kayıtlı e-posta adresinizden e-posta başlığına &quot;Hesap Silme Talebi&quot; yazarak doğrudan başvurabilirsiniz. Talebiniz kimlik doğrulamasının ardından en geç <strong>24-48 saat</strong> içerisinde tamamlanacak ve bilgilendirme yapılacaktır.
              </p>
              <a
                href="mailto:kararos.bilgi@gmail.com?subject=KararOS%20Hesap%20ve%20Veri%20Silme%20Talebi&body=Merhaba,%0D%0A%0D%0AKararOS%20uygulamas%C4%B1nda%20kay%C4%B1tl%C4%B1%20hesab%C4%B1m%C4%B1n%20ve%20ili%C5%9Fkili%20t%C3%BCm%20verilerimin%20kal%C4%B1c%C4%B1%20olarak%20silinmesini%20talep%20ediyorum.%0D%0A%0D%0AKay%C4%B1tl%C4%B1%20E-posta%20Adresim:%20"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-sm"
              >
                <Mail className="w-4 h-4" />
                <span>kararos.bilgi@gmail.com Adresine Talep Gönder</span>
              </a>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
