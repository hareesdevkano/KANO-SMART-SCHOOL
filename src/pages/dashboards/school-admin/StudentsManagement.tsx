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
  useSchoolStudents,
  useSchoolClasses,
  useDeleteStudent,
} from "@/hooks/useSchoolAdminData";
import { supabase } from "@/integrations/supabase/client";
import { Search, Plus, Trash2, Users, Filter } from "lucide-react";
import InviteParentDialog from "@/components/school-admin/InviteParentDialog";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const StudentsManagement = () => {
  const { data: students, isLoading } = useSchoolStudents();
  const { data: classes } = useSchoolClasses();
  const deleteStudent = useDeleteStudent();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newStudent, setNewStudent] = useState({
    full_name: "",
    registration_number: "",
    class_id: "",
    guardian_name: "",
    guardian_phone: "",
    guardian_email: "",
    gender: "",
    date_of_birth: "",
    address: "",
  });

  const filteredStudents = students?.filter((student) => {
    const matchesSearch =
      student.registration_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.guardian_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === "all" || student.class_id === filterClass;
    return matchesSearch && matchesClass;
  });

  const handleAddStudent = async () => {
    if (!newStudent.registration_number || !newStudent.full_name) {
      toast.error("Registration number and full name are required");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await supabase.functions.invoke("register-student", {
        body: {
          full_name: newStudent.full_name,
          registration_number: newStudent.registration_number,
          class_id: newStudent.class_id || null,
          guardian_name: newStudent.guardian_name,
          guardian_phone: newStudent.guardian_phone,
          guardian_email: newStudent.guardian_email,
          gender: newStudent.gender,
          date_of_birth: newStudent.date_of_birth || null,
          address: newStudent.address,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      toast.success("Student registered successfully!");
      queryClient.invalidateQueries({ queryKey: ["school-students"] });
      queryClient.invalidateQueries({ queryKey: ["school-stats"] });
      setIsDialogOpen(false);
      setNewStudent({
        full_name: "",
        registration_number: "",
        class_id: "",
        guardian_name: "",
        guardian_phone: "",
        guardian_email: "",
        gender: "",
        date_of_birth: "",
        address: "",
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to register student");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this student?")) {
      await deleteStudent.mutateAsync(id);
    }
  };

  return (
    <DashboardLayout role="school-admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Students Management</h1>
            <p className="text-muted-foreground">
              Manage all students in your school
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
                <DialogDescription>
                  Enter student details to register a new student.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="full_name">Student Full Name *</Label>
                  <Input
                    id="full_name"
                    value={newStudent.full_name}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, full_name: e.target.value })
                    }
                    placeholder="e.g., Muhammad Abubakar"
                  />
                </div>
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
                  <Label htmlFor="class">Class</Label>
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
                    placeholder="parent@email.com"
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
                    placeholder="Home address"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddStudent} disabled={isSubmitting}>
                  {isSubmitting ? "Registering..." : "Register Student"}
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
                      <TableHead>Name</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Guardian</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          {student.registration_number || "-"}
                        </TableCell>
                        <TableCell>
                          {student.guardian_name || student.registration_number || "N/A"}
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
                          <div className="flex items-center gap-1">
                            <InviteParentDialog
                              studentId={student.id}
                              studentName={student.guardian_name || student.registration_number || "Student"}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(student.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
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
                  Add Your First Student
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentsManagement;
