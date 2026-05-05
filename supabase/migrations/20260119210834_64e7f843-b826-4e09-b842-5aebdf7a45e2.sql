-- Create storage bucket for exam passport photos
INSERT INTO storage.buckets (id, name, public) VALUES ('exam-passports', 'exam-passports', true);

-- Allow anyone to upload passport photos
CREATE POLICY "Anyone can upload exam passports"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'exam-passports');

-- Allow anyone to view exam passports
CREATE POLICY "Anyone can view exam passports"
ON storage.objects FOR SELECT
USING (bucket_id = 'exam-passports');