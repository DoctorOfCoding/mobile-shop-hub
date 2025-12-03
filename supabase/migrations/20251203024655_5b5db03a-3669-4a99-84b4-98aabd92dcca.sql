-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  sku TEXT NOT NULL UNIQUE,
  cost_price NUMERIC NOT NULL DEFAULT 0,
  selling_price NUMERIC NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  min_stock INTEGER NOT NULL DEFAULT 10,
  supplier TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Public read/write policies (for now, no auth)
CREATE POLICY "Allow public read access" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON public.products FOR DELETE USING (true);

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Storage policies
CREATE POLICY "Public read access for product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Public upload access for product images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "Public update access for product images" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images');
CREATE POLICY "Public delete access for product images" ON storage.objects FOR DELETE USING (bucket_id = 'product-images');

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;

-- Insert initial data
INSERT INTO public.products (name, category, sku, cost_price, selling_price, stock, min_stock, supplier) VALUES
('iPhone 14 Pro Case', 'Accessories', 'ACC-001', 800, 1500, 45, 10, 'TechHub'),
('Samsung Charger 25W', 'Accessories', 'ACC-002', 1500, 2500, 5, 15, 'SamsungPK'),
('AirPods Pro', 'Accessories', 'ACC-003', 35000, 45000, 8, 5, 'ApplePK'),
('USB-C Cable 2m', 'Accessories', 'ACC-004', 250, 500, 120, 20, 'CableCo'),
('Screen Protector iPhone 15', 'Accessories', 'ACC-005', 400, 800, 3, 10, 'ScreenGuard'),
('Power Bank 20000mAh', 'Accessories', 'ACC-006', 2500, 4500, 15, 8, 'PowerTech'),
('Wireless Earbuds', 'Accessories', 'ACC-007', 2000, 3500, 34, 10, 'AudioMax'),
('Phone Stand Holder', 'Accessories', 'ACC-008', 350, 750, 56, 15, 'TechHub');