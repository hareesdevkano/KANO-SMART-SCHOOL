import { ClipboardPen, BadgeCheck, SlidersHorizontal, Zap } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    { icon: ClipboardPen, title: "Register", description: "Submit your school details and choose your institution type and academic structure." },
    { icon: BadgeCheck, title: "Verification", description: "Our team verifies your institution and activates your account within 24 hours." },
    { icon: SlidersHorizontal, title: "Configure", description: "Set up classes, sessions, grading systems, subjects, and enable the modules you need." },
    { icon: Zap, title: "Launch", description: "Enroll students, assign teachers, record attendance, and generate reports." },
  ];

  return (
    <section className="py-24 lg:py-32 bg-luxury-cream border-t border-luxury-emerald/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-baseline justify-between border-b border-luxury-emerald/10 pb-6 mb-16">
          <div>
            <span className="uppercase tracking-[0.3em] text-xs font-semibold text-luxury-gold block mb-3">
              The Process
            </span>
            <h2 className="font-display text-3xl md:text-5xl italic text-luxury-emerald leading-[0.95]">
              Up and running in four steps.
            </h2>
          </div>
          <span className="hidden md:block text-xs uppercase tracking-widest text-luxury-emerald/50">
            24-hour onboarding
          </span>
        </div>

        <div className="grid md:grid-cols-4 gap-0 md:divide-x divide-luxury-emerald/10">
          {steps.map((step, index) => (
            <div key={index} className="relative px-8 py-10 group">
              <div className="flex items-baseline gap-4 mb-6">
                <span className="font-display text-6xl italic text-luxury-gold leading-none">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <step.icon className="w-6 h-6 text-luxury-emerald" />
              </div>
              <h3 className="font-display text-2xl italic text-luxury-emerald mb-3">{step.title}</h3>
              <p className="text-sm text-luxury-emerald/70 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
