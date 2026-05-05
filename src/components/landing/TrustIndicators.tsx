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
    <section className="py-8 bg-luxury-navy-deep border-y border-white/[0.05] overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-6">
          <span className="text-[10px] uppercase tracking-[0.3em] text-luxury-gold font-semibold">
            Trusted across the federation
          </span>
        </div>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-luxury-navy-deep to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-luxury-navy-deep to-transparent z-10 pointer-events-none" />

          <div className="flex animate-marquee">
            {[...indicators, ...indicators].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-white/55 px-10 shrink-0">
                <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-luxury-gold/20 flex items-center justify-center">
                  <item.icon className="w-4 h-4 text-luxury-gold" />
                </div>
                <span className="text-sm font-medium whitespace-nowrap tracking-wide">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;
