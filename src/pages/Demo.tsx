import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Shield, User, GraduationCap, Users, Building2, PlayCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type RoleKey = "super_admin" | "school_admin" | "teacher" | "student" | "parent";

const roles: { key: RoleKey; icon: any; title: string; tagline: string; path: string; accent: string }[] = [
  { key: "school_admin", icon: Building2,     title: "School Admin",  tagline: "Manage classes, students, teachers, fees & sessions.",           path: "/school-admin", accent: "from-[hsl(158,84%,20%)] to-[hsl(43,55%,54%)]" },
  { key: "teacher",      icon: GraduationCap, title: "Teacher",       tagline: "Attendance, results, lesson plans, Qur'an memorization.",       path: "/teacher",      accent: "from-[hsl(163,70%,27%)] to-[hsl(43,55%,54%)]" },
  { key: "student",      icon: User,          title: "Student",       tagline: "View results, attendance, fees & profile.",                     path: "/student",      accent: "from-[hsl(158,60%,20%)] to-[hsl(163,70%,27%)]" },
  { key: "parent",       icon: Users,         title: "Parent",        tagline: "Track your child's academics, fees & memorization.",            path: "/parent",       accent: "from-[hsl(163,70%,27%)] to-[hsl(158,84%,17%)]" },
];

const Demo = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<RoleKey | null>(null);

  const enter = async (key: RoleKey, path: string) => {
    setLoading(key);
    try {
      // Sign out any existing session so we land on the demo account cleanly
      await supabase.auth.signOut();

      // Ensure the demo user exists / has correct role & password
      const { data, error } = await supabase.functions.invoke("demo-signin", {
        body: { role: key },
      });
      if (error) throw error;
      if (!data?.email) throw new Error("Demo user could not be prepared.");

      const { error: signInErr } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (signInErr) throw signInErr;

      toast({ title: `Signed in as ${key.replace("_", " ")}`, description: "Welcome to the sandbox." });
      navigate(path);
    } catch (e: any) {
      toast({
        title: "Could not start demo",
        description: e?.message || "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-luxury-cream text-luxury-emerald">
      {/* Masthead */}
      <header className="border-b border-luxury-emerald/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-luxury-emerald/70 hover:text-luxury-emerald">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
          <span className="text-[10px] uppercase tracking-[0.3em] text-luxury-gold font-semibold">
            SmartSchool · Guided Demo
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 border-b border-luxury-emerald/10">
        <div className="grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8">
            <span className="uppercase tracking-widest text-xs font-semibold text-luxury-gold mb-6 block">
              One-click access · No sign-up
            </span>
            <h1 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight text-luxury-emerald">
              Explore SmartSchool <em className="italic text-[hsl(163,70%,27%)]">from every seat.</em>
            </h1>
            <p className="mt-8 max-w-2xl text-lg text-luxury-emerald/70 leading-relaxed">
              Pick a role — we'll sign you into a live sandbox dashboard instantly. Every session
              runs against a shared demo school so you can see the full workflow.
            </p>
          </div>
          <div className="lg:col-span-4">
            <div className="bg-luxury-navy-deep text-luxury-cream p-8 rounded-none border border-luxury-gold/20">
              <PlayCircle className="w-8 h-8 text-luxury-gold mb-4" />
              <p className="font-display text-2xl italic mb-4 leading-snug">
                "A guided tour of the modern Nigerian institution."
              </p>
              <Link to="/schools">
                <Button className="w-full rounded-none bg-luxury-gold text-luxury-emerald hover:brightness-110 font-semibold uppercase tracking-wider text-xs h-12">
                  View registered schools
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Role tiles */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-baseline justify-between border-b border-luxury-emerald/10 pb-6 mb-10">
          <h2 className="font-display text-3xl md:text-4xl italic">Enter as…</h2>
          <span className="text-xs uppercase tracking-widest text-luxury-emerald/50">Five perspectives</span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((r) => {
            const Icon = r.icon;
            const isLoading = loading === r.key;
            return (
              <Card
                key={r.key}
                className="group relative overflow-hidden rounded-none border border-luxury-emerald/10 bg-white p-8 hover:shadow-xl transition-shadow"
              >
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${r.accent}`} />
                <Icon className="w-8 h-8 text-luxury-gold mb-6" />
                <h3 className="font-display text-3xl italic text-luxury-emerald mb-3">{r.title}</h3>
                <p className="text-sm text-luxury-emerald/70 leading-relaxed mb-8 min-h-[3rem]">{r.tagline}</p>
                <Button
                  onClick={() => enter(r.key, r.path)}
                  disabled={isLoading || loading !== null}
                  variant="outline"
                  className="rounded-none border-luxury-emerald text-luxury-emerald hover:bg-luxury-emerald hover:text-luxury-cream"
                >
                  {isLoading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Preparing…</>
                  ) : (
                    <>Enter dashboard <ArrowRight className="w-4 h-4 ml-2" /></>
                  )}
                </Button>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Footer band */}
      <footer className="border-t border-luxury-emerald/10 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-luxury-emerald/60">
          <span>Powered by <span className="text-luxury-emerald font-medium">Dual Intelligence ICT Services Kano</span></span>
          <div className="flex gap-6">
            <Link to="/schools" className="hover:text-luxury-emerald">Registered schools</Link>
            <Link to="/register" className="hover:text-luxury-emerald">Register your school</Link>
            <Link to="/login" className="hover:text-luxury-emerald">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Demo;
