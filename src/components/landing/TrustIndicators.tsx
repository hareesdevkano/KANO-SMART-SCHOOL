import { Lock, School, Trophy, MapPinned, Activity, ShieldCheck, Users, Award } from "lucide-react";

const TrustIndicators = () => {
  const indicators = [
    { icon: Lock, label: "Enterprise Security" },
    { icon: School, label: "500+ Institutions" },
    { icon: Trophy, label: "Award-Winning" },
    { icon: Award, label: "ISO-Aligned" },
    { icon: MapPinned, label: "20+ States" },
    { icon: Activity, label: "99.9% Uptime" },
    { icon: ShieldCheck, label: "Data Protected" },
    { icon: Users, label: "50K+ Students" },
  ];

  return (
    <section className="py-10 bg-luxury-emerald border-y border-luxury-gold/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-8 h-px bg-luxury-gold" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-luxury-gold font-semibold">
            Trusted across the federation
          </span>
          <div className="flex-1 h-px bg-luxury-gold/20" />
        </div>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-luxury-emerald to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-luxury-emerald to-transparent z-10 pointer-events-none" />

          <div className="flex animate-marquee">
            {[...indicators, ...indicators].map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-10 shrink-0">
                <item.icon className="w-4 h-4 text-luxury-gold" />
                <span className="text-sm font-medium whitespace-nowrap tracking-wide text-luxury-cream/80">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;
