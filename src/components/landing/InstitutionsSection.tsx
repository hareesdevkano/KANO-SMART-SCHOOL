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
    <section className="py-24 lg:py-32 bg-luxury-cream border-t border-luxury-emerald/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-baseline justify-between border-b border-luxury-emerald/10 pb-6 mb-14">
          <div>
            <span className="uppercase tracking-[0.3em] text-xs font-semibold text-luxury-gold block mb-3">
              Institution Types
            </span>
            <h2 className="font-display text-3xl md:text-5xl italic text-luxury-emerald leading-[0.95]">
              Built for every institution.
            </h2>
          </div>
          <span className="hidden md:block text-xs uppercase tracking-widest text-luxury-emerald/50">
            Nine categories
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {institutions.map((item, index) => (
            <div
              key={index}
              className={`group relative flex items-start gap-5 p-7 rounded-none border transition-all duration-300 hover:shadow-xl ${
                item.featured
                  ? "bg-luxury-navy-deep text-luxury-cream border-luxury-gold/20"
                  : "bg-white border-luxury-emerald/10 hover:border-luxury-gold/40"
              }`}
            >
              <item.icon className={`w-8 h-8 flex-shrink-0 ${item.featured ? "text-luxury-gold" : "text-luxury-emerald"}`} />
              <div>
                <h3 className={`font-display text-xl italic mb-2 flex items-center gap-2 flex-wrap ${item.featured ? "text-luxury-cream" : "text-luxury-emerald"}`}>
                  {item.title}
                  {item.featured && (
                    <span className="text-[9px] font-bold uppercase tracking-wider text-luxury-gold not-italic">
                      · Specialty
                    </span>
                  )}
                </h3>
                <p className={`text-sm leading-relaxed ${item.featured ? "text-luxury-cream/70" : "text-luxury-emerald/70"}`}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstitutionsSection;
