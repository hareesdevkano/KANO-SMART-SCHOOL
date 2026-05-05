import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import {
  GraduationCap,
  Loader2,
  KeyRound,
  CheckCircle2,
  UserPlus,
} from "lucide-react";

const StudentRegistration = () => {
  const [searchParams] = useSearchParams();
  const schoolIdParam = searchParams.get("school");
  const [step, setStep] = useState<"pin" | "form" | "success">("pin");
  const [pin, setPin] = useState("");
  const [validating, setValidating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [schoolName, setSchoolName] = useState("");
  const [schoolId, setSchoolId] = useState(schoolIdParam || "");
  const [tokenId, setTokenId] = useState("");

  const [form, setForm] = useState({
    guardian_name: "",
    registration_number: "",
    gender: "",
    date_of_birth: "",
    guardian_phone: "",
    guardian_email: "",
    address: "",
  });

  const handleValidatePin = async () => {
    if (!pin.trim()) {
      toast.error("Please enter your registration PIN");
      return;
    }
    setValidating(true);
    try {
      // Validate token
      let query = supabase
        .from("student_registration_tokens")
        .select("*, schools!student_registration_tokens_school_id_fkey(id, name)")
        .eq("token", pin.trim().toUpperCase())
        .eq("is_used", false);

      if (schoolIdParam) {
        query = query.eq("school_id", schoolIdParam);
      }

      const { data: tokenData, error } = await query.maybeSingle();

      if (error || !tokenData) {
        toast.error("Invalid or expired registration PIN");
        return;
      }

      setTokenId(tokenData.id);
      setSchoolId(tokenData.school_id);
      setSchoolName((tokenData.schools as any)?.name || "School");
      setStep("form");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setValidating(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.guardian_name || !form.gender) {
      toast.error("Please fill in required fields (Name, Gender)");
      return;
    }
    setSubmitting(true);
    try {
      // Insert student
      const { error: studentError } = await supabase
        .from("students")
        .insert({
          school_id: schoolId,
          guardian_name: form.guardian_name,
          registration_number: form.registration_number || null,
          gender: form.gender,
          date_of_birth: form.date_of_birth || null,
          guardian_phone: form.guardian_phone || null,
          guardian_email: form.guardian_email || null,
          address: form.address || null,
        });

      if (studentError) throw studentError;

      // Mark token as used
      await supabase
        .from("student_registration_tokens")
        .update({
          is_used: true,
          used_at: new Date().toISOString(),
          used_by_name: form.guardian_name,
          current_uses: 1,
        })
        .eq("id", tokenId);

      setStep("success");
      toast.success("Registration successful!");
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/20">
            <GraduationCap className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">New Student Registration</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {schoolName ? `Registering at ${schoolName}` : "Enter your PIN to begin"}
          </p>
        </div>

        {step === "pin" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <KeyRound className="w-5 h-5" />
                Enter Registration PIN
              </CardTitle>
              <CardDescription>
                Enter the registration PIN provided by your school to access the registration form
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Registration PIN</Label>
                <Input
                  placeholder="e.g., SR-ABCD-1234"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.toUpperCase())}
                  className="text-center text-lg font-mono tracking-wider"
                />
              </div>
              <Button className="w-full" onClick={handleValidatePin} disabled={validating}>
                {validating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <KeyRound className="w-4 h-4 mr-2" />}
                Validate PIN
              </Button>
            </CardContent>
          </Card>
        )}

        {step === "form" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <UserPlus className="w-5 h-5" />
                Student Details
              </CardTitle>
              <CardDescription>Fill in the student information below</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input
                  placeholder="Student full name"
                  value={form.guardian_name}
                  onChange={(e) => setForm({ ...form, guardian_name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Gender *</Label>
                  <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date of Birth</Label>
                  <Input
                    type="date"
                    value={form.date_of_birth}
                    onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Registration Number</Label>
                <Input
                  placeholder="e.g., STU-2024-001 (optional)"
                  value={form.registration_number}
                  onChange={(e) => setForm({ ...form, registration_number: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Guardian Phone</Label>
                  <Input
                    placeholder="Phone number"
                    value={form.guardian_phone}
                    onChange={(e) => setForm({ ...form, guardian_phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Guardian Email</Label>
                  <Input
                    type="email"
                    placeholder="Email (optional)"
                    value={form.guardian_email}
                    onChange={(e) => setForm({ ...form, guardian_email: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input
                  placeholder="Home address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </div>
              <Button className="w-full" onClick={handleSubmit} disabled={submitting}>
                {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UserPlus className="w-4 h-4 mr-2" />}
                Submit Registration
              </Button>
            </CardContent>
          </Card>
        )}

        {step === "success" && (
          <Card className="text-center">
            <CardContent className="pt-8 pb-8">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Registration Successful!</h3>
              <p className="text-muted-foreground text-sm mb-4">
                {form.guardian_name} has been registered at {schoolName}. The school administration will assign a class.
              </p>
              <p className="text-xs text-muted-foreground">You can close this page now.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StudentRegistration;
