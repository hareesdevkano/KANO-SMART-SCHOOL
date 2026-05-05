import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Building2, Mail, Phone, MapPin, User, Eye, EyeOff, Lock, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import registerBg from "@/assets/register-bg.jpg";

const Register = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    schoolName: "", schoolType: "", address: "", city: "", state: "",
    phone: "", email: "", adminName: "", adminEmail: "", adminPassword: "",
  });

  const schoolTypes = [
    { value: "nursery_primary", label: "Nursery & Primary School" },
    { value: "secondary", label: "Secondary School" },
    { value: "islamiyya", label: "Islamiyya School" },
    { value: "tahfiz", label: "Tahfiz / Qur'anic School" },
    { value: "college_of_education", label: "College of Education" },
    { value: "polytechnic", label: "Polytechnic" },
    { value: "university", label: "University" },
    { value: "vocational", label: "Vocational / Skill Center" },
    { value: "adult_education", label: "Adult & Continuing Education" },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) { setStep(2); return; }
    setIsLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.adminEmail,
        password: formData.adminPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: { full_name: formData.adminName },
        },
      });
      if (authError) throw authError;
      if (authData.user) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const { error: registerError } = await supabase.rpc('register_school', {
          _school_name: formData.schoolName,
          _school_type: formData.schoolType as any,
          _email: formData.email,
          _phone: formData.phone,
          _address: formData.address,
          _city: formData.city,
          _state: formData.state,
          _admin_user_id: authData.user.id,
          _admin_name: formData.adminName,
          _admin_phone: formData.phone,
          _memorization_enabled: ["islamiyya", "tahfiz"].includes(formData.schoolType),
        });
        if (registerError) throw registerError;
        toast({ title: "Registration Successful!", description: "Welcome to SmartSchool! Redirecting..." });
        navigate("/school-admin");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({ title: "Registration Failed", description: error.message || "Something went wrong.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image & Branding */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <img
          src={registerBg}
          alt="Modern school building exterior"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-[hsl(168,90%,18%)]/85 to-[hsl(168,84%,24%)]/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(168,90%,18%)]/60 via-transparent to-[hsl(168,90%,18%)]/30" />

        <div className="relative z-10 flex flex-col justify-center p-12 xl:p-16">
          <h2 className="text-4xl xl:text-5xl font-extrabold text-white mb-6 leading-tight">
            One Platform for<br />Every School
          </h2>
          <p className="text-lg text-white/80 mb-10 max-w-md leading-relaxed">
            Join over 1,000 schools across Nigeria using SmartSchool to manage students, exams, Qur'an memorization, and fees digitally.
          </p>

          <div className="space-y-4">
            {[
              "Complete student and staff management",
              "Qur'an memorization tracking",
              "Result processing & broadsheets",
              "Automated result & report cards",
              "Secure parent portal access",
              "Comprehensive fee management",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <span className="text-white/90 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-8 bg-background overflow-y-auto relative">
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />

        <div className="w-full max-w-lg relative z-10">
          <Link to="/" className="flex items-center gap-2.5 mb-8">
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
              <CardTitle className="text-2xl font-bold">Register Your School</CardTitle>
              <CardDescription className="text-base">
                Step {step} of 2: {step === 1 ? "School Information" : "Admin Account"}
              </CardDescription>
              <div className="flex gap-2 mt-4">
                <div className={`flex-1 h-2.5 rounded-full transition-colors ${step >= 1 ? "bg-primary" : "bg-muted"}`} />
                <div className={`flex-1 h-2.5 rounded-full transition-colors ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {step === 1 ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="schoolName" className="font-semibold">School Name</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input id="schoolName" placeholder="Enter school name" value={formData.schoolName} onChange={(e) => handleInputChange("schoolName", e.target.value)} className="pl-11 h-12 rounded-xl" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="schoolType" className="font-semibold">Institution Type</Label>
                      <Select value={formData.schoolType} onValueChange={(v) => handleInputChange("schoolType", v)} required>
                        <SelectTrigger className="h-12 rounded-xl">
                          <SelectValue placeholder="Select institution type" />
                        </SelectTrigger>
                        <SelectContent>
                          {schoolTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="font-semibold">School Address</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input id="address" placeholder="Enter street address" value={formData.address} onChange={(e) => handleInputChange("address", e.target.value)} className="pl-11 h-12 rounded-xl" required />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="font-semibold">City</Label>
                        <Input id="city" placeholder="City" value={formData.city} onChange={(e) => handleInputChange("city", e.target.value)} className="h-12 rounded-xl" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state" className="font-semibold">State</Label>
                        <Input id="state" placeholder="State" value={formData.state} onChange={(e) => handleInputChange("state", e.target.value)} className="h-12 rounded-xl" required />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="font-semibold">Phone</Label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input id="phone" placeholder="+234..." value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} className="pl-11 h-12 rounded-xl" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="font-semibold">School Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input id="email" type="email" placeholder="email@school.ng" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} className="pl-11 h-12 rounded-xl" required />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="adminName" className="font-semibold">Admin Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input id="adminName" placeholder="Enter your full name" value={formData.adminName} onChange={(e) => handleInputChange("adminName", e.target.value)} className="pl-11 h-12 rounded-xl" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="adminEmail" className="font-semibold">Admin Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input id="adminEmail" type="email" placeholder="admin@email.com" value={formData.adminEmail} onChange={(e) => handleInputChange("adminEmail", e.target.value)} className="pl-11 h-12 rounded-xl" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="adminPassword" className="font-semibold">Create Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input id="adminPassword" type={showPassword ? "text" : "password"} placeholder="Create a strong password" value={formData.adminPassword} onChange={(e) => handleInputChange("adminPassword", e.target.value)} className="pl-11 pr-11 h-12 rounded-xl" required minLength={8} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
                    </div>
                  </>
                )}

                <div className="flex gap-3 pt-4">
                  {step === 2 && (
                    <Button type="button" variant="outline" size="lg" className="flex-1 h-12 rounded-xl" onClick={() => setStep(1)} disabled={isLoading}>
                      Back
                    </Button>
                  )}
                  <Button type="submit" size="lg" className="flex-1 h-12 text-base font-bold rounded-xl shadow-lg shadow-primary/20" disabled={isLoading}>
                    {isLoading ? "Submitting..." : step === 1 ? "Continue" : "Submit Registration"}
                  </Button>
                </div>
              </form>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                Already registered?{" "}
                <Link to="/login" className="text-primary font-bold hover:underline">
                  Sign in to your account
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;
