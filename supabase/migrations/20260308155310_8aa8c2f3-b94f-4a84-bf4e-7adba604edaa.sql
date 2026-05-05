
-- Table for term results (one per student per term)
CREATE TABLE public.student_term_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  class_id UUID REFERENCES public.classes(id),
  term_id UUID REFERENCES public.academic_terms(id),
  session_id UUID REFERENCES public.academic_sessions(id),
  total_score NUMERIC DEFAULT 0,
  average_score NUMERIC DEFAULT 0,
  position INTEGER,
  out_of INTEGER,
  attendance_present INTEGER DEFAULT 0,
  attendance_total INTEGER DEFAULT 0,
  teacher_remarks TEXT,
  principal_remarks TEXT,
  behavioral_ratings JSONB DEFAULT '{"punctuality": 3, "neatness": 3, "conduct": 3, "attentiveness": 3, "perseverance": 3, "relationship_with_others": 3, "honesty": 3}'::jsonb,
  is_published BOOLEAN DEFAULT false,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table for per-subject results within a term
CREATE TABLE public.student_subject_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  term_result_id UUID NOT NULL REFERENCES public.student_term_results(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id),
  subject_name TEXT NOT NULL,
  ca1_score NUMERIC DEFAULT 0,
  ca2_score NUMERIC DEFAULT 0,
  exam_score NUMERIC DEFAULT 0,
  total_score NUMERIC DEFAULT 0,
  grade TEXT,
  remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tokens for checking results (sold by platform admin)
CREATE TABLE public.result_check_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT NOT NULL UNIQUE,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  term_id UUID REFERENCES public.academic_terms(id),
  session_id UUID REFERENCES public.academic_sessions(id),
  is_used BOOLEAN DEFAULT false,
  used_at TIMESTAMPTZ,
  used_by_registration TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.student_term_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_subject_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.result_check_tokens ENABLE ROW LEVEL SECURITY;

-- RLS for student_term_results
CREATE POLICY "Teachers can manage term results" ON public.student_term_results
FOR ALL TO authenticated
USING (has_role(auth.uid(), 'teacher') AND school_id = get_user_school_id(auth.uid()));

CREATE POLICY "School admins can manage term results" ON public.student_term_results
FOR ALL TO authenticated
USING (has_role(auth.uid(), 'school_admin') AND school_id = get_user_school_id(auth.uid()));

CREATE POLICY "Anyone can view published results" ON public.student_term_results
FOR SELECT USING (is_published = true);

-- RLS for student_subject_results
CREATE POLICY "Teachers can manage subject results" ON public.student_subject_results
FOR ALL TO authenticated
USING (EXISTS (
  SELECT 1 FROM student_term_results str 
  WHERE str.id = student_subject_results.term_result_id 
  AND str.school_id = get_user_school_id(auth.uid())
  AND (has_role(auth.uid(), 'teacher') OR has_role(auth.uid(), 'school_admin'))
));

CREATE POLICY "Anyone can view published subject results" ON public.student_subject_results
FOR SELECT USING (EXISTS (
  SELECT 1 FROM student_term_results str 
  WHERE str.id = student_subject_results.term_result_id 
  AND str.is_published = true
));

-- RLS for result_check_tokens
CREATE POLICY "Super admins can manage tokens" ON public.result_check_tokens
FOR ALL TO authenticated
USING (has_role(auth.uid(), 'super_admin'));

CREATE POLICY "School admins can view their tokens" ON public.result_check_tokens
FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'school_admin') AND school_id = get_user_school_id(auth.uid()));

CREATE POLICY "Anyone can validate tokens" ON public.result_check_tokens
FOR SELECT USING (true);

CREATE POLICY "Token validation update" ON public.result_check_tokens
FOR UPDATE USING (true) WITH CHECK (true);
