-- Create enums for flexible school configuration
CREATE TYPE public.school_type AS ENUM (
  'nursery_primary',
  'secondary',
  'islamiyya',
  'tahfiz',
  'college_of_education',
  'polytechnic',
  'university',
  'vocational',
  'adult_education'
);

CREATE TYPE public.academic_structure AS ENUM (
  'term_based',
  'semester_based',
  'continuous',
  'course_based'
);

CREATE TYPE public.assessment_style AS ENUM (
  'exam_based',
  'oral_based',
  'memorization_based',
  'mixed',
  'skill_based'
);

CREATE TYPE public.grading_system AS ENUM (
  'percentage',
  'gpa',
  'cgpa',
  'descriptive',
  'level_based'
);

CREATE TYPE public.school_status AS ENUM (
  'pending',
  'approved',
  'suspended',
  'expired'
);

CREATE TYPE public.subscription_plan AS ENUM (
  'free',
  'basic',
  'premium',
  'enterprise'
);

CREATE TYPE public.app_role AS ENUM (
  'super_admin',
  'school_admin',
  'teacher',
  'student',
  'parent'
);

-- Schools table
CREATE TABLE public.schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  school_type school_type NOT NULL DEFAULT 'secondary',
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'Nigeria',
  logo_url TEXT,
  status school_status DEFAULT 'pending',
  subscription_plan subscription_plan DEFAULT 'free',
  subscription_expires_at TIMESTAMPTZ,
  trial_ends_at TIMESTAMPTZ DEFAULT (now() + interval '14 days'),
  academic_structure academic_structure DEFAULT 'term_based',
  assessment_style assessment_style DEFAULT 'exam_based',
  grading_system grading_system DEFAULT 'percentage',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- School modules configuration
CREATE TABLE public.school_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
  cbt_enabled BOOLEAN DEFAULT true,
  parent_portal_enabled BOOLEAN DEFAULT true,
  fees_management_enabled BOOLEAN DEFAULT true,
  memorization_tracking_enabled BOOLEAN DEFAULT false,
  attendance_enabled BOOLEAN DEFAULT true,
  library_enabled BOOLEAN DEFAULT false,
  hostel_enabled BOOLEAN DEFAULT false,
  transport_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(school_id)
);

-- User profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- User roles table (security best practice - separate from profiles)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role, school_id)
);

-- Academic levels (flexible class naming)
CREATE TABLE public.academic_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Classes/Arms
CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
  level_id UUID REFERENCES public.academic_levels(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  capacity INTEGER DEFAULT 40,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Academic sessions
CREATE TABLE public.academic_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Terms/Semesters
CREATE TABLE public.academic_terms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
  session_id UUID REFERENCES public.academic_sessions(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Subjects
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  code TEXT,
  category TEXT,
  is_islamic BOOLEAN DEFAULT false,
  is_vocational BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Students
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
  class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
  registration_number TEXT,
  admission_date DATE DEFAULT CURRENT_DATE,
  guardian_name TEXT,
  guardian_phone TEXT,
  guardian_email TEXT,
  date_of_birth DATE,
  gender TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Teachers
CREATE TABLE public.teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
  employee_id TEXT,
  qualification TEXT,
  specialization TEXT,
  date_joined DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Qur'an Memorization Tracking (for Islamiyya/Tahfiz schools)
CREATE TABLE public.quran_memorization (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
  surah_number INTEGER,
  surah_name TEXT,
  juz_number INTEGER,
  hizb_number INTEGER,
  verses_from INTEGER,
  verses_to INTEGER,
  memorization_date DATE DEFAULT CURRENT_DATE,
  revision_date DATE,
  status TEXT DEFAULT 'in_progress',
  teacher_verified BOOLEAN DEFAULT false,
  teacher_id UUID REFERENCES public.teachers(id),
  teacher_remarks TEXT,
  quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Attendance
CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'present',
  remarks TEXT,
  recorded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Assessments/Exams
CREATE TABLE public.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  term_id UUID REFERENCES public.academic_terms(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  assessment_type TEXT DEFAULT 'exam',
  max_score DECIMAL DEFAULT 100,
  is_oral BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Student scores
CREATE TABLE public.student_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID REFERENCES public.assessments(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  score DECIMAL,
  remarks TEXT,
  recorded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Fee categories
CREATE TABLE public.fee_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Student payments
CREATE TABLE public.student_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  fee_category_id UUID REFERENCES public.fee_categories(id) ON DELETE SET NULL,
  amount DECIMAL NOT NULL,
  payment_date DATE DEFAULT CURRENT_DATE,
  payment_method TEXT,
  reference TEXT,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Announcements
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  target_roles TEXT[],
  is_published BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Platform analytics (for super admin)
CREATE TABLE public.platform_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE DEFAULT CURRENT_DATE,
  total_schools INTEGER DEFAULT 0,
  active_schools INTEGER DEFAULT 0,
  total_students INTEGER DEFAULT 0,
  total_teachers INTEGER DEFAULT 0,
  total_revenue DECIMAL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quran_memorization ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_analytics ENABLE ROW LEVEL SECURITY;

-- Security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to get user's school_id
CREATE OR REPLACE FUNCTION public.get_user_school_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT school_id FROM public.profiles WHERE id = _user_id
$$;

-- Handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', '')
  );
  RETURN NEW;
END;
$$;

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Update triggers
CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON public.schools FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON public.teachers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies

-- Schools: Public can view approved schools for registration
CREATE POLICY "Anyone can view approved schools" ON public.schools FOR SELECT USING (status = 'approved');
CREATE POLICY "Super admins can manage all schools" ON public.schools FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "School admins can view their school" ON public.schools FOR SELECT USING (id = public.get_user_school_id(auth.uid()));
CREATE POLICY "Anyone can register a school" ON public.schools FOR INSERT WITH CHECK (true);

-- Profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Super admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'super_admin'));

-- User roles
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Super admins can manage all roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));

