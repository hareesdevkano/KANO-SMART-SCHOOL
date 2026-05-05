
-- RLS: Parents can view attendance for their linked children
CREATE POLICY "Parents can view child attendance"
ON public.attendance
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.parent_students ps
    WHERE ps.parent_id = auth.uid()
      AND ps.student_id = attendance.student_id
  )
);

-- RLS: Parents can view term results for their linked children
CREATE POLICY "Parents can view child term results"
ON public.student_term_results
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.parent_students ps
    WHERE ps.parent_id = auth.uid()
      AND ps.student_id = student_term_results.student_id
  )
);

-- RLS: Parents can view subject results for their linked children
CREATE POLICY "Parents can view child subject results"
ON public.student_subject_results
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.parent_students ps
    JOIN public.student_term_results str ON str.student_id = ps.student_id
    WHERE ps.parent_id = auth.uid()
      AND str.id = student_subject_results.term_result_id
  )
);

-- RLS: Parents can view Quran memorization for their linked children
CREATE POLICY "Parents can view child memorization"
ON public.quran_memorization
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.parent_students ps
    WHERE ps.parent_id = auth.uid()
      AND ps.student_id = quran_memorization.student_id
  )
);

-- RLS: Parents can view students they are linked to
CREATE POLICY "Parents can view their linked students"
ON public.students
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.parent_students ps
    WHERE ps.parent_id = auth.uid()
      AND ps.student_id = students.id
  )
);

-- RLS: Parents can view classes of their linked children
CREATE POLICY "Parents can view child classes"
ON public.classes
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.parent_students ps
    JOIN public.students s ON s.id = ps.student_id
    WHERE ps.parent_id = auth.uid()
      AND s.class_id = classes.id
  )
);
