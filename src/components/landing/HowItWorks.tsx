import { ClipboardPen, BadgeCheck, SlidersHorizontal, Zap } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    { icon: ClipboardPen, title: "Register", description: "Submit your school details and choose your institution type and academic structure." },
    { icon: BadgeCheck, title: "Verification", description: "Our team verifies your institution and activates your account within 24 hours." },
    { icon: SlidersHorizontal, title: "Configure", description: "Set up classes, sessions, grading systems, subjects, and enable the modules you need." },
    { icon: Zap, title: "Launch", description: "Enroll students, assign teachers, record attendance, and generate reports." },
  ];

  return (
    <section className="py-28 lg:py-36 bg-luxury-navy relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-luxury-gold/5 rounded-full blur-[160px]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 mb-5">
            <div className="w-8 h-px bg-luxury-gold" />
            <span className="text-[11px] uppercase tracking-[0.3em] text-luxury-gold font-semibold">
              The Process
            </span>
            <div className="w-8 h-px bg-luxury-gold" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-white mb-5 leading-[1.05]">
            Up and running in <span className="italic text-gold-gradient">four steps</span>.
          </h2>
          <p className="text-lg text-white/50 font-light">
            A straightforward onboarding designed for schools of all sizes.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 relative">
            {/* Connecting gold line */}
            <div className="hidden md:block absolute top-14 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-luxury-gold/40 to-transparent" />

            {steps.map((step, index) => (
              <div key={index} className="relative text-center group">
                <div className="relative inline-flex mb-7">
                  <div className="w-28 h-28 rounded-full bg-luxury-surface border-2 border-luxury-gold/20 flex items-center justify-center group-hover:border-luxury-gold/60 transition-all duration-500 group-hover:-translate-y-1 shadow-luxury">
                    <step.icon className="w-10 h-10 text-luxury-gold" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-luxury-gold text-luxury-navy-deep font-display text-base font-bold flex items-center justify-center shadow-gold-glow border-4 border-luxury-navy">
                    {index + 1}
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold text-white mb-2.5">{step.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed max-w-[240px] mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
