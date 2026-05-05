-- Create storage bucket for school logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('school-logos', 'school-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow school admins to upload logos
CREATE POLICY "School admins can upload logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'school-logos'
  AND has_role(auth.uid(), 'school_admin'::app_role)
);

-- Allow school admins to update logos
CREATE POLICY "School admins can update logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'school-logos'
  AND has_role(auth.uid(), 'school_admin'::app_role)
);

-- Allow school admins to delete logos
CREATE POLICY "School admins can delete logos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'school-logos'
  AND has_role(auth.uid(), 'school_admin'::app_role)
);

-- Public read access
CREATE POLICY "Anyone can view school logos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'school-logos');