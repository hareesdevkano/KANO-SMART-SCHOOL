import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAllStudents,
  useTeacherClasses,
  useEnrollStudent,
} from "@/hooks/useTeacherData";
import { Search, UserPlus, Users, Filter } from "lucide-react";

const TeacherStudents = () => {
  const [searchParams] = useSearchParams();
  const defaultClassId = searchParams.get("class") || "";

  const { data: students, isLoading } = useAllStudents();
  const { data: classes } = useTeacherClasses();
  const enrollStudent = useEnrollStudent();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState(defaultClassId || "all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    registration_number: "",
    class_id: defaultClassId,
    guardian_name: "",
    guardian_phone: "",
    guardian_email: "",
    gender: "",
    date_of_birth: "",
    address: "",
  });

  // Update class_id when defaultClassId changes
  useEffect(() => {
    if (defaultClassId) {
      setFilterClass(defaultClassId);
      setNewStudent((prev) => ({ ...prev, class_id: defaultClassId }));
    }
  }, [defaultClassId]);

  const filteredStudents = students?.filter((student) => {
    const matchesSearch =
      student.registration_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.guardian_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === "all" || student.class_id === filterClass;
    return matchesSearch && matchesClass;
  });

  const handleEnrollStudent = async () => {
    if (!newStudent.registration_number || !newStudent.class_id) {
      return;
    }
    await enrollStudent.mutateAsync(newStudent);
    setIsDialogOpen(false);
    setNewStudent({
      registration_number: "",
      class_id: defaultClassId,
      guardian_name: "",
      guardian_phone: "",
      guardian_email: "",
      gender: "",
      date_of_birth: "",
      address: "",
    });
  };

  // Get default class name for display
  const defaultClassName = classes?.find((c) => c.id === defaultClassId)?.name;

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Student Enrollment
              {defaultClassName && (
                <Badge variant="secondary" className="ml-3 text-base font-normal">
                  {defaultClassName}
                </Badge>
              )}
            </h1>
            <p className="text-muted-foreground">
              Enroll and manage students in your classes
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Enroll Student
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Enroll New Student</DialogTitle>
                <DialogDescription>
                  Enter student details to enroll them in a class.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="reg_number">Registration Number *</Label>
                  <Input
                    id="reg_number"
                    value={newStudent.registration_number}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, registration_number: e.target.value })
                    }
                    placeholder="e.g., STU-2026-001"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="class">Class *</Label>
                  <Select
                    value={newStudent.class_id}
                    onValueChange={(value) =>
                      setNewStudent({ ...newStudent, class_id: value })
                    }
                  >
                    <SelectTrigger>
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
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={newStudent.gender}
                    onValueChange={(value) =>
                      setNewStudent({ ...newStudent, gender: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={newStudent.date_of_birth}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, date_of_birth: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="guardian">Guardian Name</Label>
                  <Input
                    id="guardian"
                    value={newStudent.guardian_name}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, guardian_name: e.target.value })
                    }
                    placeholder="Parent/Guardian name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="guardian_phone">Guardian Phone</Label>
                  <Input
                    id="guardian_phone"
                    value={newStudent.guardian_phone}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, guardian_phone: e.target.value })
                    }
                    placeholder="08012345678"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="guardian_email">Guardian Email</Label>
                  <Input
                    id="guardian_email"
                    type="email"
                    value={newStudent.guardian_email}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, guardian_email: e.target.value })
                    }
                    placeholder="guardian@email.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={newStudent.address}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, address: e.target.value })
                    }
                    placeholder="Student address"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleEnrollStudent}
                  disabled={enrollStudent.isPending || !newStudent.registration_number || !newStudent.class_id}
                >
                  {enrollStudent.isPending ? "Enrolling..." : "Enroll Student"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, registration number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterClass} onValueChange={setFilterClass}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classes?.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              All Students ({filteredStudents?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading students...
              </div>
            ) : filteredStudents && filteredStudents.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reg. Number</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Guardian</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Enrolled</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          {student.registration_number || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {student.classes?.name || "Unassigned"}
                          </Badge>
                        </TableCell>
                        <TableCell className="capitalize">
                          {student.gender || "-"}
                        </TableCell>
                        <TableCell>{student.guardian_name || "-"}</TableCell>
                        <TableCell>{student.guardian_phone || "-"}</TableCell>
                        <TableCell>
                          {student.admission_date
                            ? new Date(student.admission_date).toLocaleDateString()
                            : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No students found</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setIsDialogOpen(true)}
                >
                  Enroll Your First Student
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TeacherStudents;
