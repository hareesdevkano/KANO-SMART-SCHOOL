import {
  UserRoundSearch,
  Sparkles,
  CalendarClock,
  ScanLine,
  FileSpreadsheet,
  Wallet,
  HeartHandshake,
  Megaphone,
  BookMarked,
  BellRing,
  PieChart,
  ArrowUpRight,
  GraduationCap,
} from "lucide-react";

const FeaturesSection = () => {
  const features = [
    { icon: UserRoundSearch, title: "Student Information System", description: "Manage the full student lifecycle — enrollment, profiles, classes, and academic history." },
    { icon: GraduationCap, title: "Teacher & Staff Records", description: "Complete personnel management with class assignments, qualifications, and payroll-ready records.", featured: true },
    { icon: CalendarClock, title: "Intelligent Scheduling", description: "Auto-generate conflict-free timetables for classes, exams, and school events." },
    { icon: ScanLine, title: "Attendance Tracking", description: "Daily attendance with real-time dashboards and automatic guardian notifications." },
    { icon: FileSpreadsheet, title: "Result Processing", description: "Compute grades, generate broadsheets, print report cards, publish via secure tokens." },
    { icon: Wallet, title: "Fees & Payments", description: "Define fee categories, track payments and balances, generate financial summaries per term." },
    { icon: HeartHandshake, title: "Parent Portal", description: "Real-time access to grades, attendance, announcements, and fee status for guardians." },
    { icon: BookMarked, title: "Qur'an Memorization", description: "Surah-by-Surah Hifz tracking, Juz completion, quality ratings, and revision schedules.", featured: true },
    { icon: Megaphone, title: "Announcements", description: "Broadcast to specific roles with push and in-app notifications." },
    { icon: BellRing, title: "Smart Notifications", description: "Customizable alerts for deadlines, fees, attendance flags, and milestones." },
    { icon: PieChart, title: "Reports & Dashboards", description: "Visual insights with exportable reports on enrollment, performance, and revenue." },
    { icon: Sparkles, title: "AI-Powered Insights", description: "Predictive analytics for performance trends and early intervention recommendations.", featured: true },
  ];

  return (
    <section id="features" className="py-28 lg:py-36 bg-luxury-navy-deep relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(43 64% 52%) 1px, transparent 0)`,
          backgroundSize: "48px 48px",
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-luxury-teal/5 rounded-full blur-[180px]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 mb-5">
            <div className="w-8 h-px bg-luxury-gold" />
            <span className="text-[11px] uppercase tracking-[0.3em] text-luxury-gold font-semibold">
              Platform Capabilities
            </span>
            <div className="w-8 h-px bg-luxury-gold" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-white mb-5 leading-[1.05]">
            Every tool your school needs,
            <br />
            <span className="italic text-gold-gradient">refined for excellence</span>.
          </h2>
          <p className="text-lg text-white/50 max-w-xl mx-auto font-light leading-relaxed">
            A unified platform covering academics, administration, finance, and communication.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.05] rounded-3xl overflow-hidden border border-white/[0.06]">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative p-8 transition-all duration-500 ${
                feature.featured
                  ? "bg-gradient-to-br from-luxury-teal/[0.08] to-luxury-surface"
                  : "bg-luxury-navy hover:bg-luxury-surface/60"
              }`}
            >
              {feature.featured && (
                <div className="absolute top-5 right-5">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-luxury-gold bg-luxury-gold/10 px-2.5 py-1 rounded-full border border-luxury-gold/30">
                    Signature
                  </span>
                </div>
              )}

              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 ${
                  feature.featured
                    ? "bg-luxury-gold text-luxury-navy-deep shadow-gold-glow"
                    : "bg-white/[0.04] text-luxury-gold border border-luxury-gold/20 group-hover:border-luxury-gold/50"
                }`}
              >
                <feature.icon className="w-5 h-5" />
              </div>

              <h3 className="font-display text-lg font-bold text-white mb-2 flex items-center gap-2">
                {feature.title}
                <ArrowUpRight className="w-4 h-4 text-luxury-gold/40 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
              </h3>
              <p className="text-sm text-white/50 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
