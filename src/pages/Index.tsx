import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import TrustIndicators from "@/components/landing/TrustIndicators";
import ResultsChecker from "@/components/landing/ResultsChecker";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorks from "@/components/landing/HowItWorks";
import InstitutionsSection from "@/components/landing/InstitutionsSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen relative">
      <div className="watermark-layer" aria-hidden="true" />
      <div className="relative z-10">
        <Navbar />
        <main>
          <HeroSection />
          <ResultsChecker />
          <TrustIndicators />
          <FeaturesSection />
          <section id="schools">
            <InstitutionsSection />
          </section>
          <section id="how-it-works">
            <HowItWorks />
          </section>
          <TestimonialsSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
