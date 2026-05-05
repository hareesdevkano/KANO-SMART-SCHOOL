import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardStats, useSchools } from "@/hooks/useSuperAdminData";
import {
  Building2,
  Users,
  GraduationCap,
  TrendingUp,
  Calendar,
} from "lucide-react";

const AnalyticsDashboard = () => {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: schools } = useSchools();

  // Group schools by type
  const schoolsByType = schools?.reduce((acc, school) => {
    const type = school.school_type;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

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

  const totalSchools = schools?.length || 0;

  if (statsLoading) {
    return (
      <DashboardLayout role="super-admin">
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="super-admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Platform Analytics</h1>
          <p className="text-muted-foreground">Comprehensive overview of platform performance</p>
        </div>

        {/* Main Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
                  <Building2 className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Schools</p>
                  <p className="text-3xl font-bold text-foreground">{stats?.totalSchools || 0}</p>
                  <p className="text-xs text-primary">+{stats?.thisMonthRegistrations || 0} this month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-success/20 flex items-center justify-center">
                  <Users className="w-7 h-7 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-3xl font-bold text-foreground">{stats?.totalStudents?.toLocaleString() || 0}</p>
                  <p className="text-xs text-success">Across all schools</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-info/10 to-info/5 border-info/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-info/20 flex items-center justify-center">
                  <GraduationCap className="w-7 h-7 text-info" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Teachers</p>
                  <p className="text-3xl font-bold text-foreground">{stats?.totalTeachers?.toLocaleString() || 0}</p>
                  <p className="text-xs text-info">Active instructors</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-warning/20 flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Approved Schools</p>
                  <p className="text-3xl font-bold text-foreground">{stats?.approvedSchools || 0}</p>
                  <p className="text-xs text-warning">
                    {totalSchools > 0 ? Math.round((stats?.approvedSchools || 0) / totalSchools * 100) : 0}% of total
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* School Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                School Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { label: "Approved", value: stats?.approvedSchools || 0, color: "bg-success", percentage: totalSchools > 0 ? ((stats?.approvedSchools || 0) / totalSchools * 100) : 0 },
                  { label: "Pending", value: stats?.pendingSchools || 0, color: "bg-warning", percentage: totalSchools > 0 ? ((stats?.pendingSchools || 0) / totalSchools * 100) : 0 },
                  { label: "Suspended", value: stats?.suspendedSchools || 0, color: "bg-destructive", percentage: totalSchools > 0 ? ((stats?.suspendedSchools || 0) / totalSchools * 100) : 0 },
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">{item.label}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.value} ({item.percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all duration-500`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Subscription Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Subscription Plans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { label: "Enterprise", value: stats?.subscriptionDistribution.enterprise || 0, color: "bg-primary", percentage: totalSchools > 0 ? ((stats?.subscriptionDistribution.enterprise || 0) / totalSchools * 100) : 0 },
                  { label: "Premium", value: stats?.subscriptionDistribution.premium || 0, color: "bg-warning", percentage: totalSchools > 0 ? ((stats?.subscriptionDistribution.premium || 0) / totalSchools * 100) : 0 },
                  { label: "Basic", value: stats?.subscriptionDistribution.basic || 0, color: "bg-info", percentage: totalSchools > 0 ? ((stats?.subscriptionDistribution.basic || 0) / totalSchools * 100) : 0 },
                  { label: "Free", value: stats?.subscriptionDistribution.free || 0, color: "bg-muted-foreground", percentage: totalSchools > 0 ? ((stats?.subscriptionDistribution.free || 0) / totalSchools * 100) : 0 },
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">{item.label}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.value} ({item.percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all duration-500`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* School Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Schools by Institution Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(schoolTypeLabels).map(([key, label]) => {
                const count = schoolsByType[key] || 0;
                const percentage = totalSchools > 0 ? (count / totalSchools * 100) : 0;
                return (
                  <div
                    key={key}
                    className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">{label}</span>
                      <span className="text-2xl font-bold text-primary">{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{percentage.toFixed(1)}% of total</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsDashboard;
