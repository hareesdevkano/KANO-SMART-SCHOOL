import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StudentPhotoInput from "./StudentPhotoInput";
import { useUpdateStudent } from "@/hooks/useTeacherData";

interface EditableStudent {
  id: string;
  full_name?: string | null;
  registration_number?: string | null;
  class_id?: string | null;
  gender?: string | null;
  guardian_name?: string | null;
  guardian_phone?: string | null;
  photo_url?: string | null;
}

interface Props {
  student: EditableStudent | null;
  classes: { id: string; name: string }[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditStudentDialog = ({ student, classes, open, onOpenChange }: Props) => {
  const updateStudent = useUpdateStudent();
  const [form, setForm] = useState({
    full_name: "",
    registration_number: "",
    class_id: "",
    gender: "",
    guardian_name: "",
    guardian_phone: "",
    photo_url: null as string | null,
  });

  useEffect(() => {
    if (student) {
      setForm({
        full_name: student.full_name || "",
        registration_number: student.registration_number || "",
        class_id: student.class_id || "",
        gender: student.gender || "",
        guardian_name: student.guardian_name || "",
        guardian_phone: student.guardian_phone || "",
        photo_url: student.photo_url || null,
      });
    }
  }, [student]);

  const handleSave = async () => {
    if (!student || !form.full_name.trim()) return;
    await updateStudent.mutateAsync({
      id: student.id,
      full_name: form.full_name.trim(),
      registration_number: form.registration_number || undefined,
      class_id: form.class_id || undefined,
      gender: form.gender || undefined,
      guardian_name: form.guardian_name || undefined,
      guardian_phone: form.guardian_phone || undefined,
      photo_url: form.photo_url,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Student</DialogTitle>
          <DialogDescription>
            Update the student's name, passport photograph and details.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label>Passport Photograph</Label>
            <StudentPhotoInput
              value={form.photo_url}
              onChange={(path) => setForm((p) => ({ ...p, photo_url: path }))}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit_name">Student Full Name *</Label>
            <Input
              id="edit_name"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              placeholder="e.g., Aisha Bello"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit_reg">Registration Number</Label>
            <Input
              id="edit_reg"
              value={form.registration_number}
              onChange={(e) => setForm({ ...form, registration_number: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label>Class</Label>
            <Select
              value={form.class_id}
              onValueChange={(value) => setForm({ ...form, class_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Gender</Label>
            <Select
              value={form.gender}
              onValueChange={(value) => setForm({ ...form, gender: value })}
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
            <Label htmlFor="edit_guardian">Guardian Name</Label>
            <Input
              id="edit_guardian"
              value={form.guardian_name}
              onChange={(e) => setForm({ ...form, guardian_name: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit_guardian_phone">Guardian Phone</Label>
            <Input
              id="edit_guardian_phone"
              value={form.guardian_phone}
              onChange={(e) => setForm({ ...form, guardian_phone: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateStudent.isPending || !form.full_name.trim()}
          >
            {updateStudent.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditStudentDialog;
