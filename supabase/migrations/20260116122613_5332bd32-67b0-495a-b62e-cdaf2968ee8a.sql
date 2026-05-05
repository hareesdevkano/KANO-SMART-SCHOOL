-- Create lesson_plans table
CREATE TABLE public.lesson_plans (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES public.teachers(id) ON DELETE SET NULL,
    class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    objectives TEXT,
    content TEXT,
    materials TEXT,
    activities TEXT,
    assessment_method TEXT,
    lesson_date DATE,
    duration_minutes INTEGER DEFAULT 45,
    status TEXT DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create scheme_of_work table
CREATE TABLE public.scheme_of_work (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES public.teachers(id) ON DELETE SET NULL,
    class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
    term_id UUID REFERENCES public.academic_terms(id) ON DELETE SET NULL,
    week_number INTEGER NOT NULL,
    topic TEXT NOT NULL,
    sub_topic TEXT,
    objectives TEXT,
    teaching_aids TEXT,
    reference_materials TEXT,
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.lesson_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheme_of_work ENABLE ROW LEVEL SECURITY;

-- RLS Policies for lesson_plans
CREATE POLICY "School members can view lesson plans" 
ON public.lesson_plans 
FOR SELECT 
USING (school_id = get_user_school_id(auth.uid()));

CREATE POLICY "Teachers can manage their lesson plans" 
ON public.lesson_plans 
FOR ALL 
USING (has_role(auth.uid(), 'teacher') AND school_id = get_user_school_id(auth.uid()));

CREATE POLICY "School admins can manage lesson plans" 
ON public.lesson_plans 
FOR ALL 
USING (has_role(auth.uid(), 'school_admin') AND school_id = get_user_school_id(auth.uid()));

-- RLS Policies for scheme_of_work
CREATE POLICY "School members can view scheme of work" 
ON public.scheme_of_work 
FOR SELECT 
USING (school_id = get_user_school_id(auth.uid()));

CREATE POLICY "Teachers can manage their scheme of work" 
ON public.scheme_of_work 
FOR ALL 
USING (has_role(auth.uid(), 'teacher') AND school_id = get_user_school_id(auth.uid()));

CREATE POLICY "School admins can manage scheme of work" 
ON public.scheme_of_work 
FOR ALL 
USING (has_role(auth.uid(), 'school_admin') AND school_id = get_user_school_id(auth.uid()));

-- Create indexes for better performance
CREATE INDEX idx_lesson_plans_school_id ON public.lesson_plans(school_id);
CREATE INDEX idx_lesson_plans_teacher_id ON public.lesson_plans(teacher_id);
CREATE INDEX idx_lesson_plans_class_id ON public.lesson_plans(class_id);
CREATE INDEX idx_scheme_of_work_school_id ON public.scheme_of_work(school_id);
CREATE INDEX idx_scheme_of_work_teacher_id ON public.scheme_of_work(teacher_id);
CREATE INDEX idx_scheme_of_work_class_id ON public.scheme_of_work(class_id);