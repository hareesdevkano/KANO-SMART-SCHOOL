import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs";
import {
  useTeacherClasses, useTeacherSubjects, useClassStudents,
} from "@/hooks/useTeacherData";
import {
  useClassTermResults, useSubjectResults, useSaveTermResult, usePublishResults,
  type SubjectResult,
} from "@/hooks/useTermResults";
import { generateResultPDF } from "@/utils/generateResultPDF";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  FileText, Save, Award, Download, Send, Loader2, PenLine, Users, BookOpen,
} from "lucide-react";
import { toast } from "sonner";

const BEHAVIORAL_TRAITS = [
  { key: "punctuality", label: "Punctuality" },
  { key: "neatness", label: "Neatness" },
  { key: "conduct", label: "Conduct" },
  { key: "attentiveness", label: "Attentiveness" },
  { key: "perseverance", label: "Perseverance" },
  { key: "relationship_with_others", label: "Relationship with Others" },
  { key: "honesty", label: "Honesty" },
];

const getGrade = (total: number) => {
  if (total >= 70) return "A";
  if (total >= 60) return "B";
  if (total >= 50) return "C";
  if (total >= 40) return "D";
  return "F";
};

const getGradeColor = (grade: string) => {
  switch (grade) {
    case "A": return "text-green-600";
    case "B": return "text-blue-600";
    case "C": return "text-yellow-600";
    case "D": return "text-orange-600";
    case "F": return "text-destructive";
    default: return "";
  }
};

