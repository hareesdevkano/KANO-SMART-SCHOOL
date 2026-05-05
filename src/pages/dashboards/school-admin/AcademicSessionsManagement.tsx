import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  Calendar,
  Plus,
  Trash2,
  CheckCircle,
  Loader2,
  BookOpen,
} from "lucide-react";

const AcademicSessionsManagement = () => {
  const { schoolId } = useAuth();
  const queryClient = useQueryClient();

  const [sessionDialog, setSessionDialog] = useState(false);
  const [termDialog, setTermDialog] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  const [newSession, setNewSession] = useState({ name: "", start_date: "", end_date: "" });
  const [newTerm, setNewTerm] = useState({ name: "", start_date: "", end_date: "" });

  // Fetch sessions
  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ["academic-sessions", schoolId],
    queryFn: async () => {
      if (!schoolId) return [];
      const { data, error } = await supabase
        .from("academic_sessions")
        .select("*")
        .eq("school_id", schoolId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!schoolId,
  });

  // Fetch terms
  const { data: terms, isLoading: termsLoading } = useQuery({
    queryKey: ["academic-terms", schoolId],
    queryFn: async () => {
      if (!schoolId) return [];
      const { data, error } = await supabase
        .from("academic_terms")
        .select("*")
        .eq("school_id", schoolId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!schoolId,
  });

  // Add session
  const addSession = useMutation({
    mutationFn: async () => {
      if (!schoolId) throw new Error("No school");
      const { error } = await supabase.from("academic_sessions").insert({
        ...newSession,
        school_id: schoolId,
        start_date: newSession.start_date || null,
        end_date: newSession.end_date || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic-sessions"] });
      toast.success("Session created");
      setSessionDialog(false);
      setNewSession({ name: "", start_date: "", end_date: "" });
    },
    onError: (e: any) => toast.error(e.message),
  });

  // Add term
  const addTerm = useMutation({
    mutationFn: async () => {
      if (!schoolId || !selectedSessionId) throw new Error("Missing data");
      const { error } = await supabase.from("academic_terms").insert({
        ...newTerm,
        school_id: schoolId,
        session_id: selectedSessionId,
        start_date: newTerm.start_date || null,
        end_date: newTerm.end_date || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic-terms"] });
      toast.success("Term created");
      setTermDialog(false);
      setNewTerm({ name: "", start_date: "", end_date: "" });
    },
    onError: (e: any) => toast.error(e.message),
  });

  // Set current session
  const setCurrentSession = useMutation({
    mutationFn: async (sessionId: string) => {
      if (!schoolId) throw new Error("No school");
      // Unset all
      await supabase.from("academic_sessions").update({ is_current: false }).eq("school_id", schoolId);
      // Set selected
      const { error } = await supabase.from("academic_sessions").update({ is_current: true }).eq("id", sessionId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic-sessions"] });
      toast.success("Current session updated");
    },
    onError: (e: any) => toast.error(e.message),
  });

  // Set current term
  const setCurrentTerm = useMutation({
    mutationFn: async (termId: string) => {
      if (!schoolId) throw new Error("No school");
      await supabase.from("academic_terms").update({ is_current: false }).eq("school_id", schoolId);
      const { error } = await supabase.from("academic_terms").update({ is_current: true }).eq("id", termId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic-terms"] });
      toast.success("Current term updated");
    },
    onError: (e: any) => toast.error(e.message),
  });

  // Delete session
  const deleteSession = useMutation({
    mutationFn: async (sessionId: string) => {
      const { error } = await supabase.from("academic_sessions").delete().eq("id", sessionId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["academic-terms"] });
      toast.success("Session deleted");
    },
    onError: (e: any) => toast.error(e.message),
  });

  // Delete term
  const deleteTerm = useMutation({
    mutationFn: async (termId: string) => {
      const { error } = await supabase.from("academic_terms").delete().eq("id", termId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic-terms"] });
      toast.success("Term deleted");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const getTermsForSession = (sessionId: string) =>
    terms?.filter((t) => t.session_id === sessionId) || [];

  const isLoading = sessionsLoading || termsLoading;

  return (
    <DashboardLayout role="school-admin">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              Academic Sessions & Terms
            </h1>
            <p className="text-muted-foreground">
              Manage academic sessions, terms, and set the current active period
            </p>
          </div>
          <Dialog open={sessionDialog} onOpenChange={setSessionDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Session
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Academic Session</DialogTitle>
                <DialogDescription>Add a new academic session (e.g., 2025/2026)</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Session Name *</Label>
                  <Input
                    placeholder="e.g. 2025/2026"
                    value={newSession.name}
                    onChange={(e) => setNewSession({ ...newSession, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={newSession.start_date}
                      onChange={(e) => setNewSession({ ...newSession, start_date: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={newSession.end_date}
                      onChange={(e) => setNewSession({ ...newSession, end_date: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSessionDialog(false)}>Cancel</Button>
                <Button onClick={() => addSession.mutate()} disabled={!newSession.name || addSession.isPending}>
                  {addSession.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Create Session
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Add Term Dialog */}
        <Dialog open={termDialog} onOpenChange={setTermDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Term</DialogTitle>
              <DialogDescription>Add a new term to the selected session</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Term Name *</Label>
                <Input
                  placeholder="e.g. First Term, Second Term"
                  value={newTerm.name}
                  onChange={(e) => setNewTerm({ ...newTerm, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={newTerm.start_date}
                    onChange={(e) => setNewTerm({ ...newTerm, start_date: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={newTerm.end_date}
                    onChange={(e) => setNewTerm({ ...newTerm, end_date: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setTermDialog(false)}>Cancel</Button>
              <Button onClick={() => addTerm.mutate()} disabled={!newTerm.name || addTerm.isPending}>
                {addTerm.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Add Term
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : sessions && sessions.length > 0 ? (
          <Accordion type="multiple" className="space-y-4">
            {sessions.map((session) => {
              const sessionTerms = getTermsForSession(session.id);
              return (
                <AccordionItem
                  key={session.id}
                  value={session.id}
                  className="border rounded-xl bg-card px-4"
                >
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3 flex-1">
                      <BookOpen className="w-5 h-5 text-primary" />
                      <span className="font-semibold text-foreground">{session.name}</span>
                      {session.is_current && (
                        <Badge className="bg-success/10 text-success border-success/30">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Current
                        </Badge>
                      )}
                      <Badge variant="outline" className="ml-auto mr-4">
                        {sessionTerms.length} term{sessionTerms.length !== 1 ? "s" : ""}
                      </Badge>
                      {session.start_date && session.end_date && (
                        <span className="text-sm text-muted-foreground mr-4">
                          {session.start_date} — {session.end_date}
                        </span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        {!session.is_current && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentSession.mutate(session.id)}
                            disabled={setCurrentSession.isPending}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Set as Current
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedSessionId(session.id);
                            setTermDialog(true);
                          }}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Term
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => deleteSession.mutate(session.id)}
                          disabled={deleteSession.isPending}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete Session
                        </Button>
                      </div>

                      {sessionTerms.length > 0 ? (
                        <div className="grid gap-3">
                          {sessionTerms.map((term) => (
                            <div
                              key={term.id}
                              className="flex items-center justify-between p-4 rounded-xl bg-muted/50"
                            >
                              <div className="flex items-center gap-3">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <div>
                                  <p className="font-medium text-foreground">{term.name}</p>
                                  {term.start_date && term.end_date && (
                                    <p className="text-sm text-muted-foreground">
                                      {term.start_date} — {term.end_date}
                                    </p>
                                  )}
                                </div>
                                {term.is_current && (
                                  <Badge className="bg-success/10 text-success border-success/30">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Active
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {!term.is_current && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentTerm.mutate(term.id)}
                                    disabled={setCurrentTerm.isPending}
                                  >
                                    Set Active
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => deleteTerm.mutate(term.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground italic pl-2">
                          No terms yet. Add a term to get started.
                        </p>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground mb-4">No academic sessions yet</p>
              <Button onClick={() => setSessionDialog(true)}>
                Create First Session
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AcademicSessionsManagement;
