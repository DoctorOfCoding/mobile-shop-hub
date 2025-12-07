-- =====================================================
-- SECURE ALL TABLES WITH AUTHENTICATION-REQUIRED RLS
-- =====================================================

-- 1. DROP ALL EXISTING PUBLIC ACCESS POLICIES
-- Customers table
DROP POLICY IF EXISTS "Allow public delete access on customers" ON public.customers;
DROP POLICY IF EXISTS "Allow public insert access on customers" ON public.customers;
DROP POLICY IF EXISTS "Allow public read access on customers" ON public.customers;
DROP POLICY IF EXISTS "Allow public update access on customers" ON public.customers;

-- Products table
DROP POLICY IF EXISTS "Allow public delete access" ON public.products;
DROP POLICY IF EXISTS "Allow public insert access" ON public.products;
DROP POLICY IF EXISTS "Allow public read access" ON public.products;
DROP POLICY IF EXISTS "Allow public update access" ON public.products;

-- Repairs table
DROP POLICY IF EXISTS "Allow public delete access on repairs" ON public.repairs;
DROP POLICY IF EXISTS "Allow public insert access on repairs" ON public.repairs;
DROP POLICY IF EXISTS "Allow public read access on repairs" ON public.repairs;
DROP POLICY IF EXISTS "Allow public update access on repairs" ON public.repairs;

-- Sales table
DROP POLICY IF EXISTS "Allow public delete access on sales" ON public.sales;
DROP POLICY IF EXISTS "Allow public insert access on sales" ON public.sales;
DROP POLICY IF EXISTS "Allow public read access on sales" ON public.sales;
DROP POLICY IF EXISTS "Allow public update access on sales" ON public.sales;

-- Sale items table
DROP POLICY IF EXISTS "Allow public insert access on sale_items" ON public.sale_items;
DROP POLICY IF EXISTS "Allow public read access on sale_items" ON public.sale_items;

-- Shop settings table
DROP POLICY IF EXISTS "Allow public insert access on shop_settings" ON public.shop_settings;
DROP POLICY IF EXISTS "Allow public read access on shop_settings" ON public.shop_settings;
DROP POLICY IF EXISTS "Allow public update access on shop_settings" ON public.shop_settings;

-- Used phones table
DROP POLICY IF EXISTS "Allow public delete access on used_phones" ON public.used_phones;
DROP POLICY IF EXISTS "Allow public insert access on used_phones" ON public.used_phones;
DROP POLICY IF EXISTS "Allow public read access on used_phones" ON public.used_phones;
DROP POLICY IF EXISTS "Allow public update access on used_phones" ON public.used_phones;

-- =====================================================
-- 2. CREATE NEW AUTHENTICATION-REQUIRED POLICIES
-- =====================================================

-- CUSTOMERS TABLE: Authenticated users can read, admins have full access
CREATE POLICY "Authenticated users can read customers"
ON public.customers FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert customers"
ON public.customers FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update customers"
ON public.customers FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Admins can delete customers"
ON public.customers FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- PRODUCTS TABLE: Authenticated users can read/insert/update, admins can delete
CREATE POLICY "Authenticated users can read products"
ON public.products FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert products"
ON public.products FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update products"
ON public.products FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Admins can delete products"
ON public.products FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- REPAIRS TABLE: Authenticated users can read/insert/update, admins can delete
CREATE POLICY "Authenticated users can read repairs"
ON public.repairs FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert repairs"
ON public.repairs FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update repairs"
ON public.repairs FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Admins can delete repairs"
ON public.repairs FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- SALES TABLE: Authenticated users can read/insert/update, admins can delete
CREATE POLICY "Authenticated users can read sales"
ON public.sales FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert sales"
ON public.sales FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update sales"
ON public.sales FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Admins can delete sales"
ON public.sales FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- SALE_ITEMS TABLE: Authenticated users can read/insert, admins can update/delete
CREATE POLICY "Authenticated users can read sale_items"
ON public.sale_items FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert sale_items"
ON public.sale_items FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Admins can update sale_items"
ON public.sale_items FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete sale_items"
ON public.sale_items FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- SHOP_SETTINGS TABLE: Authenticated users can read, admins can insert/update/delete
CREATE POLICY "Authenticated users can read shop_settings"
ON public.shop_settings FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can insert shop_settings"
ON public.shop_settings FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update shop_settings"
ON public.shop_settings FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete shop_settings"
ON public.shop_settings FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- USED_PHONES TABLE: Authenticated users can read/insert/update, admins can delete
CREATE POLICY "Authenticated users can read used_phones"
ON public.used_phones FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert used_phones"
ON public.used_phones FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update used_phones"
ON public.used_phones FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Admins can delete used_phones"
ON public.used_phones FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));