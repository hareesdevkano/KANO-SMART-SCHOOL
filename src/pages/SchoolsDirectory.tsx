import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, MapPin, Building2, GraduationCap, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type School = {
  id: string;
  name: string;
  school_type: string;
  city: string | null;
  state: string | null;
  status: string | null;
  logo_url: string | null;
};

const typeLabel: Record<string, string> = {
  nursery_primary: "Nursery & Primary",
  secondary: "Secondary",
  islamiyya: "Islamiyya",
  tahfiz: "Tahfiz",
  college_of_education: "College of Education",
  polytechnic: "Polytechnic",
  university: "University",
  vocational: "Vocational",
  adult_education: "Adult Education",
};

const SchoolsDirectory = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("schools")
        .select("id,name,school_type,city,state,status,logo_url")
        .eq("status", "approved")
        .order("name");
      setSchools((data as School[]) || []);
      setLoading(false);
    })();
  }, []);

  const filtered = schools.filter((s) => {
    const t = q.trim().toLowerCase();
    if (!t) return true;
    return (
      s.name.toLowerCase().includes(t) ||
      (s.city || "").toLowerCase().includes(t) ||
      (s.state || "").toLowerCase().includes(t) ||
      typeLabel[s.school_type]?.toLowerCase().includes(t)
    );
  });

  return (
    <div className="min-h-screen bg-luxury-cream text-luxury-emerald">
      <header className="border-b border-luxury-emerald/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-luxury-emerald/70 hover:text-luxury-emerald">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
          <span className="text-[10px] uppercase tracking-[0.3em] text-luxury-gold font-semibold">
            SmartSchool · Directory
          </span>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 pt-16 pb-10 border-b border-luxury-emerald/10">
        <span className="uppercase tracking-widest text-xs font-semibold text-luxury-gold mb-4 block">
          Registered Institutions
        </span>
        <h1 className="font-display text-5xl md:text-6xl leading-[0.95] tracking-tight text-luxury-emerald">
          The <em className="italic text-[hsl(163,70%,27%)]">Directory</em>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-luxury-emerald/70 leading-relaxed">
          Every school currently powered by SmartSchool. Search by name, city, state, or category.
        </p>
        <div className="mt-8 max-w-lg relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-luxury-emerald/50" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search schools…"
            className="pl-11 h-12 rounded-none border-luxury-emerald/20 bg-white"
          />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        {loading ? (
          <p className="text-luxury-emerald/60">Loading directory…</p>
        ) : filtered.length === 0 ? (
          <p className="text-luxury-emerald/60 italic">No schools match your search.</p>
        ) : (
          <>
            <div className="flex items-baseline justify-between border-b border-luxury-emerald/10 pb-6 mb-10">
              <h2 className="font-display text-2xl italic">
                {filtered.length} {filtered.length === 1 ? "institution" : "institutions"}
              </h2>
              <span className="text-xs uppercase tracking-widest text-luxury-emerald/50">
                Verified & approved
              </span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((s) => (
                <Card key={s.id} className="relative overflow-hidden rounded-none border border-luxury-emerald/10 bg-white p-8 hover:shadow-xl transition-shadow">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[hsl(158,84%,17%)] to-[hsl(43,55%,54%)]" />
                  <div className="flex items-start gap-4 mb-6">
                    {s.logo_url ? (
                      <img src={s.logo_url} alt={s.name} className="w-14 h-14 object-cover border border-luxury-emerald/10" />
                    ) : (
                      <div className="w-14 h-14 bg-luxury-emerald/5 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-luxury-gold" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-xl italic text-luxury-emerald leading-tight truncate">{s.name}</h3>
                      <p className="text-[10px] uppercase tracking-widest text-luxury-gold mt-1">
                        {typeLabel[s.school_type] || s.school_type}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-luxury-emerald/70">
                    {(s.city || s.state) && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{[s.city, s.state].filter(Boolean).join(", ")}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span className="capitalize">{s.status}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </section>

      <footer className="border-t border-luxury-emerald/10 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-luxury-emerald/60">
          <span>Powered by <span className="text-luxury-emerald font-medium">Dual Intelligence ICT Services Kano</span></span>
          <div className="flex gap-6">
            <Link to="/register" className="hover:text-luxury-emerald">Register your school</Link>
            <Link to="/demo" className="hover:text-luxury-emerald">Live demo</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SchoolsDirectory;
