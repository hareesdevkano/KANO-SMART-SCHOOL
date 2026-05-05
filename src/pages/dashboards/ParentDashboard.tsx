import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  ClipboardCheck,
  FileText,
  CreditCard,
  Bell,
  Calendar,
  TrendingUp,
  BookOpen,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import {
  useParentChildren,
  useChildAttendanceStats,
  useChildPerformanceStats,
  useParentAnnouncements,
} from "@/hooks/useParentData";
import { useAuth } from "@/hooks/useAuth";

const ChildStatsRow = ({ studentId }: { studentId: string }) => {
  const attendanceStats = useChildAttendanceStats(studentId);
  const performanceStats = useChildPerformanceStats(studentId);

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground">Attendance</span>
          <span className="text-xs font-bold text-foreground">{attendanceStats.percentage}%</span>
        </div>
        <Progress value={attendanceStats.percentage} className="h-1.5" />
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground">Average Score</span>
          <span className="text-xs font-bold text-foreground">{performanceStats.average}%</span>
        </div>
        <Progress value={performanceStats.average} className="h-1.5" />
      </div>
    </div>
  );
};

const ParentDashboard = () => {
  const { user } = useAuth();
  const { data: children, isLoading: childrenLoading } = useParentChildren();
  const { data: announcements } = useParentAnnouncements();
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

  const activeChild = selectedChildId || children?.[0]?.id || null;

  return (
    <DashboardLayout role="parent">
      {/* Welcome Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-warning/80 via-secondary to-secondary/80 p-8 mb-8">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9zdmc+')] opacity-40" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-white/80" />
              <span className="text-xs font-semibold text-white/80 uppercase tracking-widest">Parent Portal</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Welcome, {user?.user_metadata?.full_name || "Parent"}
            </h2>
            <p className="text-white/70 text-sm">
              You have {children?.length || 0} child{(children?.length || 0) !== 1 ? "ren" : ""} enrolled
            </p>
          </div>
          {children && children.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {children.map((child: any) => (
                <Button
                  key={child.id}
                  className={`rounded-xl text-sm ${activeChild === child.id ? "bg-white text-secondary" : "bg-white/15 text-white border border-white/20 hover:bg-white/25"}`}
                  size="sm"
                  onClick={() => setSelectedChildId(child.id)}
                >
                  {child.profiles?.full_name || child.registration_number || "Student"}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      {childrenLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
        </div>
      ) : !children || children.length === 0 ? (
        <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
            <Users className="w-7 h-7 text-muted-foreground/50" />
          </div>
          <h3 className="text-xl font-bold mb-2">No Children Linked</h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Your account has not been linked to any students yet. Please contact your school administrator.
          </p>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard title="My Children" value={String(children.length)} change="Enrolled students" changeType="neutral" icon={Users} iconColor="bg-primary" />
            <StatsCard title="Announcements" value={String(announcements?.length || 0)} change="From school" changeType="neutral" icon={Bell} iconColor="bg-info" />
            <StatsCard title="Attendance" value="—" change="Select a child" changeType="neutral" icon={ClipboardCheck} iconColor="bg-success" />
            <StatsCard title="Performance" value="—" change="Select a child" changeType="neutral" icon={TrendingUp} iconColor="bg-warning" />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Children Overview */}
            <div className="lg:col-span-2 rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl p-6">
              <h3 className="text-lg font-bold text-foreground mb-6">My Children</h3>
              <div className="space-y-4">
                {children.map((child: any) => (
                  <div
                    key={child.id}
                    className={`p-5 rounded-xl border transition-all cursor-pointer ${
                      activeChild === child.id
                        ? "bg-primary/5 border-primary/30 shadow-sm"
                        : "bg-muted/20 border-border/30 hover:border-primary/20"
                    }`}
                    onClick={() => setSelectedChildId(child.id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Users className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground">{child.profiles?.full_name || "Student"}</h4>
                          <p className="text-xs text-muted-foreground">{child.classes?.name || "No class"} &bull; {child.registration_number || "N/A"}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="capitalize rounded-lg">{child.relationship}</Badge>
                    </div>
                    <ChildStatsRow studentId={child.id} />
                    <div className="flex gap-3 mt-4">
                      <Link to={`/parent/academics?child=${child.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full rounded-xl text-xs"><FileText className="w-3.5 h-3.5 mr-1.5" />Academics</Button>
                      </Link>
                      <Link to={`/parent/attendance?child=${child.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full rounded-xl text-xs"><ClipboardCheck className="w-3.5 h-3.5 mr-1.5" />Attendance</Button>
                      </Link>
                      <Link to={`/parent/memorization?child=${child.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full rounded-xl text-xs"><BookOpen className="w-3.5 h-3.5 mr-1.5" />Hifz</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Announcements */}
            <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-foreground">Announcements</h3>
                <div className="w-9 h-9 rounded-xl bg-info/10 flex items-center justify-center">
                  <Bell className="w-4 h-4 text-info" />
                </div>
              </div>
              {announcements && announcements.length > 0 ? (
                <div className="space-y-3">
                  {announcements.slice(0, 5).map((a: any) => (
                    <div key={a.id} className="p-4 rounded-xl bg-muted/30 border-l-[3px] border-l-primary hover:bg-muted/50 transition-colors">
                      <p className="font-semibold text-foreground text-sm">{a.title}</p>
                      <p className="text-[11px] text-muted-foreground/60 mt-2 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(a.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-12 text-sm">No announcements yet</p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="lg:col-span-3 rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl p-6">
              <h3 className="text-lg font-bold text-foreground mb-6">Quick Actions</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "View Attendance", icon: ClipboardCheck, desc: "Check daily attendance", href: "/parent/attendance", color: "bg-success" },
                  { label: "View Academics", icon: FileText, desc: "See exam results & grades", href: "/parent/academics", color: "bg-primary" },
                  { label: "Qur'an Progress", icon: BookOpen, desc: "Hifz memorization tracking", href: "/parent/memorization", color: "bg-info" },
                  { label: "Announcements", icon: Bell, desc: "School announcements", href: "/parent", color: "bg-warning" },
                ].map((action, index) => (
                  <Link key={index} to={action.href}>
                    <div className="group p-5 rounded-xl border border-border/30 bg-muted/20 hover:bg-muted/40 hover:border-primary/20 transition-all duration-200 cursor-pointer">
                      <div className={`w-11 h-11 rounded-xl ${action.color}/10 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                        <action.icon className={`w-5 h-5 ${action.color === "bg-primary" ? "text-primary" : action.color === "bg-success" ? "text-success" : action.color === "bg-info" ? "text-info" : "text-warning"}`} />
                      </div>
                      <p className="font-semibold text-foreground text-sm">{action.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">{action.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default ParentDashboard;
