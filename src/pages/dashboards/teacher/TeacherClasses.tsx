import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useTeacherClasses, useTeacherAcademicLevels } from "@/hooks/useTeacherData";
import { Search, BookOpen, Users, ChevronRight, Info } from "lucide-react";

const TeacherClasses = () => {
  const { data: classes, isLoading } = useTeacherClasses();
  const { data: levels } = useTeacherAcademicLevels();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClasses = classes?.filter((cls) =>
    cls.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        {/* Header — view only */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Classes</h1>
            <p className="text-muted-foreground">
              Classes assigned to you by the school administrator
            </p>
          </div>
        </div>

        {/* Info banner */}
        <Card className="border-info/30 bg-info/5">
          <CardContent className="p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              Only school administrators can create or modify classes and academic levels.
              Contact your school admin if you need a new class added.
            </p>
          </CardContent>
        </Card>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Academic Levels Summary */}
        {levels && levels.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Academic Levels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {levels.map((level) => (
                  <Badge key={level.id} variant="secondary" className="text-sm py-1 px-3">
                    {level.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Classes Grid */}
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading classes...</div>
        ) : filteredClasses && filteredClasses.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClasses.map((cls) => (
              <Link key={cls.id} to={`/teacher/students?class=${cls.id}`}>
                <Card className="hover:shadow-md transition-all cursor-pointer group h-full">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-primary" />
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="font-semibold text-lg text-foreground mb-2">{cls.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {(cls.students as any)?.[0]?.count || 0} students
                      </span>
                      <span>Capacity: {cls.capacity || 40}</span>
                    </div>
                    <Badge variant="outline">
                      {cls.academic_levels?.name || "Level"}
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12 text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No classes assigned to you yet</p>
              <p className="text-sm mt-2">
                Ask your school administrator to assign you to one or more classes.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeacherClasses;
