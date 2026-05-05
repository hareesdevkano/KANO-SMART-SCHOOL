import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  ClipboardCheck,
  FileText,
  CreditCard,
  Calendar,
  Play,
  Bell,
  Award,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  useStudentProfile,
  useStudentStats,
  useStudentAnnouncements,
  useStudentFeeBalance,
  useStudentTermResults,
} from "@/hooks/useStudentData";

const StudentDashboard = () => {
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading } = useStudentProfile();
  const { data: stats, isLoading: statsLoading } = useStudentStats();
  const { data: announcements } = useStudentAnnouncements();
  const { data: feeBalance } = useStudentFeeBalance();
  const { data: termResults } = useStudentTermResults();

  const studentName = user?.user_metadata?.full_name || "Student";
  const className = (profile?.classes as any)?.name || "N/A";
  const regNo = profile?.registration_number || "N/A";
  const latestResults = termResults?.slice(0, 3) || [];

  return (
    <DashboardLayout role="student">
      {/* Welcome Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-hero p-8 mb-8">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9zdmc+')] opacity-40" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-xs font-semibold text-accent uppercase tracking-widest">Student Portal</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
              Welcome back, {profileLoading ? "..." : studentName}
            </h2>
            <p className="text-primary-foreground/70 text-sm">
              {className} &bull; Registration: {regNo}
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/student/results">
              <Button className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 rounded-xl" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                View Results
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsLoading ? (
          Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)
        ) : (
          <>
            <StatsCard title="Assessments" value={String(stats?.totalAssessments || 0)} change="Total taken" changeType="neutral" icon={BookOpen} iconColor="bg-primary" />
            <StatsCard title="Attendance Rate" value={`${stats?.attendanceRate || 0}%`} change={stats?.attendanceRate && stats.attendanceRate >= 80 ? "Good standing" : "Needs improvement"} changeType={stats?.attendanceRate && stats.attendanceRate >= 80 ? "positive" : "negative"} icon={ClipboardCheck} iconColor="bg-success" />
            <StatsCard title="Average Score" value={`${stats?.averageScore || 0}%`} change={stats?.averageScore && stats.averageScore >= 70 ? "Great performance" : "Keep working"} changeType={stats?.averageScore && stats.averageScore >= 70 ? "positive" : "neutral"} icon={FileText} iconColor="bg-info" />
            <StatsCard title="Fee Balance" value={`₦${(feeBalance?.balance || 0).toLocaleString()}`} change={feeBalance?.balance && feeBalance.balance > 0 ? "Outstanding" : "Cleared"} changeType={feeBalance?.balance && feeBalance.balance > 0 ? "negative" : "positive"} icon={CreditCard} iconColor="bg-warning" />
          </>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Results */}
        <div className="lg:col-span-2 rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-foreground">Recent Results</h3>
            <Link to="/student/results">
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary rounded-lg gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
          {latestResults.length > 0 ? (
            <div className="space-y-3">
              {latestResults.map((result: any) => (
                <div key={result.id} className="p-4 rounded-xl bg-muted/30 border border-border/30 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Award className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">
                        {(result.academic_terms as any)?.name || "Term"} — {(result.academic_terms as any)?.academic_sessions?.name || "Session"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Class: {(result.classes as any)?.name || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary/10 text-primary border-0 rounded-lg font-semibold">
                      {result.average_score?.toFixed(1) || 0}%
                    </Badge>
                    {result.position && (
                      <Badge variant="outline" className="rounded-lg">
                        {result.position}/{result.out_of}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-7 h-7 text-muted-foreground/50" />
              </div>
              <p className="text-muted-foreground text-sm">No published results yet</p>
            </div>
          )}
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
              {announcements.map((a: any) => (
                <div key={a.id} className="p-4 rounded-xl bg-muted/30 border-l-[3px] border-l-primary hover:bg-muted/50 transition-colors">
                  <p className="font-semibold text-foreground text-sm">{a.title}</p>
                  {a.content && (
                    <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{a.content}</p>
                  )}
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
              { label: "My Results", icon: Award, desc: "View term results", href: "/student/results", color: "bg-primary" },
              { label: "Attendance", icon: ClipboardCheck, desc: "View attendance record", href: "/student/attendance", color: "bg-success" },
              { label: "Fee Status", icon: CreditCard, desc: "Check fee balance", href: "/student/fees", color: "bg-warning" },
              { label: "My Profile", icon: Play, desc: "View your profile", href: "/student/profile", color: "bg-info" },
            ].map((action, index) => (
              <Link key={index} to={action.href}>
                <div className="group p-5 rounded-xl border border-border/30 bg-muted/20 hover:bg-muted/40 hover:border-primary/20 transition-all duration-200 cursor-pointer">
                  <div className={`w-11 h-11 rounded-xl ${action.color}/10 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                    <action.icon className={`w-5 h-5 ${action.color === "bg-primary" ? "text-primary" : action.color === "bg-success" ? "text-success" : action.color === "bg-warning" ? "text-warning" : "text-info"}`} />
                  </div>
                  <p className="font-semibold text-foreground text-sm">{action.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{action.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
