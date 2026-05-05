import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Eye, EyeOff, Mail, Lock, Shield, Users, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import loginBg from "@/assets/login-bg.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        redirectToDashboard(session.user.id);
      }
    });
  }, []);

  const redirectToDashboard = async (userId: string) => {
    try {
      const { data: roles, error } = await supabase
        .from("user_roles")
        .select("role, school_id")
        .eq("user_id", userId);

      if (error) {
        console.error("Error fetching user role:", error);
        toast({ title: "Error", description: "Failed to fetch your role. Please try again.", variant: "destructive" });
        return;
      }

      if (roles && roles.length > 0) {
        const role = roles[0].role;
        switch (role) {
          case "super_admin": navigate("/super-admin"); break;
          case "school_admin": navigate("/school-admin"); break;
          case "teacher": navigate("/teacher"); break;
          case "student": navigate("/student"); break;
          case "parent": navigate("/parent"); break;
          default:
            toast({ title: "Role Not Found", description: "Your account doesn't have a valid role assigned.", variant: "destructive" });
        }
      } else {
        toast({ title: "No Role Assigned", description: "Please contact your school administrator.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
      toast({ title: "Error", description: "An error occurred while loading your account.", variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user) {
        toast({ title: "Login Successful", description: "Redirecting to your dashboard..." });
        await new Promise(resolve => setTimeout(resolve, 500));
        await redirectToDashboard(data.user.id);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({ title: "Login Failed", description: error.message || "Invalid email or password", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-8 bg-background relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />

        <div className="w-full max-w-md relative z-10">
          <Link to="/" className="flex items-center gap-2.5 mb-10">
            <div className="w-11 h-11 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground leading-tight">
                Smart<span className="text-gradient">School</span>
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
                Education Platform
              </span>
            </div>
          </Link>

          <Card variant="elevated" className="border-0 shadow-2xl">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
              <CardDescription className="text-base">
                Sign in to access your school dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-semibold">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 h-12 rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="font-semibold">Password</Label>
                    <Link to="/forgot-password" className="text-sm text-primary hover:underline font-medium">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-11 pr-11 h-12 rounded-xl"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full h-12 text-base font-bold rounded-xl shadow-lg shadow-primary/20" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary font-bold hover:underline">
                  Register your school
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Side - Image & Branding */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <img
          src={loginBg}
          alt="Students learning in a modern classroom"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(168,90%,18%)]/85 to-[hsl(168,84%,24%)]/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(168,90%,18%)]/60 via-transparent to-[hsl(168,90%,18%)]/30" />

        <div className="relative z-10 flex flex-col justify-center p-12 xl:p-16">
          <h2 className="text-4xl xl:text-5xl font-extrabold text-white mb-6 leading-tight">
            Manage Your<br />School Smarter
          </h2>
          <p className="text-lg text-white/80 mb-10 max-w-md leading-relaxed">
            Access your complete school management dashboard. Track students,
            Qur'an memorization, exams, and results effortlessly.
          </p>

          <div className="space-y-4 mb-12">
            {[
              { icon: Shield, text: "Enterprise-grade security" },
              { icon: Users, text: "Multi-role dashboards" },
              { icon: BookOpen, text: "Qur'an memorization tracking" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/10">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-white/90 font-medium">{item.text}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-6">
            {[
              { value: "1,000+", label: "Schools" },
              { value: "250K+", label: "Students" },
              { value: "99.9%", label: "Uptime" },
            ].map((stat, i) => (
              <div key={i} className="text-center p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                <div className="text-2xl font-extrabold text-white">{stat.value}</div>
                <div className="text-xs text-white/60 font-medium mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
