-- Create exam_candidates table for registered exam candidates
CREATE TABLE public.exam_candidates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students(id) ON DELETE SET NULL,
  registration_number VARCHAR(50) NOT NULL UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100),
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  state VARCHAR(100) NOT NULL,
  lga VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  passport_url TEXT,
  subjects TEXT[] NOT NULL,
  status VARCHAR(20) DEFAULT 'registered',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create exam_questions table
CREATE TABLE public.exam_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_option CHAR(1) NOT NULL CHECK (correct_option IN ('A', 'B', 'C', 'D')),
  explanation TEXT,
  difficulty VARCHAR(20) DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create exam_sessions table for tracking exam attempts
CREATE TABLE public.exam_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID NOT NULL REFERENCES public.exam_candidates(id) ON DELETE CASCADE,
  subject_name VARCHAR(100) NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  total_questions INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  score_percentage DECIMAL(5,2),
  status VARCHAR(20) DEFAULT 'in_progress'
);

-- Create exam_answers table for tracking individual answers
CREATE TABLE public.exam_answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.exam_sessions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.exam_questions(id) ON DELETE CASCADE,
  selected_option CHAR(1),
  is_correct BOOLEAN,
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.exam_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_answers ENABLE ROW LEVEL SECURITY;

-- Public can register as candidates (INSERT)
CREATE POLICY "Anyone can register as exam candidate"
ON public.exam_candidates FOR INSERT
WITH CHECK (true);

-- Candidates can view their own data
CREATE POLICY "Candidates can view own data"
ON public.exam_candidates FOR SELECT
USING (true);

-- School admins can manage candidates
CREATE POLICY "School admins can manage candidates"
ON public.exam_candidates FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'school_admin'
    AND user_roles.school_id = exam_candidates.school_id
  )
);

-- Anyone can view exam questions (for practice)
CREATE POLICY "Anyone can view exam questions"
ON public.exam_questions FOR SELECT
USING (true);

-- School admins can manage questions
CREATE POLICY "School admins can manage questions"
ON public.exam_questions FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'school_admin'
    AND user_roles.school_id = exam_questions.school_id
  )
);

-- Anyone can create and view exam sessions
CREATE POLICY "Anyone can create exam sessions"
ON public.exam_sessions FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view exam sessions"
ON public.exam_sessions FOR SELECT
USING (true);

CREATE POLICY "Anyone can update exam sessions"
ON public.exam_sessions FOR UPDATE
USING (true);

-- Anyone can manage exam answers
CREATE POLICY "Anyone can manage exam answers"
ON public.exam_answers FOR ALL
USING (true);

-- Create indexes
CREATE INDEX idx_exam_candidates_registration ON public.exam_candidates(registration_number);
CREATE INDEX idx_exam_candidates_school ON public.exam_candidates(school_id);
CREATE INDEX idx_exam_questions_school ON public.exam_questions(school_id);
CREATE INDEX idx_exam_questions_subject ON public.exam_questions(subject_id);
CREATE INDEX idx_exam_sessions_candidate ON public.exam_sessions(candidate_id);

-- Add trigger for updated_at
CREATE TRIGGER update_exam_candidates_updated_at
BEFORE UPDATE ON public.exam_candidates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();