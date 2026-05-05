
-- ===========================================
-- TIGHTEN EXAM TABLE RLS POLICIES
-- ===========================================

-- 1. exam_candidates: Remove overly permissive SELECT, keep school_admin + insert
DROP POLICY IF EXISTS "Candidates can view own data" ON public.exam_candidates;
DROP POLICY IF EXISTS "Candidates can update activation" ON public.exam_candidates;

-- 2. exam_questions: Remove public SELECT that exposes correct_option
DROP POLICY IF EXISTS "Anyone can view exam questions" ON public.exam_questions;

-- 3. exam_answers: Remove overly permissive ALL
DROP POLICY IF EXISTS "Anyone can manage exam answers" ON public.exam_answers;

-- Add restricted policy: only school admins can manage exam answers
CREATE POLICY "School admins can manage exam answers"
ON public.exam_answers
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM exam_sessions es
    JOIN exam_candidates ec ON ec.id = es.candidate_id
    JOIN user_roles ur ON ur.school_id = ec.school_id
    WHERE es.id = exam_answers.session_id
    AND ur.user_id = auth.uid()
    AND ur.role = 'school_admin'
  )
);

-- 4. exam_sessions: Remove overly permissive policies
DROP POLICY IF EXISTS "Anyone can view exam sessions" ON public.exam_sessions;
DROP POLICY IF EXISTS "Anyone can create exam sessions" ON public.exam_sessions;
DROP POLICY IF EXISTS "Anyone can update exam sessions" ON public.exam_sessions;

-- Add restricted policies for exam_sessions
CREATE POLICY "School admins can manage exam sessions"
ON public.exam_sessions
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM exam_candidates ec
    JOIN user_roles ur ON ur.school_id = ec.school_id
    WHERE ec.id = exam_sessions.candidate_id
    AND ur.user_id = auth.uid()
    AND ur.role = 'school_admin'
  )
);

-- 5. Restrict schools public SELECT to only approved schools (already exists but let's also add super_admin visibility for all)
-- The existing "Anyone can view approved schools" policy is acceptable since school names/addresses are public information
-- No changes needed for schools table
