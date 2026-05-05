import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParentChildren, useChildPayments } from "@/hooks/useParentData";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreditCard, Wallet, CheckCircle, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const ChildFees = () => {
  const { data: children, isLoading: childrenLoading } = useParentChildren();
  const [selectedChild, setSelectedChild] = useState<string | null>(null);

  const activeChild = selectedChild || children?.[0]?.id || null;
  const child = children?.find((c) => c.id === activeChild);

  const { data: payments, isLoading: paymentsLoading } = useChildPayments(activeChild);

  // Fetch fee categories for the child's school
  const { data: feeCategories } = useQuery({
    queryKey: ["parent-fee-categories", child?.school_id],
    queryFn: async () => {
      if (!child?.school_id) return [];
      const { data, error } = await supabase
        .from("fee_categories")
        .select("*")
        .eq("school_id", child.school_id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!child?.school_id,
  });

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);

  const totalFees = feeCategories?.reduce((sum, c) => sum + Number(c.amount), 0) || 0;
  const totalPaid = payments?.filter((p) => p.status === "completed").reduce((sum, p) => sum + Number(p.amount), 0) || 0;
  const outstanding = Math.max(0, totalFees - totalPaid);

  if (childrenLoading) {
    return (
      <DashboardLayout role="parent">
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-32 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="parent">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Fee Payments</h1>
            <p className="text-muted-foreground">View fee status and payment history</p>
          </div>
          {children && children.length > 1 && (
            <Select value={activeChild || ""} onValueChange={setSelectedChild}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select child" />
              </SelectTrigger>
              <SelectContent>
                {children.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.profiles?.full_name || c.guardian_name || c.registration_number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Fee Summary Cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Fees</p>
                  <p className="text-xl font-bold text-foreground">{formatCurrency(totalFees)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Paid</p>
                  <p className="text-xl font-bold text-foreground">{formatCurrency(totalPaid)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Outstanding</p>
                  <p className="text-xl font-bold text-foreground">{formatCurrency(outstanding)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fee Categories Breakdown */}
        {feeCategories && feeCategories.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Fee Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {feeCategories.map((cat) => {
                  const paidForCat = payments
                    ?.filter((p) => p.fee_category_id === cat.id && p.status === "completed")
                    .reduce((sum, p) => sum + Number(p.amount), 0) || 0;
                  const isPaid = paidForCat >= Number(cat.amount);
                  return (
                    <div key={cat.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                      <div>
                        <p className="font-medium text-foreground">{cat.name}</p>
                        <p className="text-sm text-muted-foreground">{cat.description || "School fee"}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground">{formatCurrency(Number(cat.amount))}</p>
                        <Badge className={isPaid ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}>
                          {isPaid ? "Paid" : `${formatCurrency(paidForCat)} paid`}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            {paymentsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : payments && payments.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          {payment.payment_date ? new Date(payment.payment_date).toLocaleDateString("en-NG") : "-"}
                        </TableCell>
                        <TableCell>{payment.fee_categories?.name || "Other"}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(Number(payment.amount))}</TableCell>
                        <TableCell className="capitalize">{payment.payment_method || "Cash"}</TableCell>
                        <TableCell>{payment.reference || "-"}</TableCell>
                        <TableCell>
                          <Badge className={payment.status === "completed" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}>
                            {payment.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-center py-8 text-muted-foreground">No payment records found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ChildFees;
