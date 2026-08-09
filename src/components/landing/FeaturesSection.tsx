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
    <section id="features" className="py-24 lg:py-32 bg-luxury-cream border-t border-luxury-emerald/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-baseline justify-between border-b border-luxury-emerald/10 pb-6 mb-14">
          <div>
            <span className="uppercase tracking-[0.3em] text-xs font-semibold text-luxury-gold block mb-3">
              Platform Capabilities
            </span>
            <h2 className="font-display text-3xl md:text-5xl italic text-luxury-emerald leading-[0.95]">
              Every tool your school needs.
            </h2>
          </div>
          <span className="hidden md:block text-xs uppercase tracking-widest text-luxury-emerald/50">
            Twelve modules
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative p-8 rounded-none border transition-all duration-300 hover:shadow-xl ${
                feature.featured
                  ? "bg-luxury-navy-deep text-luxury-cream border-luxury-gold/20"
                  : "bg-white border-luxury-emerald/10 hover:border-luxury-gold/40"
              }`}
            >
              <div className={`absolute inset-x-0 top-0 h-1 ${feature.featured ? "bg-luxury-gold" : "bg-transparent group-hover:bg-luxury-gold/50"} transition-colors`} />
              {feature.featured && (
                <span className="absolute top-5 right-5 text-[9px] font-bold uppercase tracking-wider text-luxury-gold">
                  Signature
                </span>
              )}

              <feature.icon className={`w-7 h-7 mb-6 ${feature.featured ? "text-luxury-gold" : "text-luxury-emerald"}`} />

              <h3 className={`font-display text-2xl italic mb-3 flex items-center gap-2 ${feature.featured ? "text-luxury-cream" : "text-luxury-emerald"}`}>
                {feature.title}
                <ArrowUpRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all ${feature.featured ? "text-luxury-gold" : "text-luxury-gold"}`} />
              </h3>
              <p className={`text-sm leading-relaxed ${feature.featured ? "text-luxury-cream/70" : "text-luxury-emerald/70"}`}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
