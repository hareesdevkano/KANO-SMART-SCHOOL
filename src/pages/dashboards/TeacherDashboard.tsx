import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useTeacherStats,
  useTeacherClasses,
  useTeacherAttendance,
} from "@/hooks/useTeacherData";
import {
  Users,
  BookOpen,
  ClipboardCheck,
  FileText,
  Calendar,
  ChevronRight,
  UserPlus,
  PenLine,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const TeacherDashboard = () => {
  const { data: stats, isLoading: statsLoading } = useTeacherStats();
  const { data: classes, isLoading: classesLoading } = useTeacherClasses();
  const { data: recentAttendance } = useTeacherAttendance();

  const today = new Date().toISOString().split("T")[0];
  const todayAttendance = recentAttendance?.filter(a => a.date === today) || [];

  const quickActions = [
    { label: "Manage Classes", icon: BookOpen, href: "/teacher/classes", color: "text-primary" },
    { label: "Enroll Student", icon: UserPlus, href: "/teacher/students", color: "text-info" },
    { label: "Mark Attendance", icon: ClipboardCheck, href: "/teacher/attendance", color: "text-success" },
    { label: "Enter Results", icon: PenLine, href: "/teacher/results", color: "text-warning" },
    { label: "Lesson Plans", icon: FileText, href: "/teacher/lesson-plans", color: "text-secondary" },
    { label: "Scheme of Work", icon: Calendar, href: "/teacher/scheme-of-work", color: "text-primary" },
  ];

  if (statsLoading || classesLoading) {
    return (
      <DashboardLayout role="teacher">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="teacher">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-success/80 via-primary to-primary/90 p-8 mb-8">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9zdmc+')] opacity-40" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-widest">Teacher Portal</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Your Teaching Dashboard</h2>
          <p className="text-white/70 text-sm">Manage your classes, attendance, and student performance</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="My Classes" value={String(stats?.totalClasses || 0)} change={`${stats?.totalStudents || 0} total students`} changeType="neutral" icon={BookOpen} iconColor="bg-primary" />
        <StatsCard title="Total Students" value={String(stats?.totalStudents || 0)} change="Across all classes" changeType="neutral" icon={Users} iconColor="bg-info" />
        <StatsCard title="Today's Attendance" value={String(todayAttendance.length)} change="Records marked today" changeType="positive" icon={ClipboardCheck} iconColor="bg-success" />
        <StatsCard title="Assessments" value={String(stats?.totalAssessments || 0)} change="Created this term" changeType="neutral" icon={FileText} iconColor="bg-warning" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* My Classes */}
        <div className="lg:col-span-2 rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-foreground">My Classes</h3>
            <Link to="/teacher/classes">
              <Button variant="ghost" size="sm" className="text-primary rounded-lg gap-1">View All <ArrowRight className="w-3.5 h-3.5" /></Button>
            </Link>
          </div>
          {classes && classes.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {classes.slice(0, 4).map((cls) => (
                <Link key={cls.id} to={`/teacher/classes?class=${cls.id}`} className="group p-5 rounded-xl border border-border/30 bg-muted/20 hover:bg-muted/40 hover:border-primary/20 transition-all duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <h4 className="font-bold text-foreground mb-1">{cls.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Users className="w-3.5 h-3.5" />
                    {(cls.students as any)?.[0]?.count || 0} students
                  </div>
                  <Badge variant="outline" className="mt-2 text-[10px] rounded-lg">{cls.academic_levels?.name || "Level"}</Badge>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-7 h-7 text-muted-foreground/50" />
              </div>
              <p className="text-muted-foreground text-sm">No classes assigned yet</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl p-6">
          <h3 className="text-lg font-bold text-foreground mb-6">Quick Actions</h3>
          <div className="space-y-2">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.href}>
                <div className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-muted/40 transition-colors group cursor-pointer">
                  <div className="w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <action.icon className={`w-4 h-4 ${action.color}`} />
                  </div>
                  <span className="text-sm font-medium text-foreground">{action.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Today's Attendance */}
        <div className="lg:col-span-2 rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-foreground">Today's Attendance</h3>
            <Link to="/teacher/attendance">
              <Button variant="ghost" size="sm" className="text-primary rounded-lg gap-1">Mark Attendance <ArrowRight className="w-3.5 h-3.5" /></Button>
            </Link>
          </div>
          {classes && classes.length > 0 ? (
            <div className="space-y-4">
              {classes.slice(0, 3).map((cls) => {
                const classAttendance = todayAttendance.filter(a => a.class_id === cls.id);
                const totalStudents = (cls.students as any)?.[0]?.count || 0;
                const presentCount = classAttendance.filter(a => a.status === "present").length;
                const percentage = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;
                return (
                  <div key={cls.id} className="p-4 rounded-xl bg-muted/20 border border-border/30">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-foreground text-sm">{cls.name}</span>
                      <span className="text-xs font-medium text-muted-foreground">{presentCount}/{totalStudents} ({percentage}%)</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <ClipboardCheck className="w-7 h-7 text-muted-foreground/50" />
              </div>
              <p className="text-muted-foreground text-sm">No classes to show attendance</p>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl p-6">
          <h3 className="text-lg font-bold text-foreground mb-6">Recent Activity</h3>
          {recentAttendance && recentAttendance.length > 0 ? (
            <div className="space-y-2">
              {recentAttendance.slice(0, 5).map((record, index) => (
                <div key={record.id || index} className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/30">
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-xs">{record.students?.registration_number || "Student"}</p>
                    <p className="text-[10px] text-muted-foreground">{record.classes?.name} - {record.date}</p>
                  </div>
                  <Badge variant="outline" className={`text-[10px] rounded-lg ${record.status === "present" ? "bg-success/10 text-success border-success/30" : "bg-destructive/10 text-destructive border-destructive/30"}`}>
                    {record.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-7 h-7 text-muted-foreground/50" />
              </div>
              <p className="text-muted-foreground text-sm">No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
