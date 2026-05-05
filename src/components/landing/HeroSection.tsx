import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, ShieldCheck, Award, BookOpenCheck } from "lucide-react";
import heroSlide1 from "@/assets/hero-slide-1.jpg";
import heroSlide2 from "@/assets/hero-slide-2.jpg";
import heroSlide3 from "@/assets/hero-slide-3.jpg";

const slides = [
  { src: heroSlide1, alt: "Students learning together in a modern classroom" },
  { src: heroSlide2, alt: "Students writing examinations in a hall" },
  { src: heroSlide3, alt: "Students using computers in a technology lab" },
];

const useCountUp = (end: number, duration = 2000) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = Date.now();
          const tick = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return { count, ref };
};

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const stat1 = useCountUp(500);
  const stat2 = useCountUp(50);
  const stat3 = useCountUp(20, 1500);
  const stat4 = useCountUp(99, 1500);

  useEffect(() => {
    const t = setInterval(() => setCurrentSlide((p) => (p + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative min-h-[100dvh] flex items-center overflow-hidden bg-luxury-navy-deep">
      {/* Slideshow background */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className="absolute inset-0 transition-opacity duration-[1500ms] ease-in-out"
          style={{ opacity: currentSlide === index ? 0.55 : 0 }}
        >
          <img
            src={slide.src}
            alt={slide.alt}
            className="w-full h-full object-cover transition-transform duration-[8000ms] ease-out"
            style={{ transform: currentSlide === index ? "scale(1.05)" : "scale(1.12)" }}
            loading={index === 0 ? "eager" : "lazy"}
          />
        </div>
      ))}

      {/* Luxury overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-luxury-navy-deep via-luxury-navy-deep/95 to-luxury-navy-deep/70" />
      <div className="absolute inset-0 bg-gradient-to-b from-luxury-navy-deep/70 via-transparent to-luxury-navy-deep" />

      {/* Decorative orbs */}
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-luxury-teal/10 rounded-full blur-[140px]" />
      <div className="absolute bottom-1/4 -right-32 w-[450px] h-[450px] bg-luxury-gold/8 rounded-full blur-[140px]" />

      {/* Subtle gold grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(43 64% 52%) 1px, transparent 1px), linear-gradient(90deg, hsl(43 64% 52%) 1px, transparent 1px)`,
          backgroundSize: "100px 100px",
        }}
      />

      <div className="container mx-auto px-6 lg:px-10 relative z-10 pt-32 pb-20">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left: copy */}
          <div className="lg:col-span-7 max-w-3xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.04] backdrop-blur-md border border-luxury-gold/20 text-white/80 text-xs font-medium mb-8 animate-fade-in">
              <Sparkles className="w-3.5 h-3.5 text-luxury-gold" />
              <span className="tracking-wider uppercase">Built for Nigerian Excellence</span>
            </div>

            {/* Display headline */}
            <h1 className="font-display text-[2.75rem] md:text-[4rem] lg:text-[5rem] font-bold text-white leading-[1.02] mb-7 animate-slide-up tracking-tight">
              Unlock Your{" "}
              <span className="italic text-gold-gradient">Institution's</span>
              <br />
              True Potential.
            </h1>

            <p className="text-base md:text-lg text-white/55 mb-10 max-w-xl leading-relaxed animate-slide-up delay-100">
              The premium school management platform crafted for Islamiyya, Tahfiz, K-12, and tertiary institutions across Nigeria. Tradition, refined by intelligent technology.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-14 animate-slide-up delay-200">
              <Link to="/register">
                <Button
                  size="xl"
                  className="w-full sm:w-auto group text-base font-semibold px-10 rounded-xl bg-luxury-gold text-luxury-navy-deep hover:bg-luxury-gold/90 shadow-gold-glow border-0"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  size="xl"
                  variant="outline"
                  className="w-full sm:w-auto text-base font-medium px-10 rounded-xl bg-white/[0.04] border-white/20 text-white hover:bg-white/[0.1] hover:border-white/30 backdrop-blur-sm"
                >
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Trust row */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 animate-fade-in delay-300">
              {[
                { icon: ShieldCheck, label: "Bank-grade security" },
                { icon: Award, label: "Award-winning EdTech" },
                { icon: BookOpenCheck, label: "Hifz tracking" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-white/45 text-sm">
                  <item.icon className="w-4 h-4 text-luxury-teal" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: stat panel */}
          <div className="lg:col-span-5 animate-fade-in delay-300">
            <div className="relative">
              {/* Decorative gold frame */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-luxury-gold/30 via-transparent to-luxury-teal/20 blur-xl" />

              <div className="relative rounded-3xl bg-luxury-surface/80 backdrop-blur-2xl border border-white/[0.08] p-8 shadow-luxury">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-8 bg-luxury-gold rounded-full" />
                  <span className="text-[11px] uppercase tracking-[0.25em] text-luxury-gold font-semibold">
                    By the numbers
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-px bg-white/[0.06] rounded-2xl overflow-hidden">
                  {[
                    { ref: stat1.ref, value: stat1.count, suffix: "+", label: "Schools" },
                    { ref: stat2.ref, value: stat2.count, suffix: "K+", label: "Students" },
                    { ref: stat3.ref, value: stat3.count, suffix: "+", label: "States" },
                    { ref: stat4.ref, value: stat4.count, suffix: ".9%", label: "Uptime" },
                  ].map((s, i) => (
                    <div key={i} ref={s.ref} className="bg-luxury-surface p-6">
                      <div className="font-display text-4xl font-bold text-white mb-1 tabular-nums">
                        {s.value}
                        <span className="text-luxury-gold">{s.suffix}</span>
                      </div>
                      <div className="text-[11px] text-white/50 font-semibold uppercase tracking-widest">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-white/[0.06] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-luxury-teal/15 border border-luxury-teal/30 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-luxury-teal" />
                  </div>
                  <div className="text-xs">
                    <div className="text-white/80 font-semibold">Powered by Dual Intelligence</div>
                    <div className="text-white/40">ICT Services Kano · Since 2020</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="flex gap-2 mt-12 animate-fade-in">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1 rounded-full transition-all duration-500 ${
                currentSlide === index ? "w-12 bg-luxury-gold" : "w-3 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Show slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-luxury-navy-deep to-transparent" />
    </section>
  );
};

export default HeroSection;
