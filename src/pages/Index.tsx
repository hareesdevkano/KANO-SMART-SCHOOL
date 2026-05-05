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
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>SmartSchool - Complete School Management Platform for Nigeria</title>
        <meta name="description" content="The premium school management platform for Islamiyya, Tahfiz, K-12 and tertiary institutions across Nigeria. Manage students, track Qur'an memorization, process results, and collect fees from one elegant dashboard." />
        <meta name="keywords" content="school management software Nigeria, Islamiyya school software, Tahfiz school management, Qur'an memorization tracking, student information system, result processing Nigeria" />
        <link rel="canonical" href="https://smartschool.edu.ng" />
      </Helmet>
      <div className="min-h-screen bg-background">
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
    </>
  );
};

export default Index;
