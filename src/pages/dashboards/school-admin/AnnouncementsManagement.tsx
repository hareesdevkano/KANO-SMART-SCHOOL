import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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
  useSchoolAnnouncements,
  useAddAnnouncement,
} from "@/hooks/useSchoolAdminData";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Bell, Plus, Megaphone, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

const targetRoleOptions = [
  { value: "teacher", label: "Teachers" },
  { value: "student", label: "Students" },
  { value: "parent", label: "Parents" },
];

const AnnouncementsManagement = () => {
  const { data: announcements, isLoading } = useSchoolAnnouncements();
  const addAnnouncement = useAddAnnouncement();
  const { schoolId } = useAuth();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [broadcasting, setBroadcasting] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    is_published: true,
    target_roles: [] as string[],
  });

  const toggleRole = (role: string) => {
    setNewAnnouncement((prev) => ({
      ...prev,
      target_roles: prev.target_roles.includes(role)
        ? prev.target_roles.filter((r) => r !== role)
        : [...prev.target_roles, role],
    }));
  };

  const broadcastNotifications = async (announcementTitle: string, content: string, roles: string[]) => {
    if (!schoolId || roles.length === 0) return;
    setBroadcasting(true);
    try {
      // Get users with matching roles in this school
      const { data: userRoles } = await supabase
        .from("user_roles")
        .select("user_id, role")
        .eq("school_id", schoolId)
        .in("role", roles as ("teacher" | "student" | "parent" | "school_admin" | "super_admin")[]);

      if (userRoles && userRoles.length > 0) {
        const notifications = userRoles.map((ur) => ({
          user_id: ur.user_id,
          school_id: schoolId,
          title: `📢 ${announcementTitle}`,
          message: content || "New announcement from your school.",
          type: "announcement",
          link: `/${ur.role === "school_admin" ? "school-admin" : ur.role}/`,
        }));

        const { error } = await supabase.from("notifications").insert(notifications);
        if (error) throw error;
        toast.success(`Notification sent to ${userRoles.length} users`);
      }
    } catch (err: any) {
      toast.error("Failed to send notifications: " + err.message);
    } finally {
      setBroadcasting(false);
    }
  };

  const handleAddAnnouncement = async () => {
    if (!newAnnouncement.title) {
      toast.error("Title is required");
      return;
    }
    await addAnnouncement.mutateAsync({
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      is_published: newAnnouncement.is_published,
      target_roles: newAnnouncement.target_roles.length > 0 ? newAnnouncement.target_roles : undefined,
    });

    // Broadcast notifications to selected roles
    if (newAnnouncement.target_roles.length > 0 && newAnnouncement.is_published) {
      await broadcastNotifications(
        newAnnouncement.title,
        newAnnouncement.content,
        newAnnouncement.target_roles
      );
    }

    setIsDialogOpen(false);
    setNewAnnouncement({ title: "", content: "", is_published: true, target_roles: [] });
  };

  return (
    <DashboardLayout role="school-admin">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Announcements</h1>
            <p className="text-muted-foreground">
              Create and broadcast announcements to your school community
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Announcement</DialogTitle>
                <DialogDescription>
                  Create and optionally broadcast to specific roles.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={newAnnouncement.title}
                    onChange={(e) =>
                      setNewAnnouncement({ ...newAnnouncement, title: e.target.value })
                    }
                    placeholder="Announcement title"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={newAnnouncement.content}
                    onChange={(e) =>
                      setNewAnnouncement({ ...newAnnouncement, content: e.target.value })
                    }
                    placeholder="Write your announcement here..."
                    rows={5}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Broadcast to (optional)</Label>
                  <div className="flex flex-wrap gap-4">
                    {targetRoleOptions.map((opt) => (
                      <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={newAnnouncement.target_roles.includes(opt.value)}
                          onCheckedChange={() => toggleRole(opt.value)}
                        />
                        <span className="text-sm">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Selected roles will receive a real-time notification
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAddAnnouncement}
                  disabled={addAnnouncement.isPending || broadcasting}
                >
                  {(addAnnouncement.isPending || broadcasting) ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : newAnnouncement.target_roles.length > 0 ? (
                    <Send className="w-4 h-4 mr-2" />
                  ) : null}
                  {newAnnouncement.target_roles.length > 0 ? "Publish & Broadcast" : "Publish"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {isLoading ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                Loading announcements...
              </CardContent>
            </Card>
          ) : announcements && announcements.length > 0 ? (
            announcements.map((announcement) => (
              <Card key={announcement.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Megaphone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{announcement.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {new Date(announcement.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {announcement.target_roles && (announcement.target_roles as string[]).length > 0 && (
                        <div className="flex gap-1">
                          {(announcement.target_roles as string[]).map((r) => (
                            <Badge key={r} variant="outline" className="text-xs capitalize">{r}s</Badge>
                          ))}
                        </div>
                      )}
                      <Badge
                        className={
                          announcement.is_published
                            ? "bg-success/10 text-success"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {announcement.is_published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {announcement.content || "No content"}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground mb-4">No announcements yet</p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  Create First Announcement
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnnouncementsManagement;
