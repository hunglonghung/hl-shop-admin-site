-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Create RLS policies for product images bucket
CREATE POLICY "Product images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'product-images');

CREATE POLICY "Anyone can upload product images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Anyone can update product images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'product-images');

CREATE POLICY "Anyone can delete product images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'product-images');

-- Create categories table for dynamic category management
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  subcategories TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on categories table
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create policies for categories (public read, admin write)
CREATE POLICY "Categories are viewable by everyone" 
ON public.categories 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can manage categories" 
ON public.categories 
FOR ALL 
USING (true);

-- Insert default categories
INSERT INTO public.categories (name, subcategories) VALUES 
('football', ARRAY['Balls', 'Shoes', 'Jerseys', 'Equipment']),
('basketball', ARRAY['Balls', 'Shoes', 'Jerseys', 'Hoops']),
('tennis', ARRAY['Rackets', 'Balls', 'Shoes', 'Apparel']),
('swimming', ARRAY['Swimwear', 'Goggles', 'Equipment', 'Accessories']),
('running', ARRAY['Shoes', 'Apparel', 'Accessories', 'Equipment']),
('fitness', ARRAY['Weights', 'Machines', 'Apparel', 'Accessories']);

-- Create trigger for automatic timestamp updates on categories
CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();