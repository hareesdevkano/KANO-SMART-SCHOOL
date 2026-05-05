
-- Add activation fields to exam_candidates
ALTER TABLE public.exam_candidates 
ADD COLUMN IF NOT EXISTS is_activated boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS activation_key text DEFAULT null,
ADD COLUMN IF NOT EXISTS activated_at timestamp with time zone DEFAULT null;

-- Allow candidates to update their own activation (for entering keys)
CREATE POLICY "Candidates can update activation" ON public.exam_candidates
FOR UPDATE USING (true) WITH CHECK (true);
