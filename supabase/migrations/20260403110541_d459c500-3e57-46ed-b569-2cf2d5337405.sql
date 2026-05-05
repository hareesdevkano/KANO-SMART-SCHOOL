
-- Create a security definer function to check parent-student links without triggering RLS recursion
CREATE OR REPLACE FUNCTION public.is_parent_of_student(_parent_id UUID, _student_id UUID)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM parent_students
    WHERE parent_id = _parent_id AND student_id = _student_id
  );
$$;

-- Drop the recursive policies on parent_students
DROP POLICY IF EXISTS "Parents can view their linked students" ON public.parent_students;
DROP POLICY IF EXISTS "School admins can manage parent-student links" ON public.parent_students;

-- Recreate parent_students policies without recursion
CREATE POLICY "Parents can view their linked students"
ON public.parent_students
FOR SELECT
USING (parent_id = auth.uid());

CREATE POLICY "School admins can manage parent-student links"
ON public.parent_students
FOR ALL
USING (
  has_role(auth.uid(), 'school_admin'::app_role)
  AND EXISTS (
    SELECT 1 FROM students s
    WHERE s.id = parent_students.student_id
    AND s.school_id = get_user_school_id(auth.uid())
  )
);

-- Fix classes policies that may trigger the recursion via students -> parent_students
DROP POLICY IF EXISTS "Parents can view child classes" ON public.classes;

CREATE POLICY "Parents can view child classes"
ON public.classes
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM students s
    WHERE s.class_id = classes.id
    AND is_parent_of_student(auth.uid(), s.id)
  )
);

-- Fix attendance parent policy
DROP POLICY IF EXISTS "Parents can view child attendance" ON public.attendance;

CREATE POLICY "Parents can view child attendance"
ON public.attendance
FOR SELECT
USING (is_parent_of_student(auth.uid(), student_id));

-- Fix student_payments parent policy
DROP POLICY IF EXISTS "Parents can view child payments" ON public.student_payments;

CREATE POLICY "Parents can view child payments"
ON public.student_payments
FOR SELECT
USING (is_parent_of_student(auth.uid(), student_id));

-- Fix fee_categories parent policy
DROP POLICY IF EXISTS "Parents can view fee categories" ON public.fee_categories;

CREATE POLICY "Parents can view fee categories"
ON public.fee_categories
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM students s
    WHERE s.school_id = fee_categories.school_id
    AND is_parent_of_student(auth.uid(), s.id)
  )
);

-- Fix quran_memorization parent policy
DROP POLICY IF EXISTS "Parents can view child memorization" ON public.quran_memorization;

CREATE POLICY "Parents can view child memorization"
ON public.quran_memorization
FOR SELECT
USING (is_parent_of_student(auth.uid(), student_id));

-- Fix student_subject_results parent policy
DROP POLICY IF EXISTS "Parents can view child subject results" ON public.student_subject_results;

CREATE POLICY "Parents can view child subject results"
ON public.student_subject_results
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM student_term_results str
    WHERE str.id = student_subject_results.term_result_id
    AND is_parent_of_student(auth.uid(), str.student_id)
  )
);

-- Fix student_term_results parent policy
DROP POLICY IF EXISTS "Parents can view child term results" ON public.student_term_results;

CREATE POLICY "Parents can view child term results"
ON public.student_term_results
FOR SELECT
USING (is_parent_of_student(auth.uid(), student_id));

-- Fix students parent policy
DROP POLICY IF EXISTS "Parents can view their linked students" ON public.students;

CREATE POLICY "Parents can view their linked students"
ON public.students
FOR SELECT
USING (is_parent_of_student(auth.uid(), id));
