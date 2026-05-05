import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SchoolApprovalCard from "@/components/super-admin/SchoolApprovalCard";
import {
  Building2,
  Search,
  MoreHorizontal,
  CheckCircle,
  Clock,
  XCircle,
  Ban,
  Eye,
  Trash2,
  Mail,
  MapPin,
} from "lucide-react";
import { useSchools, useUpdateSchoolStatus, useDeleteSchool } from "@/hooks/useSuperAdminData";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import type { Database } from "@/integrations/supabase/types";

type SchoolStatus = Database["public"]["Enums"]["school_status"];

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

const statusConfig = {
  pending: { color: "bg-warning/10 text-warning border-warning/30", icon: Clock },
  approved: { color: "bg-success/10 text-success border-success/30", icon: CheckCircle },
  suspended: { color: "bg-destructive/10 text-destructive border-destructive/30", icon: Ban },
  expired: { color: "bg-muted text-muted-foreground border-muted", icon: XCircle },
};

const SchoolsManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get("status") || "all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>(searchParams.get("status") === "pending" ? "pending" : "all");
  const { toast } = useToast();

  const { data: schools, isLoading } = useSchools();
  const updateStatus = useUpdateSchoolStatus();
  const deleteSchool = useDeleteSchool();

  // Sync URL params with filter state
  useEffect(() => {
    const status = searchParams.get("status");
    if (status) {
      setStatusFilter(status);
      setActiveTab(status === "pending" ? "pending" : "all");
    }
  }, [searchParams]);

  const filteredSchools = schools?.filter((school) => {
    const matchesSearch =
      school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.city?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || school.status === statusFilter;
    const matchesType = typeFilter === "all" || school.school_type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const pendingSchools = schools?.filter((school) => school.status === "pending") || [];

  const handleStatusChange = (schoolId: string, status: SchoolStatus) => {
    updateStatus.mutate(
      { schoolId, status },
      {
        onSuccess: () => {
          toast({
            title: status === "approved" ? "School Approved" : `Status Changed`,
            description: status === "approved" 
              ? "The school can now access the platform."
              : `School status updated to ${status}.`,
          });
        },
      }
    );
  };

  const handleApprove = (schoolId: string, notes?: string) => {
    handleStatusChange(schoolId, "approved");
    if (notes) console.log("Approval notes:", notes);
  };

  const handleReject = (schoolId: string, notes?: string) => {
    handleStatusChange(schoolId, "suspended");
    if (notes) console.log("Suspension reason:", notes);
  };

  const handleDelete = () => {
    if (selectedSchool) {
      deleteSchool.mutate(selectedSchool, {
        onSuccess: () => {
          toast({
            title: "School Deleted",
            description: "The school has been permanently removed.",
            variant: "destructive",
          });
        },
      });
      setDeleteDialogOpen(false);
      setSelectedSchool(null);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "pending") {
      setStatusFilter("pending");
      setSearchParams({ status: "pending" });
    } else {
      setStatusFilter("all");
      setSearchParams({});
    }
  };

  return (
    <DashboardLayout role="super-admin">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Schools Management</h1>
            <p className="text-muted-foreground">Manage all registered schools on the platform</p>
          </div>
          <div className="flex items-center gap-2">
            {pendingSchools.length > 0 && (
              <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
                {pendingSchools.length} Pending
              </Badge>
            )}
            <Badge variant="outline">
              {schools?.length || 0} Total Schools
            </Badge>
          </div>
        </div>

        {/* Tabs for Quick Access */}
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="all" className="gap-2">
              <Building2 className="w-4 h-4" />
              All Schools
            </TabsTrigger>
            <TabsTrigger value="pending" className="gap-2">
              <Clock className="w-4 h-4" />
              Pending Approvals
              {pendingSchools.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                  {pendingSchools.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Pending Approvals Tab */}
          <TabsContent value="pending" className="mt-6">
            {pendingSchools.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-success" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-1">All Caught Up!</h3>
                  <p className="text-muted-foreground">
                    No pending school registrations to review
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingSchools.map((school) => (
                  <SchoolApprovalCard
                    key={school.id}
                    school={school}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    isLoading={updateStatus.isPending}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* All Schools Tab */}
          <TabsContent value="all" className="mt-6 space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search schools by name, email, or city..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {Object.entries(schoolTypeLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Schools Table */}
            <Card>
              <CardHeader>
                <CardTitle>Registered Schools</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : filteredSchools?.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Building2 className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium text-foreground">No schools found</h3>
                    <p className="text-muted-foreground">Try adjusting your filters or search query</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>School</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Plan</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Registered</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredSchools?.map((school) => {
                          const statusInfo = statusConfig[school.status as keyof typeof statusConfig] || statusConfig.pending;
                          const StatusIcon = statusInfo.icon;
                          return (
                            <TableRow key={school.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Building2 className="w-5 h-5 text-primary" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-foreground">{school.name}</p>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                      <Mail className="w-3 h-3" />
                                      {school.email}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary">
                                  {schoolTypeLabels[school.school_type] || school.school_type}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className={statusInfo.color}>
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {school.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="capitalize">
                                  {school.subscription_plan}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <MapPin className="w-3 h-3" />
                                  {school.city}, {school.state}
                                </div>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {school.created_at
                                  ? formatDistanceToNow(new Date(school.created_at), { addSuffix: true })
                                  : "N/A"}
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <Eye className="w-4 h-4 mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    {school.status !== "approved" && (
                                      <DropdownMenuItem
                                        onClick={() => handleStatusChange(school.id, "approved")}
                                        className="text-success"
                                      >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Approve
                                      </DropdownMenuItem>
                                    )}
                                    {school.status !== "suspended" && (
                                      <DropdownMenuItem
                                        onClick={() => handleStatusChange(school.id, "suspended")}
                                        className="text-warning"
                                      >
                                        <Ban className="w-4 h-4 mr-2" />
                                        Suspend
                                      </DropdownMenuItem>
                                    )}
                                    {school.status !== "pending" && (
                                      <DropdownMenuItem
                                        onClick={() => handleStatusChange(school.id, "pending")}
                                      >
                                        <Clock className="w-4 h-4 mr-2" />
                                        Set Pending
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setSelectedSchool(school.id);
                                        setDeleteDialogOpen(true);
                                      }}
                                      className="text-destructive"
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
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
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete School</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this school? This action cannot be undone and will remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default SchoolsManagement;
