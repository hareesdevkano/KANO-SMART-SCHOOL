import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  FileText,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  Download,
} from "lucide-react";
import { format } from "date-fns";
import {
  useStudentProfile,
  useStudentAttendance,
  useStudentScores,
  useStudentStats,
  useStudentTermResults,
} from "@/hooks/useStudentData";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { generateResultPDF } from "@/utils/generateResultPDF";
import { toast } from "sonner";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
};

const StudentProfile = () => {
  const { user, schoolId } = useAuth();
  const { data: profile, isLoading: profileLoading } = useStudentProfile();
  const { data: attendance, isLoading: attendanceLoading } = useStudentAttendance();
  const { data: scores, isLoading: scoresLoading } = useStudentScores();
  const { data: stats, isLoading: statsLoading } = useStudentStats();
  const { data: termResults, isLoading: termResultsLoading } = useStudentTermResults();

  const [schoolInfo, setSchoolInfo] = useState<any>(null);

  useEffect(() => {
    if (schoolId) {
      supabase.from("schools").select("name, logo_url, address, state, email, phone")
        .eq("id", schoolId).maybeSingle().then(({ data }) => setSchoolInfo(data));
    }
  }, [schoolId]);

  const getAttendanceStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-success/10 text-success border-success/30";
      case "absent":
        return "bg-destructive/10 text-destructive border-destructive/30";
      case "late":
        return "bg-warning/10 text-warning border-warning/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getAttendanceIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="w-4 h-4" />;
      case "absent":
        return <XCircle className="w-4 h-4" />;
      case "late":
        return <Clock className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getGrade = (percentage: number) => {
    if (percentage >= 70) return { grade: "A", color: "text-success" };
    if (percentage >= 60) return { grade: "B", color: "text-primary" };
    if (percentage >= 50) return { grade: "C", color: "text-warning" };
    if (percentage >= 40) return { grade: "D", color: "text-orange-500" };
    return { grade: "F", color: "text-destructive" };
  };

  const handleDownloadResult = async (result: any) => {
    try {
      const { data: subjectData } = await supabase
        .from("student_subject_results")
        .select("*")
        .eq("term_result_id", result.id)
        .order("subject_name");

      const ratings = typeof result.behavioral_ratings === "string"
        ? JSON.parse(result.behavioral_ratings) : result.behavioral_ratings;

      await generateResultPDF({
        schoolName: schoolInfo?.name || "School",
        schoolAddress: [schoolInfo?.address, schoolInfo?.state].filter(Boolean).join(", "),
        schoolLogoUrl: schoolInfo?.logo_url || undefined,
        schoolEmail: schoolInfo?.email,
        schoolPhone: schoolInfo?.phone,
        studentName: profile?.guardian_name || "Student",
        registrationNumber: profile?.registration_number || "N/A",
        className: result.classes?.name || "N/A",
        gender: profile?.gender || undefined,
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
      toast.success("Result PDF downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download result PDF");
    }
  };

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        {/* Profile Header */}
        <Card className="bg-gradient-primary border-0 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <User className="w-12 h-12 md:w-16 md:h-16 text-primary-foreground" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-primary-foreground">
                {profileLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-8 w-64 bg-primary-foreground/20" />
                    <Skeleton className="h-5 w-48 bg-primary-foreground/20" />
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">
                      {profile?.guardian_name || user?.email?.split("@")[0] || "Student"}
                    </h1>
                    <div className="flex flex-wrap gap-4 text-primary-foreground/80 mb-4">
                      <span className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        {(profile?.classes as any)?.name || "Not Assigned"}
                      </span>
                      <span className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        {(profile?.classes as any)?.academic_levels?.name || "N/A"}
                      </span>
                      <span className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        {profile?.registration_number || "N/A"}
                      </span>
                    </div>
                    <Badge className="bg-primary-foreground/20 text-primary-foreground border-0">
                      Active Student
                    </Badge>
                  </>
                )}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <div className="text-center p-3 rounded-xl bg-primary-foreground/10">
                  <ClipboardCheck className="w-6 h-6 mx-auto mb-1 text-primary-foreground" />
                  <p className="text-2xl font-bold text-primary-foreground">
                    {statsLoading ? "-" : `${stats?.attendanceRate || 0}%`}
                  </p>
                  <p className="text-xs text-primary-foreground/70">Attendance</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-primary-foreground/10">
                  <TrendingUp className="w-6 h-6 mx-auto mb-1 text-primary-foreground" />
                  <p className="text-2xl font-bold text-primary-foreground">
                    {statsLoading ? "-" : `${stats?.averageScore || 0}%`}
                  </p>
                  <p className="text-xs text-primary-foreground/70">Avg Score</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-primary-foreground/10">
                  <Award className="w-6 h-6 mx-auto mb-1 text-primary-foreground" />
                  <p className="text-2xl font-bold text-primary-foreground">
                    {statsLoading ? "-" : stats?.totalAssessments || 0}
                  </p>
                  <p className="text-xs text-primary-foreground/70">Exams Taken</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-primary-foreground/10">
                  <FileText className="w-6 h-6 mx-auto mb-1 text-primary-foreground" />
                  <p className="text-2xl font-bold text-primary-foreground">
                    {statsLoading ? "-" : formatCurrency(stats?.totalPaid || 0)}
                  </p>
                  <p className="text-xs text-primary-foreground/70">Fees Paid</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details and Records */}
        <Tabs defaultValue="details" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="details" className="gap-2">
              <User className="w-4 h-4 hidden sm:inline" />
              Details
            </TabsTrigger>
            <TabsTrigger value="attendance" className="gap-2">
              <ClipboardCheck className="w-4 h-4 hidden sm:inline" />
              Attendance
            </TabsTrigger>
            <TabsTrigger value="academic" className="gap-2">
              <FileText className="w-4 h-4 hidden sm:inline" />
              Scores
            </TabsTrigger>
            <TabsTrigger value="results" className="gap-2">
              <Award className="w-4 h-4 hidden sm:inline" />
              Results
            </TabsTrigger>
          </TabsList>

          {/* Personal Details Tab */}
          <TabsContent value="details">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Student Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profileLoading ? (
                    Array(5).fill(0).map((_, i) => (
                      <div key={i} className="flex justify-between">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-5 w-32" />
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">Full Name</span>
                        <span className="font-medium">{profile?.guardian_name || "N/A"}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">Registration No</span>
                        <span className="font-medium">{profile?.registration_number || "N/A"}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">Gender</span>
                        <span className="font-medium capitalize">{profile?.gender || "N/A"}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">Date of Birth</span>
                        <span className="font-medium">
                          {profile?.date_of_birth ? format(new Date(profile.date_of_birth), "MMM dd, yyyy") : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">Admission Date</span>
                        <span className="font-medium">
                          {profile?.admission_date ? format(new Date(profile.admission_date), "MMM dd, yyyy") : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Class</span>
                        <span className="font-medium">{(profile?.classes as any)?.name || "Not Assigned"}</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Phone className="w-5 h-5 text-primary" />
                    Guardian Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profileLoading ? (
                    Array(4).fill(0).map((_, i) => (
                      <div key={i} className="flex justify-between">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-5 w-32" />
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <User className="w-4 h-4" /> Guardian Name
                        </span>
                        <span className="font-medium">{profile?.guardian_name || "N/A"}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Phone className="w-4 h-4" /> Phone Number
                        </span>
                        <span className="font-medium">{profile?.guardian_phone || "N/A"}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Mail className="w-4 h-4" /> Email
                        </span>
                        <span className="font-medium">{profile?.guardian_email || "N/A"}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <MapPin className="w-4 h-4" /> Address
                        </span>
                        <span className="font-medium text-right max-w-[200px]">{profile?.address || "N/A"}</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5 text-primary" />
                  Attendance History
                </CardTitle>
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  {statsLoading ? "-" : `${stats?.attendanceRate || 0}%`} Overall
                </Badge>
              </CardHeader>
              <CardContent>
                {attendanceLoading ? (
                  <div className="space-y-3">
                    {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                  </div>
                ) : attendance && attendance.length > 0 ? (
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Class</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Remarks</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {attendance.map((record: any) => (
                          <TableRow key={record.id}>
                            <TableCell className="font-medium">
                              {format(new Date(record.date), "MMM dd, yyyy")}
                            </TableCell>
                            <TableCell>{(record.classes as any)?.name || "N/A"}</TableCell>
                            <TableCell>
                              <Badge className={getAttendanceStatusColor(record.status)}>
                                <span className="flex items-center gap-1">
                                  {getAttendanceIcon(record.status)}
                                  <span className="capitalize">{record.status}</span>
                                </span>
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{record.remarks || "-"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ClipboardCheck className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground">No Attendance Records</h3>
                    <p className="text-sm text-muted-foreground/70">Your attendance history will appear here.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Academic Records Tab */}
          <TabsContent value="academic">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Academic Scores
                </CardTitle>
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  Average: {statsLoading ? "-" : `${stats?.averageScore || 0}%`}
                </Badge>
              </CardHeader>
              <CardContent>
                {scoresLoading ? (
                  <div className="space-y-3">
                    {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
                  </div>
                ) : scores && scores.length > 0 ? (
                  <div className="space-y-4">
                    {scores.map((score: any) => {
                      const assessment = score.assessments as any;
                      const maxScore = assessment?.max_score || 100;
                      const percentage = Math.round((score.score / maxScore) * 100);
                      const gradeInfo = getGrade(percentage);

                      return (
                        <div key={score.id} className="p-4 rounded-xl bg-muted/50 border border-border">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                            <div>
                              <h3 className="font-semibold text-foreground">{assessment?.title || "Assessment"}</h3>
                              <p className="text-sm text-muted-foreground">
                                {assessment?.subjects?.name || "N/A"} • <span className="capitalize">{assessment?.assessment_type || "exam"}</span>
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge className={`${gradeInfo.color} bg-transparent border`}>Grade: {gradeInfo.grade}</Badge>
                              <span className="text-lg font-bold">{score.score}/{maxScore}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Progress value={percentage} className="flex-1 h-2" />
                            <span className="text-sm font-medium text-muted-foreground w-12">{percentage}%</span>
                          </div>
                          {score.remarks && (
                            <p className="mt-2 text-sm text-muted-foreground italic">"{score.remarks}"</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground">No Academic Records</h3>
                    <p className="text-sm text-muted-foreground/70">Your exam scores will appear here.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Term Results Tab - with PDF download */}
          <TabsContent value="results">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Published Term Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                {termResultsLoading ? (
                  <div className="space-y-3">
                    {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
                  </div>
                ) : termResults && termResults.length > 0 ? (
                  <div className="space-y-4">
                    {termResults.map((result: any) => {
                      const ratings = typeof result.behavioral_ratings === "string"
                        ? JSON.parse(result.behavioral_ratings) : result.behavioral_ratings;

                      return (
                        <div key={result.id} className="p-5 rounded-xl bg-muted/50 border border-border">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                            <div>
                              <h3 className="font-bold text-foreground text-lg">
                                {result.classes?.name || "Class"}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Published on {format(new Date(result.created_at), "MMM dd, yyyy")}
                              </p>
                            </div>
                            <Button onClick={() => handleDownloadResult(result)} className="gap-2">
                              <Download className="w-4 h-4" />
                              Download PDF
                            </Button>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="p-3 rounded-lg bg-background border border-border text-center">
                              <p className="text-2xl font-bold text-primary">{result.average_score}%</p>
                              <p className="text-xs text-muted-foreground">Average</p>
                            </div>
                            <div className="p-3 rounded-lg bg-background border border-border text-center">
                              <p className="text-2xl font-bold text-foreground">{result.total_score}</p>
                              <p className="text-xs text-muted-foreground">Total Score</p>
                            </div>
                            <div className="p-3 rounded-lg bg-background border border-border text-center">
                              <p className="text-2xl font-bold text-foreground">
                                {result.position ? `${result.position}${getOrd(result.position)}` : "N/A"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Position {result.out_of ? `of ${result.out_of}` : ""}
                              </p>
                            </div>
                            <div className="p-3 rounded-lg bg-background border border-border text-center">
                              <p className="text-2xl font-bold text-foreground">
                                {result.attendance_total > 0
                                  ? Math.round((result.attendance_present / result.attendance_total) * 100)
                                  : 0}%
                              </p>
                              <p className="text-xs text-muted-foreground">Attendance</p>
                            </div>
                          </div>

                          {(result.teacher_remarks || result.principal_remarks) && (
                            <div className="mt-4 space-y-2">
                              {result.teacher_remarks && (
                                <p className="text-sm text-muted-foreground">
                                  <span className="font-semibold text-foreground">Teacher:</span>{" "}
                                  <span className="italic">"{result.teacher_remarks}"</span>
                                </p>
                              )}
                              {result.principal_remarks && (
                                <p className="text-sm text-muted-foreground">
                                  <span className="font-semibold text-foreground">Principal:</span>{" "}
                                  <span className="italic">"{result.principal_remarks}"</span>
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Award className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground">No Published Results</h3>
                    <p className="text-sm text-muted-foreground/70">
                      Your term results will appear here once published by your teacher.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

function getOrd(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

export default StudentProfile;
