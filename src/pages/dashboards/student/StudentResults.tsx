import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { useStudentTermResults } from "@/hooks/useStudentData";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Award, FileText, Eye } from "lucide-react";

const getGradeColor = (grade: string) => {
  switch (grade) {
    case "A": return "bg-success/10 text-success";
    case "B": return "bg-primary/10 text-primary";
    case "C": return "bg-warning/10 text-warning";
    case "D": return "bg-orange-100 text-orange-600";
    case "F": return "bg-destructive/10 text-destructive";
    default: return "";
  }
};

const StudentResults = () => {
  const { data: termResults, isLoading } = useStudentTermResults();
  const [expandedResult, setExpandedResult] = useState<string | null>(null);

  // Fetch subject results for expanded term result
  const { data: subjectResults } = useQuery({
    queryKey: ["subject-results", expandedResult],
    queryFn: async () => {
      if (!expandedResult) return [];
      const { data, error } = await supabase
        .from("student_subject_results")
        .select("*")
        .eq("term_result_id", expandedResult)
        .order("subject_name");
      if (error) throw error;
      return data || [];
    },
    enabled: !!expandedResult,
  });

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Award className="w-6 h-6" />
            My Results
          </h1>
          <p className="text-muted-foreground">View your term results and subject scores. Use a result token to download PDF.</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
          </div>
        ) : termResults && termResults.length > 0 ? (
          <Accordion
            type="single"
            collapsible
            value={expandedResult || ""}
            onValueChange={(val) => setExpandedResult(val || null)}
          >
            {termResults.map((result: any) => (
              <AccordionItem key={result.id} value={result.id} className="border rounded-xl bg-card mb-4 px-4">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-3 flex-1 text-left">
                    <Award className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <span className="font-semibold text-foreground">
                        {(result.academic_terms as any)?.name || "Term"} —{" "}
                        {(result.academic_terms as any)?.academic_sessions?.name || "Session"}
                      </span>
                      <span className="text-sm text-muted-foreground ml-3">
                        Class: {(result.classes as any)?.name || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mr-4">
                      <Badge className="bg-primary/10 text-primary">
                        Avg: {result.average_score?.toFixed(1) || 0}%
                      </Badge>
                      {result.position && (
                        <Badge variant="outline">
                          {result.position}/{result.out_of}
                        </Badge>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4">
                    {/* Subject scores table */}
                    {subjectResults && subjectResults.length > 0 ? (
                      <div className="rounded-lg border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Subject</TableHead>
                              <TableHead className="text-center">CA</TableHead>
                              <TableHead className="text-center">Exam</TableHead>
                              <TableHead className="text-center">Total</TableHead>
                              <TableHead className="text-center">Grade</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {subjectResults.map((sr: any) => (
                              <TableRow key={sr.id}>
                                <TableCell className="font-medium">{sr.subject_name}</TableCell>
                                <TableCell className="text-center">{sr.ca1_score}</TableCell>
                                <TableCell className="text-center">{sr.exam_score}</TableCell>
                                <TableCell className="text-center font-bold">{sr.total_score}</TableCell>
                                <TableCell className="text-center">
                                  <Badge className={getGradeColor(sr.grade || "F")}>{sr.grade}</Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Loading subject results...</p>
                    )}

                    {/* Summary */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="p-3 rounded-lg bg-muted/50 text-center">
                        <p className="text-xs text-muted-foreground">Total Score</p>
                        <p className="text-lg font-bold">{result.total_score || 0}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50 text-center">
                        <p className="text-xs text-muted-foreground">Average</p>
                        <p className="text-lg font-bold">{result.average_score?.toFixed(1) || 0}%</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50 text-center">
                        <p className="text-xs text-muted-foreground">Position</p>
                        <p className="text-lg font-bold">{result.position || "-"}/{result.out_of || "-"}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50 text-center">
                        <p className="text-xs text-muted-foreground">Attendance</p>
                        <p className="text-lg font-bold">{result.attendance_present || 0}/{result.attendance_total || 0}</p>
                      </div>
                    </div>

                    {/* Remarks */}
                    {(result.teacher_remarks || result.principal_remarks) && (
                      <div className="space-y-2">
                        {result.teacher_remarks && (
                          <p className="text-sm"><span className="font-medium">Teacher:</span> <span className="text-muted-foreground italic">"{result.teacher_remarks}"</span></p>
                        )}
                        {result.principal_remarks && (
                          <p className="text-sm"><span className="font-medium">Principal:</span> <span className="text-muted-foreground italic">"{result.principal_remarks}"</span></p>
                        )}
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground">
                      💡 To download this result as PDF, use a result check token on the school website.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No results published yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentResults;
