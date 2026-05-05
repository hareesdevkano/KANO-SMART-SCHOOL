import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuranMemorization, useAddQuranRecord, useTeacherStudents, useUpdateQuranRecord } from "@/hooks/useTeacherData";
import { Search, Plus, BookOpen, Star, Check, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";

// Surah data (simplified - just first 30)
const SURAHS = [
  { number: 1, name: "Al-Fatihah", verses: 7 },
  { number: 2, name: "Al-Baqarah", verses: 286 },
  { number: 3, name: "Ali 'Imran", verses: 200 },
  { number: 36, name: "Ya-Sin", verses: 83 },
  { number: 55, name: "Ar-Rahman", verses: 78 },
  { number: 56, name: "Al-Waqi'ah", verses: 96 },
  { number: 67, name: "Al-Mulk", verses: 30 },
  { number: 78, name: "An-Naba", verses: 40 },
  { number: 112, name: "Al-Ikhlas", verses: 4 },
  { number: 113, name: "Al-Falaq", verses: 5 },
  { number: 114, name: "An-Nas", verses: 6 },
];

const QuranMemorization = () => {
  const { data: records, isLoading } = useQuranMemorization();
  const { data: students } = useTeacherStudents();
  const addRecord = useAddQuranRecord();
  const updateRecord = useUpdateQuranRecord();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRecord, setNewRecord] = useState({
    student_id: "",
    surah_number: 1,
    surah_name: "Al-Fatihah",
    juz_number: 1,
    verses_from: 1,
    verses_to: 7,
    status: "in_progress",
    quality_rating: 3,
    teacher_remarks: "",
    teacher_verified: false,
  });

  const filteredRecords = records?.filter((record) => {
    const studentName = students?.find(s => s.id === record.student_id)?.profiles?.full_name || "";
    const matchesSearch = studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.surah_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddRecord = async () => {
    if (!newRecord.student_id) return;
    await addRecord.mutateAsync(newRecord);
    setIsDialogOpen(false);
    setNewRecord({
      student_id: "",
      surah_number: 1,
      surah_name: "Al-Fatihah",
      juz_number: 1,
      verses_from: 1,
      verses_to: 7,
      status: "in_progress",
      quality_rating: 3,
      teacher_remarks: "",
      teacher_verified: false,
    });
  };

  const handleVerify = async (recordId: string, verified: boolean) => {
    await updateRecord.mutateAsync({ 
      id: recordId, 
      teacher_verified: verified,
      status: verified ? "completed" : "in_progress"
    });
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "completed":
        return "bg-success/10 text-success";
      case "in_progress":
        return "bg-warning/10 text-warning";
      case "needs_review":
        return "bg-info/10 text-info";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getQualityStars = (rating: number | null) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star 
          key={i} 
          className={`w-4 h-4 ${i < (rating || 0) ? "fill-warning text-warning" : "text-muted-foreground"}`} 
        />
      );
    }
    return stars;
  };

  // Calculate stats
  const totalRecords = records?.length || 0;
  const completedRecords = records?.filter(r => r.status === "completed").length || 0;
  const verifiedRecords = records?.filter(r => r.teacher_verified).length || 0;

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Quran Memorization</h1>
            <p className="text-muted-foreground">Track student Quran memorization progress</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Record
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Memorization Record</DialogTitle>
                <DialogDescription>
                  Record a student's Quran memorization progress
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                <div className="grid gap-2">
                  <Label htmlFor="student">Student *</Label>
                  <Select
                    value={newRecord.student_id}
                    onValueChange={(value) => setNewRecord({ ...newRecord, student_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students?.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.profiles?.full_name || student.registration_number || "Student"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="surah">Surah</Label>
                    <Select
                      value={newRecord.surah_number.toString()}
                      onValueChange={(value) => {
                        const surah = SURAHS.find(s => s.number === parseInt(value));
                        setNewRecord({ 
                          ...newRecord, 
                          surah_number: parseInt(value),
                          surah_name: surah?.name || "",
                          verses_to: surah?.verses || 1
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select surah" />
                      </SelectTrigger>
                      <SelectContent>
                        {SURAHS.map((surah) => (
                          <SelectItem key={surah.number} value={surah.number.toString()}>
                            {surah.number}. {surah.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="juz">Juz Number</Label>
                    <Input
                      id="juz"
                      type="number"
                      value={newRecord.juz_number}
                      onChange={(e) => setNewRecord({ ...newRecord, juz_number: parseInt(e.target.value) || 1 })}
                      min={1}
                      max={30}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="verses_from">From Verse</Label>
                    <Input
                      id="verses_from"
                      type="number"
                      value={newRecord.verses_from}
                      onChange={(e) => setNewRecord({ ...newRecord, verses_from: parseInt(e.target.value) || 1 })}
                      min={1}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="verses_to">To Verse</Label>
                    <Input
                      id="verses_to"
                      type="number"
                      value={newRecord.verses_to}
                      onChange={(e) => setNewRecord({ ...newRecord, verses_to: parseInt(e.target.value) || 1 })}
                      min={1}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newRecord.status}
                    onValueChange={(value) => setNewRecord({ ...newRecord, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="needs_review">Needs Review</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="quality">Quality Rating (1-5)</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <Button
                        key={rating}
                        type="button"
                        variant={newRecord.quality_rating >= rating ? "default" : "outline"}
                        size="icon"
                        onClick={() => setNewRecord({ ...newRecord, quality_rating: rating })}
                      >
                        <Star className={`w-4 h-4 ${newRecord.quality_rating >= rating ? "fill-current" : ""}`} />
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="remarks">Teacher Remarks</Label>
                  <Textarea
                    id="remarks"
                    value={newRecord.teacher_remarks}
                    onChange={(e) => setNewRecord({ ...newRecord, teacher_remarks: e.target.value })}
                    placeholder="Add notes about the student's recitation..."
                    rows={3}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="verified">Verified by Teacher</Label>
                  <Switch
                    id="verified"
                    checked={newRecord.teacher_verified}
                    onCheckedChange={(checked) => setNewRecord({ ...newRecord, teacher_verified: checked })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddRecord} disabled={addRecord.isPending || !newRecord.student_id}>
                  {addRecord.isPending ? "Adding..." : "Add Record"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalRecords}</p>
                  <p className="text-sm text-muted-foreground">Total Records</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <Check className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{completedRecords}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalRecords - completedRecords}</p>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                  <Star className="w-5 h-5 text-info" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{verifiedRecords}</p>
                  <p className="text-sm text-muted-foreground">Verified</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by student or surah..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="needs_review">Needs Review</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Records Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Memorization Records</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : filteredRecords && filteredRecords.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Surah</TableHead>
                      <TableHead>Verses</TableHead>
                      <TableHead>Juz</TableHead>
                      <TableHead>Quality</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Verified</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((record) => {
                      const student = students?.find(s => s.id === record.student_id);
                      return (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">
                            {student?.profiles?.full_name || student?.registration_number || "Unknown"}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{record.surah_name}</p>
                              <p className="text-xs text-muted-foreground">Surah {record.surah_number}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {record.verses_from} - {record.verses_to}
                          </TableCell>
                          <TableCell>Juz {record.juz_number || "-"}</TableCell>
                          <TableCell>
                            <div className="flex">{getQualityStars(record.quality_rating)}</div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(record.status)}>
                              {record.status?.replace("_", " ") || "Unknown"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={record.teacher_verified || false}
                              onCheckedChange={(checked) => handleVerify(record.id, checked)}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No memorization records found</p>
                <Button variant="outline" className="mt-4" onClick={() => setIsDialogOpen(true)}>
                  Add First Record
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default QuranMemorization;
