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
import { Checkbox } from "@/components/ui/checkbox";
import {
  useSchoolTeachers,
  useDeleteTeacher,
  useSchoolClasses,
} from "@/hooks/useSchoolAdminData";
import { supabase } from "@/integrations/supabase/client";
import { Search, Plus, Trash2, GraduationCap, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const TeachersManagement = () => {
  const { data: teachers, isLoading } = useSchoolTeachers();
  const { data: classes } = useSchoolClasses();
  const deleteTeacher = useDeleteTeacher();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
  const [newTeacher, setNewTeacher] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    employee_id: "",
    qualification: "",
    specialization: "",
  });

  const filteredTeachers = teachers?.filter((teacher) => {
    const matchesSearch =
      teacher.employee_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleAddTeacher = async () => {
    if (!newTeacher.full_name || !newTeacher.email || !newTeacher.password) {
      toast.error("Full name, email, and password are required");
      return;
    }

    if (newTeacher.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await supabase.functions.invoke("register-teacher", {
        body: {
          full_name: newTeacher.full_name,
          email: newTeacher.email,
          phone: newTeacher.phone,
          password: newTeacher.password,
          employee_id: newTeacher.employee_id,
          qualification: newTeacher.qualification,
          specialization: newTeacher.specialization,
          class_ids: selectedClassIds,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      toast.success("Teacher registered successfully!");
      queryClient.invalidateQueries({ queryKey: ["school-teachers"] });
      queryClient.invalidateQueries({ queryKey: ["school-stats"] });
      setIsDialogOpen(false);
      setSelectedClassIds([]);
      setNewTeacher({
        full_name: "",
        email: "",
        phone: "",
        password: "",
        employee_id: "",
        qualification: "",
        specialization: "",
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to register teacher");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this teacher?")) {
      await deleteTeacher.mutateAsync(id);
    }
  };

  return (
    <DashboardLayout role="school-admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Teachers Management</h1>
            <p className="text-muted-foreground">
              Manage all teachers in your school
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Teacher
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Teacher</DialogTitle>
                <DialogDescription>
                  Enter teacher details. This will create a login account for the teacher.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    value={newTeacher.full_name}
                    onChange={(e) =>
                      setNewTeacher({ ...newTeacher, full_name: e.target.value })
                    }
                    placeholder="e.g., Malam Abubakar Usman"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newTeacher.email}
                    onChange={(e) =>
                      setNewTeacher({ ...newTeacher, email: e.target.value })
                    }
                    placeholder="e.g., teacher@school.edu.ng"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={newTeacher.phone}
                    onChange={(e) =>
                      setNewTeacher({ ...newTeacher, phone: e.target.value })
                    }
                    placeholder="e.g., 08012345678"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Login Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={newTeacher.password}
                      onChange={(e) =>
                        setNewTeacher({ ...newTeacher, password: e.target.value })
                      }
                      placeholder="Minimum 6 characters"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="employee_id">Employee ID</Label>
                  <Input
                    id="employee_id"
                    value={newTeacher.employee_id}
                    onChange={(e) =>
                      setNewTeacher({ ...newTeacher, employee_id: e.target.value })
                    }
                    placeholder="e.g., TCH-001"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="qualification">Qualification</Label>
                  <Input
                    id="qualification"
                    value={newTeacher.qualification}
                    onChange={(e) =>
                      setNewTeacher({ ...newTeacher, qualification: e.target.value })
                    }
                    placeholder="e.g., B.Ed, M.Sc, NCE"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    value={newTeacher.specialization}
                    onChange={(e) =>
                      setNewTeacher({ ...newTeacher, specialization: e.target.value })
                    }
                    placeholder="e.g., Mathematics, Qur'an, Arabic"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Assign Classes</Label>
                  <p className="text-sm text-muted-foreground">
                    Select classes this teacher will manage and enroll students into
                  </p>
                  <div className="max-h-40 overflow-y-auto border rounded-md p-3 space-y-2">
                    {classes && classes.length > 0 ? (
                      classes.map((cls) => (
                        <div key={cls.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`class-${cls.id}`}
                            checked={selectedClassIds.includes(cls.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedClassIds([...selectedClassIds, cls.id]);
                              } else {
                                setSelectedClassIds(selectedClassIds.filter(id => id !== cls.id));
                              }
                            }}
                          />
                          <label
                            htmlFor={`class-${cls.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {cls.name} ({cls.academic_levels?.name || "No level"})
                          </label>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No classes available. Create classes first.
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTeacher} disabled={isSubmitting}>
                  {isSubmitting ? "Registering..." : "Register Teacher"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, employee ID, specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Teachers Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              All Teachers ({filteredTeachers?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading teachers...
              </div>
            ) : filteredTeachers && filteredTeachers.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Qualification</TableHead>
                      <TableHead>Specialization</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeachers.map((teacher) => (
                      <TableRow key={teacher.id}>
                        <TableCell className="font-medium">
                          {teacher.employee_id || "-"}
                        </TableCell>
                        <TableCell>
                          {teacher.profiles?.full_name || "N/A"}
                        </TableCell>
                        <TableCell>
                          {teacher.profiles?.email || "-"}
                        </TableCell>
                        <TableCell>
                          {teacher.profiles?.phone || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {teacher.qualification || "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell>{teacher.specialization || "-"}</TableCell>
                        <TableCell>
                          {teacher.date_joined
                            ? new Date(teacher.date_joined).toLocaleDateString()
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(teacher.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No teachers found</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setIsDialogOpen(true)}
                >
                  Add Your First Teacher
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TeachersManagement;
