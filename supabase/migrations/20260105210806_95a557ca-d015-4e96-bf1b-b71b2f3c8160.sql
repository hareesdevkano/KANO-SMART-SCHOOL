-- Create a function to assign roles during registration (with security definer)
CREATE OR REPLACE FUNCTION public.assign_user_role(
  _user_id uuid,
  _role app_role,
  _school_id uuid DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role, school_id)
  VALUES (_user_id, _role, _school_id);
END;
$$;

-- Create a function to update profile with school_id during registration
CREATE OR REPLACE FUNCTION public.link_profile_to_school(
  _user_id uuid,
  _school_id uuid,
  _full_name text DEFAULT NULL,
  _phone text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET school_id = _school_id,
      full_name = COALESCE(_full_name, full_name),
      phone = COALESCE(_phone, phone)
  WHERE id = _user_id;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.assign_user_role TO authenticated;
GRANT EXECUTE ON FUNCTION public.link_profile_to_school TO authenticated;