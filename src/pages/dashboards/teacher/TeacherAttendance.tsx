import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useTeacherClasses,
  useClassStudents,
  useTeacherAttendance,
  useBulkMarkAttendance,
} from "@/hooks/useTeacherData";
import { ClipboardCheck, Calendar, Check, X, Clock } from "lucide-react";
import { toast } from "sonner";

type AttendanceStatus = "present" | "absent" | "late" | "excused";

interface AttendanceRecord {
  student_id: string;
  status: AttendanceStatus;
}

const TeacherAttendance = () => {
  const { data: classes } = useTeacherClasses();
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [attendanceRecords, setAttendanceRecords] = useState<Map<string, AttendanceStatus>>(new Map());

  const { data: students, isLoading: studentsLoading } = useClassStudents(selectedClass || null);
  const { data: existingAttendance } = useTeacherAttendance(selectedClass, selectedDate);
  const bulkMarkAttendance = useBulkMarkAttendance();

  // Initialize attendance records when students or existing attendance changes
  const initializeAttendance = () => {
    if (students && existingAttendance) {
      const records = new Map<string, AttendanceStatus>();
      students.forEach(student => {
        const existing = existingAttendance.find(a => a.student_id === student.id);
        records.set(student.id, (existing?.status as AttendanceStatus) || "present");
      });
      setAttendanceRecords(records);
    }
  };

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceRecords(prev => new Map(prev).set(studentId, status));
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    if (!students) return;
    const records = new Map<string, AttendanceStatus>();
    students.forEach(student => {
      records.set(student.id, status);
    });
    setAttendanceRecords(records);
  };

  const handleSaveAttendance = async () => {
    if (!selectedClass || !students || students.length === 0) {
      toast.error("Please select a class with students");
      return;
    }

    const records = students.map(student => ({
      student_id: student.id,
      class_id: selectedClass,
      date: selectedDate,
      status: attendanceRecords.get(student.id) || "present",
    }));

    await bulkMarkAttendance.mutateAsync(records);
  };

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case "present":
        return "bg-success/10 text-success border-success/30 hover:bg-success/20";
      case "absent":
        return "bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive/20";
      case "late":
        return "bg-warning/10 text-warning border-warning/30 hover:bg-warning/20";
      case "excused":
        return "bg-info/10 text-info border-info/30 hover:bg-info/20";
      default:
        return "";
    }
  };

  const presentCount = Array.from(attendanceRecords.values()).filter(s => s === "present").length;
  const absentCount = Array.from(attendanceRecords.values()).filter(s => s === "absent").length;
  const lateCount = Array.from(attendanceRecords.values()).filter(s => s === "late").length;

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Attendance Management</h1>
          <p className="text-muted-foreground">
            Mark and manage student attendance
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={selectedClass} onValueChange={(value) => {
                setSelectedClass(value);
                setAttendanceRecords(new Map());
              }}>
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes?.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full sm:w-auto"
                />
              </div>
              <Button 
                variant="outline" 
                onClick={initializeAttendance}
                disabled={!selectedClass}
              >
                Load Attendance
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        {selectedClass && students && students.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-3 items-center justify-between">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMarkAll("present")}
                    className="text-success border-success/30"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Mark All Present
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMarkAll("absent")}
                    className="text-destructive border-destructive/30"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Mark All Absent
                  </Button>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="text-success">Present: {presentCount}</span>
                  <span className="text-destructive">Absent: {absentCount}</span>
                  <span className="text-warning">Late: {lateCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Attendance Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5" />
              Attendance for {selectedDate}
            </CardTitle>
            {selectedClass && students && students.length > 0 && (
              <Button 
                onClick={handleSaveAttendance}
                disabled={bulkMarkAttendance.isPending}
              >
                {bulkMarkAttendance.isPending ? "Saving..." : "Save Attendance"}
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {!selectedClass ? (
              <div className="text-center py-12 text-muted-foreground">
                <ClipboardCheck className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a class to mark attendance</p>
              </div>
            ) : studentsLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading students...
              </div>
            ) : students && students.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Registration No.</TableHead>
                      <TableHead>Guardian Name</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student, index) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell className="font-medium">
                          {student.registration_number || "-"}
                        </TableCell>
                        <TableCell>{student.guardian_name || "-"}</TableCell>
                        <TableCell className="capitalize">{student.gender || "-"}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {(["present", "absent", "late", "excused"] as AttendanceStatus[]).map(
                              (status) => (
                                <Badge
                                  key={status}
                                  variant="outline"
                                  className={`cursor-pointer capitalize ${
                                    attendanceRecords.get(student.id) === status
                                      ? getStatusColor(status)
                                      : "opacity-50 hover:opacity-100"
                                  }`}
                                  onClick={() => handleStatusChange(student.id, status)}
                                >
                                  {status === "present" && <Check className="w-3 h-3 mr-1" />}
                                  {status === "absent" && <X className="w-3 h-3 mr-1" />}
                                  {status === "late" && <Clock className="w-3 h-3 mr-1" />}
                                  {status.charAt(0).toUpperCase()}
                                </Badge>
                              )
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <ClipboardCheck className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No students found in this class</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TeacherAttendance;
