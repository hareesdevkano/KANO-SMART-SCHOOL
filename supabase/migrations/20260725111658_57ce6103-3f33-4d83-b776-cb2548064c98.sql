
CREATE POLICY "Super admins can view all students" ON public.students
  FOR SELECT USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can view all term results" ON public.student_term_results
  FOR SELECT USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can view all subject results" ON public.student_subject_results
  FOR SELECT USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can view all classes" ON public.classes
  FOR SELECT USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can view all sessions" ON public.academic_sessions
  FOR SELECT USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can view all terms" ON public.academic_terms
  FOR SELECT USING (public.has_role(auth.uid(), 'super_admin'));
