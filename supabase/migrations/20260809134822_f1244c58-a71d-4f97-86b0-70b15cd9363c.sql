-- 1. Remove overly permissive insert policies (registration now only via register_school RPC)
DROP POLICY IF EXISTS "Users can register a school" ON public.schools;
DROP POLICY IF EXISTS "Users can create school modules during registration" ON public.school_modules;

-- 2. Harden register_school with input validation and abuse checks
CREATE OR REPLACE FUNCTION public.register_school(_school_name text, _school_type school_type, _email text, _phone text, _address text, _city text, _state text, _admin_user_id uuid, _admin_name text, _admin_phone text, _memorization_enabled boolean DEFAULT false)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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

  -- Input validation
  IF _school_name IS NULL OR length(btrim(_school_name)) < 2 OR length(btrim(_school_name)) > 200 THEN
    RAISE EXCEPTION 'School name must be between 2 and 200 characters';
  END IF;

  IF _email IS NULL OR _email !~* '^[A-Za-z0-9._%%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' OR length(_email) > 255 THEN
    RAISE EXCEPTION 'A valid school email is required';
  END IF;

  IF _phone IS NOT NULL AND _phone <> '' AND _phone !~ '^\+?[0-9 ()-]{7,20}$' THEN
    RAISE EXCEPTION 'A valid school phone number is required';
  END IF;

  IF _admin_phone IS NOT NULL AND _admin_phone <> '' AND _admin_phone !~ '^\+?[0-9 ()-]{7,20}$' THEN
    RAISE EXCEPTION 'A valid administrator phone number is required';
  END IF;

  IF _admin_name IS NOT NULL AND length(_admin_name) > 200 THEN
    RAISE EXCEPTION 'Administrator name is too long';
  END IF;

  IF _address IS NOT NULL AND length(_address) > 500 THEN
    RAISE EXCEPTION 'Address is too long';
  END IF;

  IF _city IS NOT NULL AND length(_city) > 100 THEN
    RAISE EXCEPTION 'City is too long';
  END IF;

  IF _state IS NOT NULL AND length(_state) > 100 THEN
    RAISE EXCEPTION 'State is too long';
  END IF;

  -- Abuse / duplication checks
  IF EXISTS (SELECT 1 FROM public.schools WHERE lower(email) = lower(btrim(_email))) THEN
    RAISE EXCEPTION 'A school with this email is already registered';
  END IF;

  IF EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _caller_id AND role = 'school_admin') THEN
    RAISE EXCEPTION 'You already have a school registered';
  END IF;

  INSERT INTO public.schools (name, school_type, email, phone, address, city, state, status, subscription_plan)
  VALUES (btrim(_school_name), _school_type, lower(btrim(_email)), _phone, _address, _city, _state, 'pending', 'free')
  RETURNING id INTO _school_id;

  UPDATE public.profiles
  SET school_id = _school_id,
      full_name = COALESCE(_admin_name, full_name),
      phone = COALESCE(_admin_phone, phone),
      updated_at = now()
  WHERE id = _caller_id;

  INSERT INTO public.user_roles (user_id, role, school_id)
  VALUES (_caller_id, 'school_admin', _school_id)
  ON CONFLICT (user_id, role, school_id) DO NOTHING;

  INSERT INTO public.school_modules (school_id, memorization_tracking_enabled)
  VALUES (_school_id, _memorization_enabled);

  RETURN _school_id;
END;
$function$;

-- 3. Student / parent read access
DROP POLICY IF EXISTS "Students can view their own record" ON public.students;
CREATE POLICY "Students can view their own record"
ON public.students FOR SELECT TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Students can view their own memorization" ON public.quran_memorization;
CREATE POLICY "Students can view their own memorization"
ON public.quran_memorization FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.students s WHERE s.id = quran_memorization.student_id AND s.user_id = auth.uid()));

DROP POLICY IF EXISTS "Parents can view child scores" ON public.student_scores;
CREATE POLICY "Parents can view child scores"
ON public.student_scores FOR SELECT TO authenticated
USING (public.is_parent_of_student(auth.uid(), student_id));

DROP POLICY IF EXISTS "Students can view their class timetable" ON public.timetable;
CREATE POLICY "Students can view their class timetable"
ON public.timetable FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.students s WHERE s.class_id = timetable.class_id AND s.user_id = auth.uid()));

DROP POLICY IF EXISTS "Parents can view child timetable" ON public.timetable;
CREATE POLICY "Parents can view child timetable"
ON public.timetable FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.students s WHERE s.class_id = timetable.class_id AND public.is_parent_of_student(auth.uid(), s.id)));
