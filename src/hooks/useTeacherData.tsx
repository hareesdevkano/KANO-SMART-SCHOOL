import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

// Fetch teacher profile
export const useTeacherProfile = () => {
  const { user, schoolId } = useAuth();
  
  return useQuery({
    queryKey: ["teacher-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("teachers")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
};

// Fetch classes assigned to teacher
export const useTeacherClasses = () => {
  const { schoolId, user } = useAuth();
  
  return useQuery({
    queryKey: ["teacher-classes", schoolId, user?.id],
    queryFn: async () => {
      if (!schoolId || !user?.id) return [];
      
      // First get the teacher record for this user
      const { data: teacher } = await supabase
        .from("teachers")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (!teacher) return [];
      
      // Get assigned classes
      const { data, error } = await supabase
        .from("teacher_classes")
        .select(`
          id,
          is_class_teacher,
          classes:class_id (
            id,
            name,
            capacity,
            school_id,
            academic_levels:level_id (id, name),
            students:students(count)
          )
        `)
        .eq("teacher_id", teacher.id);
      
      if (error) throw error;
      
      // Transform data to match expected format
      return (data || []).map(tc => ({
        ...tc.classes,
        is_class_teacher: tc.is_class_teacher
      }));
    },
    enabled: !!schoolId && !!user?.id,
  });
};

// Fetch students by class
export const useClassStudents = (classId: string | null) => {
  const { schoolId } = useAuth();
  
  return useQuery({
    queryKey: ["class-students", classId],
    queryFn: async () => {
      if (!classId || !schoolId) return [];
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("school_id", schoolId)
        .eq("class_id", classId)
        .order("registration_number", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!classId && !!schoolId,
  });
};

// Fetch students from teacher's assigned classes
export const useAllStudents = () => {
  const { schoolId, user } = useAuth();
  
  return useQuery({
    queryKey: ["all-students", schoolId, user?.id],
    queryFn: async () => {
      if (!schoolId || !user?.id) return [];
      
      // First get the teacher record
      const { data: teacher } = await supabase
        .from("teachers")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (!teacher) return [];
      
      // Get assigned class IDs
      const { data: teacherClasses } = await supabase
        .from("teacher_classes")
        .select("class_id")
        .eq("teacher_id", teacher.id);
      
      const classIds = teacherClasses?.map(tc => tc.class_id) || [];
      
      if (classIds.length === 0) return [];
      
      // Fetch students from assigned classes
      const { data, error } = await supabase
        .from("students")
        .select(`
          *,
          classes (id, name)
        `)
        .eq("school_id", schoolId)
        .in("class_id", classIds)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!schoolId && !!user?.id,
  });
};

// Fetch subjects
export const useTeacherSubjects = () => {
  const { schoolId } = useAuth();
  
  return useQuery({
    queryKey: ["teacher-subjects", schoolId],
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

// Fetch assessments
export const useTeacherAssessments = () => {
  const { schoolId } = useAuth();
  
  return useQuery({
    queryKey: ["teacher-assessments", schoolId],
    queryFn: async () => {
      if (!schoolId) return [];
      const { data, error } = await supabase
        .from("assessments")
        .select(`
          *,
          classes (id, name),
          subjects (id, name)
        `)
        .eq("school_id", schoolId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!schoolId,
  });
};

// Fetch attendance records
export const useTeacherAttendance = (classId?: string, date?: string) => {
  const { schoolId } = useAuth();
  
  return useQuery({
    queryKey: ["teacher-attendance", schoolId, classId, date],
    queryFn: async () => {
      if (!schoolId) return [];
      let query = supabase
        .from("attendance")
        .select(`
          *,
          students (id, registration_number, guardian_name),
          classes (id, name)
        `)
        .eq("school_id", schoolId)
        .order("date", { ascending: false });
      
      if (classId) {
        query = query.eq("class_id", classId);
      }
      if (date) {
        query = query.eq("date", date);
      }
      
      const { data, error } = await query.limit(100);
      if (error) throw error;
      return data || [];
    },
    enabled: !!schoolId,
  });
};

// Fetch teacher stats
export const useTeacherStats = () => {
  const { schoolId } = useAuth();
  
  return useQuery({
    queryKey: ["teacher-stats", schoolId],
    queryFn: async () => {
      if (!schoolId) return null;
      
      const today = new Date().toISOString().split("T")[0];
      
      const [classesRes, studentsRes, assessmentsRes, attendanceRes] = await Promise.all([
        supabase.from("classes").select("id", { count: "exact" }).eq("school_id", schoolId),
        supabase.from("students").select("id", { count: "exact" }).eq("school_id", schoolId),
        supabase.from("assessments").select("id", { count: "exact" }).eq("school_id", schoolId),
        supabase.from("attendance").select("id", { count: "exact" }).eq("school_id", schoolId).eq("date", today),
      ]);
      
      return {
        totalClasses: classesRes.count || 0,
        totalStudents: studentsRes.count || 0,
        totalAssessments: assessmentsRes.count || 0,
        todayAttendance: attendanceRes.count || 0,
      };
    },
    enabled: !!schoolId,
  });
};

// Enroll student mutation
export const useEnrollStudent = () => {
  const queryClient = useQueryClient();
  const { schoolId } = useAuth();
  
  return useMutation({
    mutationFn: async (studentData: {
      registration_number: string;
      class_id: string;
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
      queryClient.invalidateQueries({ queryKey: ["all-students"] });
      queryClient.invalidateQueries({ queryKey: ["class-students"] });
      queryClient.invalidateQueries({ queryKey: ["teacher-stats"] });
      toast.success("Student enrolled successfully");
    },
    onError: (error) => {
      toast.error("Failed to enroll student: " + error.message);
    },
  });
};

// Create assessment mutation
export const useCreateAssessment = () => {
  const queryClient = useQueryClient();
  const { schoolId, user } = useAuth();
  
  return useMutation({
    mutationFn: async (assessmentData: {
      title: string;
      class_id: string;
      subject_id: string;
      assessment_type?: string;
      max_score?: number;
    }) => {
      const { data, error } = await supabase
        .from("assessments")
        .insert({ 
          ...assessmentData, 
          school_id: schoolId,
          created_by: user?.id 
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-assessments"] });
      toast.success("Assessment created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create assessment: " + error.message);
    },
  });
};

// Add student score mutation
export const useAddStudentScore = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (scoreData: {
      student_id: string;
      assessment_id: string;
      score: number;
      remarks?: string;
    }) => {
      const { data, error } = await supabase
        .from("student_scores")
        .upsert({ 
          ...scoreData,
          recorded_by: user?.id 
        }, {
          onConflict: 'student_id,assessment_id'
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-scores"] });
      toast.success("Score saved successfully");
    },
    onError: (error) => {
      toast.error("Failed to save score: " + error.message);
    },
  });
};

// Bulk add scores mutation
export const useBulkAddScores = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (scores: Array<{
      student_id: string;
      assessment_id: string;
      score: number;
      remarks?: string;
    }>) => {
      const scoresWithRecorder = scores.map(s => ({
        ...s,
        recorded_by: user?.id
      }));
      
      const { data, error } = await supabase
        .from("student_scores")
        .upsert(scoresWithRecorder, {
          onConflict: 'student_id,assessment_id'
        })
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-scores"] });
      toast.success("All scores saved successfully");
    },
    onError: (error) => {
      toast.error("Failed to save scores: " + error.message);
    },
  });
};

// Mark attendance mutation
export const useMarkAttendance = () => {
  const queryClient = useQueryClient();
  const { schoolId, user } = useAuth();
  
  return useMutation({
    mutationFn: async (attendanceData: {
      student_id: string;
      class_id: string;
      date: string;
      status: string;
      remarks?: string;
    }) => {
      // Check if attendance already exists
      const { data: existing } = await supabase
        .from("attendance")
        .select("id")
        .eq("student_id", attendanceData.student_id)
        .eq("date", attendanceData.date)
        .maybeSingle();
      
      if (existing) {
        // Update existing
        const { data, error } = await supabase
          .from("attendance")
          .update({ 
            status: attendanceData.status,
            remarks: attendanceData.remarks,
            recorded_by: user?.id 
          })
          .eq("id", existing.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        // Insert new
        const { data, error } = await supabase
          .from("attendance")
          .insert({ 
            ...attendanceData, 
            school_id: schoolId,
            recorded_by: user?.id 
          })
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-attendance"] });
      queryClient.invalidateQueries({ queryKey: ["teacher-stats"] });
      toast.success("Attendance marked successfully");
    },
    onError: (error) => {
      toast.error("Failed to mark attendance: " + error.message);
    },
  });
};

// Bulk mark attendance mutation
export const useBulkMarkAttendance = () => {
  const queryClient = useQueryClient();
  const { schoolId, user } = useAuth();
  
  return useMutation({
    mutationFn: async (records: Array<{
      student_id: string;
      class_id: string;
      date: string;
      status: string;
      remarks?: string;
    }>) => {
      // Delete existing records for the same date/students
      const studentIds = records.map(r => r.student_id);
      const date = records[0]?.date;
      
      if (date && studentIds.length > 0) {
        await supabase
          .from("attendance")
          .delete()
          .eq("date", date)
          .in("student_id", studentIds);
      }
      
      // Insert new records
      const recordsWithMeta = records.map(r => ({
        ...r,
        school_id: schoolId,
        recorded_by: user?.id
      }));
      
      const { data, error } = await supabase
        .from("attendance")
        .insert(recordsWithMeta)
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-attendance"] });
      queryClient.invalidateQueries({ queryKey: ["teacher-stats"] });
      toast.success("Attendance saved for all students");
    },
    onError: (error) => {
      toast.error("Failed to save attendance: " + error.message);
    },
  });
};

// Fetch scores for assessment
export const useAssessmentScores = (assessmentId: string | null) => {
  return useQuery({
    queryKey: ["assessment-scores", assessmentId],
    queryFn: async () => {
      if (!assessmentId) return [];
      const { data, error } = await supabase
        .from("student_scores")
        .select(`
          *,
          students (id, registration_number, guardian_name)
        `)
        .eq("assessment_id", assessmentId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!assessmentId,
  });
};

// Fetch academic terms
export const useAcademicTerms = () => {
  const { schoolId } = useAuth();
  
  return useQuery({
    queryKey: ["academic-terms", schoolId],
    queryFn: async () => {
      if (!schoolId) return [];
      const { data, error } = await supabase
        .from("academic_terms")
        .select("*")
        .eq("school_id", schoolId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!schoolId,
  });
};

// Fetch lesson plans
export const useLessonPlans = (classId?: string) => {
  const { schoolId } = useAuth();
  
  return useQuery({
    queryKey: ["lesson-plans", schoolId, classId],
    queryFn: async () => {
      if (!schoolId) return [];
      let query = supabase
        .from("lesson_plans")
        .select(`
          *,
          classes (id, name),
          subjects (id, name)
        `)
        .eq("school_id", schoolId)
        .order("lesson_date", { ascending: false });
      
      if (classId) {
        query = query.eq("class_id", classId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: !!schoolId,
  });
};

// Create lesson plan mutation
export const useCreateLessonPlan = () => {
  const queryClient = useQueryClient();
  const { schoolId } = useAuth();
  const { data: teacherProfile } = useTeacherProfile();
  
  return useMutation({
    mutationFn: async (planData: {
      title: string;
      class_id: string;
      subject_id: string;
      objectives?: string;
      content?: string;
      materials?: string;
      activities?: string;
      assessment_method?: string;
      lesson_date?: string;
      duration_minutes?: number;
      status?: string;
    }) => {
      const { data, error } = await supabase
        .from("lesson_plans")
        .insert({ 
          ...planData, 
          school_id: schoolId,
          teacher_id: teacherProfile?.id 
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson-plans"] });
      toast.success("Lesson plan created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create lesson plan: " + error.message);
    },
  });
};

// Update lesson plan mutation
export const useUpdateLessonPlan = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...planData }: {
      id: string;
      title?: string;
      class_id?: string;
      subject_id?: string;
      objectives?: string;
      content?: string;
      materials?: string;
      activities?: string;
      assessment_method?: string;
      lesson_date?: string;
      duration_minutes?: number;
      status?: string;
    }) => {
      const { data, error } = await supabase
        .from("lesson_plans")
        .update(planData)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson-plans"] });
      toast.success("Lesson plan updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update lesson plan: " + error.message);
    },
  });
};

// Delete lesson plan mutation
export const useDeleteLessonPlan = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (planId: string) => {
      const { error } = await supabase
        .from("lesson_plans")
        .delete()
        .eq("id", planId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson-plans"] });
      toast.success("Lesson plan deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete lesson plan: " + error.message);
    },
  });
};

// Fetch scheme of work
export const useSchemeOfWork = (classId?: string, termId?: string) => {
  const { schoolId } = useAuth();
  
  return useQuery({
    queryKey: ["scheme-of-work", schoolId, classId, termId],
    queryFn: async () => {
      if (!schoolId) return [];
      let query = supabase
        .from("scheme_of_work")
        .select(`
          *,
          classes (id, name),
          subjects (id, name),
          academic_terms (id, name)
        `)
        .eq("school_id", schoolId)
        .order("week_number", { ascending: true });
      
      if (classId) {
        query = query.eq("class_id", classId);
      }
      if (termId) {
        query = query.eq("term_id", termId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: !!schoolId,
  });
};

// Create scheme of work mutation
export const useCreateSchemeOfWork = () => {
  const queryClient = useQueryClient();
  const { schoolId } = useAuth();
  const { data: teacherProfile } = useTeacherProfile();
  
  return useMutation({
    mutationFn: async (schemeData: {
      class_id: string;
      subject_id: string;
      term_id?: string;
      week_number: number;
      topic: string;
      sub_topic?: string;
      objectives?: string;
      teaching_aids?: string;
      reference_materials?: string;
      remarks?: string;
    }) => {
      const { data, error } = await supabase
        .from("scheme_of_work")
        .insert({ 
          ...schemeData, 
          school_id: schoolId,
          teacher_id: teacherProfile?.id 
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheme-of-work"] });
      toast.success("Scheme of work entry created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create scheme of work: " + error.message);
    },
  });
};

// Update scheme of work mutation
export const useUpdateSchemeOfWork = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...schemeData }: {
      id: string;
      class_id?: string;
      subject_id?: string;
      term_id?: string;
      week_number?: number;
      topic?: string;
      sub_topic?: string;
      objectives?: string;
      teaching_aids?: string;
      reference_materials?: string;
      remarks?: string;
    }) => {
      const { data, error } = await supabase
        .from("scheme_of_work")
        .update(schemeData)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheme-of-work"] });
      toast.success("Scheme of work updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update scheme of work: " + error.message);
    },
  });
};

// Delete scheme of work mutation
export const useDeleteSchemeOfWork = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (schemeId: string) => {
      const { error } = await supabase
        .from("scheme_of_work")
        .delete()
        .eq("id", schemeId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheme-of-work"] });
      toast.success("Scheme of work entry deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete scheme of work: " + error.message);
    },
  });
};

// Add academic level for teachers
export const useAddAcademicLevel = () => {
  const queryClient = useQueryClient();
  const { schoolId } = useAuth();
  
  return useMutation({
    mutationFn: async (levelData: {
      name: string;
      description?: string;
      order_index?: number;
    }) => {
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
      toast.success("Academic level created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create academic level: " + error.message);
    },
  });
};

// Fetch academic levels for teachers
export const useTeacherAcademicLevels = () => {
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

// Add class mutation for teachers
export const useAddTeacherClass = () => {
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
      queryClient.invalidateQueries({ queryKey: ["teacher-classes"] });
      toast.success("Class created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create class: " + error.message);
    },
  });
};

// Fetch all students with profile info
export const useTeacherStudents = () => {
  const { schoolId } = useAuth();
  
  return useQuery({
    queryKey: ["teacher-all-students", schoolId],
    queryFn: async () => {
      if (!schoolId) return [];
      
      // Get students with user_id
      const { data: students, error } = await supabase
        .from("students")
        .select(`
          *,
          classes (id, name)
        `)
        .eq("school_id", schoolId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      // Get profile info for students with user_id
      const userIds = students?.filter(s => s.user_id).map(s => s.user_id) || [];
      
      if (userIds.length === 0) {
        return students?.map(s => ({ ...s, profiles: null })) || [];
      }
      
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, email, phone")
        .in("id", userIds);
      
      const profilesMap = new Map(profiles?.map(p => [p.id, p]) || []);
      
      return students?.map(student => ({
        ...student,
        profiles: student.user_id ? profilesMap.get(student.user_id) || null : null
      })) || [];
    },
    enabled: !!schoolId,
  });
};

// Fetch Quran memorization records
export const useQuranMemorization = () => {
  const { schoolId } = useAuth();
  
  return useQuery({
    queryKey: ["quran-memorization", schoolId],
    queryFn: async () => {
      if (!schoolId) return [];
      const { data, error } = await supabase
        .from("quran_memorization")
        .select("*")
        .eq("school_id", schoolId)
        .order("memorization_date", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!schoolId,
  });
};

// Add Quran memorization record
export const useAddQuranRecord = () => {
  const queryClient = useQueryClient();
  const { schoolId } = useAuth();
  const { data: teacherProfile } = useTeacherProfile();
  
  return useMutation({
    mutationFn: async (recordData: {
      student_id: string;
      surah_number?: number;
      surah_name?: string;
      juz_number?: number;
      verses_from?: number;
      verses_to?: number;
      status?: string;
      quality_rating?: number;
      teacher_remarks?: string;
      teacher_verified?: boolean;
    }) => {
      const { data, error } = await supabase
        .from("quran_memorization")
        .insert({ 
          ...recordData, 
          school_id: schoolId,
          teacher_id: teacherProfile?.id 
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quran-memorization"] });
      toast.success("Memorization record added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add record: " + error.message);
    },
  });
};

// Update Quran memorization record
export const useUpdateQuranRecord = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...recordData }: {
      id: string;
      status?: string;
      quality_rating?: number;
      teacher_remarks?: string;
      teacher_verified?: boolean;
    }) => {
      const { data, error } = await supabase
        .from("quran_memorization")
        .update(recordData)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quran-memorization"] });
      toast.success("Record updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update record: " + error.message);
    },
  });
};
