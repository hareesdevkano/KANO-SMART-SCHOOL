import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle, ShieldCheck } from "lucide-react";
import heroSlide1 from "@/assets/hero-slide-1.jpg";

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
  const stat1 = useCountUp(500);
  const stat2 = useCountUp(50);
  const stat3 = useCountUp(20, 1500);
  const stat4 = useCountUp(99, 1500);

  return (
    <section className="relative bg-luxury-cream text-luxury-emerald pt-32 pb-20 border-b border-luxury-emerald/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Masthead line */}
        <div className="flex items-center justify-between pb-8 border-b border-luxury-emerald/10 mb-16">
          <span className="text-[10px] uppercase tracking-[0.35em] text-luxury-gold font-semibold">
            Volume I · The Modern Nigerian Institution
          </span>
          <span className="hidden md:block text-[10px] uppercase tracking-[0.3em] text-luxury-emerald/50">
            Est. 2020 · Kano
          </span>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-end">
          {/* Left — editorial headline */}
          <div className="lg:col-span-8">
            <span className="inline-flex items-center gap-3 mb-8">
              <span className="h-px w-10 bg-luxury-gold" />
              <span className="uppercase tracking-[0.28em] text-[11px] font-bold text-luxury-gold">
                Built for Nigerian Excellence
              </span>
            </span>
            <h1 className="font-display text-5xl md:text-7xl lg:text-[5.5rem] leading-[0.95] tracking-tight text-luxury-emerald">
              Unlock your institution's{" "}
              <em className="italic text-luxury-teal">true potential.</em>
            </h1>
            <p className="mt-10 max-w-2xl text-lg text-luxury-emerald/70 leading-relaxed">
              The premium school management platform crafted for Islamiyya, Tahfiz,
              K-12, and tertiary institutions across Nigeria. Tradition, refined by
              intelligent technology.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-12">
              <Link to="/register">
                <Button
                  size="xl"
                  className="group w-full sm:w-auto rounded-none bg-luxury-emerald text-luxury-cream hover:bg-luxury-emerald-deep border-0 font-semibold uppercase tracking-[0.16em] text-xs px-10 h-14 shadow-[0_18px_40px_-24px_rgba(6,78,59,0.9)] transition-all duration-300"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>

              <Link to="/demo">
                <Button
                  size="xl"
                  variant="outline"
                  className="w-full sm:w-auto rounded-none border-luxury-emerald text-luxury-emerald hover:bg-luxury-emerald hover:text-luxury-cream font-semibold uppercase tracking-wider text-xs px-10 h-14"
                >
                  <PlayCircle className="w-4 h-4 mr-2" /> View Live Demo
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  size="xl"
                  variant="ghost"
                  className="w-full sm:w-auto rounded-none text-luxury-emerald hover:bg-luxury-emerald/5 font-medium uppercase tracking-wider text-xs px-8 h-14 underline underline-offset-8 decoration-luxury-gold/60"
                >
                  Sign in →
                </Button>
              </Link>
            </div>
          </div>

          {/* Right — editorial pull quote / stat card */}
          <div className="lg:col-span-4">
            <div className="bg-luxury-navy-deep text-luxury-cream p-8 rounded-none border border-luxury-gold/20">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-6 bg-luxury-gold" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-luxury-gold font-semibold">
                  By the numbers
                </span>
              </div>
              <div className="grid grid-cols-2 gap-6 mb-6">
                {[
                  { ref: stat1.ref, value: stat1.count, suffix: "+", label: "Schools" },
                  { ref: stat2.ref, value: stat2.count, suffix: "K+", label: "Students" },
                  { ref: stat3.ref, value: stat3.count, suffix: "+", label: "States" },
                  { ref: stat4.ref, value: stat4.count, suffix: ".9%", label: "Uptime" },
                ].map((s, i) => (
                  <div key={i} ref={s.ref}>
                    <div className="font-display text-4xl italic text-luxury-cream tabular-nums">
                      {s.value}
                      <span className="text-luxury-gold">{s.suffix}</span>
                    </div>
                    <div className="text-[10px] text-luxury-cream/60 font-semibold uppercase tracking-widest mt-1">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-6 border-t border-luxury-cream/10 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-luxury-gold shrink-0" />
                <div className="text-[11px] leading-tight">
                  <div className="text-luxury-cream/90 font-semibold">Powered by Dual Intelligence</div>
                  <div className="text-luxury-cream/50">ICT Services Kano · Since 2020</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Editorial image band */}
        <div className="mt-20 grid grid-cols-12 gap-6 items-end">
          <div className="col-span-12 md:col-span-8">
            <div className="aspect-[16/9] overflow-hidden border border-luxury-emerald/10">
              <img
                src={heroSlide1}
                alt="Students learning in a modern classroom"
                className="w-full h-full object-cover grayscale-[15%]"
                loading="eager"
              />
            </div>
          </div>
          <div className="col-span-12 md:col-span-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-luxury-gold font-semibold">
              Feature
            </span>
            <p className="font-display text-2xl italic mt-3 text-luxury-emerald leading-snug">
              "A guided tour of the modern Nigerian institution — one seat at a time."
            </p>
            <div className="mt-6 h-px bg-luxury-emerald/10" />
            <p className="mt-4 text-sm text-luxury-emerald/60">
              From Islamiyya halls to university faculties — one elegant platform.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
