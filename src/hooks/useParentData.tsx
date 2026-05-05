import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

// Fetch parent's linked children
export const useParentChildren = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["parent-children", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      // Get linked students from parent_students table
      const { data: links, error: linksError } = await supabase
        .from("parent_students")
        .select("student_id, relationship")
        .eq("parent_id", user.id);
      
      if (linksError) throw linksError;
      if (!links || links.length === 0) return [];
      
      const studentIds = links.map(l => l.student_id);
      
      // Get student details with class info
      const { data: students, error: studentsError } = await supabase
        .from("students")
        .select(`
          *,
          classes (id, name)
        `)
        .in("id", studentIds);
      
      if (studentsError) throw studentsError;

      // Fetch profile names for students that have user_ids
      const userIds = students?.filter(s => s.user_id).map(s => s.user_id!) || [];
      let profilesMap: Record<string, any> = {};
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, full_name, email, avatar_url")
          .in("id", userIds);
        profiles?.forEach(p => { profilesMap[p.id] = p; });
      }
      
      // Merge with relationship info
      return students?.map(student => ({
        ...student,
        profiles: student.user_id ? profilesMap[student.user_id] : null,
        relationship: links.find(l => l.student_id === student.id)?.relationship || "parent"
      })) || [];
    },
    enabled: !!user?.id,
  });
};

// Fetch child's attendance
export const useChildAttendance = (studentId: string | null) => {
  return useQuery({
    queryKey: ["child-attendance", studentId],
    queryFn: async () => {
      if (!studentId) return [];
      
      const { data, error } = await supabase
        .from("attendance")
        .select(`
          *,
          classes (id, name)
        `)
        .eq("student_id", studentId)
        .order("date", { ascending: false })
        .limit(30);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!studentId,
  });
};

// Fetch child's scores/results
export const useChildScores = (studentId: string | null) => {
  return useQuery({
    queryKey: ["child-scores", studentId],
    queryFn: async () => {
      if (!studentId) return [];
      
      const { data, error } = await supabase
        .from("student_scores")
        .select(`
          *,
          assessments (
            id, 
            title, 
            max_score, 
            assessment_type,
            subjects (id, name)
          )
        `)
        .eq("student_id", studentId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!studentId,
  });
};

// Fetch child's fee payments
export const useChildPayments = (studentId: string | null) => {
  return useQuery({
    queryKey: ["child-payments", studentId],
    queryFn: async () => {
      if (!studentId) return [];
      
      const { data, error } = await supabase
        .from("student_payments")
        .select(`
          *,
          fee_categories (id, name, amount)
        `)
        .eq("student_id", studentId)
        .order("payment_date", { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!studentId,
  });
};

// Fetch school announcements for parent
export const useParentAnnouncements = () => {
  const { schoolId } = useAuth();
  
  return useQuery({
    queryKey: ["parent-announcements", schoolId],
    queryFn: async () => {
      if (!schoolId) return [];
      
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .eq("school_id", schoolId)
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!schoolId,
  });
};

// Fetch child's Quran memorization
export const useChildQuranProgress = (studentId: string | null) => {
  return useQuery({
    queryKey: ["child-quran", studentId],
    queryFn: async () => {
      if (!studentId) return [];
      
      const { data, error } = await supabase
        .from("quran_memorization")
        .select("*")
        .eq("student_id", studentId)
        .order("memorization_date", { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!studentId,
  });
};

// Calculate attendance stats
export const useChildAttendanceStats = (studentId: string | null) => {
  const { data: attendance } = useChildAttendance(studentId);
  
  const stats = {
    total: attendance?.length || 0,
    present: attendance?.filter(a => a.status === "present").length || 0,
    absent: attendance?.filter(a => a.status === "absent").length || 0,
    late: attendance?.filter(a => a.status === "late").length || 0,
    percentage: 0,
  };
  
  if (stats.total > 0) {
    stats.percentage = Math.round((stats.present / stats.total) * 100);
  }
  
  return stats;
};

// Calculate academic performance
export const useChildPerformanceStats = (studentId: string | null) => {
  const { data: scores } = useChildScores(studentId);
  
  if (!scores || scores.length === 0) {
    return { average: 0, total: 0, passed: 0, failed: 0 };
  }
  
  let totalPercentage = 0;
  let passed = 0;
  let failed = 0;
  
  scores.forEach(score => {
    const maxScore = score.assessments?.max_score || 100;
    const percentage = ((score.score || 0) / maxScore) * 100;
    totalPercentage += percentage;
    if (percentage >= 50) {
      passed++;
    } else {
      failed++;
    }
  });
  
  return {
    average: Math.round(totalPercentage / scores.length),
    total: scores.length,
    passed,
    failed,
  };
};
