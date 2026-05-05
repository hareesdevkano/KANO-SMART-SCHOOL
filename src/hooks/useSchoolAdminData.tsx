import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

// Fetch school details
export const useSchoolDetails = () => {
  const { schoolId } = useAuth();
  
  return useQuery({
    queryKey: ["school-details", schoolId],
    queryFn: async () => {
      if (!schoolId) return null;
      const { data, error } = await supabase
        .from("schools")
        .select("*")
        .eq("id", schoolId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!schoolId,
  });
};

// Fetch dashboard stats
export const useSchoolStats = () => {
  const { schoolId } = useAuth();
  
  return useQuery({
    queryKey: ["school-stats", schoolId],
    queryFn: async () => {
      if (!schoolId) return null;
      
      const [studentsRes, teachersRes, classesRes, paymentsRes] = await Promise.all([
        supabase.from("students").select("id", { count: "exact" }).eq("school_id", schoolId),
        supabase.from("teachers").select("id", { count: "exact" }).eq("school_id", schoolId),
        supabase.from("classes").select("id", { count: "exact" }).eq("school_id", schoolId),
        supabase.from("student_payments").select("amount").eq("school_id", schoolId).eq("status", "completed"),
      ]);
      
      const totalFees = paymentsRes.data?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
      
      return {
        totalStudents: studentsRes.count || 0,
        totalTeachers: teachersRes.count || 0,
        totalClasses: classesRes.count || 0,
        totalFeesCollected: totalFees,
      };
    },
    enabled: !!schoolId,
  });
};

// Fetch all students
export const useSchoolStudents = () => {
  const { schoolId } = useAuth();
  
  return useQuery({
    queryKey: ["school-students", schoolId],
    queryFn: async () => {
      if (!schoolId) return [];
      const { data, error } = await supabase
        .from("students")
        .select(`
          *,
          classes (id, name)
        `)
        .eq("school_id", schoolId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!schoolId,
  });
};

// Fetch all teachers with profile info
export const useSchoolTeachers = () => {
  const { schoolId } = useAuth();
  
  return useQuery({
    queryKey: ["school-teachers", schoolId],
    queryFn: async () => {
      if (!schoolId) return [];
      
      // First get teachers
      const { data: teachersData, error: teachersError } = await supabase
        .from("teachers")
        .select("*")
        .eq("school_id", schoolId)
        .order("created_at", { ascending: false });
      
      if (teachersError) throw teachersError;
      
      // Get profiles for teachers with user_id
      const userIds = teachersData?.filter(t => t.user_id).map(t => t.user_id) || [];
      
      if (userIds.length === 0) {
        return teachersData?.map(t => ({ ...t, profiles: null })) || [];
      }
      
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, full_name, email, phone")
        .in("id", userIds);
      
      // Merge teachers with profiles
      const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);
      
      return teachersData?.map(teacher => ({
        ...teacher,
        profiles: teacher.user_id ? profilesMap.get(teacher.user_id) || null : null
      })) || [];
    },
    enabled: !!schoolId,
  });
};

// Fetch all classes
export const useSchoolClasses = () => {
  const { schoolId } = useAuth();
  
  return useQuery({
    queryKey: ["school-classes", schoolId],
    queryFn: async () => {
      if (!schoolId) return [];
      const { data, error } = await supabase
        .from("classes")
        .select(`
          *,
          academic_levels (id, name)
        `)
        .eq("school_id", schoolId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!schoolId,
  });
};

// Fetch academic levels
export const useAcademicLevels = () => {
  const { schoolId } = useAuth();
  
  return useQuery({
    queryKey: ["academic-levels", schoolId],
    queryFn: async () => {
      if (!schoolId) return [];
      const { data, error } = await supabase
        .from("academic_levels")
        .select("*")
        .eq("school_id", schoolId)
        .order("order_index", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!schoolId,
  });
};

// Add academic level mutation
export const useAddAcademicLevel = () => {
  const queryClient = useQueryClient();
  const { schoolId } = useAuth();
  
  return useMutation({
    mutationFn: async (levelData: {
      name: string;
      description?: string;
      order_index?: number;
    }) => {
      if (!schoolId) throw new Error("No school ID");
      const { data, error } = await supabase
        .from("academic_levels")
        .insert({ ...levelData, school_id: schoolId })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic-levels"] });
      toast.success("Academic level added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add level: " + error.message);
    },
  });
};

// Delete academic level mutation
export const useDeleteAcademicLevel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (levelId: string) => {
      const { error } = await supabase
        .from("academic_levels")
        .delete()
        .eq("id", levelId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic-levels"] });
      toast.success("Academic level deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete level: " + error.message);
    },
  });
};

// Fetch subjects
export const useSchoolSubjects = () => {
  const { schoolId } = useAuth();
  
  return useQuery({
    queryKey: ["school-subjects", schoolId],
    queryFn: async () => {
      if (!schoolId) return [];
      const { data, error } = await supabase
        .from("subjects")
        .select("*")
        .eq("school_id", schoolId)
        .order("name", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!schoolId,
  });
};

// Fetch fee categories
export const useFeeCategories = () => {
  const { schoolId } = useAuth();
  
  return useQuery({
    queryKey: ["fee-categories", schoolId],
    queryFn: async () => {
      if (!schoolId) return [];
      const { data, error } = await supabase
        .from("fee_categories")
        .select("*")
        .eq("school_id", schoolId)
        .order("name", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!schoolId,
  });
};

// Fetch payments
export const useSchoolPayments = () => {
  const { schoolId } = useAuth();
  
  return useQuery({
    queryKey: ["school-payments", schoolId],
    queryFn: async () => {
      if (!schoolId) return [];
      const { data, error } = await supabase
        .from("student_payments")
        .select(`
          *,
          students (id, registration_number, guardian_name),
          fee_categories (id, name)
        `)
        .eq("school_id", schoolId)
        .order("payment_date", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!schoolId,
  });
};

// Fetch announcements
export const useSchoolAnnouncements = () => {
  const { schoolId } = useAuth();
  
  return useQuery({
    queryKey: ["school-announcements", schoolId],
    queryFn: async () => {
      if (!schoolId) return [];
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .eq("school_id", schoolId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!schoolId,
  });
};

// Fetch recent attendance
export const useRecentAttendance = () => {
  const { schoolId } = useAuth();
  
  return useQuery({
    queryKey: ["recent-attendance", schoolId],
    queryFn: async () => {
      if (!schoolId) return [];
      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("attendance")
        .select(`
          *,
          students (id, profiles:user_id (full_name)),
          classes (id, name)
        `)
        .eq("school_id", schoolId)
        .gte("date", today)
        .order("date", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!schoolId,
  });
};

// Mutations
export const useAddStudent = () => {
  const queryClient = useQueryClient();
  const { schoolId } = useAuth();
  
  return useMutation({
    mutationFn: async (studentData: {
      registration_number?: string;
      class_id?: string;
      guardian_name?: string;
      guardian_phone?: string;
      guardian_email?: string;
      gender?: string;
      date_of_birth?: string;
      address?: string;
    }) => {
      const { data, error } = await supabase
        .from("students")
        .insert({ ...studentData, school_id: schoolId })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-students"] });
      queryClient.invalidateQueries({ queryKey: ["school-stats"] });
      toast.success("Student added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add student: " + error.message);
    },
  });
};

export const useAddTeacher = () => {
  const queryClient = useQueryClient();
  const { schoolId } = useAuth();
  
  return useMutation({
    mutationFn: async (teacherData: {
      employee_id?: string;
      qualification?: string;
      specialization?: string;
    }) => {
      const { data, error } = await supabase
        .from("teachers")
        .insert({ ...teacherData, school_id: schoolId })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-teachers"] });
      queryClient.invalidateQueries({ queryKey: ["school-stats"] });
      toast.success("Teacher added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add teacher: " + error.message);
    },
  });
};

export const useAddClass = () => {
  const queryClient = useQueryClient();
  const { schoolId } = useAuth();
  
  return useMutation({
    mutationFn: async (classData: {
      name: string;
      level_id: string;
      capacity?: number;
    }) => {
      const { data, error } = await supabase
        .from("classes")
        .insert({ ...classData, school_id: schoolId })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-classes"] });
      queryClient.invalidateQueries({ queryKey: ["school-stats"] });
      toast.success("Class added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add class: " + error.message);
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (studentId: string) => {
      const { error } = await supabase
        .from("students")
        .delete()
        .eq("id", studentId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-students"] });
      queryClient.invalidateQueries({ queryKey: ["school-stats"] });
      toast.success("Student deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete student: " + error.message);
    },
  });
};

export const useDeleteTeacher = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (teacherId: string) => {
      const { error } = await supabase
        .from("teachers")
        .delete()
        .eq("id", teacherId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-teachers"] });
      queryClient.invalidateQueries({ queryKey: ["school-stats"] });
      toast.success("Teacher deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete teacher: " + error.message);
    },
  });
};

export const useDeleteClass = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (classId: string) => {
      const { error } = await supabase
        .from("classes")
        .delete()
        .eq("id", classId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-classes"] });
      queryClient.invalidateQueries({ queryKey: ["school-stats"] });
      toast.success("Class deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete class: " + error.message);
    },
  });
};

export const useAddAnnouncement = () => {
  const queryClient = useQueryClient();
  const { schoolId, user } = useAuth();
  
  return useMutation({
    mutationFn: async (announcementData: {
      title: string;
      content?: string;
      target_roles?: string[];
      is_published?: boolean;
    }) => {
      const { data, error } = await supabase
        .from("announcements")
        .insert({ 
          ...announcementData, 
          school_id: schoolId,
          created_by: user?.id 
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-announcements"] });
      toast.success("Announcement created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create announcement: " + error.message);
    },
  });
};

// Add subject mutation
export const useAddSubject = () => {
  const queryClient = useQueryClient();
  const { schoolId } = useAuth();
  
  return useMutation({
    mutationFn: async (subjectData: {
      name: string;
      code?: string;
      category?: string;
      is_islamic?: boolean;
      is_vocational?: boolean;
    }) => {
      const { data, error } = await supabase
        .from("subjects")
        .insert({ ...subjectData, school_id: schoolId })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-subjects"] });
      toast.success("Subject added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add subject: " + error.message);
    },
  });
};

// Delete subject mutation
export const useDeleteSubject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (subjectId: string) => {
      const { error } = await supabase
        .from("subjects")
        .delete()
        .eq("id", subjectId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-subjects"] });
      toast.success("Subject deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete subject: " + error.message);
    },
  });
};

// Fetch timetable entries
export const useTimetable = () => {
  const { schoolId } = useAuth();
  
  return useQuery({
    queryKey: ["school-timetable", schoolId],
    queryFn: async () => {
      if (!schoolId) return [];
      
      // Get timetable entries
      const { data: timetableData, error } = await supabase
        .from("timetable")
        .select(`
          *,
          classes (id, name),
          subjects (id, name)
        `)
        .eq("school_id", schoolId)
        .order("day_of_week", { ascending: true });
      
      if (error) throw error;
      
      // Get teacher info
      const teacherIds = timetableData?.filter(t => t.teacher_id).map(t => t.teacher_id) || [];
      
      if (teacherIds.length === 0) {
        return timetableData?.map(t => ({ ...t, teachers: null })) || [];
      }
      
      const { data: teachers } = await supabase
        .from("teachers")
        .select("id, user_id")
        .in("id", teacherIds);
      
      const userIds = teachers?.filter(t => t.user_id).map(t => t.user_id) || [];
      
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", userIds);
      
      const profilesMap = new Map(profiles?.map(p => [p.id, p]) || []);
      const teachersWithProfiles = new Map(
        teachers?.map(t => [t.id, { ...t, profiles: t.user_id ? profilesMap.get(t.user_id) : null }]) || []
      );
      
      return timetableData?.map(entry => ({
        ...entry,
        teachers: entry.teacher_id ? teachersWithProfiles.get(entry.teacher_id) || null : null
      })) || [];
    },
    enabled: !!schoolId,
  });
};

// Add timetable entry mutation
export const useAddTimetableEntry = () => {
  const queryClient = useQueryClient();
  const { schoolId } = useAuth();
  
  return useMutation({
    mutationFn: async (entryData: {
      class_id: string;
      subject_id?: string;
      teacher_id?: string;
      day_of_week: number;
      start_time: string;
      end_time: string;
      period_number?: number;
      room_name?: string;
    }) => {
      const { data, error } = await supabase
        .from("timetable")
        .insert({ ...entryData, school_id: schoolId })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-timetable"] });
      toast.success("Timetable entry added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add entry: " + error.message);
    },
  });
};

// Delete timetable entry mutation
export const useDeleteTimetableEntry = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (entryId: string) => {
      const { error } = await supabase
        .from("timetable")
        .delete()
        .eq("id", entryId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-timetable"] });
      toast.success("Entry deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete entry: " + error.message);
    },
  });
};
