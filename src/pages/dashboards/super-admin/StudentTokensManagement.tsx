import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  UserPlus,
  Plus,
  Search,
  Copy,
  Download,
  Trash2,
  CheckCircle,
  Clock,
  Hash,
  Filter,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const generateRegTokenString = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const segments = [];
  for (let s = 0; s < 2; s++) {
    let seg = "";
    for (let i = 0; i < 4; i++) {
      seg += chars[Math.floor(Math.random() * chars.length)];
    }
    segments.push(seg);
  }
  return `SR-${segments.join("-")}`;
};

const StudentTokensManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [schoolFilter, setSchoolFilter] = useState<string>("all");
  const [generateCount, setGenerateCount] = useState(10);
  const [generateSchoolId, setGenerateSchoolId] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: schools } = useQuery({
    queryKey: ["all-schools-for-reg-tokens"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("schools")
        .select("id, name")
        .eq("status", "approved")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: tokens, isLoading } = useQuery({
    queryKey: ["all-reg-tokens", statusFilter, schoolFilter],
    queryFn: async () => {
      let query = supabase
        .from("student_registration_tokens")
        .select("*, schools!student_registration_tokens_school_id_fkey(name)")
        .order("created_at", { ascending: false });

      if (statusFilter === "used") query = query.eq("is_used", true);
      if (statusFilter === "unused") query = query.eq("is_used", false);
      if (schoolFilter !== "all") query = query.eq("school_id", schoolFilter);

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const generateMutation = useMutation({
    mutationFn: async ({ schoolId, count }: { schoolId: string; count: number }) => {
      const newTokens = Array.from({ length: count }, () => ({
        school_id: schoolId,
        token: generateRegTokenString(),
        is_used: false,
      }));
      const { error } = await supabase.from("student_registration_tokens").insert(newTokens);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-reg-tokens"] });
      setDialogOpen(false);
      toast({ title: "Tokens Generated", description: `${generateCount} registration tokens created` });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (tokenId: string) => {
      const { error } = await supabase.from("student_registration_tokens").delete().eq("id", tokenId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-reg-tokens"] });
      toast({ title: "Token Deleted" });
    },
  });

  const filteredTokens = tokens?.filter((t) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.token.toLowerCase().includes(q) ||
      t.used_by_name?.toLowerCase().includes(q) ||
      (t.schools as any)?.name?.toLowerCase().includes(q)
    );
  });

  const totalTokens = tokens?.length || 0;
  const usedTokens = tokens?.filter((t) => t.is_used).length || 0;
  const unusedTokens = totalTokens - usedTokens;

  const copyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    toast({ title: "Copied!", description: token });
  };

  const exportTokens = () => {
    const unused = filteredTokens?.filter((t) => !t.is_used) || [];
    const csv = ["Token,School,Created At", ...unused.map((t) =>
      `${t.token},${(t.schools as any)?.name || ""},${t.created_at ? format(new Date(t.created_at), "yyyy-MM-dd") : ""}`
    )].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `student-reg-tokens-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout role="super-admin">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Student Registration Tokens</h1>
            <p className="text-muted-foreground">Generate PINs for new student intake registration</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportTokens}>
              <Download className="w-4 h-4 mr-2" /> Export CSV
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="w-4 h-4 mr-2" /> Generate Tokens</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Generate Registration Tokens</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>School</Label>
                    <Select value={generateSchoolId} onValueChange={setGenerateSchoolId}>
                      <SelectTrigger><SelectValue placeholder="Select a school" /></SelectTrigger>
                      <SelectContent>
                        {schools?.map((s) => (
                          <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Number of Tokens</Label>
                    <div className="flex gap-2">
                      {[10, 25, 50, 100].map((n) => (
                        <Button
                          key={n} type="button"
                          variant={generateCount === n ? "default" : "outline"}
                          size="sm" onClick={() => setGenerateCount(n)}
                        >{n}</Button>
                      ))}
                    </div>
                    <Input
                      type="number" min={1} max={500}
                      value={generateCount}
                      onChange={(e) => setGenerateCount(Number(e.target.value))}
                    />
                  </div>
                  <Button
                    className="w-full"
                    disabled={!generateSchoolId || generateMutation.isPending}
                    onClick={() => generateMutation.mutate({ schoolId: generateSchoolId, count: generateCount })}
                  >
                    {generateMutation.isPending ? "Generating..." : `Generate ${generateCount} Tokens`}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Hash className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalTokens}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{unusedTokens}</p>
                  <p className="text-xs text-muted-foreground">Available</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{usedTokens}</p>
                  <p className="text-xs text-muted-foreground">Used</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search token, name, school..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <Filter className="w-4 h-4 mr-2" /><SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="unused">Available</SelectItem>
                  <SelectItem value="used">Used</SelectItem>
                </SelectContent>
              </Select>
              <Select value={schoolFilter} onValueChange={setSchoolFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="All Schools" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Schools</SelectItem>
                  {schools?.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tokens Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tokens ({filteredTokens?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
              </div>
            ) : filteredTokens?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <UserPlus className="w-12 h-12 text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No registration tokens found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Token</TableHead>
                      <TableHead>School</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Used By</TableHead>
                      <TableHead className="hidden md:table-cell">Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTokens?.slice(0, 100).map((token) => (
                      <TableRow key={token.id}>
                        <TableCell>
                          <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{token.token}</code>
                        </TableCell>
                        <TableCell className="text-sm">{(token.schools as any)?.name || "—"}</TableCell>
                        <TableCell>
                          {token.is_used ? (
                            <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                              <CheckCircle className="w-3 h-3 mr-1" /> Used
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
                              <Clock className="w-3 h-3 mr-1" /> Available
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                          {token.used_by_name || "—"}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                          {token.created_at ? format(new Date(token.created_at), "dd MMM yyyy") : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => copyToken(token.token)}>
                              <Copy className="w-4 h-4" />
                            </Button>
                            {!token.is_used && (
                              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => deleteMutation.mutate(token.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
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

export default StudentTokensManagement;
