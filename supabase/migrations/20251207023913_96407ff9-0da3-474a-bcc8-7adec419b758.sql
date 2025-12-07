-- Fix storage bucket policies for product-images
-- Remove existing overly permissive policies
DROP POLICY IF EXISTS "Public upload access for product images" ON storage.objects;
DROP POLICY IF EXISTS "Public update access for product images" ON storage.objects;
DROP POLICY IF EXISTS "Public delete access for product images" ON storage.objects;

-- Keep public read access (this is fine for product images)
-- Policy "Public read access for product images" remains unchanged

-- Create secure upload policy - only authenticated users can upload
CREATE POLICY "Authenticated users can upload product images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- Create secure update policy - only authenticated users can update
CREATE POLICY "Authenticated users can update product images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images');

-- Create secure delete policy - only admins can delete
CREATE POLICY "Admins can delete product images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));