import { useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { ClipboardCheck, CheckCircle, XCircle, Clock, Calendar } from "lucide-react";
import { useParentChildren, useChildAttendance, useChildAttendanceStats } from "@/hooks/useParentData";
import { useState, useEffect } from "react";
import StatsCard from "@/components/dashboard/StatsCard";

const ChildAttendance = () => {
  const [searchParams] = useSearchParams();
  const { data: children } = useParentChildren();
  const [selectedChild, setSelectedChild] = useState<string>(searchParams.get("child") || "");

  useEffect(() => {
    if (!selectedChild && children && children.length > 0) {
      setSelectedChild(children[0].id);
    }
  }, [children, selectedChild]);

  const { data: attendance, isLoading } = useChildAttendance(selectedChild || null);
  const stats = useChildAttendanceStats(selectedChild || null);

  const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
    present: { color: "bg-success/10 text-success border-success/30", icon: CheckCircle, label: "Present" },
    absent: { color: "bg-destructive/10 text-destructive border-destructive/30", icon: XCircle, label: "Absent" },
    late: { color: "bg-warning/10 text-warning border-warning/30", icon: Clock, label: "Late" },
    excused: { color: "bg-info/10 text-info border-info/30", icon: Calendar, label: "Excused" },
  };

  return (
    <DashboardLayout role="parent">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-1">Attendance Record</h2>
        <p className="text-muted-foreground">Track your child's daily attendance history</p>
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
          title="Total Days"
          value={String(stats.total)}
          change="Recorded days"
          changeType="neutral"
          icon={Calendar}
          iconColor="bg-primary"
        />
        <StatsCard
          title="Present"
          value={String(stats.present)}
          change={`${stats.percentage}% rate`}
          changeType="positive"
          icon={CheckCircle}
          iconColor="bg-success"
        />
        <StatsCard
          title="Absent"
          value={String(stats.absent)}
          change="Days missed"
          changeType={stats.absent > 5 ? "negative" : "neutral"}
          icon={XCircle}
          iconColor="bg-destructive"
        />
        <StatsCard
          title="Late"
          value={String(stats.late)}
          change="Late arrivals"
          changeType={stats.late > 3 ? "negative" : "neutral"}
          icon={Clock}
          iconColor="bg-warning"
        />
      </div>

      {/* Attendance Rate */}
      <Card variant="elevated" className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium">Overall Attendance Rate</span>
            <span className="text-2xl font-bold text-primary">{stats.percentage}%</span>
          </div>
          <Progress value={stats.percentage} className="h-3" />
        </CardContent>
      </Card>

      {/* Attendance Table */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="text-lg">Recent Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
            </div>
          ) : !attendance || attendance.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardCheck className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No attendance records found</p>
            </div>
          ) : (
            <div className="rounded-lg border overflow-hidden">
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
                  {attendance.map((record: any) => {
                    const config = statusConfig[record.status] || statusConfig.present;
                    const StatusIcon = config.icon;
                    return (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">
                          {new Date(record.date).toLocaleDateString("en-NG", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </TableCell>
                        <TableCell>{record.classes?.name || "—"}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={config.color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {config.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {record.remarks || "—"}
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

export default ChildAttendance;
