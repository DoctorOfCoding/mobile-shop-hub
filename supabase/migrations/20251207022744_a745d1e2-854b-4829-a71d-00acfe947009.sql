-- Add created_by column to track who added each customer
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id);

-- Drop existing RLS policies on customers table
DROP POLICY IF EXISTS "Authenticated users can read customers" ON public.customers;
DROP POLICY IF EXISTS "Authenticated users can insert customers" ON public.customers;
DROP POLICY IF EXISTS "Authenticated users can update customers" ON public.customers;
DROP POLICY IF EXISTS "Admins can delete customers" ON public.customers;

-- Admins (managers) can view ALL customer data
CREATE POLICY "Admins can view all customers"
ON public.customers
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Employees can only view customers they created
CREATE POLICY "Users can view own customers"
ON public.customers
FOR SELECT
USING (created_by = auth.uid());

-- Admins can insert customers (created_by set automatically)
CREATE POLICY "Admins can insert customers"
ON public.customers
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin') AND (created_by IS NULL OR created_by = auth.uid()));

-- Employees can insert customers they create
CREATE POLICY "Users can insert own customers"
ON public.customers
FOR INSERT
WITH CHECK (created_by = auth.uid());

-- Admins can update any customer
CREATE POLICY "Admins can update all customers"
ON public.customers
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Employees can only update customers they created
CREATE POLICY "Users can update own customers"
ON public.customers
FOR UPDATE
USING (created_by = auth.uid());

-- Only admins can delete customers
CREATE POLICY "Only admins can delete customers"
ON public.customers
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));