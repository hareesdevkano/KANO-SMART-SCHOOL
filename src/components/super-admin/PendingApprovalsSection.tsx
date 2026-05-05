import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Building2, ArrowRight } from "lucide-react";
import SchoolApprovalCard from "./SchoolApprovalCard";
import { useSchools, useUpdateSchoolStatus } from "@/hooks/useSuperAdminData";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type SchoolStatus = Database["public"]["Enums"]["school_status"];

const PendingApprovalsSection = () => {
  const { data: schools, isLoading } = useSchools();
  const updateStatus = useUpdateSchoolStatus();
  const { toast } = useToast();

  const pendingSchools = schools?.filter((school) => school.status === "pending") || [];

  const handleApprove = (schoolId: string, notes?: string) => {
    updateStatus.mutate(
      { schoolId, status: "approved" as SchoolStatus },
      {
        onSuccess: () => {
          toast({
            title: "School Approved",
            description: "The school has been approved and can now access the platform.",
          });
          // TODO: Could send notification email here
          if (notes) {
            console.log("Approval notes:", notes);
          }
        },
        onError: (error) => {
          toast({
            title: "Approval Failed",
            description: error.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleReject = (schoolId: string, notes?: string) => {
    updateStatus.mutate(
      { schoolId, status: "suspended" as SchoolStatus },
      {
        onSuccess: () => {
          toast({
            title: "School Suspended",
            description: "The school has been suspended from the platform.",
            variant: "destructive",
          });
          if (notes) {
            console.log("Suspension reason:", notes);
          }
        },
        onError: (error) => {
          toast({
            title: "Suspension Failed",
            description: error.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Card variant="elevated">
        <CardContent className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (pendingSchools.length === 0) {
    return (
      <Card variant="elevated">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
            <Building2 className="w-8 h-8 text-success" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-1">All Caught Up!</h3>
          <p className="text-muted-foreground">
            No pending school registrations to review
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="elevated">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-warning" />
          </div>
          <div>
            <CardTitle className="text-lg">Pending Approvals</CardTitle>
            <p className="text-sm text-muted-foreground">
              Schools awaiting your review
            </p>
          </div>
        </div>
        <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
          {pendingSchools.length} pending
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Show first 3 pending schools */}
        {pendingSchools.slice(0, 3).map((school) => (
          <SchoolApprovalCard
            key={school.id}
            school={school}
            onApprove={handleApprove}
            onReject={handleReject}
            isLoading={updateStatus.isPending}
          />
        ))}

        {/* Show "View All" if more than 3 */}
        {pendingSchools.length > 3 && (
          <div className="pt-2">
            <Link to="/super-admin/schools?status=pending">
              <Button variant="outline" className="w-full">
                View All {pendingSchools.length} Pending Schools
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingApprovalsSection;
