import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface SubjectResult {
  id?: string;
  subject_id?: string;
  subject_name: string;
  ca1_score: number;
  ca2_score: number;
  exam_score: number;
  total_score: number;
  grade: string;
  remarks?: string;
}

export interface TermResult {
  id?: string;
  student_id: string;
  school_id: string;
  class_id?: string;
  term_id?: string;
  session_id?: string;
  total_score: number;
  average_score: number;
  position?: number;
  out_of?: number;
  attendance_present: number;
  attendance_total: number;
  teacher_remarks?: string;
  principal_remarks?: string;
  behavioral_ratings: Record<string, number>;
  is_published: boolean;
  subject_results?: SubjectResult[];
  students?: any;
  classes?: any;
}

// Fetch term results for a class
export const useClassTermResults = (classId: string | null, termId?: string) => {
  const { schoolId } = useAuth();

  return useQuery({
    queryKey: ["class-term-results", classId, termId, schoolId],
    queryFn: async () => {
      if (!classId || !schoolId) return [];
      let query = supabase
        .from("student_term_results")
        .select(`
          *,
          students!inner (id, registration_number, guardian_name, gender),
          classes (id, name)
        `)
        .eq("school_id", schoolId)
        .eq("class_id", classId)
        .order("position", { ascending: true });

      if (termId) query = query.eq("term_id", termId);

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: !!classId && !!schoolId,
  });
};

// Fetch subject results for a term result
export const useSubjectResults = (termResultId: string | null) => {
  return useQuery({
    queryKey: ["subject-results", termResultId],
    queryFn: async () => {
      if (!termResultId) return [];
      const { data, error } = await supabase
        .from("student_subject_results")
        .select("*")
        .eq("term_result_id", termResultId)
        .order("subject_name", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!termResultId,
  });
};

// Save or update a full term result with subjects
export const useSaveTermResult = () => {
  const queryClient = useQueryClient();
  const { user, schoolId } = useAuth();

  return useMutation({
    mutationFn: async (data: {
      studentId: string;
      classId: string;
      termId?: string;
      sessionId?: string;
      subjectResults: SubjectResult[];
      attendancePresent: number;
      attendanceTotal: number;
      teacherRemarks: string;
      principalRemarks: string;
      behavioralRatings: Record<string, number>;
    }) => {
      // Calculate totals
      const totalScore = data.subjectResults.reduce((sum, s) => sum + s.total_score, 0);
      const avgScore = data.subjectResults.length > 0 
        ? Math.round((totalScore / (data.subjectResults.length * 100)) * 100 * 10) / 10
        : 0;

      // Check if result already exists
      let query = supabase
        .from("student_term_results")
        .select("id")
        .eq("student_id", data.studentId)
        .eq("school_id", schoolId!)
        .eq("class_id", data.classId);

      if (data.termId) query = query.eq("term_id", data.termId);

      const { data: existing } = await query.maybeSingle();

      let termResultId: string;

      if (existing) {
        const { error } = await supabase
          .from("student_term_results")
          .update({
            total_score: totalScore,
            average_score: avgScore,
            attendance_present: data.attendancePresent,
            attendance_total: data.attendanceTotal,
            teacher_remarks: data.teacherRemarks,
            principal_remarks: data.principalRemarks,
            behavioral_ratings: data.behavioralRatings,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);
        if (error) throw error;
        termResultId = existing.id;

        // Delete old subject results
        await supabase
          .from("student_subject_results")
          .delete()
          .eq("term_result_id", termResultId);
      } else {
        const { data: newResult, error } = await supabase
          .from("student_term_results")
          .insert({
            student_id: data.studentId,
            school_id: schoolId,
            class_id: data.classId,
            term_id: data.termId || null,
            session_id: data.sessionId || null,
            total_score: totalScore,
            average_score: avgScore,
            attendance_present: data.attendancePresent,
            attendance_total: data.attendanceTotal,
            teacher_remarks: data.teacherRemarks,
            principal_remarks: data.principalRemarks,
            behavioral_ratings: data.behavioralRatings,
            created_by: user?.id,
          })
          .select("id")
          .single();
        if (error) throw error;
        termResultId = newResult.id;
      }

      // Insert subject results
      if (data.subjectResults.length > 0) {
        const subjectRows = data.subjectResults.map(sr => ({
          term_result_id: termResultId,
          subject_id: sr.subject_id || null,
          subject_name: sr.subject_name,
          ca1_score: sr.ca1_score,
          ca2_score: sr.ca2_score,
          exam_score: sr.exam_score,
          total_score: sr.total_score,
          grade: sr.grade,
          remarks: sr.remarks || null,
        }));

        const { error: subjError } = await supabase
          .from("student_subject_results")
          .insert(subjectRows);
        if (subjError) throw subjError;
      }

      return termResultId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-term-results"] });
      toast.success("Results saved successfully");
    },
    onError: (error) => {
      toast.error("Failed to save results: " + error.message);
    },
  });
};

// Publish results for a class
export const usePublishResults = () => {
  const queryClient = useQueryClient();
  const { schoolId } = useAuth();

  return useMutation({
    mutationFn: async ({ classId, termId }: { classId: string; termId?: string }) => {
      // First calculate positions
      let query = supabase
        .from("student_term_results")
        .select("id, average_score")
        .eq("school_id", schoolId!)
        .eq("class_id", classId)
        .order("average_score", { ascending: false });

      if (termId) query = query.eq("term_id", termId);

      const { data: results, error: fetchError } = await query;
      if (fetchError) throw fetchError;

      const totalStudents = results?.length || 0;

      // Update positions and publish
      for (let i = 0; i < (results || []).length; i++) {
        await supabase
          .from("student_term_results")
          .update({ 
            position: i + 1, 
            out_of: totalStudents,
            is_published: true 
          })
          .eq("id", results![i].id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-term-results"] });
      toast.success("Results published successfully! Positions calculated.");
    },
    onError: (error) => {
      toast.error("Failed to publish: " + error.message);
    },
  });
};

// Public: Check results with token
export const useCheckResults = () => {
  return useMutation({
    mutationFn: async ({ registrationNumber, schoolId, token, sessionId, termId }: {
      registrationNumber: string;
      schoolId: string;
      token: string;
      sessionId?: string;
      termId?: string;
    }) => {
      // Validate token
      const { data: tokenData, error: tokenError } = await supabase
        .from("result_check_tokens")
        .select("*")
        .eq("token", token)
        .eq("school_id", schoolId)
        .eq("is_used", false)
        .maybeSingle();

      if (tokenError) throw new Error("Token validation failed");
      if (!tokenData) throw new Error("Invalid or already used token");

      // Find student by registration number
      const { data: student, error: studentError } = await supabase
        .from("students")
        .select("id, registration_number, guardian_name, gender")
        .eq("registration_number", registrationNumber)
        .eq("school_id", schoolId)
        .maybeSingle();

      if (studentError || !student) throw new Error("Student not found with this registration number");

      // Get published results (filtered by session/term if provided)
      let resultQuery = supabase
        .from("student_term_results")
        .select("*")
        .eq("student_id", student.id)
        .eq("school_id", schoolId)
        .eq("is_published", true);

      if (termId) resultQuery = resultQuery.eq("term_id", termId);
      if (sessionId) resultQuery = resultQuery.eq("session_id", sessionId);

      const { data: termResult, error: resultError } = await resultQuery
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (resultError || !termResult) throw new Error("No published results found for this student");

      // Get subject results
      const { data: subjectResults } = await supabase
        .from("student_subject_results")
        .select("*")
        .eq("term_result_id", termResult.id)
        .order("subject_name", { ascending: true });

      // Get school info (including display settings)
      const { data: school } = await supabase
        .from("schools")
        .select("name, logo_url, address, state, email, phone, show_average, show_position, show_grade")
        .eq("id", schoolId)
        .maybeSingle();

      // Get class name
      const { data: classData } = await supabase
        .from("classes")
        .select("name")
        .eq("id", termResult.class_id)
        .maybeSingle();

      // Get session and term names
      let sessionName = "";
      let termName = "";
      if (termResult.session_id) {
        const { data: sessionData } = await supabase
          .from("academic_sessions")
          .select("name")
          .eq("id", termResult.session_id)
          .maybeSingle();
        sessionName = sessionData?.name || "";
      }
      if (termResult.term_id) {
        const { data: termData } = await supabase
          .from("academic_terms")
          .select("name")
          .eq("id", termResult.term_id)
          .maybeSingle();
        termName = termData?.name || "";
      }

      // Mark token as used
      await supabase
        .from("result_check_tokens")
        .update({
          is_used: true,
          used_at: new Date().toISOString(),
          used_by_registration: registrationNumber,
        })
        .eq("id", tokenData.id);

      return {
        student,
        termResult,
        subjectResults: subjectResults || [],
        school,
        className: classData?.name || "N/A",
        sessionName,
        termName,
      };
    },
  });
};

// Fetch schools for results checker dropdown
export const usePublicSchools = () => {
  return useQuery({
    queryKey: ["public-schools"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("schools")
        .select("id, name")
        .eq("status", "approved")
        .order("name", { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });
};
