-- Create timetable table for class schedules
CREATE TABLE public.timetable (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
  teacher_id UUID REFERENCES public.teachers(id) ON DELETE SET NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  period_number INTEGER,
  room_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.timetable ENABLE ROW LEVEL SECURITY;

-- Policies for timetable
CREATE POLICY "School members can view timetable"
  ON public.timetable
  FOR SELECT
  USING (school_id = get_user_school_id(auth.uid()));

CREATE POLICY "School admins can manage timetable"
  ON public.timetable
  FOR ALL
  USING (has_role(auth.uid(), 'school_admin') AND school_id = get_user_school_id(auth.uid()));

-- Add parent-student relationship table
CREATE TABLE public.parent_students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_id UUID NOT NULL,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  relationship TEXT DEFAULT 'parent',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(parent_id, student_id)
);

-- Enable RLS
ALTER TABLE public.parent_students ENABLE ROW LEVEL SECURITY;

-- Policies for parent_students
CREATE POLICY "Parents can view their linked students"
  ON public.parent_students
  FOR SELECT
  USING (parent_id = auth.uid());

CREATE POLICY "School admins can manage parent-student links"
  ON public.parent_students
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM students s 
    WHERE s.id = parent_students.student_id 
    AND s.school_id = get_user_school_id(auth.uid())
    AND has_role(auth.uid(), 'school_admin')
  ));

-- Indexes for performance
CREATE INDEX idx_timetable_school ON public.timetable(school_id);
CREATE INDEX idx_timetable_class ON public.timetable(class_id);
CREATE INDEX idx_timetable_day ON public.timetable(day_of_week);
CREATE INDEX idx_parent_students_parent ON public.parent_students(parent_id);
CREATE INDEX idx_parent_students_student ON public.parent_students(student_id);