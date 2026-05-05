-- Drop all CBT-related tables and disable cbt module flag
DROP TABLE IF EXISTS public.exam_answers CASCADE;
DROP TABLE IF EXISTS public.exam_sessions CASCADE;
DROP TABLE IF EXISTS public.exam_questions CASCADE;
DROP TABLE IF EXISTS public.exam_candidates CASCADE;

ALTER TABLE public.school_modules DROP COLUMN IF EXISTS cbt_enabled;