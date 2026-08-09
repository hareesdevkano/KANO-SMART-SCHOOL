CREATE OR REPLACE FUNCTION public.register_school(_school_name text, _school_type public.school_type, _email text, _phone text, _address text, _city text, _state text, _admin_user_id uuid, _admin_name text, _admin_phone text, _memorization_enabled boolean DEFAULT false)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _school_id uuid;
  _caller_id uuid := auth.uid();
BEGIN
  IF _caller_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  IF _admin_user_id IS DISTINCT FROM _caller_id THEN
    RAISE EXCEPTION 'Cannot register a school for another user';
  END IF;

  INSERT INTO public.schools (name, school_type, email, phone, address, city, state, status, subscription_plan)
  VALUES (_school_name, _school_type, _email, _phone, _address, _city, _state, 'pending', 'free')
  RETURNING id INTO _school_id;

  UPDATE public.profiles
  SET school_id = _school_id,
      full_name = _admin_name,
      phone = _admin_phone,
      updated_at = now()
  WHERE id = _caller_id;

  INSERT INTO public.user_roles (user_id, role, school_id)
  VALUES (_caller_id, 'school_admin', _school_id)
  ON CONFLICT (user_id, role, school_id) DO NOTHING;

  INSERT INTO public.school_modules (school_id, memorization_tracking_enabled)
  VALUES (_school_id, _memorization_enabled);

  RETURN _school_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.assign_user_role(_user_id uuid, _role public.app_role, _school_id uuid DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'super_admin') THEN
    RAISE EXCEPTION 'Only super administrators can assign roles';
  END IF;

  INSERT INTO public.user_roles (user_id, role, school_id)
  VALUES (_user_id, _role, _school_id)
  ON CONFLICT (user_id, role, school_id) DO NOTHING;
END;
$$;

CREATE OR REPLACE FUNCTION public.link_profile_to_school(_user_id uuid, _school_id uuid, _full_name text DEFAULT NULL, _phone text DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'super_admin') THEN
    RAISE EXCEPTION 'Only super administrators can link profiles to schools';
  END IF;

  UPDATE public.profiles
  SET school_id = _school_id,
      full_name = COALESCE(_full_name, full_name),
      phone = COALESCE(_phone, phone)
  WHERE id = _user_id;
END;
$$;

REVOKE ALL ON FUNCTION public.assign_user_role(uuid, public.app_role, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.assign_user_role(uuid, public.app_role, uuid) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.link_profile_to_school(uuid, uuid, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.link_profile_to_school(uuid, uuid, text, text) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.register_school(text, public.school_type, text, text, text, text, text, uuid, text, text, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.register_school(text, public.school_type, text, text, text, text, text, uuid, text, text, boolean) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.create_school_modules(uuid, boolean) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_school_modules(uuid, boolean) TO service_role;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_updated_at_column() TO service_role;