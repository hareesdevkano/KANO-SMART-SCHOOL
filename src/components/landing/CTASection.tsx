import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Sparkles } from "lucide-react";

const CTASection = () => {
  const benefits = [
    "14-day free trial",
    "No credit card required",
    "Full platform access",
    "Dedicated WhatsApp support",
  ];

  return (
    <section className="py-28 lg:py-36 relative overflow-hidden bg-luxury-navy-deep">
      {/* Layered glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-luxury-gold/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-luxury-teal/10 rounded-full blur-[120px]" />
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(43 64% 52%) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Decorative gold border card */}
          <div className="relative">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-luxury-gold/40 via-luxury-teal/20 to-luxury-gold/40 blur-xl opacity-60" />

            <div className="relative rounded-3xl bg-luxury-surface/90 backdrop-blur-2xl border border-luxury-gold/20 p-12 lg:p-16 text-center shadow-luxury">
              <div className="inline-flex items-center gap-2 mb-6">
                <Sparkles className="w-4 h-4 text-luxury-gold" />
                <span className="text-[11px] uppercase tracking-[0.3em] text-luxury-gold font-semibold">
                  Begin your transformation
                </span>
                <Sparkles className="w-4 h-4 text-luxury-gold" />
              </div>

              <h2 className="font-display text-4xl md:text-5xl lg:text-[3.75rem] font-bold text-white mb-6 leading-[1.05]">
                Elevate your school to{" "}
                <span className="italic text-gold-gradient">international standard</span>.
              </h2>

              <p className="text-lg text-white/55 mb-10 max-w-xl mx-auto font-light leading-relaxed">
                Join 500+ institutions across Nigeria that trust SmartSchool for their academic and administrative excellence.
              </p>

              <div className="flex flex-wrap justify-center gap-3 mb-12">
                {benefits.map((b, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.04] text-white/70 text-sm border border-white/[0.08] backdrop-blur-sm"
                  >
                    <CheckCircle className="w-4 h-4 text-luxury-teal shrink-0" />
                    {b}
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button
                    size="xl"
                    className="w-full sm:w-auto group text-base font-semibold px-12 rounded-xl bg-luxury-gold text-luxury-navy-deep hover:bg-luxury-gold/90 shadow-gold-glow border-0"
                  >
                    Register Your School
                    <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1.5 transition-transform" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    size="xl"
                    variant="outline"
                    className="w-full sm:w-auto text-base font-medium px-12 rounded-xl bg-white/[0.04] border-white/20 text-white hover:bg-white/[0.1]"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>

              <p className="text-sm text-white/35 mt-10">
                Need assistance?{" "}
                <a
                  href="https://wa.me/2349073733790"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-luxury-gold underline underline-offset-4 hover:text-luxury-gold/80 transition-colors"
                >
                  Chat with us on WhatsApp
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
