-- Allow super admins to view all schools (already exists but let's make sure it's permissive)
DROP POLICY IF EXISTS "Super admins can view all schools" ON public.schools;
CREATE POLICY "Super admins can view all schools"
ON public.schools
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'super_admin'));

-- Allow super admins to view all user_roles
DROP POLICY IF EXISTS "Super admins can view all user_roles" ON public.user_roles;
CREATE POLICY "Super admins can view all user_roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'super_admin'));

-- Allow school admins to view their own role (in addition to existing policy)
DROP POLICY IF EXISTS "School admins can view their roles" ON public.user_roles;
CREATE POLICY "School admins can view their roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());