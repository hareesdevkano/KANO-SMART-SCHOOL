import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  GraduationCap,
  Menu,
  X,
  Home,
  Users,
  BookOpen,
  ClipboardCheck,
  FileText,
  CreditCard,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  User,
  Building2,
  TrendingUp,
  Calendar,
  PenLine,
  Key,
  CreditCard as IdCard,
  Search,
  Link2,
  UserPlus,
  ArrowUpRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NotificationsPopover from "@/components/dashboard/NotificationsPopover";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "super-admin" | "school-admin" | "teacher" | "student" | "parent";
}

const DashboardLayout = ({ children, role }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center animate-pulse">
            <GraduationCap className="w-6 h-6 text-primary" />
          </div>
          <div className="h-1 w-24 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-[slideInLeft_1s_ease-in-out_infinite]" style={{ width: "40%" }} />
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const roleLabels = {
    "super-admin": "Super Admin",
    "school-admin": "School Admin",
    teacher: "Teacher",
    student: "Student",
    parent: "Parent",
  };

  const roleColors = {
    "super-admin": "from-primary to-primary-light",
    "school-admin": "from-info to-primary",
    teacher: "from-success to-primary",
    student: "from-primary to-info",
    parent: "from-warning to-secondary",
  };

  const navigationItems = {
    "super-admin": [
      { icon: Home, label: "Dashboard", href: "/super-admin" },
      { icon: Building2, label: "Schools", href: "/super-admin/schools" },
      { icon: Users, label: "Users", href: "/super-admin/users" },
      { icon: CreditCard, label: "Subscriptions", href: "/super-admin/subscriptions" },
      
      { icon: Key, label: "Result Tokens", href: "/super-admin/tokens" },
      { icon: UserPlus, label: "Student Tokens", href: "/super-admin/student-tokens" },
      { icon: TrendingUp, label: "Analytics", href: "/super-admin/analytics" },
      { icon: Settings, label: "Settings", href: "/super-admin/settings" },
    ],
    "school-admin": [
      { icon: Home, label: "Dashboard", href: "/school-admin" },
      { icon: Users, label: "Students", href: "/school-admin/students" },
      { icon: Users, label: "Teachers", href: "/school-admin/teachers" },
      { icon: BookOpen, label: "Classes", href: "/school-admin/classes" },
      { icon: ArrowUpRight, label: "Promote Students", href: "/school-admin/promote" },
      { icon: BookOpen, label: "Subjects", href: "/school-admin/subjects" },
      { icon: Calendar, label: "Sessions & Terms", href: "/school-admin/sessions" },
      { icon: Calendar, label: "Timetable", href: "/school-admin/timetable" },
      { icon: CreditCard, label: "Fees", href: "/school-admin/fees" },
      { icon: Bell, label: "Announcements", href: "/school-admin/announcements" },
      { icon: Link2, label: "Registration Links", href: "/school-admin/registration-links" },
      { icon: Settings, label: "Settings", href: "/school-admin/settings" },
    ],
    teacher: [
      { icon: Home, label: "Dashboard", href: "/teacher" },
      { icon: BookOpen, label: "My Classes", href: "/teacher/classes" },
      { icon: Users, label: "Students", href: "/teacher/students" },
      { icon: ClipboardCheck, label: "Attendance", href: "/teacher/attendance" },
      { icon: PenLine, label: "Results", href: "/teacher/results" },
      { icon: FileText, label: "Lesson Plans", href: "/teacher/lesson-plans" },
      { icon: Calendar, label: "Scheme of Work", href: "/teacher/scheme-of-work" },
      { icon: BookOpen, label: "Quran Hifz", href: "/teacher/quran-memorization" },
      { icon: IdCard, label: "ID Cards", href: "/teacher/id-cards" },
    ],
    student: [
      { icon: Home, label: "Dashboard", href: "/student" },
      { icon: User, label: "My Profile", href: "/student/profile" },
      { icon: ClipboardCheck, label: "Attendance", href: "/student/attendance" },
      { icon: FileText, label: "Results", href: "/student/results" },
      { icon: CreditCard, label: "Fees", href: "/student/fees" },
    ],
    parent: [
      { icon: Home, label: "Dashboard", href: "/parent" },
      { icon: FileText, label: "Academics", href: "/parent/academics" },
      { icon: ClipboardCheck, label: "Attendance", href: "/parent/attendance" },
      { icon: BookOpen, label: "Qur'an Hifz", href: "/parent/memorization" },
      { icon: CreditCard, label: "Fees", href: "/parent/fees" },
      { icon: Bell, label: "Announcements", href: "/parent" },
    ],
  };

  const navItems = navigationItems[role];
  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

  return (
    <div className="dashboard-shell min-h-screen">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-sidebar/95 backdrop-blur-2xl transform transition-transform duration-300 lg:translate-x-0 border-r border-sidebar-border ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          backgroundImage:
            "linear-gradient(180deg, hsl(220 40% 5% / 0.98), hsl(220 45% 4% / 0.98))",
        }}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-[76px] px-6 border-b border-sidebar-border">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(43_74%_55%)] to-[hsl(43_80%_65%)] flex items-center justify-center shadow-[0_8px_24px_-8px_hsl(43_74%_55%/0.6)]">
                <GraduationCap className="w-5 h-5 text-[hsl(220_40%_8%)]" />
              </div>
              <div>
                <span className="font-display text-lg font-semibold text-sidebar-foreground tracking-tight">SmartSchool</span>
                <p className="text-[10px] font-medium text-[hsl(43_74%_55%)]/80 uppercase tracking-[0.18em]">{roleLabels[role]}</p>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-xl hover:bg-sidebar-accent/50 transition-colors"
            >
              <X className="w-5 h-5 text-sidebar-foreground" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-0.5 overflow-y-auto">
            <p className="text-[10px] font-semibold text-sidebar-foreground/40 uppercase tracking-[0.2em] px-3 mb-3">
              Workspace
            </p>
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-[hsl(43_74%_55%/0.12)] to-transparent text-[hsl(43_74%_65%)] font-semibold"
                      : "text-sidebar-foreground/55 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground"
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-[hsl(43_74%_55%)] shadow-[0_0_12px_hsl(43_74%_55%/0.6)]" />
                  )}
                  <item.icon className={`w-[18px] h-[18px] ${isActive ? "text-[hsl(43_74%_60%)]" : ""}`} />
                  <span className="text-sm tracking-tight">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-sidebar-accent/40 border border-[hsl(43_40%_60%/0.08)]">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(43_74%_55%)] to-[hsl(43_80%_65%)] flex items-center justify-center text-[hsl(220_40%_8%)] font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-sidebar-foreground truncate">
                  {userName}
                </p>
                <p className="text-[11px] text-[hsl(43_74%_55%)]/80 font-medium uppercase tracking-wider">{roleLabels[role]}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-destructive/15 text-sidebar-foreground/50 hover:text-destructive transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
            <p className="mt-3 text-center text-[10px] text-sidebar-foreground/30 tracking-wider">
              Powered by Dual Intelligence ICT
            </p>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-[76px] bg-background/60 backdrop-blur-2xl border-b border-[hsl(43_40%_60%/0.12)]">
          <div className="flex items-center justify-between h-full px-4 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2.5 rounded-xl hover:bg-muted transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="font-display text-xl lg:text-2xl font-semibold text-foreground tracking-tight">
                  {roleLabels[role]} <span className="text-gold-gradient">Dashboard</span>
                </h1>
                <p className="text-xs text-muted-foreground font-medium tracking-wide">
                  {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <NotificationsPopover />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 rounded-xl h-10 px-3 hover:bg-muted">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[hsl(43_74%_55%)] to-[hsl(43_80%_65%)] flex items-center justify-center text-[hsl(220_40%_8%)] font-bold text-xs">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:inline text-sm font-medium text-foreground">{userName.split(" ")[0]}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 rounded-xl p-1.5">
                  <DropdownMenuItem className="rounded-lg">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-lg">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive rounded-lg" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[hsl(43_74%_55%/0.3)] to-transparent" />
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8 max-w-[1600px] mx-auto">{children}</main>

        {/* Footer */}
        <footer className="px-4 lg:px-8 pb-6 max-w-[1600px] mx-auto">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[hsl(43_74%_55%/0.2)] to-transparent mb-4" />
          <p className="text-center text-[11px] text-muted-foreground/70 tracking-wider">
            Powered by <span className="text-[hsl(43_74%_60%)] font-medium">Dual Intelligence ICT Services Kano</span>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
