DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'exam_candidates'
      AND policyname = 'Super admins can manage exam candidates'
  ) THEN
    CREATE POLICY "Super admins can manage exam candidates"
    ON public.exam_candidates
    FOR ALL
    TO authenticated
    USING (public.has_role(auth.uid(), 'super_admin'::public.app_role))
    WITH CHECK (public.has_role(auth.uid(), 'super_admin'::public.app_role));
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'exam_sessions'
      AND policyname = 'Super admins can view exam sessions'
  ) THEN
    CREATE POLICY "Super admins can view exam sessions"
    ON public.exam_sessions
    FOR SELECT
    TO authenticated
    USING (public.has_role(auth.uid(), 'super_admin'::public.app_role));
  END IF;
END
$$;