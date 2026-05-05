import { Star, Quote } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    { name: "Mallam Abdullahi Yusuf", role: "Director, Darul Hikmah Islamiyya", location: "Kano", initials: "AY", content: "SmartSchool has completely changed how we manage our Islamiyya. The Qur'an memorization tracking is exactly what we needed. Parents now see their children's Hifz progress in real-time." },
    { name: "Mrs. Amina Bello-Sani", role: "Principal, Greenfield Academy", location: "Abuja", initials: "AB", content: "We moved from paper records to SmartSchool in one week. Teachers enter results digitally, and parents receive report cards as PDF downloads." },
    { name: "Ustaz Ibrahim Musa", role: "Head Teacher, Al-Furqan Tahfiz", location: "Kaduna", initials: "IM", content: "The memorization tracking is a game-changer for Tahfiz schools. We track each student's Surah progress, Juz completion, and quality ratings seamlessly." },
    { name: "Dr. Fatima Abubakar", role: "VP, Federal Government College", location: "Lagos", initials: "FA", content: "With over 2,000 students, we needed scale. SmartSchool handles attendance, exam results, and fee collection without breaking a sweat." },
    { name: "Alhaji Suleiman Danladi", role: "Proprietor, Danladi Schools Group", location: "Sokoto", initials: "SD", content: "Managing 5 schools across Sokoto used to be a nightmare. Now I have one dashboard for student numbers and fee collections in real-time." },
    { name: "Mrs. Grace Okafor", role: "Head of Academics, CKC", location: "Enugu", initials: "GO", content: "The token-based result checker has been brilliant. Students and parents check results online using tokens we manage. It streamlined everything." },
  ];

  return (
    <section id="testimonials" className="py-28 lg:py-36 bg-luxury-navy relative overflow-hidden">
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-luxury-gold/5 rounded-full blur-[200px]" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-luxury-teal/5 rounded-full blur-[150px]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 mb-5">
            <div className="w-8 h-px bg-luxury-gold" />
            <span className="text-[11px] uppercase tracking-[0.3em] text-luxury-gold font-semibold">
              In Their Words
            </span>
            <div className="w-8 h-px bg-luxury-gold" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-white mb-5 leading-[1.05]">
            Loved by educators <span className="italic text-gold-gradient">nationwide</span>.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-2xl bg-luxury-surface/60 border border-white/[0.06] hover:border-luxury-gold/30 transition-all duration-500 hover:-translate-y-1 backdrop-blur-sm"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-luxury-gold/15 group-hover:text-luxury-gold/30 transition-colors duration-500" />

              <div className="flex gap-1 mb-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-luxury-gold fill-luxury-gold" />
                ))}
              </div>

              <p className="text-white/65 text-sm leading-[1.85] mb-7 relative z-10 font-light italic">
                "{t.content}"
              </p>

              <div className="flex items-center gap-3.5 pt-5 border-t border-white/[0.06]">
                <div className="w-11 h-11 rounded-full bg-luxury-teal flex items-center justify-center text-white text-sm font-bold border-2 border-luxury-gold/30">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-white font-display">{t.name}</p>
                  <p className="text-xs text-white/40">{t.role} · {t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
