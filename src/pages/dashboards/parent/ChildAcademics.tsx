import { useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, TrendingUp, Award, BookOpen } from "lucide-react";
import { useParentChildren } from "@/hooks/useParentData";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

const ChildAcademics = () => {
  const [searchParams] = useSearchParams();
  const { data: children } = useParentChildren();
  const [selectedChild, setSelectedChild] = useState<string>(searchParams.get("child") || "");

  useEffect(() => {
    if (!selectedChild && children && children.length > 0) {
      setSelectedChild(children[0].id);
    }
  }, [children, selectedChild]);

  // Fetch term results for selected child
  const { data: termResults, isLoading } = useQuery({
    queryKey: ["parent-child-term-results", selectedChild],
    queryFn: async () => {
      if (!selectedChild) return [];
      const { data, error } = await supabase
        .from("student_term_results")
        .select(`
          *,
          academic_terms (name),
          academic_sessions:session_id (name),
          classes (name),
          student_subject_results (*)
        `)
        .eq("student_id", selectedChild)
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedChild,
  });

  const currentChild = children?.find((c: any) => c.id === selectedChild);

  const getGradeColor = (grade: string | null) => {
    if (!grade) return "bg-muted text-muted-foreground";
    if (grade === "A" || grade === "A1") return "bg-success/10 text-success";
    if (grade.startsWith("B")) return "bg-info/10 text-info";
    if (grade.startsWith("C")) return "bg-warning/10 text-warning";
    return "bg-destructive/10 text-destructive";
  };

  return (
    <DashboardLayout role="parent">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-1">Academic Results</h2>
        <p className="text-muted-foreground">View your child's academic performance and report cards</p>
      </div>

      {/* Child Selector */}
      {children && children.length > 1 && (
        <div className="mb-6">
          <Select value={selectedChild} onValueChange={setSelectedChild}>
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="Select a child" />
            </SelectTrigger>
            <SelectContent>
              {children.map((child: any) => (
                <SelectItem key={child.id} value={child.id}>
                  {child.profiles?.full_name || child.registration_number || "Student"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
        </div>
      ) : !termResults || termResults.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Results Available</h3>
            <p className="text-muted-foreground">
              No published results found for {currentChild?.profiles?.full_name || "this student"} yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {termResults.map((result: any) => (
            <Card key={result.id} variant="elevated">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <CardTitle className="text-lg">
                    {result.academic_terms?.name} — {result.academic_sessions?.name}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="outline">
                      <Award className="w-3 h-3 mr-1" />
                      Position: {result.position || "N/A"}{result.out_of ? ` / ${result.out_of}` : ""}
                    </Badge>
                    <Badge variant="outline">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Average: {result.average_score?.toFixed(1) || "N/A"}%
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {result.student_subject_results && result.student_subject_results.length > 0 ? (
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Subject</TableHead>
                          <TableHead className="text-center">CA</TableHead>
                          <TableHead className="text-center">Exam</TableHead>
                          <TableHead className="text-center">Total</TableHead>
                          <TableHead className="text-center">Grade</TableHead>
                          <TableHead>Remarks</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {result.student_subject_results.map((sr: any) => (
                          <TableRow key={sr.id}>
                            <TableCell className="font-medium">{sr.subject_name}</TableCell>
                            <TableCell className="text-center">{sr.ca1_score ?? "—"}</TableCell>
                            <TableCell className="text-center">{sr.exam_score ?? "—"}</TableCell>
                            <TableCell className="text-center font-semibold">{sr.total_score ?? "—"}</TableCell>
                            <TableCell className="text-center">
                              <Badge className={getGradeColor(sr.grade)}>{sr.grade || "—"}</Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">{sr.remarks || "—"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">No subject results available</p>
                )}

                {/* Remarks */}
                {(result.teacher_remarks || result.principal_remarks) && (
                  <div className="mt-4 grid sm:grid-cols-2 gap-4">
                    {result.teacher_remarks && (
                      <div className="p-4 rounded-lg bg-muted/50">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Teacher's Remarks</p>
                        <p className="text-sm">{result.teacher_remarks}</p>
                      </div>
                    )}
                    {result.principal_remarks && (
                      <div className="p-4 rounded-lg bg-muted/50">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Principal's Remarks</p>
                        <p className="text-sm">{result.principal_remarks}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default ChildAcademics;
