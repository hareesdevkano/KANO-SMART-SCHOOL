-- Create teacher_classes junction table for assigning classes to teachers
CREATE TABLE public.teacher_classes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    is_class_teacher BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(teacher_id, class_id)
);

-- Enable RLS
ALTER TABLE public.teacher_classes ENABLE ROW LEVEL SECURITY;

-- School admins can manage teacher-class assignments
CREATE POLICY "School admins can manage teacher classes"
ON public.teacher_classes FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.teachers t
        WHERE t.id = teacher_id
        AND t.school_id IN (
            SELECT ur.school_id FROM public.user_roles ur
            WHERE ur.user_id = auth.uid() AND ur.role = 'school_admin'
        )
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.teachers t
        WHERE t.id = teacher_id
        AND t.school_id IN (
            SELECT ur.school_id FROM public.user_roles ur
            WHERE ur.user_id = auth.uid() AND ur.role = 'school_admin'
        )
    )
);

-- Teachers can view their own class assignments
CREATE POLICY "Teachers can view their class assignments"
ON public.teacher_classes FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.teachers t
        WHERE t.id = teacher_id AND t.user_id = auth.uid()
    )
);

-- Update RLS on students table to allow teachers to insert students into their assigned classes
CREATE POLICY "Teachers can insert students in assigned classes"
ON public.students FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.teacher_classes tc
        JOIN public.teachers t ON t.id = tc.teacher_id
        WHERE tc.class_id = students.class_id
        AND t.user_id = auth.uid()
    )
);

-- Teachers can view students in their assigned classes
CREATE POLICY "Teachers can view students in assigned classes"
ON public.students FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.teacher_classes tc
        JOIN public.teachers t ON t.id = tc.teacher_id
        WHERE tc.class_id = students.class_id
        AND t.user_id = auth.uid()
    )
);

-- Teachers can update students in their assigned classes
CREATE POLICY "Teachers can update students in assigned classes"
ON public.students FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.teacher_classes tc
        JOIN public.teachers t ON t.id = tc.teacher_id
        WHERE tc.class_id = students.class_id
        AND t.user_id = auth.uid()
    )
);