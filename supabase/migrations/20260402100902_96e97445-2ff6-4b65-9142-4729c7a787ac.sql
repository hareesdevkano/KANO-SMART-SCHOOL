
-- Add display settings to schools table
ALTER TABLE public.schools 
  ADD COLUMN IF NOT EXISTS show_average boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_position boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_grade boolean DEFAULT true;

-- Create student registration tokens table
CREATE TABLE public.student_registration_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
  token text NOT NULL UNIQUE,
  is_used boolean DEFAULT false,
  used_at timestamptz,
  used_by_name text,
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  max_uses integer DEFAULT 1,
  current_uses integer DEFAULT 0
);

ALTER TABLE public.student_registration_tokens ENABLE ROW LEVEL SECURITY;

-- Super admins can manage all registration tokens
CREATE POLICY "Super admins can manage registration tokens"
  ON public.student_registration_tokens FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

-- School admins can view their tokens
CREATE POLICY "School admins can view registration tokens"
  ON public.student_registration_tokens FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'school_admin') AND school_id = public.get_user_school_id(auth.uid()));

-- Anyone can validate tokens (for registration form)
CREATE POLICY "Anyone can validate registration tokens"
  ON public.student_registration_tokens FOR SELECT
  TO public
  USING (true);

-- Token usage update
CREATE POLICY "Registration token usage update"
  ON public.student_registration_tokens FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);
