import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  GraduationCap,
  BookOpen,
  CreditCard,
  Bell,
  TrendingUp,
  ArrowRight,
  Plus,
  Sparkles,
  Calendar,
} from "lucide-react";
import {
  useSchoolDetails,
  useSchoolStats,
  useSchoolStudents,
  useSchoolAnnouncements,
} from "@/hooks/useSchoolAdminData";

const SchoolAdminDashboard = () => {
  const { data: school, isLoading: schoolLoading } = useSchoolDetails();
  const { data: stats, isLoading: statsLoading } = useSchoolStats();
  const { data: students, isLoading: studentsLoading } = useSchoolStudents();
  const { data: announcements, isLoading: announcementsLoading } = useSchoolAnnouncements();

  const recentStudents = students?.slice(0, 5) || [];
  const recentAnnouncements = announcements?.slice(0, 3) || [];

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount);

  if (schoolLoading || statsLoading) {
    return (
      <DashboardLayout role="school-admin">
        <Skeleton className="h-40 rounded-2xl mb-8" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="school-admin">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-info/80 via-primary to-primary/90 p-8 mb-8">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9zdmc+')] opacity-40" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-xs font-semibold text-accent uppercase tracking-widest">School Admin</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {school?.name || "Your School"}
            </h2>
            <p className="text-white/70 text-sm">
              {school?.school_type?.replace("_", " ").toUpperCase() || "SCHOOL"} &bull; {school?.state || "Nigeria"}
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/school-admin/announcements">
              <Button className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 rounded-xl" size="sm">
                <Bell className="w-4 h-4 mr-2" />Announcements
              </Button>
            </Link>
            <Link to="/school-admin/students">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl shadow-lg shadow-accent/20" size="sm">
                <Plus className="w-4 h-4 mr-2" />Add Student
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Total Students" value={(stats?.totalStudents || 0).toLocaleString()} change="Enrolled students" changeType="neutral" icon={Users} iconColor="bg-primary" />
        <StatsCard title="Total Teachers" value={(stats?.totalTeachers || 0).toString()} change="Active staff" changeType="neutral" icon={GraduationCap} iconColor="bg-info" />
        <StatsCard title="Classes" value={(stats?.totalClasses || 0).toString()} change="All levels" changeType="neutral" icon={BookOpen} iconColor="bg-secondary" />
        <StatsCard title="Fees Collected" value={formatCurrency(stats?.totalFeesCollected || 0)} change="Total payments" changeType="positive" icon={CreditCard} iconColor="bg-success" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl p-6">
          <h3 className="text-lg font-bold text-foreground mb-6">Quick Actions</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: "Manage Students", icon: Users, href: "/school-admin/students", color: "text-primary" },
              { label: "Manage Teachers", icon: GraduationCap, href: "/school-admin/teachers", color: "text-info" },
              { label: "Manage Classes", icon: BookOpen, href: "/school-admin/classes", color: "text-secondary" },
              { label: "View Results", icon: TrendingUp, href: "/school-admin", color: "text-success" },
              { label: "Fee Management", icon: CreditCard, href: "/school-admin/fees", color: "text-warning" },
              { label: "Announcements", icon: Bell, href: "/school-admin/announcements", color: "text-primary" },
            ].map((action, index) => (
              <Link key={index} to={action.href}>
                <div className="flex items-center gap-3 p-4 rounded-xl border border-border/30 bg-muted/20 hover:bg-muted/40 hover:border-primary/20 transition-all duration-200 cursor-pointer group">
                  <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <action.icon className={`w-5 h-5 ${action.color}`} />
                  </div>
                  <span className="font-medium text-foreground text-sm">{action.label}</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Announcements */}
        <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-foreground">Announcements</h3>
            <Link to="/school-admin/announcements">
              <Button variant="ghost" size="sm" className="text-primary rounded-lg gap-1">View All <ArrowRight className="w-3.5 h-3.5" /></Button>
            </Link>
          </div>
          {announcementsLoading ? (
            <div className="space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
          ) : recentAnnouncements.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-12">No announcements yet</p>
          ) : (
            <div className="space-y-3">
              {recentAnnouncements.map((a) => (
                <div key={a.id} className="p-4 rounded-xl bg-muted/30 border-l-[3px] border-l-primary hover:bg-muted/50 transition-colors">
                  <p className="font-semibold text-foreground text-sm">{a.title}</p>
                  <p className="text-[11px] text-muted-foreground/60 mt-2 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />{new Date(a.created_at).toLocaleDateString("en-NG")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Students */}
        <div className="lg:col-span-2 rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-foreground">Recent Students</h3>
            <Link to="/school-admin/students">
              <Button variant="ghost" size="sm" className="text-primary rounded-lg gap-1">View All <ArrowRight className="w-3.5 h-3.5" /></Button>
            </Link>
          </div>
          {studentsLoading ? (
            <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
          ) : recentStudents.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-12">No students registered yet</p>
          ) : (
            <div className="space-y-3">
              {recentStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-border/30 hover:bg-muted/40 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{student.guardian_name || "N/A"}</p>
                      <p className="text-xs text-muted-foreground">{student.classes?.name || "No class assigned"}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="rounded-lg text-[10px]">{student.gender || "N/A"}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* School Info */}
        <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl p-6">
          <h3 className="text-lg font-bold text-foreground mb-6">School Information</h3>
          <div className="space-y-4">
            {[
              { label: "Status", value: <Badge className={school?.status === "approved" ? "bg-success/10 text-success border-0" : school?.status === "pending" ? "bg-warning/10 text-warning border-0" : "bg-destructive/10 text-destructive border-0"}>{school?.status?.charAt(0).toUpperCase() + school?.status?.slice(1) || "Unknown"}</Badge> },
              { label: "Plan", value: <Badge variant="outline" className="rounded-lg">{school?.subscription_plan?.replace("_", " ").toUpperCase() || "FREE"}</Badge> },
              { label: "Type", value: <span className="text-foreground text-sm capitalize">{school?.school_type?.replace("_", " ") || "N/A"}</span> },
              { label: "Location", value: <span className="text-foreground text-sm">{school?.city || school?.state || "Nigeria"}</span> },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{item.label}</span>
                {item.value}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SchoolAdminDashboard;
