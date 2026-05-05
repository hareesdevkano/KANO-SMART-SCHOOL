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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  useSchoolClasses,
  useAcademicLevels,
  useAddClass,
  useDeleteClass,
  useAddAcademicLevel,
  useDeleteAcademicLevel,
} from "@/hooks/useSchoolAdminData";
import { Search, Plus, Trash2, BookOpen, Layers } from "lucide-react";
import { toast } from "sonner";

const ClassesManagement = () => {
  const { data: classes, isLoading } = useSchoolClasses();
  const { data: levels, isLoading: levelsLoading } = useAcademicLevels();
  const addClass = useAddClass();
  const deleteClass = useDeleteClass();
  const addLevel = useAddAcademicLevel();
  const deleteLevel = useDeleteAcademicLevel();

  const [searchTerm, setSearchTerm] = useState("");
  const [isClassDialogOpen, setIsClassDialogOpen] = useState(false);
  const [isLevelDialogOpen, setIsLevelDialogOpen] = useState(false);
  const [newClass, setNewClass] = useState({
    name: "",
    level_id: "",
    capacity: 40,
  });
  const [newLevel, setNewLevel] = useState({
    name: "",
    description: "",
    order_index: 0,
  });

  const filteredClasses = classes?.filter((cls) => {
    const matchesSearch =
      cls.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.academic_levels?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleAddClass = async () => {
    if (!newClass.name || !newClass.level_id) {
      toast.error("Name and level are required");
      return;
    }
    await addClass.mutateAsync(newClass);
    setIsClassDialogOpen(false);
    setNewClass({
      name: "",
      level_id: "",
      capacity: 40,
    });
  };

  const handleAddLevel = async () => {
    if (!newLevel.name) {
      toast.error("Level name is required");
      return;
    }
    await addLevel.mutateAsync({
      ...newLevel,
      order_index: levels?.length || 0,
    });
    setIsLevelDialogOpen(false);
    setNewLevel({
      name: "",
      description: "",
      order_index: 0,
    });
  };

  const handleDeleteClass = async (id: string) => {
    if (confirm("Are you sure you want to delete this class?")) {
      await deleteClass.mutateAsync(id);
    }
  };

  const handleDeleteLevel = async (id: string) => {
    if (confirm("Are you sure you want to delete this level? This will affect all classes under this level.")) {
      await deleteLevel.mutateAsync(id);
    }
  };

  return (
    <DashboardLayout role="school-admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Classes & Levels Management</h1>
          <p className="text-muted-foreground">
            Manage academic levels and classes in your school
          </p>
        </div>

        <Tabs defaultValue="levels" className="space-y-4">
          <TabsList>
            <TabsTrigger value="levels" className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Academic Levels
            </TabsTrigger>
            <TabsTrigger value="classes" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Classes
            </TabsTrigger>
          </TabsList>

          {/* Academic Levels Tab */}
          <TabsContent value="levels" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={isLevelDialogOpen} onOpenChange={setIsLevelDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Level
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Academic Level</DialogTitle>
                    <DialogDescription>
                      Create a new academic level (e.g., JSS 1, SSS 2, Year 1)
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="level-name">Level Name *</Label>
                      <Input
                        id="level-name"
                        value={newLevel.name}
                        onChange={(e) =>
                          setNewLevel({ ...newLevel, name: e.target.value })
                        }
                        placeholder="e.g., JSS 1, SSS 2, Primary 1"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="level-description">Description</Label>
                      <Textarea
                        id="level-description"
                        value={newLevel.description}
                        onChange={(e) =>
                          setNewLevel({ ...newLevel, description: e.target.value })
                        }
                        placeholder="Optional description"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsLevelDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddLevel} disabled={addLevel.isPending}>
                      {addLevel.isPending ? "Adding..." : "Add Level"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="w-5 h-5" />
                  Academic Levels ({levels?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {levelsLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading levels...
                  </div>
                ) : levels && levels.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order</TableHead>
                          <TableHead>Level Name</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Classes</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {levels.map((level, index) => (
                          <TableRow key={level.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell className="font-medium">
                              {level.name}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {level.description || "-"}
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">
                                {classes?.filter(c => c.level_id === level.id).length || 0} classes
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteLevel(level.id)}
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
                    <Layers className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No academic levels found</p>
                    <p className="text-sm mt-2">
                      Create levels like "JSS 1", "SSS 2", "Primary 1" to organize your classes
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setIsLevelDialogOpen(true)}
                    >
                      Add Your First Level
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Classes Tab */}
          <TabsContent value="classes" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by class name or level..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Dialog open={isClassDialogOpen} onOpenChange={setIsClassDialogOpen}>
                <DialogTrigger asChild>
                  <Button disabled={!levels || levels.length === 0}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Class
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Class</DialogTitle>
                    <DialogDescription>
                      Enter class details to create a new class.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Class Name *</Label>
                      <Input
                        id="name"
                        value={newClass.name}
                        onChange={(e) =>
                          setNewClass({ ...newClass, name: e.target.value })
                        }
                        placeholder="e.g., JSS 1A, SSS 2B"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="level">Academic Level *</Label>
                      <Select
                        value={newClass.level_id}
                        onValueChange={(value) =>
                          setNewClass({ ...newClass, level_id: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          {levels?.map((level) => (
                            <SelectItem key={level.id} value={level.id}>
                              {level.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="capacity">Capacity</Label>
                      <Input
                        id="capacity"
                        type="number"
                        value={newClass.capacity}
                        onChange={(e) =>
                          setNewClass({ ...newClass, capacity: parseInt(e.target.value) || 40 })
                        }
                        placeholder="40"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsClassDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddClass} disabled={addClass.isPending}>
                      {addClass.isPending ? "Adding..." : "Add Class"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  All Classes ({filteredClasses?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading classes...
                  </div>
                ) : filteredClasses && filteredClasses.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Class Name</TableHead>
                          <TableHead>Academic Level</TableHead>
                          <TableHead>Capacity</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredClasses.map((cls) => (
                          <TableRow key={cls.id}>
                            <TableCell className="font-medium">
                              {cls.name}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {cls.academic_levels?.name || "N/A"}
                              </Badge>
                            </TableCell>
                            <TableCell>{cls.capacity || 40}</TableCell>
                            <TableCell>
                              {cls.created_at
                                ? new Date(cls.created_at).toLocaleDateString()
                                : "-"}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteClass(cls.id)}
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
                    <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No classes found</p>
                    {levels && levels.length === 0 ? (
                      <p className="text-sm mt-2">
                        Please create academic levels first in the "Academic Levels" tab
                      </p>
                    ) : (
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => setIsClassDialogOpen(true)}
                      >
                        Add Your First Class
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ClassesManagement;
