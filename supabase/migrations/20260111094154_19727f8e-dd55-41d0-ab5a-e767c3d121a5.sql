-- Create a SECURITY DEFINER function to handle the entire school registration
-- This bypasses RLS since it runs with elevated privileges
CREATE OR REPLACE FUNCTION public.register_school(
  _school_name TEXT,
  _school_type school_type,
  _email TEXT,
  _phone TEXT,
  _address TEXT,
  _city TEXT,
  _state TEXT,
  _admin_user_id UUID,
  _admin_name TEXT,
  _admin_phone TEXT,
  _memorization_enabled BOOLEAN DEFAULT FALSE
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _school_id UUID;
BEGIN
  -- 1. Create the school record
  INSERT INTO schools (name, school_type, email, phone, address, city, state, status, subscription_plan)
  VALUES (_school_name, _school_type, _email, _phone, _address, _city, _state, 'pending', 'free')
  RETURNING id INTO _school_id;

  -- 2. Update the user's profile with school_id
  UPDATE profiles
  SET school_id = _school_id,
      full_name = _admin_name,
      phone = _admin_phone,
      updated_at = NOW()
  WHERE id = _admin_user_id;

  -- 3. Assign school_admin role
  INSERT INTO user_roles (user_id, role, school_id)
  VALUES (_admin_user_id, 'school_admin', _school_id)
  ON CONFLICT (user_id, role) DO UPDATE SET school_id = _school_id;

  -- 4. Create default school modules
  INSERT INTO school_modules (school_id, memorization_enabled)
  VALUES (_school_id, _memorization_enabled);

  RETURN _school_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.register_school TO authenticated;