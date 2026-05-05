-- Add policy to allow school admins to insert modules for their school
CREATE POLICY "School admins can create their school modules"
ON public.school_modules
FOR INSERT
WITH CHECK (
  school_id = get_user_school_id(auth.uid()) OR
  has_role(auth.uid(), 'super_admin')
);

-- Create a security definer function to insert school modules during registration
CREATE OR REPLACE FUNCTION public.create_school_modules(_school_id uuid, _memorization_enabled boolean DEFAULT false)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.school_modules (school_id, memorization_tracking_enabled)
  VALUES (_school_id, _memorization_enabled);
END;
$$;