import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

const CTASection = () => {
  const benefits = [
    "14-day free trial",
    "No credit card required",
    "Full platform access",
    "Dedicated WhatsApp support",
  ];

  return (
    <section className="py-24 lg:py-32 bg-luxury-cream border-t border-luxury-emerald/10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="border-t border-b border-luxury-emerald/15 py-16 md:py-20 grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7">
            <span className="uppercase tracking-[0.3em] text-xs font-semibold text-luxury-gold mb-6 block">
              Begin your transformation
            </span>
            <h2 className="font-display text-4xl md:text-6xl leading-[0.95] tracking-tight text-luxury-emerald">
              Elevate your school to{" "}
              <em className="italic text-[hsl(163,70%,27%)]">international standard.</em>
            </h2>
            <p className="mt-8 max-w-xl text-lg text-luxury-emerald/70 leading-relaxed">
              Join 500+ institutions across Nigeria that trust SmartSchool for their
              academic and administrative excellence.
            </p>

            <ul className="mt-8 grid sm:grid-cols-2 gap-x-8 gap-y-3">
              {benefits.map((b, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-luxury-emerald/80">
                  <CheckCircle className="w-4 h-4 text-luxury-gold shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-5 md:border-l md:border-luxury-emerald/10 md:pl-10">
            <div className="bg-luxury-navy-deep text-luxury-cream p-8 border border-luxury-gold/20">
              <p className="font-display text-2xl italic leading-snug mb-6">
                "Register today — your institution's new chapter begins here."
              </p>
              <Link to="/register" className="block">
                <Button
                  size="xl"
                  className="w-full rounded-none bg-luxury-gold text-luxury-emerald hover:brightness-110 font-semibold uppercase tracking-wider text-xs h-14"
                >
                  Register Your School <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/login" className="block mt-3">
                <Button
                  size="xl"
                  variant="outline"
                  className="w-full rounded-none border-luxury-cream/30 bg-transparent text-luxury-cream hover:bg-luxury-cream/10 font-semibold uppercase tracking-wider text-xs h-14"
                >
                  Sign In
                </Button>
              </Link>
              <p className="text-xs text-luxury-cream/50 mt-6 text-center">
                Need assistance?{" "}
                <a
                  href="https://wa.me/2349073733790"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-luxury-gold underline underline-offset-4"
                >
                  Chat on WhatsApp
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
