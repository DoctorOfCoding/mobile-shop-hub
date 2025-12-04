-- Customers table
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  total_purchases INTEGER DEFAULT 0,
  total_spent NUMERIC DEFAULT 0,
  total_repairs INTEGER DEFAULT 0,
  last_visit DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on customers" ON public.customers FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on customers" ON public.customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on customers" ON public.customers FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on customers" ON public.customers FOR DELETE USING (true);

-- Repairs table
CREATE TABLE public.repairs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  device_model TEXT NOT NULL,
  imei TEXT,
  problem TEXT NOT NULL,
  estimated_cost NUMERIC DEFAULT 0,
  advance_payment NUMERIC DEFAULT 0,
  final_cost NUMERIC,
  technician TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'delivered')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.repairs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on repairs" ON public.repairs FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on repairs" ON public.repairs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on repairs" ON public.repairs FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on repairs" ON public.repairs FOR DELETE USING (true);

-- Used phones table
CREATE TABLE public.used_phones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_id TEXT NOT NULL UNIQUE,
  model TEXT NOT NULL,
  imei TEXT NOT NULL,
  condition TEXT NOT NULL CHECK (condition IN ('excellent', 'good', 'fair', 'poor')),
  purchase_price NUMERIC NOT NULL DEFAULT 0,
  expected_selling_price NUMERIC NOT NULL DEFAULT 0,
  actual_selling_price NUMERIC,
  purchased_from TEXT NOT NULL,
  purchased_at DATE NOT NULL DEFAULT CURRENT_DATE,
  sold_at DATE,
  status TEXT NOT NULL DEFAULT 'in_stock' CHECK (status IN ('in_stock', 'sold')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.used_phones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on used_phones" ON public.used_phones FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on used_phones" ON public.used_phones FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on used_phones" ON public.used_phones FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on used_phones" ON public.used_phones FOR DELETE USING (true);

-- Sales table
CREATE TABLE public.sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT,
  customer_id UUID REFERENCES public.customers(id),
  subtotal NUMERIC NOT NULL DEFAULT 0,
  discount_percent NUMERIC DEFAULT 0,
  discount_amount NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'card', 'easypaisa', 'jazzcash')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on sales" ON public.sales FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on sales" ON public.sales FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on sales" ON public.sales FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on sales" ON public.sales FOR DELETE USING (true);

-- Sale items table
CREATE TABLE public.sale_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_id UUID NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL,
  total_price NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on sale_items" ON public.sale_items FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on sale_items" ON public.sale_items FOR INSERT WITH CHECK (true);

-- Shop settings table
CREATE TABLE public.shop_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_name TEXT NOT NULL DEFAULT 'MobilePOS Shop',
  phone TEXT,
  email TEXT,
  address TEXT,
  website TEXT,
  logo_url TEXT,
  receipt_show_logo BOOLEAN DEFAULT true,
  receipt_show_cashier BOOLEAN DEFAULT true,
  receipt_show_tax BOOLEAN DEFAULT true,
  receipt_footer TEXT DEFAULT 'Thank you for shopping with us!',
  receipt_size TEXT DEFAULT 'pos',
  tax_enabled BOOLEAN DEFAULT false,
  tax_name TEXT DEFAULT 'Sales Tax',
  tax_rate NUMERIC DEFAULT 17,
  tax_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.shop_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on shop_settings" ON public.shop_settings FOR SELECT USING (true);
CREATE POLICY "Allow public update access on shop_settings" ON public.shop_settings FOR UPDATE USING (true);
CREATE POLICY "Allow public insert access on shop_settings" ON public.shop_settings FOR INSERT WITH CHECK (true);

-- Insert default shop settings
INSERT INTO public.shop_settings (shop_name, phone, address, email) 
VALUES ('MobilePOS Shop', '0300-1234567', 'Shop #123, Mobile Market, Main Boulevard, Lahore', 'info@mobilepos.pk');

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.customers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.repairs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.used_phones;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sales;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sale_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.shop_settings;

-- Function to generate repair job IDs
CREATE OR REPLACE FUNCTION public.generate_repair_job_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.job_id := 'REP-' || LPAD(nextval('repair_job_seq')::TEXT, 3, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE SEQUENCE IF NOT EXISTS repair_job_seq START 1;

CREATE TRIGGER set_repair_job_id
  BEFORE INSERT ON public.repairs
  FOR EACH ROW
  WHEN (NEW.job_id IS NULL OR NEW.job_id = '')
  EXECUTE FUNCTION public.generate_repair_job_id();

-- Function to generate used phone IDs
CREATE OR REPLACE FUNCTION public.generate_phone_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.phone_id := 'UP-' || LPAD(nextval('phone_id_seq')::TEXT, 3, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE SEQUENCE IF NOT EXISTS phone_id_seq START 1;

CREATE TRIGGER set_phone_id
  BEFORE INSERT ON public.used_phones
  FOR EACH ROW
  WHEN (NEW.phone_id IS NULL OR NEW.phone_id = '')
  EXECUTE FUNCTION public.generate_phone_id();