-- Allow authenticated users to insert schools (for registration flow)
DROP POLICY IF EXISTS "Authenticated users can create schools" ON public.schools;
CREATE POLICY "Authenticated users can create schools"
ON public.schools
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow school admins to view their own school
DROP POLICY IF EXISTS "School admins can view their school" ON public.schools;
CREATE POLICY "School admins can view their school"
ON public.schools
FOR SELECT
TO authenticated
USING (id = public.get_user_school_id(auth.uid()));

-- Allow school admins to update their own school
DROP POLICY IF EXISTS "School admins can update their school" ON public.schools;
CREATE POLICY "School admins can update their school"
ON public.schools
FOR UPDATE
TO authenticated
USING (id = public.get_user_school_id(auth.uid()))
WITH CHECK (id = public.get_user_school_id(auth.uid()));