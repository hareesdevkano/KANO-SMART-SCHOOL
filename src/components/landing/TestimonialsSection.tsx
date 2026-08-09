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
    <section id="testimonials" className="py-24 lg:py-32 bg-luxury-cream border-t border-luxury-emerald/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-baseline justify-between border-b border-luxury-emerald/10 pb-6 mb-14">
          <div>
            <span className="uppercase tracking-[0.3em] text-xs font-semibold text-luxury-gold block mb-3">
              In Their Words
            </span>
            <h2 className="font-display text-3xl md:text-5xl italic text-luxury-emerald leading-[0.95]">
              Loved by educators nationwide.
            </h2>
          </div>
          <span className="hidden md:block text-xs uppercase tracking-widest text-luxury-emerald/50">
            500+ institutions
          </span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="group relative p-8 bg-white border border-luxury-emerald/10 rounded-none hover:border-luxury-gold/40 hover:shadow-xl transition-all duration-300"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-luxury-gold/20" />

              <div className="flex gap-0.5 mb-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-luxury-gold fill-luxury-gold" />
                ))}
              </div>

              <p className="font-display text-lg italic text-luxury-emerald leading-relaxed mb-7">
                "{t.content}"
              </p>

              <div className="flex items-center gap-3.5 pt-5 border-t border-luxury-emerald/10">
                <div className="w-11 h-11 rounded-none bg-luxury-emerald flex items-center justify-center text-luxury-cream text-sm font-bold border border-luxury-gold/40">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-luxury-emerald font-display">{t.name}</p>
                  <p className="text-xs text-luxury-emerald/50 mt-0.5">{t.role} · {t.location}</p>
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
