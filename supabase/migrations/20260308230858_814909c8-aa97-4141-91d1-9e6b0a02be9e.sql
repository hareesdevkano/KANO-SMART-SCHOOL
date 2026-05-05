
-- Notifications table
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  title text NOT NULL,
  message text,
  type text DEFAULT 'general',
  is_read boolean DEFAULT false,
  link text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can update (mark as read) their own notifications
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- School admins can create notifications for their school
CREATE POLICY "School admins can create notifications"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (
    has_role(auth.uid(), 'school_admin') AND school_id = get_user_school_id(auth.uid())
  );

-- Super admins can manage all notifications
CREATE POLICY "Super admins can manage notifications"
  ON public.notifications FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'super_admin'));

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- RLS for parents to view fee categories of their children's school
CREATE POLICY "Parents can view fee categories"
  ON public.fee_categories FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM parent_students ps
      JOIN students s ON s.id = ps.student_id
      WHERE ps.parent_id = auth.uid() AND s.school_id = fee_categories.school_id
    )
  );

-- RLS for parents to view payments for their children
CREATE POLICY "Parents can view child payments"
  ON public.student_payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM parent_students ps
      WHERE ps.parent_id = auth.uid() AND ps.student_id = student_payments.student_id
    )
  );

-- School admins can manage school modules
CREATE POLICY "School admins can manage their modules"
  ON public.school_modules FOR ALL
  TO authenticated
  USING (
    has_role(auth.uid(), 'school_admin') AND school_id = get_user_school_id(auth.uid())
  );
