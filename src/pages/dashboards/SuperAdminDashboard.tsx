import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import PendingApprovalsSection from "@/components/super-admin/PendingApprovalsSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Users,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
  GraduationCap,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useDashboardStats, useRecentSchools } from "@/hooks/useSuperAdminData";
import { formatDistanceToNow } from "date-fns";

const schoolTypeLabels: Record<string, string> = {
  nursery_primary: "Nursery & Primary",
  secondary: "Secondary",
  islamiyya: "Islamiyya",
  tahfiz: "Tahfiz",
  college_of_education: "College of Education",
  polytechnic: "Polytechnic",
  university: "University",
  vocational: "Vocational",
  adult_education: "Adult Education",
};

const statusColors = {
  pending: "bg-warning/10 text-warning border-0",
  approved: "bg-success/10 text-success border-0",
  suspended: "bg-destructive/10 text-destructive border-0",
  expired: "bg-muted text-muted-foreground border-0",
};

const statusIcons = {
  pending: Clock,
  approved: CheckCircle,
  suspended: XCircle,
  expired: XCircle,
};

const SuperAdminDashboard = () => {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: recentSchools, isLoading: schoolsLoading } = useRecentSchools(5);

  const estimatedRevenue = stats
    ? (stats.subscriptionDistribution.premium * 35000) +
      (stats.subscriptionDistribution.basic * 15000) +
      (stats.subscriptionDistribution.enterprise * 75000)
    : 0;

  const totalSchools = stats?.totalSchools || 0;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount);

  if (statsLoading) {
    return (
      <DashboardLayout role="super-admin">
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="super-admin">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-hero p-8 mb-8">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9zdmc+')] opacity-40" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-xs font-semibold text-accent uppercase tracking-widest">Platform Admin</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Platform Overview</h2>
            <p className="text-white/70 text-sm">Manage schools, users, and subscriptions across the platform</p>
          </div>
          <div className="flex gap-3">
            <Link to="/super-admin/schools">
              <Button className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 rounded-xl" size="sm">
                <Building2 className="w-4 h-4 mr-2" />Manage Schools
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Total Schools" value={stats?.totalSchools?.toString() || "0"} change={`+${stats?.thisMonthRegistrations || 0} this month`} changeType="positive" icon={Building2} iconColor="bg-primary" />
        <StatsCard title="Total Students" value={stats?.totalStudents?.toLocaleString() || "0"} change="Across all schools" changeType="positive" icon={Users} iconColor="bg-info" />
        <StatsCard title="Total Teachers" value={stats?.totalTeachers?.toLocaleString() || "0"} change="Active instructors" changeType="positive" icon={GraduationCap} iconColor="bg-success" />
        <StatsCard title="Est. Revenue" value={formatCurrency(estimatedRevenue)} change="Monthly estimate" changeType="positive" icon={TrendingUp} iconColor="bg-warning" />
      </div>

      {/* Pending Approvals */}
      <PendingApprovalsSection />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Schools */}
        <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-foreground">Recent Registrations</h3>
            <Link to="/super-admin/schools">
              <Button variant="ghost" size="sm" className="text-primary rounded-lg gap-1">View All <ArrowRight className="w-3.5 h-3.5" /></Button>
            </Link>
          </div>
          {schoolsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary" />
            </div>
          ) : recentSchools?.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-7 h-7 text-muted-foreground/50" />
              </div>
              <p className="text-muted-foreground text-sm">No schools registered yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentSchools?.map((school) => {
                const StatusIcon = statusIcons[school.status as keyof typeof statusIcons] || Clock;
                return (
                  <div key={school.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-border/30 hover:bg-muted/40 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{school.name}</p>
                        <p className="text-xs text-muted-foreground">{schoolTypeLabels[school.school_type] || school.school_type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={statusColors[school.status as keyof typeof statusColors] || statusColors.pending}>
                        <StatusIcon className="w-3 h-3 mr-1" />{school.status}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground hidden sm:block">
                        {school.created_at ? formatDistanceToNow(new Date(school.created_at), { addSuffix: true }) : "N/A"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Subscription Distribution */}
        <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-foreground">Subscriptions</h3>
            <Link to="/super-admin/subscriptions">
              <Button variant="ghost" size="sm" className="text-primary rounded-lg gap-1">Manage <ArrowRight className="w-3.5 h-3.5" /></Button>
            </Link>
          </div>
          <div className="space-y-5">
            {[
              { plan: "Enterprise", count: stats?.subscriptionDistribution.enterprise || 0, percentage: totalSchools > 0 ? ((stats?.subscriptionDistribution.enterprise || 0) / totalSchools * 100) : 0, color: "bg-primary" },
              { plan: "Premium", count: stats?.subscriptionDistribution.premium || 0, percentage: totalSchools > 0 ? ((stats?.subscriptionDistribution.premium || 0) / totalSchools * 100) : 0, color: "bg-warning" },
              { plan: "Basic", count: stats?.subscriptionDistribution.basic || 0, percentage: totalSchools > 0 ? ((stats?.subscriptionDistribution.basic || 0) / totalSchools * 100) : 0, color: "bg-info" },
              { plan: "Free", count: stats?.subscriptionDistribution.free || 0, percentage: totalSchools > 0 ? ((stats?.subscriptionDistribution.free || 0) / totalSchools * 100) : 0, color: "bg-muted-foreground" },
            ].map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-foreground text-sm">{item.plan}</span>
                  <span className="text-xs text-muted-foreground">{item.count} ({item.percentage.toFixed(0)}%)</span>
                </div>
                <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-border/30">
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Pending", value: stats?.pendingSchools || 0, color: "text-warning" },
                { label: "Approved", value: stats?.approvedSchools || 0, color: "text-success" },
                { label: "Suspended", value: stats?.suspendedSchools || 0, color: "text-destructive" },
              ].map((item, i) => (
                <div key={i} className="text-center p-3 rounded-xl bg-muted/20">
                  <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;
