import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export const useStudentProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["student-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("students")
        .select(`
          *,
          classes:class_id (
            id,
            name,
            academic_levels:level_id (
              id,
              name
            )
          )
        `)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
};

export const useStudentAttendance = () => {
  const { user, schoolId } = useAuth();

  return useQuery({
    queryKey: ["student-attendance", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      // First get the student record
      const { data: student } = await supabase
        .from("students")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!student) return [];

      const { data, error } = await supabase
        .from("attendance")
        .select(`
          *,
          classes:class_id (
            name
          )
        `)
        .eq("student_id", student.id)
        .order("date", { ascending: false })
        .limit(30);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });
};

export const useStudentScores = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["student-scores", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      // First get the student record
      const { data: student } = await supabase
        .from("students")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!student) return [];

      const { data, error } = await supabase
        .from("student_scores")
        .select(`
          *,
          assessments:assessment_id (
            title,
            assessment_type,
            max_score,
            subjects:subject_id (
              name
            )
          )
        `)
        .eq("student_id", student.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });
};

export const useStudentPayments = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["student-payments", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      // First get the student record
      const { data: student } = await supabase
        .from("students")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!student) return [];

      const { data, error } = await supabase
        .from("student_payments")
        .select(`
          *,
          fee_categories:fee_category_id (
            name,
            amount
          )
        `)
        .eq("student_id", student.id)
        .order("payment_date", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });
};

export const useStudentStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["student-stats", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      // First get the student record
      const { data: student } = await supabase
        .from("students")
        .select("id, school_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!student) return null;

      // Get attendance stats
      const { count: totalAttendance } = await supabase
        .from("attendance")
        .select("*", { count: "exact", head: true })
        .eq("student_id", student.id);

      const { count: presentCount } = await supabase
        .from("attendance")
        .select("*", { count: "exact", head: true })
        .eq("student_id", student.id)
        .eq("status", "present");

      // Get scores
      const { data: scores } = await supabase
        .from("student_scores")
        .select("score, assessments!inner(max_score)")
        .eq("student_id", student.id);

      let averageScore = 0;
      if (scores && scores.length > 0) {
        const totalPercentage = scores.reduce((acc, s) => {
          const maxScore = (s.assessments as any)?.max_score || 100;
          return acc + ((s.score || 0) / maxScore) * 100;
        }, 0);
        averageScore = Math.round(totalPercentage / scores.length);
      }

      // Get fee balance
      const { data: payments } = await supabase
        .from("student_payments")
        .select("amount, status")
        .eq("student_id", student.id);

      const totalPaid = payments?.reduce((acc, p) => 
        p.status === "completed" ? acc + Number(p.amount) : acc, 0
      ) || 0;

      return {
        attendanceRate: totalAttendance ? Math.round((presentCount || 0) / totalAttendance * 100) : 0,
        averageScore,
        totalPaid,
        totalAssessments: scores?.length || 0,
      };
    },
    enabled: !!user?.id,
  });
};

export const useStudentTermResults = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["student-term-results", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data: student } = await supabase
        .from("students")
        .select("id, school_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!student) return [];

      const { data: results, error } = await supabase
        .from("student_term_results")
        .select(`
          *,
          classes:class_id (name),
          academic_terms:term_id (name, academic_sessions:session_id (name))
        `)
        .eq("student_id", student.id)
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return results || [];
    },
    enabled: !!user?.id,
  });
};

export const useStudentAnnouncements = () => {
  const { schoolId } = useAuth();

  return useQuery({
    queryKey: ["student-announcements", schoolId],
    queryFn: async () => {
      if (!schoolId) return [];

      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .eq("school_id", schoolId)
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data || [];
    },
    enabled: !!schoolId,
  });
};

export const useStudentFeeBalance = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["student-fee-balance", user?.id],
    queryFn: async () => {
      if (!user?.id) return { totalFees: 0, totalPaid: 0, balance: 0 };

      const { data: student } = await supabase
        .from("students")
        .select("id, school_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!student) return { totalFees: 0, totalPaid: 0, balance: 0 };

      const { data: feeCategories } = await supabase
        .from("fee_categories")
        .select("amount")
        .eq("school_id", student.school_id);

      const totalFees = feeCategories?.reduce((sum, f) => sum + Number(f.amount), 0) || 0;

      const { data: payments } = await supabase
        .from("student_payments")
        .select("amount, status")
        .eq("student_id", student.id)
        .eq("status", "completed");

      const totalPaid = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

      return { totalFees, totalPaid, balance: totalFees - totalPaid };
    },
    enabled: !!user?.id,
  });
};
