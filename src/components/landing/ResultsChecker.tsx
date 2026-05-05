import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useCheckResults, usePublicSchools } from "@/hooks/useTermResults";
import { generateResultPDF } from "@/utils/generateResultPDF";
import {
  Search,
  Download,
  Loader2,
  GraduationCap,
  AlertTriangle,
  ScrollText,
  KeyRound,
  Hash,
  School,
  CheckCircle2,
  ArrowRight,
  CalendarDays,
  BookOpen,
} from "lucide-react";

const ResultsChecker = () => {
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [token, setToken] = useState("");
  const [resultData, setResultData] = useState<any>(null);
  const [error, setError] = useState("");

  const [sessions, setSessions] = useState<any[]>([]);
  const [terms, setTerms] = useState<any[]>([]);

  const { data: schools } = usePublicSchools();
  const checkResults = useCheckResults();

  // Fetch sessions when school changes
  useEffect(() => {
    if (!selectedSchool) {
      setSessions([]);
      setSelectedSession("");
      setTerms([]);
      setSelectedTerm("");
      return;
    }
    const fetchSessions = async () => {
      const { data } = await supabase
        .from("academic_sessions")
        .select("id, name")
        .eq("school_id", selectedSchool)
        .order("name", { ascending: false });
      setSessions(data || []);
      setSelectedSession("");
      setTerms([]);
      setSelectedTerm("");
    };
    fetchSessions();
  }, [selectedSchool]);

  // Fetch terms when session changes
  useEffect(() => {
    if (!selectedSession) {
      setTerms([]);
      setSelectedTerm("");
      return;
    }
    const fetchTerms = async () => {
      const { data } = await supabase
        .from("academic_terms")
        .select("id, name")
        .eq("session_id", selectedSession)
        .order("name", { ascending: true });
      setTerms(data || []);
      setSelectedTerm("");
    };
    fetchTerms();
  }, [selectedSession]);

  const handleCheck = async () => {
    setError("");
    setResultData(null);
    if (!registrationNumber || !selectedSchool || !token) {
      setError("Please fill in all fields");
      return;
    }
    try {
      const result = await checkResults.mutateAsync({
        registrationNumber: registrationNumber.trim(),
        schoolId: selectedSchool,
        token: token.trim(),
        sessionId: selectedSession || undefined,
        termId: selectedTerm || undefined,
      });
      setResultData(result);
    } catch (err: any) {
      setError(err.message || "Failed to check results");
    }
  };

  const handleDownloadPDF = () => {
    if (!resultData) return;
    const { student, termResult, subjectResults, school, className, sessionName, termName } = resultData;
    const behavioralRatings = typeof termResult.behavioral_ratings === "string"
      ? JSON.parse(termResult.behavioral_ratings)
      : termResult.behavioral_ratings || {};
    generateResultPDF({
      schoolName: school?.name || "School",
      schoolAddress: [school?.address, school?.state].filter(Boolean).join(", "),
      schoolLogoUrl: school?.logo_url || undefined,
      schoolEmail: school?.email || undefined,
      schoolPhone: school?.phone || undefined,
      studentName: `${student.guardian_name || student.registration_number}`,
      registrationNumber: student.registration_number,
      className,
      gender: student.gender || undefined,
      subjects: subjectResults,
      totalScore: termResult.total_score,
      averageScore: termResult.average_score,
      position: termResult.position,
      outOf: termResult.out_of,
      attendancePresent: termResult.attendance_present || 0,
      attendanceTotal: termResult.attendance_total || 0,
      teacherRemarks: termResult.teacher_remarks,
      principalRemarks: termResult.principal_remarks,
      behavioralRatings,
      sessionName,
      termName,
    });
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A": return "text-green-400 bg-green-400/10 border-green-400/30";
      case "B": return "text-blue-400 bg-blue-400/10 border-blue-400/30";
      case "C": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
      case "D": return "text-orange-400 bg-orange-400/10 border-orange-400/30";
      case "F": return "text-red-400 bg-red-400/10 border-red-400/30";
      default: return "text-white/50";
    }
  };

  return (
    <section id="check-results" className="relative -mt-24 z-20 pb-16 bg-[hsl(220,25%,8%)]">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="shadow-2xl shadow-primary/5 rounded-3xl overflow-hidden border border-white/[0.06] bg-white/[0.02] backdrop-blur-2xl">
            {/* Header */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-hero opacity-95" />
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djJIMjR2LTJoMTJ6bTAtNHYySDI0di0yaDEyem0wLTR2MkgyNHYtMmgxMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
              <div className="relative px-8 py-6 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/10">
                  <ScrollText className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Check Your Results</h2>
                  <p className="text-sm text-white/70">Enter your details to access your academic results instantly</p>
                </div>
                <div className="ml-auto hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span className="text-xs font-medium text-white/80">Secure & Verified</span>
                </div>
              </div>
            </div>

            <div className="p-8">
              {/* Row 1: School, Session, Term */}
              <div className="grid md:grid-cols-3 gap-5 mb-5">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                    <School className="w-3.5 h-3.5 text-primary" /> School
                  </Label>
                  <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                    <SelectTrigger className="h-12 bg-white/[0.05] border-white/[0.08] text-white rounded-xl hover:border-primary/30 transition-colors focus:ring-primary/30">
                      <SelectValue placeholder="Select your school" />
                    </SelectTrigger>
                    <SelectContent>
                      {schools?.map((school) => (
                        <SelectItem key={school.id} value={school.id}>{school.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                    <CalendarDays className="w-3.5 h-3.5 text-primary" /> Academic Year
                  </Label>
                  <Select value={selectedSession} onValueChange={setSelectedSession} disabled={!selectedSchool || sessions.length === 0}>
                    <SelectTrigger className="h-12 bg-white/[0.05] border-white/[0.08] text-white rounded-xl hover:border-primary/30 transition-colors focus:ring-primary/30 disabled:opacity-40">
                      <SelectValue placeholder={!selectedSchool ? "Select school first" : "Select year"} />
                    </SelectTrigger>
                    <SelectContent>
                      {sessions.map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-primary" /> Term
                  </Label>
                  <Select value={selectedTerm} onValueChange={setSelectedTerm} disabled={!selectedSession || terms.length === 0}>
                    <SelectTrigger className="h-12 bg-white/[0.05] border-white/[0.08] text-white rounded-xl hover:border-primary/30 transition-colors focus:ring-primary/30 disabled:opacity-40">
                      <SelectValue placeholder={!selectedSession ? "Select year first" : "Select term"} />
                    </SelectTrigger>
                    <SelectContent>
                      {terms.map((t) => (
                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 2: Reg Number, Token, Button */}
              <div className="grid md:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                    <Hash className="w-3.5 h-3.5 text-primary" /> Registration Number
                  </Label>
                  <Input
                    placeholder="e.g., STU-2024-001"
                    className="h-12 bg-white/[0.05] border-white/[0.08] text-white placeholder:text-white/25 rounded-xl hover:border-primary/30 transition-colors focus:ring-primary/30"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                    <KeyRound className="w-3.5 h-3.5 text-primary" /> Access Token
                  </Label>
                  <Input
                    placeholder="Enter your token"
                    className="h-12 bg-white/[0.05] border-white/[0.08] text-white placeholder:text-white/25 rounded-xl hover:border-primary/30 transition-colors focus:ring-primary/30"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                  />
                </div>

                <div className="flex items-end">
                  <Button
                    className="w-full h-12 font-bold rounded-xl text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all group"
                    onClick={handleCheck}
                    disabled={checkResults.isPending}
                  >
                    {checkResults.isPending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <Search className="h-5 w-5 mr-2" />
                        Check Results
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-3 p-4 mt-5 bg-red-500/8 border border-red-500/15 rounded-xl text-sm text-red-400">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <p className="text-[11px] text-white/25 mt-4 text-center">
                Tokens are issued by your school administration. Each token can only be used once.
              </p>
            </div>

            {/* Results */}
            {resultData && (
              <div className="px-8 pb-8">
                <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.04] to-transparent p-7">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center border border-primary/20">
                        <GraduationCap className="w-7 h-7 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          {resultData.student.guardian_name || resultData.student.registration_number}
                        </h3>
                        <p className="text-sm text-white/50">
                          {resultData.student.registration_number} · {resultData.className}
                        </p>
                        {(resultData.sessionName || resultData.termName) && (
                          <p className="text-xs text-primary/80 mt-1">
                            {resultData.sessionName}{resultData.termName ? ` — ${resultData.termName}` : ""}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={handleDownloadPDF} className="rounded-xl bg-white/[0.06] border-white/[0.1] text-white hover:bg-white/[0.12] gap-2">
                      <Download className="w-4 h-4" /> Download PDF
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {resultData.school?.show_average !== false && (
                      <div className="bg-white/[0.04] rounded-2xl p-4 text-center border border-white/[0.06]">
                        <p className="text-3xl font-extrabold text-primary">{resultData.termResult.average_score}%</p>
                        <p className="text-xs text-white/40 font-medium mt-1">Average Score</p>
                      </div>
                    )}
                    {resultData.school?.show_position !== false && (
                      <div className="bg-white/[0.04] rounded-2xl p-4 text-center border border-white/[0.06]">
                        <p className="text-3xl font-extrabold text-white">
                          {resultData.termResult.position ? `${resultData.termResult.position}${getOrdinal(resultData.termResult.position)}` : "N/A"}
                        </p>
                        <p className="text-xs text-white/40 font-medium mt-1">Position of {resultData.termResult.out_of}</p>
                      </div>
                    )}
                    <div className="bg-white/[0.04] rounded-2xl p-4 text-center border border-white/[0.06]">
                      <p className="text-3xl font-extrabold text-accent">{resultData.termResult.total_score}</p>
                      <p className="text-xs text-white/40 font-medium mt-1">Total Score</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-white/[0.04]">
                          <th className="text-left py-3 px-4 font-bold text-white/70 text-xs uppercase tracking-wider">Subject</th>
                          <th className="text-center py-3 px-2 font-bold text-white/70 text-xs uppercase tracking-wider">CA</th>
                          <th className="text-center py-3 px-2 font-bold text-white/70 text-xs uppercase tracking-wider">Exam</th>
                          <th className="text-center py-3 px-2 font-bold text-white/70 text-xs uppercase tracking-wider">Total</th>
                          {resultData.school?.show_grade !== false && (
                            <th className="text-center py-3 px-2 font-bold text-white/70 text-xs uppercase tracking-wider">Grade</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {resultData.subjectResults.map((sr: any, i: number) => (
                          <tr key={i} className="border-t border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                            <td className="py-3 px-4 font-medium text-white/80">{sr.subject_name}</td>
                            <td className="text-center py-3 px-2 text-white/60">{sr.ca1_score}</td>
                            <td className="text-center py-3 px-2 text-white/60">{sr.exam_score}</td>
                            <td className="text-center py-3 px-2 font-bold text-white">{sr.total_score}</td>
                            {resultData.school?.show_grade !== false && (
                              <td className="text-center py-3 px-2">
                                <Badge variant="outline" className={`text-xs font-bold ${getGradeColor(sr.grade)}`}>
                                  {sr.grade}
                                </Badge>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {(resultData.termResult.teacher_remarks || resultData.termResult.principal_remarks) && (
                    <div className="mt-5 space-y-3 border-t border-white/[0.06] pt-5">
                      {resultData.termResult.teacher_remarks && (
                        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                          <p className="text-xs font-bold text-primary/80 uppercase tracking-wider mb-1">Teacher's Remarks</p>
                          <p className="text-sm text-white/60 italic">{resultData.termResult.teacher_remarks}</p>
                        </div>
                      )}
                      {resultData.termResult.principal_remarks && (
                        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                          <p className="text-xs font-bold text-primary/80 uppercase tracking-wider mb-1">Principal's Remarks</p>
                          <p className="text-sm text-white/60 italic">{resultData.termResult.principal_remarks}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

function getOrdinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

export default ResultsChecker;
