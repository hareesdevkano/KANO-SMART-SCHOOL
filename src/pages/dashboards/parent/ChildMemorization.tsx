import { useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, Star, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useParentChildren, useChildQuranProgress } from "@/hooks/useParentData";
import { useState, useEffect } from "react";
import StatsCard from "@/components/dashboard/StatsCard";

const ChildMemorization = () => {
  const [searchParams] = useSearchParams();
  const { data: children } = useParentChildren();
  const [selectedChild, setSelectedChild] = useState<string>(searchParams.get("child") || "");

  useEffect(() => {
    if (!selectedChild && children && children.length > 0) {
      setSelectedChild(children[0].id);
    }
  }, [children, selectedChild]);

  const { data: memorization, isLoading } = useChildQuranProgress(selectedChild || null);

  const completedCount = memorization?.filter((m: any) => m.status === "completed").length || 0;
  const inProgressCount = memorization?.filter((m: any) => m.status === "in_progress").length || 0;
  const verifiedCount = memorization?.filter((m: any) => m.teacher_verified).length || 0;
  const avgRating = memorization && memorization.length > 0
    ? (memorization.reduce((sum: number, m: any) => sum + (m.quality_rating || 0), 0) / memorization.length).toFixed(1)
    : "0";

  const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
    completed: { color: "bg-success/10 text-success border-success/30", icon: CheckCircle, label: "Completed" },
    in_progress: { color: "bg-warning/10 text-warning border-warning/30", icon: Clock, label: "In Progress" },
    needs_revision: { color: "bg-destructive/10 text-destructive border-destructive/30", icon: AlertCircle, label: "Needs Revision" },
  };

  const renderStars = (rating: number | null) => {
    if (!rating) return "—";
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3.5 h-3.5 inline-block ${i < rating ? "text-accent fill-accent" : "text-muted-foreground/30"}`}
      />
    ));
  };

  return (
    <DashboardLayout role="parent">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-1">Qur'an Memorization</h2>
        <p className="text-muted-foreground">Track your child's Hifz journey and progress</p>
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

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Entries"
          value={String(memorization?.length || 0)}
          change="Memorization records"
          changeType="neutral"
          icon={BookOpen}
          iconColor="bg-primary"
        />
        <StatsCard
          title="Completed"
          value={String(completedCount)}
          change="Surahs/portions"
          changeType="positive"
          icon={CheckCircle}
          iconColor="bg-success"
        />
        <StatsCard
          title="In Progress"
          value={String(inProgressCount)}
          change="Currently learning"
          changeType="neutral"
          icon={Clock}
          iconColor="bg-warning"
        />
        <StatsCard
          title="Avg. Quality"
          value={`${avgRating}/5`}
          change={`${verifiedCount} verified`}
          changeType="positive"
          icon={Star}
          iconColor="bg-accent"
        />
      </div>

      {/* Memorization Table */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="text-lg">Memorization Progress</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
            </div>
          ) : !memorization || memorization.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No memorization records found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Records will appear here once the teacher starts tracking
              </p>
            </div>
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Surah</TableHead>
                    <TableHead>Juz</TableHead>
                    <TableHead>Verses</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Quality</TableHead>
                    <TableHead>Verified</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {memorization.map((record: any) => {
                    const config = statusConfig[record.status] || statusConfig.in_progress;
                    const StatusIcon = config.icon;
                    return (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">
                          {record.surah_name || `Surah ${record.surah_number}`}
                        </TableCell>
                        <TableCell>{record.juz_number || "—"}</TableCell>
                        <TableCell>
                          {record.verses_from && record.verses_to
                            ? `${record.verses_from}–${record.verses_to}`
                            : "—"}
                        </TableCell>
                        <TableCell>
                          {record.memorization_date
                            ? new Date(record.memorization_date).toLocaleDateString("en-NG", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "—"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={config.color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {config.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-0.5">{renderStars(record.quality_rating)}</div>
                        </TableCell>
                        <TableCell>
                          {record.teacher_verified ? (
                            <CheckCircle className="w-4 h-4 text-success" />
                          ) : (
                            <span className="text-muted-foreground text-sm">Pending</span>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">
                          {record.teacher_remarks || "—"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default ChildMemorization;
