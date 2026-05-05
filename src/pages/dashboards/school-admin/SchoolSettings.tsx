import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSchoolDetails } from "@/hooks/useSchoolAdminData";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Settings,
  Building2,
  BookOpen,
  Shield,
  Save,
  Loader2,
  Upload,
  Image,
  Eye,
} from "lucide-react";

const SchoolSettings = () => {
  const { schoolId } = useAuth();
  const { data: school, isLoading: schoolLoading } = useSchoolDetails();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // School profile form
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "Nigeria",
  });

  // Display settings
  const [displaySettings, setDisplaySettings] = useState({
    show_average: true,
    show_position: true,
    show_grade: true,
  });

  // Academic config
  const [academic, setAcademic] = useState<{
    academic_structure: "term_based" | "semester_based" | "continuous" | "course_based";
    assessment_style: "exam_based" | "oral_based" | "memorization_based" | "mixed" | "skill_based";
    grading_system: "percentage" | "gpa" | "cgpa" | "descriptive";
  }>({
    academic_structure: "term_based",
    assessment_style: "exam_based",
    grading_system: "percentage",
  });

  // Fetch modules
  const { data: modules, isLoading: modulesLoading } = useQuery({
    queryKey: ["school-modules", schoolId],
    queryFn: async () => {
      if (!schoolId) return null;
      const { data, error } = await supabase
        .from("school_modules")
        .select("*")
        .eq("school_id", schoolId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!schoolId,
  });

  const [moduleToggles, setModuleToggles] = useState({
    parent_portal_enabled: true,
    fees_management_enabled: true,
    memorization_tracking_enabled: false,
    attendance_enabled: true,
    library_enabled: false,
    hostel_enabled: false,
    transport_enabled: false,
  });

  useEffect(() => {
    if (school) {
      setProfile({
        name: school.name || "",
        email: school.email || "",
        phone: school.phone || "",
        address: school.address || "",
        city: school.city || "",
        state: school.state || "",
        country: school.country || "Nigeria",
      });
      setAcademic({
        academic_structure: (school.academic_structure as any) || "term_based",
        assessment_style: (school.assessment_style as any) || "exam_based",
        grading_system: (school.grading_system as any) || "percentage",
      });
      setDisplaySettings({
        show_average: (school as any).show_average ?? true,
        show_position: (school as any).show_position ?? true,
        show_grade: (school as any).show_grade ?? true,
      });
    }
  }, [school]);

  useEffect(() => {
    if (modules) {
      setModuleToggles({
        parent_portal_enabled: modules.parent_portal_enabled ?? true,
        fees_management_enabled: modules.fees_management_enabled ?? true,
        memorization_tracking_enabled: modules.memorization_tracking_enabled ?? false,
        attendance_enabled: modules.attendance_enabled ?? true,
        library_enabled: modules.library_enabled ?? false,
        hostel_enabled: modules.hostel_enabled ?? false,
        transport_enabled: modules.transport_enabled ?? false,
      });
    }
  }, [modules]);

  const handleSaveProfile = async () => {
    if (!schoolId) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("schools")
        .update(profile)
        .eq("id", schoolId);
      if (error) throw error;
      toast.success("School profile updated");
      queryClient.invalidateQueries({ queryKey: ["school-details"] });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAcademic = async () => {
    if (!schoolId) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("schools")
        .update(academic)
        .eq("id", schoolId);
      if (error) throw error;
      toast.success("Academic settings updated");
      queryClient.invalidateQueries({ queryKey: ["school-details"] });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDisplaySettings = async () => {
    if (!schoolId) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("schools")
        .update(displaySettings as any)
        .eq("id", schoolId);
      if (error) throw error;
      toast.success("Display settings updated");
      queryClient.invalidateQueries({ queryKey: ["school-details"] });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleModule = async (key: string, value: boolean) => {
    if (!schoolId || !modules) return;
    setModuleToggles((prev) => ({ ...prev, [key]: value }));
    try {
      const { error } = await supabase
        .from("school_modules")
        .update({ [key]: value })
        .eq("school_id", schoolId);
      if (error) throw error;
      toast.success("Module setting updated");
      queryClient.invalidateQueries({ queryKey: ["school-modules"] });
    } catch (err: any) {
      toast.error(err.message);
      setModuleToggles((prev) => ({ ...prev, [key]: !value }));
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !schoolId) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${schoolId}/logo.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("school-logos")
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("school-logos")
        .getPublicUrl(path);

      const { error: updateError } = await supabase
        .from("schools")
        .update({ logo_url: urlData.publicUrl })
        .eq("id", schoolId);
      if (updateError) throw updateError;

      queryClient.invalidateQueries({ queryKey: ["school-details"] });
      toast.success("School logo uploaded successfully");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const isLoading = schoolLoading || modulesLoading;

  const moduleLabels: Record<string, { label: string; description: string }> = {
    parent_portal_enabled: { label: "Parent Portal", description: "Allow parents to view child progress" },
    fees_management_enabled: { label: "Fees Management", description: "Track and manage student fee payments" },
    memorization_tracking_enabled: { label: "Qur'an Memorization", description: "Track Hifz progress for students" },
    attendance_enabled: { label: "Attendance Tracking", description: "Record daily student attendance" },
    library_enabled: { label: "Library Management", description: "Manage school library and book loans" },
    hostel_enabled: { label: "Hostel Management", description: "Manage boarding house operations" },
    transport_enabled: { label: "Transport Management", description: "Manage school transport routes" },
  };

  return (
    <DashboardLayout role="school-admin">
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Settings className="w-6 h-6" />
            School Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your school profile, academic configuration, and modules
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* School Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  School Profile
                </CardTitle>
                <CardDescription>Basic information about your school</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Logo Upload */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                  <div className="w-20 h-20 rounded-xl bg-background border-2 border-dashed border-border flex items-center justify-center overflow-hidden">
                    {school?.logo_url ? (
                      <img src={school.logo_url} alt="School Logo" className="w-full h-full object-contain" />
                    ) : (
                      <Image className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">School Logo</p>
                    <p className="text-sm text-muted-foreground mb-2">Upload a logo (PNG, JPG, max 2MB)</p>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoUpload}
                        disabled={uploading}
                      />
                      <Button variant="outline" size="sm" asChild disabled={uploading}>
                        <span>
                          {uploading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Upload className="w-4 h-4 mr-1" />}
                          {uploading ? "Uploading..." : "Upload Logo"}
                        </span>
                      </Button>
                    </label>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>School Name</Label>
                    <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Input value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>State</Label>
                    <Input value={profile.state} onChange={(e) => setProfile({ ...profile, state: e.target.value })} />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={school?.status === "approved" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}>
                    {school?.status || "pending"}
                  </Badge>
                  <Badge variant="outline">{school?.subscription_plan?.replace("_", " ").toUpperCase() || "FREE"}</Badge>
                </div>
                <Separator />
                <Button onClick={handleSaveProfile} disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Profile
                </Button>
              </CardContent>
            </Card>

            {/* Academic Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Academic Configuration
                </CardTitle>
                <CardDescription>Configure how your school handles academics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Academic Structure</Label>
                    <Select value={academic.academic_structure} onValueChange={(v) => setAcademic({ ...academic, academic_structure: v as any })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="term_based">Term Based</SelectItem>
                        <SelectItem value="semester_based">Semester Based</SelectItem>
                        <SelectItem value="continuous">Continuous</SelectItem>
                        <SelectItem value="course_based">Course Based</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Assessment Style</Label>
                    <Select value={academic.assessment_style} onValueChange={(v) => setAcademic({ ...academic, assessment_style: v as any })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="exam_based">Exam Based</SelectItem>
                        <SelectItem value="oral_based">Oral Based</SelectItem>
                        <SelectItem value="memorization_based">Memorization Based</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                        <SelectItem value="skill_based">Skill Based</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Grading System</Label>
                    <Select value={academic.grading_system} onValueChange={(v) => setAcademic({ ...academic, grading_system: v as any })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="gpa">GPA</SelectItem>
                        <SelectItem value="cgpa">CGPA</SelectItem>
                        <SelectItem value="descriptive">Descriptive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Separator />
                <Button onClick={handleSaveAcademic} disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Academic Settings
                </Button>
              </CardContent>
            </Card>

            {/* Result Display Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Result Display Settings
                </CardTitle>
                <CardDescription>Control what information appears on student result cards</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {[
                    { key: "show_average", label: "Show Average Score", description: "Display the average percentage on result cards" },
                    { key: "show_position", label: "Show Class Position", description: "Display the student's position/ranking in class" },
                    { key: "show_grade", label: "Show Letter Grades", description: "Display letter grades (A, B, C, etc.) per subject" },
                  ].map(({ key, label, description }) => (
                    <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                      <div>
                        <p className="font-medium text-foreground">{label}</p>
                        <p className="text-sm text-muted-foreground">{description}</p>
                      </div>
                      <Switch
                        checked={displaySettings[key as keyof typeof displaySettings]}
                        onCheckedChange={(checked) => setDisplaySettings(prev => ({ ...prev, [key]: checked }))}
                      />
                    </div>
                  ))}
                </div>
                <Separator />
                <Button onClick={handleSaveDisplaySettings} disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Display Settings
                </Button>
              </CardContent>
            </Card>

            {/* Module Toggles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  School Modules
                </CardTitle>
                <CardDescription>Enable or disable features for your school</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(moduleLabels).map(([key, { label, description }]) => (
                    <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                      <div>
                        <p className="font-medium text-foreground">{label}</p>
                        <p className="text-sm text-muted-foreground">{description}</p>
                      </div>
                      <Switch
                        checked={moduleToggles[key as keyof typeof moduleToggles]}
                        onCheckedChange={(checked) => handleToggleModule(key, checked)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SchoolSettings;
