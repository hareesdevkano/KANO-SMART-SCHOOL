-- The issue: during registration, the user just signed up but their profile isn't linked to the school yet
-- We need to allow the security definer functions to bypass RLS for the registration flow

-- Drop conflicting policies on schools table
DROP POLICY IF EXISTS "Anyone can register a school" ON public.schools;
DROP POLICY IF EXISTS "Authenticated users can create schools" ON public.schools;

-- Allow any authenticated user to create a school during registration
CREATE POLICY "Users can register a school"
ON public.schools
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Fix school_modules: allow insert during registration when user just created the school
DROP POLICY IF EXISTS "School admins can create their school modules" ON public.school_modules;
CREATE POLICY "Users can create school modules during registration"
ON public.school_modules
FOR INSERT
TO authenticated
WITH CHECK (true);