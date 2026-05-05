import { useState, useMemo } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ArrowRight, Users, GraduationCap, CheckCircle2, AlertCircle } from "lucide-react";

const PromoteStudents = () => {
  const { schoolId } = useAuth();
  const queryClient = useQueryClient();
  const [sourceClassId, setSourceClassId] = useState<string>("");
  const [destClassId, setDestClassId] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Load classes for this school
  const { data: classes } = useQuery({
    queryKey: ["promotion-classes", schoolId],
    queryFn: async () => {
      if (!schoolId) return [];
      const { data, error } = await supabase
        .from("classes")
        .select("id, name, level_id, academic_levels(name, order_index)")
        .eq("school_id", schoolId)
        .order("name");
      if (error) throw error;
      return data || [];
    },
    enabled: !!schoolId,
  });

  // Load students in the source class
  const { data: students, isLoading: studentsLoading } = useQuery({
    queryKey: ["promotion-students", sourceClassId],
    queryFn: async () => {
      if (!sourceClassId) return [];
      const { data, error } = await supabase
        .from("students")
        .select("id, registration_number, guardian_name, gender")
        .eq("class_id", sourceClassId)
        .order("registration_number");
      if (error) throw error;
      return data || [];
    },
    enabled: !!sourceClassId,
  });

  const promote = useMutation({
    mutationFn: async () => {
      if (!destClassId || selectedIds.size === 0) throw new Error("Pick destination and students");
      const ids = Array.from(selectedIds);
      const { error } = await supabase
        .from("students")
        .update({ class_id: destClassId })
        .in("id", ids);
      if (error) throw error;
      return ids.length;
    },
    onSuccess: (count) => {
      toast.success(`${count} student${count === 1 ? "" : "s"} promoted successfully`);
      setSelectedIds(new Set());
      queryClient.invalidateQueries({ queryKey: ["promotion-students"] });
      queryClient.invalidateQueries({ queryKey: ["school-students"] });
    },
    onError: (e: any) => toast.error(e.message || "Promotion failed"),
  });

  const sourceClass = useMemo(
    () => classes?.find((c) => c.id === sourceClassId),
    [classes, sourceClassId]
  );
  const destClass = useMemo(
    () => classes?.find((c) => c.id === destClassId),
    [classes, destClassId]
  );

  const allSelected = students && students.length > 0 && selectedIds.size === students.length;
  const toggleAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(students?.map((s) => s.id) || []));
  };
  const toggleOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const sameClass = sourceClassId && destClassId && sourceClassId === destClassId;
  const canPromote = !!destClassId && !sameClass && selectedIds.size > 0;

  return (
    <DashboardLayout role="school-admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <GraduationCap className="w-6 h-6" /> Promote Students
          </h1>
          <p className="text-muted-foreground">
            Move students from one class to the next at the end of a session. Repeaters can be left behind.
          </p>
        </div>

        {/* Class pickers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Select Classes</CardTitle>
            <CardDescription>Choose where the students are coming from and going to.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-[1fr_auto_1fr] items-end gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">From (current class)</label>
                <Select value={sourceClassId} onValueChange={(v) => { setSourceClassId(v); setSelectedIds(new Set()); }}>
                  <SelectTrigger><SelectValue placeholder="Select source class" /></SelectTrigger>
                  <SelectContent>
                    {classes?.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} {c.academic_levels?.name ? `— ${c.academic_levels.name}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <ArrowRight className="w-6 h-6 text-muted-foreground hidden md:block mb-2" />
              <div className="space-y-2">
                <label className="text-sm font-medium">To (next class)</label>
                <Select value={destClassId} onValueChange={setDestClassId}>
                  <SelectTrigger><SelectValue placeholder="Select destination class" /></SelectTrigger>
                  <SelectContent>
                    {classes?.filter((c) => c.id !== sourceClassId).map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} {c.academic_levels?.name ? `— ${c.academic_levels.name}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {sameClass && (
              <div className="mt-3 flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="w-4 h-4" /> Source and destination class cannot be the same.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Student list */}
        {sourceClassId && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Students in {sourceClass?.name}
                  </CardTitle>
                  <CardDescription>
                    {selectedIds.size} of {students?.length || 0} selected for promotion
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={toggleAll} disabled={!students?.length}>
                    {allSelected ? "Clear all" : "Select all"}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button disabled={!canPromote || promote.isPending} size="sm">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Promote {selectedIds.size} student{selectedIds.size === 1 ? "" : "s"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm promotion</AlertDialogTitle>
                        <AlertDialogDescription>
                          Move <b>{selectedIds.size}</b> student{selectedIds.size === 1 ? "" : "s"} from{" "}
                          <b>{sourceClass?.name}</b> to <b>{destClass?.name}</b>? This updates their assigned class.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => promote.mutate()}>Confirm</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {studentsLoading ? (
                <div className="py-8 text-center text-muted-foreground">Loading students...</div>
              ) : !students || students.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p>No students in this class</p>
                </div>
              ) : (
                <div className="divide-y divide-border/40 -mx-2">
                  {students.map((s) => (
                    <label
                      key={s.id}
                      className="flex items-center gap-3 px-2 py-3 hover:bg-muted/30 rounded-lg cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedIds.has(s.id)}
                        onCheckedChange={() => toggleOne(s.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">
                          {s.guardian_name || "—"}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {s.registration_number || "No reg #"}
                        </p>
                      </div>
                      {s.gender && (
                        <Badge variant="outline" className="text-[10px]">{s.gender}</Badge>
                      )}
                    </label>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PromoteStudents;
