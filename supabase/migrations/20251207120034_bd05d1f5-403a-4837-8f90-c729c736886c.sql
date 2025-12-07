-- Update RLS policies: Only admins can update customers
DROP POLICY IF EXISTS "Users can update own customers" ON public.customers;

-- Ensure only admins can update customers  
DROP POLICY IF EXISTS "Admins can update all customers" ON public.customers;
CREATE POLICY "Only admins can update customers" 
ON public.customers 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Note: Delete policy already restricts to admin only