-- Drop the existing restrictive insert policy
DROP POLICY IF EXISTS "Anyone can register a school" ON public.schools;

-- Create a permissive insert policy for school registration
CREATE POLICY "Anyone can register a school"
ON public.schools
FOR INSERT
TO public
WITH CHECK (true);

-- Also need to allow newly created user to select their own school
DROP POLICY IF EXISTS "Users can view their registered school" ON public.schools;
CREATE POLICY "Users can view their registered school"
ON public.schools
FOR SELECT
TO authenticated
USING (
  id IN (SELECT school_id FROM public.user_roles WHERE user_id = auth.uid())
  OR id IN (SELECT school_id FROM public.profiles WHERE id = auth.uid())
);