const TeacherResults = () => {
  const { schoolId } = useAuth();
  const { data: classes } = useTeacherClasses();
  const { data: subjects } = useTeacherSubjects();

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [isEntryOpen, setIsEntryOpen] = useState(false);

  const { data: classStudents } = useClassStudents(selectedClass || null);
  const { data: classResults, isLoading: resultsLoading } = useClassTermResults(selectedClass || null);
  const saveTermResult = useSaveTermResult();
  const publishResults = usePublishResults();

  // Entry form state
  const [subjectResults, setSubjectResults] = useState<SubjectResult[]>([]);
  const [attendancePresent, setAttendancePresent] = useState(0);
  const [attendanceTotal, setAttendanceTotal] = useState(0);
  const [teacherRemarks, setTeacherRemarks] = useState("");
  const [principalRemarks, setPrincipalRemarks] = useState("");
  const [behavioralRatings, setBehavioralRatings] = useState<Record<string, number>>({
    punctuality: 3, neatness: 3, conduct: 3, attentiveness: 3,
    perseverance: 3, relationship_with_others: 3, honesty: 3,
  });

  // School info for PDF
  const [schoolInfo, setSchoolInfo] = useState<any>(null);
  useEffect(() => {
    if (schoolId) {
      supabase.from("schools").select("name, logo_url, address, state, email, phone")
        .eq("id", schoolId).maybeSingle().then(({ data }) => setSchoolInfo(data));
    }
  }, [schoolId]);

  const handleOpenEntry = (studentId: string) => {
    setSelectedStudent(studentId);
    // Initialize subjects
    if (subjects && subjects.length > 0) {
      setSubjectResults(subjects.map(s => ({
        subject_id: s.id,
        subject_name: s.name,
        ca1_score: 0,
        ca2_score: 0,
        exam_score: 0,
        total_score: 0,
        grade: "F",
      })));
    }
    // Check if existing results
    const existing = classResults?.find((r: any) => r.student_id === studentId);
    if (existing) {
      setAttendancePresent(existing.attendance_present || 0);
      setAttendanceTotal(existing.attendance_total || 0);
      setTeacherRemarks(existing.teacher_remarks || "");
      setPrincipalRemarks(existing.principal_remarks || "");
      const ratings = typeof existing.behavioral_ratings === "string"
        ? JSON.parse(existing.behavioral_ratings)
        : existing.behavioral_ratings;
      if (ratings) setBehavioralRatings(ratings);

      // Load existing subject results
      supabase.from("student_subject_results")
        .select("*")
        .eq("term_result_id", existing.id)
        .order("subject_name")
        .then(({ data }) => {
          if (data && data.length > 0) {
            setSubjectResults(data.map(d => ({
              subject_id: d.subject_id || undefined,
              subject_name: d.subject_name,
              ca1_score: Number(d.ca1_score) || 0,
              ca2_score: Number(d.ca2_score) || 0,
              exam_score: Number(d.exam_score) || 0,
              total_score: Number(d.total_score) || 0,
              grade: d.grade || "F",
            })));
          }
        });
    } else {
      setAttendancePresent(0);
      setAttendanceTotal(0);
      setTeacherRemarks("");
      setPrincipalRemarks("");
      setBehavioralRatings({
        punctuality: 3, neatness: 3, conduct: 3, attentiveness: 3,
        perseverance: 3, relationship_with_others: 3, honesty: 3,
      });
    }
    setIsEntryOpen(true);
  };

  const handleScoreChange = (index: number, field: "ca1_score" | "ca2_score" | "exam_score", value: number) => {
    setSubjectResults(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      const total = updated[index].ca1_score + updated[index].ca2_score + updated[index].exam_score;
      updated[index].total_score = total;
      updated[index].grade = getGrade(total);
      return updated;
    });
  };

  const handleSave = async () => {
    if (!selectedStudent || !selectedClass) return;
    await saveTermResult.mutateAsync({
      studentId: selectedStudent,
      classId: selectedClass,
      subjectResults,
      attendancePresent,
      attendanceTotal,
      teacherRemarks,
      principalRemarks,
      behavioralRatings,
    });
    setIsEntryOpen(false);
  };

  const handlePublish = async () => {
    if (!selectedClass) return;
    await publishResults.mutateAsync({ classId: selectedClass });
  };

  const handleExportCSV = async () => {
    if (!classResults?.length || !classStudents?.length) return;
    try {
      // Get all subject results for this class
      const resultIds = classResults.map((r: any) => r.id);
      const { data: allSubjects } = await supabase
        .from("student_subject_results")
        .select("*")
        .in("term_result_id", resultIds)
        .order("subject_name");

      // Build CSV
      const subjectNames = [...new Set(allSubjects?.map(s => s.subject_name) || [])];
      const headers = ["Reg No", "Name", "Gender", ...subjectNames.flatMap(s => [`${s} CA1`, `${s} CA2`, `${s} Exam`, `${s} Total`, `${s} Grade`]), "Average", "Position"];
      
      const rows = classStudents.map(student => {
        const result = classResults.find((r: any) => r.student_id === student.id);
        const studentSubjects = allSubjects?.filter(s => s.term_result_id === result?.id) || [];
        
        const subjectCols = subjectNames.flatMap(name => {
          const sr = studentSubjects.find(s => s.subject_name === name);
          return sr ? [sr.ca1_score, sr.ca2_score, sr.exam_score, sr.total_score, sr.grade] : ["", "", "", "", ""];
        });

        return [
          student.registration_number || "",
          student.guardian_name || "",
          student.gender || "",
          ...subjectCols,
          result?.average_score || "",
          result?.position || "",
        ];
      });

      const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `results-${selectedClassName || "class"}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("CSV exported");
    } catch {
      toast.error("Failed to export CSV");
    }
  };

  const handleDownloadPDF = async (result: any) => {
    const { data: subjectData } = await supabase
      .from("student_subject_results")
      .select("*")
      .eq("term_result_id", result.id)
      .order("subject_name");

    const student = result.students;
    const ratings = typeof result.behavioral_ratings === "string"
      ? JSON.parse(result.behavioral_ratings) : result.behavioral_ratings;

    generateResultPDF({
      schoolName: schoolInfo?.name || "School",
      schoolAddress: [schoolInfo?.address, schoolInfo?.state].filter(Boolean).join(", "),
      schoolLogoUrl: schoolInfo?.logo_url || undefined,
      schoolEmail: schoolInfo?.email,
      schoolPhone: schoolInfo?.phone,
      studentName: student?.guardian_name || student?.registration_number || "Student",
      registrationNumber: student?.registration_number || "N/A",
      className: result.classes?.name || "N/A",
      gender: student?.gender || undefined,
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
    });
  };

  const selectedClassName = classes?.find(c => c.id === selectedClass)?.name;

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Term Results Management</h1>
            <p className="text-muted-foreground">Enter student results with CA scores, exam scores, and behavioral assessments</p>
          </div>
        </div>

        {/* Class Selection */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 space-y-2">
                <Label>Select Class</Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a class to manage results" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes?.map(cls => (
                      <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedClass && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleExportCSV}
                    disabled={!classResults?.length}
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export CSV
                  </Button>
                  <Button
                    onClick={handlePublish}
                    disabled={publishResults.isPending || !classResults?.length}
                    className="gap-2"
                  >
                    {publishResults.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Publish & Calculate Positions
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Students List */}
        {selectedClass && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                {selectedClassName} — Students ({classStudents?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {classStudents && classStudents.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Reg. Number</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead>Average</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {classStudents.map((student, index) => {
                        const result = classResults?.find((r: any) => r.student_id === student.id);
                        return (
                          <TableRow key={student.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell className="font-medium">{student.registration_number || "-"}</TableCell>
                            <TableCell>{student.guardian_name || "-"}</TableCell>
                            <TableCell className="capitalize">{student.gender || "-"}</TableCell>
                            <TableCell>
                              {result ? (
                                <span className="font-bold">{result.average_score}%</span>
                              ) : "-"}
                            </TableCell>
                            <TableCell>
                              {result?.position ? (
                                <Badge variant="outline">{result.position}{getOrd(result.position)}</Badge>
                              ) : "-"}
                            </TableCell>
                            <TableCell>
                              {result ? (
                                result.is_published ? (
                                  <Badge className="bg-green-100 text-green-700 border-green-200">Published</Badge>
                                ) : (
                                  <Badge variant="secondary">Draft</Badge>
                                )
                              ) : (
                                <Badge variant="outline" className="text-muted-foreground">No Data</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button size="sm" variant="outline" onClick={() => handleOpenEntry(student.id)}>
                                  <PenLine className="w-3 h-3 mr-1" />
                                  {result ? "Edit" : "Enter"}
                                </Button>
                                {result && (
                                  <Button size="sm" variant="ghost" title="View results summary" disabled>
                                    <FileText className="w-3 h-3" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No students in this class</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Result Entry Dialog */}
        <Dialog open={isEntryOpen} onOpenChange={setIsEntryOpen}>
          <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Enter Student Results
              </DialogTitle>
              <DialogDescription>
                Student: {classStudents?.find(s => s.id === selectedStudent)?.registration_number || ""}
                {classStudents?.find(s => s.id === selectedStudent)?.guardian_name ? ` — ${classStudents.find(s => s.id === selectedStudent)?.guardian_name}` : ""}
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="scores" className="mt-2">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="scores">Subject Scores</TabsTrigger>
                <TabsTrigger value="behavioral">Behavioral</TabsTrigger>
                <TabsTrigger value="remarks">Remarks & Attendance</TabsTrigger>
              </TabsList>

              {/* Subject Scores Tab */}
              <TabsContent value="scores" className="space-y-2">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead className="text-center w-20">CA1 (20)</TableHead>
                        <TableHead className="text-center w-20">CA2 (20)</TableHead>
                        <TableHead className="text-center w-20">Exam (60)</TableHead>
                        <TableHead className="text-center w-16">Total</TableHead>
                        <TableHead className="text-center w-16">Grade</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subjectResults.map((sr, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{sr.subject_name}</TableCell>
                          <TableCell>
                            <Input
                              type="number" min="0" max="20"
                              value={sr.ca1_score}
                              onChange={e => handleScoreChange(i, "ca1_score", Math.min(20, Number(e.target.value)))}
                              className="w-16 text-center"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number" min="0" max="20"
                              value={sr.ca2_score}
                              onChange={e => handleScoreChange(i, "ca2_score", Math.min(20, Number(e.target.value)))}
                              className="w-16 text-center"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number" min="0" max="60"
                              value={sr.exam_score}
                              onChange={e => handleScoreChange(i, "exam_score", Math.min(60, Number(e.target.value)))}
                              className="w-16 text-center"
                            />
                          </TableCell>
                          <TableCell className="text-center font-bold">{sr.total_score}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className={getGradeColor(sr.grade)}>
                              {sr.grade}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* Behavioral Tab */}
              <TabsContent value="behavioral" className="space-y-4 py-4">
                {BEHAVIORAL_TRAITS.map(trait => (
                  <div key={trait.key} className="flex items-center gap-4">
                    <Label className="w-44 text-sm">{trait.label}</Label>
                    <Slider
                      value={[behavioralRatings[trait.key] || 3]}
                      onValueChange={([v]) => setBehavioralRatings(prev => ({ ...prev, [trait.key]: v }))}
                      min={1} max={5} step={1}
                      className="flex-1"
                    />
                    <Badge variant="outline" className="w-24 justify-center text-xs">
                      {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][behavioralRatings[trait.key] || 3]}
                    </Badge>
                  </div>
                ))}
              </TabsContent>

              {/* Remarks Tab */}
              <TabsContent value="remarks" className="space-y-4 py-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Days Present</Label>
                    <Input type="number" min="0" value={attendancePresent}
                      onChange={e => setAttendancePresent(Number(e.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Total School Days</Label>
                    <Input type="number" min="0" value={attendanceTotal}
                      onChange={e => setAttendanceTotal(Number(e.target.value))} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Class Teacher's Remark</Label>
                  <Textarea value={teacherRemarks} onChange={e => setTeacherRemarks(e.target.value)}
                    placeholder="e.g., An excellent student who shows great dedication..." rows={3} />
                </div>
                <div className="space-y-2">
                  <Label>Principal's Remark</Label>
                  <Textarea value={principalRemarks} onChange={e => setPrincipalRemarks(e.target.value)}
                    placeholder="e.g., Keep up the good work..." rows={3} />
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setIsEntryOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saveTermResult.isPending} className="gap-2">
                {saveTermResult.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saveTermResult.isPending ? "Saving..." : "Save Results"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

function getOrd(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

export default TeacherResults;
