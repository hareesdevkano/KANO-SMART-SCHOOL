import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  useSchemeOfWork,
  useCreateSchemeOfWork,
  useDeleteSchemeOfWork,
  useTeacherClasses,
  useTeacherSubjects,
  useAcademicTerms,
} from "@/hooks/useTeacherData";
import { Search, Plus, FileText, Trash2, Filter } from "lucide-react";

const TeacherSchemeOfWork = () => {
  const [filterClass, setFilterClass] = useState("all");
  const [filterTerm, setFilterTerm] = useState("all");
  const { data: schemeOfWork, isLoading } = useSchemeOfWork(
    filterClass !== "all" ? filterClass : undefined,
    filterTerm !== "all" ? filterTerm : undefined
  );
  const { data: classes } = useTeacherClasses();
  const { data: subjects } = useTeacherSubjects();
  const { data: terms } = useAcademicTerms();
  const createScheme = useCreateSchemeOfWork();
  const deleteScheme = useDeleteSchemeOfWork();

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newScheme, setNewScheme] = useState({
    class_id: "",
    subject_id: "",
    term_id: "",
    week_number: 1,
    topic: "",
    sub_topic: "",
    objectives: "",
    teaching_aids: "",
    reference_materials: "",
    remarks: "",
  });

  const filteredSchemes = schemeOfWork?.filter((scheme) => {
    const matchesSearch = scheme.topic?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.sub_topic?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleCreateScheme = async () => {
    if (!newScheme.topic || !newScheme.class_id || !newScheme.subject_id) return;
    await createScheme.mutateAsync(newScheme);
    setIsDialogOpen(false);
    setNewScheme({
      class_id: "",
      subject_id: "",
      term_id: "",
      week_number: 1,
      topic: "",
      sub_topic: "",
      objectives: "",
      teaching_aids: "",
      reference_materials: "",
      remarks: "",
    });
  };

  const handleDelete = async (schemeId: string) => {
    if (confirm("Are you sure you want to delete this entry?")) {
      await deleteScheme.mutateAsync(schemeId);
    }
  };

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Scheme of Work</h1>
            <p className="text-muted-foreground">
              Plan your term's curriculum by week
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Week Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Scheme of Work Entry</DialogTitle>
                <DialogDescription>
                  Plan what you will teach for a specific week.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="class">Class *</Label>
                    <Select
                      value={newScheme.class_id}
                      onValueChange={(value) => setNewScheme({ ...newScheme, class_id: value })}
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
                      value={newScheme.subject_id}
                      onValueChange={(value) => setNewScheme({ ...newScheme, subject_id: value })}
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
                    <Label htmlFor="term">Term</Label>
                    <Select
                      value={newScheme.term_id}
                      onValueChange={(value) => setNewScheme({ ...newScheme, term_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select term" />
                      </SelectTrigger>
                      <SelectContent>
                        {terms?.map((term) => (
                          <SelectItem key={term.id} value={term.id}>
                            {term.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="week">Week Number *</Label>
                    <Input
                      id="week"
                      type="number"
                      min={1}
                      max={20}
                      value={newScheme.week_number}
                      onChange={(e) => setNewScheme({ ...newScheme, week_number: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="topic">Topic *</Label>
                  <Input
                    id="topic"
                    value={newScheme.topic}
                    onChange={(e) => setNewScheme({ ...newScheme, topic: e.target.value })}
                    placeholder="Main topic for this week"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sub_topic">Sub-Topic</Label>
                  <Input
                    id="sub_topic"
                    value={newScheme.sub_topic}
                    onChange={(e) => setNewScheme({ ...newScheme, sub_topic: e.target.value })}
                    placeholder="Sub-topics to cover"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="objectives">Objectives</Label>
                  <Textarea
                    id="objectives"
                    value={newScheme.objectives}
                    onChange={(e) => setNewScheme({ ...newScheme, objectives: e.target.value })}
                    placeholder="Learning objectives for this week..."
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="teaching_aids">Teaching Aids</Label>
                  <Input
                    id="teaching_aids"
                    value={newScheme.teaching_aids}
                    onChange={(e) => setNewScheme({ ...newScheme, teaching_aids: e.target.value })}
                    placeholder="Charts, models, videos, etc."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reference_materials">Reference Materials</Label>
                  <Textarea
                    id="reference_materials"
                    value={newScheme.reference_materials}
                    onChange={(e) => setNewScheme({ ...newScheme, reference_materials: e.target.value })}
                    placeholder="Textbooks, pages, online resources..."
                    rows={2}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="remarks">Remarks</Label>
                  <Textarea
                    id="remarks"
                    value={newScheme.remarks}
                    onChange={(e) => setNewScheme({ ...newScheme, remarks: e.target.value })}
                    placeholder="Any additional notes..."
                    rows={2}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateScheme}
                  disabled={createScheme.isPending || !newScheme.topic || !newScheme.class_id || !newScheme.subject_id}
                >
                  {createScheme.isPending ? "Adding..." : "Add Entry"}
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
                  placeholder="Search by topic..."
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
              <Select value={filterTerm} onValueChange={setFilterTerm}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Terms</SelectItem>
                  {terms?.map((term) => (
                    <SelectItem key={term.id} value={term.id}>
                      {term.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Scheme of Work Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Scheme of Work ({filteredSchemes?.length || 0} entries)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : filteredSchemes && filteredSchemes.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Week</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Topic</TableHead>
                      <TableHead>Sub-Topic</TableHead>
                      <TableHead>Teaching Aids</TableHead>
                      <TableHead className="w-20">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSchemes.map((scheme) => (
                      <TableRow key={scheme.id}>
                        <TableCell>
                          <Badge variant="outline">Week {scheme.week_number}</Badge>
                        </TableCell>
                        <TableCell>{scheme.classes?.name || "-"}</TableCell>
                        <TableCell>{scheme.subjects?.name || "-"}</TableCell>
                        <TableCell className="font-medium max-w-48 truncate">
                          {scheme.topic}
                        </TableCell>
                        <TableCell className="max-w-32 truncate">
                          {scheme.sub_topic || "-"}
                        </TableCell>
                        <TableCell className="max-w-32 truncate">
                          {scheme.teaching_aids || "-"}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(scheme.id)}
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
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No scheme of work entries found</p>
                <Button variant="outline" className="mt-4" onClick={() => setIsDialogOpen(true)}>
                  Add Your First Entry
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TeacherSchemeOfWork;
