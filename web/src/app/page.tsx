import React from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ProblemSection } from "@/components/ProblemSection";
import { SolutionSection } from "@/components/SolutionSection";
import { DecisionLoop } from "@/components/DecisionLoop";
import { ProductDemo } from "@/components/ProductDemo";
import { ComparisonSection } from "@/components/ComparisonSection";
import { DecisionEngineSection } from "@/components/DecisionEngineSection";
import { TractionSection } from "@/components/TractionSection";
import { TargetUsers } from "@/components/TargetUsers";
import { BusinessModel } from "@/components/BusinessModel";
import { Roadmap } from "@/components/Roadmap";
import { TechnologySection } from "@/components/TechnologySection";
import { SecuritySection } from "@/components/SecuritySection";
import { HasatSection } from "@/components/HasatSection";
import { AboutSection } from "@/components/AboutSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Sticky Responsive Header */}
      <Navbar />

      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Problem Section */}
      <ProblemSection />

      {/* 3. Solution Section */}
      <SolutionSection />

      {/* 4. How It Works (Sor → Seç → Takip Et → Öğren) */}
      <DecisionLoop />

      {/* 5. Interactive Product Simulator & Explainability */}
      <ProductDemo />

      {/* 6. Why KararOS? (Comparison Matrix) */}
      <ComparisonSection />

      {/* 7. Explainable Decision Engine */}
      <DecisionEngineSection />

      {/* 8. Product Status & Traction (18/18 Verified Tests) */}
      <TractionSection />

      {/* 9. Target Users & Validation */}
      <TargetUsers />

      {/* 10. Business Model Evolution */}
      <BusinessModel />

      {/* 11. Strategic Roadmap */}
      <Roadmap />

      {/* 12. Clean Architecture & Technology Stack */}
      <TechnologySection />

      {/* 13. Security, Privacy & Legal Disclaimers */}
      <SecuritySection />

      {/* 14. HASAT2026 Accelerator Focus */}
      <HasatSection />

      {/* 15. About & Founder */}
      <AboutSection />

      {/* 16. Contact & Collaboration */}
      <ContactSection />

      {/* 17. Official Footer */}
      <Footer />
    </main>
  );
}