-- School modules
CREATE POLICY "School members can view their modules" ON public.school_modules FOR SELECT USING (school_id = public.get_user_school_id(auth.uid()));
CREATE POLICY "Super admins can manage all modules" ON public.school_modules FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));

-- Academic levels, classes, sessions, terms, subjects (school-specific)
CREATE POLICY "School members can view academic levels" ON public.academic_levels FOR SELECT USING (school_id = public.get_user_school_id(auth.uid()));
CREATE POLICY "School admins can manage academic levels" ON public.academic_levels FOR ALL USING (public.has_role(auth.uid(), 'school_admin') AND school_id = public.get_user_school_id(auth.uid()));

CREATE POLICY "School members can view classes" ON public.classes FOR SELECT USING (school_id = public.get_user_school_id(auth.uid()));
CREATE POLICY "School admins can manage classes" ON public.classes FOR ALL USING (public.has_role(auth.uid(), 'school_admin') AND school_id = public.get_user_school_id(auth.uid()));

CREATE POLICY "School members can view sessions" ON public.academic_sessions FOR SELECT USING (school_id = public.get_user_school_id(auth.uid()));
CREATE POLICY "School admins can manage sessions" ON public.academic_sessions FOR ALL USING (public.has_role(auth.uid(), 'school_admin') AND school_id = public.get_user_school_id(auth.uid()));

CREATE POLICY "School members can view terms" ON public.academic_terms FOR SELECT USING (school_id = public.get_user_school_id(auth.uid()));
CREATE POLICY "School admins can manage terms" ON public.academic_terms FOR ALL USING (public.has_role(auth.uid(), 'school_admin') AND school_id = public.get_user_school_id(auth.uid()));

CREATE POLICY "School members can view subjects" ON public.subjects FOR SELECT USING (school_id = public.get_user_school_id(auth.uid()));
CREATE POLICY "School admins can manage subjects" ON public.subjects FOR ALL USING (public.has_role(auth.uid(), 'school_admin') AND school_id = public.get_user_school_id(auth.uid()));

-- Students
CREATE POLICY "School members can view students" ON public.students FOR SELECT USING (school_id = public.get_user_school_id(auth.uid()));
CREATE POLICY "School admins can manage students" ON public.students FOR ALL USING (public.has_role(auth.uid(), 'school_admin') AND school_id = public.get_user_school_id(auth.uid()));

-- Teachers
CREATE POLICY "School members can view teachers" ON public.teachers FOR SELECT USING (school_id = public.get_user_school_id(auth.uid()));
CREATE POLICY "School admins can manage teachers" ON public.teachers FOR ALL USING (public.has_role(auth.uid(), 'school_admin') AND school_id = public.get_user_school_id(auth.uid()));

-- Qur'an memorization
CREATE POLICY "School members can view memorization" ON public.quran_memorization FOR SELECT USING (school_id = public.get_user_school_id(auth.uid()));
CREATE POLICY "Teachers can manage memorization" ON public.quran_memorization FOR ALL USING (public.has_role(auth.uid(), 'teacher') AND school_id = public.get_user_school_id(auth.uid()));

-- Attendance
CREATE POLICY "School members can view attendance" ON public.attendance FOR SELECT USING (school_id = public.get_user_school_id(auth.uid()));
CREATE POLICY "Teachers can manage attendance" ON public.attendance FOR ALL USING (public.has_role(auth.uid(), 'teacher') AND school_id = public.get_user_school_id(auth.uid()));

-- Assessments
CREATE POLICY "School members can view assessments" ON public.assessments FOR SELECT USING (school_id = public.get_user_school_id(auth.uid()));
CREATE POLICY "Teachers can manage assessments" ON public.assessments FOR ALL USING (public.has_role(auth.uid(), 'teacher') AND school_id = public.get_user_school_id(auth.uid()));

-- Student scores
CREATE POLICY "Students can view their scores" ON public.student_scores FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.students WHERE students.id = student_scores.student_id AND students.user_id = auth.uid())
);
CREATE POLICY "Teachers can manage scores" ON public.student_scores FOR ALL USING (
  EXISTS (SELECT 1 FROM public.assessments WHERE assessments.id = student_scores.assessment_id AND assessments.school_id = public.get_user_school_id(auth.uid()))
);

-- Fees
CREATE POLICY "School members can view fee categories" ON public.fee_categories FOR SELECT USING (school_id = public.get_user_school_id(auth.uid()));
CREATE POLICY "School admins can manage fees" ON public.fee_categories FOR ALL USING (public.has_role(auth.uid(), 'school_admin') AND school_id = public.get_user_school_id(auth.uid()));

CREATE POLICY "School members can view payments" ON public.student_payments FOR SELECT USING (school_id = public.get_user_school_id(auth.uid()));
CREATE POLICY "School admins can manage payments" ON public.student_payments FOR ALL USING (public.has_role(auth.uid(), 'school_admin') AND school_id = public.get_user_school_id(auth.uid()));

-- Announcements
CREATE POLICY "School members can view announcements" ON public.announcements FOR SELECT USING (school_id = public.get_user_school_id(auth.uid()) AND is_published = true);
CREATE POLICY "School admins can manage announcements" ON public.announcements FOR ALL USING (public.has_role(auth.uid(), 'school_admin') AND school_id = public.get_user_school_id(auth.uid()));

-- Platform analytics (super admin only)
CREATE POLICY "Super admins can view analytics" ON public.platform_analytics FOR SELECT USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Super admins can manage analytics" ON public.platform_analytics FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));