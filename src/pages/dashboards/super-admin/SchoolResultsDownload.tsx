import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { generateResultPDF } from "@/utils/generateResultPDF";
import { Download, FileDown, Search, GraduationCap } from "lucide-react";

const SchoolResultsDownload = () => {
  const [schoolId, setSchoolId] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>("all");
  const [termId, setTermId] = useState<string>("all");
  const [classId, setClassId] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [downloading, setDownloading] = useState<string | null>(null);
  const [bulkLoading, setBulkLoading] = useState(false);

  const { data: schools } = useQuery({
    queryKey: ["sa-schools-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("schools")
        .select("id, name, logo_url, address, state, email, phone")
        .order("name");
      if (error) throw error;
      return data || [];
    },
  });

  const school = schools?.find((s) => s.id === schoolId);

  const { data: sessions } = useQuery({
    queryKey: ["sa-sessions", schoolId],
    queryFn: async () => {
      const { data } = await supabase.from("academic_sessions").select("id, name").eq("school_id", schoolId).order("name");
      return data || [];
    },
    enabled: !!schoolId,
  });

  const { data: terms } = useQuery({
    queryKey: ["sa-terms", schoolId],
    queryFn: async () => {
      const { data } = await supabase.from("academic_terms").select("id, name").eq("school_id", schoolId).order("name");
      return data || [];
    },
    enabled: !!schoolId,
  });

  const { data: classes } = useQuery({
    queryKey: ["sa-classes", schoolId],
    queryFn: async () => {
      const { data } = await supabase.from("classes").select("id, name").eq("school_id", schoolId).order("name");
      return data || [];
    },
    enabled: !!schoolId,
  });

  const { data: results, isLoading } = useQuery({
    queryKey: ["sa-results", schoolId, sessionId, termId, classId],
    queryFn: async () => {
      let q = supabase
        .from("student_term_results")
        .select(`
          *,
          students!inner (id, registration_number, guardian_name, gender),
          classes (id, name)
        `)
        .eq("school_id", schoolId)
        .order("created_at", { ascending: false });

      if (sessionId !== "all") q = q.eq("session_id", sessionId);
      if (termId !== "all") q = q.eq("term_id", termId);
      if (classId !== "all") q = q.eq("class_id", classId);

      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    },
    enabled: !!schoolId,
  });

  const filtered = (results || []).filter((r: any) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      r.students?.registration_number?.toLowerCase().includes(s) ||
      r.students?.guardian_name?.toLowerCase().includes(s) ||
      r.classes?.name?.toLowerCase().includes(s)
    );
  });

  const buildPdfInput = async (result: any) => {
    const { data: subjectData } = await supabase
      .from("student_subject_results")
      .select("*")
      .eq("term_result_id", result.id)
      .order("subject_name");

    let sessionName = "";
    let termName = "";
    if (result.session_id) {
      const { data } = await supabase.from("academic_sessions").select("name").eq("id", result.session_id).maybeSingle();
      sessionName = data?.name || "";
    }
    if (result.term_id) {
      const { data } = await supabase.from("academic_terms").select("name").eq("id", result.term_id).maybeSingle();
      termName = data?.name || "";
    }

    const ratings =
      typeof result.behavioral_ratings === "string"
        ? JSON.parse(result.behavioral_ratings)
        : result.behavioral_ratings || {};

    return {
      schoolName: school?.name || "School",
      schoolAddress: [school?.address, school?.state].filter(Boolean).join(", "),
      schoolLogoUrl: school?.logo_url || undefined,
      schoolEmail: school?.email || undefined,
      schoolPhone: school?.phone || undefined,
      studentName: result.students?.guardian_name || result.students?.registration_number || "Student",
      registrationNumber: result.students?.registration_number || "N/A",
      className: result.classes?.name || "N/A",
      gender: result.students?.gender || undefined,
      sessionName,
      termName,
      subjects: subjectData || [],
      totalScore: result.total_score,
      averageScore: result.average_score,
      position: result.position,
      outOf: result.out_of,
      attendancePresent: result.attendance_present || 0,
      attendanceTotal: result.attendance_total || 0,
      teacherRemarks: result.teacher_remarks,
      principalRemarks: result.principal_remarks,
      behavioralRatings: ratings,
    };
  };

  const handleDownloadOne = async (result: any) => {
    try {
      setDownloading(result.id);
      const input = await buildPdfInput(result);
      await generateResultPDF(input);
      toast.success("Downloaded");
    } catch (e: any) {
      toast.error("Failed to download: " + (e?.message || "error"));
    } finally {
      setDownloading(null);
    }
  };

  const handleDownloadAll = async () => {
    if (!filtered.length) return;
    setBulkLoading(true);
    try {
      for (const r of filtered) {
        const input = await buildPdfInput(r);
        await generateResultPDF(input);
        // small delay so browser doesn't block downloads
        await new Promise((res) => setTimeout(res, 400));
      }
      toast.success(`Downloaded ${filtered.length} result(s)`);
    } catch (e: any) {
      toast.error("Bulk download failed: " + (e?.message || "error"));
    } finally {
      setBulkLoading(false);
    }
  };

  return (
    <DashboardLayout role="super_admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">School Results Download</h1>
          <p className="text-muted-foreground">
            Download official student result PDFs for any school — no token required.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label>School</Label>
                <Select value={schoolId} onValueChange={(v) => { setSchoolId(v); setSessionId("all"); setTermId("all"); setClassId("all"); }}>
                  <SelectTrigger><SelectValue placeholder="Select a school" /></SelectTrigger>
                  <SelectContent>
                    {schools?.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Session</Label>
                <Select value={sessionId} onValueChange={setSessionId} disabled={!schoolId}>
                  <SelectTrigger><SelectValue placeholder="All sessions" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All sessions</SelectItem>
                    {sessions?.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Term</Label>
                <Select value={termId} onValueChange={setTermId} disabled={!schoolId}>
                  <SelectTrigger><SelectValue placeholder="All terms" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All terms</SelectItem>
                    {terms?.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Class</Label>
                <Select value={classId} onValueChange={setClassId} disabled={!schoolId}>
                  <SelectTrigger><SelectValue placeholder="All classes" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All classes</SelectItem>
                    {classes?.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search reg no, name, or class" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
              </div>
              <Button onClick={handleDownloadAll} disabled={!schoolId || !filtered.length || bulkLoading}>
                <FileDown className="w-4 h-4 mr-2" />
                {bulkLoading ? "Downloading..." : `Download All (${filtered.length})`}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <GraduationCap className="w-4 h-4" /> Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!schoolId ? (
              <p className="text-sm text-muted-foreground py-8 text-center">Select a school to view its results.</p>
            ) : isLoading ? (
              <p className="text-sm text-muted-foreground py-8 text-center">Loading...</p>
            ) : filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No results match the current filters.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50 text-left text-xs uppercase text-muted-foreground">
                      <th className="py-2 pr-4">Reg No</th>
                      <th className="py-2 pr-4">Student</th>
                      <th className="py-2 pr-4">Class</th>
                      <th className="py-2 pr-4">Average</th>
                      <th className="py-2 pr-4">Position</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r: any) => (
                      <tr key={r.id} className="border-b border-border/30">
                        <td className="py-2 pr-4 font-mono text-xs">{r.students?.registration_number || "—"}</td>
                        <td className="py-2 pr-4">{r.students?.guardian_name || "—"}</td>
                        <td className="py-2 pr-4">{r.classes?.name || "—"}</td>
                        <td className="py-2 pr-4">{r.average_score ?? "—"}%</td>
                        <td className="py-2 pr-4">{r.position ? `${r.position} / ${r.out_of || "—"}` : "—"}</td>
                        <td className="py-2 pr-4">
                          {r.is_published ? (
                            <Badge className="bg-success/10 text-success border-0">Published</Badge>
                          ) : (
                            <Badge className="bg-warning/10 text-warning border-0">Draft</Badge>
                          )}
                        </td>
                        <td className="py-2 pr-4 text-right">
                          <Button size="sm" variant="outline" onClick={() => handleDownloadOne(r)} disabled={downloading === r.id}>
                            <Download className="w-3.5 h-3.5 mr-1.5" />
                            {downloading === r.id ? "..." : "PDF"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SchoolResultsDownload;
