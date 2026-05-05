import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useStudentAttendance, useStudentStats } from "@/hooks/useStudentData";
import { format } from "date-fns";
import { ClipboardCheck, CheckCircle, XCircle, Clock } from "lucide-react";

const getStatusBadge = (status: string) => {
  const map: Record<string, { class: string; icon: React.ReactNode }> = {
    present: { class: "bg-success/10 text-success border-success/30", icon: <CheckCircle className="w-3 h-3" /> },
    absent: { class: "bg-destructive/10 text-destructive border-destructive/30", icon: <XCircle className="w-3 h-3" /> },
    late: { class: "bg-warning/10 text-warning border-warning/30", icon: <Clock className="w-3 h-3" /> },
  };
  const s = map[status] || map.present;
  return (
    <Badge className={s.class}>
      <span className="flex items-center gap-1">{s.icon}<span className="capitalize">{status}</span></span>
    </Badge>
  );
};

const StudentAttendance = () => {
  const { data: attendance, isLoading } = useStudentAttendance();
  const { data: stats } = useStudentStats();

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <ClipboardCheck className="w-6 h-6" />
              My Attendance
            </h1>
            <p className="text-muted-foreground">Track your attendance record</p>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary text-lg px-4 py-2">
            {stats?.attendanceRate || 0}%
          </Badge>
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-3">
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
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                        <TableCell className="text-muted-foreground">{record.remarks || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <ClipboardCheck className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No attendance records yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentAttendance;
