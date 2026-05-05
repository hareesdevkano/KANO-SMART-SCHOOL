import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SuperAdminDashboard from "./pages/dashboards/SuperAdminDashboard";
import SchoolsManagement from "./pages/dashboards/super-admin/SchoolsManagement";
import SubscriptionsManagement from "./pages/dashboards/super-admin/SubscriptionsManagement";
import UsersManagement from "./pages/dashboards/super-admin/UsersManagement";
import AnalyticsDashboard from "./pages/dashboards/super-admin/AnalyticsDashboard";

import TokensManagement from "./pages/dashboards/super-admin/TokensManagement";
import StudentTokensManagement from "./pages/dashboards/super-admin/StudentTokensManagement";
import SchoolAdminDashboard from "./pages/dashboards/SchoolAdminDashboard";
import StudentsManagement from "./pages/dashboards/school-admin/StudentsManagement";
import TeachersManagement from "./pages/dashboards/school-admin/TeachersManagement";
import ClassesManagement from "./pages/dashboards/school-admin/ClassesManagement";
import FeesManagement from "./pages/dashboards/school-admin/FeesManagement";
import AnnouncementsManagement from "./pages/dashboards/school-admin/AnnouncementsManagement";
import SubjectsManagement from "./pages/dashboards/school-admin/SubjectsManagement";
import TimetableManagement from "./pages/dashboards/school-admin/TimetableManagement";
import SchoolSettings from "./pages/dashboards/school-admin/SchoolSettings";
import RegistrationLinks from "./pages/dashboards/school-admin/RegistrationLinks";
import AcademicSessionsManagement from "./pages/dashboards/school-admin/AcademicSessionsManagement";
import PromoteStudents from "./pages/dashboards/school-admin/PromoteStudents";
import TeacherDashboard from "./pages/dashboards/TeacherDashboard";
import TeacherStudents from "./pages/dashboards/teacher/TeacherStudents";
import TeacherAttendance from "./pages/dashboards/teacher/TeacherAttendance";
import TeacherResults from "./pages/dashboards/teacher/TeacherResults";
import TeacherClasses from "./pages/dashboards/teacher/TeacherClasses";
import TeacherLessonPlans from "./pages/dashboards/teacher/TeacherLessonPlans";
import TeacherSchemeOfWork from "./pages/dashboards/teacher/TeacherSchemeOfWork";
import QuranMemorization from "./pages/dashboards/teacher/QuranMemorization";
import StudentIDCards from "./pages/dashboards/teacher/StudentIDCards";
import StudentDashboard from "./pages/dashboards/StudentDashboard";
import StudentProfile from "./pages/dashboards/student/StudentProfile";
import StudentResults from "./pages/dashboards/student/StudentResults";
import StudentAttendance from "./pages/dashboards/student/StudentAttendance";
import StudentFees from "./pages/dashboards/student/StudentFees";
import ParentDashboard from "./pages/dashboards/ParentDashboard";
import ChildAcademics from "./pages/dashboards/parent/ChildAcademics";
import ChildAttendance from "./pages/dashboards/parent/ChildAttendance";
import ChildMemorization from "./pages/dashboards/parent/ChildMemorization";
import ChildFees from "./pages/dashboards/parent/ChildFees";
import DownloadPage from "./pages/Download";
import StudentRegistration from "./pages/StudentRegistration";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Super Admin Routes */}
            <Route path="/super-admin" element={<ProtectedRoute allowedRoles={["super_admin"]}><SuperAdminDashboard /></ProtectedRoute>} />
            <Route path="/super-admin/schools" element={<ProtectedRoute allowedRoles={["super_admin"]}><SchoolsManagement /></ProtectedRoute>} />
            <Route path="/super-admin/subscriptions" element={<ProtectedRoute allowedRoles={["super_admin"]}><SubscriptionsManagement /></ProtectedRoute>} />
            <Route path="/super-admin/users" element={<ProtectedRoute allowedRoles={["super_admin"]}><UsersManagement /></ProtectedRoute>} />
            <Route path="/super-admin/analytics" element={<ProtectedRoute allowedRoles={["super_admin"]}><AnalyticsDashboard /></ProtectedRoute>} />
            
            <Route path="/super-admin/tokens" element={<ProtectedRoute allowedRoles={["super_admin"]}><TokensManagement /></ProtectedRoute>} />
            <Route path="/super-admin/student-tokens" element={<ProtectedRoute allowedRoles={["super_admin"]}><StudentTokensManagement /></ProtectedRoute>} />
            
            {/* School Admin Routes */}
            <Route path="/school-admin" element={<ProtectedRoute allowedRoles={["school_admin"]}><SchoolAdminDashboard /></ProtectedRoute>} />
            <Route path="/school-admin/students" element={<ProtectedRoute allowedRoles={["school_admin"]}><StudentsManagement /></ProtectedRoute>} />
            <Route path="/school-admin/teachers" element={<ProtectedRoute allowedRoles={["school_admin"]}><TeachersManagement /></ProtectedRoute>} />
            <Route path="/school-admin/classes" element={<ProtectedRoute allowedRoles={["school_admin"]}><ClassesManagement /></ProtectedRoute>} />
            <Route path="/school-admin/subjects" element={<ProtectedRoute allowedRoles={["school_admin"]}><SubjectsManagement /></ProtectedRoute>} />
            <Route path="/school-admin/timetable" element={<ProtectedRoute allowedRoles={["school_admin"]}><TimetableManagement /></ProtectedRoute>} />
            <Route path="/school-admin/fees" element={<ProtectedRoute allowedRoles={["school_admin"]}><FeesManagement /></ProtectedRoute>} />
            <Route path="/school-admin/announcements" element={<ProtectedRoute allowedRoles={["school_admin"]}><AnnouncementsManagement /></ProtectedRoute>} />
            <Route path="/school-admin/settings" element={<ProtectedRoute allowedRoles={["school_admin"]}><SchoolSettings /></ProtectedRoute>} />
            <Route path="/school-admin/sessions" element={<ProtectedRoute allowedRoles={["school_admin"]}><AcademicSessionsManagement /></ProtectedRoute>} />
            <Route path="/school-admin/registration-links" element={<ProtectedRoute allowedRoles={["school_admin"]}><RegistrationLinks /></ProtectedRoute>} />
            <Route path="/school-admin/promote" element={<ProtectedRoute allowedRoles={["school_admin"]}><PromoteStudents /></ProtectedRoute>} />
            
            {/* Teacher Routes */}
            <Route path="/teacher" element={<ProtectedRoute allowedRoles={["teacher"]}><TeacherDashboard /></ProtectedRoute>} />
            <Route path="/teacher/students" element={<ProtectedRoute allowedRoles={["teacher"]}><TeacherStudents /></ProtectedRoute>} />
            <Route path="/teacher/attendance" element={<ProtectedRoute allowedRoles={["teacher"]}><TeacherAttendance /></ProtectedRoute>} />
            <Route path="/teacher/results" element={<ProtectedRoute allowedRoles={["teacher"]}><TeacherResults /></ProtectedRoute>} />
            <Route path="/teacher/classes" element={<ProtectedRoute allowedRoles={["teacher"]}><TeacherClasses /></ProtectedRoute>} />
            <Route path="/teacher/exams" element={<ProtectedRoute allowedRoles={["teacher"]}><TeacherResults /></ProtectedRoute>} />
            <Route path="/teacher/lesson-plans" element={<ProtectedRoute allowedRoles={["teacher"]}><TeacherLessonPlans /></ProtectedRoute>} />
            <Route path="/teacher/scheme-of-work" element={<ProtectedRoute allowedRoles={["teacher"]}><TeacherSchemeOfWork /></ProtectedRoute>} />
            <Route path="/teacher/quran-memorization" element={<ProtectedRoute allowedRoles={["teacher"]}><QuranMemorization /></ProtectedRoute>} />
            <Route path="/teacher/id-cards" element={<ProtectedRoute allowedRoles={["teacher"]}><StudentIDCards /></ProtectedRoute>} />
            
            {/* Student Routes */}
            <Route path="/student" element={<ProtectedRoute allowedRoles={["student"]}><StudentDashboard /></ProtectedRoute>} />
            <Route path="/student/profile" element={<ProtectedRoute allowedRoles={["student"]}><StudentProfile /></ProtectedRoute>} />
            <Route path="/student/results" element={<ProtectedRoute allowedRoles={["student"]}><StudentResults /></ProtectedRoute>} />
            <Route path="/student/attendance" element={<ProtectedRoute allowedRoles={["student"]}><StudentAttendance /></ProtectedRoute>} />
            <Route path="/student/fees" element={<ProtectedRoute allowedRoles={["student"]}><StudentFees /></ProtectedRoute>} />
            
            {/* Parent Routes */}
            <Route path="/parent" element={<ProtectedRoute allowedRoles={["parent"]}><ParentDashboard /></ProtectedRoute>} />
            <Route path="/parent/academics" element={<ProtectedRoute allowedRoles={["parent"]}><ChildAcademics /></ProtectedRoute>} />
            <Route path="/parent/attendance" element={<ProtectedRoute allowedRoles={["parent"]}><ChildAttendance /></ProtectedRoute>} />
            <Route path="/parent/memorization" element={<ProtectedRoute allowedRoles={["parent"]}><ChildMemorization /></ProtectedRoute>} />
            <Route path="/parent/fees" element={<ProtectedRoute allowedRoles={["parent"]}><ChildFees /></ProtectedRoute>} />
            
            <Route path="/download" element={<DownloadPage />} />
            <Route path="/student-registration" element={<StudentRegistration />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
