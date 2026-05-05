import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Building2,
  Search,
  MoreHorizontal,
  Crown,
  Star,
  Sparkles,
  Gift,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import { useSchools, useUpdateSchoolSubscription, useDashboardStats } from "@/hooks/useSuperAdminData";
import { formatDistanceToNow, format } from "date-fns";
import type { Database } from "@/integrations/supabase/types";

type SubscriptionPlan = Database["public"]["Enums"]["subscription_plan"];

const planConfig = {
  free: { icon: Gift, color: "bg-muted text-muted-foreground", label: "Free" },
  basic: { icon: Star, color: "bg-info/10 text-info border-info/30", label: "Basic" },
  premium: { icon: Crown, color: "bg-warning/10 text-warning border-warning/30", label: "Premium" },
  enterprise: { icon: Sparkles, color: "bg-primary/10 text-primary border-primary/30", label: "Enterprise" },
};

const planPrices = {
  free: "₦0",
  basic: "₦15,000/mo",
  premium: "₦35,000/mo",
  enterprise: "₦75,000/mo",
};

const SubscriptionsManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState<string>("all");

  const { data: schools, isLoading } = useSchools();
  const { data: stats } = useDashboardStats();
  const updateSubscription = useUpdateSchoolSubscription();

  const filteredSchools = schools?.filter((school) => {
    const matchesSearch =
      school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = planFilter === "all" || school.subscription_plan === planFilter;
    return matchesSearch && matchesPlan;
  });

  const handlePlanChange = (schoolId: string, plan: SubscriptionPlan) => {
    updateSubscription.mutate({ schoolId, plan });
  };

  // Calculate estimated monthly revenue
  const estimatedRevenue = schools?.reduce((acc, school) => {
    const prices: Record<string, number> = { free: 0, basic: 15000, premium: 35000, enterprise: 75000 };
    return acc + (prices[school.subscription_plan || "free"] || 0);
  }, 0) || 0;

  return (
    <DashboardLayout role="super-admin">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Subscriptions</h1>
            <p className="text-muted-foreground">Manage school subscription plans and billing</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Est. Monthly Revenue</p>
                  <p className="text-2xl font-bold text-foreground">
                    ₦{estimatedRevenue.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Crown className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Premium</p>
                  <p className="text-2xl font-bold text-foreground">
                    {stats?.subscriptionDistribution.premium || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
                  <Star className="w-6 h-6 text-info" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Basic</p>
                  <p className="text-2xl font-bold text-foreground">
                    {stats?.subscriptionDistribution.basic || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                  <Gift className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Free</p>
                  <p className="text-2xl font-bold text-foreground">
                    {stats?.subscriptionDistribution.free || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search schools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={planFilter} onValueChange={setPlanFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Subscriptions Table */}
        <Card>
          <CardHeader>
            <CardTitle>School Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredSchools?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CreditCard className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground">No subscriptions found</h3>
                <p className="text-muted-foreground">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>School</TableHead>
                      <TableHead>Current Plan</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Trial Ends</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSchools?.map((school) => {
                      const plan = school.subscription_plan || "free";
                      const planInfo = planConfig[plan as keyof typeof planConfig];
                      const PlanIcon = planInfo.icon;
                      return (
                        <TableRow key={school.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{school.name}</p>
                                <p className="text-xs text-muted-foreground">{school.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={planInfo.color}>
                              <PlanIcon className="w-3 h-3 mr-1" />
                              {planInfo.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {planPrices[plan as keyof typeof planPrices]}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {school.trial_ends_at
                              ? format(new Date(school.trial_ends_at), "MMM d, yyyy")
                              : "N/A"}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {school.subscription_expires_at
                              ? format(new Date(school.subscription_expires_at), "MMM d, yyyy")
                              : "Never"}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {Object.entries(planConfig).map(([key, config]) => (
                                  <DropdownMenuItem
                                    key={key}
                                    onClick={() => handlePlanChange(school.id, key as SubscriptionPlan)}
                                    disabled={school.subscription_plan === key}
                                  >
                                    <config.icon className="w-4 h-4 mr-2" />
                                    Set to {config.label}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionsManagement;
