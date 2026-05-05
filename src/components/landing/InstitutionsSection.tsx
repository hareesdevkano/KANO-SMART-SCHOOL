import { BookOpenCheck, Star, Landmark, Building2, GraduationCap, Globe2, Hammer, UsersRound, School as University } from "lucide-react";

const InstitutionsSection = () => {
  const institutions = [
    { icon: BookOpenCheck, title: "Islamiyya Schools", description: "Full Islamic curriculum with Qur'an memorization tracking and Arabic studies.", featured: true },
    { icon: Star, title: "Tahfiz Schools", description: "Specialized Hifz tracking — Surah progress, Juz completion, and quality ratings.", featured: true },
    { icon: Landmark, title: "Nursery & Primary", description: "Age-appropriate assessment, attendance, and parent communication." },
    { icon: Building2, title: "Secondary Schools", description: "WAEC/NECO/JAMB preparation, scheme of work, and digital report cards." },
    { icon: GraduationCap, title: "Colleges of Education", description: "Course registration, semester management, and GPA/CGPA tracking." },
    { icon: Globe2, title: "Polytechnics", description: "ND/HND programme management, industrial training, and result processing." },
    { icon: Hammer, title: "Vocational Centers", description: "Skill-based assessment, trade certification, and apprenticeship management." },
    { icon: UsersRound, title: "Adult Education", description: "Flexible scheduling, literacy tracking, and certification management." },
    { icon: University, title: "Universities", description: "Faculty structures, course units, exam processing, and transcripts." },
  ];

  return (
    <section className="py-28 lg:py-36 bg-luxury-navy-deep relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-luxury-teal/5 rounded-full blur-[180px]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 mb-5">
            <div className="w-8 h-px bg-luxury-gold" />
            <span className="text-[11px] uppercase tracking-[0.3em] text-luxury-gold font-semibold">
              Institution Types
            </span>
            <div className="w-8 h-px bg-luxury-gold" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-white mb-5 leading-[1.05]">
            Built for every <span className="italic text-gold-gradient">institution</span>.
          </h2>
          <p className="text-lg text-white/50 font-light">
            Our platform adapts to your academic structure, curriculum, and unique requirements.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {institutions.map((item, index) => (
            <div
              key={index}
              className={`group relative flex items-start gap-5 p-7 rounded-2xl border transition-all duration-500 hover:-translate-y-1 ${
                item.featured
                  ? "bg-gradient-to-br from-luxury-teal/[0.1] to-luxury-surface border-luxury-teal/30 shadow-teal-glow"
                  : "bg-luxury-surface/50 border-white/[0.06] hover:border-luxury-gold/30"
              }`}
            >
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500 group-hover:scale-105 ${
                  item.featured
                    ? "bg-luxury-teal text-white shadow-teal-glow"
                    : "bg-white/[0.04] text-luxury-gold border border-luxury-gold/20"
                }`}
              >
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-white mb-1.5 flex items-center gap-2 flex-wrap">
                  {item.title}
                  {item.featured && (
                    <span className="text-[9px] font-bold uppercase text-luxury-gold bg-luxury-gold/10 px-2 py-0.5 rounded-full border border-luxury-gold/30">
                      Specialty
                    </span>
                  )}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstitutionsSection;
