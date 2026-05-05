import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  Eye,
  Clock,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import type { Database } from "@/integrations/supabase/types";

type School = Database["public"]["Tables"]["schools"]["Row"];

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

interface SchoolApprovalCardProps {
  school: School;
  onApprove: (schoolId: string, notes?: string) => void;
  onReject: (schoolId: string, notes?: string) => void;
  isLoading?: boolean;
}

const SchoolApprovalCard = ({
  school,
  onApprove,
  onReject,
  isLoading,
}: SchoolApprovalCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [notes, setNotes] = useState("");

  const handleApprove = () => {
    onApprove(school.id, notes);
    setShowApproveDialog(false);
    setNotes("");
  };

  const handleReject = () => {
    onReject(school.id, notes);
    setShowRejectDialog(false);
    setNotes("");
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row">
            {/* School Info */}
            <div className="flex-1 p-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-foreground truncate">
                      {school.name}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {schoolTypeLabels[school.school_type] || school.school_type}
                    </Badge>
                  </div>
                  
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-3.5 h-3.5" />
                      <span className="truncate">{school.email}</span>
                    </div>
                    {school.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{school.phone}</span>
                      </div>
                    )}
                    {(school.city || school.state) && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>
                          {[school.city, school.state].filter(Boolean).join(", ")}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    Registered{" "}
                    {school.created_at
                      ? formatDistanceToNow(new Date(school.created_at), {
                          addSuffix: true,
                        })
                      : "N/A"}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex sm:flex-col items-center justify-end gap-2 p-4 bg-muted/30 sm:w-40">
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => setShowDetails(true)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Details
              </Button>
              <Button
                size="sm"
                className="w-full bg-success hover:bg-success/90"
                onClick={() => setShowApproveDialog(true)}
                disabled={isLoading}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="w-full"
                onClick={() => setShowRejectDialog(true)}
                disabled={isLoading}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Suspend
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              {school.name}
            </DialogTitle>
            <DialogDescription>
              Review school details before making a decision
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Institution Type</Label>
                <p className="font-medium">
                  {schoolTypeLabels[school.school_type] || school.school_type}
                </p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Status</Label>
                <Badge variant="outline" className="bg-warning/10 text-warning">
                  <Clock className="w-3 h-3 mr-1" />
                  Pending Review
                </Badge>
              </div>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Email</Label>
              <p className="font-medium">{school.email}</p>
            </div>

            {school.phone && (
              <div>
                <Label className="text-xs text-muted-foreground">Phone</Label>
                <p className="font-medium">{school.phone}</p>
              </div>
            )}

            <div>
              <Label className="text-xs text-muted-foreground">Address</Label>
              <p className="font-medium">
                {[school.address, school.city, school.state, school.country]
                  .filter(Boolean)
                  .join(", ") || "Not provided"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Registration Date</Label>
                <p className="font-medium">
                  {school.created_at
                    ? format(new Date(school.created_at), "PPP")
                    : "N/A"}
                </p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Trial Ends</Label>
                <p className="font-medium">
                  {school.trial_ends_at
                    ? format(new Date(school.trial_ends_at), "PPP")
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowDetails(false)}>
              Close
            </Button>
            <Button
              className="bg-success hover:bg-success/90"
              onClick={() => {
                setShowDetails(false);
                setShowApproveDialog(true);
              }}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowDetails(false);
                setShowRejectDialog(true);
              }}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Suspend
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Confirmation Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-success">
              <CheckCircle className="w-5 h-5" />
              Approve School
            </DialogTitle>
            <DialogDescription>
              Approving "{school.name}" will give them full access to the platform.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="approve-notes">Notes (Optional)</Label>
              <Textarea
                id="approve-notes"
                placeholder="Add any notes about this approval..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-success hover:bg-success/90"
              onClick={handleApprove}
              disabled={isLoading}
            >
              {isLoading ? "Approving..." : "Confirm Approval"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject/Suspend Confirmation Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="w-5 h-5" />
              Suspend School
            </DialogTitle>
            <DialogDescription>
              Suspending "{school.name}" will prevent them from accessing the platform.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="reject-notes">Reason for Suspension</Label>
              <Textarea
                id="reject-notes"
                placeholder="Please provide a reason for suspension..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isLoading}
            >
              {isLoading ? "Suspending..." : "Confirm Suspension"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SchoolApprovalCard;
