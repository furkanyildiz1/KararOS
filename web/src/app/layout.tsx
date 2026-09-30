import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#0B2345",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "KararOS | Finansal Karar Destek Platformu",
  description:
    "KararOS, bir harcama yapmadan önce kararınızın bütçe ve tasarruf hedeflerinize etkisini simüle eden yeni nesil finansal karar destek platformudur.",
  keywords: [
    "KararOS",
    "finansal karar destek",
    "fintech",
    "bütçe yönetimi",
    "kişisel finans",
    "harcama simülasyonu",
    "tasarruf",
    "finans teknolojileri",
    "HASAT2026",
  ],
  authors: [{ name: "KararOS Ekibi" }],
  creator: "KararOS",
  publisher: "KararOS",
  metadataBase: new URL("https://kararos.com"),
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://kararos.com",
    title: "KararOS | Finansal Karar Destek Platformu",
    description: "Bir şeyi almadan önce bütçene etkisini gör. Yeni nesil kişisel finansal karar destek platformu.",
    siteName: "KararOS",
  },
  twitter: {
    card: "summary_large_image",
    title: "KararOS | Finansal Karar Destek Platformu",
    description: "Bir şeyi almadan önce bütçene etkisini gör. Kişisel finansal karar destek platformu.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#F8FAFC] text-[#152C4E] antialiased selection:bg-emerald-200 selection:text-emerald-950 font-sans">
        {children}
      </body>
    </html>
  );
}
