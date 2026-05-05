import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
  useLessonPlans,
  useCreateLessonPlan,
  useDeleteLessonPlan,
  useTeacherClasses,
  useTeacherSubjects,
} from "@/hooks/useTeacherData";
import { Search, Plus, BookOpen, Trash2, Calendar, Clock } from "lucide-react";

const TeacherLessonPlans = () => {
  const { data: lessonPlans, isLoading } = useLessonPlans();
  const { data: classes } = useTeacherClasses();
  const { data: subjects } = useTeacherSubjects();
  const createLessonPlan = useCreateLessonPlan();
  const deleteLessonPlan = useDeleteLessonPlan();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPlan, setNewPlan] = useState({
    title: "",
    class_id: "",
    subject_id: "",
    objectives: "",
    content: "",
    materials: "",
    activities: "",
    assessment_method: "",
    lesson_date: "",
    duration_minutes: 45,
    status: "draft",
  });

  const filteredPlans = lessonPlans?.filter((plan) => {
    const matchesSearch = plan.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === "all" || plan.class_id === filterClass;
    return matchesSearch && matchesClass;
  });

  const handleCreatePlan = async () => {
    if (!newPlan.title || !newPlan.class_id || !newPlan.subject_id) return;
    await createLessonPlan.mutateAsync(newPlan);
    setIsDialogOpen(false);
    setNewPlan({
      title: "",
      class_id: "",
      subject_id: "",
      objectives: "",
      content: "",
      materials: "",
      activities: "",
      assessment_method: "",
      lesson_date: "",
      duration_minutes: 45,
      status: "draft",
    });
  };

  const handleDelete = async (planId: string) => {
    if (confirm("Are you sure you want to delete this lesson plan?")) {
      await deleteLessonPlan.mutateAsync(planId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success/10 text-success border-success/30";
      case "published":
        return "bg-primary/10 text-primary border-primary/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Lesson Plans</h1>
            <p className="text-muted-foreground">
              Create and manage your lesson plans
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Lesson Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Lesson Plan</DialogTitle>
                <DialogDescription>
                  Plan your lesson with objectives, content, and activities.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={newPlan.title}
                      onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
                      placeholder="e.g., Introduction to Fractions"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lesson_date">Lesson Date</Label>
                    <Input
                      id="lesson_date"
                      type="date"
                      value={newPlan.lesson_date}
                      onChange={(e) => setNewPlan({ ...newPlan, lesson_date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="class">Class *</Label>
                    <Select
                      value={newPlan.class_id}
                      onValueChange={(value) => setNewPlan({ ...newPlan, class_id: value })}
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
                    <Label htmlFor="subject">Subject *</Label>
                    <Select
                      value={newPlan.subject_id}
                      onValueChange={(value) => setNewPlan({ ...newPlan, subject_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects?.map((subj) => (
                          <SelectItem key={subj.id} value={subj.id}>
                            {subj.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={newPlan.duration_minutes}
                      onChange={(e) => setNewPlan({ ...newPlan, duration_minutes: parseInt(e.target.value) || 45 })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={newPlan.status}
                      onValueChange={(value) => setNewPlan({ ...newPlan, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="objectives">Learning Objectives</Label>
                  <Textarea
                    id="objectives"
                    value={newPlan.objectives}
                    onChange={(e) => setNewPlan({ ...newPlan, objectives: e.target.value })}
                    placeholder="What students will learn..."
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="content">Content/Notes</Label>
                  <Textarea
                    id="content"
                    value={newPlan.content}
                    onChange={(e) => setNewPlan({ ...newPlan, content: e.target.value })}
                    placeholder="Main content of the lesson..."
                    rows={4}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="materials">Materials Needed</Label>
                  <Textarea
                    id="materials"
                    value={newPlan.materials}
                    onChange={(e) => setNewPlan({ ...newPlan, materials: e.target.value })}
                    placeholder="Textbooks, worksheets, etc."
                    rows={2}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="activities">Activities</Label>
                  <Textarea
                    id="activities"
                    value={newPlan.activities}
                    onChange={(e) => setNewPlan({ ...newPlan, activities: e.target.value })}
                    placeholder="Classroom activities and exercises..."
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="assessment">Assessment Method</Label>
                  <Input
                    id="assessment"
                    value={newPlan.assessment_method}
                    onChange={(e) => setNewPlan({ ...newPlan, assessment_method: e.target.value })}
                    placeholder="Quiz, oral questions, assignment, etc."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreatePlan}
                  disabled={createLessonPlan.isPending || !newPlan.title || !newPlan.class_id || !newPlan.subject_id}
                >
                  {createLessonPlan.isPending ? "Creating..." : "Create Plan"}
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
                  placeholder="Search lesson plans..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterClass} onValueChange={setFilterClass}>
                <SelectTrigger className="w-full sm:w-48">
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

        {/* Lesson Plans Grid */}
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading lesson plans...</div>
        ) : filteredPlans && filteredPlans.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlans.map((plan) => (
              <Card key={plan.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-1">{plan.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{plan.classes?.name || "Class"}</Badge>
                        <Badge variant="secondary">{plan.subjects?.name || "Subject"}</Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(plan.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {plan.objectives && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {plan.objectives}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-muted-foreground">
                      {plan.lesson_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(plan.lesson_date).toLocaleDateString()}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {plan.duration_minutes || 45}min
                      </span>
                    </div>
                    <Badge variant="outline" className={getStatusColor(plan.status || "draft")}>
                      {plan.status || "draft"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12 text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No lesson plans found</p>
              <Button variant="outline" className="mt-4" onClick={() => setIsDialogOpen(true)}>
                Create Your First Lesson Plan
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeacherLessonPlans;
